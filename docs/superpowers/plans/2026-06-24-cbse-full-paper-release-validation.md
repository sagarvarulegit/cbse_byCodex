# CBSE Full Paper, Attempts, and Release Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver secure feature-gated board-preparation dashboards, timed immutable paper attempts, objective scoring, descriptive self-assessment, weak-area reporting, and repeatable release gates.

**Architecture:** Generate papers on the Next.js server from the file-backed bank, sign full snapshots with a shared server-only secret, and persist immutable attempts/responses in the Express/Prisma API. Return student-safe paper data before submission and full review data only after submission.

**Tech Stack:** Next.js 15, React 19, Express 4, Prisma 6, PostgreSQL, TypeScript, Node tests, Playwright for browser smoke, HMAC-SHA256 using Node `crypto`.

## Global Constraints

- Plans 1-7 must pass for their respective subject activation.
- Feature flag defaults off.
- Correct answers, model answers, explanations, and rubrics must not reach the browser before submission.
- Every retry is a new immutable attempt.
- Historical submitted papers must remain stable after question-bank changes.
- Descriptive answers receive no automatic marks.
- Signing secrets are server-only and never use `NEXT_PUBLIC_`.
- Preserve existing chapter quiz attempts and mastery behavior.
- Do not claim a subject board-ready while blueprint status is provisional or blocked.
- Add Playwright only as a development dependency.

---

## File Structure

**Create:**

```text
apps/api/prisma/migrations/20260624180000_add_board_paper_attempts/migration.sql
apps/api/src/lib/board-paper-signature.ts
apps/api/src/lib/board-paper-signature.test.ts
apps/api/src/lib/board-paper-attempts.ts
apps/api/src/lib/board-paper-attempts.test.ts
apps/api/src/routes/board-preparation.ts
apps/web/lib/board-preparation.ts
apps/web/lib/board-preparation.test.ts
apps/web/lib/board-paper-signature.ts
apps/web/app/api/board-preparation/subjects/[subjectSlug]/route.ts
apps/web/app/api/board-preparation/papers/route.ts
apps/web/app/api/board-preparation/attempts/route.ts
apps/web/app/api/board-preparation/attempts/[attemptId]/route.ts
apps/web/app/api/board-preparation/attempts/[attemptId]/submit/route.ts
apps/web/app/api/board-preparation/attempts/[attemptId]/self-assessment/route.ts
apps/web/app/subjects/[slug]/board-preparation/page.tsx
apps/web/app/subjects/[slug]/practice/[questionType]/page.tsx
apps/web/app/subjects/[slug]/chapter-tests/[chapterSlug]/page.tsx
apps/web/app/subjects/[slug]/mock-tests/page.tsx
apps/web/app/board-papers/[paperId]/page.tsx
apps/web/app/board-papers/[paperId]/attempts/[attemptId]/page.tsx
apps/web/components/BoardPreparationDashboard.tsx
apps/web/components/BoardPaperAttemptForm.tsx
apps/web/components/BoardPaperReview.tsx
apps/web/components/ReadinessBreakdown.tsx
apps/web/e2e/board-preparation.spec.ts
apps/web/playwright.config.ts
docs/curriculum/release-board-paper-checklist.md
```

**Modify:**

```text
package.json
apps/web/package.json
apps/api/prisma/schema.prisma
apps/api/src/app.ts
apps/api/src/routes/progress.ts
apps/web/app/globals.css
apps/web/app/subjects/[slug]/page.tsx
apps/web/lib/curriculum/coverage.ts
apps/web/lib/question-bank/types.ts
apps/web/.env.example
apps/api/.env.example
docs/deployment.md
docs/project-memory.md
```

## Persistence Model

Add:

```prisma
enum BoardPaperAttemptStatus {
  in_progress
  submitted
  expired
}

model BoardPaperAttempt {
  id                    String                  @id @default(cuid())
  userId                String
  subjectCode           String
  academicSession       String
  paperId               String
  seed                   String
  bankVersion            String
  title                  String
  attemptNumber          Int
  status                 BoardPaperAttemptStatus @default(in_progress)
  maximumMarks           Int
  durationMinutes        Int
  questionSnapshot      Json
  signature              String
  objectiveMarks        Int                     @default(0)
  maximumObjectiveMarks Int                     @default(0)
  startedAt             DateTime                @default(now())
  expiresAt             DateTime
  submittedAt           DateTime?
  createdAt             DateTime                @default(now())
  updatedAt             DateTime                @updatedAt

  user            User                       @relation(fields: [userId], references: [id])
  responses       BoardPaperResponse[]
  selfAssessments BoardPaperSelfAssessment[]

  @@unique([userId, subjectCode, attemptNumber])
  @@index([userId, subjectCode, createdAt])
  @@index([paperId, createdAt])
}

model BoardPaperResponse {
  id         String   @id @default(cuid())
  attemptId  String
  questionId String
  response   Json
  savedAt    DateTime @default(now())
  updatedAt  DateTime @updatedAt

  attempt BoardPaperAttempt @relation(fields: [attemptId], references: [id])

  @@unique([attemptId, questionId])
}

model BoardPaperSelfAssessment {
  id                     String   @id @default(cuid())
  attemptId              String
  questionId             String
  selectedRubricPointIds String[]
  awardedMarks           Int
  maximumMarks           Int
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  attempt BoardPaperAttempt @relation(fields: [attemptId], references: [id])

  @@unique([attemptId, questionId])
}
```

Add relations to `User`.

### Task 1: Add signed immutable attempt persistence

**Files:**
- Modify Prisma schema
- Add migration
- Create API signature helper/tests

- [ ] **Step 1: Write signature tests**

Use canonical JSON with sorted object keys. Assert:

- Same payload/secret gives same signature.
- Changed question mark invalidates signature.
- Wrong secret fails verification.

Interfaces:

```ts
signBoardPaperSnapshot(snapshot: unknown, secret: string): string
verifyBoardPaperSnapshot(snapshot: unknown, signature: string, secret: string): boolean
```

- [ ] **Step 2: Implement HMAC-SHA256**

Use Node `createHmac` and `timingSafeEqual`.

- [ ] **Step 3: Add Prisma models and migration**

Migration must create enum, tables, foreign keys, unique constraints, and indexes.

- [ ] **Step 4: Generate client and test**

```powershell
npm.cmd run prisma:generate -w apps/api
npm.cmd run test -w apps/api
npm.cmd run lint -w apps/api
```

- [ ] **Step 5: Commit**

```powershell
git add apps/api/prisma apps/api/src/lib/board-paper-signature.ts apps/api/src/lib/board-paper-signature.test.ts
git commit -m "Add immutable board paper attempts"
```

### Task 2: Add API attempt lifecycle

**Files:**
- Create API helper/tests and route
- Modify app bootstrap

**Interfaces:**

```ts
POST /v1/board-preparation/attempts
PATCH /v1/board-preparation/attempts/:attemptId/responses
GET /v1/board-preparation/attempts/:attemptId
POST /v1/board-preparation/attempts/:attemptId/submit
PUT /v1/board-preparation/attempts/:attemptId/self-assessment
```

- [ ] **Step 1: Write normalization tests**

Reject:

- Invalid signature
- Empty subject/session/paper ID
- Expiry before start
- Response for unknown question ID
- Response mutation after submission
- Self-assessment before submission
- Marks above rubric maximum

- [ ] **Step 2: Implement start**

The API:

1. Requires student session.
2. Verifies snapshot signature using `BOARD_PAPER_SIGNING_SECRET`.
3. Counts previous attempts for user/subject.
4. Stores full snapshot and signature.
5. Returns student-safe snapshot created by removing answer/review fields.

- [ ] **Step 3: Implement autosave**

Upsert one response per question. Permit only `in_progress` attempts owned by the user.

- [ ] **Step 4: Implement submit**

Use the stored full snapshot. Score objective responses inside the API through a small pure adapter matching Plan 2's scoring rules. Do not trust marks from the browser.

Set status/submittedAt/objective marks in one transaction.

- [ ] **Step 5: Implement review**

Before submission return student-safe content. After submission return model answers, explanations, rubrics, responses, and objective results.

- [ ] **Step 6: Implement self-assessment**

Validate selected rubric IDs against stored snapshot and calculate marks server-side.

- [ ] **Step 7: Mount route and test**

```powershell
npm.cmd run test -w apps/api
npm.cmd run lint -w apps/api
npm.cmd run build -w apps/api
```

- [ ] **Step 8: Commit**

```text
Add board paper attempt API
```

### Task 3: Add secure Next.js generation and proxy routes

**Files:**
- Create web signature/helper/proxies
- Add env examples

- [ ] **Step 1: Write helper tests**

Test feature flag:

```ts
isBoardPreparationEnabled(env): boolean
```

Only exact values `1` or `true` enable it.

- [ ] **Step 2: Implement paper generation route**

`POST /api/board-preparation/papers` accepts:

```ts
{
  assessmentType: 'chapter-test' | 'mock-test' | 'full-paper';
  chapterSlug?: string;
  seed: string;
  subjectSlug: string;
}
```

The server:

1. Checks feature flag.
2. Resolves current subject.
3. Rejects internal/future/provisional-blocked subjects.
4. Loads valid questions.
5. Assembles full snapshot.
6. Signs full snapshot.
7. Starts API attempt.
8. Returns safe attempt.

- [ ] **Step 3: Implement attempt proxies**

Forward the student session token using existing proxy patterns. Never log snapshots or responses.

- [ ] **Step 4: Add env variables**

```text
BOARD_PREPARATION_ENABLED=false
BOARD_PAPER_SIGNING_SECRET=
```

Both web and API require the same non-empty signing secret in enabled environments.

- [ ] **Step 5: Test/build and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
git add apps/web/app/api/board-preparation apps/web/lib/board-preparation* apps/web/lib/board-paper-signature.ts apps/web/.env.example apps/api/.env.example
git commit -m "Add secure board paper proxies"
```

### Task 4: Add board-preparation dashboard and readiness breakdown

**Files:**
- Create dashboard/readiness components and route
- Modify subject page/CSS

- [ ] **Step 1: Write pure view-model tests**

Create:

```ts
buildBoardPreparationViewModel(
  subject: CurriculumSubject,
  coverage: SubjectCoverageReport,
): BoardPreparationViewModel
```

Assert it shows separate dimensions and an actionable first blocker.

- [ ] **Step 2: Implement route**

Show:

- Code/session/marks/duration
- Source verification date
- Curriculum, notes, reviewed-bank, type, paper, and publication readiness
- Missing coverage
- Chapter tests
- Type practice
- Mock tests

HPE and future subjects must not expose this route.

- [ ] **Step 3: Add subject-page link**

Only show when feature enabled and subject is active board mode.

- [ ] **Step 4: Responsive CSS**

Use existing design tokens. Add no UI library.

- [ ] **Step 5: Test/build and commit**

```text
Add board preparation dashboard
```

### Task 5: Add timed attempt and immutable review UI

**Files:**
- Create attempt/review components and routes

- [ ] **Step 1: Write component-helper tests**

Test:

- Time remaining calculation.
- Expired attempt submission state.
- Safe question grouping by section.
- Response serialization.
- Descriptive self-assessment totals.

- [ ] **Step 2: Implement attempt form**

Features:

- Section navigation
- Marks shown per question
- Radio inputs for objective questions
- Textareas for descriptive responses
- Accessible assets
- Autosave after response change with 500 ms debounce
- Time remaining
- Submit confirmation
- Locked submitted state

- [ ] **Step 3: Implement review**

After submission show:

- Student response
- Correct objective answer
- Model answer
- Explanation
- Rubric checklist
- Saved self-assessment
- New-attempt button

Never re-enable the submitted response fields.

- [ ] **Step 4: Test/build and commit**

```text
Add timed board paper attempts
```

### Task 6: Add weak-area reporting without false blame

**Files:**
- Modify web/API helpers and dashboard
- Modify coverage types

- [ ] **Step 1: Write classification tests**

Classify:

```ts
type WeakAreaReason =
  | 'low-score'
  | 'unattempted'
  | 'platform-question-gap'
  | 'platform-review-gap';
```

If no reviewed questions exist, return `platform-question-gap`, never `low-score`.

- [ ] **Step 2: Implement aggregation**

Use objective results and self-assessment by curriculum refs, topic, type, and marks.

- [ ] **Step 3: Show recommended next action**

Examples:

- Practise 3-mark proofs
- Review map work
- Complete poetry extract practice
- Platform content is still being reviewed

- [ ] **Step 4: Verify and commit**

```text
Add honest board weak area reporting
```

### Task 7: Add Playwright end-to-end smoke

**Files:**
- Modify web package
- Create config/spec

- [ ] **Step 1: Add development dependency and script**

```json
"test:e2e": "playwright test"
```

- [ ] **Step 2: Configure local web server**

Use existing `dev` command and a test-only authenticated setup consistent with current auth. Do not hard-code production credentials.

- [ ] **Step 3: Cover full flow**

Test:

1. Login/register test student.
2. Open Mathematics board-preparation dashboard.
3. Start a deterministic mock.
4. Save objective and descriptive responses.
5. Reload and confirm autosave.
6. Submit.
7. Confirm fields lock.
8. Confirm model answers appear only after submit.
9. Save rubric self-assessment.
10. Start retry and confirm a different attempt ID.

- [ ] **Step 4: Add feature-disabled test**

Navigation and routes must be unavailable when flag is false.

- [ ] **Step 5: Run and commit**

```powershell
npm.cmd run test:e2e -w apps/web
git add apps/web/package.json package-lock.json apps/web/playwright.config.ts apps/web/e2e
git commit -m "Add board preparation browser smoke"
```

### Task 8: Release gates, deployment, and production smoke

**Files:**
- Create release checklist
- Modify deployment/project memory

- [ ] **Step 1: Document deploy order**

```text
API code deploy
Prisma migration deploy
Web code deploy
Set matching signing secret
Enable feature for internal review
Authenticated production smoke
Small Mathematics pilot
```

- [ ] **Step 2: Add release script/checks**

Require:

- Zero curriculum validation issues
- Zero question validation issues
- Three valid seeds for activated subject
- Current blueprint status
- Browser smoke
- Production authenticated save/submit/review

- [ ] **Step 3: Run full local verification**

```powershell
npm.cmd run test -w apps/web
npm.cmd run test -w apps/api
npm.cmd run lint
npm.cmd run build
npm.cmd run test:e2e -w apps/web
graphify update .
git diff --check
git status --short
```

- [ ] **Step 4: Production smoke**

Require exact evidence:

- Attempt start returns `201`.
- Autosave persists after reload.
- Submission returns submitted status.
- Objective marks match expected test answers.
- Model answers are absent before submit and present after.
- Retry creates attempt number +1.
- Admin/database evidence shows separate immutable rows.

- [ ] **Step 5: Update durable memory**

Record signing, snapshot, deploy order, and authenticated smoke requirements.

- [ ] **Step 6: Commit**

```text
Document board preparation release gates
```

## Acceptance Criteria

- Feature defaults off.
- Signed full snapshots are persisted.
- Correct answers remain server-side before submit.
- Attempts and retries are immutable.
- Autosave, expiry, submit, review, and self-assessment work.
- Objective marks are server-calculated.
- Descriptive marks are self-assessed/manual only.
- Readiness dimensions and weak-area reasons are honest.
- Playwright covers the complete flow.
- Activated subjects satisfy current-blueprint and three-paper gates.
- Authenticated production smoke evidence is recorded.
