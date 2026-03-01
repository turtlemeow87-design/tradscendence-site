import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { Resend } from 'resend';

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
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
    return json(401, { ok: false, error: 'Invalid email or password.' });
  }

  // ── Verify password ─────────────────────────────────────
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return json(401, { ok: false, error: 'Invalid email or password.' });
  }

  // ── Check for trusted device cookie ─────────────────────
  const deviceToken = cookies.get('trusted_device')?.value;
  if (deviceToken) {
    const devices = await sql`
      SELECT id, token_hash FROM trusted_devices
      WHERE user_id = ${user.id}
        AND expires_at > now()
      ORDER BY created_at DESC
      LIMIT 10
    `;

    for (const device of devices) {
      const match = await bcrypt.compare(deviceToken, device.token_hash);
      if (match) {
        // Trusted device found — skip OTP, issue JWT directly
        const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
        const token = await new SignJWT({ email: user.email })
          .setProtectedHeader({ alg: 'HS256' })
          .setSubject(String(user.id))
          .setIssuedAt()
          .setExpirationTime('7d')
          .sign(secret);

        cookies.set('auth_token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        });

        return json(200, { ok: true, skipOtp: true });
      }
    }

    // Token didn't match any valid device — clear stale cookie
    cookies.delete('trusted_device', { path: '/' });
  }

  // ── No trusted device — send OTP as usual ───────────────
  await sql`
    UPDATE otp_codes SET used = true
    WHERE user_id = ${user.id} AND used = false
  `;

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