import assert from 'node:assert/strict';
import test from 'node:test';

import { assemblePaper } from './assembler.js';
import { MATHS_041_SEED } from './seed/maths-041-seed.js';
import {
  callGemini,
  GeminiApiError,
  GeminiNotConfiguredError,
  parsePaperVerificationResult,
  verifyBankQuestion,
  verifyPaper,
} from './verify.js';
import type { PaperVerificationResult } from './types.js';

function samplePaper() {
  return assemblePaper({
    subjectSlug: 'mathematics-standard',
    seed: 7,
    questions: MATHS_041_SEED.map((question) => ({
      ...question,
      verificationStatus: 'verified' as const,
    })),
  });
}

function fetchWithText(text: string): typeof fetch {
  return (async () =>
    ({
      ok: true,
      json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }),
    }) as unknown as Response) as unknown as typeof fetch;
}

const NO_KEY_CONFIG = { apiKey: null, model: 'gemini-1.5-flash', requestTimeoutMs: 1000 };

test('verifyPaper without a Gemini key returns unverified (manual review path)', async () => {
  const outcome = await verifyPaper(samplePaper(), { config: NO_KEY_CONFIG });
  assert.equal(outcome.status, 'unverified');
  assert.equal(outcome.result, null);
  assert.match(outcome.note, /Automated verification is not configured/);
});

test('callGemini sends the prompt and returns the model text via injected fetch', async () => {
  const fetchImpl = fetchWithText('{"paperVerdict":"pass"}');
  const text = await callGemini('hello', {
    config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
    fetchImpl,
  });
  assert.equal(text, '{"paperVerdict":"pass"}');
});

test('callGemini throws GeminiApiError on a non-ok response', async () => {
  const fetchImpl = (async () =>
    ({ ok: false, status: 429, json: async () => ({}) }) as unknown as Response) as unknown as typeof fetch;
  await assert.rejects(
    callGemini('hello', {
      config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
      fetchImpl,
    }),
    (error: unknown) => error instanceof GeminiApiError && /HTTP 429/.test(error.message),
  );
});

test('callGemini throws GeminiNotConfiguredError without a key', async () => {
  await assert.rejects(
    callGemini('hello', { config: NO_KEY_CONFIG }),
    (error: unknown) => error instanceof GeminiNotConfiguredError,
  );
});

test('parsePaperVerificationResult clamps verdicts and defaults missing questions', () => {
  const raw = JSON.stringify({
    paperVerdict: 'bogus',
    paperReasons: ['ok', 42, ''],
    blueprintCompliance: {
      totalMarksMatch: false,
      sectionMarksMatch: true,
      coverageNotes: ['note'],
    },
    questions: [
      { questionNumber: 1, verdict: 'pass', reasons: [] },
      { questionNumber: 3, verdict: 'fail', reasons: ['wrong answer'] },
    ],
  });

  const result: PaperVerificationResult = parsePaperVerificationResult(raw, 4);
  assert.equal(result.paperVerdict, 'flag');
  assert.deepEqual(result.paperReasons, ['ok']);
  assert.equal(result.blueprintCompliance.totalMarksMatch, false);
  assert.deepEqual(result.questions.map((q) => q.verdict), ['pass', 'pass', 'fail', 'pass']);
  assert.deepEqual(result.questions[2]?.reasons, ['wrong answer']);
});

test('parsePaperVerificationResult rejects invalid JSON', () => {
  assert.throws(
    () => parsePaperVerificationResult('not-json', 2),
    (error: unknown) => error instanceof GeminiApiError,
  );
});

test('verifyPaper marks a clean AI pass as verified', async () => {
  const paper = samplePaper();
  const passJson = JSON.stringify({
    paperVerdict: 'pass',
    paperReasons: [],
    blueprintCompliance: { totalMarksMatch: true, sectionMarksMatch: true, coverageNotes: [] },
    questions: paper.questions.map((question) => ({
      questionNumber: question.questionNumber,
      verdict: 'pass',
      reasons: [],
    })),
  });

  const outcome = await verifyPaper(paper, {
    config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
    fetchImpl: fetchWithText(passJson),
  });

  assert.equal(outcome.status, 'verified');
  assert.equal(outcome.result?.paperVerdict, 'pass');
  assert.equal(outcome.result?.questions.length, 38);
});

test('verifyPaper returns review when AI verdict is flag or fail', async () => {
  const paper = samplePaper();
  const flagJson = JSON.stringify({
    paperVerdict: 'flag',
    paperReasons: ['clarify units'],
    blueprintCompliance: { totalMarksMatch: true, sectionMarksMatch: true, coverageNotes: [] },
    questions: paper.questions.map((question) => ({
      questionNumber: question.questionNumber,
      verdict: 'pass',
      reasons: [],
    })),
  });

  const outcome = await verifyPaper(paper, {
    config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
    fetchImpl: fetchWithText(flagJson),
  });

  assert.equal(outcome.status, 'review');
  assert.equal(outcome.result?.paperVerdict, 'flag');
});

test('verifyPaper falls back to review when every attempt fails', async () => {
  const failingFetch = (async () => {
    throw new Error('network down');
  }) as unknown as typeof fetch;

  const outcome = await verifyPaper(samplePaper(), {
    config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
    fetchImpl: failingFetch,
    maxAttempts: 2,
  });

  assert.equal(outcome.status, 'review');
  assert.equal(outcome.result, null);
  assert.match(outcome.note, /failed after 2 attempts/);
});

test('verifyBankQuestion without a key returns unverified', async () => {
  const question = MATHS_041_SEED[0];
  assert.ok(question);
  const outcome = await verifyBankQuestion(question, { config: NO_KEY_CONFIG });
  assert.equal(outcome.status, 'unverified');
});

test('verifyBankQuestion uses the injected fetch verdict', async () => {
  const question = MATHS_041_SEED[0];
  assert.ok(question);
  const outcome = await verifyBankQuestion(question, {
    config: { apiKey: 'test-key', model: 'gemini-1.5-flash', requestTimeoutMs: 1000 },
    fetchImpl: fetchWithText(
      JSON.stringify({
        verdict: 'pass',
        reasons: [],
        variants: question.variants.map((variant) => ({
          variantKey: variant.variantKey,
          verdict: 'pass',
          reasons: [],
        })),
      }),
    ),
  });
  assert.equal(outcome.status, 'verified');
  assert.equal(outcome.verdict, 'pass');
});
