import rawArticles from "./local/tireIqArticles.json";
import type { CmsArticle } from "@/lib/cms/types";
import { formatPublishedDate, isLexicalContent } from "@/lib/cms/payload/richText";
import { getTireIqArticleCover } from "./tireIqVisuals";

type LocalArticle = {
  slug?: string;
  title?: string;
  excerpt?: string;
  publishedAt?: string | null;
  content?: unknown;
  taxonomy?: string[] | null;
  showInMenu?: boolean | null;
  menuOrder?: number | null;
};

function mapArticle(doc: LocalArticle): CmsArticle | null {
  if (!doc.slug || !doc.title) return null;
  return {
    slug: doc.slug,
    title: doc.title,
    excerpt: doc.excerpt?.trim() || doc.title,
    publishedAt: formatPublishedDate(doc.publishedAt),
    content: isLexicalContent(doc.content) ? doc.content : null,
    imageUrl: getTireIqArticleCover(doc.slug),
    showInMenu: doc.showInMenu ?? true,
    menuOrder: doc.menuOrder ?? 0,
    taxonomy: doc.taxonomy ?? [],
  };
}

const ARTICLES = (rawArticles as LocalArticle[])
  .map(mapArticle)
  .filter((article): article is CmsArticle => Boolean(article));

export function getLocalTireIQArticles(topic?: string): CmsArticle[] {
  return topic ? ARTICLES.filter((article) => article.taxonomy?.includes(topic)) : ARTICLES;
}

export function getLocalTireIQArticleBySlug(slug: string): CmsArticle | null {
  return ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function getAllLocalTireIQSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}
