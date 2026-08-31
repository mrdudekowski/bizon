import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.LOCAL_SITE_URL || "http://localhost:3001";
const collections = [
  "pages",
  "tire-types",
  "tire-models",
  "tire-variants",
  "wheel-types",
  "wheel-models",
  "wheel-variants",
];

await mkdir("src/lib/content/local", { recursive: true });
for (const collection of collections) {
  const response = await fetch(`${base}/api/${collection}?depth=2&limit=100`);
  if (!response.ok) throw new Error(`${collection}: HTTP ${response.status}`);
  const payload = await response.json();
  const docs = Array.isArray(payload.docs) ? payload.docs : [];
  await writeFile(
    `src/lib/content/local/${collection}.json`,
    `${JSON.stringify(docs, null, 2)}\n`,
    "utf8",
  );
  console.log(`${collection}: ${docs.length}`);
}
