---
type: ProjectMemoryTopic
title: Architecture and Services Memory
description: Durable backend, storage, video, and service-boundary learnings.
tags: ['memory', 'architecture', 'api', 'video', 'storage']
timestamp: 2026-08-04T00:00:00Z
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

## Registration and privacy

- New student registration requires a guardian self-attestation validated by `apps/api/src/lib/guardian-consent.ts`; the authoritative notice version is `2026-08-04` in both API and web constants.
- Prisma stores one optional `GuardianConsent` per `User`, including guardian name/email, parent or lawful-guardian relationship, notice version, consent timestamp, revocation timestamp, and `verificationStatus`.
- The only implemented verification status is `self_attested`. This is a controlled-pilot record, not legal identity or age verification; an unrestricted public launch needs a compliance decision and stronger verification if required.
- The public `/privacy` route documents collection, use, providers, retention, and guardian request rights. Configure server-only `PRIVACY_CONTACT_EMAIL` before onboarding is widened.

## Bunny video

- Bunny Stream library ID: `681662`.
- Bunny Stream CDN hostname: `vz-02672d82-a18.b-cdn.net`.
- Bunny Storage zone: `cbse-class10`.
- The uploaded lesson video is stored in Bunny Stream as GUID `ebf723e8-6d88-4dcf-95b0-17f43da79080`.
- Live playback uses the raw HLS playlist URL returned by Bunny Stream; the API no longer signs the playlist URL for playback.
- `Video.processingStatus` is refreshed from Bunny only when `Video.statusSyncedAt` is stale, so the API does not hit Bunny on every lesson request.

## Backend structure

- `apps/api/src/app.ts` is the main Express bootstrap file that mounts feature routers with global CORS and error handling.
- Feature routes live in:
  - `apps/api/src/routes/auth.ts`: Student registration, login, profile updates, guardian self-attestation.
  - `apps/api/src/routes/recovery.ts`: Password recovery token generation, validation, and reset via Resend transactional email.
  - `apps/api/src/routes/catalog.ts`: Subjects, chapters, and topics metadata.
  - `apps/api/src/routes/video.ts`: Bunny Stream video playback metadata and sync.
  - `apps/api/src/routes/progress.ts`: Quiz attempts, written practice, engagement events, mastery aggregates, badges, streaks, and mistake review queue.
  - `apps/api/src/routes/exam-papers.ts`: 7-subject blueprint mock paper generation, CBT attempts, and seed bank publishing.
  - `apps/api/src/routes/evaluator.ts`: Grounded AI Snap & Grade written answer evaluation against step-marking schemes.
  - `apps/api/src/routes/tutor.ts` & `tutor-chat.ts`: Tara AI Socratic tutor chat, pgvector RAG semantic search, SSE streaming, and Bunny attachments.
  - `apps/api/src/routes/payments.ts`: Cashfree & Razorpay order creation, payment signature verification, and user entitlement provisioning.
  - `apps/api/src/routes/feedback.ts`: Student pilot feedback and friction signals.
- Shared auth/session helpers live in:
  - `apps/api/src/lib/session.ts`
  - `apps/api/src/lib/access.ts`
- Core service modules:
  - `apps/api/src/lib/tutor/`: Tara persona, prompt engineering, Gemini Flash streaming, and pgvector cosine retrieval.
  - `apps/api/src/lib/evaluator/`: Step-marking matching, heuristic fallback, and grounded AI written score calculations.
  - `apps/api/src/lib/payments/`: Cashfree SDK client, Razorpay fallback, and product definitions.
  - `apps/api/src/lib/exam-papers/`: Generalized demand planner, pure assembler, and Gemini blueprint verification.
  - `apps/api/src/lib/email/`: Resend email dispatcher for account recovery and support notifications.
- `MistakeReviewItem` and `ExamReadyChecklist` are owned by the progress API. The former stores bounded learning-recovery evidence and three-day retry dates; the latter stores only student-confirmed checklist fields while automatic readiness is derived at read time.

