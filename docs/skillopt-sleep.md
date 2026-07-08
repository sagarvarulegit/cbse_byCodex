---
type: Runbook
title: Skill Optimization and Idle Control
description: Guide on executing background tasks, timer conditions, and managing agent sleep cycles.
tags: ['agent', 'execution', 'scheduling']
timestamp: 2026-07-08T12:00:00Z
---

# SkillOpt-Sleep Setup

This project is configured for Microsoft SkillOpt-Sleep, which can mine prior Codex sessions and stage proposed improvements to repo-local skills.

## Installed Tool

SkillOpt is installed in the user Python environment:

```powershell
python -m skillopt_sleep --help
```

The `skillopt-sleep.exe` script may not be on PATH on Windows, so project scripts call it through `python -m skillopt_sleep`.

## Project Scripts

From the repository root:

```powershell
npm.cmd run skillopt:status
npm.cmd run skillopt:dry-run
npm.cmd run skillopt:harvest
npm.cmd run skillopt:run
```

- `skillopt:status` shows current SkillOpt-Sleep state.
- `skillopt:dry-run` uses the mock backend and should not edit files.
- `skillopt:harvest` writes reviewed task records to ignored local file `skillopt-reviewed-tasks.json`.
- `skillopt:run` uses Codex as the backend and targets `.agents/skills/cbse-project/SKILL.md`.

## Review Flow

1. Run `npm.cmd run skillopt:dry-run` to confirm sessions can be mined.
2. Run `npm.cmd run skillopt:harvest` when you want reviewable task records.
3. Run `npm.cmd run skillopt:run` only when model/tool credentials are available.
4. Inspect staged edits and apply only useful changes.
5. Keep `.skillopt-sleep/` untracked.

The seed skill is `.agents/skills/cbse-project/SKILL.md`. It captures the current project operating rules and is the intended optimization target.
