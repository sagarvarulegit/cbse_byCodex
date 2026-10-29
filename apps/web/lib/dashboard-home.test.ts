import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildCoreSubjectProgress,
  buildTodayPlan,
  describeReadiness,
  pickNextStep,
} from './dashboard-home';
import type { MasteryPayload } from './mastery';

const EMPTY_MASTERY: MasteryPayload = {
  badges: [],
  masteries: [],
  revisionMissions: [],
  streak: null,
};

test('pickNextStep and buildTodayPlan give a new student a 3-step starter plan with one button', () => {
  const step = pickNextStep(EMPTY_MASTERY);
  assert.equal(step.kind, 'start');

  const plan = buildTodayPlan(step, [], 0);
  assert.equal(plan.kind, 'start');
  assert.equal(plan.subjectName, 'Science');
  assert.equal(plan.chapterTitle, 'Chemical Reactions and Equations');
  assert.equal(plan.steps.length, 3);
  assert.deepEqual(
    plan.steps.map((s) => s.done),
    [false, false, false],
  );
  assert.equal(plan.cta.label, 'Start lesson');
  assert.equal(plan.cta.href, '/chapters/chemical-reactions-and-equations');
});

test('buildTodayPlan advances the single CTA through lesson → quiz → mistakes', () => {
  const masteries: MasteryPayload['masteries'] = [
    {
      chapterSlug: 'real-numbers',
      chapterTitle: 'Real Numbers',
      subjectName: 'Mathematics',
      bestQuizScorePercent: 0,
      masteryScore: 30,
      lastActivityAt: '2026-10-29T10:00:00.000Z',
      level: 'learner',
      videoCompletionPercent: 50,
    },
  ];
  const step = pickNextStep({ ...EMPTY_MASTERY, masteries });
  assert.equal(step.kind, 'continue');

  // Lesson started, quiz not taken yet → CTA points to the quiz
  const planBeforeQuiz = buildTodayPlan(step, masteries, 0);
  assert.deepEqual(
    planBeforeQuiz.steps.map((s) => s.done),
    [true, false, false],
  );
  assert.equal(planBeforeQuiz.cta.label, 'Take the quiz');
  assert.equal(planBeforeQuiz.cta.href, '/chapters/real-numbers/quiz');

  // Quiz taken, 2 mistakes due → CTA points to Fix my mistakes
  const afterQuiz = [{ ...masteries[0], bestQuizScorePercent: 70 }];
  const planWithMistakes = buildTodayPlan(step, afterQuiz, 2);
  assert.deepEqual(
    planWithMistakes.steps.map((s) => s.done),
    [true, true, false],
  );
  assert.equal(planWithMistakes.cta.label, 'Fix my mistakes');
  assert.equal(planWithMistakes.cta.href, '/my-mistakes');

  // All 3 steps done → CTA offers to keep going
  const planAllDone = buildTodayPlan(step, afterQuiz, 0);
  assert.deepEqual(
    planAllDone.steps.map((s) => s.done),
    [true, true, true],
  );
  assert.equal(planAllDone.cta.label, 'Keep going');
});

test('buildTodayPlan keeps all 3 steps uncompleted at the start of a revision mission', () => {
  const step = pickNextStep({
    ...EMPTY_MASTERY,
    revisionMissions: [
      {
        id: 'rev-1',
        chapterSlug: 'chemical-reactions-and-equations',
        chapterTitle: 'Chemical Reactions and Equations',
        subjectName: 'Science',
        reason: 'Missed redox questions',
        status: 'active',
        targetScore: 85,
        recommendedSteps: [],
      },
    ],
  });
  assert.equal(step.kind, 'revise');

  const plan = buildTodayPlan(step, [], 0);
  assert.deepEqual(
    plan.steps.map((s) => s.done),
    [false, false, false],
  );
  assert.equal(plan.cta.label, 'Start revision');
});

test('describeReadiness maps scores to plain words', () => {
  assert.equal(describeReadiness(0), 'Getting started');
  assert.equal(describeReadiness(39), 'Getting started');
  assert.equal(describeReadiness(40), 'Building up');
  assert.equal(describeReadiness(65), 'On track');
  assert.equal(describeReadiness(85), 'Exam ready');
});

test('buildCoreSubjectProgress returns all 5 core Class 10 subjects', () => {
  const progress = buildCoreSubjectProgress([]);
  assert.equal(progress.length, 5);
  assert.ok(progress.every((s) => s.chapterCount > 0 && s.startedCount === 0));
});
