# CBSE English Language and Literature Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make English Language and Literature `184` complete across Reading Skills, Writing and Grammar, and Literature instead of treating prose chapter summaries as full board preparation.

**Architecture:** Register non-chapter assessment domains as first-class curriculum units, split all prescribed poems into first-class content entries, add English-specific validators, and author reviewed question sets for the exact 20/20/40 structure.

**Tech Stack:** TypeScript, Node test runner, curriculum registry, generated chapter-pack loader, structured question bank.

## Global Constraints

- Plans 1 and 2 must pass.
- Subject code: `184`.
- Current written-paper domains: Reading 20, Writing/Grammar 20, Literature 40.
- Use all currently prescribed First Flight prose, poems, and Footprints Without Feet texts.
- Use Words and Expressions II only in its officially prescribed role.
- Unseen passages must be platform-authored or lawfully licensed.
- Do not store long copyrighted literature extracts.
- Poems must be first-class curriculum and content entries.
- Every writing rubric must separate format, content/organization, and language accuracy.
- No AI essay grading.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/subjects/english.ts
apps/web/lib/question-bank/subjects/english.test.ts
apps/web/content/question-bank/class-10/english-language-literature/reading.ts
apps/web/content/question-bank/class-10/english-language-literature/grammar.ts
apps/web/content/question-bank/class-10/english-language-literature/creative-writing.ts
apps/web/content/question-bank/class-10/english-language-literature/first-flight-prose.ts
apps/web/content/question-bank/class-10/english-language-literature/first-flight-poetry.ts
apps/web/content/question-bank/class-10/english-language-literature/footprints-without-feet.ts
apps/web/content/question-bank/class-10/english-language-literature/bank.test.ts
docs/content/class-10/english/board-skills/reading-skills/chapter-pack.md
docs/content/class-10/english/board-skills/grammar/chapter-pack.md
docs/content/class-10/english/board-skills/formal-letter/chapter-pack.md
docs/content/class-10/english/board-skills/analytical-paragraph/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/dust-of-snow/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/fire-and-ice/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/a-tiger-in-the-zoo/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/how-to-tell-wild-animals/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/the-ball-poem/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/amanda/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/the-trees/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/fog/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/the-tale-of-custard-the-dragon/chapter-pack.md
docs/content/class-10/english/first-flight/poetry/for-anne-gregory/chapter-pack.md
docs/curriculum/subject-readiness/english-language-and-literature.md
```

**Modify:**

```text
apps/web/lib/curriculum/subjects/class-10/english-language-literature.ts
apps/web/content/question-bank/class-10/english-language-literature/index.ts
apps/web/lib/question-bank/types.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/chapter-packs.generated.ts
apps/web/lib/course-content.test.ts
apps/web/lib/question-bank/paper-assembler.test.ts
docs/project-memory.md
```

## English Interfaces

```ts
export type EnglishDomain = 'reading' | 'grammar' | 'creative-writing' | 'literature';

export type EnglishQuestionMetadata = {
  domain: EnglishDomain;
  passageWordCount?: number;
  prescribedTextId?: string;
  rightsBasis?: 'platform-authored' | 'public-domain' | 'licensed' | 'short-excerpt';
  targetWordRange?: { minimum: number; maximum: number };
  writingFormat?: 'formal-letter' | 'analytical-paragraph';
};

export function validateEnglishQuestion(question: BoardQuestion): QuestionValidationIssue[];
```

### Task 1: Lock the complete 2026-27 curriculum

- [ ] **Step 1: Write failing domain tests**

Assert:

```ts
assert.deepEqual(subject.units.map((unit) => [unit.id, unit.marks]), [
  ['reading', 20],
  ['writing-grammar', 20],
  ['literature', 40],
]);
```

- [ ] **Step 2: Assert all prescribed texts**

**First Flight prose**

```text
a-letter-to-god
nelson-mandela-long-walk-to-freedom
two-stories-about-flying
from-the-diary-of-anne-frank
glimpses-of-india
mijbil-the-otter
madam-rides-the-bus
the-sermon-at-benares
the-proposal
```

**First Flight poetry**

```text
dust-of-snow
fire-and-ice
a-tiger-in-the-zoo
how-to-tell-wild-animals
the-ball-poem
amanda
the-trees
fog
the-tale-of-custard-the-dragon
for-anne-gregory
```

**Footprints Without Feet**

```text
a-triumph-of-surgery
the-thiefs-story
the-midnight-visitor
a-question-of-trust
footprints-without-feet
the-making-of-a-scientist
the-necklace
bholi
the-book-that-saved-the-earth
```

- [ ] **Step 3: Register skills**

Reading:

- Discursive passage, 400-450 words
- Case-based factual passage with visual/data input, 200-250 words

Grammar:

- Determiners
- Tenses
- Modals
- Subject-verb concord
- Reported commands/requests, statements, and questions
- Gap filling, editing, and transformation

Writing:

- Formal letter, 100-120 words
- Analytical paragraph from map/chart/graph/cues, 100-120 words

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/english-language-literature.ts docs/curriculum/subject-readiness/english-language-and-literature.md
git commit -m "Align English assessment domains"
```

### Task 2: Make poetry and board skills first-class content

**Files:**
- Create the 14 content files listed above
- Regenerate chapter packs using the generator introduced in Plan 1
- Modify course-content tests

- [ ] **Step 1: Add failing content tests**

Assert all ten poem slugs and four skill slugs have chapter packs.

- [ ] **Step 2: Author the four skill guides**

Each guide must include:

```text
learning goals
paper pattern
repeatable method
worked examples
common mistakes
board tips
practice
answer or checklist
one-minute revision
```

Do not include copyrighted unseen passages from official papers.

- [ ] **Step 3: Author each poem pack**

Each poem file must include:

- Context and central idea
- Theme
- Tone
- Images/symbols
- Literary devices with original explanations
- Extract-solving method
- 40-50 word practice
- Comparison links
- Common mistakes
- Board tips

Do not reproduce the complete poem.

- [ ] **Step 4: Generate and test**

```powershell
npm.cmd run content:generate -w apps/web
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 5: Commit**

```powershell
git add docs/content/class-10/english apps/web/lib/chapter-packs.generated.ts apps/web/lib/course-content.test.ts
git commit -m "Add English poetry and skills content"
```

### Task 3: Add English-specific validation

- [ ] **Step 1: Write failing tests**

Test:

- Reading passage outside its word range.
- Reading passage without rights basis.
- Literature short excerpt above 90 words with `rightsBasis: 'short-excerpt'`.
- Formal-letter question without target word range.
- Writing rubric missing format marks.
- Literature question with unknown prescribed text ID.

- [ ] **Step 2: Implement rules**

- Discursive passage: 400-450 words.
- Case-based passage: 200-250 words.
- Short excerpt: maximum 90 words.
- Writing prompt: target 100-120 words.
- Formal letter and analytical paragraph are 5 marks under the active profile.
- Writing rubrics include point IDs prefixed `format-`, `content-` or `organization-`, and `accuracy-`.
- Literature refs must exist in the curriculum subject.

- [ ] **Step 3: Integrate and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/question-bank/subjects/english.ts apps/web/lib/question-bank/subjects/english.test.ts apps/web/lib/question-bank/types.ts apps/web/lib/question-bank/validation.ts
git commit -m "Validate English questions"
```

### Task 4: Define English bank quotas

Use:

**Reading**

- 6 reviewed discursive passage sets
- 6 reviewed case-based factual passage sets
- Each set totals 10 marks

**Grammar**

- 24 reviewed items for each active grammar family
- At least 144 reviewed one-mark items total

**Writing**

- 12 formal-letter prompts with rubrics/model responses
- 12 analytical-paragraph prompts with rubrics/model responses

**Literature**

- Each of 9 First Flight prose texts: 2 extract sets, 4 short answers, 2 long/comparison questions
- Each of 10 poems: 2 extract sets, 3 short answers, 1 long/comparison question
- Each of 9 Footprints texts: 3 short answers, 2 long answers

- [ ] **Step 1: Add exact quota tests**

Failure messages identify domain and text.

- [ ] **Step 2: Run red test and commit**

```text
Define English question quotas
```

### Task 5: Author Reading, Grammar, and Writing banks

- [ ] **Step 1: Author Reading**

Use original passages. Case-based passages include accessible tables/charts and evidence-linked answers.

- [ ] **Step 2: Commit**

```text
Add English reading question sets
```

- [ ] **Step 3: Author Grammar**

Distribute items across gap filling, editing, and transformation. Explanations state the grammar rule.

- [ ] **Step 4: Commit**

```text
Add English grammar questions
```

- [ ] **Step 5: Author Creative Writing**

Model responses stay within 100-120 words. Rubrics use the verified marking scheme version and record `rubricSourceId`.

- [ ] **Step 6: Commit**

```text
Add English writing prompts
```

### Task 6: Author Literature banks

- [ ] **Step 1: First Flight prose**

Cover extract inference, vocabulary, character, theme, evidence, and cross-text comparison.

- [ ] **Step 2: First Flight poetry**

Cover tone, atmosphere, image, symbol, device, theme, and comparisons.

- [ ] **Step 3: Footprints Without Feet**

Cover inference, character assessment, plot/theme, humour/irony, science/ethics, and long answers.

- [ ] **Step 4: Commit each file separately**

```text
Add First Flight prose questions
Add First Flight poetry questions
Add Footprints questions
```

### Task 7: Generate three English review papers

- [ ] **Step 1: Encode the current curriculum section totals**

Use:

```text
Reading 20
Grammar 10
Creative Writing 10
Literature Extracts 10
First Flight short answers 12
Footprints short answers 6
First Flight long answer 6
Footprints long answer 6
```

Set blueprint status according to the latest verified current sample-paper availability.

- [ ] **Step 2: Generate seeds**

```text
english-review-1
english-review-2
english-review-3
```

- [ ] **Step 3: Assert exact word-range and text-family rules**

No paper may omit poetry or Footprints.

- [ ] **Step 4: Manually review one paper**

Record passage originality, grammar correctness, writing rubric, literature balance, and total marks.

- [ ] **Step 5: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
git add apps/web/content/question-bank/class-10/english-language-literature apps/web/lib/curriculum/subjects/class-10/english-language-literature.ts apps/web/lib/question-bank/paper-assembler.test.ts docs/curriculum/subject-readiness/english-language-and-literature.md
git commit -m "Generate English review papers"
```

### Task 8: Final verification

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
```

Update `docs/project-memory.md` with the multi-domain English rule and first-class poetry rule.

Commit:

```text
Verify English board readiness
```

## Acceptance Criteria

- English is measured as 20/20/40.
- All prescribed texts are registered.
- Ten poems and four skill guides are first-class content.
- English validation passes.
- Reading, grammar, writing, and literature quotas pass.
- Three review papers generate.
- No paper omits poetry, Footprints, reading, grammar, or writing.
- Existing English prose pages and quizzes remain operational.
