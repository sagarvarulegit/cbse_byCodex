import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPilotReviewPayload, canViewPilotReview, normalizePilotReviewWindowDays } from './pilot-review.js';

test('buildPilotReviewPayload aggregates pilot engagement and feedback events', () => {
  const generatedAt = new Date('2026-06-21T12:00:00.000Z');
  const events = [
    {
      eventType: 'dashboard_view',
      metadata: {
        path: '/dashboard',
        source: 'free_student_pilot',
        surface: 'dashboard',
      },
      occurredAt: new Date('2026-06-21T09:00:00.000Z'),
      userId: 'student-a',
    },
    {
      eventType: 'chapter_open',
      metadata: {
        chapterSlug: 'real-numbers',
        path: '/chapters/real-numbers',
        source: 'free_student_pilot',
        surface: 'chapter',
      },
      occurredAt: new Date('2026-06-21T09:10:00.000Z'),
      userId: 'student-a',
    },
    {
      eventType: 'lesson_start',
      metadata: {
        chapterSlug: 'real-numbers',
        lessonSlug: 'euclid-division-lemma',
        path: '/chapters/real-numbers/lessons/euclid-division-lemma',
        source: 'free_student_pilot',
        surface: 'lesson',
      },
      occurredAt: new Date('2026-06-21T09:15:00.000Z'),
      userId: 'student-b',
    },
    {
      eventType: 'feedback_submission',
      metadata: {
        category: 'bug',
        chapterSlug: 'real-numbers',
        lessonSlug: 'euclid-division-lemma',
        message: 'The second quiz option is hidden on mobile.',
        path: '/chapters/real-numbers/quiz',
        rating: 2,
        source: 'free_student_pilot',
        surface: 'quiz',
      },
      occurredAt: new Date('2026-06-21T10:00:00.000Z'),
      userId: 'student-b',
    },
    {
      eventType: 'feedback_submission',
      metadata: {
        category: 'content',
        message: 'The worked example helped me revise quickly.',
        rating: 5,
        surface: 'lesson',
      },
      occurredAt: new Date('2026-06-21T10:30:00.000Z'),
      userId: 'student-a',
    },
    {
      eventType: 'video_progress',
      metadata: {
        percentComplete: 40,
      },
      occurredAt: new Date('2026-06-21T11:00:00.000Z'),
      userId: 'student-c',
    },
  ];

  const payload = buildPilotReviewPayload({ events, generatedAt, windowDays: 7 });

  assert.equal(payload.generatedAt, '2026-06-21T12:00:00.000Z');
  assert.equal(payload.windowDays, 7);
  assert.deepEqual(payload.summary, {
    activeStudents: 2,
    averageRating: 3.5,
    feedbackCount: 2,
    mostActiveChapter: 'real-numbers',
    mostCommonEventType: 'feedback_submission',
    totalEvents: 5,
  });
  assert.deepEqual(payload.eventBreakdown, [
    { count: 2, eventType: 'feedback_submission' },
    { count: 1, eventType: 'chapter_open' },
    { count: 1, eventType: 'dashboard_view' },
    { count: 1, eventType: 'lesson_start' },
  ]);
  assert.deepEqual(payload.chapterBreakdown, [
    { chapterSlug: 'real-numbers', chapterTitle: null, count: 3 },
    { chapterSlug: null, chapterTitle: null, count: 2 },
  ]);
  assert.deepEqual(payload.surfaceBreakdown, [
    { count: 2, surface: 'lesson' },
    { count: 1, surface: 'chapter' },
    { count: 1, surface: 'dashboard' },
    { count: 1, surface: 'quiz' },
  ]);
  assert.deepEqual(
    payload.recentFeedback.map((item) => item.message),
    ['The worked example helped me revise quickly.', 'The second quiz option is hidden on mobile.'],
  );
  assert.deepEqual(payload.recentFeedback[1], {
    category: 'bug',
    chapterSlug: 'real-numbers',
    lessonSlug: 'euclid-division-lemma',
    message: 'The second quiz option is hidden on mobile.',
    occurredAt: '2026-06-21T10:00:00.000Z',
    path: '/chapters/real-numbers/quiz',
    rating: 2,
    surface: 'quiz',
  });
});

test('buildPilotReviewPayload returns useful empty state data', () => {
  const payload = buildPilotReviewPayload({
    events: [
      {
        eventType: 'video_progress',
        metadata: null,
        occurredAt: new Date('2026-06-21T09:00:00.000Z'),
        userId: 'student-a',
      },
    ],
    generatedAt: new Date('2026-06-21T12:00:00.000Z'),
    windowDays: 14,
  });

  assert.deepEqual(payload.summary, {
    activeStudents: 0,
    averageRating: null,
    feedbackCount: 0,
    mostActiveChapter: null,
    mostCommonEventType: null,
    totalEvents: 0,
  });
  assert.deepEqual(payload.eventBreakdown, []);
  assert.deepEqual(payload.chapterBreakdown, []);
  assert.deepEqual(payload.surfaceBreakdown, []);
  assert.deepEqual(payload.recentFeedback, []);
});

test('canViewPilotReview allows only admin users', () => {
  assert.equal(canViewPilotReview({ role: 'admin' }), true);
  assert.equal(canViewPilotReview({ role: 'student' }), false);
  assert.equal(canViewPilotReview({ role: 'teacher_reviewer' }), false);
  assert.equal(canViewPilotReview(null), false);
});

test('normalizePilotReviewWindowDays keeps the review window practical', () => {
  assert.equal(normalizePilotReviewWindowDays(undefined), 14);
  assert.equal(normalizePilotReviewWindowDays('7'), 7);
  assert.equal(normalizePilotReviewWindowDays('0'), 14);
  assert.equal(normalizePilotReviewWindowDays('60'), 30);
  assert.equal(normalizePilotReviewWindowDays(['3']), 14);
});
