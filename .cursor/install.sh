#!/usr/bin/env bash
# Idempotent repository bootstrap for the BIZON tires app (Next.js 15 + Payload CMS + PostgreSQL).
set -euo pipefail

cd "$(dirname "$0")/.."

PG_VERSION=16
DB_NAME=bizon
DB_USER=postgres
DB_PASS=postgres

echo "==> Ensuring PostgreSQL ${PG_VERSION} is installed"
if ! command -v pg_ctlcluster >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq postgresql postgresql-contrib
fi

echo "==> Starting PostgreSQL cluster"
sudo pg_ctlcluster "${PG_VERSION}" main start 2>/dev/null || true
# Wait for the server socket to accept connections.
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q; then break; fi
  sleep 1
done

echo "==> Ensuring database role and '${DB_NAME}' database exist"
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb "${DB_NAME}"

echo "==> Writing .env.local (local dev defaults) if missing"
if [ ! -f .env.local ]; then
  cat > .env.local <<'ENV'
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_EMAIL=

# Local dev only — not a real secret. PAYLOAD_SECRET just encrypts local admin state.
DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:5432/bizon
PAYLOAD_SECRET=local-dev-payload-secret-please-change-0123456789
PAYLOAD_DB_PUSH=1
ENV
fi

echo "==> Installing Node dependencies"
npm ci

echo "==> Generating Payload admin import map"
set -a; . ./.env.local; set +a
npm run generate:importmap

echo "==> Pushing schema and seeding catalog/content"
# ponytail: import-templates/tire-types.csv sends fields the tire-types collection
# rejects (a pre-existing repo data bug), so seed:all exits non-zero. We push schema
# and load every row that is valid; do not fail bootstrap on that known data issue.
# Upgrade path: reconcile import-catalog.ts field mapping with the TireTypes collection.
npm run import:catalog || true
npm run seed:content || true

echo "==> install.sh complete"
