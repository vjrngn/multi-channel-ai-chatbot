import type { WhatsAppSender } from '../channels/whatsapp'

export function consoleSender(): WhatsAppSender {
  return {
    async send(to, text) {
      console.log(`[consoleSender] would send to ${to}:\n${text}`)
    },
  }
}
