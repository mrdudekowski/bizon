import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(filePath) {
  try {
    for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq < 0) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvFile(resolve(process.cwd(), ".env.local"));
loadEnvFile(resolve(process.cwd(), ".env"));

const { getPayload } = await import("payload");
const config = (await import("../payload.config.ts")).default;
const payload = await getPayload({ config });

const models = await payload.find({
  collection: "tire-models",
  limit: 500,
  depth: 1,
  overrideAccess: true,
});
const media = await payload.find({
  collection: "media",
  limit: 500,
  depth: 0,
  overrideAccess: true,
});

const mediaRows = media.docs.map((d) => ({
  id: d.id,
  filename: d.filename,
  alt: d.alt,
  mimeType: d.mimeType,
  createdAt: d.createdAt,
  related: d.relatedTo || d.prefix || null,
}));

const tireNameRe =
  /dsr|tbr|otr|tire|tyre|shin|шина|radial|steer|drive|trailer|doublestar/i;

const out = {
  databaseUriHost: (() => {
    try {
      const u = new URL(process.env.DATABASE_URI || "");
      return `${u.hostname}:${u.port || "5432"}${u.pathname}`;
    } catch {
      return "(unparsed)";
    }
  })(),
  tireModels: models.totalDocs,
  tireModelSlugs: models.docs.map((d) => d.slug).sort(),
  mediaTotal: media.totalDocs,
  mediaFilenames: mediaRows.map((r) => r.filename).sort(),
  tireLikeMedia: mediaRows.filter(
    (r) =>
      tireNameRe.test(String(r.filename || "")) ||
      tireNameRe.test(String(r.alt || "")),
  ),
};

writeFileSync(
  resolve(process.cwd(), "scripts/_find-tires.out.json"),
  JSON.stringify(out, null, 2),
);
console.log("ok", out.tireModels, out.mediaTotal, out.tireLikeMedia.length);
process.exit(0);
