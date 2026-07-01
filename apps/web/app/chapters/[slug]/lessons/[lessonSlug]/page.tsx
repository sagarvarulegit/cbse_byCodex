import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import GlossaryTerm, { type GlossaryPayload } from '../../../../../components/GlossaryTerm';
import LessonDemo from '../../../../../components/LessonDemo';
import LessonVideoPlayer from '../../../../../components/LessonVideoPlayer';
import PilotFeedbackForm from '../../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, { PilotCompletionButton } from '../../../../../components/PilotEngagementTracker';
import { getAvailableLessons, getChapter, getLessonContent } from '../../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../../lib/course-content';
import { getStudentSession } from '../../../../../lib/auth';
import { GLOSSARY } from '../../../../../lib/glossary';
import { getLessonVideo } from '../../../../../lib/lesson-video';
import { isPilotChapter } from '../../../../../lib/pilot';


export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const chapter = getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const content = await getLessonContent(slug, lessonSlug);

  if (!content) {
    notFound();
  }

  const availableLessonCount = getAvailableLessons(chapter).length;

  // Check authentication for premium lessons
  if (!content.lesson.free) {
    const session = await getStudentSession();
    if (!session) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/chapters/${slug}/lessons/${lessonSlug}`);
      redirect(`/login?next=${returnUrl}`);
    }
  }

  const lessonVideo = await getLessonVideo(slug, lessonSlug);
  const isPilot = isPilotChapter(slug);

  return (
    <main>
      {isPilot ? (
        <PilotEngagementTracker chapterSlug={slug} eventType="lesson_start" lessonSlug={lessonSlug} surface="lesson" />
      ) : null}

      <nav className="topbar" aria-label="Lesson navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links lesson-links">
          <Link href={`/chapters/${slug}`}>Chapter</Link>
          <a href="#lesson-notes">Notes</a>
          <a href="#practice-zone">Practice</a>
        </div>
        <Link className="nav-cta" href={`/chapters/${slug}`}>
          Back to chapter
        </Link>
      </nav>

      <section className="lesson-hero section-shell">
        <div className="lesson-hero-card">
          <p className="eyebrow">{chapter.subject} · Pilot lesson</p>
          <h1>{content.lesson.title}</h1>
          <p className="subtext">{content.lesson.preview}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-notes">
              Read notes
            </a>
            <a className="ghost-link" href="#practice-zone">
              Jump to practice
            </a>
          </div>
        </div>

        <aside className="lesson-summary-card">
          <p className="eyebrow">Lesson snapshot</p>
          <ul className="lesson-summary-list">
            <li>
              <strong>{content.lesson.minutes} min</strong>
              <span>Estimated reading + revision time</span>
            </li>
            <li>
              <strong>{content.lesson.free ? 'Free preview' : 'Premium note'}</strong>
              <span>{content.lesson.type}</span>
            </li>
            <li>
              <strong>{availableLessonCount} lesson notes</strong>
              <span>Now live in this chapter</span>
            </li>
          </ul>
          <div className="glossary-hint">
            <strong>Tip:</strong> tap dotted words to quickly recall their meaning.
          </div>
        </aside>
      </section>

      {lessonVideo.status === 'ready' ? (
        <LessonVideoPlayer
          durationSeconds={lessonVideo.video.video.durationSeconds}
          lessonId={lessonVideo.video.lesson.id}
          playbackUrl={lessonVideo.video.video.playbackUrl}
          posterUrl={lessonVideo.video.video.thumbnailUrl}
          title={lessonVideo.video.lesson.title}
          videoId={lessonVideo.video.video.id}
        />
      ) : (
        <section className="section-shell lesson-video-section" aria-label="Lesson video status">
          <div className="lesson-video-card empty">
            <div className="lesson-video-copy">
              <p className="eyebrow">Video coming next</p>
              <h2>Lesson notes are ready.</h2>
              <p>
                Bunny playback is not attached to this lesson yet. Use the notes and practice below until the video
                upload is processed.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="lesson-shell section-shell" id="lesson-notes">
        <article className="lesson-main" id="practice-zone">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/chapters/${slug}`}>{chapter.title}</Link>
            <span>/</span>
            <span>{content.lesson.title}</span>
          </div>

          <div className="lesson-prose">{renderLessonBlocks(content.blocks)}</div>
        </article>

        <aside className="lesson-sidebar">
          <div className="sidebar-card">
            <p className="eyebrow">Chapter trail</p>
            <h3>{chapter.title}</h3>
            <div className="sidebar-lesson-list">
              {chapter.lessons.map((lessonItem, index) => {
                const isActive = lessonItem.slug === content.lesson.slug;
                const href = lessonItem.fileName ? `/chapters/${slug}/lessons/${lessonItem.slug}` : undefined;

                if (!href) {
                  return (
                    <div className="sidebar-lesson-item muted" key={lessonItem.slug}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{lessonItem.title}</strong>
                        <p>Coming soon</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    className={isActive ? 'sidebar-lesson-item active' : 'sidebar-lesson-item'}
                    href={href}
                    key={lessonItem.slug}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{lessonItem.title}</strong>
                      <p>{lessonItem.minutes} min</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="sidebar-card compact-card">
            <p className="eyebrow">Keep moving</p>
            <div className="sidebar-nav-pair">
              {content.previousLesson ? (
                <Link className="ghost-link" href={`/chapters/${slug}/lessons/${content.previousLesson.slug}`}>
                  ← {content.previousLesson.title}
                </Link>
              ) : (
                <Link className="ghost-link" href={`/chapters/${slug}`}>
                  ← Chapter overview
                </Link>
              )}

              {content.nextLesson ? (
                <Link className="button-link" href={`/chapters/${slug}/lessons/${content.nextLesson.slug}`}>
                  Next: {content.nextLesson.title}
                </Link>
              ) : (
                <Link className="button-link" href={`/chapters/${slug}`}>
                  Back to chapter
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>

      {isPilot ? (
        <section className="section-shell pilot-feedback-section">
          <PilotCompletionButton chapterSlug={slug} lessonSlug={lessonSlug} surface="lesson" />
          <PilotFeedbackForm chapterSlug={slug} lessonSlug={lessonSlug} surface="lesson" />
        </section>
      ) : null}
    </main>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const raw = part.slice(1, -1);
      const glossaryEntry = getGlossaryEntry(raw);

      if (glossaryEntry) {
        return <GlossaryTerm key={`${raw}-${index}`} label={raw} payload={glossaryEntry} />;
      }

      return <code key={`${part}-${index}`}>{raw}</code>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderLessonBlocks(blocks: MarkdownBlock[]) {
  const rendered: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'comic recap') {
      const nextBlock = blocks[index + 1];
      const items = nextBlock?.type === 'unordered-list' ? nextBlock.items : [];

      rendered.push(renderComicRecap(items, index));

      if (nextBlock?.type === 'unordered-list') {
        index += 1;
      }

      continue;
    }

    rendered.push(renderBlock(block, index));
  }

  return rendered;
}

function renderBlock(block: MarkdownBlock, index: number) {
  switch (block.type) {
    case 'h1':
      return (
        <header className="prose-intro" key={`${block.type}-${index}`}>
          <p className="eyebrow">Lesson note</p>
          <h2>{block.text}</h2>
        </header>
      );
    case 'h2':
      return (
        <h3 className="prose-section-heading" id={toSectionId(block.text)} key={`${block.type}-${index}`}>
          {block.text}
        </h3>
      );
    case 'h3':
      return (
        <h4 className="prose-subheading" key={`${block.type}-${index}`}>
          {block.text}
        </h4>
      );
    case 'paragraph': {
      const demoId = getDemoId(block.text);

      if (demoId) {
        return <LessonDemo demoId={demoId} key={`${demoId}-${index}`} />;
      }

      return (
        <p className="prose-paragraph" key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </p>
      );
    }
    case 'code':
      return (
        <pre className="formula-block" key={`${block.type}-${index}`}>
          <code>{block.text}</code>
        </pre>
      );
    case 'unordered-list':
      return (
        <ul className="prose-list" key={`${block.type}-${index}`}>
          {block.items.map((item: string) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol className="prose-list ordered" key={`${block.type}-${index}`}>
          {block.items.map((item: string) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

function renderComicRecap(items: string[], index: number) {
  const panels = items
    .map((item, panelIndex) => ({ ...parseComicLine(item), panelIndex }))
    .filter((panel) => panel.dialogue.trim().length > 0);

  return (
    <section className="comic-recap-card" id="comic-recap" key={`comic-recap-${index}`}>
      <div className="comic-recap-header">
        <div>
          <p className="eyebrow">End-of-lesson comic recap</p>
          <h3>Comic recap</h3>
          <p>
            Quick scene, quick smile, quick memory. Read this once and the idea sticks better.
          </p>
        </div>
        <div className="comic-recap-stamp">
          <span>4-panel memory strip</span>
        </div>
      </div>

      <div className="comic-recap-grid">
        {panels.map((panel) => (
          <article className="comic-panel" key={`${panel.speaker}-${panel.panelIndex}`}>
            <div className="comic-panel-topline">
              <span className="comic-panel-number">Panel {String(panel.panelIndex + 1).padStart(2, '0')}</span>
              <span className="comic-speaker-chip">{renderInline(panel.speaker)}</span>
            </div>
            <div className="comic-speech-bubble">{renderInline(panel.dialogue)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function parseComicLine(item: string) {
  const cleaned = item.trim();
  const match = cleaned.match(/^`?([^`]+?)`?:\s*[“"](.+)[”"]$/);

  if (!match) {
    return { speaker: 'Recap', dialogue: cleaned };
  }

  return {
    speaker: match[1].trim(),
    dialogue: match[2].trim(),
  };
}

function getDemoId(text: string) {
  const match = text.match(/^\[\[demo:([a-z0-9-]+)\]\]$/i);
  return match?.[1] ?? null;
}

function getGlossaryEntry(raw: string) {
  const key = normalizeGlossaryKey(raw);
  return GLOSSARY[key] ?? null;
}

function normalizeGlossaryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function toSectionId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
