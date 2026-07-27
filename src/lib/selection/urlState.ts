import {
  AXLE_OPTIONS,
  OPERATING_CONDITION_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  type OperatingCondition,
  type VehicleType,
} from "./options";
import type { AxleChoice, SelectionState, SelectionStep } from "./types";

type ReadonlySearchParams = Pick<URLSearchParams, "get" | "getAll">;

const VEHICLES = new Set<string>(
  VEHICLE_TYPE_OPTIONS.map((option) => option.value),
);
const CONDITIONS = new Set<string>(
  OPERATING_CONDITION_OPTIONS.map((option) => option.value),
);
const AXLES = new Set<string>([
  ...AXLE_OPTIONS.map((option) => option.value),
  "unknown",
]);

export function parseSelectionParams(
  source: ReadonlySearchParams,
): SelectionState {
  const state: SelectionState = { conditions: [] };
  const vehicle = source.get("vehicle");
  const axle = source.get("axle");
  const sizeKnown = source.get("sizeKnown");

  if (vehicle && VEHICLES.has(vehicle)) state.vehicle = vehicle as VehicleType;
  state.conditions = Array.from(
    new Set(
      source
        .getAll("condition")
        .filter((condition) => CONDITIONS.has(condition)),
    ),
  ) as OperatingCondition[];
  if (axle && AXLES.has(axle)) state.axle = axle as AxleChoice;
  if (sizeKnown === "true") state.sizeKnown = true;
  if (sizeKnown === "false") state.sizeKnown = false;

  const size = source.get("size")?.trim();
  if (state.sizeKnown === true && size) state.size = size.slice(0, 64);

  return state;
}

export function serializeSelectionParams(state: SelectionState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.vehicle && VEHICLES.has(state.vehicle)) {
    params.set("vehicle", state.vehicle);
  }
  for (const condition of state.conditions) {
    if (CONDITIONS.has(condition)) params.append("condition", condition);
  }
  if (state.axle && AXLES.has(state.axle)) params.set("axle", state.axle);
  if (typeof state.sizeKnown === "boolean") {
    params.set("sizeKnown", String(state.sizeKnown));
  }
  const size = state.size?.trim();
  if (state.sizeKnown === true && size) params.set("size", size.slice(0, 64));
  return params;
}

export function getFirstMissingStep(state: SelectionState): SelectionStep {
  if (!state.vehicle) return "vehicle";
  if (state.conditions.length === 0) return "conditions";
  if (!state.axle || typeof state.sizeKnown !== "boolean") return "fitment";
  if (state.sizeKnown && !state.size?.trim()) return "fitment";
  return "result";
}
