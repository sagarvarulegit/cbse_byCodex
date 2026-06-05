import Link from 'next/link';
import { notFound } from 'next/navigation';

const chapters = {
  'real-numbers': {
    subject: 'Mathematics',
    title: 'Real Numbers',
    progress: 42,
    mastery: 'Improving',
    streakTask: 'Solve 5 HCF and LCM questions',
    summary:
      'A premium Maths chapter experience with crisp concept videos, whiteboard proofs, NCERT examples, practice, and mastery tracking.',
    lessons: [
      { title: 'Euclid division lemma', type: 'Whiteboard proof', minutes: 8, free: true },
      { title: 'Fundamental theorem of arithmetic', type: 'Animated concept', minutes: 10, free: false },
      { title: 'HCF and LCM by prime factorisation', type: 'Practice lab', minutes: 12, free: false },
      { title: 'Irrational numbers', type: 'Board-style examples', minutes: 9, free: false },
      { title: 'Decimal expansion of rational numbers', type: 'Quiz revision', minutes: 7, free: false },
    ],
  },
  'chemical-reactions-and-equations': {
    subject: 'Science',
    title: 'Chemical Reactions and Equations',
    progress: 28,
    mastery: 'Getting started',
    streakTask: 'Balance 6 equations without hints',
    summary:
      'A visual Science chapter experience with animated reactions, activity explanations, sharp notes, quizzes, and revision checkpoints.',
    lessons: [
      { title: 'Chemical equations', type: 'Animated intro', minutes: 7, free: true },
      { title: 'Balancing equations', type: 'Interactive practice', minutes: 11, free: false },
      { title: 'Combination and decomposition reactions', type: 'Visual explainer', minutes: 9, free: false },
      { title: 'Displacement and double displacement reactions', type: 'Activity breakdown', minutes: 10, free: false },
      { title: 'Oxidation and reduction', type: 'Revision sprint', minutes: 8, free: false },
    ],
  },
} as const;

type ChapterSlug = keyof typeof chapters;

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters[slug as ChapterSlug];

  if (!chapter) {
    notFound();
  }

  return (
    <main>
      <nav className="topbar" aria-label="Chapter navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <Link className="nav-cta" href="/">
          Home
        </Link>
      </nav>

      <section className="chapter-hero section-shell">
        <div>
          <p className="eyebrow">{chapter.subject}</p>
          <h1>{chapter.title}</h1>
          <p className="subtext">{chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-plan">
              Start lesson plan
            </a>
            <a className="ghost-link" href="#mastery">
              View mastery
            </a>
          </div>
        </div>

        <aside className="mastery-panel" id="mastery">
          <p className="eyebrow">Chapter mastery</p>
          <strong>{chapter.progress}%</strong>
          <span>{chapter.mastery}</span>
          <div className="progress-track large" aria-label={`${chapter.progress}% complete`}>
            <span style={{ width: `${chapter.progress}%` }} />
          </div>
          <p className="streak-task">Today: {chapter.streakTask}</p>
        </aside>
      </section>

      <section className="section-shell" id="lesson-plan">
        <div className="section-heading">
          <p className="eyebrow">Lesson path</p>
          <h2>Short videos, notes, quiz checkpoints.</h2>
        </div>
        <div className="lesson-list">
          {chapter.lessons.map((lesson, index) => (
            <article className="lesson-row" key={lesson.title}>
              <span className="lesson-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{lesson.title}</h3>
                <p>{lesson.type} · {lesson.minutes} min</p>
              </div>
              <span className={lesson.free ? 'access-pill free' : 'access-pill'}>
                {lesson.free ? 'Free' : 'Premium'}
              </span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
