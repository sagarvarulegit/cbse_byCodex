import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ACTIVE_CURRICULUM_SESSION,
  OFFICIAL_SOURCES,
  SOURCE_VERIFIED_ON,
  getOfficialSource,
} from './official-sources';
import type { CurriculumSubject } from './types';
import { validateCurriculumSubject } from './validation';

function createValidSubject(): CurriculumSubject {
  return {
    activationBlockers: [],
    academicSession: '2026-27',
    assessmentMode: 'board',
    books: [
      {
        id: 'ncert-science',
        publisher: 'NCERT',
        role: 'primary',
        sourceId: 'cbse-science-086-2026-27',
        title: 'Science Textbook',
      },
    ],
    classLevel: 10,
    examProfile: {
      allowedMarkValues: [1, 2, 3, 5],
      blueprintSourceIds: ['cbse-science-086-2026-27'],
      durationMinutes: 180,
      maximumMarks: 80,
      readingTimeMinutes: 15,
      sectionRules: [
        {
          allowedQuestionTypes: ['mcq', 'short-answer'],
          id: 'unit-1',
          marks: 40,
          title: 'Section A',
        },
        {
          allowedQuestionTypes: ['long-answer'],
          id: 'section-b',
          marks: 40,
          title: 'Section B',
        },
      ],
    },
    officialSourceIds: ['cbse-science-086-2026-27'],
    slug: 'science',
    status: 'active',
    subjectCode: '086',
    title: 'Science',
    units: [
      {
        chapters: [
          {
            id: 'chemical-reactions',
            platformChapterSlugs: ['chemical-reactions-and-equations'],
            scope: 'board-exam',
            title: 'Chemical Reactions and Equations',
            topics: [
              {
                id: 'balancing-equations',
                minimumReviewedQuestionCount: 1,
                platformTopicSlugs: ['balancing-equations'],
                requiredQuestionTypes: ['mcq'],
                scope: 'board-exam',
                title: 'Balancing Equations',
              },
            ],
          },
        ],
        id: 'unit-1',
        title: 'Chemical Reactions',
      },
    ],
  };
}

test('official sources register current and historical curriculum evidence', () => {
  assert.equal(ACTIVE_CURRICULUM_SESSION, '2026-27');
  assert.equal(SOURCE_VERIFIED_ON, '2026-06-24');

  assert.equal(
    getOfficialSource('cbse-curriculum-index-2026-27')?.academicSession,
    '2026-27',
  );
  assert.equal(getOfficialSource('cbse-sqp-index-2025-26')?.academicSession, '2025-26');
  assert.equal(getOfficialSource('cbse-board-papers-2026')?.sourceType, 'question-paper');
  assert.equal(getOfficialSource('cbse-hpe-2026-27')?.sourceType, 'curriculum');
});

test('every official source record has required provenance metadata', () => {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;

  for (const source of Object.values(OFFICIAL_SOURCES)) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.publishedBy);
    assert.match(source.verifiedOn, isoDate);
  }
});

test('validateCurriculumSubject reports missing source, missing exam profile, and invalid basic profile in code order', () => {
  const subject: CurriculumSubject = {
    ...createValidSubject(),
    examProfile: null,
    officialSourceIds: ['missing-source-id'],
    slug: 'mathematics-standard',
    subjectCode: '041',
    title: 'Mathematics Basic',
  };

  assert.deepEqual(
    validateCurriculumSubject(subject).map((issue) => issue.code),
    ['missing-source', 'missing-exam-profile', 'invalid-basic-profile'],
  );
});

test('validateCurriculumSubject reports missing book and blueprint sources in deterministic order', () => {
  const subject: CurriculumSubject = {
    ...createValidSubject(),
    books: [
      {
        ...createValidSubject().books[0],
        sourceId: 'missing-book-source-id',
      },
    ],
    examProfile: {
      ...createValidSubject().examProfile!,
      blueprintSourceIds: ['missing-blueprint-source-id'],
    },
  };

  assert.deepEqual(
    validateCurriculumSubject(subject).map((issue) => ({
      code: issue.code,
      path: issue.path,
    })),
    [
      {
        code: 'missing-source',
        path: 'books[0].sourceId',
      },
      {
        code: 'missing-source',
        path: 'examProfile.blueprintSourceIds[0]',
      },
    ],
  );
});

test('validateCurriculumSubject reports mark totals, duplicate ids, question-type gaps, and scope contradictions in code order', () => {
  const subject: CurriculumSubject = {
    ...createValidSubject(),
    examProfile: {
      ...createValidSubject().examProfile!,
      sectionRules: [
        {
          allowedQuestionTypes: ['mcq', 'short-answer'],
          id: 'section-a',
          marks: 40,
          title: 'Section A',
        },
        {
          allowedQuestionTypes: ['long-answer'],
          id: 'section-b',
          marks: 39,
          title: 'Section B',
        },
      ],
    },
    units: [
      {
        chapters: [
          {
            id: 'duplicate-chapter',
            platformChapterSlugs: ['shared-chapter-pack'],
            scope: 'board-exam',
            title: 'Chapter One',
            topics: [
              {
                id: 'duplicate-topic',
                minimumReviewedQuestionCount: 1,
                platformTopicSlugs: ['shared-topic'],
                requiredQuestionTypes: [],
                scope: 'board-exam',
                title: 'Topic One',
              },
              {
                id: 'unsupported-topic',
                minimumReviewedQuestionCount: 1,
                platformTopicSlugs: [],
                requiredQuestionTypes: ['diagram'],
                scope: 'board-exam',
                title: 'Unsupported Topic',
              },
            ],
          },
        ],
        id: 'duplicate-unit',
        title: 'Unit One',
      },
      {
        chapters: [
          {
            id: 'duplicate-chapter',
            platformChapterSlugs: ['shared-chapter-pack'],
            scope: 'internal-only',
            title: 'Chapter Two',
            topics: [
              {
                id: 'duplicate-topic',
                minimumReviewedQuestionCount: 0,
                platformTopicSlugs: ['shared-topic-two'],
                requiredQuestionTypes: [],
                scope: 'internal-only',
                title: 'Topic Two',
              },
            ],
          },
        ],
        id: 'duplicate-unit',
        title: 'Unit Two',
      },
    ],
  };

  assert.deepEqual(
    validateCurriculumSubject(subject).map((issue) => issue.code),
    [
      'invalid-total-marks',
      'duplicate-unit-id',
      'duplicate-chapter-id',
      'duplicate-topic-id',
      'missing-required-question-types',
      'unsupported-required-question-type',
      'contradictory-platform-scope',
    ],
  );
});

test('validateCurriculumSubject reports unsupported board question types after missing question types', () => {
  const subject: CurriculumSubject = {
    ...createValidSubject(),
    examProfile: {
      ...createValidSubject().examProfile!,
      sectionRules: [
        {
          allowedQuestionTypes: ['mcq', 'case-study'],
          curriculumRefs: ['unsupported-types'],
          id: 'section-a',
          marks: 40,
          title: 'Section A',
        },
        {
          allowedQuestionTypes: ['short-answer'],
          curriculumRefs: ['missing-types'],
          id: 'section-b',
          marks: 40,
          title: 'Section B',
        },
      ],
    },
    units: [
      {
        chapters: [
          {
            id: 'chemical-reactions',
            platformChapterSlugs: ['chemical-reactions-and-equations'],
            scope: 'board-exam',
            title: 'Chemical Reactions and Equations',
            topics: [
              {
                id: 'missing-types',
                minimumReviewedQuestionCount: 1,
                platformTopicSlugs: [],
                requiredQuestionTypes: [],
                scope: 'board-exam',
                title: 'Missing Types',
              },
              {
                id: 'unsupported-types',
                minimumReviewedQuestionCount: 1,
                platformTopicSlugs: [],
                requiredQuestionTypes: ['mcq', 'case-study', 'diagram'],
                scope: 'board-exam',
                title: 'Unsupported Types',
              },
            ],
          },
        ],
        id: 'unit-1',
        title: 'Chemical Reactions',
      },
    ],
  };

  assert.deepEqual(
    validateCurriculumSubject(subject).map((issue) => ({
      code: issue.code,
      path: issue.path,
    })),
    [
      {
        code: 'missing-required-question-types',
        path: 'units[0].chapters[0].topics[0].requiredQuestionTypes',
      },
      {
        code: 'unsupported-required-question-type',
        path: 'units[0].chapters[0].topics[1].requiredQuestionTypes[2]',
      },
    ],
  );
});

test('validateCurriculumSubject rejects a future subject that is visible in the catalog', () => {
  const subject = {
    ...createValidSubject(),
    assessmentMode: 'optional-skill',
    examProfile: null,
    officialSourceIds: ['cbse-it-402-2026-27'],
    slug: 'information-technology',
    status: 'future',
    subjectCode: '402',
    title: 'Information Technology',
    visibleInCatalog: true,
  } as CurriculumSubject & { visibleInCatalog: boolean };

  assert.deepEqual(
    validateCurriculumSubject(subject).map((issue) => issue.code),
    ['future-subject-visible'],
  );
});
