import { describe, expect, it } from "vitest";

import { parseTireSize } from "./parseTireSize";

describe("parseTireSize", () => {
  it("parses a metric radial size", () => {
    expect(parseTireSize("315/80R22.5")).toEqual({
      ok: true,
      value: {
        sizeRaw: "315/80R22.5",
        sizeNormalized: "315/80R22.5",
        sizeFormat: "metric",
        nominalWidthMm: 315,
        aspectRatioPct: 80,
        constructionCode: "R",
        rimDiameterIn: 22.5,
      },
    });
  });

  it("normalizes spaces and lowercase metric notation", () => {
    expect(parseTireSize("  385 / 65 r 22.5 ")).toMatchObject({
      ok: true,
      value: {
        sizeRaw: "385 / 65 r 22.5",
        sizeNormalized: "385/65R22.5",
      },
    });
  });

  it("parses an imperial radial size without aspect ratio", () => {
    expect(parseTireSize("12.00R20")).toEqual({
      ok: true,
      value: {
        sizeRaw: "12.00R20",
        sizeNormalized: "12.00R20",
        sizeFormat: "imperial",
        imperialWidthIn: 12,
        constructionCode: "R",
        rimDiameterIn: 20,
      },
    });
  });

  it("parses whole-inch imperial notation", () => {
    expect(parseTireSize("13R22.5")).toEqual({
      ok: true,
      value: {
        sizeRaw: "13R22.5",
        sizeNormalized: "13.00R22.5",
        sizeFormat: "imperial",
        imperialWidthIn: 13,
        constructionCode: "R",
        rimDiameterIn: 22.5,
      },
    });
  });

  it("returns a blank failure for whitespace", () => {
    expect(parseTireSize("  ")).toEqual({
      ok: false,
      code: "blank",
      raw: "",
    });
  });

  it("rejects an unsupported construction code", () => {
    expect(parseTireSize("315/80X22.5")).toEqual({
      ok: false,
      code: "unsupported_format",
      raw: "315/80X22.5",
    });
  });

  it("rejects impossible numeric values", () => {
    expect(parseTireSize("315/0R22.5")).toEqual({
      ok: false,
      code: "invalid_value",
      raw: "315/0R22.5",
    });
  });
});
