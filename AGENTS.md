---
type: DeveloperGuidelines
title: Master Repository Operating Rules & Consolidated Project Reference
description: Unified single source of truth for repository guidelines, system architecture, database models, curriculum fidelity, notes standards, assessment engines, AI tutor, video production pipelines, micro-monetization, and active backlog.
tags: ['agents', 'guidelines', 'architecture', 'standards', 'curriculum', 'monetization', 'backlog']
timestamp: 2026-11-03T14:50:00Z
---

# Master Repository Operating Rules & Consolidated Project Reference

> **Notice:** This document is the consolidated single source of truth for `cbse_byCodex` (ChapterReady.in). All repository guidelines, architecture maps, database models, curriculum fidelity requirements, portal notes standards, AI systems, video pipelines, monetization models, and sprint backlogs are consolidated here to eliminate documentation fragmentation and simplify maintenance.

---

## Table of Contents
1. [MANDATORY Instructions & Co-Founder Mindset](#1-mandatory-instructions--co-founder-mindset)
2. [Platform Philosophy — NCERT First, Always](#2-platform-philosophy--ncert-first-always)
3. [Repository Architecture, Workspace Map & Deployment Runbook](#3-repository-architecture-workspace-map--deployment-runbook)
4. [Database Schema & Data Models (Prisma / PostgreSQL)](#4-database-schema--data-models-prisma--postgresql)
5. [Curriculum Registry, Official Sources & Rationalized Syllabus](#5-curriculum-registry-official-sources--rationalized-syllabus)
6. [CBSE Portal Notes, Alignment & Formatting Standards](#6-cbse-portal-notes-alignment--formatting-standards)
7. [Notes Readability & Component Architecture](#7-notes-readability--component-architecture)
8. [Assessment, Quizzes, Mock Paper Generator & Grounded AI Evaluator](#8-assessment-quizzes-mock-paper-generator--grounded-ai-evaluator)
9. [AI Tutor "Tara-Firefly", pgvector RAG & Interactive Engines](#9-ai-tutor-tara-firefly-pgvector-rag--interactive-engines)
10. [Educational Video & YouTube Production Pipeline](#10-educational-video--youtube-production-pipeline)
11. [Business Strategy, Micro-Monetization (< ₹200) & Content Protection DRM](#11-business-strategy-micro-monetization--200--content-protection-drm)
12. [Active Sprint Handoffs & Master Task Backlog](#12-active-sprint-handoffs--master-task-backlog)
13. [Session Learnings, Known Gotchas & Pre-Close Checklist](#13-session-learnings-known-gotchas--pre-close-checklist)
14. [Proactive Maintenance Protocol for AGENTS.md](#14-proactive-maintenance-protocol-for-agentsmd)

---

## 1. MANDATORY Instructions & Co-Founder Mindset

### 1.1 Co-Founder Mindset & Responsibility
- You are a **co-founder and owner** of this repository and project.
- As a co-founder, your mission is to make this platform a commercial and educational triumph. We both win together at all costs.
- Employ **human learning psychology** when crafting UI, flows, and copy: respect cognitive load, encourage consistent study habits, celebrate small wins, and avoid stress triggers.
- Minors and Class 10 students are our users: **never use dark patterns**, fake urgency, manufactured scarcity, shame-based retention, or false marks guarantees. Student future and academic accuracy take priority over speed, engagement metrics, or marketing shortcuts.

### 1.2 Mandatory Remote Git Push Policy
- **Multi-Device Reality:** Development occurs across multiple machines (office laptop, home workstation). Uncommitted or unpushed local changes block work on other machines.
- **Mandatory Push:** Always commit and push progress to `origin/main` whenever a subtask or milestone is completed, or before concluding any working session.
- **Pre-Push Steps:** Verify clean tree (`git status`), check diffs (`git diff`), ensure zero credentials/secrets are committed, write concise imperative commit messages (e.g., `Add parent summary digest`, `Implement optics ray engine`), and push:
  ```bash
  git push origin main
  ```
- **Post-Push Step:** Update the active backlog section in this file (`AGENTS.md`) with the next queued task before closing the session.

### 1.3 Verification Policy (Token & Time Conservation)
- **Default Policy:** Until the user explicitly requests full suites, do **not** run automated test suites, end-to-end browser sweeps, or monorepo-wide builds/lints. Long-running blanket checks consume excessive tokens and session time.
- **Focused Checks Only:** Implement the requested change completely, run focused single-file unit checks or TypeScript checks (`npx tsc --noEmit -p apps/web`), and report what targeted check passed and which broader suites were intentionally skipped.
- **Visual Validation Priority:** When requested to show changes, prioritize wiring live content, launching the local dev server (`npm run dev:web` on port 3000), and navigating directly to the affected route in the browser.

### 1.4 Model Selection & Free-Tier Operational Rules
- Primary development sessions run on `openrouter/free` (or Gemini 2.5/Flash).
- For delegation of video review, script analysis, and audit tasks: default to `mimo-v2.5` (Xiaomi provider). Do **not** use DeepSeek (returns HTTP 403 in the current environment).

---

## 2. Platform Philosophy — NCERT First, Always

**Motto: "Simplified NCERT Textbook — One Source of Truth"**

Every piece of content on ChapterReady.in — notes, videos, quizzes, revision cards, interactive tools — follows this immutable hierarchy:

1. **NCERT Textbook is the Single Source of Truth:**
   Every definition, example, activity, figure, number, and topic order **must** match the NCERT textbook. We do not invent concepts, reorder sections, or skip topics.
2. **Simplification, Not Replacement:**
   We explain textbook concepts in simpler language, with memory tricks, visual aids, and step-by-step breakdowns. A student must feel they are reading NCERT, but the confusing parts are made effortless to grasp.
3. **If NCERT Has a Figure, We Must Have a Matching Visual:**
   Every textbook diagram, illustration, graph, and table must have an equivalent responsive visual — SVG illustration, HTML diagram, or interactive canvas.
4. **Accessible Class 8 English Level:**
   English is not the native language for most Indian CBSE students. Write for a 12-year-old reader. Short sentences, active voice, concrete examples before abstract definitions (`utilize` → `use`, `demonstrate` → `show`, `consequently` → `so`).
5. **One Chapter, One Consistent Flow:**
   Hook → Objective → Concepts (in textbook order) → Examples → Tips → Revision → Comic Recap → CTA. No random jumps.
6. **No Multiple Conflicting Sources:**
   If a student asks "What is the formula for X?", we provide exactly ONE authoritative NCERT answer. No conflicting academic interpretations.

### Knowledge Base & Textbooks Repository (`cbse_KB`)
- Repository path: `../cbse_KB/` (or `c:\Sagar\Projects\CBSE\ChapterReady.in\cbse_KB\`)
- Class 10 root: `cbse_KB/10th/`
- Textbooks: `cbse_KB/10th/NCERTTextbooks/` (single-PDF per chapter) and `cbse_KB/10th/textbooks/`
- NCERT Exemplar: `cbse_KB/10th/NCERTExemplar/`
- Previous Year Papers & Marking Schemes (2022–2026): `cbse_KB/10th/PreviousYearExamPapers/`
- Sample Question Papers (SQP): `cbse_KB/10th/SamplePapers/`
- Extraction pipelines: `cbse_KB/scripts/` (`parse_exemplar.py`, `parse_marking_schemes.py`, `export_chapter_pyqs.py`, `merge_and_export_exemplar.py`, `validate_datasets.py`)

---

## 3. Repository Architecture, Workspace Map & Deployment Runbook

### 3.1 Workspace Map

| Workspace / Directory | Framework / Purpose | Key Entry Points & Contents |
| --- | --- | --- |
| `apps/web` | Next.js 15 (App Router, React 19, TypeScript) student-facing platform | `app/`, `components/`, `lib/`, `content/` |
| `apps/admin` | Next.js 15 admin CMS & pilot review portal | `app/`, `lib/` |
| `apps/api` | Express.js REST API + Prisma 6 ORM backend | `src/app.ts`, `src/routes/`, `src/lib/`, `prisma/` |
| `apps/mobile` | Flutter client placeholder for future Android/iOS | Project scaffolding |
| `docs/content/` | Maintained Markdown chapter packs for Class 10 subjects | `docs/content/class-10/{subject}/**/chapter-pack.md` |
| `../cbse_videos/` | Educational video projects (HyperFrames / Three.js / SCRIPT.md) | Dedicated sibling repository `c:\Sagar\Projects\CBSE\ChapterReady.in\cbse_videos\` |
| `../cbse_KB/` | NCERT PDFs, Exemplars, Marking Schemes, and Extraction Scripts | Dedicated sibling repository `c:\Sagar\Projects\CBSE\ChapterReady.in\cbse_KB\` |

### 3.2 Production URLs & Deployment Topologies

| App | Production URL | Vercel Project | Primary Env Requirements |
| --- | --- | --- | --- |
| **Student Web** | [https://www.chapterready.in](https://www.chapterready.in) | `cbse-bycodex-web` | `NEXT_PUBLIC_API_BASE_URL` |
| **API Backend** | `https://cbse-bycodex-api.vercel.app` | `cbse-bycodex-api` | `DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGIN`, `GEMINI_API_KEY`, Cashfree / Razorpay keys |
| **Admin Portal**| `https://cbse-bycodex-admin.vercel.app`| `cbse-bycodex-admin`| `NEXT_PUBLIC_API_BASE_URL` |

### 3.3 Core CLI Commands
- `npm run dev:web`: Starts student Next.js web app (`npm run dev -w apps/web`, Port 3000)
- `npm run dev:admin`: Starts admin Next.js app (`npm run dev -w apps/admin`, Port 3001)
- `npm run dev:api`: Starts Express API backend (`npm run dev -w apps/api`, Port 4000)
- `npm run build`: Builds all workspaces (`apps/web`, `apps/admin`, `apps/api`)
- `npm run lint`: Runs TypeScript checks across web, admin, and api
- `npm run exam:snapshot`: Regenerates subject blueprint TypeScript definitions from curriculum registry (`npm run exam:snapshot -w apps/web`)
- `npm run seed:bank -w apps/api`: Validates and seeds the exam question bank across all 7 core subjects
- `npm run prisma:migrate:deploy -w apps/api`: Applies pending Prisma database migrations
- `npm run content:generate -w apps/web`: Refreshes `apps/web/lib/chapter-packs.generated.ts` from `docs/content/`
- `npm run validate:quizzes -w apps/web`: Validates quiz markdown metadata across all chapters
- `npm run rag:build -w apps/api`: Chunks and embeds chapter packs into pgvector `RagChunk`
- `npx vercel deploy --prod --yes`: Deploys from individual workspace directories (`apps/api`, `apps/web`, `apps/admin`)

### 3.4 Media Infrastructure (Bunny Stream & Storage)
- **Bunny Stream Library ID:** `681662`
- **CDN Hostname:** `vz-02672d82-a18.b-cdn.net`
- **Storage Zone:** `cbse-class10` (stores master MP4 archives and tutor attachments)
- **Video Metadata:** PostgreSQL stores metadata only (`providerLibraryId`, `providerVideoId`, `playbackUrl` HLS m3u8, `durationSeconds`, `processingStatus`). Binary media is never committed to Git or stored directly in SQL.

---

## 4. Database Schema & Data Models (Prisma / PostgreSQL)

Database models live in `apps/api/prisma/schema.prisma` and are backed by Supabase PostgreSQL with the `pgvector` extension enabled.

### 4.1 Core Entities & Relationships
1. **`User` & `UserProfile`:**
   - `User`: Authentication record (`email`, `phone`, `passwordHash`, `role` [student, admin, teacher_reviewer, support], `status`, `@default(cuid())`).
   - `UserProfile`: Student details (`fullName`, `classLevel` default 10, `schoolName`, `targetExamYear`, `preferredLanguage`, `themePreference`).
2. **`GuardianConsent`:**
   - Required for student onboarding. Records `guardianFullName`, `guardianEmail`, `relationship`, `policyVersion` (authoritative: `2026-08-04`), `consentedAt`, and `verificationStatus` (`self_attested`). Validated server-side in `apps/api/src/lib/guardian-consent.ts`.
3. **`Subject`, `Chapter`, `Topic`, `Lesson`:**
   - Hierarchical content catalog with `ncertChapterNumber`, `slug`, `sortOrder`, `isPublished`, `accessLevel` (`free` | `premium`).
4. **`Quiz` & `Question`:**
   - Multiple choice questions with `optionsJson`, `correctOptionIndex`, `explanation`, `difficulty`, `topicSlug`, `source`.
5. **`QuizAttempt` (Immutable):**
   - Stores immutable attempt records (`scorePercent`, `totalQuestions`, `correctAnswers`, `weakTopicSlugs`, `questionResults`, `attemptNumber`). Retrying a quiz creates a brand-new attempt record.
6. **`WrittenPracticeAttempt`:**
   - Structured practice records (`practiceKind`, `scoreHalfMarks`, `maxScoreHalfMarks`, `earnedRubricPointIds`, `missedRubricPointIds`, `weakSkillSlugs`, `usedHints`, `retentionEligible`).
   - **D0/D3/D7 Spaced Retention:** First score $\ge 80\%$ triggers D0; separate qualifying attempts on/after Day 3 and Day 7 satisfy D3 and D7. One late attempt cannot satisfy both D3 and D7.
7. **`MistakeReviewItem`:**
   - API-owned personal mistake recovery queue. Dedupes incorrect questions, weak concepts, hint uses, and missed marking points (`kind`: `quiz_question` | `weak_concept` | `hint_used` | `written_marking_point`). Reopens automatically upon repeated error and reschedules retry to `now() + 3 days`.
8. **`ExamReadyChecklist`:**
   - Tracks 3 student-confirmed milestones (`conceptsStudiedConfirmed`, `ncertQuestionsAttempted`, `weakAreasRevised`). 70% quiz accuracy, written practice, and D3 recall are derived strictly from immutable records.
9. **`StudyStreak` & `Badge`:**
   - Streaks track consecutive India calendar study days (persisted lesson reads, quiz saves, practice saves).
   - Personal V1 badges: first lesson, first quiz, 3-day streak, first written self-check, comeback after low score.
10. **`QuestionBankQuestion`:**
    - Curated board-pattern questions (`subjectSlug`, `bankKey`, `chapterSlug`, `unitId`, `topicId`, `questionType`, `marks`, `difficulty`, `sourceKind`, `verificationStatus` [`unverified`, `review`, `verified`, `rejected`]).
11. **`ExamPaper` & `ExamPaperQuestion`:**
    - Snapshots reproducible generated 80-mark mock papers with section layouts, reading times, seeds, and verification verdicts.
12. **`RagChunk` (pgvector):**
    - 3072-dimensional vector embeddings generated by `gemini-embedding-001` with `subject`, `chapterSlug`, `sectionTitle`, `contentHash`, `embedding Unsupported("vector(3072)")`.
13. **`TutorConversation`, `TutorMessage`, `TutorAttachment`:**
    - Tara AI chat sessions, user/assistant messages with cited chunk IDs, and Bunny Storage attachment references.
14. **`PaymentOrder` & `UserEntitlement`:**
    - Cashfree / Razorpay transaction records (`amount` in paise, `status`: `created` | `paid` | `failed` | `refunded`) and provisioned feature entitlements (`status`: `active` | `expired` | `revoked`).
15. **`StudentFeedback`:**
    - In-app feedback reports (`category`: `suggestion` | `bug` | `content_error` | `general`, rating 1-5, `@default(uuid())`).

### 4.2 Database Constraints
- **SQL Quote Escaping:** Single quotes in seed data must be doubled (`'Ohm''s Law'`, `'Gandhiji''s march'`).
- **XML / SVG Compliance:** Unescaped ampersands (`&`) break browser XML parsers in custom painters. Always use `and` or `&amp;`.

---

## 5. Curriculum Registry, Official Sources & Rationalized Syllabus

### 5.1 Source of Truth
The web curriculum registry in `apps/web/lib/curriculum/subjects/class-10/*.ts` is the single source of truth for Class 10 subjects.

### 5.2 Subject Codes & Rationalized Status (Session 2026-27)

| Subject | Code | Board Exam Format | Status & Rationalized Syllabus Rules |
| --- | --- | --- | --- |
| **Mathematics Standard** | 041 | 38 Qs, 80 Marks, 180 min | **Active.** Omitted: Euclid's division lemma, decimal expansions, polynomial division, cross-multiplication, completing square, coordinate triangle area, frustum, ogives. |
| **Mathematics Basic** | 241 | 38 Qs, 80 Marks, 180 min | **Active.** Same blueprint as 041; emphasizes direct formula application and core textbook problems. |
| **Science** | 086 | 39 Qs, 80 Marks, 180 min | **Active (13 rationalized chapters).** Omitted chapters: Periodic Classification, Sources of Energy, Sustainable Management. Internal deletions: Electric Motor/Generator/Induction (Ch 12), Red Sun at sunrise/sunset (Ch 10). |
| **Social Science** | 087 | 37 Qs, 80 Marks, 180 min | **Active.** 22 NCERT chapters (History, Geography, Civics, Economics) + 1 Map Skill section (5 marks). |
| **English Language & Lit** | 184 | 34 Qs, 80 Marks, 180 min | **Active.** Reading (20), Writing/Grammar (20), Literature (40). Textbooks: *First Flight*, *Footprints Without Feet*, *Words and Expressions II* (9 units). |
| **Hindi Course A** | 002 | 80 Marks, 180 min | **Active.** *Kshitij II*, *Kritika II*. Unseen comprehension, grammar, literature, writing. |
| **Hindi Course B** | 085 | 80 Marks, 180 min | **Active.** *Sparsh II*, *Sanchayan II*. Unseen comprehension, grammar, literature, writing. |
| **Health & Physical Ed.**| HPE | Internal Assessment (100) | **Active (Internal).** Games/Sports 50, Health/Fitness 25, SEWA 25. No board paper. |
| **Information Technology**| 402 | Optional Skill Subject | **Future.** Employability skills + subject-specific skills. `visibleInCatalog: false`. |
| **Artificial Intelligence**| 417 | Optional Skill Subject | **Future.** AI foundations and ethics. `visibleInCatalog: false`. |

---

## 6. CBSE Portal Notes, Alignment & Formatting Standards

### 6.1 Non-Negotiable Content Rules
1. **Preserve Textbook Numbering:** Student-facing titles, H1s, H2s, cards, and navigation **must** use exact textbook numbering (`5.1 What are life processes?`, `5.2 Nutrition`, `5.2.1 Autotrophic nutrition`). Never jump from `5.1` directly to `5.2.1` without parent `5.2`.
2. **Preserve Textbook Order:** Do not rearrange sections for flow convenience.
3. **Preserve Activities & Numbers:** Every textbook activity must be represented (`Activity 5.1`, `Activity 5.2`). Gemini animations must match these exact numbers.
4. **Preserve Figures & Numbers:** Keep exact textbook labels (`Figure 5.1: Cross-section of a leaf`).
5. **Preserve Textbook Questions Blocks:** Place `Questions and answers` exactly where the textbook has a `Questions` block (e.g., immediately after `5.1` before `5.2`). Do not paraphrase or invent questions.
6. **No Unsupported Claims:** Tips, tricks, and comic dialogues must derive purely from textbook concepts.
7. **Do Not Over-Compress Science:** Explain mechanisms fully (e.g., chlorophyll, carbon dioxide, stomata, light reaction events, ATP, pyruvate pathways).

### 6.2 Custom Markdown Parser Triggers
The parser in `apps/web/components/LessonNotesContent.tsx` converts specific markdown tokens into rich UI components:

```markdown
# Chapter [N]: [Title]
Trigger: Chapter opener layout with FlaskPainter vector, Outfit font, and NCERT QR code.

## 5.2 Nutrition
Trigger: Section heading with purple accent line. Grouped into an individual concept card.

**Example 12.1**
[Problem statement]
**Solution:**
[Step-by-step solution]
Trigger: InteractiveExample widget with collapsible 'Show Solution' disclosure.

**❓ QUESTIONS**
**1. [Question text]?**
*Answer:* [Clear, scoring-friendly answer text]
Trigger: QuestionCard component with individual question cards.

Caution: [Warning text]
Trigger: WarningCard with pitfall alert styling. Also supports > [!NOTE], > [!WARNING], > [!CAUTION].

[JARGON: Term | Simple Definition | Real-world Example]
Trigger: Inline term in running text + expandable callout card underneath.

### Activity 5.1
Caution: [Safety notice]
1. [Step 1]
2. [Step 2]
Trigger: Custom activity box with numbered procedure steps.

## 🎬 Comic Recap
┌────────────────────────────────────────────┐
│ PANEL 1:                                   │
│ Priya: "Why does the toaster wire glow?"   │
│ Rahul: "High-resistance alloy Joule heat." │
├────────────────────────────────────────────┤
│ 📌 REMEMBER THIS!                          │
│ V = IR, H = I²Rt                           │
└────────────────────────────────────────────┘
Trigger: 4-panel comic strip dialogue rendered as alternating speech bubbles between Priya and Rahul.
```

### 6.3 Mathematical & Chemical Syntax
- **LaTeX Math:** Single dollar for inline (`$V = IR$`), double dollar for display (`$$V = IR$$`). Rendered via KaTeX (`throwOnError: false`).
- **Chemical Formulas:** Plain text formulas outside math blocks automatically convert numbers to subscripts (`H2O` → `H₂O`, `CO_2` → `CO₂`, `Fe2O3` → `Fe₂O₃`). Do not manually mangle subscripts inside `$...$` math blocks.

### 6.4 Responsive Vector Diagrams & Figure Tokens
- **Token:** `[FIGURE: figure_id]`
- **Canvas:** 1280×720 aspect ratio (16:9), capped at 324px desktop height.
- **Dark Mode / Slate Canvas:** Never draw light elements (white ash, bubbles, gas fumes, silver metal) on white backgrounds. Use slate `#1E293B`.
- **Numbered Pins:** Labels must use numbered pins on the illustration with an HTML label key below. Never burn non-scalable text into raster images.
- **Supported Figure IDs:** `magnesium_burner`, `double_circulation`, `neuron`, `prism_dispersion`, `bar_magnet_field`, `trophic_levels`, `circuit_symbols`, `ohms_law_circuit`, `basic_circuit`, `series_circuit`, `parallel_circuit`, `combination_reaction`, `decomposition_reaction`, `displacement_reaction`, `electrolysis_of_water`, etc.

---

## 7. Notes Readability & Component Architecture

### 7.1 Single Scannable Column & Card Hierarchy
- **Card-per-H2 Structure:** Each `##` section compiles into a dedicated `.concept-block` card with 22px vertical rhythm.
- **Numbered Eyebrows:** Numbered sections split cleanly into `<p class="concept-eyebrow">Section 5.2.1</p>` and `<h3 class="prose-section-heading">Autotrophic Nutrition</h3>`.
- **Unified Support Cards:** All 7 supplementary learning cards share a unified 12px-gap card geometry with distinct 4px top accent borders:
  * 💡 **Board Tip:** `.lesson-support-board-tips` (Top border `#d49a00`)
  * ⚠️ **Common Mistake:** `.lesson-support-common-mistakes` (Top border `#dc4c64`)
  * ✏️ **Quick Practice:** `.lesson-support-quick-practice` (Top border `var(--accent)`)
  * ⏱️ **1-Minute Revision:** `.lesson-support-one-minute-revision` (Top border `#7357d8`)
  * ❓ **Study Questions:** `.lesson-qa-card` (Top border `var(--primary)`)
  * 🔍 **Practice Feedback:** `.lesson-practice-answer` (Dashed border)
  * 🎭 **Memory Strip:** `.comic-recap-card`
- **Zero Zigzag Alignment:** All media (`[[figure:...]]`, `[[demo:...]]`, `[[written-practice:...]]`, tables, formula blocks) are wrapped in `<div class="concept-media">` constrained to 100% of the reading column.
- **Mobile Stacking:** On viewports $< 960px$, sidebar contents stack cleanly, interactive padding tightens to 16px, and tables scroll horizontally inside the card.

---

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

---

## 10. Educational Video & YouTube Production Pipeline

### 10.1 Video Repository Location & Structure
- **Dedicated Repository:** Educational video production lives in `cbse_videos/` (located at `c:\Sagar\Projects\CBSE\ChapterReady.in\cbse_videos\` or `../cbse_videos/`).
- **Anime-Inspired Gen Z Visual Style:** Manga panels, reaction faces, speed lines, chibi science solids, power-up meters, starbursts. Original, commercially safe assets only (no copyrighted characters or living artist imitations).
- **Palette Defaults:**
  * Classroom Warm: Paper `#f7f2e7`, Ink `#171513`, Brand `#f3883b`, Deep Orange `#a84a08`, Energy `#ffcf4a`, Success `#2f8f68`.
  * Night Study: Night `#101827`, Paper `#f4f1e8`, Brand `#f3883b`, Electric `#55c7f2`, Violet `#9b7cff`.
- **Typography:** **Bangers** (1–5 word hooks, reaction words), **RocknRoll One** (compact labels, chapter chrome), **Noto Sans JP** (captions, body), **Space Mono** (equations, atom counts, timer digits).

### 10.2 Mandatory Frame 2 Objective Rule
Every educational video **must** state its objective clearly in Frame 2 (right after the Hook) in 2–3 sentences before any formulas or concepts appear:
- *SAV Video:* "Today we cover all 14 formulas for Surface Areas and Volumes — CSA, TSA, and Volume for every shape, plus memory tricks to recall them."
- *Quadratic Video:* "This video teaches every method to solve quadratic equations — factorisation, completing the square, the quadratic formula — and discriminant shortcuts."

### 10.3 Mandatory Plain Spoken English Narration (TTS Math Rule)
- **ElevenLabs Pronunciation Rule:** ElevenLabs TTS completely garbles raw math notation (`x²`, `√`, `±`, `ₙ`, `×`, fractions). Raw subscript $\text{a}_n$ turns into gibberish.
- **Mandatory Translation:** Preprocess narration text with `cbse_videos/ap-confusion-short/preprocess_math.py`. Spell out all formulas phonetically in `SCRIPT.md`:
  * `x² - 45x + 324 = 0` → *"x squared minus forty-five x plus three hundred twenty-four equals zero"*
  * `aₙ = a + (n-1)d` → *"a subscript n equals a plus n minus one times d"*
  * `a/b` → *"a over b"*
- Keep real mathematical notation in the `**VISUAL:**` layer; spoken audio and captions use plain phonetic English.

### 10.4 Voice Casting & Audio Engineering
- **Voice Todd (`g14YnDYCsy3k7XLlcKlO`):** Approved voice for male narration and all YouTube Shorts.
- **Voice Jessica (`cgSgspJ2msm6clMCkdW9`):** Playful, bright, warm voice with `eleven_turbo_v2_5` for maths master videos.
- **Audio Mix Pipeline:** Crossfade-loop BGM, sidechain-duck under voice (`sidechaincompress` threshold 0.02, ratio 10–14, attack 120ms, release 800ms), normalize with `loudnorm I=-16:TP=-1.5:LRA=11`. Ensure $\ge 4\text{ dB}$ speech headroom.
- **Video Git Policy:** Track paid ElevenLabs MP3s and metadata (`audio/**/*.mp3`, `audio/metadata.json`); ignore heavy regenerable WAV conversions (`audio/*.wav`, `audio/work/`, `renders/`).

---

## 11. Business Strategy, Micro-Monetization (< ₹200) & Content Protection DRM

### 11.1 The Core Business Flywheel
$$\text{Free YouTube} \longrightarrow \text{Free Platform Core} \longrightarrow \text{Paid Study Accelerators} \longrightarrow \text{Parent Weekly Digest}$$

The YouTube channel is the student acquisition engine; ChapterReady.in is the platform.

### 11.2 Micro-Pricing Philosophy (Strictly Under ₹200 INR)
- **100% Free Forever:** Core NCERT notes, lesson videos, and 3 daily practice quizzes.
- **Micro-Packs (< ₹200):** Priced to eliminate hesitation and make piracy irrelevant compared to instant UPI checkout:

| Product Name | Slug | Price | Features & Access |
| --- | --- | ---: | --- |
| **Formula & Reaction Cheatsheets** | `cbse10-formula-cheatsheet-pack` | **₹49** | 1-page high-density summary sheets for Maths & Science + 3D active flashcards. |
| **Activity & Diagram Mastery Pack**| `cbse10-activity-diagram-pack` | **₹99** | All 13 Science experimental setups, observations, reactions, and 3/5-mark CBSE model answers. |
| **Activity + Formula Super Combo** | `cbse10-activity-formula-combo` | **₹129** | Complete bundled access to both cheatsheets and diagram mastery packs. |
| **Single Subject Mock Pass** | `cbse10-mock-pass-<subject>` | **₹99** | 5 full-length 80-mark computer-based mock papers with step-marking rubrics. |
| **All-Subjects Board Mock Pack** | `cbse10-all-subjects-mock-pack` | **₹199** | **35 full-length 80-mark mock papers** (5 papers each across Maths Std, Maths Basic, Science, SST, English, Hindi A, Hindi B) with CBT timers. |
| **Unlimited CBSE Quiz Pass** | `cbse10-unlimited-quizzes-all` | **₹199** | Removes 3 daily quiz limit across 48 chapters + unlocks Spaced Repetition Mistake Vault. |

### 11.3 Digital Anti-Piracy DRM
1. **Dynamic Forensic Watermarking:** Screens and printable sheets bake student identity:
   `🔐 Single-Student License: [Student Name] ([Student Email]) • Official ChapterReady.in™`
2. **Anti-Scrape DOM Lockdown:** `user-select: none` across formula tables, observation grids, and model answers.
3. **Viral Print Conversion Footer:** Every printable sheet carries a platform QR badge inviting classmates to test their speed on ChapterReady interactive 3D flashcards.

---

## 12. Active Sprint Handoffs & Master Task Backlog

### 12.1 Recently Completed Deployments & Shipments
- [x] **Dedicated Parent Progress Summary (`/parent-summary`)**: High-trust summary model extracting consistency streaks, started chapters, quiz accuracy, board readiness status, 3 parent tips, and 1-click WhatsApp weekly digest sharing.
- [x] **Student Dashboard Redesign ("One Screen, One Question")**: Clean single-plan daily study card (Read lesson → Take quiz → Fix mistakes), 5-subject compact progress tiles, conditional "Needs a Look" mistake strip, and ephemeral XP celebration toast.
- [x] **Schema.org JSON-LD Structured Data**: Global SEO structured data with `EducationalOrganization`, `WebSite`, `SoftwareApplication`, and `Course` schemas mounted in root layout.
- [x] **Tara AI Tutor Optics Engine**: Certified NCERT Table 9.1 & 9.2 physics engine, interactive ray diagram slider, and automated dispatch inside Tara chat stream.
- [x] **Fun&Games Arcade & Formula Rush**: 60s Blitz, 3-Lives Survival, and 50+ NCERT-verified formula challenges with Web Audio SFX.
- [x] **Grounded AI Snap & Grade Evaluator**: OCR/text evaluation against step-marking schemes (`POST /v1/evaluator/grade-answer`).
- [x] **Multi-Subject Mock Test Generator & Store**: 7-subject blueprint engine, Cashfree/Razorpay UPI integration, dynamic forensic watermarking.

### 12.2 Active Tasks in Queue
- [ ] **Automated Weekly Parent Digest Notification**: Trigger Sunday evening WhatsApp / email digests to parents detailing study consistency and countdown to board exams.
- [ ] **YouTube Section Formula Short Upload**: Upload `cbse-class-10-maths-section-formula-ratio-shorts.mp4` with dedicated 9:16 thumbnail to YouTube Studio.
- [ ] **Live ₹2 UPI Transaction Test**: Perform an end-to-end UPI payment test on `https://www.chapterready.in/store` in production.
- [ ] **Roll Out Full Lesson-Wise Notes**: Continue expanding lesson-wise notes across Science, Mathematics, and Social Science matching notes guidelines.

---

## 13. Session Learnings, Known Gotchas & Pre-Close Checklist

### 13.1 Critical Session Learnings & Engineering Gotchas
1. **TTS Math Subscript Failure:** ElevenLabs cannot pronounce Unicode subscripts (`ₙ` = U+2099). Always run `preprocess_math.py` or write out `"a subscript n"`.
2. **GSAP ID Prefix Requirement:** Element IDs in HyperFrames must begin with a letter (e.g., `f02-photo`, not `02-photo`). Digit-leading IDs cause GSAP's `querySelectorAll` to throw an exception and crash the scene timeline.
3. **Ffmpeg Audio Loop Graphs:** Do not chain crossfade-loop `amix,atrim` with `volume/afade` in a single complex filtergraph. Run loop pass 1 to disk, then mix/duck pass 2.
4. **Contrast Rules on Warm Paper:** Orange `#f3883b` on cream paper (`#f7f2e7`) fails WCAG AA (2.24:1). Use `#d26b16` for headings (3.21:1) and `#a84a08` for small labels and equations (5.16:1).
5. **Vercel Serverless File Tracing:** `apps/web/content/**/*` must be included in serverless function traces so markdown files resolve reliably in deployed lambdas.
6. **Strict Prisma Interactive Transaction Timeout:** Multi-table transactions (mastery + streaks + missions + badges) can exceed the default 5s timeout. Use explicit `maxWait: 10000` and `timeout: 15000` in `apps/api/src/routes/progress.ts`.

### 13.2 Pre-Close Verification Checklist
Before concluding any implementation turn, confirm:
- [ ] Exact textbook section numbering (`5.1`, `5.2`, `5.2.1`) is preserved.
- [ ] Parent section appears visibly before child subsection.
- [ ] Textbook activities, figures, and question blocks appear in authentic order.
- [ ] No hardcoded colors exist inside database note text.
- [ ] XML-sensitive ampersands are escaped (`&amp;` or `and`).
- [ ] Focused TypeScript check passes (`npx tsc --noEmit`).
- [ ] Backlog in this document (`AGENTS.md`) is updated with the current state.
- [ ] Git commit and push to `origin/main` is completed.

---

## 14. Proactive Maintenance Protocol for AGENTS.md

To keep `AGENTS.md` clean, accurate, and truly useful over time, every agent and developer must observe these maintenance rules:

1. **Single Source of Truth Rule:**
   - Do **NOT** create ad hoc scratch documents, detached `TODO-*.md`, or standalone design notes in the root or `docs/`.
   - When a design decision, architecture update, or guideline is established, write it directly into its matching section in `AGENTS.md`.

2. **Immediate Task Handoff Updates:**
   - Whenever completing a feature or milestone, check off the item in **Section 12.1** and specify the exact next queued task in **Section 12.2**.
   - If new bugs or technical debt are discovered, add them directly to Section 12.2 or Section 13.1.

3. **API & Route Precision:**
   - Whenever an Express endpoint is added or changed in `apps/api/src/routes/`, update the route list in Sections 3 and 8/9/11 with the exact HTTP method and URI.

4. **Database Model Sync:**
   - When Prisma migrations are applied, verify that any new models or critical field additions are reflected in Section 4.

5. **Cross-Platform Path Hygiene:**
   - Always document paths using repository-relative conventions (e.g. `apps/web/`, `../cbse_videos/`, `../cbse_KB/`) or parameterized Windows paths, avoiding machine-specific Linux user home paths.
