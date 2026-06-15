import assert from 'node:assert/strict';
import test from 'node:test';

import { Prisma } from '@prisma/client';

import {
  buildRevisionMissionSteps,
  createOrRefreshRevisionMission,
  isRevisionMissionSatisfied,
  refreshChapterMastery,
  shouldCreateRevisionMission,
} from './mastery-aggregation.js';

type RefreshDb = NonNullable<Parameters<typeof refreshChapterMastery>[0]['db']>;
type RevisionMissionDb = NonNullable<Parameters<typeof createOrRefreshRevisionMission>[0]['db']>;

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

test('refreshChapterMastery uses latest quiz attempt as last activity when it is newer', async () => {
  const progressDate = new Date('2026-06-01T10:00:00.000Z');
  const quizDate = new Date('2026-06-02T10:00:00.000Z');
  const upsertCalls: Array<{ create: { lastActivityAt: Date | null }; update: { lastActivityAt: Date | null } }> = [];
  const db = {
    progressEvent: {
      findMany: async () => [{ metadata: { percentComplete: 80 } }],
      findFirst: async () => ({ occurredAt: progressDate }),
    },
    quizAttempt: {
      findFirst: async (args: { select: { createdAt?: boolean; scorePercent?: boolean } }) =>
        args.select.createdAt ? { createdAt: quizDate } : { scorePercent: 70 },
    },
    chapterMastery: {
      upsert: async (args: { create: { lastActivityAt: Date | null }; update: { lastActivityAt: Date | null } }) => {
        upsertCalls.push(args);
        return args.create;
      },
    },
  } as unknown as RefreshDb;

  await refreshChapterMastery({ chapterId: 'chapter-1', db, userId: 'user-1' });

  const [upsertArgs] = upsertCalls;
  assert.ok(upsertArgs);
  assert.equal(upsertArgs.create.lastActivityAt?.toISOString(), quizDate.toISOString());
  assert.equal(upsertArgs.update.lastActivityAt?.toISOString(), quizDate.toISOString());
});

test('refreshChapterMastery writes null last activity when there are no progress events or quiz attempts', async () => {
  const upsertCalls: Array<{ create: { lastActivityAt: Date | null }; update: { lastActivityAt: Date | null } }> = [];
  const db = {
    progressEvent: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    quizAttempt: {
      findFirst: async () => null,
    },
    chapterMastery: {
      upsert: async (args: { create: { lastActivityAt: Date | null }; update: { lastActivityAt: Date | null } }) => {
        upsertCalls.push(args);
        return args.create;
      },
    },
  } as unknown as RefreshDb;

  await refreshChapterMastery({ chapterId: 'chapter-1', db, userId: 'user-1' });

  const [upsertArgs] = upsertCalls;
  assert.ok(upsertArgs);
  assert.equal(upsertArgs.create.lastActivityAt, null);
  assert.equal(upsertArgs.update.lastActivityAt, null);
});

test('createOrRefreshRevisionMission updates active mission after unique create conflict', async () => {
  const existingMission = { id: 'mission-1' };
  let findFirstCalls = 0;
  const updateCalls: Array<{ where: { id: string } }> = [];
  const db = {
    revisionMission: {
      findFirst: async () => {
        findFirstCalls += 1;
        return findFirstCalls === 1 ? null : existingMission;
      },
      create: async () => {
        throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
          clientVersion: 'test',
          code: 'P2002',
        });
      },
      update: async (args: { where: { id: string } }) => {
        updateCalls.push(args);
        return { id: args.where.id };
      },
    },
  } as unknown as RevisionMissionDb;

  const result = await createOrRefreshRevisionMission({
    chapterId: 'chapter-1',
    db,
    scorePercent: 55,
    userId: 'user-1',
    weakTopicSlugs: ['euclid-division-lemma'],
  });

  assert.deepEqual(result, { id: 'mission-1' });
  assert.equal(updateCalls[0]?.where.id, 'mission-1');
});

test('createOrRefreshRevisionMission completes active mission after passing retry score', async () => {
  const completedMission = { id: 'mission-1', status: 'completed' };
  const updateCalls: Array<{ data: { completedAt: Date; status: string }; where: { id: string } }> = [];
  const db = {
    revisionMission: {
      findFirst: async () => ({ id: 'mission-1' }),
      update: async (args: { data: { completedAt: Date; status: string }; where: { id: string } }) => {
        updateCalls.push(args);
        return completedMission;
      },
    },
  } as unknown as RevisionMissionDb;

  const result = await createOrRefreshRevisionMission({
    chapterId: 'chapter-1',
    db,
    scorePercent: 80,
    userId: 'user-1',
    weakTopicSlugs: [],
  });

  assert.equal(result, null);
  assert.equal(updateCalls[0]?.where.id, 'mission-1');
  assert.equal(updateCalls[0]?.data.status, 'completed');
  assert.ok(updateCalls[0]?.data.completedAt instanceof Date);
});

test('isRevisionMissionSatisfied hides active missions when best quiz score already reached target', () => {
  assert.equal(
    isRevisionMissionSatisfied(
      { chapterId: 'chapter-1', targetScore: 60 },
      [
        { bestQuizScorePercent: 100, chapterId: 'chapter-1' },
        { bestQuizScorePercent: 20, chapterId: 'chapter-2' },
      ],
    ),
    true,
  );

  assert.equal(
    isRevisionMissionSatisfied({ chapterId: 'chapter-1', targetScore: 60 }, [
      { bestQuizScorePercent: 59, chapterId: 'chapter-1' },
    ]),
    false,
  );
});
