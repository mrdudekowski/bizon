import type { UserRole } from "@/access/roles";
import { getUserRole, type BizonUser } from "@/access/roles";
import type {
  VerificationStatus,
} from "@/lib/catalog/domain/tireCatalog";
import {
  validateModelPublication,
  validateVariantPublication,
  type ValidationWarning,
} from "@/lib/catalog/domain/tireValidation";
import {
  assertSourceSnapshotMutationAllowed,
  assertVerificationTransitionAllowed,
  getVerificationSensitiveChanges,
} from "./tireCatalogGuards";
import type { CollectionBeforeChangeHook } from "payload";

type WorkflowInput = {
  data: Record<string, unknown>;
  original?: Record<string, unknown> | null;
  role: UserRole | null;
  trustedImport: boolean;
  hasDuplicateIdentity: boolean;
  model?: Record<string, unknown> | null;
};

export const MODEL_VERIFICATION_SENSITIVE_FIELDS = [
  "catalogId",
  "modelCode",
  "slug",
  "tireType",
  "positions",
  "applicationTypes",
  "features",
] as const;

export const VARIANT_VERIFICATION_SENSITIVE_FIELDS = [
  "catalogId",
  "sku",
  "supplierSku",
  "tireModel",
  "sizeRaw",
  "sizeNormalized",
  "sizeFormat",
  "nominalWidthMm",
  "imperialWidthIn",
  "aspectRatioPct",
  "constructionCode",
  "rimDiameterIn",
  "plyRatingPr",
  "treadDepthMm",
  "standardRimIn",
  "pressureSingleKpa",
  "pressureDualKpa",
  "maxLoadSingleKg",
  "maxLoadDualKg",
  "loadIndexSingle",
  "loadIndexDual",
  "speedSymbol",
  "overallDiameterMm",
  "sectionWidthMm",
] as const;

function verificationStatus(value: unknown): VerificationStatus | null {
  return value === "imported" ||
    value === "needsReview" ||
    value === "verified" ||
    value === "rejected"
    ? value
    : null;
}

function warnings(value: unknown): ValidationWarning[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (warning): warning is ValidationWarning =>
      typeof warning === "object" &&
      warning !== null &&
      typeof (warning as ValidationWarning).code === "string" &&
      ((warning as ValidationWarning).severity === "warning" ||
        (warning as ValidationWarning).severity === "critical") &&
      typeof (warning as ValidationWarning).message === "string",
  );
}

function withTechnicalChangeWarnings(
  current: ValidationWarning[],
  changes: string[],
): ValidationWarning[] {
  return [
    ...current.filter((warning) => warning.code !== "technical_fields_changed"),
    ...changes.map((field) => ({
      code: "technical_fields_changed",
      severity: "critical" as const,
      field,
      message: `Technical field changed: ${field}`,
    })),
  ];
}

function applyWorkflowGuards(
  input: WorkflowInput,
  sensitiveFields: readonly string[],
): Record<string, unknown> {
  const original = input.original ?? {};
  const merged = { ...original, ...input.data };
  const previousStatus = verificationStatus(original.verificationStatus);
  const requestedStatus = verificationStatus(merged.verificationStatus);

  if (
    input.trustedImport &&
    original.status !== "published" &&
    merged.status === "published"
  ) {
    throw new Error("Catalog importer cannot publish records");
  }

  assertSourceSnapshotMutationAllowed({
    previous: original.sourceSnapshot,
    next: Object.hasOwn(input.data, "sourceSnapshot")
      ? input.data.sourceSnapshot
      : original.sourceSnapshot,
    trustedImport: input.trustedImport,
  });

  const changes = previousStatus === "verified"
    ? getVerificationSensitiveChanges({
        previous: original,
        next: merged,
        fields: sensitiveFields,
      })
    : [];

  if (changes.length > 0) {
    merged.verificationStatus = "needsReview";
    merged.validationWarnings = withTechnicalChangeWarnings(
      warnings(merged.validationWarnings),
      changes,
    );
    if (original.status === "published") {
      merged.status = "draft";
    }
  }

  assertVerificationTransitionAllowed({
    previous: previousStatus,
    next: verificationStatus(merged.verificationStatus) ?? requestedStatus,
    role: input.role,
  });

  return merged;
}

function duplicateWarning(): ValidationWarning {
  return {
    code: "duplicate_identity",
    severity: "critical",
    message: "Catalog identity is already in use",
  };
}

function publicationError(
  entity: "Model" | "Variant",
  warningsList: ValidationWarning[],
): Error {
  const details = warningsList
    .filter((warning) => warning.severity === "critical")
    .map((warning) => warning.field ?? warning.code)
    .join(", ");
  return new Error(`${entity} cannot be published: ${details}`);
}

export function enforceTireModelWorkflowData(
  input: WorkflowInput,
): Record<string, unknown> {
  const merged = applyWorkflowGuards(
    input,
    MODEL_VERIFICATION_SENSITIVE_FIELDS,
  );
  if (merged.status !== "published") return merged;

  const currentWarnings = warnings(merged.validationWarnings);
  if (input.hasDuplicateIdentity) currentWarnings.push(duplicateWarning());
  const validation = validateModelPublication({
    catalogId: merged.catalogId as string | null | undefined,
    modelCode: merged.modelCode as string | null | undefined,
    name: merged.name as string | null | undefined,
    slug: merged.slug as string | null | undefined,
    tireType: merged.tireType as string | number | null | undefined,
    positions: merged.positions as string[] | null | undefined,
    applicationTypes: merged.applicationTypes as string[] | null | undefined,
    verificationStatus: verificationStatus(merged.verificationStatus),
    warnings: currentWarnings,
  });
  if (!validation.canPublish) {
    throw publicationError("Model", validation.warnings);
  }
  return { ...merged, validationWarnings: validation.warnings };
}

export function enforceTireVariantWorkflowData(
  input: WorkflowInput,
): Record<string, unknown> {
  const merged = applyWorkflowGuards(
    input,
    VARIANT_VERIFICATION_SENSITIVE_FIELDS,
  );
  if (merged.status !== "published") return merged;

  const currentWarnings = warnings(merged.validationWarnings);
  const sourceRaw = JSON.stringify(merged.sourceSnapshot ?? {});
  const sourceRatingRaw = sourceRaw.includes("160(158) K(L)")
    ? "160(158) K(L)"
    : sourceRaw.includes("156/183 K")
      ? "156/183 K"
      : null;

  const validation = validateVariantPublication({
    catalogId: merged.catalogId as string | null | undefined,
    sku: merged.sku as string | null | undefined,
    verificationStatus: verificationStatus(merged.verificationStatus),
    publishBlocked: merged.publishBlocked === true,
    parsedSize:
      typeof merged.sizeNormalized === "string" &&
      merged.sizeNormalized.trim().length > 0,
    plyRatingPr: merged.plyRatingPr as number | null | undefined,
    treadDepthMm: merged.treadDepthMm as number | null | undefined,
    standardRimIn: merged.standardRimIn as number | null | undefined,
    loadIndexSingle: merged.loadIndexSingle as number | null | undefined,
    speedSymbol: merged.speedSymbol as string | null | undefined,
    overallDiameterMm: merged.overallDiameterMm as number | null | undefined,
    sectionWidthMm: merged.sectionWidthMm as number | null | undefined,
    model: input.model
      ? {
          status: input.model.status as
            | "draft"
            | "published"
            | "archived"
            | null
            | undefined,
          verificationStatus: verificationStatus(
            input.model.verificationStatus,
          ),
        }
      : null,
    hasDuplicateIdentity: input.hasDuplicateIdentity,
    sourceRatingRaw,
    warnings: currentWarnings,
  });
  if (!validation.canPublish) {
    throw publicationError("Variant", validation.warnings);
  }
  return { ...merged, validationWarnings: validation.warnings };
}

type PayloadHookRequest = Parameters<CollectionBeforeChangeHook>[0]["req"];

function trustedImport(req: PayloadHookRequest): boolean {
  return (
    (req.context as { tbrCatalogImport?: unknown } | undefined)
      ?.tbrCatalogImport === true
  );
}

function relationId(value: unknown): string | number | null {
  if (typeof value === "string" || typeof value === "number") return value;
  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    (typeof value.id === "string" || typeof value.id === "number")
  ) {
    return value.id;
  }
  return null;
}

async function hasDuplicate(
  req: PayloadHookRequest,
  collection: "tire-models" | "tire-variants",
  clauses: Record<string, unknown>[],
  currentId: unknown,
): Promise<boolean> {
  if (clauses.length === 0) return false;
  const and: Record<string, unknown>[] = [{ or: clauses }];
  if (typeof currentId === "string" || typeof currentId === "number") {
    and.push({ id: { not_equals: currentId } });
  }
  const found = await req.payload.find({
    collection,
    where: { and },
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
    req,
  } as Parameters<typeof req.payload.find>[0]);
  return found.docs.length > 0;
}

async function modelHasDuplicate(
  req: PayloadHookRequest,
  data: Record<string, unknown>,
  currentId: unknown,
): Promise<boolean> {
  const clauses = ["catalogId", "modelCode", "slug"].flatMap((field) => {
    const value = data[field];
    return typeof value === "string" && value.trim()
      ? [{ [field]: { equals: value } }]
      : [];
  });
  return hasDuplicate(req, "tire-models", clauses, currentId);
}

async function variantHasDuplicate(
  req: PayloadHookRequest,
  data: Record<string, unknown>,
  currentId: unknown,
): Promise<boolean> {
  const clauses: Record<string, unknown>[] = ["catalogId", "sku"].flatMap((field) => {
    const value = data[field];
    return typeof value === "string" && value.trim()
      ? [{ [field]: { equals: value } }]
      : [];
  });
  const modelId = relationId(data.tireModel);
  if (
    modelId != null &&
    typeof data.sizeNormalized === "string" &&
    data.sizeNormalized &&
    typeof data.plyRatingPr === "number"
  ) {
    clauses.push({
      and: [
        { tireModel: { equals: modelId } },
        { sizeNormalized: { equals: data.sizeNormalized } },
        { plyRatingPr: { equals: data.plyRatingPr } },
      ],
    });
  }
  return hasDuplicate(req, "tire-variants", clauses, currentId);
}

export const validateTireModelPublication: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const original = (originalDoc as Record<string, unknown> | null) ?? {};
  const merged = { ...original, ...(data ?? {}) };
  return enforceTireModelWorkflowData({
    data: data ?? {},
    original,
    role: getUserRole(req.user as BizonUser | undefined),
    trustedImport: trustedImport(req),
    hasDuplicateIdentity: await modelHasDuplicate(req, merged, original.id),
  });
};

export const validateTireVariantPublication: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const original = (originalDoc as Record<string, unknown> | null) ?? {};
  const merged = { ...original, ...(data ?? {}) };
  const modelId = relationId(merged.tireModel);
  const model = modelId == null
    ? null
    : await req.payload.findByID({
        collection: "tire-models",
        id: modelId,
        depth: 0,
        overrideAccess: true,
        req,
      });

  return enforceTireVariantWorkflowData({
    data: data ?? {},
    original,
    role: getUserRole(req.user as BizonUser | undefined),
    trustedImport: trustedImport(req),
    hasDuplicateIdentity: await variantHasDuplicate(req, merged, original.id),
    model: model as unknown as Record<string, unknown> | null,
  });
};
