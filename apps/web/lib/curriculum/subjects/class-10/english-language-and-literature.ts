import type { CurriculumSubject } from '../../types';
import {
  CLASS_10_CURRICULUM_SESSION,
  chapter,
  examProfile,
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
  ['dust-of-snow', 'Dust of Snow'],
  ['fire-and-ice', 'Fire and Ice'],
  ['a-tiger-in-the-zoo', 'A Tiger in the Zoo'],
  ['how-to-tell-wild-animals', 'How to Tell Wild Animals'],
  ['the-ball-poem', 'The Ball Poem'],
  ['amanda', 'Amanda!'],
  ['the-trees', 'The Trees'],
  ['fog', 'Fog'],
  ['the-tale-of-custard-the-dragon', 'The Tale of Custard the Dragon'],
  ['for-anne-gregory', 'For Anne Gregory'],
] as const;

const supplementary = [
  ['a-triumph-of-surgery', 'A Triumph of Surgery', 'a-triumph-of-surgery'],
  ['the-thiefs-story', "The Thief's Story", 'the-thiefs-story'],
  ['the-midnight-visitor', 'The Midnight Visitor', 'the-midnight-visitor'],
  ['a-question-of-trust', 'A Question of Trust', 'a-question-of-trust'],
  ['footprints-without-feet', 'Footprints Without Feet', 'footprints-without-feet-story'],
  ['the-making-of-a-scientist', 'The Making of a Scientist', 'the-making-of-a-scientist'],
  ['the-necklace', 'The Necklace', 'the-necklace'],
  ['bholi', 'Bholi', 'bholi'],
  ['the-book-that-saved-the-earth', 'The Book that Saved the Earth', 'the-book-that-saved-the-earth'],
] as const;

export const englishLanguageAndLiterature: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '184',
  slug: 'english-language-and-literature',
  title: 'English Language and Literature',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, [
    {
      id: 'reading',
      title: 'Reading',
      marks: 20,
      allowedQuestionTypes: ['mcq', 'short-answer', 'source-based'],
    },
    {
      id: 'writing-and-grammar',
      title: 'Writing Skills and Grammar',
      marks: 20,
      allowedQuestionTypes: ['grammar', 'creative-writing'],
    },
    {
      id: 'literature',
      title: 'Language through Literature',
      marks: 40,
      allowedQuestionTypes: ['extract-based', 'short-answer', 'long-answer'],
    },
  ]),
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
        questionTypes: ['mcq', 'short-answer', 'source-based'],
      }),
      chapter({
        id: 'case-based-factual-passage',
        title: 'Case-based Factual Passage',
        questionTypes: ['mcq', 'short-answer', 'source-based', 'data-interpretation'],
      }),
    ]),
    unit('writing-and-grammar', 'Writing and Grammar', 20, [
      chapter({
        id: 'grammar',
        title: 'Grammar',
        questionTypes: ['grammar'],
      }),
      chapter({
        id: 'formal-letter',
        title: 'Formal Letter',
        questionTypes: ['creative-writing'],
      }),
      chapter({
        id: 'analytical-paragraph',
        title: 'Analytical Paragraph',
        questionTypes: ['creative-writing', 'data-interpretation'],
      }),
    ]),
    unit('literature', 'Literature', 40, [
      ...prose.map(([id, title, platformSlug]) =>
        chapter({
          id: `prose-${id}`,
          title,
          platformChapterSlugs: [platformSlug],
          questionTypes: ['extract-based', 'short-answer', 'long-answer'],
        }),
      ),
      ...poems.map(([id, title]) =>
        chapter({
          id: `poem-${id}`,
          title,
          platformChapterSlugs: [],
          questionTypes: ['extract-based', 'short-answer', 'long-answer'],
        }),
      ),
      ...supplementary.map(([id, title, platformSlug]) =>
        chapter({
          id: `supplementary-${id}`,
          title,
          platformChapterSlugs: [platformSlug],
          questionTypes: ['short-answer', 'long-answer'],
        }),
      ),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
