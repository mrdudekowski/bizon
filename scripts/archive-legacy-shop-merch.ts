/**
 * Archives the confirmed legacy Shop merch placeholder without deleting data.
 * Idempotent and deliberately refuses to touch unexpected products.
 *
 * Run: npm run payload run scripts/archive-legacy-shop-merch.ts
 */
import { getPayload } from "../src/lib/payload/getPayload";

const CATEGORY_SLUG = "merch";
const ALLOWED_PRODUCT_SLUGS = new Set(["bizon-cap"]);

console.log("archive-legacy-shop-merch: connecting…");
const payload = await getPayload();

const categoryResult = await payload.find({
  collection: "shop-categories",
  where: { slug: { equals: CATEGORY_SLUG } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
});

const category = categoryResult.docs[0];
if (!category) {
  console.log(`Category not found: ${CATEGORY_SLUG}. Nothing to archive.`);
  process.exit(0);
}

const productResult = await payload.find({
  collection: "products",
  where: { shopCategory: { equals: category.id } },
  limit: 500,
  depth: 0,
  overrideAccess: true,
});

const unexpectedProducts = productResult.docs.filter(
  (product) => !ALLOWED_PRODUCT_SLUGS.has(product.slug),
);
if (unexpectedProducts.length > 0) {
  throw new Error(
    `Refusing to archive ${CATEGORY_SLUG}: unexpected product(s): ${unexpectedProducts
      .map((product) => product.slug)
      .join(", ")}`,
  );
}

for (const product of productResult.docs) {
  if (product.status === "archived") {
    console.log(`Already archived product: ${product.slug}`);
    continue;
  }

  await payload.update({
    collection: "products",
    id: product.id,
    data: { status: "archived" },
    overrideAccess: true,
  });
  console.log(`Archived product: ${product.slug}`);
}

if (category.status === "archived") {
  console.log(`Already archived category: ${CATEGORY_SLUG}`);
} else {
  await payload.update({
    collection: "shop-categories",
    id: category.id,
    data: {
      status: "archived",
      showInMenu: false,
      showOnShopHome: false,
    },
    overrideAccess: true,
  });
  console.log(`Archived category: ${CATEGORY_SLUG}`);
}

console.log("Done. Records remain recoverable in Payload Admin.");
process.exit(0);
