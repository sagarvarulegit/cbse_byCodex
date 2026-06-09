import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import GlossaryTerm, { type GlossaryPayload } from '../../../../../components/GlossaryTerm';
import LessonDemo from '../../../../../components/LessonDemo';
import { getChapter, getLessonContent } from '../../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../../lib/course-content';
import { getStudentSession } from '../../../../../lib/auth';

const GLOSSARY: Record<string, GlossaryPayload> = {
  'real number': {
    term: 'Real number',
    shortMeaning: 'Any number that can be shown on the number line.',
    example: '-3, 0, 5/8, √2',
  },
  'real numbers': {
    term: 'Real numbers',
    shortMeaning: 'All numbers that fit somewhere on the number line.',
    example: '-3, 0, 5/8, √2',
  },
  lemma: {
    term: 'Lemma',
    shortMeaning: 'A small helpful rule used to prove or solve a bigger result.',
    example: 'Here it is the rule a = bq + r.',
  },
  dividend: {
    term: 'Dividend',
    shortMeaning: 'The number that is being divided.',
    example: 'In 17 ÷ 5, the dividend is 17.',
  },
  divisor: {
    term: 'Divisor',
    shortMeaning: 'The number by which we divide.',
    example: 'In 17 ÷ 5, the divisor is 5.',
  },
  quotient: {
    term: 'Quotient',
    shortMeaning: 'The answer we get before the remainder.',
    example: 'In 17 ÷ 5, the quotient is 3.',
  },
  remainder: {
    term: 'Remainder',
    shortMeaning: 'The part left after division.',
    example: 'In 17 ÷ 5, the remainder is 2.',
  },
  factor: {
    term: 'Factor',
    shortMeaning: 'A number that divides another number exactly.',
    example: '3 is a factor of 12 because 12 ÷ 3 = 4.',
  },
  factors: {
    term: 'Factors',
    shortMeaning: 'Numbers that divide a given number exactly.',
    example: 'Factors of 12 are 1, 2, 3, 4, 6, 12.',
  },
  factorisation: {
    term: 'Factorisation',
    shortMeaning: 'Breaking a number into smaller multiplying parts.',
    example: '12 = 2 × 2 × 3',
  },
  factorise: {
    term: 'Factorise',
    shortMeaning: 'To break a number into factors.',
    example: 'Factorise 12 as 2 × 2 × 3.',
  },
  factorising: {
    term: 'Factorising',
    shortMeaning: 'Breaking a number into factors step by step.',
    example: 'Factorising 40 gives 2³ × 5.',
  },
  'prime factor': {
    term: 'Prime factor',
    shortMeaning: 'A factor that is also a prime number.',
    example: '2 and 3 are prime factors of 12.',
  },
  'prime factors': {
    term: 'Prime factors',
    shortMeaning: 'Factors that are themselves prime numbers.',
    example: 'Prime factors of 12 are 2, 2, 3.',
  },
  'prime factorisation': {
    term: 'Prime factorisation',
    shortMeaning: 'Breaking a number until only prime numbers are left.',
    example: '12 = 2 × 2 × 3',
  },
  'prime number': {
    term: 'Prime number',
    shortMeaning: 'A number with exactly two factors: 1 and itself.',
    example: '2, 3, 5, 7',
  },
  'prime numbers': {
    term: 'Prime numbers',
    shortMeaning: 'Numbers with exactly two factors: 1 and themselves.',
    example: '2, 3, 5, 7',
  },
  prime: {
    term: 'Prime',
    shortMeaning: 'A number that has exactly two factors.',
    example: '5 is prime.',
  },
  primes: {
    term: 'Primes',
    shortMeaning: 'Prime numbers used in plural form.',
    example: '2, 3, 5, 7 are primes.',
  },
  'composite number': {
    term: 'Composite number',
    shortMeaning: 'A number with more than two factors.',
    example: '4, 6, 8, 9',
  },
  'composite numbers': {
    term: 'Composite numbers',
    shortMeaning: 'Numbers with more than two factors.',
    example: '4, 6, 8, 9',
  },
  hcf: {
    term: 'HCF',
    shortMeaning: 'Highest Common Factor: the biggest common factor of the given numbers.',
    example: 'HCF of 12 and 18 is 6.',
  },
  lcm: {
    term: 'LCM',
    shortMeaning: 'Lowest Common Multiple: the smallest common multiple of the given numbers.',
    example: 'LCM of 6 and 8 is 24.',
  },
  multiple: {
    term: 'Multiple',
    shortMeaning: 'A number we get by multiplying a given number by 1, 2, 3 and so on.',
    example: 'Multiples of 5 are 5, 10, 15, 20.',
  },
  multiples: {
    term: 'Multiples',
    shortMeaning: 'Numbers made by multiplying a given number by whole numbers.',
    example: 'Multiples of 4 are 4, 8, 12, 16.',
  },
  divisible: {
    term: 'Divisible',
    shortMeaning: 'A number is divisible by another when the remainder is 0.',
    example: '18 is divisible by 3.',
  },
  'rational number': {
    term: 'Rational number',
    shortMeaning: 'A number that can be written in the form p/q where q is not 0.',
    example: '3/4, -7/5, 2, 0.125',
  },
  'rational numbers': {
    term: 'Rational numbers',
    shortMeaning: 'Numbers that can be written in the form p/q where q is not 0.',
    example: '3/4, -7/5, 2, 0.125',
  },
  'irrational number': {
    term: 'Irrational number',
    shortMeaning: 'A number that cannot be written in the form p/q.',
    example: '√2, √3, π',
  },
  'irrational numbers': {
    term: 'Irrational numbers',
    shortMeaning: 'Numbers that cannot be written in the form p/q.',
    example: '√2, √3, π',
  },
  contradiction: {
    term: 'Contradiction',
    shortMeaning: 'A result that clashes with our starting assumption, so the assumption must be wrong.',
    example: 'If a and b are in lowest form but both become even, that is a contradiction.',
  },
  'lowest form': {
    term: 'Lowest form',
    shortMeaning: 'A fraction whose numerator and denominator have no common factor except 1.',
    example: '2/5 is the lowest form of 6/15.',
  },
  'terminating decimal': {
    term: 'Terminating decimal',
    shortMeaning: 'A decimal that ends after a finite number of digits.',
    example: '0.325',
  },
  'repeating decimal': {
    term: 'Repeating decimal',
    shortMeaning: 'A decimal whose digits repeat in a fixed pattern forever.',
    example: '0.3333...',
  },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const chapter = getChapter(slug);

  if (!chapter) {
    notFound();
  }

  const content = await getLessonContent(slug, lessonSlug);

  if (!content) {
    notFound();
  }

  // Check authentication for premium lessons
  if (!content.lesson.free) {
    const session = await getStudentSession();
    if (!session) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(`/chapters/${slug}/lessons/${lessonSlug}`);
      redirect(`/login?next=${returnUrl}`);
    }
  }

  return (
    <main>
      <nav className="topbar" aria-label="Lesson navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links lesson-links">
          <Link href={`/chapters/${slug}`}>Chapter</Link>
          <a href="#lesson-notes">Notes</a>
          <a href="#practice-zone">Practice</a>
        </div>
        <Link className="nav-cta" href={`/chapters/${slug}`}>
          Back to chapter
        </Link>
      </nav>

      <section className="lesson-hero section-shell">
        <div className="lesson-hero-card">
          <p className="eyebrow">{chapter.subject} · Chapter 1</p>
          <h1>{content.lesson.title}</h1>
          <p className="subtext">{content.lesson.preview}</p>
          <div className="hero-actions">
            <a className="button-link" href="#lesson-notes">
              Read notes
            </a>
            <a className="ghost-link" href="#practice-zone">
              Jump to practice
            </a>
          </div>
        </div>

        <aside className="lesson-summary-card">
          <p className="eyebrow">Lesson snapshot</p>
          <ul className="lesson-summary-list">
            <li>
              <strong>{content.lesson.minutes} min</strong>
              <span>Estimated reading + revision time</span>
            </li>
            <li>
              <strong>{content.lesson.free ? 'Free preview' : 'Premium note'}</strong>
              <span>{content.lesson.type}</span>
            </li>
            <li>
              <strong>{chapter.lessons.length} lesson notes</strong>
              <span>Now live in this chapter</span>
            </li>
          </ul>
          <div className="glossary-hint">
            <strong>Tip:</strong> tap dotted words to quickly recall their meaning.
          </div>
        </aside>
      </section>

      <section className="lesson-shell section-shell" id="lesson-notes">
        <article className="lesson-main" id="practice-zone">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href={`/chapters/${slug}`}>{chapter.title}</Link>
            <span>/</span>
            <span>{content.lesson.title}</span>
          </div>

          <div className="lesson-prose">{renderLessonBlocks(content.blocks)}</div>
        </article>

        <aside className="lesson-sidebar">
          <div className="sidebar-card">
            <p className="eyebrow">Chapter trail</p>
            <h3>{chapter.title}</h3>
            <div className="sidebar-lesson-list">
              {chapter.lessons.map((lessonItem, index) => {
                const isActive = lessonItem.slug === content.lesson.slug;
                const href = lessonItem.fileName ? `/chapters/${slug}/lessons/${lessonItem.slug}` : undefined;

                if (!href) {
                  return (
                    <div className="sidebar-lesson-item muted" key={lessonItem.slug}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <strong>{lessonItem.title}</strong>
                        <p>Coming soon</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    className={isActive ? 'sidebar-lesson-item active' : 'sidebar-lesson-item'}
                    href={href}
                    key={lessonItem.slug}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{lessonItem.title}</strong>
                      <p>{lessonItem.minutes} min</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="sidebar-card compact-card">
            <p className="eyebrow">Keep moving</p>
            <div className="sidebar-nav-pair">
              {content.previousLesson ? (
                <Link className="ghost-link" href={`/chapters/${slug}/lessons/${content.previousLesson.slug}`}>
                  ← {content.previousLesson.title}
                </Link>
              ) : (
                <Link className="ghost-link" href={`/chapters/${slug}`}>
                  ← Chapter overview
                </Link>
              )}

              {content.nextLesson ? (
                <Link className="button-link" href={`/chapters/${slug}/lessons/${content.nextLesson.slug}`}>
                  Next: {content.nextLesson.title}
                </Link>
              ) : (
                <Link className="button-link" href={`/chapters/${slug}`}>
                  Back to chapter
                </Link>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const raw = part.slice(1, -1);
      const glossaryEntry = getGlossaryEntry(raw);

      if (glossaryEntry) {
        return <GlossaryTerm key={`${raw}-${index}`} label={raw} payload={glossaryEntry} />;
      }

      return <code key={`${part}-${index}`}>{raw}</code>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderLessonBlocks(blocks: MarkdownBlock[]) {
  const rendered: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'comic recap') {
      const nextBlock = blocks[index + 1];
      const items = nextBlock?.type === 'unordered-list' ? nextBlock.items : [];

      rendered.push(renderComicRecap(items, index));

      if (nextBlock?.type === 'unordered-list') {
        index += 1;
      }

      continue;
    }

    rendered.push(renderBlock(block, index));
  }

  return rendered;
}

function renderBlock(block: MarkdownBlock, index: number) {
  switch (block.type) {
    case 'h1':
      return (
        <header className="prose-intro" key={`${block.type}-${index}`}>
          <p className="eyebrow">Lesson note</p>
          <h2>{block.text}</h2>
        </header>
      );
    case 'h2':
      return (
        <h3 className="prose-section-heading" id={toSectionId(block.text)} key={`${block.type}-${index}`}>
          {block.text}
        </h3>
      );
    case 'h3':
      return (
        <h4 className="prose-subheading" key={`${block.type}-${index}`}>
          {block.text}
        </h4>
      );
    case 'paragraph': {
      const demoId = getDemoId(block.text);

      if (demoId) {
        return <LessonDemo demoId={demoId} key={`${demoId}-${index}`} />;
      }

      return (
        <p className="prose-paragraph" key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </p>
      );
    }
    case 'code':
      return (
        <pre className="formula-block" key={`${block.type}-${index}`}>
          <code>{block.text}</code>
        </pre>
      );
    case 'unordered-list':
      return (
        <ul className="prose-list" key={`${block.type}-${index}`}>
          {block.items.map((item: string) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol className="prose-list ordered" key={`${block.type}-${index}`}>
          {block.items.map((item: string) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

function renderComicRecap(items: string[], index: number) {
  const panels = items
    .map((item, panelIndex) => ({ ...parseComicLine(item), panelIndex }))
    .filter((panel) => panel.dialogue.trim().length > 0);

  return (
    <section className="comic-recap-card" id="comic-recap" key={`comic-recap-${index}`}>
      <div className="comic-recap-header">
        <div>
          <p className="eyebrow">End-of-lesson comic recap</p>
          <h3>Comic recap</h3>
          <p>
            Quick scene, quick smile, quick memory. Read this once and the idea sticks better.
          </p>
        </div>
        <div className="comic-recap-stamp">
          <span>4-panel memory strip</span>
        </div>
      </div>

      <div className="comic-recap-grid">
        {panels.map((panel) => (
          <article className="comic-panel" key={`${panel.speaker}-${panel.panelIndex}`}>
            <div className="comic-panel-topline">
              <span className="comic-panel-number">Panel {String(panel.panelIndex + 1).padStart(2, '0')}</span>
              <span className="comic-speaker-chip">{renderInline(panel.speaker)}</span>
            </div>
            <div className="comic-speech-bubble">{renderInline(panel.dialogue)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function parseComicLine(item: string) {
  const cleaned = item.trim();
  const match = cleaned.match(/^`?([^`]+?)`?:\s*[“"](.+)[”"]$/);

  if (!match) {
    return { speaker: 'Recap', dialogue: cleaned };
  }

  return {
    speaker: match[1].trim(),
    dialogue: match[2].trim(),
  };
}

function getDemoId(text: string) {
  const match = text.match(/^\[\[demo:([a-z0-9-]+)\]\]$/i);
  return match?.[1] ?? null;
}

function getGlossaryEntry(raw: string) {
  const key = normalizeGlossaryKey(raw);
  return GLOSSARY[key] ?? null;
}

function normalizeGlossaryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function toSectionId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
