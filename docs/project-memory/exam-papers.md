---
type: ProjectMemoryTopic
title: Sample Test Papers Memory
description: Durable question-bank, paper-generation, blueprint-snapshot, and AI-verification learnings for the Sample Test Exam Paper Generator.
tags: ['memory', 'exam-papers', 'question-bank', 'blueprint', 'gemini']
timestamp: 2026-08-15T00:00:00Z
---

# Sample Test Papers Memory

Read this file for the multi-subject sample-test-paper generator (Maths 041, Science 086, Social Science 087, and English 184): question bank,
paper assembly, the curriculum snapshot, mock test series, and Gemini verification.

## Blueprint snapshot (single source of truth)

- The web curriculum registries (`apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts`, `science.ts`, `social-science.ts`, and `english-language-and-literature.ts`) are the source of truth. `npm run exam:snapshot` (repo root) regenerates `apps/api/src/lib/exam-papers/maths-041-blueprint.generated.ts`, `science-086-blueprint.generated.ts`, `social-science-087-blueprint.generated.ts`, and `english-184-blueprint.generated.ts`; `apps/web/lib/exam-curriculum-snapshot.test.ts` fails on drift. Never edit the generated files by hand.
- Only subjects with `examProfile.blueprintStatus === 'ready'` can generate papers (currently Mathematics Standard 041, Science 086, Social Science 087, and English 184). Hindi/AI stay blocked until their official blueprints and question banks are ready.

## Paper layouts and assembly

- `apps/api/src/lib/exam-papers/layout.ts` encodes official subject designs:
  - **Maths Standard (041)**: A: 20×1 MCQ, B: 5×2 VSA, C: 6×3 SA, D: 4×5 LA, E: 3×4 Case Study = 38 Qs, 80 marks, 180 min + 15 min reading.
  - **Science (086)**: A: 20×1 MCQ, B: 6×2 VSA, C: 7×3 SA, D: 3×5 LA, E: 3×4 Case Study = 39 Qs, 80 marks, 180 min + 15 min reading.
  - **Social Science (087)**: A: 20×1 MCQ, B: 4×2 VSA, C: 5×3 SA, D: 4×5 LA, E: 3×4 Case Study, F: 1×5 Map Skill = 37 Qs, 80 marks, 180 min + 15 min reading.
  - **English Language & Literature (184)**: A: 20×1 Objective/Grammar, B: 4×5 Writing/Extracts, C: 6×3 Literature SA, D: 2×6 Literature LA, E: 2×5 Reading Passages = 34 Qs, 80 marks, 180 min + 15 min reading.
- The demand plan (`demand.ts`) is generalized and subject-agnostic: Section-specific candidate unit filtering and Section A buffer distribution across all board paper layouts. Hard invariants: every unit hits its exact weightage, section counts match, and no excluded topic appears.
- `assemblePaper` is pure: same seed + same verified bank = same paper. Variety comes from seeded selection order and numeric variants. It throws `PaperAssemblyError` instead of returning an invalid paper (insufficient pool, over-allocation, non-sequential numbering).
- Excluded topics can never appear; the bank validator rejects them at seed time and the assembler asserts their absence.

## Question bank

- `npm run seed:bank -w apps/api` validates and upserts `maths-041-seed.ts` (88 Qs), `science-086-seed.ts` (66 Qs), `social-science-087-seed.ts` (70 Qs), and `english-184-seed.ts` (59 Qs) into `QuestionBankQuestion` (283 Qs total). Rows start in `review` (use `SEED_BANK_AS_VERIFIED=1` for local dev); only `verified` rows enter papers. `seed:bank:validate` is the no-DB CI check; `seed:bank:analyze` prints the fixed demand plan vs pool sizes to find under-supplied (unit, section) combinations.
- All seed questions are `board_style` (platform-authored original board-pattern questions). Never label a bank question `verified_pyq` without year/paperCode/questionNo/page provenance and the board-exam-evidence verification gates.

## AI verification (advisory, never auto-publish)

- `verify.ts` calls the Gemini REST `generateContent` endpoint (JSON output mode) via plain fetch — no SDK dependency. `GEMINI_API_KEY` / `GEMINI_MODEL` are server-only; without a key, papers are persisted `unverified` for manual review.
- Verdicts are per-question + paper-level (`pass | flag | fail`). Only a clean `pass` marks a paper `verified`; anything else lands in the admin review queue. Human approve is the only path to `publishStatus: published`.
- The verifier re-computes every answer and enforces the Class 10 NCERT scope; treat AI as a flagging layer, not proof — the same provenance discipline as published PYQs still applies.

## Endpoints and UI

- Student: `POST /v1/exam-papers/generate` (with `subjectSlug`), `GET /v1/exam-papers/series?subjectSlug=...`, `GET /v1/exam-papers`, `GET /v1/exam-papers/:id`, `POST /v1/exam-papers/:id/attempt`, `GET /v1/exam-papers/attempts`.
- Payments: `GET /v1/payments/products`, `GET /v1/payments/entitlements`, `POST /v1/payments/create-order`, `POST /v1/payments/verify`, `POST /v1/payments/webhook`.
- Admin: `/v1/admin/exam-papers/review`, `/:id/approve|reject`, `/bank`, `/bank/:id/verify|approve|reject`.
- Web: `/exam-papers` (subject tabs for mock series + generator + recent list for Maths 041, Science 086, Social Science 087, English 184) and `/exam-papers/[id]` (printable, answer-key toggle), `/exam-papers/[id]/take` (live CBT practice), `/exam-papers/attempts` (analytics).

## Commercial Monetization & Paywall Gating

- **The Gating Rule**: Paper 1 of every published Mock Test Series is 100% Free Forever (top-of-funnel lead magnet). Papers 2–5 require an active user entitlement.
- **Packs & Pricing**:
  - `cbse10-all-subjects-mock-pack`: ₹199 (All 20 full-length papers across 4 subjects).
  - `cbse10-mock-pass-<subjectSlug>`: ₹99 (5 full-length papers for a single subject).
- **Backend Access Control**: `checkMockPaperAccess` in `apps/api/src/lib/payments/entitlements.ts` gates `GET /v1/exam-papers/:id` and `POST /v1/exam-papers/:id/attempt` returning 403 `PAYWALL_LOCKED` when unauthorized.
- **Payment Verification**: HMAC SHA-256 validation on `/v1/payments/verify` with instant database transaction activating `UserEntitlement` + `PaymentOrder`. Webhook listener handles asynchronous captures.


