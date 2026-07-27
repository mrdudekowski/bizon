import { describe, expect, it } from "vitest";

import {
  CART_SESSION_MAX_AGE_SECONDS,
  hashCartSessionToken,
  sanitizeServerCartItems,
} from "./serverCart";

describe("server cart contract", () => {
  it("keeps only supported safe cart fields and clamps quantity", () => {
    const items = sanitizeServerCartItems([
      {
        itemType: "wheel",
        itemId: "atlas",
        variantId: "22",
        name: "BIZON Atlas",
        quantity: 200000,
        priceOnRequest: true,
        notes: "fitment",
        meta: { unsafe: "not persisted" },
      },
      { itemType: "unknown", itemId: "x", name: "Unknown" },
      null,
    ]);

    expect(items).toEqual([
      {
        itemType: "wheel",
        itemId: "atlas",
        variantId: "22",
        name: "BIZON Atlas",
        quantity: 99999,
        priceOnRequest: true,
        notes: "fitment",
      },
    ]);
  });

  it("creates a stable non-reversible lookup hash", () => {
    const token = "opaque-session-token";
    const hash = hashCartSessionToken(token);

    expect(hash).toHaveLength(64);
    expect(hash).not.toContain(token);
    expect(hashCartSessionToken(token)).toBe(hash);
  });

  it("keeps anonymous sessions for thirty days", () => {
    expect(CART_SESSION_MAX_AGE_SECONDS).toBe(60 * 60 * 24 * 30);
  });
});
