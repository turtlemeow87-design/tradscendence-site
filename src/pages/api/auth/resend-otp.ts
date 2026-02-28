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

  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, message: 'Dev mode — resend skipped.' });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  // Find user
  const [user] = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
  if (!user) {
    // Don't reveal whether email exists — return success-like message
    return json(200, { ok: true });
  }

  // Rate limit: check if there's an OTP created in the last 30 seconds
  const recent = await sql`
    SELECT id FROM otp_codes
    WHERE user_id = ${user.id}
      AND created_at > now() - interval '30 seconds'
    LIMIT 1
  `;
  if (recent.length > 0) {
    return json(429, { ok: false, error: 'Please wait before requesting another code.' });
  }

  // Invalidate all existing unused OTPs
  await sql`
    UPDATE otp_codes SET used = true
    WHERE user_id = ${user.id} AND used = false
  `;

  // Generate new OTP
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  await sql`
    INSERT INTO otp_codes (user_id, code_hash, expires_at)
    VALUES (${user.id}, ${codeHash}, ${expiresAt})
  `;

  // Send email
  try {
    const resend = new Resend(import.meta.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Tradscendence <noreply@soundbeyondborders.com>',
      to: cleanEmail,
      subject: 'Your new verification code — Tradscendence',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #111; color: #F5F1E8; border: 1px solid #C2A45F;">
          <h2 style="color: #C2A45F; margin: 0 0 16px;">New Verification Code</h2>
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
    console.error('Resend OTP email failed:', err);
  }

  return json(200, { ok: true });
};