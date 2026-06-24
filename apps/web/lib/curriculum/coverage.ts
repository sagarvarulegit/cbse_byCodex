import type { BoardQuestionType, CurriculumChapter, CurriculumSubject, CurriculumTopic } from './types';

const STRUCTURED_QUESTION_TYPES: ReadonlySet<BoardQuestionType> = new Set([
  'very-short-answer',
  'short-answer',
  'long-answer',
  'case-study',
  'source-based',
  'extract-based',
  'numerical',
  'proof',
  'construction',
  'diagram',
  'map-skill',
  'picture-interpretation',
  'data-interpretation',
  'grammar',
  'creative-writing',
]);

export type CurriculumContentEvidence = {
  chapterPacks: Record<string, boolean>;
  availableLessonCounts: Record<string, number>;
};

export type CoverageQuestionEvidence = {
  id: string;
  topicId: string;
  questionType: BoardQuestionType;
  reviewed: boolean;
  retired?: boolean;
  valid?: boolean;
};

export type QuestionCoverageEvidence = {
  reviewedCountByTopicId?: Record<string, number>;
  questions?: CoverageQuestionEvidence[];
};

export type PaperGenerationEvidence = {
  validSeedIds: string[];
};

export type StudentPublicationGateEvidence = {
  id: string;
  passed: boolean;
};

export type StudentPublicationEvidence = {
  gates: StudentPublicationGateEvidence[];
};

export type CoverageEvidence = {
  content: CurriculumContentEvidence;
  questionCoverage?: QuestionCoverageEvidence;
  paperGeneration?: PaperGenerationEvidence;
  studentPublication?: StudentPublicationEvidence;
};

export type CoverageDimensionResult = {
  numerator: number;
  denominator: number;
  percent: number;
  blockers: string[];
};

export type SubjectCoverageReport = {
  subjectSlug: string;
  academicSession: string;
  dimensions: {
    curriculum: CoverageDimensionResult;
    chapterPack: CoverageDimensionResult;
    lessonWise: CoverageDimensionResult;
    questionBank: CoverageDimensionResult;
    questionType: CoverageDimensionResult;
    reviewedAnswer: CoverageDimensionResult;
    paperGeneration: CoverageDimensionResult;
    studentPublication: CoverageDimensionResult;
  };
  blockers: string[];
};

export function buildSubjectCoverage(
  subject: CurriculumSubject,
  evidence: CoverageEvidence,
): SubjectCoverageReport {
  const boardChapters = getBoardExamChapters(subject);
  const boardTopics = boardChapters.flatMap((chapter) => getBoardExamTopics(chapter));
  const questions = evidence.questionCoverage?.questions ?? [];

  const curriculum = createResult(
    boardTopics.length,
    boardTopics.length,
    getMissingPlatformTopicBlockers(boardTopics),
  );

  const mappedBoardChapters = boardChapters.filter((chapter) => chapter.platformChapterSlugs.length > 0);
  const chapterPackHits = mappedBoardChapters.filter((chapter) =>
    chapter.platformChapterSlugs.some((slug) => evidence.content.chapterPacks[slug] === true),
  );
  const chapterPack = createResult(
    chapterPackHits.length,
    mappedBoardChapters.length,
    [
      ...getMissingPlatformChapterBlockers(boardChapters),
      ...mappedBoardChapters
        .filter((chapter) => !chapterPackHits.includes(chapter))
        .map((chapter) => `Missing chapter pack for ${chapter.id}`),
    ],
  );

  const lessonWiseHits = mappedBoardChapters.filter((chapter) =>
    chapter.platformChapterSlugs.some((slug) => (evidence.content.availableLessonCounts[slug] ?? 0) > 0),
  );
  const lessonWise = createResult(
    lessonWiseHits.length,
    mappedBoardChapters.length,
    mappedBoardChapters
      .filter((chapter) => !lessonWiseHits.includes(chapter))
      .map((chapter) => `No available lessons for ${chapter.id}`),
  );

  const questionBankTotals = boardTopics.reduce(
    (totals, topic) => {
      const minimum = topic.minimumReviewedQuestionCount;
      const reviewedCount = getReviewedCountForTopic(topic.id, evidence.questionCoverage, questions);

      totals.numerator += Math.min(reviewedCount, minimum);
      totals.denominator += minimum;

      if (reviewedCount < minimum) {
        totals.blockers.push(`Need ${minimum - reviewedCount} more reviewed questions for ${topic.id}`);
      }

      return totals;
    },
    { blockers: [] as string[], denominator: 0, numerator: 0 },
  );
  const questionBank = createResult(
    questionBankTotals.numerator,
    questionBankTotals.denominator,
    questionBankTotals.blockers,
  );

  const questionTypeTotals = boardTopics.reduce(
    (totals, topic) => {
      for (const questionType of topic.requiredQuestionTypes) {
        totals.denominator += 1;

        if (hasQuestionTypeCoverage(topic.id, questionType, questions)) {
          totals.numerator += 1;
          continue;
        }

        totals.blockers.push(`Missing ${questionType} questions for ${topic.id}`);
      }

      return totals;
    },
    { blockers: [] as string[], denominator: 0, numerator: 0 },
  );
  const questionType = createResult(
    questionTypeTotals.numerator,
    questionTypeTotals.denominator,
    questionTypeTotals.blockers,
  );

  const activeStructuredQuestions = questions.filter(
    (question) => !question.retired && isStructuredQuestionType(question.questionType),
  );
  const reviewedValidQuestions = activeStructuredQuestions.filter(
    (question) => question.reviewed && isValidQuestion(question),
  );
  const reviewedAnswer = createResult(
    reviewedValidQuestions.length,
    activeStructuredQuestions.length,
    [],
  );

  const validSeedCount = Math.min(new Set(evidence.paperGeneration?.validSeedIds ?? []).size, 3);
  const paperGeneration = createResult(
    validSeedCount,
    3,
    validSeedCount >= 3 ? [] : [`Need ${3 - validSeedCount} more valid paper seeds`],
  );

  const publicationGates = evidence.studentPublication?.gates ?? [];
  const passedPublicationGates = publicationGates.filter((gate) => gate.passed);
  const studentPublication = createResult(
    passedPublicationGates.length,
    publicationGates.length,
    publicationGates.filter((gate) => !gate.passed).map((gate) => `Publication gate failed: ${gate.id}`),
  );

  const dimensions = {
    curriculum,
    chapterPack,
    lessonWise,
    questionBank,
    questionType,
    reviewedAnswer,
    paperGeneration,
    studentPublication,
  };

  return {
    subjectSlug: subject.slug,
    academicSession: subject.academicSession,
    dimensions,
    blockers: uniqueStrings([
      ...subject.activationBlockers,
      ...curriculum.blockers,
      ...chapterPack.blockers,
      ...lessonWise.blockers,
      ...questionBank.blockers,
      ...questionType.blockers,
      ...reviewedAnswer.blockers,
      ...paperGeneration.blockers,
      ...studentPublication.blockers,
    ]),
  };
}

function getBoardExamChapters(subject: CurriculumSubject): CurriculumChapter[] {
  return subject.units.flatMap((unit) =>
    unit.chapters.filter((chapter) => chapter.scope === 'board-exam'),
  );
}

function getBoardExamTopics(chapter: CurriculumChapter): CurriculumTopic[] {
  return chapter.topics.filter((topic) => topic.scope === 'board-exam');
}

function getMissingPlatformTopicBlockers(topics: CurriculumTopic[]) {
  return topics
    .filter((topic) => topic.platformTopicSlugs.length === 0)
    .map((topic) => `Missing platform mapping for ${topic.id}`);
}

function getMissingPlatformChapterBlockers(chapters: CurriculumChapter[]) {
  return chapters
    .filter((chapter) => chapter.platformChapterSlugs.length === 0)
    .map((chapter) => `Missing platform mapping for ${chapter.id}`);
}

function getReviewedCountForTopic(
  topicId: string,
  questionCoverage: QuestionCoverageEvidence | undefined,
  questions: CoverageQuestionEvidence[],
) {
  const explicitCount = questionCoverage?.reviewedCountByTopicId?.[topicId];

  if (explicitCount !== undefined) {
    return explicitCount;
  }

  return questions.filter(
    (question) => question.topicId === topicId && question.reviewed && isValidQuestion(question) && !question.retired,
  ).length;
}

function hasQuestionTypeCoverage(
  topicId: string,
  questionType: BoardQuestionType,
  questions: CoverageQuestionEvidence[],
) {
  return questions.some(
    (question) =>
      question.topicId === topicId &&
      question.questionType === questionType &&
      !question.retired &&
      isValidQuestion(question),
  );
}

function isValidQuestion(question: CoverageQuestionEvidence) {
  return question.valid !== false;
}

function isStructuredQuestionType(questionType: BoardQuestionType) {
  return STRUCTURED_QUESTION_TYPES.has(questionType);
}

function createResult(
  numerator: number,
  denominator: number,
  blockers: string[],
): CoverageDimensionResult {
  return {
    numerator,
    denominator,
    percent: denominator === 0 ? 100 : Math.round((numerator / denominator) * 100),
    blockers: uniqueStrings(blockers),
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}
