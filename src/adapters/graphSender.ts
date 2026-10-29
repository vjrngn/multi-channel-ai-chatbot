import type { WhatsAppSender } from '../channels/whatsapp'

export function graphSender(): WhatsAppSender {
  const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`

  return {
    async send(to, text) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }),
      })
      if (!response.ok) throw new Error(`WhatsApp send failed: ${response.status}`)
    },
  }
}
