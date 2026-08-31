import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Optional operational topics for Tire IQ articles. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "tire_iq_articles_taxonomy" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "value" varchar NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "tire_iq_articles_taxonomy_parent_idx"
      ON "tire_iq_articles_taxonomy" ("_parent_id");

    ALTER TABLE "tire_iq_articles_taxonomy"
      DROP CONSTRAINT IF EXISTS "tire_iq_articles_taxonomy_parent_fk";

    ALTER TABLE "tire_iq_articles_taxonomy"
      ADD CONSTRAINT "tire_iq_articles_taxonomy_parent_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "tire_iq_articles"("id")
      ON DELETE CASCADE;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "tire_iq_articles_taxonomy";
  `);
}
