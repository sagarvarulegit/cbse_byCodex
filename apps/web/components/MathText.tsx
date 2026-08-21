import katex from 'katex';
import type { ReactNode } from 'react';

type MathSegment =
  | { type: 'text'; value: string }
  | { type: 'math'; display: boolean; value: string };

export default function MathText({ text }: { text: string }) {
  const segments = splitMathSegments(text);

  // If there are no math segments, return plain text directly
  const hasMath = segments.some((s) => s.type === 'math');
  if (!hasMath) {
    return <>{segments.map((seg, i) => <span key={`text-${i}`}>{seg.value}</span>)}</>;
  }

  return <>{segments.map(renderSegment)}</>;
}

function renderSegment(segment: MathSegment, index: number): ReactNode {
  if (segment.type === 'text') {
    return <span key={`text-${index}`}>{segment.value}</span>;
  }

  const html = katex.renderToString(segment.value, {
    displayMode: segment.display,
    throwOnError: false,
  });

  return (
    <span
      className={segment.display ? 'math-formula math-formula-display' : 'math-formula'}
      dangerouslySetInnerHTML={{ __html: html }}
      key={`math-${index}`}
    />
  );
}

function splitMathSegments(text: string): MathSegment[] {
  const segments: MathSegment[] = [];
  const delimiterPattern = /\$\$([\s\S]+?)\$\$|\$([^$\r\n]+?)\$/g;
  let cursor = 0;

  for (const match of text.matchAll(delimiterPattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > cursor) {
      segments.push({ type: 'text', value: text.slice(cursor, matchIndex) });
    }

    segments.push({
      display: Boolean(match[1]),
      type: 'math',
      value: match[1] ?? match[2],
    });
    cursor = matchIndex + match[0].length;
  }

  if (cursor < text.length) {
    segments.push({ type: 'text', value: text.slice(cursor) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
}
