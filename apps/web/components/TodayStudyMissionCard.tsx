'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export type MissionStep = {
  stepNumber: number;
  icon: string;
  title: string;
  description: string;
  duration: string;
  href: string;
  type: 'notes' | 'practice' | 'quiz';
};

export type SubjectMissionConfig = {
  subjectKey: 'science' | 'maths' | 'social-science' | 'english';
  subjectTitle: string;
  subjectCode: string;
  icon: string;
  chapterSlug: string;
  chapterTitle: string;
  chapterNumberText: string;
  boardWeightage: string;
  ncertScope: string;
  estimatedMinutes: number;
  progressPercent?: number;
  steps: MissionStep[];
  primaryCtaText: string;
  notesHref: string;
  quizHref: string;
  catalogHref: string;
};

const DEFAULT_SUBJECT_MISSIONS: Record<string, SubjectMissionConfig> = {
  science: {
    subjectKey: 'science',
    subjectTitle: 'Science',
    subjectCode: '086',
    icon: '🧪',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterTitle: 'Chemical Reactions and Equations',
    chapterNumberText: 'Chapter 1',
    boardWeightage: '8–9 Marks in Board Exam',
    ncertScope: 'NCERT Sections 1.1 to 1.3 (Activities 1.1–1.3)',
    estimatedMinutes: 35,
    progressPercent: 25,
    steps: [
      {
        stepNumber: 1,
        icon: '📖',
        title: 'Simplified NCERT Notes',
        description: 'Chemical equations, balancing, combination, decomposition & redox.',
        duration: '15 min',
        href: '/chapters/chemical-reactions-and-equations/notes',
        type: 'notes',
      },
      {
        stepNumber: 2,
        icon: '🔬',
        title: 'Activity 1.1 & Visual Labs',
        description: 'Magnesium ribbon combustion & lead nitrate color change experiments.',
        duration: '12 min',
        href: '/chapters/chemical-reactions-and-equations/notes#activities',
        type: 'practice',
      },
      {
        stepNumber: 3,
        icon: '⚡',
        title: '5-Question Board Recall Quiz',
        description: 'Test your reaction recall with instant marking scheme feedback.',
        duration: '8 min',
        href: '/chapters/chemical-reactions-and-equations/quiz',
        type: 'quiz',
      },
    ],
    primaryCtaText: 'Resume Chemical Reactions Notes →',
    notesHref: '/chapters/chemical-reactions-and-equations/notes',
    quizHref: '/chapters/chemical-reactions-and-equations/quiz',
    catalogHref: '/subjects/science',
  },
  maths: {
    subjectKey: 'maths',
    subjectTitle: 'Mathematics Standard',
    subjectCode: '041',
    icon: '📐',
    chapterSlug: 'real-numbers',
    chapterTitle: 'Real Numbers',
    chapterNumberText: 'Chapter 1',
    boardWeightage: '6–8 Marks in Board Exam',
    ncertScope: 'NCERT Sections 1.1 to 1.3 (Ex 1.1 & Ex 1.2)',
    estimatedMinutes: 35,
    progressPercent: 20,
    steps: [
      {
        stepNumber: 1,
        icon: '📖',
        title: 'Fundamental Theorem of Arithmetic',
        description: 'Unique prime factorisation theorem, HCF & LCM relationships.',
        duration: '15 min',
        href: '/chapters/real-numbers/notes',
        type: 'notes',
      },
      {
        stepNumber: 2,
        icon: '✍️',
        title: 'Proof of Irrationality Board Drills',
        description: 'Step-by-step proofs for √2, √3, and 5 - √3 using contradiction.',
        duration: '12 min',
        href: '/chapters/real-numbers/notes',
        type: 'practice',
      },
      {
        stepNumber: 3,
        icon: '⚡',
        title: '5-Question Board Recall Quiz',
        description: 'Rapid drill on prime factors, HCF×LCM=a×b, and irrationality.',
        duration: '8 min',
        href: '/chapters/real-numbers/quiz',
        type: 'quiz',
      },
    ],
    primaryCtaText: 'Resume Real Numbers Notes →',
    notesHref: '/chapters/real-numbers/notes',
    quizHref: '/chapters/real-numbers/quiz',
    catalogHref: '/subjects/mathematics-standard',
  },
  'social-science': {
    subjectKey: 'social-science',
    subjectTitle: 'Social Science',
    subjectCode: '087',
    icon: '🌍',
    chapterSlug: 'power-sharing',
    chapterTitle: 'Power Sharing (Democratic Politics)',
    chapterNumberText: 'Civics Ch 1',
    boardWeightage: '5–6 Marks in Board Exam',
    ncertScope: 'NCERT Political Science Chapter 1',
    estimatedMinutes: 30,
    progressPercent: 15,
    steps: [
      {
        stepNumber: 1,
        icon: '📖',
        title: 'Belgium & Sri Lanka Case Studies',
        description: 'Compare ethnic composition and power-sharing mechanisms.',
        duration: '12 min',
        href: '/chapters/power-sharing/notes',
        type: 'notes',
      },
      {
        stepNumber: 2,
        icon: '🧭',
        title: 'Forms of Power Sharing',
        description: 'Horizontal vs Vertical distribution and community governments.',
        duration: '10 min',
        href: '/chapters/power-sharing/notes',
        type: 'practice',
      },
      {
        stepNumber: 3,
        icon: '⚡',
        title: '5-Question Board Recall Quiz',
        description: 'Targeted assertion-reasoning and multiple-choice questions.',
        duration: '8 min',
        href: '/chapters/power-sharing/quiz',
        type: 'quiz',
      },
    ],
    primaryCtaText: 'Resume Power Sharing Notes →',
    notesHref: '/chapters/power-sharing/notes',
    quizHref: '/chapters/power-sharing/quiz',
    catalogHref: '/subjects/social-science',
  },
  english: {
    subjectKey: 'english',
    subjectTitle: 'English Language & Lit',
    subjectCode: '184',
    icon: '📚',
    chapterSlug: 'a-letter-to-god',
    chapterTitle: 'A Letter to God (First Flight)',
    chapterNumberText: 'Prose Ch 1',
    boardWeightage: '5–6 Marks in Board Exam',
    ncertScope: 'NCERT First Flight Chapter 1',
    estimatedMinutes: 25,
    progressPercent: 10,
    steps: [
      {
        stepNumber: 1,
        icon: '📖',
        title: 'Story Summary & Core Themes',
        description: 'Lencho’s unshakable faith, the hailstorm, and irony of postmaster.',
        duration: '10 min',
        href: '/chapters/a-letter-to-god/notes',
        type: 'notes',
      },
      {
        stepNumber: 2,
        icon: '✍️',
        title: 'Character Sketches & PYQ Extracts',
        description: 'High-frequency 3-mark and 6-mark CBSE board exam questions.',
        duration: '8 min',
        href: '/chapters/a-letter-to-god/notes',
        type: 'practice',
      },
      {
        stepNumber: 3,
        icon: '⚡',
        title: '5-Question Board Recall Quiz',
        description: 'Extract-based comprehension and vocabulary recall test.',
        duration: '7 min',
        href: '/chapters/a-letter-to-god/quiz',
        type: 'quiz',
      },
    ],
    primaryCtaText: 'Resume A Letter to God Notes →',
    notesHref: '/chapters/a-letter-to-god/notes',
    quizHref: '/chapters/a-letter-to-god/quiz',
    catalogHref: '/subjects/english-language-and-literature',
  },
};

export type TodayStudyMissionCardProps = {
  studentName?: string | null;
  activeSubjectKey?: 'science' | 'maths' | 'social-science' | 'english';
  missionsOverride?: Partial<Record<string, SubjectMissionConfig>>;
};

export default function TodayStudyMissionCard({
  studentName,
  activeSubjectKey = 'science',
  missionsOverride = {},
}: TodayStudyMissionCardProps) {
  const [selectedSubject, setSelectedSubject] = useState<
    'science' | 'maths' | 'social-science' | 'english'
  >(activeSubjectKey);

  const missions = {
    ...DEFAULT_SUBJECT_MISSIONS,
    ...missionsOverride,
  };

  const currentMission = missions[selectedSubject] ?? DEFAULT_SUBJECT_MISSIONS.science;
  const firstName = studentName?.split(/\s+/)[0] || 'Student';

  return (
    <section className="mission-card-wrapper" aria-label="Today's Board Study Mission">
      {/* Top Header Strip */}
      <div className="mission-top-header">
        <div className="mission-badge-group">
          <span className="badge-today">⚡ Today's Board Study Mission</span>
          <span className="badge-duration">⏱️ ~{currentMission.estimatedMinutes} Mins Focused Sprint</span>
        </div>

        {/* 4 Core Subject Switcher Pills */}
        <div className="subject-pills-bar" role="tablist" aria-label="Select Subject Mission">
          {(
            [
              { key: 'science', label: 'Science', icon: '🧪' },
              { key: 'maths', label: 'Maths', icon: '📐' },
              { key: 'social-science', label: 'SST', icon: '🌍' },
              { key: 'english', label: 'English', icon: '📚' },
            ] as const
          ).map((item) => {
            const isActive = selectedSubject === item.key;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedSubject(item.key)}
                className={`subject-pill-btn ${isActive ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mission Body */}
      <div className="mission-body">
        <div className="mission-headline">
          <div className="mission-meta-tags">
            <span className="meta-subject-code">
              Code {currentMission.subjectCode} · {currentMission.chapterNumberText}
            </span>
            <span className="meta-weightage">🎯 {currentMission.boardWeightage}</span>
            <span className="meta-ncert">{currentMission.ncertScope}</span>
          </div>

          <h2 className="mission-title">
            {currentMission.icon} {currentMission.chapterTitle}
          </h2>
          <p className="mission-subtitle">
            Follow the 3-step NCERT board mastery sequence below to lock in full marks for this unit.
          </p>
        </div>

        {/* 3-Step NCERT Roadmap Grid */}
        <div className="steps-container">
          {currentMission.steps.map((step) => (
            <Link
              key={step.stepNumber}
              href={step.href}
              className={`step-item-card step-type-${step.type}`}
            >
              <div className="step-badge-row">
                <span className="step-counter">Step {step.stepNumber}</span>
                <span className="step-time">⏱️ {step.duration}</span>
              </div>
              <div className="step-title-wrap">
                <span className="step-icon">{step.icon}</span>
                <strong className="step-title">{step.title}</strong>
              </div>
              <p className="step-desc">{step.description}</p>
              <span className="step-action-hint">Start {step.type === 'quiz' ? 'Quiz' : 'Reading'} →</span>
            </Link>
          ))}
        </div>

        {/* Action Bar */}
        <div className="mission-action-bar">
          <div className="action-buttons-group">
            <Link href={currentMission.notesHref} className="btn-primary-resume">
              ▶ {currentMission.primaryCtaText}
            </Link>
            <Link href={currentMission.quizHref} className="btn-secondary-quiz">
              ⚡ 5-Min Board Quiz →
            </Link>
          </div>

          <Link href={currentMission.catalogHref} className="link-browse-all">
            View all {currentMission.subjectTitle} chapters &amp; syllabus blueprint →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .mission-card-wrapper {
          background: #ffffff;
          border: 2.5px solid #171513;
          border-radius: 20px;
          padding: 1.6rem 1.85rem;
          box-shadow: 6px 6px 0 #171513;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          position: relative;
        }

        .mission-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1.5px solid #f1ede4;
          padding-bottom: 1rem;
        }

        .mission-badge-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .badge-today {
          background: #c95014;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 900;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-duration {
          background: #fbf7ee;
          color: #787168;
          border: 1px solid #e7e2d6;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
        }

        .subject-pills-bar {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #f6f3eb;
          padding: 0.25rem;
          border-radius: 12px;
          border: 1.5px solid #e2ddd4;
        }

        .subject-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          background: transparent;
          color: #55514b;
          font-size: 0.8125rem;
          font-weight: 800;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .subject-pill-btn:hover {
          background: rgba(255, 255, 255, 0.7);
          color: #171513;
        }

        .subject-pill-btn.active {
          background: #171513;
          color: #ffffff;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
        }

        .mission-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .mission-headline {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mission-meta-tags {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .meta-subject-code {
          color: #c95014;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .meta-weightage {
          color: #0b7a48;
          background: #eef8f3;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #c2e7d3;
        }

        .meta-ncert {
          color: #787168;
        }

        .mission-title {
          font-size: 1.65rem;
          font-weight: 900;
          color: #171513;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .mission-subtitle {
          font-size: 0.875rem;
          color: #5d5750;
          margin: 0;
          line-height: 1.45;
        }

        .steps-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        @media (max-width: 860px) {
          .steps-container {
            grid-template-columns: 1fr;
          }
        }

        .step-item-card {
          background: #fffdfa;
          border: 1.5px solid #e7e2d6;
          border-radius: 14px;
          padding: 1rem 1.15rem;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .step-item-card:hover {
          transform: translateY(-2px);
          border-color: #171513;
          box-shadow: 3px 3px 0 #171513;
        }

        .step-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 800;
        }

        .step-counter {
          color: #c95014;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .step-time {
          color: #8c827a;
        }

        .step-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .step-icon {
          font-size: 1.1rem;
        }

        .step-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #171513;
          line-height: 1.3;
        }

        .step-desc {
          font-size: 0.78rem;
          color: #6a645d;
          line-height: 1.4;
          margin: 0;
          flex: 1;
        }

        .step-action-hint {
          font-size: 0.75rem;
          font-weight: 800;
          color: #c95014;
          margin-top: 0.25rem;
        }

        .mission-action-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          padding-top: 0.5rem;
          border-top: 1.5px solid #f1ede4;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-primary-resume {
          background: #171513;
          color: #ffffff;
          padding: 0.75rem 1.4rem;
          border-radius: 12px;
          font-size: 0.925rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.25);
          transition: transform 0.12s ease, background 0.12s ease;
        }

        .btn-primary-resume:hover {
          background: #c95014;
          transform: translateY(-1px);
        }

        .btn-secondary-quiz {
          background: #ffffff;
          color: #171513;
          border: 1.5px solid #171513;
          padding: 0.7rem 1.15rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.12s ease;
        }

        .btn-secondary-quiz:hover {
          background: #fbf7ee;
        }

        .link-browse-all {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #787168;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .link-browse-all:hover {
          color: #171513;
        }

        @media (max-width: 600px) {
          .mission-card-wrapper {
            padding: 1.25rem;
          }

          .mission-title {
            font-size: 1.35rem;
          }

          .action-buttons-group {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }

          .btn-primary-resume,
          .btn-secondary-quiz {
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
