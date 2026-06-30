import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  generateChapterPacksModule,
} from '../lib/chapter-pack-generation';

async function main(): Promise<void> {
  const repoRoot = path.resolve(process.cwd(), '../..');
  const chapterPackRoot = path.join(repoRoot, 'docs', 'content', 'class-10');
  const { moduleSource, records } = await generateChapterPacksModule(chapterPackRoot, repoRoot);
  const outputPath = path.join(process.cwd(), 'lib', 'chapter-packs.generated.ts');
  const existingOutput = await readExistingOutput(outputPath);

  if (existingOutput !== moduleSource) {
    await writeFile(outputPath, moduleSource, 'utf8');
  }

  console.log(`Generated ${records.length} chapter packs.`);
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

void main();
