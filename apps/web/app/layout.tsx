import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import BrandLockup from '../components/BrandLockup';
import FeedbackButton from '../components/FeedbackButton';
import StudyRemixProvider from '../components/StudyRemixProvider';
import { TutorPageProvider } from '../contexts/TutorPageContext';
import JsonLd from '../components/seo/JsonLd';
import GoogleAnalytics from '../components/seo/GoogleAnalytics';
import MobileBottomNav from '../components/MobileBottomNav';
import ServiceWorkerRegistrar from '../components/ServiceWorkerRegistrar';

// Lazy-load TaraWidget (46KB + KaTeX 250KB) — only hydrates when student
// interacts with the floating Tara button instead of bloating every page.
const TaraWidget = dynamic(() => import('../components/TaraWidget'));

import 'katex/dist/katex.min.css';
import './globals.css';
import './platform-remix.css';
// arcade.css moved to app/games/layout.tsx — only loaded on game routes

export const viewport: Viewport = {
  themeColor: '#171513',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'ChapterReady for CBSE Class 10',
    template: '%s | ChapterReady',
  },
  description:
    'Textbook-faithful CBSE Class 10 notes, quizzes, practice, and guided revision.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ChapterReady',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icons/apple-touch-icon.png',
  },
  verification: {
    google: '776c3bd92fa22c1c',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        <GoogleAnalytics />
        <ServiceWorkerRegistrar />
        <TutorPageProvider>
          <StudyRemixProvider>{children}</StudyRemixProvider>
          <FeedbackButton />
          <TaraWidget />
        </TutorPageProvider>
        <MobileBottomNav />
        <footer className="site-footer">
          <div className="site-footer-links">
            <Link aria-label="ChapterReady home" className="footer-brand" href="/">
              <BrandLockup compact showDescriptor={false} />
            </Link>
            <Link href="/questions" style={{ fontWeight: 700, color: 'var(--accent-text, #ea580c)' }}>
              📝 Question Bank (PYQs &amp; Exemplar)
            </Link>
            <a href="mailto:support@chapterready.in">✉ support@chapterready.in</a>
            <Link href="/privacy">Privacy &amp; Official Sources</Link>
            <Link href="/parent-summary">Parent Summary</Link>
            <Link href="/feedback" style={{ fontWeight: 700 }}>💬 Give Feedback</Link>
          </div>
          <div className="site-footer-disclaimer" role="note" aria-label="Government non-affiliation disclaimer and official curriculum sources">
            <strong>Disclaimer:</strong> ChapterReady is an independent private educational platform and does <strong>not</strong> represent, endorse, or have any affiliation with the Central Board of Secondary Education (CBSE), the National Council of Educational Research and Training (NCERT), or any government entity. Official public curriculum, textbook, and examination sources:{' '}
            <a href="https://www.cbse.gov.in" target="_blank" rel="noopener noreferrer">cbse.gov.in</a>
            {' · '}
            <a href="https://cbseacademic.nic.in" target="_blank" rel="noopener noreferrer">cbseacademic.nic.in</a>
            {' · '}
            <a href="https://ncert.nic.in" target="_blank" rel="noopener noreferrer">ncert.nic.in</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
