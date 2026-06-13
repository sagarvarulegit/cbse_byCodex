# Gamification Mastery Ladder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the V1 personal Chapter Mastery Ladder so students can improve chapter mastery through video completion, quiz performance, revision missions, and useful unlocks.

**Architecture:** Keep raw learning activity in `ProgressEvent`, add aggregate tables for `ChapterMastery`, `QuizAttempt`, and `RevisionMission`, and update aggregates synchronously after quiz submission for V1. Keep scoring in a pure library so it is easy to test and later move aggregation to a background job. Use the existing Next.js API proxy pattern so the web app never exposes backend auth tokens to client code.

**Tech Stack:** TypeScript, Express, Prisma/PostgreSQL, Node test runner, Next.js App Router, existing cookie-based student session.

---

## Model Recommendation For This Implementation

Use a higher-intelligence model for Tasks 1 through 7 because they define the schema, scoring rules, API boundaries, and first student flow. Use a cheaper/light model only after the backend and integration path are stable, mainly for copy variants, CSS polish, quiz metadata cleanup, and repetitive content tagging. If choosing one model for the whole implementation, choose the stronger coding/reasoning model until `npm run test -w apps/api`, `npm run lint`, and the manual quiz-to-mastery flow are passing.

## Scope

This plan implements the approved V1 only:

- Chapter Mastery Score
- Learner, Skilled, Exam Ready, Topper Track levels
- Video completion plus quiz score based mastery
- Revision Mission creation after weak quiz scores
- Dashboard and chapter page mastery display
- Manual score submission for existing markdown quizzes

This plan does not implement leaderboards, public ranking, coins, avatars, predicted board marks, or a full quiz authoring CMS.

## File Structure

- Modify `apps/api/prisma/schema.prisma`: add enums and relational models for mastery, quiz attempts, and missions.
- Create `apps/api/prisma/migrations/<timestamp>_add_mastery_ladder/migration.sql`: database migration generated from Prisma.
- Create `apps/api/src/lib/mastery.ts`: pure scoring and level helpers.
- Create `apps/api/src/lib/mastery.test.ts`: unit tests for scoring and level thresholds.
- Create `apps/api/src/lib/mastery-aggregation.ts`: DB-backed aggregate refresh functions.
- Create `apps/api/src/lib/mastery-aggregation.test.ts`: focused service tests for mission and aggregate behavior when practical.
- Modify `apps/api/src/routes/progress.ts`: add quiz submission and mastery read endpoints.
- Create `apps/web/app/api/progress/quiz/route.ts`: Next proxy for quiz submissions.
- Create `apps/web/app/api/progress/mastery/route.ts`: Next proxy for mastery reads.
- Create `apps/web/lib/mastery.ts`: server helper for reading mastery from the web app.
- Create `apps/web/components/QuizScoreForm.tsx`: client form to submit quiz results for existing markdown quizzes.
- Modify `apps/web/app/chapters/[slug]/quiz/page.tsx`: render the quiz markdown and score form.
- Modify `apps/web/app/dashboard/page.tsx`: show mastery cards and active revision missions.
- Modify `apps/web/app/chapters/[slug]/page.tsx`: replace or supplement static mastery with live student mastery when available.
- Modify `apps/web/app/globals.css`: add styles for mastery cards, levels, missions, and quiz score form.
- Modify `docs/project-memory.md`: record the implementation decision after code lands.

## Task 1: Add Pure Mastery Scoring Helpers

**Files:**
- Create: `apps/api/src/lib/mastery.ts`
- Create: `apps/api/src/lib/mastery.test.ts`

- [ ] **Step 1: Write the failing scoring tests**

Create `apps/api/src/lib/mastery.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateChapterMastery, getMasteryLevel, getNextMasteryTarget } from './mastery.js';

test('calculateChapterMastery weights video at 30 and quiz at 70', () => {
  assert.equal(calculateChapterMastery({ videoCompletionPercent: 90, bestQuizScorePercent: 60 }), 69);
});

test('calculateChapterMastery clamps invalid values into the 0 to 100 range', () => {
  assert.equal(calculateChapterMastery({ videoCompletionPercent: 150, bestQuizScorePercent: -20 }), 30);
  assert.equal(calculateChapterMastery({ videoCompletionPercent: Number.NaN, bestQuizScorePercent: 80 }), 56);
});

test('getMasteryLevel maps thresholds to student-facing levels', () => {
  assert.equal(getMasteryLevel(0), 'learner');
  assert.equal(getMasteryLevel(39), 'learner');
  assert.equal(getMasteryLevel(40), 'skilled');
  assert.equal(getMasteryLevel(69), 'skilled');
  assert.equal(getMasteryLevel(70), 'exam_ready');
  assert.equal(getMasteryLevel(89), 'exam_ready');
  assert.equal(getMasteryLevel(90), 'topper_track');
});

test('getNextMasteryTarget returns the next level target', () => {
  assert.deepEqual(getNextMasteryTarget(39), { level: 'skilled', minimumScore: 40 });
  assert.deepEqual(getNextMasteryTarget(69), { level: 'exam_ready', minimumScore: 70 });
  assert.deepEqual(getNextMasteryTarget(89), { level: 'topper_track', minimumScore: 90 });
  assert.equal(getNextMasteryTarget(90), null);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm run test -w apps/api -- src/lib/mastery.test.ts
```

Expected: FAIL because `apps/api/src/lib/mastery.ts` does not exist.

- [ ] **Step 3: Add the pure scoring implementation**

Create `apps/api/src/lib/mastery.ts`:

```ts
export type MasteryLevelCode = 'learner' | 'skilled' | 'exam_ready' | 'topper_track';

export type MasteryInput = {
  bestQuizScorePercent: number | null | undefined;
  videoCompletionPercent: number | null | undefined;
};

export type NextMasteryTarget = {
  level: MasteryLevelCode;
  minimumScore: number;
};

function clampPercent(value: number | null | undefined) {
  const numericValue = Number(value ?? 0);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(100, numericValue));
}

export function calculateChapterMastery(input: MasteryInput) {
  const videoScore = clampPercent(input.videoCompletionPercent);
  const quizScore = clampPercent(input.bestQuizScorePercent);

  return Math.round(videoScore * 0.3 + quizScore * 0.7);
}

export function getMasteryLevel(score: number): MasteryLevelCode {
  const normalizedScore = clampPercent(score);

  if (normalizedScore >= 90) {
    return 'topper_track';
  }

  if (normalizedScore >= 70) {
    return 'exam_ready';
  }

  if (normalizedScore >= 40) {
    return 'skilled';
  }

  return 'learner';
}

export function getNextMasteryTarget(score: number): NextMasteryTarget | null {
  const normalizedScore = clampPercent(score);

  if (normalizedScore < 40) {
    return { level: 'skilled', minimumScore: 40 };
  }

  if (normalizedScore < 70) {
    return { level: 'exam_ready', minimumScore: 70 };
  }

  if (normalizedScore < 90) {
    return { level: 'topper_track', minimumScore: 90 };
  }

  return null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```powershell
npm run test -w apps/api -- src/lib/mastery.test.ts
```

Expected: PASS for all four mastery helper tests.

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/lib/mastery.ts apps/api/src/lib/mastery.test.ts
git commit -m "Add mastery scoring helpers"
```

## Task 2: Add Mastery Ladder Database Models

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/<timestamp>_add_mastery_ladder/migration.sql`

- [ ] **Step 1: Update Prisma schema**

Add these enums after the existing enums in `apps/api/prisma/schema.prisma`:

```prisma
enum MasteryLevel {
  learner
  skilled
  exam_ready
  topper_track
}

enum RevisionMissionStatus {
  active
  completed
  expired
}
```

Add these relations inside `model User`:

```prisma
  quizAttempts    QuizAttempt[]
  chapterMasteries ChapterMastery[]
  revisionMissions RevisionMission[]
```

Add these relations inside `model Chapter`:

```prisma
  quizAttempts     QuizAttempt[]
  chapterMasteries ChapterMastery[]
  revisionMissions RevisionMission[]
```

Add these relations inside `model Topic`:

```prisma
  quizAttempts     QuizAttempt[]
  revisionMissions RevisionMission[]
```

Add this relation inside `model Quiz`:

```prisma
  attempts QuizAttempt[]
```

Add these models after `model Quiz`:

```prisma
model QuizAttempt {
  id                  String   @id @default(cuid())
  userId              String
  chapterId           String
  topicId             String?
  quizId              String?
  scorePercent        Int
  totalQuestions      Int
  correctAnswers      Int
  weakTopicSlugs      String[] @default([])
  attemptNumber       Int
  createdAt           DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  chapter Chapter @relation(fields: [chapterId], references: [id])
  topic   Topic?  @relation(fields: [topicId], references: [id])
  quiz    Quiz?   @relation(fields: [quizId], references: [id])

  @@index([userId, chapterId, createdAt])
  @@index([chapterId, scorePercent])
  @@index([quizId, createdAt])
}

model ChapterMastery {
  id                     String       @id @default(cuid())
  userId                 String
  chapterId              String
  masteryScore           Int          @default(0)
  level                  MasteryLevel @default(learner)
  videoCompletionPercent Int          @default(0)
  bestQuizScorePercent   Int          @default(0)
  lastActivityAt         DateTime?
  createdAt              DateTime     @default(now())
  updatedAt              DateTime     @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  chapter Chapter @relation(fields: [chapterId], references: [id])

  @@unique([userId, chapterId])
  @@index([userId, level, updatedAt])
  @@index([chapterId, masteryScore])
}

model RevisionMission {
  id              String                @id @default(cuid())
  userId          String
  chapterId       String
  topicId         String?
  status          RevisionMissionStatus @default(active)
  reason          String
  targetScore     Int                   @default(60)
  recommendedSteps Json
  createdAt       DateTime              @default(now())
  completedAt     DateTime?
  updatedAt       DateTime              @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  chapter Chapter @relation(fields: [chapterId], references: [id])
  topic   Topic?  @relation(fields: [topicId], references: [id])

  @@index([userId, status, updatedAt])
  @@index([chapterId, status])
}
```

- [ ] **Step 2: Format and create the migration**

Run:

```powershell
npm exec prisma format -w apps/api
npm run prisma:migrate -w apps/api -- --name add_mastery_ladder
```

Expected: Prisma formats the schema and creates a migration directory under `apps/api/prisma/migrations/`.

- [ ] **Step 3: Generate the Prisma client**

Run:

```powershell
npm run prisma:generate -w apps/api
```

Expected: Prisma Client generation succeeds.

- [ ] **Step 4: Run API typecheck**

Run:

```powershell
npm run lint -w apps/api
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add apps/api/prisma/schema.prisma apps/api/prisma/migrations
git commit -m "Add mastery ladder data model"
```

## Task 3: Add Mastery Aggregation Service

**Files:**
- Create: `apps/api/src/lib/mastery-aggregation.ts`
- Create: `apps/api/src/lib/mastery-aggregation.test.ts`

- [ ] **Step 1: Write the failing aggregation behavior tests**

Create `apps/api/src/lib/mastery-aggregation.test.ts`:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildRevisionMissionSteps, shouldCreateRevisionMission } from './mastery-aggregation.js';

test('shouldCreateRevisionMission is true below 60 percent', () => {
  assert.equal(shouldCreateRevisionMission(59), true);
  assert.equal(shouldCreateRevisionMission(60), false);
});

test('buildRevisionMissionSteps creates useful exam-focused actions', () => {
  const steps = buildRevisionMissionSteps(['euclid-division-lemma']);

  assert.deepEqual(steps, [
    'Rewatch the lesson section for euclid-division-lemma.',
    'Revise quick notes, formulas, and common mistakes for the weak area.',
    'Retry a focused 5-question practice set and aim for at least 60%.',
  ]);
});

test('buildRevisionMissionSteps falls back to chapter revision when weak topics are missing', () => {
  const steps = buildRevisionMissionSteps([]);

  assert.deepEqual(steps, [
    'Rewatch the most recent lesson video for this chapter.',
    'Revise quick notes, formulas, and common mistakes for the weak area.',
    'Retry a focused 5-question practice set and aim for at least 60%.',
  ]);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```powershell
npm run test -w apps/api -- src/lib/mastery-aggregation.test.ts
```

Expected: FAIL because `mastery-aggregation.ts` does not exist.

- [ ] **Step 3: Implement aggregation helpers and refresh function**

Create `apps/api/src/lib/mastery-aggregation.ts`:

```ts
import { Prisma, PrismaClient } from '@prisma/client';

import { calculateChapterMastery, getMasteryLevel } from './mastery.js';
import { prisma } from './prisma.js';

const REVISION_THRESHOLD_PERCENT = 60;

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export function shouldCreateRevisionMission(scorePercent: number) {
  return scorePercent < REVISION_THRESHOLD_PERCENT;
}

export function buildRevisionMissionSteps(weakTopicSlugs: string[]) {
  const firstStep = weakTopicSlugs[0]
    ? `Rewatch the lesson section for ${weakTopicSlugs[0]}.`
    : 'Rewatch the most recent lesson video for this chapter.';

  return [
    firstStep,
    'Revise quick notes, formulas, and common mistakes for the weak area.',
    'Retry a focused 5-question practice set and aim for at least 60%.',
  ];
}

function readPercentComplete(metadata: Prisma.JsonValue | null) {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    return 0;
  }

  const percentComplete = Number((metadata as { percentComplete?: unknown }).percentComplete);
  if (!Number.isFinite(percentComplete)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(percentComplete)));
}

export async function refreshChapterMastery(params: {
  chapterId: string;
  db?: PrismaExecutor;
  userId: string;
}) {
  const db = params.db ?? prisma;

  const [videoEvents, bestQuizAttempt, latestEvent] = await Promise.all([
    db.progressEvent.findMany({
      where: {
        chapterId: params.chapterId,
        eventType: { in: ['video_checkpoint', 'video_progress'] },
        userId: params.userId,
      },
      select: { metadata: true },
    }),
    db.quizAttempt.findFirst({
      where: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
      orderBy: [{ scorePercent: 'desc' }, { createdAt: 'desc' }],
      select: { scorePercent: true },
    }),
    db.progressEvent.findFirst({
      where: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
      orderBy: { occurredAt: 'desc' },
      select: { occurredAt: true },
    }),
  ]);

  const videoCompletionPercent = videoEvents.reduce(
    (maxPercent, event) => Math.max(maxPercent, readPercentComplete(event.metadata)),
    0,
  );
  const bestQuizScorePercent = bestQuizAttempt?.scorePercent ?? 0;
  const masteryScore = calculateChapterMastery({ bestQuizScorePercent, videoCompletionPercent });
  const level = getMasteryLevel(masteryScore);

  return db.chapterMastery.upsert({
    where: {
      userId_chapterId: {
        chapterId: params.chapterId,
        userId: params.userId,
      },
    },
    create: {
      bestQuizScorePercent,
      chapterId: params.chapterId,
      lastActivityAt: latestEvent?.occurredAt ?? new Date(),
      level,
      masteryScore,
      userId: params.userId,
      videoCompletionPercent,
    },
    update: {
      bestQuizScorePercent,
      lastActivityAt: latestEvent?.occurredAt ?? new Date(),
      level,
      masteryScore,
      videoCompletionPercent,
    },
  });
}

export async function createOrRefreshRevisionMission(params: {
  chapterId: string;
  db?: PrismaExecutor;
  scorePercent: number;
  topicId?: string | null;
  userId: string;
  weakTopicSlugs: string[];
}) {
  if (!shouldCreateRevisionMission(params.scorePercent)) {
    return null;
  }

  const db = params.db ?? prisma;
  const existingMission = await db.revisionMission.findFirst({
    where: {
      chapterId: params.chapterId,
      status: 'active',
      userId: params.userId,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const data = {
    reason: `Quiz score ${params.scorePercent}% is below the 60% revision threshold.`,
    recommendedSteps: buildRevisionMissionSteps(params.weakTopicSlugs),
    targetScore: REVISION_THRESHOLD_PERCENT,
    topicId: params.topicId ?? null,
  };

  if (existingMission) {
    return db.revisionMission.update({
      where: { id: existingMission.id },
      data,
    });
  }

  return db.revisionMission.create({
    data: {
      ...data,
      chapterId: params.chapterId,
      userId: params.userId,
    },
  });
}
```

- [ ] **Step 4: Run aggregation tests**

Run:

```powershell
npm run test -w apps/api -- src/lib/mastery-aggregation.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/lib/mastery-aggregation.ts apps/api/src/lib/mastery-aggregation.test.ts
git commit -m "Add mastery aggregation service"
```

## Task 4: Add Progress API Endpoints For Quiz And Mastery

**Files:**
- Modify: `apps/api/src/routes/progress.ts`

- [ ] **Step 1: Add request normalization helpers**

At the top of `apps/api/src/routes/progress.ts`, after `normalizePercentComplete`, add:

```ts
function normalizeScorePercent(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

function normalizePositiveInteger(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return null;
  }

  return numericValue;
}

function normalizeWeakTopicSlugs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 8);
}
```

Add this import near the existing imports:

```ts
import { createOrRefreshRevisionMission, refreshChapterMastery } from '../lib/mastery-aggregation.js';
```

- [ ] **Step 2: Add quiz submission endpoint**

Add this route after the existing `progressRouter.post('/video', ...)` route:

```ts
progressRouter.post('/quiz', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save quiz progress.' });
    }

    const chapterSlug = typeof req.body?.chapterSlug === 'string' ? req.body.chapterSlug : null;
    const topicSlug = typeof req.body?.topicSlug === 'string' ? req.body.topicSlug : null;
    const scorePercent = normalizeScorePercent(req.body?.scorePercent);
    const totalQuestions = normalizePositiveInteger(req.body?.totalQuestions);
    const correctAnswers = normalizePositiveInteger(req.body?.correctAnswers);
    const weakTopicSlugs = normalizeWeakTopicSlugs(req.body?.weakTopicSlugs);

    if (!chapterSlug || scorePercent === null || totalQuestions === null || correctAnswers === null) {
      return res.status(400).json({
        message: 'chapterSlug, scorePercent, totalQuestions, and correctAnswers are required.',
      });
    }

    if (totalQuestions <= 0 || correctAnswers > totalQuestions) {
      return res.status(400).json({ message: 'Quiz answers must fit within the total question count.' });
    }

    const chapter = await prisma.chapter.findFirst({
      where: {
        slug: chapterSlug,
        isPublished: true,
      },
      include: {
        topics: true,
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: 'Chapter was not found.' });
    }

    const topic = topicSlug
      ? chapter.topics.find((candidate) => candidate.slug === topicSlug)
      : null;

    const previousAttempts = await prisma.quizAttempt.count({
      where: {
        chapterId: chapter.id,
        userId: user.id,
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.quizAttempt.create({
        data: {
          attemptNumber: previousAttempts + 1,
          chapterId: chapter.id,
          correctAnswers,
          scorePercent,
          topicId: topic?.id ?? null,
          totalQuestions,
          userId: user.id,
          weakTopicSlugs,
        },
      });

      await tx.progressEvent.create({
        data: {
          chapterId: chapter.id,
          eventType: 'quiz_attempt',
          metadata: {
            attemptId: attempt.id,
            correctAnswers,
            scorePercent,
            totalQuestions,
            weakTopicSlugs,
          } satisfies Prisma.InputJsonValue,
          occurredAt: attempt.createdAt,
          quizId: attempt.quizId,
          topicId: topic?.id ?? null,
          userId: user.id,
        },
      });

      const mission = await createOrRefreshRevisionMission({
        chapterId: chapter.id,
        db: tx,
        scorePercent,
        topicId: topic?.id ?? null,
        userId: user.id,
        weakTopicSlugs,
      });

      const mastery = await refreshChapterMastery({
        chapterId: chapter.id,
        db: tx,
        userId: user.id,
      });

      return { attempt, mastery, mission };
    });

    return res.status(201).json({
      attempt: {
        attemptNumber: result.attempt.attemptNumber,
        correctAnswers: result.attempt.correctAnswers,
        scorePercent: result.attempt.scorePercent,
        totalQuestions: result.attempt.totalQuestions,
      },
      mastery: {
        bestQuizScorePercent: result.mastery.bestQuizScorePercent,
        level: result.mastery.level,
        masteryScore: result.mastery.masteryScore,
        videoCompletionPercent: result.mastery.videoCompletionPercent,
      },
      revisionMission: result.mission
        ? {
            id: result.mission.id,
            reason: result.mission.reason,
            recommendedSteps: result.mission.recommendedSteps,
            status: result.mission.status,
            targetScore: result.mission.targetScore,
          }
        : null,
    });
  } catch (error) {
    console.error('Failed to save quiz progress', error);
    return res.status(500).json({ message: 'Unable to save quiz progress right now.' });
  }
});
```

- [ ] **Step 3: Add mastery read endpoint**

Add this route after the quiz route:

```ts
progressRouter.get('/mastery', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to view mastery.' });
    }

    const chapterSlug = typeof req.query.chapterSlug === 'string' ? req.query.chapterSlug : null;

    const masteries = await prisma.chapterMastery.findMany({
      where: {
        userId: user.id,
        chapter: chapterSlug ? { slug: chapterSlug } : undefined,
      },
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: [{ masteryScore: 'asc' }, { updatedAt: 'desc' }],
    });

    const missions = await prisma.revisionMission.findMany({
      where: {
        status: 'active',
        userId: user.id,
        chapter: chapterSlug ? { slug: chapterSlug } : undefined,
      },
      include: {
        chapter: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({
      masteries: masteries.map((mastery) => ({
        bestQuizScorePercent: mastery.bestQuizScorePercent,
        chapterSlug: mastery.chapter.slug,
        chapterTitle: mastery.chapter.title,
        lastActivityAt: mastery.lastActivityAt?.toISOString() ?? null,
        level: mastery.level,
        masteryScore: mastery.masteryScore,
        subjectName: mastery.chapter.subject.name,
        videoCompletionPercent: mastery.videoCompletionPercent,
      })),
      revisionMissions: missions.map((mission) => ({
        chapterSlug: mission.chapter.slug,
        chapterTitle: mission.chapter.title,
        id: mission.id,
        reason: mission.reason,
        recommendedSteps: mission.recommendedSteps,
        status: mission.status,
        subjectName: mission.chapter.subject.name,
        targetScore: mission.targetScore,
      })),
    });
  } catch (error) {
    console.error('Failed to load mastery progress', error);
    return res.status(500).json({ message: 'Unable to load mastery progress right now.' });
  }
});
```

- [ ] **Step 4: Run API typecheck**

Run:

```powershell
npm run lint -w apps/api
```

Expected: PASS. If Prisma types are missing, rerun `npm run prisma:generate -w apps/api`.

- [ ] **Step 5: Commit**

```powershell
git add apps/api/src/routes/progress.ts
git commit -m "Add quiz progress and mastery endpoints"
```

## Task 5: Add Web API Proxies And Mastery Helper

**Files:**
- Create: `apps/web/app/api/progress/quiz/route.ts`
- Create: `apps/web/app/api/progress/mastery/route.ts`
- Create: `apps/web/lib/mastery.ts`

- [ ] **Step 1: Add quiz progress proxy**

Create `apps/web/app/api/progress/quiz/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function POST(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ message: 'Please log in to save quiz progress.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: 'Invalid quiz progress payload.' }, { status: 400 });
  }

  const response = await fetch(`${API_BASE_URL}/v1/progress/quiz`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { saved: response.ok }, { status: response.status });
}
```

- [ ] **Step 2: Add mastery read proxy**

Create `apps/web/app/api/progress/mastery/route.ts`:

```ts
import { NextResponse } from 'next/server';

import { getStudentSessionToken } from '../../../../lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export async function GET(request: Request) {
  const token = await getStudentSessionToken();
  if (!token) {
    return NextResponse.json({ masteries: [], revisionMissions: [] });
  }

  const url = new URL(request.url);
  const chapterSlug = url.searchParams.get('chapterSlug');
  const upstreamUrl = new URL('/v1/progress/mastery', API_BASE_URL);
  if (chapterSlug) {
    upstreamUrl.searchParams.set('chapterSlug', chapterSlug);
  }

  const response = await fetch(upstreamUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await response.json().catch(() => null);
  return NextResponse.json(data ?? { masteries: [], revisionMissions: [] }, { status: response.status });
}
```

- [ ] **Step 3: Add server helper for dashboard and chapter pages**

Create `apps/web/lib/mastery.ts`:

```ts
import { getStudentSessionToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

export type MasteryLevel = 'learner' | 'skilled' | 'exam_ready' | 'topper_track';

export type ChapterMasterySummary = {
  bestQuizScorePercent: number;
  chapterSlug: string;
  chapterTitle: string;
  lastActivityAt: string | null;
  level: MasteryLevel;
  masteryScore: number;
  subjectName: string;
  videoCompletionPercent: number;
};

export type RevisionMissionSummary = {
  chapterSlug: string;
  chapterTitle: string;
  id: string;
  reason: string;
  recommendedSteps: string[];
  status: 'active' | 'completed' | 'expired';
  subjectName: string;
  targetScore: number;
};

export type MasteryPayload = {
  masteries: ChapterMasterySummary[];
  revisionMissions: RevisionMissionSummary[];
};

export function formatMasteryLevel(level: MasteryLevel) {
  switch (level) {
    case 'topper_track':
      return 'Topper Track';
    case 'exam_ready':
      return 'Exam Ready';
    case 'skilled':
      return 'Skilled';
    case 'learner':
      return 'Learner';
  }
}

export function getNextMasteryLabel(score: number) {
  if (score < 40) {
    return 'Reach Skilled at 40%';
  }

  if (score < 70) {
    return 'Reach Exam Ready at 70%';
  }

  if (score < 90) {
    return 'Reach Topper Track at 90%';
  }

  return 'Maintain Topper Track';
}

export async function getStudentMastery(chapterSlug?: string): Promise<MasteryPayload> {
  const token = await getStudentSessionToken();
  if (!token) {
    return { masteries: [], revisionMissions: [] };
  }

  const url = new URL('/v1/progress/mastery', API_BASE_URL);
  if (chapterSlug) {
    url.searchParams.set('chapterSlug', chapterSlug);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return { masteries: [], revisionMissions: [] };
  }

  return response.json() as Promise<MasteryPayload>;
}
```

- [ ] **Step 4: Run web typecheck**

Run:

```powershell
npm run lint -w apps/web
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add apps/web/app/api/progress/quiz/route.ts apps/web/app/api/progress/mastery/route.ts apps/web/lib/mastery.ts
git commit -m "Add web mastery progress proxies"
```

## Task 6: Add Quiz Score Submission UI

**Files:**
- Create: `apps/web/components/QuizScoreForm.tsx`
- Modify: `apps/web/app/chapters/[slug]/quiz/page.tsx`

- [ ] **Step 1: Create client score form**

Create `apps/web/components/QuizScoreForm.tsx`:

```tsx
'use client';

import { FormEvent, useMemo, useState } from 'react';

type QuizScoreFormProps = {
  chapterSlug: string;
  weakTopicOptions: string[];
};

type SubmissionState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string; masteryScore: number; level: string; missionCreated: boolean }
  | { status: 'error'; message: string };

export default function QuizScoreForm({ chapterSlug, weakTopicOptions }: QuizScoreFormProps) {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [weakTopicSlugs, setWeakTopicSlugs] = useState<string[]>([]);
  const [state, setState] = useState<SubmissionState>({ status: 'idle' });

  const scorePercent = useMemo(() => {
    if (totalQuestions <= 0) {
      return 0;
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  function toggleWeakTopic(topic: string) {
    setWeakTopicSlugs((current) =>
      current.includes(topic) ? current.filter((item) => item !== topic) : [...current, topic],
    );
  }

  async function submitScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: 'submitting' });

    const response = await fetch('/api/progress/quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chapterSlug,
        correctAnswers,
        scorePercent,
        totalQuestions,
        weakTopicSlugs,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setState({ status: 'error', message: data?.message ?? 'Unable to save quiz score.' });
      return;
    }

    setState({
      status: 'success',
      message: data.revisionMission
        ? 'Revision Mission created. Strengthen the weak area, then retry.'
        : 'Great work. Your Chapter Mastery Score was updated.',
      masteryScore: data.mastery.masteryScore,
      level: data.mastery.level,
      missionCreated: Boolean(data.revisionMission),
    });
  }

  return (
    <form className="quiz-score-card" onSubmit={submitScore}>
      <div>
        <p className="eyebrow">Save quiz result</p>
        <h2>Update your Chapter Mastery Score</h2>
        <p className="subtext compact">
          Enter your result after solving the quiz. A low score creates a focused Revision Mission instead of a dead end.
        </p>
      </div>

      <div className="quiz-score-grid">
        <label>
          <span>Correct answers</span>
          <input
            min="0"
            max={totalQuestions}
            type="number"
            value={correctAnswers}
            onChange={(event) => setCorrectAnswers(Number(event.target.value))}
          />
        </label>
        <label>
          <span>Total questions</span>
          <input
            min="1"
            type="number"
            value={totalQuestions}
            onChange={(event) => setTotalQuestions(Number(event.target.value))}
          />
        </label>
        <div className="quiz-score-preview">
          <span>Score</span>
          <strong>{scorePercent}%</strong>
        </div>
      </div>

      {weakTopicOptions.length > 0 ? (
        <fieldset className="weak-topic-list">
          <legend>Weak areas from this attempt</legend>
          {weakTopicOptions.map((topic) => (
            <label key={topic}>
              <input
                checked={weakTopicSlugs.includes(topic)}
                type="checkbox"
                onChange={() => toggleWeakTopic(topic)}
              />
              <span>{topic}</span>
            </label>
          ))}
        </fieldset>
      ) : null}

      <button className="button-link" disabled={state.status === 'submitting'} type="submit">
        {state.status === 'submitting' ? 'Saving...' : 'Save score'}
      </button>

      {state.status === 'success' ? (
        <div className={state.missionCreated ? 'quiz-result-message mission' : 'quiz-result-message'}>
          <strong>{state.masteryScore}% mastery</strong>
          <span>{state.message}</span>
        </div>
      ) : null}

      {state.status === 'error' ? (
        <div className="quiz-result-message error">
          <strong>Could not save score</strong>
          <span>{state.message}</span>
        </div>
      ) : null}
    </form>
  );
}
```

- [ ] **Step 2: Render the score form on quiz page**

Modify `apps/web/app/chapters/[slug]/quiz/page.tsx`:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';

import QuizScoreForm from '../../../../components/QuizScoreForm';
import { getChapter, getQuizContent } from '../../../../lib/course-content';

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const quizContent = await getQuizContent(slug);
  const chapter = getChapter(slug);

  if (!quizContent || !chapter) {
    notFound();
  }

  return (
    <main className="section-shell quiz-page">
      <div className="quiz-shell">
        <section className="quiz-content-card">
          <p className="eyebrow">Chapter quiz</p>
          <h1>{chapter.title}</h1>
          <pre>{quizContent}</pre>
          <Link className="ghost-link" href={`/chapters/${slug}`}>
            Back to chapter
          </Link>
        </section>

        <QuizScoreForm chapterSlug={slug} weakTopicOptions={chapter.topics ?? []} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Run web typecheck**

Run:

```powershell
npm run lint -w apps/web
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add apps/web/components/QuizScoreForm.tsx "apps/web/app/chapters/[slug]/quiz/page.tsx"
git commit -m "Add quiz score mastery form"
```

## Task 7: Show Mastery On Dashboard And Chapter Pages

**Files:**
- Modify: `apps/web/app/dashboard/page.tsx`
- Modify: `apps/web/app/chapters/[slug]/page.tsx`

- [ ] **Step 1: Update dashboard to load mastery**

Modify imports in `apps/web/app/dashboard/page.tsx`:

```tsx
import Link from 'next/link';

import { logoutAction } from '../auth-actions';
import { requireStudentSession } from '../../lib/auth';
import { formatMasteryLevel, getNextMasteryLabel, getStudentMastery } from '../../lib/mastery';
```

Inside `DashboardPage`, after `const session = await requireStudentSession();`, add:

```tsx
  const mastery = await getStudentMastery();
  const activeMissions = mastery.revisionMissions.slice(0, 3);
```

Replace the existing `<div className="dashboard-grid">...</div>` block with:

```tsx
          <div className="dashboard-grid">
            {mastery.masteries.length > 0 ? (
              mastery.masteries.slice(0, 3).map((chapter) => (
                <article className="dashboard-card mastery-dashboard-card" key={chapter.chapterSlug}>
                  <p>{chapter.subjectName}</p>
                  <strong>{chapter.masteryScore}%</strong>
                  <span>{chapter.chapterTitle} · {formatMasteryLevel(chapter.level)}</span>
                  <div className="progress-track" aria-label={`${chapter.masteryScore}% mastered`}>
                    <span style={{ width: `${chapter.masteryScore}%` }} />
                  </div>
                  <Link className="card-link" href={`/chapters/${chapter.chapterSlug}`}>
                    {getNextMasteryLabel(chapter.masteryScore)}
                  </Link>
                </article>
              ))
            ) : (
              dashboardCards.map((card) => (
                <article className="dashboard-card" key={card.label}>
                  <p>{card.label}</p>
                  <strong>{card.value}</strong>
                  <span>{card.hint}</span>
                </article>
              ))
            )}
          </div>

          {activeMissions.length > 0 ? (
            <section className="dashboard-profile mastery-mission-panel">
              <div>
                <p className="eyebrow">Revision Missions</p>
                <h2>Comeback path</h2>
              </div>
              <div className="mission-board compact-missions">
                {activeMissions.map((mission) => (
                  <div className="mission-row" key={mission.id}>
                    <span className="check done">Fix</span>
                    <p>{mission.chapterTitle}<br />{mission.reason}</p>
                    <Link href={`/chapters/${mission.chapterSlug}/quiz`}>Retry</Link>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
```

- [ ] **Step 2: Update chapter page mastery panel**

Modify imports in `apps/web/app/chapters/[slug]/page.tsx`:

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapter, getQuizContent, hasChapterPack } from '../../../lib/course-content';
import { formatMasteryLevel, getNextMasteryLabel, getStudentMastery } from '../../../lib/mastery';
```

Inside `ChapterPage`, after `const isLive = hasLessonNotes || hasPackNotes;`, add:

```tsx
  const masteryPayload = await getStudentMastery(slug);
  const liveMastery = masteryPayload.masteries[0] ?? null;
  const activeMission = masteryPayload.revisionMissions[0] ?? null;
  const masteryScore = liveMastery?.masteryScore ?? chapter.progress;
  const masteryLabel = liveMastery ? formatMasteryLevel(liveMastery.level) : chapter.mastery;
```

Replace the existing `<aside className="mastery-panel" id="mastery">...</aside>` with:

```tsx
        <aside className="mastery-panel" id="mastery">
          <p className="eyebrow">Chapter mastery</p>
          <strong>{masteryScore}%</strong>
          <span>{masteryLabel}</span>
          <div className="progress-track large" aria-label={`${masteryScore}% mastered`}>
            <span style={{ width: `${masteryScore}%` }} />
          </div>
          <p className="streak-task">
            {liveMastery ? getNextMasteryLabel(liveMastery.masteryScore) : chapter.streakTask}
          </p>
          {activeMission ? (
            <div className="chapter-mission-callout">
              <strong>Revision Mission</strong>
              <span>{activeMission.reason}</span>
              <Link className="card-link" href={`/chapters/${slug}/quiz`}>
                Retry quiz
              </Link>
            </div>
          ) : null}
        </aside>
```

- [ ] **Step 3: Run web typecheck**

Run:

```powershell
npm run lint -w apps/web
```

Expected: PASS.

- [ ] **Step 4: Commit**

```powershell
git add apps/web/app/dashboard/page.tsx "apps/web/app/chapters/[slug]/page.tsx"
git commit -m "Show mastery ladder on student pages"
```

## Task 8: Add Mastery UI Styles

**Files:**
- Modify: `apps/web/app/globals.css`

- [ ] **Step 1: Add styles**

Append to `apps/web/app/globals.css` before the final media queries if possible, or at the end if that is simpler:

```css
.mastery-dashboard-card {
  display: grid;
  gap: 12px;
}

.mastery-dashboard-card .card-link {
  margin-top: 4px;
}

.mastery-mission-panel {
  display: grid;
  gap: 16px;
}

.compact-missions {
  box-shadow: none;
}

.compact-missions .mission-row a {
  color: var(--primary-strong);
  font-weight: 900;
}

.chapter-mission-callout {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  padding: 14px;
  border: 1px solid rgba(240, 68, 115, 0.28);
  border-radius: 8px;
  background: rgba(240, 68, 115, 0.1);
}

.chapter-mission-callout span {
  color: var(--muted);
  line-height: 1.5;
}

.quiz-page {
  padding-top: 36px;
}

.quiz-shell {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 20px;
  align-items: start;
}

.quiz-content-card,
.quiz-score-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--shadow);
}

.quiz-content-card {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.quiz-content-card pre {
  overflow-x: auto;
  margin: 0;
  padding: 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card-soft);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.7;
  white-space: pre-wrap;
}

.quiz-score-card {
  position: sticky;
  top: 86px;
  display: grid;
  gap: 18px;
  padding: 22px;
}

.quiz-score-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.quiz-score-grid label,
.weak-topic-list {
  display: grid;
  gap: 8px;
}

.quiz-score-grid span,
.weak-topic-list legend {
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 900;
}

.quiz-score-grid input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--foreground);
  font: inherit;
}

.quiz-score-preview {
  grid-column: 1 / -1;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card-soft);
}

.quiz-score-preview strong {
  display: block;
  margin-top: 6px;
  color: var(--primary-strong);
  font-size: 2rem;
}

.weak-topic-list {
  margin: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
}

.weak-topic-list label {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 800;
}

.quiz-result-message {
  display: grid;
  gap: 5px;
  padding: 14px;
  border: 1px solid rgba(4, 150, 111, 0.28);
  border-radius: 8px;
  background: rgba(4, 150, 111, 0.1);
}

.quiz-result-message.mission,
.quiz-result-message.error {
  border-color: rgba(240, 68, 115, 0.28);
  background: rgba(240, 68, 115, 0.1);
}

.quiz-result-message span {
  color: var(--muted);
  line-height: 1.5;
}

@media (prefers-color-scheme: dark) {
  .quiz-content-card,
  .quiz-score-card {
    background: rgba(20, 29, 25, 0.9);
  }
}

@media (max-width: 920px) {
  .quiz-shell {
    grid-template-columns: 1fr;
  }

  .quiz-score-card {
    position: static;
  }
}
```

- [ ] **Step 2: Run web typecheck**

Run:

```powershell
npm run lint -w apps/web
```

Expected: PASS.

- [ ] **Step 3: Commit**

```powershell
git add apps/web/app/globals.css
git commit -m "Style mastery ladder UI"
```

## Task 9: End-To-End Verification And Project Memory

**Files:**
- Modify: `docs/project-memory.md`
- Generated: `graphify-out/`

- [ ] **Step 1: Run API tests**

Run:

```powershell
npm run test -w apps/api
```

Expected: PASS for mastery tests and existing API tests.

- [ ] **Step 2: Run full lint**

Run:

```powershell
npm run lint
```

Expected: PASS for web, admin, and API TypeScript checks.

- [ ] **Step 3: Run full build**

Run:

```powershell
npm run build
```

Expected: PASS for web, admin, and API builds.

- [ ] **Step 4: Manually verify the student flow**

Start the API and web app in separate terminals:

```powershell
npm run dev:api
npm run dev:web
```

Manual flow:

1. Log in as a student.
2. Open `/chapters/real-numbers/quiz`.
3. Submit `2` correct out of `5`.
4. Confirm the result shows a Revision Mission.
5. Open `/dashboard`.
6. Confirm the dashboard shows the chapter mastery card and active mission.
7. Return to `/chapters/real-numbers/quiz`.
8. Submit `5` correct out of `5`.
9. Confirm mastery rises and the level moves toward `Exam Ready` or `Topper Track`, depending on existing video progress.

- [ ] **Step 5: Update project memory**

Append this bullet under `## Scaling Notes` in `docs/project-memory.md`:

```md
- Mastery Ladder V1 stores raw quiz/video activity separately from `ChapterMastery`, so the score can be recalculated later if the video/quiz weighting changes.
```

- [ ] **Step 6: Refresh graphify after code changes**

Run:

```powershell
graphify update .
```

Expected: `graphify-out/` refreshes successfully. If `graphify` is not available on PATH, record the exact error in the final implementation notes.

- [ ] **Step 7: Commit final verification artifacts**

```powershell
git add docs/project-memory.md graphify-out
git commit -m "Document mastery ladder implementation notes"
```

## Self-Review Checklist

- Spec coverage: Chapter Mastery Score is covered by Tasks 1, 3, 4, 5, and 7. Revision Missions are covered by Tasks 3, 4, 6, and 7. Useful unlocks are represented as level/revision UI in V1 and can be expanded after this MVP.
- Scope check: Public leaderboards, rank, coins, predicted marks, and full topic dashboards are not included.
- Type consistency: API uses `learner`, `skilled`, `exam_ready`, and `topper_track` consistently with Prisma enum values and web formatter helpers.
- Verification coverage: Pure scoring tests, API typecheck, web typecheck, full lint/build, and manual student flow are all included.
