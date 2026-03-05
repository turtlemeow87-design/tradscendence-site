import { defineMiddleware } from 'astro:middleware';
import { jwtVerify } from 'jose';

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
      try {
        const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        context.locals.user = {
          id: payload.sub as string,
          email: payload.email as string,
          firstName: (payload.firstName as string) || '',
          lastName: (payload.lastName as string) || '',
        };
      } catch {
        // Invalid or expired token — clear it silently
        cookies.delete('auth_token', { path: '/' });
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