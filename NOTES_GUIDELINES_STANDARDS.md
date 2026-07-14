---

type: Standard
title: CBSE Portal Notes, Alignment & Formatting Standard
description: Combined standard for textbook-aligned CBSE Class 10 notes, lesson pages, chapter packs, quizzes, figures, activities, animations, parser markup, and review workflow.
tags: [standard, notes, textbook-alignment, cbse, content-quality, formatting, agent-rules]
timestamp: 2026-07-09T00:00:00Z
-------------------------------

# CBSE Portal Notes, Alignment & Formatting Standard

This standard defines how agents must create, edit, seed, review, and verify CBSE Class 10 portal notes, lesson markdown, chapter packs, quizzes, figures, activities, and Gemini/HTML animation integrations.

The platform notes are simplified versions of the textbook, not replacements for it. Simplification must make the textbook easier to understand without changing the textbook order, section numbering, examples, activities, figures, questions, or meaning.

---

## 1. Core Non-Negotiable Rules

### 1.1 Preserve textbook numbering

Student-facing topics, lesson titles, H1s, H2s, cards, chapter-pack flow, and generated navigation labels must preserve textbook numbering.

Correct:

* `5.1 What are life processes?`
* Show `5.2 Nutrition` before `5.2.1 Autotrophic nutrition`.

Incorrect:

* Jumping from `5.1` directly to `5.2.1` with no visible `5.2`.
* Replacing textbook numbering with only platform labels like `Plant nutrition`.

### 1.2 Preserve textbook order

Do not rearrange textbook sections because a platform flow feels cleaner.

If one platform lesson spans multiple textbook subsections, make the range explicit.

Example:

```markdown
5.2.2-5.2.4 Heterotrophic and human nutrition
```

### 1.3 Preserve parent-child hierarchy

Parent section headings must appear before child subsection headings.

Example:

```markdown
## 5.2 Nutrition
## 5.2.1 Autotrophic nutrition
```

This applies everywhere: lesson titles, topic cards, H1s, H2s, chapter packs, and navigation labels.

### 1.4 Preserve activities and activity numbers

Every textbook activity must be represented or explicitly marked as out of scope with a reason.

Rules:

* Keep exact labels like `Activity 5.1`, `Activity 5.2`, etc.
* Do not merge activities unless every original activity number is named.
* Gemini/HTML animations must use the same textbook activity or figure numbers.
* If one animation covers multiple activities, name every covered activity number.

### 1.5 Preserve figures and figure numbers

If the textbook chapter has figures, the platform notes must have matching figure references.

Rules:

* Keep labels like `Figure 5.1: Cross-section of a leaf`.
* Use a figure/activity tracker for diagram-heavy chapters.
* Use `[FIGURE: figure_id]` tokens for supported programmatic diagrams.

### 1.6 Preserve textbook questions, examples, and special boxes

The following must not disappear:

* In-text questions
* Textbook `Questions` blocks
* Exercise anchors
* Examples
* Problems
* Safety notes
* “More to Know”
* “Do You Know”
* Social, health, or special information boxes

If the textbook has a `Questions` block after a topic, the platform lesson must include a matching `Questions and answers` section in the same position before the next textbook section starts.

Rules:

* Question wording must match the textbook exactly.
* Do not replace textbook questions with invented, paraphrased, merged, or “better” platform questions.
* Answers may be simplified, but they must be clear and scoring-friendly.
* Do not rely only on `Quick practice`, `Answer check`, or quizzes to cover textbook questions.

### 1.7 Do not invent unsupported facts

Add-ons such as tips, memory tricks, comic recaps, and gamification must come from the textbook concept.

They must not introduce claims that conflict with NCERT or CBSE content.

### 1.8 Do not over-compress science

If the textbook explains a mechanism, the platform note must explain the mechanism.

Example:

Do not write only:

```markdown
Plants make food.
```

Explain carbon dioxide, water, sunlight, chlorophyll, starch, stomata, and the activity evidence where relevant.

### 1.9 Tests must guard the exact mistake being fixed

When fixing numbering, figures, activities, quizzes, questions, or source-fidelity problems, add a regression test that would fail if the same mistake returns.

---

## 2. Design and Pedagogical Standards

Every note must prioritize clarity, engagement, active recall, and textbook fidelity.

### 2.1 Typography

Use the portal typography system consistently.

* **Georgia Serif**: long-form reading text, textbook quotes, notes, captions, and detailed explanations.
* **Outfit Sans-serif**: UI components, buttons, section headings, comic dialogue bubbles, and structural chrome.

### 2.2 Colors

All components must use NCERT theme colors loaded dynamically from:

```text
apps/mobile_web_client/lib/theme.dart
```

Examples:

* `AppColors.purple` for section headers
* `AppColors.blue` for accents

Do not hardcode hex or HTML colors inside database note values.

Exception: CustomPainter implementation code may use explicit colors where the painter standard requires them.

### 2.3 Responsive layout

Content must support both layouts:

* Sidebar drawer on viewports `>= 800px`
* Bottom navigation on viewports `< 800px`

### 2.4 Language level

Write at a Class 8 reading level.

Rules:

* Keep sentences short.
* Use one idea per sentence.
* Prefer active voice.
* Replace complex words with simple words.

Examples:

* `utilize` → `use`
* `demonstrate` → `show`
* `approximately` → `about`
* `consequently` → `so`

### 2.5 Hook first, explain later

Open every chapter with a real-life story, surprising fact, or curiosity question.

Example:

```markdown
You flip a switch. A light turns on. But what just happened inside the wire? Let's find out.
```

### 2.6 Active recall

Do not reveal solutions to numerical or scientific examples immediately.

Use the interactive example format so students try first and then expand the solution.

---

## 3. Required Chapter and Lesson Flow

Use this structure while preserving textbook order. The structure supports the textbook sequence; it must never be used as an excuse to rearrange textbook content.

A chapter or lesson should normally include:

1. YAML frontmatter with accurate `title`, `chapter_slug`, `lesson_number`, `lesson_slug`, and status.
2. H1 matching the student-facing lesson or chapter title.
3. Chapter goal.
4. Hook.
5. Learning goals.
6. Numbered textbook section headings where relevant.
7. Concept explanations in simple language.
8. NCERT activity and figure tracker for chapters with activities or figures.
9. NCERT activities with original activity numbers.
10. Inline vector diagrams or figure tokens.
11. Textbook `Questions and answers` immediately after the relevant textbook topic.
12. Solved examples derived from textbook questions or exercise style.
13. Tips, tricks, or jargon callouts where useful.
14. Common mistakes.
15. Board tips.
16. Quick practice.
17. Answer check.
18. One-minute revision.
19. Comic recap.

Recommended heading examples:

```markdown
# Chapter 5: Life Processes

## Learning goals

## 5.1 What are life processes?

## Questions and answers

## 5.2 Nutrition

## 5.2.1 Autotrophic nutrition

## NCERT activity and figure tracker

## Common mistakes

## Board tips

## Quick practice

## Answer check

## One-minute revision

## Comic recap
```

---

## 4. Markdown Markup and Custom Parser Triggers

The client parser in:

```text
apps/mobile_web_client/lib/views/lessons_view.dart
```

scans database notes for specific markdown strings and converts them into specialized UI widgets.

### 4.1 Chapter opener header

Any line starting with a single `# ` triggers the custom chapter header layout.

Format:

```markdown
# Chapter [Number]: [Title]
```

Parser behavior:

* Renders a custom header container.
* Shows a `FlaskPainter` vector on the left.
* Shows the main title in Outfit font.
* Shows a `QRCodePainter` with an `NCERT` label on the right.

### 4.2 Section dividers

Any line starting with `## ` renders a bold purple section heading with a thin accent line.

Format:

```markdown
## 12.1 Electric Current and Circuit
```

### 4.3 Interactive examples

Use this for active recall. The solution is hidden behind a dropdown.

Format:

```markdown
**Example 12.1**
A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes.

**Solution:**
We are given: $I = 0.5\text{ A}$, $t = 10\text{ min} = 600\text{ s}$.

We know $Q = It = 0.5\text{ A} \times 600\text{ s} = 300\text{ C}$.
```

Parser behavior:

* Maps the block into the `InteractiveExample` widget.
* Uses an `ExpansionTile` titled `Show Solution`.

Rule:

* Do not add badges such as `CBSE 2023` to example headers.

### 4.4 In-text questions and answers

Use this format for textbook question blocks and in-text questions.

Format:

```markdown
**❓ QUESTIONS**

**1. What does an electric circuit mean?**
*Answer:* A continuous and closed path of an electric current.
```

Parser behavior:

* Collects blocks after `**❓ QUESTIONS**` or `**❓ IN-TEXT QUESTIONS**`.
* Maps each question-answer pair into a `QuestionCard`.

Rules:

* Questions must start with `**[number].`
* Answers must start with `*Answer:*`
* Textbook question wording must remain exact.
* Answers should be simple, clear, and scoring-friendly.

### 4.5 Common pitfalls and alert boxes

Standard caution format:

```markdown
Caution: Do not touch bare wires.
```

Parser behavior:

* Any paragraph starting with `Caution:` or `*Caution:` renders as a warning card.

Alert formats:

```markdown
> [!NOTE]
> Important note text.

> [!WARNING]
> Warning text.

> [!CAUTION]
> Caution text.
```

Info and tip formats:

```markdown
[INFO: Text goes here.]

[TIP: Text goes here.]
```

### 4.6 Jargon callout cards

Define technical terms inline.

Format:

```markdown
[JARGON: Term | Simple Definition | Real-world Example]
```

Example:

```markdown
Water undergoes [JARGON: Electrolysis | Splitting a compound using electricity | Passing current through water to get hydrogen and oxygen gas].
```

Parser behavior:

* Keeps the term in the running text.
* Inserts a callout card below it.
* Shows the term, simple definition, and real-world example.

### 4.7 NCERT activities

Use dedicated activity blocks.

Format:

```markdown
### Activity 12.1

Caution: Do not touch bare wires.

1. Connect the resistor in series.
2. Record the voltmeter reading.
```

Parser behavior:

* Captures caution text.
* Captures numbered steps.
* Renders the activity in a custom activity box.

Rules:

* Keep original textbook activity numbers.
* Represent every textbook activity or mark it out of scope with a reason.
* Do not merge activities without naming every original activity number.

### 4.8 Comic recap

End chapters with a short dialogue-driven recap between Priya and Rahul.

Format:

```markdown
## 🎬 Comic Recap

┌────────────────────────────────────────────┐
│ PANEL 1:                                   │
│ Priya: "Why does the toaster wire glow?"   │
│ Rahul: "It is a high-resistance alloy. It  │
│         gets hot due to Joule heating."    │
├────────────────────────────────────────────┤
│ 📌 REMEMBER THIS!                          │
│ V = IR, H = I²Rt                           │
└────────────────────────────────────────────┘
```

Parser behavior:

* Recognizes headings containing `Comic Recap`.
* Extracts ASCII panel blocks.
* Converts alternating character dialogue into speech bubbles.

Rules:

* Keep the recap conceptually aligned with the textbook.
* Do not introduce unsupported claims.

---

## 5. Mathematical and Chemical Syntax

### 5.1 LaTeX delimiters

Use single dollar signs for inline equations.

```markdown
$V = IR$
```

Use double dollar signs for display equations.

```markdown
$$V = IR$$
```

The custom delimiter is also supported:

```markdown
3607864\frac{-b \pm \sqrt{b^2-4ac}}{2a}3607864
```

### 5.2 Chemical formulas

Plain text chemical formulas outside LaTeX math blocks are automatically converted into Unicode subscripts.

Examples:

* `H2O` → `H₂O`
* `CO_2` → `CO₂`
* `O_2` → `O₂`
* `C_6H_12O_6` → `C₆H₁₂O₆`

Rule:

* Do not alter formulas inside `$...$` math blocks.

---

## 6. Vector Diagrams and Figure Tokens

Static images are prohibited in revision notes.

All diagrams must be responsive, dark-mode aware, and programmatically drawn through CustomPainters using figure markup.

### 6.1 Figure token format

```markdown
[FIGURE: figure_id]
```

### 6.2 Canvas standard

Every CustomPainter canvas must assume:

```text
1280 x 720
16:9 aspect ratio
```

The client wraps painters in an `AspectRatio(16/9)` widget and caps desktop height at `324px`.

### 6.3 Contrast rules

Never use a white or light background for diagrams that show light reaction elements such as:

* white chemical ash
* bubbles
* silver or zinc metals
* gas fumes

Use the premium slate background where required:

```text
#1E293B
```

### 6.4 Font sizes for 1280 x 720 canvas

* Diagram title: `36px`, Georgia, Serif, Bold
* Chemical equations: `44px–48px`, Georgia, Serif, Bold
* Observation notes: `28px`, Arial, Sans-serif, Bold
* Diagram labels: `26px–28px`, Arial, Sans-serif, Bold

### 6.5 Supported figure tokens

Use these tokens only when they match the textbook figure or activity.

1. `magnesium_burner`: Combustion of magnesium ribbon in a burner with watch glass.
2. `double_circulation`: Four-chamber heart showing systemic and pulmonary capillary loops.
3. `neuron`: Cell body, nucleus, dendrites, axon, myelin sheath, and nerve endings.
4. `prism_dispersion`: Glass prism refracting white light into VIBGYOR.
5. `bar_magnet_field`: Bar magnet with directional magnetic field lines from N to S.
6. `trophic_levels`: Four-tier energy transfer pyramid.
7. `circuit_symbols`: Grid of standard circuit components.
8. `ohms_law_circuit`: Circuit layout for verifying Ohm’s Law.
9. `basic_circuit`, `series_circuit`, `parallel_circuit`: Resistance layouts.
10. `combination_reaction`, `decomposition_reaction`, `displacement_reaction`: Chemical apparatus setups.
11. `ferrous_sulphate_decomposition`, `lead_nitrate_decomposition`, `electrolysis_of_water`, `silver_chloride_sunlight`: Textbook-aligned chemistry experiments.

---

## 7. Quiz Standards

Quiz content is not a substitute for textbook `Questions and answers` inside notes.

Quizzes are for practice and scoring feedback. Lesson notes must still include textbook question blocks with answers.

Every quiz question must include:

* Clear question text
* Realistic answer choices
* `Answer: <number>`
* `Topic: <valid chapter topic or lesson slug>`
* `Difficulty: easy|medium|hard`
* `Source: NCERT exercise aligned`, `NCERT in-text aligned`, or another precise source note
* `Explanation: <why the answer is correct>`

Run quiz validation after quiz changes:

```powershell
npm.cmd run validate:quizzes -w apps/web
```

Expected result:

```text
Errors: 0. Warnings: 0.
```

---

## 8. Required Workflow for Notes Work

### 8.1 Identify the textbook source

Use the chapter’s `source_textbook` field when available.

If the source is missing locally, use the official NCERT or CBSE source before claiming alignment.

### 8.2 Build a textbook map before editing

List:

* Official section numbers and titles
* All activities and activity numbers
* All figures and figure numbers
* Every textbook `Questions` block and the section it follows
* In-text question blocks
* Examples
* Exercise themes
* Safety notes and special boxes

### 8.3 Compare current platform content against the textbook map

Check:

```text
docs/content/.../chapter-pack.md
apps/web/content/<chapter-slug>/lessons/*.md
apps/web/lib/course-content.ts
apps/web/content/<chapter-slug>/lessons/quiz.md
```

Verify:

* Lesson titles
* Topic labels
* Filenames
* Live lesson count
* Quiz metadata
* Chapter-pack flow

### 8.4 Edit all relevant surfaces together

Update all affected files in the same pass:

* Chapter metadata in `apps/web/lib/course-content.ts`
* Lesson markdown files
* Chapter pack markdown
* Quiz markdown
* Closest relevant `*.test.ts`
* `docs/project-memory.md` when the session creates durable chapter knowledge

### 8.5 Regenerate generated content

When chapter packs change, run:

```powershell
npm.cmd run content:generate -w apps/web
```

Do not leave this file stale:

```text
apps/web/lib/chapter-packs.generated.ts
```

### 8.6 Verify before closing

Run:

* Focused content tests
* Quiz metadata validation when quiz files changed
* Build before lint in `apps/web`
* `graphify update .` after code changes, as required by `AGENTS.md`

---

## 9. Regression Test Standards

When fixing content alignment, add tests for exact strings that matter.

Good tests assert:

* Lesson content loads from `getLessonContent(...)`
* Catalog titles match textbook numbering
* H1 matches the catalog title
* Parent heading appears before child heading
* Activity markers or labels exist
* Figure labels exist
* Textbook `Questions and answers` sections exist
* Key textbook details exist
* Comic recap structure is still renderable

Example checks:

```text
5.2 Nutrition appears before 5.2.1 Autotrophic nutrition
Activity 5.1: Variegated leaf starch test exists
Figure 5.14: Structure of a nephron exists
Questions and answers exists after 5.1 What are life processes?
Bowman's capsule exists
```

Also test exact textbook questions where relevant.

Example:

```text
Why is diffusion insufficient to meet the oxygen requirements of multi-cellular organisms like humans?
```

---

## 10. Database Seeding Technical Constraints

### 10.1 SQL quote escaping

When writing PostgreSQL seeds, single quotes inside text fields must be doubled.

Examples:

```sql
'Ohm''s Law'
'Gandhiji''s march'
```

### 10.2 XML compliance

The browser XML parser is strict when loading custom painters or SVGs inside iframes.

Never use an unescaped ampersand:

```text
&
```

Use:

```text
and
```

or:

```text
&amp;
```

### 10.3 UUID length

All IDs seeded in content tables must be valid UUID v4 strings.

This applies to:

* subjects
* chapters
* lessons
* quizzes
* questions

---

## 11. Known Mistakes That Must Not Repeat

These mistakes were already fixed once and must stay fixed.

### 11.1 Missing textbook topic numbering

Problem:

* The platform initially showed labels without `5.1`, `5.2`, etc.

Required standard:

* Student-facing labels must preserve textbook numbering.

### 11.2 Jumping from parent to child section

Problem:

* The platform showed `5.2.1 Autotrophic nutrition` without visibly showing parent `5.2 Nutrition`.

Required standard:

* Show the parent section first, then the child subsection.

### 11.3 Missing activities and figures

Problem:

* The first draft did not preserve Activities `5.1–5.8` or Figures `5.1–5.14`.

Required standard:

* Every activity and figure number must be represented.

### 11.4 Over-compressed notes

Problem:

* The first draft covered only broad buckets like nutrition, respiration, transport, and excretion.

Required standard:

* Include NCERT details such as Amoeba, Paramoecium, dental caries, ATP, pyruvate pathways, alveoli, haemoglobin, blood pressure, platelets, lymph, ATP-powered phloem translocation, Bowman's capsule, dialysis, organ donation, and plant excretion methods where relevant.

### 11.5 Weak quiz alignment

Problem:

* The old quiz had only basic vocabulary questions.

Required standard:

* Quiz questions should cover textbook exercise and in-text anchors with valid answers, explanations, topic slugs, difficulty, and source metadata.

### 11.6 Missing textbook Questions and Answers

Problem:

* Textbook sections such as Chapter 5 `5.1 What are life processes?` include a `Questions` block.

Required standard:

* The matching platform lesson must include exact textbook questions plus clear answers.
* The block must appear where the textbook places it.
* For example, the `5.1` questions must appear after `5.1 What are life processes?` and before `5.2 Nutrition`.

---

## 12. Pre-Close Checklist

Before saying notes are aligned, confirm every item below.

### Source and sequence

* Textbook source was used.
* Section numbering matches the textbook.
* Textbook order is preserved.
* Parent sections appear before child subsections.
* Topic cards and lesson titles preserve numbering.
* Chapter-pack flow preserves numbering.

### Coverage

* Activities are represented with original numbers.
* Figures are represented with original numbers.
* Textbook `Questions` blocks are represented as `Questions and answers`.
* Textbook question wording is exact.
* Answers are simplified and scoring-friendly.
* In-text and exercise anchors are covered.
* Examples, safety notes, and special boxes are preserved.
* Science mechanisms are not over-compressed.

### Formatting and rendering

* Required markdown triggers are used correctly.
* Activity blocks use `### Activity [number]`.
* Question blocks use `**❓ QUESTIONS**` or `**❓ IN-TEXT QUESTIONS**`.
* Answers use `*Answer:*`.
* Figure tokens use supported `[FIGURE: figure_id]` format.
* LaTeX and chemical formulas render correctly.
* No hardcoded colors are stored inside database note values.
* No unescaped ampersands are present in XML/SVG-sensitive content.

### Quiz and build validation

* Quiz metadata validates.
* Generated chapter packs are refreshed if docs chapter packs changed.
* Focused tests pass.
* Build and lint pass when runtime files changed.
* `graphify update .` was run after code changes where required.
* Project memory is updated for durable chapter-specific gotchas.

If any item is not true, do not call the notes textbook-aligned.

---

## 13. Related Documentation

* `docs/CONTENT_QUALITY_STANDARDS.md`
* `docs/chapterlooknfeel.md`
* `docs/chapterslooknfeel.md`
* `docs/howsvg.md`
* `apps/mobile_web_client/lib/theme.dart`
* `apps/mobile_web_client/lib/views/lessons_view.dart`
