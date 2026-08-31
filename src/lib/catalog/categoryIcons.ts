import { TIRE_CATEGORIES } from "./tireCategories";

export type CategoryIcon = {
  src: string;
  alt: string;
};

const iconBySlug = Object.fromEntries(
  TIRE_CATEGORIES.map((category) => [
    category.slug,
    {
      src: `/images/catalog/category-icons/${category.slug}-m.svg`,
      alt: category.name,
    } satisfies CategoryIcon,
  ]),
) as Record<string, CategoryIcon>;

export function getCategoryIcon(slug: string): CategoryIcon | null {
  return iconBySlug[slug] ?? null;
}
