export type BalanceCompound = {
  atoms: Record<string, number>;
  formula: string;
  name: string;
};

export type BalanceEquation = {
  elementOrder: string[];
  hints: [string, string, string];
  id: string;
  products: BalanceCompound[];
  reactants: BalanceCompound[];
  solution: number[];
  sourceAnchor: string;
};

export type BalanceWorkbench = {
  chapterSlug: string;
  equations: BalanceEquation[];
  id: string;
  lessonSlug: string;
  practiceItemId: string;
  subtitle: string;
  title: string;
};

const compound = (
  formula: string,
  name: string,
  atoms: Record<string, number>,
): BalanceCompound => ({ atoms, formula, name });

const CHAPTER_ONE_EQUATIONS: BalanceEquation[] = [
  {
    elementOrder: ['Fe', 'H', 'O'],
    hints: [
      'Start with oxygen because Fe₃O₄ contains four oxygen atoms.',
      'Place 4 before H₂O, then balance the eight hydrogen atoms.',
      'The smallest ratio is 3 : 4 : 1 : 4.',
    ],
    id: 'iron-steam',
    products: [
      compound('Fe₃O₄', 'iron oxide', { Fe: 3, O: 4 }),
      compound('H₂', 'hydrogen', { H: 2 }),
    ],
    reactants: [
      compound('Fe', 'iron', { Fe: 1 }),
      compound('H₂O', 'steam', { H: 2, O: 1 }),
    ],
    solution: [3, 4, 1, 4],
    sourceAnchor: 'NCERT equations (1.4)-(1.10)',
  },
  {
    elementOrder: ['H', 'Cl'],
    hints: [
      'Both reactants contain pairs of atoms.',
      'Keep H₂ and Cl₂ unchanged; adjust only the product coefficient.',
      'The smallest ratio is 1 : 1 : 2.',
    ],
    id: 'hydrogen-chlorine',
    products: [compound('HCl', 'hydrogen chloride', { Cl: 1, H: 1 })],
    reactants: [
      compound('H₂', 'hydrogen', { H: 2 }),
      compound('Cl₂', 'chlorine', { Cl: 2 }),
    ],
    solution: [1, 1, 2],
    sourceAnchor: 'NCERT in-text Question 2(i)',
  },
  {
    elementOrder: ['Ba', 'Cl', 'Al', 'S', 'O'],
    hints: [
      'Treat the sulphate group as one unit because it stays together.',
      'Balance three sulphate groups with 3BaSO₄, then balance barium.',
      'The smallest ratio is 3 : 1 : 3 : 2.',
    ],
    id: 'barium-aluminium-sulphate',
    products: [
      compound('BaSO₄', 'barium sulphate', { Ba: 1, O: 4, S: 1 }),
      compound('AlCl₃', 'aluminium chloride', { Al: 1, Cl: 3 }),
    ],
    reactants: [
      compound('BaCl₂', 'barium chloride', { Ba: 1, Cl: 2 }),
      compound('Al₂(SO₄)₃', 'aluminium sulphate', { Al: 2, O: 12, S: 3 }),
    ],
    solution: [3, 1, 3, 2],
    sourceAnchor: 'NCERT in-text Question 2(ii)',
  },
  {
    elementOrder: ['Na', 'H', 'O'],
    hints: [
      'Balance sodium and oxygen before the final hydrogen check.',
      'Place 2 before Na, H₂O and NaOH.',
      'The smallest ratio is 2 : 2 : 2 : 1.',
    ],
    id: 'sodium-water',
    products: [
      compound('NaOH', 'sodium hydroxide', { H: 1, Na: 1, O: 1 }),
      compound('H₂', 'hydrogen', { H: 2 }),
    ],
    reactants: [
      compound('Na', 'sodium', { Na: 1 }),
      compound('H₂O', 'water', { H: 2, O: 1 }),
    ],
    solution: [2, 2, 2, 1],
    sourceAnchor: 'NCERT in-text Question 2(iii)',
  },
];

const BALANCE_WORKBENCH_DEFINITIONS: BalanceWorkbench[] = [
  {
    chapterSlug: 'chemical-reactions-and-equations',
    equations: CHAPTER_ONE_EQUATIONS,
    id: 'chemical-equation-balancer',
    lessonSlug: 'balancing-equations',
    practiceItemId: 'cre-equation-workbench',
    subtitle:
      'Change coefficients only. Use the atom table to repair one mismatched element at a time.',
    title: 'Coefficient-only balancing workbench',
  },
];

export function countAtoms(
  compounds: BalanceCompound[],
  coefficients: number[],
) {
  const totals: Record<string, number> = {};
  compounds.forEach((currentCompound, index) => {
    const coefficient = coefficients[index] ?? 0;
    for (const [element, atomCount] of Object.entries(currentCompound.atoms)) {
      totals[element] = (totals[element] ?? 0) + atomCount * coefficient;
    }
  });
  return totals;
}

function arePositiveWholeNumbers(coefficients: number[]) {
  return coefficients.every(
    (coefficient) => Number.isInteger(coefficient) && coefficient > 0,
  );
}

function greatestCommonDivisor(left: number, right: number): number {
  return right === 0
    ? Math.abs(left)
    : greatestCommonDivisor(right, left % right);
}

export function isSmallestWholeNumberRatio(coefficients: number[]) {
  if (coefficients.length === 0 || !arePositiveWholeNumbers(coefficients)) {
    return false;
  }

  return coefficients.reduce(greatestCommonDivisor) === 1;
}

export function isBalanced(
  equation: BalanceEquation,
  coefficients: number[],
) {
  const expectedLength = equation.reactants.length + equation.products.length;
  if (
    coefficients.length !== expectedLength ||
    !arePositiveWholeNumbers(coefficients)
  ) {
    return false;
  }

  const reactantCounts = countAtoms(
    equation.reactants,
    coefficients.slice(0, equation.reactants.length),
  );
  const productCounts = countAtoms(
    equation.products,
    coefficients.slice(equation.reactants.length),
  );

  return equation.elementOrder.every(
    (element) => reactantCounts[element] === productCounts[element],
  );
}

export function createBalanceWorkbenchRegistry(
  workbenches: BalanceWorkbench[],
) {
  const workbenchesById = new Map<string, BalanceWorkbench>();

  for (const workbench of workbenches) {
    if (workbenchesById.has(workbench.id)) {
      throw new Error(`Duplicate balance workbench id: ${workbench.id}`);
    }
    if (!workbench.equations.length) {
      throw new Error(`Balance workbench ${workbench.id} has no equations.`);
    }
    const equationIds = new Set<string>();
    for (const equation of workbench.equations) {
      if (equationIds.has(equation.id)) {
        throw new Error(
          `Balance workbench ${workbench.id} has duplicate equation ${equation.id}.`,
        );
      }
      equationIds.add(equation.id);
      if (
        !isBalanced(equation, equation.solution) ||
        !isSmallestWholeNumberRatio(equation.solution)
      ) {
        throw new Error(
          `Balance workbench ${workbench.id} has an invalid solution for ${equation.id}.`,
        );
      }
    }
    workbenchesById.set(workbench.id, workbench);
  }

  return {
    get(demoId: string) {
      return workbenchesById.get(demoId) ?? null;
    },
    has(demoId: string) {
      return workbenchesById.has(demoId);
    },
  };
}

const balanceWorkbenchRegistry = createBalanceWorkbenchRegistry(
  BALANCE_WORKBENCH_DEFINITIONS,
);

export function getBalanceWorkbench(demoId: string) {
  return balanceWorkbenchRegistry.get(demoId);
}

export function hasBalanceWorkbench(demoId: string) {
  return balanceWorkbenchRegistry.has(demoId);
}
