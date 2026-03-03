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

## Roles & Permissions

This project defines three built-in roles:

- `admin` — full access, can perform administrative actions
- `manager` — can manage resources and users, but not full admin tasks
- `viewer` — read-only access to reports and dashboards

Permissions are available via helpers in `src/utils/permissions.ts` and a small `Can` component at `src/components/Can.tsx` which guards UI actions. Example usage in the dashboard:

```tsx
<Can minRole="manager">
	<button>Manage Users</button>
</Can>
```

Roles are assigned by the mock credentials provider:

- emails containing `admin` → `admin` role
- emails containing `manager` or `man.` → `manager` role
- all others → `viewer` role

Roles are stored in the JWT and surfaced as `session.user.role` on the client.

HelvetiaOps — Enterprise Operations Management Portal Frontend-focused Next.js application with role-based access control, internationalization (EN/DE), data-heavy tables, and enterprise UX patterns.
