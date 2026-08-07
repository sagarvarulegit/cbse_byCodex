CREATE TYPE "MistakeKind" AS ENUM (
  'quiz_question',
  'weak_concept',
  'hint_used',
  'written_marking_point'
);

ALTER TABLE "QuizAttempt"
ADD COLUMN "questionResults" JSONB;

ALTER TABLE "WrittenPracticeAttempt"
ADD COLUMN "missedRubricPointIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "practiceKind" TEXT NOT NULL DEFAULT 'written_practice',
ADD COLUMN "usedHints" BOOLEAN NOT NULL DEFAULT false;

UPDATE "WrittenPracticeAttempt" AS attempt
SET "practiceKind" = event."metadata"->>'practiceKind'
FROM "ProgressEvent" AS event
WHERE event."eventType" = 'written_practice_scored'
  AND event."metadata"->>'attemptId' = attempt."id"
  AND event."metadata"->>'practiceKind' IN ('timed_diagnostic', 'written_practice', 'workbench');

CREATE TABLE "MistakeReviewItem" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "kind" "MistakeKind" NOT NULL,
  "itemKey" TEXT NOT NULL,
  "sourceItemId" TEXT,
  "lessonSlug" TEXT,
  "conceptSlug" TEXT,
  "title" TEXT NOT NULL,
  "detail" TEXT,
  "reviewHref" TEXT NOT NULL,
  "metadata" JSONB,
  "retryAt" TIMESTAMP(3) NOT NULL,
  "occurrenceCount" INTEGER NOT NULL DEFAULT 1,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MistakeReviewItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExamReadyChecklist" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "chapterId" TEXT NOT NULL,
  "conceptsStudiedConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "ncertQuestionsAttempted" BOOLEAN NOT NULL DEFAULT false,
  "weakAreasRevised" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ExamReadyChecklist_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MistakeReviewItem_userId_itemKey_key" ON "MistakeReviewItem"("userId", "itemKey");
CREATE INDEX "MistakeReviewItem_userId_resolvedAt_retryAt_idx" ON "MistakeReviewItem"("userId", "resolvedAt", "retryAt");
CREATE INDEX "MistakeReviewItem_chapterId_kind_resolvedAt_idx" ON "MistakeReviewItem"("chapterId", "kind", "resolvedAt");
CREATE UNIQUE INDEX "ExamReadyChecklist_userId_chapterId_key" ON "ExamReadyChecklist"("userId", "chapterId");
CREATE INDEX "ExamReadyChecklist_userId_updatedAt_idx" ON "ExamReadyChecklist"("userId", "updatedAt");
CREATE INDEX "ExamReadyChecklist_chapterId_updatedAt_idx" ON "ExamReadyChecklist"("chapterId", "updatedAt");

ALTER TABLE "MistakeReviewItem"
ADD CONSTRAINT "MistakeReviewItem_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MistakeReviewItem"
ADD CONSTRAINT "MistakeReviewItem_chapterId_fkey"
FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExamReadyChecklist"
ADD CONSTRAINT "ExamReadyChecklist_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExamReadyChecklist"
ADD CONSTRAINT "ExamReadyChecklist_chapterId_fkey"
FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
