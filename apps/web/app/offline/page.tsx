'use client';

import React from 'react';
import Link from 'next/link';
import BrandLockup from '../../components/BrandLockup';

export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fffdf8',
        color: '#171513',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          width: 'min(520px, 100%)',
          background: '#fff',
          border: '3px solid #171513',
          borderRadius: '16px',
          boxShadow: '6px 6px 0 #171513',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <BrandLockup compact />
        </div>

        <div
          style={{
            width: '76px',
            height: '76px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: '#fff1e6',
            border: '2.5px solid #171513',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '34px',
            boxShadow: '3px 3px 0 #171513',
          }}
        >
          📶
        </div>

        <h1
          style={{
            fontSize: '26px',
            fontWeight: 900,
            margin: '0 0 10px 0',
            letterSpacing: '-0.03em',
          }}
        >
          You&apos;re Offline
        </h1>

        <p
          style={{
            color: '#6f665c',
            fontSize: '15px',
            lineHeight: 1.55,
            margin: '0 0 24px 0',
            fontWeight: 600,
          }}
        >
          It looks like your internet connection dropped. Don&apos;t worry — any chapter notes,
          formula sheets, or past questions you&apos;ve already opened are still saved and readable on your phone!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              width: '100%',
              minHeight: '48px',
              background: '#f3883b',
              color: '#171513',
              border: '2.5px solid #171513',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '3px 3px 0 #171513',
              transition: 'transform 100ms ease',
            }}
          >
            🔄 Try Reconnecting
          </button>

          <Link
            href="/formula-cheatsheets"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '44px',
              background: '#fff',
              color: '#171513',
              border: '2px solid #171513',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '2px 2px 0 #171513',
            }}
          >
            ⚡ Open Cached Formula Sheets
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: '44px',
              background: '#f4ede2',
              color: '#171513',
              border: '2px solid #171513',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>

      <p style={{ marginTop: '20px', color: '#8a7f72', fontSize: '12px', fontWeight: 600 }}>
        ChapterReady.in · CBSE Class 10 Learning Companion
      </p>
    </div>
  );
}
