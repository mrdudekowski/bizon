import { describe, expect, it } from "vitest";

import {
  normalizeTireModelData,
  normalizeTireVariantData,
} from "./normalizeTireCatalog";

describe("normalizeTireModelData", () => {
  it("normalizes model identities", () => {
    expect(
      normalizeTireModelData({
        catalogId: " tm-dsr188 ",
        modelCode: " dsr188 ",
      }),
    ).toMatchObject({
      catalogId: "TM-DSR188",
      modelCode: "DSR188",
    });
  });
});

describe("normalizeTireVariantData", () => {
  it("parses size fields for a draft", () => {
    expect(
      normalizeTireVariantData({
        data: {
          catalogId: " tv-1 ",
          sku: " dsr188-1 ",
          sizeRaw: "315/80r22.5",
          verificationStatus: "imported",
        },
      }),
    ).toMatchObject({
      catalogId: "TV-1",
      sku: "DSR188-1",
      sizeNormalized: "315/80R22.5",
      sizeFormat: "metric",
      nominalWidthMm: 315,
      aspectRatioPct: 80,
      constructionCode: "R",
      rimDiameterIn: 22.5,
    });
  });

  it("stores a parser warning and keeps draft saveable for malformed size", () => {
    expect(
      normalizeTireVariantData({
        data: {
          sizeRaw: "bad-size",
          verificationStatus: "imported",
        },
      }),
    ).toMatchObject({
      verificationStatus: "needsReview",
      validationWarnings: [
        expect.objectContaining({
          code: "size_parse_failed",
          severity: "critical",
          field: "sizeRaw",
        }),
      ],
    });
  });

  it("preserves a verified correction when sizeRaw did not change", () => {
    const original = {
      sizeRaw: "315/80R22.5",
      sizeNormalized: "315/80R22.5-CORRECTED",
      nominalWidthMm: 316,
      aspectRatioPct: 80,
      constructionCode: "R",
      rimDiameterIn: 22.5,
      verificationStatus: "verified",
    };

    expect(
      normalizeTireVariantData({
        data: { price: 1000 },
        original,
      }),
    ).toMatchObject({
      price: 1000,
      sizeNormalized: "315/80R22.5-CORRECTED",
      nominalWidthMm: 316,
      verificationStatus: "verified",
    });
  });

  it("demotes and preserves verified normalized fields when sizeRaw changes", () => {
    const original = {
      sizeRaw: "315/80R22.5",
      sizeNormalized: "315/80R22.5-CORRECTED",
      nominalWidthMm: 316,
      aspectRatioPct: 80,
      constructionCode: "R",
      rimDiameterIn: 22.5,
      verificationStatus: "verified",
    };

    expect(
      normalizeTireVariantData({
        data: { sizeRaw: "385/65R22.5" },
        original,
      }),
    ).toMatchObject({
      sizeRaw: "385/65R22.5",
      sizeNormalized: "315/80R22.5-CORRECTED",
      nominalWidthMm: 316,
      verificationStatus: "needsReview",
      validationWarnings: [
        expect.objectContaining({
          code: "size_parser_conflict",
          severity: "critical",
          field: "sizeRaw",
        }),
      ],
    });
  });

  it("accepts the parser candidate when a reviewer explicitly verifies", () => {
    const original = {
      sizeRaw: "385/65R22.5",
      sizeNormalized: "315/80R22.5-CORRECTED",
      nominalWidthMm: 316,
      aspectRatioPct: 80,
      constructionCode: "R",
      rimDiameterIn: 22.5,
      verificationStatus: "needsReview",
      validationWarnings: [
        {
          code: "size_parser_conflict",
          severity: "critical",
          field: "sizeRaw",
          message: "candidate=385/65R22.5",
        },
      ],
    };

    expect(
      normalizeTireVariantData({
        data: { verificationStatus: "verified" },
        original,
      }),
    ).toMatchObject({
      sizeNormalized: "385/65R22.5",
      nominalWidthMm: 385,
      aspectRatioPct: 65,
      verificationStatus: "verified",
      validationWarnings: [],
    });
  });
});
