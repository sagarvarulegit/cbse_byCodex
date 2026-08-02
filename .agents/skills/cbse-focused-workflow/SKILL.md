---
name: cbse-focused-workflow
description: "Use for substantial engineering work in the CBSE repository when one of these applies: (1) a feature or cross-module change has unresolved design tradeoffs, (2) a persistent or non-obvious bug needs root-cause investigation, or (3) a material implementation is ready for a focused completion claim. Provides lightweight design, debugging, and evidence workflows. Do not use for simple questions, routine edits, textbook transcription, typo fixes, or status reports."
---

# CBSE Focused Workflow

Choose the smallest applicable mode. Start with one mode and transition only when the task genuinely enters another phase.

## Guardrails

- Follow the user's request and repository `AGENTS.md` before this skill.
- Preserve existing dirty-worktree changes and load only the project-memory topics relevant to the task.
- Do not create subagents, worktrees, branches, commits, pushes, or pull requests unless the user explicitly requests them.
- Do not create plans or reports under `.superpowers/` or `docs/superpowers/` unless the user explicitly requests those artifacts.
- Treat Graphify as advisory navigation, never verification. Do not refresh it automatically.
- Do not run tests, builds, lint, quiz validators, or broad browser sweeps unless the user requests them or a focused check is essential for safe execution.
- Apply `NOTES_GUIDELINES_STANDARDS.md` independently for textbook notes, quizzes, figures, and lesson media. Workflow discipline never substitutes for source fidelity.

## Mode 1: Design a substantial change

Use this mode only when requirements, ownership, or cross-module behavior have meaningful uncertainty.

1. State the desired outcome, material constraints, and non-goals.
2. Identify the owning modules and affected boundaries from repository sources.
3. Present alternatives only when a real tradeoff exists; keep them to the two strongest options.
4. Recommend one option and record assumptions that affect the result.
5. Ask the user only when a missing choice changes scope, data ownership, public behavior, or an irreversible action. Otherwise proceed with a reasonable stated assumption.
6. Create a task plan only for three or more dependent steps, material risk, or work likely to span sessions. Keep the plan in the task UI unless the user requests a durable specification.

## Mode 2: Diagnose a hard bug

Use this mode for persistent failures, unclear regressions, inconsistent behavior, or failed straightforward fixes.

1. Capture the exact symptom and expected behavior.
2. Inspect the narrowest relevant logs, source path, recent diff, and runtime state available without destructive actions.
3. Rank at most three hypotheses and run the cheapest discriminating check.
4. Identify the root cause before proposing a broad fix.
5. If the user requested diagnosis only, stop after the evidence-backed explanation. If they requested a fix, implement the smallest complete correction and avoid unrelated refactoring.
6. When reproduction is unavailable, state the evidence gap and distinguish confirmed facts from inference.

## Mode 3: Support a completion claim

Use this mode before claiming that a material implementation is complete, fixed, integrated, or ready.

1. Inspect the final diff and confirm the requested behavior is wired through its owning route, registry, API, or content marker.
2. Choose the narrowest authorised evidence check. Do not widen validation merely because this skill is active.
3. Confirm that no unrelated user changes were overwritten and generated or secret material was not added.
4. Report exactly what was inspected or run, its outcome, and what was intentionally skipped.
5. Never say a test, build, lint check, browser flow, or deployment passed unless it actually ran and its result was observed.

## Compact handoff

End with the outcome, focused evidence, and intentionally skipped verification. Keep this handoff concise unless the user asks for detail.
