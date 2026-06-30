# CBSE Social Science Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Represent Social Science `087` as one 80-mark subject with four 20-mark sections, correct assessment scope, official map work, and reviewed source/cartoon/data/descriptive questions.

**Architecture:** Keep History, Geography, Political Science, and Economics as curriculum units and UI filters under one subject code. Add a versioned map registry and Social Science validators, then author reviewed questions section by section.

**Tech Stack:** TypeScript, Node test runner, curriculum registry, structured question bank.

## Global Constraints

- Plans 1 and 2 must pass.
- Subject code: `087`.
- Each section contributes exactly 20 marks.
- History includes 2 map marks; Geography includes 3 map marks under the current verified design.
- Project-only, interdisciplinary-project, periodic-only, and excluded content cannot inflate board readiness.
- Map entries must come from the official current list.
- Use point-based rubrics for 2-, 3-, and 5-mark answers.
- Do not split Social Science into four unrelated subjects.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/subjects/social-science.ts
apps/web/lib/question-bank/subjects/social-science.test.ts
apps/web/lib/curriculum/subjects/class-10/social-science-map-locations.ts
apps/web/lib/curriculum/subjects/class-10/social-science-map-locations.test.ts
apps/web/content/question-bank/class-10/social-science/history.ts
apps/web/content/question-bank/class-10/social-science/geography.ts
apps/web/content/question-bank/class-10/social-science/political-science.ts
apps/web/content/question-bank/class-10/social-science/economics.ts
apps/web/content/question-bank/class-10/social-science/bank.test.ts
apps/web/content/question-bank/class-10/social-science/assets/maps/
docs/curriculum/subject-readiness/social-science.md
```

**Modify:**

```text
apps/web/lib/curriculum/subjects/class-10/social-science.ts
apps/web/content/question-bank/class-10/social-science/index.ts
apps/web/lib/question-bank/types.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/question-bank/paper-assembler.ts
apps/web/lib/question-bank/paper-assembler.test.ts
apps/web/app/subjects/page.tsx
apps/web/app/subjects/[slug]/page.tsx
docs/project-memory.md
```

## Social Science Interfaces

```ts
export type SocialScienceSection = 'history' | 'geography' | 'political-science' | 'economics';

export type MapLocation = {
  acceptedLabels: string[];
  academicSession: string;
  chapterRef: string;
  featureType: string;
  id: string;
  officialLabel: string;
  section: 'history' | 'geography';
  sourceId: string;
};

export function getMapLocation(id: string): MapLocation | null;
export function validateSocialScienceQuestion(question: BoardQuestion): QuestionValidationIssue[];
```

### Task 1: Unify the curriculum and classify scope

- [ ] **Step 1: Write failing subject tests**

Assert one subject code and exact weights:

```ts
assert.deepEqual(subject.units.map((unit) => [unit.id, unit.marks]), [
  ['history', 20],
  ['geography', 20],
  ['political-science', 20],
  ['economics', 20],
]);
```

Assert the catalog contains one `social-science` subject.

- [ ] **Step 2: Register exact board scope**

Current board-exam coverage includes:

**History**

- The Rise of Nationalism in Europe
- Nationalism in India
- The Making of a Global World, current assessed subtopics only
- Print Culture and the Modern World
- Map work

**Geography**

- Resources and Development
- Forest and Wildlife Resources
- Water Resources
- Agriculture
- Minerals and Energy Resources
- Manufacturing Industries
- Lifelines of National Economy map work

**Political Science**

- Power Sharing
- Federalism
- Gender, Religion and Caste
- Political Parties
- Outcomes of Democracy

**Economics**

- Development
- Sectors of the Indian Economy
- Money and Credit
- Globalisation and the Indian Economy, current assessed subtopics

Consumer Rights is project work, not an annual-paper chapter. The Age of Industrialisation must be scoped according to the current curriculum rather than raw pack presence.

- [ ] **Step 3: Document all platform extras and slug aliases**

Resolve duplicates such as:

```text
rise-of-nationalism-in-europe / the-rise-of-nationalism-in-europe
making-of-a-global-world / the-making-of-a-global-world
print-culture / print-culture-and-the-modern-world
globalisation / globalisation-and-the-indian-economy
sectors-of-indian-economy / sectors-of-the-indian-economy
```

Choose one canonical platform slug and retain compatibility aliases in curriculum metadata.

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/social-science.ts apps/web/app/subjects docs/curriculum/subject-readiness/social-science.md
git commit -m "Unify Social Science curriculum"
```

### Task 2: Add the official map registry

**Files:**
- Create map registry and tests

- [ ] **Step 1: Write lookup tests**

Add representative assertions:

```ts
assert.equal(getMapLocation('history-nationalism-dandi-march')?.officialLabel, 'Dandi');
assert.equal(getMapLocation('geography-dam-sardar-sarovar')?.section, 'geography');
assert.equal(getMapLocation('geography-airport-amritsar')?.acceptedLabels.includes('Raja Sansi'), true);
```

- [ ] **Step 2: Populate the full current list**

Include every current official location under:

- Nationalism in India
- Soil types
- Dams
- Crop areas/producer states
- Iron ore, coal, and oil fields
- Thermal and nuclear plants
- Cotton textile centres
- Iron and steel plants
- Software technology parks
- Sea ports
- International airports

Each record includes official label, accepted variants, chapter ref, feature type, and source ID.

- [ ] **Step 3: Add uniqueness and source tests**

Reject duplicate IDs, blank labels, unsupported sections, and missing source IDs.

- [ ] **Step 4: Commit**

```powershell
git add apps/web/lib/curriculum/subjects/class-10/social-science-map-locations.ts apps/web/lib/curriculum/subjects/class-10/social-science-map-locations.test.ts
git commit -m "Register Social Science map work"
```

### Task 3: Add Social Science validation

- [ ] **Step 1: Write failing cases**

Test:

- Map question with unknown location ID.
- Five-mark answer with fewer than five rubric marks.
- Source-based question without stimulus.
- Cartoon question without image alt text.
- Question with section metadata that conflicts with curriculum ref.

- [ ] **Step 2: Add metadata**

```ts
subjectMetadata?: {
  socialScience?: {
    mapLocationIds?: string[];
    section: SocialScienceSection;
    expectedPointCount?: number;
  };
};
```

- [ ] **Step 3: Implement rules**

- 2/3/5-mark rubrics total exactly 2/3/5.
- `expectedPointCount` cannot exceed rubric points.
- Map locations must exist for `2026-27`.
- Source and picture questions require stimulus/assets.
- Section must match curriculum unit.

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/question-bank/subjects/social-science.ts apps/web/lib/question-bank/subjects/social-science.test.ts apps/web/lib/question-bank/types.ts apps/web/lib/question-bank/validation.ts
git commit -m "Validate Social Science questions"
```

### Task 4: Define section quotas

Use this reviewed minimum per section:

| Section | 1 mark | 2 mark | 3 mark | 5 mark | 4-mark source/case | Special |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| History | 8 | 3 | 3 | 2 | 2 | 8 map items |
| Geography | 8 | 3 | 3 | 2 | 2 | 20 map items and 3 data/picture items |
| Political Science | 8 | 3 | 3 | 2 | 2 | 4 cartoon/assertion items |
| Economics | 8 | 3 | 3 | 2 | 2 | 4 data/case items |

- [ ] **Step 1: Add bank quota tests**

Test reviewed status and section distribution.

- [ ] **Step 2: Run red test and commit**

```text
Define Social Science question quotas
```

### Task 5: Author History and Geography banks

- [ ] **Step 1: Author History**

Include:

- Chronology and concepts
- Source interpretation
- Visual nationalism/print interpretation
- 2/3/5-mark arguments
- Nationalism in India map questions
- Assessed Global World subtopics only

- [ ] **Step 2: Commit**

```text
Add History board questions
```

- [ ] **Step 3: Author Geography**

Include:

- Resource/soil/data questions
- Water and dams
- Agriculture and crops
- Minerals/energy
- Manufacturing
- Transport/communication
- Full map registry coverage through reusable map prompts

- [ ] **Step 4: Commit**

```text
Add Geography board questions
```

### Task 6: Author Political Science and Economics banks

- [ ] **Step 1: Author Political Science**

Include Belgium/Sri Lanka, federalism, decentralisation, gender/religion/caste, parties, and outcomes. Add original cartoons or text-described accessible equivalents; do not copy copyrighted cartoons without permission.

- [ ] **Step 2: Commit**

```text
Add Political Science board questions
```

- [ ] **Step 3: Author Economics**

Include development indicators, sectors, credit cases, RBI/banks, globalisation, and data interpretation.

- [ ] **Step 4: Commit**

```text
Add Economics board questions
```

### Task 7: Enforce the 20/20/20/20 paper

- [ ] **Step 1: Add paper test**

Generate seeds:

```text
social-science-review-1
social-science-review-2
social-science-review-3
```

Assert each has:

```ts
{
  history: 20,
  geography: 20,
  'political-science': 20,
  economics: 20,
}
```

Assert History map marks total 2 and Geography map marks total 3 when required by the profile.

- [ ] **Step 2: Add assembler section constraints**

The assembler must not borrow marks across sections.

- [ ] **Step 3: Verify**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
```

- [ ] **Step 4: Commit**

```text
Generate Social Science review papers
```

### Task 8: Final audit and memory

- [ ] **Step 1: Manually review one paper**

Record section totals, map correctness, source wording, rubrics, and scope.

- [ ] **Step 2: Run**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
```

- [ ] **Step 3: Record durable rules**

Document one-subject organization, alias handling, project scope, and map versioning.

- [ ] **Step 4: Commit**

```text
Verify Social Science board readiness
```

## Acceptance Criteria

- Social Science appears once.
- All four sections are 20 marks.
- Scope labels are correct.
- Duplicate slugs have canonical mappings.
- Official map registry is complete.
- Questions pass section/map/source validation.
- Reviewed quotas pass.
- Three papers generate with exact section totals.
- Existing chapter packs and quizzes remain operational.
