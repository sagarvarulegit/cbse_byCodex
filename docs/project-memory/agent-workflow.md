---
type: ProjectMemoryTopic
title: Agent Knowledge Workflow
description: Durable rules for routing agent context, local knowledge tools, and documentation hygiene.
tags: ['memory', 'agents', 'graphify', 'documentation']
timestamp: 2026-07-30T00:00:00Z
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

## Documentation standards

- Read `NOTES_GUIDELINES_STANDARDS.md` before creating, reviewing, or editing lesson notes, chapter packs, quizzes, or Gemini animation integrations. It captures required textbook numbering, parent-child hierarchy, activity and figure coverage, textbook `Questions` placement, scoring-friendly answers, and quiz alignment.
- Google Cloud Open Knowledge Format (OKF) v0.1 is implemented across core documentation and mathematics chapter packs. `scripts/validate_okf.py` checks required YAML frontmatter and `scripts/make_okf_compliant.py` can format active Markdown files.
