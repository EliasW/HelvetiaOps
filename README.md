# HelvetiaOps

This project now uses [NextAuth](https://next-auth.js.org/) for authentication. Install the package with:

```bash
npm install next-auth
```

A mock credentials provider is configured under `src/app/api/auth/[...nextauth]/route.ts` and the
app wraps pages with `SessionProvider` in `app/layout.tsx`.

HelvetiaOps — Enterprise Operations Management Portal Frontend-focused Next.js application with role-based access control, internationalization (EN/DE), data-heavy tables, and enterprise UX patterns.
