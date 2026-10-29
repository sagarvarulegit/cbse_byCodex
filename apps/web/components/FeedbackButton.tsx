'use client';

import { useState } from 'react';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button (hidden on phones via .feedback-fab; the footer has a Give Feedback link) */}
      <button
        className="feedback-fab"
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#f3883b',
          color: '#fff',
          border: '3px solid #171513',
          boxShadow: '4px 4px 0 #171513',
          fontSize: 20,
          cursor: 'pointer',
          zIndex: 9990,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        aria-label="Give feedback"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Mini form popup */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 84,
            left: 24,
            width: 320,
            background: '#fff',
            border: '3px solid #171513',
            boxShadow: '8px 8px 0 #171513',
            padding: 20,
            zIndex: 9991,
            fontFamily: '"Noto Sans JP", "Segoe UI", Arial, sans-serif',
          }}
        >
          <h3 style={{ fontFamily: 'Bangers, sans-serif', fontSize: 28, marginBottom: 4 }}>Quick Feedback</h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>Found a bug or have a suggestion?</p>
          <a
            href="/feedback"
            style={{
              display: 'block',
              textAlign: 'center',
              background: '#f3883b',
              color: '#fff',
              border: '2px solid #171513',
              padding: '10px 16px',
              fontSize: 16,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Open Feedback Form →
          </a>
        </div>
      )}
    </>
  );
}
