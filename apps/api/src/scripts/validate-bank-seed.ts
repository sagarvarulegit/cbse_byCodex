import { validateBankSeed } from '../lib/exam-papers/bank-schema.js';
import { MATHS_041_SEED } from '../lib/exam-papers/seed/maths-041-seed.js';
import { MATHS_241_SEED } from '../lib/exam-papers/seed/maths-241-seed.js';
import { SCIENCE_086_SEED } from '../lib/exam-papers/seed/science-086-seed.js';
import { SOCIAL_SCIENCE_087_SEED } from '../lib/exam-papers/seed/social-science-087-seed.js';
import { ENGLISH_184_SEED } from '../lib/exam-papers/seed/english-184-seed.js';

/**
 * Validates the curated Maths 041, Maths 241, Science 086, Social Science 087, and English 184 seeds
 * against curriculum blueprints without touching the database.
 */
function main(): void {
  const seeds = [
    { name: 'Maths Standard (041)', seed: MATHS_041_SEED },
    { name: 'Maths Basic (241)', seed: MATHS_241_SEED },
    { name: 'Science (086)', seed: SCIENCE_086_SEED },
    { name: 'Social Science (087)', seed: SOCIAL_SCIENCE_087_SEED },
    { name: 'English Language & Literature (184)', seed: ENGLISH_184_SEED },
  ];

  let totalIssues = 0;

  for (const { name, seed } of seeds) {
    const issues = validateBankSeed(seed);

    if (issues.length > 0) {
      console.error(`Question bank seed for ${name} failed validation (${issues.length} issues):`);
      for (const issue of issues) {
        console.error(`- ${issue.message}`);
      }
      totalIssues += issues.length;
    } else {
      const byShape = new Map<string, number>();
      for (const question of seed) {
        const shape = `${question.questionType} ${question.marks} mark`;
        byShape.set(shape, (byShape.get(shape) ?? 0) + 1);
      }

      console.log(`Question bank seed for ${name} OK: ${seed.length} questions validated.`);
      for (const [shape, count] of [...byShape.entries()].sort()) {
        console.log(`- ${shape}: ${count}`);
      }
    }
  }

  if (totalIssues > 0) {
    process.exitCode = 1;
  }
}

main();

