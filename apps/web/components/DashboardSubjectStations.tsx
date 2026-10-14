'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
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
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  accentColor: string;
  accentBg: string;
  nextChapterTitle: string;
  nextChapterSlug: string;
  shortDesc: string;
  chapterCountLabel: string;
};

type Props = {
  subjectProgress: SubjectProgressItem[];
  subjectMeta: Record<string, SubjectMetaItem>;
};

export default function DashboardSubjectStations({ subjectProgress, subjectMeta }: Props) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const displayedSubjects =
    selectedSubject === 'all'
      ? subjectProgress
      : subjectProgress.filter((s) => s.slug === selectedSubject);

  return (
    <section aria-label="Core subjects">
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitleRow}>
          <div className={styles.sectionIconBox}>
            <BookOpen size={16} strokeWidth={2.2} color="#c95014" />
          </div>
          <h2 className={styles.sectionTitle}>Core Subject Stations</h2>
          <span className={styles.sectionBadge}>4 Board Subjects</span>
        </div>
        <Link className={styles.sectionLink} href="/subjects">
          <span>All Subjects Syllabus</span>
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

      {/* Subject Filter Pills (Progressive Disclosure) */}
      <div className={styles.subjectFilterRow} role="tablist" aria-label="Filter subject stations">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSubject === 'all'}
          className={`${styles.subjectFilterPill} ${
            selectedSubject === 'all' ? styles.subjectFilterPillActive : ''
          }`}
          onClick={() => setSelectedSubject('all')}
        >
          All 4 Subjects
        </button>
        {subjectProgress.map((sub) => {
          const isActive = selectedSubject === sub.slug;
          const shortName =
            sub.slug === 'science'
              ? 'Science'
              : sub.slug === 'mathematics-standard'
                ? 'Maths'
                : sub.slug === 'social-science'
                  ? 'Social Science'
                  : 'English';

          return (
            <button
              key={sub.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.subjectFilterPill} ${
                isActive ? styles.subjectFilterPillActive : ''
              }`}
              onClick={() => setSelectedSubject(sub.slug)}
            >
              {shortName}
            </button>
          );
        })}
      </div>

      <div
        className={
          selectedSubject === 'all' ? styles.subjectGrid : styles.subjectGridSingle
        }
      >
        {displayedSubjects.map((subject) => {
          const meta = subjectMeta[subject.slug] || {
            Icon: BookOpen,
            accentColor: '#c95014',
            accentBg: '#fff4e8',
            nextChapterTitle: 'Chapter 1',
            nextChapterSlug: subject.slug,
            shortDesc: 'Core Curriculum',
            chapterCountLabel: `${subject.chapterCount} chapters`,
          };
          const SubjectIcon = meta.Icon;

          return (
            <div
              className={styles.subjectCard}
              key={subject.slug}
              style={{ borderTopColor: meta.accentColor }}
            >
              <div className={styles.subjectCardTop}>
                <div className={styles.subjectInfoBlock}>
                  <div
                    className={styles.subjectIconBox}
                    style={{ backgroundColor: meta.accentBg, color: meta.accentColor }}
                  >
                    <SubjectIcon size={20} strokeWidth={2.2} />
                  </div>
                  <div className={styles.subjectTitleGroup}>
                    <span className={styles.subjectCodeTag}>
                      Code {subject.subjectCode} · NCERT
                    </span>
                    <h3 className={styles.subjectTitle}>{subject.title}</h3>
                  </div>
                </div>
                <span
                  className={styles.subjectMasteryPill}
                  style={{
                    borderColor: subject.progressPercent > 0 ? meta.accentColor : '#e7e2d6',
                    color: subject.progressPercent > 0 ? meta.accentColor : '#6a645d',
                    backgroundColor: subject.progressPercent > 0 ? meta.accentBg : '#fffdf8',
                  }}
                >
                  {subject.progressPercent}% Mastered
                </span>
              </div>

              <div className={styles.subjectProgressSection}>
                <div className={styles.subjectProgressBar}>
                  <div
                    className={styles.subjectProgressFill}
                    style={{
                      width: `${Math.max(subject.progressPercent, 4)}%`,
                      backgroundColor: meta.accentColor,
                    }}
                  />
                </div>
                <div className={styles.subjectProgressDetails}>
                  <span>
                    {subject.startedCount > 0
                      ? `${subject.startedCount} of ${subject.chapterCount} chapters underway`
                      : meta.chapterCountLabel}
                  </span>
                </div>
              </div>

              {/* Chapter Spotlight */}
              <div className={styles.chapterSpotlight}>
                <div className={styles.spotlightHeader}>
                  <span
                    className={styles.spotlightDot}
                    style={{ backgroundColor: meta.accentColor }}
                  />
                  <span className={styles.spotlightTag}>
                    {subject.startedCount > 0 ? 'CURRENT TOPIC' : 'UP NEXT IN SYLLABUS'}
                  </span>
                </div>
                <div className={styles.spotlightTitle}>{meta.nextChapterTitle}</div>
              </div>

              {/* Clean Action Row */}
              <div className={styles.subjectActionRow}>
                <Link
                  className={styles.subjectPrimaryBtn}
                  href={`/chapters/${meta.nextChapterSlug}`}
                >
                  <span>{subject.startedCount > 0 ? 'Continue' : 'Start Chapter 1'}</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
                <Link
                  className={styles.subjectSyllabusLink}
                  href={`/subjects/${subject.slug}`}
                >
                  <span>All {subject.chapterCount} chapters</span>
                  <ArrowRight size={12} strokeWidth={2} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
