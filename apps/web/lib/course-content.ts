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
  | { type: 'table'; headers: string[]; rows: string[][] }
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
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Complete one proof and three prime-factor questions',
    summary:
      'Follow the current NCERT path from unique prime factorisation through HCF, LCM and irrationality proofs, then finish every printed exercise.',
    topics: [
      '1.1 Introduction',
      '1.2 The Fundamental Theorem of Arithmetic',
      '1.3 Revisiting Irrational Numbers',
      '1.4 Summary',
    ],
    lessons: [
      {
        slug: 'fundamental-theorem-of-arithmetic',
        fileName: '02-fundamental-theorem-of-arithmetic.md',
        title: '1.1-1.2 The Fundamental Theorem of Arithmetic',
        type: 'Core concept and worked examples',
        minutes: 38,
        free: true,
        preview: 'Use unique prime factorisation for HCF, LCM, ending-digit reasoning and the theorem needed for irrationality proofs.',
      },
      {
        slug: 'irrational-numbers',
        fileName: '04-irrational-numbers.md',
        title: '1.3 Revisiting Irrational Numbers',
        type: 'Proof and reasoning lesson',
        minutes: 32,
        free: true,
        preview: 'Write complete contradiction proofs for square roots and rational-irrational combinations.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '06-ncert-exercises-and-revision.md',
        title: 'NCERT Exercises and Chapter Revision',
        type: 'Textbook practice',
        minutes: 55,
        free: true,
        preview: 'Attempt both NCERT exercises before checking the factorisation, HCF-LCM and proof answers.',
      },
      {
        slug: 'euclid-division-lemma',
        fileName: '01-euclid-division-lemma.md',
        title: 'Support - Euclid Division Lemma',
        type: 'Unnumbered support concept',
        minutes: 8,
        free: true,
        preview: 'Review the Class IX division algorithm without treating it as current Chapter 1 board scope.',
      },
      {
        slug: 'decimal-expansion-of-rational-numbers',
        fileName: '05-decimal-expansion-of-rational-numbers.md',
        title: 'Support - Decimal Expansion of Rational Numbers',
        type: 'Unnumbered support concept',
        minutes: 7,
        free: true,
        preview: 'Review the denominator test without treating decimal expansion as current Chapter 1 board scope.',
      },
    ],
  },
  'polynomials': {
    subject: 'Mathematics',
    title: 'Polynomials',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Read one graph and verify one zeroes-coefficients relation',
    summary: 'Read zeroes from polynomial graphs and connect the zeroes of a quadratic polynomial with its coefficients.',
    topics: ['2.1 Introduction', '2.2 Geometrical Meaning of the Zeroes of a Polynomial', '2.3 Relationship between Zeroes and Coefficients of a Polynomial', '2.4 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '2.1-2.4 Polynomials', type: 'Core concepts and examples', minutes: 52, free: true, preview: 'Connect x-axis intersections with zeroes, then verify the quadratic sum and product relations.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 48, free: false, preview: 'Attempt both NCERT exercises, including graph reading and polynomial construction from sum and product.' },
    ],
  },
  'pair-of-linear-equations-in-two-variables': {
    subject: 'Mathematics',
    title: 'Pair of Linear Equations in Two Variables',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Classify one pair and solve one word problem',
    summary: 'Interpret intersecting, coincident and parallel lines, then solve pairs by substitution and elimination.',
    topics: ['3.1 Introduction', '3.2 Graphical Method of Solution of a Pair of Linear Equations', '3.3 Algebraic Methods of Solving a Pair of Linear Equations', '3.3.1 Substitution Method', '3.3.2 Elimination Method', '3.4 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '3.1-3.4 Pair of Linear Equations in Two Variables', type: 'Core concepts and methods', minutes: 72, free: true, preview: 'Link graphs and coefficient ratios with the three solution cases, then solve by substitution and elimination.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 90, free: false, preview: 'Work through all three NCERT exercises, including graphs, consistency and situational models.' },
    ],
  },
  'quadratic-equations': {
    subject: 'Mathematics',
    title: 'Quadratic Equations',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Solve one quadratic and classify another by its discriminant',
    summary: 'Form quadratic equations, solve real roots by factorisation or formula, and use the discriminant to read their nature.',
    topics: ['4.1 Introduction', '4.2 Quadratic Equations', '4.3 Solution of a Quadratic Equation by Factorisation', '4.4 Nature of Roots', '4.5 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '4.1-4.5 Quadratic Equations', type: 'Core concepts and methods', minutes: 62, free: true, preview: 'Move from real-life models to factorisation, the quadratic formula and the discriminant.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 80, free: false, preview: 'Practise every NCERT exercise family and reject roots that do not fit a real situation.' },
    ],
  },
  'arithmetic-progressions': {
    subject: 'Mathematics',
    title: 'Arithmetic Progressions',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Find one nth term and one finite sum',
    summary: 'Recognise a fixed-difference pattern, jump to its nth term, and find the sum of its first n terms.',
    topics: ['5.1 Introduction', '5.2 Arithmetic Progressions', '5.3 nth Term of an AP', '5.4 Sum of First n Terms of an AP', '5.5 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '5.1-5.5 Arithmetic Progressions', type: 'Core concepts and examples', minutes: 74, free: true, preview: 'Use the common difference to find terms, membership, finite sums and daily-life applications.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 115, free: false, preview: 'Cover Exercises 5.1-5.3 and keep the printed optional Exercise 5.4 clearly separate.' },
    ],
  },
  'triangles': {
    subject: 'Mathematics',
    title: 'Triangles',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Complete one BPT proof and one similarity match',
    summary: 'Study similar figures, the Basic Proportionality Theorem and the AAA/AA, SSS and SAS criteria.',
    topics: ['6.1 Introduction', '6.2 Similar Figures', '6.3 Similarity of Triangles', '6.4 Criteria for Similarity of Triangles', '6.5 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '6.1-6.5 Triangles', type: 'Theorems, activities and proofs', minutes: 96, free: true, preview: 'Follow all six NCERT activities through BPT, its converse and the three similarity criteria.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook proof practice', minutes: 135, free: false, preview: 'Use the printed diagrams and stable vertex correspondence across all three NCERT exercises.' },
    ],
  },
  'coordinate-geometry': {
    subject: 'Mathematics',
    title: 'Coordinate Geometry',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Find one distance and one internal division point',
    summary: 'Use Pythagoras for coordinate distance and similarity for internal division and midpoint coordinates.',
    topics: ['7.1 Introduction', '7.2 Distance Formula', '7.3 Section Formula', '7.4 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '7.1-7.4 Coordinate Geometry', type: 'Formula derivation and examples', minutes: 60, free: true, preview: 'Measure distance, derive the internal section formula and use midpoint as its 1:1 case.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 85, free: false, preview: 'Complete both NCERT exercises without restoring coordinate-triangle area as core scope.' },
    ],
  },
  'introduction-to-trigonometry': {
    subject: 'Mathematics',
    title: 'Introduction to Trigonometry',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Label one triangle and prove one identity',
    summary: 'Define the six ratios, learn exact standard-angle values, and simplify with the three Pythagorean identities.',
    topics: ['8.1 Introduction', '8.2 Trigonometric Ratios', '8.3 Trigonometric Ratios of Some Specific Angles', '8.4 Trigonometric Identities', '8.5 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '8.1-8.5 Introduction to Trigonometry', type: 'Core ratios, values and identities', minutes: 88, free: true, preview: 'Name sides from the reference angle, master Table 8.1 and derive the three identities.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook practice', minutes: 110, free: false, preview: 'Practise ratios, exact values and identity proofs across Exercises 8.1-8.3.' },
    ],
  },
  'some-applications-of-trigonometry': {
    subject: 'Mathematics',
    title: 'Some Applications of Trigonometry',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Draw and solve one height-distance diagram',
    summary: 'Model line of sight, elevation and depression with at most two right triangles to find heights and distances.',
    topics: ['9.1 Heights and Distances', '9.2 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '9.1-9.2 Some Applications of Trigonometry', type: 'Diagram-led applications', minutes: 62, free: true, preview: 'Translate towers, shadows, bridges and balloons into one or two labelled right triangles.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook application practice', minutes: 95, free: false, preview: 'Work through all fifteen NCERT height-and-distance settings with a consistent diagram method.' },
    ],
  },
  'circles': {
    subject: 'Mathematics',
    title: 'Circles',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Use both tangent theorems in one diagram',
    summary: 'Understand tangent position, radius-perpendicular contact and equal tangent lengths from an external point.',
    topics: ['10.1 Introduction', '10.2 Tangent to a Circle', '10.3 Number of Tangents from a Point on a Circle', '10.4 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '10.1-10.4 Circles', type: 'Activities, theorems and examples', minutes: 66, free: true, preview: 'Follow Activities 1-3 and prove the radius-perpendicular and equal-tangents theorems.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook proof practice', minutes: 90, free: false, preview: 'Use every printed figure to practise tangent lengths, angles and circumscribed shapes.' },
    ],
  },
  'areas-related-to-circles': {
    subject: 'Mathematics',
    title: 'Areas Related to Circles',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Solve one sector and one segment area',
    summary: 'Use central-angle fractions for arcs and sectors, then subtract the matching triangle for a segment.',
    topics: ['11.1 Areas of Sector and Segment of a Circle', '11.2 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '11.1-11.2 Areas Related to Circles', type: 'Formula and region lesson', minutes: 54, free: true, preview: 'Distinguish sectors and segments and build the correct area expression before calculating.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook mensuration practice', minutes: 78, free: false, preview: 'Complete all fourteen NCERT tasks from clock sweeps to wipers, brooches and grazing regions.' },
    ],
  },
  'surface-areas-and-volumes': {
    subject: 'Mathematics',
    title: 'Surface Areas and Volumes',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Mark hidden faces and solve one combined solid',
    summary: 'Add exposed surfaces and occupied volumes of prescribed combined solids while handling hidden faces and cavities correctly.',
    topics: ['12.1 Introduction', '12.2 Surface Area of a Combination of Solids', '12.3 Volume of a Combination of Solids', '12.4 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '12.1-12.4 Surface Areas and Volumes', type: 'Combined-solid concepts and examples', minutes: 72, free: true, preview: 'Separate surface from volume, remove hidden faces and handle hollows or depressions honestly.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook mensuration practice', minutes: 105, free: false, preview: 'Complete both NCERT exercises without restoring frustum as current core scope.' },
    ],
  },
  'statistics': {
    subject: 'Mathematics',
    title: 'Statistics',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Complete one grouped table and identify the correct class',
    summary: 'Calculate grouped mean by three methods, mode from a modal class, and median from cumulative frequency.',
    topics: ['13.1 Introduction', '13.2 Mean of Grouped Data', '13.3 Mode of Grouped Data', '13.4 Median of Grouped Data', '13.5 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '13.1-13.5 Statistics', type: 'Grouped-data methods and activities', minutes: 105, free: true, preview: 'Build the correct working tables for mean, mode and median and choose the right measure for a situation.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook data practice', minutes: 135, free: false, preview: 'Cover all three NCERT exercises while keeping ogive construction outside active core scope.' },
    ],
  },
  'probability': {
    subject: 'Mathematics',
    title: 'Probability',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Build one sample space and solve one complement event',
    summary: 'Count favourable outcomes inside a complete equally likely sample space and use complements for not-events.',
    topics: ['14.1 Probability - A Theoretical Approach', '14.2 Summary'],
    lessons: [
      { slug: 'core-notes', fileName: '01-core-notes.md', title: '14.1-14.2 Probability', type: 'Core counting and examples', minutes: 72, free: true, preview: 'Build coin, die, card and two-dice sample spaces and connect events with complements.' },
      { slug: 'ncert-exercises-and-revision', fileName: '02-ncert-exercises-and-revision.md', title: 'NCERT Exercises and Chapter Revision', type: 'Textbook probability practice', minutes: 120, free: false, preview: 'Work through all twenty-five NCERT exercise questions and their counting traps.' },
    ],
  },
  'chemical-reactions-and-equations': {
    subject: 'Science',
    title: 'Chemical Reactions and Equations',
    progress: 0,
    mastery: 'Notes live',
    streakTask: 'Finish one lesson note and balance 3 equations without hints',
    summary:
      'Six NCERT-sequenced lessons plus three board-exam supplements teach the textbook completely, then add verified previous-year practice, marking-point answers, and two independent readiness checks.',
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
          'Read reactions as reactants, products, and formula equations before learning to balance them.',
      },
      {
        slug: 'balancing-equations',
        fileName: '02-balancing-equations.md',
        title: '1.1.2 Balanced Chemical Equations',
        type: 'Guided balancing practice',
        minutes: 40,
        free: true,
        preview:
          'Use conservation of mass, coefficients, and a repeatable atom-counting method to balance equations safely.',
      },
      {
        slug: 'combination-and-decomposition-reactions',
        fileName: '03-combination-and-decomposition-reactions.md',
        title: '1.2 Types of Chemical Reactions - 1.2.1 Combination and 1.2.2 Decomposition',
        type: 'Visual explainer',
        minutes: 30,
        free: true,
        preview:
          'Learn how combination and decomposition reactions work, plus the difference between thermal, electrolytic, and photolytic breakdown.',
      },
      {
        slug: 'displacement-and-double-displacement-reactions',
        fileName: '04-displacement-and-double-displacement-reactions.md',
        title: '1.2.3 Displacement and 1.2.4 Double Displacement Reactions',
        type: 'Activity breakdown',
        minutes: 18,
        free: true,
        preview:
          'Use relative reactivity and ion exchange to spot displacement, double displacement, and precipitate-forming reactions.',
      },
      {
        slug: 'oxidation-and-reduction',
        fileName: '05-oxidation-and-reduction.md',
        title: '1.2.5 Oxidation and Reduction; 1.3 Effects of Oxidation in Everyday Life',
        type: 'Revision sprint',
        minutes: 18,
        free: true,
        preview:
          'Revise oxidation, reduction, redox, corrosion, and rancidity with prevention methods and quick examples.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '06-ncert-exercises-and-revision.md',
        title: 'NCERT Chapter Exercises and Revision',
        type: 'Exam practice',
        minutes: 55,
        free: true,
        preview: 'Attempt all twenty NCERT exercises, reveal concise answers, and finish with a repeatable revision ladder.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '07-board-exam-practice.md',
        title: 'Board Exam Practice - Verified Previous-Year Questions',
        type: 'Board exam supplement',
        minutes: 90,
        free: true,
        preview:
          'Practise visually verified board questions from 2023-2026, learn how marking points are earned, and close the oxidising-agent and reducing-agent gap.',
      },
      {
        slug: 'board-readiness-diagnostic',
        fileName: '08-board-readiness-diagnostic.md',
        title: 'Board Readiness Diagnostic - 30 Marks',
        type: 'Timed assessment',
        minutes: 38,
        free: true,
        preview:
          'Attempt a 30-mark mixed-format paper without notes, then use the hidden marking guide to identify the exact skill that needs revision.',
      },
      {
        slug: 'board-readiness-diagnostic-b',
        fileName: '09-board-readiness-diagnostic-b.md',
        title: 'Board Readiness Diagnostic B - Transfer Check - 20 Marks',
        type: 'Transfer assessment',
        minutes: 27,
        free: true,
        preview:
          'Use a second unseen paper to test electrolysis ratios, unfamiliar redox agents, observations, and complete equations without memorising Diagnostic A.',
      },
    ],
  },
  'acids-bases-and-salts': {
    subject: 'Science',
    title: 'Acids, Bases and Salts',
    progress: 18,
    mastery: 'Notes live',
    streakTask: 'Interpret one NCERT activity and answer 3 quick practice questions',
    summary:
      'Five canonical resources follow NCERT Chapter 2 from indicators through salts, all 15 exercises, and both group activities; a separate verified board-practice supplement teaches full-mark response writing.',
    topics: [
      '2.1 Understanding the chemical properties of acids and bases',
      '2.2 What do all acids and all bases have in common?',
      '2.3 How strong are acid or base solutions?',
      '2.4 More about salts',
    ],
    lessons: [
      {
        slug: 'indicators-and-neutralisation',
        fileName: '01-indicators-and-neutralisation.md',
        title: '2.1 Understanding the Chemical Properties of Acids and Bases',
        type: 'Activity-based lesson',
        minutes: 24,
        free: true,
        preview:
          'Use litmus, turmeric, methyl orange, phenolphthalein, onion, vanilla, and clove to identify acids and bases safely.',
      },
      {
        slug: 'chemical-properties-of-acids-and-bases',
        fileName: '02-chemical-properties-of-acids-and-bases.md',
        title: '2.1.2-2.1.6 Reactions of Acids and Bases',
        type: 'Activity breakdown',
        minutes: 38,
        free: false,
        preview:
          'Connect gas tests, precipitates, colour changes, neutralisation, and oxide nature with balanced equations.',
      },
      {
        slug: 'ph-and-ions-in-solution',
        fileName: '03-ph-and-ions-in-solution.md',
        title: '2.2-2.3.1 Ions, Strength and pH',
        type: 'Concept explainer',
        minutes: 46,
        free: false,
        preview:
          'Explain aqueous ions, conductivity, dilution safety, pH strength, and everyday pH applications.',
      },
      {
        slug: 'salts-and-daily-life-uses',
        fileName: '04-salts-and-daily-life-uses.md',
        title: '2.4 More about Salts',
        type: 'Concept and application lesson',
        minutes: 42,
        free: false,
        preview:
          'Trace common salt into chlor-alkali products, baking soda, washing soda, bleaching powder, and Plaster of Paris.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '05-ncert-exercises-and-revision.md',
        title: 'NCERT Exercises and Chapter Revision',
        type: 'Textbook practice',
        minutes: 62,
        free: false,
        preview:
          'Attempt all 15 NCERT exercises and interpret both end-of-chapter group activities before checking complete answers.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '06-board-exam-practice.md',
        title: 'Board Exam Practice - Verified Questions',
        type: 'Board exam practice',
        minutes: 75,
        free: false,
        preview:
          'Write 11 verified PYQs and the latest official SQP case question, then compare every response with complete platform marking points.',
      },
    ],
  },
  'metals-and-non-metals': {
    subject: 'Science',
    title: 'Metals and Non-metals',
    progress: 0,
    mastery: 'Textbook path live',
    streakTask: 'Write one activity-series prediction and one extraction decision',
    summary:
      'The complete 2026-27 NCERT Chapter 3 path covers every numbered section, Activity 3.1-3.14, source table and question block, metallurgy, corrosion, and all 16 exercises.',
    topics: [
      '3.1 Physical Properties',
      '3.2 Chemical properties of metals',
      '3.3 How do metals and non-metals react?',
      '3.4 Occurrence of Metals',
      '3.5 Corrosion',
    ],
    lessons: [
      {
        slug: 'physical-properties',
        fileName: '01-physical-properties.md',
        title: '3.1 Physical Properties - 3.1.1 Metals',
        type: 'Virtual lab note',
        minutes: 24,
        free: true,
        preview:
          'Use Activities 3.1-3.4 to distinguish lustre, hardness, malleability and ductility without losing the textbook safety rules.',
      },
      {
        slug: 'thermal-conductivity-and-conductivity',
        fileName: '02-thermal-conductivity-and-conductivity.md',
        title: '3.1.1 Metals continued - 3.1.2 Non-metals',
        type: 'Activity breakdown',
        minutes: 31,
        free: false,
        preview:
          'Complete Activities 3.5-3.8, Table 3.1, the physical-property exceptions and the first NCERT Questions block.',
      },
      {
        slug: 'oxides-and-chemical-properties',
        fileName: '03-oxides-and-chemical-properties.md',
        title: '3.2 Chemical Properties - 3.2.1 Metals burnt in air',
        type: 'Concept explainer',
        minutes: 30,
        free: false,
        preview:
          'Compare metals in oxygen, prove amphoteric behaviour and understand why anodising protects aluminium.',
      },
      {
        slug: 'reactivity-series-and-displacement',
        fileName: '04-reactivity-series-and-displacement.md',
        title: '3.2.2-3.2.5 Reactions with water, acids and salts',
        type: 'Activity breakdown',
        minutes: 49,
        free: false,
        preview:
          'Use Activities 3.10-3.12 and the complete activity series to predict every water, acid and displacement reaction.',
      },
      {
        slug: 'ionic-compounds',
        fileName: '05-ionic-compounds.md',
        title: '3.3 How do Metals and Non-metals React?',
        type: 'Board scoring lesson',
        minutes: 43,
        free: false,
        preview:
          'Show electron transfer, form NaCl and MgCl2, and explain every ionic-compound property from Activities and Tables 3.3-3.4.',
      },
      {
        slug: 'corrosion-and-prevention',
        fileName: '06-corrosion-and-prevention.md',
        title: '3.4 Occurrence of Metals - 3.5 Corrosion',
        type: 'Textbook deep dive',
        minutes: 72,
        free: false,
        preview:
          'Follow ore through extraction and electrolytic refining, then master rusting, prevention, alloys and every source knowledge box.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '07-ncert-exercises-and-revision.md',
        title: 'NCERT Exercises and Chapter Revision',
        type: 'Textbook practice',
        minutes: 76,
        free: false,
        preview:
          'Attempt all 16 NCERT exercises before checking complete scoring answers, reason chains and the chapter equation bank.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '08-board-exam-practice.md',
        title: 'Board Exam Practice - Verified Questions',
        type: 'Board exam practice',
        minutes: 92,
        free: false,
        preview:
          'Write 13 verified PYQs and two current official SQP tasks spanning every Chapter 3 board-demand family.',
      },
    ],
  },
  'carbon-and-its-compounds': {
    subject: 'Science',
    title: 'Carbon and its Compounds',
    progress: 32,
    mastery: 'NCERT and board audit live',
    streakTask: 'Write one reaction with conditions and solve one structure question',
    summary:
      'Nine source-audited resources cover every NCERT section, Activity 4.1-4.12, Figure 4.1-4.13, all in-text questions and exercises, and verified board-demand families.',
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
        title: '4.2.2-4.2.4 Hydrocarbons and homologous series',
        type: 'Concept explainer',
        minutes: 11,
        free: false,
        preview:
          'Separate alkanes, alkenes, alkynes, saturated compounds, unsaturated compounds, and homologous series.',
      },
      {
        slug: 'functional-groups-and-naming',
        fileName: '04-functional-groups-and-naming.md',
        title: '4.2.3 and 4.2.5 Functional groups and nomenclature',
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
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '08-ncert-exercises-and-revision.md',
        title: 'NCERT Questions, Exercises and Chapter Revision',
        type: 'NCERT answer lab',
        minutes: 82,
        free: false,
        preview:
          'Answer every in-text question and Exercise 1-15 with source-aligned structures, equations, tests and marking checks.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '09-board-exam-practice.md',
        title: 'Board Exam Practice - Verified Demand Families',
        type: 'Board exam practice',
        minutes: 92,
        free: false,
        preview:
          'Practise verified 2023-2026 PYQs and the latest official CBSE sample-paper hydrocarbon task.',
      },
    ],
  },
  'life-processes': {
    subject: 'Science',
    title: 'Life Processes',
    progress: 36,
    mastery: 'NCERT and board audit live',
    streakTask: 'Draw one life-process diagram and write one full-mark pathway answer',
    summary:
      'Eight source-audited resources cover every NCERT section, Activity 5.1-5.8, Figure 5.1-5.14, all in-text questions and exercises, and verified 2023-2026 board-demand families.',
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
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '07-ncert-exercises-and-revision.md',
        title: 'NCERT Questions, Exercises and Chapter Revision',
        type: 'NCERT answer lab',
        minutes: 85,
        free: false,
        preview:
          'Answer every in-text question and Exercise 1-13 with complete diagrams, comparisons, pathways, activities, and marking points.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '08-board-exam-practice.md',
        title: 'Board Exam Practice - Verified Demand Families',
        type: 'Board exam practice',
        minutes: 95,
        free: false,
        preview:
          'Practise recurring 2023-2026 board families, including the latest verified 5-mark stomata, photosynthesis, and nephron pattern.',
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
      'Seven published resources follow NCERT Chapter 6 exactly, then consolidate every in-text question and exercise before teaching full-mark patterns from the local 2023-2026 CBSE paper archive.',
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
          'Connect adrenaline, thyroxin, growth hormone, insulin, feedback, and nervous-versus-hormonal control in one clean pass.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '06-ncert-exercises-and-revision.md',
        title: 'Chapter 6 NCERT Exercises and Revision',
        type: 'NCERT answer lab',
        minutes: 50,
        free: false,
        preview:
          'Revisit Activities 6.1-6.4, Figures 6.1-6.7, Table 6.1, all 14 in-text questions, and Exercises 1-12 with complete answers.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '07-board-exam-practice.md',
        title: 'Board Exam Practice and Full-Mark Answer Patterns',
        type: 'Board exam practice',
        minutes: 95,
        free: false,
        preview:
          'Practise all recurring 2023-2026 demand families, including the latest verified plant-movement case and official marking points.',
      },
    ],
  },
  'how-do-organisms-reproduce': {
    subject: 'Science',
    title: 'How do Organisms Reproduce?',
    progress: 12,
    mastery: 'Notes live',
    streakTask: 'Draw one reproduction diagram and solve 3 board questions',
    summary:
      'Ten published resources follow all NCERT Chapter 7 sections, Activities 7.1-7.7, Figures 7.1-7.11, in-text questions and Exercises 1-11, then close recurring 2023-2026 board demands.',
    topics: [
      '7.1 DNA Copying and Variation',
      '7.2 Modes of Reproduction Used by Single Organisms',
      '7.3.1 Why the Sexual Mode of Reproduction?',
      '7.3.2 Sexual Reproduction in Flowering Plants',
      '7.3.3 Reproduction in Human Beings',
      '7.3.3 (d) Reproductive Health',
    ],
    lessons: [
      {
        slug: 'dna-copying-and-variation',
        fileName: '01-dna-copying-and-variation.md',
        title: '7.1 Do Organisms Create Exact Copies of Themselves?',
        type: 'Concept explainer',
        minutes: 18,
        free: true,
        preview: 'Connect DNA, proteins, body design, copying variation, niches, and species survival.',
      },
      {
        slug: 'fission-fragmentation-regeneration-and-budding',
        fileName: '02-fission-fragmentation-regeneration-and-budding.md',
        title: '7.2.1-7.2.4 Fission, Fragmentation, Regeneration and Budding',
        type: 'Visual process lesson',
        minutes: 26,
        free: false,
        preview: 'Compare every NCERT organism-mode pair without confusing Spirogyra, Hydra, Planaria, or Plasmodium.',
      },
      {
        slug: 'vegetative-propagation-and-spore-formation',
        fileName: '03-vegetative-propagation-and-spore-formation.md',
        title: '7.2.5-7.2.6 Vegetative Propagation and Spore Formation',
        type: 'Activity lab',
        minutes: 24,
        free: false,
        preview: 'Use potato eyes, Bryophyllum buds, money-plant nodes, tissue culture, and Rhizopus spores.',
      },
      {
        slug: 'why-sexual-reproduction',
        fileName: '04-why-sexual-reproduction.md',
        title: '7.3.1 Why the Sexual Mode of Reproduction?',
        type: 'Concept explainer',
        minutes: 18,
        free: false,
        preview: 'See how meiosis, gametes, fertilisation, and variation preserve chromosome number and diversity.',
      },
      {
        slug: 'sexual-reproduction-in-flowering-plants',
        fileName: '05-sexual-reproduction-in-flowering-plants.md',
        title: '7.3.2 Sexual Reproduction in Flowering Plants',
        type: 'Diagram lesson',
        minutes: 28,
        free: false,
        preview: 'Trace flower parts, pollination, pollen-tube growth, fertilisation, seed, fruit, and germination.',
      },
      {
        slug: 'puberty-and-male-reproductive-system',
        fileName: '06-puberty-and-male-reproductive-system.md',
        title: '7.3.3 Puberty and the Male Reproductive System',
        type: 'Diagram lesson',
        minutes: 24,
        free: false,
        preview: 'Learn puberty respectfully and connect every male reproductive organ to its exact function.',
      },
      {
        slug: 'female-reproductive-system-fertilisation-and-menstruation',
        fileName: '07-female-reproductive-system-fertilisation-and-menstruation.md',
        title: '7.3.3 Female System, Fertilisation, Placenta and Menstruation',
        type: 'Board scoring lesson',
        minutes: 30,
        free: false,
        preview: 'Separate fertilisation from implantation and master uterus, placenta, embryo, and menstruation.',
      },
      {
        slug: 'reproductive-health-and-contraception',
        fileName: '08-reproductive-health-and-contraception.md',
        title: '7.3.3 (d) Reproductive Health and Contraception',
        type: 'Health literacy lesson',
        minutes: 24,
        free: false,
        preview: 'Match barriers, pills, Copper-T, vasectomy, and tubectomy to mechanisms, limits, and STI protection.',
      },
      {
        slug: 'ncert-exercises-and-revision',
        fileName: '09-ncert-exercises-and-revision.md',
        title: 'Chapter 7 NCERT Exercises and Revision',
        type: 'NCERT answer lab',
        minutes: 65,
        free: false,
        preview: 'Complete every in-text question, source summary idea, and Exercise 1-11 with full answers.',
      },
      {
        slug: 'board-exam-practice',
        fileName: '10-board-exam-practice.md',
        title: 'Board Exam Practice and Full-Mark Answer Patterns',
        type: 'Board exam practice',
        minutes: 110,
        free: false,
        preview: 'Practise 28 recurring 2023-2026 demand families, including the latest official five-mark patterns.',
      },
    ],
  },
  'heredity': {
    subject: 'Science',
    title: 'Heredity',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Complete the Mendel cross challenge',
    summary: 'Exact NCERT Chapter 8 notes on variation, inherited traits, Mendel’s crosses, trait expression, and sex determination.',
    topics: ['8.1 Accumulation of Variation', '8.2 Heredity', '8.2.1 Inherited Traits', '8.2.2 Mendel’s Contributions', '8.2.3 Trait Expression', '8.2.4 Sex Determination'],
    lessons: [
      { slug: 'accumulation-of-variation', fileName: '01-accumulation-of-variation.md', title: '8.1 Accumulation of Variation During Reproduction', type: 'Concept lesson', minutes: 18, free: true, preview: 'Track how inherited and new variations accumulate and protect a species.' },
      { slug: 'heredity-and-inherited-traits', fileName: '02-heredity-and-inherited-traits.md', title: '8.2 Heredity and 8.2.1 Inherited Traits', type: 'Concept lesson', minutes: 22, free: true, preview: 'Master genes, alleles, genotype, phenotype, and NCERT Activity 8.1.' },
      { slug: 'mendel-monohybrid-cross', fileName: '03-mendel-monohybrid-cross.md', title: '8.2.2 Mendel’s Monohybrid Cross', type: 'Worked genetics lab', minutes: 30, free: false, preview: 'Build TT × tt and Tt × Tt crosses with full-mark ratios and conclusions.' },
      { slug: 'dihybrid-cross', fileName: '04-dihybrid-cross.md', title: '8.2.2 Dihybrid Cross and Independent Inheritance', type: 'Worked genetics lab', minutes: 32, free: false, preview: 'Explain the NCERT RRyy × rrYY cross and the 9:3:3:1 ratio.' },
      { slug: 'trait-expression', fileName: '05-trait-expression.md', title: '8.2.3 How Do These Traits Get Expressed?', type: 'Concept lesson', minutes: 22, free: false, preview: 'Connect gene, protein, growth hormone, chromosome separation, and equal parental contribution.' },
      { slug: 'sex-determination', fileName: '06-sex-determination.md', title: '8.2.4 Sex Determination', type: 'Diagram lesson', minutes: 22, free: false, preview: 'Draw the XX–XY cross and compare genetic and environmental mechanisms.' },
      { slug: 'ncert-exercises-and-revision', fileName: '07-ncert-exercises-and-revision.md', title: 'Chapter 8 NCERT Questions, Exercises and Revision', type: 'NCERT answer lab', minutes: 55, free: false, preview: 'Complete both in-text blocks and all four revised NCERT exercises.' },
      { slug: 'board-exam-practice', fileName: '08-board-exam-practice.md', title: 'Chapter 8 Board Exam Practice and Full-Mark Answer Patterns', type: 'Board exam practice', minutes: 90, free: false, preview: 'Practise 18 recurring heredity demand families from the 2023–2026 archive.' },
    ],
  },
  'light-reflection-and-refraction': {
    subject: 'Science',
    title: 'Light - Reflection and Refraction',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Solve one signed optics numerical',
    summary: 'Exact NCERT Chapter 9 notes on spherical mirrors, refraction, lenses, ray diagrams, formulae, and power.',
    topics: ['9.1 Reflection', '9.2 Spherical Mirrors', '9.3 Refraction of Light'],
    lessons: [
      { slug: 'reflection-and-spherical-mirrors', fileName: '01-reflection-and-spherical-mirrors.md', title: '9.1 Reflection and 9.2 Spherical Mirrors', type: 'Concept lesson', minutes: 25, free: true, preview: 'Learn reflection laws and every spherical-mirror term.' },
      { slug: 'mirror-images-and-ray-diagrams', fileName: '02-mirror-images-and-ray-diagrams.md', title: '9.2.1–9.2.2 Mirror Images and Ray Diagrams', type: 'Diagram lab', minutes: 38, free: false, preview: 'Master both image tables and the four standard mirror rays.' },
      { slug: 'mirror-formula-and-magnification', fileName: '03-mirror-formula-and-magnification.md', title: '9.2.3–9.2.4 Mirror Formula and Magnification', type: 'Numerical lab', minutes: 34, free: false, preview: 'Use Cartesian signs, mirror formula, and magnification safely.' },
      { slug: 'refraction-and-refractive-index', fileName: '04-refraction-and-refractive-index.md', title: '9.3–9.3.2 Refraction and Refractive Index', type: 'Concept and practical', minutes: 34, free: true, preview: 'Explain bending, Snell’s law, the glass slab, and optical density.' },
      { slug: 'spherical-lenses-and-images', fileName: '05-spherical-lenses-and-images.md', title: '9.3.3–9.3.5 Spherical Lenses and Images', type: 'Diagram lab', minutes: 42, free: false, preview: 'Complete lens image tables and standard-ray diagrams.' },
      { slug: 'lens-formula-magnification-power', fileName: '06-lens-formula-magnification-power.md', title: '9.3.6–9.3.8 Lens Formula, Magnification and Power', type: 'Numerical lab', minutes: 38, free: false, preview: 'Calculate lens images and power with correct signs and units.' },
      { slug: 'ncert-exercises-and-revision', fileName: '07-ncert-exercises-and-revision.md', title: 'Chapter 9 NCERT Exercises and Revision', type: 'NCERT answer lab', minutes: 85, free: false, preview: 'Solve all 17 revised NCERT exercises, including every numerical.' },
      { slug: 'board-exam-practice', fileName: '08-board-exam-practice.md', title: 'Chapter 9 Board Exam Practice and Full-Mark Patterns', type: 'Board exam practice', minutes: 120, free: false, preview: 'Practise the recurring diagram, reasoning, and numerical demands.' },
    ],
  },
  'the-human-eye-and-the-colourful-world': {
    subject: 'Science',
    title: 'The Human Eye and the Colourful World',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Diagnose one vision case',
    summary: 'Exact NCERT Chapter 10 notes on the eye, vision defects, prism dispersion, atmospheric refraction, and scattering.',
    topics: ['10.1 Human Eye', '10.2 Defects of Vision', '10.3 Prism', '10.4 Dispersion', '10.5 Atmospheric Refraction', '10.6 Scattering'],
    lessons: [
      { slug: 'human-eye-and-accommodation', fileName: '01-human-eye-and-accommodation.md', title: '10.1 Human Eye and Accommodation', type: 'Diagram lesson', minutes: 28, free: true, preview: 'Label the eye and explain near/distant focusing.' },
      { slug: 'defects-of-vision', fileName: '02-defects-of-vision.md', title: '10.2 Defects of Vision and Correction', type: 'Diagnosis and numerical lab', minutes: 38, free: true, preview: 'Master myopia, hypermetropia, presbyopia, corrections, and powers.' },
      { slug: 'prism-and-dispersion', fileName: '03-prism-and-dispersion.md', title: '10.3–10.4 Prism and Dispersion', type: 'Concept and diagram lesson', minutes: 30, free: false, preview: 'Trace prism rays, VIBGYOR, Newton’s recombination, and rainbow.' },
      { slug: 'atmospheric-refraction', fileName: '04-atmospheric-refraction.md', title: '10.5 Atmospheric Refraction', type: 'Reasoning lesson', minutes: 27, free: false, preview: 'Explain stars, planets, sunrise, sunset, and hot-air wavering.' },
      { slug: 'scattering-of-light', fileName: '05-scattering-of-light.md', title: '10.6 Scattering of Light', type: 'Reasoning lesson', minutes: 27, free: false, preview: 'Explain Tyndall effect, blue sky, red sunset, and dark space sky.' },
      { slug: 'ncert-exercises-and-revision', fileName: '06-ncert-exercises-and-revision.md', title: 'Chapter 10 NCERT Exercises and Revision', type: 'NCERT answer lab', minutes: 65, free: false, preview: 'Answer all 12 exercises with solved correction numericals.' },
      { slug: 'board-exam-practice', fileName: '07-board-exam-practice.md', title: 'Chapter 10 Board Exam Practice and Full-Mark Patterns', type: 'Board exam practice', minutes: 95, free: false, preview: 'Practise 20 recurring diagram, numerical, and reasoning families.' },
    ],
  },
  'electricity': {
    subject: 'Science',
    title: 'Electricity',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Solve one circuit numerical',
    summary: 'Exact NCERT Chapter 11 notes on current, potential difference, Ohm’s law, resistance, combinations, heating, power, and energy.',
    topics: ['11.1 Current', '11.2 Potential Difference', '11.3 Circuit Diagram', '11.4 Ohm’s Law', '11.5 Resistance', '11.6 Resistor Systems', '11.7 Heating', '11.8 Power'],
    lessons: [
      { slug: 'current-circuit-potential-difference', fileName: '01-current-circuit-potential-difference.md', title: '11.1–11.3 Current, Potential Difference and Circuits', type: 'Concept lesson', minutes: 30, free: true, preview: 'Wire current, charge, voltage, ammeter, voltmeter, and symbols correctly.' },
      { slug: 'ohms-law-and-resistance', fileName: '02-ohms-law-and-resistance.md', title: '11.4–11.5 Ohm’s Law and Resistance', type: 'Practical and graph lab', minutes: 38, free: true, preview: 'Read V–I graphs and master R=ρl/A scaling.' },
      { slug: 'resistors-in-series', fileName: '03-resistors-in-series.md', title: '11.6.1 Resistors in Series', type: 'Circuit numerical lab', minutes: 26, free: false, preview: 'Derive series resistance and design target combinations.' },
      { slug: 'resistors-in-parallel', fileName: '04-resistors-in-parallel.md', title: '11.6.2 Resistors in Parallel', type: 'Circuit numerical lab', minutes: 30, free: false, preview: 'Derive parallel resistance and explain domestic wiring.' },
      { slug: 'heating-effect', fileName: '05-heating-effect.md', title: '11.7 Heating Effect of Current', type: 'Applications lesson', minutes: 30, free: false, preview: 'Apply Joule’s law to heaters, filaments, and fuses.' },
      { slug: 'electric-power-and-energy', fileName: '06-electric-power-and-energy.md', title: '11.8 Electric Power and Energy', type: 'Numerical lab', minutes: 30, free: false, preview: 'Interpret ratings and calculate W, J, and kWh.' },
      { slug: 'ncert-exercises-and-revision', fileName: '07-ncert-exercises-and-revision.md', title: 'Chapter 11 NCERT Exercises and Revision', type: 'NCERT answer lab', minutes: 100, free: false, preview: 'Solve all 18 exercises with exact numerical results.' },
      { slug: 'board-exam-practice', fileName: '08-board-exam-practice.md', title: 'Chapter 11 Board Exam Practice and Full-Mark Patterns', type: 'Board exam practice', minutes: 125, free: false, preview: 'Practise 22 recurring circuit, graph, reasoning, and numerical families.' },
    ],
  },
  'magnetic-effects-of-electric-current': {
    subject: 'Science',
    title: 'Magnetic Effects of Electric Current',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Solve one direction-rule case',
    summary: 'Exact NCERT Chapter 12 notes on magnetic fields, current-produced fields, conductor force, and domestic circuit safety.',
    topics: ['12.1 Magnetic Field', '12.2 Current-Produced Field', '12.3 Force on Conductor', '12.4 Domestic Circuits'],
    lessons: [
      { slug: 'magnetic-field-and-lines', fileName: '01-magnetic-field-and-lines.md', title: '12.1 Magnetic Field and Field Lines', type: 'Diagram lesson', minutes: 25, free: true, preview: 'Draw bar-magnet field lines with all scoring properties.' },
      { slug: 'straight-conductor-and-thumb-rule', fileName: '02-straight-conductor-and-thumb-rule.md', title: '12.2–12.2.2 Straight Conductor and Thumb Rule', type: 'Direction lab', minutes: 30, free: true, preview: 'Master concentric fields, dot/cross notation, and the right-hand rule.' },
      { slug: 'circular-loop-and-solenoid', fileName: '03-circular-loop-and-solenoid.md', title: '12.2.3–12.2.4 Loop, Solenoid and Electromagnet', type: 'Concept and diagram lesson', minutes: 30, free: false, preview: 'Explain field addition, poles, uniform field, and electromagnets.' },
      { slug: 'force-on-conductor', fileName: '04-force-on-conductor.md', title: '12.3 Force on a Current-Carrying Conductor', type: 'Direction lab', minutes: 32, free: false, preview: 'Use Fleming’s left hand and solve charged-particle cases.' },
      { slug: 'domestic-electric-circuits', fileName: '05-domestic-electric-circuits.md', title: '12.4 Domestic Electric Circuits', type: 'Safety lesson', minutes: 38, free: false, preview: 'Understand mains, parallel branches, earthing, fuse, overload, and short circuit.' },
      { slug: 'ncert-exercises-and-revision', fileName: '06-ncert-exercises-and-revision.md', title: 'Chapter 12 NCERT Exercises and Revision', type: 'NCERT answer lab', minutes: 60, free: false, preview: 'Answer all nine exercises and every in-text block.' },
      { slug: 'board-exam-practice', fileName: '07-board-exam-practice.md', title: 'Chapter 12 Board Exam Practice and Full-Mark Patterns', type: 'Board exam practice', minutes: 100, free: false, preview: 'Practise 20 recurring magnetic-field, direction, and safety families.' },
    ],
  },
  'our-environment': {
    subject: 'Science',
    title: 'Our Environment',
    progress: 0,
    mastery: 'Chapter pack ready',
    streakTask: 'Solve one 10% energy challenge',
    summary: 'Exact NCERT Chapter 13 notes on ecosystems, food chains, energy flow, biomagnification, ozone, and waste.',
    topics: ['13.1 Ecosystem', '13.1.1 Food Chains and Webs', '13.2 Human Impacts', '13.2.1 Ozone', '13.2.2 Garbage'],
    lessons: [
      { slug: 'ecosystem-components', fileName: '01-ecosystem-components.md', title: '13.1 Ecosystem—What Are Its Components?', type: 'Concept lesson', minutes: 28, free: true, preview: 'Classify abiotic factors, producers, consumers, and decomposers.' },
      { slug: 'food-chains-webs-and-energy-flow', fileName: '02-food-chains-webs-and-energy-flow.md', title: '13.1.1 Food Chains, Webs and Energy Flow', type: 'Concept and numerical lesson', minutes: 38, free: true, preview: 'Build trophic chains and calculate 10% energy transfer.' },
      { slug: 'biological-magnification', fileName: '03-biological-magnification.md', title: 'Biological Magnification in Food Chains', type: 'Reasoning lesson', minutes: 22, free: false, preview: 'Trace persistent pollutants and distinguish concentration from energy.' },
      { slug: 'ozone-layer', fileName: '04-ozone-layer.md', title: '13.2–13.2.1 Human Activities and Ozone', type: 'Environmental reasoning', minutes: 27, free: false, preview: 'Explain O3 formation, UV protection, CFC damage, and controls.' },
      { slug: 'managing-garbage', fileName: '05-managing-garbage.md', title: '13.2.2 Managing the Garbage We Produce', type: 'Action lesson', minutes: 38, free: false, preview: 'Compare waste types and apply segregation, composting, and the waste hierarchy.' },
      { slug: 'ncert-exercises-and-revision', fileName: '06-ncert-exercises-and-revision.md', title: 'Chapter 13 NCERT Exercises and Revision', type: 'NCERT answer lab', minutes: 65, free: false, preview: 'Answer every in-text block and all nine exercises.' },
      { slug: 'board-exam-practice', fileName: '07-board-exam-practice.md', title: 'Chapter 13 Board Exam Practice and Full-Mark Patterns', type: 'Board exam practice', minutes: 95, free: false, preview: 'Practise 22 recurring ecosystem, energy, pollution, ozone, and waste families.' },
    ],
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
        free: true,
        preview:
          'See how family pressure, the mother seagull, and one risky dive turn fear into confidence.',
      },
      {
        slug: 'the-black-aeroplane-storm-and-mystery',
        fileName: '03-the-black-aeroplane-storm-and-mystery.md',
        title: 'The Black Aeroplane: storm and mystery',
        type: 'Suspense reading note',
        minutes: 9,
        free: true,
        preview:
          'Follow the pilot into storm clouds, failed instruments, and the suspense that makes the rescue feel urgent.',
      },
      {
        slug: 'the-black-aeroplane-unknown-helper',
        fileName: '04-the-black-aeroplane-unknown-helper.md',
        title: 'The Black Aeroplane: unknown helper',
        type: 'Inference and theme note',
        minutes: 9,
        free: true,
        preview:
          'Understand the mystery of the black aeroplane, the control room reveal, and how to answer without inventing certainty.',
      },
      {
        slug: 'poems-wild-animals-and-the-ball-poem',
        fileName: '05-poems-wild-animals-and-the-ball-poem.md',
        title: 'Poems: Wild Animals and The Ball Poem',
        type: 'Poem revision note',
        minutes: 10,
        free: true,
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

const chapterPackCache = new Map<string, ChapterPackContent>();
const lessonContentCache = new Map<string, LessonContent>();
const quizContentCache = new Map<string, string>();

export function getChapterPackContent(chapterSlug: string): ChapterPackContent | null {
  if (chapterPackCache.has(chapterSlug)) {
    return chapterPackCache.get(chapterSlug)!;
  }

  const chapter = getChapter(chapterSlug);
  const pack = chapterPacks[chapterSlug as keyof typeof chapterPacks];

  if (!chapter || !pack) {
    return null;
  }

  const content: ChapterPackContent = {
    chapterSlug,
    chapter,
    blocks: parseMarkdown(stripFrontmatter(pack.markdown)),
  };

  chapterPackCache.set(chapterSlug, content);
  return content;
}

export async function getLessonContent(chapterSlug: string, lessonSlug: string): Promise<LessonContent | null> {
  const cacheKey = `${chapterSlug}:${lessonSlug}`;
  if (lessonContentCache.has(cacheKey)) {
    return lessonContentCache.get(cacheKey)!;
  }

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

  const content: LessonContent = {
    chapterSlug,
    chapter,
    lesson,
    blocks: parseMarkdown(markdown),
    previousLesson: getAdjacentAvailableLesson(chapter.lessons, lessonIndex, -1),
    nextLesson: getAdjacentAvailableLesson(chapter.lessons, lessonIndex, 1),
  };

  lessonContentCache.set(cacheKey, content);
  return content;
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
  if (quizContentCache.has(chapterSlug)) {
    return quizContentCache.get(chapterSlug)!;
  }

  const directory =
    quizDirectories[chapterSlug as keyof typeof quizDirectories] ??
    path.join(process.cwd(), 'content', chapterSlug, 'lessons');
  const quizPath = path.join(directory, 'quiz.md');
  try {
    const raw = await fs.readFile(quizPath, 'utf8');
    const content = stripFrontmatter(raw);
    quizContentCache.set(chapterSlug, content);
    return content;
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
  let tableLines: string[] = [];

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

  const flushTable = () => {
    if (tableLines.length < 2) {
      if (tableLines.length === 1) {
        paragraphLines.push(tableLines[0]);
      }
      tableLines = [];
      return;
    }

    const parsedRows = tableLines.map((tableLine) =>
      tableLine
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim()),
    );
    const separatorIndex = parsedRows.findIndex((row) =>
      row.every((cell) => /^:?-{3,}:?$/.test(cell)),
    );

    if (separatorIndex !== 1) {
      paragraphLines.push(...tableLines);
      tableLines = [];
      return;
    }

    blocks.push({
      type: 'table',
      headers: parsedRows[0],
      rows: parsedRows.slice(2),
    });
    tableLines = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    if (/^\|.*\|$/.test(trimmed)) {
      flushParagraph();
      flushList();
      tableLines.push(trimmed);
      continue;
    }

    flushTable();

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

    if (listType && listItems.length > 0) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${trimmed}`;
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph();
  flushList();
  flushTable();

  return blocks;
}
