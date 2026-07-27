import { describe, expect, it } from "vitest";

import { normalizeSelectionContext } from "./selectionContext";

describe("normalizeSelectionContext", () => {
  it("keeps only non-personal selection values", () => {
    expect(
      normalizeSelectionContext({
        vehicle: "regional-truck",
        conditions: ["regional"],
        axle: "drive",
        size: "315/80R22.5",
        modelSlugs: ["dsr158"],
        phone: "+7 999 000-00-00",
      }),
    ).toEqual({
      vehicle: "regional-truck",
      conditions: ["regional"],
      axle: "drive",
      size: "315/80R22.5",
      modelSlugs: ["dsr158"],
    });
  });

  it("drops unknown enums and bounds strings and models", () => {
    expect(
      normalizeSelectionContext({
        vehicle: "car",
        conditions: ["regional", "space", "regional"],
        axle: "front",
        size: `  ${"x".repeat(80)}  `,
        modelSlugs: ["dsr158", "bad slug!", "dsr177", "dsr188", "fourth"],
      }),
    ).toEqual({
      conditions: ["regional"],
      size: "x".repeat(64),
      modelSlugs: ["dsr158", "dsr177", "dsr188"],
    });
  });

  it("returns an empty safe shape for arbitrary input", () => {
    expect(normalizeSelectionContext("phone=79990000000")).toEqual({
      conditions: [],
      modelSlugs: [],
    });
  });
});
