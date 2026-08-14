import type { BankQuestion } from '../types.js';

const SUBJECT = 'mathematics-standard';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Starter Maths 041 question bank. All items are platform-authored original
 * board-pattern questions derived from the current NCERT scope — never labelled
 * as PYQs (no provenance). Expand this file to grow paper variety; run
 * `npm run seed:bank -w apps/api` to upsert into the database.
 */
export const MATHS_041_SEED: BankQuestion[] = [
  // ── Unit 1 · Number Systems (6 marks) ──────────────────────────────────────
  q({
    bankKey: 'maths-041-rn-hcf-lcm-mcq-1',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-fundamental-theorem-of-arithmetic',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { a: 26, b: 91 },
        statement: 'The HCF of 26 and 91 is:',
        answerKey: {
          options: ['1', '13', '26', '91'],
          correctOptionIndex: 1,
          valuePoints: ['26 = 2 × 13 and 91 = 7 × 13, so the HCF is 13.'],
          modelAnswer: '13',
        },
      },
      {
        variantKey: 'b',
        params: { a: 510, b: 92 },
        statement: 'The HCF of 510 and 92 is:',
        answerKey: {
          options: ['2', '4', '6', '8'],
          correctOptionIndex: 0,
          valuePoints: ['510 = 2 × 3 × 5 × 17 and 92 = 2² × 23, so the HCF is 2.'],
          modelAnswer: '2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-rn-lcm-hcf-mcq-2',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-fundamental-theorem-of-arithmetic',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { a: 306, b: 657, hcf: 9 },
        statement: 'Given that HCF (306, 657) = 9, the LCM (306, 657) is:',
        answerKey: {
          options: ['2210', '22338', '22328', '2218'],
          correctOptionIndex: 1,
          valuePoints: ['LCM = (306 × 657) ÷ 9 = 201042 ÷ 9 = 22338.'],
          modelAnswer: '22338',
        },
      },
      {
        variantKey: 'b',
        params: { a: 144, b: 180, hcf: 36 },
        statement: 'Given that HCF (144, 180) = 36, the LCM (144, 180) is:',
        answerKey: {
          options: ['720', '640', '900', '1440'],
          correctOptionIndex: 0,
          valuePoints: ['LCM = (144 × 180) ÷ 36 = 25920 ÷ 36 = 720.'],
          modelAnswer: '720',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-rn-prime-factorisation-sa-1',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-fundamental-theorem-of-arithmetic',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { numbers: '12, 15, 21' },
        statement: 'Find the LCM and HCF of 12, 15 and 21 by the prime factorisation method.',
        answerKey: {
          valuePoints: [
            '12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7',
            'HCF = 3 and LCM = 2² × 3 × 5 × 7 = 420',
          ],
          modelAnswer:
            '12 = 2² × 3, 15 = 3 × 5, 21 = 3 × 7. HCF = 3 (common prime powers). ' +
            'LCM = 2² × 3 × 5 × 7 = 420.',
        },
      },
      {
        variantKey: 'b',
        params: { numbers: '6, 72, 120' },
        statement: 'Find the LCM and HCF of 6, 72 and 120 by the prime factorisation method.',
        answerKey: {
          valuePoints: [
            '6 = 2 × 3, 72 = 2³ × 3², 120 = 2³ × 3 × 5',
            'HCF = 2 × 3 = 6 and LCM = 2³ × 3² × 5 = 360',
          ],
          modelAnswer:
            '6 = 2 × 3, 72 = 2³ × 3², 120 = 2³ × 3 × 5. HCF = 2 × 3 = 6. ' +
            'LCM = 2³ × 3² × 5 = 360.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-rn-composite-sa-1',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-fundamental-theorem-of-arithmetic',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { expression: '7 × 11 × 13 + 13' },
        statement: 'Explain why 7 × 11 × 13 + 13 is a composite number.',
        answerKey: {
          valuePoints: [
            '7 × 11 × 13 + 13 = 13 (7 × 11 + 1) = 13 × 78',
            'It has factors other than 1 and itself, so it is composite.',
          ],
          modelAnswer:
            '7 × 11 × 13 + 13 = 13 (7 × 11 + 1) = 13 × 78. Since it is a product of ' +
            'two numbers greater than 1, it has more than two factors and is composite.',
        },
      },
      {
        variantKey: 'b',
        params: { expression: '7 × 6 × 5 × 4 × 3 × 2 × 1 + 5' },
        statement: 'Explain why 7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 is a composite number.',
        answerKey: {
          valuePoints: [
            '7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 = 5 (7 × 6 × 4 × 3 × 2 × 1 + 1) = 5 × 1009',
            'It has factors other than 1 and itself, so it is composite.',
          ],
          modelAnswer:
            '7 × 6 × 5 × 4 × 3 × 2 × 1 + 5 = 5 (7 × 6 × 4 × 3 × 2 × 1 + 1) = 5 × 1009. ' +
            'As a product of two numbers greater than 1, it is composite.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-rn-irrational-proof-3',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-irrationality-proofs',
    questionType: 'proof',
    marks: 3,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { number: '√5' },
        statement: 'Prove that √5 is irrational.',
        answerKey: {
          valuePoints: [
            'Assume √5 = p/q where p and q are coprime integers, q ≠ 0',
            'Squaring gives 5q² = p², so 5 divides p² and hence p; write p = 5k',
            'Then 5q² = 25k² gives q² = 5k², so 5 divides q — contradiction to coprime assumption',
          ],
          modelAnswer:
            'Assume √5 = p/q with p, q coprime integers and q ≠ 0. Squaring: 5q² = p². ' +
            'So 5 divides p², hence 5 divides p; write p = 5k. Then 5q² = 25k², so q² = 5k², ' +
            'hence 5 divides q. This contradicts that p and q are coprime. Therefore √5 is irrational.',
        },
      },
      {
        variantKey: 'b',
        params: { number: '√3' },
        statement: 'Prove that √3 is irrational.',
        answerKey: {
          valuePoints: [
            'Assume √3 = p/q where p and q are coprime integers, q ≠ 0',
            'Squaring gives 3q² = p², so 3 divides p² and hence p; write p = 3k',
            'Then 3q² = 9k² gives q² = 3k², so 3 divides q — contradiction to coprime assumption',
          ],
          modelAnswer:
            'Assume √3 = p/q with p, q coprime integers and q ≠ 0. Squaring: 3q² = p². ' +
            'So 3 divides p², hence 3 divides p; write p = 3k. Then 3q² = 9k², so q² = 3k², ' +
            'hence 3 divides q — contradicting coprimality. Therefore √3 is irrational.',
        },
      },
    ],
  }),

  // ── Unit 2 · Algebra (20 marks) ────────────────────────────────────────────
  q({
    bankKey: 'maths-041-poly-zeroes-mcq-1',
    chapterSlug: 'polynomials',
    unitId: 'algebra',
    topicId: 'polynomials-zeroes',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { polynomial: 'x² − 3x − 4', knownZero: 4 },
        statement: 'If one zero of the polynomial p(x) = x² − 3x − 4 is 4, then the other zero is:',
        answerKey: {
          options: ['−1', '1', '−4', '4'],
          correctOptionIndex: 0,
          valuePoints: ['x² − 3x − 4 = (x − 4)(x + 1), so the zeroes are 4 and −1.'],
          modelAnswer: '−1',
        },
      },
      {
        variantKey: 'b',
        params: { polynomial: 'x² − 5x + 6', knownZero: 2 },
        statement: 'If one zero of the polynomial p(x) = x² − 5x + 6 is 2, then the other zero is:',
        answerKey: {
          options: ['3', '−3', '1', '6'],
          correctOptionIndex: 0,
          valuePoints: ['x² − 5x + 6 = (x − 2)(x − 3), so the zeroes are 2 and 3.'],
          modelAnswer: '3',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-lin-consistency-mcq-1',
    chapterSlug: 'pair-of-linear-equations-in-two-variables',
    unitId: 'algebra',
    topicId: 'linear-pairs-number-of-solutions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { k: 3 },
        statement: 'For which value of k will the pair of equations kx + y = 2 and 6x + 2y = 3 have no solution?',
        answerKey: {
          options: ['3', '2', '1', '4'],
          correctOptionIndex: 0,
          valuePoints: [
            'No solution requires a₁/a₂ = b₁/b₂ ≠ c₁/c₂: k/6 = 1/2 gives k = 3, and 2/3 ≠ 1/2.',
          ],
          modelAnswer: 'k = 3',
        },
      },
      {
        variantKey: 'b',
        params: { k: 1 },
        statement: 'For which value of k will the pair of equations kx + 2y = 5 and 3x + 6y = 8 have no solution?',
        answerKey: {
          options: ['1', '2', '3', '6'],
          correctOptionIndex: 0,
          valuePoints: [
            'No solution requires k/3 = 2/6 ≠ 5/8; k/3 = 1/3 gives k = 1, and 5/8 ≠ 1/3.',
          ],
          modelAnswer: 'k = 1',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-quad-discriminant-mcq-1',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-discriminant',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: '2x² − 4x + 3 = 0' },
        statement: 'The nature of the roots of 2x² − 4x + 3 = 0 is:',
        answerKey: {
          options: ['Real and equal', 'Real and distinct', 'Not real', 'One real and one non-real'],
          correctOptionIndex: 2,
          valuePoints: ['Discriminant = (−4)² − 4 × 2 × 3 = 16 − 24 = −8 < 0, so roots are not real.'],
          modelAnswer: 'Not real',
        },
      },
      {
        variantKey: 'b',
        params: { equation: 'x² − 6x + 9 = 0' },
        statement: 'The nature of the roots of x² − 6x + 9 = 0 is:',
        answerKey: {
          options: ['Real and equal', 'Real and distinct', 'Not real', 'Cannot be determined'],
          correctOptionIndex: 0,
          valuePoints: ['Discriminant = (−6)² − 4 × 1 × 9 = 36 − 36 = 0, so roots are real and equal.'],
          modelAnswer: 'Real and equal',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-ap-motivation-mcq-1',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-motivation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sequence: '3, 6, 9, 12' },
        statement: 'Which of the following lists of numbers is an arithmetic progression?',
        answerKey: {
          options: ['1, 3, 9, 27', '2, 4, 8, 16', '3, 6, 9, 12', '1, 1, 2, 3'],
          correctOptionIndex: 2,
          valuePoints: ['3, 6, 9, 12 has the common difference 3.'],
          modelAnswer: '3, 6, 9, 12',
        },
      },
      {
        variantKey: 'b',
        params: { sequence: '2, 2, 2, 2' },
        statement: 'Which of the following lists of numbers is an arithmetic progression?',
        answerKey: {
          options: ['1, 4, 9, 16', '2, 2, 2, 2', '1, 2, 4, 8', '5, 7, 10, 14'],
          correctOptionIndex: 1,
          valuePoints: ['2, 2, 2, 2 has the common difference 0.'],
          modelAnswer: '2, 2, 2, 2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-lin-graphical-mcq-1',
    chapterSlug: 'pair-of-linear-equations-in-two-variables',
    unitId: 'algebra',
    topicId: 'linear-pairs-graphical-solution',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equations: 'x = y and x + y = 0' },
        statement: 'The lines x = y and x + y = 0 intersect at the point:',
        answerKey: {
          options: ['(1, 0)', '(0, 1)', '(0, 0)', '(1, 1)'],
          correctOptionIndex: 2,
          valuePoints: ['Substituting x = y into x + y = 0 gives 2x = 0, so the point is (0, 0).'],
          modelAnswer: '(0, 0)',
        },
      },
      {
        variantKey: 'b',
        params: { equations: 'x = 0 and y = 0' },
        statement: 'The pair of linear equations x = 0 and y = 0 represents:',
        answerKey: {
          options: ['Intersecting lines at the origin', 'Parallel lines', 'Coincident lines', 'Perpendicular but non-intersecting lines'],
          correctOptionIndex: 0,
          valuePoints: ['x = 0 is the y-axis and y = 0 is the x-axis; they intersect at (0, 0).'],
          modelAnswer: 'Intersecting lines at the origin',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-poly-coeff-sa-1',
    chapterSlug: 'polynomials',
    unitId: 'algebra',
    topicId: 'polynomials-zeroes-coefficients-quadratic',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { zeroes: [3, -5] },
        statement: 'Find a quadratic polynomial whose zeroes are 3 and −5.',
        answerKey: {
          valuePoints: [
            'Sum of zeroes = 3 + (−5) = −2 and product = 3 × (−5) = −15',
            'Required polynomial = x² − (sum)x + product = x² + 2x − 15',
          ],
          modelAnswer:
            'Sum = 3 + (−5) = −2, product = −15. The polynomial is ' +
            'x² − (sum)x + product = x² + 2x − 15.',
        },
      },
      {
        variantKey: 'b',
        params: { zeroes: [2, -3] },
        statement: 'Find a quadratic polynomial whose zeroes are 2 and −3.',
        answerKey: {
          valuePoints: [
            'Sum of zeroes = 2 + (−3) = −1 and product = 2 × (−3) = −6',
            'Required polynomial = x² − (sum)x + product = x² + x − 6',
          ],
          modelAnswer:
            'Sum = −1, product = −6. The polynomial is x² − (−1)x + (−6) = x² + x − 6.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-lin-substitution-sa-2',
    chapterSlug: 'pair-of-linear-equations-in-two-variables',
    unitId: 'algebra',
    topicId: 'linear-pairs-substitution-elimination',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equations: 'x + y = 5; x − y = 1' },
        statement: 'Solve the pair of equations x + y = 5 and x − y = 1 by the substitution method.',
        answerKey: {
          valuePoints: ['From x + y = 5, x = 5 − y', 'Substitute into x − y = 1: 5 − 2y = 1 gives y = 2 and x = 3'],
          modelAnswer:
            'x = 5 − y. Then (5 − y) − y = 1, so 5 − 2y = 1, giving y = 2 and x = 3.',
        },
      },
      {
        variantKey: 'b',
        params: { equations: 'x + y = 7; x − y = 3' },
        statement: 'Solve the pair of equations x + y = 7 and x − y = 3 by the substitution method.',
        answerKey: {
          valuePoints: ['From x + y = 7, x = 7 − y', 'Substitute into x − y = 3: 7 − 2y = 3 gives y = 2 and x = 5'],
          modelAnswer:
            'x = 7 − y. Then (7 − y) − y = 3, so 7 − 2y = 3, giving y = 2 and x = 5.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-quad-factorise-sa-2',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-factorisation',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: 'x² − 9x + 20 = 0' },
        statement: 'Solve x² − 9x + 20 = 0 by factorisation.',
        answerKey: {
          valuePoints: ['x² − 9x + 20 = (x − 4)(x − 5) = 0', 'x = 4 or x = 5'],
          modelAnswer: '(x − 4)(x − 5) = 0, so x = 4 or x = 5.',
        },
      },
      {
        variantKey: 'b',
        params: { equation: 'x² − 5x + 6 = 0' },
        statement: 'Solve x² − 5x + 6 = 0 by factorisation.',
        answerKey: {
          valuePoints: ['x² − 5x + 6 = (x − 2)(x − 3) = 0', 'x = 2 or x = 3'],
          modelAnswer: '(x − 2)(x − 3) = 0, so x = 2 or x = 3.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-ap-nth-sa-2',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-nth-term',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { ap: '2, 7, 12', n: 10 },
        statement: 'Find the 10th term of the AP: 2, 7, 12, …',
        answerKey: {
          valuePoints: ['First term a = 2, common difference d = 5', 'a₁₀ = 2 + 9 × 5 = 47'],
          modelAnswer: 'a = 2, d = 5. a₁₀ = a + 9d = 2 + 45 = 47.',
        },
      },
      {
        variantKey: 'b',
        params: { ap: '3, 8, 13', n: 10 },
        statement: 'Find the 10th term of the AP: 3, 8, 13, …',
        answerKey: {
          valuePoints: ['First term a = 3, common difference d = 5', 'a₁₀ = 3 + 9 × 5 = 48'],
          modelAnswer: 'a = 3, d = 5. a₁₀ = a + 9d = 3 + 45 = 48.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-quad-formula-sa-3',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-formula',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: '2x² − 7x + 3 = 0' },
        statement: 'Find the roots of 2x² − 7x + 3 = 0 using the quadratic formula.',
        answerKey: {
          valuePoints: [
            'x = [7 ± √(49 − 24)] / 4 = [7 ± 5] / 4',
            'x = (7 + 5)/4 = 3 and x = (7 − 5)/4 = 1/2',
          ],
          modelAnswer:
            'x = [7 ± √((−7)² − 4×2×3)] / (2×2) = [7 ± √25] / 4 = [7 ± 5] / 4. ' +
            'So x = 3 or x = 1/2.',
        },
      },
      {
        variantKey: 'b',
        params: { equation: '2x² − 5x + 2 = 0' },
        statement: 'Find the roots of 2x² − 5x + 2 = 0 using the quadratic formula.',
        answerKey: {
          valuePoints: [
            'x = [5 ± √(25 − 16)] / 4 = [5 ± 3] / 4',
            'x = (5 + 3)/4 = 2 and x = (5 − 3)/4 = 1/2',
          ],
          modelAnswer:
            'x = [5 ± √((−5)² − 4×2×2)] / (2×2) = [5 ± √9] / 4 = [5 ± 3] / 4. ' +
            'So x = 2 or x = 1/2.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-ap-sum-sa-3',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-sum',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { ap: '1, 4, 7, 10, …', n: 20 },
        statement: 'Find the sum of the first 20 terms of the AP: 1, 4, 7, 10, …',
        answerKey: {
          valuePoints: ['a = 1, d = 3', 'S₂₀ = (20/2)[2 × 1 + 19 × 3] = 10 × 59 = 590'],
          modelAnswer:
            'a = 1, d = 3. S₂₀ = (20/2)(2a + 19d) = 10(2 + 57) = 590.',
        },
      },
      {
        variantKey: 'b',
        params: { ap: '2, 5, 8, 11, …', n: 15 },
        statement: 'Find the sum of the first 15 terms of the AP: 2, 5, 8, 11, …',
        answerKey: {
          valuePoints: ['a = 2, d = 3', 'S₁₅ = (15/2)[2 × 2 + 14 × 3] = (15/2) × 46 = 345'],
          modelAnswer:
            'a = 2, d = 3. S₁₅ = (15/2)(2a + 14d) = (15/2)(4 + 42) = 345.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-lin-situational-la-5',
    chapterSlug: 'pair-of-linear-equations-in-two-variables',
    unitId: 'algebra',
    topicId: 'linear-pairs-situational-problems',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sum: 9, difference: 27 },
        statement:
          'The sum of the digits of a two-digit number is 9. The number obtained by reversing its digits is 27 less than the original number. Find the number.',
        answerKey: {
          valuePoints: [
            'Let the tens digit be x and the units digit be y: x + y = 9',
            'Original number = 10x + y, reversed number = 10y + x; (10x + y) − (10y + x) = 27 gives x − y = 3',
            'Solving gives x = 6 and y = 3, so the number is 63',
          ],
          modelAnswer:
            'x + y = 9 and (10x + y) − (10y + x) = 27, i.e. 9x − 9y = 27, so x − y = 3. ' +
            'Solving x + y = 9 and x − y = 3 gives x = 6, y = 3. The number is 63.',
        },
      },
      {
        variantKey: 'b',
        params: { sum: 11, difference: 9 },
        statement:
          'The sum of the digits of a two-digit number is 11. The number obtained by reversing its digits is 9 less than the original number. Find the number.',
        answerKey: {
          valuePoints: [
            'Let the tens digit be x and the units digit be y: x + y = 11',
            '(10x + y) − (10y + x) = 9 gives x − y = 1',
            'Solving gives x = 6 and y = 5, so the number is 65',
          ],
          modelAnswer:
            'x + y = 11 and (10x + y) − (10y + x) = 9, i.e. x − y = 1. ' +
            'Solving gives x = 6, y = 5. The number is 65.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-quad-situational-la-5',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-situational-problems',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { product: 306 },
        statement: 'The product of two consecutive positive integers is 306. Find the integers.',
        answerKey: {
          valuePoints: [
            'Let the integers be n and n + 1: n(n + 1) = 306',
            'n² + n − 306 = 0 = (n − 17)(n + 18), so n = 17 (positive)',
            'The integers are 17 and 18',
          ],
          modelAnswer:
            'n(n + 1) = 306 ⇒ n² + n − 306 = 0 ⇒ (n − 17)(n + 18) = 0. Since n > 0, n = 17. ' +
            'The integers are 17 and 18.',
        },
      },
      {
        variantKey: 'b',
        params: { product: 420 },
        statement: 'The product of two consecutive positive integers is 420. Find the integers.',
        answerKey: {
          valuePoints: [
            'Let the integers be n and n + 1: n(n + 1) = 420',
            'n² + n − 420 = 0 = (n + 21)(n − 20), so n = 20 (positive)',
            'The integers are 20 and 21',
          ],
          modelAnswer:
            'n(n + 1) = 420 ⇒ n² + n − 420 = 0 ⇒ (n + 21)(n − 20) = 0. Since n > 0, n = 20. ' +
            'The integers are 20 and 21.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-ap-application-la-5',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-applications',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { spacing: 25, bottom: 45, top: 25, spanCm: 250 },
        statement:
          'A ladder has rungs 25 cm apart. The rungs decrease uniformly in length from 45 cm at the bottom to 25 cm at the top. If the top and bottom rungs are 2.5 m apart, find the total length of the wood required for the rungs.',
        answerKey: {
          valuePoints: [
            'Number of rungs = 250/25 + 1 = 11',
            'Rung lengths form the AP 45, 43, 41, …, 25 (11 terms)',
            'Total length = (11/2)(45 + 25) = 11 × 35 = 385 cm',
          ],
          modelAnswer:
            'Distance 2.5 m = 250 cm gives 11 rungs (250/25 + 1). The lengths form the AP with ' +
            'a = 45, l = 25, n = 11. Total = (11/2)(45 + 25) = 385 cm.',
        },
      },
      {
        variantKey: 'b',
        params: { sumN: '3n² + 5n' },
        statement:
          'The sum of the first n terms of an AP is 3n² + 5n. Find the nth term of the AP.',
        answerKey: {
          valuePoints: [
            'aₙ = Sₙ − Sₙ₋₁',
            'Sₙ₋₁ = 3(n − 1)² + 5(n − 1) = 3n² − n − 2',
            'aₙ = (3n² + 5n) − (3n² − n − 2) = 6n + 2',
          ],
          modelAnswer:
            'aₙ = Sₙ − Sₙ₋₁. Sₙ₋₁ = 3(n − 1)² + 5(n − 1) = 3n² − n − 2. ' +
            'So aₙ = (3n² + 5n) − (3n² − n − 2) = 6n + 2.',
        },
      },
    ],
  }),

  q({
    bankKey: 'maths-041-poly-zeroes-verify-sa-3',
    chapterSlug: 'polynomials',
    unitId: 'algebra',
    topicId: 'polynomials-zeroes-coefficients-quadratic',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { polynomial: '6x² − 7x − 3' },
        statement:
          'Find the zeroes of the polynomial 6x² − 7x − 3 and verify the relationship between the zeroes and the coefficients.',
        answerKey: {
          valuePoints: [
            '6x² − 7x − 3 = (3x + 1)(2x − 3), so the zeroes are −1/3 and 3/2',
            'Sum = −1/3 + 3/2 = 7/6 = −b/a ✓ and product = −1/2 = c/a ✓',
          ],
          modelAnswer:
            '6x² − 7x − 3 = (3x + 1)(2x − 3) gives zeroes −1/3 and 3/2. Sum = 7/6 = −b/a; ' +
            'product = −1/2 = c/a. Relationship verified.',
        },
      },
      {
        variantKey: 'b',
        params: { polynomial: '4x² − 4x + 1' },
        statement:
          'Find the zeroes of the polynomial 4x² − 4x + 1 and verify the relationship between the zeroes and the coefficients.',
        answerKey: {
          valuePoints: [
            '4x² − 4x + 1 = (2x − 1)², so the zeroes are 1/2 and 1/2',
            'Sum = 1 = −b/a ✓ and product = 1/4 = c/a ✓',
          ],
          modelAnswer:
            '4x² − 4x + 1 = (2x − 1)² gives zeroes 1/2 and 1/2. Sum = 1 = −b/a; ' +
            'product = 1/4 = c/a. Relationship verified.',
        },
      },
    ],
  }),

  // ── Unit 3 · Coordinate Geometry (6 marks) ─────────────────────────────────
  q({
    bankKey: 'maths-041-cg-distance-mcq-1',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-distance-formula',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { points: '(0, 0) and (3, 4)' },
        statement: 'The distance between the points (0, 0) and (3, 4) is:',
        answerKey: {
          options: ['7', '5', '1', '25'],
          correctOptionIndex: 1,
          valuePoints: ['√(3² + 4²) = √25 = 5.'],
          modelAnswer: '5',
        },
      },
      {
        variantKey: 'b',
        params: { points: '(0, 0) and (6, 8)' },
        statement: 'The distance between the points (0, 0) and (6, 8) is:',
        answerKey: {
          options: ['14', '10', '2', '100'],
          correctOptionIndex: 1,
          valuePoints: ['√(6² + 8²) = √100 = 10.'],
          modelAnswer: '10',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-midpoint-mcq-1',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-section-formula',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { points: '(2, 3) and (4, 7)' },
        statement: 'The midpoint of the line segment joining (2, 3) and (4, 7) is:',
        answerKey: {
          options: ['(3, 5)', '(6, 10)', '(2, 4)', '(3, 10)'],
          correctOptionIndex: 0,
          valuePoints: ['Midpoint = ((2 + 4)/2, (3 + 7)/2) = (3, 5).'],
          modelAnswer: '(3, 5)',
        },
      },
      {
        variantKey: 'b',
        params: { points: '(−2, 4) and (6, 8)' },
        statement: 'The midpoint of the line segment joining (−2, 4) and (6, 8) is:',
        answerKey: {
          options: ['(2, 6)', '(4, 12)', '(2, 4)', '(−2, 6)'],
          correctOptionIndex: 0,
          valuePoints: ['Midpoint = ((−2 + 6)/2, (4 + 8)/2) = (2, 6).'],
          modelAnswer: '(2, 6)',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-distance-sa-2',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-distance-formula',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { points: '(2, 3) and (4, 1)' },
        statement: 'Find the distance between the points (2, 3) and (4, 1).',
        answerKey: {
          valuePoints: ['Distance = √((4 − 2)² + (1 − 3)²)', '= √(4 + 4) = 2√2 units'],
          modelAnswer: '√((4 − 2)² + (1 − 3)²) = √(4 + 4) = 2√2 units.',
        },
      },
      {
        variantKey: 'b',
        params: { points: '(−2, 3) and (4, 1)' },
        statement: 'Find the distance between the points (−2, 3) and (4, 1).',
        answerKey: {
          valuePoints: ['Distance = √((4 − (−2))² + (1 − 3)²)', '= √(36 + 4) = 2√10 units'],
          modelAnswer: '√(36 + 4) = 2√10 units.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-section-sa-2',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-section-formula',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { points: '(2, 3) and (4, 5)' },
        statement: 'Find the coordinates of the midpoint of the line segment joining (2, 3) and (4, 5).',
        answerKey: {
          valuePoints: ['Midpoint = ((2 + 4)/2, (3 + 5)/2)', '= (3, 4)'],
          modelAnswer: '((2 + 4)/2, (3 + 5)/2) = (3, 4).',
        },
      },
      {
        variantKey: 'b',
        params: { points: '(1, 7) and (5, 3)' },
        statement: 'Find the coordinates of the midpoint of the line segment joining (1, 7) and (5, 3).',
        answerKey: {
          valuePoints: ['Midpoint = ((1 + 5)/2, (7 + 3)/2)', '= (3, 5)'],
          modelAnswer: '((1 + 5)/2, (7 + 3)/2) = (3, 5).',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-section-num-3',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-section-formula',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { points: 'A(−2, 2) and B(2, 8)', ratio: '3 : 1' },
        statement:
          'Find the coordinates of the point which divides the line segment joining A(−2, 2) and B(2, 8) in the ratio 3 : 1.',
        answerKey: {
          valuePoints: [
            'Section formula: x = (3 × 2 + 1 × (−2)) / 4 = 1',
            'y = (3 × 8 + 1 × 2) / 4 = 13/2; the point is (1, 13/2)',
          ],
          modelAnswer:
            'x = (3×2 + 1×(−2))/(3+1) = 4/4 = 1; y = (3×8 + 1×2)/4 = 26/4 = 13/2. ' +
            'The point is (1, 13/2).',
        },
      },
      {
        variantKey: 'b',
        params: { points: 'A(−2, 2) and B(2, 8)', ratio: '2 : 1' },
        statement:
          'Find the coordinates of the point which divides the line segment joining A(−2, 2) and B(2, 8) in the ratio 2 : 1.',
        answerKey: {
          valuePoints: [
            'x = (2 × 2 + 1 × (−2)) / 3 = 2/3',
            'y = (2 × 8 + 1 × 2) / 3 = 6; the point is (2/3, 6)',
          ],
          modelAnswer:
            'x = (2×2 + 1×(−2))/3 = 2/3; y = (2×8 + 1×2)/3 = 18/3 = 6. The point is (2/3, 6).',
        },
      },
    ],
  }),

  // ── Unit 4 · Geometry (15 marks) ───────────────────────────────────────────
  q({
    bankKey: 'maths-041-tri-similarity-mcq-1',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-similarity-concepts',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { figures: 'squares' },
        statement: 'Which of the following figures are always similar?',
        answerKey: {
          options: ['Two squares', 'Two rectangles', 'Two triangles', 'Two quadrilaterals'],
          correctOptionIndex: 0,
          valuePoints: ['All squares have equal angles and proportional sides, so any two squares are similar.'],
          modelAnswer: 'Two squares',
        },
      },
      {
        variantKey: 'b',
        params: { figures: 'circles' },
        statement: 'Which of the following pairs of figures are always similar?',
        answerKey: {
          options: ['Two circles', 'Two rectangles', 'Two isosceles triangles', 'Two rhombuses'],
          correctOptionIndex: 0,
          valuePoints: ['All circles have the same shape, so any two circles are similar.'],
          modelAnswer: 'Two circles',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-area-ratio-mcq-1',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-similarity-criteria',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sides: 'AB = 4 cm, DE = 6 cm' },
        statement:
          'If ΔABC ~ ΔDEF such that AB = 4 cm and DE = 6 cm, then the ratio of the area of ΔABC to the area of ΔDEF is:',
        answerKey: {
          options: ['4 : 9', '2 : 3', '16 : 9', '4 : 6'],
          correctOptionIndex: 0,
          valuePoints: ['Areas of similar triangles are in the ratio of the squares of corresponding sides: 16 : 36 = 4 : 9.'],
          modelAnswer: '4 : 9',
        },
      },
      {
        variantKey: 'b',
        params: { sides: 'AB = 2 cm, DE = 5 cm' },
        statement:
          'If ΔABC ~ ΔDEF such that AB = 2 cm and DE = 5 cm, then the ratio of the area of ΔABC to the area of ΔDEF is:',
        answerKey: {
          options: ['4 : 25', '2 : 5', '25 : 4', '4 : 10'],
          correctOptionIndex: 0,
          valuePoints: ['Area ratio = 2² : 5² = 4 : 25.'],
          modelAnswer: '4 : 25',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-tangents-mcq-1',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-tangent-point-of-contact',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { point: 'external' },
        statement: 'The number of tangents that can be drawn from an external point to a circle is:',
        answerKey: {
          options: ['1', '2', '3', 'Infinite'],
          correctOptionIndex: 1,
          valuePoints: ['Exactly two tangents can be drawn from an external point.'],
          modelAnswer: '2',
        },
      },
      {
        variantKey: 'b',
        params: { point: 'on the circle' },
        statement: 'A tangent to a circle touches it at exactly:',
        answerKey: {
          options: ['One point', 'Two points', 'Three points', 'No point'],
          correctOptionIndex: 0,
          valuePoints: ['A tangent meets the circle at exactly one point of contact.'],
          modelAnswer: 'One point',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-radius-mcq-1',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-radius-perpendicular-tangent',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 5, oq: 13 },
        statement:
          'A tangent PQ at a point P of a circle of radius 5 cm meets a line through the centre O at point Q such that OQ = 13 cm. The length PQ is:',
        answerKey: {
          options: ['12 cm', '8 cm', '10 cm', '13 cm'],
          correctOptionIndex: 0,
          valuePoints: ['∠OPQ = 90°, so PQ = √(13² − 5²) = √144 = 12 cm.'],
          modelAnswer: '12 cm',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 6, oq: 10 },
        statement:
          'A tangent PQ at a point P of a circle of radius 6 cm meets a line through the centre O at point Q such that OQ = 10 cm. The length PQ is:',
        answerKey: {
          options: ['8 cm', '4 cm', '6 cm', '10 cm'],
          correctOptionIndex: 0,
          valuePoints: ['PQ = √(10² − 6²) = √64 = 8 cm.'],
          modelAnswer: '8 cm',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-bpt-sa-2',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-basic-proportionality-theorem',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { ad: 1.5, db: 3, ae: 2 },
        statement:
          'In ΔABC, DE ∥ BC, with D on AB and E on AC. If AD = 1.5 cm, DB = 3 cm and AE = 2 cm, find EC.',
        answerKey: {
          valuePoints: ['By BPT, AD/DB = AE/EC', '1.5/3 = 2/EC gives EC = 4 cm'],
          modelAnswer: 'AD/DB = AE/EC ⇒ 1.5/3 = 2/EC ⇒ EC = 4 cm.',
        },
      },
      {
        variantKey: 'b',
        params: { ad: 2, db: 4, ae: 3 },
        statement:
          'In ΔABC, DE ∥ BC, with D on AB and E on AC. If AD = 2 cm, DB = 4 cm and AE = 3 cm, find EC.',
        answerKey: {
          valuePoints: ['By BPT, AD/DB = AE/EC', '2/4 = 3/EC gives EC = 6 cm'],
          modelAnswer: '2/4 = 3/EC ⇒ EC = 6 cm.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-tangent-sa-2',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-radius-perpendicular-tangent',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { theorem: 'tangent-radius' },
        statement:
          'Prove that the tangent at any point of a circle is perpendicular to the radius through the point of contact.',
        answerKey: {
          valuePoints: [
            'Let O be the centre, P the point of contact and t the tangent',
            'Every other point Q on t lies outside the circle, so OQ > OP; hence OP is the shortest distance to t and OP ⊥ t',
          ],
          modelAnswer:
            'Let O be the centre and P the point of contact on tangent t. For any other point Q on t, ' +
            'OQ > OP because Q lies outside the circle. So OP is the shortest segment from O to t, ' +
            'which means OP ⊥ t.',
        },
      },
      {
        variantKey: 'b',
        params: { theorem: 'tangent-radius' },
        statement:
          'Show that the tangent drawn at any point of a circle is perpendicular to the radius drawn to the point of contact.',
        answerKey: {
          valuePoints: [
            'Point of contact P lies on the circle; any other point on the tangent is outside it',
            'The radius OP is therefore the shortest distance from the centre to the tangent line, so OP ⊥ tangent',
          ],
          modelAnswer:
            'Every point of the tangent except P is outside the circle, so its distance from O exceeds OP. ' +
            'Hence OP is the shortest distance from O to the tangent, so the tangent is perpendicular to OP.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-bpt-mcq-1',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-basic-proportionality-theorem',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { ad: 2, db: 4 },
        statement:
          'In ΔABC, D and E are points on AB and AC respectively such that DE ∥ BC. If AD = 2 cm and DB = 4 cm, then AE : EC is:',
        answerKey: {
          options: ['1 : 2', '2 : 1', '1 : 1', '2 : 3'],
          correctOptionIndex: 0,
          valuePoints: ['By BPT, AE/EC = AD/DB = 2/4 = 1 : 2.'],
          modelAnswer: '1 : 2',
        },
      },
      {
        variantKey: 'b',
        params: { ad: 3, db: 6, ae: 2 },
        statement:
          'In ΔABC, DE ∥ BC with D on AB and E on AC. If AD = 3 cm, DB = 6 cm and AE = 2 cm, the length EC is:',
        answerKey: {
          options: ['4 cm', '1 cm', '6 cm', '3 cm'],
          correctOptionIndex: 0,
          valuePoints: ['AD/DB = AE/EC gives 3/6 = 2/EC, so EC = 4 cm.'],
          modelAnswer: '4 cm',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-bpt-proof-3',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-basic-proportionality-theorem',
    questionType: 'proof',
    marks: 3,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { theorem: 'BPT' },
        statement:
          'State and prove the Basic Proportionality Theorem: if a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.',
        answerKey: {
          valuePoints: [
            'In ΔABC, DE ∥ BC with D on AB and E on AC; to prove AD/DB = AE/EC',
            'Join BE and CD; areas: ar(ADE)/ar(BDE) = AD/DB and ar(ADE)/ar(CDE) = AE/EC',
            'ar(BDE) = ar(CDE) (same base DE, same height), so AD/DB = AE/EC',
          ],
          modelAnswer:
            'In ΔABC, DE ∥ BC. Draw BE and CD. Triangles BDE and CDE have the same base DE and equal heights ' +
            '(both lie between parallels DE and BC), so ar(BDE) = ar(CDE). Also ' +
            'ar(ADE)/ar(BDE) = AD/DB and ar(ADE)/ar(CDE) = AE/EC. Equating gives AD/DB = AE/EC.',
        },
      },
      {
        variantKey: 'b',
        params: { theorem: 'converse BPT' },
        statement:
          'State and prove the converse of the Basic Proportionality Theorem: if a line divides any two sides of a triangle in the same ratio, the line is parallel to the third side.',
        answerKey: {
          valuePoints: [
            'In ΔABC, D on AB and E on AC with AD/DB = AE/EC; to prove DE ∥ BC',
            'Assume DE not parallel to BC; draw DE′ ∥ BC meeting AC at E′',
            'By BPT, AD/DB = AE′/E′C = AE/EC, so E′ = E; hence DE ∥ BC',
          ],
          modelAnswer:
            'Suppose DE is not parallel to BC. Draw DE′ ∥ BC with E′ on AC. Then by BPT, ' +
            'AD/DB = AE′/E′C. Given AD/DB = AE/EC, we get AE′/E′C = AE/EC, so E′ = E. ' +
            'Hence DE ∥ BC.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-criteria-sa-3',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-similarity-criteria',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { ab: 6, bc: 8, pq: 9 },
        statement:
          'In ΔABC and ΔPQR, ∠A = ∠P and ∠B = ∠Q. If AB = 6 cm, BC = 8 cm and PQ = 9 cm, find QR.',
        answerKey: {
          valuePoints: ['ΔABC ~ ΔPQR by AA similarity', 'AB/PQ = BC/QR gives 6/9 = 8/QR', 'QR = 12 cm'],
          modelAnswer: 'By AA, ΔABC ~ ΔPQR. So AB/PQ = BC/QR ⇒ 6/9 = 8/QR ⇒ QR = 12 cm.',
        },
      },
      {
        variantKey: 'b',
        params: { ab: 4, bc: 5, pq: 10 },
        statement:
          'In ΔABC and ΔPQR, ∠A = ∠P and ∠B = ∠Q. If AB = 4 cm, BC = 5 cm and PQ = 10 cm, find QR.',
        answerKey: {
          valuePoints: ['ΔABC ~ ΔPQR by AA similarity', 'AB/PQ = BC/QR gives 4/10 = 5/QR', 'QR = 12.5 cm'],
          modelAnswer: 'By AA, ΔABC ~ ΔPQR. So 4/10 = 5/QR ⇒ QR = 12.5 cm.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-equal-tangents-sa-3',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-equal-tangents',
    questionType: 'proof',
    marks: 3,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { theorem: 'equal tangents' },
        statement:
          'Prove that the lengths of the tangents drawn from an external point to a circle are equal.',
        answerKey: {
          valuePoints: [
            'Let P be external, PA and PB tangents with contact points A and B, O the centre',
            'OA ⊥ PA and OB ⊥ PB, with OA = OB = radius',
            'Right triangles OAP and OBP are congruent (RHS), so PA = PB',
          ],
          modelAnswer:
            'Join OP, OA, OB. OA ⊥ PA and OB ⊥ PB. In right triangles OAP and OBP, OA = OB (radii), ' +
            'OP is common, so ΔOAP ≅ ΔOBP by RHS. Hence PA = PB.',
        },
      },
      {
        variantKey: 'b',
        params: { theorem: 'equal tangents' },
        statement:
          'Two tangents TP and TQ are drawn to a circle with centre O from an external point T. Prove that TP = TQ.',
        answerKey: {
          valuePoints: [
            'OP ⊥ TP and OQ ⊥ TQ, with OP = OQ = radius',
            'Right triangles OPT and OQT share hypotenuse OT',
            'By RHS congruence ΔOPT ≅ ΔOQT, so TP = TQ',
          ],
          modelAnswer:
            'OP ⊥ TP, OQ ⊥ TQ, OP = OQ. In ΔOPT and ΔOQT, ∠OPT = ∠OQT = 90°, OP = OQ, OT is common. ' +
            'So ΔOPT ≅ ΔOQT (RHS) and TP = TQ.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-tangent-angle-sa-3',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-equal-tangents',
    questionType: 'proof',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement:
          'Two tangents TP and TQ are drawn to a circle with centre O from an external point T, touching the circle at P and Q. Prove that ∠PTQ + ∠POQ = 180°.',
        answerKey: {
          valuePoints: [
            '∠OPT = ∠OQT = 90° (tangent ⊥ radius)',
            'In quadrilateral OPTQ, sum of angles is 360°: ∠POQ + ∠PTQ + 90° + 90° = 360°',
            'Hence ∠POQ + ∠PTQ = 180°.',
          ],
          modelAnswer:
            'In quadrilateral OPTQ, ∠OPT = ∠OQT = 90°. So ∠POQ + ∠PTQ = 360° − 180° = 180°.',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement:
          'Two tangents TP and TQ are drawn to a circle with centre O from an external point T, touching the circle at P and Q. Prove that ∠PTQ and ∠POQ are supplementary.',
        answerKey: {
          valuePoints: [
            '∠OPT = ∠OQT = 90° (tangent ⊥ radius)',
            'In quadrilateral OPTQ, ∠POQ + ∠PTQ = 360° − 90° − 90° = 180°',
          ],
          modelAnswer: '∠POQ + ∠PTQ = 180°, so the two angles are supplementary.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-criteria-la-5',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-similarity-criteria',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { theorem: 'areas of similar triangles' },
        statement:
          'Prove that the ratio of the areas of two similar triangles is equal to the square of the ratio of their corresponding sides.',
        answerKey: {
          valuePoints: [
            'Take ΔABC ~ ΔPQR; draw altitudes AM and PN to bases BC and QR',
            'ar(ABC) = ½ × BC × AM and ar(PQR) = ½ × QR × PN, so ar(ABC)/ar(PQR) = (BC/QR) × (AM/PN)',
            'By similarity AM/PN = AB/PQ = BC/QR, giving ar(ABC)/ar(PQR) = (BC/QR)²',
          ],
          modelAnswer:
            'Draw altitudes AM and PN. ar(ABC)/ar(PQR) = (BC × AM)/(QR × PN) = (BC/QR)(AM/PN). ' +
            'Since ΔABC ~ ΔPQR, AM/PN = AB/PQ = BC/QR. Hence ' +
            'ar(ABC)/ar(PQR) = (BC/QR) × (BC/QR) = (BC/QR)².',
        },
      },
      {
        variantKey: 'b',
        params: { theorem: 'areas of similar triangles' },
        statement:
          'Prove that the areas of two similar triangles are in the ratio of the squares of their corresponding altitudes.',
        answerKey: {
          valuePoints: [
            'Let ΔABC ~ ΔPQR with altitudes AM and PN to the corresponding sides',
            'AM/PN = AB/PQ = BC/QR (similar triangles)',
            'ar(ABC)/ar(PQR) = (BC/QR)² = (AM/PN)²',
          ],
          modelAnswer:
            'For similar triangles, corresponding altitudes are in the same ratio as corresponding sides: ' +
            'AM/PN = BC/QR. Then ar(ABC)/ar(PQR) = (BC/QR)² = (AM/PN)².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-equal-tangents-la-5',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-equal-tangents',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { theorem: 'angle between tangents' },
        statement:
          'Prove that the angle between the two tangents drawn from an external point to a circle is supplementary to the angle subtended by the line-segment joining the points of contact at the centre.',
        answerKey: {
          valuePoints: [
            'Let P be external; PA and PB tangents touching at A and B; O the centre',
            '∠OAP = ∠OBP = 90°',
            'In quadrilateral OAPB, ∠APB + ∠AOB = 360° − 90° − 90° = 180°',
          ],
          modelAnswer:
            'OA ⊥ PA and OB ⊥ PB, so ∠OAP = ∠OBP = 90°. The angle sum of quadrilateral OAPB gives ' +
            '∠APB + ∠AOB = 360° − 180° = 180°. Hence the angle between the tangents and the angle at the ' +
            'centre are supplementary.',
        },
      },
      {
        variantKey: 'b',
        params: { radii: [5, 3] },
        statement:
          'Two concentric circles have radii 5 cm and 3 cm. Find the length of the chord of the larger circle which touches the smaller circle.',
        answerKey: {
          valuePoints: [
            'The chord of the larger circle is a tangent to the smaller circle',
            'Radius 3 cm to the chord is perpendicular and bisects it: half-chord = √(5² − 3²) = 4 cm',
            'Chord length = 2 × 4 = 8 cm',
          ],
          modelAnswer:
            'Let the chord AB of the larger circle touch the smaller circle at M. Then OM ⊥ AB and ' +
            'M is the midpoint. AM = √(OA² − OM²) = √(25 − 9) = 4 cm, so AB = 8 cm.',
        },
      },
    ],
  }),

  // ── Unit 5 · Trigonometry (12 marks) ───────────────────────────────────────
  q({
    bankKey: 'maths-041-trig-ratios-mcq-1',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-ratios',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sinA: '3/5' },
        statement: 'If sin A = 3/5, then cos A is:',
        answerKey: {
          options: ['3/5', '4/5', '5/4', '5/3'],
          correctOptionIndex: 1,
          valuePoints: ['cos A = √(1 − 9/25) = √(16/25) = 4/5.'],
          modelAnswer: '4/5',
        },
      },
      {
        variantKey: 'b',
        params: { sinA: '8/17' },
        statement: 'If sin A = 8/17, then cos A is:',
        answerKey: {
          options: ['8/15', '15/17', '17/15', '15/8'],
          correctOptionIndex: 1,
          valuePoints: ['cos A = √(1 − 64/289) = √(225/289) = 15/17.'],
          modelAnswer: '15/17',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-standard-mcq-1',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-standard-angles',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { angle: 'tan 60°' },
        statement: 'The value of tan 60° is:',
        answerKey: {
          options: ['1/√3', '1', '√3', '1/2'],
          correctOptionIndex: 2,
          valuePoints: ['tan 60° = √3 (standard value).'],
          modelAnswer: '√3',
        },
      },
      {
        variantKey: 'b',
        params: { angle: 'cos 0°' },
        statement: 'The value of cos 0° is:',
        answerKey: {
          options: ['0', '1', '1/2', '√3/2'],
          correctOptionIndex: 1,
          valuePoints: ['cos 0° = 1 (standard value).'],
          modelAnswer: '1',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-heights-mcq-1',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-elevation-depression',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { distance: 100, angle: 45 },
        statement:
          'From a point on the ground 100 m away from the foot of a tower, the angle of elevation of the top of the tower is 45°. The height of the tower is:',
        answerKey: {
          options: ['50 m', '100 m', '100√2 m', '100/√3 m'],
          correctOptionIndex: 1,
          valuePoints: ['h = 100 × tan 45° = 100 m.'],
          modelAnswer: '100 m',
        },
      },
      {
        variantKey: 'b',
        params: { distance: 60, angle: 45 },
        statement:
          'The angle of elevation of the top of a tower from a point 60 m away on the ground is 45°. The height of the tower is:',
        answerKey: {
          options: ['30 m', '60 m', '60√3 m', '120 m'],
          correctOptionIndex: 1,
          valuePoints: ['h = 60 × tan 45° = 60 m.'],
          modelAnswer: '60 m',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-identities-sa-2',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-identities',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: 'sin A + cos A = √2' },
        statement: 'If sin A + cos A = √2, find the value of sin A cos A.',
        answerKey: {
          valuePoints: ['(sin A + cos A)² = 2', 'sin²A + cos²A + 2 sin A cos A = 2, so 1 + 2 sin A cos A = 2', 'sin A cos A = 1/2'],
          modelAnswer:
            'Squaring: sin²A + cos²A + 2 sin A cos A = 2. Using sin²A + cos²A = 1 gives ' +
            '1 + 2 sin A cos A = 2, so sin A cos A = 1/2.',
        },
      },
      {
        variantKey: 'b',
        params: { equation: 'sin A + cos A = √(3/2)' },
        statement: 'If sin A + cos A = √(3/2), find the value of sin A cos A.',
        answerKey: {
          valuePoints: ['(sin A + cos A)² = 3/2', '1 + 2 sin A cos A = 3/2', 'sin A cos A = 1/4'],
          modelAnswer:
            'Squaring: 1 + 2 sin A cos A = 3/2, so sin A cos A = (3/2 − 1)/2 = 1/4.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-ratio-rel-sa-2',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-ratio-relations',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { expression: 'sin 30° + cos 60°' },
        statement: 'Evaluate: sin 30° + cos 60°.',
        answerKey: {
          valuePoints: ['sin 30° = 1/2 and cos 60° = 1/2', 'sin 30° + cos 60° = 1'],
          modelAnswer: '1/2 + 1/2 = 1.',
        },
      },
      {
        variantKey: 'b',
        params: { expression: 'tan 45° + cot 45°' },
        statement: 'Evaluate: tan 45° + cot 45°.',
        answerKey: {
          valuePoints: ['tan 45° = 1 and cot 45° = 1', 'tan 45° + cot 45° = 2'],
          modelAnswer: '1 + 1 = 2.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-heights-sa-3',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-elevation-depression',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { distance: 30, angle: 45 },
        statement:
          'The angle of elevation of the top of a tower from a point on the ground 30 m away from its foot is 45°. Find the height of the tower.',
        answerKey: {
          valuePoints: ['tan 45° = height/distance', 'height = 30 × tan 45° = 30 m'],
          modelAnswer: 'tan 45° = h/30 ⇒ h = 30 × 1 = 30 m.',
        },
      },
      {
        variantKey: 'b',
        params: { distance: 40, angle: 30 },
        statement:
          'The angle of elevation of the top of a tower from a point on the ground 40 m away from its foot is 30°. Find the height of the tower.',
        answerKey: {
          valuePoints: ['tan 30° = height/distance', 'height = 40 × tan 30° = 40/√3 m'],
          modelAnswer: 'tan 30° = h/40 ⇒ h = 40/√3 m.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-heights-la-5',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-two-triangles',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { height: 60, angle: 60 },
        statement:
          'A kite is flying at a height of 60 m above the ground. The string attached to the kite is temporarily tied to a point on the ground. The inclination of the string with the ground is 60°. Find the length of the string, assuming there is no slack in the string.',
        answerKey: {
          valuePoints: ['Let the string length be L; sin 60° = 60/L', 'L = 60 ÷ (√3/2) = 120/√3 = 40√3 m'],
          modelAnswer:
            'sin 60° = height/string = 60/L. So L = 60/(√3/2) = 120/√3 = 40√3 m.',
        },
      },
      {
        variantKey: 'b',
        params: { height: 45, angle: 30 },
        statement:
          'A kite is flying at a height of 45 m above the ground. The string is tied to a point on the ground and is inclined at 30° to the horizontal. Assuming no slack, find the length of the string.',
        answerKey: {
          valuePoints: ['sin 30° = 45/L', 'L = 45 ÷ (1/2) = 90 m'],
          modelAnswer: 'sin 30° = 45/L ⇒ L = 45/(1/2) = 90 m.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-case-4',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-elevation-depression',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { road: 80, angles: '60° and 30°' },
        statement:
          'Two poles of equal heights are standing opposite each other on either side of a road 80 m wide. From a point between them on the road, the angles of elevation of the tops of the poles are 60° and 30° respectively. (i) Find the height of the poles. (ii) Find the distance of the point from the pole on the 60° side. (iii) Find the distance of the point from the pole on the 30° side.',
        answerKey: {
          valuePoints: [
            'Let the point be at distance x from the 60° pole; then x + y = 80 and h = x tan 60° = y tan 30°',
            'x√3 = (80 − x)/√3 gives 3x = 80 − x, so x = 20 m and y = 60 m',
            'h = 20√3 m',
          ],
          modelAnswer:
            'h = x tan 60° = (80 − x) tan 30° ⇒ x√3 = (80 − x)/√3 ⇒ 3x = 80 − x ⇒ x = 20 m, ' +
            'y = 60 m, and h = 20√3 m.',
        },
      },
    ],
  }),

  // ── Unit 6 · Mensuration (10 marks) ────────────────────────────────────────
  q({
    bankKey: 'maths-041-arc-sector-mcq-1',
    chapterSlug: 'areas-related-to-circles',
    unitId: 'mensuration',
    topicId: 'areas-related-to-circles-sectors',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 21, angle: 90 },
        statement: 'The area of a sector of a circle of radius 21 cm with central angle 90° is:',
        answerKey: {
          options: ['346.5 cm²', '1386 cm²', '693 cm²', '173.25 cm²'],
          correctOptionIndex: 0,
          valuePoints: ['Area = (90/360) × (22/7) × 21² = (1/4) × 1386 = 346.5 cm².'],
          modelAnswer: '346.5 cm²',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 28, angle: 90 },
        statement: 'The area of a sector of a circle of radius 28 cm with central angle 90° is:',
        answerKey: {
          options: ['616 cm²', '2464 cm²', '1232 cm²', '308 cm²'],
          correctOptionIndex: 0,
          valuePoints: ['Area = (1/4) × (22/7) × 28² = (1/4) × 2464 = 616 cm².'],
          modelAnswer: '616 cm²',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-volume-mcq-1',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 7 },
        statement: 'The volume of a hemisphere of radius 7 cm is:',
        answerKey: {
          options: ['718.67 cm³', '1437.33 cm³', '1078 cm³', '616 cm³'],
          correctOptionIndex: 0,
          valuePoints: ['Volume = (2/3) × (22/7) × 7³ = (2/3) × 1078 = 718.67 cm³.'],
          modelAnswer: '718.67 cm³',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 3.5 },
        statement: 'The volume of a hemisphere of radius 3.5 cm is:',
        answerKey: {
          options: ['89.83 cm³', '179.67 cm³', '269.5 cm³', '44.92 cm³'],
          correctOptionIndex: 0,
          valuePoints: ['Volume = (2/3) × (22/7) × 3.5³ = 89.83 cm³.'],
          modelAnswer: '89.83 cm³',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-csa-mcq-1',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'surface-areas-combinations-of-two-solids',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 7, height: 10 },
        statement: 'A solid is formed by a right circular cylinder of radius 7 cm and height 10 cm with a hemisphere of the same radius fixed on its top. The curved surface area of the solid is:',
        answerKey: {
          options: ['748 cm²', '440 cm²', '308 cm²', '594 cm²'],
          correctOptionIndex: 0,
          valuePoints: ['CSA = 2πrh + 2πr² = 2 × (22/7) × 7 × 10 + 2 × (22/7) × 7²', '= 440 + 308 = 748 cm².'],
          modelAnswer: '748 cm²',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 7, height: 5 },
        statement: 'A solid is formed by a right circular cylinder of radius 7 cm and height 5 cm with a hemisphere of the same radius fixed on its top. The curved surface area of the solid is:',
        answerKey: {
          options: ['528 cm²', '220 cm²', '308 cm²', '484 cm²'],
          correctOptionIndex: 0,
          valuePoints: ['CSA = 2πrh + 2πr² = 2 × (22/7) × 7 × 5 + 2 × (22/7) × 7²', '= 220 + 308 = 528 cm².'],
          modelAnswer: '528 cm²',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-arc-sector-sa-2',
    chapterSlug: 'areas-related-to-circles',
    unitId: 'mensuration',
    topicId: 'areas-related-to-circles-sectors',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 14, angle: 60 },
        statement: 'Find the area of a sector of a circle of radius 14 cm with central angle 60°.',
        answerKey: {
          valuePoints: ['Area = (60/360) × (22/7) × 14²', '= (1/6) × 616 = 308/3 cm²'],
          modelAnswer: '(60/360) × (22/7) × 196 = 616/6 = 308/3 cm².',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 7, angle: 90 },
        statement: 'Find the area of a sector of a circle of radius 7 cm with central angle 90°.',
        answerKey: {
          valuePoints: ['Area = (90/360) × (22/7) × 7²', '= (1/4) × 154 = 77/2 cm²'],
          modelAnswer: '(90/360) × (22/7) × 49 = 154/4 = 77/2 cm².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-csa-sa-2',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'surface-areas-combinations-of-two-solids',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 7, height: 10 },
        statement: 'Find the curved surface area of a right circular cylinder of radius 7 cm and height 10 cm.',
        answerKey: {
          valuePoints: ['CSA = 2πrh', '= 2 × (22/7) × 7 × 10 = 440 cm²'],
          modelAnswer: 'CSA = 2πrh = 2 × (22/7) × 7 × 10 = 440 cm².',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 14, height: 10 },
        statement: 'Find the curved surface area of a right circular cylinder of radius 14 cm and height 10 cm.',
        answerKey: {
          valuePoints: ['CSA = 2πrh', '= 2 × (22/7) × 14 × 10 = 880 cm²'],
          modelAnswer: 'CSA = 2 × (22/7) × 14 × 10 = 880 cm².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-combination-sa-3',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'surface-areas-combinations-of-two-solids',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 3.5, totalHeight: 15.5 },
        statement:
          'A toy is in the form of a cone of radius 3.5 cm mounted on a hemisphere of the same radius. The total height of the toy is 15.5 cm. Find the total surface area of the toy.',
        answerKey: {
          valuePoints: [
            'Height of cone = 15.5 − 3.5 = 12 cm; slant height l = √(3.5² + 12²) = 12.5 cm',
            'TSA = πrl + 2πr² = (22/7)(3.5)(12.5) + 2(22/7)(12.25) = 137.5 + 77',
            'TSA = 214.5 cm²',
          ],
          modelAnswer:
            'Cone height = 12 cm, l = √(12.25 + 144) = 12.5 cm. ' +
            'TSA = πrl + 2πr² = 137.5 + 77 = 214.5 cm².',
        },
      },
      {
        variantKey: 'b',
        params: { side: 7, hemisphereRadius: 3.5 },
        statement:
          'A cubical block of side 7 cm is surmounted by a hemisphere of diameter 7 cm. Find the total surface area of the resulting solid.',
        answerKey: {
          valuePoints: [
            'TSA = 6a² − πr² + 2πr² = 6a² + πr² (base of hemisphere hides one cube face)',
            '= 6 × 49 + (22/7) × 12.25 = 294 + 38.5',
            'TSA = 332.5 cm²',
          ],
          modelAnswer:
            'TSA = 6a² + πr² = 294 + 38.5 = 332.5 cm² (the hemisphere replaces part of the top face).',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-volumes-sa-3',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { diameter: 14, totalHeight: 13 },
        statement:
          'A vessel is in the form of a hollow hemisphere mounted by a hollow cylinder. The diameter of the hemisphere is 14 cm and the total height of the vessel is 13 cm. Find the inner surface area of the vessel.',
        answerKey: {
          valuePoints: [
            'r = 7 cm; cylinder height = 13 − 7 = 6 cm',
            'Inner CSA = 2πrh + 2πr² = 2(22/7)(7)(6) + 2(22/7)(49)',
            '= 264 + 308 = 572 cm²',
          ],
          modelAnswer:
            'r = 7, cylinder height = 6. Inner surface = 2πrh + 2πr² = 264 + 308 = 572 cm².',
        },
      },
      {
        variantKey: 'b',
        params: { diameter: 14, totalHeight: 14 },
        statement:
          'A vessel is in the form of a hollow hemisphere mounted by a hollow cylinder. The diameter of the hemisphere is 14 cm and the total height of the vessel is 14 cm. Find the inner surface area of the vessel.',
        answerKey: {
          valuePoints: [
            'r = 7 cm; cylinder height = 14 − 7 = 7 cm',
            'Inner CSA = 2πrh + 2πr² = 2(22/7)(7)(7) + 2(22/7)(49)',
            '= 308 + 308 = 616 cm²',
          ],
          modelAnswer:
            'r = 7, cylinder height = 7. Inner surface = 308 + 308 = 616 cm².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-arc-segment-la-5',
    chapterSlug: 'areas-related-to-circles',
    unitId: 'mensuration',
    topicId: 'areas-related-to-circles-segments',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 14, angle: 60 },
        statement:
          'Find the area of the segment of a circle of radius 14 cm that subtends an angle of 60° at the centre.',
        answerKey: {
          valuePoints: [
            'Sector area = (60/360) × (22/7) × 14² = 308/3 cm²',
            'Triangle area = ½ × r² × sin 60° = ½ × 196 × (√3/2) = 49√3 cm²',
            'Segment area = 308/3 − 49√3 cm²',
          ],
          modelAnswer:
            'Sector = 308/3 cm²; triangle = 49√3 cm²; segment = (308/3 − 49√3) cm².',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 12, angle: 90 },
        statement:
          'Find the area of the segment of a circle of radius 12 cm that subtends an angle of 90° at the centre.',
        answerKey: {
          valuePoints: [
            'Sector area = (90/360) × π × 144 = 36π cm²',
            'Triangle area = ½ × 12 × 12 = 72 cm²',
            'Segment area = (36π − 72) cm²',
          ],
          modelAnswer:
            'Sector = 36π cm²; triangle = 72 cm²; segment = (36π − 72) cm².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-recast-la-5',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sphereRadius: 6, cylinderRadius: 4 },
        statement:
          'A sphere of radius 6 cm is melted and recast into a right circular cylinder of radius 4 cm. Find the height of the cylinder.',
        answerKey: {
          valuePoints: [
            'Volume of sphere = (4/3)π(6)³ = 288π cm³',
            'Volume of cylinder = π(4)²h = 16πh',
            '16πh = 288π gives h = 18 cm',
          ],
          modelAnswer:
            '(4/3)π × 216 = π × 16 × h ⇒ 288 = 16h ⇒ h = 18 cm.',
        },
      },
      {
        variantKey: 'b',
        params: { sphereRadius: 9, cylinderRadius: 6 },
        statement:
          'A sphere of radius 9 cm is melted and recast into a right circular cylinder of radius 6 cm. Find the height of the cylinder.',
        answerKey: {
          valuePoints: [
            'Volume of sphere = (4/3)π(9)³ = 972π cm³',
            'Volume of cylinder = π(6)²h = 36πh',
            '36πh = 972π gives h = 27 cm',
          ],
          modelAnswer:
            '(4/3)π × 729 = π × 36 × h ⇒ 972 = 36h ⇒ h = 27 cm.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-cone-hemisphere-la-5',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 3.5, totalHeight: 15.5 },
        statement:
          'A solid is in the shape of a cone standing on a hemisphere, both having equal radii 3.5 cm and a total height of 15.5 cm. Find the volume of the solid.',
        answerKey: {
          valuePoints: [
            'Cone height = 15.5 − 3.5 = 12 cm',
            'Volume = (1/3)πr²h + (2/3)πr³ = 154 + 89.83',
            'Volume = 243.83 cm³',
          ],
          modelAnswer:
            'Cone: (1/3)(22/7)(12.25)(12) = 154 cm³. Hemisphere: (2/3)(22/7)(42.875) ≈ 89.83 cm³. ' +
            'Total ≈ 243.83 cm³.',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 7, coneHeight: 24 },
        statement:
          'A solid is in the shape of a cone standing on a hemisphere, both having equal radii 7 cm and the cone has height 24 cm. Find the volume of the solid.',
        answerKey: {
          valuePoints: [
            'Volume of cone = (1/3)π(7)²(24) = 1232 cm³',
            'Volume of hemisphere = (2/3)π(7)³ ≈ 718.67 cm³',
            'Total ≈ 1950.67 cm³',
          ],
          modelAnswer:
            'Cone: (1/3)(22/7)(49)(24) = 1232 cm³. Hemisphere: (2/3)(22/7)(343) ≈ 718.67 cm³. ' +
            'Total ≈ 1950.67 cm³.',
        },
      },
    ],
  }),

  // ── Unit 7 · Statistics and Probability (11 marks) ─────────────────────────
  q({
    bankKey: 'maths-041-stats-mcq-1',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mean-grouped-data',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { classes: ['0–10', '10–20', '20–30', '30–40'], frequencies: [3, 5, 7, 5] },
        statement: 'The mean of the grouped frequency distribution with classes 0–10, 10–20, 20–30, 30–40 and frequencies 3, 5, 7, 5 respectively is:',
        answerKey: {
          options: ['22', '20', '25', '21'],
          correctOptionIndex: 0,
          valuePoints: ['Midpoints: 5, 15, 25, 35; Σfx = 15 + 75 + 175 + 175 = 440, Σf = 20', 'Mean = 440/20 = 22.'],
          modelAnswer: '22',
        },
      },
      {
        variantKey: 'b',
        params: { classes: ['0–10', '10–20', '20–30'], frequencies: [4, 6, 10] },
        statement: 'The mean of the grouped frequency distribution with classes 0–10, 10–20, 20–30 and frequencies 4, 6, 10 respectively is:',
        answerKey: {
          options: ['18', '15', '20', '16'],
          correctOptionIndex: 0,
          valuePoints: ['Midpoints: 5, 15, 25; Σfx = 20 + 90 + 250 = 360, Σf = 20', 'Mean = 360/20 = 18.'],
          modelAnswer: '18',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-prob-classical-mcq-1',
    chapterSlug: 'probability',
    unitId: 'statistics-and-probability',
    topicId: 'probability-classical-definition',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { event: 'a prime number' },
        statement: 'A die is thrown once. The probability of getting a prime number is:',
        answerKey: {
          options: ['1/2', '1/3', '2/3', '1/6'],
          correctOptionIndex: 0,
          valuePoints: ['Primes on a die: 2, 3, 5 → P = 3/6 = 1/2.'],
          modelAnswer: '1/2',
        },
      },
      {
        variantKey: 'b',
        params: { event: 'an even number' },
        statement: 'A die is thrown once. The probability of getting an even number is:',
        answerKey: {
          options: ['1/2', '1/3', '2/3', '1'],
          correctOptionIndex: 0,
          valuePoints: ['Even numbers on a die: 2, 4, 6 → P = 3/6 = 1/2.'],
          modelAnswer: '1/2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-prob-coins-mcq-1',
    chapterSlug: 'probability',
    unitId: 'statistics-and-probability',
    topicId: 'probability-simple-events',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { event: 'at least one head' },
        statement: 'Two coins are tossed simultaneously. The probability of getting at least one head is:',
        answerKey: {
          options: ['1/4', '1/2', '3/4', '1'],
          correctOptionIndex: 2,
          valuePoints: ['Outcomes HH, HT, TH, TT; favourable HH, HT, TH → P = 3/4.'],
          modelAnswer: '3/4',
        },
      },
      {
        variantKey: 'b',
        params: { event: 'exactly one head' },
        statement: 'Two coins are tossed simultaneously. The probability of getting exactly one head is:',
        answerKey: {
          options: ['1/4', '1/2', '3/4', '1'],
          correctOptionIndex: 1,
          valuePoints: ['Favourable outcomes HT, TH → P = 2/4 = 1/2.'],
          modelAnswer: '1/2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-mean-sa-2',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mean-grouped-data',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { data: 'xi 10,20,30,40 with fi 4,5,6,5' },
        statement: 'Find the mean of the following data using the direct method: xi: 10, 20, 30, 40; fi: 4, 5, 6, 5.',
        answerKey: {
          valuePoints: ['Σfixi = 40 + 100 + 180 + 200 = 520 and Σfi = 20', 'Mean = 520/20 = 26'],
          modelAnswer: 'Σfixi = 520, Σfi = 20, mean = 26.',
        },
      },
      {
        variantKey: 'b',
        params: { data: 'xi 2,4,6,8,10 with fi 5,8,10,8,5' },
        statement: 'Find the mean of the following data using the direct method: xi: 2, 4, 6, 8, 10; fi: 5, 8, 10, 8, 5.',
        answerKey: {
          valuePoints: ['Σfixi = 10 + 32 + 60 + 64 + 50 = 216 and Σfi = 36', 'Mean = 216/36 = 6'],
          modelAnswer: 'Σfixi = 216, Σfi = 36, mean = 6.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-prob-real-life-sa-2',
    chapterSlug: 'probability',
    unitId: 'statistics-and-probability',
    topicId: 'probability-simple-events',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { red: 3, black: 5 },
        statement:
          'A bag contains 3 red and 5 black balls. A ball is drawn at random. Find the probability that the ball is (i) red and (ii) not red.',
        answerKey: {
          valuePoints: ['Total balls = 8', 'P(red) = 3/8 and P(not red) = 5/8'],
          modelAnswer: 'P(red) = 3/8; P(not red) = 5/8.',
        },
      },
      {
        variantKey: 'b',
        params: { red: 4, black: 6 },
        statement:
          'A bag contains 4 red and 6 black balls. A ball is drawn at random. Find the probability that the ball is (i) red and (ii) not red.',
        answerKey: {
          valuePoints: ['Total balls = 10', 'P(red) = 4/10 = 2/5 and P(not red) = 6/10 = 3/5'],
          modelAnswer: 'P(red) = 2/5; P(not red) = 3/5.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-median-sa-3',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-median-grouped-data',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { classes: '0-10, 10-20, 20-30, 30-40, 40-50', frequencies: '2, 5, 8, 4, 1' },
        statement:
          'Find the median of the following data: class 0-10, 10-20, 20-30, 30-40, 40-50 with frequencies 2, 5, 8, 4, 1 respectively.',
        answerKey: {
          valuePoints: [
            'N = 20, N/2 = 10; cumulative frequencies 2, 7, 15, 19, 20 → median class 20-30',
            'Median = l + [(N/2 − cf)/f] × h = 20 + [(10 − 7)/8] × 10',
            'Median = 20 + 3.75 = 23.75',
          ],
          modelAnswer:
            'Median class is 20-30 (cf before = 7). Median = 20 + (3/8) × 10 = 23.75.',
        },
      },
      {
        variantKey: 'b',
        params: { classes: '0-10, 10-20, 20-30, 30-40, 40-50', frequencies: '3, 5, 7, 3, 2' },
        statement:
          'Find the median of the following data: class 0-10, 10-20, 20-30, 30-40, 40-50 with frequencies 3, 5, 7, 3, 2 respectively.',
        answerKey: {
          valuePoints: [
            'N = 20, N/2 = 10; cumulative frequencies 3, 8, 15, 18, 20 → median class 20-30',
            'Median = 20 + [(10 − 8)/7] × 10',
            'Median = 20 + 20/7 = 160/7',
          ],
          modelAnswer:
            'Median class is 20-30 (cf before = 8). Median = 20 + (2/7) × 10 = 160/7.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-data-interp-3',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mean-grouped-data',
    questionType: 'data-interpretation',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { mean: 50, missing: 'f' },
        statement:
          'The mean of the following distribution is 50. Find the missing frequency f: xi: 30, 40, 50, 60, 70; fi: 3, f, 4, 3, 2.',
        answerKey: {
          valuePoints: [
            'Σfi = 12 + f and Σfixi = 90 + 40f + 200 + 180 + 140 = 610 + 40f',
            '50 = (610 + 40f)/(12 + f)',
            '600 + 50f = 610 + 40f gives f = 1',
          ],
          modelAnswer:
            'Mean 50 = (610 + 40f)/(12 + f) ⇒ 600 + 50f = 610 + 40f ⇒ f = 1.',
        },
      },
      {
        variantKey: 'b',
        params: { mean: 22, missing: 'f' },
        statement:
          'The mean of the following distribution is 22. Find the missing frequency f: xi: 10, 20, 30, 40; fi: 6, 8, f, 4.',
        answerKey: {
          valuePoints: [
            'Σfi = 18 + f and Σfixi = 60 + 160 + 30f + 160 = 380 + 30f',
            '22 = (380 + 30f)/(18 + f)',
            '396 + 22f = 380 + 30f gives f = 2',
          ],
          modelAnswer:
            'Mean 22 = (380 + 30f)/(18 + f) ⇒ 396 + 22f = 380 + 30f ⇒ f = 2.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-mode-la-5',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mode-grouped-data',
    questionType: 'numerical',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { classes: '0-10 … 40-50', frequencies: '3, 5, 7, 4, 1' },
        statement:
          'Find the mode of the following distribution: class 0-10, 10-20, 20-30, 30-40, 40-50 with frequencies 3, 5, 7, 4, 1 respectively.',
        answerKey: {
          valuePoints: [
            'Modal class is 20-30 (highest frequency 7); l = 20, f₁ = 7, f₀ = 5, f₂ = 4, h = 10',
            'Mode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h = 20 + [2/(14 − 5 − 4)] × 10',
            'Mode = 20 + 4 = 24',
          ],
          modelAnswer:
            'Modal class 20-30. Mode = 20 + [(7 − 5)/(2×7 − 5 − 4)] × 10 = 20 + (2/5) × 10 = 24.',
        },
      },
      {
        variantKey: 'b',
        params: { classes: '10-20 … 50-60', frequencies: '4, 6, 8, 5, 2' },
        statement:
          'Find the mode of the following distribution: class 10-20, 20-30, 30-40, 40-50, 50-60 with frequencies 4, 6, 8, 5, 2 respectively.',
        answerKey: {
          valuePoints: [
            'Modal class is 30-40 (highest frequency 8); l = 30, f₁ = 8, f₀ = 6, f₂ = 5, h = 10',
            'Mode = 30 + [(8 − 6)/(16 − 6 − 5)] × 10',
            'Mode = 30 + 4 = 34',
          ],
          modelAnswer:
            'Modal class 30-40. Mode = 30 + [(8 − 6)/(2×8 − 6 − 5)] × 10 = 30 + (2/5) × 10 = 34.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-case-4',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mean-grouped-data',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { classes: '0-1, 1-2, 2-3, 3-4, 4-5 hours' },
        statement:
          'A survey of 200 students recorded the time (in hours) spent on homework daily: classes 0-1, 1-2, 2-3, 3-4, 4-5 with frequencies 20, 40, 70, 50, 20. (i) Find the mean time spent on homework. (ii) Write the modal class. (iii) How many students spend 3 or more hours on homework?',
        answerKey: {
          valuePoints: [
            'Mean = Σfixi/Σfi = (0.5×20 + 1.5×40 + 2.5×70 + 3.5×50 + 4.5×20)/200 = 510/200 = 2.55 h',
            'Modal class is 2-3 (highest frequency 70)',
            'Students with 3 or more hours = 50 + 20 = 70',
          ],
          modelAnswer:
            'Mean = 510/200 = 2.55 h. Modal class = 2-3. Students with ≥ 3 h = 70.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-prob-case-4',
    chapterSlug: 'probability',
    unitId: 'statistics-and-probability',
    topicId: 'probability-simple-events',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { cards: '1 to 100' },
        statement:
          'A box contains 100 cards numbered 1 to 100. One card is drawn at random. (i) Find the probability that the card shows a two-digit number. (ii) Find the probability that the card shows a perfect square. (iii) Find the probability that the card shows a number divisible by 5.',
        answerKey: {
          valuePoints: [
            'Two-digit numbers: 90 → P = 90/100 = 9/10',
            'Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 → P = 10/100 = 1/10',
            'Multiples of 5: 20 → P = 20/100 = 1/5',
          ],
          modelAnswer: 'P(two-digit) = 9/10; P(perfect square) = 1/10; P(multiple of 5) = 1/5.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-case-4',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-distance-formula',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { rectangle: 'A(0,0), B(60,0), C(60,40), D(0,40)' },
        statement:
          'A rectangular playground has vertices A(0, 0), B(60, 0), C(60, 40) and D(0, 40) (units in m). (i) Find the length of the diagonal AC. (ii) Find the midpoint of AC. (iii) A flag is planted at the midpoint of AC. Find the distance of the flag from A.',
        answerKey: {
          valuePoints: [
            'AC = √(60² + 40²) = √5200 = 20√13 m',
            'Midpoint of AC = ((0+60)/2, (0+40)/2) = (30, 20)',
            'Distance from A to midpoint = √(30² + 20²) = √1300 = 10√13 m',
          ],
          modelAnswer:
            'AC = 20√13 m; midpoint (30, 20); distance from A = 10√13 m.',
        },
      },
    ],
  }),
];
