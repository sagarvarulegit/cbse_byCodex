'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import TaraFireflyIcon from './TaraFireflyIcon';
import styles from './dashboard-home.module.css';

export type WeakChapterItem = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  reason: string;
  href: string;
};

export type DashboardSidebarHudProps = {
  streakDays: number;
  streakLabel?: string;
  readiness: number;
  hasProgressData: boolean;
  quizAvg: number | null;
  mockAvg: number | null;
  startedCoreChapters: number;
  totalCoreChapters: number;
  weakChapters: WeakChapterItem[];
};

const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const TARA_PROMPTS = [
  { text: 'Explain Redox reactions simply', label: '🧪 Redox Reactions' },
  { text: 'Trigonometric table memory trick', label: '📐 Trig Shortcut' },
  { text: 'How to write 5-mark answers in SST?', label: '🌍 5-Mark Tips' },
] as const;

function triggerTara(prompt?: string) {
  const bubble = document.querySelector('[aria-label*="Tara"]') as HTMLElement | null;
  if (!bubble) return;

  // If chat window is closed, click the bubble to open
  const isExpanded = bubble.getAttribute('aria-expanded') === 'true';
  if (!isExpanded) {
    bubble.click();
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

export default function DashboardSidebarHud({
  streakDays,
  streakLabel,
  readiness,
  hasProgressData,
  quizAvg,
  mockAvg,
  startedCoreChapters,
  totalCoreChapters,
  weakChapters,
}: DashboardSidebarHudProps) {
  // Weekly days calculation (Monday = 0 ... Sunday = 6)
  const todayIdx = (new Date().getDay() + 6) % 7;

  // Gamified daily missions in client storage
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const todayKey = `cr_quests_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setCompletedQuests(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleQuest = (id: string) => {
    setCompletedQuests((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        const todayKey = `cr_quests_${new Date().toISOString().slice(0, 10)}`;
        localStorage.setItem(todayKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const questsCount = 3;
  const questsDone = Object.values(completedQuests).filter(Boolean).length;

  // SVG Gauge calculations
  const radius = 44;
  const circumference = 2 * Math.PI * radius; // ~276.46
  const strokeDashoffset = circumference - (Math.min(Math.max(readiness, 0), 100) / 100) * circumference;

  return (
    <aside className={styles.sidebarHud} aria-label="Student Command HUD">
      {/* 1. Daily Streak & Momentum Card */}
      <section className={styles.hudCard}>
        <div className={styles.streakHeader}>
          <div className={styles.streakFlame}>
            <span className={styles.flameIcon}>🔥</span>
            <div>
              <div className={styles.streakCount}>
                {streakDays > 0 ? `${streakDays} Days` : 'Day 1'}
              </div>
              <div className={styles.streakSub}>
                {streakDays > 0 ? (streakLabel || 'Active Streak') : 'Start Daily Habit'}
              </div>
            </div>
          </div>
          <span className={styles.streakXpBadge}>+20 XP Today</span>
        </div>

        {/* 7-Day Week Momentum Track */}
        <div className={styles.weekTrack} aria-label="Weekly activity track">
          {DAY_NAMES.map((name, idx) => {
            const isToday = idx === todayIdx;
            const isPast = idx < todayIdx;
            const isFilled = streakDays > 0 && (isPast || isToday);

            return (
              <div
                key={`${name}-${idx}`}
                className={`${styles.dayDot} ${isToday ? styles.dayDotToday : ''} ${
                  isFilled ? styles.dayDotActive : ''
                }`}
                title={isToday ? 'Today' : undefined}
              >
                <span className={styles.dayLetter}>{name}</span>
                <span className={styles.dayIndicator}>
                  {isFilled ? '✓' : isToday ? '•' : ''}
                </span>
              </div>
            );
          })}
        </div>

        <p className={styles.streakNudge}>
          {streakDays > 0
            ? 'Complete 1 quiz or read 1 topic today to keep your streak burning!'
            : 'Take your first 3-minute quiz today to ignite your study streak!'}
        </p>
      </section>

      {/* 2. Board Exam Readiness Gauge */}
      <section className={styles.hudCard}>
        <div className={styles.cardHeaderSmall}>
          <h3 className={styles.hudCardTitle}>Board Exam Readiness</h3>
          <span className={styles.targetBadge}>Target: 95%+</span>
        </div>

        <div className={styles.gaugeContainer}>
          <div className={styles.gaugeSvgWrap}>
            <svg className={styles.gaugeSvg} viewBox="0 0 110 110">
              <circle
                className={styles.gaugeBgCircle}
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
              />
              <circle
                className={styles.gaugeFillCircle}
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className={styles.gaugeCenterText}>
              <span className={styles.gaugeNumber}>{readiness}%</span>
              <span className={styles.gaugeLabel}>Readiness</span>
            </div>
          </div>

          <div className={styles.gaugeStats}>
            <div className={styles.gaugeStatRow}>
              <span className={styles.statDot} style={{ background: '#c95014' }} />
              <span className={styles.statLabel}>Syllabus Started</span>
              <strong className={styles.statValue}>
                {startedCoreChapters}/{totalCoreChapters}
              </strong>
            </div>
            <div className={styles.gaugeStatRow}>
              <span className={styles.statDot} style={{ background: '#059669' }} />
              <span className={styles.statLabel}>Quiz Accuracy</span>
              <strong className={styles.statValue}>
                {quizAvg !== null ? `${Math.round(quizAvg)}%` : '—'}
              </strong>
            </div>
            <div className={styles.gaugeStatRow}>
              <span className={styles.statDot} style={{ background: '#2563eb' }} />
              <span className={styles.statLabel}>Mock Average</span>
              <strong className={styles.statValue}>
                {mockAvg !== null ? `${Math.round(mockAvg)}%` : '—'}
              </strong>
            </div>
          </div>
        </div>

        {hasProgressData ? (
          weakChapters.length > 0 ? (
            <div className={styles.weakSubSection}>
              <div className={styles.weakHeaderRow}>
                <span className={styles.weakSectionTitle}>High-Priority Focus</span>
                <Link className={styles.weakAllLink} href="/my-mistakes">
                  My Mistakes →
                </Link>
              </div>
              <div className={styles.weakMiniList}>
                {weakChapters.slice(0, 2).map((item) => (
                  <div key={item.chapterSlug} className={styles.weakMiniItem}>
                    <div className={styles.weakMiniText}>
                      <strong>{item.chapterTitle}</strong>
                      <span>{item.subjectName}</span>
                    </div>
                    <Link className={styles.miniReviseBtn} href={item.href}>
                      Revise →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className={styles.hudSubNote}>
              🌟 No weak chapters detected! Take a full mock paper to test full syllabus endurance.
            </p>
          )
        ) : (
          <div className={styles.gaugeKickoffBox}>
            <p className={styles.kickoffText}>
              Complete your first 3-minute quiz to unlock your personalized Board Score forecast and weak-spot radar.
            </p>
            <Link
              className={styles.kickoffBtn}
              href="/chapters/chemical-reactions-and-equations/quiz"
            >
              Start Diagnostic Quiz →
            </Link>
          </div>
        )}
      </section>

      {/* 3. Daily Quests / Missions */}
      <section className={styles.hudCard}>
        <div className={styles.cardHeaderSmall}>
          <div className={styles.titleWithIcon}>
            <span className={styles.titleIcon}>🎯</span>
            <h3 className={styles.hudCardTitle}>Daily Quests</h3>
          </div>
          <span className={styles.questCounterBadge}>
            {questsDone}/{questsCount} Done
          </span>
        </div>

        <div className={styles.questProgressBar}>
          <div
            className={styles.questProgressFill}
            style={{ width: `${(questsDone / questsCount) * 100}%` }}
          />
        </div>

        <div className={styles.questList}>
          {/* Quest 1 */}
          <div
            className={`${styles.questItem} ${
              completedQuests.quiz ? styles.questItemDone : ''
            }`}
            onClick={() => toggleQuest('quiz')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') toggleQuest('quiz');
            }}
          >
            <div className={styles.questCheckbox}>
              {completedQuests.quiz ? '✓' : ''}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Complete 1 NCERT Quiz</span>
              <span className={styles.questReward}>+30 XP · Board Practice</span>
            </div>
          </div>

          {/* Quest 2 */}
          <div
            className={`${styles.questItem} ${
              completedQuests.lab ? styles.questItemDone : ''
            }`}
            onClick={() => toggleQuest('lab')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') toggleQuest('lab');
            }}
          >
            <div className={styles.questCheckbox}>
              {completedQuests.lab ? '✓' : ''}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Explore 1 Virtual Lab simulation</span>
              <span className={styles.questReward}>+25 XP · Visual Concept</span>
            </div>
          </div>

          {/* Quest 3 */}
          <div
            className={`${styles.questItem} ${
              completedQuests.tara ? styles.questItemDone : ''
            }`}
            onClick={() => toggleQuest('tara')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') toggleQuest('tara');
            }}
          >
            <div className={styles.questCheckbox}>
              {completedQuests.tara ? '✓' : ''}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Ask Tara AI 1 concept question</span>
              <span className={styles.questReward}>+15 XP · Instant Clarity</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Tara AI Doubt Assistant Card */}
      <section className={styles.taraCard}>
        <div className={styles.taraHeader}>
          <div className={styles.taraAvatarBox}>
            <TaraFireflyIcon size={34} glow animated />
          </div>
          <div>
            <h3 className={styles.taraTitle}>Ask Tara AI</h3>
            <p className={styles.taraSub}>Your 24/7 CBSE NCERT Tutor</p>
          </div>
        </div>

        <p className={styles.taraPromptDesc}>
          Have a doubt or need a tricky concept simplified? Tap a quick prompt:
        </p>

        <div className={styles.taraPromptList}>
          {TARA_PROMPTS.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.taraPromptBtn}
              onClick={() => triggerTara(p.text)}
            >
              <span>{p.label}</span>
              <span className={styles.promptArrow}>→</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className={styles.taraOpenFullBtn}
          onClick={() => triggerTara()}
        >
          Open Tara Assistant ✨
        </button>
      </section>
    </aside>
  );
}
