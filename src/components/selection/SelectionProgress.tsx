import type { SelectionStep } from "@/lib/selection/types";

import styles from "./Selection.module.css";

const STEP_INDEX: Record<SelectionStep, number> = {
  vehicle: 1,
  conditions: 2,
  fitment: 3,
  result: 3,
};

export function SelectionProgress({ step }: { step: SelectionStep }) {
  const current = STEP_INDEX[step];
  return (
    <div className={styles.progress} aria-label={`Шаг ${current} из 3`}>
      <div className={styles.progressText}>
        <span>Подбор шин</span>
        <span>Шаг {current} из 3</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: `${(current / 3) * 100}%` }} />
      </div>
    </div>
  );
}
