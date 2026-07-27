/**
 * Archives the confirmed legacy Forged demo model and its variants.
 * Keeps the `forged` wheel type intact for approved production models.
 *
 * Run: npm run payload run scripts/archive-legacy-forged-demo.ts
 */
import { getPayload } from "../src/lib/payload/getPayload";

const MODEL_SLUG = "bizon-forged-pro";
const ALLOWED_VARIANT_SKUS = new Set(["BIZ-FG-225825-335"]);

console.log("archive-legacy-forged-demo: connecting…");
const payload = await getPayload();

const modelResult = await payload.find({
  collection: "wheel-models",
  where: { slug: { equals: MODEL_SLUG } },
  limit: 1,
  depth: 0,
  overrideAccess: true,
});

const model = modelResult.docs[0];
if (!model) {
  console.log(`Model not found: ${MODEL_SLUG}. Nothing to archive.`);
  process.exit(0);
}

const variantResult = await payload.find({
  collection: "wheel-variants",
  where: { wheelModel: { equals: model.id } },
  limit: 500,
  depth: 0,
  overrideAccess: true,
});

const unexpectedVariants = variantResult.docs.filter(
  (variant) => !variant.sku || !ALLOWED_VARIANT_SKUS.has(variant.sku),
);
if (unexpectedVariants.length > 0) {
  throw new Error(
    `Refusing to archive ${MODEL_SLUG}: unexpected variant(s): ${unexpectedVariants
      .map((variant) => variant.sku || String(variant.id))
      .join(", ")}`,
  );
}

for (const variant of variantResult.docs) {
  if (variant.status === "archived") {
    console.log(`Already archived variant: ${variant.sku}`);
    continue;
  }

  await payload.update({
    collection: "wheel-variants",
    id: variant.id,
    data: { status: "archived", available: false },
    overrideAccess: true,
  });
  console.log(`Archived variant: ${variant.sku}`);
}

if (model.status === "archived") {
  console.log(`Already archived model: ${MODEL_SLUG}`);
} else {
  await payload.update({
    collection: "wheel-models",
    id: model.id,
    data: { status: "archived" },
    overrideAccess: true,
  });
  console.log(`Archived model: ${MODEL_SLUG}`);
}

console.log("Done. Records remain recoverable in Payload Admin.");
process.exit(0);
