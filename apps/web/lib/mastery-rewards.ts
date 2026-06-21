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
    actionLabel: 'Open chapter map',
    description: 'Start with a clean lesson path and keep every attempt saved for review.',
    level: 'learner',
    rewardName: 'Lesson map',
    threshold: 0,
  },
  {
    actionLabel: 'Recover weak topics',
    description: 'Unlock revision missions that point back to the topics costing marks.',
    level: 'skilled',
    rewardName: 'Weak-topic drill',
    threshold: 40,
  },
  {
    actionLabel: 'Review exam notes',
    description: 'Unlock a tighter board-style review loop once the chapter is exam ready.',
    level: 'exam_ready',
    rewardName: 'Exam review kit',
    threshold: 70,
  },
  {
    actionLabel: 'Push for 90%+',
    description: 'Unlock the topper-track challenge for polishing accuracy and speed.',
    level: 'topper_track',
    rewardName: 'Topper challenge',
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
      progressLabel: unlocked ? `${formatMasteryLevel(reward.level)} unlocked` : `${remaining}% to unlock`,
      state: unlocked ? 'unlocked' : 'locked',
    };
  });
}
