---
name: "cbse-project"
description: "Repository-specific workflow and operating rules for the CBSE project."
---

# CBSE Project Work

Use this skill for implementation, review, TODO, content, release, or repo-maintenance work in `C:\Sagar\Projects\CBSE\cbse_byCodex`.

## Grounding

Before implementation work, read `docs/architecture.md` and the routing index in `docs/project-memory.md`, then read only the linked memory files relevant to the task. For architecture or cross-module questions, query `graphify-out/code/graph.json` first when it exists, then inspect the returned source files, TypeScript imports, route wiring, and focused tests.

Root `TODO.md` is the immediate handoff. `master_todo.md` is the broader backlog. `docs/project-memory.md` routes to the durable topic logs under `docs/project-memory/`.

## Project Rules

- Work on `main` by default unless the user explicitly asks for a branch or PR.
- Preserve existing dirty worktree changes unless the user explicitly asks to clean or revert them.
- Use `npm.cmd` on Windows when npm shim behavior is unreliable.
- Run build before treating Next.js `.next/types` lint errors as source failures.
- Lesson content is live only when the chapter is registered in `lessonDirectories` and each published lesson has a non-empty `fileName`.
- Gemini lab adaptations should follow the platform path: dependency-free React/canvas component, `LessonDemo.tsx` routing, lesson markdown marker, and targeted test.
- Textbook-derived notes must preserve textbook examples, problem/activity numbering, topics, and section structure while simplifying the explanation.

## Completion Loop

Use `$cbse-focused-workflow` only when its narrow design, hard-debugging, or material-completion triggers match. For code changes, follow the current `AGENTS.md` verification preference: perform only an authorised focused check, and do not run tests, builds, lint, quiz validators, or broad browser sweeps merely because the blast radius is large. Graphify is advisory local context and is never part of the completion or push requirements; do not install hooks, refresh it automatically, or commit its output.

When the user asks to commit and push, also update `TODO.md` with the next task after a successful push.
