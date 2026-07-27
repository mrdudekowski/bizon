export type TbrImportProjection = {
  models: TbrModelProjection[];
  variants: TbrVariantProjection[];
  features: TbrFeatureProjection[];
};

export type TbrModelProjection = {
  model_id: string;
  model_code: string;
  model_slug: string;
  name_ru: string;
  publication_status?: string;
  model_verification_status?: string;
  short_description_ru?: string;
  full_description_ru?: string;
  source_page?: number;
  source_row_number?: number;
  source_raw: Record<string, unknown>;
  application_json?: string[];
  axle_json?: string[];
  feature_count?: number;
};

export type TbrVariantProjection = {
  variant_id: string;
  model_id: string;
  size_raw: string;
  size_normalized?: string;
  ply_rating_pr?: number | null;
  load_index_dual?: number | null;
  speed_symbol?: string | null;
  verification_status?: string;
  publish_blocked?: boolean;
  source_page?: number;
  source_row_number?: number;
  source_raw: Record<string, unknown>;
  [key: string]: unknown;
};

export type TbrFeatureProjection = {
  model_id: string;
  feature_order: number;
  feature_key: string;
  feature_title_ru: string;
  feature_description_ru?: string;
  feature_title_en_source?: string;
  feature_description_en_source?: string;
  technical_claim_status?: string;
  source_page?: number;
  source_verified?: boolean;
  source_raw: Record<string, unknown>;
};

export type TbrImportPlanOptions = {
  workbookSha256: string;
  batchId: string;
  sourceDocument: string;
  expectedCounts?: {
    models: number;
    variants: number;
    features: number;
    blockedVariants: number;
  };
};

export type TbrImportPlan = {
  workbookSha256: string;
  batchId: string;
  models: Array<Record<string, unknown>>;
  variants: Array<Record<string, unknown>>;
  features: Array<Record<string, unknown>>;
};

export function parseJsonCell<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function projectionFromWorkbookSheets(sheets: {
  models: Record<string, unknown>[];
  variants: Record<string, unknown>[];
  features: Record<string, unknown>[];
  cmsImport?: Record<string, unknown>[];
}): TbrImportProjection {
  const cmsByVariant = new Map((sheets.cmsImport ?? []).map((row) => [String(row.variant_id), row]));
  return {
    models: sheets.models.map((row) => ({
      model_id: String(row.model_id),
      model_code: String(row.model_code),
      model_slug: String(row.slug),
      name_ru: String(row.public_name_ru),
      publication_status: String(row.publication_status ?? "draft"),
      model_verification_status: String(row.verification_status ?? "verified"),
      short_description_ru: String(row.short_description_ru ?? ""),
      full_description_ru: String(row.full_description_ru ?? ""),
      source_page: Number(row.source_page) || undefined,
      source_row_number: Number(row.source_page) || undefined,
      source_raw: row,
      application_json: parseJsonCell(row.application_keys, [] as string[]),
      axle_json: [
        ["axle_steer", "steer"],
        ["axle_drive", "drive"],
        ["axle_trailer", "trailer"],
      ]
        .filter(([key]) => Boolean(row[key]))
        .map(([, value]) => value),
    })),
    variants: sheets.variants.map((row) => {
      const cms = cmsByVariant.get(String(row.variant_id)) ?? row;
      return {
        ...row,
        variant_id: String(row.variant_id),
        model_id: String(row.model_id),
        size_raw: String(row.size_raw),
        size_normalized: String(row.size_normalized ?? ""),
        source_page: Number(row.source_page) || undefined,
        source_row_number: Number(row.source_row_number) || undefined,
        source_raw: row.source_data_raw
          ? parseJsonCell<Record<string, unknown>>(row.source_data_raw, row)
          : row,
        verification_status: String(cms.verification_status ?? row.verification_status ?? "verified"),
        publish_blocked: Boolean(cms.publish_blocked ?? row.publish_blocked),
      };
    }),
    features: sheets.features.map((row) => ({
      model_id: String(row.model_id),
      feature_order: Number(row.feature_order),
      feature_key: String(row.feature_key),
      feature_title_ru: String(row.feature_title_ru ?? ""),
      feature_description_ru: String(row.feature_description_ru ?? ""),
      feature_title_en_source: String(row.feature_title_en_source ?? ""),
      feature_description_en_source: String(row.feature_description_en_source ?? ""),
      technical_claim_status: String(row.technical_claim_status ?? "source_only"),
      source_page: Number(row.source_page) || undefined,
      source_verified: Boolean(row.source_verified),
      source_raw: row,
    })),
  };
}

const DEFAULT_COUNTS = { models: 24, variants: 48, features: 70, blockedVariants: 4 };

export function buildTbrImportPlan(
  projection: TbrImportProjection,
  options: TbrImportPlanOptions,
): TbrImportPlan {
  const expected = options.expectedCounts ?? DEFAULT_COUNTS;
  const blockedVariants = projection.variants.filter((variant) => variant.publish_blocked).length;
  if (
    projection.models.length !== expected.models ||
    projection.variants.length !== expected.variants ||
    projection.features.length !== expected.features ||
    blockedVariants !== expected.blockedVariants
  ) {
    throw new Error(
      `Count gate failed: models=${projection.models.length}/${expected.models}, ` +
        `variants=${projection.variants.length}/${expected.variants}, ` +
        `features=${projection.features.length}/${expected.features}, ` +
        `blockedVariants=${blockedVariants}/${expected.blockedVariants}`,
    );
  }

  return {
    workbookSha256: options.workbookSha256,
    batchId: options.batchId,
    models: projection.models.map((model) => ({
      catalogId: model.model_id,
      modelCode: model.model_code,
      slug: model.model_slug,
      name: model.name_ru,
      tireTypeCatalogId: "tbr",
      positions: model.axle_json ?? [],
      applicationTypes: model.application_json ?? [],
      status: "draft",
      verificationStatus: "imported",
      shortDescription: model.short_description_ru || undefined,
      fullDescription: model.full_description_ru || undefined,
      sourceSnapshot: {
        sourceDocument: options.sourceDocument,
        sourceSheet: "01_TIRE_MODELS",
        sourcePage: model.source_page,
        sourceRowNumber: model.source_row_number,
        sourceDataRaw: model.source_raw,
        importedAt: new Date().toISOString(),
        importBatchId: options.batchId,
      },
    })),
    variants: projection.variants.map((variant) => {
      const blocked = Boolean(variant.publish_blocked);
      return {
        catalogId: variant.variant_id,
        tireModelCatalogId: variant.model_id,
        sizeRaw: variant.size_raw,
        sizeNormalized: variant.size_normalized || undefined,
        plyRatingPr: variant.ply_rating_pr ?? undefined,
        loadIndexDual: variant.load_index_dual ?? undefined,
        speedSymbol: variant.speed_symbol || undefined,
        sizeFormat: variant.size_format || undefined,
        nominalWidthMm: variant.nominal_width_mm ?? undefined,
        imperialWidthIn: variant.imperial_width_in ?? undefined,
        aspectRatioPct: variant.aspect_ratio_pct ?? undefined,
        constructionCode: variant.construction_code || undefined,
        rimDiameterIn: variant.rim_diameter_in ?? undefined,
        treadDepthMm: variant.tread_depth_mm ?? undefined,
        standardRimIn: variant.standard_rim_in ?? undefined,
        pressureSingleKpa: variant.pressure_single_kpa ?? undefined,
        pressureDualKpa: variant.pressure_dual_kpa ?? undefined,
        maxLoadSingleKg: variant.max_load_single_kg ?? undefined,
        maxLoadDualKg: variant.max_load_dual_kg ?? undefined,
        loadIndexSingle: variant.load_index_single ?? undefined,
        overallDiameterMm: variant.overall_diameter_mm ?? undefined,
        sectionWidthMm: variant.section_width_mm ?? undefined,
        status: "draft",
        verificationStatus: blocked ? "needsReview" : "imported",
        publishBlocked: blocked,
        sourceSnapshot: {
          sourceDocument: options.sourceDocument,
          sourceSheet: "13_CMS_IMPORT",
          sourcePage: variant.source_page,
          sourceRowNumber: variant.source_row_number,
          sourceDataRaw: variant.source_raw,
          importedAt: new Date().toISOString(),
          importBatchId: options.batchId,
        },
      };
    }),
    features: projection.features
      .slice()
      .sort((a, b) => a.model_id.localeCompare(b.model_id) || a.feature_order - b.feature_order)
      .map((feature) => ({
        modelCatalogId: feature.model_id,
        key: feature.feature_key,
        titleRu: feature.feature_title_ru,
        descriptionRu: feature.feature_description_ru || undefined,
        sourceTitleEn: feature.feature_title_en_source || undefined,
        sourceDescriptionEn: feature.feature_description_en_source || undefined,
        verificationStatus: "sourceOnly",
        featureOrder: feature.feature_order,
        sourceSnapshot: {
          sourceDocument: options.sourceDocument,
          sourceSheet: "03_MODEL_FEATURES",
          sourcePage: feature.source_page,
          sourceDataRaw: feature.source_raw,
          importedAt: new Date().toISOString(),
          importBatchId: options.batchId,
        },
      })),
  };
}
