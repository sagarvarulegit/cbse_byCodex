---
type: ProjectMemoryTopic
title: Agent Knowledge Workflow
description: Durable rules for routing agent context, local knowledge tools, and documentation hygiene.
tags: ['memory', 'agents', 'graphify', 'documentation']
timestamp: 2026-08-05T00:00:00Z
---

# Agent Knowledge Workflow

Read this file for agent configuration, repository knowledge routing, Graphify, SkillOpt-Sleep, and documentation-format work.

## Knowledge ownership

- `docs/architecture.md` is the manually maintained map of module boundaries, data ownership, and primary request flows.
- `docs/project-memory.md` is the routing index for durable topic memory under `docs/project-memory/`.
- Stable agent operating rules belong in `AGENTS.md`.
- New durable learnings belong in the narrowest relevant topic file. Add a new topic file when no existing scope fits instead of growing the routing index into another monolith.

## Graphify

- Graphify is local, advisory tooling. Its output belongs under ignored `graphify-out/`, is never a verification or push requirement, and must not be committed.
- The focused code graph belongs at `graphify-out/code/graph.json`. Use exact-symbol `explain`, `affected`, or `path` calls before a broad query. For call flow, use `query` with `--context call` and a budget around 600 tokens; change or omit the context only when the relationship differs. Inspect only the returned source files and locations.
- Refresh the code graph only when a developer explicitly requests it, using `npm run graphify:code:update`. Do not install Graphify Git hooks or treat generated graph files as architectural truth.
- Use the larger root content graph only for explicit content investigations. Keep CLI access on demand rather than attaching an always-on MCP server.

## Agent optimization

- SkillOpt-Sleep is configured through npm scripts (`skillopt:status`, `skillopt:dry-run`, `skillopt:harvest`, `skillopt:run`) and targets the repo-local seed skill at `.agents/skills/cbse-project/SKILL.md`.
- Keep `.skillopt-sleep/` untracked because it can contain harvested session review data and staged proposals.
- Keep large generated corpora and graph caches out of routine deploy commits unless they are explicitly needed for a future session.

## Focused engineering workflow

- `.agents/skills/cbse-focused-workflow/SKILL.md` provides three narrow modes: design for substantial tradeoffs, root-cause debugging for hard failures, and focused evidence before material completion claims.
- Keep the full Superpowers workflow inactive by default. Its mandatory skill chaining, automatic TDD, subagent orchestration, worktrees, and generated reports conflict with this repository's token budget and explicit verification policy.
- Do not create `.superpowers/` or `docs/superpowers/` artifacts unless a developer explicitly requests them. Existing historical artifacts remain excluded from the local Graphify corpus.

## Educational video workflow

- `.agents/skills/education-video-creator/SKILL.md` turns textbook concepts into source-faithful video analysis, concepts, scripts, storyboards, reviews, and production handoffs. It requires a source-fidelity map, a truthful mental model, an accuracy ledger, accessible captions, and an active-recall close.
- If a student-facing claim is uncertain, research it on the Web before authoring or publishing. Verify CBSE/NCERT syllabus, weightage, exam rules, dates, paper patterns, textbook facts, and study guidance against current authoritative sources; label estimates and inferences instead of presenting them as facts.
- Pair the education-video skill with the smallest applicable HyperFrames, faceless-explainer, general-video, animation, CLI, and media skills when implementation is requested. The education-video skill owns pedagogy and source fidelity; the production skills own runtime and tooling contracts.
- Video engagement uses ethical learning psychology: curiosity gaps, prediction pauses, progressive reveals, recognition rewards, retrieval closes, honest series continuity, and concrete practice CTAs. Because the audience includes minors, fake scarcity, shame, fear, guarantees, deceptive withholding, autoplay chains, and other dark patterns are prohibited.
- Its reusable story patterns, production templates, and review gates live under `.agents/skills/education-video-creator/references/`.
- YouTube Shorts production uses the HyperFrames `faceless-explainer` pipeline in `videos/<topic>-short/` (see `videos/nutrition-in-amoeba-short/` as the reference project). Durable gotchas from the 2026-08 production: (1) element IDs must start with a letter — digit-leading ids like `02-...` make GSAP's `querySelectorAll` throw at runtime and fail every timeline; prefix ids `f02-...` while keeping `data-composition-id` digit-prefixed. (2) After renaming id prefixes, every GSAP tween target must match the renamed prefix — a tween built as `"#" + P + "photo"` with `P = "f02-"` silently targets `#f02-photo`; a manually added id like `f02-meet-amoeba-photo` never animates (element stays at its CSS default, e.g. `opacity: 0` — the image is invisible in the render with only a "GSAP target not found" console warning). (3) Offline Kokoro TTS returns no word timings — synthesize even word timings from each line's `duration_s` in `audio_meta.json` before `captions.mjs build`, or captions are skipped. (4) Brand orange `#f3883b` on paper `#f7f2e7` is 2.24:1 and fails WCAG — use `#d26b16` for large text (3.21:1) and `#a84a08` for small labels (5.16:1); caption skin active-word panel needs `color-mix(62% accent, ink)` for white-on-orange. (5) Fonts load from Google Fonts gstatic URLs at render time (network is available); keep all frames on the same font URLs. (6) `GEMINI_API_KEY` (user env) works for generating realistic hero plates via `gemini-2.5-flash-image` — used as dimmed backdrops behind the flat-design characters; the HyperFrames `check` command has a Gemini-vision snapshot description pass.
- The chapter CTA URL pattern for Shorts is `https://cbse-bycodex-web.vercel.app/chapters/<chapter-slug>` — the exact page the YouTube audience should land on.

## Documentation standards

- Read `NOTES_GUIDELINES_STANDARDS.md` before creating, reviewing, or editing lesson notes, chapter packs, quizzes, or Gemini animation integrations. It captures required textbook numbering, parent-child hierarchy, activity and figure coverage, textbook `Questions` placement, scoring-friendly answers, and quiz alignment.
- Google Cloud Open Knowledge Format (OKF) v0.1 is implemented across core documentation and mathematics chapter packs. `scripts/validate_okf.py` checks required YAML frontmatter and `scripts/make_okf_compliant.py` can format active Markdown files.
