import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildEvaluationPrompt,
  evaluateAnswerHeuristically,
  gradeWrittenAnswer,
  type EvaluateAnswerRequest,
} from './grade-answer.js';

const SAMPLE_QUESTION: EvaluateAnswerRequest = {
  questionId: 'test-q-1',
  questionStem: 'Why is respiration considered an exothermic reaction? Write balanced chemical equation.',
  maxMarks: 3,
  officialValuePoints: [
    '[+1.0 Mark] Respiration involves breakdown of glucose in presence of oxygen to release energy in the form of ATP.',
    '[+1.0 Mark] Energy is released during the reaction, hence it is an exothermic process.',
    '[+1.0 Mark] Balanced equation: C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy (ATP)',
  ],
  modelAnswer: 'During respiration, glucose combines with oxygen in the cells of our body and provides energy. As energy is released in this process, it is an exothermic reaction. C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP',
  studentAnswerText: 'During respiration glucose breaks down with oxygen to release energy in cells. Since energy is given out it is exothermic. C6H12O6 + 6O2 -> 6CO2 + 6H2O + Energy.',
};

test('buildEvaluationPrompt includes question stem, value points, and max marks', () => {
  const prompt = buildEvaluationPrompt(SAMPLE_QUESTION);
  assert.ok(prompt.includes(SAMPLE_QUESTION.questionStem));
  assert.ok(prompt.includes('3 MARKS'));
  assert.ok(prompt.includes('C6H12O6'));
  assert.ok(prompt.includes('OFFICIAL CBSE MARKING SCHEME VALUE POINTS'));
});

test('evaluateAnswerHeuristically awards marks based on keyword coverage', () => {
  const result = evaluateAnswerHeuristically(SAMPLE_QUESTION);
  assert.ok(result.marksAwarded >= 2.0);
  assert.equal(result.maxMarks, 3);
  assert.equal(result.stepEvaluations.length, 3);
  assert.equal(result.isAiGrounded, false);
  assert.ok(result.topperWritingTips.length > 0);
});

test('evaluateAnswerHeuristically gives 0 for empty or irrelevant answer', () => {
  const result = evaluateAnswerHeuristically({
    ...SAMPLE_QUESTION,
    studentAnswerText: 'I do not know the answer.',
  });
  assert.equal(result.marksAwarded, 0);
  assert.equal(result.percentageScore, 0);
});

test('gradeWrittenAnswer parses Gemini response and returns structured evaluation', async () => {
  const mockAiOutput = {
    marksAwarded: 2.5,
    maxMarks: 3,
    stepEvaluations: [
      {
        stepIndex: 1,
        pointDescription: 'Breakdown of glucose with oxygen releasing energy',
        allocatedMarks: 1.0,
        marksEarned: 1.0,
        feedback: 'Correctly explained breakdown of glucose with oxygen.',
        matchedKeywords: ['glucose', 'oxygen', 'energy'],
        missingKeywords: [],
      },
      {
        stepIndex: 2,
        pointDescription: 'Energy release makes it exothermic',
        allocatedMarks: 1.0,
        marksEarned: 1.0,
        feedback: 'Clearly linked energy release to exothermic reaction.',
        matchedKeywords: ['exothermic', 'energy'],
        missingKeywords: [],
      },
      {
        stepIndex: 3,
        pointDescription: 'Balanced equation with ATP',
        allocatedMarks: 1.0,
        marksEarned: 0.5,
        feedback: 'Equation provided but missing state symbols (aq/g).',
        matchedKeywords: ['c6h12o6', 'co2', 'h2o'],
        missingKeywords: ['state symbols'],
      },
    ],
    deductions: [],
    topperWritingTips: [
      'Write the complete word equation followed by the molecular balanced equation.',
      'Always mention that energy is stored specifically as ATP in mitochondria.',
    ],
    overallFeedback: 'Very strong answer with nearly full marks. Add state symbols to equations for perfect 3/3.',
    examinerSummary: 'Score: 2.5 / 3.0',
  };

  const fakeFetch: typeof fetch = async () =>
    new Response(
      JSON.stringify({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(mockAiOutput) }],
            },
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );

  const prevKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'fake-test-key';

  try {
    const result = await gradeWrittenAnswer(SAMPLE_QUESTION, fakeFetch);
    assert.equal(result.marksAwarded, 2.5);
    assert.equal(result.maxMarks, 3);
    assert.equal(result.percentageScore, 83);
    assert.equal(result.stepEvaluations.length, 3);
    assert.equal(result.stepEvaluations[0].marksEarned, 1.0);
    assert.equal(result.isAiGrounded, true);
    assert.ok(result.topperWritingTips.length === 2);
  } finally {
    process.env.GEMINI_API_KEY = prevKey;
  }
});
