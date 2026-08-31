import Link from "next/link";

import type { TireCategory } from "@/lib/catalog/tireCategories";

import { TireCategoryIdentity } from "./TireCategoryIdentity";
import styles from "./TireCatalog.module.css";

type TireCategoryNavigatorProps = { tireTypeSlug: string; categories: TireCategory[]; activeSlug?: string };

export function TireCategoryNavigator({ tireTypeSlug, categories, activeSlug }: TireCategoryNavigatorProps) {
  if (categories.length < 2) return null;
  return <nav className={styles.categoryNavigator} aria-label="Категории эксплуатации">{categories.map((category) => {
    const isActive = category.slug === activeSlug;
    return <Link className={`${styles.categoryNavigatorItem} ${isActive ? styles.categoryNavigatorItemActive : ""}`} href={`/models/${tireTypeSlug}/${category.slug}`} key={category.slug} aria-current={isActive ? "page" : undefined}><TireCategoryIdentity category={category} /></Link>;
  })}</nav>;
}
