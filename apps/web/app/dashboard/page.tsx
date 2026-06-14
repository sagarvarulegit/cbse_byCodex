import Link from 'next/link';

import { logoutAction } from '../auth-actions';
import { requireStudentSession } from '../../lib/auth';
import { formatMasteryLevel, getNextMasteryLabel, getStudentMastery } from '../../lib/mastery';

const dashboardCards = [
  { label: 'Account status', value: 'Active', hint: 'Your student login is ready for the live pilot.' },
  { label: 'Maths pilot chapter', value: 'Real Numbers', hint: 'Open the chapter notes and start with the live Maths flow.' },
  { label: 'Science pilot chapter', value: 'Chemical Reactions', hint: 'Jump into the Science chapter whenever you want to revise.' },
];

export default async function DashboardPage() {
  const session = await requireStudentSession();
  const mastery = await getStudentMastery();
  const activeMissions = mastery.revisionMissions.slice(0, 3);

  return (
    <main>
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
