# Bizon Tires Website

Landing and catalog site for **BIZON** — premium heavy-duty tyres. Built with **Next.js 15**, **React 19**, and **Tailwind CSS v4**.

## Tech stack

- **Next.js 15** — App Router, SSG, API routes, SEO
- **React 19** — UI
- **Tailwind CSS v4** — styling (design tokens in `src/app/globals.css`)
- **shadcn/ui** — UI primitives (`src/components/ui/`)
- **Payload CMS 3.82** — admin at `/admin`, PostgreSQL backend

## Install

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — public site  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — Payload CMS (requires PostgreSQL)

### Payload scripts

```bash
npm run db:up          # PostgreSQL via Docker (port 5433)
npm run generate:types      # Regenerate src/payload-types.ts
npm run generate:importmap  # Regenerate admin import map
npm run payload             # Payload CLI
```

### Troubleshooting `/admin`

If the browser shows **`[ Server ] undefined`**, Payload failed to connect to PostgreSQL (not a React bug).

1. **Start Docker Desktop**, then: `npm run db:up`
2. Ensure `.env.local` matches `docker-compose.yml`:
   ```env
   DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5433/bizon
   PAYLOAD_SECRET=your-secret-at-least-32-characters-long
   ```
3. If you already have PostgreSQL on port **5432**, use port **5433** from Docker or update `DATABASE_URI` with your real credentials.
4. Restart dev server: `npm run dev`
5. Open only one dev server (stop stale processes on port 3000).

If `/admin` shows **React Client Manifest** / `S3ClientUploadHandler` error after S3 setup:

```bash
npm run admin:fix
npm run dev:clean
```

Ensure PostgreSQL is running and `DATABASE_URI` in `.env.local` points to your instance (local **5432** or Docker **5433**).

## Build & production

```bash
npm run build
npm run start
```

## Environment variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Client | Canonical site URL (SEO, sitemap) |
| `NEXT_PUBLIC_API_URL` | Client | API base URL |
| `DATABASE_URI` | Server | PostgreSQL for Payload |
| `PAYLOAD_SECRET` | Server | Payload encryption secret |
| `S3_*` | Server | S3-compatible media storage (see `.env.example`) |
| `TELEGRAM_*`, `SMTP_*` | Server | Request notifications |

See `.env.example` for the full list. **Never expose server secrets with `NEXT_PUBLIC_`.**

## Project structure

```
src/
├── app/
│   ├── (site)/          # Public website (html, SiteShell, pages)
│   ├── (payload)/       # Payload admin + REST/GraphQL API
│   ├── api/requests/    # Contact form API
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── collections/         # Payload collections (Users, …)
├── access/              # Role-based access helpers
├── components/
├── lib/
│   ├── cms/             # Public data layer (mock → Payload in Prompt 06)
│   ├── payload/         # getPayload() server helper
│   └── seo/
payload.config.ts        # Payload CMS config (root)
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/models`, `/models/tbr`, `/models/tbr/[slug]` | Model catalog |
| `/shop`, `/shop/[categorySlug]`, `/shop/product/[productSlug]` | Shop |
| `/tire-iq`, `/tire-iq/[slug]` | Articles |
| `/people-stories`, `/people-stories/[slug]` | Customer stories |
| `/contact` | Contact form |
| `/selection` | Deterministic URL-backed tire selection |
| `/about` | About company |
| `/warranty` | Warranty info |
| `/admin` | Payload CMS admin |
| `/api/requests` | Contact form submission |

## Features

- Responsive layout with explicit grid/flex constraints
- Two-pane burger menu with CSS Module animations
- Single light theme shared by the main site and shop
- Coral for commercial actions, Mint for technical signals and focus, Neutral for the white-first foundation
- Exactly two intentional black homepage accents: tire assortment and BIZON Shop
- Shared floating chrome geometry with surface-specific main-site and Shop content
- Published-CMS-only tire catalog and deterministic, non-AI selection
- Product carousel with touch/drag support
- SEO: metadata, Open Graph, sitemap, robots.txt, JSON-LD placeholders

## Payload CMS

Installed and wired. Data model: [`docs/payload-data-model.md`](docs/payload-data-model.md). Project structure: [`docs/project-structure.md`](docs/project-structure.md).

**Stack:** Payload 3.82 · PostgreSQL · S3 (Timeweb) for media · `/admin`

**Required for admin:**

1. PostgreSQL running (local port **5432** or Docker: `npm run db:up` on **5433**)
2. `.env.local` with `DATABASE_URI`, `PAYLOAD_SECRET`, and `S3_*` vars
3. `npm run dev` → visit `/admin` → create first user

If `/admin` shows `[ Server ] undefined`, check the terminal — usually PostgreSQL auth failed (`28P01`).

**Public site data:** `src/lib/cms/` reads Payload only. Without DB or seed data, catalog pages render empty (CI build passes with no mock layer).

**Next prompts:** Requests API (Telegram/SMTP) → cart → catalog import → shop MVP. See [`docs/bizon_next_payload_prompts/`](docs/bizon_next_payload_prompts/).

## Documentation

- [Client data blockers audit](docs/client-data-blockers-audit.md)
- [Client-independent closeout](docs/implementation/client-independent-closeout.md)
- [Deployment runbook](docs/implementation/deployment-runbook.md)
- [Catalog import runbook](docs/implementation/catalog-import-runbook.md)
- [Notifications runbook](docs/implementation/notifications-runbook.md)
- [Analytics runbook](docs/implementation/analytics-runbook.md)
- [Release checklist](docs/implementation/release-checklist.md)
- [Client blockers registry](docs/implementation/client-blockers.md)
- [Security verification](docs/implementation/security-verification.md)

## Deployment

This app requires a **Node.js** host (Vercel recommended). GitHub Pages static hosting is not supported due to API routes and SSR.

### CI (GitHub Actions)

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

**Level A — Development integrity** (runs on every PR/push to `main`):

1. PostgreSQL 16 service container
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test` — unit/integration (Vitest)
5. `npm run seed:all` — **demo** catalog import + editorial seeds only (not contractual product filling)
6. `npm run verify:db` — minimal schema seed check (`tireTypes ≥ 1`, `shopCategories ≥ 1`)
7. `npm run build` — SSG from seeded DB

Green CI **does not** prove production catalog readiness or real client product data.

**Level C — Production / release readiness** (manual, requires client data + media):

```bash
npm run seed:wheel-axis    # optional: forged designs in CMS
npm run seed:wheel-media   # optional: upload wheel PNGs to Media
npm run verify:release     # alias for verify:shop — blocks on missing CMS product media
```

Locally mirror Level A: `npm run db:up` → set `DATABASE_URI` (port **5433**) → `npm run seed:all` → `npm run build`.

See `docs/implementation/security-verification.md` and `docs/implementation/client-independent-baseline.md`.

### E2E (Playwright)

Requires a production build first:

```bash
npm run build
npm run test:e2e:install   # once per machine
npm run test:e2e
```

### Production env

- `DATABASE_URI`, `PAYLOAD_SECRET` — required
- `NEXT_PUBLIC_SITE_URL` — canonical site URL for SEO/sitemap
- `TELEGRAM_*` — request notifications (optional)
- `SMTP_*`, `REQUESTS_EMAIL_TO` — optional; nodemailer transport in `src/lib/notifications/email.ts`
- `API_RATE_LIMIT_*` — optional; public write API throttling (see `.env.example`)

## License

ISC
