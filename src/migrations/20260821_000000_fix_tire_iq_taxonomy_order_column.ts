import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

/** Align the taxonomy array order column with Payload's generated query. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_iq_articles_taxonomy"
      RENAME COLUMN "_order" TO "order";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tire_iq_articles_taxonomy"
      RENAME COLUMN "order" TO "_order";
  `);
}
