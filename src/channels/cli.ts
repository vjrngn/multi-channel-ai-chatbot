import { createInterface } from 'node:readline/promises'
import { bot } from '../main'

const terminal = createInterface({ input: process.stdin, output: process.stdout })
terminal.setPrompt('\nYou: ')
terminal.prompt()

for await (const text of terminal) {
  if (!process.stdin.isTTY) console.log(text)
  const reply = await bot.handle({ channel: 'cli', userId: 'local', text })
  console.log(`\nBot: ${reply.text}`)
  if (reply.sources.length) console.log(`Sources: ${reply.sources.join(', ')}`)
  if (reply.handover) console.log('→ Handing over to a person')
  terminal.prompt()
}

process.exit()
