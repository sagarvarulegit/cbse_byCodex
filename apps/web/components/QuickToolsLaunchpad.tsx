'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './dashboard-home.module.css';

export type ToolItem = {
  id: string;
  icon: string;
  title: string;
  href: string;
};

const QUICK_TOOLS: ToolItem[] = [
  {
    id: 'virtual-lab',
    icon: '🧪',
    title: '3D Virtual Lab',
    href: '/virtual-lab',
  },
  {
    id: 'formula-cheatsheets',
    icon: '⚡',
    title: 'Formula Sheets',
    href: '/formula-cheatsheets',
  },
  {
    id: 'pyq-trends',
    icon: '📊',
    title: 'PYQ Trends',
    href: '/pyq-trends',
  },
  {
    id: 'exam-papers',
    icon: '🏆',
    title: '3-Hr Mock CBT',
    href: '/exam-papers',
  },
];

export default function QuickToolsLaunchpad() {
  return (
    <section className={styles.zoneSection} aria-label="Quick Tools Dock">
      <div className={styles.zoneHeaderRow}>
        <div className={styles.zoneTitleBlock}>
          <h2 className={styles.zoneHeading}>Quick Tools</h2>
          <span className={styles.zoneBadge}>High-Yield Engines</span>
        </div>
      </div>

      <div className={styles.quickToolsGrid}>
        {QUICK_TOOLS.map((tool) => (
          <Link key={tool.id} href={tool.href} className={styles.quickToolTile}>
            <div className={styles.quickToolLeft}>
              <span className={styles.quickToolIcon}>{tool.icon}</span>
              <span className={styles.quickToolTitle}>{tool.title}</span>
            </div>
            <ArrowRight size={15} strokeWidth={2.4} className={styles.quickToolChevron} />
          </Link>
        ))}
      </div>
    </section>
  );
}
