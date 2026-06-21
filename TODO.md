# TODO

Last updated: 2026-06-21

## Next Task

Run the first pilot review, fix the highest-friction signal, and add a production pilot smoke checklist.

## Why This Is Next

The admin dashboard now has a pilot review surface backed by `GET /v1/progress/pilot-review`. The next risk is whether real student activity confirms the pilot loop works end to end: login, dashboard arrival, chapter opening, lesson start/completion, quiz start, feedback submission, and admin visibility.

Payments remain deferred until real usage, feedback, bug fixing, and platform hardening produce enough confidence.

## Product Goal

As an admin, I should use real pilot review data to choose the next fix before widening access, then verify the core pilot loop in production so student feedback is not lost.

## Questions This Task Should Answer

- Are real students reaching the dashboard after login?
- Which chapter, surface, or feedback category shows the strongest friction?
- Is the friction caused by broken tracking, confusing UX copy, content quality, mobile layout, or an API failure?
- Can a production smoke test prove that engagement and feedback events appear in the admin pilot review?
- Should access stay narrow, or is there enough healthy signal to invite more students?

## Suggested Implementation Plan

1. Seed or collect a small real pilot session.
   - Use a student account to open the dashboard, a pilot chapter, a lesson, the quiz entry point, and the feedback form.
   - Submit one realistic feedback message with rating/category/surface context.

2. Review the admin pilot dashboard.
   - Check total events, active students, event breakdown, chapter breakdown, surface breakdown, and recent feedback.
   - Confirm the most important friction signal before making changes.

3. Fix the highest-friction issue.
   - Keep the fix small and pilot-first.
   - Prefer copy, layout, tracking reliability, or content repair over adding new features.
   - Do not add payments, subscriptions, entitlements, leaderboards, coins, or public rankings.

4. Add a production pilot smoke checklist.
   - Document the exact login, dashboard, chapter, lesson, quiz, feedback, and admin review checks.
   - Include expected API/event outcomes and screenshots only where useful.

5. Capture durable learning.
   - Update `docs/project-memory.md` with any production gotcha, broken flow, route behavior, or pilot decision.
   - Keep `TODO.md` updated after the next successful push with the next task.
   - Run `graphify update .` after source changes.

## Acceptance Criteria

- One real or production-like pilot session is reviewed through the admin dashboard.
- The highest-friction signal is identified and fixed or clearly documented as the next fix.
- A production pilot smoke checklist exists in `docs/`.
- The smoke checklist covers engagement tracking, feedback submission, and admin pilot-review visibility.
- No monetization or vanity gamification work is introduced.

## Verification

- `npm.cmd run test -w apps/api`
- `npm.cmd run test -w apps/web`
- `npm.cmd run lint`
- `npm.cmd run build`
- `graphify update .`

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
