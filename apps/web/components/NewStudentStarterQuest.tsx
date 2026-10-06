'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export type NewStudentStarterQuestProps = {
  studentName?: string | null;
  onOpenTara?: () => void;
};

export default function NewStudentStarterQuest({
  studentName,
  onOpenTara,
}: NewStudentStarterQuestProps) {
  const firstName = studentName?.split(/\s+/)[0] || 'Student';
  const [preferredSubject, setPreferredSubject] = useState<'science' | 'math'>('science');

  const quizHref =
    preferredSubject === 'science'
      ? '/chapters/chemical-reactions-and-equations/quiz'
      : '/chapters/real-numbers/quiz';

  const quizTitle =
    preferredSubject === 'science'
      ? 'Science Ch 1: Chemical Reactions'
      : 'Maths Ch 1: Real Numbers';

  const quizDesc =
    preferredSubject === 'science'
      ? '5 high-yield CBSE board questions (balancing equations & reaction types). Takes 3 minutes.'
      : '5 rapid board questions on Fundamental Theorem of Arithmetic & HCF/LCM. Takes 3 minutes.';

  return (
    <section
      aria-label="New Student Starter Quest"
      style={{
        background: 'linear-gradient(135deg, #fffdfa 0%, #fff6ed 50%, #fef3c7 100%)',
        border: '2.5px solid #171513',
        borderRadius: '20px',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: '6px 6px 0px #171513',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner Ribbon */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              background: '#c95014',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 900,
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            🚀 Day 1 Starter Quest
          </span>
          <span
            style={{
              background: '#fef08a',
              color: '#854d0e',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid #facc15',
            }}
          >
            ⏳ Estimated: 3 Minutes
          </span>
        </div>

        {/* Subject Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            padding: '0.25rem',
            borderRadius: '10px',
            border: '1.5px solid #e2e8f0',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', padding: '0 0.4rem' }}>
            Focus:
          </span>
          <button
            type="button"
            onClick={() => setPreferredSubject('science')}
            style={{
              background: preferredSubject === 'science' ? '#c95014' : 'transparent',
              color: preferredSubject === 'science' ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            🧪 Science
          </button>
          <button
            type="button"
            onClick={() => setPreferredSubject('math')}
            style={{
              background: preferredSubject === 'math' ? '#2563eb' : 'transparent',
              color: preferredSubject === 'math' ? '#ffffff' : '#334155',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            📐 Maths
          </button>
        </div>
      </div>

      {/* Main Pitch */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            color: '#171513',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.5px',
          }}
        >
          Welcome to ChapterReady, {firstName}! 🎯
        </h2>
        <p
          style={{
            fontSize: '0.98rem',
            lineHeight: 1.55,
            color: '#475569',
            margin: 0,
            maxWidth: '680px',
          }}
        >
          Don&apos;t get lost in 500-page guidebooks. Complete these <strong>two quick actions</strong> right now to calibrate your board readiness score and ignite your daily streak:
        </p>
      </div>

      {/* 2 Interactive Quest Pillars */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Step 1: Rapid 3-Minute Quiz */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #171513',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '3px 3px 0px #171513',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid #86efac',
                }}
              >
                STEP 1 · 3-MIN WIN
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>
                +50 Mastery XP
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem', fontWeight: 900, color: '#171513' }}>
              {quizTitle}
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
              {quizDesc}
            </p>
          </div>

          <Link
            href={quizHref}
            style={{
              background: '#16a34a',
              color: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.95rem',
              textAlign: 'center',
              textDecoration: 'none',
              display: 'block',
              boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
              transition: 'transform 0.1s ease',
            }}
          >
            ⚡ Start 3-Minute Quiz Now →
          </Link>
        </div>

        {/* Step 2: Ask Tara AI a Doubt */}
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #171513',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '3px 3px 0px #171513',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span
                style={{
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid #7dd3fc',
                }}
              >
                STEP 2 · 100% NCERT
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0284c7' }}>
                Instant AI Help
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem', fontWeight: 900, color: '#171513' }}>
              Meet Tara: Your Class 10 AI Tutor
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
              Got a confusing definition, formula, or diagram question? Tara answers with textbook-precise NCERT step-by-step guidance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard#tara-ai"
              onClick={() => {
                // Focus or trigger the floating Tara AI assistant widget
                const taraBtn = document.querySelector('[aria-label*="Tara"]') as HTMLElement | null;
                taraBtn?.click();
                onOpenTara?.();
              }}
              style={{
                flex: 1,
                background: '#0284c7',
                color: '#ffffff',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'block',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
              }}
            >
              💬 Ask Tara a Doubt Now →
            </Link>
          </div>
        </div>
      </div>

      {/* Reward / Motivation Footer Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.35rem' }}>🔥</span>
          <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 700 }}>
            Finish either quiz today to activate your <strong>1-Day Board Streak</strong> and earn the <em>Pioneer Badge</em>.
          </span>
        </div>
        <Link
          href="/formula-cheatsheets"
          style={{
            fontSize: '0.825rem',
            fontWeight: 800,
            color: '#c95014',
            textDecoration: 'underline',
          }}
        >
          Want all formulas in 1 page? See Cheatsheets →
        </Link>
      </div>
    </section>
  );
}
