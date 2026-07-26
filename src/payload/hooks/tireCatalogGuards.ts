import type { UserRole } from "@/access/roles";
import type { VerificationStatus } from "@/lib/catalog/domain/tireCatalog";
import { canSetTireVerificationStatus } from "@/lib/catalog/domain/tirePermissions";
import { isDeepStrictEqual } from "node:util";

export function assertVerificationTransitionAllowed(input: {
  previous?: VerificationStatus | null;
  next?: VerificationStatus | null;
  role: UserRole | null;
}): void {
  if (!input.next || input.previous === input.next) return;
  if (!canSetTireVerificationStatus(input.role, input.next)) {
    throw new Error(
      `Role ${input.role ?? "system"} is not allowed to set verification status ${input.next}`,
    );
  }
}

export function assertSourceSnapshotMutationAllowed(input: {
  previous: unknown;
  next: unknown;
  trustedImport: boolean;
}): void {
  if (isDeepStrictEqual(input.previous, input.next)) return;
  if (!input.trustedImport) {
    throw new Error(
      "Source snapshot can only be changed by the catalog importer",
    );
  }
}

export function getVerificationSensitiveChanges(input: {
  previous: Record<string, unknown>;
  next: Record<string, unknown>;
  fields: readonly string[];
}): string[] {
  return input.fields.filter(
    (field) => !isDeepStrictEqual(input.previous[field], input.next[field]),
  );
}
