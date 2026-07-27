/**
 * Upserts all registry page keys. home + shop-home published with copy from defaults;
 * other keys draft stubs.
 *
 *   cross-env DATABASE_URI=... npm run seed:pages
 */
import { getPayload } from "../src/lib/payload/getPayload";
import { HOME_PAGE_DEFAULTS } from "../src/lib/cms/pages/defaults/home";
import { SHOP_HOME_PAGE_DEFAULTS } from "../src/lib/cms/pages/defaults/shopHome";
import { PAGE_REGISTRY } from "../src/lib/cms/pages/registry";

function homeSeedData() {
  const d = HOME_PAGE_DEFAULTS;
  return {
    homeHero: {
      eyebrow: d.hero.eyebrow,
      title: d.hero.title,
      lead: d.hero.lead,
      imageAlt: d.hero.imageAlt,
      primaryCta: d.hero.primaryCta,
      secondaryCta: d.hero.secondaryCta,
      metricLabel: d.hero.metricLabel,
      metricText: d.hero.metricText,
    },
    homeSelectionEntry: d.selectionEntry,
    homeDirections: d.directions,
    homeExpertise: d.expertise,
    homeShopCampaign: {
      eyebrow: d.shopCampaign.eyebrow,
      title: d.shopCampaign.title,
      lead: d.shopCampaign.lead,
      imageAlt: d.shopCampaign.imageAlt,
      cta: d.shopCampaign.cta,
    },
    homeResume: {
      eyebrow: d.resume.eyebrow,
      title: d.resume.title,
      lead: d.resume.lead,
      primaryCta: d.resume.primaryCta,
      secondaryCta: d.resume.secondaryCta,
    },
    status: "published" as const,
  };
}

function shopHomeSeedData() {
  const d = SHOP_HOME_PAGE_DEFAULTS;
  return {
    shopHero: {
      eyebrow: d.hero.eyebrow,
      title: d.hero.title,
      lead: d.hero.lead,
      imageAlt: d.hero.imageAlt,
      cta: d.hero.cta,
    },
    shopWheelsIntro: {
      kicker: d.wheelsIntro.kicker,
      eyebrow: d.wheelsIntro.eyebrow,
      title: d.wheelsIntro.title,
      lead: d.wheelsIntro.lead,
    },
    shopOrderSteps: d.orderSteps.map((step) => ({
      title: step.title,
      description: step.description,
    })),
    // Carousel/vehicle images stay on code defaults until Media is linked in admin.
    shopVehicles: {
      eyebrow: d.vehicles.eyebrow,
      title: d.vehicles.title,
      lead: d.vehicles.lead,
      cta: d.vehicles.cta,
    },
    status: "published" as const,
  };
}

console.log("seed-pages: connecting…");
const payload = await getPayload();

for (const entry of PAGE_REGISTRY) {
  const existing = await payload.find({
    collection: "pages",
    where: { key: { equals: entry.key } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const base = {
    key: entry.key,
    title: entry.title,
    path: entry.path,
  };

  const sectionData =
    entry.key === "home"
      ? homeSeedData()
      : entry.key === "shop-home"
        ? shopHomeSeedData()
        : {
            stubHero: {
              eyebrow: "BIZON",
              title: entry.title,
              lead: "",
              imageAlt: entry.title,
            },
            status: "draft" as const,
          };

  if (existing.docs[0]) {
    await payload.update({
      collection: "pages",
      id: existing.docs[0].id,
      data: { ...base, ...sectionData },
      overrideAccess: true,
    });
    console.log(`updated ${entry.key} (${sectionData.status})`);
  } else {
    await payload.create({
      collection: "pages",
      data: { ...base, ...sectionData },
      overrideAccess: true,
    });
    console.log(`created ${entry.key} (${sectionData.status})`);
  }
}

console.log("seed-pages: done");
process.exit(0);
