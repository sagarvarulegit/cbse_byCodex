/**
 * CBSE Class 10 Board Exam Score Predictor & Readiness Diagnostic Engine
 * 
 * Accurately models official CBSE 2026/27 blueprints, 80-mark structure,
 * unit weightages, question type distributions, and 5-year PYQ historical data.
 */

export type ChapterConfidence = 'mastered' | 'comfortable' | 'needs_revision' | 'struggling' | 'unstudied';

export interface ReadinessChapter {
  id: string;
  slug: string;
  title: string;
  unitId: string;
  unitTitle: string;
  weightageMarks: number; // approximate marks allocated in 80m paper
  tier: 'high' | 'medium' | 'foundational';
  hasFiveMarker: boolean;
  hasCaseStudy: boolean;
  keyConcepts: string[];
  recommendedToolPath: string;
  recommendedToolLabel: string;
}

export interface ReadinessUnit {
  id: string;
  title: string;
  officialMarks: number;
  chapters: ReadinessChapter[];
}

export interface SubjectReadinessBlueprint {
  slug: string;
  code: string;
  title: string;
  shortTitle: string;
  icon: string;
  accentColor: string;
  totalMarks: number; // 80
  passingMarks: number; // 26 (33% of 80)
  targetCentumMarks: number; // 76-80
  units: ReadinessUnit[];
  sectionDefinitions: {
    section: 'A' | 'B' | 'C' | 'D' | 'E';
    title: string;
    description: string;
    totalMarks: number;
    questionCount: number;
    marksPerQuestion: number | string;
  }[];
}

export interface ChapterReadinessState {
  confidence: ChapterConfidence;
  estimatedAccuracy: number; // 0 to 100
  notesRead?: boolean;
  quizAttempted?: boolean;
  quizScorePercent?: number;
}

export interface SectionProjection {
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  title: string;
  maxMarks: number;
  predictedMarks: number;
  percentage: number;
  status: 'safe' | 'needs_work' | 'vulnerable';
  riskNote: string;
}

export interface DailyRoadmapTask {
  day: number;
  phase: 'High-Yield Anchors' | 'Section D & Case Studies' | 'Formula & Weak Spot Polish' | 'Final Mock & Simulation';
  chapterSlug: string;
  chapterTitle: string;
  unitTitle: string;
  focusTopics: string[];
  estimatedMinutes: number;
  potentialMarksGain: number;
  actionHref: string;
  actionLabel: string;
  actionType: 'formula' | 'lab' | 'pyq' | 'quiz' | 'mock';
}

export interface PerformanceTier {
  tierName: string;
  badge: string;
  color: string;
  description: string;
  percentileEstimate: string;
}

export interface ReadinessDiagnosticResult {
  subjectSlug: string;
  subjectTitle: string;
  subjectCode: string;
  readinessScore: number; // 0 - 100
  predictedMarks: number; // 0 - 80
  predictedMarksMin: number;
  predictedMarksMax: number;
  predictedPercentage: number; // 0 - 100%
  performanceTier: PerformanceTier;
  unitBreakdowns: {
    unitId: string;
    unitTitle: string;
    maxMarks: number;
    earnedMarks: number;
    readinessPercent: number;
    status: 'mastered' | 'good' | 'average' | 'critical';
  }[];
  sectionProjections: SectionProjection[];
  topWeakSpots: {
    chapterSlug: string;
    chapterTitle: string;
    unitTitle: string;
    weightageMarks: number;
    confidence: ChapterConfidence;
    marksDeficit: number;
    priorityReason: string;
    quickFixTip: string;
    toolHref: string;
    toolLabel: string;
  }[];
  topStrengths: {
    chapterSlug: string;
    chapterTitle: string;
    weightageMarks: number;
  }[];
  roadmap14Day: DailyRoadmapTask[];
}

export interface TargetScoreSimulation {
  targetMarks: number;
  currentPredictedMarks: number;
  marksGap: number;
  isAchievable14Days: boolean;
  requiredDailyStudyHours: number;
  upgradesNeeded: {
    chapterSlug: string;
    chapterTitle: string;
    fromConfidence: ChapterConfidence;
    toConfidence: ChapterConfidence;
    marksGain: number;
    effortLevel: 'Low' | 'Medium' | 'High';
    actionTip: string;
  }[];
}

// ── CONFIDENCE COEFFICIENTS ──────────────────────────────────────────────────
export const CONFIDENCE_WEIGHTS: Record<ChapterConfidence, { factor: number; label: string; color: string; icon: string }> = {
  mastered: { factor: 0.96, label: 'Mastered', color: '#16a34a', icon: '🌟' },
  comfortable: { factor: 0.80, label: 'Comfortable', color: '#0284c7', icon: '👍' },
  needs_revision: { factor: 0.55, label: 'Needs Revision', color: '#ea580c', icon: '⚡' },
  struggling: { factor: 0.25, label: 'Struggling', color: '#dc2626', icon: '🚨' },
  unstudied: { factor: 0.10, label: 'Unstudied', color: '#64748b', icon: '⏳' },
};

// ── SUBJECT BLUEPRINTS ───────────────────────────────────────────────────────
export const READINESS_SUBJECTS: Record<string, SubjectReadinessBlueprint> = {
  'science': {
    slug: 'science',
    code: '086',
    title: 'Science',
    shortTitle: 'Science',
    icon: '🧪',
    accentColor: '#0b7a48',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'chemical-substances',
        title: 'Chemical Substances - Nature & Behaviour',
        officialMarks: 25,
        chapters: [
          {
            id: 'chemical-reactions-and-equations',
            slug: 'chemical-reactions-and-equations',
            title: 'Chemical Reactions and Equations',
            unitId: 'chemical-substances',
            unitTitle: 'Chemical Substances',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Balancing equations', 'Thermal & electrolytic decomposition', 'Redox identification', 'Corrosion & Rancidity'],
            recommendedToolPath: '/activities-and-diagrams',
            recommendedToolLabel: 'View NCERT Reactions Lab',
          },
          {
            id: 'acids-bases-and-salts',
            slug: 'acids-bases-and-salts',
            title: 'Acids, Bases and Salts',
            unitId: 'chemical-substances',
            unitTitle: 'Chemical Substances',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Chlor-alkali process', 'Bleaching powder & Baking soda prep', 'Plaster of Paris hydration', 'pH in everyday life'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Salt Preparation Cheatsheet',
          },
          {
            id: 'metals-and-non-metals',
            slug: 'metals-and-non-metals',
            title: 'Metals and Non-metals',
            unitId: 'chemical-substances',
            unitTitle: 'Chemical Substances',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Reactivity series', 'Amphoteric oxides', 'Roasting vs Calcination', 'Thermite reaction & electrolytic refining'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Metallurgy PYQ Ladder',
          },
          {
            id: 'carbon-and-its-compounds',
            slug: 'carbon-and-its-compounds',
            title: 'Carbon and its Compounds',
            unitId: 'chemical-substances',
            unitTitle: 'Chemical Substances',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Covalent bonding & homologous series', 'Functional groups & IUPAC', 'Esterification & Saponification', 'Micelle soap cleansing'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Carbon Reactions Summary',
          },
        ],
      },
      {
        id: 'world-of-living',
        title: 'World of Living (Biology)',
        officialMarks: 25,
        chapters: [
          {
            id: 'life-processes',
            slug: 'life-processes',
            title: 'Life Processes',
            unitId: 'world-of-living',
            unitTitle: 'World of Living',
            weightageMarks: 9,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Photosynthesis balanced equation', '3 Glucose breakdown pathways', 'Human heart double circulation', 'Nephron urine filtration steps'],
            recommendedToolPath: '/activities-and-diagrams',
            recommendedToolLabel: 'Heart & Nephron Diagrams',
          },
          {
            id: 'control-and-coordination',
            slug: 'control-and-coordination',
            title: 'Control and Coordination',
            unitId: 'world-of-living',
            unitTitle: 'World of Living',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Neuron reflex arc', 'Human brain parts & functions', 'Plant phytohormones (Auxin, Cytokinin, ABA)', 'Endocrine system (Thyroxine, Insulin)'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Brain & Reflex Arc Quiz',
          },
          {
            id: 'how-do-organisms-reproduce',
            slug: 'how-do-organisms-reproduce',
            title: 'How do Organisms Reproduce?',
            unitId: 'world-of-living',
            unitTitle: 'World of Living',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Asexual fission/budding/spore modes', 'Double fertilisation in flower', 'Male & female reproductive systems', 'Contraceptive methods & STDs'],
            recommendedToolPath: '/activities-and-diagrams',
            recommendedToolLabel: 'Flower & Budding Diagrams',
          },
          {
            id: 'heredity',
            slug: 'heredity',
            title: 'Heredity',
            unitId: 'world-of-living',
            unitTitle: 'World of Living',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Mendel monohybrid 3:1 & 1:2:1 crosses', 'Dihybrid 9:3:3:1 cross', 'Human sex determination XX/XY'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Mendel Crosses PYQs',
          },
        ],
      },
      {
        id: 'natural-phenomena',
        title: 'Natural Phenomena (Optics)',
        officialMarks: 12,
        chapters: [
          {
            id: 'light-reflection-and-refraction',
            slug: 'light-reflection-and-refraction',
            title: 'Light - Reflection and Refraction',
            unitId: 'natural-phenomena',
            unitTitle: 'Natural Phenomena',
            weightageMarks: 8,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Ray diagrams (Concave mirror & Convex lens)', 'Mirror & lens formulas with sign convention', 'Snell\'s law & refractive index', 'Lens power P=1/f'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Sign Convention Cheatsheet',
          },
          {
            id: 'the-human-eye-and-the-colourful-world',
            slug: 'the-human-eye-and-the-colourful-world',
            title: 'The Human Eye and Colourful World',
            unitId: 'natural-phenomena',
            unitTitle: 'Natural Phenomena',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Myopia vs Hypermetropia lens corrections', 'Prism dispersion (VIBGYOR)', 'Atmospheric refraction (Twinkling stars, Advanced sunrise)', 'Tyndall scattering & blue sky'],
            recommendedToolPath: '/activities-and-diagrams',
            recommendedToolLabel: 'Eye Defects & Prism Ray Tests',
          },
        ],
      },
      {
        id: 'effects-of-current',
        title: 'Effects of Current (Electricity & Magnetism)',
        officialMarks: 13,
        chapters: [
          {
            id: 'electricity',
            slug: 'electricity',
            title: 'Electricity',
            unitId: 'effects-of-current',
            unitTitle: 'Effects of Current',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Ohm\'s law & V-I graph', 'Resistivity R = ρL/A factors', 'Series vs Parallel resistor networks', 'Joule\'s heating H=I²Rt & Commercial energy unit'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Electricity Circuit Formulas',
          },
          {
            id: 'magnetic-effects-of-electric-current',
            slug: 'magnetic-effects-of-electric-current',
            title: 'Magnetic Effects of Electric Current',
            unitId: 'effects-of-current',
            unitTitle: 'Effects of Current',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Right-Hand Thumb Rule', 'Solenoid magnetic field lines', 'Fleming\'s Left-Hand Rule', 'Domestic AC wiring (Live, Neutral, Earth) & Short circuit safety'],
            recommendedToolPath: '/activities-and-diagrams',
            recommendedToolLabel: 'Solenoid & Motor Rules Lab',
          },
        ],
      },
      {
        id: 'natural-resources',
        title: 'Natural Resources (Environment)',
        officialMarks: 5,
        chapters: [
          {
            id: 'our-environment',
            slug: 'our-environment',
            title: 'Our Environment',
            unitId: 'natural-resources',
            unitTitle: 'Natural Resources',
            weightageMarks: 5,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Trophic levels & 10% energy transfer law', 'Biological magnification (DDT)', 'Ozone layer formation & CFC depletion', 'Solid waste biodegradable management'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Ecosystem & Food Web Quiz',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'Section A: MCQs & Assertion-Reason', description: '20 Questions (1 Mark each)', totalMarks: 20, questionCount: 20, marksPerQuestion: 1 },
      { section: 'B', title: 'Section B: Very Short Answers (VSA)', description: '6 Questions (2 Marks each)', totalMarks: 12, questionCount: 6, marksPerQuestion: 2 },
      { section: 'C', title: 'Section C: Short Answers (SA)', description: '7 Questions (3 Marks each)', totalMarks: 21, questionCount: 7, marksPerQuestion: 3 },
      { section: 'D', title: 'Section D: Long Answers (LA)', description: '3 Questions (5 Marks each) - Fixed 5M Anchors', totalMarks: 15, questionCount: 3, marksPerQuestion: 5 },
      { section: 'E', title: 'Section E: Case-Based / Source Integrated', description: '3 Case Studies (4 Marks each with subparts)', totalMarks: 12, questionCount: 3, marksPerQuestion: 4 },
    ],
  },

  'mathematics-standard': {
    slug: 'mathematics-standard',
    code: '041',
    title: 'Mathematics Standard',
    shortTitle: 'Maths Standard',
    icon: '📐',
    accentColor: '#1d4ed8',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'number-systems',
        title: 'Number Systems',
        officialMarks: 6,
        chapters: [
          {
            id: 'real-numbers',
            slug: 'real-numbers',
            title: 'Real Numbers',
            unitId: 'number-systems',
            unitTitle: 'Number Systems',
            weightageMarks: 6,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Fundamental Theorem of Arithmetic', 'HCF × LCM = a × b', '√2, √3, √5 contradiction irrationality proofs', 'Terminating decimal 2^n 5^m condition'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Real Numbers Proofs',
          },
        ],
      },
      {
        id: 'algebra',
        title: 'Algebra',
        officialMarks: 20,
        chapters: [
          {
            id: 'polynomials',
            slug: 'polynomials',
            title: 'Polynomials',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Zeroes & coefficients relation α+β=-b/a, αβ=c/a', 'Quadratic polynomial formation k[x²-Sx+P]', 'Symmetric identities α²+β²'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Polynomial Identities',
          },
          {
            id: 'pair-of-linear-equations-in-two-variables',
            slug: 'pair-of-linear-equations-in-two-variables',
            title: 'Linear Equations in Two Variables',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 5,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Consistency ratios a1/a2 ≠ b1/b2', 'Substitution & Elimination methods', 'Upstream / Downstream boat word problems'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Linear Equations Word Problems',
          },
          {
            id: 'quadratic-equations',
            slug: 'quadratic-equations',
            title: 'Quadratic Equations',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 5,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Discriminant D = b²-4ac & Nature of roots', 'Quadratic formula x=(-b±√D)/2a', 'Speed-distance & work-time word problems'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Quadratic Nature of Roots',
          },
          {
            id: 'arithmetic-progressions',
            slug: 'arithmetic-progressions',
            title: 'Arithmetic Progressions',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['nth term an = a + (n-1)d', 'Sum of n terms Sn = n/2[2a+(n-1)d]', 'nth term from sum an = Sn - Sn-1', 'Case-study savings/installments'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'AP Case Study Ladder',
          },
        ],
      },
      {
        id: 'coordinate-geometry',
        title: 'Coordinate Geometry',
        officialMarks: 6,
        chapters: [
          {
            id: 'coordinate-geometry',
            slug: 'coordinate-geometry',
            title: 'Coordinate Geometry',
            unitId: 'coordinate-geometry',
            unitTitle: 'Coordinate Geometry',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Distance formula √((x2-x1)²+(y2-y1)²)', 'Section formula (m1x2+m2x1)/(m1+m2)', 'Midpoint formula', 'Collinearity and quadrilateral checks'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Section Formula Shortcuts',
          },
        ],
      },
      {
        id: 'geometry',
        title: 'Geometry',
        officialMarks: 15,
        chapters: [
          {
            id: 'triangles',
            slug: 'triangles',
            title: 'Triangles',
            unitId: 'geometry',
            unitTitle: 'Geometry',
            weightageMarks: 8,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Basic Proportionality Theorem (BPT/Thales) Proof', 'Converse of BPT', 'AAA, SAS, SSS similarity criteria & altitude ratios'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'BPT 5-Mark Proof Arena',
          },
          {
            id: 'circles',
            slug: 'circles',
            title: 'Circles',
            unitId: 'geometry',
            unitTitle: 'Geometry',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Theorem: Tangent ⟂ radius at point of contact', 'Theorem: Tangents from external point are equal (PA = PB)', 'Circumscribed quadrilateral AB+CD=AD+BC'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Circles Tangents Proofs',
          },
        ],
      },
      {
        id: 'trigonometry',
        title: 'Trigonometry',
        officialMarks: 12,
        chapters: [
          {
            id: 'introduction-to-trigonometry',
            slug: 'introduction-to-trigonometry',
            title: 'Introduction to Trigonometry',
            unitId: 'trigonometry',
            unitTitle: 'Trigonometry',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Trig ratios table (0°, 30°, 45°, 60°, 90°)', '3 Fundamental identities sin²θ+cos²θ=1, 1+tan²θ=sec²θ', 'Algebraic trigonometry proofs'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Trigonometric Table Vault',
          },
          {
            id: 'some-applications-of-trigonometry',
            slug: 'some-applications-of-trigonometry',
            title: 'Applications of Trigonometry (Heights & Distances)',
            unitId: 'trigonometry',
            unitTitle: 'Trigonometry',
            weightageMarks: 5,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Angle of elevation & depression', 'Two-point observations (30°-60° ratio shortcuts)', 'Lighthouse, cloud, and balloon case studies'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Heights & Distances Case Studies',
          },
        ],
      },
      {
        id: 'mensuration',
        title: 'Mensuration',
        officialMarks: 10,
        chapters: [
          {
            id: 'areas-related-to-circles',
            slug: 'areas-related-to-circles',
            title: 'Areas Related to Circles',
            unitId: 'mensuration',
            unitTitle: 'Mensuration',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Sector area (θ/360)πr²', 'Segment area Sector - Triangle', 'Arc length (θ/360)2πr', 'Clock hands & wiper blade geometry'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Sector & Segment Formulas',
          },
          {
            id: 'surface-areas-and-volumes',
            slug: 'surface-areas-and-volumes',
            title: 'Surface Areas and Volumes',
            unitId: 'mensuration',
            unitTitle: 'Mensuration',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Combination of solids (Cylinder + Hemispheres / Cone)', 'Conversion of solids (Sphere melted into wire)', 'Water flow rate in pipes and embankments'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Combination of Solids 5-Markers',
          },
        ],
      },
      {
        id: 'statistics-and-probability',
        title: 'Statistics & Probability',
        officialMarks: 11,
        chapters: [
          {
            id: 'statistics',
            slug: 'statistics',
            title: 'Statistics',
            unitId: 'statistics-and-probability',
            unitTitle: 'Statistics & Probability',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Mean (Direct, Assumed Mean a + Σfd/Σf)', 'Mode formula l + [(f1-f0)/(2f1-f0-f2)]h', 'Median formula l + [(N/2-cf)/f]h with missing frequencies', 'Empirical relation Mode = 3Median - 2Mean'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Mean Mode Median Formulas',
          },
          {
            id: 'probability',
            slug: 'probability',
            title: 'Probability',
            unitId: 'statistics-and-probability',
            unitTitle: 'Statistics & Probability',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Classical P(E) = n(E)/n(S)', 'Playing cards 52-deck breakdown (Face cards, Aces)', '2-Dice 36 outcome grid', 'Leap year vs non-leap year probabilities'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Cards & Dice Probability Quiz',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'Section A: MCQs & Assertion-Reason', description: '20 Questions (1 Mark each)', totalMarks: 20, questionCount: 20, marksPerQuestion: 1 },
      { section: 'B', title: 'Section B: Very Short Answers (VSA)', description: '5 Questions (2 Marks each)', totalMarks: 10, questionCount: 5, marksPerQuestion: 2 },
      { section: 'C', title: 'Section C: Short Answers (SA)', description: '6 Questions (3 Marks each)', totalMarks: 18, questionCount: 6, marksPerQuestion: 3 },
      { section: 'D', title: 'Section D: Long Answers (LA)', description: '4 Questions (5 Marks each) - BPT, Statistics, Surface Area', totalMarks: 20, questionCount: 4, marksPerQuestion: 5 },
      { section: 'E', title: 'Section E: Case-Based / Source Integrated', description: '3 Case Studies (4 Marks each)', totalMarks: 12, questionCount: 3, marksPerQuestion: 4 },
    ],
  },

  'mathematics-basic': {
    slug: 'mathematics-basic',
    code: '241',
    title: 'Mathematics Basic',
    shortTitle: 'Maths Basic',
    icon: '➗',
    accentColor: '#0284c7',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'number-systems',
        title: 'Number Systems',
        officialMarks: 6,
        chapters: [
          {
            id: 'real-numbers',
            slug: 'real-numbers',
            title: 'Real Numbers',
            unitId: 'number-systems',
            unitTitle: 'Number Systems',
            weightageMarks: 6,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Direct HCF & LCM prime factorisation', 'HCF × LCM = a × b direct formula', 'Basic √3 irrationality proof'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Real Numbers Formulas',
          },
        ],
      },
      {
        id: 'algebra',
        title: 'Algebra',
        officialMarks: 20,
        chapters: [
          {
            id: 'polynomials',
            slug: 'polynomials',
            title: 'Polynomials',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Finding zeroes from graph', 'Sum and product of zeroes', 'Standard quadratic polynomial'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Polynomial Zeroes Cheatsheet',
          },
          {
            id: 'pair-of-linear-equations-in-two-variables',
            slug: 'pair-of-linear-equations-in-two-variables',
            title: 'Linear Equations in Two Variables',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 5,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Elimination method', 'Unique vs Parallel lines condition', 'Direct age or cost word problems'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Elimination Method Drills',
          },
          {
            id: 'quadratic-equations',
            slug: 'quadratic-equations',
            title: 'Quadratic Equations',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 5,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Direct formula x = (-b±√D)/2a', 'Discriminant D > 0 check', 'Factorisation of simple quadratics'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Quadratic Formula Guide',
          },
          {
            id: 'arithmetic-progressions',
            slug: 'arithmetic-progressions',
            title: 'Arithmetic Progressions',
            unitId: 'algebra',
            unitTitle: 'Algebra',
            weightageMarks: 6,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Finding nth term an = a + (n-1)d', 'Direct sum formula Sn = n/2(a+l)', 'Identifying AP common difference d'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'AP Standard Sums',
          },
        ],
      },
      {
        id: 'coordinate-geometry',
        title: 'Coordinate Geometry',
        officialMarks: 6,
        chapters: [
          {
            id: 'coordinate-geometry',
            slug: 'coordinate-geometry',
            title: 'Coordinate Geometry',
            unitId: 'coordinate-geometry',
            unitTitle: 'Coordinate Geometry',
            weightageMarks: 6,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Direct distance between two points', 'Midpoint formula (x1+x2)/2', 'Section formula with integer ratios'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Coordinate Geometry Cheatsheet',
          },
        ],
      },
      {
        id: 'geometry',
        title: 'Geometry',
        officialMarks: 15,
        chapters: [
          {
            id: 'triangles',
            slug: 'triangles',
            title: 'Triangles',
            unitId: 'geometry',
            unitTitle: 'Geometry',
            weightageMarks: 8,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['State and prove BPT (Thales Theorem)', 'Direct application of AD/DB = AE/EC', 'Similar triangle ratios'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'BPT Guaranteed Theorem',
          },
          {
            id: 'circles',
            slug: 'circles',
            title: 'Circles',
            unitId: 'geometry',
            unitTitle: 'Geometry',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['External tangents equality proof PA=PB', 'Radius perpendicular to tangent at contact point', 'Direct angle calculations'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Circle Tangent Proofs',
          },
        ],
      },
      {
        id: 'trigonometry',
        title: 'Trigonometry',
        officialMarks: 12,
        chapters: [
          {
            id: 'introduction-to-trigonometry',
            slug: 'introduction-to-trigonometry',
            title: 'Introduction to Trigonometry',
            unitId: 'trigonometry',
            unitTitle: 'Trigonometry',
            weightageMarks: 7,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Direct trigonometric ratios values (30°, 45°, 60°)', 'Basic identity sin²θ+cos²θ=1 substitution', 'Simple evaluating expressions'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Trig Angle Value Sheet',
          },
          {
            id: 'some-applications-of-trigonometry',
            slug: 'some-applications-of-trigonometry',
            title: 'Applications of Trigonometry',
            unitId: 'trigonometry',
            unitTitle: 'Trigonometry',
            weightageMarks: 5,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Single triangle height calculations (tan 30° = 1/√3, tan 45° = 1, tan 60° = √3)', 'Tower and building shadow problems'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Basic Heights & Distances',
          },
        ],
      },
      {
        id: 'mensuration',
        title: 'Mensuration',
        officialMarks: 10,
        chapters: [
          {
            id: 'areas-related-to-circles',
            slug: 'areas-related-to-circles',
            title: 'Areas Related to Circles',
            unitId: 'mensuration',
            unitTitle: 'Mensuration',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Sector area formula (θ/360)πr²', 'Circumference & area of circle', 'Perimeter of semicircle πr + 2r'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Circle Area Formulas',
          },
          {
            id: 'surface-areas-and-volumes',
            slug: 'surface-areas-and-volumes',
            title: 'Surface Areas and Volumes',
            unitId: 'mensuration',
            unitTitle: 'Mensuration',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Direct cylinder, cone, hemisphere formulas', 'Total surface area of combined solid (Cylinder + 2 Hemispheres)', 'Volume of melted cylinder into spheres'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Solid Volume Master List',
          },
        ],
      },
      {
        id: 'statistics-and-probability',
        title: 'Statistics & Probability',
        officialMarks: 11,
        chapters: [
          {
            id: 'statistics',
            slug: 'statistics',
            title: 'Statistics',
            unitId: 'statistics-and-probability',
            unitTitle: 'Statistics & Probability',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Direct Mean formula Σfx/Σf', 'Direct Mode formula l + [(f1-f0)/(2f1-f0-f2)]h', 'Direct Median calculation with cumulative frequency'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Statistics Guaranteed Step Marks',
          },
          {
            id: 'probability',
            slug: 'probability',
            title: 'Probability',
            unitId: 'statistics-and-probability',
            unitTitle: 'Statistics & Probability',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Single coin and 2-coin tosses', 'Single die rolling (Prime, Even, Odd numbers)', 'Coloured marbles in a bag'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Probability Easy Marks Quiz',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'Section A: MCQs & Assertion-Reason', description: '20 Questions (1 Mark each)', totalMarks: 20, questionCount: 20, marksPerQuestion: 1 },
      { section: 'B', title: 'Section B: Very Short Answers (VSA)', description: '5 Questions (2 Marks each)', totalMarks: 10, questionCount: 5, marksPerQuestion: 2 },
      { section: 'C', title: 'Section C: Short Answers (SA)', description: '6 Questions (3 Marks each)', totalMarks: 18, questionCount: 6, marksPerQuestion: 3 },
      { section: 'D', title: 'Section D: Long Answers (LA)', description: '4 Questions (5 Marks each) - Straightforward Textbook Sums', totalMarks: 20, questionCount: 4, marksPerQuestion: 5 },
      { section: 'E', title: 'Section E: Case-Based / Source Integrated', description: '3 Case Studies (4 Marks each)', totalMarks: 12, questionCount: 3, marksPerQuestion: 4 },
    ],
  },

  'social-science': {
    slug: 'social-science',
    code: '087',
    title: 'Social Science',
    shortTitle: 'Social Science',
    icon: '🌍',
    accentColor: '#c2410c',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'india-and-the-contemporary-world-ii',
        title: 'History: India and the Contemporary World - II',
        officialMarks: 20,
        chapters: [
          {
            id: 'the-rise-of-nationalism-in-europe',
            slug: 'the-rise-of-nationalism-in-europe',
            title: 'The Rise of Nationalism in Europe',
            unitId: 'india-and-the-contemporary-world-ii',
            unitTitle: 'History',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Napoleonic Code 1804 provisions', 'Unification of Germany & Italy steps', 'Greek War of Independence', 'Visual allegories (Germania & Marianne)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'European Nationalism 5M',
          },
          {
            id: 'nationalism-in-india',
            slug: 'nationalism-in-india',
            title: 'Nationalism in India',
            unitId: 'india-and-the-contemporary-world-ii',
            unitTitle: 'History',
            weightageMarks: 7,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: true,
            keyConcepts: ['Non-Cooperation vs Civil Disobedience movements', 'Rowlatt Act & Jallianwala Bagh', 'Poona Pact & Simon Commission', 'Mandatory 2-Mark History Map items'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Nationalism in India & Map Work',
          },
          {
            id: 'the-making-of-a-global-world',
            slug: 'the-making-of-a-global-world',
            title: 'The Making of a Global World',
            unitId: 'india-and-the-contemporary-world-ii',
            unitTitle: 'History',
            weightageMarks: 3,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Silk Routes connecting pre-modern world', 'Rinderpest cattle plague in Africa', 'Indentured labour migration'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Global World Sub-topic Quiz',
          },
          {
            id: 'print-culture-and-the-modern-world',
            slug: 'print-culture-and-the-modern-world',
            title: 'Print Culture and the Modern World',
            unitId: 'india-and-the-contemporary-world-ii',
            unitTitle: 'History',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Gutenberg printing press innovation', 'Martin Luther Protestant Reformation', 'Vernacular Press Act 1878 & censorship'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Print Culture Practice',
          },
        ],
      },
      {
        id: 'contemporary-india-ii',
        title: 'Geography: Contemporary India - II',
        officialMarks: 20,
        chapters: [
          {
            id: 'resources-and-development',
            slug: 'resources-and-development',
            title: 'Resources and Development',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 3,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Soil classification (Alluvial, Black, Red/Yellow, Laterite)', 'Soil erosion & conservation methods', 'Rio Earth Summit 1992 & Agenda 21'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Soil Types & Map Skills',
          },
          {
            id: 'forest-and-wildlife-resources',
            slug: 'forest-and-wildlife-resources',
            title: 'Forest and Wildlife Resources',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 2,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Reserved vs Protected vs Unclassed forests', 'Joint Forest Management (JFM)', 'Chipko Movement & Beej Bachao Andolan'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Forest Conservation Quiz',
          },
          {
            id: 'water-resources',
            slug: 'water-resources',
            title: 'Water Resources',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 3,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Multi-purpose river valley projects pros & cons', 'Rooftop rainwater harvesting in Rajasthan (Taankas)', 'Mandatory Major Dams Map items'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Dams & Water Map Items',
          },
          {
            id: 'agriculture',
            slug: 'agriculture',
            title: 'Agriculture',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Kharif vs Rabi vs Zaid cropping seasons', 'Rice, Wheat, Sugarcane, Tea climate requirements', 'Institutional & technical agricultural reforms'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Crops Climate Criteria',
          },
          {
            id: 'minerals-and-energy-resources',
            slug: 'minerals-and-energy-resources',
            title: 'Minerals and Energy Resources',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Conventional vs Non-conventional energy (Solar, Wind, Biogas)', 'Iron ore belts (Odisha-Jharkhand, Durg-Bastar)', 'Thermal & Nuclear Power Plants Map items'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Minerals & Power Plants Map',
          },
          {
            id: 'manufacturing-industries',
            slug: 'manufacturing-industries',
            title: 'Manufacturing Industries',
            unitId: 'contemporary-india-ii',
            unitTitle: 'Geography',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Factors influencing industrial location', 'Iron and Steel industry raw materials', 'Control of environmental industrial pollution'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Manufacturing Trends',
          },
        ],
      },
      {
        id: 'democratic-politics-ii',
        title: 'Political Science: Democratic Politics - II',
        officialMarks: 20,
        chapters: [
          {
            id: 'power-sharing',
            slug: 'power-sharing',
            title: 'Power-sharing',
            unitId: 'democratic-politics-ii',
            unitTitle: 'Political Science',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Belgium accommodation model vs Sri Lanka majoritarianism', 'Horizontal vs Vertical power sharing', 'Prudential vs Moral reasons'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Power Sharing Essentials',
          },
          {
            id: 'federalism',
            slug: 'federalism',
            title: 'Federalism',
            unitId: 'democratic-politics-ii',
            unitTitle: 'Political Science',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Union List vs State List vs Concurrent List', 'Key features of Federalism', '1992 Decentralisation Amendment (Panchayati Raj)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Federalism 3M/5M Questions',
          },
          {
            id: 'gender-religion-and-caste',
            slug: 'gender-religion-and-caste',
            title: 'Gender, Religion and Caste',
            unitId: 'democratic-politics-ii',
            unitTitle: 'Political Science',
            weightageMarks: 3,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Feminist movement & women representation in politics', 'Communalism forms & constitutional secularism', 'Caste in politics vs Politics in caste'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Gender & Politics Quiz',
          },
          {
            id: 'political-parties',
            slug: 'political-parties',
            title: 'Political Parties',
            unitId: 'democratic-politics-ii',
            unitTitle: 'Political Science',
            weightageMarks: 5,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Functions of political parties', 'National vs State Party criteria (ECI)', 'Challenges facing political parties & reform measures (Anti-Defection)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Political Parties 5-Markers',
          },
          {
            id: 'outcomes-of-democracy',
            slug: 'outcomes-of-democracy',
            title: 'Outcomes of Democracy',
            unitId: 'democratic-politics-ii',
            unitTitle: 'Political Science',
            weightageMarks: 4,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Accountable, responsive & legitimate government', 'Economic growth vs reduction of inequality', 'Dignity and freedom of citizens'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Outcomes of Democracy Q&A',
          },
        ],
      },
      {
        id: 'understanding-economic-development',
        title: 'Economics: Understanding Economic Development',
        officialMarks: 20,
        chapters: [
          {
            id: 'development',
            slug: 'development',
            title: 'Development',
            unitId: 'understanding-economic-development',
            unitTitle: 'Economics',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Per Capita Income / World Bank criteria', 'Human Development Index (HDI / UNDP)', 'Sustainable development & groundwater crisis'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Development Indicators',
          },
          {
            id: 'sectors-of-the-indian-economy',
            slug: 'sectors-of-the-indian-economy',
            title: 'Sectors of the Indian Economy',
            unitId: 'understanding-economic-development',
            unitTitle: 'Economics',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: true,
            keyConcepts: ['Primary vs Secondary vs Tertiary GDP contribution', 'Disguised / Underemployment in agriculture', 'Organised vs Unorganised sector protections', 'MGNREGA 2005 100 days guarantee'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Economic Sectors 5-Markers',
          },
          {
            id: 'money-and-credit',
            slug: 'money-and-credit',
            title: 'Money and Credit',
            unitId: 'understanding-economic-development',
            unitTitle: 'Economics',
            weightageMarks: 6,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Double coincidence of wants & money as medium', 'Formal (Banks/RBI) vs Informal credit sources', 'Self-Help Groups (SHGs) for rural poor', 'Terms of credit (Collateral, Interest, Documentation)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Money & Credit Long Answers',
          },
          {
            id: 'globalisation-and-the-indian-economy',
            slug: 'globalisation-and-the-indian-economy',
            title: 'Globalisation and the Indian Economy',
            unitId: 'understanding-economic-development',
            unitTitle: 'Economics',
            weightageMarks: 4,
            tier: 'foundational',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['MNCs production across countries', 'Foreign trade & market integration', 'Liberalisation & WTO role', 'Fair globalisation policies'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Globalisation Trends Quiz',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'Section A: MCQs & Objective Questions', description: '20 Questions (1 Mark each)', totalMarks: 20, questionCount: 20, marksPerQuestion: 1 },
      { section: 'B', title: 'Section B: Very Short Answers (VSA)', description: '4 Questions (2 Marks each)', totalMarks: 8, questionCount: 4, marksPerQuestion: 2 },
      { section: 'C', title: 'Section C: Short Answers (SA)', description: '5 Questions (3 Marks each)', totalMarks: 15, questionCount: 5, marksPerQuestion: 3 },
      { section: 'D', title: 'Section D: Long Answers (LA)', description: '4 Questions (5 Marks each) - 1 History, 1 Geo, 1 Pol, 1 Eco', totalMarks: 20, questionCount: 4, marksPerQuestion: 5 },
      { section: 'E', title: 'Section E: Case-Based / Source Integrated', description: '3 Case Studies (4 Marks each)', totalMarks: 12, questionCount: 3, marksPerQuestion: 4 },
    ],
  },

  'english-language-and-literature': {
    slug: 'english-language-and-literature',
    code: '184',
    title: 'English Language & Literature',
    shortTitle: 'English 184',
    icon: '📖',
    accentColor: '#0f766e',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'reading-skills',
        title: 'Section A: Reading Skills',
        officialMarks: 20,
        chapters: [
          {
            id: 'discursive-passage',
            slug: 'discursive-passage',
            title: 'Discursive Passage (Comprehension & Vocabulary)',
            unitId: 'reading-skills',
            unitTitle: 'Reading Skills',
            weightageMarks: 10,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Inference & critical evaluation', 'Tone and attitude identification', 'Contextual vocabulary & antonyms', 'Title and central idea justification'],
            recommendedToolPath: '/exam-papers',
            recommendedToolLabel: 'Practice Reading Passages',
          },
          {
            id: 'case-based-factual-passage',
            slug: 'case-based-factual-passage',
            title: 'Case-based Factual Passage with Visual Inputs',
            unitId: 'reading-skills',
            unitTitle: 'Reading Skills',
            weightageMarks: 10,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Data interpretation from tables/charts', 'Extracting factual evidence', 'Evaluating claims vs data', 'Short analytical deductions'],
            recommendedToolPath: '/exam-papers',
            recommendedToolLabel: 'Case Passage Simulator',
          },
        ],
      },
      {
        id: 'writing-and-grammar',
        title: 'Section B: Writing Skills & Grammar',
        officialMarks: 20,
        chapters: [
          {
            id: 'formal-letter-writing',
            slug: 'formal-letter-writing',
            title: 'Formal Letter (Complaint / Order / Editor)',
            unitId: 'writing-and-grammar',
            unitTitle: 'Writing Skills',
            weightageMarks: 5,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Sender/receiver address layout', 'Subject line precision', '3-Paragraph structure (Cause, Impact, Remedy)', 'Formal closing and sign-off etiquette'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Letter Formats & Templates',
          },
          {
            id: 'analytical-paragraph',
            slug: 'analytical-paragraph',
            title: 'Analytical Paragraph (Graph/Chart/Cue Analysis)',
            unitId: 'writing-and-grammar',
            unitTitle: 'Writing Skills',
            weightageMarks: 5,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['Introductory overview sentence', 'Comparative trend language (surged, plummeted)', 'Data synthesis without personal bias', 'Concluding summary statement'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Analytical Paragraph Samples',
          },
          {
            id: 'integrated-grammar',
            slug: 'integrated-grammar',
            title: 'Integrated Grammar (Tenses, Modals, Reported Speech)',
            unitId: 'writing-and-grammar',
            unitTitle: 'Grammar',
            weightageMarks: 10,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['Reported Speech dialogues & conversions', 'Subject-Verb Concord agreement', 'Determiners & Modals accuracy', 'Error correction & gap filling rules'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Grammar Error Correction Quiz',
          },
        ],
      },
      {
        id: 'language-through-literature',
        title: 'Section C: Language Through Literature',
        officialMarks: 40,
        chapters: [
          {
            id: 'first-flight-prose',
            slug: 'first-flight-prose',
            title: 'First Flight: Prose Master Units',
            unitId: 'language-through-literature',
            unitTitle: 'Literature',
            weightageMarks: 14,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: true,
            keyConcepts: ['A Letter to God (Lencho\'s faith vs irony)', 'Nelson Mandela (Oppressor & oppressed freedom)', 'Two Stories about Flying (Overcoming fear)', 'Mijbil the Otter & Madam Rides the Bus'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'First Flight 6-Mark Questions',
          },
          {
            id: 'first-flight-poetry',
            slug: 'first-flight-poetry',
            title: 'First Flight: Poems & Literary Devices',
            unitId: 'language-through-literature',
            unitTitle: 'Literature',
            weightageMarks: 10,
            tier: 'medium',
            hasFiveMarker: false,
            hasCaseStudy: true,
            keyConcepts: ['Dust of Snow & Fire and Ice (Symbolism)', 'A Tiger in the Zoo (Captivity vs wild)', 'Amanda! (Parental nagging & imagination)', 'The Trees & Fog (Metaphors)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Poetic Devices & Extracts',
          },
          {
            id: 'footprints-without-feet',
            slug: 'footprints-without-feet',
            title: 'Footprints Without Feet (Supplementary)',
            unitId: 'language-through-literature',
            unitTitle: 'Literature',
            weightageMarks: 16,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: true,
            keyConcepts: ['A Triumph of Surgery (Tricki & Mrs Pumphrey)', 'The Thief\'s Story (Hari Singh & Anil transformational trust)', 'The Necklace (Matilda\'s false pride & ruin)', 'Bholi (Education as empowerment)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Supplementary 6-Mark LAs',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'Section A: Reading Skills', description: '2 Unseen Passages (20 Marks)', totalMarks: 20, questionCount: 20, marksPerQuestion: 1 },
      { section: 'B', title: 'Section B: Writing Skills & Grammar', description: 'Grammar (10M) + Letter (5M) + Analytical Paragraph (5M)', totalMarks: 20, questionCount: 12, marksPerQuestion: '1 to 5' },
      { section: 'C', title: 'Section C: Literature (First Flight & Footprints)', description: 'Extracts (10M) + Short Answers (12M) + Long Answers (12M) + Supplementary (6M)', totalMarks: 40, questionCount: 14, marksPerQuestion: '3 to 6' },
      { section: 'D', title: 'Board Step-Marking Fidelity', description: 'Fluency, Content, Organization & Accuracy', totalMarks: 0, questionCount: 0, marksPerQuestion: 0 },
      { section: 'E', title: 'Thematic Character Comparisons', description: 'Extrapolative Long Answer synthesis', totalMarks: 0, questionCount: 0, marksPerQuestion: 0 },
    ],
  },

  'hindi-a': {
    slug: 'hindi-a',
    code: '002',
    title: 'Hindi Course A',
    shortTitle: 'Hindi A',
    icon: '🇮🇳',
    accentColor: '#9333ea',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'reading-comprehension',
        title: 'खंड क: अपठित बोध',
        officialMarks: 14,
        chapters: [
          {
            id: 'unseen-passage-hindi',
            slug: 'unseen-passage-hindi',
            title: 'अपठित गद्यांश एवं काव्यांश',
            unitId: 'reading-comprehension',
            unitTitle: 'अपठित बोध',
            weightageMarks: 14,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['शीर्षक चयन एवं केंद्रीय भाव', 'तथ्यात्मक एवं विचारपरक प्रश्न', 'काव्यांश का भाव सौंदर्य'],
            recommendedToolPath: '/exam-papers',
            recommendedToolLabel: 'Hindi A Mock Papers',
          },
        ],
      },
      {
        id: 'grammar-hindi',
        title: 'खंड ख: व्यावहारिक व्याकरण',
        officialMarks: 16,
        chapters: [
          {
            id: 'hindi-grammar-complete',
            slug: 'hindi-grammar-complete',
            title: 'रचना के आधार पर वाक्य भेद, वाच्य, पद-परिचय, अलंकार',
            unitId: 'grammar-hindi',
            unitTitle: 'व्याकरण',
            weightageMarks: 16,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['सरल, संयुक्त एवं मिश्र वाक्य रूपांतरण', 'कर्तृवाच्य, कर्मवाच्य एवं भाववाच्य परिवर्तन', 'संज्ञा/सर्वनाम/विशेषण पद-परिचय', 'श्लेष, उत्प्रेक्षा, अतिशयोक्ति, मानवीकरण अलंकार'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Hindi Grammar Quizzes',
          },
        ],
      },
      {
        id: 'literature-hindi-kshitij-kritika',
        title: 'खंड ग: पाठ्यपुस्तक (क्षितिज एवं कृतिका)',
        officialMarks: 34,
        chapters: [
          {
            id: 'kshitij-bhag-2',
            slug: 'kshitij-bhag-2',
            title: 'क्षितिज भाग-2 (गद्य एवं काव्य खंड)',
            unitId: 'literature-hindi-kshitij-kritika',
            unitTitle: 'साहित्य',
            weightageMarks: 26,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['नेताजी का चश्मा (देशभक्ति की भावना)', 'बालगोबिन भगत (कबीरपंथी जीवन)', 'सूरदास के पद (गोपियों का विरह एवं वाक्चातुर्य)', 'राम-लक्ष्मण-परशुराम संवाद (व्यंग्य एवं वीर रस)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Kshitij Long Answers',
          },
          {
            id: 'kritika-bhag-2',
            slug: 'kritika-bhag-2',
            title: 'कृतिका भाग-2 (पूरक पाठ्यपुस्तक)',
            unitId: 'literature-hindi-kshitij-kritika',
            unitTitle: 'साहित्य',
            weightageMarks: 8,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['माता का अँचल (वात्सल्य रस एवं ग्रामीण संस्कृति)', 'साना-साना हाथ जोड़ि (सिक्किम सौंदर्य एवं मानवीय संघर्ष)', 'मैं क्यों लिखता हूँ (लेखक की अंतःप्रेरणा)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Kritika Value Points',
          },
        ],
      },
      {
        id: 'creative-writing-hindi',
        title: 'खंड घ: रचनात्मक लेखन',
        officialMarks: 16,
        chapters: [
          {
            id: 'hindi-writing-skills',
            slug: 'hindi-writing-skills',
            title: 'अनुच्छेद लेखन, पत्र, स्ववृत्त/ई-मेल, विज्ञापन/संदेश लेखन',
            unitId: 'creative-writing-hindi',
            unitTitle: 'रचनात्मक लेखन',
            weightageMarks: 16,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['अनुच्छेद लेखन संकेत बिंदु विस्तार (5M)', 'औपचारिक / अनौपचारिक पत्र प्रारूप (5M)', 'आकर्षक विज्ञापन लेखन बॉक्स प्रारूप (3M)', 'संदेश / ई-मेल लेखन (3M)'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Hindi Formats Sheet',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'खंड क: अपठित बोध (गद्यांश + काव्यांश)', description: '14 वस्तुनिष्ठ प्रश्न (14 अंक)', totalMarks: 14, questionCount: 14, marksPerQuestion: 1 },
      { section: 'B', title: 'खंड ख: व्यावहारिक व्याकरण', description: '16 वस्तुनिष्ठ प्रश्न (16 अंक)', totalMarks: 16, questionCount: 16, marksPerQuestion: 1 },
      { section: 'C', title: 'खंड ग: पाठ्यपुस्तक क्षितिज एवं कृतिका', description: 'पद्यांश/गद्यांश एवं वर्णनात्मक प्रश्न (34 अंक)', totalMarks: 34, questionCount: 12, marksPerQuestion: '2 to 4' },
      { section: 'D', title: 'खंड घ: रचनात्मक लेखन', description: 'अनुच्छेद, पत्र, ई-मेल, विज्ञापन लेखन (16 अंक)', totalMarks: 16, questionCount: 4, marksPerQuestion: '3 to 5' },
      { section: 'E', title: 'मूल्यांकन एवं वर्तनी शुद्धता', description: 'अंक विभाजन एवं विषयवस्तु प्रस्तुति', totalMarks: 0, questionCount: 0, marksPerQuestion: 0 },
    ],
  },

  'hindi-b': {
    slug: 'hindi-b',
    code: '085',
    title: 'Hindi Course B',
    shortTitle: 'Hindi B',
    icon: '🇮🇳',
    accentColor: '#7c3aed',
    totalMarks: 80,
    passingMarks: 26,
    targetCentumMarks: 76,
    units: [
      {
        id: 'reading-comprehension-b',
        title: 'खंड क: अपठित बोध',
        officialMarks: 14,
        chapters: [
          {
            id: 'unseen-passage-hindi-b',
            slug: 'unseen-passage-hindi-b',
            title: 'अपठित गद्यांश (दो गद्यांश)',
            unitId: 'reading-comprehension-b',
            unitTitle: 'अपठित बोध',
            weightageMarks: 14,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['गद्यांश पर आधारित बहुविकल्पी एवं लघु उत्तरीय प्रश्न', 'केंद्रीय भाव एवं शब्दावली'],
            recommendedToolPath: '/exam-papers',
            recommendedToolLabel: 'Hindi B Mock Series',
          },
        ],
      },
      {
        id: 'grammar-hindi-b',
        title: 'खंड ख: व्यावहारिक व्याकरण',
        officialMarks: 16,
        chapters: [
          {
            id: 'hindi-b-grammar',
            slug: 'hindi-b-grammar',
            title: 'पदबंध, रचना के आधार पर वाक्य, समास, मुहावरे',
            unitId: 'grammar-hindi-b',
            unitTitle: 'व्याकरण',
            weightageMarks: 16,
            tier: 'high',
            hasFiveMarker: false,
            hasCaseStudy: false,
            keyConcepts: ['संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण पदबंध', 'वाक्य रूपांतरण', 'तत्पुरुष, कर्मधारय, द्विगु, द्वंद्व, बहुव्रीहि, अव्ययीभाव समास', 'पाठ्यपुस्तक आधारित मुहावरे'],
            recommendedToolPath: '/quizzes',
            recommendedToolLabel: 'Hindi B Grammar Quizzes',
          },
        ],
      },
      {
        id: 'literature-sparsh-sanchayan',
        title: 'खंड ग: पाठ्यपुस्तक (स्पर्श एवं संचयन)',
        officialMarks: 34,
        chapters: [
          {
            id: 'sparsh-bhag-2',
            slug: 'sparsh-bhag-2',
            title: 'स्पर्श भाग-2 (गद्य एवं पद्य खंड)',
            unitId: 'literature-sparsh-sanchayan',
            unitTitle: 'साहित्य',
            weightageMarks: 26,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['बड़े भाई साहब (अनुभव बनाम किताबी ज्ञान)', 'डायरी का एक पन्ना (स्वतंत्रता संग्राम)', 'साखी (कबीरदास की गुरु महिमा)', 'मनुष्यता (सच्ची मानवता एवं परोपकार)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Sparsh Long Answers',
          },
          {
            id: 'sanchayan-bhag-2',
            slug: 'sanchayan-bhag-2',
            title: 'संचयन भाग-2 (पूरक पाठ्यपुस्तक)',
            unitId: 'literature-sparsh-sanchayan',
            unitTitle: 'साहित्य',
            weightageMarks: 8,
            tier: 'medium',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['हरिहर काका (पारिवारिक स्वार्थ एवं संपत्ति लालच)', 'सपनों के-से दिन (बाल मनोविज्ञान एवं विद्यालयी यादें)', 'टोपी शुक्ला (धार्मिक सद्भाव एवं आत्मीय रिश्ता)'],
            recommendedToolPath: '/pyq-trends',
            recommendedToolLabel: 'Sanchayan 6M Questions',
          },
        ],
      },
      {
        id: 'creative-writing-hindi-b',
        title: 'खंड घ: रचनात्मक लेखन',
        officialMarks: 16,
        chapters: [
          {
            id: 'hindi-b-writing-skills',
            slug: 'hindi-b-writing-skills',
            title: 'अनुच्छेद लेखन, पत्र, सूचना, विज्ञापन, लघुकथा/ई-मेल',
            unitId: 'creative-writing-hindi-b',
            unitTitle: 'रचनात्मक लेखन',
            weightageMarks: 16,
            tier: 'high',
            hasFiveMarker: true,
            hasCaseStudy: false,
            keyConcepts: ['अनुच्छेद लेखन (5M)', 'औपचारिक पत्र प्रारूप (5M)', 'सूचना लेखन बॉक्स प्रारूप (4M)', 'विज्ञापन लेखन / ई-मेल लेखन (5M)'],
            recommendedToolPath: '/formula-cheatsheets',
            recommendedToolLabel: 'Hindi B Templates',
          },
        ],
      },
    ],
    sectionDefinitions: [
      { section: 'A', title: 'खंड क: अपठित बोध', description: '14 वस्तुनिष्ठ प्रश्न (14 अंक)', totalMarks: 14, questionCount: 14, marksPerQuestion: 1 },
      { section: 'B', title: 'खंड ख: व्यावहारिक व्याकरण', description: '16 वस्तुनिष्ठ प्रश्न (16 अंक)', totalMarks: 16, questionCount: 16, marksPerQuestion: 1 },
      { section: 'C', title: 'खंड ग: पाठ्यपुस्तक स्पर्श एवं संचयन', description: 'पद्यांश/गद्यांश एवं वर्णनात्मक प्रश्न (34 अंक)', totalMarks: 34, questionCount: 12, marksPerQuestion: '2 to 4' },
      { section: 'D', title: 'खंड घ: रचनात्मक लेखन', description: 'अनुच्छेद, पत्र, सूचना, विज्ञापन (16 अंक)', totalMarks: 16, questionCount: 4, marksPerQuestion: '4 to 5' },
      { section: 'E', title: 'मूल्यांकन एवं वर्तनी शुद्धता', description: 'प्रस्तुति एवं भाषा शुद्धता', totalMarks: 0, questionCount: 0, marksPerQuestion: 0 },
    ],
  },
};

// ── CALCULATION HELPERS ──────────────────────────────────────────────────────

export function getSubjectBlueprint(subjectSlug: string = 'science'): SubjectReadinessBlueprint {
  return READINESS_SUBJECTS[subjectSlug] || READINESS_SUBJECTS['science'];
}

export function getAllReadinessSubjects(): { slug: string; title: string; code: string; icon: string; accentColor: string }[] {
  return Object.values(READINESS_SUBJECTS).map((s) => ({
    slug: s.slug,
    title: s.title,
    code: s.code,
    icon: s.icon,
    accentColor: s.accentColor,
  }));
}

export function getPerformanceTier(marks: number, totalMarks: number = 80): PerformanceTier {
  const percentage = (marks / totalMarks) * 100;
  if (percentage >= 95) {
    return {
      tierName: 'Centum Orbit (95%+)',
      badge: '🏆 Centum Track',
      color: '#16a34a',
      description: 'Exceptional mastery across all units. Focus on eliminating rare calculation slips and perfection in Section D & E step presentation.',
      percentileEstimate: 'Top 1-2% of all CBSE candidates',
    };
  }
  if (percentage >= 85) {
    return {
      tierName: 'Distinction Elite (85–94%)',
      badge: '🌟 Distinction',
      color: '#0284c7',
      description: 'Strong conceptual foundation. Polishing 2-3 weak chapters will comfortably propel you past 95% in the final board exam.',
      percentileEstimate: 'Top 5-10% in Board Cohort',
    };
  }
  if (percentage >= 70) {
    return {
      tierName: 'First Class Track (70–84%)',
      badge: '📈 First Class',
      color: '#f59e0b',
      description: 'Solid basic understanding with noticeable gaps in 5-mark long answers or application-based case studies. 14 days of focused drills can add +10-15 marks.',
      percentileEstimate: 'Top 25-30% Candidate Band',
    };
  }
  if (percentage >= 50) {
    return {
      tierName: 'Passing & Foundation Orbit (50–69%)',
      badge: '⚡ Foundation Stage',
      color: '#ea580c',
      description: 'Passing is secured, but marks are leaking heavily in high-yield chapters. Follow the high-yield priority roadmap to quickly jump a whole grade tier.',
      percentileEstimate: 'Average Board Preparation Orbit',
    };
  }
  return {
    tierName: 'High Alert Catch-up (<50%)',
    badge: '🚨 Critical Catch-up',
    color: '#dc2626',
    description: 'Immediate action required on guaranteed questions (Theorems, Diagrams, Salt preps, MCQs). Completing Day 1-5 of the revision plan will lift you into the safe distinction orbit.',
    percentileEstimate: 'Needs Targeted Urgent Revision',
  };
}

/**
 * Calculates complete subject readiness diagnostic from chapter states.
 */
export function calculateSubjectReadiness(
  subjectSlug: string,
  chapterStates: Record<string, ChapterConfidence> = {},
): ReadinessDiagnosticResult {
  const bp = getSubjectBlueprint(subjectSlug);

  let totalWeightedEarned = 0;
  let totalWeightSum = 0;

  const unitBreakdowns: ReadinessDiagnosticResult['unitBreakdowns'] = [];
  const topWeakSpots: ReadinessDiagnosticResult['topWeakSpots'] = [];
  const topStrengths: ReadinessDiagnosticResult['topStrengths'] = [];

  for (const unit of bp.units) {
    let unitEarned = 0;
    let unitWeight = 0;

    for (const chapter of unit.chapters) {
      const confidence = chapterStates[chapter.slug] || 'unstudied';
      const weightInfo = CONFIDENCE_WEIGHTS[confidence];
      const factor = weightInfo.factor;

      const chapterEarned = chapter.weightageMarks * factor;
      unitEarned += chapterEarned;
      unitWeight += chapter.weightageMarks;

      const deficit = chapter.weightageMarks - chapterEarned;

      if (confidence === 'mastered' || confidence === 'comfortable') {
        topStrengths.push({
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          weightageMarks: chapter.weightageMarks,
        });
      } else {
        // Classify as weak spot
        topWeakSpots.push({
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          unitTitle: unit.title,
          weightageMarks: chapter.weightageMarks,
          confidence,
          marksDeficit: Math.round(deficit * 10) / 10,
          priorityReason: chapter.tier === 'high'
            ? `High-Yield Chapter (${chapter.weightageMarks}M) carries guaranteed 5-mark question / Case Study.`
            : `Worth ~${chapter.weightageMarks} marks in Section A/B/C.`,
          quickFixTip: `Revise ${chapter.keyConcepts.slice(0, 2).join(' & ')} to gain +${Math.round(deficit)} marks.`,
          toolHref: chapter.recommendedToolPath,
          toolLabel: chapter.recommendedToolLabel,
        });
      }
    }

    totalWeightedEarned += unitEarned;
    totalWeightSum += unitWeight;

    const unitReadinessPercent = unitWeight > 0 ? Math.round((unitEarned / unitWeight) * 100) : 0;
    let status: 'mastered' | 'good' | 'average' | 'critical' = 'critical';
    if (unitReadinessPercent >= 85) status = 'mastered';
    else if (unitReadinessPercent >= 70) status = 'good';
    else if (unitReadinessPercent >= 50) status = 'average';

    unitBreakdowns.push({
      unitId: unit.id,
      unitTitle: unit.title,
      maxMarks: unit.officialMarks,
      earnedMarks: Math.min(unit.officialMarks, Math.round(unitEarned * 10) / 10),
      readinessPercent: unitReadinessPercent,
      status,
    });
  }

  // Normalize to 80 marks
  const readinessScore = totalWeightSum > 0 ? Math.round((totalWeightedEarned / totalWeightSum) * 100) : 0;
  const rawPredictedMarks = (readinessScore / 100) * bp.totalMarks;
  const predictedMarks = Math.min(80, Math.max(0, Math.round(rawPredictedMarks)));

  // Realistic error band: +/- 3 marks or 4%
  const errorMargin = Math.max(2, Math.round((100 - readinessScore) * 0.05));
  const predictedMarksMin = Math.max(0, predictedMarks - errorMargin);
  const predictedMarksMax = Math.min(80, predictedMarks + errorMargin);
  const predictedPercentage = Math.round((predictedMarks / bp.totalMarks) * 100);

  const performanceTier = getPerformanceTier(predictedMarks, bp.totalMarks);

  // Sort weak spots by highest marks deficit (highest ROI first)
  topWeakSpots.sort((a, b) => b.marksDeficit - a.marksDeficit);

  // Calculate Section Projections (Section A through E)
  const sectionProjections = computeSectionProjections(bp, chapterStates, readinessScore);

  // Generate 14-day prioritized revision roadmap
  const roadmap14Day = generate14DayRoadmap(bp, topWeakSpots, chapterStates);

  return {
    subjectSlug: bp.slug,
    subjectTitle: bp.title,
    subjectCode: bp.code,
    readinessScore,
    predictedMarks,
    predictedMarksMin,
    predictedMarksMax,
    predictedPercentage,
    performanceTier,
    unitBreakdowns,
    sectionProjections,
    topWeakSpots,
    topStrengths,
    roadmap14Day,
  };
}

/**
 * Computes projected marks for Sections A, B, C, D, E
 */
function computeSectionProjections(
  bp: SubjectReadinessBlueprint,
  chapterStates: Record<string, ChapterConfidence>,
  overallReadiness: number,
): SectionProjection[] {
  // Compute specific factors for high-yield anchor chapters (which govern Section D & E)
  let highYieldSum = 0;
  let highYieldEarned = 0;

  for (const unit of bp.units) {
    for (const ch of unit.chapters) {
      if (ch.tier === 'high') {
        const conf = chapterStates[ch.slug] || 'unstudied';
        highYieldSum += ch.weightageMarks;
        highYieldEarned += ch.weightageMarks * CONFIDENCE_WEIGHTS[conf].factor;
      }
    }
  }

  const highYieldRatio = highYieldSum > 0 ? highYieldEarned / highYieldSum : overallReadiness / 100;
  const generalRatio = overallReadiness / 100;

  return bp.sectionDefinitions.map((secDef) => {
    let factor = generalRatio;
    // Section D (5M Long Answers) and Section E (Case Studies) are disproportionately dependent on high-yield mastery
    if (secDef.section === 'D') {
      factor = highYieldRatio * 0.95; // Section D has stricter step-marking penalties
    } else if (secDef.section === 'E') {
      factor = highYieldRatio * 0.98;
    } else if (secDef.section === 'A') {
      factor = Math.min(1.0, generalRatio * 1.02); // MCQs benefit from broad partial recognition
    }

    const predictedMarks = Math.min(secDef.totalMarks, Math.round(secDef.totalMarks * factor * 10) / 10);
    const percentage = secDef.totalMarks > 0 ? Math.round((predictedMarks / secDef.totalMarks) * 100) : 100;

    let status: 'safe' | 'needs_work' | 'vulnerable' = 'vulnerable';
    let riskNote = 'Severe mark risk. Revise core theory and definitions.';
    if (percentage >= 85) {
      status = 'safe';
      riskNote = 'High confidence. Step presentation and formula accuracy is solid.';
    } else if (percentage >= 65) {
      status = 'needs_work';
      riskNote = 'Moderate risk. Minor slip-ups in step-wise half marks or calculations.';
    }

    return {
      section: secDef.section,
      title: secDef.title,
      maxMarks: secDef.totalMarks,
      predictedMarks,
      percentage,
      status,
      riskNote,
    };
  });
}

/**
 * Generates an algorithmic 14-day prioritized revision roadmap targeting highest-ROI gaps.
 */
function generate14DayRoadmap(
  bp: SubjectReadinessBlueprint,
  weakSpots: ReadinessDiagnosticResult['topWeakSpots'],
  chapterStates: Record<string, ChapterConfidence>,
): DailyRoadmapTask[] {
  const allChapters = bp.units.flatMap((u) => u.chapters);
  const roadmap: DailyRoadmapTask[] = [];

  let currentDay = 1;

  // Pick top 4 weakest chapters for Phase 1
  const priorityPhase1 = weakSpots.slice(0, 4);
  for (const ws of priorityPhase1) {
    if (currentDay > 4) break;
    const ch = allChapters.find((c) => c.slug === ws.chapterSlug);
    if (!ch) continue;

    roadmap.push({
      day: currentDay,
      phase: 'High-Yield Anchors',
      chapterSlug: ch.slug,
      chapterTitle: ch.title,
      unitTitle: ch.unitTitle,
      focusTopics: ch.keyConcepts.slice(0, 3),
      estimatedMinutes: 45,
      potentialMarksGain: Math.max(1.5, Math.round(ws.marksDeficit)),
      actionHref: ch.recommendedToolPath,
      actionLabel: ch.recommendedToolLabel,
      actionType: ch.recommendedToolPath.includes('activities') ? 'lab' : ch.recommendedToolPath.includes('formula') ? 'formula' : 'pyq',
    });
    currentDay += 1;
  }

  // Fill remainder of Phase 1 if fewer than 4 weak spots
  while (currentDay <= 4) {
    const ch = allChapters[currentDay - 1] || allChapters[0];
    roadmap.push({
      day: currentDay,
      phase: 'High-Yield Anchors',
      chapterSlug: ch.slug,
      chapterTitle: ch.title,
      unitTitle: ch.unitTitle,
      focusTopics: ch.keyConcepts.slice(0, 3),
      estimatedMinutes: 30,
      potentialMarksGain: 2.0,
      actionHref: ch.recommendedToolPath,
      actionLabel: ch.recommendedToolLabel,
      actionType: 'pyq',
    });
    currentDay += 1;
  }

  // Phase 2: Days 5-8 (Section D 5-Markers & Case Studies)
  const fiveMarkerChapters = allChapters.filter((c) => c.hasFiveMarker || c.hasCaseStudy);
  for (let i = 0; i < 4; i++) {
    const ch = fiveMarkerChapters[i % fiveMarkerChapters.length] || allChapters[0];
    roadmap.push({
      day: currentDay,
      phase: 'Section D & Case Studies',
      chapterSlug: ch.slug,
      chapterTitle: ch.title,
      unitTitle: ch.unitTitle,
      focusTopics: ch.keyConcepts,
      estimatedMinutes: 50,
      potentialMarksGain: 3.5,
      actionHref: '/pyq-trends',
      actionLabel: 'Solve 5-Year PYQs & Case Studies',
      actionType: 'pyq',
    });
    currentDay += 1;
  }

  // Phase 3: Days 9-11 (Formula & Weak Spot Polish)
  for (let i = 0; i < 3; i++) {
    const ch = allChapters[(i + 4) % allChapters.length] || allChapters[0];
    roadmap.push({
      day: currentDay,
      phase: 'Formula & Weak Spot Polish',
      chapterSlug: ch.slug,
      chapterTitle: ch.title,
      unitTitle: ch.unitTitle,
      focusTopics: ['Active recall speed drills', 'Negative marking traps & common board slips', 'NCERT textbook end exercises'],
      estimatedMinutes: 40,
      potentialMarksGain: 2.5,
      actionHref: '/formula-cheatsheets',
      actionLabel: 'Master Formula Cheatsheet & Traps',
      actionType: 'formula',
    });
    currentDay += 1;
  }

  // Phase 4: Days 12-14 (Full Board Mock Simulation)
  roadmap.push({
    day: 12,
    phase: 'Final Mock & Simulation',
    chapterSlug: bp.units[0]?.chapters[0]?.slug || 'mock-paper-1',
    chapterTitle: '80-Mark Full Board Mock Paper #1',
    unitTitle: 'Complete Syllabus',
    focusTopics: ['Strict 3-hour timer practice', 'CBSE Step-wise half-mark rubrics', 'Reading time 15-minute question selection strategy'],
    estimatedMinutes: 180,
    potentialMarksGain: 4.0,
    actionHref: '/exam-papers',
    actionLabel: 'Attempt 80-Mark CBT Mock Paper 1 (Free)',
    actionType: 'mock',
  });

  roadmap.push({
    day: 13,
    phase: 'Final Mock & Simulation',
    chapterSlug: 'my-mistakes-vault',
    chapterTitle: 'My Mistakes Vault & Rapid Diagnostic Quizzes',
    unitTitle: 'Error Elimination',
    focusTopics: ['Review all flagged mistakes from mock papers', 'Retry missed questions without hints', 'Step-marking presentation check'],
    estimatedMinutes: 60,
    potentialMarksGain: 3.0,
    actionHref: '/quizzes',
    actionLabel: 'Take Topic Recovery Quizzes',
    actionType: 'quiz',
  });

  roadmap.push({
    day: 14,
    phase: 'Final Mock & Simulation',
    chapterSlug: 'final-board-ready',
    chapterTitle: 'Board Ready Exam Eve Checklist',
    unitTitle: 'Exam Day Readiness',
    focusTopics: ['1-Page Formula Summary review', 'Key diagram labels mental walkthrough', 'Stationery & Admit card preparation'],
    estimatedMinutes: 30,
    potentialMarksGain: 2.0,
    actionHref: '/formula-cheatsheets',
    actionLabel: 'Quick Formula Scan Before Sleep',
    actionType: 'formula',
  });

  return roadmap;
}

/**
 * Simulates the gap to a target score and produces specific recommendations.
 */
export function simulateTargetGap(
  subjectSlug: string,
  chapterStates: Record<string, ChapterConfidence>,
  targetMarks: number,
): TargetScoreSimulation {
  const currentResult = calculateSubjectReadiness(subjectSlug, chapterStates);
  const currentMarks = currentResult.predictedMarks;
  const marksGap = Math.max(0, targetMarks - currentMarks);

  const bp = getSubjectBlueprint(subjectSlug);
  const allChapters = bp.units.flatMap((u) => u.chapters);

  const upgradesNeeded: TargetScoreSimulation['upgradesNeeded'] = [];

  let accumulatedGain = 0;

  // Sort chapters by greatest potential gain (unstudied/struggling high-yield chapters first)
  const candidateUpgrades = allChapters.map((ch) => {
    const currentConf = chapterStates[ch.slug] || 'unstudied';
    const currentFactor = CONFIDENCE_WEIGHTS[currentConf].factor;
    const targetConf: ChapterConfidence = 'mastered';
    const targetFactor = CONFIDENCE_WEIGHTS[targetConf].factor;
    const potentialGain = ch.weightageMarks * (targetFactor - currentFactor);

    return {
      chapter: ch,
      fromConfidence: currentConf,
      toConfidence: targetConf,
      potentialGain: Math.round(potentialGain * 10) / 10,
    };
  }).filter((c) => c.potentialGain > 0.4);

  candidateUpgrades.sort((a, b) => b.potentialGain - a.potentialGain);

  for (const cand of candidateUpgrades) {
    if (accumulatedGain >= marksGap) break;
    upgradesNeeded.push({
      chapterSlug: cand.chapter.slug,
      chapterTitle: cand.chapter.title,
      fromConfidence: cand.fromConfidence,
      toConfidence: cand.toConfidence,
      marksGain: cand.potentialGain,
      effortLevel: cand.chapter.tier === 'high' ? 'High' : cand.potentialGain > 2 ? 'Medium' : 'Low',
      actionTip: `Revise ${cand.chapter.keyConcepts.slice(0, 2).join(' & ')} to gain +${cand.potentialGain} marks.`,
    });
    accumulatedGain += cand.potentialGain;
  }

  const isAchievable14Days = marksGap <= 25;
  const requiredDailyStudyHours = marksGap <= 5 ? 1.0 : marksGap <= 12 ? 1.5 : marksGap <= 20 ? 2.5 : 3.5;

  return {
    targetMarks,
    currentPredictedMarks: currentMarks,
    marksGap: Math.round(marksGap * 10) / 10,
    isAchievable14Days,
    requiredDailyStudyHours,
    upgradesNeeded,
  };
}

/**
 * Formats a clean, text-based diagnostic summary for WhatsApp or SMS sharing with parents/tutors.
 */
export function formatWhatsAppReport(result: ReadinessDiagnosticResult): string {
  const topWeakString = result.topWeakSpots.slice(0, 3).map((w, idx) => `  ${idx + 1}. ${w.chapterTitle} (-${w.marksDeficit}M gap)`).join('\n');
  const topStrongString = result.topStrengths.slice(0, 3).map((s, idx) => `  ${idx + 1}. ${s.chapterTitle} (${s.weightageMarks}M)`).join('\n');

  return `📊 *CBSE Class 10 Board Exam Readiness Report*
🎯 *Subject*: ${result.subjectTitle} (${result.subjectCode})
📈 *Readiness Score*: ${result.readinessScore}%
🎯 *Predicted Marks*: ${result.predictedMarks} / 80 (Band: ${result.predictedMarksMin}-${result.predictedMarksMax} Marks)
🏆 *Performance Track*: ${result.performanceTier.badge} (${result.performanceTier.tierName})

⚡ *Top High-ROI Improvement Areas*:
${topWeakString || '  None! All chapters comfortable.'}

🌟 *Strongest Anchors*:
${topStrongString || '  In progress'}

📅 *Personalized 14-Day Action Blueprint*:
View full day-by-day revision plan & take full CBSE mock papers at:
https://www.chapterready.in/tools/readiness-predictor?subject=${result.subjectSlug}

— Generated with ChapterReady AI Diagnostic Engine`;
}
