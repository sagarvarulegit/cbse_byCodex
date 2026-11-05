'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MathText from '../../../components/MathText';
import TaraFireflyIcon from '../../../components/TaraFireflyIcon';
import { useTutorPageContext } from '../../../contexts/TutorPageContext';
import type { SeoQuestionItem } from '../../../lib/seo-questions';
import '../questions.css';

interface Props {
  question: SeoQuestionItem;
  related: SeoQuestionItem[];
}

export default function QuestionDetailClient({ question, related }: Props) {
  const { setPageContext } = useTutorPageContext();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showInlineHint, setShowInlineHint] = useState(false);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [showPracticeDrawer, setShowPracticeDrawer] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setPageContext({
      pageType: 'question',
      pageUrl: `/questions/${question.slug}`,
      pageTitle: question.title,
      subject: question.subjectTitle,
      chapterSlug: question.chapterSlug,
      chapterTitle: question.chapterTitle,
      activeItem: {
        id: question.id,
        label: question.officialRef,
        title: question.title,
        prompt: question.prompt,
        explanation: question.modelAnswer,
      },
    });
  }, [question, setPageContext]);

  const triggerTaraSocraticHint = () => {
    setShowInlineHint(true);
    const socraticPrompt = `Hi Tara, can you guide me through this question with a Socratic hint without revealing the final answer right away?\n\nQuestion: "${question.prompt}"\nConcept: ${question.chapterTitle} (${question.officialRef})`;
    window.dispatchEvent(
      new CustomEvent('tara:open-with-prompt', {
        detail: { prompt: socraticPrompt },
      }),
    );
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      void navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const isMcq = question.questionType === 'mcq' && Boolean(question.options?.length);

  return (
    <div className="qd-root">
      {/* Top Header / Breadcrumbs */}
      <header className="qd-topbar">
        <div className="qd-topbar-inner">
          <nav className="qd-breadcrumb" aria-label="Question breadcrumbs">
            <Link href="/">Home</Link>
            <span className="qd-breadcrumb-sep">/</span>
            <Link href="/questions">Questions</Link>
            <span className="qd-breadcrumb-sep">/</span>
            <span>{question.subjectTitle}</span>
            <span className="qd-breadcrumb-sep">/</span>
            <Link href={`/chapters/${question.chapterSlug}`}>
              {question.chapterTitle}
            </Link>
            <span className="qd-breadcrumb-sep">/</span>
            <span className="qd-breadcrumb-current">{question.displayType}</span>
          </nav>

          <div className="qd-topbar-actions">
            <button
              onClick={copyShareLink}
              type="button"
              className="qd-btn-neutral"
              title="Copy share link"
            >
              {isCopied ? '✓ Copied' : '🔗 Share'}
            </button>
            <Link
              href="/exam-papers"
              className="qd-btn-neutral"
              style={{ background: '#fef08a' }}
            >
              Free 80M Papers
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="qd-container">
        <div className="qd-grid">
          
          {/* Main Question Column */}
          <div>
            <article className="qd-card">
              {/* Badges Strip */}
              <div className="qd-badges-row">
                <span className="qd-badge qd-badge-subject">
                  {question.subjectTitle}
                </span>
                <span className="qd-badge qd-badge-marks">
                  {question.marks} Mark{question.marks > 1 ? 's' : ''}
                </span>
                <span className="qd-badge qd-badge-difficulty">
                  {question.difficulty}
                </span>
                {question.frequencyBadge && (
                  <span className="qd-badge qd-badge-freq">
                    🔥 {question.frequencyBadge}
                  </span>
                )}
                <span className="qd-ref-tag">
                  {question.officialRef}
                </span>
              </div>

              {/* Title Header */}
              <h1 className="qd-title">
                {question.title}
              </h1>

              {/* Question Statement */}
              <div className="qd-prompt-box">
                <MathText text={question.prompt} />
              </div>

              {/* MCQ Options (if MCQ) */}
              {isMcq && question.options && (
                <div className="qd-options-section">
                  <div className="qd-options-label">
                    Select Your Answer:
                  </div>
                  <div className="qd-options-list">
                    {question.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = question.correctOptionIndex === idx;
                      let optionClass = 'qd-option-btn';
                      if (showExplanation) {
                        if (isCorrect) optionClass += ' correct';
                        else if (isSelected) optionClass += ' incorrect';
                      } else if (isSelected) {
                        optionClass += ' selected';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedOption(idx);
                            setShowExplanation(true);
                          }}
                          className={optionClass}
                        >
                          <span className="qd-option-badge">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <div style={{ paddingTop: '2px', lineHeight: 1.5 }}>
                            <MathText text={opt.label} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Socratic Hint Trigger Banner (#d9f99d lime green) */}
              <div className="qd-socratic-banner">
                <div className="qd-socratic-header">
                  <div className="qd-socratic-left">
                    <span className="qd-firefly-box">
                      <TaraFireflyIcon size={24} glow />
                    </span>
                    <div>
                      <div className="qd-socratic-title">
                        <span className="qd-socratic-dot"></span>
                        <span>Tara Socratic AI Active</span>
                      </div>
                      <p className="qd-socratic-tagline">
                        Stuck on the first step? Don’t look at the answer yet.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerTaraSocraticHint}
                    className="qd-socratic-action-btn"
                  >
                    💡 Ask Tara for a Socratic Hint
                  </button>
                </div>

                {/* Instant Inline Socratic Card */}
                {showInlineHint && (
                  <div className="qd-socratic-drawer">
                    <div className="qd-socratic-card-white">
                      <div className="qd-socratic-q-label">
                        🧠 Guiding Question:
                      </div>
                      <p className="qd-socratic-q-text">
                        {question.socraticHint.hintQuestion}
                      </p>
                    </div>

                    <div className="qd-socratic-grid">
                      <div className="qd-socratic-pill-box">
                        <strong>Key Concept: </strong>
                        <span>{question.socraticHint.guidingConcept}</span>
                      </div>
                      <div className="qd-socratic-pill-box">
                        <strong>First Step Clue: </strong>
                        <span>{question.socraticHint.firstStepNudge}</span>
                      </div>
                    </div>

                    {question.socraticHint.formulaOrKeywordTip && (
                      <div className="qd-socratic-tip-banner">
                        <span>⚡ {question.socraticHint.formulaOrKeywordTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Written Practice Callout Strip */}
              <div className="qd-scratchpad-strip">
                <div>
                  <div className="qd-scratchpad-title">Want step-by-step scoring?</div>
                  <div className="qd-scratchpad-sub">Practice writing your answer in exam format</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPracticeDrawer((prev) => !prev)}
                  className="qd-btn-neutral"
                >
                  {showPracticeDrawer ? '▲ Hide Scratchpad' : '✍️ Write & Test My Answer'}
                </button>
              </div>

              {/* Practice Scratchpad Drawer */}
              {showPracticeDrawer && (
                <div className="qd-scratchpad-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                    <span>Student Written Scratchpad</span>
                    <span>Max {question.marks} Mark{question.marks > 1 ? 's' : ''}</span>
                  </div>
                  <textarea
                    rows={4}
                    value={studentAnswerText}
                    onChange={(e) => setStudentAnswerText(e.target.value)}
                    placeholder="Type your step-by-step points, formulas, or final values here..."
                    className="qd-scratchpad-textarea"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                      Compare your drafted points with the official CBSE step markings below!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!studentAnswerText.trim()) return;
                        const reviewPrompt = `Can you grade my written answer against the official CBSE step-marking scheme?\n\nQuestion: "${question.prompt}"\n\nMy Written Answer:\n"${studentAnswerText}"\n\nOfficial Value Points:\n${question.valuePoints.join('\n')}`;
                        window.dispatchEvent(
                          new CustomEvent('tara:open-with-prompt', {
                            detail: { prompt: reviewPrompt },
                          }),
                        );
                      }}
                      className="qd-btn-neutral"
                      style={{ background: '#181612', color: '#ffffff' }}
                    >
                      🤖 Snap &amp; Grade via Tara
                    </button>
                  </div>
                </div>
              )}

              {/* Official CBSE Step-Marking Scheme & Rubric */}
              <section className="qd-rubric-section">
                <div className="qd-rubric-header">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="qd-rubric-tag">CBSE OFFICIAL</span>
                    <h2 className="qd-rubric-title">
                      Step-Marking Scheme &amp; Value Points
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>
                    Total: {question.marks}m
                  </span>
                </div>

                {/* Step Breakdown Cards */}
                <div className="qd-steps-list">
                  {question.valuePoints.map((point, pIdx) => {
                    const match = point.match(/^\[\+?([0-9.]+\s*Marks?)\]\s*(.*)$/i);
                    const markTag = match ? match[1] : null;
                    const pointText = match ? match[2] : point;

                    return (
                      <div key={pIdx} className="qd-step-item">
                        <span className="qd-step-mark">
                          {markTag ? `+${markTag}` : `Step ${pIdx + 1}`}
                        </span>
                        <div className="qd-step-content">
                          <MathText text={pointText} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full Model Answer */}
                <div className="qd-model-answer-box">
                  <div className="qd-box-label">Full Ideal Model Answer:</div>
                  <div className="qd-box-content">
                    <MathText text={question.modelAnswer} />
                  </div>
                </div>

                {/* Alternative choice if present */}
                {question.orAnswer && (
                  <div className="qd-model-answer-box" style={{ background: '#f8fafc', borderColor: '#cbd5e1', borderStyle: 'dashed' }}>
                    <div className="qd-box-label" style={{ color: '#475569' }}>
                      OR (Alternative Choice Marking Scheme):
                    </div>
                    <div className="qd-box-content">
                      <MathText text={question.orAnswer} />
                    </div>
                  </div>
                )}

                {/* Official Examiner Deduction Notes */}
                {question.examinerNotes && question.examinerNotes.length > 0 && (
                  <div className="qd-examiner-box">
                    <div className="qd-examiner-label">
                      <span>⚠️</span>
                      <span>Official Examiner Deduction Notes:</span>
                    </div>
                    <ul className="qd-examiner-list">
                      {question.examinerNotes.map((note, nIdx) => (
                        <li key={nIdx}>
                          <MathText text={note} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            </article>

            {/* Quick 3-Card Navigation Strip */}
            <div className="qd-quick-nav-grid">
              <Link href={`/chapters/${question.chapterSlug}/revision`} className="qd-quick-card">
                <div className="qd-quick-card-title">📖 Fast Revision</div>
                <div className="qd-quick-card-sub">Formulas &amp; NCERT bullet points</div>
              </Link>
              <Link href={`/chapters/${question.chapterSlug}/quiz`} className="qd-quick-card">
                <div className="qd-quick-card-title">⚡ Chapter Quiz</div>
                <div className="qd-quick-card-sub">Timed 1-Mark MCQ Sprint</div>
              </Link>
              <Link href="/exam-papers" className="qd-quick-card qd-quick-card-amber">
                <div className="qd-quick-card-title">📄 Full 80M Paper</div>
                <div className="qd-quick-card-sub">100% Free 2026 Mock Papers</div>
              </Link>
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="qd-sidebar">
            
            {/* Sticky Tara AI Card */}
            <div className="qd-sidebar-card qd-sidebar-tara">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span className="qd-firefly-box">
                  <TaraFireflyIcon size={28} glow />
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>
                    Tara AI Study Buddy
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
                    NCERT &amp; CBSE Verified
                  </span>
                </div>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.55 }}>
                Have a doubt on this exact step? Tara explains step-by-step logic, points out examiner deduction traps, and guides you to 100% marks.
              </p>
              <button
                type="button"
                onClick={triggerTaraSocraticHint}
                className="qd-sidebar-btn-black"
              >
                Ask Tara About This Question →
              </button>
            </div>

            {/* Related Questions Card */}
            <div className="qd-sidebar-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid var(--qd-border-dark)', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase' }}>
                  More in {question.chapterTitle}
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                  {related.length} Qs
                </span>
              </div>

              {related.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic', margin: '1rem 0' }}>No sibling questions.</p>
              ) : (
                <div className="qd-related-list">
                  {related.map((rq) => (
                    <Link key={rq.slug} href={`/questions/${rq.slug}`} className="qd-related-item">
                      <div className="qd-related-item-top">
                        <span style={{ background: '#e2e8f0', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                          {rq.marks}M · {rq.displayType}
                        </span>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>
                          {rq.sourceType === 'ncert_exemplar' ? 'Exemplar' : 'Board PYQ'}
                        </span>
                      </div>
                      <div className="qd-related-item-title">
                        {rq.title}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/questions?subject=${question.subjectSlug}`}
                style={{ display: 'block', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--qd-orange)', textDecoration: 'none', paddingTop: '0.5rem', borderTop: '1px solid var(--qd-border)' }}
              >
                View all {question.subjectTitle} Questions →
              </Link>
            </div>

            {/* Free Mock Papers Promo Card */}
            <div className="qd-sidebar-card" style={{ background: '#fef3c7', borderColor: '#f59e0b' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', color: '#92400e', marginBottom: '0.25rem' }}>
                Forensic Exam Papers
              </div>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 900, color: '#181612' }}>
                5 Full 80-Mark Mock Test Papers (100% Free)
              </h4>
              <p style={{ margin: '0 0 0.85rem', fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5 }}>
                Experience full 3-hour exam simulations with CBSE value points, step marking, and dynamic watermarked answer keys.
              </p>
              <Link
                href="/exam-papers"
                className="qd-btn-neutral"
                style={{ display: 'inline-block', textDecoration: 'none' }}
              >
                Open Free Exam Papers →
              </Link>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}
