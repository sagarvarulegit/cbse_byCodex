import React from 'react';
import type { Metadata } from 'next';
import PitchDeckClient from '../../components/PitchDeckClient';
import './pitch.css';

export const metadata: Metadata = {
  title: 'Institutional Pitch Deck | ChapterReady.in for CBSE Schools & Coaching Classes',
  description:
    'The structured after-class NCERT revision and board practice companion for CBSE Class 10 batches. Visual notes, interactive 3D labs, CBSE step-marking rubrics, and 80-mark CBT mock series.',
  openGraph: {
    title: 'ChapterReady.in for Schools & Coaching Institutes',
    description:
      'Structured after-class NCERT revision, interactive science simulations, and official CBSE step-marking practice for Class 10 batches. Start a Free 30-Day Batch Pilot.',
    url: 'https://www.chapterready.in/pitch',
    type: 'website',
  },
};

export default function PitchDeckPage() {
  return <PitchDeckClient />;
}
