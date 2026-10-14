'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  Globe2,
  BookOpenCheck,
  Clock,
  Play,
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Target,
  ChevronDown,
} from 'lucide-react';

import type { NextStep } from '../lib/dashboard-home';
import styles from './dashboard-home.module.css';

const STARTERS = {
  science: {
    id: 'science',
    tabLabel: 'Science',
    Icon: FlaskConical,
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
      'Master the 5 reaction types, balancing coefficients, redox, and displacement with simplified NCERT breakdowns.',
    blueprint: [
      { step: '01', title: 'NCERT Concept Notes', duration: '12 min', desc: '5 Reaction Types & Equations' },
      { step: '02', title: 'Lab Reactions & Colors', duration: '8 min', desc: '13 Verified NCERT Experiments' },
      { step: '03', title: 'Board Recall Quiz', duration: '3 min', desc: 'Quick MCQ practice for +50 XP' },
    ],
  },
  maths: {
    id: 'maths',
    tabLabel: 'Mathematics',
    Icon: Calculator,
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
      'Learn prime factorisation, HCF × LCM formulas, and step-by-step contradiction proofs for irrational numbers (√2, √3, √5).',
    blueprint: [
      { step: '01', title: 'Fundamental Theorem', duration: '10 min', desc: 'Prime factorisation & HCF×LCM' },
      { step: '02', title: 'Irrationality Proofs', duration: '8 min', desc: 'Contradiction method for √2, √3' },
      { step: '03', title: 'Board Speed Drill', duration: '3 min', desc: 'Quick MCQ practice for +50 XP' },
    ],
  },
  sst: {
    id: 'sst',
    tabLabel: 'Social Science',
    Icon: Globe2,
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
    blueprint: [
      { step: '01', title: 'French Revolution & Ideas', duration: '12 min', desc: 'Civil Code of 1804 & Liberalism' },
      { step: '02', title: 'German & Italian Unification', duration: '10 min', desc: 'Bismarck, Cavour, Garibaldi' },
      { step: '03', title: 'Timeline & Dates Quiz', duration: '4 min', desc: 'Quick recall for +50 XP' },
    ],
  },
  english: {
    id: 'english',
    tabLabel: 'English',
    Icon: BookOpenCheck,
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
      'Explore Lencho’s steadfast faith, the devastating hailstorm, and the bittersweet irony of the postal workers.',
    blueprint: [
      { step: '01', title: 'Story Summary & Themes', duration: '8 min', desc: 'Lencho’s faith & irony explained' },
      { step: '02', title: 'Character Analysis', duration: '6 min', desc: 'Postmaster generosity & symbolism' },
      { step: '03', title: 'Extract & Literature Quiz', duration: '3 min', desc: 'Quick recall for +50 XP' },
    ],
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
  const [showBlueprint, setShowBlueprint] = useState(false);

  // 1. Day-1 Starter State
  if (step.kind === 'start') {
    const current = STARTERS[selectedStarter];
    const SubjectIcon = current.Icon;

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
              const TabIcon = item.Icon;
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
                  <TabIcon size={15} strokeWidth={2.2} />
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.heroPillGroup}>
            <span className={styles.heroMetaPill}>CBSE Code {current.subjectCode}</span>
            <span className={styles.heroTimePill}>
              <Clock size={13} strokeWidth={2} />
              <span>{current.timeEst}</span>
            </span>
          </div>
        </div>

        {/* Hero Deck: Action Focused with Progressive Disclosure Blueprint */}
        <div className={showBlueprint ? styles.heroSplitGrid : styles.heroSingleCol}>
          {/* Main Action Center */}
          <div className={styles.heroLeftCol}>
            <div className={styles.heroHeaderBlock}>
              <div className={styles.heroEyebrowRow}>
                <span className={styles.heroEyebrow}>RECOMMENDED FIRST MISSION</span>
                <span
                  className={styles.heroSubjectMiniTag}
                  style={{ color: current.badgeColor, backgroundColor: current.badgeBg }}
                >
                  <SubjectIcon size={12} strokeWidth={2.2} />
                  <span>Class 10 NCERT</span>
                </span>
              </div>
              <h2 className={styles.heroTitle}>{current.chapter}</h2>
              <p className={styles.heroSummary}>{current.summary}</p>
            </div>

            <div className={styles.heroActionsRow}>
              <Link className={styles.heroCtaPrimary} href={current.quizHref}>
                <Play size={15} fill="currentColor" />
                <span>Start 3-Min Quiz ({current.xp})</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link className={styles.heroCtaSecondary} href={current.notesHref}>
                <BookOpen size={15} strokeWidth={2} />
                <span>Read Notes</span>
              </Link>
              <button
                type="button"
                className={styles.heroAskTaraBtn}
                onClick={() =>
                  openTara(`Can you explain the key concepts and formulas of Class 10 ${current.chapter}?`)
                }
                title="Ask Tara AI about this chapter"
              >
                <Sparkles size={14} strokeWidth={2} />
                <span>Ask Tara</span>
              </button>
              <button
                type="button"
                className={styles.blueprintToggleBtn}
                onClick={() => setShowBlueprint((prev) => !prev)}
                aria-expanded={showBlueprint}
                title="Toggle 3-Step Topper Study Method"
              >
                <Target size={14} strokeWidth={2.2} color={current.badgeColor} />
                <span>{showBlueprint ? 'Hide Blueprint' : '3-Step Blueprint'}</span>
                <ChevronDown
                  size={14}
                  strokeWidth={2.5}
                  className={`${styles.blueprintToggleChevron} ${showBlueprint ? styles.chevronRotated : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Right Column: 3-Step NCERT Blueprint (Progressive Disclosure) */}
          {showBlueprint ? (
            <div className={styles.heroRightCol}>
              <div className={styles.blueprintCard}>
                <div className={styles.blueprintHead}>
                  <div className={styles.blueprintTitleRow}>
                    <Target size={14} strokeWidth={2.2} color={current.badgeColor} />
                    <span className={styles.blueprintHeading}>3-Step Chapter Blueprint</span>
                  </div>
                  <span className={styles.blueprintTag}>Topper Method</span>
                </div>

                <div className={styles.blueprintStepList}>
                  {current.blueprint.map((b, idx) => (
                    <div key={b.step} className={styles.blueprintStepItem}>
                      <div
                        className={styles.blueprintStepNum}
                        style={{
                          backgroundColor: idx === 0 ? current.badgeBg : '#f5f2ea',
                          color: idx === 0 ? current.badgeColor : '#6a645d',
                          borderColor: idx === 0 ? current.badgeColor : '#e7e2d6',
                        }}
                      >
                        {b.step}
                      </div>
                      <div className={styles.blueprintStepInfo}>
                        <div className={styles.blueprintStepTop}>
                          <strong className={styles.blueprintStepTitle}>{b.title}</strong>
                          <span className={styles.blueprintStepTime}>{b.duration}</span>
                        </div>
                        <span className={styles.blueprintStepDesc}>{b.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
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
            <RotateCcw size={14} strokeWidth={2.2} />
            <span>Targeted Revision · {step.subjectName}</span>
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
              <RotateCcw size={15} strokeWidth={2.2} />
              <span>Start Revision Mission</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <Link className={styles.heroCtaSecondary} href={`/chapters/${step.chapterSlug}`}>
              <BookOpen size={15} strokeWidth={2} />
              <span>Open Notes</span>
            </Link>
            <Link className={styles.heroQuietLink} href="/my-mistakes">
              <span>View Mistakes</span>
              <ArrowRight size={13} strokeWidth={2} />
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
          <Play size={14} fill="currentColor" />
          <span>In Progress · {step.subjectName}</span>
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
            <Play size={15} fill="currentColor" />
            <span>Resume Chapter ({step.masteryScore}%)</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
          <Link
            className={styles.heroCtaSecondary}
            href={`/chapters/${step.chapterSlug}/quiz`}
          >
            <CheckCircle2 size={15} strokeWidth={2} />
            <span>Take Quiz</span>
          </Link>
          <button
            type="button"
            className={styles.heroAskTaraBtn}
            onClick={() => openTara(`Explain the key formulas and concepts of ${step.chapterTitle}`)}
          >
            <Sparkles size={14} strokeWidth={2} />
            <span>Ask Tara</span>
          </button>
        </div>
      </div>
    </section>
  );
}
