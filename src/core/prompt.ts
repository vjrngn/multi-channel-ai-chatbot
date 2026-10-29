import type { Section, Turn } from './ports'

export function buildPrompt(question: string, sections: Section[], history: Turn[]) {
  const helpCentre = sections.map((s) => `### ${s.title}\n${s.text}`).join('\n\n')
  const conversation = history.map((t) => `${t.role}: ${t.text}`).join('\n')

  return `You are the customer service assistant for Stride Shoes, an online shoe store.
Answer only from the help centre sections below. Keep it short and friendly.
Say which section you used, like (Source: Returns › Time limit).
If the sections don't cover the question, say so and offer to pass them to a person.

Help centre:
${helpCentre}

Conversation so far:
${conversation || '(none)'}

customer: ${question}
bot:`
}
