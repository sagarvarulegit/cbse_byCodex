import assert from 'node:assert/strict';
import test from 'node:test';

import { getChapter, getChapterEntries } from '../course-content';
import { getVisibleCurriculumSubjects } from './registry';
import {
  buildSubjectCatalog,
  getChapterDeliveryKind,
} from './subject-navigation';

test('catalog reports broad coverage without conflating revision packs and lessons', () => {
  const catalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );
  const socialScience = catalog.find(
    (subject) => subject.slug === 'social-science',
  );
  const english = catalog.find(
    (subject) => subject.slug === 'english-language-and-literature',
  );
  const hpe = catalog.find(
    (subject) => subject.slug === 'health-and-physical-education',
  );

  assert.deepEqual(
    socialScience && {
      available: socialScience.availableCount,
      lessons: socialScience.lessonWiseCount,
      packs: socialScience.revisionPackCount,
      total: socialScience.chapterCount,
    },
    { available: 22, lessons: 0, packs: 22, total: 22 },
  );
  assert.deepEqual(
    english && {
      available: english.availableCount,
      lessons: english.lessonWiseCount,
      packs: english.revisionPackCount,
      total: english.chapterCount,
    },
    { available: 40, lessons: 1, packs: 39, total: 40 },
  );
  assert.equal(hpe?.availableCount, 0);
  assert.equal(hpe?.chapterCount, 5);
});

test('chapter delivery labels prefer published lessons over a fallback pack', () => {
  const lessonWise = getChapter('real-numbers');
  const revisionPack = getChapter('rise-of-nationalism-in-europe');
  const unavailable = getChapter('physical-fitness-and-wellness');

  assert.ok(lessonWise);
  assert.ok(revisionPack);
  assert.ok(unavailable);
  assert.equal(getChapterDeliveryKind('real-numbers', lessonWise), 'lesson-wise');
  assert.equal(
    getChapterDeliveryKind('rise-of-nationalism-in-europe', revisionPack),
    'revision-pack',
  );
  assert.equal(
    getChapterDeliveryKind('physical-fitness-and-wellness', unavailable),
    'coming-soon',
  );
});
