'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NCERT_ACTIVITIES_DATA, type NcertActivity, type ActivitySubject } from '../lib/content/activities-data';
import ActivityIllustration from './ActivityIllustration';
import MathText from './MathText';
const ProductCheckoutModal = dynamic(() => import('./ProductCheckoutModal'));
const VirtualLabWorkbench = dynamic(() => import('./virtual-lab/VirtualLabWorkbench'), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center bg-slate-900 rounded-2xl text-slate-400 border border-slate-800 my-4">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-2"></div>
      <p className="text-xs font-semibold">Loading 3D Laboratory Simulation...</p>
    </div>
  ),
});
import { NCERT_ACTIVITY_DIAGRAM_PACK_KEY } from '../lib/payments';

export type ActivityDiagramViewerProps = {
  isUnlocked: boolean;
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
};

export default function ActivityDiagramViewer({
  isUnlocked,
  token = null,
  userFullName,
  userEmail,
}: ActivityDiagramViewerProps) {
  const [activeSubject, setActiveSubject] = useState<ActivitySubject | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [selectedProductKey, setSelectedProductKey] = useState(NCERT_ACTIVITY_DIAGRAM_PACK_KEY);
  const [unlockedState, setUnlockedState] = useState(isUnlocked);
  const [active3DModes, setActive3DModes] = useState<Record<string, boolean>>({
    'act-1-1': true, // Enable 3D by default for magnesium preview!
  });

  const filteredActivities = useMemo(() => {
    return NCERT_ACTIVITIES_DATA.filter((act) => {
      const matchesSubject = activeSubject === 'all' || act.subject === activeSubject;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.activityNumber.toLowerCase().includes(q) ||
        act.chapterTitle.toLowerCase().includes(q) ||
        act.aim.toLowerCase().includes(q);
      return matchesSubject && matchesSearch;
    });
  }, [activeSubject, searchQuery]);

  const toggleQuestion = (actId: string, qIdx: number) => {
    const key = `${actId}-${qIdx}`;
    setExpandedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUnlockSuccess = (productKey: string) => {
    setUnlockedState(true);
    setIsPaywallOpen(false);
  };

  const openCheckout = (packKey: string = NCERT_ACTIVITY_DIAGRAM_PACK_KEY) => {
    setSelectedProductKey(packKey);
    setIsPaywallOpen(true);
  };

  return (
    <div className="activity-viewer-container">
      {/* Hero Header */}
      <div className="viewer-hero">
        <div className="hero-eyebrow-wrap">
          <span className="hero-badge">🔬 100% NCERT Science Activities</span>
          <span className="hero-class">Class 10 Board Mastery</span>
        </div>
        <h1>NCERT Activity &amp; Diagram Mastery Handbook</h1>
        <p className="hero-subtext">
          15 to 20 marks in CBSE Science board exams come directly from NCERT textbook activities and diagrams.
          Master experimental setups, observations, balanced chemical equations, and official marking scheme answers.
        </p>

        {/* Action / Guarantee Banner */}
        <div className="hero-cta-card">
          <div className="cta-info">
            <strong>
              {unlockedState
                ? '🎉 Full NCERT Activity & Diagram Pack Unlocked!'
                : '🔓 Free Samples Available · Unlock All 13 Chapters for just ₹99'}
            </strong>
            <span>
              {unlockedState
                ? 'You have complete access to all Chemistry, Biology & Physics activities + printable PDF sheets.'
                : 'Includes all Chemistry test-tube experiments, Biology starch/stomata tests, Physics ray tracings & board questions.'}
            </span>
          </div>
          <div className="cta-actions">
            {!unlockedState ? (
              <button
                type="button"
                className="btn-unlock-hero"
                onClick={() => openCheckout(NCERT_ACTIVITY_DIAGRAM_PACK_KEY)}
              >
                ⚡ Unlock Full Pack (₹99) →
              </button>
            ) : (
              <button
                type="button"
                className="btn-print-handbook"
                onClick={() => window.print()}
              >
                🖨️ Print / Save PDF Handbook
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-controls-strip">
        <div className="subject-tabs" role="tablist">
          <button
            type="button"
            className={`tab-btn ${activeSubject === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubject('all')}
          >
            All Activities ({NCERT_ACTIVITIES_DATA.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubject === 'chemistry' ? 'active' : ''}`}
            onClick={() => setActiveSubject('chemistry')}
          >
            🧪 Chemistry
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubject === 'biology' ? 'active' : ''}`}
            onClick={() => setActiveSubject('biology')}
          >
            🌿 Biology
          </button>
          <button
            type="button"
            className={`tab-btn ${activeSubject === 'physics' ? 'active' : ''}`}
            onClick={() => setActiveSubject('physics')}
          >
            ⚡ Physics
          </button>
        </div>

        <div className="search-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Search activity, chapter or reaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="activity-cards-grid">
        {filteredActivities.map((act) => {
          const isItemAccessible = act.isFreeSample || unlockedState;

          return (
            <article
              key={act.id}
              className={`activity-card ${act.isFreeSample ? 'free-sample' : isItemAccessible ? 'unlocked' : 'locked'}`}
              id={act.id}
            >
              {/* Dynamic Watermark Background */}
              <div className="watermark-overlay" aria-hidden="true">
                <span>{userFullName || 'CBSE Science Student'} • {userEmail || 'ChapterReady Official'}</span>
              </div>

              {/* Student License Header */}
              <div className="student-license-strip">
                <span>🔐 Single-Student License: <strong>{userFullName || 'Authorized Student'}</strong> {userEmail ? `(${userEmail})` : ''}</span>
                <span className="license-tag">Official NCERT Science Handbook</span>
              </div>

              {/* Card Top */}
              <div className="card-top-bar">
                <div className="activity-id-group">
                  <span className="activity-number">{act.activityNumber}</span>
                  <span className={`subject-pill ${act.subject}`}>{act.subject}</span>
                  {act.isFreeSample ? (
                    <span className="status-badge free-badge">Free Preview</span>
                  ) : isItemAccessible ? (
                    <span className="status-badge unlocked-badge">🔓 Unlocked</span>
                  ) : (
                    <span className="status-badge locked-badge">🔒 Premium (₹99)</span>
                  )}
                </div>
                <span className="chapter-label">{act.chapterTitle}</span>
              </div>

              <h2 className="activity-title">{act.title}</h2>

              {/* Aim Section */}
              <div className="section-block aim-box">
                <strong className="block-label">🎯 Aim of Experiment:</strong>
                <p className="block-text">{act.aim}</p>
              </div>

              {isItemAccessible ? (
                <>
                  {/* Visual Diagram / 3D Simulation Embed */}
                  {act.id === 'act-1-1' || act.id === 'act-10-3' ? (
                    <div className="simulation-section-wrap my-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fffdf8] border border-[#d9c7b4] p-3 rounded-2xl mb-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#181612]">🔬 Practical Simulation Available:</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#fff3df] text-[#bd4f10] border border-[#f3883b]/30">
                            3D Interactive
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#f4ede2] p-1 rounded-xl border border-[#d9c7b4]">
                          <button
                            type="button"
                            onClick={() => setActive3DModes((prev) => ({ ...prev, [act.id]: false }))}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              !active3DModes[act.id]
                                ? 'bg-[#181612] text-white shadow-sm'
                                : 'text-[#6f665c] hover:text-[#181612] hover:bg-[#ffffff]/60'
                            }`}
                          >
                            📷 2D NCERT Diagram
                          </button>
                          <button
                            type="button"
                            onClick={() => setActive3DModes((prev) => ({ ...prev, [act.id]: true }))}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              active3DModes[act.id]
                                ? 'bg-[#f3883b] text-white shadow-md shadow-[#f3883b]/20'
                                : 'text-[#bd4f10] hover:text-[#181612] hover:bg-[#ffffff]/60'
                            }`}
                          >
                            🎮 3D Interactive Lab
                          </button>
                        </div>
                      </div>

                      {active3DModes[act.id] ? (
                        <VirtualLabWorkbench
                          mode="activity"
                          initialExperiment={act.id === 'act-1-1' ? 'magnesium' : 'prism'}
                          onClose={() => setActive3DModes((prev) => ({ ...prev, [act.id]: false }))}
                        />
                      ) : (
                        act.illustrationDemoId && (
                          <div className="illustration-wrapper">
                            <ActivityIllustration demoId={act.illustrationDemoId} />
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    act.illustrationDemoId && (
                      <div className="illustration-wrapper">
                        <ActivityIllustration demoId={act.illustrationDemoId} />
                      </div>
                    )
                  )}

                  {/* Materials & Procedure */}
                  <div className="experiment-details-grid">
                    <div className="details-column">
                      <strong className="block-label">🧪 Materials Required:</strong>
                      <ul className="details-list">
                        {act.materials.map((mat, i) => (
                          <li key={i}>{mat}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="details-column">
                      <strong className="block-label">📋 Procedure Steps:</strong>
                      <ol className="procedure-list">
                        {act.procedure.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Observations & Balanced Chemical Reaction */}
                  <div className="section-block obs-box">
                    <strong className="block-label">👁️ Key Observations:</strong>
                    <p className="block-text">{act.observation}</p>

                    {act.reactionEquation && (
                      <div className="reaction-equation-card">
                        <span className="reaction-tag">Balanced Chemical Equation:</span>
                        <div className="math-render-wrap">
                          <MathText text={`$$${act.reactionEquation}$$`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Inference & Board Takeaways */}
                  <div className="section-block inference-box">
                    <strong className="block-label">💡 Inference &amp; Board Exam Takeaway:</strong>
                    <p className="block-text">{act.inferenceConclusion}</p>
                  </div>

                  {/* CBSE Board Exam Questions Vault */}
                  {act.boardExamQuestions.length > 0 && (
                    <div className="board-questions-section">
                      <div className="board-q-header">
                        <span className="board-badge">CBSE Board Exam Question Vault</span>
                        <span className="board-marks-hint">High Probability 3-Mark &amp; 5-Mark Questions</span>
                      </div>
                      <div className="board-q-list">
                        {act.boardExamQuestions.map((bq, qIdx) => {
                          const isExpanded = Boolean(expandedQuestions[`${act.id}-${qIdx}`]);
                          return (
                            <div className="board-q-card" key={qIdx}>
                              <div
                                className="board-q-top"
                                onClick={() => toggleQuestion(act.id, qIdx)}
                              >
                                <div className="q-title-wrap">
                                  <span className="q-mark-pill">{bq.marks} MARKS</span>
                                  <span className="q-text">{bq.question}</span>
                                </div>
                                <span className="toggle-indicator">{isExpanded ? '▲ Hide Answer' : '▼ View Model Answer'}</span>
                              </div>
                              {isExpanded && (
                                <div className="board-a-body">
                                  <strong>Topper Answer &amp; Value Points:</strong>
                                  <p>{bq.answerKey}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Print & Digital Conversion Footer */}
                  <div className="activity-print-footer">
                    <div className="print-footer-left">
                      <strong>⚡ ChapterReady.in — Official NCERT Class 10 Learning Platform</strong>
                      <p>
                        Explore interactive diagrams, reaction animations &amp; 80-Mark CBT Board Mock Tests at <strong>https://chapterready.in</strong>
                      </p>
                      <span className="print-legal-notice">
                        © 2026-27 ChapterReady. Licensed to {userFullName || 'Student'} ({userEmail || 'CBSE Student'}). Single-student license. Unauthorized sharing is prohibited.
                      </span>
                    </div>
                    <div className="print-qr-block">
                      <span className="qr-badge">ONLINE LAB</span>
                      <div className="qr-box-mock">
                        <span>📱 CHAPTERREADY.IN</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Paywall Lock Teaser */
                <div className="locked-teaser-card">
                  <div className="teaser-content">
                    <span className="lock-giant-icon">🔒</span>
                    <h3>Unlock Experimental Setup, Diagram Drills &amp; Board Solutions</h3>
                    <p>
                      Get step-by-step procedures, interactive reaction schematics, and actual 3-mark &amp; 5-mark board exam answers for this activity.
                    </p>
                    <button
                      type="button"
                      className="btn-card-unlock"
                      onClick={() => openCheckout(NCERT_ACTIVITY_DIAGRAM_PACK_KEY)}
                    >
                      ⚡ Unlock NCERT Activity Pack for ₹99 →
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Sticky Promotion Strip */}
      {!unlockedState && (
        <div className="bottom-upsell-bar">
          <div className="upsell-container">
            <div>
              <strong>Complete Class 10 NCERT Science Activities Pack</strong>
              <span>Instant access to all 13 chapter experiments, diagrams &amp; board questions for just ₹99</span>
            </div>
            <button
              type="button"
              className="btn-bottom-unlock"
              onClick={() => openCheckout(NCERT_ACTIVITY_DIAGRAM_PACK_KEY)}
            >
              Unlock All Activities (₹99) →
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <ProductCheckoutModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={handleUnlockSuccess}
        token={token}
        userFullName={userFullName}
        userEmail={userEmail}
        initialProductKey={selectedProductKey}
      />

      <style jsx>{`
        .activity-viewer-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 1.5rem 1rem 5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .viewer-hero {
          margin-bottom: 2rem;
        }
        .hero-eyebrow-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .hero-badge {
          background: #e3f3ee;
          color: #0b7a48;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          border: 1px solid #0b7a48;
          text-transform: uppercase;
        }
        .hero-class {
          font-size: 0.8rem;
          color: #787168;
          font-weight: 700;
        }
        h1 {
          font-size: 2.25rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.6rem;
          line-height: 1.2;
        }
        .hero-subtext {
          font-size: 1.05rem;
          color: #55514b;
          line-height: 1.5;
          margin: 0 0 1.5rem;
          max-width: 850px;
        }
        .hero-cta-card {
          background: linear-gradient(135deg, #fff7e6, #ffe9b8);
          border: 2.5px solid #171513;
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 4px 4px 0 #171513;
          flex-wrap: wrap;
        }
        .cta-info strong {
          display: block;
          font-size: 1.05rem;
          color: #171513;
          margin-bottom: 0.2rem;
        }
        .cta-info span {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.4;
          display: block;
        }
        .btn-unlock-hero {
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.75rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.12s ease;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.25);
          white-space: nowrap;
        }
        .btn-unlock-hero:hover {
          background: #c95014;
          border-color: #c95014;
        }
        .btn-print-handbook {
          background: #0b7a48;
          color: #fff;
          border: 2px solid #0b7a48;
          border-radius: 10px;
          padding: 0.75rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }
        .filter-controls-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .subject-tabs {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .tab-btn {
          background: #fff;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          color: #555;
          transition: all 0.15s ease;
        }
        .tab-btn:hover {
          border-color: #c95014;
          color: #171513;
        }
        .tab-btn.active {
          background: #171513;
          color: #fff;
          border-color: #171513;
        }
        .search-wrap {
          position: relative;
          min-width: 260px;
          flex: 1;
          max-width: 380px;
        }
        .search-input {
          width: 100%;
          padding: 0.5rem 2rem 0.5rem 0.85rem;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }
        .search-input:focus {
          border-color: #c95014;
        }
        .btn-clear-search {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .activity-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .activity-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 2.5px solid #171513;
          border-radius: 20px;
          padding: 1.75rem 2rem;
          box-shadow: 6px 6px 0 #171513;
          user-select: none;
          -webkit-user-select: none;
        }
        .activity-card.free-sample {
          border-color: #c98a2c;
          box-shadow: 6px 6px 0 #c98a2c;
        }
        .watermark-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 1;
          opacity: 0.035;
          transform: rotate(-25deg);
          font-size: 2.2rem;
          font-weight: 900;
          color: #171513;
          text-align: center;
          line-height: 1.4;
          text-transform: uppercase;
        }
        .student-license-strip {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          color: #475569;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .license-tag {
          font-weight: 800;
          color: #0b7a48;
          font-size: 0.7rem;
          text-transform: uppercase;
        }
        .card-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .activity-id-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .activity-number {
          font-size: 0.95rem;
          font-weight: 900;
          color: #171513;
          background: #f4eee3;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid #171513;
        }
        .subject-pill {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }
        .subject-pill.chemistry { background: #fef3c7; color: #b45309; }
        .subject-pill.biology { background: #d1fae5; color: #065f46; }
        .subject-pill.physics { background: #dbeafe; color: #1e40af; }
        .status-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }
        .free-badge { background: #fde68a; color: #78350f; }
        .unlocked-badge { background: #d7f0e6; color: #0b7a48; }
        .locked-badge { background: #fee2e2; color: #991b1b; }
        .chapter-label {
          font-size: 0.82rem;
          color: #787168;
          font-weight: 700;
        }
        .activity-title {
          font-size: 1.45rem;
          font-weight: 900;
          color: #171513;
          margin: 0 0 1rem;
          line-height: 1.3;
        }
        .section-block {
          background: #faf8f5;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.85rem 1.15rem;
          margin-bottom: 1rem;
        }
        .block-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          color: #171513;
          margin-bottom: 0.35rem;
        }
        .block-text {
          font-size: 0.92rem;
          color: #333;
          line-height: 1.45;
          margin: 0;
        }
        .illustration-wrapper {
          margin: 1.25rem 0;
          border: 2px solid #171513;
          border-radius: 14px;
          overflow: hidden;
          background: #fdfaf6;
        }
        .experiment-details-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 650px) {
          .experiment-details-grid { grid-template-columns: 1fr; }
        }
        .details-column {
          background: #faf8f5;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.85rem 1.15rem;
        }
        .details-list, .procedure-list {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.88rem;
          color: #444;
          line-height: 1.45;
        }
        .equation-box {
          background: #effaf3;
          border-color: #10b981;
        }
        .formula-display {
          margin-top: 0.35rem;
          font-size: 1.1rem;
        }
        .obs-conc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        @media (max-width: 600px) {
          .obs-conc-grid { grid-template-columns: 1fr; }
        }
        .obs-box {
          background: #fff8f0;
          border: 1.5px solid #fed7aa;
        }
        .inference-box {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .board-questions-section {
          position: relative;
          z-index: 2;
          margin-top: 1.25rem;
          border-top: 2px dashed #e2e8f0;
          padding-top: 1.25rem;
        }
        .board-q-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .board-badge {
          font-size: 0.82rem;
          font-weight: 900;
          background: #171513;
          color: #fff;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }
        .board-marks-hint {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 700;
        }
        .board-q-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .board-q-card {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          overflow: hidden;
        }
        .board-q-top {
          padding: 0.85rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          background: #f8fafc;
          transition: background 0.12s ease;
        }
        .board-q-top:hover {
          background: #f1f5f9;
        }
        .q-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex: 1;
        }
        .q-mark-pill {
          font-size: 0.68rem;
          font-weight: 900;
          background: #e2e8f0;
          color: #1e293b;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          white-space: nowrap;
        }
        .q-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.4;
        }
        .toggle-indicator {
          font-size: 0.75rem;
          font-weight: 800;
          color: #c95014;
          white-space: nowrap;
        }
        .board-a-body {
          padding: 0.85rem 1rem;
          border-top: 1px solid #e2e8f0;
          background: #ffffff;
          font-size: 0.88rem;
          line-height: 1.5;
        }
        .board-a-body strong {
          display: block;
          color: #0b7a48;
          margin-bottom: 0.25rem;
          font-size: 0.8rem;
          text-transform: uppercase;
        }
        .board-a-body p {
          margin: 0;
          color: #1f2937;
        }
        .activity-print-footer {
          position: relative;
          z-index: 2;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 2px dashed #cbd5e1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .print-footer-left strong {
          display: block;
          font-size: 0.88rem;
          color: #0b7a48;
          margin-bottom: 0.2rem;
        }
        .print-footer-left p {
          margin: 0 0 0.4rem;
          font-size: 0.8rem;
          color: #333;
          line-height: 1.4;
        }
        .print-legal-notice {
          display: block;
          font-size: 0.7rem;
          color: #888;
          font-style: italic;
        }
        .print-qr-block {
          text-align: center;
        }
        .qr-badge {
          display: block;
          font-size: 0.65rem;
          font-weight: 900;
          background: #171513;
          color: #fff;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          margin-bottom: 0.25rem;
        }
        .qr-box-mock {
          border: 2px solid #171513;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 900;
          background: #fdfdfd;
          color: #171513;
        }
        .locked-teaser-card {
          background: #fff8f2;
          border: 2px dashed #c95014;
          border-radius: 14px;
          padding: 2rem 1.5rem;
          text-align: center;
          margin-top: 1rem;
        }
        .lock-giant-icon {
          font-size: 2.25rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .locked-teaser-card h3 {
          font-size: 1.15rem;
          font-weight: 900;
          color: #171513;
          margin: 0 0 0.4rem;
        }
        .locked-teaser-card p {
          font-size: 0.88rem;
          color: #666;
          margin: 0 0 1.25rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .btn-card-unlock {
          background: #c95014;
          color: #fff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-size: 0.92rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 3px 3px 0 #171513;
          transition: all 0.12s ease;
        }
        .btn-card-unlock:hover {
          background: #b0410b;
        }
        .bottom-upsell-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #171513;
          color: #ffffff;
          padding: 0.85rem 1.5rem;
          z-index: 100;
          box-shadow: 0 -4px 15px rgba(0,0,0,0.15);
        }
        .upsell-container {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .upsell-container strong {
          display: block;
          font-size: 0.95rem;
          color: #fff;
        }
        .upsell-container span {
          font-size: 0.8rem;
          color: #bbb;
        }
        .btn-bottom-unlock {
          background: #c95014;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.55rem 1.25rem;
          font-size: 0.9rem;
          font-weight: 900;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .btn-bottom-unlock:hover {
          background: #e05b19;
        }
        @media print {
          .no-print, .filter-controls-strip, .hero-cta-card, .bottom-upsell-bar, .activity-hero {
            display: none !important;
          }
          .activity-card {
            border: 1.5px solid #000 !important;
            box-shadow: none !important;
            padding: 1.25rem !important;
            page-break-inside: avoid;
            margin-bottom: 2rem !important;
          }
          .watermark-overlay {
            opacity: 0.08 !important;
            font-size: 2.8rem !important;
          }
          .activity-print-footer {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
