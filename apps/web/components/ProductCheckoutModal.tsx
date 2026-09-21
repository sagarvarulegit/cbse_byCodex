'use client';

import React, { useState, useEffect } from 'react';
import {
  createPaymentOrder,
  verifyPayment,
  NCERT_ACTIVITY_DIAGRAM_PACK_KEY,
  FORMULA_CHEATSHEET_PACK_KEY,
  ACTIVITY_FORMULA_COMBO_PACK_KEY,
  SCIENCE_CH1_5_PACK_KEY,
} from '../lib/payments';

export type ProductCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (productKey: string) => void;
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
  initialProductKey?: string;
};

export default function ProductCheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  token = null,
  userFullName,
  userEmail,
  initialProductKey = NCERT_ACTIVITY_DIAGRAM_PACK_KEY,
}: ProductCheckoutModalProps) {
  const [selectedProductKey, setSelectedProductKey] = useState<string>(initialProductKey);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [purchasedSuccess, setPurchasedSuccess] = useState<{
    productKey: string;
    title: string;
    href: string;
    email: string;
  } | null>(null);

  function triggerSuccess(key: string, emailUsed: string) {
    const destinationHref =
      key === FORMULA_CHEATSHEET_PACK_KEY
        ? '/formula-cheatsheets'
        : key === NCERT_ACTIVITY_DIAGRAM_PACK_KEY
        ? '/activities-and-diagrams'
        : key === SCIENCE_CH1_5_PACK_KEY
        ? '/science-pack'
        : key === ACTIVITY_FORMULA_COMBO_PACK_KEY
        ? '/activities-and-diagrams'
        : '/orders';

    const destinationTitle =
      key === FORMULA_CHEATSHEET_PACK_KEY
        ? 'Class 10 Formula & Reaction Cheatsheets'
        : key === NCERT_ACTIVITY_DIAGRAM_PACK_KEY
        ? 'NCERT Activity & Diagram Mastery Pack'
        : key === SCIENCE_CH1_5_PACK_KEY
        ? 'Science Chapters 1–5 Board Revision Pack'
        : key === ACTIVITY_FORMULA_COMBO_PACK_KEY
        ? 'Activity & Formula Super Combo'
        : 'Class 10 Board Pack';

    setPurchasedSuccess({
      productKey: key,
      title: destinationTitle,
      href: destinationHref,
      email: emailUsed,
    });
    setLoading(false);
    onSuccess?.(key);
  }

  useEffect(() => {
    if (initialProductKey) {
      setSelectedProductKey(initialProductKey);
    }
  }, [initialProductKey]);

  // Load payment gateway scripts
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

  if (purchasedSuccess) {
    return (
      <div className="paywall-overlay" role="dialog" aria-modal="true">
        <div className="paywall-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem', maxWidth: '450px' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '0.75rem' }}>🎉</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginBottom: '0.5rem' }}>
            Payment Successful!
          </h2>
          <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Your pack <strong>{purchasedSuccess.title}</strong> is active and unlocked!
          </p>

          {/* Email notice callout box */}
          <div
            style={{
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              marginBottom: '1.5rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              boxShadow: '0 2px 8px rgba(22, 101, 52, 0.06)',
            }}
          >
            <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>✉️</span>
            <div style={{ fontSize: '0.875rem', color: '#14532d', lineHeight: 1.45 }}>
              <strong style={{ display: 'block', marginBottom: '3px', color: '#166534', fontSize: '0.95rem' }}>
                Please check your email for access!
              </strong>
              <span>
                We just sent your direct 1-click access link and official tax receipt to:
              </span>
              <strong style={{ display: 'block', color: '#15803d', wordBreak: 'break-all', marginTop: '3px', fontSize: '0.9rem' }}>
                {purchasedSuccess.email}
              </strong>
              <span style={{ display: 'block', fontSize: '0.8rem', color: '#15803d', opacity: 0.85, marginTop: '6px' }}>
                💡 Tip: Check your <strong>Inbox</strong>, <strong>Promotions</strong>, or <strong>Spam</strong> tab to access your pack anytime across your phone and laptop.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={purchasedSuccess.href}
              className="btn-paywall-primary"
              style={{
                textDecoration: 'none',
                background: '#16a34a',
                borderColor: '#16a34a',
                padding: '0.9rem 1.5rem',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.05rem',
                textAlign: 'center',
                display: 'block',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
              }}
            >
              ⚡ Open Your Material Right Now →
            </a>
            <a
              href="/orders"
              style={{
                color: '#64748b',
                fontSize: '0.9rem',
                textDecoration: 'underline',
                marginTop: '0.25rem',
                textAlign: 'center',
              }}
            >
              📦 View All Purchases &amp; Invoices
            </a>
          </div>
        </div>
      </div>
    );
  }

  const isActivityPack = selectedProductKey === NCERT_ACTIVITY_DIAGRAM_PACK_KEY;
  const isFormulaPack = selectedProductKey === FORMULA_CHEATSHEET_PACK_KEY;
  const isComboPack = selectedProductKey === ACTIVITY_FORMULA_COMBO_PACK_KEY;

  const [guestEmail, setGuestEmail] = useState(userEmail || '');
  const [guestPhone, setGuestPhone] = useState('');

  async function handleCheckout() {
    setLoading(true);
    setErrorMessage(null);

    const emailToUse: string = (token && userEmail ? userEmail : guestEmail.trim().toLowerCase()) || 'your registered email';
    const phoneToUse = guestPhone.trim();

    if (!token && (!emailToUse || !emailToUse.includes('@'))) {
      setLoading(false);
      setErrorMessage('Please enter a valid email address for instant access delivery.');
      return;
    }

    try {
      const orderData = await createPaymentOrder(
        token,
        selectedProductKey,
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
        throw new Error('Could not initiate order with server. Please try again.');
      }

      // 1. Cashfree Checkout
      if (orderData.paymentSessionId) {
        if (orderData.paymentSessionId.startsWith('session_sim_')) {
          const simRes = await verifyPayment(token, { orderId: orderData.orderId });
          if (simRes?.success) {
            if (simRes.token) {
              document.cookie = `cbse_student_session=${simRes.token}; path=/; max-age=1209600; SameSite=Lax`;
            }
            triggerSuccess(selectedProductKey, emailToUse);
            return;
          }
        }

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
          setErrorMessage(checkoutResult.error.message || 'Payment was cancelled.');
          return;
        }

        const verifyRes = await verifyPayment(token, { orderId: orderData.orderId });
        if (verifyRes?.success) {
          if (verifyRes.token) {
            document.cookie = `cbse_student_session=${verifyRes.token}; path=/; max-age=1209600; SameSite=Lax`;
          }
          triggerSuccess(selectedProductKey, emailToUse);
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
          throw new Error('Payment gateway is loading. Please try again in a few seconds.');
        }

        const options = {
          key: orderData.keyId || 'rzp_test_placeholder',
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'ChapterReady CBSE Class 10',
          description: orderData.product.title,
          order_id: orderData.paymentOrderId || orderData.orderId,
          prefill: {
            name: userFullName || '',
            email: userEmail || '',
          },
          theme: {
            color: '#171513',
          },
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
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
                triggerSuccess(selectedProductKey, emailToUse);
              } else {
                setLoading(false);
                setErrorMessage(verifyRes?.message || 'Verification failed. Please contact support.');
              }
            } catch (err) {
              setLoading(false);
              setErrorMessage(err instanceof Error ? err.message : 'Error verifying payment.');
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
      setLoading(false);
      setErrorMessage(err instanceof Error ? err.message : 'Checkout initiation failed.');
    }
  }

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true">
      <div className="paywall-card">
        <button type="button" className="paywall-close" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="paywall-header">
          <span className="paywall-badge">
            {isComboPack
              ? '👑 Ultimate Revision Combo'
              : isActivityPack
              ? '🔬 NCERT Activity & Diagram Pack'
              : '⚡ Formula & Reaction Cheatsheets'}
          </span>
          <h2>
            {isComboPack
              ? 'Master Every Activity & Formula'
              : isActivityPack
              ? 'Crack 15+ Board Marks from NCERT Activities'
              : 'Never Forget a Formula or Reaction'}
          </h2>
          <p className="paywall-subhead">
            {isComboPack
              ? 'Instant academic-year access to all NCERT Science Activities, interactive diagram drills, and printable Maths & Science formula sheets.'
              : isActivityPack
              ? 'Step-by-step experimental setups, observations, reactions, diagram-labeling drills, and previous year board questions.'
              : 'Ultra-dense 1-page printable summary sheets, reaction lists, Physics sign conventions, and digital flashcards.'}
          </p>
        </div>

        {errorMessage && (
          <div className="paywall-error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Plan Selector */}
        <div className="plan-selection-grid">
          {/* Option 1: Activity & Diagram Pack (₹99) */}
          <div
            className={`plan-item ${isActivityPack ? 'selected' : ''}`}
            onClick={() => setSelectedProductKey(NCERT_ACTIVITY_DIAGRAM_PACK_KEY)}
          >
            <div className="plan-item-radio">
              <input
                type="radio"
                name="productPlan"
                checked={isActivityPack}
                onChange={() => setSelectedProductKey(NCERT_ACTIVITY_DIAGRAM_PACK_KEY)}
              />
            </div>
            <div className="plan-item-body">
              <div className="plan-item-title-row">
                <strong>NCERT Activity &amp; Diagram Pack</strong>
                <span className="price-tag">₹99</span>
              </div>
              <p className="plan-item-desc">All Science Activities (Ch 1–13), observations &amp; board questions</p>
            </div>
          </div>

          {/* Option 2: Formula Cheatsheet Pack (₹49) */}
          <div
            className={`plan-item ${isFormulaPack ? 'selected' : ''}`}
            onClick={() => setSelectedProductKey(FORMULA_CHEATSHEET_PACK_KEY)}
          >
            <div className="plan-item-radio">
              <input
                type="radio"
                name="productPlan"
                checked={isFormulaPack}
                onChange={() => setSelectedProductKey(FORMULA_CHEATSHEET_PACK_KEY)}
              />
            </div>
            <div className="plan-item-body">
              <div className="plan-item-title-row">
                <strong>Formula &amp; Reaction Cheatsheets</strong>
                <span className="price-tag">₹49</span>
              </div>
              <p className="plan-item-desc">Printable 1-page chapter sheets &amp; interactive flashcards</p>
            </div>
          </div>

          {/* Option 3: Super Combo (₹129 - Best Value) */}
          <div
            className={`plan-item combo-highlight ${isComboPack ? 'selected' : ''}`}
            onClick={() => setSelectedProductKey(ACTIVITY_FORMULA_COMBO_PACK_KEY)}
          >
            <span className="combo-pill">🔥 Best Value · Save ₹19</span>
            <div className="plan-item-radio">
              <input
                type="radio"
                name="productPlan"
                checked={isComboPack}
                onChange={() => setSelectedProductKey(ACTIVITY_FORMULA_COMBO_PACK_KEY)}
              />
            </div>
            <div className="plan-item-body">
              <div className="plan-item-title-row">
                <strong>Super Combo (Both Packs)</strong>
                <div className="combo-price-wrap">
                  <span className="price-orig">₹148</span>
                  <span className="price-tag combo-tag">₹129</span>
                </div>
              </div>
              <p className="plan-item-desc">Activities + Diagrams + All Maths &amp; Science Cheatsheets</p>
            </div>
          </div>
        </div>

        {/* Guest Contact Details (only when not logged in) */}
        {!token && (
          <div className="guest-fields-box">
            <p className="guest-fields-label">📬 Where should we send your access link &amp; receipt?</p>
            <div className="guest-inputs-grid">
              <input
                type="email"
                className="guest-input"
                placeholder="Email address (e.g. name@gmail.com)"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                className="guest-input"
                placeholder="WhatsApp / Mobile (e.g. 9876543210)"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Feature Checklist */}
        <div className="features-container">
          <div className="feature-line">
            <span className="feat-check">✓</span>
            <span><strong>100% NCERT Faithful:</strong> Matches exact textbook numbering, figures &amp; reactions</span>
          </div>
          <div className="feature-line">
            <span className="feat-check">✓</span>
            <span><strong>Printable PDF Handbooks:</strong> High-resolution single-click export for wall charts</span>
          </div>
          <div className="feature-line">
            <span className="feat-check">✓</span>
            <span><strong>Instant Full Access:</strong> Unlocks immediately across all your devices for 2026-27</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-submit-checkout"
          disabled={loading}
          onClick={handleCheckout}
        >
          {loading
            ? 'Opening Secure Checkout…'
            : `⚡ Unlock Now for ₹${isComboPack ? '129' : isActivityPack ? '99' : '49'} →`}
        </button>

        <p className="paywall-footer-note">
          🛡️ Safe &amp; Secure 256-bit UPI / Cards payment · 48-Hour Satisfaction Guarantee
        </p>
      </div>

      <style jsx>{`
        .paywall-overlay {
          position: fixed;
          inset: 0;
          background: rgba(18, 16, 14, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 1rem;
        }
        .paywall-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 24px;
          max-width: 540px;
          width: 100%;
          padding: 2rem 2.2rem;
          position: relative;
          box-shadow: 8px 8px 0 #171513;
          animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .paywall-close {
          position: absolute;
          top: 1.15rem;
          right: 1.15rem;
          background: #f4eee3;
          border: 2px solid #171513;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 900;
          cursor: pointer;
        }
        .paywall-close:hover { background: #e5ded0; }
        .paywall-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          background: #ffe9b8;
          color: #171513;
          border: 1.5px solid #171513;
          border-radius: 999px;
          padding: 0.2rem 0.65rem;
          margin-bottom: 0.4rem;
        }
        h2 {
          font-size: 1.35rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.4rem;
          line-height: 1.25;
        }
        .paywall-subhead {
          font-size: 0.85rem;
          color: #55514b;
          line-height: 1.4;
          margin: 0 0 1.25rem;
        }
        .paywall-error {
          background: #fee2e2;
          border: 1.5px solid #ef4444;
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          color: #991b1b;
          font-size: 0.82rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        .plan-selection-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .plan-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border: 2px solid #ddd;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          background: #faf8f5;
          position: relative;
        }
        .plan-item:hover {
          border-color: #c95014;
          background: #fffdfa;
        }
        .plan-item.selected {
          border-color: #c95014;
          background: #fff8f2;
          box-shadow: 3px 3px 0 #c95014;
        }
        .plan-item.combo-highlight {
          border-color: #0b7a48;
          background: #f3faf6;
        }
        .plan-item.combo-highlight.selected {
          border-color: #0b7a48;
          background: #eaf6f0;
          box-shadow: 3px 3px 0 #0b7a48;
        }
        .combo-pill {
          position: absolute;
          top: -9px;
          right: 12px;
          background: #0b7a48;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }
        .plan-item-body {
          flex: 1;
        }
        .plan-item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .plan-item-title-row strong {
          font-size: 0.92rem;
          color: #171513;
        }
        .price-tag {
          font-size: 1.15rem;
          font-weight: 900;
          color: #c95014;
        }
        .combo-tag {
          color: #0b7a48;
        }
        .combo-price-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }
        .price-orig {
          font-size: 0.8rem;
          text-decoration: line-through;
          color: #888;
        }
        .plan-item-desc {
          font-size: 0.75rem;
          color: #666;
          margin: 0.15rem 0 0;
        }
        .guest-fields-box {
          background: #fff8eb;
          border: 1.5px solid #e0c896;
          border-radius: 12px;
          padding: 0.75rem 0.9rem;
          margin-bottom: 1.1rem;
        }
        .guest-fields-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #7c4a03;
          margin: 0 0 0.5rem;
        }
        .guest-inputs-grid {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .guest-input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1.5px solid #d4b87d;
          border-radius: 8px;
          font-size: 0.85rem;
          background: #ffffff;
          color: #171513;
          outline: none;
        }
        .guest-input:focus {
          border-color: #171513;
          box-shadow: 0 0 0 2px rgba(23, 21, 19, 0.1);
        }
        .features-container {
          background: #fbf9f4;
          border: 1.5px solid #171513;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.25rem;
        }
        .feature-line {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #171513;
          align-items: center;
        }
        .feat-check {
          color: #0b7a48;
          font-weight: 900;
        }
        .btn-submit-checkout {
          width: 100%;
          padding: 0.88rem 1.25rem;
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 3px 3px 0 rgba(0,0,0,0.25);
          transition: all 0.12s ease;
        }
        .btn-submit-checkout:hover:not(:disabled) {
          background: #332f2b;
          transform: translateY(-1px);
        }
        .btn-submit-checkout:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .paywall-footer-note {
          text-align: center;
          font-size: 0.72rem;
          color: #787168;
          margin: 0.75rem 0 0;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
