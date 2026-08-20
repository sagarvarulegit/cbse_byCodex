'use client';

import React, { useState, useMemo } from 'react';
import {
  CHAPTER_CHEATSHEETS_DATA,
  type ChapterCheatsheet,
  type CheatsheetSubject,
  type FlashcardItem,
} from '../lib/content/cheatsheets-data';
import MathText from './MathText';
import ProductCheckoutModal from './ProductCheckoutModal';
import { FORMULA_CHEATSHEET_PACK_KEY } from '../lib/payments';

export type FormulaCheatsheetViewerProps = {
  isUnlocked: boolean;
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
};

export default function FormulaCheatsheetViewer({
  isUnlocked,
  token = null,
  userFullName,
  userEmail,
}: FormulaCheatsheetViewerProps) {
  const [viewMode, setViewMode] = useState<'sheets' | 'flashcards'>('sheets');
  const [activeSubject, setActiveSubject] = useState<CheatsheetSubject | 'all'>('all');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    CHAPTER_CHEATSHEETS_DATA[0]?.id || 'math-ch4',
  );
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [unlockedState, setUnlockedState] = useState(isUnlocked);

  // Flashcard Drill State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const filteredChapters = useMemo(() => {
    return CHAPTER_CHEATSHEETS_DATA.filter((ch) => {
      return activeSubject === 'all' || ch.subject === activeSubject;
    });
  }, [activeSubject]);

  const activeChapter = useMemo(() => {
    return (
      filteredChapters.find((ch) => ch.id === selectedChapterId) ||
      filteredChapters[0] ||
      CHAPTER_CHEATSHEETS_DATA[0]
    );
  }, [filteredChapters, selectedChapterId]);

  // Flashcards for active chapter or entire subject
  const allAvailableFlashcards = useMemo(() => {
    if (activeChapter) {
      return activeChapter.flashcards;
    }
    return [];
  }, [activeChapter]);

  const currentFlashcard: FlashcardItem | undefined = allAvailableFlashcards[currentCardIndex];

  const handleUnlockSuccess = () => {
    setUnlockedState(true);
    setIsPaywallOpen(false);
  };

  const isCurrentAccessible = activeChapter?.isFreeSample || unlockedState;

  const nextFlashcard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % allAvailableFlashcards.length);
  };

  const prevFlashcard = () => {
    setIsCardFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + allAvailableFlashcards.length) % allAvailableFlashcards.length);
  };

  return (
    <div className="cheatsheet-viewer-container">
      {/* Hero Section */}
      <div className="cheatsheet-hero">
        <div className="hero-eyebrow-wrap">
          <span className="hero-badge">⚡ Class 10 Board Formula Revision</span>
          <span className="hero-class">Maths &amp; Science</span>
        </div>
        <h1>Class 10 Formula &amp; Reaction Cheatsheet Pack</h1>
        <p className="hero-subtext">
          Ultra-dense, 1-page printable summary sheets per chapter + interactive digital flashcards.
          Master all Maths formulas, identities, Science chemical equations, color changes, and Physics sign conventions.
        </p>

        {/* Action Banner */}
        <div className="hero-cta-card">
          <div className="cta-info">
            <strong>
              {unlockedState
                ? '🎉 Full Cheatsheet & Flashcard Pack Unlocked!'
                : '🔓 Free Preview Available · Unlock All Maths & Science Chapters for just ₹49'}
            </strong>
            <span>
              {unlockedState
                ? 'Unlimited access to all 1-page printable cheatsheets & interactive flashcard drills.'
                : 'Printable high-resolution sheets for wall charts + rapid flashcard recall drills.'}
            </span>
          </div>
          <div className="cta-actions">
            {!unlockedState ? (
              <button
                type="button"
                className="btn-unlock-hero"
                onClick={() => setIsPaywallOpen(true)}
              >
                ⚡ Unlock Full Pack (₹49) →
              </button>
            ) : (
              <button
                type="button"
                className="btn-print-sheet"
                onClick={() => window.print()}
              >
                🖨️ Print 1-Page Cheatsheet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mode & Subject Controls */}
      <div className="controls-toolbar">
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'sheets' ? 'active' : ''}`}
            onClick={() => setViewMode('sheets')}
          >
            📄 1-Page Summary View
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => {
              setViewMode('flashcards');
              setCurrentCardIndex(0);
              setIsCardFlipped(false);
            }}
          >
            🗂️ Interactive Flashcards Mode
          </button>
        </div>

        <div className="subject-filter-tabs">
          <button
            type="button"
            className={`filter-btn ${activeSubject === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubject('all')}
          >
            All (27 Chapters)
          </button>
          <button
            type="button"
            className={`filter-btn ${activeSubject === 'maths' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubject('maths');
              const mathsChapters = CHAPTER_CHEATSHEETS_DATA.filter((ch) => ch.subject === 'maths');
              if (!mathsChapters.some((ch) => ch.id === selectedChapterId)) {
                setSelectedChapterId(mathsChapters[0]?.id || 'math-ch1');
                setCurrentCardIndex(0);
                setIsCardFlipped(false);
              }
            }}
          >
            📐 Maths (14)
          </button>
          <button
            type="button"
            className={`filter-btn ${activeSubject === 'science' ? 'active' : ''}`}
            onClick={() => {
              setActiveSubject('science');
              const sciChapters = CHAPTER_CHEATSHEETS_DATA.filter((ch) => ch.subject === 'science');
              if (!sciChapters.some((ch) => ch.id === selectedChapterId)) {
                setSelectedChapterId(sciChapters[0]?.id || 'sci-ch1');
                setCurrentCardIndex(0);
                setIsCardFlipped(false);
              }
            }}
          >
            🧪 Science (13)
          </button>
        </div>
      </div>

      {/* Chapter Selection Pills */}
      <div className="chapter-pills-scroll" role="tablist">
        {filteredChapters.map((ch) => {
          const isSelected = ch.id === activeChapter?.id;
          const isItemAccessible = ch.isFreeSample || unlockedState;

          return (
            <button
              key={ch.id}
              type="button"
              className={`chapter-pill-btn ${isSelected ? 'active' : ''} ${ch.isFreeSample ? 'free' : ''}`}
              onClick={() => {
                setSelectedChapterId(ch.id);
                setCurrentCardIndex(0);
                setIsCardFlipped(false);
              }}
            >
              <span className="pill-ch-num">Ch {ch.chapterNumber}</span>
              <span className="pill-title">{ch.chapterTitle}</span>
              {ch.isFreeSample ? (
                <span className="pill-badge free">Free</span>
              ) : isItemAccessible ? (
                <span className="pill-badge unlocked">✓</span>
              ) : (
                <span className="pill-badge locked">🔒</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {isCurrentAccessible ? (
        viewMode === 'sheets' ? (
          /* 1-PAGE SUMMARY SHEET VIEW */
          <div className="printable-sheet-card" id="printable-cheatsheet">
            {/* Dynamic Watermark Background */}
            <div className="watermark-overlay" aria-hidden="true">
              <span>{userFullName || 'CBSE Class 10 Student'} • {userEmail || 'ChapterReady Official'}</span>
            </div>

            {/* Student Digital License Header */}
            <div className="student-license-strip">
              <span>🔐 Single-Student License: <strong>{userFullName || 'Authorized Student'}</strong> {userEmail ? `(${userEmail})` : ''}</span>
              <span className="license-tag">Official ChapterReady™ CBSE 2026-27</span>
            </div>

            <div className="sheet-header">
              <div>
                <span className="sheet-subject-tag">{activeChapter.subject.toUpperCase()} · CHAPTER {activeChapter.chapterNumber}</span>
                <h2 className="sheet-title">{activeChapter.chapterTitle} — Ultra Revision Sheet</h2>
                <p className="sheet-summary">{activeChapter.summaryNote}</p>
              </div>
              <button
                type="button"
                className="btn-print-mini no-print"
                onClick={() => window.print()}
                title="Print or Save PDF Wall-Sheet"
              >
                🖨️ Print Sheet
              </button>
            </div>

            {/* Core Rules & Theorems */}
            <div className="sheet-section rules-section">
              <strong className="section-label">📌 Core NCERT Rules &amp; Theorems:</strong>
              <ul className="rules-list">
                {activeChapter.coreRules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* High-Yield Formulas Table */}
            <div className="sheet-section formulas-section">
              <strong className="section-label">⚡ Master Formula Vault:</strong>
              <div className="formulas-grid">
                {activeChapter.formulas.map((f, idx) => (
                  <div key={idx} className="formula-card-item">
                    <span className="formula-card-label">{f.label}</span>
                    <div className="formula-math-render">
                      <MathText text={`$$${f.formulaLatex}$$`} />
                    </div>
                    {f.notes && <span className="formula-card-notes">ℹ️ {f.notes}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Common Traps & Negative Marking Warnings */}
            {activeChapter.commonTraps.length > 0 && (
              <div className="sheet-section traps-section">
                <strong className="section-label trap-label">⚠️ Common Board Exam Mistakes to Avoid:</strong>
                <ul className="traps-list">
                  {activeChapter.commonTraps.map((trap, idx) => (
                    <li key={idx}>{trap}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Print & Digital Conversion Footer */}
            <div className="sheet-print-footer">
              <div className="print-footer-left">
                <strong>⚡ ChapterReady.in — Official NCERT Class 10 Learning Platform</strong>
                <p>
                  Practice this chapter on 3D Active-Recall Flashcards, Mistake Vault &amp; 80-Mark CBT Board Mock Tests at <strong>https://chapterready.in</strong>
                </p>
                <span className="print-legal-notice">
                  © 2026-27 ChapterReady. Licensed to {userFullName || 'Student'} ({userEmail || 'CBSE Student'}). Unauthorized resale or group distribution is prohibited.
                </span>
              </div>
              <div className="print-qr-block">
                <span className="qr-badge">SCAN TO DRILL</span>
                <div className="qr-box-mock">
                  <span>📱 ONLINE ARENA</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* INTERACTIVE FLASHCARDS MODE */
          <div className="flashcard-mode-container">
            <div className="flashcard-status-bar">
              <span>Card {currentCardIndex + 1} of {allAvailableFlashcards.length}</span>
              <span className="flashcard-ch-name">{activeChapter.chapterTitle}</span>
              <span className="flashcard-cat">{currentFlashcard?.category || 'Formula'}</span>
            </div>

            {currentFlashcard ? (
              <div
                className={`flashcard-3d-box ${isCardFlipped ? 'flipped' : ''}`}
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                <div className="flashcard-inner">
                  {/* Front */}
                  <div className="flashcard-front">
                    <span className="card-face-badge">QUESTION (Click to flip)</span>
                    <p className="card-prompt-text">{currentFlashcard.front}</p>
                    <span className="flip-hint">👆 Tap or click to reveal answer</span>
                  </div>

                  {/* Back */}
                  <div className="flashcard-back">
                    <span className="card-face-badge back-badge">CORRECT ANSWER</span>
                    <p className="card-answer-text">{currentFlashcard.back}</p>
                    <span className="flip-hint">👆 Tap to flip back</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No flashcards available for this chapter.</p>
            )}

            <div className="flashcard-nav-buttons">
              <button
                type="button"
                className="btn-flash-nav"
                onClick={prevFlashcard}
              >
                ← Previous Card
              </button>
              <button
                type="button"
                className="btn-flash-flip"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
              >
                🔄 Flip Card (Space)
              </button>
              <button
                type="button"
                className="btn-flash-nav"
                onClick={nextFlashcard}
              >
                Next Card →
              </button>
            </div>
          </div>
        )
      ) : (
        /* Paywall Locked Teaser */
        <div className="locked-chapter-banner">
          <span className="lock-icon">🔒</span>
          <h2>Unlock 1-Page Cheatsheet &amp; Flashcards for {activeChapter.chapterTitle}</h2>
          <p>
            Get the full high-density printable sheet, master formula vault, negative-marking trap alerts,
            and interactive flashcards for just ₹49.
          </p>
          <button
            type="button"
            className="btn-unlock-chapter"
            onClick={() => setIsPaywallOpen(true)}
          >
            ⚡ Unlock All Chapters (₹49) →
          </button>
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
        initialProductKey={FORMULA_CHEATSHEET_PACK_KEY}
      />

      <style jsx>{`
        .cheatsheet-viewer-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 1.5rem 1rem 5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .cheatsheet-hero {
          margin-bottom: 2rem;
        }
        .hero-eyebrow-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .hero-badge {
          background: #effaf3;
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
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
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
        .btn-print-sheet {
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
        .controls-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .view-mode-tabs {
          display: flex;
          gap: 0.5rem;
        }
        .mode-btn {
          background: #fff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.55rem 1rem;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .mode-btn.active {
          background: #171513;
          color: #fff;
          box-shadow: 3px 3px 0 #c95014;
        }
        .subject-filter-tabs {
          display: flex;
          gap: 0.4rem;
        }
        .filter-btn {
          background: #fff;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          padding: 0.4rem 0.8rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          color: #555;
        }
        .filter-btn.active {
          background: #333;
          color: #fff;
          border-color: #333;
        }
        .chapter-pills-scroll {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .chapter-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          border: 1.5px solid #ddd;
          background: #fff;
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.82rem;
          font-weight: 700;
          color: #444;
          transition: all 0.12s ease;
        }
        .chapter-pill-btn:hover {
          border-color: #c95014;
        }
        .chapter-pill-btn.active {
          background: #171513;
          color: #fff;
          border-color: #171513;
        }
        .pill-ch-num {
          font-weight: 900;
          color: #c95014;
        }
        .chapter-pill-btn.active .pill-ch-num {
          color: #fde047;
        }
        .pill-badge {
          font-size: 0.65rem;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }
        .pill-badge.free { background: #fef08a; color: #854d0e; }
        .pill-badge.unlocked { color: #0b7a48; }
        .pill-badge.locked { opacity: 0.7; }
        .printable-sheet-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          padding: 2rem 2.25rem;
          box-shadow: 6px 6px 0 #171513;
          user-select: none;
          -webkit-user-select: none;
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
          padding: 0.4rem 0.8rem;
          font-size: 0.75rem;
          color: #475569;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .license-tag {
          font-weight: 800;
          color: #0b7a48;
          font-size: 0.7rem;
          text-transform: uppercase;
        }
        .sheet-header {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #171513;
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
        }
        .sheet-subject-tag {
          font-size: 0.75rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #c95014;
        }
        .sheet-title {
          font-size: 1.6rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.3rem;
        }
        .sheet-summary {
          font-size: 0.9rem;
          color: #666;
          margin: 0;
        }
        .btn-print-mini {
          background: #0b7a48;
          color: #fff;
          border: 2px solid #0b7a48;
          border-radius: 8px;
          padding: 0.45rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .btn-print-mini:hover {
          background: #08633a;
        }
        .sheet-section {
          position: relative;
          z-index: 2;
          margin-bottom: 1.5rem;
        }
        .section-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 900;
          color: #171513;
          margin-bottom: 0.6rem;
        }
        .rules-list, .traps-list {
          margin: 0;
          padding-left: 1.25rem;
          font-size: 0.9rem;
          color: #333;
          line-height: 1.5;
        }
        .formulas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }
        .formula-card-item {
          background: #faf8f5;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          user-select: none;
        }
        .formula-card-label {
          font-size: 0.82rem;
          font-weight: 800;
          color: #171513;
        }
        .formula-math-render {
          font-size: 1.15rem;
          margin: 0.2rem 0;
        }
        .formula-card-notes {
          font-size: 0.75rem;
          color: #666;
          margin-top: auto;
        }
        .traps-section {
          background: #fff8f0;
          border: 1.5px solid #fed7aa;
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }
        .trap-label {
          color: #c25e00;
        }
        .sheet-print-footer {
          position: relative;
          z-index: 2;
          margin-top: 2rem;
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
        .flashcard-mode-container {
          max-width: 620px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          user-select: none;
        }
        .flashcard-status-bar {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 800;
          color: #666;
        }
        .flashcard-3d-box {
          width: 100%;
          min-height: 280px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flashcard-inner {
          position: relative;
          width: 100%;
          min-height: 280px;
          text-align: center;
          transition: transform 0.4s ease;
          transform-style: preserve-3d;
          border-radius: 20px;
        }
        .flashcard-3d-box.flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        .flashcard-front, .flashcard-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          padding: 2rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          box-shadow: 6px 6px 0 #171513;
        }
        .flashcard-back {
          transform: rotateY(180deg);
          background: #f0fdf4;
          border-color: #10b981;
          box-shadow: 6px 6px 0 #10b981;
        }
        .card-face-badge {
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          background: #ffe9b8;
          color: #171513;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
        }
        .back-badge {
          background: #d1fae5;
          color: #065f46;
        }
        .card-prompt-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: #171513;
          line-height: 1.4;
          margin: auto 0;
        }
        .card-answer-text {
          font-size: 1.2rem;
          font-weight: 800;
          color: #065f46;
          line-height: 1.4;
          margin: auto 0;
        }
        .flip-hint {
          font-size: 0.75rem;
          color: #888;
        }
        .flashcard-nav-buttons {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          justify-content: center;
        }
        .btn-flash-nav {
          background: #fff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.6rem 1rem;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .btn-flash-nav:hover {
          background: #f4eee3;
        }
        .btn-flash-flip {
          background: #171513;
          color: #fff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.6rem 1.25rem;
          font-size: 0.88rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 2px 2px 0 #c95014;
        }
        .locked-chapter-banner {
          background: #fff8f2;
          border: 2px dashed #c95014;
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
        }
        .lock-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .locked-chapter-banner h2 {
          font-size: 1.45rem;
          font-weight: 900;
          color: #171513;
          margin: 0 0 0.5rem;
        }
        .locked-chapter-banner p {
          font-size: 0.95rem;
          color: #666;
          margin: 0 0 1.5rem;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
        }
        .btn-unlock-chapter {
          background: #c95014;
          color: #fff;
          border: 2.5px solid #171513;
          border-radius: 12px;
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 4px 4px 0 #171513;
          transition: all 0.12s ease;
        }
        .btn-unlock-chapter:hover {
          background: #b0410b;
        }
        @media print {
          .no-print, .controls-toolbar, .chapter-pills-scroll, .cheatsheet-hero, .hero-cta-card, .flashcard-nav-buttons, .flashcard-status-bar {
            display: none !important;
          }
          .printable-sheet-card {
            border: 1.5px solid #000 !important;
            box-shadow: none !important;
            padding: 1.25rem !important;
            page-break-inside: avoid;
          }
          .watermark-overlay {
            opacity: 0.08 !important;
            font-size: 2.8rem !important;
          }
          .sheet-print-footer {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
