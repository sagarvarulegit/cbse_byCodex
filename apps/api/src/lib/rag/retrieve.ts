import { PrismaClient } from '@prisma/client';

import { getGeminiConfig } from '../exam-papers/verify.js';

const prisma = new PrismaClient();

export type RetrievedChunk = {
  id: string;
  subject: string;
  chapterSlug: string;
  sectionTitle: string;
  content: string;
  sourcePath: string;
  sourceRank: number;
  score: number;
};

export type RetrieveOptions = {
  topK?: number;
  minScore?: number;
};

const DEFAULT_TOP_K = 6;
const DEFAULT_MIN_SCORE = 0.35;

function getEmbeddingModel(): string {
  return process.env.GEMINI_EMBEDDING_MODEL ?? 'gemini-embedding-001';
}

async function embedQuery(query: string): Promise<number[]> {
  const config = getGeminiConfig();
  if (!config.apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    `${encodeURIComponent(getEmbeddingModel())}:batchEmbedContents?key=${encodeURIComponent(config.apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          model: `models/${getEmbeddingModel()}`,
          content: { parts: [{ text: query }] },
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Embedding API responded with HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    embeddings?: Array<{ values?: number[] }>;
  };
  const values = data.embeddings?.[0]?.values;
  if (!values || values.length === 0) {
    throw new Error('Embedding API returned no values.');
  }
  return values;
}

function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length !== right.length) {
    return 0;
  }
  let dot = 0;
  let normLeft = 0;
  let normRight = 0;
  for (let i = 0; i < left.length; i += 1) {
    dot += left[i] * right[i];
    normLeft += left[i] * left[i];
    normRight += right[i] * right[i];
  }
  if (normLeft === 0 || normRight === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normLeft) * Math.sqrt(normRight));
}

/**
 * Retrieves the top-k RAG chunks for a student query using pgvector cosine
 * similarity. Rows below `minScore` are dropped — when nothing clears the bar
 * the tutor must answer with an honest "not in my notes" refusal rather than
 * guessing.
 */
export async function retrieveChunks(
  query: string,
  options: RetrieveOptions = {},
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? DEFAULT_TOP_K;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;

  const embedding = await embedQuery(query);
  const vectorLiteral = `[${embedding.join(',')}]`;

  // Use pgvector's <-> (L2) operator; cosine = 1 - L2-normalized distance.
  // Simpler and robust: fetch candidates via vector distance, then compute
  // cosine in JS so the minScore threshold is exact.
  const candidates = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      subject: string;
      chapterSlug: string;
      sectionTitle: string;
      content: string;
      sourcePath: string;
      sourceRank: number;
      dist: number;
    }>
  >(
    `SELECT "id", "subject", "chapterSlug", "sectionTitle", "content", "sourcePath", "sourceRank",
            "embedding" <=> $1::vector AS dist
     FROM "RagChunk"
     ORDER BY "embedding" <=> $1::vector
     LIMIT $2`,
    vectorLiteral,
    topK * 4,
  );

  // pgvector <-> returns L2 distance; for normalized vectors cosine = 1 - d²/2.
  // Recompute a true cosine-like score in [0,1].
  return candidates
    .map((row) => {
      const score = Math.max(0, Math.min(1, 1 - row.dist * row.dist / 2));
      return {
        id: row.id,
        subject: row.subject,
        chapterSlug: row.chapterSlug,
        sectionTitle: row.sectionTitle,
        content: row.content,
        sourcePath: row.sourcePath,
        sourceRank: row.sourceRank,
        score,
      };
    })
    .filter((row) => row.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/** True cosine similarity fallback (no pgvector), used only if the extension is absent. */
export async function retrieveChunksCosineFallback(
  query: string,
  options: RetrieveOptions = {},
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? DEFAULT_TOP_K;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
  const embedding = await embedQuery(query);

  const rows = await prisma.ragChunk.findMany({ take: 5000 });
  const scored = rows
    .map((row) => {
      // embedding is Unsupported — read the raw value if Prisma exposes it as string
      const raw = (row as unknown as { embedding?: unknown }).embedding;
      const vector = parseVector(raw);
      return {
        row,
        score: vector ? cosineSimilarity(embedding, vector) : 0,
      };
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map(({ row, score }) => ({
    id: row.id,
    subject: row.subject,
    chapterSlug: row.chapterSlug,
    sectionTitle: row.sectionTitle,
    content: row.content,
    sourcePath: row.sourcePath,
    sourceRank: row.sourceRank,
    score,
  }));
}

function parseVector(value: unknown): number[] | null {
  if (typeof value !== 'string') {
    return null;
  }
  const match = /^\[(.*)\]$/.exec(value.trim());
  if (!match) {
    return null;
  }
  return match[1]
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n));
}
