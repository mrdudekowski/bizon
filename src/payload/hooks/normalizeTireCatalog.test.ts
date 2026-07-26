import { describe, expect, it } from "vitest";

import {
  buildModelCodeFromSlug,
  buildTireVariantSku,
} from "@/lib/catalog/identity";
import {
  normalizeTireModelData,
  normalizeTireVariantData,
} from "./normalizeTireCatalog";

describe("normalizeTireModelData", () => {
  it("builds modelCode from slug when modelCode is blank", () => {
    expect(
      normalizeTireModelData({
        slug: "bizon-dsr-188",
        modelCode: " ",
      }),
    ).toMatchObject({
      modelCode: buildModelCodeFromSlug("bizon-dsr-188"),
    });
  });
});

describe("normalizeTireVariantData", () => {
  it("parses size fields", () => {
    expect(
      normalizeTireVariantData({
        data: {
          sizeRaw: "315/80r22.5",
        },
      }),
    ).toMatchObject({
      sizeNormalized: "315/80R22.5",
      sizeFormat: "metric",
      nominalWidthMm: 315,
      aspectRatioPct: 80,
      constructionCode: "R",
      rimDiameterIn: 22.5,
    });
  });

  it("builds sku from parsed size and a populated parent model", () => {
    expect(
      normalizeTireVariantData({
        data: {
          sku: "",
          sizeRaw: "315/80r22.5",
          tireModel: { id: 1, modelCode: "DSR188" },
        },
      }),
    ).toMatchObject({
      sku: buildTireVariantSku("DSR188", "315/80R22.5"),
    });
  });

  it("builds sku from an existing normalized size", () => {
    expect(
      normalizeTireVariantData({
        data: {
          sku: null,
          sizeNormalized: "385/65R22.5",
          tireModel: { id: 1, modelCode: "S201" },
        },
      }),
    ).toMatchObject({
      sku: buildTireVariantSku("S201", "385/65R22.5"),
    });
  });
});
