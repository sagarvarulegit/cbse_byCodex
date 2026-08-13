import { buildDemandPlan } from '../lib/exam-papers/demand.js';
import { getBoardUnits } from '../lib/exam-papers/blueprint.js';
import { MATHS_041_LAYOUT } from '../lib/exam-papers/layout.js';
import { MATHS_041_SEED } from '../lib/exam-papers/seed/maths-041-seed.js';

/**
 * Prints the fixed demand plan (it is seed-independent) alongside the verified
 * bank pool size for every (unit, section) combination. Run with
 * `npm run seed:bank:analyze -w apps/api` after growing the seed to find
 * combinations that cannot be filled.
 */
function main(): void {
  const bank = MATHS_041_SEED.map((question) => ({
    ...question,
    verificationStatus: 'verified' as const,
  }));
  const units = getBoardUnits();
  const caseStudyUnitIds = [
    ...new Set(
      bank
        .filter((q) => q.questionType === 'case-study' && q.marks === 4)
        .map((q) => q.unitId),
    ),
  ];

  const plan = buildDemandPlan(units, MATHS_041_LAYOUT.sections, caseStudyUnitIds, {
    next: () => 0.5,
    int: () => 0,
    pick: <T>(items: readonly T[]) => items[0] as T,
    shuffle: <T>(items: readonly T[]) => [...items],
  });

  console.log('Demand plan (unit -> section counts) and pool sizes:\n');
  for (const unit of units) {
    const rows: string[] = [];
    for (const section of MATHS_041_LAYOUT.sections) {
      const count = plan.allocations.get(section.id)?.get(unit.id) ?? 0;
      if (count === 0 && section.id === 'A') {
        continue;
      }
      const pool = bank.filter(
        (q) =>
          q.unitId === unit.id &&
          q.marks === section.marksPerQuestion &&
          section.allowedBankTypes.includes(q.questionType),
      ).length;
      const status = count > pool ? 'MISSING' : 'ok';
      if (count > 0 || pool > 0) {
        rows.push(`  Section ${section.id}: demand=${count} pool=${pool} ${status}`);
      }
    }
    console.log(`- ${unit.id} (${unit.marks} marks)${rows.length ? '\n' + rows.join('\n') : '  (no demand)'}`);
  }
  console.log(`\nMCQ counts per unit: ${[...plan.mcqCounts.entries()].map(([id, c]) => `${id}=${c}`).join(', ')}`);
}

main();
