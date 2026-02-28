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

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const { email, password } = body;

  if (!email || typeof email !== 'string') {
    return json(400, { ok: false, error: 'Email is required.' });
  }
  if (!password || typeof password !== 'string') {
    return json(400, { ok: false, error: 'Password is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // ── Dev mode guard ──────────────────────────────────────
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, email: cleanEmail, message: 'Dev mode — login skipped.' });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  // ── Find user ───────────────────────────────────────────
  const [user] = await sql`SELECT id, email, password_hash FROM users WHERE email = ${cleanEmail}`;
  if (!user) {
    // Generic message — don't reveal whether email exists
    return json(401, { ok: false, error: 'Invalid email or password.' });
  }

  // ── Verify password ─────────────────────────────────────
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return json(401, { ok: false, error: 'Invalid email or password.' });
  }

  // ── Invalidate any existing unused OTPs for this user ───
  await sql`
    UPDATE otp_codes SET used = true
    WHERE user_id = ${user.id} AND used = false
  `;

  // ── Generate & store new OTP ────────────────────────────
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await sql`
    INSERT INTO otp_codes (user_id, code_hash, expires_at)
    VALUES (${user.id}, ${codeHash}, ${expiresAt})
  `;

  // ── Send OTP email ──────────────────────────────────────
  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Tradscendence <noreply@soundbeyondborders.com>',
      to: cleanEmail,
      subject: 'Your login code — Tradscendence',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #111; color: #F5F1E8; border: 1px solid #C2A45F;">
          <h2 style="color: #C2A45F; margin: 0 0 16px;">Login Code</h2>
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
    console.error('OTP email send failed:', err);
  }

  return json(200, { ok: true, email: cleanEmail });
};