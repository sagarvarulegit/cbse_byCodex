# CBSE Class 10 Board Readiness Remediation Design

**Status:** Approved for implementation planning  
**Approved:** 2026-06-24  
**Scope:** CBSE Class 10 board-preparation alignment for Mathematics, Science, Social Science, English Language and Literature, Hindi Course B, Health and Physical Education classification, and future optional subjects  
**Repository:** `C:\Sagar\Projects\CBSE\cbse_byCodex`

## 1. Purpose

The platform already contains broad chapter-pack and quiz coverage, but chapter presence is not the same as board-exam readiness. This programme will make the platform's syllabus, notes, questions, tests, and readiness claims traceable to the current official CBSE curriculum and assessment pattern.

The programme must correct the gaps identified by the June 2026 audit:

- Mathematics has strong chapter coverage but insufficient proof, case-study, descriptive, and multi-step problem practice.
- Science has strong chapter coverage but insufficient numerical, experimental, diagram, observation, and reasoning practice.
- Social Science has broad textbook coverage but needs one coherent board-subject model, assessment-scope labels, source questions, maps, cartoons, data interpretation, and structured answers.
- English currently overemphasises prose and supplementary literature while omitting much of reading, grammar, writing, poetry, extract, and comparative-answer preparation.
- Hindi Course B currently overemphasises selected literature while omitting much of unseen comprehension, grammar, creative writing, poetry, and complete prescribed-text coverage.
- Health and Physical Education is currently presented like a regular subject even though it should be classified as internal-assessment or supplementary content.
- Existing quiz-file count overstates assessment readiness because many questions lack explicit answer, explanation, topic, rubric, or board-question-type metadata.
- Optional subjects need a supported registration path without appearing active before official sources and validated content exist.

## 2. Product Outcome

After completing this programme, the platform will be able to answer the following questions truthfully:

1. Which official CBSE academic session and subject code does this content support?
2. Which units, chapters, topics, skills, maps, diagrams, experiments, books, and assessment domains are prescribed?
3. Which curriculum areas have notes, lessons, questions, reviewed answers, and full-paper practice?
4. Which question types and mark values are sufficiently represented?
5. Can the platform generate a valid, reproducible subject paper matching the official blueprint?
6. Is a chapter or subject actually board-ready, rather than merely present in the catalog?
7. Which platform content is extra, deleted, internal-only, project-only, inactive, or awaiting official verification?

The platform must display separate measures for curriculum coverage, notes coverage, question-bank coverage, reviewed-content coverage, and full board-paper readiness. It must never present a chapter as fully ready merely because a chapter pack and a small MCQ quiz exist.

## 3. Programme Decomposition

This is a multi-project programme. It will be implemented through one master roadmap and eight independently executable implementation plans:

1. Curriculum and exam-paper source of truth
2. Question-bank and assessment architecture
3. Mathematics remediation
4. Science remediation
5. Social Science remediation
6. English Language and Literature remediation
7. Hindi Course B remediation
8. Full-paper generation, evaluation, and release validation

Each plan must produce working, testable software or content independently. Subject remediation plans may depend on the curriculum and question-bank foundations, but Mathematics must not depend on English, Hindi, Science, or Social Science completion.

The current pilot-first roadmap remains valid. Board-readiness work must not falsely declare every chapter launch-ready, delay real-student feedback work unnecessarily, or introduce payments before the platform has demonstrated student value and been hardened.

## 4. Guiding Principles

### 4.1 Official sources are authoritative

Committed curriculum definitions must cite current official CBSE sources. Generated reports, chapter folders, quiz filenames, third-party websites, and model memory must not silently become curriculum truth.

### 4.2 Academic sessions are versioned

Every curriculum subject, exam profile, question source, and generated paper must identify an academic session such as `2025-26`. A new session must be registered and audited instead of overwriting the previous session's meaning.

### 4.3 Coverage and readiness are different

The system must distinguish at least:

- Curriculum coverage
- Notes coverage
- Lesson-wise coverage
- Question-bank coverage
- Required question-type coverage
- Reviewed-answer coverage
- Full-paper generation readiness
- Student-facing publication readiness

### 4.4 Subject rules are explicit

Generic chapter counts cannot represent English writing skills, Hindi grammar, Social Science map work, Science experiments, or Mathematics proofs. Each subject must have subject-specific readiness requirements.

### 4.5 Existing student flows continue during migration

Existing chapter pages, notes, quizzes, immutable attempts, mastery, revision missions, pilot tracking, and feedback must continue operating while structured board preparation is introduced.

### 4.6 Copyrighted papers are referenced, not republished wholesale

The repository may store official source metadata, curriculum mappings, short excerpts where legally appropriate, derived classifications, and original equivalent questions. It must not copy complete copyrighted board papers or marking schemes into the product as platform-owned content.

### 4.7 Human review remains necessary

Published questions and answers require subject review. Automatic AI grading of descriptive responses is not part of the first implementation because incorrect grading would damage student trust.

### 4.8 Optional subjects are inactive by default

Artificial Intelligence, Information Technology, and later optional subjects must use the same schemas, but remain hidden and excluded from readiness totals until their official sources, assessment profile, content, and reviewed questions pass activation gates.

## 5. Architecture Overview

The programme introduces four bounded layers:

```text
Official CBSE sources
        |
        v
Versioned curriculum registry
        |
        +--------------------+
        |                    |
        v                    v
Content coverage mapper   Exam profiles
        |                    |
        v                    v
Structured question bank -> Deterministic paper assembler
        |                    |
        +---------+----------+
                  |
                  v
Student practice, attempts, review, and readiness reporting
```

### 5.1 Curriculum registry

The registry defines what CBSE prescribes and how platform identifiers map to it.

### 5.2 Content coverage mapper

The mapper evaluates chapter packs, lesson files, quiz content, question-bank records, and publication states against the registry.

### 5.3 Structured question bank

The question bank stores validated, curriculum-mapped questions, answers, rubrics, assets, source metadata, and review status.

### 5.4 Assessment engine

The engine selects validated questions according to a subject exam profile, produces reproducible papers, records attempts, and supports objective scoring plus descriptive self-assessment or manual review.

## 6. Proposed File Boundaries

The implementation plans may adjust exact filenames after inspecting the current build boundaries, but they must preserve these responsibilities.

```text
apps/web/lib/curriculum/
├── types.ts
├── registry.ts
├── validation.ts
├── coverage.ts
└── subjects/
    └── class-10/
        ├── mathematics-standard.ts
        ├── mathematics-basic.ts
        ├── science.ts
        ├── social-science.ts
        ├── english-language-literature.ts
        ├── hindi-course-b.ts
        ├── health-and-physical-education.ts
        └── optional/
            ├── artificial-intelligence.ts
            └── information-technology.ts

apps/web/lib/question-bank/
├── types.ts
├── loader.ts
├── validation.ts
├── coverage.ts
├── paper-assembler.ts
├── scoring.ts
└── self-assessment.ts

apps/web/content/question-bank/class-10/
├── mathematics-standard/
├── mathematics-basic/
├── science/
├── social-science/
├── english-language-literature/
├── hindi-course-b/
└── optional/

apps/web/app/subjects/[subjectSlug]/board-preparation/
apps/web/app/subjects/[subjectSlug]/practice/[questionType]/
apps/web/app/subjects/[subjectSlug]/chapter-tests/[chapterSlug]/
apps/web/app/subjects/[subjectSlug]/mock-tests/
apps/web/app/board-papers/[paperId]/
apps/web/app/board-papers/[paperId]/attempts/[attemptId]/

docs/curriculum/
├── official-source-register.md
├── annual-refresh-runbook.md
├── content-authoring-guide.md
├── question-authoring-guide.md
└── subject-readiness/
```

No plan may place all curriculum, question-bank, validation, paper-generation, and UI responsibilities into `apps/web/lib/course-content.ts`. That file is already a central content catalog and should consume focused helpers rather than grow into the whole assessment system.

## 7. Curriculum Source of Truth

### 7.1 Core types

The implementation will define equivalent TypeScript interfaces with these required semantics:

```ts
type AssessmentMode = 'board' | 'internal' | 'optional-skill';

type CurriculumStatus = 'active' | 'future' | 'retired';

type CurriculumScope =
  | 'board-exam'
  | 'internal-only'
  | 'project-only'
  | 'periodic-only'
  | 'supporting-resource'
  | 'excluded';

type OfficialSourceType =
  | 'curriculum'
  | 'sample-paper'
  | 'marking-scheme'
  | 'question-paper'
  | 'prescribed-book'
  | 'map-list'
  | 'circular';

type OfficialSource = {
  id: string;
  sourceType: OfficialSourceType;
  title: string;
  academicSession: string;
  url: string;
  publishedBy: 'CBSE' | 'NCERT';
  verifiedOn: string;
  notes?: string;
};

type ExamSectionRule = {
  id: string;
  title: string;
  marks: number;
  allowedQuestionTypes: BoardQuestionType[];
  curriculumRefs?: string[];
  subsectionRules?: ExamSectionRule[];
};

type ExamProfile = {
  maximumMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  sectionRules: ExamSectionRule[];
  allowedMarkValues: number[];
  blueprintSourceIds: string[];
};

type CurriculumTopic = {
  id: string;
  title: string;
  scope: CurriculumScope;
  platformTopicSlugs: string[];
  requiredQuestionTypes: BoardQuestionType[];
  minimumReviewedQuestionCount: number;
};

type CurriculumChapter = {
  id: string;
  title: string;
  scope: CurriculumScope;
  platformChapterSlugs: string[];
  topics: CurriculumTopic[];
  requiredSkills?: string[];
  requiredAssets?: string[];
};

type CurriculumUnit = {
  id: string;
  title: string;
  marks?: number;
  chapters: CurriculumChapter[];
};

type PrescribedBook = {
  id: string;
  title: string;
  publisher: 'NCERT' | 'CBSE';
  role: 'primary' | 'supplementary' | 'workbook';
  sourceId: string;
};

type CurriculumSubject = {
  classLevel: 10;
  academicSession: string;
  subjectCode: string;
  slug: string;
  title: string;
  assessmentMode: AssessmentMode;
  status: CurriculumStatus;
  examProfile: ExamProfile | null;
  books: PrescribedBook[];
  units: CurriculumUnit[];
  officialSources: OfficialSource[];
};
```

### 7.2 Identity rules

- Every subject has a stable platform `slug` and official `subjectCode`.
- Mathematics Standard and Mathematics Basic are separate subjects for exam-profile purposes.
- Shared Mathematics concepts may reference the same platform chapter slugs.
- Social Science is one board subject with History, Geography, Political Science, and Economics as units or top-level sections.
- English poetry entries are first-class curriculum chapters or texts and must not be hidden as strings inside prose chapter metadata.
- Hindi prose, poetry, supplementary texts, grammar domains, unseen comprehension, and writing domains must all be addressable.
- Health and Physical Education uses `assessmentMode: 'internal'` and `examProfile: null` unless an official session-specific external paper is registered later.
- Future optional subjects use `assessmentMode: 'optional-skill'` and `status: 'future'`.

### 7.3 Validation rules

Curriculum validation must fail when:

- Subject code, slug, title, session, or official sources are absent.
- An active board subject has no exam profile.
- Exam-section marks do not total the maximum marks.
- A source URL is missing or does not identify a verification date.
- Unit, chapter, or topic identifiers are duplicated within a subject.
- A board-exam topic has no required question types.
- A platform chapter slug maps to contradictory active curriculum scopes in the same subject/session.
- A future subject is accidentally exposed as active.
- Mathematics Basic is treated as a difficulty flag on a Standard paper instead of a distinct exam profile.

### 7.4 Annual refresh

For each new academic session:

1. Register current official curriculum, sample paper, marking scheme, and prescribed-book sources.
2. Copy the previous subject definition into a new session-specific definition.
3. Compare units, topics, scope, marks, question types, duration, and internal choices.
4. Mark removed content as excluded for the new session without destroying historical mappings.
5. Regenerate the audit.
6. Resolve every curriculum difference before activating the session.
7. Record reviewer name or identifier and verification date.

## 8. Coverage and Readiness Model

### 8.1 Coverage dimensions

The audit must calculate separate percentages or counts:

```ts
type ReadinessDimension =
  | 'curriculum'
  | 'chapter-pack'
  | 'lesson-wise'
  | 'question-bank'
  | 'question-type'
  | 'reviewed-answer'
  | 'paper-generation'
  | 'student-publication';
```

### 8.2 Required report outputs

For every active subject, the audit must report:

- Official subject code and academic session
- Curriculum source verification date
- Examined units, chapters, topics, and skill domains
- Missing platform chapter mappings
- Platform content with no curriculum mapping
- Content mapped to excluded, internal-only, periodic-only, or project-only scope
- Chapter-pack availability
- Lesson-wise availability
- Reviewed question counts by topic, marks, and question type
- Required question types with insufficient coverage
- Questions with invalid or stale mappings
- Number of complete valid papers currently generatable
- Board-readiness blockers

### 8.3 Scoring rules

- `curriculum` reaches 100% only when every active examined curriculum item has a valid registry entry and source.
- `chapter-pack` reaches 100% only when every examined chapter or non-chapter domain has mapped instructional content.
- `lesson-wise` is reported independently and is not required for every chapter unless a subject readiness checklist demands it.
- `question-bank` depends on minimum reviewed-question counts, not raw files.
- `question-type` reaches 100% only when every required type is represented at its minimum reviewed count.
- `reviewed-answer` ignores draft questions.
- `paper-generation` reaches readiness only after at least three distinct valid seeds generate complete papers.
- `student-publication` requires routes, attempts, review screens, accessibility, responsive layout, and feature activation.

The first implementation plan must define explicit formulas so different contributors cannot invent incompatible readiness percentages.

## 9. Structured Question Bank

### 9.1 Question model

The structured bank must support at least:

```ts
type BoardQuestionType =
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

type QuestionDifficulty = 'foundation' | 'standard' | 'advanced';

type QuestionStatus = 'draft' | 'reviewed' | 'published' | 'retired';

type QuestionSource =
  | {
      kind: 'platform-authored';
      authoringVersion: string;
    }
  | {
      kind: 'official-derived';
      sourceId: string;
      year: number;
      subjectCode: string;
      paperSet?: string;
      derivationNote: string;
    };

type RubricPoint = {
  id: string;
  description: string;
  marks: number;
  acceptedAlternatives?: string[];
};

type MarkingRubric = {
  points: RubricPoint[];
  commonMistakes: string[];
  generalInstructions?: string[];
};

type QuestionAsset = {
  id: string;
  type: 'image' | 'diagram' | 'map' | 'table' | 'chart' | 'equation';
  path?: string;
  altText: string;
  studentInstructions?: string;
  expectedLabels?: string[];
};

type BoardQuestion = {
  id: string;
  classLevel: 10;
  academicSession: string;
  subjectCode: string;
  curriculumRefs: string[];
  chapterSlugs: string[];
  topicSlugs: string[];
  marks: 1 | 2 | 3 | 4 | 5 | 6;
  questionType: BoardQuestionType;
  difficulty: QuestionDifficulty;
  source: QuestionSource;
  prompt: string;
  options?: string[];
  correctOptionIndex?: number;
  modelAnswer: string;
  explanation: string;
  rubric: MarkingRubric;
  assets: QuestionAsset[];
  status: QuestionStatus;
  reviewer?: string;
  reviewedOn?: string;
};
```

Case-study, source-based, and extract-based containers may use a parent record with validated subquestions. The implementation plan must choose one normalized representation and ensure subquestion marks total the parent marks.

### 9.2 File storage

The first release remains file-based and version-controlled.

- Use focused files small enough for review.
- Group by subject and then unit or chapter.
- Do not create one enormous generated question file.
- Do not require a database migration for the initial question bank.
- Define a stable loader so storage may later move to an admin CMS or database without changing student routes.

### 9.3 Publishing validation

Validation must reject a published question when:

- It has no valid curriculum reference.
- It maps to excluded content.
- Its marks are not allowed by the exam profile.
- Rubric marks do not equal question marks.
- Model answer or student explanation is empty.
- An MCQ has fewer than two options or an invalid answer index.
- An assertion-reason question lacks a valid answer model.
- A case/source/extract question lacks subquestions.
- Subquestion marks do not equal the container marks.
- A diagram, map, chart, table, or picture question lacks accessible asset metadata.
- A map question references a location outside the session's official map list.
- An official-derived question lacks source year, code, source ID, and derivation note.
- Review metadata is absent.
- The same stable ID appears twice.

### 9.4 Existing quiz migration

The 89 existing quiz files remain operational during migration.

Migration must follow these rules:

- Do not bulk-convert unvalidated questions directly to `published`.
- Parse and report missing answers, explanations, topics, and invalid chapter mappings.
- Convert one subject or pilot chapter at a time.
- Mark converted records `draft` until answers and mappings are reviewed.
- Preserve existing quiz route behavior until a replacement chapter practice route is verified.
- Keep revealed attempts locked and retries immutable.
- Remove the legacy option-1 fallback only after all affected active quiz content has explicit answer keys and tests prove safe behavior.

## 10. Assessment Engine

### 10.1 Supported assessment products

The engine must support:

1. Chapter practice
2. Topic practice
3. Question-type practice
4. Chapter tests
5. Subject mock tests
6. Complete timed board papers

### 10.2 Paper assembly

Paper generation consumes:

- A curriculum subject
- Its exam profile
- Reviewed or published question records
- A deterministic seed
- Optional difficulty distribution
- Optional chapter or topic constraints for non-full-paper assessments

Paper generation produces:

```ts
type GeneratedPaper = {
  id: string;
  seed: string;
  academicSession: string;
  subjectCode: string;
  title: string;
  maximumMarks: number;
  durationMinutes: number;
  sections: GeneratedPaperSection[];
  questionIds: string[];
  validationSummary: PaperValidationSummary;
};
```

The same subject, session, profile version, bank version, and seed must produce the same ordered question IDs.

### 10.3 Selection constraints

The assembler must:

- Match every section's marks and permitted question types.
- Respect required subject subsections.
- Avoid duplicate question IDs.
- Avoid repeated equivalent variants within one paper.
- Respect internal choices defined by the exam profile.
- Meet difficulty targets without violating blueprint constraints.
- Exclude draft, retired, stale-session, invalid, or excluded-topic questions.
- Fail clearly when the bank cannot satisfy the blueprint.

It must not silently fill missing sections with the wrong question type or change total marks.

### 10.4 Attempts

Existing immutable-attempt principles extend to board assessments:

- Starting a retry creates a new attempt.
- Submitted objective answers are locked.
- Submitted descriptive responses remain visible for review but are not editable within that attempt.
- An incomplete timed attempt may save progress until submission or expiry.
- Submission stores the generated paper identity and ordered question IDs.
- Later question-bank edits must not change the historical paper viewed in a submitted attempt.

### 10.5 Scoring

Initial scoring supports:

- Automatic exact scoring for validated objective questions
- Step-wise student self-assessment for descriptive questions
- Manual reviewer status for descriptive answers
- Maximum-mark checks
- Per-topic and per-question-type summaries

AI-generated marks or unreviewed semantic grading are explicitly excluded from the first implementation.

## 11. Subject-Specific Designs

## 11.1 Mathematics

### Identities

- Mathematics Standard: subject code `041`
- Mathematics Basic: subject code `241`

They share curriculum concepts where official sources allow, but use separate exam profiles and question-bank eligibility rules.

### Implementation order

1. Register and validate Standard.
2. Build Standard question types and full papers.
3. Register Basic as a separate profile.
4. Reuse suitable reviewed questions only when their metadata explicitly permits both codes.
5. Add Basic-specific questions and validate complete Basic papers.

### Required question coverage

- MCQ
- Assertion-reason
- Very short answer
- Short answer
- Long answer
- Numerical and multi-step application
- Proof
- Construction where prescribed
- Graphical or geometric reasoning
- Case study

### Answer requirements

Rubrics must support:

- Formula or theorem selection
- Substitution
- Intermediate steps
- Correct units
- Diagram or construction marks where required
- Final result
- Accepted alternate method
- Common sign, factorisation, unit, or rounding mistakes

### Readiness gate

A Mathematics chapter cannot be board-ready with only notes and MCQs. It requires reviewed multi-mark questions and every required chapter-specific type. The subject requires at least three valid Standard papers before Basic paper activation begins.

## 11.2 Science

### Identity

- Science: subject code `086`

### Domain tagging

Every question must identify Biology, Chemistry, or Physics in addition to curriculum references.

### Required question coverage

- MCQ
- Assertion-reason
- Very short, short, and long answer
- Give-reason questions
- Numerical
- Experiment or activity
- Observation and inference
- Chemical equation
- Diagram
- Case study
- Integrated multi-concept question

### Chemistry requirements

- Final equations must be balanced.
- Formula capitalization and state symbols must be valid.
- Observation questions must identify expected colour, gas, precipitate, temperature, or state changes where relevant.
- Reaction classification and redox reasoning must match the equation.

### Physics requirements

- Formula, substitution, units, and final result must be separately markable.
- Circuit, ray, field, and optical diagrams require expected-label metadata.
- Numerical tolerances and accepted unit forms must be explicit.

### Biology requirements

- Diagrams require expected labels.
- Processes must preserve correct sequence.
- Genetics questions require accepted crosses, symbols, ratios, and reasoning.
- Health or reproduction answers must use age-appropriate, scientifically accurate terminology.

### Safety

Practical descriptions must distinguish textbook observations from safe student activities. Unsafe home experiments must not be suggested.

### Readiness gate

Each Science chapter requires reviewed questions from more than one question family. Science subject readiness requires balanced Biology, Chemistry, and Physics representation according to the official exam profile.

## 11.3 Social Science

### Identity

- Social Science: subject code `087`

### Subject organization

The student sees one Social Science board subject with four sections:

- History
- Geography
- Political Science
- Economics

The UI may filter sections, but progress and paper generation must remain under one subject code.

### Curriculum scope

Every chapter must be labelled:

- Board-exam
- Periodic-only
- Project-only
- Internal-only
- Supporting resource
- Excluded

Only board-exam content contributes to board-readiness and generated papers.

### Required question coverage

- MCQ
- Assertion-reason
- Very short, short, and long answer
- Source-based
- Case-study
- Picture or cartoon interpretation
- Data interpretation
- Map skill

### Map registry

The system must maintain a session-specific official map registry containing:

- Stable location ID
- Section and chapter mapping
- Official expected label
- Accepted spelling variants
- Feature type such as dam, airport, port, crop area, movement centre, power plant, or software park
- Official source ID
- Applicable academic session

Map questions must validate against this registry.

### Rubrics

Two-, three-, and five-mark answers use point-based rubrics. Rubrics must distinguish:

- Required number of valid arguments
- Examples
- Explanation or analysis
- Source interpretation
- Map location and label marks

### Readiness gate

A full Social Science paper must allocate 20 marks to each official section unless the registered session profile says otherwise. A subject is not ready without valid map practice and source-based practice.

## 11.4 English Language and Literature

### Identity

- English Language and Literature: subject code `184`

### Assessment domains

- Reading Skills: 20 marks
- Grammar and Creative Writing Skills: 20 marks
- Literature: 40 marks

These values are session-specific data in the exam profile, not permanent hard-coded assumptions.

### Reading

Support:

- Unseen factual passages
- Discursive passages
- Case-based factual passages
- Vocabulary in context
- Inference
- Evidence selection
- Data or visual interpretation when the blueprint requires it

Passages must be platform-authored or appropriately licensed. Each passage record needs word count, difficulty, question set, answer evidence, and explanation.

### Grammar

Register assessed grammar domains explicitly, including current session requirements such as:

- Tenses
- Modals
- Subject-verb agreement
- Reported speech
- Determiners
- Editing and error correction

The active list must come from the session curriculum.

### Creative writing

Support structured prompts and rubrics for:

- Formal letters
- Analytical paragraphs
- Any additional current-session formats

Rubrics must separate format, content, organization, accuracy, and expression according to the registered marking scheme.

### Literature

Register:

- First Flight prose
- First Flight poetry
- Footprints Without Feet supplementary reader
- Any assessed workbook role defined by official sources

Poems are first-class entries with:

- Poet
- Themes
- Stanza or extract practice
- Literary devices
- Tone and atmosphere
- Comparison mappings

### Required question coverage

- Prose extracts
- Poetry extracts
- Supplementary-reader extracts where applicable
- 40-50 word answers
- 100-120 word analytical answers
- Cross-text comparison
- Theme, character, tone, imagery, device, and evidence questions

### Readiness gate

English cannot be board-ready unless all three domains satisfy their marks and question-type requirements. Literature completeness alone cannot raise overall readiness above the Literature share of the exam profile.

## 11.5 Hindi Course B

### Identity

- Hindi Course B: subject code `085`

### Assessment domains

- अपठित बोध: 14 marks
- व्यावहारिक व्याकरण: 16 marks
- पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक: 28 marks
- रचनात्मक लेखन: 22 marks

These marks remain session-specific profile data.

### Unseen comprehension

Support current curriculum passage types with:

- Unicode Devanagari text
- Vocabulary and contextual meaning
- Inference
- Assertion-reason or objective items where prescribed
- Short descriptive responses
- Evidence-linked answers

### Grammar

Register current domains explicitly, including:

- पदबंध
- रचना के आधार पर वाक्य रूपांतरण
- समास
- मुहावरे

Additional domains may be activated only from official session sources.

### Creative writing

Support current formats such as:

- अनुच्छेद लेखन
- पत्र लेखन
- सूचना लेखन
- विज्ञापन लेखन
- ई-मेल or electronic-message tasks when prescribed

Rubrics must define format, content, language accuracy, organization, and word-limit expectations.

### Literature

Register complete assessed prose, poetry, and supplementary-reader content. Extract questions, short answers, and analytical responses require reviewed model answers and rubrics.

### Unicode and rendering

- Source content must be Unicode Devanagari.
- Legacy embedded-font glyph extraction from official PDFs must not be used as authored platform text.
- Tests must verify that representative Hindi strings survive loading and rendering without replacement characters, mojibake, or missing glyphs.
- Browser verification must cover desktop and mobile.

### Readiness gate

Hindi cannot be board-ready unless all four domains satisfy their marks and required question types.

## 11.6 Health and Physical Education

### Classification

- Use `assessmentMode: 'internal'`.
- Exclude it from the five-core-subject board-readiness average.
- Keep existing content available as supplementary learning material.
- Display an explicit Internal Assessment or Supplementary label.
- Do not generate an 80-mark board paper unless a future official session specifically introduces and registers one.

## 11.7 Optional Subjects

### Initially supported registrations

- Artificial Intelligence
- Information Technology

### Activation gate

An optional subject remains `future` and hidden until all are present:

- Official subject code
- Current official curriculum source
- Current official sample-paper or assessment blueprint
- Current prescribed units
- Valid exam profile
- At least one validated instructional content pack
- At least one reviewed assessment set
- Passing curriculum and question validation
- Explicit product activation

The schema must permit additional optional subjects without changes to the core types.

## 12. Student Experience

### 12.1 Routes

The target route family is:

```text
/subjects/[subjectSlug]/board-preparation
/subjects/[subjectSlug]/practice/[questionType]
/subjects/[subjectSlug]/chapter-tests/[chapterSlug]
/subjects/[subjectSlug]/mock-tests
/board-papers/[paperId]
/board-papers/[paperId]/attempts/[attemptId]
```

### 12.2 Board-preparation dashboard

For an active subject, show:

- Official title, code, session, marks, and duration
- Curriculum progress
- Notes progress
- Reviewed-question progress
- Required question-type progress
- Weak or missing areas
- Recommended next action
- Chapter tests
- Question-type practice
- Available mock papers
- Last official-source verification date

Readiness labels must explain what is missing. Avoid a single unexplained percentage.

### 12.3 Practice filters

Students may filter by:

- Unit
- Chapter
- Topic
- Marks
- Question type
- Difficulty
- Reviewed/published availability

Internal metadata such as reviewer identity need not be exposed.

### 12.4 Attempt experience

- Display section instructions and marks.
- Show accessible assets and alt text.
- Preserve timed progress.
- Warn before final submission.
- Lock submitted responses.
- Score objective questions.
- Present descriptive model answers only after submission.
- Let students mark rubric points they achieved.
- Save self-assessment separately from the original response.
- Offer a new immutable retry.

### 12.5 Weak-area reporting

Weakness reports must distinguish:

- Low score
- Unattempted curriculum area
- Missing platform question coverage
- Missing reviewed answer coverage

The system must not blame a student for an area the platform cannot yet assess.

## 13. Feature Flags and Rollout

Introduce board-preparation features behind a server-controlled or build-time feature flag consistent with current app conventions.

Rollout stages:

1. Developer-only validation and audit reports
2. Internal subject-review access
3. One subject pilot, beginning with Mathematics Standard
4. Small student board-preparation pilot
5. Additional subjects after subject-specific gates pass
6. Optional subjects only after activation gates pass

Existing chapter quiz routes remain accessible during stages 1-4.

## 14. Testing Strategy

Every implementation plan must use test-driven development.

### 14.1 Curriculum tests

- Valid subject fixtures load.
- Invalid source metadata fails.
- Section marks must total maximum marks.
- Duplicate identifiers fail.
- Active board subjects require exam profiles.
- Future optional subjects cannot appear active.
- Health and Physical Education is excluded from board-readiness aggregation.

### 14.2 Coverage tests

- Missing chapter mappings are reported.
- Extra platform chapters are reported.
- Excluded topics do not count toward readiness.
- A chapter pack plus five MCQs does not produce full readiness.
- Required question-type gaps lower the correct dimension only.
- Historical sessions remain queryable.

### 14.3 Question-bank tests

- Missing answers and explanations fail publication.
- Rubric totals must match marks.
- Invalid MCQ keys fail.
- Invalid curriculum references fail.
- Deleted-syllabus mappings fail.
- Case-study subquestion totals are enforced.
- Assets require alt text.
- Map locations require valid registry entries.
- Published questions require reviewer metadata.

### 14.4 Paper-generation tests

- Same seed produces same paper.
- Different valid seeds can produce different papers.
- Total marks are exact.
- Section marks are exact.
- Question types satisfy profile rules.
- No duplicate questions appear.
- Internal choices are valid.
- Insufficient banks fail with actionable diagnostics.
- Social Science section allocations pass.
- English and Hindi domain allocations pass.
- Mathematics Standard and Basic profiles never mix incorrectly.

### 14.5 Attempt tests

- Objective scoring is correct.
- Descriptive answers are not auto-awarded marks.
- Submission locks the attempt.
- Retry creates a new attempt.
- Historical paper content remains stable after bank changes.
- Self-assessment cannot mutate original responses.

### 14.6 Rendering and browser tests

- Hindi Unicode renders correctly.
- Diagrams, tables, pictures, and maps are accessible.
- Mobile layouts avoid clipping and overlap.
- Timers and autosave behave correctly.
- Logged-out access follows intended authentication rules.
- Feature-disabled routes do not appear in navigation.

## 15. Quality and Publishing Gates

### 15.1 Question gate

A question may become `published` only when:

- Curriculum mapping passes.
- Answer and explanation are present.
- Rubric is complete and totals correctly.
- Source attribution is complete.
- Assets and accessibility metadata are complete.
- Subject-specific validation passes.
- Reviewer and review date are present.

### 15.2 Chapter gate

A chapter may be labelled board-ready only when:

- Every board-exam topic is mapped.
- Required instructional content exists.
- Minimum reviewed-question counts pass.
- Required mark values and question types pass.
- Chapter test generation succeeds.
- Subject-specific assets or skills pass.

### 15.3 Subject gate

An active board subject may be labelled board-ready only when:

- All examined curriculum areas are mapped.
- No unresolved excluded-topic contamination exists.
- Required question types meet minimum reviewed counts.
- At least three complete papers generate from distinct seeds.
- One generated paper is manually compared with the official sample-paper blueprint.
- One generated paper receives documented subject review.
- Student attempt and review flows pass on desktop and mobile.
- Official sources are current for the active session.

## 16. Delivery Phases

### Phase 1: Curriculum foundation

- Implement schemas, registry, validation, source register, and coverage model.
- Register core subjects.
- Reclassify Health and Physical Education.
- Register inactive AI and Information Technology.
- Generate a baseline audit.

### Phase 2: Question-bank and assessment foundation

- Implement structured records, loaders, validation, coverage counts, deterministic assembly, objective scoring, descriptive self-assessment, and feature flags.

### Phase 3: Mathematics

- Complete Mathematics Standard first.
- Add reviewed chapter and full-paper coverage.
- Add Mathematics Basic as a separate exam profile and bank.

### Phase 4: Science

- Add domain-balanced questions, diagrams, experiments, observations, equations, and numericals.

### Phase 5: Social Science

- Unify section presentation, add scope labels, map registry, source/cartoon/data questions, and exact section allocation.

### Phase 6: English

- Add reading, grammar, writing, prose, poetry, supplementary reader, extract, comparison, and long-answer preparation.

### Phase 7: Hindi

- Add unseen comprehension, grammar, writing, complete literature, Devanagari validation, and domain-correct papers.

### Phase 8: Full-paper experience and release validation

- Complete subject dashboards, timed papers, attempts, review, readiness reports, cross-subject release checks, and annual-refresh documentation.

## 17. Documentation Deliverables

The planning and implementation programme must produce:

- This approved architecture specification
- One master roadmap
- Eight detailed implementation plans
- Official source register
- Annual curriculum refresh runbook
- Content-authoring guide
- Question and rubric authoring guide
- Subject-specific readiness checklists
- Release and board-paper verification checklist

Every detailed plan must provide:

- Exact files to create, modify, and test
- Interfaces consumed and produced
- Failing tests before implementation
- Complete code or content shapes for each step
- Exact verification commands and expected outcomes
- Acceptance criteria
- Scope boundaries
- Commit checkpoints
- Dependencies on earlier plans

## 18. Out of Scope

This programme does not include:

- AI grading of descriptive answers
- Payments or subscriptions
- Public leaderboards, coins, or competitive ranking
- A full admin CMS rewrite
- Mobile/offline application development
- Wholesale copying of official papers
- Activating optional subjects without official sources and reviewed content
- Converting all existing quiz files in one unreviewed batch
- Replacing the current pilot and feedback roadmap

## 19. Risks and Mitigations

### Curriculum drift

**Risk:** CBSE changes scope or blueprint each session.  
**Mitigation:** Session-versioned definitions, official-source register, annual comparison, and activation gates.

### False readiness

**Risk:** Raw content counts create inflated percentages.  
**Mitigation:** Separate dimensions and reviewed minimums.

### Question quality

**Risk:** Incorrect answers or rubrics damage trust.  
**Mitigation:** Validation plus mandatory subject review.

### Copyright

**Risk:** Official papers are reproduced beyond appropriate use.  
**Mitigation:** Store citations and derived metadata; author equivalent platform questions.

### Migration regressions

**Risk:** Structured bank work breaks current quizzes or attempts.  
**Mitigation:** Parallel migration, feature flags, immutable-attempt tests, and subject-by-subject activation.

### Scope explosion

**Risk:** Five subjects and optional subjects become one unmanageable implementation.  
**Mitigation:** Eight plans with independent acceptance and release gates.

### Hindi source corruption

**Risk:** Embedded-font extraction produces unreadable glyphs.  
**Mitigation:** Unicode-authored content and rendering tests.

### Insufficient bank for generation

**Risk:** Generator cannot satisfy a blueprint.  
**Mitigation:** Actionable deficit reports; never substitute incorrect types.

## 20. Acceptance Criteria for the Programme

The programme is complete only when:

- The five main board subjects have session-specific, official-source-backed curriculum definitions.
- Mathematics Standard and Basic have separate valid exam profiles.
- Health and Physical Education is classified and displayed as internal assessment.
- AI and Information Technology can be registered but remain inactive until their gates pass.
- Every active subject has a coverage and readiness report.
- The structured bank rejects missing answers, explanations, rubrics, mappings, review metadata, and invalid assets.
- Existing quiz and immutable-attempt flows remain functional during migration.
- Subject-specific readiness rules are enforced.
- At least three valid complete papers can be generated for every subject declared board-ready.
- Generated papers are reproducible by seed.
- Objective answers are scored accurately.
- Descriptive responses support model-answer and rubric-based self-review without unreviewed AI grading.
- English and Hindi readiness covers every assessment domain, not only literature.
- Social Science papers preserve the official section structure and map requirements.
- Science questions validate equations, numericals, experiments, and diagrams.
- Mathematics questions support step-wise marking and Standard/Basic separation.
- Student-facing board-preparation flows pass desktop and mobile verification.
- Annual curriculum refresh and source verification are documented.

## 21. Implementation-Planning Decision

The approved next action is to create:

1. A master remediation roadmap that defines dependencies, milestones, release gates, and recommended execution order.
2. Eight smaller-model-ready implementation plans matching the programme decomposition in Section 3.

The plans must be written before implementation begins. They must follow TDD, preserve existing pilot behaviour, and use frequent reviewable commits.
