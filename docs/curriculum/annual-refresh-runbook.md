# Annual Curriculum Refresh Runbook

Use this runbook when moving the curriculum source of truth from one CBSE academic session to the next. The goal is to refresh the registry without losing historical evidence, without silently changing student routes, and without activating a new session until validation is clean.

## Scope

This runbook is for the curriculum source of truth that drives:

- `apps/web/lib/curriculum/official-sources.ts`
- `apps/web/lib/curriculum/registry.ts`
- `apps/web/lib/curriculum/validation.ts`
- `apps/web/lib/curriculum/coverage.ts`
- `apps/web/lib/curriculum/subject-navigation.ts`
- `apps/web/lib/curriculum/subjects/class-10/*.ts`
- `apps/web/app/subjects/page.tsx`
- `apps/web/app/subjects/[slug]/page.tsx`
- `apps/web/lib/course-content.ts`
- `docs/curriculum/official-source-register.md`

## Non-negotiable rules

- Do not overwrite old source IDs. Add new session-specific IDs and keep prior sessions for historical comparison.
- Do not activate a new academic session until every active subject has zero validation issues.
- Historical sample papers and board papers may help comparison, but they cannot silently define the active blueprint.
- Preserve existing chapter and quiz routes unless a deliberate migration plan also updates mapped platform slugs and route tests.

## Pre-refresh checklist

- Start from a clean checkout or isolate unrelated local changes before editing curriculum files.
- Read the current source register in `docs/curriculum/official-source-register.md` and the active implementation under `apps/web/lib/curriculum`.
- Confirm the new academic session string before changing anything, for example `2027-28`.
- Collect the new CBSE curriculum index URL plus every subject PDF URL you plan to register.
- Record the reviewer name and planned verification date up front so the final review note is not skipped.

## Step 1: Verify the new curriculum index

Goal: prove that the new session exists in official CBSE sources before touching the active session constant.

Checklist:

- Open the current curriculum index URL from `apps/web/lib/curriculum/official-sources.ts`.
- Find the new CBSE curriculum index for the target session.
- Confirm that the new index links to the expected Class X subject PDFs.
- Record the exact verification date in ISO format `YYYY-MM-DD`.
- Keep the prior session index source in the register for history; do not delete it just because a new session exists.

Operational notes:

- The active session is controlled explicitly by `ACTIVE_CURRICULUM_SESSION` in `apps/web/lib/curriculum/official-sources.ts`.
- The registry reads that value through `getActiveCurriculumSession()` in `apps/web/lib/curriculum/registry.ts`.

Acceptance criteria:

- A new official curriculum index is verified.
- The session string is explicit and unambiguous.
- The verification date is recorded.

## Step 2: Register new source IDs without overwriting old sessions

Goal: add new official sources while preserving historical provenance.

Edit these files:

- `apps/web/lib/curriculum/official-sources.ts`
- `docs/curriculum/official-source-register.md`

Checklist:

- Add a new index source ID for the target session.
- Add new subject curriculum source IDs for each current Class 10 subject.
- Keep prior sample-paper and board-paper records as historical evidence.
- Update notes so every record clearly says whether it drives the current curriculum, the current blueprint, or historical comparison only.
- Keep `SOURCE_VERIFIED_ON` aligned with the refresh review date if all current-session sources were rechecked together.

Required comparison targets:

- Mathematics Standard (`041`)
- Mathematics Basic (`241`)
- Science (`086`)
- Social Science (`087`)
- English Language and Literature (`184`)
- Hindi Course B (`085`)
- Health and Physical Education (`HPE`)
- Information Technology (`402`)
- Artificial Intelligence (`417`) only if the official source is verified and activation is intentional

Acceptance criteria:

- Old source IDs remain intact.
- New source IDs are session-specific.
- Historical papers are still present but clearly marked historical.
- Current source notes explain whether they drive curriculum, blueprint, or comparison only.

## Step 3: Compare units, marks, texts, maps, excluded topics, and question design

Goal: refresh the actual subject registry, not just the source register.

Edit these files as needed:

- `apps/web/lib/curriculum/subjects/class-10/*.ts`
- `apps/web/lib/curriculum/types.ts` only if CBSE truly changes the domain model
- `apps/web/lib/curriculum/validation.ts` only if the validation contract must change

Per-subject checklist:

1. Units and marks
   - Recheck unit names and marks against the latest official curriculum.
   - Confirm `examProfile.sectionRules` totals still equal `maximumMarks`.

2. Prescribed texts and books
   - Recheck English and Hindi text lists.
   - Recheck `books` and `officialSourceIds` for every affected subject.

3. Map work and mixed scope
   - Recheck Social Science map-skill topics.
   - Recheck any chapter that mixes `board-exam` with `project-only`, `periodic-only`, or `excluded`.

4. Excluded topics and duplicate packs
   - Recheck excluded duplicate Social Science pack mappings so Social Science still appears once in the catalog.
   - Recheck that excluded chapters do not inflate live counts or duplicate route slugs.

5. Question design
   - Recheck `requiredQuestionTypes`, `minimumReviewedQuestionCount`, and section-level allowed question types.
   - Recheck blueprint source references used by each `examProfile`.

Current invariants that must survive the refresh:

- Mathematics Standard and Mathematics Basic remain separate profiles.
- HPE remains an internal-assessment subject, not a board-paper subject.
- Information Technology and Artificial Intelligence stay hidden future subjects unless activation is explicitly completed.
- Social Science appears once in the subject catalog even though excluded duplicate platform packs exist for some chapters.

Acceptance criteria:

- Five core board subjects have valid registry definitions.
- Mathematics Standard and Basic are still distinct.
- HPE is still internal assessment.
- AI and IT are hidden future subjects unless intentionally activated with verified evidence.
- Social Science appears once in the visible catalog.

## Step 4: Resolve every changed scope before activation

Goal: no scope drift is left half-migrated.

Checklist:

- Review every chapter and topic whose scope changed between sessions.
- Resolve all `board-exam`, `internal-only`, `project-only`, `periodic-only`, `supporting-resource`, and `excluded` changes intentionally.
- If a platform chapter slug is reused across scopes, verify `validateCurriculumSubject()` still reports zero contradictory scope issues.
- If CBSE removes a chapter from board scope, move it deliberately instead of leaving stale board mappings behind.
- If a chapter now needs no platform route, remove or re-scope the mapping explicitly rather than leaving dead coverage expectations.

Acceptance criteria:

- No changed scope is left unresolved.
- No active subject has contradictory platform scope mappings.
- Board-only coverage formulas still reflect only board-exam chapters and topics.

## Step 5: Mark previous sample papers historical

Goal: old question papers stay available for comparison without silently driving current-session logic.

Checklist:

- Keep previous sample-paper index entries in `official-sources.ts`.
- Keep previous board-paper archive entries in `official-sources.ts`.
- Update the notes in both `official-sources.ts` and `docs/curriculum/official-source-register.md` so older papers are explicitly historical.
- Do not use a historical sample paper as the only blueprint source for a newly activated session unless that choice is called out as a temporary explicit comparison rule.

Acceptance criteria:

- Previous sample papers are clearly historical.
- Historical question papers cannot silently drive the current blueprint.

## Step 6: Run registry and coverage tests

Goal: prove that the registry, validation, subject catalog, and coverage formulas still agree.

Commands:

```powershell
npm.cmd run test -w apps/web
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
git diff --check
git status --short
```

What the web test suite must cover:

- `apps/web/lib/curriculum/registry.test.ts`
- `apps/web/lib/curriculum/validation.test.ts`
- `apps/web/lib/curriculum/coverage.test.ts`
- `apps/web/lib/course-content.test.ts`

Specific things to confirm from the test evidence:

- Current sources are registered and validated.
- Historical evidence is clearly marked.
- Coverage dimensions still use explicit numerator and denominator formulas from `apps/web/lib/curriculum/coverage.ts`.
- Subject routes still resolve aliases through `SUBJECT_ROUTE_ALIASES`.
- Existing chapter and quiz routes still work with the current mapped slugs.
- Hard-coded valid subject slugs do not need to be reintroduced; the registry and subject-navigation helpers remain the source of truth.

Acceptance criteria:

- Tests pass.
- Build passes.
- Lint passes.
- `git diff --check` is clean.
- The status output contains only the intended refresh changes.

## Step 7: Record reviewer and verification date

Goal: leave an audit trail that a smaller model can trust later.

Checklist:

- Record reviewer name.
- Record verification date.
- Record the new active session string.
- Record which official sources were checked manually.
- Record any temporary historical-paper dependency explicitly if one still exists.

Recommended review note template:

```md
- Reviewer: <name>
- Verification date: YYYY-MM-DD
- Activated session: <session>
- Verified sources: <source ids>
- Remaining concerns: <none or concise list>
```

Acceptance criteria:

- Reviewer and verification date are captured in the refresh PR or session notes.

## Step 8: Activate the new session only after zero validation issues

Goal: switch the live catalog only when the registry is coherent.

Activation checklist:

- Confirm every active subject returns zero issues from `validateCurriculumSubject(...)`.
- Confirm visible subjects are the intended current-session catalog.
- Confirm the subject pages still render from registry data:
  - `apps/web/app/subjects/page.tsx`
  - `apps/web/app/subjects/[slug]/page.tsx`
- Confirm `getVisibleCurriculumSubjects()` exposes the intended active list.
- Confirm `getCurriculumSubject()` resolves canonical slugs for the active session.
- Confirm route aliases still resolve safely for `english`, `hindi`, and `mathematics`.

Acceptance criteria:

- Zero validation issues remain for active subjects.
- The new session is activated only after the registry is clean.
- Subject and chapter routes remain functional.

## Final refresh acceptance gate

A yearly refresh is complete only when all of the following are true:

- The new curriculum index is verified.
- New source IDs are registered without deleting old sessions.
- Units, marks, texts, maps, excluded topics, and question design are updated deliberately.
- Previous sample papers are marked historical.
- Registry and coverage tests pass.
- Every changed scope is resolved.
- Reviewer and verification date are recorded.
- The new session is activated only after zero validation issues.
