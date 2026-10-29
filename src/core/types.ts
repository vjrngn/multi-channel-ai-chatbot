export type IncomingMessage = {
  channel: string
  userId: string
  text: string
}

export type Reply = {
  text: string
  sources: string[]
  handover: boolean
}
