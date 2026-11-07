'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Close sheet on route navigation
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);

  // Prevent background scroll when more drawer is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const isHomeActive = pathname === '/' || pathname === '/dashboard';
  const isSubjectsActive = pathname.startsWith('/subjects') || pathname.startsWith('/chapters');
  const isQuestionsActive = pathname.startsWith('/questions');
  const isMocksActive = pathname.startsWith('/exam-papers');
  const isMoreActive =
    pathname.startsWith('/tools') ||
    pathname.startsWith('/formula-cheatsheets') ||
    pathname.startsWith('/activities-and-diagrams') ||
    pathname.startsWith('/virtual-lab') ||
    pathname.startsWith('/games') ||
    pathname.startsWith('/store') ||
    pathname.startsWith('/my-mistakes') ||
    pathname.startsWith('/parent-summary');

  return (
    <>
      {/* 5-Tab Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <Link
          href="/dashboard"
          className={`nav-tab ${isHomeActive ? 'active' : ''}`}
          aria-label="Dashboard"
          aria-current={isHomeActive ? 'page' : undefined}
        >
          <span className="tab-icon">🏠</span>
          <span className="tab-label">Home</span>
        </Link>

        <Link
          href="/subjects"
          className={`nav-tab ${isSubjectsActive ? 'active' : ''}`}
          aria-label="Subjects"
          aria-current={isSubjectsActive ? 'page' : undefined}
        >
          <span className="tab-icon">📚</span>
          <span className="tab-label">Subjects</span>
        </Link>

        <Link
          href="/questions"
          className={`nav-tab ${isQuestionsActive ? 'active' : ''}`}
          aria-label="PYQs & Exemplar Question Bank"
          aria-current={isQuestionsActive ? 'page' : undefined}
        >
          <span className="tab-icon">📝</span>
          <span className="tab-label">PYQ Bank</span>
        </Link>

        <Link
          href="/exam-papers"
          className={`nav-tab ${isMocksActive ? 'active' : ''}`}
          aria-label="Mock Test Papers"
          aria-current={isMocksActive ? 'page' : undefined}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-label">Mocks</span>
        </Link>

        <button
          type="button"
          className={`nav-tab ${sheetOpen || isMoreActive ? 'active' : ''}`}
          onClick={() => setSheetOpen((prev) => !prev)}
          aria-label="More study tools"
          aria-expanded={sheetOpen}
        >
          <span className="tab-icon">{sheetOpen ? '✕' : '✨'}</span>
          <span className="tab-label">More</span>
        </button>
      </nav>

      {/* Slide-Up Bottom Sheet for More Tools */}
      {sheetOpen && (
        <div
          className="bottom-sheet-overlay"
          onClick={() => setSheetOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Study tools and resources"
        >
          <div className="bottom-sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div>
                <strong>Study Hub &amp; Special Vaults</strong>
                <span>Class 10 CBSE Quick Access</span>
              </div>
              <button
                type="button"
                className="sheet-close-btn"
                onClick={() => setSheetOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="sheet-grid">
              <Link href="/formula-cheatsheets" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">⚡</span>
                <div className="sheet-item-text">
                  <strong>Formula Cheatsheets</strong>
                  <span>1-Page Maths &amp; Science summary</span>
                </div>
              </Link>

              <Link href="/activities-and-diagrams" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">🔬</span>
                <div className="sheet-item-text">
                  <strong>NCERT Activities</strong>
                  <span>Lab setups, observations &amp; diagrams</span>
                </div>
              </Link>

              <Link href="/virtual-lab" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">🧪</span>
                <div className="sheet-item-text">
                  <strong>3D Virtual Science Lab</strong>
                  <span>Interactive 3D atoms, heart &amp; prism</span>
                </div>
              </Link>

              <Link href="/tools/readiness-predictor" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">🎯</span>
                <div className="sheet-item-text">
                  <strong>Board Score Predictor</strong>
                  <span>Forecast your 2027 board percentage</span>
                </div>
              </Link>

              <Link href="/tools/trig-magic-hexagon" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">📐</span>
                <div className="sheet-item-text">
                  <strong>Trig Magic Hexagon</strong>
                  <span>All 20+ identities in 1 mnemonic</span>
                </div>
              </Link>

              <Link href="/games" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">🎮</span>
                <div className="sheet-item-text">
                  <strong>Fun &amp; Games Arcade</strong>
                  <span>Equation Balancer &amp; Formula Rush</span>
                </div>
              </Link>

              <Link href="/store" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">🛍️</span>
                <div className="sheet-item-text">
                  <strong>ChapterReady Store</strong>
                  <span>Specialized revision packs (&lt; ₹200)</span>
                </div>
              </Link>

              <Link href="/my-mistakes" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">❌</span>
                <div className="sheet-item-text">
                  <strong>My Mistakes Notebook</strong>
                  <span>Review &amp; re-solve failed questions</span>
                </div>
              </Link>

              <Link href="/parent-summary" className="sheet-item" onClick={() => setSheetOpen(false)}>
                <span className="sheet-item-icon">👨‍👩‍👧</span>
                <div className="sheet-item-text">
                  <strong>Parent Progress Summary</strong>
                  <span>Weekly study report &amp; WhatsApp card</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Hidden on Desktop */
        .mobile-bottom-nav,
        .bottom-sheet-overlay {
          display: none;
        }

        /* Mobile Viewport Display */
        @media (max-width: 760px) {
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 900;
            height: calc(58px + env(safe-area-inset-bottom, 0px));
            padding-bottom: env(safe-area-inset-bottom, 0px);
            background: rgba(255, 253, 248, 0.96);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-top: 2px solid #171513;
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            align-items: center;
            box-shadow: 0 -4px 16px rgba(23, 21, 19, 0.08);
          }

          .nav-tab {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            background: none;
            border: none;
            padding: 4px 2px;
            color: #78716c;
            text-decoration: none;
            cursor: pointer;
            transition: color 120ms ease, transform 100ms ease;
          }

          .nav-tab:active {
            transform: scale(0.94);
          }

          .tab-icon {
            font-size: 19px;
            line-height: 1.1;
            margin-bottom: 2px;
          }

          .tab-label {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: -0.01em;
            white-space: nowrap;
          }

          .nav-tab.active {
            color: #c25010;
          }

          .nav-tab.active .tab-label {
            font-weight: 900;
            color: #171513;
          }

          /* Bottom Sheet Overlay */
          .bottom-sheet-overlay {
            position: fixed;
            inset: 0;
            background: rgba(23, 21, 19, 0.6);
            backdrop-filter: blur(4px);
            z-index: 1000;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            animation: fadeIn 150ms ease-out;
          }

          .bottom-sheet-card {
            width: 100%;
            max-height: 80vh;
            background: #fffdf8;
            border-top: 3px solid #171513;
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.2);
            padding: 12px 16px calc(24px + env(safe-area-inset-bottom, 0px));
            overflow-y: auto;
            animation: slideUp 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
          }

          .sheet-handle {
            width: 44px;
            height: 4px;
            background: #d6d3d1;
            border-radius: 999px;
            margin: 0 auto 12px;
          }

          .sheet-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 1.5px solid #e7e5e4;
          }

          .sheet-header strong {
            display: block;
            font-size: 15px;
            color: #171513;
          }

          .sheet-header span {
            display: block;
            font-size: 11px;
            color: #78716c;
            font-weight: 600;
          }

          .sheet-close-btn {
            background: #f5f5f4;
            border: 1.5px solid #171513;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
          }

          .sheet-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .sheet-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px;
            background: #fff;
            border: 1.5px solid #e7e5e4;
            border-radius: 12px;
            text-decoration: none;
            transition: border-color 100ms, background-color 100ms;
          }

          .sheet-item:active {
            border-color: #171513;
            background: #fff8e6;
          }

          .sheet-item-icon {
            font-size: 20px;
            line-height: 1;
            flex-shrink: 0;
            padding-top: 1px;
          }

          .sheet-item-text strong {
            display: block;
            font-size: 12.5px;
            color: #171513;
            line-height: 1.25;
            margin-bottom: 2px;
          }

          .sheet-item-text span {
            display: block;
            font-size: 10px;
            color: #78716c;
            line-height: 1.2;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* Never show in print media */
        @media print {
          .mobile-bottom-nav,
          .bottom-sheet-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
