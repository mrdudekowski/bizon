import { normalizeCatalogIdentity } from "@/lib/catalog/domain/tireCatalog";
import { parseTireSize } from "@/lib/catalog/domain/parseTireSize";
import type { CollectionBeforeValidateHook } from "payload";

export type TireCatalogData = Record<string, unknown>;

export function normalizeTireModelData(
  data: TireCatalogData,
): TireCatalogData {
  return normalizeIdentities(data, ["catalogId", "modelCode"]);
}

type StoredWarning = {
  code: string;
  severity: "warning" | "critical";
  field?: string;
  message: string;
};

const NORMALIZED_SIZE_FIELDS = [
  "sizeNormalized",
  "sizeFormat",
  "nominalWidthMm",
  "imperialWidthIn",
  "aspectRatioPct",
  "constructionCode",
  "rimDiameterIn",
] as const;

function normalizeIdentities(
  data: TireCatalogData,
  fields: readonly string[],
): TireCatalogData {
  const normalized = { ...data };
  for (const field of fields) {
    const value = normalized[field];
    if (typeof value !== "string") continue;
    normalized[field] = value.trim()
      ? normalizeCatalogIdentity(value)
      : "";
  }
  return normalized;
}

function storedWarnings(value: unknown): StoredWarning[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (warning): warning is StoredWarning =>
      typeof warning === "object" &&
      warning !== null &&
      typeof (warning as StoredWarning).code === "string" &&
      typeof (warning as StoredWarning).message === "string",
  );
}

function withoutSizeParserWarnings(warnings: StoredWarning[]): StoredWarning[] {
  return warnings.filter(
    (warning) =>
      warning.code !== "size_parse_failed" &&
      warning.code !== "size_parser_conflict",
  );
}

function hasSizeParserConflict(warnings: StoredWarning[]): boolean {
  return warnings.some((warning) => warning.code === "size_parser_conflict");
}

function parsedSizeFields(
  value: Extract<ReturnType<typeof parseTireSize>, { ok: true }>["value"],
): TireCatalogData {
  if (value.sizeFormat === "metric") {
    return {
      ...value,
      imperialWidthIn: null,
    };
  }
  return {
    ...value,
    nominalWidthMm: null,
    aspectRatioPct: null,
  };
}

function preserveNormalizedSize(
  target: TireCatalogData,
  original: TireCatalogData,
): void {
  for (const field of NORMALIZED_SIZE_FIELDS) {
    target[field] = original[field] ?? null;
  }
}

export function normalizeTireVariantData(input: {
  data: TireCatalogData;
  original?: TireCatalogData | null;
}): TireCatalogData {
  const original = input.original ?? {};
  const merged = normalizeIdentities(
    { ...original, ...input.data },
    ["catalogId", "sku", "supplierSku"],
  );
  const raw = typeof merged.sizeRaw === "string" ? merged.sizeRaw : "";
  if (!raw.trim()) return merged;

  const originalWarnings = storedWarnings(original.validationWarnings);
  const currentWarnings = storedWarnings(merged.validationWarnings);
  const parseResult = parseTireSize(raw);
  if (parseResult.ok === false) {
    return {
      ...merged,
      verificationStatus: "needsReview",
      validationWarnings: [
        ...withoutSizeParserWarnings(currentWarnings),
        {
          code: "size_parse_failed",
          severity: "critical",
          field: "sizeRaw",
          message: `Tire size could not be parsed: ${parseResult.code}`,
        },
      ],
    };
  }

  const originalRaw =
    typeof original.sizeRaw === "string" ? original.sizeRaw.trim() : "";
  const rawChanged = Boolean(originalRaw) && originalRaw !== raw.trim();
  const originalVerified = original.verificationStatus === "verified";

  if (originalVerified && !rawChanged) {
    return merged;
  }

  if (originalVerified && rawChanged) {
    const conflicted = {
      ...merged,
      verificationStatus: "needsReview",
      validationWarnings: [
        ...withoutSizeParserWarnings(currentWarnings),
        {
          code: "size_parser_conflict",
          severity: "critical",
          field: "sizeRaw",
          message: `Parser candidate: ${parseResult.value.sizeNormalized}`,
        },
      ],
    };
    preserveNormalizedSize(conflicted, original);
    return conflicted;
  }

  const pendingConflict =
    hasSizeParserConflict(originalWarnings) &&
    merged.verificationStatus !== "verified";
  if (pendingConflict) {
    const preserved = { ...merged };
    preserveNormalizedSize(preserved, original);
    return preserved;
  }

  return {
    ...merged,
    ...parsedSizeFields(parseResult.value),
    validationWarnings: withoutSizeParserWarnings(currentWarnings),
  };
}

export const normalizeTireModel: CollectionBeforeValidateHook = ({
  data,
}) => normalizeTireModelData(data ?? {});

export const normalizeTireVariant: CollectionBeforeValidateHook = ({
  data,
  originalDoc,
}) =>
  normalizeTireVariantData({
    data: data ?? {},
    original: (originalDoc as TireCatalogData | null | undefined) ?? null,
  });
