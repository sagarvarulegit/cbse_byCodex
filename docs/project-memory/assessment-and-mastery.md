---
type: ProjectMemoryTopic
title: Assessment and Mastery Memory
description: Durable quiz, constructed-response, diagnostic, retention, workbench, mastery, and gamification learnings.
tags: ['memory', 'assessment', 'quiz', 'mastery', 'gamification']
timestamp: 2026-08-04T00:00:00Z
---

# Assessment and Mastery Memory

Read this file for quizzes, written practice, timed diagnostics, balancing workbenches, immutable attempts, retention, mastery, revision missions, and gamification.

## Constructed response and retention

- The Chapter 1 concept quiz is a 20-question check mapped to six core lesson slugs. `07-board-exam-practice.md` adds nine verified constructed-response questions and a two-pass oxidising/reducing-agent bridge; `08-board-readiness-diagnostic.md` is an original 30-mark mixed-format assessment; `09-board-readiness-diagnostic-b.md` is a separate 20-mark transfer check. Do not force supplement slugs into the core quiz coverage set.
- Chapter 1 constructed-response practice uses reusable definitions in `apps/web/lib/chapter-practice.ts` and `[[written-practice:<item-id>]]` lesson markers. Typed answers remain in browser memory; only rubric point ids, missed point ids, hint use, practice kind, half-mark score, weak-skill slugs, answer length, and idempotent attempt identity are stored in `WrittenPracticeAttempt`. Keep self-marked attempts out of mastery until retention and reviewed-readiness rules are explicit.
- Timed diagnostics use definitions in `apps/web/lib/exam-practice.ts` and `[[exam-practice:<item-id>]]` markers. Writing and checking deadlines are wall-clock values persisted locally, so refresh does not restart them. Scores support half marks. Any unchecked integrity confirmation makes the saved attempt practice-only with `retentionEligible: false`.
- Remediation links must use live lesson slugs, not numbered Markdown filenames: `/lessons/balancing-equations`, not `/lessons/02-balancing-equations`. The practice contract resolves every skill URL to a catalog lesson file and proves that its generated heading anchor exists.
- Written-practice retention is derived: the first immutable attempt at 80% or above completes D0, a separate qualifying attempt on or after day 3 completes D3, and another separate qualifying attempt on or after day 7 completes D7. A single late retry may complete D3 but cannot also complete D7. Dates alone never create completion, and this evidence does not alter `ChapterMastery`.

## Equation workbench

- The Chapter 1 equation workbench is a coefficient-only, explicit-atom-map dataset in `apps/web/lib/chemical-equation-balancing.ts`, rendered through generic `hasBalanceWorkbench()` dispatch. Its four reviewed equations are iron/steam plus NCERT in-text Question 2(i)-(iii); none are in the learner-task holdout.
- Any hint makes an equation guided rather than independent. D0 starts only after all four are completed without hints in their smallest whole-number ratios.
- Workbench attempts use the same immutable client-attempt identity and complete account-history reconciliation as written and timed practice. A guided result must show the exact balancing remediation link.
- Written practice, timed diagnostics, and balancing workbenches each expose a validated data registry with a passing second-chapter fixture. Reuse adds chapter-owned definitions and remediations only; the renderer, interaction components, and progress API must not gain a Chapter 1 conditional.
- Learner holdouts must be rechecked whenever new practice is added. On 26 July 2026, leaked ethane combustion was replaced by unseen propane combustion in the fixed smoke rubric. `learner-holdout-integrity.test.ts` compares all four balancing and eight classification equations against lessons, quiz, exercise/revision content, chapter pack, and workbench source.

## Quiz authoring and loading

- Free-pilot quiz routes use strict authoring validation: every question needs a valid explicit answer, explanation, and chapter-matching topic slug before reaching `QuizScoreForm`. Non-pilot generated quizzes retain the legacy parser fallback until migrated.
- The Real Numbers quiz route depends on `apps/web/content/real-numbers/lessons/quiz.md`; keep at least one chapter quiz Markdown file committed so the deployed quiz page does not 404.
- Quiz coverage is expected for every catalog chapter returned by `getChapterEntries()`. The loader first checks explicit quiz directories, then falls back to `apps/web/content/<chapter-slug>/lessons/quiz.md`.
- Vercel serverless tracing must include `apps/web/content/**/*` for `/chapters/[slug]/quiz`; otherwise local quiz routes can pass while deployed fallback Markdown returns 404.
- Numbered Markdown questions need `Answer: <option number>` whenever the correct option is not option 1; unkeyed generated quizzes fall back to option 1.
- Quiz Markdown supports optional `Topic:`, `Difficulty:`, `Source:`, and `Explanation:` lines through `apps/web/lib/quiz-content.ts`. `Topic:` drives weak-topic tracking only when it matches a valid chapter topic or lesson slug; explanations render after locked submission.
- Metadata validation lives in `apps/web/lib/quiz-content-validation.ts` with CLI `apps/web/scripts/validate-quiz-metadata.ts`. The script resolves `content/` relative to itself so `npm.cmd run validate:quizzes -w apps/web` is cwd-independent.
- Quiz metadata migration worked best in small batches: two five-file batches reduced 430 errors/warnings to 380, and the final legacy sweep reached 0 errors / 0 warnings across 89 quiz files. Remaining work is manual pilot quiz review and retry-immutability verification.

## Attempts, mastery, and missions

- Add gamification through event aggregation, not ad hoc counters inside request handlers.
- Chapter Mastery Ladder V1 is personal and non-competitive: video completion contributes limited effort credit, quiz performance drives most mastery, weak scores create Revision Missions, and level surfaces show honest milestones/next actions rather than fake locked tools.
- Raw quiz/video activity is stored separately from `ChapterMastery` so score formulas can be recalculated.
- Gamification Phase 2 aggregates through `StudyStreak`, `Badge`, and `UserBadge`. Streaks use India calendar days and count only persisted lesson completions, quiz saves, and practice saves. The V1 personal badge set is deliberately small: first lesson studied, first quiz, three-day streak, first written-practice self-check, and comeback after a weak quiz score. Do not reintroduce leaderboards, coins, public ranks, score-improvement badges, or broad topic-mastery badges without real pilot evidence.
- Saved quiz attempts are locked after answers are revealed. A retry creates a new immutable saved attempt and clears local answers through a separate action.
- Active revision missions should complete or hide once the best quiz score reaches the target. Revision Mission Lifecycle V1 also persists completion during mastery reads when a stale active mission is already satisfied; quiz-save responses distinguish `created`, `refreshed`, `completed`, and `not_needed`. Mission payloads now include concrete `recommendedActions` for existing chapter notes anchors and quiz retry routes, while the stored step text avoids promises about unavailable videos or focused practice sets.
- Production quiz saves can exceed Prisma's default 5-second interactive transaction timeout because the serializable path updates mastery, streaks, revision missions, and badges. Keep explicit `maxWait` and `timeout` options in `apps/api/src/routes/progress.ts`, and treat wrapped-flow `P2028` as retryable.
- Pilot weak-topic slugs come from lesson-wise web content, while older DB rows may use grouped slugs such as `reaction-types`. API validation should accept known pilot lesson slugs instead of requiring every weak topic to match a DB `Topic.slug`.
- Mastery Reward Unlock V1 derives a personal surface from mastery and badges. `apps/web/lib/mastery-rewards.ts` maps Learner, Skilled, Exam Ready, and Topper Track thresholds to locked/unlocked study-tool rewards.
- Study Remix focus sessions are navigation and time-management aids, not mastery evidence. Their temporary timer lives in student-scoped browser session storage, a queued tomorrow cue is device-local, and neither starting nor completing a mix marks a lesson complete or changes `ChapterMastery`.
- `focus_mix_start` and `focus_mix_complete` are pilot engagement events only. Revision missions may choose the opening album and replace its curated rewind cue, but the mission lifecycle and target score continue to be owned by the existing mastery API.

## My Mistakes and Exam Ready

- My Mistakes is a persisted personal recovery queue, not another mastery score. Stable keys deduplicate quiz questions, weak concepts, hint use, and written marking points; repeated evidence reopens an item and moves its retry date to three days after the newest attempt.
- Quiz attempts now keep bounded question-level review evidence so a later correct answer can resolve the exact prior question. Written answers remain browser-only; practice attempts store hint use and missed rubric point ids only.
- The Exam Ready checklist uses a 70% saved quiz target. Written-answer completion counts only `written_practice` attempts, while D3 recall may come from any qualifying practice kind; concepts studied, NCERT questions attempted, and weak areas revised require saved student confirmation unless the lesson-completion record already covers every published lesson.
- Resolving the last active mistake can complete the weak-areas confirmation. Any new mistake immediately clears it. Waiting for the retry date never marks an item revised or completes D3 recall.
