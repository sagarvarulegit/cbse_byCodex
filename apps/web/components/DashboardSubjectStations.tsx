'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Calculator,
  Globe2,
  BookOpenCheck,
} from 'lucide-react';
import styles from './dashboard-home.module.css';

export type SubjectProgressItem = {
  slug: string;
  subjectCode: string;
  title: string;
  chapterCount: number;
  startedCount: number;
  progressPercent: number;
};

export type SubjectMetaItem = {
  accentColor: string;
  accentBg: string;
  nextChapterTitle: string;
  nextChapterSlug: string;
  shortDesc: string;
  chapterCountLabel: string;
};

const DEFAULT_SUBJECT_META: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    accentColor: string;
    accentBg: string;
    nextChapterTitle: string;
    nextChapterSlug: string;
    shortDesc: string;
    chapterCountLabel: string;
  }
> = {
  science: {
    Icon: FlaskConical,
    accentColor: '#059669',
    accentBg: '#ecfdf5',
    nextChapterTitle: 'Chemical Reactions & Equations',
    nextChapterSlug: 'chemical-reactions-and-equations',
    shortDesc: 'Physics, Chemistry & Biology',
    chapterCountLabel: '13 chapters · 16 NCERT Labs',
  },
  'mathematics-standard': {
    Icon: Calculator,
    accentColor: '#2563eb',
    accentBg: '#eff6ff',
    nextChapterTitle: 'Real Numbers',
    nextChapterSlug: 'real-numbers',
    shortDesc: 'Algebra, Geometry & Trigonometry',
    chapterCountLabel: '14 chapters · 160+ Formulas',
  },
  'social-science': {
    Icon: Globe2,
    accentColor: '#d97706',
    accentBg: '#fffbeb',
    nextChapterTitle: 'The Rise of Nationalism in Europe',
    nextChapterSlug: 'rise-of-nationalism-in-europe',
    shortDesc: 'History, Geography, Civics & Economics',
    chapterCountLabel: '22 chapters · Map & Case Studies',
  },
  'english-language-and-literature': {
    Icon: BookOpenCheck,
    accentColor: '#7c3aed',
    accentBg: '#f5f3ff',
    nextChapterTitle: 'Two Stories about Flying',
    nextChapterSlug: 'two-stories-about-flying',
    shortDesc: 'First Flight & Footprints',
    chapterCountLabel: '40 chapters · Literature & Grammar',
  },
  'hindi-course-b': {
    Icon: BookOpenCheck,
    accentColor: '#e11d48',
    accentBg: '#fff1f2',
    nextChapterTitle: 'बड़े भाई साहब (स्पर्श)',
    nextChapterSlug: 'hindi-bade-bhai-sahab',
    shortDesc: 'Sparsh & Sanchayan',
    chapterCountLabel: '17 chapters · Literature & Grammar',
  },
};

type Props = {
  subjectProgress: SubjectProgressItem[];
  subjectMeta?: Record<string, Partial<SubjectMetaItem>>;
};

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'science', label: 'Science' },
  { key: 'mathematics-standard', label: 'Mathematics' },
  { key: 'social-science', label: 'Social Science' },
  { key: 'english-language-and-literature', label: 'English' },
  { key: 'hindi-course-b', label: 'Hindi' },
] as const;

export default function DashboardSubjectStations({ subjectProgress, subjectMeta }: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const displayedSubjects =
    selectedFilter === 'all'
      ? subjectProgress
      : subjectProgress.filter((s) => {
          if (selectedFilter === 'science') return s.slug === 'science';
          if (selectedFilter === 'mathematics-standard') return s.slug.startsWith('math');
          if (selectedFilter === 'social-science') return s.slug === 'social-science';
          if (selectedFilter === 'english-language-and-literature') return s.slug.startsWith('english');
          if (selectedFilter === 'hindi-course-b') return s.slug.startsWith('hindi');
          return s.slug === selectedFilter;
        });

  return (
    <section className={styles.zoneSection} aria-label="My Subjects">
      {/* Header with Title and Filter Pill Bar */}
      <div className={styles.zoneHeaderRow}>
        <div className={styles.zoneTitleBlock}>
          <h2 className={styles.zoneHeading}>My Subjects</h2>
          <span className={styles.zoneBadge}>Class 10 Syllabus</span>
        </div>

        {/* Horizontal Filter Pill Bar */}
        <div className={styles.filterPillBar} role="tablist" aria-label="Filter subjects">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterPill} ${isActive ? styles.filterPillActive : ''}`}
                onClick={() => setSelectedFilter(tab.key)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean 3-Column Subject Cards Grid */}
      <div className={styles.subjectGrid}>
        {displayedSubjects.map((subject) => {
          const fallback = DEFAULT_SUBJECT_META[subject.slug] || {
            Icon: BookOpen,
            accentColor: '#c95014',
            accentBg: '#fff4e8',
            nextChapterTitle: 'Chapter 1',
            nextChapterSlug: subject.slug,
            shortDesc: 'Core Curriculum',
            chapterCountLabel: `${subject.chapterCount} chapters`,
          };
          const override = subjectMeta?.[subject.slug];
          const accentColor = override?.accentColor ?? fallback.accentColor;
          const accentBg = override?.accentBg ?? fallback.accentBg;
          const nextChapterTitle = override?.nextChapterTitle ?? fallback.nextChapterTitle;
          const nextChapterSlug = override?.nextChapterSlug ?? fallback.nextChapterSlug;
          const SubjectIcon = fallback.Icon;

          return (
            <div className={styles.subjectStationCard} key={subject.slug}>
              {/* 1. Subject Icon + Title */}
              <div className={styles.stationTop}>
                <div
                  className={styles.stationIconBox}
                  style={{ color: accentColor, backgroundColor: accentBg }}
                >
                  <SubjectIcon size={18} strokeWidth={2.2} />
                </div>
                <h3 className={styles.stationTitle}>{subject.title}</h3>
              </div>

              {/* 2. Chapters Mastered Count + Percentage */}
              <div className={styles.stationMetricsRow}>
                <span className={styles.stationChaptersCount}>
                  {subject.startedCount}/{subject.chapterCount} Chapters
                </span>
                <span className={styles.stationPctBadge}>
                  {subject.progressPercent}%
                </span>
              </div>

              {/* 3. Thin 6px Progress Bar */}
              <div className={styles.stationThinTrack}>
                <div
                  className={styles.stationThinFill}
                  style={{
                    width: `${Math.max(subject.progressPercent, 4)}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>

              {/* 4. Single Footer Row: Up next + Continue link */}
              <div className={styles.stationFooter}>
                <span className={styles.stationUpNext} title={nextChapterTitle}>
                  Up next: <em>{nextChapterTitle}</em>
                </span>
                <Link
                  href={`/chapters/${nextChapterSlug}`}
                  className={styles.stationContinueLink}
                >
                  <span>Continue</span>
                  <ArrowRight size={13} strokeWidth={2.4} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
