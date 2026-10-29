import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { embed } from './adapters/embedder'

const files = readdirSync('docs').filter((f) => f.endsWith('.md'))
const chunks = []

for (const file of files) {
  const markdown = readFileSync(`docs/${file}`, 'utf8')
  const fileTitle = markdown.match(/^# (.+)$/m)?.[1] ?? file
  const sections = markdown.split(/^## /m).slice(1)

  for (const section of sections) {
    const [heading, ...body] = section.trim().split('\n')
    const title = `${fileTitle} › ${heading}`
    const text = `${title}\n${body.join('\n').trim()}`
    const id = `${file.replace('.md', '')}#${heading.toLowerCase().replaceAll(' ', '-')}`
    chunks.push({ id, title, text, vector: await embed(text) })
  }
}

writeFileSync('data/chunks.json', JSON.stringify(chunks))
console.log(`Files: ${files.length}`)
console.log(`Sections: ${chunks.length}`)
console.log(`Vectors: ${chunks[0].vector.length} numbers each`)
console.log(`Took ${process.uptime().toFixed(1)}s`)
