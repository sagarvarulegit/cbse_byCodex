'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { NextStep } from '../lib/dashboard-home';
import styles from './dashboard-home.module.css';

const STARTERS = {
  science: {
    id: 'science',
    label: '🧪 Science',
    subjectCode: '086',
    title: 'Science · Chapter 1',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    notesHref: '/chapters/chemical-reactions-and-equations',
    quizHref: '/chapters/chemical-reactions-and-equations/quiz',
    conceptHighlight: 'Balancing, Redox & Precipitation',
    timeEst: '3 min quiz',
    xp: '+50 XP',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    summary:
      'Master chemical equations, balancing, oxidation-reduction, and displacement reactions with simplified NCERT breakdowns.',
  },
  maths: {
    id: 'maths',
    label: '📐 Maths',
    subjectCode: '041',
    title: 'Mathematics Standard · Chapter 1',
    chapter: 'Real Numbers',
    chapterSlug: 'real-numbers',
    notesHref: '/chapters/real-numbers',
    quizHref: '/chapters/real-numbers/quiz',
    conceptHighlight: 'Fundamental Theorem of Arithmetic',
    timeEst: '3 min quiz',
    xp: '+50 XP',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    summary:
      'Learn prime factorisation, HCF × LCM formulas, and step-by-step proofs for irrational numbers (√2, √3, √5).',
  },
  sst: {
    id: 'sst',
    label: '🌍 Social Science',
    subjectCode: '087',
    title: 'Social Science · History Chapter 1',
    chapter: 'The Rise of Nationalism in Europe',
    chapterSlug: 'rise-of-nationalism-in-europe',
    notesHref: '/chapters/rise-of-nationalism-in-europe',
    quizHref: '/chapters/rise-of-nationalism-in-europe/quiz',
    conceptHighlight: 'French Revolution & Unification',
    timeEst: '4 min quiz',
    xp: '+50 XP',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    summary:
      'Understand the French Revolution, Civil Code of 1804, Mazzini, and German & Italian unification in memorable story points.',
  },
  english: {
    id: 'english',
    label: '📚 English',
    subjectCode: '184',
    title: 'English · First Flight Chapter 1',
    chapter: 'A Letter to God',
    chapterSlug: 'a-letter-to-god',
    notesHref: '/chapters/a-letter-to-god',
    quizHref: '/chapters/a-letter-to-god/quiz',
    conceptHighlight: 'Lencho & Irony of Faith',
    timeEst: '3 min quiz',
    xp: '+50 XP',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    summary:
      'Explore Lencho’s steadfast faith, the hailstorm destruction, and the bittersweet irony of the postal workers.',
  },
} as const;

type StarterKey = keyof typeof STARTERS;

function openTara(prompt?: string) {
  const taraBubble = document.querySelector('[aria-label*="Tara"]') as HTMLElement | null;
  if (!taraBubble) return;
  const isExpanded = taraBubble.getAttribute('aria-expanded') === 'true';
  if (!isExpanded) {
    taraBubble.click();
  }
  if (prompt) {
    setTimeout(() => {
      const input = document.querySelector('.tara-input') as HTMLTextAreaElement | HTMLInputElement | null;
      if (input) {
        input.value = prompt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
      }
    }, 150);
  }
}

export default function DashboardNextStepHero({ step }: { step: NextStep }) {
  const [selectedStarter, setSelectedStarter] = useState<StarterKey>('science');

  // 1. Day-1 Starter State
  if (step.kind === 'start') {
    const current = STARTERS[selectedStarter];
    return (
      <section className={styles.heroCard} aria-label="Today's Recommended Mission">
        {/* Top bar with tabs */}
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadgeRow}>
            <span
              className={styles.heroSubjectBadge}
              style={{ color: current.badgeColor, backgroundColor: current.badgeBg }}
            >
              {current.label} · Code {current.subjectCode}
            </span>
            <span className={styles.heroXpPill}>{current.xp}</span>
            <span className={styles.heroTimePill}>⏱️ {current.timeEst}</span>
          </div>

          {/* Subject Switcher Tabs */}
          <div className={styles.subjectSwitcher} role="tablist" aria-label="Select subject starter">
            {(Object.keys(STARTERS) as StarterKey[]).map((key) => {
              const item = STARTERS[key];
              const isActive = selectedStarter === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.switcherTab} ${isActive ? styles.switcherTabActive : ''}`}
                  onClick={() => setSelectedStarter(key)}
                >
                  {item.label.split(' ')[0]} {item.label.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Info */}
        <div className={styles.heroBody}>
          <div className={styles.heroMainInfo}>
            <p className={styles.heroEyebrow}>Recommended First Mission</p>
            <h2 className={styles.heroTitle}>{current.chapter}</h2>
            <p className={styles.heroSummary}>{current.summary}</p>

            {/* 3-Step Visual Mastery Blueprint */}
            <div className={styles.masteryRoadmap}>
              <div className={`${styles.roadmapStep} ${styles.roadmapStepActive}`}>
                <div className={styles.roadmapNumber}>1</div>
                <div className={styles.roadmapContent}>
                  <strong>Read Notes</strong>
                  <span>~12 min · NCERT core</span>
                </div>
              </div>
              <div className={styles.roadmapDivider}>→</div>
              <div className={styles.roadmapStep}>
                <div className={styles.roadmapNumber}>2</div>
                <div className={styles.roadmapContent}>
                  <strong>Key Diagrams</strong>
                  <span>~8 min · Lab visual</span>
                </div>
              </div>
              <div className={styles.roadmapDivider}>→</div>
              <div className={`${styles.roadmapStep} ${styles.roadmapStepGoal}`}>
                <div className={styles.roadmapNumber}>3</div>
                <div className={styles.roadmapContent}>
                  <strong>Recall Quiz</strong>
                  <span>~5 min · Board PYQ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Column */}
          <div className={styles.heroActionGroup}>
            <Link className={styles.heroCtaPrimary} href={current.quizHref}>
              ▶ Start 3-Min Quiz ({current.xp}) →
            </Link>
            <div className={styles.heroSecondaryRow}>
              <Link className={styles.heroCtaSecondary} href={current.notesHref}>
                📖 Read Chapter Notes
              </Link>
              <button
                type="button"
                className={styles.heroAskTaraBtn}
                onClick={() =>
                  openTara(`Can you explain the key concepts of Class 10 ${current.chapter}?`)
                }
                title="Ask Tara AI about this chapter"
              >
                ✨ Ask Tara
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. Revise State (Targeted recovery from low quiz score or mock mistakes)
  if (step.kind === 'revise') {
    return (
      <section className={`${styles.heroCard} ${styles.heroCardRevise}`} aria-label="Targeted Revision">
        <div className={styles.heroTopRow}>
          <div className={styles.heroBadgeRow}>
            <span className={styles.heroSubjectBadgeRevise}>
              🚨 Targeted Revision · {step.subjectName}
            </span>
            <span className={styles.heroXpPill}>+60 XP Recovery</span>
          </div>
        </div>

        <div className={styles.heroBody}>
          <div className={styles.heroMainInfo}>
            <p className={styles.heroEyebrow}>Focus Area</p>
            <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>
            <p className={styles.heroSummary}>
              <strong>Trigger:</strong> {step.reason}. Revise key concepts and retake the quiz to secure board marks.
            </p>

            {/* 3-Step Recovery Roadmap */}
            <div className={styles.masteryRoadmap}>
              <div className={`${styles.roadmapStep} ${styles.roadmapStepActive}`}>
                <div className={styles.roadmapNumber}>1</div>
                <div className={styles.roadmapContent}>
                  <strong>Review Notes</strong>
                  <span>Fix misconceptions</span>
                </div>
              </div>
              <div className={styles.roadmapDivider}>→</div>
              <div className={styles.roadmapStep}>
                <div className={styles.roadmapNumber}>2</div>
                <div className={styles.roadmapContent}>
                  <strong>Exemplar Tips</strong>
                  <span>Board marking rules</span>
                </div>
              </div>
              <div className={styles.roadmapDivider}>→</div>
              <div className={`${styles.roadmapStep} ${styles.roadmapStepGoal}`}>
                <div className={styles.roadmapNumber}>3</div>
                <div className={styles.roadmapContent}>
                  <strong>Retake Quiz</strong>
                  <span>Score 80%+ to master</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.heroActionGroup}>
            <Link className={styles.heroCtaPrimary} href={step.href}>
              ▶ Start Revision Mission →
            </Link>
            <div className={styles.heroSecondaryRow}>
              <Link className={styles.heroCtaSecondary} href={`/chapters/${step.chapterSlug}`}>
                📖 Open Notes
              </Link>
              <Link className={styles.heroQuietLink} href="/my-mistakes">
                View All Mistakes →
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. Continue State (Chapter in progress)
  return (
    <section className={styles.heroCard} aria-label="Continue Chapter">
      <div className={styles.heroTopRow}>
        <div className={styles.heroBadgeRow}>
          <span className={styles.heroSubjectBadge}>
            ⚡ Continue Where You Left Off · {step.subjectName}
          </span>
          <span className={styles.heroXpPill}>+40 XP</span>
        </div>
      </div>

      <div className={styles.heroBody}>
        <div className={styles.heroMainInfo}>
          <p className={styles.heroEyebrow}>In-Progress Chapter</p>
          <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>

          <div className={styles.heroProgressWrap}>
            <div className={styles.heroProgressText}>
              <span>Current Chapter Mastery</span>
              <strong>{step.masteryScore}% Complete</strong>
            </div>
            <div className={styles.bar}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.max(step.masteryScore, 6)}%` }}
              />
            </div>
          </div>

          <p className={styles.heroSummary}>
            You’ve already begun this chapter! Finish the remaining topics and test your board readiness.
          </p>
        </div>

        <div className={styles.heroActionGroup}>
          <Link className={styles.heroCtaPrimary} href={step.href}>
            ▶ Resume Chapter ({step.masteryScore}%) →
          </Link>
          <div className={styles.heroSecondaryRow}>
            <Link
              className={styles.heroCtaSecondary}
              href={`/chapters/${step.chapterSlug}/quiz`}
            >
              ⚡ Take Chapter Quiz
            </Link>
            <button
              type="button"
              className={styles.heroAskTaraBtn}
              onClick={() => openTara(`Explain the key formulas and concepts of ${step.chapterTitle}`)}
            >
              ✨ Ask Tara
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
