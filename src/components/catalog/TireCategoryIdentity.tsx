import Image from "next/image";
import Link from "next/link";

import { getCategoryIcon } from "@/lib/catalog/categoryIcons";
import type { TireCategory } from "@/lib/catalog/tireCategories";

import styles from "./TireCatalog.module.css";

type TireCategoryIdentityProps = { category: TireCategory; href?: string; size?: "compact" | "detail" };

export function TireCategoryIdentity({ category, href, size = "compact" }: TireCategoryIdentityProps) {
  const icon = getCategoryIcon(category.slug);
  const className = `${styles.categoryIdentity} ${size === "detail" ? styles.categoryIdentityDetail : styles.categoryIdentityCompact}`;
  const content = <>{icon ? <Image className={styles.categoryIcon} src={icon.src} alt="" width={48} height={48} /> : null}<span className={styles.categoryIdentityLabel}>{category.name}</span></>;
  return href ? <Link className={className} href={href} aria-label={`Открыть каталог: ${category.name}`}>{content}</Link> : <span className={className}>{content}</span>;
}
