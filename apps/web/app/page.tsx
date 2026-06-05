import Link from 'next/link';

const subjects = [
  {
    name: 'Mathematics',
    chapter: 'Real Numbers',
    progress: 42,
    mastery: 'Improving',
    minutes: '38 min',
    accent: 'blue',
    href: '/chapters/real-numbers',
    topics: ['Prime factorisation', 'HCF and LCM', 'Irrational numbers'],
  },
  {
    name: 'Science',
    chapter: 'Chemical Reactions and Equations',
    progress: 28,
    mastery: 'Getting started',
    minutes: '44 min',
    accent: 'green',
    href: '/chapters/chemical-reactions-and-equations',
    topics: ['Balancing equations', 'Reaction types', 'Oxidation and reduction'],
  },
];

const missions = [
  { label: 'Watch one concept video', xp: '+30 XP', done: true },
  { label: 'Score 80% in a topic quiz', xp: '+45 XP', done: false },
  { label: 'Revise yesterday\'s weak topic', xp: '+20 XP', done: false },
];

export default function HomePage() {
  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links">
          <a href="#chapters">Chapters</a>
          <a href="#dashboard">Progress</a>
          <a href="#missions">Streaks</a>
        </div>
        <Link className="nav-cta" href="/chapters/real-numbers">
          Resume
        </Link>
      </nav>

      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">CBSE Class 10 premium learning</p>
          <h1>Study like a topper, one animated concept at a time.</h1>
          <p className="subtext">
            Short videos, sharp notes, practice quizzes, mastery tracking, and daily streaks built
            for Maths and Science revision.
          </p>
          <div className="hero-actions">
            <Link className="button-link" href="/chapters/real-numbers">
              Start free lesson
            </Link>
            <Link className="ghost-link" href="/chapters/chemical-reactions-and-equations">
              Explore Science
            </Link>
          </div>
        </div>

        <aside className="learning-console" aria-label="Student learning dashboard preview">
          <div className="console-header">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Real Numbers</h2>
            </div>
            <span className="live-pill">Live class ready</span>
          </div>

          <div className="video-preview">
            <div className="play-orb">Play</div>
            <div>
              <p>Animated explainer</p>
              <strong>Fundamental theorem of arithmetic</strong>
            </div>
          </div>

          <div className="metric-row" id="dashboard">
            <div className="metric-tile">
              <span>7</span>
              <p>day streak</p>
            </div>
            <div className="metric-tile">
              <span>1,240</span>
              <p>XP earned</p>
            </div>
            <div className="metric-tile">
              <span>82%</span>
              <p>quiz best</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-shell" id="chapters">
        <div className="section-heading">
          <p className="eyebrow">Pilot chapters</p>
          <h2>Your next study moves</h2>
        </div>
        <div className="chapter-grid" aria-label="Pilot subjects">
          {subjects.map((subject) => (
            <article className={`chapter-card ${subject.accent}`} key={subject.name}>
              <div className="chapter-topline">
                <span>{subject.name}</span>
                <strong>{subject.mastery}</strong>
              </div>
              <h3>{subject.chapter}</h3>
              <p>{subject.minutes} of bite-sized animated lessons and whiteboard practice.</p>
              <div className="progress-track" aria-label={`${subject.progress}% complete`}>
                <span style={{ width: `${subject.progress}%` }} />
              </div>
              <ul>
                {subject.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <Link className="card-link" href={subject.href}>
                View chapter
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mission-layout" id="missions">
        <div>
          <p className="eyebrow">Daily streaks</p>
          <h2>Small wins that keep students consistent.</h2>
          <p className="subtext compact">
            The app should reward real learning actions: watching, solving, revising, and improving
            weak topics.
          </p>
        </div>
        <div className="mission-board">
          {missions.map((mission) => (
            <div className="mission-row" key={mission.label}>
              <span className={mission.done ? 'check done' : 'check'}>{mission.done ? 'Done' : ''}</span>
              <p>{mission.label}</p>
              <strong>{mission.xp}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
