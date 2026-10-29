import express from 'express'
import { bot, sender } from '../main'
import { whatsappRouter } from './whatsapp'

const app = express()
app.use(express.static('public'))
app.use(whatsappRouter(bot, sender))

app.post('/chat', express.json(), async (req, res) => {
  const { sessionId, text } = req.body
  const reply = await bot.handle({ channel: 'web', userId: sessionId, text })
  res.json(reply)
})

app.listen(3000, () => console.log('Stride Shoes support on http://localhost:3000/widget.html'))
