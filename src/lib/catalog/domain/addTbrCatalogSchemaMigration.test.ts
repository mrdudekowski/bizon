import { describe, expect, it } from "vitest";

import {
  down,
  up,
} from "../../../migrations/20260726_094343_add_tbr_catalog_schema";

describe("add TBR catalog schema migration", () => {
  const upSql = up.toString();
  const downSql = down.toString();

  it("enforces the canonical variant composite identity", () => {
    expect(upSql).toContain(
      'CREATE UNIQUE INDEX "tire_variants_model_size_pr_idx"',
    );
    expect(upSql).toContain(
      '("tire_model_id", "size_normalized", "ply_rating_pr")',
    );
    expect(downSql).toContain(
      'DROP INDEX IF EXISTS "tire_variants_model_size_pr_idx"',
    );
  });

  it("keeps the UP migration free of data rewrites and destructive drops", () => {
    expect(upSql).not.toMatch(/\bDELETE\s+FROM\b/i);
    expect(upSql).not.toMatch(/(?:^|\n)\s*UPDATE\s+["a-z_]/i);
    expect(upSql).not.toMatch(/\bTRUNCATE\b/i);
    expect(upSql).not.toMatch(/\bDROP\s+(?:TABLE|COLUMN)\b/i);
  });
});
