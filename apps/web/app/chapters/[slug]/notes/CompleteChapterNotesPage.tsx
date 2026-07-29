import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import {
  getLessonSectionId,
  LessonNotesContent,
} from '../../../../components/LessonNotesContent';
import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, {
  PilotCompletionButton,
} from '../../../../components/PilotEngagementTracker';
import { getStudentSession } from '../../../../lib/auth';
import {
  getAvailableLessons,
  getChapter,
  getChapterPackContent,
  getLessonContent,
  type MarkdownBlock,
  type LessonContent,
} from '../../../../lib/course-content';
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
  const lessonContents = (
    await Promise.all(
      availableLessons.map((lesson) => getLessonContent(slug, lesson.slug)),
    )
  ).filter((content): content is LessonContent => Boolean(content));
  const packContent = getChapterPackContent(slug);

  if (lessonContents.length === 0 && !packContent) {
    notFound();
  }

  if (lessonContents.some((content) => !content.lesson.free)) {
    const session = await getStudentSession();
    if (!session) {
      redirect(`/login?next=${encodeURIComponent(`/chapters/${slug}/notes`)}`);
    }
  }

  const isPilot = isPilotChapter(slug);
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

  return (
    <main className="lesson-page">
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

      <nav className="topbar" aria-label="Chapter notes navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links lesson-links">
          <Link href={`/chapters/${slug}`}>Chapter</Link>
          <a href="#introduction">Notes</a>
          <Link href={`/chapters/${slug}/quiz`}>Quiz</Link>
          <Link href="/subjects">Subjects</Link>
        </div>
        <Link className="nav-cta" href={`/chapters/${slug}`}>
          Chapter overview
        </Link>
      </nav>

      <section className="lesson-hero section-shell">
        <div className="lesson-hero-card">
          <p className="eyebrow">{chapter.subject} · Complete chapter notes</p>
          <h1>{chapter.title}</h1>
          <p className="subtext">{chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#introduction">
              Start with Introduction
            </a>
            <Link className="ghost-link" href={`/chapters/${slug}/quiz`}>
              Take chapter quiz
            </Link>
          </div>
        </div>

        <aside className="lesson-summary-card">
          <p className="eyebrow">Study snapshot</p>
          <ul className="lesson-summary-list">
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

      <section
        className="lesson-shell section-shell complete-chapter-shell"
        id="chapter-notes"
      >
        <article className="lesson-main complete-chapter-notes">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/subjects">Subjects</Link>
            <span>/</span>
            <Link href={`/chapters/${slug}`}>{chapter.title}</Link>
            <span>/</span>
            <span>Complete notes</span>
          </div>

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
                <section
                  className="complete-chapter-part"
                  id={`lesson-${content.lesson.slug}`}
                  key={content.lesson.slug}
                >
                  <div className="complete-chapter-part-header">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="eyebrow">{content.lesson.type}</p>
                      <h2>{content.lesson.title}</h2>
                      <p>{content.lesson.preview}</p>
                    </div>
                  </div>
                  <div className="lesson-prose">
                  <LessonNotesContent
                    blocks={content.blocks}
                    hideDocumentTitle
                    idPrefix={content.lesson.slug}
                  />
                  </div>
                </section>
              ))
            ) : (
              <section
                className="complete-chapter-part"
                id="lesson-chapter-pack"
              >
                <div className="lesson-prose chapter-pack-prose">
                  <LessonNotesContent
                    blocks={packContent!.blocks}
                    idPrefix="chapter-pack"
                  />
                </div>
              </section>
            )}
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
