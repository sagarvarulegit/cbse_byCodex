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
