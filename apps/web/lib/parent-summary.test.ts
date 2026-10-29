import assert from 'node:assert/strict';
import test from 'node:test';
import type { SessionUser } from './auth';
import type { MasteryPayload } from './mastery';
import { buildParentSummaryModel } from './parent-summary';

const MOCK_SESSION: SessionUser = {
  id: 'student-test-1',
  fullName: 'Aarav Sharma',
  email: 'aarav@example.com',
  classLevel: 10,
  phone: '9876543210',
  role: 'student',
};

const EMPTY_MASTERY: MasteryPayload = {
  badges: [],
  masteries: [],
  revisionMissions: [],
  streak: {
    currentStreakDays: 0,
    longestStreakDays: 0,
    lastActivityDate: null,
  },
};

test('buildParentSummaryModel generates clean baseline for new student', () => {
  const model = buildParentSummaryModel({
    session: MOCK_SESSION,
    mastery: EMPTY_MASTERY,
  });

  assert.equal(model.firstName, 'Aarav');
  assert.equal(model.studentName, 'Aarav Sharma');
  assert.equal(model.classLevel, 10);
  assert.equal(model.stats.startedChapters, 0);
  assert.equal(model.stats.quizAccuracy, null);
  assert.equal(model.readinessLabel, 'Getting started');
  assert.match(model.consistencyHeadline, /just started preparing/i);
  assert.ok(model.subjectBreakdown.length > 0);
  assert.ok(model.whatsappShareText.length > 0);
});

test('buildParentSummaryModel reflects active streak, quiz scores and weak areas', () => {
  const activeMastery: MasteryPayload = {
    badges: [],
    streak: {
      currentStreakDays: 5,
      longestStreakDays: 5,
      lastActivityDate: '2026-10-29T10:00:00.000Z',
    },
    revisionMissions: [
      {
        id: 'rev-1',
        chapterSlug: 'chemical-reactions-and-equations',
        chapterTitle: 'Chemical Reactions and Equations',
        subjectName: 'Science',
        reason: 'Tricky questions missed on redox and precipitation reactions',
        status: 'active',
        targetScore: 90,
        recommendedSteps: [],
      },
    ],
    masteries: [
      {
        chapterSlug: 'chemical-reactions-and-equations',
        chapterTitle: 'Chemical Reactions and Equations',
        subjectName: 'Science',
        bestQuizScorePercent: 75,
        masteryScore: 80,
        lastActivityAt: '2026-10-29T09:00:00.000Z',
        level: 'skilled',
        videoCompletionPercent: 100,
      },
      {
        chapterSlug: 'real-numbers',
        chapterTitle: 'Real Numbers',
        subjectName: 'Mathematics',
        bestQuizScorePercent: 90,
        masteryScore: 95,
        lastActivityAt: '2026-10-28T09:00:00.000Z',
        level: 'exam_ready',
        videoCompletionPercent: 100,
      },
      {
        chapterSlug: 'rise-of-nationalism-in-europe',
        chapterTitle: 'The Rise of Nationalism in Europe',
        subjectName: 'Social Science',
        bestQuizScorePercent: 85,
        masteryScore: 70,
        lastActivityAt: '2026-10-27T09:00:00.000Z',
        level: 'learner',
        videoCompletionPercent: 50,
      },
    ],
  };

  const model = buildParentSummaryModel({
    session: MOCK_SESSION,
    mastery: activeMastery,
  });

  assert.equal(model.stats.startedChapters, 3);
  assert.equal(model.stats.quizzesTaken, 3);
  // Avg of 75, 90, 85 = 250 / 3 = 83%
  assert.equal(model.stats.quizAccuracy, 83);
  assert.match(model.consistencyHeadline, /5-day streak/i);
  assert.equal(model.areasNeedingSupport.length, 1);
  assert.equal(model.areasNeedingSupport[0].chapterTitle, 'Chemical Reactions and Equations');
  assert.equal(model.readinessLabel, 'Building up');
});

test('buildParentSummaryModel surfaces chapters with missed quiz questions from mistakesData', () => {
  const model = buildParentSummaryModel({
    session: MOCK_SESSION,
    mastery: EMPTY_MASTERY,
    mistakesData: {
      status: 'active',
      items: [
        {
          id: 'm1',
          chapterSlug: 'real-numbers',
          chapterTitle: 'Real Numbers',
          conceptSlug: null,
          detail: null,
          due: true,
          kind: 'quiz_question',
          lastSeenAt: '2026-10-29T09:00:00.000Z',
          metadata: null,
          occurrenceCount: 1,
          resolvedAt: null,
          retryAt: '2026-10-29T09:00:00.000Z',
          reviewHref: '/my-mistakes',
          sourceItemId: 'q1',
          subject: 'Mathematics',
          title: 'Irrationality proof',
        },
        {
          id: 'm2',
          chapterSlug: 'real-numbers',
          chapterTitle: 'Real Numbers',
          conceptSlug: null,
          detail: null,
          due: true,
          kind: 'quiz_question',
          lastSeenAt: '2026-10-29T09:05:00.000Z',
          metadata: null,
          occurrenceCount: 1,
          resolvedAt: null,
          retryAt: '2026-10-29T09:05:00.000Z',
          reviewHref: '/my-mistakes',
          sourceItemId: 'q2',
          subject: 'Mathematics',
          title: 'HCF and LCM',
        },
      ],
    },
  });

  assert.equal(model.stats.dueMistakesCount, 2);
  assert.equal(model.areasNeedingSupport.length, 1);
  assert.equal(model.areasNeedingSupport[0].chapterSlug, 'real-numbers');
  assert.equal(model.areasNeedingSupport[0].reason, '2 missed quiz questions ready to retry');
});
