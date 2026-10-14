import Link from 'next/link';
import {
  Flame,
  Target,
  Package,
  FlaskConical,
  Calculator,
  Globe2,
  BookOpenCheck,
  Zap,
  Clock,
} from 'lucide-react';

import DashboardNextStepHero from '../../components/DashboardNextStepHero';
import DashboardPracticeHub from '../../components/DashboardPracticeHub';
import DashboardSidebarHud from '../../components/DashboardSidebarHud';
import DashboardSubjectStations from '../../components/DashboardSubjectStations';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import styles from '../../components/dashboard-home.module.css';
import remixStyles from '../../components/study-remix.module.css';
import { getStudentSessionToken, requireStudentSession } from '../../lib/auth';
import { getChapter } from '../../lib/course-content';
import {
  buildCoreSubjectProgress,
  calculateStudentRank,
  formatRelativeDay,
  getDaysToBoardExams,
  getRecentChapters,
  pickNextStep,
} from '../../lib/dashboard-home';
import { listExamPaperAttempts } from '../../lib/exam-papers';
import { getStudentMastery } from '../../lib/mastery';
import { fetchStudentEntitlements } from '../../lib/payments';
import { buildStudyRemixDashboardModel } from '../../lib/study-remix';

type WeakChapter = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  reason: string;
  href: string;
};

const SUBJECT_META: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    accentColor: string;
    accentBg: string;
    nextChapterTitle: string;
    nextChapterSlug: string;
    shortDesc: string;
    chapterCountLabel: string;
  }
> = {
  science: {
    Icon: FlaskConical,
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    nextChapterTitle: 'Chemical Reactions & Equations',
    nextChapterSlug: 'chemical-reactions-and-equations',
    shortDesc: 'Physics, Chemistry & Biology',
    chapterCountLabel: '13 chapters · 16 NCERT Labs',
  },
  'mathematics-standard': {
    Icon: Calculator,
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    nextChapterTitle: 'Real Numbers',
    nextChapterSlug: 'real-numbers',
    shortDesc: 'Algebra, Geometry & Trigonometry',
    chapterCountLabel: '14 chapters · 160+ Formulas',
  },
  'social-science': {
    Icon: Globe2,
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    nextChapterTitle: 'The Rise of Nationalism in Europe',
    nextChapterSlug: 'rise-of-nationalism-in-europe',
    shortDesc: 'History, Geography, Civics & Economics',
    chapterCountLabel: '22 chapters · Map & Case Studies',
  },
  'english-language-and-literature': {
    Icon: BookOpenCheck,
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    nextChapterTitle: 'A Letter to God',
    nextChapterSlug: 'a-letter-to-god',
    shortDesc: 'First Flight & Footprints',
    chapterCountLabel: '40 chapters · Literature & Grammar',
  },
};

export default async function DashboardPage() {
  const [session, token, mastery] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
    getStudentMastery(),
  ]);

  const [attemptsData, entitlementsData] = await Promise.all([
    listExamPaperAttempts(token).catch(() => null),
    token ? fetchStudentEntitlements(token).catch(() => null) : null,
  ]);

  const remixModel = buildStudyRemixDashboardModel({ mastery, session });
  const firstName = session.fullName?.split(/\s+/)[0] || 'there';

  // ---- Real student data & gamification ----
  const rank = calculateStudentRank(mastery);
  const daysToBoards = getDaysToBoardExams();
  const nextStep = pickNextStep(mastery);
  const recentChapters = getRecentChapters(mastery.masteries, 3);
  const subjectProgress = buildCoreSubjectProgress(mastery.masteries);
  const activeMissions = mastery.revisionMissions.filter((m) => m.status === 'active');
  const streakDays = mastery.streak?.currentStreakDays ?? 0;
  const activePackCount =
    entitlementsData?.entitlements.filter((e) => e.status === 'active').length ?? 0;

  const chaptersWithScore = mastery.masteries.filter((m) => m.bestQuizScorePercent > 0);
  const attemptCount = attemptsData?.attempts?.length ?? 0;
  const hasProgressData = chaptersWithScore.length > 0 || attemptCount > 0;

  // Readiness estimate over the 4 core subjects
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

  return (
    <main className={remixStyles.page}>
      <PilotEngagementTracker eventType="dashboard_view" surface="dashboard" />

      <StudentTopbar
        contextLabel="Study Studio"
        session={session}
        streakLabel={remixModel.student.streakLabel}
      />

      <div className={styles.shell}>
        {/* 1. Student Command Header */}
        <header className={styles.commandHeader}>
          <div className={styles.commandHeaderLeft}>
            <h1 className={styles.commandHeaderTitle}>Welcome back, {firstName}</h1>
            <p className={styles.commandHeaderSub}>
              <span>CBSE Class 10 Command Center</span>
              <span className={styles.headerMissionTag}>Target: 95%+ Topper Track</span>
            </p>
          </div>
          <div className={styles.commandHeaderChips}>
            {/* 1. Board Exam Countdown */}
            <span
              className={styles.statChipCountdown}
              title="CBSE Class 10 Board Examinations begin February 15, 2027"
            >
              <Clock size={14} color="#dc2626" strokeWidth={2.5} />
              <span>~{daysToBoards} Days to Boards</span>
            </span>

            {/* 2. Daily Streak */}
            <span className={styles.statChip}>
              <Flame size={15} color="#ea580c" strokeWidth={2.5} />
              <span>{streakDays > 0 ? `${streakDays}-Day Streak` : 'Day 1 Streak'}</span>
            </span>

            {/* 3. Diagnostic Calibration Shortcut if no progress data yet */}
            {!hasProgressData ? (
              <Link
                className={styles.statChipCalibrate}
                href="/chapters/chemical-reactions-and-equations/quiz"
                title="Take 3-minute diagnostic quiz to benchmark your readiness score"
              >
                <Target size={15} color="#c95014" strokeWidth={2.5} />
                <span>Calibrate (+50 XP)</span>
              </Link>
            ) : null}

            {activePackCount > 0 ? (
              <Link className={styles.statChip} href="/orders">
                <Package size={15} color="#7c3aed" strokeWidth={2.5} />
                <span>My Packs ({activePackCount})</span>
              </Link>
            ) : null}
          </div>
        </header>

        {/* 2. Main 2-Column Command Center Grid */}
        <div className={styles.commandGrid}>
          {/* Main Learning Workspace (~68% on desktop) */}
          <div className={styles.mainWorkspace}>
            {/* Action Hero Focus */}
            <DashboardNextStepHero step={nextStep} />

            {/* Continue Learning Strip (shown when student has started chapters) */}
            {recentChapters.length > 0 ? (
              <section aria-label="Continue learning">
                <div className={styles.sectionHead}>
                  <div className={styles.sectionTitleRow}>
                    <div className={styles.sectionIconBox}>
                      <Zap size={16} strokeWidth={2.2} color="#c95014" />
                    </div>
                    <h2 className={styles.sectionTitle}>Continue Learning</h2>
                  </div>
                </div>
                <div className={styles.continueGrid}>
                  {recentChapters.map((chapter) => {
                    const score = Math.round(chapter.masteryScore);
                    return (
                      <Link
                        className={styles.continueCard}
                        href={`/chapters/${chapter.chapterSlug}`}
                        key={chapter.chapterSlug}
                      >
                        <span className={styles.continueSubject}>{chapter.subjectName}</span>
                        <h3 className={styles.continueTitle}>{chapter.chapterTitle}</h3>
                        <div className={styles.bar}>
                          <div
                            className={styles.barFill}
                            style={{ width: `${Math.max(score, 4)}%` }}
                          />
                        </div>
                        <div className={styles.tileFoot}>
                          <span>{score}% mastered</span>
                          <span>{formatRelativeDay(chapter.lastActivityAt)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* Core Subject Stations with Subject Filter Tabs (Progressive Disclosure) */}
            <DashboardSubjectStations
              subjectProgress={subjectProgress}
              subjectMeta={SUBJECT_META}
            />

            {/* High-Yield Practice & Revision Hub with Category Tabs (Progressive Disclosure) */}
            <DashboardPracticeHub />
          </div>

          {/* Right Gamification & Live HUD Column (~32% on desktop) */}
          <div className={styles.sidebarColumn}>
            <DashboardSidebarHud
              streakDays={streakDays}
              streakLabel={remixModel.student.streakLabel}
              readiness={readiness}
              hasProgressData={hasProgressData}
              quizAvg={quizAvg}
              mockAvg={mockAvg}
              startedCoreChapters={startedCoreChapters}
              totalCoreChapters={totalCoreChapters}
              weakChapters={weakChapters}
              rank={rank}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
