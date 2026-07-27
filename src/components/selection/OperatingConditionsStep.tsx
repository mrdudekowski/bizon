import { forwardRef } from "react";

import { OPERATING_CONDITION_OPTIONS, type OperatingCondition } from "@/lib/selection/options";

import styles from "./Selection.module.css";

export const OperatingConditionsStep = forwardRef<
  HTMLLegendElement,
  {
    values: OperatingCondition[];
    onChange(values: OperatingCondition[]): void;
  }
>(function OperatingConditionsStep({ values, onChange }, ref) {
  const toggle = (value: OperatingCondition) => {
    onChange(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  };

  return (
    <fieldset className={styles.fieldset}>
      <legend ref={ref} tabIndex={-1} className={styles.legend}>В каких условиях работает техника?</legend>
      <p className={styles.questionHint}>Можно выбрать несколько сценариев эксплуатации.</p>
      <div className={styles.choiceGrid}>
        {OPERATING_CONDITION_OPTIONS.map((option, index) => (
          <label className={styles.choiceCard} key={option.value}>
            <input type="checkbox" name="condition" value={option.value} checked={values.includes(option.value)} onChange={() => toggle(option.value)} />
            <span className={styles.choiceIndex}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{option.label}</strong>
          </label>
        ))}
      </div>
    </fieldset>
  );
});
