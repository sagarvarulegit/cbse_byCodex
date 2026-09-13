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
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
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

  function toggleRevealed(id: string) {
    const hiding = revealedIds.has(id);
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (hiding) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    if (hiding) {
      // Hiding the demand also closes the marking scheme: no answers on
      // screen while the student is attempting.
      setOpenIds((prev) => {
        if (!prev.has(id)) {
          return prev;
        }
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
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
          <li><strong>Attempt.</strong> Read the board question and write your full answer from memory.</li>
          <li><strong>Reveal.</strong> Uncover the demand and tick off every point you nailed or missed.</li>
          <li><strong>Check.</strong> Snap a photo for AI grading, or open the official step marking.</li>
        </ol>
      </div>

      <div className="pyq-questions-list">
        {pyqs.map((q, idx) => {
          const isOpen = openIds.has(q.id);
          const isRevealed = revealedIds.has(q.id);
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
              <p className="pyq-find-row">
                Official source: <strong>{q.officialBoardRef}</strong>.
              </p>
              {isRevealed ? (
                <>
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
                    Tick off every point you wrote, then check the step marking below.
                  </p>
                </>
              ) : (
                <div className="pyq-attempt-hint">
                  <span className="pyq-topic-label">Attempt</span>
                  <p>Cover the screen, write your full answer from memory, then reveal the demand.</p>
                </div>
              )}

              <div className="pyq-card-action-row">
                <button
                  type="button"
                  className="btn-snap-grade"
                  onClick={() => setEvaluatingQuestion(q)}
                >
                  <span>🤖 Snap &amp; Grade My Answer →</span>
                </button>

                <button
                  type="button"
                  className="btn-toggle-solution"
                  onClick={() => toggleRevealed(q.id)}
                >
                  <span>{isRevealed ? '▲ Hide Answer Demand' : '👁 Reveal Answer Demand'}</span>
                </button>
                {isRevealed && (
                  <button
                    type="button"
                    className={`btn-toggle-solution ${isOpen ? 'open' : ''}`}
                    onClick={() => toggleOpen(q.id)}
                  >
                    <span>{isOpen ? '▲ Hide CBSE Marking Scheme' : '▼ Reveal Step Marking & Rubric'}</span>
                  </button>
                )}
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
    </section>
  );
}
