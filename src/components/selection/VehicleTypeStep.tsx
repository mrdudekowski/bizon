import { VEHICLE_TYPE_OPTIONS, type VehicleType } from "@/lib/selection/options";

import styles from "./Selection.module.css";

const DESCRIPTIONS: Record<VehicleType, string> = {
  "long-haul-tractor": "Длинные плечи, стабильная скорость и высокая годовая выработка.",
  "regional-truck": "Региональные маршруты, частые манёвры и переменный профиль дорог.",
  "construction-dumper": "Стройплощадка, смешанный цикл и повышенная нагрузка.",
  "quarry-special": "Карьер, бездорожье и тяжёлая специальная техника.",
};

export function VehicleTypeStep({
  value,
  onChange,
}: {
  value?: VehicleType;
  onChange(value: VehicleType): void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Для какой техники нужны шины?</legend>
      <p className={styles.questionHint}>Выберите основной тип техники — это сузит направление каталога.</p>
      <div className={styles.choiceGrid}>
        {VEHICLE_TYPE_OPTIONS.map((option, index) => (
          <label className={styles.choiceCard} key={option.value}>
            <input type="radio" name="vehicle" value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
            <span className={styles.choiceIndex}>{String(index + 1).padStart(2, "0")}</span>
            <strong>{option.label}</strong>
            <span>{DESCRIPTIONS[option.value]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
