import Link from "next/link";

import type { TireCatalogDirection } from "@/lib/catalog/tireReadModel";
import type { PageShell } from "@/lib/cms/pages/types";

import styles from "./MainHome.module.css";

export function TireDirectionShowcase({
  directions,
  content,
}: {
  directions: TireCatalogDirection[];
  content: PageShell;
}) {
  return (
    <section className={styles.directionSection} data-home-tone="dark" data-main-chrome-tone="dark">
      <div className={styles.inner}>
        <div className={styles.darkHeading}>
          <p className={styles.eyebrow}>{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.lead}</p>
        </div>
        <div className={styles.directionList} data-count={directions.length}>
          {directions.map((direction, index) => (
            <article key={direction.slug}>
              <div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>Доступно к заказу</p>
              </div>
              <h3>{direction.name}</h3>
              <p>{direction.shortDescription}</p>
              <ul>
                {direction.models.slice(0, 3).map((model) => (
                  <li key={model.id}>
                    <Link href={model.href}>
                      {model.name}
                      <span>↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className={styles.directionAll} href={`/models/${direction.slug}`}>
                Все модели направления
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
