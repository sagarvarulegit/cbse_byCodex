import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildChapterPackRecords,
  type ChapterPackSource,
  renderChapterPacksModule,
} from '../lib/chapter-pack-generation';

async function main(): Promise<void> {
  const repoRoot = path.resolve(process.cwd(), '../..');
  const chapterPackRoot = path.join(repoRoot, 'docs', 'content', 'class-10');
  const chapterPackPaths = await findChapterPackPaths(chapterPackRoot);

  const sources = await Promise.all(
    chapterPackPaths.map(async (chapterPackPath) => ({
      markdown: await readFile(chapterPackPath, 'utf8'),
      path: toPosixPath(path.relative(repoRoot, chapterPackPath)),
    })),
  );

  const records = buildChapterPackRecords(await selectCanonicalSources(sources));
  const renderedModule = renderChapterPacksModule(records);
  const outputPath = path.join(process.cwd(), 'lib', 'chapter-packs.generated.ts');
  const existingOutput = await readExistingOutput(outputPath);

  if (existingOutput !== renderedModule) {
    await writeFile(outputPath, renderedModule, 'utf8');
  }

  console.log(`Generated ${records.length} chapter packs.`);
}

async function selectCanonicalSources(sources: ChapterPackSource[]): Promise<ChapterPackSource[]> {
  const canonicalSources = new Map<string, ChapterPackSource>();
  const sortedSources = [...sources].sort((left, right) => compareStrings(left.path, right.path));

  for (const source of sortedSources) {
    const [record] = buildChapterPackRecords([source]);

    if (!record) {
      continue;
    }

    if (!canonicalSources.has(record.slug)) {
      canonicalSources.set(record.slug, source);
    }
  }

  return [...canonicalSources.values()];
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

async function readExistingOutput(outputPath: string): Promise<string | null> {
  try {
    return await readFile(outputPath, 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
}

function isMissingFileError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
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

void main();
