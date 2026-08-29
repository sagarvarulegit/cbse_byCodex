import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCI_WORDLE_TARGETS,
  VALID_GUESS_WORDS,
  getDailyTerm,
  evaluateGuess,
  getRandomTerm,
} from './sci-wordle-data';
import {
  CHEMICAL_REACTIONS,
  checkIfBalanced,
  countTotalAtoms,
  isExactSolution,
} from './chemical-balancer-data';

test('Sci-Wordle: all target words are exactly 5 uppercase letters and valid', () => {
  assert.ok(SCI_WORDLE_TARGETS.length >= 25, 'Expected at least 25 target words');

  for (const item of SCI_WORDLE_TARGETS) {
    assert.equal(item.word.length, 5, `Target word "${item.word}" must be exactly 5 chars`);
    assert.equal(item.word, item.word.toUpperCase(), `Target word "${item.word}" must be uppercase`);
    assert.ok(item.definition.length > 10, `Target word "${item.word}" missing definition`);
    assert.ok(item.boardTip.length > 5, `Target word "${item.word}" missing board tip`);
    assert.ok(VALID_GUESS_WORDS.has(item.word), `Target word "${item.word}" must be in VALID_GUESS_WORDS`);
  }
});

test('Sci-Wordle: daily term algorithm returns valid and deterministic terms', () => {
  const daily1 = getDailyTerm('2026-08-29');
  const daily2 = getDailyTerm('2026-08-29');
  assert.equal(daily1.term.word, daily2.term.word);
  assert.equal(daily1.dayNumber, daily2.dayNumber);

  const dailyNext = getDailyTerm('2026-08-30');
  assert.notEqual(daily1.dayNumber, dailyNext.dayNumber);
});

test('Sci-Wordle: evaluateGuess computes exact green, yellow, and absent states', () => {
  // Exact match
  const res1 = evaluateGuess('LIGHT', 'LIGHT');
  assert.deepEqual(res1.map(r => r.state), ['correct', 'correct', 'correct', 'correct', 'correct']);

  // Partial match & yellow
  const res2 = evaluateGuess('LIVER', 'LIGHT');
  assert.equal(res2[0].state, 'correct'); // L
  assert.equal(res2[1].state, 'correct'); // I
  assert.equal(res2[2].state, 'absent');  // V
  assert.equal(res2[3].state, 'absent');  // E
  assert.equal(res2[4].state, 'absent');  // R

  // Present in wrong spot
  const res3 = evaluateGuess('HEART', 'EARTH');
  assert.equal(res3[0].state, 'present'); // H -> EARTH (pos 4)
  assert.equal(res3[1].state, 'present'); // E -> EARTH (pos 0)
  assert.equal(res3[2].state, 'present'); // A -> EARTH (pos 1)
  assert.equal(res3[3].state, 'present'); // R -> EARTH (pos 2)
  assert.equal(res3[4].state, 'present'); // T -> EARTH (pos 3)
});

test('Chemical Balancer: all chemical equations have valid minimum solutions and balance correctly', () => {
  assert.ok(CHEMICAL_REACTIONS.length >= 25, 'Expected at least 25 chemical reactions');

  for (const rx of CHEMICAL_REACTIONS) {
    const totalComp = rx.reactants.length + rx.products.length;
    assert.equal(
      rx.solution.length,
      totalComp,
      `Reaction "${rx.name}" (${rx.id}) solution length mismatch: expected ${totalComp}, got ${rx.solution.length}`
    );

    // Verify each solution coefficient is positive integer
    for (const coeff of rx.solution) {
      assert.ok(coeff > 0 && Number.isInteger(coeff), `Invalid coeff ${coeff} in ${rx.id}`);
    }

    // Verify equation balances with its solution
    const check = checkIfBalanced(rx, rx.solution);
    assert.equal(check.isBalanced, true, `Reaction "${rx.name}" (${rx.id}) failed to balance with solution: ${JSON.stringify(check)}`);

    // Verify isExactSolution
    assert.equal(isExactSolution(rx, rx.solution), true);
  }
});
