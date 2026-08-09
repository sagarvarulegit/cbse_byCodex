-- CreateTable
CREATE TABLE "StudentFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "category" TEXT NOT NULL,
    "subject" TEXT,
    "chapter" TEXT,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "rating" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentFeedback_category_idx" ON "StudentFeedback"("category");

-- CreateIndex
CREATE INDEX "StudentFeedback_status_idx" ON "StudentFeedback"("status");

-- CreateIndex
CREATE INDEX "StudentFeedback_createdAt_idx" ON "StudentFeedback"("createdAt");
