import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizePilotEngagementPayload, normalizePilotFeedbackPayload } from './pilot-progress.js';

test('normalizePilotEngagementPayload accepts lesson completion context', () => {
  assert.deepEqual(
    normalizePilotEngagementPayload({
      chapterSlug: ' real-numbers ',
      eventType: 'lesson_complete',
      lessonSlug: ' euclid-division-lemma ',
      path: '/chapters/real-numbers/lessons/euclid-division-lemma',
      surface: 'lesson',
    }),
    {
      data: {
        chapterSlug: 'real-numbers',
        eventType: 'lesson_complete',
        lessonSlug: 'euclid-division-lemma',
        path: '/chapters/real-numbers/lessons/euclid-division-lemma',
        surface: 'lesson',
      },
      error: null,
    },
  );
});

test('normalizePilotEngagementPayload rejects unsupported events', () => {
  assert.deepEqual(normalizePilotEngagementPayload({ eventType: 'share_clicked', surface: 'lesson' }), {
    data: null,
    error: 'eventType must be lesson_start, lesson_complete, quiz_start, dashboard_view, or chapter_open.',
  });
});

test('normalizePilotFeedbackPayload accepts feedback and trims metadata', () => {
  assert.deepEqual(
    normalizePilotFeedbackPayload({
      category: 'bug',
      chapterSlug: ' two-stories-about-flying ',
      message: '  The second quiz option looks confusing on mobile.  ',
      path: '/chapters/two-stories-about-flying/quiz',
      rating: 2,
      surface: 'quiz',
    }),
    {
      data: {
        category: 'bug',
        chapterSlug: 'two-stories-about-flying',
        lessonSlug: null,
        message: 'The second quiz option looks confusing on mobile.',
        path: '/chapters/two-stories-about-flying/quiz',
        rating: 2,
        surface: 'quiz',
      },
      error: null,
    },
  );
});

test('normalizePilotFeedbackPayload requires a useful message', () => {
  assert.deepEqual(
    normalizePilotFeedbackPayload({
      category: 'feedback',
      message: 'ok',
      surface: 'dashboard',
    }),
    {
      data: null,
      error: 'Please share at least 8 characters of feedback.',
    },
  );
});
