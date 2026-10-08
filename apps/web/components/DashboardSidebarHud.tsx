'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Flame,
  Target,
  Check,
  Sparkles,
  ArrowRight,
  FlaskConical,
  Calculator,
  Globe2,
  HelpCircle,
  Award,
} from 'lucide-react';
import TaraFireflyIcon from './TaraFireflyIcon';
import type { StudentRankInfo } from '../lib/dashboard-home';
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
  rank?: StudentRankInfo;
};

const DAY_NAMES = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const TARA_PROMPTS = [
  { text: 'Explain Redox reactions simply with real examples', label: 'Redox Reactions', Icon: FlaskConical },
  { text: 'Trigonometric table 0-90 memory shortcut trick', label: 'Trig Shortcut', Icon: Calculator },
  { text: 'How to write 5-mark answers in Class 10 SST?', label: '5-Mark SST Tips', Icon: Globe2 },
] as const;

function triggerTara(prompt?: string) {
  const bubble = document.querySelector('[aria-label*="Tara"]') as HTMLElement | null;
  if (!bubble) return;

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
  rank,
}: DashboardSidebarHudProps) {
  const todayIdx = (new Date().getDay() + 6) % 7;
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const todayKey = `cr_quests_${new Date().toISOString().slice(0, 10)}`;
      const saved = localStorage.getItem(todayKey);
      if (saved) {
        setCompletedQuests(JSON.parse(saved));
      }
    } catch {
      // ignore
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

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(readiness, 0), 100) / 100) * circumference;

  return (
    <aside className={styles.sidebarHud} aria-label="Student Command HUD">
      {/* Card 1: Study Momentum & Board Readiness */}
      <section className={styles.hudCard}>
        {/* Student Level & Rank Progression */}
        {rank ? (
          <div className={styles.rankHudBlock}>
            <div className={styles.rankHudTop}>
              <div className={styles.rankHudTitleRow}>
                <div className={styles.rankIconBox}>
                  <Award size={16} strokeWidth={2.5} color="#c95014" />
                </div>
                <div>
                  <div className={styles.rankHudLevel}>
                    Level {rank.level} · {rank.rankTitle}
                  </div>
                  <div className={styles.rankHudSub}>
                    {rank.xpToNext > 0
                      ? `${rank.xpToNext} XP to Level ${rank.level + 1}`
                      : 'Top Rank Achieved'}
                  </div>
                </div>
              </div>
              <span className={styles.rankXpBadge}>{rank.totalXp} XP</span>
            </div>
            <div className={styles.rankProgressBar}>
              <div
                className={styles.rankProgressFill}
                style={{ width: `${Math.max(rank.progressPercent, 6)}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Streak & Weekly Track */}
        <div className={styles.streakHeader}>
          <div className={styles.streakFlame}>
            <div className={styles.flameIconBox}>
              <Flame size={20} color="#ea580c" strokeWidth={2.5} />
            </div>
            <div>
              <div className={styles.streakCount}>
                {streakDays > 0 ? `${streakDays} Days` : 'Day 1'}
              </div>
              <div className={styles.streakSub}>
                {streakDays > 0 ? (streakLabel || 'Study Streak') : 'Start Habit'}
              </div>
            </div>
          </div>
          <span className={styles.streakXpBadge}>+20 XP Today</span>
        </div>

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
                  {isFilled ? <Check size={10} strokeWidth={3} /> : isToday ? '•' : ''}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.hudDivider} />

        {/* Board Readiness Gauge */}
        <div className={styles.cardHeaderSmall}>
          <div className={styles.titleWithIcon}>
            <Target size={16} color="#c95014" strokeWidth={2.5} />
            <h3 className={styles.hudCardTitle}>Board Exam Readiness</h3>
          </div>
          <span className={hasProgressData ? styles.targetBadge : styles.targetBadgeCalibrating}>
            {hasProgressData ? 'Target: 95%+' : 'Phase 1: Calibration'}
          </span>
        </div>

        <div className={styles.gaugeContainer}>
          <div className={styles.gaugeSvgWrap}>
            <svg className={styles.gaugeSvg} viewBox="0 0 100 100">
              <circle
                className={styles.gaugeBgCircle}
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
              />
              <circle
                className={hasProgressData ? styles.gaugeFillCircle : styles.gaugeCalibrateCircle}
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="8"
                strokeDasharray={hasProgressData ? circumference : '6 4'}
                strokeDashoffset={hasProgressData ? strokeDashoffset : 0}
              />
            </svg>
            <div className={styles.gaugeCenterText}>
              {hasProgressData ? (
                <>
                  <span className={styles.gaugeNumber}>{readiness}%</span>
                  <span className={styles.gaugeLabel}>Readiness</span>
                </>
              ) : (
                <>
                  <span className={styles.gaugeCalibrateNumber}>READY</span>
                  <span className={styles.gaugeCalibrateLabel}>Day 1 Launch</span>
                </>
              )}
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
                {quizAvg !== null ? (
                  `${Math.round(quizAvg)}%`
                ) : (
                  <span className={styles.statPendingBadge}>Pending Quiz</span>
                )}
              </strong>
            </div>
            <div className={styles.gaugeStatRow}>
              <span className={styles.statDot} style={{ background: '#2563eb' }} />
              <span className={styles.statLabel}>
                {hasProgressData ? 'Mock Average' : 'Target Band'}
              </span>
              <strong className={styles.statValue}>
                {mockAvg !== null ? `${Math.round(mockAvg)}%` : '95%+ Topper'}
              </strong>
            </div>
          </div>
        </div>

        {hasProgressData ? (
          weakChapters.length > 0 ? (
            <div className={styles.weakSubSection}>
              <div className={styles.weakHeaderRow}>
                <span className={styles.weakSectionTitle}>Priority Focus</span>
                <Link className={styles.weakAllLink} href="/my-mistakes">
                  <span>Mistakes</span>
                  <ArrowRight size={12} strokeWidth={2.5} />
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
                      <span>Revise</span>
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ) : (
          <div className={styles.gaugeCalibrationBox}>
            <div className={styles.calibrationBoxHead}>
              <Sparkles size={14} color="#c95014" strokeWidth={2.5} />
              <strong className={styles.calibrationBoxTitle}>Unlock Live Readiness</strong>
            </div>
            <p className={styles.calibrationBoxText}>
              Run a 3-minute diagnostic quiz to lock your starting accuracy, map weak spots, and earn +50 XP toward Level 2.
            </p>
            <Link
              className={styles.calibrationBtn}
              href="/chapters/chemical-reactions-and-equations/quiz"
            >
              <span>Run 3-Min Calibration Quiz (+50 XP)</span>
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </section>

      {/* Card 2: Daily Quests & Ask Tara AI */}
      <section className={styles.hudCard}>
        {/* Quests Header */}
        <div className={styles.cardHeaderSmall}>
          <div className={styles.titleWithIcon}>
            <Target size={16} color="#c95014" strokeWidth={2.5} />
            <h3 className={styles.hudCardTitle}>Daily Missions</h3>
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
              {completedQuests.quiz ? <Check size={12} strokeWidth={3} /> : null}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Complete 1 NCERT Quiz</span>
              <span className={styles.questReward}>+30 XP · Board Recall</span>
            </div>
          </div>

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
              {completedQuests.lab ? <Check size={12} strokeWidth={3} /> : null}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Explore 1 Virtual Lab simulation</span>
              <span className={styles.questReward}>+25 XP · Visual Concept</span>
            </div>
          </div>

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
              {completedQuests.tara ? <Check size={12} strokeWidth={3} /> : null}
            </div>
            <div className={styles.questDetails}>
              <span className={styles.questTitle}>Ask Tara AI a concept question</span>
              <span className={styles.questReward}>+15 XP · Instant Clarity</span>
            </div>
          </div>
        </div>

        <div className={styles.hudDivider} />

        {/* Ask Tara Section */}
        <div className={styles.taraHeader}>
          <div className={styles.taraAvatarBox}>
            <TaraFireflyIcon size={26} glow animated />
          </div>
          <div>
            <h3 className={styles.taraTitle}>Ask Tara AI</h3>
            <p className={styles.taraSub}>Your 24/7 CBSE NCERT Tutor</p>
          </div>
        </div>

        <div className={styles.taraPromptList}>
          {TARA_PROMPTS.map((p) => {
            const PromptIcon = p.Icon;
            return (
              <button
                key={p.label}
                type="button"
                className={styles.taraPromptBtn}
                onClick={() => triggerTara(p.text)}
              >
                <div className={styles.promptBtnLeft}>
                  <PromptIcon size={14} strokeWidth={2} />
                  <span>{p.label}</span>
                </div>
                <ArrowRight size={13} strokeWidth={2.5} className={styles.promptArrow} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.taraOpenFullBtn}
          onClick={() => triggerTara()}
        >
          <Sparkles size={15} strokeWidth={2} />
          <span>Open Tara Assistant</span>
        </button>
      </section>
    </aside>
  );
}
