# Codex Quota-Saving Playbook for `cbse_byCodex`

> Role split: **Hermes = Project Manager + Prompt Compressor**. **Codex = builder + debugger + deploy worker**.

## Why this exists

This project already has the right high-level direction in:
- `docs/TODO.md`
- `docs/deployment.md`
- `docs/video-platform.md`
- `docs/product-blueprint.md`

The main quota risk is **mixing planning, architecture, product discussion, infra setup, and coding in the same Codex session**. This playbook keeps Codex sessions narrow, short, and verifiable.

## Core operating rules

### 1) Hermes first, Codex second
Use Hermes for:
- planning
- backlog shaping
- milestone design
- architecture decisions
- tool comparison
- launch sequencing
- prompt compression
- deciding what *not* to work on yet

Use Codex for:
- repo inspection
- file edits
- env wiring
- builds
- linting
- migrations
- deploy commands
- runtime debugging
- smoke tests

### 2) One Codex session = one milestone
A session must have:
- one goal
- one narrow scope
- one stop condition
- one verification step

If a prompt contains words like these, it is too wide:
- "also"
- "while you are at it"
- "and maybe"
- "plus discuss"
- "what do you think about"

### 3) Never send low-signal follow-ups
Do **not** send:
- `continue`
- `ok proceed`
- `what next?`
- `check again`
- `which project are you working on?`

Send this instead:
- the next exact task
- the exact files/commands involved
- the stop condition
- what is explicitly out of scope

### 4) Freeze decisions outside Codex
For the current MVP, treat these as fixed unless a real blocker appears:
- launch web first
- keep `apps/web`, `apps/admin`, `apps/api`
- keep Vercel for deployment
- keep Supabase/Postgres for database
- keep Bunny Stream for video
- keep Flutter mobile later, not now

### 5) Every prompt must include a stop line
Use this pattern:
- **Goal**
- **Do only**
- **Do not**
- **Verify**
- **Stop when**

### 6) Ask Codex for execution, not thinking aloud
Bad:
- "Explore options for database/video/payments/mobile"

Good:
- "Verify the current Prisma env variable names, wire the production env examples, run the migration, and stop after `/health` passes."

### 7) Batch repo work by dependency order
For this project, the correct order is:
1. security cleanup
2. Supabase database
3. Prisma migration
4. API deploy
5. web/admin deploy
6. Bunny wiring
7. real pilot chapter data/content
8. auth + premium gating
9. payments
10. mobile

### 8) End each session with a handoff note
Require Codex to end with:
- files changed
- commands run
- outputs/results
- blockers
- exact next recommended milestone

## Prompt template

```md
Goal: <one concrete outcome>

Context:
- Repo: /home/sagarv/Projects/cbse_byCodex
- Read first: AGENTS.md, docs/TODO.md, docs/deployment.md
- Follow existing architecture and env variable names already in the repo.

Do only:
1. <task 1>
2. <task 2>
3. <task 3>

Do not:
- <out-of-scope item>
- <out-of-scope item>
- Discuss future architecture unless blocked by the current task.

Verify:
- <command or URL check>
- <command or URL check>

Stop when:
- <single clear completion condition>

Return exactly:
- Summary of changes
- Commands run
- Verification results
- Blockers, if any
- Exact next milestone
```

## Anti-burn rules for this repo

### Never spend Codex on these topics unless a blocker forces it
- Flutter timing
- pricing discussion
- watermark strategy debate
- YouTube content strategy
- product ideation
- long-term analytics stack
- DRM discussion
- whether to switch frameworks with no immediate blocker

### Use Hermes instead for
- deciding MVP scope
- turning ideas into backlog
- slicing milestones
- deciding next priority
- compressing multiple asks into one clean Codex prompt

## Strict milestone plan for `cbse_byCodex`

These milestones are intentionally narrow. Do not merge them unless the earlier one is already verified.

---

## Milestone 0 — Security reset

**Goal:** remove security risk before launch work continues.

**Scope:**
- rotate the ElevenLabs API key that was pasted into chat
- update only server-side/local env values
- confirm no real key is committed

**Do not include:**
- Supabase setup
- Vercel deploy
- Bunny work
- feature work

**Stop when:**
- replacement key is stored server-side/local only
- repo contains no exposed live ElevenLabs key

---

## Milestone 1 — Supabase foundation

**Goal:** connect the repo to a real Supabase database.

**Scope:**
- verify env variable names from `.env.example` and `apps/api/.env.example`
- prepare `DATABASE_URL` and `DIRECT_URL`
- verify Prisma can read the schema
- run:
  - `npm run prisma:generate -w apps/api`
  - `npm run prisma:migrate:deploy -w apps/api`
- confirm the migration succeeds

**Inputs needed from user/dashboard:**
- Supabase project created
- connection strings for transaction pooler and direct/session migration URL

**Do not include:**
- Vercel deployment
- web/admin env wiring
- Bunny setup
- auth or payments

**Verify:**
- Prisma generate succeeds
- Prisma migrate deploy succeeds

**Stop when:**
- migration has been applied successfully to Supabase

---

## Milestone 2 — API on Vercel

**Goal:** get `apps/api` live first.

**Scope:**
- verify API build passes
- configure Vercel API env vars:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `CORS_ORIGIN`
  - `ELEVENLABS_API_KEY`
  - Bunny placeholders or real values if already available
- deploy `apps/api`
- smoke test:
  - `/health`
  - `/v1/catalog/pilot`

**Do not include:**
- `apps/web` deployment
- `apps/admin` deployment
- Bunny ingestion flow
- content creation

**Verify:**
- API deploy succeeds
- `https://<api-project>.vercel.app/health`
- `https://<api-project>.vercel.app/v1/catalog/pilot`

**Stop when:**
- API is live and both endpoints respond successfully

---

## Milestone 3 — Web and admin on Vercel

**Goal:** deploy both frontends against the live API.

**Scope:**
- set `NEXT_PUBLIC_API_BASE_URL` for `apps/web` and `apps/admin`
- deploy `apps/web`
- deploy `apps/admin`
- verify both load without obvious runtime errors

**Do not include:**
- schema changes
- Bunny upload flow
- auth implementation

**Verify:**
- both Vercel URLs load
- browser console shows no blocking errors

**Stop when:**
- student web and admin web are live against production API

---

## Milestone 4 — Bunny environment wiring

**Goal:** prepare the production video platform without building the full upload system yet.

**Scope:**
- create Bunny Stream library
- wire API-only env vars:
  - `BUNNY_STREAM_LIBRARY_ID`
  - `BUNNY_STREAM_API_KEY`
  - `BUNNY_STREAM_CDN_HOSTNAME`
  - `BUNNY_STREAM_TOKEN_AUTH_KEY`
- verify no Bunny secret is exposed through `NEXT_PUBLIC_`

**Do not include:**
- full upload pipeline
- signed playback implementation
- DRM

**Stop when:**
- all Bunny server-side env vars are configured and documented

---

## Milestone 5 — Pilot content data path

**Goal:** move from hardcoded demo shape to one real pilot chapter path.

**Scope:**
- seed one real chapter path
- back the pilot catalog with database records
- verify the API returns real DB-backed pilot content

**Preferred first chapter:**
- Mathematics → Real Numbers
- or Science → Chemical Reactions and Equations

**Stop when:**
- `/v1/catalog/pilot` is DB-backed and stable

---

## Milestone 6 — Lesson delivery MVP

**Goal:** one complete lesson experience.

**Scope:**
- lesson page
- video player integration
- notes
- examples
- quiz CTA
- next lesson flow

**Stop when:**
- one lesson works end to end in the student app

---

## Milestone 7 — Auth and entitlement gate

**Goal:** prevent premium delivery without access control.

**Scope:**
- auth
- roles
- entitlement check before premium playback/lesson access

**Stop when:**
- free vs premium behavior is enforced in the API and reflected in UI

---

## Milestone 8 — Payments

**Goal:** connect revenue to entitlements.

**Scope:**
- Razorpay subscription flow
- webhook handling
- idempotent payment processing
- entitlement sync

**Stop when:**
- a successful payment can grant access through backend entitlement logic

---

## Milestone 9 — Mobile later

**Goal:** avoid burning quota early on Flutter.

**Scope right now:**
- none beyond preserving placeholder structure

**Rule:**
- no serious Flutter build work until web lesson flow, auth, and payments are proven

---

## What to ask Hermes before every Codex session

Copy this checklist into chat with Hermes, not Codex:

```md
I want the next Codex prompt.
Target milestone: <milestone number/name>
Current blocker: <if any>
Available credentials/access right now: <what dashboards/keys are ready>
Hard stop condition: <what counts as done>
```

Hermes should then compress that into one exact Codex-ready prompt.

## Exact next Codex prompt: Supabase + Vercel milestone

Use this as your next Codex prompt:

```md
Goal: Complete the production database + deployment foundation for cbse_byCodex using Supabase and Vercel, following the existing repo docs without changing architecture.

Context:
- Repo: /home/sagarv/Projects/cbse_byCodex
- Read first:
  - AGENTS.md
  - docs/TODO.md
  - docs/deployment.md
  - docs/video-platform.md
- Existing architecture is already decided:
  - apps/api = Express + Prisma
  - apps/web = Next.js
  - apps/admin = Next.js
  - database = Supabase Postgres
  - hosting = Vercel
  - video = Bunny Stream later
- Use the env variable names already defined in:
  - .env.example
  - apps/api/.env.example
  - apps/web/.env.example
  - apps/admin/.env.example

Do only:
1. Inspect the repo and confirm the exact production env variables required for the Supabase + Vercel deployment path.
2. Verify the Prisma commands and deployment order from the repo docs.
3. Prepare the local/API env setup for Supabase using `DATABASE_URL` and `DIRECT_URL` only if values are available in the environment or provided by the user.
4. Run:
   - `npm run prisma:generate -w apps/api`
   - `npm run prisma:migrate:deploy -w apps/api`
   if the required DB connection values are available.
5. Build the API and confirm it is ready for Vercel deployment.
6. If Vercel CLI access and required env values are available, deploy `apps/api` first and verify:
   - `/health`
   - `/v1/catalog/pilot`
7. If API deployment succeeds and frontend env values can be set correctly, deploy `apps/web` and `apps/admin` with `NEXT_PUBLIC_API_BASE_URL` pointing at the deployed API.

Do not:
- discuss Flutter
- discuss pricing
- discuss YouTube strategy
- discuss watermarking/DRM strategy
- change the product architecture
- start Bunny upload pipeline work
- implement auth, payments, or new features
- guess credentials or placeholder values

Rules:
- Prefer existing repo conventions over inventing new ones.
- If a required credential, connection string, or Vercel access token is missing, stop at the first hard blocker and report exactly what is missing.
- Do not continue into unrelated tasks after the blocker.
- Keep the session focused only on Supabase + Vercel foundation.

Verify:
- `npm run prisma:generate -w apps/api`
- `npm run prisma:migrate:deploy -w apps/api`
- `npm run build -w apps/api`
- `https://<api-project>.vercel.app/health`
- `https://<api-project>.vercel.app/v1/catalog/pilot`
- deployed web/admin URLs load if those deployments are reached

Stop when:
- either the Supabase + Vercel foundation is complete and verified,
- or you hit the first real blocker caused by missing credentials/access, in which case stop immediately and report only that blocker plus the exact next action needed.

Return exactly:
- files inspected or changed
- commands run
- verification results
- live URLs if deployment succeeded
- blockers, if any
- exact next milestone
```

## Final rule

If a session starts drifting into planning, product debate, or broad exploration, stop Codex and come back to Hermes for re-compression.
