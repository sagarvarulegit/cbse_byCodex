---
type: QualityEvidenceTemplate
title: Gold-Standard Chapter Scorecard Template
description: Copy-forward evidence scorecard for textbook fidelity, assessment, learning UX, retention, and student validation.
tags: ['content', 'quality', 'template', 'reference-chapter']
timestamp: 2026-07-26T00:00:00Z
---

# Gold-Standard Chapter Scorecard Template

Copy this file into the new chapter's evidence directory. Replace every
placeholder with a route, artifact, measurement, or honest open status. Do not
copy Science Chapter 1's counts, equations, skills, or lesson allocation.

## Identity

| Field | Record |
| --- | --- |
| Class / subject | `<class and subject>` |
| Textbook chapter | `<number and exact title>` |
| Current textbook PDF | `<path>` |
| Edition / session | `<edition>` |
| Official curriculum source | `<URL and verification date>` |
| Latest official SQP checked | `<URL, session, and verification date>` |
| Canonical student route | `<route>` |
| Evidence owner / date | `<reviewer code and date>` |

## Status decision

Current state: `<Draft / Source-faithful / Technically pilot-ready /
Student-validated / Reference chapter>`.

Reason: `<one evidence-based paragraph>`.

## Evidence gates

| Gate | Pass rule | Evidence | Status |
| --- | --- | --- | --- |
| Source structure | Every parent/child heading is in exact order and numbering | `<tracker rows/routes>` | `<status>` |
| Activities / worked examples | Every source item appears once with quantities, steps, observations, and safety | `<tracker rows/routes>` | `<status or N/A>` |
| Figures / tables | Source relationship is preserved and labels are accessible | `<routes/assets>` | `<status or N/A>` |
| Equations / formulae | Every numbered item maps to the correct content | `<focused contract>` | `<status or N/A>` |
| In-text questions | Exact wording and textbook placement | `<routes/tracker>` | `<status>` |
| End matter | Summary, exercises, projects/group work are accounted for | `<route/tracker>` | `<status>` |
| Chapter pack | Revision surface remains secondary and source-aligned | `<artifact>` | `<status>` |
| Quiz integrity | Intentional coverage, reviewed answers/explanations, valid topics | `<validator/result>` | `<status>` |
| Board provenance | Every quoted PYQ is visually verified and traceable | `<ledger>` | `<status or N/A>` |
| Current SQP transfer | Current official demand shapes have original transfer practice | `<source + item ids>` | `<status or N/A>` |
| Written response | Write-before-check, rubric score, immutable retry/history | `<item ids/routes>` | `<status>` |
| Remediation | Every weak skill resolves to an exact lesson anchor | `<registry contract>` | `<status>` |
| Retention | D0/D3/D7 require separate on-time qualifying attempts | `<attempt evidence>` | `<status>` |
| Progress truthfulness | Fresh/signed-out state shows no fabricated completion | `<route/evidence>` | `<status>` |
| Desktop | Complete route sweep with interaction and console evidence | `<sheet>` | `<status>` |
| Mobile | 390x844 and 320px reflow, controls, figures, and equations | `<sheet>` | `<status>` |
| Accessibility | Keyboard, focus, reading order, zoom, reduced motion | `<sheet>` | `<status>` |
| Performance | Median LCP/CLS and transferred image bytes meet limits | `<measurement sheet>` | `<status>` |
| Learner-task smoke | Fixed holdout meets every conjunctive gate | `<attempt sheet>` | `<status>` |
| Real-student review | 2-5 intended students and one rechecked evidence-backed fix | `<review batch>` | `<status>` |
| Reuse proof | A second chapter registers its content without renderer/API branching | `<contract or implementation>` | `<status>` |

Use only `Pass`, `Partial`, `Pending`, `Deferred`, `Blocked`, or `Not
applicable`. A prior pass becomes `Pending` when a later change places that
surface at risk.

## Practice pack

Create one data pack with:

- a globally unique item id for every written task
- the chapter slug and exact live lesson slug
- a minimum genuine-attempt length
- integer half-mark rubric points
- one stable skill slug per marking point
- one exact lesson anchor for every possible weak skill
- explicit labels separating textbook questions, verified PYQs, and original
  platform transfer questions

The shared renderer, progress API, retry history, privacy boundary, and
retention engine must not require a chapter-specific branch. Raw typed answers
remain in browser memory.

## Assessment and holdout separation

| Set | Purpose | May appear in teaching? | Evidence |
| --- | --- | --- | --- |
| Lesson practice | Guided acquisition and immediate feedback | Yes | `<items>` |
| Quiz | Representative retrieval/application | Concepts yes; exact answers no | `<items>` |
| Board practice | Response format and current demand shapes | Yes, clearly labelled | `<items>` |
| Diagnostic A | Timed readiness | No before attempt | `<items>` |
| Diagnostic B | Independent transfer | No before attempt | `<items>` |
| Learner-task holdout | Fixed non-student transfer gate | Never | `<rubric>` |

If an item leaks from the holdout into teaching, replace it in the holdout and
record the change. Do not weaken the pass threshold.

For each timed diagnostic, record the writing and checking deadlines, score,
first weak skill, and whether every declared exam condition was met. Preserve
imperfect-condition records as practice, but mark them ineligible for retention
instead of discarding or upgrading them.

## Retention evidence

| Checkpoint | Due rule | Completion rule | Attempt evidence |
| --- | --- | --- | --- |
| D0 | First qualifying attempt | At least 80% | `<attempt>` |
| D3 | 3 days after D0 | Separate attempt at least 80% on/after due date | `<attempt>` |
| D7 | 7 days after D0 | Another separate attempt at least 80% on/after due date | `<attempt>` |

Waiting never completes a checkpoint. One overdue retry cannot complete both
D3 and D7. Retention evidence does not automatically change a separate mastery
score.

## Closure decision

The chapter may be called a reference chapter only when:

1. every applicable evidence gate is `Pass`;
2. the real-student row is not deferred;
3. the highest-friction student finding has one implemented and rechecked fix;
4. the source tracker, this scorecard, project memory, and backlog agree; and
5. another contributor can register a second chapter pack without changing the
   shared lesson renderer or progress API.

Until then, name the exact achieved state and the next open gate.
