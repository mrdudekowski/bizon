import { describe, expect, it } from "vitest";

import { canSetTireVerificationStatus } from "./tirePermissions";

describe("tire verification permissions", () => {
  it.each(["admin", "content_manager"] as const)(
    "allows %s to verify a record",
    (role) => {
      expect(canSetTireVerificationStatus(role, "verified")).toBe(true);
    },
  );

  it.each(["sales_manager", "viewer", null] as const)(
    "does not allow %s to verify a record",
    (role) => {
      expect(canSetTireVerificationStatus(role, "verified")).toBe(false);
    },
  );

  it("allows the system to demote a record to needsReview", () => {
    expect(canSetTireVerificationStatus(null, "needsReview")).toBe(true);
  });
});
