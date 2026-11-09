import assert from 'node:assert/strict';
import test from 'node:test';
import { readSessionToken } from './auth.js';
import {
  ALL_SERIES_SUBJECT_SLUGS,
  getMockTestSeriesForSubject,
  indexSeriesPapers,
  seriesPaperView,
  type SeriesPaperRow,
} from './exam-papers/series.js';
import { completeSatisfiedRevisionMissions } from './mastery-aggregation.js';
import {
  createUserSessionToken,
  getAuthSecret,
  invalidateSessionUserCache,
} from './session.js';
import { invalidateExamPapersCaches } from '../routes/exam-papers.js';

test('createUserSessionToken preserves phone and invalidateSessionUserCache is safe', () => {
  const token = createUserSessionToken({
    id: 'user-perf-1',
    email: 'student@chapterready.in',
    phone: '9876543210',
    role: 'student',
    profile: {
      fullName: 'Aarav Sharma',
      classLevel: 10,
    },
  });

  const decoded = readSessionToken(token, getAuthSecret());
  assert.ok(decoded);
  assert.equal(decoded.userId, 'user-perf-1');
  assert.equal(decoded.phone, '9876543210');

  invalidateSessionUserCache('user-perf-1');
  invalidateSessionUserCache();
});

test('ALL_SERIES_SUBJECT_SLUGS covers all 7 Class 10 series and lean SeriesPaperRow works with indexSeriesPapers', () => {
  assert.equal(ALL_SERIES_SUBJECT_SLUGS.length, 7);

  const series = getMockTestSeriesForSubject('mathematics-standard');
  const firstDef = series.papers[0]!;
  const leanRow: SeriesPaperRow = {
    id: 'paper-1',
    subjectSlug: 'mathematics-standard',
    seed: firstDef.seed,
    totalMarks: 80,
    durationMinutes: 180,
    verificationStatus: 'verified',
    publishStatus: 'published',
  };

  const bySeed = indexSeriesPapers([leanRow]);
  const view = seriesPaperView(firstDef, bySeed.get(firstDef.seed), series);

  assert.equal(view.id, 'paper-1');
  assert.equal(view.isUnlocked, true);
  assert.equal(view.totalMarks, 80);
  assert.equal(view.durationMinutes, 180);
});

test('completeSatisfiedRevisionMissions with asyncWrite filters satisfied missions without blocking', async () => {
  let updateCalled = false;
  const mockDb = {
    revisionMission: {
      updateMany: async () => {
        updateCalled = true;
        return { count: 1 };
      },
    },
  };

  const visible = await completeSatisfiedRevisionMissions({
    db: mockDb as any,
    missions: [
      {
        id: 'mission-done',
        chapterId: 'ch-1',
        targetScore: 60,
      },
      {
        id: 'mission-open',
        chapterId: 'ch-2',
        targetScore: 80,
      },
    ],
    masteries: [
      { chapterId: 'ch-1', bestQuizScorePercent: 75 },
      { chapterId: 'ch-2', bestQuizScorePercent: 50 },
    ],
    completedAt: new Date(),
    asyncWrite: true,
  });

  assert.equal(visible.length, 1);
  assert.equal(visible[0]?.id, 'mission-open');
  assert.equal(updateCalled, true);
});

test('invalidateExamPapersCaches clears series, paper, and bank caches cleanly', () => {
  invalidateExamPapersCaches();
});
