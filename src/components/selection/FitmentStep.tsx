import { forwardRef } from "react";

import { AXLE_OPTIONS } from "@/lib/selection/options";
import type { AxleChoice, SelectionState } from "@/lib/selection/types";

import styles from "./Selection.module.css";

export const FitmentStep = forwardRef<
  HTMLLegendElement,
  {
    state: SelectionState;
    onChange(next: SelectionState): void;
  }
>(function FitmentStep({ state, onChange }, ref) {
  const setAxle = (axle: AxleChoice) => onChange({ ...state, axle });
  const setSizeKnown = (sizeKnown: boolean) =>
    onChange({ ...state, sizeKnown, ...(sizeKnown ? {} : { size: undefined }) });

  return (
    <fieldset className={styles.fieldset}>
      <legend ref={ref} tabIndex={-1} className={styles.legend}>Что известно о посадке?</legend>
      <p className={styles.questionHint}>Если данных нет, подбор всё равно продолжится — специалист проверит совместимость.</p>

      <div className={styles.fitmentGroup} role="group" aria-labelledby="axle-label">
        <h2 id="axle-label">Позиция оси</h2>
        <div className={styles.inlineChoices}>
          {AXLE_OPTIONS.map((option) => (
            <label key={option.value}><input type="radio" name="axle" checked={state.axle === option.value} onChange={() => setAxle(option.value)} /> <span>{option.label}</span></label>
          ))}
          <label><input type="radio" name="axle" checked={state.axle === "unknown"} onChange={() => setAxle("unknown")} /> <span>Не знаю ось</span></label>
        </div>
      </div>

      <div className={styles.fitmentGroup} role="group" aria-labelledby="size-known-label">
        <h2 id="size-known-label">Типоразмер</h2>
        <div className={styles.inlineChoices}>
          <label><input type="radio" name="size-known" checked={state.sizeKnown === true} onChange={() => setSizeKnown(true)} /> <span>Знаю типоразмер</span></label>
          <label><input type="radio" name="size-known" checked={state.sizeKnown === false} onChange={() => setSizeKnown(false)} /> <span>Не знаю типоразмер</span></label>
        </div>
        {state.sizeKnown && (
          <label className={styles.sizeField}>
            <span>Введите типоразмер</span>
            <input type="text" value={state.size ?? ""} onChange={(event) => onChange({ ...state, size: event.target.value })} placeholder="315/80R22.5" autoComplete="off" />
          </label>
        )}
      </div>
    </fieldset>
  );
});
