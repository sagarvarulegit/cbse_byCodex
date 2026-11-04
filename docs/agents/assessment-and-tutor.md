# Assessment, Mock Papers, Evaluator, Games, Tara RAG & Optics Engine

> Moved verbatim from `AGENTS.md` to keep the always-loaded rules file under the 24 KB agent limit. Keep this file accurate; `AGENTS.md` links here.

## 8. Assessment, Quizzes, Mock Paper Generator & Grounded AI Evaluator

### 8.1 Quiz Standards
- Every question must include:
  * Exact question text
  * 4 distinct options with `Answer: <index>`
  * `Topic: <valid-chapter-lesson-slug>`
  * `Difficulty: easy|medium|hard`
  * `Source: NCERT in-text | NCERT exercise | CBSE PYQ`
  * `Explanation: <why the answer is correct>`
- CLI validator: `npm run validate:quizzes -w apps/web` (0 errors, 0 warnings).

### 8.2 Multi-Subject Sample Test Paper Generator
- **Layouts (`apps/api/src/lib/exam-papers/layout.ts`):** Encodes official CBSE blueprints for all 7 subjects (Maths Std 38 Qs, Maths Basic 38 Qs, Science 39 Qs, SST 37 Qs, English 34 Qs, Hindi A & B 80 marks).
- **Demand Planning (`demand.ts`):** Generalized, unit-weightage strict planner ensuring zero syllabus deviation and deterministic paper assembly from verified questions.
- **Marking Scheme Rubric (`MarkingSchemeRubric.tsx`):** Displays CBSE step-marking value points with partial half-mark allocations (e.g. ½ mark formula, 1 mark substitution, ½ mark final answer and units).

### 8.3 Grounded AI Snap & Grade Written Evaluator
- **Route:** `POST /v1/evaluator/grade-answer` (`apps/api/src/routes/evaluator.ts`, called via `apps/web/lib/evaluator.ts`)
- **Engine (`apps/api/src/lib/evaluator/grade-answer.ts`):** Evaluates typed answers or OCR photos of handwritten student work against CBSE marking schemes.
- **Verification Contract:** Matches key scientific/mathematical symbols, checks required formula steps, identifies missing keywords, awards partial marks, and offers examiner advice without hallucinating marks.
- **UI:** `AiAnswerEvaluatorModal.tsx` provides instant camera capture / image upload modal on chapter notes and PYQ drills.

### 8.4 Fun&Games Arcade & Formula Rush
- **Arcade Hub (`/games`):** NCERT-aligned gamified active recall power breaks.
- **Formula Rush (`/games/formula-rush`):** Flagship game with ⏱️ 60s Blitz (streak multipliers $2\times, 3\times, 4\times$), ❤️ 3-Lives Survival, and Topic-Specific Practice.
- **Dataset (`formula-rush-data.ts`):** 50+ KaTeX-formatted questions covering Maths & Science.
- **Audio (`sound-effects.ts`):** 0-latency synthesized Web Audio SFX (chimes, chords, thuds, fanfare) with mute toggle.

---

## 9. AI Tutor "Tara-Firefly", pgvector RAG & Interactive Engines

### 9.1 RAG Architecture & Vector Retrieval
- **Corpus Sources:** Chapter packs (`docs/content/class-10/**/chapter-pack.md`) + lesson notes (`apps/web/content/**/lessons/*.md`). Quizzes and internal trackers are strictly excluded to avoid leaking test answers.
- **Chunking:** Split on headings into 300–600 word chunks with 2-sentence overlap.
- **Embeddings:** `gemini-embedding-001` (**3072 dimensions**). Batched via `npm run rag:build -w apps/api`.
- **Retrieval Engine (`apps/api/src/lib/rag/retrieve.ts`):** Cosine similarity against `RagChunk` with a **0.35 score floor**. Queries scoring $< 0.35$ receive a polite refusal: *"That topic is outside my verified CBSE Class 10 notes."*
- **Streaming & SSE:** Streams replies via Server-Sent Events (`POST /v1/tutor/conversations/:id/messages`) using `gemini-2.5-flash` (temperature 0.3, strict JSON output contract, sanitized KaTeX math). Daily limit: 30 requests/day per student.

### 9.2 Canonical Tier A Interactive Optics Engine
- **Engine (`apps/web/lib/optics-engine.ts`):** Certified deterministic NCERT physics engine implementing strict New Cartesian Sign Convention:
  * Mirror at origin, object distance $u = -d_{obj}$, focal length $f = -f_{mag}$ (concave) or $+f_{mag}$ (convex).
  * Mirror formula: $v = \frac{u \cdot f}{u - f}$, Lens formula: $v = \frac{u \cdot f}{u + f}$.
  * Magnification $m = -v/u$ (mirror) or $v/u$ (lens).
- **NCERT Table 9.1 & 9.2 Coverage:** Concave mirror cases 1–6 (including virtual erect magnified behind mirror for $u < f$, and parallel rays at $u = f$), convex mirror, convex lens cases 1–6, concave lens.
- **Component (`InteractiveOpticsViewer.tsx`):** Real-time interactive SVG ray diagrams, preset buttons ("Between F & P", "At F", "Between C & F", etc.), smooth object distance slider, and live sign-convention badges ($u, v, m$). Dispatched automatically in `TaraWidget.tsx`.
