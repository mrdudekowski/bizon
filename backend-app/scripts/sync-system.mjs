import { SCHEMA_VERSION } from "../src/contract.mjs";
import { applyMigrations } from "../src/migrate.mjs";
import { createPool } from "../src/pool.mjs";

const backendUrl = (process.env.BACKEND_URL || "http://127.0.0.1:4000").replace(/\/$/, "");

async function readJson(path, init) {
  const response = await fetch(`${backendUrl}${path}`, init);
  const body = await response.json();
  return { status: response.status, body };
}

const pool = createPool();
try {
  await applyMigrations(pool);
} finally {
  await pool.end();
}

const health = await readJson("/health");
if (!health.body.ok || health.body.schemaVersion !== SCHEMA_VERSION || health.body.database !== "bizon") {
  console.error("sync failed: backend health", health);
  process.exit(1);
}

const roundTrip = await readJson("/v1/sync/roundtrip", { method: "POST" });
if (roundTrip.status !== 200 || roundTrip.body.ok !== true) {
  console.error("sync failed: write/read roundtrip", roundTrip);
  process.exit(1);
}

const directions = await readJson("/v1/published/tire-directions");
const longHaul = directions.body.items?.find((item) => item.slug === "long-haul");
if (directions.status !== 200 || longHaul?.id !== "dir-long-haul" || longHaul.name !== "Магистральные") {
  console.error("sync failed: published tire direction", directions);
  process.exit(1);
}

const home = await readJson("/v1/published/pages/home");
if (home.status !== 200 || home.body.key !== "home" || !("snapshot" in home.body)) {
  console.error("sync failed: published page contract", home);
  process.exit(1);
}

const unknownPage = await readJson("/v1/published/pages/not-a-page");
if (unknownPage.status !== 404) {
  console.error("sync failed: unknown page must stay 404", unknownPage);
  process.exit(1);
}

console.log(
  JSON.stringify({
    ok: true,
    schemaVersion: SCHEMA_VERSION,
    database: "bizon",
    backendUrl,
    publishedTireDirections: directions.body.items.length,
  }),
);
