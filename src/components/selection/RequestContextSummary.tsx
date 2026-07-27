import Link from "next/link";

import type { NormalizedSelectionContext } from "@/lib/requests/selectionContext";
import { selectionHomeHref } from "@/lib/selection/homeHref";
import { AXLE_OPTIONS, OPERATING_CONDITION_OPTIONS, VEHICLE_TYPE_OPTIONS } from "@/lib/selection/options";

import styles from "@/components/forms/ContextualContactForm.module.css";

export function RequestContextSummary({ context }: { context: NormalizedSelectionContext }) {
  const vehicle = VEHICLE_TYPE_OPTIONS.find((item) => item.value === context.vehicle)?.label;
  const conditions = context.conditions.map((value) => OPERATING_CONDITION_OPTIONS.find((item) => item.value === value)?.label).filter(Boolean);
  const axle = context.axle === "unknown" ? "Ось неизвестна" : AXLE_OPTIONS.find((item) => item.value === context.axle)?.label;

  return (
    <section className={styles.context} aria-labelledby="request-context-title">
      <div className={styles.contextHeader}>
        <div><p>Контекст запроса</p><h2 id="request-context-title">Ваш предварительный подбор</h2></div>
        <Link href={selectionHomeHref({ vehicle: context.vehicle, conditions: [] }, "vehicle")}>Изменить параметры</Link>
      </div>
      <dl>
        {vehicle && <div><dt>Техника</dt><dd>{vehicle}</dd></div>}
        {conditions.length > 0 && <div><dt>Условия</dt><dd>{conditions.join(" · ")}</dd></div>}
        {axle && <div><dt>Ось</dt><dd>{axle}</dd></div>}
        {context.size && <div><dt>Типоразмер</dt><dd>{context.size}</dd></div>}
        {context.modelSlugs.length > 0 && <div><dt>Модели</dt><dd>{context.modelSlugs.join(" · ")}</dd></div>}
      </dl>
    </section>
  );
}
