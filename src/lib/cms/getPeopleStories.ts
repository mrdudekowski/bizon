import { mapPeopleStory } from "./payload/mappers";
import { findPublished, findPublishedBySlug, findPublishedSlugs } from "./payload/query";
import type { PeopleStory } from "@/payload-types";
import type { CmsStory } from "./types";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

export async function getPeopleStories(): Promise<CmsStory[]> {
  if (isLocalMediaMode()) return [];
  const docs = await findPublished("people-stories", { sort: "-publishedAt" });
  if (!docs?.length) return [];
  return docs.map((doc) => mapPeopleStory(doc as PeopleStory));
}

export async function getPeopleStoryBySlug(slug: string): Promise<CmsStory | null> {
  if (isLocalMediaMode()) return null;
  const doc = await findPublishedBySlug("people-stories", slug);
  return doc ? mapPeopleStory(doc as PeopleStory) : null;
}

export async function getAllPeopleStorySlugs(): Promise<string[]> {
  if (isLocalMediaMode()) return [];
  return (await findPublishedSlugs("people-stories")) ?? [];
}
