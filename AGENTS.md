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

## Commit & Pull Request Guidelines

History currently only shows `Initial commit`, so use short imperative commit messages such as `Add deployment runbook` or `Implement Bunny video metadata`. Pull requests should include a clear summary, changed areas, verification commands, linked issues if any, and screenshots for visible UI changes.

## Security & Configuration Tips

Never commit real secrets. Use `.env.example` files for names only. Keep `ELEVENLABS_API_KEY`, Bunny Stream keys, Supabase URLs, and payment credentials server-only. Do not expose Bunny or API secrets through `NEXT_PUBLIC_` variables.

## Agent-Specific Instructions

This project may have a graphify knowledge graph at `graphify-out/`. Before architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md` when present. If `graphify-out/wiki/index.md` exists, use it before raw-file browsing. For cross-module relationship questions, prefer `graphify query`, `graphify path`, or `graphify explain` over grep. After modifying code files, run `graphify update .`.

Read `docs/project-memory.md` before picking up implementation work. Update it when a session discovers durable project knowledge such as architecture decisions, platform IDs, deployment constraints, media workflow choices, or important gotchas. Keep `AGENTS.md` for stable operating rules and `docs/project-memory.md` for evolving project learnings.

After every successful git push, update `TODO.md` with the next task before ending the session.

The repo includes `.githooks/pre-push` to refresh `graphify-out/` before pushes and to enforce project-memory updates for meaningful source changes. Enable it in a checkout with `git config core.hooksPath .githooks`. If a push is blocked because `graphify-out` changed, commit the refreshed graph artifacts and push again. If a push is blocked because project memory was not updated, add a concise learning to `docs/project-memory.md` or update `AGENTS.md`, then commit and push again.
