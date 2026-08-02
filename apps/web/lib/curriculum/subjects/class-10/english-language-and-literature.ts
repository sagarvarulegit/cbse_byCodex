import type {
  BoardQuestionType,
  CurriculumScope,
  CurriculumSubject,
} from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  examProfile,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-english-184-2026-27';

const prose = [
  ['a-letter-to-god', 'A Letter to God', 'a-letter-to-god'],
  [
    'nelson-mandela-long-walk-to-freedom',
    'Nelson Mandela - Long Walk to Freedom',
    'nelson-mandela-long-walk-to-freedom',
  ],
  ['stories-about-flying', 'Stories About Flying', 'two-stories-about-flying'],
  ['from-the-diary-of-anne-frank', 'From the Diary of Anne Frank', 'from-the-diary-of-anne-frank'],
  ['glimpses-of-india', 'Glimpses of India', 'glimpses-of-india'],
  ['mijbil-the-otter', 'Mijbil the Otter', 'mijbil-the-otter'],
  ['madam-rides-the-bus', 'Madam Rides the Bus', 'madam-rides-the-bus'],
  ['the-sermon-at-benares', 'The Sermon at Benares', 'the-sermon-at-benares'],
  ['the-proposal', 'The Proposal', 'the-proposal'],
] as const;

const poems = [
  ['dust-of-snow', 'Dust of Snow', 'dust-of-snow'],
  ['fire-and-ice', 'Fire and Ice', 'fire-and-ice'],
  ['a-tiger-in-the-zoo', 'A Tiger in the Zoo', 'a-tiger-in-the-zoo'],
  ['how-to-tell-wild-animals', 'How to Tell Wild Animals', 'how-to-tell-wild-animals'],
  ['the-ball-poem', 'The Ball Poem', 'the-ball-poem'],
  ['amanda', 'Amanda!', 'amanda'],
  ['the-trees', 'The Trees', 'the-trees'],
  ['fog', 'Fog', 'fog'],
  ['the-tale-of-custard-the-dragon', 'The Tale of Custard the Dragon', 'the-tale-of-custard-the-dragon'],
  ['for-anne-gregory', 'For Anne Gregory', 'for-anne-gregory'],
] as const;

const supplementary = [
  ['a-triumph-of-surgery', 'A Triumph of Surgery', 'a-triumph-of-surgery'],
  ['the-thiefs-story', "The Thief's Story", 'the-thiefs-story'],
  ['the-midnight-visitor', 'The Midnight Visitor', 'the-midnight-visitor'],
  ['a-question-of-trust', 'A Question of Trust', 'a-question-of-trust'],
  ['footprints-without-feet', 'Footprints Without Feet', 'footprints-without-feet'],
  ['the-making-of-a-scientist', 'The Making of a Scientist', 'the-making-of-a-scientist'],
  ['the-necklace', 'The Necklace', 'the-necklace'],
  ['bholi', 'Bholi', 'bholi'],
  ['the-book-that-saved-the-earth', 'The Book that Saved the Earth', 'the-book-that-saved-the-earth'],
] as const;

const workbook = [
  ['unit-1', 'Words and Expressions II - Unit 1', 'supporting-resource', 'words-and-expressions-a-letter-to-god'],
  [
    'unit-2',
    'Words and Expressions II - Unit 2',
    'supporting-resource',
    'words-and-expressions-nelson-mandela-long-walk-to-freedom',
  ],
  [
    'unit-3',
    'Words and Expressions II - Unit 3',
    'supporting-resource',
    'words-and-expressions-two-stories-about-flying',
  ],
  [
    'unit-4',
    'Words and Expressions II - Unit 4',
    'supporting-resource',
    'words-and-expressions-from-the-diary-of-anne-frank',
  ],
  ['unit-5', 'Words and Expressions II - Unit 5', 'excluded', 'words-and-expressions-glimpses-of-india'],
  ['unit-6', 'Words and Expressions II - Unit 6', 'excluded', 'words-and-expressions-mijbil-the-otter'],
  [
    'unit-7',
    'Words and Expressions II - Unit 7',
    'supporting-resource',
    'words-and-expressions-madam-rides-the-bus',
  ],
  [
    'unit-8',
    'Words and Expressions II - Unit 8',
    'supporting-resource',
    'words-and-expressions-the-sermon-at-benares',
  ],
  ['unit-9', 'Words and Expressions II - Unit 9', 'supporting-resource', 'words-and-expressions-the-proposal'],
] as const satisfies readonly [
  string,
  string,
  CurriculumScope,
  string | null,
][];

function boardDomainChapter(
  id: string,
  title: string,
  platformSlug: string,
  topicId: string,
  topicTitle: string,
  questionTypes: BoardQuestionType[],
) {
  return chapter({
    id,
    title,
    platformChapterSlugs: [platformSlug],
    topics: [chapterPackTopic(platformSlug, topicId, topicTitle, 'board-exam', questionTypes)],
  });
}

function textChapter(
  prefix: 'prose' | 'poem' | 'supplementary',
  id: string,
  title: string,
  platformSlug: string | null,
) {
  const questionTypes: BoardQuestionType[] =
    prefix === 'supplementary'
      ? ['short-answer', 'long-answer']
      : ['extract-based', 'short-answer', 'long-answer'];
  const topicId = `${prefix}-${id}-official-text`;

  return chapter({
    id: `${prefix}-${id}`,
    title,
    platformChapterSlugs: platformSlug ? [platformSlug] : [],
    topics: [
      platformSlug
        ? chapterPackTopic(
            platformSlug,
            topicId,
            title,
            'board-exam',
            questionTypes,
          )
        : topic(topicId, title, 'board-exam', questionTypes),
    ],
  });
}

export const englishLanguageAndLiterature: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '184',
  slug: 'english-language-and-literature',
  title: 'English Language and Literature',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [
    'Current 2026-27 English blueprint evidence has not been officially verified.',
  ],
  examProfile: examProfile(
    SOURCE_ID,
    [
      {
        id: 'reading',
        title: 'Reading',
        marks: 20,
        allowedQuestionTypes: [
          'mcq',
          'short-answer',
          'source-based',
          'data-interpretation',
        ],
      },
      {
        id: 'writing-and-grammar',
        title: 'Writing Skills and Grammar',
        marks: 20,
        allowedQuestionTypes: ['grammar', 'creative-writing', 'data-interpretation'],
      },
      {
        id: 'literature',
        title: 'Language through Literature',
        marks: 40,
        allowedQuestionTypes: ['extract-based', 'short-answer', 'long-answer'],
      },
    ],
    {
      status: 'blocked',
      blockers: [
        'The current curriculum PDF embeds section-wise weightage labelled 2025-26.',
      ],
    },
  ),
  books: [
    {
      id: 'first-flight',
      title: 'First Flight',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'footprints-without-feet',
      title: 'Footprints Without Feet',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'words-and-expressions-2',
      title: 'Words and Expressions - II',
      publisher: 'NCERT',
      role: 'workbook',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('reading', 'Reading', 20, [
      chapter({
        id: 'discursive-passage',
        title: 'Discursive Passage',
        platformChapterSlugs: ['english-reading-discursive-passage'],
        topics: [
          chapterPackTopic(
            'english-reading-discursive-passage',
            'reading-discursive-passage',
            'Discursive passage of 400-450 words',
            'board-exam',
            ['mcq', 'short-answer', 'source-based'],
          ),
        ],
      }),
      chapter({
        id: 'case-based-factual-passage',
        title: 'Case-based Factual Passage',
        platformChapterSlugs: ['english-reading-case-based-factual-passage'],
        topics: [
          chapterPackTopic(
            'english-reading-case-based-factual-passage',
            'reading-case-based-factual-passage',
            'Case-based factual passage with visual or statistical input',
            'board-exam',
            ['mcq', 'short-answer', 'source-based', 'data-interpretation'],
          ),
        ],
      }),
    ]),
    unit('writing-and-grammar', 'Writing and Grammar', 20, [
      chapter({
        id: 'grammar',
        title: 'Grammar',
        platformChapterSlugs: ['english-grammar'],
        topics: [
          chapterPackTopic('english-grammar', 'grammar-determiners', 'Determiners', 'board-exam', ['grammar']),
          chapterPackTopic('english-grammar', 'grammar-tenses', 'Tenses', 'board-exam', ['grammar']),
          chapterPackTopic('english-grammar', 'grammar-modals', 'Modals', 'board-exam', ['grammar']),
          chapterPackTopic(
            'english-grammar',
            'grammar-subject-verb-concord',
            'Subject-verb concord',
            'board-exam',
            ['grammar'],
          ),
          chapterPackTopic(
            'english-grammar',
            'grammar-reported-speech',
            'Reported speech: commands, requests, statements and questions',
            'board-exam',
            ['grammar'],
          ),
        ],
      }),
      boardDomainChapter(
        'formal-letter',
        'Formal Letter',
        'english-formal-letter',
        'writing-formal-letter',
        'Formal letter based on a given situation',
        ['creative-writing'],
      ),
      boardDomainChapter(
        'analytical-paragraph',
        'Analytical Paragraph',
        'english-analytical-paragraph',
        'writing-analytical-paragraph',
        'Analytical paragraph from map, chart, graph or cues',
        ['creative-writing', 'data-interpretation'],
      ),
    ]),
    unit('literature', 'Literature', 40, [
      ...prose.map(([id, title, platformSlug]) =>
        textChapter('prose', id, title, platformSlug),
      ),
      ...poems.map(([id, title, platformSlug]) => textChapter('poem', id, title, platformSlug)),
      ...supplementary.map(([id, title, platformSlug]) =>
        textChapter('supplementary', id, title, platformSlug),
      ),
    ]),
    unit(
      'words-and-expressions-2',
      'Words and Expressions - II',
      undefined,
      workbook.map(([id, title, scope, platformSlug]) =>
        chapter({
          id,
          title,
          scope,
          platformChapterSlugs: platformSlug ? [platformSlug] : [],
          topics: [
            platformSlug
              ? chapterPackTopic(
                  platformSlug,
                  `words-and-expressions-${id}`,
                  title,
                  scope,
                  [],
                )
              : topic(`words-and-expressions-${id}`, title, scope, []),
          ],
        }),
      ),
    ),
  ],
  officialSourceIds: [SOURCE_ID],
};
