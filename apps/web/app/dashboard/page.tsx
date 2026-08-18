import Link from 'next/link';

import PilotFeedbackForm from '../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import StudentTopbar from '../../components/StudentTopbar';
import StudyRemixDashboard from '../../components/StudyRemixDashboard';
import remixStyles from '../../components/study-remix.module.css';
import studioStyles from '../../components/dashboard-studio.module.css';
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
  const recentBadges = mastery.badges.slice(0, 4);
  const bestMasteryScore = mastery.masteries.reduce(
    (best, chapter) => Math.max(best, chapter.masteryScore),
    0,
  );
  const masteryRewards = buildMasteryRewards({
    badges: mastery.badges,
    masteryScore: bestMasteryScore,
  });
  const nextMilestone = masteryRewards.find((r) => r.isNext) ?? masteryRewards[0];

  const remixModel = buildStudyRemixDashboardModel({ mastery, session });
  const subjectCatalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  // Focus on the 4 primary CBSE Class 10 board subjects
  const coreSubjects = subjectCatalog.filter((s) =>
    [
      'mathematics-standard',
      'science',
      'social-science',
      'english-language-and-literature',
    ].includes(s.slug),
  );

  return (
    <main className={remixStyles.page}>
      <PilotEngagementTracker
        eventType="dashboard_view"
        surface="dashboard"
      />

      <StudentTopbar
        contextLabel="Study Studio"
        session={session}
        streakLabel={remixModel.student.streakLabel}
      />

      <div className={studioStyles.studioContainer}>
        {/* ZONE 1: THE STUDY JUKEBOX (HERO) */}
        <section aria-label="Study Jukebox & Focus Mix">
          <StudyRemixDashboard model={remixModel} />
        </section>

        {/* ZONE 2: 4 CORE BOARD SUBJECT STATIONS */}
        <section className={studioStyles.subjectsSection} aria-label="Core CBSE Board Subjects">
          <div className={studioStyles.sectionHeader}>
            <div className={studioStyles.sectionTitleGroup}>
              <p>Academic Hub</p>
              <h2>4 Core Board Subjects</h2>
            </div>
            <Link className={studioStyles.secondaryActionLink} href="/subjects">
              Browse full syllabus catalog →
            </Link>
          </div>

          <div className={studioStyles.subjectsGrid}>
            {coreSubjects.map((subject) => (
              <article className={studioStyles.subjectStationCard} key={subject.slug}>
                <div>
                  <div className={studioStyles.subjectTopline}>
                    <span className={studioStyles.subjectCodeBadge}>Code {subject.subjectCode}</span>
                    <span className={studioStyles.subjectStatusText}>
                      {subject.availableCount > 0 ? `${subject.availableCount} Chapters Live` : 'Coming Soon'}
                    </span>
                  </div>
                  <h3>{subject.title}</h3>
                  <p>{subject.description}</p>
                </div>

                <div>
                  <div className={studioStyles.subjectMetaRow}>
                    <span>{subject.chapterCount} Syllabus Units</span>
                    <span>•</span>
                    <span>NCERT Aligned</span>
                  </div>

                  <div className={studioStyles.subjectActionButtons}>
                    <Link
                      className={studioStyles.btnNotes}
                      href={`/subjects/${subject.slug}`}
                    >
                      📖 Notes
                    </Link>
                    <Link
                      className={studioStyles.btnMock}
                      href="/exam-papers"
                    >
                      📄 Mock Papers
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ZONE 3: PRACTICE & REVISION HUB (2 BALANCED COLUMNS) */}
        <section aria-label="Practice and Revision Hub">
          <div className={studioStyles.practiceHubGrid}>
            {/* Card A: Official Board Mock Test Series */}
            <article className={studioStyles.hubCardMock}>
              <div>
                <div className={studioStyles.hubHeader}>
                  <p>Flagship Exam Simulator</p>
                  <h3>Board Mock Test Series</h3>
                  <span>
                    Full 80-mark, 3-hour CBSE board papers with strict marking scheme, CBT timer, and instant weak-chapter diagnostics. <strong>Mock Paper 1 is free</strong> across Maths, Science, SST, and English.
                  </span>
                </div>
              </div>

              <div className={studioStyles.hubActions}>
                <Link className={studioStyles.primaryActionBtn} href="/exam-papers" prefetch={false}>
                  Take a Mock Test →
                </Link>
                <Link className={studioStyles.secondaryActionLink} href="/exam-papers/attempts" prefetch={false}>
                  My Attempt History &amp; Weak Areas
                </Link>
              </div>
            </article>

            {/* Card B: Smart Revision & Mistake Vault */}
            <article className={studioStyles.hubCardMistakes}>
              <div>
                <div className={studioStyles.hubHeader}>
                  <p>Spaced Repetition</p>
                  <h3>My Mistakes &amp; Revision Vault</h3>
                  <span>
                    Every quiz mistake, hinted question, and missed marking point is collected with a 3-day spaced retry date so you never repeat the same error.
                  </span>
                </div>

                {activeMissions.length > 0 ? (
                  <div className={studioStyles.missionPreviewList}>
                    {activeMissions.slice(0, 2).map((mission) => (
                      <Link
                        className={studioStyles.missionItem}
                        href={mission.recommendedActions?.[0]?.href ?? `/chapters/${mission.chapterSlug}/notes`}
                        key={mission.id}
                        prefetch={false}
                      >
                        <div>
                          <strong>{mission.chapterTitle}</strong>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: '#666' }}>
                            {mission.reason}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c95014' }}>
                          Retry →
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className={studioStyles.hubActions}>
                <Link className={studioStyles.primaryActionBtn} href="/my-mistakes" prefetch={false}>
                  Open My Mistakes Vault →
                </Link>
                {activeMissions.length > 0 ? (
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0b7a48' }}>
                    {activeMissions.length} active revision target{activeMissions.length === 1 ? '' : 's'}
                  </span>
                ) : null}
              </div>
            </article>
          </div>
        </section>

        {/* ZONE 4: STUDIO TROPHIES & MILESTONES SHELF */}
        <section className={studioStyles.milestonesShelf} aria-label="Studio Trophies and Milestones">
          <div className={studioStyles.sectionTitleGroup}>
            <p>Personal Mastery</p>
            <h2>Studio Trophies &amp; Milestones</h2>
          </div>

          <div className={studioStyles.milestonesGrid}>
            <div className={studioStyles.streakCard}>
              <span>Study Streak</span>
              <strong>{mastery.streak?.currentStreakDays ?? 0} Day{mastery.streak?.currentStreakDays === 1 ? '' : 's'} 🔥</strong>
              <span>Longest streak: {mastery.streak?.longestStreakDays ?? 0} days</span>
            </div>

            <div>
              <div className={studioStyles.badgesTray}>
                {recentBadges.length > 0 ? (
                  recentBadges.map((badge) => (
                    <span className={studioStyles.badgePill} key={`${badge.code}-${badge.awardedAt}`}>
                      🏆 <strong>{badge.name}</strong>
                    </span>
                  ))
                ) : (
                  <span className={studioStyles.badgePillEmpty}>
                    Complete a lesson note, save a quiz, or take a mock test to earn your first studio trophy!
                  </span>
                )}
              </div>
            </div>

            {nextMilestone ? (
              <div className={studioStyles.nextMilestoneBadge}>
                <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', color: '#c95014', display: 'block' }}>
                  Next Milestone
                </span>
                <strong>{nextMilestone.rewardName}</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '2px' }}>
                  {nextMilestone.progressLabel}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* ZONE 5: ACCOUNT DETAILS & FEEDBACK (COMPACT) */}
        <details className={studioStyles.accountToolsDetails}>
          <summary className={studioStyles.accountToolsSummary}>
            <span>Account Profile &amp; Pilot Feedback</span>
            <span>+</span>
          </summary>
          <div className={studioStyles.accountToolsContent}>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#787168', textTransform: 'uppercase', fontWeight: 800 }}>Student</p>
              <strong>{session.fullName}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>{session.email ?? 'No email'}</p>
              <Link href="/profile" style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.8125rem', fontWeight: 800, color: '#c25e00', textDecoration: 'underline' }}>
                ⚙️ Edit Profile &amp; Phone →
              </Link>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#787168', textTransform: 'uppercase', fontWeight: 800 }}>Class Level</p>
              <strong>{session.classLevel}</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#555' }}>Role: {session.role}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.75rem', color: '#787168', textTransform: 'uppercase', fontWeight: 800 }}>Purchases &amp; Passes</p>
              <Link href="/orders" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#c25e00', textDecoration: 'underline' }}>
                📦 View Order History &amp; Receipts →
              </Link>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PilotFeedbackForm surface="dashboard" />
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}
