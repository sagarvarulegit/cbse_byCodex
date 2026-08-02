import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense, type ReactNode } from 'react';
import GlossaryTerm, { type GlossaryPayload } from '../../../../../components/GlossaryTerm';
import ExamPracticeCard from '../../../../../components/ExamPracticeCard';
import LessonDemo from '../../../../../components/LessonDemo';
import LessonVideoPlayer from '../../../../../components/LessonVideoPlayer';
import PilotFeedbackForm from '../../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, { PilotCompletionButton } from '../../../../../components/PilotEngagementTracker';
import ReadingCompanion from '../../../../../components/ReadingCompanion';
import StudentTopbar from '../../../../../components/StudentTopbar';
import WrittenPracticeCard from '../../../../../components/WrittenPracticeCard';
import { getWrittenPracticeDefinition } from '../../../../../lib/chapter-practice';
import { getExamPracticeDefinition } from '../../../../../lib/exam-practice';
import { getAvailableLessons, getChapter, getLessonContent } from '../../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../../lib/course-content';
import { getChapterSubjectNavigation } from '../../../../../lib/curriculum/subject-navigation';
import { getStudentSession } from '../../../../../lib/auth';
import { GLOSSARY } from '../../../../../lib/glossary';
import { getLessonVideo } from '../../../../../lib/lesson-video';
import { parseInlineMarkup, type InlineMarkupToken } from '../../../../../lib/lesson-inline-markup';
import { isLessonQuestionMarker, parseLessonQuestionAnswers } from '../../../../../lib/lesson-question-answers';
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

  const [content, session] = await Promise.all([
    getLessonContent(slug, lessonSlug),
    getStudentSession(),
  ]);

  if (!content) {
    notFound();
  }

  const availableLessonCount = getAvailableLessons(chapter).length;
  const numberedSections = getNumberedLessonSections(content.blocks);

  // Check authentication for premium lessons
  if (!content.lesson.free) {
    if (!session) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/chapters/${slug}/lessons/${lessonSlug}`);
      redirect(`/login?next=${returnUrl}`);
    }
  }

  const isPilot = isPilotChapter(slug);
  const subjectNavigation = getChapterSubjectNavigation(slug);

  return (
    <main className="lesson-page">
      <a className="skip-link" href="#lesson-notes">
        Skip to lesson notes
      </a>
      {isPilot ? (
        <PilotEngagementTracker chapterSlug={slug} eventType="lesson_start" lessonSlug={lessonSlug} surface="lesson" />
      ) : null}

      <StudentTopbar
        contextLabel={`${chapter.subject} lesson`}
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
            <Link href={`/chapters/${slug}/notes`} prefetch={false}>
              {chapter.title}
            </Link>
            <span>/</span>
            <span aria-current="page">{content.lesson.title}</span>
          </nav>
          <p className="eyebrow">{chapter.subject} · Pilot lesson</p>
          <h1>{content.lesson.title}</h1>
          <p className="subtext">{content.lesson.preview}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-notes">
              Read notes
            </a>
            <a className="ghost-link" href="#quick-practice">
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

      <Suspense fallback={<LessonVideoLoading />}>
        <LessonVideoSection chapterSlug={slug} lessonSlug={lessonSlug} />
      </Suspense>

      <ReadingCompanion
        chapterSlug={slug}
        chapterTitle={content.lesson.title}
        contentRootId="lesson-notes"
        readingId={`lesson-${lessonSlug}`}
        sections={[
          { id: 'lesson-notes', label: 'Lesson notes' },
          ...numberedSections,
        ]}
        studentId={session?.id ?? 'guest'}
      />

      <section className="lesson-shell section-shell" id="lesson-notes">
        <article className="lesson-main" id="practice-zone">
          <div className="lesson-prose">{renderLessonBlocks(content.blocks)}</div>
        </article>

        <aside className="lesson-sidebar">
          {numberedSections.length > 0 ? (
            <nav aria-label="Textbook sections in this lesson" className="sidebar-card lesson-section-nav">
              <p className="eyebrow">In this lesson</p>
              <ol>
                {numberedSections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.label}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

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
                    aria-current={isActive ? 'page' : undefined}
                    className={isActive ? 'sidebar-lesson-item active' : 'sidebar-lesson-item'}
                    href={href}
                    key={lessonItem.slug}
                    prefetch={false}
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
                <Link className="ghost-link" href={`/chapters/${slug}/notes`} prefetch={false}>
                  ← Complete chapter
                </Link>
              )}

              {content.nextLesson ? (
                <Link className="button-link" href={`/chapters/${slug}/lessons/${content.nextLesson.slug}`}>
                  Next: {content.nextLesson.title}
                </Link>
              ) : (
                <Link className="button-link" href={`/chapters/${slug}/notes`} prefetch={false}>
                  Back to chapter content
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

      <nav aria-label="Previous and next lesson" className="lesson-mobile-navigation">
        {content.previousLesson ? (
          <Link href={`/chapters/${slug}/lessons/${content.previousLesson.slug}`}>
            <span aria-hidden="true">←</span>
            <span>Previous</span>
          </Link>
        ) : (
          <Link href={`/chapters/${slug}/notes`} prefetch={false}>
            <span aria-hidden="true">←</span>
            <span>Chapter</span>
          </Link>
        )}
        {content.nextLesson ? (
          <Link href={`/chapters/${slug}/lessons/${content.nextLesson.slug}`}>
            <span>Next</span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href={`/chapters/${slug}/notes`} prefetch={false}>
            <span>Chapter</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </main>
  );
}

function getNumberedLessonSections(blocks: MarkdownBlock[]) {
  const sections: Array<{ id: string; label: string }> = [];

  for (const block of blocks) {
    if (
      (block.type === 'h2' || block.type === 'h3') &&
      /^\d+(?:\.\d+)+\s+\S/.test(block.text)
    ) {
      sections.push({
        id: toSectionId(block.text),
        label: block.text,
      });
    }
  }

  return sections;
}

function renderInline(text: string) {
  return renderInlineTokens(parseInlineMarkup(text), 'inline');
}

function renderInlineTokens(tokens: InlineMarkupToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${token.type}-${index}`;

    if (token.type === 'code') {
      const glossaryEntry = getGlossaryEntry(token.value);
      if (glossaryEntry) {
        return <GlossaryTerm key={key} label={token.value} payload={glossaryEntry} />;
      }

      return <code key={key}>{token.value}</code>;
    }

    if (token.type === 'strong') {
      return <strong key={key}>{renderInlineTokens(token.children, key)}</strong>;
    }

    if (token.type === 'emphasis') {
      return <em key={key}>{renderInlineTokens(token.children, key)}</em>;
    }

    if (token.type === 'link') {
      return (
        <Link href={token.href} key={key}>
          {renderInlineTokens(token.children, key)}
        </Link>
      );
    }

    if (token.type === 'text') {
      return <span key={key}>{token.value}</span>;
    }

    return null;
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

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'answer check') {
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
      rendered.push(renderPracticeAnswerCheck(bodyBlocks, index));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'questions and answers') {
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
      rendered.push(renderQuestionAnswerCard(block.text, bodyBlocks, index));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'paragraph' && isLessonQuestionMarker(block.text)) {
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index);
      const title = /in-text/i.test(block.text) ? 'In-text questions and answers' : 'Questions and answers';
      rendered.push(renderQuestionAnswerCard(title, bodyBlocks, index));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'h2') {
      const sectionVariant = getLessonSupportSectionVariant(block.text);
      if (sectionVariant) {
        const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
        rendered.push(
          renderLessonSupportSection(block.text, bodyBlocks, sectionVariant, index),
        );
        index = nextIndex - 1;
        continue;
      }
    }

    rendered.push(renderBlock(block, index));
  }

  return rendered;
}

type LessonSupportSectionVariant =
  | 'board-tips'
  | 'common-mistakes'
  | 'one-minute-revision'
  | 'quick-practice';

function getLessonSupportSectionVariant(
  title: string,
): LessonSupportSectionVariant | null {
  const sectionKey = normalizeGlossaryKey(title);
  if (sectionKey === 'board tips') {
    return 'board-tips';
  }
  if (sectionKey === 'common mistakes') {
    return 'common-mistakes';
  }
  if (sectionKey === 'one minute revision') {
    return 'one-minute-revision';
  }
  if (sectionKey === 'quick practice') {
    return 'quick-practice';
  }

  return null;
}

function renderLessonSupportSection(
  title: string,
  bodyBlocks: MarkdownBlock[],
  variant: LessonSupportSectionVariant,
  index: number,
) {
  return (
    <section
      className={`lesson-support-section lesson-support-${variant}`}
      id={toSectionId(title)}
      key={`lesson-support-${variant}-${index}`}
    >
      <h3>{renderInline(title)}</h3>
      <div>
        {bodyBlocks.map((block, innerIndex) =>
          renderBlock(block, index * 1000 + innerIndex),
        )}
      </div>
    </section>
  );
}

function collectLessonSectionBody(blocks: MarkdownBlock[], startIndex: number) {
  const bodyBlocks: MarkdownBlock[] = [];
  let nextIndex = startIndex;

  while (nextIndex < blocks.length) {
    const block = blocks[nextIndex];

    if (block.type === 'h2') {
      break;
    }

    bodyBlocks.push(block);
    nextIndex += 1;
  }

  return { bodyBlocks, nextIndex };
}

function renderPracticeAnswerCheck(bodyBlocks: MarkdownBlock[], index: number) {
  return (
    <section className="lesson-practice-answer" id="answer-check" key={`answer-check-${index}`}>
      <p className="eyebrow">Practice feedback</p>
      <h3>Answer check</h3>
      <details>
        <summary>Try first, then reveal the answer</summary>
        <div className="lesson-practice-answer-body">
          {bodyBlocks.map((block, innerIndex) => renderBlock(block, index * 1000 + innerIndex))}
        </div>
      </details>
    </section>
  );
}

function renderQuestionAnswerCard(title: string, bodyBlocks: MarkdownBlock[], index: number) {
  const questions = parseLessonQuestionAnswers(bodyBlocks);

  return (
    <section className="lesson-qa-card" id={toSectionId(title)} key={`questions-and-answers-${index}`}>
      <div className="lesson-qa-card-header">
        <p className="eyebrow">Study questions</p>
        <h3>{title}</h3>
      </div>
      <div className="lesson-qa-card-body">
        {questions.length > 0
          ? questions.map((question) => (
              <article className="lesson-qa-item" key={`${index}-${question.number}`}>
                <p className="lesson-qa-question-number">Question {question.number}</p>
                <h4>{renderInline(question.question)}</h4>
                {question.hint ? <p className="lesson-qa-hint"><strong>Hint:</strong> {renderInline(question.hint)}</p> : null}
                <details className="lesson-qa-answer">
                  <summary>Try first, then reveal the answer</summary>
                  {question.answer ? <p>{renderInline(question.answer)}</p> : null}
                  {question.answerBlocks.map((block, innerIndex) =>
                    renderBlock(block, index * 1000 + question.number * 100 + innerIndex),
                  )}
                </details>
              </article>
            ))
          : bodyBlocks.map((block, innerIndex) => renderBlock(block, index * 1000 + innerIndex))}
      </div>
    </section>
  );
}

async function LessonVideoSection({ chapterSlug, lessonSlug }: { chapterSlug: string; lessonSlug: string }) {
  const lessonVideo = await getLessonVideo(chapterSlug, lessonSlug);

  if (lessonVideo.status === 'ready') {
    return (
      <LessonVideoPlayer
        durationSeconds={lessonVideo.video.video.durationSeconds}
        lessonId={lessonVideo.video.lesson.id}
        playbackUrl={lessonVideo.video.video.playbackUrl}
        posterUrl={lessonVideo.video.video.thumbnailUrl}
        title={lessonVideo.video.lesson.title}
        videoId={lessonVideo.video.video.id}
      />
    );
  }

  return (
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
  );
}

function LessonVideoLoading() {
  return (
    <section aria-busy="true" aria-label="Loading lesson video" className="section-shell lesson-video-section">
      <div className="lesson-video-card empty route-loading-card">
        <div className="lesson-video-copy">
          <p className="eyebrow">Lesson video</p>
          <div className="route-loading-bar" />
          <p>Checking video availability while the notes load...</p>
        </div>
      </div>
    </section>
  );
}

function renderBlock(block: MarkdownBlock, index: number) {
  switch (block.type) {
    case 'h1':
      return (
        <header className="prose-intro" key={`${block.type}-${index}`}>
          <p className="eyebrow">Lesson note</p>
          <h2>{renderInline(block.text)}</h2>
        </header>
      );
    case 'h2':
      return (
        <h3 className="prose-section-heading" id={toSectionId(block.text)} key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </h3>
      );
    case 'h3':
      return (
        <h4
          className="prose-subheading"
          id={toSectionId(block.text)}
          key={`${block.type}-${index}`}
        >
          {renderInline(block.text)}
        </h4>
      );
    case 'paragraph': {
      const demoId = getDemoId(block.text);
      const examPracticeId = getExamPracticeId(block.text);
      const writtenPracticeId = getWrittenPracticeId(block.text);

      if (demoId) {
        return <LessonDemo demoId={demoId} key={`${demoId}-${index}`} />;
      }

      if (writtenPracticeId) {
        const definition = getWrittenPracticeDefinition(writtenPracticeId);
        return definition ? (
          <WrittenPracticeCard
            definition={definition}
            key={`${writtenPracticeId}-${index}`}
          />
        ) : null;
      }

      if (examPracticeId) {
        const definition = getExamPracticeDefinition(examPracticeId);
        return definition ? (
          <ExamPracticeCard
            definition={definition}
            key={`${examPracticeId}-${index}`}
          />
        ) : null;
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
    case 'table':
      return (
        <div className="prose-table-wrap" key={`${block.type}-${index}`}>
          <table className="prose-table">
            <thead>
              <tr>
                {block.headers.map((header, cellIndex) => (
                  <th key={`${header}-${cellIndex}`} scope="col">{renderInline(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  const demoMarker = text.match(/^\[\[demo:([a-z0-9-]+)\]\]$/i);
  if (demoMarker) {
    return demoMarker[1];
  }

  const illustrationTag = text.match(
    /^<ActivityIllustration\s+demoId=["']([a-z0-9-]+)["']\s*\/>$/i,
  );
  return illustrationTag?.[1] ?? null;
}

function getWrittenPracticeId(text: string) {
  const match = text.match(/^\[\[written-practice:([a-z0-9-]+)\]\]$/i);
  return match?.[1] ?? null;
}

function getExamPracticeId(text: string) {
  const match = text.match(/^\[\[exam-practice:([a-z0-9-]+)\]\]$/i);
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
