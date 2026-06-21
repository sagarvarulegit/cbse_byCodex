import Link from 'next/link';

import PilotFeedbackForm from '../../components/PilotFeedbackForm';
import PilotEngagementTracker from '../../components/PilotEngagementTracker';
import { logoutAction } from '../auth-actions';
import { requireStudentSession } from '../../lib/auth';
import { formatMasteryLevel, getNextMasteryLabel, getStudentMastery } from '../../lib/mastery';
import { buildMasteryRewards } from '../../lib/mastery-rewards';
import { getPilotChapterCards } from '../../lib/pilot';

const dashboardCards = [
  { label: 'Account status', value: 'Active', hint: 'Your student login is ready for the live pilot.' },
  { label: 'Maths pilot chapter', value: 'Real Numbers', hint: 'Open the chapter notes and start with the live Maths flow.' },
  { label: 'Science pilot chapter', value: 'Chemical Reactions', hint: 'Jump into the Science chapter whenever you want to revise.' },
];

export default async function DashboardPage() {
  const session = await requireStudentSession();
  const mastery = await getStudentMastery();
  const activeMissions = mastery.revisionMissions.slice(0, 3);
  const recentBadges = mastery.badges.slice(0, 3);
  const bestMasteryScore = mastery.masteries.reduce((best, chapter) => Math.max(best, chapter.masteryScore), 0);
  const masteryRewards = buildMasteryRewards({ badges: mastery.badges, masteryScore: bestMasteryScore });
  const pilotChapters = getPilotChapterCards();
  const [pilotPath] = pilotChapters;

  return (
    <main>
      <PilotEngagementTracker eventType="dashboard_view" surface="dashboard" />

      <nav className="topbar" aria-label="Student account navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/subjects">Subjects</Link>
        </div>
        <form action={logoutAction} className="topbar-form">
          <button className="ghost-button" type="submit">
            Logout
          </button>
        </form>
      </nav>

      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <div className="dashboard-hero">
            <p className="eyebrow">Welcome</p>
            <h1>{session.fullName}</h1>
            <p className="subtext compact">Your student account is active for Class {session.classLevel}. Use this hub to enter the live pilot chapters and come back without hunting for links again.</p>
            <div className="auth-inline-actions">
              <Link className="button-link" href="/subjects">
                Open Subjects
              </Link>
            </div>
          </div>

          {pilotPath ? (
            <section className="pilot-path-panel" aria-label="Free pilot study path">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Free pilot path</p>
                  <h2>Start, study, quiz, review.</h2>
                </div>
                <Link className="ghost-link" href="/subjects">
                  Choose chapter
                </Link>
              </div>
              <div className="pilot-path-strip">
                {pilotPath.pathSteps.map((step, index) => (
                  <Link href={step.href} key={step.label}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step.label}</strong>
                  </Link>
                ))}
              </div>
              <div className="dashboard-grid pilot-dashboard-grid">
                {pilotChapters.map((chapter) => (
                  <article className="dashboard-card" key={chapter.slug}>
                    <p>{chapter.subject}</p>
                    <strong>{chapter.title}</strong>
                    <span>{chapter.summary}</span>
                    <div className="pilot-card-actions">
                      <Link className="card-link" href={chapter.notesHref}>
                        Study notes
                      </Link>
                      <Link className="ghost-link" href={chapter.quizHref}>
                        Take quiz
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {mastery.streak || recentBadges.length > 0 ? (
            <section className="dashboard-grid">
              <article className="dashboard-card gamification-card">
                <p>Daily practice streak</p>
                <strong>{mastery.streak?.currentStreakDays ?? 0} day{mastery.streak?.currentStreakDays === 1 ? '' : 's'}</strong>
                <span>Longest streak: {mastery.streak?.longestStreakDays ?? 0} day{mastery.streak?.longestStreakDays === 1 ? '' : 's'}</span>
              </article>
              {recentBadges.map((badge) => (
                <article className="dashboard-card gamification-card" key={`${badge.code}-${badge.awardedAt}`}>
                  <p>{badge.chapterTitle ?? 'Achievement'}</p>
                  <strong>{badge.name}</strong>
                  <span>{badge.description}</span>
                </article>
              ))}
            </section>
          ) : null}

          <section className="reward-panel" aria-label="Personal mastery rewards">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Reward unlocks</p>
                <h2>Personal tools, not public ranks.</h2>
              </div>
              <span className="section-badge">{mastery.badges.length} badge{mastery.badges.length === 1 ? '' : 's'} earned</span>
            </div>
            <div className="reward-grid">
              {masteryRewards.map((reward) => (
                <article className={`reward-card ${reward.state}`} key={reward.level}>
                  <div>
                    <span className="reward-state">{reward.state === 'unlocked' ? 'Unlocked' : reward.isNext ? 'Next unlock' : 'Locked'}</span>
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

          <div className="dashboard-grid">
            {mastery.masteries.length > 0
              ? mastery.masteries.slice(0, 3).map((chapter) => (
                  <article className="dashboard-card mastery-card" key={chapter.chapterSlug}>
                    <p>{chapter.subjectName}</p>
                    <strong>{chapter.masteryScore}%</strong>
                    <span>{chapter.chapterTitle}</span>
                    <span className="mastery-level">{formatMasteryLevel(chapter.level)}</span>
                    <div className="progress-track" aria-label={`${chapter.masteryScore}% mastered`}>
                      <span style={{ width: `${chapter.masteryScore}%` }} />
                    </div>
                    <Link className="card-link" href={`/chapters/${chapter.chapterSlug}`}>
                      {getNextMasteryLabel(chapter.masteryScore)}
                    </Link>
                  </article>
                ))
              : dashboardCards.map((card) => (
                  <article className="dashboard-card" key={card.label}>
                    <p>{card.label}</p>
                    <strong>{card.value}</strong>
                    <span>{card.hint}</span>
                  </article>
                ))}
          </div>

          {activeMissions.length > 0 ? (
            <section className="dashboard-profile mastery-mission-panel">
              <div>
                <p className="eyebrow">Revision missions</p>
                <h2>Active mastery targets</h2>
              </div>
              <div className="mission-list compact">
                {activeMissions.map((mission) => (
                  <Link className="mission-row" href={`/chapters/${mission.chapterSlug}/quiz`} key={mission.id}>
                    <span>{mission.subjectName}</span>
                    <strong>{mission.chapterTitle}</strong>
                    <small>{mission.reason}</small>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

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
      </section>
    </main>
  );
}
