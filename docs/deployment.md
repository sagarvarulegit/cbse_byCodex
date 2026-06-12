# Deployment Runbook

This repo is ready to deploy as three Vercel projects backed by one Supabase Postgres database.

## Target Topology

- `apps/web`: student-facing Next.js app on Vercel.
- `apps/admin`: admin Next.js app on Vercel.
- `apps/api`: Express API on Vercel.
- `apps/api/prisma`: Prisma schema and migrations for Supabase Postgres.
- Bunny Stream: lesson video hosting, transcoding, HLS delivery, and token-authenticated playback.

## Supabase

1. Create a Supabase project near the Vercel region you plan to use.
2. In Supabase SQL Editor, create or choose a database role for Prisma. Prefer a dedicated role instead of using the dashboard `postgres` password from app runtimes.
3. In Project Settings > Database > Connection string, copy:
   - transaction pooler URL for app runtime: use it as `DATABASE_URL`.
   - direct connection or session pooler URL for migrations: use it as `DIRECT_URL`.
4. Put the values in `apps/api/.env` locally and in the Vercel API project's environment variables.
5. Apply the initial schema:

```bash
npm run prisma:generate -w apps/api
npm run prisma:migrate:deploy -w apps/api
```

The initial migration enables row-level security on all public tables. No browser-facing Supabase Data API policies are defined yet because the current app should talk through the API service. If you later query Supabase directly from the web app, add explicit RLS policies before exposing those tables to `anon` or `authenticated`.

## Vercel Projects

Create three Vercel projects from the same Git repository.

| Project | Root Directory | Framework | Build Command | Required Env |
| --- | --- | --- | --- | --- |
| Student web | `apps/web` | Next.js | `npm run build` | `NEXT_PUBLIC_API_BASE_URL` |
| Admin web | `apps/admin` | Next.js | `npm run build` | `NEXT_PUBLIC_API_BASE_URL` |
| API | `apps/api` | Express / Other | `npm run build` | `DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGIN`, `ELEVENLABS_API_KEY`, Bunny Stream env |

Recommended production values:

```text
NEXT_PUBLIC_API_BASE_URL=https://<api-project>.vercel.app
CORS_ORIGIN=https://<web-project>.vercel.app,https://<admin-project>.vercel.app
DATABASE_URL=postgresql://prisma.<project-ref>:<password>@<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://prisma.<project-ref>:<password>@<region>.pooler.supabase.com:5432/postgres
ELEVENLABS_API_KEY=<server-only key>
BUNNY_STREAM_LIBRARY_ID=<bunny-stream-library-id>
BUNNY_STREAM_API_KEY=<bunny-stream-library-api-key>
BUNNY_STREAM_CDN_HOSTNAME=<pull-zone>.b-cdn.net
BUNNY_STREAM_TOKEN_AUTH_KEY=<pull-zone-token-auth-key>
BUNNY_STREAM_SIGNED_URL_TTL_SECONDS=1800
BUNNY_STORAGE_ZONE_NAME=<bunny-storage-zone-name>
BUNNY_STORAGE_ACCESS_KEY=<bunny-storage-zone-password>
BUNNY_STORAGE_ENDPOINT=https://storage.bunnycdn.com
```

Vercel's monorepo flow expects each deployable app to be imported as a separate project and assigned its own root directory. The API exports the Express app from `apps/api/src/app.ts`, which Vercel can run as a function, while `apps/api/src/main.ts` remains the local `npm run dev` listener.

## Deployment Order

1. Create Supabase project and set `DATABASE_URL` / `DIRECT_URL`.
2. Run `npm run prisma:migrate:deploy -w apps/api`.
3. Deploy `apps/api` and verify `https://<api-project>.vercel.app/health`.
4. Deploy `apps/web` and `apps/admin` with `NEXT_PUBLIC_API_BASE_URL` pointing to the API deployment.
5. Add custom domains after the Vercel preview deployments pass smoke tests.

## Smoke Tests

```bash
curl https://<api-project>.vercel.app/health
curl https://<api-project>.vercel.app/v1/catalog/pilot
```

Then open the student and admin Vercel URLs and confirm the pages load without console errors.

## Bunny Stream

Use Bunny Stream for final lesson videos and Bunny Storage for master MP4 archives. API keys, library IDs, CDN hostname, token auth key, and storage credentials belong only in the API project environment variables. Do not add them to `NEXT_PUBLIC_` variables.

Recommended flow:

1. Create a Bunny Stream video library.
2. Copy the library ID and library API key into the Vercel API project.
3. Configure the video CDN hostname/pull zone and token authentication key.
4. Upload final animation MP4 files with the server-side helper:
   `npm run bunny:upload-video -w apps/api -- --file ./lesson.mp4 --chapter-slug <chapter-slug> --lesson-slug <lesson-slug>`.
5. Store the returned Bunny video ID in `Video.providerVideoId` and the library ID in `Video.providerLibraryId`.
6. Build playback URLs with `https://<cdn-hostname>/<video-id>/playlist.m3u8` or embed URLs with `https://player.mediadelivery.net/embed/<library-id>/<video-id>`.
7. For premium content, the API returns a signed playback URL after access checks. The MVP gate is login-only until subscription entitlements are implemented.

For MVP, keep `drmRequired=false` and rely on token-authenticated streaming. Add DRM only when paid offline downloads or licensing require it.
