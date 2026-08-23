import type { BankQuestion } from '../types.js';

const SUBJECT = 'mathematics-basic';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Curated CBSE Class 10 Mathematics Basic (241) Question Bank.
 * Derived from the official CBSE Class 10 Mathematics Basic assessment scope.
 * Contains explicit step-wise marking rubrics and value points.
 */
export const MATHS_241_SEED: BankQuestion[] = [
  // ── UNIT 1: NUMBER SYSTEMS (6 MARKS) ──────────────────────────────────────────
  q({
    bankKey: 'maths-241-rn-hcf-lcm-mcq-1',
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
        params: {},
        statement: 'If two positive integers a and b are written as a = x³y² and b = xy³, where x and y are prime numbers, then HCF(a, b) is:',
        answerKey: {
          options: ['xy', 'xy²', 'x³y³', 'x²y²'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] HCF is the product of the smallest power of each common prime factor involved: min power of x is 1, min power of y is 2. So HCF = xy².'],
          modelAnswer: 'xy²',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'If p = a²b³ and q = a³b, where a and b are prime numbers, then LCM(p, q) is:',
        answerKey: {
          options: ['ab', 'a²b', 'a³b³', 'a²b²'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] LCM is the product of the greatest power of each prime factor involved: max power of a is 3, max power of b is 3. So LCM = a³b³.'],
          modelAnswer: 'a³b³',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-rn-prime-factor-mcq-2',
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
        params: {},
        statement: 'The exponent of 2 in the prime factorisation of 144 is:',
        answerKey: {
          options: ['2', '3', '4', '5'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] Prime factorisation of 144 = 2⁴ × 3². The exponent of 2 is 4.'],
          modelAnswer: '4',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-rn-relation-vsa-1',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-fundamental-theorem-of-arithmetic',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Given that HCF(306, 657) = 9, find LCM(306, 657).',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] State formula: LCM(a, b) × HCF(a, b) = a × b',
            '[+0.5 Mark] Substitute values: LCM(306, 657) × 9 = 306 × 657',
            '[+1.0 Mark] Calculate: LCM = (306 × 657) / 9 = 34 × 657 = 22338',
          ],
          modelAnswer: 'LCM(306, 657) = 22338',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-rn-irrational-sa-1',
    chapterSlug: 'real-numbers',
    unitId: 'number-systems',
    topicId: 'real-numbers-irrationality-proofs',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Prove that 3 + 2√5 is an irrational number, given that √5 is irrational.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] Assume on the contrary that 3 + 2√5 is rational: 3 + 2√5 = a/b where a, b are co-prime integers and b ≠ 0.',
            '[+1.0 Mark] Rearrange: 2√5 = (a/b) - 3 = (a - 3b)/b => √5 = (a - 3b)/(2b).',
            '[+1.0 Mark] Since a, b are integers, (a - 3b)/(2b) is rational, which implies √5 is rational.',
            '[+0.5 Mark] But this contradicts the fact that √5 is irrational. Hence, 3 + 2√5 is irrational.',
          ],
          modelAnswer: 'Hence proved by contradiction that 3 + 2√5 is irrational.',
        },
      },
    ],
  }),

  // ── UNIT 2: ALGEBRA (20 MARKS) ────────────────────────────────────────────────
  q({
    bankKey: 'maths-241-poly-zeroes-mcq-1',
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
        params: {},
        statement: 'If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is:',
        answerKey: {
          options: ['10', '-10', '-7', '-2'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] Since 2 is a zero, (2)² + 3(2) + k = 0 => 4 + 6 + k = 0 => k = -10.'],
          modelAnswer: '-10',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-poly-sum-product-mcq-2',
    chapterSlug: 'polynomials',
    unitId: 'algebra',
    topicId: 'polynomials-zeroes-coefficients-quadratic',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A quadratic polynomial whose zeroes are -3 and 4 is:',
        answerKey: {
          options: ['x² - x + 12', 'x² + x + 12', 'x² - x - 12', '2x² + 2x - 24'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] Sum of zeroes S = -3 + 4 = 1, Product P = (-3)(4) = -12. Polynomial: x² - Sx + P = x² - x - 12.'],
          modelAnswer: 'x² - x - 12',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-linear-consistency-mcq-1',
    chapterSlug: 'pair-of-linear-equations-in-two-variables',
    unitId: 'algebra',
    topicId: 'linear-pairs-number-of-solutions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The pair of linear equations 2x + 3y = 5 and 4x + 6y = 15 has:',
        answerKey: {
          options: ['a unique solution', 'infinitely many solutions', 'no solution', 'exactly two solutions'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] a1/a2 = 2/4 = 1/2, b1/b2 = 3/6 = 1/2, c1/c2 = 5/15 = 1/3. Since a1/a2 = b1/b2 ≠ c1/c2, the lines are parallel and have no solution.'],
          modelAnswer: 'no solution',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-quad-discriminant-mcq-1',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-discriminant',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is:',
        answerKey: {
          options: ['-8', '10', '-16', '8'],
          correctOptionIndex: 0,
          valuePoints: ['[+1.0 Mark] D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8.'],
          modelAnswer: '-8',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-ap-nth-term-mcq-1',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-nth-term',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The 10th term of the AP: 2, 7, 12, ... is:',
        answerKey: {
          options: ['47', '49', '52', '45'],
          correctOptionIndex: 0,
          valuePoints: ['[+1.0 Mark] First term a = 2, common difference d = 7 - 2 = 5. a10 = a + 9d = 2 + 9(5) = 2 + 45 = 47.'],
          modelAnswer: '47',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-linear-solve-vsa-1',
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
        params: {},
        statement: 'Solve the following pair of linear equations by elimination: x + y = 14 and x - y = 4.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Adding the two equations: (x + y) + (x - y) = 14 + 4 => 2x = 18 => x = 9.',
            '[+1.0 Mark] Substituting x = 9 in x + y = 14: 9 + y = 14 => y = 5.',
          ],
          modelAnswer: 'x = 9, y = 5',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-quad-factor-sa-1',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-factorisation',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Find the roots of the quadratic equation x² - 3x - 10 = 0 by factorisation.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Splitting middle term: x² - 5x + 2x - 10 = 0.',
            '[+1.0 Mark] Grouping: x(x - 5) + 2(x - 5) = 0 => (x - 5)(x + 2) = 0.',
            '[+1.0 Mark] Equating factors to zero: x = 5 or x = -2.',
          ],
          modelAnswer: 'Roots are x = 5 and x = -2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-ap-sum-la-1',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-sum',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The sum of the first 14 terms of an AP is 1050 and its first term is 10. Find the 20th term of this AP.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] State formula: S_n = (n/2)[2a + (n - 1)d].',
            '[+1.0 Mark] Substitute n = 14, a = 10, S_14 = 1050: 1050 = (14/2)[2(10) + (14 - 1)d].',
            '[+1.0 Mark] Simplify: 1050 = 7[20 + 13d] => 150 = 20 + 13d => 13d = 130 => d = 10.',
            '[+1.0 Mark] Formula for 20th term: a_20 = a + 19d.',
            '[+1.0 Mark] Calculate: a_20 = 10 + 19(10) = 10 + 190 = 200.',
          ],
          modelAnswer: 'The 20th term is 200.',
        },
      },
    ],
  }),

  // ── UNIT 3: COORDINATE GEOMETRY (6 MARKS) ──────────────────────────────────────
  q({
    bankKey: 'maths-241-cg-distance-mcq-1',
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
        params: {},
        statement: 'The distance of the point P(3, 4) from the origin (0, 0) is:',
        answerKey: {
          options: ['3', '4', '5', '7'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] Distance = √(x² + y²) = √(3² + 4²) = √(9 + 16) = √25 = 5 units.'],
          modelAnswer: '5',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-cg-midpoint-vsa-1',
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
        params: {},
        statement: 'Find the coordinates of the midpoint of the line segment joining the points A(2, -5) and B(-6, 3).',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] Midpoint formula: M = ((x1 + x2)/2, (y1 + y2)/2).',
            '[+1.0 Mark] Substitute: x = (2 + (-6))/2 = -4/2 = -2, y = (-5 + 3)/2 = -2/2 = -1.',
            '[+0.5 Mark] Write final coordinates: M(-2, -1).',
          ],
          modelAnswer: '(-2, -1)',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-cg-section-sa-1',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-section-formula',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In what ratio does the point P(-4, 6) divide the line segment joining the points A(-6, 10) and B(3, -8)?',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] Let the ratio be k : 1.',
            '[+1.0 Mark] Using section formula for x-coordinate: -4 = (k(3) + 1(-6)) / (k + 1).',
            '[+1.0 Mark] Cross multiply: -4(k + 1) = 3k - 6 => -4k - 4 = 3k - 6 => -7k = -2 => k = 2/7.',
            '[+0.5 Mark] Verify with y-coordinate: (2/7(-8) + 10) / (2/7 + 1) = (-16/7 + 70/7) / (9/7) = 54/9 = 6. Hence ratio is 2 : 7.',
          ],
          modelAnswer: 'The required ratio is 2 : 7.',
        },
      },
    ],
  }),

  // ── UNIT 4: GEOMETRY (15 MARKS) ───────────────────────────────────────────────
  q({
    bankKey: 'maths-241-tri-bpt-mcq-1',
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
        params: {},
        statement: 'In △ABC, DE ∥ BC. If AD = 1.5 cm, DB = 3 cm, and AE = 1 cm, then EC is:',
        answerKey: {
          options: ['1.5 cm', '2 cm', '3 cm', '2.5 cm'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] By Basic Proportionality Theorem, AD/DB = AE/EC => 1.5/3 = 1/EC => 1/2 = 1/EC => EC = 2 cm.'],
          modelAnswer: '2 cm',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-circ-tangent-length-mcq-1',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-equal-tangents',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The length of tangent from an external point P to a circle of radius 5 cm is 12 cm. The distance of P from the centre is:',
        answerKey: {
          options: ['11 cm', '13 cm', '15 cm', '17 cm'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] In right triangle OPT, OP² = OT² + PT² = 5² + 12² = 25 + 144 = 169 => OP = 13 cm.'],
          modelAnswer: '13 cm',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-circ-angle-vsa-1',
    chapterSlug: 'circles',
    unitId: 'geometry',
    topicId: 'circles-radius-perpendicular-tangent',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'If tangents PA and PB from a point P to a circle with centre O are inclined to each other at an angle of 80°, then find ∠POA.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] In quadrilateral OAPB, ∠OAP = ∠OBP = 90° (radius is perpendicular to tangent at point of contact).',
            '[+0.5 Mark] ∠AOB + ∠APB = 180° => ∠AOB + 80° = 180° => ∠AOB = 100°.',
            '[+1.0 Mark] Line OP bisects ∠AOB => ∠POA = ∠AOB / 2 = 100° / 2 = 50°.',
          ],
          modelAnswer: '∠POA = 50°',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-tri-bpt-sa-1',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-basic-proportionality-theorem',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In △ABC, DE ∥ BC intersecting AB at D and AC at E. If AD = x, DB = x - 2, AE = x + 2, and EC = x - 1, find the value of x.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] By BPT, AD / DB = AE / EC.',
            '[+1.0 Mark] Substitute: x / (x - 2) = (x + 2) / (x - 1) => x(x - 1) = (x - 2)(x + 2).',
            '[+1.0 Mark] Expand: x² - x = x² - 4 => -x = -4 => x = 4.',
          ],
          modelAnswer: 'x = 4',
        },
      },
    ],
  }),

  // ── UNIT 5: TRIGONOMETRY (12 MARKS) ───────────────────────────────────────────
  q({
    bankKey: 'maths-241-trig-value-mcq-1',
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
        params: {},
        statement: 'The value of (sin² 30° + cos² 30°) is:',
        answerKey: {
          options: ['0', '1/2', '1', '2'],
          correctOptionIndex: 2,
          valuePoints: ['[+1.0 Mark] sin² θ + cos² θ = 1 for any angle θ. (1/2)² + (√3/2)² = 1/4 + 3/4 = 1.'],
          modelAnswer: '1',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-trig-evaluate-vsa-1',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-standard-angles',
    questionType: 'numerical',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Evaluate: 2 tan² 45° + cos² 30° - sin² 60°.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Substitute trigonometric values: tan 45° = 1, cos 30° = √3/2, sin 60° = √3/2.',
            '[+1.0 Mark] Calculate: 2(1)² + (√3/2)² - (√3/2)² = 2(1) + 3/4 - 3/4 = 2.',
          ],
          modelAnswer: '2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-trig-height-distance-sa-1',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-elevation-depression',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A tower stands vertically on the ground. From a point on the ground, which is 15 m away from the foot of the tower, the angle of elevation of the top of the tower is found to be 60°. Find the height of the tower.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Draw figure: Let AB be tower of height h and BC = 15 m be the distance. Angle ∠ACB = 60°.',
            '[+1.0 Mark] In right triangle ABC: tan 60° = AB / BC => √3 = h / 15.',
            '[+1.0 Mark] Calculate: h = 15√3 m.',
          ],
          modelAnswer: 'Height of tower = 15√3 m',
        },
      },
    ],
  }),

  // ── UNIT 6: MENSURATION (10 MARKS) ────────────────────────────────────────────
  q({
    bankKey: 'maths-241-mens-sector-area-mcq-1',
    chapterSlug: 'areas-related-to-circles',
    unitId: 'mensuration',
    topicId: 'areas-related-to-circles-sectors',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Area of a sector of angle p (in degrees) of a circle with radius R is:',
        answerKey: {
          options: ['(p/180) × 2πR', '(p/180) × πR²', '(p/360) × 2πR', '(p/720) × 2πR²'],
          correctOptionIndex: 3,
          valuePoints: ['[+1.0 Mark] Area of sector = (p/360) × πR² = (p/720) × 2πR².'],
          modelAnswer: '(p/720) × 2πR²',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-mens-sav-cylinder-vsa-1',
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
        params: {},
        statement: 'Two cubes each of volume 64 cm³ are joined end to end. Find the surface area of the resulting cuboid.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+0.5 Mark] Side of cube: a³ = 64 => a = 4 cm.',
            '[+0.5 Mark] Dimensions of resulting cuboid: length l = 4 + 4 = 8 cm, breadth b = 4 cm, height h = 4 cm.',
            '[+1.0 Mark] Surface area = 2(lb + bh + hl) = 2(8×4 + 4×4 + 4×8) = 2(32 + 16 + 32) = 2(80) = 160 cm².',
          ],
          modelAnswer: 'Surface area = 160 cm²',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-mens-sav-combine-sa-1',
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
        params: {},
        statement: 'A solid is in the shape of a cone standing on a hemisphere with both their radii being equal to 1 cm and the height of the cone is equal to its radius. Find the volume of the solid in terms of π.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Volume of hemisphere = (2/3)πr³ = (2/3)π(1)³ = (2/3)π cm³.',
            '[+1.0 Mark] Volume of cone = (1/3)πr²h = (1/3)π(1)²(1) = (1/3)π cm³.',
            '[+1.0 Mark] Total volume = (2/3)π + (1/3)π = (3/3)π = π cm³.',
          ],
          modelAnswer: 'Volume of the solid = π cm³',
        },
      },
    ],
  }),

  // ── UNIT 7: STATISTICS & PROBABILITY (11 MARKS) ───────────────────────────────
  q({
    bankKey: 'maths-241-stat-empirical-mcq-1',
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
        params: {},
        statement: 'If the mean and mode of a data are 24 and 12 respectively, then its median is:',
        answerKey: {
          options: ['18', '20', '22', '25'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] Empirical relationship: Mode = 3 Median - 2 Mean => 12 = 3 Median - 2(24) => 12 + 48 = 3 Median => 60 = 3 Median => Median = 20.'],
          modelAnswer: '20',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-prob-cards-mcq-1',
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
        params: {},
        statement: 'One card is drawn from a well-shuffled deck of 52 cards. The probability of getting a king of red colour is:',
        answerKey: {
          options: ['1/13', '1/26', '1/52', '3/26'],
          correctOptionIndex: 1,
          valuePoints: ['[+1.0 Mark] Total cards = 52. Red kings (heart and diamond) = 2. Probability = 2/52 = 1/26.'],
          modelAnswer: '1/26',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-prob-dice-vsa-1',
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
        params: {},
        statement: 'A die is thrown once. Find the probability of getting: (i) a prime number, (ii) a number lying between 2 and 6.',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] (i) Total outcomes = 6. Prime numbers are 2, 3, 5 (3 outcomes). P(prime) = 3/6 = 1/2.',
            '[+1.0 Mark] (ii) Numbers between 2 and 6 are 3, 4, 5 (3 outcomes). P(between 2 and 6) = 3/6 = 1/2.',
          ],
          modelAnswer: '(i) 1/2, (ii) 1/2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-241-stat-mean-sa-1',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-mean-grouped-data',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Find the mean of the following frequency distribution:\nClass: 0-10, 10-20, 20-30, 30-40, 40-50\nFrequency: 3, 5, 9, 5, 3',
        answerKey: {
          options: [],
          valuePoints: [
            '[+1.0 Mark] Calculate class marks (x_i): 5, 15, 25, 35, 45.',
            '[+1.0 Mark] Calculate f_i * x_i: 3(5)=15, 5(15)=75, 9(25)=225, 5(35)=175, 3(45)=135. Sum Σf_i*x_i = 625, Σf_i = 25.',
            '[+1.0 Mark] Formula & Calculation: Mean = Σf_i*x_i / Σf_i = 625 / 25 = 25.',
          ],
          modelAnswer: 'Mean = 25',
        },
      },
    ],
  }),
];
