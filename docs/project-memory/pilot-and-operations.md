---
type: ProjectMemoryTopic
title: Pilot and Operations Memory
description: Durable free-pilot, deployment, production-smoke, and operational learnings.
tags: ['memory', 'pilot', 'deployment', 'operations', 'vercel']
timestamp: 2026-07-30T00:00:00Z
---

# Pilot and Operations Memory

Read this file for the free student pilot, admin review, production deploys, smoke tests, subscriptions, and operational blockers.

## Product sequencing

- Defer payment/subscription logic until after a free student pilot produces real usage, feedback, bug fixes, and platform-hardening work. When payments return, keep them behind the same access-helper path used by lesson video gating.
- Chapter quality states are intentionally separate: `source-faithful`, `technically pilot-ready`, `student-validated`, and `reference chapter`. Missing student availability may defer student validation, but it must never be relabelled as passed. The fixed Chapter 1 non-student transfer check lives in `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md`.
- Chapter 1 student validation is two-stage: all 2-5 participants complete the first-use session, and at least two complete the post-study workbench, written-PYQ, timed Diagnostic B, remediation, and retention-truthfulness check. Store participant codes and structured observations only, never names, contact details, school identifiers, or raw written answers.

## Free student pilot

- Free Student Pilot V1 centralizes the selected pilot chapters in `apps/web/lib/pilot.ts`: Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying.
- Lesson starts, lesson completions, quiz starts, dashboard views, chapter opens, and feedback submissions are recorded as `ProgressEvent` rows through `/v1/progress/engagement` and `/v1/progress/feedback`.
- DB migration `20260621120000_add_free_pilot_catalog_rows` keeps the selected pilot catalog DB-backed for production quiz saves.
- Pilot Review V1 exposes admin-only activity at `GET /v1/progress/pilot-review`. It requires an admin session token, aggregates recent pilot engagement and feedback into summary counts and breakdowns, and is rendered by the admin dashboard through `apps/admin/lib/pilot-review.ts`.
- Review evidence should prioritize bug reports and 1-2 rating feedback as highest-friction signals while retaining path, timestamp, and recent-message context.
- If Two Stories quiz saves return `Chapter was not found`, check production `GET /v1/catalog/pilot`. On 2026-07-01 the web content was deployed before production applied the free-pilot catalog migration, so English and `two-stories-about-flying` were absent until `prisma migrate deploy`.

## Deployment and smoke history

- The repeatable pilot smoke runbook lives in `docs/pilot-smoke-checklist.md`.
- The 2026-06-22 API production deploy to `cbse-bycodex-api` restored `POST /v1/progress/engagement`, `POST /v1/progress/feedback`, and admin `GET /v1/progress/pilot-review?windowDays=14` at `https://cbse-bycodex-api.vercel.app`. Marker `pilot-smoke-20260622-120257` appeared in recent feedback and highest-friction signals; events increased from 8 to 14 and active students stayed at 1.
- The 2026-06-22 browser smoke refreshed `cbse-bycodex-web` and `cbse-bycodex-admin` at their Vercel aliases. Marker `browser-pilot-smoke-20260622-125900` saved from the deployed lesson page and appeared in the deployed admin review. Counts moved from 14 to 18 events, active students stayed at 1, and each tracked event type reached 3.
- The admin workspace was locally linked to its existing Vercel project during that run, but `.vercel/` remains ignored.
- Local `npm.cmd run test -w apps/api` depends on the Supabase pooler for the DB-backed pilot catalog test. On 2026-06-22 it passed once, then twice failed to reach `aws-1-ap-southeast-2.pooler.supabase.com:6543` while the deployed API smoke still passed. Treat that as an environment/connectivity blocker unless deployed `/v1/catalog/pilot` also fails.

## Next work

1. Invite a very small real student pilot, review the deployed admin pilot-review dashboard after actual sessions, and fix the highest-friction chapter, surface, or feedback theme before widening access.
2. Add the payments and subscription foundation after real student usage and platform hardening.
3. Keep extending the API through feature routers rather than expanding `app.ts`.
