import type { CmsArticle } from "./types";

/** ponytail: Tire IQ collection not in Payload yet — returns empty until phase 7 */
export async function getTireIQArticles(): Promise<CmsArticle[]> {
  return [];
}

export async function getTireIQArticleBySlug(_slug: string): Promise<CmsArticle | null> {
  return null;
}

export async function getAllTireIQSlugs(): Promise<string[]> {
  return [];
}
