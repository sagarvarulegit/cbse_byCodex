import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import PilotFeedbackForm from '../../../../components/PilotFeedbackForm';
import PilotEngagementTracker, { PilotCompletionButton } from '../../../../components/PilotEngagementTracker';
import { getChapterPackContent } from '../../../../lib/course-content';
import type { MarkdownBlock } from '../../../../lib/course-content';
import { parseInlineMarkup, type InlineMarkupToken } from '../../../../lib/lesson-inline-markup';
import {
  collectChapterSection,
  getChapterSectionVariant,
  getSectionTextLines,
  isFormulaLikeText,
  parseComicPanel,
  toSectionId,
  type ChapterSection,
  type ChapterSectionVariant,
} from '../../../../lib/chapter-notes-rendering';
import { isPilotChapter } from '../../../../lib/pilot';
import CompleteChapterNotesPage from './CompleteChapterNotesPage';

export default CompleteChapterNotesPage;

async function LegacyChapterNotesPage({ params }: { params: Promise<{ slug: string }> }) {
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
  return renderInlineTokens(parseInlineMarkup(text), 'inline');
}

function renderInlineTokens(tokens: InlineMarkupToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${token.type}-${index}`;

    if (token.type === 'code') {
      return <code key={key}>{token.value}</code>;
    }

    if (token.type === 'strong') {
      return <strong key={key}>{renderInlineTokens(token.children, key)}</strong>;
    }

    if (token.type === 'emphasis') {
      return <em key={key}>{renderInlineTokens(token.children, key)}</em>;
    }

    if (token.type === 'text') {
      return <span key={key}>{token.value}</span>;
    }

    return null;
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
  const variant = getChapterSectionVariant(section);

  if (variant === 'comic') {
    return renderComicStyleRecap(section, index);
  }

  return renderFeatureSection(section, index, variant);
}

function renderFeatureSection(section: ChapterSection, index: number, variant: ChapterSectionVariant) {
  const meta = getSectionMeta(variant);

  return (
    <section
      className={`chapter-pack-section ${variant}`}
      id={toSectionId(section.heading.text)}
      key={`${variant}-${section.heading.text}-${index}`}
    >
      <div className="chapter-pack-section-accent" aria-hidden="true">
        {meta.mark}
      </div>
      <div className="chapter-pack-section-content">
        <div className="chapter-pack-section-header">
          <div>
            <p className="eyebrow">{meta.eyebrow}</p>
            <h3>{renderInline(section.heading.text)}</h3>
          </div>
          <span className="chapter-pack-section-chip">{meta.chip}</span>
        </div>
        <div className={`chapter-pack-section-body ${meta.bodyClass}`}>
          {section.blocks.map((block, blockIndex) => renderBlock(block, blockIndex, variant))}
        </div>
      </div>
    </section>
  );
}

function renderStandardSection(section: ChapterSection, index: number) {
  return renderFeatureSection(section, index, 'standard');
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
          <article className={`chapter-comic-panel ${panel.visualHint}`} key={`${panel.number}-${panel.raw}`}>
            <div className="chapter-comic-panel-topline">
              <span>Panel {panel.number}</span>
              <small>{panel.visualHint}</small>
            </div>
            <div className="chapter-comic-visual" aria-hidden="true">
              <span>{panel.speaker.slice(0, 2).toUpperCase()}</span>
            </div>
            <strong>{renderInline(panel.speaker)}</strong>
            <em>{renderInline(panel.scene)}</em>
            <p>{renderInline(panel.dialogue)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getSectionMeta(variant: ChapterSectionVariant) {
  switch (variant) {
    case 'goals':
      return { eyebrow: 'Learning target', chip: 'Start here', mark: 'GO', bodyClass: 'chapter-pack-goal-list' };
    case 'flow':
      return { eyebrow: 'Study path', chip: 'Sequence', mark: '01', bodyClass: 'chapter-pack-flow-list' };
    case 'concept':
      return { eyebrow: 'Concept block', chip: 'Learn', mark: 'CN', bodyClass: 'chapter-pack-concept-body' };
    case 'example':
      return { eyebrow: 'Worked examples', chip: 'Solved', mark: 'EX', bodyClass: 'chapter-pack-example-body' };
    case 'formula':
      return { eyebrow: 'Formula and reaction focus', chip: 'Remember', mark: 'FX', bodyClass: 'chapter-pack-formula-body' };
    case 'summary':
      return { eyebrow: 'Quick revision', chip: 'Revise', mark: 'RV', bodyClass: 'chapter-pack-summary-list' };
    case 'mistakes':
      return { eyebrow: 'Avoid these', chip: 'Careful', mark: 'NO', bodyClass: 'chapter-pack-mistake-list' };
    case 'tips':
      return { eyebrow: 'Board exam', chip: 'Score', mark: 'BT', bodyClass: 'chapter-pack-tip-list' };
    case 'practice':
      return { eyebrow: 'Short answer practice', chip: 'Try', mark: 'PR', bodyClass: 'chapter-pack-practice-list' };
    case 'quiz':
      return { eyebrow: 'Self check', chip: 'Quiz', mark: 'QZ', bodyClass: 'chapter-pack-quiz-list' };
    case 'comic':
      return { eyebrow: 'Visual memory strip', chip: 'Comic', mark: 'CM', bodyClass: 'chapter-pack-comic-body' };
    case 'standard':
      return { eyebrow: 'Study note', chip: 'Read', mark: 'NT', bodyClass: 'chapter-pack-standard-body' };
  }

  return { eyebrow: 'Study note', chip: 'Read', mark: 'NT', bodyClass: 'chapter-pack-standard-body' };
}

function renderBlock(block: MarkdownBlock, index: number, sectionVariant: ChapterSectionVariant = 'standard'): ReactNode {
  const listClassName = `prose-list chapter-pack-list ${sectionVariant}`;

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
        <ul className={listClassName} key={`${block.type}-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    case 'ordered-list':
      return (
        <ol className={`${listClassName} ordered`} key={`${block.type}-${index}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    case 'table':
      return (
        <div className="prose-table-wrap" key={`${block.type}-${index}`}>
          <table className="prose-table">
            <thead>
              <tr>
                {block.headers.map((header, cellIndex) => (
                  <th key={`${header}-${cellIndex}`} scope="col">{renderInline(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'code':
      {
        const formulaLike = isFormulaLikeText(block.text);

        return (
          <pre className={formulaLike ? 'formula-block chapter-pack-formula-card' : 'formula-block'} key={`${block.type}-${index}`}>
            {formulaLike ? <span>Key line</span> : null}
            <code>{block.text}</code>
          </pre>
        );
      }
  }

  return null;
}
