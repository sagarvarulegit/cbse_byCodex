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
import { PILOT_CHAPTER_SLUGS } from './pilot';
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
const acidsBasesChapterSlug = 'acids-bases-and-salts';
const metalsNonMetalsChapterSlug = 'metals-and-non-metals';
const carbonCompoundsChapterSlug = 'carbon-and-its-compounds';
const lifeProcessesChapterSlug = 'life-processes';
const englishPilotChapterSlug = 'two-stories-about-flying';

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

test('pilot chapters expose clear overviews and at least three live lessons', () => {
  for (const chapterSlug of PILOT_CHAPTER_SLUGS) {
    const chapter = getChapter(chapterSlug);

    assert.ok(chapter, `Expected chapter metadata for ${chapterSlug}`);
    assert.ok(chapter.summary.trim().length > 0, `${chapterSlug} needs a summary`);
    assert.ok((chapter.topics ?? []).length > 0, `${chapterSlug} needs topic labels`);
    assert.ok(
      getAvailableLessons(chapter).length >= 3,
      `${chapterSlug} needs at least three live lessons`,
    );
  }
});

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

test('acids bases catalog exposes all four available lessons with Chapter 2 demos', () => {
  const chapter = getChapter(acidsBasesChapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    [
      'indicators-and-neutralisation',
      'chemical-properties-of-acids-and-bases',
      'ph-and-ions-in-solution',
      'salts-and-daily-life-uses',
    ],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-indicators-and-neutralisation.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-chemical-properties-of-acids-and-bases.md');
  assert.equal(chapter.lessons[2]?.fileName, '03-ph-and-ions-in-solution.md');
  assert.equal(chapter.lessons[3]?.fileName, '04-salts-and-daily-life-uses.md');
});

test('metals non-metals catalog exposes all six available lessons with Chapter 3 demos', () => {
  const chapter = getChapter(metalsNonMetalsChapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    [
      'physical-properties',
      'thermal-conductivity-and-conductivity',
      'oxides-and-chemical-properties',
      'reactivity-series-and-displacement',
      'ionic-compounds',
      'corrosion-and-prevention',
    ],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-physical-properties.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-thermal-conductivity-and-conductivity.md');
  assert.equal(chapter.lessons[1]?.free, false);
  assert.equal(chapter.lessons[2]?.fileName, '03-oxides-and-chemical-properties.md');
  assert.equal(chapter.lessons[3]?.fileName, '04-reactivity-series-and-displacement.md');
  assert.equal(chapter.lessons[4]?.fileName, '05-ionic-compounds.md');
  assert.equal(chapter.lessons[5]?.fileName, '06-corrosion-and-prevention.md');
});

test('carbon compounds catalog exposes all seven available lesson notes', () => {
  const chapter = getChapter(carbonCompoundsChapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    [
      'covalent-bonding-in-carbon',
      'versatile-nature-of-carbon',
      'hydrocarbons-and-homologous-series',
      'functional-groups-and-naming',
      'chemical-properties-of-carbon-compounds',
      'ethanol-and-ethanoic-acid',
      'soaps-and-detergents',
    ],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-covalent-bonding-in-carbon.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-versatile-nature-of-carbon.md');
  assert.equal(chapter.lessons[2]?.fileName, '03-hydrocarbons-and-homologous-series.md');
  assert.equal(chapter.lessons[3]?.fileName, '04-functional-groups-and-naming.md');
  assert.equal(chapter.lessons[4]?.fileName, '05-chemical-properties-of-carbon-compounds.md');
  assert.equal(chapter.lessons[5]?.fileName, '06-ethanol-and-ethanoic-acid.md');
  assert.equal(chapter.lessons[6]?.fileName, '07-soaps-and-detergents.md');
});

test('two stories pilot catalog exposes all five available lessons', () => {
  const chapter = getChapter(englishPilotChapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    [
      'his-first-flight-fear-and-hunger',
      'his-first-flight-courage-and-family-pressure',
      'the-black-aeroplane-storm-and-mystery',
      'the-black-aeroplane-unknown-helper',
      'poems-wild-animals-and-the-ball-poem',
    ],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-his-first-flight-fear-and-hunger.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-his-first-flight-courage-and-family-pressure.md');
  assert.equal(chapter.lessons[1]?.free, false);
  assert.equal(chapter.lessons[2]?.fileName, '03-the-black-aeroplane-storm-and-mystery.md');
  assert.equal(chapter.lessons[3]?.fileName, '04-the-black-aeroplane-unknown-helper.md');
  assert.equal(chapter.lessons[4]?.fileName, '05-poems-wild-animals-and-the-ball-poem.md');
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
    'activity 1.1: burning magnesium ribbon in air',
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
  assert.match(lessonText, /\[\[demo:figure-1-1-magnesium-ribbon\]\]/);
  assert.match(lessonText, /magnesium ribbon burns with a bright white flame/i);
  assert.match(lessonText, /Mg \+ O2 -> MgO/);
  assert.match(lessonText, /Zn \+ H2SO4 -> ZnSO4 \+ H2/);
  assert.match(lessonText, /Na2SO4\(aq\) \+ BaCl2\(aq\) -> BaSO4\(s\) \+ 2NaCl\(aq\)/);
  assertFourPanelComic(content.blocks);
});

test('acids bases indicator lesson loads with neutralisation demos', async () => {
  const content = await getLessonContent(acidsBasesChapterSlug, 'indicators-and-neutralisation');
  assert.ok(content);

  assert.equal(content.previousLesson, null);
  assert.equal(content.nextLesson?.slug, 'chemical-properties-of-acids-and-bases');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'what indicators tell us',
    'activity 2.1: phenolphthalein with acid and base',
    'activity 2.2: olfactory indicators',
    'neutralisation',
    'activity 2.6: reversible colour change',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-2-1-phenolphthalein-neutralisation\]\]/);
  assert.match(lessonText, /\[\[demo:activity-2-2-olfactory-indicators\]\]/);
  assert.match(lessonText, /\[\[demo:activity-2-6-reversible-neutralisation\]\]/);
  assert.match(lessonText, /HCl \+ NaOH -> NaCl \+ H2O/);
  assertFourPanelComic(content.blocks);
});

test('acids bases chemical properties lesson loads with reaction demos', async () => {
  const content = await getLessonContent(acidsBasesChapterSlug, 'chemical-properties-of-acids-and-bases');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'indicators-and-neutralisation');
  assert.equal(content.nextLesson?.slug, 'ph-and-ions-in-solution');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'acid with metal',
    'activity 2.3: hydrogen pop test',
    'base with metal',
    'activity 2.4: zinc with sodium hydroxide',
    'acid with carbonate',
    'activity 2.5: carbonate and lime water',
    'metallic oxide with acid',
    'activity 2.7: copper oxide and hydrochloric acid',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-2-3-metal-acid-hydrogen-pop\]\]/);
  assert.match(lessonText, /\[\[demo:activity-2-4-base-metal-heating\]\]/);
  assert.match(lessonText, /\[\[demo:activity-2-5-carbonate-acid-lime-water\]\]/);
  assert.match(lessonText, /\[\[demo:activity-2-7-metallic-oxide-acid\]\]/);
  assert.match(lessonText, /Zn \+ H2SO4 -> ZnSO4 \+ H2/);
  assert.match(lessonText, /CuO \+ 2HCl -> CuCl2 \+ H2O/);
  assertFourPanelComic(content.blocks);
});

test('acids bases pH lesson loads with conductivity demo', async () => {
  const content = await getLessonContent(acidsBasesChapterSlug, 'ph-and-ions-in-solution');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'chemical-properties-of-acids-and-bases');
  assert.equal(content.nextLesson?.slug, 'salts-and-daily-life-uses');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'the ph scale',
    'ions in acids and bases',
    'activity 2.8: acid solution conducts electricity',
    'why dry acids do not show the same behaviour',
    'dilution and safety',
    'everyday ph',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-2-8-acid-electricity-conduction\]\]/);
  assert.match(lessonText, /HCl\(aq\) -> H\+\(aq\) \+ Cl-\(aq\)/);
  assert.match(lessonText, /mobile ions/i);
  assertFourPanelComic(content.blocks);
});

test('acids bases salts lesson loads with common salt coverage', async () => {
  const content = await getLessonContent(acidsBasesChapterSlug, 'salts-and-daily-life-uses');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'ph-and-ions-in-solution');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'salt formation',
    'common salt as a raw material',
    'bleaching powder',
    'baking soda',
    'washing soda',
    'plaster of paris',
    'water of crystallisation',
    'chapter reaction map',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /sodium chloride/i);
  assert.match(lessonText, /baking soda/i);
  assert.match(lessonText, /washing soda/i);
  assert.match(lessonText, /plaster of paris/i);
  assert.match(lessonText, /water of crystallisation/i);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals physical properties lesson loads with property demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'physical-properties');
  assert.ok(content);

  assert.equal(content.previousLesson, null);
  assert.equal(content.nextLesson?.slug, 'thermal-conductivity-and-conductivity');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'metal properties',
    'non-metal properties',
    'activity 3.1-3.4 and 3.6: physical property tests',
    'exceptions to remember',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-properties-physical-tests\]\]/);
  assert.match(lessonText, /Graphite conducts electricity/);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals thermal conductivity lesson loads with heat demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'thermal-conductivity-and-conductivity');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'physical-properties');
  assert.equal(content.nextLesson?.slug, 'oxides-and-chemical-properties');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'thermal conductivity',
    'activity 3.5: wax pins on a heated metal rod',
    'electrical conductivity',
    'why metals conduct',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-5-thermal-conductivity\]\]/);
  assert.match(lessonText, /Metals conduct because they contain mobile electrons/);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals oxides lesson loads with combustion demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'oxides-and-chemical-properties');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'thermal-conductivity-and-conductivity');
  assert.equal(content.nextLesson?.slug, 'reactivity-series-and-displacement');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'metals with oxygen',
    'non-metals with oxygen',
    'activity 3.8 and 3.9: combustion and oxide nature',
    'litmus clues',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-8-3-9-combustion-oxides\]\]/);
  assert.match(lessonText, /2Mg \+ O2 -> 2MgO/);
  assert.match(lessonText, /S \+ O2 -> SO2/);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals reactivity lesson loads with displacement demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'reactivity-series-and-displacement');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'oxides-and-chemical-properties');
  assert.equal(content.nextLesson?.slug, 'ionic-compounds');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'reactivity series',
    'reaction with water',
    'reaction with dilute acids',
    'activity 3.10-3.12: reactivity sandbox',
    'displacement reactions',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-10-3-12-reactivity-sandbox\]\]/);
  assert.match(lessonText, /Fe \+ CuSO4 -> FeSO4 \+ Cu/);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals ionic compounds lesson loads with ionic demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'ionic-compounds');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'reactivity-series-and-displacement');
  assert.equal(content.nextLesson?.slug, 'corrosion-and-prevention');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'ion formation',
    'ionic compound properties',
    'activity 3.13: ionic properties',
    'conductivity rule',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-13-ionic-properties\]\]/);
  assert.match(lessonText, /NaCl\(aq\) -> Na\+\(aq\) \+ Cl-\(aq\)/);
  assertFourPanelComic(content.blocks);
});

test('metals non-metals corrosion lesson loads with rusting demo', async () => {
  const content = await getLessonContent(metalsNonMetalsChapterSlug, 'corrosion-and-prevention');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'ionic-compounds');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'what is corrosion',
    'conditions for rusting',
    'activity 3.14: conditions for rusting',
    'prevention methods',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /\[\[demo:activity-3-14-rusting-conditions\]\]/);
  assert.match(lessonText, /both oxygen and water/);
  assertFourPanelComic(content.blocks);
});

test('carbon compounds lesson notes load with board-ready structure', async () => {
  const expectedLessons = [
    ['covalent-bonding-in-carbon', /Carbon has four valence electrons/i],
    ['versatile-nature-of-carbon', /tetravalent and shows catenation/i],
    ['hydrocarbons-and-homologous-series', /successive members differing by `CH2`/i],
    ['functional-groups-and-naming', /carboxylic acid/i],
    ['chemical-properties-of-carbon-compounds', /methane reacts with chlorine in sunlight/i],
    ['ethanol-and-ethanoic-acid', /esterification/i],
    ['soaps-and-detergents', /micelle formation/i],
  ] as const;

  for (const [lessonSlug, textPattern] of expectedLessons) {
    const content = await getLessonContent(carbonCompoundsChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    assertRequiredHeadings(content.blocks, [
      'learning goals',
      'solved examples',
      'common mistakes',
      'board tips',
      'quick practice',
      'answer check',
      'one-minute revision',
      'comic recap',
    ]);

    assert.match(getAllText(content.blocks), textPattern);
    assertFourPanelComic(content.blocks);
  }
});

test('carbon compounds chemistry lessons embed Chapter 4 lab demos', async () => {
  const expectedDemoMarkers = new Map([
    [
      'covalent-bonding-in-carbon',
      ['[[demo:activity-4-1-carbon-around-us]]'],
    ],
    [
      'functional-groups-and-naming',
      ['[[demo:activity-4-2-alcohol-homologous-series]]'],
    ],
    [
      'chemical-properties-of-carbon-compounds',
      [
        '[[demo:activity-4-3-4-4-combustion]]',
        '[[demo:activity-4-5-oxidation-ethanol]]',
      ],
    ],
    [
      'ethanol-and-ethanoic-acid',
      [
        '[[demo:activity-4-6-ethanol-sodium]]',
        '[[demo:activity-4-7-acid-strength]]',
        '[[demo:activity-4-8-esterification]]',
        '[[demo:activity-4-9-ethanoic-acid-carbonate]]',
      ],
    ],
    [
      'soaps-and-detergents',
      [
        '[[demo:activity-4-10-emulsion-micelles]]',
        '[[demo:activity-4-11-soap-hard-water]]',
        '[[demo:activity-4-12-soap-vs-detergent]]',
      ],
    ],
  ]);

  for (const [lessonSlug, markers] of expectedDemoMarkers) {
    const content = await getLessonContent(carbonCompoundsChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    const lessonText = getAllText(content.blocks);
    for (const marker of markers) {
      assert.match(lessonText, new RegExp(marker.replaceAll('[', '\\[').replaceAll(']', '\\]')));
    }
  }
});

test('carbon compounds notes preserve NCERT Chapter 4 activity numbering', async () => {
  const expectedActivityText = new Map([
    [
      'covalent-bonding-in-carbon',
      ['Activity 4.1: Carbon around us', '[[demo:activity-4-1-carbon-around-us]]'],
    ],
    [
      'functional-groups-and-naming',
      ['Activity 4.2: Alcohol homologous series', '[[demo:activity-4-2-alcohol-homologous-series]]'],
    ],
    [
      'chemical-properties-of-carbon-compounds',
      [
        '[[demo:activity-4-3-4-4-combustion]]',
        'Activity 4.3 in the textbook',
        'Activity 4.4 changes the air hole',
        '[[demo:activity-4-5-oxidation-ethanol]]',
      ],
    ],
    [
      'ethanol-and-ethanoic-acid',
      [
        '[[demo:activity-4-6-ethanol-sodium]]',
        '[[demo:activity-4-7-acid-strength]]',
        '[[demo:activity-4-8-esterification]]',
        '[[demo:activity-4-9-ethanoic-acid-carbonate]]',
        'sodium hydrogencarbonate',
      ],
    ],
    [
      'soaps-and-detergents',
      [
        '[[demo:activity-4-10-emulsion-micelles]]',
        '[[demo:activity-4-11-soap-hard-water]]',
        '[[demo:activity-4-12-soap-vs-detergent]]',
      ],
    ],
  ]);

  for (const [lessonSlug, expectedTexts] of expectedActivityText) {
    const content = await getLessonContent(carbonCompoundsChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    const lessonText = getAllText(content.blocks);
    for (const expectedText of expectedTexts) {
      assert.match(lessonText, new RegExp(expectedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    }
  }
});

test('life processes lesson notes load with NCERT-aligned structure', async () => {
  const expectedLessons = [
    ['life-processes-and-nutrition-in-plants', /Activity 5\.1: Variegated leaf starch test/i],
    ['heterotrophic-and-human-nutrition', /Amoeba uses temporary finger-like extensions/i],
    ['respiration-and-gas-exchange', /pyruvate is broken down in different pathways/i],
    ['transportation-in-human-beings', /valves prevent backward flow/i],
    ['transportation-in-plants', /translocation uses energy from ATP/i],
    ['excretion-in-human-beings-and-plants', /Bowman's capsule collects the filtrate/i],
  ] as const;

  for (const [lessonSlug, textPattern] of expectedLessons) {
    const content = await getLessonContent(lifeProcessesChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    const requiredHeadings = [
      'learning goals',
      'ncert activity and figure tracker',
      'solved examples',
      'common mistakes',
      'board tips',
      'quick practice',
      'answer check',
      'one-minute revision',
      'comic recap',
    ];

    if (lessonSlug !== 'transportation-in-human-beings') {
      requiredHeadings.splice(2, 0, 'questions and answers');
    }

    assertRequiredHeadings(content.blocks, requiredHeadings);

    assert.match(getAllText(content.blocks), textPattern);
    assertFourPanelComic(content.blocks);
  }
});

test('life processes lesson notes include textbook question-answer blocks', async () => {
  const expectedText = new Map([
    [
      'life-processes-and-nutrition-in-plants',
      [
        'Why is diffusion insufficient to meet the oxygen requirements of multi-cellular organisms like humans?',
        'What criteria do we use to decide whether something is alive?',
        'What are outside raw materials used for by an organism?',
        'What processes would you consider essential for maintaining life?',
      ],
    ],
    [
      'heterotrophic-and-human-nutrition',
      [
        'What are the differences between autotrophic nutrition and heterotrophic nutrition?',
        'Where do plants get each of the raw materials required for photosynthesis?',
        'What is the role of the acid in our stomach?',
        'What is the function of digestive enzymes?',
        'How is the small intestine designed to absorb digested food?',
      ],
    ],
    [
      'respiration-and-gas-exchange',
      [
        'What advantage over an aquatic organism does a terrestrial organism have with regard to obtaining oxygen for respiration?',
        'What are the different ways in which glucose is oxidised to provide energy in various organisms?',
        'How is oxygen and carbon dioxide transported in human beings?',
        'How are the lungs designed in human beings to maximise the area for exchange of gases?',
      ],
    ],
    [
      'transportation-in-plants',
      [
        'What are the components of the transport system in human beings? What are the functions of these components?',
        'Why is it necessary to separate oxygenated and deoxygenated blood in mammals and birds?',
        'What are the components of the transport system in highly organised plants?',
        'How are water and minerals transported in plants?',
        'How is food transported in plants?',
      ],
    ],
    [
      'excretion-in-human-beings-and-plants',
      [
        'Describe the structure and functioning of nephrons.',
        'What are the methods used by plants to get rid of excretory products?',
        'How is the amount of urine produced regulated?',
      ],
    ],
  ]);

  for (const [lessonSlug, expectedTexts] of expectedText) {
    const content = await getLessonContent(lifeProcessesChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    const lessonText = getAllText(content.blocks);
    assert.match(lessonText, /Questions and answers/i);
    for (const expected of expectedTexts) {
      assert.match(lessonText, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    }
  }
});

test('life processes textbook question blocks follow NCERT placement', async () => {
  const plantNutrition = await getLessonContent(
    lifeProcessesChapterSlug,
    'life-processes-and-nutrition-in-plants',
  );
  assert.ok(plantNutrition);

  const plantText = getAllText(plantNutrition.blocks);
  const headingOrder = plantNutrition.blocks.flatMap((block) =>
    block.type === 'h2' ? [block.text] : [],
  );
  const lifeProcessesIndex = headingOrder.indexOf('5.1 What are life processes?');
  const questionsIndex = headingOrder.indexOf('Questions and answers');
  const nutritionIndex = headingOrder.indexOf('5.2 Nutrition');
  const diffusionQuestionIndex = plantText.indexOf(
    'Why is diffusion insufficient to meet the oxygen requirements of multi-cellular organisms like humans?',
  );

  assert.ok(lifeProcessesIndex !== -1, 'Expected 5.1 heading');
  assert.ok(questionsIndex !== -1, 'Expected 5.1 Questions and answers block');
  assert.ok(diffusionQuestionIndex !== -1, 'Expected exact NCERT 5.1 question');
  assert.ok(nutritionIndex !== -1, 'Expected 5.2 heading');
  assert.ok(lifeProcessesIndex < questionsIndex, 'Expected questions after 5.1');
  assert.ok(questionsIndex < nutritionIndex, 'Expected 5.1 questions before 5.2 Nutrition');

  const humanTransport = await getLessonContent(
    lifeProcessesChapterSlug,
    'transportation-in-human-beings',
  );
  assert.ok(humanTransport);
  assert.doesNotMatch(
    getAllText(humanTransport.blocks),
    /What are the components of the transport system in human beings\?/i,
  );

  const plantTransport = await getLessonContent(lifeProcessesChapterSlug, 'transportation-in-plants');
  assert.ok(plantTransport);
  const plantTransportText = getAllText(plantTransport.blocks);
  assert.match(
    plantTransportText,
    /What are the components of the transport system in human beings\? What are the functions of these components\?/i,
  );
});

test('life processes notes preserve NCERT Chapter 5 activity and figure numbering', async () => {
  const expectedText = new Map([
    [
      'life-processes-and-nutrition-in-plants',
      [
        'Figure 5.1: Cross-section of a leaf',
        'Figure 5.2: Variegated leaf before and after starch test',
        'Figure 5.3: Open and closed stomatal pore',
        'Figure 5.4: Experimental set-up with and without potassium hydroxide',
        'Activity 5.1: Variegated leaf starch test',
        'Activity 5.2: Designing a sunlight test for photosynthesis',
      ],
    ],
    [
      'heterotrophic-and-human-nutrition',
      [
        'Figure 5.5: Nutrition in Amoeba',
        'Figure 5.6: Human alimentary canal',
        'Activity 5.3: Saliva acts on starch',
        'dental caries',
      ],
    ],
    [
      'respiration-and-gas-exchange',
      [
        'Figure 5.7: Air passed into lime water',
        'Figure 5.8: Break-down of glucose by various pathways',
        'Figure 5.9: Human respiratory system',
        'Activity 5.4: Exhaled air turns lime water milky',
        'Activity 5.5: Yeast fermentation and lime water',
        'Activity 5.7: Haemoglobin range survey',
        'Smoking is injurious to health',
      ],
    ],
    [
      'transportation-in-human-beings',
      [
        'Figure 5.10: Schematic sectional view of the human heart',
        'Figure 5.11: Transport and exchange of oxygen and carbon dioxide',
        'sphygmomanometer',
        'platelet cells',
        'lymph',
      ],
    ],
    [
      'transportation-in-plants',
      [
        'Figure 5.12: Movement of water during transpiration in a tree',
        'Activity 5.8: Transpiration from a plant compared with a stick',
        'root pressure',
        'transpiration pull',
      ],
    ],
    [
      'excretion-in-human-beings-and-plants',
      [
        'Figure 5.13: Excretory system in human beings',
        'Figure 5.14: Structure of a nephron',
        'artificial kidney',
        'organ donation',
        'cellular vacuoles',
      ],
    ],
  ]);

  for (const [lessonSlug, expectedTexts] of expectedText) {
    const content = await getLessonContent(lifeProcessesChapterSlug, lessonSlug);
    assert.ok(content, `Expected lesson content for ${lessonSlug}`);

    const lessonText = getAllText(content.blocks);
    for (const expected of expectedTexts) {
      assert.match(lessonText, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    }
  }
});

test('life processes lesson titles preserve NCERT Chapter 5 topic numbering', async () => {
  const chapter = getChapter(lifeProcessesChapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.title),
    [
      '5.1 What are life processes? and 5.2 Nutrition',
      '5.2.2-5.2.4 Heterotrophic and human nutrition',
      '5.3 Respiration',
      '5.4.1 Transportation in human beings',
      '5.4.2 Transportation in plants',
      '5.5 Excretion',
    ],
  );

  for (const lesson of getAvailableLessons(chapter)) {
    const content = await getLessonContent(lifeProcessesChapterSlug, lesson.slug);
    assert.ok(content, `Expected lesson content for ${lesson.slug}`);
    assert.equal(content.lesson.title, lesson.title);
    assert.equal(content.blocks[0]?.type, 'h1');
    if (content.blocks[0]?.type === 'h1') {
      assert.equal(content.blocks[0].text, lesson.title);
    }
  }
});

test('life processes plant nutrition lesson shows parent 5.2 before 5.2.1', async () => {
  const content = await getLessonContent(
    lifeProcessesChapterSlug,
    'life-processes-and-nutrition-in-plants',
  );
  assert.ok(content);

  const headings = content.blocks.flatMap((block) =>
    block.type === 'h2' ? [block.text] : [],
  );
  const nutritionIndex = headings.indexOf('5.2 Nutrition');
  const autotrophicIndex = headings.indexOf('5.2.1 Autotrophic nutrition');

  assert.notEqual(nutritionIndex, -1, 'Expected parent heading 5.2 Nutrition');
  assert.notEqual(autotrophicIndex, -1, 'Expected child heading 5.2.1 Autotrophic nutrition');
  assert.ok(
    nutritionIndex < autotrophicIndex,
    'Expected 5.2 Nutrition to appear before 5.2.1 Autotrophic nutrition',
  );
});

test('his first flight fear lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(englishPilotChapterSlug, 'his-first-flight-fear-and-hunger');
  assert.ok(content);

  assert.equal(content.previousLesson, null);
  assert.equal(content.nextLesson?.slug, 'his-first-flight-courage-and-family-pressure');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'story context',
    'key idea',
    'important moments',
    'character or speaker insight',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
    'remember this line',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /young seagull/i);
  assert.match(lessonText, /afraid/i);
  assert.match(lessonText, /hunger/i);
  assert.match(lessonText, /not lazy/i);
  assertFourPanelComic(content.blocks);
});

test('his first flight courage lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(
    englishPilotChapterSlug,
    'his-first-flight-courage-and-family-pressure',
  );
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'his-first-flight-fear-and-hunger');
  assert.equal(content.nextLesson?.slug, 'the-black-aeroplane-storm-and-mystery');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'story context',
    'key idea',
    'important moments',
    'character or speaker insight',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
    'remember this line',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /mother/i);
  assert.match(lessonText, /food/i);
  assert.match(lessonText, /dive/i);
  assert.match(lessonText, /confidence/i);
  assertFourPanelComic(content.blocks);
});

test('black aeroplane storm lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(
    englishPilotChapterSlug,
    'the-black-aeroplane-storm-and-mystery',
  );
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'his-first-flight-courage-and-family-pressure');
  assert.equal(content.nextLesson?.slug, 'the-black-aeroplane-unknown-helper');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'story context',
    'key idea',
    'important moments',
    'character or speaker insight',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
    'remember this line',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /England/i);
  assert.match(lessonText, /storm/i);
  assert.match(lessonText, /instruments/i);
  assert.match(lessonText, /suspense/i);
  assertFourPanelComic(content.blocks);
});

test('black aeroplane unknown helper lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(englishPilotChapterSlug, 'the-black-aeroplane-unknown-helper');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'the-black-aeroplane-storm-and-mystery');
  assert.equal(content.nextLesson?.slug, 'poems-wild-animals-and-the-ball-poem');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'story context',
    'key idea',
    'important moments',
    'character or speaker insight',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
    'remember this line',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /black aeroplane/i);
  assert.match(lessonText, /control room/i);
  assert.match(lessonText, /no other aeroplane/i);
  assert.match(lessonText, /mystery/i);
  assertFourPanelComic(content.blocks);
});

test('poems lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(englishPilotChapterSlug, 'poems-wild-animals-and-the-ball-poem');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'the-black-aeroplane-unknown-helper');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'story context',
    'key idea',
    'important moments',
    'character or speaker insight',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
    'remember this line',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /How to Tell Wild Animals/i);
  assert.match(lessonText, /humour/i);
  assert.match(lessonText, /The Ball Poem/i);
  assert.match(lessonText, /loss and growing up/i);
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
