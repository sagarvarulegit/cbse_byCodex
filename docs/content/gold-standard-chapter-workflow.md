---
type: ContentWorkflow
title: Gold-Standard Chapter Workflow
description: Evidence-based process for producing textbook-faithful, teachable, testable, and reusable CBSE platform chapters.
tags: ['content', 'workflow', 'quality', 'textbook-fidelity', 'chapter-model']
timestamp: 2026-07-24T00:00:00Z
---

# Gold-Standard Chapter Workflow

## Purpose

This is the copy-forward process for every platform chapter. Science Chapter 1,
*Chemical Reactions and Equations*, is the first reference implementation.

The purpose is not to make every chapter look identical. It is to make every
chapter satisfy the same trust, learning, assessment, accessibility, and
evidence standards while preserving the structure of its own textbook.

Use this document with:

- `NOTES_GUIDELINES_STANDARDS.md` for authoring and rendering rules
- `docs/content-style-qa-checklist.md` for lesson readability
- the chapter's source-fidelity tracker for source-specific evidence
- `docs/project-memory.md` for routing to the relevant durable decision and gotcha log
- `docs/content/gold-standard-chapter-scorecard-template.md` for the
  copy-forward closure record

## Quality states

Use these terms precisely:

| State | Meaning | Evidence required |
| --- | --- | --- |
| Draft | Content exists but has not been mapped fully to the textbook. | None beyond an identified source |
| Source-faithful | Structure and required source elements have been checked against the textbook. | Completed source map and tracker |
| Technically pilot-ready | Source-faithful content works across the platform and passes the non-student gates. | Automated, browser, accessibility, performance, and scripted learner-task evidence |
| Student-validated | Intended students have used the chapter and the highest-friction problem has been addressed. | Recorded student sessions and a verified follow-up fix |
| Reference chapter | Student-validated chapter whose process and evidence are complete enough to copy. | All prior states plus a closed evidence index |

Never use automated checks as a substitute for textbook review. Never use an
adult reviewer or scripted learner task as a substitute for real students.

## Source hierarchy

When sources disagree, use this order:

1. The current local NCERT textbook PDF for content, numbering, order,
   activities, examples, figures, questions, exercises, and wording.
2. Current official CBSE curriculum records for inclusion, exclusion, and
   session scope.
3. Repository standards for platform presentation and pedagogy.
4. Chapter-specific source tracker and project memory.
5. Existing platform lessons and chapter packs.

Existing notes are comparison material, not authority.

## Required chapter evidence set

Every gold-standard chapter keeps these maintained artifacts:

| Artifact | Purpose |
| --- | --- |
| Textbook PDF | Primary content authority |
| Textbook map | Page-by-page allocation of sections and required elements |
| Source-fidelity tracker | One row per numbered section, activity, figure, equation/example, question block, and end matter |
| Lesson markdown | Canonical teaching path |
| Chapter pack | Secondary revision surface, never a substitute for lessons |
| Quiz | Representative retrieval and application check with valid answers, explanations, and topic mappings |
| Fidelity contract | Focused regression checks for known high-risk mappings |
| Learner-task smoke rubric | Holdout tasks that test transfer without reopening notes |
| Student review guide | Real-student observation protocol and privacy rules |
| Quality evidence index | Current status, evidence location, open risks, and next gate |
| Copy-forward scorecard | Reusable closure record for another chapter |

If the textbook does not contain a category, record it as `Not applicable`
instead of silently omitting it.

## End-to-end workflow

### Stage 0 - Establish scope and preserve the worktree

1. Confirm class, subject, chapter, session, and exact textbook PDF.
2. Inspect the current working tree and preserve unrelated work.
3. Read the architecture, project memory, notes standards, current handoff, and
   existing chapter evidence.
4. Identify all platform surfaces that consume the chapter:
   catalog metadata, lesson files, chapter pack, generated content, quiz,
   figures, routes, progress, and review surfaces.
5. Record constraints before editing, including stable lesson slugs and any
   saved-link or progress-data compatibility.

Exit gate: source and affected surfaces are known; no content has been changed
from memory alone.

### Stage 1 - Render and inspect the textbook

1. Read PDF metadata and confirm edition/session and page count.
2. Render every page to images.
3. Inspect page layout visually, including figures, tables, boxes, multi-column
   reading order, labels, captions, safety notes, and question placement.
4. Use text extraction only as a search aid; treat visual pages as authoritative
   when the text layer is broken or ambiguous.
5. Keep rendered pages temporary and out of version control.

Exit gate: every source page has been visually reviewable.

### Stage 2 - Build the textbook map

Record, in exact order:

- opening context
- every parent and child heading with its textbook number
- every activity and its apparatus, quantities, procedure, observations,
  safety notes, and prompts
- every figure and its number, caption, labels, and relationship to an activity
- every numbered equation, formula, example, theorem, table, or derivation
- every in-text Questions block in its exact location
- every special box, recall prompt, summary, exercise, and group activity

Map each source item to exactly one primary student destination. Supporting
repetition is allowed, but the primary destination prevents omissions and
accidental duplication.

Exit gate: the tracker accounts for the entire textbook chapter, not only its
main headings.

### Stage 3 - Design the learning path

1. Keep the textbook's teaching order.
2. Split lessons at natural concept boundaries without inventing textbook
   section numbers.
3. Preserve stable slugs where changing them would break links, progress, or
   weak-topic recovery.
4. Put the first useful concept within a reasonable mobile reading distance.
5. Treat the lesson sequence as canonical and the chapter pack as revision.
6. Estimate time from reading, activity interpretation, worked examples,
   practice, and recap rather than word count alone.

Each lesson should normally contain:

- a plain-language hook or purpose without a standalone learning-goals checklist
- exact numbered textbook sections in order
- source activities, figures, examples, questions, and prompts at their source
  positions
- short explanations that preserve the textbook's reasoning
- one immediate example after each major concept
- common mistakes and how to correct them
- board-answer guidance without paper predictions
- quick practice with a try-first answer reveal
- one-minute revision and a recap that adds no new facts

Exit gate: a low-confidence student has one clear next action throughout the
chapter.

### Stage 4 - Author with source and platform additions separated

Textbook material must remain exact where exactness matters:

- numbering and hierarchy
- question wording
- equations, formulae, states, conditions, units, and named substances
- activity quantities, apparatus, safety, and observations
- figure numbers, labels, and captions
- exercise numbering and intent

Platform additions may simplify and support, but must be identifiable as tips,
memory lines, worked help, practice, revision, or recap. They must not appear to
be copied textbook statements.

For each explanation, ask:

1. Is it supported by the chapter or necessary prior knowledge?
2. Does it preserve the scientific or mathematical reason?
3. Could a student form a wrong rule from this simplification?
4. Does the nearby example demonstrate the idea?
5. Is the answer sufficient for the question actually asked?

Exit gate: the chapter is simplified, not compressed into misleading shortcuts.

### Stage 5 - Build accessible source-faithful visuals

1. Redraw or reconstruct figures; do not paste textbook scans into the product.
2. Preserve the textbook composition, apparatus, direction, relative placement,
   and observation.
3. Keep important labels, captions, safety notes, and observations in accessible
   HTML.
4. Prefer numbered pins on the image with a matching label key.
5. Check pin positions at desktop, 390px, and 320px widths.
6. Optimise delivery and record transferred bytes, not only source-file sizes.
7. Call a visual an animation only when it actually moves.

Exit gate: the figure teaches the same relationship as the textbook and remains
understandable without relying on tiny baked-in text.

### Stage 6 - Design assessment as a coverage system

The quiz is not a random sample of easy facts. Build a coverage matrix across:

- every major concept and lesson slug
- definitions and recognition
- observations and interpretation
- balancing/calculation or procedural application where relevant
- comparison and classification
- common misconceptions
- textbook examples, questions, and exercise anchors

Every quiz item needs:

- one unambiguous prompt
- plausible options
- a reviewed answer
- a teaching explanation
- a valid topic mapping
- a source anchor or clearly marked platform-practice rationale
- varied answer positions and an intentional difficulty distribution

Keep some transfer tasks out of lessons, exercises, quiz explanations, and
interactive tools. These become the learner-task holdout set.

When historical board papers are available, build a separate board-evidence
layer after textbook fidelity is stable:

1. Use extracted datasets only to discover candidates.
2. Render and visually check the original paper page before quoting a question.
3. Record year, paper code, question number and printed page.
4. Keep verified PYQs separate from original board-style practice.
5. Label platform scoring points honestly; do not call them official marking
   schemes without the official scheme.
6. Cover constructed responses, Assertion-Reason and case-based formats when
   the evidence supports them.
7. Keep historical evidence separate from the active curriculum and blueprint.
8. Preserve a holdout set that does not leak into the new practice surfaces.

Exit gate: assessment coverage is intentional and does not reward memorising
option position or copied answers. Quoted historical questions are traceable to
visually checked source pages.

For constructed responses, register chapter content as data rather than adding
renderer or API branches. Each marking point uses an integer half-mark weight
and a stable skill slug. Every possible weak skill must resolve to an exact live
lesson anchor. Keep typed answer text in browser memory; persist only structured
scores and attempt evidence. D0/D3/D7 completion requires separate qualifying
attempts on or after the due dates.

### Stage 7 - Wire all student surfaces together

Review the complete path:

1. subject page
2. chapter overview
3. first lesson action
4. lesson navigation
5. practice target
6. answer reveal
7. previous/next movement
8. chapter revision sheet
9. quiz attempt, feedback, history, and retry
10. completion and feedback controls

Fresh or signed-out students must never inherit fabricated mastery, completed
progress, or unlocked rewards from catalog display values.

Exit gate: content is reachable and truthful, not merely present in files.

### Stage 8 - Verify in layers

Use the narrowest check that proves each risk, then complete the full gate when
verification is authorised.

| Layer | What it proves |
| --- | --- |
| Source tracker review | Textbook coverage and placement |
| Focused fidelity contract | Known numbering, mapping, and omission risks |
| Quiz validation | Parseable metadata and answer/topic integrity |
| Content generation | Chapter pack and generated surface consistency |
| Type and production checks | Application integrity |
| Desktop browser review | Layout, hierarchy, navigation, and console health |
| Mobile browser review | Reflow, targets, image labels, equations, and bottom controls |
| Keyboard/screen-reader review | Operability and meaningful reading order |
| Performance review | Image transfer, LCP, CLS, and loading behaviour |
| Learner-task smoke | Independent transfer after a learning pass |

A `Pass` row must identify the route or artifact and the evidence. If a gate
cannot run, mark it `Deferred` or `Blocked`; never convert missing evidence into
a pass.

Exit gate: all non-student evidence is closed or honestly recorded.

### Stage 9 - Review with intended students

Use 2-5 students from the intended learner group when available. Record
participant codes, not identifying information. Observe behaviour and
comprehension without coaching, then select the single highest-friction problem
supported by repeated evidence.

Implement and recheck that fix before widening access.

Exit gate: the chapter may be called student-validated only after this stage.

### Stage 10 - Close the chapter and capture learning

1. Update the source tracker and quality evidence index.
2. Record durable discoveries in project memory.
3. Update shared standards only when the learning should govern future chapters.
4. Update the master backlog only when its stated gate is genuinely complete.
5. Preserve open limitations and the next action.

Exit gate: another contributor can reproduce the process without relying on the
original author's memory.

## Reference implementation: Science Chapter 1

| Evidence | Location |
| --- | --- |
| Textbook | `textbooks/science/extracted/jesc101.pdf` |
| Canonical lessons and quiz | `apps/web/content/chemical-reactions-and-equations/lessons/` |
| Chapter pack | `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md` |
| Source tracker | `docs/content/class-10/science/chemical-reactions-and-equations/source-fidelity-tracker.md` |
| Fidelity contract | `apps/web/lib/chemical-reactions-content-fidelity.test.ts` |
| Learner-task holdout | `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md` |
| Board-exam evidence | `docs/content/class-10/science/chemical-reactions-and-equations/board-exam-evidence.md` |
| Student review | `docs/pilot-chapter-1-student-review.md` |
| Current handoff | `TODO.md` |

## Copy-forward rule

For the next chapter:

1. Copy the process and evidence structure, not Chapter 1 chemistry.
2. Build a new map from that chapter's current textbook PDF.
3. Define chapter-specific high-risk contracts.
4. Reuse shared rendering and navigation components only when they fit the new
   source.
5. Keep missing source categories explicit.
6. Do not mark the new chapter complete because its file count resembles Chapter
   1.

Chapter 1 is the role model because its decisions are traceable to evidence, not
because every later chapter should have six lessons, eleven activities, ten
figures, thirty-two equations, or twenty exercises.
