# Bookmarq

Bookmarq is an AI‑powered bookmarking agent for the **Hedera AI Agents Hackathon (April 11 – May 2 2025)**.

It connects to your X (Twitter) account, pulls bookmarks on a schedule, classifies them with **OpenAI**, stores them in **Supabase Postgres** for review, and permanently logs decisions on **Hedera Consensus Service (HCS)**.  
Optionally, it can mint HTS tokens as rewards.

## Tech Stack

| Layer        | Tech                                             |
|--------------|--------------------------------------------------|
| Front‑end    | Next.js 14 / React 18 + Tailwind CSS (via shadcn) |
| Back‑end     | Next API Routes deployed on Vercel Functions     |
| Data Store   | Supabase (Postgres + RLS & Storage)              |
| AI           | OpenAI GPT‑4o (fallback: GPT‑3.5‑Turbo)          |
| Blockchain   | Hedera JavaScript SDK (HCS‑10)                   |
| Social Auth  | Twitter OAuth 2.0 (PKCE) via twitter‑api‑v2      |

## Local Setup

```bash
git clone https://github.com/<you>/bookmarq.git
cd bookmarq
cp .env.example .env.local       # add your secrets
npm install
npm run dev
```

## Scheduled Bookmark Pull

The `/api/cron/fetch-bookmarks` route runs every **60 minutes** on Vercel Cron (see `vercel.json`).  
It:

1. Retrieves encrypted Twitter tokens from Supabase  
2. Fetches new bookmarks (since last run)  
3. Sends the set to OpenAI for JSON classification (`bookmarkSchema` in `src/lib/openai.ts`)  
4. Stores the result in the `bookmarks` & `tasks` tables  
5. Writes a summary message to Hedera HCS (topic in ENV)

## Submission Checklist ✓

- ✅ **Repository Access**: this repo + inline JSDoc & README architecture diagrams  
- ✅ **Visual Demo**: see `demo.mp4` in root (add your own recording)  
- ✅ **Architecture Spec**: `ARCHITECTURE.md` generated from Mermaid diagram  
- ✅ **Deployed Agent**: `HEDERA_AGENT_ID` logged on testnet (see `.env.example`)  

Happy hacking!  
— Dave @ The Web3 Collective


## Hackathon MVP Goals (Applied)

- **Bookmark Polling**: Hourly cron route `/api/cron/fetch-bookmarks` already wired – hits Twitter, classifies via OpenAI, stores in Supabase.
- **Task Review UI**: Visit `/tasks` to approve or reject auto‑generated tasks.
- **On‑chain Logging**: `lib/hedera.ts` posts a slim log line to Hedera Consensus Service when bookmarks are imported **and** when tasks are approved.
- **Modularity Ready**: Each concern (twitter, openai, hedera, ui) sits in its own file for easy swaps/ upgrades.
- **Cost‑aware LLM**: Default model is `gpt-4o-mini`; switch to `"gpt-3.5-turbo"` in `lib/openai.ts` if you’re cost‑sensitive.

### Roadmap Post‑Hackathon

1. **Token Rewards** – leverage HTS in `lib/hedera.ts` to mint `$BOOK` to power‑users.
2. **Extended Actions** – after approval, trigger tweets via Twitter write API or push drafts to a Notion integration.
3. **Multi‑user Cron Scaling** – move bookmark polling to a dedicated worker (Fly.io / Railway) when Vercel cron quota is hit.

---
