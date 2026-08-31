import { describe, expect, it } from "vitest";

import {
  BIZON_TBR_ACTIVE_CODES,
  BIZON_TBR_CATALOG_MANIFEST,
  BIZON_TBR_TIRE_IQ_CODES,
} from "./bizonTbrCatalogManifest";

describe("BIZON TBR catalog manifest", () => {
  it("keeps the full 24-model source contour", () => {
    expect(BIZON_TBR_CATALOG_MANIFEST).toHaveLength(24);
    expect(new Set(BIZON_TBR_CATALOG_MANIFEST.map((entry) => entry.code)).size).toBe(24);
  });

  it("limits active and Tire IQ models to the approved three", () => {
    expect(BIZON_TBR_ACTIVE_CODES).toEqual(["DSR177", "DSR158", "DSR188"]);
    expect(BIZON_TBR_TIRE_IQ_CODES).toEqual(["DSR177", "DSR158", "DSR188"]);
  });
});
