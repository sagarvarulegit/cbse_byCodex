import Link from 'next/link';

import DashboardNextStepHero from '../../components/DashboardNextStepHero';
import DashboardSidebarHud from '../../components/DashboardSidebarHud';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import styles from '../../components/dashboard-home.module.css';
import remixStyles from '../../components/study-remix.module.css';
import { getStudentSessionToken, requireStudentSession } from '../../lib/auth';
import { getChapter } from '../../lib/course-content';
import {
  buildCoreSubjectProgress,
  formatRelativeDay,
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
    icon: string;
    accentColor: string;
    accentBg: string;
    nextChapterTitle: string;
    nextChapterSlug: string;
  }
> = {
  science: {
    icon: '🧪',
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    nextChapterTitle: 'Chemical Reactions and Equations',
    nextChapterSlug: 'chemical-reactions-and-equations',
  },
  'mathematics-standard': {
    icon: '📐',
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    nextChapterTitle: 'Real Numbers',
    nextChapterSlug: 'real-numbers',
  },
  'social-science': {
    icon: '🌍',
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    nextChapterTitle: 'The Rise of Nationalism in Europe',
    nextChapterSlug: 'rise-of-nationalism-in-europe',
  },
  'english-language-and-literature': {
    icon: '📚',
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    nextChapterTitle: 'A Letter to God',
    nextChapterSlug: 'a-letter-to-god',
  },
};

const PRACTICE_CARDS = [
  {
    title: '3D Virtual Science Lab',
    desc: 'Hands-on NCERT simulations: pH scale, electrolysis & ray optics diagrams.',
    badge: 'Interactive 3D',
    icon: '🔬',
    href: '/virtual-lab',
    cta: 'Launch Lab →',
  },
  {
    title: 'Formula Cheatsheets',
    desc: 'All 14 Maths & Science formula sheets + derivations in one click.',
    badge: 'Quick Recall',
    icon: '⚡',
    href: '/formula-cheatsheets',
    cta: 'View Formulas →',
  },
  {
    title: 'Board Score Predictor',
    desc: 'AI blueprint analysis to estimate your 2026-27 CBSE Board percentile.',
    badge: 'AI Powered',
    icon: '🎯',
    href: '/tools/readiness-predictor',
    cta: 'Predict Score →',
  },
  {
    title: 'Formula Rush Arcade',
    desc: '60-second rapid-fire recall drills to build instant exam muscle memory.',
    badge: 'Gamified Drill',
    icon: '🎮',
    href: '/games/formula-rush',
    cta: 'Play Arcade →',
  },
] as const;

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

  // ---- Real student data ----
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
            <h1 className={styles.commandHeaderTitle}>Welcome back, {firstName} 🎯</h1>
            <p className={styles.commandHeaderSub}>
              <span>CBSE Class 10 Command Center</span>
              <span className={styles.headerMissionTag}>Target: 95%+ Topper Track</span>
            </p>
          </div>
          <div className={styles.commandHeaderChips}>
            <span className={styles.statChip}>
              🔥 {streakDays > 0 ? `${streakDays}-Day Streak` : 'Day 1 Streak'}
            </span>
            <span className={styles.statChip}>
              🎯 {readiness}% Board Readiness
            </span>
            <span className={styles.statChip}>
              📚 {startedCoreChapters}/{totalCoreChapters} Chapters
            </span>
            {activePackCount > 0 ? (
              <Link className={styles.statChip} href="/orders">
                📦 My Packs ({activePackCount})
              </Link>
            ) : null}
          </div>
        </header>

        {/* 2. Main 2-Column Command Center Grid */}
        <div className={styles.commandGrid}>
          {/* Main Learning Workspace (~68% on desktop) */}
          <div className={styles.mainWorkspace}>
            {/* Action Hero */}
            <DashboardNextStepHero step={nextStep} />

            {/* Continue Learning Strip (shown when student has started chapters) */}
            {recentChapters.length > 0 ? (
              <section aria-label="Continue learning">
                <div className={styles.sectionHead}>
                  <div className={styles.sectionTitleRow}>
                    <span className={styles.sectionIcon}>⚡</span>
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

            {/* Core Subject Stations (2x2 Grid) */}
            <section aria-label="Core subjects">
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitleRow}>
                  <span className={styles.sectionIcon}>📚</span>
                  <h2 className={styles.sectionTitle}>Core Subject Stations</h2>
                  <span className={styles.sectionBadge}>4 Board Subjects</span>
                </div>
                <Link className={styles.sectionLink} href="/subjects">
                  All Subjects Syllabus →
                </Link>
              </div>

              <div className={styles.subjectGrid}>
                {subjectProgress.map((subject) => {
                  const meta = SUBJECT_META[subject.slug] || {
                    icon: '📖',
                    accentColor: '#c95014',
                    accentBg: '#fff4e8',
                    nextChapterTitle: 'Chapter 1',
                    nextChapterSlug: subject.slug,
                  };

                  return (
                    <div className={styles.subjectCard} key={subject.slug}>
                      <div className={styles.subjectCardTop}>
                        <div className={styles.subjectInfoBlock}>
                          <div
                            className={styles.subjectIconBox}
                            style={{ backgroundColor: meta.accentBg }}
                          >
                            <span>{meta.icon}</span>
                          </div>
                          <div className={styles.subjectTitleGroup}>
                            <span className={styles.subjectCodeTag}>
                              Code {subject.subjectCode} · NCERT
                            </span>
                            <h3 className={styles.subjectTitle}>{subject.title}</h3>
                          </div>
                        </div>
                        <span
                          className={styles.subjectMasteryPill}
                          style={{
                            borderColor: subject.progressPercent > 0 ? meta.accentColor : '#e7e2d6',
                            color: subject.progressPercent > 0 ? meta.accentColor : '#55514b',
                          }}
                        >
                          {subject.progressPercent}% Mastered
                        </span>
                      </div>

                      <div className={styles.subjectProgressSection}>
                        <div className={styles.subjectProgressBar}>
                          <div
                            className={styles.subjectProgressFill}
                            style={{
                              width: `${Math.max(subject.progressPercent, 4)}%`,
                              backgroundColor: meta.accentColor,
                            }}
                          />
                        </div>
                        <div className={styles.subjectProgressDetails}>
                          <span>
                            {subject.startedCount > 0
                              ? `${subject.startedCount} of ${subject.chapterCount} chapters underway`
                              : `${subject.chapterCount} chapters · Ready to start`}
                          </span>
                        </div>
                      </div>

                      {/* Next Chapter Teaser */}
                      <div className={styles.subjectNextTeaser}>
                        <span className={styles.nextTeaserLabel}>Start / Next:</span>
                        <span className={styles.nextTeaserName}>{meta.nextChapterTitle}</span>
                      </div>

                      {/* Dual 1-Click Action Buttons */}
                      <div className={styles.subjectActionRow}>
                        <Link
                          className={styles.subjectNotesBtn}
                          href={`/chapters/${meta.nextChapterSlug}`}
                        >
                          📖 Notes
                        </Link>
                        <Link
                          className={styles.subjectQuizBtn}
                          href={`/chapters/${meta.nextChapterSlug}/quiz`}
                        >
                          ⚡ Quiz
                        </Link>
                      </div>

                      <Link
                        className={styles.subjectExploreLink}
                        href={`/subjects/${subject.slug}`}
                      >
                        Explore all {subject.chapterCount} chapters →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* High-Yield Practice & Revision Hub (2x2 Grid) */}
            <section aria-label="Practice tools">
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitleRow}>
                  <span className={styles.sectionIcon}>⚡</span>
                  <h2 className={styles.sectionTitle}>High-Yield Practice & Tools</h2>
                  <span className={styles.sectionBadge}>NCERT Lab & Drills</span>
                </div>
                <Link className={styles.sectionLink} href="/tools">
                  All Tools Catalog →
                </Link>
              </div>

              <div className={styles.practiceGrid}>
                {PRACTICE_CARDS.map((card) => (
                  <Link className={styles.practiceCard} href={card.href} key={card.title}>
                    <div>
                      <div className={styles.practiceCardTop}>
                        <div className={styles.practiceIconBox}>{card.icon}</div>
                        <span className={styles.practiceBadge}>{card.badge}</span>
                      </div>
                      <h3 className={styles.practiceTitle}>{card.title}</h3>
                      <p className={styles.practiceDesc}>{card.desc}</p>
                    </div>
                    <div className={styles.practiceActionRow}>
                      <span>{card.cta}</span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Full Mock Paper Featured Banner */}
              <div className={styles.mockBanner}>
                <div className={styles.mockBannerLeft}>
                  <span className={styles.mockBannerIcon}>📄</span>
                  <div>
                    <h3 className={styles.mockBannerTitle}>CBSE Official Board Mock Papers</h3>
                    <p className={styles.mockBannerSub}>
                      Practice full 80-mark timed papers matching the official 2026-27 blueprint with marking schemes.
                    </p>
                  </div>
                </div>
                <Link className={styles.mockBannerBtn} href="/exam-papers">
                  Solve Mock Papers →
                </Link>
              </div>
            </section>
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
            />
          </div>
        </div>
      </div>
    </main>
  );
}
