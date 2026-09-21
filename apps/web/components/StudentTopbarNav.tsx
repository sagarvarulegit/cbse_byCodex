'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { CSSProperties } from 'react';

type TopbarNavLink = {
  href: string;
  label: string;
  style?: CSSProperties;
};

const NAV_LINKS: TopbarNavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/subjects', label: 'Subjects' },
  { href: '/virtual-lab', label: '🔬 3D Lab', style: { fontWeight: 700, color: '#0284c7' } },
  { href: '/tools', label: '🛠️ Tools', style: { fontWeight: 700, color: '#0f172a' } },
  { href: '/store', label: '🛍️ Store', style: { fontWeight: 800, color: '#c95014' } },
  { href: '/exam-papers', label: 'Mock Papers' },
  { href: '/quizzes', label: 'Quizzes' },
];

export function StudentTopbarNav({ showMistakes }: { showMistakes: boolean }) {
  const pathname = usePathname();
  const links = showMistakes
    ? [
        ...NAV_LINKS,
        { href: '/orders', label: '📦 My Purchases', style: { fontWeight: 700, color: '#16a34a' } },
        { href: '/my-mistakes', label: 'My Mistakes' },
      ]
    : NAV_LINKS;

  return (
    <nav aria-label="Student shortcuts" className="student-topbar-nav">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            style={isActive ? { ...link.style, color: '#ffffff' } : link.style}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
