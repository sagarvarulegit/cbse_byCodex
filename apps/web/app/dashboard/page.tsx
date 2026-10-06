import Link from 'next/link';

import BoardReadinessGauge from '../../components/BoardReadinessGauge';
import NewStudentStarterQuest from '../../components/NewStudentStarterQuest';
import PilotFeedbackForm from '../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import QuickToolsLaunchpad from '../../components/QuickToolsLaunchpad';
import StudentTopbar from '../../components/StudentTopbar';
import TodayStudyMissionCard from '../../components/TodayStudyMissionCard';
import WeakAreaDiagnosticsCard, { type DiagnosticItem } from '../../components/WeakAreaDiagnosticsCard';
import remixStyles from '../../components/study-remix.module.css';
import studioStyles from '../../components/dashboard-studio.module.css';
import { getStudentSessionToken, requireStudentSession } from '../../lib/auth';
import { getChapter, getChapterEntries } from '../../lib/course-content';
import { getVisibleCurriculumSubjects } from '../../lib/curriculum/registry';
import { buildSubjectCatalog } from '../../lib/curriculum/subject-navigation';
import { listExamPaperAttempts } from '../../lib/exam-papers';
import { getStudentMastery } from '../../lib/mastery';
import { buildMasteryRewards } from '../../lib/mastery-rewards';
import { fetchStudentEntitlements } from '../../lib/payments';
import { buildStudyRemixDashboardModel } from '../../lib/study-remix';

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

  // 1. Compute Real-Time Board Readiness Score
  const chaptersWithScore = mastery.masteries.filter((m) => m.bestQuizScorePercent > 0);
  const quizScorePercent = chaptersWithScore.length > 0
    ? chaptersWithScore.reduce((sum, m) => sum + m.bestQuizScorePercent, 0) / chaptersWithScore.length
    : 0;

  const mockScorePercent = attemptsData?.aggregate?.averagePercent ?? null;
  const chaptersCompleted = mastery.masteries.filter((m) => m.masteryScore > 0).length;
  const totalChapters = subjectCatalog.reduce((sum, s) => sum + s.chapterCount, 0) || 48;

  let compositeReadinessPercent = 10;
  if (mockScorePercent !== null && chaptersWithScore.length > 0) {
    compositeReadinessPercent = Math.round(
      quizScorePercent * 0.4 +
      mockScorePercent * 0.4 +
      (chaptersCompleted / totalChapters) * 100 * 0.2,
    );
  } else if (chaptersWithScore.length > 0) {
    compositeReadinessPercent = Math.round(
      quizScorePercent * 0.65 +
      (chaptersCompleted / totalChapters) * 100 * 0.35,
    );
  } else {
    compositeReadinessPercent = Math.max(10, Math.round((chaptersCompleted / totalChapters) * 100 * 0.5));
  }

  // Detect brand new students who haven't completed any quiz or mock test yet
  const isNewStudent =
    chaptersCompleted === 0 &&
    chaptersWithScore.length === 0 &&
    (attemptsData?.attempts?.length ?? 0) === 0;

  // 2. Build Weak Area Diagnostics
  const diagnostics: DiagnosticItem[] = [];
  
  // From Revision Missions
  activeMissions.forEach((mission) => {
    const chapter = getChapter(mission.chapterSlug);
    diagnostics.push({
      chapterSlug: mission.chapterSlug,
      chapterTitle: mission.chapterTitle,
      subjectName: mission.subjectName || chapter?.subject || 'Mathematics',
      issueReason: mission.reason || 'Targeted for spaced memory reinforcement',
      remedialHref: mission.recommendedActions?.[0]?.href ?? `/chapters/${mission.chapterSlug}/notes`,
      priority: 'high',
    });
  });

  // From Mock Test Weak Chapter Slugs
  if (attemptsData?.weakAreas?.weakChapterSlugs) {
    attemptsData.weakAreas.weakChapterSlugs.forEach((slug) => {
      if (!diagnostics.some((d) => d.chapterSlug === slug)) {
        const chapter = getChapter(slug);
        if (chapter) {
          diagnostics.push({
            chapterSlug: slug,
            chapterTitle: chapter.title,
            subjectName: chapter.subject || 'Science',
            issueReason: 'Missed questions in recent 80-mark mock paper',
            remedialHref: `/chapters/${slug}/notes`,
            priority: 'medium',
          });
        }
      }
    });
  }

  const latestAttempt = attemptsData?.attempts?.[0];
  const latestMockScore = latestAttempt
    ? {
        earned: latestAttempt.earnedMarks,
        total: latestAttempt.totalMarks,
        paperTitle: latestAttempt.paperTitle,
      }
    : null;

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
        {/* COMPACT ACTIVE PURCHASES QUICK ACCESS RIBBON */}
        {entitlementsData && entitlementsData.entitlements.some((e) => e.status === 'active') ? (
          <section aria-label="Active Purchases">
            <div className={studioStyles.activePurchasesBar}>
              <div className={studioStyles.activePurchasesLeft}>
                <span style={{ fontSize: '1.25rem' }}>🎉</span>
                <div>
                  <strong className={studioStyles.activePurchasesTitle}>
                    Active Study Packs ({entitlementsData.entitlements.filter((e) => e.status === 'active').length} Unlocked)
                  </strong>
                  <span className={studioStyles.activePurchasesSubtitle}>
                    {' '}— Lifetime board revision access active
                  </span>
                </div>
              </div>
              <div className={studioStyles.activePurchasesPills}>
                {entitlementsData.entitlements.some(
                  (e) =>
                    (e.productKey === 'cbse10-formula-cheatsheet-pack' ||
                      e.productKey === 'cbse10-activity-formula-combo') &&
                    e.status === 'active',
                ) && (
                  <Link
                    href="/formula-cheatsheets"
                    className={studioStyles.activePillGreen}
                  >
                    ⚡ Formula Cheatsheets →
                  </Link>
                )}
                {entitlementsData.entitlements.some(
                  (e) =>
                    (e.productKey === 'cbse10-activity-diagram-pack' ||
                      e.productKey === 'cbse10-activity-formula-combo') &&
                    e.status === 'active',
                ) && (
                  <Link
                    href="/activities-and-diagrams"
                    className={studioStyles.activePillBlue}
                  >
                    🔬 NCERT Activities →
                  </Link>
                )}
                {entitlementsData.entitlements.some(
                  (e) =>
                    (e.productKey === 'cbse10-science-ch1-5-pack' ||
                      e.productKey === 'cbse10-mock-pass-science' ||
                      e.isAllSubjects) &&
                    e.status === 'active',
                ) && (
                  <Link
                    href="/science-pack"
                    className={studioStyles.activePillOrange}
                  >
                    🧪 Science Ch 1–5 Pack →
                  </Link>
                )}
                <Link
                  href="/orders"
                  className={studioStyles.activePillNeutral}
                >
                  📦 All Purchases &amp; Receipts
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {/* ZONE 1: MOMENTUM & TODAY'S MISSION HERO */}
        {isNewStudent ? (
          <NewStudentStarterQuest studentName={session.fullName} />
        ) : (
          <TodayStudyMissionCard studentName={session.fullName} />
        )}

        {/* ZONE 2: 4 CORE BOARD SUBJECTS HUB (PROMOTED TO TOP) */}
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
            {coreSubjects.map((subject) => {
              const completedCount = mastery.masteries.filter((m) =>
                m.subjectName.toLowerCase().includes(subject.title.toLowerCase()) && m.masteryScore > 0,
              ).length;
              const progressPct = subject.chapterCount > 0 ? Math.min(100, Math.round((completedCount / subject.chapterCount) * 100)) : 0;

              return (
                <article className={studioStyles.subjectStationCard} key={subject.slug}>
                  <div>
                    <div className={studioStyles.subjectTopline}>
                      <span className={studioStyles.subjectCodeBadge}>Code {subject.subjectCode}</span>
                      <span className={studioStyles.subjectStatusText}>
                        {completedCount > 0 ? `${completedCount}/${subject.chapterCount} Mastered` : `${subject.availableCount} Chapters Live`}
                      </span>
                    </div>
                    <h3>{subject.title}</h3>
                    <p>{subject.description}</p>
                  </div>

                  <div>
                    <div className={studioStyles.subjectMetaRow}>
                      <span>{subject.chapterCount} Units</span>
                      <span>•</span>
                      <span>{progressPct > 0 ? `${progressPct}% Covered` : 'NCERT Aligned'}</span>
                    </div>

                    <div className={studioStyles.subjectProgressBarWrap}>
                      <div
                        className={studioStyles.subjectProgressBarFill}
                        style={{ width: `${Math.max(progressPct > 0 ? progressPct : 4, 4)}%`, opacity: progressPct > 0 ? 1 : 0.25 }}
                      />
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
              );
            })}
          </div>
        </section>

        {/* ZONE 3: TWO-COLUMN PERFORMANCE & DIAGNOSTICS DECK */}
        <section className={studioStyles.performanceDeckSection} aria-label="Performance and Diagnostics Deck">
          <div className={studioStyles.sectionHeader}>
            <div className={studioStyles.sectionTitleGroup}>
              <p>Continuous Evaluation</p>
              <h2>Board Exam Readiness &amp; Action Plan</h2>
            </div>
            <Link className={studioStyles.secondaryActionLink} href="/my-mistakes">
              Open Mistake Vault →
            </Link>
          </div>

          <div className={studioStyles.performanceGrid}>
            <BoardReadinessGauge
              scorePercent={compositeReadinessPercent}
              quizScorePercent={quizScorePercent}
              mockScorePercent={mockScorePercent}
              chaptersCompleted={chaptersCompleted}
              totalChapters={totalChapters}
              streakDays={mastery.streak?.currentStreakDays ?? 0}
              isNewStudent={isNewStudent}
              deckMode
            />

            <WeakAreaDiagnosticsCard
              diagnostics={diagnostics}
              pendingMistakesCount={activeMissions.length}
              latestMockScore={latestMockScore}
              deckMode
            />
          </div>
        </section>

        {/* ZONE 4: HIGH-YIELD PRACTICE & REVISION BOOSTERS */}
        <QuickToolsLaunchpad />

        {/* ZONE 5: STUDIO TROPHIES & MILESTONES SHELF */}
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

        {/* ZONE 6: ACCOUNT DETAILS & FEEDBACK (COMPACT) */}
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
