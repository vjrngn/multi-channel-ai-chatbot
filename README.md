# Stride Shoes support bot

A customer service bot for a small online shoe store. It answers from the help centre in `docs/` (RAG) and hands over to a person when it should.

It is built as ports and adapters: `src/core` never imports a channel, a database or a vendor SDK. `src/main.ts` is the one place adapters are chosen.

## Run it

```sh
pnpm install
pnpm ingest                                   # docs/*.md → data/chunks.json (local embeddings)
pnpm search "Can I return shoes after 30 days?"
pnpm chat                                     # terminal chat, answers from the local claude CLI
MODEL=cli pnpm web                            # website + WhatsApp webhook on http://localhost:3000/widget.html
WHATSAPP_APP_SECRET=test-secret pnpm whatsapp-replay "Can I return shoes after 30 days?" --twice
pnpm test
pnpm ingest:pg && KNOWLEDGE=pg pnpm chat      # same bot on Postgres + pgvector (PGlite)
```

## Environment

| Variable | Meaning |
| --- | --- |
| `MODEL` | `cli` uses the local `claude -p`; anything else uses the Anthropic API |
| `ANTHROPIC_API_KEY` | needed only for the hosted model |
| `KNOWLEDGE` | `pg` uses Postgres + pgvector; default is in memory |
| `WHATSAPP_VERIFY_TOKEN` | webhook verification token |
| `WHATSAPP_APP_SECRET` | checks `X-Hub-Signature-256` on webhook posts |
| `SENDER` | `graph` sends real WhatsApp replies; default prints them |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | needed only for `SENDER=graph` |

See `.env.example` for local test values. Terminal output from real runs is in `runs/`.
