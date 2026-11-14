'use client';

import React, { useState } from 'react';
import { buildWhatsAppShareUrl } from '../lib/whatsapp-share';
import { trackAnalyticsEvent } from '../lib/analytics';

export type WhatsAppChallengeBarProps = {
  headline: string;
  subtext?: string;
  shareMessage: string;
  surface: string;
  chapterSlug?: string;
  buttonLabel?: string;
  compact?: boolean;
};

export default function WhatsAppChallengeBar({
  headline,
  subtext,
  shareMessage,
  surface,
  chapterSlug,
  buttonLabel = '📲 Challenge a Classmate on WhatsApp',
  compact = false,
}: WhatsAppChallengeBarProps) {
  const [copied, setCopied] = useState(false);

  const whatsappHref = buildWhatsAppShareUrl(shareMessage);

  function handleWhatsAppClick() {
    trackAnalyticsEvent('whatsapp_challenge_share', {
      surface,
      chapter_slug: chapterSlug ?? undefined,
      method: 'whatsapp_direct',
    });
  }

  function handleCopyLink() {
    trackAnalyticsEvent('whatsapp_challenge_share', {
      surface,
      chapter_slug: chapterSlug ?? undefined,
      method: 'copy_clipboard',
    });
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareMessage).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2800);
      });
    }
  }

  return (
    <div
      className="whatsapp-challenge-card"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '2px solid #171513',
        borderRadius: compact ? '14px' : '16px',
        padding: compact ? '0.9rem 1rem' : '1.15rem 1.25rem',
        boxShadow: '3px 3px 0 #171513',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        textAlign: 'left',
      }}
    >
      <div>
        <span
          style={{
            display: 'inline-block',
            background: '#15803d',
            color: '#ffffff',
            fontSize: '0.68rem',
            fontWeight: 900,
            padding: '0.18rem 0.55rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.35rem',
          }}
        >
          ⚡ Study Group Challenge
        </span>
        <strong
          style={{
            display: 'block',
            fontSize: compact ? '0.98rem' : '1.06rem',
            fontWeight: 900,
            color: '#171513',
            lineHeight: 1.3,
          }}
        >
          {headline}
        </strong>
        {subtext ? (
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.86rem',
              color: '#3f3f46',
              lineHeight: 1.45,
            }}
          >
            {subtext}
          </p>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center',
        }}
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            background: '#15803d',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: compact ? '0.86rem' : '0.92rem',
            padding: compact ? '0.6rem 1rem' : '0.7rem 1.15rem',
            borderRadius: '10px',
            border: '2px solid #171513',
            boxShadow: '2px 2px 0 #171513',
            textDecoration: 'none',
            flex: '1 1 auto',
          }}
        >
          {buttonLabel}
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            color: '#171513',
            fontWeight: 800,
            fontSize: '0.84rem',
            padding: compact ? '0.6rem 0.85rem' : '0.7rem 0.95rem',
            borderRadius: '10px',
            border: '2px solid #171513',
            boxShadow: '2px 2px 0 #171513',
            cursor: 'pointer',
          }}
        >
          {copied ? '✅ Copied!' : '📋 Copy Challenge'}
        </button>
      </div>
    </div>
  );
}
