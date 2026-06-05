import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CBSE Admin',
  description: 'Content management for the CBSE Class 10 learning portal.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
