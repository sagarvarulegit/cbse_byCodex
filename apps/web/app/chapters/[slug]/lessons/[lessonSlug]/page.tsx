import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { LessonNotesContent, toSectionId } from '../../../../../components/LessonNotesContent';
import LessonVideoPlayer from '../../../../../components/LessonVideoPlayer';
import PilotFeedbackForm from '../../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, { PilotCompletionButton } from '../../../../../components/PilotEngagementTracker';
import ReadingCompanion from '../../../../../components/ReadingCompanion';
import StudentTopbar from '../../../../../components/StudentTopbar';
import { getAvailableLessons, getChapter, getLessonContent } from '../../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../../lib/course-content';
import { getChapterSubjectNavigation } from '../../../../../lib/curriculum/subject-navigation';
import { getStudentSession } from '../../../../../lib/auth';
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
          <div className="lesson-prose">
            <LessonNotesContent blocks={content.blocks} />
          </div>
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
          <div className="sidebar-card compact-card">
            <p className="eyebrow">Board Exam Companions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
              {chapter.subject.toLowerCase().includes('science') && (
                <Link
                  href="/activities-and-diagrams"
                  className="ghost-link"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                >
                  🔬 NCERT Activities (₹99) →
                </Link>
              )}
              {(chapter.subject.toLowerCase().includes('math') || chapter.subject.toLowerCase().includes('science')) && (
                <Link
                  href="/formula-cheatsheets"
                  className="ghost-link"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
                >
                  ⚡ 1-Page Cheatsheets (₹49) →
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>

      {isPilot ? (
        <section className="section-shell pilot-feedback-section">
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
