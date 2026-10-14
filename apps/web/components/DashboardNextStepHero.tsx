'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  BookOpenCheck,
  Play,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

import type { NextStep } from '../lib/dashboard-home';
import styles from './dashboard-home.module.css';

const STARTER_CHAPTERS = {
  science: {
    id: 'science',
    tabLabel: 'Science',
    Icon: FlaskConical,
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    notesHref: '/chapters/chemical-reactions-and-equations',
    quizHref: '/chapters/chemical-reactions-and-equations/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    summary:
      'Master the 5 reaction types, balancing coefficients, redox, and displacement with simplified NCERT breakdowns.',
  },
  maths: {
    id: 'maths',
    tabLabel: 'Mathematics',
    Icon: Calculator,
    chapter: 'Real Numbers',
    chapterSlug: 'real-numbers',
    notesHref: '/chapters/real-numbers',
    quizHref: '/chapters/real-numbers/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    summary:
      'Learn prime factorisation, HCF × LCM formulas, and step-by-step contradiction proofs for irrational numbers.',
  },
  english: {
    id: 'english',
    tabLabel: 'English',
    Icon: BookOpenCheck,
    chapter: 'Two Stories about Flying',
    chapterSlug: 'two-stories-about-flying',
    notesHref: '/chapters/two-stories-about-flying',
    quizHref: '/chapters/two-stories-about-flying/quiz',
    timeEst: '3 min',
    xp: '+50 XP',
    badgeColor: '#7c3aed',
    badgeBg: '#f5f3ff',
    summary:
      'Explore His First Flight and The Black Aeroplane with clear NCERT themes, character traits, and extract MCQs.',
  },
} as const;

type StarterKey = keyof typeof STARTER_CHAPTERS;

export type MissionProgress = {
  lessonRead: boolean;
  quizTaken: boolean;
  mistakesReviewed: boolean;
};

export type DashboardNextStepHeroProps = {
  step: NextStep;
  missionProgress?: MissionProgress;
};

export default function DashboardNextStepHero({
  step,
  missionProgress = {
    lessonRead: step.kind !== 'start',
    quizTaken: false,
    mistakesReviewed: false,
  },
}: DashboardNextStepHeroProps) {
  const [selectedStarter, setSelectedStarter] = useState<StarterKey>('science');

  // Compute daily mission completed count
  const completedCount =
    (missionProgress.lessonRead ? 1 : 0) +
    (missionProgress.quizTaken ? 1 : 0) +
    (missionProgress.mistakesReviewed ? 1 : 0);

  // -------------------------------------------------------------
  // STATE A: Brand-New Student (zero lessons/attempts underway)
  // -------------------------------------------------------------
  if (step.kind === 'start') {
    const current = STARTER_CHAPTERS[selectedStarter];
    const SubjectIcon = current.Icon;

    return (
      <section
        className={styles.heroCard}
        aria-label="Starter Mission: Choose your first chapter"
      >
        {/* Top Header: Starter Tabs + Timing */}
        <div className={styles.heroTopRow}>
          <div className={styles.starterTabs} role="tablist" aria-label="Choose starting subject">
            {(Object.keys(STARTER_CHAPTERS) as StarterKey[]).map((key) => {
              const item = STARTER_CHAPTERS[key];
              const TabIcon = item.Icon;
              const isActive = selectedStarter === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.starterTab} ${isActive ? styles.starterTabActive : ''}`}
                  onClick={() => setSelectedStarter(key)}
                >
                  <TabIcon size={14} strokeWidth={2.2} />
                  <span>{item.tabLabel}</span>
                </button>
              );
            })}
          </div>

          <div className={styles.heroBadgeGroup}>
            <span className={styles.heroTimeBadge}>
              <Clock size={12} strokeWidth={2} />
              <span>{current.timeEst}</span>
            </span>
            <span className={styles.heroXpBadge}>{current.xp}</span>
          </div>
        </div>

        {/* Hero Body */}
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrowRow}>
            <span className={styles.heroEyebrow}>DAY 1 STARTER QUEST</span>
            <span
              className={styles.heroSubjectPill}
              style={{ color: current.badgeColor, backgroundColor: current.badgeBg }}
            >
              <SubjectIcon size={12} strokeWidth={2.2} />
              <span>Class 10 NCERT</span>
            </span>
          </div>

          <h2 className={styles.heroTitle}>{current.chapter}</h2>
          <p className={styles.heroSummary}>{current.summary}</p>

          {/* 1 Solid Primary CTA + 1 Secondary Ghost CTA */}
          <div className={styles.heroActionsRow}>
            <Link className={styles.heroPrimaryCta} href={current.quizHref}>
              <Play size={15} fill="currentColor" />
              <span>Start 3-Minute Quiz ({current.xp})</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>

            <Link className={styles.heroSecondaryCta} href={current.notesHref}>
              <BookOpen size={15} strokeWidth={2} />
              <span>Read Notes</span>
            </Link>
          </div>
        </div>

        {/* Compact 1-Line Daily Mission Footer Strip */}
        <div className={styles.heroMissionFooter}>
          <span className={styles.missionFooterLabel}>
            Today&apos;s Mission: <strong>{completedCount}/3 completed</strong>
          </span>
          <span className={styles.missionSeparator}>•</span>
          <div className={styles.missionPills}>
            <Link
              href={current.notesHref}
              className={`${styles.missionPill} ${missionProgress.lessonRead ? styles.missionPillDone : ''}`}
            >
              {missionProgress.lessonRead ? '✓ Read 1 Lesson' : 'Read 1 Lesson'}
            </Link>
            <Link
              href={current.quizHref}
              className={`${styles.missionPill} ${missionProgress.quizTaken ? styles.missionPillDone : ''}`}
            >
              {missionProgress.quizTaken ? '✓ 1 Quiz' : '1 Quiz'}
            </Link>
            <Link
              href="/my-mistakes"
              className={`${styles.missionPill} ${missionProgress.mistakesReviewed ? styles.missionPillDone : ''}`}
            >
              {missionProgress.mistakesReviewed ? '✓ Review Mistakes' : 'Review Mistakes'}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // STATE B: Active Student (in-progress or revision)
  // -------------------------------------------------------------
  const isRevise = step.kind === 'revise';
  const masteryScore = !isRevise ? step.masteryScore : 50;
  const eyebrowText = isRevise
    ? `TARGETED REVISION · ${step.subjectName.toUpperCase()}`
    : `IN PROGRESS · ${step.subjectName.toUpperCase()}`;
  const lessonDisplay = step.lessonTitle ?? 'Core NCERT Concept Breakdown';

  return (
    <section
      className={`${styles.heroCard} ${isRevise ? styles.heroCardRevise : ''}`}
      aria-label={isRevise ? 'Targeted Revision Mission' : 'Continue Active Chapter'}
    >
      {/* Top Header Badge */}
      <div className={styles.heroTopRow}>
        <div className={styles.heroEyebrowRow}>
          <span className={styles.heroEyebrow}>{eyebrowText}</span>
        </div>
        <span className={styles.heroXpBadge}>
          {isRevise ? '+60 XP Recovery' : '+40 XP'}
        </span>
      </div>

      {/* Hero Body */}
      <div className={styles.heroContent}>
        <h2 className={styles.heroTitle}>{step.chapterTitle}</h2>

        {/* Current Lesson Title */}
        <div className={styles.currentLessonRow}>
          <span className={styles.currentLessonLabel}>Current Lesson:</span>
          <strong className={styles.currentLessonTitle}>{lessonDisplay}</strong>
        </div>

        {/* Chapter Mastery Progress Bar */}
        <div className={styles.heroProgressWrap}>
          <div className={styles.heroProgressText}>
            <span>Chapter Mastery</span>
            <strong>{masteryScore}% Complete</strong>
          </div>
          <div className={styles.heroProgressBar}>
            <div
              className={styles.heroProgressFill}
              style={{ width: `${Math.max(masteryScore, 6)}%` }}
            />
          </div>
        </div>

        {/* 1 Solid Primary CTA + 1 Secondary Ghost CTA */}
        <div className={styles.heroActionsRow}>
          <Link className={styles.heroPrimaryCta} href={step.href}>
            {isRevise ? (
              <RotateCcw size={15} strokeWidth={2.2} />
            ) : (
              <Play size={15} fill="currentColor" />
            )}
            <span>Resume Lesson</span>
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>

          <Link
            className={styles.heroSecondaryCta}
            href={`/chapters/${step.chapterSlug}/quiz`}
          >
            <CheckCircle2 size={15} strokeWidth={2} />
            <span>Take Chapter Quiz</span>
          </Link>
        </div>
      </div>

      {/* Compact 1-Line Daily Mission Footer Strip */}
      <div className={styles.heroMissionFooter}>
        <span className={styles.missionFooterLabel}>
          Today&apos;s Mission: <strong>{completedCount}/3 completed</strong>
        </span>
        <span className={styles.missionSeparator}>•</span>
        <div className={styles.missionPills}>
          <Link
            href={step.href}
            className={`${styles.missionPill} ${missionProgress.lessonRead ? styles.missionPillDone : ''}`}
          >
            {missionProgress.lessonRead ? '✓ Read 1 Lesson' : 'Read 1 Lesson'}
          </Link>
          <Link
            href={`/chapters/${step.chapterSlug}/quiz`}
            className={`${styles.missionPill} ${missionProgress.quizTaken ? styles.missionPillDone : ''}`}
          >
            {missionProgress.quizTaken ? '✓ 1 Quiz' : '1 Quiz'}
          </Link>
          <Link
            href="/my-mistakes"
            className={`${styles.missionPill} ${missionProgress.mistakesReviewed ? styles.missionPillDone : ''}`}
          >
            {missionProgress.mistakesReviewed ? '✓ Review Mistakes' : 'Review Mistakes'}
          </Link>
        </div>
      </div>
    </section>
  );
}
