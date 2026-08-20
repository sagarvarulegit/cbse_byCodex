export type CheatsheetSubject = 'maths' | 'science';

export interface FormulaItem {
  label: string;
  formulaLatex: string;
  notes?: string;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  category?: string;
}

export interface ChapterCheatsheet {
  id: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  subject: CheatsheetSubject;
  summaryNote: string;
  coreRules: string[];
  formulas: FormulaItem[];
  flashcards: FlashcardItem[];
  commonTraps: string[];
  isFreeSample: boolean;
}

export const CHAPTER_CHEATSHEETS_DATA: ChapterCheatsheet[] = [
  // --- MATHEMATICS ---
  // 1. Real Numbers
  {
    id: 'math-ch1',
    chapterSlug: 'real-numbers',
    chapterNumber: 1,
    chapterTitle: 'Real Numbers',
    subject: 'maths',
    summaryNote: 'Fundamental Theorem of Arithmetic, Prime Factorization, and Irrationality Proofs.',
    coreRules: [
      'Fundamental Theorem of Arithmetic: Every composite number can be uniquely factored into primes, apart from the order of factors.',
      'For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b (Only valid for TWO numbers!).',
      'If p is a prime and p divides a², then p divides a (where a is a positive integer).',
    ],
    formulas: [
      {
        label: 'Product of Two Numbers',
        formulaLatex: '\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b',
        notes: 'Does not apply to 3 numbers (HCF × LCM ≠ a × b × c)',
      },
      {
        label: 'Proof of Irrationality Template',
        formulaLatex: '\\sqrt{p} = \\frac{a}{b} \\implies p b^2 = a^2 \\implies p \\text{ divides } a \\text{ and } b',
        notes: 'Contradicts co-prime assumption (gcd(a,b) = 1)',
      },
    ],
    flashcards: [
      {
        id: 'fc-rn-1',
        front: 'What is the relation between HCF, LCM and two numbers a and b?',
        back: 'HCF(a, b) × LCM(a, b) = a × b',
        category: 'Formulas',
      },
      {
        id: 'fc-rn-2',
        front: 'Can HCF × LCM = a × b × c for three numbers?',
        back: 'No! This product formula is ONLY valid for exactly two numbers.',
        category: 'Traps',
      },
      {
        id: 'fc-rn-3',
        front: 'What is the smallest prime and smallest composite number?',
        back: 'Smallest Prime = 2, Smallest Composite = 4. HCF(2, 4) = 2, LCM(2, 4) = 4.',
        category: 'Recall',
      },
    ],
    commonTraps: [
      'Applying HCF × LCM = a × b × c for three integers (Always use prime factorization for 3 numbers).',
      'Forgetting to state that a and b are co-prime integers in √2/3/5 irrationality proofs.',
    ],
    isFreeSample: false,
  },

  // 4. Quadratic Equations
  {
    id: 'math-ch4',
    chapterSlug: 'quadratic-equations',
    chapterNumber: 4,
    chapterTitle: 'Quadratic Equations',
    subject: 'maths',
    summaryNote: 'Standard form ax² + bx + c = 0 (a ≠ 0), Quadratic Formula, Discriminant Nature of Roots.',
    coreRules: [
      'Standard Form: ax² + bx + c = 0, where a, b, c ∈ ℝ and a ≠ 0.',
      'Discriminant D = b² - 4ac determines the nature of roots.',
      'D > 0: Two distinct real roots. D = 0: Two equal real roots (-b / 2a). D < 0: No real roots.',
    ],
    formulas: [
      {
        label: 'Discriminant Formula',
        formulaLatex: 'D = b^2 - 4ac',
      },
      {
        label: 'Quadratic Formula (Sridharacharya Formula)',
        formulaLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} = \\frac{-b \\pm \\sqrt{D}}{2a}',
      },
      {
        label: 'Sum and Product of Roots (α, β)',
        formulaLatex: '\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha \\cdot \\beta = \\frac{c}{a}',
      },
      {
        label: 'Equation from Roots',
        formulaLatex: 'x^2 - (\\alpha + \\beta)x + (\\alpha\\beta) = 0',
      },
    ],
    flashcards: [
      {
        id: 'fc-qe-1',
        front: 'What condition gives two equal real roots in ax² + bx + c = 0?',
        back: 'Discriminant D = b² - 4ac = 0. The equal root is x = -b / (2a).',
        category: 'Discriminant',
      },
      {
        id: 'fc-qe-2',
        front: 'Write the quadratic formula for roots of ax² + bx + c = 0.',
        back: 'x = (-b ± √(b² - 4ac)) / (2a)',
        category: 'Formulas',
      },
      {
        id: 'fc-qe-3',
        front: 'If D < 0, what is the nature of the roots in Class 10 syllabus?',
        back: 'No Real Roots (Complex / Imaginary roots).',
        category: 'Discriminant',
      },
    ],
    commonTraps: [
      'Forgetting the ± sign in the quadratic formula numerator.',
      'Dividing only the radical term by 2a instead of the whole (-b ± √D).',
      'Sign error when b is negative: -(-b) becomes +b.',
    ],
    isFreeSample: true,
  },

  // 5. Arithmetic Progressions
  {
    id: 'math-ch5',
    chapterSlug: 'arithmetic-progressions',
    chapterNumber: 5,
    chapterTitle: 'Arithmetic Progressions',
    subject: 'maths',
    summaryNote: 'nth term formula, sum of first n terms, consecutive terms selection.',
    coreRules: [
      'An AP is a sequence where difference between consecutive terms is constant (common difference d = aₙ - aₙ₋₁).',
      'd can be positive, negative, or zero.',
      'For 3 terms in AP, assume: (a - d), a, (a + d).',
      'nth term from the end = l - (n - 1)d, where l is the last term.',
    ],
    formulas: [
      {
        label: 'nth Term of an AP',
        formulaLatex: 'a_n = a + (n - 1)d',
        notes: 'a = first term, d = common difference, n = term number',
      },
      {
        label: 'Sum of First n Terms',
        formulaLatex: 'S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right] = \\frac{n}{2}(a + l)',
        notes: 'l = a_n = last term',
      },
      {
        label: 'nth term from Sum Formula',
        formulaLatex: 'a_n = S_n - S_{n-1}',
      },
      {
        label: 'Sum of First n Natural Numbers',
        formulaLatex: 'S_n = \\frac{n(n + 1)}{2}',
      },
    ],
    flashcards: [
      {
        id: 'fc-ap-1',
        front: 'What is the formula for nth term from the end of an AP?',
        back: 'a_n(\\text{from end}) = l - (n - 1)d, where l is the last term.',
        category: 'Formulas',
      },
      {
        id: 'fc-ap-2',
        front: 'How to calculate aₙ when Sₙ is given as an algebraic expression?',
        back: 'aₙ = Sₙ - Sₙ₋₁',
        category: 'Methods',
      },
    ],
    commonTraps: [
      'Confusing n (number of terms, always a positive integer) with aₙ (the value of the term).',
      'Forgetting that d can be negative in decreasing sequences (e.g. 20, 18, 16 -> d = -2).',
    ],
    isFreeSample: false,
  },

  // 8. Introduction to Trigonometry
  {
    id: 'math-ch8',
    chapterSlug: 'introduction-to-trigonometry',
    chapterNumber: 8,
    chapterTitle: 'Introduction to Trigonometry',
    subject: 'maths',
    summaryNote: 'T-ratios (PBP/HHB), Standard angle values (0°, 30°, 45°, 60°, 90°), Fundamental Pythagorean Identities.',
    coreRules: [
      'In a right triangle: sin θ = Perpendicular/Hypotenuse, cos θ = Base/Hypotenuse, tan θ = Perpendicular/Base.',
      'Reciprocal relations: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.',
      'Quotient relations: tan θ = sin θ / cos θ, cot θ = cos θ / sin θ.',
    ],
    formulas: [
      {
        label: 'Fundamental Identity 1',
        formulaLatex: '\\sin^2\\theta + \\cos^2\\theta = 1 \\implies \\sin^2\\theta = 1 - \\cos^2\\theta',
      },
      {
        label: 'Fundamental Identity 2',
        formulaLatex: '1 + \\tan^2\\theta = \\sec^2\\theta \\implies \\sec^2\\theta - \\tan^2\\theta = 1',
      },
      {
        label: 'Fundamental Identity 3',
        formulaLatex: '1 + \\cot^2\\theta = \\text{cosec}^2\\theta \\implies \\text{cosec}^2\\theta - \\cot^2\\theta = 1',
      },
      {
        label: 'Standard Values Table',
        formulaLatex: '\\sin 30^\\circ = \\frac{1}{2}, \\quad \\sin 45^\\circ = \\frac{1}{\\sqrt{2}}, \\quad \\sin 60^\\circ = \\frac{\\sqrt{3}}{2}, \\quad \\tan 45^\\circ = 1',
      },
    ],
    flashcards: [
      {
        id: 'fc-trig-1',
        front: 'What is sec²θ - tan²θ equal to?',
        back: '1 (Valid for all 0° ≤ θ < 90°)',
        category: 'Identities',
      },
      {
        id: 'fc-trig-2',
        front: 'If sec θ + tan θ = p, what is the value of sec θ - tan θ?',
        back: '1 / p (Since sec²θ - tan²θ = (sec θ + tan θ)(sec θ - tan θ) = 1)',
        category: 'Shortcuts',
      },
      {
        id: 'fc-trig-3',
        front: 'What is sin 90° and cos 90°?',
        back: 'sin 90° = 1, cos 90° = 0',
        category: 'Values',
      },
    ],
    commonTraps: [
      'Writing (sin θ)² as sin θ² instead of sin²θ.',
      'Confusing Opposite (Perpendicular) and Adjacent (Base) when angle of reference changes between ∠A and ∠C.',
    ],
    isFreeSample: false,
  },

  // 12. Surface Areas and Volumes
  {
    id: 'math-ch12',
    chapterSlug: 'surface-areas-and-volumes',
    chapterNumber: 12,
    chapterTitle: 'Surface Areas and Volumes',
    subject: 'maths',
    summaryNote: 'CSA, TSA, and Volume of Cylinder, Cone, Sphere, Hemisphere, and Combination of Solids.',
    coreRules: [
      'When solids are joined: Total Surface Area = CSA(solid 1) + CSA(solid 2) (Do NOT add TSAs, as joined faces are hidden!).',
      'When a solid is melted/recast: Volume of original solid = Volume of new solid.',
    ],
    formulas: [
      {
        label: 'Right Circular Cylinder',
        formulaLatex: '\\text{CSA} = 2\\pi rh, \\quad \\text{TSA} = 2\\pi r(r + h), \\quad V = \\pi r^2 h',
      },
      {
        label: 'Right Circular Cone',
        formulaLatex: 'l = \\sqrt{r^2 + h^2}, \\quad \\text{CSA} = \\pi rl, \\quad \\text{TSA} = \\pi r(l + r), \\quad V = \\frac{1}{3}\\pi r^2 h',
      },
      {
        label: 'Solid Sphere',
        formulaLatex: '\\text{Surface Area} = 4\\pi r^2, \\quad V = \\frac{4}{3}\\pi r^3',
      },
      {
        label: 'Solid Hemisphere',
        formulaLatex: '\\text{CSA} = 2\\pi r^2, \\quad \\text{TSA} = 3\\pi r^2, \\quad V = \\frac{2}{3}\\pi r^3',
      },
    ],
    flashcards: [
      {
        id: 'fc-sav-1',
        front: 'What is the TSA of a solid hemisphere of radius r?',
        back: 'TSA = 3πr² (CSA is 2πr² + flat circular base πr²)',
        category: 'Formulas',
      },
      {
        id: 'fc-sav-2',
        front: 'When a cone is mounted on a hemisphere of same radius r, what is the TSA of the toy?',
        back: 'TSA = CSA of Cone + CSA of Hemisphere = πrl + 2πr²',
        category: 'Combinations',
      },
    ],
    commonTraps: [
      'Using height h instead of slant height l in Cone CSA (Always calculate l = √(r² + h²)).',
      'Adding TSAs of combining shapes instead of CSAs.',
    ],
    isFreeSample: false,
  },

  // --- SCIENCE ---
  // 1. Chemical Reactions and Equations
  {
    id: 'sci-ch1',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subject: 'science',
    summaryNote: 'Types of reactions, color changes, precipitate charts, oxidation & reduction.',
    coreRules: [
      'Combination: A + B → AB (e.g. Quicklime CaO + H₂O → Slaked lime Ca(OH)₂ + Heat).',
      'Decomposition: Thermal (CaCO₃, FeSO₄, Pb(NO₃)₂), Electrolytic (H₂O), Photolytic (AgCl, AgBr).',
      'Displacement: More reactive metal displaces less reactive metal (Fe + CuSO₄ [Blue] → FeSO₄ [Pale green] + Cu [Brown]).',
      'Redox: Oxidation is Gain of O / Loss of H. Reduction is Gain of H / Loss of O.',
    ],
    formulas: [
      {
        label: 'Slaked Lime & Whitewashing',
        formulaLatex: 'CaO(s) + H_2O(l) \\rightarrow Ca(OH)_2(aq) \\xrightarrow{CO_2} CaCO_3(s) (\\text{Shiny finish}) + H_2O',
      },
      {
        label: 'Lead Nitrate Thermal Decomposition',
        formulaLatex: '2Pb(NO_3)_2(s) \\xrightarrow{\\Delta} 2PbO(s) [\\text{Yellow}] + 4NO_2(g) [\\text{Brown fumes}] + O_2(g)',
      },
      {
        label: 'Ferrous Sulphate Thermal Decomposition',
        formulaLatex: '2FeSO_4(s) [\\text{Green}] \\xrightarrow{\\Delta} Fe_2O_3(s) [\\text{Red-brown}] + SO_2(g) + SO_3(g)',
      },
    ],
    flashcards: [
      {
        id: 'fc-cre-1',
        front: 'What gas causes brown fumes on heating lead nitrate?',
        back: 'Nitrogen Dioxide (NO₂) gas.',
        category: 'Reactions',
      },
      {
        id: 'fc-cre-2',
        front: 'What is the color change when an iron nail is placed in blue CuSO₄ solution?',
        back: 'Blue solution turns pale green (FeSO₄ formed), and reddish-brown copper deposits on the iron nail.',
        category: 'Observations',
      },
      {
        id: 'fc-cre-3',
        front: 'Which reactions are used in black and white photography?',
        back: 'Photolytic decomposition of Silver Chloride (2AgCl → 2Ag + Cl₂) and Silver Bromide (2AgBr → 2Ag + Br₂).',
        category: 'NCERT Facts',
      },
    ],
    commonTraps: [
      'Confusing oxidizing agent (substance that gets reduced) with reducing agent (substance that gets oxidized).',
      'Writing unbalanced equations in board exams.',
    ],
    isFreeSample: true,
  },

  // 11. Electricity
  {
    id: 'sci-ch11',
    chapterSlug: 'electricity',
    chapterNumber: 11,
    chapterTitle: 'Electricity',
    subject: 'science',
    summaryNote: 'Ohm\'s law, factors affecting resistance, series vs parallel combinations, Joule\'s heating law.',
    coreRules: [
      'Current I = Q / t (Unit: Ampere = Coulomb / second).',
      'Potential difference V = W / Q (Unit: Volt = Joule / Coulomb).',
      'Resistance R = ρ (l / A). Resistivity ρ depends only on material and temperature, NOT on length or area!',
      'Series: Current I is constant, V = V₁ + V₂, R_eq = R₁ + R₂ + ...',
      'Parallel: Voltage V is constant, I = I₁ + I₂, 1/R_eq = 1/R₁ + 1/R₂ + ...',
    ],
    formulas: [
      {
        label: 'Ohm\'s Law & Resistance',
        formulaLatex: 'V = IR, \\quad R = \\rho\\frac{l}{A} = \\rho\\frac{l}{\\pi r^2}',
      },
      {
        label: 'Parallel Equivalent Resistance (2 Resistors)',
        formulaLatex: 'R_p = \\frac{R_1 R_2}{R_1 + R_2}',
      },
      {
        label: 'Joule\'s Law of Heating',
        formulaLatex: 'H = I^2 R t = V I t = \\frac{V^2}{R} t',
      },
      {
        label: 'Electric Power',
        formulaLatex: 'P = VI = I^2 R = \\frac{V^2}{R}, \\quad 1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}',
      },
    ],
    flashcards: [
      {
        id: 'fc-el-1',
        front: 'If a wire of resistance R is stretched to double its length (same volume), what is its new resistance?',
        back: 'New resistance R\' = 4R (Since length doubles, area halves: R ∝ l²).',
        category: 'Numericals',
      },
      {
        id: 'fc-el-2',
        front: 'What is 1 commercial unit of electric energy (1 kWh) in Joules?',
        back: '1 kWh = 3.6 × 10⁶ Joules (or 3.6 MJ).',
        category: 'Units',
      },
      {
        id: 'fc-el-3',
        front: 'Why are heating elements made of alloys like nichrome rather than pure metals?',
        back: 'Alloys have higher resistivity and do not oxidize (burn) readily at high temperatures.',
        category: 'Reasoning',
      },
    ],
    commonTraps: [
      'Assuming resistivity (ρ) changes when a wire is stretched or cut (Resistivity stays CONSTANT for same material).',
      'Using H = I²Rt in parallel circuits where voltage V is common (Prefer H = (V²/R)t for parallel branches).',
    ],
    isFreeSample: false,
  },
];
