'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SessionUser } from '../lib/auth';
import {
  type StudentEntitlementsResponse,
  ALL_SUBJECTS_MOCK_PACK_KEY,
  NCERT_ACTIVITY_DIAGRAM_PACK_KEY,
  FORMULA_CHEATSHEET_PACK_KEY,
  ACTIVITY_FORMULA_COMBO_PACK_KEY,
  UNLIMITED_QUIZ_PASS_KEY,
} from '../lib/payments';
import ProductCheckoutModal from './ProductCheckoutModal';
import PaywallModal from './PaywallModal';
import QuizPaywallModal from './QuizPaywallModal';

export type StoreCategory = 'all' | 'revision' | 'mock_papers' | 'practice';

export interface StoreProduct {
  id: string;
  productKey: string;
  subjectSlug?: string;
  category: 'revision' | 'mock_papers' | 'practice';
  title: string;
  badge: string;
  badgeColor?: string;
  priceInr: number;
  originalPriceInr: number;
  discountPercent: number;
  shortDesc: string;
  features: string[];
  launchHref: string;
  launchLabel: string;
  modalType: 'product' | 'mock' | 'quiz';
}

export const STORE_PRODUCTS: StoreProduct[] = [
  // 1. Revision Combo
  {
    id: 'store-combo',
    productKey: ACTIVITY_FORMULA_COMBO_PACK_KEY,
    category: 'revision',
    title: 'Class 10 Activity, Diagram & Formula Super Combo',
    badge: '👑 Best Value Combo',
    badgeColor: '#0b7a48',
    priceInr: 129,
    originalPriceInr: 399,
    discountPercent: 67,
    shortDesc: 'Get both the NCERT Science Activity & Diagram Pack AND all Maths & Science 1-Page Formula Cheatsheets together.',
    features: [
      'All 13 Science chapter experimental setups & reactions',
      'All Maths & Science 1-page printable summary wall-sheets',
      'Interactive diagram drills & 3D formula flashcards',
      'Verified CBSE 3-mark & 5-mark board exam questions',
    ],
    launchHref: '/activities-and-diagrams',
    launchLabel: 'Open Revision Hub',
    modalType: 'product',
  },

  // 2. Activity Pack
  {
    id: 'store-activity',
    productKey: NCERT_ACTIVITY_DIAGRAM_PACK_KEY,
    category: 'revision',
    title: 'NCERT Activity & Diagram Mastery Pack',
    badge: '🔬 NCERT Special',
    badgeColor: '#c25e00',
    priceInr: 99,
    originalPriceInr: 249,
    discountPercent: 60,
    shortDesc: 'Crack the 15–20 marks asked directly from NCERT Science activities, observations, and ray/circuit diagrams.',
    features: [
      'Chemistry test-tube reactions, precipitates & color changes',
      'Biology starch, stomata, bell-jar & life process setups',
      'Physics glass slab refraction & Ohm’s law circuit verifications',
      'Downloadable high-resolution PDF activity handbook',
    ],
    launchHref: '/activities-and-diagrams',
    launchLabel: 'Open Activities Hub',
    modalType: 'product',
  },

  // 3. Formula Cheatsheets
  {
    id: 'store-formulas',
    productKey: FORMULA_CHEATSHEET_PACK_KEY,
    category: 'revision',
    title: 'Class 10 Formula & Reaction Cheatsheet Pack',
    badge: '⚡ Quick Revision',
    badgeColor: '#0284c7',
    priceInr: 49,
    originalPriceInr: 149,
    discountPercent: 67,
    shortDesc: 'Ultra-dense 1-page printable summary sheets per chapter for Class 10 Mathematics & Science.',
    features: [
      'All Maths formulas, identities & standard value tables',
      'Science balanced equations, SI units & sign conventions',
      'Common board exam mistake warnings & traps to avoid',
      'Digital 3D interactive flashcards for fast recall',
    ],
    launchHref: '/formula-cheatsheets',
    launchLabel: 'Open Formula Hub',
    modalType: 'product',
  },

  // 4. All Subjects Mock Pack
  {
    id: 'store-mocks-all',
    productKey: ALL_SUBJECTS_MOCK_PACK_KEY,
    category: 'mock_papers',
    title: 'All-Subjects Board Mock Pack (20 Full Papers)',
    badge: '🏆 Topper Track · 20 Papers',
    badgeColor: '#c95014',
    priceInr: 199,
    originalPriceInr: 499,
    discountPercent: 60,
    shortDesc: 'All 20 full-length 80-mark mock papers (Papers 1..5) across Maths (041), Science (086), SST (087), and English (184).',
    features: [
      'Exact CBSE board pattern with 15 min reading time & timer',
      'Official step-wise marking scheme answers for self-marking',
      'Automatic weak-chapter diagnosis & spaced retry',
      'Printable board exam question papers & solution sheets',
    ],
    launchHref: '/exam-papers',
    launchLabel: 'Open Mock Papers',
    modalType: 'mock',
  },

  // 5. Unlimited Quiz Pass
  {
    id: 'store-quiz-pass',
    productKey: UNLIMITED_QUIZ_PASS_KEY,
    category: 'practice',
    title: 'Class 10 Unlimited CBSE Quiz Pass (All 48 Chapters)',
    badge: '🎯 Unlimited Practice',
    badgeColor: '#8b5cf6',
    priceInr: 199,
    originalPriceInr: 599,
    discountPercent: 66,
    shortDesc: 'Remove the 3 daily quiz limit! Unlimited practice, random challenges, and mistake vault access across all 4 subjects.',
    features: [
      'Unlimited daily quizzes across Maths, Science, SST & English',
      'Spaced Repetition Mistake Vault to fix weak concepts',
      'Instant Random Challenge Generator for surprise testing',
      'Chapter mastery badges, streaks, and topper leaderboards',
    ],
    launchHref: '/quizzes',
    launchLabel: 'Open Quiz Arena',
    modalType: 'quiz',
  },

  // 6. Single Subject Mock Passes (Maths)
  {
    id: 'store-mock-maths',
    productKey: 'cbse10-mock-pass-mathematics-standard',
    subjectSlug: 'mathematics-standard',
    category: 'mock_papers',
    title: 'Maths Standard (041) — 5 Board Mock Papers',
    badge: '📐 Subject Pass',
    badgeColor: '#475569',
    priceInr: 99,
    originalPriceInr: 199,
    discountPercent: 50,
    shortDesc: 'All 5 official board-format 80-mark mock papers for Mathematics Standard (041) with complete step-wise solutions.',
    features: [
      'Papers 1 to 5 for Mathematics Standard',
      'Full CBT exam timer & printable PDF format',
      'Step-wise marking scheme solutions',
    ],
    launchHref: '/exam-papers',
    launchLabel: 'Open Maths Papers',
    modalType: 'mock',
  },

  // 7. Single Subject Mock Passes (Science)
  {
    id: 'store-mock-science',
    productKey: 'cbse10-mock-pass-science',
    subjectSlug: 'science',
    category: 'mock_papers',
    title: 'Science (086) — 5 Board Mock Papers',
    badge: '🧪 Subject Pass',
    badgeColor: '#475569',
    priceInr: 99,
    originalPriceInr: 199,
    discountPercent: 50,
    shortDesc: 'All 5 official board-format 80-mark mock papers for Science (086) covering Physics, Chemistry, and Biology.',
    features: [
      'Papers 1 to 5 for Science (086)',
      'Full CBT exam timer & printable PDF format',
      'Step-wise marking scheme solutions',
    ],
    launchHref: '/exam-papers',
    launchLabel: 'Open Science Papers',
    modalType: 'mock',
  },
];

export type StoreClientViewProps = {
  session?: SessionUser | null;
  token?: string | null;
  entitlements?: StudentEntitlementsResponse | null;
};

export default function StoreClientView({
  session,
  token = null,
  entitlements = null,
}: StoreClientViewProps) {
  const [activeCategory, setActiveCategory] = useState<StoreCategory>('all');
  const [activeModal, setActiveModal] = useState<{
    type: 'product' | 'mock' | 'quiz' | null;
    productKey?: string;
    subjectSlug?: string;
  }>({ type: null });

  // Compute unlocked products map
  const unlockedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (!entitlements) return map;

    const hasAllSubjects = entitlements.hasAllSubjects || entitlements.entitlements.some(
      (e) => e.productKey === ALL_SUBJECTS_MOCK_PACK_KEY && e.status === 'active',
    );

    const hasCombo = entitlements.entitlements.some(
      (e) => e.productKey === ACTIVITY_FORMULA_COMBO_PACK_KEY && e.status === 'active',
    );

    const hasActivity = hasCombo || entitlements.entitlements.some(
      (e) => e.productKey === NCERT_ACTIVITY_DIAGRAM_PACK_KEY && e.status === 'active',
    );

    const hasFormulas = hasCombo || entitlements.entitlements.some(
      (e) => e.productKey === FORMULA_CHEATSHEET_PACK_KEY && e.status === 'active',
    );

    const hasQuizzes = hasAllSubjects || entitlements.entitlements.some(
      (e) => e.productKey === UNLIMITED_QUIZ_PASS_KEY && e.status === 'active',
    );

    if (hasAllSubjects) {
      map[ALL_SUBJECTS_MOCK_PACK_KEY] = true;
      map['cbse10-mock-pass-mathematics-standard'] = true;
      map['cbse10-mock-pass-science'] = true;
      map['cbse10-mock-pass-social-science'] = true;
      map['cbse10-mock-pass-english-language-and-literature'] = true;
    }

    if (hasCombo) {
      map[ACTIVITY_FORMULA_COMBO_PACK_KEY] = true;
      map[NCERT_ACTIVITY_DIAGRAM_PACK_KEY] = true;
      map[FORMULA_CHEATSHEET_PACK_KEY] = true;
    }
    if (hasActivity) map[NCERT_ACTIVITY_DIAGRAM_PACK_KEY] = true;
    if (hasFormulas) map[FORMULA_CHEATSHEET_PACK_KEY] = true;
    if (hasQuizzes) map[UNLIMITED_QUIZ_PASS_KEY] = true;

    // Single subject passes
    entitlements.entitlements.forEach((e) => {
      if (e.status === 'active') {
        map[e.productKey] = true;
      }
    });

    return map;
  }, [entitlements]);

  const filteredProducts = useMemo(() => {
    return STORE_PRODUCTS.filter((prod) => {
      if (activeCategory === 'all') return true;
      return prod.category === activeCategory;
    });
  }, [activeCategory]);

  const handleOpenCheckout = (product: StoreProduct) => {
    setActiveModal({
      type: product.modalType,
      productKey: product.productKey,
      subjectSlug: product.subjectSlug || 'mathematics-standard',
    });
  };

  const handleCloseModal = () => {
    setActiveModal({ type: null });
  };

  return (
    <div className="store-container">
      {/* Store Hero */}
      <div className="store-hero">
        <div className="hero-eyebrow">
          <span className="store-pill">🛍️ ChapterReady Store</span>
          <span className="academic-badge">Academic Year 2026-27</span>
        </div>
        <h1>Affordable CBSE Class 10 Board Exam Packs</h1>
        <p className="store-subtext">
          Notes are 100% free forever on ChapterReady. Unlock printable revision handbooks,
          interactive diagram drills, 80-mark CBT mock papers, and unlimited practice—all strictly under ₹200 INR.
        </p>

        {/* Trust & Guarantee Strip */}
        <div className="trust-strip">
          <div className="trust-item">
            <span className="trust-icon">🔒</span>
            <span>256-bit Secure UPI &amp; Cards Payment</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <span>Instant Access Across All Devices</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span>48-Hour Satisfaction Guarantee</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="category-filter-strip" role="tablist">
        <button
          type="button"
          className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Items ({STORE_PRODUCTS.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeCategory === 'revision' ? 'active' : ''}`}
          onClick={() => setActiveCategory('revision')}
        >
          ⚡ Revision Packs (₹49 – ₹129)
        </button>
        <button
          type="button"
          className={`filter-tab ${activeCategory === 'mock_papers' ? 'active' : ''}`}
          onClick={() => setActiveCategory('mock_papers')}
        >
          📄 80-Mark Mock Papers (₹99 – ₹199)
        </button>
        <button
          type="button"
          className={`filter-tab ${activeCategory === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveCategory('practice')}
        >
          🎯 Unlimited Quizzes (₹199)
        </button>
      </div>

      {/* Products Grid */}
      <div className="store-products-grid">
        {filteredProducts.map((prod) => {
          const isOwned = Boolean(unlockedMap[prod.productKey]);

          return (
            <article
              key={prod.id}
              className={`product-card ${isOwned ? 'owned-card' : ''} ${prod.id === 'store-combo' ? 'featured-card' : ''}`}
            >
              <div className="product-card-top">
                <span
                  className="product-badge"
                  style={{ background: prod.badgeColor ? `${prod.badgeColor}18` : '#ffe9b8', color: prod.badgeColor || '#171513', borderColor: prod.badgeColor || '#171513' }}
                >
                  {prod.badge}
                </span>
                {isOwned && <span className="owned-pill">✓ Unlocked</span>}
              </div>

              <h2 className="product-title">{prod.title}</h2>
              <p className="product-desc">{prod.shortDesc}</p>

              {/* Feature Checklist */}
              <ul className="product-features-list">
                {prod.features.map((feat, idx) => (
                  <li key={idx}>
                    <span className="feat-check">✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Price & Action Bottom */}
              <div className="product-card-bottom">
                <div className="price-stack">
                  <div className="price-row">
                    <span className="current-price">₹{prod.priceInr}</span>
                    <span className="original-price">₹{prod.originalPriceInr}</span>
                    <span className="discount-tag">{prod.discountPercent}% OFF</span>
                  </div>
                  <span className="validity-label">One-time payment · 2026-27 validity</span>
                </div>

                <div className="action-wrap">
                  {isOwned ? (
                    <Link href={prod.launchHref} className="btn-product-launch">
                      {prod.launchLabel} →
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="btn-product-buy"
                      onClick={() => handleOpenCheckout(prod)}
                    >
                      ⚡ Unlock Now for ₹{prod.priceInr} →
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Free Tier Reminder Banner */}
      <div className="free-tier-banner">
        <div className="free-tier-left">
          <span className="free-badge">📖 100% Free Core Learning</span>
          <h3>Looking for Chapter Notes &amp; Daily Quizzes?</h3>
          <p>
            All 48 CBSE Class 10 NCERT Chapter Notes, video lessons, and 3 daily quizzes are completely free on ChapterReady without any subscription.
          </p>
        </div>
        <div className="free-tier-links">
          <Link href="/subjects" className="btn-free-action">
            Browse Free Notes →
          </Link>
          <Link href="/quizzes" className="btn-free-action-alt">
            Free Daily Quizzes →
          </Link>
        </div>
      </div>

      {/* Modals */}
      {activeModal.type === 'product' && (
        <ProductCheckoutModal
          isOpen={true}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            window.location.reload();
          }}
          token={token}
          userFullName={session?.fullName}
          userEmail={session?.email || undefined}
          initialProductKey={activeModal.productKey}
        />
      )}

      {activeModal.type === 'mock' && (
        <PaywallModal
          isOpen={true}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            window.location.reload();
          }}
          token={token}
          subjectSlug={activeModal.subjectSlug || 'mathematics-standard'}
          subjectTitle="Mock Test Series"
          userFullName={session?.fullName}
          userEmail={session?.email || undefined}
        />
      )}

      {activeModal.type === 'quiz' && (
        <QuizPaywallModal
          isOpen={true}
          onClose={handleCloseModal}
          onSuccess={() => {
            handleCloseModal();
            window.location.reload();
          }}
          token={token}
          userFullName={session?.fullName}
          userEmail={session?.email || undefined}
        />
      )}

      <style jsx>{`
        .store-container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 2rem 1rem 6rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .store-hero {
          margin-bottom: 2.25rem;
        }
        .hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }
        .store-pill {
          background: #171513;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 900;
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
          text-transform: uppercase;
        }
        .academic-badge {
          font-size: 0.82rem;
          font-weight: 700;
          color: #787168;
        }
        h1 {
          font-size: 2.35rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.6rem;
          line-height: 1.2;
        }
        .store-subtext {
          font-size: 1.05rem;
          color: #55514b;
          line-height: 1.5;
          margin: 0 0 1.5rem;
          max-width: 860px;
        }
        .trust-strip {
          display: flex;
          gap: 1.5rem;
          background: #fbf8f3;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #171513;
        }
        .trust-icon {
          font-size: 1.1rem;
        }
        .category-filter-strip {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .filter-tab {
          background: #ffffff;
          border: 2px solid #ddd;
          border-radius: 10px;
          padding: 0.55rem 1.1rem;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          color: #555;
          transition: all 0.15s ease;
        }
        .filter-tab:hover {
          border-color: #c95014;
          color: #171513;
        }
        .filter-tab.active {
          background: #171513;
          color: #ffffff;
          border-color: #171513;
          box-shadow: 3px 3px 0 #c95014;
        }
        .store-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .product-card {
          background: #ffffff;
          border: 2.5px solid #171513;
          border-radius: 20px;
          padding: 1.75rem 1.75rem;
          box-shadow: 6px 6px 0 #171513;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.15s ease;
        }
        .product-card:hover {
          transform: translateY(-2px);
        }
        .product-card.featured-card {
          border-color: #0b7a48;
          box-shadow: 6px 6px 0 #0b7a48;
          background: #fdfdfd;
        }
        .product-card.owned-card {
          background: #f4faf7;
          border-color: #0b7a48;
        }
        .product-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .product-badge {
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          border: 1px solid;
        }
        .owned-pill {
          font-size: 0.72rem;
          font-weight: 900;
          background: #d7f0e6;
          color: #0b7a48;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
        }
        .product-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.5rem;
          line-height: 1.3;
        }
        .product-desc {
          font-size: 0.88rem;
          color: #5d5750;
          line-height: 1.45;
          margin: 0 0 1.25rem;
        }
        .product-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .product-features-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.84rem;
          color: #333;
          line-height: 1.35;
        }
        .feat-check {
          color: #0b7a48;
          font-weight: 900;
          font-size: 0.95rem;
        }
        .product-card-bottom {
          border-top: 1.5px solid #eee;
          padding-top: 1rem;
          margin-top: auto;
        }
        .price-stack {
          margin-bottom: 0.75rem;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .current-price {
          font-size: 1.75rem;
          font-weight: 900;
          color: #171513;
        }
        .original-price {
          font-size: 0.95rem;
          text-decoration: line-through;
          color: #8c827a;
        }
        .discount-tag {
          font-size: 0.72rem;
          font-weight: 800;
          background: #e3f3ee;
          color: #0b7a48;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .validity-label {
          font-size: 0.72rem;
          color: #787168;
          display: block;
          margin-top: 0.15rem;
        }
        .btn-product-buy {
          width: 100%;
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 3px 3px 0 #c95014;
          transition: all 0.12s ease;
        }
        .btn-product-buy:hover {
          background: #c95014;
          transform: translateY(-1px);
        }
        .btn-product-launch {
          display: block;
          text-align: center;
          background: #0b7a48;
          color: #ffffff;
          border: 2px solid #0b7a48;
          border-radius: 12px;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 900;
          text-decoration: none;
          transition: background 0.12s ease;
        }
        .btn-product-launch:hover {
          background: #08633a;
        }
        .free-tier-banner {
          background: linear-gradient(135deg, #fffaf0, #feebc8);
          border: 2.5px solid #171513;
          border-radius: 20px;
          padding: 2rem 2.25rem;
          box-shadow: 6px 6px 0 #171513;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .free-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          background: #ffe9b8;
          color: #171513;
          border: 1px solid #171513;
          border-radius: 999px;
          padding: 0.2rem 0.65rem;
          margin-bottom: 0.4rem;
        }
        .free-tier-left h3 {
          font-size: 1.4rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.4rem;
        }
        .free-tier-left p {
          font-size: 0.92rem;
          color: #555;
          line-height: 1.45;
          margin: 0;
          max-width: 600px;
        }
        .free-tier-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .btn-free-action {
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.75rem 1.35rem;
          font-size: 0.92rem;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }
        .btn-free-action-alt {
          background: #ffffff;
          color: #171513;
          border: 2px solid #171513;
          border-radius: 10px;
          padding: 0.75rem 1.35rem;
          font-size: 0.92rem;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}
