import Anthropic from '@anthropic-ai/sdk'
import type { LanguageModel } from '../core/ports'

export function hostedModel(model = 'claude-haiku-5-5'): LanguageModel {
  const client = new Anthropic()

  return {
    async complete(prompt) {
      const message = await client.messages.create({
        model,
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      })
      return message.content.map((block) => (block.type === 'text' ? block.text : '')).join('')
    },
  }
}
