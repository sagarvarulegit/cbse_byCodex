import {
  getChapterForTopic,
  getTopic,
  getUnit,
  getUnitForTopic,
  isExcludedTopic,
} from './blueprint.js';
import type { AnswerKey, BankQuestion, BankQuestionVariant } from './types.js';

export const VALID_SUBJECT_SLUGS = [
  'mathematics-standard',
  'science',
  'social-science',
  'english-language-and-literature',
] as const;
export const ALLOWED_MARK_VALUES = [1, 2, 3, 4, 5, 6] as const;
export const VALID_SOURCE_KINDS = ['ncert_exercise', 'verified_pyq', 'board_style'] as const;
export const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

/**
 * Question types that are placed by the paper layout rather than restricted by
 * the topic's `requiredQuestionTypes`: Section A MCQs, Section E case studies,
 * and data-interpretation items. The topic list drives constructed-response
 * legality only.
 */
const LAYOUT_PLACED_TYPES = new Set([
  'mcq',
  'case-study',
  'data-interpretation',
  'source-based',
  'map-skill',
  'extract-based',
  'creative-writing',
  'grammar',
]);

export type BankValidationIssue = {
  bankKey: string;
  message: string;
};

export function validateBankQuestion(question: BankQuestion): BankValidationIssue[] {
  const issues: BankValidationIssue[] = [];
  const push = (message: string) =>
    issues.push({ bankKey: question.bankKey, message: `${question.bankKey}: ${message}` });

  if (!/^[a-z0-9][a-z0-9-]*$/.test(question.bankKey)) {
    push('bankKey must be lowercase kebab-case.');
  }
  if (!VALID_SUBJECT_SLUGS.includes(question.subjectSlug as (typeof VALID_SUBJECT_SLUGS)[number])) {
    push(`subjectSlug "${question.subjectSlug}" is not supported.`);
  }
  if (!ALLOWED_MARK_VALUES.includes(question.marks as (typeof ALLOWED_MARK_VALUES)[number])) {
    push(`marks ${question.marks} is not an allowed value (${ALLOWED_MARK_VALUES.join(', ')}).`);
  }
  if (!VALID_DIFFICULTIES.includes(question.difficulty as (typeof VALID_DIFFICULTIES)[number])) {
    push('difficulty must be easy, medium or hard.');
  }
  if (!VALID_SOURCE_KINDS.includes(question.sourceKind as (typeof VALID_SOURCE_KINDS)[number])) {
    push('sourceKind must be ncert_exercise, verified_pyq or board_style.');
  }
  if (question.sourceKind === 'verified_pyq') {
    const provenance = question.provenance;
    if (!provenance?.year || !provenance?.paperCode || !provenance?.questionNo || !provenance?.page) {
      push('verified_pyq questions must carry year, paperCode, questionNo and page provenance.');
    }
  }

  const topic = getTopic(question.topicId, question.subjectSlug);
  if (!topic) {
    push(`topicId "${question.topicId}" is not in the ${question.subjectSlug} curriculum snapshot.`);
  } else {
    if (isExcludedTopic(question.topicId, question.subjectSlug)) {
      push(`topicId "${question.topicId}" is excluded from the current syllabus.`);
    }
    const requiredTypes: readonly string[] = topic.requiredQuestionTypes;
    if (!LAYOUT_PLACED_TYPES.has(question.questionType) && requiredTypes.length > 0) {
      if (!requiredTypes.includes(question.questionType)) {
        push(
          `questionType "${question.questionType}" is not allowed for topic "${question.topicId}" ` +
            `(allowed: ${requiredTypes.join(', ')}).`,
        );
      }
    }

    const actualUnit = getUnitForTopic(question.topicId, question.subjectSlug);
    if (!actualUnit) {
      push(`topicId "${question.topicId}" has no owning unit.`);
    } else if (question.unitId !== actualUnit.id) {
      push(`unitId "${question.unitId}" does not own topic "${question.topicId}" (owned by ${actualUnit.id}).`);
    }

    const actualChapter = getChapterForTopic(question.topicId, question.subjectSlug);
    if (actualChapter && question.chapterSlug !== actualChapter.id) {
      push(
        `chapterSlug "${question.chapterSlug}" does not match the topic's chapter "${actualChapter.id}".`,
      );
    }
  }

  if (!getUnit(question.unitId, question.subjectSlug)) {
    push(`unitId "${question.unitId}" is not in the ${question.subjectSlug} curriculum snapshot.`);
  }

  if (question.variants.length === 0) {
    push('at least one variant is required.');
  }

  const seenVariantKeys = new Set<string>();
  for (const variant of question.variants) {
    if (seenVariantKeys.has(variant.variantKey)) {
      push(`duplicate variantKey "${variant.variantKey}".`);
    }
    seenVariantKeys.add(variant.variantKey);

    if (!variant.variantKey || !variant.statement.trim()) {
      push(`variant "${variant.variantKey}" must have a non-empty statement.`);
    }
    validateAnswerKey(variant, question, push);
  }

  return issues;
}

function validateAnswerKey(
  variant: BankQuestionVariant,
  question: BankQuestion,
  push: (message: string) => void,
): void {
  const key: AnswerKey = variant.answerKey;
  const context = `variant "${variant.variantKey}"`;

  if (question.questionType === 'mcq') {
    if (!Array.isArray(key.options) || key.options.length < 2) {
      push(`${context} of an mcq needs at least 2 options.`);
    }
    if (
      typeof key.correctOptionIndex !== 'number' ||
      key.correctOptionIndex < 0 ||
      (key.options?.length ?? 0) <= key.correctOptionIndex
    ) {
      push(`${context} of an mcq needs a valid correctOptionIndex.`);
    }
    for (const option of key.options ?? []) {
      if (!option.trim()) {
        push(`${context} has an empty option label.`);
      }
    }
    if (key.valuePoints.length === 0) {
      push(`${context} needs a short explanation in valuePoints.`);
    }
  }

  if (!key.modelAnswer.trim()) {
    push(`${context} needs a non-empty modelAnswer.`);
  }
  if (key.valuePoints.length === 0) {
    push(`${context} needs at least one valuePoint.`);
  }
}

export function validateBankSeed(questions: BankQuestion[]): BankValidationIssue[] {
  const issues: BankValidationIssue[] = [];
  const seenBankKeys = new Set<string>();

  for (const question of questions) {
    if (seenBankKeys.has(question.bankKey)) {
      issues.push({ bankKey: question.bankKey, message: `${question.bankKey}: duplicate bankKey in seed.` });
    }
    seenBankKeys.add(question.bankKey);
    issues.push(...validateBankQuestion(question));
  }

  return issues;
}

export function assertValidBankSeed(questions: BankQuestion[]): void {
  const issues = validateBankSeed(questions);
  if (issues.length > 0) {
    throw new Error(`Question bank seed failed validation:\n${issues.map((issue) => `- ${issue.message}`).join('\n')}`);
  }
}
