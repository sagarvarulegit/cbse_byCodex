---
type: ProjectMemoryTopic
title: Sample Test Papers Memory
description: Durable question-bank, paper-generation, blueprint-snapshot, and AI-verification learnings for the Sample Test Exam Paper Generator.
tags: ['memory', 'exam-papers', 'question-bank', 'blueprint', 'gemini']
timestamp: 2026-08-15T00:00:00Z
---

# Sample Test Papers Memory

Read this file for the multi-subject sample-test-paper generator (Maths Standard 041, Maths Basic 241, Science 086, Social Science 087, English 184, Hindi Course A 002, and Hindi Course B 085): question bank, paper assembly, the curriculum snapshot, mock test series, step-marking rubrics, and Gemini verification.

## Blueprint snapshot (single source of truth)

- The web curriculum registries (`apps/web/lib/curriculum/subjects/class-10/*.ts`) are the source of truth. `npm run exam:snapshot` (repo root) regenerates:
  - `maths-041-blueprint.generated.ts`
  - `maths-241-blueprint.generated.ts`
  - `science-086-blueprint.generated.ts`
  - `social-science-087-blueprint.generated.ts`
  - `english-184-blueprint.generated.ts`
  - `hindi-002-blueprint.generated.ts`
  - `hindi-085-blueprint.generated.ts`
  `apps/web/lib/exam-curriculum-snapshot.test.ts` fails on drift. Never edit the generated files by hand.
- All 7 core subjects are now blueprint-ready and support deterministic 5-paper mock series assembly.

## Paper layouts and assembly

- `apps/api/src/lib/exam-papers/layout.ts` encodes official subject designs:
  - **Maths Standard (041)**: A: 20×1 MCQ, B: 5×2 VSA, C: 6×3 SA, D: 4×5 LA, E: 3×4 Case Study = 38 Qs, 80 marks, 180 min.
  - **Maths Basic (241)**: A: 20×1 MCQ, B: 5×2 VSA, C: 6×3 SA, D: 4×5 LA, E: 3×4 Case Study = 38 Qs, 80 marks, 180 min (emphasizes direct formula application and core NCERT problems).
  - **Science (086)**: A: 20×1 MCQ, B: 6×2 VSA, C: 7×3 SA, D: 3×5 LA, E: 3×4 Case Study = 39 Qs, 80 marks, 180 min.
  - **Social Science (087)**: A: 20×1 MCQ, B: 4×2 VSA, C: 5×3 SA, D: 4×5 LA, E: 3×4 Case Study, F: 1×5 Map Skill = 37 Qs, 80 marks, 180 min.
  - **English Language & Literature (184)**: A: 20×1 Objective/Grammar, B: 4×5 Writing/Extracts, C: 6×3 Literature SA, D: 2×6 Literature LA, E: 2×5 Reading Passages = 34 Qs, 80 marks, 180 min.
  - **Hindi Course A (002)**: Unseen comprehension, grammar, Kshitij/Kritika literature, writing = 80 marks, 180 min.
  - **Hindi Course B (085)**: Unseen comprehension, grammar, Sparsh/Sanchayan literature, writing = 80 marks, 180 min.
- The demand plan (`demand.ts`) is generalized and subject-agnostic: Section-specific candidate unit filtering and Section A buffer distribution across all board paper layouts. Hard invariants: every unit hits its exact weightage, section counts match, and no excluded topic appears.
- `assemblePaper` is pure: same seed + same verified bank = same paper. It throws `PaperAssemblyError` instead of returning an invalid paper.

## Step-Marking Rubrics & Evaluation

- `MarkingSchemeRubric.tsx` provides step-by-step scoring breakdowns with partial marks (e.g., ½ mark for formula, 1 mark for substitution, ½ mark for final unit and answer).
- Integrated with Grounded AI Snap & Grade Evaluator (`/v1/evaluator/grade-written-answer`) to score student handwritten responses against official marking criteria.

## Question bank

- `npm run seed:bank -w apps/api` validates and upserts question seeds across all supported subjects into `QuestionBankQuestion`.
- All seed questions are `board_style` (platform-authored original board-pattern questions) or verified exemplar/PYQs with explicit provenance.

## AI verification (advisory, never auto-publish)

- `verify.ts` calls Gemini REST `generateContent` endpoint (JSON output mode). `GEMINI_API_KEY` / `GEMINI_MODEL` are server-only.
- Only a clean `pass` marks a paper `verified`; human admin approval is the only path to `publishStatus: published`.

## Endpoints and UI

- Student: `POST /v1/exam-papers/generate`, `GET /v1/exam-papers/series?subjectSlug=...`, `GET /v1/exam-papers`, `GET /v1/exam-papers/:id`, `POST /v1/exam-papers/:id/attempt`, `GET /v1/exam-papers/attempts`.
- Evaluator: `POST /v1/evaluator/grade-written-answer`.
- Web: `/exam-papers` (subject tabs for all 7 mock series + generator + recent list) and `/exam-papers/[id]` (printable, step-marking rubric, answer-key toggle), `/exam-papers/[id]/take` (live CBT practice), `/exam-papers/attempts` (analytics).

## Commercial Monetization & Paywall Gating

- **The Gating Rule**: Paper 1 of every published Mock Test Series is 100% Free Forever. Papers 2–5 require an active user entitlement.
- **Packs & Pricing**:
  - `cbse10-all-subjects-mock-pack`: ₹199 (Full-length papers across subjects).
  - `cbse10-mock-pass-<subjectSlug>`: ₹99 (5 full-length papers for a single subject).
- **Backend Access Control**: `checkMockPaperAccess` gates `GET /v1/exam-papers/:id` and `POST /v1/exam-papers/:id/attempt` returning 403 `PAYWALL_LOCKED` when unauthorized.
- **Payment Verification**: HMAC SHA-256 validation on `/v1/payments/verify` with instant database transaction activating `UserEntitlement` + `PaymentOrder`.


