import assert from 'node:assert/strict';
import test from 'node:test';

import { findInvalidWeakTopicSlug } from './quiz-topic-slugs.js';

test('accepts current Chemical Reactions pilot lesson slugs even when DB topics use older grouped slugs', () => {
  const invalidSlug = findInvalidWeakTopicSlug({
    chapterSlug: 'chemical-reactions-and-equations',
    chapterTopicSlugs: ['chemical-equations', 'balancing-equations', 'reaction-types', 'oxidation-and-reduction'],
    weakTopicSlugs: ['displacement-and-double-displacement-reactions'],
  });

  assert.equal(invalidSlug, null);
});

test('rejects weak topic slugs outside the selected chapter and pilot chapter allowlist', () => {
  const invalidSlug = findInvalidWeakTopicSlug({
    chapterSlug: 'chemical-reactions-and-equations',
    chapterTopicSlugs: ['chemical-equations', 'balancing-equations', 'reaction-types', 'oxidation-and-reduction'],
    weakTopicSlugs: ['two-stories-about-flying'],
  });

  assert.equal(invalidSlug, 'two-stories-about-flying');
});

test('accepts standard lesson slugs core-notes and ncert-exercises-and-revision for any chapter', () => {
  const invalidSlug = findInvalidWeakTopicSlug({
    chapterSlug: 'polynomials',
    chapterTopicSlugs: [],
    weakTopicSlugs: ['core-notes', 'ncert-exercises-and-revision'],
  });

  assert.equal(invalidSlug, null);
});

test('accepts Social Science topic slugs for Rise of Nationalism in Europe', () => {
  const invalidSlug = findInvalidWeakTopicSlug({
    chapterSlug: 'rise-of-nationalism-in-europe',
    chapterTopicSlugs: ['core-notes', 'ncert-exercises-and-revision'],
    weakTopicSlugs: ['french-revolution-ideas', 'unification-of-italy-germany'],
  });

  assert.equal(invalidSlug, null);
});

test('accepts Social Science alias slug the-rise-of-nationalism-in-europe', () => {
  const invalidSlug = findInvalidWeakTopicSlug({
    chapterSlug: 'the-rise-of-nationalism-in-europe',
    chapterTopicSlugs: ['core-notes', 'ncert-exercises-and-revision'],
    weakTopicSlugs: ['french-revolution-ideas'],
  });

  assert.equal(invalidSlug, null);
});

