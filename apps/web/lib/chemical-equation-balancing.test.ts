import assert from 'node:assert/strict';
import test from 'node:test';

import {
  countAtoms,
  createBalanceWorkbenchRegistry,
  getBalanceWorkbench,
  hasBalanceWorkbench,
  isBalanced,
  isSmallestWholeNumberRatio,
} from './chemical-equation-balancing';

const workbench = getBalanceWorkbench('chemical-equation-balancer');
assert.ok(workbench);

test('workbench contains four reviewed NCERT equations outside the holdout set', () => {
  assert.equal(workbench.equations.length, 4);
  assert.deepEqual(
    workbench.equations.map((equation) => equation.id),
    [
      'iron-steam',
      'hydrogen-chlorine',
      'barium-aluminium-sulphate',
      'sodium-water',
    ],
  );
  assert.ok(workbench.equations.every((equation) => equation.sourceAnchor.startsWith('NCERT')));
});

test('explicit atom maps produce the expected iron-steam totals', () => {
  const equation = workbench.equations[0];
  assert.deepEqual(countAtoms(equation.reactants, [3, 4]), {
    Fe: 3,
    H: 8,
    O: 4,
  });
  assert.deepEqual(countAtoms(equation.products, [1, 4]), {
    Fe: 3,
    H: 8,
    O: 4,
  });
});

test('balance detection rejects blanks, zeroes, partial and reducible ratios', () => {
  const equation = workbench.equations[0];
  assert.equal(isBalanced(equation, []), false);
  assert.equal(isBalanced(equation, [3, 0, 1, 4]), false);
  assert.equal(isBalanced(equation, [1, 1, 1, 1]), false);
  assert.equal(isBalanced(equation, [6, 8, 2, 8]), true);
  assert.equal(isSmallestWholeNumberRatio([6, 8, 2, 8]), false);
});

test('all reviewed solutions are balanced and use the smallest whole-number ratio', () => {
  for (const equation of workbench.equations) {
    assert.equal(isBalanced(equation, equation.solution), true, equation.id);
    assert.equal(
      isSmallestWholeNumberRatio(equation.solution),
      true,
      equation.id,
    );
  }
});

test('demo routing recognises only registered balancing workbenches', () => {
  assert.equal(hasBalanceWorkbench('chemical-equation-balancer'), true);
  assert.equal(hasBalanceWorkbench('unknown-balancer'), false);
});

test('another chapter can register a workbench without Chapter 1 component code', () => {
  const registry = createBalanceWorkbenchRegistry([
    {
      chapterSlug: 'example-chapter',
      equations: [
        {
          elementOrder: ['X'],
          hints: ['Count X.', 'Match X.', 'Use 1 : 1.'],
          id: 'example-equation',
          products: [{ atoms: { X: 1 }, formula: 'X', name: 'product X' }],
          reactants: [{ atoms: { X: 1 }, formula: 'X', name: 'reactant X' }],
          solution: [1, 1],
          sourceAnchor: 'Example source',
        },
      ],
      id: 'example-balancer',
      lessonSlug: 'example-lesson',
      practiceItemId: 'example-balance-practice',
      subtitle: 'Example subtitle',
      title: 'Example workbench',
    },
  ]);

  assert.equal(registry.has('example-balancer'), true);
  assert.equal(registry.get('example-balancer')?.chapterSlug, 'example-chapter');
});
