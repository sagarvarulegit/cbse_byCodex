import assert from 'node:assert/strict';
import test from 'node:test';

import {
  matchesWrittenPracticeAttempt,
  normalizeWrittenPracticeAttempt,
} from './written-practice.js';

const validAttempt = {
  answerLength: 120,
  chapterSlug: 'chemical-reactions-and-equations',
  clientAttemptId: '81e606ba-900b-47d0-b7ea-e487f40fa8a5',
  earnedRubricPointIds: ['balanced-equation'],
  lessonSlug: 'board-exam-practice',
  maxScoreHalfMarks: 6,
  practiceItemId: 'cre-pyq-1',
  scoreHalfMarks: 4,
  weakSkillSlugs: ['observation'],
};

test('normalizes a structured attempt without accepting answer text', () => {
  const result = normalizeWrittenPracticeAttempt({
    ...validAttempt,
    answer: 'This text must never be persisted.',
  });

  assert.ok(result.data);
  assert.equal('answer' in result.data, false);
  assert.equal(result.data.practiceKind, 'written_practice');
  assert.equal(result.data.retentionEligible, true);
  assert.equal(result.data.usedHints, false);
  assert.deepEqual(result.data.missedRubricPoints, []);
  assert.deepEqual(result.data.weakSkillSlugs, ['observation']);
});

test('keeps an explicit exam-integrity exclusion', () => {
  const result = normalizeWrittenPracticeAttempt({
    ...validAttempt,
    practiceKind: 'timed_diagnostic',
    retentionEligible: false,
  });

  assert.ok(result.data);
  assert.equal(result.data.practiceKind, 'timed_diagnostic');
  assert.equal(result.data.retentionEligible, false);
});

test('excludes hinted attempts from retention even if a client marks them eligible', () => {
  const result = normalizeWrittenPracticeAttempt({
    ...validAttempt,
    retentionEligible: true,
    usedHints: true,
  });

  assert.ok(result.data);
  assert.equal(result.data.retentionEligible, false);
  assert.equal(result.data.usedHints, true);
});

test('rejects impossible scores and malformed skill slugs', () => {
  assert.equal(
    normalizeWrittenPracticeAttempt({
      ...validAttempt,
      scoreHalfMarks: 8,
    }).data,
    null,
  );
  assert.equal(
    normalizeWrittenPracticeAttempt({
      ...validAttempt,
      weakSkillSlugs: ['not a slug'],
    }).data,
    null,
  );
});

test('accepts exact idempotent retries and rejects conflicting identity reuse', () => {
  const normalized = normalizeWrittenPracticeAttempt(validAttempt);
  assert.ok(normalized.data);
  const stored = {
    ...normalized.data,
    chapterId: 'chapter-1',
    missedRubricPointIds: normalized.data.missedRubricPoints.map((point) => point.id),
  };

  assert.equal(
    matchesWrittenPracticeAttempt(stored, normalized.data, 'chapter-1'),
    true,
  );
  assert.equal(
    matchesWrittenPracticeAttempt(
      stored,
      { ...normalized.data, scoreHalfMarks: 2 },
      'chapter-1',
    ),
    false,
  );
  assert.equal(
    matchesWrittenPracticeAttempt(
      stored,
      { ...normalized.data, practiceItemId: 'cre-pyq-2' },
      'chapter-1',
    ),
    false,
  );
});
