-- CreateEnum
CREATE TYPE "MasteryLevel" AS ENUM ('learner', 'skilled', 'exam_ready', 'topper_track');

-- CreateEnum
CREATE TYPE "RevisionMissionStatus" AS ENUM ('active', 'completed', 'expired');

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "topicId" TEXT,
    "quizId" TEXT,
    "scorePercent" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "weakTopicSlugs" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "attemptNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterMastery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "masteryScore" INTEGER NOT NULL DEFAULT 0,
    "level" "MasteryLevel" NOT NULL DEFAULT 'learner',
    "videoCompletionPercent" INTEGER NOT NULL DEFAULT 0,
    "bestQuizScorePercent" INTEGER NOT NULL DEFAULT 0,
    "lastActivityAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterMastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionMission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "topicId" TEXT,
    "status" "RevisionMissionStatus" NOT NULL DEFAULT 'active',
    "reason" TEXT NOT NULL,
    "targetScore" INTEGER NOT NULL DEFAULT 60,
    "recommendedSteps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevisionMission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_chapterId_createdAt_idx" ON "QuizAttempt"("userId", "chapterId", "createdAt");

-- CreateIndex
CREATE INDEX "QuizAttempt_chapterId_scorePercent_idx" ON "QuizAttempt"("chapterId", "scorePercent");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_createdAt_idx" ON "QuizAttempt"("quizId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterMastery_userId_chapterId_key" ON "ChapterMastery"("userId", "chapterId");

-- CreateIndex
CREATE INDEX "ChapterMastery_userId_level_updatedAt_idx" ON "ChapterMastery"("userId", "level", "updatedAt");

-- CreateIndex
CREATE INDEX "ChapterMastery_chapterId_masteryScore_idx" ON "ChapterMastery"("chapterId", "masteryScore");

-- CreateIndex
CREATE INDEX "RevisionMission_userId_status_updatedAt_idx" ON "RevisionMission"("userId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "RevisionMission_chapterId_status_idx" ON "RevisionMission"("chapterId", "status");

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterMastery" ADD CONSTRAINT "ChapterMastery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterMastery" ADD CONSTRAINT "ChapterMastery_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionMission" ADD CONSTRAINT "RevisionMission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionMission" ADD CONSTRAINT "RevisionMission_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionMission" ADD CONSTRAINT "RevisionMission_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Supabase public schema hardening for user-specific mastery tables.
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChapterMastery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RevisionMission" ENABLE ROW LEVEL SECURITY;
