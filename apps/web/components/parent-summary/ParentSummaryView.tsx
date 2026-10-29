'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Printer,
  Share2,
  Sparkles,
} from 'lucide-react';

import type { ParentSummaryModel } from '../../lib/parent-summary';
import styles from './parent-summary.module.css';

export default function ParentSummaryView({ model }: { model: ParentSummaryModel }) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsappHref = `https://api.whatsapp.com/send?text=${model.whatsappShareText}`;

  return (
    <div className={styles.container}>
      {/* 1. Header Bar with Actions */}
      <header className={styles.headerBar}>
        <div className={styles.titleArea}>
          <span className={styles.badgePill}>
            <Calendar size={13} strokeWidth={2.4} />
            <span>Class {model.classLevel} CBSE Board Prep</span>
          </span>
          <h1 className={styles.mainHeading}>
            {model.studentName}&apos;s Weekly Progress
          </h1>
          <p className={styles.subHeading}>
            A calm, textbook-accurate overview of study consistency, completed topics, and exam readiness.
          </p>
        </div>

        <div className={styles.actionButtonGroup}>
          <a
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            title="Share summary with family on WhatsApp"
          >
            <Share2 size={16} strokeWidth={2.4} />
            <span>Share on WhatsApp</span>
          </a>

          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
            onClick={handlePrint}
            title="Print or save as PDF report"
          >
            <Printer size={16} strokeWidth={2.4} />
            <span>Print Report</span>
          </button>
        </div>
      </header>

      {/* 2. Reassurance & Consistency Banner */}
      <section className={styles.statusBanner} aria-label="Consistency status">
        <h2 className={styles.statusHeadline}>{model.consistencyHeadline}</h2>
        <p className={styles.statusSub}>{model.consistencySub}</p>
      </section>

      {/* 3. Key Metrics Grid */}
      <section className={styles.statsGrid} aria-label="Progress at a glance">
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Daily Habit</span>
          <strong className={styles.statValue}>
            {model.streakDays > 0 ? `🔥 ${model.streakDays} Days` : 'Day 1'}
          </strong>
          <span className={styles.statNote}>Consistent daily study streak</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Syllabus Started</span>
          <strong className={styles.statValue}>
            {model.stats.startedChapters} / {model.stats.totalChapters}
          </strong>
          <span className={styles.statNote}>{model.stats.coveragePercent}% of Class 10 topics</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Quiz Accuracy</span>
          <strong className={styles.statValue}>
            {model.stats.quizAccuracy !== null ? `${model.stats.quizAccuracy}%` : '—'}
          </strong>
          <span className={styles.statNote}>
            {model.stats.quizzesTaken > 0
              ? `Across ${model.stats.quizzesTaken} chapter quizzes`
              : 'First quiz coming up'}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Board Readiness</span>
          <strong className={styles.statValue} style={{ color: '#bd4f10' }}>
            {model.readinessLabel}
          </strong>
          <span className={styles.statNote}>~{model.daysToExams} days to CBSE Boards</span>
        </div>
      </section>

      {/* 4. Subject-wise Progress */}
      <section className={styles.sectionCard} aria-labelledby="subjects-progress-heading">
        <div className={styles.sectionHeader}>
          <h2 id="subjects-progress-heading" className={styles.sectionTitle}>
            Subject Progress
          </h2>
          <span className={styles.sectionSub}>All 5 core board subjects</span>
        </div>

        <div className={styles.subjectList}>
          {model.subjectBreakdown.map((subj) => (
            <div key={subj.slug} className={styles.subjectRow}>
              <div className={styles.subjectRowTop}>
                <span className={styles.subjectName}>{subj.title}</span>
                <span className={styles.subjectMetrics}>
                  {subj.startedCount} of {subj.chapterCount} chapters ({subj.progressPercent}%)
                </span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.max(subj.progressPercent, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recent Activity (Accomplishments) */}
      <section className={styles.sectionCard} aria-labelledby="recent-activity-heading">
        <div className={styles.sectionHeader}>
          <h2 id="recent-activity-heading" className={styles.sectionTitle}>
            Recent Completed Work
          </h2>
          <span className={styles.sectionSub}>Chapters studied and quizzes taken</span>
        </div>

        {model.recentActivity.length > 0 ? (
          <div className={styles.activityList}>
            {model.recentActivity.map((item) => (
              <div key={item.chapterSlug} className={styles.activityItem}>
                <div className={styles.activityItemLeft}>
                  <strong className={styles.activityTitle}>{item.chapterTitle}</strong>
                  <span className={styles.activitySubject}>{item.subjectName}</span>
                </div>
                <div className={styles.activityItemRight}>
                  {item.bestQuizScorePercent > 0 ? (
                    <span className={styles.scoreBadge}>
                      {item.bestQuizScorePercent}% Quiz Score
                    </span>
                  ) : null}
                  <span className={styles.timeLabel}>{item.relativeTime}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: '#7a7164', fontSize: '0.92rem' }}>
            {model.firstName} is beginning their first chapter. Recent lessons and quiz results will show here automatically.
          </p>
        )}
      </section>

      {/* 6. Areas Needing Support (Gentle Parental Framing) */}
      {model.areasNeedingSupport.length > 0 ? (
        <section className={styles.sectionCard} aria-labelledby="support-areas-heading">
          <div className={styles.sectionHeader}>
            <h2 id="support-areas-heading" className={styles.sectionTitle}>
              Topics Where {model.firstName} Needs Encouragement
            </h2>
            <span className={styles.sectionSub}>Questions missed or tricky concepts</span>
          </div>

          <div className={styles.weakList}>
            {model.areasNeedingSupport.map((item) => (
              <div key={item.chapterSlug} className={styles.weakItem}>
                <div className={styles.weakIcon} aria-hidden="true">
                  <AlertCircle size={18} strokeWidth={2.4} />
                </div>
                <div className={styles.weakContent}>
                  <strong className={styles.weakTitle}>
                    {item.chapterTitle} ({item.subjectName})
                  </strong>
                  <span className={styles.weakReason}>{item.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 7. Practical Guidance for Parents */}
      <section className={styles.sectionCard} aria-labelledby="guidance-heading">
        <div className={styles.sectionHeader}>
          <h2 id="guidance-heading" className={styles.sectionTitle}>
            Practical Tips for Supporting {model.firstName}
          </h2>
          <span className={styles.sectionSub}>3 research-backed guidelines for Class 10 parents</span>
        </div>

        <div className={styles.tipsGrid}>
          {model.guidanceTips.map((tip, idx) => (
            <div key={idx} className={styles.tipCard}>
              <strong className={styles.tipTitle}>{tip.title}</strong>
              <p className={styles.tipBody}>{tip.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Return to Dashboard Link */}
      <div className={styles.backStrip}>
        <Link className={styles.backLink} href="/dashboard">
          <ArrowLeft size={16} strokeWidth={2.5} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span>Back to Student Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
