---
type: ReferenceRegister
title: Project Backlog and TODOs
description: Current project backlog, task list, and completed items for the CBSE learning portal.
tags: ['todo', 'backlog', 'tasklist']
timestamp: 2026-07-08T12:00:00Z
---

# Project TODO

Last updated: 2026-08-16

This backlog was assembled from the accessible local Codex transcripts for this
project, the current repo docs, and the git history through `d2040ac`.

## Current Priority

- [x] Deploy three Vercel projects: `apps/api`, `apps/web`, and `apps/admin` (2026-08-16: web https://www.chapterready.in, API https://cbse-bycodex-api.vercel.app, admin https://cbse-bycodex-admin.vercel.app; smoke-tested health/auth/catalog/exam-papers/tutor).
- [ ] Next: Free/paid entitlement split on the Mock Test Series — Paper 1 open, Papers 2–5 gated behind access (pre-Razorpay step). The platform is now live, so gating has a real surface.
- [ ] Rotate the ElevenLabs API key that was pasted into chat, then update only server-side/local environment variables.
- [ ] Smoke test deployed API endpoints, student web, and admin web.

## AI Tutor "Tara-Firefly" — Shipped (2026-08-16)

- [x] RAG corpus: `npm run rag:build -w apps/api` chunks chapter packs + lesson notes into 1128 pgvector rows (gemini-embedding-001, 3072-dim); `docs/rag-corpus.md` documents the design.
- [x] Retrieval: `lib/rag/retrieve.ts` (pgvector cosine, top-k 6, 0.35 floor) + `POST /v1/tutor/search` debug endpoint.
- [x] Conversation persistence: `TutorConversation`/`TutorMessage`/`TutorAttachment` models + CRUD routes (user-scoped, RLS).
- [x] Gemini service: `lib/tutor/tara.ts` persona, `generate.ts` (gemini-2.5-flash, temp 0.3, JSON contract, safety settings), `format.ts` sanitizer; unit-tested.
- [x] Chat endpoint: `POST /v1/tutor/conversations/:id/messages` (multipart, Bunny Storage attachments, SSE streaming, 30/day quota) + JSON fallback.
- [x] Web UI: `TaraWidget` bubble in RootLayout (auth-gated), chat window with streaming, math rendering, citations, multi-file attach; Next.js proxy routes with SSE passthrough.
- [ ] Pending: full PDF text extraction into Gemini context (currently PDFs are attachment notes only).
- [ ] Pending: attachment download URLs for the student (Bunny CDN public URLs) in the UI.

## Mock Test Series — Shipped (2026-08-15)

- [x] Fixed 5-paper Mock Test Series (Maths 041) with curated seeds, published as shared verified papers (`MATHS_041_SERIES`, `POST /v1/admin/exam-papers/series/publish`, idempotent).
- [x] Take-the-test UX: timer, answer entry, MCQ auto-score, written self-marking against marking-scheme value points, weak-chapter report (`ExamPaperRunner`).
- [x] Attempt persistence: `ExamPaperAttempt` model + migration, `POST /:id/attempt` (idempotent upsert on `clientAttemptId`), `GET /v1/exam-papers/attempts` with aggregate + weak-area report.
- [x] Question bank expanded 67 → 88 verified stems (`maths-041-series-expansion.ts`); 5 papers AI-verified by Gemini; 6 content errors found and fixed.
- [x] Verification scripts: `npm run verify:bank` and `npm run verify:papers -w apps/api` (needs a valid `GEMINI_API_KEY`).
- [x] Global Express error handler added (`apps/api/src/app.ts`).
- [ ] Pending: attempt persistence is client-driven; server-side attempt detail endpoint (`GET /attempts/:id`) for the parent-facing report is a follow-up.

## Foundation Already Done

- [x] Decided product scope: CBSE Class 10 online learning portal for Android, iOS, and Web.
- [x] Chose initial app structure: Next.js student web, Next.js admin, Express API, Flutter mobile placeholder.
- [x] Created product blueprint in `docs/product-blueprint.md`.
- [x] Created MVP requirements in `docs/mvp-requirements.md`.
- [x] Created data model spec in `docs/data-model.md`.
- [x] Scaffolded monorepo under `apps/web`, `apps/admin`, `apps/api`, and `apps/mobile`.
- [x] Installed dependencies and verified scaffold with build/lint.
- [x] Started local web/admin/API dev servers during earlier work.
- [x] Fixed `View chapter` navigation and added pilot chapter routes.
- [x] Fixed stale Next.js `.next` cache runtime error.
- [x] Upgraded student web UI from basic scaffold to a more premium dashboard-style experience.
- [x] Prepared Supabase + Vercel deployment docs in `docs/deployment.md`.
- [x] Added initial Prisma/Supabase migration with RLS enabled.
- [x] Switched video platform plan from Mux to Bunny Stream for MVP cost control.
- [x] Added Bunny-focused video metadata fields to the Prisma schema and migration.
- [x] Added Bunny env templates and `docs/video-platform.md`.
- [x] Built first HyperFrames prototype video: "What are prime numbers?"
- [x] Generated ElevenLabs voiceover and rendered the voiced prototype MP4.

## Launch And Infrastructure

- [ ] Create Supabase project in a region close to the chosen Vercel region.
- [ ] Create a dedicated Prisma/database role instead of using broad dashboard credentials in app runtimes.
- [ ] Configure local `apps/api/.env` with Supabase transaction pooler and direct/session migration URLs.
- [ ] Run `npm run prisma:generate -w apps/api`.
- [ ] Run `npm run prisma:migrate:deploy -w apps/api`.
- [ ] Verify Supabase tables, enums, indexes, and RLS are created correctly.
- [ ] Create Vercel project for `apps/api` with root directory `apps/api`.
- [ ] Create Vercel project for `apps/web` with root directory `apps/web`.
- [ ] Create Vercel project for `apps/admin` with root directory `apps/admin`.
- [ ] Configure `NEXT_PUBLIC_API_BASE_URL` for student and admin apps.
- [ ] Configure `CORS_ORIGIN` for production web/admin origins.
- [ ] Verify `https://<api-project>.vercel.app/health`.
- [ ] Verify `https://<api-project>.vercel.app/v1/catalog/pilot`.
- [ ] Add custom domains after preview deployments pass.
- [ ] Decide staging vs production environment naming and variable separation.
- [ ] Add basic deployment smoke-test checklist to future release process.

## Bunny Stream And Video Delivery

- [ ] Create Bunny Stream video library.
- [ ] Configure `BUNNY_STREAM_LIBRARY_ID` in the Vercel API project.
- [ ] Configure `BUNNY_STREAM_API_KEY` in the Vercel API project only.
- [ ] Configure `BUNNY_STREAM_CDN_HOSTNAME`.
- [ ] Configure `BUNNY_STREAM_TOKEN_AUTH_KEY`.
- [x] Implement server-side Bunny upload flow or admin upload helper.
- [x] Store returned Bunny library/video IDs in `Video.providerLibraryId` and `Video.providerVideoId`.
- [x] Generate HLS playback URLs with `playlist.m3u8`.
- [ ] Replace login-only premium gate with real subscription entitlement checks.
- [x] Add short-lived token-authenticated playback URL generation.
- [ ] Keep DRM off for MVP; revisit only when paid offline downloads or licensing require it.
- [ ] Monitor Bunny bandwidth and storage weekly after launch.
- [ ] Avoid autoplay on catalog pages to control bandwidth.
- [ ] Store thumbnails, notes PDFs, diagrams, and generated assets outside Postgres.

## Master Video Archive And Distribution

- [x] Choose storage for master MP4/source renders: Cloudflare R2, Bunny Storage, S3, or Supabase Storage.
- [x] Keep master MP4 files outside Git and outside Bunny Stream as the only copy.
- [x] Define folder/naming convention for scripts, source files, renders, narration, captions, and thumbnails.
- [ ] Add metadata for master render location to the content workflow.
- [ ] Add a future `VideoPublication` model for YouTube and other distribution channels.
- [ ] Start with manual YouTube uploads if needed.
- [ ] Later automate YouTube uploads through the YouTube Data API after Google project verification.
- [ ] Publish only original videos using owned/licensed script, voice, music, SFX, diagrams, and animation assets.

## Content Protection And Copyright

- [ ] Finalize brand name before permanent watermarking.
- [ ] Add baked brand watermark to rendered lesson videos.
- [ ] Use subtle watermark placement: top-right, 5-8% width, 35-50% opacity.
- [ ] Ensure watermark never covers formulas, diagrams, captions, or important lesson text.
- [ ] Add branded intro/outro template for videos.
- [ ] Add dynamic user watermark overlay for premium playback.
- [ ] Include user email/id/phone suffix in dynamic overlay, with privacy-safe formatting.
- [ ] Move dynamic overlay slightly every few minutes to discourage screen recordings.
- [ ] Keep Bunny API and token keys server-only.
- [ ] Enable allowed-domain or token-authenticated playback for premium content.
- [ ] Avoid raw public MP4 links for premium lessons.
- [ ] Keep ownership evidence: scripts, source files, rendered dates, voice files, music/SFX licenses, font licenses, stock licenses.
- [ ] Add contractor/voice/animation IP assignment checklist before outsourcing any content.
- [ ] Use YouTube Copyright Match Tool once a channel exists.
- [ ] Consider formal copyright registration for flagship/high-value videos.

## Product Features

- [ ] Implement real auth for students, admins, teacher/reviewers, and support users.
- [ ] Add user profiles with class level, name, preferred language, and theme preference.
- [ ] Replace hardcoded pilot catalog with database-backed subject/chapter/topic/lesson APIs.
- [x] Implement course catalog pages for Mathematics and Science.
- [ ] Implement chapter pages backed by API data.
- [ ] Implement lesson page with video player, notes, examples, practice, quiz CTA, and next lesson.
- [ ] Implement free vs premium access gating.
- [ ] Add notes rendering with concept summary, key terms, formulas, diagrams, examples, mistakes, revision bullets, and board tips.
- [ ] Add quiz engine for practice quizzes and chapter tests.
- [ ] Add quiz attempts, answers, scoring, explanations, and weak-topic suggestions.
- [ ] Add progress event tracking for video, notes, quizzes, practice, revision, and downloads.
- [ ] Materialize lesson progress and topic/chapter mastery.
- [ ] Implement mastery labels: needs work, improving, good, strong.
- [ ] Implement student dashboard with streak, weekly study time, subject progress, chapter mastery, weak topics, revision, quiz trends, completed lessons, and next lesson.
- [ ] Implement dark mode preference: system, light, dark.
- [ ] Add responsive and accessible UI checks for student flows.

## Gamification And Engagement

- [ ] Track daily study streaks.
- [ ] Award XP for videos, quizzes, notes, practice, and revision.
- [ ] Award badges for chapter completion and strong quiz performance.
- [ ] Add weekly study goals.
- [ ] Add one streak recovery token per month.
- [ ] Add streak freeze reward later if useful.
- [ ] Add reminder/streak-warning notifications after core learning flows work.
- [ ] Avoid leaderboard in MVP unless validated.

## Subscriptions And Payments

- [ ] Define one-year subscription plan and pricing.
- [ ] Implement Razorpay Subscriptions for web.
- [ ] Add Razorpay webhook handling.
- [ ] Make payment webhook processing idempotent.
- [ ] Sync paid status into backend entitlements.
- [ ] Enforce entitlement expiry and renewal behavior.
- [ ] Add subscription status page for students.
- [ ] Plan Google Play Billing for Android subscriptions.
- [ ] Plan Apple In-App Purchase subscriptions for iOS.
- [ ] Keep backend entitlement table as source of truth across providers.

## Admin CMS

- [x] Implement admin authentication and role checks.
- [ ] Build admin dashboard with content counts, draft lessons, published lessons, quiz attempts summary, and video processing status.
- [ ] Build content manager for subjects, chapters, topics, and lessons.
- [ ] Build lesson editor with title, description, free/premium flag, Bunny video reference, notes, key points, examples, practice questions, and quiz association.
- [ ] Build quiz editor with question types, options, correct answers, explanations, difficulty, and topic mapping.
- [ ] Add teacher/reviewer workflow: draft, review, approve, publish, archive.
- [ ] Add content audit logs for create/update/review/publish/archive.
- [ ] Add admin preview of lesson page before publishing.
- [ ] Add basic aggregate analytics for student engagement.

## Mobile And Offline

- [ ] Turn `apps/mobile` placeholder into real Flutter app scaffold.
- [ ] Mirror web theme tokens into Flutter.
- [ ] Implement mobile auth and catalog browsing.
- [ ] Implement lesson playback on mobile.
- [ ] Implement offline metadata model for lessons, notes, quizzes, and downloads.
- [ ] Queue local progress events while offline.
- [ ] Sync progress events after reconnect.
- [ ] Expire downloaded lessons when subscription ends or license expires.
- [ ] Add mobile downloads only after streaming, auth, and entitlements are stable.
- [ ] Revisit DRM for paid offline video downloads after MVP validation.

## Content Production Pipeline

- [x] Use HyperFrames as the main video engine for code-generated lesson videos.
- [ ] Use Manim when precise math animation is needed.
- [ ] Use GSAP/CSS/SVG for whiteboard strokes, diagrams, arrows, number grids, and motion timelines.
- [ ] Use Three.js for physics/science simulations where 3D helps.
- [x] Use ElevenLabs for narration, keeping the API key server-only.
- [x] Generate word-level captions from narration.
- [ ] Add reusable video template with intro, outro, watermark, captions, and quiz prompt.
- [ ] Convert the prime-numbers prototype into a reusable production template.
- [ ] Create a complete "Real Numbers" pilot lesson sequence.
- [x] Create a complete "Chemical Reactions and Equations" pilot lesson sequence.
- [ ] Create a complete "Two Stories about Flying" pilot lesson sequence.
- [ ] For each pilot chapter, produce 5-8 topic videos.
- [ ] For each pilot topic, produce notes and 10-20 quiz questions.
- [ ] Add NCERT exercise mapping for each pilot chapter.
- [ ] Add one chapter test per pilot chapter.
- [ ] Validate video readability, caption timing, contrast, and layout before upload.

## Data Model And API Gaps

- [ ] Add missing Prisma relations/models for examples, practice questions, quiz questions, quiz options, quiz attempts, quiz answers, entitlements, payments, payment webhook events, lesson progress, topic mastery, chapter mastery, streaks, XP transactions, badges, user badges, offline downloads, devices, and content audit logs.
- [ ] Add seed script for pilot subjects, chapters, topics, lessons, and sample quizzes.
- [ ] Add API routes for catalog, lessons, notes, quizzes, progress, mastery, subscriptions, and admin content.
- [ ] Add request validation and error response conventions.
- [ ] Add auth middleware and role-based access control.
- [ ] Add entitlement middleware for premium content.
- [ ] Add database tests or focused API integration tests once routes exist.
- [ ] Decide whether to keep Express or migrate to NestJS when feature modules grow.

## Developer Environment And Repo Hygiene

- [ ] Fix local Codex/Linux sandbox setup by installing/configuring `bubblewrap` and user namespace support.
- [x] Add `.gitignore` entries for generated video render/cache directories if needed.
- [ ] Confirm large generated assets are not committed unless intentionally kept.
- [ ] Decide whether rendered prototype MP4s should stay in Git or move to external storage.
- [ ] Add root convenience scripts for Prisma if useful.
- [ ] Add CI checks for `npm run lint` and `npm run build`.
- [ ] Keep env examples up to date as features are added.
- [x] Retire committed Graphify output and mandatory refresh hooks; keep optional local output ignored.

## Open Questions

- [x] Final brand name: `ChapterReady`, presented to customers as `ChapterReady for CBSE Class 10`.
- [ ] Which master asset storage should be used: Cloudflare R2, Bunny Storage, S3, or Supabase Storage?
- [ ] What is the initial subscription price for the one-year plan?
- [ ] Which language should the first content ship in: English, Hindi, Hinglish, or multiple tracks?
- [ ] Should web launch first, or should Flutter mobile be brought forward before public launch?
- [ ] Should first public YouTube videos be free full lessons, teasers, Shorts, or selected concept clips?
- [ ] What level of DRM/content protection is acceptable for MVP cost and complexity?
