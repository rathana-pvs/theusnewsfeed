import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Rebrand: Asian Dot -> The US News Feed. Updates the media.alt column default.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE media ALTER COLUMN alt SET DEFAULT 'The US News Feed';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE media ALTER COLUMN alt SET DEFAULT 'Asian Dot';`)
}
