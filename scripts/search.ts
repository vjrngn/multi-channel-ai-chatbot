import { memoryKnowledge } from '../src/adapters/memoryKnowledge'

const question = process.argv.slice(2).join(' ')
const results = await memoryKnowledge().search(question, 3)

console.log(`Question: ${question}\n`)
for (const [i, section] of results.entries()) {
  console.log(`${i + 1}. ${section.score.toFixed(3)}  ${section.title}`)
}
