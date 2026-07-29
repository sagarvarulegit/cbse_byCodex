---
type: Architecture
title: CBSE Learning Platform Architecture
description: Manually maintained map of module boundaries, data ownership, and primary application flows.
tags: ['architecture', 'modules', 'data-flow', 'onboarding']
timestamp: 2026-07-21T00:00:00Z
---

# CBSE Learning Platform Architecture

This document is the repository's concise architecture map. Update it when module boundaries, data ownership, or deployment flows change. Record operational discoveries and temporary gotchas in `docs/project-memory.md` instead.

## Workspace map

| Area | Responsibility | Primary sources |
| --- | --- | --- |
| `apps/web` | Student-facing Next.js application, lesson and quiz rendering, curriculum registry, and student flows | `app/`, `components/`, `lib/`, `content/` |
| `apps/admin` | Admin CMS and pilot-review surfaces | `app/`, `lib/` |
| `apps/api` | Express API, authentication, catalog, video, progress, mastery, feedback, and database access | `src/app.ts`, `src/routes/`, `src/lib/`, `prisma/` |
| `apps/mobile` | Placeholder for future Flutter clients | application scaffold only |
| `docs` | Product decisions, content standards, runbooks, architecture, and durable project memory | `architecture.md`, `project-memory.md`, curriculum and content docs |
| `videos` | Code-generated lesson-video projects and media tooling | per-video project directories |

## Source ownership

- Curriculum definitions and session-aware official-source rules live in `apps/web/lib/curriculum/`.
- Student chapter and lesson catalog metadata lives in `apps/web/lib/course-content.ts`.
- Lesson markdown lives in `apps/web/content/<chapter-slug>/lessons/`.
- Maintained chapter packs live under `docs/content/`; generated web pack data lives in `apps/web/lib/chapter-packs.generated.ts`.
- Database models and migrations live under `apps/api/prisma/`. PostgreSQL/Supabase stores application metadata and student state.
- Bunny Stream delivers lesson video. Bunny Storage holds master MP4 archives.
- Textbook fidelity rules live in `NOTES_GUIDELINES_STANDARDS.md`; evolving chapter-specific learnings live in `docs/project-memory.md`.

## Primary flows

### Student lessons

1. A Next.js chapter or lesson route resolves catalog metadata from `apps/web/lib/course-content.ts`; subject chapter cards open the continuous `/chapters/<slug>/notes` route by default.
2. The continuous notes route loads every available lesson in catalog order, while individual lesson routes remain available for direct remediation links. Lesson markdown is loaded from `apps/web/content/` and parsed into student-facing headings, paragraphs, lists, tables, code blocks, and interactive markers.
3. Static activity and figure markers route through shared React components such as `LessonDemo` and `ActivityIllustration`.
4. Session-aware video, mastery, attempt-history, and feedback data is requested from the API; lesson notes remain readable when optional video lookup is unavailable.

### Quizzes and progress

1. Quiz markdown is parsed and validated in `apps/web/lib/quiz-content.ts` and related validation helpers.
2. The web client submits immutable quiz attempts to the API progress routes.
3. The API stores attempts and updates mastery, streaks, revision missions, and badges through Prisma transactions.
4. Student dashboards and chapter pages read the resulting aggregates without treating missing data as completed progress.

### Constructed-response practice

1. Reusable written-practice definitions live in `apps/web/lib/chapter-practice.ts`; lesson markdown places a definition with `[[written-practice:<item-id>]]`.
2. `WrittenPracticeCard` keeps the student's answer text in browser memory only. After a genuine attempt, the student reveals and self-checks an integer half-mark rubric.
3. The web sends only structured evidence—score, rubric point ids, weak skill slugs, answer length, and an idempotent client attempt id—to `/v1/progress/practice`.
4. The API validates that the chapter and lesson are published, stores an immutable `WrittenPracticeAttempt`, and emits `written_practice_scored`. Recent structured attempts can be restored across devices.
5. D0/D3/D7 retention is derived from immutable attempt timestamps rather than mutable completion flags. D0 starts at the first score of at least 80%; separate qualifying attempts on or after day 3 and day 7 complete the later checkpoints. One late attempt cannot satisfy both D3 and D7.
6. Written-practice evidence remains separate from `ChapterMastery` until a reviewed readiness formula exists; recording a self-score or waiting for a date must not silently award exam readiness.

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

## Dependency and impact checks

For cross-module changes:

1. Start from the owning file or route above.
2. Use `rg` and TypeScript imports to find callers and consumers.
3. Check route registration, content registries, generated files, and Prisma migrations where relevant.
4. Inspect `git diff` for unintended scope.
5. Run the narrowest focused checks authorised by the current repository verification policy.

Graphify may be used manually for a one-off local investigation, but it is not an architectural source of truth, verification requirement, or push gate. Keep its generated output in the ignored `graphify-out/` directory. Historical plans and reports may mention the former Graphify workflow; those steps are obsolete and are not current operating instructions.
