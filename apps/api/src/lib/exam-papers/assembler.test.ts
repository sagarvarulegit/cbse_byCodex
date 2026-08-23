import assert from 'node:assert/strict';
import test from 'node:test';

import { assemblePaper, PaperAssemblyError } from './assembler.js';
import { getBoardUnits, getExcludedTopicIds } from './blueprint.js';
import {
  ENGLISH_184_LAYOUT,
  MATHS_041_LAYOUT,
  SCIENCE_086_LAYOUT,
  SOCIAL_SCIENCE_087_LAYOUT,
} from './layout.js';
import { MATHS_041_SEED } from './seed/maths-041-seed.js';
import { MATHS_241_SEED } from './seed/maths-241-seed.js';
import { SCIENCE_086_SEED } from './seed/science-086-seed.js';
import { SOCIAL_SCIENCE_087_SEED } from './seed/social-science-087-seed.js';
import { ENGLISH_184_SEED } from './seed/english-184-seed.js';
import { HINDI_002_SEED } from './seed/hindi-002-seed.js';
import { HINDI_085_SEED } from './seed/hindi-085-seed.js';

const SEEDS = Array.from({ length: 50 }, (_, index) => index + 1);

function verifiedMathsBank() {
  return MATHS_041_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedMathsBasicBank() {
  return MATHS_241_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedScienceBank() {
  return SCIENCE_086_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedSocialScienceBank() {
  return SOCIAL_SCIENCE_087_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedEnglishBank() {
  return ENGLISH_184_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedHindi002Bank() {
  return HINDI_002_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

function verifiedHindi085Bank() {
  return HINDI_085_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
}

test('the real Maths 041 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedMathsBank();
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

test('the real Science 086 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedScienceBank();
  for (const seed of SEEDS) {
    const paper = assemblePaper({ subjectSlug: 'science', seed, questions: bank });

    assert.equal(paper.totalMarks, 80);
    assert.equal(paper.durationMinutes, 180);
    assert.equal(paper.readingTimeMinutes, 15);
    assert.equal(paper.questions.length, 39);
    assert.equal(paper.sections.length, 5);
    assert.equal(paper.seed, seed);
    assert.ok(paper.compliance.excludedTopicViolations.length === 0);
  }
});

test('the real Social Science 087 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedSocialScienceBank();
  for (const seed of SEEDS) {
    const paper = assemblePaper({ subjectSlug: 'social-science', seed, questions: bank });

    assert.equal(paper.totalMarks, 80);
    assert.equal(paper.durationMinutes, 180);
    assert.equal(paper.readingTimeMinutes, 15);
    assert.equal(paper.questions.length, 37);
    assert.equal(paper.sections.length, 6);
    assert.equal(paper.seed, seed);
    assert.ok(paper.compliance.excludedTopicViolations.length === 0);
  }
});

test('the real Maths 241 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedMathsBasicBank();
  for (const seed of SEEDS) {
    const paper = assemblePaper({ subjectSlug: 'mathematics-basic', seed, questions: bank });

    assert.equal(paper.totalMarks, 80);
    assert.equal(paper.durationMinutes, 180);
    assert.equal(paper.readingTimeMinutes, 15);
    assert.equal(paper.questions.length, 38);
    assert.equal(paper.sections.length, 5);
    assert.equal(paper.seed, seed);
    assert.ok(paper.compliance.excludedTopicViolations.length === 0);
  }
});

test('the real English 184 seed assembles a valid paper for seeds 1..50', () => {
  const bank = verifiedEnglishBank();
  for (const seed of SEEDS) {
    const paper = assemblePaper({ subjectSlug: 'english-language-and-literature', seed, questions: bank });

    assert.equal(paper.totalMarks, 80);
    assert.equal(paper.durationMinutes, 180);
    assert.equal(paper.readingTimeMinutes, 15);
    assert.equal(paper.questions.length, 34);
    assert.equal(paper.sections.length, 5);
    assert.equal(paper.seed, seed);
    assert.ok(paper.compliance.excludedTopicViolations.length === 0);
  }
});

test('every section matches the official layout exactly for Maths, Science, Social Science, and English', () => {
  const mathsPaper = assemblePaper({
    subjectSlug: 'mathematics-standard',
    seed: 7,
    questions: verifiedMathsBank(),
  });

  for (const section of MATHS_041_LAYOUT.sections) {
    const sectionQuestions = mathsPaper.questions.filter(
      (question) => question.sectionId === section.id,
    );
    assert.equal(
      sectionQuestions.length,
      section.questionCount,
      `Maths Section ${section.id} question count`,
    );
    const sectionMarks = sectionQuestions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );
    assert.equal(
      sectionMarks,
      section.questionCount * section.marksPerQuestion,
      `Maths Section ${section.id} marks`,
    );
  }

  const sciencePaper = assemblePaper({
    subjectSlug: 'science',
    seed: 7,
    questions: verifiedScienceBank(),
  });

  for (const section of SCIENCE_086_LAYOUT.sections) {
    const sectionQuestions = sciencePaper.questions.filter(
      (question) => question.sectionId === section.id,
    );
    assert.equal(
      sectionQuestions.length,
      section.questionCount,
      `Science Section ${section.id} question count`,
    );
    const sectionMarks = sectionQuestions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );
    assert.equal(
      sectionMarks,
      section.questionCount * section.marksPerQuestion,
      `Science Section ${section.id} marks`,
    );
  }

  const sstPaper = assemblePaper({
    subjectSlug: 'social-science',
    seed: 7,
    questions: verifiedSocialScienceBank(),
  });

  for (const section of SOCIAL_SCIENCE_087_LAYOUT.sections) {
    const sectionQuestions = sstPaper.questions.filter(
      (question) => question.sectionId === section.id,
    );
    assert.equal(
      sectionQuestions.length,
      section.questionCount,
      `Social Science Section ${section.id} question count`,
    );
    const sectionMarks = sectionQuestions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );
    assert.equal(
      sectionMarks,
      section.questionCount * section.marksPerQuestion,
      `Social Science Section ${section.id} marks`,
    );
  }

  const engPaper = assemblePaper({
    subjectSlug: 'english-language-and-literature',
    seed: 7,
    questions: verifiedEnglishBank(),
  });

  for (const section of ENGLISH_184_LAYOUT.sections) {
    const sectionQuestions = engPaper.questions.filter(
      (question) => question.sectionId === section.id,
    );
    assert.equal(
      sectionQuestions.length,
      section.questionCount,
      `English Section ${section.id} question count`,
    );
    const sectionMarks = sectionQuestions.reduce(
      (sum, question) => sum + question.marks,
      0,
    );
    assert.equal(
      sectionMarks,
      section.questionCount * section.marksPerQuestion,
      `English Section ${section.id} marks`,
    );
  }
});

test('every unit achieves its exact official weightage for Maths, Science, Social Science, and English', () => {
  const mathsPaper = assemblePaper({
    subjectSlug: 'mathematics-standard',
    seed: 13,
    questions: verifiedMathsBank(),
  });
  const mathsUnits = getBoardUnits('mathematics-standard');
  for (const report of mathsPaper.compliance.unitMarks) {
    const unit = mathsUnits.find((candidate) => candidate.id === report.unitId);
    assert.ok(unit, `unknown maths unit ${report.unitId}`);
    assert.equal(report.achievedMarks, unit.marks);
  }

  const sstPaper = assemblePaper({
    subjectSlug: 'social-science',
    seed: 13,
    questions: verifiedSocialScienceBank(),
  });
  const sstUnits = getBoardUnits('social-science');
  for (const report of sstPaper.compliance.unitMarks) {
    const unit = sstUnits.find((candidate) => candidate.id === report.unitId);
    assert.ok(unit, `unknown sst unit ${report.unitId}`);
    assert.equal(report.achievedMarks, unit.marks);
  }

  const sciencePaper = assemblePaper({
    subjectSlug: 'science',
    seed: 13,
    questions: verifiedScienceBank(),
  });
  const scienceUnits = getBoardUnits('science');
  for (const report of sciencePaper.compliance.unitMarks) {
    const unit = scienceUnits.find((candidate) => candidate.id === report.unitId);
    assert.ok(unit, `unknown science unit ${report.unitId}`);
    assert.equal(report.achievedMarks, unit.marks);
  }

  const engPaper = assemblePaper({
    subjectSlug: 'english-language-and-literature',
    seed: 13,
    questions: verifiedEnglishBank(),
  });
  const engUnits = getBoardUnits('english-language-and-literature');
  for (const report of engPaper.compliance.unitMarks) {
    const unit = engUnits.find((candidate) => candidate.id === report.unitId);
    assert.ok(unit, `unknown english unit ${report.unitId}`);
    assert.equal(report.achievedMarks, unit.marks);
  }
});

test('excluded topics never appear and question numbers are sequential', () => {
  const mathsExcluded = new Set(getExcludedTopicIds('mathematics-standard'));
  const scienceExcluded = new Set(getExcludedTopicIds('science'));

  for (const seed of [1, 2, 3]) {
    const mathsPaper = assemblePaper({
      subjectSlug: 'mathematics-standard',
      seed,
      questions: verifiedMathsBank(),
    });
    for (const question of mathsPaper.questions) {
      assert.ok(!mathsExcluded.has(question.topicId));
    }
    assert.deepEqual(
      mathsPaper.questions.map((question) => question.questionNumber),
      Array.from({ length: 38 }, (_, index) => index + 1),
    );

    const sciencePaper = assemblePaper({
      subjectSlug: 'science',
      seed,
      questions: verifiedScienceBank(),
    });
    for (const question of sciencePaper.questions) {
      assert.ok(!scienceExcluded.has(question.topicId));
    }
    assert.deepEqual(
      sciencePaper.questions.map((question) => question.questionNumber),
      Array.from({ length: 39 }, (_, index) => index + 1),
    );
  }
});

test('the same seed reproduces the identical paper', () => {
  const bank = verifiedMathsBank();
  const first = assemblePaper({ subjectSlug: 'mathematics-standard', seed: 42, questions: bank });
  const second = assemblePaper({ subjectSlug: 'mathematics-standard', seed: 42, questions: bank });
  assert.deepEqual(first.questions, second.questions);
  assert.deepEqual(first.compliance, second.compliance);
});

test('different seeds produce different papers', () => {
  const bank = verifiedMathsBank();
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
      questions: verifiedMathsBank(),
    });
    const bankKeys = paper.questions.map((question) => question.bankKey);
    assert.equal(new Set(bankKeys).size, bankKeys.length);
  }
});

test('layout totals are internally consistent', () => {
  const mathsLayoutTotal = MATHS_041_LAYOUT.sections.reduce(
    (sum, section) => sum + section.questionCount * section.marksPerQuestion,
    0,
  );
  assert.equal(mathsLayoutTotal, MATHS_041_LAYOUT.totalMarks);

  const scienceLayoutTotal = SCIENCE_086_LAYOUT.sections.reduce(
    (sum, section) => sum + section.questionCount * section.marksPerQuestion,
    0,
  );
  assert.equal(scienceLayoutTotal, SCIENCE_086_LAYOUT.totalMarks);
});

