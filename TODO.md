# TODO

Last updated: 2026-06-22

## Next Task

Fix answer, explanation, and topic metadata for the three free-pilot quizzes so quiz scoring and review are trustworthy before the next student batch.

## Why This Is Next

The chapter-pack notes and Comic Style Recap rendering have been polished for the pilot notes pages. The next biggest pilot risk is quiz quality:

- Many generated quiz files still rely on the parser fallback that treats missing `Answer:` metadata as option 1.
- Missing explanations weaken locked quiz review after submit.
- Missing `Topic:` metadata weakens weak-topic tracking, revision missions, and mastery recovery copy.
- The free pilot should not collect student evidence from quizzes that may score or explain answers incorrectly.

Payments, subscriptions, mobile/offline, leaderboards, coins, and public ranking remain out of scope until real usage, feedback, bug fixing, and platform hardening produce enough confidence.

## Product Goal

As a Class 10 student, I should be able to take a free-pilot quiz, see a reliable score, and review explanations that help me improve without wondering whether the answer key is missing or wrong.

## Scope

Start with the three free-pilot chapters:

- `real-numbers`
- `chemical-reactions-and-equations`
- `two-stories-about-flying`

Keep the work focused on quiz metadata and validation. Do not add payments, subscriptions, mobile/offline, public competition, or broad content rewrites.

## Implementation Notes

- Inspect the current quiz markdown files used by `/chapters/[slug]/quiz`.
- Add explicit `Answer: <option number>` metadata for every pilot quiz question.
- Add concise `Explanation:` metadata for every pilot quiz question.
- Add `Topic:` metadata that matches valid chapter topic/lesson slugs where available.
- Add or update tests so missing answer metadata cannot silently score option 1 for pilot-quality quizzes.
- Prefer a small validation helper/script if it prevents this class of content issue from returning.
- Preserve immutable quiz-attempt behavior and locked review after submit.

## Verification

Run:

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint
npm.cmd run build -w apps/web
```

If source files change, run:

```powershell
graphify update .
```

## Acceptance Criteria

- All three pilot quizzes have explicit answer metadata.
- All three pilot quizzes have explanations.
- Pilot quiz topic metadata maps to useful chapter topics where practical.
- Tests or validation cover missing-answer metadata so option 1 is not silently treated as correct in pilot-quality content.
- Quiz review still locks after submit and retry remains a new immutable attempt.
- No monetization, entitlement, mobile/offline, leaderboard, coin, or public-rank work is introduced.

## After This Task

After pilot quiz quality is verified, the next product task should be one of:

1. Polish Chemical Reactions and Two Stories into stronger lesson-wise pilot chapters.
2. Run the tiny real-student pilot and choose one feedback-driven fix from admin evidence.
3. Add a content style QA checklist for chapter notes and quizzes.

## After Push Rule

After every successful git push, update this file with the next task before ending the session.
