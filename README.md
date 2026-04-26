# HelvetiaOps

Operations management dashboard built with Next.js 16, TypeScript, and Tailwind CSS. Demonstrates production-grade patterns for internationalization, authentication, data visualization, and performance optimization.

**[Live Demo →](https://helvetia-ops.vercel.app)**

---

## Demo Credentials

Any email/password combination works. The role is determined by the email address:

| Email | Password | Role |
|-------|----------|------|
| `admin@demo.com` | `demo` | Admin — full access |
| `manager@demo.com` | `demo` | Manager — can edit projects |
| `viewer@demo.com` | `demo` | Viewer — read-only access |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Authentication:** NextAuth.js v4 (JWT, role-based access)
- **Internationalization:** next-intl (English / German)
- **Data Fetching:** TanStack Query v5
- **Charts:** Recharts
- **Forms:** react-hook-form + Zod validation
- **Virtualization:** @tanstack/react-virtual (10k+ rows)

---

## Features

### Dashboard
- KPI cards with status indicators (on-track, at-risk, off-track)
- Project summary with team and member counts
- Loading skeletons, error banners, empty states

### Performance Analytics
- Line and bar charts for uptime, response time, error rate, deployments, throughput
- Date range filter (7d / 14d / 30d / 90d)
- Comparison with previous period (overlay)

### Projects
- Data table with pagination, sorting, and filtering
- Row actions (view, edit, archive, delete) via portal-based dropdown
- Project detail page with overview and activity timeline
- Role-based access: viewers see read-only UI
- Virtualized table rendering 10,000 rows at 60fps

### Forms
- Project create/edit form with Zod schema validation
- Cross-field validation (end date must be after start date)
- Unsaved changes warning

### Accessibility
- ARIA labels and roles on all interactive components
- Keyboard navigation (arrow keys, Enter, Escape)
- Focus management (auto-focus, focus return on menu close)
- Skip-to-content link
- Screen reader announcements for dynamic content

### Internationalization
- Full English and German translations
- Locale-prefixed routing (`/en/...`, `/de/...`)
- Language switcher with prefetching for instant switching

---

## Project Structure

```
src/
  app/
    [locale]/           ← Locale-prefixed pages
      dashboard/        ← Protected dashboard routes
      auth/             ← Authentication pages
    api/                ← Mock REST API endpoints
    components/
      ui/               ← Reusable primitives (Skeleton, ErrorBanner, EmptyState)
      dashboard/        ← Feature components (DataTable, KPICard, Charts)
  lib/
    mock/               ← Mock data and API helpers
    schemas/            ← Zod validation schemas
  types/                ← TypeScript interfaces (entities, API contracts)
  messages/             ← Translation files (en.json, de.json)
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

---

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed documentation on:
- Architecture decisions and reasoning
- Tradeoffs and alternatives considered
- Future improvements roadmap

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run format` | Format code (Prettier) |
