import { resolveMediaUrl } from "@/lib/cms/media";
import type { Media } from "@/payload-types";

import type { PageKey } from "./keys";
import type {
  PageCta,
  PageShell,
  ShopCategorySlide,
  ShopOrderStep,
  ShopVehicleSlide,
} from "./types";

type LooseDoc = Record<string, unknown>;

function asGroup(value: unknown): LooseDoc | null {
  return value && typeof value === "object" ? (value as LooseDoc) : null;
}

function mediaUrl(value: unknown): string | null {
  return resolveMediaUrl(value as Media | number | null | undefined);
}

function mapCta(value: unknown): Partial<PageCta> | undefined {
  const group = asGroup(value);
  if (!group) return undefined;
  return {
    label: typeof group.label === "string" ? group.label : undefined,
    href: typeof group.href === "string" ? group.href : undefined,
  };
}

function mapShell(value: unknown): Partial<PageShell> | undefined {
  const group = asGroup(value);
  if (!group) return undefined;
  return {
    eyebrow: typeof group.eyebrow === "string" ? group.eyebrow : undefined,
    title: typeof group.title === "string" ? group.title : undefined,
    lead: typeof group.lead === "string" ? group.lead : undefined,
  };
}

function seoFromDoc(doc: LooseDoc): { seoTitle?: string; seoDescription?: string } {
  const seo = asGroup(doc.seo);
  return {
    seoTitle:
      typeof seo?.seoTitle === "string"
        ? seo.seoTitle
        : typeof seo?.metaTitle === "string"
          ? seo.metaTitle
          : undefined,
    seoDescription:
      typeof seo?.seoDescription === "string"
        ? seo.seoDescription
        : typeof seo?.metaDescription === "string"
          ? seo.metaDescription
          : undefined,
  };
}

export function mapHomePatch(doc: LooseDoc) {
  const hero = asGroup(doc.homeHero);
  const shopCampaign = asGroup(doc.homeShopCampaign);
  const resume = asGroup(doc.homeResume);
  return {
    ...seoFromDoc(doc),
    hero: hero
      ? {
          ...mapShell(hero),
          imageUrl: mediaUrl(hero.image) ?? undefined,
          imageAlt: typeof hero.imageAlt === "string" ? hero.imageAlt : undefined,
          primaryCta: mapCta(hero.primaryCta),
          secondaryCta: mapCta(hero.secondaryCta),
          metricLabel: typeof hero.metricLabel === "string" ? hero.metricLabel : undefined,
          metricText: typeof hero.metricText === "string" ? hero.metricText : undefined,
        }
      : undefined,
    selectionEntry: mapShell(doc.homeSelectionEntry),
    directions: mapShell(doc.homeDirections),
    expertise: mapShell(doc.homeExpertise),
    shopCampaign: shopCampaign
      ? {
          ...mapShell(shopCampaign),
          imageUrl: mediaUrl(shopCampaign.image) ?? undefined,
          imageAlt:
            typeof shopCampaign.imageAlt === "string" ? shopCampaign.imageAlt : undefined,
          cta: mapCta(shopCampaign.cta),
        }
      : undefined,
    resume: resume
      ? {
          ...mapShell(resume),
          primaryCta: mapCta(resume.primaryCta),
          secondaryCta: mapCta(resume.secondaryCta),
        }
      : undefined,
  };
}

export function mapShopHomePatch(doc: LooseDoc) {
  const hero = asGroup(doc.shopHero);
  const wheelsIntro = asGroup(doc.shopWheelsIntro);
  const vehicles = asGroup(doc.shopVehicles);

  const orderStepsRaw = Array.isArray(doc.shopOrderSteps) ? doc.shopOrderSteps : [];
  const orderSteps: ShopOrderStep[] = orderStepsRaw
    .map((row) => {
      const item = asGroup(row);
      if (!item) return null;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description =
        typeof item.description === "string" ? item.description.trim() : "";
      if (!title && !description) return null;
      return { title, description };
    })
    .filter((row): row is ShopOrderStep => Boolean(row));

  const carouselRaw = Array.isArray(doc.shopCategoryCarousel)
    ? doc.shopCategoryCarousel
    : [];
  const categoryCarousel: ShopCategorySlide[] = carouselRaw
    .map((row, index) => {
      const item = asGroup(row);
      if (!item) return null;
      const desktopImage = mediaUrl(item.desktopImage);
      const mobileImage = mediaUrl(item.mobileImage) ?? desktopImage;
      if (!desktopImage) return null;
      return {
        id:
          typeof item.slideId === "string" && item.slideId.trim()
            ? item.slideId.trim()
            : `slide-${index + 1}`,
        kicker: typeof item.kicker === "string" ? item.kicker : "",
        title: typeof item.title === "string" ? item.title : "",
        action: typeof item.action === "string" ? item.action : "",
        href: typeof item.href === "string" ? item.href : "#",
        desktopImage,
        mobileImage: mobileImage ?? desktopImage,
        alt: typeof item.alt === "string" ? item.alt : "",
      };
    })
    .filter((row): row is ShopCategorySlide => Boolean(row));

  const vehicleSlidesRaw = Array.isArray(vehicles?.slides) ? vehicles.slides : [];
  const vehicleSlides: ShopVehicleSlide[] = vehicleSlidesRaw
    .map((row) => {
      const item = asGroup(row);
      if (!item) return null;
      const image = mediaUrl(item.image);
      if (!image) return null;
      return {
        title: typeof item.title === "string" ? item.title : "",
        image,
        alt: typeof item.alt === "string" ? item.alt : "",
      };
    })
    .filter((row): row is ShopVehicleSlide => Boolean(row));

  return {
    ...seoFromDoc(doc),
    hero: hero
      ? {
          ...mapShell(hero),
          imageUrl: mediaUrl(hero.image) ?? undefined,
          imageAlt: typeof hero.imageAlt === "string" ? hero.imageAlt : undefined,
          cta: mapCta(hero.cta),
        }
      : undefined,
    wheelsIntro: wheelsIntro
      ? {
          ...mapShell(wheelsIntro),
          kicker: typeof wheelsIntro.kicker === "string" ? wheelsIntro.kicker : undefined,
        }
      : undefined,
    orderSteps,
    categoryCarousel,
    vehicles: vehicles
      ? {
          ...mapShell(vehicles),
          cta: mapCta(vehicles.cta),
          slides: vehicleSlides,
        }
      : undefined,
  };
}

export function mapStubPatch(doc: LooseDoc) {
  const hero = asGroup(doc.stubHero);
  return {
    ...seoFromDoc(doc),
    hero: hero
      ? {
          ...mapShell(hero),
          imageUrl: mediaUrl(hero.image),
          imageAlt: typeof hero.imageAlt === "string" ? hero.imageAlt : undefined,
        }
      : undefined,
  };
}

export function pageKeyFromDoc(doc: LooseDoc): PageKey | null {
  return typeof doc.key === "string" ? (doc.key as PageKey) : null;
}
