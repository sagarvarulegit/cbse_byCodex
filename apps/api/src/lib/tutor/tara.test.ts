import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { sanitizeTutorMarkdown } from './format.js';
import { generateTutorAnswer, parseTutorAnswer } from './generate.js';

function fakeFetch(responseText: string): typeof fetch {
  return (async () => {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: responseText }] } }],
      }),
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

const CHUNK = {
  id: 'chunk-1',
  subject: 'Science',
  chapterSlug: 'chemical-reactions-and-equations',
  sectionTitle: 'Displacement reactions',
  content: 'In a displacement reaction, a more reactive metal displaces a less reactive metal from its salt solution.',
  sourcePath: 'docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md',
  sourceRank: 0,
  score: 0.95,
};

const BASE_OPTIONS = {
  chunks: [CHUNK],
  history: [],
  question: 'What is a displacement reaction?',
};

test('parses a normal answer with citations', () => {
  const raw = JSON.stringify({
    answerMarkdown: 'A **displacement reaction** is when a more reactive metal replaces a less reactive one.',
    citedChunkIds: ['chunk-1'],
    confidence: 0.92,
    refused: false,
  });
  const parsed = parseTutorAnswer(raw);
  assert.equal(parsed.refused, false);
  assert.deepEqual(parsed.citedChunkIds, ['chunk-1']);
  assert.ok(parsed.answerMarkdown.includes('**displacement reaction**'));
  assert.ok(parsed.confidence > 0.9);
});

test('marks refused=true for off-scope answers', () => {
  const raw = JSON.stringify({
    answerMarkdown: "My notes don't cover that — it's outside Class 10.",
    citedChunkIds: [],
    confidence: 0.1,
    refused: true,
  });
  const parsed = parseTutorAnswer(raw);
  assert.equal(parsed.refused, true);
  assert.equal(parsed.citedChunkIds.length, 0);
});

test('falls back to raw text when JSON parse fails', () => {
  const parsed = parseTutorAnswer('I think the answer is 42.');
  assert.equal(parsed.answerMarkdown, 'I think the answer is 42.');
  assert.deepEqual(parsed.citedChunkIds, []);
  assert.equal(parsed.refused, false);
});

test('generateTutorAnswer calls Gemini and returns parsed result', async () => {
  const fetchImpl = fakeFetch(
    JSON.stringify({
      answerMarkdown: 'The discriminant is $$b^2 - 4ac$$ and the roots are $x = 3$ or $x = 5$.',
      citedChunkIds: ['chunk-1'],
      confidence: 0.85,
      refused: false,
    }),
  );
  const answer = await generateTutorAnswer(BASE_OPTIONS, fetchImpl);
  assert.equal(answer.refused, false);
  assert.deepEqual(answer.citedChunkIds, ['chunk-1']);
  assert.ok(answer.answerMarkdown.includes('$$b^2 - 4ac$$'));
});

test('generateTutorAnswer handles markdown-fenced JSON', async () => {
  const fetchImpl = fakeFetch(
    '```json\n{"answerMarkdown": "Hello", "citedChunkIds": [], "confidence": 1, "refused": false}\n```',
  );
  const answer = await generateTutorAnswer(BASE_OPTIONS, fetchImpl);
  assert.equal(answer.answerMarkdown, 'Hello');
  assert.equal(answer.refused, false);
});

// ── sanitizeTutorMarkdown ────────────────────────────────────────────────────

test('sanitize strips script/style/html tags', () => {
  const out = sanitizeTutorMarkdown(
    'Hello <script>alert(1)</script> world <b>bold</b> <style>p{}</style> done',
  );
  assert.ok(!out.includes('<script'));
  assert.ok(!out.includes('<b>'));
  assert.ok(!out.includes('<style'));
  assert.ok(out.includes('bold'));
  assert.ok(out.includes('Hello'));
});

test('sanitize normalizes display and inline math delimiters', () => {
  const out = sanitizeTutorMarkdown('Use \\(x = 3\\) inline and \\[y = 4\\] display.');
  assert.ok(out.includes('$x = 3$'));
  assert.ok(out.includes('$$\ny = 4\n$$'));
  assert.ok(!out.includes('\\('));
  assert.ok(!out.includes('\\['));
});

test('sanitize collapses whitespace', () => {
  const out = sanitizeTutorMarkdown('Line one.\n\n\n\nLine two.   ');
  assert.ok(!out.includes('\n\n\n'));
  assert.equal(out.endsWith('Line two.'), true);
});

test('generateTutorAnswer rejects a non-object JSON response', async () => {
  const fetchImpl = fakeFetch('["not", "an", "object"]');
  await assert.rejects(() => generateTutorAnswer(BASE_OPTIONS, fetchImpl));
});
