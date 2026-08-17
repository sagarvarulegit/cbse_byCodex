import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildEnglish184BlueprintSnapshot,
  buildMaths041BlueprintSnapshot,
  buildScience086BlueprintSnapshot,
  buildSocialScience087BlueprintSnapshot,
  renderEnglish184SnapshotModule,
  renderMaths041SnapshotModule,
  renderScience086SnapshotModule,
  renderSocialScience087SnapshotModule,
} from '../lib/exam-curriculum-snapshot';

const TARGETS = [
  {
    name: 'Maths 041',
    outputPath: path.resolve(
      process.cwd(),
      '..',
      'api',
      'src',
      'lib',
      'exam-papers',
      'maths-041-blueprint.generated.ts',
    ),
    build: () => renderMaths041SnapshotModule(buildMaths041BlueprintSnapshot()),
  },
  {
    name: 'Science 086',
    outputPath: path.resolve(
      process.cwd(),
      '..',
      'api',
      'src',
      'lib',
      'exam-papers',
      'science-086-blueprint.generated.ts',
    ),
    build: () => renderScience086SnapshotModule(buildScience086BlueprintSnapshot()),
  },
  {
    name: 'Social Science 087',
    outputPath: path.resolve(
      process.cwd(),
      '..',
      'api',
      'src',
      'lib',
      'exam-papers',
      'social-science-087-blueprint.generated.ts',
    ),
    build: () => renderSocialScience087SnapshotModule(buildSocialScience087BlueprintSnapshot()),
  },
  {
    name: 'English 184',
    outputPath: path.resolve(
      process.cwd(),
      '..',
      'api',
      'src',
      'lib',
      'exam-papers',
      'english-184-blueprint.generated.ts',
    ),
    build: () => renderEnglish184SnapshotModule(buildEnglish184BlueprintSnapshot()),
  },
];

async function readExistingOutput(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return null;
    }

    throw error;
  }
}

async function main(): Promise<void> {
  for (const target of TARGETS) {
    const moduleSource = target.build();
    const existingOutput = await readExistingOutput(target.outputPath);

    if (existingOutput !== moduleSource) {
      await mkdir(path.dirname(target.outputPath), { recursive: true });
      await writeFile(target.outputPath, moduleSource, 'utf8');
      console.log(`Generated ${target.outputPath}`);
    } else {
      console.log(`Snapshot is up to date: ${target.outputPath}`);
    }
  }
}

void main();
