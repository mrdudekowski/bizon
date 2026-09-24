# BIZON main-app

Public website (bizon.ru + BIZON Shop) on **Next.js 15**. No Payload CMS. Published pages and tire directions come from `backend-app` when `BACKEND_URL` is set. Without it, pages stay on code defaults and the catalog stays empty.

Related branches:

- `backend-app` in this tree — the only Postgres writer. See `backend-app/README.md`.
- `frontend-cms` — admin UI. It reads the same API and does not open the database.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `/admin` is not served.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build. Database access stays in `backend-app`. |
| `npm run test` | Vitest unit tests |
| `npm run lint` | ESLint |

## S3 media (read-only)

Set `S3_PUBLIC_URL` (CDN) so asset keys resolve to remote URLs. Upload and auth live in `backend-app` later.

See [AUDIT.md](./AUDIT.md) for architecture notes.
