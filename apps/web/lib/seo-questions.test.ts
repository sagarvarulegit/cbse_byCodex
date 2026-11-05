import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAllSeoQuestions,
  getSeoQuestionBySlug,
  getAllSeoQuestionSlugs,
  getRelatedSeoQuestions,
} from './seo-questions';

test('Unified SEO Questions Dataset exports questions across all sources', () => {
  const all = getAllSeoQuestions();
  assert.ok(all.length >= 1600, `Expected at least 1600 questions, got ${all.length}`);

  const exemplarQuestions = all.filter((q) => q.sourceType === 'ncert_exemplar');
  const boardPyqs = all.filter((q) => q.sourceType === 'cbse_board_pyq');
  const repeatedConcepts = all.filter((q) => q.sourceType === 'repeated_board_concept');

  assert.ok(exemplarQuestions.length >= 1000, `Expected >= 1000 Exemplar questions, got ${exemplarQuestions.length}`);
  assert.ok(boardPyqs.length >= 500, `Expected >= 500 Board PYQs, got ${boardPyqs.length}`);
  assert.ok(repeatedConcepts.length >= 15, `Expected >= 15 repeated concepts, got ${repeatedConcepts.length}`);
});

test('Every SEO question has required SEO and educational fields', () => {
  const all = getAllSeoQuestions();
  for (const q of all.slice(0, 50)) {
    assert.ok(q.id, 'Question must have id');
    assert.ok(q.slug, 'Question must have slug');
    assert.ok(q.title, 'Question must have title');
    assert.ok(q.prompt, 'Question must have prompt');
    assert.ok(q.modelAnswer, 'Question must have modelAnswer');
    assert.ok(q.chapterSlug, 'Question must have chapterSlug');
    assert.ok(q.subjectSlug, 'Question must have subjectSlug');
    assert.ok(q.marks > 0, 'Marks must be positive');
    assert.ok(q.socraticHint, 'Must contain socraticHint');
    assert.ok(q.socraticHint.hintQuestion, 'Must have hintQuestion');
    assert.ok(q.socraticHint.guidingConcept, 'Must have guidingConcept');
    assert.ok(q.socraticHint.firstStepNudge, 'Must have firstStepNudge');
    assert.ok(Array.isArray(q.valuePoints), 'valuePoints must be array');
    assert.ok(q.valuePoints.length > 0, 'Must have at least 1 value point');
  }
});

test('Question lookup by slug returns exact item', () => {
  const slugs = getAllSeoQuestionSlugs();
  assert.ok(slugs.length > 0);

  const firstSlug = slugs[0];
  const item = getSeoQuestionBySlug(firstSlug);
  assert.ok(item);
  assert.equal(item?.slug, firstSlug);

  const missing = getSeoQuestionBySlug('non-existent-question-slug-xyz');
  assert.equal(missing, undefined);
});

test('Related questions return siblings from same chapter', () => {
  const all = getAllSeoQuestions();
  const sample = all.find((q) => q.sourceType === 'cbse_board_pyq');
  assert.ok(sample);

  const related = getRelatedSeoQuestions(sample, 3);
  for (const r of related) {
    assert.equal(r.chapterSlug, sample.chapterSlug);
    assert.notEqual(r.slug, sample.slug);
  }
});
