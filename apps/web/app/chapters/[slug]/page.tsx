import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import ExamReadyChecklist from '../../../components/ExamReadyChecklist';
import PilotEngagementTracker from '../../../components/PilotEngagementTracker';
import StudentTopbar from '../../../components/StudentTopbar';
import { getStudentSession } from '../../../lib/auth';
import {
  getAvailableLessons,
  getChapter,
  getQuizContent,
  hasChapterPack,
  type ChapterContent,
} from '../../../lib/course-content';
import { getChapterSubjectNavigation } from '../../../lib/curriculum/subject-navigation';
import {
  getStudentExamReadiness,
  type ExamReadyChecklistState,
} from '../../../lib/exam-readiness';
import {
  formatMasteryLevel,
  getChapterMasteryDisplay,
  getNextMasteryLabel,
  getStudentMastery,
  type MasteryPayload,
} from '../../../lib/mastery';
import { buildMasteryRewards } from '../../../lib/mastery-rewards';
import { isPilotChapter } from '../../../lib/pilot';

export default async function ChapterProgressPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const masteryPromise = getStudentMastery(slug);
  const examReadinessPromise = getStudentExamReadiness(slug);
  const [quizContent, session] = await Promise.all([
    getQuizContent(slug),
    getStudentSession(),
  ]);
  const hasChapterContent =
    getAvailableLessons(chapter).length > 0 || hasChapterPack(slug);
  const isPilot = isPilotChapter(slug);
  const subjectNavigation = getChapterSubjectNavigation(slug);

  return (
    <main>
      <PilotEngagementTracker
        chapterSlug={slug}
        eventType="chapter_open"
        surface="chapter"
      />

      <StudentTopbar contextLabel={chapter.subject} session={session} />

      <section className="chapter-hero section-shell">
        <div>
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/subjects">Subjects</Link>
            {subjectNavigation ? (
              <>
                <span>/</span>
                <Link href={subjectNavigation.href}>
                  {subjectNavigation.chapterListLabel}
                </Link>
              </>
            ) : null}
            <span>/</span>
            <span aria-current="page">{chapter.title}</span>
          </nav>
          <div className="quick-win-hero-header">
            <span className="quick-win-badge">⚡ CLASS 10 QUICK WIN HUB</span>
            <h1>{chapter.title} Quick Win Hub</h1>
            <p className="subtext">
              Choose your 5-minute quick win to build instant confidence before diving into deep reading.
            </p>
          </div>

          {/* Two High-Contrast Hero Cards */}
          <div className="quick-win-cards-grid" aria-label="Quick Win Options">
            {/* Card 1: Download 1-Page Formula Sheet */}
            <div className="quick-win-card quick-win-formula-card">
              <div className="quick-win-card-top">
                <span className="quick-win-card-chip">⚡ 1-PAGE REVISION SHEET</span>
                <span className="quick-win-free-pill">100% Free</span>
              </div>
              <h2 className="quick-win-card-title">
                Download 1-Page Formula Sheet (Class 10 {chapter.title})
              </h2>
              <p className="quick-win-card-desc">
                High-density summary of all core formulas, rules, theorems, and common traps compressed into 1 printable sheet.
              </p>
              <Link
                className="quick-win-card-btn formula-btn"
                href={`/formula-cheatsheets?chapter=${slug}`}
              >
                Download 1-Page Formula Sheet &rarr;
              </Link>
              <span className="quick-win-card-meta">Printable PDF &amp; Interactive Flashcards</span>
            </div>

            {/* Card 2: Take 10-Min Board Mock Test */}
            <div className="quick-win-card quick-win-mock-card">
              <div className="quick-win-card-top">
                <span className="quick-win-card-chip mock-chip">🎯 ACTIVE RECALL</span>
                <span className="quick-win-free-pill">Board Aligned</span>
              </div>
              <h2 className="quick-win-card-title">
                Take 10-Min Board Mock Test
              </h2>
              <p className="quick-win-card-desc">
                Test your exam readiness with real CBSE board questions, instant step scoring, and automatic Mistake Vault tracking.
              </p>
              <Link
                className="quick-win-card-btn mock-btn"
                href={`/chapters/${slug}/quiz`}
              >
                Take 10-Min Board Mock Test &rarr;
              </Link>
              <span className="quick-win-card-meta">10-Min Timer · CBSE Step-Marking</span>
            </div>
          </div>

          {/* Secondary Option: Standard Chapter Notes */}
          <div className="quick-win-secondary-option">
            <div className="secondary-option-info">
              <span className="secondary-option-badge">📖 COMPREHENSIVE STUDY</span>
              <p className="secondary-option-text">
                Prefer full textbook reading first? Explore all explanations, diagrams, and step-by-step proofs.
              </p>
            </div>
            {hasChapterContent ? (
              <div className="secondary-notes-actions">
                <Link
                  className="secondary-notes-button"
                  href={`/chapters/${slug}/notes?view=cards`}
                  prefetch={false}
                  style={{
                    background: '#fff3e0',
                    borderColor: '#171513',
                    color: '#171513',
                    fontWeight: 900,
                  }}
                >
                  ⚡ Bite-Sized Concept Cards &rarr;
                </Link>
                <Link
                  className="secondary-notes-button"
                  href={`/chapters/${slug}/notes`}
                  prefetch={false}
                >
                  Study Standard Chapter Notes ({chapter.title}) &rarr;
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <Suspense fallback={<ChapterMasteryPanel chapter={chapter} />}>
          <LiveChapterMasteryPanel
            chapter={chapter}
            masteryPromise={masteryPromise}
          />
        </Suspense>
      </section>

      <Suspense fallback={<ChapterProgressDetailsLoading />}>
        <ChapterProgressDetails
          chapterSlug={slug}
          examReadinessPromise={examReadinessPromise}
          masteryPromise={masteryPromise}
        />
      </Suspense>
    </main>
  );
}

function ChapterMasteryPanel({
  chapter,
  mastery,
}: {
  chapter: ChapterContent;
  mastery?: MasteryPayload;
}) {
  const chapterMastery = mastery?.masteries[0];
  const masteryDisplay = getChapterMasteryDisplay(chapterMastery);

  return (
    <aside className="mastery-panel" id="mastery">
      <p className="eyebrow">Chapter mastery</p>
      <strong>{masteryDisplay.score}%</strong>
      <span>{masteryDisplay.label}</span>
      <div
        className="progress-track large"
        aria-label={`${masteryDisplay.score}% mastered`}
      >
        <span style={{ width: `${masteryDisplay.score}%` }} />
      </div>
      {chapterMastery ? (
        <p className="streak-task">
          Next target: {getNextMasteryLabel(chapterMastery.masteryScore)}
        </p>
      ) : null}
      <p className="streak-task">Today: {chapter.streakTask}</p>
    </aside>
  );
}

async function LiveChapterMasteryPanel({
  chapter,
  masteryPromise,
}: {
  chapter: ChapterContent;
  masteryPromise: Promise<MasteryPayload>;
}) {
  return (
    <ChapterMasteryPanel
      chapter={chapter}
      mastery={await masteryPromise}
    />
  );
}

async function ChapterProgressDetails({
  chapterSlug,
  examReadinessPromise,
  masteryPromise,
}: {
  chapterSlug: string;
  examReadinessPromise: Promise<ExamReadyChecklistState | null>;
  masteryPromise: Promise<MasteryPayload>;
}) {
  const [mastery, examReadiness] = await Promise.all([
    masteryPromise,
    examReadinessPromise,
  ]);
  const chapterMastery = mastery.masteries[0];
  const activeMission = mastery.revisionMissions[0];
  const missionPrimaryAction = activeMission?.recommendedActions?.[0];
  const missionRetryAction = activeMission?.recommendedActions?.find((action) =>
    action.href.endsWith('/quiz'),
  );
  const masteryRewards = chapterMastery
    ? buildMasteryRewards({
        badges: mastery.badges,
        chapterSlug,
        masteryScore: chapterMastery.masteryScore,
      })
    : [];

  return (
    <>
      <section
        className="section-shell chapter-reward-strip"
        aria-label="Chapter mastery milestones"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Chapter milestones</p>
            <h2>Milestones follow your saved mastery score.</h2>
          </div>
          <span className="section-badge">
            {masteryRewards[0]?.badgeCount ?? 0} chapter badge
            {masteryRewards[0]?.badgeCount === 1 ? '' : 's'}
          </span>
        </div>
        {chapterMastery ? (
          <div className="reward-grid compact">
            {masteryRewards.map((reward) => (
              <article
                className={`reward-card ${reward.state}`}
                key={reward.level}
              >
                <div>
                  <span className="reward-state">
                    {reward.state === 'unlocked'
                      ? 'Reached'
                      : reward.isNext
                        ? 'Next milestone'
                        : 'Upcoming'}
                  </span>
                  <strong>{reward.rewardName}</strong>
                </div>
                <p>{reward.actionLabel}</p>
                <div className="reward-meta">
                  <span>{formatMasteryLevel(reward.level)}</span>
                  <span>{reward.progressLabel}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="subtext compact">
            Study the chapter or take its quiz to begin recording mastery
            milestones.
          </p>
        )}
      </section>

      <ExamReadyChecklist
        chapterSlug={chapterSlug}
        initialState={examReadiness}
      />

      {activeMission ? (
        <section className="section-shell chapter-mission-callout">
          <div>
            <p className="eyebrow">Revision mission</p>
            <h2>{activeMission.chapterTitle}</h2>
            <p className="subtext compact">{activeMission.reason}</p>
            <p className="subtext compact">
              Target: {activeMission.targetScore}% ·{' '}
              {missionPrimaryAction?.step ??
                activeMission.recommendedSteps[0] ??
                'Review the chapter notes, then retry the quiz.'}
            </p>
          </div>
          <div className="hero-actions">
            <Link
              className="button-link"
              href={missionPrimaryAction?.href ?? `/chapters/${chapterSlug}/notes`}
              prefetch={false}
            >
              {missionPrimaryAction?.label ?? 'Review notes'}
            </Link>
            <Link
              className="ghost-link"
              href={missionRetryAction?.href ?? `/chapters/${chapterSlug}/quiz`}
              prefetch={false}
            >
              Retry quiz
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}

function ChapterProgressDetailsLoading() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading chapter mastery"
      className="section-shell chapter-reward-strip"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Chapter milestones</p>
          <h2>Loading your mastery milestones...</h2>
        </div>
      </div>
      <div className="route-loading-bar" />
    </section>
  );
}
