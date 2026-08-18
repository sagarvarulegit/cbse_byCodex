'use client';

import React from 'react';
import Link from 'next/link';

export type DiagnosticItem = {
  chapterSlug: string;
  chapterTitle: string;
  subjectName: string;
  issueReason: string;
  remedialHref: string;
  priority: 'high' | 'medium';
};

export type WeakAreaDiagnosticsCardProps = {
  diagnostics: DiagnosticItem[];
  pendingMistakesCount: number;
  latestMockScore?: {
    earned: number;
    total: number;
    paperTitle: string;
  } | null;
};

export default function WeakAreaDiagnosticsCard({
  diagnostics,
  pendingMistakesCount,
  latestMockScore,
}: WeakAreaDiagnosticsCardProps) {
  return (
    <section className="diagnostics-section" aria-label="Performance Insights & Weak Area Diagnostics">
      <div className="section-header">
        <div className="section-title-wrap">
          <p className="eyebrow">Targeted Performance Diagnostics</p>
          <h2>Weak Areas &amp; Remedial Action Plan</h2>
        </div>
        <Link href="/my-mistakes" className="header-action-link">
          Open Mistake Vault →
        </Link>
      </div>

      <div className="diagnostics-grid">
        {/* Card 1: Weak Chapter Radar & Instant Review Actions */}
        <div className="diagnostic-card primary-radar">
          <div className="card-topline">
            <span className="card-tag">⚠️ Needs Attention</span>
            <span className="accuracy-label">Diagnostic Tracker</span>
          </div>
          <h3>Struggling Concepts &amp; Chapter Gaps</h3>
          <p className="card-subtext">
            Based on your recent quizzes and 80-mark mock paper results, these topics had the highest error rate:
          </p>

          {diagnostics.length > 0 ? (
            <div className="weak-items-list">
              {diagnostics.slice(0, 3).map((item) => (
                <div className="weak-item-row" key={item.chapterSlug}>
                  <div className="weak-item-info">
                    <div className="subject-tag-row">
                      <span className="subject-pill">{item.subjectName}</span>
                      {item.priority === 'high' && (
                        <span className="priority-pill">High Priority</span>
                      )}
                    </div>
                    <strong>{item.chapterTitle}</strong>
                    <span className="issue-text">{item.issueReason}</span>
                  </div>
                  <Link href={item.remedialHref} className="recap-btn">
                    🚀 5-Min Recap →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="all-clear-state">
              <span className="all-clear-icon">🎉</span>
              <div>
                <strong>No Major Chapter Weaknesses Detected!</strong>
                <p>You have maintained solid accuracy across recent topics. Take a new Board Mock Paper to test your full exam readiness.</p>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Spaced Repetition Mistake Vault & Latest Mock Score */}
        <div className="diagnostic-card secondary-tools">
          {/* Top Sub-Card: Mistake Vault */}
          <div className="vault-subcard">
            <div className="vault-header">
              <span className="vault-icon">🎯</span>
              <div>
                <h4>Spaced Repetition Mistake Vault</h4>
                <p>Review missed marking points &amp; quiz errors after 3 days.</p>
              </div>
            </div>

            <div className="vault-status-box">
              <div className="vault-count-badge">
                <strong>{pendingMistakesCount}</strong>
                <span>Items Due</span>
              </div>
              <div className="vault-copy">
                {pendingMistakesCount > 0 ? (
                  <p>You have <strong>{pendingMistakesCount} mistake{pendingMistakesCount === 1 ? '' : 's'}</strong> ready for memory reinforcement.</p>
                ) : (
                  <p>All recorded mistakes are up to date! New mistakes in quizzes automatically queue here.</p>
                )}
                <Link href="/my-mistakes" className="btn-vault-action">
                  Practice Mistakes →
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Sub-Card: Board Mock Test Simulator */}
          <div className="mock-subcard">
            <div className="mock-header">
              <span className="mock-icon">📄</span>
              <div>
                <h4>Official Board Mock Simulator</h4>
                <p>Full 80-mark, 3-hour CBSE board simulation with instant score diagnostics.</p>
              </div>
            </div>

            {latestMockScore ? (
              <div className="latest-mock-summary">
                <div className="mock-score-pill">
                  <span>Last Score:</span> <strong>{latestMockScore.earned} / {latestMockScore.total}</strong>
                </div>
                <span className="mock-paper-name">{latestMockScore.paperTitle}</span>
              </div>
            ) : (
              <div className="free-sample-notice">
                <span>🎁 <strong>Mock Paper 1 is Free</strong> across all 4 subjects</span>
              </div>
            )}

            <Link href="/exam-papers" className="btn-take-mock">
              Launch Mock Test Series →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .diagnostics-section {
          margin-bottom: 2.75rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.25rem;
        }

        .eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c25e00;
          margin: 0 0 0.25rem 0;
        }

        h2 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #171513;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .header-action-link {
          font-size: 0.875rem;
          font-weight: 800;
          color: #c25e00;
          text-decoration: none;
        }

        .header-action-link:hover {
          text-decoration: underline;
        }

        .diagnostics-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.5rem;
        }

        .diagnostic-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: 4px 4px 0 #171513;
        }

        .primary-radar {
          display: flex;
          flex-direction: column;
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .card-tag {
          font-size: 0.6875rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #fee2e2;
          color: #991b1b;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #fca5a5;
        }

        .accuracy-label {
          font-size: 0.75rem;
          color: #787168;
          font-weight: 700;
        }

        .diagnostic-card h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.35rem 0;
        }

        .card-subtext {
          font-size: 0.85rem;
          color: #5d5750;
          line-height: 1.45;
          margin: 0 0 1.25rem 0;
        }

        .weak-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          flex: 1;
        }

        .weak-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          background: #fbf8f3;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          transition: border-color 0.15s, transform 0.15s;
        }

        .weak-item-row:hover {
          border-color: #c25e00;
          transform: translateY(-1px);
        }

        .weak-item-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .subject-tag-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .subject-pill {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #5d5750;
        }

        .priority-pill {
          font-size: 0.625rem;
          font-weight: 800;
          text-transform: uppercase;
          background: #fef2f2;
          color: #b91c1c;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .weak-item-info strong {
          font-size: 0.9375rem;
          color: #171513;
        }

        .issue-text {
          font-size: 0.75rem;
          color: #787168;
        }

        .recap-btn {
          font-size: 0.8125rem;
          font-weight: 800;
          color: #ffffff;
          background: #171513;
          padding: 0.5rem 0.875rem;
          border-radius: 8px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s;
        }

        .recap-btn:hover {
          background: #c25e00;
        }

        .all-clear-state {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #effaf3;
          border: 1.5px solid #bbf7d0;
          border-radius: 12px;
          padding: 1.25rem;
        }

        .all-clear-icon {
          font-size: 2rem;
        }

        .all-clear-state strong {
          font-size: 0.9375rem;
          color: #166534;
          display: block;
          margin-bottom: 0.25rem;
        }

        .all-clear-state p {
          font-size: 0.8125rem;
          color: #15803d;
          line-height: 1.4;
          margin: 0;
        }

        .secondary-tools {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #faf8f5;
        }

        .vault-subcard,
        .mock-subcard {
          background: #ffffff;
          border: 1.5px solid #e7e2d6;
          border-radius: 14px;
          padding: 1.15rem;
        }

        .vault-header,
        .mock-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .vault-icon,
        .mock-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .vault-header h4,
        .mock-header h4 {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.15rem 0;
        }

        .vault-header p,
        .mock-header p {
          font-size: 0.75rem;
          color: #787168;
          margin: 0;
          line-height: 1.35;
        }

        .vault-status-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fdfaf3;
          border: 1px solid #f2e9d2;
          border-radius: 10px;
          padding: 0.75rem;
        }

        .vault-count-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #171513;
          color: #ffffff;
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          min-width: 52px;
        }

        .vault-count-badge strong {
          font-size: 1.25rem;
          line-height: 1;
        }

        .vault-count-badge span {
          font-size: 0.5625rem;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .vault-copy {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .vault-copy p {
          font-size: 0.75rem;
          color: #5d5750;
          margin: 0;
          line-height: 1.3;
        }

        .btn-vault-action {
          font-size: 0.75rem;
          font-weight: 800;
          color: #c25e00;
          text-decoration: underline;
        }

        .latest-mock-summary {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .mock-score-pill {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          font-size: 0.8125rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .mock-paper-name {
          font-size: 0.75rem;
          color: #787168;
        }

        .free-sample-notice {
          font-size: 0.75rem;
          color: #5d5750;
          margin-bottom: 0.75rem;
        }

        .btn-take-mock {
          display: block;
          text-align: center;
          font-size: 0.8125rem;
          font-weight: 800;
          background: #171513;
          color: #ffffff;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s;
        }

        .btn-take-mock:hover {
          background: #c25e00;
        }

        @media (max-width: 860px) {
          .diagnostics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
