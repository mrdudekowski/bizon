import {
  AXLE_OPTIONS,
  OPERATING_CONDITION_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from "@/lib/selection/options";
import { selectionHomeHref } from "@/lib/selection/homeHref";
import type { SelectionState } from "@/lib/selection/types";
import type { RequestItemInput } from "@/types/requestItem";

type SelectedModel = {
  slug: string;
  name: string;
};

function optionLabel<T extends readonly { label: string; value: string }[]>(
  options: T,
  value: string | undefined,
): string {
  return options.find((option) => option.value === value)?.label ?? value ?? "Не указано";
}

export function buildSelectionCartItem(
  state: SelectionState,
  models: SelectedModel[],
): RequestItemInput {
  const modelSlugs = models.map((model) => model.slug).sort();
  const identity = [
    state.vehicle ?? "vehicle-unknown",
    [...state.conditions].sort().join("+") || "conditions-unknown",
    state.axle ?? "axle-unknown",
    state.sizeKnown ? state.size?.trim() || "size-unknown" : "size-check",
    modelSlugs.join("+") || "engineering-check",
  ].join(":");

  const conditionLabels = state.conditions.map((condition) =>
    optionLabel(OPERATING_CONDITION_OPTIONS, condition),
  );
  const modelNames = models.map((model) => model.name);

  return {
    itemType: "tire",
    itemId: `selection:${identity}`,
    name: "Подбор шин",
    slug: "tire-selection",
    quantity: 1,
    priceOnRequest: true,
    url: selectionHomeHref(state, "result"),
    notes: [
      `Техника: ${optionLabel(VEHICLE_TYPE_OPTIONS, state.vehicle)}`,
      `Эксплуатация: ${conditionLabels.join(", ") || "Не указана"}`,
      `Ось: ${state.axle === "unknown" ? "Требует уточнения" : optionLabel(AXLE_OPTIONS, state.axle)}`,
      state.sizeKnown && state.size?.trim()
        ? `Размер: ${state.size.trim()}`
        : "Размер требует уточнения",
      modelNames.length > 0
        ? `Выбранные модели: ${modelNames.join(", ")}`
        : "Инженерная проверка без выбранной модели",
    ].join("\n"),
  };
}
