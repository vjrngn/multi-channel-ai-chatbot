import type { IncomingMessage, Reply } from './types'
import type { ConversationStore, KnowledgeBase, LanguageModel, Turn } from './ports'
import { buildPrompt } from './prompt'

const asksForPerson = /\b(human|person|someone|real agent|speak to|talk to)\b/i
const orderProblem = /\b(damaged|broken|torn|wrong (item|size|shoes|pair|order))\b/i

type Deps = {
  knowledge: KnowledgeBase
  model: LanguageModel
  conversations: ConversationStore
  cutoff: number
}

export function createSupportBot({ knowledge, model, conversations, cutoff }: Deps) {
  async function answer(question: string, history: Turn[]): Promise<Reply> {
    if (asksForPerson.test(question) || orderProblem.test(question)) {
      return handover("I'm sorry about that. I'm passing you to a person on our team now.")
    }
    const sections = (await knowledge.search(question)).filter((s) => s.score >= cutoff)
    if (sections.length === 0) {
      return handover("The help centre doesn't cover this, so I'm passing you to a person.")
    }
    const text = await model.complete(buildPrompt(question, sections, history))
    return { text, sources: sections.map((s) => s.title), handover: false }
  }

  return {
    async handle({ channel, userId, text }: IncomingMessage): Promise<Reply> {
      const reply = await answer(text, await conversations.history(channel, userId))
      await conversations.append(channel, userId, { role: 'customer', text })
      await conversations.append(channel, userId, { role: 'bot', text: reply.text })
      return reply
    },
  }
}

function handover(text: string): Reply {
  return { text, sources: [], handover: true }
}

export type SupportBot = ReturnType<typeof createSupportBot>
