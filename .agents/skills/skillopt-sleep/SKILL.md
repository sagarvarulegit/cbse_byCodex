---
name: "skillopt-sleep"
description: "Use Microsoft SkillOpt to inspect or improve project skills when explicitly requested."
---

# SkillOpt-Sleep

Use this skill when the user asks to run or maintain Microsoft SkillOpt for this project, or when they ask to improve agent/project skills from prior Codex sessions.

## Commands

Run commands from the repository root:

```powershell
npm.cmd run skillopt:status
npm.cmd run skillopt:dry-run
npm.cmd run skillopt:harvest
npm.cmd run skillopt:run
```

`skillopt:run` targets `.agents/skills/cbse-project/SKILL.md` and stages proposed skill edits for review. Do not auto-adopt staged edits unless the user explicitly asks for it.

## Safety

- Keep `.skillopt-sleep/` untracked; it can contain harvested session review data and staged proposals.
- Review staged edits before applying them.
- Do not let SkillOpt overwrite `AGENTS.md`, `docs/architecture.md`, `docs/project-memory.md`, or any file under `docs/project-memory/` unless the user explicitly requests that target.
- If a command needs model credentials, use existing environment variables only. Never write API keys into repository files.
