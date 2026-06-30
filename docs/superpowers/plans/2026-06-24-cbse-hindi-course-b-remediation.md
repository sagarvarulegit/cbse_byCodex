# CBSE Hindi Course B Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Hindi Course B `085` complete across अपठित बोध, व्यावहारिक व्याकरण, साहित्य, and रचनात्मक लेखन with Unicode-safe content and assessment.

**Architecture:** Register all Hindi domains and prescribed texts, create missing poetry/supplementary content, add Devanagari and Hindi-format validators, and author reviewed question modules for the exact 14/16/28/22 structure.

**Tech Stack:** TypeScript, Node test runner, curriculum registry, generated chapter-pack loader, structured question bank, Unicode Devanagari.

## Global Constraints

- Plans 1 and 2 must pass.
- Subject code: `085`.
- Written-paper domains: 14/16/28/22.
- Source content must be Unicode Devanagari.
- Do not paste glyph-corrupted PDF extraction into content files.
- Exclude बिहारी-दोहे, मधुर-मधुर मेरे दीपक जल, and गिरगिट from annual-paper readiness under the current curriculum.
- All three Sanchayan Part 2 texts remain assessed unless the current official source changes.
- Writing answers must follow current word limits.
- No AI grading.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/subjects/hindi.ts
apps/web/lib/question-bank/subjects/hindi.test.ts
apps/web/content/question-bank/class-10/hindi-course-b/unseen-comprehension.ts
apps/web/content/question-bank/class-10/hindi-course-b/grammar.ts
apps/web/content/question-bank/class-10/hindi-course-b/sparsh-prose.ts
apps/web/content/question-bank/class-10/hindi-course-b/sparsh-poetry.ts
apps/web/content/question-bank/class-10/hindi-course-b/sanchayan.ts
apps/web/content/question-bank/class-10/hindi-course-b/creative-writing.ts
apps/web/content/question-bank/class-10/hindi-course-b/bank.test.ts
docs/content/class-10/hindi/board-skills/apatit-bodh/chapter-pack.md
docs/content/class-10/hindi/board-skills/vyavaharik-vyakaran/chapter-pack.md
docs/content/class-10/hindi/board-skills/rachanatmak-lekhan/chapter-pack.md
docs/content/class-10/hindi/sparsh/poetry/parvat-pradesh-mein-pavas/chapter-pack.md
docs/content/class-10/hindi/sparsh/poetry/tope/chapter-pack.md
docs/content/class-10/hindi/sparsh/poetry/kar-chale-hum-fida/chapter-pack.md
docs/content/class-10/hindi/sparsh/poetry/aatmatran/chapter-pack.md
docs/content/class-10/hindi/sanchayan/harihar-kaka/chapter-pack.md
docs/content/class-10/hindi/sanchayan/topi-shukla/chapter-pack.md
docs/content/class-10/hindi/sanchayan/sapnon-ke-se-din/chapter-pack.md
docs/curriculum/subject-readiness/hindi-course-b.md
```

**Modify:**

```text
apps/web/lib/curriculum/subjects/class-10/hindi-course-b.ts
apps/web/content/question-bank/class-10/hindi-course-b/index.ts
apps/web/lib/question-bank/types.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/chapter-packs.generated.ts
apps/web/lib/course-content.ts
apps/web/lib/course-content.test.ts
apps/web/lib/question-bank/paper-assembler.test.ts
docs/project-memory.md
```

## Hindi Interfaces

```ts
export type HindiDomain = 'unseen-comprehension' | 'grammar' | 'literature' | 'creative-writing';

export type HindiQuestionMetadata = {
  domain: HindiDomain;
  grammarFamily?: 'padbandh' | 'vakya-rupantaran' | 'samaas' | 'muhavare';
  prescribedTextId?: string;
  targetWordRange?: { minimum: number; maximum: number };
  writingFormat?: 'anucched' | 'patra' | 'soochna' | 'vigyapan' | 'email' | 'laghukatha';
};

export function validateHindiQuestion(question: BoardQuestion): QuestionValidationIssue[];
export function containsBrokenDevanagari(value: string): boolean;
```

### Task 1: Lock complete curriculum and exclusions

- [ ] **Step 1: Add failing domain tests**

```ts
assert.deepEqual(subject.units.map((unit) => [unit.id, unit.marks]), [
  ['unseen-comprehension', 14],
  ['grammar', 16],
  ['literature', 28],
  ['creative-writing', 22],
]);
```

- [ ] **Step 2: Register grammar**

```text
padbandh
vakya-rupantaran
samaas
muhavare
```

Each contributes 4 attempted marks under the current pattern.

- [ ] **Step 3: Register writing**

```text
anucched: 5 marks, about 120 words
patra: 5 marks, about 100 words
soochna: 4 marks, about 60 words
vigyapan: 3 marks, about 40 words
email or laghukatha: 5 marks according to internal choice
```

- [ ] **Step 4: Register literature**

Map existing platform content:

```text
bade-bhai-sahab
diary-ka-ek-panna
tantara-vamiro-katha (retain as compatibility alias; use official title in display)
teesri-kasam-shailendra
ab-kahan-doosre-ke-dukh
patjhar-me-tooti-pattiya
kartoos
sakhi
pad
manushyata
```

Add missing:

```text
parvat-pradesh-mein-pavas
tope
kar-chale-hum-fida
aatmatran
harihar-kaka
topi-shukla
sapnon-ke-se-din
```

Register excluded texts with `scope: 'excluded'`.

- [ ] **Step 5: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/hindi-course-b.ts docs/curriculum/subject-readiness/hindi-course-b.md
git commit -m "Align Hindi Course B curriculum"
```

### Task 2: Add missing Hindi content

- [ ] **Step 1: Add failing chapter-pack tests**

Assert the seven missing literature slugs and three board-skill slugs exist.

- [ ] **Step 2: Author board-skill guides**

Write in clean Unicode Hindi. Include:

- प्रश्न-पत्र संरचना
- चरणबद्ध विधि
- हल किए हुए उदाहरण
- सामान्य त्रुटियाँ
- अंकन बिंदु
- अभ्यास
- उत्तर-जाँच

- [ ] **Step 3: Author four poetry packs**

Include central idea, भाव, भाषा, काव्य-सौंदर्य, प्रतीक, extract method, short answers, and comparisons. Do not reproduce full poems.

- [ ] **Step 4: Author three Sanchayan packs**

Include plot, character, themes, evidence, 50-60 word answers, and common mistakes.

- [ ] **Step 5: Generate and verify**

```powershell
npm.cmd run content:generate -w apps/web
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
```

- [ ] **Step 6: Commit**

```powershell
git add docs/content/class-10/hindi apps/web/lib/chapter-packs.generated.ts apps/web/lib/course-content.test.ts
git commit -m "Add missing Hindi Course B content"
```

### Task 3: Add Unicode and Hindi-specific validation

- [ ] **Step 1: Write failing Unicode tests**

Test detection of:

- Replacement character `�`
- Common UTF-8 mojibake fragments such as `à¤`
- Empty Devanagari prompt for Hindi question
- Latin-only model answer where Hindi is required

- [ ] **Step 2: Write assessment validation tests**

Test:

- Grammar item without grammar family.
- Writing prompt outside active word range.
- Literature question mapped to excluded text.
- 2-mark literature answer with rubric total 1.
- Unseen passage without evidence-linked answer.

- [ ] **Step 3: Implement rules**

- Hindi prompt/model answer/explanation contain valid Devanagari except URLs, codes, or deliberate English terms.
- Writing word ranges match the active format.
- Grammar family is required.
- Excluded text refs fail publication.
- Unseen answers include `evidenceText?: string`.

- [ ] **Step 4: Integrate and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/question-bank/subjects/hindi.ts apps/web/lib/question-bank/subjects/hindi.test.ts apps/web/lib/question-bank/types.ts apps/web/lib/question-bank/validation.ts
git commit -m "Validate Hindi Course B questions"
```

### Task 4: Define Hindi bank quotas

Use:

**अपठित बोध**

- 12 original passages of about 200 words
- Each passage set totals 7 marks
- At least 6 objective and 6 mixed-response sets

**व्याकरण**

- 40 reviewed items per grammar family
- 160 reviewed items total

**साहित्य**

- Each assessed Sparsh prose text: 2 extract sets and 4 short answers
- Each assessed poem: 2 extract sets and 4 short answers
- Each Sanchayan text: 5 questions of 50-60 words

**रचनात्मक लेखन**

- 12 अनुच्छेद prompts
- 12 पत्र prompts
- 10 सूचना prompts
- 10 विज्ञापन prompts
- 8 ई-मेल prompts
- 8 लघुकथा prompts

- [ ] **Step 1: Add exact quota tests**

- [ ] **Step 2: Run red test and commit**

```text
Define Hindi Course B question quotas
```

### Task 5: Author comprehension and grammar banks

- [ ] **Step 1: Author unseen passages**

Use original contemporary, age-appropriate topics. Every answer cites passage evidence.

- [ ] **Step 2: Commit**

```text
Add Hindi unseen comprehension
```

- [ ] **Step 3: Author grammar items**

Provide explanations in Hindi. Mix identification, transformation, विग्रह, and contextual usage as appropriate.

- [ ] **Step 4: Commit**

```text
Add Hindi grammar questions
```

### Task 6: Author literature and writing banks

- [ ] **Step 1: Author Sparsh prose**

- [ ] **Step 2: Author Sparsh poetry**

- [ ] **Step 3: Author Sanchayan**

- [ ] **Step 4: Author writing prompts and model responses**

Model responses remain within current word limits and use current formats.

- [ ] **Step 5: Commit each module**

```text
Add Hindi prose questions
Add Hindi poetry questions
Add Hindi supplementary questions
Add Hindi writing prompts
```

### Task 7: Generate three Hindi review papers

- [ ] **Step 1: Encode exact domain rules**

```text
Unseen comprehension 14
Grammar 16
Literature 28
Creative writing 22
Total 80
```

Preserve internal choices defined by the current curriculum.

- [ ] **Step 2: Generate seeds**

```text
hindi-b-review-1
hindi-b-review-2
hindi-b-review-3
```

- [ ] **Step 3: Run Unicode snapshot checks**

Write rendered paper text to test snapshots and assert no replacement/mojibake markers.

- [ ] **Step 4: Manually review one paper**

Check grammar accuracy, literature scope, writing format, word limits, and Devanagari rendering.

- [ ] **Step 5: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
git add apps/web/content/question-bank/class-10/hindi-course-b apps/web/lib/curriculum/subjects/class-10/hindi-course-b.ts apps/web/lib/question-bank/paper-assembler.test.ts docs/curriculum/subject-readiness/hindi-course-b.md
git commit -m "Generate Hindi Course B review papers"
```

### Task 8: Browser rendering and durable memory

- [ ] **Step 1: Browser-check**

Verify desktop and mobile:

- Hindi subject page
- Hindi board-skills pack
- Poetry pack
- Sanchayan pack
- Generated paper preview
- Model answer and rubric

- [ ] **Step 2: Run final checks**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
```

- [ ] **Step 3: Update project memory and commit**

```text
Verify Hindi Course B readiness
```

## Acceptance Criteria

- Hindi is measured as 14/16/28/22.
- Grammar and writing domains are complete.
- Seven missing literature entries are added.
- Excluded texts do not count.
- Unicode validation passes.
- All bank quotas pass.
- Three review papers generate.
- Desktop and mobile Devanagari rendering passes.
- Existing Hindi quizzes remain operational.
