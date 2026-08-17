'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

import type { MockTestSeries, MockTestSeriesPaper } from '../lib/exam-papers';
import { fetchStudentOrders, type StudentOrder } from '../lib/payments';
import PaywallModal from './PaywallModal';
import RefundModal from './RefundModal';

export type SubjectSeriesEntry = {
  series: MockTestSeries;
  papers: MockTestSeriesPaper[];
};

const SUBJECT_LABELS: Record<string, string> = {
  'mathematics-standard': 'Maths Standard (041)',
  'science': 'Science (086)',
  'social-science': 'Social Science (087)',
  'english-language-and-literature': 'English (184)',
};

export default function MockTestSeriesCard({
  series,
  papers,
  seriesList,
  token = null,
  userFullName,
  userEmail,
  unlockedSubjects = [],
}: {
  series?: MockTestSeries;
  papers?: MockTestSeriesPaper[];
  seriesList?: SubjectSeriesEntry[];
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
  unlockedSubjects?: string[];
}) {
  const allSeries: SubjectSeriesEntry[] =
    seriesList && seriesList.length > 0
      ? seriesList
      : series && papers
      ? [{ series, papers }]
      : [];

  const [activeSubject, setActiveSubject] = useState<string>(
    allSeries[0]?.series.subjectSlug ?? 'mathematics-standard',
  );
  const [unlockedSet, setUnlockedSet] = useState<Set<string>>(new Set(unlockedSubjects));
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [studentOrders, setStudentOrders] = useState<StudentOrder[]>([]);
  const [paywallSuccessNotice, setPaywallSuccessNotice] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchStudentOrders(token).then((orders) => {
        setStudentOrders(orders);
      });
    }
  }, [token]);

  if (allSeries.length === 0) {
    return null;
  }

  const current =
    allSeries.find((entry) => entry.series.subjectSlug === activeSubject) ?? allSeries[0];
  const activeSeries = current.series;
  const activePapers = current.papers;
  const isSubjectFullyUnlocked = unlockedSet.has(activeSubject) || unlockedSet.has('all');

  function handleUnlockSuccess(productKey: string) {
    if (productKey.includes('all-subjects')) {
      setUnlockedSet(
        new Set([
          'all',
          'mathematics-standard',
          'science',
          'social-science',
          'english-language-and-literature',
        ]),
      );
      setPaywallSuccessNotice('🎉 All 20 Board Mock Test Papers are now completely unlocked!');
    } else {
      setUnlockedSet((prev) => new Set([...prev, activeSubject]));
      setPaywallSuccessNotice(`🎉 ${activeSeries.title} is now completely unlocked!`);
    }
  }

  return (
    <div className="mock-series">
      {paywallSuccessNotice && (
        <div className="mock-series-success-banner" role="alert">
          <span>{paywallSuccessNotice}</span>
          <button
            type="button"
            className="mock-series-banner-close"
            onClick={() => setPaywallSuccessNotice(null)}
          >
            ✕
          </button>
        </div>
      )}

      {allSeries.length > 1 && (
        <div className="mock-series-tabs" role="tablist" aria-label="Select Mock Test Series Subject">
          {allSeries.map((entry) => {
            const isSelected = entry.series.subjectSlug === activeSubject;
            const isTabUnlocked =
              unlockedSet.has(entry.series.subjectSlug) || unlockedSet.has('all');
            return (
              <button
                key={entry.series.subjectSlug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`mock-series-tab ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveSubject(entry.series.subjectSlug)}
              >
                {SUBJECT_LABELS[entry.series.subjectSlug] ?? entry.series.title}
                {isTabUnlocked && <span className="tab-unlocked-dot"> ✓</span>}
              </button>
            );
          })}
        </div>
      )}

      <div className="mock-series-hero">
        <p className="eyebrow">ChapterReady · CBSE Class 10</p>
        <h1>{activeSeries.title}</h1>
        <p className="subtext">{activeSeries.description}</p>
      </div>

      {/* Psychological Endowed Progress Tracker */}
      <div className="mastery-progress-card">
        <div className="mastery-progress-header">
          <div>
            <span className="mastery-badge">🎯 5-Step Board Mastery Track</span>
            <strong className="mastery-title">
              {isSubjectFullyUnlocked
                ? '🏆 Full 5-Step Series Unlocked — You are on the Topper Track!'
                : '⚡ Step 1 of 5 Ready (20% Complete) — Try Free Paper 1, then unlock all 5 steps!'}
            </strong>
          </div>
          <span className="mastery-percent">
            {isSubjectFullyUnlocked ? '100% Unlocked' : '20% Unlocked'}
          </span>
        </div>
        <div className="mastery-bar-track">
          <div
            className="mastery-bar-fill"
            style={{ width: isSubjectFullyUnlocked ? '100%' : '20%' }}
          />
        </div>
      </div>

      <div className="mock-series-papers">
        {activePapers.map((paper) => {
          const available = Boolean(paper.id);
          const isPaperUnlocked =
            paper.isFreeSample || isSubjectFullyUnlocked || paper.isUnlocked;

          return (
            <div
              className={`mock-series-paper ${
                paper.isFreeSample
                  ? 'mock-series-free'
                  : isPaperUnlocked
                  ? 'mock-series-unlocked'
                  : 'mock-series-locked'
              }`}
              key={paper.number}
            >
              <div className="mock-series-paper-head">
                <span className="mock-series-number">Paper {paper.number}</span>
                {paper.isFreeSample ? (
                  <span className="mock-series-tag free-tag">Free sample</span>
                ) : isPaperUnlocked ? (
                  <span className="mock-series-tag unlocked-tag">🔓 Unlocked</span>
                ) : (
                  <span className="mock-series-tag locked-tag">🔒 Locked</span>
                )}
              </div>
              <p className="mock-series-paper-title">{paper.title}</p>
              <p className="subtext compact">
                {paper.totalMarks ?? 80} marks · {paper.durationMinutes ?? 180} minutes
              </p>

              {available ? (
                isPaperUnlocked ? (
                  <Link
                    className="card-link btn-take-test"
                    href={`/exam-papers/${paper.id}/take`}
                    prefetch={false}
                  >
                    Take this test →
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="card-link btn-unlock-paywall"
                    onClick={() => setIsPaywallOpen(true)}
                  >
                    Unlock Paper {paper.number} 🔒
                  </button>
                )
              ) : (
                <p className="mock-series-coming">Coming soon</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mock-series-footer-banner">
        {!isSubjectFullyUnlocked ? (
          <div className="paywall-cta-strip">
            <div>
              <strong>Want all 20 board mock papers with marking schemes?</strong>
              <p>Paper 1 is free. Unlock Papers 2–5 for just ₹199 (All 4 Subjects Pack).</p>
            </div>
            <button
              type="button"
              className="btn-strip-unlock"
              onClick={() => setIsPaywallOpen(true)}
            >
              Unlock Mock Series (₹199) →
            </button>
          </div>
        ) : (
          <p className="subtext compact mock-series-note">
            ✅ You have full access to all mock test papers for this subject.
          </p>
        )}
      </div>

      <div className="mock-series-guarantee-row">
        <span>🛡️ 48-Hour Satisfaction Guarantee · 100% Refund Protection</span>
        <div className="guarantee-links">
          {isSubjectFullyUnlocked && (
            <button
              type="button"
              className="btn-refund-trigger"
              onClick={() => setIsRefundOpen(true)}
            >
              Request Refund / Switch Subject
            </button>
          )}
          <Link href="/refund-policy" className="link-refund-policy" target="_blank">
            Refund Policy →
          </Link>
        </div>
      </div>

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={handleUnlockSuccess}
        token={token}
        subjectSlug={activeSubject}
        subjectTitle={SUBJECT_LABELS[activeSubject] ?? activeSeries.title}
        userFullName={userFullName}
        userEmail={userEmail}
      />

      <RefundModal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        token={token}
        orders={studentOrders}
        onRefundCompleted={() => {
          setUnlockedSet(new Set());
          setPaywallSuccessNotice('Your refund/swap request has been completed.');
        }}
      />

      <style jsx>{`
        .mock-series { margin: 1rem 0 2rem; }
        .mock-series-success-banner {
          background: #e3f3ee;
          border: 2px solid #0b7a48;
          color: #0b7a48;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          margin-bottom: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
        }
        .mock-series-banner-close {
          background: transparent;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          color: #0b7a48;
          font-weight: 900;
        }
        .mock-series-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
        .mock-series-tab {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1.5px solid var(--border, #ddd);
          background: #fff;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.15s ease;
          color: inherit;
        }
        .mock-series-tab:hover { border-color: #c98a2c; background: #fffdfa; }
        .mock-series-tab.active { border-color: #8a5314; background: #faede0; font-weight: 700; color: #5a3205; }
        .tab-unlocked-dot { color: #0b7a48; font-weight: 900; }
        .mock-series-hero { margin-bottom: 1rem; }
        .mastery-progress-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 14px;
          padding: 0.95rem 1.25rem;
          margin-bottom: 1.25rem;
          box-shadow: 3px 3px 0 #171513;
        }
        .mastery-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.65rem;
          flex-wrap: wrap;
        }
        .mastery-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          background: #ffe9b8;
          color: #171513;
          border: 1px solid #171513;
          border-radius: 999px;
          padding: 0.15rem 0.55rem;
          margin-bottom: 0.25rem;
        }
        .mastery-title {
          display: block;
          font-size: 0.88rem;
          color: #171513;
        }
        .mastery-percent {
          font-size: 0.85rem;
          font-weight: 900;
          color: #0b7a48;
          background: #e3f3ee;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }
        .mastery-bar-track {
          width: 100%;
          height: 8px;
          background: #eee;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid #171513;
        }
        .mastery-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #c95014, #0b7a48);
          border-radius: 999px;
          transition: width 0.3s ease;
        }
        .mock-series-papers { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .mock-series-paper {
          background: #faf6f0;
          border: 1.5px solid var(--border, #eee);
          border-radius: 14px;
          padding: 1.1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .mock-series-paper.mock-series-free { border-color: #d4a72c; background: #fffaf0; }
        .mock-series-paper.mock-series-unlocked { border-color: #0b7a48; background: #f4faf7; }
        .mock-series-paper.mock-series-locked { opacity: 0.92; background: #f7f3ec; }
        .mock-series-paper-head { display: flex; justify-content: space-between; align-items: center; }
        .mock-series-number { font-weight: 700; font-size: 0.9rem; }
        .mock-series-tag { font-size: 0.72rem; font-weight: 800; border-radius: 999px; padding: 0.15rem 0.55rem; }
        .free-tag { color: #6b4e00; background: #fbe9b7; }
        .unlocked-tag { color: #0b7a48; background: #d7f0e6; }
        .locked-tag { color: #8a4814; background: #fcebd9; }
        .mock-series-paper-title { font-weight: 700; font-size: 1rem; margin: 0.2rem 0; }
        .btn-take-test { margin-top: auto; align-self: flex-start; text-decoration: none; }
        .btn-unlock-paywall {
          margin-top: auto;
          align-self: flex-start;
          cursor: pointer;
          background: #c95014;
          color: #fff;
          border: none;
          font-size: 0.85rem;
          font-weight: 800;
          border-radius: 8px;
          padding: 0.45rem 0.85rem;
          transition: background 0.12s ease;
        }
        .btn-unlock-paywall:hover { background: #b0410b; }
        .mock-series-coming { color: var(--muted, #999); font-size: 0.85rem; margin-top: auto; }
        .mock-series-footer-banner { margin-top: 1.25rem; }
        .paywall-cta-strip {
          background: linear-gradient(135deg, #fff7e6, #ffe9b8);
          border: 2px solid #171513;
          border-radius: 14px;
          padding: 1.15rem 1.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .paywall-cta-strip strong { font-size: 0.95rem; color: #171513; display: block; }
        .paywall-cta-strip p { font-size: 0.85rem; color: #555; margin: 0.2rem 0 0 0; }
        .btn-strip-unlock {
          background: #171513;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.15rem;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .btn-strip-unlock:hover { background: #332f2b; }
        .mock-series-note { margin-top: 1rem; }
        .mock-series-guarantee-row {
          margin-top: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.82rem;
          color: #555;
          padding: 0.75rem 1rem;
          background: #faf8f5;
          border: 1.5px solid #eee;
          border-radius: 10px;
        }
        .guarantee-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .btn-refund-trigger {
          background: transparent;
          border: 1px solid #171513;
          border-radius: 6px;
          padding: 0.25rem 0.65rem;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          color: #171513;
          transition: all 0.12s ease;
        }
        .btn-refund-trigger:hover {
          background: #171513;
          color: #fff;
        }
        .link-refund-policy {
          color: #0284c7;
          font-weight: 700;
          text-decoration: underline;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}

