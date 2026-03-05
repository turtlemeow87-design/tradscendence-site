import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { ok: false, error: 'Content-Type must be application/json' });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const { email } = body;
  if (!email || typeof email !== 'string') {
    return json(400, { ok: false, error: 'Email is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // ── Dev mode guard ──────────────────────────────────────
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, email: cleanEmail });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  // Look up user — always return success to prevent email enumeration
  const [user] = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
  if (!user) {
    return json(200, { ok: true, email: cleanEmail });
  }

  // Invalidate any existing unused OTPs for this user
  await sql`UPDATE otp_codes SET used = true WHERE user_id = ${user.id} AND used = false`;

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await sql`
    INSERT INTO otp_codes (user_id, code_hash, expires_at)
    VALUES (${user.id}, ${codeHash}, ${expiresAt})
  `;

  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Tradscendence <noreply@soundbeyondborders.com>',
      to: cleanEmail,
      subject: 'Reset your password — Tradscendence',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #111; color: #F5F1E8; border: 1px solid #C2A45F;">
          <h2 style="color: #C2A45F; margin: 0 0 16px;">Password Reset</h2>
          <p style="color: #F5F1E8; margin: 0 0 16px;">Use the code below to reset your password. If you didn't request this, you can safely ignore this email — your password has not changed.</p>
          <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #F5F1E8; margin: 24px 0;">
            ${code}
          </p>
          <p style="color: #aaa; font-size: 14px;">This code expires in 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #C2A45F; margin: 24px 0;" />
          <p style="color: #888; font-size: 12px;">Tradscendence · soundbeyondborders.com</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Password reset email send failed:', err);
  }

  return json(200, { ok: true, email: cleanEmail });
};