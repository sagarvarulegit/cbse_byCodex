'use client';

import React from 'react';

type StepItem = {
  markBadge: string | null;
  isExaminerNote: boolean;
  content: string;
};

function parseValuePoint(rawPoint: string): StepItem {
  const trimmed = rawPoint.trim();

  // Check for Examiner Note / Warning
  if (
    trimmed.startsWith('⚠️') ||
    trimmed.toLowerCase().startsWith('examiner note:') ||
    trimmed.toLowerCase().startsWith('note:') ||
    trimmed.toLowerCase().startsWith('penalty:')
  ) {
    return {
      markBadge: null,
      isExaminerNote: true,
      content: trimmed.replace(/^⚠️\s*/, '').replace(/^(examiner note:|note:|penalty:)\s*/i, ''),
    };
  }

  // Check for leading [+1.0 Mark] or [+0.5 Mark] or [1 Mark] or (1/2 Mark) pattern
  const leadingMatch = trimmed.match(/^\[\+?([0-9.]+(?:\/[0-9.]+)?)\s*(?:Marks?|m)?\]\s*(.*)$/i);
  if (leadingMatch) {
    return {
      markBadge: `+${leadingMatch[1]}m`,
      isExaminerNote: false,
      content: leadingMatch[2],
    };
  }

  // Check for trailing [1 mark] or [1/2 mark] or [0.5 mark] or [2 marks]
  const trailingMatch = trimmed.match(/^(.*?)\s*\[\+?([0-9.]+(?:\/[0-9.]+)?)\s*(?:Marks?|m)?\]\.?$/i);
  if (trailingMatch) {
    return {
      markBadge: `+${trailingMatch[2]}m`,
      isExaminerNote: false,
      content: trailingMatch[1],
    };
  }

  return {
    markBadge: null,
    isExaminerNote: false,
    content: trimmed,
  };
}

export default function MarkingSchemeRubric({
  valuePoints,
  totalMarks,
  modelAnswer,
  isMcq = false,
  correctOptionText,
}: {
  valuePoints: string[];
  totalMarks?: number;
  modelAnswer?: string | null;
  isMcq?: boolean;
  correctOptionText?: string | null;
}) {
  const steps = valuePoints.map(parseValuePoint);

  return (
    <div className="cbse-rubric-card">
      <div className="cbse-rubric-header">
        <div className="cbse-rubric-title">
          <span className="cbse-rubric-icon">⚖️</span>
          <strong>How CBSE Grades This</strong>
          <span className="cbse-rubric-pill">Official Step Marking</span>
        </div>
        {totalMarks !== undefined && (
          <span className="cbse-rubric-total">Max: {totalMarks} Mark{totalMarks > 1 ? 's' : ''}</span>
        )}
      </div>

      {isMcq && correctOptionText && (
        <div className="cbse-rubric-mcq-verdict">
          <span className="cbse-badge-correct">✓ Correct Option</span>
          <span className="cbse-mcq-answer">{correctOptionText}</span>
        </div>
      )}

      {!isMcq && modelAnswer && (
        <div className="cbse-rubric-model-answer">
          <span className="cbse-model-tag">Model Solution:</span>
          <p>{modelAnswer}</p>
        </div>
      )}

      {steps.length > 0 && (
        <div className="cbse-rubric-steps">
          <span className="cbse-steps-label">Step-by-Step Value Points:</span>
          <ol className="cbse-steps-list">
            {steps.map((step, idx) => (
              <li
                key={idx}
                className={step.isExaminerNote ? 'cbse-step-item cbse-step-warning' : 'cbse-step-item'}
              >
                {step.markBadge && (
                  <span className="cbse-step-mark-badge">{step.markBadge}</span>
                )}
                {step.isExaminerNote && (
                  <span className="cbse-step-warning-badge">⚠️ Examiner Tip</span>
                )}
                <span className="cbse-step-text">{step.content}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <style jsx>{`
        .cbse-rubric-card {
          margin-top: 0.85rem;
          padding: 0.9rem 1.1rem;
          background: #fdfbf7;
          border: 1px solid #eadbc8;
          border-left: 4px solid #d97706;
          border-radius: 8px;
          font-size: 0.92rem;
        }
        .cbse-rubric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f3e8d9;
          margin-bottom: 0.65rem;
        }
        .cbse-rubric-title {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          color: #92400e;
        }
        .cbse-rubric-icon {
          font-size: 1rem;
        }
        .cbse-rubric-pill {
          font-size: 0.72rem;
          background: #fef3c7;
          color: #b45309;
          font-weight: 600;
          padding: 0.15rem 0.45rem;
          border-radius: 999px;
          border: 1px solid #fde68a;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .cbse-rubric-total {
          font-size: 0.8rem;
          font-weight: 600;
          color: #78350f;
          background: #fffbeb;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }
        .cbse-rubric-mcq-verdict {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }
        .cbse-badge-correct {
          background: #dcfce7;
          color: #166534;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }
        .cbse-mcq-answer {
          font-weight: 600;
          color: #1e293b;
        }
        .cbse-rubric-model-answer {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.6rem 0.8rem;
          margin-bottom: 0.7rem;
        }
        .cbse-model-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 0.25rem;
        }
        .cbse-rubric-model-answer p {
          margin: 0;
          color: #0f172a;
          line-height: 1.5;
        }
        .cbse-steps-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #78350f;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 0.4rem;
        }
        .cbse-steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .cbse-step-item {
          display: flex;
          align-items: flex-start;
          gap: 0.55rem;
          padding: 0.35rem 0.5rem;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 6px;
          line-height: 1.45;
        }
        .cbse-step-warning {
          background: #fffbeb;
          border-color: #fde68a;
        }
        .cbse-step-mark-badge {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .cbse-step-warning-badge {
          background: #fef3c7;
          color: #b45309;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .cbse-step-text {
          color: #334155;
          font-size: 0.88rem;
        }
      `}</style>
    </div>
  );
}
