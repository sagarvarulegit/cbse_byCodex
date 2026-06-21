# TODO

Last updated: 2026-06-21

## Next Task

Review the first free-pilot feedback and engagement events before widening chapter access.

## Why This Is Next

The weak-topic recovery loop is now complete enough for pilot students to use: low scores create or refresh recovery missions, passing retries complete them, stale missions are completed during mastery reads, and quiz review explains the next action without unlocking the submitted attempt.

The next useful step is to inspect whether students are actually starting chapters, completing lessons, taking quizzes, and sending feedback. Keep payments deferred until this usage and bug-fix loop has produced enough confidence.

## Scope

- Add a small pilot-review surface or report for feedback submissions and engagement events.
- Include dashboard views, chapter opens, lesson starts, lesson completions, quiz starts, and feedback submissions.
- Make the review useful for deciding whether to improve copy, fix bugs, add content, or widen chapter access.
- Keep it internal/admin-focused; do not add leaderboard, public ranking, payment, subscription, or entitlement work.

## Code To Inspect First

- `apps/api/src/routes/progress.ts`
  - Records `/v1/progress/engagement` and `/v1/progress/feedback` as `ProgressEvent` rows.
- `apps/web/components/PilotEngagementTracker.tsx`
  - Sends student pilot activity from dashboard, chapter, lesson, and quiz surfaces.
- `apps/web/components/PilotFeedbackForm.tsx`
  - Sends student feedback submissions.
- `apps/web/lib/pilot.ts`
  - Owns the selected free pilot chapter list.
- `apps/admin`
  - Likely home for an internal pilot-review UI if this becomes more than a script/report.

## Acceptance Criteria

- The project has a clear way to review recent pilot feedback and engagement events.
- The review groups activity by event type, chapter, and surface where practical.
- The output helps choose the next product fix before widening access.
- Payments remain deferred.

## Verification

- `npm.cmd run test -w apps/api`
- `npm.cmd run test -w apps/web`
- `npm.cmd run lint`
- `npm.cmd run build`
- `graphify update .`

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
