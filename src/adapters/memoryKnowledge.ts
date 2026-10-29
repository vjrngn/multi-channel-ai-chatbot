import { readFileSync } from 'node:fs'
import type { KnowledgeBase } from '../core/ports'
import { embed } from './embedder'

type Chunk = { id: string; title: string; text: string; vector: number[] }

export function memoryKnowledge(path = 'data/chunks.json'): KnowledgeBase {
  const chunks: Chunk[] = JSON.parse(readFileSync(path, 'utf8'))

  return {
    async search(question, k = 3) {
      const q = await embed(question)
      return chunks
        .map(({ id, title, text, vector }) => ({ id, title, text, score: dot(q, vector) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, k)
    },
  }
}

function dot(a: number[], b: number[]) {
  return a.reduce((sum, x, i) => sum + x * b[i], 0)
}
