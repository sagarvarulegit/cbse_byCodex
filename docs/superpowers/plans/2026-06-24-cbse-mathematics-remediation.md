# CBSE Mathematics Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Mathematics Standard `041` board-preparation ready, then add Mathematics Basic `241` as a separate compatible assessment profile.

**Architecture:** Enrich the shared curriculum/question-bank foundation with Mathematics-specific profile rules, answer validation, chapter quotas, and reviewed file-backed question modules. Launch Standard first; Basic remains hidden until a separate paper profile and reviewed eligible bank pass.

**Tech Stack:** TypeScript, Node test runner, curriculum registry, structured question bank, deterministic paper assembler.

## Global Constraints

- Plans 1 and 2 must pass.
- Active curriculum: `2026-27`.
- Use the current official Mathematics curriculum URL registered in Plan 1.
- The latest `2025-26` sample-paper section pattern may be stored as provisional historical evidence only.
- Do not expose a `2026-27` full-paper claim until the current sample-paper blueprint is verified.
- Keep Standard `041` and Basic `241` separate.
- No calculator-dependent questions.
- Every final numerical answer must include required units.
- Every proof rubric must mark assumptions, reasoning, and conclusion separately.
- Do not copy full official questions verbatim.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/subjects/mathematics.ts
apps/web/lib/question-bank/subjects/mathematics.test.ts
apps/web/content/question-bank/class-10/mathematics-standard/number-systems.ts
apps/web/content/question-bank/class-10/mathematics-standard/algebra.ts
apps/web/content/question-bank/class-10/mathematics-standard/coordinate-geometry.ts
apps/web/content/question-bank/class-10/mathematics-standard/geometry.ts
apps/web/content/question-bank/class-10/mathematics-standard/trigonometry.ts
apps/web/content/question-bank/class-10/mathematics-standard/mensuration.ts
apps/web/content/question-bank/class-10/mathematics-standard/statistics-probability.ts
apps/web/content/question-bank/class-10/mathematics-basic/eligibility.ts
apps/web/content/question-bank/class-10/mathematics-standard/bank.test.ts
docs/curriculum/subject-readiness/mathematics.md
```

**Modify:**

```text
apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts
apps/web/lib/curriculum/subjects/class-10/mathematics-basic.ts
apps/web/content/question-bank/class-10/mathematics-standard/index.ts
apps/web/content/question-bank/class-10/mathematics-basic/index.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/question-bank/paper-assembler.ts
apps/web/lib/question-bank/paper-assembler.test.ts
apps/web/lib/curriculum/coverage.test.ts
docs/project-memory.md
```

## Mathematics Interfaces

```ts
export type MathematicsAnswerMetadata = {
  acceptedFinalAnswers?: string[];
  acceptedMethods?: string[];
  requiredUnits?: string[];
  tolerance?: number;
  theoremNames?: string[];
};

export function validateMathematicsQuestion(
  question: BoardQuestion,
): QuestionValidationIssue[];

export function getMathematicsReadiness(
  subject: CurriculumSubject,
  questions: BoardQuestion[],
): MathematicsReadiness;
```

### Task 1: Lock the current Mathematics curriculum map

**Files:**
- Modify both Mathematics curriculum files
- Create: `docs/curriculum/subject-readiness/mathematics.md`

- [ ] **Step 1: Add failing curriculum assertions**

In the Mathematics test assert unit marks:

```ts
assert.deepEqual(
  subject.units.map((unit) => [unit.title, unit.marks]),
  [
    ['Number Systems', 6],
    ['Algebra', 20],
    ['Coordinate Geometry', 6],
    ['Geometry', 15],
    ['Trigonometry', 12],
    ['Mensuration', 10],
    ['Statistics and Probability', 11],
  ],
);
```

Assert all 14 platform chapter slugs occur exactly once:

```text
real-numbers
polynomials
pair-of-linear-equations-in-two-variables
quadratic-equations
arithmetic-progressions
triangles
coordinate-geometry
introduction-to-trigonometry
some-applications-of-trigonometry
circles
areas-related-to-circles
surface-areas-and-volumes
statistics
probability
```

- [ ] **Step 2: Run tests and confirm mapping failures**

```powershell
npm.cmd run test -w apps/web
```

- [ ] **Step 3: Complete topic-level mappings**

Each topic requires explicit question families. Examples:

```ts
{
  id: 'math-041.real-numbers.irrationality',
  minimumReviewedQuestionCount: 3,
  platformTopicSlugs: ['irrational-numbers'],
  requiredQuestionTypes: ['mcq', 'short-answer', 'proof'],
  scope: 'board-exam',
  title: 'Proofs of irrationality',
}
```

Use the official `2026-27` curriculum to remove stale platform claims such as Euclid division lemma if it is supporting knowledge rather than summative scope. Keep the lesson available, but map its scope truthfully.

- [ ] **Step 4: Document chapter readiness**

For each chapter, list:

- Official topics
- Existing chapter pack
- Existing lesson-wise content
- Existing quiz
- Missing required question families
- Required reviewed minimum

- [ ] **Step 5: Run tests and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/mathematics-*.ts docs/curriculum/subject-readiness/mathematics.md
git commit -m "Align Mathematics curriculum mapping"
```

### Task 2: Add Mathematics-specific validation

**Files:**
- Create: `apps/web/lib/question-bank/subjects/mathematics.ts`
- Create: `apps/web/lib/question-bank/subjects/mathematics.test.ts`
- Modify: `apps/web/lib/question-bank/validation.ts`
- Modify: `apps/web/lib/question-bank/types.ts`

- [ ] **Step 1: Write failing subject validation tests**

Test:

- Numerical question missing `requiredUnits`.
- Proof question without a conclusion rubric point.
- Construction question without a diagram asset.
- Question with tolerance below zero.
- Standard-only question incorrectly eligible for Basic.

Add:

```ts
subjectMetadata?: {
  mathematics?: MathematicsAnswerMetadata & {
    eligibleSubjectCodes: Array<'041' | '241'>;
  };
};
```

- [ ] **Step 2: Implement rules**

Rules:

- `numerical` requires accepted final answer or tolerance metadata.
- A question whose final answer has a physical unit requires `requiredUnits`.
- `proof` rubric descriptions must include an assumption/premise, reasoning, and conclusion.
- `construction` requires one diagram asset and at least one expected label.
- `eligibleSubjectCodes` must include the question's `subjectCode`.
- A `041` question is not automatically usable for `241`.

- [ ] **Step 3: Integrate with generic validation**

Call `validateMathematicsQuestion` for subject codes `041` and `241`.

- [ ] **Step 4: Verify**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/question-bank/subjects/mathematics.ts apps/web/lib/question-bank/subjects/mathematics.test.ts apps/web/lib/question-bank/validation.ts apps/web/lib/question-bank/types.ts
git commit -m "Validate Mathematics questions"
```

### Task 3: Define reviewed bank quotas

**Files:**
- Modify: `docs/curriculum/subject-readiness/mathematics.md`
- Create: `apps/web/content/question-bank/class-10/mathematics-standard/bank.test.ts`

- [ ] **Step 1: Encode the minimum bank**

Use this Standard minimum before full-paper readiness:

| Unit | 1 mark | 2 mark | 3 mark | 5 mark | 4-mark case | Type-specific extra |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Number Systems | 4 | 2 | 2 | 1 | 1 | 2 proofs |
| Algebra | 10 | 4 | 5 | 3 | 2 | 2 graphical/application |
| Coordinate Geometry | 3 | 2 | 2 | 1 | 1 | 1 graphical |
| Geometry | 7 | 3 | 4 | 3 | 2 | 3 proofs/constructions |
| Trigonometry | 6 | 3 | 3 | 2 | 2 | 2 height-distance |
| Mensuration | 5 | 2 | 3 | 2 | 2 | 1 combined-solid numerical |
| Statistics and Probability | 6 | 3 | 3 | 2 | 2 | 2 data-interpretation |

All counts are reviewed or published questions. One question may satisfy its mark/type cell and one type-specific count, but never two unit cells.

- [ ] **Step 2: Write quota tests**

Build `assertMathematicsBankMinimums(questions)` and assert the empty bank fails with a readable list such as:

```text
Number Systems: need 4 reviewed 1-mark questions, found 0.
```

- [ ] **Step 3: Run red test**

- [ ] **Step 4: Commit the test and documented quota**

```powershell
git add apps/web/content/question-bank/class-10/mathematics-standard/bank.test.ts docs/curriculum/subject-readiness/mathematics.md
git commit -m "Define Mathematics question quotas"
```

### Task 4: Author and review the Standard question bank unit by unit

**Files:**
- Create/modify the seven unit bank files
- Modify Standard index

- [ ] **Step 1: Author Number Systems and run its quota subset**

Every record must include:

- Stable ID
- Current curriculum ref
- Chapter/topic slug
- Marks/type/difficulty
- Platform-authored source
- Model answer
- Explanation
- Point rubric
- Common mistakes
- Reviewer/date
- Mathematics metadata

Use original questions. Include irrationality proofs and FTA applications.

- [ ] **Step 2: Commit Number Systems**

```powershell
git add apps/web/content/question-bank/class-10/mathematics-standard/number-systems.ts
git commit -m "Add Number Systems board questions"
```

- [ ] **Step 3: Repeat the red-green-review cycle for Algebra**

Include:

- Zeroes/coefficient relations
- Linear-equation consistency and graphical solution
- Quadratic factorisation/formula/nature of roots
- Arithmetic progression nth term, sum, and contextual problems

Commit:

```text
Add Algebra board questions
```

- [ ] **Step 4: Repeat for Coordinate Geometry**

Include distance, section, and area applications.

- [ ] **Step 5: Repeat for Geometry**

Include similarity, tangent theorems, proofs, and any current prescribed construction work.

- [ ] **Step 6: Repeat for Trigonometry**

Include ratios, identities, standard values, heights, and distances.

- [ ] **Step 7: Repeat for Mensuration**

Include sectors, segments, combined solids, surface area, and volume.

- [ ] **Step 8: Repeat for Statistics and Probability**

Include grouped data, median/mode/mean, cumulative interpretation where current, and classical probability.

- [ ] **Step 9: Run the whole bank test**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

Expected: every unit quota passes and all records validate.

### Task 5: Add the provisional Standard paper profile and three-seed proof

**Files:**
- Modify Mathematics Standard curriculum
- Modify assembler tests
- Modify mathematics bank test

- [ ] **Step 1: Add profile status**

Extend `ExamProfile`:

```ts
blueprintStatus: 'current' | 'provisional-historical' | 'blocked';
```

Until the `2026-27` SQP is verified, set Standard to `provisional-historical` and cite the latest sample-paper source.

- [ ] **Step 2: Encode the historical section pattern**

Use only for internal validation:

```text
Section A: 20 x 1
Section B: 5 x 2
Section C: 6 x 3
Section D: 4 x 5
Section E: 3 x 4 case studies
Total: 80
```

- [ ] **Step 3: Write three-seed tests**

Generate seeds:

```text
math-standard-review-1
math-standard-review-2
math-standard-review-3
```

Assert exact marks, no duplicate IDs within a paper, and at least one differing question ID across seeds.

- [ ] **Step 4: Verify**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts apps/web/lib/question-bank/paper-assembler.test.ts apps/web/content/question-bank/class-10/mathematics-standard
git commit -m "Generate Mathematics Standard review papers"
```

### Task 6: Add Mathematics Basic eligibility and activation gate

**Files:**
- Modify Basic curriculum
- Create: `apps/web/content/question-bank/class-10/mathematics-basic/eligibility.ts`
- Modify Mathematics tests

- [ ] **Step 1: Write separation tests**

Assert:

- Basic has code `241`.
- Standard-only proof questions are excluded unless explicitly eligible.
- A Basic paper never includes a question missing `241` in `eligibleSubjectCodes`.
- Basic remains hidden while blueprint status is blocked/provisional and quota is incomplete.

- [ ] **Step 2: Implement explicit reuse**

`eligibility.ts` exports only reviewed Standard question IDs approved for Basic:

```ts
export const MATHEMATICS_BASIC_REUSED_QUESTION_IDS: string[] = [];
```

Populate through subject review; do not infer by difficulty.

- [ ] **Step 3: Add Basic-specific questions**

Author enough Basic records to satisfy its verified current profile after the profile becomes available. Until then, tests assert it remains inactive and coverage reports list the exact blocker.

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/mathematics-basic.ts apps/web/content/question-bank/class-10/mathematics-basic apps/web/lib/question-bank/subjects/mathematics.test.ts
git commit -m "Separate Mathematics Basic assessment"
```

### Task 7: Final subject verification and documentation

- [ ] **Step 1: Run all checks**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
```

- [ ] **Step 2: Manually review one generated Standard paper**

Record in `docs/curriculum/subject-readiness/mathematics.md`:

- Seed
- Marks by section
- Unit distribution
- Question-type distribution
- Errors found and corrected
- Reviewer/date
- Blueprint status

- [ ] **Step 3: Update project memory**

Record Standard/Basic separation and provisional-blueprint gate.

- [ ] **Step 4: Commit**

```powershell
git add docs/curriculum/subject-readiness/mathematics.md docs/project-memory.md graphify-out
git commit -m "Verify Mathematics board readiness"
```

## Acceptance Criteria

- All 14 chapter mappings match current curriculum scope.
- Unit weights total 80.
- Mathematics validation passes.
- Standard bank meets exact quotas.
- Three seeded Standard review papers generate.
- Blueprint status is honest.
- Basic is separate and not inferred from difficulty.
- Existing Mathematics chapter packs and quizzes still work.
- Tests, lint, and build pass.
