'use client';

import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';

import styles from './dashboard-calm.module.css';

const STORAGE_PREFIX = 'cr:last-seen-xp:';

type Props = {
  studentId: string;
  totalXp: number;
  level: number;
};

/**
 * XP is a reward, not a header stat. This shows a small celebration only when
 * the student has earned stars since their last visit, then gets out of the way.
 * Keyed per student so siblings sharing a device don't see each other's stars.
 */
export default function XpRewardToast({ studentId, totalXp, level }: Props) {
  const [gained, setGained] = useState<number | null>(null);

  useEffect(() => {
    const storageKey = `${STORAGE_PREFIX}${studentId}`;
    try {
      const previous = Number(window.localStorage.getItem(storageKey));
      window.localStorage.setItem(storageKey, String(totalXp));
      if (Number.isFinite(previous) && previous > 0 && totalXp > previous) {
        setGained(totalXp - previous);
      }
    } catch {
      // localStorage can be unavailable (private mode); the reward is optional.
    }
  }, [studentId, totalXp]);

  useEffect(() => {
    if (gained === null) return;
    const timer = window.setTimeout(() => setGained(null), 7000);
    return () => window.clearTimeout(timer);
  }, [gained]);

  if (gained === null) return null;

  return (
    <div className={styles.rewardToast} role="status">
      <span className={styles.rewardStar} aria-hidden="true">
        <Star size={18} fill="currentColor" strokeWidth={2} />
      </span>
      <span>
        <strong>+{gained} stars</strong> since your last visit. You&apos;re on Level {level}!
      </span>
      <button
        type="button"
        className={styles.rewardClose}
        onClick={() => setGained(null)}
        aria-label="Close"
      >
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
