'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { ExamPaper, ExamPaperQuestion } from '../lib/exam-papers';
import type { ExamPaperQuestionResult } from '../lib/exam-papers';
import MarkingSchemeRubric from './MarkingSchemeRubric';

type AnswerEntry = {
  mcqOption?: number;
  written?: string;
};

type SectionResult = {
  sectionId: string;
  title: string;
  earnedMarks: number;
  possibleMarks: number;
  mcqCorrect: number;
  mcqTotal: number;
};

type ChapterResult = {
  chapterSlug: string;
  label: string;
  earnedMarks: number;
  possibleMarks: number;
};

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

function chapterLabel(slug: string | null | undefined): string {
  if (!slug) {
    return 'Uncategorised';
  }
  return CHAPTER_LABELS[slug] ?? slug.replace(/-/g, ' ');
}

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function createClientAttemptId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ExamPaperRunner({ paper }: { paper: ExamPaper }) {
  const [answers, setAnswers] = useState<Record<number, AnswerEntry>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(paper.durationMinutes * 60);
  const [submitted, setSubmitted] = useState(false);
  const [selfMarks, setSelfMarks] = useState<Record<number, number>>({});
  const [marksVisible, setMarksVisible] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedAttempt, setSavedAttempt] = useState<{ id: string; attemptNumber: number } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const startRef = useRef(Date.now());
  const clientAttemptIdRef = useRef(createClientAttemptId());

  const buildQuestionResults = (includeSelfMarks: boolean): ExamPaperQuestionResult[] =>
    paper.questions.map((question) => {
      const entry = answers[question.questionNumber] ?? {};
      const isMcq = question.questionType === 'mcq';
      const chosen = entry.mcqOption;
      const right = question.answerKey.correctOptionIndex ?? -1;
      const correct = isMcq && chosen === right;
      const earnedMarks = isMcq
        ? correct
          ? question.marks
          : 0
        : includeSelfMarks
          ? Math.min(selfMarks[question.questionNumber] ?? 0, question.marks)
          : 0;
      return {
        questionNumber: question.questionNumber,
        sectionId: question.sectionId,
        questionType: question.questionType,
        chapterSlug: question.chapterSlug ?? 'uncategorised',
        marks: question.marks,
        earnedMarks,
        correct,
      };
    });

  const saveAttempt = async (includeSelfMarks: boolean) => {
    const questionResults = buildQuestionResults(includeSelfMarks);
    const mcqCorrect = paper.questions.filter(
      (question) =>
        question.questionType === 'mcq' &&
        answers[question.questionNumber]?.mcqOption ===
          (question.answerKey.correctOptionIndex ?? -1),
    ).length;
    const mcqTotal = paper.questions.filter(
      (question) => question.questionType === 'mcq',
    ).length;
    const earnedMarks = questionResults.reduce((sum, result) => sum + result.earnedMarks, 0);

    try {
      const response = await fetch(`/api/exam-papers/${paper.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientAttemptId: clientAttemptIdRef.current,
          totalMarks: paper.totalMarks,
          earnedMarks,
          mcqCorrect,
          mcqTotal,
          writtenSelfMarked: includeSelfMarks,
          questionResults,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.attempt) {
        setSavedAttempt({
          id: payload.attempt.id,
          attemptNumber: payload.attempt.attemptNumber,
        });
        setSaveState('saved');
        if (payload.updated) {
          setSaveMessage('Self-marks saved — your weak-area report is updated.');
        } else {
          setSaveMessage(
            includeSelfMarks
              ? `Attempt ${payload.attempt.attemptNumber} saved with your self-marks.`
              : `Attempt ${payload.attempt.attemptNumber} saved — self-mark written answers below to complete it.`,
          );
        }
        return true;
      }
      setSaveState('error');
      setSaveMessage('This attempt could not be saved. You may be signed out.');
      return false;
    } catch {
      setSaveState('error');
      setSaveMessage('This attempt could not be saved. You may be signed out.');
      return false;
    }
  };

  const submit = async () => {
    setSubmitted(true);
    setMarksVisible(true);
    setSaveState('saving');
    startRef.current = Date.now();
    // Initial save: MCQs auto-scored, written answers scored at 0 until the
    // student self-marks them (write-before-check philosophy, same as the
    // chapter exam-practice flow).
    await saveAttempt(false);
  };

  const saveSelfMarks = async () => {
    setSaveState('saving');
    await saveAttempt(true);
  };

  // Countdown timer — stops at zero but does not auto-submit; the student owns
  // submitting (matching the exam-practice write-before-check philosophy).
  useEffect(() => {
    const startedAt = startRef.current;
    const total = paper.durationMinutes * 60;
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      setRemainingSeconds(Math.max(0, total - elapsed));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paper.durationMinutes]);

  const questionsBySection = useMemo(() => {
    const map = new Map<string, ExamPaperQuestion[]>();
    for (const question of paper.questions) {
      const list = map.get(question.sectionId) ?? [];
      list.push(question);
      map.set(question.sectionId, list);
    }
    return map;
  }, [paper.questions]);

  const setMcq = (questionNumber: number, optionIndex: number) => {
    setAnswers((current) => ({
      ...current,
      [questionNumber]: { ...current[questionNumber], mcqOption: optionIndex },
    }));
  };

  const setWritten = (questionNumber: number, text: string) => {
    setAnswers((current) => ({
      ...current,
      [questionNumber]: { ...current[questionNumber], written: text },
    }));
  };

  const answeredCount = paper.questions.filter((question) => {
    const entry = answers[question.questionNumber];
    if (!entry) {
      return false;
    }
    if (question.questionType === 'mcq') {
      return entry.mcqOption !== undefined;
    }
    return (entry.written ?? '').trim().length > 0;
  }).length;

  const mcqResult = useMemo(() => {
    const correct: number[] = [];
    const wrong: number[] = [];
    let earned = 0;
    for (const question of paper.questions) {
      if (question.questionType !== 'mcq') {
        continue;
      }
      const chosen = answers[question.questionNumber]?.mcqOption;
      const right = question.answerKey.correctOptionIndex ?? -1;
      if (chosen === right) {
        correct.push(question.questionNumber);
        earned += question.marks;
      } else if (chosen !== undefined) {
        wrong.push(question.questionNumber);
      }
    }
    return { correct, wrong, earned };
  }, [answers, paper.questions]);

  const sectionResults: SectionResult[] = useMemo(() => {
    if (!submitted) {
      return [];
    }
    return paper.sections.map((section) => {
      const questions = questionsBySection.get(section.id) ?? [];
      let earnedMarks = 0;
      let possibleMarks = 0;
      let mcqCorrect = 0;
      let mcqTotal = 0;
      for (const question of questions) {
        possibleMarks += question.marks;
        if (question.questionType === 'mcq') {
          mcqTotal += 1;
          const chosen = answers[question.questionNumber]?.mcqOption;
          if (chosen === (question.answerKey.correctOptionIndex ?? -1)) {
            earnedMarks += question.marks;
            mcqCorrect += 1;
          }
        } else {
          const selfMark = selfMarks[question.questionNumber] ?? 0;
          earnedMarks += Math.min(selfMark, question.marks);
        }
      }
      return {
        sectionId: section.id,
        title: section.title,
        earnedMarks,
        possibleMarks,
        mcqCorrect,
        mcqTotal,
      };
    });
  }, [answers, paper.questions, paper.sections, questionsBySection, selfMarks, submitted]);

  const chapterResults: ChapterResult[] = useMemo(() => {
    if (!submitted) {
      return [];
    }
    const totals = new Map<string, { earned: number; possible: number }>();
    for (const question of paper.questions) {
      const key = question.chapterSlug ?? 'uncategorised';
      const current = totals.get(key) ?? { earned: 0, possible: 0 };
      current.possible += question.marks;
      if (question.questionType === 'mcq') {
        const chosen = answers[question.questionNumber]?.mcqOption;
        if (chosen === (question.answerKey.correctOptionIndex ?? -1)) {
          current.earned += question.marks;
        }
      } else {
        current.earned += Math.min(selfMarks[question.questionNumber] ?? 0, question.marks);
      }
      totals.set(key, current);
    }
    return Array.from(totals.entries())
      .map(([chapterSlug, { earned, possible }]) => ({
        chapterSlug,
        label: chapterLabel(chapterSlug),
        earnedMarks: earned,
        possibleMarks: possible,
      }))
      .sort((left, right) => left.earnedMarks - right.earnedMarks);
  }, [answers, paper.questions, selfMarks, submitted]);

  const totalEarned = sectionResults.reduce((sum, section) => sum + section.earnedMarks, 0);
  const totalPossible = sectionResults.reduce((sum, section) => sum + section.possibleMarks, 0);
  const weakChapters = chapterResults.filter(
    (chapter) => chapter.possibleMarks > 0 && chapter.earnedMarks / chapter.possibleMarks < 0.5,
  );

  if (submitted) {
    return (
      <div className="exam-runner exam-runner-result">
        <div className="exam-runner-header">
          <div>
            <p className="eyebrow">ChapterReady · Mock Test Result</p>
            <h1>{paper.title}</h1>
            <p className="subtext compact">
              Estimated score: <strong>{totalEarned} / {totalPossible} marks</strong>
            </p>
            {saveState === 'saving' && (
              <p className="exam-save-status">Saving your attempt…</p>
            )}
            {saveState === 'saved' && savedAttempt && (
              <p className="exam-save-status exam-save-ok">
                {saveMessage ??
                  `Attempt ${savedAttempt.attemptNumber} saved — your weak-area report is updated.`}
              </p>
            )}
            {saveState === 'error' && (
              <p className="exam-save-status exam-save-error">
                {saveMessage ??
                  'This attempt could not be saved (you may be signed out). Your score below is still shown for this session.'}
              </p>
            )}
          </div>
        </div>

        <div className="exam-result-card">
          <h2>Section-wise breakdown</h2>
          <ul className="exam-result-list">
            {sectionResults.map((section) => (
              <li key={section.sectionId}>
                <span>{section.title}</span>
                <span>
                  {section.earnedMarks} / {section.possibleMarks} marks
                  {section.mcqTotal > 0
                    ? ` · MCQ ${section.mcqCorrect}/${section.mcqTotal}`
                    : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="exam-result-card">
          <h2>Weak chapters — revise these first</h2>
          {weakChapters.length > 0 ? (
            <ul className="exam-result-list">
              {weakChapters.map((chapter) => (
                <li key={chapter.chapterSlug}>
                  <span>{chapter.label}</span>
                  <span>
                    {chapter.earnedMarks} / {chapter.possibleMarks} marks
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="subtext compact">No chapter below 50% — strong attempt!</p>
          )}
        </div>

        <div className="exam-result-actions">
          <Link className="card-link" href="/exam-papers" prefetch={false}>
            Back to Mock Test Series
          </Link>
          <button
            className="card-link"
            type="button"
            onClick={() => void saveSelfMarks()}
            disabled={saveState === 'saving'}
          >
            {saveState === 'saving' ? 'Saving…' : 'Save my self-marks'}
          </button>
        </div>

        <details className="exam-answer-review">
          <summary>Review answers against the marking scheme</summary>
          {paper.sections.map((section) => {
            const questions = questionsBySection.get(section.id) ?? [];
            return (
              <section className="exam-section" key={section.id}>
                <h2>{section.title}</h2>
                <ol className="exam-question-list">
                  {questions.map((question) => {
                    const entry = answers[question.questionNumber] ?? {};
                    const isMcq = question.questionType === 'mcq';
                    const chosen = entry.mcqOption;
                    const right = question.answerKey.correctOptionIndex ?? -1;
                    const correct = isMcq && chosen === right;
                    return (
                      <li
                        className="exam-question exam-review-question"
                        key={question.questionNumber}
                      >
                        <p className="exam-question-text">
                          <strong>Q{question.questionNumber}.</strong> {question.statement}{' '}
                          <span className="exam-marks">({question.marks} mark
                            {question.marks > 1 ? 's' : ''})</span>
                        </p>
                        {isMcq ? (
                          <>
                            <ol className="exam-options">
                              {(question.answerKey.options ?? []).map((option, index) => (
                                <li
                                  key={`${question.questionNumber}-${index}`}
                                  className={
                                    index === right
                                      ? 'exam-option-correct'
                                      : chosen === index
                                        ? 'exam-option-wrong'
                                        : undefined
                                  }
                                >
                                  {String.fromCharCode(97 + index)}. {option}
                                </li>
                              ))}
                            </ol>
                            <p className={correct ? 'exam-verdict-pass' : 'exam-verdict-fail'}>
                              {chosen === undefined
                                ? 'Not attempted'
                                : correct
                                  ? `Correct (+${question.marks})`
                                  : `Wrong — correct option is ${String.fromCharCode(97 + right)}`}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="exam-your-answer">
                              <strong>Your answer:</strong>{' '}
                              {entry.written?.trim() ? entry.written : 'Not attempted'}
                            </p>
                            <MarkingSchemeRubric
                              valuePoints={question.answerKey.valuePoints ?? []}
                              totalMarks={question.marks}
                              modelAnswer={question.answerKey.modelAnswer}
                            />
                            <div className="exam-value-points-block">
                              <label className="exam-selfmark">
                                Self-score this answer (0–{question.marks}):
                                <input
                                  type="number"
                                  min={0}
                                  max={question.marks}
                                  value={selfMarks[question.questionNumber] ?? ''}
                                  onChange={(event) =>
                                    setSelfMarks((current) => ({
                                      ...current,
                                      [question.questionNumber]: Math.min(
                                        Math.max(0, Number(event.target.value) || 0),
                                        question.marks,
                                      ),
                                    }))
                                  }
                                />
                              </label>
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </section>
            );
          })}
        </details>

        <style>{`
          .exam-runner-result { max-width: 860px; margin: 0 auto; }
          .exam-save-status { margin-top: 0.5rem; font-size: 0.85rem; color: var(--muted, #666); }
          .exam-save-ok { color: #1e7d32; }
          .exam-save-error { color: #b3261e; }
          .exam-result-card { margin: 1rem 0; padding: 1rem 1.25rem; background: #faf6f0; border-radius: 12px; }
          .exam-result-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
          .exam-result-list li { display: flex; justify-content: space-between; gap: 1rem; padding: 0.4rem 0; border-top: 1px solid var(--border, #eee); }
          .exam-result-actions { margin: 1.5rem 0; }
          .exam-answer-review { margin-top: 2rem; }
          .exam-answer-review > summary { cursor: pointer; font-weight: 600; margin-bottom: 0.75rem; }
          .exam-review-question { margin-bottom: 1.25rem; }
          .exam-option-wrong { color: #b3261e; }
          .exam-verdict-pass { color: #1e7d32; font-weight: 600; }
          .exam-verdict-fail { color: #b3261e; font-weight: 600; }
          .exam-your-answer { background: #fff; border: 1px dashed var(--border, #ccc); border-radius: 8px; padding: 0.6rem 0.75rem; margin: 0.5rem 0; white-space: pre-wrap; }
          .exam-value-points-block { margin-top: 0.5rem; }
          .exam-selfmark { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.9rem; }
          .exam-selfmark input { width: 4rem; padding: 0.35rem 0.5rem; border: 1px solid var(--border, #ddd); border-radius: 6px; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="exam-runner">
      <div className="exam-runner-header">
        <div>
          <p className="eyebrow">ChapterReady · CBSE Class 10</p>
          <h1>{paper.title}</h1>
          <p className="subtext compact">
            {paper.totalMarks} marks · {paper.durationMinutes} minutes ·{' '}
            {answeredCount}/{paper.questions.length} answered
          </p>
        </div>
        <div className="exam-timer" aria-live="polite">
          <span className="exam-timer-label">Time left</span>
          <strong>{formatClock(remainingSeconds)}</strong>
        </div>
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
              {questions.map((question) => {
                const entry = answers[question.questionNumber] ?? {};
                const isMcq = question.questionType === 'mcq';
                return (
                  <li className="exam-question exam-take-question" key={question.questionNumber}>
                    <p className="exam-question-text">
                      <strong>Q{question.questionNumber}.</strong> {question.statement}{' '}
                      <span className="exam-marks">({question.marks} mark
                        {question.marks > 1 ? 's' : ''})</span>
                    </p>
                    {isMcq ? (
                      <ol className="exam-options exam-options-selectable">
                        {(question.answerKey.options ?? []).map((option, index) => (
                          <li key={`${question.questionNumber}-${index}`}>
                            <label className="exam-option-label">
                              <input
                                type="radio"
                                name={`q-${question.questionNumber}`}
                                checked={entry.mcqOption === index}
                                onChange={() => setMcq(question.questionNumber, index)}
                              />
                              {String.fromCharCode(97 + index)}. {option}
                            </label>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <textarea
                        className="exam-answer-textarea"
                        rows={question.marks >= 4 ? 7 : 4}
                        placeholder="Write your answer here… (MCQs are scored automatically; written answers are self-scored against the marking scheme after submission.)"
                        value={entry.written ?? ''}
                        onChange={(event) => setWritten(question.questionNumber, event.target.value)}
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <div className="exam-submit-bar">
        <p className="subtext compact">
          {answeredCount === paper.questions.length
            ? 'All questions answered.'
            : `${paper.questions.length - answeredCount} question(s) not yet answered.`}
        </p>
        <button className="card-link" type="button" onClick={submit}>
          Submit and score
        </button>
      </div>

      <style>{`
        .exam-runner { max-width: 860px; margin: 0 auto; }
        .exam-runner-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
        .exam-timer { text-align: right; background: #fff7e6; border: 1px solid #f0d99a; border-radius: 10px; padding: 0.5rem 0.9rem; }
        .exam-timer-label { display: block; font-size: 0.75rem; color: var(--muted, #666); }
        .exam-timer strong { font-size: 1.3rem; font-variant-numeric: tabular-nums; }
        .exam-options-selectable li { margin: 0.15rem 0; }
        .exam-option-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.25rem 0; }
        .exam-answer-textarea { width: 100%; padding: 0.6rem 0.75rem; border: 1px solid var(--border, #ccc); border-radius: 8px; font: inherit; margin-top: 0.35rem; }
        .exam-take-question { margin-bottom: 1.4rem; }
        .exam-submit-bar { position: sticky; bottom: 1rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: #fff; border: 1px solid var(--border, #ddd); border-radius: 12px; padding: 0.75rem 1.1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.06); }
        .exam-submit-bar .card-link { margin: 0; }
      `}</style>
    </div>
  );
}
