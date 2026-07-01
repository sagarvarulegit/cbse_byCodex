# Quiz Metadata Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish quiz metadata quality for the next student batch by validating the existing script, closing pilot topic metadata, backfilling all legacy quiz answers and explanations, manually reviewing the three pilot quiz pages, and verifying locked retry behavior.

**Architecture:** Keep parser behavior unchanged: strict metadata is required for pilot/validation flows, while the legacy non-strict fallback remains available until every legacy quiz is migrated. Use the existing CLI validator as the source of truth for metadata cleanup, and use focused tests/browser review for retry and locked-review behavior.

**Tech Stack:** Next.js app under `apps/web`, TypeScript, Node test runner with `tsx`, markdown quiz files under `apps/web/content`, Express API tests under `apps/api`.

## Global Constraints

- Do not implement payments or subscriptions.
- Do not widen the student pilot.
- Do not remove the legacy non-strict quiz parser fallback.
- Do not make revealed quiz attempts editable.
- Do not guess quiz answers; verify from the question, options, chapter context, or lesson notes.
- Keep pilot-first priority: Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying are the student-facing pilot chapters.
- Use `Get-Content -LiteralPath` for bracketed route paths in PowerShell.
- After source-code changes, run `graphify update .`; content-only markdown batches do not need graphify unless code changes too.

---

## Current Known State

- `apps/web/lib/quiz-content-validation.ts` exists and exposes `validateQuizMetadata`.
- `apps/web/scripts/validate-quiz-metadata.ts` exists and is wired through `npm.cmd run validate:quizzes -w apps/web`.
- `apps/web/lib/quiz-content.test.ts` already has a strict missing-answer regression.
- The first legacy batch is already complete for `a-letter-to-god`, `a-question-of-trust`, `a-triumph-of-surgery`, `bade-bhai-sahab`, and `bholi`.
- The second legacy batch is already complete for `the-necklace`, `the-proposal`, `the-thiefs-story`, `the-sermon-at-benares`, and `the-midnight-visitor`.
- The current validator state after two batches is 380 missing-answer / 380 missing-explanation issues.
- The three pilot quizzes already parse in strict mode in `apps/web/lib/pilot-quiz-content.test.ts`, but they still need explicit manual review before the next student batch.

## Files And Responsibilities

- `apps/web/lib/quiz-content.ts`: Markdown quiz parser and strict metadata errors. Preserve existing behavior.
- `apps/web/lib/quiz-content-validation.ts`: Reusable validation helper for tests and CLI. Verify only unless a regression is found.
- `apps/web/scripts/validate-quiz-metadata.ts`: CLI scanner for all chapter quiz files. Verify only unless a regression is found.
- `apps/web/package.json`: Contains `validate:quizzes`. Verify only unless missing.
- `apps/web/lib/quiz-content.test.ts`: Parser and validator regression tests.
- `apps/web/lib/pilot-quiz-content.test.ts`: File-backed strict pilot quiz test.
- `apps/web/content/*/lessons/quiz.md`: Legacy quiz files that need answer and explanation metadata.
- `apps/web/components/QuizScoreForm.tsx`: Locked review and retry UI behavior.
- `apps/web/lib/quiz-attempts.ts`: Web attempt fetch helpers.
- `apps/api/src/lib/quiz-attempts.ts`: Attempt history summary helper.
- `apps/api/src/lib/quiz-attempts.test.ts`: API attempt history tests.
- `master_todo.md`: Mark completed items only after verification evidence exists.

---

## Task 1: Verify Validation Infrastructure

**Files:**
- Inspect: `apps/web/lib/quiz-content-validation.ts`
- Inspect: `apps/web/scripts/validate-quiz-metadata.ts`
- Inspect: `apps/web/package.json`
- Test: `apps/web/lib/quiz-content.test.ts`

**Interfaces:**
- Consumes: `parseQuizContent(markdown, topicSlugs, { strictMetadata: true })`
- Produces: trusted validator output for later content batches

- [ ] **Step 1: Confirm package script exists**

Open `apps/web/package.json` and confirm:

```json
"validate:quizzes": "tsx scripts/validate-quiz-metadata.ts"
```

- [ ] **Step 2: Confirm missing-answer test exists**

Open `apps/web/lib/quiz-content.test.ts` and confirm a test named:

```ts
test('strict quiz metadata rejects missing answers instead of silently scoring option 1', () => {
```

Expected assertion:

```ts
assert.deepEqual(error.issues.map((issue) => issue.code), ['missing-answer']);
```

- [ ] **Step 3: Run targeted parser tests**

Run:

```powershell
npm.cmd run test -w apps/web -- lib/quiz-content.test.ts
```

Expected: all web lib tests pass, including the strict missing-answer regression.

- [ ] **Step 4: Run validator once and capture counts**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected before full cleanup: exit code `1` while legacy quiz files still report missing metadata. Record the final summary line, for example:

```text
Checked 89 quiz files. Errors: <number>. Warnings: <number>.
```

Do not treat validator failure as a blocker until every legacy quiz file has been migrated.

---

## Task 2: Close Pilot Topic Metadata First

**Files:**
- Inspect/modify if needed: `apps/web/content/real-numbers/lessons/quiz.md`
- Inspect/modify if needed: `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- Inspect/modify if needed: `apps/web/content/two-stories-about-flying/lessons/quiz.md`
- Test: `apps/web/lib/pilot-quiz-content.test.ts`

**Interfaces:**
- Consumes: `PILOT_CHAPTER_SLUGS` from `apps/web/lib/pilot.ts`
- Produces: strict pilot quiz metadata with valid `topicSlug` values for weak-topic tracking

Valid pilot topic slugs:

```text
real-numbers:
euclid-division-lemma
fundamental-theorem-of-arithmetic
hcf-and-lcm-by-prime-factorisation
irrational-numbers
decimal-expansion-of-rational-numbers

chemical-reactions-and-equations:
chemical-equations
balancing-equations
combination-and-decomposition-reactions
displacement-and-double-displacement-reactions
oxidation-and-reduction

two-stories-about-flying:
his-first-flight-fear-and-hunger
his-first-flight-courage-and-family-pressure
the-black-aeroplane-storm-and-mystery
the-black-aeroplane-unknown-helper
poems-wild-animals-and-the-ball-poem
```

- [ ] **Step 1: Inspect pilot quiz topics**

For each pilot quiz, confirm every question has:

```markdown
Topic: exact-topic-slug
```

- [ ] **Step 2: Fix only invalid or missing pilot topics**

If a pilot question is missing or has an invalid topic, set it to the lesson slug that best matches the question. Example:

```markdown
Topic: balancing-equations
```

- [ ] **Step 3: Run pilot strict test**

Run:

```powershell
npm.cmd run test -w apps/web -- lib/pilot-quiz-content.test.ts
```

Expected: all three pilot quizzes parse with 5 questions, valid answers, explanations, and valid topic slugs.

- [ ] **Step 4: Update `master_todo.md` only after the test passes**

After the command above passes, mark this item complete:

```markdown
- [x] Add `Topic:` metadata for weak-topic tracking in pilot quizzes first.
```

---

## Task 3: Backfill `Answer:` Metadata For Every Legacy Quiz

**Files:**
- Modify: `apps/web/content/*/lessons/quiz.md`
- Use validator: `apps/web/scripts/validate-quiz-metadata.ts`

**Interfaces:**
- Consumes: validator output lines with `missing-answer`
- Produces: all quiz questions with explicit `Answer: <option number>`

- [ ] **Step 1: Generate the missing-answer queue**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Collect files from lines like:

```text
[error] content\a-letter-to-god\lessons\quiz.md missing-answer question-1: Lencho
```

- [ ] **Step 2: Work in batches of 5 to 10 files**

Pick the first 5 to 10 files from the validator output. Do not edit every quiz file in one giant pass.

- [ ] **Step 3: Read each question before adding an answer**

For every question, read:

```markdown
## N. Title

Question text

1. First option
2. Second option
3. Third option
```

Add the answer after the option list:

```markdown
Answer: 1
```

Use the option number from the markdown, not a zero-based index.

- [ ] **Step 4: Stop on ambiguous answers**

If the correct option is not clear, inspect the matching lesson or chapter pack. If it is still unclear, leave that question unchanged and record it under a handoff note:

```markdown
Blocked answer checks:
- `apps/web/content/<chapter>/lessons/quiz.md`, question N, because <reason>.
```

- [ ] **Step 5: Re-run validator after each batch**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected: `missing-answer` errors decrease by the number of fixed questions.

- [ ] **Step 6: Repeat until no missing-answer errors remain**

Completion signal:

```text
Errors: 0.
```

If warnings remain, continue to Task 4.

---

## Task 4: Backfill `Explanation:` Metadata For Every Legacy Quiz

**Files:**
- Modify: `apps/web/content/*/lessons/quiz.md`
- Use validator: `apps/web/scripts/validate-quiz-metadata.ts`

**Interfaces:**
- Consumes: validator output lines with `missing-explanation`
- Produces: all quiz questions with short review explanations

- [ ] **Step 1: Generate the missing-explanation queue**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Collect files from lines like:

```text
[warning] content\a-letter-to-god\lessons\quiz.md missing-explanation question-1: Lencho
```

- [ ] **Step 2: Add one or two sentence explanations**

Add the explanation immediately after `Answer:`:

```markdown
Answer: 1
Explanation: Lencho is the farmer in the story, and the question asks for the main character rather than the setting or event.
```

- [ ] **Step 3: Keep explanations student-facing**

Each explanation must:

- State why the selected answer is correct.
- Mention a tempting wrong option only when it helps learning.
- Stay short enough to be useful in locked review mode.

- [ ] **Step 4: Re-run validator after each batch**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected: warnings decrease.

- [ ] **Step 5: Repeat until no warnings remain**

Completion signal:

```text
Checked 89 quiz files. Errors: 0. Warnings: 0.
```

---

## Task 5: Manually Review All Three Pilot Quiz Pages

**Files:**
- Review route: `apps/web/app/chapters/[slug]/quiz/page.tsx`
- Review UI: `apps/web/components/QuizScoreForm.tsx`
- Review content:
  - `apps/web/content/real-numbers/lessons/quiz.md`
  - `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
  - `apps/web/content/two-stories-about-flying/lessons/quiz.md`

**Interfaces:**
- Consumes: rendered quiz pages and submit/retry UI
- Produces: manual evidence that pilot quiz review is student-ready

- [ ] **Step 1: Start local student web**

Run:

```powershell
npm.cmd run dev -w apps/web
```

Open:

```text
http://localhost:3000/chapters/real-numbers/quiz
http://localhost:3000/chapters/chemical-reactions-and-equations/quiz
http://localhost:3000/chapters/two-stories-about-flying/quiz
```

- [ ] **Step 2: Review each pilot quiz page**

For each page, confirm:

- The route loads without 404.
- Exactly 5 questions render.
- Every question has selectable options.
- Submit reveals correct/incorrect state.
- Explanation text appears after submit.
- Weak-topic/revision copy uses readable topic labels.
- Feedback form still has the right chapter context.

- [ ] **Step 3: Record review evidence**

Add a short dated note to `master_todo.md` under `Quiz Quality Fixes`:

```markdown
Pilot quiz manual review evidence:
- 2026-07-01 local review passed for Real Numbers, Chemical Reactions and Equations, and Two Stories about Flying.
```

Use the actual date of review.

- [ ] **Step 4: Mark manual review complete**

After all three pages pass, update:

```markdown
- [x] Review all three pilot quizzes manually before the next student batch.
```

---

## Task 6: Verify Immutable Retry And Locked Review Behavior

**Files:**
- Inspect: `apps/web/components/QuizScoreForm.tsx`
- Inspect: `apps/web/lib/quiz-attempts.ts`
- Inspect: `apps/api/src/lib/quiz-attempts.ts`
- Test: `apps/api/src/lib/quiz-attempts.test.ts`

**Interfaces:**
- Consumes: saved quiz attempt history and web retry behavior
- Produces: evidence that retry creates a new attempt and revealed review stays locked

- [ ] **Step 1: Inspect web locked-review state**

Open `apps/web/components/QuizScoreForm.tsx` and confirm:

- Revealed answers remain visible after submit.
- Inputs are not editable as the same attempt after reveal.
- `Retry quiz` clears local answers for a new attempt.
- Retry does not mutate a previously saved attempt.

- [ ] **Step 2: Add focused API regression if missing**

Open `apps/api/src/lib/quiz-attempts.test.ts`. If there is no test for separate retry attempts, add:

```ts
test('summarizeQuizAttempts preserves separate immutable retry attempts', () => {
  const history = summarizeQuizAttempts([
    {
      attemptNumber: 1,
      correctAnswers: 1,
      createdAt: new Date('2026-06-20T10:00:00.000Z'),
      scorePercent: 20,
      totalQuestions: 5,
      weakTopicSlugs: ['balancing-equations'],
    },
    {
      attemptNumber: 2,
      correctAnswers: 4,
      createdAt: new Date('2026-06-20T10:10:00.000Z'),
      scorePercent: 80,
      totalQuestions: 5,
      weakTopicSlugs: [],
    },
  ]);

  assert.deepEqual(
    history.attempts.map((attempt) => attempt.attemptNumber),
    [2, 1],
  );
  assert.equal(history.stats.attemptCount, 2);
  assert.equal(history.stats.bestAttemptNumber, 2);
  assert.equal(history.stats.latestAttemptNumber, 2);
});
```

- [ ] **Step 3: Run focused API helper tests**

Run:

```powershell
npm.cmd run test -w apps/api -- src/lib/quiz-attempts.test.ts
```

Expected: quiz-attempt helper tests pass without requiring DB connectivity.

- [ ] **Step 4: Include retry behavior in manual browser review**

On one pilot quiz page:

- Submit an attempt.
- Confirm the revealed attempt stays locked.
- Click `Retry quiz`.
- Confirm a fresh unanswered attempt appears.
- Confirm the old revealed review was not edited.

- [ ] **Step 5: Mark retry item complete**

After focused test and manual review pass, update:

```markdown
- [x] Keep each retry immutable and locked after review.
```

---

## Task 7: Final Verification And Backlog Update

**Files:**
- Modify: `master_todo.md`
- Modify if durable learning changed: `docs/project-memory.md`
- Run graph refresh if code changed: `graphify update .`

**Interfaces:**
- Consumes: all prior task evidence
- Produces: clean backlog state and verified repo handoff

- [ ] **Step 1: Run full metadata validator**

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected final:

```text
Checked 89 quiz files. Errors: 0. Warnings: 0.
```

- [ ] **Step 2: Run web tests**

Run:

```powershell
npm.cmd run test -w apps/web
```

Expected: all tests pass.

- [ ] **Step 3: Run focused API attempt tests**

Run:

```powershell
npm.cmd run test -w apps/api -- src/lib/quiz-attempts.test.ts
```

Expected: tests pass. Do not use full API test failure from Supabase connectivity to judge this helper unless the focused test fails.

- [ ] **Step 4: Run lint if code changed**

Run:

```powershell
npm.cmd run lint -w apps/web
```

If it fails because `.next/types` is missing, run:

```powershell
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Run diff whitespace check**

Run:

```powershell
git diff --check
```

Expected: exit code `0`.

- [ ] **Step 6: Update `master_todo.md` checkboxes**

Only after verification evidence exists, mark:

```markdown
- [x] Add explicit `Answer:` metadata to every quiz question.
- [x] Add `Explanation:` metadata to every quiz question.
- [x] Add `Topic:` metadata for weak-topic tracking in pilot quizzes first.
- [x] Add a validation script that fails when a quiz question has no answer.
- [x] Add a validation script that warns when a quiz question has no explanation.
- [x] Add tests to prove missing answer metadata cannot silently score option 1.
- [x] Review all three pilot quizzes manually before the next student batch.
- [x] Keep each retry immutable and locked after review.
```

Replace the open note:

```markdown
- [ ] The remaining backlog is legacy non-pilot quiz migration and any manual content cleanup the validator surfaces.
```

with:

```markdown
- [x] Legacy non-pilot quiz migration completed for validator-covered answer and explanation metadata.
```

---

## Acceptance Criteria

- [ ] `npm.cmd run validate:quizzes -w apps/web` reports `Errors: 0. Warnings: 0.`
- [ ] Every quiz question in `apps/web/content/*/lessons/quiz.md` has explicit `Answer:` metadata.
- [ ] Every quiz question in `apps/web/content/*/lessons/quiz.md` has `Explanation:` metadata.
- [ ] Pilot quiz topic metadata is verified against lesson slugs.
- [ ] Three pilot quiz pages are manually reviewed before the next student batch.
- [ ] Retry creates a new attempt and does not unlock the revealed review attempt.
- [ ] Existing non-strict legacy parser fallback remains in place until deliberately removed in a future task.
- [ ] `npm.cmd run test -w apps/web` passes.
- [ ] `npm.cmd run test -w apps/api -- src/lib/quiz-attempts.test.ts` passes.
- [ ] `git diff --check` passes.
- [ ] `master_todo.md` checkboxes match verified reality.

## Out Of Scope

- Do not implement payments or subscriptions.
- Do not widen the student pilot.
- Do not add leaderboards, ranks, coins, or competition.
- Do not remove the legacy parser fallback in this task.
- Do not rewrite quiz questions for style only.
- Do not change mastery thresholds, scoring weights, badge rules, or revision mission business logic.
- Do not claim production readiness from local-only checks.

## Suggested Commit Scope

For content-only batches:

```powershell
git add apps/web/content TODO.md master_todo.md
git commit -m "chore: backfill quiz metadata"
```

For the final retry test and backlog closeout:

```powershell
git add apps/api/src/lib/quiz-attempts.test.ts master_todo.md docs/project-memory.md TODO.md
git commit -m "test: verify quiz retry immutability"
```

After a successful push, rewrite `TODO.md` with the next pilot-first task before ending the session.
