import { describe, expect, it } from "vitest";

import { kgToLb, kpaToBar, kpaToPsi, mmToIn } from "./units";

describe("canonical unit display conversions", () => {
  it("converts kPa to bar", () => {
    expect(kpaToBar(830)).toBe(8.3);
  });

  it("converts kPa to psi", () => {
    expect(kpaToPsi(830)).toBeCloseTo(120.38, 2);
  });

  it("converts kg to lb", () => {
    expect(kgToLb(3550)).toBeCloseTo(7826.4, 1);
  });

  it("converts mm to inches", () => {
    expect(mmToIn(315)).toBeCloseTo(12.4, 1);
  });
});
