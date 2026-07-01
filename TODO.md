# Next Task: Run The Tiny Real Student Pilot

## Recommended Low-Cost AI Model

Use `gpt-5.4-mini` with `reasoning.effort: low`.

Why this is the best fit:

- This task is mostly structured repo inspection, markdown/content cleanup, and targeted test verification.
- It needs enough judgment to avoid breaking quiz answers, topic mappings, and feedback context.
- `gpt-5.4-mini` is much cheaper than flagship models while still being safer than `nano` for file-backed content QA.
- `reasoning.effort: low` is enough because the work is well-scoped and this file gives exact steps.

Fallbacks:

- Cheapest possible: `gpt-5.4-nano` with `reasoning.effort: low`, only for checking boxes and editing obvious markdown metadata after all files are already identified.
- Higher confidence: `gpt-5.4-mini` with `reasoning.effort: medium`, only if tests fail in a confusing way or if app code must be touched.
- Avoid: `gpt-5.5`, `gpt-5.5-pro`, or high reasoning effort for the first pass. The task should not need flagship cost unless the repo has drifted badly.

## Goal

Invite 2 to 5 known students, have them use the live pilot naturally for 20 to 30 minutes, then review the deployed admin pilot-review dashboard and fix the single highest-friction learning issue.

Pilot chapters remain:

- `real-numbers`
- `chemical-reactions-and-equations`
- `two-stories-about-flying`

## Product Context

This is a P0 before widening beyond the tiny pilot. Do not start payments, subscriptions, leaderboards, mobile/offline, or admin CMS work here.

The task is not to create a large new content system. The task is to audit and close any gaps in the three live pilot chapters so students can study, take a quiz, and leave feedback without hitting draft-quality gaps.

## Files To Inspect First

Read these files before editing:

1. `master_todo.md`
2. `TODO.md`
3. `docs/project-memory.md`
4. `apps/web/lib/pilot.ts`
5. `apps/web/lib/course-content.ts`
6. `apps/web/lib/course-content.test.ts`
7. `apps/web/lib/pilot-quiz-content.test.ts`
8. `apps/web/lib/quiz-content.ts`
9. `apps/web/components/PilotFeedbackForm.tsx`
10. `apps/web/app/chapters/[slug]/page.tsx`
11. `apps/web/app/chapters/[slug]/notes/page.tsx`
12. `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`
13. `apps/web/app/chapters/[slug]/quiz/page.tsx`

## Pilot Content Files To Audit

Real Numbers:

- `apps/web/content/real-numbers/lessons/index.md`
- `apps/web/content/real-numbers/lessons/01-euclid-division-lemma.md`
- `apps/web/content/real-numbers/lessons/02-fundamental-theorem-of-arithmetic.md`
- `apps/web/content/real-numbers/lessons/03-hcf-and-lcm-by-prime-factorisation.md`
- `apps/web/content/real-numbers/lessons/04-irrational-numbers.md`
- `apps/web/content/real-numbers/lessons/05-decimal-expansion-of-rational-numbers.md`
- `apps/web/content/real-numbers/lessons/quiz.md`

Chemical Reactions and Equations:

- `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/05-oxidation-and-reduction.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`

Two Stories about Flying:

- `apps/web/content/two-stories-about-flying/lessons/01-his-first-flight-fear-and-hunger.md`
- `apps/web/content/two-stories-about-flying/lessons/02-his-first-flight-courage-and-family-pressure.md`
- `apps/web/content/two-stories-about-flying/lessons/03-the-black-aeroplane-storm-and-mystery.md`
- `apps/web/content/two-stories-about-flying/lessons/04-the-black-aeroplane-unknown-helper.md`
- `apps/web/content/two-stories-about-flying/lessons/05-poems-wild-animals-and-the-ball-poem.md`
- `apps/web/content/two-stories-about-flying/lessons/quiz.md`

## Important Existing Contracts

Do not guess these. Verify against the files.

- Pilot chapter slugs come from `PILOT_CHAPTER_SLUGS` in `apps/web/lib/pilot.ts`.
- Live lesson availability comes from `getAvailableLessons(chapter)` in `apps/web/lib/course-content.ts`.
- Quiz files are loaded from `apps/web/content/<chapter-slug>/lessons/quiz.md`.
- Pilot quiz validation is already strict in `apps/web/lib/pilot-quiz-content.test.ts`.
- `parseQuizContent(..., { strictMetadata: true })` throws if a pilot quiz question is missing `Answer:`, missing `Explanation:`, missing `Topic:`, or has an invalid topic.
- Feedback context is passed through `PilotFeedbackForm` props: `chapterSlug`, optional `lessonSlug`, `surface`, and optional `path`.

## Expected Topic Slugs

Use these exact lesson slugs for pilot quiz `Topic:` metadata when the chapter has lesson-wise content.

Real Numbers valid topics:

- `euclid-division-lemma`
- `fundamental-theorem-of-arithmetic`
- `hcf-and-lcm-by-prime-factorisation`
- `irrational-numbers`
- `decimal-expansion-of-rational-numbers`

Chemical Reactions valid topics:

- `chemical-equations`
- `balancing-equations`
- `combination-and-decomposition-reactions`
- `displacement-and-double-displacement-reactions`
- `oxidation-and-reduction`

Two Stories about Flying valid topics:

- `his-first-flight-fear-and-hunger`
- `his-first-flight-courage-and-family-pressure`
- `the-black-aeroplane-storm-and-mystery`
- `the-black-aeroplane-unknown-helper`
- `poems-wild-animals-and-the-ball-poem`

## Required Quiz Metadata Format

Every pilot quiz question must use this shape:

```markdown
## 1. Short question title

Question text goes here.

1. First option
2. Second option
3. Third option
4. Fourth option

Answer: 2
Topic: euclid-division-lemma
Difficulty: Easy
Source: NCERT-aligned lesson note
Explanation: One or two student-friendly sentences explaining why the answer is correct and why a tempting wrong option is not correct.
```

Rules:

- `Answer:` must be the number of one existing option.
- `Topic:` must match one of the valid topic slugs above.
- `Explanation:` must not be empty.
- Keep exactly 5 questions per pilot quiz unless the tests are intentionally updated.
- Do not change expected answers casually. If a question answer changes, update `expectedAnswerValues` in `apps/web/lib/pilot-quiz-content.test.ts` only after reading the question and confirming the new answer is correct.

## Task 1: Confirm Chapter Overview Exists

Checklist:

- [ ] Open `apps/web/lib/course-content.ts`.
- [ ] Confirm each pilot chapter has a useful `summary` field.
- [ ] Confirm each pilot chapter has a useful `topics` array.
- [ ] Confirm each pilot chapter has a non-empty `lessons` array.
- [ ] Open `apps/web/app/chapters/[slug]/page.tsx`.
- [ ] Confirm the chapter page renders the chapter title, summary, lesson cards, notes/quiz links, and pilot engagement tracking for pilot chapters.
- [ ] If a pilot overview is vague, update only the relevant `summary`, `topics`, `streakTask`, or lesson `preview` fields in `apps/web/lib/course-content.ts`.

Quality bar for overview copy:

- It should tell a Class 10 student what they will learn.
- It should not say "coming soon" for any pilot chapter.
- It should not overpromise video if the chapter is notes-first.
- It should mention the real learning flow, not generic marketing.

## Task 2: Confirm 3 To 5 High-Quality Lesson Notes Per Pilot Chapter

Checklist:

- [ ] For each pilot chapter, count live lessons using `getAvailableLessons(chapter)`, not by counting all metadata entries.
- [ ] Confirm every pilot chapter has between 3 and 5 live lesson markdown files.
- [ ] Confirm each live lesson file has student-friendly structure.
- [ ] Confirm each live lesson has examples or solved examples.
- [ ] Confirm each live lesson has common mistakes.
- [ ] Confirm each live lesson has board tips or exam-friendly guidance.
- [ ] Confirm each live lesson has quick practice.
- [ ] Confirm each live lesson has answer check or answer key content.
- [ ] Confirm each live lesson has one-minute revision or recap.
- [ ] Confirm each live lesson has comic recap content if the chapter pattern already uses it.

Minimum accepted lesson headings:

For Maths and Science lessons:

- `## Learning goals`
- At least 2 concept explanation sections
- `## Solved examples` or worked-example sections
- `## Common mistakes`
- `## Board tips`
- `## Quick practice`
- `## Answer check`
- `## One-minute revision`
- `## Comic recap`

For English lessons:

- `## Learning goals`
- `## Story context` or poem context
- `## Key idea`
- `## Important moments`
- `## Character or speaker insight`
- `## Solved examples`
- `## Common mistakes`
- `## Board tips`
- `## Quick practice`
- `## Answer check`
- `## One-minute revision`
- `## Comic recap`
- `## Remember this line`

Do not rewrite entire chapters unless a section is missing or clearly weak. Make surgical edits.

## Task 3: Confirm Quiz Answer Keys, Explanations, And Topic Mapping

Checklist:

- [ ] Open all three pilot `quiz.md` files.
- [ ] For every question, confirm `Answer:` exists and points to the correct option number.
- [ ] For every question, confirm `Explanation:` exists and teaches the concept in simple English.
- [ ] For every question, confirm `Topic:` exists and matches an expected topic slug from this file.
- [ ] Confirm every quiz has exactly 5 parsed questions.
- [ ] Confirm answer order in `apps/web/lib/pilot-quiz-content.test.ts` still matches the quiz files.

Run after any quiz edit:

```powershell
cd C:\Sagar\Projects\CBSE\cbse_byCodex
npm.cmd run test -w apps/web
```

Expected result:

- All web tests pass.
- Especially `apps/web/lib/pilot-quiz-content.test.ts` passes for all three pilot chapters.

If only pilot quiz tests fail:

- Read the failure message.
- Fix the quiz metadata first.
- Update `expectedAnswerValues` only if the quiz answer itself intentionally changed and the new answer is correct.
- Re-run `npm.cmd run test -w apps/web`.

## Task 4: Confirm Feedback Form Has Correct Chapter Context

Checklist:

- [ ] Open `apps/web/app/chapters/[slug]/notes/page.tsx`.
- [ ] Confirm pilot chapter notes render `PilotFeedbackForm chapterSlug={slug} lessonSlug="chapter-notes" surface="lesson"`.
- [ ] Open `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`.
- [ ] Confirm pilot lesson pages render `PilotFeedbackForm chapterSlug={slug} lessonSlug={lessonSlug} surface="lesson"`.
- [ ] Open `apps/web/app/chapters/[slug]/quiz/page.tsx`.
- [ ] Confirm pilot quiz pages render `PilotFeedbackForm chapterSlug={slug} surface="quiz"`.
- [ ] Open `apps/web/components/PilotFeedbackForm.tsx`.
- [ ] Confirm the request body sends `chapterSlug`, `lessonSlug`, `surface`, `path`, `rating`, `category`, and `message`.

Only edit app code if one of those props is missing or wrong. If app code is already correct, leave it unchanged.

## Task 5: Remove Pilot Placeholder Copy If Found

Search for stale placeholder text:

```powershell
cd C:\Sagar\Projects\CBSE\cbse_byCodex
rg -n "still being prepared|notes are being prepared|coming soon|placeholder|draft" apps/web/app apps/web/content apps/web/lib/course-content.ts
```

Rules:

- Do not remove honest `Coming soon` copy for non-pilot chapters.
- Do remove or rewrite stale placeholder copy that appears on any pilot chapter entry point, lesson page, notes page, quiz page, or feedback surface.
- If a pilot file is genuinely missing, do not hide it with copy. Add the missing content or fix the metadata link.

## Task 6: Add Or Adjust Tests Only If Needed

Existing tests already cover most of this:

- `apps/web/lib/course-content.test.ts`
- `apps/web/lib/pilot-quiz-content.test.ts`
- `apps/web/lib/quiz-content.test.ts`

Add tests only if a gap is discovered.

Recommended small test additions if needed:

- Add a test in `apps/web/lib/course-content.test.ts` that every `PILOT_CHAPTER_SLUGS` chapter has `getAvailableLessons(chapter).length >= 3`.
- Add a test in `apps/web/lib/course-content.test.ts` that every pilot chapter has a non-empty `summary`.
- Add a test in `apps/web/lib/course-content.test.ts` that every available pilot lesson has a real `fileName`.

Do not add browser e2e tests in this task unless the user explicitly asks.

## Task 7: Manual Browser Review

After tests pass, manually review these routes locally or on the deployed student web app:

- `/chapters/real-numbers`
- `/chapters/real-numbers/lessons/euclid-division-lemma`
- `/chapters/real-numbers/quiz`
- `/chapters/chemical-reactions-and-equations`
- `/chapters/chemical-reactions-and-equations/lessons/chemical-equations`
- `/chapters/chemical-reactions-and-equations/quiz`
- `/chapters/two-stories-about-flying`
- `/chapters/two-stories-about-flying/lessons/his-first-flight-fear-and-hunger`
- `/chapters/two-stories-about-flying/quiz`

Manual review checklist:

- [ ] Chapter overview is visible and useful.
- [ ] First lesson opens without a 404.
- [ ] Lesson notes do not show draft placeholders.
- [ ] Quiz opens and has 5 questions.
- [ ] Quiz review shows explanations after submit.
- [ ] Feedback form appears on pilot lesson/notes/quiz surfaces.
- [ ] Feedback form sends the correct chapter context when logged in.
- [ ] Mobile width does not create overlapping text or broken cards.

If production is reviewed and a new route returns 404, first verify production is deployed from merged `main` before calling the route broken.

## Verification Commands

Run these from the repo root:

```powershell
cd C:\Sagar\Projects\CBSE\cbse_byCodex
git diff --check
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

If `npm.cmd run lint -w apps/web` fails because `.next/types` is missing:

```powershell
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
```

Do not treat the missing `.next/types` lint failure as a source regression until lint is retried after a successful web build.

## Acceptance Criteria

- [ ] `real-numbers` has a clear chapter overview.
- [ ] `real-numbers` has 3 to 5 live high-quality lesson notes.
- [ ] `real-numbers` quiz has explicit answers, explanations, and valid topic mapping.
- [ ] `real-numbers` feedback form sends correct chapter context.
- [ ] `chemical-reactions-and-equations` has a clear chapter overview.
- [ ] `chemical-reactions-and-equations` has 3 to 5 live high-quality lesson notes.
- [ ] `chemical-reactions-and-equations` quiz has explicit answers, explanations, and valid topic mapping.
- [ ] `chemical-reactions-and-equations` feedback form sends correct chapter context.
- [ ] `two-stories-about-flying` has a clear chapter overview.
- [ ] `two-stories-about-flying` has 3 to 5 live high-quality lesson notes.
- [ ] `two-stories-about-flying` quiz has explicit answers, explanations, and valid topic mapping.
- [ ] `two-stories-about-flying` feedback form sends correct chapter context.
- [ ] No pilot route shows stale "notes are still being prepared" copy.
- [ ] `git diff --check` passes.
- [ ] `npm.cmd run test -w apps/web` passes.
- [ ] `npm.cmd run lint -w apps/web` passes or is retried after build if `.next/types` was missing.

## Out Of Scope

- Do not implement payments or subscriptions.
- Do not widen access beyond the tiny free pilot.
- Do not build leaderboards, ranks, coins, or competition.
- Do not create a full admin CMS.
- Do not add mobile/offline functionality.
- Do not rewrite all 89 quiz files.
- Do not regenerate all `docs/content` chapter packs.
- Do not change the immutable quiz retry/review behavior.
- Do not fake real student feedback or production evidence.

## Suggested Commit Scope

Use one focused commit if changes are small:

```powershell
git add todo.md TODO.md apps/web/lib/course-content.ts apps/web/content/real-numbers/lessons apps/web/content/chemical-reactions-and-equations/lessons apps/web/content/two-stories-about-flying/lessons apps/web/lib/course-content.test.ts apps/web/lib/pilot-quiz-content.test.ts
git commit -m "chore: complete pilot chapter readiness handoff"
```

If only this file changes, commit only this file:

```powershell
git add todo.md TODO.md
git commit -m "docs: detail pilot chapter readiness task"
```

On Windows this repo may treat `todo.md` and `TODO.md` as the same file. If `git status --short` shows only `TODO.md`, that is fine.
