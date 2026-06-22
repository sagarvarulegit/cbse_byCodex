# Project Memory

Last updated: 2026-06-21

## Current Architecture

- `apps/web` is the student-facing Next.js app.
- `apps/admin` is the admin CMS.
- `apps/api` is the Express + Prisma API and is the main place for backend feature work.
- Bunny Stream is the video delivery layer.
- Bunny Storage is used for master MP4 archives.
- Supabase/Postgres stores metadata only.

## Agent Knowledge Workflow

- `graphify-out/` is for generated code graph knowledge only.
- Durable project learnings belong in `docs/project-memory.md`.
- Stable agent operating rules belong in `AGENTS.md`.
- `.githooks/pre-push` refreshes graphify and blocks meaningful source pushes when neither `docs/project-memory.md` nor `AGENTS.md` is included in the outgoing commits.
- `.codex/hooks.json` delegates git-push checks to `.githooks/pre-push` for agent-driven pushes.

## Bunny Video Learnings

- Bunny Stream library ID: `681662`
- Bunny Stream CDN hostname: `vz-02672d82-a18.b-cdn.net`
- Bunny Storage zone: `cbse-class10`
- The uploaded lesson video is stored in Bunny Stream as GUID `ebf723e8-6d88-4dcf-95b0-17f43da79080`.
- Live playback uses the raw HLS playlist URL returned by Bunny Stream.
- The API no longer signs the playlist URL for playback.
- `Video.processingStatus` is refreshed from Bunny only when `Video.statusSyncedAt` is stale, so the API does not hit Bunny on every lesson request.

## Backend Structure

- `apps/api/src/app.ts` is now a small bootstrap file that mounts feature routers.
- Feature routes live in:
  - `apps/api/src/routes/auth.ts`
  - `apps/api/src/routes/catalog.ts`
  - `apps/api/src/routes/video.ts`
  - `apps/api/src/routes/progress.ts`
- Shared auth/session helpers live in:
  - `apps/api/src/lib/session.ts`
  - `apps/api/src/lib/access.ts`

## Scaling Notes

- Keep route logic split by feature as new work lands.
- Defer payment/subscription logic until after a free student pilot produces real usage, feedback, bug fixes, and platform-hardening work. When payments return, keep them behind the same access helper path used by lesson video gating.
- Add gamification through event aggregation, not ad hoc counters inside request handlers.
- V1 gamification is planned as a personal Chapter Mastery Ladder: video completion contributes limited effort credit, quiz performance drives most mastery, low quiz scores create Revision Missions, and level rewards unlock revision tools rather than public competition.
- Mastery Ladder V1 stores raw quiz/video activity separately from `ChapterMastery`, so the score can be recalculated later if the video/quiz weighting changes.
- Gamification Phase 2 adds quiz-save aggregates through `StudyStreak`, `Badge`, and `UserBadge`: daily streaks use India calendar days, quiz badges are awarded for first quiz, score improvement, topic mastery, and comeback after a weak score, and newly earned badges are returned in the quiz-save response for the celebration UI.
- Saved quiz attempts are locked for review after answers are revealed; students should not be able to correct a revealed answer and resubmit the same attempt. Active revision missions should be completed or hidden once the student's best quiz score reaches the mission target, so dashboards do not show stale weak-score missions beside high mastery.
- Quiz Attempt Lifecycle V1 treats every retry as a new immutable saved attempt. The quiz page loads prior attempts, shows best/latest score history, and uses a separate retry action that clears local answers instead of re-enabling submit on a revealed attempt.
- Mastery Reward Unlock V1 is a personal, non-competitive surface derived from existing mastery scores and badge data. `apps/web/lib/mastery-rewards.ts` maps Learner, Skilled, Exam Ready, and Topper Track thresholds to locked/unlocked study-tool rewards for the dashboard and chapter pages.
- The Real Numbers quiz route depends on `apps/web/content/real-numbers/lessons/quiz.md`; keep at least one chapter quiz markdown file committed so the deployed quiz page does not 404.
- Quiz coverage is expected for every catalog chapter returned by `getChapterEntries()`. The web quiz loader first checks explicit quiz directories, then falls back to `apps/web/content/<chapter-slug>/lessons/quiz.md` so generated chapter-pack slugs can have quizzes without extra route wiring.
- Vercel serverless tracing must include `apps/web/content/**/*` for `/chapters/[slug]/quiz`; otherwise local quiz routes can pass while deployed fallback quiz markdown returns 404.
- The student quiz page parses numbered markdown questions into selectable answer cards. Add `Answer: <option number>` after options whenever the correct option is not option 1, because unkeyed generated quizzes currently fall back to option 1 for scoring.
- Quiz markdown now supports optional per-question `Topic:`, `Difficulty:`, `Source:`, and `Explanation:` lines through `apps/web/lib/quiz-content.ts`. `Topic:` drives weak-topic tracking only when it matches a valid chapter topic/lesson slug; explanations render after a locked submission for review.
- Free Student Pilot V1 centralizes the selected pilot chapters in `apps/web/lib/pilot.ts`: Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying. Lesson starts, lesson completions, quiz starts, dashboard views, chapter opens, and feedback submissions are recorded as `ProgressEvent` rows through `/v1/progress/engagement` and `/v1/progress/feedback`; the DB migration `20260621120000_add_free_pilot_catalog_rows` keeps the selected pilot catalog DB-backed for production quiz saves.
- Pilot Review V1 exposes admin-only free-pilot activity at `GET /v1/progress/pilot-review`. The route requires an admin session token, aggregates recent `ProgressEvent` pilot engagement and feedback rows into summary counts, event/chapter/surface breakdowns, and recent feedback messages, and the admin dashboard renders that payload through `apps/admin/lib/pilot-review.ts` so pilot decisions can be made before widening access.
- Pilot Review evidence should prioritize bug reports and 1-2 rating feedback as highest-friction signals, while still keeping recent feedback visible for context. The admin dashboard displays path and timestamp context so a reviewer can connect a complaint to the exact student surface before choosing a narrow fix.
- The repeatable pilot smoke runbook lives in `docs/pilot-smoke-checklist.md`. The 2026-06-22 API production deploy to `cbse-bycodex-api` fixed the stale deployed progress route surface: `POST /v1/progress/engagement`, `POST /v1/progress/feedback`, and admin `GET /v1/progress/pilot-review?windowDays=14` all passed against `https://cbse-bycodex-api.vercel.app`. The smoke marker `pilot-smoke-20260622-120257` appeared in both recent feedback and highest-friction signals, with events increasing from 8 to 14 and active students staying at 1.
- The 2026-06-22 browser-facing production smoke refreshed both deployed frontends: `cbse-bycodex-web` aliased to `https://cbse-bycodex-web.vercel.app` and `cbse-bycodex-admin` aliased to `https://cbse-bycodex-admin.vercel.app`. The admin workspace was locally linked to the existing Vercel project during the run, but `.vercel/` remains ignored. The web deployment exposed the existing pilot `Mark studied` and feedback controls that were missing from the stale 2-day-old deployment. Browser smoke marker `browser-pilot-smoke-20260622-125900` saved from the deployed lesson page and appeared in both recent feedback and highest-friction signals in the deployed admin dashboard. Review counts moved from 14 to 18 total events, active students stayed at 1, and event breakdown reached 3 each for `dashboard_view`, `chapter_open`, `lesson_start`, `lesson_complete`, `quiz_start`, and `feedback_submission`.
- Local `npm.cmd run test -w apps/api` depends on the Supabase pooler for the DB-backed pilot catalog test. On 2026-06-22 it passed once with network access, then failed twice with `Can't reach database server at aws-1-ap-southeast-2.pooler.supabase.com:6543` while the deployed API smoke still passed against the same production route surface. Treat that failure as an environment/connectivity blocker unless the deployed `/v1/catalog/pilot` also fails.
- Revision Mission Lifecycle V1 completes active missions when a retry reaches the mission target and also persists completion during mastery reads when a best quiz score already satisfies a stale active mission. Quiz-save responses now distinguish `created`, `refreshed`, `completed`, and `not_needed` so the web quiz review can show topic labels, first recovery action, target score, or completion copy without re-enabling a locked attempt.
- Prefer cached or aggregated reads for high-traffic endpoints.
- Keep large generated corpora and graph caches out of routine deploy commits unless they are explicitly needed for future sessions.

## Next Work

1. Invite a very small real student pilot, review the deployed admin pilot-review dashboard after actual sessions, and fix the highest-friction chapter, surface, or feedback theme before widening access.
2. Add the payments and subscription foundation after real student usage and platform hardening.
3. Keep extending the API through feature routers rather than expanding `app.ts`.
