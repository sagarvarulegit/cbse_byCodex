-- CreateEnum
CREATE TYPE "QuestionSourceKind" AS ENUM ('ncert_exercise', 'verified_pyq', 'board_style');

-- CreateEnum
CREATE TYPE "QuestionVerificationStatus" AS ENUM ('unverified', 'review', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "ExamPaperVerificationStatus" AS ENUM ('unverified', 'review', 'verified', 'rejected');

-- CreateTable
CREATE TABLE "QuestionBankQuestion" (
    "id" TEXT NOT NULL,
    "subjectSlug" TEXT NOT NULL,
    "bankKey" TEXT NOT NULL,
    "chapterSlug" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "sourceKind" "QuestionSourceKind" NOT NULL DEFAULT 'board_style',
    "provenanceJson" JSONB,
    "variantsJson" JSONB NOT NULL,
    "verificationStatus" "QuestionVerificationStatus" NOT NULL DEFAULT 'unverified',
    "reviewNotes" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionBankQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaper" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "subjectSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "readingTimeMinutes" INTEGER NOT NULL,
    "seed" INTEGER NOT NULL,
    "layoutVersion" TEXT NOT NULL,
    "sectionsJson" JSONB NOT NULL,
    "verificationStatus" "ExamPaperVerificationStatus" NOT NULL DEFAULT 'unverified',
    "verificationJson" JSONB,
    "publishStatus" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaperQuestion" (
    "id" TEXT NOT NULL,
    "examPaperId" TEXT NOT NULL,
    "questionBankId" TEXT,
    "sectionId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "statementJson" JSONB NOT NULL,
    "answerKeyJson" JSONB NOT NULL,
    "sourceKind" TEXT NOT NULL,
    "provenanceJson" JSONB,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "verificationJson" JSONB,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "ExamPaperQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionBankQuestion_subjectSlug_bankKey_key" ON "QuestionBankQuestion"("subjectSlug", "bankKey");

-- CreateIndex
CREATE INDEX "QuestionBankQuestion_subjectSlug_verificationStatus_idx" ON "QuestionBankQuestion"("subjectSlug", "verificationStatus");

-- CreateIndex
CREATE INDEX "QuestionBankQuestion_subjectSlug_unitId_questionType_marks_idx" ON "QuestionBankQuestion"("subjectSlug", "unitId", "questionType", "marks");

-- CreateIndex
CREATE INDEX "QuestionBankQuestion_topicId_idx" ON "QuestionBankQuestion"("topicId");

-- CreateIndex
CREATE INDEX "ExamPaper_userId_createdAt_idx" ON "ExamPaper"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ExamPaper_subjectSlug_verificationStatus_idx" ON "ExamPaper"("subjectSlug", "verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPaperQuestion_examPaperId_questionNumber_key" ON "ExamPaperQuestion"("examPaperId", "questionNumber");

-- CreateIndex
CREATE INDEX "ExamPaperQuestion_examPaperId_sectionId_idx" ON "ExamPaperQuestion"("examPaperId", "sectionId");

-- AddForeignKey
ALTER TABLE "ExamPaperQuestion" ADD CONSTRAINT "ExamPaperQuestion_examPaperId_fkey" FOREIGN KEY ("examPaperId") REFERENCES "ExamPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperQuestion" ADD CONSTRAINT "ExamPaperQuestion_questionBankId_fkey" FOREIGN KEY ("questionBankId") REFERENCES "QuestionBankQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
