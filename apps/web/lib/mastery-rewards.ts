import { formatMasteryLevel, type BadgeSummary, type MasteryLevel } from './mastery';

type RewardDefinition = {
  actionLabel: string;
  description: string;
  level: MasteryLevel;
  rewardName: string;
  threshold: number;
};

export type MasteryReward = RewardDefinition & {
  badgeCount: number;
  isNext: boolean;
  progressLabel: string;
  state: 'locked' | 'unlocked';
};

const REWARD_DEFINITIONS: RewardDefinition[] = [
  {
    actionLabel: 'Open chapter notes',
    description: 'Use the chapter notes path and save real attempts when you practise.',
    level: 'learner',
    rewardName: 'Lesson path',
    threshold: 0,
  },
  {
    actionLabel: 'Review weak-topic notes',
    description: 'Use active revision missions to revisit the lesson area costing marks.',
    level: 'skilled',
    rewardName: 'Weak-topic recovery',
    threshold: 40,
  },
  {
    actionLabel: 'Retry after revision',
    description: 'Use saved quiz attempts to confirm the chapter is holding at exam level.',
    level: 'exam_ready',
    rewardName: 'Exam-ready check',
    threshold: 70,
  },
  {
    actionLabel: 'Push for 90%+',
    description: 'Treat 90% as a personal accuracy milestone, not a separate locked feature.',
    level: 'topper_track',
    rewardName: 'Topper-track milestone',
    threshold: 90,
  },
];

function countRelevantBadges(badges: BadgeSummary[], chapterSlug?: string) {
  if (!chapterSlug) {
    return badges.length;
  }

  return badges.filter((badge) => badge.chapterSlug === chapterSlug).length;
}

export function buildMasteryRewards(params: {
  badges: BadgeSummary[];
  chapterSlug?: string;
  masteryScore: number;
}): MasteryReward[] {
  const score = Math.max(0, Math.min(100, Math.round(Number(params.masteryScore) || 0)));
  const nextLockedReward = REWARD_DEFINITIONS.find((reward) => score < reward.threshold);
  const badgeCount = countRelevantBadges(params.badges, params.chapterSlug);

  return REWARD_DEFINITIONS.map((reward) => {
    const unlocked = score >= reward.threshold;
    const remaining = Math.max(0, reward.threshold - score);

    return {
      ...reward,
      badgeCount,
      isNext: nextLockedReward?.level === reward.level,
      progressLabel: unlocked ? `${formatMasteryLevel(reward.level)} reached` : `${remaining}% to next milestone`,
      state: unlocked ? 'unlocked' : 'locked',
    };
  });
}
