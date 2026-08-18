'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

import type { ExamPaper, ExamPaperQuestion } from '../lib/exam-papers';

export type PrintableExamPaperProps = {
  paper: ExamPaper;
  initialMode?: 'questions' | 'solutions';
  subjectTitle?: string;
  subjectCode?: string;
};

export default function PrintableExamPaper({
  paper,
  initialMode = 'questions',
  subjectTitle = 'Mathematics Standard',
  subjectCode = '041',
}: PrintableExamPaperProps) {
  const [mode, setMode] = useState<'questions' | 'solutions'>(initialMode);

  // Group questions by section
  const questionsBySection = useMemo(() => {
    const map = new Map<string, ExamPaperQuestion[]>();
    for (const q of paper.questions) {
      const list = map.get(q.sectionId) ?? [];
      list.push(q);
      map.set(q.sectionId, list);
    }
    return map;
  }, [paper.questions]);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="printable-root">
      {/* On-screen control bar (Hidden in @media print) */}
      <div className="print-controls-bar no-print">
        <div className="controls-left">
          <Link href="/exam-papers" className="back-link">
            ← Back to Mock Test Series
          </Link>
          <div className="mode-toggle-group">
            <button
              type="button"
              className={`toggle-btn ${mode === 'questions' ? 'active' : ''}`}
              onClick={() => setMode('questions')}
            >
              📄 Question Paper (Exam Mode)
            </button>
            <button
              type="button"
              className={`toggle-btn ${mode === 'solutions' ? 'active' : ''}`}
              onClick={() => setMode('solutions')}
            >
              📝 Official Marking Scheme (Solutions)
            </button>
          </div>
        </div>

        <div className="controls-right">
          <button type="button" className="btn-print-action" onClick={handlePrint}>
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* The Official Printable Board Exam Sheet */}
      <article className="cbse-paper-document">
        {/* Document Header */}
        <header className="cbse-paper-header">
          <div className="cbse-crest-row">
            <span className="cbse-series-tag">CBSE CLASS 10 BOARD EXAMINATION 2025–26</span>
            <span className="cbse-set-badge">SET · SEED {paper.seed}</span>
          </div>

          <h1 className="cbse-subject-title">
            {subjectTitle.toUpperCase()}
          </h1>
          <p className="cbse-subject-code">
            (SUBJECT CODE: {subjectCode})
          </p>

          <div className="cbse-timing-row">
            <span><strong>Time Allowed:</strong> {paper.durationMinutes / 60} Hours (180 Minutes)</span>
            <span><strong>Maximum Marks:</strong> {paper.totalMarks}</span>
          </div>

          {/* Roll Number Box Grid */}
          <div className="cbse-candidate-grid">
            <div className="roll-box-group">
              <span className="box-label">Roll No.</span>
              <div className="roll-cells">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="roll-cell" />
                ))}
              </div>
            </div>
            <div className="candidate-name-line">
              <span>Candidate Name: _____________________________________</span>
            </div>
          </div>

          {/* Mode Indicator Banner */}
          {mode === 'solutions' ? (
            <div className="solutions-banner">
              <strong>OFFICIAL TEACHER MARKING SCHEME &amp; EVALUATOR RUBRIC</strong>
              <span>Includes step-wise value points, formula marks, and model answer keys.</span>
            </div>
          ) : (
            /* General Instructions */
            <div className="cbse-instructions-box">
              <h3>General Instructions:</h3>
              <ol className="instructions-list">
                <li>This question paper contains <strong>{paper.questions.length} questions</strong> divided into <strong>5 Sections</strong>: A, B, C, D, and E.</li>
                <li><strong>Section A</strong> comprises 20 Multiple Choice Questions (MCQs) of 1 mark each.</li>
                <li><strong>Section B</strong> comprises 5 Short Answer Type-I (SA-I) questions of 2 marks each.</li>
                <li><strong>Section C</strong> comprises 6 Short Answer Type-II (SA-II) questions of 3 marks each.</li>
                <li><strong>Section D</strong> comprises 4 Long Answer (LA) questions of 5 marks each.</li>
                <li><strong>Section E</strong> comprises 3 Case-Based integrated units of assessment of 4 marks each with sub-parts.</li>
                <li>All Questions are compulsory. However, an internal choice in 2 Qs of 2 marks, 2 Qs of 3 marks, and 2 Qs of 5 marks has been provided.</li>
                <li>Use of calculators is <strong>not permitted</strong>. Neat and clean diagrams must be drawn wherever required.</li>
              </ol>
            </div>
          )}
        </header>

        {/* Paper Sections and Questions */}
        <main className="cbse-sections-body">
          {paper.sections.map((section) => {
            const sectionQuestions = questionsBySection.get(section.id) ?? [];
            return (
              <section className="cbse-section-block" key={section.id}>
                <div className="section-title-banner">
                  <h2>
                    {section.title.toUpperCase()}
                  </h2>
                  <span className="section-marks-badge">
                    ({section.questionCount} Questions × {section.marksPerQuestion} Mark{section.marksPerQuestion > 1 ? 's' : ''} = {section.questionCount * section.marksPerQuestion} Marks)
                  </span>
                </div>
                <p className="section-instructions-text">{section.instructions}</p>

                <div className="questions-container">
                  {sectionQuestions.map((q) => {
                    const isMcq = q.questionType === 'mcq';
                    const options = q.answerKey?.options ?? [];
                    const correctIndex = q.answerKey?.correctOptionIndex ?? -1;

                    return (
                      <div className="question-item" key={q.questionNumber}>
                        <div className="question-statement-row">
                          <span className="q-number">Q{q.questionNumber}.</span>
                          <div className="q-statement">
                            <p>{q.statement}</p>
                          </div>
                          <span className="q-marks">[{q.marks}]</span>
                        </div>

                        {/* MCQ Options */}
                        {isMcq && options.length > 0 && (
                          <div className="mcq-options-grid">
                            {options.map((opt, optIndex) => {
                              const letter = String.fromCharCode(97 + optIndex);
                              const isCorrect = mode === 'solutions' && optIndex === correctIndex;
                              return (
                                <div
                                  key={optIndex}
                                  className={`mcq-opt-item ${isCorrect ? 'opt-correct' : ''}`}
                                >
                                  <span className="opt-letter">({letter})</span>
                                  <span className="opt-text">{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Official Marking Scheme & Value Points (Only in solutions mode) */}
                        {mode === 'solutions' && (
                          <div className="solution-box">
                            <div className="solution-header">
                              <strong>Marking Scheme &amp; Step Breakdown:</strong>
                            </div>

                            {isMcq ? (
                              <p className="solution-model-text">
                                Correct Answer: <strong>({String.fromCharCode(97 + correctIndex)}) {options[correctIndex] ?? ''}</strong> [1 Mark]
                              </p>
                            ) : (
                              <>
                                <p className="solution-model-text">{q.answerKey.modelAnswer}</p>
                                {q.answerKey.valuePoints && q.answerKey.valuePoints.length > 0 && (
                                  <div className="value-points-wrap">
                                    <span className="vp-title">Step-wise Marks Allotment:</span>
                                    <ul className="value-points-list">
                                      {q.answerKey.valuePoints.map((point, ptIndex) => (
                                        <li key={ptIndex}>{point}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </main>

        {/* Official Footer */}
        <footer className="cbse-paper-footer">
          <div className="footer-line">
            <span>CBSE Class 10 Board Mock Series · Verified Aligned with NCERT &amp; Official CBSE Sample Paper 2025–26</span>
            <span className="page-mark">Page End · ChapterReady.in</span>
          </div>
        </footer>
      </article>

      <style jsx>{`
        .printable-root {
          min-height: 100vh;
          background: #525659;
          padding: 1.5rem 1rem 4rem;
          font-family: 'Times New Roman', Times, serif;
          color: #000000;
        }

        /* Top control bar */
        .print-controls-bar {
          max-width: 850px;
          margin: 0 auto 1.5rem;
          background: #ffffff;
          border-radius: 12px;
          padding: 0.875rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .back-link {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #c25e00;
          text-decoration: none;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .mode-toggle-group {
          display: flex;
          background: #f1ede4;
          padding: 3px;
          border-radius: 8px;
        }

        .toggle-btn {
          border: none;
          background: transparent;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #5d5750;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .toggle-btn.active {
          background: #171513;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }

        .btn-print-action {
          padding: 0.6rem 1.25rem;
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-print-action:hover {
          background: #c25e00;
        }

        /* The Paper Document */
        .cbse-paper-document {
          max-width: 850px;
          margin: 0 auto;
          background: #ffffff;
          padding: 3rem 3.5rem;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
          line-height: 1.45;
        }

        .cbse-paper-header {
          text-align: center;
          border-bottom: 2px solid #000000;
          padding-bottom: 1.25rem;
          margin-bottom: 1.75rem;
        }

        .cbse-crest-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          font-weight: bold;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .cbse-set-badge {
          border: 1.5px solid #000000;
          padding: 0.15rem 0.5rem;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .cbse-subject-title {
          font-size: 1.6rem;
          font-weight: bold;
          letter-spacing: 0.04em;
          margin: 0 0 0.2rem 0;
        }

        .cbse-subject-code {
          font-size: 0.9375rem;
          font-weight: bold;
          margin: 0 0 0.75rem 0;
        }

        .cbse-timing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9375rem;
          font-weight: bold;
          border-top: 1px solid #000000;
          border-bottom: 1px solid #000000;
          padding: 0.4rem 0;
          margin-bottom: 1rem;
        }

        .cbse-candidate-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .roll-box-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .box-label {
          font-weight: bold;
        }

        .roll-cells {
          display: flex;
          gap: 2px;
        }

        .roll-cell {
          display: inline-block;
          width: 18px;
          height: 22px;
          border: 1px solid #000000;
        }

        .cbse-instructions-box {
          text-align: left;
          background: #fdfdfd;
          border: 1px solid #000000;
          padding: 0.875rem 1.25rem;
          font-size: 0.8125rem;
        }

        .cbse-instructions-box h3 {
          font-size: 0.875rem;
          font-weight: bold;
          margin: 0 0 0.35rem 0;
          text-decoration: underline;
        }

        .instructions-list {
          margin: 0;
          padding-left: 1.25rem;
        }

        .instructions-list li {
          margin-bottom: 0.25rem;
        }

        .solutions-banner {
          background: #f4f4f4;
          border: 2px dashed #000000;
          padding: 0.75rem;
          font-size: 0.875rem;
        }

        .solutions-banner strong {
          display: block;
          font-size: 1rem;
        }

        /* Sections */
        .cbse-section-block {
          margin-bottom: 2rem;
          page-break-inside: auto;
        }

        .section-title-banner {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          border-bottom: 1.5px solid #000000;
          padding-bottom: 0.25rem;
          margin-bottom: 0.35rem;
        }

        .section-title-banner h2 {
          font-size: 1.05rem;
          font-weight: bold;
          margin: 0;
        }

        .section-marks-badge {
          font-size: 0.8125rem;
          font-weight: bold;
        }

        .section-instructions-text {
          font-size: 0.8125rem;
          font-style: italic;
          margin: 0 0 0.875rem 0;
        }

        /* Questions */
        .questions-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-item {
          page-break-inside: avoid;
          padding-bottom: 0.75rem;
          border-bottom: 1px dotted #ccc;
        }

        .question-statement-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.9375rem;
        }

        .q-number {
          font-weight: bold;
          flex: 0 0 auto;
        }

        .q-statement {
          flex: 1;
        }

        .q-statement p {
          margin: 0;
        }

        .q-marks {
          font-weight: bold;
          flex: 0 0 auto;
        }

        .mcq-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.35rem 1.5rem;
          margin: 0.5rem 0 0 1.5rem;
          font-size: 0.875rem;
        }

        .mcq-opt-item {
          display: flex;
          gap: 0.35rem;
        }

        .opt-letter {
          font-weight: bold;
        }

        .opt-correct {
          font-weight: bold;
          color: #065f46;
          background: #ecfdf5;
          padding: 0 0.25rem;
        }

        /* Solutions */
        .solution-box {
          margin: 0.75rem 0 0 1.5rem;
          padding: 0.6rem 0.875rem;
          background: #faf8f5;
          border-left: 3px solid #000000;
          font-size: 0.8125rem;
        }

        .solution-header {
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .solution-model-text {
          margin: 0 0 0.4rem 0;
          white-space: pre-wrap;
        }

        .value-points-wrap {
          margin-top: 0.35rem;
        }

        .vp-title {
          font-weight: bold;
          font-size: 0.75rem;
        }

        .value-points-list {
          margin: 0.2rem 0 0 1rem;
          padding: 0;
        }

        .value-points-list li {
          margin-bottom: 0.15rem;
        }

        .cbse-paper-footer {
          margin-top: 3rem;
          border-top: 1px solid #000000;
          padding-top: 0.75rem;
          font-size: 0.75rem;
          text-align: center;
        }

        .footer-line {
          display: flex;
          justify-content: space-between;
        }

        /* Print Media Styles */
        @media print {
          .no-print {
            display: none !important;
          }

          .printable-root {
            background: #ffffff !important;
            padding: 0 !important;
          }

          .cbse-paper-document {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }

          .question-item {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .cbse-section-block {
            break-inside: auto;
          }
        }
      `}</style>
    </div>
  );
}
