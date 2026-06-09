import Link from 'next/link';

import { logoutAction } from './auth-actions';
import { getStudentSession } from '../lib/auth';

const signupReasons = [
  {
    title: 'Keep your Class 10 study links in one place',
    body: 'Create one account and open Maths and Science pilot chapters from a single student hub.',
    accent: 'blue',
    badge: 'Student hub',
    href: '/register',
    cta: 'Create account',
  },
  {
    title: 'Start with free live chapters before the full rollout',
    body: 'The pilot already includes real notes and chapter flows, so students can try the experience before more subjects go live.',
    accent: 'green',
    badge: 'Free pilot',
    href: '/chapters/real-numbers',
    cta: 'Open Real Numbers',
  },
  {
    title: 'Return faster instead of searching through PDFs again',
    body: 'Login makes the platform your study home, so you can come back directly when you want to revise.',
    accent: 'blue',
    badge: 'Less friction',
    href: '/login',
    cta: 'Login now',
  },
  {
    title: 'Be ready as new chapters and quizzes are added',
    body: 'Students who create accounts are already inside the system when new Maths and Science content starts shipping.',
    accent: 'green',
    badge: 'Ready for updates',
    href: '/register',
    cta: 'Join early',
  },
];

const sampleChapters = [
  {
    name: 'Mathematics',
    chapter: 'Real Numbers',
    progress: 100,
    mastery: 'Live now',
    minutes: '46 min',
    accent: 'blue',
    href: '/chapters/real-numbers',
    topics: ['Euclid division lemma', 'HCF and LCM', 'Irrational numbers'],
  },
  {
    name: 'Science',
    chapter: 'Chemical Reactions and Equations',
    progress: 100,
    mastery: 'Live now',
    minutes: '44 min',
    accent: 'green',
    href: '/chapters/chemical-reactions-and-equations',
    topics: ['Balancing equations', 'Reaction types', 'Oxidation and reduction'],
  },
];

const modernStudyMoves = [
  {
    label: 'Concept first, memorization second',
    detail: 'Students should understand the idea in simple English before they are asked to remember formulas or definitions.',
    note: 'Clearer understanding',
  },
  {
    label: 'Visual notes over textbook wall-of-text',
    detail: 'Comic recap patterns, worked examples, and compact sections make revision feel lighter and easier to re-open.',
    note: 'Modern format',
  },
  {
    label: 'One platform instead of scattered notes',
    detail: 'Account-based access turns the portal into a repeatable study place rather than just another link to forget.',
    note: 'Better recall loop',
  },
];

export default async function HomePage() {
  const session = await getStudentSession();

  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links">
          <a href="#why-account">Why account</a>
          <a href="#sample-chapters">Sample chapters</a>
          <a href="#modern-study">Modern study</a>
        </div>
        <div className="topbar-actions">
          {session ? (
            <>
              <Link className="nav-cta" href="/dashboard">
                Dashboard
              </Link>
              <form action={logoutAction} className="topbar-form">
                <button className="ghost-button" type="submit">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link className="ghost-link" href="/login">
                Login
              </Link>
              <Link className="nav-cta" href="/register">
                Create free account
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">CBSE Class 10, redesigned for today</p>
          <h1>Make Class 10 prep feel clear, visual, and easy to restart.</h1>
          <p className="subtext">
            CBSE Sprint is built for students who are tired of messy PDFs, textbook overload, and random YouTube hopping. Create a free account to enter a cleaner study flow with live pilot chapters, simpler notes, and one home for revision.
          </p>
          <div className="hero-actions">
            <Link className="button-link" href={session ? '/dashboard' : '/register'}>
              {session ? 'Open student dashboard' : 'Create free account'}
            </Link>
            <Link className="ghost-link" href="/chapters/real-numbers">
              Try Real Numbers first
            </Link>
          </div>
        </div>

        <aside className="learning-console" aria-label="Why students should create an account">
          <div className="console-header">
            <div>
              <p className="eyebrow">Why join</p>
              <h2>Create your study account</h2>
            </div>
            <span className="live-pill">Free start</span>
          </div>

          <div className="video-preview">
            <div className="play-orb">Join</div>
            <div>
              <p>Modern Class 10 study flow</p>
              <strong>Visual notes, chapter access, and one place to come back to</strong>
            </div>
          </div>

          <div className="metric-row">
            <div className="metric-tile">
              <span>1 login</span>
              <p>Keep Maths and Science pilot content in one student hub.</p>
            </div>
            <div className="metric-tile">
              <span>Free pilot</span>
              <p>Try live chapters before the full platform expands.</p>
            </div>
            <div className="metric-tile">
              <span>New drops</span>
              <p>Be ready when more chapters, quizzes, and revision flows launch.</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="section-shell" id="why-account">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Why students create an account</p>
            <h2>Give them a reason to enter, not just browse.</h2>
          </div>
        </div>
        <div className="chapter-grid" aria-label="Reasons to create an account">
          {signupReasons.map((reason) => (
            <article className={`chapter-card ${reason.accent}`} key={reason.title}>
              <div className="chapter-topline">
                <span>Student benefit</span>
                <strong>{reason.badge}</strong>
              </div>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
              <Link className="card-link" href={reason.href}>
                {reason.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell" id="sample-chapters">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Try the product now</p>
            <h2>Live pilot chapters students can open today</h2>
          </div>
        </div>
        <div className="chapter-grid" aria-label="Live pilot chapters">
          {sampleChapters.map((subject) => (
            <article className={`chapter-card ${subject.accent}`} key={subject.name}>
              <div className="chapter-topline">
                <span>{subject.name}</span>
                <strong>{subject.mastery}</strong>
              </div>
              <h3>{subject.chapter}</h3>
              <p>{subject.minutes} of bite-sized notes, examples, and revision-friendly structure.</p>
              <div className="progress-track" aria-label={`${subject.progress}% available now`}>
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

      <section className="section-shell mission-layout" id="modern-study">
        <div>
          <p className="eyebrow">Why this feels modern</p>
          <h2>Students do not want another boring content dump.</h2>
          <p className="subtext compact">
            The pitch should be simple: less confusion, faster restart, cleaner revision, and content that respects how students actually study online now.
          </p>
        </div>
        <div className="mission-board">
          {modernStudyMoves.map((item) => (
            <div className="mission-row" key={item.label}>
              <span className="check done">New</span>
              <p>{item.label}<br />{item.detail}</p>
              <strong>{item.note}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
