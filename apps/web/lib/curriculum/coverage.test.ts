import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvailableLessons,
  getChapter,
  getCurriculumContentEvidence,
  hasChapterPack,
} from '../course-content';
import { buildSubjectCoverage } from './coverage';
import { getCurriculumSubject } from './registry';
import type { CurriculumSubject } from './types';

function createSubjectFixture(
  assessmentMode: CurriculumSubject['assessmentMode'] = 'board',
): CurriculumSubject {
  const topicScope = assessmentMode === 'internal' ? 'internal-only' : 'board-exam';

  return {
    activationBlockers: [],
    academicSession: '2026-27',
    assessmentMode,
    books: [],
    classLevel: 10,
    examProfile:
      assessmentMode === 'board'
        ? {
            allowedMarkValues: [1, 2, 3, 5],
            blueprintBlockers: [],
            blueprintSourceIds: ['fixture-source'],
            blueprintStatus: 'ready',
            durationMinutes: 180,
            maximumMarks: 80,
            readingTimeMinutes: 15,
            sectionRules: [],
          }
        : null,
    officialSourceIds: ['fixture-source'],
    readinessBlockers: [],
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
            scope: topicScope,
            title: 'Chapter 1',
            topics: [
              {
                id: 'topic-1',
                minimumReviewedQuestionCount: assessmentMode === 'board' ? 2 : 0,
                platformContentRefs: [
                  {
                    chapterSlug: 'chapter-1',
                    kind: 'chapter-pack',
                  },
                  {
                    chapterSlug: 'chapter-1',
                    kind: 'lesson',
                    lessonSlug: 'lesson-1',
                  },
                ],
                requiredQuestionTypes: assessmentMode === 'board' ? ['mcq'] : [],
                scope: topicScope,
                title: 'Topic 1',
              },
            ],
          },
          {
            id: 'chapter-2',
            platformChapterSlugs: ['chapter-2'],
            scope: topicScope,
            title: 'Chapter 2',
            topics: [
              {
                id: 'topic-2',
                minimumReviewedQuestionCount: assessmentMode === 'board' ? 3 : 0,
                platformContentRefs: [],
                requiredQuestionTypes:
                  assessmentMode === 'board' ? ['mcq', 'short-answer'] : [],
                scope: topicScope,
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

test('buildSubjectCoverage validates topic-level mappings and evidence deterministically', () => {
  const report = buildSubjectCoverage(createSubjectFixture(), {
    content: {
      availableLessonSlugs: {
        'chapter-1': ['lesson-1'],
        'chapter-2': [],
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

  assert.deepEqual(report.dimensions.curriculum, {
    blockers: ['Missing platform mapping for topic-2'],
    denominator: 2,
    numerator: 1,
    percent: 50,
    status: 'incomplete',
  });
  assert.equal(report.dimensions.chapterPack.percent, 100);
  assert.equal(report.dimensions.chapterPack.denominator, 1);
  assert.equal(report.dimensions.lessonWise.percent, 100);
  assert.equal(report.dimensions.lessonWise.denominator, 1);
  assert.equal(report.dimensions.questionBank.percent, 100);
  assert.equal(report.dimensions.questionType.percent, 67);
  assert.equal(report.dimensions.reviewedAnswer.status, 'not-configured');
  assert.equal(report.dimensions.reviewedAnswer.percent, null);
  assert.equal(report.dimensions.paperGeneration.percent, 67);
  assert.equal(report.dimensions.studentPublication.percent, 50);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-2'), true);
});

test('excluded and formative topics never become board readiness through a whole chapter pack', () => {
  const subject = createSubjectFixture();

  subject.units[0]!.chapters[0]!.topics.push(
    {
      id: 'topic-internal',
      minimumReviewedQuestionCount: 0,
      platformContentRefs: [
        {
          chapterSlug: 'chapter-1',
          kind: 'chapter-pack',
        },
      ],
      requiredQuestionTypes: [],
      scope: 'internal-only',
      title: 'Internal Topic',
    },
    {
      id: 'topic-excluded',
      minimumReviewedQuestionCount: 0,
      platformContentRefs: [
        {
          chapterSlug: 'chapter-1',
          kind: 'chapter-pack',
        },
      ],
      requiredQuestionTypes: [],
      scope: 'excluded',
      title: 'Excluded Topic',
    },
  );

  const report = buildSubjectCoverage(subject, {
    content: {
      availableLessonSlugs: {
        'chapter-1': ['lesson-1'],
        'chapter-2': [],
      },
      chapterPacks: {
        'chapter-1': true,
        'chapter-2': true,
      },
    },
    questionCoverage: {
      questions: [],
    },
  });

  assert.equal(report.dimensions.curriculum.denominator, 2);
  assert.equal(report.dimensions.chapterPack.denominator, 1);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-internal'), false);
  assert.equal(report.blockers.includes('Missing platform mapping for topic-excluded'), false);
});

test('absent configuration is explicit instead of reporting misleading 100 percent', () => {
  const report = buildSubjectCoverage(createSubjectFixture(), {
    content: {
      availableLessonSlugs: {},
      chapterPacks: {},
    },
  });

  for (const dimension of [
    report.dimensions.questionBank,
    report.dimensions.questionType,
    report.dimensions.reviewedAnswer,
    report.dimensions.paperGeneration,
    report.dimensions.studentPublication,
  ]) {
    assert.equal(dimension.status, 'not-configured');
    assert.equal(dimension.percent, null);
  }
});

test('internal HPE coverage is assessment-aware and does not require board paper seeds', () => {
  const report = buildSubjectCoverage(createSubjectFixture('internal'), {
    content: {
      availableLessonSlugs: {
        'chapter-1': ['lesson-1'],
      },
      chapterPacks: {
        'chapter-1': true,
      },
    },
  });

  assert.equal(report.dimensions.curriculum.denominator, 2);
  assert.equal(report.dimensions.paperGeneration.status, 'not-applicable');
  assert.equal(report.dimensions.paperGeneration.percent, null);
  assert.equal(
    report.blockers.some((blocker) => blocker.includes('paper seed')),
    false,
  );
});

test('real board subjects configure positive reviewed-question minima for every board topic', () => {
  for (const slug of [
    'mathematics-standard',
    'science',
    'social-science',
    'english-language-and-literature',
    'hindi-course-b',
  ]) {
    const subject = getCurriculumSubject(slug);

    assert.ok(subject);

    for (const topic of subject.units
      .flatMap((unit) => unit.chapters)
      .flatMap((chapter) => chapter.topics)
      .filter((candidate) => candidate.scope === 'board-exam')) {
      assert.ok(topic.minimumReviewedQuestionCount > 0, `${slug}:${topic.id}`);
    }
  }
});

test('getCurriculumContentEvidence mirrors chapter-pack and exact available-lesson evidence', () => {
  const evidence = getCurriculumContentEvidence();
  const chemicalChapter = getChapter('chemical-reactions-and-equations');

  assert.ok(chemicalChapter);
  assert.equal(evidence.chapterPacks['real-numbers'], hasChapterPack('real-numbers'));
  assert.deepEqual(
    evidence.availableLessonSlugs['chemical-reactions-and-equations'],
    getAvailableLessons(chemicalChapter).map((lesson) => lesson.slug),
  );
  assert.equal(typeof evidence.chapterPacks['chemical-reactions-and-equations'], 'boolean');
});
