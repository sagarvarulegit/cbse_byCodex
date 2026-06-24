# CBSE Curriculum Source of Truth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace inferred syllabus coverage and hard-coded subject routing with a versioned, official-source-backed Class 10 curriculum registry and deterministic readiness audit.

**Architecture:** Add focused curriculum modules under `apps/web/lib/curriculum`, with subject definitions separated from validation and coverage calculation. Existing chapter-pack and lesson metadata remain evidence consumed by the coverage mapper; they do not become curriculum truth.

**Tech Stack:** TypeScript, Node test runner with `tsx`, Next.js 15, existing file-backed chapter content, official CBSE/NCERT source metadata.

## Global Constraints

- Active session: `2026-27`.
- Historical `2025-26` sample and 2026 actual papers are comparison evidence only.
- No new runtime dependency.
- No database migration.
- Do not change quiz scoring, mastery, missions, badges, pilot tracking, or authentication.
- Keep HPE visible but classified as `internal`.
- Keep AI and IT `future` and hidden.
- Use official URLs only in authoritative source records.
- Use `npm.cmd` in PowerShell.

---

## File Structure

**Create:**

```text
apps/web/lib/curriculum/types.ts
apps/web/lib/curriculum/official-sources.ts
apps/web/lib/curriculum/validation.ts
apps/web/lib/curriculum/registry.ts
apps/web/lib/curriculum/coverage.ts
apps/web/lib/curriculum/types.test.ts
apps/web/lib/curriculum/validation.test.ts
apps/web/lib/curriculum/registry.test.ts
apps/web/lib/curriculum/coverage.test.ts
apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts
apps/web/lib/curriculum/subjects/class-10/mathematics-basic.ts
apps/web/lib/curriculum/subjects/class-10/science.ts
apps/web/lib/curriculum/subjects/class-10/social-science.ts
apps/web/lib/curriculum/subjects/class-10/english-language-literature.ts
apps/web/lib/curriculum/subjects/class-10/hindi-course-b.ts
apps/web/lib/curriculum/subjects/class-10/health-and-physical-education.ts
apps/web/lib/curriculum/subjects/class-10/optional/artificial-intelligence.ts
apps/web/lib/curriculum/subjects/class-10/optional/information-technology.ts
apps/web/scripts/generate-chapter-packs.ts
apps/web/lib/chapter-pack-generation.ts
apps/web/lib/chapter-pack-generation.test.ts
docs/curriculum/official-source-register.md
docs/curriculum/annual-refresh-runbook.md
```

**Modify:**

```text
apps/web/lib/course-content.ts
apps/web/lib/course-content.test.ts
apps/web/package.json
apps/web/app/subjects/page.tsx
apps/web/app/subjects/[slug]/page.tsx
docs/project-memory.md
```

## Interfaces Produced

```ts
export function getActiveCurriculumSession(): string;
export function getCurriculumSubject(
  subjectSlug: string,
  academicSession?: string,
): CurriculumSubject | null;
export function getVisibleCurriculumSubjects(
  academicSession?: string,
): CurriculumSubject[];
export function resolveCurriculumSubjectSlug(routeSlug: string): string;
export function validateCurriculumSubject(
  subject: CurriculumSubject,
): CurriculumValidationIssue[];
export function buildSubjectCoverage(
  subject: CurriculumSubject,
  evidence: CoverageEvidence,
): SubjectCoverageReport;
```

### Task 1: Define stable curriculum types

**Files:**
- Create: `apps/web/lib/curriculum/types.ts`
- Create: `apps/web/lib/curriculum/types.test.ts`

**Interfaces:**
- Consumes: none
- Produces: `AssessmentMode`, `CurriculumStatus`, `CurriculumScope`, `OfficialSource`, `ExamProfile`, `CurriculumTopic`, `CurriculumChapter`, `CurriculumUnit`, `PrescribedBook`, `CurriculumSubject`, `BoardQuestionType`

- [ ] **Step 1: Write the failing type-shape test**

Create a runtime fixture in `types.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import type { CurriculumSubject } from './types';

test('CurriculumSubject supports a versioned active board subject', () => {
  const subject: CurriculumSubject = {
    academicSession: '2026-27',
    assessmentMode: 'board',
    books: [],
    classLevel: 10,
    examProfile: {
      allowedMarkValues: [1, 2, 3, 5],
      blueprintSourceIds: ['cbse-mathematics-041-2026-27'],
      durationMinutes: 180,
      maximumMarks: 80,
      readingTimeMinutes: 15,
      sectionRules: [],
    },
    officialSourceIds: ['cbse-mathematics-041-2026-27'],
    slug: 'mathematics-standard',
    status: 'active',
    subjectCode: '041',
    title: 'Mathematics Standard',
    units: [],
  };

  assert.equal(subject.subjectCode, '041');
  assert.equal(subject.examProfile?.maximumMarks, 80);
});
```

- [ ] **Step 2: Run the test and confirm the missing module**

Run:

```powershell
npm.cmd run test -w apps/web
```

Expected: FAIL because `./types` does not exist.

- [ ] **Step 3: Implement the types**

Use the exact unions and interfaces from Section 7 of the approved design. Add:

```ts
export type BoardQuestionType =
  | 'mcq'
  | 'assertion-reason'
  | 'very-short-answer'
  | 'short-answer'
  | 'long-answer'
  | 'case-study'
  | 'source-based'
  | 'extract-based'
  | 'numerical'
  | 'proof'
  | 'construction'
  | 'diagram'
  | 'map-skill'
  | 'picture-interpretation'
  | 'data-interpretation'
  | 'grammar'
  | 'creative-writing';
```

Represent source references on subjects and books as stable source IDs rather than copying URL records into every subject:

```ts
export type CurriculumSubject = {
  academicSession: string;
  assessmentMode: AssessmentMode;
  books: PrescribedBook[];
  classLevel: 10;
  examProfile: ExamProfile | null;
  officialSourceIds: string[];
  slug: string;
  status: CurriculumStatus;
  subjectCode: string;
  title: string;
  units: CurriculumUnit[];
};
```

- [ ] **Step 4: Run tests and TypeScript**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/curriculum/types.ts apps/web/lib/curriculum/types.test.ts
git commit -m "Add curriculum registry types"
```

### Task 2: Register official sources and distinguish current from historical evidence

**Files:**
- Create: `apps/web/lib/curriculum/official-sources.ts`
- Create: `apps/web/lib/curriculum/validation.test.ts`
- Create: `docs/curriculum/official-source-register.md`

**Interfaces:**
- Consumes: `OfficialSource`
- Produces: `OFFICIAL_SOURCES`, `getOfficialSource(id)`

- [ ] **Step 1: Write failing source tests**

Add tests that require:

```ts
assert.equal(getOfficialSource('cbse-curriculum-index-2026-27')?.academicSession, '2026-27');
assert.equal(getOfficialSource('cbse-sqp-index-2025-26')?.academicSession, '2025-26');
assert.equal(getOfficialSource('cbse-board-papers-2026')?.sourceType, 'question-paper');
assert.equal(getOfficialSource('cbse-hpe-2026-27')?.sourceType, 'curriculum');
```

Also assert every record has an HTTPS URL, `publishedBy`, and ISO `verifiedOn`.

- [ ] **Step 2: Run the test**

Expected: FAIL because source registry functions do not exist.

- [ ] **Step 3: Add source records**

Create a readonly record using the source IDs and URLs in the master roadmap. Set:

```ts
export const ACTIVE_CURRICULUM_SESSION = '2026-27';
export const SOURCE_VERIFIED_ON = '2026-06-24';
```

Use these roles:

- Current `2026-27` curriculum PDFs: `sourceType: 'curriculum'`
- `2025-26` sample index: `sourceType: 'sample-paper'`, note `"Historical comparison until a 2026-27 SQP is published and verified."`
- 2026 board archive: `sourceType: 'question-paper'`, academic session `2025-26`

Do not add an AI Class X source record until its official URL is verified. The AI subject definition must therefore remain future with an activation blocker.

- [ ] **Step 4: Write the human-readable source register**

In `docs/curriculum/official-source-register.md`, include:

- Source ID
- Subject code
- Academic session
- Source role
- URL
- Verification date
- Whether it may drive current curriculum, current blueprint, or historical comparison

Explicitly state:

```text
The 2026-27 curriculum is current. The latest verified sample-paper set is 2025-26.
Historical papers may inform gap analysis but cannot silently define the active 2026-27 blueprint.
```

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add apps/web/lib/curriculum/official-sources.ts apps/web/lib/curriculum/validation.test.ts docs/curriculum/official-source-register.md
git commit -m "Register CBSE curriculum sources"
```

### Task 3: Implement curriculum validation

**Files:**
- Create: `apps/web/lib/curriculum/validation.ts`
- Modify: `apps/web/lib/curriculum/validation.test.ts`

**Interfaces:**
- Consumes: `CurriculumSubject`, source registry
- Produces: `CurriculumValidationIssue`, `validateCurriculumSubject`

- [ ] **Step 1: Write invalid fixtures**

Test these issue codes in deterministic order:

```ts
type CurriculumValidationCode =
  | 'missing-source'
  | 'missing-exam-profile'
  | 'invalid-total-marks'
  | 'duplicate-unit-id'
  | 'duplicate-chapter-id'
  | 'duplicate-topic-id'
  | 'missing-required-question-types'
  | 'contradictory-platform-scope'
  | 'future-subject-visible'
  | 'invalid-basic-profile';
```

Create one fixture with section marks `79` against `maximumMarks: 80`. Create one future subject with `visibleInCatalog: true`. Add `visibleInCatalog` to `CurriculumSubject` if the approved design's status alone cannot express this validation.

- [ ] **Step 2: Run tests**

Expected: FAIL with missing validation exports.

- [ ] **Step 3: Implement pure validation**

Validation must:

- Return issues rather than throw.
- Preserve deterministic order.
- Resolve every `officialSourceId`.
- Sum top-level section marks.
- Traverse units, chapters, and topics for duplicate IDs.
- Require at least one `requiredQuestionType` for `board-exam` topics.
- Reject a `future` subject with `visibleInCatalog: true`.
- Reject Mathematics Basic when its `subjectCode` is not `241` or its slug is `mathematics-standard`.

- [ ] **Step 4: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add apps/web/lib/curriculum/validation.ts apps/web/lib/curriculum/validation.test.ts apps/web/lib/curriculum/types.ts
git commit -m "Validate curriculum definitions"
```

### Task 4: Register complete subject definitions

**Files:**
- Create all files under `apps/web/lib/curriculum/subjects/class-10/`
- Create: `apps/web/lib/curriculum/registry.ts`
- Create: `apps/web/lib/curriculum/registry.test.ts`

**Interfaces:**
- Consumes: curriculum types, source IDs
- Produces: `CURRICULUM_SUBJECTS`, `getActiveCurriculumSession`, `getCurriculumSubject`, `getVisibleCurriculumSubjects`

- [ ] **Step 1: Write registry tests**

Assert:

```ts
assert.equal(getActiveCurriculumSession(), '2026-27');
assert.equal(getCurriculumSubject('mathematics-standard')?.subjectCode, '041');
assert.equal(getCurriculumSubject('mathematics-basic')?.subjectCode, '241');
assert.equal(getCurriculumSubject('science')?.subjectCode, '086');
assert.equal(getCurriculumSubject('social-science')?.subjectCode, '087');
assert.equal(getCurriculumSubject('english-language-and-literature')?.subjectCode, '184');
assert.equal(getCurriculumSubject('hindi-course-b')?.subjectCode, '085');
assert.equal(getCurriculumSubject('health-and-physical-education')?.assessmentMode, 'internal');
assert.equal(getVisibleCurriculumSubjects().some((subject) => subject.slug === 'artificial-intelligence'), false);
assert.equal(getVisibleCurriculumSubjects().some((subject) => subject.slug === 'information-technology'), false);
```

Assert every registered active subject returns zero validation issues.

- [ ] **Step 2: Run tests**

Expected: FAIL because definitions and registry do not exist.

- [ ] **Step 3: Add subject identities and unit weights**

Use:

```text
Mathematics Standard 041: Number Systems 6, Algebra 20, Coordinate Geometry 6,
Geometry 15, Trigonometry 12, Mensuration 10, Statistics and Probability 11.

Science 086: Chemical Substances 25, World of Living 25, Natural Phenomena 12,
Effects of Current 13, Natural Resources 5.

Social Science 087: History 20, Geography 20, Political Science 20, Economics 20.

English 184: Reading 20, Writing and Grammar 20, Literature 40.

Hindi B 085: Unseen Comprehension 14, Grammar 16, Literature 28, Creative Writing 22.
```

Use `platformChapterSlugs` from `apps/web/lib/course-content.ts`. Include missing platform slugs as empty arrays so coverage reports identify them instead of inventing matches.

For Mathematics Basic:

- Use `subjectCode: '241'`.
- Reuse curriculum chapter refs only where official current sources support the same Class X curriculum.
- Keep a separate exam profile and source note.
- Do not set `visibleInCatalog` until the Mathematics plan completes Basic activation.

For HPE:

```ts
assessmentMode: 'internal',
examProfile: null,
status: 'active',
visibleInCatalog: true
```

For IT:

```ts
assessmentMode: 'optional-skill',
status: 'future',
subjectCode: '402',
visibleInCatalog: false
```

For AI:

```ts
assessmentMode: 'optional-skill',
status: 'future',
subjectCode: '417',
visibleInCatalog: false,
officialSourceIds: []
```

Validation for a future subject may permit no source only when an explicit activation blocker is recorded. Add:

```ts
activationBlockers: string[];
```

and require at least one blocker for a future subject lacking sources.

- [ ] **Step 4: Add exact chapter-level mappings**

At minimum include:

- Mathematics: all 14 existing platform chapter slugs.
- Science: all 13 existing platform chapter slugs.
- Social Science: board-exam chapters plus explicit periodic/project/excluded scope for extra packs.
- English: reading, grammar, writing domains; nine First Flight prose texts; ten poems with empty platform mappings; nine Footprints texts.
- Hindi: unseen, grammar, writing domains; current prose, poetry, and supplementary entries from the official prescribed books; mark excluded texts as `excluded`.

Do not infer a Hindi text mapping from an English transliteration unless the platform slug clearly identifies the same prescribed text.

- [ ] **Step 5: Implement registry lookups**

Index by:

```ts
`${academicSession}:${subject.slug}`
```

Return `null` rather than throw for unknown subjects.

- [ ] **Step 6: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 7: Commit**

```powershell
git add apps/web/lib/curriculum/subjects apps/web/lib/curriculum/registry.ts apps/web/lib/curriculum/registry.test.ts apps/web/lib/curriculum/types.ts apps/web/lib/curriculum/validation.ts
git commit -m "Register Class 10 curriculum"
```

### Task 5: Build deterministic coverage reports

**Files:**
- Create: `apps/web/lib/curriculum/coverage.ts`
- Create: `apps/web/lib/curriculum/coverage.test.ts`
- Modify: `apps/web/lib/course-content.ts`

**Interfaces:**
- Consumes: `CurriculumSubject`, chapter entries, chapter-pack/lesson evidence, question coverage supplied later
- Produces: `CoverageEvidence`, `CoverageDimensionResult`, `SubjectCoverageReport`, `buildSubjectCoverage`

- [ ] **Step 1: Write coverage tests**

Create a fixture where:

- Two board topics exist.
- One has a chapter pack.
- One has no platform mapping.
- Five MCQs exist but no descriptive questions.

Assert:

```ts
assert.equal(report.dimensions.curriculum.percent, 100);
assert.equal(report.dimensions.chapterPack.percent, 50);
assert.equal(report.dimensions.questionType.percent < 100, true);
assert.equal(report.blockers.includes('Missing platform mapping for topic-2'), true);
```

Test that internal-only and excluded topics do not lower board-exam coverage.

- [ ] **Step 2: Run tests**

Expected: FAIL because coverage builder does not exist.

- [ ] **Step 3: Implement explicit formulas**

Use integer percentages:

```ts
percent = denominator === 0 ? 100 : Math.round((numerator / denominator) * 100);
```

Dimensions:

- `curriculum`: valid board-exam topics / board-exam topics.
- `chapterPack`: mapped board-exam chapters with pack / mapped board-exam chapters.
- `lessonWise`: mapped board-exam chapters with at least one available lesson / mapped board-exam chapters.
- `questionBank`: sum of capped reviewed counts / sum of minimum reviewed counts.
- `questionType`: satisfied required topic/type pairs / required topic/type pairs.
- `reviewedAnswer`: reviewed valid questions / all non-retired structured questions.
- `paperGeneration`: valid distinct seeds capped at 3 / 3.
- `studentPublication`: passed publication gates / total publication gates.

Expose raw numerator, denominator, percent, and blocker strings.

- [ ] **Step 4: Add course-content evidence adapter**

Add a focused export to `course-content.ts`:

```ts
export function getCurriculumContentEvidence(): CurriculumContentEvidence
```

It may call existing `getChapterEntries`, `hasChapterPack`, and `getAvailableLessons`. It must not import question-bank modules.

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add apps/web/lib/curriculum/coverage.ts apps/web/lib/curriculum/coverage.test.ts apps/web/lib/course-content.ts
git commit -m "Add curriculum coverage reports"
```

### Task 6: Add deterministic chapter-pack generation

**Files:**
- Create: `apps/web/lib/chapter-pack-generation.ts`
- Create: `apps/web/lib/chapter-pack-generation.test.ts`
- Create: `apps/web/scripts/generate-chapter-packs.ts`
- Modify: `apps/web/package.json`

**Interfaces:**
- Consumes: `docs/content/class-10/**/chapter-pack.md`
- Produces: stable `apps/web/lib/chapter-packs.generated.ts`

- [ ] **Step 1: Write failing parser and ordering tests**

Use an in-memory pair of markdown fixtures. Test:

```ts
const packs = buildChapterPackRecords([
  { path: 'z/chapter-pack.md', markdown: '---\ntitle: Zed\nsubject: Science\nchapter_slug: zed\n---\n# Zed' },
  { path: 'a/chapter-pack.md', markdown: '---\ntitle: Alpha\nsubject: English\nchapter_slug: alpha\n---\n# Alpha' },
]);

assert.deepEqual(packs.map((pack) => pack.slug), ['alpha', 'zed']);
```

Reject missing `title`, `subject`, or `chapter_slug`, and reject duplicate slugs.

- [ ] **Step 2: Run the test**

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the pure generator helper**

Export:

```ts
export type ChapterPackSource = { path: string; markdown: string };
export type GeneratedChapterPackRecord = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

export function buildChapterPackRecords(
  sources: ChapterPackSource[],
): GeneratedChapterPackRecord[];

export function renderChapterPacksModule(
  records: GeneratedChapterPackRecord[],
): string;
```

Sort records by slug. Render JSON with 2-space indentation and a trailing newline. Keep full source markdown unchanged.

- [ ] **Step 4: Implement the script**

The script must:

1. Resolve `const repoRoot = path.resolve(process.cwd(), '../..')`.
2. Recursively find `chapter-pack.md` under `path.join(repoRoot, 'docs', 'content', 'class-10')`.
3. Read UTF-8.
4. Build and validate records.
5. Write only when output differs.
6. Write to `path.join(process.cwd(), 'lib', 'chapter-packs.generated.ts')`.
7. Print `Generated <count> chapter packs.`.

The workspace command runs with `process.cwd()` equal to `apps/web`; do not assume it runs at the repository root.

- [ ] **Step 5: Add the package script**

```json
"content:generate": "tsx scripts/generate-chapter-packs.ts"
```

- [ ] **Step 6: Regenerate and verify stable output**

```powershell
npm.cmd run content:generate -w apps/web
git diff -- apps/web/lib/chapter-packs.generated.ts
npm.cmd run content:generate -w apps/web
git diff --check
```

Expected: the second generation produces no new diff.

- [ ] **Step 7: Run tests and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/chapter-pack-generation.ts apps/web/lib/chapter-pack-generation.test.ts apps/web/scripts/generate-chapter-packs.ts apps/web/package.json apps/web/lib/chapter-packs.generated.ts
git commit -m "Add deterministic chapter pack generation"
```

### Task 7: Replace hard-coded subject routing

**Files:**
- Modify: `apps/web/app/subjects/page.tsx`
- Modify: `apps/web/app/subjects/[slug]/page.tsx`
- Modify: `apps/web/lib/course-content.test.ts`

**Interfaces:**
- Consumes: `getVisibleCurriculumSubjects`, `getCurriculumSubject`
- Produces: registry-driven subject catalog and subject page metadata

- [ ] **Step 1: Add failing catalog tests**

Extract a pure helper:

```ts
buildSubjectCatalog(
  subjects: CurriculumSubject[],
  chapterEntries: ReturnType<typeof getChapterEntries>,
): SubjectCatalogItem[]
```

Test:

- HPE has `assessmentLabel: 'Internal assessment'`.
- AI and IT are absent.
- Social Science appears once.
- Mathematics Standard appears as the current Mathematics board-preparation profile.

- [ ] **Step 2: Run tests**

Expected: FAIL because helper does not exist.

- [ ] **Step 3: Implement registry-driven pages**

Remove:

```ts
const validSlugs = [...]
```

Add and test this exact alias map:

```ts
export const SUBJECT_ROUTE_ALIASES: Record<string, string> = {
  english: 'english-language-and-literature',
  hindi: 'hindi-course-b',
  mathematics: 'mathematics-standard',
};
```

Resolve every route through:

```ts
getCurriculumSubject(resolveCurriculumSubjectSlug(slug))
```

Keep canonical slugs valid too. Document all three aliases in the helper test.

Show:

- Official subject code.
- Assessment mode.
- Current session.
- Internal-assessment label for HPE.

Do not show future optional subjects.

- [ ] **Step 4: Build and test**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add -- "apps/web/app/subjects/page.tsx" "apps/web/app/subjects/[slug]/page.tsx" "apps/web/lib/course-content.test.ts" "apps/web/lib/curriculum"
git commit -m "Drive subjects from curriculum registry"
```

### Task 8: Document annual refresh and durable architecture

**Files:**
- Create: `docs/curriculum/annual-refresh-runbook.md`
- Modify: `docs/project-memory.md`

- [ ] **Step 1: Write the refresh checklist**

The runbook must require:

1. Verify the new curriculum index.
2. Register new source IDs without overwriting old sessions.
3. Compare units, marks, texts, maps, excluded topics, and question design.
4. Mark previous sample papers historical.
5. Run registry and coverage tests.
6. Resolve every changed scope.
7. Record reviewer and verification date.
8. Activate the new session only after zero validation issues.

- [ ] **Step 2: Add durable memory**

Record:

- Curriculum truth lives under `apps/web/lib/curriculum`.
- Active session is explicit.
- Historical papers cannot silently drive current blueprints.
- Subject pages consume the registry.

- [ ] **Step 3: Final verification**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
git status --short
```

- [ ] **Step 4: Commit**

```powershell
git add docs/curriculum/annual-refresh-runbook.md docs/project-memory.md graphify-out apps/web
git commit -m "Document curriculum refresh workflow"
```

## Acceptance Criteria

- Current `2026-27` sources are registered and validated.
- Historical evidence is clearly marked.
- Five core subjects have valid registry definitions.
- Mathematics Standard and Basic are separate.
- HPE is internal assessment.
- AI and IT are hidden future subjects.
- Coverage dimensions use explicit formulas.
- Social Science appears once.
- Hard-coded valid subject slugs are removed.
- Existing chapter and quiz routes remain functional.
- Tests, lint, and web build pass.
