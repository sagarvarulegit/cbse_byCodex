import assert from 'node:assert/strict';
import test from 'node:test';

import { buildQuizRecoveryMessage, getWeakTopicLabels } from './quiz-recovery';

test('getWeakTopicLabels maps missed topic slugs to readable labels', () => {
  assert.deepEqual(
    getWeakTopicLabels(['euclid-division-lemma', 'missing-topic'], [
      { label: "Euclid's division lemma", slug: 'euclid-division-lemma' },
      { label: 'HCF and LCM', slug: 'hcf-lcm' },
    ]),
    ["Euclid's division lemma", 'missing-topic'],
  );
});

test('buildQuizRecoveryMessage explains created and completed mission states', () => {
  assert.equal(
    buildQuizRecoveryMessage({
      masteryScore: 42,
      revisionMission: {
        recommendedSteps: ["Open the notes for Euclid's Division Lemma."],
        state: 'created',
        targetScore: 60,
      },
    }),
    "Submitted and saved. Mastery score is 42%. Recovery mission started: open the notes for Euclid's Division Lemma, then retry for 60% or more.",
  );

  assert.equal(
    buildQuizRecoveryMessage({
      masteryScore: 72,
      revisionMission: {
        recommendedSteps: [],
        state: 'completed',
        targetScore: 60,
      },
    }),
    'Submitted and saved. Mastery score is 72%. Recovery mission completed. Next target: Reach Topper Track at 90%.',
  );
});
