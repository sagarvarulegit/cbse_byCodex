'use client';

import React from 'react';
import Link from 'next/link';
import { postPilotEngagement, type PilotEngagementSurface } from '../PilotEngagementTracker';
import { buildWhatsAppShareUrl } from '../../lib/whatsapp-share';
import { trackAnalyticsEvent } from '../../lib/analytics';

const PREBOARD_HIGH_WEIGHTAGE_CHAPTERS = [
  { title: '⚡ Electricity', slug: 'electricity', badge: 'Physics · High Marks' },
  { title: '📐 Trigonometry', slug: 'introduction-to-trigonometry', badge: 'Maths · 12M Unit' },
  { title: '🧪 Carbon & Compounds', slug: 'carbon-and-its-compounds', badge: 'Chem · 5M Sure-Shot' },
  { title: '🔭 Light: Reflection & Refraction', slug: 'light-reflection-and-refraction', badge: 'Ray Diagrams' },
  { title: '📈 Quadratic Equations', slug: 'quadratic-equations', badge: 'Algebra · Word Probs' },
  { title: '🫀 Life Processes', slug: 'life-processes', badge: 'Bio · Diagrams' },
];

type PlaygroundItem = {
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  href: string;
  surface: PilotEngagementSurface;
};

const PLAYGROUND_CARDS: PlaygroundItem[] = [
  {
    icon: '🧩',
    title: "Today's Sci-Wordle",
    subtitle: 'Guess today’s 5-letter NCERT term in 6 tries & share your grid.',
    badge: '2-Min Daily',
    badgeBg: '#dcfce7',
    badgeColor: '#166534',
    href: '/games/sci-wordle',
    surface: 'games',
  },
  {
    icon: '🔬',
    title: '3D Virtual Science Lab',
    subtitle: 'Rotate 36 3D apparatus models, Human Heart & Glass Prism.',
    badge: 'Interactive 3D',
    badgeBg: '#e0f2fe',
    badgeColor: '#075985',
    href: '/virtual-lab',
    surface: 'activities_diagrams',
  },
  {
    icon: '⚡',
    title: '60s Formula Rush',
    subtitle: 'Rapid-fire Maths & Physics formula blitz with streak multipliers.',
    badge: 'Speed Recall',
    badgeBg: '#ffedd5',
    badgeColor: '#9a3412',
    href: '/games/formula-rush',
    surface: 'games',
  },
  {
    icon: '📝',
    title: '1,669+ Board PYQ Bank',
    subtitle: 'Official 2022–2026 CBSE questions & Exemplar HOTS with step marks.',
    badge: 'Past Papers',
    badgeBg: '#fef3c7',
    badgeColor: '#92400e',
    href: '/questions',
    surface: 'tools',
  },
  {
    icon: '📋',
    title: '20 Free 80-Mark Mocks',
    subtitle: 'Full 3-hour CBT simulator across Maths, Science, SST & English.',
    badge: '100% Free',
    badgeBg: '#f3e8ff',
    badgeColor: '#6b21a8',
    href: '/exam-papers',
    surface: 'exam_papers',
  },
  {
    icon: '🎯',
    title: '2027 Score Predictor',
    subtitle: 'Forecast your CBSE Board percentage & get a custom study plan.',
    badge: 'AI Forecast',
    badgeBg: '#ffe4e6',
    badgeColor: '#9f1239',
    href: '/tools/readiness-predictor',
    surface: 'tools',
  },
];

export default function InteractivePlaygroundStrip({ firstName }: { firstName: string }) {
  const studyInviteMessage = `Hey! Check out ChapterReady for CBSE Class 10 Pre-Boards — it has 20 free 80-mark mock papers, 1,669+ solved PYQs, 3D Science Lab & daily Sci-Wordle 🔥\nTry it free here: https://www.chapterready.in/?invitedBy=${encodeURIComponent(
    firstName,
  )}`;

  function logPlaygroundClick(href: string, surface: PilotEngagementSurface, chapterSlug?: string) {
    void postPilotEngagement({
      chapterSlug,
      eventType: chapterSlug ? 'chapter_open' : 'tool_view',
      path: href,
      surface,
    }).catch(() => undefined);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. Pre-Board High-Weightage Quick Switcher */}
      <section aria-labelledby="preboard-jump-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '12px',
          }}
        >
          <h2
            id="preboard-jump-heading"
            style={{
              margin: 0,
              fontSize: '1.15rem',
              fontWeight: 850,
              color: '#181612',
              letterSpacing: '-0.01em',
            }}
          >
            🔥 Studying for Pre-Boards? Jump to High-Weightage Chapters
          </h2>
          <Link
            href="/pyq-trends"
            style={{
              fontSize: '0.86rem',
              fontWeight: 800,
              color: '#a84a08',
              textDecoration: 'underline',
            }}
          >
            5-Year Chapter Weightage →
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '9px',
          }}
        >
          {PREBOARD_HIGH_WEIGHTAGE_CHAPTERS.map((ch) => (
            <Link
              key={ch.slug}
              href={`/chapters/${ch.slug}`}
              onClick={() => logPlaygroundClick(`/chapters/${ch.slug}`, 'chapter', ch.slug)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                borderRadius: '999px',
                background: '#ffffff',
                border: '1.5px solid #171513',
                boxShadow: '2px 2px 0 #171513',
                color: '#171513',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 800,
              }}
            >
              <span>{ch.title}</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#a84a08',
                  background: '#fff3df',
                  padding: '2px 7px',
                  borderRadius: '999px',
                }}
              >
                {ch.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Interactive Playground & Power Tools */}
      <section aria-labelledby="interactive-playground-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '14px',
          }}
        >
          <div>
            <h2
              id="interactive-playground-heading"
              style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: 850,
                color: '#181612',
                letterSpacing: '-0.01em',
              }}
            >
              🎮 Interactive Labs, Games &amp; Board Vaults
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: '0.92rem', color: '#5f574d' }}>
              Take a 2-minute active-recall break—every game and lab is 100% NCERT-aligned.
            </p>
          </div>
          <Link
            href="/games"
            style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#a84a08',
              textDecoration: 'underline',
            }}
          >
            Open Full Game Arcade →
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
            gap: '12px',
          }}
        >
          {PLAYGROUND_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              onClick={() => logPlaygroundClick(card.href, card.surface)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '15px 16px',
                background: '#ffffff',
                border: '2px solid #171513',
                borderRadius: '16px',
                boxShadow: '3px 3px 0 #171513',
                textDecoration: 'none',
                color: '#171513',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '1.45rem' }} aria-hidden="true">
                  {card.icon}
                </span>
                <span
                  style={{
                    background: card.badgeBg,
                    color: card.badgeColor,
                    fontSize: '0.7rem',
                    fontWeight: 900,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  {card.badge}
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', fontWeight: 900 }}>
                  {card.title}
                </strong>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: '0.84rem',
                    color: '#55514b',
                    lineHeight: 1.4,
                  }}
                >
                  {card.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Study Buddy Challenge Strip */}
      <section
        aria-label="Invite classmates to study together"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '2px solid #171513',
          borderRadius: '18px',
          padding: '16px 20px',
          boxShadow: '3px 3px 0 #171513',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ maxWidth: '540px' }}>
          <strong style={{ display: 'block', fontSize: '1.02rem', fontWeight: 900, color: '#171513' }}>
            🤝 Prep is faster with a Study Buddy!
          </strong>
          <p style={{ margin: '3px 0 0', fontSize: '0.88rem', color: '#3f3f46', lineHeight: 1.45 }}>
            Dare a classmate on WhatsApp to beat your Sci-Wordle or Formula Rush score—100% free for your whole class.
          </p>
        </div>
        <a
          href={buildWhatsAppShareUrl(studyInviteMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackAnalyticsEvent('whatsapp_challenge_share', {
              surface: 'dashboard_study_buddy',
            })
          }
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#15803d',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '0.9rem',
            padding: '10px 16px',
            borderRadius: '11px',
            border: '2px solid #171513',
            boxShadow: '2px 2px 0 #171513',
            textDecoration: 'none',
          }}
        >
          📲 Share with Classmates on WhatsApp
        </a>
      </section>
    </div>
  );
}
