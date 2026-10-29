export type Section = {
  id: string
  title: string
  text: string
  score: number
}

export interface KnowledgeBase {
  search(question: string, k?: number): Promise<Section[]>
}

export interface LanguageModel {
  complete(prompt: string): Promise<string>
}

export type Turn = {
  role: 'customer' | 'bot'
  text: string
}

export interface ConversationStore {
  history(channel: string, userId: string): Promise<Turn[]>
  append(channel: string, userId: string, turn: Turn): Promise<void>
}
