import { randomUUID } from "node:crypto";

import { isPublishedTireDirection } from "./contract.mjs";

export async function listPublishedTireDirections(pool) {
  const result = await pool.query(
    `SELECT published_snapshot
     FROM documents
     WHERE kind = 'tire_direction'
       AND hidden = false
       AND published_snapshot IS NOT NULL
     ORDER BY slug`,
  );
  return result.rows
    .map((row) => row.published_snapshot)
    .filter(isPublishedTireDirection);
}

export async function readPublishedPage(pool, key) {
  const result = await pool.query(
    `SELECT published_snapshot
     FROM documents
     WHERE kind = 'page' AND slug = $1 AND hidden = false`,
    [key],
  );
  const snapshot = result.rows[0]?.published_snapshot ?? null;
  if (snapshot !== null && (typeof snapshot !== "object" || Array.isArray(snapshot))) {
    return null;
  }
  return snapshot;
}

export async function runSyncRoundTrip(pool) {
  const id = `sync-probe-${randomUUID()}`;
  const slug = id;
  const draft = { echo: "bizon-sync" };
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO documents (id, kind, slug, draft, published_snapshot, hidden, slug_locked)
       VALUES ($1, 'sync_probe', $2, $3::jsonb, $3::jsonb, false, false)`,
      [id, slug, JSON.stringify(draft)],
    );
    const read = await client.query(
      "SELECT published_snapshot FROM documents WHERE id = $1",
      [id],
    );
    await client.query("DELETE FROM documents WHERE id = $1", [id]);
    await client.query("COMMIT");
    const snapshot = read.rows[0]?.published_snapshot;
    return snapshot?.echo === "bizon-sync";
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function readSchemaVersion(pool) {
  const result = await pool.query(
    "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1",
  );
  return result.rows[0]?.version ?? null;
}

export async function readDatabaseName(pool) {
  const result = await pool.query("SELECT current_database() AS name");
  return result.rows[0]?.name ?? "";
}
