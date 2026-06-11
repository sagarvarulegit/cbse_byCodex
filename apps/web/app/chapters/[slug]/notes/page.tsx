import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { getChapterPackContent } from '../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../lib/course-content';

export default async function ChapterNotesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getChapterPackContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <main>
      <nav className="topbar" aria-label="Chapter notes navigation">
        <Link className="brand" href="/">
          <span className="brand-mark">10</span>
          <span>CBSE Sprint</span>
        </Link>
        <div className="nav-links lesson-links">
          <Link href={`/chapters/${slug}`}>Chapter</Link>
          <a href="#chapter-notes">Notes</a>
          <Link href="/subjects">Subjects</Link>
        </div>
        <Link className="nav-cta" href={`/chapters/${slug}`}>
          Back to chapter
        </Link>
      </nav>

      <section className="lesson-hero section-shell">
        <div className="lesson-hero-card">
          <p className="eyebrow">{content.chapter.subject} · Chapter notes</p>
          <h1>{content.chapter.title}</h1>
          <p className="subtext">{content.chapter.summary}</p>
          <div className="hero-actions">
            <a className="button-link" href="#chapter-notes">
              Read notes
            </a>
            <Link className="ghost-link" href={`/chapters/${slug}`}>
              Chapter overview
            </Link>
          </div>
        </div>

        <aside className="lesson-summary-card">
          <p className="eyebrow">Study snapshot</p>
          <ul className="lesson-summary-list">
            <li>
              <strong>Chapter pack</strong>
              <span>Goals, flow, examples, mistakes, and practice</span>
            </li>
            <li>
              <strong>Free notes</strong>
              <span>Available from the Class 10 subject catalog</span>
            </li>
            <li>
              <strong>{content.blocks.length} sections</strong>
              <span>Formatted from the prepared content pack</span>
            </li>
          </ul>
        </aside>
      </section>

      <section className="lesson-shell section-shell" id="chapter-notes">
        <article className="lesson-main">
          <div className="breadcrumb-row">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/subjects">Subjects</Link>
            <span>/</span>
            <Link href={`/chapters/${slug}`}>{content.chapter.title}</Link>
            <span>/</span>
            <span>Notes</span>
          </div>

          <div className="lesson-prose">{renderBlocks(content.blocks)}</div>
        </article>
      </section>
    </main>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function renderBlocks(blocks: MarkdownBlock[]) {
  return blocks.map((block, index) => renderBlock(block, index));
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  switch (block.type) {
    case 'h1':
      return <h2 key={index}>{renderInline(block.text)}</h2>;
    case 'h2':
      return <h2 key={index}>{renderInline(block.text)}</h2>;
    case 'h3':
      return <h3 key={index}>{renderInline(block.text)}</h3>;
    case 'paragraph':
      return <p key={index}>{renderInline(block.text)}</p>;
    case 'unordered-list':
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol key={index}>
          {block.items.map((item) => (
            <li key={item}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case 'code':
      return <pre key={index}>{block.text}</pre>;
  }
}
