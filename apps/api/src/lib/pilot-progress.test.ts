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
    error:
      'eventType must be lesson_start, lesson_complete, quiz_start, dashboard_view, chapter_open, focus_mix_start, or focus_mix_complete.',
  });
});

test('normalizePilotEngagementPayload accepts Study Remix activity', () => {
  assert.deepEqual(
    normalizePilotEngagementPayload({
      chapterSlug: 'chemical-reactions-and-equations',
      eventType: 'focus_mix_start',
      path: '/dashboard',
      surface: 'study_remix',
    }),
    {
      data: {
        chapterSlug: 'chemical-reactions-and-equations',
        eventType: 'focus_mix_start',
        lessonSlug: null,
        path: '/dashboard',
        surface: 'study_remix',
      },
      error: null,
    },
  );
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
        stuckReason: null,
        surface: 'quiz',
      },
      error: null,
    },
  );
});

test('normalizePilotFeedbackPayload accepts a one-tap stuck reason', () => {
  const result = normalizePilotFeedbackPayload({
    category: 'stuck',
    chapterSlug: 'real-numbers',
    stuckReason: 'need_example',
    surface: 'lesson',
  });

  assert.ok(result.data);
  assert.equal(result.data.message, 'I need another example.');
  assert.equal(result.data.stuckReason, 'need_example');
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
