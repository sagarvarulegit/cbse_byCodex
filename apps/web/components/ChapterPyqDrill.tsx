'use client';

import React, { useState } from 'react';
import MarkingSchemeRubric from './MarkingSchemeRubric';
import chapterPyqData from '../lib/chapter-pyqs.generated.json';

export type ChapterPyqItem = {
  id: string;
  year: number;
  paperSet: string;
  sets: string[];
  qNo: number;
  section: string;
  marks: number;
  questionType: string;
  mainAnswer: string;
  valuePoints: string[];
  examinerNotes: string[];
  officialBoardRef: string;
};

const ALL_PYQS: Record<string, ChapterPyqItem[]> = chapterPyqData as Record<string, ChapterPyqItem[]>;

export function getPyqsForChapter(chapterSlug: string): ChapterPyqItem[] {
  return ALL_PYQS[chapterSlug] ?? [];
}

export default function ChapterPyqDrill({ chapterSlug }: { chapterSlug: string }) {
  const pyqs = getPyqsForChapter(chapterSlug);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  if (pyqs.length === 0) {
    return null;
  }

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section className="chapter-pyq-drill-root" id="board-exam-drill">
      <div className="pyq-header-card">
        <div className="pyq-badge-row">
          <span className="pyq-fire-badge">🔥 Board Exam Drill</span>
          <span className="pyq-verified-pill">Official 2026 Marking Schemes</span>
        </div>
        <h2>Past Board Questions &amp; Step-by-Step Marking Keys</h2>
        <p className="pyq-subtitle">
          Practice authentic questions asked in recent CBSE Board Exams. Expand each solution to see the exact step marks allocated by CBSE examiners.
        </p>
      </div>

      <div className="pyq-questions-list">
        {pyqs.map((q, idx) => {
          const isOpen = openIds.has(q.id);
          const formattedPoints = q.valuePoints.map((p) => p.replace(/^\[\+([0-9.]+) Mark\]\s*/, ''));

          return (
            <div className="pyq-card" key={q.id}>
              <div className="pyq-card-topbar">
                <div className="pyq-meta-badges">
                  <span className="pyq-qno">Q{idx + 1}</span>
                  <span className="pyq-set-badge">{q.sets.join(' • ')}</span>
                  <span className="pyq-marks-pill">{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
                </div>
                <span className="pyq-section-label">{q.section.replace(/^SECTION\s*–\s*/i, '')}</span>
              </div>

              <div className="pyq-stem">
                <p>{q.mainAnswer.split('\n')[0]}</p>
              </div>

              <button
                type="button"
                className={`btn-toggle-solution ${isOpen ? 'open' : ''}`}
                onClick={() => toggleOpen(q.id)}
              >
                <span>{isOpen ? '▲ Hide CBSE Marking Scheme' : '▼ Reveal Official Step Marking & Rubric'}</span>
              </button>

              {isOpen && (
                <div className="pyq-rubric-wrap">
                  <MarkingSchemeRubric
                    valuePoints={q.valuePoints}
                    totalMarks={q.marks}
                    modelAnswer={q.mainAnswer}
                  />
                  {q.examinerNotes && q.examinerNotes.length > 0 && (
                    <div className="examiner-notes-box">
                      <strong>⚠️ Official Examiner Note:</strong>
                      <ul>
                        {q.examinerNotes.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .chapter-pyq-drill-root {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px dashed #e2e8f0;
        }
        .pyq-header-card {
          background: #fffbeb;
          border: 2px solid #fde68a;
          border-radius: 16px;
          padding: 1.5rem 1.75rem;
          margin-bottom: 1.75rem;
        }
        .pyq-badge-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
        }
        .pyq-fire-badge {
          background: #dc2626;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .pyq-verified-pill {
          background: #fef3c7;
          color: #b45309;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #fde68a;
        }
        .pyq-header-card h2 {
          font-size: 1.4rem;
          color: #78350f;
          margin: 0.2rem 0 0.4rem;
        }
        .pyq-subtitle {
          color: #92400e;
          font-size: 0.92rem;
          margin: 0;
          line-height: 1.5;
        }
        .pyq-questions-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .pyq-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem 1.4rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .pyq-card-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .pyq-meta-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .pyq-qno {
          background: #1e293b;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .pyq-set-badge {
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid #bfdbfe;
        }
        .pyq-marks-pill {
          background: #fdf2f8;
          color: #be185d;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          border: 1px solid #fbcfe8;
        }
        .pyq-section-label {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }
        .pyq-stem {
          font-size: 0.95rem;
          color: #1e293b;
          line-height: 1.55;
          margin-bottom: 0.85rem;
        }
        .btn-toggle-solution {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-weight: 600;
          font-size: 0.82rem;
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .btn-toggle-solution:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }
        .btn-toggle-solution.open {
          background: #fffbeb;
          border-color: #fde68a;
          color: #b45309;
        }
        .pyq-rubric-wrap {
          margin-top: 0.75rem;
          animation: fadeIn 0.2s ease-in;
        }
        .examiner-notes-box {
          margin-top: 0.65rem;
          background: #fffbeb;
          border: 1px solid #fef08a;
          padding: 0.7rem 0.9rem;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #854d0e;
        }
        .examiner-notes-box ul {
          margin: 0.3rem 0 0 1.2rem;
          padding: 0;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
