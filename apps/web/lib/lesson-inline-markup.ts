export type InlineMarkupToken =
  | { type: 'text' | 'code'; value: string }
  | { type: 'strong' | 'emphasis'; children: InlineMarkupToken[] };

type InlineMarker = {
  close: string;
  open: string;
  type: 'code' | 'strong' | 'emphasis';
};

const INLINE_MARKERS: InlineMarker[] = [
  { close: '`', open: '`', type: 'code' },
  { close: '**', open: '**', type: 'strong' },
  { close: '*', open: '*', type: 'emphasis' },
];

export function parseInlineMarkup(text: string): InlineMarkupToken[] {
  const tokens: InlineMarkupToken[] = [];
  let plainText = '';
  let index = 0;

  const flushPlainText = () => {
    if (!plainText) {
      return;
    }

    tokens.push({ type: 'text', value: plainText });
    plainText = '';
  };

  while (index < text.length) {
    const marker = INLINE_MARKERS.find(({ open }) => text.startsWith(open, index));

    if (!marker) {
      plainText += text[index];
      index += 1;
      continue;
    }

    const contentStart = index + marker.open.length;
    const contentEnd = text.indexOf(marker.close, contentStart);

    if (contentEnd === -1 || contentEnd === contentStart) {
      plainText += marker.open;
      index = contentStart;
      continue;
    }

    flushPlainText();
    const value = text.slice(contentStart, contentEnd);

    if (marker.type === 'code') {
      tokens.push({ type: 'code', value });
    } else {
      tokens.push({ type: marker.type, children: parseInlineMarkup(value) });
    }

    index = contentEnd + marker.close.length;
  }

  flushPlainText();
  return tokens;
}
