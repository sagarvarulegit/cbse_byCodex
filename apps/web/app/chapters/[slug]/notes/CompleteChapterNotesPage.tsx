import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import {
  getLessonSectionId,
  LessonNotesContent,
} from '../../../../components/LessonNotesContent';
import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, {
  PilotCompletionButton,
} from '../../../../components/PilotEngagementTracker';
import ReadingCompanion from '../../../../components/ReadingCompanion';
import SectionFocusHandler from '../../../../components/SectionFocusHandler';
import ChapterPyqDrill from '../../../../components/ChapterPyqDrill';
import StudentTopbar from '../../../../components/StudentTopbar';
import { getStudentSession } from '../../../../lib/auth';
import {
  getAvailableLessons,
  getChapter,
  getChapterPackContent,
  getQuizContent,
  getLessonContent,
  type MarkdownBlock,
  type LessonContent,
} from '../../../../lib/course-content';
import { getChapterSubjectNavigation } from '../../../../lib/curriculum/subject-navigation';
import {
  getChapterMasteryDisplay,
  getStudentMastery,
  type MasteryPayload,
} from '../../../../lib/mastery';
import { isPilotChapter } from '../../../../lib/pilot';

export default async function CompleteChapterNotesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const availableLessons = getAvailableLessons(chapter);
  const [session, loadedLessonContents, quizContent] = await Promise.all([
    getStudentSession(),
    Promise.all(
      availableLessons.map((lesson) => getLessonContent(slug, lesson.slug)),
    ),
    getQuizContent(slug),
  ]);
  const lessonContents = loadedLessonContents.filter(
    (content): content is LessonContent => Boolean(content),
  );
  const packContent = getChapterPackContent(slug);

  if (lessonContents.length === 0 && !packContent) {
    notFound();
  }

  if (lessonContents.some((content) => !content.lesson.free)) {
    if (!session) {
      redirect(`/login?next=${encodeURIComponent(`/chapters/${slug}/notes`)}`);
    }
  }

  const isPilot = isPilotChapter(slug);
  const subjectNavigation = getChapterSubjectNavigation(slug);
  const masteryPromise = getStudentMastery(slug);
  const outline =
    lessonContents.length > 0
      ? buildChapterOutline(lessonContents)
      : buildPackOutline(chapter.title, packContent!.blocks);
  const sectionCount = outline.reduce(
    (count, item) => count + item.sections.length,
    0,
  );
  const totalMinutes = lessonContents.reduce(
    (total, content) => total + content.lesson.minutes,
    0,
  );
  const readingSections = [
    { id: 'introduction', label: 'Introduction' },
    ...outline.flatMap((item) => [
      {
        id: `lesson-${item.lessonSlug}`,
        label: item.title,
      },
      ...item.sections,
    ]),
    { id: 'board-exam-drill', label: 'Board Exam Drill' },
  ];

  return (
    <main className="lesson-page">
      <SectionFocusHandler />
      <a className="skip-link" href="#introduction">
        Skip to chapter notes
      </a>

      {isPilot ? (
        <PilotEngagementTracker
          chapterSlug={slug}
          eventType="lesson_start"
          lessonSlug="chapter-notes"
          surface="lesson"
        />
      ) : null}

      <StudentTopbar
        contextLabel={`${chapter.subject} notes`}
        session={session}
      />

      <section className="lesson-hero section-shell">
        <div className="lesson-hero-card">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/subjects">Subjects</Link>
            {subjectNavigation ? (
              <>
                <span>/</span>
                <Link href={subjectNavigation.href}>
                  {subjectNavigation.chapterListLabel}
                </Link>
              </>
            ) : null}
            <span>/</span>
            <span aria-current="page">{chapter.title}</span>
          </nav>
          <p className="eyebrow">{chapter.subject} · Chapter content</p>
          <h1>{chapter.title}</h1>
          <p className="subtext">{chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#introduction">
              Start with Introduction
            </a>
            {chapter.subject.toLowerCase().includes('science') && (
              <Link className="ghost-link" href="/activities-and-diagrams">
                🔬 NCERT Activities &amp; Diagrams (₹99)
              </Link>
            )}
            {(chapter.subject.toLowerCase().includes('math') || chapter.subject.toLowerCase().includes('science')) && (
              <Link className="ghost-link" href="/formula-cheatsheets">
                ⚡ 1-Page Formula Cheatsheet (₹49)
              </Link>
            )}
            {quizContent ? (
              <Link className="ghost-link" href={`/chapters/${slug}/quiz`}>
                Take chapter quiz
              </Link>
            ) : null}
          </div>
        </div>

        <aside className="lesson-summary-card">
          <p className="eyebrow">Study snapshot</p>
          <ul className="lesson-summary-list">
            <Suspense fallback={<ChapterContentProgressLoading />}>
              <ChapterContentProgress
                chapterSlug={slug}
                masteryPromise={masteryPromise}
              />
            </Suspense>
            <li>
              <strong>{lessonContents.length || 1} chapter parts</strong>
              <span>Opened together in textbook order</span>
            </li>
            <li>
              <strong>{sectionCount} numbered sections</strong>
              <span>Parent topics appear before their subsections</span>
            </li>
            <li>
              <strong>{totalMinutes > 0 ? `${totalMinutes} min guided study` : 'Chapter revision'}</strong>
              <span>Read continuously or jump from the contents list</span>
            </li>
          </ul>
        </aside>
      </section>

      <ReadingCompanion
        chapterSlug={slug}
        chapterTitle={chapter.title}
        contentRootId="chapter-notes"
        readingId="complete-chapter"
        sections={readingSections}
        studentId={session?.id ?? 'guest'}
      />

      {/* Sticky Floating Quick Escape Pill Bar at the top */}
      <div className="notes-sticky-floating-bar" role="navigation" aria-label="Quick escape options">
        <div className="notes-floating-pills-inner">
          <span className="floating-pills-label">⚡ QUICK ACTIONS:</span>
          <Link
            href={`/formula-cheatsheets?chapter=${slug}`}
            className="floating-pill-btn pill-formula"
          >
            Need quick revision? Switch to the Formula Cheat Sheet &rarr;
          </Link>
          <a
            href="#board-exam-drill"
            className="floating-pill-btn pill-mock"
          >
            Ready to test yourself? Try CBSE Board Mock Questions &rarr;
          </a>
        </div>
      </div>

      <section
        className="lesson-shell section-shell complete-chapter-shell"
        id="chapter-notes"
      >
        <article className="lesson-main complete-chapter-notes">
          {/* High-Visibility Top CTA Banner */}
          <aside className="notes-top-cta-banner" aria-label="Fast study alternatives">
            <div className="top-cta-banner-header">
              <span className="top-cta-badge">⚡ CHAPTER QUICK-LINKS</span>
              <span className="top-cta-sub">Don&apos;t get stuck in a dead end — switch to rapid revision or real board testing at any time:</span>
            </div>
            <div className="top-cta-cards-row">
              <Link
                href={`/formula-cheatsheets?chapter=${slug}`}
                className="notes-shortcut-card shortcut-formula"
              >
                <span className="shortcut-icon" aria-hidden="true">⚡</span>
                <div className="shortcut-info">
                  <strong>Need quick revision? Switch to the Formula Cheat Sheet &rarr;</strong>
                  <span>All formulas, theorems &amp; rules in a 1-page printable cheat sheet.</span>
                </div>
              </Link>
              <a
                href="#board-exam-drill"
                className="notes-shortcut-card shortcut-mock"
              >
                <span className="shortcut-icon" aria-hidden="true">🎯</span>
                <div className="shortcut-info">
                  <strong>Ready to test yourself? Try CBSE Board Mock Questions &rarr;</strong>
                  <span>5-year board PYQs with instant AI step-marking and score points.</span>
                </div>
              </a>
            </div>
          </aside>

          <section className="chapter-notes-introduction" id="introduction">
            <p className="eyebrow">Introduction</p>
            <h2>Learn the whole chapter in one place</h2>
            <p>{chapter.summary}</p>
            <p>
              Follow the numbered headings in order. Each parent section comes
              before its child subsections, matching the textbook path.
            </p>
          </section>

          <div className="complete-chapter-sections">
            {lessonContents.length > 0 ? (
              lessonContents.map((content, index) => (
                <div key={content.lesson.slug}>
                  <details
                    className="complete-chapter-part"
                    data-part
                    id={`lesson-${content.lesson.slug}`}
                    open={index === 0}
                  >
                    <summary className="complete-chapter-part-header">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className="eyebrow">{content.lesson.type}</p>
                        <h2>{content.lesson.title}</h2>
                      </div>
                    </summary>
                    <p className="complete-chapter-part-preview">{content.lesson.preview}</p>
                    <div className="lesson-prose complete-chapter-part-body">
                      <LessonNotesContent
                        blocks={content.blocks}
                        hideDocumentTitle
                        idPrefix={content.lesson.slug}
                      />
                    </div>
                  </details>

                  {/* Inline Break Banner After Section 1 */}
                  {index === 0 && (
                    <aside className="notes-inline-break-card" aria-label="Mid-chapter study options">
                      <div className="break-card-badge-row">
                        <span className="break-pill-tag">💡 SECTION 1 COMPLETED</span>
                        <span className="break-pill-note">Pause &amp; Test Your Recall</span>
                      </div>
                      <h3 className="break-card-title">
                        Completed Section 1? Choose your next high-impact step:
                      </h3>
                      <p className="break-card-sub">
                        Active recall and formula checks lock in memory 3x faster than passive reading. Don&apos;t let notes feel like an isolated dead end.
                      </p>
                      <div className="break-card-actions">
                        <Link
                          href={`/formula-cheatsheets?chapter=${slug}`}
                          className="break-cta-button break-formula-btn"
                        >
                          <span className="btn-icon">⚡</span>
                          <div>
                            <span className="btn-eyebrow">Quick Revision</span>
                            <strong>Need quick revision? Switch to the Formula Cheat Sheet &rarr;</strong>
                          </div>
                        </Link>
                        <a
                          href="#board-exam-drill"
                          className="break-cta-button break-mock-btn"
                        >
                          <span className="btn-icon">🎯</span>
                          <div>
                            <span className="btn-eyebrow">Board Practice</span>
                            <strong>Ready to test yourself? Try CBSE Board Mock Questions &rarr;</strong>
                          </div>
                        </a>
                      </div>
                    </aside>
                  )}
                </div>
              ))
            ) : (
              <div>
                <details
                  className="complete-chapter-part"
                  data-part
                  id="lesson-chapter-pack"
                  open
                >
                  <summary className="complete-chapter-part-header">
                    <span>01</span>
                    <div>
                      <p className="eyebrow">Chapter pack</p>
                      <h2>{chapter.title}</h2>
                    </div>
                  </summary>
                  <div className="lesson-prose chapter-pack-prose complete-chapter-part-body">
                    <LessonNotesContent
                      blocks={packContent!.blocks}
                      idPrefix="chapter-pack"
                    />
                  </div>
                </details>

                {/* Inline Break Banner After Section 1 for Pack Content */}
                <aside className="notes-inline-break-card" aria-label="Mid-chapter study options">
                  <div className="break-card-badge-row">
                    <span className="break-pill-tag">💡 SECTION 1 COMPLETED</span>
                    <span className="break-pill-note">Pause &amp; Test Your Recall</span>
                  </div>
                  <h3 className="break-card-title">
                    Completed Section 1? Choose your next high-impact step:
                  </h3>
                  <p className="break-card-sub">
                    Active recall and formula checks lock in memory 3x faster than passive reading. Don&apos;t let notes feel like an isolated dead end.
                  </p>
                  <div className="break-card-actions">
                    <Link
                      href={`/formula-cheatsheets?chapter=${slug}`}
                      className="break-cta-button break-formula-btn"
                    >
                      <span className="btn-icon">⚡</span>
                      <div>
                        <span className="btn-eyebrow">Quick Revision</span>
                        <strong>Need quick revision? Switch to the Formula Cheat Sheet &rarr;</strong>
                      </div>
                    </Link>
                    <a
                      href="#board-exam-drill"
                      className="break-cta-button break-mock-btn"
                    >
                      <span className="btn-icon">🎯</span>
                      <div>
                        <span className="btn-eyebrow">Board Practice</span>
                        <strong>Ready to test yourself? Try CBSE Board Mock Questions &rarr;</strong>
                      </div>
                    </a>
                  </div>
                </aside>
              </div>
            )}

            <ChapterPyqDrill chapterSlug={slug} />
          </div>
        </article>

        <aside className="lesson-sidebar complete-chapter-sidebar">
          <nav
            className="sidebar-card chapter-contents-nav"
            aria-label="Chapter contents"
          >
            <p className="eyebrow">Chapter contents</p>
            <a className="chapter-introduction-link" href="#introduction">
              Introduction
            </a>
            <ol>
              {outline.map((item) => (
                <li key={item.lessonSlug}>
                  <a
                    className="chapter-part-link"
                    href={`#lesson-${item.lessonSlug}`}
                  >
                    {item.title}
                  </a>
                  {item.sections.length > 0 ? (
                    <ol>
                      {item.sections.map((section) => (
                        <li key={section.id}>
                          <a href={`#${section.id}`}>{section.label}</a>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </li>
              ))}
            </ol>
            <a
              className="chapter-introduction-link"
              href="#board-exam-drill"
              style={{ marginTop: '0.75rem', color: '#7c3aed', fontWeight: 700 }}
            >
              🔥 5-Year Board PYQs &amp; AI Evaluator
            </a>
          </nav>
        </aside>
      </section>

      {isPilot ? (
        <section className="section-shell pilot-feedback-section">
          <PilotCompletionButton
            chapterSlug={slug}
            lessonSlug="chapter-notes"
            surface="lesson"
          />
          <PilotFeedbackForm
            chapterSlug={slug}
            lessonSlug="chapter-notes"
            surface="lesson"
          />
        </section>
      ) : null}
    </main>
  );
}

async function ChapterContentProgress({
  chapterSlug,
  masteryPromise,
}: {
  chapterSlug: string;
  masteryPromise: Promise<MasteryPayload>;
}) {
  const mastery = await masteryPromise;
  const masteryDisplay = getChapterMasteryDisplay(mastery.masteries[0]);

  return (
    <li className="chapter-content-progress">
      <strong>{masteryDisplay.score}% chapter mastery</strong>
      <span>{masteryDisplay.label}</span>
      <div
        className="progress-track"
        aria-label={`${masteryDisplay.score}% mastered`}
      >
        <span style={{ width: `${masteryDisplay.score}%` }} />
      </div>
      <Link href={`/chapters/${chapterSlug}`}>View progress details</Link>
    </li>
  );
}

function ChapterContentProgressLoading() {
  return (
    <li aria-busy="true" className="chapter-content-progress">
      <strong>Loading chapter mastery...</strong>
      <div className="route-loading-bar" />
    </li>
  );
}

function buildChapterOutline(lessonContents: LessonContent[]) {
  return lessonContents.map((content) => ({
    lessonSlug: content.lesson.slug,
    title: content.lesson.title,
    sections: content.blocks.flatMap((block) => {
      if (
        (block.type === 'h2' || block.type === 'h3') &&
        /^\d+(?:\.\d+)+\s+\S/.test(block.text)
      ) {
        return [
          {
            id: getLessonSectionId(block.text, content.lesson.slug),
            label: block.text,
          },
        ];
      }

      return [];
    }),
  }));
}

function buildPackOutline(title: string, blocks: MarkdownBlock[]) {
  return [
    {
      lessonSlug: 'chapter-pack',
      title,
      sections: blocks.flatMap((block) => {
        if (block.type !== 'h2') {
          return [];
        }

        return [
          {
            id: getLessonSectionId(block.text, 'chapter-pack'),
            label: block.text,
          },
        ];
      }),
    },
  ];
}
