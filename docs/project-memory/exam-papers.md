---
type: ProjectMemoryTopic
title: Sample Test Papers Memory
description: Durable question-bank, paper-generation, blueprint-snapshot, and AI-verification learnings for the Sample Test Exam Paper Generator.
tags: ['memory', 'exam-papers', 'question-bank', 'blueprint', 'gemini']
timestamp: 2026-08-15T00:00:00Z
---

# Sample Test Papers Memory

Read this file for the Maths 041 sample-test-paper generator: question bank,
paper assembly, the curriculum snapshot, and Gemini verification.

## Blueprint snapshot (single source of truth)

- The web curriculum registry (`apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts`) is the source of truth. `npm run exam:snapshot` (repo root) regenerates `apps/api/src/lib/exam-papers/maths-041-blueprint.generated.ts`; `apps/web/lib/exam-curriculum-snapshot.test.ts` fails on drift. Never edit the generated file by hand.
- Only subjects with `examProfile.blueprintStatus === 'ready'` can generate papers (currently Mathematics 041). Science/English/Hindi stay blocked until their 2026-27 blueprint evidence is verified.

## Paper layout and assembly

- `apps/api/src/lib/exam-papers/layout.ts` encodes the official design: A: 20×1 MCQ, B: 5×2, C: 6×3, D: 4×5, E: 3×4 case-study = 80 marks, 180 min + 15 min reading, numbering Q1-38. It is sourced to `cbse-mathematics-041-2026-27` and must be re-verified against the newest official SQP before each session.
- The demand plan (`demand.ts`) is seed-independent: Hamilton largest-remainder allocation over unit weights, Section E restricted to units that own case-study questions, a repair pass for negative MCQ buffers, and a balancing pass toward proportional MCQ targets. Hard invariants: every unit hits its exact weightage, section counts match, and no excluded topic appears.
- `assemblePaper` is pure: same seed + same verified bank = same paper. Variety comes from seeded selection order and numeric variants. It throws `PaperAssemblyError` instead of returning an invalid paper (insufficient pool, over-allocation, non-sequential numbering).
- Excluded topics (Euclid lemma, decimal expansions, polynomial division, cross-multiplication, completing the square, coordinate-triangle area, frustum, ogive) can never appear; the bank validator rejects them at seed time and the assembler asserts their absence.

## Question bank

- `npm run seed:bank -w apps/api` upserts `apps/api/src/lib/exam-papers/seed/maths-041-seed.ts` into `QuestionBankQuestion`. Rows start in `review` (use `SEED_BANK_AS_VERIFIED=1` for local dev); only `verified` rows enter papers. `seed:bank:validate` is the no-DB CI check; `seed:bank:analyze` prints the fixed demand plan vs pool sizes to find under-supplied (unit, section) combinations.
- All seed questions are `board_style` (platform-authored original board-pattern questions). Never label a bank question `verified_pyq` without year/paperCode/questionNo/page provenance and the board-exam-evidence verification gates.
- The 67-question starter bank (seeds 1..50 verified in tests) is the v1 capacity; "unlimited" variety is bounded by bank size — growing the seed file is the scaling lever, not code.

## AI verification (advisory, never auto-publish)

- `verify.ts` calls the Gemini REST `generateContent` endpoint (JSON output mode) via plain fetch — no SDK dependency. `GEMINI_API_KEY` / `GEMINI_MODEL` are server-only; without a key, papers are persisted `unverified` for manual review.
- Verdicts are per-question + paper-level (`pass | flag | fail`). Only a clean `pass` marks a paper `verified`; anything else lands in the admin review queue. Human approve is the only path to `publishStatus: published`.
- The verifier re-computes every answer and enforces the Class 10 NCERT scope; treat AI as a flagging layer, not proof — the same provenance discipline as published PYQs still applies.

## Endpoints and UI

- Student: `POST /v1/exam-papers/generate` (assemble → verify → persist `ExamPaper` + `ExamPaperQuestion`), `GET /v1/exam-papers`, `GET /v1/exam-papers/:id` (owner/admin).
- Admin: `/v1/admin/exam-papers/review`, `/:id/approve|reject`, `/bank`, `/bank/:id/verify|approve|reject`.
- Web: `/exam-papers` (generate + recent list) and `/exam-papers/[id]` (printable, answer-key toggle). Subject pages show the generator link only for blueprint-ready subjects.

## Deferred

- Online attempt + auto-marking (Phase 6): `ExamPaperAttempt` model, `/v1/progress/exam-paper`, objective auto-marking + subjective self-check, wired into mastery/mistake-review only after explicit reviewed-readiness rules.
