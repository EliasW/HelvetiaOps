# HelvetiaOps

This project now uses [NextAuth](https://next-auth.js.org/) for authentication. Install the package with:

```bash
npm install next-auth
```

A mock credentials provider is configured under `src/app/api/auth/[...nextauth]/route.ts` and the
app wraps pages with `SessionProvider` in `app/layout.tsx`.

## Protected Routes & Redirects

### Route Protection with Middleware

Server-side middleware in `middleware.ts` protects authenticated routes:

- **Protected routes** — `/dashboard` requires authentication
- **Automatic redirects** — Unauthenticated users accessing protected routes are redirected to `/auth`
- **Server-side enforcement** — Protection happens at the middleware layer, before the page renders

### How It Works

1. User tries to access `/dashboard` without being logged in
2. Middleware checks for valid session
3. If no session exists, user is redirected to `/auth` (login page)
4. After successful login, user is redirected back to `/dashboard`

HelvetiaOps — Enterprise Operations Management Portal Frontend-focused Next.js application with role-based access control, internationalization (EN/DE), data-heavy tables, and enterprise UX patterns.
