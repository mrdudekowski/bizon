import type {
  Product,
  ShopCategory,
  TireModel,
  TireType,
  TireVariant,
  WheelModel,
  WheelType,
  WheelVariant,
} from "@/payload-types";

import type {
  CmsProduct,
  CmsShopCategory,
  CmsTireModel,
  CmsTireType,
  CmsTireVariant,
  CmsWheelModel,
  CmsWheelType,
  CmsWheelVariant,
} from "../types";
import { formatPublishedDate, lexicalToPlainText } from "./richText";
import { resolveMedia } from "../media";

const DEFAULT_BRAND = "DOUBLESTAR";

export function resolveRelationSlug(
  relation: number | { slug?: string | null } | null | undefined,
): string | null {
  if (relation && typeof relation === "object" && typeof relation.slug === "string") {
    return relation.slug;
  }
  return null;
}

function resolveRelationName(
  relation: number | { name?: string | null; slug?: string | null } | null | undefined,
): string {
  if (relation && typeof relation === "object") {
    if (typeof relation.name === "string" && relation.name.trim()) return relation.name.trim();
    if (typeof relation.slug === "string") return relation.slug;
  }
  return "";
}

export function mapProduct(doc: Product): CmsProduct {
  const categorySlug = resolveRelationSlug(doc.shopCategory) ?? "";
  const descriptionShort = doc.shortDescription?.trim() || doc.name;
  const descriptionLong =
    lexicalToPlainText(doc.fullDescription) || doc.shortDescription?.trim() || doc.name;

  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    categorySlug,
    type: categorySlug,
    brand: DEFAULT_BRAND,
    descriptionShort,
    descriptionLong,
  };
}

export function mapTireType(doc: TireType): CmsTireType {
  return {
    slug: doc.slug,
    name: doc.name,
    description: doc.description?.trim() || doc.name,
    shortDescription: doc.shortDescription?.trim() || doc.description?.trim() || doc.name,
    sortOrder: doc.sortOrder ?? 0,
    showInMenu: doc.showInMenu ?? true,
  };
}

export function mapTireModelDetail(doc: TireModel): CmsTireModel {
  const tireTypeSlug = resolveRelationSlug(doc.tireType) ?? "";
  const descriptionShort =
    doc.shortDescription?.trim() ||
    doc.application?.trim() ||
    doc.treadType?.trim() ||
    doc.name;
  const descriptionLong =
    lexicalToPlainText(doc.fullDescription) || doc.shortDescription?.trim() || descriptionShort;

  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    tireTypeSlug,
    tireTypeName: resolveRelationName(doc.tireType) || tireTypeSlug,
    applicationCategory: doc.applicationCategory,
    brand: doc.series?.trim() || DEFAULT_BRAND,
    descriptionShort,
    descriptionLong,
    application: doc.application?.trim() || undefined,
    axlePosition: doc.axlePosition?.trim() || undefined,
    treadType: doc.treadType?.trim() || undefined,
  };
}

export function mapTireModel(doc: TireModel): CmsProduct {
  const detail = mapTireModelDetail(doc);
  return {
    slug: detail.slug,
    name: detail.name,
    categorySlug: detail.tireTypeSlug,
    type: detail.tireTypeSlug,
    brand: detail.brand,
    descriptionShort: detail.descriptionShort,
    descriptionLong: detail.descriptionLong,
  };
}

export function mapTireVariant(doc: TireVariant): CmsTireVariant {
  return {
    id: String(doc.id),
    size: doc.size,
    rimDiameter: doc.rimDiameter ?? undefined,
    loadIndex: doc.loadIndex?.trim() || undefined,
    speedIndex: doc.speedIndex?.trim() || undefined,
    plyRating: doc.plyRating?.trim() || undefined,
    overallDiameter: doc.overallDiameter ?? undefined,
    weight: doc.weight ?? undefined,
    recommendedRim: doc.recommendedRim?.trim() || undefined,
    available: doc.available ?? true,
    price: doc.price ?? undefined,
    priceOnRequest: doc.priceOnRequest ?? true,
  };
}

export function mapWheelType(doc: WheelType): CmsWheelType {
  return {
    slug: doc.slug,
    name: doc.name,
    description: doc.description?.trim() || doc.name,
    shortDescription: doc.shortDescription?.trim() || doc.description?.trim() || doc.name,
    sortOrder: doc.sortOrder ?? 0,
  };
}

export function mapWheelModelDetail(doc: WheelModel): CmsWheelModel {
  const wheelTypeSlug = resolveRelationSlug(doc.wheelType) ?? "";
  const descriptionShort = doc.shortDescription?.trim() || doc.name;
  const descriptionLong =
    lexicalToPlainText(doc.fullDescription) || doc.shortDescription?.trim() || descriptionShort;

  const documents =
    Array.isArray(doc.documents) && doc.documents.length > 0
      ? doc.documents
          .map((item) => {
            const media = resolveMedia(item);
            if (!media) return null;
            return { url: media.url, title: media.title || media.filename || "Документ" };
          })
          .filter((item): item is { url: string; title: string } => Boolean(item))
      : undefined;

  return {
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    wheelTypeSlug,
    wheelTypeName: resolveRelationName(doc.wheelType) || wheelTypeSlug,
    series: doc.series?.trim() || undefined,
    designStyle: doc.designStyle?.trim() || undefined,
    material: doc.material?.trim() || undefined,
    constructionMethod: doc.constructionMethod ?? undefined,
    fitmentNotes: doc.fitmentNotes?.trim() || undefined,
    descriptionShort,
    descriptionLong,
    documents,
  };
}

export function mapWheelVariant(doc: WheelVariant, modelId?: string): CmsWheelVariant {
  const resolvedModelId =
    modelId ??
    (typeof doc.wheelModel === "object" && doc.wheelModel != null
      ? String(doc.wheelModel.id)
      : String(doc.wheelModel));

  return {
    id: String(doc.id),
    modelId: resolvedModelId,
    sizeLabel: doc.sizeLabel,
    sku: doc.sku?.trim() || undefined,
    diameter: doc.diameter ?? undefined,
    width: doc.width ?? undefined,
    boltHoles: doc.boltHoles ?? undefined,
    pcd: doc.pcd?.trim() || undefined,
    offsetET: doc.offsetET ?? undefined,
    centerBore: doc.centerBore ?? undefined,
    loadRating: doc.loadRating?.trim() || undefined,
    weight: doc.weight ?? undefined,
    color: doc.color?.trim() || undefined,
    finish: doc.finish?.trim() || undefined,
    compatibleTireSizes: doc.compatibleTireSizes?.trim() || undefined,
    available: doc.available ?? true,
    price: doc.price ?? undefined,
    priceOnRequest: doc.priceOnRequest ?? true,
  };
}

export function mapShopCategory(doc: ShopCategory): CmsShopCategory {
  return {
    slug: doc.slug,
    name: doc.name,
    description: doc.description?.trim() || doc.name,
  };
}

export function mapArticleLike(doc: {
  slug: string;
  title: string;
  excerpt?: string | null;
  publishedAt?: string | null;
}) {
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt?.trim() || doc.title,
    publishedAt: formatPublishedDate(doc.publishedAt),
  };
}
