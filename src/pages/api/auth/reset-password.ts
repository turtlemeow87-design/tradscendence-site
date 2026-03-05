import type { APIRoute } from 'astro';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

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

  // ── Validate reset_token cookie ─────────────────────────
  const resetToken = cookies.get('reset_token')?.value;
  if (!resetToken) {
    return json(401, { ok: false, error: 'Reset session expired. Please start over.' });
  }

  const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
  let userId: string;

  try {
    const { payload } = await jwtVerify(resetToken, secret);
    if (payload.purpose !== 'reset') {
      return json(401, { ok: false, error: 'Invalid reset token.' });
    }
    userId = payload.sub as string;
  } catch {
    return json(401, { ok: false, error: 'Reset session expired. Please start over.' });
  }

  // ── Dev mode guard ──────────────────────────────────────
  if (import.meta.env.DEV || !import.meta.env.DATABASE_URL) {
    cookies.delete('reset_token', { path: '/' });
    return json(200, { ok: true });
  }

  // ── Parse and validate new password ────────────────────
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const { password } = body;
  if (!password || typeof password !== 'string') {
    return json(400, { ok: false, error: 'Password is required.' });
  }
  if (password.length < 8) {
    return json(400, { ok: false, error: 'Password must be at least 8 characters.' });
  }

  // ── Hash and save new password ──────────────────────────
  const sql = neon(import.meta.env.DATABASE_URL);
  const newHash = await bcrypt.hash(password, 10);

  await sql`UPDATE users SET password_hash = ${newHash} WHERE id = ${userId}`;

  // ── Clean up reset token cookie ─────────────────────────
  cookies.delete('reset_token', { path: '/' });

  return json(200, { ok: true });
};