# Next Task: Make Pilot Chapter Entry Points Say What To Do First

## Recommended Low-Cost AI Model

Use `gpt-5.4-mini` with `reasoning.effort: low`.

Why this is the best fit: the task is mostly targeted UI copy and small chapter-entry logic, with light inspection of existing chapter and subject pages.

Fallbacks:

- Cheapest acceptable option: `gpt-5.4-nano` with `reasoning.effort: low`, only if the change stays to copy and link text.
- Higher-confidence option: `gpt-5.4-mini` with `reasoning.effort: medium`, only if the entry-point logic needs a small layout rethink.
- Avoid for this task: `gpt-5.5` at `medium` or higher effort, because the task is narrow and does not justify the extra cost.

## Goal

Make every pilot chapter entry point tell the student the best first action clearly, without forcing them to guess whether they should read notes, open the first lesson, or take the quiz.

## Why This Is Next

- `master_todo.md` still has an open P0 item for pilot chapter completeness.
- The current chapter pages already know whether a chapter has lesson notes, chapter-pack notes, or a quiz.
- Pilot chapters should feel guided, not like a catalog page with generic links.

## Keep This Task Focused

Do not rewrite chapter content, quiz questions, or mastery logic for this task.

Keep the work limited to the chapter entry surfaces and any small helper copy needed to make the first action obvious.

## Files To Inspect Before Editing

Read these files first:

1. `docs/project-memory.md`
2. `master_todo.md`
3. `TODO.md`
4. `apps/web/app/chapters/[slug]/page.tsx`
5. `apps/web/app/chapters/[slug]/notes/page.tsx`
6. `apps/web/app/subjects/[slug]/page.tsx`
7. `apps/web/lib/course-content.ts`
8. `apps/web/lib/pilot.ts`

If you need to compare the live chapter surfaces, also inspect the current pilot chapter data for:

- Real Numbers
- Chemical Reactions and Equations
- Two Stories about Flying

## Expected Behavior

- Pilot chapter pages should show a single obvious best first action near the top.
- If lesson notes are live, the first action should guide the student to the first lesson.
- If only chapter-pack notes are live, the first action should guide the student to the chapter notes.
- If a quiz is the best next step, the page should say that directly.
- Non-pilot chapters should keep truthful `Coming soon` behavior.

## Acceptance Criteria

- Each pilot chapter has a clear first action without scrolling through the whole page.
- The action label matches the real content state.
- The copy does not overpromise unavailable lessons or notes.
- The chapter card or hero still keeps the secondary action visible.
- The change does not introduce broken links or hide the quiz path.

## Verification

Run:

```powershell
git diff --check
```

Then verify the chapter pages still behave correctly for the three pilot chapters on both the chapter overview and the lesson path.

If the change touches app code, also run the normal repo checks for the affected surface.

## Out Of Scope

- Do not add payments or subscriptions.
- Do not change quiz scoring or answer validation.
- Do not rewrite the pilot chapter content packs.
- Do not add a new database table.
