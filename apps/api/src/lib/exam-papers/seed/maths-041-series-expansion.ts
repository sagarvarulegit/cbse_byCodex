import type { BankQuestion } from '../types.js';

const SUBJECT = 'mathematics-standard';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Mock Test Series expansion for the Maths 041 bank. Adds variety to the
 * tightest (unit, section) cells — extra case studies, 5-mark long answers,
 * 3-mark constructed responses and MCQs — so the five fixed-seed series papers
 * differ in stems, not just in numeric variants. All items are platform-authored
 * original board-pattern questions derived from NCERT scope (never labelled as
 * PYQs). Merged into MATHS_041_SEED by maths-041-seed.ts.
 */
export const MATHS_041_SERIES_EXPANSION: BankQuestion[] = [
  // ── Section E · extra case studies (4 marks) ───────────────────────────────
  q({
    bankKey: 'maths-041-mens-case-4',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'surface-areas-combinations-of-two-solids',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { r: 3.5, cylHeight: 5, coneHeight: 2.1, slantHeight: 4.9 },
        statement:
          'A circus tent is in the shape of a cylinder with a cone on top. The cylindrical part has radius 3.5 m and height 5 m, and the conical roof has the same base radius and a height of 2.1 m. (i) Find the slant height of the conical roof. (ii) Find the curved surface area of the roof and of the cylindrical part. (iii) If canvas costs ₹20 per m², find the cost of the canvas for the whole tent. (Take π = 22/7.)',
        answerKey: {
          valuePoints: [
            'Slant height l = √(2.1² + 3.5²) = √(4.41 + 12.25) = √16.66 ≈ 4.08 m',
            'Roof CSA = πrl = (22/7)(3.5)(4.08) ≈ 44.90 m²; cylinder CSA = 2πrh = 2(22/7)(3.5)(5) = 110 m²',
            'Total canvas ≈ 154.90 m²; cost = 154.90 × 20 ≈ ₹3098.00',
          ],
          modelAnswer:
            'l = √(2.1² + 3.5²) ≈ 4.08 m. Roof CSA ≈ 44.90 m² and cylinder CSA = 110 m². ' +
            'Canvas ≈ 154.90 m², so the cost ≈ 154.90 × 20 ≈ ₹3098.00.',
        },
      },
      {
        variantKey: 'b',
        params: { r: 5.25, cylHeight: 3, coneHeight: 3.5, slantHeight: 6.31 },
        statement:
          'A tent is a cylinder of radius 5.25 m and height 3 m, with a conical roof of the same base radius and height 3.5 m. (i) Find the slant height of the conical roof. (ii) Find the total curved surface area of the tent (roof + cylindrical part). (iii) If canvas costs ₹25 per m², find the cost of the canvas. (Take π = 22/7.)',
        answerKey: {
          valuePoints: [
            'l = √(3.5² + 5.25²) = √(12.25 + 27.5625) = √39.8125 ≈ 6.31 m',
            'Roof CSA = (22/7)(5.25)(6.31) ≈ 104.11 m²; cylinder CSA = 2(22/7)(5.25)(3) = 99 m²; total ≈ 203.11 m²',
            'Cost = 203.11 × 25 ≈ ₹5077.75',
          ],
          modelAnswer:
            'l ≈ 6.31 m. Roof ≈ 104.11 m², cylinder = 99 m², total ≈ 203.11 m². ' +
            'Cost ≈ 203.11 × 25 ≈ ₹5077.75.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-case-4b',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-elevation-depression',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { height: 60, angleA: 60, angleB: 30 },
        statement:
          'A kite is flying at a height of 60 m above the ground. The string is tied to a point on the ground and makes an angle of 60° with the ground. (i) Find the length of the string. (ii) The string is pulled so that it now makes an angle of 30° with the ground while the kite stays at the same height. Find the new length of the string. (iii) How much extra string is needed for the new (30°) position compared with the original (60°) position? (Take √3 = 1.73.)',
        answerKey: {
          valuePoints: [
            'sin 60° = 60/l ⇒ l = 60/(√3/2) = 120/√3 = 40√3 ≈ 69.2 m',
            'sin 30° = 60/l ⇒ l = 120 m',
            'Extra string = 120 − 40√3 = 120 − 69.2 = 50.8 m',
          ],
          modelAnswer:
            'At 60°: l = 60 ÷ (√3/2) = 40√3 ≈ 69.2 m. At 30°: l = 60 ÷ (1/2) = 120 m. ' +
            'Extra = 120 − 40√3 ≈ 50.8 m.',
        },
      },
      {
        variantKey: 'b',
        params: { height: 50, angleA: 45, angleB: 60 },
        statement:
          'A kite is flying at a height of 50 m above the ground. The string is tied to a point on the ground and makes an angle of 45° with the ground. (i) Find the length of the string. (ii) The string is pulled so that it now makes an angle of 60° with the ground while the kite stays at the same height. Find the new length of the string. (iii) How much string is pulled in (the original length minus the new length)? (Take √2 = 1.41 and √3 = 1.73.)',
        answerKey: {
          valuePoints: [
            'sin 45° = 50/l ⇒ l = 50/(√2/2) = 50√2 ≈ 50 × 1.41 = 70.5 m',
            'sin 60° = 50/l ⇒ l = 50/(√3/2) = 100/√3 ≈ 100/1.73 ≈ 57.8 m',
            'String pulled in = 70.5 − 57.8 = 12.7 m',
          ],
          modelAnswer:
            'At 45°: l = 50 ÷ (√2/2) = 50√2 ≈ 70.5 m. At 60°: l = 50 ÷ (√3/2) ≈ 57.8 m. ' +
            'Pulled in = 70.5 − 57.8 ≈ 12.7 m.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-case-4b',
    chapterSlug: 'coordinate-geometry',
    unitId: 'coordinate-geometry',
    topicId: 'coordinate-geometry-section-formula',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { a: 'A(2, 3)', b: 'B(6, 7)', ratio: '1 : 3' },
        statement:
          'A park is modelled on a coordinate grid with corners A(2, 3) and B(6, 7). A fountain is placed at the point P that divides AB in the ratio 1 : 3 internally. (i) Find the coordinates of P. (ii) Find the distance of P from the origin. (iii) A lamp is placed at the midpoint of AB. Find the distance between the lamp and P.',
        answerKey: {
          valuePoints: [
            'P = ((1×6 + 3×2)/4, (1×7 + 3×3)/4) = (12/4, 16/4) = (3, 4)',
            'Distance from origin = √(3² + 4²) = 5 units',
            'Midpoint of AB = (4, 5); distance from (3, 4) = √(1² + 1²) = √2 units',
          ],
          modelAnswer:
            'P = ((6 + 6)/4, (7 + 9)/4) = (3, 4). OP = √(9 + 16) = 5. Midpoint (4, 5), ' +
            'so lamp-to-fountain distance = √2 units.',
        },
      },
      {
        variantKey: 'b',
        params: { a: 'A(1, 2)', b: 'B(9, 6)', ratio: '1 : 1' },
        statement:
          'Two bus stops A(1, 2) and B(9, 6) are marked on a city map. A shelter is built at the point P that divides AB in the ratio 1 : 1. (i) Find the coordinates of P. (ii) Find the distance of P from A. (iii) Find the distance of P from the origin.',
        answerKey: {
          valuePoints: [
            'P = ((1×9 + 1×1)/2, (1×6 + 1×2)/2) = (5, 4)',
            'Distance PA = √((5−1)² + (4−2)²) = √20 = 2√5 units',
            'Distance from origin = √(5² + 4²) = √41 units',
          ],
          modelAnswer:
            'P is the midpoint (5, 4). PA = √(16 + 4) = 2√5. OP = √(25 + 16) = √41 units.',
        },
      },
    ],
  }),

  // ── Section D · extra 5-mark long answers ──────────────────────────────────
  q({
    bankKey: 'maths-041-trig-two-triangles-la-5',
    chapterSlug: 'some-applications-of-trigonometry',
    unitId: 'trigonometry',
    topicId: 'heights-and-distances-two-triangles',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { buildingHeight: 7 },
        statement:
          'From the top of a 7 m high building, the angle of elevation of the top of a cable tower is 60° and the angle of depression of its foot is 45°. Determine the height of the tower.',
        answerKey: {
          valuePoints: [
            'Let AE be the building (7 m) and CD the tower. The horizontal distance from the building to the tower is AD = CE.',
            'Angle of depression of the foot D from E is 45°, so in the right triangle ADE, AD = AE/tan 45° = 7 m',
            'Angle of elevation of the top C from E is 60°, so the rise of the tower above the building level is CE × tan 60° = 7√3 m',
            'Total tower height = 7 + 7√3 = 7(1 + √3) m',
          ],
          modelAnswer:
            'Let the building be AE = 7 m and the tower CD. The horizontal distance ' +
            'AD = AE/tan 45° = 7 m. Rise of the tower above the building level = ' +
            'AD × tan 60° = 7√3 m. So the tower height = 7 + 7√3 = 7(1 + √3) m.',
        },
      },
      {
        variantKey: 'b',
        params: { buildingHeight: 9 },
        statement:
          'From the top of a 9 m high building, the angle of elevation of the top of a tower is 60° and the angle of depression of its foot is 30°. Find the height of the tower and its distance from the building.',
        answerKey: {
          valuePoints: [
            'Horizontal distance d = 9/tan 30° = 9√3 m',
            'Height of tower above building level = d tan 60° = 9√3 × √3 = 27 m',
            'Tower height = 9 + 27 = 36 m',
          ],
          modelAnswer:
            'd = 9/tan 30° = 9√3 m. Rise = d tan 60° = 27 m. Tower height = 9 + 27 = 36 m.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-median-la-5',
    chapterSlug: 'statistics',
    unitId: 'statistics-and-probability',
    topicId: 'statistics-median-grouped-data',
    questionType: 'numerical',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { classes: '0-10 … 50-60', freqs: '5, x, 20, 15, y, 5', median: 28.5, total: 60 },
        statement:
          'The median of the following distribution is 28.5 and the total frequency is 60. Classes 0-10, 10-20, 20-30, 30-40, 40-50, 50-60 with frequencies 5, x, 20, 15, y, 5. Find x and y.',
        answerKey: {
          valuePoints: [
            '45 + x + y = 60 ⇒ x + y = 15',
            'Cumulative frequencies: 5, 5+x, 25+x, 40+x, 40+x+y, 60; n/2 = 30, median class 20-30',
            '28.5 = 20 + [(30 − (5+x))/20] × 10 ⇒ 25 − x = 17 ⇒ x = 8',
            'y = 15 − 8 = 7',
          ],
          modelAnswer:
            'x + y = 15. Median class is 20-30 (cf 5+x ≤ 30 ≤ 25+x). ' +
            '28.5 = 20 + [(30 − 5 − x)/20]×10 ⇒ (25 − x)/2 = 4.25 ⇒ x = 8, so y = 7.',
        },
      },
      {
        variantKey: 'b',
        params: { classes: '0-10 … 50-60', freqs: '4, x, 16, 20, y, 4', median: 32, total: 60 },
        statement:
          'The median of the following distribution is 32 and the total frequency is 60. Classes 0-10, 10-20, 20-30, 30-40, 40-50, 50-60 with frequencies 4, x, 16, 20, y, 4. Find x and y.',
        answerKey: {
          valuePoints: [
            '44 + x + y = 60 ⇒ x + y = 16',
            'Cumulative frequencies: 4, 4+x, 20+x, 40+x, 40+x+y, 60; n/2 = 30, median class 30-40',
            '32 = 30 + [(30 − (20+x))/20] × 10 ⇒ (10 − x)/2 = 2 ⇒ x = 6',
            'y = 16 − 6 = 10',
          ],
          modelAnswer:
            'x + y = 16. Median class is 30-40 (cf 20+x ≤ 30 ≤ 40+x). ' +
            '32 = 30 + [(30 − 20 − x)/20]×10 ⇒ (10 − x)/2 = 2 ⇒ x = 6, so y = 10.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-areas-la-5',
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
        params: { theorem: 'area ratio of similar triangles' },
        statement:
          'Prove that the ratio of the areas of two similar triangles is equal to the square of the ratio of their corresponding sides.',
        answerKey: {
          valuePoints: [
            'Let ΔABC ~ ΔPQR with altitudes AM and PN. Area ratio = (½·BC·AM)/(½·QR·PN)',
            'ΔABM ~ ΔPQN (right angles, ∠B = ∠Q) ⇒ AM/PN = AB/PQ',
            'BC/QR = AB/PQ from similarity of the triangles',
            'Area(ABC)/Area(PQR) = (AB/PQ)²  — the ratio of areas equals the square of the side ratio',
          ],
          modelAnswer:
            'Draw altitudes AM and PN. Area ratio = (BC × AM)/(QR × PN). Since ΔABM ~ ΔPQN, ' +
            'AM/PN = AB/PQ, and BC/QR = AB/PQ. Hence the area ratio = (AB/PQ)².',
        },
      },
      {
        variantKey: 'b',
        params: { theorem: 'sides 3,4,5 vs 6,8,10 areas' },
        statement:
          'Two similar triangles have corresponding sides 3 cm, 4 cm, 5 cm and 6 cm, 8 cm, 10 cm. Find the ratio of the area of the first triangle to the area of the second triangle.',
        answerKey: {
          valuePoints: [
            'Ratio of corresponding sides (first : second) = 3 : 6 = 1 : 2',
            'Ratio of areas = (1/2)² = 1 : 4 (first : second)',
          ],
          modelAnswer:
            'Corresponding sides are in the ratio 3 : 6 = 1 : 2. Areas are in the ratio ' +
            '1² : 2² = 1 : 4 (first triangle : second triangle).',
        },
      },
    ],
  }),

  // ── Section C · extra 3-mark constructed responses ─────────────────────────
  q({
    bankKey: 'maths-041-quad-roots-num-3',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-factorisation',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: 'x² − 7x + 10 = 0' },
        statement: 'Find the roots of x² − 7x + 10 = 0 by factorisation.',
        answerKey: {
          valuePoints: [
            'x² − 7x + 10 = (x − 2)(x − 5) = 0',
            'x = 2 or x = 5',
          ],
          modelAnswer: '(x − 2)(x − 5) = 0, so x = 2 or x = 5.',
        },
      },
      {
        variantKey: 'b',
        params: { equation: 'x² − 3x − 10 = 0' },
        statement: 'Find the roots of x² − 3x − 10 = 0 by factorisation.',
        answerKey: {
          valuePoints: [
            'x² − 3x − 10 = (x − 5)(x + 2) = 0',
            'x = 5 or x = −2',
          ],
          modelAnswer: '(x − 5)(x + 2) = 0, so x = 5 or x = −2.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-ap-num-3',
    chapterSlug: 'arithmetic-progressions',
    unitId: 'algebra',
    topicId: 'arithmetic-progressions-sum',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { a: 3, d: 7, n: 12 },
        statement: 'Find the sum of the first 12 terms of the AP 3, 10, 17, 24, …',
        answerKey: {
          valuePoints: ['a = 3, d = 7', 'S₁₂ = (12/2)(2×3 + 11×7) = 6 × 83 = 498'],
          modelAnswer: 'S₁₂ = 6(6 + 77) = 6 × 83 = 498.',
        },
      },
      {
        variantKey: 'b',
        params: { a: 5, d: 4, n: 15 },
        statement: 'Find the sum of the first 15 terms of the AP 5, 9, 13, 17, …',
        answerKey: {
          valuePoints: ['a = 5, d = 4', 'S₁₅ = (15/2)(2×5 + 14×4) = 7.5 × 66 = 495'],
          modelAnswer: 'S₁₅ = (15/2)(10 + 56) = 7.5 × 66 = 495.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-combination-num-3',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 4, coneHeight: 3 },
        statement:
          'A solid is a cone of height 3 cm mounted on a cylinder of radius 4 cm and height 10 cm, both sharing the same base radius 4 cm. Find the total volume of the solid. (Take π = 22/7.)',
        answerKey: {
          valuePoints: [
            'Cone volume = (1/3)πr²h = (1/3)(22/7)(16)(3) = 352/7 = 50.29 cm³',
            'Cylinder volume = πr²h = (22/7)(16)(10) = 3520/7 = 502.86 cm³',
            'Total volume = 352/7 + 3520/7 = 3872/7 ≈ 553.14 cm³',
          ],
          modelAnswer:
            'Cone: (1/3)(22/7)(16)(3) = 352/7 cm³. Cylinder: (22/7)(16)(10) = 3520/7 cm³. ' +
            'Total = 3872/7 ≈ 553.14 cm³.',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 3, coneHeight: 4, cylHeight: 7 },
        statement:
          'A tent is a cylinder of height 7 m and radius 3 m with a conical top of height 4 m and the same base radius. Find the total volume of the tent. (Take π = 22/7.)',
        answerKey: {
          valuePoints: [
            'Cone volume = (1/3)(22/7)(9)(4) = 264/7 ≈ 37.71 m³',
            'Cylinder volume = (22/7)(9)(7) = 198 m³',
            'Total volume = 264/7 + 198 = 1650/7 ≈ 235.71 m³',
          ],
          modelAnswer:
            'Cone: (1/3)(22/7)(9)(4) = 264/7 m³. Cylinder: (22/7)(9)(7) = 198 m³. ' +
            'Total = 1650/7 ≈ 235.71 m³.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-csa-num-3',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'surface-areas-combinations-of-two-solids',
    questionType: 'numerical',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 7, height: 10 },
        statement:
          'A cylindrical pillar has radius 7 m and height 10 m. Find the cost of painting its curved surface at ₹8 per m². (Take π = 22/7.)',
        answerKey: {
          valuePoints: ['CSA = 2πrh = 2 × (22/7) × 7 × 10 = 440 m²', 'Cost = 440 × 8 = ₹3520'],
          modelAnswer: 'CSA = 440 m². Cost = 440 × 8 = ₹3520.',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 3.5, height: 12 },
        statement:
          'A closed cylindrical tank has radius 3.5 m and height 12 m. Find the cost of painting its whole outer surface at ₹10 per m². (Take π = 22/7.)',
        answerKey: {
          valuePoints: [
            'TSA = 2πr(r + h) = 2 × (22/7) × 3.5 × (3.5 + 12) = 22 × 15.5 = 341 m²',
            'Cost = 341 × 10 = ₹3410',
          ],
          modelAnswer: 'TSA = 2πr(r + h) = 341 m². Cost = 341 × 10 = ₹3410.',
        },
      },
    ],
  }),

  // ── Section B · extra 2-mark short answers ─────────────────────────────────
  q({
    bankKey: 'maths-041-rn-hcf-sa-2',
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
        params: { a: 96, b: 404 },
        statement: 'Find the HCF of 96 and 404 by the prime factorisation method. Hence find their LCM.',
        answerKey: {
          valuePoints: ['96 = 2⁵ × 3 and 404 = 2² × 101', 'HCF = 2² = 4 and LCM = (96 × 404)/4 = 9696'],
          modelAnswer:
            '96 = 2⁵ × 3, 404 = 2² × 101. HCF = 4. LCM = (96 × 404)/4 = 9696.',
        },
      },
      {
        variantKey: 'b',
        params: { a: 510, b: 92 },
        statement: 'Find the HCF and LCM of 510 and 92 and verify HCF × LCM = product of the numbers.',
        answerKey: {
          valuePoints: ['510 = 2 × 3 × 5 × 17 and 92 = 2² × 23', 'HCF = 2 and LCM = 23460', '2 × 23460 = 46920 = 510 × 92 ✓'],
          modelAnswer:
            '510 = 2×3×5×17, 92 = 2²×23. HCF = 2, LCM = 23460. HCF × LCM = 46920 = 510 × 92.',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-arc-sector-sa-2b',
    chapterSlug: 'areas-related-to-circles',
    unitId: 'mensuration',
    topicId: 'areas-related-to-circles-sectors',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 7, angle: 60 },
        statement: 'Find the area of a sector of a circle of radius 7 cm whose central angle is 60°. (Take π = 22/7.)',
        answerKey: {
          valuePoints: ['Area = (θ/360) × πr²', '= (60/360) × (22/7) × 49 = (1/6) × 154 = 154/6 = 25.67 cm²'],
          modelAnswer: 'Area = (60/360)(22/7)(49) = 154/6 ≈ 25.67 cm².',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 21, angle: 90 },
        statement: 'Find the area of a quadrant of a circle of radius 21 cm. (Take π = 22/7.)',
        answerKey: {
          valuePoints: ['Quadrant angle = 90°, so area = (1/4)πr²', '= (1/4)(22/7)(441) = (22 × 63)/4 = 346.5 cm²'],
          modelAnswer: 'Quadrant area = (1/4)(22/7)(441) = 346.5 cm².',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-tri-similar-sa-2',
    chapterSlug: 'triangles',
    unitId: 'geometry',
    topicId: 'triangles-similarity-criteria',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { sides: '3, 4, 5 and 6, 8, 10' },
        statement: 'State whether the triangles with sides 3, 4, 5 and 6, 8, 10 are similar, giving a reason.',
        answerKey: {
          valuePoints: ['Sides are proportional: 3/6 = 4/8 = 5/10 = 1/2', 'Yes — SSS similarity criterion'],
          modelAnswer:
            '3/6 = 4/8 = 5/10 = 1/2, so the sides are proportional. By SSS similarity the triangles are similar.',
        },
      },
      {
        variantKey: 'b',
        params: { angles: 'ΔABC: ∠A = 60°, ∠B = 70° and ΔDEF: ∠D = 60°, ∠E = 50°' },
        statement:
          'In ΔABC, ∠A = 60° and ∠B = 70°. In ΔDEF, ∠D = 60° and ∠E = 50°. Show that ΔABC ~ ΔDFE.',
        answerKey: {
          valuePoints: ['∠C = 180° − 130° = 50° and ∠F = 180° − 110° = 70°', '∠A = ∠D, ∠B = ∠F — AAA similarity ⇒ ΔABC ~ ΔDFE'],
          modelAnswer:
            '∠C = 50° and ∠F = 70°. Since ∠A = ∠D = 60° and ∠B = ∠F = 70°, by AAA similarity ΔABC ~ ΔDFE.',
        },
      },
    ],
  }),

  // ── Section A · extra MCQs (1 mark) ────────────────────────────────────────
  q({
    bankKey: 'maths-041-rn-irrational-mcq-1',
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
        params: { numbers: '√4, √9, √12, √16' },
        statement: 'Which of the following is an irrational number?',
        answerKey: {
          options: ['√4', '√9', '√12', '√16'],
          correctOptionIndex: 2,
          valuePoints: ['√12 = 2√3 is irrational; the others are 2, 3 and 4.'],
          modelAnswer: '√12',
        },
      },
      {
        variantKey: 'b',
        params: { numbers: '√25, √49, √50, √81' },
        statement: 'Which of the following is an irrational number?',
        answerKey: {
          options: ['√25', '√49', '√50', '√81'],
          correctOptionIndex: 2,
          valuePoints: ['√50 = 5√2 is irrational; the others are 5, 7 and 9.'],
          modelAnswer: '√50',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-poly-graph-mcq-1',
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
        params: { zeroes: [2, -2] },
        statement: 'A quadratic polynomial whose zeroes are 2 and −2 is:',
        answerKey: {
          options: ['x² − 4', 'x² + 4', 'x² − 4x', 'x² + 4x'],
          correctOptionIndex: 0,
          valuePoints: ['Sum of zeroes = 0 and product = −4, so the polynomial is x² − 4.'],
          modelAnswer: 'x² − 4',
        },
      },
      {
        variantKey: 'b',
        params: { zeroes: [3, -3] },
        statement: 'A quadratic polynomial whose zeroes are 3 and −3 is:',
        answerKey: {
          options: ['x² + 9', 'x² − 9', 'x² − 3x', 'x² + 3x'],
          correctOptionIndex: 1,
          valuePoints: ['Sum = 0 and product = −9, so the polynomial is x² − 9.'],
          modelAnswer: 'x² − 9',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-quad-standard-mcq-1',
    chapterSlug: 'quadratic-equations',
    unitId: 'algebra',
    topicId: 'quadratic-equations-standard-form',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { equation: 'x² + 3x + 2 = 0' },
        statement: 'The roots of the equation x² + 3x + 2 = 0 are:',
        answerKey: {
          options: ['−1, −2', '1, 2', '1, −2', '−1, 2'],
          correctOptionIndex: 0,
          valuePoints: ['x² + 3x + 2 = (x + 1)(x + 2), so the roots are −1 and −2.'],
          modelAnswer: '−1, −2',
        },
      },
      {
        variantKey: 'b',
        params: { equation: 'x² − 4 = 0' },
        statement: 'The roots of the equation x² − 4 = 0 are:',
        answerKey: {
          options: ['2, −2', '4, −4', '2, 2', '0, 4'],
          correctOptionIndex: 0,
          valuePoints: ['x² = 4 ⇒ x = ±2.'],
          modelAnswer: '2, −2',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-cg-distance-mcq-2',
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
        params: { points: '(1, 2) and (4, 6)' },
        statement: 'The distance between the points (1, 2) and (4, 6) is:',
        answerKey: {
          options: ['5', '3', '√13', '7'],
          correctOptionIndex: 0,
          valuePoints: ['√((4−1)² + (6−2)²) = √(9 + 16) = 5.'],
          modelAnswer: '5',
        },
      },
      {
        variantKey: 'b',
        params: { points: '(2, 3) and (5, 7)' },
        statement: 'The distance between the points (2, 3) and (5, 7) is:',
        answerKey: {
          options: ['5', '√5', '25', '7'],
          correctOptionIndex: 0,
          valuePoints: ['√(9 + 16) = 5.'],
          modelAnswer: '5',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-circle-point-mcq-1',
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
        params: { tangent: 'at a point on a circle' },
        statement: 'The tangent at a point on a circle is:',
        answerKey: {
          options: [
            'Parallel to the radius at that point',
            'Perpendicular to the radius at that point',
            'Perpendicular to the diameter at the centre',
            'At 45° to the radius at that point',
          ],
          correctOptionIndex: 1,
          valuePoints: ['The tangent at a point is perpendicular to the radius through the point of contact.'],
          modelAnswer: 'Perpendicular to the radius at that point',
        },
      },
      {
        variantKey: 'b',
        params: { tangent: 'radius and tangent at point of contact' },
        statement: 'A tangent PQ touches a circle at point T. The radius drawn from the centre O to T is:',
        answerKey: {
          options: [
            'Parallel to PQ',
            'Perpendicular to PQ',
            'Shorter than the tangent at T',
            'Equal to the length of PQ',
          ],
          correctOptionIndex: 1,
          valuePoints: ['The radius through the point of contact is perpendicular to the tangent.'],
          modelAnswer: 'Perpendicular to PQ',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-trig-ratio-rel-mcq-1',
    chapterSlug: 'introduction-to-trigonometry',
    unitId: 'trigonometry',
    topicId: 'trigonometry-ratio-relations',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { identity: 'sin²θ + cos²θ' },
        statement: 'The value of sin² 30° + cos² 30° is:',
        answerKey: {
          options: ['1', '0', '1/2', '√3/2'],
          correctOptionIndex: 0,
          valuePoints: ['sin²θ + cos²θ = 1 for every θ.'],
          modelAnswer: '1',
        },
      },
      {
        variantKey: 'b',
        params: { identity: 'sec²θ − tan²θ' },
        statement: 'The value of sec² 45° − tan² 45° is:',
        answerKey: {
          options: ['1', '0', '2', '−1'],
          correctOptionIndex: 0,
          valuePoints: ['sec²θ − tan²θ = 1 for every θ.'],
          modelAnswer: '1',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-sav-volume-mcq-2',
    chapterSlug: 'surface-areas-and-volumes',
    unitId: 'mensuration',
    topicId: 'volumes-combinations-of-two-solids',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: { radius: 3, height: 10 },
        statement: 'The volume of a cylinder of radius 3 cm and height 10 cm is: (Take π = 22/7.)',
        answerKey: {
          options: ['90 cm³', '282.86 cm³', '30 cm³', '942 cm³'],
          correctOptionIndex: 1,
          valuePoints: ['V = πr²h = (22/7) × 9 × 10 = 1980/7 ≈ 282.86 cm³.'],
          modelAnswer: '≈ 282.86 cm³',
        },
      },
      {
        variantKey: 'b',
        params: { radius: 7, height: 6 },
        statement: 'The volume of a cone of radius 7 cm and height 6 cm is: (Take π = 22/7.)',
        answerKey: {
          options: ['308 cm³', '924 cm³', '154 cm³', '616 cm³'],
          correctOptionIndex: 0,
          valuePoints: ['V = (1/3)πr²h = (1/3)(22/7)(49)(6) = 308 cm³.'],
          modelAnswer: '308 cm³',
        },
      },
    ],
  }),
  q({
    bankKey: 'maths-041-stats-mean-mcq-1',
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
        params: { data: '2, 4, 6, 8, 10' },
        statement: 'The mean of the numbers 2, 4, 6, 8, 10 is:',
        answerKey: {
          options: ['6', '5', '7', '8'],
          correctOptionIndex: 0,
          valuePoints: ['Mean = (2 + 4 + 6 + 8 + 10)/5 = 30/5 = 6.'],
          modelAnswer: '6',
        },
      },
      {
        variantKey: 'b',
        params: { data: '1, 3, 5, 7, 9' },
        statement: 'The mean of the numbers 1, 3, 5, 7, 9 is:',
        answerKey: {
          options: ['5', '4', '6', '7'],
          correctOptionIndex: 0,
          valuePoints: ['Mean = 25/5 = 5.'],
          modelAnswer: '5',
        },
      },
    ],
  }),
];
