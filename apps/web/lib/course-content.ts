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
      'Now live with simple-English lesson notes, glossary help, board-style long-division demos, comic recaps, and quick practice for every key concept in Chapter 1.',
    topics: ['Euclid division lemma', 'HCF and LCM', 'Irrational numbers'],
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
    summary: 'Solve quadratic equations using factorization, completing the square, and quadratic formula.',
    topics: ['Factorization method', 'Quadratic formula', 'Nature of roots'],
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
    summary: 'Find distance between points, section formula, and area of triangles on a Cartesian plane.',
    topics: ['Distance formula', 'Section formula', 'Area of triangle'],
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
    progress: 28,
    mastery: 'Getting started',
    streakTask: 'Balance 6 equations without hints',
    summary:
      'Start with reaction signs, formula equations, and guided balancing practice, then use the chapter notes and quiz to revise reaction types.',
    topics: ['Balancing equations', 'Reaction types', 'Oxidation and reduction'],
    lessons: [
      {
        slug: 'chemical-equations',
        fileName: '01-chemical-equations.md',
        title: 'Chemical equations',
        type: 'Concept foundation',
        minutes: 10,
        free: true,
        preview:
          'Read reactions as reactants, products, formula equations, and state symbols before learning to balance them.',
      },
      {
        slug: 'balancing-equations',
        fileName: '02-balancing-equations.md',
        title: 'Balancing equations',
        type: 'Guided balancing practice',
        minutes: 11,
        free: false,
        preview:
          'Use conservation of mass, coefficients, and a repeatable atom-counting method to balance equations safely.',
      },
      {
        slug: 'combination-and-decomposition-reactions',
        fileName: '',
        title: 'Combination and decomposition reactions',
        type: 'Visual explainer',
        minutes: 9,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'displacement-and-double-displacement-reactions',
        fileName: '',
        title: 'Displacement and double displacement reactions',
        type: 'Activity breakdown',
        minutes: 10,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
      {
        slug: 'oxidation-and-reduction',
        fileName: '',
        title: 'Oxidation and reduction',
        type: 'Revision sprint',
        minutes: 8,
        free: false,
        preview: 'Science lesson notes are still being prepared.',
      },
    ],
  },
  'acids-bases-and-salts': {
    subject: 'Science',
    title: 'Acids, Bases and Salts',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Study indicators, chemical properties of acids and bases, pH scale, and salts.',
    topics: ['pH scale in daily life', 'Properties of acids and bases', 'Common salt derivatives'],
    lessons: [],
  },
  'metals-and-non-metals': {
    subject: 'Science',
    title: 'Metals and Non-metals',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Physical and chemical properties of metals, reactivity series, and ionic compounds.',
    topics: ['Reactivity series', 'Properties of metals/non-metals', 'Extraction of metals'],
    lessons: [],
  },
  'carbon-and-its-compounds': {
    subject: 'Science',
    title: 'Carbon and its Compounds',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Covalent bonding, versatile nature of carbon, homologous series, and functional groups.',
    topics: ['Covalent bonding', 'Homologous series', 'Soaps and detergents'],
    lessons: [],
  },
  'life-processes': {
    subject: 'Science',
    title: 'Life Processes',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Explore nutrition, respiration, transportation, and excretion in plants and animals.',
    topics: ['Photosynthesis', 'Human circulatory system', 'Excretion in humans'],
    lessons: [],
  },
  'control-and-coordination': {
    subject: 'Science',
    title: 'Control and Coordination',
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Nervous system, reflex actions, human brain, and plant/animal hormones.',
    topics: ['Nerve cells and reflex arc', 'Human brain structure', 'Endocrine system hormones'],
    lessons: [],
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
    summary: 'Magnetic field lines, solenoid, electromagnetic induction, motor, and generator.',
    topics: ['Solenoid magnetic field', 'Electromagnetic induction', 'Domestic electric circuits'],
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
    progress: 0,
    mastery: 'Coming soon',
    streakTask: 'Will unlock soon',
    summary: 'Two stories representing the courage and mystery of flying: "His First Flight" and "Black Aeroplane".',
    topics: [
      'Young seagull\'s courage',
      'The mysterious pilot helper',
      'Overcoming fear',
      'How to Tell Wild Animals',
      'The Ball Poem',
    ],
    lessons: [],
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
  const availableLessonCounts: CurriculumContentEvidence['availableLessonCounts'] = {};

  for (const [slug, chapter] of getChapterEntries()) {
    chapterPacks[slug] = hasChapterPack(slug);
    availableLessonCounts[slug] = getAvailableLessons(chapter).length;
  }

  return {
    chapterPacks,
    availableLessonCounts,
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

  const raw = await fs.readFile(path.join(directory, lesson.fileName), 'utf8');
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
