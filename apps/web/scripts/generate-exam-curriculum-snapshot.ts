import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  buildMaths041BlueprintSnapshot,
  renderMaths041SnapshotModule,
} from '../lib/exam-curriculum-snapshot';

const OUTPUT_PATH = path.resolve(
  process.cwd(),
  '..',
  'api',
  'src',
  'lib',
  'exam-papers',
  'maths-041-blueprint.generated.ts',
);

async function readExistingOutput(): Promise<string | null> {
  try {
    return await readFile(OUTPUT_PATH, 'utf8');
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
  const blueprint = buildMaths041BlueprintSnapshot();
  const moduleSource = renderMaths041SnapshotModule(blueprint);
  const existingOutput = await readExistingOutput();

  if (existingOutput !== moduleSource) {
    await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, moduleSource, 'utf8');
    console.log(`Generated ${OUTPUT_PATH}`);
  } else {
    console.log(`Snapshot is up to date: ${OUTPUT_PATH}`);
  }
}

void main();
