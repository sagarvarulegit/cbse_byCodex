import Link from 'next/link';
import { notFound } from 'next/navigation';
import StudentTopbar from '../../../components/StudentTopbar';
import {
  getAvailableLessons,
  getChapterEntries,
  hasChapterPack,
} from '../../../lib/course-content';
import { requireStudentSession } from '../../../lib/auth';
import { getCurriculumSubject } from '../../../lib/curriculum/registry';
import {
  buildSubjectCatalog,
  buildCurriculumChapterCards,
  resolveCurriculumSubjectSlug,
} from '../../../lib/curriculum/subject-navigation';
import { isPilotChapter } from '../../../lib/pilot';

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolvedSlug = resolveCurriculumSubjectSlug(slug);
  const subject = getCurriculumSubject(resolvedSlug);

  if (!subject || subject.status !== 'active' || subject.visibleInCatalog !== true) {
    notFound();
  }

  const session = await requireStudentSession();
  const chapterEntries = getChapterEntries();
  const [subjectCatalogItem] = buildSubjectCatalog([subject], chapterEntries);
  const subjectChapters = buildCurriculumChapterCards(subject, chapterEntries);

  if (!subjectCatalogItem) {
    notFound();
  }

  return (
    <main>
      <StudentTopbar
        contextLabel={subjectCatalogItem.title}
        session={session}
      />

      <section className="auth-page dashboard-page">
        <div className="dashboard-shell">
          <nav className="breadcrumb-row" aria-label="Student learning path">
            <Link href="/dashboard">Dashboard</Link>
            <span>/</span>
            <Link href="/subjects">Subjects</Link>
            <span>/</span>
            <span aria-current="page">{subjectCatalogItem.title} Chapters</span>
          </nav>

          <div className="dashboard-hero">
            <p className="eyebrow">Class 10 CBSE</p>
            <h1>{subjectCatalogItem.title} Chapters</h1>
            <p className="subtext compact">
              Choose a chapter to open its complete learning content. Read in textbook order, jump to any section, or take the chapter quiz when you are ready.
            </p>
          </div>

          <div className="chapter-topline" style={{ marginTop: '1rem' }}>
            <span>Code {subjectCatalogItem.subjectCode}</span>
            <span>{subjectCatalogItem.assessmentLabel}</span>
            <span>Session {subjectCatalogItem.academicSession}</span>
          </div>

          <div className="section-heading" style={{ marginTop: '2rem' }}>
            <div>
              <p className="eyebrow">Step 2 of 3</p>
              <h2>Choose a chapter</h2>
            </div>
            <span className="section-badge">
              {subjectCatalogItem.liveCount} of {subjectCatalogItem.chapterCount} chapters live
            </span>
          </div>

          <div className="chapter-grid" aria-label={`Chapters of ${subjectCatalogItem.title}`}>
            {subjectChapters.map((chapterCard) => {
              const {
                chapterSlug,
                content: chapter,
                curriculumScope,
                curriculumTitle,
                curriculumTopics,
              } = chapterCard;
              const isLive =
                getAvailableLessons(chapter).length > 0 ||
                hasChapterPack(chapterSlug);
              const isPilot = isPilotChapter(chapterSlug);
              return (
                <article
                  className={`chapter-card subject-card ${subjectCatalogItem.accent} ${!isLive ? 'soft' : ''}`}
                  data-subject-motif={subjectCatalogItem.slug}
                  key={chapterSlug}
                  style={!isLive ? { opacity: 0.8 } : undefined}
                >
                  <div className="chapter-topline">
                    <span>{formatCurriculumScope(curriculumScope)}</span>
                    <strong style={!isLive ? { background: 'var(--border)', color: 'var(--muted)' } : undefined}>
                      {isPilot
                        ? 'Free pilot'
                        : isLive
                          ? chapter.mastery === 'Coming soon'
                            ? 'Notes live'
                            : chapter.mastery
                          : 'Coming soon'}
                    </strong>
                  </div>
                  <h3>{curriculumTitle}</h3>
                  <p>{chapter.summary}</p>

                  {isLive && chapter.progress > 0 && (
                    <div className="progress-track" aria-label={`${chapter.progress}% complete`} style={{ margin: '14px 0 10px' }}>
                      <span style={{ width: `${chapter.progress}%` }} />
                    </div>
                  )}

                  {curriculumTopics.length > 0 && (
                    <ul>
                      {curriculumTopics.map((topic) => (
                        <li key={topic.id}>
                          {topic.title} · {formatCurriculumScope(topic.scope)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isLive ? (
                    <Link
                      className="card-link"
                      href={`/chapters/${chapterSlug}/notes`}
                      prefetch={false}
                    >
                      {chapter.progress > 0 ? 'Continue chapter' : 'Start chapter'}
                    </Link>
                  ) : (
                    <div className="card-link card-link-disabled">
                      Coming soon
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function formatCurriculumScope(scope: string): string {
  return scope
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
