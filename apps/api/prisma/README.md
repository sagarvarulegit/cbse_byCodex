# CBSE Learning Portal Database (Prisma)

## Overview
PostgreSQL database schema, Prisma ORM client definition, migration history, and database seeding routines for ChapterReady. Manages data persistence for student user profiles, curriculum hierarchies (subjects, chapters, topics, lessons), video and note assets, quizzes and practice attempts, mistake review queues, board exam readiness checklists, AI tutor chat histories, pgvector RAG chunks, and payment transactions.

## Interface
- Schema: [`schema.prisma`](schema.prisma)
  - Data Models: `User`, `GuardianConsent`, `UserProfile`, `Subject`, `Chapter`, `Topic`, `Lesson`, `Video`, `Note`, `Quiz`, `QuizAttempt`, `WrittenPracticeAttempt`, `MistakeReviewItem`, `ExamPaperAttempt`, `ExamReadyChecklist`, `ChapterMastery`, `RevisionMission`, `StudyStreak`, `Badge`, `UserBadge`, `Subscription`, `ProgressEvent`, `StudentFeedback`, `QuestionBankQuestion`, `ExamPaper`, `ExamPaperQuestion`, `RagChunk`, `TutorConversation`, `TutorMessage`, `TutorAttachment`, `PaymentOrder`, `UserEntitlement`, `RefundRequest`, `AccountRecoveryToken`
  - Enumerations: `UserRole`, `AccessLevel`, `PublishStatus`, `MasteryLevel`, `RevisionMissionStatus`, `MistakeKind`, `QuestionSourceKind`, `QuestionVerificationStatus`, `ExamPaperVerificationStatus`, `PaymentOrderStatus`, `EntitlementStatus`, `RefundRequestStatus`, `RefundType`, `RecoveryTokenType`
- Seeder: [`seed.ts`](seed.ts)
  - `main()`: Database bootstrap populating default admin and student accounts, core subjects, chapters, and initial pilot curriculum catalog.

## Invariants
- Student and admin credentials must store bcrypt password hashes in `User.passwordHash`; plaintext passwords must never be stored.
- Compound unique constraints must be maintained: `@@unique([userId, chapterId])` on `ChapterMastery`, `@@unique([userId, subjectId])` on `ExamReadyChecklist`, and `@@unique([email])` on `User`.
- `RagChunk` vectors must maintain 3072 dimensions matching Google text-embedding-004 output when `pgvector` index is queried.

## Side Effects
- Prisma migrations apply DDL operations directly to the PostgreSQL schema.
- Seeding routines (`prisma/seed.ts`) insert or upsert foundational records in `User`, `Subject`, and `Chapter` tables.

## Verification
- Run: `npx prisma validate --schema=apps/api/prisma/schema.prisma`
