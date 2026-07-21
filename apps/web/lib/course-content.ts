import { promises as fs } from 'fs';
import path from 'path';
import { chapterPacks } from './chapter-packs.generated';
import type { CurriculumContentEvidence } from './curriculum/coverage';

export type LessonMeta = {
  slug: string;
  fileName: string;
  title: string;
  type: string;
  minutes: number;
  free: boolean;
  preview: string;
};

export type ChapterContent = {
  subject: string;
  title: string;
  progress: number;
  mastery: string;
  streakTask: string;
  summary: string;
  lessons: LessonMeta[];
  topics?: string[];
};

export type MarkdownBlock =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'code'; text: string };

export type LessonContent = {
  chapterSlug: string;
  chapter: ChapterContent;
  lesson: LessonMeta;
  blocks: MarkdownBlock[];
  previousLesson: LessonMeta | null;
  nextLesson: LessonMeta | null;
};

export type ChapterPackContent = {
  chapterSlug: string;
  chapter: ChapterContent;
  blocks: MarkdownBlock[];
};

const chapters: Record<string, ChapterContent> = {
  'real-numbers': {
    subject: 'Mathematics',
    title: 'Real Numbers',
    progress: 42,
    mastery: 'Notes live',
    streakTask: 'Finish one lesson note and solve 3 practice questions',
    summary:
      'Five live lesson notes now cover Euclid division lemma, prime factorisation, HCF and LCM, irrational numbers, and decimal expansion in simple English.',
    topics: [
      'Euclid division lemma',
      'Fundamental theorem of arithmetic',
      'HCF and LCM by prime factorisation',
      'Irrational numbers',
      'Decimal expansion of rational numbers',
    ],
    lessons: [
      {
        slug: 'euclid-division-lemma',
        fileName: '01-euclid-division-lemma.md',
        title: 'Euclid division lemma',
        type: 'Support concept note',
        minutes: 8,
        free: true,
        preview: 'Start with familiar long division, then map it to a = bq + r and Euclid HCF steps without fear.',
      },
      {
        slug: 'fundamental-theorem-of-arithmetic',
        fileName: '02-fundamental-theorem-of-arithmetic.md',
        title: 'Fundamental theorem of arithmetic',
        type: 'Core concept note',
        minutes: 10,
        free: false,
        preview: 'Prime numbers, factors, and prime factorisation explained in easy English with quick recall help.',
      },
      {
        slug: 'hcf-and-lcm-by-prime-factorisation',
        fileName: '03-hcf-and-lcm-by-prime-factorisation.md',
        title: 'HCF and LCM by prime factorisation',
        type: 'Board scoring lesson',
        minutes: 12,
        free: false,
        preview: 'Learn the one clean rule that separates HCF from LCM and stops the usual confusion.',
      },
      {
        slug: 'irrational-numbers',
        fileName: '04-irrational-numbers.md',
        title: 'Irrational numbers',
        type: 'Proof and understanding',
        minutes: 9,
        free: false,
        preview: 'Know the difference between rational and irrational numbers and remember the √2 proof flow.',
      },
      {
        slug: 'decimal-expansion-of-rational-numbers',
        fileName: '05-decimal-expansion-of-rational-numbers.md',
        title: 'Decimal expansion of rational numbers',
        type: 'Quick test concept',
        minutes: 7,
        free: false,
        preview: 'Use denominator factorisation to tell whether a decimal will terminate or repeat.',
      },
    ],
  },
  'polynomials': {
    subject: 'Mathematics',
    title: 'Polynomials',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Understand zeroes of a polynomial and the relationship between coefficients and zeroes of quadratic polynomials.',
    topics: ['Zeroes of polynomials', 'Coefficient relations', 'Division algorithm'],
    lessons: [],
  },
  'pair-of-linear-equations-in-two-variables': {
    subject: 'Mathematics',
    title: 'Pair of Linear Equations in Two Variables',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Solve systems of linear equations using graphical, substitution, and elimination methods.',
    topics: ['Graphical solution', 'Substitution method', 'Elimination method'],
    lessons: [],
  },
  'quadratic-equations': {
    subject: 'Mathematics',
    title: 'Quadratic Equations',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Solve quadratic equations using factorization and the quadratic formula; completing the square remains available as support-only material.',
    topics: ['Factorization method', 'Quadratic formula', 'Nature of roots', 'Completing the square (support only)'],
    lessons: [],
  },
  'arithmetic-progressions': {
    subject: 'Mathematics',
    title: 'Arithmetic Progressions',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Find the nth term and sum of the first n terms of an arithmetic progression.',
    topics: ['nth term of AP', 'Sum of n terms', 'AP applications'],
    lessons: [],
  },
  'triangles': {
    subject: 'Mathematics',
    title: 'Triangles',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Study similarity of triangles, Thales theorem, and criteria for similarity.',
    topics: ['Similar triangles', 'Basic proportionality theorem', 'Similarity criteria'],
    lessons: [],
  },
  'coordinate-geometry': {
    subject: 'Mathematics',
    title: 'Coordinate Geometry',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Find distance between points and use the internal section formula; coordinate-triangle area remains support-only material.',
    topics: ['Distance formula', 'Section formula', 'Area of triangle (support only)'],
    lessons: [],
  },
  'introduction-to-trigonometry': {
    subject: 'Mathematics',
    title: 'Introduction to Trigonometry',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Learn trigonometric ratios of acute angles, specific values, and identities.',
    topics: ['Trigonometric ratios', 'Specific angle values', 'Trigonometric identities'],
    lessons: [],
  },
  'some-applications-of-trigonometry': {
    subject: 'Mathematics',
    title: 'Some Applications of Trigonometry',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Calculate heights and distances using angles of elevation and depression.',
    topics: ['Angle of elevation', 'Angle of depression', 'Height and distance problems'],
    lessons: [],
  },
  'circles': {
    subject: 'Mathematics',
    title: 'Circles',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Understand tangents to a circle, theorems on radius and tangent perpendicularity, and tangent lengths.',
    topics: ['Tangent to a circle', 'Perpendicular tangent theorem', 'Tangents from external point'],
    lessons: [],
  },
  'areas-related-to-circles': {
    subject: 'Mathematics',
    title: 'Areas Related to Circles',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Calculate area of sector and segment of a circle, and combinations of plane figures.',
    topics: ['Area of sector', 'Area of segment', 'Combined figures area'],
    lessons: [],
  },
  'surface-areas-and-volumes': {
    subject: 'Mathematics',
    title: 'Surface Areas and Volumes',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Find surface areas and volumes of combinations of solids including cubes, cylinders, cones, and spheres.',
    topics: ['Volume of combined solids', 'Surface area of combined solids', 'Frustum of a cone'],
    lessons: [],
  },
  'statistics': {
    subject: 'Mathematics',
    title: 'Statistics',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Find mean, median, and mode of grouped data, and cumulative frequency graphs.',
    topics: ['Mean of grouped data', 'Median and Mode', 'Ogive curves'],
    lessons: [],
  },
  'probability': {
    subject: 'Mathematics',
    title: 'Probability',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Calculate theoretical probability of events and solve simple textbook problems.',
    topics: ['Classical probability', 'Complementary events', 'Card and dice problems'],
    lessons: [],
  },
  'chemical-reactions-and-equations': {
    subject: 'Science',
    title: 'Chemical Reactions and Equations',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Finish one lesson note and balance 3 equations without hints',
    summary:
      'Six NCERT-sequenced lessons teach equations, reaction types, oxidation effects, activities, figures, in-text questions, and scoring-friendly exercise answers.',
    topics: [
      '1.1 Chemical Equations',
      '1.2 Types of Chemical Reactions',
      '1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?',
    ],
    lessons: [
      {
        slug: 'chemical-equations',
        fileName: '01-chemical-equations.md',
        title: '1.1 Chemical Equations and 1.1.1 Writing a Chemical Equation',
        type: 'Concept foundation',
        minutes: 18,
        free: true,
        preview:
          'Read reactions as reactants, products, formula equations, and state symbols before learning to balance them.',
      },
      {
        slug: 'balancing-equations',
        fileName: '02-balancing-equations.md',
        title: '1.1.2 Balanced Chemical Equations',
        type: 'Guided balancing practice',
        minutes: 22,
        free: false,
        preview:
          'Use conservation of mass, coefficients, and a repeatable atom-counting method to balance equations safely.',
      },
      {
        slug: 'combination-and-decomposition-reactions',
        fileName: '03-combination-and-decomposition-reactions.md',
        title: '1.2 Types of Chemical Reactions - 1.2.1 Combination and 1.2.2 Decomposition',
        type: 'Visual explainer',
        minutes: 24,
        free: false,
        preview:
          'Learn how combination and decomposition reactions work, plus the difference between thermal, electrolytic, and photolytic breakdown.',
      },
      {
        slug: 'displacement-and-double-displacement-reactions',
        fileName: '04-displacement-and-double-displacement-reactions.md',
        title: '1.2.3 Displacement and 1.2.4 Double Displacement Reactions',
        type: 'Activity breakdown',
        minutes: 18,
        free: false,
        preview:
          'Use the reactivity series and ion exchange to spot displacement, double displacement, and precipitate-forming reactions.',
      },
      {
        slug: 'oxidation-and-reduction',
        fileName: '05-oxidation-and-reduction.md',
        title: '1.2.5 Oxidation and Reduction; 1.3 Effects of Oxidation in Everyday Life',
        type: 'Revision sprint',
        minutes: 18,
        free: false,
        preview:
          'Revise oxidation, reduction, redox, corrosion, and rancidity with prevention methods and quick examples.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '06-ncert-exercises-and-revision.md',
        title: 'NCERT Chapter Exercises and Revision',
        type: 'Exam practice',
        minutes: 35,
        free: false,
        preview: 'Attempt all twenty NCERT exercises, reveal concise answers, and finish with a repeatable revision ladder.',
      },
    ],
  },
  'acids-bases-and-salts': {
    subject: 'Science',
    title: 'Acids, Bases and Salts',
    progress: 18,
    mastery: 'Notes live',
    streakTask: 'Watch one lab animation and solve 3 quick practice questions',
    summary:
      'Four live lesson notes now cover indicators, chemical properties of acids and bases, pH, salts, and common salt derivatives with Chapter 2 lab animations.',
    topics: [
      '2.1 Understanding the chemical properties of acids and bases',
      '2.2 What do all acids and all bases have in common?',
      '2.3 How strong are acid or base solutions?',
      '2.4 Importance of pH in daily life',
      '2.5 More about salts',
    ],
    lessons: [
      {
        slug: 'indicators-and-neutralisation',
        fileName: '01-indicators-and-neutralisation.md',
        title: '2.1-2.2 Understanding acids, bases, and neutralisation',
        type: 'Virtual lab note',
        minutes: 10,
        free: true,
        preview:
          'Use litmus, phenolphthalein, onion, and neutralisation colour changes to identify acids and bases.',
      },
      {
        slug: 'chemical-properties-of-acids-and-bases',
        fileName: '02-chemical-properties-of-acids-and-bases.md',
        title: '2.1 continued - Reactions of acids and bases',
        type: 'Activity breakdown',
        minutes: 12,
        free: false,
        preview:
          'See acids and bases react with metals, carbonates, and metallic oxides using animated NCERT-style labs.',
      },
      {
        slug: 'ph-and-ions-in-solution',
        fileName: '03-ph-and-ions-in-solution.md',
        title: '2.3-2.4 pH scale and importance in daily life',
        type: 'Concept explainer',
        minutes: 9,
        free: false,
        preview:
          'Connect pH values, H+ and OH- ions, water dilution, and electrical conductivity in aqueous acids.',
      },
      {
        slug: 'salts-and-daily-life-uses',
        fileName: '04-salts-and-daily-life-uses.md',
        title: '2.5 More about salts and important compounds',
        type: 'Revision sprint',
        minutes: 9,
        free: false,
        preview:
          'Revise common salt, bleaching powder, baking soda, washing soda, plaster of Paris, and water of crystallisation.',
      },
    ],
  },
  'metals-and-non-metals': {
    subject: 'Science',
    title: 'Metals and Non-metals',
    progress: 22,
    mastery: 'Notes live',
    streakTask: 'Run one virtual lab and answer 3 reactivity questions',
    summary:
      'Six live lesson notes now cover physical properties, conductivity, oxides, reactivity, ionic compounds, and corrosion with Chapter 3 lab animations.',
    topics: [
      '3.1 Physical properties',
      '3.2 Chemical properties of metals',
      '3.3 How do metals and non-metals react?',
      '3.4 Properties of ionic compounds',
      '3.5 Occurrence of metals',
      '3.6 Corrosion',
    ],
    lessons: [
      {
        slug: 'physical-properties',
        fileName: '01-physical-properties.md',
        title: '3.1 Physical properties of metals and non-metals',
        type: 'Virtual lab note',
        minutes: 10,
        free: true,
        preview:
          'Compare hardness, malleability, lustre, and electrical conductivity using metal and non-metal samples.',
      },
      {
        slug: 'thermal-conductivity-and-conductivity',
        fileName: '02-thermal-conductivity-and-conductivity.md',
        title: '3.1 continued - Thermal and electrical conductivity',
        type: 'Activity breakdown',
        minutes: 9,
        free: false,
        preview:
          'Watch heat travel through a metal rod and connect conductivity evidence with free electrons in metals.',
      },
      {
        slug: 'oxides-and-chemical-properties',
        fileName: '03-oxides-and-chemical-properties.md',
        title: '3.2 Chemical properties of metals',
        type: 'Concept explainer',
        minutes: 11,
        free: false,
        preview:
          'Burn metal and non-metal samples, test oxides with litmus, and separate basic from acidic oxides.',
      },
      {
        slug: 'reactivity-series-and-displacement',
        fileName: '04-reactivity-series-and-displacement.md',
        title: '3.2.4-3.3 Reactivity series and how metals react with non-metals',
        type: 'Activity breakdown',
        minutes: 12,
        free: false,
        preview:
          'Use water, acid, and salt solution reactions to predict which metal is more reactive.',
      },
      {
        slug: 'ionic-compounds',
        fileName: '05-ionic-compounds.md',
        title: '3.3-3.4 Ionic compounds and their properties',
        type: 'Board scoring lesson',
        minutes: 10,
        free: false,
        preview:
          'Explain why ionic compounds have high melting points and conduct only when ions can move.',
      },
      {
        slug: 'corrosion-and-prevention',
        fileName: '06-corrosion-and-prevention.md',
        title: '3.5-3.6 Occurrence, corrosion, and prevention',
        type: 'Revision sprint',
        minutes: 8,
        free: false,
        preview:
          'Identify the conditions needed for rusting and revise prevention methods such as painting and galvanisation.',
      },
    ],
  },
  'carbon-and-its-compounds': {
    subject: 'Science',
    title: 'Carbon and its Compounds',
    progress: 18,
    mastery: 'Notes live',
    streakTask: 'Revise one reaction type and answer 3 naming questions',
    summary:
      'Seven live lesson notes cover covalent bonding, carbon versatility, hydrocarbons, functional groups, reactions, ethanol, ethanoic acid, soaps, and detergents.',
    topics: [
      '4.1 Bonding in carbon - the covalent bond',
      '4.2 Versatile nature of carbon',
      '4.3 Chemical properties of carbon compounds',
      '4.4 Some important carbon compounds - ethanol and ethanoic acid',
      '4.5 Soaps and detergents',
    ],
    lessons: [
      {
        slug: 'covalent-bonding-in-carbon',
        fileName: '01-covalent-bonding-in-carbon.md',
        title: '4.1 Bonding in carbon - the covalent bond',
        type: 'Concept explainer',
        minutes: 10,
        free: true,
        preview:
          'Explain why carbon shares electrons and draw simple covalent structures for methane and carbon dioxide.',
      },
      {
        slug: 'versatile-nature-of-carbon',
        fileName: '02-versatile-nature-of-carbon.md',
        title: '4.2 Versatile nature of carbon',
        type: 'Board scoring lesson',
        minutes: 9,
        free: false,
        preview:
          'Use tetravalency, catenation, chains, branches, rings, diamond, and graphite to explain carbon versatility.',
      },
      {
        slug: 'hydrocarbons-and-homologous-series',
        fileName: '03-hydrocarbons-and-homologous-series.md',
        title: '4.2 continued - Hydrocarbons and homologous series',
        type: 'Concept explainer',
        minutes: 11,
        free: false,
        preview:
          'Separate alkanes, alkenes, alkynes, saturated compounds, unsaturated compounds, and homologous series.',
      },
      {
        slug: 'functional-groups-and-naming',
        fileName: '04-functional-groups-and-naming.md',
        title: '4.2 continued - Functional groups and naming',
        type: 'Board scoring lesson',
        minutes: 12,
        free: false,
        preview:
          'Practise root names, bond suffixes, common functional groups, and simple organic compound naming.',
      },
      {
        slug: 'chemical-properties-of-carbon-compounds',
        fileName: '05-chemical-properties-of-carbon-compounds.md',
        title: '4.3 Chemical properties of carbon compounds',
        type: 'Reaction map',
        minutes: 12,
        free: false,
        preview:
          'Revise combustion, oxidation, addition, substitution, hydrogenation, and methane chlorination examples.',
      },
      {
        slug: 'ethanol-and-ethanoic-acid',
        fileName: '06-ethanol-and-ethanoic-acid.md',
        title: '4.4 Some important carbon compounds - ethanol and ethanoic acid',
        type: 'Activity breakdown',
        minutes: 11,
        free: false,
        preview:
          'Compare ethanol and ethanoic acid, then explain esterification and carbonate reactions with gas tests.',
      },
      {
        slug: 'soaps-and-detergents',
        fileName: '07-soaps-and-detergents.md',
        title: '4.5 Soaps and detergents',
        type: 'Revision sprint',
        minutes: 10,
        free: false,
        preview:
          'Explain micelle formation, cleansing action, scum in hard water, detergents, and saponification.',
      },
    ],
  },
  'life-processes': {
    subject: 'Science',
    title: 'Life Processes',
    progress: 18,
    mastery: 'Notes live',
    streakTask: 'Revise one life-process diagram and answer 3 pathway questions',
    summary:
      'Six live lesson notes follow NCERT Chapter 5: life processes, nutrition, respiration, transport, excretion, activities, figures, and exercise anchors.',
    topics: [
      '5.1 What are life processes?',
      '5.2 Nutrition',
      '5.3 Respiration',
      '5.4 Transportation',
      '5.5 Excretion',
    ],
    lessons: [
      {
        slug: 'life-processes-and-nutrition-in-plants',
        fileName: '01-life-processes-and-nutrition-in-plants.md',
        title: '5.1 What are life processes? and 5.2 Nutrition',
        type: 'Concept explainer',
        minutes: 12,
        free: true,
        preview:
          'Understand maintenance, diffusion limits, photosynthesis, stomata, chlorophyll, carbon dioxide tests, and plant raw materials.',
      },
      {
        slug: 'heterotrophic-and-human-nutrition',
        fileName: '02-heterotrophic-and-human-nutrition.md',
        title: '5.2.2-5.2.4 Heterotrophic and human nutrition',
        type: 'Board scoring lesson',
        minutes: 13,
        free: false,
        preview:
          'Compare saprophytic, parasitic, Amoeba, Paramoecium, and human digestion from mouth to absorption.',
      },
      {
        slug: 'respiration-and-gas-exchange',
        fileName: '03-respiration-and-gas-exchange.md',
        title: '5.3 Respiration',
        type: 'Activity breakdown',
        minutes: 13,
        free: false,
        preview:
          'Track glucose breakdown, ATP, aerobic and anaerobic pathways, lime-water tests, alveoli, haemoglobin, and breathing.',
      },
      {
        slug: 'transportation-in-human-beings',
        fileName: '04-transportation-in-human-beings.md',
        title: '5.4.1 Transportation in human beings',
        type: 'Diagram lesson',
        minutes: 12,
        free: false,
        preview:
          'Follow the heart, double circulation, blood vessels, pressure, platelets, and lymph without mixing the pathways.',
      },
      {
        slug: 'transportation-in-plants',
        fileName: '05-transportation-in-plants.md',
        title: '5.4.2 Transportation in plants',
        type: 'Concept explainer',
        minutes: 10,
        free: false,
        preview:
          'Separate xylem, phloem, root pressure, transpiration pull, and ATP-powered translocation.',
      },
      {
        slug: 'excretion-in-human-beings-and-plants',
        fileName: '06-excretion-in-human-beings-and-plants.md',
        title: '5.5 Excretion',
        type: 'Revision sprint',
        minutes: 12,
        free: false,
        preview:
          'Explain nephron filtration, selective reabsorption, urine regulation, dialysis, plant waste storage, and organ donation.',
      },
    ],
  },
  'control-and-coordination': {
    subject: 'Science',
    title: 'Control and Coordination',
    progress: 18,
    mastery: 'Notes live',
    streakTask: 'Revise one reflex diagram and answer 3 control questions',
    summary:
      'Five live lesson notes follow NCERT Chapter 6: nervous tissue, reflexes, brain protection, plant coordination, hormones, activities, figures, and exercise anchors.',
    topics: [
      '6.1 Animals - Nervous System',
      '6.1.1 What happens in Reflex Actions?',
      '6.1.2-6.1.4 Human Brain and Nervous Tissue Action',
      '6.2 Coordination in Plants',
      '6.3 Hormones in Animals',
    ],
    lessons: [
      {
        slug: 'animals-nervous-system',
        fileName: '01-animals-nervous-system.md',
        title: '6.1 Animals - Nervous System',
        type: 'Concept explainer',
        minutes: 12,
        free: true,
        preview:
          'Trace stimuli, receptors, neurons, synapses, and the first textbook activity without skipping the NCERT order.',
      },
      {
        slug: 'reflex-actions',
        fileName: '02-reflex-actions.md',
        title: '6.1.1 What happens in Reflex Actions?',
        type: 'Board scoring lesson',
        minutes: 10,
        free: false,
        preview:
          'Follow the reflex arc, spinal cord shortcut, and fast protective responses with clear labels and examples.',
      },
      {
        slug: 'human-brain-and-nervous-tissue',
        fileName: '03-human-brain-and-nervous-tissue.md',
        title: '6.1.2-6.1.4 Human Brain and Nervous Tissue Action',
        type: 'Diagram lesson',
        minutes: 13,
        free: false,
        preview:
          'Understand the fore-brain, mid-brain, hind-brain, protection, and how muscle cells finally act on nerve signals.',
      },
      {
        slug: 'coordination-in-plants',
        fileName: '04-coordination-in-plants.md',
        title: '6.2 Coordination in Plants',
        type: 'Concept explainer',
        minutes: 12,
        free: false,
        preview:
          'Compare sensitive-plant movement, tropic growth, and plant hormones while keeping the figure and activity numbers intact.',
      },
      {
        slug: 'hormones-in-animals',
        fileName: '05-hormones-in-animals.md',
        title: '6.3 Hormones in Animals',
        type: 'Revision sprint',
        minutes: 11,
        free: false,
        preview:
          'Connect adrenaline, thyroxin, growth hormone, insulin, feedback, and the final exercise questions in one clean pass.',
      },
    ],
  },
  'how-do-organisms-reproduce': {
    subject: 'Science',
    title: 'How do Organisms Reproduce?',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Asexual and sexual reproduction, reproductive health, and human reproductive system.',
    topics: ['Asexual reproduction modes', 'Flowering plant reproduction', 'Human reproductive health'],
    lessons: [],
  },
  'heredity': {
    subject: 'Science',
    title: 'Heredity',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Mendelian laws of inheritance, sex determination, and basic genetics.',
    topics: ['Mendel monohybrid/dihybrid cross', 'Sex determination', 'Inherited traits'],
    lessons: [],
  },
  'light-reflection-and-refraction': {
    subject: 'Science',
    title: 'Light - Reflection and Refraction',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Spherical mirrors, mirror formula, refraction through lenses, lens formula, and power.',
    topics: ['Reflection and mirror formula', 'Refraction and Snell\'s law', 'Lens formula and power'],
    lessons: [],
  },
  'the-human-eye-and-the-colourful-world': {
    subject: 'Science',
    title: 'The Human Eye and the Colourful World',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Eye defects and corrections, prism refraction, dispersion, and atmospheric scattering.',
    topics: ['Myopia and Hypermetropia', 'Prism dispersion', 'Atmospheric refraction phenomena'],
    lessons: [],
  },
  'electricity': {
    subject: 'Science',
    title: 'Electricity',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Electric current, Ohm\'s law, resistance factors, parallel/series resistance, and Joule\'s heating.',
    topics: ['Ohm\'s Law', 'Series and parallel circuits', 'Joule\'s heating effect'],
    lessons: [],
  },
  'magnetic-effects-of-electric-current': {
    subject: 'Science',
    title: 'Magnetic Effects of Electric Current',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Study magnetic fields, force on conductors, AC/DC, and domestic circuits; motor, induction, and generator content is formative-only.',
    topics: ['Solenoid magnetic field', 'Domestic electric circuits', 'Motor and induction (formative only)'],
    lessons: [],
  },
  'our-environment': {
    subject: 'Science',
    title: 'Our Environment',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Ecosystems, food chains and webs, ozone depletion, and waste management.',
    topics: ['Trophic levels and energy flow', 'Ozone layer depletion', 'Biodegradable wastes'],
    lessons: [],
  },
  // English Chapters
  'a-letter-to-god': {
    subject: 'English',
    title: 'A Letter to God',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A story of extreme faith in God by a farmer named Lencho, whose crops were destroyed by hailstorms.',
    topics: ['Lencho\'s faith', 'Letter writing', 'Irony of the post office employees'],
    lessons: [],
  },
  'nelson-mandela-long-walk-to-freedom': {
    subject: 'English',
    title: 'Nelson Mandela: Long Walk to Freedom',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Extract from Nelson Mandela\'s autobiography describing the historic inauguration ceremony and the struggle against apartheid.',
    topics: ['Inauguration ceremony', 'Apartheid regime struggle', 'Mandela\'s idea of freedom'],
    lessons: [],
  },
  'two-stories-about-flying': {
    subject: 'English',
    title: 'Two Stories about Flying',
    progress: 48,
    mastery: 'Notes live',
    streakTask: 'Finish one lesson note and answer 3 short questions',
    summary:
      'Five live lesson notes now cover fear, courage, mystery, and poem revision for humour, loss, symbols, and tone.',
    topics: [
      'His First Flight: fear and hunger',
      'His First Flight: courage and family pressure',
      'The Black Aeroplane: storm and mystery',
      'The Black Aeroplane: unknown helper',
      'Poems: Wild Animals and The Ball Poem',
    ],
    lessons: [
      {
        slug: 'his-first-flight-fear-and-hunger',
        fileName: '01-his-first-flight-fear-and-hunger.md',
        title: 'His First Flight: fear and hunger',
        type: 'Story foundation',
        minutes: 8,
        free: true,
        preview:
          'Understand why the young seagull is afraid, how hunger pushes him forward, and why fear is different from laziness.',
      },
      {
        slug: 'his-first-flight-courage-and-family-pressure',
        fileName: '02-his-first-flight-courage-and-family-pressure.md',
        title: 'His First Flight: courage and family pressure',
        type: 'Theme and character note',
        minutes: 9,
        free: false,
        preview:
          'See how family pressure, the mother seagull, and one risky dive turn fear into confidence.',
      },
      {
        slug: 'the-black-aeroplane-storm-and-mystery',
        fileName: '03-the-black-aeroplane-storm-and-mystery.md',
        title: 'The Black Aeroplane: storm and mystery',
        type: 'Suspense reading note',
        minutes: 9,
        free: false,
        preview:
          'Follow the pilot into storm clouds, failed instruments, and the suspense that makes the rescue feel urgent.',
      },
      {
        slug: 'the-black-aeroplane-unknown-helper',
        fileName: '04-the-black-aeroplane-unknown-helper.md',
        title: 'The Black Aeroplane: unknown helper',
        type: 'Inference and theme note',
        minutes: 9,
        free: false,
        preview:
          'Understand the mystery of the black aeroplane, the control room reveal, and how to answer without inventing certainty.',
      },
      {
        slug: 'poems-wild-animals-and-the-ball-poem',
        fileName: '05-poems-wild-animals-and-the-ball-poem.md',
        title: 'Poems: Wild Animals and The Ball Poem',
        type: 'Poem revision note',
        minutes: 10,
        free: false,
        preview:
          'Revise humour and exaggeration in How to Tell Wild Animals, plus loss, symbol, and growing up in The Ball Poem.',
      },
    ],
  },
  'from-the-diary-of-anne-frank': {
    subject: 'English',
    title: 'From the Diary of Anne Frank',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Personal diary entries of a young Jewish girl, Anne Frank, describing her life in hiding in Amsterdam.',
    topics: ['Kitty the diary', 'Anne\'s school life', 'Relationship with teachers'],
    lessons: [],
  },
  'glimpses-of-india': {
    subject: 'English',
    title: 'Glimpses of India',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Three stories highlighting the rich culture and beauty of India: "A Baker from Goa", "Coorg", and "Tea from Assam".',
    topics: ['Goan baking culture', 'Coorgi warriors and geography', 'Assamese tea gardens'],
    lessons: [],
  },
  'madam-rides-the-bus': {
    subject: 'English',
    title: 'Madam Rides the Bus',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A sensitive story of an eight-year-old girl named Valli, who experiences her first bus ride and learns about life and death.',
    topics: ['Valli\'s planning', 'The bus journey', 'Encounter with death'],
    lessons: [],
  },
  'the-proposal': {
    subject: 'English',
    title: 'The Proposal',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A humorous one-act play by Anton Chekhov about the tendency of wealthy families to seek marriages to increase estates.',
    topics: ['Lomov\'s proposal', 'The dispute over Oxen Meadows', 'Arguments about dogs'],
    lessons: [],
  },
  'a-triumph-of-surgery': {
    subject: 'English',
    title: 'A Triumph of Surgery',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'The story of a pampered dog, Tricki, who falls ill due to overfeeding and is cured by a veterinary surgeon\'s common sense.',
    topics: ['Mrs. Pumphrey\'s indulgence', 'Tricki\'s recovery process', 'Veterinary common-sense'],
    lessons: [],
  },
  'the-thiefs-story': {
    subject: 'English',
    title: 'The Thief\'s Story',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A story by Ruskin Bond about a young thief named Hari Singh who is reformed by the trust and kindness of his employer, Anil.',
    topics: ['Hari Singh\'s trust transition', 'Anil\'s generosity', 'Value of education'],
    lessons: [],
  },
  'footprints-without-feet-story': {
    subject: 'English',
    title: 'Footprints without Feet',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'The story of Griffin, a brilliant scientist who discovers how to make himself invisible but uses it for unlawful activities.',
    topics: ['Griffin\'s discovery', 'Incidents in London and Iping', 'Misuse of science'],
    lessons: [],
  },
  'the-necklace': {
    subject: 'English',
    title: 'Matilda Loisel and The Necklace',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A cautionary tale about Matilda Loisel, whose excessive vanity leads to ruin when she loses a borrowed diamond necklace.',
    topics: ['Matilda\'s vanity', 'Loss and replacement of the necklace', 'Ten years of debt'],
    lessons: [],
  },
  'bholi': {
    subject: 'English',
    title: 'Bholi',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A heart-warming story of Sulekha (Bholi), who overcomes her stammering and lack of confidence through the power of education.',
    topics: ['Bholi\'s childhood neglect', 'School teacher\'s encouragement', 'Standing up to Bishamber'],
    lessons: [],
  },

  // Hindi Chapters
  'bade-bhai-sahab': {
    subject: 'Hindi',
    title: 'Bade Bhai Sahab',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A story by Premchand highlighting the differences in personality, responsibilities, and values between two brothers.',
    topics: ['Elder brother\'s duty', 'Playful younger brother', 'Experience vs education value'],
    lessons: [],
  },
  'diary-ka-ek-panna': {
    subject: 'Hindi',
    title: 'Diary Ka Ek Panna',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A diary record of the historic Independence day celebration in Kolkata on 26th January 1931.',
    topics: ['Kolkata\'s contribution to freedom', 'Police atrocities', 'Public patriotism'],
    lessons: [],
  },
  'tantara-vamiro-katha': {
    subject: 'Hindi',
    title: 'Tantara Vamiro Katha',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A tragic love story from the Nicobar islands that leads to the abolition of orthodox marriage restrictions between villages.',
    topics: ['Tantara\'s heroic character', 'Vamiro\'s singing', 'Social reform through sacrifice'],
    lessons: [],
  },
  'teesri-kasam-shailendra': {
    subject: 'Hindi',
    title: 'Teesri Kasam Ke Shilpkar Shailendra',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'An essay analyzing the artistic integrity of lyricist Shailendra in producing the film "Teesri Kasam".',
    topics: ['Art vs Commercialism', 'Shailendra\'s writing style', 'Folk culture representation'],
    lessons: [],
  },
  'ab-kahan-doosre-ke-dukh': {
    subject: 'Hindi',
    title: 'Ab Kahan Doosre Ke Dukh Se Dukhi Hone Wale',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'An essay illustrating the decay of human empathy toward animals and nature in modern urban life.',
    topics: ['Nature and human co-existence', 'Historical anecdotes of kindness', 'Modern concrete jungles'],
    lessons: [],
  },
  'patjhar-me-tooti-pattiya': {
    subject: 'Hindi',
    title: 'Patjhar Mein Tooti Pattiya',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Two short stories representing Buddhist wisdom and the value of self-introspection: "Ginni Ka Sona" and "Zen Ki Den".',
    topics: ['Idealism vs Practicality', 'Tea ceremony in Japan', 'Living in the present moment'],
    lessons: [],
  },
  'kartoos': {
    subject: 'Hindi',
    title: 'Kartoos',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A heroic play about Wazir Ali, a freedom fighter who enters a British camp in disguise to collect cartridges.',
    topics: ['Wazir Ali\'s bravery', 'British colonial plans', 'Patriotic spirit'],
    lessons: [],
  },
  'sakhi': {
    subject: 'Hindi',
    title: 'Sakhi (Kabir)',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Kabir\'s couplets emphasizing sweet speech, internal devotion, and shedding of ego.',
    topics: ['Power of sweet words', 'God is within', 'Eliminating ego'],
    lessons: [],
  },
  'pad': {
    subject: 'Hindi',
    title: 'Pad (Meera)',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Meera\'s devotional songs praying to Lord Krishna for protection and expressing absolute surrender.',
    topics: ['Meera\'s devotion', 'Surrender to Krishna', 'Krishna\'s protector role'],
    lessons: [],
  },
  'manushyata': {
    subject: 'Hindi',
    title: 'Manushyata',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'A patriotic and philosophical poem highlighting the true definition of humanity through selfless sacrifice.',
    topics: ['Selfless service', 'Universal brotherhood', 'Remembering historical legends'],
    lessons: [],
  },

  // Social Science Chapters
  'rise-of-nationalism-in-europe': {
    subject: 'Social Science',
    title: 'The Rise of Nationalism in Europe',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Analyze the growth of nation-states, liberalism, and the unification of Italy and Germany.',
    topics: ['French Revolution ideas', 'Unification of Italy/Germany', 'Visualizing the nation'],
    lessons: [],
  },
  'nationalism-in-india': {
    subject: 'Social Science',
    title: 'Nationalism in India',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Study the Non-Cooperation and Civil Disobedience movements and the sense of collective belonging.',
    topics: ['First World War & Satyagraha', 'Salt March & Civil Disobedience', 'Sense of collective belonging'],
    lessons: [],
  },
  'making-of-a-global-world': {
    subject: 'Social Science',
    title: 'The Making of a Global World',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Explore pre-modern trade, silk routes, indentured labor, and the post-war global economy.',
    topics: ['Silk routes & food travel', 'Indentured labour migration', 'Bretton Woods institutions'],
    lessons: [],
  },
  'print-culture': {
    subject: 'Social Science',
    title: 'Print Culture and the Modern World',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Understand the development of printing from East Asia to Europe and its impact on public debates.',
    topics: ['First printed books', 'Print revolution in Europe', 'India and print censorship'],
    lessons: [],
  },
  'resources-and-development': {
    subject: 'Social Science',
    title: 'Resources and Development',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Classification of resources, sustainable development, resource planning, and soil types in India.',
    topics: ['Resource planning & conservation', 'Land degradation', 'Soil classification types'],
    lessons: [],
  },
  'water-resources': {
    subject: 'Social Science',
    title: 'Water Resources',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Water scarcity, multipurpose river projects, rainwater harvesting, and water conservation methods.',
    topics: ['Multipurpose dams arguments', 'Rainwater harvesting methods', 'Water conservation case studies'],
    lessons: [],
  },
  'agriculture': {
    subject: 'Social Science',
    title: 'Agriculture',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Farming types, cropping patterns, major food and non-food crops, and technological reforms in farming.',
    topics: ['Cropping patterns (Rabi/Kharif)', 'Major crops in India', 'Farming technical reforms'],
    lessons: [],
  },
  'minerals-and-energy-resources': {
    subject: 'Social Science',
    title: 'Minerals and Energy Resources',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Modes of occurrence of minerals, metallic and non-metallic minerals, and conventional/non-conventional energy resources.',
    topics: ['Metallic vs Non-metallic', 'Distribution of iron and coal', 'Solar and wind energy potential'],
    lessons: [],
  },
  'power-sharing': {
    subject: 'Social Science',
    title: 'Power Sharing',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Analyze power sharing arrangements in Belgium and Sri Lanka and why power sharing is desirable.',
    topics: ['Belgium accommodation model', 'Sri Lanka majoritarianism', 'Forms of power sharing'],
    lessons: [],
  },
  'federalism': {
    subject: 'Social Science',
    title: 'Federalism',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Key features of federalism, what makes India a federal country, and decentralisation in India.',
    topics: ['Features of federalism', 'Center-State relations', 'Decentralisation & Panchayati Raj'],
    lessons: [],
  },
  'political-parties': {
    subject: 'Social Science',
    title: 'Political Parties',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Why we need political parties, national vs regional parties, and reforms of political parties.',
    topics: ['Functions of political parties', 'National and State parties', 'Reforming political parties'],
    lessons: [],
  },
  'development': {
    subject: 'Social Science',
    title: 'Development',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'What development promises, national development goals, income and other indicators, and Human Development Index.',
    topics: ['Developmental goals', 'Human Development Index (HDI)', 'Sustainability of development'],
    lessons: [],
  },
  'sectors-of-indian-economy': {
    subject: 'Social Science',
    title: 'Sectors of the Indian Economy',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Primary, secondary, and tertiary sectors, comparing sectors, GDP, and organized/unorganized sectors.',
    topics: ['Sector classification (Primary/Secondary/Tertiary)', 'GDP and employment distribution', 'Organised vs Unorganised sectors'],
    lessons: [],
  },
  'money-and-credit': {
    subject: 'Social Science',
    title: 'Money and Credit',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Money as a medium of exchange, modern forms of money, loan activities of banks, and Self Help Groups.',
    topics: ['Medium of exchange & double coincidence', 'Formal vs Informal credit', 'Self Help Groups (SHGs) for poor'],
    lessons: [],
  },
  'globalisation': {
    subject: 'Social Science',
    title: 'Globalisation and the Indian Economy',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Production across countries, MNCs, integration of markets, factors enabling globalisation, and WTO.',
    topics: ['Role of MNCs', 'Factors enabling Globalisation', 'Fair Globalisation demands'],
    lessons: [],
  },

  // Health and Physical Education Chapters
  'health-and-diseases': {
    subject: 'Health and Physical Education',
    title: 'Health and Diseases',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Learn about community health, communicable and non-communicable diseases, and personal hygiene.',
    topics: ['Communicable disease prevention', 'Personal hygiene guidelines', 'Immunization schedules'],
    lessons: [],
  },
  'physical-fitness-and-wellness': {
    subject: 'Health and Physical Education',
    title: 'Physical Fitness and Wellness',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Understand components of physical fitness, wellness habits, and healthy lifestyles.',
    topics: ['Cardiovascular fitness', 'Strength & flexibility routines', 'Stress management through sports'],
    lessons: [],
  },
  'sports-and-games': {
    subject: 'Health and Physical Education',
    title: 'Sports and Games',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Introduction to major rules, techniques, and safety in team sports and indoor games.',
    topics: ['Team sports rules', 'Fair play values', 'Safety equipment usage'],
    lessons: [],
  },
  'nutrition-and-diet': {
    subject: 'Health and Physical Education',
    title: 'Nutrition and Diet',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Balanced diet, macro and micro nutrients, dietary requirements for growing adolescents.',
    topics: ['Balanced diet components', 'Adolescent growth calories', 'Avoiding junk food hazards'],
    lessons: [],
  },
  'first-aid-and-safety': {
    subject: 'Health and Physical Education',
    title: 'Safety Education and First Aid',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Basic first aid skills, handling sports injuries, and safety protocols in daily life.',
    topics: ['Basic life support & CPR', 'Treating sprains/cuts', 'Emergency contact protocols'],
    lessons: [],
  },
};

const lessonDirectories: Partial<Record<keyof typeof chapters, string>> = {
  'real-numbers': path.join(process.cwd(), 'content', 'real-numbers', 'lessons'),
  'chemical-reactions-and-equations': path.join(
    process.cwd(),
    'content',
    'chemical-reactions-and-equations',
    'lessons',
  ),
  'acids-bases-and-salts': path.join(process.cwd(), 'content', 'acids-bases-and-salts', 'lessons'),
  'metals-and-non-metals': path.join(process.cwd(), 'content', 'metals-and-non-metals', 'lessons'),
  'carbon-and-its-compounds': path.join(process.cwd(), 'content', 'carbon-and-its-compounds', 'lessons'),
  'life-processes': path.join(process.cwd(), 'content', 'life-processes', 'lessons'),
  'control-and-coordination': path.join(process.cwd(), 'content', 'control-and-coordination', 'lessons'),
  'two-stories-about-flying': path.join(process.cwd(), 'content', 'two-stories-about-flying', 'lessons'),
};

// Directory for quiz markdown (shared per chapter)
const quizDirectories: Partial<Record<keyof typeof chapters, string>> = {
  'real-numbers': path.join(process.cwd(), 'content', 'real-numbers', 'lessons'),
  polynomials: path.join(process.cwd(), 'content', 'polynomials', 'lessons'),
  'pair-of-linear-equations-in-two-variables': path.join(
    process.cwd(),
    'content',
    'pair-of-linear-equations-in-two-variables',
    'lessons',
  ),
  'quadratic-equations': path.join(process.cwd(), 'content', 'quadratic-equations', 'lessons'),
  'arithmetic-progressions': path.join(process.cwd(), 'content', 'arithmetic-progressions', 'lessons'),
  triangles: path.join(process.cwd(), 'content', 'triangles', 'lessons'),
  'coordinate-geometry': path.join(process.cwd(), 'content', 'coordinate-geometry', 'lessons'),
  'introduction-to-trigonometry': path.join(process.cwd(), 'content', 'introduction-to-trigonometry', 'lessons'),
  'some-applications-of-trigonometry': path.join(
    process.cwd(),
    'content',
    'some-applications-of-trigonometry',
    'lessons',
  ),
  circles: path.join(process.cwd(), 'content', 'circles', 'lessons'),
  'areas-related-to-circles': path.join(process.cwd(), 'content', 'areas-related-to-circles', 'lessons'),
  'surface-areas-and-volumes': path.join(process.cwd(), 'content', 'surface-areas-and-volumes', 'lessons'),
  statistics: path.join(process.cwd(), 'content', 'statistics', 'lessons'),
  probability: path.join(process.cwd(), 'content', 'probability', 'lessons'),
  'chemical-reactions-and-equations': path.join(
    process.cwd(),
    'content',
    'chemical-reactions-and-equations',
    'lessons',
  ),
  'acids-bases-and-salts': path.join(process.cwd(), 'content', 'acids-bases-and-salts', 'lessons'),
  'metals-and-non-metals': path.join(process.cwd(), 'content', 'metals-and-non-metals', 'lessons'),
  'carbon-and-its-compounds': path.join(process.cwd(), 'content', 'carbon-and-its-compounds', 'lessons'),
  'life-processes': path.join(process.cwd(), 'content', 'life-processes', 'lessons'),
  'control-and-coordination': path.join(process.cwd(), 'content', 'control-and-coordination', 'lessons'),
  'how-do-organisms-reproduce': path.join(process.cwd(), 'content', 'how-do-organisms-reproduce', 'lessons'),
  heredity: path.join(process.cwd(), 'content', 'heredity', 'lessons'),
  'light-reflection-and-refraction': path.join(
    process.cwd(),
    'content',
    'light-reflection-and-refraction',
    'lessons',
  ),
  'the-human-eye-and-the-colourful-world': path.join(
    process.cwd(),
    'content',
    'the-human-eye-and-the-colourful-world',
    'lessons',
  ),
  electricity: path.join(process.cwd(), 'content', 'electricity', 'lessons'),
  'magnetic-effects-of-electric-current': path.join(
    process.cwd(),
    'content',
    'magnetic-effects-of-electric-current',
    'lessons',
  ),
  'our-environment': path.join(process.cwd(), 'content', 'our-environment', 'lessons'),
  'a-letter-to-god': path.join(process.cwd(), 'content', 'a-letter-to-god', 'lessons'),
  'from-the-diary-of-anne-frank': path.join(process.cwd(), 'content', 'from-the-diary-of-anne-frank', 'lessons'),
  'glimpses-of-india': path.join(process.cwd(), 'content', 'glimpses-of-india', 'lessons'),
  'madam-rides-the-bus': path.join(process.cwd(), 'content', 'madam-rides-the-bus', 'lessons'),
  'mijbil-the-otter': path.join(process.cwd(), 'content', 'mijbil-the-otter', 'lessons'),
  'nelson-mandela-long-walk-to-freedom': path.join(
    process.cwd(),
    'content',
    'nelson-mandela-long-walk-to-freedom',
    'lessons',
  ),
  'the-proposal': path.join(process.cwd(), 'content', 'the-proposal', 'lessons'),
  'the-sermon-at-benares': path.join(process.cwd(), 'content', 'the-sermon-at-benares', 'lessons'),
  'two-stories-about-flying': path.join(process.cwd(), 'content', 'two-stories-about-flying', 'lessons'),
  'a-question-of-trust': path.join(process.cwd(), 'content', 'a-question-of-trust', 'lessons'),
  'a-triumph-of-surgery': path.join(process.cwd(), 'content', 'a-triumph-of-surgery', 'lessons'),
  'bholi': path.join(process.cwd(), 'content', 'bholi', 'lessons'),
  'footprints-without-feet-story': path.join(process.cwd(), 'content', 'footprints-without-feet-story', 'lessons'),
  'the-necklace': path.join(process.cwd(), 'content', 'the-necklace', 'lessons'),
  'the-thiefs-story': path.join(process.cwd(), 'content', 'the-thiefs-story', 'lessons'),
  'the-book-that-saved-the-earth': path.join(process.cwd(), 'content', 'the-book-that-saved-the-earth', 'lessons'),
  'the-making-of-a-scientist': path.join(process.cwd(), 'content', 'the-making-of-a-scientist', 'lessons'),
  'the-midnight-visitor': path.join(process.cwd(), 'content', 'the-midnight-visitor', 'lessons'),
  'words-and-expressions-a-letter-to-god': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'a-letter-to-god',
    'lessons',
  ),
  'words-and-expressions-from-the-diary-of-anne-frank': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'from-the-diary-of-anne-frank',
    'lessons',
  ),
  'words-and-expressions-glimpses-of-india': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'glimpses-of-india',
    'lessons',
  ),
  'words-and-expressions-madam-rides-the-bus': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'madam-rides-the-bus',
    'lessons',
  ),
  'words-and-expressions-mijbil-the-otter': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'mijbil-the-otter',
    'lessons',
  ),
  'words-and-expressions-nelson-mandela-long-walk-to-freedom': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'nelson-mandela-long-walk-to-freedom',
    'lessons',
  ),
  'words-and-expressions-the-proposal': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'the-proposal',
    'lessons',
  ),
  'words-and-expressions-the-sermon-at-benares': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'the-sermon-at-benares',
    'lessons',
  ),
  'words-and-expressions-two-stories-about-flying': path.join(
    process.cwd(),
    'content',
    'words-and-expressions',
    'two-stories-about-flying',
    'lessons',
  ),
  'rise-of-nationalism-in-europe': path.join(process.cwd(), 'content', 'rise-of-nationalism-in-europe', 'lessons'),
  'nationalism-in-india': path.join(process.cwd(), 'content', 'nationalism-in-india', 'lessons'),
  'making-of-a-global-world': path.join(process.cwd(), 'content', 'making-of-a-global-world', 'lessons'),
  'print-culture': path.join(process.cwd(), 'content', 'print-culture', 'lessons'),
  'resources-and-development': path.join(process.cwd(), 'content', 'resources-and-development', 'lessons'),
  'water-resources': path.join(process.cwd(), 'content', 'water-resources', 'lessons'),
  agriculture: path.join(process.cwd(), 'content', 'agriculture', 'lessons'),
  'minerals-and-energy-resources': path.join(process.cwd(), 'content', 'minerals-and-energy-resources', 'lessons'),
  'power-sharing': path.join(process.cwd(), 'content', 'power-sharing', 'lessons'),
  federalism: path.join(process.cwd(), 'content', 'federalism', 'lessons'),
  'political-parties': path.join(process.cwd(), 'content', 'political-parties', 'lessons'),
  development: path.join(process.cwd(), 'content', 'development', 'lessons'),
  'sectors-of-indian-economy': path.join(process.cwd(), 'content', 'sectors-of-indian-economy', 'lessons'),
  'money-and-credit': path.join(process.cwd(), 'content', 'money-and-credit', 'lessons'),
  globalisation: path.join(process.cwd(), 'content', 'globalisation', 'lessons'),
};



export function getChapter(slug: string): ChapterContent | null {
  return chapters[slug] ?? getGeneratedChapter(slug);
}

export function getAvailableLessons(chapter: ChapterContent) {
  return chapter.lessons.filter((lesson) => Boolean(lesson.fileName));
}

export function getChapterEntries() {
  const entries = new Map<string, ChapterContent>(Object.entries(chapters));

  for (const slug of Object.keys(chapterPacks)) {
    if (!entries.has(slug)) {
      const chapter = getGeneratedChapter(slug);

      if (chapter) {
        entries.set(slug, chapter);
      }
    }
  }

  return Array.from(entries.entries());
}

export function getSubjectSlug(subject: string) {
  return subject.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
}

export function getSubjectEntries(subjectSlug: string) {
  return getChapterEntries().filter(([, chapter]) => getSubjectSlug(chapter.subject) === subjectSlug);
}

export function getCurriculumContentEvidence(): CurriculumContentEvidence {
  const chapterPacks: CurriculumContentEvidence['chapterPacks'] = {};
  const availableLessonSlugs: CurriculumContentEvidence['availableLessonSlugs'] = {};

  for (const [slug, chapter] of getChapterEntries()) {
    chapterPacks[slug] = hasChapterPack(slug);
    availableLessonSlugs[slug] = getAvailableLessons(chapter).map(
      (lesson) => lesson.slug,
    );
  }

  return {
    chapterPacks,
    availableLessonSlugs,
  };
}

export function hasChapterPack(slug: string) {
  return slug in chapterPacks;
}

export function getChapterPackContent(chapterSlug: string): ChapterPackContent | null {
  const chapter = getChapter(chapterSlug);
  const pack = chapterPacks[chapterSlug as keyof typeof chapterPacks];

  if (!chapter || !pack) {
    return null;
  }

  return {
    chapterSlug,
    chapter,
    blocks: parseMarkdown(stripFrontmatter(pack.markdown)),
  };
}

export async function getLessonContent(chapterSlug: string, lessonSlug: string): Promise<LessonContent | null> {
  const chapter = chapters[chapterSlug];

  if (!chapter) {
    return null;
  }

  const lessonIndex = chapter.lessons.findIndex((item) => item.slug === lessonSlug);

  if (lessonIndex === -1) {
    return null;
  }

  const lesson = chapter.lessons[lessonIndex];
  const directory = lessonDirectories[chapterSlug as keyof typeof lessonDirectories];

  if (!directory || !lesson.fileName) {
    return null;
  }

  let raw: string;

  try {
    raw = await fs.readFile(path.join(directory, lesson.fileName), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    throw error;
  }

  const markdown = stripFrontmatter(raw);

  return {
    chapterSlug,
    chapter,
    lesson,
    blocks: parseMarkdown(markdown),
    previousLesson: getAdjacentAvailableLesson(chapter.lessons, lessonIndex, -1),
    nextLesson: getAdjacentAvailableLesson(chapter.lessons, lessonIndex, 1),
  };
}

function getAdjacentAvailableLesson(
  lessons: LessonMeta[],
  lessonIndex: number,
  direction: -1 | 1,
) {
  for (
    let adjacentIndex = lessonIndex + direction;
    adjacentIndex >= 0 && adjacentIndex < lessons.length;
    adjacentIndex += direction
  ) {
    const lesson = lessons[adjacentIndex];

    if (lesson.fileName) {
      return lesson;
    }
  }

  return null;
}

/**
 * Load the chapter‑level quiz markdown.
 * The file is expected at `${quizDirectories[chapterSlug]}/quiz.md`.
 */
export async function getQuizContent(chapterSlug: string): Promise<string | null> {
  const directory =
    quizDirectories[chapterSlug as keyof typeof quizDirectories] ??
    path.join(process.cwd(), 'content', chapterSlug, 'lessons');
  const quizPath = path.join(directory, 'quiz.md');
  try {
    const raw = await fs.readFile(quizPath, 'utf8');
    return stripFrontmatter(raw);
  } catch (e) {
    return null;
  }
}

function stripFrontmatter(source: string) {
  if (!source.startsWith('---')) {
    return source;
  }

  const end = source.indexOf('\n---', 3);

  if (end === -1) {
    return source;
  }

  return source.slice(end + 4).trim();
}

function getGeneratedChapter(slug: string): ChapterContent | null {
  const pack = chapterPacks[slug as keyof typeof chapterPacks];

  if (!pack) {
    return null;
  }

  const markdown = stripFrontmatter(pack.markdown);
  const summary =
    markdown
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find((block) => block && !block.startsWith('#') && !block.startsWith('-')) ??
    `Chapter notes for ${pack.title}.`;

  return {
    subject: pack.subject,
    title: pack.title,
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Read the chapter notes and revise the quick summary.',
    summary,
    lessons: [],
  };
}

export function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listType: 'unordered-list' | 'ordered-list' | null = null;
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ').trim() });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) {
      listType = null;
      listItems = [];
      return;
    }

    blocks.push({ type: listType, items: [...listItems] });
    listType = null;
    listItems = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }

    if (/^##\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    if (/^#\s+/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '') });
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      flushParagraph();

      if (listType && listType !== 'unordered-list') {
        flushList();
      }

      listType = 'unordered-list';
      listItems.push(trimmed.replace(/^-\s+/, ''));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();

      if (listType && listType !== 'ordered-list') {
        flushList();
      }

      listType = 'ordered-list';
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      continue;
    }

    if (/^`.*`$/.test(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'code', text: trimmed.slice(1, -1) });
      continue;
    }

    flushList();
    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}
