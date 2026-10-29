import { PGlite } from '@electric-sql/pglite'
import { vector } from '@electric-sql/pglite-pgvector'

export async function openDatabase(dataDir = 'data/pg') {
  const db = new PGlite(dataDir, { extensions: { vector } })
  await db.exec(`
    CREATE EXTENSION IF NOT EXISTS vector;
    CREATE TABLE IF NOT EXISTS chunks (
      id text PRIMARY KEY,
      title text NOT NULL,
      text text NOT NULL,
      embedding vector(384) NOT NULL
    );
  `)
  return db
}
