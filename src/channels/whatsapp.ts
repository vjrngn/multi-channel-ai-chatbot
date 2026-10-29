import { createHmac, timingSafeEqual } from 'node:crypto'
import express, { Router } from 'express'
import type { SupportBot } from '../core/supportBot'

export interface WhatsAppSender {
  send(to: string, text: string): Promise<void>
}

export function whatsappRouter(bot: SupportBot, sender: WhatsAppSender) {
  const router = Router()
  const seen = new Set<string>()

  router.get('/whatsapp', (req, res) => {
    const ok = req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.WHATSAPP_VERIFY_TOKEN
    if (ok) res.send(req.query['hub.challenge'])
    else res.sendStatus(403)
  })

  router.post('/whatsapp', express.raw({ type: '*/*' }), async (req, res) => {
    if (!validSignature(req.body, req.get('X-Hub-Signature-256'))) return res.sendStatus(401)
    res.sendStatus(200)

    const message = JSON.parse(req.body.toString()).entry?.[0]?.changes?.[0]?.value?.messages?.[0]
    if (!message?.text) return
    if (seen.has(message.id)) return console.log(`whatsapp: skipped ${message.id} (already seen)`)
    seen.add(message.id)
    console.log(`whatsapp: ${message.id} from ${message.from}: ${message.text.body}`)

    const reply = await bot.handle({ channel: 'whatsapp', userId: message.from, text: message.text.body })
    await sender.send(message.from, reply.text)
  })

  return router
}

function validSignature(rawBody: Buffer, header = '') {
  const expected = 'sha256=' + createHmac('sha256', process.env.WHATSAPP_APP_SECRET ?? '').update(rawBody).digest('hex')
  return header.length === expected.length && timingSafeEqual(Buffer.from(header), Buffer.from(expected))
}
