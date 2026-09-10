'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import { PAST_BOARD_QUESTIONS, BoardQuestion } from './data/examQuestionsData';

export interface CbsePastQuestionsAccordionProps {
  experiment: 'magnesium' | 'prism' | 'heart';
}

export function CbsePastQuestionsAccordion({ experiment }: CbsePastQuestionsAccordionProps) {
  const questions = PAST_BOARD_QUESTIONS[experiment] || [];
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ [questions[0]?.id || '']: true });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (q: BoardQuestion) => {
    const text = `CBSE Board Exam Question (${q.year} - ${q.marks} Marks)\n\nQuestion:\n${q.question}\n\nModel Answer:\n${q.modelAnswer}\n\nMarking Scheme:\n${q.markingScheme.map((s) => `• ${s.step} [${s.marks} Marks]`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredQuestions = selectedType === 'all'
    ? questions
    : questions.filter((q) => q.type.toLowerCase() === selectedType.toLowerCase());

  return (
    <div className="vlab-board-questions-panel">
      {/* Header with Title & Filter Pills */}
      <div className="vlab-bq-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div className="vlab-bq-icon-badge">
            <BookOpen size={18} color="#bd4f10" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 className="vlab-bq-title">CBSE 5-Year Past Board Questions (2020–2024)</h3>
              <span className="vlab-bq-badge">{questions.length} Questions</span>
            </div>
            <p className="vlab-bq-subtitle">
              Actual Class 10 board questions, marking scheme point breakdowns, and examiner trap alerts.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="vlab-bq-filters">
          {['all', 'Observation', 'Reasoning', 'Equation', 'Diagram', 'Case-Based'].map((type) => {
            const count = type === 'all' ? questions.length : questions.filter((q) => q.type.toLowerCase() === type.toLowerCase()).length;
            if (count === 0 && type !== 'all') return null;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`vlab-bq-filter-btn ${selectedType === type ? 'is-active' : ''}`}
              >
                {type === 'all' ? 'All Questions' : type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion Question List */}
      <div className="vlab-bq-list">
        {filteredQuestions.map((q) => {
          const isOpen = !!openIds[q.id];
          return (
            <div key={q.id} className={`vlab-bq-card ${isOpen ? 'is-expanded' : ''}`}>
              {/* Card Header */}
              <div className="vlab-bq-card-header" onClick={() => toggleOpen(q.id)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                  <div className="vlab-bq-mark-pill">
                    <Award size={13} color="#ea580c" />
                    <span>{q.marks} {q.marks === 1 ? 'Mark' : 'Marks'}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                      <span className="vlab-bq-year-tag">{q.year}</span>
                      <span className="vlab-bq-type-tag">{q.type}</span>
                    </div>
                    <p className="vlab-bq-question-text">{q.question}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(q);
                    }}
                    className="vlab-bq-copy-btn"
                    title="Copy question and answer"
                  >
                    {copiedId === q.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                    <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                      {copiedId === q.id ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                  <div className="vlab-bq-toggle-icon">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>

              {/* Collapsible Answer & Marking Scheme Body */}
              {isOpen && (
                <div className="vlab-bq-card-body">
                  {/* Trap Alert Banner if exists */}
                  {q.trapAlert && (
                    <div className="vlab-bq-trap-alert">
                      <AlertTriangle size={15} color="#c2410c" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong>Examiner Trap / Common Mistake:</strong> {q.trapAlert}
                      </div>
                    </div>
                  )}

                  {/* Model Answer */}
                  <div className="vlab-bq-answer-section">
                    <div className="vlab-bq-section-title">
                      <CheckCircle2 size={15} color="#059669" />
                      <span>CBSE Official Model Answer</span>
                    </div>
                    <div className="vlab-bq-answer-content">
                      {q.modelAnswer.split('\n').map((para, i) => (
                        <p key={i} style={{ margin: para ? '0 0 0.45rem 0' : 0 }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Step-by-Step Marking Scheme Breakdown */}
                  <div className="vlab-bq-marking-section">
                    <div className="vlab-bq-section-title">
                      <Award size={15} color="#d97706" />
                      <span>CBSE Examiner Marking Scheme Breakdown</span>
                    </div>
                    <div className="vlab-bq-marking-steps">
                      {q.markingScheme.map((item, idx) => (
                        <div key={idx} className="vlab-bq-marking-step-row">
                          <span className="vlab-bq-step-bullet">Step {idx + 1}</span>
                          <span className="vlab-bq-step-desc">{item.step}</span>
                          <span className="vlab-bq-step-score">+{item.marks} M</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
