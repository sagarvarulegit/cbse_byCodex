import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

export type ChapterPackSource = { path: string; markdown: string };

export type GeneratedChapterPackRecord = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'subject', 'chapter_slug'] as const;

export type GeneratedChapterPacksModule = {
  moduleSource: string;
  records: GeneratedChapterPackRecord[];
  sources: ChapterPackSource[];
};

export async function collectChapterPackSources(contentRoot: string, repoRoot: string): Promise<ChapterPackSource[]> {
  const chapterPackPaths = await findChapterPackPaths(contentRoot);

  return Promise.all(
    chapterPackPaths.map(async (chapterPackPath) => ({
      markdown: await readFile(chapterPackPath, 'utf8'),
      path: toPosixPath(path.relative(repoRoot, chapterPackPath)),
    })),
  );
}

export async function generateChapterPacksModule(
  contentRoot: string,
  repoRoot: string,
): Promise<GeneratedChapterPacksModule> {
  const sources = await collectChapterPackSources(contentRoot, repoRoot);
  const records = buildChapterPackRecords(sources);

  return {
    moduleSource: renderChapterPacksModule(records),
    records,
    sources,
  };
}

export function buildChapterPackRecords(sources: ChapterPackSource[]): GeneratedChapterPackRecord[] {
  const records = sources.map((source) => {
    const frontmatter = parseFrontmatter(source.markdown);
    const title = readRequiredFrontmatterField(frontmatter, 'title', source.path);
    const subject = readRequiredFrontmatterField(frontmatter, 'subject', source.path);
    const slug = readRequiredFrontmatterField(frontmatter, 'chapter_slug', source.path);

    return {
      markdown: source.markdown,
      slug,
      sourcePath: source.path,
      subject,
      title,
    };
  });

  const sortedRecords = [...records].sort(compareRecordsBySlug);

  for (let index = 1; index < sortedRecords.length; index += 1) {
    const previousRecord = sortedRecords[index - 1];
    const currentRecord = sortedRecords[index];

    if (previousRecord?.slug === currentRecord?.slug) {
      throw new Error(
        `Duplicate chapter slug "${currentRecord.slug}" found in "${previousRecord.sourcePath}" and "${currentRecord.sourcePath}".`,
      );
    }
  }

  return sortedRecords;
}

export function renderChapterPacksModule(records: GeneratedChapterPackRecord[]): string {
  const sortedRecords = [...records].sort(compareRecordsBySlug);
  const chapterPacks = Object.fromEntries(
    sortedRecords.map((record) => [
      record.slug,
      {
        markdown: record.markdown,
        slug: record.slug,
        sourcePath: record.sourcePath,
        subject: record.subject,
        title: record.title,
      },
    ]),
  );

  return `export type ChapterPack = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

export const chapterPacks = ${JSON.stringify(chapterPacks, null, 2)} as const satisfies Record<string, ChapterPack>;
`;
}

function compareRecordsBySlug(left: GeneratedChapterPackRecord, right: GeneratedChapterPackRecord): number {
  return compareStrings(left.slug, right.slug) || compareStrings(left.sourcePath, right.sourcePath);
}

async function findChapterPackPaths(rootDirectory: string): Promise<string[]> {
  const entries = await readdir(rootDirectory, { withFileTypes: true });
  const sortedEntries = [...entries].sort((left, right) => compareStrings(left.name, right.name));
  const paths: string[] = [];

  for (const entry of sortedEntries) {
    const entryPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      paths.push(...(await findChapterPackPaths(entryPath)));
      continue;
    }

    if (entry.isFile() && entry.name === 'chapter-pack.md') {
      paths.push(entryPath);
    }
  }

  return paths;
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

function compareStrings(left: string, right: string): number {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function parseFrontmatter(markdown: string): Map<string, string> {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const frontmatter = new Map<string, string>();

  if (!match) {
    return frontmatter;
  }

  const lines = match[1]?.split(/\r?\n/) ?? [];

  for (const line of lines) {
    const fieldMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

    if (!fieldMatch) {
      continue;
    }

    const [, key, rawValue = ''] = fieldMatch;
    frontmatter.set(key, stripWrappingQuotes(rawValue.trim()));
  }

  return frontmatter;
}

function readRequiredFrontmatterField(
  frontmatter: Map<string, string>,
  fieldName: (typeof REQUIRED_FRONTMATTER_FIELDS)[number],
  sourcePath: string,
): string {
  const value = frontmatter.get(fieldName)?.trim();

  if (!value) {
    throw new Error(`Chapter pack "${sourcePath}" is missing required frontmatter field "${fieldName}".`);
  }

  return value;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
