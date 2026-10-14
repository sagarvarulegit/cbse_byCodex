'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Microscope,
  Zap,
  TrendingUp,
  Gamepad2,
  FileText,
} from 'lucide-react';
import styles from './dashboard-home.module.css';

type PracticeCard = {
  id: string;
  category: 'core' | 'arcade';
  title: string;
  desc: string;
  badge: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  accentColor: string;
  accentBg: string;
  href: string;
  cta: string;
};

const PRACTICE_TOOLS: PracticeCard[] = [
  {
    id: 'virtual-lab',
    category: 'core',
    title: '3D Virtual Science Lab',
    desc: 'Hands-on NCERT simulations: pH scale, electrolysis & ray optics.',
    badge: 'Free NCERT Labs',
    Icon: Microscope,
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    href: '/virtual-lab',
    cta: 'Launch 3D Lab',
  },
  {
    id: 'formula-cheatsheets',
    category: 'core',
    title: 'Formula Cheatsheets',
    desc: 'All 14 Maths & Science formula sheets + derivations in 1 click.',
    badge: '₹49 Pack · Free Sample',
    Icon: Zap,
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    href: '/formula-cheatsheets',
    cta: 'View Formulas',
  },
  {
    id: 'formula-rush',
    category: 'arcade',
    title: 'Formula Rush Arcade',
    desc: '60-second rapid-fire recall drills to build instant exam speed.',
    badge: 'Unlimited Free Play',
    Icon: Gamepad2,
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    href: '/games/formula-rush',
    cta: 'Play Arcade',
  },
  {
    id: 'score-predictor',
    category: 'arcade',
    title: 'Board Score Predictor',
    desc: 'AI blueprint analysis to estimate your 2026-27 CBSE percentile.',
    badge: 'AI Blueprint Tool',
    Icon: TrendingUp,
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    href: '/tools/readiness-predictor',
    cta: 'Predict Score',
  },
];

type TabKey = 'core' | 'arcade' | 'mocks' | 'all';

export default function DashboardPracticeHub() {
  const [activeTab, setActiveTab] = useState<TabKey>('core');

  const visibleCards =
    activeTab === 'all'
      ? PRACTICE_TOOLS
      : activeTab === 'mocks'
        ? []
        : PRACTICE_TOOLS.filter((t) => t.category === activeTab);

  const showMockBanner = activeTab === 'mocks' || activeTab === 'all';

  return (
    <section aria-label="Practice tools">
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <div className={styles.sectionIconBox}>
            <Sparkles size={16} strokeWidth={2.2} color="#c95014" />
          </div>
          <h2 className={styles.sectionTitle}>High-Yield Practice & Revision</h2>
          <span className={styles.sectionBadge}>Interactive Apps</span>
        </div>
        <Link className={styles.sectionLink} href="/tools">
          <span>All Tools Catalog</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Progressive Disclosure Tabs: Tucking Arcade & Mock Tools into Clean Views */}
      <div className={styles.practiceTabRow} role="tablist" aria-label="Revision tool categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'core'}
          className={`${styles.practiceTab} ${activeTab === 'core' ? styles.practiceTabActive : ''}`}
          onClick={() => setActiveTab('core')}
        >
          <span>🔬 NCERT Labs & Formulas</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'arcade'}
          className={`${styles.practiceTab} ${activeTab === 'arcade' ? styles.practiceTabActive : ''}`}
          onClick={() => setActiveTab('arcade')}
        >
          <span>🎮 Arcade & Drills</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'mocks'}
          className={`${styles.practiceTab} ${activeTab === 'mocks' ? styles.practiceTabActive : ''}`}
          onClick={() => setActiveTab('mocks')}
        >
          <span>📝 Board Mocks</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'all'}
          className={`${styles.practiceTab} ${activeTab === 'all' ? styles.practiceTabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <span>All Tools ({PRACTICE_TOOLS.length + 1})</span>
        </button>
      </div>

      {/* Cards Grid for Selected Category */}
      {visibleCards.length > 0 ? (
        <div className={styles.practiceGrid}>
          {visibleCards.map((card) => {
            const CardIcon = card.Icon;
            return (
              <Link className={styles.practiceCard} href={card.href} key={card.id}>
                <div>
                  <div className={styles.practiceCardTop}>
                    <div
                      className={styles.practiceIconBox}
                      style={{ backgroundColor: card.accentBg, color: card.accentColor }}
                    >
                      <CardIcon size={20} strokeWidth={2.2} />
                    </div>
                    <span className={styles.practiceBadge}>{card.badge}</span>
                  </div>
                  <h3 className={styles.practiceTitle}>{card.title}</h3>
                  <p className={styles.practiceDesc}>{card.desc}</p>
                </div>
                <div className={styles.practiceActionRow}>
                  <span>{card.cta}</span>
                  <ArrowRight size={13} strokeWidth={2.5} />
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      {/* Full Mock Paper Featured Banner */}
      {showMockBanner ? (
        <div className={styles.mockBanner}>
          <div className={styles.mockBannerLeft}>
            <div className={styles.mockBannerIconBox}>
              <FileText size={28} strokeWidth={2.2} color="#c95014" />
            </div>
            <div>
              <div className={styles.mockBannerTagRow}>
                <span className={styles.mockBannerTag}>OFFICIAL 2026-27 BLUEPRINT</span>
                <span className={styles.mockBannerFreeBadge}>Paper 1 100% Free</span>
              </div>
              <h3 className={styles.mockBannerTitle}>CBSE Official Board Mock Papers</h3>
              <p className={styles.mockBannerSub}>
                Practice full 80-mark timed papers matching the official curriculum with step-wise marking schemes.
              </p>
            </div>
          </div>
          <div className={styles.mockBannerActions}>
            <Link className={styles.mockBannerBtnSecondary} href="/store">
              <Sparkles size={14} strokeWidth={2.5} />
              <span>5-Paper Pro Pass (₹199)</span>
            </Link>
            <Link className={styles.mockBannerBtn} href="/exam-papers">
              <span>Solve Free Paper 1</span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}
