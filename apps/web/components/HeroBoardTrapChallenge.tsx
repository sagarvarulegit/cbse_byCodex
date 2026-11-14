'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MathText from './MathText';
import { buildWhatsAppShareUrl } from '../lib/whatsapp-share';
import { trackAnalyticsEvent } from '../lib/analytics';

type TrapSubject = 'maths' | 'science';

type TrapQuestion = {
  id: string;
  tag: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  trapAlert: string;
  chapterHref: string;
  chapterLabel: string;
};

const TRAP_DECKS: Record<TrapSubject, TrapQuestion[]> = {
  maths: [
    {
      id: 'm-trap-1',
      tag: 'CBSE 2024 Trap · Polynomials',
      prompt:
        'The graph of $y = p(x)$ touches the x-axis at $1$ point and cuts the y-axis at $2$ points. How many zeroes does $p(x)$ have?',
      options: ['3 zeroes', '2 zeroes', '1 zero', '0 zeroes'],
      correctIndex: 2,
      trapAlert:
        'Examiner Trap: Never count y-axis intersections! Zeroes of $p(x)$ equal ONLY distinct x-axis intersection/touch points ($1$).',
      chapterHref: '/chapters/polynomials/quiz',
      chapterLabel: 'Polynomials',
    },
    {
      id: 'm-trap-2',
      tag: '78% Miss This · Arithmetic Progressions',
      prompt:
        'In an AP, if the sum of $n$ terms is $S_n = 3n^2 + 5n$, what does $S_{10} - S_9$ give?',
      options: [
        'Common difference $d = 6$',
        '10th term $a_{10} = 62$',
        '9th term $a_9 = 56$',
        'First term $a_1 = 8$',
      ],
      correctIndex: 1,
      trapAlert:
        'Board Shortcut: $S_n - S_{n-1}$ ALWAYS gives the $n^{\\text{th}}$ term $a_n$ (NOT $d$!). Here $S_{10} - S_9 = 350 - 288 = 62$.',
      chapterHref: '/chapters/arithmetic-progressions/quiz',
      chapterLabel: 'Arithmetic Progressions',
    },
    {
      id: 'm-trap-3',
      tag: 'Sign Trap · Trigonometry',
      prompt:
        'Evaluate $\\sin^2 30^\\circ + \\cos^2 60^\\circ$ carefully:',
      options: ['$1$', '$\\frac{1}{2}$', '$\\frac{3}{4}$', '$\\frac{\\sqrt{3}}{2}$'],
      correctIndex: 1,
      trapAlert:
        'Classic CBSE Trap: $\\sin^2\\theta + \\cos^2\\theta = 1$ ONLY when angles match! Here $(1/2)^2 + (1/2)^2 = 1/4 + 1/4 = 1/2$.',
      chapterHref: '/tools/trig-magic-hexagon',
      chapterLabel: 'Trig Magic Hexagon',
    },
  ],
  science: [
    {
      id: 's-trap-1',
      tag: 'Sign + Unit Trap · Light Optics',
      prompt:
        'What is the power of a concave lens of focal length $50\\text{ cm}$?',
      options: ['$+2.0\\text{ D}$', '$-2.0\\text{ D}$', '$-0.02\\text{ D}$', '$+0.5\\text{ D}$'],
      correctIndex: 1,
      trapAlert:
        'Double Trap: (1) Convert cm to m ($0.5\\text{ m}$), AND (2) Concave lens focal length is ALWAYS negative ($P = 1/(-0.5) = -2.0\\text{ D}$).',
      chapterHref: '/chapters/light-reflection-and-refraction/quiz',
      chapterLabel: 'Light Optics',
    },
    {
      id: 's-trap-2',
      tag: 'CBSE Practical Viva · Electricity',
      prompt:
        'How must an Ammeter and a Voltmeter be connected in a circuit to measure current & potential difference?',
      options: [
        'Both in series',
        'Ammeter in parallel, Voltmeter in series',
        'Ammeter in series, Voltmeter in parallel',
        'Both in parallel',
      ],
      correctIndex: 2,
      trapAlert:
        'NCERT Rule: Ammeter has very low resistance → ALWAYS in SERIES. Voltmeter has high resistance → ALWAYS in PARALLEL.',
      chapterHref: '/virtual-lab',
      chapterLabel: '3D Virtual Lab',
    },
    {
      id: 's-trap-3',
      tag: '1% vs 10% Trap · Our Environment',
      prompt:
        'Green plants capture ___ of sunlight energy falling on leaves, while ___ transfers to the next trophic level.',
      options: ['$10\\%$ and $10\\%$', '$1\\%$ and $10\\%$', '$10\\%$ and $1\\%$', '$1\\%$ and $1\\%$'],
      correctIndex: 1,
      trapAlert:
        'Topper Check: Terrestrial leaves capture $1\\%$ of solar energy; Lindeman’s $10\\%$ Law applies from primary consumers onward!',
      chapterHref: '/chapters/our-environment/quiz',
      chapterLabel: 'Our Environment',
    },
  ],
};

export default function HeroBoardTrapChallenge() {
  const [subject, setSubject] = useState<TrapSubject>('maths');
  const [qIndex, setQIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const deck = TRAP_DECKS[subject];
  const currentQ = deck[qIndex] ?? deck[0];

  function switchSubject(next: TrapSubject) {
    setSubject(next);
    setQIndex(0);
    setSelectedIdx(null);
    setScore(0);
    setCompleted(false);
    trackAnalyticsEvent('hero_trap_subject_switch', { subject: next });
  }

  function handleSelect(optionIndex: number) {
    if (selectedIdx !== null) return;
    setSelectedIdx(optionIndex);
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    trackAnalyticsEvent('hero_trap_answer', {
      subject,
      question_id: currentQ.id,
      is_correct: isCorrect,
    });
  }

  function handleNext() {
    if (qIndex + 1 < deck.length) {
      setQIndex((prev) => prev + 1);
      setSelectedIdx(null);
    } else {
      setCompleted(true);
      trackAnalyticsEvent('hero_trap_complete', {
        subject,
        score,
        total: deck.length,
      });
    }
  }

  function handleReset() {
    setQIndex(0);
    setSelectedIdx(null);
    setScore(0);
    setCompleted(false);
  }

  const shareMessage = `🔥 I scored ${score}/${deck.length} on the 60-Second CBSE Class 10 ${
    subject === 'maths' ? 'Maths' : 'Science'
  } Board Trap Challenge!\nMost Class 10 students fall for Question #1 — see if you can get 3/3 (No login needed):\nhttps://www.chapterready.in/?trap=${subject}`;

  return (
    <div className="hero-trap-card" aria-label="60-Second CBSE Board Trap Challenge">
      {/* Top Bar */}
      <div className="hero-trap-topbar">
        <span className="hero-trap-live-pill">⚡ 60s LIVE BOARD TRAP</span>
        <div className="hero-trap-tabs" role="tablist" aria-label="Choose challenge subject">
          <button
            type="button"
            role="tab"
            aria-selected={subject === 'maths'}
            className={`hero-trap-tab ${subject === 'maths' ? 'active' : ''}`}
            onClick={() => switchSubject('maths')}
          >
            📐 Maths
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={subject === 'science'}
            className={`hero-trap-tab ${subject === 'science' ? 'active' : ''}`}
            onClick={() => switchSubject('science')}
          >
            🔬 Science
          </button>
        </div>
      </div>

      {!completed ? (
        <div className="hero-trap-body">
          <div className="hero-trap-progress-row">
            <span className="hero-trap-qtag">{currentQ.tag}</span>
            <span className="hero-trap-step">
              {qIndex + 1}/{deck.length} · Score {score}
            </span>
          </div>

          <div className="hero-trap-progress-track" aria-hidden="true">
            <span
              style={{
                width: `${((qIndex + (selectedIdx !== null ? 1 : 0.25)) / deck.length) * 100}%`,
              }}
            />
          </div>

          <p className="hero-trap-prompt">
            <MathText text={currentQ.prompt} />
          </p>

          <div className="hero-trap-options">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedIdx === idx;
              const isRight = idx === currentQ.correctIndex;
              const showRight = selectedIdx !== null && isRight;
              const showWrong = selectedIdx !== null && isChosen && !isRight;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={selectedIdx !== null}
                  onClick={() => handleSelect(idx)}
                  className={[
                    'hero-trap-opt',
                    showRight ? 'is-correct' : '',
                    showWrong ? 'is-wrong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span className="hero-trap-opt-letter">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="hero-trap-opt-label">
                    <MathText text={opt} />
                  </span>
                  {showRight && <span className="hero-trap-mark">✓</span>}
                  {showWrong && <span className="hero-trap-mark">✕</span>}
                </button>
              );
            })}
          </div>

          {selectedIdx !== null && (
            <div
              className={`hero-trap-feedback ${
                selectedIdx === currentQ.correctIndex ? 'good' : 'trap'
              }`}
              role="status"
            >
              <strong>
                {selectedIdx === currentQ.correctIndex
                  ? '🎉 Spot on! You dodged the examiner trap!'
                  : '💡 Caught by a classic CBSE trap!'}
              </strong>
              <p>
                <MathText text={currentQ.trapAlert} />
              </p>
              <button type="button" className="hero-trap-next-btn" onClick={handleNext}>
                {qIndex + 1 < deck.length
                  ? `Next Trap Question (${qIndex + 2}/${deck.length}) →`
                  : 'See My Score & Challenge Friends →'}
              </button>
            </div>
          )}

          {selectedIdx === null && (
            <p className="hero-trap-footer-hint">
              👆 Tap an option for instant step-marking check · Zero signup needed
            </p>
          )}
        </div>
      ) : (
        <div className="hero-trap-complete">
          <div className="hero-trap-score-badge">
            <span>🏆</span>
            <strong>
              {score}/{deck.length} Traps Survived!
            </strong>
          </div>
          <p className="hero-trap-complete-copy">
            {score === deck.length
              ? '95%+ Topper instincts! Dare a classmate in your study group to beat 3/3:'
              : 'Every trap you spot now saves 1–2 marks on Feb 15! Dare a friend to beat your score:'}
          </p>

          <a
            href={buildWhatsAppShareUrl(shareMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackAnalyticsEvent('whatsapp_challenge_share', {
                surface: 'hero_board_trap',
                subject,
                score,
              })
            }
            className="hero-trap-wa-btn"
          >
            📲 Challenge Study Group on WhatsApp
          </a>

          <div className="hero-trap-complete-links">
            <Link href="/games/formula-rush" className="hero-trap-link-primary">
              ⚡ Play 60s Formula Rush →
            </Link>
            <button
              type="button"
              onClick={() => switchSubject(subject === 'maths' ? 'science' : 'maths')}
              className="hero-trap-link-secondary"
            >
              Try {subject === 'maths' ? '🔬 Science' : '📐 Maths'} Traps
            </button>
            <button type="button" onClick={handleReset} className="hero-trap-link-ghost">
              Replay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
