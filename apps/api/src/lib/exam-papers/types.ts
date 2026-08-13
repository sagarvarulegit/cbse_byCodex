/**
 * Shared types for the Sample Test Exam Paper Generator (Maths 041 pilot).
 * These mirror the JSON columns stored on QuestionBankQuestion / ExamPaper /
 * ExamPaperQuestion and the payloads exchanged with the web app.
 */

export type QuestionSourceKind = 'ncert_exercise' | 'verified_pyq' | 'board_style';

export type QuestionVerificationStatus = 'unverified' | 'review' | 'verified' | 'rejected';

export type BankQuestionProvenance = {
  year?: string;
  paperCode?: string;
  questionNo?: string;
  page?: string;
};

export type AnswerKey = {
  /** MCQ answers: ordered option labels. */
  options?: string[];
  /** MCQ answers: index into `options` (0-based). */
  correctOptionIndex?: number;
  /** Constructed-response answers: official value points (1 per half-mark-ish). */
  valuePoints: string[];
  /** Student-facing model answer. */
  modelAnswer: string;
};

export type BankQuestionVariant = {
  variantKey: string;
  params: Record<string, unknown>;
  statement: string;
  answerKey: AnswerKey;
};

export type BankQuestion = {
  bankKey: string;
  subjectSlug: string;
  chapterSlug: string;
  unitId: string;
  topicId: string;
  questionType: string;
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  sourceKind: QuestionSourceKind;
  provenance?: BankQuestionProvenance | null;
  variants: BankQuestionVariant[];
  verificationStatus: QuestionVerificationStatus;
};

export type PaperSectionDefinition = {
  id: string;
  title: string;
  instructions: string;
  questionCount: number;
  marksPerQuestion: number;
  /** Bank questionType values that may fill this section. */
  allowedBankTypes: string[];
};

export type PaperSection = {
  id: string;
  title: string;
  instructions: string;
  questionCount: number;
  marksPerQuestion: number;
};

export type PaperQuestion = {
  questionNumber: number;
  sectionId: string;
  questionType: string;
  marks: number;
  statement: string;
  answerKey: AnswerKey;
  bankKey: string;
  chapterSlug: string;
  topicId: string;
  sourceKind: QuestionSourceKind;
  provenance?: BankQuestionProvenance | null;
  variantKey: string;
};

export type UnitMarkReport = {
  unitId: string;
  targetMarks: number;
  achievedMarks: number;
  mcqCount: number;
};

export type PaperComplianceReport = {
  unitMarks: UnitMarkReport[];
  coveredTopicIds: string[];
  /** Board topics not present in this paper (informational; a 38-question paper cannot cover every topic). */
  uncoveredBoardTopicIds: string[];
  excludedTopicViolations: string[];
  questionBankKeys: string[];
};

export type GeneratedPaper = {
  subjectSlug: string;
  title: string;
  seed: number;
  layoutVersion: string;
  totalMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  sections: PaperSection[];
  questions: PaperQuestion[];
  compliance: PaperComplianceReport;
};

export type AiVerdict = 'pass' | 'flag' | 'fail';

export type QuestionVerificationResult = {
  questionNumber: number;
  verdict: AiVerdict;
  reasons: string[];
  correctedAnswerKey?: AnswerKey;
};

export type PaperVerificationResult = {
  model: string;
  paperVerdict: AiVerdict;
  paperReasons: string[];
  blueprintCompliance: {
    totalMarksMatch: boolean;
    sectionMarksMatch: boolean;
    coverageNotes: string[];
  };
  questions: QuestionVerificationResult[];
};
