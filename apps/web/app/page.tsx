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
          <Link className="ghost-link" href="/subjects">
            Subjects
          </Link>
          <Link className="nav-cta" href={session ? '/dashboard' : '/login'}>
            {session ? 'Dashboard' : 'Login'}
          </Link>
        </div>
      </nav>

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
              className="ghost-link"
              href={session ? '/exam-papers' : '/login'}
            >
              Try a sample test paper
            </Link>
          </div>
        </div>
      </section>

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
