import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Align the taxonomy array parent column with Payload's generated query. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_iq_articles_taxonomy"
      RENAME COLUMN "_parent_id" TO "parent_id";
    ALTER INDEX IF EXISTS "tire_iq_articles_taxonomy_parent_idx"
      RENAME TO "tire_iq_articles_taxonomy_parent_id_idx";
    ALTER TABLE "tire_iq_articles_taxonomy"
      DROP CONSTRAINT IF EXISTS "tire_iq_articles_taxonomy_parent_fk";
    ALTER TABLE "tire_iq_articles_taxonomy"
      ADD CONSTRAINT "tire_iq_articles_taxonomy_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "tire_iq_articles"("id")
      ON DELETE CASCADE;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_iq_articles_taxonomy"
      DROP CONSTRAINT IF EXISTS "tire_iq_articles_taxonomy_parent_fk";
    ALTER INDEX IF EXISTS "tire_iq_articles_taxonomy_parent_id_idx"
      RENAME TO "tire_iq_articles_taxonomy_parent_idx";
    ALTER TABLE "tire_iq_articles_taxonomy"
      RENAME COLUMN "parent_id" TO "_parent_id";
    ALTER TABLE "tire_iq_articles_taxonomy"
      ADD CONSTRAINT "tire_iq_articles_taxonomy_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "tire_iq_articles"("id")
      ON DELETE CASCADE;
  `);
}
