import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CURRICULUM_SUBJECTS,
  getActiveCurriculumSession,
  getCurriculumSubject,
  getVisibleCurriculumSubjects,
} from './registry';
import type { CurriculumSubject } from './types';
import { validateCurriculumSubject } from './validation';

function getUnitMarks(subjectSlug: string) {
  const subject = getCurriculumSubject(subjectSlug);

  assert.ok(subject);

  return subject.units.map((unit) => [unit.id, unit.marks]);
}

function getPlatformChapterSlugs(subjectSlug: string) {
  const subject = getCurriculumSubject(subjectSlug);

  assert.ok(subject);

  return subject.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) => chapter.platformChapterSlugs),
  );
}

test('registry exposes the active Class 10 subject identities', () => {
  assert.equal(getActiveCurriculumSession(), '2026-27');
  assert.equal(getCurriculumSubject('mathematics-standard')?.subjectCode, '041');
  assert.equal(getCurriculumSubject('mathematics-basic')?.subjectCode, '241');
  assert.equal(getCurriculumSubject('science')?.subjectCode, '086');
  assert.equal(getCurriculumSubject('social-science')?.subjectCode, '087');
  assert.equal(
    getCurriculumSubject('english-language-and-literature')?.subjectCode,
    '184',
  );
  assert.equal(getCurriculumSubject('hindi-course-b')?.subjectCode, '085');
  assert.equal(
    getCurriculumSubject('health-and-physical-education')?.assessmentMode,
    'internal',
  );
  assert.equal(getCurriculumSubject('information-technology')?.subjectCode, '402');
  assert.equal(getCurriculumSubject('artificial-intelligence')?.subjectCode, '417');
  assert.equal(getCurriculumSubject('unknown-subject'), null);
});

test('registry keeps future and not-yet-activated subjects out of the catalog', () => {
  const visibleSlugs = getVisibleCurriculumSubjects().map((subject) => subject.slug);

  assert.equal(visibleSlugs.includes('mathematics-basic'), false);
  assert.equal(visibleSlugs.includes('artificial-intelligence'), false);
  assert.equal(visibleSlugs.includes('information-technology'), false);
  assert.deepEqual(visibleSlugs, [
    'mathematics-standard',
    'science',
    'social-science',
    'english-language-and-literature',
    'hindi-course-b',
    'health-and-physical-education',
  ]);
});

test('board subjects register the exact current unit weights', () => {
  assert.deepEqual(getUnitMarks('mathematics-standard'), [
    ['number-systems', 6],
    ['algebra', 20],
    ['coordinate-geometry', 6],
    ['geometry', 15],
    ['trigonometry', 12],
    ['mensuration', 10],
    ['statistics-and-probability', 11],
  ]);
  assert.deepEqual(getUnitMarks('science'), [
    ['chemical-substances', 25],
    ['world-of-living', 25],
    ['natural-phenomena', 12],
    ['effects-of-current', 13],
    ['natural-resources', 5],
  ]);
  assert.deepEqual(getUnitMarks('social-science').slice(0, 4), [
    ['history', 20],
    ['geography', 20],
    ['political-science', 20],
    ['economics', 20],
  ]);
  assert.deepEqual(getUnitMarks('english-language-and-literature'), [
    ['reading', 20],
    ['writing-and-grammar', 20],
    ['literature', 40],
  ]);
  assert.deepEqual(getUnitMarks('hindi-course-b'), [
    ['unseen-comprehension', 14],
    ['grammar', 16],
    ['literature', 28],
    ['creative-writing', 22],
  ]);
});

test('Mathematics and Science map every existing platform chapter', () => {
  assert.deepEqual(getPlatformChapterSlugs('mathematics-standard'), [
    'real-numbers',
    'polynomials',
    'pair-of-linear-equations-in-two-variables',
    'quadratic-equations',
    'arithmetic-progressions',
    'coordinate-geometry',
    'triangles',
    'circles',
    'introduction-to-trigonometry',
    'some-applications-of-trigonometry',
    'areas-related-to-circles',
    'surface-areas-and-volumes',
    'statistics',
    'probability',
  ]);
  assert.deepEqual(getPlatformChapterSlugs('science'), [
    'chemical-reactions-and-equations',
    'acids-bases-and-salts',
    'metals-and-non-metals',
    'carbon-and-its-compounds',
    'life-processes',
    'control-and-coordination',
    'how-do-organisms-reproduce',
    'heredity',
    'light-reflection-and-refraction',
    'the-human-eye-and-the-colourful-world',
    'electricity',
    'magnetic-effects-of-electric-current',
    'our-environment',
  ]);
});

test('Social Science classifies board, periodic, project, and excluded packs explicitly', () => {
  const subject = getCurriculumSubject('social-science');

  assert.ok(subject);

  const chapters = subject.units.flatMap((unit) => unit.chapters);
  const scopeById = new Map(chapters.map((chapter) => [chapter.id, chapter.scope]));

  assert.equal(scopeById.get('the-age-of-industrialisation'), 'periodic-only');
  assert.equal(scopeById.get('consumer-rights'), 'project-only');
  assert.equal(scopeById.get('the-rise-of-nationalism-in-europe-pack'), 'excluded');
  assert.equal(scopeById.get('globalisation-and-the-indian-economy-pack'), 'excluded');
});

test('English registers all assessed texts and leaves poem platform mappings empty', () => {
  const subject = getCurriculumSubject('english-language-and-literature');

  assert.ok(subject);

  const literature = subject.units.find((unit) => unit.id === 'literature');
  assert.ok(literature);

  const prose = literature.chapters.filter((chapter) => chapter.id.startsWith('prose-'));
  const poems = literature.chapters.filter((chapter) => chapter.id.startsWith('poem-'));
  const supplementary = literature.chapters.filter((chapter) =>
    chapter.id.startsWith('supplementary-'),
  );

  assert.equal(prose.length, 9);
  assert.equal(poems.length, 10);
  assert.equal(supplementary.length, 9);
  assert.equal(poems.every((chapter) => chapter.platformChapterSlugs.length === 0), true);
});

test('Hindi registers all assessment domains without inventing platform mappings', () => {
  const subject = getCurriculumSubject('hindi-course-b');

  assert.ok(subject);

  const literature = subject.units.find((unit) => unit.id === 'literature');
  assert.ok(literature);

  const excludedTitles = literature.chapters
    .filter((chapter) => chapter.scope === 'excluded')
    .map((chapter) => chapter.title);

  assert.deepEqual(excludedTitles, [
    'बिहारी के दोहे',
    'मधुर-मधुर मेरे दीपक जल',
    'गिरगिट',
  ]);

  const unmappedAssessedTitles = literature.chapters
    .filter(
      (chapter) =>
        chapter.scope === 'board-exam' && chapter.platformChapterSlugs.length === 0,
    )
    .map((chapter) => chapter.title);

  assert.deepEqual(unmappedAssessedTitles, [
    'पर्वत प्रदेश में पावस',
    'तोप',
    'कर चले हम फ़िदा',
    'आत्मत्राण',
    'हरिहर काका',
    'टोपी शुक्ला',
    'सपनों के-से दिन',
  ]);
});

test('future subjects require a source or an explicit activation blocker', () => {
  const informationTechnology = getCurriculumSubject('information-technology');
  const artificialIntelligence = getCurriculumSubject('artificial-intelligence');

  assert.ok(informationTechnology);
  assert.ok(artificialIntelligence);
  assert.deepEqual(informationTechnology.officialSourceIds, ['cbse-it-402-2026-27']);
  assert.equal(artificialIntelligence.officialSourceIds.length, 0);
  assert.ok(artificialIntelligence.activationBlockers?.length);

  const missingBlockerSubject: CurriculumSubject = {
    ...artificialIntelligence,
    activationBlockers: [],
  };

  assert.deepEqual(
    validateCurriculumSubject(missingBlockerSubject).map((issue) => issue.code),
    ['missing-source'],
  );
});

test('every registered active subject has zero validation issues', () => {
  for (const subject of CURRICULUM_SUBJECTS.filter(
    (candidate) => candidate.status === 'active',
  )) {
    assert.deepEqual(
      validateCurriculumSubject(subject),
      [],
      `${subject.slug} should be valid`,
    );
  }
});
