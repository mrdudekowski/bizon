---
title: Реализация premium UX для bizon.ru
contentType: Implementation plan
category: Public site
navLabel: Premium UX implementation
---

# Bizon.ru Premium UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Построить на bizon.ru цельную premium B2B-воронку от выбора задачи автопарка до предварительной рекомендации и контекстной заявки, сохранив общую UI/UX-систему с BIZON Shop.

**Architecture:** Next.js server components получают только опубликованные данные Payload и преобразуют их в стабильный каталогный read model. Чистый детерминированный selection engine работает с этим read model, а клиентские компоненты отвечают только за URL-backed состояние, фильтры и форму. `SiteShell`, drawer, корзина и базовые tokens остаются общими; `MainChrome` и контент основного сайта изолированы от Shop.

**Tech Stack:** Next.js 15.4.11, React 19.2.3, TypeScript 5.8.2, Payload CMS 3.82.1, CSS Modules и глобальные CSS tokens, Vitest для unit-тестов, Playwright для E2E.

## Global Constraints

- Единая runtime-тема только светлая; белый фон доминирует.
- На главной чёрный фон разрешён только для секции ассортимента шин и кампании BIZON Shop.
- Coral используется для коммерческого действия, Mint для технического сигнала, ссылок и focus.
- Геометрия navbar наследуется от BIZON Shop, но контент основного сайта хранится отдельно.
- Публичные направления, модели, варианты и editorial-материалы приходят только из опубликованных записей Payload.
- Будущее направление появляется публично только при готовой landing page и минимум одной опубликованной модели.
- Selection engine детерминированный, локальный и не использует AI.
- URL содержит только неперсональные ответы подбора; имя, телефон, email, компания и комментарий никогда не попадают в URL.
- Предварительная рекомендация не обещает техническую совместимость или складской остаток без проверки специалиста.
- Все интерактивные цели не меньше 44 × 44 px; обязательны keyboard navigation, visible focus и reduced motion.
- Подтверждение заявки показывает `requestId`, отправленное резюме и следующий шаг без неподтверждённого SLA.
- Проверяемые viewport: 390, 768, 1024 и 1440 px.
- Deployment не входит в этот план.

---

## Карта файлов и ответственности

### Foundation и shell

- `src/components/chrome/FloatingChrome.tsx` — общая геометрия floating navbar и tone/compact behavior.
- `src/components/chrome/FloatingChrome.module.css` — единый layout navbar для main и Shop.
- `src/components/main/MainChrome.tsx` — только контент и actions navbar bizon.ru.
- `src/components/shop/ShopChrome.jsx` — Shop-контент поверх общей геометрии.
- `src/components/layout/SiteShell.jsx` — выбор `MainChrome` или `ShopChrome` по route.
- `src/lib/readiness/publicSite.ts` — чистая проверка публичных контактов и SEO assets.
- `scripts/verify-public-site-readiness.ts` — release gate для основного сайта.

### Catalog read model

- `src/lib/selection/options.ts` — стабильные domain и Payload options для техники, условий и оси.
- `src/collections/TireTypes.ts` — применимость направления.
- `src/collections/TireModels.ts` — применимость конкретной модели и документы.
- `src/lib/cms/types.ts` и `src/lib/cms/payload/mappers.ts` — публичные CMS shapes.
- `src/lib/catalog/tireReadModel.ts` — нормализованный опубликованный каталог.
- `src/lib/catalog/tireFilters.ts` — чистый URL-backed filter pipeline.

### Selection

- `src/lib/selection/types.ts` — канонические типы состояния и результата.
- `src/lib/selection/urlState.ts` — parse/serialize и определение следующего шага.
- `src/lib/selection/engine.ts` — scoring, причины рекомендации и consultation fallback.
- `src/app/(site)/selection/page.tsx` — server entry, CMS read model и metadata.
- `src/components/selection/*` — progress, шаги, результат и resume callout.

### Catalog UI

- `src/components/catalog/TireDirectionPage.tsx` — editorial hero, filters и model grid.
- `src/components/catalog/TireCatalogFilters.tsx` — доступные URL-фильтры.
- `src/components/catalog/TireModelStage.tsx` — Product Theatre для модели.
- `src/components/catalog/TireCatalog.module.css` — каталогные compositions.
- `src/app/(site)/models/**` — route orchestration, metadata и deep links.

### Homepage и contact flow

- `src/components/main/MainHero.tsx` — светлый Monumental Editorial hero.
- `src/components/main/TireSelectionEntry.tsx` — первый шаг подбора на главной.
- `src/components/main/TireDirectionShowcase.tsx` — первая чёрная секция.
- `src/components/main/EditorialHighlights.tsx` — Tire IQ + People Stories.
- `src/components/main/BrandingCampaign.tsx` — светлая B2B-кампания.
- `src/components/main/ShopCampaign.tsx` — вторая чёрная секция.
- `src/components/main/MainHome.module.css` — композиция семи актов.
- `src/components/forms/ContextualContactForm.tsx` — единая адаптивная форма.
- `src/components/selection/RequestContextSummary.tsx` — редактируемое неперсональное резюме.
- `src/lib/requests/selectionContext.ts` — whitelist и нормализация selection context.

### Tests

- `src/lib/**/*.test.ts` — Vitest unit-тесты pure logic.
- `e2e/main-chrome.spec.ts` — navbar и accessibility shell.
- `e2e/catalog.spec.ts` — filter URLs, deep links и Product Theatre.
- `e2e/selection-request.spec.ts` — полный путь от главной до `requestId`.
- `e2e/public-site-visual.spec.ts` — overflow и smoke на четырёх viewport.

---

### Task 1: Release-readiness gate и unit-test harness

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `src/lib/readiness/publicSite.ts`
- Create: `src/lib/readiness/publicSite.test.ts`
- Create: `scripts/verify-public-site-readiness.ts`
- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/lib/seo/structuredData.ts`

**Interfaces:**
- Produces: `findPublicSiteReadinessIssues(input): PublicSiteReadinessIssue[]`.
- Produces: scripts `test:unit` and `verify:site` used by every later checkpoint.
- Preserves: `createPageMetadata()` and `createOrganizationStructuredData()` public signatures.

- [ ] **Step 1: Install Vitest and add deterministic scripts**

Run:

```powershell
npm.cmd install --save-dev vitest
```

Add to `package.json`:

```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:unit:watch": "vitest",
    "verify:site": "cross-env NODE_OPTIONS=--no-deprecation payload run scripts/verify-public-site-readiness.ts"
  }
}
```

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: { reporter: ["text", "html"] },
  },
});
```

- [ ] **Step 2: Write the failing readiness tests**

Create `src/lib/readiness/publicSite.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findPublicSiteReadinessIssues } from "./publicSite";

describe("findPublicSiteReadinessIssues", () => {
  it("rejects demo contacts, example host and missing public assets", () => {
    expect(findPublicSiteReadinessIssues({
      phone: "+7 (000) 000-00-00",
      email: "info@bizontires.example",
      siteUrl: "https://bizontires.example",
      publicAssets: new Set<string>(),
    }).map((issue) => issue.code)).toEqual([
      "placeholder_phone",
      "placeholder_email",
      "placeholder_site_url",
      "missing_og_image",
      "missing_logo",
    ]);
  });

  it("accepts configured contacts and committed brand assets", () => {
    expect(findPublicSiteReadinessIssues({
      phone: "+7 (423) 000-00-01",
      email: "sales@bizon.ru",
      siteUrl: "https://bizon.ru",
      publicAssets: new Set(["/brand/logo+text.png", "/brand/bizon.svg"]),
    })).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test and verify the missing module failure**

Run:

```powershell
npm.cmd run test:unit -- src/lib/readiness/publicSite.test.ts
```

Expected: FAIL because `src/lib/readiness/publicSite.ts` does not exist.

- [ ] **Step 4: Implement the readiness checker and release script**

Create `src/lib/readiness/publicSite.ts`:

```ts
export const PUBLIC_OG_IMAGE = "/brand/logo+text.png";
export const PUBLIC_LOGO = "/brand/bizon.svg";

export type PublicSiteReadinessIssue = {
  code:
    | "placeholder_phone"
    | "placeholder_email"
    | "placeholder_site_url"
    | "missing_og_image"
    | "missing_logo";
  message: string;
};

export function findPublicSiteReadinessIssues(input: {
  phone: string;
  email: string;
  siteUrl: string;
  publicAssets: ReadonlySet<string>;
}): PublicSiteReadinessIssue[] {
  const issues: PublicSiteReadinessIssue[] = [];
  if (/\(000\)|000-00-00/.test(input.phone)) issues.push({ code: "placeholder_phone", message: "Configure NEXT_PUBLIC_CONTACT_PHONE" });
  if (/\.example$/i.test(input.email)) issues.push({ code: "placeholder_email", message: "Configure NEXT_PUBLIC_CONTACT_EMAIL" });
  if (/\.example(?:\/|$)/i.test(input.siteUrl)) issues.push({ code: "placeholder_site_url", message: "Configure NEXT_PUBLIC_SITE_URL" });
  if (!input.publicAssets.has(PUBLIC_OG_IMAGE)) issues.push({ code: "missing_og_image", message: `Missing ${PUBLIC_OG_IMAGE}` });
  if (!input.publicAssets.has(PUBLIC_LOGO)) issues.push({ code: "missing_logo", message: `Missing ${PUBLIC_LOGO}` });
  return issues;
}
```

Create `scripts/verify-public-site-readiness.ts`:

```ts
import fs from "node:fs";
import path from "node:path";
import { SITE_CONTACT } from "@/constants/contact";
import { getSiteUrl } from "@/lib/seo/metadata";
import { findPublicSiteReadinessIssues, PUBLIC_LOGO, PUBLIC_OG_IMAGE } from "@/lib/readiness/publicSite";

const publicAssets = new Set(
  [PUBLIC_OG_IMAGE, PUBLIC_LOGO].filter((asset) =>
    fs.existsSync(path.join(process.cwd(), "public", asset.replace(/^\//, ""))),
  ),
);
const issues = findPublicSiteReadinessIssues({
  phone: SITE_CONTACT.phone,
  email: SITE_CONTACT.email,
  siteUrl: getSiteUrl(),
  publicAssets,
});

if (issues.length) {
  for (const issue of issues) console.error(`[${issue.code}] ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log("Public-site readiness checks passed");
}
```

Use `PUBLIC_OG_IMAGE` in `createPageMetadata()` and `PUBLIC_LOGO` in `createOrganizationStructuredData()`. Create `.env.example` with empty `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_EMAIL` and `NEXT_PUBLIC_SITE_URL` assignments plus comments stating that production values are required.

- [ ] **Step 5: Verify and commit the readiness slice**

Run:

```powershell
npm.cmd run test:unit -- src/lib/readiness/publicSite.test.ts
npx.cmd tsc --noEmit
npm.cmd run lint
```

Expected: unit test PASS, typecheck exit 0, lint exit 0. `npm.cmd run verify:site` is expected to FAIL locally until real contact environment variables are supplied; record its issue codes and do not replace them with invented data.

Commit only the task files:

```powershell
git add package.json package-lock.json vitest.config.ts .env.example src/lib/readiness/publicSite.ts src/lib/readiness/publicSite.test.ts scripts/verify-public-site-readiness.ts src/lib/seo/metadata.ts src/lib/seo/structuredData.ts
git commit -m "chore: add public site readiness gate"
```

---

### Task 2: Shared floating chrome и новый MainChrome

**Files:**
- Create: `src/components/chrome/FloatingChrome.tsx`
- Create: `src/components/chrome/FloatingChrome.module.css`
- Create: `src/components/chrome/useAdaptiveChrome.ts`
- Create: `src/components/main/MainChrome.tsx`
- Modify: `src/components/shop/ShopChrome.jsx`
- Modify: `src/components/shop/ShopChrome.module.css`
- Modify: `src/components/layout/SiteShell.jsx`
- Modify: `src/constants/navigation.js`
- Create: `e2e/main-chrome.spec.ts`

**Interfaces:**
- Produces: `FloatingChrome({ ariaLabel, menuOpen, onMenuToggle, brand, nav, utility, action, toneAttribute })`.
- Produces: `useAdaptiveChrome(toneAttribute): { compact: boolean; tone: "light" | "dark" }`.
- Produces: `MainChrome` with links `Решения`, `Каталог`, `Tire IQ`, `Запросить расчёт`.
- Consumes: existing `BurgerToggle`, `SiteShell` menu state and cart state.

- [ ] **Step 1: Write the failing MainChrome E2E contract**

Create `e2e/main-chrome.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("main site uses the premium floating chrome", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Навигация BIZON Tires" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Каталог", exact: true })).toHaveAttribute("href", "/models");
  await expect(nav.getByRole("link", { name: "Tire IQ", exact: true })).toHaveAttribute("href", "/tire-iq");
  await expect(nav.getByRole("link", { name: "Запросить расчёт", exact: true })).toHaveAttribute("href", "/selection");
  await expect(page.locator('[aria-controls="burger-menu"]')).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect(page.locator('[data-main-chrome][data-compact="true"]')).toBeVisible();
});
```

- [ ] **Step 2: Build and run the E2E test to verify current Header fails**

Run:

```powershell
npm.cmd run build
npx.cmd playwright test e2e/main-chrome.spec.ts --project=desktop
```

Expected: FAIL because the main route still renders `Header` and lacks `data-main-chrome`.

- [ ] **Step 3: Implement shared behavior and MainChrome**

Create `src/components/chrome/useAdaptiveChrome.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useAdaptiveChrome(attribute: string) {
  const [state, setState] = useState<{ compact: boolean; tone: "light" | "dark" }>({ compact: false, tone: "light" });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = document.elementsFromPoint(window.innerWidth / 2, 104)
          .map((element) => element.closest?.(`[${attribute}]`))
          .find(Boolean);
        setState({
          compact: window.scrollY > 48,
          tone: section?.getAttribute(attribute) === "dark" ? "dark" : "light",
        });
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [attribute]);
  return state;
}
```

Create `FloatingChrome.tsx` as a structural component with `ReactNode` slots and a `nav` landmark. Its root must expose `data-compact` and `data-tone`, use `BurgerToggle`, and keep 44 px targets. Move the shared grid, pill, blur, compact transition and responsive breakpoints from `ShopChrome.module.css` into `FloatingChrome.module.css`.

Create `MainChrome.tsx`:

```tsx
"use client";

import Link from "next/link";
import { FloatingChrome } from "@/components/chrome/FloatingChrome";
import { ROUTES } from "@/constants/navigation";

export function MainChrome({ menuOpen, onMenuToggle }: { menuOpen: boolean; onMenuToggle(): void }) {
  return (
    <FloatingChrome
      ariaLabel="Навигация BIZON Tires"
      menuOpen={menuOpen}
      onMenuToggle={onMenuToggle}
      brand={<Link href={ROUTES.home} translate="no">BIZON</Link>}
      nav={<><Link href="/#solutions">Решения</Link><Link href={ROUTES.models}>Каталог</Link><Link href={ROUTES.tireIq}>Tire IQ</Link></>}
      action={<Link className="btn-accent" href={ROUTES.selection}>Запросить расчёт</Link>}
      toneAttribute="data-main-chrome-tone"
      rootDataAttribute="data-main-chrome"
    />
  );
}
```

Add `selection: "/selection"` to `ROUTES`. Replace `Header` with `MainChrome` in `SiteShell`. Refactor `ShopChrome` to render its existing category dropdown, back link and cart action through the same `FloatingChrome`; do not change Shop labels or routes.

- [ ] **Step 4: Verify both surfaces and commit**

Run:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd playwright test e2e/main-chrome.spec.ts e2e/shop-smoke.spec.ts
```

Expected: all commands exit 0; main navbar contract passes on desktop and mobile; existing Shop smoke remains green.

Commit:

```powershell
git add src/components/chrome src/components/main/MainChrome.tsx src/components/shop/ShopChrome.jsx src/components/shop/ShopChrome.module.css src/components/layout/SiteShell.jsx src/constants/navigation.js e2e/main-chrome.spec.ts
git commit -m "feat: add shared premium site chrome"
```

---

### Task 3: Published tire read model и CMS applicability

**Files:**
- Create: `src/lib/selection/options.ts`
- Modify: `src/collections/TireTypes.ts`
- Modify: `src/collections/TireModels.ts`
- Modify: `src/lib/cms/types.ts`
- Modify: `src/lib/cms/payload/mappers.ts`
- Create: `src/lib/catalog/tireReadModel.ts`
- Create: `src/lib/catalog/tireReadModel.test.ts`
- Modify: `src/lib/cms/index.ts`
- Modify: `src/payload-types.ts` through generation

**Interfaces:**
- Produces: `VehicleType`, `OperatingCondition`, `AxleChoice` and their option arrays shared by Payload and selection.
- Produces: `getPublishedTireCatalog(): Promise<TireCatalogReadModel>`.
- Produces: `TireCatalogDirection` containing at least one published model; empty directions are excluded.
- Consumes: `getTireTypes()`, `getTireModelsByTypeSlug()` and `getTireVariantsByModelId()`.

- [ ] **Step 1: Define the taxonomy and write the failing read-model test**

Create `src/lib/selection/options.ts`:

```ts
export const VEHICLE_TYPE_OPTIONS = [
  { label: "Магистральный тягач", value: "long-haul-tractor" },
  { label: "Региональный грузовик", value: "regional-truck" },
  { label: "Строительный самосвал", value: "construction-dumper" },
  { label: "Карьерная или специальная техника", value: "quarry-special" },
] as const;
export const OPERATING_CONDITION_OPTIONS = [
  { label: "Магистраль", value: "long-haul" },
  { label: "Региональные маршруты", value: "regional" },
  { label: "Смешанный цикл", value: "mixed" },
  { label: "Карьер и бездорожье", value: "off-road" },
] as const;
export const AXLE_OPTIONS = [
  { label: "Рулевая", value: "steer" },
  { label: "Ведущая", value: "drive" },
  { label: "Прицепная", value: "trailer" },
] as const;

export type VehicleType = (typeof VEHICLE_TYPE_OPTIONS)[number]["value"];
export type OperatingCondition = (typeof OPERATING_CONDITION_OPTIONS)[number]["value"];
export type AxleChoice = (typeof AXLE_OPTIONS)[number]["value"];
```

Create `src/lib/catalog/tireReadModel.test.ts` with a fixture containing one ready TBR direction, one empty OTR direction and one draft model omitted by the mocked published query. Assert that the result contains only TBR and exposes model `href`, `sizes`, `documents`, `vehicleTypes`, `operatingConditions` and `axlePositions`.

- [ ] **Step 2: Run the focused test and confirm failure**

Run:

```powershell
npm.cmd run test:unit -- src/lib/catalog/tireReadModel.test.ts
```

Expected: FAIL because `buildTireCatalogReadModel` is missing.

- [ ] **Step 3: Extend Payload fields and stable public CMS shapes**

Add `selectionVehicleTypes` and `selectionConditions` as required `select` fields with `hasMany: true` to `TireTypes`. Add `selectionVehicleTypes`, `selectionConditions` and `selectionAxles` as `select` fields with `hasMany: true` to `TireModels`. Import the option arrays and domain types from `src/lib/selection/options.ts`; do not infer compatibility from display copy.

Extend `CmsTireModel` with:

```ts
export type CmsTireAdvantage = { title: string; description?: string };
export type CmsTireDocument = { url: string; title: string };

// fields added to CmsTireModel
gallery: string[];
advantages: CmsTireAdvantage[];
documents: CmsTireDocument[];
selectionVehicleTypes: VehicleType[];
selectionConditions: OperatingCondition[];
selectionAxles: AxleChoice[];
```

Extend `CmsTireType` with `selectionVehicleTypes` and `selectionConditions`. Update mappers to return empty arrays for missing optional legacy records and normalized arrays for filled records.

- [ ] **Step 4: Implement the read model**

Create `src/lib/catalog/tireReadModel.ts`:

```ts
import { getTireModelsByTypeSlug, getTireTypes, getTireVariantsByModelId } from "@/lib/cms";
import type { CmsTireModel, CmsTireType } from "@/lib/cms/types";

export type TireCatalogModel = CmsTireModel & {
  href: string;
  sizes: string[];
};
export type TireCatalogDirection = CmsTireType & { models: TireCatalogModel[] };
export type TireCatalogReadModel = { directions: TireCatalogDirection[] };

export async function buildTireCatalogReadModel(
  types: CmsTireType[],
  loadModels: (slug: string) => Promise<CmsTireModel[]>,
  loadSizes: (modelId: string) => Promise<string[]>,
): Promise<TireCatalogReadModel> {
  const directions = await Promise.all(types.map(async (type) => {
    const models = await loadModels(type.slug);
    const hydrated = await Promise.all(models.map(async (model) => ({
      ...model,
      href: `/models/${type.slug}/${model.slug}`,
      sizes: await loadSizes(model.id),
    })));
    return { ...type, models: hydrated };
  }));
  return { directions: directions.filter((direction) => direction.models.length > 0) };
}

export async function getPublishedTireCatalog(): Promise<TireCatalogReadModel> {
  return buildTireCatalogReadModel(
    await getTireTypes(),
    getTireModelsByTypeSlug,
    async (modelId) => (await getTireVariantsByModelId(modelId)).map((variant) => variant.size),
  );
}
```

Export the public types and `getPublishedTireCatalog` from `src/lib/cms/index.ts` or a dedicated catalog barrel without creating a client import of Payload server code.

- [ ] **Step 5: Generate Payload types, verify and commit**

Run:

```powershell
npm.cmd run generate:types
npm.cmd run test:unit -- src/lib/catalog/tireReadModel.test.ts
npx.cmd tsc --noEmit
npm.cmd run lint
```

Expected: generated types include the new fields; focused test PASS; typecheck and lint exit 0.

Commit:

```powershell
git add src/lib/selection/options.ts src/collections/TireTypes.ts src/collections/TireModels.ts src/lib/cms/types.ts src/lib/cms/payload/mappers.ts src/lib/catalog/tireReadModel.ts src/lib/catalog/tireReadModel.test.ts src/lib/cms/index.ts src/payload-types.ts
git commit -m "feat: add published tire catalog read model"
```

---

### Task 4: Premium catalog, URL filters и Product Theatre

**Files:**
- Create: `src/lib/catalog/tireFilters.ts`
- Create: `src/lib/catalog/tireFilters.test.ts`
- Create: `src/components/catalog/TireDirectionPage.tsx`
- Create: `src/components/catalog/TireCatalogFilters.tsx`
- Create: `src/components/catalog/TireModelCard.tsx`
- Create: `src/components/catalog/TireModelStage.tsx`
- Create: `src/components/catalog/TireCatalog.module.css`
- Modify: `src/components/catalog/TireVariantsTable.tsx`
- Modify: `src/app/(site)/models/page.tsx`
- Modify: `src/app/(site)/models/[tireTypeSlug]/page.tsx`
- Modify: `src/app/(site)/models/[tireTypeSlug]/[...segments]/page.tsx`
- Create: `e2e/catalog.spec.ts`

**Interfaces:**
- Produces: `parseTireFilters(searchParams)` and `filterTireModels(models, filters)`.
- Produces: canonical type route `/models/:type?application=&axle=&size=`.
- Preserves: category and model deep links supported by the catch-all route.
- Consumes: `TireCatalogDirection`, `TireCatalogModel`, existing request-item and variant-table interfaces.

- [ ] **Step 1: Write failing pure filter tests**

Create `src/lib/catalog/tireFilters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { filterTireModels, parseTireFilters } from "./tireFilters";

const models = [
  { slug: "regional-drive", applicationCategory: "regional", selectionAxles: ["drive"], sizes: ["315/80R22.5"] },
  { slug: "long-haul-steer", applicationCategory: "long-haul", selectionAxles: ["steer"], sizes: ["385/65R22.5"] },
] as const;

it("parses only known URL filters", () => {
  expect(parseTireFilters(new URLSearchParams("application=regional&axle=drive&junk=x"))).toEqual({ application: "regional", axle: "drive" });
});

it("combines application, axle and size filters", () => {
  expect(filterTireModels(models, { application: "regional", axle: "drive", size: "315/80R22.5" }).map((model) => model.slug)).toEqual(["regional-drive"]);
});
```

- [ ] **Step 2: Run the test and confirm missing implementation**

Run `npm.cmd run test:unit -- src/lib/catalog/tireFilters.test.ts`.

Expected: FAIL because `tireFilters.ts` does not exist.

- [ ] **Step 3: Implement filters and catalog components**

Create `tireFilters.ts` with a whitelist for application and axle values, trim the optional size, and apply all active filters with logical AND. `TireCatalogFilters` must submit GET parameters, retain active values after navigation, provide a visible `Сбросить фильтры` link, and use native `select`/`input` controls.

`TireDirectionPage` receives:

```ts
type TireDirectionPageProps = {
  direction: TireCatalogDirection;
  filters: TireFilters;
  categorySlug?: string;
};
```

It renders one light editorial hero, the filter form, a result count, the model grid and an honest empty state linking to `/contact?subject=tire-selection`. It does not add a separate dark hero.

`TireModelStage` receives `model`, full `variants`, `modelPath` and breadcrumbs. It renders the large image/gallery, key application/axle data, advantages, variant table, documents and CTA `/contact?model=<slug>&type=<typeSlug>`. Keep `AddToCartSection` and `QuickOrderSection` only if product owners still require tire cart behavior; otherwise remove their duplicate conversion points in this task.

- [ ] **Step 4: Rewire routes and write E2E coverage**

`/models` renders all ready directions from `getPublishedTireCatalog()`. `/models/[tireTypeSlug]` reads `searchParams` and renders `TireDirectionPage`. Category deep links in `[...segments]` render the same page with an application filter; model paths render `TireModelStage`. Add redirect/canonical handling so both `/models/tbr/model` and `/models/tbr/category/model` resolve to one canonical URL.

Create `e2e/catalog.spec.ts` asserting:

```ts
test("catalog filters survive reload and model detail exposes fitment CTA", async ({ page }) => {
  await page.goto("/models/tbr?application=regional&axle=drive");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("TBR");
  await expect(page.locator('select[name="application"]')).toHaveValue("regional");
  await expect(page.locator('select[name="axle"]')).toHaveValue("drive");
  const firstModel = page.locator('[data-tire-model-card] a').first();
  await firstModel.click();
  await expect(page.getByRole("link", { name: /проверить подбор/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
```

- [ ] **Step 5: Verify and commit the catalog slice**

Run:

```powershell
npm.cmd run test:unit -- src/lib/catalog/tireFilters.test.ts
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd playwright test e2e/catalog.spec.ts
```

Expected: all commands exit 0; filters persist through reload; existing category/model deep links return 200; no horizontal overflow at desktop and mobile projects.

Commit the exact task files with message:

```powershell
git commit -m "feat: redesign tire catalog journey"
```

---

### Task 5: Deterministic selection engine и URL-state

**Files:**
- Create: `src/lib/selection/types.ts`
- Modify: `src/lib/selection/options.ts`
- Create: `src/lib/selection/urlState.ts`
- Create: `src/lib/selection/urlState.test.ts`
- Create: `src/lib/selection/engine.ts`
- Create: `src/lib/selection/engine.test.ts`

**Interfaces:**
- Produces: `SelectionState`, `SelectionStep`, `SelectionMatch`, `SelectionResult` on top of the taxonomy types from Task 3.
- Produces: `parseSelectionParams`, `serializeSelectionParams`, `getFirstMissingStep`.
- Produces: `recommendTires(catalog, state): SelectionResult` with `matches` or `consultation`.
- Consumes: `TireCatalogReadModel` from Task 3.

- [ ] **Step 1: Define public types and failing URL tests**

Create `types.ts`:

```ts
import type { AxleChoice as CatalogAxleChoice, OperatingCondition, VehicleType } from "./options";

export type { OperatingCondition, VehicleType } from "./options";
export type AxleChoice = CatalogAxleChoice | "unknown";
export type SelectionStep = "vehicle" | "conditions" | "fitment" | "result";
export type SelectionState = {
  vehicle?: VehicleType;
  conditions: OperatingCondition[];
  axle?: AxleChoice;
  size?: string;
  sizeKnown?: boolean;
};
export type SelectionMatch = { modelId: string; modelSlug: string; href: string; score: number; reasons: string[] };
export type SelectionResult =
  | { kind: "matches"; directionSlug: string; matches: SelectionMatch[]; requiresSpecialistCheck: true }
  | { kind: "consultation"; directionSlug?: string; reason: string; requiresSpecialistCheck: true };
```

Write tests proving invalid values are dropped, repeated `condition` parameters round-trip, size is preserved only when `sizeKnown=true`, and incomplete state returns the first missing step.

- [ ] **Step 2: Implement and verify URL-state**

Implement `parseSelectionParams(source: Pick<URLSearchParams, "get" | "getAll">): SelectionState`, `serializeSelectionParams(state): URLSearchParams` and `getFirstMissingStep(state): SelectionStep`. Use keys `vehicle`, `condition`, `axle`, `sizeKnown` and `size`; never accept contact keys.

Run:

```powershell
npm.cmd run test:unit -- src/lib/selection/urlState.test.ts
```

Expected: PASS.

- [ ] **Step 3: Write failing recommendation tests**

Cover these exact cases in `engine.test.ts`:

1. Highway tractor + long-haul + steer ranks a compatible TBR steer model first.
2. Known exact size adds a reason but never changes `requiresSpecialistCheck: true`.
3. Unknown axle still returns up to three models without pretending axle compatibility.
4. No compatible model returns `kind: "consultation"` and the closest direction when one exists.
5. Empty catalog returns consultation without a direction and without synthetic products.

- [ ] **Step 4: Implement deterministic scoring**

Use explicit weights and stable tie-breaking:

```ts
const SCORE = { vehicle: 40, condition: 30, axle: 20, size: 30 } as const;

export function recommendTires(catalog: TireCatalogReadModel, state: SelectionState): SelectionResult {
  const candidates = catalog.directions.flatMap((direction) => direction.models.map((model) => {
    const reasons: string[] = [];
    let score = 0;
    if (state.vehicle && model.selectionVehicleTypes.includes(state.vehicle)) { score += SCORE.vehicle; reasons.push("Подходит для выбранной техники"); }
    for (const condition of state.conditions) if (model.selectionConditions.includes(condition)) { score += SCORE.condition; reasons.push("Учитывает условия эксплуатации"); break; }
    if (state.axle && state.axle !== "unknown" && model.selectionAxles.includes(state.axle)) { score += SCORE.axle; reasons.push("Соответствует выбранной оси"); }
    if (state.sizeKnown && state.size && model.sizes.includes(state.size)) { score += SCORE.size; reasons.push("Есть совпадающий типоразмер в опубликованной линейке"); }
    return { direction, model, score, reasons };
  }));
  const ranked = candidates.filter((candidate) => candidate.score > 0).sort((a, b) => b.score - a.score || a.model.name.localeCompare(b.model.name, "ru"));
  if (!ranked.length) return { kind: "consultation", reason: "Точного совпадения в опубликованном каталоге нет", requiresSpecialistCheck: true };
  const directionSlug = ranked[0].direction.slug;
  const matches = ranked.filter((candidate) => candidate.direction.slug === directionSlug).slice(0, 3).map(({ model, score, reasons }) => ({ modelId: model.id, modelSlug: model.slug, href: model.href, score, reasons }));
  return { kind: "matches", directionSlug, matches, requiresSpecialistCheck: true };
}
```

If candidates match a direction but no model clears the minimum evidence threshold, return that direction through `consultation`; do not lower the threshold to force products.

- [ ] **Step 5: Verify and commit pure selection logic**

Run:

```powershell
npm.cmd run test:unit -- src/lib/selection
npx.cmd tsc --noEmit
npm.cmd run lint
```

Expected: all selection tests PASS; typecheck and lint exit 0.

Commit:

```powershell
git add src/lib/selection
git commit -m "feat: add deterministic tire selection engine"
```

---

### Task 6: Accessible `/selection` wizard

**Files:**
- Create: `src/app/(site)/selection/page.tsx`
- Create: `src/components/selection/SelectionWizard.tsx`
- Create: `src/components/selection/SelectionProgress.tsx`
- Create: `src/components/selection/VehicleTypeStep.tsx`
- Create: `src/components/selection/OperatingConditionsStep.tsx`
- Create: `src/components/selection/FitmentStep.tsx`
- Create: `src/components/selection/SelectionResult.tsx`
- Create: `src/components/selection/Selection.module.css`
- Modify: `src/constants/navigation.js`
- Modify: `src/app/sitemap.ts`
- Create: `e2e/selection-request.spec.ts` with selection-only tests first

**Interfaces:**
- `SelectionWizard({ catalog, initialState })` is the only client state owner.
- Every step calls `onChange(nextState)`; the wizard serializes state and uses `router.push`.
- `SelectionResult` receives the pure `SelectionResult` and catalog lookup data; it never scores models.

- [ ] **Step 1: Write failing navigation and history tests**

Start `e2e/selection-request.spec.ts` with:

```ts
import { expect, test } from "@playwright/test";

test("selection state is shareable and restored by browser history", async ({ page }) => {
  await page.goto("/selection");
  await page.getByRole("radio", { name: "Магистральный тягач" }).check();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page).toHaveURL(/vehicle=long-haul-tractor/);
  await page.getByRole("checkbox", { name: "Магистраль" }).check();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page).toHaveURL(/condition=long-haul/);
  await page.goBack();
  await expect(page.getByRole("checkbox", { name: "Магистраль" })).toBeChecked();
});
```

Add tests that an incomplete deep link focuses the first missing question and `Не знаю` allows the fitment step to complete.

- [ ] **Step 2: Run the E2E file and verify route failure**

Run `npm.cmd run build` and `npx.cmd playwright test e2e/selection-request.spec.ts`.

Expected: FAIL with 404 or missing heading for `/selection`.

- [ ] **Step 3: Build the server entry and wizard**

`selection/page.tsx` must load `getPublishedTireCatalog()`, parse `searchParams`, generate metadata and render an honest CMS-unavailable/empty-catalog state with a direct contact link.

`SelectionWizard` uses semantic `fieldset` and `legend` in each step. It derives the active step from `getFirstMissingStep(initialState)` and from the current `useSearchParams()` value. On change it calls:

```ts
const updateUrl = (next: SelectionState) => {
  const query = serializeSelectionParams(next).toString();
  router.push(query ? `/selection?${query}` : "/selection", { scroll: false });
};
```

The progress label must be text (`Шаг 2 из 3`) as well as visual. Each screen has `Назад` and `Продолжить`; the result shows 1–3 models or consultation fallback plus the persistent message `Финальную совместимость и наличие подтверждает специалист BIZON`.

- [ ] **Step 4: Add result-to-contact handoff**

Build the contact URL by cloning the selection parameters and appending only `model` slugs selected by the visitor. The CTA label is `Передать подбор специалисту`. Do not append names, phone, email or free-form comments.

- [ ] **Step 5: Verify accessibility, history and commit**

Run:

```powershell
npm.cmd run test:unit -- src/lib/selection
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd playwright test e2e/selection-request.spec.ts
```

Expected: full selection navigation tests PASS on desktop and mobile; Back restores choices; there is no horizontal overflow.

Commit:

```powershell
git add "src/app/(site)/selection/page.tsx" src/components/selection src/constants/navigation.js src/app/sitemap.ts e2e/selection-request.spec.ts
git commit -m "feat: add URL backed tire selection flow"
```

---

### Task 7: Adaptive contact page, structured context и inline confirmation

**Files:**
- Create: `src/lib/requests/selectionContext.ts`
- Create: `src/lib/requests/selectionContext.test.ts`
- Modify: `src/lib/requests/types.ts`
- Modify: `src/lib/requests/normalizeRequest.ts`
- Modify: `src/lib/requests/validateRequest.ts`
- Modify: `src/types/requestItem.ts`
- Modify: `src/collections/Requests.ts`
- Modify: `src/components/forms/ContactForm.tsx`
- Create: `src/components/forms/ContextualContactForm.tsx`
- Create: `src/components/forms/ContextualContactForm.module.css`
- Create: `src/components/selection/RequestContextSummary.tsx`
- Modify: `src/app/(site)/contact/page.tsx`
- Modify: `src/lib/requests/submitRequest.ts`
- Modify: `e2e/selection-request.spec.ts`
- Modify: `src/payload-types.ts` through generation

**Interfaces:**
- Produces: `NormalizedSelectionContext` with whitelisted non-personal keys.
- Extends: `IncomingRequestBody.selectionContext` and `NormalizedRequest.selectionContext`.
- Extends: `SourceForm` with `tire_selection`.
- `submitRequest()` returns typed `ApiRequestSuccess` containing `requestId`.
- Direct `/contact` remains generic; selection/model query renders a context summary.

- [ ] **Step 1: Write failing context-normalization tests**

Create `selectionContext.test.ts` proving:

```ts
it("keeps only non-personal selection values", () => {
  expect(normalizeSelectionContext({
    vehicle: "regional-truck",
    conditions: ["regional"],
    axle: "drive",
    size: "315/80R22.5",
    modelSlugs: ["dsr158"],
    phone: "+7 999 000-00-00",
  })).toEqual({
    vehicle: "regional-truck",
    conditions: ["regional"],
    axle: "drive",
    size: "315/80R22.5",
    modelSlugs: ["dsr158"],
  });
});
```

Also test rejection of unknown enum values, more than three model slugs and strings beyond field limits.

- [ ] **Step 2: Implement structured normalization and Payload storage**

Add a `selectionContext` JSON field to `Requests`, read-only in admin. Define:

```ts
export type NormalizedSelectionContext = {
  vehicle?: VehicleType;
  conditions: OperatingCondition[];
  axle?: AxleChoice;
  size?: string;
  modelSlugs: string[];
};
```

`normalizeSelectionContext(raw)` must construct a new object from allowed properties; never spread the incoming object. Attach the result in `normalizeRequest()` and `toPayloadRequestData()`. Add `{ label: "Подбор шин", value: "tire_selection" }` to `SOURCE_FORMS`.

- [ ] **Step 3: Write the failing request confirmation E2E**

Intercept the API so the test does not create a real Payload record:

```ts
await page.route("**/api/requests", async (route) => {
  const body = route.request().postDataJSON();
  expect(body.selectionContext.vehicle).toBe("long-haul-tractor");
  expect(body.phone).toBe("+7 999 123-45-67");
  await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true, requestId: "BZN-1042", message: "Request created successfully" }) });
});
```

Complete the selection, open contact, fill `Имя` and `Телефон`, submit, then assert heading `Заявка BZN-1042 принята`, visible submitted summary and links back to the recommended model and catalog.

- [ ] **Step 4: Implement the adaptive form**

`contact/page.tsx` parses selection parameters with `parseSelectionParams`, validates optional `model` values against the published catalog and passes `context` to `ContextualContactForm`. A direct visit passes `undefined` and renders the generic heading.

The form fields are:

- `Имя`, required
- `Телефон` and `Email`, at least one required by server validation
- `Компания`, optional
- `Комментарий`, optional

Do not require `message`. Keep entered values in React state or the mounted form on errors. On success, replace only the form panel with confirmation; do not reset before rendering the submitted summary. Use the typed result:

```ts
export async function submitRequest(options: SubmitRequestOptions): Promise<ApiRequestSuccess> {
  // existing fetch and error handling
  return data as ApiRequestSuccess;
}
```

Render API errors in `role="alert"`, keep retry available, and disable submit only while the request is active.

- [ ] **Step 5: Generate types, verify and commit**

Run:

```powershell
npm.cmd run generate:types
npm.cmd run test:unit -- src/lib/requests/selectionContext.test.ts src/lib/selection
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd playwright test e2e/selection-request.spec.ts
```

Expected: all commands exit 0; API interception receives structured context; success UI contains request id; error test retains values and allows retry.

Commit:

```powershell
git add src/lib/requests src/types/requestItem.ts src/collections/Requests.ts src/components/forms src/components/selection/RequestContextSummary.tsx "src/app/(site)/contact/page.tsx" e2e/selection-request.spec.ts src/payload-types.ts
git commit -m "feat: add contextual tire request flow"
```

---

### Task 8: Seven-act premium homepage

**Files:**
- Create: `src/components/main/MainHero.tsx`
- Create: `src/components/main/TireSelectionEntry.tsx`
- Create: `src/components/main/TireDirectionShowcase.tsx`
- Create: `src/components/main/EditorialHighlights.tsx`
- Create: `src/components/main/BrandingCampaign.tsx`
- Create: `src/components/main/ShopCampaign.tsx`
- Create: `src/components/main/SelectionResumeCallout.tsx`
- Create: `src/components/main/MainHome.module.css`
- Modify: `src/app/(site)/page.tsx`
- Modify: `src/constants/images.ts`
- Remove from home composition only: old `Hero`, `ProductsSection`, `ApplicationsSection`, `FeaturesSection`, `AccessoriesSection`, `HomeContentSections`, `ContactSection`
- Create: `e2e/public-site-visual.spec.ts`

**Interfaces:**
- `HomePage` loads catalog, one published Tire IQ article and one published People Story in parallel.
- `TireSelectionEntry` links each vehicle card to `/selection?vehicle=<value>`.
- `TireDirectionShowcase` accepts only ready `TireCatalogDirection[]`.
- Existing old components may remain for adjacent pages, but are no longer imported by home.

- [ ] **Step 1: Write the failing homepage architecture tests**

Create `e2e/public-site-visual.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("homepage follows the approved seven-act hierarchy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ресурс для реальной работы" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Для какой техники нужны шины?" })).toBeVisible();
  await expect(page.locator('[data-home-tone="dark"]')).toHaveCount(2);
  await expect(page.getByRole("heading", { level: 2, name: /Tire IQ и People Stories/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /Индивидуальное брендирование/ })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /BIZON Shop/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Подобрать шины", exact: true }).first()).toHaveAttribute("href", "/selection");
});
```

Add an assertion that old standalone headings `Надёжность`, `Экономичность`, `Сервис` and `Популярные TBR-модели` are absent.

- [ ] **Step 2: Run E2E and confirm current homepage fails**

Run `npm.cmd run build` and `npx.cmd playwright test e2e/public-site-visual.spec.ts --project=desktop`.

Expected: FAIL because the old ten-section composition is still active.

- [ ] **Step 3: Implement the light hero and visible selection entry**

`MainHero` uses the approved copy, a white section and a separate panoramic media frame using an approved `PREMIUM_MEDIA` asset. Mark it `data-main-chrome-tone="light"`. Both hero and first selection block remain light.

`TireSelectionEntry` renders four semantic links/cards from `VEHICLE_TYPE_OPTIONS`; each has an application description, 44 px target and URL containing only the vehicle answer.

- [ ] **Step 4: Implement both dark accents and three light editorial acts**

`TireDirectionShowcase` is the first and only catalog dark section. It displays every ready direction, its use case and at most three representative published models. Copy is `Доступно к заказу`; adjacent helper text states that size availability is confirmed by a specialist.

`EditorialHighlights`, `BrandingCampaign` and `SelectionResumeCallout` remain light. `EditorialHighlights` omits missing unpublished items rather than showing demo cards. `ShopCampaign` is the second and final dark section, links to `/shop`, and does not render a Shop product grid.

Apply both `data-home-tone="dark"` for the test and `data-main-chrome-tone="dark"` for navbar tone. All other homepage sections use `light`.

- [ ] **Step 5: Replace the homepage composition**

`HomePage` should have this server-side data flow:

```tsx
export default async function HomePage() {
  const [catalog, articles, stories] = await Promise.all([
    getPublishedTireCatalog(),
    getTireIQArticles(),
    getPeopleStories(),
  ]);
  return (
    <>
      <MainHero />
      <TireSelectionEntry />
      <TireDirectionShowcase directions={catalog.directions} />
      <EditorialHighlights article={articles[0]} story={stories[0]} />
      <BrandingCampaign />
      <ShopCampaign />
      <SelectionResumeCallout />
    </>
  );
}
```

Do not delete old components if other routes import them. Remove only obsolete imports and home composition.

- [ ] **Step 6: Verify homepage and commit**

Run:

```powershell
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npx.cmd playwright test e2e/public-site-visual.spec.ts e2e/main-chrome.spec.ts
```

Expected: homepage test PASS in both Playwright projects; exactly two dark sections; no old generic proof-card headings; navbar changes tone over dark accents.

Commit:

```powershell
git add "src/app/(site)/page.tsx" src/components/main src/constants/images.ts e2e/public-site-visual.spec.ts
git commit -m "feat: build premium bizon homepage"
```

---

### Task 9: Empty/error states, responsive matrix и final release gate

**Files:**
- Modify: `src/app/(site)/models/page.tsx`
- Modify: `src/app/(site)/models/[tireTypeSlug]/page.tsx`
- Modify: `src/app/(site)/selection/page.tsx`
- Modify: `src/components/catalog/TireDirectionPage.tsx`
- Modify: `src/components/selection/SelectionWizard.tsx`
- Modify: `src/components/forms/ContextualContactForm.tsx`
- Modify: `src/app/globals.css`
- Modify: `playwright.config.ts`
- Modify: `e2e/catalog.spec.ts`
- Modify: `e2e/selection-request.spec.ts`
- Modify: `e2e/public-site-visual.spec.ts`
- Modify: `.cursor/rules/bizon-design-system.mdc`
- Modify: `README.md`

**Interfaces:**
- Preserves every public interface from Tasks 1–8.
- Produces a release matrix covering 390, 768, 1024 and 1440 px.
- Produces one current design canon matching Coral/Mint/Neutral and light-first behavior.

- [ ] **Step 1: Add explicit failure-path E2E tests**

Add tests for:

- empty published catalog: visible consultation state, no synthetic model card
- incomplete `/selection?vehicle=regional-truck`: focus on conditions step
- no model match: closest direction plus specialist CTA, no exact-model claim
- `/api/requests` 500: entered name/contact remain, `role="alert"` visible, retry succeeds
- long Russian heading: no clipping or horizontal overflow
- reduced motion: computed transition/animation duration is effectively disabled for decorative media

Use route interception or injected fixtures; do not mutate production CMS data during browser tests.

- [ ] **Step 2: Expand the viewport projects**

Update `playwright.config.ts` projects to exact viewports:

```ts
projects: [
  { name: "mobile-390", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  { name: "tablet-768", use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
  { name: "laptop-1024", use: { viewport: { width: 1024, height: 900 } } },
  { name: "desktop-1440", use: { viewport: { width: 1440, height: 1000 } } },
]
```

Update existing project-name skips such as the Shop desktop dropdown test to match `desktop-1440` and `laptop-1024` intentionally.

- [ ] **Step 3: Implement the tested states and motion contract**

Every server data load must distinguish `[]` from an exception. For exceptions, log server details, render concise user copy and keep `/contact` reachable. For empty data, state that the catalog is being verified without inventing dates or models.

Add or confirm:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Verify focus order manually after automated tests: skip link, burger, navbar, selection fields, filters, variant table and form.

- [ ] **Step 4: Align documentation with the implemented canon**

Update `.cursor/rules/bizon-design-system.mdc` and the relevant README design section so they state:

- single light runtime theme
- Coral action, Mint technical/focus, Neutral foundation
- two intentional black homepage accents
- shared chrome geometry with surface-specific content
- deterministic selection and published-CMS-only catalog semantics

Remove conflicting amber/yellow or global-dark guidance. Do not document unimplemented future page redesigns as complete.

- [ ] **Step 5: Run the complete automated gate**

Run in this order:

```powershell
npm.cmd run test:unit
npm.cmd run lint
npx.cmd tsc --noEmit
npm.cmd run build
npm.cmd run verify:shop
npm.cmd run verify:site
npm.cmd run test:e2e
```

Expected before release:

- unit tests: 0 failures
- lint: exit 0
- TypeScript: exit 0
- build: exit 0
- Shop readiness: exit 0
- public-site readiness: exit 0 with real environment contacts and valid assets
- Playwright: all four viewport projects pass; only explicitly documented irrelevant skips remain

If either readiness command fails, report the exact issue codes and keep the release blocked. Do not weaken the verifier or substitute demo content.

- [ ] **Step 6: Perform manual visual and content QA**

Inspect `/`, `/models`, each published direction, one model detail, `/selection`, generic `/contact`, contextual `/contact`, `/shop`, burger and cart at 390, 768, 1024 and 1440 px.

Confirm:

- homepage is white-first and has exactly two black sections
- MainChrome and ShopChrome share geometry but not content
- published directions only; no `Скоро` cards
- availability copy means assortment, not stock
- recommendation appears before contact fields
- all error paths preserve an escape to consultation
- request success includes the actual `requestId`
- real phone/email/site URL are visible
- metadata and structured data reference committed assets

- [ ] **Step 7: Commit the hardening slice**

```powershell
git add "src/app/(site)/models/page.tsx" "src/app/(site)/models/[tireTypeSlug]/page.tsx" "src/app/(site)/selection/page.tsx" src/components/catalog/TireDirectionPage.tsx src/components/selection/SelectionWizard.tsx src/components/forms/ContextualContactForm.tsx src/app/globals.css playwright.config.ts e2e .cursor/rules/bizon-design-system.mdc README.md
git commit -m "test: harden premium public site journey"
```

Do not deploy. Stop after the verified commit and present the release blockers or green gate evidence to the user.

---

## Implementation checkpoints

1. **Foundation checkpoint:** Tasks 1–3 — release verifier, shared chrome and published read model.
2. **Catalog checkpoint:** Task 4 — usable premium catalog and model detail without the selection wizard.
3. **Conversion checkpoint:** Tasks 5–7 — deterministic selection through contextual request confirmation.
4. **Experience checkpoint:** Tasks 8–9 — seven-act homepage, responsive/accessibility hardening and complete gates.

At each checkpoint, review the rendered desktop and mobile slice before proceeding. A failed readiness gate blocks release but does not justify demo data or weakened validation.
