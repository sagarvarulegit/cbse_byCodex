import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  buildChapterPackRecords,
  collectChapterPackSources,
  generateChapterPacksModule,
  renderChapterPacksModule,
} from './chapter-pack-generation';

test('buildChapterPackRecords sorts by slug and preserves markdown byte-for-byte', () => {
  const alphaMarkdown = '---\r\ntitle: Alpha\r\nsubject: English\r\nchapter_slug: alpha\r\n---\r\n# Alpha\r\n';
  const zedMarkdown = '---\ntitle: Zed\nsubject: Science\nchapter_slug: zed\n---\n# Zed';

  const records = buildChapterPackRecords([
    { path: 'z/chapter-pack.md', markdown: zedMarkdown },
    { path: 'a/chapter-pack.md', markdown: alphaMarkdown },
  ]);

  assert.deepEqual(records.map((record) => record.slug), ['alpha', 'zed']);
  assert.equal(records[0]?.markdown, alphaMarkdown);
  assert.equal(records[1]?.markdown, zedMarkdown);
});

test('buildChapterPackRecords rejects missing required frontmatter fields', () => {
  assert.throws(
    () =>
      buildChapterPackRecords([
        {
          path: 'docs/content/class-10/english/missing-title/chapter-pack.md',
          markdown: '---\nsubject: English\nchapter_slug: missing-title\n---\n# Missing title',
        },
      ]),
    /missing required frontmatter field "title"/i,
  );

  assert.throws(
    () =>
      buildChapterPackRecords([
        {
          path: 'docs/content/class-10/english/missing-subject/chapter-pack.md',
          markdown: '---\ntitle: Missing subject\nchapter_slug: missing-subject\n---\n# Missing subject',
        },
      ]),
    /missing required frontmatter field "subject"/i,
  );

  assert.throws(
    () =>
      buildChapterPackRecords([
        {
          path: 'docs/content/class-10/english/missing-slug/chapter-pack.md',
          markdown: '---\ntitle: Missing slug\nsubject: English\n---\n# Missing slug',
        },
      ]),
    /missing required frontmatter field "chapter_slug"/i,
  );
});

test('buildChapterPackRecords rejects duplicate chapter slugs', () => {
  assert.throws(
    () =>
      buildChapterPackRecords([
        {
          path: 'docs/content/class-10/english/first/chapter-pack.md',
          markdown: '---\ntitle: First\nsubject: English\nchapter_slug: shared-slug\n---\n# First',
        },
        {
          path: 'docs/content/class-10/science/second/chapter-pack.md',
          markdown: '---\ntitle: Second\nsubject: Science\nchapter_slug: shared-slug\n---\n# Second',
        },
      ]),
    /duplicate chapter slug "shared-slug"/i,
  );
});

test('renderChapterPacksModule emits stable json indentation and a trailing newline', () => {
  const rendered = renderChapterPacksModule(
    buildChapterPackRecords([
      {
        path: 'docs/content/class-10/english/alpha/chapter-pack.md',
        markdown: '---\ntitle: Alpha\nsubject: English\nchapter_slug: alpha\n---\n# Alpha\n',
      },
      {
        path: 'docs/content/class-10/science/zed/chapter-pack.md',
        markdown: '---\ntitle: Zed\nsubject: Science\nchapter_slug: zed\n---\n# Zed\n',
      },
    ]),
  );

  assert.equal(
    rendered,
    `export type ChapterPack = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

export const chapterPacks = {
  "alpha": {
    "markdown": "---\\ntitle: Alpha\\nsubject: English\\nchapter_slug: alpha\\n---\\n# Alpha\\n",
    "slug": "alpha",
    "sourcePath": "docs/content/class-10/english/alpha/chapter-pack.md",
    "subject": "English",
    "title": "Alpha"
  },
  "zed": {
    "markdown": "---\\ntitle: Zed\\nsubject: Science\\nchapter_slug: zed\\n---\\n# Zed\\n",
    "slug": "zed",
    "sourcePath": "docs/content/class-10/science/zed/chapter-pack.md",
    "subject": "Science",
    "title": "Zed"
  }
} as const satisfies Record<string, ChapterPack>;
`,
  );
  assert.equal(rendered.endsWith('\n'), true);
});

test('collectChapterPackSources recursively reads nested chapter packs in deterministic path order', async () => {
  const fixture = await createChapterPackFixture({
    'docs/content/class-10/science/z-last/chapter-pack.md':
      '---\ntitle: Zed\nsubject: Science\nchapter_slug: zed\n---\n# Zed\n',
    'docs/content/class-10/english/a-first/chapter-pack.md':
      '---\ntitle: Alpha\nsubject: English\nchapter_slug: alpha\n---\n# Alpha\n',
    'docs/content/class-10/english/ignore-me.md': '# not a chapter pack',
  });

  const sources = await collectChapterPackSources(fixture.contentRoot, fixture.repoRoot);

  assert.deepEqual(
    sources.map((source) => source.path),
    [
      'docs/content/class-10/english/a-first/chapter-pack.md',
      'docs/content/class-10/science/z-last/chapter-pack.md',
    ],
  );
  assert.equal(sources[0]?.markdown, '---\ntitle: Alpha\nsubject: English\nchapter_slug: alpha\n---\n# Alpha\n');
  assert.equal(sources[1]?.markdown, '---\ntitle: Zed\nsubject: Science\nchapter_slug: zed\n---\n# Zed\n');
});

test('generateChapterPacksModule rejects duplicate slugs discovered from the recursive source tree', async () => {
  const fixture = await createChapterPackFixture({
    'docs/content/class-10/english/first-flight/a-letter-to-god/chapter-pack.md':
      '---\ntitle: A Letter to God\nsubject: English - First Flight\nchapter_slug: a-letter-to-god\n---\n# A Letter to God\n',
    'docs/content/class-10/english/words-and-expressions/a-letter-to-god/chapter-pack.md':
      '---\ntitle: Words and Expressions Unit 1 - A Letter to God\nsubject: English - Words and Expressions 2\nchapter_slug: a-letter-to-god\n---\n# Words and Expressions Unit 1 - A Letter to God\n',
  });

  await assert.rejects(
    () => generateChapterPacksModule(fixture.contentRoot, fixture.repoRoot),
    /duplicate chapter slug "a-letter-to-god"/i,
  );
});

async function createChapterPackFixture(files: Record<string, string>): Promise<{
  contentRoot: string;
  repoRoot: string;
}> {
  const repoRoot = await mkdtemp(path.join(os.tmpdir(), 'chapter-pack-generation-'));

  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(repoRoot, ...relativePath.split('/'));
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, 'utf8');
  }

  return {
    contentRoot: path.join(repoRoot, 'docs', 'content', 'class-10'),
    repoRoot,
  };
}
