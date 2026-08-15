-- Enable the pgvector extension (idempotent; already enabled manually if present).
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "RagChunk" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "chapterSlug" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "sourceRank" INTEGER NOT NULL DEFAULT 0,
    "contentHash" TEXT NOT NULL,
    "embedding" vector(768),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RagChunk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RagChunk_contentHash_key" ON "RagChunk"("contentHash");

-- CreateIndex
CREATE INDEX "RagChunk_subject_chapterSlug_idx" ON "RagChunk"("subject", "chapterSlug");

-- Corpus rows are written and read by the server only (same convention as
-- other RLS tables; the API connection role bypasses RLS as the owner).
ALTER TABLE "RagChunk" ENABLE ROW LEVEL SECURITY;
