import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RawChunk = {
  subject: string;
  chapterSlug: string;
  sectionTitle: string;
  content: string;
  sourcePath: string;
  sourceRank: number;
};

// Resolve the repository root relative to the API workspace. The build script
// runs from apps/api (tsx), so two levels up is the repo root.
const REPO_ROOT = path.resolve(process.cwd(), '..', '..');
const DOCS_CONTENT_DIR = path.join(REPO_ROOT, 'docs', 'content', 'class-10');
const WEB_CONTENT_DIR = path.join(REPO_ROOT, 'apps', 'web', 'content');

const EMBEDDING_DIMENSIONS = 3072;
const MIN_CHUNK_WORDS = 150;
const MAX_CHUNK_WORDS = 600;
const BATCH_SIZE = 100;

function getEmbeddingModel(): string {
  return process.env.GEMINI_EMBEDDING_MODEL ?? 'gemini-embedding-001';
}

function getGeminiKey(): string | null {
  return process.env.GEMINI_API_KEY ?? null;
}

// ── Document loading ─────────────────────────────────────────────────────────

function stripFrontmatter(source: string): string {
  if (!source.startsWith('---')) {
    return source;
  }
  const end = source.indexOf('\n---', 3);
  if (end === -1) {
    return source;
  }
  return source.slice(end + 4).trim();
}

function cleanContent(source: string): string {
  return source
    .replace(/\[\[demo:[^\]]+\]\]/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Split markdown into heading sections; returns [heading, body] pairs. */
function splitByHeadings(markdown: string): Array<{ heading: string; body: string }> {
  const lines = markdown.split('\n');
  const sections: Array<{ heading: string; body: string }> = [];
  let currentHeading = 'Introduction';
  let currentBody: string[] = [];

  const flush = () => {
    const body = currentBody.join('\n').trim();
    if (body) {
      sections.push({ heading: currentHeading, body });
    }
  };

  for (const line of lines) {
    const headingMatch = /^(#{1,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      flush();
      currentHeading = headingMatch[2].trim();
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }
  flush();

  return sections;
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Split an oversized body into chunks at paragraph boundaries. */
function splitBody(body: string): string[] {
  const paragraphs = body.split(/\n\s*\n/).filter((p) => p.trim());
  const chunks: string[] = [];
  let buffer: string[] = [];
  let bufferWords = 0;

  const flushBuffer = () => {
    if (buffer.length > 0) {
      chunks.push(buffer.join('\n\n'));
      buffer = [];
      bufferWords = 0;
    }
  };

  for (const paragraph of paragraphs) {
    const words = wordCount(paragraph);
    if (bufferWords + words > MAX_CHUNK_WORDS && bufferWords >= MIN_CHUNK_WORDS) {
      flushBuffer();
    }
    buffer.push(paragraph);
    bufferWords += words;
  }
  flushBuffer();

  // Merge undersized chunks with the previous one.
  const merged: string[] = [];
  for (const chunk of chunks) {
    const last = merged[merged.length - 1];
    if (last && wordCount(last) < MIN_CHUNK_WORDS) {
      merged[merged.length - 1] = `${last}\n\n${chunk}`;
    } else {
      merged.push(chunk);
    }
  }
  return merged.length > 0 ? merged : [body];
}

function walkMarkdownFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walkMarkdownFiles(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.md')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function inferSubject(relativePath: string): string {
  const parts = relativePath.split(path.sep);
  const subjectIdx = parts.findIndex((p) => ['english', 'hindi', 'mathematics', 'science', 'social-science'].includes(p));
  if (subjectIdx === -1) {
    return 'General';
  }
  const map: Record<string, string> = {
    english: 'English',
    hindi: 'Hindi',
    mathematics: 'Mathematics',
    science: 'Science',
    'social-science': 'Social Science',
  };
  return map[parts[subjectIdx]] ?? 'General';
}

function chapterSlugFromPath(relativePath: string): string {
  const parts = relativePath.split(path.sep);
  // For docs/content/class-10/<subject>/<...>/chapter-pack.md use the chapter dir
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    if (parts[i] === 'class-10') {
      return parts[i + 2] ?? 'general';
    }
    if (parts[i].endsWith('.md') && i >= 1) {
      return parts[i - 1] ?? 'general';
    }
  }
  return 'general';
}

function buildChunks(): RawChunk[] {
  const rawChunks: RawChunk[] = [];

  // 1. Chapter packs under docs/content/class-10 (primary, rank 0)
  for (const file of walkMarkdownFiles(DOCS_CONTENT_DIR)) {
    if (!file.endsWith('chapter-pack.md')) {
      continue;
    }
    const raw = readFileSync(file, 'utf8');
    const markdown = cleanContent(stripFrontmatter(raw));
    const relative = path.relative(REPO_ROOT, file);
    const subject = inferSubject(relative);
    for (const section of splitByHeadings(markdown)) {
      for (const body of splitBody(section.body)) {
        rawChunks.push({
          subject,
          chapterSlug: chapterSlugFromPath(relative),
          sectionTitle: section.heading,
          content: body,
          sourcePath: relative,
          sourceRank: 0,
        });
      }
    }
  }

  // 2. Lesson notes under apps/web/content (secondary, rank 1)
  for (const chapterDir of readdirSync(WEB_CONTENT_DIR, { withFileTypes: true })) {
    if (!chapterDir.isDirectory()) {
      continue;
    }
    const lessonsDir = path.join(WEB_CONTENT_DIR, chapterDir.name, 'lessons');
    let files: string[];
    try {
      files = readdirSync(lessonsDir).filter((f) => f.endsWith('.md') && f !== 'quiz.md');
    } catch {
      continue;
    }
    for (const file of files) {
      const raw = readFileSync(path.join(lessonsDir, file), 'utf8');
      const markdown = cleanContent(stripFrontmatter(raw));
      const relative = path.relative(REPO_ROOT, path.join(lessonsDir, file));
      for (const section of splitByHeadings(markdown)) {
        for (const body of splitBody(section.body)) {
          rawChunks.push({
            subject: inferSubject(relative),
            chapterSlug: chapterDir.name,
            sectionTitle: `${file.replace(/\.md$/, '')} — ${section.heading}`,
            content: body,
            sourcePath: relative,
            sourceRank: 1,
          });
        }
      }
    }
  }

  // Merge consecutive undersized chunks so every chunk is >= MIN_CHUNK_WORDS
  // (across section boundaries within the same source document). Section titles
  // join with " | " so the retrieval metadata stays readable.
  const chunks: RawChunk[] = [];
  for (const chunk of rawChunks) {
    const last = chunks[chunks.length - 1];
    if (
      last &&
      last.sourcePath === chunk.sourcePath &&
      wordCount(last.content) < MIN_CHUNK_WORDS &&
      wordCount(`${last.content}\n\n${chunk.content}`) <= MAX_CHUNK_WORDS * 1.5
    ) {
      chunks[chunks.length - 1] = {
        ...last,
        sectionTitle: `${last.sectionTitle} | ${chunk.sectionTitle}`,
        content: `${last.content}\n\n${chunk.content}`,
      };
    } else {
      chunks.push(chunk);
    }
  }

  return chunks;
}

// ── Embedding ────────────────────────────────────────────────────────────────

async function embedBatch(texts: string[]): Promise<number[][]> {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Run with the key exported.');
  }

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    `${encodeURIComponent(getEmbeddingModel())}:batchEmbedContents?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: texts.map((content) => ({
        model: `models/${getEmbeddingModel()}`,
        content: { parts: [{ text: content }] },
      })),
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Embedding API responded with HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    embeddings?: Array<{ values?: number[] }>;
  };
  const embeddings = (data.embeddings ?? []).map((e) => e.values ?? []);
  if (embeddings.length !== texts.length) {
    throw new Error(
      `Embedding API returned ${embeddings.length} embeddings for ${texts.length} requests.`,
    );
  }
  return embeddings;
}

function contentHash(content: string, sourcePath: string): string {
  return createHash('sha256').update(`${sourcePath}\n${content}`).digest('hex');
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const chunks = buildChunks();
  console.log(`Built ${chunks.length} raw chunks.`);

  const existingHashes = new Set(
    (
      await prisma.ragChunk.findMany({
        select: { contentHash: true },
      })
    ).map((row) => row.contentHash),
  );

  const toIndex = chunks.filter(
    (chunk) => !existingHashes.has(contentHash(chunk.content, chunk.sourcePath)),
  );
  console.log(`${chunks.length - toIndex.length} unchanged (skipped), ${toIndex.length} to index.`);

  for (let offset = 0; offset < toIndex.length; offset += BATCH_SIZE) {
    const batch = toIndex.slice(offset, offset + BATCH_SIZE);
    const texts = batch.map((chunk) => chunk.content);

    let embeddings: number[][] | null = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        embeddings = await embedBatch(texts);
        break;
      } catch (error) {
        console.warn(
          `Batch ${offset / BATCH_SIZE} attempt ${attempt} failed: ${(error as Error).message}`,
        );
        if (attempt === 3) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      }
    }
    if (!embeddings) {
      throw new Error('Embedding failed after retries.');
    }

    for (let index = 0; index < batch.length; index += 1) {
      const chunk = batch[index];
      const embedding = embeddings[index];
      if (embedding.length !== EMBEDDING_DIMENSIONS) {
        console.warn(
          `Skipping ${chunk.sourcePath} (${chunk.sectionTitle}): got ${embedding.length} dims, expected ${EMBEDDING_DIMENSIONS}.`,
        );
        continue;
      }
      // RagChunk has an Unsupported("vector") column, so the generated client
      // exposes no create/upsert — insert via raw SQL with the pgvector literal.
      await prisma.$executeRawUnsafe(
        `INSERT INTO "RagChunk"
          ("id", "subject", "chapterSlug", "sectionTitle", "content", "tokenCount",
           "sourcePath", "sourceRank", "contentHash", "embedding", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector, now(), now())
         ON CONFLICT ("contentHash") DO NOTHING`,
        `chunk_${offset + index}_${contentHash(chunk.content, chunk.sourcePath).slice(0, 12)}`,
        chunk.subject,
        chunk.chapterSlug,
        chunk.sectionTitle,
        chunk.content,
        wordCount(chunk.content),
        chunk.sourcePath,
        chunk.sourceRank,
        contentHash(chunk.content, chunk.sourcePath),
        `[${embedding.join(',')}]`,
      );
    }

    console.log(`Indexed ${Math.min(offset + BATCH_SIZE, toIndex.length)}/${toIndex.length} chunks.`);
  }

  const total = await prisma.ragChunk.count();
  console.log(`Done. Total chunks in DB: ${total}.`);
}

main()
  .catch((error) => {
    console.error('RAG index build failed.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
