import type { SessionUser } from './auth';
import { getChapter } from './course-content';
import {
  buildCoreSubjectProgress,
  describeReadiness,
  formatRelativeDay,
  getDaysToBoardExams,
  READINESS_MIN_SIGNALS,
} from './dashboard-home';
import type { ExamPaperAttemptsResponse } from './exam-papers';
import type { MasteryPayload } from './mastery';
import type { MistakesPayload } from './mistakes';

export type ParentSummaryModel = {
  studentName: string;
  firstName: string;
  classLevel: number;
  daysToExams: number;
  streakDays: number;
  consistencyHeadline: string;
  consistencySub: string;
  readinessLabel: string;

  stats: {
    streakLabel: string;
    startedChapters: number;
    totalChapters: number;
    coveragePercent: number;
    quizAccuracy: number | null;
    quizzesTaken: number;
    mockAttempts: number;
    mockAveragePercent: number | null;
    dueMistakesCount: number;
  };

  recentActivity: Array<{
    chapterSlug: string;
    chapterTitle: string;
    subjectName: string;
    bestQuizScorePercent: number;
    masteryScore: number;
    relativeTime: string;
  }>;

  areasNeedingSupport: Array<{
    subjectName: string;
    chapterTitle: string;
    chapterSlug: string;
    reason: string;
  }>;

  subjectBreakdown: Array<{
    slug: string;
    title: string;
    startedCount: number;
    chapterCount: number;
    progressPercent: number;
  }>;

  guidanceTips: Array<{
    title: string;
    tip: string;
  }>;

  whatsappShareText: string;
};

export type BuildParentSummaryOptions = {
  session: SessionUser;
  mastery: MasteryPayload;
  attemptsData?: ExamPaperAttemptsResponse | null;
  mistakesData?: MistakesPayload | null;
  targetExamDate?: string;
};

export function buildParentSummaryModel({
  session,
  mastery,
  attemptsData,
  mistakesData,
  targetExamDate,
}: BuildParentSummaryOptions): ParentSummaryModel {
  const studentName = session.fullName || 'Student';
  const firstName = studentName.split(/\s+/)[0] || 'your child';
  const classLevel = session.classLevel || 10;
  const daysToExams = getDaysToBoardExams(targetExamDate);
  const streakDays = mastery.streak?.currentStreakDays ?? 0;

  const subjectProgress = buildCoreSubjectProgress(mastery.masteries);
  const totalChapters = subjectProgress.reduce((sum, s) => sum + s.chapterCount, 0);
  const startedChapters = subjectProgress.reduce((sum, s) => sum + s.startedCount, 0);
  const coveragePercent = totalChapters > 0 ? Math.round((startedChapters / totalChapters) * 100) : 0;

  const chaptersWithScore = (mastery.masteries ?? []).filter((m) => m.bestQuizScorePercent > 0);
  const quizzesTaken = chaptersWithScore.length;
  const quizAccuracy = quizzesTaken
    ? Math.round(
        chaptersWithScore.reduce((sum, m) => sum + m.bestQuizScorePercent, 0) / quizzesTaken,
      )
    : null;

  const mockAttempts = attemptsData?.attempts?.length ?? 0;
  const mockAveragePercent = attemptsData?.aggregate?.averagePercent ?? null;

  // Due mistakes count
  const dueMistakesCount =
    mistakesData?.items?.filter((item) => item.due).length ??
    mistakesData?.items?.length ??
    0;

  // Board readiness evaluation
  const mockAvg = mockAveragePercent;
  const quizAvg = quizAccuracy;
  const hasEnoughSignals = quizzesTaken + mockAttempts >= READINESS_MIN_SIGNALS;
  const readinessScore =
    quizAvg !== null && mockAvg !== null
      ? Math.round(quizAvg * 0.4 + mockAvg * 0.4 + coveragePercent * 0.2)
      : quizAvg !== null
        ? Math.round(quizAvg * 0.65 + coveragePercent * 0.35)
        : mockAvg !== null
          ? Math.round(mockAvg * 0.8 + coveragePercent * 0.2)
          : 0;

  const readinessLabel = hasEnoughSignals
    ? describeReadiness(readinessScore)
    : 'Building early study baseline';

  // Consistency headline
  let consistencyHeadline = `${firstName} has just started preparing`;
  let consistencySub = `A short 20-minute daily session builds strong habits before board exams.`;

  if (streakDays >= 7) {
    consistencyHeadline = `${firstName} is on an exceptional ${streakDays}-day study streak!`;
    consistencySub = `Outstanding daily commitment. Consistent effort is the #1 predictor of 90%+ scores.`;
  } else if (streakDays >= 3) {
    consistencyHeadline = `${firstName} is building steady momentum with a ${streakDays}-day streak.`;
    consistencySub = `Studying every day helps concepts stay fresh without cramming.`;
  } else if (startedChapters > 0) {
    consistencyHeadline = `${firstName} has started ${startedChapters} ${startedChapters === 1 ? 'chapter' : 'chapters'} so far.`;
    consistencySub = `Encourage a daily study habit to keep the momentum going.`;
  }

  // Recent activity (most recent first)
  const recentActivity = (mastery.masteries ?? [])
    .filter((m) => m.lastActivityAt && getChapter(m.chapterSlug))
    .sort((a, b) => Date.parse(b.lastActivityAt ?? '') - Date.parse(a.lastActivityAt ?? ''))
    .slice(0, 5)
    .map((m) => ({
      chapterSlug: m.chapterSlug,
      chapterTitle: m.chapterTitle,
      subjectName: m.subjectName,
      bestQuizScorePercent: m.bestQuizScorePercent,
      masteryScore: Math.round(m.masteryScore),
      relativeTime: formatRelativeDay(m.lastActivityAt),
    }));

  // Areas needing support
  const areasNeedingSupport: Array<{
    subjectName: string;
    chapterTitle: string;
    chapterSlug: string;
    reason: string;
  }> = [];

  for (const mission of mastery.revisionMissions ?? []) {
    if (mission.status !== 'active') continue;
    const ch = getChapter(mission.chapterSlug);
    if (!ch) continue;
    areasNeedingSupport.push({
      subjectName: mission.subjectName,
      chapterTitle: mission.chapterTitle,
      chapterSlug: mission.chapterSlug,
      reason: mission.reason || 'Needs targeted revision before board exam',
    });
  }

  for (const slug of attemptsData?.weakAreas?.weakChapterSlugs ?? []) {
    const ch = getChapter(slug);
    if (!ch || areasNeedingSupport.some((a) => a.chapterSlug === slug)) continue;
    areasNeedingSupport.push({
      subjectName: ch.subject,
      chapterTitle: ch.title,
      chapterSlug: slug,
      reason: 'Marks lost on questions in recent practice exam paper',
    });
  }

  // Guidance tips for parents
  const guidanceTips = [
    {
      title: 'Support a fixed 20-30 min study window',
      tip: `For Class 10, short daily sessions beat long weekend cramming. Help ${firstName} protect 25 distraction-free minutes every evening.`,
    },
    {
      title: 'Celebrate questions gotten wrong',
      tip: `Mistakes in quizzes are free learning opportunities. When ${firstName} reviews their mistake vault, those marks are saved on the final board paper.`,
    },
    {
      title: 'Prioritize sleep during exam prep',
      tip: `8 hours of restorative sleep directly improves memory consolidation for science formulas and maths proofs.`,
    },
  ];

  // WhatsApp share summary message
  const shareLines = [
    `📊 *ChapterReady Class 10 Progress Update for ${firstName}*`,
    ``,
    `📅 *Exam Countdown:* ~${daysToExams} days to CBSE Board Exams`,
    `🔥 *Habit Streak:* ${streakDays > 0 ? `${streakDays} days in a row` : 'Day 1'}`,
    `📖 *Syllabus Progress:* ${startedChapters}/${totalChapters} Chapters started (${coveragePercent}%)`,
    quizAccuracy !== null ? `🎯 *Quiz Accuracy:* ${quizAccuracy}% average` : null,
    mockAttempts > 0 ? `📝 *Mock Papers:* ${mockAttempts} completed (${mockAveragePercent}% avg)` : null,
    `🚦 *Current Status:* ${readinessLabel}`,
    areasNeedingSupport.length > 0
      ? `\n⚠️ *Top Area for Focus:* ${areasNeedingSupport[0].chapterTitle} (${areasNeedingSupport[0].subjectName})`
      : null,
    ``,
    `_Tracked with ChapterReady.in — Simplified NCERT Learning_`,
  ].filter(Boolean);

  const whatsappShareText = encodeURIComponent(shareLines.join('\n'));

  return {
    studentName,
    firstName,
    classLevel,
    daysToExams,
    streakDays,
    consistencyHeadline,
    consistencySub,
    readinessLabel,
    stats: {
      streakLabel: streakDays > 0 ? `${streakDays}-day streak` : 'Day 1',
      startedChapters,
      totalChapters,
      coveragePercent,
      quizAccuracy,
      quizzesTaken,
      mockAttempts,
      mockAveragePercent,
      dueMistakesCount,
    },
    recentActivity,
    areasNeedingSupport: areasNeedingSupport.slice(0, 4),
    subjectBreakdown: subjectProgress,
    guidanceTips,
    whatsappShareText,
  };
}
