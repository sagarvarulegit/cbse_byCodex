import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvailableLessons,
  getChapter,
  getChapterEntries,
  getLessonContent,
  type MarkdownBlock,
} from './course-content';
import { getCurriculumSubject, getVisibleCurriculumSubjects } from './curriculum/registry';
import {
  buildSubjectCatalog,
  getCurriculumSubjectChapterEntries,
  resolveCurriculumSubjectSlug,
  SUBJECT_ROUTE_ALIASES,
} from './curriculum/subject-navigation';

const chapterSlug = 'chemical-reactions-and-equations';

function getH2Headings(blocks: MarkdownBlock[]) {
  return blocks.flatMap((block) => (block.type === 'h2' ? [block.text.toLowerCase()] : []));
}

function getAllText(blocks: MarkdownBlock[]) {
  return blocks
    .flatMap((block) => ('text' in block ? [block.text] : block.items))
    .join('\n');
}

function assertRequiredHeadings(blocks: MarkdownBlock[], expectedHeadings: string[]) {
  const headings = getH2Headings(blocks);

  for (const heading of expectedHeadings) {
    assert.ok(headings.includes(heading), `Missing required h2 section: ${heading}`);
  }
}

function assertFourPanelComic(blocks: MarkdownBlock[]) {
  const comicIndex = blocks.findIndex(
    (block) => block.type === 'h2' && block.text.toLowerCase() === 'comic recap',
  );
  assert.notEqual(comicIndex, -1, 'Expected a Comic recap h2 section');

  const comicList = blocks[comicIndex + 1];
  assert.equal(comicList?.type, 'unordered-list');

  if (comicList?.type === 'unordered-list') {
    assert.equal(comicList.items.length, 4);
    assert.ok(comicList.items.every((item) => /^[^:]+:\s*"[^"]+"$/.test(item)));
  }
}

test('chemical pilot catalog exposes exactly the first two available lessons', () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    ['chemical-equations', 'balancing-equations'],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-chemical-equations.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-balancing-equations.md');
  assert.equal(chapter.lessons[1]?.free, false);
});

test('chemical equations lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(chapterSlug, 'chemical-equations');
  assert.ok(content);

  assert.equal(content.previousLesson, null);
  assert.equal(content.nextLesson?.slug, 'balancing-equations');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'what is a chemical reaction?',
    'signs of a chemical reaction',
    'from word equation to formula equation',
    'state symbols',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /Mg \+ O2 -> MgO/);
  assert.match(lessonText, /Zn \+ H2SO4 -> ZnSO4 \+ H2/);
  assert.match(lessonText, /Na2SO4\(aq\) \+ BaCl2\(aq\) -> BaSO4\(s\) \+ 2NaCl\(aq\)/);
  assertFourPanelComic(content.blocks);
});

test('balancing equations lesson loads with worked examples and no unpublished next link', async () => {
  const content = await getLessonContent(chapterSlug, 'balancing-equations');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'chemical-equations');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'law of conservation of mass',
    'coefficients and subscripts are different',
    'repeatable balancing method',
    'worked example 1: hydrogen and oxygen',
    'worked example 2: iron and steam',
    'worked example 3: keep a polyatomic ion together',
    'worked example 4: aluminium oxide',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /2H2 \+ O2 -> 2H2O/);
  assert.match(lessonText, /3Fe \+ 4H2O -> Fe3O4 \+ 4H2/);
  assert.match(lessonText, /Na2SO4 \+ BaCl2 -> BaSO4 \+ 2NaCl/);
  assert.match(lessonText, /4Al \+ 3O2 -> 2Al2O3/);
  assertFourPanelComic(content.blocks);
});

test('subject catalog stays aligned to the visible curriculum registry', async () => {
  const catalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  assert.equal(catalog.find((subject) => subject.slug === 'health-and-physical-education')?.assessmentLabel, 'Internal assessment');
  assert.equal(catalog.some((subject) => subject.slug === 'artificial-intelligence'), false);
  assert.equal(catalog.some((subject) => subject.slug === 'information-technology'), false);
  assert.equal(catalog.filter((subject) => subject.slug === 'social-science').length, 1);

  const mathematicsStandard = catalog.find(
    (subject) => subject.slug === 'mathematics-standard',
  );

  assert.ok(mathematicsStandard);
  assert.equal(mathematicsStandard.title, 'Mathematics Standard');
  assert.equal(mathematicsStandard.subjectCode, '041');
  assert.equal(mathematicsStandard.assessmentLabel, 'Board exam');
  assert.equal(mathematicsStandard.academicSession, '2026-27');
  assert.equal(mathematicsStandard.chapterCount, 14);
  assert.equal(mathematicsStandard.accent, 'blue');
});

test('subject routes resolve the exact curriculum aliases and preserve canonical slugs', () => {
  assert.deepEqual(SUBJECT_ROUTE_ALIASES, {
    english: 'english-language-and-literature',
    hindi: 'hindi-course-b',
    mathematics: 'mathematics-standard',
  });
  assert.equal(resolveCurriculumSubjectSlug('english'), 'english-language-and-literature');
  assert.equal(resolveCurriculumSubjectSlug('hindi'), 'hindi-course-b');
  assert.equal(resolveCurriculumSubjectSlug('mathematics'), 'mathematics-standard');
  assert.equal(
    resolveCurriculumSubjectSlug('english-language-and-literature'),
    'english-language-and-literature',
  );
  assert.equal(resolveCurriculumSubjectSlug('hindi-course-b'), 'hindi-course-b');
  assert.equal(resolveCurriculumSubjectSlug('mathematics-standard'), 'mathematics-standard');
  assert.equal(resolveCurriculumSubjectSlug('science'), 'science');

  assert.equal(
    getCurriculumSubject(resolveCurriculumSubjectSlug('english'))?.subjectCode,
    '184',
  );
  assert.equal(
    getCurriculumSubject(resolveCurriculumSubjectSlug('hindi'))?.subjectCode,
    '085',
  );
  assert.equal(
    getCurriculumSubject(resolveCurriculumSubjectSlug('mathematics'))?.subjectCode,
    '041',
  );
});

test('subject navigation excludes duplicate Social Science mappings from excluded registry chapters', () => {
  const socialScience = getCurriculumSubject('social-science');

  assert.ok(socialScience);

  const subjectChapterEntries = getCurriculumSubjectChapterEntries(
    socialScience,
    getChapterEntries(),
  );
  const subjectChapterSlugs = subjectChapterEntries.map(([slug]) => slug);

  assert.deepEqual(subjectChapterSlugs, [
    'rise-of-nationalism-in-europe',
    'nationalism-in-india',
    'making-of-a-global-world',
    'the-age-of-industrialisation',
    'print-culture',
    'resources-and-development',
    'forest-and-wildlife-resources',
    'water-resources',
    'agriculture',
    'minerals-and-energy-resources',
    'manufacturing-industries',
    'lifelines-of-national-economy',
    'power-sharing',
    'federalism',
    'gender-religion-and-caste',
    'political-parties',
    'outcomes-of-democracy',
    'development',
    'sectors-of-indian-economy',
    'money-and-credit',
    'globalisation',
    'consumer-rights',
  ]);
  assert.equal(subjectChapterSlugs.length, 22);
  assert.equal(subjectChapterSlugs.includes('the-rise-of-nationalism-in-europe'), false);
  assert.equal(subjectChapterSlugs.includes('the-making-of-a-global-world'), false);
  assert.equal(subjectChapterSlugs.includes('print-culture-and-the-modern-world'), false);
  assert.equal(subjectChapterSlugs.includes('sectors-of-the-indian-economy'), false);
  assert.equal(subjectChapterSlugs.includes('globalisation-and-the-indian-economy'), false);
});

test('subject catalog does not let excluded Social Science duplicate packs inflate live counts', () => {
  const socialScienceCatalogItem = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  ).find((subject) => subject.slug === 'social-science');

  assert.ok(socialScienceCatalogItem);
  assert.equal(socialScienceCatalogItem.chapterCount, 22);
  assert.equal(socialScienceCatalogItem.liveCount, 17);
});
