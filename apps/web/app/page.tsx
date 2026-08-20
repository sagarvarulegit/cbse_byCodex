import Link from 'next/link';

import BrandLockup from '../components/BrandLockup';
import { getStudentSession } from '../lib/auth';
import { getChapterEntries } from '../lib/course-content';
import { getVisibleCurriculumSubjects } from '../lib/curriculum/registry';
import { buildSubjectCatalog } from '../lib/curriculum/subject-navigation';
import { getPilotChapterCards } from '../lib/pilot';

const heroHighlights = [
  'Textbook-fidelity',
  'Simplified notes',
  'Mastery + revision',
  'Unlimited sample test papers',
];

const landingAdvantages = [
  {
    title: 'Textbook-fidelity first',
    detail:
      'Chapter order, numbering, and scope stay close to NCERT so students revise what they actually study in class.',
  },
  {
    title: 'Simplified notes',
    detail:
      'Dense textbook ideas are condensed into short, visual explanations that are easier to remember before tests.',
  },
  {
    title: 'Mastery and revision',
    detail:
      'Quizzes, saved progress, and revision missions turn weak spots into the next best action.',
  },
  {
    title: 'Unlimited sample test papers',
    detail:
      'Full CBSE-format papers (80 marks, 3 hours) generated in one click - assembled from the verified question bank so the pattern always matches the official blueprint.',
  },
  {
    title: 'Accessible figures and activities',
    detail:
      'Textbook figures, activities, and labels are redrawn in an accessible format instead of hidden inside scans.',
  },
];

export default async function HomePage() {
  const session = await getStudentSession();
  const sampleChapters = getPilotChapterCards();
  const subjectCatalog = buildSubjectCatalog(
    getVisibleCurriculumSubjects(),
    getChapterEntries(),
  );
  const firstName = session?.fullName.trim().split(/\s+/)[0];

  return (
    <main className="home-page">
      <nav className="topbar home-topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          <BrandLockup />
        </Link>

        <div className="home-topbar-actions">
          <Link className="ghost-link" href="/games">
            🎮 Games
          </Link>
          <Link className="ghost-link" href="/subjects">
            Subjects
          </Link>
          <Link className="nav-cta" href={session ? '/dashboard' : '/login'}>
            {session ? 'Dashboard' : 'Login'}
          </Link>
        </div>
      </nav>

      <div className="home-announcement-banner">
        <span className="banner-badge">⚡ LIMITED OFFER</span>
        <span className="banner-text">
          <strong>20 Full Board Mock Papers for ₹199 (Just ₹10/paper)!</strong> 60% OFF Early-Bird Launch Pass. Paper 1 is 100% Free.
        </span>
        <Link className="banner-link" href="/exam-papers">
          Claim Offer & Try Free →
        </Link>
      </div>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow">
            {firstName
              ? `Welcome back, ${firstName}`
              : 'Class 10 | NCERT-aligned learning'}
          </p>
          <h1 id="home-title">From textbook to test-ready, in one guided flow.</h1>
          <p className="home-hero-subtext">
            Textbook-faithful notes, simplified explanations, and a mastery-backed
            revision loop - all in one place.
          </p>
          <ul className="home-hero-highlights" aria-label="Key advantages">
            {heroHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <div className="home-hero-actions">
            <Link
              className="button-link"
              href={session ? '/dashboard' : '/subjects'}
            >
              {session ? 'Continue studying' : 'Explore subjects'}
            </Link>
            <Link
              className="ghost-link"
              href={session ? '/subjects' : '/register'}
            >
              {session ? 'Choose a subject' : 'Create free account'}
            </Link>
            <Link
              className="ghost-link highlight-action"
              href={session ? '/exam-papers' : '/login'}
            >
              🎯 Try Free Board Mock Paper
            </Link>
          </div>
        </div>
      </section>

      {/* High-Converting Board Mock Pass Showcase */}
      <section className="home-section home-mock-pass-section" aria-labelledby="mock-pass-title">
        <div className="mock-pass-container">
          <div className="mock-pass-badge-row">
            <span className="pass-pill-fire">🔥 2026-27 Board Exam Special</span>
            <span className="pass-pill-discount">60% OFF Launch Discount</span>
          </div>
          
          <h2 id="mock-pass-title" className="mock-pass-headline">
            Score 95%+ with 20 Full Board Mock Papers
          </h2>
          <p className="mock-pass-sub">
            Real 3-hour CBT exam simulator, step-wise official marking schemes, and weak-chapter diagnostics.
            <strong> Paper 1 is 100% Free — unlock all 20 papers for just ₹10 each!</strong>
          </p>

          <div className="mock-pass-grid">
            <div className="mock-pass-perks">
              <div className="perk-card">
                <span className="perk-icon">📄</span>
                <div>
                  <strong>20 Full 80-Mark Board Papers</strong>
                  <p>5 full-length papers each for Maths Standard (041), Science (086), Social Science (087), and English (184).</p>
                </div>
              </div>

              <div className="perk-card">
                <span className="perk-icon">⏱️</span>
                <div>
                  <strong>Real 3-Hour CBT Simulator</strong>
                  <p>180-minute official exam clock + 15 min reading time. Eliminates exam fear and builds speed.</p>
                </div>
              </div>

              <div className="perk-card">
                <span className="perk-icon">📝</span>
                <div>
                  <strong>Official CBSE Marking Schemes</strong>
                  <p>Step-wise value points and model answers so you learn exactly where examiners award marks.</p>
                </div>
              </div>

              <div className="perk-card">
                <span className="perk-icon">📊</span>
                <div>
                  <strong>Mistake Vault & Weak-Chapter Reports</strong>
                  <p>Automatic diagnostic breakdown pinpoints weak topics with 3-day spaced repetition retry.</p>
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
                <li>✅ <strong>Real 3-Hour CBT Simulator</strong> with 15-min reading clock</li>
                <li>✅ <strong>Step-by-Step Marking Schemes</strong> & examiner scoring points</li>
                <li>✅ <strong>Automatic Mistake Vault</strong> & weak-chapter diagnostics</li>
                <li>✅ <strong>Full Academic Year 2026-27 Access</strong></li>
                <li>🎁 <strong>Paper 1 is 100% Free right now (Try Before You Buy)</strong></li>
              </ul>

              <div className="pass-cta-group">
                <Link className="btn-pass-unlock" href={session ? '/exam-papers' : '/login'}>
                  Get 20-Paper Board Pass (₹199) →
                </Link>
                <Link className="btn-pass-free" href={session ? '/exam-papers' : '/login'}>
                  Try Free Sample Paper 1 First
                </Link>
              </div>
              <p className="pass-security-note">🔒 100% Safe 256-bit UPI / Cards via Cashfree · Instant Unlock</p>
            </div>
          </div>

          {/* Psychological Comparison Matrix: Why Books & Coaching Fail vs ChapterReady */}
          <div className="mock-comparison-block">
            <h3 className="comparison-title">Why Traditional Sample Books Don't Prepare You for the Real Board Hall</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th className="th-old">Physical Sample Paper Books</th>
                    <th className="th-old">Coaching Test Series</th>
                    <th className="th-champion">ChapterReady Board Pass</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Total Cost (4 Subjects)</strong></td>
                    <td className="text-bad">₹1,400 – ₹1,800</td>
                    <td className="text-bad">₹2,000 – ₹5,000</td>
                    <td className="text-good"><strong>₹199 (₹10 / paper)</strong></td>
                  </tr>
                  <tr>
                    <td><strong>3-Hour Live Exam Clock</strong></td>
                    <td className="text-bad">❌ No (Easy to get distracted)</td>
                    <td className="text-neutral">⚠️ Fixed rigid dates only</td>
                    <td className="text-good">✅ <strong>Anytime 3-Hr CBT Simulator</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Step-Wise Value Points</strong></td>
                    <td className="text-neutral">⚠️ Tiny font in back pages</td>
                    <td className="text-neutral">⚠️ Takes 1-2 weeks to get checked</td>
                    <td className="text-good">✅ <strong>Instant Interactive Marking Scheme</strong></td>
                  </tr>
                  <tr>
                    <td><strong>Weak-Chapter Diagnostics</strong></td>
                    <td className="text-bad">❌ None (Manual guessing)</td>
                    <td className="text-bad">❌ Generic percentage only</td>
                    <td className="text-good">✅ <strong>Auto Mistake Vault + Spaced Retries</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Proof & Student Feedback */}
          <div className="social-proof-strip">
            <div className="proof-stat">
              <span className="stat-number">4.9/5 ⭐</span>
              <span className="stat-label">Student & Parent Satisfaction</span>
            </div>
            <div className="proof-stat">
              <span className="stat-number">280+ Qs</span>
              <span className="stat-label">NCERT & PYQ Board Bank</span>
            </div>
            <div className="proof-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">2026-27 CBSE Blueprint Aligned</span>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-announcement-banner {
          background: #171513;
          color: #fff;
          padding: 0.65rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
          font-size: 0.88rem;
          flex-wrap: wrap;
          text-align: center;
          border-bottom: 2px solid #c95014;
        }
        .banner-badge {
          background: #c95014;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }
        .banner-text strong { color: #fde68a; }
        .banner-link {
          color: #fde68a;
          font-weight: 800;
          text-decoration: underline;
          transition: opacity 0.15s ease;
        }
        .banner-link:hover { opacity: 0.85; }
        .highlight-action { border-color: #c95014 !important; color: #c95014 !important; font-weight: 700; }
        .home-mock-pass-section {
          padding: 3rem 1.5rem;
          background: linear-gradient(180deg, #fffaf3 0%, #fdf5ea 100%);
          border-top: 2px solid #171513;
          border-bottom: 2px solid #171513;
        }
        .mock-pass-container {
          max-width: 1080px;
          margin: 0 auto;
        }
        .mock-pass-badge-row {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }
        .pass-pill-fire {
          background: #171513;
          color: #fde68a;
          font-size: 0.75rem;
          font-weight: 900;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .pass-pill-discount {
          background: #c95014;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 900;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .mock-pass-headline {
          font-family: var(--font-bangers, 'Bangers', cursive, sans-serif);
          font-size: 2.5rem;
          letter-spacing: 0.5px;
          margin: 0 0 0.5rem 0;
          color: #171513;
          line-height: 1.15;
        }
        .mock-pass-sub {
          font-size: 1.05rem;
          color: #55514b;
          max-width: 780px;
          line-height: 1.5;
          margin: 0 0 2rem 0;
        }
        .mock-pass-sub strong { color: #171513; }
        .mock-pass-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 2rem;
          align-items: stretch;
        }
        @media (max-width: 820px) {
          .mock-pass-grid { grid-template-columns: 1fr; }
        }
        .mock-pass-perks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 540px) {
          .mock-pass-perks { grid-template-columns: 1fr; }
        }
        .perk-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 14px;
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          box-shadow: 3px 3px 0 #171513;
        }
        .perk-icon { font-size: 1.5rem; }
        .perk-card strong { font-size: 0.95rem; color: #171513; }
        .perk-card p { font-size: 0.82rem; color: #666; margin: 0; line-height: 1.4; }
        .mock-pass-pricing-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          padding: 1.75rem 1.65rem;
          box-shadow: 6px 6px 0 #171513;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pass-pricing-top { text-align: center; border-bottom: 1.5px dashed #ddd; padding-bottom: 1rem; }
        .pricing-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          background: #e3f3ee;
          color: #0b7a48;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          margin-bottom: 0.5rem;
        }
        .pricing-numbers { display: flex; align-items: baseline; justify-content: center; gap: 0.6rem; }
        .current-price { font-size: 2.75rem; font-weight: 900; color: #171513; line-height: 1; }
        .mrp-price { font-size: 1.25rem; color: #888; text-decoration: line-through; }
        .unit-cost-tag {
          font-size: 0.85rem;
          font-weight: 800;
          color: #b43403;
          margin: 0.4rem 0 0 0;
        }
        .pass-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #333;
        }
        .pass-features-list strong { color: #0b7a48; }
        .pass-cta-group { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.5rem; }
        .btn-pass-unlock {
          display: block;
          text-align: center;
          background: #171513;
          color: #ffffff;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          font-weight: 900;
          font-size: 1rem;
          text-decoration: none;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.2);
          transition: transform 0.1s ease, background 0.12s ease;
        }
        .btn-pass-unlock:hover { background: #332f2b; transform: translateY(-1px); }
        .btn-pass-free {
          display: block;
          text-align: center;
          background: transparent;
          color: #171513;
          border: 1.5px solid #171513;
          padding: 0.65rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.88rem;
          text-decoration: none;
          transition: background 0.12s ease;
        }
        .btn-pass-free:hover { background: #f5ede2; }
        .pass-security-note {
          text-align: center;
          font-size: 0.72rem;
          color: #777;
          margin: 0;
        }
        .mock-comparison-block {
          margin-top: 2.5rem;
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 18px;
          padding: 1.75rem;
          box-shadow: 4px 4px 0 #171513;
        }
        .comparison-title {
          font-size: 1.15rem;
          font-weight: 900;
          color: #171513;
          margin: 0 0 1.25rem 0;
          text-align: center;
        }
        .comparison-table-wrapper {
          overflow-x: auto;
        }
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .comparison-table th, .comparison-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #eee;
        }
        .comparison-table th {
          background: #faf8f5;
          font-weight: 800;
          font-size: 0.85rem;
          color: #555;
          border-top: 1px solid #eee;
        }
        .th-old { color: #888; }
        .th-champion {
          background: #ffe9b8 !important;
          color: #171513;
          font-weight: 900;
          border-radius: 8px 8px 0 0;
        }
        .text-bad { color: #b91c1c; font-weight: 600; }
        .text-neutral { color: #854d0e; }
        .text-good { color: #047857; }
        .comparison-table tbody tr:hover {
          background: #fafaf8;
        }
        .social-proof-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-top: 2rem;
          text-align: center;
        }
        @media (max-width: 600px) {
          .social-proof-strip { grid-template-columns: 1fr; }
        }
        .proof-stat {
          background: #ffffff;
          border: 1.5px solid #171513;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 2px 2px 0 #171513;
        }
        .stat-number {
          display: block;
          font-size: 1.4rem;
          font-weight: 900;
          color: #171513;
          margin-bottom: 0.2rem;
        }
        .stat-label {
          font-size: 0.78rem;
          color: #666;
          font-weight: 600;
        }
      `}</style>


      <section
        className="home-section home-advantages"
        aria-labelledby="advantages-title"
      >
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Why students choose ChapterReady</p>
            <h2 id="advantages-title">
              Textbook-first notes built for faster revision
            </h2>
          </div>
          <p className="home-section-note">
            A focused Class 10 flow that keeps NCERT chapters, simplified notes, and
            practice in the same place.
          </p>
        </div>

        <div className="home-advantages-grid">
          {landingAdvantages.map((advantage, index) => (
            <article key={advantage.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <div>
                <h2>{advantage.title}</h2>
                <p>{advantage.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="guided-chapters-title">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Start with a guided chapter</p>
            <h2 id="guided-chapters-title">Popular chapters</h2>
          </div>
          <Link className="home-text-link" href="/subjects">
            View all chapters <span aria-hidden="true">&rarr;</span>
          </Link>
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

      <section
        className="home-section home-subjects-section"
        id="subjects"
        aria-labelledby="subjects-title"
      >
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Your Class 10 library</p>
            <h2 id="subjects-title">Choose a subject</h2>
          </div>
          <p className="home-section-note">
            {subjectCatalog.length} subjects in the active curriculum
          </p>
        </div>

        <div className="home-subject-grid">
          {subjectCatalog.map((subject, index) => (
            <Link
              className="home-subject-card"
              href={`/subjects/${subject.slug}`}
              key={subject.slug}
            >
              <span className="home-subject-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="home-subject-copy">
                <strong>{subject.title}</strong>
                <small>
                  {subject.liveCount > 0
                    ? `${subject.liveCount} of ${subject.chapterCount} chapters available`
                    : 'Coming soon'}
                </small>
              </span>
              <span className="home-card-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
