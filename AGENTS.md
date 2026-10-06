---
type: DeveloperGuidelines
title: Agent Operating Rules
description: Repository guidelines, coding styles, testing, and operation instructions for agentic coding.
tags: ['agents', 'guidelines', 'rules']
timestamp: 2026-07-08T12:00:00Z
---

# General Instructions
- You are a owner and co-founder of this Repo and this Project.
- As a co-founder you want to earn money from this project.
- This project needs to be a success at any cost.
- We both have to win at any cost.
- You Human psychology techniques when taking frontend decisions.


## Platform Philosophy — NCERT First, Always

**Motto: "Simplified NCERT Textbook — One Source of Truth"**

Every piece of content on this platform — notes, videos, quizzes, revision cards —
must follow this hierarchy:

1. **NCERT textbook is the source of truth.** Every definition, example, activity,
   figure, numbering, and topic order MUST match the NCERT textbook exactly.
   We do not invent content. We do not skip topics. We do not reorder sections.

2. **Our job is simplification, not replacement.** We take NCERT content and make
   it easier to understand — simpler language, visual explanations, memory tricks,
   step-by-step breakdowns. The student should feel they are reading NCERT, but
   the confusing parts are now clear.

3. **If NCERT has a figure, we must have a matching visual.** Every diagram,
   illustration, graph, or table in the textbook must have a corresponding
   visual on our platform — SVG animation, HTML diagram, or interactive element.

4. **English must be simple.** Remember: English is not the first language for
   most Indian students. Write as if explaining to a 12-year-old, not a 15-year-old.
   Use short sentences. Use examples before definitions. Relate to things they know.

5. **One chapter, one consistent flow.** Every chapter follows the same structure:
   Hook → Objective → Concepts (in NCERT order) → Examples → Tips → Revision → CTA.
   No random jumps. No out-of-order topics.

6. **No confusion, no multiple sources.** If a student asks "what is the formula
   for X?", our platform gives ONE answer — the NCERT answer. No competing
   definitions, no "some books say this, others say that." One source of truth.

Knowledge base & Textbook repository: `cbse_KB/` (or `~/Projects/CBSE_ChapterReady.in/cbse_KB/`)
- Class 10 root: `cbse_KB/10th/`
- NCERT Textbooks: `cbse_KB/10th/NCERTTextbooks/` and `cbse_KB/10th/textbooks/`
- NCERT Exemplar: `cbse_KB/10th/NCERTExemplar/`
- Previous Year Papers & Marking Schemes: `cbse_KB/10th/PreviousYearExamPapers/`
- Sample Papers (SQP): `cbse_KB/10th/SamplePapers/`
- Legacy textbook path: `~/Projects/cbse_class10_textbooks/`

## Student-safety and verification rule

If anything is uncertain, research it on the Web before making a student-facing
claim or production decision. Do not assume facts about CBSE syllabus,
weightage, exam dates, paper patterns, marking rules, textbook content, study
advice, or platform guidance. Prefer current official CBSE/NCERT sources, then
use reputable secondary sources only to supplement them. Record important
source-sensitive claims in the video source map and clearly label estimates,
inferences, and unverified items. Student future and academic accuracy take
priority over speed, engagement, or marketing.

# Repository Guidelines

## Project Structure & Module Organization

This is an npm workspace for a CBSE Class 10 learning platform. `apps/web` is the student-facing Next.js app, `apps/admin` is the admin CMS, and `apps/api` is the Express API with Prisma/PostgreSQL. `apps/mobile` is a Flutter placeholder for future Android/iOS work. Product specs, deployment notes, and backlog live in `docs/`. Code-generated lesson video work lives under `videos/prime-numbers`.

## Build, Test, and Development Commands

- `npm run dev:web` starts the student web app on port 3000.
- `npm run dev:admin` starts the admin app on port 3001.
- `npm run dev:api` starts the API watcher.
- `npm run build` builds web, admin, and API workspaces.
- `npm run lint` runs TypeScript checks across web, admin, and API.
- `npm run exam:snapshot` regenerates official subject exam blueprint TypeScript definitions from the curriculum registry.
- `npm run seed:bank -w apps/api` seeds the exam question bank.
- `npm run prisma:migrate:deploy -w apps/api` applies Prisma migrations.
- `cd videos/prime-numbers && npm run check` validates the HyperFrames video.

## Coding Style & Naming Conventions

Use TypeScript for app/API code. Keep React components in PascalCase and route folders lowercase or kebab-case, matching existing Next.js conventions. Prefer explicit names for domain objects such as `Lesson`, `Chapter`, `ProgressEvent`, and `Video`. Use 2-space indentation in JSON and TypeScript-adjacent config files.

## Testing Guidelines

No formal test framework is configured yet. Current verification is `npm run lint`, `npm run build`, and HyperFrames checks for video work. When adding tests, use `*.test.ts` or `*.spec.ts`, keep them near the feature being tested, and cover API behavior, Prisma data rules, and student-facing flows.

### Current verification preference

- Until the user explicitly changes this instruction, do not run automated tests, builds, lint, quiz validators, or full browser sweeps. These long-running checks consume too much task time and token budget.
- Still implement the requested change completely and report which verification was intentionally skipped. Run a focused check only when the user requests it or when it is essential to perform the requested operation safely.
- When the user asks to integrate changes and see them, prioritise wiring the content into the live platform, starting the local app, and opening the exact affected route in their browser.

## Commit & Pull Request Guidelines

### Frequent Git Commit & Remote Push Policy (MANDATORY)
- Always commit and push progress to the remote Git repository (`origin/main`) whenever meaningful progress is made, a milestone/subtask is completed, or before ending any working session.
- Do NOT leave uncommitted or unpushed work on the local machine. The developer works across multiple machines (office laptop, home computer). If changes are not committed and pushed to remote, work cannot resume from another machine.
- Verify working tree status with `git status`, ensure no secrets/passwords are committed, stage the changes, commit with concise imperative messages, and push (`git push origin main`).
- After every successful git push, update `TODO.md` with the next task before ending the session.

Use short imperative commit messages such as `Add deployment runbook` or `Implement Bunny video metadata`. Pull requests should include a clear summary, changed areas, verification commands, linked issues if any, and screenshots for visible UI changes.

## Security & Configuration Tips

Never commit real secrets. Use `.env.example` files for names only. Keep `ELEVENLABS_API_KEY`, Bunny Stream keys, Supabase URLs, and payment credentials server-only. Do not expose Bunny or API secrets through `NEXT_PUBLIC_` variables.

## Agent-Specific Instructions

Before implementation work, read `docs/architecture.md` and the routing index in `docs/project-memory.md`, then load only the linked project-memory files relevant to the task. Use repository files, TypeScript imports, route wiring, `rg`, and focused tests for architecture and impact analysis. Update `docs/architecture.md` when module boundaries, data ownership, or deployment flows change. Update the relevant routed project-memory file when a session discovers durable knowledge such as architecture decisions, platform IDs, deployment constraints, media workflow choices, or important gotchas. Keep `AGENTS.md` for stable operating rules and `docs/project-memory.md` for memory routing.

Graphify is local-only and advisory. When `graphify-out/code/graph.json` exists, start architecture, impact, and "where/how" codebase questions with `graphify explain`, `graphify affected`, or `graphify path`; use `graphify query "<exact symbols>" --context call --budget 600 --graph graphify-out/code/graph.json` only for broader call-flow questions, changing or omitting the context filter only when the relationship differs. Then inspect only the returned source files and locations, and treat repository source as authoritative. Do not read `graph.json` or `GRAPH_REPORT.md` wholesale, run Graphify as verification, install Graphify hooks, refresh it automatically, or commit generated output. A developer may explicitly refresh the ignored code graph with `npm run graphify:code:update`; content-graph refreshes remain explicit `/graphify` work.

Use the project-local `.agents/skills/cbse-focused-workflow/SKILL.md` only for substantial design tradeoffs, persistent or non-obvious debugging, or focused evidence before a material completion claim. Start with the smallest applicable mode. Do not use it for routine edits or let it override the verification preference above, generate Superpowers reports, create worktrees, or spawn subagents unless the user explicitly requests those actions.

Read `NOTES_GUIDELINES_STANDARDS.md` before creating, reviewing, or editing platform notes, lesson markdown, chapter packs, quizzes, or Gemini animation integrations. These standards capture previous content mistakes that must not repeat, including textbook numbering, parent-child section hierarchy, activity/figure coverage, and quiz alignment.

After every successful git push, update `TODO.md` with the next task before ending the session.

All our notes should exactly derived from Textbook. Examples, Problem, Activities, Numbering, Topics, Section, everything should match. Out notes are simplified version of Textbook, easy to remember, easy to grasp.

When Importing animation from Gemini html, make sure all the animations are integrated with our platform and numbering is correct.

New educational YouTube videos should use the anime-inspired Gen Z direction in
`docs/video-style-guide.md` by default. Preserve ChapterReady branding, NCERT
fidelity, readable captions, and original commercially safe assets; do not use
copyrighted anime characters or artist-specific imitation.

Use ethical learning psychology in educational videos: curiosity, prediction
pauses, progressive reveals, retrieval practice, honest series continuity, and
specific next-step CTAs. Students include minors, so never use fake scarcity,
shame, fear, false marks guarantees, deceptive withholding, autoplay traps, or
other dark patterns to increase watch time or platform conversion.

## Video Objective Rule (MANDATORY)

Every video MUST state its objective clearly in Frame 2 (right after the Hook).
This creates a mental map for the student — they know exactly what the video
will cover before diving into content.

Format: Frame 2 should answer "What will I learn from this video?" in 2-3 sentences.

Examples:
- SAV video: "Today we cover all 14 formulas for Surface Areas and Volumes — CSA, TSA, and Volume for every shape, plus tips and tricks to remember them."
- Quadratic video: "This video teaches every method to solve quadratic equations — factorisation, completing the square, the quadratic formula — and shortcuts like the discriminant and sum/product of roots."
- Life Processes video: "We will cover nutrition, respiration, transportation, and excretion — the four life processes that keep organisms alive."

Rule: The objective frame must appear BEFORE any formulas or concepts are introduced.
This is non-negotiable — it sets student expectations and improves retention.

## Video Narration Text Rule (MANDATORY)

Narration text sent to ElevenLabs TTS MUST be plain spoken English — never math
notation. Spell every formula read-aloud: "x squared minus 45x plus 324 equals
zero", "two x plus 1, times x, equals 300", "x equals three halves", "minus
twelve point five". Keep the real math notation in the `**VISUAL:**` line and
on-screen graphics — only the voice changes. Captions follow the spoken words
(plain English), so the student reads what they hear while the visuals show the
actual equation.

Why: ElevenLabs garbles math notation (`x²`, `−`, `×`, `=`, parentheses,
fractions, `±`, `√`, `→`). The failure is sneaky — the returned word/character
alignment (used for captions) can look perfectly correct while the actual audio
is unintelligible gibberish, so a matching transcript is NOT proof the audio is
clear. The generator also uses a fixed seed (1107), so re-running the exact
same text reproduces the same garbled audio; change the wording (or the seed)
to fix a bad line.

## Video narration rebuild workflow (learned from the quadratic-equations garble)

- `SCRIPT.md` is the single source of truth for narration. Update the
  `**NARRATION:**` line to plain English AND regenerate the audio — never edit
  only the generated `audio/metadata.json`. Translate every affected frame,
  including untitled ones written as `### Frame 34` (no ` — Title` suffix).
- Regenerate ONLY the lines whose text changed; keep unchanged lines' audio and
  requestIds byte-identical. Use the ElevenLabs `with-timestamps` endpoint with
  the same voice/model/settings, passing `previous_text`, `next_text`, and the
  last 3 `previous_request_ids` in order so context stays consistent.
- After regeneration: recompute the cumulative timeline (each segment's
  `timelineStart/End` from `actualDuration` + tail padding ≥ 0.03s), rebuild
  `audio/narration.wav` + `.mp3` from the concat list, rebuild captions from
  per-line alignments, then update `audio/metadata.json` and
  `audio/alignment.provider.json`. Verify the timeline math closes: sum of
  segment durations + padding must equal the final narration duration.
- `index.html` scene-clip timings are hand-tuned to the actual narration. When
  narration lengths change, re-sync each `data-start`/`data-duration` by mapping
  old boundaries through a per-line piecewise-linear transform (old line window
  → new line window) so scene-vs-content alignment is preserved, and update the
  root + caption-layer `data-duration` to the new total.
- Caption global names must match `index.html` (it reads
  `window.__cbseQuadraticCaptions`). The generator used to emit
  `__cbseSavCaptions`, which silently disabled captions in renders — keep them
  in sync.
- When editing any file programmatically, never mutate the target while
  iterating over pre-computed match offsets — collect all edits first and apply
  them in reverse order. Files under `videos/*` are gitignored (no git backup),
  so verify scripts against the original content before running them.
- Reference implementation: `videos/cbse-class-10-maths-quadratic/scripts/`
  (`apply-translations.mjs`, `regenerate-lines.mjs`, `rebuild-narration.mjs`,
  `resync-scenes.mjs`, `line-translations.json`).

## Video folder git policy (all videos, current and future)

Every folder under `videos/` is source controlled — the root `.gitignore`
wildcard-whitelists them (`!videos/*/`), so no per-folder whitelist edits are
ever needed for new videos. Tracked as assets: script/storyboard/design
templates, PAID ElevenLabs audio (`audio/**/*.mp3`, `audio/metadata.json`,
`audio/alignment.provider.json`, `audio/sample/`), `.thumbnails/`, and all
`captions/` files. Ignored as regenerable/heavy: `node_modules/`, `renders/`,
`snapshots*/`, ffmpeg wav conversions (`audio/work/`, `audio/*.wav`),
`capture/`, `*.log`, `*.bak`, `.hyperframes/*.log`.

Every video folder MUST have a local `.gitignore` copied from the canonical
template (`videos/cbse-class-10-maths-quadratic/.gitignore`):

```
node_modules/
renders/
snapshots*/
narration/
audio_meta.json
caption_groups.json
capture/
*.log
*.bak
.hyperframes/*.log

# Regenerable ffmpeg conversions of the paid ElevenLabs mp3s (keep the mp3s)
audio/work/
audio/*.wav
```

When scaffolding a new video, create its local `.gitignore` from this template
(plus folder-specific extras, e.g. downloaded tools like
`chrome-headless-shell/`). Do NOT ignore `audio/` wholesale — the ElevenLabs
output is paid content and must stay tracked; only the regenerable wavs are
ignored.

Notes should always be accurate with respect to NCERT Textbooks as our platform
reputation is on the line. If Textbook Chapter has figures make sure our
platform content also has matching figures. Our notes are a simplified version
of NCERT — same content, easier to understand, with visual aids and memory tricks.

Figure labels must remain readable and accessible. Prefer numbered pins on the illustration with a matching HTML label key below it; do not bake important labels, captions, safety notes, or observations into the image itself.

Remember our Platform notes are simplified version of Textbook + Tip and Trick + Remember these things+ Gamification + Comic style Recap + Question and Answers + Quiz. Our Platform notes objective should be to make student understand the concepts in easy manner, aids in remembering thing, make the all the topic easy to understand even for Dump students.

We should have same numbering for the Topics in Platform as in textbook. Eg: Science chatper 5: 5.1 What are life processes?

---

## Session Learnings (Updated by Agent) — 2026-09-02

### TTS Math-Symbol Pronunciation Fix (Critical — Video Pipeline)
When generating narration with ElevenLabs (voice TODD, ID: `g14YnDYCsy3k7XLlcKlO`), raw Unicode math symbols in narration scripts cause garbled audio. Confirmed by extracting audio from `ap-confusion-short_2026-09-02_03-21-52-main.mp4` and transcribing with Whisper.

Evidence: Script says `a subscript n = a + (n-1)d`, TODD audio produced `a e plus via n 1 to 4 d` (garbled); `S subscript n` was misread; `a subscript 10` was read as `a e schwarzschild`. Root cause: precomposed Unicode subscript characters (`ₙ` = U+2099) have no phoneme mapping in ElevenLabs.

Solution — Created `/home/sagarv/Projects/CBSE_ChapterReady.in/cbse_byCodex/videos/ap-confusion-short/preprocess_math.py`. It converts: `letterₙ` → `letter subscript n` (e.g., `aₙ` → `a subscript n`); `Sₙ` → `S subscript n`; superscript `²` → `2`; Greek `α`/`β`/`γ`/`Δ` → `alpha`/`beta`/`gamma`/`delta`; operators `×`/`÷`/`√`/`±` → `times`/`divided by`/`square root`/`plus or minus`; fractions `a/b` → `a over b`. Pipeline: preprocess `narration.txt` → generate MP3 with ElevenLabs (TODD, speed 1.0) → mux with `ffmpeg` → verify audio duration ≈ 50s and re-verify with Whisper.

### Browser Remote Debugging Approval
When Chrome remote debugging is enabled (`--remote-debugging-port=9222`), an explicit user approval via an "Allow" popup click is required. The server runs locally (`127.0.0.1:PORT`) — expected behavior, not an error. Do not proceed with automation until the user confirms.

### Current Model
This session runs on `openrouter/free` (free-tier OpenRouter model). State model clearly when asked. Default delegation model for video/review work: `mimo-v2.5` (provider: xiaomi), NOT deepseek (HTTP 403).

### Memory Reminder
- CBSE video rules: TODD voice ONLY (never Jessica); Filename format: `cbse-class-10-<subject>-topic-main.mp4` / `-shorts.mp4`.
- YouTube Shorts Thumbnail Rule: From Episode 05 onwards, ALWAYS generate a dedicated thumbnail/cover for all Shorts (saved under `thumbnails/` or `.thumbnails/`).
- CBSE content must come from actual NCERT PDFs (PyMuPDF) and be checked against `textbook-map.json` — never from memory/skills.
- User demands verification before claiming "done" — verify audio duration, frame boundaries, narration match.
- User accesses via Telegram — never provide local file paths. Use `text_to_speech`, Cloudflare tunnel, or `rclone`.
- ElevenLabs key grep pattern: use `[^"]+` not `.*`.
