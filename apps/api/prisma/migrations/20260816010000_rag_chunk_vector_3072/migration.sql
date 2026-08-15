-- gemini-embedding-001 returns 3072 dimensions (not 768). Resize the column;
-- the table is empty at this point so the ALTER is safe.
ALTER TABLE "RagChunk" ALTER COLUMN "embedding" TYPE vector(3072);
