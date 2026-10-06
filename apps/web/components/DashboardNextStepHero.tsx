'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { NextStep } from '../lib/dashboard-home';
import styles from './dashboard-home.module.css';

const STARTERS = {
  science: {
    label: '🧪 Science',
    title: 'Start with Science Chapter 1',
    chapter: 'Chemical Reactions and Equations',
    href: '/chapters/chemical-reactions-and-equations/quiz',
  },
  maths: {
    label: '📐 Maths',
    title: 'Start with Maths Chapter 1',
    chapter: 'Real Numbers',
    href: '/chapters/real-numbers/quiz',
  },
} as const;

type StarterKey = keyof typeof STARTERS;

function openTara() {
  const taraBtn = document.querySelector('[aria-label*="Tara"]') as HTMLElement | null;
  taraBtn?.click();
}

export default function DashboardNextStepHero({ step }: { step: NextStep }) {
  const [starter, setStarter] = useState<StarterKey>('science');

  if (step.kind === 'start') {
    const current = STARTERS[starter];
    return (
      <section className={styles.hero} aria-label="Your next step">
        <div>
          <p className={styles.heroEyebrow}>Your first step</p>
          <h2 className={styles.heroTitle}>{current.title}</h2>
          <p className={styles.heroText}>
            Take a short quiz on <strong>{current.chapter}</strong>. It shows what you already know,
            and your progress starts filling in right after.
          </p>
          <div className={styles.toggle} role="tablist" aria-label="Choose a subject to start">
            {(Object.keys(STARTERS) as StarterKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={starter === key}
                className={starter === key ? styles.toggleBtnActive : styles.toggleBtn}
                onClick={() => setStarter(key)}
              >
                {STARTERS[key].label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryBtn} href={current.href}>
            Start the quiz →
          </Link>
          <button type="button" className={styles.quietLink} onClick={openTara}>
            Stuck on something? Ask Tara
          </button>
        </div>
      </section>
    );
  }

  if (step.kind === 'revise') {
    return (
      <section className={styles.hero} aria-label="Your next step">
        <div>
          <p className={styles.heroEyebrow}>Revise today · {step.subjectName}</p>
          <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>
          <p className={styles.heroText}>{step.reason}</p>
        </div>
        <div className={styles.heroActions}>
          <Link className={styles.primaryBtn} href={step.href}>
            Start revision →
          </Link>
          <Link className={styles.quietLink} href="/my-mistakes">
            See all my mistakes
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.hero} aria-label="Your next step">
      <div>
        <p className={styles.heroEyebrow}>Continue where you left off · {step.subjectName}</p>
        <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>
        <div className={styles.progressMini}>
          <div className={styles.tileFoot}>
            <span>Mastery</span>
            <strong>{step.masteryScore}%</strong>
          </div>
          <div className={styles.bar} style={{ marginTop: '0.35rem' }}>
            <div className={styles.barFill} style={{ width: `${Math.max(step.masteryScore, 3)}%` }} />
          </div>
        </div>
      </div>
      <div className={styles.heroActions}>
        <Link className={styles.primaryBtn} href={step.href}>
          Continue chapter →
        </Link>
        <button type="button" className={styles.quietLink} onClick={openTara}>
          Stuck on something? Ask Tara
        </button>
      </div>
    </section>
  );
}
