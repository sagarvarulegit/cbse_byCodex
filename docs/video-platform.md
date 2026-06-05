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
3. Generate a short-lived Bunny token-authenticated URL.
4. Return that URL to the player.

Do not expose `BUNNY_STREAM_API_KEY` or `BUNNY_STREAM_TOKEN_AUTH_KEY` to web/admin clients.

## Upload Flow

1. Render/export the final lesson MP4.
2. Create the video object in Bunny Stream.
3. Upload the file to the Bunny Stream video ID.
4. Wait for processing completion via webhook or polling.
5. Update the `Video` row with Bunny IDs, URLs, thumbnail, duration, and status.

## Cost Controls

- Start with 720p/1080p lesson exports, not 4K.
- Keep intro/outro short.
- Avoid autoplay on catalog pages.
- Use previews/thumbnails instead of loading video on list pages.
- Keep DRM off for MVP.
- Monitor bandwidth weekly after launch.
