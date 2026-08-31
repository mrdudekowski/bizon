import { readFile } from "node:fs/promises";

import { getPayload } from "../src/lib/payload/getPayload";
import { BIZON_TBR_CATALOG_MANIFEST } from "../src/lib/catalog/bizonTbrCatalogManifest";

type CsvRow = {
  modelCode: string;
  sizeRaw: string;
  plyRatingPr: string;
  pressureSingleKpa: string;
  pressureDualKpa: string;
  maxLoadSingleLb: string;
  maxLoadDualLb: string;
  loadIndexSingle: string;
  loadIndexDual: string;
  speedSymbol: "B" | "F" | "G" | "J" | "K" | "L" | "M";
  overallDiameterMm: string;
  sectionWidthMm: string;
  standardRimIn: string;
};

function parseCsv(text: string): CsvRow[] {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const columns = header.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(columns.map((column, index) => [column, values[index] ?? ""])) as unknown as CsvRow;
  });
}

function numberOrUndefined(value: string) {
  return value ? Number(value) : undefined;
}

function poundsToKg(value: string) {
  return value ? Math.round(Number(value) * 0.45359237) : undefined;
}

const csv = await readFile("import-templates/bizon-tbr-pdf-variants-normalized.csv", "utf8");
const rows = parseCsv(csv);
const payload = await getPayload();
const skipped: string[] = [];
let created = 0;
let updated = 0;

for (const row of rows) {
  const manifest = BIZON_TBR_CATALOG_MANIFEST.find((entry) => entry.code === row.modelCode);
  if (!manifest) {
    skipped.push(`${row.modelCode} ${row.sizeRaw}: not in manifest`);
    continue;
  }

  const model = await payload.find({ collection: "tire-models", where: { slug: { equals: row.modelCode.toLowerCase() } }, limit: 1, depth: 0 });
  const modelId = model.docs[0]?.id;
  if (!modelId) {
    skipped.push(`${row.modelCode} ${row.sizeRaw}: model not found`);
    continue;
  }

  const existing = await payload.find({
    collection: "tire-variants",
    where: { and: [{ tireModel: { equals: modelId } }, { sizeRaw: { equals: row.sizeRaw } }] },
    limit: 1,
    depth: 0,
  });

  const data = {
    tireModel: modelId,
    sizeRaw: row.sizeRaw,
    plyRatingPr: numberOrUndefined(row.plyRatingPr),
    pressureSingleKpa: numberOrUndefined(row.pressureSingleKpa),
    pressureDualKpa: numberOrUndefined(row.pressureDualKpa),
    maxLoadSingleKg: poundsToKg(row.maxLoadSingleLb),
    maxLoadDualKg: poundsToKg(row.maxLoadDualLb),
    loadIndexSingle: numberOrUndefined(row.loadIndexSingle),
    loadIndexDual: numberOrUndefined(row.loadIndexDual),
    speedSymbol: row.speedSymbol,
    overallDiameterMm: numberOrUndefined(row.overallDiameterMm),
    sectionWidthMm: numberOrUndefined(row.sectionWidthMm),
    rimDiameterIn: Number(row.sizeRaw.match(/R(\d+(?:\.\d+)?)/)?.[1] ?? 0),
    standardRimIn: numberOrUndefined(row.standardRimIn),
    availabilityStatus: "on_request" as const,
    status: manifest.activeOnSite ? ("published" as const) : ("draft" as const),
  };

  if (existing.docs[0]) {
    await payload.update({ collection: "tire-variants", id: existing.docs[0].id, data });
    updated += 1;
  } else {
    await payload.create({ collection: "tire-variants", data });
    created += 1;
  }
}

console.log(`Imported normalized TBR variants. Created: ${created}; updated: ${updated}; skipped: ${skipped.length}`);
for (const item of skipped) console.log(`Skipped: ${item}`);
