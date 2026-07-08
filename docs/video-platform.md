---
type: PlatformSpecification
title: Video Delivery and Bunny Stream Platform
description: Integration details and guidelines for using Bunny Stream for master MP4 archives and HLS delivery.
tags: ['video', 'bunny-stream', 'hls']
timestamp: 2026-07-08T12:00:00Z
---

# Bunny Stream Video Platform

Bunny Stream is the default video provider for the MVP. Vercel serves the app/API, Supabase stores metadata, and Bunny stores/transcodes/delivers the actual lesson videos.

## What We Store

Supabase/Postgres stores metadata only:

- `provider`: `bunny`
- `providerLibraryId`: Bunny Stream library ID
- `providerVideoId`: Bunny Stream video ID/GUID
- `playbackUrl`: HLS URL when using a custom player
- `embedUrl`: Bunny iframe player URL when using Bunny's player
- `thumbnailUrl`
- `durationSeconds`
- `processingStatus`
- `statusSyncedAt`

The MP4/HLS files are not stored in Postgres, Vercel, or the Git repo.

## URL Patterns

Bunny Stream exposes predictable playback URLs after processing:

```text
https://<cdn-hostname>/<video-id>/playlist.m3u8
https://player.mediadelivery.net/embed/<library-id>/<video-id>
```

Use the HLS URL when we need a custom lesson player with progress tracking. Use the iframe embed when speed of implementation matters more than full player control.

## Access Control

For free preview lessons, public playback is acceptable. For premium lessons, the API should:

1. Authenticate the student.
2. Check subscription entitlement.
3. Return playback metadata only after access checks pass.

Do not expose `BUNNY_STREAM_API_KEY` or `BUNNY_STREAM_TOKEN_AUTH_KEY` to web/admin clients.

Provider-level token authentication and DRM are deferred until the paid-content launch path is validated end to end. The current production path uses API access checks plus Bunny Stream HLS playback URLs.

## Upload Flow

1. Render/export the final lesson MP4.
2. Upload the master MP4 to Bunny Storage so Bunny Stream is not the only copy.
3. Create the video object in Bunny Stream.
4. Upload the file to the Bunny Stream video ID.
5. Wait for processing completion via webhook or polling.
6. Update the `Video` row with Bunny IDs, URLs, thumbnail, duration, and status.

The MVP upload helper is:

```bash
npm run bunny:upload-video -w apps/api -- \
  --file ./path/to/lesson.mp4 \
  --chapter-slug real-numbers \
  --lesson-slug euclid-division-lemma
```

## Production Asset Layout

Keep lesson production assets outside Git, then archive them in Bunny Storage or another object store. Commit only reusable scripts, templates, and documentation.

Use this folder convention for each lesson:

```text
videos/
  class-10/
    mathematics/
      real-numbers/
        01-euclid-division-lemma/
          source/
            script.md
            storyboard.md
            index.html
            project.hyperframes.json
          narration/
            narration.mp3
            elevenlabs-alignment.json
            voice-settings.json
          captions/
            captions.vtt
            word-captions.json
          media/
            diagrams/
            images/
            music/
            sfx/
          renders/
            lesson-1080p.mp4
            lesson-720p.mp4
            thumbnail.jpg
          manifest.json
```

The production flow is:

```text
source + narration + captions + media -> final rendered MP4 -> Bunny Storage + Bunny Stream
```

Voice and sound assets stay separate while producing the lesson, so narration can be regenerated without rebuilding the whole lesson from scratch. Bunny Stream receives the final rendered MP4 with audio baked in.

Generate ElevenLabs narration and caption assets with:

```bash
npm run elevenlabs:voiceover -w apps/api -- \
  --script ./videos/class-10/mathematics/real-numbers/01-euclid-division-lemma/source/script.md \
  --out-dir ./videos/class-10/mathematics/real-numbers/01-euclid-division-lemma
```

The script writes `narration/narration.mp3`, `narration/elevenlabs-alignment.json`, `narration/voice-settings.json`, `captions/word-captions.json`, and `captions/captions.vtt`.

Use `manifest.json` to connect production files with platform metadata:

```json
{
  "chapterSlug": "real-numbers",
  "lessonSlug": "euclid-division-lemma",
  "voiceProvider": "elevenlabs",
  "voiceId": "g14YnDYCsy3k7XLlcKlO",
  "renderFile": "renders/lesson-1080p.mp4",
  "captionFile": "captions/captions.vtt",
  "bunnyStoragePath": "class-10/mathematics/real-numbers/01-euclid-division-lemma/renders/lesson-1080p.mp4",
  "bunnyStreamVideoId": ""
}
```

Required server-only API env:

```text
ELEVENLABS_API_KEY
ELEVENLABS_VOICE_ID=g14YnDYCsy3k7XLlcKlO
BUNNY_STREAM_LIBRARY_ID
BUNNY_STREAM_API_KEY
BUNNY_STREAM_CDN_HOSTNAME
BUNNY_STREAM_TOKEN_AUTH_KEY
BUNNY_STREAM_SIGNED_URL_TTL_SECONDS
VIDEO_ACTIVE_STATUS_SYNC_TTL_SECONDS
VIDEO_TERMINAL_STATUS_SYNC_TTL_SECONDS
BUNNY_STORAGE_ZONE_NAME
BUNNY_STORAGE_ACCESS_KEY
BUNNY_STORAGE_ENDPOINT
```

## Narration Voice

Use ElevenLabs voice ID `g14YnDYCsy3k7XLlcKlO` for generated lesson narration. Local voiceover scripts should read this from `ELEVENLABS_VOICE_ID` so the voice can be changed without editing source files.

## App Integration

- `GET /v1/lessons/by-slug/:chapterSlug/:lessonSlug/video` returns HLS playback metadata after access checks.
- The API refreshes Bunny processing metadata only when `Video.statusSyncedAt` is stale, avoiding a provider API call on every lesson page load.
- `POST /v1/progress/video` records progress in `ProgressEvent`.
- The student web app fetches playback metadata server-side and reports progress through its local `/api/progress/video` route so browser JavaScript never sees the API session token.
- Until subscription tables are implemented, premium playback is gated by login only. Replace that helper with real entitlement checks before paid launch.

## Cost Controls

- Start with 720p/1080p lesson exports, not 4K.
- Keep intro/outro short.
- Avoid autoplay on catalog pages.
- Use previews/thumbnails instead of loading video on list pages.
- Keep DRM off for MVP.
- Monitor bandwidth weekly after launch.
