import type {
  TireCatalogDirection,
  TireCatalogReadModel,
} from "@/lib/catalog/tireReadModel";

import type { SelectionResult, SelectionState } from "./types";

const SCORE = {
  vehicle: 40,
  condition: 30,
  axle: 20,
  size: 30,
} as const;

const NO_MATCH_REASON = "Точного совпадения в опубликованном каталоге нет";

function scoreDirection(
  direction: TireCatalogDirection,
  state: SelectionState,
): number {
  let score = 0;
  if (state.vehicle && direction.selectionVehicleTypes.includes(state.vehicle)) {
    score += SCORE.vehicle;
  }
  if (
    state.conditions.some((condition) =>
      direction.selectionConditions.includes(condition),
    )
  ) {
    score += SCORE.condition;
  }
  return score;
}

export function recommendTires(
  catalog: TireCatalogReadModel,
  state: SelectionState,
): SelectionResult {
  const candidates = catalog.directions.flatMap((direction) =>
    direction.models.map((model) => {
      const reasons: string[] = [];
      let score = 0;

      if (
        state.vehicle &&
        model.selectionVehicleTypes.includes(state.vehicle)
      ) {
        score += SCORE.vehicle;
        reasons.push("Подходит для выбранной техники");
      }
      if (
        state.conditions.some((condition) =>
          model.selectionConditions.includes(condition),
        )
      ) {
        score += SCORE.condition;
        reasons.push("Учитывает условия эксплуатации");
      }
      if (
        state.axle &&
        state.axle !== "unknown" &&
        model.selectionAxles.includes(state.axle)
      ) {
        score += SCORE.axle;
        reasons.push("Соответствует выбранной оси");
      }
      if (
        state.sizeKnown &&
        state.size &&
        model.sizes.some(
          (size) =>
            size.trim().toLocaleLowerCase("ru-RU") ===
            state.size?.trim().toLocaleLowerCase("ru-RU"),
        )
      ) {
        score += SCORE.size;
        reasons.push(
          "Есть совпадающий типоразмер в опубликованной линейке",
        );
      }

      return { direction, model, score, reasons };
    }),
  );

  const ranked = candidates
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.model.name.localeCompare(right.model.name, "ru"),
    );

  if (ranked.length > 0) {
    const directionSlug = ranked[0].direction.slug;
    const matches = ranked
      .filter((candidate) => candidate.direction.slug === directionSlug)
      .slice(0, 3)
      .map(({ model, score, reasons }) => ({
        modelId: model.id,
        modelSlug: model.slug,
        href: model.href,
        score,
        reasons,
      }));

    return {
      kind: "matches",
      directionSlug,
      matches,
      requiresSpecialistCheck: true,
    };
  }

  const closestDirection = catalog.directions
    .map((direction) => ({ direction, score: scoreDirection(direction, state) }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.direction.name.localeCompare(right.direction.name, "ru"),
    )[0]?.direction;

  return {
    kind: "consultation",
    ...(closestDirection ? { directionSlug: closestDirection.slug } : {}),
    reason: NO_MATCH_REASON,
    requiresSpecialistCheck: true,
  };
}
