---
type: QAStyleChecklist
title: Pilot QA Checklist
description: Verification list for lesson videos, notes rendering, quiz attempts, and streaks before launching the student pilot.
tags: ['qa', 'pilot', 'checklist']
timestamp: 2026-07-08T12:00:00Z
---

# Free Student Pilot QA Checklist

Last updated: 2026-06-21

Run this checklist on the production web URL and production API URL before sharing student links.

## Access Path

- [ ] Home page loads and clearly offers the free account path.
- [ ] Register a fresh Class 10 student account.
- [ ] Login with the same account after logout.
- [ ] Dashboard opens after login and shows the free pilot path.
- [ ] Subjects page opens from the dashboard.
- [ ] Mathematics, Science, and English subject pages expose the selected free pilot chapters.

## Pilot Chapters

- [ ] Real Numbers opens from the pilot card.
- [ ] Real Numbers first lesson note opens.
- [ ] Chemical Reactions and Equations opens from the pilot card.
- [ ] Chemical Reactions and Equations chapter notes open.
- [ ] Two Stories about Flying opens from the pilot card.
- [ ] Two Stories about Flying chapter notes open.
- [ ] Each pilot chapter quiz page opens and renders selectable answers.

## Progress And Engagement

- [ ] Lesson start events return `202` from `/api/progress/engagement` for a logged-in student.
- [ ] Mark studied returns `202` and changes the button state to `Studied`.
- [ ] Quiz submission returns `201` from `/api/progress/quiz`.
- [ ] Dashboard mastery or attempt history reflects the saved quiz attempt.
- [ ] Quiz retry creates a new saved attempt instead of editing the revealed attempt.
- [ ] Feedback submission returns `201` from `/api/progress/feedback` on lesson, quiz, and dashboard surfaces.

## Production Checks

- [ ] API migrations have run with `npm run prisma:migrate:deploy -w apps/api`.
- [ ] `/v1/catalog/pilot` returns the free pilot catalog from the production API.
- [ ] `NEXT_PUBLIC_API_BASE_URL` on production web points at the production API.
- [ ] `AUTH_TOKEN_SECRET`, `DATABASE_URL`, `DIRECT_URL`, and `CORS_ORIGIN` are present in production API env.
- [ ] Same-domain authenticated writes work from the production web URL.
- [ ] No payment or subscription prompt blocks the free pilot path.

## Feedback Review

- [ ] Confirm feedback events are visible in `ProgressEvent` with `eventType = feedback_submission`.
- [ ] Confirm engagement events include `lesson_start`, `lesson_complete`, `quiz_start`, `dashboard_view`, and `chapter_open`.
- [ ] Review the first 5-10 student reports before expanding beyond the pilot chapters.
