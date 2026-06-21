import assert from 'node:assert/strict';
import test from 'node:test';

import { parseQuizContent } from './quiz-content';

test('parseQuizContent reads authoring metadata for review-ready questions', () => {
  const markdown = `---
title: Real Numbers chapter quiz
---

# Real Numbers chapter quiz

## 1. HCF and LCM

Topic: hcf-lcm
Difficulty: Medium
Source: NCERT exercise 1.2

To find the HCF by prime factorisation, we take:

1. all prime factors with highest powers
2. common prime factors with lowest powers
3. only the biggest prime factor

Answer: 2
Explanation: HCF uses only common factors, and it keeps the lowest power of each common prime factor.

## 2. Decimal expansion

Which denominator can give a terminating decimal in lowest form?

1. only 2 and 5 as prime factors
2. any odd prime factor
3. no prime factors

Answer: 1
`;

  const questions = parseQuizContent(markdown, ['hcf-lcm', 'fallback-topic']);

  assert.equal(questions.length, 2);
  assert.deepEqual(questions[0], {
    correctOptionIndex: 1,
    difficulty: 'Medium',
    explanation: 'HCF uses only common factors, and it keeps the lowest power of each common prime factor.',
    id: 'question-1',
    options: [
      { label: 'all prime factors with highest powers', value: 1 },
      { label: 'common prime factors with lowest powers', value: 2 },
      { label: 'only the biggest prime factor', value: 3 },
    ],
    prompt: 'To find the HCF by prime factorisation, we take:',
    sourceCoverage: 'NCERT exercise 1.2',
    title: 'HCF and LCM',
    topicTags: ['hcf-lcm'],
    topicSlug: 'hcf-lcm',
  });
  assert.equal(questions[1]?.topicSlug, 'fallback-topic');
  assert.equal(questions[1]?.correctOptionIndex, 0);
});
