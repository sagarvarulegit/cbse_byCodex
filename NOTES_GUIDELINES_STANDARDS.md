---
type: DeveloperGuidelines
title: Notes Guidelines and Standards
description: Agent-facing standards for textbook-aligned platform notes, lesson pages, quizzes, figures, activities, numbering, and review.
tags: ['notes', 'textbook-alignment', 'cbse', 'content-quality', 'agent-rules']
timestamp: 2026-07-08T12:00:00Z
---

# Notes Guidelines and Standards

This file exists because agents have already made avoidable content-alignment mistakes. Read it before creating, reviewing, or editing platform notes, lesson markdown, chapter packs, quiz content, or Gemini animation integrations.

The platform notes are simplified versions of the textbook, not replacements for it. Simplification must make the textbook easier to understand without changing its order, numbering, examples, activities, figures, or meaning.

## Non-negotiable rules

1. Preserve textbook section numbering in student-facing topics and lesson titles.
   - Correct: `5.1 What are life processes?`
   - Correct: show parent `5.2 Nutrition` before child `5.2.1 Autotrophic nutrition`.
   - Incorrect: jumping directly from `5.1` to `5.2.1` with no visible `5.2`.
   - Incorrect: replacing textbook numbering with only platform labels like `Plant nutrition`.

2. Preserve textbook order.
   - Do not rearrange sections because a platform flow feels cleaner.
   - If one platform lesson spans multiple textbook subsections, make the range explicit, for example `5.2.2-5.2.4 Heterotrophic and human nutrition`.

3. Preserve textbook activities and activity numbers.
   - Every textbook activity must be represented or explicitly marked as out of scope with a reason.
   - Keep exact labels like `Activity 5.1`, `Activity 5.2`, etc.
   - Do not merge activities without naming every original number.

4. Preserve textbook figures and figure numbers.
   - If the textbook chapter has figures, the platform notes must mention matching figures.
   - Keep labels like `Figure 5.1: Cross-section of a leaf`.
   - For diagram-heavy chapters, add a figure/activity tracker section in lesson notes.

5. Preserve textbook examples, questions, problems, and special boxes.
   - In-text questions, exercise anchors, examples, "More to Know", "Do You Know", safety notes, and special social/health boxes must not disappear.
   - Reword for clarity, but keep the concept, sequence, and exam-relevant detail.
   - If the textbook has a `Questions` section after a topic, the platform lesson must include a matching `Questions and answers` section in the same position before the next textbook section starts.
   - The question text itself must match the textbook wording. Do not replace textbook questions with paraphrased, invented, merged, or "better" platform questions.
   - Provide clear, scoring-friendly answers for those textbook questions. Do not list questions without answers.

6. Do not invent unsupported facts.
   - Platform additions such as tips, memory tricks, comic recaps, and gamification must be derived from the textbook concept.
   - Add-ons must not introduce claims that conflict with NCERT/CBSE content.

7. Do not over-compress science.
   - If a concept has a mechanism in the textbook, explain the mechanism.
   - Example: do not write only "plants make food"; explain carbon dioxide, water, sunlight, chlorophyll, starch, stomata, and the relevant activity evidence.

8. Keep parent-child topic hierarchy visible.
   - Parent section headings must appear before child subsection headings.
   - Example: `5.2 Nutrition` must appear before `5.2.1 Autotrophic nutrition`.
   - This applies to cards, lesson titles, H1s, H2s, chapter-pack flow, and any generated navigation labels.

9. Keep animations aligned with textbook numbering.
   - Gemini/HTML animations must be integrated into platform components with the same activity/figure numbers.
   - If an animation covers multiple activities, name every covered activity number.

10. Tests must guard the exact mistake being fixed.
   - When fixing a numbering, figure, activity, quiz, or source-fidelity miss, add a regression test that would fail if the mistake returns.

## Required workflow for notes work

1. Identify the textbook source.
   - Use the chapter's `source_textbook` field when available.
   - If the source is missing locally, use the official NCERT/CBSE source before claiming alignment.

2. Build a textbook map before editing.
   - List official section numbers and titles.
   - List all activities and activity numbers.
   - List all figures and figure numbers.
   - List every textbook `Questions` block with the section it follows.
   - List in-text question blocks, examples, exercise themes, and special boxes.

3. Compare current platform content against that map.
   - Check `docs/content/.../chapter-pack.md`.
   - Check `apps/web/content/<chapter-slug>/lessons/*.md`.
   - Check `apps/web/lib/course-content.ts` lesson titles, topics, filenames, and live lesson count.
   - Check quiz files under `apps/web/content/<chapter-slug>/lessons/quiz.md`.

4. Edit all relevant surfaces together.
   - Chapter metadata in `apps/web/lib/course-content.ts`.
   - Lesson markdown files.
   - Chapter pack markdown.
   - Quiz markdown.
   - Tests in the closest relevant `*.test.ts`.
   - `docs/project-memory.md` when the session creates durable chapter knowledge.

5. Regenerate generated content when chapter packs change.
   - Run `npm.cmd run content:generate -w apps/web`.
   - Do not leave `apps/web/lib/chapter-packs.generated.ts` stale.

6. Verify before closing.
   - Run focused content tests.
   - Run quiz metadata validation when quiz files changed.
   - Run build before lint in `apps/web`.
   - Run `graphify update .` after code changes, as required by `AGENTS.md`.

## Chapter 5 mistakes that must not repeat

These were fixed once and must stay fixed:

1. Missing textbook topic numbering.
   - The platform initially showed labels without `5.1`, `5.2`, etc.
   - Required standard: student-facing labels must preserve textbook numbering.

2. Jumping from parent to child section.
   - The platform showed `5.2.1 Autotrophic nutrition` without visibly showing parent `5.2 Nutrition`.
   - Required standard: show parent section first, then child subsection.

3. Missing activities and figures.
   - The first draft did not preserve Activities 5.1-5.8 or Figures 5.1-5.14.
   - Required standard: every activity and figure number must be represented.

4. Over-compressed notes.
   - The first draft covered only broad buckets like nutrition, respiration, transport, and excretion.
   - Required standard: include NCERT details such as Amoeba, Paramoecium, dental caries, ATP, pyruvate pathways, alveoli, haemoglobin, blood pressure, platelets, lymph, ATP-powered phloem translocation, Bowman's capsule, dialysis, organ donation, and plant excretion methods.

5. Weak quiz alignment.
   - The old quiz had only very basic vocabulary questions.
   - Required standard: quiz questions should cover textbook exercise and in-text anchors with valid answers, explanations, topic slugs, difficulty, and source metadata.

6. Missing textbook Questions and Answers.
   - Textbook sections such as Chapter 5 `5.1 What are life processes?` include a `Questions` block.
   - Required standard: the matching platform lesson must include the exact textbook questions plus clear answers that help students score high.
   - Required standard: the block must appear where the textbook places it, for example the `5.1` questions must appear after `5.1 What are life processes?` and before `5.2 Nutrition`.
   - Do not rely only on `Quick practice`, `Answer check`, or the quiz to cover textbook questions.

## Required lesson structure for science notes

Each lesson should normally include:

- YAML frontmatter with accurate `title`, `chapter_slug`, `lesson_number`, `lesson_slug`, and status.
- H1 matching the student-facing lesson title.
- `## Learning goals`
- Numbered textbook section headings where relevant, for example `## 5.2 Nutrition`.
- `## NCERT activity and figure tracker` for chapters with activities/figures.
- Concept explanations in simple language.
- `## Questions and answers` immediately after the relevant textbook topic when the textbook has a `Questions` block there, before the next numbered textbook topic.
- Solved examples derived from textbook questions or exercise style.
- `## Common mistakes`
- `## Board tips`
- `## Quick practice`
- `## Answer check`
- `## One-minute revision`
- `## Comic recap`

Do not use the structure as an excuse to reorder textbook content. The structure supports the textbook sequence.

## Quiz standards

Quiz content is not a substitute for textbook `Questions and answers` inside notes. Quizzes are for practice and scoring feedback; lesson notes must still include textbook question blocks with answers.

Every quiz question should include:

- clear question text
- realistic answer choices
- `Answer: <number>`
- `Topic: <valid chapter topic or lesson slug>`
- `Difficulty: easy|medium|hard`
- `Source: NCERT exercise aligned`, `NCERT in-text aligned`, or similarly precise source note
- `Explanation: <why the answer is correct>`

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected result before closing quiz work:

```text
Errors: 0. Warnings: 0.
```

## Regression test standards

When fixing content alignment, add tests for exact strings that matter.

Good tests assert:

- lesson content loads from `getLessonContent(...)`
- catalog titles match textbook numbering
- H1 matches the catalog title
- parent heading appears before child heading
- activity markers or labels exist
- figure labels exist
- textbook `Questions and answers` sections exist
- key textbook details exist
- comic recap structure is still renderable

Example checks:

- `5.2 Nutrition` appears before `5.2.1 Autotrophic nutrition`
- `Activity 5.1: Variegated leaf starch test` exists
- `Figure 5.14: Structure of a nephron` exists
- `Questions and answers` exists after `5.1 What are life processes?`
- the exact textbook question `Why is diffusion insufficient to meet the oxygen requirements of multi-cellular organisms like humans?` appears in the `5.1` question block before `5.2 Nutrition`
- `Bowman's capsule` exists

## Pre-close checklist

Before saying notes are aligned, confirm:

- Textbook source was used.
- Section numbering matches the textbook.
- Parent sections appear before child subsections.
- Topic cards and lesson titles preserve numbering.
- Chapter pack flow preserves numbering.
- Activities and figures are represented with original numbers.
- Textbook `Questions` blocks are represented as `Questions and answers` in the relevant lesson notes.
- Textbook question wording is exact, while answers may be simplified and scoring-friendly.
- In-text and exercise anchors are covered.
- Quiz metadata validates.
- Generated chapter packs are refreshed if docs chapter packs changed.
- Focused tests pass.
- Build and lint pass when runtime files changed.
- Project memory is updated for durable chapter-specific gotchas.

If any item is not true, do not call the notes textbook-aligned.
