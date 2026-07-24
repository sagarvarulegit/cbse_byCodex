---
type: AgentInstructions
title: Fix science notes alignment — textbook numbering, Q&A, figures, and tests
description: Actionable instructions to bring Chapters 1-4 science notes into full alignment with NOTES_GUIDELINES_STANDARDS.md, using Chapter 5 (Life Processes) as the reference pattern.
tags: ['notes-alignment', 'science', 'textbook-numbering', 'fix-instructions']
timestamp: 2026-07-08T12:00:00Z
---

# Fix Instructions — Science Notes Alignment (Chapters 1-4)

## Problem Summary

Only **Chapter 5 (Life Processes)** is fully aligned with NOTES_GUIDELINES_STANDARDS.md. Chapters 1-4 share the same five defects:

1. **Missing textbook section numbering** in lesson titles, H1s, frontmatter, catalog entries, and chapter packs.
2. **Missing `## NCERT activity and figure tracker` section** in lesson markdown files.
3. **Missing `## Questions and answers` blocks** with textbook-derived Q&A.
4. **Missing `## More to Know` or `## Think it over` boxes** for textbook callout boxes.
5. **No regression tests** guarding the above for Chapters 1-4.

Chapter 5 shows the correct pattern — use it as a reference.

---

## Phase 1: Textbook number map

Before editing, establish the official NCERT Class 10 Science section numbering from the rationalised syllabus. Use these mappings:

### Chapter 1 — Chemical Reactions and Equations
| Section | Title |
|---------|-------|
| 1.1 | Chemical Equations |
| 1.2 | Types of Chemical Reactions |
| 1.2.1 | Combination Reaction |
| 1.2.2 | Decomposition Reaction |
| 1.2.3 | Displacement Reaction |
| 1.2.4 | Double Displacement Reaction |
| 1.2.5 | Oxidation and Reduction |
| 1.3 | Have you observed the effects of oxidation in daily life? |

**Activities:** 1.1 (Mg ribbon), 1.2 (Pb nitrate + KI), 1.3 (Zn + H₂SO₄), 1.4 (Quicklime + water), 1.5 (Fe + CuSO₄), 1.6 (BaCl₂ + Na₂SO₄), 1.7 (FeSO₄ decomposition), 1.8 (PbNO₃ decomposition), 1.9 (Electrolysis of water), 1.10 (AgCl photolysis), 1.11 (Zn + CuSO₄ displacement), 1.12 (BaCl₂ + K₂SO₄), 1.13 (Mg oxidation)

**Figures:** Figure 1.1 (Magnesium ribbon burning), Figure 1.2 (Reaction of lead nitrate with potassium iodide), etc.

### Chapter 2 — Acids, Bases and Salts
| Section | Title |
|---------|-------|
| 2.1 | Understanding the chemical properties of acids and bases |
| 2.2 | What do all acids and all bases have in common? |
| 2.3 | How strong are acid or base solutions? |
| 2.4 | Importance of pH in daily life |
| 2.5 | More about salts |
| 2.5.1 | Family of salts |
| 2.5.2 | pH of salts |
| 2.5.3 | Chemicals from common salt |
| 2.5.4 | Are the crystals of salts really dry? |
| 2.5.5 | Bleaching powder |
| 2.5.6 | Baking soda |
| 2.5.7 | Washing soda |
| 2.5.8 | Plaster of Paris |

**Activities:** 2.1-2.15 covering indicators, neutralisation, gas tests, conductivity, pH, salt preparation.

**Figures:** Various chapter figures — research from NCERT textbook.

### Chapter 3 — Metals and Non-metals
| Section | Title |
|---------|-------|
| 3.1 | Physical properties |
| 3.2 | Chemical properties of metals |
| 3.2.1 | What happens when metals are burnt in air? |
| 3.2.2 | What happens when metals react with water? |
| 3.2.3 | What happens when metals react with acids? |
| 3.2.4 | How do metals react with solutions of other metal salts? |
| 3.3 | How do metals and non-metals react? |
| 3.4 | Properties of ionic compounds |
| 3.5 | Occurrence of metals |
| 3.5.1 | Extraction of metals |
| 3.5.2 | Enrichment of ores |
| 3.5.3 | Extracting metals low in the activity series |
| 3.5.4 | Extracting metals in the middle of the activity series |
| 3.5.5 | Extracting metals towards the top of the activity series |
| 3.5.6 | Refining of metals |
| 3.6 | Corrosion |

**Activities:** 3.1-3.14 covering property tests, reactions, reactivity, ionic compounds, rusting.

### Chapter 4 — Carbon and its Compounds
| Section | Title |
|---------|-------|
| 4.1 | Bonding in carbon — the covalent bond |
| 4.2 | Versatile nature of carbon |
| 4.2.1 | Catenation |
| 4.2.2 | Tetravalency |
| 4.3 | Chemical properties of carbon compounds |
| 4.3.1 | Combustion |
| 4.3.2 | Oxidation |
| 4.3.3 | Addition reaction |
| 4.3.4 | Substitution reaction |
| 4.4 | Some important carbon compounds — ethanol and ethanoic acid |
| 4.4.1 | Properties of ethanol |
| 4.4.2 | Properties of ethanoic acid |
| 4.5 | Soaps and detergents |

**Activities:** 4.1-4.12 covering carbon in everyday life, homologous series, combustion, oxidation, ethanol reactions, esterification, micelles, soap vs detergent.

---

## Phase 2: Files to edit

### Step 2a — Catalog lesson titles (`apps/web/lib/course-content.ts`)

For each of the four chapters, update:
- The `title` field in each `lessons[]` entry to include the textbook section number.
- The `topics[]` array to use textbook numbered topics.

**Chapter 1 example — current vs fixed:**
```
// CURRENT:
title: 'Chemical equations',
// FIXED:
title: '1.1 Chemical equations',
```

Mapping for Chapter 1 lessons (5 lessons → 5 textbook-aligned titles):
| Current slug | Current title | Fixed title |
|-------------|---------------|-------------|
| chemical-equations | Chemical equations | 1.1 Chemical equations |
| balancing-equations | Balancing equations | 1.1 continued — Balancing chemical equations |
| combination-and-decomposition-reactions | Combination and decomposition reactions | 1.2.1-1.2.2 Combination and decomposition reactions |
| displacement-and-double-displacement-reactions | Displacement and double displacement reactions | 1.2.3-1.2.4 Displacement and double displacement reactions |
| oxidation-and-reduction | Oxidation and reduction | 1.2.5-1.3 Oxidation, reduction, and effects in daily life |

Mapping for Chapter 2 lessons (4 lessons → 4 textbook-aligned titles):
| Current slug | Current title | Fixed title |
|-------------|---------------|-------------|
| indicators-and-neutralisation | Indicators and neutralisation | 2.1-2.2 Understanding acids, bases, and neutralisation |
| chemical-properties-of-acids-and-bases | Chemical properties of acids and bases | 2.1 continued — Reactions of acids and bases |
| ph-and-ions-in-solution | pH and ions in solution | 2.3-2.4 pH scale and importance in daily life |
| salts-and-daily-life-uses | Salts and daily-life uses | 2.5 More about salts and important compounds |

Mapping for Chapter 3 lessons (6 lessons → 6 textbook-aligned titles):
| Current slug | Current title | Fixed title |
|-------------|---------------|-------------|
| physical-properties | Physical properties | 3.1 Physical properties of metals and non-metals |
| thermal-conductivity-and-conductivity | Thermal conductivity and conductivity | 3.1 continued — Thermal and electrical conductivity |
| oxides-and-chemical-properties | Oxides and chemical properties | 3.2 Chemical properties of metals |
| reactivity-series-and-displacement | Reactivity series and displacement | 3.2.4-3.3 Reactivity series and how metals react with non-metals |
| ionic-compounds | Ionic compounds | 3.3-3.4 Ionic compounds and their properties |
| corrosion-and-prevention | Corrosion and prevention | 3.5-3.6 Occurrence, corrosion, and prevention |

Mapping for Chapter 4 lessons (7 lessons → 7 textbook-aligned titles):
| Current slug | Current title | Fixed title |
|-------------|---------------|-------------|
| covalent-bonding-in-carbon | Covalent bonding in carbon | 4.1 Bonding in carbon — the covalent bond |
| versatile-nature-of-carbon | Versatile nature of carbon | 4.2 Versatile nature of carbon |
| hydrocarbons-and-homologous-series | Hydrocarbons and homologous series | 4.2 continued — Hydrocarbons and homologous series |
| functional-groups-and-naming | Functional groups and naming | 4.2 continued — Functional groups and naming |
| chemical-properties-of-carbon-compounds | Chemical properties of carbon compounds | 4.3 Chemical properties of carbon compounds |
| ethanol-and-ethanoic-acid | Ethanol and ethanoic acid | 4.4 Ethanol and ethanoic acid |
| soaps-and-detergents | Soaps and detergents | 4.5 Soaps and detergents |

Also update the `topics[]` arrays for each chapter to use textbook numbering:
```
// Chapter 1 current:
topics: ['Chemical equations', 'Balancing equations', ...]
// Chapter 1 fixed:
topics: ['1.1 Chemical equations', '1.2 Types of chemical reactions', '1.3 Oxidation in daily life']
```

### Step 2b — Lesson markdown frontmatter and H1

For each lesson markdown file in Chapters 1-4:
1. Update the `title:` frontmatter to match the new catalog title.
2. Update the `# H1` heading at the top of the file body to match.

Example for `01-chemical-equations.md`:
```
---
title: 1.1 Chemical equations   ← changed from "Chemical equations"
...
---
# 1.1 Chemical equations          ← changed from "Chemical equations"
```

### Step 2c — Add `## NCERT activity and figure tracker` section

Insert this section into **every lesson** in Chapters 1-4 that has relevant activities or figures. Use the exact format from Life Processes (lesson 1, line 88-118) as template.

Format:
```markdown
## NCERT activity and figure tracker

Figure X.X: <description>
- Key label: <what to notice>

Activity X.X: <name>
- <setup/observation/conclusion>
- Conclusion: <what it proves>
```

For chapters where a lesson covers multiple figures/activities, list each with its number.

### Step 2d — Add `## Questions and answers` section

For every lesson in Chapters 1-4, after the content and before `## Solved examples`, add a `## Questions and answers` section. Follow the Life Processes pattern:

```markdown
## Questions and answers

### X.X Section title

Question:
<textbook in-text question or exercise-based question>

Answer:
<clear, scoring-friendly answer>

Question:
<next question>

Answer:
<next answer>
```

Derive the questions from:
- NCERT in-text question blocks (after each section)
- NCERT exercise questions that match the lesson's scope
- Key conceptual checks from the lesson

### Step 2e — Add textbook callout boxes

Where the textbook has "More to Know", "Do You Know", "Think it over", or special boxes, add them to relevant lessons. Chapter 5's lesson 4 shows the pattern:
```markdown
More to Know:
Blood pressure is measured using a sphygmomanometer. [...]
```

And lesson 6 shows:
```markdown
Think it over: Organ donation
- Organ donation can save or transform lives [...]
```

### Step 2f — Update chapter packs (`docs/content/class-10/science/<chapter>/chapter-pack.md`)

For each chapter pack, fix:
1. `## chapter flow for the platform` — replace custom numbering with textbook section numbers.
2. Section headings — replace `## 1) chemical reactions` with `## 1.1 Chemical equations` etc.
3. Add activity/figure references where missing.

After editing chapter packs, regenerate generated content:
```powershell
npm.cmd run content:generate -w apps/web
```

---

## Phase 3: Add regression tests

Add tests to `apps/web/lib/course-content.test.ts` — one block per chapter, following the Life Processes pattern at lines 808-854.

### Test 3a — Lesson titles preserve textbook numbering (one test per chapter)

```typescript
test('chemical reactions lesson titles preserve NCERT Chapter 1 topic numbering', async () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.title),
    [
      '1.1 Chemical equations',
      '1.1 continued — Balancing chemical equations',
      '1.2.1-1.2.2 Combination and decomposition reactions',
      '1.2.3-1.2.4 Displacement and double displacement reactions',
      '1.2.5-1.3 Oxidation, reduction, and effects in daily life',
    ],
  );

  for (const lesson of getAvailableLessons(chapter)) {
    const content = await getLessonContent(chapterSlug, lesson.slug);
    assert.ok(content, `Expected lesson content for ${lesson.slug}`);
    assert.equal(content.lesson.title, lesson.title);
    assert.equal(content.blocks[0]?.type, 'h1');
    if (content.blocks[0]?.type === 'h1') {
      assert.equal(content.blocks[0].text, lesson.title);
    }
  }
});
```

Repeat for `acidsBasesChapterSlug`, `metalsNonMetalsChapterSlug`, `carbonCompoundsChapterSlug`.

### Test 3b — Parent heading appears before child heading

For any chapter where a single lesson covers a parent section followed by a child subsection (e.g., Chapter 4 lesson 1 shows `4.1 Bonding in carbon` before `4.2 Versatile nature of carbon`), add a test following the pattern at line 835-854.

### Test 3c — Textbook question-answer blocks exist

Following the pattern at line 689-730, add a test for each of Chapters 1-4 that verifies:
- `Questions and answers` h2 exists
- At least 2-3 specific textbook-derived questions appear in each lesson

### Test 3d — Activity and figure numbering preserved

Following the pattern at line 732-805, add a test for Chapters 1-4 that verifies specific `Figure X.X:` and `Activity X.X:` labels exist in the lesson text.

### Test 3e — Chapter pack flow uses textbook numbering

Add tests that check the generated chapter pack markdown contains the expected textbook section numbers in the flow list.

---

## Phase 4: Verification checklist

Before closing:

1. ✅ Run the full test suite for `apps/web`:
   ```powershell
   cd apps/web && npm.cmd test
   ```
2. ✅ Run lint:
   ```powershell
   cd apps/web && npm.cmd run lint
   ```
3. ✅ Run quiz validation:
   ```powershell
   cd apps/web && npm.cmd run validate:quizzes
   ```
   Expected: `Errors: 0. Warnings: 0.`
4. ✅ Verify generated chapter packs are not stale — regenerate if chapter packs changed:
   ```powershell
   npm.cmd run content:generate -w apps/web
   ```
5. ✅ Verify build:
   ```powershell
   npm.cmd run build
   ```
6. ✅ Update `docs/architecture.md` only when module boundaries, data ownership, or deployment flows change.

---

## Appendix A: Reference patterns from Life Processes (Chapter 5)

### Lesson title format (from course-content.ts line 556):
```
title: '5.1 What are life processes? and 5.2 Nutrition',
```

### Topics format:
```
topics: [
  '5.1 What are life processes?',
  '5.2 Nutrition',
  '5.3 Respiration',
  '5.4 Transportation',
  '5.5 Excretion',
],
```

### Activity tracker format (from lesson 1 line 88-118):
```
## NCERT activity and figure tracker

Figure 5.1: Cross-section of a leaf
- Key label: chloroplasts contain chlorophyll.

...

Activity 5.1: Variegated leaf starch test
- Keep a variegated plant in darkness...
- Conclusion: chlorophyll is essential for photosynthesis.
```

### Questions and answers format (from lesson 1 line 138-166):
```
## Questions and answers

### 5.1 What are life processes?

Question:
Why are molecular movements needed for life?

Answer:
Living structures constantly need repair [...]
```

### Chapter pack flow format (from chapter-pack.md line 31-35):
```
## chapter flow for the platform

1. 5.1 What are life processes?
2. 5.2 Nutrition
3. 5.3 Respiration
4. 5.4 Transportation
5. 5.5 Excretion
```

### Test for parent-before-child (from course-content.test.ts line 835-854):
```typescript
test('life processes plant nutrition lesson shows parent 5.2 before 5.2.1', async () => {
  const content = await getLessonContent(
    lifeProcessesChapterSlug,
    'life-processes-and-nutrition-in-plants',
  );
  // ...
  const nutritionIndex = headings.indexOf('5.2 Nutrition');
  const autotrophicIndex = headings.indexOf('5.2.1 Autotrophic nutrition');
  // assertions...
});
```
