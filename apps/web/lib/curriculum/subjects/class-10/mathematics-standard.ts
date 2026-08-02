import type {
  BoardQuestionType,
  CurriculumSubject,
  CurriculumTopic,
} from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  examProfile,
  lessonTopic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-mathematics-041-2026-27';

function boardTopic(
  chapterSlug: string,
  id: string,
  title: string,
  questionTypes: BoardQuestionType[],
  lessonSlug = 'core-notes',
): CurriculumTopic {
  return lessonTopic(
    chapterSlug,
    lessonSlug,
    id,
    title,
    'board-exam',
    questionTypes,
  );
}

function excludedTopic(
  chapterSlug: string,
  id: string,
  title: string,
  lessonSlug?: string,
): CurriculumTopic {
  return lessonSlug
    ? lessonTopic(chapterSlug, lessonSlug, id, title, 'excluded', [])
    : chapterPackTopic(chapterSlug, id, title, 'excluded', []);
}

function mathematicsChapter(
  id: string,
  title: string,
  topics: CurriculumTopic[],
) {
  return chapter({
    id,
    title,
    platformChapterSlugs: [id],
    topics,
  });
}

export const mathematicsStandard: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '041',
  slug: 'mathematics-standard',
  title: 'Mathematics Standard',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [],
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
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical', 'proof'],
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
      allowedQuestionTypes: [
        'mcq',
        'short-answer',
        'long-answer',
        'numerical',
        'data-interpretation',
      ],
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
    {
      id: 'cbse-mathematics-laboratory-guidelines-class-10',
      title: 'Guidelines for Mathematics Laboratory in Schools, Class X',
      publisher: 'CBSE',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-mathematics-laboratory-manual-secondary',
      title: 'Laboratory Manual - Mathematics, Secondary Stage',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-mathematics-exemplar-class-10',
      title: 'Mathematics Exemplar Problems for Class X',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('number-systems', 'Number Systems', 6, [
      mathematicsChapter('real-numbers', 'Real Numbers', [
        boardTopic(
          'real-numbers',
          'real-numbers-fundamental-theorem-of-arithmetic',
          'Fundamental Theorem of Arithmetic',
          ['mcq', 'short-answer'],
          'fundamental-theorem-of-arithmetic',
        ),
        boardTopic(
          'real-numbers',
          'real-numbers-irrationality-proofs',
          'Proofs of irrationality of √2, √3, √5 and related numbers',
          ['short-answer', 'proof'],
          'irrational-numbers',
        ),
        excludedTopic(
          'real-numbers',
          'real-numbers-euclid-division-algorithm',
          'Euclid division lemma and Euclid algorithm',
          'euclid-division-lemma',
        ),
        excludedTopic(
          'real-numbers',
          'real-numbers-decimal-expansions',
          'Decimal expansion of rational numbers',
          'decimal-expansion-of-rational-numbers',
        ),
      ]),
    ]),
    unit('algebra', 'Algebra', 20, [
      mathematicsChapter('polynomials', 'Polynomials', [
        boardTopic('polynomials', 'polynomials-zeroes', 'Zeroes of a polynomial', [
          'mcq',
          'short-answer',
        ]),
        boardTopic(
          'polynomials',
          'polynomials-zeroes-coefficients-quadratic',
          'Relationship between zeroes and coefficients of quadratic polynomials',
          ['short-answer', 'numerical'],
        ),
        excludedTopic(
          'polynomials',
          'polynomials-division-algorithm',
          'Division algorithm for polynomials',
        ),
      ]),
      mathematicsChapter(
        'pair-of-linear-equations-in-two-variables',
        'Pair of Linear Equations in Two Variables',
        [
          boardTopic(
            'pair-of-linear-equations-in-two-variables',
            'linear-pairs-graphical-solution',
            'Graphical solution and consistency',
            ['short-answer', 'numerical'],
          ),
          boardTopic(
            'pair-of-linear-equations-in-two-variables',
            'linear-pairs-number-of-solutions',
            'Algebraic conditions for number of solutions',
            ['mcq', 'short-answer'],
          ),
          boardTopic(
            'pair-of-linear-equations-in-two-variables',
            'linear-pairs-substitution-elimination',
            'Substitution and elimination methods',
            ['short-answer', 'long-answer', 'numerical'],
          ),
          boardTopic(
            'pair-of-linear-equations-in-two-variables',
            'linear-pairs-situational-problems',
            'Simple situational problems',
            ['long-answer', 'numerical'],
          ),
          excludedTopic(
            'pair-of-linear-equations-in-two-variables',
            'linear-pairs-cross-multiplication',
            'Cross-multiplication method',
          ),
        ],
      ),
      mathematicsChapter('quadratic-equations', 'Quadratic Equations', [
        boardTopic(
          'quadratic-equations',
          'quadratic-equations-standard-form',
          'Standard form of a quadratic equation',
          ['mcq', 'short-answer'],
        ),
        boardTopic(
          'quadratic-equations',
          'quadratic-equations-factorisation',
          'Real roots by factorisation',
          ['short-answer', 'numerical'],
        ),
        boardTopic(
          'quadratic-equations',
          'quadratic-equations-formula',
          'Real roots by quadratic formula',
          ['short-answer', 'long-answer', 'numerical'],
        ),
        boardTopic(
          'quadratic-equations',
          'quadratic-equations-discriminant',
          'Discriminant and nature of roots',
          ['mcq', 'short-answer'],
        ),
        boardTopic(
          'quadratic-equations',
          'quadratic-equations-situational-problems',
          'Situational problems based on quadratic equations',
          ['long-answer', 'numerical'],
        ),
        excludedTopic(
          'quadratic-equations',
          'quadratic-equations-completing-square',
          'Solution by completing the square',
        ),
      ]),
      mathematicsChapter('arithmetic-progressions', 'Arithmetic Progressions', [
        boardTopic(
          'arithmetic-progressions',
          'arithmetic-progressions-motivation',
          'Motivation and recognition of arithmetic progressions',
          ['mcq', 'short-answer'],
        ),
        boardTopic(
          'arithmetic-progressions',
          'arithmetic-progressions-nth-term',
          'nth term of an arithmetic progression',
          ['short-answer', 'numerical'],
        ),
        boardTopic(
          'arithmetic-progressions',
          'arithmetic-progressions-sum',
          'Sum of the first n terms',
          ['short-answer', 'long-answer', 'numerical'],
        ),
        boardTopic(
          'arithmetic-progressions',
          'arithmetic-progressions-applications',
          'Daily-life applications',
          ['long-answer', 'numerical'],
        ),
      ]),
    ]),
    unit('coordinate-geometry', 'Coordinate Geometry', 6, [
      mathematicsChapter('coordinate-geometry', 'Coordinate Geometry', [
        boardTopic(
          'coordinate-geometry',
          'coordinate-geometry-distance-formula',
          'Distance formula',
          ['mcq', 'short-answer', 'numerical'],
        ),
        boardTopic(
          'coordinate-geometry',
          'coordinate-geometry-section-formula',
          'Section formula for internal division',
          ['short-answer', 'numerical'],
        ),
        excludedTopic(
          'coordinate-geometry',
          'coordinate-geometry-area-of-triangle',
          'Area of a triangle on the coordinate plane',
        ),
      ]),
    ]),
    unit('geometry', 'Geometry', 15, [
      mathematicsChapter('triangles', 'Triangles', [
        boardTopic(
          'triangles',
          'triangles-similarity-concepts',
          'Definitions, examples and counter-examples of similar triangles',
          ['short-answer'],
        ),
        boardTopic(
          'triangles',
          'triangles-basic-proportionality-theorem',
          'Basic Proportionality Theorem and converse',
          ['short-answer', 'proof'],
        ),
        boardTopic(
          'triangles',
          'triangles-similarity-criteria',
          'AAA, SSS and SAS similarity criteria',
          ['short-answer', 'long-answer', 'proof'],
        ),
      ]),
      mathematicsChapter('circles', 'Circles', [
        boardTopic(
          'circles',
          'circles-tangent-point-of-contact',
          'Tangent to a circle at the point of contact',
          ['short-answer'],
        ),
        boardTopic(
          'circles',
          'circles-radius-perpendicular-tangent',
          'Radius is perpendicular to the tangent',
          ['short-answer', 'proof'],
        ),
        boardTopic(
          'circles',
          'circles-equal-tangents',
          'Equal tangents from an external point',
          ['long-answer', 'proof'],
        ),
      ]),
    ]),
    unit('trigonometry', 'Trigonometry', 12, [
      mathematicsChapter('introduction-to-trigonometry', 'Introduction to Trigonometry', [
        boardTopic(
          'introduction-to-trigonometry',
          'trigonometry-ratios',
          'Trigonometric ratios of acute angles',
          ['mcq', 'short-answer'],
        ),
        boardTopic(
          'introduction-to-trigonometry',
          'trigonometry-standard-angles',
          'Ratios at 0°, 30°, 45°, 60° and 90°',
          ['mcq', 'numerical'],
        ),
        boardTopic(
          'introduction-to-trigonometry',
          'trigonometry-ratio-relations',
          'Relationships between trigonometric ratios',
          ['short-answer', 'numerical'],
        ),
        boardTopic(
          'introduction-to-trigonometry',
          'trigonometry-identities',
          'Identity sin²A + cos²A = 1 and simple applications',
          ['short-answer', 'proof'],
        ),
      ]),
      mathematicsChapter(
        'some-applications-of-trigonometry',
        'Some Applications of Trigonometry',
        [
          boardTopic(
            'some-applications-of-trigonometry',
            'heights-and-distances-elevation-depression',
            'Angles of elevation and depression',
            ['short-answer', 'numerical'],
          ),
          boardTopic(
            'some-applications-of-trigonometry',
            'heights-and-distances-two-triangles',
            'Simple height and distance problems using at most two right triangles',
            ['long-answer', 'numerical'],
          ),
        ],
      ),
    ]),
    unit('mensuration', 'Mensuration', 10, [
      mathematicsChapter('areas-related-to-circles', 'Areas Related to Circles', [
        boardTopic(
          'areas-related-to-circles',
          'areas-related-to-circles-sectors',
          'Area and perimeter of sectors',
          ['short-answer', 'numerical'],
        ),
        boardTopic(
          'areas-related-to-circles',
          'areas-related-to-circles-segments',
          'Area of segments restricted to 60°, 90° and 120°',
          ['long-answer', 'numerical'],
        ),
      ]),
      mathematicsChapter('surface-areas-and-volumes', 'Surface Areas and Volumes', [
        boardTopic(
          'surface-areas-and-volumes',
          'surface-areas-combinations-of-two-solids',
          'Surface areas of combinations of any two prescribed solids',
          ['short-answer', 'long-answer', 'numerical'],
        ),
        boardTopic(
          'surface-areas-and-volumes',
          'volumes-combinations-of-two-solids',
          'Volumes of combinations of any two prescribed solids',
          ['short-answer', 'long-answer', 'numerical'],
        ),
        excludedTopic(
          'surface-areas-and-volumes',
          'surface-areas-and-volumes-frustum',
          'Frustum of a cone',
        ),
      ]),
    ]),
    unit('statistics-and-probability', 'Statistics and Probability', 11, [
      mathematicsChapter('statistics', 'Statistics', [
        boardTopic(
          'statistics',
          'statistics-mean-grouped-data',
          'Mean of grouped data',
          ['short-answer', 'numerical', 'data-interpretation'],
        ),
        boardTopic(
          'statistics',
          'statistics-median-grouped-data',
          'Median of grouped data',
          ['short-answer', 'numerical', 'data-interpretation'],
        ),
        boardTopic(
          'statistics',
          'statistics-mode-grouped-data',
          'Mode of grouped data',
          ['short-answer', 'numerical', 'data-interpretation'],
        ),
        excludedTopic(
          'statistics',
          'statistics-ogive',
          'Cumulative frequency graphs and ogives',
        ),
      ]),
      mathematicsChapter('probability', 'Probability', [
        boardTopic(
          'probability',
          'probability-classical-definition',
          'Classical definition of probability',
          ['mcq', 'short-answer'],
        ),
        boardTopic(
          'probability',
          'probability-simple-events',
          'Simple real-life probability problems',
          ['mcq', 'short-answer', 'numerical'],
        ),
      ]),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
