import { mapWheelType } from "./payload/mappers";
import { findPublished, findPublishedBySlug, findPublishedSlugs } from "./payload/query";
import type { WheelType } from "@/payload-types";
import type { CmsWheelType } from "./types";

export async function getWheelTypes(): Promise<CmsWheelType[]> {
  const docs = await findPublished("wheel-types", { sort: "sortOrder" });
  if (!docs?.length) return [];
  return docs.map((doc) => mapWheelType(doc as WheelType));
}

export async function getWheelTypeBySlug(slug: string): Promise<CmsWheelType | null> {
  const doc = await findPublishedBySlug("wheel-types", slug);
  return doc ? mapWheelType(doc as WheelType) : null;
}

/** ponytail: first published type while catalog has one row (forged MVP) */
export async function getDefaultWheelType(): Promise<CmsWheelType | null> {
  const types = await getWheelTypes();
  return types[0] ?? null;
}

export async function getAllWheelTypeSlugs(): Promise<string[]> {
  return (await findPublishedSlugs("wheel-types")) ?? [];
}
