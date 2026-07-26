# Forged Wheels CMS Media Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut forged wheels over to CMS runtime SSOT: upload public PNGs into Payload Media, expose gallery on wheel models, feed Forged UI from CMS, remove the static `SHOP_WHEEL_DESIGNS` bypass.

**Architecture:** Idempotent seed uploads `public/images/premium/shop/wheels/{slug}/bizon-{slug}-{view}.png` into `media`, links `hero-3q` → `mainImage` and `front`/`depth-3q`/`detail` → `gallery` on `wheel-models`. Site mappers expose `imageUrl` + rich `gallery`. ForgedCatalog/ForgedModel/ForgedConfigurator keep their CSS shell and accept CMS-derived props. Cart uses CMS model `id`. Staging DB first.

**Tech Stack:** Next.js 15, Payload CMS 3.82 Local API (`filePath` upload), PostgreSQL (`push: false`), Vitest, TypeScript.

## Global Constraints

- Runtime SSOT is **Payload → PostgreSQL → site**; `SHOP_WHEEL_DESIGNS` is seed/input only after cutover.
- Prefer staging: `DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage` — do not seed production without explicit user approval.
- Keep `postgresAdapter.push: false` — no schema migration required (fields already exist).
- Do not redesign Forged visuals; data source only.
- Out of scope: glass admin, tire-parity publish gates, deleting public PNGs, features array on wheels.
- YAGNI: reuse existing `series` field to store finish label (seeded from `design.finish`); no new CMS field.
- TDD for mapper changes; run `npx vitest run src/lib/cms/payload/mappers.test.ts` after Task 1.
- Commits: only when the user asks, or at task commit steps if the user chose full plan execution with commits — otherwise stage work and ask.

## Decision lock (from spec)

| Topic | Decision |
|---|---|
| Views | `hero-3q` → mainImage; `front`, `depth-3q`, `detail` → gallery (order) |
| Models | atlas, vector, nomad, ember, bastion |
| Cart `itemId` | CMS `wheel-models.id` string |
| Finish display | Seed into `series`; UI shows `designStyle · series` |
| Gallery captions | Seed Media `title` as Front/Depth/Detail; map to `{ url, alt, label }` |
| Shop home forged cards | Fetch CMS models; drop hardcoded `/images/premium/shop/wheels/...` heroes |

## File map

| File | Responsibility |
|---|---|
| `src/lib/cms/types.ts` | Add `gallery` (+ finish via `series`) on `CmsWheelModel` |
| `src/lib/cms/payload/mappers.ts` | Map gallery media → `{ url, alt, label }[]` |
| `src/lib/cms/payload/mappers.test.ts` | Wheel gallery mapping test |
| `scripts/seed-wheel-media.ts` | Idempotent Media upload + model link |
| `scripts/seed-wheel-axis.ts` | Also seed `series` = finish; note media script |
| `package.json` | `seed:wheel-media` script |
| `src/components/shop/forgedView.ts` | Thin CMS → Forged view helper |
| `src/components/shop/ForgedCatalog.tsx` | Props from CMS models |
| `src/components/shop/ForgedModel.tsx` | Props from Forged view |
| `src/components/shop/ForgedConfigurator.tsx` | Cart `itemId` = CMS id |
| `src/app/(site)/shop/wheels/[wheelTypeSlug]/page.tsx` | Pass CMS models into ForgedCatalog |
| `src/app/(site)/shop/wheels/[wheelTypeSlug]/[modelSlug]/page.tsx` | Remove static bypass |
| `src/app/(site)/shop/page.tsx` | Forged home cards from CMS |
| `src/constants/shopHome.ts` | Slug-order only (no static wheel hero paths) |
| `src/app/sitemap.ts` | CMS routes only for wheel models |
| `scripts/verify-shop-readiness.ts` | Require CMS `mainImage`; drop static-hero accept |
| `src/constants/shopWheels.ts` | Keep for seed only; no site imports after cutover |

---

### Task 1: Expose wheel gallery on CmsWheelModel

**Files:**
- Modify: `src/lib/cms/types.ts`
- Modify: `src/lib/cms/payload/mappers.ts` (`mapWheelModelDetail`)
- Test: `src/lib/cms/payload/mappers.test.ts`

**Interfaces:**
- Consumes: `WheelModel.mainImage`, `WheelModel.gallery`, `resolveMedia`
- Produces: `CmsWheelModel.gallery: { url: string; alt: string; label: string }[]`

- [ ] **Step 1: Write the failing test**

Add to `src/lib/cms/payload/mappers.test.ts`:

```ts
import { mapWheelModelDetail } from "./mappers";

describe("mapWheelModelDetail", () => {
  it("maps mainImage and gallery media with alt/label", () => {
    const mapped = mapWheelModelDetail({
      id: 42,
      slug: "atlas",
      name: "BIZON Atlas",
      wheelType: { slug: "forged", name: "Кованые диски" },
      designStyle: "Off-road",
      series: "Satin Black / Machined Silver",
      shortDescription: "Выразительная геометрия",
      mainImage: {
        id: 1,
        url: "/media/bizon-atlas-hero-3q.png",
        alt: "BIZON Atlas",
        title: "Hero",
      },
      gallery: [
        {
          id: 2,
          url: "/media/bizon-atlas-front.png",
          alt: "BIZON Atlas, фронтальный вид",
          title: "Front",
        },
        {
          id: 3,
          url: "/media/bizon-atlas-depth-3q.png",
          alt: "BIZON Atlas, объём",
          title: "Depth",
        },
      ],
      documents: [],
    } as never);

    expect(mapped.id).toBe("42");
    expect(mapped.imageUrl).toBeTruthy();
    expect(mapped.gallery).toEqual([
      {
        url: expect.stringContaining("bizon-atlas-front"),
        alt: "BIZON Atlas, фронтальный вид",
        label: "Front",
      },
      {
        url: expect.stringContaining("bizon-atlas-depth-3q"),
        alt: "BIZON Atlas, объём",
        label: "Depth",
      },
    ]);
    expect(mapped.series).toBe("Satin Black / Machined Silver");
    expect(mapped.designStyle).toBe("Off-road");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/cms/payload/mappers.test.ts`
Expected: FAIL — `gallery` missing on mapped wheel model / type mismatch.

- [ ] **Step 3: Update type**

In `src/lib/cms/types.ts`, extend `CmsWheelModel`:

```ts
export type CmsWheelGalleryImage = {
  url: string;
  alt: string;
  label: string;
};

export type CmsWheelModel = {
  id: string;
  slug: string;
  name: string;
  wheelTypeSlug: string;
  wheelTypeName: string;
  series?: string;
  designStyle?: string;
  material?: string;
  constructionMethod?: string;
  fitmentNotes?: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl?: string | null;
  gallery: CmsWheelGalleryImage[];
  documents?: { url: string; title: string }[];
};
```

- [ ] **Step 4: Implement mapper**

In `mapWheelModelDetail` (`src/lib/cms/payload/mappers.ts`), after computing `documents`, add:

```ts
const gallery = (doc.gallery ?? [])
  .map((item) => {
    const media = resolveMedia(item, "hero");
    if (!media) return null;
    return {
      url: media.url,
      alt: media.alt || doc.name,
      label: (media.title || "").trim() || "View",
    };
  })
  .filter((item): item is { url: string; alt: string; label: string } => Boolean(item));
```

Include `gallery` in the returned object (default `[]` when empty). Keep existing `imageUrl: mapImageUrl(doc.mainImage)`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/cms/payload/mappers.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -f src/lib/cms/types.ts src/lib/cms/payload/mappers.ts src/lib/cms/payload/mappers.test.ts
git commit -m "feat(wheels): map CMS gallery media onto CmsWheelModel"
```

---

### Task 2: Idempotent wheel media seed script

**Files:**
- Create: `scripts/seed-wheel-media.ts`
- Modify: `scripts/seed-wheel-axis.ts` (seed `series` from finish; update footer log)
- Modify: `package.json` (add `seed:wheel-media`)

**Interfaces:**
- Consumes: `SHOP_WHEEL_DESIGNS`, files under `public/images/premium/shop/wheels/{slug}/`
- Produces: Media docs + `wheel-models.mainImage` / `.gallery` linked; npm script `seed:wheel-media`

- [ ] **Step 1: Extend axis seed to store finish in `series`**

In `scripts/seed-wheel-axis.ts`, inside `modelData`:

```ts
const modelData = {
  name: design.name,
  slug: design.slug,
  wheelType: forgedTypeId,
  designStyle: design.positioning,
  series: design.finish,
  material: "Кованый алюминий",
  constructionMethod: "forged" as const,
  shortDescription: design.description,
  status: "published" as const,
};
```

Change final log to mention `npm run seed:wheel-media` for images.

- [ ] **Step 2: Create `scripts/seed-wheel-media.ts`**

```ts
/**
 * Uploads forged wheel PNGs into Payload Media and links them on wheel-models.
 *
 * Run (staging recommended):
 *   cross-env DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage npm run seed:wheel-media
 *
 * Views: hero-3q → mainImage; front, depth-3q, detail → gallery (order).
 * Idempotent by media.filename.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SHOP_WHEEL_DESIGNS } from "../src/constants/shopWheels";
import { getPayload } from "../src/lib/payload/getPayload";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const GALLERY_VIEWS = [
  { view: "front", title: "Front", altSuffix: "фронтальный вид" },
  { view: "depth-3q", title: "Depth", altSuffix: "объём и глубина профиля" },
  { view: "detail", title: "Detail", altSuffix: "деталь поверхности" },
] as const;

function wheelFile(slug: string, view: string) {
  return path.join(
    ROOT,
    "public/images/premium/shop/wheels",
    slug,
    `bizon-${slug}-${view}.png`,
  );
}

async function ensureMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  filePath: string,
  data: { title: string; alt: string },
) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing wheel image: ${filePath}`);
  }
  const filename = path.basename(filePath);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  });
  if (existing.docs[0]) {
    console.log(`  media kept: ${filename} (#${existing.docs[0].id})`);
    return existing.docs[0].id;
  }
  const created = await payload.create({
    collection: "media",
    data: {
      title: data.title,
      alt: data.alt,
      mediaType: "image",
      status: "published",
    },
    filePath,
  });
  console.log(`  media created: ${filename} (#${created.id})`);
  return created.id;
}

console.log("seed-wheel-media: connecting…");
const payload = await getPayload();

for (const design of SHOP_WHEEL_DESIGNS) {
  console.log(`model ${design.slug}`);
  const models = await payload.find({
    collection: "wheel-models",
    where: { slug: { equals: design.slug } },
    limit: 1,
    depth: 0,
  });
  const model = models.docs[0];
  if (!model) {
    throw new Error(
      `wheel-model "${design.slug}" missing — run npm run seed:wheel-axis first`,
    );
  }

  const heroPath = wheelFile(design.slug, "hero-3q");
  const mainImage = await ensureMedia(payload, heroPath, {
    title: `${design.name} Hero`,
    alt: design.name,
  });

  const gallery: (string | number)[] = [];
  for (const item of GALLERY_VIEWS) {
    const id = await ensureMedia(payload, wheelFile(design.slug, item.view), {
      title: item.title,
      alt: `${design.name}, ${item.altSuffix}`,
    });
    gallery.push(id);
  }

  await payload.update({
    collection: "wheel-models",
    id: model.id,
    data: {
      mainImage,
      gallery,
      series: design.finish,
      designStyle: design.positioning,
      shortDescription: design.description,
    },
  });
  console.log(`  linked mainImage + gallery (${gallery.length})`);
}

console.log("Done.");
process.exit(0);
```

- [ ] **Step 3: Add npm script**

In `package.json` scripts:

```json
"seed:wheel-media": "cross-env NODE_OPTIONS=--no-deprecation payload run scripts/seed-wheel-media.ts"
```

- [ ] **Step 4: Smoke-check script loads (no DB write if models missing is OK to fail later)**

Run: `node --check` is N/A for TS via payload. Prefer:

```bash
cross-env DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage npm run seed:wheel-media
```

Expected: for each of 5 slugs, logs `media created` or `media kept`, then `linked mainImage + gallery (3)`. Re-run: all `media kept`, still linked.

If staging DB or PNGs missing, fix env/files before continuing Task 5.

- [ ] **Step 5: Commit**

```bash
git add scripts/seed-wheel-media.ts scripts/seed-wheel-axis.ts package.json
git commit -m "feat(wheels): seed forged PNGs into Payload Media"
```

---

### Task 3: Forged UI accepts CMS view props

**Files:**
- Create: `src/components/shop/forgedView.ts`
- Modify: `src/components/shop/ForgedCatalog.tsx`
- Modify: `src/components/shop/ForgedModel.tsx`
- Modify: `src/components/shop/ForgedConfigurator.tsx`

**Interfaces:**
- Consumes: `CmsWheelModel` from Task 1
- Produces: `ForgedWheelView` + components that no longer import `SHOP_WHEEL_DESIGNS` / `ShopWheelDesign`

- [ ] **Step 1: Create view helper**

`src/components/shop/forgedView.ts`:

```ts
import type { CmsWheelModel } from "@/lib/cms/types";

export type ForgedWheelView = {
  id: string;
  slug: string;
  name: string;
  positioning: string;
  finish: string;
  description: string;
  heroImage: string;
  gallery: { src: string; alt: string; label: string }[];
};

export function toForgedWheelView(model: CmsWheelModel): ForgedWheelView | null {
  const heroImage = model.imageUrl?.trim();
  if (!heroImage) return null;

  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    positioning: model.designStyle?.trim() || "Forged",
    finish: model.series?.trim() || "",
    description: model.descriptionShort,
    heroImage,
    gallery: model.gallery.map((image) => ({
      src: image.url,
      alt: image.alt,
      label: image.label,
    })),
  };
}

export function metaLine(view: ForgedWheelView): string {
  return [view.positioning, view.finish].filter(Boolean).join(" · ");
}
```

- [ ] **Step 2: Update ForgedCatalog**

Change signature to `export function ForgedCatalog({ models }: { models: CmsWheelModel[] })`.

Map with `toForgedWheelView`, skip nulls. Replace `design.heroImage` / `design.positioning` / `design.finish` with view fields + `metaLine(view)`. Remove import of `SHOP_WHEEL_DESIGNS`.

- [ ] **Step 3: Update ForgedModel + ForgedConfigurator**

`ForgedModel({ model }: { model: ForgedWheelView })` — use `model.heroImage`, `model.gallery`, `metaLine(model)`, pass `model` to configurator.

`ForgedConfigurator({ model }: { model: ForgedWheelView })`:

```ts
cart.addItem({
  itemType: "wheel",
  itemId: model.id,
  variantId: configurationKey(vehicle, year),
  name: model.name,
  slug: model.slug,
  parentSlug: "forged",
  quantity,
  priceOnRequest: true,
  url: `/shop/wheels/forged/${model.slug}`,
  variantLabel,
  notes,
});
```

`defaultValue={model.finish}` on finish input.

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/forgedView.ts src/components/shop/ForgedCatalog.tsx src/components/shop/ForgedModel.tsx src/components/shop/ForgedConfigurator.tsx
git commit -m "feat(wheels): feed Forged UI from CMS view models"
```

---

### Task 4: Remove forged static bypass from routes

**Files:**
- Modify: `src/app/(site)/shop/wheels/[wheelTypeSlug]/page.tsx`
- Modify: `src/app/(site)/shop/wheels/[wheelTypeSlug]/[modelSlug]/page.tsx`

**Interfaces:**
- Consumes: `getWheelModelsByTypeSlug`, `getWheelModelByTypeAndSlug`, `toForgedWheelView`
- Produces: forged pages with zero `SHOP_WHEEL_DESIGNS` imports

- [ ] **Step 1: Type listing page**

In `page.tsx` for `[wheelTypeSlug]`, replace early forged return:

```tsx
if (wheelTypeSlug.toLowerCase() === "forged") {
  const models = await getWheelModelsByTypeSlug("forged");
  return <ForgedCatalog models={models} />;
}
```

Keep forged metadata as-is (brand copy, not static design list).

- [ ] **Step 2: Model page — strip static path**

Remove imports of `getShopWheelDesignBySlug` / `SHOP_WHEEL_DESIGNS`.

`generateStaticParams`:

```ts
export async function generateStaticParams() {
  return getAllWheelModelRouteParams();
}
```

`generateMetadata` / default export: only CMS path. For forged type, after loading model:

```tsx
const view = toForgedWheelView(model);
if (wheelType.slug === "forged") {
  if (!view) notFound();
  // structuredData from model, then:
  return (
    <>
      <script type="application/ld+json" ... />
      <ForgedModel model={view} />
    </>
  );
}
// existing generic catalog model page for non-forged
```

Ensure `getWheelTypeBySlug` + `getWheelModelByTypeAndSlug` both required; `notFound()` if either missing.

- [ ] **Step 3: Grep gate**

Run: `rg "SHOP_WHEEL_DESIGNS|getShopWheelDesignBySlug|ShopWheelDesign" src/app src/components`
Expected: no matches under `src/app` or `src/components` (seed/constants/verify may still reference).

- [ ] **Step 4: Commit**

```bash
git add "src/app/(site)/shop/wheels/[wheelTypeSlug]/page.tsx" "src/app/(site)/shop/wheels/[wheelTypeSlug]/[modelSlug]/page.tsx"
git commit -m "feat(wheels): remove forged static catalog bypass"
```

---

### Task 5: Sitemap, shop home, readiness

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/constants/shopHome.ts`
- Modify: `src/app/(site)/shop/page.tsx`
- Modify: `scripts/verify-shop-readiness.ts`

**Interfaces:**
- Consumes: CMS wheel models / route params
- Produces: no forged runtime dependency on static hero paths

- [ ] **Step 1: Sitemap**

Remove `SHOP_WHEEL_DESIGNS` import and the static merge. Use only `wheelModelRoutes` from CMS (already loaded earlier in the file).

- [ ] **Step 2: Shop home constants**

Replace `SHOP_HOME_MODELS` image-bearing entries with slug order only:

```ts
/** Preferred order for forged cards on /shop (CMS supplies name/image/meta). */
export const SHOP_HOME_WHEEL_SLUGS = ["atlas", "vector", "nomad"] as const;
```

Remove old `SHOP_HOME_MODELS` (update all imports).

- [ ] **Step 3: Shop page async CMS cards**

```tsx
import { getWheelModelsByTypeSlug } from "@/lib/cms";
import { SHOP_HOME_WHEEL_SLUGS, SHOP_ORDER_STEPS, SHOP_CATEGORY_SLIDES, SHOP_VEHICLE_STORIES } from "@/constants/shopHome";

export default async function ShopPage() {
  const forged = await getWheelModelsByTypeSlug("forged");
  const bySlug = new Map(forged.map((m) => [m.slug, m]));
  const homeModels = SHOP_HOME_WHEEL_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m?.imageUrl),
  );

  // in the grid:
  {homeModels.map((model) => (
    <Link ... href={`/shop/wheels/forged/${model.slug}`} key={model.slug}>
      <Image src={model.imageUrl!} alt={model.name} ... />
      <strong>{model.name}</strong>
      <span>{[model.designStyle, model.series].filter(Boolean).join(" · ")}</span>
    </Link>
  ))}
}
```

Keep lifestyle/category static images (not forged product SSOT).

- [ ] **Step 4: Readiness — require CMS mainImage**

In `scripts/verify-shop-readiness.ts`, for each `SHOP_WHEEL_DESIGNS` slug (still OK as seed checklist):

```ts
} else if (!hasUpload(model.mainImage)) {
  findings.push({
    severity: "blocker",
    code: "FORGED_MODEL_IMAGE_MISSING",
    item: design.slug,
    message: "Для опубликованной CMS-модели требуется mainImage в Media.",
  });
}
```

Remove `hasStaticHero` acceptance branch and `FORGED_MODEL_STATIC_IMAGE` warning path.

- [ ] **Step 5: Commit**

```bash
git add src/app/sitemap.ts src/constants/shopHome.ts "src/app/(site)/shop/page.tsx" scripts/verify-shop-readiness.ts
git commit -m "feat(wheels): drive shop home and readiness from CMS media"
```

---

### Task 6: Staging seed + verify end-to-end

**Files:** none (ops) — optional README one-liner if `seed:wheel-media` is undocumented

- [ ] **Step 1: Ensure models exist on staging**

```bash
cross-env DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage npm run seed:wheel-axis
```

- [ ] **Step 2: Upload media**

```bash
cross-env DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage npm run seed:wheel-media
```

Expected: 5 × (1 hero + 3 gallery) linked. Re-run idempotent.

- [ ] **Step 3: Readiness**

```bash
cross-env DATABASE_URI=postgresql://postgres:postgres@127.0.0.1:55433/bizon_payload_stage npm run verify:shop
```

Expected: JSON `ok: true` (or no `FORGED_*` blockers).

- [ ] **Step 4: Manual site check**

With `DATABASE_URI` pointing at staging, run `npm run dev`, open:

1. `/shop/wheels/forged` — five CMS cards with Media URLs  
2. `/shop/wheels/forged/atlas` — hero + gallery + configurator  
3. Add to cart — `itemId` is CMS id (not `atlas`)  
4. `/shop` — three forged cards use Media URLs  

- [ ] **Step 5: Final grep**

```bash
rg "SHOP_WHEEL_DESIGNS|getShopWheelDesignBySlug" src/app src/components
```

Expected: no matches.

- [ ] **Step 6: Commit only if README / docs touch**

If you added a README note for `seed:wheel-media`, commit it; otherwise no commit.

---

## Spec coverage checklist

| Spec requirement | Task |
|---|---|
| Idempotent media seed from public PNGs | Task 2 |
| hero → mainImage; 3 views → gallery | Task 2 |
| Mapper exposes gallery | Task 1 |
| Remove forged bypass in type + model routes | Task 4 |
| Keep ForgedCatalog / ForgedModel shell | Task 3 |
| Cart uses CMS id | Task 3 |
| Sitemap / shop home off static forged heroes | Task 5 |
| Readiness requires CMS mainImage | Task 5 |
| Staging first | Task 6 |
| `SHOP_WHEEL_DESIGNS` seed-only | Tasks 2–5 |
| No glass UI / no tire-parity | Global constraints |

## Plan self-review

1. Spec coverage: all MVP rows mapped to tasks; non-goals excluded.  
2. Placeholders: none — seed script and view helper fully specified.  
3. Types: `CmsWheelGalleryImage` / `ForgedWheelView` / cart `itemId: model.id` consistent across Tasks 1–4.  
4. Finish field: `series` documented (YAGNI vs new field).
