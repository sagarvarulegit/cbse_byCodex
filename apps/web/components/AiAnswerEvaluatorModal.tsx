'use client';

import React, { useState } from 'react';
import { evaluateStudentAnswer, type EvaluateAnswerResult } from '../lib/evaluator';

export type AiAnswerEvaluatorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
  questionStem: string;
  maxMarks: number;
  officialValuePoints: string[];
  modelAnswer?: string;
  token?: string | null;
};

export default function AiAnswerEvaluatorModal({
  isOpen,
  onClose,
  questionId,
  questionStem,
  maxMarks,
  officialValuePoints,
  modelAnswer,
  token,
}: AiAnswerEvaluatorModalProps) {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [answerText, setAnswerText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluateAnswerResult | null>(null);

  if (!isOpen) return null;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setImagePreview(res);
      setImageBase64(res);
    };
    reader.readAsDataURL(file);
  }

  async function handleGradeSubmit() {
    if (mode === 'text' && answerText.trim().length < 10) {
      setError('Please enter at least a short response to evaluate.');
      return;
    }
    if (mode === 'image' && !imageBase64) {
      setError('Please upload or snap a photo of your written answer.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const evaluation = await evaluateStudentAnswer(
        {
          questionId,
          questionStem,
          maxMarks,
          studentAnswerText: mode === 'text' ? answerText.trim() : undefined,
          studentAnswerImageBase64: mode === 'image' && imageBase64 ? imageBase64 : undefined,
          officialValuePoints,
          modelAnswer,
        },
        token
      );
      setResult(evaluation);
    } catch (err: any) {
      console.error(err);
      setError('Failed to evaluate answer. Please try again or check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setAnswerText('');
    setImageBase64(null);
    setImagePreview(null);
    setError(null);
  }

  return (
    <div className="evaluator-modal-overlay" onClick={onClose}>
      <div className="evaluator-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-topbar">
          <div className="topbar-title-row">
            <span className="eval-badge">🤖 AI Snap &amp; Grade</span>
            <span className="marks-badge">{maxMarks} Marks</span>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="question-box">
          <span className="q-label">Question:</span>
          <p className="q-stem">{questionStem}</p>
        </div>

        {!result ? (
          <div className="input-container">
            <div className="tabs-row">
              <button
                type="button"
                className={`tab-btn ${mode === 'text' ? 'active' : ''}`}
                onClick={() => setMode('text')}
              >
                ✍️ Type Answer
              </button>
              <button
                type="button"
                className={`tab-btn ${mode === 'image' ? 'active' : ''}`}
                onClick={() => setMode('image')}
              >
                📸 Snap / Upload Photo
              </button>
            </div>

            {mode === 'text' ? (
              <div className="text-input-wrap">
                <textarea
                  className="answer-textarea"
                  placeholder="Type your complete answer here just as you would write in the CBSE Board exam..."
                  rows={6}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                />
                <div className="textarea-footer">
                  <span>{answerText.trim().split(/\s+/).filter(Boolean).length} Words</span>
                </div>
              </div>
            ) : (
              <div className="image-upload-wrap">
                {imagePreview ? (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Handwritten answer preview" className="uploaded-preview" />
                    <button type="button" className="btn-remove-img" onClick={() => { setImagePreview(null); setImageBase64(null); }}>
                      ✕ Change Image
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone">
                    <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <div className="dropzone-content">
                      <span className="camera-icon">📷</span>
                      <strong>Snap photo or upload handwritten notebook page</strong>
                      <span className="dropzone-subtext">JPEG, PNG or WebP · Clear handwriting recommended</span>
                    </div>
                  </label>
                )}
              </div>
            )}

            {error && <p className="error-alert">{error}</p>}

            <div className="action-row">
              <button
                type="button"
                className="btn-submit-grade"
                disabled={isLoading}
                onClick={handleGradeSubmit}
              >
                {isLoading ? '🧠 Evaluating against CBSE Marking Scheme...' : '⚖️ Check Marks with Official Rubric →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-container">
            <div className="score-hero-card">
              <div className="score-main">
                <span className="score-val">{result.marksAwarded}</span>
                <span className="score-max">/ {result.maxMarks}</span>
              </div>
              <div className="score-details">
                <h3>{result.percentageScore}% Score</h3>
                <p>{result.overallFeedback}</p>
              </div>
            </div>

            <div className="step-eval-list">
              <h4>Step-by-Step Value Point Breakdown:</h4>
              {result.stepEvaluations.map((step) => {
                const isFull = step.marksEarned >= step.allocatedMarks;
                const isZero = step.marksEarned === 0;
                return (
                  <div className={`step-item ${isFull ? 'full' : isZero ? 'zero' : 'partial'}`} key={step.stepIndex}>
                    <div className="step-topbar">
                      <span className="step-num">Step {step.stepIndex}</span>
                      <span className="step-marks-chip">
                        +{step.marksEarned} / {step.allocatedMarks} Mark
                      </span>
                    </div>
                    <p className="step-desc"><strong>Target Point:</strong> {step.pointDescription}</p>
                    <p className="step-feedback"><strong>Examiner:</strong> {step.feedback}</p>

                    {step.matchedKeywords.length > 0 && (
                      <div className="keywords-row">
                        <span className="kw-tag matched">✓ {step.matchedKeywords.join(', ')}</span>
                      </div>
                    )}
                    {step.missingKeywords.length > 0 && (
                      <div className="keywords-row">
                        <span className="kw-tag missing">✗ Missing: {step.missingKeywords.join(', ')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {result.topperWritingTips.length > 0 && (
              <div className="topper-tips-box">
                <h4>🌟 How 100/100 Toppers Write This:</h4>
                <ul>
                  {result.topperWritingTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-bottom-actions">
              <button type="button" className="btn-retry" onClick={handleReset}>
                🔄 Grade Another Attempt
              </button>
              <button type="button" className="btn-done" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          .evaluator-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(15, 23, 42, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 1rem;
          }
          .evaluator-modal-card {
            background: #ffffff;
            border-radius: 18px;
            max-width: 680px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: 1.75rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .modal-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1rem;
          }
          .topbar-title-row {
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }
          .eval-badge {
            background: #7c3aed;
            color: #ffffff;
            font-size: 0.75rem;
            font-weight: 800;
            padding: 0.25rem 0.65rem;
            border-radius: 6px;
            text-transform: uppercase;
          }
          .marks-badge {
            background: #f1f5f9;
            color: #334155;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
          }
          .btn-close {
            background: transparent;
            border: none;
            font-size: 1.2rem;
            color: #94a3b8;
            cursor: pointer;
          }
          .question-box {
            background: #f8fafc;
            border-left: 4px solid #7c3aed;
            border-radius: 0 8px 8px 0;
            padding: 0.85rem 1rem;
            margin-bottom: 1.25rem;
          }
          .q-label {
            font-size: 0.75rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
          }
          .q-stem {
            font-size: 0.95rem;
            color: #1e293b;
            margin: 0.2rem 0 0;
            line-height: 1.45;
          }
          .tabs-row {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .tab-btn {
            flex: 1;
            padding: 0.6rem;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 700;
            color: #475569;
            cursor: pointer;
          }
          .tab-btn.active {
            background: #7c3aed;
            color: #ffffff;
            border-color: #6d28d9;
          }
          .answer-textarea {
            width: 100%;
            box-sizing: border-box;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 0.85rem;
            font-size: 0.92rem;
            line-height: 1.5;
            font-family: inherit;
            resize: vertical;
          }
          .textarea-footer {
            display: flex;
            justify-content: flex-end;
            font-size: 0.75rem;
            color: #94a3b8;
            margin-top: 0.35rem;
          }
          .upload-dropzone {
            display: block;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            background: #fafafa;
          }
          .dropzone-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
          }
          .camera-icon { font-size: 2rem; }
          .dropzone-subtext { font-size: 0.75rem; color: #94a3b8; }
          .preview-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.6rem;
          }
          .uploaded-preview {
            max-height: 250px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .btn-remove-img {
            background: #fee2e2;
            color: #b91c1c;
            border: none;
            padding: 0.3rem 0.7rem;
            border-radius: 6px;
            font-size: 0.78rem;
            font-weight: 700;
            cursor: pointer;
          }
          .error-alert {
            color: #dc2626;
            font-size: 0.85rem;
            margin: 0.6rem 0;
          }
          .btn-submit-grade {
            width: 100%;
            background: #7c3aed;
            color: #ffffff;
            font-weight: 800;
            font-size: 1rem;
            padding: 0.85rem;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
            margin-top: 0.85rem;
          }
          .btn-submit-grade:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .score-hero-card {
            background: #fdf4ff;
            border: 2px solid #f0abfc;
            border-radius: 14px;
            padding: 1.25rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .score-main {
            display: flex;
            align-items: baseline;
            gap: 0.2rem;
          }
          .score-val {
            font-size: 2.5rem;
            font-weight: 900;
            color: #86198f;
          }
          .score-max {
            font-size: 1.2rem;
            font-weight: 700;
            color: #a21caf;
          }
          .score-details h3 {
            margin: 0 0 0.2rem;
            color: #701a75;
          }
          .score-details p {
            margin: 0;
            font-size: 0.88rem;
            color: #86198f;
          }
          .step-eval-list h4 {
            font-size: 0.95rem;
            color: #334155;
            margin-bottom: 0.75rem;
          }
          .step-item {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 0.85rem 1rem;
            margin-bottom: 0.75rem;
          }
          .step-item.full { border-left: 4px solid #16a34a; background: #f0fdf4; }
          .step-item.partial { border-left: 4px solid #f59e0b; background: #fffbeb; }
          .step-item.zero { border-left: 4px solid #ef4444; background: #fef2f2; }
          .step-topbar {
            display: flex;
            justify-content: space-between;
            font-size: 0.8rem;
            font-weight: 800;
            margin-bottom: 0.35rem;
          }
          .step-desc, .step-feedback {
            font-size: 0.85rem;
            margin: 0.2rem 0;
            color: #1e293b;
          }
          .keywords-row {
            margin-top: 0.4rem;
          }
          .kw-tag {
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.15rem 0.4rem;
            border-radius: 4px;
          }
          .kw-tag.matched { background: #dcfce7; color: #15803d; }
          .kw-tag.missing { background: #fee2e2; color: #b91c1c; }
          .topper-tips-box {
            background: #eff6ff;
            border: 1.5px solid #bfdbfe;
            border-radius: 12px;
            padding: 1rem 1.25rem;
            margin-top: 1.25rem;
          }
          .topper-tips-box h4 {
            margin: 0 0 0.5rem;
            color: #1e40af;
          }
          .topper-tips-box ul {
            margin: 0;
            padding-left: 1.2rem;
            font-size: 0.85rem;
            color: #1e3a8a;
          }
          .modal-bottom-actions {
            display: flex;
            gap: 0.75rem;
            margin-top: 1.5rem;
          }
          .btn-retry {
            flex: 1;
            padding: 0.65rem;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
          }
          .btn-done {
            flex: 1;
            padding: 0.65rem;
            background: #1e293b;
            color: #ffffff;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
}
