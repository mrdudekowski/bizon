import type { CmsStory } from "./types";

/** ponytail: People Stories collection not in Payload yet — returns empty until phase 7 */
export async function getPeopleStories(): Promise<CmsStory[]> {
  return [];
}

export async function getPeopleStoryBySlug(_slug: string): Promise<CmsStory | null> {
  return null;
}

export async function getAllPeopleStorySlugs(): Promise<string[]> {
  return [];
}
