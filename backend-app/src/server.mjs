import { createServer } from "node:http";

import { isPageKey, SCHEMA_VERSION } from "./contract.mjs";
import {
  listPublishedTireDirections,
  readDatabaseName,
  readPublishedPage,
  readSchemaVersion,
  runSyncRoundTrip,
} from "./documents.mjs";
import { applyMigrations } from "./migrate.mjs";
import { createPool } from "./pool.mjs";

const port = Number(process.env.PORT || 4000);
const pool = createPool();

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/health") {
      const [database, schemaVersion] = await Promise.all([
        readDatabaseName(pool),
        readSchemaVersion(pool),
      ]);
      const ok = schemaVersion === SCHEMA_VERSION && database === "bizon";
      sendJson(response, ok ? 200 : 503, {
        ok,
        service: "backend-app",
        database,
        schemaVersion,
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/v1/published/tire-directions") {
      sendJson(response, 200, { items: await listPublishedTireDirections(pool) });
      return;
    }

    const pageMatch = url.pathname.match(/^\/v1\/published\/pages\/([^/]+)$/);
    if (request.method === "GET" && pageMatch) {
      const key = decodeURIComponent(pageMatch[1]);
      if (!isPageKey(key)) {
        sendJson(response, 404, { error: "unknown_page" });
        return;
      }
      sendJson(response, 200, { key, snapshot: await readPublishedPage(pool, key) });
      return;
    }

    if (request.method === "POST" && url.pathname === "/v1/sync/roundtrip") {
      const ok = await runSyncRoundTrip(pool);
      sendJson(response, ok ? 200 : 500, { ok });
      return;
    }

    sendJson(response, 404, { error: "not_found" });
  } catch (error) {
    sendJson(response, 500, { error: "backend_failed", message: error.message });
  }
});

await applyMigrations(pool);
server.listen(port, "0.0.0.0", () => {
  console.log(`backend-app listening on ${port}`);
});
