'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  postPilotEngagement,
  type PilotEngagementEventType,
  type PilotEngagementSurface,
} from '../PilotEngagementTracker';

export type PostSignupWelcomeModalProps = {
  studentId: string;
  firstName: string;
  forceOpen?: boolean;
  isNewStudent?: boolean;
};

type FirstActionOption = {
  id: string;
  label: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  icon: string;
  description: string;
  href: string;
  eventType: PilotEngagementEventType;
  surface: PilotEngagementSurface;
  accentColor: string;
};

export const POST_SIGNUP_FIRST_ACTIONS: FirstActionOption[] = [
  {
    id: 'formula-sheets',
    label: 'Download 1-Page Formula Sheets',
    badge: '⚡ 27 Chapters · Maths & Science',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    icon: '⚡',
    description:
      'High-density 1-page printable formula & reaction sheets plus active-recall flashcards for every chapter.',
    href: '/formula-cheatsheets',
    eventType: 'resource_open',
    surface: 'formula_cheatsheets',
    accentColor: '#0284c7',
  },
  {
    id: 'board-mock',
    label: 'Take an 80-Mark Board Mock',
    badge: '📝 20 Full Papers · 100% Free',
    badgeBg: '#ffedd5',
    badgeColor: '#9a3412',
    icon: '📝',
    description:
      'Authentic 3-hour CBSE simulator with step-wise marking schemes across Maths, Science, SST & English.',
    href: '/exam-papers',
    eventType: 'tool_view',
    surface: 'exam_papers',
    accentColor: '#d26b16',
  },
  {
    id: 'pyq-trends',
    label: 'Check 5-Year PYQ Trends',
    badge: '📊 2022–2026 Board Analytics',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    icon: '📊',
    description:
      'Interactive 5-year chapter weightage heatmaps, recurring 5-mark questions, and examiner scoring patterns.',
    href: '/pyq-trends',
    eventType: 'tool_view',
    surface: 'pyq_trends',
    accentColor: '#0b7a48',
  },
];

export default function PostSignupWelcomeModal({
  studentId,
  firstName,
  forceOpen = false,
  isNewStudent = false,
}: PostSignupWelcomeModalProps) {
  const storageKey = `cbse_post_signup_welcome_dismissed:${studentId}`;
  const [isOpen, setIsOpen] = useState<boolean>(forceOpen);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }
    if (!isNewStudent) {
      return;
    }
    try {
      const dismissed = window.localStorage.getItem(storageKey);
      if (!dismissed) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [forceOpen, isNewStudent, storageKey]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        dismissModal();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  function dismissModal() {
    setIsOpen(false);
    try {
      window.localStorage.setItem(storageKey, '1');
    } catch {
      // ignore storage errors
    }
  }

  function trackActionClick(action: {
    eventType: PilotEngagementEventType;
    href: string;
    surface: PilotEngagementSurface;
  }) {
    try {
      window.localStorage.setItem(storageKey, '1');
    } catch {
      // ignore storage errors
    }
    void postPilotEngagement({
      eventType: action.eventType,
      path: action.href,
      surface: action.surface,
    }).catch(() => undefined);
  }

  return (
    <>
      {/* Inline High-Value Quick Launcher for New Students on Dashboard */}
      {(isNewStudent || forceOpen) && (
        <section
          aria-label="What do you want to do first?"
          style={{
            background: '#fffdfa',
            border: '2px solid #24211f',
            borderRadius: '18px',
            padding: '1.25rem 1.35rem',
            marginBottom: '1.25rem',
            boxShadow: '4px 4px 0px #24211f',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.85rem',
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: '#ffedd5',
                  color: '#a84a08',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.3rem',
                }}
              >
                🎯 High-Yield Board Prep Shortcuts
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#24211f',
                  letterSpacing: '-0.02em',
                }}
              >
                What do you want to do first?
              </h2>
            </div>
            <Link
              href="/tools"
              onClick={() =>
                trackActionClick({
                  eventType: 'tool_view',
                  href: '/tools',
                  surface: 'tools',
                })
              }
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#a84a08',
                textDecoration: 'underline',
              }}
            >
              Open Study Tools Hub →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {POST_SIGNUP_FIRST_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                onClick={() => trackActionClick(action)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.45rem',
                  background: '#ffffff',
                  border: '1.5px solid #24211f',
                  borderRadius: '14px',
                  padding: '0.9rem 1rem',
                  textDecoration: 'none',
                  color: '#24211f',
                  boxShadow: '2px 2px 0px #24211f',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }} aria-hidden="true">
                    {action.icon}
                  </span>
                  <span
                    style={{
                      background: action.badgeBg,
                      color: action.badgeColor,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                    }}
                  >
                    {action.badge}
                  </span>
                </div>
                <strong style={{ fontSize: '0.95rem', fontWeight: 900, color: '#24211f' }}>
                  {action.label} →
                </strong>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Post-Signup Modal Dialog */}
      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-signup-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              dismissModal();
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            background: 'rgba(23, 21, 19, 0.68)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '640px',
              background: '#f7f2e7',
              border: '3px solid #24211f',
              borderRadius: '22px',
              padding: '1.75rem',
              boxShadow: '8px 8px 0px #24211f',
              position: 'relative',
            }}
          >
            <button
              type="button"
              aria-label="Close welcome dialog"
              onClick={dismissModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                border: '1.5px solid #24211f',
                background: '#ffffff',
                color: '#24211f',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>

            <span
              style={{
                display: 'inline-block',
                background: '#d26b16',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 900,
                padding: '0.28rem 0.75rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.65rem',
              }}
            >
              🎉 Welcome to ChapterReady, {firstName}!
            </span>

            <h2
              id="post-signup-modal-title"
              style={{
                margin: '0 0 0.4rem 0',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: '#24211f',
                letterSpacing: '-0.025em',
              }}
            >
              What do you want to do first?
            </h2>
            <p
              style={{
                margin: '0 0 1.25rem 0',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: '#475569',
              }}
            >
              Jump straight to the board prep tool that matches what you&apos;re studying right now — no need to start at Chapter 1:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {POST_SIGNUP_FIRST_ACTIONS.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  onClick={() => trackActionClick(action)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    background: '#ffffff',
                    border: '2px solid #24211f',
                    borderRadius: '16px',
                    padding: '1rem 1.15rem',
                    textDecoration: 'none',
                    color: '#24211f',
                    boxShadow: '4px 4px 0px #24211f',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.3rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '1.35rem' }} aria-hidden="true">
                        {action.icon}
                      </span>
                      <strong style={{ fontSize: '1.05rem', fontWeight: 900, color: '#24211f' }}>
                        {action.label}
                      </strong>
                      <span
                        style={{
                          background: action.badgeBg,
                          color: action.badgeColor,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.18rem 0.55rem',
                          borderRadius: '999px',
                        }}
                      >
                        {action.badge}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#475569',
                        lineHeight: 1.45,
                      }}
                    >
                      {action.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    style={{
                      background: action.accentColor,
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      padding: '0.55rem 0.9rem',
                      borderRadius: '10px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open →
                  </span>
                </Link>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1.5px dashed #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <Link
                href="/tools"
                onClick={() =>
                  trackActionClick({
                    eventType: 'tool_view',
                    href: '/tools',
                    surface: 'tools',
                  })
                }
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: '#a84a08',
                  textDecoration: 'underline',
                }}
              >
                🛠️ Explore All Study Tools (/tools) →
              </Link>
              <button
                type="button"
                onClick={dismissModal}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #24211f',
                  borderRadius: '10px',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#24211f',
                  cursor: 'pointer',
                }}
              >
                Choose a chapter on my Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
