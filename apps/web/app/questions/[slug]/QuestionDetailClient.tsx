'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MathText from '../../../components/MathText';
import TaraFireflyIcon from '../../../components/TaraFireflyIcon';
import { useTutorPageContext } from '../../../contexts/TutorPageContext';
import type { SeoQuestionItem } from '../../../lib/seo-questions';

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
    // Dispatch custom event to wake TaraWidget with Socratic guidance prompt
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
    <div className="min-h-screen bg-[#faf7ee] text-[#1e293b] pb-24">
      {/* Top Breadcrumb & Status Navigation */}
      <header className="border-b-2 border-[#1e293b] bg-white sticky top-0 z-30 shadow-[0_2px_0_0_#1e293b]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 overflow-x-auto whitespace-nowrap py-1">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/questions" className="hover:text-black">Questions</Link>
            <span>/</span>
            <span className="text-gray-900 font-extrabold">{question.subjectTitle}</span>
            <span>/</span>
            <Link
              href={`/chapters/${question.chapterSlug}`}
              className="text-gray-700 hover:text-black truncate max-w-[160px] md:max-w-none"
            >
              {question.chapterTitle}
            </Link>
            <span>/</span>
            <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
              {question.displayType}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={copyShareLink}
              type="button"
              className="text-xs font-bold px-3 py-1.5 border-2 border-black bg-white rounded shadow-[2px_2px_0_0_#000] hover:bg-gray-100 transition active:translate-x-0.5 active:translate-y-0.5"
              title="Share question link"
            >
              {isCopied ? '✓ Copied' : '🔗 Share'}
            </button>
            <Link
              href="/exam-papers"
              className="hidden sm:inline-block text-xs font-bold px-3 py-1.5 border-2 border-black bg-amber-200 rounded shadow-[2px_2px_0_0_#000] hover:bg-amber-300 transition"
            >
              Free 80M Papers
            </Link>
          </div>
        </div>
      </header>

      {/* Main Question Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">

            {/* Question Card */}
            <article className="border-3 border-black bg-white rounded-xl p-6 sm:p-8 shadow-[5px_5px_0_0_#000]">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded border-2 border-black bg-blue-100 text-blue-900">
                  {question.subjectTitle}
                </span>
                <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded border-2 border-black bg-yellow-100 text-yellow-900">
                  {question.marks} Mark{question.marks > 1 ? 's' : ''}
                </span>
                <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded border-2 border-black bg-emerald-100 text-emerald-900">
                  {question.difficulty}
                </span>
                {question.frequencyBadge && (
                  <span className="px-2.5 py-1 text-xs font-black uppercase tracking-wider rounded border-2 border-black bg-purple-100 text-purple-900 animate-pulse">
                    🔥 {question.frequencyBadge}
                  </span>
                )}
                <span className="ml-auto text-xs text-gray-500 font-semibold text-right">
                  {question.officialRef}
                </span>
              </div>

              {/* Title Header */}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-4">
                {question.title}
              </h1>

              {/* Question Statement */}
              <div className="p-4 sm:p-5 rounded-lg border-2 border-slate-300 bg-[#fdfcfa] text-base sm:text-lg leading-relaxed text-gray-900 font-medium whitespace-pre-line mb-6">
                <MathText text={question.prompt} />
              </div>

              {/* MCQ Options (if MCQ) */}
              {isMcq && question.options && (
                <div className="space-y-3 mb-6">
                  <div className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Select Your Answer:
                  </div>
                  {question.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = question.correctOptionIndex === idx;
                    let optionStyle = 'border-2 border-black bg-white hover:bg-slate-50';
                    if (showExplanation) {
                      if (isCorrect) {
                        optionStyle = 'border-2 border-emerald-600 bg-emerald-100 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'border-2 border-rose-600 bg-rose-100';
                      }
                    } else if (isSelected) {
                      optionStyle = 'border-2 border-black bg-yellow-200 font-bold';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedOption(idx);
                          setShowExplanation(true);
                        }}
                        className={`w-full text-left p-3.5 rounded-lg flex items-start gap-3 transition shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 ${optionStyle}`}
                      >
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-black bg-white text-xs font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div className="pt-0.5 text-sm sm:text-base leading-snug">
                          <MathText text={opt.label} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Socratic Hint Trigger Banner (#d9f99d lime green) */}
              <div className="mb-6 p-4 rounded-xl border-3 border-black bg-[#d9f99d] shadow-[4px_4px_0_0_#000]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-black text-white shrink-0">
                      <TaraFireflyIcon size={24} glow />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></span>
                        <span className="text-xs font-black tracking-wide uppercase text-emerald-950">
                          Tara Socratic AI Active
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">
                        Stuck on the first step? Don’t look at the answer yet.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={triggerTaraSocraticHint}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border-2 border-black bg-white hover:bg-black hover:text-white font-black text-sm transition shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    💡 Ask Tara for a Socratic Hint
                  </button>
                </div>

                {/* Instant Inline Socratic Card */}
                {showInlineHint && (
                  <div className="mt-4 pt-4 border-t-2 border-dashed border-emerald-800/40 text-slate-900 space-y-2">
                    <div className="bg-white/90 p-3 rounded-lg border border-black/30">
                      <div className="text-xs font-black uppercase text-emerald-900 mb-1">
                        🧠 Guiding Question:
                      </div>
                      <p className="text-sm font-semibold italic text-slate-800">
                        {question.socraticHint.hintQuestion}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/80 p-2.5 rounded border border-black/20">
                        <span className="font-extrabold text-slate-900">Key Concept: </span>
                        <span>{question.socraticHint.guidingConcept}</span>
                      </div>
                      <div className="bg-white/80 p-2.5 rounded border border-black/20">
                        <span className="font-extrabold text-slate-900">First Step Clue: </span>
                        <span>{question.socraticHint.firstStepNudge}</span>
                      </div>
                    </div>

                    {question.socraticHint.formulaOrKeywordTip && (
                      <div className="bg-emerald-900 text-white p-2.5 rounded text-xs font-medium flex items-center gap-2">
                        <span>⚡</span>
                        <span>{question.socraticHint.formulaOrKeywordTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Written Practice Callout */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg border-2 border-black bg-slate-50 mb-6">
                <div>
                  <div className="text-xs font-bold text-gray-600">Want step-by-step scoring?</div>
                  <div className="text-sm font-extrabold text-gray-900">Practice writing your answer in exam format</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPracticeDrawer((prev) => !prev)}
                  className="px-4 py-2 border-2 border-black bg-white hover:bg-slate-100 rounded-lg text-xs font-black shadow-[2px_2px_0_0_#000] transition"
                >
                  {showPracticeDrawer ? '▲ Hide Scratchpad' : '✍️ Write & Test My Answer'}
                </button>
              </div>

              {/* Practice Scratchpad Drawer */}
              {showPracticeDrawer && (
                <div className="mb-6 p-4 rounded-xl border-2 border-black bg-amber-50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase text-amber-950">
                    <span>Student Written Scratchpad</span>
                    <span>Max {question.marks} Mark{question.marks > 1 ? 's' : ''}</span>
                  </div>
                  <textarea
                    rows={4}
                    value={studentAnswerText}
                    onChange={(e) => setStudentAnswerText(e.target.value)}
                    placeholder="Type your step-by-step points, formulas, or final values here..."
                    className="w-full p-3 rounded-lg border-2 border-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
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
                      className="px-3 py-1.5 border-2 border-black bg-black text-white hover:bg-gray-800 rounded text-xs font-bold"
                    >
                      🤖 Snap & Grade via Tara
                    </button>
                  </div>
                </div>
              )}

              {/* Official CBSE Step-Marking Scheme & Rubric */}
              <section className="pt-6 border-t-2 border-black space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-xs font-black">
                      CBSE OFFICIAL
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-gray-900">
                      Step-Marking Scheme & Value Points
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Total: {question.marks}m
                  </span>
                </div>

                {/* Step Breakdown Cards */}
                <div className="space-y-2.5">
                  {question.valuePoints.map((point, pIdx) => {
                    const match = point.match(/^\[\+?([0-9.]+\s*Marks?)\]\s*(.*)$/i);
                    const markTag = match ? match[1] : null;
                    const pointText = match ? match[2] : point;

                    return (
                      <div
                        key={pIdx}
                        className="p-3.5 rounded-lg border-2 border-black bg-[#fdfefe] flex items-start gap-3 shadow-[2px_2px_0_0_#e2e8f0]"
                      >
                        <span className="px-2 py-1 rounded border border-emerald-700 bg-emerald-50 text-emerald-900 text-xs font-black shrink-0">
                          {markTag ? `+${markTag}` : `Step ${pIdx + 1}`}
                        </span>
                        <div className="text-sm text-gray-800 font-medium leading-relaxed pt-0.5">
                          <MathText text={pointText} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Full Model Answer */}
                <div className="p-4 rounded-lg border-2 border-black bg-amber-50/70 space-y-2 mt-4">
                  <div className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    Full Ideal Model Answer:
                  </div>
                  <div className="text-sm text-gray-900 leading-relaxed font-normal whitespace-pre-line">
                    <MathText text={question.modelAnswer} />
                  </div>
                </div>

                {/* Internal Choice Alternative Option if present */}
                {question.orAnswer && (
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-400 bg-gray-50 space-y-2 mt-4">
                    <div className="text-xs font-black uppercase text-gray-700 tracking-wider">
                      OR (Alternative Choice Marking Scheme):
                    </div>
                    <div className="text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                      <MathText text={question.orAnswer} />
                    </div>
                  </div>
                )}

                {/* Official Examiner Deduction Notes */}
                {question.examinerNotes && question.examinerNotes.length > 0 && (
                  <div className="p-4 rounded-lg border-2 border-rose-500 bg-rose-50/70 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-900 tracking-wider">
                      <span>⚠️</span>
                      <span>Official Examiner Deduction Notes:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-rose-950 font-medium">
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

            {/* Quick Curriculum Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href={`/chapters/${question.chapterSlug}/revision`}
                className="p-3.5 rounded-xl border-2 border-black bg-white hover:bg-slate-50 transition shadow-[3px_3px_0_0_#000] text-center"
              >
                <div className="text-base font-black">📖 Fast Revision</div>
                <div className="text-xs text-gray-600">Formulas & NCERT bullet points</div>
              </Link>
              <Link
                href={`/chapters/${question.chapterSlug}/quiz`}
                className="p-3.5 rounded-xl border-2 border-black bg-white hover:bg-slate-50 transition shadow-[3px_3px_0_0_#000] text-center"
              >
                <div className="text-base font-black">⚡ Chapter Quiz</div>
                <div className="text-xs text-gray-600">Timed 1-Mark MCQ Sprint</div>
              </Link>
              <Link
                href="/exam-papers"
                className="p-3.5 rounded-xl border-2 border-black bg-amber-200 hover:bg-amber-300 transition shadow-[3px_3px_0_0_#000] text-center"
              >
                <div className="text-base font-black">📄 Full 80M Paper</div>
                <div className="text-xs text-gray-800">100% Free 2026 Mock Papers</div>
              </Link>
            </div>
          </div>

          {/* Sidebar Column: Related & Chapter Questions */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Socratic Tara Sticky Widget Card */}
            <div className="border-3 border-black bg-[#d9f99d] rounded-xl p-5 shadow-[4px_4px_0_0_#000]">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2 rounded-lg bg-black text-white shrink-0">
                  <TaraFireflyIcon size={28} glow />
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    Tara AI Study Buddy
                  </h3>
                  <p className="text-xs text-slate-700">NCERT & CBSE Verified</p>
                </div>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed mb-4">
                Have a doubt on this exact step? Tara explains step-by-step logic, points out examiner deduction traps, and guides you to 100% marks.
              </p>
              <button
                type="button"
                onClick={triggerTaraSocraticHint}
                className="w-full py-2.5 rounded-lg border-2 border-black bg-black text-white hover:bg-slate-800 text-xs font-black shadow-[2px_2px_0_0_#fff] transition"
              >
                Ask Tara About This Question →
              </button>
            </div>

            {/* Related Questions in Chapter */}
            <div className="border-3 border-black bg-white rounded-xl p-5 shadow-[4px_4px_0_0_#000] space-y-4">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                  More in {question.chapterTitle}
                </h3>
                <span className="text-xs font-bold text-gray-500">
                  {related.length} Questions
                </span>
              </div>

              {related.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No sibling questions found.</p>
              ) : (
                <div className="space-y-3">
                  {related.map((rq) => (
                    <Link
                      key={rq.slug}
                      href={`/questions/${rq.slug}`}
                      className="block p-3 rounded-lg border-2 border-slate-200 hover:border-black hover:bg-amber-50/50 transition"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-300">
                          {rq.marks}M · {rq.displayType}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold truncate">
                          {rq.sourceType === 'ncert_exemplar' ? 'Exemplar' : 'Board PYQ'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">
                        {rq.title}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/questions?subject=${question.subjectSlug}`}
                className="block text-center text-xs font-black text-orange-700 hover:text-orange-800 pt-2 border-t border-slate-200"
              >
                View all {question.subjectTitle} Questions →
              </Link>
            </div>

            {/* Free Exam Mock Test Paper Promotion */}
            <div className="border-3 border-black bg-amber-100 rounded-xl p-5 shadow-[4px_4px_0_0_#000]">
              <div className="text-xs font-black uppercase text-amber-900 tracking-wider mb-1">
                Forensic Exam Papers
              </div>
              <h4 className="text-sm font-black text-gray-900 leading-tight mb-2">
                5 Full 80-Mark Mock Test Papers (100% Free)
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Experience full 3-hour exam simulations with CBSE value points, step marking, and dynamic watermarked answer keys.
              </p>
              <Link
                href="/exam-papers"
                className="inline-block text-xs font-black px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white rounded shadow-[2px_2px_0_0_#000] transition"
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
