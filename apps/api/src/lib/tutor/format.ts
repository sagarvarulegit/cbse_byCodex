/**
 * Post-processes Tara's raw answer markdown before it is stored or rendered:
 * - preserves secure ```interactive-canvas ... ``` blocks for sandboxed iframe execution,
 * - strips any stray HTML/script in regular prose (defense against prompt injection),
 * - normalizes math delimiters to KaTeX-compatible $...$ / $$...$$,
 * - collapses excessive whitespace.
 */

const SCRIPT_TAG = /<script[\s\S]*?<\/script>/gi;
const STYLE_TAG = /<style[\s\S]*?<\/style>/gi;
const HTML_TAG =
  /<\/?(?:[a-zA-Z][a-zA-Z0-9]*)(?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=><`]+))?)*\s*\/?>/gi;
const SOURCE_CITATION_TAG = /\[source(?::|\s+id=)[^\]]*\]/gi;
const CHUNK_CITATION_TAG = /\[(?:chunk|source)_[a-zA-Z0-9_\-]+(?:\s*,\s*(?:chunk|source)_[a-zA-Z0-9_\-]+)*\]/gi;

/** Replace inline math delimiters like \( ... \) with $ ... $ */
function normalizeInlineMath(text: string): string {
  return text.replace(/\\\(([\s\S]*?)\\\)/g, (_match, inner: string) => `$${inner.trim()}$`);
}

/** Replace display math delimiters like \[ ... \] and \(\) variants with $$ ... $$ */
function normalizeDisplayMath(text: string): string {
  return text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, inner: string) => `$$\n${inner.trim()}\n$$`);
}

/** Strip internal source/chunk citations that leak into student text */
function stripInternalCitations(text: string): string {
  return text
    .replace(SOURCE_CITATION_TAG, '')
    .replace(CHUNK_CITATION_TAG, '');
}

/** Collapse 3+ newlines to 2; trim trailing/leading spaces per line. */
function collapseWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

export function sanitizeTutorMarkdown(raw: string): string {
  // 1. Temporarily isolate ```interactive-canvas ... ``` blocks so sandboxed simulations remain intact
  const canvasBlocks: string[] = [];
  let placeholderCount = 0;
  let text = raw.replace(/```(?:interactive-canvas|visual-canvas|canvas)[\s\S]*?(?:```|$)/g, (match) => {
    canvasBlocks.push(match);
    return `__INTERACTIVE_CANVAS_BLOCK_${placeholderCount++}__`;
  });

  // 2. Sanitize regular markdown prose
  text = text.replace(SCRIPT_TAG, '').replace(STYLE_TAG, '');
  text = text.replace(HTML_TAG, '');
  text = stripInternalCitations(text);
  text = normalizeDisplayMath(text);
  text = normalizeInlineMath(text);
  text = collapseWhitespace(text);

  // 3. Re-inject interactive canvas blocks for safe rendering in client sandbox
  text = text.replace(/__INTERACTIVE_CANVAS_BLOCK_(\d+)__/g, (_match, index) => {
    return canvasBlocks[Number(index)] || '';
  });

  return text;
}
