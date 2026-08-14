---
type: ProjectMemoryTopic
title: Pilot and Operations Memory
description: Durable free-pilot, deployment, production-smoke, and operational learnings.
tags: ['memory', 'pilot', 'deployment', 'operations', 'vercel']
timestamp: 2026-08-04T00:00:00Z
---

# Pilot and Operations Memory

Read this file for the free student pilot, admin review, production deploys, smoke tests, subscriptions, and operational blockers.

## Product sequencing

- Defer payment/subscription logic until after a free student pilot produces real usage, feedback, bug fixes, and platform-hardening work. When payments return, keep them behind the same access-helper path used by lesson video gating.
- Chapter quality states are intentionally separate: `source-faithful`, `technically pilot-ready`, `student-validated`, and `reference chapter`. Missing student availability may defer student validation, but it must never be relabelled as passed. The fixed Chapter 1 non-student transfer check lives in `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md`.
- Chapter 1 student validation is two-stage: all 2-5 participants complete the first-use session, and at least two complete the post-study workbench, written-PYQ, timed Diagnostic B, remediation, and retention-truthfulness check. Store participant codes and structured observations only, never names, contact details, school identifiers, or raw written answers.

## Free student pilot

- Free Student Pilot V1 centralizes the selected pilot chapters in `apps/web/lib/pilot.ts`: Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying.
- Pilot account creation now records parent or lawful-guardian permission against privacy-notice version `2026-08-04`. The record is explicitly `self_attested`; do not call it guardian identity verification or widen public onboarding without compliance review. Production migration/deploy for this flow completed on 2026-08-04, but production `PRIVACY_CONTACT_EMAIL` was not present in the rendered privacy page and must still be configured before onboarding is widened.
- Lesson starts, lesson completions, quiz starts, dashboard views, chapter opens, and feedback submissions are recorded as `ProgressEvent` rows through `/v1/progress/engagement` and `/v1/progress/feedback`.
- DB migration `20260621120000_add_free_pilot_catalog_rows` keeps the selected pilot catalog DB-backed for production quiz saves.
- Pilot Review V1 exposes admin-only activity at `GET /v1/progress/pilot-review`. It requires an admin session token, aggregates recent pilot engagement and feedback into summary counts and breakdowns, and is rendered by the admin dashboard through `apps/admin/lib/pilot-review.ts`.
- Review evidence should prioritize bug reports and 1-2 rating feedback as highest-friction signals while retaining path, timestamp, and recent-message context.
- If Two Stories quiz saves return `Chapter was not found`, check production `GET /v1/catalog/pilot`. On 2026-07-01 the web content was deployed before production applied the free-pilot catalog migration, so English and `two-stories-about-flying` were absent until `prisma migrate deploy`.

## Deployment and smoke history

- The repeatable pilot smoke runbook lives in `docs/pilot-smoke-checklist.md`.
- On 2026-08-04, the approved ChapterReady identity (open-book mark with the evident orange check) was deployed from `apps/web` to `cbse-bycodex-web` as `dpl_AVxswqprmsib41zyzfiEw6d5Yqhu` and promoted to `https://cbse-bycodex-web.vercel.app`. The remote Next.js production build completed, and smoke checks confirmed the live home page contains `ChapterReady`, `CBSE`, and the `/brand/chapterready-mark.svg` asset; `/subjects` also rendered with the new brand. Deploy this Vercel project from `apps/web`: deploying from the monorepo root runs the aggregate web/admin/API build and then fails the web project's output-directory check.
- On 2026-08-04, the simplified study-first landing page was deployed to `cbse-bycodex-web` as `dpl_HWEmB1MdJtDxgPtNgJJD1JNtrXzE` and aliased to `https://cbse-bycodex-web.vercel.app`. The production build completed, and the public alias returned `200` with the new hero, popular-chapter, and subject-selection markers. Because the web worktree contained unrelated changes, the release used an isolated HEAD-based snapshot containing the landing route/theme plus only the narrow existing TypeScript build repairs required by the committed baseline; the full dirty workspace was not published.
- On 2026-08-04, production `prisma migrate deploy` applied `20260804090000_add_guardian_consent` successfully; Prisma reported 10 migrations found and all migrations applied. Production deploys completed for `cbse-bycodex-api`, `cbse-bycodex-web`, and `cbse-bycodex-admin`. Read-only smoke passed for API health, pilot catalog, unauthenticated session protection, unauthenticated pilot-review protection, web `/`, `/privacy`, `/register`, admin root redirect, and admin `/login`. The privacy page rendered the fallback contact wording, so `PRIVACY_CONTACT_EMAIL` still needs production configuration. Credentialed registration/write-path and admin-review smoke remain pending.
- On 2026-08-02, production `prisma migrate deploy` applied `20260726123000_add_written_practice_attempts` successfully; Prisma reported all 9 migrations applied. Read-only production smoke also passed for API health, pilot catalog, public web/admin aliases, unauthenticated session protection, and unauthenticated pilot-review protection. The credentialed write-path/admin smoke remains pending because creating production smoke-test rows requires explicit approval and student/admin session access.
- The 2026-06-22 API production deploy to `cbse-bycodex-api` restored `POST /v1/progress/engagement`, `POST /v1/progress/feedback`, and admin `GET /v1/progress/pilot-review?windowDays=14` at `https://cbse-bycodex-api.vercel.app`. Marker `pilot-smoke-20260622-120257` appeared in recent feedback and highest-friction signals; events increased from 8 to 14 and active students stayed at 1.
- The 2026-06-22 browser smoke refreshed `cbse-bycodex-web` and `cbse-bycodex-admin` at their Vercel aliases. Marker `browser-pilot-smoke-20260622-125900` saved from the deployed lesson page and appeared in the deployed admin review. Counts moved from 14 to 18 events, active students stayed at 1, and each tracked event type reached 3.
- The admin workspace was locally linked to its existing Vercel project during that run, but `.vercel/` remains ignored.
- Local `npm.cmd run test -w apps/api` depends on the Supabase pooler for the DB-backed pilot catalog test. On 2026-06-22 it passed once, then twice failed to reach `aws-1-ap-southeast-2.pooler.supabase.com:6543` while the deployed API smoke still passed. Treat that as an environment/connectivity blocker unless deployed `/v1/catalog/pilot` also fails.

## Next work

1. Configure production `PRIVACY_CONTACT_EMAIL`, then rerun `/privacy` to confirm the mailto contact renders.
2. Run credentialed production smoke for guardian-backed student registration, engagement/feedback/write paths, and admin pilot-review with approved test accounts.
3. Have the pilot coordinator review the privacy notice and guardian wording, then decide whether stronger verifiable-parent consent is required before access is widened.
4. Invite a very small real student pilot, review the deployed admin pilot-review dashboard after actual sessions, and fix the highest-friction chapter, surface, or feedback theme before widening access.
5. Add the payments and subscription foundation after real student usage and platform hardening.
6. Keep extending the API through feature routers rather than expanding `app.ts`.

## 2026-08-14 — Gemini AI verification now live; env-var gotchas

- `GEMINI_API_KEY` is configured in Vercel production for `cbse-bycodex-api` (added via `vercel env add`, value from stdin). Deployed API calls Gemini `gemini-2.5-flash` for exam-paper + question-bank verification (`apps/api/src/lib/exam-papers/verify.ts`). Verified end-to-end at runtime: `POST /v1/exam-papers/generate` with `verify:true` returns `verified`/`review` with Gemini verdicts stored in `verificationJson`.
- All project env vars are now `type=sensitive` (mass-converted at some point), so `vercel env pull` returns masked/empty values and the REST API masks them — do not trust a pulled value to check a secret. New vars added via `vercel env add` default to decryptable `encrypted` type.
- Question bank re-verified with real AI: 63 questions `verified` (AI), 4 `review` (`sav-csa-mcq-1` topicId mismatch, `stats-mcq-1` scope mismatch, `circle-tangent-angle-sa-3` questionType mismatch — content correct, `tri-bpt-proof-3` BPT proof missing the altitudes/area-ratio step). The 4 flagged questions need metadata/content fixes before re-verification; until then the generation pool is 63 (layout needs 38, so generation still works).
