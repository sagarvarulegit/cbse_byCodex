# TODO

Last updated: 2026-06-30

## Next Task

Confirmed after the curriculum source-of-truth branch push: the next detailed executable task remains the Chemical Reactions pilot lesson expansion below.

Create the next two complete lesson-wise pilot notes for Chemical Reactions and Equations:

1. `combination-and-decomposition-reactions`
2. `displacement-and-double-displacement-reactions`

Extend the tested lesson loader and navigation without changing authentication, quiz scoring, pilot tracking, or the still-unpublished Oxidation and reduction lesson.

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:test-driven-development` for implementation and `superpowers:verification-before-completion` before committing. Write and run failing content/navigation tests before creating either lesson file.

## Goal

Give pilot students two accurate, exam-oriented lessons covering the four main reaction patterns that follow equation writing and balancing. After this task, exactly four Chemical Reactions lessons should be live and lesson 4 should return to the chapter overview instead of linking to unpublished lesson 5.

## Current Implementation Facts

- Chapter catalog and loader: `apps/web/lib/course-content.ts`
- Existing file-backed tests: `apps/web/lib/course-content.test.ts`
- Lesson route: `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`
- Chapter route: `apps/web/app/chapters/[slug]/page.tsx`
- Source chapter pack: `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- Existing chapter quiz: `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- Existing Chemical lesson references:
  - `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
  - `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- The Chemical chapter directory is already registered in `lessonDirectories`.
- `getAvailableLessons()` is the source of truth for live counts.
- `getLessonContent()` already skips catalog lessons with empty `fileName` values.

The markdown parser supports only:

- `#`, `##`, and `###` headings;
- paragraphs;
- unordered lists beginning with `-`;
- ordered lists beginning with `1.`;
- a one-line code block when the whole line is wrapped in backticks.

The comic renderer requires an exact `## Comic recap` heading followed immediately by four unordered-list items in `Speaker: "Dialogue"` format.

## Scope

### In Scope

- Two new lesson markdown files.
- Catalog metadata for lessons 3 and 4.
- Test-first coverage for loading, required sections, examples, and navigation.
- Truthful live counts changing automatically from two to four through `getAvailableLessons()`.
- Browser smoke for free/premium access, sidebar state, navigation, pilot controls, and chapter count.
- One concise durable learning in `docs/project-memory.md` only if this task discovers a new rule beyond the existing available-lesson rule.
- `graphify update .` after source changes.

### Out of Scope

- Writing `oxidation-and-reduction`.
- Rewriting lessons 1 or 2.
- Rewriting the chapter pack or quiz.
- Adding simulations, videos, demo markers, MDX, or dependencies.
- Changing authentication, entitlements, API, Prisma, database, mastery, missions, badges, or attempts.
- Making premium lessons free.
- Payments, subscriptions, mobile/offline, ranking, coins, or leaderboards.
- Editing the unrelated untracked `master_todo.md`.

## Files

### Create

- `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`

### Modify

- `apps/web/lib/course-content.test.ts`
- `apps/web/lib/course-content.ts`
- `TODO.md` after completion
- `docs/project-memory.md` only if a genuinely new durable rule is found

### Inspect, Do Not Rewrite

- `apps/web/app/chapters/[slug]/page.tsx`
- `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`
- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- `apps/web/components/PilotEngagementTracker.tsx`
- `apps/web/components/PilotFeedbackForm.tsx`

### Generated

- `graphify-out/`

## Global Constraints

- Use TypeScript and existing helpers only.
- Add no dependency.
- Use ASCII characters in new content.
- Write equations with `->` and multiplication with `x`.
- Wrap formulae, equations, element symbols, and state symbols in backticks.
- Use simple Indian classroom English without sounding childish.
- Define each reaction type before using it repeatedly.
- Keep every equation chemically correct and balanced when presented as a final equation.
- Do not describe unsafe home experiments.
- Teacher-supervised observations may be described as textbook examples.
- Do not copy long NCERT passages.
- Keep lessons 3 and 4 premium.
- Preserve the existing pilot tracker, completion button, and feedback form.
- Do not modify quiz metadata or `QuizScoreForm`.
- Use `npm.cmd` in PowerShell.

---

## Implementation Plan

### Task 1: Extend the failing file-backed tests

Modify `apps/web/lib/course-content.test.ts` before creating lesson files.

- [ ] Update the catalog test to expect exactly these available slugs:

```ts
[
  'chemical-equations',
  'balancing-equations',
  'combination-and-decomposition-reactions',
  'displacement-and-double-displacement-reactions',
]
```

- [ ] Assert lesson 3 uses `03-combination-and-decomposition-reactions.md`, remains premium, and lesson 4 uses `04-displacement-and-double-displacement-reactions.md`, remains premium.
- [ ] Update lesson 2 navigation to expect lesson 3 as `nextLesson`.
- [ ] Add a lesson 3 test asserting previous lesson 2 and next lesson 4.
- [ ] Add a lesson 4 test asserting previous lesson 3 and `nextLesson === null`.
- [ ] Assert lesson 3 includes these h2 headings:

```text
learning goals
recognising a reaction pattern
combination reactions
decomposition reactions
thermal decomposition
electrolytic decomposition
photochemical decomposition
solved examples
common mistakes
board tips
quick practice
answer check
one-minute revision
comic recap
```

- [ ] Assert lesson 3 contains:

```text
CaO + H2O -> Ca(OH)2
CaCO3 -> CaO + CO2
2H2O -> 2H2 + O2
2AgCl -> 2Ag + Cl2
```

- [ ] Assert lesson 4 includes these h2 headings:

```text
learning goals
reactivity decides displacement
displacement reactions
double displacement reactions
precipitation reactions
solved examples
common mistakes
board tips
quick practice
answer check
one-minute revision
comic recap
```

- [ ] Assert lesson 4 contains:

```text
Fe + CuSO4 -> FeSO4 + Cu
Zn + 2HCl -> ZnCl2 + H2
Na2SO4 + BaCl2 -> BaSO4 + 2NaCl
AgNO3 + NaCl -> AgCl + NaNO3
```

- [ ] Reuse `assertFourPanelComic()` for both lessons.
- [ ] Run:

```powershell
npm.cmd run test -w apps/web
```

Expected red state: catalog/navigation/content assertions fail because lessons 3 and 4 still have empty `fileName` values and their files do not exist.

### Task 2: Author lesson 3

Create `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`.

Frontmatter must be exactly:

```yaml
---
title: Combination and decomposition reactions
subject: Science
class_level: 10
chapter: Chemical Reactions and Equations
chapter_slug: chemical-reactions-and-equations
lesson_number: 3
lesson_slug: combination-and-decomposition-reactions
estimated_minutes: 9
access_level: premium
status: draft
---
```

Required h2 order:

1. `## Learning goals`
2. `## Recognising a reaction pattern`
3. `## Combination reactions`
4. `## Decomposition reactions`
5. `## Thermal decomposition`
6. `## Electrolytic decomposition`
7. `## Photochemical decomposition`
8. `## Solved examples`
9. `## Common mistakes`
10. `## Board tips`
11. `## Quick practice`
12. `## Answer check`
13. `## One-minute revision`
14. `## Comic recap`
15. `## Remember this line`

Content contract:

- Define a combination reaction as two or more reactants forming one product.
- Use balanced examples `CaO + H2O -> Ca(OH)2` and `2Mg + O2 -> 2MgO`.
- Define a decomposition reaction as one compound breaking into two or more simpler substances.
- Explain that decomposition requires energy as heat, electricity, or light.
- Thermal example: `CaCO3 -> CaO + CO2`.
- Electrolytic example: `2H2O -> 2H2 + O2`.
- Photochemical example: `2AgCl -> 2Ag + Cl2`.
- State that silver chloride turns grey in sunlight because silver forms.
- Include at least four solved examples that identify the type and explain the reactant/product pattern.
- Common mistakes must distinguish reaction pattern from observation, avoid calling every heated reaction decomposition, and require balanced equations.
- Board tips must tell students to count reactants/products, name the energy source for decomposition, write the observation when asked, and verify balancing.
- Add five practice questions with exact answers covering type identification, balancing, and energy source.
- Add six one-minute revision bullets.

Comic recap must be exactly:

```markdown
## Comic recap
- Combo Builder: "Many reactants join to make one product."
- Breakup Bot: "One compound splits into simpler substances."
- Energy Crew: "Heat, electricity, or light can start decomposition."
- Pattern Checker: "Count reactants and products before naming the type."
```

End with:

```markdown
## Remember this line

Combination joins; decomposition splits.
```

### Task 3: Author lesson 4

Create `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`.

Frontmatter must be exactly:

```yaml
---
title: Displacement and double displacement reactions
subject: Science
class_level: 10
chapter: Chemical Reactions and Equations
chapter_slug: chemical-reactions-and-equations
lesson_number: 4
lesson_slug: displacement-and-double-displacement-reactions
estimated_minutes: 10
access_level: premium
status: draft
---
```

Required h2 order:

1. `## Learning goals`
2. `## Reactivity decides displacement`
3. `## Displacement reactions`
4. `## Double displacement reactions`
5. `## Precipitation reactions`
6. `## Solved examples`
7. `## Common mistakes`
8. `## Board tips`
9. `## Quick practice`
10. `## Answer check`
11. `## One-minute revision`
12. `## Comic recap`
13. `## Remember this line`

Content contract:

- Define reactivity as how readily a substance takes part in a chemical reaction.
- Explain that a more reactive element displaces a less reactive element from its compound.
- Use `Fe + CuSO4 -> FeSO4 + Cu` with the observation that blue copper sulphate solution changes and brown copper deposits.
- Use `Zn + 2HCl -> ZnCl2 + H2` as another displacement example.
- State that copper cannot displace zinc from zinc sulphate because copper is less reactive.
- Define a double displacement reaction as two compounds exchanging ions.
- Use `Na2SO4 + BaCl2 -> BaSO4 + 2NaCl`.
- Define a precipitate as an insoluble solid formed from solutions.
- Use `AgNO3 + NaCl -> AgCl + NaNO3`, identifying white `AgCl` as the precipitate.
- Include at least four solved examples that identify the type, displaced element or exchanged ions, and visible observation where relevant.
- Common mistakes must cover ignoring reactivity, confusing single and double displacement, failing to identify the precipitate, and leaving equations unbalanced.
- Board tips must require the reactivity reason, observation, precipitate name/formula, and balanced equation.
- Add five practice questions with exact answers.
- Add six one-minute revision bullets.

Comic recap must be exactly:

```markdown
## Comic recap
- Reactive Raja: "I can replace a less reactive element."
- Copper Seat: "Iron pushed me out of copper sulphate."
- Ion Exchange Team: "Two compounds swap partners."
- Precipitate Detective: "The insoluble solid reveals the reaction."
```

End with:

```markdown
## Remember this line

Displacement replaces one element; double displacement exchanges ions.
```

### Task 4: Wire catalog metadata

Modify only lesson objects 3 and 4 in `apps/web/lib/course-content.ts`.

Lesson 3:

```ts
{
  slug: 'combination-and-decomposition-reactions',
  fileName: '03-combination-and-decomposition-reactions.md',
  title: 'Combination and decomposition reactions',
  type: 'Reaction pattern guide',
  minutes: 9,
  free: false,
  preview: 'Recognise when substances combine and when one compound decomposes using heat, electricity, or light.',
},
```

Lesson 4:

```ts
{
  slug: 'displacement-and-double-displacement-reactions',
  fileName: '04-displacement-and-double-displacement-reactions.md',
  title: 'Displacement and double displacement reactions',
  type: 'Reactivity and ion exchange',
  minutes: 10,
  free: false,
  preview: 'Use reactivity and ion exchange to identify displacement, double displacement, and precipitation reactions.',
},
```

Do not change lesson 5.

Run:

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

Expected:

- All tests pass.
- `getAvailableLessons()` returns exactly four Chemical lessons.
- Lesson 2 points to lesson 3.
- Lesson 3 points backward to lesson 2 and forward to lesson 4.
- Lesson 4 points backward to lesson 3 and has no unpublished next link.
- Existing UI count code automatically reports four live notes without page changes.

### Task 5: Content QA

Run:

```powershell
rg -n "^## " apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md
rg -n "TBD|TODO|\[\[demo:|```|<table|<div|^\|" apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md
```

Expected:

- Required h2 headings appear once and in order.
- Each Comic recap is immediately followed by exactly four valid list items.
- No prohibited placeholder or unsupported syntax matches.

Manually verify:

1. Every final equation is balanced.
2. Formula capitalization is correct.
3. Reaction classifications match the reactant/product pattern.
4. Displacement claims agree with relative reactivity.
5. Precipitates are identified accurately.
6. No unsafe unsupervised activity is suggested.

### Task 6: Build and route smoke

Run:

```powershell
npm.cmd run build -w apps/web
```

Start web and API locally. If the Supabase pooler is unavailable, record that existing video lookup limitation; the page should still render through the API route's error response.

Smoke:

- Logged-out lesson 1 remains `200`.
- Logged-out lessons 2-4 redirect to login with the correct `next` URL.
- With a valid local student session, lessons 3 and 4 return `200`.
- Lesson 3 shows `4 lesson notes`, links back to lesson 2 and forward to lesson 4.
- Lesson 4 shows `4 lesson notes`, links back to lesson 3, and returns to chapter overview at the end.
- Sidebar shows lessons 1-4 as links and lesson 5 as Coming soon.
- Chapter page says `4 lesson notes ready`.
- First four rows show Open notes; lesson 5 shows Coming soon.
- Pilot lesson-start, Mark studied, and feedback controls remain present.
- Chapter quiz link remains present.

### Task 7: Graphify, final verification, TODO rollover, commit, and push

Run:

```powershell
graphify update .
npm.cmd run test -w apps/web
npm.cmd run lint
npm.cmd run build -w apps/web
rg -n "Science lesson notes are still being prepared" apps/web/lib/course-content.ts
git diff --check
git status --short
```

Expected:

- Tests, workspace lint, and web build pass.
- Placeholder preview text appears exactly once, on Oxidation and reduction.
- `master_todo.md` remains untouched and untracked.

Replace this TODO with the next detailed executable task. Default next task:

```text
Create the final Chemical Reactions lesson-wise pilot note for Oxidation and reduction, then verify that all five lessons, chapter counts, navigation, quiz topics, and pilot controls form one complete chapter path.
```

Stage only intended files plus reviewed `graphify-out/` changes.

Commit:

```powershell
git commit -m "Add reaction types pilot lessons"
```

Push:

```powershell
git push
```

If the pre-push hook refreshes graph artifacts, inspect them, commit them separately as `Refresh graphify report`, and push again.

Confirm:

```powershell
git status --short --branch
git rev-list --left-right --count 'HEAD...@{upstream}'
```

Expected synchronization is `0  0`; the only allowed remaining item is untracked `master_todo.md`.

## Acceptance Criteria

- Lessons 3 and 4 exist with exact frontmatter and required sections.
- Both remain premium.
- Exactly four Chemical lessons are available.
- Navigation skips unpublished lesson 5.
- Chapter and lesson pages report four live notes through the existing helper.
- Lesson 3 accurately teaches combination and three decomposition energy modes.
- Lesson 4 accurately teaches displacement, double displacement, and precipitation.
- Required equations are correct and balanced.
- Both lessons include solved examples, practice, answers, revision, and four-panel comic recaps.
- Unsupported markdown syntax is absent.
- Access protection and pilot controls remain unchanged.
- Existing strict Chemical quiz validation passes.
- Tests, lint, and build pass.
- Graphify is refreshed.
- `TODO.md` contains the following executable task before the final push.

## After Push Rule

After every successful git push, confirm `TODO.md` contains the next detailed executable task before ending the session.
