# CBSE Learning Portal Backend API (@cbse/api)

## Overview
Express.js REST backend service powering the ChapterReady platform. Provides student authentication, session verification, curriculum catalog querying, Bunny.net video signed streaming, student practice/quiz progress tracking, mistake review, exam paper generation and grading, Cashfree/Razorpay payment webhooks, and the Tara AI Socratic tutor with pgvector RAG.

## Interface
- Application Entry Point: [`src/app.ts`](src/app.ts) / [`src/main.ts`](src/main.ts)
- API Routes:
  - `/v1/auth`: [`src/routes/auth.ts`](src/routes/auth.ts) - Registration, login, session cookies, and guardian consent
  - `/v1/auth/recovery`: [`src/routes/recovery.ts`](src/routes/recovery.ts) - Account recovery and password reset tokens
  - `/v1/catalog`: [`src/routes/catalog.ts`](src/routes/catalog.ts) - Subjects, chapters, and lesson metadata retrieval
  - `/v1/lessons`: [`src/routes/video.ts`](src/routes/video.ts) - Video delivery and Bunny.net stream authorization
  - `/v1/progress`: [`src/routes/progress.ts`](src/routes/progress.ts) - Quiz attempts, written practice, streaks, and mastery ladder
  - `/v1/tutor`: [`src/routes/tutor.ts`](src/routes/tutor.ts), [`src/routes/tutor-chat.ts`](src/routes/tutor-chat.ts) - Tara AI Socratic conversation sessions and messaging
  - `/v1/evaluator`: [`src/routes/evaluator.ts`](src/routes/evaluator.ts) - AI written answer evaluator with CBSE step rubrics
  - `/v1/exam-papers`: [`src/routes/exam-papers.ts`](src/routes/exam-papers.ts) - Mock exam generation, attempts, and scoring
  - `/v1/payments`: [`src/routes/payments.ts`](src/routes/payments.ts) - Cashfree/Razorpay UPI orders and webhook listeners
  - `/v1/feedback`: [`src/routes/feedback.ts`](src/routes/feedback.ts) - Student feedback and issue reporting
- Core Service Libraries:
  - [`src/lib/auth.ts`](src/lib/auth.ts): `hashPassword`, `comparePassword`, `signAuthToken`, `verifyAuthToken`
  - [`src/lib/access.ts`](src/lib/access.ts): `hasActiveEntitlement`, `assertEntitledAccess`
  - [`src/lib/session.ts`](src/lib/session.ts): `authenticateStudentSession`
  - [`src/lib/bunny.ts`](src/lib/bunny.ts): `createDirectVideoUploadUrl`, `getVideoEncodingStatus`
- Child Subsystems:
  - Database Layer: [Database (Prisma)](./prisma/README.md) - Prisma schema, database migrations, and seeder

## Invariants
- Multi-table progress transactions in `src/routes/progress.ts` must declare explicit timeouts (`maxWait: 10000`, `timeout: 15000`) to prevent interactive transaction deadlocks.
- Student authentication tokens (`cbse_student_session`) must be validated against `User` table; expired or invalidated tokens return HTTP 401.
- All CBSE Class 10 mock test papers (Papers 1..5 across all subjects) must be returned as 100% free with no entitlement gate.

## Side Effects
- Mutates PostgreSQL database records via Prisma client.
- Initiates UPI payment orders with Cashfree and Razorpay APIs.
- Queries Google Gemini API for Socratic tutor responses and written question evaluations.
- Generates speech audio via ElevenLabs TTS API (`eleven_turbo_v2_5`).

## Verification
- Run: `cd apps/api && npm test`
