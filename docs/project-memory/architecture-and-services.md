---
type: ProjectMemoryTopic
title: Architecture and Services Memory
description: Durable backend, storage, video, and service-boundary learnings.
tags: ['memory', 'architecture', 'api', 'video', 'storage']
timestamp: 2026-07-30T00:00:00Z
---

# Architecture and Services Memory

Read this file for API, Prisma, authentication, Bunny, Supabase, and service-boundary work.

## Current services

- `apps/web` is the student-facing Next.js app.
- `apps/admin` is the admin CMS.
- `apps/api` is the Express + Prisma API and is the main place for backend feature work.
- Bunny Stream is the video delivery layer.
- Bunny Storage is used for master MP4 archives.
- Supabase/Postgres stores metadata only.

## Bunny video

- Bunny Stream library ID: `681662`.
- Bunny Stream CDN hostname: `vz-02672d82-a18.b-cdn.net`.
- Bunny Storage zone: `cbse-class10`.
- The uploaded lesson video is stored in Bunny Stream as GUID `ebf723e8-6d88-4dcf-95b0-17f43da79080`.
- Live playback uses the raw HLS playlist URL returned by Bunny Stream; the API no longer signs the playlist URL for playback.
- `Video.processingStatus` is refreshed from Bunny only when `Video.statusSyncedAt` is stale, so the API does not hit Bunny on every lesson request.

## Backend structure

- `apps/api/src/app.ts` is a small bootstrap file that mounts feature routers. Keep route logic split by feature as new work lands.
- Feature routes live in:
  - `apps/api/src/routes/auth.ts`
  - `apps/api/src/routes/catalog.ts`
  - `apps/api/src/routes/video.ts`
  - `apps/api/src/routes/progress.ts`
- Shared auth/session helpers live in:
  - `apps/api/src/lib/session.ts`
  - `apps/api/src/lib/access.ts`
- Prefer cached or aggregated reads for high-traffic endpoints.
