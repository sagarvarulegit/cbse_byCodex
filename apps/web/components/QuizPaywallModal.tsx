'use client';

import React, { useState, useEffect } from 'react';

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
  const [guestEmail, setGuestEmail] = useState(userEmail || '');
  const [guestPhone, setGuestPhone] = useState('');

  // Load Cashfree and Razorpay scripts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.Cashfree) {
        const cfScript = document.createElement('script');
        cfScript.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        cfScript.async = true;
        document.body.appendChild(cfScript);
      }
      if (!window.Razorpay) {
        const rzpScript = document.createElement('script');
        rzpScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
        rzpScript.async = true;
        document.body.appendChild(rzpScript);
      }
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  async function handleCheckout() {
    setLoading(true);
    setErrorMessage(null);

    const emailToUse = (token && userEmail ? userEmail : guestEmail.trim().toLowerCase()) || '';
    const phoneToUse = guestPhone.trim();

    if (!token && (!emailToUse || !emailToUse.includes('@'))) {
      setLoading(false);
      setErrorMessage('Please enter a valid email address for instant pass delivery.');
      return;
    }

    try {
      const orderData = await createPaymentOrder(
        token,
        UNLIMITED_QUIZ_PASS_KEY,
        undefined,
        !token
          ? {
              guestEmail: emailToUse,
              guestPhone: phoneToUse || undefined,
              guestName: userFullName || 'Class 10 Student',
            }
          : undefined,
      );

      if (!orderData) {
        throw new Error('Could not initiate payment session. Please try again.');
      }

      // 1. Cashfree Checkout (Primary)
      if (orderData.paymentSessionId) {
        if (!window.Cashfree) {
          throw new Error('Payment gateway is loading. Please try again in a moment.');
        }

        const cashfree = window.Cashfree({
          mode: orderData.mode || 'production',
        });

        const checkoutResult = await cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: '_modal',
        });

        if (checkoutResult?.error) {
          setLoading(false);
          setErrorMessage(checkoutResult.error.message || 'Payment was cancelled or closed.');
          return;
        }

        const verifyRes = await verifyPayment(token, { orderId: orderData.orderId });
        if (verifyRes?.success) {
          if (verifyRes.token) {
            document.cookie = `cbse_student_session=${verifyRes.token}; path=/; max-age=1209600; SameSite=Lax`;
          }
          setLoading(false);
          onSuccess?.();
          onClose();
          return;
        } else {
          setLoading(false);
          setErrorMessage(verifyRes?.message || 'Payment verification pending. Please refresh.');
          return;
        }
      }

      // 2. Razorpay Fallback
      if (orderData.keyId || orderData.paymentOrderId) {
        if (!window.Razorpay) {
          throw new Error('Payment gateway is loading. Please retry in a few seconds.');
        }

        const options: RazorpayOptions = {
          key: orderData.keyId || 'rzp_test_placeholder',
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'ChapterReady',
          description: 'Class 10 Unlimited CBSE Quiz Pass (All 4 Subjects)',
          order_id: orderData.paymentOrderId || orderData.orderId,
          prefill: {
            name: userFullName || 'Class 10 Student',
            email: emailToUse,
            contact: phoneToUse || undefined,
          },
          theme: {
            color: '#171513',
          },
          handler: async function (response: RazorpayResponse) {
            try {
              const verifyRes = await verifyPayment(token, {
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes?.success) {
                if (verifyRes.token) {
                  document.cookie = `cbse_student_session=${verifyRes.token}; path=/; max-age=1209600; SameSite=Lax`;
                }
                setLoading(false);
                onSuccess?.();
                onClose();
              } else {
                setErrorMessage(verifyRes?.message || 'Payment verification failed. Please contact support.');
                setLoading(false);
              }
            } catch (err) {
              setErrorMessage(err instanceof Error ? err.message : 'Payment verification error.');
              setLoading(false);
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
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Checkout failed.');
      setLoading(false);
    }
  }

  return (
    <>
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
            <span className="price-validity">One-time payment · Valid for 2026–27 Board Year</span>
          </div>

          {!token && (
            <div className="guest-checkout-box">
              <div className="guest-checkout-label">
                <span>📧 Instant Delivery (No Account Needed)</span>
                <span className="guest-sub">We’ll deliver your pass &amp; receipt here:</span>
              </div>
              <div className="guest-inputs">
                <input
                  type="email"
                  placeholder="Student / Parent Email (e.g. rahul@gmail.com)"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="guest-input"
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile / WhatsApp (Optional for SMS receipt)"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="guest-input"
                />
              </div>
            </div>
          )}

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
            <span>🛡️ 100% Satisfaction Guarantee · Instant UPI Unlock · Verified NCERT Questions</span>
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

        .guest-checkout-box {
          background: #fbf9f4;
          border: 1.5px solid #171513;
          border-radius: 14px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
          text-align: left;
        }

        .guest-checkout-label {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          margin-bottom: 0.6rem;
        }

        .guest-checkout-label span:first-child {
          font-weight: 800;
          font-size: 0.85rem;
          color: #171513;
        }

        .guest-sub {
          font-size: 0.75rem;
          color: #787168;
        }

        .guest-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .guest-input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1.5px solid #d4cecb;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
          background: #ffffff;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }

        .guest-input:focus {
          border-color: #171513;
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
