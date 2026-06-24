import type { CurriculumSubject } from '../../types';
import { examProfile } from './helpers';
import { mathematicsStandard } from './mathematics-standard';

const SOURCE_ID = 'cbse-mathematics-041-2026-27';

// Source note: the current Class X curriculum source supplies the shared
// curriculum chapters. Basic remains a distinct 241 assessment profile and is
// intentionally hidden until the Mathematics activation plan verifies it.
export const mathematicsBasic: CurriculumSubject = {
  ...mathematicsStandard,
  subjectCode: '241',
  slug: 'mathematics-basic',
  title: 'Mathematics Basic',
  visibleInCatalog: false,
  activationBlockers: [
    'Complete the Mathematics Basic activation review before catalog visibility.',
  ],
  examProfile: examProfile(SOURCE_ID, [
    {
      id: 'number-systems',
      title: 'Number Systems',
      marks: 6,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical'],
    },
    {
      id: 'algebra',
      title: 'Algebra',
      marks: 20,
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical'],
    },
    {
      id: 'coordinate-geometry',
      title: 'Coordinate Geometry',
      marks: 6,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical'],
    },
    {
      id: 'geometry',
      title: 'Geometry',
      marks: 15,
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer'],
    },
    {
      id: 'trigonometry',
      title: 'Trigonometry',
      marks: 12,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical'],
    },
    {
      id: 'mensuration',
      title: 'Mensuration',
      marks: 10,
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical'],
    },
    {
      id: 'statistics-and-probability',
      title: 'Statistics and Probability',
      marks: 11,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'data-interpretation'],
    },
  ]),
  books: mathematicsStandard.books.map((book) => ({ ...book })),
  units: mathematicsStandard.units.map((curriculumUnit) => ({
    ...curriculumUnit,
    chapters: curriculumUnit.chapters.map((curriculumChapter) => ({
      ...curriculumChapter,
      platformChapterSlugs: [...curriculumChapter.platformChapterSlugs],
      topics: curriculumChapter.topics.map((topic) => ({
        ...topic,
        platformTopicSlugs: [...topic.platformTopicSlugs],
        requiredQuestionTypes: [...topic.requiredQuestionTypes],
      })),
    })),
  })),
  officialSourceIds: [SOURCE_ID],
};
