import {
  getBlueprint,
  getBoardTopicIds,
  getBoardUnits,
  getExcludedTopicIds,
} from './blueprint.js';
import { buildDemandPlan } from './demand.js';
import { getPaperLayout, type PaperLayout } from './layout.js';
import { createSeededRng } from './prng.js';
import type {
  AnswerKey,
  BankQuestion,
  GeneratedPaper,
  PaperQuestion,
  PaperComplianceReport,
} from './types.js';

export class PaperAssemblyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaperAssemblyError';
  }
}

export type AssemblePaperInput = {
  subjectSlug: string;
  seed: number;
  /** Verified bank questions for the subject (the caller filters by status). */
  questions: BankQuestion[];
};

/**
 * Deterministically assembles a full CBSE-format paper from the
 * verified question bank. The same seed + bank always produces the same paper;
 * distinct seeds vary question selection and numeric variants. Fails loudly
 * instead of returning an invalid paper.
 */
export function assemblePaper({
  subjectSlug,
  seed,
  questions,
}: AssemblePaperInput): GeneratedPaper {
  const blueprint = getBlueprint(subjectSlug);
  if (!blueprint) {
    throw new PaperAssemblyError(
      `Paper generation does not support subject "${subjectSlug}".`,
    );
  }
  if (blueprint.blueprintStatus !== 'ready') {
    throw new PaperAssemblyError(`The ${blueprint.title} blueprint is not ready.`);
  }

  const bank = questions.filter(
    (question) =>
      question.subjectSlug === subjectSlug &&
      question.verificationStatus === 'verified',
  );
  if (bank.length === 0) {
    throw new PaperAssemblyError(
      'No verified questions are available in the question bank. Run the bank seed and verify questions first.',
    );
  }

  const layout = getPaperLayout(subjectSlug);
  const rng = createSeededRng(seed);
  const units = getBoardUnits(subjectSlug);

  const excludedTopicIds = new Set(getExcludedTopicIds(subjectSlug));
  const excludedInBank = bank.filter((question) => excludedTopicIds.has(question.topicId));
  if (excludedInBank.length > 0) {
    throw new PaperAssemblyError(
      `The bank contains excluded-topic questions: ${excludedInBank
        .map((question) => question.bankKey)
        .join(', ')}.`,
    );
  }

  const bankByUnit = new Map<string, BankQuestion[]>();
  for (const question of bank) {
    const list = bankByUnit.get(question.unitId) ?? [];
    list.push(question);
    bankByUnit.set(question.unitId, list);
  }

  const eligibleUnitsBySection = new Map<string, string[]>();
  for (const section of layout.sections) {
    const unitIds = [
      ...new Set(
        bank
          .filter(
            (q) =>
              q.marks === section.marksPerQuestion &&
              section.allowedBankTypes.includes(q.questionType),
          )
          .map((q) => q.unitId),
      ),
    ];
    eligibleUnitsBySection.set(section.id, unitIds);
  }

  const sectionE = layout.sections.find((s) => s.id === 'E');
  const requiredCaseStudyUnits = sectionE ? sectionE.questionCount : 0;
  const caseStudyUnitIds = eligibleUnitsBySection.get('E') ?? [];

  if (requiredCaseStudyUnits > 0 && caseStudyUnitIds.length === 0) {
    throw new PaperAssemblyError(
      `Section E needs case-study questions but the bank has no units covering case studies.`,
    );
  }

  const plan = buildDemandPlan(units, layout.sections, eligibleUnitsBySection, rng);

  const topicCoverage = new Map<string, number>();
  const selectedBankKeys = new Set<string>();
  const questionsOut: PaperQuestion[] = [];
  let questionNumber = 0;

  const emit = (question: BankQuestion, sectionId: string, marks: number) => {
    selectedBankKeys.add(question.bankKey);
    topicCoverage.set(question.topicId, (topicCoverage.get(question.topicId) ?? 0) + 1);
    const variant = rng.pick(question.variants);
    questionNumber += 1;
    questionsOut.push({
      questionNumber,
      sectionId,
      questionType: question.questionType,
      marks,
      statement: variant.statement,
      answerKey: variant.answerKey as AnswerKey,
      bankKey: question.bankKey,
      chapterSlug: question.chapterSlug,
      topicId: question.topicId,
      sourceKind: question.sourceKind,
      provenance: question.provenance ?? null,
      variantKey: variant.variantKey,
    });
  };

  const selectForUnit = (
    section: { id: string; marksPerQuestion: number; allowedBankTypes: string[] },
    unitId: string,
    count: number,
  ) => {
    const pool = (bankByUnit.get(unitId) ?? []).filter(
      (question) =>
        question.marks === section.marksPerQuestion &&
        section.allowedBankTypes.includes(question.questionType) &&
        !selectedBankKeys.has(question.bankKey),
    );
    if (pool.length < count) {
      throw new PaperAssemblyError(
        `Unit "${unitId}" needs ${count} ${section.marksPerQuestion}-mark ` +
          `${section.allowedBankTypes.join('/')} question(s) for Section ${section.id} ` +
          `but only ${pool.length} verified question(s) are available.`,
      );
    }

    // Seeded shuffle first, then a stable sort by topic coverage: units with
    // untouched topics are preferred, and equal-coverage ties keep the seeded
    // order so the paper stays reproducible.
    const ordered = rng
      .shuffle(pool)
      .sort(
        (a, b) =>
          (topicCoverage.get(a.topicId) ?? 0) - (topicCoverage.get(b.topicId) ?? 0),
      );

    for (const question of ordered.slice(0, count)) {
      emit(question, section.id, section.marksPerQuestion);
    }
  };

  // Emit sections in official order (A first) so numbering matches the layout:
  for (const section of layout.sections) {
    if (section.id === 'A') {
      for (const unit of units) {
        const count = plan.mcqCounts.get(unit.id) ?? 0;
        if (count > 0) {
          selectForUnit(section, unit.id, count);
        }
      }
      continue;
    }
    const sectionAllocation = plan.allocations.get(section.id) ?? new Map<string, number>();
    for (const unit of units) {
      const count = sectionAllocation.get(unit.id) ?? 0;
      if (count > 0) {
        selectForUnit(section, unit.id, count);
      }
    }
  }

  const compliance = buildComplianceReport(questionsOut, bank, units, topicCoverage, subjectSlug);
  assertPaperInvariants(questionsOut, compliance, layout);

  return {
    subjectSlug: blueprint.slug,
    title: `${blueprint.title} — Sample Test Paper`,
    seed,
    layoutVersion: layout.layoutVersion,
    totalMarks: layout.totalMarks,
    durationMinutes: layout.durationMinutes,
    readingTimeMinutes: layout.readingTimeMinutes,
    sections: layout.sections.map((section) => ({
      id: section.id,
      title: section.title,
      instructions: section.instructions,
      questionCount: section.questionCount,
      marksPerQuestion: section.marksPerQuestion,
    })),
    questions: questionsOut,
    compliance,
  };
}

function buildComplianceReport(
  questions: PaperQuestion[],
  bank: BankQuestion[],
  units: Array<{ id: string; title: string; marks: number }>,
  topicCoverage: Map<string, number>,
  subjectSlug: string,
): PaperComplianceReport {
  const unitOf = new Map(bank.map((question) => [question.bankKey, question.unitId]));

  const unitMarks = units.map((unit) => {
    let achievedMarks = 0;
    let mcqCount = 0;
    for (const question of questions) {
      if (unitOf.get(question.bankKey) !== unit.id) {
        continue;
      }
      achievedMarks += question.marks;
      if (question.sectionId === 'A') {
        mcqCount += 1;
      }
    }
    return {
      unitId: unit.id,
      targetMarks: unit.marks,
      achievedMarks,
      mcqCount,
    };
  });

  const coveredTopicIds = [...topicCoverage.keys()];
  const coveredSet = new Set(coveredTopicIds);
  const excludedTopicViolations = questions
    .filter((question) => new Set(getExcludedTopicIds(subjectSlug)).has(question.topicId))
    .map((question) => question.topicId);

  const boardTopicIds = getBoardTopicIds(subjectSlug);
  const uncoveredBoardTopicIds = boardTopicIds.filter((topicId) => !coveredSet.has(topicId));

  return {
    unitMarks,
    coveredTopicIds,
    uncoveredBoardTopicIds,
    excludedTopicViolations,
    questionBankKeys: questions.map((question) => question.bankKey),
  };
}

function assertPaperInvariants(
  questions: PaperQuestion[],
  compliance: PaperComplianceReport,
  layout: PaperLayout,
): void {
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  if (totalMarks !== layout.totalMarks) {
    throw new PaperAssemblyError(
      `Paper totals ${totalMarks} marks, expected ${layout.totalMarks}.`,
    );
  }

  for (const section of layout.sections) {
    const sectionQuestions = questions.filter((q) => q.sectionId === section.id);
    if (sectionQuestions.length !== section.questionCount) {
      throw new PaperAssemblyError(
        `Section ${section.id} has ${sectionQuestions.length} questions, expected ${section.questionCount}.`,
      );
    }
    for (const question of sectionQuestions) {
      if (question.marks !== section.marksPerQuestion) {
        throw new PaperAssemblyError(
          `Section ${section.id} question ${question.questionNumber} carries ${question.marks} marks, ` +
            `expected ${section.marksPerQuestion}.`,
        );
      }
      if (!section.allowedBankTypes.includes(question.questionType)) {
        throw new PaperAssemblyError(
          `Section ${section.id} question ${question.questionNumber} has illegal type ` +
            `"${question.questionType}".`,
        );
      }
    }
  }

  const expectedNumbers = Array.from(
    { length: questions.length },
    (_, index) => index + 1,
  );
  const actualNumbers = questions.map((question) => question.questionNumber);
  if (expectedNumbers.join(',') !== actualNumbers.join(',')) {
    throw new PaperAssemblyError('Question numbering is not sequential from 1.');
  }

  const bankKeys = new Set(questions.map((question) => question.bankKey));
  if (bankKeys.size !== questions.length) {
    throw new PaperAssemblyError('A paper must not repeat a bank question.');
  }

  for (const report of compliance.unitMarks) {
    if (report.achievedMarks !== report.targetMarks) {
      throw new PaperAssemblyError(
        `Unit "${report.unitId}" achieves ${report.achievedMarks} marks, ` +
          `expected ${report.targetMarks}.`,
      );
    }
  }

  if (compliance.excludedTopicViolations.length > 0) {
    throw new PaperAssemblyError(
      `Paper contains excluded-topic questions: ${compliance.excludedTopicViolations.join(', ')}.`,
    );
  }
}
