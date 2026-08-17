'use client';

import { useState } from 'react';
import {
  submitRefundRequest,
  swapSubjectPass,
  type StudentOrder,
} from '../lib/payments';

const SUBJECT_LABELS: Record<string, string> = {
  'mathematics-standard': 'Maths Standard (041)',
  'science': 'Science (086)',
  'social-science': 'Social Science (087)',
  'english-language-and-literature': 'English (184)',
};

export type RefundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
  orders: StudentOrder[];
  onRefundCompleted: () => void;
};

export default function RefundModal({
  isOpen,
  onClose,
  token,
  orders,
  onRefundCompleted,
}: RefundModalProps) {
  const paidOrders = orders.filter((o) => o.status === 'paid');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(paidOrders[0]?.id || '');
  const [reason, setReason] = useState<string>('duplicate');
  const [targetSubject, setTargetSubject] = useState<string>('science');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) {
    return null;
  }

  const currentOrder = paidOrders.find((o) => o.id === selectedOrderId) || paidOrders[0];
  const isSingleSubject = currentOrder?.productKey.startsWith('cbse10-mock-pass');
  const canSwap = Boolean(currentOrder?.eligibility?.canSwapSubject);

  async function handleAction() {
    if (!currentOrder) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (reason === 'wrong_subject' && canSwap) {
        // Execute subject swap
        const res = await swapSubjectPass(token, {
          orderId: currentOrder.id,
          targetSubjectSlug: targetSubject,
        });

        if (res?.success) {
          setFeedback({
            type: 'success',
            message: `🎉 Success! Your pass has been swapped to ${SUBJECT_LABELS[targetSubject] || targetSubject} with zero fees.`,
          });
          setIsSubmitting(false);
          setTimeout(() => {
            onRefundCompleted();
            onClose();
          }, 1800);
          return;
        }
      }

      // Standard / Auto Refund Request
      const res = await submitRefundRequest(token, {
        orderId: currentOrder.id,
        reason,
        details: details.trim() || undefined,
      });

      if (res?.success) {
        setFeedback({
          type: 'success',
          message:
            res.status === 'processed'
              ? `✅ ${res.message}`
              : `📋 ${res.message}`,
        });
        setIsSubmitting(false);
        setTimeout(() => {
          onRefundCompleted();
          onClose();
        }, 2200);
      } else {
        setFeedback({
          type: 'error',
          message: 'Unable to submit refund request. Please contact support.',
        });
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error processing request.',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="refund-overlay" role="dialog" aria-modal="true" aria-labelledby="refund-modal-title">
      <div className="refund-card">
        <button
          type="button"
          className="refund-close"
          onClick={onClose}
          aria-label="Close refund modal"
        >
          ✕
        </button>

        <div className="refund-header">
          <span className="refund-pill">🛡️ 100% Satisfaction Guarantee</span>
          <h2 id="refund-modal-title">Refund & Pass Assistance</h2>
          <p className="refund-sub">
            We want you to be 100% satisfied with ChapterReady. Choose how we can help you today.
          </p>
        </div>

        {paidOrders.length === 0 ? (
          <div className="refund-empty">
            <p>You currently do not have any active paid passes to refund.</p>
            <button type="button" className="btn-refund-close" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="refund-body">
            {paidOrders.length > 1 && (
              <div className="refund-field">
                <label htmlFor="order-select">Select Order:</label>
                <select
                  id="order-select"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="refund-select"
                >
                  {paidOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      ₹{o.amount / 100} — {o.productKey} ({new Date(o.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="order-summary-box">
              <div>
                <strong>Amount Paid:</strong> ₹{(currentOrder?.amount || 0) / 100}
              </div>
              <div>
                <strong>Pass:</strong>{' '}
                {currentOrder?.productKey.includes('all-subjects')
                  ? 'All 4 Core Subjects Pass'
                  : `${SUBJECT_LABELS[currentOrder?.subjectSlug || ''] || currentOrder?.subjectSlug} Pass`}
              </div>
              <div className="eligibility-tag">
                {currentOrder?.eligibility?.isEligibleForInstantRefund
                  ? '⚡ Eligible for Instant UPI / Bank Refund'
                  : '📋 Routed to 24-Hour Express Support'}
              </div>
            </div>

            <div className="refund-field">
              <label htmlFor="refund-reason">What is the reason for this request?</label>
              <select
                id="refund-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="refund-select"
              >
                <option value="duplicate">⚡ Duplicate charge (I was charged twice by mistake)</option>
                {isSingleSubject && (
                  <option value="wrong_subject">🔄 Bought wrong subject (I want to switch subjects)</option>
                )}
                <option value="technical">🛠️ Technical issue with timer or exam paper loading</option>
                <option value="satisfaction_guarantee">✋ Not satisfied with mock tests (48-Hour Guarantee)</option>
                <option value="other">📝 Other academic reason</option>
              </select>
            </div>

            {reason === 'wrong_subject' && isSingleSubject && (
              <div className="subject-swap-box">
                <p className="swap-tip">
                  💡 <strong>Save time and fees!</strong> Instead of a bank refund, swap your pass to your intended subject instantly with zero charges:
                </p>
                <label htmlFor="target-subject">Switch to Subject:</label>
                <select
                  id="target-subject"
                  value={targetSubject}
                  onChange={(e) => setTargetSubject(e.target.value)}
                  className="refund-select"
                >
                  {Object.entries(SUBJECT_LABELS)
                    .filter(([slug]) => slug !== currentOrder?.subjectSlug)
                    .map(([slug, label]) => (
                      <option key={slug} value={slug}>
                        {label}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="refund-field">
              <label htmlFor="refund-details">Additional details (optional):</label>
              <textarea
                id="refund-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us what went wrong so we can fix it…"
                className="refund-textarea"
                rows={2}
              />
            </div>

            {feedback && (
              <div className={`feedback-alert ${feedback.type}`} role="alert">
                {feedback.message}
              </div>
            )}

            <button
              type="button"
              className="btn-submit-refund"
              disabled={isSubmitting}
              onClick={handleAction}
            >
              {isSubmitting
                ? 'Processing Request…'
                : reason === 'wrong_subject'
                ? 'Confirm Free Subject Swap →'
                : 'Confirm & Request 100% Refund (₹' + (currentOrder?.amount || 0) / 100 + ') →'}
            </button>

            <p className="refund-policy-footer">
              🔒 Refunds are processed back to the original UPI/Card account via Razorpay.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .refund-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(18, 16, 14, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .refund-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          max-width: 520px;
          width: 100%;
          padding: 2rem;
          position: relative;
          box-shadow: 6px 6px 0 #171513;
          animation: popIn 0.2s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .refund-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: #f4eee3;
          border: 1.5px solid #171513;
          border-radius: 50%;
          width: 32px; height: 32px;
          cursor: pointer;
          font-weight: 900;
        }
        .refund-header { margin-bottom: 1.25rem; }
        .refund-pill {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 900;
          background: #d7f0e6;
          color: #0b7a48;
          border: 1px solid #0b7a48;
          border-radius: 999px;
          padding: 0.2rem 0.6rem;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
        }
        .refund-header h2 { font-size: 1.45rem; margin: 0.2rem 0; color: #171513; }
        .refund-sub { font-size: 0.85rem; color: #666; line-height: 1.4; margin: 0; }
        .refund-body { display: flex; flex-direction: column; gap: 1rem; }
        .order-summary-box {
          background: #faf8f5;
          border: 1.5px solid #171513;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .eligibility-tag {
          color: #0b7a48;
          font-weight: 800;
          font-size: 0.78rem;
          margin-top: 0.25rem;
        }
        .refund-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .refund-field label { font-size: 0.82rem; font-weight: 700; color: #171513; }
        .refund-select, .refund-textarea {
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #171513;
          border-radius: 10px;
          font-size: 0.88rem;
          background: #fff;
          color: #171513;
        }
        .subject-swap-box {
          background: #fff9ed;
          border: 1.5px solid #d97706;
          border-radius: 10px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .swap-tip { font-size: 0.8rem; color: #92400e; margin: 0; line-height: 1.35; }
        .feedback-alert {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .feedback-alert.success { background: #dcfce7; border: 1.5px solid #16a34a; color: #15803d; }
        .feedback-alert.error { background: #fee2e2; border: 1.5px solid #ef4444; color: #b91c1c; }
        .btn-submit-refund {
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.12s ease;
        }
        .btn-submit-refund:hover:not(:disabled) { background: #332f2b; }
        .btn-submit-refund:disabled { opacity: 0.6; cursor: not-allowed; }
        .refund-policy-footer { font-size: 0.72rem; color: #777; text-align: center; margin: 0; }
        .refund-empty { text-align: center; padding: 1.5rem 0; font-size: 0.9rem; color: #666; }
        .btn-refund-close {
          margin-top: 1rem;
          background: #171513;
          color: #fff;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
