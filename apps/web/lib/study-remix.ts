import type { SessionUser } from './auth';
import {
  formatMasteryLevel,
  type MasteryPayload,
  type RevisionMissionSummary,
} from './mastery';
import { getPilotChapterCards } from './pilot';
import type {
  StudyRemixAccent,
  StudyRemixChapterSlug,
  StudyRemixDashboardModel,
  StudyRemixMix,
  StudyRemixTrack,
} from './study-remix-types';

type StudyRemixBlueprint = {
  accent: StudyRemixAccent;
  chapterCode: string;
  coverTitle: string;
  cue: {
    copy: string;
    href: string;
    title: string;
  };
  nextBreakLabel: string;
  recordCode: string;
  subjectLabel: string;
  tracks: StudyRemixTrack[];
};

const STUDY_REMIX_BLUEPRINTS: Record<StudyRemixChapterSlug, StudyRemixBlueprint> = {
  'chemical-reactions-and-equations': {
    accent: 'science',
    chapterCode: 'S01 · CLASS 10',
    coverTitle: 'Chemical Reactions',
    cue: {
      copy: 'Your smallest fix with the biggest mark payoff.',
      href: '/chapters/chemical-reactions-and-equations/notes#lesson-balancing-equations',
      title: 'Rewind cue · balancing equations',
    },
    nextBreakLabel: 'Next natural break · 18 min',
    recordCode: 'SCI · 01',
    subjectLabel: 'Science set · Chapter 1',
    tracks: [
      {
        durationMinutes: 18,
        href: '/chapters/chemical-reactions-and-equations/notes#lesson-combination-and-decomposition-reactions',
        id: 'science-reaction-types',
        subtitle: 'Learn · textbook stop 1.2',
        title: 'Types of Chemical Reactions',
      },
      {
        durationMinutes: 15,
        href: '/chapters/chemical-reactions-and-equations/notes#lesson-balancing-equations',
        id: 'science-balance-equations',
        subtitle: 'Practice · independent',
        title: 'Balance four equations',
      },
      {
        durationMinutes: 12,
        href: '/chapters/chemical-reactions-and-equations/quiz',
        id: 'science-recall-check',
        subtitle: 'Recall · lock it in',
        title: 'Five-question quiz',
      },
    ],
  },
  'real-numbers': {
    accent: 'math',
    chapterCode: 'M01 · CLASS 10',
    coverTitle: 'Real Numbers',
    cue: {
      copy: 'Protect accuracy with one board-style mixed drill.',
      href: '/chapters/real-numbers/notes#lesson-hcf-and-lcm-by-prime-factorisation',
      title: 'Replay cue · mixed HCF and LCM',
    },
    nextBreakLabel: 'Maintenance break · 12 min',
    recordCode: 'MTH · 01',
    subjectLabel: 'Mathematics set · Chapter 1',
    tracks: [
      {
        durationMinutes: 12,
        href: '/chapters/real-numbers/notes#lesson-euclid-division-lemma',
        id: 'math-euclid-rebuild',
        subtitle: 'Recall · one worked example',
        title: 'Rebuild Euclid’s method',
      },
      {
        durationMinutes: 21,
        href: '/chapters/real-numbers/notes#lesson-hcf-and-lcm-by-prime-factorisation',
        id: 'math-hcf-lcm',
        subtitle: 'Practice · three problems',
        title: 'Mixed HCF and LCM',
      },
      {
        durationMinutes: 12,
        href: '/chapters/real-numbers/notes#lesson-decimal-expansion-of-rational-numbers',
        id: 'math-decimal-check',
        subtitle: 'Speed round · classify',
        title: 'Decimal expansion check',
      },
    ],
  },
  'two-stories-about-flying': {
    accent: 'english',
    chapterCode: 'E03 · CLASS 10',
    coverTitle: 'Stories about Flying',
    cue: {
      copy: 'Hunger changes fear into action; that detail anchors the answer.',
      href: '/chapters/two-stories-about-flying/notes#lesson-his-first-flight-courage-and-family-pressure',
      title: 'Replay cue · the seagull’s turning point',
    },
    nextBreakLabel: 'Story checkpoint · 15 min',
    recordCode: 'ENG · 03',
    subjectLabel: 'English set · First Flight 3',
    tracks: [
      {
        durationMinutes: 15,
        href: '/chapters/two-stories-about-flying/notes#lesson-his-first-flight-fear-and-hunger',
        id: 'english-read-first-flight',
        subtitle: 'Story · fear and hesitation',
        title: 'Read His First Flight',
      },
      {
        durationMinutes: 15,
        href: '/chapters/two-stories-about-flying/notes#lesson-his-first-flight-courage-and-family-pressure',
        id: 'english-turning-point',
        subtitle: 'Evidence · character change',
        title: 'Trace the turning point',
      },
      {
        durationMinutes: 15,
        href: '/chapters/two-stories-about-flying/notes#lesson-his-first-flight-courage-and-family-pressure',
        id: 'english-exam-answer',
        subtitle: 'Practice · theme and courage',
        title: 'Write one exam answer',
      },
    ],
  },
};

function isStudyRemixChapterSlug(slug: string): slug is StudyRemixChapterSlug {
  return slug in STUDY_REMIX_BLUEPRINTS;
}

function clampMasteryScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
}

function buildMissionCue(mission: RevisionMissionSummary, fallback: StudyRemixBlueprint['cue']) {
  if (mission.status !== 'active') {
    return {
      ...fallback,
      source: 'curated' as const,
    };
  }

  const recommendedAction = mission.recommendedActions?.[0];
  const recommendedStep =
    recommendedAction?.step ??
    mission.recommendedSteps[0] ??
    'Review the chapter notes, then retry the quiz.';

  return {
    copy: `${mission.reason} ${recommendedStep} Target: ${mission.targetScore}%.`,
    href: recommendedAction?.href ?? `/chapters/${mission.chapterSlug}/notes`,
    source: 'revision_mission' as const,
    title: 'Rewind cue · active revision mission',
  };
}

function getStudentInitials(fullName: string) {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) {
    return 'ST';
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
}

function getDefaultChapterSlug(mastery: MasteryPayload): StudyRemixChapterSlug {
  const mission = mastery.revisionMissions.find(
    (item) => item.status === 'active' && isStudyRemixChapterSlug(item.chapterSlug),
  );
  if (mission && isStudyRemixChapterSlug(mission.chapterSlug)) {
    return mission.chapterSlug;
  }

  const recentMastery = mastery.masteries
    .filter(
      (item) => isStudyRemixChapterSlug(item.chapterSlug) && Boolean(item.lastActivityAt),
    )
    .sort((left, right) =>
      (right.lastActivityAt ?? '').localeCompare(left.lastActivityAt ?? ''),
    )[0];

  if (recentMastery && isStudyRemixChapterSlug(recentMastery.chapterSlug)) {
    return recentMastery.chapterSlug;
  }

  return 'chemical-reactions-and-equations';
}

export function buildStudyRemixDashboardModel({
  mastery,
  session,
}: {
  mastery: MasteryPayload;
  session: SessionUser;
}): StudyRemixDashboardModel {
  const chapterMasteryBySlug = new Map(
    mastery.masteries.map((chapterMastery) => [
      chapterMastery.chapterSlug,
      chapterMastery,
    ]),
  );
  const activeMissionBySlug = new Map(
    mastery.revisionMissions
      .filter((mission) => mission.status === 'active')
      .map((mission) => [mission.chapterSlug, mission]),
  );

  const mixes = getPilotChapterCards()
    .map((chapter): StudyRemixMix => {
      const blueprint = STUDY_REMIX_BLUEPRINTS[chapter.slug];
      const chapterMastery = chapterMasteryBySlug.get(chapter.slug);
      const mission = activeMissionBySlug.get(chapter.slug);
      const masteryScore = chapterMastery
        ? clampMasteryScore(chapterMastery.masteryScore)
        : 0;

      return {
        accent: blueprint.accent,
        chapterCode: blueprint.chapterCode,
        chapterSlug: chapter.slug,
        chapterTitle: chapter.title,
        coverTitle: blueprint.coverTitle,
        cue: mission
          ? buildMissionCue(mission, blueprint.cue)
          : {
              ...blueprint.cue,
              source: 'curated',
            },
        masteryLabel: chapterMastery
          ? formatMasteryLevel(chapterMastery.level)
          : 'Not started',
        masteryScore,
        nextBreakLabel: blueprint.nextBreakLabel,
        recordCode: blueprint.recordCode,
        subject: chapter.subject,
        subjectLabel: blueprint.subjectLabel,
        totalMinutes: blueprint.tracks.reduce(
          (total, track) => total + track.durationMinutes,
          0,
        ),
        tracks: blueprint.tracks,
      };
    });

  const nameParts = session.fullName.trim().split(/\s+/).filter(Boolean);
  const currentStreakDays = mastery.streak?.currentStreakDays ?? 0;

  return {
    activeMissionCount: mastery.revisionMissions.filter(
      (mission) => mission.status === 'active',
    ).length,
    badgeCount: mastery.badges.length,
    defaultChapterSlug: getDefaultChapterSlug(mastery),
    mixes,
    student: {
      classLevel: session.classLevel,
      firstName: nameParts[0] ?? 'Student',
      fullName: session.fullName,
      id: session.id,
      initials: getStudentInitials(session.fullName),
      streakLabel:
        currentStreakDays > 0
          ? `${currentStreakDays} day${currentStreakDays === 1 ? '' : 's'} streak`
          : 'Start your streak',
    },
  };
}
