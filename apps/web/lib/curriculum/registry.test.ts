import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CURRICULUM_SUBJECTS,
  createCurriculumRegistry,
  getActiveCurriculumSession,
  getCurriculumSubject,
  getVisibleCurriculumSubjects,
} from './registry';
import { CLASS_10_2026_27_SESSION } from './sessions/2026-27';
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

function getChapterRegistry(subjectSlug: string) {
  const subject = getCurriculumSubject(subjectSlug);

  assert.ok(subject);

  return subject.units.map((unit) => ({
    id: unit.id,
    chapters: unit.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      scope: chapter.scope,
      platformChapterSlugs: chapter.platformChapterSlugs,
    })),
  }));
}

function getTopic(subjectSlug: string, topicId: string) {
  const subject = getCurriculumSubject(subjectSlug);

  assert.ok(subject);

  const topic = subject.units
    .flatMap((unit) => unit.chapters)
    .flatMap((chapter) => chapter.topics)
    .find((candidate) => candidate.id === topicId);

  assert.ok(topic, `${subjectSlug} is missing ${topicId}`);

  return topic;
}

test('registry exposes the active Class 10 subject identities', () => {
  assert.equal(getActiveCurriculumSession(), CLASS_10_2026_27_SESSION);
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

test('registry selection does not mutate subjects from another session', () => {
  const current = getCurriculumSubject('mathematics-standard');
  assert.ok(current);

  const historical: CurriculumSubject = {
    ...current,
    academicSession: '2025-26',
    title: 'Historical Mathematics Standard',
  };
  const currentRegistry = createCurriculumRegistry(
    [historical, current],
    CLASS_10_2026_27_SESSION,
  );
  const historicalRegistry = createCurriculumRegistry(
    [historical, current],
    '2025-26',
  );

  assert.equal(currentRegistry.getActiveSession(), '2026-27');
  assert.equal(historicalRegistry.getActiveSession(), '2025-26');
  assert.equal(
    currentRegistry.getSubject('mathematics-standard')?.academicSession,
    '2026-27',
  );
  assert.equal(
    historicalRegistry.getSubject('mathematics-standard')?.academicSession,
    '2025-26',
  );
  assert.equal(current.academicSession, '2026-27');
  assert.equal(historical.academicSession, '2025-26');
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

test('Mathematics Basic remains a future hidden profile until activation is completed', () => {
  const subject = getCurriculumSubject('mathematics-basic');

  assert.ok(subject);
  assert.equal(subject.status, 'future');
  assert.equal(subject.visibleInCatalog, false);
  assert.ok(subject.activationBlockers.length > 0);
  assert.equal(subject.subjectCode, '241');
});

test('current blueprint readiness is truthful per subject', () => {
  const expected = {
    'mathematics-standard': 'ready',
    science: 'blocked',
    'social-science': 'ready',
    'english-language-and-literature': 'blocked',
    'hindi-course-b': 'blocked',
  } as const;

  for (const [slug, blueprintStatus] of Object.entries(expected)) {
    const subject = getCurriculumSubject(slug);

    assert.ok(subject);
    assert.equal(subject.examProfile?.blueprintStatus, blueprintStatus, slug);
    assert.equal(
      blueprintStatus === 'ready'
        ? subject.examProfile?.blueprintSourceIds.length
        : subject.examProfile?.blueprintBlockers.length,
      1,
      slug,
    );
  }
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
    ['words-and-expressions-2', undefined],
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

test('core curriculum topics are explicit official entries with topic-level platform evidence', () => {
  for (const slug of [
    'mathematics-standard',
    'science',
    'social-science',
    'english-language-and-literature',
    'hindi-course-b',
  ]) {
    const subject = getCurriculumSubject(slug);

    assert.ok(subject);

    const topics = subject.units.flatMap((unit) =>
      unit.chapters.flatMap((chapter) => chapter.topics),
    );

    assert.ok(topics.length > subject.units.length, slug);
    assert.equal(
      topics.some((topic) => topic.id.endsWith('-coverage')),
      false,
      slug,
    );

    for (const topic of topics.filter((candidate) => candidate.scope === 'board-exam')) {
      assert.ok(topic.minimumReviewedQuestionCount >= 3, topic.id);
      assert.ok(topic.requiredQuestionTypes.length > 0, topic.id);
    }
  }
});

test('known stale Mathematics content is excluded from the 2026-27 board scope', () => {
  assert.equal(
    getTopic('mathematics-standard', 'real-numbers-euclid-division-algorithm').scope,
    'excluded',
  );
  assert.equal(
    getTopic('mathematics-standard', 'quadratic-equations-completing-square').scope,
    'excluded',
  );
  assert.equal(
    getTopic('mathematics-standard', 'coordinate-geometry-area-of-triangle').scope,
    'excluded',
  );
});

test('known formative Science content is internal-only and never board-exam coverage', () => {
  for (const topicId of [
    'periodic-classification-of-elements',
    'evolution',
    'electric-motor',
    'electromagnetic-induction',
    'electric-generator',
  ]) {
    assert.equal(getTopic('science', topicId).scope, 'internal-only', topicId);
  }

  assert.equal(getTopic('science', 'heredity').scope, 'internal-only');
  assert.equal(
    getTopic('science', 'domestic-electric-circuits').scope,
    'board-exam',
  );
});

test('HPE uses the official internal strands and exact assessment weighting', () => {
  const subject = getCurriculumSubject('health-and-physical-education');

  assert.ok(subject);
  assert.equal(subject.assessmentMode, 'internal');
  assert.equal(subject.examProfile, null);
  assert.deepEqual(
    subject.units.map((unit) => ({
      id: unit.id,
      marks: unit.marks,
      title: unit.title,
    })),
    [
      { id: 'games-and-sports', marks: 50, title: 'Games / Sports' },
      { id: 'health-and-fitness', marks: 25, title: 'Health and Fitness' },
      { id: 'sewa', marks: 25, title: 'SEWA' },
      {
        id: 'health-and-activity-card',
        marks: 0,
        title: 'Health and Activity Card',
      },
    ],
  );
  assert.deepEqual(
    subject.units.map((unit) =>
      unit.chapters.flatMap((chapter) =>
        chapter.topics.map((topic) => topic.scope),
      ),
    ),
    [
      ['internal-only'],
      [
        'internal-only',
        'supporting-resource',
        'supporting-resource',
        'supporting-resource',
      ],
      ['internal-only'],
      ['supporting-resource'],
    ],
  );
});

test('Words and Expressions II has the exact current 9-unit prescribed and excluded set', () => {
  const subject = getCurriculumSubject('english-language-and-literature');

  assert.ok(subject);

  const workbook = subject.units.find((unit) => unit.id === 'words-and-expressions-2');
  assert.ok(workbook);

  assert.deepEqual(
    workbook.chapters.map((chapter) => ({
      id: chapter.id,
      scope: chapter.scope,
      platformChapterSlugs: chapter.platformChapterSlugs,
    })),
    [
      ['unit-1', 'supporting-resource', ['words-and-expressions-a-letter-to-god']],
      [
        'unit-2',
        'supporting-resource',
        ['words-and-expressions-nelson-mandela-long-walk-to-freedom'],
      ],
      [
        'unit-3',
        'supporting-resource',
        ['words-and-expressions-two-stories-about-flying'],
      ],
      [
        'unit-4',
        'supporting-resource',
        ['words-and-expressions-from-the-diary-of-anne-frank'],
      ],
      ['unit-5', 'excluded', ['words-and-expressions-glimpses-of-india']],
      ['unit-6', 'excluded', ['words-and-expressions-mijbil-the-otter']],
      [
        'unit-7',
        'supporting-resource',
        ['words-and-expressions-madam-rides-the-bus'],
      ],
      [
        'unit-8',
        'supporting-resource',
        ['words-and-expressions-the-sermon-at-benares'],
      ],
      ['unit-9', 'supporting-resource', ['words-and-expressions-the-proposal']],
    ].map(([id, scope, platformChapterSlugs]) => ({
      id,
      scope,
      platformChapterSlugs,
    })),
  );
  assert.deepEqual(subject.readinessBlockers, [
    'Current 2026-27 English blueprint evidence has not been officially verified.',
  ]);
});

test('prescribed-resource provenance is complete for current core sources', () => {
  const expectedBookIds = {
    'mathematics-standard': [
      'ncert-mathematics-class-10',
      'cbse-mathematics-laboratory-guidelines-class-10',
      'ncert-mathematics-laboratory-manual-secondary',
      'ncert-mathematics-exemplar-class-10',
    ],
    science: [
      'ncert-science-class-10',
      'cbse-assessment-of-practical-skills-science-class-10',
      'ncert-laboratory-manual-science-class-10',
      'ncert-science-exemplar-class-10',
      'cbse-reading-material-science-class-10-2026-27',
    ],
    'social-science': [
      'ncert-india-and-contemporary-world-2',
      'ncert-contemporary-india-2',
      'ncert-democratic-politics-2',
      'ncert-understanding-economic-development',
    ],
    'english-language-and-literature': [
      'first-flight',
      'footprints-without-feet',
      'words-and-expressions-2',
    ],
    'hindi-course-b': ['sparsh-part-2', 'sanchayan-part-2'],
  } as const;

  for (const [slug, bookIds] of Object.entries(expectedBookIds)) {
    const subject = getCurriculumSubject(slug);

    assert.ok(subject);
    assert.deepEqual(
      subject.books.map((book) => book.id),
      bookIds,
      slug,
    );
    assert.ok(subject.books.every((book) => subject.officialSourceIds.includes(book.sourceId)));
  }
});

test('Social Science registers the exact complete chapter set', () => {
  const subject = getCurriculumSubject('social-science');

  assert.ok(subject);

  assert.deepEqual(getChapterRegistry('social-science'), [
    {
      id: 'history',
      chapters: [
        {
          id: 'rise-of-nationalism-in-europe',
          title: 'The Rise of Nationalism in Europe',
          scope: 'board-exam',
          platformChapterSlugs: ['rise-of-nationalism-in-europe'],
        },
        {
          id: 'nationalism-in-india',
          title: 'Nationalism in India',
          scope: 'board-exam',
          platformChapterSlugs: ['nationalism-in-india'],
        },
        {
          id: 'making-of-a-global-world',
          title: 'The Making of a Global World',
          scope: 'board-exam',
          platformChapterSlugs: ['making-of-a-global-world'],
        },
        {
          id: 'the-age-of-industrialisation',
          title: 'The Age of Industrialisation',
          scope: 'periodic-only',
          platformChapterSlugs: ['the-age-of-industrialisation'],
        },
        {
          id: 'print-culture',
          title: 'Print Culture and the Modern World',
          scope: 'board-exam',
          platformChapterSlugs: ['print-culture'],
        },
      ],
    },
    {
      id: 'geography',
      chapters: [
        {
          id: 'resources-and-development',
          title: 'Resources and Development',
          scope: 'board-exam',
          platformChapterSlugs: ['resources-and-development'],
        },
        {
          id: 'forest-and-wildlife-resources',
          title: 'Forest and Wildlife Resources',
          scope: 'board-exam',
          platformChapterSlugs: ['forest-and-wildlife-resources'],
        },
        {
          id: 'water-resources',
          title: 'Water Resources',
          scope: 'board-exam',
          platformChapterSlugs: ['water-resources'],
        },
        {
          id: 'agriculture',
          title: 'Agriculture',
          scope: 'board-exam',
          platformChapterSlugs: ['agriculture'],
        },
        {
          id: 'minerals-and-energy-resources',
          title: 'Minerals and Energy Resources',
          scope: 'board-exam',
          platformChapterSlugs: ['minerals-and-energy-resources'],
        },
        {
          id: 'manufacturing-industries',
          title: 'Manufacturing Industries',
          scope: 'board-exam',
          platformChapterSlugs: ['manufacturing-industries'],
        },
        {
          id: 'lifelines-of-national-economy',
          title: 'Lifelines of National Economy',
          scope: 'board-exam',
          platformChapterSlugs: ['lifelines-of-national-economy'],
        },
      ],
    },
    {
      id: 'political-science',
      chapters: [
        {
          id: 'power-sharing',
          title: 'Power Sharing',
          scope: 'board-exam',
          platformChapterSlugs: ['power-sharing'],
        },
        {
          id: 'federalism',
          title: 'Federalism',
          scope: 'board-exam',
          platformChapterSlugs: ['federalism'],
        },
        {
          id: 'gender-religion-and-caste',
          title: 'Gender, Religion and Caste',
          scope: 'board-exam',
          platformChapterSlugs: ['gender-religion-and-caste'],
        },
        {
          id: 'political-parties',
          title: 'Political Parties',
          scope: 'board-exam',
          platformChapterSlugs: ['political-parties'],
        },
        {
          id: 'outcomes-of-democracy',
          title: 'Outcomes of Democracy',
          scope: 'board-exam',
          platformChapterSlugs: ['outcomes-of-democracy'],
        },
      ],
    },
    {
      id: 'economics',
      chapters: [
        {
          id: 'development',
          title: 'Development',
          scope: 'board-exam',
          platformChapterSlugs: ['development'],
        },
        {
          id: 'sectors-of-indian-economy',
          title: 'Sectors of the Indian Economy',
          scope: 'board-exam',
          platformChapterSlugs: ['sectors-of-indian-economy'],
        },
        {
          id: 'money-and-credit',
          title: 'Money and Credit',
          scope: 'board-exam',
          platformChapterSlugs: ['money-and-credit'],
        },
        {
          id: 'globalisation',
          title: 'Globalisation and the Indian Economy',
          scope: 'board-exam',
          platformChapterSlugs: ['globalisation'],
        },
        {
          id: 'consumer-rights',
          title: 'Consumer Rights',
          scope: 'project-only',
          platformChapterSlugs: ['consumer-rights'],
        },
      ],
    },
    {
      id: 'excluded-platform-packs',
      chapters: [
        {
          id: 'the-rise-of-nationalism-in-europe-pack',
          title: 'The Rise of Nationalism in Europe (duplicate pack)',
          scope: 'excluded',
          platformChapterSlugs: ['the-rise-of-nationalism-in-europe'],
        },
        {
          id: 'the-making-of-a-global-world-pack',
          title: 'The Making of a Global World (duplicate pack)',
          scope: 'excluded',
          platformChapterSlugs: ['the-making-of-a-global-world'],
        },
        {
          id: 'print-culture-and-the-modern-world-pack',
          title: 'Print Culture and the Modern World (duplicate pack)',
          scope: 'excluded',
          platformChapterSlugs: ['print-culture-and-the-modern-world'],
        },
        {
          id: 'sectors-of-the-indian-economy-pack',
          title: 'Sectors of the Indian Economy (duplicate pack)',
          scope: 'excluded',
          platformChapterSlugs: ['sectors-of-the-indian-economy'],
        },
        {
          id: 'globalisation-and-the-indian-economy-pack',
          title: 'Globalisation and the Indian Economy (duplicate pack)',
          scope: 'excluded',
          platformChapterSlugs: ['globalisation-and-the-indian-economy'],
        },
      ],
    },
  ]);
});

test('Social Science splits mixed board and project scope into exact topics', () => {
  const subject = getCurriculumSubject('social-science');

  assert.ok(subject);

  const mixedChapters = subject.units
    .flatMap((unit) => unit.chapters)
    .filter((chapter) =>
      [
        'making-of-a-global-world',
        'lifelines-of-national-economy',
        'globalisation',
      ].includes(chapter.id),
    )
    .map((chapter) => ({
      id: chapter.id,
      topics: chapter.topics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        scope: topic.scope,
        requiredQuestionTypes: topic.requiredQuestionTypes,
      })),
    }));

  assert.deepEqual(mixedChapters, [
    {
      id: 'making-of-a-global-world',
      topics: [
        {
          id: 'making-of-a-global-world-pre-modern-world',
          title: 'The pre-modern world',
          scope: 'board-exam',
          requiredQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'source-based'],
        },
        {
          id: 'making-of-a-global-world-conquest-disease-trade',
          title: 'Conquest, disease and trade',
          scope: 'board-exam',
          requiredQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'source-based'],
        },
        {
          id: 'making-of-a-global-world-interdisciplinary-project',
          title: 'The nineteenth century to globalisation interdisciplinary project',
          scope: 'project-only',
          requiredQuestionTypes: [],
        },
      ],
    },
    {
      id: 'lifelines-of-national-economy',
      topics: [
        {
          id: 'lifelines-of-national-economy-map-skill',
          title: 'Board map pointing',
          scope: 'board-exam',
          requiredQuestionTypes: ['map-skill'],
        },
        {
          id: 'lifelines-of-national-economy-interdisciplinary-project',
          title: 'Interdisciplinary project',
          scope: 'project-only',
          requiredQuestionTypes: [],
        },
      ],
    },
    {
      id: 'globalisation',
      topics: [
        {
          id: 'globalisation-board-exam',
          title: 'What is globalisation and factors enabling globalisation',
          scope: 'board-exam',
          requiredQuestionTypes: [
            'mcq',
            'short-answer',
            'long-answer',
            'source-based',
            'case-study',
          ],
        },
        {
          id: 'globalisation-interdisciplinary-project',
          title: 'Production across countries, WTO and the struggle for fair globalisation',
          scope: 'project-only',
          requiredQuestionTypes: [],
        },
      ],
    },
  ]);
});

test('English registers the exact prescribed domain and literature text set', () => {
  const subject = getCurriculumSubject('english-language-and-literature');

  assert.ok(subject);

  assert.deepEqual(getChapterRegistry('english-language-and-literature').slice(0, 3), [
    {
      id: 'reading',
      chapters: [
        {
          id: 'discursive-passage',
          title: 'Discursive Passage',
          scope: 'board-exam',
          platformChapterSlugs: ['english-reading-discursive-passage'],
        },
        {
          id: 'case-based-factual-passage',
          title: 'Case-based Factual Passage',
          scope: 'board-exam',
          platformChapterSlugs: ['english-reading-case-based-factual-passage'],
        },
      ],
    },
    {
      id: 'writing-and-grammar',
      chapters: [
        {
          id: 'grammar',
          title: 'Grammar',
          scope: 'board-exam',
          platformChapterSlugs: ['english-grammar'],
        },
        {
          id: 'formal-letter',
          title: 'Formal Letter',
          scope: 'board-exam',
          platformChapterSlugs: ['english-formal-letter'],
        },
        {
          id: 'analytical-paragraph',
          title: 'Analytical Paragraph',
          scope: 'board-exam',
          platformChapterSlugs: ['english-analytical-paragraph'],
        },
      ],
    },
    {
      id: 'literature',
      chapters: [
        ['prose-a-letter-to-god', 'A Letter to God', ['a-letter-to-god']],
        [
          'prose-nelson-mandela-long-walk-to-freedom',
          'Nelson Mandela - Long Walk to Freedom',
          ['nelson-mandela-long-walk-to-freedom'],
        ],
        ['prose-stories-about-flying', 'Stories About Flying', ['two-stories-about-flying']],
        [
          'prose-from-the-diary-of-anne-frank',
          'From the Diary of Anne Frank',
          ['from-the-diary-of-anne-frank'],
        ],
        ['prose-glimpses-of-india', 'Glimpses of India', ['glimpses-of-india']],
        ['prose-mijbil-the-otter', 'Mijbil the Otter', ['mijbil-the-otter']],
        ['prose-madam-rides-the-bus', 'Madam Rides the Bus', ['madam-rides-the-bus']],
        [
          'prose-the-sermon-at-benares',
          'The Sermon at Benares',
          ['the-sermon-at-benares'],
        ],
        ['prose-the-proposal', 'The Proposal', ['the-proposal']],
        ['poem-dust-of-snow', 'Dust of Snow', ['dust-of-snow']],
        ['poem-fire-and-ice', 'Fire and Ice', ['fire-and-ice']],
        ['poem-a-tiger-in-the-zoo', 'A Tiger in the Zoo', ['a-tiger-in-the-zoo']],
        ['poem-how-to-tell-wild-animals', 'How to Tell Wild Animals', ['how-to-tell-wild-animals']],
        ['poem-the-ball-poem', 'The Ball Poem', ['the-ball-poem']],
        ['poem-amanda', 'Amanda!', ['amanda']],
        ['poem-the-trees', 'The Trees', ['the-trees']],
        ['poem-fog', 'Fog', ['fog']],
        ['poem-the-tale-of-custard-the-dragon', 'The Tale of Custard the Dragon', ['the-tale-of-custard-the-dragon']],
        ['poem-for-anne-gregory', 'For Anne Gregory', ['for-anne-gregory']],
        [
          'supplementary-a-triumph-of-surgery',
          'A Triumph of Surgery',
          ['a-triumph-of-surgery'],
        ],
        ['supplementary-the-thiefs-story', "The Thief's Story", ['the-thiefs-story']],
        [
          'supplementary-the-midnight-visitor',
          'The Midnight Visitor',
          ['the-midnight-visitor'],
        ],
        ['supplementary-a-question-of-trust', 'A Question of Trust', ['a-question-of-trust']],
        [
          'supplementary-footprints-without-feet',
          'Footprints Without Feet',
          ['footprints-without-feet'],
        ],
        [
          'supplementary-the-making-of-a-scientist',
          'The Making of a Scientist',
          ['the-making-of-a-scientist'],
        ],
        ['supplementary-the-necklace', 'The Necklace', ['the-necklace']],
        ['supplementary-bholi', 'Bholi', ['bholi']],
        [
          'supplementary-the-book-that-saved-the-earth',
          'The Book that Saved the Earth',
          ['the-book-that-saved-the-earth'],
        ],
      ].map(([id, title, platformChapterSlugs]) => ({
        id,
        title,
        scope: 'board-exam',
        platformChapterSlugs,
      })),
    },
  ]);
});

test('Hindi registers the exact complete domain and prescribed text set', () => {
  const subject = getCurriculumSubject('hindi-course-b');

  assert.ok(subject);

  assert.deepEqual(getChapterRegistry('hindi-course-b'), [
    {
      id: 'unseen-comprehension',
      chapters: [
        {
          id: 'unseen-prose-passages',
          title: 'अपठित गद्यांश',
          scope: 'board-exam',
          platformChapterSlugs: ['hindi-apatit-gadyansh'],
        },
      ],
    },
    {
      id: 'grammar',
      chapters: [
        ['padbandh', 'पदबंध'],
        ['vakya-rupantaran', 'रचना के आधार पर वाक्य रूपांतरण'],
        ['samaas', 'समास'],
        ['muhavare', 'मुहावरे'],
      ].map(([id, title]) => ({
        id,
        title,
        scope: 'board-exam',
        platformChapterSlugs: [`hindi-${id}`],
      })),
    },
    {
      id: 'literature',
      chapters: [
        ['bade-bhai-sahab', 'बड़े भाई साहब', 'board-exam', ['bade-bhai-sahab']],
        ['diary-ka-ek-panna', 'डायरी का एक पन्ना', 'board-exam', ['diary-ka-ek-panna']],
        [
          'tantara-vamiro-katha',
          'तताँरा-वामीरो कथा',
          'board-exam',
          ['tantara-vamiro-katha'],
        ],
        [
          'teesri-kasam-ke-shilpkar-shailendra',
          'तीसरी कसम के शिल्पकार शैलेंद्र',
          'board-exam',
          ['teesri-kasam-shailendra'],
        ],
        [
          'ab-kahan-doosron-ke-dukh-se-dukhi-hone-wale',
          'अब कहाँ दूसरे के दुख से दुखी होने वाले',
          'board-exam',
          ['ab-kahan-doosre-ke-dukh'],
        ],
        [
          'patjhar-mein-tooti-pattiyan',
          'पतझर में टूटी पत्तियाँ',
          'board-exam',
          ['patjhar-me-tooti-pattiya'],
        ],
        ['kartoos', 'कारतूस', 'board-exam', ['kartoos']],
        ['sakhiyaan', 'साखियाँ', 'board-exam', ['sakhi']],
        ['pad', 'पद', 'board-exam', ['pad']],
        ['manushyata', 'मनुष्यता', 'board-exam', ['manushyata']],
        ['parvat-pradesh-mein-pavas', 'पर्वत प्रदेश में पावस', 'board-exam', ['parvat-pradesh-mein-pavas']],
        ['tope', 'तोप', 'board-exam', ['tope']],
        ['kar-chale-hum-fida', 'कर चले हम फ़िदा', 'board-exam', ['kar-chale-hum-fida']],
        ['aatmatran', 'आत्मत्राण', 'board-exam', ['aatmatran']],
        ['harihar-kaka', 'हरिहर काका', 'board-exam', ['harihar-kaka']],
        ['sapnon-ke-se-din', 'सपनों के-से दिन', 'board-exam', ['sapnon-ke-se-din']],
        ['topi-shukla', 'टोपी शुक्ला', 'board-exam', ['topi-shukla']],
        ['bihari-ke-dohe', 'बिहारी के दोहे', 'excluded', []],
        ['madhur-madhur-mere-deepak-jal', 'मधुर-मधुर मेरे दीपक जल', 'excluded', []],
        ['girgit', 'गिरगिट', 'excluded', []],
      ].map(([id, title, scope, platformChapterSlugs]) => ({
        id,
        title,
        scope,
        platformChapterSlugs,
      })),
    },
    {
      id: 'creative-writing',
      chapters: [
        ['anucched-lekhan', 'अनुच्छेद लेखन'],
        ['patra-lekhan', 'पत्र लेखन'],
        ['soochna-lekhan', 'सूचना लेखन'],
        ['vigyapan-lekhan', 'विज्ञापन लेखन'],
        ['email-or-laghukatha', 'ई-मेल अथवा लघुकथा लेखन'],
      ].map(([id, title]) => ({
        id,
        title,
        scope: 'board-exam',
        platformChapterSlugs: [`hindi-${id}`],
      })),
    },
  ]);
});

test('every board-exam topic uses question types allowed by its unit section', () => {
  const unsupported = CURRICULUM_SUBJECTS.flatMap((subject) => {
    if (subject.examProfile === null) {
      return [];
    }

    const sectionById = new Map(
      subject.examProfile.sectionRules.map((section) => [section.id, section]),
    );

    return subject.units.flatMap((unit) => {
      const section = sectionById.get(unit.id);

      return unit.chapters.flatMap((chapter) =>
        chapter.topics.flatMap((topic) =>
          topic.scope !== 'board-exam'
            ? []
            : topic.requiredQuestionTypes
                .filter(
                  (questionType) =>
                    section === undefined ||
                    !section.allowedQuestionTypes.includes(questionType),
                )
                .map((questionType) => ({
                  subject: subject.slug,
                  unit: unit.id,
                  topic: topic.id,
                  questionType,
                })),
        ),
      );
    });
  });

  assert.deepEqual(unsupported, []);
});

test('every registered subject declares its activation blocker contract', () => {
  for (const subject of CURRICULUM_SUBJECTS) {
    assert.ok(Array.isArray(subject.activationBlockers), subject.slug);
    assert.equal(
      subject.status === 'active' ? subject.activationBlockers.length : true,
      subject.status === 'active' ? 0 : true,
      subject.slug,
    );
  }
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
