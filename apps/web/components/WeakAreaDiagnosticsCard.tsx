'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import styles from './dashboard-home.module.css';

export type DiagnosticItem = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  issueReason: string;
  remedialHref: string;
  priority: 'high' | 'medium';
};

export type WeakChapterInfo = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  reason?: string;
  href?: string;
};

export type WeakAreaDiagnosticsCardProps = {
  dueMistakesCount?: number;
  weakChapter?: WeakChapterInfo | null;
  // Backward-compatibility props:
  diagnostics?: DiagnosticItem[];
  pendingMistakesCount?: number;
  latestMockScore?: {
    earned: number;
    total: number;
    paperTitle: string;
  } | null;
  deckMode?: boolean;
};

export default function WeakAreaDiagnosticsCard({
  dueMistakesCount,
  weakChapter,
  diagnostics,
  pendingMistakesCount = 0,
}: WeakAreaDiagnosticsCardProps) {
  // Normalize mistakes count (handle both prop names)
  const mistakesCount = dueMistakesCount ?? pendingMistakesCount;

  // Determine top weak topic or fallback
  const firstDiag = diagnostics?.[0];
  const targetChapterTitle =
    weakChapter?.chapterTitle ?? firstDiag?.chapterTitle ?? 'Chemical Reactions & Equations';
  const targetSubject =
    weakChapter?.subjectName ?? firstDiag?.subjectName ?? 'Science';
  const targetReason =
    weakChapter?.reason ??
    firstDiag?.issueReason ??
    '5 high-yield questions on tricky board reaction types';
  const targetHref =
    weakChapter?.href ??
    firstDiag?.remedialHref ??
    '/chapters/chemical-reactions-and-equations/quiz';

  const hasSpecificWeakArea = Boolean(weakChapter || firstDiag);

  return (
    <aside className={styles.recallCard} aria-label="Daily Recall Dock">
      {/* Dock Title Bar */}
      <div className={styles.recallHeader}>
        <div className={styles.recallTitleRow}>
          <RotateCcw size={16} strokeWidth={2.4} color="#c95014" />
          <h3 className={styles.recallHeading}>Daily Recall</h3>
        </div>
        <span className={styles.recallSub}>Spaced Reinforcement</span>
      </div>

      <div className={styles.recallItemList}>
        {/* Item 1: Mistake Vault */}
        <div className={styles.recallItem}>
          <div className={styles.recallItemTop}>
            <div className={styles.recallItemTitleGroup}>
              <span className={styles.recallItemLabel}>MISTAKE VAULT</span>
              <span
                className={`${styles.recallBadge} ${
                  mistakesCount > 0 ? styles.recallBadgeAlert : styles.recallBadgeSuccess
                }`}
              >
                {mistakesCount > 0 ? `${mistakesCount} Due` : 'All Clear'}
              </span>
            </div>
            <p className={styles.recallItemDesc}>
              {mistakesCount > 0
                ? 'Review missed quiz questions before memory fades.'
                : 'Zero due mistakes! Great accuracy across quizzes.'}
            </p>
          </div>

          <Link href="/my-mistakes" className={styles.recallGhostBtn}>
            <span>Review Vault</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

        <div className={styles.recallDivider} />

        {/* Item 2: Weakest Topic Quick-Fix */}
        <div className={styles.recallItem}>
          <div className={styles.recallItemTop}>
            <div className={styles.recallItemTitleGroup}>
              <span className={styles.recallItemLabel}>
                {hasSpecificWeakArea ? 'WEAK AREA QUICK-FIX' : 'PYQ SPEED DRILL'}
              </span>
              <span className={styles.recallSubjectTag}>{targetSubject}</span>
            </div>
            <strong className={styles.recallItemTitle}>{targetChapterTitle}</strong>
            <p className={styles.recallItemDesc}>{targetReason}</p>
          </div>

          <Link href={targetHref} className={styles.recallGhostBtn}>
            <span>Quick 5-Q Drill</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
