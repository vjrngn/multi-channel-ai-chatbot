import { createSupportBot } from './core/supportBot'
import { memoryKnowledge } from './adapters/memoryKnowledge'
import { pgvectorKnowledge } from './adapters/pgvectorKnowledge'
import { claudeCliModel } from './adapters/claudeCliModel'
import { hostedModel } from './adapters/hostedModel'
import { memoryConversations } from './adapters/memoryConversations'
import { consoleSender } from './adapters/consoleSender'
import { graphSender } from './adapters/graphSender'

const knowledge = process.env.KNOWLEDGE === 'pg' ? await pgvectorKnowledge() : memoryKnowledge()
const model = process.env.MODEL === 'cli' ? claudeCliModel() : hostedModel()

export const bot = createSupportBot({
  knowledge,
  model,
  conversations: memoryConversations(),
  cutoff: 0.4,
})

export const sender = process.env.SENDER === 'graph' ? graphSender() : consoleSender()
