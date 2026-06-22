/**
 * Seeds 3 published TBR tire models (dev/test).
 *
 * Run: npm run seed:tbr-models
 * Prerequisite: npm run seed:tire-axis (TBR type must exist)
 */
import { getPayload } from "../src/lib/payload/getPayload";

const TBR_MODEL_SEEDS = [
  {
    slug: "dsr158",
    name: "DSR158",
    series: "DOUBLESTAR",
    applicationCategory: "long_haul" as const,
    application: "Магистральные перевозки, рулевая ось",
    axlePosition: "Steer",
    treadType: "Rib",
    shortDescription: "Radial TBR для магистральных маршрутов и рулевой оси.",
  },
  {
    slug: "dsr177",
    name: "DSR177",
    series: "DOUBLESTAR",
    applicationCategory: "regional" as const,
    application: "Региональные маршруты, смешанный асфальт",
    axlePosition: "Drive",
    treadType: "Mixed",
    shortDescription: "Универсальная regional TBR для автопарков смешанного профиля.",
  },
  {
    slug: "dsr188",
    name: "DSR188",
    series: "DOUBLESTAR",
    applicationCategory: "regional" as const,
    application: "Региональная и пригородная эксплуатация",
    axlePosition: "Trailer",
    treadType: "Rib",
    shortDescription: "Regional TBR для прицепных осей и смешанных маршрутов.",
  },
];

console.log("seed-tbr-models: connecting…");

const payload = await getPayload();

const tbrType = await payload.find({
  collection: "tire-types",
  where: { slug: { equals: "tbr" } },
  limit: 1,
  depth: 0,
});

const tbrId = tbrType.docs[0]?.id;
if (!tbrId) {
  console.error("TBR tire type not found. Run: npm run seed:tire-axis");
  process.exit(1);
}

let created = 0;
let updated = 0;

for (const seed of TBR_MODEL_SEEDS) {
  const existing = await payload.find({
    collection: "tire-models",
    where: { slug: { equals: seed.slug } },
    limit: 1,
    depth: 0,
  });

  const data = {
    ...seed,
    tireType: tbrId,
    status: "published" as const,
  };

  if (existing.docs[0]) {
    await payload.update({
      collection: "tire-models",
      id: existing.docs[0].id,
      data,
    });
    updated += 1;
    console.log(`Updated tire-model: ${seed.slug}`);
  } else {
    await payload.create({
      collection: "tire-models",
      data,
    });
    created += 1;
    console.log(`Created tire-model: ${seed.slug}`);
  }
}

console.log(`Done. Created: ${created}, updated: ${updated}, total seeds: ${TBR_MODEL_SEEDS.length}`);

const dsr158 = await payload.find({
  collection: "tire-models",
  where: { slug: { equals: "dsr158" } },
  limit: 1,
  depth: 0,
});

const modelId = dsr158.docs[0]?.id;
if (modelId) {
  const variantSeeds = [
    { size: "12.00R20", rimDiameter: 20, loadIndex: "154/150", speedIndex: "K", plyRating: "18PR", sortOrder: 0 },
    { size: "315/80R22.5", rimDiameter: 22.5, loadIndex: "154/150", speedIndex: "L", plyRating: "16PR", sortOrder: 1 },
  ];

  for (const variant of variantSeeds) {
    const existing = await payload.find({
      collection: "tire-variants",
      where: {
        and: [
          { tireModel: { equals: modelId } },
          { size: { equals: variant.size } },
        ],
      },
      limit: 1,
      depth: 0,
    });

    const data = {
      ...variant,
      tireModel: modelId,
      available: true,
      priceOnRequest: true,
      status: "published" as const,
    };

    if (existing.docs[0]) {
      await payload.update({ collection: "tire-variants", id: existing.docs[0].id, data });
      console.log(`Updated variant: ${variant.size}`);
    } else {
      await payload.create({ collection: "tire-variants", data });
      console.log(`Created variant: ${variant.size}`);
    }
  }
}

process.exit(0);
