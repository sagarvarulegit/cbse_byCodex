'use client';

import { useEffect, useState } from 'react';
import {
  ALL_SUBJECTS_MOCK_PACK_KEY,
  createPaymentOrder,
  verifyPayment,
} from '../lib/payments';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export type PaywallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (productKey: string) => void;
  token: string | null;
  subjectSlug: string;
  subjectTitle: string;
  userFullName?: string;
  userEmail?: string;
};

export default function PaywallModal({
  isOpen,
  onClose,
  onSuccess,
  token,
  subjectSlug,
  subjectTitle,
  userFullName,
  userEmail,
}: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'all_subjects' | 'single_subject'>('all_subjects');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Razorpay checkout script on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) {
    return null;
  }

  async function handleCheckout() {
    setIsProcessing(true);
    setErrorMessage(null);

    const productKey =
      selectedPlan === 'all_subjects'
        ? ALL_SUBJECTS_MOCK_PACK_KEY
        : `cbse10-mock-pass-${subjectSlug}`;

    try {
      const orderData = await createPaymentOrder(
        token,
        productKey,
        selectedPlan === 'single_subject' ? subjectSlug : undefined,
      );

      if (!orderData) {
        throw new Error('Could not initiate order with server. Please try again.');
      }

      if (!window.Razorpay) {
        // If razorpay script hasn't loaded or in simulation mode
        if (orderData.keyId.startsWith('rzp_test_placeholder')) {
          // Simulate local verification in dev mode
          const simRes = await verifyPayment(token, {
            razorpayOrderId: orderData.orderId,
            razorpayPaymentId: `pay_sim_${Date.now()}`,
            razorpaySignature: `sim_sig_${orderData.orderId}_pay_sim_${Date.now()}`,
          });
          if (simRes?.success) {
            setIsProcessing(false);
            onSuccess(productKey);
            onClose();
            return;
          }
        }
        throw new Error('Payment gateway is loading. Please try again in a moment.');
      }

      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ChapterReady CBSE Class 10',
        description: orderData.product.title,
        order_id: orderData.orderId,
        prefill: {
          name: userFullName,
          email: userEmail,
        },
        theme: {
          color: '#171513',
        },
        handler: async (response: RazorpayResponse) => {
          try {
            const verifyRes = await verifyPayment(token, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes?.success) {
              setIsProcessing(false);
              onSuccess(productKey);
              onClose();
            } else {
              setErrorMessage('Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Payment verification error.';
            setErrorMessage(message);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Payment initialization failed.';
      setErrorMessage(message);
      setIsProcessing(false);
    }
  }

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="paywall-title">
      <div className="paywall-card">
        <button
          type="button"
          className="paywall-close"
          onClick={onClose}
          aria-label="Close paywall modal"
        >
          ✕
        </button>

        <div className="paywall-header">
          <span className="paywall-badge">🚀 Board Exam Mastery Pass</span>
          <h2 id="paywall-title">Unlock Full Mock Test Series</h2>
          <p className="paywall-subhead">
            Experience real 3-hour CBSE board conditions with full marking scheme solutions and weak-chapter diagnostics.
          </p>
        </div>

        <div className="paywall-features-grid">
          <div className="feature-item">
            <span className="feature-icon">📄</span>
            <div>
              <strong>Full 80-Mark Papers</strong>
              <span>Deterministic NCERT board pattern with 15 min reading time.</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <div>
              <strong>Live CBT Exam Timer</strong>
              <span>Simulated board test environment with instant auto-scoring.</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <div>
              <strong>Official Marking Scheme</strong>
              <span>Step-wise value points and model answers for self-marking.</span>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <strong>Mistake Diagnostics</strong>
              <span>Automatic weak-chapter reports and 3-day spaced repetition retry.</span>
            </div>
          </div>
        </div>

        <div className="paywall-pricing-options">
          {/* Option A: All 4 Subjects (Recommended) */}
          <div
            className={`plan-card ${selectedPlan === 'all_subjects' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('all_subjects')}
          >
            <div className="plan-pill">Limited Offer · 60% OFF</div>
            <div className="plan-top">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === 'all_subjects'}
                onChange={() => setSelectedPlan('all_subjects')}
              />
              <div>
                <strong>All 4 Core Subjects Pack</strong>
                <span>Maths (041), Science (086), SST (087), English (184)</span>
              </div>
            </div>
            <div className="plan-price">
              <span className="price-current">₹199</span>
              <span className="price-original">₹499</span>
              <span className="price-tag">Just ₹10/Paper · 20 Papers</span>
            </div>
            <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: '#b43403', fontWeight: '700' }}>
              ⚡ Save ₹1,400+ compared to physical sample books
            </div>
          </div>

          {/* Option B: Single Subject */}
          <div
            className={`plan-card ${selectedPlan === 'single_subject' ? 'selected' : ''}`}
            onClick={() => setSelectedPlan('single_subject')}
          >
            <div className="plan-top">
              <input
                type="radio"
                name="plan"
                checked={selectedPlan === 'single_subject'}
                onChange={() => setSelectedPlan('single_subject')}
              />
              <div>
                <strong>{subjectTitle} Pass Only</strong>
                <span>All 5 Papers for {subjectTitle}</span>
              </div>
            </div>
            <div className="plan-price">
              <span className="price-current">₹99</span>
              <span className="price-original">₹199</span>
              <span className="price-tag">5 Papers</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="paywall-error" role="alert">
            {errorMessage}
          </div>
        )}

        <button
          type="button"
          className="paywall-cta-btn"
          disabled={isProcessing}
          onClick={handleCheckout}
        >
          {isProcessing ? 'Connecting to Razorpay…' : `Unlock Now for ₹${selectedPlan === 'all_subjects' ? '199' : '99'} →`}
        </button>

        <p className="paywall-guarantee">
          🔒 Secure 256-bit payment via Razorpay · Instant Unlock · Academic Year 2026-27 Access
        </p>
      </div>

      <style jsx>{`
        .paywall-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(18, 16, 14, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }
        .paywall-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 24px;
          max-width: 580px;
          width: 100%;
          padding: 2rem 2.25rem;
          position: relative;
          box-shadow: 8px 8px 0 #171513;
          animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .paywall-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: #f4eee3;
          border: 2px solid #171513;
          border-radius: 50%;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 900;
          cursor: pointer;
          transition: background 0.1s ease;
        }
        .paywall-close:hover { background: #e5ded0; }
        .paywall-header { margin-bottom: 1.25rem; }
        .paywall-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: #ffe9b8;
          color: #171513;
          border: 1.5px solid #171513;
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          margin-bottom: 0.5rem;
        }
        .paywall-header h2 {
          font-family: var(--font-bangers, 'Bangers', cursive, sans-serif);
          font-size: 2rem;
          letter-spacing: 0.5px;
          margin: 0.2rem 0;
          color: #171513;
        }
        .paywall-subhead { font-size: 0.9rem; color: #55514b; line-height: 1.45; margin: 0; }
        .paywall-features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
          background: #fbf9f4;
          border: 1.5px solid #171513;
          border-radius: 14px;
          padding: 1rem;
        }
        @media (max-width: 500px) {
          .paywall-features-grid { grid-template-columns: 1fr; }
        }
        .feature-item { display: flex; gap: 0.6rem; align-items: flex-start; }
        .feature-icon { font-size: 1.25rem; }
        .feature-item strong { display: block; font-size: 0.82rem; color: #171513; }
        .feature-item span { font-size: 0.75rem; color: #666; line-height: 1.35; display: block; }
        .paywall-pricing-options { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.5rem; }
        .plan-card {
          border: 2px solid #171513;
          border-radius: 16px;
          padding: 1rem 1.15rem;
          cursor: pointer;
          position: relative;
          background: #ffffff;
          transition: all 0.15s ease;
        }
        .plan-card.selected {
          border-color: #c95014;
          background: #fff8f2;
          box-shadow: 3px 3px 0 #c95014;
        }
        .plan-pill {
          position: absolute;
          top: -10px;
          right: 14px;
          background: #c95014;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 900;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .plan-top { display: flex; align-items: center; gap: 0.75rem; }
        .plan-top strong { display: block; font-size: 0.95rem; color: #171513; }
        .plan-top span { font-size: 0.78rem; color: #666; }
        .plan-price { display: flex; align-items: baseline; gap: 0.5rem; margin-top: 0.5rem; padding-left: 1.75rem; }
        .price-current { font-size: 1.4rem; font-weight: 900; color: #171513; }
        .price-original { font-size: 0.9rem; text-decoration: line-through; color: #888; }
        .price-tag { font-size: 0.75rem; font-weight: 700; color: #0b7a48; background: #e3f3ee; padding: 0.15rem 0.5rem; border-radius: 6px; }
        .paywall-error {
          background: #fee2e2;
          border: 1.5px solid #ef4444;
          border-radius: 10px;
          padding: 0.6rem 0.85rem;
          color: #991b1b;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .paywall-cta-btn {
          width: 100%;
          padding: 0.95rem 1.5rem;
          background: #171513;
          color: #ffffff;
          border: 2.5px solid #171513;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.25);
          transition: transform 0.1s ease, background 0.12s ease;
        }
        .paywall-cta-btn:hover:not(:disabled) {
          background: #332f2b;
          transform: translateY(-1px);
        }
        .paywall-cta-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .paywall-guarantee {
          text-align: center;
          font-size: 0.75rem;
          color: #787168;
          margin: 0.85rem 0 0 0;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
