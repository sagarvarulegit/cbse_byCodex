import { BOARD_QUESTION_TYPE_METADATA } from './question-types';
import type {
  BoardQuestionType,
  CurriculumSubject,
  CurriculumTopic,
  PlatformContentRef,
} from './types';

export type CurriculumContentEvidence = {
  chapterPacks: Record<string, boolean>;
  availableLessonSlugs: Record<string, string[]>;
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

export type CoverageDimensionStatus =
  | 'complete'
  | 'incomplete'
  | 'not-configured'
  | 'not-applicable';

export type CoverageDimensionResult = {
  numerator: number;
  denominator: number;
  percent: number | null;
  status: CoverageDimensionStatus;
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
  const assessedTopics = getAssessedTopics(subject);
  const questions = evidence.questionCoverage?.questions ?? [];

  const mappedTopics = assessedTopics.filter(
    (topic) => topic.platformContentRefs.length > 0,
  );
  const curriculum = createConfiguredResult(
    mappedTopics.length,
    assessedTopics.length,
    assessedTopics
      .filter((topic) => topic.platformContentRefs.length === 0)
      .map((topic) => `Missing platform mapping for ${topic.id}`),
    'No assessed curriculum topics are configured.',
  );

  const chapterPack = buildContentEvidenceDimension(
    assessedTopics,
    'chapter-pack',
    (reference) => evidence.content.chapterPacks[reference.chapterSlug] === true,
    (topic) => `Missing chapter-pack evidence for ${topic.id}`,
    'No chapter-pack topic mappings are configured.',
  );

  const lessonWise = buildContentEvidenceDimension(
    assessedTopics,
    'lesson',
    (reference) =>
      reference.kind === 'lesson' &&
      (evidence.content.availableLessonSlugs[reference.chapterSlug] ?? []).includes(
        reference.lessonSlug,
      ),
    (topic) => `Missing lesson evidence for ${topic.id}`,
    'No lesson-level topic mappings are configured.',
  );

  const questionBank =
    subject.assessmentMode !== 'board'
      ? createNotApplicable()
      : evidence.questionCoverage === undefined
        ? createNotConfigured('Question-bank evidence is not configured.')
        : buildQuestionBankDimension(
            assessedTopics,
            evidence.questionCoverage,
            questions,
          );

  const questionType =
    subject.assessmentMode !== 'board'
      ? createNotApplicable()
      : evidence.questionCoverage === undefined
        ? createNotConfigured('Question-type evidence is not configured.')
        : buildQuestionTypeDimension(assessedTopics, questions);

  const reviewedAnswer =
    subject.assessmentMode !== 'board'
      ? createNotApplicable()
      : evidence.questionCoverage === undefined
        ? createNotConfigured('Reviewed-answer evidence is not configured.')
        : buildReviewedAnswerDimension(questions);

  const paperGeneration =
    subject.assessmentMode !== 'board'
      ? createNotApplicable()
      : evidence.paperGeneration === undefined ||
          evidence.paperGeneration.validSeedIds.length === 0
        ? createNotConfigured('Paper-generation evidence is not configured.')
        : buildPaperGenerationDimension(evidence.paperGeneration);

  const studentPublication =
    evidence.studentPublication === undefined ||
    evidence.studentPublication.gates.length === 0
      ? createNotConfigured('Student-publication evidence is not configured.')
      : buildStudentPublicationDimension(evidence.studentPublication);

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
      ...subject.readinessBlockers,
      ...Object.values(dimensions).flatMap((dimension) => dimension.blockers),
    ]),
  };
}

function getAssessedTopics(subject: CurriculumSubject): CurriculumTopic[] {
  const scope =
    subject.assessmentMode === 'internal' ? 'internal-only' : 'board-exam';

  return subject.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics.filter((topic) => topic.scope === scope),
    ),
  );
}

function buildContentEvidenceDimension(
  topics: CurriculumTopic[],
  kind: PlatformContentRef['kind'],
  hasEvidence: (reference: PlatformContentRef) => boolean,
  blockerForTopic: (topic: CurriculumTopic) => string,
  notConfiguredMessage: string,
): CoverageDimensionResult {
  const configuredTopics = topics.filter((topic) =>
    topic.platformContentRefs.some((reference) => reference.kind === kind),
  );

  if (configuredTopics.length === 0) {
    return createNotConfigured(notConfiguredMessage);
  }

  const coveredTopics = configuredTopics.filter((topic) =>
    topic.platformContentRefs
      .filter((reference) => reference.kind === kind)
      .some(hasEvidence),
  );

  return createConfiguredResult(
    coveredTopics.length,
    configuredTopics.length,
    configuredTopics
      .filter((topic) => !coveredTopics.includes(topic))
      .map(blockerForTopic),
  );
}

function buildQuestionBankDimension(
  topics: CurriculumTopic[],
  questionCoverage: QuestionCoverageEvidence,
  questions: CoverageQuestionEvidence[],
): CoverageDimensionResult {
  const totals = topics.reduce(
    (result, topic) => {
      const minimum = topic.minimumReviewedQuestionCount;
      const reviewedCount = getReviewedCountForTopic(
        topic.id,
        questionCoverage,
        questions,
      );

      result.numerator += Math.min(reviewedCount, minimum);
      result.denominator += minimum;

      if (reviewedCount < minimum) {
        result.blockers.push(
          `Need ${minimum - reviewedCount} more reviewed questions for ${topic.id}`,
        );
      }

      return result;
    },
    { blockers: [] as string[], denominator: 0, numerator: 0 },
  );

  return createConfiguredResult(
    totals.numerator,
    totals.denominator,
    totals.blockers,
    'No reviewed-question minima are configured.',
  );
}

function buildQuestionTypeDimension(
  topics: CurriculumTopic[],
  questions: CoverageQuestionEvidence[],
): CoverageDimensionResult {
  const totals = topics.reduce(
    (result, topic) => {
      for (const questionType of topic.requiredQuestionTypes) {
        result.denominator += 1;

        if (hasQuestionTypeCoverage(topic.id, questionType, questions)) {
          result.numerator += 1;
        } else {
          result.blockers.push(
            `Missing ${questionType} questions for ${topic.id}`,
          );
        }
      }

      return result;
    },
    { blockers: [] as string[], denominator: 0, numerator: 0 },
  );

  return createConfiguredResult(
    totals.numerator,
    totals.denominator,
    totals.blockers,
    'No required question types are configured.',
  );
}

function buildReviewedAnswerDimension(
  questions: CoverageQuestionEvidence[],
): CoverageDimensionResult {
  const activeStructuredQuestions = questions.filter(
    (question) =>
      !question.retired &&
      BOARD_QUESTION_TYPE_METADATA[question.questionType].hasStructuredAnswer,
  );

  if (activeStructuredQuestions.length === 0) {
    return createNotConfigured(
      'No active structured-answer questions are configured.',
    );
  }

  const reviewedValidQuestions = activeStructuredQuestions.filter(
    (question) => question.reviewed && isValidQuestion(question),
  );

  return createConfiguredResult(
    reviewedValidQuestions.length,
    activeStructuredQuestions.length,
    [],
  );
}

function buildPaperGenerationDimension(
  evidence: PaperGenerationEvidence,
): CoverageDimensionResult {
  const validSeedCount = Math.min(new Set(evidence.validSeedIds).size, 3);

  return createConfiguredResult(
    validSeedCount,
    3,
    validSeedCount >= 3
      ? []
      : [`Need ${3 - validSeedCount} more valid paper seeds`],
  );
}

function buildStudentPublicationDimension(
  evidence: StudentPublicationEvidence,
): CoverageDimensionResult {
  const passedGates = evidence.gates.filter((gate) => gate.passed);

  return createConfiguredResult(
    passedGates.length,
    evidence.gates.length,
    evidence.gates
      .filter((gate) => !gate.passed)
      .map((gate) => `Publication gate failed: ${gate.id}`),
  );
}

function getReviewedCountForTopic(
  topicId: string,
  questionCoverage: QuestionCoverageEvidence,
  questions: CoverageQuestionEvidence[],
) {
  const explicitCount = questionCoverage.reviewedCountByTopicId?.[topicId];

  if (explicitCount !== undefined) {
    return explicitCount;
  }

  return questions.filter(
    (question) =>
      question.topicId === topicId &&
      question.reviewed &&
      isValidQuestion(question) &&
      !question.retired,
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

function createConfiguredResult(
  numerator: number,
  denominator: number,
  blockers: string[],
  notConfiguredMessage?: string,
): CoverageDimensionResult {
  if (denominator === 0) {
    return createNotConfigured(
      notConfiguredMessage ?? 'This readiness dimension is not configured.',
    );
  }

  return {
    numerator,
    denominator,
    percent: Math.round((numerator / denominator) * 100),
    status: numerator >= denominator ? 'complete' : 'incomplete',
    blockers: uniqueStrings(blockers),
  };
}

function createNotConfigured(message: string): CoverageDimensionResult {
  return {
    numerator: 0,
    denominator: 0,
    percent: null,
    status: 'not-configured',
    blockers: [message],
  };
}

function createNotApplicable(): CoverageDimensionResult {
  return {
    numerator: 0,
    denominator: 0,
    percent: null,
    status: 'not-applicable',
    blockers: [],
  };
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}
