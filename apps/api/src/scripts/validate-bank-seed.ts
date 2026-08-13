import { validateBankSeed } from '../lib/exam-papers/bank-schema.js';
import { MATHS_041_SEED } from '../lib/exam-papers/seed/maths-041-seed.js';

/**
 * Validates the curated Maths 041 seed against the curriculum blueprint
 * without touching the database. Run via `npm run seed:bank:validate -w apps/api`.
 */
function main(): void {
  const issues = validateBankSeed(MATHS_041_SEED);

  if (issues.length > 0) {
    console.error(`Question bank seed failed validation (${issues.length} issues):`);
    for (const issue of issues) {
      console.error(`- ${issue.message}`);
    }
    process.exitCode = 1;
    return;
  }

  const byShape = new Map<string, number>();
  for (const question of MATHS_041_SEED) {
    const shape = `${question.questionType} ${question.marks} mark`;
    byShape.set(shape, (byShape.get(shape) ?? 0) + 1);
  }

  console.log(`Question bank seed OK: ${MATHS_041_SEED.length} questions validated.`);
  for (const [shape, count] of [...byShape.entries()].sort()) {
    console.log(`- ${shape}: ${count}`);
  }
}

main();
