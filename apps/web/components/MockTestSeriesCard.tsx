'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { MockTestSeries, MockTestSeriesPaper } from '../lib/exam-papers';

export type SubjectSeriesEntry = {
  series: MockTestSeries;
  papers: MockTestSeriesPaper[];
};

const SUBJECT_LABELS: Record<string, string> = {
  'mathematics-standard': 'Maths Standard (041)',
  'science': 'Science (086)',
  'social-science': 'Social Science (087)',
  'english-language-and-literature': 'English (184)',
};

export default function MockTestSeriesCard({
  series,
  papers,
  seriesList,
}: {
  series?: MockTestSeries;
  papers?: MockTestSeriesPaper[];
  seriesList?: SubjectSeriesEntry[];
}) {
  const allSeries: SubjectSeriesEntry[] =
    seriesList && seriesList.length > 0
      ? seriesList
      : series && papers
      ? [{ series, papers }]
      : [];

  const [activeSubject, setActiveSubject] = useState<string>(
    allSeries[0]?.series.subjectSlug ?? 'mathematics-standard',
  );

  if (allSeries.length === 0) {
    return null;
  }

  const current =
    allSeries.find((entry) => entry.series.subjectSlug === activeSubject) ?? allSeries[0];
  const activeSeries = current.series;
  const activePapers = current.papers;
  const freePaper = activePapers.find((paper) => paper.isFreeSample);

  return (
    <div className="mock-series">
      {allSeries.length > 1 && (
        <div className="mock-series-tabs" role="tablist" aria-label="Select Mock Test Series Subject">
          {allSeries.map((entry) => {
            const isSelected = entry.series.subjectSlug === activeSubject;
            return (
              <button
                key={entry.series.subjectSlug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`mock-series-tab ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveSubject(entry.series.subjectSlug)}
              >
                {SUBJECT_LABELS[entry.series.subjectSlug] ?? entry.series.title}
              </button>
            );
          })}
        </div>
      )}

      <div className="mock-series-hero">
        <p className="eyebrow">ChapterReady · CBSE Class 10</p>
        <h1>{activeSeries.title}</h1>
        <p className="subtext">{activeSeries.description}</p>
      </div>

      <div className="mock-series-papers">
        {activePapers.map((paper) => {
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
        .mock-series-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
        .mock-series-tab { padding: 0.5rem 1rem; border-radius: 8px; border: 1.5px solid var(--border, #ddd); background: #fff; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.15s ease; color: inherit; }
        .mock-series-tab:hover { border-color: #c98a2c; background: #fffdfa; }
        .mock-series-tab.active { border-color: #8a5314; background: #faede0; font-weight: 700; color: #5a3205; }
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
