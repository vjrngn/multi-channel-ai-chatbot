import { describe, expect, it } from 'vitest'
import { createSupportBot } from '../src/core/supportBot'
import { memoryConversations } from '../src/adapters/memoryConversations'
import { fakeKnowledge, fakeModel } from './fakes'

function setup(score = 0.8) {
  const { model, prompts } = fakeModel()
  const bot = createSupportBot({ knowledge: fakeKnowledge(score), model, conversations: memoryConversations(), cutoff: 0.4 })
  const ask = (text: string) => bot.handle({ channel: 'test', userId: 'u1', text })
  return { ask, prompts }
}

describe('support bot', () => {
  it('hands over a damaged order without calling the model', async () => {
    const { ask, prompts } = setup()
    const reply = await ask('My order arrived damaged')
    expect(reply.handover).toBe(true)
    expect(prompts).toHaveLength(0)
  })

  it('hands over when the help centre has nothing close enough', async () => {
    const { ask, prompts } = setup(0.2)
    const reply = await ask('Do you sell gift cards?')
    expect(reply).toMatchObject({ handover: true, sources: [] })
    expect(prompts).toHaveLength(0)
  })

  it('includes the sections it used as sources', async () => {
    const { ask } = setup()
    const reply = await ask('Can I return shoes after 30 days?')
    expect(reply.handover).toBe(false)
    expect(reply.sources).toEqual(['Returns › Time limit', 'Refunds › How long they take'])
  })

  it('puts the conversation so far into the prompt for follow-ups', async () => {
    const { ask, prompts } = setup()
    await ask('Can I return shoes after 30 days?')
    await ask('What about sale items?')
    expect(prompts[1]).toContain('customer: Can I return shoes after 30 days?')
    expect(prompts[1]).toContain('bot: You can return them within 30 days.')
  })
})
