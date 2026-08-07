import Link from 'next/link';

import PilotFeedbackForm from '../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import StudyRemixDashboard from '../../components/StudyRemixDashboard';
import SyllabusLibraryGrid from '../../components/SyllabusLibraryGrid';
import styles from '../../components/study-remix.module.css';
import { requireStudentSession } from '../../lib/auth';
import { getChapterEntries } from '../../lib/course-content';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import { buildSubjectCatalog } from '../../lib/curriculum/subject-navigation';
import {
  formatMasteryLevel,
  getNextMasteryLabel,
  getStudentMastery,
} from '../../lib/mastery';
import { buildMasteryRewards } from '../../lib/mastery-rewards';
import { buildStudyRemixDashboardModel } from '../../lib/study-remix';

export default async function DashboardPage() {
  const [session, mastery] = await Promise.all([
    requireStudentSession(),
    getStudentMastery(),
  ]);
  const activeMissions = mastery.revisionMissions
    .filter((mission) => mission.status === 'active')
    .slice(0, 3);
  const recentBadges = mastery.badges.slice(0, 3);
  const bestMasteryScore = mastery.masteries.reduce(
    (best, chapter) => Math.max(best, chapter.masteryScore),
    0,
  );
  const masteryRewards = buildMasteryRewards({
    badges: mastery.badges,
    masteryScore: bestMasteryScore,
  });
  const remixModel = buildStudyRemixDashboardModel({ mastery, session });
  const subjectCatalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  return (
    <main className={styles.page}>
      <PilotEngagementTracker
        eventType="dashboard_view"
        surface="dashboard"
      />

      <StudentTopbar
        contextLabel="Today’s mix"
        session={session}
        streakLabel={remixModel.student.streakLabel}
      />

      <StudyRemixDashboard model={remixModel} />

      <section className="syllabus-library-section dashboard-syllabus-library">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Full syllabus library</p>
            <h2>Study beyond today&apos;s pilot mix.</h2>
          </div>
          <Link className="card-link" href="/subjects">
            Browse all subjects
          </Link>
        </div>
        <p className="syllabus-library-intro">
          Open lesson-wise chapters or use the available revision packs. Chapters
          still being prepared remain labeled coming soon.
        </p>
        <SyllabusLibraryGrid subjects={subjectCatalog} />
      </section>

      <section className={styles.backstageWrap}>
        <details className={styles.backstage} id="backstage">
          <summary className={styles.backstageSummary}>
            <span>
              <span className={styles.backstageEyebrow}>Backstage</span>
              <strong>Your progress, badges, and account tools</strong>
            </span>
            <span className={styles.backstageCounts}>
              <span>
                {mastery.streak?.currentStreakDays ?? 0} day
                {mastery.streak?.currentStreakDays === 1 ? '' : 's'} streak
              </span>
              <span>
                {mastery.badges.length} badge
                {mastery.badges.length === 1 ? '' : 's'}
              </span>
              <span>
                {activeMissions.length} mission
                {activeMissions.length === 1 ? '' : 's'}
              </span>
            </span>
          </summary>

          <div className={styles.backstageContent}>
            <section className={styles.backstageIntro}>
              <div>
                <p className="eyebrow">Personal progress</p>
                <h2>Everything useful, without crowding your mix.</h2>
                <p>
                  Mastery remains personal and honest. Focus time does not
                  change a score or mark a lesson complete.
                </p>
              </div>
              <Link href="/subjects">Browse all subjects</Link>
            </section>

            <section className="dashboard-grid">
              <article className="dashboard-card gamification-card">
                <p>Study streak</p>
                <strong>
                  {mastery.streak?.currentStreakDays ?? 0} day
                  {mastery.streak?.currentStreakDays === 1 ? '' : 's'}
                </strong>
                <span>
                  Longest streak: {mastery.streak?.longestStreakDays ?? 0} day
                  {mastery.streak?.longestStreakDays === 1 ? '' : 's'}
                </span>
              </article>

              {recentBadges.length > 0 ? (
                recentBadges.map((badge) => (
                  <article
                    className="dashboard-card gamification-card"
                    key={`${badge.code}-${badge.awardedAt}`}
                  >
                    <p>{badge.chapterTitle ?? 'Achievement'}</p>
                    <strong>{badge.name}</strong>
                    <span>{badge.description}</span>
                  </article>
                ))
              ) : (
                <article className="dashboard-card gamification-card">
                  <p>Recent badges</p>
                  <strong>Ready to earn</strong>
                  <span>
                    Mark a lesson studied, save a quiz, or complete written
                    practice to earn a personal badge.
                  </span>
                </article>
              )}
            </section>

            <section
              aria-label="Personal mastery milestones"
              className="reward-panel"
            >
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Mastery milestones</p>
                  <h2>Badges and next actions, not public ranks.</h2>
                </div>
                <span className="section-badge">
                  {mastery.badges.length} badge
                  {mastery.badges.length === 1 ? '' : 's'} earned
                </span>
              </div>
              <div className="reward-grid">
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
                    <p>{reward.description}</p>
                    <div className="reward-meta">
                      <span>{formatMasteryLevel(reward.level)}</span>
                      <span>{reward.progressLabel}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-label="Pilot chapter mastery" className="dashboard-grid">
              {remixModel.mixes.map((chapter) => (
                <article
                  className="dashboard-card mastery-card"
                  key={chapter.chapterSlug}
                >
                  <p>{chapter.subject}</p>
                  <strong>{chapter.masteryScore}%</strong>
                  <span>{chapter.chapterTitle}</span>
                  <span className="mastery-level">
                    {chapter.masteryLabel}
                  </span>
                  <div
                    aria-label={`${chapter.masteryScore}% mastered`}
                    className="progress-track"
                  >
                    <span style={{ width: `${chapter.masteryScore}%` }} />
                  </div>
                  <Link
                    className="card-link"
                    href={`/chapters/${chapter.chapterSlug}/notes`}
                    prefetch={false}
                  >
                    {getNextMasteryLabel(chapter.masteryScore)}
                  </Link>
                </article>
              ))}
            </section>

            {activeMissions.length > 0 ? (
              <section className="dashboard-profile mastery-mission-panel">
                <div>
                  <p className="eyebrow">Revision missions</p>
                  <h2>Active mastery targets</h2>
                </div>
                <div className="mission-list compact">
                  {activeMissions.map((mission) => (
                    <Link
                      className="mission-row"
                      href={mission.recommendedActions?.[0]?.href ?? `/chapters/${mission.chapterSlug}/notes`}
                      key={mission.id}
                      prefetch={false}
                    >
                      <span>{mission.subjectName}</span>
                      <strong>{mission.chapterTitle}</strong>
                      <small>{mission.reason}</small>
                      <small>
                        Target: {mission.targetScore}% ·{' '}
                        {mission.recommendedActions?.[0]?.step ??
                          mission.recommendedSteps[0] ??
                          'Review the chapter notes, then retry the quiz.'}
                      </small>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="dashboard-profile mistakes-dashboard-callout">
              <div>
                <p className="eyebrow">Personal revision</p>
                <h2>Turn every mistake into the next study step.</h2>
                <p>
                  Quiz errors, hint use, weak concepts, and missed marking points
                  collect automatically with a three-day retry date.
                </p>
              </div>
              <Link className="button-link" href="/my-mistakes">
                Open My Mistakes
              </Link>
            </section>

            <PilotFeedbackForm surface="dashboard" />

            <section className="dashboard-profile">
              <div>
                <p className="eyebrow">Account snapshot</p>
                <h2>Saved profile details</h2>
              </div>
              <div className="profile-list">
                <div>
                  <span>Name</span>
                  <strong>{session.fullName}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{session.email ?? 'Not set'}</strong>
                </div>
                <div>
                  <span>Role</span>
                  <strong>{session.role}</strong>
                </div>
                <div>
                  <span>Class level</span>
                  <strong>{session.classLevel}</strong>
                </div>
              </div>
            </section>
          </div>
        </details>
      </section>
    </main>
  );
}
