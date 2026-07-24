# CBSE Project Work

Use this skill for implementation, review, TODO, content, release, or repo-maintenance work in `C:\Sagar\Projects\CBSE\cbse_byCodex`.

## Grounding

Before implementation work, read `docs/architecture.md` and `docs/project-memory.md`. For architecture or cross-module questions, inspect the relevant source files, TypeScript imports, route wiring, and focused tests.

Root `TODO.md` is the immediate handoff. `master_todo.md` is the broader backlog. `docs/project-memory.md` is the durable learning log.

## Project Rules

- Work on `main` by default unless the user explicitly asks for a branch or PR.
- Preserve existing dirty worktree changes unless the user explicitly asks to clean or revert them.
- Use `npm.cmd` on Windows when npm shim behavior is unreliable.
- Run build before treating Next.js `.next/types` lint errors as source failures.
- Lesson content is live only when the chapter is registered in `lessonDirectories` and each published lesson has a non-empty `fileName`.
- Gemini lab adaptations should follow the platform path: dependency-free React/canvas component, `LessonDemo.tsx` routing, lesson markdown marker, and targeted test.
- Textbook-derived notes must preserve textbook examples, problem/activity numbering, topics, and section structure while simplifying the explanation.

## Completion Loop

For code changes, verify with the narrowest meaningful test first, then broader build/lint when the blast radius warrants it. Graphify is optional local tooling and is never part of the completion or push requirements.

When the user asks to commit and push, also update `TODO.md` with the next task after a successful push.
