import { describe, expect, it } from "vitest";

import {
  getFirstMissingStep,
  parseSelectionParams,
  serializeSelectionParams,
} from "./urlState";

describe("selection URL state", () => {
  it("drops invalid values and ignores contact data", () => {
    const params = new URLSearchParams(
      "vehicle=car&condition=regional&condition=space&axle=front&phone=79990000000",
    );

    expect(parseSelectionParams(params)).toEqual({
      conditions: ["regional"],
    });
  });

  it("round-trips repeated operating conditions", () => {
    const serialized = serializeSelectionParams({
      vehicle: "regional-truck",
      conditions: ["regional", "mixed"],
      axle: "drive",
      sizeKnown: false,
    });

    expect(serialized.getAll("condition")).toEqual(["regional", "mixed"]);
    expect(parseSelectionParams(serialized)).toEqual({
      vehicle: "regional-truck",
      conditions: ["regional", "mixed"],
      axle: "drive",
      sizeKnown: false,
    });
  });

  it("preserves size only when the visitor knows it", () => {
    expect(
      parseSelectionParams(
        new URLSearchParams("sizeKnown=false&size=315%2F80R22.5"),
      ),
    ).toEqual({ conditions: [], sizeKnown: false });

    expect(
      serializeSelectionParams({
        conditions: [],
        sizeKnown: true,
        size: " 315/80R22.5 ",
      }).toString(),
    ).toBe("sizeKnown=true&size=315%2F80R22.5");
  });

  it("returns the first incomplete step", () => {
    expect(getFirstMissingStep({ conditions: [] })).toBe("vehicle");
    expect(
      getFirstMissingStep({ vehicle: "regional-truck", conditions: [] }),
    ).toBe("conditions");
    expect(
      getFirstMissingStep({
        vehicle: "regional-truck",
        conditions: ["regional"],
      }),
    ).toBe("fitment");
    expect(
      getFirstMissingStep({
        vehicle: "regional-truck",
        conditions: ["regional"],
        axle: "unknown",
        sizeKnown: false,
      }),
    ).toBe("result");
  });
});
