import { describe, expect, it } from "vitest";

import {
  buildTbrImportPlan,
  type TbrImportProjection,
} from "@/lib/catalog/tbrImport";

const projection: TbrImportProjection = {
  models: [
    {
      model_id: "DSR158",
      model_code: "DSR158",
      model_slug: "dsr158",
      name_ru: "DSR158",
      publication_status: "verified",
      model_verification_status: "verified",
      short_description_ru: "Описание",
      full_description_ru: "Полное описание",
      source_page: 4,
      source_row_number: 2,
      source_raw: { model_id: "DSR158" },
      application_json: ["long-haul"],
      axle_json: ["steer"],
      feature_count: 1,
    },
  ],
  variants: [
    {
      variant_id: "DSR158-315-80R22.5-1",
      model_id: "DSR158",
      size_raw: "315/80R22.5",
      size_normalized: "315/80R22.5",
      ply_rating_pr: 18,
      load_index_dual: 154,
      speed_symbol: "L",
      verification_status: "verified",
      publish_blocked: false,
      source_page: 4,
      source_row_number: 2,
      source_raw: { variant_id: "DSR158-315-80R22.5-1" },
    },
  ],
  features: [
    {
      model_id: "DSR158",
      feature_order: 1,
      feature_key: "high-mileage",
      feature_title_ru: "Пробег",
      feature_description_ru: "Описание",
      feature_title_en_source: "Mileage",
      feature_description_en_source: "Description",
      technical_claim_status: "source_only",
      source_page: 4,
      source_verified: true,
      source_raw: { feature_key: "high-mileage" },
    },
  ],
};

describe("buildTbrImportPlan", () => {
  it("maps stable IDs, draft statuses, and source-only features", () => {
    const plan = buildTbrImportPlan(projection, {
      workbookSha256: "abc",
      batchId: "batch-1",
      sourceDocument: "BIZON_TBR_Catalog_Source_of_Truth.xlsx",
      expectedCounts: { models: 1, variants: 1, features: 1, blockedVariants: 0 },
    });

    expect(plan.models[0]).toMatchObject({
      catalogId: "DSR158",
      status: "draft",
      verificationStatus: "imported",
      shortDescription: "Описание",
    });
    expect(plan.variants[0]).toMatchObject({
      catalogId: "DSR158-315-80R22.5-1",
      tireModelCatalogId: "DSR158",
      status: "draft",
      verificationStatus: "imported",
      publishBlocked: false,
    });
    expect(plan.features[0]).toMatchObject({
      verificationStatus: "sourceOnly",
      sourceTitleEn: "Mileage",
      sourceSnapshot: {
        sourceDocument: "BIZON_TBR_Catalog_Source_of_Truth.xlsx",
        sourceSheet: "03_MODEL_FEATURES",
      },
    });
  });

  it("rejects any count mismatch before apply", () => {
    expect(() =>
      buildTbrImportPlan(projection, {
        workbookSha256: "abc",
        batchId: "batch-1",
        sourceDocument: "source.xlsx",
        expectedCounts: { models: 2, variants: 1, features: 1, blockedVariants: 0 },
      }),
    ).toThrow(/count gate/i);
  });
});
