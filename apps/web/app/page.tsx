import Link from 'next/link';

import BrandLockup from '../components/BrandLockup';
import { AuthAwareCTA, AuthAwareText } from '../components/AuthAwareCTA';
import AICoachShowcase from '../components/AICoachShowcase';
import HomeFAQ from '../components/HomeFAQ';

export const revalidate = false;
import { getChapterEntries } from '../lib/course-content';
import { getVisibleCurriculumSubjects } from '../lib/curriculum/registry';
import { buildSubjectCatalog } from '../lib/curriculum/subject-navigation';
import { getPilotChapterCards } from '../lib/pilot';

const goalCards = [
  {
    icon: '📖',
    title: 'Learn a Chapter',
    desc: 'Understand concepts step-by-step with simple, NCERT-aligned explanations and visual memory tricks.',
    ctaText: 'Start Learning →',
    href: '#subjects',
    isAnchor: true,
  },
  {
    icon: '✍️',
    title: 'Practice Questions',
    desc: 'Test yourself with instant quizzes and practice problems based on what you just learned.',
    ctaText: 'Practice Now →',
    href: '/quizzes',
    isAnchor: false,
  },
  {
    icon: '🎯',
    title: 'Prepare for Boards',
    desc: 'Practice 3-hour CBT mock papers, step-wise marking schemes, and weak-topic diagnostics.',
    ctaText: 'Prepare for Boards →',
    href: '#board-prep',
    isAnchor: true,
  },
];

const howItWorksFlow = [
  {
    step: '01',
    title: 'Pick a Chapter',
    desc: 'Choose any chapter from your active CBSE Class 10 syllabus.',
  },
  {
    step: '02',
    title: 'Learn',
    desc: 'Understand concepts with simple bullet points, memory hooks, and redrawn diagrams.',
  },
  {
    step: '03',
    title: 'Practice',
    desc: 'Solve topic-wise questions immediately after learning to lock in recall.',
  },
  {
    step: '04',
    title: 'Master',
    desc: 'Identify weak spots automatically in your Mistake Vault with spaced retries.',
  },
  {
    step: '05',
    title: 'Revise',
    desc: 'Quickly refresh formulas and key takeaways right before your tests.',
  },
];

const whyChapterReadyBenefits = [
  {
    icon: '📚',
    title: 'NCERT Aligned',
    desc: 'Built strictly around the CBSE/NCERT curriculum so students revise what actually matters in school.',
  },
  {
    icon: '💡',
    title: 'Simple Explanations',
    desc: 'Dense, intimidating textbook paragraphs converted into clear, easy-to-grasp points and memory tricks.',
  },
  {
    icon: '✍️',
    title: 'Practice While Learning',
    desc: 'Don’t wait until exam eve to test yourself. Check your understanding after every single topic.',
  },
  {
    icon: '⚡',
    title: 'Revision Ready',
    desc: 'Complete one-sheet formula summaries and key takeaways designed for fast 5-minute pre-test refreshers.',
  },
  {
    icon: '🎨',
    title: 'Interactive Visuals',
    desc: 'Redrawn vector diagrams and experiments with clear observation pins make difficult concepts click.',
  },
];

const exploreCards = [
  {
    icon: '📊',
    title: 'Board PYQ Trends & Weightage',
    desc: '5-year chapter weightage heatmaps, 5-mark recurring questions, and CBSE step-marking patterns.',
    href: '/pyq-trends',
    badge: 'Exam Analytics',
  },
  {
    icon: '🧪',
    title: 'Virtual Labs & Diagrams',
    desc: 'Explore redrawn NCERT experiments, apparatus setups, and observation keys in crystal-clear vector graphics.',
    href: '/activities-and-diagrams',
    badge: 'Visual Learning',
  },
  {
    icon: '⚡',
    title: 'Formula Cheatsheets',
    desc: 'Chapter-wise formulas, unit conversions, and symbol keys for rapid pre-exam revision.',
    href: '/formula-cheatsheets',
    badge: 'Quick Revision',
  },
  {
    icon: '🎮',
    title: 'Arcade & Formula Rush',
    desc: 'Practice active recall through fast, engaging challenges and speed tests.',
    href: '/games',
    badge: 'Gamified Recall',
  },
  {
    icon: '🤖',
    title: 'AI Learning Coach',
    desc: 'Ask questions, get step-by-step hints, or ask for simple analogies whenever you get stuck.',
    href: '#ai-coach',
    badge: 'Socratic Tutor',
  },
];

export default async function HomePage() {
  const sampleChapters = getPilotChapterCards();
  const subjectCatalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );

  return (
    <main className="home-page">
      {/* Top Announcement Strip */}
      <div className="home-announcement-banner">
        <span className="banner-badge">✨ CLASS 10 LEARNING HUB</span>
        <span className="banner-text">
          <strong>Simplified NCERT Notes, Practice & Board Mock Exams</strong> · 100% Free to start learning.
        </span>
        <a className="banner-link" href="#subjects">
          Explore Subjects ↓
        </a>
      </div>

      {/* Main Navigation Topbar */}
      <nav className="topbar home-topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <BrandLockup />
        </Link>

        <div className="home-topbar-actions">
          <a className="ghost-link" href="#subjects">
            Subjects
          </a>
          <Link className="ghost-link" href="/quizzes">
            Practice
          </Link>
          <Link className="ghost-link" href="/activities-and-diagrams">
            Activities
          </Link>
          <Link className="ghost-link" href="/games">
            Arcade
          </Link>
          <a className="ghost-link highlight-prep" href="#board-prep">
            Board Prep
          </a>
          <AuthAwareCTA
            className="nav-cta"
            hrefLoggedIn="/dashboard"
            hrefLoggedOut="/login"
            textLoggedIn="Dashboard"
            textLoggedOut="Login"
          />
        </div>
      </nav>

      {/* 1. Focused Hero Section */}
      <section className="home-hero-focused" aria-labelledby="hero-title">
        <div className="hero-focused-inner">
          <div className="hero-eyebrow-pill">
            <span className="pill-dot"></span>
            <AuthAwareText
              textLoggedIn="Welcome back to your study hub!"
              textLoggedOut="CBSE CLASS 10 • NCERT ALIGNED"
            />
          </div>

          <h1 id="hero-title" className="hero-focused-title">
            Master Class 10,
            <br />
            one chapter at a time.
          </h1>

          <p className="hero-focused-subtext">
            Learn every chapter. Practice what you learned.
            Revise with confidence and prepare for your CBSE Boards.
          </p>

          {/* Primary & Secondary Action */}
          <div className="hero-focused-actions">
            <a href="#goals" className="hero-btn-primary">
              Start Learning
            </a>
            <a href="#subjects" className="hero-btn-secondary">
              Explore Subjects
            </a>
          </div>

          {/* Core Product Journey Visual */}
          <div className="hero-journey-strip" aria-label="Learning Journey">
            <span className="journey-node">Learn</span>
            <span className="journey-arrow">→</span>
            <span className="journey-node">Practice</span>
            <span className="journey-arrow">→</span>
            <span className="journey-node">Master</span>
            <span className="journey-arrow">→</span>
            <span className="journey-node">Revise</span>
            <span className="journey-arrow">→</span>
            <span className="journey-node journey-highlight">Board Ready</span>
          </div>
        </div>
      </section>

      {/* 2. "What do you want to do today?" Section */}
      <section className="home-section home-goals-section" id="goals" aria-labelledby="goals-title">
        <div className="home-section-heading centered-heading">
          <p className="eyebrow">Choose Your Goal</p>
          <h2 id="goals-title">What do you want to do today?</h2>
          <p className="home-section-subtext">
            Choose what you want to accomplish right now and jump straight in.
          </p>
        </div>

        <div className="home-goals-grid">
          {goalCards.map((card) => (
            <div key={card.title} className="goal-card">
              <span className="goal-icon" aria-hidden="true">{card.icon}</span>
              <h3 className="goal-title">{card.title}</h3>
              <p className="goal-desc">{card.desc}</p>
              {card.isAnchor ? (
                <a href={card.href} className="goal-action-btn">
                  {card.ctaText}
                </a>
              ) : (
                <Link href={card.href} className="goal-action-btn">
                  {card.ctaText}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. Subject Launcher ("What are you studying today?") */}
      <section className="home-section home-subjects-section" id="subjects" aria-labelledby="subjects-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Your Class 10 Library</p>
            <h2 id="subjects-title">What are you studying today?</h2>
          </div>
          <p className="home-section-note">
            Select a subject to explore chapter notes, formulas, diagrams, and quizzes.
          </p>
        </div>

        <div className="home-subject-grid">
          {subjectCatalog.map((subject, index) => (
            <Link
              className="home-subject-card modern-subject-card"
              href={`/subjects/${subject.slug}`}
              key={subject.slug}
            >
              <div className="subject-card-header">
                <span className="subject-num-badge">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="subject-status-pill">
                  {subject.liveCount > 0 ? `${subject.liveCount} Chapters Available` : 'Coming Soon'}
                </span>
              </div>

              <div className="subject-card-body">
                <strong className="subject-title-text">{subject.title}</strong>
                <p className="subject-meta-text">
                  NCERT-aligned notes, redrawn diagrams, and chapter quizzes.
                </p>
              </div>

              <div className="subject-card-footer">
                <span className="subject-action-link">Explore {subject.title}</span>
                <span className="home-card-arrow" aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. How ChapterReady Works (One Chapter. Everything You Need.) */}
      <section className="home-section home-how-it-works" aria-labelledby="how-it-works-title">
        <div className="home-section-heading centered-heading">
          <p className="eyebrow">The ChapterReady Method</p>
          <h2 id="how-it-works-title">One chapter. Everything you need.</h2>
          <p className="home-section-subtext">
            ChapterReady turns every CBSE chapter into a complete, 5-step learning journey.
          </p>
        </div>

        <div className="how-flow-container">
          {howItWorksFlow.map((item, idx) => (
            <div key={item.step} className="flow-step-node">
              <div className="flow-step-top">
                <span className="flow-step-num">{item.step}</span>
                <span className="flow-step-title">{item.title}</span>
              </div>
              <p className="flow-step-desc">{item.desc}</p>
              {idx < howItWorksFlow.length - 1 && (
                <span className="flow-connector-arrow" aria-hidden="true">↓</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Popular Chapters */}
      <section className="home-section" aria-labelledby="guided-chapters-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Start Instantly</p>
            <h2 id="guided-chapters-title">Popular with Class 10 Students</h2>
          </div>
          <a className="home-text-link" href="#subjects">
            View all subjects <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="home-chapter-grid">
          {sampleChapters.map((chapter) => (
            <Link
              className="home-chapter-card"
              href={chapter.notesHref}
              key={chapter.slug}
              prefetch={false}
            >
              <div className="home-card-topline">
                <span>{chapter.subject}</span>
                <strong>{chapter.status}</strong>
              </div>
              <h3>{chapter.title}</h3>
              <div className="home-card-footer">
                <span>{chapter.minutesLabel}</span>
                <span className="home-card-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Why ChapterReady (Benefits not jargon) */}
      <section className="home-section home-why-section" aria-labelledby="why-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Why ChapterReady</p>
            <h2 id="why-title">Built around how students actually learn.</h2>
          </div>
          <p className="home-section-note">
            From textbook to mastery — without the confusion.
          </p>
        </div>

        <div className="home-why-grid">
          {whyChapterReadyBenefits.map((item) => (
            <div key={item.title} className="why-card">
              <span className="why-icon" aria-hidden="true">{item.icon}</span>
              <div className="why-content">
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Dedicated AI Coach Section */}
      <section className="home-section home-ai-coach-section" id="ai-coach" aria-labelledby="ai-coach-title">
        <div className="home-section-heading centered-heading">
          <p className="eyebrow">24/7 Socratic Learning</p>
          <h2 id="ai-coach-title">Stuck? Ask your AI Coach.</h2>
          <p className="home-section-subtext">
            Don’t just get the answer. Understand <em>why</em> with step-by-step hints and simple analogies.
          </p>
        </div>

        <div className="ai-coach-wrapper">
          <AICoachShowcase />
        </div>
      </section>

      {/* 8. Interactive Learning Section ("Don't just read. Explore.") */}
      <section className="home-section home-explore-section" aria-labelledby="explore-title">
        <div className="home-section-heading centered-heading">
          <p className="eyebrow">Interactive Learning &amp; Study Tools</p>
          <h2 id="explore-title">Don’t just read. Explore.</h2>
          <p className="home-section-subtext">
            Visual experiments, 5-year PYQ trends, formula sheets, and games designed to make difficult concepts click.{' '}
            <Link href="/tools" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'underline' }}>
              View All Study Tools →
            </Link>
          </p>
        </div>

        <div className="home-explore-grid">
          {exploreCards.map((item) => (
            <div key={item.title} className="explore-card">
              <div className="explore-card-top">
                <span className="explore-icon">{item.icon}</span>
                <span className="explore-badge">{item.badge}</span>
              </div>
              <h3 className="explore-title">{item.title}</h3>
              <p className="explore-desc">{item.desc}</p>
              <Link href={item.href} className="explore-link">
                Explore Now →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Dedicated Board Exam Preparation Section */}
      <section className="home-section home-board-prep-section" id="board-prep" aria-labelledby="board-prep-title">
        <div className="board-prep-container">
          <div className="board-prep-badge-row">
            <span className="pass-pill-fire">🎯 CBSE 2026-27 Board Exam Pass</span>
            <span className="pass-pill-discount">Full CBT Simulator</span>
          </div>

          <h2 id="board-prep-title" className="board-prep-headline">
            Ready for the Board Exam?
          </h2>
          <p className="board-prep-sub">
            Practice under real exam conditions and find out exactly where you stand.
            <strong> Paper 1 is 100% Free — unlock all 20 full papers for just ₹199!</strong>
          </p>

          <div className="board-prep-grid">
            <div className="board-prep-features">
              <div className="bp-card">
                <span className="bp-icon">📝</span>
                <div>
                  <strong>20 Full 80-Mark Board Papers</strong>
                  <p>5 full-length papers each for Maths Standard, Science, Social Science, and English.</p>
                </div>
              </div>

              <div className="bp-card">
                <span className="bp-icon">⏱️</span>
                <div>
                  <strong>Real 3-Hour CBT Simulator</strong>
                  <p>180-minute official exam timer + 15 min reading clock to build speed and stamina.</p>
                </div>
              </div>

              <div className="bp-card">
                <span className="bp-icon">✅</span>
                <div>
                  <strong>CBSE Step-Wise Marking Schemes</strong>
                  <p>Step-by-step value points and examiner scoring criteria for every single question.</p>
                </div>
              </div>

              <div className="bp-card">
                <span className="bp-icon">📊</span>
                <div>
                  <strong>Weak Topic Diagnostics</strong>
                  <p>Automatic Mistake Vault tracks incorrect questions with 3-day spaced repetition retry.</p>
                </div>
              </div>
            </div>

            <div className="mock-pass-pricing-card">
              <div className="pass-pricing-top">
                <span className="pricing-badge">All 4 Core Subjects Pass</span>
                <div className="pricing-numbers">
                  <span className="current-price">₹199</span>
                  <span className="mrp-price">₹499</span>
                </div>
                <p className="unit-cost-tag">🔥 Just ₹10 / Paper · Save ₹1,400+ vs physical books</p>
              </div>

              <ul className="pass-features-list">
                <li>✅ <strong>20 Full 80-Mark Mock Papers</strong> (Maths, Science, SST, English)</li>
                <li>✅ <strong>Real 3-Hour CBT Simulator</strong> with reading clock</li>
                <li>✅ <strong>Step-by-Step Marking Schemes</strong> & scoring points</li>
                <li>✅ <strong>Automatic Mistake Vault</strong> & weak-chapter diagnostics</li>
                <li>🎁 <strong>Paper 1 is 100% Free right now (Try Before You Buy)</strong></li>
              </ul>

              <div className="pass-cta-group">
                <AuthAwareCTA
                  className="btn-pass-unlock"
                  hrefLoggedIn="/exam-papers"
                  hrefLoggedOut="/login"
                  textLoggedIn="Get 20-Paper Board Pass (₹199) →"
                  textLoggedOut="Get 20-Paper Board Pass (₹199) →"
                />
                <AuthAwareCTA
                  className="btn-pass-free"
                  hrefLoggedIn="/exam-papers"
                  hrefLoggedOut="/login"
                  textLoggedIn="Try Free Sample Paper 1 First"
                  textLoggedOut="Try Free Sample Paper 1 First"
                />
              </div>
              <p className="pass-security-note">🔒 100% Safe 256-bit UPI / Cards via Cashfree · Instant Unlock</p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Verified Trust Metrics & FAQ Accordion */}
      <section className="home-section home-trust-section" aria-labelledby="trust-title">
        <div className="social-proof-strip">
          <div className="proof-stat">
            <span className="stat-number">4.9/5 ⭐</span>
            <span className="stat-label">Student & Parent Satisfaction</span>
          </div>
          <div className="proof-stat">
            <span className="stat-number">280+ Qs</span>
            <span className="stat-label">NCERT & Board Question Bank</span>
          </div>
          <div className="proof-stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">2026-27 CBSE Blueprint Aligned</span>
          </div>
        </div>

        <div className="home-faq-wrapper" style={{ marginTop: '48px' }}>
          <div className="home-section-heading centered-heading">
            <p className="eyebrow">Got Questions?</p>
            <h2 id="trust-title">Frequently Asked Questions</h2>
            <p className="home-section-subtext">
              Everything you need to know about ChapterReady notes, tests, and CBSE Class 10 prep.
            </p>
          </div>
          <HomeFAQ />
        </div>
      </section>

      {/* Final Bottom Call to Action */}
      <section className="home-final-cta-section">
        <div className="final-cta-card">
          <span className="final-cta-pill">🚀 Ready to Master Class 10?</span>
          <h2 className="final-cta-heading">
            Master Class 10, one chapter at a time.
          </h2>
          <p className="final-cta-subtext">
            Join thousands of CBSE Class 10 students learning with simplified notes, practicing active recall, and preparing for board exams with confidence.
          </p>
          <div className="final-cta-actions">
            <a href="#subjects" className="btn-final-primary">
              Choose Your Subject & Start Free →
            </a>
            <AuthAwareCTA
              className="btn-final-secondary"
              hrefLoggedIn="/exam-papers"
              hrefLoggedOut="/login"
              textLoggedIn="🎯 Launch CBT Mock Simulator"
              textLoggedOut="🎯 Launch CBT Mock Simulator"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
