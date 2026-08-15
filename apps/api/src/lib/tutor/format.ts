/**
 * Post-processes Tara's raw answer markdown before it is stored or rendered:
 * - strips any HTML/script (defense against prompt injection),
 * - normalizes math delimiters to the KaTeX-compatible $...$ / $$...$$,
 * - collapses excessive whitespace.
 */

const SCRIPT_TAG = /<script[\s\S]*?<\/script>/gi;
const STYLE_TAG = /<style[\s\S]*?<\/style>/gi;
const HTML_TAG = /<\/?(?:[a-zA-Z][^>]*?)>/g;

/** Replace inline math delimiters like \( ... \) with $ ... $ */
function normalizeInlineMath(text: string): string {
  return text.replace(/\\\(([\s\S]*?)\\\)/g, (_match, inner: string) => `$${inner.trim()}$`);
}

/** Replace display math delimiters like \[ ... \] and \(\) variants with $$ ... $$ */
function normalizeDisplayMath(text: string): string {
  return text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, inner: string) => `$$\n${inner.trim()}\n$$`);
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
  let text = raw;
  text = text.replace(SCRIPT_TAG, '').replace(STYLE_TAG, '');
  text = text.replace(HTML_TAG, '');
  text = normalizeDisplayMath(text);
  text = normalizeInlineMath(text);
  text = collapseWhitespace(text);
  return text;
}
