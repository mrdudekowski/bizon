import { mapWheelType } from "./payload/mappers";
import { findPublished, findPublishedBySlug, findPublishedSlugs } from "./payload/query";
import type { WheelType } from "@/payload-types";
import type { CmsWheelType } from "./types";
import localTypes from "@/lib/content/local/wheel-types.json";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

export async function getWheelTypes(): Promise<CmsWheelType[]> {
  if (isLocalMediaMode()) return (localTypes as WheelType[]).map(mapWheelType);
  const docs = await findPublished("wheel-types", { sort: "sortOrder" });
  if (!docs?.length) return [];
  return docs.map((doc) => mapWheelType(doc as WheelType));
}

export async function getWheelTypeBySlug(slug: string): Promise<CmsWheelType | null> {
  if (isLocalMediaMode()) {
    const doc = (localTypes as WheelType[]).find((item) => item.slug === slug);
    return doc ? mapWheelType(doc) : null;
  }
  const doc = await findPublishedBySlug("wheel-types", slug);
  return doc ? mapWheelType(doc as WheelType) : null;
}

export async function getAllWheelTypeSlugs(): Promise<string[]> {
  if (isLocalMediaMode()) return (localTypes as WheelType[]).map((item) => item.slug);
  return (await findPublishedSlugs("wheel-types")) ?? [];
}
