type WeakTopicOption = {
  label: string;
  slug: string;
};

type QuizRecoveryMission = {
  mission?: {
    recommendedSteps?: string[];
    targetScore?: number;
  } | null;
  recommendedSteps?: string[];
  state?: 'created' | 'refreshed' | 'completed' | 'not_needed';
  targetScore?: number;
};

export function getWeakTopicLabels(weakTopicSlugs: string[], weakTopicOptions: WeakTopicOption[]) {
  const labelBySlug = new Map(weakTopicOptions.map((topic) => [topic.slug, topic.label]));

  return weakTopicSlugs.map((slug) => labelBySlug.get(slug) ?? slug);
}

function lowerFirst(value: string) {
  const trimmedValue = value.trim().replace(/[.?!]+$/, '');
  if (!trimmedValue) {
    return value;
  }

  return `${trimmedValue.slice(0, 1).toLowerCase()}${trimmedValue.slice(1)}`;
}

function getNextMasteryLabel(score: number) {
  if (score < 40) {
    return 'Reach Skilled at 40%';
  }

  if (score < 70) {
    return 'Reach Exam Ready at 70%';
  }

  if (score < 90) {
    return 'Reach Topper Track at 90%';
  }

  return 'Maintain Topper Track';
}

export function buildQuizRecoveryMessage(params: {
  masteryScore: number;
  revisionMission?: QuizRecoveryMission | null;
}) {
  const prefix = `Submitted and saved. Mastery score is ${params.masteryScore}%.`;
  const missionState = params.revisionMission?.state;

  if (missionState === 'created' || missionState === 'refreshed') {
    const step =
      params.revisionMission?.recommendedSteps?.[0] ??
      params.revisionMission?.mission?.recommendedSteps?.[0] ??
      'Review the weak topics from this attempt.';
    const targetScore = params.revisionMission?.targetScore ?? params.revisionMission?.mission?.targetScore ?? 60;
    const verb = missionState === 'created' ? 'started' : 'updated';

    return `${prefix} Recovery mission ${verb}: ${lowerFirst(step)}, then retry for ${targetScore}% or more.`;
  }

  if (missionState === 'completed') {
    return `${prefix} Recovery mission completed. Next target: ${getNextMasteryLabel(params.masteryScore)}.`;
  }

  return `${prefix} No revision mission was needed. Next target: ${getNextMasteryLabel(params.masteryScore)}.`;
}
