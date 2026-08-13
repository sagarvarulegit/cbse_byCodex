import { MATHS_041_LAYOUT } from './layout.js';
import type { SeededRng } from './prng.js';
import type { PaperSectionDefinition } from './types.js';

export type DemandPlan = {
  /** sectionId -> unitId -> question count */
  allocations: Map<string, Map<string, number>>;
  /** unitId -> Section A (MCQ) count */
  mcqCounts: Map<string, number>;
  /** unitId -> marks supplied by sections B-E */
  unitMarks: Map<string, number>;
};

/**
 * Largest-remainder (Hamilton) allocation of `total` indistinguishable items
 * among weighted candidates. Ties break by `tieOrder` (registry order).
 */
export function allocateLargestRemainder(
  items: Array<{ id: string; weight: number }>,
  total: number,
  tieOrder: string[],
): Map<string, number> {
  if (total < 0) {
    throw new Error('Cannot allocate a negative number of questions.');
  }
  if (items.length === 0) {
    throw new Error('Cannot allocate questions with no candidate units.');
  }

  const weightSum = items.reduce((sum, item) => sum + item.weight, 0);
  if (weightSum <= 0) {
    throw new Error('Cannot allocate questions with zero total weight.');
  }

  const counts = new Map<string, number>();
  const remainders: Array<{ id: string; remainder: number }> = [];

  for (const item of items) {
    const exact = (item.weight * total) / weightSum;
    const floor = Math.floor(exact);
    counts.set(item.id, floor);
    remainders.push({ id: item.id, remainder: exact - floor });
  }

  remainders.sort(
    (a, b) =>
      b.remainder - a.remainder ||
      tieOrder.indexOf(a.id) - tieOrder.indexOf(b.id),
  );

  let assigned = items.reduce((sum, item) => sum + (counts.get(item.id) ?? 0), 0);
  for (const candidate of remainders) {
    if (assigned >= total) {
      break;
    }
    counts.set(candidate.id, (counts.get(candidate.id) ?? 0) + 1);
    assigned += 1;
  }

  return counts;
}

/**
 * Moves one question of `fromUnitId`'s section allocation to `toUnitId` within
 * the same section. Returns the marks of the moved question, or null when the
 * source unit has no movable question.
 */
function moveQuestion(
  allocations: Map<string, Map<string, number>>,
  fromUnitId: string,
  toUnitId: string,
): number | null {
  for (const [sectionId, sectionAllocation] of allocations) {
    const count = sectionAllocation.get(fromUnitId) ?? 0;
    if (count <= 0) {
      continue;
    }
    const section = MATHS_041_LAYOUT.sections.find((s) => s.id === sectionId);
    if (!section) {
      continue;
    }
    sectionAllocation.set(fromUnitId, count - 1);
    sectionAllocation.set(toUnitId, (sectionAllocation.get(toUnitId) ?? 0) + 1);
    return section.marksPerQuestion;
  }
  return null;
}

function findMovableMarks(
  allocations: Map<string, Map<string, number>>,
  unitId: string,
): number | null {
  for (const [sectionId, sectionAllocation] of allocations) {
    const count = sectionAllocation.get(unitId) ?? 0;
    if (count <= 0) {
      continue;
    }
    const section = MATHS_041_LAYOUT.sections.find((s) => s.id === sectionId);
    if (section) {
      return section.marksPerQuestion;
    }
  }
  return null;
}

/**
 * Plans how many questions of every section each unit contributes so that:
 *  1. per-section question counts match the official layout exactly,
 *  2. each unit's total marks equal its official weightage exactly,
 *  3. Section E (case studies) only draws from units that own case-study
 *     questions, and
 *  4. Section A (MCQ) counts stay close to the proportional target
 *     (weight × 20/80), which keeps papers realistic and balanced.
 *
 * Throws descriptive errors when the layout is infeasible for the weights.
 */
export function buildDemandPlan(
  units: Array<{ id: string; title: string; marks: number }>,
  sections: PaperSectionDefinition[],
  caseStudyUnitIds: string[],
  _rng: SeededRng,
): DemandPlan {
  const sectionA = sections.find((section) => section.id === 'A');
  const constructedSections = sections.filter((section) => section.id !== 'A');
  if (!sectionA) {
    throw new Error('The layout is missing Section A (the MCQ buffer).');
  }

  const unitOrder = units.map((unit) => unit.id);
  const totalWeight = units.reduce((sum, unit) => sum + unit.marks, 0);
  const constructedTotal = constructedSections.reduce(
    (sum, section) => sum + section.questionCount * section.marksPerQuestion,
    0,
  );
  if (constructedTotal !== totalWeight - sectionA.questionCount) {
    throw new Error(
      `Layout mismatch: constructed sections total ${constructedTotal} marks but ` +
        `expected ${totalWeight - sectionA.questionCount}.`,
    );
  }

  // 1. Proportional MCQ targets (soft): the paper's one-mark MCQs spread
  //    across units by weightage.
  const mcqTargets = allocateLargestRemainder(
    units.map((unit) => ({ id: unit.id, weight: unit.marks })),
    sectionA.questionCount,
    unitOrder,
  );

  // 2. Allocate constructed sections. Section E is restricted to units that
  //    own case-study questions in the bank.
  const allocations = new Map<string, Map<string, number>>();
  for (const section of constructedSections) {
    const candidateUnits =
      section.id === 'E'
        ? units.filter((unit) => caseStudyUnitIds.includes(unit.id))
        : units;
    if (candidateUnits.length < section.questionCount) {
      throw new Error(
        `Section ${section.id} needs ${section.questionCount} questions but only ` +
          `${candidateUnits.length} units can supply them (case-study units: ` +
          `${caseStudyUnitIds.join(', ') || 'none'}).`,
      );
    }
    allocations.set(
      section.id,
      allocateLargestRemainder(
        candidateUnits.map((unit) => ({ id: unit.id, weight: unit.marks })),
        section.questionCount,
        unitOrder,
      ),
    );
  }

  // 3. Compute the MCQ buffer a_u = weight_u − used_u.
  const used = new Map<string, number>();
  for (const unit of units) {
    used.set(unit.id, 0);
  }
  for (const section of constructedSections) {
    const sectionAllocation = allocations.get(section.id);
    if (!sectionAllocation) {
      continue;
    }
    for (const [unitId, count] of sectionAllocation) {
      used.set(unitId, (used.get(unitId) ?? 0) + count * section.marksPerQuestion);
    }
  }

  const mcqCounts = new Map<string, number>();
  for (const unit of units) {
    mcqCounts.set(unit.id, unit.marks - (used.get(unit.id) ?? 0));
  }

  // 4. Repair: no unit may be over-allocated in constructed sections
  //    (mcqCounts must never go negative).
  let guard = 0;
  while (guard < 100) {
    guard += 1;
    const deficitUnit = units.find((unit) => (mcqCounts.get(unit.id) ?? 0) < 0);
    if (!deficitUnit) {
      break;
    }
    const surplusUnit = [...units].sort(
      (a, b) => (mcqCounts.get(b.id) ?? 0) - (mcqCounts.get(a.id) ?? 0),
    )[0];
    if (!surplusUnit || surplusUnit.id === deficitUnit.id) {
      throw new Error(
        `Cannot repair the plan: unit "${deficitUnit.id}" is over-allocated and ` +
          `no other unit can absorb a question.`,
      );
    }
    const movedMarks = moveQuestion(allocations, deficitUnit.id, surplusUnit.id);
    if (movedMarks === null) {
      throw new Error(
        `Cannot repair the plan: unit "${deficitUnit.id}" is over-allocated in ` +
          `constructed sections and no question can be moved out.`,
      );
    }
    used.set(deficitUnit.id, (used.get(deficitUnit.id) ?? 0) - movedMarks);
    used.set(surplusUnit.id, (used.get(surplusUnit.id) ?? 0) + movedMarks);
    for (const unit of units) {
      mcqCounts.set(unit.id, unit.marks - (used.get(unit.id) ?? 0));
    }
  }

  // 5. Balance MCQs toward the proportional target (soft pass): move a
  //    constructed question from a low-MCQ unit into a high-MCQ unit.
  guard = 0;
  while (guard < 60) {
    guard += 1;
    const highUnit = units
      .filter((unit) => (mcqCounts.get(unit.id) ?? 0) > (mcqTargets.get(unit.id) ?? 0) + 1)
      .sort((a, b) => (mcqCounts.get(b.id) ?? 0) - (mcqCounts.get(a.id) ?? 0))[0];
    const lowUnit = units
      .filter((unit) => (mcqCounts.get(unit.id) ?? 0) < (mcqTargets.get(unit.id) ?? 0) - 1)
      .sort((a, b) => (mcqCounts.get(a.id) ?? 0) - (mcqCounts.get(b.id) ?? 0))[0];

    if (!highUnit || !lowUnit) {
      break;
    }
    const headroom = mcqCounts.get(highUnit.id) ?? 0;
    const movableMarks = findMovableMarks(allocations, lowUnit.id);
    if (movableMarks === null || movableMarks > headroom) {
      break;
    }
    const movedMarks = moveQuestion(allocations, lowUnit.id, highUnit.id);
    if (movedMarks === null) {
      break;
    }
    used.set(lowUnit.id, (used.get(lowUnit.id) ?? 0) - movedMarks);
    used.set(highUnit.id, (used.get(highUnit.id) ?? 0) + movedMarks);
    for (const unit of units) {
      mcqCounts.set(unit.id, unit.marks - (used.get(unit.id) ?? 0));
    }
  }

  validatePlan(allocations, mcqCounts, units, sections);

  return {
    allocations,
    mcqCounts,
    unitMarks: used,
  };
}

function validatePlan(
  allocations: Map<string, Map<string, number>>,
  mcqCounts: Map<string, number>,
  units: Array<{ id: string; title: string; marks: number }>,
  sections: PaperSectionDefinition[],
): void {
  for (const section of sections) {
    if (section.id === 'A') {
      continue;
    }
    const sectionAllocation = allocations.get(section.id);
    const total = [...(sectionAllocation?.values() ?? [])].reduce(
      (sum, count) => sum + count,
      0,
    );
    if (total !== section.questionCount) {
      throw new Error(
        `Section ${section.id} has ${total} planned questions, expected ${section.questionCount}.`,
      );
    }
  }

  let mcqTotal = 0;
  let markTotal = 0;
  for (const unit of units) {
    const mcq = mcqCounts.get(unit.id) ?? 0;
    if (mcq < 0) {
      throw new Error(`Unit "${unit.id}" is over-allocated in constructed sections.`);
    }
    let unitMarkTotal = 0;
    for (const [sectionId, sectionAllocation] of allocations) {
      const section = sections.find((s) => s.id === sectionId);
      if (!section) {
        continue;
      }
      unitMarkTotal += (sectionAllocation.get(unit.id) ?? 0) * section.marksPerQuestion;
    }
    if (unitMarkTotal + mcq !== unit.marks) {
      throw new Error(
        `Unit "${unit.id}" plans ${unitMarkTotal + mcq} marks, expected ${unit.marks}.`,
      );
    }
    mcqTotal += mcq;
    markTotal += unitMarkTotal;
  }

  const sectionACount = sections.find((section) => section.id === 'A')?.questionCount ?? 0;
  if (mcqTotal !== sectionACount) {
    throw new Error(`Section A plans ${mcqTotal} MCQs, expected ${sectionACount}.`);
  }
  if (markTotal + mcqTotal !== units.reduce((sum, unit) => sum + unit.marks, 0)) {
    throw new Error('The demand plan does not sum to the paper total.');
  }
}
