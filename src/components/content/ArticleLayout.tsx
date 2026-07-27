import Link from "next/link";
import type { ReactNode } from "react";

import { CatalogImage } from "@/components/catalog/CatalogImage";
import { PageHero, type PageHeroBreadcrumb } from "@/components/content/PageHero";

import styles from "./ArticleLayout.module.css";

type ArticleLayoutProps = {
  kicker?: string;
  title: string;
  description?: string;
  breadcrumbs: PageHeroBreadcrumb[];
  meta?: string | null;
  aside?: ReactNode;
  imageUrl?: string | null;
  imageAlt: string;
  fallbackKey: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
};

export function ArticleLayout({
  kicker,
  title,
  description,
  breadcrumbs,
  meta,
  aside,
  imageUrl,
  imageAlt,
  fallbackKey,
  backHref,
  backLabel,
  children,
}: ArticleLayoutProps) {
  return (
    <main data-main-chrome-tone="light">
      <PageHero
        kicker={kicker}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <div className={styles.body}>
        <div className={styles.lead}>
          <div className={styles.leadMedia}>
            <CatalogImage
              src={imageUrl}
              fallbackKey={fallbackKey}
              alt={imageAlt}
              fill
              sizes="(max-width: 767px) 100vw, 70vw"
            />
          </div>
          <div className={styles.leadMeta}>
            {meta ? <p className={styles.meta}>{meta}</p> : null}
            {aside}
          </div>
        </div>
        <article className={styles.article}>{children}</article>
        <p className={styles.back}>
          <Link href={backHref} className="btn-secondary">
            ← {backLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
