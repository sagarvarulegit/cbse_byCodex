import type { BoardQuestionType, CurriculumSubject } from '../../types';
import { examProfile } from './helpers';
import { mathematicsStandard } from './mathematics-standard';

const SOURCE_ID = 'cbse-mathematics-041-2026-27';
const mathematicsBasicSectionRules = [
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
] satisfies Parameters<typeof examProfile>[1];

// Source note: the current Class X curriculum source supplies the shared
// curriculum chapters. Basic remains a distinct 241 assessment profile and is
// intentionally hidden until the Mathematics activation plan verifies it.
export const mathematicsBasic: CurriculumSubject = {
  ...mathematicsStandard,
  subjectCode: '241',
  slug: 'mathematics-basic',
  title: 'Mathematics Basic',
  status: 'active',
  visibleInCatalog: true,
  readinessBlockers: [],
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, mathematicsBasicSectionRules, { status: 'ready' }),
  books: mathematicsStandard.books.map((book) => ({ ...book })),
  units: mathematicsStandard.units.map((curriculumUnit) => {
    const section = mathematicsStandard.examProfile?.sectionRules.find(
      (sectionRule) => sectionRule.id === curriculumUnit.id,
    );
    const basicSection = mathematicsBasicSectionRules.find(
      (sectionRule) => sectionRule.id === curriculumUnit.id,
    );
    const standardAllowed = new Set<BoardQuestionType>(
      section?.allowedQuestionTypes ?? [],
    );
    const basicAllowed = new Set<BoardQuestionType>(
      basicSection?.allowedQuestionTypes ?? [],
    );

    return {
      ...curriculumUnit,
      chapters: curriculumUnit.chapters.map((curriculumChapter) => ({
        ...curriculumChapter,
        platformChapterSlugs: [...curriculumChapter.platformChapterSlugs],
        topics: curriculumChapter.topics.map((topic) => ({
          ...topic,
          platformContentRefs: topic.platformContentRefs.map((reference) => ({
            ...reference,
          })),
          requiredQuestionTypes: topic.requiredQuestionTypes.filter(
            (questionType) =>
              standardAllowed.has(questionType) && basicAllowed.has(questionType),
          ),
        })),
      })),
    };
  }),
  officialSourceIds: [SOURCE_ID],
};
