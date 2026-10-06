'use client';

import React from 'react';
import Link from 'next/link';

export type BoardReadinessGaugeProps = {
  scorePercent: number;
  quizScorePercent: number;
  mockScorePercent: number | null;
  chaptersCompleted: number;
  totalChapters: number;
  streakDays: number;
  isNewStudent?: boolean;
  deckMode?: boolean;
};

export default function BoardReadinessGauge({
  scorePercent,
  quizScorePercent,
  mockScorePercent,
  chaptersCompleted,
  totalChapters,
  streakDays,
  isNewStudent,
  deckMode = false,
}: BoardReadinessGaugeProps) {
  const isBrandNew = isNewStudent || (quizScorePercent === 0 && chaptersCompleted === 0 && mockScorePercent === null);

  // Determine performance tier
  let tierLabel = isBrandNew ? 'Day 1 Starter 🎯' : 'Getting Started';
  let tierBadgeClass = 'badge-learner';
  let tierDescription = isBrandNew
    ? 'Take your first 3-minute quiz below to calibrate your CBSE Board readiness index.'
    : 'Start exploring chapter notes and quizzes to build exam readiness.';
  let gaugeColor = isBrandNew ? '#f97316' : '#3b82f6'; // Orange / Blue

  if (!isBrandNew) {
    if (scorePercent >= 90) {
      tierLabel = 'Topper Track 🏆';
      tierBadgeClass = 'badge-topper';
      tierDescription = 'Outstanding mastery! You are performing in the top 5% board percentile.';
      gaugeColor = '#10b981'; // Emerald
    } else if (scorePercent >= 70) {
      tierLabel = 'Exam Ready 🎯';
      tierBadgeClass = 'badge-ready';
      tierDescription = 'Strong board preparation. Consistent mock tests will push you to 90%+.';
      gaugeColor = '#059669'; // Green
    } else if (scorePercent >= 40) {
      tierLabel = 'Skilled Learner 🚀';
      tierBadgeClass = 'badge-skilled';
      tierDescription = 'Good foundation. Review your weak chapters and take Mock Paper 1.';
      gaugeColor = '#f59e0b'; // Amber
    }
  }

  // SVG Gauge calculation
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(5, scorePercent)) / 100) * circumference;

  return (
    <div className={`readiness-banner ${deckMode ? 'deck-mode' : ''}`}>
      {deckMode ? (
        <>
          <div className="deck-top-row">
            <div className="gauge-visual-wrap">
              <div className="gauge-svg-container">
                <svg width="110" height="110" viewBox="0 0 130 130" className="gauge-svg">
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className="gauge-bg-ring"
                    strokeWidth="10"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    className="gauge-progress-ring"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    stroke={gaugeColor}
                    strokeLinecap="round"
                    transform="rotate(-90 65 65)"
                  />
                </svg>
                <div className="gauge-center-text">
                  <span className="score-number" style={{ fontSize: '1.85rem' }}>{isBrandNew ? 'Day 1' : `${Math.round(scorePercent)}%`}</span>
                  <span className="score-subtext">{isBrandNew ? 'Starter' : 'Readiness'}</span>
                </div>
              </div>
            </div>

            <div className="readiness-details">
              <div className="readiness-topline">
                <span className="assessment-eyebrow">Board Exam Readiness</span>
                <span className={`tier-badge ${tierBadgeClass}`}>{tierLabel}</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 0.25rem 0' }}>Class 10 CBSE Readiness Index</h2>
              <p className="tier-desc" style={{ margin: 0, fontSize: '0.8125rem' }}>{tierDescription}</p>
            </div>
          </div>

          {/* 4 Pillar Micro-Stats in 2x2 Grid */}
          <div className="pillars-grid">
            <div className="pillar-item">
              <span className="pillar-label">Quiz Mastery</span>
              <strong className="pillar-value">{quizScorePercent > 0 ? `${Math.round(quizScorePercent)}%` : 'Not Started'}</strong>
              <span className="pillar-hint">NCERT Questions</span>
            </div>

            <div className="pillar-item">
              <span className="pillar-label">Mock Exam Avg</span>
              <strong className="pillar-value">
                {mockScorePercent !== null ? `${Math.round(mockScorePercent)}%` : 'Paper 1 Free'}
              </strong>
              <span className="pillar-hint">80-Mark Papers</span>
            </div>

            <div className="pillar-item">
              <span className="pillar-label">Syllabus Covered</span>
              <strong className="pillar-value">
                {chaptersCompleted} <small>/ {totalChapters}</small>
              </strong>
              <span className="pillar-hint">Core Chapters</span>
            </div>

            <div className="pillar-item">
              <span className="pillar-label">Study Streak</span>
              <strong className="pillar-value">{streakDays} Day{streakDays === 1 ? '' : 's'} 🔥</strong>
              <span className="pillar-hint">Consistency</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Left side: Circular Gauge */}
          <div className="gauge-visual-wrap">
            <div className="gauge-svg-container">
              <svg width="130" height="130" viewBox="0 0 130 130" className="gauge-svg">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="gauge-bg-ring"
                  strokeWidth="10"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  className="gauge-progress-ring"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  stroke={gaugeColor}
                  strokeLinecap="round"
                  transform="rotate(-90 65 65)"
                />
              </svg>
              <div className="gauge-center-text">
                <span className="score-number">{isBrandNew ? 'Day 1' : `${Math.round(scorePercent)}%`}</span>
                <span className="score-subtext">{isBrandNew ? 'Starter' : 'Readiness'}</span>
              </div>
            </div>
          </div>

          {/* Middle side: Main Assessment & Diagnosis */}
          <div className="readiness-details">
            <div className="readiness-topline">
              <span className="assessment-eyebrow">Real-Time Board Exam Readiness</span>
              <span className={`tier-badge ${tierBadgeClass}`}>{tierLabel}</span>
            </div>
            <h2>Class 10 CBSE Board Readiness Index</h2>
            <p className="tier-desc">{tierDescription}</p>

            {/* 3 Pillar Micro-Stats */}
            <div className="pillars-grid">
              <div className="pillar-item">
                <span className="pillar-label">Quiz Mastery</span>
                <strong className="pillar-value">{quizScorePercent > 0 ? `${Math.round(quizScorePercent)}%` : 'Not Started'}</strong>
                <span className="pillar-hint">NCERT Questions</span>
              </div>

              <div className="pillar-item">
                <span className="pillar-label">Mock Exam Avg</span>
                <strong className="pillar-value">
                  {mockScorePercent !== null ? `${Math.round(mockScorePercent)}%` : 'Paper 1 Free'}
                </strong>
                <span className="pillar-hint">80-Mark Board Papers</span>
              </div>

              <div className="pillar-item">
                <span className="pillar-label">Syllabus Covered</span>
                <strong className="pillar-value">
                  {chaptersCompleted} <small>/ {totalChapters}</small>
                </strong>
                <span className="pillar-hint">Core Chapters</span>
              </div>

              <div className="pillar-item">
                <span className="pillar-label">Study Streak</span>
                <strong className="pillar-value">{streakDays} Day{streakDays === 1 ? '' : 's'} 🔥</strong>
                <span className="pillar-hint">Active Consistency</span>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .readiness-banner {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 20px;
          padding: 1.75rem 2rem;
          box-shadow: 6px 6px 0 #171513;
          display: flex;
          align-items: center;
          gap: 2.25rem;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .readiness-banner.deck-mode {
          margin-bottom: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: space-between;
          padding: 1.5rem 1.6rem;
          gap: 1.25rem;
        }

        .deck-top-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .readiness-banner.deck-mode .pillars-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .gauge-visual-wrap {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg-container {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          width: 100%;
          height: 100%;
        }

        .gauge-bg-ring {
          fill: none;
          stroke: #f1ede4;
        }

        .gauge-progress-ring {
          fill: none;
          transition: stroke-dashoffset 0.8s ease-in-out;
        }

        .gauge-center-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .score-number {
          font-family: 'Bangers', 'Impact', sans-serif;
          font-size: 2.25rem;
          line-height: 1;
          color: #171513;
          letter-spacing: 0.5px;
        }

        .score-subtext {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #787168;
          margin-top: 2px;
        }

        .readiness-details {
          flex: 1;
        }

        .readiness-topline {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }

        .assessment-eyebrow {
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c25e00;
        }

        .tier-badge {
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          border: 1.5px solid #171513;
        }

        .badge-topper {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-ready {
          background: #dcfce7;
          color: #166534;
        }

        .badge-skilled {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-learner {
          background: #e0f2fe;
          color: #075985;
        }

        h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.35rem 0;
          letter-spacing: -0.01em;
        }

        .tier-desc {
          font-size: 0.875rem;
          color: #5d5750;
          line-height: 1.45;
          margin: 0 0 1.25rem 0;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          background: #fbf8f3;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.875rem 1rem;
        }

        .pillar-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .pillar-label {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #787168;
        }

        .pillar-value {
          font-size: 1.15rem;
          font-weight: 800;
          color: #171513;
        }

        .pillar-value small {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #8c827a;
        }

        .pillar-hint {
          font-size: 0.6875rem;
          color: #8c827a;
        }

        @media (max-width: 860px) {
          .readiness-banner {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
            gap: 1.5rem;
          }

          .readiness-topline {
            justify-content: center;
          }

          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
