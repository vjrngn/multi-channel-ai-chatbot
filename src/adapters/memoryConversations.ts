import type { ConversationStore, Turn } from '../core/ports'

export function memoryConversations(): ConversationStore {
  const turns = new Map<string, Turn[]>()

  return {
    async history(channel, userId) {
      return turns.get(`${channel}:${userId}`) ?? []
    },
    async append(channel, userId, turn) {
      const key = `${channel}:${userId}`
      turns.set(key, [...(turns.get(key) ?? []), turn])
    },
  }
}
