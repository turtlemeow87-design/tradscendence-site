import { defineMiddleware } from 'astro:middleware';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const PROTECTED_ROUTES = ['/dashboard'];
const AUTH_PAGES = ['/login', '/verify', '/register', '/reset-password'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, redirect, url } = context;
  const token = cookies.get('auth_token')?.value;

  // Default: no user
  context.locals.user = null;

  // Try to verify JWT if present
  if (token) {
    // Dev mode: accept the dummy token from verify-otp
    if ((import.meta.env.DEV || !import.meta.env.JWT_SECRET) && token === 'dev-token') {
      context.locals.user = { id: '0', email: 'dev@localhost', firstName: 'Dev', lastName: 'User' };
    } else {
      let payload: Record<string, unknown> | null = null;

      try {
        const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
        const { payload: p } = await jwtVerify(token, secret);
        payload = p as Record<string, unknown>;
      } catch {
        // Invalid or expired token — clear it silently
        cookies.delete('auth_token', { path: '/' });
      }

      if (payload) {
        // ── Password change invalidation check ─────────────
        // If the user reset their password after this token was issued,
        // the token is stale and must be rejected.
        let tokenIsValid = true;

        if (!import.meta.env.DEV && import.meta.env.DATABASE_URL) {
          try {
            const sql = neon(import.meta.env.DATABASE_URL);
            const rows = await sql`
              SELECT password_changed_at
              FROM users
              WHERE id = ${payload.sub as string}
            `;
            const changedAt = rows[0]?.password_changed_at;
            if (changedAt) {
              const changedAtMs = new Date(changedAt).getTime();
              const issuedAtMs  = (payload.iat as number) * 1000;
              if (issuedAtMs < changedAtMs) {
                tokenIsValid = false;
                cookies.delete('auth_token', { path: '/' });
              }
            }
          } catch {
            // DB unavailable — fail open so users aren't accidentally locked out
          }
        }

        if (tokenIsValid) {
          context.locals.user = {
            id:        payload.sub as string,
            email:     payload.email as string,
            firstName: (payload.firstName as string) || '',
            lastName:  (payload.lastName as string)  || '',
          };
        }
      }
    }
  }

  // Redirect logged-in users away from login/verify pages
  if (context.locals.user && AUTH_PAGES.some(p => url.pathname.startsWith(p))) {
    return redirect('/dashboard');
  }

  // Protect routes — kick unauthenticated users to login
  const isProtected = PROTECTED_ROUTES.some(r => url.pathname.startsWith(r));
  if (isProtected && !context.locals.user) {
    return redirect(`/login?redirect=${encodeURIComponent(url.pathname)}`);
  }

  return next();
});