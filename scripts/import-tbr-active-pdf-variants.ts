import { getPayload } from "../src/lib/payload/getPayload";

const payload = await getPayload();

const rows = [
  {
    model: "dsr158",
    sizeRaw: "12.00R20",
    plyRatingPr: 20,
    pressureSingleKpa: 900,
    pressureDualKpa: 900,
    maxLoadSingleKg: 1814,
    maxLoadDualKg: 1656,
    loadIndexSingle: 156,
    loadIndexDual: 153,
    speedSymbol: "J" as const,
    overallDiameterMm: 1125,
    sectionWidthMm: 315,
    rimDiameterIn: 20,
    standardRimIn: 8.5,
    treadDepthMm: 18,
  },
  {
    model: "dsr188",
    sizeRaw: "12.00R20",
    plyRatingPr: 20,
    pressureSingleKpa: 900,
    pressureDualKpa: 900,
    maxLoadSingleKg: 1814,
    maxLoadDualKg: 1656,
    loadIndexSingle: 156,
    loadIndexDual: 153,
    speedSymbol: "K" as const,
    overallDiameterMm: 1125,
    sectionWidthMm: 315,
    rimDiameterIn: 20,
    standardRimIn: 8.5,
    treadDepthMm: 17.5,
  },
] as const;

for (const row of rows) {
  const model = await payload.find({ collection: "tire-models", where: { slug: { equals: row.model } }, limit: 1, depth: 0 });
  const modelId = model.docs[0]?.id;
  if (!modelId) throw new Error(`TBR model not found: ${row.model}`);

  const existing = await payload.find({
    collection: "tire-variants",
    where: { and: [{ tireModel: { equals: modelId } }, { sizeRaw: { equals: row.sizeRaw } }] },
    limit: 1,
    depth: 0,
  });

  const data = {
    ...row,
    tireModel: modelId,
    availabilityStatus: "on_request" as const,
    status: "published" as const,
  };

  if (existing.docs[0]) {
    await payload.update({ collection: "tire-variants", id: existing.docs[0].id, data });
    console.log(`Updated ${row.model} ${row.sizeRaw}`);
  } else {
    await payload.create({ collection: "tire-variants", data });
    console.log(`Created ${row.model} ${row.sizeRaw}`);
  }
}

console.log(`Imported ${rows.length} confirmed active TBR variants.`);
