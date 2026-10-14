import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import DashboardNextStepHero from '../../components/DashboardNextStepHero';
import DashboardSubjectStations from '../../components/DashboardSubjectStations';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import QuickToolsLaunchpad from '../../components/QuickToolsLaunchpad';
import StudentTopbar from '../../components/StudentTopbar';
import WeakAreaDiagnosticsCard from '../../components/WeakAreaDiagnosticsCard';
import styles from '../../components/dashboard-home.module.css';
import { getStudentSessionToken, requireStudentSession } from '../../lib/auth';
import { getChapter } from '../../lib/course-content';
import {
  buildCoreSubjectProgress,
  calculateStudentRank,
  pickNextStep,
} from '../../lib/dashboard-home';
import { listExamPaperAttempts } from '../../lib/exam-papers';
import { getStudentMastery } from '../../lib/mastery';
import { getStudentMistakes } from '../../lib/mistakes';
import { fetchStudentEntitlements } from '../../lib/payments';

type WeakChapter = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  reason: string;
  href: string;
};

export default async function DashboardPage() {
  const [session, token, mastery] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
    getStudentMastery(),
  ]);

  const [attemptsData, entitlementsData, mistakesData] = await Promise.all([
    listExamPaperAttempts(token).catch(() => null),
    token ? fetchStudentEntitlements(token).catch(() => null) : null,
    getStudentMistakes('active').catch(() => null),
  ]);

  const firstName = session.fullName?.split(/\s+/)[0] || 'there';

  // Real student data & gamification
  const rank = calculateStudentRank(mastery);
  const nextStep = pickNextStep(mastery);
  const subjectProgress = buildCoreSubjectProgress(mastery.masteries);
  const activeMissions = mastery.revisionMissions.filter((m) => m.status === 'active');
  const streakDays = mastery.streak?.currentStreakDays ?? 0;

  const chaptersWithScore = mastery.masteries.filter((m) => m.bestQuizScorePercent > 0);
  const attemptCount = attemptsData?.attempts?.length ?? 0;

  // Readiness estimate over core subjects
  const totalCoreChapters = subjectProgress.reduce((sum, s) => sum + s.chapterCount, 0);
  const startedCoreChapters = subjectProgress.reduce((sum, s) => sum + s.startedCount, 0);
  const quizAvg = chaptersWithScore.length
    ? chaptersWithScore.reduce((sum, m) => sum + m.bestQuizScorePercent, 0) / chaptersWithScore.length
    : null;
  const mockAvg = attemptsData?.aggregate?.averagePercent ?? null;
  const coveragePct = totalCoreChapters ? (startedCoreChapters / totalCoreChapters) * 100 : 0;
  const readiness =
    quizAvg !== null && mockAvg !== null
      ? Math.round(quizAvg * 0.4 + mockAvg * 0.4 + coveragePct * 0.2)
      : quizAvg !== null
        ? Math.round(quizAvg * 0.65 + coveragePct * 0.35)
        : mockAvg !== null
          ? Math.round(mockAvg * 0.8 + coveragePct * 0.2)
          : 0;

  // Weak chapters identification
  const weakChapters: WeakChapter[] = [];
  for (const mission of activeMissions) {
    if (!getChapter(mission.chapterSlug)) continue;
    weakChapters.push({
      chapterSlug: mission.chapterSlug,
      chapterTitle: mission.chapterTitle,
      subjectName: mission.subjectName,
      reason: mission.reason,
      href: mission.recommendedActions?.[0]?.href ?? `/chapters/${mission.chapterSlug}`,
    });
  }
  for (const slug of attemptsData?.weakAreas?.weakChapterSlugs ?? []) {
    const chapter = getChapter(slug);
    if (!chapter || weakChapters.some((w) => w.chapterSlug === slug)) continue;
    weakChapters.push({
      chapterSlug: slug,
      chapterTitle: chapter.title,
      subjectName: chapter.subject,
      reason: 'Marks lost in a recent mock paper',
      href: `/chapters/${slug}`,
    });
  }

  // Active mistakes count from spaced-repetition vault
  const dueMistakesCount =
    mistakesData?.items?.filter((item) => item.due).length ??
    mistakesData?.items?.length ??
    0;

  // Mission progress for 1-line footer strip
  const missionProgress = {
    lessonRead: mastery.masteries.some((m) => m.masteryScore > 0 || m.lastActivityAt),
    quizTaken: chaptersWithScore.length > 0,
    mistakesReviewed: false,
  };

  return (
    <main className={styles.page}>
      <PilotEngagementTracker eventType="dashboard_view" surface="dashboard" />

      <StudentTopbar
        contextLabel="Study Studio"
        session={session}
        streakLabel={streakDays > 0 ? `${streakDays}-day streak` : 'Day 1 streak'}
      />

      <div className={styles.shell}>
        {/* Zone 0: Compact Header Bar (Greeting + Readiness Pill) */}
        <header className={styles.compactHeader}>
          <div className={styles.compactHeaderLeft}>
            <h1 className={styles.greetingTitle}>Hey {firstName}!</h1>
            <p className={styles.greetingSub}>
              <span>{streakDays > 0 ? `${streakDays}-day streak` : 'Day 1 streak'}</span>
              <span className={styles.subDot}>•</span>
              <span>
                {rank.totalXp} XP ({rank.rankTitle})
              </span>
            </p>
          </div>

          <div className={styles.compactHeaderRight}>
            <Link
              className={styles.readinessPillBadge}
              href="/readiness"
              title="View full CBSE Board Readiness details"
            >
              <span>🎯 Board Readiness: {readiness}%</span>
              <ArrowRight size={14} strokeWidth={2.4} />
            </Link>
          </div>
        </header>

        {/* Zone 1: Above-the-Fold 2-Column Bento (2fr 1fr) */}
        <div className={styles.bentoGrid}>
          {/* Left Column (2fr): Unified Primary Focus Card */}
          <div className={styles.bentoLeftCol}>
            <DashboardNextStepHero
              step={nextStep}
              missionProgress={missionProgress}
            />
          </div>

          {/* Right Column (1fr): Daily Recall Dock */}
          <div className={styles.bentoRightCol}>
            <WeakAreaDiagnosticsCard
              dueMistakesCount={dueMistakesCount}
              weakChapter={weakChapters[0] ?? null}
            />
          </div>
        </div>

        {/* Zone 2: Clean Subject Progress Grid */}
        <DashboardSubjectStations subjectProgress={subjectProgress} />

        {/* Zone 3: Single-Row Quick Tools Dock */}
        <QuickToolsLaunchpad />
      </div>
    </main>
  );
}
