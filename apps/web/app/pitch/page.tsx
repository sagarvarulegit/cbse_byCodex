import React from 'react';
import type { Metadata } from 'next';
import PitchDeckClient from '../../components/PitchDeckClient';
import './pitch.css';

export const metadata: Metadata = {
  title: 'Institutional Pitch Deck | ChapterReady.in for CBSE Schools & Coaching Classes',
  description:
    'Partner with ChapterReady.in to equip your CBSE Class 10 batches with AI-evaluated handwritten mock tests, 100% NCERT-grounded Tara AI Coach, interactive 3D Smartboard labs, and batch weak-area diagnostics.',
  openGraph: {
    title: 'ChapterReady.in Institutional Edition — For Schools & Coaching Institutes',
    description:
      'Turn every Class 10 batch into a 95%+ CBSE Board Result powerhouse. Less than ₹1/day per student. Start a 100% Free 30-Day Batch Pilot.',
    url: 'https://www.chapterready.in/pitch',
    type: 'website',
  },
};

export default function PitchDeckPage() {
  return <PitchDeckClient />;
}
