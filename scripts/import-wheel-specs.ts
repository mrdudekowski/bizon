/** Import normalized wheel specifications without replacing richer CMS data. */
import path from "node:path";
import fs from "node:fs";

import type { Payload } from "payload";

import { getPayload } from "../src/lib/payload/getPayload";
import { parseWheelSpecsCsv, type WheelSpecRow } from "./lib/wheelSpecs";

const args = process.argv.slice(2);
const fileArgIndex = args.indexOf("--file");
const inputFile = fileArgIndex >= 0 ? args[fileArgIndex + 1] : undefined;
const dryRun = args.includes("--dry-run") || process.env.DRY_RUN === "1";

if (!inputFile) {
  throw new Error("Usage: npm run import:wheels:specs -- --file <csv> [--dry-run]");
}

type Stats = { models: number; variants: number; created: number; updated: number; errors: string[] };

function toSlug(modelCode: string): string {
  return modelCode.trim().toLowerCase();
}

function modelData(row: WheelSpecRow) {
  return {
    name: row.modelCode,
    slug: toSlug(row.modelCode),
    status: "published" as const,
    publishedAt: new Date().toISOString(),
  };
}

function variantData(row: WheelSpecRow, modelId: number) {
  return {
    wheelModel: modelId,
    sizeLabel: row.sizeLabel,
    width: row.widthJ,
    diameter: row.diameterInches,
    boltHoles: row.boltCount,
    pcd: `${row.boltCount}×${row.pcdMm}`,
    pcdMm: row.pcdMm,
    offsetET: row.offsetEtMm,
    centerBore: row.centerBoreMm,
    color: row.color,
    fastenerType: row.fastenerType,
    fastenerMaterial: row.fastenerMaterial,
    sourceSpecification: row.sourceSpecification,
    internalReference: row.internalReference,
    manufacturingMarkings: row.manufacturingMarkings,
    manufacturingNotes: row.manufacturingNotes,
    status: "published" as const,
    publishedAt: new Date().toISOString(),
  };
}

async function findForgedType(payload: Payload): Promise<number> {
  const result = await payload.find({
    collection: "wheel-types",
    where: { slug: { equals: "forged" } },
    limit: 1,
    depth: 0,
  });
  const id = result.docs[0]?.id;
  if (!id) throw new Error('Missing wheel type "forged". Run the wheel type seed first.');
  return Number(id);
}

async function findOrCreateModel(payload: Payload, row: WheelSpecRow, wheelTypeId: number, stats: Stats): Promise<number> {
  const slug = toSlug(row.modelCode);
  const result = await payload.find({ collection: "wheel-models", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const existing = result.docs[0];
  if (dryRun) {
    console.log(`[dry-run] ${existing ? "update" : "create"} wheel-model ${slug}`);
    stats.models += 1;
    return Number(existing?.id ?? -1);
  }

  if (existing) {
    await payload.update({ collection: "wheel-models", id: existing.id, data: { name: row.modelCode } } as Parameters<Payload["update"]>[0]);
    stats.updated += 1;
    return Number(existing.id);
  }

  const created = await payload.create({
    collection: "wheel-models",
    data: { ...modelData(row), wheelType: wheelTypeId },
  } as Parameters<Payload["create"]>[0]);
  stats.created += 1;
  return Number(created.id);
}

async function upsertVariant(payload: Payload, row: WheelSpecRow, modelId: number, stats: Stats): Promise<void> {
  const existingResult = modelId > 0
    ? await payload.find({
        collection: "wheel-variants",
        where: {
          and: [
            { wheelModel: { equals: modelId } },
            { width: { equals: row.widthJ } },
            { diameter: { equals: row.diameterInches } },
            { boltHoles: { equals: row.boltCount } },
            { pcdMm: { equals: row.pcdMm } },
            { offsetET: { equals: row.offsetEtMm } },
            { centerBore: { equals: row.centerBoreMm } },
          ],
        },
        limit: 1,
        depth: 0,
      })
    : { docs: [] };
  const existing = existingResult.docs[0];
  const label = `${row.modelCode}/${row.variantKey}`;
  if (dryRun) {
    console.log(`[dry-run] ${existing ? "update" : "create"} wheel-variant ${label}`);
    stats.variants += 1;
    return;
  }

  const data = variantData(row, modelId);
  if (existing) {
    await payload.update({ collection: "wheel-variants", id: existing.id, data } as Parameters<Payload["update"]>[0]);
    stats.updated += 1;
  } else {
    await payload.create({ collection: "wheel-variants", data } as Parameters<Payload["create"]>[0]);
    stats.created += 1;
  }
  stats.variants += 1;
}

async function main() {
  const sourceText = fs.readFileSync(path.resolve(inputFile), "utf8");
  const parsed = parseWheelSpecsCsv(sourceText);
  if (parsed.errors.length) throw new Error(parsed.errors.join("\n"));
  if (parsed.conflicts.length) console.warn(`Conflicts requiring review:\n- ${parsed.conflicts.join("\n- ")}`);

  const stats: Stats = { models: 0, variants: 0, created: 0, updated: 0, errors: [] };
  const payload = await getPayload();
  const wheelTypeId = await findForgedType(payload);
  const modelIds = new Map<string, number>();

  for (const row of parsed.rows) {
    let modelId = modelIds.get(row.modelCode);
    if (modelId == null) {
      modelId = await findOrCreateModel(payload, row, wheelTypeId, stats);
      modelIds.set(row.modelCode, modelId);
    }
    await upsertVariant(payload, row, modelId, stats);
  }

  console.log(JSON.stringify({ dryRun, modelCodes: modelIds.size, variants: stats.variants, created: stats.created, updated: stats.updated, conflicts: parsed.conflicts.length }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
