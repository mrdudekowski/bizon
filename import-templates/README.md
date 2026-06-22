# BIZON Catalog Import Templates

CSV templates for bulk catalog loading. **No automated importer yet** — use Payload admin or future `scripts/import-*.ts` (phase 10+).

## Files

| File | Collection | Required columns |
|------|------------|------------------|
| `tire-types.csv` | `tire-types` | `slug`, `name`, `status` |
| `tire-models.csv` | `tire-models` | `slug`, `name`, `tireTypeSlug`, `applicationCategory`, `status` |
| `tire-variants.csv` | `tire-variants` | `modelSlug`, `size`, `status` |
| `wheel-types.csv` | `wheel-types` | `slug`, `name`, `status` |
| `wheel-models.csv` | `wheel-models` | `slug`, `name`, `wheelTypeSlug`, `status` |
| `wheel-variants.csv` | `wheel-variants` | `modelSlug`, `sizeLabel`, `status` |
| `shop-categories.csv` | `shop-categories` | `slug`, `name`, `status` |
| `shop-products.csv` | `products` | `slug`, `name`, `shopCategorySlug`, `status` |

## Rules

1. Missing required field → row stays **draft** or import rejects the row.
2. Existing `slug` / `sku` → **update** published row.
3. New `slug` / `sku` → **create**.
4. Invalid relationship slug → **error**, do not publish.
5. Never import tires/wheels as `products`.

See [`docs/data-migration-and-import-plan.md`](../docs/data-migration-and-import-plan.md).
