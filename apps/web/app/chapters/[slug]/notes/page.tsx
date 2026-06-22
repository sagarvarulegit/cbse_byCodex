import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, { PilotCompletionButton } from '../../../../components/PilotEngagementTracker';
import { getChapterPackContent } from '../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../lib/course-content';
import {
  collectChapterSection,
  getSectionTextLines,
  parseComicPanel,
  toSectionId,
  type ChapterSection,
} from '../../../../lib/chapter-notes-rendering';
import { isPilotChapter } from '../../../../lib/pilot';

type SectionVariant = 'goals' | 'flow' | 'summary' | 'mistakes' | 'tips' | 'practice' | 'quiz';

export default async function ChapterNotesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getChapterPackContent(slug);

  if (!content) {
    notFound();
  }

  const isPilot = isPilotChapter(slug);
  const sectionCount = content.blocks.filter((block) => block.type === 'h2').length;

  return (
    <main>
      {isPilot ? (
        <PilotEngagementTracker
          chapterSlug={slug}
          eventType="lesson_start"
          lessonSlug="chapter-notes"
          surface="lesson"
        />
      ) : null}

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
              <strong>{sectionCount} study sections</strong>
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

          <div className="lesson-prose chapter-pack-prose">{renderChapterBlocks(content.blocks)}</div>
        </article>
      </section>

      {isPilot ? (
        <section className="section-shell pilot-feedback-section">
          <PilotCompletionButton chapterSlug={slug} lessonSlug="chapter-notes" surface="lesson" />
          <PilotFeedbackForm chapterSlug={slug} lessonSlug="chapter-notes" surface="lesson" />
        </section>
      ) : null}
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

function renderChapterBlocks(blocks: MarkdownBlock[]) {
  const rendered: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.type === 'h1') {
      rendered.push(renderChapterIntro(block, index));
      index += 1;
      continue;
    }

    if (block.type === 'h2') {
      const { section, nextIndex } = collectChapterSection(blocks, index);
      rendered.push(renderChapterSection(section, index));
      index = nextIndex;
      continue;
    }

    rendered.push(renderBlock(block, index));
    index += 1;
  }

  return rendered;
}

function renderChapterIntro(block: { text: string; type: string }, index: number) {
  return (
    <header className="prose-intro chapter-pack-intro" key={`${block.type}-${index}`}>
      <p className="eyebrow">Chapter note</p>
      <h2>{renderInline(block.text)}</h2>
    </header>
  );
}

function renderChapterSection(section: ChapterSection, index: number): ReactNode {
  const title = section.normalizedTitle;

  if (title.includes('comic') && title.includes('recap')) {
    return renderComicStyleRecap(section, index);
  }

  if (title === 'chapter goal') {
    return renderFeatureSection(section, index, 'goals');
  }

  if (title === 'chapter flow for the platform' || title === 'chapter flow') {
    return renderFeatureSection(section, index, 'flow');
  }

  if (title.includes('summary')) {
    return renderFeatureSection(section, index, 'summary');
  }

  if (title.includes('common mistake')) {
    return renderFeatureSection(section, index, 'mistakes');
  }

  if (title === 'board tips') {
    return renderFeatureSection(section, index, 'tips');
  }

  if (title.includes('practice')) {
    return renderFeatureSection(section, index, 'practice');
  }

  if (title.includes('mini quiz')) {
    return renderFeatureSection(section, index, 'quiz');
  }

  return renderStandardSection(section, index);
}

function renderFeatureSection(section: ChapterSection, index: number, variant: SectionVariant) {
  return (
    <section
      className={`chapter-pack-section ${variant}`}
      id={toSectionId(section.heading.text)}
      key={`${variant}-${section.heading.text}-${index}`}
    >
      <div className="chapter-pack-section-header">
        <p className="eyebrow">{getSectionEyebrow(variant)}</p>
        <h3>{renderInline(section.heading.text)}</h3>
      </div>
      <div className="chapter-pack-section-body chapter-pack-callout-list">
        {section.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}
      </div>
    </section>
  );
}

function renderStandardSection(section: ChapterSection, index: number) {
  return (
    <section
      className="chapter-pack-section standard"
      id={toSectionId(section.heading.text)}
      key={`standard-${section.heading.text}-${index}`}
    >
      <h3 className="prose-section-heading">{renderInline(section.heading.text)}</h3>
      <div className="chapter-pack-section-body">
        {section.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}
      </div>
    </section>
  );
}

function renderComicStyleRecap(section: ChapterSection, index: number) {
  const panels = getSectionTextLines(section.blocks)
    .map((line, panelIndex) => parseComicPanel(line, panelIndex))
    .filter((panel) => panel.dialogue.trim().length > 0);

  if (panels.length === 0) {
    return renderStandardSection(section, index);
  }

  return (
    <section
      className="chapter-comic-recap"
      id={toSectionId(section.heading.text)}
      key={`comic-${section.heading.text}-${index}`}
    >
      <div className="chapter-comic-header">
        <div>
          <p className="eyebrow">Visual memory strip</p>
          <h3>{renderInline(section.heading.text)}</h3>
        </div>
        <span className="chapter-comic-count">
          {panels.length} {panels.length === 1 ? 'panel' : 'panels'}
        </span>
      </div>
      <div className="chapter-comic-grid">
        {panels.map((panel) => (
          <article className="chapter-comic-panel" key={`${panel.number}-${panel.raw}`}>
            <div className="chapter-comic-panel-topline">
              <span>Panel {panel.number}</span>
            </div>
            <strong>{renderInline(panel.scene)}</strong>
            <p>{renderInline(panel.dialogue)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getSectionEyebrow(variant: SectionVariant) {
  switch (variant) {
    case 'goals':
      return 'Learning target';
    case 'flow':
      return 'Study path';
    case 'summary':
      return 'Quick revision';
    case 'mistakes':
      return 'Avoid these';
    case 'tips':
      return 'Board exam';
    case 'practice':
      return 'Practice';
    case 'quiz':
      return 'Self check';
  }
}

function renderBlock(block: MarkdownBlock, index: number): ReactNode {
  switch (block.type) {
    case 'h1':
      return renderChapterIntro(block, index);
    case 'h2':
      return (
        <h3 className="prose-section-heading" id={toSectionId(block.text)} key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </h3>
      );
    case 'h3':
      return (
        <h4 className="prose-subheading" key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </h4>
      );
    case 'paragraph':
      return (
        <p className="prose-paragraph" key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </p>
      );
    case 'unordered-list':
      return (
        <ul className="prose-list" key={`${block.type}-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol className="prose-list ordered" key={`${block.type}-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case 'code':
      return (
        <pre className="formula-block" key={`${block.type}-${index}`}>
          <code>{block.text}</code>
        </pre>
      );
  }
}
