---
trigger: always_on
description: Core local development, testing, and deployment invariants for CBSE learning portal
---

# CBSE Platform Development Invariants

## 1. Student Registration & Auth Testing
- When constructing test payloads for `POST /v1/auth/register`, always include the current guardian consent schema:
  - `adultConfirmed: true`
  - `consentConfirmed: true`
  - `guardianEmail: "parent@example.com"`
  - `guardianFullName: "Parent Name"`
  - `policyVersion: "2026-08-04"` (must match `PILOT_PRIVACY_NOTICE_VERSION` in `apps/api/src/lib/guardian-consent.ts`)
  - `relationship: "parent"` or `"lawful_guardian"`

## 2. Local Exam Paper Generation & Question Bank
- The paper assembler (`assemblePaper`) only queries questions with `verificationStatus: 'verified'`.
- When seeding local or preview databases for testing paper generation, run:
  ```bash
  SEED_BANK_AS_VERIFIED=1 npm run seed:bank -w apps/api
  ```

## 3. Database Connection Fault-Tolerance
- Session retrieval and auth middleware must handle Prisma network exceptions (e.g. pooler timeouts) with `try/catch` returning `null`, preventing unhandled process crashes.

## 4. Multi-App Vercel Deployment Order
- When deploying the monorepo to Vercel:
  1. `cd apps/api && npx vercel deploy --prod --yes`
  2. `cd apps/web && npx vercel deploy --prod --yes`
  3. `cd apps/admin && npx vercel deploy --prod --yes`
- Update `docs/TODO.md` with the next task after every successful remote push.
 
## 5. Frequent Git Commit & Remote Push Policy (Mandatory)
- Whenever meaningful progress is made on a task or subtask, commit and push changes to the remote Git repository (`origin/main`).
- Never leave substantive progress uncommitted or unpushed at the end of a session or work chunk. The developer works across multiple machines (office laptop, home workstation). Unpushed commits block working from home or another machine.
- Always check `git status` to ensure all relevant files are staged (and secrets sanitized), commit with concise imperative messages, push to remote (`git push origin main`), and update `TODO.md`.

## 6. YouTube Shorts Dedicated Thumbnail Invariant (Episode 05+)
- Starting from Episode 05 onwards, every educational YouTube Short MUST have a dedicated, eye-catching 9:16 vertical cover/thumbnail generated alongside the final video render.
- Save and track the thumbnail under the video project's `thumbnails/` or `.thumbnails/` directory.
- Never consider a Short video task complete from Episode 05 onwards without verifying the existence of its dedicated cover image.
