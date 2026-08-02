---
type: DeveloperGuidelines
title: Agent Operating Rules
description: Repository guidelines, coding styles, testing, and operation instructions for agentic coding.
tags: ['agents', 'guidelines', 'rules']
timestamp: 2026-07-08T12:00:00Z
---

# Repository Guidelines

## Project Structure & Module Organization

This is an npm workspace for a CBSE Class 10 learning platform. `apps/web` is the student-facing Next.js app, `apps/admin` is the admin CMS, and `apps/api` is the Express API with Prisma/PostgreSQL. `apps/mobile` is a Flutter placeholder for future Android/iOS work. Product specs, deployment notes, and backlog live in `docs/`. Code-generated lesson video work lives under `videos/prime-numbers`.

## Build, Test, and Development Commands

- `npm run dev:web` starts the student web app on port 3000.
- `npm run dev:admin` starts the admin app on port 3001.
- `npm run dev:api` starts the API watcher.
- `npm run build` builds web, admin, and API workspaces.
- `npm run lint` runs TypeScript checks across web, admin, and API.
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

History currently only shows `Initial commit`, so use short imperative commit messages such as `Add deployment runbook` or `Implement Bunny video metadata`. Pull requests should include a clear summary, changed areas, verification commands, linked issues if any, and screenshots for visible UI changes.

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

Notes should always we accurate with respect to Textbooks as our platform reputation is on the line.
If Textbook Chapter has figures make sure over platform content also have matching figures.

Figure labels must remain readable and accessible. Prefer numbered pins on the illustration with a matching HTML label key below it; do not bake important labels, captions, safety notes, or observations into the image itself.

Remember our Platform notes are simplified version of Textbook + Tip and Trick + Remember these things+ Gamification + Comic style Recap + Question and Answers + Quiz. Our Platform notes objective should be to make student understand the concepts in easy manner, aids in remembering thing, make the all the topic easy to understand even for Dump students.

We should have same numbering for the Topics in Platform as in textbook. Eg: Science chatper 5: 5.1 What are life processes?
