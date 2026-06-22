# TODO

Last updated: 2026-06-22

## Next Task

Invite a very small real student pilot, then use the deployed admin pilot-review dashboard to choose and fix the first highest-friction chapter, surface, or feedback theme before widening access.

## Why This Is Next

The browser-facing production smoke is complete.

Completed production evidence:

- API alias: `https://cbse-bycodex-api.vercel.app`
- Student web alias: `https://cbse-bycodex-web.vercel.app`
- Admin alias: `https://cbse-bycodex-admin.vercel.app`
- `cbse-bycodex-web` was redeployed to production on 2026-06-22 because the stale 2-day-old deployment did not show the existing pilot `Mark studied` and feedback controls.
- `cbse-bycodex-admin` was linked locally to the existing Vercel project and redeployed to production on 2026-06-22.
- Browser smoke marker: `browser-pilot-smoke-20260622-125900`
- Student dashboard, pilot chapter, lesson, lesson completion, quiz, and feedback flows saved through the deployed web app.
- Admin dashboard loaded the free pilot review section and showed the browser smoke marker in both recent feedback and highest-friction signals.

Last browser smoke evidence:

- Total events before: 14
- Total events after: 18
- Active students before: 1
- Active students after: 1
- Event breakdown after:
  - `dashboard_view`: 3
  - `chapter_open`: 3
  - `lesson_start`: 3
  - `lesson_complete`: 3
  - `quiz_start`: 3
  - `feedback_submission`: 3
- Chapter breakdown after:
  - `real-numbers`: 15
  - no chapter context: 3
- Surface breakdown after:
  - `lesson`: 7
  - `quiz`: 5
  - `chapter`: 3
  - `dashboard`: 3

Payments, subscriptions, entitlements, public rankings, leaderboards, coins, and vanity gamification remain out of scope until real usage, feedback, bug fixing, and platform hardening produce enough confidence.

## Product Goal

As an admin, I should be able to review actual student pilot sessions and choose one narrow fix from real friction evidence instead of guessing from smoke data.

## Files To Inspect First

- `docs/project-memory.md`
- `docs/pilot-smoke-checklist.md`
- `apps/admin/app/page.tsx`
- `apps/admin/lib/pilot-review.ts`
- `apps/web/components/PilotFeedbackForm.tsx`
- `apps/web/components/PilotEngagementTracker.tsx`

## Execution Plan

1. Invite only a small real pilot group.
2. Let students use the deployed web app naturally.
3. Open the deployed admin dashboard and review `GET /v1/progress/pilot-review?windowDays=14` evidence.
4. Pick exactly one highest-friction issue from real feedback or event patterns.
5. Fix that narrow issue.
6. Verify with `npm.cmd run test -w apps/web`, `npm.cmd run lint`, and `npm.cmd run build`.
7. Update `docs/project-memory.md` with any durable pilot finding.

## Acceptance Criteria

- The next fix is based on real student pilot evidence, not only smoke-test data.
- The fix is narrow and tied to one chapter, surface, or feedback theme.
- Admin review still shows event, chapter, surface, recent-feedback, and highest-friction evidence.
- No monetization, entitlement, payment, leaderboard, coin, or public-rank work is introduced.

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
