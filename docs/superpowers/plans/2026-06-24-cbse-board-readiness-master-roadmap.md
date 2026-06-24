# CBSE Class 10 Board Readiness Master Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this roadmap plan-by-plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a source-backed, testable CBSE Class 10 board-preparation system for the five core subjects while preserving the current pilot, quiz, mastery, and feedback flows.

**Architecture:** Build the programme in dependency order: curriculum registry first, structured question bank second, subject remediation third, and timed full-paper delivery last. Keep curriculum truth, question content, paper assembly, attempt persistence, and student UI in separate modules with explicit interfaces.

**Tech Stack:** TypeScript, Next.js 15 App Router, React 19, Node test runner with `tsx`, Express 4, Prisma 6, PostgreSQL, file-backed curriculum/question records, PowerShell verification using `npm.cmd`.

## Global Constraints

- The active curriculum session is `2026-27`.
- Use official CBSE or NCERT URLs only in the authoritative source registry.
- The latest available `2025-26` sample papers and the 2026 board papers are historical comparison evidence until CBSE publishes the `2026-27` sample-paper set.
- Do not silently use a historical paper as the active `2026-27` blueprint.
- Preserve existing chapter pages, quizzes, immutable attempts, mastery, revision missions, pilot events, and feedback.
- Do not remove the legacy quiz fallback until active legacy quizzes have explicit validated answer keys.
- Do not add AI grading, payments, subscriptions, leaderboards, mobile/offline work, or a CMS rewrite.
- Do not reproduce complete copyrighted CBSE papers in the repository.
- Keep Health and Physical Education visible as internal-assessment content and exclude it from board-readiness averages.
- Keep Artificial Intelligence and Information Technology inactive until their activation gates pass.
- Use TDD for every implementation task.
- Use `npm.cmd` rather than `npm` in PowerShell.
- Run `graphify update .` after modifying source files.
- Update `docs/project-memory.md` when implementation discovers a durable architecture, curriculum, or deployment rule.

---

## Programme Documents

Implement the plans in this order:

1. `docs/superpowers/plans/2026-06-24-cbse-curriculum-source-of-truth.md`
2. `docs/superpowers/plans/2026-06-24-cbse-question-bank-assessment-architecture.md`
3. `docs/superpowers/plans/2026-06-24-cbse-mathematics-remediation.md`
4. `docs/superpowers/plans/2026-06-24-cbse-science-remediation.md`
5. `docs/superpowers/plans/2026-06-24-cbse-social-science-remediation.md`
6. `docs/superpowers/plans/2026-06-24-cbse-english-remediation.md`
7. `docs/superpowers/plans/2026-06-24-cbse-hindi-course-b-remediation.md`
8. `docs/superpowers/plans/2026-06-24-cbse-full-paper-release-validation.md`

The approved design is:

`docs/superpowers/specs/2026-06-24-cbse-board-readiness-remediation-design.md`

## Dependency Graph

```text
Plan 1: Curriculum source of truth
        |
        v
Plan 2: Question bank + assessment primitives
        |
        +-------------------------+-----------------------+
        |                         |                       |
        v                         v                       v
Plan 3: Mathematics       Plan 4: Science       Plan 5: Social Science
        |                         |                       |
        +-------------------------+-----------------------+
                                  |
                         +--------+--------+
                         |                 |
                         v                 v
                 Plan 6: English    Plan 7: Hindi B
                         |                 |
                         +--------+--------+
                                  |
                                  v
                    Plan 8: Full papers + release
```

Mathematics, Science, and Social Science may execute in parallel after Plans 1 and 2 pass. English and Hindi may also execute in parallel after Plans 1 and 2, but the recommended sequence delays them until the first three subject patterns prove the shared interfaces.

## Source Baseline

The authoritative initial source register must include:

| Source ID | Purpose | URL |
| --- | --- | --- |
| `cbse-curriculum-index-2026-27` | Current curriculum index | `https://cbseacademic.nic.in/curriculum_2027.html` |
| `cbse-mathematics-041-2026-27` | Mathematics Class X curriculum and question-paper design | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf` |
| `cbse-science-086-2026-27` | Science Class X curriculum and unit weights | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf` |
| `cbse-social-science-087-2026-27` | Social Science curriculum, map list, and section weights | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/SocialScience_SecP1X_2026-27.pdf` |
| `cbse-english-184-2026-27` | English Language and Literature domains and prescribed texts | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/English_LL_SecP1_2026-27.pdf` |
| `cbse-hindi-b-085-2026-27` | Hindi Course B domains, grammar, writing, and prescribed books | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Hindi_B_SecP1_2026-27.pdf` |
| `cbse-hpe-2026-27` | Internal-assessment HPE curriculum | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/HPE_SecP1_2026-27.pdf` |
| `cbse-it-402-2026-27` | Future Information Technology Class X curriculum | `https://cbseacademic.nic.in/web_material/Curriculum27/sec/402-IT-X.pdf` |
| `cbse-sqp-index-2025-26` | Latest published sample-paper index at planning time | `https://cbseacademic.nic.in/SQP_CLASSX_2025-26.html` |
| `cbse-board-papers-2026` | Actual 2026 question-paper archive | `https://www.cbse.gov.in/cbsenew/question-paper.html` |

Artificial Intelligence remains future/inactive until the implementer confirms and records the official Class X `2026-27` curriculum URL. Do not guess the URL in production data.

## Milestone 1: Curriculum Truth

**Exit conditions:**

- [ ] Shared curriculum types compile.
- [ ] Official source records validate.
- [ ] `2026-27` is the active session.
- [ ] Historical `2025-26` evidence is distinguishable from current sources.
- [ ] The five core board subjects are registered.
- [ ] Mathematics Standard `041` and Basic `241` are separate profiles.
- [ ] HPE is registered as `internal`.
- [ ] AI and IT are hidden `future` subjects.
- [ ] A baseline coverage report identifies missing, extra, excluded, internal-only, and project-only content.
- [ ] Subject routes no longer depend on a hard-coded valid-slug array.

**Release decision:** Developer-only. No student board-preparation navigation yet.

## Milestone 2: Question-Bank Foundation

**Exit conditions:**

- [ ] Structured question types compile.
- [ ] Loader finds file-backed records deterministically.
- [ ] Publication validation rejects missing answers, explanations, rubrics, review metadata, mappings, and accessible assets.
- [ ] Case/source/extract containers validate subquestion totals.
- [ ] Same seed produces the same selected question IDs.
- [ ] Objective scoring is exact.
- [ ] Descriptive responses receive zero automatic marks.
- [ ] Feature flag defaults to disabled.
- [ ] Existing `/chapters/[slug]/quiz` behavior remains unchanged.

**Release decision:** Internal developer tooling only.

## Milestone 3: Mathematics Standard Pilot

**Exit conditions:**

- [ ] Mathematics Standard `041` has all seven units and fourteen chapter mappings.
- [ ] Unit weights total 80.
- [ ] Every chapter has reviewed 1-, 2-, 3-, and 5-mark coverage where applicable.
- [ ] Required proof, numerical, graphical, construction, and case-study families are represented.
- [ ] Three distinct seeds generate valid 80-mark Standard papers.
- [ ] One generated paper is manually compared with the latest official sample-paper design.
- [ ] Mathematics Basic remains separate and cannot consume Standard-only questions.

**Release decision:** First internal subject-review pilot.

## Milestone 4: Science and Social Science

**Science exit conditions:**

- [ ] Unit weights are `25/25/12/13/5`.
- [ ] Biology, Chemistry, and Physics tags are complete.
- [ ] Equation, experiment, observation, diagram, and numerical validation passes.
- [ ] Formative-only topics do not contaminate summative readiness.
- [ ] Three valid papers generate.

**Social Science exit conditions:**

- [ ] History, Geography, Political Science, and Economics remain one subject.
- [ ] Each section contributes 20 marks.
- [ ] Map registry matches the current official list.
- [ ] Project-only and limited-assessment subtopics are scoped correctly.
- [ ] Source, cartoon, data, and map questions are represented.
- [ ] Three valid papers generate.

**Release decision:** Internal subject review; no public flag activation.

## Milestone 5: English and Hindi Completeness

**English exit conditions:**

- [ ] Reading 20, Grammar/Writing 20, Literature 40.
- [ ] All nine prose texts, ten poems, and nine supplementary texts are first-class entries.
- [ ] Reading passages, grammar, letters, analytical paragraphs, extracts, short answers, and long answers are represented.
- [ ] Three valid papers generate.

**Hindi exit conditions:**

- [ ] अपठित बोध 14, व्यावहारिक व्याकरण 16, साहित्य 28, रचनात्मक लेखन 22.
- [ ] Current grammar domains and writing formats are registered.
- [ ] Excluded texts do not contribute to readiness.
- [ ] Unicode Devanagari rendering passes.
- [ ] Three valid papers generate.

**Release decision:** Internal subject review.

## Milestone 6: Student Board-Preparation Pilot

**Exit conditions:**

- [ ] Board-preparation dashboard is feature-gated.
- [ ] Practice filters work by unit, chapter, topic, marks, type, and difficulty.
- [ ] Timed attempts autosave.
- [ ] Submission locks answers.
- [ ] Retry creates a new immutable attempt.
- [ ] Historical generated papers remain stable after question-bank edits.
- [ ] Objective score and descriptive self-assessment remain separate.
- [ ] Weak-area reporting distinguishes student weakness from missing platform coverage.
- [ ] Desktop and mobile browser checks pass.

**Release decision:** Enable Mathematics Standard for a small known-student pilot only.

## Milestone 7: Board-Ready Subject Gate

A subject can display `Board ready` only when all are true:

- [ ] Current official curriculum sources are verified.
- [ ] Required curriculum mappings are complete.
- [ ] No unresolved excluded-topic contamination exists.
- [ ] Required question types meet minimum reviewed counts.
- [ ] Three full papers generate from distinct seeds.
- [ ] One generated paper passes blueprint comparison.
- [ ] One generated paper has documented subject-expert review.
- [ ] Student attempt and review flows pass.
- [ ] Accessibility checks pass.
- [ ] Production smoke evidence is recorded.

## Cross-Plan Interface Contract

All plans must use these names exactly:

```ts
getActiveCurriculumSession(): string
getCurriculumSubject(subjectSlug: string, academicSession?: string): CurriculumSubject | null
getVisibleCurriculumSubjects(academicSession?: string): CurriculumSubject[]
resolveCurriculumSubjectSlug(routeSlug: string): string
validateCurriculumSubject(subject: CurriculumSubject): CurriculumValidationIssue[]
buildSubjectCoverage(subject: CurriculumSubject, evidence: CoverageEvidence): SubjectCoverageReport

loadQuestionBank(query: QuestionBankQuery): Promise<BoardQuestion[]>
validateBoardQuestion(question: BoardQuestion, context: QuestionValidationContext): QuestionValidationIssue[]
assemblePaper(input: AssemblePaperInput): GeneratedPaper
scoreObjectiveResponses(paper: GeneratedPaper, responses: BoardResponse[]): ObjectiveScoreResult
```

If implementation discovers one of these signatures is insufficient, update Plan 1 or Plan 2 and all dependent plans in the same documentation commit before changing code.

## Required Verification after Every Plan

Run:

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run test -w apps/api
npm.cmd run lint -w apps/api
git diff --check
git status --short
```

Run `npm.cmd run build -w apps/web` whenever a plan changes routes, components, Next.js data loading, or file tracing.

Run `npm.cmd run build -w apps/api` whenever a plan changes Prisma models, API routes, API payloads, or persistence helpers.

Run:

```powershell
graphify update .
```

after source-code changes and review generated drift before staging.

## Commit Strategy

Use one focused commit per independently reviewable task. Recommended prefixes:

```text
Add curriculum registry types
Register CBSE 2026-27 sources
Add structured question validation
Add deterministic paper assembly
Register Mathematics Standard curriculum
Add Science assessment validation
Unify Social Science board sections
Add English assessment domains
Add Hindi Course B assessment domains
Add immutable board paper attempts
Add board preparation dashboard
Document annual curriculum refresh
```

Do not combine broad content authoring for multiple subjects into one commit.

## Programme Completion Verification

Run:

```powershell
npm.cmd run test -w apps/web
npm.cmd run test -w apps/api
npm.cmd run lint
npm.cmd run build
graphify update .
git diff --check
git status --short --branch
```

Then execute the browser and production checks defined in Plan 8. A green unit-test run without generated-paper, Unicode, map, responsive, and authenticated attempt evidence is not programme completion.
