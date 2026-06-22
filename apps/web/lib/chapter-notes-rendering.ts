import type { MarkdownBlock } from './course-content';

export type ChapterSection = {
  heading: MarkdownBlock & { type: 'h2' };
  blocks: MarkdownBlock[];
  normalizedTitle: string;
};

export type ComicPanel = {
  number: string;
  scene: string;
  dialogue: string;
  raw: string;
};

export function normalizeSectionTitle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function toSectionId(value: string) {
  return normalizeSectionTitle(value).replace(/\s+/g, '-');
}

export function collectChapterSection(
  blocks: MarkdownBlock[],
  startIndex: number,
): { section: ChapterSection; nextIndex: number } {
  const heading = blocks[startIndex];

  if (!isH2Block(heading)) {
    throw new Error('collectChapterSection must start on an h2 block.');
  }

  const sectionBlocks: MarkdownBlock[] = [];
  let index = startIndex + 1;

  while (index < blocks.length && blocks[index].type !== 'h2') {
    sectionBlocks.push(blocks[index]);
    index += 1;
  }

  return {
    section: {
      heading,
      blocks: sectionBlocks,
      normalizedTitle: normalizeSectionTitle(heading.text),
    },
    nextIndex: index,
  };
}

function isH2Block(block: MarkdownBlock | undefined): block is MarkdownBlock & { type: 'h2' } {
  return block?.type === 'h2';
}

export function getSectionTextLines(blocks: MarkdownBlock[]) {
  return blocks
    .flatMap((block) => {
      switch (block.type) {
        case 'paragraph':
          return [block.text];
        case 'unordered-list':
        case 'ordered-list':
          return block.items;
        case 'code':
          return [block.text];
        case 'h3':
          return [block.text];
        case 'h1':
        case 'h2':
          return [];
      }
    })
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseComicPanel(line: string, index: number): ComicPanel {
  const raw = line.trim();
  const fallbackNumber = String(index + 1).padStart(2, '0');
  const panelMatch = raw.match(/^Panel\s+(\d+)\s*:\s*(.+)$/i);

  if (!panelMatch) {
    return {
      number: fallbackNumber,
      scene: 'Recap moment',
      dialogue: raw,
      raw,
    };
  }

  const number = panelMatch[1].padStart(2, '0');
  const body = panelMatch[2].trim();
  const quoteMatch = body.match(/"([^"]+)"/);

  if (quoteMatch) {
    const scene = body.replace(quoteMatch[0], '').replace(/[:,\\-]\s*$/, '').trim();

    return {
      number,
      scene: scene || 'Recap moment',
      dialogue: quoteMatch[1].trim(),
      raw,
    };
  }

  const colonIndex = body.indexOf(':');

  if (colonIndex !== -1) {
    return {
      number,
      scene: body.slice(0, colonIndex).trim() || 'Recap moment',
      dialogue: body.slice(colonIndex + 1).trim(),
      raw,
    };
  }

  return {
    number,
    scene: 'Recap moment',
    dialogue: body,
    raw,
  };
}
