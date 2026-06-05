import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CBSE Class 10 Learning Portal',
  description: 'Video-first CBSE Class 10 learning for Mathematics and Science.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
