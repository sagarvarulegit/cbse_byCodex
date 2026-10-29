import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import BrandLockup from '../components/BrandLockup';
import FeedbackButton from '../components/FeedbackButton';
import StudyRemixProvider from '../components/StudyRemixProvider';
import { TutorPageProvider } from '../contexts/TutorPageContext';
import JsonLd from '../components/seo/JsonLd';

// Lazy-load TaraWidget (46KB + KaTeX 250KB) — only hydrates when student
// interacts with the floating Tara button instead of bloating every page.
const TaraWidget = dynamic(() => import('../components/TaraWidget'));

import 'katex/dist/katex.min.css';
import './globals.css';
import './platform-remix.css';
// arcade.css moved to app/games/layout.tsx — only loaded on game routes

export const metadata: Metadata = {
  title: {
    default: 'ChapterReady for CBSE Class 10',
    template: '%s | ChapterReady',
  },
  description:
    'Textbook-faithful CBSE Class 10 notes, quizzes, practice, and guided revision.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <JsonLd />
      </head>
      <body>
        <TutorPageProvider>
          <StudyRemixProvider>{children}</StudyRemixProvider>
          <FeedbackButton />
          <TaraWidget />
        </TutorPageProvider>
        <footer className="site-footer">
          <Link aria-label="ChapterReady home" className="footer-brand" href="/">
            <BrandLockup compact showDescriptor={false} />
          </Link>
          <a href="mailto:support@chapterready.in">✉ support@chapterready.in</a>
          <Link href="/privacy">Privacy and guardian consent</Link>
          <Link href="/parent-summary">Parent Summary</Link>
          <Link href="/feedback" style={{ fontWeight: 700 }}>💬 Give Feedback</Link>
        </footer>
      </body>
    </html>
  );
}
