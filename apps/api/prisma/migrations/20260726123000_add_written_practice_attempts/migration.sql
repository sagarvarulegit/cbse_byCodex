-- CreateTable
CREATE TABLE "WrittenPracticeAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "clientAttemptId" TEXT NOT NULL,
    "practiceItemId" TEXT NOT NULL,
    "lessonSlug" TEXT NOT NULL,
    "scoreHalfMarks" INTEGER NOT NULL,
    "maxScoreHalfMarks" INTEGER NOT NULL,
    "retentionEligible" BOOLEAN NOT NULL DEFAULT true,
    "earnedRubricPointIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "weakSkillSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "answerLength" INTEGER NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WrittenPracticeAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WrittenPracticeAttempt_userId_practiceItemId_attemptNumber_key"
ON "WrittenPracticeAttempt"("userId", "practiceItemId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WrittenPracticeAttempt_userId_clientAttemptId_key"
ON "WrittenPracticeAttempt"("userId", "clientAttemptId");

-- CreateIndex
CREATE INDEX "WrittenPracticeAttempt_userId_chapterId_createdAt_idx"
ON "WrittenPracticeAttempt"("userId", "chapterId", "createdAt");

-- CreateIndex
CREATE INDEX "WrittenPracticeAttempt_userId_practiceItemId_createdAt_idx"
ON "WrittenPracticeAttempt"("userId", "practiceItemId", "createdAt");

-- CreateIndex
CREATE INDEX "WrittenPracticeAttempt_chapterId_practiceItemId_idx"
ON "WrittenPracticeAttempt"("chapterId", "practiceItemId");

-- AddForeignKey
ALTER TABLE "WrittenPracticeAttempt"
ADD CONSTRAINT "WrittenPracticeAttempt_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WrittenPracticeAttempt"
ADD CONSTRAINT "WrittenPracticeAttempt_chapterId_fkey"
FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- User-specific attempt records are only accessed through the server.
ALTER TABLE "WrittenPracticeAttempt" ENABLE ROW LEVEL SECURITY;
