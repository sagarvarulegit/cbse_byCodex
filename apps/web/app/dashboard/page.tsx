import Link from 'next/link';

import DashboardNextStepHero from '../../components/DashboardNextStepHero';
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

const TOOLS = [
  { href: '/virtual-lab', label: '🔬 3D Science Lab' },
  { href: '/formula-cheatsheets', label: '⚡ Formula Sheets' },
  { href: '/tools/readiness-predictor', label: '🎯 Score Predictor' },
  { href: '/games/formula-rush', label: '🎮 Formula Rush' },
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

  // ---- Real data only ----
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

  // Readiness estimate, computed over the 4 core subjects only so numbers agree everywhere.
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

  // Weak chapters: active revision missions first, then weak chapters from mock papers.
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
        {/* 1. Greeting */}
        <header className={styles.greeting}>
          <div>
            <h1 className={styles.greetingTitle}>Hi {firstName} 👋</h1>
            <p className={styles.greetingSub}>
              {nextStep.kind === 'start'
                ? 'One small step today. Start below.'
                : 'Here is your next step for today.'}
            </p>
          </div>
          <div className={styles.chips}>
            {streakDays > 0 ? (
              <span className={styles.chip}>
                🔥 {streakDays}-day streak
              </span>
            ) : null}
            {activePackCount > 0 ? (
              <Link className={styles.chip} href="/orders">
                📦 My packs ({activePackCount})
              </Link>
            ) : null}
          </div>
        </header>

        {/* 2. One next step */}
        <DashboardNextStepHero step={nextStep} />

        {/* 3. Continue learning — only when the student has started chapters */}
        {recentChapters.length > 0 ? (
          <section aria-label="Continue learning">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Continue learning</h2>
            </div>
            <div className={styles.grid3}>
              {recentChapters.map((chapter) => {
                const score = Math.round(chapter.masteryScore);
                return (
                  <Link
                    className={styles.tile}
                    href={`/chapters/${chapter.chapterSlug}`}
                    key={chapter.chapterSlug}
                  >
                    <span className={styles.tileMeta}>{chapter.subjectName}</span>
                    <h3 className={styles.tileTitle}>{chapter.chapterTitle}</h3>
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${Math.max(score, 3)}%` }} />
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

        {/* 4. Subjects — real progress, no marketing copy */}
        <section aria-label="Your subjects">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Your subjects</h2>
            <Link className={styles.sectionLink} href="/subjects">
              All subjects →
            </Link>
          </div>
          <div className={styles.grid4}>
            {subjectProgress.map((subject) => (
              <Link className={styles.tile} href={`/subjects/${subject.slug}`} key={subject.slug}>
                <span className={styles.tileMeta}>Code {subject.subjectCode}</span>
                <h3 className={styles.tileTitle}>{subject.title}</h3>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${Math.max(subject.progressPercent, 3)}%`,
                      opacity: subject.startedCount > 0 ? 1 : 0.3,
                    }}
                  />
                </div>
                <div className={styles.tileFoot}>
                  <span>
                    {subject.startedCount > 0
                      ? `${subject.startedCount} of ${subject.chapterCount} chapters started`
                      : `${subject.chapterCount} chapters · not started yet`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Progress — only once there is real data; never a wall of zeros */}
        <section aria-label="My progress">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>My progress</h2>
            {hasProgressData ? (
              <Link className={styles.sectionLink} href="/my-mistakes">
                My mistakes →
              </Link>
            ) : null}
          </div>
          {hasProgressData ? (
            <div className={styles.progressCard}>
              <div className={styles.scoreBlock}>
                <span className={styles.scoreValue}>{readiness}%</span>
                <span className={styles.scoreLabel}>Board readiness (estimate)</span>
                <div className={styles.statRow}>
                  <div>
                    <strong>{quizAvg !== null ? `${Math.round(quizAvg)}%` : '—'}</strong>
                    Quiz avg
                  </div>
                  <div>
                    <strong>{mockAvg !== null ? `${Math.round(mockAvg)}%` : '—'}</strong>
                    Mock avg
                  </div>
                  <div>
                    <strong>
                      {startedCoreChapters}/{totalCoreChapters}
                    </strong>
                    Chapters
                  </div>
                </div>
              </div>
              <div>
                {weakChapters.length > 0 ? (
                  <ul className={styles.weakList}>
                    {weakChapters.slice(0, 3).map((item) => (
                      <li className={styles.weakItem} key={item.chapterSlug}>
                        <div>
                          <strong>{item.chapterTitle}</strong>
                          <span>
                            {item.subjectName} · {item.reason}
                          </span>
                        </div>
                        <Link className={styles.outlineBtn} href={item.href}>
                          Revise →
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.mutedNote}>
                    No chapters flagged for revision yet. Take a full mock paper to find weak spots
                    across the syllabus.{' '}
                    <Link className={styles.sectionLink} href="/exam-papers">
                      Mock papers →
                    </Link>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className={styles.mutedNote}>
              Your readiness score and weak chapters will appear here after your first quiz.
            </p>
          )}
        </section>

        {/* 6. Tools — slim row */}
        <section aria-label="Study tools">
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Study tools</h2>
            <Link className={styles.sectionLink} href="/tools">
              All tools →
            </Link>
          </div>
          <div className={styles.toolsRow}>
            {TOOLS.map((tool) => (
              <Link className={styles.toolChip} href={tool.href} key={tool.href}>
                {tool.label}
              </Link>
            ))}
            <Link className={styles.toolChip} href="/exam-papers">
              📄 Mock Papers
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
