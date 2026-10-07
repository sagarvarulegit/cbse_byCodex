'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { NextStep } from '../lib/dashboard-home';
import styles from './dashboard-home.module.css';

const STARTERS = {
  science: {
    id: 'science',
    tabLabel: '🧪 Science',
    subjectCode: '086',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    notesHref: '/chapters/chemical-reactions-and-equations',
    quizHref: '/chapters/chemical-reactions-and-equations/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    themeGradient: 'radial-gradient(ellipse at top right, rgba(5, 150, 105, 0.08), transparent 70%)',
    summary:
      'Master chemical equations, balancing rules, redox, and displacement reactions with simplified NCERT breakdowns.',
  },
  maths: {
    id: 'maths',
    tabLabel: '📐 Mathematics',
    subjectCode: '041',
    chapter: 'Real Numbers',
    chapterSlug: 'real-numbers',
    notesHref: '/chapters/real-numbers',
    quizHref: '/chapters/real-numbers/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    themeGradient: 'radial-gradient(ellipse at top right, rgba(37, 99, 235, 0.08), transparent 70%)',
    summary:
      'Learn prime factorisation, HCF × LCM formulas, and step-by-step proofs for irrational numbers (√2, √3, √5).',
  },
  sst: {
    id: 'sst',
    tabLabel: '🌍 Social Science',
    subjectCode: '087',
    chapter: 'The Rise of Nationalism in Europe',
    chapterSlug: 'rise-of-nationalism-in-europe',
    notesHref: '/chapters/rise-of-nationalism-in-europe',
    quizHref: '/chapters/rise-of-nationalism-in-europe/quiz',
    timeEst: '4 min',
    xp: '+50 XP',
    badgeColor: '#d97706',
    badgeBg: '#fffbeb',
    themeGradient: 'radial-gradient(ellipse at top right, rgba(217, 119, 6, 0.08), transparent 70%)',
    summary:
      'Understand the French Revolution, Napoleonic Civil Code of 1804, Mazzini, and German & Italian unification simply.',
  },
  english: {
    id: 'english',
    tabLabel: '📚 English',
    subjectCode: '184',
    chapter: 'A Letter to God',
    chapterSlug: 'a-letter-to-god',
    notesHref: '/chapters/a-letter-to-god',
    quizHref: '/chapters/a-letter-to-god/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    themeGradient: 'radial-gradient(ellipse at top right, rgba(124, 58, 237, 0.08), transparent 70%)',
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
      <section
        className={styles.heroCard}
        style={{ backgroundImage: current.themeGradient }}
        aria-label="Today's Recommended Mission"
      >
        {/* Top Segmented Controller */}
        <div className={styles.heroSwitcherRow}>
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
                  {item.tabLabel}
                </button>
              );
            })}
          </div>

          <div className={styles.heroPillGroup}>
            <span className={styles.heroMetaPill}>CBSE Code {current.subjectCode}</span>
            <span className={styles.heroTimePill}>⏱️ {current.timeEst}</span>
          </div>
        </div>

        {/* Hero Centerpiece */}
        <div className={styles.heroMainBody}>
          <div className={styles.heroHeaderBlock}>
            <span className={styles.heroEyebrow}>RECOMMENDED FIRST MISSION</span>
            <h2 className={styles.heroTitle}>{current.chapter}</h2>
            <p className={styles.heroSummary}>{current.summary}</p>
          </div>

          <div className={styles.heroActionsRow}>
            <Link className={styles.heroCtaPrimary} href={current.quizHref}>
              ▶ Start 3-Min Quiz ({current.xp}) →
            </Link>
            <Link className={styles.heroCtaSecondary} href={current.notesHref}>
              📖 Read Notes
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
      </section>
    );
  }

  // 2. Revise State (Targeted recovery from low quiz score or mock mistakes)
  if (step.kind === 'revise') {
    return (
      <section className={`${styles.heroCard} ${styles.heroCardRevise}`} aria-label="Targeted Revision">
        <div className={styles.heroSwitcherRow}>
          <span className={styles.heroSubjectBadgeRevise}>
            🚨 Targeted Revision · {step.subjectName}
          </span>
          <span className={styles.heroXpPill}>+60 XP Recovery</span>
        </div>

        <div className={styles.heroMainBody}>
          <div className={styles.heroHeaderBlock}>
            <span className={styles.heroEyebrow}>FOCUS PRIORITY</span>
            <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>
            <p className={styles.heroSummary}>
              <strong>Trigger:</strong> {step.reason}. Revise key concepts and retake the quiz to secure board marks.
            </p>
          </div>

          <div className={styles.heroActionsRow}>
            <Link className={styles.heroCtaPrimary} href={step.href}>
              ▶ Start Revision Mission →
            </Link>
            <Link className={styles.heroCtaSecondary} href={`/chapters/${step.chapterSlug}`}>
              📖 Open Notes
            </Link>
            <Link className={styles.heroQuietLink} href="/my-mistakes">
              View Mistakes →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 3. Continue State (Chapter in progress)
  return (
    <section className={styles.heroCard} aria-label="Continue Chapter">
      <div className={styles.heroSwitcherRow}>
        <span className={styles.heroSubjectBadge}>
          ⚡ In Progress · {step.subjectName}
        </span>
        <span className={styles.heroXpPill}>+40 XP</span>
      </div>

      <div className={styles.heroMainBody}>
        <div className={styles.heroHeaderBlock}>
          <span className={styles.heroEyebrow}>CONTINUE CHAPTER</span>
          <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>

          <div className={styles.heroProgressWrap}>
            <div className={styles.heroProgressText}>
              <span>Chapter Mastery</span>
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
            You’ve already started this chapter! Complete remaining topics and lock in your marks.
          </p>
        </div>

        <div className={styles.heroActionsRow}>
          <Link className={styles.heroCtaPrimary} href={step.href}>
            ▶ Resume Chapter ({step.masteryScore}%) →
          </Link>
          <Link
            className={styles.heroCtaSecondary}
            href={`/chapters/${step.chapterSlug}/quiz`}
          >
            ⚡ Take Quiz
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
    </section>
  );
}
