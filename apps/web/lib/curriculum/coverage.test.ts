import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvailableLessons,
  getChapter,
  getCurriculumContentEvidence,
  hasChapterPack,
} from '../course-content';
import { buildSubjectCoverage } from './coverage';
import type { CurriculumSubject } from './types';

function createSubjectFixture(): CurriculumSubject {
  return {
    activationBlockers: [],
    academicSession: '2026-27',
    assessmentMode: 'board',
    books: [],
    classLevel: 10,
    examProfile: {
      allowedMarkValues: [1, 2, 3, 5],
      blueprintSourceIds: ['fixture-source'],
      durationMinutes: 180,
      maximumMarks: 80,
      readingTimeMinutes: 15,
      sectionRules: [],
    },
    officialSourceIds: ['fixture-source'],
    slug: 'fixture-subject',
    status: 'active',
    subjectCode: '999',
    title: 'Fixture Subject',
    units: [
      {
        chapters: [
          {
            id: 'chapter-1',
            platformChapterSlugs: ['chapter-1'],
            scope: 'board-exam',
            title: 'Chapter 1',
            topics: [
              {
                id: 'topic-1',
                minimumReviewedQuestionCount: 2,
                platformTopicSlugs: ['topic-1'],
                requiredQuestionTypes: ['mcq'],
                scope: 'board-exam',
                title: 'Topic 1',
              },
            ],
          },
          {
            id: 'chapter-2',
            platformChapterSlugs: ['chapter-2'],
            scope: 'board-exam',
            title: 'Chapter 2',
            topics: [
              {
                id: 'topic-2',
                minimumReviewedQuestionCount: 3,
                platformTopicSlugs: [],
                requiredQuestionTypes: ['mcq', 'short-answer'],
                scope: 'board-exam',
                title: 'Topic 2',
              },
            ],
          },
        ],
        id: 'unit-1',
        title: 'Unit 1',
      },
    ],
  };
}

test('buildSubjectCoverage reports deterministic curriculum percentages and blockers', () => {
  const report = buildSubjectCoverage(createSubjectFixture(), {
    content: {
      availableLessonCounts: {
        'chapter-1': 2,
        'chapter-2': 0,
      },
      chapterPacks: {
        'chapter-1': true,
        'chapter-2': false,
      },
    },
    paperGeneration: {
      validSeedIds: ['seed-1', 'seed-2'],
    },
    questionCoverage: {
      questions: [
        { id: 'q-1', questionType: 'mcq', reviewed: true, topicId: 'topic-1', valid: true },
        { id: 'q-2', questionType: 'mcq', reviewed: true, topicId: 'topic-1', valid: true },
        { id: 'q-3', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
        { id: 'q-4', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
        { id: 'q-5', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
      ],
      reviewedCountByTopicId: {
        'topic-1': 2,
        'topic-2': 3,
      },
    },
    studentPublication: {
      gates: [
        { id: 'catalog-visible', passed: true },
        { id: 'student-smoke', passed: false },
      ],
    },
  });

  assert.equal(report.dimensions.curriculum.numerator, 2);
  assert.equal(report.dimensions.curriculum.denominator, 2);
  assert.equal(report.dimensions.curriculum.percent, 100);

  assert.equal(report.dimensions.chapterPack.numerator, 1);
  assert.equal(report.dimensions.chapterPack.denominator, 2);
  assert.equal(report.dimensions.chapterPack.percent, 50);

  assert.equal(report.dimensions.lessonWise.percent, 50);
  assert.equal(report.dimensions.questionBank.percent, 100);
  assert.equal(report.dimensions.questionType.numerator, 2);
  assert.equal(report.dimensions.questionType.denominator, 3);
  assert.equal(report.dimensions.questionType.percent, 67);
  assert.equal(report.dimensions.reviewedAnswer.numerator, 0);
  assert.equal(report.dimensions.reviewedAnswer.denominator, 0);
  assert.equal(report.dimensions.reviewedAnswer.percent, 100);
  assert.equal(report.dimensions.paperGeneration.percent, 67);
  assert.equal(report.dimensions.studentPublication.percent, 50);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-2'), true);
});

test('buildSubjectCoverage ignores internal-only and excluded topics for board-exam scoring', () => {
  const subject = createSubjectFixture();

  subject.units[0]?.chapters[0]?.topics.push(
    {
      id: 'topic-internal',
      minimumReviewedQuestionCount: 5,
      platformTopicSlugs: [],
      requiredQuestionTypes: [],
      scope: 'internal-only',
      title: 'Internal Topic',
    },
    {
      id: 'topic-excluded',
      minimumReviewedQuestionCount: 5,
      platformTopicSlugs: [],
      requiredQuestionTypes: [],
      scope: 'excluded',
      title: 'Excluded Topic',
    },
  );

  const report = buildSubjectCoverage(subject, {
    content: {
      availableLessonCounts: {
        'chapter-1': 1,
        'chapter-2': 1,
      },
      chapterPacks: {
        'chapter-1': true,
        'chapter-2': true,
      },
    },
    questionCoverage: {
      questions: [
        { id: 'q-1', questionType: 'mcq', reviewed: true, topicId: 'topic-1', valid: true },
        { id: 'q-2', questionType: 'mcq', reviewed: true, topicId: 'topic-1', valid: true },
        { id: 'q-3', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
        { id: 'q-4', questionType: 'short-answer', reviewed: true, topicId: 'topic-2', valid: true },
        { id: 'q-5', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
      ],
      reviewedCountByTopicId: {
        'topic-1': 2,
        'topic-2': 3,
      },
    },
  });

  assert.equal(report.dimensions.curriculum.percent, 100);
  assert.equal(report.dimensions.chapterPack.percent, 100);
  assert.equal(report.dimensions.lessonWise.percent, 100);
  assert.equal(report.dimensions.questionBank.percent, 100);
  assert.equal(report.dimensions.questionType.percent, 100);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-internal'), false);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-excluded'), false);
});

test('buildSubjectCoverage counts only reviewed valid non-retired structured questions for reviewedAnswer', () => {
  const report = buildSubjectCoverage(createSubjectFixture(), {
    content: {
      availableLessonCounts: {
        'chapter-1': 1,
        'chapter-2': 1,
      },
      chapterPacks: {
        'chapter-1': true,
        'chapter-2': true,
      },
    },
    questionCoverage: {
      questions: [
        { id: 'q-1', questionType: 'short-answer', reviewed: true, topicId: 'topic-1', valid: true },
        { id: 'q-2', questionType: 'long-answer', reviewed: false, topicId: 'topic-1', valid: true },
        { id: 'q-3', questionType: 'proof', reviewed: true, topicId: 'topic-2', valid: false },
        { id: 'q-4', questionType: 'case-study', reviewed: true, retired: true, topicId: 'topic-2', valid: true },
        { id: 'q-5', questionType: 'mcq', reviewed: true, topicId: 'topic-2', valid: true },
      ],
      reviewedCountByTopicId: {
        'topic-1': 2,
        'topic-2': 3,
      },
    },
  });

  assert.equal(report.dimensions.reviewedAnswer.numerator, 1);
  assert.equal(report.dimensions.reviewedAnswer.denominator, 3);
  assert.equal(report.dimensions.reviewedAnswer.percent, 33);
});

test('getCurriculumContentEvidence mirrors source-of-truth chapter-pack and lesson evidence helpers', () => {
  const evidence = getCurriculumContentEvidence();
  const chemicalChapter = getChapter('chemical-reactions-and-equations');

  assert.ok(chemicalChapter);
  assert.equal(evidence.chapterPacks['real-numbers'], hasChapterPack('real-numbers'));
  assert.equal(
    evidence.availableLessonCounts['chemical-reactions-and-equations'],
    getAvailableLessons(chemicalChapter).length,
  );
  assert.equal(typeof evidence.chapterPacks['chemical-reactions-and-equations'], 'boolean');
  assert.equal(
    typeof evidence.availableLessonCounts['chemical-reactions-and-equations'],
    'number',
  );
});
