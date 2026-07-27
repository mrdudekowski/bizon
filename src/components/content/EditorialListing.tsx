import Link from "next/link";

import { CatalogImage } from "@/components/catalog/CatalogImage";
import { PageHero, type PageHeroBreadcrumb } from "@/components/content/PageHero";

import styles from "./EditorialListing.module.css";

export type EditorialListingItem = {
  key: string;
  href: string;
  title: string;
  description?: string;
  meta?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  fallbackKey?: string;
};

type EditorialListingProps = {
  kicker?: string;
  title: string;
  description?: string;
  breadcrumbs: PageHeroBreadcrumb[];
  items: EditorialListingItem[];
  emptyMessage?: string;
};

export function EditorialListing({
  kicker,
  title,
  description,
  breadcrumbs,
  items,
  emptyMessage = "Опубликованных материалов пока нет.",
}: EditorialListingProps) {
  return (
    <main data-main-chrome-tone="light">
      <PageHero
        kicker={kicker}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />
      <div className={styles.body}>
        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item, index) => (
              <article
                key={item.key}
                className={index === 0 ? styles.featured : styles.card}
                data-editorial-card
              >
                <Link href={item.href} className={styles.media}>
                  <CatalogImage
                    src={item.imageUrl}
                    fallbackKey={item.fallbackKey ?? item.key}
                    alt={item.imageAlt ?? item.title}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width: 767px) 100vw, 66vw"
                        : "(max-width: 767px) 100vw, 33vw"
                    }
                  />
                </Link>
                <div className={styles.copy}>
                  {item.meta ? <p className={styles.meta}>{item.meta}</p> : null}
                  <h2>
                    <Link href={item.href}>{item.title}</Link>
                  </h2>
                  {item.description ? <p>{item.description}</p> : null}
                  <Link href={item.href} className={styles.readMore}>
                    Читать <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.meta}>Материалы проверяются</p>
            <h2>{emptyMessage}</h2>
            <Link className="btn-accent" href="/contact">
              Запросить консультацию
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
