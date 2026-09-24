import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { SCHEMA_VERSION } from "./contract.mjs";
import { createPool } from "./pool.mjs";

const migrationsDirectory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
);

export async function applyMigrations(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const files = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const fileName of files) {
    const version = fileName.replace(/\.sql$/, "");
    const existing = await pool.query(
      "SELECT version FROM schema_migrations WHERE version = $1",
      [version],
    );
    if (existing.rowCount > 0) continue;

    const sql = await readFile(path.join(migrationsDirectory, fileName), "utf8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  return SCHEMA_VERSION;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const pool = createPool();
  try {
    const version = await applyMigrations(pool);
    console.log(`schema ${version}`);
  } finally {
    await pool.end();
  }
}
