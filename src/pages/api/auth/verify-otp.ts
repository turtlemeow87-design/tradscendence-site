import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import crypto from 'node:crypto';

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

  let body: { email?: string; code?: string; rememberDevice?: boolean; mode?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const { email, code, rememberDevice, mode } = body;
  const isReset = mode === 'reset';

  if (!email || typeof email !== 'string') {
    return json(400, { ok: false, error: 'Email is required.' });
  }
  if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
    return json(400, { ok: false, error: 'A 6-digit code is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  // ── Dev mode guard ──────────────────────────────────────
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    if (isReset) {
      cookies.set('reset_token', 'dev-reset-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      });
      return json(200, { ok: true, mode: 'reset' });
    }
    cookies.set('auth_token', 'dev-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return json(200, { ok: true });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  // ── Find user (now including name fields) ───────────────
  const [user] = await sql`
    SELECT id, email, first_name, last_name
    FROM users WHERE email = ${cleanEmail}
  `;
  if (!user) {
    return json(401, { ok: false, error: 'Invalid email or code.' });
  }

  // ── Find valid (unused, not expired) OTP codes ──────────
  const otpRows = await sql`
    SELECT id, code_hash FROM otp_codes
    WHERE user_id = ${user.id}
      AND used = false
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 5
  `;

  if (otpRows.length === 0) {
    return json(401, { ok: false, error: 'Code expired or already used. Please request a new one.' });
  }

  // ── Check submitted code against stored hashes ──────────
  let matchedOtpId: number | null = null;
  for (const row of otpRows) {
    const match = await bcrypt.compare(cleanCode, row.code_hash);
    if (match) {
      matchedOtpId = row.id;
      break;
    }
  }

  if (!matchedOtpId) {
    return json(401, { ok: false, error: 'Incorrect code. Please try again.' });
  }

  // ── Mark OTP as used ────────────────────────────────────
  await sql`UPDATE otp_codes SET used = true WHERE id = ${matchedOtpId}`;

  const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);

  // ── Password reset mode: issue short-lived reset token ──
  if (isReset) {
    const resetToken = await new SignJWT({ purpose: 'reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(user.id))
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    cookies.set('reset_token', resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    return json(200, { ok: true, mode: 'reset' });
  }

  // ── Normal login mode: issue full auth JWT ───────────────
  const token = await new SignJWT({
    email: user.email,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
  })
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

  // ── Remember this device (if requested) ─────────────────
  if (rememberDevice) {
    const deviceToken = crypto.randomBytes(32).toString('hex');
    const deviceTokenHash = await bcrypt.hash(deviceToken, 10);
    const deviceExpiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const userAgent = request.headers.get('user-agent') || 'Unknown device';
    const label = userAgent.length > 100 ? userAgent.slice(0, 100) + '…' : userAgent;

    await sql`
      INSERT INTO trusted_devices (user_id, token_hash, label, expires_at)
      VALUES (${user.id}, ${deviceTokenHash}, ${label}, ${deviceExpiry})
    `;

    cookies.set('trusted_device', deviceToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
    });
  }

  return json(200, { ok: true });
};