import Link from 'next/link';
import { ArrowRight, RotateCcw, Target } from 'lucide-react';

import styles from './dashboard-calm.module.css';

export type NeedsALookItem = {
  key: string;
  kind: 'mistakes' | 'weak-chapter';
  text: string;
  actionLabel: string;
  href: string;
};

/**
 * Shown ONLY when something actually needs attention (mistakes due, or a
 * chapter where marks were lost). Renders nothing otherwise — no empty states.
 */
export default function NeedsALookStrip({ items }: { items: NeedsALookItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="needs-a-look-heading">
      <h2 id="needs-a-look-heading" className={styles.sectionHeading}>
        Quick fixes
      </h2>
      <ul className={styles.fixList}>
        {items.map((item) => {
          const Icon = item.kind === 'mistakes' ? RotateCcw : Target;
          return (
            <li key={item.key}>
              <Link className={styles.fixRow} href={item.href}>
                <span className={styles.fixIcon} aria-hidden="true">
                  <Icon size={18} strokeWidth={2.4} />
                </span>
                <span className={styles.fixText}>{item.text}</span>
                <span className={styles.fixAction}>
                  {item.actionLabel}
                  <ArrowRight size={16} strokeWidth={2.5} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
