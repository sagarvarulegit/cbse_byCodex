import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvailableLessons,
  getChapter,
  getChapterEntries,
  getLessonContent,
  type ChapterContent,
  type MarkdownBlock,
} from './course-content';
import { getCurriculumSubject, getVisibleCurriculumSubjects } from './curriculum/registry';
import {
  buildSubjectCatalog,
  buildCurriculumChapterCards,
  getCurriculumSubjectChapterEntries,
  resolveCurriculumSubjectSlug,
  SUBJECT_ROUTE_ALIASES,
} from './curriculum/subject-navigation';
import type { CurriculumSubject } from './curriculum/types';

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

test('chemical pilot catalog exposes all five available lessons', () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    [
      'chemical-equations',
      'balancing-equations',
      'combination-and-decomposition-reactions',
      'displacement-and-double-displacement-reactions',
      'oxidation-and-reduction',
    ],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-chemical-equations.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-balancing-equations.md');
  assert.equal(chapter.lessons[1]?.free, false);
  assert.equal(chapter.lessons[2]?.fileName, '03-combination-and-decomposition-reactions.md');
  assert.equal(chapter.lessons[3]?.fileName, '04-displacement-and-double-displacement-reactions.md');
  assert.equal(chapter.lessons[4]?.fileName, '05-oxidation-and-reduction.md');
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

test('balancing equations lesson loads with worked examples and the next lesson link', async () => {
  const content = await getLessonContent(chapterSlug, 'balancing-equations');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'chemical-equations');
  assert.equal(content.nextLesson?.slug, 'combination-and-decomposition-reactions');

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

test('combination and decomposition lesson loads with reaction type coverage', async () => {
  const content = await getLessonContent(chapterSlug, 'combination-and-decomposition-reactions');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'balancing-equations');
  assert.equal(content.nextLesson?.slug, 'displacement-and-double-displacement-reactions');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'combination reactions',
    'decomposition reactions',
    'types of decomposition',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /CaO \+ H2O -> Ca\(OH\)2/);
  assert.match(lessonText, /CaCO3 -> CaO \+ CO2/);
  assert.match(lessonText, /2Pb\(NO3\)2 -> 2PbO \+ 4NO2 \+ O2/);
  assert.match(lessonText, /2AgCl -> 2Ag \+ Cl2/);
  assert.match(lessonText, /2H2O -> 2H2 \+ O2/);
  assertFourPanelComic(content.blocks);
});

test('displacement and double displacement lesson loads with reactivity and precipitation', async () => {
  const content = await getLessonContent(
    chapterSlug,
    'displacement-and-double-displacement-reactions',
  );
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'combination-and-decomposition-reactions');
  assert.equal(content.nextLesson?.slug, 'oxidation-and-reduction');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'displacement reactions',
    'reactivity series clue',
    'double displacement reactions',
    'precipitation reactions',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /Fe \+ CuSO4 -> FeSO4 \+ Cu/);
  assert.match(lessonText, /Zn \+ CuSO4 -> ZnSO4 \+ Cu/);
  assert.match(lessonText, /Na2SO4 \+ BaCl2 -> BaSO4 \+ 2NaCl/);
  assert.match(lessonText, /AgNO3 \+ NaCl -> AgCl \+ NaNO3/);
  assertFourPanelComic(content.blocks);
});

test('oxidation and reduction lesson loads with redox and prevention coverage', async () => {
  const content = await getLessonContent(chapterSlug, 'oxidation-and-reduction');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'displacement-and-double-displacement-reactions');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'oxidation',
    'reduction',
    'redox reaction',
    'corrosion',
    'rancidity',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /2Cu \+ O2 -> 2CuO/);
  assert.match(lessonText, /CuO \+ H2 -> Cu \+ H2O/);
  assert.match(lessonText, /Nitrogen Keeper/);
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

test('subject catalog live status uses available lessons rather than unpublished lesson metadata', () => {
  const subject: CurriculumSubject = {
    activationBlockers: [],
    academicSession: '2026-27',
    assessmentMode: 'board',
    books: [],
    classLevel: 10,
    examProfile: {
      allowedMarkValues: [1],
      blueprintBlockers: [],
      blueprintSourceIds: ['fixture'],
      blueprintStatus: 'ready',
      durationMinutes: 180,
      maximumMarks: 80,
      readingTimeMinutes: 15,
      sectionRules: [],
    },
    officialSourceIds: ['fixture'],
    readinessBlockers: [],
    slug: 'fixture-subject',
    status: 'active',
    subjectCode: '999',
    title: 'Fixture Subject',
    units: [
      {
        chapters: [
          {
            id: 'unpublished-chapter',
            platformChapterSlugs: ['unpublished-chapter'],
            scope: 'board-exam',
            title: 'Unpublished Chapter',
            topics: [
              {
                id: 'official-topic',
                minimumReviewedQuestionCount: 3,
                platformContentRefs: [],
                requiredQuestionTypes: ['mcq'],
                scope: 'board-exam',
                title: 'Official Topic',
              },
            ],
          },
        ],
        id: 'unit',
        title: 'Unit',
      },
    ],
  };
  const chapter: ChapterContent = {
    lessons: [
      {
        fileName: '',
        free: false,
        minutes: 10,
        preview: 'Not published',
        slug: 'unpublished',
        title: 'Unpublished',
        type: 'Draft',
      },
    ],
    mastery: 'Coming soon',
    progress: 0,
    streakTask: 'Coming soon',
    subject: 'Fixture',
    summary: 'Fixture',
    title: 'Unpublished Chapter',
  };

  assert.equal(
    buildSubjectCatalog([subject], [['unpublished-chapter', chapter]])[0]?.liveCount,
    0,
  );

  chapter.lessons[0]!.fileName = 'published.md';

  assert.equal(
    buildSubjectCatalog([subject], [['unpublished-chapter', chapter]])[0]?.liveCount,
    1,
  );
});

test('subject chapter cards expose official registry topics and scopes, not legacy topic metadata', () => {
  const science = getCurriculumSubject('science');

  assert.ok(science);

  const cards = buildCurriculumChapterCards(science, getChapterEntries());
  const magneticEffects = cards.find(
    (card) => card.chapterSlug === 'magnetic-effects-of-electric-current',
  );

  assert.ok(magneticEffects);
  assert.equal(magneticEffects.curriculumScope, 'board-exam');
  assert.equal(
    magneticEffects.curriculumTopics.some(
      (topic) =>
        topic.id === 'electric-motor' && topic.scope === 'internal-only',
    ),
    true,
  );
  assert.equal(
    magneticEffects.curriculumTopics.some(
      (topic) =>
        topic.id === 'domestic-electric-circuits' &&
        topic.scope === 'board-exam',
    ),
    true,
  );
  assert.equal(
    magneticEffects.curriculumTopics.some(
      (topic) => topic.id === 'electromagnetic-induction',
    ),
    true,
  );
});
