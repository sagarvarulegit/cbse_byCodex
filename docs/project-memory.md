# Project Memory

Last updated: 2026-06-14

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
- Add payment/subscription logic behind the same access helper path used by lesson video gating.
- Add gamification through event aggregation, not ad hoc counters inside request handlers.
- V1 gamification is planned as a personal Chapter Mastery Ladder: video completion contributes limited effort credit, quiz performance drives most mastery, low quiz scores create Revision Missions, and level rewards unlock revision tools rather than public competition.
- Mastery Ladder V1 stores raw quiz/video activity separately from `ChapterMastery`, so the score can be recalculated later if the video/quiz weighting changes.
- The Real Numbers quiz route depends on `apps/web/content/real-numbers/lessons/quiz.md`; keep at least one chapter quiz markdown file committed so the deployed quiz page does not 404.
- Prefer cached or aggregated reads for high-traffic endpoints.
- Keep large generated corpora and graph caches out of routine deploy commits unless they are explicitly needed for future sessions.

## Next Work

1. Add the payments and subscription foundation.
2. Refine the Mastery Ladder with richer quiz authoring, mission completion, and unlock surfaces.
3. Keep extending the API through feature routers rather than expanding `app.ts`.
