import assert from 'node:assert/strict';
import test from 'node:test';

import type { MarkdownBlock } from './course-content';
import { parseLessonQuestionAnswers } from './lesson-question-answers';

test('parseLessonQuestionAnswers reads the required NCERT question markup', () => {
  const blocks: MarkdownBlock[] = [
    { type: 'paragraph', text: '**❓ QUESTIONS**' },
    { type: 'paragraph', text: '**1. Why should a magnesium ribbon be cleaned before burning in air?**' },
    { type: 'paragraph', text: '*Hint:* Think about the coating formed in air.' },
    { type: 'paragraph', text: '*Answer:* Cleaning removes the magnesium oxide coating.' },
    { type: 'unordered-list', items: ['The clean ribbon burns readily.', 'The observation remains visible.'] },
    { type: 'paragraph', text: '**2. Write the balanced equation.**' },
    { type: 'paragraph', text: '*Answer:* `2Mg + O2 → 2MgO`' },
  ];

  assert.deepEqual(parseLessonQuestionAnswers(blocks), [
    {
      answer: 'Cleaning removes the magnesium oxide coating.',
      answerBlocks: [
        { type: 'unordered-list', items: ['The clean ribbon burns readily.', 'The observation remains visible.'] },
      ],
      hint: 'Think about the coating formed in air.',
      number: 1,
      question: 'Why should a magnesium ribbon be cleaned before burning in air?',
    },
    {
      answer: '`2Mg + O2 → 2MgO`',
      answerBlocks: [],
      number: 2,
      question: 'Write the balanced equation.',
    },
  ]);
});

test('parseLessonQuestionAnswers leaves legacy sections to the fallback renderer', () => {
  const blocks: MarkdownBlock[] = [
    { type: 'h3', text: 'Legacy questions' },
    { type: 'paragraph', text: 'Question: What is a reaction?' },
    { type: 'paragraph', text: 'Answer: A chemical change.' },
  ];

  assert.deepEqual(parseLessonQuestionAnswers(blocks), []);
});
