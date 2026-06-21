import { logoutAction } from './auth-actions';
import { requireAdminSession } from '../lib/auth';
import { getPilotReview } from '../lib/pilot-review';

const modules = ['Subjects', 'Chapters', 'Topics', 'Lessons', 'Quizzes', 'Publishing Review'];

function formatLabel(value: string | null) {
  if (!value) {
    return 'Unknown';
  }

  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getDecisionHint(review: Awaited<ReturnType<typeof getPilotReview>>) {
  if (review.summary.totalEvents === 0) {
    return 'No pilot signal yet. Keep the current chapter access narrow and invite a small student batch to use the flow.';
  }

  if (review.summary.feedbackCount > 0 && review.summary.averageRating !== null && review.summary.averageRating < 3) {
    return 'Feedback is pointing to friction. Fix the reported flow or content before widening access.';
  }

  if (review.summary.activeStudents < 5) {
    return 'Usage is still thin. Collect more sessions before deciding whether to add more chapters.';
  }

  return 'There is enough activity to review chapter-level friction and choose the next fix or pilot expansion.';
}

export default async function AdminPage() {
  const session = await requireAdminSession();
  const pilotReview = await getPilotReview(14);
  const metrics = [
    { label: 'Pilot events', value: String(pilotReview.summary.totalEvents) },
    { label: 'Active students', value: String(pilotReview.summary.activeStudents) },
    {
      label: 'Avg feedback',
      value: pilotReview.summary.averageRating === null ? '-' : pilotReview.summary.averageRating.toFixed(1),
    },
  ];
  const topEvents = pilotReview.eventBreakdown.slice(0, 5);
  const topChapters = pilotReview.chapterBreakdown.slice(0, 5);
  const topSurfaces = pilotReview.surfaceBreakdown.slice(0, 5);

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content admin</p>
          <h1>CBSE publishing workspace</h1>
          <p>Signed in as {session.fullName}. Review content modules, lesson publishing, and the pilot catalog.</p>
        </div>
        <form action={logoutAction}>
          <button type="submit">Logout</button>
        </form>
      </header>

      <section className="admin-metric-grid">
        {metrics.map((metric) => (
          <article className="admin-metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="pilot-review-panel" aria-labelledby="pilot-review-heading">
        <div className="pilot-review-header">
          <div>
            <p className="admin-eyebrow">Free pilot review</p>
            <h2 id="pilot-review-heading">What happened in the last {pilotReview.windowDays} days?</h2>
          </div>
          <time dateTime={pilotReview.generatedAt}>
            Updated {new Date(pilotReview.generatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </time>
        </div>

        <div className="pilot-review-decision">
          <span>Next decision</span>
          <p>{getDecisionHint(pilotReview)}</p>
        </div>

        <div className="pilot-review-columns">
          <section>
            <h3>Events</h3>
            {topEvents.length > 0 ? (
              <ol className="pilot-review-list">
                {topEvents.map((item) => (
                  <li key={item.eventType}>
                    <span>{formatLabel(item.eventType)}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="pilot-empty">No dashboard, chapter, lesson, quiz, or feedback events yet.</p>
            )}
          </section>

          <section>
            <h3>Chapters</h3>
            {topChapters.length > 0 ? (
              <ol className="pilot-review-list">
                {topChapters.map((item) => (
                  <li key={item.chapterSlug ?? 'unknown-chapter'}>
                    <span>{item.chapterTitle ?? formatLabel(item.chapterSlug)}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="pilot-empty">No chapter-level signal has landed yet.</p>
            )}
          </section>

          <section>
            <h3>Surfaces</h3>
            {topSurfaces.length > 0 ? (
              <ol className="pilot-review-list">
                {topSurfaces.map((item) => (
                  <li key={item.surface ?? 'unknown-surface'}>
                    <span>{formatLabel(item.surface)}</span>
                    <strong>{item.count}</strong>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="pilot-empty">No surface context is available yet.</p>
            )}
          </section>
        </div>

        <section className="pilot-feedback-section">
          <h3>Recent feedback</h3>
          {pilotReview.recentFeedback.length > 0 ? (
            <div className="pilot-feedback-list">
              {pilotReview.recentFeedback.map((feedback) => (
                <article key={`${feedback.occurredAt}-${feedback.message}`}>
                  <div>
                    <span>{formatLabel(feedback.category)}</span>
                    <strong>{feedback.rating === null ? 'No rating' : `${feedback.rating}/5`}</strong>
                  </div>
                  <p>{feedback.message}</p>
                  <small>
                    {[formatLabel(feedback.surface), feedback.chapterSlug, feedback.lessonSlug].filter(Boolean).join(' / ')}
                  </small>
                </article>
              ))}
            </div>
          ) : (
            <p className="pilot-empty">Feedback messages will appear here with rating, category, chapter, lesson, and surface context.</p>
          )}
        </section>
      </section>

      <section className="admin-module-grid">
        {modules.map((module) => (
          <button key={module} type="button">
            {module}
          </button>
        ))}
      </section>
    </main>
  );
}
