import { getPayload } from "../src/lib/payload/getPayload";

import { BIZON_TBR_CATALOG_MANIFEST } from "../src/lib/catalog/bizonTbrCatalogManifest";

const payload = await getPayload();
const tbrType = await payload.find({ collection: "tire-types", where: { slug: { equals: "tbr" } }, limit: 1, depth: 0 });
const tireType = tbrType.docs[0]?.id;
if (!tireType) throw new Error("TBR tire type not found");

const inactive = BIZON_TBR_CATALOG_MANIFEST.filter((entry) => !entry.activeOnSite);
let created = 0;
let updated = 0;

for (const entry of inactive) {
  const slug = entry.code.toLowerCase();
  const existing = await payload.find({ collection: "tire-models", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
  const data = {
    slug,
    name: entry.code,
    modelCode: entry.code,
    tireType,
    shortDescription: "TBR-модель из технического контура BIZON. Характеристики требуют заполнения по каталогу.",
    status: "draft" as const,
  };

  if (existing.docs[0]) {
    await payload.update({ collection: "tire-models", id: existing.docs[0].id, data });
    updated += 1;
  } else {
    await payload.create({ collection: "tire-models", data });
    created += 1;
  }
}

console.log(`Prepared inactive TBR models. Created: ${created}; updated: ${updated}; total: ${inactive.length}`);
