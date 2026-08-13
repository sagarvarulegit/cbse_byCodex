import assert from 'node:assert/strict';
import test from 'node:test';

import { assemblePaper, PaperAssemblyError } from './assembler.js';
import { BLUEPRINT, getBoardUnits, getExcludedTopicIds } from './blueprint.js';
import { MATHS_041_LAYOUT } from './layout.js';
import { MATHS_041_SEED } from './seed/maths-041-seed.js';

const SEEDS = Array.from({ length: 50 }, (_, index) => index + 1);

function verifiedBank() {
  return MATHS_041_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

test('the real Maths 041 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedBank();
  for (const seed of SEEDS) {
    const paper = assemblePaper({ subjectSlug: 'mathematics-standard', seed, questions: bank });

    assert.equal(paper.totalMarks, 80);
    assert.equal(paper.durationMinutes, 180);
    assert.equal(paper.readingTimeMinutes, 15);
    assert.equal(paper.questions.length, 38);
    assert.equal(paper.sections.length, 5);
    assert.equal(paper.seed, seed);
    assert.ok(paper.compliance.excludedTopicViolations.length === 0);
  }
});

test('every section matches the official layout exactly', () => {
  const paper = assemblePaper({
    subjectSlug: 'mathematics-standard',
    seed: 7,
    questions: verifiedBank(),
  });

  for (const section of MATHS_041_LAYOUT.sections) {
    const sectionQuestions = paper.questions.filter(
      (question) => question.sectionId === section.id,
    );
    assert.equal(
      sectionQuestions.length,
      section.questionCount,
      `Section ${section.id} question count`,
    );
    const sectionMarks = sectionQuestions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );
    assert.equal(
      sectionMarks,
      section.questionCount * section.marksPerQuestion,
      `Section ${section.id} marks`,
    );
    for (const question of sectionQuestions) {
      assert.ok(
        section.allowedBankTypes.includes(question.questionType),
        `Section ${section.id} type ${question.questionType}`,
      );
    }
  }
});

test('every unit achieves its exact official weightage', () => {
  const paper = assemblePaper({
    subjectSlug: 'mathematics-standard',
    seed: 13,
    questions: verifiedBank(),
  });

  const units = getBoardUnits();
  assert.equal(paper.compliance.unitMarks.length, units.length);
  for (const report of paper.compliance.unitMarks) {
    const unit = units.find((candidate) => candidate.id === report.unitId);
    assert.ok(unit, `unknown unit ${report.unitId}`);
    assert.equal(
      report.achievedMarks,
      unit.marks,
      `Unit ${report.unitId} weightage`,
    );
  }
});

test('excluded topics never appear and question numbers are sequential', () => {
  const excluded = new Set(getExcludedTopicIds());
  for (const seed of SEEDS) {
    const paper = assemblePaper({
      subjectSlug: 'mathematics-standard',
      seed,
      questions: verifiedBank(),
    });
    for (const question of paper.questions) {
      assert.ok(!excluded.has(question.topicId), `excluded topic ${question.topicId}`);
    }
    assert.deepEqual(
      paper.questions.map((question) => question.questionNumber),
      Array.from({ length: 38 }, (_, index) => index + 1),
    );
  }
});

test('the same seed reproduces the identical paper', () => {
  const bank = verifiedBank();
  const first = assemblePaper({ subjectSlug: 'mathematics-standard', seed: 42, questions: bank });
  const second = assemblePaper({ subjectSlug: 'mathematics-standard', seed: 42, questions: bank });
  assert.deepEqual(first.questions, second.questions);
  assert.deepEqual(first.compliance, second.compliance);
});

test('different seeds produce different papers', () => {
  const bank = verifiedBank();
  const papers = SEEDS.map((seed) =>
    assemblePaper({ subjectSlug: 'mathematics-standard', seed, questions: bank }),
  );
  const paperSignatures = papers.map((paper) =>
    paper.questions.map((question) => `${question.bankKey}:${question.variantKey}`).join('|'),
  );
  const uniqueSignatures = new Set(paperSignatures);
  assert.ok(
    uniqueSignatures.size > 10,
    `expected variety across seeds, got ${uniqueSignatures.size} unique papers`,
  );
});

test('unverified questions are never selected', () => {
  const unverified = MATHS_041_SEED.map((question) => ({
    ...question,
    verificationStatus: 'unverified' as const,
  }));
  assert.throws(
    () =>
      assemblePaper({
        subjectSlug: 'mathematics-standard',
        seed: 1,
        questions: unverified,
      }),
    (error: unknown) => error instanceof PaperAssemblyError && /No verified questions/.test(error.message),
  );
});

test('a paper never repeats a bank question', () => {
  for (const seed of SEEDS) {
    const paper = assemblePaper({
      subjectSlug: 'mathematics-standard',
      seed,
      questions: verifiedBank(),
    });
    const bankKeys = paper.questions.map((question) => question.bankKey);
    assert.equal(new Set(bankKeys).size, bankKeys.length);
  }
});

test('layout totals are internally consistent', () => {
  assert.equal(BLUEPRINT.maximumMarks, 80);
  const layoutTotal = MATHS_041_LAYOUT.sections.reduce(
    (sum, section) => sum + section.questionCount * section.marksPerQuestion,
    0,
  );
  assert.equal(layoutTotal, MATHS_041_LAYOUT.totalMarks);
});
