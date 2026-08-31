import { describe, expect, it } from "vitest";

import { parseWheelSpecsCsv } from "../../../scripts/lib/wheelSpecs";

describe("parseWheelSpecsCsv", () => {
  it("normalizes decimal values and keeps ET zero", () => {
    const result = parseWheelSpecsCsv([
      'Код модели,Внутреннее имя,"Ширина, J","Диаметр, дюймы",Количество крепёжных отверстий,"PCD, мм","ET, мм","CB, мм",Полная спецификация,Цвет,Крепёж,Материал крепежа',
      'B002JWR,ANTON,9,20,5,127,0,"71,6",9J×20,не указан,конический болт,не указан',
    ].join("\n"));

    expect(result.errors).toEqual([]);
    expect(result.rows[0]).toMatchObject({ modelCode: "B002JWR", pcdMm: 127, offsetEtMm: 0, centerBoreMm: 71.6 });
  });

  it("reports the known B006BM3 engraving conflict", () => {
    const result = parseWheelSpecsCsv([
      'Код модели,Внутреннее имя,"Ширина, J","Диаметр, дюймы",Количество крепёжных отверстий,"PCD, мм","ET, мм","CB, мм",Полная спецификация',
      'B006BM3,OLEG,9,19,5,112,25,"66,6",9J×19',
    ].join("\n"));

    expect(result.rows).toHaveLength(1);
    expect(result.conflicts).toHaveLength(1);
  });
});
