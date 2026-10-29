import type { KnowledgeBase, LanguageModel } from '../src/core/ports'

export function fakeModel(answer = 'You can return them within 30 days. (Source: Returns › Time limit)') {
  const prompts: string[] = []
  const model: LanguageModel = {
    async complete(prompt) {
      prompts.push(prompt)
      return answer
    },
  }
  return { model, prompts }
}

export function fakeKnowledge(score = 0.8): KnowledgeBase {
  return {
    async search() {
      return [
        { id: 'returns#time-limit', title: 'Returns › Time limit', text: 'Returns within 30 days.', score },
        { id: 'refunds#how-long', title: 'Refunds › How long they take', text: '5–7 working days.', score: score - 0.2 },
      ]
    },
  }
}
