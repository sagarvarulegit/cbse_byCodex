# Next Task: Create a Chapter Content Style QA Checklist

## Recommended Low-Cost AI Model

Use `gpt-5.4-mini` for the implementation.

Why: this task is mostly structured documentation work with light repo inspection. A smaller model is enough to compare existing lesson-note styles, draft a reusable checklist, and keep the wording short and practical.

## Goal

Create a reusable content-style QA checklist for lesson notes and chapter packs so future pilot chapters stay easy to scan, exam-friendly, and consistent.

## Why This Is Next

- `master_todo.md` has an open P0 item for a chapter content style QA checklist.
- The current pilot chapters now have mixed authoring styles, so a shared checklist will help keep future notes consistent.
- The checklist should support both chapter-pack notes and lesson-wise pages without forcing a new product feature.

## Files To Inspect First

Read these before editing:

1. `docs/project-memory.md`
2. `master_todo.md`
3. `apps/web/content/real-numbers/lessons/01-euclid-division-lemma.md`
4. `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
5. `apps/web/content/two-stories-about-flying/lessons/01-his-first-flight-fear-and-hunger.md`
6. One chapter-pack note for comparison, such as:
   - `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
   - or `docs/content/class-10/english/first-flight/two-stories-about-flying/chapter-pack.md`

## Step 1: Define The Checklist Scope

Make the checklist cover both of these content types:

- lesson-wise pilot pages in `apps/web/content/<chapter>/lessons/*.md`
- chapter-pack notes in `docs/content/**/chapter-pack.md`

The checklist should be short enough to use during editing, but specific enough to catch weak content early.

## Step 2: Draft The Checklist Sections

Include checklist items for these areas:

- easy scanning
- short sections
- example after concept
- memory trick
- common mistake
- board tip
- practice prompt
- answer key
- recap or comic recap

Add one or two pilot-specific items:

- keep tone simple and direct
- avoid copying textbook passages verbatim
- keep uncertain story endings uncertain

## Step 3: Pick The File Location

Prefer a single durable docs file, such as:

- `docs/content-style-qa-checklist.md`

If another docs path already fits the repo better, keep it in `docs/` and explain the choice in the commit message or handoff note.

## Step 4: Add Useful Examples

Add a tiny example for each checklist section so the next author knows what "good" looks like.

Keep examples short and domain-neutral. Use the existing pilot chapters only as inspiration, not as long copied excerpts.

## Step 5: Update Project Memory If Needed

If the work uncovers a durable rule about lesson style, add a concise note to `docs/project-memory.md`.

Good candidates:

- section order that students actually scan well
- a consistent rule for comic recap wording
- a reminder about keeping mystery stories uncertain

## Step 6: Verification Commands

Run these from repo root in this order:

```powershell
git diff --check
```

If the checklist file is linked from another doc, verify that the link target exists and the markdown renders cleanly in the surrounding docs.

## Acceptance Criteria

- A reusable checklist exists in `docs/`.
- The checklist covers both lesson-wise notes and chapter-pack notes.
- The checklist is short, practical, and easy to reuse during content editing.
- Any durable new rule is recorded in `docs/project-memory.md`.
- `git diff --check` passes.

## Out Of Scope

- Do not rewrite the whole curriculum.
- Do not add new runtime behavior.
- Do not change quiz scoring or lesson loading.
- Do not widen the pilot scope.

## Suggested Commit Message

```bash
git add TODO.md docs/content-style-qa-checklist.md docs/project-memory.md
git commit -m "Add chapter content style checklist"
```

After the checklist is committed and pushed, replace this TODO with the next highest-priority pilot hardening task.
