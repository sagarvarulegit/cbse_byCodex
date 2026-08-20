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
  {
    "id": "math-ch1",
    "chapterSlug": "real-numbers",
    "chapterNumber": 1,
    "chapterTitle": "Real Numbers",
    "subject": "maths",
    "summaryNote": "Fundamental Theorem of Arithmetic, Prime Factorisation, HCF-LCM relationships, and Irrationality Proofs.",
    "coreRules": [
      "Fundamental Theorem of Arithmetic (FTA): Every composite number can be uniquely expressed as a product of primes, except for the order in which prime factors occur.",
      "For any two positive integers a and b: HCF(a, b) × LCM(a, b) = a × b. (Warning: This product relation holds ONLY for exactly 2 numbers).",
      "Divisibility Lemma: If p is a prime number and p divides a², then p divides a, where a is a positive integer.",
      "A rational number p/q in simplest form has a terminating decimal expansion if and only if prime factorisation of q is of the form 2ⁿ · 5ᵐ (n, m are non-negative integers)."
    ],
    "formulas": [
      {
        "label": "Product of Two Positive Integers",
        "formulaLatex": "\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b",
        "notes": "Valid ONLY for two integers a and b. HCF(a, b, c) × LCM(a, b, c) ≠ a × b × c"
      },
      {
        "label": "Prime Factorisation Form for HCF & LCM",
        "formulaLatex": "\\text{HCF} = \\prod p_i^{\\min(a_i, b_i)}, \\quad \\text{LCM} = \\prod p_i^{\\max(a_i, b_i)}",
        "notes": "HCF is product of smallest powers; LCM is product of greatest powers of all prime factors involved"
      },
      {
        "label": "Terminating Decimal Condition",
        "formulaLatex": "q = 2^n \\cdot 5^m \\quad (n, m \\in \\mathbb{W}) \\implies \\frac{p}{q} \\text{ is Terminating}",
        "notes": "If q has any other prime factor like 3, 7, 11, decimal expansion is non-terminating repeating"
      },
      {
        "label": "Contradiction Step for Irrationality (√p)",
        "formulaLatex": "\\sqrt{p} = \\frac{a}{b} \\implies p b^2 = a^2 \\implies p \\mid a \\text{ and } p \\mid b",
        "notes": "Contradicts the initial premise that a and b are co-prime integers (gcd(a, b) = 1)"
      }
    ],
    "flashcards": [
      {
        "id": "fc-rn-1",
        "front": "What is the relation between HCF, LCM and two numbers a and b?",
        "back": "HCF(a, b) × LCM(a, b) = a × b",
        "category": "Formulas"
      },
      {
        "id": "fc-rn-2",
        "front": "Can HCF(a, b, c) × LCM(a, b, c) = a × b × c for three numbers?",
        "back": "No! This product formula is ONLY valid for exactly two numbers.",
        "category": "Traps"
      },
      {
        "id": "fc-rn-3",
        "front": "What is the condition for denominator q of rational number p/q to have a terminating decimal?",
        "back": "q must be of the form 2ⁿ · 5ᵐ, where n and m are non-negative integers.",
        "category": "Theorems"
      },
      {
        "id": "fc-rn-4",
        "front": "What is the smallest prime number and smallest composite number?",
        "back": "Smallest Prime = 2, Smallest Composite = 4. HCF(2, 4) = 2, LCM(2, 4) = 4.",
        "category": "Recall"
      }
    ],
    "commonTraps": [
      "Applying HCF × LCM = a × b × c for three integers (Always use prime factorisation powers for 3 numbers).",
      "Forgetting to state that a and b are co-prime integers in √2 / √3 / √5 irrationality proofs.",
      "Checking prime factors of denominator q before reducing the fraction p/q to its simplest lowest terms."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch2",
    "chapterSlug": "polynomials",
    "chapterNumber": 2,
    "chapterTitle": "Polynomials",
    "subject": "maths",
    "summaryNote": "Zeroes of linear, quadratic, and cubic polynomials, geometric meaning, and relations with coefficients.",
    "coreRules": [
      "The number of zeroes of a polynomial y = p(x) equals the number of points where the graph intersects or touches the x-axis.",
      "A polynomial of degree n can have at most n real zeroes.",
      "For quadratic polynomial ax² + bx + c (a ≠ 0), sum of zeroes is -b/a and product of zeroes is c/a.",
      "Quadratic polynomial with zeroes α and β is given by: k[x² - (α + β)x + αβ], where k is any non-zero real constant."
    ],
    "formulas": [
      {
        "label": "Sum of Zeroes (Quadratic: ax² + bx + c)",
        "formulaLatex": "\\alpha + \\beta = -\\frac{b}{a} = -\\frac{\\text{Coefficient of } x}{\\text{Coefficient of } x^2}"
      },
      {
        "label": "Product of Zeroes (Quadratic: ax² + bx + c)",
        "formulaLatex": "\\alpha \\cdot \\beta = \\frac{c}{a} = \\frac{\\text{Constant term}}{\\text{Coefficient of } x^2}"
      },
      {
        "label": "Quadratic Polynomial Formation",
        "formulaLatex": "p(x) = k \\left[ x^2 - (\\alpha + \\beta)x + (\\alpha\\beta) \\right], \\quad k \\neq 0"
      },
      {
        "label": "Sum of Squares Identity (α² + β²)",
        "formulaLatex": "\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta = \\left(-\\frac{b}{a}\\right)^2 - 2\\left(\\frac{c}{a}\\right)",
        "notes": "Frequently tested in CBSE board exams"
      },
      {
        "label": "Difference of Zeroes (|α - β|)",
        "formulaLatex": "(\\alpha - \\beta)^2 = (\\alpha + \\beta)^2 - 4\\alpha\\beta \\implies |\\alpha - \\beta| = \\frac{\\sqrt{b^2 - 4ac}}{|a|} = \\frac{\\sqrt{D}}{|a|}"
      },
      {
        "label": "Cubic Polynomial Relations (ax³ + bx² + cx + d)",
        "formulaLatex": "\\alpha + \\beta + \\gamma = -\\frac{b}{a}, \\quad \\alpha\\beta + \\beta\\gamma + \\gamma\\alpha = \\frac{c}{a}, \\quad \\alpha\\beta\\gamma = -\\frac{d}{a}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-poly-1",
        "front": "If α and β are zeroes of ax² + bx + c, what is α + β and α·β?",
        "back": "α + β = -b/a,  α·β = c/a",
        "category": "Formulas"
      },
      {
        "id": "fc-poly-2",
        "front": "How to express α² + β² in terms of sum and product of zeroes?",
        "back": "α² + β² = (α + β)² - 2αβ",
        "category": "Identities"
      },
      {
        "id": "fc-poly-3",
        "front": "How many zeroes does a quadratic polynomial graph have if it does not intersect the x-axis?",
        "back": "Zero real zeroes (0 real roots, D < 0).",
        "category": "Graphs"
      },
      {
        "id": "fc-poly-4",
        "front": "Write the quadratic polynomial whose sum of zeroes is S and product of zeroes is P.",
        "back": "k[x² - Sx + P], where k ≠ 0 is a real constant.",
        "category": "Formulas"
      }
    ],
    "commonTraps": [
      "Missing the negative sign in sum of zeroes: it is -b/a, NOT b/a.",
      "Writing x² + (α+β)x + αβ instead of x² - (α+β)x + αβ.",
      "Counting intersections with the y-axis when asked for number of zeroes of p(x) (Only count x-axis intersections)."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch3",
    "chapterSlug": "pair-of-linear-equations-in-two-variables",
    "chapterNumber": 3,
    "chapterTitle": "Pair of Linear Equations in Two Variables",
    "subject": "maths",
    "summaryNote": "Consistency conditions, graphical interpretations, substitution and elimination methods, and upstream/downstream word problems.",
    "coreRules": [
      "Standard Form: a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0.",
      "Intersecting Lines: a₁/a₂ ≠ b₁/b₂ → Exactly 1 unique solution → Consistent system.",
      "Coincident Lines: a₁/a₂ = b₁/b₂ = c₁/c₂ → Infinitely many solutions → Dependent and Consistent.",
      "Parallel Lines: a₁/a₂ = b₁/b₂ ≠ c₁/c₂ → No solution → Inconsistent system.",
      "In upstream/downstream problems: Speed upstream = (x - y) km/h, Speed downstream = (x + y) km/h (where x = speed in still water, y = stream speed)."
    ],
    "formulas": [
      {
        "label": "Unique Solution (Intersecting Lines)",
        "formulaLatex": "\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}",
        "notes": "Consistent with 1 unique solution point (x, y)"
      },
      {
        "label": "Infinitely Many Solutions (Coincident Lines)",
        "formulaLatex": "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}",
        "notes": "Lines overlap completely; system is dependent & consistent"
      },
      {
        "label": "No Solution (Parallel Lines)",
        "formulaLatex": "\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}",
        "notes": "Lines never meet; system is inconsistent"
      },
      {
        "label": "Upstream & Downstream Boat Speeds",
        "formulaLatex": "v_{\\text{down}} = x + y, \\quad v_{\\text{up}} = x - y \\quad (x > y)",
        "notes": "Time taken = Distance / Speed. Upstream time > Downstream time for same distance"
      },
      {
        "label": "Fraction and Work-Rate Relation",
        "formulaLatex": "\\text{Work done in 1 day} = \\frac{1}{x}, \\quad \\frac{m}{x} + \\frac{w}{y} = \\frac{1}{\\text{Total days}}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-lin-1",
        "front": "What is the condition for a pair of linear equations to have infinitely many solutions?",
        "back": "a₁/a₂ = b₁/b₂ = c₁/c₂ (Coincident lines, dependent consistent system).",
        "category": "Conditions"
      },
      {
        "id": "fc-lin-2",
        "front": "What is the condition for two lines to be parallel with no solution?",
        "back": "a₁/a₂ = b₁/b₂ ≠ c₁/c₂ (Inconsistent system).",
        "category": "Conditions"
      },
      {
        "id": "fc-lin-3",
        "front": "If a boat speed is x in still water and stream speed is y, what are upstream and downstream speeds?",
        "back": "Upstream = (x - y) km/h,  Downstream = (x + y) km/h.",
        "category": "Word Problems"
      }
    ],
    "commonTraps": [
      "Comparing ratios without ensuring both equations have constants on the same side (e.g. both in ax+by+c=0 or both in ax+by=c form).",
      "Confusing upstream (x - y) with downstream (x + y). Upstream is ALWAYS against the current (minus).",
      "Calling parallel lines \"consistent\" (Parallel lines have NO solution, so they are INCONSISTENT)."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch4",
    "chapterSlug": "quadratic-equations",
    "chapterNumber": 4,
    "chapterTitle": "Quadratic Equations",
    "subject": "maths",
    "summaryNote": "Standard form ax² + bx + c = 0 (a ≠ 0), Quadratic Formula, Discriminant Nature of Roots, and speed-distance word problems.",
    "coreRules": [
      "Standard Form: ax² + bx + c = 0, where a, b, c ∈ ℝ and a ≠ 0.",
      "Discriminant D = b² - 4ac determines the nature of roots.",
      "D > 0: Two distinct real roots. D = 0: Two equal real roots (-b / 2a). D < 0: No real roots.",
      "If roots are equal, D = b² - 4ac = 0 → b² = 4ac."
    ],
    "formulas": [
      {
        "label": "Discriminant Formula",
        "formulaLatex": "D = b^2 - 4ac"
      },
      {
        "label": "Quadratic Formula (Sridharacharya Formula)",
        "formulaLatex": "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} = \\frac{-b \\pm \\sqrt{D}}{2a}"
      },
      {
        "label": "Nature of Roots Summary",
        "formulaLatex": "D > 0 \\implies 2 \\text{ Real Distinct}, \\quad D = 0 \\implies 2 \\text{ Real Equal } \\left(-\\frac{b}{2a}\\right), \\quad D < 0 \\implies \\text{No Real Roots}"
      },
      {
        "label": "Sum and Product of Roots (α, β)",
        "formulaLatex": "\\alpha + \\beta = -\\frac{b}{a}, \\quad \\alpha \\cdot \\beta = \\frac{c}{a}"
      },
      {
        "label": "Time Difference Speed Equation",
        "formulaLatex": "\\frac{d}{s - \\Delta s} - \\frac{d}{s} = t_{\\text{diff}}",
        "notes": "Used when reduced speed increases travel time by t_diff hours"
      }
    ],
    "flashcards": [
      {
        "id": "fc-qe-1",
        "front": "What condition gives two equal real roots in ax² + bx + c = 0?",
        "back": "Discriminant D = b² - 4ac = 0. The equal root is x = -b / (2a).",
        "category": "Discriminant"
      },
      {
        "id": "fc-qe-2",
        "front": "Write the quadratic formula for roots of ax² + bx + c = 0.",
        "back": "x = (-b ± √(b² - 4ac)) / (2a)",
        "category": "Formulas"
      },
      {
        "id": "fc-qe-3",
        "front": "If D < 0, what is the nature of the roots in Class 10 syllabus?",
        "back": "No Real Roots (Roots are imaginary / non-real complex numbers).",
        "category": "Discriminant"
      }
    ],
    "commonTraps": [
      "Forgetting the ± sign in the quadratic formula numerator.",
      "Dividing only the radical term by 2a instead of the whole (-b ± √D).",
      "Sign error when b is negative: -(-b) becomes +b."
    ],
    "isFreeSample": true
  },
  {
    "id": "math-ch5",
    "chapterSlug": "arithmetic-progressions",
    "chapterNumber": 5,
    "chapterTitle": "Arithmetic Progressions",
    "subject": "maths",
    "summaryNote": "nth term formula, sum of first n terms, consecutive terms selection, and nth term from the end.",
    "coreRules": [
      "An AP is a sequence where difference between consecutive terms is constant (common difference d = aₙ - aₙ₋₁).",
      "d can be positive, negative, or zero.",
      "For 3 terms in AP, assume: (a - d), a, (a + d) [Sum = 3a].",
      "For 4 terms in AP, assume: (a - 3d), (a - d), (a + d), (a + 3d) [Common diff = 2d].",
      "nth term from the end = l - (n - 1)d, where l is the last term."
    ],
    "formulas": [
      {
        "label": "nth Term of an AP",
        "formulaLatex": "a_n = a + (n - 1)d",
        "notes": "a = first term, d = common difference, n = term number"
      },
      {
        "label": "Sum of First n Terms",
        "formulaLatex": "S_n = \\frac{n}{2}\\left[2a + (n - 1)d\\right] = \\frac{n}{2}(a + l)",
        "notes": "l = a_n = last term"
      },
      {
        "label": "nth Term from Sum Formula",
        "formulaLatex": "a_n = S_n - S_{n-1} \\quad (n \\ge 2), \\quad a_1 = S_1"
      },
      {
        "label": "nth Term from the End",
        "formulaLatex": "a_n(\\text{from end}) = l - (n - 1)d",
        "notes": "l = last term of AP"
      },
      {
        "label": "Sum of First n Natural Numbers",
        "formulaLatex": "S_n = 1 + 2 + 3 + \\dots + n = \\frac{n(n + 1)}{2}"
      },
      {
        "label": "Arithmetic Mean of a and b",
        "formulaLatex": "A = \\frac{a + b}{2}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-ap-1",
        "front": "What is the formula for nth term from the end of an AP?",
        "back": "a_n(from end) = l - (n - 1)d, where l is the last term.",
        "category": "Formulas"
      },
      {
        "id": "fc-ap-2",
        "front": "How to calculate aₙ when Sₙ is given as an algebraic expression in n?",
        "back": "aₙ = Sₙ - Sₙ₋₁",
        "category": "Methods"
      },
      {
        "id": "fc-ap-3",
        "front": "What are 3 symmetric terms to assume in AP?",
        "back": "(a - d), a, (a + d). Their sum simplifies to 3a.",
        "category": "Shortcuts"
      }
    ],
    "commonTraps": [
      "Confusing n (number of terms, which MUST be a positive integer) with aₙ (the numerical value of the term).",
      "Forgetting that d can be negative in decreasing sequences (e.g. 20, 18, 16 -> d = -2).",
      "Assuming S₁₀ - S₉ gives d (S₁₀ - S₉ gives a₁₀, NOT d!)."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch6",
    "chapterSlug": "triangles",
    "chapterNumber": 6,
    "chapterTitle": "Triangles",
    "subject": "maths",
    "summaryNote": "Basic Proportionality Theorem (Thales), Converse of BPT, Criteria for Similarity (AAA/AA, SAS, SSS), and properties of similar triangles.",
    "coreRules": [
      "Two polygons with the same number of sides are similar if: (i) their corresponding angles are equal, and (ii) their corresponding sides are in the same ratio (proportional).",
      "Basic Proportionality Theorem (BPT / Thales Theorem): If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, the other two sides are divided in the same ratio.",
      "Converse of BPT: If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side.",
      "Similarity Criteria: AAA (or AA), SSS, and SAS.",
      "Ratio of perimeters of two similar triangles equals the ratio of their corresponding sides."
    ],
    "formulas": [
      {
        "label": "Basic Proportionality Theorem (Thales Theorem)",
        "formulaLatex": "\\text{In } \\triangle ABC, \\; DE \\parallel BC \\implies \\frac{AD}{DB} = \\frac{AE}{EC} \\iff \\frac{AD}{AB} = \\frac{AE}{AC} = \\frac{DE}{BC}"
      },
      {
        "label": "Converse of BPT",
        "formulaLatex": "\\frac{AD}{DB} = \\frac{AE}{EC} \\implies DE \\parallel BC"
      },
      {
        "label": "Ratio of Perimeters of Similar Triangles",
        "formulaLatex": "\\frac{\\text{Perimeter}(\\triangle ABC)}{\\text{Perimeter}(\\triangle PQR)} = \\frac{AB}{PQ} = \\frac{BC}{QR} = \\frac{AC}{PR}"
      },
      {
        "label": "Ratio of Altitudes, Medians & Bisectors",
        "formulaLatex": "\\frac{\\text{Altitude}_1}{\\text{Altitude}_2} = \\frac{\\text{Median}_1}{\\text{Median}_2} = \\frac{\\text{Bisector}_1}{\\text{Bisector}_2} = \\frac{\\text{Side}_1}{\\text{Side}_2}"
      },
      {
        "label": "Pythagoras Theorem in Right Triangle",
        "formulaLatex": "AC^2 = AB^2 + BC^2 \\quad (\\text{In } \\triangle ABC, \\angle B = 90^\\circ)"
      }
    ],
    "flashcards": [
      {
        "id": "fc-tri-1",
        "front": "State the Basic Proportionality Theorem (Thales Theorem).",
        "back": "If a line is drawn parallel to one side of a triangle intersecting the other two sides, it divides them in the same ratio: AD/DB = AE/EC.",
        "category": "Theorems"
      },
      {
        "id": "fc-tri-2",
        "front": "What is the AA similarity criterion?",
        "back": "If two angles of one triangle are respectively equal to two angles of another triangle, the two triangles are similar.",
        "category": "Criteria"
      },
      {
        "id": "fc-tri-3",
        "front": "What is the relation between the ratio of perimeters and sides of two similar triangles?",
        "back": "The ratio of perimeters is equal to the ratio of their corresponding sides.",
        "category": "Properties"
      }
    ],
    "commonTraps": [
      "Writing incorrect vertex correspondence order (e.g. writing ΔABC ~ ΔPQR when vertex A corresponds to Q: write ΔABC ~ ΔQPR).",
      "Confusing congruence criteria (RHS, ASA) with similarity criteria (AAA, SAS, SSS).",
      "Applying BPT when the line is NOT parallel to a side."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch7",
    "chapterSlug": "coordinate-geometry",
    "chapterNumber": 7,
    "chapterTitle": "Coordinate Geometry",
    "subject": "maths",
    "summaryNote": "Distance formula, Section formula (internal division), Midpoint formula, and Centroid of a triangle.",
    "coreRules": [
      "Distance between P(x₁, y₁) and Q(x₂, y₂) is given by the distance formula.",
      "Distance of a point P(x, y) from the origin (0, 0) is √(x² + y²).",
      "Section formula finds coordinates of point dividing line segment joining two points in ratio m₁ : m₂ internally.",
      "Midpoint formula is a special case of section formula where m₁ : m₂ = 1 : 1.",
      "Centroid G(x, y) of a triangle divides each median in the ratio 2 : 1 from the vertex."
    ],
    "formulas": [
      {
        "label": "Distance Formula",
        "formulaLatex": "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}"
      },
      {
        "label": "Distance from Origin (0, 0)",
        "formulaLatex": "OP = \\sqrt{x^2 + y^2}"
      },
      {
        "label": "Section Formula (Internal Division m₁ : m₂)",
        "formulaLatex": "P(x, y) = \\left( \\frac{m_1 x_2 + m_2 x_1}{m_1 + m_2}, \\; \\frac{m_1 y_2 + m_2 y_1}{m_1 + m_2} \\right)"
      },
      {
        "label": "Section Formula for Ratio k : 1",
        "formulaLatex": "P(x, y) = \\left( \\frac{k x_2 + x_1}{k + 1}, \\; \\frac{k y_2 + y_1}{k + 1} \\right)",
        "notes": "Simplifies finding unknown dividing ratio k : 1"
      },
      {
        "label": "Midpoint Formula",
        "formulaLatex": "M(x, y) = \\left( \\frac{x_1 + x_2}{2}, \\; \\frac{y_1 + y_2}{2} \\right)"
      },
      {
        "label": "Centroid of Triangle (x₁, y₁), (x₂, y₂), (x₃, y₃)",
        "formulaLatex": "G(x, y) = \\left( \\frac{x_1 + x_2 + x_3}{3}, \\; \\frac{y_1 + y_2 + y_3}{3} \\right)"
      }
    ],
    "flashcards": [
      {
        "id": "fc-cg-1",
        "front": "What is the distance of point P(x, y) from the origin?",
        "back": "√(x² + y²)",
        "category": "Formulas"
      },
      {
        "id": "fc-cg-2",
        "front": "Write the section formula for a point dividing joining of (x₁, y₁) and (x₂, y₂) in ratio m₁ : m₂.",
        "back": "P(x, y) = ((m₁x₂ + m₂x₁) / (m₁ + m₂),  (m₁y₂ + m₂y₁) / (m₁ + m₂))",
        "category": "Formulas"
      },
      {
        "id": "fc-cg-3",
        "front": "What are the coordinates of the centroid of a triangle with vertices (x₁, y₁), (x₂, y₂), (x₃, y₃)?",
        "back": "G = ((x₁ + x₂ + x₃)/3,  (y₁ + y₂ + y₃)/3)",
        "category": "Formulas"
      }
    ],
    "commonTraps": [
      "Swapping m₁ and m₂ in section formula (m₁ multiplies with x₂, m₂ multiplies with x₁: cross-multiplication rule).",
      "Forgetting that any point on x-axis is of the form (x, 0) and on y-axis is of the form (0, y).",
      "Calculating distance without squaring differences: (x₂ - x₁)² is always non-negative."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch8",
    "chapterSlug": "introduction-to-trigonometry",
    "chapterNumber": 8,
    "chapterTitle": "Introduction to Trigonometry",
    "subject": "maths",
    "summaryNote": "T-ratios (P/B/H), Standard angle values (0°, 30°, 45°, 60°, 90°), and Fundamental Pythagorean Identities.",
    "coreRules": [
      "In a right triangle: sin θ = Perpendicular/Hypotenuse, cos θ = Base/Hypotenuse, tan θ = Perpendicular/Base.",
      "Reciprocal relations: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
      "Quotient relations: tan θ = sin θ / cos θ, cot θ = cos θ / sin θ.",
      "Values of sin θ and cos θ never exceed 1 (|sin θ| ≤ 1, |cos θ| ≤ 1)."
    ],
    "formulas": [
      {
        "label": "Fundamental Identity 1",
        "formulaLatex": "\\sin^2\\theta + \\cos^2\\theta = 1 \\implies \\sin^2\\theta = 1 - \\cos^2\\theta, \\quad \\cos^2\\theta = 1 - \\sin^2\\theta"
      },
      {
        "label": "Fundamental Identity 2",
        "formulaLatex": "1 + \\tan^2\\theta = \\sec^2\\theta \\implies \\sec^2\\theta - \\tan^2\\theta = 1 \\implies (\\sec\\theta + \\tan\\theta)(\\sec\\theta - \\tan\\theta) = 1"
      },
      {
        "label": "Fundamental Identity 3",
        "formulaLatex": "1 + \\cot^2\\theta = \\text{cosec}^2\\theta \\implies \\text{cosec}^2\\theta - \\cot^2\\theta = 1"
      },
      {
        "label": "Standard Angle Values Table",
        "formulaLatex": "\\sin 0^\\circ=0, \\; \\sin 30^\\circ=\\frac{1}{2}, \\; \\sin 45^\\circ=\\frac{1}{\\sqrt{2}}, \\; \\sin 60^\\circ=\\frac{\\sqrt{3}}{2}, \\; \\sin 90^\\circ=1"
      },
      {
        "label": "Tangent Standard Values",
        "formulaLatex": "\\tan 0^\\circ=0, \\; \\tan 30^\\circ=\\frac{1}{\\sqrt{3}}, \\; \\tan 45^\\circ=1, \\; \\tan 60^\\circ=\\sqrt{3}, \\; \\tan 90^\\circ=\\text{Not Defined}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-trig-1",
        "front": "What is sec²θ - tan²θ equal to?",
        "back": "1 (Valid for all 0° ≤ θ < 90°)",
        "category": "Identities"
      },
      {
        "id": "fc-trig-2",
        "front": "If sec θ + tan θ = p, what is the value of sec θ - tan θ?",
        "back": "1 / p (Since sec²θ - tan²θ = (sec θ + tan θ)(sec θ - tan θ) = 1)",
        "category": "Shortcuts"
      },
      {
        "id": "fc-trig-3",
        "front": "What is sin 90° and cos 90°?",
        "back": "sin 90° = 1,  cos 90° = 0",
        "category": "Values"
      },
      {
        "id": "fc-trig-4",
        "front": "What is the maximum value of sin θ for 0° ≤ θ ≤ 90°?",
        "back": "Maximum value is 1 (at θ = 90°).",
        "category": "Range"
      }
    ],
    "commonTraps": [
      "Writing (sin θ)² as sin θ² instead of sin²θ.",
      "Confusing Opposite (Perpendicular) and Adjacent (Base) when angle of reference changes between ∠A and ∠C.",
      "Forgetting that tan 90° and cosec 0° are undefined."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch9",
    "chapterSlug": "some-applications-of-trigonometry",
    "chapterNumber": 9,
    "chapterTitle": "Some Applications of Trigonometry",
    "subject": "maths",
    "summaryNote": "Heights and distances, line of sight, angle of elevation, angle of depression, and 30°-60°-90° right triangle shortcuts.",
    "coreRules": [
      "Line of sight is the line drawn from the eye of an observer to the point in the object viewed.",
      "Angle of elevation: Formed by the line of sight with the horizontal when point viewed is ABOVE horizontal level.",
      "Angle of depression: Formed by the line of sight with the horizontal when point viewed is BELOW horizontal level.",
      "Angle of depression from top of tower to object = Angle of elevation from object to top of tower (Alternate interior angles)."
    ],
    "formulas": [
      {
        "label": "Basic Height-Distance Relation",
        "formulaLatex": "\\tan\\theta = \\frac{\\text{Height } (h)}{\\text{Distance } (d)} \\implies h = d \\tan\\theta"
      },
      {
        "label": "30°-60°-90° Triangle Side Ratio Shortcut",
        "formulaLatex": "\\text{Side opp. } 30^\\circ : \\text{Side opp. } 60^\\circ : \\text{Hypotenuse} = 1 : \\sqrt{3} : 2",
        "notes": "If base = x, opp 30° = x/√3, opp 60° = x√3"
      },
      {
        "label": "45°-45°-90° Triangle Side Ratio Shortcut",
        "formulaLatex": "\\text{Base} : \\text{Perpendicular} : \\text{Hypotenuse} = 1 : 1 : \\sqrt{2}",
        "notes": "Height = Base when angle of elevation is 45°"
      },
      {
        "label": "Two Observations of Tower (h from distance d between points)",
        "formulaLatex": "h = \\frac{d}{\\cot\\alpha - \\cot\\beta} = \\frac{d \\tan\\alpha \\tan\\beta}{\\tan\\beta - \\tan\\alpha} \\quad (\\beta > \\alpha)"
      }
    ],
    "flashcards": [
      {
        "id": "fc-app-1",
        "front": "What is the relation between angle of depression and angle of elevation for the same line of sight?",
        "back": "They are equal (alternate interior angles formed with parallel horizontals).",
        "category": "Concepts"
      },
      {
        "id": "fc-app-2",
        "front": "If the angle of elevation of the sun is 45°, what is the relation between height of a tower and its shadow length?",
        "back": "Height of tower = Length of its shadow (since tan 45° = 1).",
        "category": "Shortcuts"
      },
      {
        "id": "fc-app-3",
        "front": "What are the side ratios for a 30°-60°-90° right triangle?",
        "back": "1 : √3 : 2 (Side opp. 30° = 1, Side opp. 60° = √3, Hypotenuse = 2).",
        "category": "Ratios"
      }
    ],
    "commonTraps": [
      "Measuring angle of depression from the vertical wall instead of the horizontal eye-level line.",
      "Using tan θ = Base / Perpendicular (tan θ is ALWAYS Perpendicular / Base).",
      "Forgetting to add the height of the observer (e.g. 1.5 m) to the calculated triangle height to get total tree/tower height."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch10",
    "chapterSlug": "circles",
    "chapterNumber": 10,
    "chapterTitle": "Circles",
    "subject": "maths",
    "summaryNote": "Properties of tangents to a circle, tangent-radius perpendicularity, and equality of tangent lengths from an external point.",
    "coreRules": [
      "Theorem 10.1: The tangent at any point of a circle is perpendicular to the radius through the point of contact (OP ⊥ AB).",
      "Theorem 10.2: The lengths of tangents drawn from an external point to a circle are equal (PA = PB).",
      "The center of the circle lies on the bisector of the angle between the two tangents drawn from an external point.",
      "The angle between two tangents from an external point and the angle subtended by the line segment joining points of contact at center are supplementary (∠APB + ∠AOB = 180°).",
      "In a quadrilateral ABCD circumscribing a circle: AB + CD = AD + BC (Sum of opposite sides are equal)."
    ],
    "formulas": [
      {
        "label": "Tangent-Radius Perpendicularity",
        "formulaLatex": "OP \\perp PT \\implies \\angle OPT = 90^\\circ \\implies PT = \\sqrt{OP^2 - r^2}",
        "notes": "PT = length of tangent, OP = distance from center, r = radius"
      },
      {
        "label": "Lengths of Tangents from External Point",
        "formulaLatex": "PA = PB \\quad (\\text{where P is external, A and B are points of contact})"
      },
      {
        "label": "Supplementary Angles at Center and Tangent Intersection",
        "formulaLatex": "\\angle APB + \\angle AOB = 180^\\circ"
      },
      {
        "label": "Circumscribed Quadrilateral Property",
        "formulaLatex": "AB + CD = AD + BC",
        "notes": "Frequently tested in CBSE 3-mark & 5-mark proofs"
      },
      {
        "label": "Inradius of Right Triangle (Legs a, b; Hypotenuse c)",
        "formulaLatex": "r = \\frac{a + b - c}{2}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-circ-1",
        "front": "What is the angle between a tangent to a circle and the radius drawn to the point of contact?",
        "back": "90° (Radius is perpendicular to the tangent at point of contact).",
        "category": "Theorems"
      },
      {
        "id": "fc-circ-2",
        "front": "What is the relationship between lengths of two tangents drawn from an external point P to a circle?",
        "back": "PA = PB (The lengths of tangents drawn from an external point are equal).",
        "category": "Theorems"
      },
      {
        "id": "fc-circ-3",
        "front": "If ∠AOB = 130° where OA and OB are radii to tangents PA and PB, what is ∠APB?",
        "back": "∠APB = 180° - 130° = 50° (They are supplementary).",
        "category": "Calculations"
      },
      {
        "id": "fc-circ-4",
        "front": "For a quadrilateral ABCD circumscribed about a circle, what is the relation between its sides?",
        "back": "AB + CD = AD + BC (Sum of opposite pairs of sides are equal).",
        "category": "Properties"
      }
    ],
    "commonTraps": [
      "Assuming a secant and a tangent are identical (a tangent intersects the circle at exactly 1 point; secant at 2 points).",
      "Thinking infinitely many tangents can be drawn through a point on the circle (Only 1 tangent at a point on the circle; 2 from external point; 0 from internal point)."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch11",
    "chapterSlug": "areas-related-to-circles",
    "chapterNumber": 11,
    "chapterTitle": "Areas Related to Circles",
    "subject": "maths",
    "summaryNote": "Perimeter and area of circle, arc length, area of sector, and area of minor and major segments.",
    "coreRules": [
      "Circumference = 2πr = πd,  Area = πr².",
      "Sector is the portion of the circular region enclosed by two radii and the corresponding arc.",
      "Segment is the portion of the circular region enclosed between a chord and the corresponding arc.",
      "Area of Minor Segment = Area of corresponding Sector - Area of corresponding Triangle.",
      "Area of Major Sector / Segment = Total Area of Circle (πr²) - Area of Minor Sector / Segment."
    ],
    "formulas": [
      {
        "label": "Length of an Arc of Sector of Angle θ",
        "formulaLatex": "l = \\frac{\\theta}{360^\\circ} \\times 2\\pi r = \\frac{\\theta}{180^\\circ}\\pi r"
      },
      {
        "label": "Area of Sector of Angle θ",
        "formulaLatex": "A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2 = \\frac{1}{2} l r"
      },
      {
        "label": "Area of Minor Segment of Angle θ",
        "formulaLatex": "A_{\\text{seg}} = \\frac{\\theta}{360^\\circ}\\pi r^2 - \\frac{1}{2}r^2\\sin\\theta",
        "notes": "For θ = 60°: Area of eq Δ = (√3/4)r²; For θ = 90°: Area of rt Δ = 1/2 r²; For θ = 120°: Area = 1/2 r² sin 120° = (√3/4)r²"
      },
      {
        "label": "Perimeter of a Protractor / Semicircle",
        "formulaLatex": "P = \\pi r + 2r = r(\\pi + 2)",
        "notes": "Do not forget the diameter base 2r!"
      },
      {
        "label": "Area of Circular Ring (Annulus)",
        "formulaLatex": "A = \\pi(R^2 - r^2) = \\pi(R + r)(R - r)"
      },
      {
        "label": "Rotations & Distance Traveled by Wheel",
        "formulaLatex": "\\text{Distance in 1 revolution} = 2\\pi r, \\quad \\text{Number of revolutions} = \\frac{\\text{Total Distance}}{2\\pi r}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-arc-1",
        "front": "What is the formula for length of an arc of a sector with angle θ and radius r?",
        "back": "l = (θ / 360°) × 2πr",
        "category": "Formulas"
      },
      {
        "id": "fc-arc-2",
        "front": "What is the perimeter of a closed semicircle of radius r?",
        "back": "P = πr + 2r = r(π + 2) (Curved boundary πr + straight diameter 2r).",
        "category": "Traps"
      },
      {
        "id": "fc-arc-3",
        "front": "What is the formula for area of a sector in terms of arc length l and radius r?",
        "back": "Area = (1/2) · l · r",
        "category": "Shortcuts"
      }
    ],
    "commonTraps": [
      "Forgetting the straight diameter 2r when asked for the perimeter of a semicircle or sector.",
      "Confusing major segment with major sector.",
      "Using π = 3.14 when question specifies 22/7, or vice-versa."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch12",
    "chapterSlug": "surface-areas-and-volumes",
    "chapterNumber": 12,
    "chapterTitle": "Surface Areas and Volumes",
    "subject": "maths",
    "summaryNote": "CSA, TSA, and Volume of Cuboid, Cube, Cylinder, Cone, Sphere, Hemisphere, and Combination of Solids.",
    "coreRules": [
      "When solids are joined together: Total Surface Area = CSA(solid 1) + CSA(solid 2) (Do NOT add TSAs, as joined interior faces are hidden!).",
      "When a solid is melted/recast into other shapes: Volume of original solid = Total Volume of new solids.",
      "When a solid is hollowed out / scooped out: TSA increases (add inner CSA), but Volume decreases (subtract inner volume)."
    ],
    "formulas": [
      {
        "label": "Cuboid (Length l, Breadth b, Height h)",
        "formulaLatex": "\\text{CSA} = 2h(l + b), \\quad \\text{TSA} = 2(lb + bh + hl), \\quad V = lbh, \\quad \\text{Diag} = \\sqrt{l^2 + b^2 + h^2}"
      },
      {
        "label": "Cube (Side a)",
        "formulaLatex": "\\text{CSA} = 4a^2, \\quad \\text{TSA} = 6a^2, \\quad V = a^3, \\quad \\text{Diag} = a\\sqrt{3}"
      },
      {
        "label": "Right Circular Cylinder (Radius r, Height h)",
        "formulaLatex": "\\text{CSA} = 2\\pi rh, \\quad \\text{TSA} = 2\\pi r(r + h), \\quad V = \\pi r^2 h"
      },
      {
        "label": "Right Circular Cone (Radius r, Height h, Slant l)",
        "formulaLatex": "l = \\sqrt{r^2 + h^2}, \\quad \\text{CSA} = \\pi rl, \\quad \\text{TSA} = \\pi r(l + r), \\quad V = \\frac{1}{3}\\pi r^2 h"
      },
      {
        "label": "Solid Sphere (Radius r)",
        "formulaLatex": "\\text{Surface Area} = 4\\pi r^2, \\quad V = \\frac{4}{3}\\pi r^3"
      },
      {
        "label": "Solid Hemisphere (Radius r)",
        "formulaLatex": "\\text{CSA} = 2\\pi r^2, \\quad \\text{TSA} = 3\\pi r^2, \\quad V = \\frac{2}{3}\\pi r^3"
      },
      {
        "label": "Spherical Shell (Inner r, Outer R)",
        "formulaLatex": "V = \\frac{4}{3}\\pi(R^3 - r^3), \\quad \\text{TSA} = 4\\pi R^2 + 4\\pi r^2"
      }
    ],
    "flashcards": [
      {
        "id": "fc-sav-1",
        "front": "What is the TSA of a solid hemisphere of radius r?",
        "back": "TSA = 3πr² (Curved area 2πr² + flat circular top πr²)",
        "category": "Formulas"
      },
      {
        "id": "fc-sav-2",
        "front": "When a cone is mounted on a hemisphere of same radius r, what is the TSA of the toy?",
        "back": "TSA = CSA of Cone + CSA of Hemisphere = πrl + 2πr²",
        "category": "Combinations"
      },
      {
        "id": "fc-sav-3",
        "front": "What is the slant height l of a cone with radius r and vertical height h?",
        "back": "l = √(r² + h²)",
        "category": "Formulas"
      },
      {
        "id": "fc-sav-4",
        "front": "What happens to the total surface area and volume when a hemispherical depression is scooped out of a wooden block?",
        "back": "Surface area INCREASES (add 2πr² - πr² = +πr²), but volume DECREASES (subtract (2/3)πr³).",
        "category": "Concepts"
      }
    ],
    "commonTraps": [
      "Using height h instead of slant height l in Cone CSA (Always calculate l = √(r² + h²)).",
      "Adding TSAs of combining shapes instead of CSAs.",
      "Confusing hemisphere CSA (2πr²) with hemisphere TSA (3πr²)."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch13",
    "chapterSlug": "statistics",
    "chapterNumber": 13,
    "chapterTitle": "Statistics",
    "subject": "maths",
    "summaryNote": "Mean (Direct, Assumed Mean, Step-deviation), Mode, Median of grouped continuous data, and the Empirical Relationship.",
    "coreRules": [
      "Class Mark xᵢ = (Upper Class Limit + Lower Class Limit) / 2.",
      "Modal Class: The class interval having the highest frequency.",
      "Median Class: The class interval whose cumulative frequency is greater than and closest to N/2 (where N = Σfᵢ).",
      "In median formula, \"cf\" is the cumulative frequency of the class PRECEDING the median class, and \"f\" is frequency of the median class itself.",
      "Empirical Relationship: Mode = 3 Median - 2 Mean (or 3 Median = Mode + 2 Mean)."
    ],
    "formulas": [
      {
        "label": "Direct Method Mean",
        "formulaLatex": "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}"
      },
      {
        "label": "Assumed Mean Method",
        "formulaLatex": "\\bar{x} = a + \\frac{\\sum f_i d_i}{\\sum f_i} \\quad (d_i = x_i - a)",
        "notes": "a = assumed mean from center of class marks"
      },
      {
        "label": "Step-Deviation Method Mean",
        "formulaLatex": "\\bar{x} = a + \\left( \\frac{\\sum f_i u_i}{\\sum f_i} \\right) \\times h \\quad \\left(u_i = \\frac{x_i - a}{h}\\right)",
        "notes": "h = class width"
      },
      {
        "label": "Mode of Grouped Data",
        "formulaLatex": "\\text{Mode} = l + \\left( \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\right) \\times h",
        "notes": "l = lower limit of modal class, f1 = freq of modal class, f0 = freq of preceding class, f2 = freq of succeeding class"
      },
      {
        "label": "Median of Grouped Data",
        "formulaLatex": "\\text{Median} = l + \\left( \\frac{\\frac{N}{2} - cf}{f} \\right) \\times h",
        "notes": "l = lower limit of median class, N = Σf, cf = cum freq of PRECEDING class, f = freq of median class"
      },
      {
        "label": "Empirical Relationship",
        "formulaLatex": "\\text{Mode} = 3\\text{Median} - 2\\text{Mean} \\iff 3\\text{Median} = \\text{Mode} + 2\\text{Mean}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-stat-1",
        "front": "What is the empirical formula connecting Mean, Median, and Mode?",
        "back": "Mode = 3 Median - 2 Mean  (or 3 Median = Mode + 2 Mean)",
        "category": "Formulas"
      },
      {
        "id": "fc-stat-2",
        "front": "In the median formula, what does \"cf\" represent?",
        "back": "Cumulative frequency of the class PRECEDING the median class.",
        "category": "Definitions"
      },
      {
        "id": "fc-stat-3",
        "front": "How is the modal class identified in grouped frequency data?",
        "back": "The class interval with the highest (maximum) frequency.",
        "category": "Methods"
      }
    ],
    "commonTraps": [
      "Using the cumulative frequency of the median class itself instead of the PRECEDING class.",
      "Applying formulas without converting discontinuous classes (e.g. 1-10, 11-20) into continuous classes (0.5-10.5, 10.5-20.5).",
      "Mixing up f₀ (preceding) and f₂ (succeeding) in the Mode formula denominator."
    ],
    "isFreeSample": false
  },
  {
    "id": "math-ch14",
    "chapterSlug": "probability",
    "chapterNumber": 14,
    "chapterTitle": "Probability",
    "subject": "maths",
    "summaryNote": "Theoretical probability, complementary events, 2-dice outcome matrix, and complete 52-card deck distribution.",
    "coreRules": [
      "Theoretical (classical) probability P(E) = (Number of outcomes favourable to E) / (Number of all possible outcomes).",
      "For any event E: 0 ≤ P(E) ≤ 1. Probability can never be negative and can never exceed 1.",
      "Sure / Certain event: P(E) = 1. Impossible event: P(E) = 0.",
      "Complementary Events: P(E) + P(not E) = 1 → P(Ē) = 1 - P(E).",
      "Sum of probabilities of all elementary events of an experiment equals 1."
    ],
    "formulas": [
      {
        "label": "Classical Probability Formula",
        "formulaLatex": "P(E) = \\frac{n(E)}{n(S)} = \\frac{\\text{Number of favourable outcomes}}{\\text{Total number of possible outcomes}}"
      },
      {
        "label": "Complementary Event Probability",
        "formulaLatex": "P(E) + P(\\bar{E}) = 1 \\implies P(\\bar{E}) = 1 - P(E)"
      },
      {
        "label": "Coin Toss Outcomes (n coins)",
        "formulaLatex": "\\text{Total outcomes} = 2^n \\quad (2 \\text{ coins: } 4 \\text{ [HH, HT, TH, TT]}; \\; 3 \\text{ coins: } 8)"
      },
      {
        "label": "Two Dice Matrix (36 Total Outcomes)",
        "formulaLatex": "n(S) = 6^2 = 36, \\quad \\text{Sum = 7 has max prob: } P(\\text{Sum = 7}) = \\frac{6}{36} = \\frac{1}{6}"
      },
      {
        "label": "Standard 52-Card Deck Breakdown",
        "formulaLatex": "52 \\text{ Cards} = 26 \\text{ Red (13 } \\heartsuit, 13 \\diamondsuit) + 26 \\text{ Black (13 } \\spadesuit, 13 \\clubsuit), \\quad 12 \\text{ Face Cards (4K, 4Q, 4J)}, \\quad 4 \\text{ Aces}"
      },
      {
        "label": "Leap Year vs Non-Leap Year Probability",
        "formulaLatex": "\\text{Leap Year (366 days) } P(53 \\text{ Sundays}) = \\frac{2}{7}, \\quad \\text{Non-Leap (365 days) } P(53 \\text{ Sundays}) = \\frac{1}{7}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-prob-1",
        "front": "What is the sum of probabilities of an event E and its complement not E?",
        "back": "P(E) + P(Ē) = 1",
        "category": "Rules"
      },
      {
        "id": "fc-prob-2",
        "front": "How many face cards are in a standard deck of 52 playing cards?",
        "back": "12 face cards (4 Kings, 4 Queens, 4 Jacks — 6 red and 6 black). Note: Aces are NOT face cards.",
        "category": "Cards"
      },
      {
        "id": "fc-prob-3",
        "front": "What is the probability of getting a sum of 7 when rolling two unbiased dice?",
        "back": "6/36 = 1/6 (Pairs: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1)).",
        "category": "Dice"
      },
      {
        "id": "fc-prob-4",
        "front": "What is the probability of having 53 Sundays in a leap year?",
        "back": "2/7 (A leap year has 52 complete weeks + 2 extra days; 2 out of 7 possible day pairs contain Sunday).",
        "category": "Calendar"
      }
    ],
    "commonTraps": [
      "Counting Aces as face cards (Aces are NOT face cards; only Kings, Queens, and Jacks are face cards).",
      "Forgetting that \"at least 1 head\" in 2 coin tosses includes HH, HT, TH (3/4, NOT 1/4).",
      "Giving a probability value less than 0 or greater than 1."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch1",
    "chapterSlug": "chemical-reactions-and-equations",
    "chapterNumber": 1,
    "chapterTitle": "Chemical Reactions and Equations",
    "subject": "science",
    "summaryNote": "Types of reactions, balancing equations, precipitate colors, thermal decomposition, and redox agents.",
    "coreRules": [
      "Law of Conservation of Mass: Total mass of reactants = Total mass of products (atoms of each element must be equal on both sides).",
      "Combination: Two or more reactants combine to form a single product (CaO + H₂O → Ca(OH)₂ + Heat).",
      "Decomposition: A single reactant breaks down into simpler products: Thermal (heat), Electrolytic (electricity), Photolytic (light).",
      "Displacement: More reactive metal displaces less reactive metal from its salt solution (Fe + CuSO₄ [Blue] → FeSO₄ [Pale green] + Cu [Brown]).",
      "Double Displacement / Precipitation: Mutual exchange of ions between two compounds forming an insoluble precipitate.",
      "Redox: Oxidation is Gain of O / Loss of H (or loss of e⁻). Reduction is Loss of O / Gain of H (or gain of e⁻)."
    ],
    "formulas": [
      {
        "label": "Slaked Lime & Whitewashing (Combination)",
        "formulaLatex": "CaO(s) [\\text{Quicklime}] + H_2O(l) \\rightarrow Ca(OH)_2(aq) [\\text{Slaked lime}] + \\text{Heat}"
      },
      {
        "label": "Marble Finish on Walls",
        "formulaLatex": "Ca(OH)_2(aq) + CO_2(g) \\rightarrow CaCO_3(s) \\downarrow [\\text{White shiny finish}] + H_2O(l)"
      },
      {
        "label": "Lead Nitrate Thermal Decomposition",
        "formulaLatex": "2Pb(NO_3)_2(s) [\\text{White}] \\xrightarrow{\\Delta} 2PbO(s) [\\text{Yellow}] + 4NO_2(g) [\\text{Brown fumes}] + O_2(g)"
      },
      {
        "label": "Ferrous Sulphate Thermal Decomposition",
        "formulaLatex": "2FeSO_4(s) [\\text{Green}] \\xrightarrow{\\Delta} Fe_2O_3(s) [\\text{Red-brown}] + SO_2(g) + SO_3(g) [\\text{Burning sulfur smell}]"
      },
      {
        "label": "Water Electrolysis (2 : 1 Volume Ratio)",
        "formulaLatex": "2H_2O(l) \\xrightarrow{\\text{Electricity}} 2H_2(g) [\\text{Cathode, } 2\\text{ vol}] + O_2(g) [\\text{Anode, } 1\\text{ vol}]"
      },
      {
        "label": "Photolytic Decomposition (Black & White Photography)",
        "formulaLatex": "2AgCl(s) [\\text{White}] \\xrightarrow{\\text{Sunlight}} 2Ag(s) [\\text{Grey}] + Cl_2(g), \\quad 2AgBr(s) \\xrightarrow{\\text{Sunlight}} 2Ag(s) + Br_2(g)"
      },
      {
        "label": "Precipitation Reaction (Double Displacement)",
        "formulaLatex": "Na_2SO_4(aq) + BaCl_2(aq) \\rightarrow BaSO_4(s) \\downarrow [\\text{White ppt}] + 2NaCl(aq)"
      },
      {
        "label": "Redox Reaction Example",
        "formulaLatex": "CuO(s) [\\text{Black}] + H_2(g) \\xrightarrow{\\Delta} Cu(s) [\\text{Brown}] + H_2O(l) \\quad (CuO \\text{ reduced, } H_2 \\text{ oxidised})"
      },
      {
        "label": "Rusting of Iron Equation",
        "formulaLatex": "4Fe(s) + 3O_2(g) + 2xH_2O(l) \\rightarrow 2Fe_2O_3 \\cdot xH_2O(s) [\\text{Hydrated Iron(III) oxide / Rust}]"
      }
    ],
    "flashcards": [
      {
        "id": "fc-cre-1",
        "front": "What gas causes brown fumes on heating lead nitrate?",
        "back": "Nitrogen Dioxide (NO₂) gas.",
        "category": "Reactions"
      },
      {
        "id": "fc-cre-2",
        "front": "What is the color change when an iron nail is placed in blue CuSO₄ solution?",
        "back": "Blue solution turns pale green (FeSO₄ formed), and reddish-brown copper deposits on the iron nail.",
        "category": "Observations"
      },
      {
        "id": "fc-cre-3",
        "front": "Which reactions are used in black and white photography?",
        "back": "Photolytic decomposition of Silver Chloride (2AgCl → 2Ag + Cl₂) and Silver Bromide (2AgBr → 2Ag + Br₂).",
        "category": "NCERT Facts"
      },
      {
        "id": "fc-cre-4",
        "front": "In the electrolysis of water, which gases collect at cathode and anode and in what volume ratio?",
        "back": "Hydrogen (H₂) at Cathode, Oxygen (O₂) at Anode; Volume ratio is 2 : 1 (H₂ : O₂).",
        "category": "Experiments"
      }
    ],
    "commonTraps": [
      "Confusing oxidizing agent (substance that gets reduced) with reducing agent (substance that gets oxidized).",
      "Writing unbalanced equations in CBSE board exams (Mass conservation is mandatory).",
      "Mixing up cathode (negative electrode → H₂ gas) and anode (positive electrode → O₂ gas)."
    ],
    "isFreeSample": true
  },
  {
    "id": "sci-ch2",
    "chapterSlug": "acids-bases-and-salts",
    "chapterNumber": 2,
    "chapterTitle": "Acids, Bases and Salts",
    "subject": "science",
    "summaryNote": "Chemical properties of acids and bases, pH scale, indicator color changes, chlor-alkali process, and commercial salts synthesis.",
    "coreRules": [
      "Acids generate H⁺(aq) / H₃O⁺ ions in water; Bases generate OH⁻(aq) ions in water. Dry acid gases (dry HCl) do not show acidic behavior.",
      "Acid + Metal → Salt + H₂↑ (Pop sound test with burning splinter).",
      "Acid + Metal Carbonate/Bicarbonate → Salt + H₂O + CO₂↑ (Turns lime water milky).",
      "Neutralisation: Acid + Base → Salt + Water (Exothermic reaction).",
      "pH < 7 is acidic (lower pH = stronger acid), pH = 7 is neutral, pH > 7 is basic (higher pH = stronger base).",
      "Water of crystallisation: Fixed number of water molecules chemically attached to each formula unit of salt."
    ],
    "formulas": [
      {
        "label": "Acid + Metal (Hydrogen Gas Evolution)",
        "formulaLatex": "Zn(s) + 2HCl(aq) \\rightarrow ZnCl_2(aq) + H_2(g) \\uparrow \\quad (\\text{Pop sound test})"
      },
      {
        "label": "Base + Amphoteric Metal (Sodium Zincate)",
        "formulaLatex": "2NaOH(aq) + Zn(s) \\rightarrow Na_2ZnO_2(aq) [\\text{Sodium zincate}] + H_2(g) \\uparrow"
      },
      {
        "label": "Lime Water Test & Excess CO₂",
        "formulaLatex": "Ca(OH)_2(aq) + CO_2(g) \\rightarrow CaCO_3(s) \\downarrow [\\text{Milky}] + H_2O(l) \\xrightarrow{\\text{excess } CO_2} Ca(HCO_3)_2(aq) [\\text{Soluble/Clear}]"
      },
      {
        "label": "Chlor-Alkali Process",
        "formulaLatex": "2NaCl(aq) + 2H_2O(l) \\xrightarrow{\\text{Electricity}} 2NaOH(aq) + Cl_2(g) [\\text{Anode}] + H_2(g) [\\text{Cathode}]"
      },
      {
        "label": "Bleaching Powder Formation",
        "formulaLatex": "Ca(OH)_2(s) [\\text{Dry slaked lime}] + Cl_2(g) \\rightarrow CaOCl_2(s) [\\text{Bleaching powder}] + H_2O(l)"
      },
      {
        "label": "Baking Soda (Solvay Synthesis) & Heating",
        "formulaLatex": "NaCl + H_2O + CO_2 + NH_3 \\rightarrow NH_4Cl + NaHCO_3, \\qquad 2NaHCO_3 \\xrightarrow{\\Delta} Na_2CO_3 + H_2O + CO_2 \\uparrow"
      },
      {
        "label": "Washing Soda (Recrystallisation)",
        "formulaLatex": "Na_2CO_3(s) + 10H_2O(l) \\rightarrow Na_2CO_3 \\cdot 10H_2O(s) [\\text{Washing soda decahydrate}]"
      },
      {
        "label": "Plaster of Paris (POP) & Gypsum Interconversion",
        "formulaLatex": "CaSO_4 \\cdot 2H_2O \\xrightarrow{373\\text{ K} (100^\\circ\\text{C})} CaSO_4 \\cdot \\frac{1}{2}H_2O [\\text{POP}] + 1\\frac{1}{2}H_2O, \\quad \\text{POP} + 1\\frac{1}{2}H_2O \\rightarrow \\text{Gypsum}"
      },
      {
        "label": "Key Indicator Colors",
        "formulaLatex": "\\text{Litmus: Red in Acid, Blue in Base}; \\; \\text{Phenolphthalein: Colourless in Acid, Pink in Base}; \\; \\text{Methyl Orange: Red in Acid, Yellow in Base}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-abs-1",
        "front": "What happens when excess CO₂ is passed through lime water?",
        "back": "The milky precipitate (CaCO₃) dissolves forming soluble Calcium Hydrogen Carbonate [Ca(HCO₃)₂], making solution clear.",
        "category": "Reactions"
      },
      {
        "id": "fc-abs-2",
        "front": "What are the products at cathode, anode, and near cathode in the Chlor-Alkali process?",
        "back": "Anode (+): Cl₂ gas;  Cathode (-): H₂ gas;  Near cathode: NaOH solution.",
        "category": "Processes"
      },
      {
        "id": "fc-abs-3",
        "front": "What is the chemical formula of Plaster of Paris (POP) and Gypsum?",
        "back": "POP: CaSO₄ · ½H₂O (Calcium sulphate hemihydrate);  Gypsum: CaSO₄ · 2H₂O.",
        "category": "Formulas"
      },
      {
        "id": "fc-abs-4",
        "front": "What is the color of phenolphthalein and methyl orange in basic solution?",
        "back": "Phenolphthalein turns Pink; Methyl Orange turns Yellow.",
        "category": "Indicators"
      }
    ],
    "commonTraps": [
      "Heating Gypsum above 373 K / 100°C (Produces dead burnt plaster CaSO₄ with zero water of crystallisation and loses setting ability).",
      "Adding water to concentrated acid (Never do this! Always add ACID SLOWLY TO WATER with constant stirring to prevent explosive splash-back).",
      "Assuming dry litmus paper changes color with dry HCl gas (Acidic properties ONLY manifest in aqueous solution in presence of H₃O⁺)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch3",
    "chapterSlug": "metals-and-non-metals",
    "chapterNumber": 3,
    "chapterTitle": "Metals and Non-metals",
    "subject": "science",
    "summaryNote": "Reactivity series, amphoteric oxides, ionic bonding, metallurgy (roasting vs calcination, thermite), and electrolytic refining of copper.",
    "coreRules": [
      "Metals are electropositive (lose electrons to form cations); Non-metals are electronegative (gain electrons to form anions).",
      "Amphoteric Oxides: Metal oxides that react with BOTH acids and bases to produce salt and water (Al₂O₃, ZnO).",
      "Aqua Regia: Freshly prepared mixture of Conc. HCl and Conc. HNO₃ in 3 : 1 ratio (dissolves noble metals Gold and Platinum).",
      "Ionic Compounds: Formed by electron transfer; have high melting/boiling points, are brittle solids, and conduct electricity in molten/aqueous state (NOT in solid state).",
      "Metallurgy: Roasting = heating sulphide ore in excess air; Calcination = heating carbonate ore in limited/no air.",
      "Thermite Reaction: Highly exothermic reduction of Fe₂O₃ by Al powder, producing molten iron used for joining railway tracks."
    ],
    "formulas": [
      {
        "label": "Reactivity Series Mnemonic",
        "formulaLatex": "K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au",
        "notes": "Please Stop Calling Me A Zebra, Instead Try Learning How Copper Saves Gold"
      },
      {
        "label": "Amphoteric Oxide Reactions (Al₂O₃)",
        "formulaLatex": "Al_2O_3 + 6HCl \\rightarrow 2AlCl_3 + 3H_2O, \\qquad Al_2O_3 + 2NaOH \\rightarrow 2NaAlO_2 [\\text{Sodium aluminate}] + H_2O"
      },
      {
        "label": "Metal Reaction with Steam",
        "formulaLatex": "3Fe(s) + 4H_2O(g) \\rightarrow Fe_3O_4(s) [\\text{Magnetic iron oxide}] + 4H_2(g) \\uparrow"
      },
      {
        "label": "Roasting of Sulphide Ore (Zinc Blende)",
        "formulaLatex": "2ZnS(s) + 3O_2(g) \\xrightarrow{\\Delta \\text{ (Excess air)}} 2ZnO(s) + 2SO_2(g) \\uparrow"
      },
      {
        "label": "Calcination of Carbonate Ore (Calamine)",
        "formulaLatex": "ZnCO_3(s) \\xrightarrow{\\Delta \\text{ (Limited air)}} ZnO(s) + CO_2(g) \\uparrow"
      },
      {
        "label": "Thermite Reaction (Railway Track Welding)",
        "formulaLatex": "Fe_2O_3(s) + 2Al(s) \\rightarrow 2Fe(l) [\\text{Molten iron}] + Al_2O_3(s) + \\text{Enormous Heat}"
      },
      {
        "label": "Electrolytic Refining of Copper",
        "formulaLatex": "\\text{Anode (+): } Cu(s) \\rightarrow Cu^{2+} + 2e^-, \\qquad \\text{Cathode (-): } Cu^{2+} + 2e^- \\rightarrow Cu(s) [\\text{Pure}]",
        "notes": "Impure copper at Anode, Pure thin strip at Cathode, Acidified CuSO4 electrolyte"
      }
    ],
    "flashcards": [
      {
        "id": "fc-mnm-1",
        "front": "What are amphoteric oxides? Give two examples.",
        "back": "Metal oxides that react with both acids and bases to form salt and water. Examples: Al₂O₃ (Aluminium oxide) and ZnO (Zinc oxide).",
        "category": "Definitions"
      },
      {
        "id": "fc-mnm-2",
        "front": "What is the difference between Roasting and Calcination?",
        "back": "Roasting heats sulphide ores in excess air (gives SO₂); Calcination heats carbonate ores in limited/no air (gives CO₂).",
        "category": "Metallurgy"
      },
      {
        "id": "fc-mnm-3",
        "front": "Why do ionic compounds conduct electricity only in molten or aqueous state?",
        "back": "In solid state, ions are locked in fixed lattice positions; in molten/aqueous state, electrostatic forces break and free ions can move.",
        "category": "Properties"
      },
      {
        "id": "fc-mnm-4",
        "front": "What is the composition of Aqua Regia?",
        "back": "Concentrated HCl and Concentrated HNO₃ in a 3 : 1 ratio by volume.",
        "category": "NCERT Facts"
      }
    ],
    "commonTraps": [
      "Assuming all metals react with HNO₃ to produce H₂ gas (HNO₃ is a strong oxidising agent and oxidises H₂ to H₂O, except with Mg and Mn which produce H₂ with very dilute HNO₃).",
      "Confusing Anode (Impure thick block) and Cathode (Pure thin sheet) in copper electrolytic refining.",
      "Writing Al₂O₃ + NaOH → NaAlO₃ instead of sodium aluminate NaAlO₂."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch4",
    "chapterSlug": "carbon-and-its-compounds",
    "chapterNumber": 4,
    "chapterTitle": "Carbon and its Compounds",
    "subject": "science",
    "summaryNote": "Covalent bonding, homologous series formulas, isomerism, functional groups, reactions of ethanol & ethanoic acid, and micelle cleansing action.",
    "coreRules": [
      "Carbon forms covalent bonds due to tetravalency (4 valence electrons) and catenation (unique self-linking ability).",
      "Homologous Series: A series of compounds with the same functional group, differing by -CH₂- unit (mass difference of 14 u) and similar chemical properties.",
      "Saturated hydrocarbons (Alkanes) contain only C-C single bonds; Unsaturated hydrocarbons contain C=C double (Alkenes) or C≡C triple bonds (Alkynes).",
      "Chemical properties of carbon compounds: Combustion, Oxidation, Addition (Hydrogenation of oils), Substitution.",
      "Esterification: Carboxylic acid + Alcohol in presence of acid catalyst → Sweet-smelling Ester + Water.",
      "Saponification: Ester + Strong Base (NaOH) → Soap (Sodium salt of fatty acid) + Alcohol.",
      "Soaps form scum in hard water (due to Ca²⁺ / Mg²⁺ ions); Synthetic detergents work in both soft and hard water."
    ],
    "formulas": [
      {
        "label": "General Formulas of Hydrocarbon Series",
        "formulaLatex": "\\text{Alkanes: } C_n H_{2n+2}, \\quad \\text{Alkenes: } C_n H_{2n} \\; (n \\ge 2), \\quad \\text{Alkynes: } C_n H_{2n-2} \\; (n \\ge 2)"
      },
      {
        "label": "Functional Groups Summary",
        "formulaLatex": "\\text{Alcohol: } -OH, \\; \\text{Aldehyde: } -CHO, \\; \\text{Ketone: } -C(=O)-, \\; \\text{Carboxylic Acid: } -COOH, \\; \\text{Halo: } -Cl, -Br"
      },
      {
        "label": "Complete Combustion of Hydrocarbon",
        "formulaLatex": "CH_4(g) + 2O_2(g) \\rightarrow CO_2(g) + 2H_2O(g) + \\text{Heat} + \\text{Light}"
      },
      {
        "label": "Controlled Oxidation of Ethanol to Ethanoic Acid",
        "formulaLatex": "CH_3CH_2OH \\xrightarrow{\\text{Alkaline } KMnO_4 + \\Delta \\text{ or Acidified } K_2Cr_2O_7 + \\Delta} CH_3COOH"
      },
      {
        "label": "Addition Reaction (Hydrogenation of Vegetable Oils)",
        "formulaLatex": "R_2C = CR_2 + H_2 \\xrightarrow{Ni \\text{ / } Pd \\text{ catalyst, } \\Delta} R_2CH - CHR_2 \\quad (\\text{Unsaturated oil} \\rightarrow \\text{Saturated fat})"
      },
      {
        "label": "Substitution Reaction of Methane",
        "formulaLatex": "CH_4 + Cl_2 \\xrightarrow{\\text{Sunlight } (h\\nu)} CH_3Cl + HCl \\quad (\\text{Continues to } CCl_4)"
      },
      {
        "label": "Esterification Reaction",
        "formulaLatex": "CH_3COOH + C_2H_5OH \\xrightarrow{\\text{conc. } H_2SO_4} CH_3COOC_2H_5 [\\text{Ethyl ethanoate / Ester}] + H_2O"
      },
      {
        "label": "Saponification (Soap Making)",
        "formulaLatex": "CH_3COOC_2H_5 + NaOH \\rightarrow CH_3COONa [\\text{Sodium ethanoate / Soap}] + C_2H_5OH"
      },
      {
        "label": "Ethanoic Acid with Sodium Bicarbonate (Test for Acid)",
        "formulaLatex": "CH_3COOH + NaHCO_3 \\rightarrow CH_3COONa + H_2O + CO_2(g) \\uparrow [\\text{Brisk effervescence}]"
      }
    ],
    "flashcards": [
      {
        "id": "fc-cic-1",
        "front": "What are the two unique properties of carbon that lead to millions of organic compounds?",
        "back": "Catenation (self-linking ability to form long chains/rings) and Tetravalency (ability to bond with 4 other atoms).",
        "category": "Properties"
      },
      {
        "id": "fc-cic-2",
        "front": "Write the chemical equation for esterification.",
        "back": "CH₃COOH + C₂H₅OH (conc. H₂SO₄) → CH₃COOC₂H₅ (Ethyl ethanoate) + H₂O.",
        "category": "Reactions"
      },
      {
        "id": "fc-cic-3",
        "front": "What is the functional group in Propanone and Propanal?",
        "back": "Propanone: Ketone (—CO—);  Propanal: Aldehyde (—CHO).",
        "category": "Nomenclature"
      },
      {
        "id": "fc-cic-4",
        "front": "How do soap molecules align during micelle formation in water?",
        "back": "Hydrophilic ionic heads point outward into water; Hydrophobic hydrocarbon tails point inward trapping oily dirt.",
        "category": "Cleansing"
      }
    ],
    "commonTraps": [
      "Drawing Pentane isomers and assuming 4 or 5 isomers exist (Pentane C₅H₁₂ has exactly 3 structural isomers: n-pentane, isopentane, neopentane).",
      "Confusing ethanol (alcohol -OH) with ethanoic acid (carboxylic acid -COOH) in physical properties and litmus tests (Ethanol is neutral; Ethanoic acid turns blue litmus red).",
      "Forgetting that catalyst Ni is required for hydrogenation addition reactions."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch5",
    "chapterSlug": "life-processes",
    "chapterNumber": 5,
    "chapterTitle": "Life Processes",
    "subject": "science",
    "summaryNote": "Photosynthesis equation, 3 pathways of glucose breakdown, human digestive enzymes, double circulation, and nephron physiology.",
    "coreRules": [
      "Photosynthesis: Autotrophs convert CO₂ and H₂O into Glucose and O₂ using chlorophyll and sunlight.",
      "Respiration: Glycolysis occurs in cytoplasm (Glucose 6-C → Pyruvate 3-C). Aerobic breakdown in mitochondria produces 36-38 ATP; Anaerobic fermentation in yeast produces Ethanol + CO₂ + 2 ATP; Anaerobic in human muscle produces Lactic acid + 2 ATP.",
      "Human Heart: Double circulation (Systemic + Pulmonary) prevents mixing of oxygenated (left side) and deoxygenated (right side) blood.",
      "Normal Blood Pressure: 120/80 mmHg (120 Systolic, 80 Diastolic), measured using a Sphygmomanometer.",
      "Nephron (Functional unit of kidney): Performs Glomerular filtration, Selective reabsorption (glucose, amino acids, salts, water in tubules), and Tubular secretion."
    ],
    "formulas": [
      {
        "label": "Photosynthesis Balanced Equation",
        "formulaLatex": "6CO_2 + 12H_2O \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} C_6H_{12}O_6 [\\text{Glucose}] + 6O_2 \\uparrow + 6H_2O"
      },
      {
        "label": "Glucose Breakdown Pathway 1 (Aerobic in Mitochondria)",
        "formulaLatex": "\\text{Pyruvate} + O_2 \\xrightarrow{\\text{Mitochondria}} 6CO_2 + 6H_2O + 38\\text{ ATP (Energy)}"
      },
      {
        "label": "Glucose Breakdown Pathway 2 (Yeast Fermentation)",
        "formulaLatex": "\\text{Pyruvate} \\xrightarrow{\\text{Absence of } O_2 \\text{ in Yeast}} 2\\text{C}_2\\text{H}_5\\text{OH (Ethanol)} + 2CO_2 + 2\\text{ ATP}"
      },
      {
        "label": "Glucose Breakdown Pathway 3 (Muscle Cramps)",
        "formulaLatex": "\\text{Pyruvate} \\xrightarrow{\\text{Lack of } O_2 \\text{ in Muscle}} 2\\text{Lactic Acid (3-C)} + 2\\text{ ATP}"
      },
      {
        "label": "Human Digestive Enzymes Summary",
        "formulaLatex": "\\text{Salivary Amylase: Starch } \\rightarrow \\text{ Maltose}; \\; \\text{Pepsin (Acidic pH): Proteins } \\rightarrow \\text{ Peptones}; \\; \\text{Trypsin (Alkaline): Proteins } \\rightarrow \\text{ Amino Acids}; \\; \\text{Lipase: Fats } \\rightarrow \\text{ Fatty Acids + Glycerol}"
      },
      {
        "label": "Blood Pressure & Circulation Flow",
        "formulaLatex": "\\text{BP} = \\frac{120\\text{ mmHg (Systolic)}}{80\\text{ mmHg (Diastolic)}}, \\quad \\text{Deoxy Blood: Body } \\rightarrow \\text{ RA } \\rightarrow \\text{ RV } \\rightarrow \\text{ Lungs } \\rightarrow \\text{ Oxy: LA } \\rightarrow \\text{ LV } \\rightarrow \\text{ Aorta } \\rightarrow \\text{ Body}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-lp-1",
        "front": "What are the 3 major events that occur during photosynthesis?",
        "back": "1. Absorption of light energy by chlorophyll; 2. Conversion of light to chemical energy & splitting of water into H₂ and O₂; 3. Reduction of CO₂ to carbohydrates.",
        "category": "Events"
      },
      {
        "id": "fc-lp-2",
        "front": "What causes muscle cramps during sudden rigorous physical exercise?",
        "back": "Accumulation of lactic acid due to anaerobic breakdown of pyruvate under lack of oxygen in muscle cells.",
        "category": "Respiration"
      },
      {
        "id": "fc-lp-3",
        "front": "Why is the left ventricle wall thicker than the right ventricle wall in the human heart?",
        "back": "The left ventricle has to pump oxygenated blood with high pressure to the entire body, while the right ventricle only pumps blood to nearby lungs.",
        "category": "Circulation"
      },
      {
        "id": "fc-lp-4",
        "front": "What substances are selectively reabsorbed from the initial nephron filtrate in the kidney tubules?",
        "back": "Glucose, amino acids, mineral salts, and a major amount of water.",
        "category": "Excretion"
      }
    ],
    "commonTraps": [
      "Stating that desert plants take in CO₂ during daytime (Desert plants take up CO₂ at night and store it as an intermediate to prevent water loss, acting on it with daytime sunlight).",
      "Confusing the roles of Pepsin (works in stomach in acidic medium HCl) and Trypsin (works in small intestine in alkaline medium bile).",
      "Confusing Xylem (unidirectional transport of water & minerals via transpiration pull) with Phloem (bidirectional translocation of food using ATP)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch6",
    "chapterSlug": "control-and-coordination",
    "chapterNumber": 6,
    "chapterTitle": "Control and Coordination",
    "subject": "science",
    "summaryNote": "Neuron anatomy, reflex arc pathway, human brain regions, plant phytohormones, tropisms, and human endocrine hormones.",
    "coreRules": [
      "Nervous Impulse Pathway: Dendrite → Cell Body (Cyton) → Axon → Axon Terminal → Chemical release across Synapse → Next Dendrite.",
      "Reflex Arc: Receptor → Sensory Neuron → Relay Neuron in Spinal Cord → Motor Neuron → Effector Muscle/Gland.",
      "Brain Anatomy: Forebrain (Cerebrum - thinking, memory, voluntary actions), Midbrain (visual/auditory reflexes), Hindbrain (Cerebellum - posture/balance, Medulla - involuntary BP/salivation/vomiting, Pons - respiration regulation).",
      "Phytohormones: Auxin (cell elongation / phototropism), Gibberellin (stem growth), Cytokinin (cell division), Abscisic Acid/ABA (growth inhibitor / wilting), Ethylene (fruit ripening).",
      "Endocrine System: Ductless glands secrete hormones directly into bloodstream (Pituitary GH, Thyroid Thyroxine, Pancreas Insulin, Adrenal Adrenaline)."
    ],
    "formulas": [
      {
        "label": "Reflex Arc Sequence Flow",
        "formulaLatex": "\\text{Stimulus} \\rightarrow \\text{Receptor} \\xrightarrow{\\text{Sensory Neuron}} \\text{Spinal Cord (Relay)} \\xrightarrow{\\text{Motor Neuron}} \\text{Effector (Muscle)} \\rightarrow \\text{Response}"
      },
      {
        "label": "Plant Phytohormones Chart",
        "formulaLatex": "\\text{Promoters: } \\text{Auxin (Shoot elongation)}, \\text{Gibberellin (Stem growth)}, \\text{Cytokinin (Cell division)}; \\quad \\text{Inhibitor: } \\text{ABA (Wilting of leaves)}"
      },
      {
        "label": "Plant Directional Tropisms",
        "formulaLatex": "\\text{Phototropism (Light)}, \\; \\text{Geotropism (Gravity)}, \\; \\text{Hydrotropism (Water)}, \\; \\text{Chemotropism (Pollen tube growth to ovule)}"
      },
      {
        "label": "Major Human Endocrine Glands & Functions",
        "formulaLatex": "\\text{Pituitary: Growth Hormone}; \\; \\text{Thyroid: Thyroxine (requires Iodine)}; \\; \\text{Pancreas: Insulin (Lowers blood glucose)}; \\; \\text{Adrenal: Adrenaline (Fight-or-Flight)}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-cnc-1",
        "front": "What is a synapse and how is information transmitted across it?",
        "back": "A synapse is the microscopic gap between two neurons. Electric impulse at axon terminal releases chemical neurotransmitters that cross the gap and initiate electrical impulse in the next neuron.",
        "category": "Neurons"
      },
      {
        "id": "fc-cnc-2",
        "front": "Which part of the human brain controls involuntary actions like blood pressure, salivation, and vomiting?",
        "back": "Medulla in the Hindbrain.",
        "category": "Brain"
      },
      {
        "id": "fc-cnc-3",
        "front": "Which part of the brain is responsible for precision of voluntary actions and maintaining body posture and balance?",
        "back": "Cerebellum in the Hindbrain.",
        "category": "Brain"
      },
      {
        "id": "fc-cnc-4",
        "front": "Why is iodised salt recommended in our diet?",
        "back": "Iodine is essential for thyroid gland to synthesise thyroxine hormone, which regulates carbohydrate, protein, and fat metabolism. Deficiency causes Goitre (swollen neck).",
        "category": "Endocrine"
      }
    ],
    "commonTraps": [
      "Confusing Cerebrum (Forebrain, main thinking/memory center) with Cerebellum (Hindbrain, balance/posture/equilibrium).",
      "Stating that the brain directs reflex action before response (Spinal cord handles the instantaneous reflex loop; signal reaches brain later for awareness).",
      "Thinking Chemotropism is non-directional (Chemotropism is directional tropic movement, e.g. growth of pollen tube towards ovule chemical gradient)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch7",
    "chapterSlug": "how-do-organisms-reproduce",
    "chapterNumber": 7,
    "chapterTitle": "How do Organisms Reproduce?",
    "subject": "science",
    "summaryNote": "Asexual reproduction modes, double fertilisation in angiosperms, human male & female reproductive systems, and contraceptive methods.",
    "coreRules": [
      "Asexual reproduction involves a single parent without gamete fusion (offspring are clones); Sexual reproduction involves two parents and fusion of male and female gametes generating genetic variation.",
      "Asexual Modes: Binary Fission (Amoeba, Leishmania), Multiple Fission (Plasmodium), Budding (Hydra, Yeast), Fragmentation (Spirogyra), Regeneration (Planaria), Spore Formation (Rhizopus), Vegetative Propagation (Bryophyllum).",
      "Flower Structure: Stamen is male organ (Anther + Filament produces pollen); Carpel/Pistil is female organ (Stigma + Style + Ovary containing ovules).",
      "Double Fertilisation in Flowering Plants: Syngamy (Male gamete + Egg → 2n Zygote) AND Triple Fusion (Male gamete + 2 Polar nuclei → 3n Endosperm).",
      "Human Reproduction: Male (Testes produce sperm + testosterone at 2-3°C below body temp in scrotum); Female (Ovary releases ovum; Fertilisation occurs in Fallopian tube / Oviduct; Implantation in Uterus).",
      "Contraception: Barrier (condoms prevent STDs), Chemical (oral pills), IUDs (Copper-T in uterus), Surgical (Vasectomy in males, Tubectomy in females)."
    ],
    "formulas": [
      {
        "label": "Double Fertilisation & Triple Fusion Scheme",
        "formulaLatex": "\\text{Syngamy: } 1\\text{ Sperm Nucleus} + 1\\text{ Egg Nucleus} \\rightarrow \\text{Zygote } (2n), \\qquad \\text{Triple Fusion: } 1\\text{ Sperm} + 2\\text{ Polar Nuclei} \\rightarrow \\text{Endosperm } (3n)"
      },
      {
        "label": "Asexual Modes Breakdown",
        "formulaLatex": "\\text{Binary Fission: } \\textit{Amoeba}; \\; \\text{Multiple Fission: } \\textit{Plasmodium}; \\; \\text{Budding: } \\textit{Hydra}; \\; \\text{Spore Formation: } \\textit{Rhizopus}; \\; \\text{Vegetative: } \\textit{Bryophyllum}"
      },
      {
        "label": "Human Reproductive Pathways",
        "formulaLatex": "\\text{Male: Testes } \\rightarrow \\text{ Vas Deferens } \\rightarrow \\text{ Urethra}; \\qquad \\text{Female: Ovary } \\rightarrow \\text{ Fallopian Tube (Fertilisation site) } \\rightarrow \\text{ Uterus (Implantation)}"
      },
      {
        "label": "Contraception Classification",
        "formulaLatex": "\\text{Barrier (Condom)}; \\; \\text{Chemical (Hormonal Pills)}; \\; \\text{Intrauterine (Copper-T)}; \\; \\text{Surgical (Vasectomy in } \\mars, \\text{ Tubectomy in } \\venus)"
      }
    ],
    "flashcards": [
      {
        "id": "fc-hdr-1",
        "front": "What are the products of Syngamy and Triple Fusion in flowering plants?",
        "back": "Syngamy produces diploid (2n) Zygote (becomes Embryo); Triple Fusion produces triploid (3n) Endosperm (nutritive tissue).",
        "category": "Plants"
      },
      {
        "id": "fc-hdr-2",
        "front": "Where does fertilisation of the human egg by sperm normally take place?",
        "back": "Fallopian tube (Oviduct).",
        "category": "Humans"
      },
      {
        "id": "fc-hdr-3",
        "front": "What is the role of the placenta in human pregnancy?",
        "back": "Placenta is a disc-like vascular tissue that provides glucose and oxygen from mother to embryo and removes embryo waste into mother’s blood.",
        "category": "Embryology"
      },
      {
        "id": "fc-hdr-4",
        "front": "Which contraceptive method protects against Sexually Transmitted Diseases (STDs)?",
        "back": "Mechanical Barrier methods like Condoms (Chemical pills, Copper-T, and surgery do NOT protect against STDs).",
        "category": "Health"
      }
    ],
    "commonTraps": [
      "Stating that fertilisation occurs in the uterus (Fertilisation occurs in the Fallopian tube / Oviduct; implantation and development occur in the Uterus).",
      "Confusing Vasectomy (cutting/tying vas deferens in males) with Tubectomy (cutting/tying fallopian tubes in females).",
      "Assuming regeneration is the same as reproduction in all animals (Regeneration is carried out by specialised cells in simple animals like Planaria, not a primary mode in complex organisms)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch8",
    "chapterSlug": "heredity",
    "chapterNumber": 8,
    "chapterTitle": "Heredity",
    "subject": "science",
    "summaryNote": "Mendel’s monohybrid and dihybrid crosses, phenotypic vs genotypic ratios, dominant vs recessive traits, and sex determination in humans.",
    "coreRules": [
      "Gene is the basic unit of heredity. Dominant alleles express in both homozygous (TT) and heterozygous (Tt) conditions; Recessive alleles express ONLY in homozygous condition (tt).",
      "Monohybrid Cross (One pair of contrasting characters, e.g. Height TT × tt): F₁ is 100% Tall (Tt); F₂ Phenotypic ratio is 3 : 1 (3 Tall : 1 Dwarf); F₂ Genotypic ratio is 1 : 2 : 1 (1 TT : 2 Tt : 1 tt).",
      "Dihybrid Cross (Two pairs of contrasting characters, e.g. Seed shape & color RRYY × rryy): F₂ Phenotypic ratio is 9 : 3 : 3 : 1 (Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green).",
      "Law of Segregation: Alleles separate during gamete formation so each gamete carries only one allele.",
      "Law of Independent Assortment: Inheritance of one pair of characters is independent of another pair.",
      "Sex Determination in Humans: Females have XX chromosomes (all eggs carry X); Males have XY chromosomes (50% sperm carry X, 50% carry Y). The father determines the sex of the child (50% probability of boy or girl)."
    ],
    "formulas": [
      {
        "label": "Mendel’s Monohybrid Cross (F₂ Generation Ratios)",
        "formulaLatex": "\\text{Phenotypic Ratio} = 3 : 1 \\; (3\\text{ Tall} : 1\\text{ Dwarf}), \\qquad \\text{Genotypic Ratio} = 1 : 2 : 1 \\; (1\\text{ TT} : 2\\text{ Tt} : 1\\text{ tt})"
      },
      {
        "label": "Mendel’s Dihybrid Cross (F₂ Phenotypic Ratio)",
        "formulaLatex": "\\text{Phenotypic Ratio} = 9 : 3 : 3 : 1 \\quad (\\text{Round Yellow} : \\text{Round Green} : \\text{Wrinkled Yellow} : \\text{Wrinkled Green})"
      },
      {
        "label": "Sex Determination Scheme in Humans",
        "formulaLatex": "\\text{Female (XX)} \\times \\text{Male (XY)} \\implies \\text{Eggs: All X}; \\; \\text{Sperm: } 50\\%\\text{ X}, 50\\%\\text{ Y} \\implies P(\\text{Girl [XX]}) = P(\\text{Boy [XY]}) = \\frac{1}{2} (50\\%)"
      },
      {
        "label": "Father Determines Sex Rule",
        "formulaLatex": "\\text{Egg (X)} + \\text{Sperm (X)} \\rightarrow \\text{Female (XX)}, \\qquad \\text{Egg (X)} + \\text{Sperm (Y)} \\rightarrow \\text{Male (XY)}",
        "notes": "Mother always donates X chromosome; child sex depends entirely on sperm from father"
      }
    ],
    "flashcards": [
      {
        "id": "fc-her-1",
        "front": "What are the phenotypic and genotypic ratios of Mendel’s monohybrid cross in F₂ generation?",
        "back": "Phenotypic ratio = 3 : 1 (Tall : Dwarf);  Genotypic ratio = 1 : 2 : 1 (1 TT : 2 Tt : 1 tt).",
        "category": "Ratios"
      },
      {
        "id": "fc-her-2",
        "front": "What is the phenotypic ratio of Mendel’s dihybrid cross in F₂ generation?",
        "back": "9 : 3 : 3 : 1 (Round Yellow : Round Green : Wrinkled Yellow : Wrinkled Green).",
        "category": "Ratios"
      },
      {
        "id": "fc-her-3",
        "front": "Who determines the sex of a newborn child in humans — mother or father? Why?",
        "back": "The father. Mother gives only X chromosome, while father produces 50% X-bearing and 50% Y-bearing sperms.",
        "category": "Sex Determination"
      },
      {
        "id": "fc-her-4",
        "front": "What is the probability of a couple having a girl child in any pregnancy?",
        "back": "50% (or 1/2), regardless of previous children.",
        "category": "Probability"
      }
    ],
    "commonTraps": [
      "Swapping phenotypic and genotypic ratios in monohybrid cross (Phenotype is 3:1; Genotype is 1:2:1).",
      "Thinking previous daughters increase the probability of having a boy (Every single pregnancy has an independent 50% chance of boy or girl).",
      "Writing acquired traits as heritable (Acquired traits like body weight, pierced ears, or swimming skills do NOT alter germ cell DNA and cannot be inherited)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch9",
    "chapterSlug": "light-reflection-and-refraction",
    "chapterNumber": 9,
    "chapterTitle": "Light – Reflection and Refraction",
    "subject": "science",
    "summaryNote": "Mirror & Lens formulas, magnification, Snell’s law, refractive index, sign conventions, and lens power.",
    "coreRules": [
      "New Cartesian Sign Convention: All distances are measured from the Pole (P) / Optical Centre (O). Distances in direction of incident light are positive; opposite to incident light are negative. Object distance u is ALWAYS NEGATIVE.",
      "Focal Length signs: Concave Mirror / Concave Lens → f is ALWAYS NEGATIVE. Convex Mirror / Convex Lens → f is ALWAYS POSITIVE.",
      "Magnification: Real & Inverted image → m is NEGATIVE; Virtual & Erect image → m is POSITIVE. |m| > 1 means magnified, |m| = 1 means same size, |m| < 1 means diminished.",
      "Snell’s Law of Refraction: Ratio of sine of angle of incidence to sine of angle of refraction is constant: sin i / sin r = n₂₁ = v₁ / v₂.",
      "Power of Lens: P = 1 / f (in metres), measured in Dioptres (D). Convex lens has +P; Concave lens has -P."
    ],
    "formulas": [
      {
        "label": "Focal Length & Radius of Curvature",
        "formulaLatex": "f = \\frac{R}{2} \\iff R = 2f"
      },
      {
        "label": "Spherical Mirror Formula",
        "formulaLatex": "\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}",
        "notes": "u is always negative. Concave f < 0, Convex f > 0"
      },
      {
        "label": "Mirror Magnification",
        "formulaLatex": "m = -\\frac{v}{u} = \\frac{h_i}{h_o}",
        "notes": "Notice the MINUS sign for mirrors!"
      },
      {
        "label": "Snell’s Law of Refraction",
        "formulaLatex": "n_{21} = \\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{n_2}{n_1}"
      },
      {
        "label": "Absolute Refractive Index",
        "formulaLatex": "n = \\frac{c}{v} = \\frac{3 \\times 10^8 \\text{ m/s}}{v}"
      },
      {
        "label": "Thin Lens Formula",
        "formulaLatex": "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}",
        "notes": "Notice the MINUS sign in lens formula!"
      },
      {
        "label": "Lens Magnification",
        "formulaLatex": "m = +\\frac{v}{u} = \\frac{h_i}{h_o}",
        "notes": "Notice the PLUS sign for lenses!"
      },
      {
        "label": "Power of a Lens",
        "formulaLatex": "P = \\frac{1}{f \\text{ (in metres)}} = \\frac{100}{f \\text{ (in cm)}} \\quad (\\text{Unit: Dioptre, D})"
      },
      {
        "label": "Combination of Thin Lenses in Contact",
        "formulaLatex": "P_{\\text{total}} = P_1 + P_2 + P_3 + \\dots, \\quad m = m_1 \\times m_2 \\times \\dots"
      }
    ],
    "flashcards": [
      {
        "id": "fc-lrr-1",
        "front": "What is the sign of focal length for Concave mirror and Convex lens?",
        "back": "Concave mirror: Negative (-f);  Convex lens: Positive (+f). (Concave is always negative, Convex is always positive).",
        "category": "Signs"
      },
      {
        "id": "fc-lrr-2",
        "front": "What is the difference in formula for magnification between mirrors and lenses?",
        "back": "Mirror magnification: m = -v/u;  Lens magnification: m = +v/u.",
        "category": "Traps"
      },
      {
        "id": "fc-lrr-3",
        "front": "What is the focal length of a lens with power -2.0 D?",
        "back": "f = 1/P = 1/(-2.0) = -0.5 m = -50 cm (Concave lens).",
        "category": "Numericals"
      },
      {
        "id": "fc-lrr-4",
        "front": "State Snell’s Law of Refraction.",
        "back": "The ratio of sine of angle of incidence to sine of angle of refraction is constant for a given pair of media: sin i / sin r = constant (n₂₁).",
        "category": "Laws"
      }
    ],
    "commonTraps": [
      "Mixing up Mirror formula (1/f = 1/v + 1/u with m = -v/u) and Lens formula (1/f = 1/v - 1/u with m = +v/u).",
      "Calculating lens power with focal length in centimetres without converting to metres (P = 1/f(m) = 100/f(cm)).",
      "Forgetting that object distance u is ALWAYS negative in all numerical problems."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch10",
    "chapterSlug": "the-human-eye-and-the-colourful-world",
    "chapterNumber": 10,
    "chapterTitle": "The Human Eye and the Colourful World",
    "subject": "science",
    "summaryNote": "Vision defects and lens corrections, glass prism refraction, dispersion (VIBGYOR), atmospheric refraction, and Rayleigh scattering.",
    "coreRules": [
      "Least distance of distinct vision (Near Point) = 25 cm. Normal Far Point = Infinity (∞).",
      "Accommodation: Ability of the ciliary muscles to adjust the focal length of the eye lens.",
      "Myopia (Near-sightedness): Distant objects cannot be seen clearly; image forms IN FRONT OF RETINA; Corrected with CONCAVE LENS.",
      "Hypermetropia (Far-sightedness): Nearby objects cannot be seen clearly; image forms BEHIND RETINA; Corrected with CONVEX LENS.",
      "Presbyopia: Loss of accommodation due to aging ciliary muscles; Corrected with BI-FOCAL LENS (Upper Concave for distant, Lower Convex for reading).",
      "Prism Dispersion: White light splits into 7 colors (VIBGYOR). Red deviates the LEAST (longest wavelength); Violet deviates the MOST (shortest wavelength).",
      "Atmospheric Refraction: Causes twinkling of stars, advanced sunrise (2 min earlier) and delayed sunset (2 min later) — total day length increases by 4 min.",
      "Scattering of Light: Rayleigh scattering intensity I ∝ 1/λ⁴. Blue light scatters ~10× more than red, making the clear sky appear blue. Red light scatters least, visible through fog/smoke for danger signals."
    ],
    "formulas": [
      {
        "label": "Prism Deviation Relation",
        "formulaLatex": "A + D = i + e \\quad (A = \\text{Angle of Prism}, D = \\text{Angle of Deviation}, i = \\text{Incident}, e = \\text{Emergent})"
      },
      {
        "label": "Myopia Correction Lens Power",
        "formulaLatex": "f = -d \\implies P = -\\frac{1}{d \\text{ (in m)}} \\quad (d = \\text{defective far point of myopic eye})",
        "notes": "Concave lens brings image from infinity to defective far point d"
      },
      {
        "label": "Hypermetropia Correction Lens Power",
        "formulaLatex": "\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u} = \\frac{1}{-d_n} - \\frac{1}{-25\\text{ cm}} \\implies P = \\frac{1}{f} > 0",
        "notes": "Convex lens brings image from normal near point (25 cm) to defective near point d_n"
      },
      {
        "label": "Rayleigh Scattering Law",
        "formulaLatex": "I_{\\text{scattered}} \\propto \\frac{1}{\\lambda^4}",
        "notes": "Shorter wavelength (Blue/Violet) scatters vastly more than long wavelength (Red)"
      },
      {
        "label": "Rainbow Formation Steps",
        "formulaLatex": "\\text{Entry into water droplet: Refraction + Dispersion } \\rightarrow \\text{ Internal Reflection inside } \\rightarrow \\text{ Refraction on exit}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-hec-1",
        "front": "Where is the image formed in a myopic eye, and which lens corrects it?",
        "back": "Image is formed IN FRONT of the retina; Corrected by a CONCAVE lens of suitable power.",
        "category": "Defects"
      },
      {
        "id": "fc-hec-2",
        "front": "Why does the clear sky appear blue during daytime?",
        "back": "Fine atmospheric air molecules scatter shorter wavelengths (blue light) much more strongly than longer red wavelengths (Rayleigh scattering I ∝ 1/λ⁴).",
        "category": "Scattering"
      },
      {
        "id": "fc-hec-3",
        "front": "Why do stars twinkle while planets do not?",
        "back": "Stars are distant point sources whose light fluctuates due to moving atmospheric layers with varying refractive indices. Planets are extended sources where multiple points average out fluctuation.",
        "category": "Atmospheric Refraction"
      },
      {
        "id": "fc-hec-4",
        "front": "Why are danger signal lights always red?",
        "back": "Red light has the longest visible wavelength and is scattered least by fog and smoke, making it visible from the longest distance.",
        "category": "Colors"
      }
    ],
    "commonTraps": [
      "Stating that Total Internal Reflection in a raindrop is pure TIR (It is internal reflection at the back droplet surface combined with two refractions at front surface).",
      "Confusing Myopia (Concave lens) with Hypermetropia (Convex lens).",
      "Thinking planets do not twinkle because they have their own light (Planets do not twinkle because they act as extended sources closer to Earth)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch11",
    "chapterSlug": "electricity",
    "chapterNumber": 11,
    "chapterTitle": "Electricity",
    "subject": "science",
    "summaryNote": "Ohm’s law, factors affecting resistance, resistivity, series vs parallel combinations, Joule’s heating law, and electric power.",
    "coreRules": [
      "Electric Current I = Q / t (Unit: Ampere = Coulomb / second). 1 Coulomb = 6.25 × 10¹⁸ electrons.",
      "Potential Difference V = W / Q (Unit: Volt = Joule / Coulomb).",
      "Ohm’s Law: V = IR (provided temperature and physical conditions remain constant).",
      "Resistance R = ρ (l / A) = ρ (l / πr²). Resistivity ρ depends ONLY on material and temperature (NOT on length or area of wire).",
      "Series: Current I is identical through all resistors; V = V₁ + V₂; R_eq = R₁ + R₂ + ...",
      "Parallel: Voltage V is identical across all branches; I = I₁ + I₂; 1/R_eq = 1/R₁ + 1/R₂ + ...",
      "Joule’s Heating Law: H = I² R t = V I t = (V² / R) t.",
      "Commercial Unit of Energy: 1 kWh = 1 Unit = 3.6 × 10⁶ Joules."
    ],
    "formulas": [
      {
        "label": "Electric Current & Charge",
        "formulaLatex": "I = \\frac{Q}{t}, \\quad Q = ne \\quad (e = 1.6 \\times 10^{-19} \\text{ C}, \\; 1\\text{ C} = 6.25 \\times 10^{18} \\text{ electrons})"
      },
      {
        "label": "Electric Potential Difference",
        "formulaLatex": "V = \\frac{W}{Q} \\quad (1\\text{ V} = 1\\text{ J/C})"
      },
      {
        "label": "Ohm’s Law & Resistance",
        "formulaLatex": "V = IR \\iff R = \\frac{V}{I}"
      },
      {
        "label": "Resistivity Formula",
        "formulaLatex": "R = \\rho\\frac{l}{A} = \\rho\\frac{l}{\\pi r^2} \\iff \\rho = \\frac{R A}{l} \\quad (\\text{Unit: } \\Omega\\cdot\\text{m})",
        "notes": "If wire is stretched to n times its length: R' = n² · R (Volume is conserved)"
      },
      {
        "label": "Series Combination of Resistors",
        "formulaLatex": "R_s = R_1 + R_2 + R_3 + \\dots, \\quad I = \\text{constant}, \\quad V = V_1 + V_2 + V_3"
      },
      {
        "label": "Parallel Combination of Resistors",
        "formulaLatex": "\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots \\implies R_p = \\frac{R_1 R_2}{R_1 + R_2} \\quad (\\text{for 2 resistors})"
      },
      {
        "label": "Joule’s Law of Heating",
        "formulaLatex": "H = I^2 R t = V I t = \\frac{V^2}{R} t \\quad (\\text{Unit: Joules, J})"
      },
      {
        "label": "Electric Power Formulas",
        "formulaLatex": "P = \\frac{W}{t} = V I = I^2 R = \\frac{V^2}{R} \\quad (\\text{Unit: Watt, W})"
      },
      {
        "label": "Commercial Unit of Energy & Cost",
        "formulaLatex": "1\\text{ kWh} = 3.6 \\times 10^6 \\text{ J} = 3.6\\text{ MJ}, \\quad \\text{Cost} = \\text{Total kWh (Units)} \\times \\text{Rate per unit}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-el-1",
        "front": "If a wire of resistance R is stretched to double (2×) its length with volume constant, what is its new resistance?",
        "back": "New resistance R' = 4R (Since length doubles, cross-sectional area halves: R ∝ l/A ∝ l²).",
        "category": "Numericals"
      },
      {
        "id": "fc-el-2",
        "front": "What is 1 commercial unit of electrical energy (1 kWh) in Joules?",
        "back": "1 kWh = 3.6 × 10⁶ Joules (3.6 MJ).",
        "category": "Units"
      },
      {
        "id": "fc-el-3",
        "front": "Why are domestic electric appliances connected in parallel rather than in series?",
        "back": "1. Each appliance receives the full rated 220V; 2. Each operates independently with its own switch; 3. Total resistance is minimized.",
        "category": "Reasoning"
      },
      {
        "id": "fc-el-4",
        "front": "Why are heating elements made of alloys like nichrome rather than pure metals?",
        "back": "Alloys have much higher resistivity than constituent metals and do not oxidise (burn) easily even at high temperatures.",
        "category": "Materials"
      }
    ],
    "commonTraps": [
      "Assuming resistivity (ρ) changes when a wire is stretched, compressed, or cut (Resistivity is a material property that stays CONSTANT at constant temperature).",
      "Using H = I²Rt in parallel circuits where voltage V is common (Prefer H = (V²/R)t when voltage across branches is identical).",
      "Connecting Ammeter in parallel and Voltmeter in series (Ammeter has low resistance, must be in SERIES; Voltmeter has high resistance, must be in PARALLEL)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch12",
    "chapterSlug": "magnetic-effects-of-electric-current",
    "chapterNumber": 12,
    "chapterTitle": "Magnetic Effects of Electric Current",
    "subject": "science",
    "summaryNote": "Magnetic field lines, Right-Hand Thumb Rule, Solenoid, Fleming’s Left-Hand Rule (Electric Motor), Electromagnetic Induction, and domestic circuit safety.",
    "coreRules": [
      "Magnetic field lines emerge from North Pole and enter South Pole outside a magnet (South to North inside). They form continuous closed loops and NEVER intersect each other.",
      "Right-Hand Thumb Rule: Point thumb along current direction; curled fingers indicate circular direction of magnetic field lines.",
      "Solenoid: A long coil containing many circular turns of insulated copper wire. Magnetic field inside a long solenoid is uniform, strong, and parallel: B = μ₀ n I.",
      "Fleming’s Left-Hand Rule (Electric Motor Principle): Stretch thumb, forefinger, and middle finger mutually perpendicular. Forefinger = Field (B), Middle finger = Current (I), Thumb = Direction of Force/Motion (F). [Mnemonic: FBI]",
      "Electromagnetic Induction (Faraday): Moving a magnet relative to a coil induces an electric current in the circuit (Fleming’s Right-Hand Rule).",
      "Domestic Electric Circuit: Live wire (220V, Red/Brown), Neutral wire (0V, Black/Blue), Earth wire (0V, Green/Yellow safety ground).",
      "Electric Fuse: Safety device with low melting point alloy connected in SERIES with LIVE WIRE to prevent damage from overloading and short-circuits."
    ],
    "formulas": [
      {
        "label": "Magnetic Field of Straight Current-Carrying Conductor",
        "formulaLatex": "B \\propto I, \\quad B \\propto \\frac{1}{r} \\implies B = \\frac{\\mu_0 I}{2\\pi r}",
        "notes": "Field strength increases with current and decreases with distance r"
      },
      {
        "label": "Magnetic Field Inside a Long Solenoid",
        "formulaLatex": "B = \\mu_0 n I \\quad (n = \\text{number of turns per unit length } N/L)",
        "notes": "Field inside solenoid is uniform and behaves like a strong bar magnet"
      },
      {
        "label": "Magnetic Force on Current-Carrying Conductor",
        "formulaLatex": "F = B I L \\sin\\theta \\quad (\\text{Max force } F = BIL \\text{ at } \\theta = 90^\\circ, \\; F = 0 \\text{ when parallel } \\theta = 0^\\circ)"
      },
      {
        "label": "Fleming’s Left-Hand Rule (Motor Force)",
        "formulaLatex": "\\text{Thumb} = \\text{Force (F)}, \\quad \\text{Forefinger} = \\text{Magnetic Field (B)}, \\quad \\text{Middle Finger} = \\text{Current (I)}"
      },
      {
        "label": "Fleming’s Right-Hand Rule (Induced Current)",
        "formulaLatex": "\\text{Thumb} = \\text{Motion of conductor}, \\quad \\text{Forefinger} = \\text{Magnetic Field}, \\quad \\text{Middle Finger} = \\text{Induced Current}"
      },
      {
        "label": "Domestic Power Supply Specifications (India)",
        "formulaLatex": "V = 220\\text{ V (RMS)}, \\quad f = 50\\text{ Hz} \\implies \\text{AC reverses direction every } \\frac{1}{100} \\text{ s}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-mag-1",
        "front": "Why do two magnetic field lines never intersect each other?",
        "back": "If they intersect, at the point of intersection a compass needle would have to point in two different directions at once, which is physically impossible.",
        "category": "Field Lines"
      },
      {
        "id": "fc-mag-2",
        "front": "What is the role of an Earth wire in domestic electric appliances?",
        "back": "It provides a low-resistance path to the ground for any leakage current in metallic bodies, preventing severe electric shocks to the user.",
        "category": "Safety"
      },
      {
        "id": "fc-mag-3",
        "front": "State Fleming’s Left-Hand Rule and where it is applied.",
        "back": "Forefinger = Field, Middle finger = Current, Thumb = Force. Applied in working principle of an Electric Motor.",
        "category": "Rules"
      },
      {
        "id": "fc-mag-4",
        "front": "What is the difference between a Short Circuit and Overloading?",
        "back": "Short circuit occurs when live and neutral wires touch directly (resistance drops to near zero, huge current fires); Overloading occurs when too many appliances draw excess current simultaneously.",
        "category": "Circuits"
      }
    ],
    "commonTraps": [
      "Using Fleming's Left-Hand Rule for induced current (Use Left-Hand for Motor/Force, and Right-Hand for Generator/Induced current).",
      "Connecting the electric fuse in the neutral wire (Fuse must ALWAYS be connected in the LIVE wire to cut off high voltage during faults).",
      "Assuming magnetic field lines start at North and end at South (They form continuous closed loops: North to South outside, but South to North inside the magnet)."
    ],
    "isFreeSample": false
  },
  {
    "id": "sci-ch13",
    "chapterSlug": "our-environment",
    "chapterNumber": 13,
    "chapterTitle": "Our Environment",
    "subject": "science",
    "summaryNote": "Ecosystem components, trophic levels, Lindeman’s 10% energy law, biological magnification, ozone depletion mechanism, and waste management.",
    "coreRules": [
      "Ecosystem = Biotic components (producers, consumers, decomposers) + Abiotic components (temperature, rainfall, soil, minerals).",
      "Producers (Green plants) capture only about 1% of the solar energy that falls on their leaves and convert it into food energy.",
      "Lindeman’s 10% Law: Only 10% of the energy entering a trophic level is transferred to the next higher level; 90% is lost as heat, respiration, and metabolic activities. Hence food chains rarely exceed 3-4 trophic levels.",
      "Biological Magnification (Biomagnification): Progressive accumulation and increase in concentration of non-biodegradable toxic chemicals (e.g. DDT) at each successive trophic level, reaching maximum concentration in top carnivores/humans.",
      "Ozone Layer (O₃) in Stratosphere: Shields Earth from deadly solar ultraviolet (UV) radiation (which causes skin cancer, cataracts, and immune damage).",
      "Ozone Depletion: Chlorofluorocarbons (CFCs) release chlorine free radicals that decompose O₃ into O₂. 1987 UNEP Montreal Protocol froze CFC production."
    ],
    "formulas": [
      {
        "label": "Lindeman’s 10% Energy Transfer Law",
        "formulaLatex": "E_{n+1} = 10\\% \\times E_n = 0.10 \\times E_n \\quad (90\\% \\text{ lost as metabolic heat})",
        "notes": "Example: Plants (10,000 J) → Deer (1,000 J) → Tiger (100 J)"
      },
      {
        "label": "Solar Energy Capture by Producers",
        "formulaLatex": "\\text{Captured Energy} = 1\\% \\times \\text{Total Incident Solar Sunlight}"
      },
      {
        "label": "Ozone Formation in Stratosphere",
        "formulaLatex": "O_2 \\xrightarrow{\\text{High energy UV}} O + O, \\qquad O + O_2 \\rightarrow O_3 \\text{ (Ozone)}"
      },
      {
        "label": "CFC Ozone Depletion Mechanism",
        "formulaLatex": "CFCl_3 \\xrightarrow{UV} CFCl_2 + Cl^\\bullet, \\qquad Cl^\\bullet + O_3 \\rightarrow ClO^\\bullet + O_2 \\quad (1 \\text{ Cl radical destroys } 10^5 \\text{ ozone molecules})"
      },
      {
        "label": "Biomagnification Trophic Progression",
        "formulaLatex": "\\text{Water (0.000003 ppm)} \\rightarrow \\text{Phytoplankton} \\rightarrow \\text{Small Fish} \\rightarrow \\text{Large Fish} \\rightarrow \\text{Fish-eating Birds / Humans (Highest ppm)}"
      }
    ],
    "flashcards": [
      {
        "id": "fc-env-1",
        "front": "What is Lindeman’s 10% Law of energy transfer?",
        "back": "Only 10% of the energy available at a trophic level is transferred to the next higher trophic level; 90% is lost as metabolic heat to the environment.",
        "category": "Energy Flow"
      },
      {
        "id": "fc-env-2",
        "front": "Why do food chains rarely have more than 3 to 4 trophic levels?",
        "back": "Due to the 10% law, the amount of usable energy becomes so negligibly small after 4 trophic levels that it cannot support another organism.",
        "category": "Food Chains"
      },
      {
        "id": "fc-env-3",
        "front": "What is Biological Magnification?",
        "back": "The phenomenon where the concentration of harmful non-biodegradable chemicals (like DDT) progressively increases at each successive trophic level in a food chain.",
        "category": "Pollution"
      },
      {
        "id": "fc-env-4",
        "front": "How is the ozone molecule formed in the upper atmosphere?",
        "back": "High-energy UV radiation splits O₂ into free oxygen atoms (O), which combine with molecular oxygen (O₂) to form Ozone (O₃).",
        "category": "Ozone"
      }
    ],
    "commonTraps": [
      "Assuming energy flows bidirectionally or cyclically in an ecosystem (Energy flow is STRICTLY UNIDIRECTIONAL — solar energy never reverts back from herbivores to sun).",
      "Confusing the 1% solar capture by plants with the 10% trophic transfer law (Plants capture 1% of sunlight; each trophic step transfers 10%).",
      "Believing biodegradable waste is harmless in any quantity (Excess biodegradable waste in water bodies depletes dissolved oxygen, causing eutrophication and death of aquatic life)."
    ],
    "isFreeSample": false
  }
];
