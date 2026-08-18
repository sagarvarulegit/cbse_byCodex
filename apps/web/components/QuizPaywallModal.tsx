'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

import {
  createPaymentOrder,
  verifyPayment,
  UNLIMITED_QUIZ_PASS_KEY,
} from '../lib/payments';

export type QuizPaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
};

export default function QuizPaywallModal({
  isOpen,
  onClose,
  onSuccess,
  token = null,
  userFullName,
  userEmail,
}: QuizPaywallModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayReady(true);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  async function handleCheckout() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const order = await createPaymentOrder(token, UNLIMITED_QUIZ_PASS_KEY);
      if (!order || !order.paymentOrderId) {
        throw new Error('Could not initiate payment session. Please try again.');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay secure checkout is loading. Please retry in a few seconds.');
      }

      const options = {
        key: order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'ChapterReady',
        description: 'Class 10 Unlimited CBSE Quiz Pass (All 4 Subjects)',
        order_id: order.paymentOrderId,
        prefill: {
          name: userFullName || '',
          email: userEmail || '',
        },
        theme: {
          color: '#171513',
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await verifyPayment(token, {
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes?.success) {
              onSuccess?.();
              onClose();
            } else {
              setErrorMessage(verifyRes?.message || 'Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Payment verification error.');
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Checkout failed.');
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayReady(true)}
      />

      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="btn-close" onClick={onClose}>
            ✕
          </button>

          <div className="modal-header">
            <div className="limit-icon-wrap">
              <span className="limit-icon">⚡</span>
            </div>
            <span className="modal-eyebrow">Daily Free Quiz Limit Reached (3/3)</span>
            <h2>Supercharge Your Practice with Unlimited Quizzes!</h2>
            <p className="modal-subtext">
              You’ve used your 3 free quizzes for today. Get the <strong>Unlimited CBSE Quiz Pass</strong> to practice anytime across all 48 Class 10 NCERT chapters.
            </p>
          </div>

          {errorMessage && (
            <div className="error-banner" role="alert">
              ⚠️ {errorMessage}
            </div>
          )}

          <div className="features-box">
            <div className="feature-row">
              <span className="feature-check">✓</span>
              <span><strong>Unlimited Daily Practice</strong> across Maths, Science, SST &amp; English</span>
            </div>
            <div className="feature-row">
              <span className="feature-check">✓</span>
              <span><strong>Instant Random Challenge Generator</strong> for surprise testing</span>
            </div>
            <div className="feature-row">
              <span className="feature-check">✓</span>
              <span><strong>Spaced Repetition Mistake Vault</strong> to fix weak concepts</span>
            </div>
            <div className="feature-row">
              <span className="feature-check">✓</span>
              <span><strong>Chapter Mastery Badges &amp; Streaks</strong> for board exam confidence</span>
            </div>
          </div>

          <div className="pricing-box">
            <div className="pricing-left">
              <span className="price-tag">₹199</span>
              <span className="price-orig">₹599</span>
              <span className="discount-badge">66% OFF</span>
            </div>
            <span className="price-validity">One-time payment · Valid for 2025–26 Board Year</span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-pay-now"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Opening Secure Checkout...' : '⚡ Unlock Unlimited Quizzes (₹199) →'}
            </button>
            <button type="button" className="btn-free-dismiss" onClick={onClose}>
              Maybe tomorrow (Daily limit resets at midnight)
            </button>
          </div>

          <div className="guarantee-footer">
            <span>🛡️ 100% Satisfaction Guarantee · Verified NCERT Questions</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 15, 13, 0.75);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          padding: 2.25rem 2rem;
          max-width: 500px;
          width: 100%;
          box-shadow: 8px 8px 0 #171513;
          position: relative;
          text-align: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .btn-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          font-size: 1.25rem;
          font-weight: bold;
          cursor: pointer;
          color: #787168;
          padding: 0.25rem;
        }

        .btn-close:hover {
          color: #171513;
        }

        .limit-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #fef3c7;
          border: 2px solid #171513;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
        }

        .limit-icon {
          font-size: 1.75rem;
        }

        .modal-eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #c25e00;
          display: block;
          margin-bottom: 0.35rem;
        }

        h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.5rem 0;
          line-height: 1.3;
        }

        .modal-subtext {
          font-size: 0.875rem;
          color: #5d5750;
          line-height: 1.45;
          margin: 0 0 1.25rem 0;
        }

        .error-banner {
          background: #fee2e2;
          border: 1.5px solid #f87171;
          color: #991b1b;
          border-radius: 8px;
          padding: 0.5rem 0.75rem;
          font-size: 0.8125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: left;
        }

        .features-box {
          background: #fbf8f3;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.875rem 1rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .feature-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #171513;
        }

        .feature-check {
          color: #059669;
          font-weight: 900;
          font-size: 0.9375rem;
        }

        .pricing-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #effaf3;
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
        }

        .pricing-left {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }

        .price-tag {
          font-size: 1.6rem;
          font-weight: 900;
          color: #065f46;
        }

        .price-orig {
          font-size: 0.875rem;
          text-decoration: line-through;
          color: #8c827a;
        }

        .discount-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          background: #10b981;
          color: #ffffff;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .price-validity {
          font-size: 0.6875rem;
          color: #047857;
          font-weight: 600;
          text-align: right;
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .btn-pay-now {
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.875rem 1.25rem;
          font-size: 0.9375rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          box-shadow: 3px 3px 0 #c25e00;
        }

        .btn-pay-now:hover:not(:disabled) {
          background: #c25e00;
          transform: translateY(-1px);
        }

        .btn-pay-now:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-free-dismiss {
          background: transparent;
          border: none;
          color: #787168;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0.25rem;
          text-decoration: underline;
        }

        .btn-free-dismiss:hover {
          color: #171513;
        }

        .guarantee-footer {
          margin-top: 1rem;
          font-size: 0.6875rem;
          color: #787168;
        }
      `}</style>
    </>
  );
}
