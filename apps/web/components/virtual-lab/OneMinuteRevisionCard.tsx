'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  Printer,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { ONE_MINUTE_REVISION_CARDS } from './data/examQuestionsData';

export interface OneMinuteRevisionCardProps {
  experiment: 'magnesium' | 'prism' | 'heart';
}

export function OneMinuteRevisionCard({ experiment }: OneMinuteRevisionCardProps) {
  const card = ONE_MINUTE_REVISION_CARDS[experiment];
  const [copied, setCopied] = useState(false);

  if (!card) return null;

  const handleCopySummary = () => {
    let text = `=====================================================\n`;
    text += `⚡ 1-MINUTE CBSE BOARD EXAM CHEAT SHEET\n`;
    text += `${card.title} (${card.chapter})\n`;
    text += `NCERT Activity: ${card.ncertActivity}\n`;
    text += `=====================================================\n\n`;

    if (card.reactionEquation) {
      text += `🧪 Balanced Chemical Equation:\n${card.reactionEquation}\n\n`;
    }
    if (card.physicsFormula) {
      text += `📐 Governing Formula:\n${card.physicsFormula}\n\n`;
    }

    text += `📊 KEY OBSERVATION SUMMARY:\n`;
    card.summaryRows.forEach((row) => {
      text += `• ${row.label}: ${row.value}\n`;
    });

    text += `\n💡 KEY SCIENTIFIC INFERENCES:\n`;
    card.keyInferences.forEach((inf, i) => {
      text += `${i + 1}. ${inf}\n`;
    });

    text += `\n⚠️ TOP BOARD EXAM PRECAUTIONS:\n`;
    card.boardPrecautions.forEach((p, i) => {
      text += `${i + 1}. ${p}\n`;
    });

    text += `\n🚨 EXAMINER TRAPS TO AVOID:\n`;
    card.topExaminerTraps.forEach((trap) => {
      text += `• ${trap}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="vlab-revision-card-wrapper">
      {/* Top Banner & Action Controls */}
      <div className="vlab-rev-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div className="vlab-rev-badge-icon">
            <Zap size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem' }}>
              <span className="vlab-rev-subject-pill">{card.subject}</span>
              <span className="vlab-rev-activity-tag">{card.ncertActivity}</span>
              <span className="vlab-rev-time-badge">
                <Clock size={12} /> 1-Min Board Revision
              </span>
            </div>
            <h3 className="vlab-rev-title">{card.title}</h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={handleCopySummary} className="vlab-rev-btn" title="Copy text cheat sheet">
            {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button onClick={handlePrint} className="vlab-rev-btn vlab-rev-print-btn" title="Print revision sheet">
            <Printer size={14} />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Chemical Equation or Formula Highlight Bar */}
      {(card.reactionEquation || card.physicsFormula) && (
        <div className="vlab-rev-formula-banner">
          <div className="vlab-rev-formula-label">
            <Sparkles size={14} color="#f97316" />
            <span>Master Exam Equation / Formula:</span>
          </div>
          <div className="vlab-rev-formula-code">
            {card.reactionEquation || card.physicsFormula}
          </div>
        </div>
      )}

      {/* High-Yield Structured Observation Table */}
      <div className="vlab-rev-table-container">
        <table className="vlab-rev-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Exam Parameter</th>
              <th style={{ width: '70%' }}>Exact NCERT Board Observation &amp; Keyword</th>
            </tr>
          </thead>
          <tbody>
            {card.summaryRows.map((row, idx) => (
              <tr key={idx} className={row.isHighlight ? 'is-highlight-row' : ''}>
                <td className="vlab-rev-param-cell">
                  {row.isHighlight && <span className="vlab-rev-star">★ </span>}
                  {row.label}
                </td>
                <td className="vlab-rev-val-cell">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3-Column Quick Takeaways Grid */}
      <div className="vlab-rev-grid">
        {/* Column 1: Inferences */}
        <div className="vlab-rev-col-card col-inferences">
          <div className="vlab-rev-col-title">
            <ShieldCheck size={16} color="#059669" />
            <span>Key Scientific Inferences</span>
          </div>
          <ul className="vlab-rev-col-list">
            {card.keyInferences.map((inf, i) => (
              <li key={i}>{inf}</li>
            ))}
          </ul>
        </div>

        {/* Column 2: Board Precautions */}
        <div className="vlab-rev-col-card col-precautions">
          <div className="vlab-rev-col-title">
            <FileText size={16} color="#0284c7" />
            <span>Mandatory Lab Precautions</span>
          </div>
          <ul className="vlab-rev-col-list">
            {card.boardPrecautions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {/* Column 3: Examiner Traps */}
        <div className="vlab-rev-col-card col-traps">
          <div className="vlab-rev-col-title">
            <AlertTriangle size={16} color="#ea580c" />
            <span>Top Examiner Traps to Avoid</span>
          </div>
          <ul className="vlab-rev-col-list">
            {card.topExaminerTraps.map((trap, i) => (
              <li key={i}>{trap}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
