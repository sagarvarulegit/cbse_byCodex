import Link from 'next/link';
import type { ReactNode } from 'react';

import { getWrittenPracticeDefinition } from '../lib/chapter-practice';
import { getExamPracticeDefinition } from '../lib/exam-practice';
import type { MarkdownBlock } from '../lib/course-content';
import { GLOSSARY } from '../lib/glossary';
import { parseInlineMarkup, type InlineMarkupToken } from '../lib/lesson-inline-markup';
import { isLessonQuestionMarker, parseLessonQuestionAnswers } from '../lib/lesson-question-answers';
import ExamPracticeCard from './ExamPracticeCard';
import GlossaryTerm from './GlossaryTerm';
import LessonDemo from './LessonDemo';
import MathText from './MathText';
import WrittenPracticeCard from './WrittenPracticeCard';

type LessonNotesContentProps = {
  blocks: MarkdownBlock[];
  hideDocumentTitle?: boolean;
  idPrefix?: string;
};

export function LessonNotesContent({
  blocks,
  hideDocumentTitle = false,
  idPrefix = '',
}: LessonNotesContentProps) {
  return <>{renderLessonBlocks(blocks, idPrefix, hideDocumentTitle)}</>;
}

export function getLessonSectionId(text: string, idPrefix = '') {
  const sectionId = toSectionId(text);
  return idPrefix ? `${idPrefix}-${sectionId}` : sectionId;
}

function renderInline(text: string) {
  return renderInlineTokens(parseInlineMarkup(text), 'inline');
}

function renderInlineTokens(tokens: InlineMarkupToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${token.type}-${index}`;

    if (token.type === 'code') {
      const glossaryEntry = getGlossaryEntry(token.value);
      if (glossaryEntry) {
        return <GlossaryTerm key={key} label={token.value} payload={glossaryEntry} />;
      }

      return <code key={key}>{token.value}</code>;
    }

    if (token.type === 'strong') {
      return <strong key={key}>{renderInlineTokens(token.children, key)}</strong>;
    }

    if (token.type === 'emphasis') {
      return <em key={key}>{renderInlineTokens(token.children, key)}</em>;
    }

    if (token.type === 'link') {
      return (
        <Link href={token.href} key={key}>
          {renderInlineTokens(token.children, key)}
        </Link>
      );
    }

    if (token.type === 'text') {
      return <MathText key={key} text={token.value} />;
    }

    return null;
  });
}

function renderLessonBlocks(
  blocks: MarkdownBlock[],
  idPrefix: string,
  hideDocumentTitle: boolean,
) {
  const rendered: ReactNode[] = [];

  let currentHeading: { type: 'h1' | 'h2' | 'h3'; text: string } | null = null;
  let currentBody: MarkdownBlock[] = [];
  let currentHeadingIndex = 0;

  function flushCurrentSection() {
    if (currentHeading !== null || currentBody.length > 0) {
      rendered.push(
        renderConceptSection(currentHeading, currentBody, currentHeadingIndex, idPrefix),
      );
      currentHeading = null;
      currentBody = [];
    }
  }

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (hideDocumentTitle && block.type === 'h1') {
      continue;
    }

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'comic recap') {
      flushCurrentSection();
      const nextBlock = blocks[index + 1];
      const items = nextBlock?.type === 'unordered-list' ? nextBlock.items : [];
      rendered.push(renderComicRecap(items, index, idPrefix));

      if (nextBlock?.type === 'unordered-list') {
        index += 1;
      }
      continue;
    }

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'answer check') {
      flushCurrentSection();
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
      rendered.push(renderPracticeAnswerCheck(bodyBlocks, index, idPrefix));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'h2' && normalizeGlossaryKey(block.text) === 'questions and answers') {
      flushCurrentSection();
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
      rendered.push(renderQuestionAnswerCard(block.text, bodyBlocks, index, idPrefix));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'paragraph' && isLessonQuestionMarker(block.text)) {
      flushCurrentSection();
      const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index);
      const title = /in-text/i.test(block.text)
        ? 'In-text questions and answers'
        : 'Questions and answers';
      rendered.push(renderQuestionAnswerCard(title, bodyBlocks, index, idPrefix));
      index = nextIndex - 1;
      continue;
    }

    if (block.type === 'h2') {
      const sectionVariant = getLessonSupportSectionVariant(block.text);
      if (sectionVariant) {
        flushCurrentSection();
        const { bodyBlocks, nextIndex } = collectLessonSectionBody(blocks, index + 1);
        rendered.push(
          renderLessonSupportSection(block.text, bodyBlocks, sectionVariant, index, idPrefix),
        );
        index = nextIndex - 1;
        continue;
      }

      flushCurrentSection();
      currentHeading = block;
      currentHeadingIndex = index;
      continue;
    }

    currentBody.push(block);
  }

  flushCurrentSection();

  return rendered;
}

function renderConceptSection(
  heading: { type: 'h1' | 'h2' | 'h3'; text: string } | null,
  bodyBlocks: MarkdownBlock[],
  index: number,
  idPrefix: string,
): ReactNode {
  if (!heading && bodyBlocks.length === 0) {
    return null;
  }

  const isIntro = heading === null;
  const headingText = heading?.text.trim() ?? '';
  const numberMatch = headingText.match(/^(\d+(?:\.\d+)*(?:-\d+(?:\.\d+)*)?)\s*(.*)$/);
  const isNumbered = Boolean(!isIntro && numberMatch);

  let sectionClasses = 'concept-block';
  if (isIntro) {
    sectionClasses += ' concept-block--intro';
  } else if (isNumbered) {
    sectionClasses += ' concept-block--numbered';
  } else {
    sectionClasses += ' concept-block--plain';
  }

  const sectionId = heading ? getLessonSectionId(heading.text, idPrefix) : undefined;
  const sectionKey = `concept-${idPrefix}-${index}`;

  let headingNode: ReactNode = null;
  if (heading) {
    if (numberMatch) {
      const numberPart = numberMatch[1];
      const rest = numberMatch[2]?.trim() ?? '';
      headingNode = (
        <header className="concept-header">
          <p className="concept-eyebrow">Section {numberPart}</p>
          <h3 className="prose-section-heading prose-section-heading--numbered">
            {renderInline(rest || heading.text)}
          </h3>
        </header>
      );
    } else {
      headingNode = (
        <h3 className="prose-section-heading prose-section-heading--plain">
          {renderInline(heading.text)}
        </h3>
      );
    }
  }

  return (
    <section className={sectionClasses} id={sectionId} key={sectionKey}>
      {headingNode}
      {bodyBlocks.map((b, i) => renderBlock(b, index * 1000 + i, idPrefix))}
    </section>
  );
}

type LessonSupportSectionVariant =
  | 'board-tips'
  | 'common-mistakes'
  | 'one-minute-revision'
  | 'quick-practice';

function getLessonSupportSectionVariant(title: string): LessonSupportSectionVariant | null {
  const sectionKey = normalizeGlossaryKey(title);

  if (sectionKey === 'board tips') {
    return 'board-tips';
  }
  if (sectionKey === 'common mistakes') {
    return 'common-mistakes';
  }
  if (sectionKey === 'one minute revision') {
    return 'one-minute-revision';
  }
  if (sectionKey === 'quick practice') {
    return 'quick-practice';
  }

  return null;
}

function renderLessonSupportSection(
  title: string,
  bodyBlocks: MarkdownBlock[],
  variant: LessonSupportSectionVariant,
  index: number,
  idPrefix: string,
) {
  const eyebrowConfig: Record<LessonSupportSectionVariant, { icon: string; label: string }> = {
    'board-tips': { icon: '💡', label: 'Board tip' },
    'common-mistakes': { icon: '⚠️', label: 'Common mistake' },
    'quick-practice': { icon: '✏️', label: 'Quick practice' },
    'one-minute-revision': { icon: '⏱️', label: '1-Minute revision' },
  };

  const config = eyebrowConfig[variant];

  return (
    <section
      className={`lesson-support-section lesson-support-${variant}`}
      id={getLessonSectionId(title, idPrefix)}
      key={`lesson-support-${variant}-${index}`}
    >
      <header className="lesson-support-header">
        <p className="eyebrow card-eyebrow">
          <span>{config.icon}</span> {config.label}
        </p>
        <h3>{renderInline(title)}</h3>
      </header>
      <div>
        {bodyBlocks.map((block, innerIndex) =>
          renderBlock(block, index * 1000 + innerIndex, idPrefix),
        )}
      </div>
    </section>
  );
}

function collectLessonSectionBody(blocks: MarkdownBlock[], startIndex: number) {
  const bodyBlocks: MarkdownBlock[] = [];
  let nextIndex = startIndex;

  while (nextIndex < blocks.length) {
    const block = blocks[nextIndex];
    if (block.type === 'h2') {
      break;
    }
    bodyBlocks.push(block);
    nextIndex += 1;
  }

  return { bodyBlocks, nextIndex };
}

function renderPracticeAnswerCheck(
  bodyBlocks: MarkdownBlock[],
  index: number,
  idPrefix: string,
) {
  return (
    <section
      className="lesson-practice-answer"
      id={getLessonSectionId('answer-check', idPrefix)}
      key={`answer-check-${index}`}
    >
      <p className="eyebrow card-eyebrow">
        <span>🔍</span> Practice feedback
      </p>
      <h3>Answer check</h3>
      <details>
        <summary>Try first, then reveal the answer</summary>
        <div className="lesson-practice-answer-body">
          {bodyBlocks.map((block, innerIndex) =>
            renderBlock(block, index * 1000 + innerIndex, idPrefix),
          )}
        </div>
      </details>
    </section>
  );
}

function renderQuestionAnswerCard(
  title: string,
  bodyBlocks: MarkdownBlock[],
  index: number,
  idPrefix: string,
) {
  const questions = parseLessonQuestionAnswers(bodyBlocks);

  return (
    <section
      className="lesson-qa-card"
      id={getLessonSectionId(title, idPrefix)}
      key={`questions-and-answers-${index}`}
    >
      <div className="lesson-qa-card-header">
        <p className="eyebrow card-eyebrow">
          <span>❓</span> Study questions
        </p>
        <h3>{title}</h3>
      </div>
      <div className="lesson-qa-card-body">
        {questions.length > 0
          ? questions.map((question) => (
              <article className="lesson-qa-item" key={`${index}-${question.number}`}>
                <p className="lesson-qa-question-number">Question {question.number}</p>
                <h4>{renderInline(question.question)}</h4>
                {question.hint ? (
                  <p className="lesson-qa-hint">
                    <strong>Hint:</strong> {renderInline(question.hint)}
                  </p>
                ) : null}
                <details className="lesson-qa-answer">
                  <summary>Try first, then reveal the answer</summary>
                  {question.answer ? <p>{renderInline(question.answer)}</p> : null}
                  {question.answerBlocks.map((block, innerIndex) =>
                    renderBlock(
                      block,
                      index * 1000 + question.number * 100 + innerIndex,
                      idPrefix,
                    ),
                  )}
                </details>
              </article>
            ))
          : bodyBlocks.map((block, innerIndex) =>
              renderBlock(block, index * 1000 + innerIndex, idPrefix),
            )}
      </div>
    </section>
  );
}

function renderBlock(block: MarkdownBlock, index: number, idPrefix: string): ReactNode {
  switch (block.type) {
    case 'h1':
      return (
        <header className="prose-intro" key={`${block.type}-${index}`}>
          <p className="eyebrow">Chapter section</p>
          <h2>{renderInline(block.text)}</h2>
        </header>
      );
    case 'h2':
      return (
        <h3
          className="prose-section-heading prose-section-heading--plain"
          id={getLessonSectionId(block.text, idPrefix)}
          key={`${block.type}-${index}`}
        >
          {renderInline(block.text)}
        </h3>
      );
    case 'h3':
      return (
        <h4
          className="prose-subheading"
          id={getLessonSectionId(block.text, idPrefix)}
          key={`${block.type}-${index}`}
        >
          {renderInline(block.text)}
        </h4>
      );
    case 'paragraph': {
      const demoId = getDemoId(block.text);
      const examPracticeId = getExamPracticeId(block.text);
      const writtenPracticeId = getWrittenPracticeId(block.text);

      if (demoId) {
        return (
          <div className="concept-media" key={`${demoId}-${index}`}>
            <LessonDemo demoId={demoId} />
          </div>
        );
      }

      if (writtenPracticeId) {
        const definition = getWrittenPracticeDefinition(writtenPracticeId);
        return definition ? (
          <div className="concept-media" key={`${writtenPracticeId}-${index}`}>
            <WrittenPracticeCard definition={definition} />
          </div>
        ) : null;
      }

      if (examPracticeId) {
        const definition = getExamPracticeDefinition(examPracticeId);
        return definition ? (
          <div className="concept-media" key={`${examPracticeId}-${index}`}>
            <ExamPracticeCard definition={definition} />
          </div>
        ) : null;
      }

      return (
        <p className="prose-paragraph" key={`${block.type}-${index}`}>
          {renderInline(block.text)}
        </p>
      );
    }
    case 'code':
      return (
        <pre className="formula-block concept-media" key={`${block.type}-${index}`}>
          <code>{block.text}</code>
        </pre>
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
    case 'table':
      return (
        <div className="prose-table-wrap concept-media" key={`${block.type}-${index}`}>
          <table className="prose-table">
            <thead>
              <tr>
                {block.headers.map((header, cellIndex) => (
                  <th key={`${header}-${cellIndex}`} scope="col">
                    {renderInline(header)}
                  </th>
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
    default:
      return null;
  }
}

function renderComicRecap(items: string[], index: number, idPrefix: string) {
  const panels = items
    .map((item, panelIndex) => ({ ...parseComicLine(item), panelIndex }))
    .filter((panel) => panel.dialogue.trim().length > 0);

  if (panels.length === 0) {
    return null;
  }

  return (
    <section
      className="comic-recap-card"
      id={getLessonSectionId('comic-recap', idPrefix)}
      key={`comic-recap-${index}`}
    >
      <div className="comic-recap-header">
        <div>
          <p className="eyebrow card-eyebrow">
            <span>🎭</span> Memory strip
          </p>
          <h3>Comic recap</h3>
          <p>Quick scene, quick smile, quick memory. Read this once and the idea sticks better.</p>
        </div>
        <div className="comic-recap-stamp">
          <span>Memory strip</span>
        </div>
      </div>
      <div className="comic-recap-grid">
        {panels.map((panel) => (
          <article className="comic-panel" key={`${panel.speaker}-${panel.panelIndex}`}>
            <div className="comic-panel-topline">
              <span className="comic-panel-number">
                Panel {String(panel.panelIndex + 1).padStart(2, '0')}
              </span>
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
  const demoMarker = text.match(/^\[\[demo:([a-z0-9-]+)\]\]$/i);
  if (demoMarker) {
    return demoMarker[1];
  }

  const illustrationTag = text.match(
    /^<ActivityIllustration\s+demoId=["']([a-z0-9-]+)["']\s*\/>$/i,
  );
  return illustrationTag?.[1] ?? null;
}

function getWrittenPracticeId(text: string) {
  return text.match(/^\[\[written-practice:([a-z0-9-]+)\]\]$/i)?.[1] ?? null;
}

function getExamPracticeId(text: string) {
  return text.match(/^\[\[exam-practice:([a-z0-9-]+)\]\]$/i)?.[1] ?? null;
}

function getGlossaryEntry(raw: string) {
  return GLOSSARY[normalizeGlossaryKey(raw)] ?? null;
}

function normalizeGlossaryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function toSectionId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
