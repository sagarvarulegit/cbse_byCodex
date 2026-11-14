'use client';

import Link from 'next/link';
import { useState } from 'react';

import { trackAnalyticsEvent } from '../lib/analytics';
import { buildChallengeUrl } from '../lib/whatsapp-share';
import WhatsAppChallengeBar from './WhatsAppChallengeBar';

type SamplerSubject = 'maths' | 'science';

type SamplerQuestion = {
  id: string;
  tag: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  examinerNote: string;
};

const SAMPLER_SETS: Record<
  SamplerSubject,
  { label: string; code: string; questions: SamplerQuestion[] }
> = {
  maths: {
    label: '📐 Mathematics Standard (041)',
    code: '041',
    questions: [
      {
        id: 'm1',
        tag: 'Section A · Q1 · Real Numbers (1M)',
        prompt: 'If HCF(306, 657) = 9, then LCM(306, 657) is:',
        options: ['19,710', '22,338', '24,318', '3,069'],
        correctIndex: 1,
        examinerNote:
          'CBSE Step Rule: HCF × LCM = Product of the two numbers → LCM = (306 × 657) / 9 = 34 × 657 = 22,338.',
      },
      {
        id: 'm2',
        tag: 'Section A · Q4 · Polynomials (1M)',
        prompt: 'If one zero of the quadratic polynomial p(x) = x² + 3x + k is 2, then the value of k is:',
        options: ['10', '-10', '5', '-2'],
        correctIndex: 1,
        examinerNote:
          'Since 2 is a zero, p(2) = 0 → (2)² + 3(2) + k = 0 → 4 + 6 + k = 0 → k = -10.',
      },
      {
        id: 'm3',
        tag: 'Section A · Q9 · Trigonometry (1M)',
        prompt: 'If sin A = 3/5 (0° < A < 90°), then the value of tan A is:',
        options: ['4/5', '3/4', '4/3', '5/4'],
        correctIndex: 1,
        examinerNote:
          'Using sin²A + cos²A = 1, cos A = √(1 - 9/25) = 4/5. Therefore tan A = sin A / cos A = 3/4.',
      },
      {
        id: 'm4',
        tag: 'Section A · Q15 · Probability Trap (1M)',
        prompt: 'A fair die is thrown once. What is the probability of getting a prime number?',
        options: ['2/3', '1/2', '1/3', '5/6'],
        correctIndex: 1,
        examinerNote:
          'Board Trap Alert: 1 is neither prime nor composite! Prime outcomes on a die are {2, 3, 5} (3 outcomes out of 6) → 3/6 = 1/2.',
      },
      {
        id: 'm5',
        tag: 'Section A · Q19 · Assertion-Reason (1M)',
        prompt:
          'Assertion (A): The point (0, 4) lies on the y-axis.\nReason (R): The x-coordinate of every point on the y-axis is zero.',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true, but R is false',
          'A is false, but R is true',
        ],
        correctIndex: 0,
        examinerNote:
          'Any point of the form (0, y) has abscissa 0, so (0, 4) lies on the y-axis directly because R holds.',
      },
    ],
  },
  science: {
    label: '🔬 Science (086)',
    code: '086',
    questions: [
      {
        id: 's1',
        tag: 'Section A · Q2 · Chemical Reactions (1M)',
        prompt:
          'When lead nitrate powder is heated strongly in a dry boiling tube, brown fumes are evolved. These brown fumes are of:',
        options: ['Oxygen (O₂)', 'Nitrous oxide (N₂O)', 'Nitrogen dioxide (NO₂)', 'Lead oxide (PbO)'],
        correctIndex: 2,
        examinerNote:
          'NCERT Activity 1.6: Thermal decomposition 2Pb(NO₃)₂ → 2PbO(s) + 4NO₂(g) + O₂(g). NO₂ gas produces the characteristic reddish-brown fumes.',
      },
      {
        id: 's2',
        tag: 'Section A · Q7 · Life Processes (1M)',
        prompt:
          'In human beings, the complete digestion of carbohydrates, proteins, and fats takes place in the:',
        options: ['Stomach', 'Small intestine', 'Large intestine', 'Oesophagus'],
        correctIndex: 1,
        examinerNote:
          'NCERT Section 5.2.4: The small intestine receives bile and pancreatic juice and is the site of complete digestion into glucose, amino acids, and fatty acids/glycerol.',
      },
      {
        id: 's3',
        tag: 'Section A · Q11 · Light Ray Optics (1M)',
        prompt:
          'Where should an object be placed in front of a convex lens to obtain a real, inverted image of the exact same size?',
        options: [
          'At the principal focus F₁',
          'Between F₁ and 2F₁',
          'At twice the focal length (2F₁)',
          'Between optical centre O and F₁',
        ],
        correctIndex: 2,
        examinerNote:
          'NCERT Table 9.4: Placing the object at 2F₁ forms a real, inverted, same-sized image (magnification m = -1) at 2F₂.',
      },
      {
        id: 's4',
        tag: 'Section A · Q14 · Electricity (1M)',
        prompt:
          'Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel. Their equivalent resistance is:',
        options: ['11 Ω', '1 Ω', '2 Ω', '0.5 Ω'],
        correctIndex: 1,
        examinerNote:
          '1/Rₚ = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 → Rₚ = 1 Ω (always smaller than the smallest individual resistor!).',
      },
      {
        id: 's5',
        tag: 'Section A · Q17 · Assertion-Reason (1M)',
        prompt:
          'Assertion (A): Dry HCl gas does not change the colour of dry blue litmus paper.\nReason (R): H⁺ (or H₃O⁺) ions are produced by HCl only in the presence of water.',
        options: [
          'Both A and R are true, and R is the correct explanation of A',
          'Both A and R are true, but R is NOT the correct explanation of A',
          'A is true, but R is false',
          'A is false, but R is true',
        ],
        correctIndex: 0,
        examinerNote:
          'NCERT Activity 2.9: Acidic character requires dissociation into H₃O⁺ ions, which cannot occur without aqueous medium.',
      },
    ],
  },
};

export default function GuestMockSampler() {
  const [subject, setSubject] = useState<SamplerSubject>('maths');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const activeSet = SAMPLER_SETS[subject];
  const questions = activeSet.questions;
  const currentQ = questions[currentIndex];
  const selectedOption = answers[currentQ.id];
  const isAnswered = selectedOption !== undefined;

  const answeredInSubject = questions.filter((q) => answers[q.id] !== undefined).length;
  const scoreInSubject = questions.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0,
  );
  const isCompleted = answeredInSubject === questions.length;

  function handleSwitchSubject(next: SamplerSubject) {
    setSubject(next);
    setCurrentIndex(0);
    trackAnalyticsEvent('guest_mock_sampler_subject', { subject: next });
  }

  function handleSelectOption(optIdx: number) {
    if (isAnswered) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
    trackAnalyticsEvent('guest_mock_sampler_answer', {
      subject,
      question_id: currentQ.id,
      is_correct: optIdx === currentQ.correctIndex,
    });
  }

  function handleResetSubject() {
    setAnswers((prev) => {
      const next = { ...prev };
      for (const q of questions) {
        delete next[q.id];
      }
      return next;
    });
    setCurrentIndex(0);
  }

  const shareUrl = buildChallengeUrl('/exam-papers', {
    beat: `${scoreInSubject}/5`,
  });

  return (
    <section className="guest-mock-sampler" aria-label="Instant Section A CBSE Mock Paper Preview">
      <div className="guest-sampler-header">
        <div>
          <span className="guest-sampler-kicker">⚡ ZERO-SIGNUP CBT PREVIEW · TRY BEFORE YOU REGISTER</span>
          <h2>Test Yourself on 5 Real Section-A Board MCQs (60 Seconds)</h2>
          <p>
            Experience our instant CBSE examiner rationale right here — then unlock all 20 full 3-hour 80-mark papers for free.
          </p>
        </div>

        <div className="guest-sampler-tabs" role="tablist" aria-label="Choose preview subject">
          {(['maths', 'science'] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={subject === key}
              className={`guest-sampler-tab ${subject === key ? 'is-active' : ''}`}
              onClick={() => handleSwitchSubject(key)}
            >
              {SAMPLER_SETS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="guest-sampler-progress-row">
        <span>
          Question <strong>{currentIndex + 1}</strong> of {questions.length} · {currentQ.tag}
        </span>
        <span className="guest-sampler-score-pill">
          Score: {scoreInSubject}/{answeredInSubject || questions.length}
        </span>
      </div>

      <div className="guest-sampler-card">
        <p className="guest-sampler-prompt">{currentQ.prompt}</p>

        <div className="guest-sampler-options">
          {currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            let stateClass = '';
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                stateClass = 'is-correct';
              } else if (idx === selectedOption) {
                stateClass = 'is-wrong';
              }
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={isAnswered}
                className={`guest-sampler-option ${stateClass}`}
                onClick={() => handleSelectOption(idx)}
              >
                <span className="guest-sampler-opt-letter">{letter}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {isAnswered ? (
          <div
            className={`guest-sampler-feedback ${
              selectedOption === currentQ.correctIndex ? 'is-correct' : 'is-wrong'
            }`}
          >
            <strong>
              {selectedOption === currentQ.correctIndex
                ? '✅ +1 Mark! Exact Board Answer'
                : `💡 Good catch before Boards! Correct option: (${String.fromCharCode(65 + currentQ.correctIndex)})`}
            </strong>
            <p>{currentQ.examinerNote}</p>
          </div>
        ) : null}

        <div className="guest-sampler-nav">
          <button
            type="button"
            className="guest-sampler-secondary-btn"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          >
            &larr; Prev
          </button>

          <div className="guest-sampler-dots" aria-hidden="true">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const dotClass =
                idx === currentIndex
                  ? 'is-current'
                  : ans === undefined
                    ? ''
                    : ans === q.correctIndex
                      ? 'is-right'
                      : 'is-missed';
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`guest-sampler-dot ${dotClass}`}
                  onClick={() => setCurrentIndex(idx)}
                  title={`Question ${idx + 1}`}
                />
              );
            })}
          </div>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              className="guest-sampler-primary-btn"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
            >
              Next Question &rarr;
            </button>
          ) : (
            <button
              type="button"
              className="guest-sampler-secondary-btn"
              onClick={handleResetSubject}
            >
              ↻ Retry Set
            </button>
          )}
        </div>
      </div>

      {isCompleted ? (
        <div className="guest-sampler-complete-box">
          <div className="guest-sampler-complete-top">
            <div>
              <strong>
                🎯 Section-A Warm-Up Score: {scoreInSubject}/5 in {activeSet.label}!
              </strong>
              <p>
                Ready for the full 38-question, 80-mark CBSE paper with Sections B, C, D &amp; Case-Study Section E + Printable PDF?
              </p>
            </div>
            <Link href="/register?next=%2Fexam-papers" className="guest-sampler-unlock-cta">
              🚀 Unlock All 20 Full 80M Papers (Free) &rarr;
            </Link>
          </div>

          <WhatsAppChallengeBar
            compact
            surface="exam_papers_guest_sampler"
            headline={`Challenge a friend to beat ${scoreInSubject}/5 on ${activeSet.label}!`}
            shareMessage={`🎯 I just scored ${scoreInSubject}/5 in 60 seconds on the CBSE Class 10 ${activeSet.label} Section-A Warm-Up (plus 20 FREE 80-mark mock papers)! Can you beat me? 👇\n${shareUrl}`}
          />
        </div>
      ) : null}
    </section>
  );
}
