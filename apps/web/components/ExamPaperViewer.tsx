'use client';

import { useMemo, useState } from 'react';

import type {
  ExamPaper,
  ExamPaperQuestion,
} from '../lib/exam-papers';

import MarkingSchemeRubric from './MarkingSchemeRubric';

function VerificationBadge({ paper }: { paper: ExamPaper }) {
  if (paper.verificationStatus === 'verified') {
    return <span className="exam-badge exam-badge-verified">Verified ✓</span>;
  }
  if (paper.verificationStatus === 'review') {
    return <span className="exam-badge exam-badge-review">Pending review</span>;
  }
  return <span className="exam-badge exam-badge-unverified">Not yet verified</span>;
}

function QuestionCard({
  question,
  showAnswers,
}: {
  question: ExamPaperQuestion;
  showAnswers: boolean;
}) {
  const isMcq = question.questionType === 'mcq';
  const options = question.answerKey.options ?? [];
  const correctIndex = question.answerKey.correctOptionIndex ?? -1;
  const correctOptionText =
    isMcq && correctIndex >= 0 && options[correctIndex]
      ? `${String.fromCharCode(97 + correctIndex)}. ${options[correctIndex]}`
      : null;

  return (
    <li className="exam-question">
      <p className="exam-question-text">
        <strong>Q{question.questionNumber}.</strong> {question.statement}{' '}
        <span className="exam-marks">({question.marks} mark{question.marks > 1 ? 's' : ''})</span>
      </p>

      {isMcq && options.length > 0 && (
        <ol className="exam-options">
          {options.map((option, index) => (
            <li
              key={`${question.questionNumber}-${index}`}
              className={showAnswers && index === correctIndex ? 'exam-option-correct' : undefined}
            >
              {String.fromCharCode(97 + index)}. {option}
            </li>
          ))}
        </ol>
      )}

      {showAnswers && (
        <MarkingSchemeRubric
          valuePoints={question.answerKey.valuePoints ?? []}
          totalMarks={question.marks}
          modelAnswer={question.answerKey.modelAnswer}
          isMcq={isMcq}
          correctOptionText={correctOptionText}
        />
      )}
    </li>
  );
}

export default function ExamPaperViewer({
  paper,
  compact = false,
}: {
  paper: ExamPaper;
  compact?: boolean;
}) {
  const [showAnswers, setShowAnswers] = useState(false);

  const questionsBySection = useMemo(() => {
    const map = new Map<string, ExamPaperQuestion[]>();
    for (const question of paper.questions) {
      const list = map.get(question.sectionId) ?? [];
      list.push(question);
      map.set(question.sectionId, list);
    }
    return map;
  }, [paper.questions]);

  return (
    <div className="exam-paper-print-area">
      <div className="exam-paper-header">
        <div>
          <p className="eyebrow">ChapterReady · CBSE Class 10</p>
          <h1>{paper.title}</h1>
          <p className="subtext compact">
            {paper.totalMarks} marks · {paper.durationMinutes} minutes (+ {paper.readingTimeMinutes} minutes reading) · Seed {paper.seed}
          </p>
        </div>
        <VerificationBadge paper={paper} />
      </div>

      <div className="exam-toolbar">
        <a
          className="card-link btn-print-pdf"
          href={`/exam-papers/${paper.id}/print?mode=questions`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🖨️ Official Printable Board PDF
        </a>
        <a
          className="card-link btn-marking-pdf"
          href={`/exam-papers/${paper.id}/print?mode=solutions`}
          target="_blank"
          rel="noopener noreferrer"
        >
          📝 Official Marking Scheme (PDF)
        </a>
        <button
          className="card-link"
          type="button"
          onClick={() => setShowAnswers((current) => !current)}
        >
          {showAnswers ? 'Hide Inline Solutions' : 'Show Inline Solutions'}
        </button>
      </div>

      {paper.sections.map((section) => {
        const questions = questionsBySection.get(section.id) ?? [];
        return (
          <section className="exam-section" key={section.id}>
            <h2>
              {section.title}{' '}
              <span className="exam-marks">
                ({section.questionCount} × {section.marksPerQuestion} mark
                {section.marksPerQuestion > 1 ? 's' : ''})
              </span>
            </h2>
            <p className="exam-instructions">{section.instructions}</p>
            <ol className="exam-question-list">
              {questions.map((question) => (
                <QuestionCard
                  key={question.questionNumber}
                  question={question}
                  showAnswers={showAnswers}
                />
              ))}
            </ol>
          </section>
        );
      })}

      <p className="exam-footer-note">
        Generated on the ChapterReady platform from the verified question bank.
        Answer keys use platform marking points and are reviewed before
        publication.
      </p>

      <style>{`
        .exam-paper-header { display: flex; justify-content: space-between; gap: 1rem; align-items: flex-start; margin-bottom: 1rem; }
        .exam-badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
        .exam-badge-verified { background: #e8f7ee; color: #1b7a3d; border: 1px solid #bfe8cd; }
        .exam-badge-review { background: #fff4e5; color: #a35c00; border: 1px solid #f5d9a8; }
        .exam-badge-unverified { background: #f2f2f2; color: #666; border: 1px solid #ddd; }
        .exam-toolbar { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1rem 0 1.5rem; }
        .exam-toolbar .card-link { margin: 0; }
        .exam-section { margin-bottom: 2rem; }
        .exam-section h2 { margin-bottom: 0.25rem; }
        .exam-instructions { color: var(--muted, #555); font-size: 0.9rem; margin-bottom: 0.75rem; }
        .exam-question-list { list-style: none; padding: 0; margin: 0; }
        .exam-question { border-top: 1px solid var(--border, #eee); padding: 0.75rem 0; }
        .exam-question-text { margin: 0 0 0.35rem; }
        .exam-marks { color: var(--muted, #555); font-size: 0.85rem; }
        .exam-options { margin: 0.25rem 0 0.25rem 1.25rem; }
        .exam-option-correct { color: #1b7a3d; font-weight: 600; }
        .exam-answer { margin-top: 0.5rem; padding: 0.5rem 0.75rem; background: #faf6f0; border-radius: 8px; }
        .exam-answer-model { white-space: pre-wrap; }
        .exam-value-points { margin: 0.5rem 0 0 1.25rem; }
        .exam-footer-note { margin-top: 2rem; font-size: 0.8rem; color: var(--muted, #888); }

        @media print {
          body * { visibility: hidden; }
          .exam-paper-print-area, .exam-paper-print-area * { visibility: visible; }
          .exam-paper-print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .exam-toolbar { display: none; }
          .exam-answer { display: block; }
          .exam-question { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
