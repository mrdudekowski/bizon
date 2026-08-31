import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Canonical geometry and source-only fields for imported wheel specifications. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "wheel_variants"
      ADD COLUMN IF NOT EXISTS "pcd_mm" numeric,
      ADD COLUMN IF NOT EXISTS "fastener_type" varchar,
      ADD COLUMN IF NOT EXISTS "fastener_material" varchar,
      ADD COLUMN IF NOT EXISTS "source_specification" text,
      ADD COLUMN IF NOT EXISTS "internal_reference" varchar,
      ADD COLUMN IF NOT EXISTS "manufacturing_markings" text,
      ADD COLUMN IF NOT EXISTS "manufacturing_notes" text;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "wheel_variants"
      DROP COLUMN IF EXISTS "pcd_mm",
      DROP COLUMN IF EXISTS "fastener_type",
      DROP COLUMN IF EXISTS "fastener_material",
      DROP COLUMN IF EXISTS "source_specification",
      DROP COLUMN IF EXISTS "internal_reference",
      DROP COLUMN IF EXISTS "manufacturing_markings",
      DROP COLUMN IF EXISTS "manufacturing_notes";
  `);
}
