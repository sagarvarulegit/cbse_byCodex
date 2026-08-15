-- CreateTable
CREATE TABLE "ExamPaperAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examPaperId" TEXT NOT NULL,
    "clientAttemptId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "earnedMarks" INTEGER NOT NULL,
    "mcqCorrect" INTEGER NOT NULL,
    "mcqTotal" INTEGER NOT NULL,
    "writtenSelfMarked" BOOLEAN NOT NULL DEFAULT false,
    "questionResults" JSONB,
    "weakChapterSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "weakQuestionTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamPaperAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamPaperAttempt_userId_createdAt_idx" ON "ExamPaperAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ExamPaperAttempt_examPaperId_createdAt_idx" ON "ExamPaperAttempt"("examPaperId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPaperAttempt_userId_examPaperId_attemptNumber_key" ON "ExamPaperAttempt"("userId", "examPaperId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPaperAttempt_userId_clientAttemptId_key" ON "ExamPaperAttempt"("userId", "clientAttemptId");

-- AddForeignKey
ALTER TABLE "ExamPaperAttempt" ADD CONSTRAINT "ExamPaperAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperAttempt" ADD CONSTRAINT "ExamPaperAttempt_examPaperId_fkey" FOREIGN KEY ("examPaperId") REFERENCES "ExamPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- User-specific attempt records are only accessed through the server.
ALTER TABLE "ExamPaperAttempt" ENABLE ROW LEVEL SECURITY;
