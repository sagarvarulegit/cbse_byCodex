'use client';

import React, { useState } from 'react';
import MarkingSchemeRubric from './MarkingSchemeRubric';
import AiAnswerEvaluatorModal from './AiAnswerEvaluatorModal';
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
  question: string | null;
  questionRefs: Record<string, number>;
  questionSource: string | null;
  mainAnswer: string;
  valuePoints: string[];
  examinerNotes: string[];
  officialBoardRef: string;
};

const ALL_PYQS: Record<string, ChapterPyqItem[]> = chapterPyqData as Record<string, ChapterPyqItem[]>;

export function getPyqsForChapter(chapterSlug: string): ChapterPyqItem[] {
  return ALL_PYQS[chapterSlug] ?? [];
}

export function drillTopic(mainAnswer: string): string {
  // Marking keys open with bullets or answer-part labels ("(a) (i)"), never
  // with the question itself — strip those so the row reads as a topic.
  // Some keys open with a bare part label, so scan past empty openers.
  const lines = mainAnswer.split('\n');
  for (const line of lines.slice(0, 4)) {
    const cleaned = line
      .trim()
      .replace(/^[•\-\*]\s*/, '')
      .replace(/^(\([a-z0-9]+\)\s*)+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > 0) {
      return cleaned.length > 90 ? `${cleaned.slice(0, 87).trim()}…` : cleaned;
    }
  }
  return 'Official marking key';
}
export function drillDemandLines(mainAnswer: string, maxLines = 4): string[] {
  // Marking keys never quote the official paper wording, so the card exposes
  // the full answer demand (every cleaned key line) instead of only the
  // first-line topic. Examiner instructions like "(any two responses)" are
  // marking guidance, not student content, so they are skipped.
  const out: string[] = [];
  for (const line of mainAnswer.split('\n')) {
    if (/^\(any\b/i.test(line.trim())) {
      continue;
    }
    const cleaned = line
      .trim()
      .replace(/^[•\-\*]\s*/, '')
      .replace(/^(\([a-z0-9]+\)\s*)+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length === 0) {
      continue;
    }
    out.push(cleaned);
    if (out.length >= maxLines) {
      break;
    }
  }
  return out;
}

export function drillPaperRef(q: ChapterPyqItem): string {
  return `${q.year} Set ${q.paperSet}, Q${q.qNo}`;
}

export type DrillWeightage = { set: string; questions: number; marks: number };
export function drillWeightage(pyqs: ChapterPyqItem[]): DrillWeightage[] {
  // Per-paper weightage: a question shared across sets counts toward each
  // set that carried it, so every row matches a real paper's total.
  const bySet: Record<string, { questions: number; marks: number }> = {};
  for (const q of pyqs) {
    for (const s of q.sets) {
      const entry = (bySet[s] ??= { questions: 0, marks: 0 });
      entry.questions += 1;
      entry.marks += q.marks;
    }
  }
  return Object.entries(bySet)
    .map(([set, v]) => ({ set, questions: v.questions, marks: v.marks }))
    .sort((a, b) => (a.set < b.set ? -1 : a.set > b.set ? 1 : 0));
}
export default function ChapterPyqDrill({ chapterSlug, token }: { chapterSlug: string; token?: string | null }) {
  const pyqs = getPyqsForChapter(chapterSlug);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [evaluatingQuestion, setEvaluatingQuestion] = useState<ChapterPyqItem | null>(null);

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
          <span className="pyq-ai-pill">🤖 AI Snap &amp; Grade Available</span>
        </div>
        <h2>Board Drill: Official Marking Keys</h2>
        <p className="pyq-subtitle">
          Each card is a real CBSE question&apos;s official checking scheme — the exact points
          the examiner awards marks for, written out on the card so you can attempt
          without hunting down the paper. Official 2026 paper citation on every card.
        </p>
        <p className="pyq-weightage-strip">
          <strong>Chapter weightage:</strong>{' '}
          {drillWeightage(pyqs)
            .map(
              (w) =>
                `${w.set}: ${Number.isInteger(w.marks) ? w.marks : w.marks.toFixed(1)} marks (${w.questions} Qs)`,
            )
            .join(' · ')}
        </p>
        <ol className="pyq-steps">
          <li><strong>Attempt.</strong> Cover the card and write every point under “Write” from memory in your notebook.</li>
          <li><strong>Check.</strong> Snap a photo to get it AI-graded, or reveal the step marking yourself.</li>
          <li><strong>Fix.</strong> Add every value point you missed, then re-attempt from memory.</li>
        </ol>
      </div>

      <div className="pyq-questions-list">
        {pyqs.map((q, idx) => {
          const isOpen = openIds.has(q.id);
          const topic = drillTopic(q.mainAnswer);
          const demand = drillDemandLines(q.mainAnswer);

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

              {q.question ? (
                <div className="pyq-question-row">
                  <span className="pyq-topic-label">Question</span>
                  <p>{q.question}</p>
                </div>
              ) : null}
              <div className="pyq-topic-row">
                <span className="pyq-topic-label">Topic</span>
                <p>{topic}</p>
              </div>
              <div className="pyq-demand-box">
                <span className="pyq-topic-label">Write</span>
                <ul>
                  {demand.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>
              <p className="pyq-find-row">
                Attempt these points from memory, then reveal the step marking below.
                Official source: <strong>{q.officialBoardRef}</strong>.
              </p>

              <div className="pyq-card-action-row" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-snap-grade"
                  style={{
                    background: '#7c3aed',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                  onClick={() => setEvaluatingQuestion(q)}
                >
                  <span>🤖 Snap &amp; Grade My Answer →</span>
                </button>

                <button
                  type="button"
                  className={`btn-toggle-solution ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleOpen(q.id)}
                >
                  <span>{isOpen ? '▲ Hide CBSE Marking Scheme' : '▼ Reveal Step Marking & Rubric'}</span>
                </button>
              </div>

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

      {evaluatingQuestion && (
        <AiAnswerEvaluatorModal
          isOpen={Boolean(evaluatingQuestion)}
          onClose={() => setEvaluatingQuestion(null)}
          questionId={evaluatingQuestion.id}
          questionStem={`${evaluatingQuestion.question ? `Board question: ${evaluatingQuestion.question} ` : ''}Topic: ${drillTopic(evaluatingQuestion.mainAnswer)} — ${drillDemandLines(evaluatingQuestion.mainAnswer).join('; ')} (${drillPaperRef(evaluatingQuestion)}, ${evaluatingQuestion.marks} marks). The student attempted the official value points from memory. Grade against the official value points.`}
          maxMarks={evaluatingQuestion.marks}
          officialValuePoints={evaluatingQuestion.valuePoints}
          modelAnswer={evaluatingQuestion.mainAnswer}
          token={token}
        />
      )}

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
        .pyq-steps {
          margin: 0.8rem 0 0;
          padding-left: 1.2rem;
          color: #92400e;
          font-size: 0.88rem;
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .pyq-weightage-strip {
          margin: 0.7rem 0 0;
          font-size: 0.88rem;
          color: #0f172a;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 0.6rem 0.9rem;
          line-height: 1.6;
        }
        .pyq-topic-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          margin-bottom: 0.6rem;
        }
        .pyq-topic-row p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.5;
        }
        .pyq-topic-label {
          flex-shrink: 0;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7c3aed;
          background: #ede9fe;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .pyq-question-row {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #7c3aed;
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          margin-bottom: 0.6rem;
        }
        .pyq-question-row p {
          margin: 0;
          font-size: 0.92rem;
          color: #0f172a;
          line-height: 1.6;
          white-space: pre-line;
        }
        .pyq-demand-box {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 0.7rem 0.9rem;
          margin-bottom: 0.6rem;
        }
        .pyq-demand-box ul {
          margin: 0;
          padding-left: 1.1rem;
          font-size: 0.9rem;
          color: #0f172a;
          line-height: 1.55;
        }
        .pyq-find-row {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.55;
          margin: 0 0 0.85rem;
        }
        .pyq-set-badge {
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
