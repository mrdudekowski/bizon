import Link from "next/link";
import type { CmsTireModel, CmsTireVariant } from "@/lib/cms/types";

import styles from "./CatalogSpecsTable.module.css";

type TireVariantsTableProps = {
  model: CmsTireModel;
  variants: CmsTireVariant[];
  modelPath: string;
};

function cell(value: string | number | null | undefined): string {
  if (value == null || value === "") return "—";
  return String(value);
}

export function TireVariantsTable({ model, variants }: TireVariantsTableProps) {
  if (variants.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Технические параметры размеров</h2>
        <p className={styles.empty}>
          Типоразмеры для этой модели уточняются.{" "}
          <Link
            href={`/contact?model=${encodeURIComponent(model.slug)}&type=${encodeURIComponent(model.tireTypeSlug)}`}
            className="underline"
          >
            Связаться со специалистом
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="tire-specs-title">
      <h2 className={styles.title} id="tire-specs-title">
        Технические параметры размеров
      </h2>

      <div className={styles.cards}>
        {variants.map((variant) => (
          <article className={styles.card} key={variant.id}>
            <h3 className={styles.cardSize}>{variant.size}</h3>
            <dl className={styles.cardFacts}>
              <div>
                <dt>Обод</dt>
                <dd>{cell(variant.rimDiameter)}</dd>
              </div>
              <div>
                <dt>LI</dt>
                <dd>{cell(variant.loadIndex)}</dd>
              </div>
              <div>
                <dt>SI</dt>
                <dd>{cell(variant.speedIndex)}</dd>
              </div>
              <div>
                <dt>PR</dt>
                <dd>{cell(variant.plyRating)}</dd>
              </div>
              <div>
                <dt>OD, мм</dt>
                <dd>{cell(variant.overallDiameter)}</dd>
              </div>
              <div>
                <dt>Масса, кг</dt>
                <dd>{cell(variant.weight)}</dd>
              </div>
              <div>
                <dt>Рек. обод</dt>
                <dd>{cell(variant.recommendedRim)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.stickyCol} ${styles.colSize}`} scope="col">
                Размер
              </th>
              <th className={styles.colNarrow} scope="col">
                Обод
              </th>
              <th className={styles.colNarrow} scope="col">
                LI
              </th>
              <th className={styles.colNarrow} scope="col">
                SI
              </th>
              <th className={styles.colNarrow} scope="col">
                PR
              </th>
              <th className={styles.colMid} scope="col">
                OD, мм
              </th>
              <th className={`${styles.colMid} ${styles.secondary}`} scope="col">
                Масса, кг
              </th>
              <th className={`${styles.colWide} ${styles.secondary}`} scope="col">
                Рек. обод
              </th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant.id}>
                <th className={`${styles.stickyCol} ${styles.colSize}`} scope="row">
                  {variant.size}
                </th>
                <td className={styles.colNarrow}>{cell(variant.rimDiameter)}</td>
                <td className={styles.colNarrow}>{cell(variant.loadIndex)}</td>
                <td className={styles.colNarrow}>{cell(variant.speedIndex)}</td>
                <td className={styles.colNarrow}>{cell(variant.plyRating)}</td>
                <td className={styles.colMid}>{cell(variant.overallDiameter)}</td>
                <td className={`${styles.colMid} ${styles.secondary}`}>
                  {cell(variant.weight)}
                </td>
                <td className={`${styles.colWide} ${styles.secondary}`}>
                  {cell(variant.recommendedRim)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
