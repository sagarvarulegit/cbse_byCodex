# Notes Parser Triggers, Syntax, Figures & Readability Components

> Moved verbatim from `AGENTS.md` to keep the always-loaded rules file under the 24 KB agent limit. Keep this file accurate; `AGENTS.md` links here.

### 6.2 Custom Markdown Parser Triggers
The parser in `apps/web/components/LessonNotesContent.tsx` converts specific markdown tokens into rich UI components:

```markdown
# Chapter [N]: [Title]
Trigger: Chapter opener layout with FlaskPainter vector, Outfit font, and NCERT QR code.

## 5.2 Nutrition
Trigger: Section heading with purple accent line. Grouped into an individual concept card.

**Example 12.1**
[Problem statement]
**Solution:**
[Step-by-step solution]
Trigger: InteractiveExample widget with collapsible 'Show Solution' disclosure.

**❓ QUESTIONS**
**1. [Question text]?**
*Answer:* [Clear, scoring-friendly answer text]
Trigger: QuestionCard component with individual question cards.

Caution: [Warning text]
Trigger: WarningCard with pitfall alert styling. Also supports > [!NOTE], > [!WARNING], > [!CAUTION].

[JARGON: Term | Simple Definition | Real-world Example]
Trigger: Inline term in running text + expandable callout card underneath.

### Activity 5.1
Caution: [Safety notice]
1. [Step 1]
2. [Step 2]
Trigger: Custom activity box with numbered procedure steps.

## 🎬 Comic Recap
┌────────────────────────────────────────────┐
│ PANEL 1:                                   │
│ Priya: "Why does the toaster wire glow?"   │
│ Rahul: "High-resistance alloy Joule heat." │
├────────────────────────────────────────────┤
│ 📌 REMEMBER THIS!                          │
│ V = IR, H = I²Rt                           │
└────────────────────────────────────────────┘
Trigger: 4-panel comic strip dialogue rendered as alternating speech bubbles between Priya and Rahul.
```

### 6.3 Mathematical & Chemical Syntax
- **LaTeX Math:** Single dollar for inline (`$V = IR$`), double dollar for display (`$$V = IR$$`). Rendered via KaTeX (`throwOnError: false`).
- **Chemical Formulas:** Plain text formulas outside math blocks automatically convert numbers to subscripts (`H2O` → `H₂O`, `CO_2` → `CO₂`, `Fe2O3` → `Fe₂O₃`). Do not manually mangle subscripts inside `$...$` math blocks.

### 6.4 Responsive Vector Diagrams & Figure Tokens
- **Token:** `[FIGURE: figure_id]`
- **Canvas:** 1280×720 aspect ratio (16:9), capped at 324px desktop height.
- **Dark Mode / Slate Canvas:** Never draw light elements (white ash, bubbles, gas fumes, silver metal) on white backgrounds. Use slate `#1E293B`.
- **Numbered Pins:** Labels must use numbered pins on the illustration with an HTML label key below. Never burn non-scalable text into raster images.
- **Supported Figure IDs:** `magnesium_burner`, `double_circulation`, `neuron`, `prism_dispersion`, `bar_magnet_field`, `trophic_levels`, `circuit_symbols`, `ohms_law_circuit`, `basic_circuit`, `series_circuit`, `parallel_circuit`, `combination_reaction`, `decomposition_reaction`, `displacement_reaction`, `electrolysis_of_water`, etc.

---

## 7. Notes Readability & Component Architecture

### 7.1 Single Scannable Column & Card Hierarchy
- **Card-per-H2 Structure:** Each `##` section compiles into a dedicated `.concept-block` card with 22px vertical rhythm.
- **Numbered Eyebrows:** Numbered sections split cleanly into `<p class="concept-eyebrow">Section 5.2.1</p>` and `<h3 class="prose-section-heading">Autotrophic Nutrition</h3>`.
- **Unified Support Cards:** All 7 supplementary learning cards share a unified 12px-gap card geometry with distinct 4px top accent borders:
  * 💡 **Board Tip:** `.lesson-support-board-tips` (Top border `#d49a00`)
  * ⚠️ **Common Mistake:** `.lesson-support-common-mistakes` (Top border `#dc4c64`)
  * ✏️ **Quick Practice:** `.lesson-support-quick-practice` (Top border `var(--accent)`)
  * ⏱️ **1-Minute Revision:** `.lesson-support-one-minute-revision` (Top border `#7357d8`)
  * ❓ **Study Questions:** `.lesson-qa-card` (Top border `var(--primary)`)
  * 🔍 **Practice Feedback:** `.lesson-practice-answer` (Dashed border)
  * 🎭 **Memory Strip:** `.comic-recap-card`
- **Zero Zigzag Alignment:** All media (`[[figure:...]]`, `[[demo:...]]`, `[[written-practice:...]]`, tables, formula blocks) are wrapped in `<div class="concept-media">` constrained to 100% of the reading column.
- **Mobile Stacking:** On viewports $< 960px$, sidebar contents stack cleanly, interactive padding tightens to 16px, and tables scroll horizontally inside the card.
