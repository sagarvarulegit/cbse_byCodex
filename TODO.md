# TODO

Last updated: 2026-06-24

## Next Task

Polish Chemical Reactions and Equations into complete lesson-wise pilot content, starting with Chemical equations and Balancing equations, while preserving the free-pilot feedback loop.

## Goal

Give pilot students two useful, readable Science lessons that replace the current “notes are still being prepared” experience and prepare them for the existing chapter quiz.

## Why This Is Next

Pilot quiz metadata is now strictly validated, but the Science pilot chapter still has no lesson markdown files. Its first two catalog lessons point to empty filenames and generic previews, so students can reach a trustworthy quiz without receiving equivalent lesson-wise preparation.

## Scope

Create and wire only these first two lessons:

1. `chemical-equations`
2. `balancing-equations`

Keep the remaining three lessons, API behavior, quiz scoring, mastery, revision missions, authentication, payments, subscriptions, mobile/offline, and competition mechanics unchanged.

## Files

- Create: `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
- Create: `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- Modify: `apps/web/lib/course-content.ts`
- Inspect: `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- Inspect for structure: `apps/web/content/real-numbers/lessons/01-euclid-division-lemma.md`
- Inspect for structure: `apps/web/content/real-numbers/lessons/02-fundamental-theorem-of-arithmetic.md`
- Modify if durable knowledge changes: `docs/project-memory.md`
- Generated after source changes: `graphify-out/`

## Implementation Notes

### Lesson metadata

Use frontmatter consistent with the Real Numbers lessons:

- `subject: Science`
- `class_level: 10`
- `chapter: Chemical Reactions and Equations`
- `chapter_slug: chemical-reactions-and-equations`
- lesson numbers `1` and `2`
- matching lesson slugs
- estimated time between 8 and 12 minutes
- lesson 1 remains free; lesson 2 keeps its current catalog access level
- `status: draft`

Update the matching `fileName` values and replace the generic previews in `apps/web/lib/course-content.ts`.

### Chemical equations lesson

Cover:

- what a chemical reaction is;
- observable signs: colour, state, gas, temperature, and precipitate changes;
- word equations;
- reactants on the left and products on the right;
- converting simple word equations into formula equations;
- state symbols `(s)`, `(l)`, `(g)`, and `(aq)`;
- at least three solved examples;
- common mistakes, board tips, practice, answers, one-minute revision, and a short comic recap.

Use only factually correct Class 10 examples aligned with the existing chapter pack. Do not invent unsafe home experiments.

### Balancing equations lesson

Cover:

- law of conservation of mass;
- why formulae must never be changed while balancing;
- coefficients versus subscripts;
- a repeatable atom-counting method;
- at least four worked examples from easy to board-style;
- a final atom-count table or explicit left/right verification for each worked example;
- common mistakes, board tips, practice, answers, one-minute revision, and a short comic recap.

Include these examples somewhere in the explanation or practice:

- `H2 + O2 -> H2O`
- `Fe + H2O -> Fe3O4 + H2`
- one equation with a polyatomic ion that remains unchanged on both sides.

### Content quality rules

- Write in simple Indian classroom English without becoming childish.
- Define technical terms before using them heavily.
- Keep equations chemically correct.
- Use backticks for formulae and equations.
- Do not copy large textbook passages verbatim.
- Avoid placeholder sections, `TBD`, and unsupported demo markers.
- Preserve the existing pilot engagement and feedback components by using the normal lesson route.

## Acceptance Criteria

- Both markdown files exist and render through `/chapters/chemical-reactions-and-equations/lessons/<lesson-slug>`.
- `getChapter('chemical-reactions-and-equations')` points to the new filenames.
- The first two lesson cards have accurate, non-placeholder previews.
- Both lessons have learning goals, explanations, solved examples, mistakes, practice, answer checks, revision summaries, and comic recaps.
- Chemical formulae and balancing steps are factually correct.
- The existing pilot quiz still passes strict metadata validation.
- No API, database, authentication, payment, mastery, mission, or attempt-persistence behavior changes.
- Web tests, lint, and build pass.
- Browser smoke confirms both lesson routes render and the pilot feedback surface remains present.
- `graphify update .` runs after source changes.

## Verification

Run:

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
rg -n "notes are still being prepared" apps/web/lib/course-content.ts
rg -n "TBD|TODO|\[\[demo:" apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md
graphify update .
git diff --check
git status --short
```

Expected:

- tests, type checking, and build pass;
- the first two Science lesson previews no longer use placeholder copy;
- no placeholder text or unsupported demo markers exist in the new lessons;
- only intended source, memory, TODO, and graphify files are staged.

## Browser Smoke

Open:

- `http://localhost:3000/chapters/chemical-reactions-and-equations/lessons/chemical-equations`
- `http://localhost:3000/chapters/chemical-reactions-and-equations/lessons/balancing-equations`

Confirm:

- title, lesson metadata, all major sections, equations, practice, and recap render;
- previous/next navigation is correct;
- the free-pilot engagement tracker and feedback form still appear where expected;
- there are no console rendering errors.

## Out of Scope

- Writing the other three Science lessons.
- Rewriting the chapter quiz.
- Adding animations or a new runtime library.
- Database or API changes.
- Payments, subscriptions, entitlements, mobile/offline, leaderboards, coins, or public ranking.

## After Push Rule

After every successful git push, keep this file updated with the next executable task before ending the session.
