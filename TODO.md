# TODO

Last updated: 2026-06-21

## Next Task

Deploy or sync the current API progress routes, then rerun the free-pilot smoke checklist against production or preview.

## Why This Is Next

The pilot review loop now has a repeatable smoke checklist at `docs/pilot-smoke-checklist.md`, and the admin review payload/dashboard can surface highest-friction feedback separately from general recent feedback.

The first production-like API smoke confirmed that the deployed API is reachable for:

- `GET /health`
- `GET /v1/catalog/pilot`

But the same deployed API returned `404 Cannot POST /v1/progress/engagement`, which means the deployed API route surface is stale or not synced with the local pilot-progress implementation.

Until `/v1/progress/engagement`, `/v1/progress/feedback`, and `/v1/progress/pilot-review` are live in the tested environment, an empty admin pilot review cannot be interpreted as low student activity.

Payments remain deferred until real usage, feedback, bug fixing, and platform hardening produce enough confidence.

## Product Goal

As an admin, I should be able to run the smoke checklist against the deployed or preview environment and see the student event trail appear in the admin pilot review.

## Scope

1. Confirm which environment should be tested:
   - production
   - preview
   - local production-like
2. Deploy or otherwise sync the current `apps/api` progress routes.
3. Verify these deployed API endpoints:
   - `GET /health`
   - `GET /v1/catalog/pilot`
   - `POST /v1/progress/engagement`
   - `POST /v1/progress/feedback`
   - `GET /v1/progress/pilot-review?windowDays=14`
4. Run `docs/pilot-smoke-checklist.md` from student login through admin review.
5. Fix exactly one highest-friction signal if the smoke produces a narrow code/content issue.
6. Record durable gotchas in `docs/project-memory.md`.
7. Update `TODO.md` again after the successful push.

## Evidence From Last Smoke Attempt

- API base checked: `https://cbse-bycodex-api.vercel.app`
- `GET /health`: passed with `{ "status": "ok", "service": "cbse-api" }`
- `GET /v1/catalog/pilot`: passed and returned the pilot catalog.
- `POST /v1/progress/engagement`: failed with `404 Cannot POST /v1/progress/engagement`
- Highest-friction issue: deployed API is stale or missing the local progress route surface.

## Acceptance Criteria

- Deployed or preview API exposes the progress endpoints listed above.
- A student pilot session can save engagement and feedback.
- An admin can load pilot review data from the same environment.
- The admin pilot review shows event, chapter, surface, recent-feedback, and highest-friction signal evidence.
- `docs/project-memory.md` records any deployment or smoke-test gotcha.
- No payment, subscription, entitlement, public ranking, leaderboard, coin, or vanity gamification work is introduced.

## Verification

- `npm.cmd run test -w apps/api`
- `npm.cmd run test -w apps/web`
- `npm.cmd run lint`
- `npm.cmd run build`
- `graphify update .` after source changes.

## Master TODO Alignment

This task advances these `master_todo.md` areas without treating that file as the source of truth:

- `[ ] Add progress event tracking for video, notes, quizzes, practice, revision, and downloads.`
- `[ ] Add basic aggregate analytics for student engagement.`
- `[ ] Smoke test deployed API endpoints, student web, and admin web.`

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
