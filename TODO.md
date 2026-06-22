# TODO

Last updated: 2026-06-22

## Next Task

Run the browser-facing free-pilot smoke through the deployed student web and admin apps, confirm both use `https://cbse-bycodex-api.vercel.app`, then choose the first real pilot-review fix from actual student feedback.

## Why This Is Next

The previous blocker was the deployed API route surface. That is now resolved:

- `npx.cmd vercel --cwd apps/api --prod --yes` deployed the linked `cbse-bycodex-api` project.
- The production alias is `https://cbse-bycodex-api.vercel.app`.
- `GET /health` returned `ok`.
- `GET /v1/catalog/pilot` returned the deployed pilot catalog.
- Seeded student and admin smoke logins worked against production.
- `POST /v1/progress/engagement` saved dashboard, chapter, lesson, lesson-complete, and quiz-start events.
- `POST /v1/progress/feedback` saved feedback.
- Student access to `GET /v1/progress/pilot-review?windowDays=14` returned `403`.
- Admin access to pilot review returned event, chapter, surface, recent-feedback, and friction-signal evidence.

Smoke evidence:

- API base: `https://cbse-bycodex-api.vercel.app`
- Smoke marker: `pilot-smoke-20260622-120257`
- Review window: 14 days
- Total events before: 8
- Total events after: 14
- Active students before: 1
- Active students after: 1
- Friction signals contained the smoke marker: yes
- Recent feedback contained the smoke marker: yes

Vercel project visibility from `vercel ls`:

- `cbse-bycodex-api`: production deployment refreshed on 2026-06-22.
- `cbse-bycodex-web`: latest visible production deployment was about 2 days old during this smoke.
- `cbse-bycodex-admin`: latest visible production deployment was about 12 days old during this smoke.

Payments, subscriptions, entitlements, public rankings, leaderboards, coins, and vanity gamification remain out of scope until real usage, feedback, bug fixing, and platform hardening produce enough confidence.

## Product Goal

As an admin, I should be able to watch a real or smoke student use the deployed web app and then see that same trail in the deployed admin pilot-review section.

## Scope

1. Confirm deployed student web and admin URLs.
2. Confirm both deployments point to `https://cbse-bycodex-api.vercel.app`.
3. Redeploy student web and/or admin only if their production env or deployed code is stale.
4. Run `docs/pilot-smoke-checklist.md` in the browser:
   - student login
   - dashboard open
   - pilot chapter open
   - lesson or notes open
   - lesson completion when practical
   - quiz open
   - feedback submission with a unique marker
   - admin login
   - admin pilot-review confirmation
5. Capture event counts, active student counts, event/chapter/surface breakdowns, and feedback evidence.
6. If a narrow UI or content issue appears, fix exactly that highest-friction issue.
7. Update `docs/project-memory.md` with durable deployment or smoke-test gotchas.
8. Update `TODO.md` again after the successful push.

## Files To Inspect First

- `docs/pilot-smoke-checklist.md`
- `apps/web/.vercel/project.json`
- `apps/admin/.vercel/project.json`, if present
- `apps/web/lib/auth.ts`
- `apps/web/app/api/progress/engagement/route.ts`
- `apps/web/app/api/progress/feedback/route.ts`
- `apps/admin/lib/auth.ts`
- `apps/admin/lib/pilot-review.ts`
- `docs/project-memory.md`

## Verification

Run before commit:

```powershell
npm.cmd run test -w apps/api
npm.cmd run test -w apps/web
npm.cmd run lint
npm.cmd run build
```

If source files change, run:

```powershell
graphify update .
```

Before pushing, inspect:

```powershell
git status --short --branch
git diff --stat
```

## Acceptance Criteria

- Student web login works in the deployed or preview browser environment.
- Student engagement and feedback requests save successfully from the web app.
- Admin login works in the deployed or preview browser environment.
- Admin pilot review shows the student session within the selected review window.
- The feedback context is specific enough to choose one next fix.
- `docs/project-memory.md` records any durable deployment, env, or smoke gotcha.
- No monetization, entitlement, payment, leaderboard, coin, or public-rank work is introduced.

## Master TODO Alignment

This advances these `master_todo.md` areas without treating that file as the source of truth:

- `[ ] Add progress event tracking for video, notes, quizzes, practice, revision, and downloads.`
- `[ ] Add basic aggregate analytics for student engagement.`
- `[ ] Smoke test deployed API endpoints, student web, and admin web.`

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
