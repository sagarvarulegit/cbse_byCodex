import Link from 'next/link';
import {
  Flame,
  Target,
  Layers,
  Package,
  FlaskConical,
  Calculator,
  Globe2,
  BookOpenCheck,
  Microscope,
  Zap,
  TrendingUp,
  Gamepad2,
  FileText,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

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

const PRACTICE_CARDS = [
  {
    title: '3D Virtual Science Lab',
    desc: 'Hands-on NCERT simulations: pH scale, electrolysis & ray optics.',
    badge: 'Interactive 3D',
    Icon: Microscope,
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    href: '/virtual-lab',
    cta: 'Launch 3D Lab',
  },
  {
    title: 'Formula Cheatsheets',
    desc: 'All 14 Maths & Science formula sheets + derivations in 1 click.',
    badge: 'Quick Recall',
    Icon: Zap,
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    href: '/formula-cheatsheets',
    cta: 'View Formulas',
  },
  {
    title: 'Board Score Predictor',
    desc: 'AI blueprint analysis to estimate your 2026-27 CBSE percentile.',
    badge: 'AI Powered',
    Icon: TrendingUp,
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    href: '/tools/readiness-predictor',
    cta: 'Predict Score',
  },
  {
    title: 'Formula Rush Arcade',
    desc: '60-second rapid-fire recall drills to build instant exam speed.',
    badge: 'Gamified Drill',
    Icon: Gamepad2,
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    href: '/games/formula-rush',
    cta: 'Play Arcade',
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
            <h1 className={styles.commandHeaderTitle}>Welcome back, {firstName}</h1>
            <p className={styles.commandHeaderSub}>
              <span>CBSE Class 10 Command Center</span>
              <span className={styles.headerMissionTag}>Target: 95%+ Topper Track</span>
            </p>
          </div>
          <div className={styles.commandHeaderChips}>
            <span className={styles.statChip}>
              <Flame size={15} color="#ea580c" strokeWidth={2.5} />
              <span>{streakDays > 0 ? `${streakDays}-Day Streak` : 'Day 1 Streak'}</span>
            </span>
            <span className={styles.statChip}>
              <Target size={15} color="#0284c7" strokeWidth={2.5} />
              <span>{readiness}% Board Readiness</span>
            </span>
            <span className={styles.statChip}>
              <Layers size={15} color="#059669" strokeWidth={2.5} />
              <span>{startedCoreChapters}/{totalCoreChapters} Chapters Underway</span>
            </span>
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

            {/* Core Subject Stations (2x2 Grid) */}
            <section aria-label="Core subjects">
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitleRow}>
                  <div className={styles.sectionIconBox}>
                    <BookOpen size={16} strokeWidth={2.2} color="#c95014" />
                  </div>
                  <h2 className={styles.sectionTitle}>Core Subject Stations</h2>
                  <span className={styles.sectionBadge}>4 Board Subjects</span>
                </div>
                <Link className={styles.sectionLink} href="/subjects">
                  <span>All Subjects Syllabus</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>

              <div className={styles.subjectGrid}>
                {subjectProgress.map((subject) => {
                  const meta = SUBJECT_META[subject.slug] || {
                    Icon: BookOpen,
                    accentColor: '#c95014',
                    accentBg: '#fff4e8',
                    nextChapterTitle: 'Chapter 1',
                    nextChapterSlug: subject.slug,
                    shortDesc: 'Core Curriculum',
                    chapterCountLabel: `${subject.chapterCount} chapters`,
                  };
                  const SubjectIcon = meta.Icon;

                  return (
                    <div
                      className={styles.subjectCard}
                      key={subject.slug}
                      style={{ borderTopColor: meta.accentColor }}
                    >
                      <div className={styles.subjectCardTop}>
                        <div className={styles.subjectInfoBlock}>
                          <div
                            className={styles.subjectIconBox}
                            style={{ backgroundColor: meta.accentBg, color: meta.accentColor }}
                          >
                            <SubjectIcon size={20} strokeWidth={2.2} />
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
                            color: subject.progressPercent > 0 ? meta.accentColor : '#6a645d',
                            backgroundColor: subject.progressPercent > 0 ? meta.accentBg : '#fffdf8',
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
                              : meta.chapterCountLabel}
                          </span>
                        </div>
                      </div>

                      {/* Chapter Spotlight */}
                      <div className={styles.chapterSpotlight}>
                        <div className={styles.spotlightHeader}>
                          <span
                            className={styles.spotlightDot}
                            style={{ backgroundColor: meta.accentColor }}
                          />
                          <span className={styles.spotlightTag}>
                            {subject.startedCount > 0 ? 'CURRENT TOPIC' : 'UP NEXT IN SYLLABUS'}
                          </span>
                        </div>
                        <div className={styles.spotlightTitle}>{meta.nextChapterTitle}</div>
                      </div>

                      {/* Clean Action Row */}
                      <div className={styles.subjectActionRow}>
                        <Link
                          className={styles.subjectPrimaryBtn}
                          href={`/chapters/${meta.nextChapterSlug}`}
                        >
                          <span>{subject.startedCount > 0 ? 'Continue' : 'Start Chapter 1'}</span>
                          <ArrowRight size={14} strokeWidth={2.5} />
                        </Link>
                        <Link
                          className={styles.subjectSyllabusLink}
                          href={`/subjects/${subject.slug}`}
                        >
                          <span>All {subject.chapterCount} chapters</span>
                          <ArrowRight size={12} strokeWidth={2} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* High-Yield Practice & Revision Hub (2x2 Grid) */}
            <section aria-label="Practice tools">
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitleRow}>
                  <div className={styles.sectionIconBox}>
                    <Sparkles size={16} strokeWidth={2.2} color="#c95014" />
                  </div>
                  <h2 className={styles.sectionTitle}>High-Yield Practice & Revision</h2>
                  <span className={styles.sectionBadge}>Interactive Apps</span>
                </div>
                <Link className={styles.sectionLink} href="/tools">
                  <span>All Tools Catalog</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>

              <div className={styles.practiceGrid}>
                {PRACTICE_CARDS.map((card) => {
                  const CardIcon = card.Icon;
                  return (
                    <Link className={styles.practiceCard} href={card.href} key={card.title}>
                      <div>
                        <div className={styles.practiceCardTop}>
                          <div
                            className={styles.practiceIconBox}
                            style={{ backgroundColor: card.accentBg, color: card.accentColor }}
                          >
                            <CardIcon size={20} strokeWidth={2.2} />
                          </div>
                          <span className={styles.practiceBadge}>{card.badge}</span>
                        </div>
                        <h3 className={styles.practiceTitle}>{card.title}</h3>
                        <p className={styles.practiceDesc}>{card.desc}</p>
                      </div>
                      <div className={styles.practiceActionRow}>
                        <span>{card.cta}</span>
                        <ArrowRight size={13} strokeWidth={2.5} />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Full Mock Paper Featured Banner */}
              <div className={styles.mockBanner}>
                <div className={styles.mockBannerLeft}>
                  <div className={styles.mockBannerIconBox}>
                    <FileText size={28} strokeWidth={2.2} color="#c95014" />
                  </div>
                  <div>
                    <div className={styles.mockBannerTagRow}>
                      <span className={styles.mockBannerTag}>OFFICIAL 2026-27 BLUEPRINT</span>
                    </div>
                    <h3 className={styles.mockBannerTitle}>CBSE Official Board Mock Papers</h3>
                    <p className={styles.mockBannerSub}>
                      Practice full 80-mark timed papers matching the official curriculum with step-wise marking schemes.
                    </p>
                  </div>
                </div>
                <Link className={styles.mockBannerBtn} href="/exam-papers">
                  <span>Solve Mock Papers</span>
                  <ArrowRight size={15} strokeWidth={2.5} />
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
