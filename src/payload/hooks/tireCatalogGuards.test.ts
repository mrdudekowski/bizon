import { describe, expect, it } from "vitest";

import {
  assertSourceSnapshotMutationAllowed,
  assertVerificationTransitionAllowed,
  getVerificationSensitiveChanges,
} from "./tireCatalogGuards";

describe("tire catalog guards", () => {
  it("allows admin and content manager to verify", () => {
    expect(() =>
      assertVerificationTransitionAllowed({
        previous: "needsReview",
        next: "verified",
        role: "content_manager",
      }),
    ).not.toThrow();
  });

  it("rejects verification by sales manager", () => {
    expect(() =>
      assertVerificationTransitionAllowed({
        previous: "needsReview",
        next: "verified",
        role: "sales_manager",
      }),
    ).toThrow("not allowed to set verification status");
  });

  it("rejects a manual source snapshot mutation", () => {
    expect(() =>
      assertSourceSnapshotMutationAllowed({
        previous: { sourceDocument: "source.xlsx", sourceRowNumber: 2 },
        next: { sourceDocument: "source.xlsx", sourceRowNumber: 3 },
        trustedImport: false,
      }),
    ).toThrow("Source snapshot can only be changed by the catalog importer");
  });

  it("allows a trusted importer to update source snapshot", () => {
    expect(() =>
      assertSourceSnapshotMutationAllowed({
        previous: { sourceDocument: "source.xlsx", sourceRowNumber: 2 },
        next: { sourceDocument: "source.xlsx", sourceRowNumber: 3 },
        trustedImport: true,
      }),
    ).not.toThrow();
  });

  it("detects technical changes but ignores commercial and editorial changes", () => {
    expect(
      getVerificationSensitiveChanges({
        previous: {
          sizeNormalized: "315/80R22.5",
          loadIndexSingle: 156,
          price: null,
          shortDescription: "Old",
        },
        next: {
          sizeNormalized: "315/80R22.5",
          loadIndexSingle: 158,
          price: 1000,
          shortDescription: "New",
        },
        fields: ["sizeNormalized", "loadIndexSingle"],
      }),
    ).toEqual(["loadIndexSingle"]);
  });

  it("compares arrays by value rather than reference", () => {
    expect(
      getVerificationSensitiveChanges({
        previous: { positions: ["drive", "trailer"] },
        next: { positions: ["drive", "trailer"] },
        fields: ["positions"],
      }),
    ).toEqual([]);
  });
});
