import type {
  CatalogAxle,
  OperatingCondition,
  VehicleType,
} from "./options";

export type { OperatingCondition, VehicleType } from "./options";

export type AxleChoice = CatalogAxle | "unknown";
export type SelectionStep = "vehicle" | "conditions" | "fitment" | "result";

export type SelectionState = {
  vehicle?: VehicleType;
  conditions: OperatingCondition[];
  axle?: AxleChoice;
  size?: string;
  sizeKnown?: boolean;
};

export type SelectionMatch = {
  modelId: string;
  modelSlug: string;
  href: string;
  score: number;
  reasons: string[];
};

export type SelectionResult =
  | {
      kind: "matches";
      directionSlug: string;
      matches: SelectionMatch[];
      requiresSpecialistCheck: true;
    }
  | {
      kind: "consultation";
      directionSlug?: string;
      reason: string;
      requiresSpecialistCheck: true;
    };
