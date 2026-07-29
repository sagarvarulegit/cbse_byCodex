---
type: QualityEvidence
title: Chemical Reactions and Equations Quality Evidence Index
description: Current evidence, open gates, and decision record for the Science Chapter 1 reference implementation.
tags: ['science', 'chapter-1', 'quality', 'evidence', 'reference-chapter']
timestamp: 2026-07-26T00:00:00Z
---

# Chemical Reactions and Equations Quality Evidence Index

## Decision

Current state: **Source-faithful; technical reference-chapter gates remain open.**

Science Chapter 1 is the platform's first gold-standard implementation. It is
not yet labelled `student-validated` or a closed `reference chapter`.

Student validation is deferred because suitable students are not currently
available. That constraint does not block the remaining browser,
accessibility, performance, or scripted learner-task work.

## Source identity

| Field | Evidence |
| --- | --- |
| Class and subject | CBSE Class 10 Science |
| Chapter | 1 - Chemical Reactions and Equations |
| Local source | `textbooks/science/extracted/jesc101.pdf` |
| Source edition | Reprint 2026-27 |
| Source length | 16 pages |
| Source visual review | Rendered page review completed; tracked in `source-fidelity-tracker.md` |

## Maintained artifacts

| Surface | Location | Role |
| --- | --- | --- |
| NCERT lesson sequence | `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md` through `06-ncert-exercises-and-revision.md` | Canonical textbook path |
| Board practice | `07-board-exam-practice.md`, `08-board-readiness-diagnostic.md` and `09-board-readiness-diagnostic-b.md` | Historical-paper practice plus two independent diagnostics |
| Constructed-response engine | `apps/web/lib/chapter-practice.ts`, `WrittenPracticeCard.tsx`, and `WrittenPracticeAttempt` | Private write-before-check attempts, rubric scores, retries, history, and remediation |
| Timed diagnostic engine | `apps/web/lib/exam-practice.ts` and `ExamPracticeCard.tsx` | Persistent writing/checking clocks, half-mark score recording, integrity classification, attempt history, and first-skill remediation |
| Equation workbench | `chemical-equation-balancing.ts` and `ChemicalEquationBalancer.tsx` | Four explicit atom-map equations, coefficient-only input, staged hints, independent mastery, and retention |
| Official marking-scheme alignment | CBSE Class X Science schemes, 2023-2026 | All nine published PYQ answer guides contain the official value points |
| Board evidence | `board-exam-evidence.md` in this directory | Verification ledger, archive limitations, and reuse rules |
| Quiz | `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md` | Representative assessment |
| Chapter pack | `chapter-pack.md` in this directory | One-page revision surface |
| Source tracker | `source-fidelity-tracker.md` in this directory | Textbook completeness and placement evidence |
| Fidelity contract | `apps/web/lib/chemical-reactions-content-fidelity.test.ts` | Regression protection for high-risk source mappings |
| Learner-task holdout | `learner-task-smoke-rubric.md` and `learner-holdout-integrity.test.ts` | Non-student transfer gate plus leakage protection |
| Student review guide | `docs/pilot-chapter-1-student-review.md` | Deferred real-student protocol |
| Shared workflow | `docs/content/gold-standard-chapter-workflow.md` | Copy-forward production process |
| Shared scorecard | `docs/content/gold-standard-chapter-scorecard-template.md` | Copy-forward evidence and closure template |
| Current handoff | `TODO.md` | Immediate next work |

## Evidence board

| Gate | Pass rule | Current evidence | Status |
| --- | --- | --- | --- |
| Source structure | Exact `1.1` through `1.3.2` order and hierarchy | Tracker plus focused Chapter 1 fidelity contract, passed 14/14 after current supplement changes | Pass |
| Activities | Activities 1.1-1.11 once each, in order, with source details | Tracker and lesson files | Pass |
| Figures | Figures 1.1-1.10 in order with source apparatus/captions | Tracker and accessible illustration registry | Pass |
| Equations | Correct mapping of source labels `(1.1)`-`(1.32)` | Exact number-to-equation contract | Pass |
| In-text questions | Exact wording and source placement for all three blocks | Tracker and lesson Q&A cards | Pass |
| End matter | What You Have Learnt, Exercises 1-20, and Group Activity | Lesson 5, Lesson 6, and tracker | Pass |
| Chapter pack | Revision content follows the source and does not expose internal notes | Chapter pack review and generation checks | Pass |
| Quiz integrity | Reviewed answer, explanation, difficulty, and lesson topic mapping | 20-question quiz across six canonical resources; focused pilot contract passed after replacing low-value numbering recall with an unseen corrosion application; validator previously reported 0 errors and 0 warnings | Pass |
| Board-question provenance | Every published PYQ matches a visually reviewed original paper page | Nine questions across 2023-2026 recorded in `board-exam-evidence.md` | Pass |
| Supplied extracted-bank coverage | Every one of the 23 user-supplied Chapter 1 bank demands has a teaching or assessment destination without weakening the PYQ provenance rule | Item-by-item Q1-Q23 matrix in `board-exam-evidence.md`; dark-container and non-metal-displacement gaps repaired as labelled board applications | Pass |
| Board-format coverage | Constructed answers, Assertion-Reason, case-based work, marking points, electrolysis ratios, unfamiliar redox agents and remediation are present | Lessons 7-9; every Chapter 1 or mixed-Chapter 1 demand in the official 2025-26 SQP maps to core teaching or one of five original scored pattern challenges | Pass |
| Written-attempt integrity | Student writes before seeing marking points; only structured scores leave the browser; retries, account reconciliation, and exact repairs remain available | Focused component/privacy/API contracts passed 5/5, including strict immutable idempotency conflict handling; all 14 definitions and every exact remediation anchor passed the focused registry contract 4/4 | Pending browser interaction rerun |
| Practice persistence schema | Immutable/idempotent structured attempts can be stored without raw answer text | Prisma model and migration are checked in; Prisma Client generation passed against the current schema | Pending target-environment migration |
| Independent transfer assessment | A second answer set checks the paper gaps without repeating Diagnostic A | Original 20-mark Diagnostic B with its own answer check and score profile | Pass |
| Timed diagnostic integrity | Refresh-safe writing/checking phases, honest condition recording, structured score, retry history, and valid first-skill repair | Both diagnostic markers use the reusable controller; imperfect conditions are retained as practice but excluded from retention; focused practice/registry/component contracts passed 6/6 | Pending browser interaction rerun |
| Retention truthfulness | D0, D3 and D7 require distinct eligible attempts at 80%; missed prerequisites stay locked; long account history preserves the original D0 | Mirrored API/browser retention contracts passed 9/9; API now derives checkpoints from complete item history rather than the five displayed attempts | Pass |
| Equation workbench integrity | Four source-reviewed equations, smallest ratios, live atom counts, keyboard inputs, no holdout leakage | Focused helper/component contracts passed 7/7; account retries reconcile by immutable client id and guided completion exposes exact repair | Pending browser interaction rerun |
| Cross-chapter reuse | A new chapter can register written practice, timed diagnostics and a balance workbench without Chapter 1 renderer/API branches | Focused second-chapter fixtures pass through all three validated registries; shared lesson marker renderer and progress API remain chapter-independent | Pass |
| Historical/current boundary | Historical papers do not silently define the current blueprint | Student disclaimer plus evidence and workflow rules | Pass |
| Student truthfulness | Fresh/signed-out state avoids fabricated mastery and rewards | Prior implementation and focused checks | Pass |
| Application checks | Web tests, type check, and production build complete | Current edited TypeScript surfaces pass focused syntax transpilation and the scoped diff passes whitespace verification; the prior cycle passed 143 web tests, TypeScript, and production build, but a full rerun is still required after the 2026-07-24 renderer changes and 2026-07-26 three-supplement wiring | Pending |
| Desktop journey | Overview, notes, six NCERT lessons, three supplements, and quiz have complete visual/interaction evidence | Representative core pages passed; supplements and complete recorded sweep remain | Partial |
| Mobile journey | All relevant routes pass at 390x844 and 320px | Representative 390px review passed; full 320px sweep remains | Partial |
| Keyboard and assistive technology | Navigation, answers, quiz, reflow, and reading order verified | Native details/summary, visible-on-focus bypass, semantic current lesson, non-chatty timer role, defined focus accent, and reduced-motion coverage; the focused lesson/timed-diagnostic accessibility contracts passed 2/2 and every CSS custom property resolves | Pending manual full-route evidence |
| Illustration payload | Every Chapter 1 illustration below 350 KiB and combined below 4 MiB | Eleven reviewed 1200×675 WebP variants total 284,702 bytes; focused figure/payload/native-loading contracts passed 4/4 | Pass |
| Performance | Median LCP below 2.5s and CLS below 0.1 using the fixed protocol | Reproducible measurement sheet still required after current UI changes | Pending |
| Learner-task smoke | Fixed rubric meets every conjunctive pass gate | Rubric is checked in; focused holdout-leakage contract passed 1/1 after the A4 replacement; administered execution remains | Ready to run |
| Real-student review | 2-5 intended students complete first-use review; at least two complete the post-study workbench/written/Diagnostic B check; one evidence-backed fix is rechecked | Two-stage privacy-safe protocol exists; students unavailable | Deferred |

## Holdout change record

- **2026-07-26:** Replaced balancing item A4
  `C₂H₆ + O₂ → CO₂ + H₂O` with the unseen propane equation
  `C₃H₈ + O₂ → CO₂ + H₂O`. The ethane equation had entered the
  current-SQP pattern practice, so it could no longer serve as holdout
  evidence. A focused Chapter 1 search found no occurrence of the replacement
  or the other fixed classification/explanation equations in lessons, quiz
  content, exercise answers, or the workbench.

## Remaining non-student work

Complete in this order:

1. Review the overview, notes, six NCERT lessons, three board supplements, and quiz at 320px.
2. Verify keyboard-only movement, answer reveals, quiz controls, focus states,
   200% reflow, reduced motion, and screen-reader reading order.
3. Confirm the WebP response paths, then record cold mobile image transfer,
   median LCP, and median CLS using the
   protocol in `TODO.md`.
4. Execute the fixed learner-task smoke without reopening notes.
5. Record failures against the exact concept and route, repair only the proven
   gap, and rerun the affected gate.
6. Update this index and the source tracker.

Automated checks remain paused unless the user requests them or a focused check
is essential for safe work.

## Deferred student work

When students become available:

1. Use `docs/pilot-chapter-1-student-review.md` unchanged for the first batch.
2. Use participant codes and collect no direct personal identifiers.
3. Observe before helping and record every hint.
4. Select one highest-friction problem supported by the batch evidence.
5. Implement and recheck that one problem.
6. Only then change the state from `technically pilot-ready` to
   `student-validated`.

## Reference-chapter close gate

The chapter becomes a closed reference chapter only when:

- every evidence-board row is `Pass`, except categories honestly marked `Not
  applicable`
- the student gate is no longer deferred
- the source tracker, this index, project memory, and backlog agree
- another contributor can follow the shared workflow without relying on hidden
  context

Until then, describe Chapter 1 as the **gold-standard implementation in
progress**, not as proven perfect.

## Evidence maintenance rule

Whenever a Chapter 1 change affects source content, figures, navigation,
assessment, progress truthfulness, or performance:

1. identify the evidence-board rows placed at risk
2. update the narrow source or regression contract when the risk is repeatable
3. rerun or defer the relevant gate explicitly
4. record the new result here

Do not preserve a `Pass` status solely because it passed before the affected
surface changed.
