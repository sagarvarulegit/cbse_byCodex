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
