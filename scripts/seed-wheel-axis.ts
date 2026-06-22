/**
 * Seeds WheelTypes (forged only — BIZON MVP) + one demo model and variant.
 *
 * Run: npm run seed:wheel-axis
 * ponytail: cast not seeded until product direction changes — add row in admin when needed.
 */
import { getPayload } from "../src/lib/payload/getPayload";

const FORGED_TYPE = {
  slug: "forged",
  name: "Кованые диски",
  description: "Кованые диски BIZON для грузового и коммерческого транспорта.",
  shortDescription: "Высокопрочные кованые диски",
  sortOrder: 0,
  status: "published" as const,
};

const DEMO_MODEL = {
  slug: "bizon-forged-pro",
  name: "BIZON Forged Pro",
  series: "BIZON",
  designStyle: "Pro",
  material: "Кованый алюминий",
  constructionMethod: "forged" as const,
  shortDescription: "Кованый диск для магистральных осей.",
  fitmentNotes: "Уточняйте PCD и ET под ваш автопарк.",
};

const DEMO_VARIANT = {
  sizeLabel: "22.5×8.25 · 10×335 · ET+120",
  sku: "BIZ-FG-225825-335",
  diameter: 22.5,
  width: 8.25,
  boltHoles: 10,
  pcd: "335",
  offsetET: 120,
  centerBore: 281,
  loadRating: "9000 kg",
  color: "Polished",
  finish: "Polished",
  available: true,
  priceOnRequest: true,
  sortOrder: 0,
  status: "published" as const,
};

console.log("seed-wheel-axis: connecting…");

const payload = await getPayload();

const existingType = await payload.find({
  collection: "wheel-types",
  where: { slug: { equals: FORGED_TYPE.slug } },
  limit: 1,
  depth: 0,
});

let forgedId: number;
if (existingType.docs[0]) {
  const updated = await payload.update({
    collection: "wheel-types",
    id: existingType.docs[0].id,
    data: FORGED_TYPE,
  });
  forgedId = updated.id;
  console.log(`Updated wheel-type: ${FORGED_TYPE.slug}`);
} else {
  const created = await payload.create({
    collection: "wheel-types",
    data: FORGED_TYPE,
  });
  forgedId = created.id;
  console.log(`Created wheel-type: ${FORGED_TYPE.slug}`);
}

const existingModel = await payload.find({
  collection: "wheel-models",
  where: { slug: { equals: DEMO_MODEL.slug } },
  limit: 1,
  depth: 0,
});

const modelData = { ...DEMO_MODEL, wheelType: forgedId, status: "published" as const };

let modelId: number;
if (existingModel.docs[0]) {
  const updated = await payload.update({
    collection: "wheel-models",
    id: existingModel.docs[0].id,
    data: modelData,
  });
  modelId = updated.id;
  console.log(`Updated wheel-model: ${DEMO_MODEL.slug}`);
} else {
  const created = await payload.create({
    collection: "wheel-models",
    data: modelData,
  });
  modelId = created.id;
  console.log(`Created wheel-model: ${DEMO_MODEL.slug}`);
}

const existingVariant = await payload.find({
  collection: "wheel-variants",
  where: { sku: { equals: DEMO_VARIANT.sku } },
  limit: 1,
  depth: 0,
});

const variantData = { ...DEMO_VARIANT, wheelModel: modelId };

if (existingVariant.docs[0]) {
  await payload.update({
    collection: "wheel-variants",
    id: existingVariant.docs[0].id,
    data: variantData,
  });
  console.log(`Updated wheel-variant: ${DEMO_VARIANT.sku}`);
} else {
  await payload.create({
    collection: "wheel-variants",
    data: variantData,
  });
  console.log(`Created wheel-variant: ${DEMO_VARIANT.sku}`);
}

console.log("Done.");
process.exit(0);
