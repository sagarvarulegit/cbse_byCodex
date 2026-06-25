import assert from 'node:assert/strict';
import test from 'node:test';

import { BOARD_QUESTION_TYPE_METADATA } from './question-types';
import type { BoardQuestionType } from './types';

const EVERY_QUESTION_TYPE: BoardQuestionType[] = [
  'mcq',
  'assertion-reason',
  'very-short-answer',
  'short-answer',
  'long-answer',
  'case-study',
  'source-based',
  'extract-based',
  'numerical',
  'proof',
  'construction',
  'diagram',
  'map-skill',
  'picture-interpretation',
  'data-interpretation',
  'grammar',
  'creative-writing',
];

test('question type runtime metadata is exhaustive and centralizes structured-answer eligibility', () => {
  assert.deepEqual(Object.keys(BOARD_QUESTION_TYPE_METADATA), EVERY_QUESTION_TYPE);
  assert.equal(BOARD_QUESTION_TYPE_METADATA.mcq.hasStructuredAnswer, false);
  assert.equal(
    BOARD_QUESTION_TYPE_METADATA['assertion-reason'].hasStructuredAnswer,
    false,
  );
  assert.equal(
    BOARD_QUESTION_TYPE_METADATA['short-answer'].hasStructuredAnswer,
    true,
  );
  assert.equal(
    BOARD_QUESTION_TYPE_METADATA['creative-writing'].hasStructuredAnswer,
    true,
  );
});
