---
type: Runbook
title: Pilot Smoke Test Runbook
description: Step-by-step smoke tests for verification of localized API routes, Vercel deployments, engagement logging, and feedback.
tags: ['smoke-test', 'pilot', 'runbook']
timestamp: 2026-07-08T12:00:00Z
---

# Free Pilot Smoke Checklist

Last updated: 2026-06-21

Use this checklist before widening free-pilot access. Record exact evidence so the next review can tell whether the pilot loop is healthy, blocked, or simply missing enough student sessions.

## Run Details

- Environment under test: production / preview / local
- Smoke run timestamp:
- Student account used:
- Admin account used:
- Student web URL:
- Admin web URL:
- API base URL:
- Pilot chapter used:
- Feedback message identifier:
- Reviewer:

## Required Accounts

- Student account can log in to the student web app.
- Admin account can log in to the admin app.
- Both accounts point at the same API environment and database.
- Do not use payment, subscription, entitlement, or leaderboard flows for this smoke.

## API Checks

- `GET /health` returns `200` with an `ok` response.
- `GET /v1/auth/session` returns the expected student session when called with the student token.
- `GET /v1/auth/session` returns the expected admin session when called with the admin token.
- `GET /v1/progress/pilot-review?windowDays=14` returns `403` for a student token.
- `GET /v1/progress/pilot-review?windowDays=14` returns `200` for an admin token.

## Student Flow

- Log in as the student.
- Open `/dashboard`.
- Confirm `dashboard_view` should be sent from the dashboard.
- Open each current pilot chapter at least once:
  - `real-numbers`
  - `chemical-reactions-and-equations`
  - `two-stories-about-flying`
- Confirm each chapter page should send `chapter_open`.
- Open one lesson or notes page in the most important pilot chapter.
- Confirm the lesson or notes page should send `lesson_start`.
- Click the studied/completion control when practical.
- Confirm the completion control should send `lesson_complete`.
- Open the chapter quiz entry point.
- Confirm the quiz page should send `quiz_start`.
- Submit one realistic feedback message from dashboard, lesson, or quiz with:
  - rating
  - category
  - message
  - surface
  - current path
  - chapter context when available
  - lesson context when available

## Admin Flow

- Log in as the admin.
- Open the admin dashboard.
- Confirm the free pilot review section loads.
- Confirm `Pilot events` increased after the student session.
- Confirm `Active students` includes the test student.
- Confirm event breakdown includes the expected flow:
  - `dashboard_view`
  - `chapter_open`
  - `lesson_start`
  - `lesson_complete` when triggered
  - `quiz_start`
  - `feedback_submission`
- Confirm chapter breakdown includes the pilot chapter opened during the session.
- Confirm surface breakdown includes the relevant dashboard, chapter, lesson, or quiz surfaces.
- Confirm recent feedback shows rating, category, message, surface, chapter, lesson, path, and timestamp context where available.
- Confirm highest-friction signals show bug reports or 1-2 rating feedback first.
- Confirm the next-decision hint points to usage, feedback, or a narrow fix, not payments or vanity gamification.

## Evidence To Capture

- Timestamp of student feedback submission.
- Account used.
- Chapter and lesson used.
- Exact feedback message identifier or unique message text.
- Pilot events count before and after the run.
- Active students count before and after the run.
- Event, chapter, and surface breakdown values after the run.
- Screenshot or copied admin metric values when helpful.
- Any API response status that fails the expected result.

## Pass Criteria

- Student login works.
- Engagement and feedback requests save successfully.
- Admin login works.
- Admin pilot review shows the student session within the selected review window.
- Feedback context is specific enough to choose one next fix.
- No monetization, entitlement, payment, leaderboard, coin, or public-rank work is introduced.

## Fail And Triage Rules

- If login fails, stop and fix auth/session before reviewing pilot content.
- If engagement events are missing, inspect `NEXT_PUBLIC_API_BASE_URL`, same-domain cookie behavior, and `/api/progress/engagement` proxy behavior.
- If feedback saves but context is missing, inspect the feedback form payload for `surface`, `path`, `chapterSlug`, and `lessonSlug`.
- If admin review is empty, confirm student and admin apps point to the same API and database.
- If `/v1/progress/pilot-review` fails for admin, confirm the admin session token and role.
- If only deployed checks fail, confirm the latest API, web, and admin deployments are live.
- If the database is unreachable, verify remote DB connectivity, pooler host/port, and runtime `DATABASE_URL`.

## Review Decision

- Highest-friction signal chosen:
- Root cause:
- Fix completed in this session: yes / no
- If no, next implementation task:
- Safe to invite more students: yes / no

## Smoke Evidence Log

### 2026-08-04 Guardian Consent Migration And Production Deploy

- Vercel CLI was re-authorized with the OAuth device flow as `sagarvarule-4946`.
- Migration: `npm.cmd run prisma:migrate:deploy -w apps/api` applied `20260804090000_add_guardian_consent`; Prisma reported 10 migrations found and all migrations successfully applied.
- API deploy: `cbse-bycodex-api`, deployment `dpl_J9gV2rxGa8HRwksH4T7NbETU2o44`, aliased to `https://cbse-bycodex-api.vercel.app`.
- Student web deploy: `cbse-bycodex-web`, deployment `dpl_3DkXxFpPCu112m71pk3WJHYvgCQ6`, aliased to `https://cbse-bycodex-web.vercel.app`.
- Admin deploy: `cbse-bycodex-admin`, deployment `dpl_GXrifuxuapDTaWHDmqNyZy59NesW`, aliased to `https://cbse-bycodex-admin.vercel.app`.
- The first web deploy attempt failed on TypeScript nullability and target errors. Focused local `npm.cmd run lint -w apps/web` passed after narrow type repairs, and the redeploy build completed.
- `GET /health`: returned `200` with `status: ok` and `service: cbse-api`.
- `GET /v1/catalog/pilot`: returned `200` with Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying.
- `GET /v1/auth/session` without a token: returned `401 Unauthorized`.
- `GET /v1/progress/pilot-review?windowDays=14` without a token: returned `403 Forbidden`.
- Student web alias `/`, `/privacy`, and `/register` returned `200 OK`.
- Admin root returned `307` to `/login`; admin `/login` returned `200 OK`.
- The deployed `/privacy` page rendered the fallback contact wording, so production `PRIVACY_CONTACT_EMAIL` still needs configuration and redeploy before access is widened.
- Credentialed registration, engagement/feedback/write-path, and admin-review smoke were not run because they require approved student/admin test account use and create production records.
- Safe to invite more students: no. Configure the privacy contact and complete credentialed smoke first.

### 2026-08-02 Production Read-Only And Migration Smoke

- Migration: `npm.cmd run prisma:migrate:deploy -w apps/api` applied `20260726123000_add_written_practice_attempts`; Prisma reported 9 migrations found and all migrations successfully applied.
- Focused API checks: `node --import tsx --test src/lib/gamification.test.ts src/lib/mastery-aggregation.test.ts src/lib/quiz-topic-slugs.test.ts` passed 19/19 assertions.
- Focused web checks: `node --import tsx --test lib/mastery.test.ts lib/mastery-rewards.test.ts lib/quiz-recovery.test.ts lib/pilot-quiz-content.test.ts` passed 9/9 assertions.
- API base URL: `https://cbse-bycodex-api.vercel.app`.
- Student web alias: `https://cbse-bycodex-web.vercel.app` returned `200 OK` to a public HEAD request.
- Admin web alias: `https://cbse-bycodex-admin.vercel.app` returned `200 OK` to a public HEAD request.
- `GET /health`: returned `200` with `status: ok` and `service: cbse-api`.
- `GET /v1/catalog/pilot`: returned `200` with the three free-preview pilot chapters: Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying.
- `GET /v1/auth/session` without a token: returned `401 Unauthorized`.
- `GET /v1/progress/pilot-review?windowDays=14` without a token: returned `403 Forbidden`.
- Credentialed write smoke was not run. Creating a production smoke-test student account and writing engagement, quiz, written-practice, and feedback rows requires explicit approval because it persists test data in pilot metrics.
- Admin review smoke was not run because no admin session token or credentials were available.
- Safe to invite more students: no. The credentialed student write path and admin review path must still be verified against production before invites widen.
