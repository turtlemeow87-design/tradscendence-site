import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import { jwtVerify, SignJWT } from 'jose';

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const VALID_PREFIXES = ['Mr.', 'Mrs.', 'Ms.', 'none'];

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Auth check ──────────────────────────────────────────
  const token = cookies.get('auth_token')?.value;
  if (!token) return json(401, { ok: false, error: 'Not authenticated' });

  let userId: string;
  let userEmail: string;
  try {
    const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    userId = payload.sub as string;
    userEmail = payload.email as string;
  } catch {
    return json(401, { ok: false, error: 'Invalid or expired session' });
  }

  // ── Parse body ──────────────────────────────────────────
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json(415, { ok: false, error: 'Content-Type must be application/json' });
  }

  let body: { firstName?: string; lastName?: string; prefix?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim().slice(0, 80) : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim().slice(0, 80) : '';
  const prefix = typeof body.prefix === 'string' ? body.prefix.trim() : '';

  if (!firstName) return json(400, { ok: false, error: 'First name is required.' });
  if (!lastName) return json(400, { ok: false, error: 'Last name is required.' });
  if (!prefix || !VALID_PREFIXES.includes(prefix)) {
    return json(400, { ok: false, error: 'Please select a valid prefix.' });
  }

  // ── Dev mode guard ──────────────────────────────────────
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    return json(200, { ok: true, message: 'Dev mode — profile save skipped.' });
  }

  const sql = neon(import.meta.env.DATABASE_URL);

  // ── Check if prefix is already set (one-time only) ──────
  const [existing] = await sql`SELECT prefix FROM users WHERE id = ${userId}`;
  if (existing?.prefix) {
    // Prefix already locked — only allow name updates
    await sql`
      UPDATE users
      SET first_name = ${firstName}, last_name = ${lastName}
      WHERE id = ${userId}
    `;
  } else {
    // First time — save everything including prefix
    await sql`
      UPDATE users
      SET first_name = ${firstName}, last_name = ${lastName}, prefix = ${prefix}
      WHERE id = ${userId}
    `;
  }

  // ── Refresh JWT with updated names ──────────────────────
  const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
  const newToken = await new SignJWT({
    email: userEmail,
    firstName,
    lastName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  cookies.set('auth_token', newToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return json(200, { ok: true });
};