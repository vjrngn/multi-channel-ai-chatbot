import type { KnowledgeBase, Section } from '../core/ports'
import { embed } from './embedder'
import { openDatabase } from './pgDatabase'

export async function pgvectorKnowledge(dataDir?: string): Promise<KnowledgeBase> {
  const db = await openDatabase(dataDir)

  return {
    async search(question, k = 3) {
      const q = JSON.stringify(await embed(question))
      const { rows } = await db.query<Section>(
        `SELECT id, title, text, 1 - (embedding <=> $1) AS score
         FROM chunks ORDER BY embedding <=> $1 LIMIT $2`,
        [q, k],
      )
      return rows
    },
  }
}
