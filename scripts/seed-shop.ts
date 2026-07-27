import { getPayload } from "../src/lib/payload/getPayload";

const CATEGORY_SEEDS = [
  { slug: "accessories", name: "Accessories", description: "Автомобильные аксессуары и дорожные детали BIZON.", sortOrder: 0 },
  { slug: "outdoor", name: "Outdoor", description: "Снаряжение BIZON для маршрута, стоянки и отдыха вне города.", sortOrder: 1 },
];

console.log("seed-shop: connecting…");
const payload = await getPayload();

for (const seed of CATEGORY_SEEDS) {
  const existing = await payload.find({
    collection: "shop-categories",
    where: { slug: { equals: seed.slug } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs[0]) {
    console.log(`Kept existing category unchanged: ${seed.slug}`);
  } else {
    await payload.create({
      collection: "shop-categories",
      data: { ...seed, status: "published", showInMenu: true, showOnShopHome: true },
    });
    console.log(`Created category: ${seed.slug}`);
  }
}

console.log("Done. Products are never seeded: add only approved real products in Payload Admin.");
process.exit(0);
