import assert from 'node:assert/strict';
import test from 'node:test';
import { getChapterMasteryDisplay, type ChapterMasterySummary } from './mastery';

test('getChapterMasteryDisplay reports an honest empty state without student progress', () => {
  assert.deepEqual(getChapterMasteryDisplay(), {
    hasProgress: false,
    label: 'Not started',
    score: 0,
  });
});

test('getChapterMasteryDisplay preserves a saved student mastery result', () => {
  const mastery: ChapterMasterySummary = {
    bestQuizScorePercent: 80,
    chapterSlug: 'chemical-reactions-and-equations',
    chapterTitle: 'Chemical Reactions and Equations',
    lastActivityAt: '2026-07-14T00:00:00.000Z',
    level: 'exam_ready',
    masteryScore: 76,
    subjectName: 'Science',
    videoCompletionPercent: 70,
  };

  assert.deepEqual(getChapterMasteryDisplay(mastery), {
    hasProgress: true,
    label: 'Exam Ready',
    score: 76,
  });
});
