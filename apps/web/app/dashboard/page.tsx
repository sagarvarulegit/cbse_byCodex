import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import NeedsALookStrip, { type NeedsALookItem } from '../../components/dashboard/NeedsALookStrip';
import SubjectTiles from '../../components/dashboard/SubjectTiles';
import TodayPlanCard from '../../components/dashboard/TodayPlanCard';
import XpRewardToast from '../../components/dashboard/XpRewardToast';
import styles from '../../components/dashboard/dashboard-calm.module.css';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import { getStudentSessionToken, requireStudentSession } from '../../lib/auth';
import { getChapter } from '../../lib/course-content';
import {
  READINESS_MIN_SIGNALS,
  buildCoreSubjectProgress,
  buildTodayPlan,
  calculateStudentRank,
  describeReadiness,
  pickNextStep,
} from '../../lib/dashboard-home';
import { listExamPaperAttempts } from '../../lib/exam-papers';
import { getStudentMastery } from '../../lib/mastery';
import { getStudentMistakes } from '../../lib/mistakes';

/**
 * Student home — "one screen, one question: what should I do today?"
 * Greeting → Today's plan (one button) → My subjects → Quick fixes (only when needed).
 */
export default async function DashboardPage() {
  const [session, token, mastery] = await Promise.all([
    requireStudentSession(),
    getStudentSessionToken(),
    getStudentMastery(),
  ]);

  const [attemptsData, mistakesData] = await Promise.all([
    listExamPaperAttempts(token).catch(() => null),
    getStudentMistakes('active').catch(() => null),
  ]);

  const firstName = session.fullName?.split(/\s+/)[0] || 'there';
  const streakDays = mastery.streak?.currentStreakDays ?? 0;
  const rank = calculateStudentRank(mastery);
  const nextStep = pickNextStep(mastery);
  const subjectProgress = buildCoreSubjectProgress(mastery.masteries);

  // Active mistakes count from the spaced-repetition list
  const dueMistakesCount =
    mistakesData?.items?.filter((item) => item.due).length ??
    mistakesData?.items?.length ??
    0;

  const todayPlan = buildTodayPlan(nextStep, mastery.masteries, dueMistakesCount);

  // Readiness estimate over core subjects — only shown once there is real data.
  const chaptersWithScore = mastery.masteries.filter((m) => m.bestQuizScorePercent > 0);
  const attemptCount = attemptsData?.attempts?.length ?? 0;
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
  const showReadiness = chaptersWithScore.length + attemptCount >= READINESS_MIN_SIGNALS;

  // One encouraging line, based on what the student has actually done.
  const greetingLine =
    streakDays >= 2
      ? `You've studied ${streakDays} days in a row. Keep it going!`
      : startedCoreChapters > 0
        ? `You've started ${startedCoreChapters} ${startedCoreChapters === 1 ? 'chapter' : 'chapters'}. Nice work!`
        : "Let's start with one small step today.";

  // Quick fixes: shown only when something actually needs attention (and isn't already the primary CTA).
  const quickFixes: NeedsALookItem[] = [];
  if (dueMistakesCount > 0 && todayPlan.cta.href !== '/my-mistakes') {
    quickFixes.push({
      key: 'mistakes',
      kind: 'mistakes',
      text: `${dueMistakesCount} ${dueMistakesCount === 1 ? 'question' : 'questions'} to try again`,
      actionLabel: 'Try again',
      href: '/my-mistakes',
    });
  }
  const planChapterSlug = nextStep.kind === 'start' ? null : nextStep.chapterSlug;
  const weakMockSlug = (attemptsData?.weakAreas?.weakChapterSlugs ?? []).find(
    (slug) => slug !== planChapterSlug && getChapter(slug),
  );
  if (weakMockSlug) {
    const chapter = getChapter(weakMockSlug);
    quickFixes.push({
      key: `weak-${weakMockSlug}`,
      kind: 'weak-chapter',
      text: `You lost marks in ${chapter?.title ?? 'a chapter'} in your last practice paper`,
      actionLabel: 'Revise',
      href: `/chapters/${weakMockSlug}`,
    });
  }

  return (
    <main className={styles.page}>
      <PilotEngagementTracker eventType="dashboard_view" surface="dashboard" />

      <StudentTopbar
        session={session}
        streakLabel={`🔥 ${Math.max(1, streakDays)}-day streak`}
      />

      <XpRewardToast studentId={session.id} totalXp={rank.totalXp} level={rank.level} />

      <div className={styles.shell}>
        <header className={styles.greeting}>
          <div>
            <h1 className={styles.greetingTitle}>Hi {firstName} 👋</h1>
            <p className={styles.greetingLine}>{greetingLine}</p>
          </div>

          {showReadiness ? (
            <Link className={styles.readinessLink} href="/readiness">
              <span>
                Exam readiness: <strong>{describeReadiness(readiness)}</strong>
              </span>
              <ArrowRight size={16} strokeWidth={2.4} />
            </Link>
          ) : null}
        </header>

        <TodayPlanCard plan={todayPlan} />

        <SubjectTiles subjects={subjectProgress} />

        <NeedsALookStrip items={quickFixes} />

        <p className={styles.toolsHint}>
          Looking for formula sheets, the virtual lab or practice papers?{' '}
          <Link href="/tools">Open study tools</Link>
          <span aria-hidden="true" style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
          <Link href="/parent-summary">Parent weekly report</Link>
        </p>
      </div>
    </main>
  );
}
