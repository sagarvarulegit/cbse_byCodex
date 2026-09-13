# Notes readability + alignment redesign — plan

## Context

Student complaint: `/chapters/<slug>/notes` (verified on `life-processes`, 8 lessons, e.g. `5.1 What are life processes? and 5.2 Nutrition`) looks unorganised and misaligned, hard to scan. Intended end state: same NCERT content in the same order with the same numbering, but rendered as a calm, aligned, scannable page — one visual card per numbered section, clear heading hierarchy, one body column everything aligns to, unified support/drill cards, clean mobile stacking. No content rewrites, no reordering, no renumbering.

## Approach

Order matters: steps 1–3 build the section skeleton and rhythm everything else sits in; steps 4–6 restyle cards inside that skeleton; step 7 fixes shell/sidebar/mobile. Each step keeps existing tests passing. Do not touch the dead `LegacyChapterNotesPage` in `apps/web/app/chapters/[slug]/notes/page.tsx:27-121` (not exported, not rendered; `CompleteChapterNotesPage` is the default export) — leave it as-is.

### Step 1 — Group each lesson into one card per `h2` (the "organised" fix)

Why: today `LessonNotesContent.renderLessonBlocks` emits a flat grid of siblings into a single `.lesson-prose` (`gap: 14px`), so numbered NCERT sections (`## 5.2 Nutrition`), unnumbered subheads (`## Why food is needed`, `## Events in photosynthesis`), Q&A cards, and support sections all run together as one long wall. Grouping gives every `h2` its own aligned card.

Concrete edit in `apps/web/components/LessonNotesContent.tsx`, function `renderLessonBlocks(blocks, idPrefix, hideDocumentTitle)`:
- Keep the existing special-case branches exactly as-is (`comic recap`, `answer check`, `questions and answers` marker paragraph, support-section variants) — they already consume their body via `collectLessonSectionBody` and return a `<section>`.
- For the fallthrough path only: accumulate output as sections instead of flat blocks. Walk `blocks` with an open `current: { heading: MarkdownBlock & {type:'h2'} | null, body: MarkdownBlock[] }`. On each `h2` (that is not one of the special cases above), flush the previous section via a new helper `renderConceptSection(heading, bodyBlocks, index, idPrefix)` and start a new one. Blocks before the first `h2` flush as `renderConceptSection(null, prefaceBlocks, ...)`.
- New helper signature: `function renderConceptSection(heading: Extract<MarkdownBlock,{type:'h2'}> | null, body: MarkdownBlock[], index: number, idPrefix: string): ReactNode`. It returns `<section className={…} id={heading ? getLessonSectionId(heading.text, idPrefix) : undefined} key={…}>` containing the heading element (see Step 2) followed by `body.map((b, i) => renderBlock(b, index*1000+i, idPrefix))`. Empty body with null heading renders nothing.
- Class names (exact literals): base `concept-block`; plus `concept-block--numbered` when `/^\d+\.\d*/.test(heading.text.trim())` is true, else `concept-block--plain`; preface uses `concept-block concept-block--intro` and no `id`.
- Keys: `concept-${idPrefix}-${index}`; inner blocks keep their existing key scheme so React reconciliation is stable.
- `hideDocumentTitle` behaviour unchanged (skip `h1` before grouping).
- No equivalent grouping helper exists — verified: `collectLessonSectionBody` only collects until the next `h2` for special sections; `chapter-notes-rendering.ts:collectChapterSection` serves only the dead legacy page. New helper is required.
- Empty/missing handling: lesson with zero `h2` → single `--intro` section; trailing body after last `h2` stays in that section; never emit an empty `<section>` (return `null` when heading is null and body is empty).

### Step 2 — Two-level heading hierarchy with numbered eyebrows

Why: today markdown `h2` renders as `<h3 class="prose-section-heading">` and markdown `h3` as `<h4 class="prose-subheading">`, with `prose-section-heading { font-size: 1.45rem; margin-top: 10px }` vs `prose-subheading { 1.1rem }` — numbered NCERT sections and unnumbered subheads (`Why food is needed`) look identical, so scanning by number is impossible.

Concrete edits, same file, inside `renderConceptSection` + `renderBlock`:
- Numbered `h2` (`/^\d+\.\d*/` matches, e.g. `5.2.1 Autotrophic nutrition`): render `<p className="concept-eyebrow">Section {numberPart}</p><h3 className="prose-section-heading prose-section-heading--numbered">{renderInline(rest)}</h3>` where `numberPart` = leading `5.2.1`-style token, `rest` = remainder after it (if remainder empty, render full text as title and skip eyebrow). Split with `/^(\d+(?:\.\d+)*)\s*(.*)$/`.
- Unnumbered `h2` (e.g. `Why food is needed`, `Questions and answers` fallthrough only — the dedicated Q&A/support branches keep their own headers): render `<h3 className="prose-section-heading prose-section-heading--plain">{renderInline(text)}</h3>`.
- `h3` (e.g. `### 5.1 What are life processes?` inside Q&A): unchanged element/class (`h4.prose-subheading`), tightened by CSS only (Step 3).
- Keep all existing `id` values from `getLessonSectionId` on the `<section>` (Step 1); remove the `id` from the inner `h3`/`h4` to avoid duplicate anchors (sidebar/ReadingCompanion target the section id). Update `buildChapterOutline` consumers need nothing — it derives ids from the same `getLessonSectionId` helper.
- Rival pattern to avoid: do not restyle via `::before` content extraction of the number (breaks copy/paste and screen readers); the eyebrow is a real element.

### Step 3 — One rhythm + one alignment column (the "aligned" fix)

Why: `.lesson-prose { display:grid; gap: 14px }` gives headings, paragraphs, lists, tables, code, and demo cards identical spacing; `.prose-table-wrap { margin: 18px 0 24px; min-width: 560px }` overflows the 14px grid and forces horizontal scroll that looks misaligned; figure/demo cards have their own paddings.

Concrete CSS edits in `apps/web/app/globals.css` (reread line numbers before editing; anchors from this session: `.lesson-prose` ~1020, `.prose-section-heading` ~1170, `.prose-table-wrap` ~2473):
- `.lesson-prose`: keep `display:grid; min-width:0` but change to `gap: 22px` (space between concept cards, not between lines).
- Add `.concept-block { display:grid; gap: 12px; align-content:start; min-width:0; padding: 20px 22px; border: 1px solid var(--border); border-radius: 12px; background: var(--card); }` and `.concept-block--intro { background: transparent; border-style: dashed; }`. Numbered vs plain differ only by heading style (Step 2), not by box, so scan stays calm.
- Add `.concept-block > :first-child { margin-top: 0 }`, `.concept-eyebrow { margin:0; font-size:.78rem; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color: var(--muted); }`, `.prose-section-heading { margin: 2px 0 4px; font-size: clamp(1.25rem, 1.6vw + 1rem, 1.5rem); line-height: 1.3; padding-bottom: 8px; border-bottom: 2px solid var(--border); }`, `.prose-section-heading--numbered { border-bottom-color: var(--accent); }`, `.prose-subheading { margin: 14px 0 2px; font-size: 1.08rem; }`, `.prose-paragraph, .prose-list li { max-width: 68ch; }` (single readable column; everything left-aligns to the card padding edge).
- `.prose-list { gap: 8px; margin: 4px 0; }`, `.prose-table-wrap { margin: 6px 0 4px; }` (replaces 18/24 so tables sit in the same rhythm), keep `overflow-x:auto` and `min-width:560px` on the inner table only.
- `.formula-block, .prose-paragraph code` unchanged except left alignment is automatic from the column; no centering.
- Dark mode: no new colors — all rules use existing `var(--card)`, `var(--border)`, `var(--muted)`, `var(--foreground)`, `var(--accent)` so both schemes follow. Do not hardcode hex (per Notes standard §2.2).

### Step 4 — Unify support cards (tips / mistakes / practice / revision / Q&A / answer-check / comic)

Why: four `lesson-support-*` variants currently differ only by `border-left-color`, and `platform-remix.css` overrides them all to the same `var(--remix-line)` border, so they are indistinguishable; Q&A (`lesson-qa-card`), answer-check, and comic each speak a different header language.

Concrete edits in `LessonNotesContent.tsx` (`renderLessonSupportSection`, `renderQuestionAnswerCard`, `renderPracticeAnswerCheck`, `renderComicRecap`) + CSS in `globals.css`:
- Keep every existing class literal and variant string (`lesson-support-board-tips`, `lesson-support-common-mistakes`, `lesson-support-quick-practice`, `lesson-support-one-minute-revision`, `lesson-qa-card`, `lesson-practice-answer`, `comic-recap-card`) — callers/tests key on them. Change header markup only: each card header becomes `<p className="card-eyebrow">` with exact literals `Board tip` / `Common mistake` / `Quick practice` / `1-minute revision` / `Study questions` / `Practice feedback` / `Memory strip`, followed by the existing `h3` title. Reuse the existing `.eyebrow` class plus a per-card icon prefix via CSS `::before` content (`💡`, `⚠️`, `✏️`, `⏱️`, `❓`, `🔍`, `🎭`) — no new props, no new components.
- CSS: give all seven cards the same box (`border:1px solid var(--border); border-radius:12px; padding:18px 20px; display:grid; gap:10px`) and restore distinction with a 4px top accent that survives the remix override: `.lesson-support-board-tips { border-top: 4px solid #d49a00 }`, `common-mistakes → #dc4c64`, `quick-practice → var(--accent)`, `one-minute-revision → #7357d8`, `lesson-qa-card → var(--primary)`, `lesson-practice-answer → var(--border)` with dashed border, `comic-recap-card` untouched structurally. Add one rule after the remix import so it wins over `platform-remix.css:880-896` without editing that file.
- Empty handling: Q&A with zero parsed questions keeps its current fallback (render body blocks); comic with zero panels renders nothing (return `null`).

### Step 5 — Align figures, demos, tables, and equations to the same column

Why: `[[figure:…]]` / `[[demo:…]]` / `[[written-practice:…]]` / `[[exam-practice:…]]` branches in `renderBlock` return bare `<LessonDemo>` / `<WrittenPracticeCard>` / `<ExamPracticeCard>` / `<ActivityIllustration>` with each component's own width, while tables scroll and equations (`<pre class="formula-block">`) stretch — the page edge zigzags.

Concrete edits in `LessonNotesContent.tsx:renderBlock` paragraph branch + CSS:
- Wrap each of the four token branches in `<div className="concept-media">` (exact literal); do the same for the `table` case (`<div className="prose-table-wrap concept-media">` — keep both classes) and the `code` case (`<pre className="formula-block concept-media">`). No prop changes to the inner components.
- CSS: `.concept-media { width: 100%; max-width: 100%; margin: 4px 0; }`, `.concept-media > * { max-width: 100%; }`, figures keep their internal numbered-pin key (`math-figure-key`) unchanged per AGENTS.md figure-label rule. `ActivityDiagramViewer` / `ActivityIllustration` need no edits — the wrapper constrains them.
- Missing-definition handling unchanged: `written/exam-practice` with no definition still returns `null`.

### Step 6 — Fold the Board Exam Drill into the same card language

Why: `ChapterPyqDrill` ships its own `<style jsx>` dialect (amber `#fffbeb` header, red `#dc2626` badge, `#7c3aed` inline button styles) that clashes with the lesson cards and breaks alignment (action row uses inline `display:flex`).

Concrete edits in `apps/web/components/ChapterPyqDrill.tsx` (keep all exported helpers `drillTopic`, `drillDemandLines`, `drillPaperRef`, `drillWeightage`, `getPyqsForChapter` and the `ChapterPyqItem` type byte-identical — tests import them):
- Delete the entire `<style jsx>` block (~lines 303-558) and the two inline `style={{…}}` props (action row div, Snap & Grade button). Replace with existing lesson-card classes: root keeps `chapter-pyq-drill-root` + `concept-block` semantics via CSS only; header card uses `lesson-support-section lesson-support-board-tips` + keeps `pyq-*` inner classes for text; each question card keeps `pyq-card` but rendered inside the same 12px-gap rhythm.
- Move the deleted rules into `globals.css` under the same `pyq-*` selectors, remapped to theme vars: header background `var(--card)`, badge `var(--foreground)`/`var(--background)`, pills `var(--card-soft)`, buttons reuse `.button-link` / `.ghost-link` classes already used in the chapter hero (no new button component). Exact visual values are in the deleted block — copy them over replacing only hex with the var equivalents listed here, so the drill reads as part of the notes instead of a separate site.
- Behaviour unchanged: `openIds`/`revealedIds` toggles, `AiAnswerEvaluatorModal` props, weightage strip text all stay.

### Step 7 — Chapter shell, sidebar, and mobile stacking

Why: `CompleteChapterNotesPage` stacks hero → reading companion → `lesson-shell (1fr + 320px)` → 8 `<details class="complete-chapter-part">` (only first `open`) → drill; on narrow screens the 320px sidebar squeezes the prose column and tables overflow; part headers (`54px` number chip + title) baseline-drift.

Concrete edits in `CompleteChapterNotesPage.tsx` (markup, no data changes) + `globals.css`:
- Keep `<details>`/`<summary>` mechanics and `open={index===0}` exactly (deep links + `SectionFocusHandler` depend on them). Add `className="complete-chapter-part-body"` to the existing `<div className="lesson-prose">` wrappers (both lesson and pack branches) so Step 3 spacing applies without touching the grid.
- CSS: `.complete-chapter-shell { gap: 22px }`; `.complete-chapter-part-header { align-items: center; }` (fixes chip/title drift; was `start`); sidebar `.complete-chapter-sidebar { position: sticky; top: 96px; }` on desktop only; in the existing mobile breakpoint that already collapses `.lesson-shell` to one column (~line 3149 `lesson-shell` rule), add `.complete-chapter-sidebar { position: static; }` + `.concept-block { padding: 16px; }` + `.complete-chapter-part-header { grid-template-columns: 44px minmax(0,1fr); }`. Reuse the existing breakpoint — do not invent a new one.
- Active-section highlight: `SectionFocusHandler` + `ReadingCompanion` already track section ids; add only CSS `.chapter-contents-nav a[aria-current="true"], .chapter-contents-nav a.active { background: var(--card-soft); color: var(--foreground); }` and, if neither component sets such an attribute (unverified — confirm first in `SectionFocusHandler.tsx`/`ReadingCompanion.tsx`), skip the highlight rather than inventing scroll-spy logic.

## Critical files & anchors

- `apps/web/components/LessonNotesContent.tsx` — `renderLessonBlocks` (~76-141), `renderBlock` h2/h3/table/code/token branches (~282-390); sole renderer for complete-chapter notes.
- `apps/web/app/chapters/[slug]/notes/CompleteChapterNotesPage.tsx:194-302` — chapter shell, `<details>` parts, sidebar nav; markup hooks for Steps 1/7.
- `apps/web/components/ChapterPyqDrill.tsx:97-302` + `<style jsx>` (~303-558) — drill cards and inline styles unified in Step 6.
- `apps/web/app/globals.css` — `.lesson-prose` (~1020), `.concept`/`prose-*` (~1105-1235), `.prose-table-wrap` (~2473), mobile `.lesson-shell` (~3149); all rhythm/alignment CSS lands here.
- `apps/web/content/life-processes/lessons/01-life-processes-and-nutrition-in-plants.md:20-123` — representative content (numbered + unnumbered `h2`, Q&A, tracker, equation, figure/demo tokens) used to eyeball every step.

## Verification

Prerequisite: `npm run dev:web` from repo root (web on port 3000). No new test framework; per repo preference run only focused checks.
- Visual pass on `/chapters/life-processes/notes` (desktop 1280px + mobile 390px, light + dark): each numbered NCERT section sits in its own card with `Section N` eyebrow; `Why food is needed` / `Events in photosynthesis` render as plain subheads inside their parent card, not as peer cards; paragraphs/lists/tables/figures share one left edge; drill cards use the same card chrome as lesson cards (no amber/red clash); sidebar sticks on desktop and stacks above content on mobile; no horizontal page scroll (tables scroll internally only).
- Content-fidelity pass: headings appear in textbook order `5.1 → Questions and answers → Why food is needed → 5.2 → 5.2.1 → Events…` with identical numbering text; figure/demo tokens (`figure-5-1`, `activity-5-1`) still render; anchor links (`#lesson-…`, `#board-exam-drill`) still jump.
- Focused regression: run the existing notes/rendering suites only — `npx tsc --noEmit -p apps/web` is the lint-equivalent typecheck; plus any `*.test.ts` under `apps/web/lib` matching `chapter-notes-rendering` / `chapter-pyq-drill` if the runner is available. If the runner is not installed, skip with a note (do not install).
- Risky-step checks: after Step 1, confirm a lesson with zero `h2` (e.g. a quiz-only block list) still renders one intro card; after Step 6, confirm drill reveal/hide + Snap & Grade modal still open.

## Assumptions & contingencies

- Assumed (user-overridable): CSS-first redesign with one small grouping change is enough; no copy rewrites, no IA/reordering, no new design system or dependencies. If the user instead wants a heavier visual direction (e.g. anime/Gen-Z per `docs/video-style-guide.md`), do that as a separate theme pass on top of this skeleton.
- If `SectionFocusHandler`/`ReadingCompanion` do not expose an active-section attribute, drop the sidebar-highlight CSS and ship without it (do not build scroll-spy).
- If the existing mobile breakpoint refutes the ~3149 anchor (file drift), reuse whatever breakpoint already collapses `.lesson-shell` — if none exists, add `@media (max-width: 960px) { .lesson-shell { grid-template-columns: minmax(0,1fr); } }`.
- If the drill `<style jsx>` class inventory differs from this session's read (file drift), keep every `pyq-*` literal found in JSX and move all of them; never rename a selector the JSX uses.
