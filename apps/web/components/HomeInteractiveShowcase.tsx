'use client';

import { useState } from 'react';
import Link from 'next/link';

type TabKey = 'notes' | 'diagrams' | 'exam' | 'mistakes';

export default function HomeInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>('notes');

  return (
    <div className="hero-showcase-card">
      <div className="showcase-header">
        <div className="showcase-tab-bar" role="tablist" aria-label="Interactive Product Preview">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'notes'}
            className={`showcase-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            📖 Simplified Notes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'diagrams'}
            className={`showcase-tab ${activeTab === 'diagrams' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagrams')}
          >
            🔬 Redrawn Diagrams
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'exam'}
            className={`showcase-tab ${activeTab === 'exam' ? 'active' : ''}`}
            onClick={() => setActiveTab('exam')}
          >
            ⏱️ 3-Hr CBT Exam
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'mistakes'}
            className={`showcase-tab ${activeTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => setActiveTab('mistakes')}
          >
            🎯 Mistake Vault
          </button>
        </div>
      </div>

      <div className="showcase-body">
        {activeTab === 'notes' && (
          <div className="preview-pane pane-notes">
            <div className="preview-pane-topline">
              <span className="badge-ncert">NCERT 1.1 · Chemical Reactions</span>
              <span className="badge-time">⚡ 2 min read</span>
            </div>

            <div className="notes-compare-grid">
              <div className="notes-compare-box textbook-old">
                <span className="box-tag text-muted">❌ Dense Textbook Paragraph</span>
                <p className="box-text text-striked">
                  &ldquo;A chemical reaction is a process that leads to the chemical transformation of one set of substances into another involving the breaking and making of bonds between atoms...&rdquo;
                </p>
              </div>

              <div className="notes-compare-box chapterready-new">
                <span className="box-tag text-highlight">✨ ChapterReady Simplified</span>
                <div className="simplified-points">
                  <div className="point-item">
                    <span className="bullet">⭐</span>
                    <div>
                      <strong>Core Concept:</strong> Old bonds break &rarr; new bonds form &rarr; <em>brand new substance created!</em>
                    </div>
                  </div>
                  <div className="point-item">
                    <span className="bullet">💡</span>
                    <div>
                      <strong>4 Instant Signs to Spot a Reaction:</strong>
                      <div className="pill-row">
                        <span className="pill-tag">🎨 Color Change</span>
                        <span className="pill-tag">💨 Gas Released</span>
                        <span className="pill-tag">🌡️ Temp Change</span>
                        <span className="pill-tag">💧 State Change</span>
                      </div>
                    </div>
                  </div>
                  <div className="memory-trick">
                    🧠 <strong>Memory Hook:</strong> Remember <code>C-G-T-S</code> (Color, Gas, Temp, State)
                  </div>
                </div>
              </div>
            </div>

            <div className="pane-footer">
              <Link href="/chapters/chemical-reactions-and-equations/notes" className="preview-action-btn">
                Read Sample Chapter Notes &rarr;
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'diagrams' && (
          <div className="preview-pane pane-diagrams">
            <div className="preview-pane-topline">
              <span className="badge-ncert">Science Activity 1.1 · Vector Diagram</span>
              <span className="badge-time">High Exam Yield</span>
            </div>

            <div className="diagram-card-mockup">
              <div className="diagram-visual-header">
                <strong>Activity 1.1: Burning of Magnesium Ribbon in Air</strong>
              </div>
              
              <div className="diagram-pins-container">
                <div className="pin-item">
                  <span className="pin-num">1</span>
                  <div className="pin-desc">
                    <strong>Clean Ribbon:</strong> Rub with sandpaper to remove protective MgCO₃ layer.
                  </div>
                </div>
                <div className="pin-item">
                  <span className="pin-num">2</span>
                  <div className="pin-desc">
                    <strong>Observation:</strong> Burns with a <strong>dazzling white flame</strong>.
                  </div>
                </div>
                <div className="pin-item">
                  <span className="pin-num">3</span>
                  <div className="pin-desc">
                    <strong>Product:</strong> White powder of <strong>Magnesium Oxide (MgO)</strong> collected.
                  </div>
                </div>
              </div>

              <div className="diagram-equation-box">
                <code>2Mg(s) + O₂(g) &rarr; 2MgO(s) (Combination & Exothermic)</code>
              </div>
            </div>

            <div className="pane-footer">
              <Link href="/activities-and-diagrams" className="preview-action-btn">
                Explore Redrawn Activity Diagrams &rarr;
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'exam' && (
          <div className="preview-pane pane-exam">
            <div className="preview-pane-topline">
              <span className="badge-cbt">⏱️ CBT Exam Simulator (80 Marks)</span>
              <span className="cbt-timer">⏳ Time Left: 02:44:18</span>
            </div>

            <div className="exam-sample-question">
              <div className="question-header">
                <span className="q-badge">Section B · Q19 [3 Marks]</span>
                <span className="q-subject">Science (086)</span>
              </div>
              <p className="q-prompt">
                Why does the color of copper sulphate solution change when an iron nail is dipped in it? Write the balanced chemical equation.
              </p>

              <div className="marking-scheme-preview">
                <div className="ms-title">📝 Official CBSE Step-Wise Marking Scheme:</div>
                <ul className="ms-points">
                  <li>
                    <span className="pts">+1 Mark</span> Iron is more reactive than copper, displacing Cu from CuSO₄ (Displacement Reaction).
                  </li>
                  <li>
                    <span className="pts">+1 Mark</span> Blue color turns light green due to formation of FeSO₄ (Ferrous sulphate).
                  </li>
                  <li>
                    <span className="pts">+1 Mark</span> Balanced Equation: Fe(s) + CuSO₄(aq) &rarr; FeSO₄(aq) + Cu(s).
                  </li>
                </ul>
              </div>
            </div>

            <div className="pane-footer">
              <Link href="/exam-papers" className="preview-action-btn">
                Launch Free 3-Hour Board Mock Exam &rarr;
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="preview-pane pane-mistakes">
            <div className="preview-pane-topline">
              <span className="badge-vault">🎯 Automatic Mistake Vault</span>
              <span className="badge-time">Spaced Repetition Active</span>
            </div>

            <div className="mistake-item-card">
              <div className="mistake-status-tag">⚠️ Weak Area Identified</div>
              <div className="mistake-topic">
                <strong>Maths Standard · Chapter 1: Real Numbers</strong>
                <p>Fundamental Theorem of Arithmetic (HCF &times; LCM formula missed in Practice Quiz 1)</p>
              </div>

              <div className="spaced-retry-schedule">
                <div className="schedule-step done">
                  <span>Day 1</span>
                  <strong>Quiz Error</strong>
                </div>
                <div className="schedule-arrow">&rarr;</div>
                <div className="schedule-step active">
                  <span>Day 3</span>
                  <strong>Spaced Retry (Today)</strong>
                </div>
                <div className="schedule-arrow">&rarr;</div>
                <div className="schedule-step pending">
                  <span>Day 7</span>
                  <strong>Mastery Check</strong>
                </div>
              </div>

              <div className="mistake-fix-tip">
                💡 <strong>Quick Fix:</strong> Remember HCF(a, b) &times; LCM(a, b) = a &times; b applies <em>only</em> for two positive integers.
              </div>
            </div>

            <div className="pane-footer">
              <Link href="/dashboard" className="preview-action-btn">
                View Your Dashboard & Mastery &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
