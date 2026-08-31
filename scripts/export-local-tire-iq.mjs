import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.LOCAL_SITE_URL || "http://localhost:3001";
const response = await fetch(`${base}/api/tire-iq-articles?depth=1&limit=100&sort=-publishedAt`);
if (!response.ok) throw new Error(`Tire IQ export failed: HTTP ${response.status}`);

const payload = await response.json();
const docs = Array.isArray(payload.docs) ? payload.docs : [];
if (!docs.length) throw new Error("Tire IQ export returned no articles");

await mkdir("src/lib/content/local", { recursive: true });
await writeFile(
  "src/lib/content/local/tireIqArticles.json",
  `${JSON.stringify(docs, null, 2)}\n`,
  "utf8",
);
console.log(`Exported ${docs.length} Tire IQ articles`);
