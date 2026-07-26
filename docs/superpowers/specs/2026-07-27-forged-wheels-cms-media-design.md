# Forged Wheels CMS Media Cutover — Design A

**Date:** 2026-07-27  
**Status:** Approved direction (user chose A); awaiting review of this written spec before plan/impl  
**Branch:** `codex/unified-bizon-shop-foundation`

## Problem

Forged wheel pages (`/shop/wheels/forged`, model pages) bypass Payload and render from `SHOP_WHEEL_DESIGNS` + public PNGs. CMS `wheel-models` already exist (seeded without media). Site SSOT for tires is CMS → PostgreSQL; forged wheels still have a static parallel path. Cart uses design `slug` as `itemId` instead of CMS model id.

## Goal

Make forged wheels CMS-only at runtime: images live in Payload Media, models link `mainImage` + `gallery`, Forged UI keeps its visual shell but is fed from CMS props. Remove the forged static bypass.

## Non-goals

- Glass / custom Catalog admin workspace (cancelled).
- Tire-parity on wheels (features array, dual PCD, publish-gate hardening beyond what already exists).
- Deleting PNGs from `public/` in this pass (they remain seed input; runtime must not require them).
- Production DB migration without explicit approval (prefer staging).
- Redesigning ForgedCatalog / ForgedModel visuals.

## Locked decisions

| Topic | Decision |
|---|---|
| Approach | Design A: upload public PNGs → Media; link to `wheel-models`; remove forged bypass; keep Forged UI shell |
| Runtime SSOT | Payload → PostgreSQL → site |
| Seed source | `SHOP_WHEEL_DESIGNS` + files under `public/images/premium/shop/wheels/{slug}/` |
| Views | `hero-3q` → `mainImage`; `front`, `depth-3q`, `detail` → `gallery` (order preserved) |
| Models | atlas, vector, nomad, ember, bastion |
| Cart `itemId` | CMS wheel-model `id` (string), not slug |
| Constants | `SHOP_WHEEL_DESIGNS` becomes seed/input only after cutover — not used by site routes, Forged components, sitemap forged URLs, or shop-home hero lists that currently hardcode static paths for forged |
| Environment | Run media seed against staging first (`bizon_payload_stage` @ `127.0.0.1:55433`) |

## Architecture

```text
public PNG files ──(idempotent seed)──► media collection
                                              │
                                              ▼
SHOP_WHEEL_DESIGNS (seed only) ──► wheel-models.mainImage + .gallery
                                              │
                                              ▼
mapWheelModelDetail (+ gallery) ──► CmsWheelModel
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    ▼                         ▼                         ▼
            ForgedCatalog              ForgedModel              cart / sitemap
            (CMS models)          (CMS model + media)         (CMS ids / routes)
```

### Units

1. **Media seed script** — idempotent upload + attach to models by slug.  
2. **CMS mapper** — expose `gallery` (and keep `imageUrl` from `mainImage`) on `CmsWheelModel`.  
3. **Route cutover** — forged type/model pages always load CMS; no `getShopWheelDesignBySlug` bypass.  
4. **Forged UI adapters** — components accept CMS-shaped props (or a thin view model derived from `CmsWheelModel`), not `ShopWheelDesign`.  
5. **Downstream cleanup** — cart id, `generateStaticParams`, sitemap, shop home images from CMS URLs where they currently hardcode forged static paths.

## Data flow

### Seed (offline / ops)

For each design slug in `SHOP_WHEEL_DESIGNS`:

1. Ensure `wheel-models` row exists for slug (reuse / extend `seed-wheel-axis` or sibling `seed-wheel-media`).
2. For each view file `bizon-{slug}-{view}.png`, find existing Media by filename (or alt/filename convention); if missing, `payload.create({ collection: 'media', file: … })`.
3. Update model: `mainImage` = hero media id; `gallery` = ordered list of gallery media ids.
4. Re-run safe: skip re-upload when filename already in Media; refresh links if model points elsewhere.

### Runtime (site)

1. `getWheelTypeBySlug('forged')` + `getWheelModelsByTypeSlug('forged')` / `getWheelModelByTypeAndSlug`.
2. Mapper returns `imageUrl` + `gallery: string[]` (URLs).
3. Listing page: if type slug is `forged`, render `<ForgedCatalog models={…} />` from CMS (not static constant).
4. Model page: render `<ForgedModel model={…} />` from CMS; `notFound()` if missing/unpublished.
5. Cart add: `itemId: model.id`, `slug` / `url` from CMS.

## Error handling

- Missing PNG at seed time: fail that slug with a clear path error; do not silently leave published model without `mainImage` if seed claimed success.
- Model published without `mainImage` after cutover: site may show empty image / degrade; seed is the fix path for the five designs. No new publish-gate work in this pass unless already required by schema.
- Staging-only seed by default; document `DATABASE_URI` override.

## Testing / verification

- Unit: mapper includes `gallery` for wheel models when Media relations present.
- Script dry-run or log: 5 models × (1 main + 3 gallery) linked.
- Manual / readiness: `/shop/wheels/forged` and one model page render CMS images; cart line uses numeric/string CMS id; no import of `SHOP_WHEEL_DESIGNS` from forged route components after cutover.
- Prefer `scripts/verify-shop-readiness.ts` update if it currently accepts static hero bypass for forged.

## File touch list (expected)

| Area | Files |
|---|---|
| Seed | `scripts/seed-wheel-axis.ts` and/or `scripts/seed-wheel-media.ts`; `package.json` script |
| Types / mappers | `src/lib/cms/types.ts`, `src/lib/cms/payload/mappers.ts`, mapper tests |
| Routes | `src/app/(site)/shop/wheels/[wheelTypeSlug]/page.tsx`, `…/[modelSlug]/page.tsx` |
| UI | `ForgedCatalog.tsx`, `ForgedModel.tsx`, `ForgedConfigurator.tsx` (+ props types) |
| Downstream | `src/app/sitemap.ts`, `src/constants/shopHome.ts` (or shop page), readiness script |
| Constants | `src/constants/shopWheels.ts` — remain for seed; strip site imports |

## Out of MVP (explicit)

- Features array / characteristic inheritance for wheels  
- Auto SKU / publish gates parity with tires  
- Removing files from `public/images/premium/shop/wheels/`  
- Production media seed without staging dry-run  

## Success criteria

1. Forged listing and model pages never read `SHOP_WHEEL_DESIGNS` at request time.  
2. Images for all five designs come from Payload Media URLs.  
3. Cart forged line items use CMS model `id`.  
4. Forged visual components unchanged in look; only data source changes.  
5. Staging seed is idempotent and documented.

## Spec self-review

- No placeholders / TBD left for MVP scope.  
- No contradiction with cancelled Stage 2 glass UI.  
- Scope limited to forged media cutover + CMS feed; tire work untouched.  
- Ambiguity resolved: keep Forged shell; `SHOP_WHEEL_DESIGNS` seed-only after cutover.
