export type QuestionTypeCategory = 'mcq' | 'vsa_2m' | 'sa_3m' | 'la_5m' | 'case_study_4m' | 'map_skill_5m';

export type ChapterTrendData = {
  id: string;
  slug: string;
  title: string;
  unitTitle: string;
  officialMarksMin: number;
  officialMarksMax: number;
  historicalAvgMarks: number;
  yieldTier: 'high' | 'medium' | 'foundational';
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  distribution: {
    mcq: number;         // count or typical marks
    vsa_2m: number;
    sa_3m: number;
    la_5m: number;
    case_study_4m: number;
    map_skill_5m?: number;
  };
  mostRepeatedTopics: string[];
  boardExamFocusTip: string;
  frequentYears: number[];
  pyqCountAvailable: number;
};

export type RepeatedConcept = {
  id: string;
  subjectSlug: string;
  chapterSlug: string;
  chapterTitle: string;
  conceptTitle: string;
  questionType: '5-Mark Long Answer' | '4-Mark Case Study' | '3-Mark Short Answer' | '2-Mark Short Answer' | '1-Mark MCQ' | '5-Mark Map Skill';
  frequencyBadge: string; // e.g. "Appeared 5/5 Years (2022-2026)"
  typicalMarks: number;
  questionPromptSample: string;
  examinerExpectation: string;
  frequentYears: number[];
  boardSets: string[];
};

export type SubjectPyqTrend = {
  slug: string;
  code: string;
  title: string;
  totalMarks: number;
  totalChapters: number;
  highYieldThreshold: string;
  summaryQuote: string;
  trendInsights: {
    title: string;
    description: string;
    tag: string;
  }[];
  chapters: ChapterTrendData[];
  repeatedConcepts: RepeatedConcept[];
};

export const PYQ_TRENDS_DATA: Record<string, SubjectPyqTrend> = {
  'science': {
    slug: 'science',
    code: '086',
    title: 'Science',
    totalMarks: 80,
    totalChapters: 13,
    highYieldThreshold: '8+ Marks',
    summaryQuote: 'Biology (30m) & Physics (25m) carry 68% of the paper. Section D (5-mark questions) is dominated by Light, Electricity, Life Processes, and Carbon Compounds.',
    trendInsights: [
      {
        title: 'Section D (5-Markers) Fixed Pattern',
        description: 'Light, Electricity, Life Processes, and Carbon & Its Compounds consistently account for 3 out of 3 long-answer questions (15 marks total).',
        tag: 'High Yield Pattern'
      },
      {
        title: 'Section E Case Studies (12 Marks)',
        description: 'Case study questions almost always test Heredity (Mendel Crosses), Magnetic Effects (Solenoid/Right-Hand Rule), or Chemical Reactions (Redox/Corrosion).',
        tag: 'Case Study Focus'
      },
      {
        title: 'NCERT Activity Questions (18+ Marks)',
        description: 'Over 22% of total marks test observations and chemical equations from specific NCERT activities (e.g. Activity 1.1 Mg Ribbon, Activity 2.1 Acid + Metal, Activity 6.2 Starch test).',
        tag: 'Activity Warning'
      }
    ],
    chapters: [
      {
        id: 'life-processes',
        slug: 'life-processes',
        title: 'Life Processes',
        unitTitle: 'World of Living',
        officialMarksMin: 8,
        officialMarksMax: 10,
        historicalAvgMarks: 9.5,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Nephron structure and urine formation steps',
          'Human alimentary canal & enzyme actions (pepsin, trypsin, lipase)',
          'Double circulation of blood & heart chamber functions',
          'Anaerobic vs Aerobic respiration pathways (Pyruvate breakdown chart)'
        ],
        boardExamFocusTip: 'Always practice drawing the human alimentary canal, human heart schematic, and nephron with all labels.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 24
      },
      {
        id: 'light-reflection-and-refraction',
        slug: 'light-reflection-and-refraction',
        title: 'Light – Reflection and Refraction',
        unitTitle: 'Natural Phenomena',
        officialMarksMin: 8,
        officialMarksMax: 10,
        historicalAvgMarks: 9.0,
        yieldTier: 'high',
        difficulty: 'Challenging',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Concave mirror & Convex lens ray diagrams (object between F and 2F / between F and P)',
          'Lens & Mirror Formula numericals with Cartesian sign convention',
          'Refractive index numericals and Snell\'s law applications',
          'Power of combination of lenses'
        ],
        boardExamFocusTip: 'A 5-mark question combining a ray diagram with a numerical calculation appears in nearly every set.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 22
      },
      {
        id: 'electricity',
        slug: 'electricity',
        title: 'Electricity',
        unitTitle: 'Effects of Current',
        officialMarksMin: 7,
        officialMarksMax: 9,
        historicalAvgMarks: 8.0,
        yieldTier: 'high',
        difficulty: 'Challenging',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Equivalent resistance of combination circuits (Series + Parallel)',
          'Joule\'s law of heating & electric power / commercial electrical energy bills',
          'Factors affecting resistance ($R = \\rho L/A$) and resistivity comparison',
          'Ohm\'s law V-I graph analysis'
        ],
        boardExamFocusTip: 'Master multi-resistor network simplifications and the unit conversion of kilowatt-hours to Joules ($1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}$).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 19
      },
      {
        id: 'carbon-and-its-compounds',
        slug: 'carbon-and-its-compounds',
        title: 'Carbon and its Compounds',
        unitTitle: 'Chemical Substances',
        officialMarksMin: 6,
        officialMarksMax: 8,
        historicalAvgMarks: 7.0,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 2, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Esterification and saponification balanced chemical equations',
          'Cleansing action of soaps and micelle formation diagram',
          'Covalent bonding in $CH_4, CO_2, N_2, H_2O$ and why carbon forms covalent bonds',
          'Homologous series and functional group nomenclature'
        ],
        boardExamFocusTip: 'Examiners expect complete structural formulas and balanced equations with catalysts (conc. $H_2SO_4$, alkaline $KMnO_4$).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 18
      },
      {
        id: 'magnetic-effects-of-electric-current',
        slug: 'magnetic-effects-of-electric-current',
        title: 'Magnetic Effects of Electric Current',
        unitTitle: 'Effects of Current',
        officialMarksMin: 5,
        officialMarksMax: 7,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Magnetic field lines around straight conductor, circular loop, and solenoid',
          'Fleming\'s Left-Hand Rule and force on current-carrying conductor',
          'Domestic electric circuit (earth wire function, fuse, short circuit, overloading)',
          'Properties of magnetic field lines (never intersect)'
        ],
        boardExamFocusTip: 'Be ready for a 4-mark case study based on solenoid field patterns or domestic safety circuits.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'chemical-reactions-and-equations',
        slug: 'chemical-reactions-and-equations',
        title: 'Chemical Reactions and Equations',
        unitTitle: 'Chemical Substances',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'medium',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Redox reactions: identifying oxidised, reduced, oxidising agent, reducing agent',
          'Decomposition reactions (Thermal decomposition of $FeSO_4, Pb(NO_3)_2, CaCO_3$)',
          'Balancing chemical equations with state symbols ($s, l, g, aq$)',
          'Corrosion and rancidity prevention methods'
        ],
        boardExamFocusTip: 'Colour change questions (e.g. green ferrous sulphate turning reddish brown, white lead nitrate giving brown $NO_2$ fumes) are guaranteed.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 17
      },
      {
        id: 'metals-and-non-metals',
        slug: 'metals-and-non-metals',
        title: 'Metals and Non-metals',
        unitTitle: 'Chemical Substances',
        officialMarksMin: 5,
        officialMarksMax: 7,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Reactivity series & displacement reactions',
          'Ionic compound properties (high melting point, electrical conductivity in molten/solution)',
          'Electron dot structure of $NaCl, MgCl_2, CaO$',
          'Amphoteric oxides definition with $Al_2O_3, ZnO$ reactions'
        ],
        boardExamFocusTip: 'Memorize electron transfer diagrams for ionic bonds; they appear regularly in 2-mark and 3-mark sections.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'acids-bases-and-salts',
        slug: 'acids-bases-and-salts',
        title: 'Acids, Bases and Salts',
        unitTitle: 'Chemical Substances',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'medium',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Important salts preparation & uses: Bleaching powder, Baking soda, Washing soda, POP',
          'pH scale & daily life importance (digestive system, tooth decay, soil)',
          'Reaction of acids with metal carbonates/hydrogen carbonates ($CO_2$ test with lime water)',
          'Chlor-alkali process products ($NaOH, Cl_2, H_2$)'
        ],
        boardExamFocusTip: 'Chemical names, formulas, and 2 uses of each commercial salt must be memorized thoroughly.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'control-and-coordination',
        slug: 'control-and-coordination',
        title: 'Control and Coordination',
        unitTitle: 'World of Living',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Reflex arc pathway and synapse transmission',
          'Human brain parts & functions (cerebrum, cerebellum, medulla)',
          'Plant hormones (Auxin, Gibberellin, Cytokinin, Abscisic acid) & phototropism mechanism',
          'Animal endocrine hormones (Insulin, Thyroxine, Adrenaline, Growth hormone)'
        ],
        boardExamFocusTip: 'Phototropism bending mechanism due to auxin diffusion to shady side is tested repeatedly in 3-mark questions.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 14
      },
      {
        id: 'how-do-organisms-reproduce',
        slug: 'how-do-organisms-reproduce',
        title: 'How do Organisms Reproduce?',
        unitTitle: 'World of Living',
        officialMarksMin: 5,
        officialMarksMax: 7,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Flower longitudinal section & double fertilization process in angiosperms',
          'Female reproductive system & role of placenta during pregnancy',
          'Contraceptive methods (mechanical barrier, chemical, surgical) & advantages',
          'Asexual reproduction types (binary fission in Amoeba/Leishmania, budding in Yeast/Hydra)'
        ],
        boardExamFocusTip: 'Flower reproductive anatomy and the function of placenta are high-frequency 3-mark questions.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'heredity',
        slug: 'heredity',
        title: 'Heredity',
        unitTitle: 'World of Living',
        officialMarksMin: 4,
        officialMarksMax: 5,
        historicalAvgMarks: 4.5,
        yieldTier: 'foundational',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Mendel\'s Monohybrid cross with Punnett square ($3:1$ phenotypic, $1:2:1$ genotypic ratio)',
          'Dihybrid cross phenotypic ratio ($9:3:3:1$)',
          'Sex determination mechanism in human beings (XX vs XY chromosomes)'
        ],
        boardExamFocusTip: 'Frequently selected for Section E Case Studies (4 marks) involving Punnett square derivations.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 12
      },
      {
        id: 'human-eye-and-colourful-world',
        slug: 'human-eye-and-colourful-world',
        title: 'Human Eye and the Colourful World',
        unitTitle: 'Natural Phenomena',
        officialMarksMin: 4,
        officialMarksMax: 5,
        historicalAvgMarks: 4.5,
        yieldTier: 'foundational',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Refraction through glass prism & dispersion of white light',
          'Atmospheric refraction phenomena (Twinkling of stars, advance sunrise & delayed sunset)',
          'Tyndall effect & Scattering of light (Blue sky color, Red sunset)'
        ],
        boardExamFocusTip: 'Ray diagram of dispersion through prism and atmospheric refraction diagrams yield full marks easily.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 11
      },
      {
        id: 'our-environment',
        slug: 'our-environment',
        title: 'Our Environment',
        unitTitle: 'Natural Resources',
        officialMarksMin: 5,
        officialMarksMax: 5,
        historicalAvgMarks: 5.0,
        yieldTier: 'foundational',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          '10% Law of energy transfer in food chains with numerical calculations',
          'Biological magnification concept and top consumer impact',
          'Ozone layer depletion mechanism ($CFCs$) and formation reaction',
          'Biodegradable vs Non-biodegradable waste management'
        ],
        boardExamFocusTip: 'Calculate energy at each trophic level given producer energy ($10\\% \\times 10\\% \\dots$). Guaranteed 2 or 3 marks.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 10
      }
    ],
    repeatedConcepts: [
      {
        id: 'sci-rc-1',
        subjectSlug: 'science',
        chapterSlug: 'light-reflection-and-refraction',
        chapterTitle: 'Light',
        conceptTitle: 'Convex Lens / Concave Mirror Ray Diagram + Numerical',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years (2022-2026)',
        typicalMarks: 5,
        questionPromptSample: 'An object 4 cm in size is placed at 25 cm in front of a concave mirror of focal length 15 cm. Find position, nature and size of the image with a ray diagram.',
        examinerExpectation: '1m for correct formula ($1/f = 1/v + 1/u$), 1m for sign convention substitution, 1m for correct calculation with unit, 2m for clean ray diagram with directional arrows.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 31/1/1', 'Set 31/2/1', 'Set 31/3/2', 'Set 31/5/1']
      },
      {
        id: 'sci-rc-2',
        subjectSlug: 'science',
        chapterSlug: 'life-processes',
        chapterTitle: 'Life Processes',
        conceptTitle: 'Human Excretory System & Nephron Functioning',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'Describe the structure and functioning of nephrons in human kidneys. Mention the three major steps involved in urine formation.',
        examinerExpectation: '2m for labeled diagram of nephron (Glomerulus, Bowman capsule, tubule, collecting duct), 3m for 3 distinct steps: Ultrafiltration, Selective reabsorption, Tubular secretion.',
        frequentYears: [2023, 2024, 2025, 2026],
        boardSets: ['Set 31/1/2', 'Set 31/4/1', 'Set 31/5/3']
      },
      {
        id: 'sci-rc-3',
        subjectSlug: 'science',
        chapterSlug: 'electricity',
        chapterTitle: 'Electricity',
        conceptTitle: 'Combined Resistor Circuit & Power/Energy Consumption',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'Calculate total equivalent resistance, total current flowing in the circuit, and monthly electricity cost for given appliances.',
        examinerExpectation: '1.5m for parallel resistance simplification ($1/R_p = 1/R_1 + 1/R_2$), 1m for series addition, 1m for Ohm\'s law ($I = V/R$), 1.5m for energy calculation ($E = P \\times t$) and tariff billing.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 31/1/3', 'Set 31/2/2', 'Set 31/3/1']
      },
      {
        id: 'sci-rc-4',
        subjectSlug: 'science',
        chapterSlug: 'carbon-and-its-compounds',
        chapterTitle: 'Carbon and its Compounds',
        conceptTitle: 'Esterification vs Saponification & Micelle Cleansing',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'What is esterification? Write a balanced chemical equation with catalyst. How is soap prepared from esters? Explain the cleansing action of soap with a diagram of micelle.',
        examinerExpectation: '1m for ester definition, 1m for equation ($CH_3COOH + C_2H_5OH \\xrightarrow{H^+} CH_3COOC_2H_5 + H_2O$), 1m for saponification reaction, 2m for micelle diagram showing hydrophobic hydrocarbon tail and hydrophilic ionic head.',
        frequentYears: [2022, 2024, 2025, 2026],
        boardSets: ['Set 31/1/1', 'Set 31/3/3', 'Set 31/4/2']
      },
      {
        id: 'sci-rc-5',
        subjectSlug: 'science',
        chapterSlug: 'heredity',
        chapterTitle: 'Heredity',
        conceptTitle: 'Mendel Monohybrid & Dihybrid Cross Case Study',
        questionType: '4-Mark Case Study',
        frequencyBadge: 'Appeared in 5/5 Years',
        typicalMarks: 4,
        questionPromptSample: 'A pea plant with pure tall traits (TT) is crossed with a dwarf plant (tt)... (i) What is the F1 phenotype? (ii) Draw Punnett square for F2 generation. (iii) State law of segregation.',
        examinerExpectation: '1m for F1 all tall, 2m for correct 4-box Punnett square showing TT, Tt, Tt, tt with 3:1 phenotypic ratio, 1m for law of segregation explanation.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 31/2/1', 'Set 31/5/2']
      }
    ]
  },

  'mathematics-standard': {
    slug: 'mathematics-standard',
    code: '041',
    title: 'Mathematics Standard',
    totalMarks: 80,
    totalChapters: 14,
    highYieldThreshold: '7+ Marks',
    summaryQuote: 'Algebra (20m) & Geometry/Trigonometry (27m) form 58% of the paper. Section D (5m) always tests BPT Theorem, Surface Areas, Quadratic Equations/AP, and Trigonometric Identities.',
    trendInsights: [
      {
        title: 'Guaranteed 5-Mark Theorems',
        description: 'Basic Proportionality Theorem (Thales Theorem) from Triangles or Tangent Theorem from Circles appears in Section D of every set.',
        tag: 'Guaranteed 5M'
      },
      {
        title: 'Section E Case Studies (12 Marks)',
        description: 'Case studies are locked into: Arithmetic Progressions (real-life seating/production), Coordinate Geometry (sports day/graph positions), and Some Applications of Trigonometry (building/tower heights).',
        tag: 'Case Study Blueprint'
      },
      {
        title: 'High-Scoring Foundation (14 Marks)',
        description: 'Real Numbers (6m), Statistics (7m), and Probability (3m) offer the highest mark-to-effort ratio with direct step-by-step algorithms.',
        tag: 'Easy Score Hub'
      }
    ],
    chapters: [
      {
        id: 'triangles',
        slug: 'triangles',
        title: 'Triangles',
        unitTitle: 'Geometry',
        officialMarksMin: 8,
        officialMarksMax: 10,
        historicalAvgMarks: 9.0,
        yieldTier: 'high',
        difficulty: 'Challenging',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 0, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Basic Proportionality Theorem (BPT) proof & converse applications',
          'Criteria for similarity of triangles (AAA, SAS, SSS)',
          'Ratio of perimeters and altitudes of similar triangles'
        ],
        boardExamFocusTip: 'Theorem 6.1 (BPT) proof must be practiced at least 5 times with clean labeled figures.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 20
      },
      {
        id: 'introduction-to-trigonometry',
        slug: 'introduction-to-trigonometry',
        title: 'Introduction to Trigonometry',
        unitTitle: 'Trigonometry',
        officialMarksMin: 6,
        officialMarksMax: 8,
        historicalAvgMarks: 7.0,
        yieldTier: 'high',
        difficulty: 'Challenging',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Proving trigonometric identities involving $\\sin^2\\theta + \\cos^2\\theta = 1, 1+\\tan^2\\theta = \\sec^2\\theta$',
          'Trigonometric ratios of specific angles ($30^\\circ, 45^\\circ, 60^\\circ$)',
          'Simplifying complex fractional identity proofs'
        ],
        boardExamFocusTip: 'Convert everything to $\\sin\\theta$ and $\\cos\\theta$ when stuck on 3-mark or 5-mark identity proofs.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 18
      },
      {
        id: 'surface-areas-and-volumes',
        slug: 'surface-areas-and-volumes',
        title: 'Surface Areas and Volumes',
        unitTitle: 'Mensuration',
        officialMarksMin: 6,
        officialMarksMax: 8,
        historicalAvgMarks: 6.5,
        yieldTier: 'high',
        difficulty: 'Challenging',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 0, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Surface area of combination of solids (Cylinder surmounted by Cone, Hemisphere on Cube)',
          'Volume of combined solid containers & displaced water calculations',
          'Internal hollow cavities calculations'
        ],
        boardExamFocusTip: 'Be careful: when two solids are joined, their common circular base is NOT part of the total surface area ($TSA = CSA_1 + CSA_2$).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'statistics',
        slug: 'statistics',
        title: 'Statistics',
        unitTitle: 'Statistics and Probability',
        officialMarksMin: 7,
        officialMarksMax: 8,
        historicalAvgMarks: 7.5,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Finding missing frequencies ($f_1, f_2$ or $x, y$) given Median or Mean',
          'Step-deviation and Assumed Mean calculation methods',
          'Mode formula calculation $l + \\frac{f_1-f_0}{2f_1-f_0-f_2}h$',
          'Empirical relationship: $\\text{Mode} = 3\\text{Median} - 2\\text{Mean}$'
        ],
        boardExamFocusTip: 'The 5-mark question finding missing frequencies from Median is a classic CBSE favorite.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 17
      },
      {
        id: 'arithmetic-progressions',
        slug: 'arithmetic-progressions',
        title: 'Arithmetic Progressions',
        unitTitle: 'Algebra',
        officialMarksMin: 5,
        officialMarksMax: 7,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 0, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Real-life word problems / Case study on $S_n$ and $a_n$',
          'Finding $n$ when sum $S_n$ or last term $l$ is given',
          'Symmetric term assumptions: $a-d, a, a+d$ for 3 terms'
        ],
        boardExamFocusTip: 'Consistently selected for Section E 4-mark case study passages.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'some-applications-of-trigonometry',
        slug: 'some-applications-of-trigonometry',
        title: 'Some Applications of Trigonometry',
        unitTitle: 'Trigonometry',
        officialMarksMin: 4,
        officialMarksMax: 6,
        historicalAvgMarks: 5.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 0, vsa_2m: 0, sa_3m: 0, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Heights and distances with 2 angles of elevation/depression ($30^\\circ-60^\\circ$ or $30^\\circ-45^\\circ$)',
          'Two observations from opposite sides of a tower or moving boat towards lighthouse'
        ],
        boardExamFocusTip: 'Draw the diagram first and write clear trigonometric statements for each right-angled triangle.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 14
      },
      {
        id: 'real-numbers',
        slug: 'real-numbers',
        title: 'Real Numbers',
        unitTitle: 'Number Systems',
        officialMarksMin: 6,
        officialMarksMax: 6,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Proof of irrationality of $\\sqrt{2}, \\sqrt{3}, \\sqrt{5}, 3+2\\sqrt{5}$ by contradiction',
          'Fundamental Theorem of Arithmetic (HCF $\\times$ LCM = $a \\times b$)',
          'Prime factorization of large numbers'
        ],
        boardExamFocusTip: 'Irrationality proof is a fixed 3-mark question. Memorize the exact statement wording.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'circles',
        slug: 'circles',
        title: 'Circles',
        unitTitle: 'Geometry',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Tangents from an external point to a circle are equal (Theorem 10.2 proof)',
          'Circumscribed quadrilateral theorem ($AB + CD = AD + BC$)',
          'Angles subtended by tangent and radius at point of contact ($90^\\circ$)'
        ],
        boardExamFocusTip: 'Theorem 10.2 proof appears in almost every alternate year.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'quadratic-equations',
        slug: 'quadratic-equations',
        title: 'Quadratic Equations',
        unitTitle: 'Algebra',
        officialMarksMin: 4,
        officialMarksMax: 6,
        historicalAvgMarks: 5.0,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Discriminant $D = b^2 - 4ac$ and nature of equal roots ($D = 0$)',
          'Solving quadratic equations by quadratic formula and factoring',
          'Speed-distance-time and tap filling word problems'
        ],
        boardExamFocusTip: 'Conditions for equal roots ($D = 0$) finding unknown constant $k$ is extremely common in MCQs & 2-markers.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 14
      },
      {
        id: 'coordinate-geometry',
        slug: 'coordinate-geometry',
        title: 'Coordinate Geometry',
        unitTitle: 'Coordinate Geometry',
        officialMarksMin: 6,
        officialMarksMax: 6,
        historicalAvgMarks: 6.0,
        yieldTier: 'medium',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 0, sa_3m: 0, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Section formula for internal division $m_1:m_2$',
          'Ratio in which x-axis or y-axis divides a line segment',
          'Distance formula & proving collinearity or types of quadrilaterals'
        ],
        boardExamFocusTip: 'Frequently tested in Section E Case Studies with coordinate grid graphs.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'polynomials',
        slug: 'polynomials',
        title: 'Polynomials',
        unitTitle: 'Algebra',
        officialMarksMin: 4,
        officialMarksMax: 5,
        historicalAvgMarks: 4.0,
        yieldTier: 'foundational',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 0, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Relationship between zeroes and coefficients ($\\alpha + \\beta = -b/a, \\alpha\\beta = c/a$)',
          'Forming a quadratic polynomial $k[x^2 - Sx + P]$ given zeroes or sum and product',
          'Evaluating symmetric expressions like $\\alpha^2 + \\beta^2, 1/\\alpha + 1/\\beta$'
        ],
        boardExamFocusTip: 'Use identity $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$ directly.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 12
      },
      {
        id: 'pair-of-linear-equations-in-two-variables',
        slug: 'pair-of-linear-equations-in-two-variables',
        title: 'Pair of Linear Equations in Two Variables',
        unitTitle: 'Algebra',
        officialMarksMin: 4,
        officialMarksMax: 5,
        historicalAvgMarks: 4.5,
        yieldTier: 'foundational',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Consistency conditions: $a_1/a_2 \\neq b_1/b_2$ (unique), $a_1/a_2 = b_1/b_2 = c_1/c_2$ (infinite), $a_1/a_2 = b_1/b_2 \\neq c_1/c_2$ (parallel)',
          'Solving by elimination and substitution methods',
          'Upstream/downstream speed word problems'
        ],
        boardExamFocusTip: 'Ratios condition for parallel/inconsistent lines finding unknown $k$ is standard.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 12
      },
      {
        id: 'areas-related-to-circles',
        slug: 'areas-related-to-circles',
        title: 'Areas Related to Circles',
        unitTitle: 'Mensuration',
        officialMarksMin: 4,
        officialMarksMax: 5,
        historicalAvgMarks: 4.0,
        yieldTier: 'foundational',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Area of minor and major sector $(\\theta/360^\\circ \\times \\pi r^2)$',
          'Area of minor segment = Area of sector - Area of corresponding triangle',
          'Clock hand sweep area and wiper rotation problems'
        ],
        boardExamFocusTip: 'Remember for $60^\\circ$ segment: Area of equilateral triangle $= (\\sqrt{3}/4)r^2$.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 11
      },
      {
        id: 'probability',
        slug: 'probability',
        title: 'Probability',
        unitTitle: 'Statistics and Probability',
        officialMarksMin: 3,
        officialMarksMax: 4,
        historicalAvgMarks: 3.5,
        yieldTier: 'foundational',
        difficulty: 'Easy',
        distribution: { mcq: 2, vsa_2m: 1, sa_3m: 0, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          '52-Playing card deck probabilities (face cards, red queens, black kings)',
          '2-Dice 36-outcome matrix (sum = 7, doublet, at least one 5)',
          'Defective bulb & coin tossing probabilities'
        ],
        boardExamFocusTip: '52 cards breakdown (12 face cards: 4 Jacks, 4 Queens, 4 Kings) must be clear.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 10
      }
    ],
    repeatedConcepts: [
      {
        id: 'math-rc-1',
        subjectSlug: 'mathematics-standard',
        chapterSlug: 'triangles',
        chapterTitle: 'Triangles',
        conceptTitle: 'Basic Proportionality Theorem (BPT) Full Proof',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years (2022-2026)',
        typicalMarks: 5,
        questionPromptSample: 'State and prove Basic Proportionality Theorem (Thales Theorem). Using it, prove that a line drawn through the midpoint of one side of a triangle parallel to another side bisects the third side.',
        examinerExpectation: '1m for correct statement & Given/To Prove, 1m for construction, 2m for proof comparing triangle areas, 1m for rider/application problem.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 30/1/1', 'Set 30/2/1', 'Set 30/4/2', 'Set 30/5/1']
      },
      {
        id: 'math-rc-2',
        subjectSlug: 'mathematics-standard',
        chapterSlug: 'statistics',
        chapterTitle: 'Statistics',
        conceptTitle: 'Missing Frequencies ($x, y$) Calculation from Median',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'If the median of the distribution given below is 28.5, find the values of x and y when total frequency is 60.',
        examinerExpectation: '1m for correct cumulative frequency (cf) column, 1m for identifying median class, 1m for applying median formula, 2m for solving linear system $x+y=15$ and finding $x=8, y=7$.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 30/1/2', 'Set 30/2/3', 'Set 30/3/1']
      },
      {
        id: 'math-rc-3',
        subjectSlug: 'mathematics-standard',
        chapterSlug: 'introduction-to-trigonometry',
        chapterTitle: 'Trigonometry',
        conceptTitle: 'Trigonometric Identity Proof with Fraction & Square Roots',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'Prove that: $\\frac{\\sin\\theta - \\cos\\theta + 1}{\\sin\\theta + \\cos\\theta - 1} = \\frac{1}{\\sec\\theta - \\tan\\theta}$ using the identity $\\sec^2\\theta = 1 + \\tan^2\\theta$.',
        examinerExpectation: '1m for dividing numerator and denominator by $\\cos\\theta$, 2m for substituting $1 = \\sec^2\\theta - \\tan^2\\theta$ in numerator, 2m for factoring and canceling common term.',
        frequentYears: [2022, 2023, 2025, 2026],
        boardSets: ['Set 30/1/3', 'Set 30/3/2']
      },
      {
        id: 'math-rc-4',
        subjectSlug: 'mathematics-standard',
        chapterSlug: 'surface-areas-and-volumes',
        chapterTitle: 'Surface Areas & Volumes',
        conceptTitle: 'Combined Solid Toy/Tent Total Surface Area & Volume',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'A solid toy is in the form of a hemisphere surmounted by a right circular cone. If the height of the cone is 4 cm and diameter of base is 8 cm, determine the total surface area and volume.',
        examinerExpectation: '1m for finding slant height $l = \\sqrt{r^2+h^2}$, 2m for formula $TSA = \\pi r l + 2\\pi r^2$, 1m for calculation steps with $\\pi$, 1m for final answer with $cm^2$ and $cm^3$ units.',
        frequentYears: [2023, 2024, 2025, 2026],
        boardSets: ['Set 30/2/2', 'Set 30/5/2']
      },
      {
        id: 'math-rc-5',
        subjectSlug: 'mathematics-standard',
        chapterSlug: 'arithmetic-progressions',
        chapterTitle: 'Arithmetic Progressions',
        conceptTitle: 'Real-World Production/Loan Case Study',
        questionType: '4-Mark Case Study',
        frequencyBadge: 'Appeared in 5/5 Years',
        typicalMarks: 4,
        questionPromptSample: 'A manufacturer of TV sets produced 600 sets in the third year and 700 sets in the seventh year. Assuming that the production increases uniformly by a fixed number every year...',
        examinerExpectation: '1m for finding common difference $d=25$, 1m for first year production $a=550$, 2m for finding production in 10th year or total production in first 7 years ($S_7$).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 30/1/1', 'Set 30/4/1']
      }
    ]
  },

  'social-science': {
    slug: 'social-science',
    code: '087',
    title: 'Social Science',
    totalMarks: 80,
    totalChapters: 22,
    highYieldThreshold: '6+ Marks',
    summaryQuote: 'History, Geography, Political Science, and Economics carry exactly 20 marks each. Nationalism in India + Map Skill guarantees 11-13 marks alone.',
    trendInsights: [
      {
        title: 'Guaranteed 5-Mark Map Skill (Section F)',
        description: '2 marks from History (Indian National Congress sessions & Satyagraha centers) and 3 marks from Geography (Major Dams, Thermal/Nuclear power plants, Major Ports, and Airports).',
        tag: '100% Guaranteed 5M'
      },
      {
        title: 'Nationalism in India Dominance',
        description: 'Carries 6 to 8 marks every year with questions on Non-Cooperation Movement, Civil Disobedience Movement, Salt March, and Simon Commission.',
        tag: 'History Core'
      },
      {
        title: 'Political Parties & Federalism (12 Marks)',
        description: 'Functions of political parties, challenges faced by political parties, and power-sharing features between Centre and States appear in all long-answer sections.',
        tag: 'Civics Core'
      }
    ],
    chapters: [
      {
        id: 'nationalism-in-india',
        slug: 'nationalism-in-india',
        title: 'Nationalism in India',
        unitTitle: 'India and the Contemporary World - II',
        officialMarksMin: 6,
        officialMarksMax: 8,
        historicalAvgMarks: 7.5,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 0, map_skill_5m: 2 },
        mostRepeatedTopics: [
          'Non-Cooperation Movement: reasons, participation of peasants/tribals/workers, and withdrawal',
          'Civil Disobedience Movement vs Non-Cooperation differences & Salt March significance',
          'Sense of Collective Belonging (Bharat Mata, folklore, tricolor flag, reinterpretation of history)',
          'History Map Work: Champaran, Kheda, Ahmedabad, Amritsar (Jallianwala Bagh), Dandi, Madras/Calcutta/Nagpur Congress'
        ],
        boardExamFocusTip: 'Map items for Champaran, Kheda, Dandi, and Amritsar are guaranteed 2 marks in Section F.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 25
      },
      {
        id: 'political-parties',
        slug: 'political-parties',
        title: 'Political Parties',
        unitTitle: 'Democratic Politics - II',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'high',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Functions of political parties in a democracy (contesting elections, forming policies, opposition role)',
          'Challenges faced by political parties (lack of internal democracy, dynastic succession, money & muscle power, meaningful choices)',
          'Efforts & suggestions to reform political parties (anti-defection law, affidavit, EC orders)'
        ],
        boardExamFocusTip: 'Challenges faced by political parties is the #1 most repeated 5-mark subjective question in Civics.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 18
      },
      {
        id: 'money-and-credit',
        slug: 'money-and-credit',
        title: 'Money and Credit',
        unitTitle: 'Understanding Economic Development',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'high',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Formal vs Informal sources of credit in India (RBI role, interest rates, terms of credit)',
          'Self Help Groups (SHGs) for rural poor: functioning and empowerment of women',
          'Why banks are not present in all rural areas & debt trap explanation'
        ],
        boardExamFocusTip: 'Compare formal and informal credit in a table: lender, interest rate, collateral requirement, and supervision.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'manufacturing-industries',
        slug: 'manufacturing-industries',
        title: 'Manufacturing Industries',
        unitTitle: 'Contemporary India - II',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.5,
        yieldTier: 'medium',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0, map_skill_5m: 1 },
        mostRepeatedTopics: [
          'Importance of manufacturing industries as the backbone of economic development',
          'Industrial pollution types (Air, Water, Thermal, Noise) and environmental degradation control',
          'Cotton textile industry location factors and Iron & Steel industry in Chhotanagpur plateau'
        ],
        boardExamFocusTip: 'Steps to control environmental degradation caused by industries is a high-frequency 5-marker.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'sectors-of-the-indian-economy',
        slug: 'sectors-of-the-indian-economy',
        title: 'Sectors of the Indian Economy',
        unitTitle: 'Understanding Economic Development',
        officialMarksMin: 5,
        officialMarksMax: 6,
        historicalAvgMarks: 5.0,
        yieldTier: 'medium',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 1, sa_3m: 1, la_5m: 0, case_study_4m: 1 },
        mostRepeatedTopics: [
          'Primary, Secondary, Tertiary sectors comparison & rising importance of Tertiary sector in India',
          'Disguised unemployment in agriculture sector & ways to create more employment',
          'Organised vs Unorganised sectors: employment conditions and worker protection'
        ],
        boardExamFocusTip: 'Reasons for the rising importance of tertiary sector in India (basic services, agriculture/industry development, rise in income levels).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 14
      }
    ],
    repeatedConcepts: [
      {
        id: 'sst-rc-1',
        subjectSlug: 'social-science',
        chapterSlug: 'nationalism-in-india',
        chapterTitle: 'Nationalism in India',
        conceptTitle: 'Non-Cooperation Movement in Towns & Countryside',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years (2022-2026)',
        typicalMarks: 5,
        questionPromptSample: 'How did the Non-Cooperation Movement spread in cities and countryside? Why did it gradually slow down in cities?',
        examinerExpectation: '5 distinct points: middle class participation in cities, boycott of foreign goods/cloth, spread to peasants (Baba Ramchandra in Awadh) and tribals (Alluri Sitaram Raju in Gudem hills), reasons for slowdown (expensive Khadi cloth, lack of alternative Indian institutions).',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['Set 32/1/1', 'Set 32/2/1', 'Set 32/4/1']
      },
      {
        id: 'sst-rc-2',
        subjectSlug: 'social-science',
        chapterSlug: 'nationalism-in-india',
        chapterTitle: 'Map Skill Section F',
        conceptTitle: 'National Congress Sessions & Satyagraha Centers',
        questionType: '5-Mark Map Skill',
        frequencyBadge: 'Appeared in 5/5 Years (100% Guaranteed)',
        typicalMarks: 2,
        questionPromptSample: 'On the given political outline map of India, locate and label: (A) The place where Indian National Congress session was held in Sept 1920 (Calcutta). (B) The place where Gandhiji violated the Salt Law (Dandi).',
        examinerExpectation: 'Exact pinpoint marking on state outlines with accurate capital names and labels.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['All Sets (2022-2026)']
      },
      {
        id: 'sst-rc-3',
        subjectSlug: 'social-science',
        chapterSlug: 'political-parties',
        chapterTitle: 'Political Parties',
        conceptTitle: 'Major Challenges Faced by Political Parties in India',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'Examine any five major challenges faced by political parties in India today.',
        examinerExpectation: 'Headings + explanation: 1. Lack of internal democracy, 2. Dynastic succession, 3. Growing role of money and muscle power, 4. Parties do not offer meaningful choices to voters, 5. Defection and ideological dilution.',
        frequentYears: [2022, 2023, 2025, 2026],
        boardSets: ['Set 32/1/2', 'Set 32/3/2']
      },
      {
        id: 'sst-rc-4',
        subjectSlug: 'social-science',
        chapterSlug: 'money-and-credit',
        chapterTitle: 'Money and Credit',
        conceptTitle: 'Formal vs Informal Sources of Credit & Role of SHGs',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 5,
        questionPromptSample: 'Why is it necessary for banks and cooperatives to extend their lending in rural areas? Explain the functioning and benefits of Self Help Groups (SHGs).',
        examinerExpectation: 'Points on high interest in informal sector causing debt traps, RBI supervision keeping formal credit cheap, SHGs functioning (savings pool, collateral-free credit, regular meetings, women empowerment).',
        frequentYears: [2023, 2024, 2025, 2026],
        boardSets: ['Set 32/2/2', 'Set 32/5/1']
      }
    ]
  },

  'english-language-and-literature': {
    slug: 'english-language-and-literature',
    code: '184',
    title: 'English Language & Literature',
    totalMarks: 80,
    totalChapters: 21,
    highYieldThreshold: '5+ Marks',
    summaryQuote: 'Section A Reading (20m) and Section B Writing/Grammar (20m) award 50% of the paper. Literature Section C (40m) focuses heavily on character sketches and theme comparisons.',
    trendInsights: [
      {
        title: 'Analytical Paragraph & Letter Writing (10 Marks)',
        description: 'Formal Letter (Letter to Editor / Complaint / Order) and Analytical Paragraph (pie-chart / bar graph / trend data interpretation) follow strict 5-mark rubrics (2m Format, 2m Content, 1m Accuracy).',
        tag: 'Guaranteed 10M'
      },
      {
        title: 'Theme-Based 6-Mark Literature Questions',
        description: 'Section C Long Answer questions (6 marks) ask students to compare two characters or themes across different stories (e.g. Mandela\'s freedom vs Seagull\'s courage, Lencho\'s blind faith vs Postmaster\'s kindness).',
        tag: 'Literature LA'
      },
      {
        title: 'High-Frequency Poems',
        description: 'Dust of Snow, Fire and Ice, A Tiger in the Zoo, and The Ball Poem account for over 65% of all poetic extract questions.',
        tag: 'Poetry Core'
      }
    ],
    chapters: [
      {
        id: 'a-letter-to-god',
        slug: 'a-letter-to-god',
        title: 'A Letter to God',
        unitTitle: 'First Flight',
        officialMarksMin: 3,
        officialMarksMax: 6,
        historicalAvgMarks: 4.5,
        yieldTier: 'high',
        difficulty: 'Easy',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Lencho\'s immense faith in God and his reaction to the post office employees (\'bunch of crooks\')',
          'Postmaster\'s character sketch: compassion, empathy, and generosity',
          'Irony of the situation in the story'
        ],
        boardExamFocusTip: 'Explain the irony: the very people who helped Lencho by collecting money were accused of stealing by him.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 16
      },
      {
        id: 'nelson-mandela-long-walk-to-freedom',
        slug: 'nelson-mandela-long-walk-to-freedom',
        title: 'Nelson Mandela: Long Walk to Freedom',
        unitTitle: 'First Flight',
        officialMarksMin: 3,
        officialMarksMax: 6,
        historicalAvgMarks: 5.0,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 1, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Twin obligations: obligation to family vs obligation to his people/country',
          'Mandela\'s understanding of freedom: childhood illusion vs adulthood realization',
          'The oppressor and the oppressed are both robbed of their humanity'
        ],
        boardExamFocusTip: 'Mandela\'s quote on courage not being the absence of fear, but the triumph over it is a frequent quote-analysis prompt.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 15
      },
      {
        id: 'the-ball-poem',
        slug: 'the-ball-poem',
        title: 'The Ball Poem',
        unitTitle: 'First Flight (Poetry)',
        officialMarksMin: 3,
        officialMarksMax: 5,
        historicalAvgMarks: 4.0,
        yieldTier: 'high',
        difficulty: 'Moderate',
        distribution: { mcq: 1, vsa_2m: 0, sa_3m: 1, la_5m: 0, case_study_4m: 0 },
        mostRepeatedTopics: [
          'Epistemology of loss: how the boy learns the nature of loss in a world of possessions',
          'Symbolism of the ball representing the boy\'s innocent childhood days',
          'Why the poet says \'money is external\' and refuses to intrude on the boy'
        ],
        boardExamFocusTip: 'Explain why buying another ball cannot replace the emotional connection of the lost childhood.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        pyqCountAvailable: 14
      }
    ],
    repeatedConcepts: [
      {
        id: 'eng-rc-1',
        subjectSlug: 'english-language-and-literature',
        chapterSlug: 'writing-skills',
        chapterTitle: 'Section B: Writing Skills',
        conceptTitle: 'Formal Letter to Editor on Public Civic Issues',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 5/5 Years (100% Guaranteed)',
        typicalMarks: 5,
        questionPromptSample: 'Write a letter to the Editor of a national daily expressing your concern over the reckless driving and increasing road accidents in your city, suggesting effective measures.',
        examinerExpectation: 'Sender address, Date, Receiver address, Subject, Salutation, 3-Paragraph Body (Introduction, Causes/Problems, Concrete Suggestions), Complimentary Close. 2m Format, 2m Content, 1m Expression/Grammar.',
        frequentYears: [2022, 2023, 2024, 2025, 2026],
        boardSets: ['All Sets (2022-2026)']
      },
      {
        id: 'eng-rc-2',
        subjectSlug: 'english-language-and-literature',
        chapterSlug: 'nelson-mandela-long-walk-to-freedom',
        chapterTitle: 'First Flight',
        conceptTitle: 'Comparative Long Answer on Courage & Overcoming Obstacles',
        questionType: '5-Mark Long Answer',
        frequencyBadge: 'Appeared in 4/5 Years',
        typicalMarks: 6,
        questionPromptSample: 'Analyze how both Nelson Mandela and the young seagull (His First Flight) conquered their fears to attain their true potential. How does courage shape destiny?',
        examinerExpectation: 'Clear comparative structure, contextual quotes from both chapters, synthesis of personal courage vs collective struggle, immaculate grammar and thematic maturity.',
        frequentYears: [2023, 2024, 2025, 2026],
        boardSets: ['Set 2/1/1', 'Set 2/2/1']
      }
    ]
  }
};

export function getSubjectTrends(subjectSlug: string = 'science'): SubjectPyqTrend {
  return PYQ_TRENDS_DATA[subjectSlug] || PYQ_TRENDS_DATA['science'];
}

export function getAllSubjectOptions(): { slug: string; title: string; code: string }[] {
  return [
    { slug: 'science', title: 'Science', code: '086' },
    { slug: 'mathematics-standard', title: 'Mathematics Standard', code: '041' },
    { slug: 'social-science', title: 'Social Science', code: '087' },
    { slug: 'english-language-and-literature', title: 'English Language & Lit', code: '184' }
  ];
}
