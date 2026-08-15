---
type: DecisionNote
title: RAG Corpus for Tara-Firefly AI Tutor
description: Sources, chunking strategy, embedding model, and retrieval settings for the AI Tutor retrieval system.
tags: ['rag', 'tutor', 'ai', 'content']
timestamp: 2026-08-15T12:00:00Z
---

# RAG Corpus — Tara-Firefly AI Tutor

Decision record for the retrieval system that powers the AI Tutor. The tutor must
answer from the platform's own NCERT-faithful content (one source of truth) — it
may not invent definitions, examples, or exam guidance.

## Sources (in priority order)

1. **Chapter packs** — `apps/web/lib/chapter-packs.generated.ts`
   (`docs/content/class-10/**/chapter-pack.md`). These are the reviewed,
   NCERT-aligned chapter notes across Maths, Science, English, Hindi, and
   Social Science. This is the primary corpus.
2. **Lesson notes** — `apps/web/content/**/lessons/*.md`. Deeper per-topic
   notes. Included as secondary source; chapter packs win on topic overlap.
3. **Excluded**: `quiz.md` files (test content must not leak into tutor
   answers), `board-exam-evidence.md`/`source-fidelity-tracker.md` (internal
   audit documents), and any file marked `status: draft` is still included but
   ranked lower by a `sourceRank` field (chapter packs rank 0, lessons rank 1).

## Chunking strategy

- Split each document on markdown headings (`#`, `##`, `###`). Each section
  becomes one chunk.
- Target chunk size: 300–600 words. Oversized sections are split at paragraph
  boundaries with a 2-sentence overlap.
- Undersized sections are merged with the next sibling until ≥ 150 words.
- Metadata on every chunk: `subject`, `chapterSlug`, `sectionTitle` (heading
  path), `sourcePath`, `sourceRank`, `contentHash`.
- Frontmatter is stripped; `[[demo:...]]` tokens and image links are removed.

## Embedding

- Model: `GEMINI_EMBEDDING_MODEL` (default `gemini-embedding-001`, **3072 dims** — verified against the live API).
- Batched 100 chunks per API call, with backoff/resume so the build script can
  be re-run safely. Chunks whose `contentHash` is unchanged are skipped
  (incremental rebuild).

## Retrieval

- Embed the user query with the same model; cosine similarity over `RagChunk`.
- top-k = 6; if no chunk scores ≥ 0.35, the tutor answers with a "not in my
  notes" refusal instead of guessing (keeps the NCERT-only promise honest).
- If the `pgvector` extension is unavailable, fall back to in-app cosine over
  the chunk table (~3k rows — still fast).

## Answer grounding contract

- The Gemini prompt receives retrieved chunks tagged `[source: <chapter>, <section>]`.
- The model must answer only from those chunks plus its Class 10 NCERT
  knowledge; it must return `citedChunkIds` for claims it used.
- Unsupported claims force `refused: true` with a friendly fallback line.
