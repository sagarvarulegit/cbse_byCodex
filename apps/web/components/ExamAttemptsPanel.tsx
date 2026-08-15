'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import type {
  ExamPaperAttemptSummary,
  ExamPaperAttemptsResponse,
} from '../lib/exam-papers';

const CHAPTER_LABELS: Record<string, string> = {
  'real-numbers': 'Real Numbers',
  polynomials: 'Polynomials',
  'pair-of-linear-equations-in-two-variables': 'Pair of Linear Equations',
  'quadratic-equations': 'Quadratic Equations',
  'arithmetic-progressions': 'Arithmetic Progressions',
  triangles: 'Triangles',
  circles: 'Circles',
  'coordinate-geometry': 'Coordinate Geometry',
  'introduction-to-trigonometry': 'Introduction to Trigonometry',
  'some-applications-of-trigonometry': 'Applications of Trigonometry',
  'areas-related-to-circles': 'Areas Related to Circles',
  'surface-areas-and-volumes': 'Surface Areas and Volumes',
  statistics: 'Statistics',
  probability: 'Probability',
};

const TYPE_LABELS: Record<string, string> = {
  mcq: 'MCQs (1 mark)',
  'short-answer': 'Short answer (2 mark)',
  numerical: 'Numericals (3–5 mark)',
  proof: 'Proofs (3–5 mark)',
  'long-answer': 'Long answer (5 mark)',
  'case-study': 'Case studies (4 mark)',
  'data-interpretation': 'Data interpretation',
};

function label(slug: string, map: Record<string, string>): string {
  return map[slug] ?? slug.replace(/-/g, ' ');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ExamAttemptsPanel({
  data,
}: {
  data: ExamPaperAttemptsResponse | null;
}) {
  const attempts = data?.attempts ?? [];
  const aggregate = data?.aggregate ?? null;
  const weakAreas = data?.weakAreas ?? { weakChapterSlugs: [], weakQuestionTypes: [] };

  const weakChapterCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const attempt of attempts) {
      for (const slug of attempt.weakChapterSlugs) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  const weakTypeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const attempt of attempts) {
      for (const type of attempt.weakQuestionTypes) {
        counts.set(type, (counts.get(type) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [attempts]);

  if (attempts.length === 0) {
    return (
      <div className="attempts-panel">
        <div className="attempts-empty">
          <h2>Your Mock Test attempts</h2>
          <p className="subtext compact">
            You have not attempted any mock test papers yet. Take the free sample
            paper to start your practice record.
          </p>
          <Link className="card-link" href="/exam-papers" prefetch={false}>
            Go to Mock Test Series
          </Link>
        </div>
        <style>{`
          .attempts-panel { margin: 1rem 0 2rem; }
          .attempts-empty { padding: 1.5rem 1.25rem; background: #faf6f0; border-radius: 12px; }
          .attempts-empty .card-link { display: inline-block; margin-top: 0.75rem; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="attempts-panel">
      <div className="attempts-head">
        <div>
          <p className="eyebrow">ChapterReady · Exam Practice</p>
          <h1>Mock Test attempts</h1>
        </div>
        <Link className="card-link" href="/exam-papers" prefetch={false}>
          Take another paper
        </Link>
      </div>

      {aggregate && (
        <div className="attempts-aggregate">
          <div className="attempts-stat">
            <strong>{aggregate.attempts}</strong>
            <span>papers taken</span>
          </div>
          <div className="attempts-stat">
            <strong>{aggregate.averagePercent}%</strong>
            <span>average score</span>
          </div>
          <div className="attempts-stat">
            <strong>{aggregate.bestPercent}%</strong>
            <span>best score</span>
          </div>
        </div>
      )}

      {(weakChapterCounts.length > 0 || weakTypeCounts.length > 0) && (
        <div className="attempts-weak">
          <h2>Weak areas to revise</h2>
          <div className="attempts-weak-grid">
            {weakChapterCounts.length > 0 && (
              <div>
                <h3>Weak chapters</h3>
                <ul>
                  {weakChapterCounts.map(([slug, count]) => (
                    <li key={slug}>
                      <span>{label(slug, CHAPTER_LABELS)}</span>
                      <span className="attempts-weak-count">
                        {count} attempt{count > 1 ? 's' : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {weakTypeCounts.length > 0 && (
              <div>
                <h3>Weak question types</h3>
                <ul>
                  {weakTypeCounts.map(([type, count]) => (
                    <li key={type}>
                      <span>{label(type, TYPE_LABELS)}</span>
                      <span className="attempts-weak-count">
                        {count} attempt{count > 1 ? 's' : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="attempts-list">
        <h2>Attempt history</h2>
        <ul>
          {attempts.map((attempt) => {
            const percent = Math.round((attempt.earnedMarks / attempt.totalMarks) * 100);
            return (
              <li key={attempt.id} className="attempts-row">
                <div>
                  <p className="attempts-row-title">
                    {attempt.paperTitle} — attempt {attempt.attemptNumber}
                  </p>
                  <p className="subtext compact">
                    {formatDate(attempt.createdAt)} · MCQ {attempt.mcqCorrect}/
                    {attempt.mcqTotal} ·{' '}
                    {attempt.weakChapterSlugs.length > 0
                      ? `weak: ${attempt.weakChapterSlugs
                          .slice(0, 3)
                          .map((slug) => label(slug, CHAPTER_LABELS))
                          .join(', ')}`
                      : 'no weak chapters flagged'}
                  </p>
                </div>
                <div className="attempts-score">
                  <strong>{percent}%</strong>
                  <span>
                    {attempt.earnedMarks}/{attempt.totalMarks}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <style>{`
        .attempts-panel { margin: 1rem 0 2rem; }
        .attempts-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
        .attempts-aggregate { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin: 1.25rem 0; }
        .attempts-stat { background: #faf6f0; border-radius: 12px; padding: 0.9rem 1rem; text-align: center; }
        .attempts-stat strong { display: block; font-size: 1.4rem; }
        .attempts-stat span { font-size: 0.8rem; color: var(--muted, #666); }
        .attempts-weak { margin: 1.5rem 0; padding: 1rem 1.25rem; background: #fff7f0; border: 1px solid #f2d9c4; border-radius: 12px; }
        .attempts-weak-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .attempts-weak h3 { font-size: 0.9rem; margin: 0.5rem 0; }
        .attempts-weak ul { list-style: none; padding: 0; margin: 0; }
        .attempts-weak li { display: flex; justify-content: space-between; gap: 0.5rem; padding: 0.3rem 0; border-top: 1px solid var(--border, #eee); }
        .attempts-weak-count { color: var(--muted, #777); font-size: 0.85rem; }
        .attempts-list ul { list-style: none; padding: 0; margin: 0.5rem 0 0; }
        .attempts-row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 0.7rem 0; border-top: 1px solid var(--border, #eee); }
        .attempts-row-title { font-weight: 600; }
        .attempts-score { text-align: right; }
        .attempts-score strong { font-size: 1.15rem; display: block; }
        .attempts-score span { font-size: 0.8rem; color: var(--muted, #666); }
      `}</style>
    </div>
  );
}
