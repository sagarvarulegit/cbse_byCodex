import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import StudentTopbar from '../../../components/StudentTopbar';
import { getStudentSession } from '../../../lib/auth';

const TrigMagicHexagonViewer = dynamic(() => import('../../../components/TrigMagicHexagonViewer'));

export const metadata: Metadata = {
  title: 'Trigonometric Magic Hexagon (Super Hexagon) | CBSE Class 10 Visual Mnemonic',
  description:
    'Derive 20+ CBSE Class 10 Trigonometry identities in 30 seconds with the Magic Super Hexagon mnemonic: reciprocal, quotient, product, and Pythagorean formulas with Tara Socratic tips.',
  keywords: [
    'trigonometric magic hexagon',
    'super hexagon trigonometry',
    'cbse class 10 trigonometry shortcuts',
    'trig identities mnemonic',
    'how to remember trigonometry formulas',
    'cbse class 10 maths chapter 8 formulas',
  ],
  openGraph: {
    title: 'Trigonometric Magic Hexagon (Super Hexagon) | ChapterReady.in',
    description:
      'Derive 20+ trigonometry formulas in under 30 seconds without memorization. Interactive simulator, 5-second setup rule, and exam hall shortcut.',
    url: 'https://www.chapterready.in/tools/trig-magic-hexagon',
    type: 'website',
  },
};

export default async function TrigMagicHexagonPage() {
  const session = await getStudentSession();

  // Schema.org structured data for educational micro-learning tool
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Trigonometric Magic Hexagon (Super Hexagon) Interactive Mnemonic',
    description:
      'A visual geometric mnemonic allowing CBSE Class 10 students to derive over 20+ trigonometric identities in under 30 seconds.',
    educationalLevel: 'CBSE Class 10',
    learningResourceType: 'Interactive Simulation / Educational Mnemonic',
    inLanguage: 'en-IN',
    author: {
      '@type': 'Organization',
      name: 'ChapterReady',
      url: 'https://www.chapterready.in',
    },
    about: [
      'Trigonometric Identities',
      'CBSE Class 10 Mathematics Chapter 8',
      'Pythagorean Identities',
      'Reciprocal Trigonometric Ratios',
    ],
  };

  return (
    <div className="trig-page-shell" style={{ minHeight: '100vh', background: '#fbf8f3' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StudentTopbar
        contextLabel="⚡ Trig Super Hexagon"
        session={session}
      />
      <main style={{ padding: '1.5rem 1rem 4rem' }}>
        <TrigMagicHexagonViewer />
      </main>
    </div>
  );
}
