import { createHmac } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { whatsappPayload } from './whatsappPayload'

const question = process.argv.slice(2).filter((arg) => arg !== '--twice').join(' ')
const times = process.argv.includes('--twice') ? 2 : 1
const secret = process.env.WHATSAPP_APP_SECRET ?? 'test-secret'

const id = `wamid.TEST${Date.now()}`
const body = JSON.stringify(whatsappPayload('919800000001', id, question), null, 2)
const signature = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex')
if (process.env.PAYLOAD_OUT) writeFileSync(process.env.PAYLOAD_OUT, body + '\n')

for (let i = 1; i <= times; i++) {
  const response = await fetch('http://localhost:3000/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': signature },
    body,
  })
  console.log(`Delivery ${i} of ${id}: ${response.status}`)
}
