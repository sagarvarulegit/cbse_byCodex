# Science Chapter 1 Quality Remediation Implementation Plan

## Current handoff — 2026-07-21

- [x] Complete the NCERT-fidelity remediation for all six Chapter 1 lessons, exercises, quiz, chapter pack, metadata, and accessible illustrations.
- [x] Replace the inaccurate Chapter 1 redraws and expose image labels as numbered pins with matching HTML keys.
- [ ] Next task: conduct a small manual student review of Chapter 1 and record comprehension, navigation, and figure-label feedback. Automated tests and all Graphify updates remain paused until the user explicitly re-enables them.

> **Planning status:** This is the immediate execution handoff. It replaces the completed/stale quiz-metadata handoff. Do not implement from memory or from the current lesson text alone; use the local NCERT PDF and the repository standards as the source of truth.

**Goal:** Make Class 10 Science Chapter 1, *Chemical Reactions and Equations*, genuinely NCERT-faithful, understandable to a low-confidence student, honest about mastery, fast on mobile, and strong enough for a real student pilot.

**Primary source:** `textbooks/science/extracted/jesc101.pdf` — NCERT Class 10 Science Chapter 1, Reprint 2026-27, 16 pages.

**Architecture:** Keep the five existing conceptual lesson slugs so saved links, topic metadata, weak-topic recovery, and navigation remain stable. Reallocate their content into exact textbook order, then add one unnumbered supporting lesson, `ncert-exercises-and-revision`, for the 20 NCERT exercises and Group Activity. The lesson sequence becomes the canonical learning path; the chapter pack becomes a secondary `One-page revision sheet`. Source-fidelity tests, not loose substring checks, guard the content. Static activity illustrations remain the visual approach, but their apparatus, captions, loading, and image budgets must be corrected. One focused balancing workbench is added only after the integrity and UX gates pass.

**Tech stack:** Existing Next.js 15 / React 19 / TypeScript student app, markdown lesson parser, Node test runner, built-in `next/image`, and existing CSS. No new runtime library is required.

---

## Priority Gates

### Gate A1 — P0 Trust Blockers

Complete Tasks 0-6 plus Tasks 9A and 11A first. This is the first independently landable slice: it removes cross-chapter/invented content, restores exact numbered teaching order and in-text Questions, renders the mandated Q&A markup cleanly, and prevents fabricated mastery/rewards. Do not hold these trust corrections behind image conversion or visual polish.

### Gate A2 — P0 Completeness, Assessment, And Delivery Quality

Complete Tasks 7-10 after Gate A1. This adds the exact exercises, finishes figure fidelity and image delivery, synchronises the catalog/revision sheet, and rebuilds the chapter assessment.

### Gate B — P1 Struggling-Student UX And Performance

Complete Tasks 11B and 11C after Gate A2. Task 11A already lands with Gate A1. Gate B finishes working navigation, chemistry typography, mobile controls, readable section variants, and the remaining tested interaction experience.

### Gate C — P2 Signature Learning Feature

Task 12 is an optional differentiation release after Gates A1, A2, and B are stable. It adds a lightweight, keyboard-accessible balancing workbench. It is not required for the chapter's first technically pilot-ready release. Reaction sorting, AI tutoring, 3D laboratories, and elaborate animation remain deferred.

Do not collapse these gates into one unreviewable rewrite. Each gate must be independently testable and reviewable.

### Actual Execution Order

Follow this order even though Task 11A is documented with the other UI work:

1. Task 0
2. Task 1
3. Task 11A (minimal standards-compliant Q&A rendering)
4. Tasks 2-6
5. Task 9A
6. Gate A1 review
7. Tasks 7, 8A, 8B, 9B, and 10
8. Gate A2 review
9. Tasks 11B and 11C
10. Task 13 technical pilot-readiness verification
11. Optional Task 12, followed by the Optional Gate C checks in Task 13
12. Small real-student pilot; do not call the chapter student-validated before this evidence exists

---

## Global Constraints

- Preserve the existing conceptual lesson slugs:
  - `chemical-equations`
  - `balancing-equations`
  - `combination-and-decomposition-reactions`
  - `displacement-and-double-displacement-reactions`
  - `oxidation-and-reduction`
- Add `ncert-exercises-and-revision` only as an unnumbered supporting lesson. Do not invent a textbook section number for it.
- Preserve exact NCERT parent/child numbering and order: `1.1`, `1.1.1`, `1.1.2`, `1.2`, `1.2.1` through `1.2.5`, `1.3`, `1.3.1`, and `1.3.2`.
- Copy textbook Questions exactly and place each Questions block where NCERT places it. The platform answer may be simplified, but the question wording must not be paraphrased.
- Keep Activities 1.1-1.11 only. `Activity 1.12` and `Activity 1.13` do not exist in this chapter.
- Represent Figures 1.1-1.10 with their correct numbers, captions, apparatus, labels, and safety cues. Activity 1.2 has no numbered textbook figure.
- Keep existing `[[demo:activity-...]]` markers for activity-sequence cards, but render the exact figure number/caption inside the card. Use the standards-compliant `[FIGURE: figure_id]` token for standalone figure-only content; do not silently mix the two contracts.
- Preserve NCERT equation numbering `(1.1)` through `(1.32)` wherever the source uses it, including state symbols and reaction conditions.
- Platform memory tricks, hints, practice, gamification, and comic recaps must be accurate, derived from the taught concept, and visibly distinguished from exact NCERT wording.
- Do not call an illustration an animation. Use `illustration`, `activity sequence`, or `observation aid` unless it actually moves.
- Do not expose teacher notes, local filenames, PDF paths, or internal alignment commentary on a student page.
- Do not use `chapter.progress` as earned student mastery.
- Do not add payments, subscriptions, new API models, new database tables, admin CMS work, video production, or work in other chapters.
- Do not reintroduce the deleted canvas lab components. The current static-illustration migration is user-owned work.
- Do not reset, clean, delete, or overwrite unrelated dirty-worktree changes.
- Do not commit or push unless the later implementation request explicitly authorises it.

---

## Current Known State

- The working tree is broadly dirty across Science content, chapter routes, CSS, static illustrations, generated Graphify output, and Chapter 6 work. `ActivityIllustration.tsx`, `StaticFigureDemo.tsx`, and activity assets are currently untracked while older canvas components are deleted.
- The Graphify report is built from the current `HEAD` commit `8ac4a59254d5141b57daccad635aeb70f89a11b9`, but implementation must still inspect uncommitted diffs because the working tree is newer than `HEAD`.
- Chapter 1 has five live conceptual lesson files and one five-question quiz.
- The current lesson split is usable, but the visible titles contain synthetic ranges such as `1.1 continued` and `1.2.1-1.2.2`.
- Lesson 1 contains Chapter 5 Life Processes Questions and answers.
- Lesson 1 presents Activities 1.2, 1.3, and 1.4 before Activity 1.1.
- Lesson 5 invents Activities 1.12 and 1.13.
- None of the eight top-level in-text NCERT questions is currently preserved exactly.
- Only Figure 1.1 is explicitly numbered; Figures 1.2-1.10 and several apparatus/safety cues are missing or inaccurate.
- The chapter pack contains a wrong doubled source path, internal alignment copy, and a section/content ordering mismatch.
- A new or signed-out student can see `56%` mastery and unlocked-looking rewards because `chapter.progress` is used as a fallback.
- `Jump to practice` targets the start of the article instead of the real `Quick practice` heading.
- The quiz has only five basic recognition questions and every correct answer is option 1.
- `apps/web/lib/pilot-quiz-content.test.ts` currently locks the bad `[1, 1, 1, 1, 1]` answer pattern.
- The current web test suite and quiz validator pass, so passing tests alone are not evidence of source fidelity.
- Chapter 1 activity assets are roughly 14 MiB in their current form; Lesson 1 alone references roughly 7 MiB of imagery.
- `master_todo.md` currently marks Chapter 1 as full pilot quality. The audit disproves that claim; reopen it at implementation start and check it again only after Gates A1, A2, and B pass.

---

## Source-Of-Truth Map

Use this map before moving or writing any content:

| PDF pages | Required source content | Destination |
| --- | --- | --- |
| 1-2 | Daily-life opening; Activities 1.1-1.3; Figures 1.1-1.2 | Lesson 1 |
| 2-6 | `1.1`, `1.1.1`, `1.1.2`; equations `(1.1)`-`(1.12)`; first Questions block | Lessons 1-2 |
| 6-10 | Parent `1.2`; `1.2.1`, `1.2.2`; Activities 1.4-1.8; Figures 1.3-1.7; whitewashing and endothermic boxes; second Questions block | Lesson 3 |
| 10-11 | `1.2.3`, `1.2.4`; Activities 1.9-1.10; Figures 1.8-1.9; Recall Activity 1.2 | Lesson 4 |
| 12-14 | `1.2.5`; Activity 1.11; Figure 1.10; Recall Activity 1.1; third Questions block; parent `1.3`; `1.3.1`, `1.3.2`; What you have learnt | Lesson 5 |
| 14-16 | Exercises 1-20; Group Activity | Lesson 6 |

The three in-text Questions blocks begin with these source anchors:

1. After `1.1.2`: `Why should a magnesium ribbon be cleaned before burning in air?`
2. After `1.2.2`: `A solution of a substance 'X' is used for whitewashing.`
3. After `1.2.5` and before parent `1.3`: the iron-nail/copper-sulphate colour question, followed by the double-displacement and oxidation/reduction questions.

Do not type the remainder from memory. Copy and verify it against the PDF at 200% zoom.

---

## Files And Responsibilities

### Source And Standards

- `textbooks/science/extracted/jesc101.pdf`: sole textbook truth for this remediation.
- `AGENTS.md`: stable repository rules.
- `NOTES_GUIDELINES_STANDARDS.md`: mandatory content, numbering, activity, figure, Q&A, typography, and teaching rules.
- `docs/content-style-qa-checklist.md`: final student-facing content quality gate.
- `docs/project-memory.md`: update only with durable decisions after verification.

### Chapter Content

- `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/05-oxidation-and-reduction.md`
- Create `apps/web/content/chemical-reactions-and-equations/lessons/06-ncert-exercises-and-revision.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- Create `docs/content/class-10/science/chemical-reactions-and-equations/source-fidelity-tracker.md`
- Create `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md`

### Catalog, Routes, And Rendering

- `apps/web/lib/course-content.ts`: lesson titles, timing, summary, progress default, and sixth lesson entry.
- `apps/web/app/chapters/[slug]/page.tsx`: canonical lesson path and honest mastery fallback.
- `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`: practice anchor, Q&A grouping, video placeholder placement, and lesson navigation.
- `apps/web/app/chapters/[slug]/quiz/page.tsx`: quiz loading boundary if history blocks question rendering.
- `apps/web/components/QuizScoreForm.tsx`: accessible review and weak-topic links.
- `apps/web/app/globals.css`: scoped lesson, Q&A, activity, navigation, focus, typography, and responsive styles.

### Activity Figures

- `apps/web/components/ActivityIllustration.tsx`: activity/figure metadata, responsive image rendering, captions, alt text, and legend.
- `apps/web/components/LessonDemo.tsx`: activity and balancing-workbench routing only.
- `apps/web/public/activity-illustrations/`: source-faithful responsive Chapter 1 assets.

### Tests And Generated Output

- Create `apps/web/lib/chemical-reactions-content-fidelity.test.ts`.
- Modify `apps/web/lib/course-content.test.ts` only for catalog/loader/navigation contracts.
- Modify `apps/web/lib/activity-illustration.test.ts` for exact figure metadata and asset budgets.
- Modify `apps/web/lib/pilot-quiz-content.test.ts` for representative quiz quality.
- Add focused helper/component tests introduced by Tasks 11 and 12.
- Regenerate `apps/web/lib/chapter-packs.generated.ts`; never hand-edit it.

---

## Task 0: Protect The Dirty Worktree And Reopen The Truthful Backlog

**Priority:** P0

**Files:**

- Inspect: all files listed above
- Modify: `master_todo.md` only to reopen the falsely completed Chapter 1 pilot-quality item

- [ ] **Step 1: Record the exact starting state**

Run:

```powershell
git status --short
git diff -- apps/web/content/chemical-reactions-and-equations apps/web/components/ActivityIllustration.tsx apps/web/components/LessonDemo.tsx apps/web/app/chapters apps/web/app/globals.css apps/web/lib/course-content.ts apps/web/lib/course-content.test.ts apps/web/lib/pilot-quiz-content.test.ts docs/content/class-10/science/chemical-reactions-and-equations
git ls-files --others --exclude-standard -- apps/web/content/chemical-reactions-and-equations apps/web/components apps/web/public/activity-illustrations docs/content/class-10/science/chemical-reactions-and-equations
```

Do not run `git reset`, `git checkout --`, `git clean`, or broad file deletion.

- [ ] **Step 2: Read the mandatory sources in this order**

1. `AGENTS.md`
2. `NOTES_GUIDELINES_STANDARDS.md`
3. `docs/project-memory.md`
4. `docs/content-style-qa-checklist.md`
5. `graphify-out/GRAPH_REPORT.md`
6. `textbooks/science/extracted/jesc101.pdf`

- [ ] **Step 3: Establish baseline verification**

Run and record the result without treating it as proof of content quality:

```powershell
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
```

- [ ] **Step 4: Reopen the stale backlog claim**

Change the `master_todo.md` item `Complete Chemical Reactions and Equations to full pilot quality` from checked to unchecked. Add a short note pointing to this `TODO.md` plan and state that the July 14 source/UX audit found release blockers.

**Acceptance:** The pre-existing dirty state is documented, no unrelated file has changed, and the backlog no longer claims Chapter 1 is pilot-ready.

---

## Task 1: Create The Source-Fidelity Tracker And RED Tests

**Priority:** P0

**Files:**

- Create: `docs/content/class-10/science/chemical-reactions-and-equations/source-fidelity-tracker.md`
- Create: `apps/web/lib/chemical-reactions-content-fidelity.test.ts`
- Modify: `apps/web/lib/activity-illustration.test.ts`
- Modify later, not in this first RED step: `apps/web/lib/course-content.test.ts`

- [ ] **Step 1: Build a complete tracker from the PDF**

The tracker must contain one row for each of the following, with columns for PDF page, exact source label, destination lesson, platform marker/caption, required safety/apparatus cue, automated test, manual evidence, and status:

- all numbered sections from `1.1` through `1.3.2`
- Activities 1.1-1.11
- Figures 1.1-1.10
- equation labels `(1.1)`-`(1.32)`
- all three in-text Questions blocks
- the free-standing source prompts after the combination example, silver-bromide example, Activity 1.9, and Activity 1.11
- the whitewashing box
- the unnumbered endothermic activity
- both Recall boxes
- What you have learnt
- Exercises 1-20
- Group Activity

Start every status as `Fail` or `Missing`; do not pre-mark from assumptions.

- [ ] **Step 2: Add heading-aware source-contract helpers**

The new test should read the six final lesson files as UTF-8 and parse markdown headings by level. Do not rely on a raw whole-chapter `indexOf` when a phrase can appear in frontmatter, a recap, or an answer.

Add helpers with these responsibilities:

```ts
readLessonOrEmpty(fileName: string): string
extractHeadings(markdown: string): Array<{ level: number; text: string; index: number }>
findHeading(markdown: string, level: number, exactText: string): number
collectRange(markdown: string, startHeading: string, nextHeading?: string): string
normalizeSourceText(value: string): string
```

Add one file-existence subtest per expected lesson. `readLessonOrEmpty` must return an empty string when Lesson 6 does not exist yet so its missing-file failure does not prevent the tests for the five existing lessons from reporting their own defects.

- [ ] **Step 3: Add failing fidelity assertions**

The test must prove all of the following:

- parent headings occur before their child headings
- the visible order matches the Source-Of-Truth Map
- one primary `### Activity 1.1` through `### Activity 1.11` heading/demo marker exists for each activity in source order; references inside Recall boxes or questions do not count as duplicates
- Activity 1.12 and Activity 1.13 are absent
- Figure 1.1-1.10 labels and captions exist
- one primary equation-label occurrence for `(1.1)`-`(1.32)` exists in increasing order; examples that mention an earlier equation do not satisfy or invalidate the primary-label check
- each exact NCERT Questions block is after the correct section and before the next parent section
- `diffusion insufficient`, `criteria ... alive`, and other Life Processes text are absent
- all safety, whitewashing, endothermic, Recall, summary, exercise, and Group Activity requirements exist
- every frontmatter title equals its H1 and the matching catalog lesson title
- no student-facing text exposes `textbooks/`, `jesc101.pdf`, `teacher note`, or local source-path copy

- [ ] **Step 4: Add figure-contract failures**

Extend `activity-illustration.test.ts` so it checks exact activity/figure mappings, high-risk apparatus vocabulary, asset existence, aspect ratio, and maximum source byte size. Asset-existence checks alone are insufficient.

- [ ] **Step 5: Run the tests and confirm RED for the known defects**

```powershell
npm.cmd run test -w apps/web
```

Expected: failure for the wrong Life Processes Q&A, incorrect activity order, fake activities, missing figures/equation labels/questions/exercises, current title mismatch, and image budget. Stop if the failures are unrelated to these known defects.

**Acceptance:** The tests fail for the current incorrect state and would also fail if a future edit reintroduced any of the known trust defects.

---

## Task 2: Restore Lesson 1 — Opening, Activities 1.1-1.3, 1.1, And 1.1.1

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`

- [ ] Replace the definition-only opening with the NCERT daily-life sequence: milk souring, rusting, fermentation of grapes, cooking, digestion, and respiration.
- [ ] Place Activities 1.1, 1.2, and 1.3 in exact order before the explanatory section that follows them in the source.
- [ ] Preserve the Activity 1.1 eye-protection/safety instruction and the correct magnesium-ribbon cleaning procedure.
- [ ] Preserve Activity 1.3's exact acid-handling caution: handle the acid carefully; the source permits dilute hydrochloric acid or dilute sulphuric acid, while Figure 1.2 depicts dilute sulphuric acid. Do not add teacher-supervision wording as if it were NCERT text.
- [ ] Add Figure 1.1 and Figure 1.2 markers/captions at their source positions.
- [ ] Teach observable evidence only after the source activities establish it.
- [ ] Add exact `1.1 Chemical Equations` and `1.1.1 Writing a Chemical Equation` headings.
- [ ] Teach word equations, reactants/products, formula equations, skeletal equations, and the relevant source equations `(1.1)`-`(1.2)`.
- [ ] Remove state symbols from this lesson; NCERT introduces them after balancing in `1.1.2`.
- [ ] Remove Activity 1.4; it belongs in Lesson 3.
- [ ] Delete the entire Life Processes Questions and answers block.
- [ ] Replace `animated activity below` with source-accurate `illustration below` or `activity sequence below`.
- [ ] Keep platform additions in this order after the associated concept: simple explanation, one textbook-derived worked example, one unseen platform practice item, answer check, common mistake, board tip, one-minute revision, comic recap.
- [ ] Update `estimated_minutes` and the catalog time later based on a realistic read + activity + practice walkthrough; do not leave the current 10-minute claim by default.

**Acceptance:** A student encounters the source hook, Activities 1.1-1.3, Figures 1.1-1.2, `1.1`, and `1.1.1` in order; there is no Life Processes text, premature state-symbol lesson, or false animation copy.

---

## Task 3: Restore Lesson 2 — 1.1.2 Balanced Chemical Equations

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`

- [ ] Use the exact visible heading `1.1.2 Balanced Chemical Equations`; remove `1.1 continued`.
- [ ] Explain conservation of mass patiently before introducing the procedure.
- [ ] Preserve the coefficient-versus-subscript explanation already working well.
- [ ] Rebuild the iron-and-steam hit-and-trial example using NCERT Steps I-VII, the atom-count tables, and equations `(1.3)` onward.
- [ ] Move physical-state symbols and reaction conditions into their correct NCERT position after balancing.
- [ ] Preserve equations `(1.3)`-`(1.12)` with correct formulae, coefficients, state symbols, arrows, and conditions.
- [ ] Place the exact first NCERT Questions block at the end of `1.1.2`, before Lesson 3 begins parent `1.2`.
- [ ] Author each exact question and simplified answer using the mandatory repository Q&A markup. Keep it readable in the existing fallback renderer; Task 11 adds progressive reveal later.
- [ ] Remove the empty `Solved examples` heading.
- [ ] Replace immediately repeated examples with at least three unseen balancing attempts of increasing difficulty.
- [ ] Define a prerequisite-rescue box for formula reading, coefficient, subscript, and atom counting.
- [ ] Do not add a full generic chemistry parser or the interactive workbench yet; that belongs to Task 12.

**Acceptance:** A low-confidence student can follow one complete NCERT balancing example step by step, understands why subscripts stay locked, and attempts unseen equations before seeing answers.

---

## Task 4: Restore Lesson 3 — Parent 1.2, Combination, And Decomposition

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`

- [ ] Begin with the parent heading `1.2 Types of Chemical Reactions` before any child subsection.
- [ ] Use exact child headings `1.2.1 Combination Reaction` and `1.2.2 Decomposition Reaction`.
- [ ] Place Activity 1.4 and Figure 1.3 under combination reactions.
- [ ] Preserve the quicklime/water reaction, whitewashing explanation/box, coal burning, natural-gas combustion including equation `(1.17)`, hydrogen/oxygen, respiration, and compost examples in source order.
- [ ] Explain exothermic reactions only through the source examples before adding a memory aid.
- [ ] Place Activities 1.5-1.8 and Figures 1.4-1.7 under decomposition reactions.
- [ ] Preserve decomposition caused by heat, electricity, and light, including silver bromide/photography and the source endothermic activity. If `electrolytic` or `photolytic` is taught as a memory term, label it as platform terminology rather than an NCERT subsection name.
- [ ] Preserve the safe smell-wafting instruction associated with Figure 1.4.
- [ ] Preserve Activity 1.7's 6 V battery, acidified water, unequal gas volumes, and teacher-only burning-candle gas test.
- [ ] Preserve the correct source equations and labels between `(1.13)` and `(1.23)`.
- [ ] Place the exact second NCERT Questions block immediately after `1.2.2` using the mandatory repository Q&A markup; keep the static fallback readable until Task 11 adds reveal.
- [ ] Replace practice that repeats solved equations with unseen observation-to-type and equation-to-type prompts.
- [ ] Keep multi-label truth explicit: a reaction may be both combination and exothermic, or decomposition and endothermic.

**Acceptance:** Parent/child numbering is exact, Activities 1.4-1.8 and Figures 1.3-1.7 are faithful, both energy ideas are understandable, and the second Questions block is exact and correctly placed.

---

## Task 5: Restore Lesson 4 — 1.2.3 And 1.2.4

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`

- [ ] Use exact visible headings `1.2.3 Displacement Reaction` and `1.2.4 Double Displacement Reaction`.
- [ ] Place Activity 1.9 and Figure 1.8(a)-(b) under displacement.
- [ ] Preserve the iron/copper-sulphate observation sequence and the zinc/lead displacement examples.
- [ ] Add a small clearly labelled `Prerequisite rescue` for `more reactive`, `ion`, and `aqueous solution`; do not pretend the aid is an NCERT subsection.
- [ ] Do not require memorising an unexplained full reactivity series to understand the first example.
- [ ] Place Activity 1.10 and Figure 1.9 under double displacement.
- [ ] Show the mixing of the two solutions, not only the final precipitate.
- [ ] Explain precipitation and ion exchange in plain language without implying every double-displacement reaction must precipitate.
- [ ] Preserve equations `(1.24)`-`(1.27)` with states.
- [ ] Restore the Recall Activity 1.2 prompt in the correct source position.
- [ ] Replace repeated solved-equation practice with unseen displacement-versus-double-displacement decisions and one observation question.

**Acceptance:** The student understands who replaces whom, sees the before/after evidence, distinguishes the two reaction types, and does not need unexplained prior ion knowledge.

---

## Task 6: Restore Lesson 5 — 1.2.5, 1.3, Corrosion, And Rancidity

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/05-oxidation-and-reduction.md`

- [ ] Use exact heading `1.2.5 Oxidation and Reduction`.
- [ ] Place Activity 1.11 and Figure 1.10 with the correct copper-powder setup, wire gauze/tripod, observation, and equation.
- [ ] Teach oxidation/reduction through both oxygen and hydrogen definitions used by the source.
- [ ] Preserve zinc oxide and manganese dioxide examples and equations `(1.28)`-`(1.32)`.
- [ ] Restore Recall Activity 1.1 in the source position.
- [ ] Place the exact third NCERT Questions block after `1.2.5`/Recall Activity 1.1 and before parent `1.3`, using the mandatory repository Q&A markup; keep the static fallback readable until Task 11 adds reveal.
- [ ] Add the exact parent heading `1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?`.
- [ ] Add exact child headings `1.3.1 Corrosion` and `1.3.2 Rancidity`.
- [ ] Cover iron rusting, black silver, green copper, antioxidants, airtight storage, and nitrogen-flushed packets from the source. If refrigeration is mentioned, label it as a platform extension rather than NCERT wording.
- [ ] Add the exact `What you have learnt` content after `1.3.2`, where the textbook teaching sequence ends.
- [ ] Delete invented Activities 1.12 and 1.13 and any tracker that implies they exist.
- [ ] Add an accurate misconception recap: oxidation and reduction occur together in redox; oxygen addition is not the only usable clue in the taught examples.

**Acceptance:** The chapter ends its numbered teaching content exactly at `1.3.2`, the third Questions block is correct, and there are no fake activities or missing everyday oxidation effects.

---

## Task 7: Add The Unnumbered NCERT Exercises And Revision Lesson

**Priority:** P0

**Files:**

- Create: `apps/web/content/chemical-reactions-and-equations/lessons/06-ncert-exercises-and-revision.md`
- Modify later in Task 9: `apps/web/lib/course-content.ts`

- [ ] Use the H1/frontmatter title `NCERT Chapter Exercises and Revision`. Do not prefix it with `1.4`, `1.3.3`, or another invented section number.
- [ ] Copy Exercises 1-20 exactly from PDF pages 14-16.
- [ ] Author every question/answer using the mandatory repository Q&A markup. Task 11 adds try-first reveal without changing the exact question wording.
- [ ] Provide simplified scoring answers that include required keywords, balanced equations, state symbols, observations, and classifications.
- [ ] Separate `Exact NCERT question` from `Platform answer` visually and semantically.
- [ ] Include the exact Group Activity and mark teacher-supervised/safety requirements clearly.
- [ ] Add a short `Before you submit` exercise checklist and targeted links back to the five conceptual lessons. Do not duplicate Lesson 5's exact `What you have learnt` or the chapter pack's one-page revision summary.
- [ ] Map each exercise answer back to one of the five conceptual lesson slugs for revision; do not create a sixth quiz weak-topic category.
- [ ] Keep recap and platform memory aids after the exact exercises, not interleaved in a way that changes textbook order.

**Acceptance:** All 20 open-ended exercises and the Group Activity are available without overloading Lesson 5 or pretending the objective quiz replaces textbook exercise practice.

---

## Task 8: Repair Figure Fidelity And Static-Image Performance

**Priority:** P0

**Files:**

- `apps/web/components/ActivityIllustration.tsx`
- `apps/web/components/LessonDemo.tsx`
- `apps/web/public/activity-illustrations/`
- `apps/web/lib/activity-illustration.test.ts`
- relevant Chapter 1 lesson markers

### Task 8A: Lock Source-Correct Figure Rendering

- [ ] Extend the shared illustration metadata with a discriminated union so figure-only entries in other chapters, such as Figure 6.6, do not need a fake activity number:

```ts
type ActivityEntry = {
  kind: 'activity';
  activityNumber: string;
  figureNumber?: string;
  figureCaption?: string;
  title: string;
  alt: string;
  observation: string;
  labels: string[];
  src: string;
  width: number;
  height: number;
};

type FigureOnlyEntry = Omit<ActivityEntry, 'kind' | 'activityNumber'> & {
  kind: 'figure';
  activityNumber?: never;
  figureNumber: string;
};

type ActivityIllustrationEntry = ActivityEntry | FigureOnlyEntry;
```

- [ ] Lock these mappings:

| Activity | Figure |
| --- | --- |
| 1.1 | Figure 1.1 |
| 1.2 | No numbered figure |
| 1.3 | Figure 1.2 |
| 1.4 | Figure 1.3 |
| 1.5 | Figure 1.4 |
| 1.6 | Figure 1.5 |
| 1.7 | Figure 1.6 |
| 1.8 | Figure 1.7 |
| 1.9 | Figure 1.8 |
| 1.10 | Figure 1.9 |
| 1.11 | Figure 1.10 |

- [ ] Split any combined Activities 1.7-1.10 collage into independent figures so each marker has one source-faithful visual.
- [ ] Audit every apparatus label at 200% PDF zoom. Specifically preserve Figure 1.4's safe smell-wafting cue, Figure 1.8's before/after comparison, Figure 1.9's two-solution pour, and Figure 1.10's wire gauze/tripod.
- [ ] Treat thermometers, steam, droppers, or other Gemini-only additions as optional `Platform observation aid` overlays. They must not replace or silently alter the NCERT figure.
- [ ] Replace CSS `background-image` rendering with responsive `next/image` or semantic `<img>` output that retains intrinsic dimensions, alt text, native lazy loading, and an uncropped 16:9 frame.
- [ ] Keep a readable text legend first. Anchored hotspots are deferred until after the basic source and accessibility contract passes.
- [ ] Pass Task 8A before changing image formats: exact figure number, caption, apparatus, safety cue, alt text, legend, and uncropped rendering are the source-correctness gate.

### Task 8B: Optimise Delivery After Source Correctness Passes

- [ ] Convert delivery assets to WebP/AVIF without deleting unrelated user-owned source files.
- [ ] Replace undefined `--accent` and `--surface` uses with defined design tokens.
- [ ] Add source-file byte/dimension assertions to the Node figure test. Do not call those values delivered `next/image` transfer bytes; measure delivered variants against the built server in Task 13.

**Performance budgets:**

- each checked-in optimised source asset: at most 600 KiB
- each delivered mobile activity variant: at most 350 KiB when requested with `Accept: image/avif,image/webp,*/*`
- Lesson 1 activity-image transfer at 390px viewport: at most 1.5 MiB
- all Chapter 1 delivered activity assets combined: at most 4 MiB
- below-fold images: lazy-loaded
- no activity image cropped at 320, 375, 768, or 1024px
- no old canvas lab bundle restored

**Acceptance:** Task 8A can land independently once Figures 1.1-1.10 are source-faithful, responsive, accessible, and individually addressable. Task 8B then passes only when the same correct figures meet the declared asset budget; optimisation must not change apparatus or captions.

---

## Task 9: Synchronise Catalog, Chapter Pack, Canonical Path, And Mastery

**Priority:** P0

**Files:**

- `apps/web/lib/course-content.ts`
- `apps/web/lib/course-content.test.ts`
- `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- generated `apps/web/lib/chapter-packs.generated.ts`
- `apps/web/app/chapters/[slug]/page.tsx`
- `apps/web/lib/mastery.ts` only if a pure display helper belongs there
- `apps/web/lib/mastery-rewards.test.ts`

### Task 9A: Fix Mastery Truthfulness — Land With Gate A1

- [ ] For absent mastery data, render `0%` and `Not started`; calculate rewards from zero.
- [ ] Do not show `Skilled`, `Exam Ready`, or other earned-looking rewards to an anonymous or brand-new student.
- [ ] Add focused tests for anonymous, empty-history, and real-mastery payloads before changing catalog or chapter-pack presentation.
- [ ] Do not change API persistence or scoring unless a focused test proves the API payload itself is wrong; the known defect is the web fallback.

### Task 9B: Synchronise The Catalog, Canonical Path, And Revision Sheet — Gate A2

- [ ] Update the five conceptual catalog titles to match their frontmatter/H1 exactly.
- [ ] Add the sixth lesson:

```ts
{
  slug: 'ncert-exercises-and-revision',
  fileName: '06-ncert-exercises-and-revision.md',
  title: 'NCERT Chapter Exercises and Revision',
  type: 'Chapter practice',
  minutes: 35,
  free: false,
  preview: 'Attempt all 20 NCERT exercises, check scoring answers, and revise the full chapter.',
}
```

- [ ] Keep the chapter `topics` array limited to the exact three parent textbook sections. Do not turn the exercise resource into a fake textbook topic.
- [ ] Replace `progress: 56` with a neutral content/catalog value and stop using catalog progress as student mastery.
- [ ] Make the lesson sequence the clearly recommended first action on the chapter page.
- [ ] Demote the chapter pack to a secondary CTA labelled `One-page revision sheet`.
- [ ] Rename/rewrite the chapter pack accordingly. It should be a faithful concise revision sheet, not a competing second lesson path.
- [ ] Correct the doubled source path and remove internal teacher/alignment/local-filename copy from the student-rendered pack.
- [ ] Ensure the chapter pack uses exact section order and does not put balancing content under `1.2.1-1.2.2`.
- [ ] Regenerate the chapter pack:

```powershell
npm.cmd run content:generate -w apps/web
```

**Acceptance:** There is one obvious primary learning path, the revision sheet is secondary and accurate, six lesson resources load, and no user receives fabricated progress or rewards.

---

## Task 10: Rebuild The Chapter Quiz And Its Quality Contract

**Priority:** P0

**Files:**

- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- `apps/web/lib/pilot-quiz-content.test.ts`
- `apps/web/lib/quiz-content.test.ts` only if a parser regression is found
- `apps/web/app/chapters/[slug]/quiz/page.tsx`
- `apps/web/components/QuizScoreForm.tsx`

- [ ] Replace the five-question recognition quiz with exactly 15 questions, designed for a 12-15 minute first attempt. Do not add pagination in this remediation unless browser review proves the single-page form unusable.
- [ ] Use the five existing conceptual lesson slugs for `Topic:` metadata; do not use the exercise resource as a weak-topic slug.
- [ ] Include at least two questions for every conceptual lesson slug.
- [ ] Cover all of the following:
  - recognising the correct word/formula equation
  - selecting a correctly balanced equation without changed subscripts
  - state symbols and conditions
  - observation-to-inference
  - combination and decomposition
  - thermal/electrolytic/photolytic decomposition
  - displacement
  - double displacement and precipitation
  - exothermic/endothermic clues
  - oxidation/reduction pairs
  - corrosion
  - rancidity
  - one apparatus/figure-reading item
- [ ] Use this concrete difficulty distribution: 5 Easy, 7 Medium, and 3 Hard.
- [ ] Make at least 5 of 15 questions application to an unseen equation, observation, or scenario. Prefix those five `Source:` values with `Platform application -` followed by the precise NCERT concept anchor, so the quality test can count them without guessing from prose.
- [ ] Use four plausible options per objective item. Distractors should represent real misconceptions, not jokes or unrelated phrases.
- [ ] Distribute answer positions across 1-4; every position must occur, and no one position may exceed 40% of the quiz.
- [ ] Give every question explicit `Answer:`, `Explanation:`, `Topic:`, `Difficulty:`, and `Source:` metadata.
- [ ] Label adapted platform items honestly, for example `NCERT concept aligned`; do not call an invented item an exact NCERT exercise.
- [ ] Keep the current quiz schema for Gate A2. In each `Explanation:`, explain why the correct choice is right and name the main misconception behind the strongest distractor; do not introduce a per-option feedback schema in this task.
- [ ] Ensure quiz questions render even if attempt-history loading is delayed or fails; keep history in a separate Suspense boundary if currently blocking.
- [ ] Deep-link weak-topic recovery to the relevant conceptual lesson.
- [ ] Replace the hard-coded `[1, 1, 1, 1, 1]` test with assertions for:
  - minimum question count
  - topic coverage
  - difficulty coverage
  - answer-position distribution
  - source metadata
  - exactly 5 Easy, 7 Medium, and 3 Hard questions
  - at least five `Source: Platform application - ...` questions

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
```

**Acceptance:** A student cannot score highly by choosing one position, the quiz samples the whole chapter, weak-topic mapping remains valid, and validation reports zero errors/warnings.

### Gate A1 Exit Check — Trust Blockers

Land this slice before image optimisation or interaction polish when all are true:

- [ ] no cross-chapter or invented textbook content remains
- [ ] numbered teaching sections, Activities 1.1-1.11, equations `(1.1)`-`(1.32)`, and all three in-text Questions blocks are in source order
- [ ] Activity 1.12/1.13 and false animation claims are absent
- [ ] anonymous/new-student mastery is zero and rewards are not falsely unlocked
- [ ] the Gate A1 fidelity, mastery, and Q&A rendering tests pass

### Gate A2 Exit Check — Completeness, Assessment, And Delivery

Continue to Gate B only when all are true:

- [ ] Figures 1.1-1.10, 20 exercises, Group Activity, and all special/source prompts are tracked and present
- [ ] lessons are the canonical path and the revision sheet is secondary
- [ ] source-correct figures pass before their optimised variants are accepted
- [ ] quiz quality tests and validator pass
- [ ] the complete source-fidelity suite passes

---

## Task 11: Add Struggling-Student Q&A, Navigation, Typography, And Mobile UX

**Priority:** Task 11A is P0 and lands with Gate A1; Tasks 11B-11C are P1 and form Gate B

**Files:**

- Create: `apps/web/lib/lesson-question-answers.ts`
- Create: `apps/web/lib/lesson-question-answers.test.ts`
- Modify: `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`
- Modify: `apps/web/app/globals.css`
- Modify: all six Chapter 1 lesson files to use the final Q&A convention
- Modify: `apps/web/app/layout.tsx` only if implementing the approved Outfit font through existing Next.js capability

### Task 11A: Q&A Reveal And Practice Anchor

Execute this subtask before landing the exact Questions blocks authored in Tasks 3, 4, 6, and 7. The current lesson renderer does not interpret the mandated bold/italic markers, so Gate A1 is not complete until the source wording renders without literal markdown punctuation.

- [ ] Keep the mandatory `NOTES_GUIDELINES_STANDARDS.md` markup authored in Tasks 2-7. The supported form is:

```markdown
## Questions and answers

**❓ QUESTIONS**

**1. <exact NCERT wording>**

*Hint:* <optional platform hint>

*Answer:* <simplified scoring answer>
```

- [ ] Implement a pure parser that recognises `**❓ QUESTIONS**` or `**❓ IN-TEXT QUESTIONS**`, bold numbered questions, optional `*Hint:*`, and required `*Answer:*` paragraphs.
- [ ] Preserve the existing static/fallback rendering for other chapters or malformed legacy sections; do not make a Chapter 1 parser change silently hide content elsewhere.
- [ ] Render the question immediately and the answer inside native `<details>/<summary>` with copy such as `Try first, then reveal the answer`.
- [ ] Keep exact NCERT wording visible outside the collapsed answer.
- [ ] Add visible focus states and screen-reader labels. Do not communicate correctness or importance using colour alone.
- [ ] Change all practice links from `#practice-zone` to the real generated `#quick-practice` target.
- [ ] Add a regression test proving the practice link and heading ID match.

### Task 11B: Lesson Navigation And Mobile Flow

- [ ] Add a generated section table of contents for the numbered textbook headings only.
- [ ] Keep the desktop lesson sidebar sticky while the article scrolls.
- [ ] Add a mobile previous/next bottom bar with safe-area padding; it must not cover content.
- [ ] Keep ready videos prominent, but make `video coming next` a compact status so an unavailable video does not consume a full screen before the notes.
- [ ] In the no-video or video-unavailable state, make the first concept visible within one 390x844 viewport after the lesson title. A genuinely ready video may remain prominent above the notes.

### Task 11C: Reading Hierarchy, Chemistry Typography, And Timing

- [ ] Give `Common mistakes`, `Board tips`, `Quick practice`, `Answer check`, `Remember this`, and `One-minute revision` distinct but restrained card variants.
- [ ] Use Georgia for long-form lesson prose and the approved UI sans-serif/Outfit contract for navigation/cards. Scope the change and browser-check all pilot pages.
- [ ] Render chemical formulae with real subscripts, reaction arrows, state symbols, and readable conditions. Formula blocks may horizontally scroll at 320px but the page itself must not overflow.
- [ ] Update lesson time estimates from an actual read + activity + practice walkthrough rather than optimistic guesses.

**Accessibility/mobile acceptance:**

- interactive targets are at least 44x44px
- keyboard users can open/close every answer and use all lesson navigation
- screen readers encounter question before answer
- no horizontal page overflow at 320px
- illustration legend text is at least 14px
- mobile navigation remains available
- bottom navigation never overlaps the final feedback controls

**Acceptance:** The chapter behaves like a guided learning sequence rather than one long article, and a student can attempt before revealing answers on desktop or mobile.

---

## Task 12: Add The Chemical Equation Balancing Workbench MVP

**Priority:** Optional P2 — start only after Gates A1, A2, and B pass

**Files:**

- Create: `apps/web/lib/chemical-equation-balancing.ts`
- Create: `apps/web/lib/chemical-equation-balancing.test.ts`
- Create: `apps/web/components/ChemicalEquationBalancer.tsx`
- Modify: `apps/web/components/LessonDemo.tsx`
- Modify: `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- Modify: `apps/web/app/globals.css`

**Implementation rule:** Do not build a free-form chemistry formula parser in this task. Use a typed, reviewed dataset with explicit atom maps so correctness is testable and the MVP remains small.

- [ ] Define pure types/helpers similar to:

```ts
type Compound = {
  formula: string;
  atoms: Record<string, number>;
};

type BalanceEquation = {
  id: string;
  reactants: Compound[];
  products: Compound[];
  solution: number[];
  hints: [string, string, string];
};

countAtoms(compounds: Compound[], coefficients: number[]): Record<string, number>
isBalanced(equation: BalanceEquation, coefficients: number[]): boolean
isSmallestWholeNumberRatio(coefficients: number[]): boolean
```

- [ ] Use four NCERT-aligned equations from the chapter, increasing in difficulty. Include the iron/steam example and questions involving hydrogen/chlorine, barium chloride/aluminium sulphate, or sodium/water only after verifying exact formulae and products from the PDF.
- [ ] Keep formulae and subscripts read-only. Students may edit coefficients only.
- [ ] Show live per-element atom counts for reactants and products.
- [ ] Require the smallest whole-number coefficient ratio for completion.
- [ ] Provide three staged hints; do not reveal the complete answer in Hint 1.
- [ ] Include reset and next-equation controls.
- [ ] Make every coefficient input keyboard and screen-reader operable; do not require drag-and-drop.
- [ ] Respect `prefers-reduced-motion`; no canvas, 3D, or decorative continuous animation.
- [ ] Route only `[[demo:chemical-equation-balancer]]` through `LessonDemo` and place it after the manual balancing method, not before the student learns the rule.
- [ ] Test atom totals, balance detection, invalid/blank/zero coefficients, reducible ratios, exact solution ratios, reset, and demo routing.

**Acceptance:** A student can balance four reviewed equations using coefficients only, understand which element is mismatched, and complete the task entirely with a keyboard at 320px width.

---

## Task 13: Final Automated, Source, Browser, And Scripted Learner-Task Verification

**Priority:** Required before changing any status to pilot-ready

### Step 1: Regenerate And Run Automated Checks

- [ ] Run in this order:

```powershell
npm.cmd run content:generate -w apps/web
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
```

Expected:

- chapter-pack generation succeeds
- quiz validator reports `Errors: 0. Warnings: 0.`
- every web test passes, including the new fidelity, figure, mastery, Q&A, and quiz tests; balancing tests are additionally required only if optional Task 12 was implemented
- production build succeeds
- TypeScript lint succeeds

### Step 2: Complete The Source Tracker

- [ ] Re-open `jesc101.pdf` and verify every tracker row manually.
- [ ] Mark a row `Pass` only when its exact student route and evidence are recorded.
- [ ] Confirm all three Questions blocks word-for-word and in position.
- [ ] Confirm Activities 1.1-1.11 and Figures 1.1-1.10 visually, not only by marker existence.
- [ ] Confirm every exercise 1-20 and Group Activity.
- [ ] Confirm all platform additions are accurate and clearly distinguished from exact NCERT material.

### Step 3: Run Built-Server Browser QA

- [ ] Start the production build:

```powershell
npm.cmd run start -w apps/web
```

- [ ] Review these routes at 1440x900, 390x844, and 320px minimum width:

```text
/chapters/chemical-reactions-and-equations
/chapters/chemical-reactions-and-equations/notes
/chapters/chemical-reactions-and-equations/lessons/chemical-equations
/chapters/chemical-reactions-and-equations/lessons/balancing-equations
/chapters/chemical-reactions-and-equations/lessons/combination-and-decomposition-reactions
/chapters/chemical-reactions-and-equations/lessons/displacement-and-double-displacement-reactions
/chapters/chemical-reactions-and-equations/lessons/oxidation-and-reduction
/chapters/chemical-reactions-and-equations/lessons/ncert-exercises-and-revision
/chapters/chemical-reactions-and-equations/quiz
```

- [ ] Split access-state QA explicitly:
  - signed out: chapter overview, free Lesson 1, truthful `0% / Not started`, and correct login redirects for protected Lessons 2-6
  - authenticated fresh account: all six lessons, empty mastery/history, quiz load, quiz save, locked review, and immutable retry
  - history-failure simulation: block/fail only the attempt-history request and prove quiz questions still render
  - use a local seeded/test account or register through the UI; never put credentials in the plan, source, screenshots, or commit
  - if the required local API/session is unavailable, record browser QA as incomplete rather than pretending the signed-out route proves the authenticated flow
- [ ] Confirm `0% / Not started`, no false unlocked reward, and one clear primary path.
- [ ] In the no-video/video-unavailable state, confirm the first concept appears within one mobile viewport after the lesson title.
- [ ] Confirm every Practice link lands at `Quick practice`.
- [ ] Confirm all Q&A reveals, navigation, and quiz options work with keyboard only. If Task 12 was implemented, include the balancer controls.
- [ ] Manually verify Windows Narrator or NVDA reading order, 200% zoom/reflow, `prefers-reduced-motion`, and both light/dark themes. Node source tests cover parsers/state/dispatch only; they do not prove assistive-technology or keyboard behaviour.
- [ ] Confirm no apparatus is cropped, no caption is too small, no equation breaks the page, and there are no console errors.
- [ ] Measure mobile image transfer, LCP, and CLS with this reproducible protocol:
  - Chrome stable against `npm.cmd run start -w apps/web`
  - incognito profile, cache disabled, cold navigation
  - viewport 390x844, device-pixel ratio 1
  - Slow 4G profile: approximately 150 ms RTT, 1.6 Mbps download, 750 Kbps upload
  - 4x CPU slowdown
  - three runs per route; record the median
  - request image variants with `Accept: image/avif,image/webp,*/*`, verify the response content type, and sum cold-cache transferred bytes rather than checked-in source sizes
  - targets: median LCP below 2.5 seconds and median CLS below 0.1
  - use Chrome DevTools Performance/Lighthouse only if already available; do not add a runtime dependency

### Step 4: Run The Scripted Learner-Task Smoke

- [ ] Create and populate `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md` with four balancing prompts and eight reaction-classification prompts that do not appear in the lessons, quiz, exercise answers, or optional workbench.
- [ ] Include exact expected answers, partial-credit rules, a 15-minute time limit, a no-hint rule, and a fixed evidence/scoring sheet so two reviewers reach the same result.

Using that checked-in holdout set, run this reproducible content/interaction smoke without reopening the notes after the learning pass:

- [ ] identify reactants/products and two observable reaction signs
- [ ] balance at least 3 of 4 unseen equations
- [ ] classify at least 6 of 8 mixed unseen reactions
- [ ] explain why subscripts cannot be changed
- [ ] distinguish displacement from double displacement
- [ ] identify oxidised and reduced substances in one taught redox equation
- [ ] explain one corrosion example and two rancidity-prevention methods
- [ ] find and attempt an exact NCERT question without accidentally revealing its answer

If the smoke fails, record the exact concept/route and repair that narrow gap before declaring technical pilot readiness. This scripted check is not evidence that a real struggling student learned independently. Run actual target-student sessions after implementation before claiming student validation.

### Step 5: Repository Hygiene

- [ ] Run scoped whitespace verification first:

```powershell
git diff --check -- TODO.md master_todo.md apps/web/content/chemical-reactions-and-equations apps/web/components/ActivityIllustration.tsx apps/web/components/ChemicalEquationBalancer.tsx apps/web/components/LessonDemo.tsx apps/web/app/chapters apps/web/app/globals.css apps/web/app/layout.tsx apps/web/lib docs/content/class-10/science/chemical-reactions-and-equations docs/project-memory.md
```

- [ ] Inspect `git status --short` and ensure unrelated dirty files remain untouched.
- [ ] Run `graphify update .` because route/components/tests changed.
- [ ] Update `docs/project-memory.md` with only durable learnings: canonical lesson path, six-resource allocation, exact figure contract, mastery-zero rule, and final image budget.
- [ ] Check `master_todo.md` as complete only after Gates A1, A2, and B, the source tracker, browser QA, and learner-task smoke all pass.
- [ ] If a later authorised push succeeds, update `TODO.md` to the next handoff before ending that implementation session.

---

## Definition Of Technically Pilot-Ready

Chapter 1 is technically pilot-ready only when all of the following are true:

- [ ] Exact textbook structure appears in exact order from `1.1` through `1.3.2`.
- [ ] One primary heading/demo marker for each Activity 1.1-1.11 is present in source order; Activities 1.12/1.13 are absent.
- [ ] Figures 1.1-1.10 match the source and retain safety/apparatus cues.
- [ ] Equation numbers `(1.1)`-`(1.32)`, state symbols, and conditions are correct.
- [ ] All three in-text Questions blocks are exact and correctly positioned.
- [ ] All 20 exercises and the Group Activity are available with try-first simplified answers.
- [ ] No Life Processes text, internal teacher notes, local paths, or false animation claims remain.
- [ ] Lessons are the canonical path; the one-page revision sheet is secondary.
- [ ] Anonymous/new users show `0% / Not started` and no fabricated rewards.
- [ ] The quiz has exactly 15 representative questions with varied correct positions, the fixed difficulty distribution, and valid metadata.
- [ ] Practice links, Q&A reveals, navigation, figures, and quiz work on keyboard and mobile.
- [ ] Chapter 1 delivered activity assets stay within the declared budget.
- [ ] The source tracker, content-style checklist, tests, validator, build, lint, and browser QA all pass.
- [ ] The scripted learner-task smoke target is met.

Passing automated tests without the completed PDF tracker and browser evidence is not sufficient.

This definition means the chapter is safe to place in a small real-student pilot. It does not mean the chapter is student-validated; that requires sessions with the intended learner group and review of their feedback/behaviour.

### Optional Gate C Completion

If Task 12 is implemented, Gate C is complete only when:

- [ ] the balancing helper/component/routing tests pass
- [ ] all four workbench equations are source-reviewed and use smallest whole-number ratios
- [ ] the workbench is keyboard/screen-reader operable at 320px
- [ ] the workbench does not replace manual balancing instruction or contaminate the learner-task holdout set

---

## Out Of Scope

- Rewriting other Science chapters or their activity assets
- A full site-wide design-system rewrite
- Canvas, 3D, or virtual laboratory simulations
- A drag-and-drop reaction game or game world
- AI-generated tutoring, free-text grading, or chatbot help
- Video production, voiceover, captions, or Bunny uploads
- New database tables or API response shapes unless a verified existing API defect blocks the current UI
- Payments, subscriptions, entitlements, or access-policy changes
- Leaderboards, public ranks, coins, or competitive gamification
- Admin CMS work
- Native Android/iOS implementation
- Deleting unrelated generated, untracked, or user-owned files
- Broad Graphify cleanup unrelated to the required post-code update

---

## Suggested Reviewable Change Batches

These are staging boundaries, not authorisation to commit or push:

1. **Lock Chapter 1 fidelity contracts** — tracker plus RED tests.
2. **Restore exact Chapter 1 lesson content** — six lesson resources and exact Q&A/exercises.
3. **Repair Chapter 1 figures and chapter truthfulness** — static assets, catalog, revision sheet, mastery.
4. **Strengthen Chapter 1 assessment and learner UX** — quiz, Q&A reveal, navigation, mobile/accessibility.
5. **Add the equation balancing workbench** — isolated P2 component and tests.
6. **Refresh durable evidence** — project memory, Graphify, final tracker, screenshots, and backlog truth.

Stop after each batch if its acceptance gate fails. Do not hide failures by weakening the test or changing expected source wording.
