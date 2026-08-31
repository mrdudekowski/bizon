import { mapTireType } from "./payload/mappers";
import { findPublished, findPublishedBySlug, findPublishedSlugs } from "./payload/query";
import type { TireType } from "@/payload-types";
import type { CmsTireType } from "./types";
import localTypes from "@/lib/content/local/tire-types.json";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

export async function getTireTypes(): Promise<CmsTireType[]> {
  if (isLocalMediaMode()) return (localTypes as TireType[]).map(mapTireType);
  const docs = await findPublished("tire-types", { sort: "sortOrder" });
  if (!docs?.length) return [];
  return docs.map((doc) => mapTireType(doc as TireType));
}

export async function getTireTypeBySlug(slug: string): Promise<CmsTireType | null> {
  if (isLocalMediaMode()) {
    const doc = (localTypes as TireType[]).find((item) => item.slug === slug);
    return doc ? mapTireType(doc) : null;
  }
  const doc = await findPublishedBySlug("tire-types", slug);
  return doc ? mapTireType(doc as TireType) : null;
}

export async function getAllTireTypeSlugs(): Promise<string[]> {
  if (isLocalMediaMode()) return (localTypes as TireType[]).map((item) => item.slug);
  return (await findPublishedSlugs("tire-types")) ?? [];
}
