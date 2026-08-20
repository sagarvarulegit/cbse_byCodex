---
type: Architecture
title: CBSE Learning Platform Architecture
description: Manually maintained map of module boundaries, data ownership, and primary application flows.
tags: ['architecture', 'modules', 'data-flow', 'onboarding']
timestamp: 2026-08-04T00:00:00Z
---

# CBSE Learning Platform Architecture
This document is the repository's concise architecture map. Update it when module boundaries, data ownership, or deployment flows change. Route durable discoveries through `docs/project-memory.md` into the narrowest topic file.

## Workspace map

| Area | Responsibility | Primary sources |
| --- | --- | --- |
| `apps/web` | Student-facing Next.js application, lesson and quiz rendering, curriculum registry, and student flows | `app/`, `components/`, `lib/`, `content/` |
| `apps/admin` | Admin CMS and pilot-review surfaces | `app/`, `lib/` |
| `apps/api` | Express API, authentication, catalog, video, progress, mastery, feedback, tutor, exam papers, and database access | `src/app.ts`, `src/routes/`, `src/lib/`, `prisma/` |
| `apps/mobile` | Placeholder for future Flutter clients | application scaffold only |
| `docs` | Product decisions, content standards, runbooks, architecture, and durable project memory | `architecture.md`, the `project-memory.md` index, `project-memory/`, curriculum and content docs |
| `videos` | Code-generated lesson-video projects and media tooling | per-video project directories |

## Source ownership

- Curriculum definitions and session-aware official-source rules live in `apps/web/lib/curriculum/`.
- Student chapter and lesson catalog metadata lives in `apps/web/lib/course-content.ts`.
- Lesson markdown lives in `apps/web/content/<chapter-slug>/lessons/`.
- Maintained chapter packs live under `docs/content/`; generated web pack data lives in `apps/web/lib/chapter-packs.generated.ts`.
- Database models and migrations live under `apps/api/prisma/`. PostgreSQL/Supabase stores application metadata and student state.
- Guardian permission is stored in the one-to-one `GuardianConsent` record owned by the API. It records the accepted notice version and a deliberately explicit `self_attested` verification status.
- Bunny Stream delivers lesson video. Bunny Storage holds master MP4 archives.
- Textbook fidelity rules live in `NOTES_GUIDELINES_STANDARDS.md`; evolving chapter-specific learnings live in `docs/project-memory/curriculum-and-content.md`.
- The sample-test-paper engine, curated question bank, and Gemini verification live under `apps/api/src/lib/exam-papers/` with a registry-derived blueprint snapshot; the student UI lives in `apps/web/app/exam-papers/`.

## Primary flows

### Student registration and privacy

1. `/register` requires the student account fields plus a parent or lawful guardian name, email, relationship, adult confirmation, and acceptance of the current pilot privacy notice.
2. The web server action sends the notice version and confirmations to `POST /v1/auth/register`. `apps/api/src/lib/guardian-consent.ts` is the server-side validation boundary; browser-required fields alone are never treated as proof of consent.
3. The API creates `User`, `UserProfile`, and `GuardianConsent` together. The MVP status is `self_attested`; it is suitable only for the controlled pilot and must not be represented as identity or age verification.
4. `/privacy` is public and versioned. `PRIVACY_CONTACT_EMAIL` supplies the correction, withdrawal, and deletion contact and must be configured before onboarding is widened.

### Student lessons

1. Student login lands on `/dashboard`. The canonical catalog path is `/dashboard` â†’ `/subjects` â†’ `/subjects/<subject-slug>` â†’ `/chapters/<chapter-slug>/notes`; personalised dashboard shortcuts may deep-link to recent content without replacing that hierarchy.
2. `apps/web/lib/curriculum/subject-navigation.ts` classifies each mapped chapter as `lesson-wise`, `revision-pack`, or `coming-soon`. The home page, dashboard, and subject routes use the same catalog counts, and subject chapter cards open the continuous chapter content directly. The helper also resolves the parent subject for chapter-child breadcrumbs and reverse navigation.
3. The continuous `/chapters/<slug>/notes` route loads every available lesson in catalog order and includes compact mastery plus a single quiz action. `/chapters/<slug>` remains an optional detailed progress and rewards view, while individual lesson routes remain available for direct remediation links. Lesson markdown is loaded from `apps/web/content/` and parsed into student-facing headings, paragraphs, lists, tables, code blocks, and interactive markers.
4. Static activity and figure markers route through the server-rendered `LessonDemo`, `ActivityIllustration`, and `StaticFigureDemo` path. Only genuinely interactive demos such as the equation workbench and step walkthroughs cross a client boundary.
5. Session-aware video, mastery, attempt-history, and feedback data is requested from the API; lesson notes remain readable when optional video lookup is unavailable. HLS support is loaded in the browser only when native HLS playback is unavailable.

### Study Remix dashboard

1. `/dashboard` remains an async Server Component. It loads the authenticated student and mastery aggregates in parallel, then `apps/web/lib/study-remix.ts` combines those aggregates with the three published pilot chapters into a plain serializable mix model.
2. `StudyRemixDashboard` owns album selection and tomorrow-cue controls. `StudyRemixProvider` lives in the root web layout so an active 45-minute session can continue across client-side navigation to subjects, notes, lessons, and quizzes.
3. The active timer is temporary, student-scoped `sessionStorage` state. Reload restores it paused so time away is not counted. A separately queued tomorrow cue is device-local `localStorage` state keyed to the student and India calendar date.
4. Focus sessions emit `focus_mix_start` and `focus_mix_complete` engagement events, but never mutate `ChapterMastery`, complete lessons, or award badges. Quiz and video evidence remain the only inputs to the current mastery formula; study streaks count only persisted lesson completion, quiz-save, and practice-save activity.

### Student visual system

1. `apps/web/app/globals.css` continues to own structural layout and the detailed lesson-component contracts. The root layout then loads `apps/web/app/platform-remix.css`, which is the student app's visual-theme boundary and applies the ChapterReady language across public, authentication, catalog, chapter, notes, lesson, quiz, practice, feedback, and loading routes. Study Remix remains the name of the focused dashboard experience rather than the master brand.
2. The platform palette is warm paper and white, near-black ink, and the approved `#f3883b` orange. Shared navigation, tactile controls, asymmetric cards, grid texture, record-deck surfaces, focus states, and responsive treatments should be added to the theme layer instead of copied into route files.
3. The dashboard remains a scoped CSS Module because its player has specialised record, setlist, and mini-player geometry; its tokens mirror the platform palette. Educational diagrams and correctness/error states may retain semantic colours inside their themed frames.
4. Authenticated student routes share the server-rendered `StudentTopbar` for brand, library/dashboard shortcuts, real student identity, and account actions. Notes and lesson routes add a small `ReadingCompanion` client island for device-local reading progress, per-page resume position, contents navigation, and focus mode; it does not write progress or mastery evidence.
5. The master brand is `ChapterReady`; customer-facing lockups use the descriptor `For CBSE Class 10`. `BrandLockup` owns the shared web rendering, while reusable SVG marks and wordmarks live under `apps/web/public/brand/`. The symbol is an open book with an evident orange check mark and must not incorporate the official CBSE logo or seal.

### Quizzes and progress

1. Quiz markdown is parsed and validated in `apps/web/lib/quiz-content.ts` and related validation helpers.
2. The web client submits immutable quiz attempts to the API progress routes.
3. The API stores attempts and updates mastery, study streaks, revision missions, and personal badges through Prisma transactions. Passive views stay analytics-only; study streaks are refreshed by persisted lesson completions, quiz saves, and practice saves.
4. Revision missions return concrete note and quiz action links, so dashboards can send students to the next real remediation step instead of a fake or unavailable tool.
5. Student dashboards and chapter pages read the resulting aggregates without treating missing data as completed progress.
6. Quiz saves include bounded question-level review evidence. Incorrect question ids and weak topic slugs upsert personal `MistakeReviewItem` records; a later correct answer resolves the matching question item.

### Constructed-response practice

1. Reusable written-practice definitions live in `apps/web/lib/chapter-practice.ts`; lesson markdown places a definition with `[[written-practice:<item-id>]]`.
2. `WrittenPracticeCard` keeps the student's answer text in browser memory only. After a genuine attempt, the student reveals and self-checks an integer half-mark rubric.
3. The web sends only structured evidence—score, rubric point ids, weak skill slugs, answer length, and an idempotent client attempt id—to `/v1/progress/practice`.
4. The API validates that the chapter and lesson are published, stores an immutable `WrittenPracticeAttempt` with its practice kind, and emits `written_practice_scored` for written practice, timed diagnostics, or workbenches. Recent structured attempts can be restored across devices.
5. D0/D3/D7 retention is derived from immutable attempt timestamps rather than mutable completion flags. D0 starts at the first score of at least 80%; separate qualifying attempts on or after day 3 and day 7 complete the later checkpoints. One late attempt cannot satisfy both D3 and D7.
6. Written-practice evidence remains separate from `ChapterMastery` until a reviewed readiness formula exists; recording a self-score or waiting for a date must not silently award exam readiness.
7. Structured practice saves also record whether hints were opened and which rubric point ids were missed. Draft and final answer text remain browser-only; only the bounded review evidence can create `hint_used` or `written_marking_point` mistake items.

### Personal recovery and Exam Ready

1. `MistakeReviewItem` is the API-owned personal revision queue for incorrect quiz questions, weak concepts, hint use, and missed written-answer marking points. Repeated evidence reopens the same stable item and schedules the next retry three days after the newest attempt.
2. `/my-mistakes` loads active, revised, or all items from `/v1/progress/mistakes`. Students can mark an item revised or reopen it; new evidence always reopens the item.
3. `ExamReadyChecklist` stores only the three honest student confirmations: concepts studied, NCERT questions attempted, and weak areas revised. Written-answer completion, a 70% quiz target, and D3 recall are derived from immutable evidence.
4. A chapter can show Exam Ready only from its saved checklist and evidence. Page views, elapsed dates, and focus-session timers never complete checklist evidence.

### Fun&Games Arcade & Formula Rush

1. The `/games` route is the student Arcade hub (`GamesArcadeHub.tsx`), serving gamified active recall power breaks derived 100% from NCERT textbooks.
2. **Formula Rush** (`/games/formula-rush` and `FormulaRushGame.tsx`) is the first playable game engine, supporting 60s Blitz (with streak multipliers), 3-Lives Survival, and Topic-Specific Practice.
3. Questions and formulas live in `apps/web/lib/games/formula-rush-data.ts` using KaTeX formatting, with instant explanations and NCERT chapter references.
4. `apps/web/lib/games/sound-effects.ts` provides zero-lag synthesized Web Audio SFX (chimes, combo chords, error thuds, victory fanfare) with local mute control.
5. Post-game mistake review UI uses namespaced `.rush-mistake-*` styling in `arcade.css` to guarantee high contrast across light and dark themes.

Timed diagnostics use the same chapter-independent attempt API through
definitions in `apps/web/lib/exam-practice.ts` and
`[[exam-practice:<item-id>]]` lesson markers. `ExamPracticeCard` stores
wall-clock writing and checking deadlines locally so refreshes cannot reset an
active attempt. Score, first weak skill, and condition confirmations are
recorded only after the timer. An attempt with any unconfirmed exam condition
is saved with `retentionEligible: false`: it remains useful practice history
but cannot create retention evidence.

The equation workbench reuses this structured-attempt path. Its reviewed
dataset contains explicit atom maps; students can edit coefficients only.
Completion with any hint is recorded as guided practice, while D0 mastery
requires all four equations independently in their smallest whole-number
ratios. The generic demo dispatcher detects registered balance workbenches
without a Chapter 1 branch in the component or API.

### Admin and pilot review

1. Admin routes require an admin session.
2. The admin app calls protected API review endpoints.
3. The API aggregates `ProgressEvent` engagement and feedback records for decision-making surfaces.
4. Learning help uses a `stuck` feedback category with five fixed reasons. These stay in the manual pilot-review queue; no AI tutor or automated answer generation is attached.

### Sample test papers (Maths 041 pilot)

1. The paper engine lives in `apps/api/src/lib/exam-papers/`: a sourced section layout, a seeded demand planner that holds every unit to its exact official weightage, and a coverage-aware selector that fails loudly instead of emitting an invalid paper.
2. The single source of truth for the Maths 041 blueprint is the web curriculum registry. `npm run exam:snapshot` regenerates `apps/api/src/lib/exam-papers/maths-041-blueprint.generated.ts`, and a drift-guard test prevents silent divergence. Only blueprint-ready subjects (`blueprintStatus: ready`) can generate papers.
3. The curated question bank lives in the `QuestionBankQuestion` table. Seeded rows start in `review`; only `verified` questions enter papers (`npm run seed:bank`, `seed:bank:validate`, `seed:bank:analyze` -w apps/api).
4. `POST /v1/exam-papers/generate` assembles a paper from verified bank rows, runs advisory AI verification (Gemini, clean pass only), persists `ExamPaper` + `ExamPaperQuestion` snapshots, and returns the paper. `GET /v1/exam-papers/:id` is owner/admin scoped.
5. Admin review surfaces in `apps/api/src/routes/exam-papers.ts`: paper approve/reject and bank verify/approve/reject. AI verdicts never auto-publish; only an admin approve marks a paper `published`.
6. The student web app generates papers via `/exam-papers` and renders printable papers (with an answer-key toggle) at `/exam-papers/[id]`; subject pages link to the generator only for blueprint-ready subjects.

### AI Tutor "Tara-Firefly"

1. **RAG corpus**: `npm run rag:build -w apps/api` reads chapter packs (`docs/content/class-10/**/chapter-pack.md`) and lesson notes (`apps/web/content/**/lessons/*.md`), chunks by headings (300–600 words, undersized chunks merged), embeds with `gemini-embedding-001` (3072-dim), and upserts into `RagChunk` (pgvector). The build is incremental via `contentHash`. Design decisions: `docs/rag-corpus.md`.
2. **Retrieval**: `apps/api/src/lib/rag/retrieve.ts` embeds the student query and returns top-k (6) chunks by cosine similarity with a 0.35 score floor; below the floor the tutor must answer honestly that the topic is not in its notes. `POST /v1/tutor/search` is the debug/QA surface.
3. **Conversation persistence**: `TutorConversation`, `TutorMessage`, `TutorAttachment` (RLS, user-scoped) hold the per-student chat history. Attachments (image/PDF) are uploaded to the Bunny Storage zone; only metadata is stored in Postgres.
4. **Answer generation**: `apps/api/src/lib/tutor/tara.ts` defines the Tara-Firefly persona (NCERT single source of truth, simple English, honest refusals, no fake marks guarantees). `generate.ts` calls `gemini-2.5-flash` (temperature 0.3, JSON output contract, HARM_CATEGORY safety settings) with retrieved chunks, conversation history, and any inline image parts. `format.ts` sanitizes the markdown (strips HTML, normalizes `$`/`$$` math) before storage/rendering.
5. **Chat endpoint**: `POST /v1/tutor/conversations/:id/messages` accepts multipart (question + up to 5 files), validates types/sizes, persists the user message, retrieves chunks, streams the assistant answer as SSE, and persists it with `citedChunkIds`. A per-student daily quota (`TUTOR_DAILY_LIMIT`, default 30) is enforced server-side. A JSON fallback route exists for text-only sends.
6. **Web UI**: `TaraWidget` (bubble + chat window) is mounted in the root web layout and auto-hides for unauthenticated visitors. It renders sanitized markdown with KaTeX math, shows citation chips, supports multi-file attach, and streams replies. Next.js proxy routes under `/api/tutor/**` forward to the API and pass SSE through without buffering.

## Dependency and impact checks

For cross-module changes:

1. Start from the owning file or route above.
2. Use `rg` and TypeScript imports to find callers and consumers.
3. Check route registration, content registries, generated files, and Prisma migrations where relevant.
4. Inspect `git diff` for unintended scope.
5. Run the narrowest focused checks authorised by the current repository verification policy.

The ignored code graph at `graphify-out/code/graph.json` is an advisory index for architecture and impact questions. Use focused `explain`, `affected`, `path`, or budgeted queries to select source files, then verify those files and their imports directly. Graphify is not an architectural source of truth, verification requirement, push gate, automatic refresh, or Git-hook workflow. Historical plans and reports may mention former Graphify requirements; those steps are obsolete.
