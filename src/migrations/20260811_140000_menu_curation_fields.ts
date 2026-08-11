import { MigrateUpArgs, MigrateDownArgs, sql } from "@payloadcms/db-postgres";

/** showInMenu + menuOrder for dual-pane burger curation. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_models"
      ADD COLUMN IF NOT EXISTS "show_in_menu" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "menu_order" numeric DEFAULT 0;

    ALTER TABLE "tire_iq_articles"
      ADD COLUMN IF NOT EXISTS "show_in_menu" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "menu_order" numeric DEFAULT 0;

    ALTER TABLE "wheel_models"
      ADD COLUMN IF NOT EXISTS "show_in_menu" boolean DEFAULT true,
      ADD COLUMN IF NOT EXISTS "menu_order" numeric DEFAULT 0;

    UPDATE "tire_models" SET "show_in_menu" = true WHERE "show_in_menu" IS NULL;
    UPDATE "tire_models" SET "menu_order" = 0 WHERE "menu_order" IS NULL;
    UPDATE "tire_iq_articles" SET "show_in_menu" = true WHERE "show_in_menu" IS NULL;
    UPDATE "tire_iq_articles" SET "menu_order" = 0 WHERE "menu_order" IS NULL;
    UPDATE "wheel_models" SET "show_in_menu" = true WHERE "show_in_menu" IS NULL;
    UPDATE "wheel_models" SET "menu_order" = 0 WHERE "menu_order" IS NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_models"
      DROP COLUMN IF EXISTS "show_in_menu",
      DROP COLUMN IF EXISTS "menu_order";

    ALTER TABLE "tire_iq_articles"
      DROP COLUMN IF EXISTS "show_in_menu",
      DROP COLUMN IF EXISTS "menu_order";

    ALTER TABLE "wheel_models"
      DROP COLUMN IF EXISTS "show_in_menu",
      DROP COLUMN IF EXISTS "menu_order";
  `);
}
