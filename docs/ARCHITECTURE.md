# HelvetiaOps — Architecture & Design Decisions

## Overview

HelvetiaOps is an operations management dashboard built with Next.js 16 (App Router), TypeScript, and Tailwind CSS. It demonstrates production-grade patterns for internationalization, authentication, data fetching, performance optimization, and accessibility.

---

## Architecture Decisions

### 1. Next.js App Router with Server Components

**Decision:** Use the App Router with React Server Components for page-level data fetching and client components for interactivity.

**Why:** Server Components reduce the JavaScript bundle sent to the browser. Pages like the dashboard overview fetch session data and translations on the server, then pass them to client components that handle user interactions. This gives us fast initial page loads while keeping the UI responsive.

**In practice:**
- `src/app/[locale]/dashboard/page.tsx` — Server component that checks auth and fetches translations
- `src/app/components/dashboard/DashboardOverview.tsx` — Client component that fetches API data with TanStack Query

### 2. Internationalization with next-intl

**Decision:** Use `next-intl` with locale-prefixed routes (`/en/dashboard`, `/de/dashboard`) and `localePrefix: 'always'`.

**Why:** Locale in the URL makes the app SEO-friendly, shareable, and bookmarkable in any language. The `always` prefix strategy avoids ambiguity — every URL explicitly declares its language.

**Structure:**
- `src/i18n.ts` — Request-level locale configuration
- `src/messages/en.json`, `src/messages/de.json` — Translation files organized by feature namespace
- `middleware.ts` — Handles locale detection and routing

### 3. Authentication with NextAuth.js

**Decision:** Use NextAuth.js v4 with JWT strategy and credentials provider, combined with middleware-level route protection.

**Why:** JWT sessions are stateless and don't require a database for session storage. The middleware intercepts requests before they reach the page, so unauthenticated users never see protected content — not even a flash of the dashboard.

**Layers:**
- `middleware.ts` — `withAuth` wrapper redirects unauthenticated users at the edge
- `src/app/[locale]/dashboard/page.tsx` — Server-side `getServerSession` as a second check
- Role-based UI: Viewer role gets read-only access (edit buttons hidden, comment input disabled)

### 4. Data Fetching with TanStack Query

**Decision:** Use TanStack Query for all client-side API calls with a global QueryClient configured in a provider.

**Why:** TanStack Query handles caching, deduplication, background refetching, and error/loading states out of the box. This eliminates the need for manual `useEffect` + `useState` patterns and provides a consistent data fetching layer across the app.

**Configuration:**
- `src/lib/queryClient.ts` — Global defaults (5min stale time, 1 retry, no refetch on window focus)
- `src/app/components/QueryProvider.tsx` — Client-side provider
- `src/app/components/dashboard/queries.ts` — Custom hooks wrapping `useQuery` calls

### 5. Component Architecture

**Decision:** Separate reusable UI primitives from feature-specific components.

**Structure:**
```
src/app/components/
  ui/                    ← Reusable primitives (Skeleton, ErrorBanner, EmptyState)
  dashboard/             ← Feature components (DataTable, KPICard, ProjectForm)
  LanguageSwitcher.tsx   ← Shared across all pages
  DashboardHeader.tsx    ← Dashboard-specific layout
```

**Why:** UI primitives like `ErrorBanner` and `Skeleton` are used across multiple features. Keeping them separate from business logic makes them easy to test, document, and reuse.

### 6. Mock API Layer

**Decision:** Build a complete mock REST API using Next.js API routes with simulated latency and random errors.

**Why:** This allows the frontend to be developed and demonstrated independently of any backend. The mock layer simulates real-world conditions (network delays, server errors) so the UI handles all states correctly.

**Features:**
- `src/lib/mock/helpers.ts` — `simulateLatency()` (200-800ms), `shouldSimulateError()` (10% rate)
- `src/lib/mock/data.ts` — Static mock data for 5 users, 3 teams, 4 projects, 7 KPIs
- `src/lib/mock/generateLargeDataset.ts` — Deterministic generator for 10,000+ records

### 7. Virtualized Table for Large Datasets

**Decision:** Use `@tanstack/react-virtual` for rendering large datasets (10k+ rows) with only visible rows in the DOM.

**Why:** Rendering 10,000 table rows creates ~60,000 DOM nodes, causing severe performance degradation. Virtualization keeps the DOM at ~30 nodes regardless of dataset size, maintaining 60fps scrolling.

**Implementation:** `src/app/components/dashboard/VirtualizedTable.tsx` — Uses `useVirtualizer` with absolute positioning and overscan of 10 rows.

### 8. Form Validation with Zod + react-hook-form

**Decision:** Extract Zod schemas into `src/lib/schemas/` and use `@hookform/resolvers/zod` for form validation.

**Why:** Separating the schema from the component makes it independently testable (pure function tests, no React rendering needed). The schema serves as a single source of truth for validation rules that can be shared between client and server.

### 9. Accessibility

**Decision:** Implement ARIA labels, keyboard navigation, and focus management across all interactive components.

**Patterns used:**
- `role="menu"` / `role="menuitem"` with arrow key navigation on dropdown menus
- `aria-sort` on sortable table columns with `Enter`/`Space` activation
- `role="radiogroup"` on the language switcher
- Focus trapping in menus (auto-focus first item on open, return focus to trigger on close)
- Skip-to-content link in the root layout
- `aria-live="polite"` on dynamic content (pagination counts, loading states)

---

## Tradeoffs

### Client-side filtering vs. Server-side filtering

**Chose:** Client-side filtering and sorting for the projects table.

**Tradeoff:** All data must be loaded into memory. This works for datasets up to ~50k rows but wouldn't scale to millions. For a real production app with a database, sorting and filtering should happen server-side with paginated API responses.

**Why this is acceptable:** This is a portfolio demo. Client-side operations provide instant feedback with zero loading spinners, which makes a better demo experience.

### JWT sessions vs. Database sessions

**Chose:** JWT strategy with no database.

**Tradeoff:** Sessions can't be revoked server-side (no "log out all devices" feature). Token size grows with custom claims.

**Why this is acceptable:** The app uses mock authentication. JWT keeps the setup simple with zero infrastructure dependencies.

### `localePrefix: 'always'` vs. `as-needed`

**Chose:** Always prefix URLs with locale.

**Tradeoff:** English users see `/en/dashboard` instead of just `/dashboard`. Slightly longer URLs.

**Why this is acceptable:** Consistency. Every URL is unambiguous about its language. No edge cases with locale detection cookies or Accept-Language headers.

### Virtualization vs. Infinite scroll with pagination

**Chose:** Pure virtualization (load all data, render visible rows) for the "All Projects" view.

**Tradeoff:** Initial load fetches all 10k records at once (~2-5MB). On slow connections, this means a longer initial wait.

**Alternative:** Infinite query (`useInfiniteQuery`) + virtualization would fetch data in pages as the user scrolls. This is the production-grade approach for truly large datasets.

### Mock API with random errors

**Chose:** 10% random error rate on API calls.

**Tradeoff:** Sometimes the dashboard shows error states on first load, which might confuse someone casually browsing the demo.

**Why:** It demonstrates that error handling actually works — retry buttons, error banners, and graceful degradation are all exercised naturally.

### Tailwind CSS without a component library

**Chose:** Raw Tailwind utility classes instead of a UI library like shadcn/ui or Radix.

**Tradeoff:** More verbose markup. Custom implementations of dropdowns, tables, and menus instead of battle-tested library components.

**Why:** Demonstrates the ability to build UI primitives from scratch, which is a stronger portfolio signal than assembling pre-built components.

---

## Future Improvements

### Testing
- Set up Vitest with `@testing-library/react` for component tests (schema validation tests are already passing)
- Add MSW (Mock Service Worker) for intercepting API calls in tests
- Add Playwright for E2E tests covering the full auth → dashboard → project detail flow

### Real Backend Integration
- Replace mock API routes with a real database (PostgreSQL + Prisma)
- Implement server-side pagination, sorting, and filtering
- Add optimistic updates for mutations (create/edit/delete project)

### Performance
- Implement `useInfiniteQuery` + virtualization hybrid for truly large datasets
- Add React Suspense boundaries with streaming for server components
- Implement route-level code splitting for the performance charts (Recharts is heavy)

### State Management
- Add URL-based state for table filters and pagination (shareable filtered views)
- Implement optimistic mutations with TanStack Query's `onMutate` / `onSettled`

### Accessibility
- Add comprehensive screen reader testing with VoiceOver/NVDA
- Implement focus trap for modal dialogs
- Add `prefers-reduced-motion` support for animations

### Internationalization
- Add RTL language support
- Implement pluralization rules for dynamic counts
- Add date/number formatting with `Intl` API per locale

### DevOps
- Add CI pipeline with lint, type-check, and test stages
- Configure Lighthouse CI for performance and accessibility audits
- Add Storybook for component documentation and visual testing

### Features
- Real-time updates with WebSockets or Server-Sent Events for KPI dashboards
- Export functionality (CSV/PDF) for project reports
- Dark mode with `prefers-color-scheme` detection
- Notification system for KPI threshold alerts
