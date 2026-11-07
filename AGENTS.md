---
type: DeveloperGuidelines
title: cbse_byCodex Operating Rules (Always-Loaded)
description: Behavioural rules, commands, content non-negotiables, backlog and gotchas for cbse_byCodex. Deep reference lives in docs/agents/.
tags: ['agents', 'guidelines', 'backlog']
---

# cbse_byCodex Operating Rules

> **Notice:** Always-loaded rules for `cbse_byCodex`. Workspace-wide rules, cross-repo map and the proactive self-update protocol live in the workspace root [`../AGENTS.md`](../AGENTS.md). Deep reference material lives in [`docs/agents/`](docs/agents/) and must be read on demand when touching that area.
>
> **Size budget:** This file must stay **under 20 KB** (agents truncate rule files at 24 KB). Put long tables, schemas and templates in `docs/agents/` and link them.

---

## Table of Contents
1. MANDATORY Instructions & Co-Founder Mindset
2. Platform Philosophy — NCERT First, Always
3. Repository Architecture, Commands & Deployment
4. Deep Reference Index (read on demand)
5. Content Non-Negotiables
6. Active Sprint Handoffs & Backlog
7. Session Learnings, Gotchas & Pre-Close Checklist
8. Proactive Maintenance Protocol

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

## 4. Deep Reference Index (read on demand)

| Topic | File | Read before touching |
| :--- | :--- | :--- |
| Prisma entities, constraints | [docs/agents/data-model-summary.md](docs/agents/data-model-summary.md) | `apps/api/prisma/`, progress/quiz/payment routes |
| Subject codes, rationalized syllabus | [docs/agents/curriculum-registry.md](docs/agents/curriculum-registry.md) | `apps/web/lib/curriculum/`, notes, paper generator |
| Markdown parser triggers, KaTeX/chem syntax, figure tokens, card CSS | [docs/agents/notes-formatting.md](docs/agents/notes-formatting.md) | lesson notes, `LessonNotesContent.tsx` |
| Quizzes, mock papers, evaluator, games, Tara RAG, optics engine | [docs/agents/assessment-and-tutor.md](docs/agents/assessment-and-tutor.md) | `exam-papers/`, `evaluator/`, `rag/`, `optics-engine.ts` |
| Video style, Frame 2 rule, TTS math, voices, audio mix | [docs/agents/video-pipeline.md](docs/agents/video-pipeline.md) | anything in `../cbse_videos/` |
| Pricing table, product slugs, DRM | [docs/agents/business-and-drm.md](docs/agents/business-and-drm.md) | `/store`, payments, printable PDFs |

Source of truth always wins over these summaries: `apps/api/prisma/schema.prisma`, `apps/web/lib/curriculum/subjects/class-10/*.ts`, `apps/api/src/routes/`.

---

## 5. CBSE Portal Notes, Alignment & Formatting Standards

### 5.1 Non-Negotiable Content Rules
1. **Preserve Textbook Numbering:** Student-facing titles, H1s, H2s, cards, and navigation **must** use exact textbook numbering (`5.1 What are life processes?`, `5.2 Nutrition`, `5.2.1 Autotrophic nutrition`). Never jump from `5.1` directly to `5.2.1` without parent `5.2`.
2. **Preserve Textbook Order:** Do not rearrange sections for flow convenience.
3. **Preserve Activities & Numbers:** Every textbook activity must be represented (`Activity 5.1`, `Activity 5.2`). Gemini animations must match these exact numbers.
4. **Preserve Figures & Numbers:** Keep exact textbook labels (`Figure 5.1: Cross-section of a leaf`).
5. **Preserve Textbook Questions Blocks:** Place `Questions and answers` exactly where the textbook has a `Questions` block (e.g., immediately after `5.1` before `5.2`). Do not paraphrase or invent questions.
6. **No Unsupported Claims:** Tips, tricks, and comic dialogues must derive purely from textbook concepts.
7. **Do Not Over-Compress Science:** Explain mechanisms fully (e.g., chlorophyll, carbon dioxide, stomata, light reaction events, ATP, pyruvate pathways).

- **Math/chem syntax:** KaTeX `$...$` inline / `$$...$$` display; plain-text chemical formulas auto-subscript outside math. Full parser triggers: [notes-formatting.md](docs/agents/notes-formatting.md).

---

## 6. Active Sprint Handoffs & Master Task Backlog

### 6.1 Recently Completed Deployments & Shipments
- [x] **Android PWA & TWA Mobile App Shell (Phase 1)**: Added Web App Manifest (`app/manifest.ts`), generated standard & maskable icons (`192x192`, `512x512`, `apple-touch-icon.png`), added Digital Asset Links (`public/.well-known/assetlinks.json`) for `in.chapterready.app`, built 5-tab thumb-friendly `MobileBottomNav.tsx` with zero-collision stacking for `.lesson-mobile-navigation` and Study Remix `.miniPlayer`, enhanced `TaraWidget.tsx` with `100dvh` full-screen mobile sheet and Google Play AI compliance `🚩 Report` flagging, implemented offline Service Worker (`public/sw.js`) and `/offline` fallback, and integrated `lib/twa.ts` payment switch (`NEXT_PUBLIC_TWA_PAYMENTS_MODE`). Deployed live (dpl_EfwHNGn7rx4wZZTwoh2MH1caCo1E) with bold Result Score hero card.
- [x] **Android App Release Packaging & Signing (Phase 2)**: Generated release signing key `chapterready-release.keystore` and extracted upload SHA-256 fingerprint into `apps/web/public/.well-known/assetlinks.json`. Built production Android App Bundle (`app-release-bundle.aab`, 1.3 MB) for Google Play Console and direct-install APK (`app-release-signed.apk`, 1.23 MB) via `@bubblewrap/cli` with OpenJDK 17 and `minSdkVersion 24`.
- [x] **Tara Chat Session Isolation Fix**: Keyed `TaraWidget` conversation state to `useStudentSession()` (`session?.id`), added `cbse:auth-change` events on login/register/logout, cleared in-memory chat state on user switch, added `dynamic = 'force-dynamic'` + `cache: 'no-store'` + `Cache-Control: no-store` to `/api/tutor/conversations` routes, and verified via Playwright E2E `tara-session-isolation.spec.ts` (Vercel deployment `dpl_FpLo1v2K41wNM3aMzDZvXrqLjqTk`).
- [x] **Question Bank Navigation & Auth Fix**: Added `StudentTopbar` to `/questions` & `/questions/[slug]`, routed logged-in breadcrumbs to `/dashboard`, made session cookies client-readable (`httpOnly: false`), and added `/api/auth/session` fallback.
- [x] **Programmatic Question Bank (`/questions` & `/questions/[slug]`)**: 1,669+ Exemplar & 2022–2026 PYQ pages with Schema.org `QAPage`, step marks, examiner notes, and 1-click `#d9f99d` Tara Socratic hints.
- [x] **Parent Progress Summary (`/parent-summary`) & Student Dashboard Redesign ("One Screen, One Question")**.
- [x] **Tara Optics Engine (Tables 9.1 & 9.2), Formula Rush Arcade, Grounded AI Evaluator & Free 80M Mock Papers**.

### 6.2 Active Tasks in Queue
- [ ] **Automated Weekly Parent Digest Notification**: Trigger Sunday evening WhatsApp / email digests to parents detailing study consistency and countdown to board exams.
- [ ] **YouTube Section Formula Short Upload**: Upload `cbse-class-10-maths-section-formula-ratio-shorts.mp4` with dedicated 9:16 thumbnail to YouTube Studio.
- [ ] **Live ₹2 UPI Transaction Test**: Perform an end-to-end UPI payment test on `https://www.chapterready.in/store` in production.\r\n- [ ] **Google Play Store App Submission**: Developer Account registered (support@chapterready.in, ID 6699761686534634453). Awaiting Google ID verification to upload app-release-bundle.aab.
- [ ] **Roll Out Full Lesson-Wise Notes**: Continue expanding lesson-wise notes across Science, Mathematics, and Social Science matching notes guidelines.

---

## 7. Session Learnings, Known Gotchas & Pre-Close Checklist

### 7.1 Critical Session Learnings & Engineering Gotchas
1. **TTS Math Subscript Failure:** ElevenLabs cannot pronounce Unicode subscripts (`ₙ` = U+2099). Always run `preprocess_math.py` or write out `"a subscript n"`.
2. **GSAP ID Prefix Requirement:** Element IDs in HyperFrames must begin with a letter (e.g., `f02-photo`, not `02-photo`). Digit-leading IDs cause GSAP's `querySelectorAll` to throw an exception and crash the scene timeline.
3. **Ffmpeg Audio Loop Graphs:** Do not chain crossfade-loop `amix,atrim` with `volume/afade` in a single complex filtergraph. Run loop pass 1 to disk, then mix/duck pass 2.
4. **Contrast Rules on Warm Paper:** Orange `#f3883b` on cream paper (`#f7f2e7`) fails WCAG AA (2.24:1). Use `#d26b16` for headings (3.21:1) and `#a84a08` for small labels and equations (5.16:1).
5. **Vercel Serverless File Tracing:** `apps/web/content/**/*` must be included in serverless function traces so markdown files resolve reliably in deployed lambdas.
6. **Strict Prisma Interactive Transaction Timeout:** Multi-table transactions (mastery + streaks + missions + badges) can exceed the default 5s timeout. Use explicit `maxWait: 10000` and `timeout: 15000` in `apps/api/src/routes/progress.ts`.
7. **Student Session Cookie & Navigation Routing:** Client components require client access to `cbse_student_session` (`httpOnly: false`). Fallback endpoint `/api/auth/session` handles legacy sessions. Breadcrumbs across all routes must route logged-in students to `/dashboard` ("Dashboard") and unauthenticated visitors to `/` ("Home").

### 7.2 Pre-Close Verification Checklist
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
## 8. Proactive Maintenance Protocol

1. **Single Source of Truth:** Do **NOT** create ad hoc scratch documents or standalone design notes. Record architecture updates and gotchas directly in `AGENTS.md` or `docs/agents/`.
2. **Task Handoff & Route Sync:** Check off completed items in Section 6.1, update queued tasks in Section 6.2, and keep API routes and Prisma models synced in `docs/agents/`.
3. **Size Budget (< 18 KB):** Never exceed 20 KB (truncated at 24 KB). Compact shipped backlog and move deep reference into `docs/agents/`. Enforced by `.githooks/pre-commit`:
   ```bash
   git config core.hooksPath .githooks && git -C cbse_byCodex config core.hooksPath .githooks
   ```
