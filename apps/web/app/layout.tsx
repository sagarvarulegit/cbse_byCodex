import type { Metadata } from 'next';

import StudyRemixProvider from '../components/StudyRemixProvider';

import 'katex/dist/katex.min.css';
import './globals.css';
import './platform-remix.css';

export const metadata: Metadata = {
  title: 'CBSE Class 10 Learning Portal',
  description: 'Video-first CBSE Class 10 learning for Mathematics and Science.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudyRemixProvider>{children}</StudyRemixProvider>
      </body>
    </html>
  );
}
