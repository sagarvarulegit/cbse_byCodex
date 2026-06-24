import type { CurriculumSubject } from '../../types';
import {
  CLASS_10_CURRICULUM_SESSION,
  chapter,
  examProfile,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-mathematics-041-2026-27';

export const mathematicsStandard: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '041',
  slug: 'mathematics-standard',
  title: 'Mathematics Standard',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, [
    {
      id: 'number-systems',
      title: 'Number Systems',
      marks: 6,
      allowedQuestionTypes: ['mcq', 'short-answer', 'proof'],
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
      allowedQuestionTypes: ['short-answer', 'long-answer', 'proof', 'construction'],
    },
    {
      id: 'trigonometry',
      title: 'Trigonometry',
      marks: 12,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'proof'],
    },
    {
      id: 'mensuration',
      title: 'Mensuration',
      marks: 10,
      allowedQuestionTypes: ['short-answer', 'long-answer', 'numerical'],
    },
    {
      id: 'statistics-and-probability',
      title: 'Statistics and Probability',
      marks: 11,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'data-interpretation'],
    },
  ]),
  books: [
    {
      id: 'ncert-mathematics-class-10',
      title: 'Mathematics Textbook for Class X',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('number-systems', 'Number Systems', 6, [
      chapter({
        id: 'real-numbers',
        title: 'Real Numbers',
        platformChapterSlugs: ['real-numbers'],
        questionTypes: ['mcq', 'short-answer', 'proof'],
      }),
    ]),
    unit('algebra', 'Algebra', 20, [
      chapter({
        id: 'polynomials',
        title: 'Polynomials',
        platformChapterSlugs: ['polynomials'],
        questionTypes: ['mcq', 'short-answer', 'numerical'],
      }),
      chapter({
        id: 'pair-of-linear-equations-in-two-variables',
        title: 'Pair of Linear Equations in Two Variables',
        platformChapterSlugs: ['pair-of-linear-equations-in-two-variables'],
        questionTypes: ['short-answer', 'long-answer', 'numerical'],
      }),
      chapter({
        id: 'quadratic-equations',
        title: 'Quadratic Equations',
        platformChapterSlugs: ['quadratic-equations'],
        questionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical'],
      }),
      chapter({
        id: 'arithmetic-progressions',
        title: 'Arithmetic Progressions',
        platformChapterSlugs: ['arithmetic-progressions'],
        questionTypes: ['short-answer', 'long-answer', 'numerical'],
      }),
    ]),
    unit('coordinate-geometry', 'Coordinate Geometry', 6, [
      chapter({
        id: 'coordinate-geometry',
        title: 'Coordinate Geometry',
        platformChapterSlugs: ['coordinate-geometry'],
        questionTypes: ['mcq', 'short-answer', 'numerical'],
      }),
    ]),
    unit('geometry', 'Geometry', 15, [
      chapter({
        id: 'triangles',
        title: 'Triangles',
        platformChapterSlugs: ['triangles'],
        questionTypes: ['short-answer', 'long-answer', 'proof'],
      }),
      chapter({
        id: 'circles',
        title: 'Circles',
        platformChapterSlugs: ['circles'],
        questionTypes: ['short-answer', 'long-answer', 'proof'],
      }),
    ]),
    unit('trigonometry', 'Trigonometry', 12, [
      chapter({
        id: 'introduction-to-trigonometry',
        title: 'Introduction to Trigonometry',
        platformChapterSlugs: ['introduction-to-trigonometry'],
        questionTypes: ['mcq', 'short-answer', 'proof', 'numerical'],
      }),
      chapter({
        id: 'some-applications-of-trigonometry',
        title: 'Some Applications of Trigonometry',
        platformChapterSlugs: ['some-applications-of-trigonometry'],
        questionTypes: ['short-answer', 'long-answer', 'numerical'],
      }),
    ]),
    unit('mensuration', 'Mensuration', 10, [
      chapter({
        id: 'areas-related-to-circles',
        title: 'Areas Related to Circles',
        platformChapterSlugs: ['areas-related-to-circles'],
        questionTypes: ['short-answer', 'long-answer', 'numerical'],
      }),
      chapter({
        id: 'surface-areas-and-volumes',
        title: 'Surface Areas and Volumes',
        platformChapterSlugs: ['surface-areas-and-volumes'],
        questionTypes: ['short-answer', 'long-answer', 'numerical'],
      }),
    ]),
    unit('statistics-and-probability', 'Statistics and Probability', 11, [
      chapter({
        id: 'statistics',
        title: 'Statistics',
        platformChapterSlugs: ['statistics'],
        questionTypes: ['short-answer', 'long-answer', 'numerical', 'data-interpretation'],
      }),
      chapter({
        id: 'probability',
        title: 'Probability',
        platformChapterSlugs: ['probability'],
        questionTypes: ['mcq', 'short-answer', 'numerical'],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
