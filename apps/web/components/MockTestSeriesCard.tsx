'use client';

import Link from 'next/link';

import type { MockTestSeries, MockTestSeriesPaper } from '../lib/exam-papers';

export default function MockTestSeriesCard({
  series,
  papers,
}: {
  series: MockTestSeries;
  papers: MockTestSeriesPaper[];
}) {
  const published = papers.filter((paper) => paper.id);
  const freePaper = papers.find((paper) => paper.isFreeSample);

  return (
    <div className="mock-series">
      <div className="mock-series-hero">
        <p className="eyebrow">ChapterReady · CBSE Class 10</p>
        <h1>{series.title}</h1>
        <p className="subtext">{series.description}</p>
      </div>

      <div className="mock-series-papers">
        {papers.map((paper) => {
          const available = Boolean(paper.id);
          return (
            <div
              className={`mock-series-paper ${paper.isFreeSample ? 'mock-series-free' : ''}`}
              key={paper.number}
            >
              <div className="mock-series-paper-head">
                <span className="mock-series-number">Paper {paper.number}</span>
                {paper.isFreeSample && <span className="mock-series-tag">Free sample</span>}
              </div>
              <p className="mock-series-paper-title">{paper.title}</p>
              <p className="subtext compact">
                {paper.totalMarks ?? 80} marks · {paper.durationMinutes ?? 180} minutes
              </p>
              {available ? (
                <Link
                  className="card-link"
                  href={`/exam-papers/${paper.id}/take`}
                  prefetch={false}
                >
                  Take this test
                </Link>
              ) : (
                <p className="mock-series-coming">Coming soon</p>
              )}
            </div>
          );
        })}
      </div>

      {freePaper && (
        <p className="subtext compact mock-series-note">
          Paper 1 is free — try it now, then unlock the full series for a full
          board-exam practice run.
        </p>
      )}

      <p className="subtext compact mock-series-note">
        <Link href="/exam-papers/attempts" prefetch={false}>
          View my attempts and weak-area report →
        </Link>
      </p>

      <style>{`
        .mock-series { margin: 1rem 0 2rem; }
        .mock-series-hero { margin-bottom: 1.25rem; }
        .mock-series-papers { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .mock-series-paper { background: #faf6f0; border: 1px solid var(--border, #eee); border-radius: 14px; padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.35rem; }
        .mock-series-paper.mock-series-free { border-color: #d4a72c; background: #fffaf0; }
        .mock-series-paper-head { display: flex; justify-content: space-between; align-items: center; }
        .mock-series-number { font-weight: 700; font-size: 0.9rem; }
        .mock-series-tag { font-size: 0.72rem; font-weight: 700; color: #6b4e00; background: #fbe9b7; border-radius: 999px; padding: 0.15rem 0.55rem; }
        .mock-series-paper-title { font-weight: 600; }
        .mock-series-paper .card-link { margin-top: auto; align-self: flex-start; }
        .mock-series-coming { color: var(--muted, #999); font-size: 0.85rem; margin-top: auto; }
        .mock-series-note { margin-top: 1rem; }
        .dashboard-rule { margin: 2rem 0; border: 0; border-top: 1px solid var(--border, #eee); }
      `}</style>
    </div>
  );
}
