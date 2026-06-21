import assert from 'node:assert/strict';
import test from 'node:test';

import { buildMasteryRewards } from './mastery-rewards';

const badge = {
  awardedAt: '2026-06-21T10:00:00.000Z',
  chapterSlug: 'real-numbers',
  chapterTitle: 'Real Numbers',
  code: 'topic_mastery',
  description: 'Mastered a weak topic.',
  name: 'Topic Mastery',
};

test('buildMasteryRewards unlocks personal rewards from mastery thresholds', () => {
  const rewards = buildMasteryRewards({
    badges: [badge],
    chapterSlug: 'real-numbers',
    masteryScore: 72,
  });

  assert.deepEqual(
    rewards.map((reward) => ({
      isNext: reward.isNext,
      level: reward.level,
      state: reward.state,
      threshold: reward.threshold,
    })),
    [
      { isNext: false, level: 'learner', state: 'unlocked', threshold: 0 },
      { isNext: false, level: 'skilled', state: 'unlocked', threshold: 40 },
      { isNext: false, level: 'exam_ready', state: 'unlocked', threshold: 70 },
      { isNext: true, level: 'topper_track', state: 'locked', threshold: 90 },
    ],
  );
  assert.equal(rewards[2].badgeCount, 1);
  assert.equal(rewards[3].progressLabel, '18% to unlock');
});

test('buildMasteryRewards counts all badges for dashboard-wide rewards', () => {
  const rewards = buildMasteryRewards({
    badges: [badge, { ...badge, chapterSlug: 'chemical-reactions-and-equations', code: 'score_improvement' }],
    masteryScore: 38,
  });

  assert.equal(rewards[0].badgeCount, 2);
  assert.equal(rewards[1].isNext, true);
  assert.equal(rewards[1].progressLabel, '2% to unlock');
});
