import { describe, expect, it } from "vitest";

import {
  normalizeCatalogIdentity,
  tireVariantCompositeKey,
  toCommercialState,
} from "./tireCatalog";

describe("tire catalog domain", () => {
  it("normalizes stable identities", () => {
    expect(normalizeCatalogIdentity("  dsr-188 ")).toBe("DSR-188");
  });

  it("rejects a blank stable identity", () => {
    expect(() => normalizeCatalogIdentity(" \t ")).toThrow(
      "Catalog identity is required",
    );
  });

  it("builds a normalized composite variant key", () => {
    expect(tireVariantCompositeKey(17, " 12.00r20 ", 20)).toBe(
      "17|12.00R20|20",
    );
  });

  it("rejects an incomplete composite variant key", () => {
    expect(() => tireVariantCompositeKey(17, "", 20)).toThrow(
      "Variant composite key requires model, size and PR",
    );
  });

  it("keeps zero price and defaults availability to on_request", () => {
    expect(toCommercialState({ price: 0 })).toEqual({
      price: 0,
      availabilityStatus: "on_request",
    });
  });

  it("normalizes an absent price to null", () => {
    expect(
      toCommercialState({
        price: undefined,
        availabilityStatus: "available",
      }),
    ).toEqual({
      price: null,
      availabilityStatus: "available",
    });
  });
});
