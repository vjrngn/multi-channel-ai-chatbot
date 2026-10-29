import { readFileSync } from 'node:fs'
import { openDatabase } from './adapters/pgDatabase'

const chunks = JSON.parse(readFileSync('data/chunks.json', 'utf8'))
const db = await openDatabase()

for (const { id, title, text, vector } of chunks) {
  await db.query(
    `INSERT INTO chunks (id, title, text, embedding) VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET title = $2, text = $3, embedding = $4`,
    [id, title, text, JSON.stringify(vector)],
  )
}

const { rows } = await db.query<{ count: number }>('SELECT count(*)::int AS count FROM chunks')
console.log(`Postgres (PGlite + pgvector): ${rows[0].count} sections in table chunks`)
await db.close()
console.log(`Took ${process.uptime().toFixed(1)}s`)
