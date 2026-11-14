'use client';

import React, { useEffect, useState } from 'react';
import { getDaysToBoardExams } from '../lib/board-countdown';

export default function BoardExamCountdownPill({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(getDaysToBoardExams());
  }, []);

  return (
    <span
      className="board-countdown-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: compact ? '5px 12px' : '6px 14px',
        borderRadius: '999px',
        background: '#fff8eb',
        border: '1.5px solid #171513',
        boxShadow: '2px 2px 0 #171513',
        color: '#a84a08',
        fontSize: compact ? '0.78rem' : '0.82rem',
        fontWeight: 900,
        letterSpacing: '0.01em',
      }}
    >
      <span aria-hidden="true">⏳</span>
      <span>
        {days !== null ? `${days} Days to CBSE 2027 Boards` : 'CBSE 2026–27 Pre-Board Sprint'}
      </span>
    </span>
  );
}
