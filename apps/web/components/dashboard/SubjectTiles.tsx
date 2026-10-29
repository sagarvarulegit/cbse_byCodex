import Link from 'next/link';
import { BookOpen, BookOpenCheck, Calculator, FlaskConical, Globe2, Languages } from 'lucide-react';

import type { SubjectProgress } from '../../lib/dashboard-home';
import styles from './dashboard-calm.module.css';

type TileMeta = {
  shortName: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color: string;
  bg: string;
};

const TILE_META: Record<string, TileMeta> = {
  science: { shortName: 'Science', Icon: FlaskConical, color: '#059669', bg: '#ecfdf5' },
  'mathematics-standard': { shortName: 'Maths', Icon: Calculator, color: '#2563eb', bg: '#eff6ff' },
  'social-science': { shortName: 'Social Science', Icon: Globe2, color: '#d97706', bg: '#fffbeb' },
  'english-language-and-literature': {
    shortName: 'English',
    Icon: BookOpenCheck,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  'hindi-course-b': { shortName: 'Hindi', Icon: Languages, color: '#e11d48', bg: '#fff1f2' },
};

const FALLBACK_META: Omit<TileMeta, 'shortName'> = {
  Icon: BookOpen,
  color: '#bd4f10',
  bg: '#fff3df',
};

/** Five small, tappable subject tiles with a progress ring. No filters needed. */
export default function SubjectTiles({ subjects }: { subjects: SubjectProgress[] }) {
  return (
    <section className={styles.section} aria-labelledby="my-subjects-heading">
      <h2 id="my-subjects-heading" className={styles.sectionHeading}>
        My subjects
      </h2>

      <ul className={styles.tileGrid}>
        {subjects.map((subject) => {
          const meta = TILE_META[subject.slug] ?? { ...FALLBACK_META, shortName: subject.title };
          const { Icon } = meta;
          const started = subject.startedCount;
          const progressText =
            started === 0
              ? 'Not started yet'
              : `${started} of ${subject.chapterCount} chapters started`;

          return (
            <li key={subject.slug}>
              <Link
                className={styles.tile}
                href={`/subjects/${subject.slug}`}
                aria-label={`${subject.title}: ${progressText}`}
              >
                <span className={styles.tileIcon} style={{ color: meta.color, backgroundColor: meta.bg }}>
                  <Icon size={22} strokeWidth={2.2} />
                </span>
                <span className={styles.tileName}>{meta.shortName}</span>
                <span className={styles.tileProgress}>
                  <span
                    className={styles.tileRing}
                    aria-hidden="true"
                    style={
                      {
                        '--pct': `${subject.progressPercent}%`,
                        '--ring': meta.color,
                      } as React.CSSProperties
                    }
                  />
                  <span>
                    {started === 0 ? 'Not started' : `${started} of ${subject.chapterCount}`}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
