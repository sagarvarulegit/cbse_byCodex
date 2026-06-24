# CBSE Question Bank and Assessment Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a validated file-backed board-question bank, deterministic paper assembler, objective scorer, and descriptive self-assessment primitives without breaking existing chapter quizzes.

**Architecture:** Store small TypeScript question modules under subject folders, load them through a stable query interface, validate against the curriculum registry, and assemble immutable generated-paper snapshots by seed. Keep persistence and student routes out of this foundation plan.

**Tech Stack:** TypeScript, Node test runner with `tsx`, existing curriculum registry, no new runtime dependency.

## Global Constraints

- Plan 1 must be complete.
- No Prisma migration in this plan.
- No student-facing routes in this plan.
- No AI grading.
- Do not delete or rewrite existing markdown quizzes.
- Do not disable the legacy option-1 fallback yet.
- Only `reviewed` and `published` questions may satisfy readiness minimums.
- Complete official papers must not be copied into the question bank.
- Use accessible asset metadata.
- Use deterministic stable IDs and deterministic ordering.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/types.ts
apps/web/lib/question-bank/types.test.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/question-bank/validation.test.ts
apps/web/lib/question-bank/loader.ts
apps/web/lib/question-bank/loader.test.ts
apps/web/lib/question-bank/coverage.ts
apps/web/lib/question-bank/coverage.test.ts
apps/web/lib/question-bank/paper-assembler.ts
apps/web/lib/question-bank/paper-assembler.test.ts
apps/web/lib/question-bank/scoring.ts
apps/web/lib/question-bank/scoring.test.ts
apps/web/lib/question-bank/self-assessment.ts
apps/web/lib/question-bank/self-assessment.test.ts
apps/web/lib/question-bank/fixtures/valid-questions.ts
apps/web/content/question-bank/class-10/index.ts
apps/web/content/question-bank/class-10/mathematics-standard/index.ts
apps/web/content/question-bank/class-10/mathematics-basic/index.ts
apps/web/content/question-bank/class-10/science/index.ts
apps/web/content/question-bank/class-10/social-science/index.ts
apps/web/content/question-bank/class-10/english-language-literature/index.ts
apps/web/content/question-bank/class-10/hindi-course-b/index.ts
apps/web/content/question-bank/class-10/optional/index.ts
docs/curriculum/question-authoring-guide.md
```

**Modify:**

```text
apps/web/lib/curriculum/coverage.ts
apps/web/lib/curriculum/coverage.test.ts
docs/project-memory.md
```

## Interfaces Produced

```ts
export async function loadQuestionBank(query: QuestionBankQuery): Promise<BoardQuestion[]>;
export function validateBoardQuestion(
  question: BoardQuestion,
  context: QuestionValidationContext,
): QuestionValidationIssue[];
export function buildQuestionCoverage(
  subject: CurriculumSubject,
  questions: BoardQuestion[],
): QuestionCoverageEvidence;
export function assemblePaper(input: AssemblePaperInput): GeneratedPaper;
export function scoreObjectiveResponses(
  paper: GeneratedPaper,
  responses: BoardResponse[],
): ObjectiveScoreResult;
export function buildSelfAssessment(
  question: GeneratedQuestionSnapshot,
  selectedRubricPointIds: string[],
): DescriptiveSelfAssessment;
```

### Task 1: Define normalized question and generated-paper types

**Files:**
- Create: `apps/web/lib/question-bank/types.ts`
- Create: `apps/web/lib/question-bank/types.test.ts`

**Interfaces:**
- Consumes: `BoardQuestionType` from curriculum types
- Produces: all question-bank public types

- [ ] **Step 1: Write the failing type fixture**

Create a valid 3-mark descriptive question:

```ts
const question: BoardQuestion = {
  academicSession: '2026-27',
  assets: [],
  chapterSlugs: ['real-numbers'],
  classLevel: 10,
  difficulty: 'standard',
  explanation: 'The proof assumes rationality and reaches a contradiction.',
  id: '041-real-numbers-irrationality-proof-001',
  marks: 3,
  modelAnswer: 'Assume √2 = p/q in lowest form and derive that p and q are both even.',
  prompt: 'Prove that √2 is irrational.',
  questionType: 'proof',
  reviewer: 'subject-reviewer',
  reviewedOn: '2026-06-24',
  rubric: {
    commonMistakes: ['Not stating that p/q is in lowest form.'],
    points: [
      { description: 'Assumes √2 = p/q in lowest form.', id: 'assumption', marks: 1 },
      { description: 'Shows p and q are both even.', id: 'contradiction', marks: 1 },
      { description: 'States the contradiction and conclusion.', id: 'conclusion', marks: 1 },
    ],
  },
  source: { authoringVersion: '1', kind: 'platform-authored' },
  status: 'reviewed',
  subjectCode: '041',
  topicSlugs: ['irrational-numbers'],
  curriculumRefs: ['math-041.real-numbers.irrationality'],
};
```

Assert the rubric totals 3 using a helper named `sumRubricMarks`.

- [ ] **Step 2: Run tests**

Expected: FAIL because question-bank types do not exist.

- [ ] **Step 3: Implement normalized types**

Use parent questions with embedded subquestions:

```ts
export type BoardSubquestion = {
  id: string;
  marks: 1 | 2 | 3 | 4 | 5 | 6;
  prompt: string;
  modelAnswer: string;
  explanation: string;
  rubric: MarkingRubric;
};
```

For container questions:

```ts
subquestions?: BoardSubquestion[];
stimulus?: string;
```

The parent `marks` must equal the sum of subquestions.

Add immutable snapshot types:

```ts
export type GeneratedQuestionSnapshot = Pick<
  BoardQuestion,
  'id' | 'marks' | 'prompt' | 'questionType' | 'options' | 'correctOptionIndex' |
  'modelAnswer' | 'explanation' | 'rubric' | 'assets' | 'subquestions'
>;
```

- [ ] **Step 4: Run tests and lint**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/question-bank/types.ts apps/web/lib/question-bank/types.test.ts
git commit -m "Add structured board question types"
```

### Task 2: Validate publication and subject rules

**Files:**
- Create: `apps/web/lib/question-bank/validation.ts`
- Create: `apps/web/lib/question-bank/validation.test.ts`

**Interfaces:**
- Consumes: question types, curriculum registry
- Produces: `QuestionValidationIssue`, `validateBoardQuestion`

- [ ] **Step 1: Write failing validation cases**

Require issue codes:

```ts
type QuestionValidationCode =
  | 'unknown-subject'
  | 'wrong-session'
  | 'invalid-curriculum-ref'
  | 'excluded-curriculum-ref'
  | 'invalid-mark-value'
  | 'missing-model-answer'
  | 'missing-explanation'
  | 'rubric-total-mismatch'
  | 'invalid-options'
  | 'invalid-correct-option'
  | 'missing-subquestions'
  | 'subquestion-total-mismatch'
  | 'missing-asset-alt-text'
  | 'missing-reviewer'
  | 'missing-official-source'
  | 'duplicate-question-id';
```

Test an MCQ with answer index `3` and only two options. Test a 5-mark question with a 4-mark rubric. Test a published official-derived question without source ID.

- [ ] **Step 2: Run tests**

Expected: FAIL because validation does not exist.

- [ ] **Step 3: Implement context-driven validation**

Use:

```ts
export type QuestionValidationContext = {
  allQuestionIds: string[];
  curriculumSubject: CurriculumSubject;
  validAssetPaths?: Set<string>;
  validMapLocationIds?: Set<string>;
};
```

Rules:

- Draft questions may omit reviewer metadata but still require mappings and answer content.
- Reviewed and published questions require reviewer and ISO review date.
- Every rubric point has `marks > 0`.
- Container types `case-study`, `source-based`, and `extract-based` require subquestions.
- `map-skill` requires at least one asset and a valid map-location ID in metadata added as `mapLocationIds?: string[]`.
- Official-derived sources require source ID, year, code, and derivation note.

- [ ] **Step 4: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/question-bank/validation.ts apps/web/lib/question-bank/validation.test.ts apps/web/lib/question-bank/types.ts
git commit -m "Validate board question publishing"
```

### Task 3: Add file-backed loaders with deterministic ordering

**Files:**
- Create subject index files under `apps/web/content/question-bank/class-10/`
- Create: `apps/web/lib/question-bank/loader.ts`
- Create: `apps/web/lib/question-bank/loader.test.ts`
- Create: `apps/web/lib/question-bank/fixtures/valid-questions.ts`

**Interfaces:**
- Consumes: arrays exported from subject index files
- Produces: `loadQuestionBank`

- [ ] **Step 1: Write loader tests**

Test filtering by:

- Academic session
- Subject code
- Chapter slug
- Topic slug
- Marks
- Question type
- Difficulty
- Status

Test stable ordering by question ID regardless of source-array order.

- [ ] **Step 2: Run tests**

Expected: FAIL because loader does not exist.

- [ ] **Step 3: Implement the root bank**

Each subject index exports:

```ts
export const mathematicsStandardQuestions: BoardQuestion[] = [];
```

The root index exports:

```ts
export const CLASS_10_QUESTION_BANK: BoardQuestion[] = [
  ...mathematicsStandardQuestions,
  ...mathematicsBasicQuestions,
  ...scienceQuestions,
  ...socialScienceQuestions,
  ...englishLanguageLiteratureQuestions,
  ...hindiCourseBQuestions,
];
```

`loadQuestionBank` may be async to preserve a future storage boundary, but it initially filters the imported readonly array.

- [ ] **Step 4: Add duplicate-ID startup validation**

Export:

```ts
export function validateQuestionBank(questions: BoardQuestion[]): QuestionValidationIssue[]
```

It validates duplicate IDs once and delegates per-question checks.

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add apps/web/content/question-bank apps/web/lib/question-bank/loader.ts apps/web/lib/question-bank/loader.test.ts apps/web/lib/question-bank/fixtures
git commit -m "Add file backed question loader"
```

### Task 4: Connect reviewed question counts to coverage

**Files:**
- Create: `apps/web/lib/question-bank/coverage.ts`
- Create: `apps/web/lib/question-bank/coverage.test.ts`
- Modify: `apps/web/lib/curriculum/coverage.ts`
- Modify: `apps/web/lib/curriculum/coverage.test.ts`

**Interfaces:**
- Consumes: curriculum subject and structured questions
- Produces: `QuestionCoverageEvidence`

- [ ] **Step 1: Write failing coverage tests**

Create a topic requiring:

```ts
requiredQuestionTypes: ['mcq', 'short-answer']
minimumReviewedQuestionCount: 2
```

Supply five draft MCQs and one reviewed short answer. Assert raw file count does not satisfy either minimum.

- [ ] **Step 2: Run tests**

- [ ] **Step 3: Implement capped reviewed counts**

Count statuses `reviewed` and `published`. Exclude `draft` and `retired`.

For each topic/type:

```ts
satisfied = reviewedCount >= minimumReviewedQuestionCount
```

For question-bank percentage, cap each pair at its minimum before summing.

- [ ] **Step 4: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/question-bank/coverage.ts apps/web/lib/question-bank/coverage.test.ts apps/web/lib/curriculum/coverage.ts apps/web/lib/curriculum/coverage.test.ts
git commit -m "Measure reviewed question coverage"
```

### Task 5: Implement deterministic paper assembly

**Files:**
- Create: `apps/web/lib/question-bank/paper-assembler.ts`
- Create: `apps/web/lib/question-bank/paper-assembler.test.ts`

**Interfaces:**
- Consumes: `CurriculumSubject`, valid questions, seed
- Produces: `assemblePaper`

- [ ] **Step 1: Write failing deterministic tests**

Use a fixture profile with:

- Section A: 4 marks, four 1-mark MCQs
- Section B: 6 marks, two 3-mark short answers

Assert:

```ts
assert.deepEqual(first.questionIds, second.questionIds);
assert.equal(first.maximumMarks, 10);
assert.equal(new Set(first.questionIds).size, first.questionIds.length);
```

Assert a missing 3-mark bank throws `PaperAssemblyError` with:

```text
Unable to satisfy section-b: need 2 short-answer question(s) worth 3 mark(s), found 1.
```

- [ ] **Step 2: Run tests**

- [ ] **Step 3: Implement a deterministic PRNG**

Implement a local string hash and `mulberry32`-style generator in the module. Do not add a dependency.

Selection order:

1. Filter eligible reviewed/published questions.
2. Sort by ID.
3. Shuffle with the seeded generator.
4. Select exact counts required by each `ExamQuestionRule`.

Extend `ExamSectionRule` to include:

```ts
questionRules: {
  count: number;
  marks: 1 | 2 | 3 | 4 | 5 | 6;
  questionTypes: BoardQuestionType[];
  curriculumRefs?: string[];
  internalChoiceCount?: number;
}[];
```

- [ ] **Step 4: Snapshot generated questions**

Generated papers must store question content snapshots, not only IDs. Include `bankVersion`, calculated from sorted `id:reviewedOn` pairs.

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add apps/web/lib/question-bank/paper-assembler.ts apps/web/lib/question-bank/paper-assembler.test.ts apps/web/lib/curriculum/types.ts
git commit -m "Add deterministic paper assembly"
```

### Task 6: Add objective scoring and descriptive self-assessment

**Files:**
- Create: `apps/web/lib/question-bank/scoring.ts`
- Create: `apps/web/lib/question-bank/scoring.test.ts`
- Create: `apps/web/lib/question-bank/self-assessment.ts`
- Create: `apps/web/lib/question-bank/self-assessment.test.ts`

**Interfaces:**
- Consumes: generated paper snapshots and responses
- Produces: objective score and self-assessment records

- [ ] **Step 1: Write objective scoring tests**

Test:

- Correct MCQ earns full marks.
- Incorrect MCQ earns zero.
- Missing response earns zero.
- Descriptive response earns zero automatic marks and appears in `unscoredQuestionIds`.
- Unknown question response is ignored and reported.

- [ ] **Step 2: Implement objective scoring**

Return:

```ts
type ObjectiveScoreResult = {
  awardedMarks: number;
  maximumObjectiveMarks: number;
  perQuestion: {
    awardedMarks: number;
    questionId: string;
    status: 'correct' | 'incorrect' | 'unanswered' | 'manual-review';
  }[];
  unknownResponseQuestionIds: string[];
  unscoredQuestionIds: string[];
};
```

- [ ] **Step 3: Write self-assessment tests**

For a 3-mark rubric, selecting two valid 1-mark points returns 2. Duplicate or unknown point IDs do not increase marks.

- [ ] **Step 4: Implement self-assessment**

Return:

```ts
type DescriptiveSelfAssessment = {
  awardedMarks: number;
  maximumMarks: number;
  questionId: string;
  selectedRubricPointIds: string[];
};
```

This is explicitly student self-report, not automatic grading.

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add apps/web/lib/question-bank/scoring.ts apps/web/lib/question-bank/scoring.test.ts apps/web/lib/question-bank/self-assessment.ts apps/web/lib/question-bank/self-assessment.test.ts
git commit -m "Add board response scoring primitives"
```

### Task 7: Document authoring and migration rules

**Files:**
- Create: `docs/curriculum/question-authoring-guide.md`
- Modify: `docs/project-memory.md`

- [ ] **Step 1: Document stable ID format**

Use:

```text
<subject-code>-<unit-or-domain>-<topic>-<question-type>-<three-digit-sequence>
```

Examples:

```text
041-real-numbers-irrationality-proof-001
086-chemistry-reaction-types-mcq-001
087-geography-water-resources-map-skill-001
184-reading-discursive-extract-based-001
085-grammar-samaas-grammar-001
```

- [ ] **Step 2: Document review checklist**

Require:

- Official curriculum mapping
- Original or lawfully derived wording
- Correct answer
- Student explanation
- Point rubric
- Common mistakes
- Asset alt text
- Reviewer and date
- Subject-specific checks

- [ ] **Step 3: Document legacy migration**

State:

- Existing markdown quizzes stay active.
- Converted questions begin as draft.
- Legacy fallback remains until explicit answers exist.
- No bulk publishing.
- Each subject plan owns its own migration batch.

- [ ] **Step 4: Add durable memory**

Record loader, validator, seeded assembler, snapshot, and no-AI-grading decisions.

- [ ] **Step 5: Final verification**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
graphify update .
git diff --check
git status --short
```

- [ ] **Step 6: Commit**

```powershell
git add docs/curriculum/question-authoring-guide.md docs/project-memory.md apps/web/lib/question-bank apps/web/content/question-bank graphify-out
git commit -m "Document board question authoring"
```

## Acceptance Criteria

- Structured question types and normalized subquestions exist.
- Publication validation rejects every required invalid state.
- File-backed loading is deterministic.
- Reviewed counts feed readiness.
- Seeded assembly is reproducible and fails loudly on deficits.
- Generated papers snapshot content.
- Objective scoring is exact.
- Descriptive answers receive no automatic marks.
- Self-assessment cannot mutate responses.
- Existing markdown quizzes remain unchanged and operational.
- Tests and lint pass.
