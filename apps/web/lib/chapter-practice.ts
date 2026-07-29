export type PracticeSkillSlug = string;

export type PracticeRubricPoint = {
  halfMarks: number;
  id: string;
  label: string;
  skillSlug: PracticeSkillSlug;
};

export type PracticeRemediation = {
  href: string;
  label: string;
  skillSlug: PracticeSkillSlug;
};

export type WrittenPracticeDefinition = {
  chapterSlug: string;
  id: string;
  lessonSlug: string;
  minimumCharacters: number;
  rubricPoints: PracticeRubricPoint[];
  title: string;
};

export type ChapterPracticePack = {
  chapterSlug: string;
  definitions: WrittenPracticeDefinition[];
  remediations: PracticeRemediation[];
  skillLabels: Record<string, string>;
};

export const PRACTICE_SKILL_LABELS: Record<string, string> = {
  'answer-completeness': 'Complete every requested part',
  balancing: 'Balance the equation',
  'corrosion-application': 'Apply corrosion to a material choice',
  'double-displacement-application': 'Distinguish double displacement from precipitation',
  'equation-writing': 'Write the correct chemical equation',
  'electrolysis-conductivity': 'Explain electrical conductivity',
  'electrode-labels': 'Label anode and cathode gases',
  'mass-ratio': 'Use the correct gas mass ratio',
  'multi-part-completion': 'Complete every subpart',
  observation: 'State the visible observation',
  'reaction-condition': 'Show the reaction condition',
  'reaction-classification': 'Name and justify the reaction type',
  reasoning: 'Give the required scientific reason',
  'redox-agent': 'Identify oxidising and reducing agents',
  'states-and-conditions': 'Add states and reaction conditions',
  'volume-ratio': 'Use the correct gas volume ratio',
};

const chapterOneLessonPath =
  '/chapters/chemical-reactions-and-equations/lessons';

const CHAPTER_ONE_REMEDIATION: PracticeRemediation[] = [
  {
    href: `${chapterOneLessonPath}/balancing-equations#1-1-2-balanced-chemical-equations`,
    label: 'Revisit the atom-counting balancing method',
    skillSlug: 'balancing',
  },
  {
    href: `${chapterOneLessonPath}/balancing-equations#common-mistakes`,
    label: 'Review states, conditions and balancing mistakes',
    skillSlug: 'states-and-conditions',
  },
  {
    href: `${chapterOneLessonPath}/chemical-equations#1-1-1-writing-a-chemical-equation`,
    label: 'Rebuild word, skeletal and symbolic equations',
    skillSlug: 'equation-writing',
  },
  {
    href: `${chapterOneLessonPath}/chemical-equations#activity-1-2-lead-nitrate-and-potassium-iodide`,
    label: 'Review the observation-to-inference pattern',
    skillSlug: 'observation',
  },
  {
    href: `${chapterOneLessonPath}/combination-and-decomposition-reactions#1-2-types-of-chemical-reactions`,
    label: 'Review reaction patterns and energy types',
    skillSlug: 'reaction-classification',
  },
  {
    href: `${chapterOneLessonPath}/board-exam-practice#board-extension-oxidising-and-reducing-agents`,
    label: 'Use the two-pass redox-agent method',
    skillSlug: 'redox-agent',
  },
  {
    href: `${chapterOneLessonPath}/combination-and-decomposition-reactions#board-extension-electrolysis-details`,
    label: 'Review why acidified water conducts',
    skillSlug: 'electrolysis-conductivity',
  },
  {
    href: `${chapterOneLessonPath}/combination-and-decomposition-reactions#activity-1-7-electrolysis-of-water`,
    label: 'Review which gas forms at each electrode',
    skillSlug: 'electrode-labels',
  },
  {
    href: `${chapterOneLessonPath}/combination-and-decomposition-reactions#board-extension-electrolysis-details`,
    label: 'Recalculate the cathode:anode volume ratio',
    skillSlug: 'volume-ratio',
  },
  {
    href: `${chapterOneLessonPath}/combination-and-decomposition-reactions#board-extension-electrolysis-details`,
    label: 'Recalculate the cathode:anode mass ratio',
    skillSlug: 'mass-ratio',
  },
  {
    href: `${chapterOneLessonPath}/board-exam-practice#the-full-mark-answer-pattern`,
    label: 'Use O-I-E-C and check every command word',
    skillSlug: 'answer-completeness',
  },
  {
    href: `${chapterOneLessonPath}/board-exam-practice#the-full-mark-answer-pattern`,
    label: 'Use the command-word checklist for every subpart',
    skillSlug: 'multi-part-completion',
  },
  {
    href: `${chapterOneLessonPath}/balancing-equations#common-mistakes`,
    label: 'Review where heat, light and other conditions belong',
    skillSlug: 'reaction-condition',
  },
  {
    href: `${chapterOneLessonPath}/board-exam-practice#the-full-mark-answer-pattern`,
    label: 'Practise a direct statement followed by scientific evidence',
    skillSlug: 'reasoning',
  },
  {
    href: `${chapterOneLessonPath}/oxidation-and-reduction#board-extension-copper-corrosion-and-material-choice`,
    label: 'Review copper coating, iron rust and material choice',
    skillSlug: 'corrosion-application',
  },
  {
    href: `${chapterOneLessonPath}/displacement-and-double-displacement-reactions#board-extension-double-displacement-without-a-precipitate`,
    label: 'Review ion exchange without a precipitate',
    skillSlug: 'double-displacement-application',
  },
];

const chapterOneDefinitions: WrittenPracticeDefinition[] = [
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-1',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 45,
    rubricPoints: [
      { halfMarks: 1, id: 'yellow-pbi2', label: 'Yellow insoluble lead iodide precipitate', skillSlug: 'observation' },
      {
        halfMarks: 1,
        id: 'double-displacement',
        label: 'Double displacement or precipitation classification',
        skillSlug: 'reaction-classification',
      },
      { halfMarks: 2, id: 'balanced-pbi2', label: 'Correct balanced equation', skillSlug: 'balancing' },
    ],
    title: 'PYQ 1 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-2',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 70,
    rubricPoints: [
      { halfMarks: 1, id: 'agcl-white', label: 'Starting colour: white', skillSlug: 'observation' },
      {
        halfMarks: 1,
        id: 'photolytic',
        label: 'Photolytic decomposition classification',
        skillSlug: 'reaction-classification',
      },
      { halfMarks: 2, id: 'agcl-equation', label: 'Balanced AgCl equation with sunlight', skillSlug: 'states-and-conditions' },
      { halfMarks: 1, id: 'photography', label: 'Black-and-white photography use', skillSlug: 'answer-completeness' },
      { halfMarks: 1, id: 'agbr', label: 'Silver bromide named as the alternative', skillSlug: 'answer-completeness' },
    ],
    title: 'PYQ 2 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-3',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 140,
    rubricPoints: [
      { halfMarks: 2, id: 'decomposition-definition', label: 'Complete decomposition definition', skillSlug: 'reaction-classification' },
      { halfMarks: 1, id: 'water-products', label: 'Water gives hydrogen and oxygen', skillSlug: 'answer-completeness' },
      { halfMarks: 1, id: 'electrical-energy', label: 'Electrical energy identified', skillSlug: 'states-and-conditions' },
      { halfMarks: 1, id: 'agbr-products', label: 'AgBr gives silver and bromine', skillSlug: 'answer-completeness' },
      { halfMarks: 1, id: 'light-energy', label: 'Light energy identified', skillSlug: 'states-and-conditions' },
      { halfMarks: 1, id: 'cao-equation', label: 'Calcium oxide equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'endothermic-decomposition', label: 'Endothermic decomposition stated', skillSlug: 'reaction-classification' },
      { halfMarks: 1, id: 'caoh2-equation', label: 'Calcium hydroxide equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'exothermic-combination', label: 'Exothermic combination stated', skillSlug: 'reaction-classification' },
    ],
    title: 'PYQ 3 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-4',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 130,
    rubricPoints: [
      { halfMarks: 2, id: 'pbi2-equation', label: 'Balanced lead iodide equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'ion-exchange', label: 'Ion exchange justification', skillSlug: 'reaction-classification' },
      { halfMarks: 1, id: 'pbi2-name', label: 'Lead iodide precipitate named', skillSlug: 'observation' },
      { halfMarks: 2, id: 'pbi2-ions', label: 'Pb²⁺ and I⁻ ions', skillSlug: 'answer-completeness' },
      { halfMarks: 1, id: 'slaked-lime-method', label: 'Water added to quicklime', skillSlug: 'answer-completeness' },
      { halfMarks: 1, id: 'milky-white', label: 'Milky-white observation', skillSlug: 'observation' },
      { halfMarks: 2, id: 'caco3-equation', label: 'Balanced calcium carbonate equation', skillSlug: 'balancing' },
    ],
    title: 'PYQ 4 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-5',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 80,
    rubricPoints: [
      { halfMarks: 1, id: 'same-atoms', label: 'Same number of every atom on both sides', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'law-name', label: 'Law of conservation of mass named', skillSlug: 'answer-completeness' },
      { halfMarks: 2, id: 'law-statement', label: 'Mass can neither be created nor destroyed', skillSlug: 'answer-completeness' },
      { halfMarks: 2, id: 'zinc-phosphate-equation', label: 'Correct balanced unfamiliar equation', skillSlug: 'balancing' },
    ],
    title: 'PYQ 5 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-6',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 120,
    rubricPoints: [
      { halfMarks: 1, id: 'iron-observation', label: 'Copper coating and blue-to-pale-green observation', skillSlug: 'observation' },
      { halfMarks: 1, id: 'iron-equation', label: 'Balanced iron displacement equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'pbi2-observation', label: 'Yellow lead iodide precipitate', skillSlug: 'observation' },
      { halfMarks: 1, id: 'pbi2-equation', label: 'Balanced lead iodide equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'agcl-observation', label: 'White silver chloride turns grey', skillSlug: 'observation' },
      { halfMarks: 1, id: 'agcl-equation', label: 'Balanced AgCl equation with sunlight', skillSlug: 'states-and-conditions' },
    ],
    title: 'PYQ 6 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-7',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 90,
    rubricPoints: [
      { halfMarks: 1, id: 'nh3-agent', label: 'NH₃ identified', skillSlug: 'redox-agent' },
      { halfMarks: 1, id: 'h2o-agent', label: 'H₂O identified', skillSlug: 'redox-agent' },
      { halfMarks: 1, id: 'co-agent', label: 'CO identified', skillSlug: 'redox-agent' },
      { halfMarks: 1, id: 'h2-agent', label: 'H₂ identified', skillSlug: 'redox-agent' },
      { halfMarks: 2, id: 'redox-definition', label: 'Simultaneous oxidation and reduction definition', skillSlug: 'reaction-classification' },
    ],
    title: 'PYQ 7 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-8',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 100,
    rubricPoints: [
      { halfMarks: 1, id: 'conductivity', label: 'Acid increases conductivity', skillSlug: 'electrolysis-conductivity' },
      { halfMarks: 2, id: 'electrode-gases', label: 'Hydrogen at cathode and oxygen at anode', skillSlug: 'electrode-labels' },
      { halfMarks: 1, id: 'anode-cathode-volume', label: 'Anode:cathode volume ratio 1:2', skillSlug: 'volume-ratio' },
      { halfMarks: 1, id: 'agcl-grey', label: 'White AgCl turns grey', skillSlug: 'observation' },
      { halfMarks: 1, id: 'agcl-type', label: 'Photolytic decomposition', skillSlug: 'reaction-classification' },
    ],
    title: 'PYQ 8 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-pyq-9',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 80,
    rubricPoints: [
      { halfMarks: 2, id: 'decomposition-definition', label: 'Complete decomposition definition', skillSlug: 'reaction-classification' },
      { halfMarks: 2, id: 'lead-nitrate-equation', label: 'Balanced lead nitrate equation with heat', skillSlug: 'states-and-conditions' },
      { halfMarks: 2, id: 'cathode-anode-mass', label: 'Cathode:anode mass ratio 1:8', skillSlug: 'mass-ratio' },
    ],
    title: 'PYQ 9 written attempt',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-current-redox-balance',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 65,
    rubricPoints: [
      { halfMarks: 2, id: 'both-balanced', label: 'Both equations balanced correctly', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'both-redox', label: 'Both reactions classified as redox', skillSlug: 'reaction-classification' },
      { halfMarks: 1, id: 'agent-proof', label: 'One oxidised and one reduced substance identified', skillSlug: 'redox-agent' },
    ],
    title: 'Current-pattern challenge 1',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-current-displacement-compare',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 70,
    rubricPoints: [
      { halfMarks: 1, id: 'iron-reacts', label: 'Iron in CuSO₄ observation', skillSlug: 'observation' },
      { halfMarks: 1, id: 'iron-equation', label: 'Balanced iron displacement equation', skillSlug: 'balancing' },
      { halfMarks: 1, id: 'copper-no-reaction', label: 'No reaction for copper in FeSO₄', skillSlug: 'observation' },
      { halfMarks: 1, id: 'reactivity-reason', label: 'Relative reactivity used to justify both results', skillSlug: 'reaction-classification' },
    ],
    title: 'Current-pattern challenge 2',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-current-electrolysis-diagnose',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 65,
    rubricPoints: [
      { halfMarks: 2, id: 'electrode-gases', label: 'Oxygen at anode and hydrogen at cathode', skillSlug: 'electrode-labels' },
      { halfMarks: 2, id: 'poor-conductor', label: 'Distilled water is a poor conductor', skillSlug: 'electrolysis-conductivity' },
      { halfMarks: 2, id: 'strong-electrolyte', label: 'Dilute H₂SO₄ or another strong electrolyte added', skillSlug: 'electrolysis-conductivity' },
    ],
    title: 'Current-pattern challenge 3',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-current-corrosion-evaluate',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 90,
    rubricPoints: [
      {
        halfMarks: 2,
        id: 'green-coating',
        label: 'Green basic copper carbonate coating identified',
        skillSlug: 'corrosion-application',
      },
      {
        halfMarks: 2,
        id: 'coating-comparison',
        label: 'Protective copper coating compared with flaky iron rust',
        skillSlug: 'corrosion-application',
      },
      {
        halfMarks: 2,
        id: 'malleability-use',
        label: 'Malleability connected to making shaped thin sheets',
        skillSlug: 'corrosion-application',
      },
    ],
    title: 'Current-pattern challenge 4',
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    id: 'cre-current-neutralisation-classify',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 75,
    rubricPoints: [
      {
        halfMarks: 2,
        id: 'balanced-neutralisation',
        label: 'Balanced sodium hydroxide and sulphuric acid equation',
        skillSlug: 'double-displacement-application',
      },
      {
        halfMarks: 2,
        id: 'two-classifications',
        label: 'Neutralisation and double displacement classifications',
        skillSlug: 'double-displacement-application',
      },
      {
        halfMarks: 2,
        id: 'not-precipitation',
        label: 'Soluble product and no precipitate explained',
        skillSlug: 'double-displacement-application',
      },
    ],
    title: 'Current-pattern challenge 5',
  },
];

const chapterTwoLessonPath =
  '/chapters/acids-bases-and-salts/lessons';

const CHAPTER_TWO_SKILL_LABELS: Record<string, string> = {
  'acid-rain': 'Explain the pH threshold and biological effect',
  'chlor-alkali': 'Write the chlor-alkali equation and electrode products',
  conductivity: 'Connect electrical conductivity with ions',
  'dilution-safety': 'State and explain the safe dilution rule',
  'dry-hcl': 'Explain why water is needed for acidic behaviour',
  'formula-equation': 'Write the correct formula and balanced equation',
  'ion-strength': 'Explain strength using ions formed in water',
  'multi-part-completion': 'Complete every requested subpart',
  'neutralisation-reasoning': 'Classify and justify neutralisation',
  'ph-application': 'Apply pH to a real situation',
  'ph-classification': 'Classify or compare solutions using pH',
  'ph-order': 'Order hydrogen-ion concentration correctly',
  'requested-uses': 'Give the requested number of valid uses',
  'salt-analysis': 'Identify ions, parent acid/base and salt nature',
};

const CHAPTER_TWO_REMEDIATION: PracticeRemediation[] = [
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#are-plants-and-animals-ph-sensitive`,
    label: 'Revisit acid rain and the pH range for living organisms',
    skillSlug: 'acid-rain',
  },
  {
    href: `${chapterTwoLessonPath}/salts-and-daily-life-uses#sodium-hydroxide-and-the-chlor-alkali-process`,
    label: 'Rebuild the chlor-alkali equation and electrode products',
    skillSlug: 'chlor-alkali',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#2-2-what-do-all-acids-and-all-bases-have-in-common`,
    label: 'Review why ions make an aqueous solution conduct',
    skillSlug: 'conductivity',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#figure-2-5-warning-sign-on-concentrated-acid-and-base-containers`,
    label: 'Review the acid-to-water dilution rule and its reason',
    skillSlug: 'dilution-safety',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#activity-2-9`,
    label: 'Review dry and wet litmus in the HCl activity',
    skillSlug: 'dry-hcl',
  },
  {
    href: `${chapterTwoLessonPath}/salts-and-daily-life-uses#2-4-3-chemicals-from-common-salt`,
    label: 'Review compound formulae and preparation equations',
    skillSlug: 'formula-equation',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#2-3-how-strong-are-acid-or-base-solutions`,
    label: 'Revisit strong and weak solutions in terms of ions',
    skillSlug: 'ion-strength',
  },
  {
    href: `${chapterTwoLessonPath}/board-exam-practice#the-full-mark-answer-method`,
    label: 'Use the subpart and command-word completion check',
    skillSlug: 'multi-part-completion',
  },
  {
    href: `${chapterTwoLessonPath}/chemical-properties-of-acids-and-bases#2-1-4-how-do-acids-and-bases-react-with-each-other`,
    label: 'Review neutralisation, ion exchange and soluble products',
    skillSlug: 'neutralisation-reasoning',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#2-3-1-importance-of-ph-in-everyday-life`,
    label: 'Revisit pH applications in daily life',
    skillSlug: 'ph-application',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#figure-2-6-variation-of-ph-with-haq-and-oh-aq-concentration`,
    label: 'Review acidic, neutral and basic pH ranges',
    skillSlug: 'ph-classification',
  },
  {
    href: `${chapterTwoLessonPath}/ph-and-ions-in-solution#2-3-how-strong-are-acid-or-base-solutions`,
    label: 'Rebuild the inverse pH and hydrogen-ion relationship',
    skillSlug: 'ph-order',
  },
  {
    href: `${chapterTwoLessonPath}/salts-and-daily-life-uses#2-4-3-chemicals-from-common-salt`,
    label: 'Review the textbook uses of common-salt compounds',
    skillSlug: 'requested-uses',
  },
  {
    href: `${chapterTwoLessonPath}/salts-and-daily-life-uses#2-4-2-ph-of-salts`,
    label: 'Review salt ions, parents and expected pH',
    skillSlug: 'salt-analysis',
  },
];

const chapterTwoDefinitions: WrittenPracticeDefinition[] = [
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-1',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 130,
    rubricPoints: [
      { halfMarks: 2, id: 'groups', label: 'Groups below and above pH 7 classified', skillSlug: 'ph-classification' },
      { halfMarks: 2, id: 'methods', label: 'pH paper and universal indicator named', skillSlug: 'multi-part-completion' },
      { halfMarks: 4, id: 'application', label: 'Copper cleaning or two complete daily-life examples', skillSlug: 'ph-application' },
    ],
    title: 'PYQ 1 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-2',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 105,
    rubricPoints: [
      { halfMarks: 2, id: 'tomato', label: 'Sour taste justified from pH 4.6', skillSlug: 'ph-application' },
      { halfMarks: 2, id: 'strength', label: 'Strong acid and weak base explained using ions', skillSlug: 'ion-strength' },
      { halfMarks: 2, id: 'acid-rain', label: '7.0-7.8 and pH below 5.6 connected to aquatic life', skillSlug: 'acid-rain' },
    ],
    title: 'PYQ 2 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-3',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 90,
    rubricPoints: [
      { halfMarks: 2, id: 'pop-name', label: 'POP and calcium sulphate hemihydrate identified', skillSlug: 'formula-equation' },
      { halfMarks: 2, id: 'pop-equation', label: 'Gypsum-to-POP equation with 373 K', skillSlug: 'formula-equation' },
      { halfMarks: 2, id: 'pop-uses', label: 'Two valid uses', skillSlug: 'requested-uses' },
    ],
    title: 'PYQ 3 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-4',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 105,
    rubricPoints: [
      { halfMarks: 2, id: 'nacl-parents', label: 'HCl and NaOH named as parents', skillSlug: 'salt-analysis' },
      { halfMarks: 2, id: 'calcium-sulphate-ions', label: 'Ca2+ and SO4 2- identified', skillSlug: 'salt-analysis' },
      { halfMarks: 4, id: 'family-or-neutral', label: 'Salt-family explanation or complete pH option', skillSlug: 'salt-analysis' },
    ],
    title: 'PYQ 4 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-5',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 150,
    rubricPoints: [
      { halfMarks: 5, id: 'five-solutions', label: 'All five solutions classified', skillSlug: 'ph-classification' },
      { halfMarks: 1, id: 'h-order', label: 'C < E < D < A < B hydrogen-ion order', skillSlug: 'ph-order' },
      { halfMarks: 4, id: 'two-salts', label: 'Acidic and basic salts with formula and both parents', skillSlug: 'salt-analysis' },
    ],
    title: 'PYQ 5 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-6',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 70,
    rubricPoints: [
      { halfMarks: 1, id: 'hcl-name', label: 'Hydrogen chloride gas identified', skillSlug: 'dry-hcl' },
      { halfMarks: 1, id: 'dry-litmus', label: 'No change to dry blue litmus', skillSlug: 'dry-hcl' },
      { halfMarks: 1, id: 'wet-litmus', label: 'Wet blue litmus turns red', skillSlug: 'dry-hcl' },
      { halfMarks: 1, id: 'water-ion-reason', label: 'Water and H+ ion explanation', skillSlug: 'dry-hcl' },
    ],
    title: 'PYQ 6 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-7',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 165,
    rubricPoints: [
      { halfMarks: 4, id: 'chosen-process', label: 'Chosen option completed with its process and balanced equations', skillSlug: 'chlor-alkali' },
      { halfMarks: 2, id: 'chosen-identities', label: 'All requested identities, electrodes or intermediate products in the chosen option', skillSlug: 'chlor-alkali' },
      { halfMarks: 4, id: 'chosen-uses', label: 'All uses requested in the chosen option supplied', skillSlug: 'requested-uses' },
    ],
    title: 'PYQ 7 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-8',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 95,
    rubricPoints: [
      { halfMarks: 2, id: 'chosen-option-complete', label: 'Every subpart of the chosen option attempted', skillSlug: 'formula-equation' },
      { halfMarks: 2, id: 'chosen-equation-setup', label: 'Correct first equation or conductivity setup', skillSlug: 'formula-equation' },
      { halfMarks: 2, id: 'chosen-second-result', label: 'Correct second equation, or observation with mobile-ion reason', skillSlug: 'conductivity' },
    ],
    title: 'PYQ 8 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-9',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 40,
    rubricPoints: [
      { halfMarks: 2, id: 'assertion-reason', label: 'Option 4 with safe acid-to-water rule', skillSlug: 'dilution-safety' },
    ],
    title: 'PYQ 9 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-10',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 120,
    rubricPoints: [
      { halfMarks: 2, id: 'chosen-option-complete', label: 'Every subpart of the chosen option attempted', skillSlug: 'chlor-alkali' },
      { halfMarks: 2, id: 'balanced-equations', label: 'Required equation or equations are correctly balanced', skillSlug: 'formula-equation' },
      { halfMarks: 2, id: 'option-specific-points', label: 'Electrode products, or all three named preparations, are correct', skillSlug: 'requested-uses' },
    ],
    title: 'PYQ 10 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-pyq-11',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 90,
    rubricPoints: [
      { halfMarks: 2, id: 'indicator', label: 'Universal indicator named', skillSlug: 'ph-classification' },
      { halfMarks: 2, id: 'highest-h', label: 'pH 3 selected for highest H+', skillSlug: 'ph-order' },
      { halfMarks: 4, id: 'strength-or-rain', label: 'Strong/weak ion reasoning or complete acid-rain option', skillSlug: 'ion-strength' },
    ],
    title: 'PYQ 11 written attempt',
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    id: 'abs-sqp-2025-26-q28',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 145,
    rubricPoints: [
      { halfMarks: 2, id: 'concentration-drops', label: 'Fewer drops justified from greater H+ concentration', skillSlug: 'ion-strength' },
      { halfMarks: 2, id: 'or-choice', label: 'Either 6 mL NaOH calculation OR colourless-to-pink explanation', skillSlug: 'multi-part-completion' },
      { halfMarks: 2, id: 'balanced-equation', label: 'Balanced H2SO4 + 2NaOH equation', skillSlug: 'neutralisation-reasoning' },
      { halfMarks: 2, id: 'reaction-classification', label: 'Neutralisation and double displacement; no precipitate because sodium sulphate is soluble', skillSlug: 'neutralisation-reasoning' },
    ],
    title: 'Official SQP Q28 written attempt',
  },
];

const chapterThreeLessonPath =
  '/chapters/metals-and-non-metals/lessons';

const CHAPTER_THREE_SKILL_LABELS: Record<string, string> = {
  amphoteric: 'Prove amphoteric behaviour',
  'assertion-reason': 'Evaluate both assertion and reason',
  'balanced-metallurgy': 'Write balanced metallurgy equations',
  'electron-transfer': 'Show complete electron transfer',
  'extraction-choice': 'Choose extraction method from reactivity',
  'ionic-properties': 'Explain ionic properties from forces and mobility',
  'multi-part-completion': 'Complete every chosen subpart',
  'observation-reason': 'Pair the observation with its reason',
  'physical-properties': 'Explain a metal property from the particle structure',
  'reactivity-application': 'Apply the activity series correctly',
  'refining-labels': 'Identify refining electrodes and impurities',
  'roasting-calcination': 'Distinguish roasting and calcination',
  'rusting-control': 'Use the three-tube rusting control',
};

const CHAPTER_THREE_REMEDIATION: PracticeRemediation[] = [
  {
    href: `${chapterThreeLessonPath}/oxides-and-chemical-properties#basic-and-amphoteric-metal-oxides`,
    label: 'Review the definition and both amphoteric equations',
    skillSlug: 'amphoteric',
  },
  {
    href: `${chapterThreeLessonPath}/board-exam-practice#pyq-4-answer-check`,
    label: 'Recheck the assertion and reason independently',
    skillSlug: 'assertion-reason',
  },
  {
    href: `${chapterThreeLessonPath}/ncert-exercises-and-revision#full-chapter-equation-bank`,
    label: 'Rebuild the metallurgy equations and balance atoms',
    skillSlug: 'balanced-metallurgy',
  },
  {
    href: `${chapterThreeLessonPath}/ionic-compounds#board-answer-builder`,
    label: 'Use configurations, electron count, charges and formula',
    skillSlug: 'electron-transfer',
  },
  {
    href: `${chapterThreeLessonPath}/corrosion-and-prevention#extraction-decision-ladder`,
    label: 'Choose extraction from the metal reactivity band',
    skillSlug: 'extraction-choice',
  },
  {
    href: `${chapterThreeLessonPath}/ionic-compounds#four-properties-with-reasons`,
    label: 'Review force, lattice, solubility and mobile-ion reasons',
    skillSlug: 'ionic-properties',
  },
  {
    href: `${chapterThreeLessonPath}/board-exam-practice#last-mile-scoring-checklist`,
    label: 'Use the OR-option and command-word completion check',
    skillSlug: 'multi-part-completion',
  },
  {
    href: `${chapterThreeLessonPath}/reactivity-series-and-displacement#activity-312--figure-34`,
    label: 'State visible evidence and connect it to reactivity',
    skillSlug: 'observation-reason',
  },
  {
    href: `${chapterThreeLessonPath}/physical-properties#3-1-1-metals`,
    label: 'Review heat conduction and the high melting point of metals',
    skillSlug: 'physical-properties',
  },
  {
    href: `${chapterThreeLessonPath}/reactivity-series-and-displacement#what-the-series-predicts`,
    label: 'Reapply the series to water, acids and displacement',
    skillSlug: 'reactivity-application',
  },
  {
    href: `${chapterThreeLessonPath}/corrosion-and-prevention#figure-312--electrolytic-refining-of-copper`,
    label: 'Review anode, cathode, electrolyte and anode mud',
    skillSlug: 'refining-labels',
  },
  {
    href: `${chapterThreeLessonPath}/corrosion-and-prevention#roasting-versus-calcination`,
    label: 'Review ore type, air supply and one equation each',
    skillSlug: 'roasting-calcination',
  },
  {
    href: `${chapterThreeLessonPath}/corrosion-and-prevention#activity-314--figure-313--conditions-for-rusting`,
    label: 'Revisit how tubes A, B and C isolate air and water',
    skillSlug: 'rusting-control',
  },
];

const chapterThreeDefinitions: WrittenPracticeDefinition[] = [
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-1',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 25,
    rubricPoints: [
      { halfMarks: 2, id: 'al-al2o3', label: 'Aluminium and Al2O3 correctly identified', skillSlug: 'amphoteric' },
    ],
    title: 'PYQ 1 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-2',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 125,
    rubricPoints: [
      { halfMarks: 2, id: 'copper-equation', label: 'Black CuO observation with balanced equation', skillSlug: 'observation-reason' },
      { halfMarks: 2, id: 'amphoteric-definition', label: 'Amphoteric definition and example', skillSlug: 'amphoteric' },
      { halfMarks: 4, id: 'chosen-equations', label: 'Both equations or every sulphur-option subpart', skillSlug: 'multi-part-completion' },
    ],
    title: 'PYQ 2 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-3',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 110,
    rubricPoints: [
      { halfMarks: 4, id: 'two-differences', label: 'Ore type, air condition and equations distinguished', skillSlug: 'roasting-calcination' },
      { halfMarks: 2, id: 'oxide-reduction', label: 'Correct reduction method and equation', skillSlug: 'balanced-metallurgy' },
    ],
    title: 'PYQ 3 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-4',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 55,
    rubricPoints: [
      { halfMarks: 2, id: 'assertion-false-reason-true', label: 'Assertion false, reason true, with lead-sulphate coating reason', skillSlug: 'assertion-reason' },
    ],
    title: 'PYQ 4 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-5',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 105,
    rubricPoints: [
      { halfMarks: 2, id: 'zno', label: 'ZnO reacts with acids and bases', skillSlug: 'amphoteric' },
      { halfMarks: 2, id: 'kerosene', label: 'Kerosene isolates reactive sodium from air and moisture', skillSlug: 'reactivity-application' },
      { halfMarks: 2, id: 'nitric-acid', label: 'HNO3 oxidises produced hydrogen to water', skillSlug: 'observation-reason' },
    ],
    title: 'PYQ 5 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-6',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 125,
    rubricPoints: [
      { halfMarks: 2, id: 'complete-choice', label: 'Every part of one chosen option completed', skillSlug: 'multi-part-completion' },
      { halfMarks: 2, id: 'first-two', label: 'First two extraction choices or corrosion coatings correct', skillSlug: 'extraction-choice' },
      { halfMarks: 2, id: 'third', label: 'Sodium electrolysis or iron rust point correct', skillSlug: 'reactivity-application' },
    ],
    title: 'PYQ 6 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-7',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 85,
    rubricPoints: [
      { halfMarks: 2, id: 'chosen-setup', label: 'Configurations and ion charges, or amphoteric definition', skillSlug: 'electron-transfer' },
      { halfMarks: 2, id: 'chosen-finish', label: 'CaCl2 formula, or both amphoteric equations', skillSlug: 'amphoteric' },
    ],
    title: 'PYQ 7 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-8',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 125,
    rubricPoints: [
      { halfMarks: 4, id: 'chosen-activity', label: 'Complete three-tube activity or metals with three observations', skillSlug: 'rusting-control' },
      { halfMarks: 2, id: 'conclusion-test', label: 'Air-and-water conclusion or hydrogen pop test', skillSlug: 'observation-reason' },
    ],
    title: 'PYQ 8 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-9',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 105,
    rubricPoints: [
      { halfMarks: 4, id: 'two-examples', label: 'Two valid displacement extraction examples', skillSlug: 'balanced-metallurgy' },
      { halfMarks: 2, id: 'oxygen-affinity', label: 'High metals have greater oxygen affinity than carbon', skillSlug: 'extraction-choice' },
    ],
    title: 'PYQ 9 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-10',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 190,
    rubricPoints: [
      { halfMarks: 2, id: 'complete-option', label: 'All parts of one chosen option completed', skillSlug: 'multi-part-completion' },
      { halfMarks: 4, id: 'identities-or-equations', label: 'Metal identities or first extraction equations correct', skillSlug: 'extraction-choice' },
      { halfMarks: 4, id: 'remaining-points', label: 'Amphoteric/alkali or remaining extraction/coating points correct', skillSlug: 'balanced-metallurgy' },
    ],
    title: 'PYQ 10 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-11',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 80,
    rubricPoints: [
      { halfMarks: 2, id: 'physical-nature', label: 'Hard solid and brittle with lattice-force reason', skillSlug: 'ionic-properties' },
      { halfMarks: 2, id: 'melting-boiling', label: 'High melting/boiling points with energy reason', skillSlug: 'ionic-properties' },
    ],
    title: 'PYQ 11 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-12',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 130,
    rubricPoints: [
      { halfMarks: 2, id: 'anode-mud', label: 'Anode mud defined as insoluble settled impurities', skillSlug: 'refining-labels' },
      { halfMarks: 2, id: 'electrodes', label: 'Impure copper anode and pure copper cathode', skillSlug: 'refining-labels' },
      { halfMarks: 4, id: 'chosen-c', label: 'Both extraction equations or complete labelled refining setup', skillSlug: 'balanced-metallurgy' },
    ],
    title: 'PYQ 12 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-pyq-13',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 120,
    rubricPoints: [
      { halfMarks: 2, id: 'complete-choice', label: 'All three parts of one option answered', skillSlug: 'multi-part-completion' },
      { halfMarks: 2, id: 'process-equations', label: 'Correct processes and balanced extraction equations', skillSlug: 'roasting-calcination' },
      { halfMarks: 2, id: 'final-reason-labels', label: 'Refining labels or nitric-acid reason correct', skillSlug: 'refining-labels' },
    ],
    title: 'PYQ 13 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-sqp-1',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 70,
    rubricPoints: [
      { halfMarks: 2, id: 'silver-faster', label: 'Pin falls sooner because silver conducts heat better', skillSlug: 'observation-reason' },
      { halfMarks: 2, id: 'wire-no-melt', label: 'Wire does not melt because of high melting point', skillSlug: 'physical-properties' },
    ],
    title: 'Official SQP Q25 written attempt',
  },
  {
    chapterSlug: 'metals-and-non-metals',
    id: 'mnm-sqp-2',
    lessonSlug: 'board-exam-practice',
    minimumCharacters: 125,
    rubricPoints: [
      { halfMarks: 2, id: 'complete-choice', label: 'Every part of the chosen option answered', skillSlug: 'multi-part-completion' },
      { halfMarks: 2, id: 'core-reason', label: 'Water/reactivity or corrosion/material reason correct', skillSlug: 'reactivity-application' },
      { halfMarks: 2, id: 'process-use', label: 'Electrode equations or malleability application correct', skillSlug: 'extraction-choice' },
    ],
    title: 'Official SQP Q26 written attempt',
  },
];

const practicePacks: ChapterPracticePack[] = [
  {
    chapterSlug: 'chemical-reactions-and-equations',
    definitions: chapterOneDefinitions,
    remediations: CHAPTER_ONE_REMEDIATION,
    skillLabels: PRACTICE_SKILL_LABELS,
  },
  {
    chapterSlug: 'acids-bases-and-salts',
    definitions: chapterTwoDefinitions,
    remediations: CHAPTER_TWO_REMEDIATION,
    skillLabels: CHAPTER_TWO_SKILL_LABELS,
  },
  {
    chapterSlug: 'metals-and-non-metals',
    definitions: chapterThreeDefinitions,
    remediations: CHAPTER_THREE_REMEDIATION,
    skillLabels: CHAPTER_THREE_SKILL_LABELS,
  },
];

export function createChapterPracticeRegistry(packs: ChapterPracticePack[]) {
  const definitions = new Map<string, WrittenPracticeDefinition>();
  const remediations = new Map<string, PracticeRemediation>();
  const skillLabels = new Map<string, string>();

  for (const pack of packs) {
    for (const [skillSlug, label] of Object.entries(pack.skillLabels)) {
      const skillKey = `${pack.chapterSlug}:${skillSlug}`;
      if (skillLabels.has(skillKey)) {
        throw new Error(`Duplicate practice skill label: ${skillKey}`);
      }
      skillLabels.set(skillKey, label);
    }

    for (const remediation of pack.remediations) {
      const remediationKey = `${pack.chapterSlug}:${remediation.skillSlug}`;
      if (remediations.has(remediationKey)) {
        throw new Error(`Duplicate practice remediation: ${remediationKey}`);
      }
      if (
        !remediation.href.startsWith(`/chapters/${pack.chapterSlug}/`) ||
        !remediation.href.includes('#')
      ) {
        throw new Error(`Practice remediation must use an exact chapter anchor: ${remediationKey}`);
      }
      if (!skillLabels.has(remediationKey)) {
        throw new Error(`Practice remediation has no skill label: ${remediationKey}`);
      }
      remediations.set(remediationKey, remediation);
    }

    for (const definition of pack.definitions) {
      if (definition.chapterSlug !== pack.chapterSlug) {
        throw new Error(`Practice definition ${definition.id} belongs to the wrong chapter pack.`);
      }
      if (definitions.has(definition.id)) {
        throw new Error(`Duplicate written-practice id: ${definition.id}`);
      }
      for (const point of definition.rubricPoints) {
        if (!remediations.has(`${pack.chapterSlug}:${point.skillSlug}`)) {
          throw new Error(
            `Practice definition ${definition.id} has no remediation for ${point.skillSlug}.`,
          );
        }
      }
      definitions.set(definition.id, definition);
    }
  }

  return {
    getDefinition(id: string) {
      return definitions.get(id) ?? null;
    },
    getRemediation(chapterSlug: string, skillSlug: PracticeSkillSlug) {
      return remediations.get(`${chapterSlug}:${skillSlug}`) ?? null;
    },
    getSkillLabel(chapterSlug: string, skillSlug: PracticeSkillSlug) {
      return skillLabels.get(`${chapterSlug}:${skillSlug}`) ?? skillSlug;
    },
  };
}

const practiceRegistry = createChapterPracticeRegistry(practicePacks);

export function getWrittenPracticeDefinition(id: string) {
  return practiceRegistry.getDefinition(id);
}

export function getPracticeRemediation(
  chapterSlug: string,
  skillSlug: PracticeSkillSlug,
) {
  return practiceRegistry.getRemediation(chapterSlug, skillSlug);
}

export function getPracticeSkillLabel(
  chapterSlug: string,
  skillSlug: PracticeSkillSlug,
) {
  return practiceRegistry.getSkillLabel(chapterSlug, skillSlug);
}

export function getPracticeMaxHalfMarks(
  definition: WrittenPracticeDefinition,
) {
  return definition.rubricPoints.reduce(
    (total, point) => total + point.halfMarks,
    0,
  );
}
