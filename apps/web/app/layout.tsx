import type { Metadata } from 'next';
import Link from 'next/link';

import BrandLockup from '../components/BrandLockup';
import FeedbackButton from '../components/FeedbackButton';
import StudyRemixProvider from '../components/StudyRemixProvider';

import 'katex/dist/katex.min.css';
import './globals.css';
import './platform-remix.css';

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
      <body>
        <StudyRemixProvider>{children}</StudyRemixProvider>
        <FeedbackButton />
        <footer className="site-footer">
          <Link aria-label="ChapterReady home" className="footer-brand" href="/">
            <BrandLockup compact showDescriptor={false} />
          </Link>
          <a href="mailto:support@chapterready.in">✉ support@chapterready.in</a>
          <Link href="/privacy">Privacy and guardian consent</Link>
          <Link href="/feedback" style={{ fontWeight: 700 }}>💬 Give Feedback</Link>
        </footer>
      </body>
    </html>
  );
}
