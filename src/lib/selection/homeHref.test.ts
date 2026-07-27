import { describe, expect, it } from "vitest";

import { selectionHomeHref, selectionLegacyToHomePath } from "./homeHref";

describe("selectionHomeHref", () => {
  it("anchors empty selection on #solutions", () => {
    expect(selectionHomeHref()).toBe("/#solutions");
  });

  it("serializes state and step onto /", () => {
    expect(
      selectionHomeHref(
        {
          vehicle: "regional-truck",
          conditions: ["regional"],
          axle: "drive",
          sizeKnown: false,
        },
        "result",
      ),
    ).toBe(
      "/?vehicle=regional-truck&condition=regional&axle=drive&sizeKnown=false&step=result#solutions",
    );
  });
});

describe("selectionLegacyToHomePath", () => {
  it("moves /selection query onto / with hash", () => {
    expect(selectionLegacyToHomePath("vehicle=long-haul-tractor&step=conditions")).toBe(
      "/?vehicle=long-haul-tractor&step=conditions#solutions",
    );
  });

  it("handles empty query", () => {
    expect(selectionLegacyToHomePath("")).toBe("/#solutions");
  });
});
