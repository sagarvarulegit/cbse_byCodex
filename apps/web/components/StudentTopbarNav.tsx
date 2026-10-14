'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type TopbarNavLink = {
  href: string;
  label: string;
};

const BASE_NAV_LINKS: TopbarNavLink[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/subjects', label: 'Subjects' },
  { href: '/exam-papers', label: 'Mock Papers' },
  { href: '/quizzes', label: 'Quizzes' },
  { href: '/tools', label: 'Study Tools' },
];

export function StudentTopbarNav({ showMistakes }: { showMistakes: boolean }) {
  const pathname = usePathname();
  const links = showMistakes
    ? [...BASE_NAV_LINKS, { href: '/my-mistakes', label: 'My Mistakes' }]
    : BASE_NAV_LINKS;

  return (
    <nav aria-label="Student shortcuts" className="student-topbar-nav">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== '/dashboard' && pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
