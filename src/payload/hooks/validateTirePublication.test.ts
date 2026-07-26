import { describe, expect, it } from "vitest";

import {
  enforceTireModelWorkflowData,
  enforceTireVariantWorkflowData,
} from "./validateTirePublication";

const publishableModel = {
  catalogId: "TM-DSR188",
  modelCode: "DSR188",
  name: "DSR188",
  slug: "dsr188",
  tireType: 1,
  positions: ["drive"],
  applicationTypes: ["regional"],
  verificationStatus: "verified",
  status: "published",
};

const publishableVariant = {
  catalogId: "TV-1",
  sku: "DSR188-1",
  tireModel: 1,
  sizeRaw: "315/80R22.5",
  sizeNormalized: "315/80R22.5",
  sizeFormat: "metric",
  nominalWidthMm: 315,
  aspectRatioPct: 80,
  constructionCode: "R",
  rimDiameterIn: 22.5,
  plyRatingPr: 20,
  treadDepthMm: 18,
  standardRimIn: 9,
  loadIndexSingle: 156,
  speedSymbol: "K",
  overallDiameterMm: 1080,
  sectionWidthMm: 315,
  verificationStatus: "verified",
  publishBlocked: false,
  status: "published",
};

describe("enforceTireModelWorkflowData", () => {
  it("rejects publication through the trusted importer", () => {
    expect(() =>
      enforceTireModelWorkflowData({
        data: publishableModel,
        original: { ...publishableModel, status: "draft" },
        role: null,
        trustedImport: true,
        hasDuplicateIdentity: false,
      }),
    ).toThrow("Catalog importer cannot publish records");
  });

  it("allows a complete verified model to publish", () => {
    expect(
      enforceTireModelWorkflowData({
        data: publishableModel,
        original: { ...publishableModel, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
      }),
    ).toMatchObject({ status: "published" });
  });

  it("blocks publication when model identity is incomplete", () => {
    expect(() =>
      enforceTireModelWorkflowData({
        data: { ...publishableModel, modelCode: "" },
        original: { ...publishableModel, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
      }),
    ).toThrow("Model cannot be published");
  });

  it("demotes a verified model after a technical taxonomy change", () => {
    expect(
      enforceTireModelWorkflowData({
        data: { positions: ["steer"] },
        original: { ...publishableModel, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
      }),
    ).toMatchObject({
      verificationStatus: "needsReview",
      validationWarnings: [
        expect.objectContaining({ code: "technical_fields_changed" }),
      ],
    });
  });

  it("keeps verification after an editorial change", () => {
    expect(
      enforceTireModelWorkflowData({
        data: { shortDescription: "New copy" },
        original: { ...publishableModel, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
      }),
    ).toMatchObject({ verificationStatus: "verified" });
  });

  it("rejects manual source snapshot mutation", () => {
    expect(() =>
      enforceTireModelWorkflowData({
        data: { sourceSnapshot: { sourceRowNumber: 3 } },
        original: {
          ...publishableModel,
          sourceSnapshot: { sourceRowNumber: 2 },
        },
        role: "admin",
        trustedImport: false,
        hasDuplicateIdentity: false,
      }),
    ).toThrow("Source snapshot can only be changed");
  });
});

describe("enforceTireVariantWorkflowData", () => {
  it("allows a complete variant to publish against a verified published model", () => {
    expect(
      enforceTireVariantWorkflowData({
        data: publishableVariant,
        original: { ...publishableVariant, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
        model: publishableModel,
      }),
    ).toMatchObject({ status: "published" });
  });

  it("blocks a publishBlocked variant", () => {
    expect(() =>
      enforceTireVariantWorkflowData({
        data: { ...publishableVariant, publishBlocked: true },
        original: { ...publishableVariant, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
        model: publishableModel,
      }),
    ).toThrow("Variant cannot be published");
  });

  it("demotes a verified variant after a technical change", () => {
    expect(
      enforceTireVariantWorkflowData({
        data: { loadIndexSingle: 158 },
        original: { ...publishableVariant, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
        model: publishableModel,
      }),
    ).toMatchObject({
      verificationStatus: "needsReview",
      validationWarnings: [
        expect.objectContaining({
          code: "technical_fields_changed",
          field: "loadIndexSingle",
        }),
      ],
    });
  });

  it("keeps verification after price and availability changes", () => {
    expect(
      enforceTireVariantWorkflowData({
        data: { price: 1000, availabilityStatus: "available" },
        original: { ...publishableVariant, status: "draft" },
        role: "content_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
        model: publishableModel,
      }),
    ).toMatchObject({ verificationStatus: "verified" });
  });

  it("rejects verified transition by a sales manager", () => {
    expect(() =>
      enforceTireVariantWorkflowData({
        data: { verificationStatus: "verified" },
        original: {
          ...publishableVariant,
          verificationStatus: "needsReview",
          status: "draft",
        },
        role: "sales_manager",
        trustedImport: false,
        hasDuplicateIdentity: false,
        model: publishableModel,
      }),
    ).toThrow("not allowed to set verification status");
  });
});
