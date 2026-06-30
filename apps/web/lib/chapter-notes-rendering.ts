import type { MarkdownBlock } from './course-content';

export type ChapterSection = {
  heading: MarkdownBlock & { type: 'h2' };
  blocks: MarkdownBlock[];
  normalizedTitle: string;
};

export type ChapterSectionVariant =
  | 'goals'
  | 'flow'
  | 'concept'
  | 'example'
  | 'formula'
  | 'summary'
  | 'mistakes'
  | 'tips'
  | 'practice'
  | 'quiz'
  | 'comic'
  | 'standard';

export type ComicPanel = {
  number: string;
  scene: string;
  speaker: string;
  dialogue: string;
  visualHint: 'action' | 'idea' | 'warning' | 'memory';
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

export function getChapterSectionVariant(section: ChapterSection): ChapterSectionVariant {
  const title = section.normalizedTitle;

  if (title.includes('comic') && title.includes('recap')) {
    return 'comic';
  }

  if (title === 'chapter goal') {
    return 'goals';
  }

  if (title === 'chapter flow for the platform' || title.startsWith('chapter flow')) {
    return 'flow';
  }

  if (title.includes('summary')) {
    return 'summary';
  }

  if (title.includes('common mistake')) {
    return 'mistakes';
  }

  if (title === 'board tips') {
    return 'tips';
  }

  if (title.includes('practice') && !title.includes('solved')) {
    return 'practice';
  }

  if (title.includes('mini quiz')) {
    return 'quiz';
  }

  if (title.includes('example') || title.includes('solved')) {
    return 'example';
  }

  if (section.blocks.some((block) => block.type === 'code' && isFormulaLikeText(block.text))) {
    return 'formula';
  }

  if (/^\d+\s/.test(title) || /^\d+\)/.test(section.heading.text.trim())) {
    return 'concept';
  }

  return 'standard';
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

export function isFormulaLikeText(value: string) {
  const text = value.trim();

  if (!text) {
    return false;
  }

  if (/^Panel\s+\d+\s*:/i.test(text)) {
    return false;
  }

  const tokens = text.match(/\b(?:\d+)?(?:[A-Z][a-z]?|\([A-Za-z0-9]+\))(?:[A-Za-z0-9()]*\d*)*\b/g) ?? [];
  const hasChemicalToken = tokens.some((token) => /\d/.test(token) || /[()]/.test(token) || /[A-Z]{2,}/.test(token));

  if (text.includes('->') || text.includes('=') || text.includes('+')) {
    return hasChemicalToken;
  }

  return hasChemicalToken;
}

export function parseComicPanel(line: string, index: number): ComicPanel {
  const raw = line.trim();
  const fallbackNumber = String(index + 1).padStart(2, '0');
  const panelMatch = raw.match(/^Panel\s+(\d+)\s*:\s*(.+)$/i);

  if (!panelMatch) {
    return {
      number: fallbackNumber,
      scene: 'Recap moment',
      speaker: 'Memory Guide',
      dialogue: raw,
      visualHint: 'memory',
      raw,
    };
  }

  const number = panelMatch[1].padStart(2, '0');
  const body = panelMatch[2].trim();
  const quoteMatch = body.match(/"([^"]+)"/);

  if (quoteMatch) {
    const beforeQuote = body.replace(quoteMatch[0], '').replace(/[,:-]\s*$/, '').trim();
    const speakerMatch = beforeQuote.match(
      /^([^:,.]+?)\s+(says|asks|shouts|cries|points|shows|builds|joins|splits|pushes|attacks|blocks)\b/i,
    );
    const speaker = speakerMatch?.[1]?.trim() || beforeQuote || 'Memory Guide';
    const scene = speakerMatch ? beforeQuote.slice(speaker.length).trim() : beforeQuote;

    return {
      number,
      scene: scene || 'Recap moment',
      speaker,
      dialogue: quoteMatch[1].trim(),
      visualHint: getComicVisualHint(body),
      raw,
    };
  }

  const colonIndex = body.indexOf(':');

  if (colonIndex !== -1) {
    const speaker = body.slice(0, colonIndex).trim() || 'Memory Guide';

    return {
      number,
      scene: 'Recap moment',
      speaker,
      dialogue: body.slice(colonIndex + 1).trim(),
      visualHint: getComicVisualHint(body),
      raw,
    };
  }

  return {
    number,
    scene: 'Recap moment',
    speaker: 'Memory Guide',
    dialogue: body,
    visualHint: getComicVisualHint(body),
    raw,
  };
}

function getComicVisualHint(value: string): ComicPanel['visualHint'] {
  const text = value.toLowerCase();

  if (text.includes('mistake') || text.includes('warning') || text.includes('stop') || text.includes('confus')) {
    return 'warning';
  }

  if (text.includes('remember') || text.includes('recap') || text.includes('revision')) {
    return 'memory';
  }

  if (text.includes('says') || text.includes('asks') || text.includes('idea') || text.includes('means')) {
    return 'idea';
  }

  return 'action';
}
