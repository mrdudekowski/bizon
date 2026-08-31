import { parseCsv } from "./csv";

export type WheelSpecRow = {
  modelCode: string;
  internalReference?: string;
  widthJ: number;
  diameterInches: number;
  boltCount: number;
  pcdMm: number;
  offsetEtMm: number;
  centerBoreMm: number;
  sizeLabel: string;
  sourceSpecification: string;
  color?: string;
  fastenerType?: string;
  fastenerMaterial?: string;
  manufacturingMarkings?: string;
  manufacturingNotes?: string;
  variantKey: string;
};

export type WheelSpecParseResult = {
  rows: WheelSpecRow[];
  errors: string[];
  conflicts: string[];
};

const REQUIRED_HEADERS = [
  "Код модели",
  "Ширина, J",
  "Диаметр, дюймы",
  "Количество крепёжных отверстий",
  "PCD, мм",
  "ET, мм",
  "CB, мм",
  "Полная спецификация",
];

function decimal(value: string, label: string, rowNumber: number): number {
  const parsed = Number(value.trim().replace(",", "."));
  if (!Number.isFinite(parsed)) throw new Error(`row ${rowNumber}: invalid ${label} "${value}"`);
  return parsed;
}

function optionalText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized && normalized !== "не указан" ? normalized : undefined;
}

function normalizeFastener(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  if (!normalized || normalized === "не указан") return undefined;
  if (normalized.toLowerCase() === "no screw") return "без крепежа";
  return normalized;
}

function sourceMarkings(row: Record<string, string>): string | undefined {
  const values = [
    row["Маркировка на задней стороне диска"],
    row["Маркировка на лицевой стороне"],
    row["Маркировка на элементе beadlock"],
    row["Тип нанесения"],
  ].map((value) => value?.trim()).filter(Boolean);
  return values.length ? values.join(" | ") : undefined;
}

export function parseWheelSpecsCsv(text: string): WheelSpecParseResult {
  const rows = parseCsv(text).map((row) => {
    const firstKey = Object.keys(row)[0];
    if (!firstKey?.startsWith("\uFEFF")) return row;
    const { [firstKey]: value, ...rest } = row;
    return { [firstKey.replace(/^\uFEFF/, "")]: value, ...rest };
  });
  const errors: string[] = [];
  const normalized: WheelSpecRow[] = [];

  if (rows.length === 0) return { rows: [], errors: ["CSV contains no rows"], conflicts: [] };
  for (const header of REQUIRED_HEADERS) {
    if (!(header in rows[0])) errors.push(`missing required header "${header}"`);
  }
  if (errors.length) return { rows: [], errors, conflicts: [] };

  for (const [index, row] of rows.entries()) {
    const rowNumber = index + 2;
    try {
      const modelCode = row["Код модели"].trim().toUpperCase();
      const widthJ = decimal(row["Ширина, J"], "widthJ", rowNumber);
      const diameterInches = decimal(row["Диаметр, дюймы"], "diameterInches", rowNumber);
      const boltCount = decimal(row["Количество крепёжных отверстий"], "boltCount", rowNumber);
      const pcdMm = decimal(row["PCD, мм"], "pcdMm", rowNumber);
      const offsetEtMm = decimal(row["ET, мм"], "offsetEtMm", rowNumber);
      const centerBoreMm = decimal(row["CB, мм"], "centerBoreMm", rowNumber);
      const sourceSpecification = row["Полная спецификация"].trim();
      const variantKey = [modelCode, widthJ, diameterInches, boltCount, pcdMm, offsetEtMm, centerBoreMm].join("|");

      normalized.push({
        modelCode,
        internalReference: optionalText(row["Внутреннее имя"]),
        widthJ,
        diameterInches,
        boltCount,
        pcdMm,
        offsetEtMm,
        centerBoreMm,
        sizeLabel: `${widthJ}J×${diameterInches}`,
        sourceSpecification,
        color: optionalText(row["Цвет"]),
        fastenerType: normalizeFastener(row["Крепёж"]),
        fastenerMaterial: optionalText(row["Материал крепежа"]),
        manufacturingMarkings: sourceMarkings(row),
        manufacturingNotes: optionalText(row["Производственные примечания"]),
        variantKey,
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `row ${rowNumber}: invalid data`);
    }
  }

  const conflicts = normalized.some((row) => row.variantKey === "B006BM3|9|19|5|112|25|66.6")
    ? ["B006BM3 9J×19: engraving side conflicts between source columns; requires review"]
    : [];
  return { rows: normalized, errors, conflicts };
}
