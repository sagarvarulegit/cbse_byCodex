# Next Task: Harden Quiz Metadata Validation

## Recommended Low-Cost AI Model

Use `gpt-5.4-mini` with `reasoning.effort: medium`.

Why this is the best cost/quality fit:

- This task touches content, parser behavior, scripts, package commands, tests, and one existing quiz UX invariant.
- A cheap model can add obvious `Answer:` lines, but the dangerous part is preventing missing answers from silently scoring option 1.
- `gpt-5.4-mini` is the lowest-cost safe default for this task because it can follow the exact file-level plan below and still reason about parser/test failures.
- Use `reasoning.effort: medium` for the implementation pass because the work has several connected contracts.

Fallbacks:

- Cheapest safe review pass: `gpt-5.4-mini` with `reasoning.effort: low`, only after the validation script and tests already exist.
- Cheapest content-only pass: `gpt-5.4-nano` with `reasoning.effort: low`, only for adding missing `Explanation:` or `Topic:` metadata reported by the script.
- Higher confidence: `gpt-5.4` with `reasoning.effort: medium`, only if the parser behavior, package scripts, or quiz-attempt immutability tests become confusing.
- Avoid flagship/high-effort models for the first attempt. The plan below is intentionally detailed enough for a smaller model.

## Goal

Make quiz markdown safe for the next student batch by requiring explicit answer metadata, warning on missing explanations, validating pilot topic metadata first, proving that missing answers cannot silently score option 1 in strict validation, and confirming immutable retry/review behavior remains unchanged.

This task comes from `master_todo.md` under `Quiz Quality Fixes`:

- Add explicit `Answer:` metadata to every quiz question.
- Add `Explanation:` metadata to every quiz question.
- Add `Topic:` metadata for weak-topic tracking in pilot quizzes first.
- Add a validation script that fails when a quiz question has no answer.
- Add a validation script that warns when a quiz question has no explanation.
- Add tests to prove missing answer metadata cannot silently score option 1.
- Review all three pilot quizzes manually before the next student batch.
- Keep each retry immutable and locked after review.

## Current Repo Facts To Preserve

- Student app: `apps/web`.
- Pilot chapter slugs live in `apps/web/lib/pilot.ts` as `PILOT_CHAPTER_SLUGS`.
- Quiz markdown files live at `apps/web/content/<chapter-slug>/lessons/quiz.md`.
- Parser lives in `apps/web/lib/quiz-content.ts`.
- Parser tests live in `apps/web/lib/quiz-content.test.ts`.
- Pilot file-backed quiz tests live in `apps/web/lib/pilot-quiz-content.test.ts`.
- Quiz page lives in `apps/web/app/chapters/[slug]/quiz/page.tsx`.
- Web retry UI state lives in `apps/web/components/QuizScoreForm.tsx`.
- Web quiz-attempt fetch helpers live in `apps/web/lib/quiz-attempts.ts`.
- API immutable attempt summary helper lives in `apps/api/src/lib/quiz-attempts.ts`.
- API attempt summary tests live in `apps/api/src/lib/quiz-attempts.test.ts`.
- Durable project learnings live in `docs/project-memory.md`.

Important current parser behavior:

- `parseQuizContent(markdown, topicSlugs)` keeps legacy fallback behavior outside strict mode.
- `parseQuizContent(markdown, topicSlugs, { strictMetadata: true })` already throws `QuizContentValidationError` for missing/invalid answer, missing explanation, missing topic, and invalid topic.
- Outside strict mode, a missing answer currently falls back to `correctOptionIndex: 0`. Do not remove this legacy fallback for non-pilot quizzes unless all legacy quiz content is migrated and tested.
- Pilot quizzes already call strict mode in `apps/web/lib/pilot-quiz-content.test.ts`.

## Files To Inspect First

Read these before editing:

1. `master_todo.md`
2. `TODO.md`
3. `docs/project-memory.md`
4. `apps/web/lib/quiz-content.ts`
5. `apps/web/lib/quiz-content.test.ts`
6. `apps/web/lib/pilot-quiz-content.test.ts`
7. `apps/web/lib/pilot.ts`
8. `apps/web/lib/course-content.ts`
9. `apps/web/app/chapters/[slug]/quiz/page.tsx`
10. `apps/web/components/QuizScoreForm.tsx`
11. `apps/web/package.json`
12. `package.json`
13. `apps/api/src/lib/quiz-attempts.ts`
14. `apps/api/src/lib/quiz-attempts.test.ts`

Use PowerShell `-LiteralPath` for bracketed Next.js route paths:

```powershell
Get-Content -LiteralPath "apps/web/app/chapters/[slug]/quiz/page.tsx"
```

## Pilot Quiz Files To Review Manually

Review these three files line by line before the next student batch:

```text
apps/web/content/real-numbers/lessons/quiz.md
apps/web/content/chemical-reactions-and-equations/lessons/quiz.md
apps/web/content/two-stories-about-flying/lessons/quiz.md
```

For each pilot quiz question, confirm:

- `Answer:` exists.
- `Answer:` points to the correct option number.
- `Explanation:` exists and explains why the correct option is correct.
- `Topic:` exists and maps to one of that chapter's lesson slugs.
- The quiz still has exactly 5 questions.
- The expected answer order in `apps/web/lib/pilot-quiz-content.test.ts` matches the file.

## Required Quiz Metadata Format

Use this exact shape for every markdown quiz question when editing content:

```markdown
## 1. Short question title

Topic: exact-topic-slug
Difficulty: Easy
Source: NCERT-aligned lesson note

Question text goes here.

1. First option
2. Second option
3. Third option
4. Fourth option

Answer: 2
Explanation: One or two student-friendly sentences explaining why the answer is correct and why a tempting wrong option is not correct.
```

Rules:

- `Answer:` must be a number matching one existing option.
- `Explanation:` must not be empty.
- For pilot quizzes, `Topic:` must match one lesson slug from the chapter metadata.
- Keep the parser tolerant of metadata order; existing parser already handles metadata before or after options.
- Do not change correct answers casually. If an answer value changes, read the question and options first, then update tests only after confirming the new answer is genuinely correct.

## Valid Pilot Topic Slugs

Real Numbers:

- `euclid-division-lemma`
- `fundamental-theorem-of-arithmetic`
- `hcf-and-lcm-by-prime-factorisation`
- `irrational-numbers`
- `decimal-expansion-of-rational-numbers`

Chemical Reactions and Equations:

- `chemical-equations`
- `balancing-equations`
- `combination-and-decomposition-reactions`
- `displacement-and-double-displacement-reactions`
- `oxidation-and-reduction`

Two Stories about Flying:

- `his-first-flight-fear-and-hunger`
- `his-first-flight-courage-and-family-pressure`
- `the-black-aeroplane-storm-and-mystery`
- `the-black-aeroplane-unknown-helper`
- `poems-wild-animals-and-the-ball-poem`

## Implementation Plan

### Task 1: Add A Reusable Quiz Metadata Validator

Files:

- Create: `apps/web/lib/quiz-content-validation.ts`
- Modify: `apps/web/lib/quiz-content.test.ts`

Purpose:

- Keep validation logic importable by both tests and the CLI script.
- Fail for missing `Answer:`.
- Fail for invalid `Answer:`.
- Warn for missing `Explanation:` when `requireExplanation` is false.
- Fail for missing `Explanation:` when `requireExplanation` is true.
- Ignore `Topic:` issues when `requireTopicSlugs` is empty.
- Fail for missing/invalid `Topic:` only when a caller provides required topic slugs.

Implementation shape:

```ts
import { parseQuizContent, QuizContentValidationError, type QuizContentValidationIssue } from './quiz-content';

export type QuizMetadataValidationLevel = 'error' | 'warning';

export type QuizMetadataValidationMessage = QuizContentValidationIssue & {
  level: QuizMetadataValidationLevel;
};

export type QuizMetadataValidationResult = {
  errors: QuizMetadataValidationMessage[];
  questionsParsed: number;
  warnings: QuizMetadataValidationMessage[];
};

export type ValidateQuizMetadataOptions = {
  requireExplanation?: boolean;
  requireTopicSlugs?: string[];
};

export function validateQuizMetadata(
  markdown: string,
  options: ValidateQuizMetadataOptions = {},
): QuizMetadataValidationResult {
  const requiredTopicSlugs = options.requireTopicSlugs ?? [];
  const requireExplanation = options.requireExplanation ?? false;
  const requireTopic = requiredTopicSlugs.length > 0;
  const errors: QuizMetadataValidationMessage[] = [];
  const warnings: QuizMetadataValidationMessage[] = [];
  let questionsParsed = 0;

  try {
    const questions = parseQuizContent(markdown, requiredTopicSlugs, { strictMetadata: true });
    questionsParsed = questions.length;
  } catch (error) {
    if (!(error instanceof QuizContentValidationError)) {
      throw error;
    }

    for (const issue of error.issues) {
      if ((issue.code === 'missing-topic' || issue.code === 'invalid-topic') && !requireTopic) {
        continue;
      }

      const isExplanationWarning = issue.code === 'missing-explanation' && !requireExplanation;
      const target = isExplanationWarning ? warnings : errors;
      target.push({ ...issue, level: isExplanationWarning ? 'warning' : 'error' });
    }

    questionsParsed = parseQuizContent(markdown, requiredTopicSlugs).length;
  }

  return { errors, questionsParsed, warnings };
}
```

Important notes:

- If TypeScript complains because `instanceof QuizContentValidationError` is unreliable across module contexts, use `error instanceof QuizContentValidationError || (error instanceof Error && error.name === 'QuizContentValidationError')`.
- Do not delete `QuizContentValidationError` from `apps/web/lib/quiz-content.ts`.
- Do not change non-strict parser fallback yet.

### Task 2: Add Parser Regression Tests

File:

- Modify: `apps/web/lib/quiz-content.test.ts`

Add a test proving strict validation blocks missing answers instead of silently scoring option 1:

```ts
test('strict quiz metadata rejects missing answers instead of silently scoring option 1', () => {
  const markdown = `## 1. Missing explicit answer

Topic: valid-topic
Explanation: This explanation exists.

Which option should be correct?

1. tempting first option
2. actual correct option
`;

  assert.throws(
    () => parseQuizContent(markdown, ['valid-topic'], { strictMetadata: true }),
    (error: unknown) => {
      assert.ok(error instanceof QuizContentValidationError);
      assert.deepEqual(
        error.issues.map((issue) => issue.code),
        ['missing-answer'],
      );
      return true;
    },
  );
});
```

Add a companion test for the reusable validator:

```ts
test('validateQuizMetadata fails missing answers and warns missing explanations by default', () => {
  const markdown = `## 1. Missing answer and explanation

Topic: valid-topic

Choose the second option.

1. first
2. second
`;

  const result = validateQuizMetadata(markdown, { requireTopicSlugs: ['valid-topic'] });

  assert.deepEqual(
    result.errors.map((issue) => issue.code),
    ['missing-answer'],
  );
  assert.deepEqual(
    result.warnings.map((issue) => issue.code),
    ['missing-explanation'],
  );
  assert.equal(result.questionsParsed, 1);
});
```

Remember to import the new helper:

```ts
import { validateQuizMetadata } from './quiz-content-validation';
```

Expected command:

```powershell
npm.cmd run test -w apps/web -- lib/quiz-content.test.ts
```

Expected result:

- The new tests pass.
- Existing tests still pass.

### Task 3: Add A CLI Validation Script

Files:

- Create: `apps/web/scripts/validate-quiz-metadata.ts`
- Modify: `apps/web/package.json`

Create the `apps/web/scripts` folder if it does not exist.

Script responsibilities:

- Discover all `content/*/lessons/quiz.md` files under `apps/web`.
- Fail with exit code `1` when any question is missing `Answer:` or has invalid `Answer:`.
- Warn, but do not fail, when a non-pilot quiz question has no `Explanation:`.
- Fail missing `Explanation:` for pilot quizzes only, because pilot quizzes must be review-ready before students use them.
- Require valid `Topic:` for pilot quizzes only in this task.
- Print a short summary with file path, issue level, issue code, question id, and title.

Use this implementation skeleton:

```ts
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { getChapter } from '../lib/course-content';
import { PILOT_CHAPTER_SLUGS } from '../lib/pilot';
import { slugifyQuizTopic } from '../lib/quiz-content';
import { validateQuizMetadata } from '../lib/quiz-content-validation';

function isPilotChapterSlug(slug: string): slug is (typeof PILOT_CHAPTER_SLUGS)[number] {
  return PILOT_CHAPTER_SLUGS.includes(slug as (typeof PILOT_CHAPTER_SLUGS)[number]);
}

function getValidTopicSlugs(chapterSlug: string) {
  const chapter = getChapter(chapterSlug);

  if (!chapter) {
    return [];
  }

  return chapter.lessons.length > 0
    ? chapter.lessons.map((lesson) => lesson.slug)
    : (chapter.topics ?? []).map((topic) => slugifyQuizTopic(topic)).filter(Boolean);
}

async function getQuizFiles(contentRoot: string) {
  const chapterDirectories = await readdir(contentRoot, { withFileTypes: true });
  const quizFiles: string[] = [];

  for (const chapterDirectory of chapterDirectories) {
    if (!chapterDirectory.isDirectory()) {
      continue;
    }

    quizFiles.push(path.join(contentRoot, chapterDirectory.name, 'lessons', 'quiz.md'));
  }

  return quizFiles;
}

async function main() {
  const contentRoot = path.join(process.cwd(), 'content');
  const quizFiles = await getQuizFiles(contentRoot);
  let errorCount = 0;
  let warningCount = 0;
  let checkedCount = 0;

  for (const quizFile of quizFiles) {
    let markdown = '';

    try {
      markdown = await readFile(quizFile, 'utf8');
    } catch {
      continue;
    }

    checkedCount += 1;

    const chapterSlug = path.basename(path.dirname(path.dirname(quizFile)));
    const isPilot = isPilotChapterSlug(chapterSlug);
    const result = validateQuizMetadata(markdown, {
      requireExplanation: isPilot,
      requireTopicSlugs: isPilot ? getValidTopicSlugs(chapterSlug) : [],
    });

    for (const issue of result.errors) {
      errorCount += 1;
      console.error(`[error] ${path.relative(process.cwd(), quizFile)} ${issue.code} ${issue.questionId}: ${issue.title}`);
    }

    for (const issue of result.warnings) {
      warningCount += 1;
      console.warn(`[warning] ${path.relative(process.cwd(), quizFile)} ${issue.code} ${issue.questionId}: ${issue.title}`);
    }
  }

  console.log(`Checked ${checkedCount} quiz files. Errors: ${errorCount}. Warnings: ${warningCount}.`);

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

void main();
```

Potential TypeScript issue:

- If `process.cwd()` inside the npm workspace is not `apps/web`, this script will look in the wrong `content` folder.
- The script should be run with `npm.cmd run validate:quizzes -w apps/web`, so `process.cwd()` should be `apps/web`.
- If local output proves otherwise, replace `const contentRoot = path.join(process.cwd(), 'content');` with a robust file-relative root using `import.meta.url`.

Add this package script to `apps/web/package.json`:

```json
"validate:quizzes": "tsx scripts/validate-quiz-metadata.ts"
```

Keep JSON indentation at 2 spaces.

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected result before all content is migrated:

- Exit code `1` if any quiz lacks `Answer:`.
- Warning lines for quizzes missing `Explanation:`.
- No pilot quiz errors or warnings.
- To finish the full backlog item, warnings should be reduced to zero by adding explanations to every quiz question.

### Task 4: Add Explicit Answer Metadata To Every Quiz Question

Files:

- Modify as needed: `apps/web/content/*/lessons/quiz.md`

Process:

1. Run the validation script:

   ```powershell
   npm.cmd run validate:quizzes -w apps/web
   ```

2. For each `[error] ... missing-answer ...` line, open that quiz file.
3. Read the question, options, chapter context, and nearby explanation if present.
4. Add `Answer: <number>` after the option list.
5. The number must match the correct option value shown in the markdown, not the zero-based index.
6. If the correct option is not obvious, do not guess. Add a clear note in the final handoff listing the blocked file and question title.
7. Re-run the validation script after each batch of 5 to 10 quiz files.

Do not use a blind text replacement for answers. This is content correctness work.

### Task 5: Add Explanation Metadata To Every Quiz Question

Files:

- Modify as needed: `apps/web/content/*/lessons/quiz.md`

Process:

1. Use validation warnings to find missing explanations:

   ```powershell
   npm.cmd run validate:quizzes -w apps/web
   ```

2. For each `[warning] ... missing-explanation ...` line, add:

   ```markdown
   Explanation: One sentence explaining the concept in simple Class 10 language.
   ```

3. Keep explanations short, accurate, and student-friendly.
4. Mention why the correct option is correct. If useful, mention why a tempting wrong option is wrong.
5. Do not add long textbook paragraphs.

For pilot quizzes, missing explanations are errors and must be fixed before completion.

### Task 6: Add Pilot Topic Metadata First

Files:

- Modify only if needed:
  - `apps/web/content/real-numbers/lessons/quiz.md`
  - `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
  - `apps/web/content/two-stories-about-flying/lessons/quiz.md`
  - `apps/web/lib/pilot-quiz-content.test.ts`

Process:

1. Confirm each pilot quiz question has `Topic:`.
2. Confirm each topic is one of the valid pilot topic slugs listed above.
3. Run:

   ```powershell
   npm.cmd run test -w apps/web -- lib/pilot-quiz-content.test.ts
   ```

4. If a topic is invalid, fix the quiz file before changing tests.
5. Only change `expectedAnswerValues` in `apps/web/lib/pilot-quiz-content.test.ts` if the actual correct answer changes after manual review.

### Task 7: Preserve Immutable Retry And Locked Review Behavior

Files to inspect:

- `apps/web/components/QuizScoreForm.tsx`
- `apps/web/lib/quiz-attempts.ts`
- `apps/api/src/lib/quiz-attempts.ts`
- `apps/api/src/lib/quiz-attempts.test.ts`
- Any API progress route that creates saved quiz attempts.

Required behavior:

- After a student submits a quiz, the revealed attempt stays locked for review.
- The student cannot edit answers inside that revealed attempt and resubmit it as the same attempt.
- Retry starts a new local attempt.
- Saved attempt history remains immutable.
- Weak-topic slugs continue to come from incorrect questions with valid topic metadata.

If existing tests already cover this behavior, do not invent a large new test suite. Add only a focused regression if you find a gap.

Suggested focused API test if needed:

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

### Task 8: Manual Pilot Quiz Review

Before completion, manually review all three pilot quiz pages locally:

```powershell
npm.cmd run dev -w apps/web
```

Open:

```text
http://localhost:3000/chapters/real-numbers/quiz
http://localhost:3000/chapters/chemical-reactions-and-equations/quiz
http://localhost:3000/chapters/two-stories-about-flying/quiz
```

Checklist:

- [ ] Each page loads without a 404.
- [ ] Each quiz has exactly 5 questions.
- [ ] Submit flow reveals answers.
- [ ] Explanations appear in review mode.
- [ ] Weak-topic/revision copy still uses the intended topic labels.
- [ ] Retry does not unlock the already revealed review attempt.
- [ ] Retry starts a fresh attempt.
- [ ] No pilot quiz question has missing or obviously wrong metadata.

If using the deployed Vercel URL instead of local review, first confirm production is deployed from the current branch/main before treating a 404 as a content bug.

### Task 9: Update Durable Memory If New Rules Are Discovered

File:

- Modify only if a durable rule or gotcha is discovered: `docs/project-memory.md`

Examples worth recording:

- A new quiz metadata contract that future agents must follow.
- A validation-script limitation.
- A deployment gotcha for quiz content tracing.

Do not update `docs/project-memory.md` just to say the task was completed.

## Verification Commands

Run from repo root:

```powershell
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web -- lib/quiz-content.test.ts
npm.cmd run test -w apps/web -- lib/pilot-quiz-content.test.ts
npm.cmd run test -w apps/web
npm.cmd run test -w apps/api
npm.cmd run lint -w apps/web
git diff --check
```

If `npm.cmd run lint -w apps/web` fails because `.next/types` is missing:

```powershell
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
```

Do not treat missing `.next/types` as a source regression until lint is retried after a successful web build.

After modifying code files, run:

```powershell
graphify update .
```

If graphify produces broad unrelated drift because of the known local version mismatch, record that in the final handoff and avoid mixing unrelated generated churn into the main change unless the pre-push hook requires it.

## Acceptance Criteria

- [ ] `apps/web/scripts/validate-quiz-metadata.ts` exists.
- [ ] `apps/web/package.json` has `validate:quizzes`.
- [ ] The validation script fails when a quiz question has no `Answer:`.
- [ ] The validation script fails when `Answer:` points to a non-existing option.
- [ ] The validation script warns when a non-pilot quiz question has no `Explanation:`.
- [ ] The validation script fails when a pilot quiz question has no `Explanation:`.
- [ ] The validation script fails when a pilot quiz question has no valid `Topic:`.
- [ ] `apps/web/lib/quiz-content.test.ts` proves strict mode rejects missing answers instead of silently scoring option 1.
- [ ] All pilot quiz questions have explicit `Answer:`, `Explanation:`, and valid `Topic:` metadata.
- [ ] All three pilot quizzes were manually reviewed before the next student batch.
- [ ] Existing non-strict legacy parser fallback remains available for unmigrated non-pilot quiz routes.
- [ ] Immutable retry/review behavior remains unchanged.
- [ ] `npm.cmd run validate:quizzes -w apps/web` has no errors.
- [ ] `npm.cmd run validate:quizzes -w apps/web` has no warnings by the end of the metadata cleanup.
- [ ] `npm.cmd run test -w apps/web` passes.
- [ ] `npm.cmd run test -w apps/api` passes or any DB/network blocker is clearly documented.
- [ ] `npm.cmd run lint -w apps/web` passes after build retry if needed.
- [ ] `git diff --check` passes.

## Out Of Scope

- Do not implement payments or subscriptions.
- Do not widen the student pilot.
- Do not add leaderboards, ranks, coins, or competition.
- Do not remove legacy non-strict parser fallback until all non-pilot quizzes are migrated.
- Do not rewrite all quiz questions stylistically.
- Do not change lesson content unless a quiz answer cannot be verified without checking the lesson.
- Do not change scoring weights, mastery thresholds, badge rules, or revision mission business logic.
- Do not make revealed quiz attempts editable.
- Do not fake manual review or real student pilot evidence.

## Suggested Commit Scope

If the implementation includes script, tests, and quiz metadata edits, use one focused commit:

```powershell
git add TODO.md apps/web/package.json apps/web/scripts/validate-quiz-metadata.ts apps/web/lib/quiz-content-validation.ts apps/web/lib/quiz-content.test.ts apps/web/lib/pilot-quiz-content.test.ts apps/web/content
git commit -m "chore: validate quiz metadata"
```

If only this handoff file changes, commit only this file:

```powershell
git add TODO.md
git commit -m "docs: detail quiz metadata validation task"
```

On Windows, `todo.md` and `TODO.md` may refer to the same file. If `git status --short` shows only `TODO.md`, that is expected.

## After Successful Push

After this task is implemented, committed, and pushed:

1. Re-read `master_todo.md`, `docs/TODO.md`, and `docs/project-memory.md`.
2. Choose the next pilot-first task, not a payment/subscription task unless the user explicitly changes priority.
3. Rewrite `TODO.md` with the next detailed execution playbook before ending that future session.
