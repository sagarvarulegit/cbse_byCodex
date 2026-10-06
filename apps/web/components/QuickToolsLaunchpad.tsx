'use client';

import React from 'react';
import Link from 'next/link';

export type ToolItem = {
  id: string;
  badge: string;
  badgeColor: string;
  icon: string;
  title: string;
  description: string;
  ctaText: string;
  href: string;
  accentColor: string;
};

const TOOLS: ToolItem[] = [
  {
    id: 'virtual-lab',
    badge: 'Interactive 3D',
    badgeColor: '#0284c7',
    icon: '🔬',
    title: '3D Virtual Science Lab',
    description: 'Explore NCERT practicals in 3D: Magnesium ribbon, prism dispersion & apparatus.',
    ctaText: 'Launch 3D Lab →',
    href: '/virtual-lab',
    accentColor: '#0284c7',
  },
  {
    id: 'formula-cheatsheets',
    badge: '1-Page Sheets',
    badgeColor: '#16a34a',
    icon: '⚡',
    title: 'Formula & Reaction Sheets',
    description: 'High-yield 1-page cheatsheets for Class 10 Maths formulas and Science reactions.',
    ctaText: 'Open Cheatsheets →',
    href: '/formula-cheatsheets',
    accentColor: '#16a34a',
  },
  {
    id: 'exam-papers',
    badge: '80-Mark Mock',
    badgeColor: '#c95014',
    icon: '🎯',
    title: 'Board Score Predictor',
    description: 'Official 3-hour CBSE mock paper simulator with step-by-step marking rubrics.',
    ctaText: 'Start Mock Paper →',
    href: '/exam-papers',
    accentColor: '#c95014',
  },
  {
    id: 'formula-rush',
    badge: '3-Min Recharge',
    badgeColor: '#9333ea',
    icon: '🎮',
    title: 'Formula Rush Arcade',
    description: '60-second rapid-fire formula drill. Build lightning-fast recall for the exam hall.',
    ctaText: 'Play Rush Blitz →',
    href: '/games/formula-rush',
    accentColor: '#9333ea',
  },
];

export default function QuickToolsLaunchpad() {
  return (
    <section className="launchpad-section" aria-label="Quick Practice and Revision Boosters">
      <div className="section-header">
        <div className="title-group">
          <p className="eyebrow">High-Yield Revision Engines</p>
          <h2>⚡ Quick Practice &amp; Study Boosters</h2>
        </div>
        <span className="header-subtitle">
          Specialized CBSE Class 10 learning engines designed for rapid recall and exam confidence
        </span>
      </div>

      <div className="tools-grid">
        {TOOLS.map((tool) => (
          <Link key={tool.id} href={tool.href} className="tool-card">
            <div className="tool-card-top">
              <span
                className="tool-badge"
                style={{
                  color: tool.badgeColor,
                  borderColor: tool.badgeColor,
                  background: `${tool.badgeColor}12`,
                }}
              >
                {tool.badge}
              </span>
              <span className="tool-icon">{tool.icon}</span>
            </div>

            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-desc">{tool.description}</p>

            <div className="tool-cta-row">
              <span className="tool-cta" style={{ color: tool.accentColor }}>
                {tool.ctaText}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .launchpad-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c95014;
          margin: 0 0 0.25rem 0;
        }

        h2 {
          font-family: var(--font-bangers, 'Bangers', cursive, sans-serif);
          font-size: 1.85rem;
          letter-spacing: 0.5px;
          color: #171513;
          margin: 0;
          line-height: 1.1;
        }

        .header-subtitle {
          font-size: 0.8125rem;
          color: #787168;
          font-weight: 600;
          max-width: 440px;
          text-align: right;
        }

        @media (max-width: 860px) {
          .header-subtitle {
            text-align: left;
          }
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.15rem;
        }

        @media (max-width: 1080px) {
          .tools-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 580px) {
          .tools-grid {
            grid-template-columns: 1fr;
          }
        }

        .tool-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 18px;
          padding: 1.35rem 1.25rem;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
          box-shadow: 4px 4px 0 #171513;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .tool-card:hover {
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 #171513;
        }

        .tool-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tool-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          border: 1px solid;
        }

        .tool-icon {
          font-size: 1.6rem;
          line-height: 1;
        }

        .tool-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #171513;
          margin: 0.15rem 0 0 0;
          line-height: 1.25;
        }

        .tool-desc {
          font-size: 0.8125rem;
          color: #5d5750;
          line-height: 1.45;
          margin: 0;
          flex: 1;
        }

        .tool-cta-row {
          margin-top: 0.25rem;
          padding-top: 0.6rem;
          border-top: 1px solid #f1ede4;
        }

        .tool-cta {
          font-size: 0.8125rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .tool-card:hover .tool-cta {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
