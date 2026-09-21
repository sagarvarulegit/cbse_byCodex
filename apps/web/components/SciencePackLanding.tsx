'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { SessionUser } from '../lib/auth';
import { SCIENCE_CH1_5_PACK_KEY } from '../lib/payments';
import ProductCheckoutModal from './ProductCheckoutModal';

export type SciencePackLandingProps = {
  session: SessionUser | null;
  token: string | null;
  isUnlocked: boolean;
};

export default function SciencePackLanding({
  session,
  token,
  isUnlocked,
}: SciencePackLandingProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const chapters = [
    {
      num: '01',
      title: 'Chemical Reactions & Equations',
      marksWeight: 'High Frequency · 5–7 Marks',
      tags: ['Balanced Reactions', 'Electrolysis 2:1', 'Lead Nitrate', 'Redox'],
      desc: 'Master the 5 reaction types, thermal decomposition color changes, water electrolysis volumes, and balanced board equations.',
      notesHref: '/subjects/science/chemical-reactions-and-equations',
    },
    {
      num: '02',
      title: 'Acids, Bases & Salts',
      marksWeight: 'High Frequency · 6–8 Marks',
      tags: ['Chlor-Alkali', 'Bleaching Powder', 'Baking & Washing Soda', 'POP'],
      desc: 'Complete formulas, industrial preparations, balanced reactions, and full indicator color chart (Phenolphthalein, Litmus, Methyl Orange).',
      notesHref: '/subjects/science/acids-bases-and-salts',
    },
    {
      num: '03',
      title: 'Metals & Non-Metals',
      marksWeight: 'High Frequency · 6–8 Marks',
      tags: ['Reactivity Mnemonic', 'Amphoteric Oxides', 'Roasting vs Calcination', 'Thermite'],
      desc: 'Reactivity series shortcuts, ionic bond formation dot structures, metallurgy extraction steps, and corrosion prevention.',
      notesHref: '/subjects/science/metals-and-non-metals',
    },
    {
      num: '04',
      title: 'Carbon & Its Compounds',
      marksWeight: 'Critical · 6–9 Marks',
      tags: ['Catenation', 'Homologous Series', 'Esterification', 'Micelles'],
      desc: 'IUPAC naming rules, structural isomers, combustion/addition/substitution reactions, saponification, and soap cleansing action.',
      notesHref: '/subjects/science/carbon-and-its-compounds',
    },
    {
      num: '05',
      title: 'Life Processes',
      marksWeight: 'Highest Biology Weight · 8–10 Marks',
      tags: ['Nephron Diagram', 'Double Circulation', '3 Glucose Pathways', 'Stomata'],
      desc: 'Step-by-step labeled diagrams, 3-pathway glucose breakdown matrix, digestive enzymes, heart flow chart, and nephron filtration.',
      notesHref: '/subjects/science/life-processes',
    },
  ];

  return (
    <div className="science-pack-container">
      {/* Hero Header */}
      <header className="hero-section">
        <div className="eyebrow-chip">
          <span>🧪 CBSE Class 10 Science · Chapters 1 to 5</span>
          <span className="badge-live">2026-27 Board Edition</span>
        </div>

        <h1 className="hero-title">
          Stop Losing 15–20 Marks on Chemical Reactions, Activities &amp; Diagrams
        </h1>

        <p className="hero-subtext">
          Chapters 1 to 5 account for <strong>nearly 50% of your Science Board Paper</strong>.
          Get 10-year verified Previous Year Questions with official CBSE step-wise marking schemes,
          all 13 NCERT experimental activity observation sheets, and 1-page rapid summary sheets.
        </p>

        {/* Pricing Card Banner */}
        <div className="hero-cta-card">
          <div className="cta-pricing-row">
            <div className="price-stack">
              <span className="price-label">Complete 5-Chapter Board Revision Pack</span>
              <div className="price-values">
                <span className="price-current">₹99</span>
                <span className="price-original">₹299</span>
                <span className="price-discount">67% OFF</span>
              </div>
            </div>
            <div className="cta-action-wrap">
              {isUnlocked ? (
                <Link href="/activities-and-diagrams" className="btn-cta-main btn-unlocked">
                  ✓ Pack Unlocked — Open Revision Hub →
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn-cta-main"
                  onClick={() => setCheckoutOpen(true)}
                >
                  ⚡ Get Instant Access for ₹99 →
                </button>
              )}
              <span className="cta-guarantee">🛡️ Instant Unlock · UPI / GPay / PhonePe · 48h Guarantee</span>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Points */}
      <section className="trust-grid">
        <div className="trust-item">
          <span className="trust-icon">📋</span>
          <div>
            <strong>84 Board Exams Reviewed</strong>
            <p>Extracted from official CBSE Class 10 papers (2015–2026) with real question frequencies.</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🎯</span>
          <div>
            <strong>Step-Wise Marking Schemes</strong>
            <p>Know exactly where examiners give 0.5, 1, and 2 marks for formulas, units &amp; statements.</p>
          </div>
        </div>
        <div className="trust-item">
          <span className="trust-icon">🔬</span>
          <div>
            <strong>All 13 NCERT Activities</strong>
            <p>Every test-tube color change, gas evolution test, precipitate, and ray/circuit diagram.</p>
          </div>
        </div>
      </section>

      {/* Chapters Breakdown */}
      <section className="chapters-section">
        <div className="section-header">
          <span className="section-pill">Syllabus Breakdown</span>
          <h2>What is Covered in Chapters 1 to 5</h2>
          <p>Everything you need for rapid pre-board and board exam mastery.</p>
        </div>

        <div className="chapters-grid">
          {chapters.map((ch) => (
            <article key={ch.num} className="chapter-card">
              <div className="chapter-card-header">
                <span className="chapter-num">{ch.num}</span>
                <div className="chapter-meta">
                  <span className="marks-badge">{ch.marksWeight}</span>
                  <h3>{ch.title}</h3>
                </div>
              </div>

              <p className="chapter-desc">{ch.desc}</p>

              <div className="tags-row">
                {ch.tags.map((t, idx) => (
                  <span key={idx} className="tag-chip">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="chapter-bottom-links">
                <Link href={ch.notesHref} className="link-preview">
                  Free Notes Preview →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Final Action Bar */}
      <section className="bottom-cta-banner">
        <div className="bottom-cta-content">
          <h2>Ready to Ace Chapters 1 to 5?</h2>
          <p>Instant digital access. Printable on any device. Start revising in 30 seconds.</p>
        </div>
        <div>
          {isUnlocked ? (
            <Link href="/activities-and-diagrams" className="btn-cta-main btn-unlocked">
              Open Revision Hub →
            </Link>
          ) : (
            <button
              type="button"
              className="btn-cta-main"
              onClick={() => setCheckoutOpen(true)}
            >
              ⚡ Unlock for ₹99 (One-Time) →
            </button>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <ProductCheckoutModal
          isOpen={true}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={() => {
            setCheckoutOpen(false);
            window.location.reload();
          }}
          token={token}
          userFullName={session?.fullName}
          userEmail={session?.email || undefined}
          initialProductKey={SCIENCE_CH1_5_PACK_KEY}
        />
      )}

      <style jsx>{`
        .science-pack-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 5rem;
          color: #171513;
        }
        .hero-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .eyebrow-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #fff0d4;
          border: 1.5px solid #d97706;
          border-radius: 999px;
          padding: 0.3rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 800;
          color: #92400e;
          margin-bottom: 1.25rem;
        }
        .badge-live {
          background: #d97706;
          color: #ffffff;
          border-radius: 999px;
          padding: 0.1rem 0.5rem;
          font-size: 0.72rem;
          text-transform: uppercase;
        }
        .hero-title {
          font-size: 2.4rem;
          font-weight: 900;
          line-height: 1.2;
          max-width: 820px;
          margin: 0 auto 1.2rem;
          color: #171513;
          letter-spacing: -0.02em;
        }
        .hero-subtext {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #4b4742;
          max-width: 760px;
          margin: 0 auto 2rem;
        }
        .hero-cta-card {
          background: #ffffff;
          border: 3px solid #171513;
          border-radius: 20px;
          padding: 1.5rem 2rem;
          box-shadow: 6px 6px 0 #171513;
          max-width: 780px;
          margin: 0 auto;
        }
        .cta-pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .price-stack {
          text-align: left;
        }
        .price-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #666;
          margin-bottom: 0.2rem;
        }
        .price-values {
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
        }
        .price-current {
          font-size: 2.2rem;
          font-weight: 900;
          color: #c95014;
        }
        .price-original {
          font-size: 1.2rem;
          text-decoration: line-through;
          color: #888;
        }
        .price-discount {
          background: #0b7a48;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
        }
        .cta-action-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          align-items: flex-end;
        }
        .btn-cta-main {
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 12px;
          padding: 0.9rem 1.75rem;
          font-size: 1.05rem;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 4px 4px 0 #c95014;
          transition: all 0.15s ease;
          text-decoration: none;
          display: inline-block;
        }
        .btn-cta-main:hover {
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 #c95014;
        }
        .btn-unlocked {
          background: #0b7a48;
          border-color: #0b7a48;
          box-shadow: 4px 4px 0 #171513;
        }
        .cta-guarantee {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 3.5rem;
        }
        .trust-item {
          display: flex;
          gap: 1rem;
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 14px;
          padding: 1.25rem;
          align-items: flex-start;
          box-shadow: 3px 3px 0 #171513;
        }
        .trust-icon {
          font-size: 1.8rem;
          flex-shrink: 0;
        }
        .trust-item strong {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .trust-item p {
          font-size: 0.82rem;
          color: #555;
          margin: 0;
          line-height: 1.45;
        }
        .chapters-section {
          margin-bottom: 3.5rem;
        }
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .section-pill {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          background: #f0ebe1;
          border: 1.5px solid #171513;
          border-radius: 999px;
          padding: 0.2rem 0.7rem;
          margin-bottom: 0.5rem;
        }
        .section-header h2 {
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0.2rem 0;
        }
        .section-header p {
          color: #666;
          font-size: 0.95rem;
          margin: 0;
        }
        .chapters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
          gap: 1.25rem;
        }
        .chapter-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 4px 4px 0 #171513;
          display: flex;
          flex-direction: column;
        }
        .chapter-card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 0.85rem;
        }
        .chapter-num {
          font-size: 1.2rem;
          font-weight: 900;
          color: #c95014;
          background: #fff3ed;
          border: 1.5px solid #c95014;
          border-radius: 10px;
          padding: 0.25rem 0.6rem;
          flex-shrink: 0;
        }
        .chapter-meta {
          flex: 1;
        }
        .marks-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          color: #0b7a48;
          margin-bottom: 0.2rem;
        }
        .chapter-meta h3 {
          font-size: 1.05rem;
          font-weight: 900;
          margin: 0;
          line-height: 1.3;
        }
        .chapter-desc {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.5;
          flex: 1;
          margin: 0 0 1rem;
        }
        .tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }
        .tag-chip {
          font-size: 0.72rem;
          background: #f7f4ee;
          color: #444;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 0.15rem 0.45rem;
          font-weight: 600;
        }
        .chapter-bottom-links {
          border-top: 1px dashed #e5ded0;
          padding-top: 0.75rem;
          display: flex;
          justify-content: flex-end;
        }
        .link-preview {
          font-size: 0.8rem;
          font-weight: 800;
          color: #c95014;
          text-decoration: none;
        }
        .link-preview:hover {
          text-decoration: underline;
        }
        .bottom-cta-banner {
          background: #171513;
          color: #ffffff;
          border-radius: 20px;
          padding: 2.2rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .bottom-cta-content h2 {
          font-size: 1.6rem;
          font-weight: 900;
          margin: 0 0 0.4rem;
        }
        .bottom-cta-content p {
          color: #a8a29e;
          font-size: 0.95rem;
          margin: 0;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 1.8rem;
          }
          .cta-pricing-row {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }
          .price-stack {
            text-align: center;
          }
          .price-values {
            justify-content: center;
          }
          .cta-action-wrap {
            align-items: stretch;
          }
          .bottom-cta-banner {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
