---
type: ProjectMemory
title: Project Memory Index
description: Lightweight routing index for durable CBSE learning-platform knowledge.
tags: ['memory', 'routing', 'onboarding']
timestamp: 2026-08-20T00:00:00Z
---

# Project Memory Index

Last updated: 2026-08-20

This file is intentionally short. Before implementation, read `docs/architecture.md`, then load only the memory topics that match the task. Repository source remains authoritative.

## Topic routing

| Task area | Read |
| --- | --- |
| Agent configuration, Graphify, SkillOpt, documentation format | [`project-memory/agent-workflow.md`](project-memory/agent-workflow.md) |
| API, Prisma, authentication, Bunny, Supabase, service boundaries | [`project-memory/architecture-and-services.md`](project-memory/architecture-and-services.md) |
| Curriculum registry, textbook notes, chapter publication, board evidence | [`project-memory/curriculum-and-content.md`](project-memory/curriculum-and-content.md) |
| Quizzes, written practice, diagnostics, retention, mastery, gamification | [`project-memory/assessment-and-mastery.md`](project-memory/assessment-and-mastery.md) |
| Sample test papers, question bank, blueprint snapshot, Gemini verification | [`project-memory/exam-papers.md`](project-memory/exam-papers.md) |
| Lesson rendering, figures, accessibility, client boundaries, performance, video aesthetics | [`project-memory/rendering-and-media.md`](project-memory/rendering-and-media.md) |
| Free pilot, deployments, production smoke, subscriptions, blockers | [`project-memory/pilot-and-operations.md`](project-memory/pilot-and-operations.md) |
| Store, micro-monetization, Cashfree/Razorpay payments, DRM watermarking | [`project-memory/payments-and-monetization.md`](project-memory/payments-and-monetization.md) |

Read more than one topic when a change crosses those boundaries. Do not read every topic by default.

## Update rule

- Put stable operating rules in `AGENTS.md`.
- Put module boundaries and primary flows in `docs/architecture.md`.
- Put durable discoveries in the narrowest topic above.
- Add a new topic file and routing row when no existing scope fits.
- Keep temporary status, generated reports, and session transcripts out of project memory.
