import type { BankQuestion } from '../types.js';

const SUBJECT = 'science';

type SeedQuestionInput = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'>;

function q(input: SeedQuestionInput): BankQuestion {
  return { ...input, subjectSlug: SUBJECT, verificationStatus: 'unverified' };
}

/**
 * Starter Science 086 question bank. All items are platform-authored original
 * board-pattern questions derived from the current NCERT scope.
 * Run `npm run seed:bank -w apps/api` to upsert into the database.
 */
export const SCIENCE_086_SEED: BankQuestion[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 1 · Chemical Substances - Nature and Behaviour (25 marks) ────────
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Chemical Reactions & Equations (MCQ 1m)
  q({
    bankKey: 'science-086-cr-balancing-mcq-1',
    chapterSlug: 'chemical-reactions-and-equations',
    unitId: 'chemical-substances',
    topicId: 'chemical-reactions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'When aqueous solutions of barium chloride and sodium sulphate are mixed, a white precipitate is formed. The white precipitate is of:',
        answerKey: {
          options: ['Barium sulphate', 'Sodium chloride', 'Barium sulphite', 'Sodium sulphate'],
          correctOptionIndex: 0,
          valuePoints: ['BaCl₂(aq) + Na₂SO₄(aq) → BaSO₄(s)↓ + 2NaCl(aq). BaSO₄ is the insoluble white precipitate.'],
          modelAnswer: 'Barium sulphate',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'When aqueous lead(II) nitrate reacts with potassium iodide solution, a yellow precipitate is formed. The yellow precipitate is of:',
        answerKey: {
          options: ['Lead iodide', 'Potassium nitrate', 'Lead oxide', 'Potassium iodide'],
          correctOptionIndex: 0,
          valuePoints: ['Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq). PbI₂ is the yellow precipitate.'],
          modelAnswer: 'Lead iodide',
        },
      },
    ],
  }),

  // 2. Redox reactions (MCQ 1m)
  q({
    bankKey: 'science-086-cr-redox-mcq-2',
    chapterSlug: 'chemical-reactions-and-equations',
    unitId: 'chemical-substances',
    topicId: 'oxidation-and-reduction',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In the reaction: MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂, the substance oxidised and the oxidising agent are respectively:',
        answerKey: {
          options: [
            'HCl is oxidised and MnO₂ is the oxidising agent',
            'MnO₂ is oxidised and HCl is the oxidising agent',
            'HCl is oxidised and Cl₂ is the oxidising agent',
            'MnO₂ is reduced and MnCl₂ is the oxidising agent',
          ],
          correctOptionIndex: 0,
          valuePoints: ['HCl loses hydrogen to form Cl₂ (oxidised); MnO₂ loses oxygen to form MnCl₂ (reduced), acting as the oxidising agent.'],
          modelAnswer: 'HCl is oxidised and MnO₂ is the oxidising agent',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'In the reaction: CuO + H₂ → Cu + H₂O, the reducing agent is:',
        answerKey: {
          options: ['H₂', 'CuO', 'Cu', 'H₂O'],
          correctOptionIndex: 0,
          valuePoints: ['H₂ gains oxygen to form H₂O (it is oxidised), so it acts as the reducing agent.'],
          modelAnswer: 'H₂',
        },
      },
    ],
  }),

  // 3. Types of reactions (MCQ 1m)
  q({
    bankKey: 'science-086-cr-reaction-types-mcq-3',
    chapterSlug: 'chemical-reactions-and-equations',
    unitId: 'chemical-substances',
    topicId: 'types-of-chemical-reactions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Electrolysis of water is a decomposition reaction. The mole ratio of hydrogen and oxygen gases liberated during electrolysis of water is:',
        answerKey: {
          options: ['2 : 1', '1 : 2', '8 : 1', '1 : 8'],
          correctOptionIndex: 0,
          valuePoints: ['2H₂O(l) → 2H₂(g) + O₂(g). The volume (mole) ratio of H₂ to O₂ is 2 : 1.'],
          modelAnswer: '2 : 1',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'Heating of ferrous sulphate crystals (FeSO₄·7H₂O) in a dry boiling tube is an example of:',
        answerKey: {
          options: ['Thermal decomposition reaction', 'Combination reaction', 'Displacement reaction', 'Neutralisation reaction'],
          correctOptionIndex: 0,
          valuePoints: ['2FeSO₄(s) → Fe₂O₃(s) + SO₂(g) + SO₃(g) on heating, which is thermal decomposition.'],
          modelAnswer: 'Thermal decomposition reaction',
        },
      },
    ],
  }),

  // 4. Exothermic vs Endothermic (MCQ 1m)
  q({
    bankKey: 'science-086-cr-exo-endo-mcq-4',
    chapterSlug: 'chemical-reactions-and-equations',
    unitId: 'chemical-substances',
    topicId: 'endothermic-and-exothermic-reactions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which of the following processes is endothermic in nature?',
        answerKey: {
          options: [
            'Decomposition of calcium carbonate to quicklime',
            'Respiration in living organisms',
            'Reaction of water with quicklime',
            'Burning of natural gas',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Decomposition of CaCO₃ requires heat energy (thermal decomposition), making it endothermic.'],
          modelAnswer: 'Decomposition of calcium carbonate to quicklime',
        },
      },
    ],
  }),

  // 5. Acids, Bases & Indicators (MCQ 1m)
  q({
    bankKey: 'science-086-ab-indicators-mcq-5',
    chapterSlug: 'acids-bases-and-salts',
    unitId: 'chemical-substances',
    topicId: 'acids-bases-ions-indicators',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A student tests an unknown liquid with red litmus and phenolphthalein. The red litmus turns blue and phenolphthalein turns pink. The liquid is likely to be:',
        answerKey: {
          options: ['Sodium hydroxide solution', 'Dilute hydrochloric acid', 'Distilled water', 'Lemon juice'],
          correctOptionIndex: 0,
          valuePoints: ['Basic solutions turn red litmus blue and phenolphthalein pink. NaOH is a strong base.'],
          modelAnswer: 'Sodium hydroxide solution',
        },
      },
    ],
  }),

  // 6. pH in daily life (MCQ 1m)
  q({
    bankKey: 'science-086-ab-ph-scale-mcq-6',
    chapterSlug: 'acids-bases-and-salts',
    unitId: 'chemical-substances',
    topicId: 'ph-scale-everyday-life',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Tooth decay starts when the pH of the mouth becomes lower than:',
        answerKey: {
          options: ['5.5', '7.0', '6.5', '8.0'],
          correctOptionIndex: 0,
          valuePoints: ['Enamel (calcium hydroxyapatite) begins corroding when oral pH drops below 5.5 due to acid produced by bacteria.'],
          modelAnswer: '5.5',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'Rainwater is called acid rain when its pH falls below:',
        answerKey: {
          options: ['5.6', '7.0', '6.5', '4.0'],
          correctOptionIndex: 0,
          valuePoints: ['When the pH of rainwater drops below 5.6, it is classified as acid rain.'],
          modelAnswer: '5.6',
        },
      },
    ],
  }),

  // 7. Metals properties (MCQ 1m)
  q({
    bankKey: 'science-086-mn-properties-mcq-7',
    chapterSlug: 'metals-and-non-metals',
    unitId: 'chemical-substances',
    topicId: 'properties-of-metals-and-non-metals',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'An amphoteric oxide among the following is:',
        answerKey: {
          options: ['Al₂O₃', 'Na₂O', 'CaO', 'K₂O'],
          correctOptionIndex: 0,
          valuePoints: ['Aluminium oxide (Al₂O₃) and Zinc oxide (ZnO) react with both acids and bases to produce salt and water (amphoteric).'],
          modelAnswer: 'Al₂O₃',
        },
      },
    ],
  }),

  // 8. Reactivity series (MCQ 1m)
  q({
    bankKey: 'science-086-mn-reactivity-mcq-8',
    chapterSlug: 'metals-and-non-metals',
    unitId: 'chemical-substances',
    topicId: 'reactivity-series',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'When iron nails are placed in copper sulphate solution for 30 minutes, the colour of the solution changes from:',
        answerKey: {
          options: ['Blue to light green', 'Light green to blue', 'Blue to colourless', 'Colourless to blue'],
          correctOptionIndex: 0,
          valuePoints: ['Fe(s) + CuSO₄(aq, blue) → FeSO₄(aq, pale green) + Cu(s, reddish-brown deposit).'],
          modelAnswer: 'Blue to light green',
        },
      },
    ],
  }),

  // 9. Corrosion prevention (MCQ 1m)
  q({
    bankKey: 'science-086-mn-corrosion-mcq-9',
    chapterSlug: 'metals-and-non-metals',
    unitId: 'chemical-substances',
    topicId: 'corrosion-and-prevention',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Galvanisation is a method of protecting iron from rusting by coating it with a thin layer of:',
        answerKey: {
          options: ['Zinc', 'Tin', 'Copper', 'Aluminium'],
          correctOptionIndex: 0,
          valuePoints: ['Galvanisation uses a sacrificial coating of molten zinc to protect iron and steel from rusting.'],
          modelAnswer: 'Zinc',
        },
      },
    ],
  }),

  // 10. Covalent bonds (MCQ 1m)
  q({
    bankKey: 'science-086-cc-covalent-mcq-10',
    chapterSlug: 'carbon-and-its-compounds',
    unitId: 'chemical-substances',
    topicId: 'covalent-bonds',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A molecule of ammonia (NH₃) has:',
        answerKey: {
          options: ['Only single covalent bonds', 'Only double covalent bonds', 'Only triple covalent bonds', 'One double and two single bonds'],
          correctOptionIndex: 0,
          valuePoints: ['Nitrogen shares three single pairs of electrons with three hydrogen atoms (three single covalent bonds).'],
          modelAnswer: 'Only single covalent bonds',
        },
      },
    ],
  }),

  // 11. Functional groups (MCQ 1m)
  q({
    bankKey: 'science-086-cc-functional-groups-mcq-11',
    chapterSlug: 'carbon-and-its-compounds',
    unitId: 'chemical-substances',
    topicId: 'functional-groups',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The functional group present in propanone (CH₃COCH₃) is:',
        answerKey: {
          options: ['Ketone', 'Aldehyde', 'Alcohol', 'Carboxylic acid'],
          correctOptionIndex: 0,
          valuePoints: ['Propanone has the carbonyl group >C=O bonded to two alkyl groups, which is a ketone group.'],
          modelAnswer: 'Ketone',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'The functional group present in ethanoic acid (CH₃COOH) is:',
        answerKey: {
          options: ['Carboxylic acid', 'Aldehyde', 'Alcohol', 'Ketone'],
          correctOptionIndex: 0,
          valuePoints: ['Ethanoic acid contains the -COOH (carboxyl) functional group.'],
          modelAnswer: 'Carboxylic acid',
        },
      },
    ],
  }),

  // 12. Chemical Reactions (Short Answer 2m)
  q({
    bankKey: 'science-086-cr-balance-equation-vsa-1',
    chapterSlug: 'chemical-reactions-and-equations',
    unitId: 'chemical-substances',
    topicId: 'balanced-chemical-equations',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Write balanced chemical equations with state symbols for the following reactions:\n(i) Iron reacts with steam to form iron(II,III) oxide and hydrogen gas.\n(ii) Lead nitrate is heated strongly in a dry test tube.',
        answerKey: {
          valuePoints: [
            '(i) 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g) [1 mark]',
            '(ii) 2Pb(NO₃)₂(s) → 2PbO(s) + 4NO₂(g) + O₂(g) [1 mark]',
          ],
          modelAnswer:
            '(i) 3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)\n(ii) 2Pb(NO₃)₂(s) → 2PbO(s) + 4NO₂(g) + O₂(g)',
        },
      },
    ],
  }),

  // 13. Acids & Bases (Short Answer 2m)
  q({
    bankKey: 'science-086-ab-dry-hcl-litmus-vsa-2',
    chapterSlug: 'acids-bases-and-salts',
    unitId: 'chemical-substances',
    topicId: 'acids-bases-ions-indicators',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why does dry HCl gas not change the colour of dry litmus paper, whereas aqueous HCl solution turns blue litmus red?',
        answerKey: {
          valuePoints: [
            'Acids show acidic behavior only when they dissociate into hydrogen ions (H⁺ or H₃O⁺) in the presence of water [1 mark].',
            'Dry HCl gas does not produce H⁺ ions in the absence of moisture, so dry litmus does not change colour; in aqueous solution, H⁺(aq) ions are released which turn blue litmus red [1 mark].',
          ],
          modelAnswer:
            'Acidic properties are due to H⁺ (or H₃O⁺) ions. In the absence of water, dry HCl gas does not ionize to give H⁺ ions, hence no colour change occurs on dry litmus paper. In aqueous solution, HCl ionizes as HCl + H₂O → H₃O⁺ + Cl⁻, and the hydronium ions turn blue litmus red.',
        },
      },
    ],
  }),

  // 14. Salts preparation (Short Answer 3m)
  q({
    bankKey: 'science-086-ab-salts-preparation-sa-1',
    chapterSlug: 'acids-bases-and-salts',
    unitId: 'chemical-substances',
    topicId: 'common-salts-preparation-uses',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A chemical compound "X" is used in plastering fractured bones.\n(i) Write the chemical name and formula of compound "X".\n(ii) How is compound "X" prepared? Write the balanced chemical equation.\n(iii) What happens when compound "X" is mixed with water?',
        answerKey: {
          valuePoints: [
            '(i) Chemical name: Plaster of Paris; Chemical formula: CaSO₄·½H₂O (Calcium sulphate hemihydrate) [1 mark].',
            '(ii) Prepared by heating gypsum at 373 K (100°C): CaSO₄·2H₂O → CaSO₄·½H₂O + 1½H₂O [1 mark].',
            '(iii) On mixing with water, it rehydrates to form a hard solid mass of gypsum: CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O [1 mark].',
          ],
          modelAnswer:
            '(i) Plaster of Paris, CaSO₄·½H₂O (Calcium sulphate hemihydrate).\n(ii) It is prepared by heating gypsum (CaSO₄·2H₂O) at 373 K:\nCaSO₄·2H₂O -(373 K)→ CaSO₄·½H₂O + 1½H₂O\n(iii) When mixed with water, it sets into a hard solid mass forming gypsum:\nCaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O',
        },
      },
    ],
  }),

  // 15. Metallurgy (Short Answer 3m)
  q({
    bankKey: 'science-086-mn-roasting-calcination-sa-2',
    chapterSlug: 'metals-and-non-metals',
    unitId: 'chemical-substances',
    topicId: 'basic-metallurgical-processes',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Differentiate between roasting and calcination with one balanced chemical equation for each in the extraction of zinc.',
        answerKey: {
          valuePoints: [
            'Roasting: Heating sulphide ores strongly in the presence of excess air to convert them into oxides [1 mark]. Equation: 2ZnS + 3O₂ → 2ZnO + 2SO₂ [½ mark].',
            'Calcination: Heating carbonate ores strongly in limited air / absence of air to convert them into oxides [1 mark]. Equation: ZnCO₃ → ZnO + CO₂ [½ mark].',
          ],
          modelAnswer:
            '1. Roasting: Sulphide ore is heated strongly in the presence of excess air.\n2ZnS(s) + 3O₂(g) → 2ZnO(s) + 2SO₂(g)\n\n2. Calcination: Carbonate ore is heated strongly in limited air or absence of air.\nZnCO₃(s) → ZnO(s) + CO₂(g)',
        },
      },
    ],
  }),

  // 16. Carbon and its Compounds (Long Answer 5m)
  q({
    bankKey: 'science-086-cc-esterification-saponification-la-1',
    chapterSlug: 'carbon-and-its-compounds',
    unitId: 'chemical-substances',
    topicId: 'chemical-properties-carbon-compounds',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'An organic compound "A" of molecular formula C₂H₆O on oxidation with alkaline KMnO₄ gives an acid "B". Compound "A" and "B" react in the presence of concentrated H₂SO₄ to form a sweet-smelling substance "C".\n(i) Identify compounds A, B, and C.\n(ii) Write balanced chemical equations for both reactions.\n(iii) What happens when compound "C" is treated with sodium hydroxide? Name this reaction and state its use.',
        answerKey: {
          valuePoints: [
            '(i) Compound A: Ethanol (CH₃CH₂OH), Compound B: Ethanoic acid (CH₃COOH), Compound C: Ethyl ethanoate (CH₃COOCH₂CH₃) [1½ marks].',
            '(ii) Oxidation: CH₃CH₂OH + 2[O] -(alkaline KMnO₄ + heat)→ CH₃COOH + H₂O [1 mark]; Esterification: CH₃COOH + CH₃CH₂OH -(conc. H₂SO₄)→ CH₃COOCH₂CH₃ + H₂O [1 mark].',
            '(iii) Reaction with NaOH: CH₃COOCH₂CH₃ + NaOH → CH₃COONa + CH₃CH₂OH [1 mark]. This is called Saponification and is used in soap manufacturing [½ mark].',
          ],
          modelAnswer:
            '(i) A = Ethanol (CH₃CH₂OH), B = Ethanoic acid (CH₃COOH), C = Ethyl ethanoate / ester (CH₃COOC₂H₅).\n(ii) Equations:\n• CH₃CH₂OH -(alkaline KMnO₄ / heat)→ CH₃COOH\n• CH₃COOH + C₂H₅OH -(conc. H₂SO₄)→ CH₃COOC₂H₅ + H₂O\n(iii) Treatment of ester C with NaOH gives sodium ethanoate and ethanol:\nCH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH\nThis reaction is known as Saponification and is used to prepare soaps.',
        },
      },
    ],
  }),

  // 17. Case Study (4m) - Chlor-Alkali Process
  q({
    bankKey: 'science-086-ab-chlor-alkali-case-1',
    chapterSlug: 'acids-bases-and-salts',
    unitId: 'chemical-substances',
    topicId: 'ph-scale-everyday-life',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the following passage and answer the questions that follow:\nWhen electricity is passed through an aqueous solution of sodium chloride (called brine), it decomposes to form sodium hydroxide, chlorine gas, and hydrogen gas. This process is called the chlor-alkali process because of the products formed: "chlor" for chlorine and "alkali" for sodium hydroxide.\n\n(i) Name the gas liberated at the anode and the gas liberated at the cathode. (1 mark)\n(ii) Write the balanced chemical equation for the chlor-alkali process. (1 mark)\n(iii) State one important industrial use each of chlorine gas and hydrogen gas produced in this process. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Anode: Chlorine gas (Cl₂); Cathode: Hydrogen gas (H₂) [1 mark].',
            '(ii) 2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g) [1 mark].',
            '(iii) Use of Cl₂: Water treatment / PVC manufacture / disinfectants [1 mark]. Use of H₂: Fuel / manufacture of ammonia for fertilizers / hydrogenation of oils [1 mark].',
          ],
          modelAnswer:
            '(i) At anode: Chlorine gas (Cl₂); At cathode: Hydrogen gas (H₂).\n(ii) 2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g)\n(iii) Use of Chlorine: Water treatment / disinfection of drinking water. Use of Hydrogen: Manufacture of ammonia for nitrogenous fertilizers.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 2 · World of Living (25 marks) ───────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 18. Life processes - Nutrition (MCQ 1m)
  q({
    bankKey: 'science-086-lp-nutrition-mcq-1',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-nutrition',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The enzyme present in saliva that breaks down starch into simple sugars is:',
        answerKey: {
          options: ['Salivary amylase', 'Pepsin', 'Trypsin', 'Lipase'],
          correctOptionIndex: 0,
          valuePoints: ['Salivary amylase (ptyalin) in saliva hydrolyzes starch into maltose.'],
          modelAnswer: 'Salivary amylase',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'The site of complete digestion of carbohydrates, proteins and fats in the human alimentary canal is:',
        answerKey: {
          options: ['Small intestine', 'Stomach', 'Large intestine', 'Mouth cavity'],
          correctOptionIndex: 0,
          valuePoints: ['The small intestine receives secretions from the liver and pancreas, completing digestion of all three macronutrients.'],
          modelAnswer: 'Small intestine',
        },
      },
    ],
  }),

  // 19. Life processes - Respiration (MCQ 1m)
  q({
    bankKey: 'science-086-lp-respiration-mcq-2',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-respiration',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Breakdown of pyruvate into lactic acid and energy in human muscle cells during vigorous exercise occurs due to:',
        answerKey: {
          options: ['Lack of oxygen', 'Excess of oxygen', 'Presence of carbon dioxide', 'Absence of nitrogen'],
          correctOptionIndex: 0,
          valuePoints: ['In muscle cells under anaerobic conditions / lack of oxygen, pyruvate is converted into 3-carbon lactic acid.'],
          modelAnswer: 'Lack of oxygen',
        },
      },
    ],
  }),

  // 20. Control & Coordination - Reflex arc (MCQ 1m)
  q({
    bankKey: 'science-086-cc-reflex-arc-mcq-3',
    chapterSlug: 'control-and-coordination',
    unitId: 'world-of-living',
    topicId: 'voluntary-involuntary-reflex-actions',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The correct sequence of components in a reflex arc is:',
        answerKey: {
          options: [
            'Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector',
            'Receptor → Motor neuron → Spinal cord → Sensory neuron → Effector',
            'Effector → Motor neuron → Spinal cord → Sensory neuron → Receptor',
            'Receptor → Spinal cord → Sensory neuron → Motor neuron → Effector',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Stimulus is detected by receptor → sensory neuron → spinal cord relay → motor neuron → effector response.'],
          modelAnswer: 'Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector',
        },
      },
    ],
  }),

  // 21. Plant hormones (MCQ 1m)
  q({
    bankKey: 'science-086-cc-plant-hormones-mcq-4',
    chapterSlug: 'control-and-coordination',
    unitId: 'world-of-living',
    topicId: 'plant-tropic-movements-hormones',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The plant hormone responsible for wilting of leaves and growth inhibition is:',
        answerKey: {
          options: ['Abscisic acid', 'Auxin', 'Gibberellin', 'Cytokinin'],
          correctOptionIndex: 0,
          valuePoints: ['Abscisic acid (ABA) is a growth inhibitor that promotes stomatal closure, leaf senescence, and wilting.'],
          modelAnswer: 'Abscisic acid',
        },
      },
    ],
  }),

  // 22. Reproduction (MCQ 1m)
  q({
    bankKey: 'science-086-rep-asexual-mcq-5',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'asexual-reproduction',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In Bryophyllum, vegetative propagation takes place through buds produced in the notches along the margins of:',
        answerKey: {
          options: ['Leaves', 'Stem', 'Roots', 'Flowers'],
          correctOptionIndex: 0,
          valuePoints: ['Bryophyllum reproduces vegetatively via adventitious foliar buds present on the leaf margins.'],
          modelAnswer: 'Leaves',
        },
      },
    ],
  }),

  // 23. Transportation (Short Answer 2m)
  q({
    bankKey: 'science-086-lp-xylem-phloem-vsa-1',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-transport',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State two differences between transport of materials in xylem and phloem in plants.',
        answerKey: {
          valuePoints: [
            'Xylem transports water and minerals unidirectionally from roots to leaves; Phloem transports soluble products of photosynthesis (sucrose) bidirectionally [1 mark].',
            'Xylem transport uses physical forces (transpiration pull, root pressure) without ATP; Phloem translocation is an active process that utilizes ATP energy [1 mark].',
          ],
          modelAnswer:
            '1. Material & Direction: Xylem conducts water and minerals unidirectionally upwards from roots; phloem translocates food/sucrose bidirectionally to all parts.\n2. Energy: Xylem transport is driven by physical forces (transpiration pull); phloem transport is active and uses ATP energy.',
        },
      },
    ],
  }),

  // 24. Excretion (Short Answer 2m)
  q({
    bankKey: 'science-086-lp-nephron-filtration-vsa-2',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-excretion',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Name the basic filtration unit in the human kidney and state the function of Bowman’s capsule.',
        answerKey: {
          valuePoints: [
            'Basic filtration unit: Nephron [1 mark].',
            'Function of Bowman’s capsule: Collects the glomerular filtrate containing glucose, amino acids, salts, water, and urea under pressure filtration [1 mark].',
          ],
          modelAnswer:
            'The basic filtration unit of the kidney is the Nephron. Bowman’s capsule is a cup-shaped sac that encloses the glomerulus and collects the initial filtrate (water, glucose, amino acids, salts, and nitrogenous waste) filtered from the blood capillaries under pressure.',
        },
      },
    ],
  }),

  // 25. Control & Coordination - Brain (Short Answer 3m)
  q({
    bankKey: 'science-086-cc-human-brain-sa-1',
    chapterSlug: 'control-and-coordination',
    unitId: 'world-of-living',
    topicId: 'animal-nervous-system',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Name the specific part of the human brain responsible for:\n(i) Maintaining posture and balance of the body.\n(ii) Regulating blood pressure and vomiting.\n(iii) Thinking, memory, and voluntary actions.',
        answerKey: {
          valuePoints: [
            '(i) Posture and balance: Cerebellum (part of hindbrain) [1 mark].',
            '(ii) Blood pressure and vomiting: Medulla oblongata (hindbrain) [1 mark].',
            '(iii) Thinking and voluntary actions: Cerebrum (forebrain) [1 mark].',
          ],
          modelAnswer:
            '(i) Cerebellum (Hindbrain)\n(ii) Medulla oblongata (Hindbrain)\n(iii) Cerebrum (Forebrain)',
        },
      },
    ],
  }),

  // 26. Reproduction - Flower Structure (Short Answer 3m)
  q({
    bankKey: 'science-086-rep-flower-pollination-sa-2',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'sexual-reproduction',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Distinguish between self-pollination and cross-pollination. What happens to the ovule and ovary of a flower after fertilization?',
        answerKey: {
          valuePoints: [
            'Self-pollination: Transfer of pollen grains from anther to stigma of the same flower or another flower on the same plant [1 mark]. Cross-pollination: Transfer of pollen grains from anther of one flower to stigma of a flower on a different plant of the same species [1 mark].',
            'Post-fertilization changes: The ovule develops into a tough-coated seed, and the ovary grows and ripens into a fruit [1 mark].',
          ],
          modelAnswer:
            '• Self-pollination: Transfer of pollen from anther to stigma of the same flower or another flower of the same plant.\n• Cross-pollination: Transfer of pollen from anther of one flower to stigma of a different plant of the same species.\n\nPost-fertilization:\n- The ovule develops into a seed.\n- The ovary ripens to become a fruit.',
        },
      },
    ],
  }),

  // 27. Life Processes - Double Circulation (Long Answer 5m)
  q({
    bankKey: 'science-086-lp-double-circulation-la-1',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-transport',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why is blood circulation in the human heart described as "double circulation"? Trace the flow of blood through the four chambers of the heart and explain the biological advantage of keeping oxygenated and deoxygenated blood separated in birds and mammals.',
        answerKey: {
          valuePoints: [
            'Definition: Blood passes through the heart twice during one complete cycle (pulmonary circulation and systemic circulation) [1 mark].',
            'Pathway: Deoxygenated blood from body → right atrium → right ventricle → pulmonary artery → lungs for oxygenation [1½ marks]. Oxygenated blood from lungs → pulmonary veins → left atrium → left ventricle → aorta → entire body [1½ marks].',
            'Advantage: Complete separation prevents mixing of oxygenated and deoxygenated blood, ensuring highly efficient oxygen delivery to maintain constant high body temperature (homeothermy / warm-blooded animals) [1 mark].',
          ],
          modelAnswer:
            'Blood circulation in humans is called double circulation because blood passes through the heart twice in one complete circuit:\n1. Pulmonary Circulation: Deoxygenated blood from the body enters the Right Atrium via vena cava → passes to Right Ventricle → pumped through Pulmonary Artery to the lungs for oxygenation.\n2. Systemic Circulation: Oxygenated blood from the lungs returns via Pulmonary Veins into the Left Atrium → passes into Left Ventricle → pumped through the Aorta to all body tissues.\n\nBiological Advantage: Separation of oxygenated and deoxygenated blood ensures high oxygen supply to tissues, supporting the high energy requirements of warm-blooded birds and mammals to maintain a constant body temperature.',
        },
      },
    ],
  }),

  // 28. Case Study (4m) - Reproductive Health & Contraception
  q({
    bankKey: 'science-086-rep-contraception-case-1',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'reproductive-health-family-planning',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the following passage and answer the questions that follow:\nContraceptive methods are adopted to avoid unwanted pregnancies and manage population growth. These methods include barrier methods, chemical (hormonal) methods, intra-uterine contraceptive devices (IUCDs), and surgical methods. Besides preventing pregnancy, certain methods also protect against sexually transmitted infections (STIs).\n\n(i) Name one barrier method that helps in preventing the transmission of STIs like HIV/AIDS. (1 mark)\n(ii) How do oral contraceptive pills prevent pregnancy? (1 mark)\n(iii) Name the surgical method of contraception in males (vasectomy) and describe how it works. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Condoms (male or female condoms) [1 mark].',
            '(ii) Oral pills contain hormones that inhibit ovulation / alter hormonal balance so eggs are not released [1 mark].',
            '(iii) Vasectomy: The vas deferens in males is blocked/cut and tied, preventing sperm transfer into the semen [2 marks].',
          ],
          modelAnswer:
            '(i) Condom (barrier method).\n(ii) Oral pills alter the hormonal balance of the body to prevent ovulation (release of eggs).\n(iii) Vasectomy: In males, a small portion of the vas deferens is cut and tied off. This prevents sperm from reaching the urethra, ensuring semen contains no sperm.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 3 · Natural Phenomena (12 marks) ─────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 29. Light - Refractive Index (MCQ 1m)
  q({
    bankKey: 'science-086-np-refractive-index-mcq-1',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'laws-of-refraction-refractive-index',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The absolute refractive indices of water and glass are 4/3 and 3/2 respectively. The speed of light in glass relative to water is in the ratio:',
        answerKey: {
          options: ['8 : 9', '9 : 8', '2 : 3', '3 : 4'],
          correctOptionIndex: 0,
          valuePoints: ['v_glass / v_water = n_water / n_glass = (4/3) / (3/2) = 8/9.'],
          modelAnswer: '8 : 9',
        },
      },
    ],
  }),

  // 30. Light - Lens Power (MCQ 1m)
  q({
    bankKey: 'science-086-np-lens-power-mcq-2',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'spherical-lenses-formula-power',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A convex lens has a focal length of +20 cm. Its power is:',
        answerKey: {
          options: ['+5 D', '-5 D', '+0.05 D', '-0.05 D'],
          correctOptionIndex: 0,
          valuePoints: ['P = 1 / f(in m) = 1 / 0.20 m = +5 D.'],
          modelAnswer: '+5 D',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'A concave lens has a focal length of 50 cm. Its power is:',
        answerKey: {
          options: ['-2 D', '+2 D', '-0.5 D', '+0.5 D'],
          correctOptionIndex: 0,
          valuePoints: ['f = -0.5 m, P = 1 / (-0.5) = -2 D.'],
          modelAnswer: '-2 D',
        },
      },
    ],
  }),

  // 31. Human Eye - Defects (MCQ 1m)
  q({
    bankKey: 'science-086-np-human-eye-defects-mcq-3',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    unitId: 'natural-phenomena',
    topicId: 'human-eye-defects-corrections',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A person unable to see distant objects clearly is suffering from:',
        answerKey: {
          options: ['Myopia, corrected by concave lens', 'Hypermetropia, corrected by convex lens', 'Presbyopia, corrected by bifocal lens', 'Cataract, corrected by surgery'],
          correctOptionIndex: 0,
          valuePoints: ['Short-sightedness (myopia) is corrected using a concave (diverging) lens of appropriate focal length.'],
          modelAnswer: 'Myopia, corrected by concave lens',
        },
      },
    ],
  }),

  // 32. Atmospheric Refraction (Short Answer 2m)
  q({
    bankKey: 'science-086-np-twinkling-stars-vsa-1',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    unitId: 'natural-phenomena',
    topicId: 'prism-dispersion-scattering',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why do stars twinkle, but planets do not twinkle? Explain briefly.',
        answerKey: {
          valuePoints: [
            'Stars twinkle because they are point-sized light sources located very far away; their light undergoes continuous atmospheric refraction through varying air densities, causing fluctuating apparent positions and intensity [1 mark].',
            'Planets are closer and act as extended collections of point sources; the variations from different points average out to zero, so they do not twinkle [1 mark].',
          ],
          modelAnswer:
            'Stars are distant point sources of light. Atmospheric refraction through fluctuating atmospheric layers bends starlight unpredictably, causing flickering. Planets are much closer and act as extended light sources; fluctuations from different points cancel each other out, resulting in steady light.',
        },
      },
    ],
  }),

  // 33. Mirror / Lens Numerical (Short Answer 3m)
  q({
    bankKey: 'science-086-np-mirror-numerical-sa-1',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'mirror-formula-magnification',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'An object 4 cm in height is placed 25 cm in front of a concave mirror of focal length 15 cm. Find the position, nature, and size of the image formed.',
        answerKey: {
          valuePoints: [
            'Given: h = +4 cm, u = -25 cm, f = -15 cm. Using 1/v + 1/u = 1/f → 1/v = 1/(-15) - 1/(-25) = -2/75 → v = -37.5 cm (Image is 37.5 cm in front of the mirror) [1½ marks].',
            'Magnification m = -v/u = -(-37.5)/(-25) = -1.5 [½ mark].',
            'Height of image h\' = m × h = -1.5 × 4 cm = -6 cm. Nature: Real, inverted, and magnified [1 mark].',
          ],
          modelAnswer:
            'Given: u = -25 cm, f = -15 cm, h = 4 cm\nUsing mirror formula:\n1/v + 1/u = 1/f ⇒ 1/v = -1/15 - (-1/25) = -2/75\nv = -37.5 cm\n\nMagnification:\nm = -v/u = -(-37.5)/(-25) = -1.5\nh\' = m × h = -1.5 × 4 = -6 cm\n\nThe image is formed at 37.5 cm in front of the mirror, is Real, Inverted, and 6 cm high.',
        },
      },
    ],
  }),

  // 34. Case Study (4m) - Convex Lens Optical Workbench
  q({
    bankKey: 'science-086-np-lens-ray-diagram-case-1',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'spherical-lenses-formula-power',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the following passage and answer the questions that follow:\nA student projects a sharp image of a candle flame on a screen using a convex lens of focal length 12 cm. When the candle is placed at a certain position, the image formed on the screen on the other side is magnified and real.\n\n(i) Where should the candle flame be placed relative to the lens to obtain a magnified real image on the screen? (1 mark)\n(ii) What happens to the image on the screen if the lower half of the lens is covered with black paper? (1 mark)\n(iii) If the candle is moved very close to the lens (at 8 cm), what will be the nature and position of the image? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Between F₁ and 2F₁ (i.e. between 12 cm and 24 cm from the lens) [1 mark].',
            '(ii) A complete image is still formed, but its brightness/intensity is reduced [1 mark].',
            '(iii) Placed inside the focal length (u = 8 cm < f = 12 cm): The image is virtual, erect, magnified, and formed on the same side as the object [2 marks].',
          ],
          modelAnswer:
            '(i) The object should be placed between F₁ and 2F₁ (between 12 cm and 24 cm from the lens).\n(ii) The full image is still formed, but its brightness (intensity) decreases because fewer light rays pass through.\n(iii) At u = 8 cm (inside focal length), a Virtual, Erect, and Magnified image is formed on the same side of the lens.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 4 · Effects of Current (13 marks) ────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 35. Ohm's Law (MCQ 1m)
  q({
    bankKey: 'science-086-ec-ohms-law-mcq-1',
    chapterSlug: 'electricity',
    unitId: 'effects-of-current',
    topicId: 'ohms-law-resistance-resistivity',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A cylindrical conductor of length L and uniform area of cross-section A has resistance R. Another conductor of length 2L and area of cross-section A/2 of the same material has resistance:',
        answerKey: {
          options: ['4R', '2R', 'R/2', 'R/4'],
          correctOptionIndex: 0,
          valuePoints: ['R\' = ρ(2L) / (A/2) = 4(ρL/A) = 4R.'],
          modelAnswer: '4R',
        },
      },
    ],
  }),

  // 36. Electric Power (MCQ 1m)
  q({
    bankKey: 'science-086-ec-electric-power-mcq-2',
    chapterSlug: 'electricity',
    unitId: 'effects-of-current',
    topicId: 'electric-power',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Two electric bulbs rated 220 V, 100 W and 220 V, 40 W are connected in parallel to a 220 V mains supply. The current drawn from the supply is:',
        answerKey: {
          options: ['0.64 A', '0.45 A', '1.40 A', '0.25 A'],
          correctOptionIndex: 0,
          valuePoints: ['I_total = (P₁ + P₂) / V = (100 + 40) / 220 = 140 / 220 ≈ 0.636 A ≈ 0.64 A.'],
          modelAnswer: '0.64 A',
        },
      },
    ],
  }),

  // 37. Magnetic Effects (MCQ 1m)
  q({
    bankKey: 'science-086-ec-magnetic-field-mcq-3',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'magnetic-field-and-field-lines',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The magnetic field inside a long straight current-carrying solenoid is:',
        answerKey: {
          options: ['Uniform at all points', 'Zero', 'Decreases as we move towards its ends', 'Increases as we move towards its ends'],
          correctOptionIndex: 0,
          valuePoints: ['Field lines inside a solenoid are parallel straight lines, indicating a uniform magnetic field.'],
          modelAnswer: 'Uniform at all points',
        },
      },
    ],
  }),

  // 38. Domestic Circuits (Short Answer 2m)
  q({
    bankKey: 'science-086-ec-earthing-fuse-vsa-1',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'domestic-electric-circuits',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is the role of an earth wire in domestic electrical appliances having metallic bodies? Why is it connected to appliances like electric irons and refrigerators?',
        answerKey: {
          valuePoints: [
            'The green earth wire provides a low-resistance path for leakage current to the ground [1 mark].',
            'If the live wire touches the metal casing, current flows into the ground rather than through a user touching the appliance, preventing severe electric shocks [1 mark].',
          ],
          modelAnswer:
            'The earth wire connects the metal body of the appliance to a copper plate buried deep in the ground. If insulation fails and live wire touches the metal body, current flows safely to earth (low-resistance path), keeping appliance potential at zero and protecting users from electric shock.',
        },
      },
    ],
  }),

  // 39. Resistor Circuit Numerical (Short Answer 3m)
  q({
    bankKey: 'science-086-ec-resistor-combination-sa-1',
    chapterSlug: 'electricity',
    unitId: 'effects-of-current',
    topicId: 'series-parallel-resistors',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel across a 12 V battery.\n(i) Calculate the equivalent resistance of the circuit.\n(ii) Calculate the total current flowing from the battery.\n(iii) Calculate the current through the 4 Ω resistor.',
        answerKey: {
          valuePoints: [
            '(i) 1/R_eq = 1/4 + 1/6 + 1/12 = (3 + 2 + 1)/12 = 6/12 = 1/2 ⇒ R_eq = 2 Ω [1 mark].',
            '(ii) Total current I = V / R_eq = 12 V / 2 Ω = 6 A [1 mark].',
            '(iii) Current through 4 Ω resistor I₁ = V / R₁ = 12 V / 4 Ω = 3 A [1 mark].',
          ],
          modelAnswer:
            '(i) In parallel: 1/R_eq = 1/4 + 1/6 + 1/12 = 6/12 = 1/2 ⇒ R_eq = 2 Ω\n(ii) Total current: I = V / R_eq = 12 / 2 = 6 A\n(iii) Current in 4 Ω branch: I₁ = 12 / 4 = 3 A',
        },
      },
    ],
  }),

  // 40. Joule's Heating & Commercial Energy (Numerical 5m)
  q({
    bankKey: 'science-086-ec-joules-heating-la-1',
    chapterSlug: 'electricity',
    unitId: 'effects-of-current',
    topicId: 'heating-effect-electric-current',
    questionType: 'numerical',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State Joule’s Law of Heating. Express it mathematically with symbols.\nAn electric heater rated 1000 W, 220 V is used for 4 hours daily, and an electric refrigerator rated 400 W is used for 10 hours daily. Calculate the total cost of energy consumed in the month of September (30 days) at the rate of ₹ 6.50 per kWh.',
        answerKey: {
          valuePoints: [
            'Joule’s Law: Heat produced in a resistor is directly proportional to (i) square of current (I²), (ii) resistance (R), and (iii) time (t) for which current flows: H = I²Rt [1½ marks].',
            'Daily energy for heater: 1000 W × 4 h = 4000 Wh = 4 kWh [1 mark].',
            'Daily energy for refrigerator: 400 W × 10 h = 4000 Wh = 4 kWh [1 mark].',
            'Total daily energy = 8 kWh. Total monthly energy (30 days) = 8 × 30 = 240 kWh (units) [1 mark].',
            'Total cost = 240 kWh × ₹ 6.50 = ₹ 1,560 [½ mark].',
          ],
          modelAnswer:
            'Joule’s Law of Heating states that heat produced in a conductor is directly proportional to:\n1. Square of current (I²)\n2. Resistance of conductor (R)\n3. Time (t) for which current flows\nMathematical expression: H = I²Rt\n\nEnergy Calculation for September (30 days):\n• Heater energy per day = 1 kW × 4 h = 4 kWh\n• Refrigerator energy per day = 0.4 kW × 10 h = 4 kWh\n• Total energy per day = 4 + 4 = 8 kWh\n• Total energy for 30 days = 8 × 30 = 240 kWh (units)\n\nTotal Cost = 240 × ₹ 6.50 = ₹ 1,560',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 5 · Natural Resources (5 marks) ──────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 41. Food Chain & 10% law (MCQ 1m)
  q({
    bankKey: 'science-086-nr-food-chain-mcq-1',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'ecosystem',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'According to Lindeman’s 10% law, if 10,000 J of energy is available at the producer level in an ecosystem, the amount of energy transferred to secondary consumers is:',
        answerKey: {
          options: ['100 J', '1,000 J', '10 J', '1 J'],
          correctOptionIndex: 0,
          valuePoints: [
            'Producer (10,000 J) → Primary consumer/herbivore (1,000 J) → Secondary consumer/carnivore (100 J).',
          ],
          modelAnswer: '100 J',
        },
      },
    ],
  }),

  // 42. Ozone depletion (MCQ 1m)
  q({
    bankKey: 'science-086-nr-ozone-mcq-2',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'ozone-depletion',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Ozone gas at higher levels of the atmosphere shields the surface of the earth from:',
        answerKey: {
          options: ['Harmful ultraviolet (UV) radiation', 'Infrared radiation', 'Cosmic rays', 'Visible light'],
          correctOptionIndex: 0,
          valuePoints: ['Ozone (O₃) absorbs short-wavelength UV rays from the Sun, protecting organisms from skin cancers and cataracts.'],
          modelAnswer: 'Harmful ultraviolet (UV) radiation',
        },
      },
    ],
  }),

  // 43. Biological Magnification (Short Answer 2m)
  q({
    bankKey: 'science-086-nr-biomagnification-vsa-1',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'environmental-problems-solutions',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is biological magnification? In a food chain consisting of grass, grasshopper, frog, snake, and hawk, which organism will have the maximum concentration of harmful non-biodegradable pesticides?',
        answerKey: {
          valuePoints: [
            'Biological magnification: Progressive increase in the concentration of non-biodegradable toxic substances (like pesticides/DDT) at successive trophic levels in a food chain [1 mark].',
            'Maximum concentration will be found in the Hawk (top consumer), as humans/top carnivores occupy the highest trophic level [1 mark].',
          ],
          modelAnswer:
            'Biological magnification is the progressive accumulation of non-biodegradable chemicals (like DDT) at each successive trophic level. In the given food chain, the Hawk (top consumer) will have the maximum concentration because chemicals cannot be metabolized or excreted and accumulate progressively.',
        },
      },
    ],
  }),

  // 44. Waste Management (Short Answer 3m)
  q({
    bankKey: 'science-086-nr-biodegradable-waste-sa-1',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'waste-production-biodegradability',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Differentiate between biodegradable and non-biodegradable substances with two examples of each. Suggest two eco-friendly measures to reduce municipal waste generation.',
        answerKey: {
          valuePoints: [
            'Biodegradable: Substances broken down by biological processes (decomposers/bacteria). Examples: Vegetable peels, paper, cow dung [1 mark].',
            'Non-biodegradable: Substances that cannot be broken down by biological processes. Examples: Plastic bags, glass, pesticides, DDT [1 mark].',
            'Measures: (i) Segregation of dry and wet waste at source, (ii) Recycling plastics/metals and using cloth bags instead of single-use polythene [1 mark].',
          ],
          modelAnswer:
            '• Biodegradable: Substances decomposed naturally by microorganisms (e.g., fruit peels, paper).\n• Non-biodegradable: Substances that persist in the environment without biological decomposition (e.g., polythene bags, glass).\n\nEco-friendly measures:\n1. Segregation of biodegradable and non-biodegradable waste at source.\n2. Ban on single-use plastics and promotion of reusable cloth/jute bags.',
        },
      },
    ],
  }),

  // 45. Natural Resources Case Study (4m) - Ecosystem & Energy Flow
  q({
    bankKey: 'science-086-nr-energy-flow-case-1',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'environmental-problems-solutions',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the following passage and answer the questions that follow:\nIn an ecosystem, green plants capture solar energy through photosynthesis and convert it into chemical energy. Energy is transferred through food chains from producers to herbivores and carnivores. At each step, a large amount of energy is lost as metabolic heat to the environment, so only a fraction is available to the next trophic level.\n\n(i) Why is energy flow in an ecosystem always unidirectional? (1 mark)\n(ii) Why are food chains generally limited to only 3 or 4 trophic levels? (2 marks)\n(iii) What role do decomposers play in an ecosystem? (1 mark)',
        answerKey: {
          valuePoints: [
            '(i) Energy captured by autotrophs does not revert back to the Sun, and energy passed to herbivores does not come back to autotrophs (moves progressively forward) [1 mark].',
            '(ii) Due to the 10% law, only 10% of energy is transferred to each next level. After 3–4 trophic levels, the amount of remaining energy is too small to support another trophic level [2 marks].',
            '(iii) Decomposers break down dead organic remains into inorganic nutrients, replenishing soil fertility and cleaning the environment [1 mark].',
          ],
          modelAnswer:
            '(i) Energy flow is unidirectional because energy captured from the sun cannot return to the sun, and energy consumed by carnivores cannot flow backward to producers.\n(ii) Food chains rarely exceed 3-4 steps because only 10% of energy is passed to the next level (10% law). After 4 levels, negligible energy remains to sustain another organism.\n(iii) Decomposers break down complex organic matter into simple nutrients, recycling nutrients back into the soil.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Additional Pool for Robust Multi-Seed Assembly ─────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 46. World of Living - Anaerobic Respiration in Yeast (MCQ 1m)
  q({
    bankKey: 'science-086-wol-yeast-respiration-mcq-6',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-respiration',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'During fermentation in yeast, glucose is converted into:',
        answerKey: {
          options: [
            'Ethanol, carbon dioxide and energy',
            'Lactic acid and energy',
            'Carbon dioxide, water and energy',
            'Pyruvate only',
          ],
          correctOptionIndex: 0,
          valuePoints: ['In yeast under anaerobic conditions (fermentation), pyruvate is converted into ethanol and CO₂ with release of 2 ATP.'],
          modelAnswer: 'Ethanol, carbon dioxide and energy',
        },
      },
    ],
  }),

  // 47. World of Living - Budding in Hydra (MCQ 1m)
  q({
    bankKey: 'science-086-wol-hydra-budding-mcq-7',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'asexual-reproduction',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Hydra reproduces asexually by budding using:',
        answerKey: {
          options: [
            'Regenerative cells',
            'Gametes',
            'Multiple spores',
            'Binary fission',
          ],
          correctOptionIndex: 0,
          valuePoints: ['In Hydra, a bud develops as an outgrowth due to repeated cell division at one specific site using regenerative cells.'],
          modelAnswer: 'Regenerative cells',
        },
      },
    ],
  }),

  // 48. World of Living - Animal Hormones (MCQ 1m)
  q({
    bankKey: 'science-086-wol-animal-hormones-mcq-8',
    chapterSlug: 'control-and-coordination',
    unitId: 'world-of-living',
    topicId: 'animal-hormones',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Iodine is essential in our diet for the proper synthesis of which hormone by the thyroid gland?',
        answerKey: {
          options: ['Thyroxine', 'Insulin', 'Adrenaline', 'Growth hormone'],
          correctOptionIndex: 0,
          valuePoints: ['Iodine is essential for the thyroid gland to synthesize thyroxine, which regulates carbohydrate, protein and fat metabolism.'],
          modelAnswer: 'Thyroxine',
        },
      },
    ],
  }),

  // 49. World of Living - Autotrophic Nutrition (MCQ 1m)
  q({
    bankKey: 'science-086-wol-autotrophs-mcq-9',
    chapterSlug: 'life-processes',
    unitId: 'world-of-living',
    topicId: 'life-processes-nutrition',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The autotrophic mode of nutrition requires:',
        answerKey: {
          options: [
            'Carbon dioxide, water, chlorophyll and sunlight',
            'Carbon dioxide and water only',
            'Chlorophyll and oxygen only',
            'Proteins, fats and carbohydrates',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Photosynthesis requires CO₂, H₂O, chlorophyll, and solar radiation to produce glucose and oxygen.'],
          modelAnswer: 'Carbon dioxide, water, chlorophyll and sunlight',
        },
      },
    ],
  }),

  // 50. World of Living - Tropic Movements (MCQ 1m)
  q({
    bankKey: 'science-086-wol-tropic-movements-mcq-10',
    chapterSlug: 'control-and-coordination',
    unitId: 'world-of-living',
    topicId: 'plant-tropic-movements-hormones',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Movement of sunflower towards the sun in daytime is an example of:',
        answerKey: {
          options: ['Phototropism', 'Geotropism', 'Hydrotropism', 'Chemotropism'],
          correctOptionIndex: 0,
          valuePoints: ['Directional growth movement of plant parts in response to light stimulus is phototropism.'],
          modelAnswer: 'Phototropism',
        },
      },
    ],
  }),

  // 51. World of Living - Binary Fission (MCQ 1m)
  q({
    bankKey: 'science-086-wol-binary-fission-mcq-11',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'asexual-reproduction',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Binary fission in Leishmania differs from that in Amoeba because in Leishmania:',
        answerKey: {
          options: [
            'Binary fission occurs in a definite orientation relative to whip-like flagella',
            'Binary fission occurs in any plane',
            'Multiple fission occurs instead of binary fission',
            'Spore formation takes place',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Leishmania has a whip-like structure (flagellum) at one end and divides longitudinally in a fixed orientation.'],
          modelAnswer: 'Binary fission occurs in a definite orientation relative to whip-like flagella',
        },
      },
    ],
  }),

  // 52. World of Living - Female Reproductive System (Short Answer 3m)
  q({
    bankKey: 'science-086-wol-female-reproduction-sa-3',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'sexual-reproduction',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In the human female reproductive system, state the function of:\n(i) Ovary\n(ii) Fallopian tube (oviduct)\n(iii) Uterus',
        answerKey: {
          valuePoints: [
            '(i) Ovary: Produces female gametes (ova/eggs) and secretes female sex hormones (estrogen and progesterone) [1 mark].',
            '(ii) Fallopian tube: Site of fertilization of egg by sperm and carries fertilized egg/zygote to uterus [1 mark].',
            '(iii) Uterus: Implantation of embryo and nourishing fetus until birth [1 mark].',
          ],
          modelAnswer:
            '(i) Ovary: Production of female germ cells (ova/eggs) and secretion of hormones like estrogen.\n(ii) Fallopian Tube (Oviduct): Acts as the site of fertilisation and conducts the ovum/embryo toward the uterus.\n(iii) Uterus: Site where the embryo implants in the endometrium lining and develops during the 9 months of gestation.',
        },
      },
    ],
  }),

  // 53. World of Living - Plant Sexual Reproduction (Long Answer 5m)
  q({
    bankKey: 'science-086-wol-flowering-plant-la-2',
    chapterSlug: 'how-do-organisms-reproduce',
    unitId: 'world-of-living',
    topicId: 'sexual-reproduction',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Explain the process of sexual reproduction in flowering plants from pollination to seed formation.\n(i) Trace the path of pollen grain germination on stigma and growth of pollen tube.\n(ii) Explain syngamy and post-fertilization changes leading to fruit and seed development.',
        answerKey: {
          valuePoints: [
            'Pollination and germination: Pollen lands on sticky stigma and germinates, growing a pollen tube through the style towards the ovary containing ovules [2 marks].',
            'Fertilization (Syngamy): Male germ cell travels through the pollen tube and enters the ovule through micropyle to fuse with female gamete (egg cell), forming a diploid zygote [1½ marks].',
            'Post-fertilization: Zygote divides repeatedly to form an embryo within the ovule; ovule develops a protective seed coat forming a seed; ovary ripens and enlarges to form a fruit, while sepals/petals/stamens wither away [1½ marks].',
          ],
          modelAnswer:
            'Process of Sexual Reproduction in Angiosperms:\n1. Pollination & Germination: Pollen grains transfer from anther to stigma. Stigma secretions stimulate pollen germination, producing a pollen tube.\n2. Pollen Tube Growth: The pollen tube grows down the style towards the ovary and penetrates an ovule.\n3. Syngamy: One male gamete fuses with the egg cell inside the embryo sac to produce a zygote.\n4. Seed & Fruit Formation:\n• Zygote develops into an embryo.\n• The ovule develops a tough outer protective coat and becomes a seed.\n• The ovary grows rapidly and ripens into a fruit.\n• Petals, sepals, and stamens shrivel and fall off.',
        },
      },
    ],
  }),

  // 54. Natural Phenomena - Reflection Properties (MCQ 1m)
  q({
    bankKey: 'science-086-np-mirror-magnification-mcq-4',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'reflection-curved-surfaces',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'To obtain an erect and enlarged image using a concave mirror of focal length 10 cm, the object should be placed at a distance of:',
        answerKey: {
          options: ['6 cm', '15 cm', '20 cm', '25 cm'],
          correctOptionIndex: 0,
          valuePoints: ['A concave mirror forms a virtual, erect and enlarged image only when object is between pole and focus (u < f = 10 cm). Thus 6 cm.'],
          modelAnswer: '6 cm',
        },
      },
    ],
  }),

  // 55. Natural Phenomena - Human Eye Accommodation (MCQ 1m)
  q({
    bankKey: 'science-086-np-dispersion-prism-mcq-5',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    unitId: 'natural-phenomena',
    topicId: 'human-eye-defects-corrections',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The ability of the eye lens to adjust its focal length to view near as well as distant objects clearly is called:',
        answerKey: {
          options: ['Power of accommodation', 'Presbyopia', 'Myopia', 'Dispersion'],
          correctOptionIndex: 0,
          valuePoints: ['Ciliary muscles alter the curvature of the eye lens to change focal length; this is accommodation.'],
          modelAnswer: 'Power of accommodation',
        },
      },
    ],
  }),

  // 56. Natural Phenomena - Snell’s Law (MCQ 1m)
  q({
    bankKey: 'science-086-np-refraction-laws-mcq-6',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'laws-of-refraction-refractive-index',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'According to Snell’s law of refraction, for a given pair of media and color of light, the ratio of sin(i) to sin(r) is:',
        answerKey: {
          options: ['Constant', 'Always equal to 1', 'Directly proportional to angle of incidence', 'Zero'],
          correctOptionIndex: 0,
          valuePoints: ['sin(i) / sin(r) = n₂₁ = constant (refractive index of second medium with respect to first medium).'],
          modelAnswer: 'Constant',
        },
      },
    ],
  }),

  // 57. Natural Phenomena - Power of Lens Combination (Short Answer 2m)
  q({
    bankKey: 'science-086-np-lens-combination-vsa-2',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'spherical-lenses-formula-power',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A convex lens of power +3.5 D is placed in contact with a concave lens of power -1.5 D. Calculate the net power and effective focal length of the combination.',
        answerKey: {
          valuePoints: [
            'Net power P = P₁ + P₂ = +3.5 D + (-1.5 D) = +2.0 D [1 mark].',
            'Effective focal length f = 1 / P = 1 / 2.0 m = +0.5 m = +50 cm [1 mark].',
          ],
          modelAnswer:
            'Net Power P = P₁ + P₂ = +3.5 D + (-1.5 D) = +2.0 D\nEffective Focal Length f = 1 / P = 1 / 2.0 = +0.5 m = +50 cm (converging system).',
        },
      },
    ],
  }),

  // 58. Natural Phenomena - Hypermetropia (Short Answer 3m)
  q({
    bankKey: 'science-086-np-hypermetropia-sa-2',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    unitId: 'natural-phenomena',
    topicId: 'human-eye-defects-corrections',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A student suffering from hypermetropia (far-sightedness) has a near point of 75 cm.\n(i) State two possible causes of hypermetropia.\n(ii) Name the type of corrective lens required.\n(iii) Calculate the power of the lens required to read a book clearly at 25 cm.',
        answerKey: {
          valuePoints: [
            '(i) Causes: 1. Focal length of eye lens is too long, 2. Eyeball has become too small / shortened [1 mark].',
            '(ii) Corrective lens: Convex lens (converging lens) [½ mark].',
            '(iii) Calculation: u = -25 cm, v = -75 cm. 1/f = 1/v - 1/u = 1/(-75) - 1/(-25) = -1/75 + 3/75 = 2/75 cm⁻¹ → f = +37.5 cm = +0.375 m → P = 1 / 0.375 = +2.67 D [1½ marks].',
          ],
          modelAnswer:
            '(i) Causes: 1. Focal length of the eye lens is too long. 2. The eyeball has become too short.\n(ii) Corrective Lens: Convex lens.\n(iii) Given u = -25 cm, v = -75 cm\n1/f = 1/v - 1/u = -1/75 - (-1/25) = 2/75\nf = +37.5 cm = +0.375 m\nPower P = 1/f = 1/0.375 = +2.67 D',
        },
      },
    ],
  }),

  // 59. Natural Phenomena - Ray Diagram & Mirror Formula (Numerical 5m)
  q({
    bankKey: 'science-086-np-mirror-lens-ray-diagram-la-1',
    chapterSlug: 'light-reflection-and-refraction',
    unitId: 'natural-phenomena',
    topicId: 'mirror-formula-magnification',
    questionType: 'numerical',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A concave mirror produces a three times magnified real image of an object placed at 10 cm in front of it.\n(i) Find the position of the image and the focal length of the mirror.\n(ii) Where should the object be placed to get a virtual image three times magnified?\n(iii) State two practical applications of concave mirrors in daily life.',
        answerKey: {
          valuePoints: [
            '(i) m = -3 (real image), u = -10 cm. m = -v/u → -3 = -v/(-10) → v = -30 cm. Mirror formula: 1/f = 1/v + 1/u = -1/30 - 1/10 = -4/30 → f = -7.5 cm [2 marks].',
            '(ii) For virtual image: m = +3. m = -v/u → +3 = -v/u → v = -3u. 1/f = 1/v + 1/u → -1/7.5 = -1/(3u) + 1/u = 2/(3u) → 3u = -15 → u = -5 cm (object at 5 cm) [2 marks].',
            '(iii) Uses: 1. Shaving / makeup mirrors (enlarged erect face image), 2. Headlights of vehicles / solar furnaces (parallel beams of light) [1 mark].',
          ],
          modelAnswer:
            '(i) For real image: m = -3, u = -10 cm\nm = -v/u ⇒ -3 = -v/(-10) ⇒ v = -30 cm\n1/f = 1/v + 1/u = -1/30 - 1/10 = -4/30\nf = -7.5 cm\n\n(ii) For virtual image: m = +3\nm = -v/u ⇒ +3 = -v/u ⇒ v = -3u\n1/(-7.5) = 1/(-3u) + 1/u = 2/(3u)\n3u = -15 ⇒ u = -5 cm (object must be placed at 5 cm in front of the mirror).\n\n(iii) Practical Applications:\n1. Used by dentists to see enlarged images of teeth.\n2. Used as reflectors in vehicle headlights and searchlights.',
        },
      },
    ],
  }),

  // 60. Effects of Current - Electric Current (MCQ 1m)
  q({
    bankKey: 'science-086-ec-current-definition-mcq-4',
    chapterSlug: 'electricity',
    unitId: 'effects-of-current',
    topicId: 'electric-current-potential-difference',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes. The amount of electric charge that flows through the circuit is:',
        answerKey: {
          options: ['300 C', '5 C', '50 C', '600 C'],
          correctOptionIndex: 0,
          valuePoints: ['Q = I × t = 0.5 A × (10 × 60 s) = 0.5 × 600 = 300 C.'],
          modelAnswer: '300 C',
        },
      },
    ],
  }),

  // 61. Effects of Current - AC Frequency (MCQ 1m)
  q({
    bankKey: 'science-086-ec-ac-dc-mcq-5',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'direct-alternating-current',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In India, the frequency of alternating current (AC) supplied to households is:',
        answerKey: {
          options: ['50 Hz', '60 Hz', '100 Hz', '0 Hz'],
          correctOptionIndex: 0,
          valuePoints: ['Domestic AC supply in India has a frequency of 50 Hz (changes direction every 1/100 second).'],
          modelAnswer: '50 Hz',
        },
      },
    ],
  }),

  // 62. Effects of Current - Magnetic Field Direction (MCQ 1m)
  q({
    bankKey: 'science-086-ec-magnetic-force-mcq-6',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'magnetic-field-and-field-lines',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The direction of magnetic field lines outside a bar magnet is taken from:',
        answerKey: {
          options: ['North pole to South pole', 'South pole to North pole', 'East pole to West pole', 'Center to ends'],
          correctOptionIndex: 0,
          valuePoints: ['By convention, magnetic field lines emerge from North pole and enter into South pole outside the magnet.'],
          modelAnswer: 'North pole to South pole',
        },
      },
    ],
  }),

  // 63. Effects of Current - Solenoid (Short Answer 2m)
  q({
    bankKey: 'science-086-ec-solenoid-vsa-2',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'magnetic-field-current-conductor-coil-solenoid',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is a solenoid? State two ways to increase the strength of the magnetic field produced by a current-carrying solenoid.',
        answerKey: {
          valuePoints: [
            'Definition: A coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder [1 mark].',
            'Ways to increase field: (i) Increasing the number of turns in the coil, (ii) Increasing the magnitude of current flowing through it, (iii) Inserting a soft iron core inside [1 mark].',
          ],
          modelAnswer:
            'A solenoid is a long cylindrical coil containing many turns of insulated copper wire.\nWays to increase magnetic strength:\n1. Increase the magnitude of electric current.\n2. Increase the number of turns per unit length.\n3. Insert a soft iron core into the solenoid.',
        },
      },
    ],
  }),

  // 64. Effects of Current - Fleming’s Left-Hand Rule (Short Answer 3m)
  q({
    bankKey: 'science-086-ec-flemings-left-hand-sa-2',
    chapterSlug: 'magnetic-effects-of-electric-current',
    unitId: 'effects-of-current',
    topicId: 'force-on-current-carrying-conductor',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State Fleming’s Left-Hand Rule. An electron enters a uniform magnetic field at right angles to it pointing into the page. If the electron moves towards the right, what is the direction of force acting on the electron?',
        answerKey: {
          valuePoints: [
            'Fleming’s Left-Hand Rule: Stretch thumb, forefinger and middle finger of left hand mutually perpendicular. Forefinger = Magnetic Field, Middle finger = Current, Thumb = Direction of Force/Motion [1½ marks].',
            'Direction for electron: Direction of current is opposite to electron movement (i.e. towards left). Magnetic field is into the page. By Fleming’s Left-Hand rule, thumb points downward. So force acts downwards [1½ marks].',
          ],
          modelAnswer:
            'Fleming’s Left-Hand Rule: Stretch the thumb, forefinger, and middle finger of the left hand mutually perpendicular to each other. If the forefinger represents the magnetic field and middle finger represents the direction of electric current, then the thumb points in the direction of motion/force acting on the conductor.\n\nApplication:\n• Magnetic field: into the page\n• Current: towards left (opposite to electron motion towards right)\n• By Fleming’s left-hand rule, the force on the electron acts downwards.',
        },
      },
    ],
  }),

  // 65. Natural Resources - Trophic Levels (MCQ 1m)
  q({
    bankKey: 'science-086-nr-trophic-levels-mcq-3',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'ecosystem',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In an ecosystem, autotrophs represent the:',
        answerKey: {
          options: ['First trophic level', 'Second trophic level', 'Third trophic level', 'Decomposer level'],
          correctOptionIndex: 0,
          valuePoints: ['Producers (green plants / autotrophs) always occupy the first trophic level in any food chain.'],
          modelAnswer: 'First trophic level',
        },
      },
    ],
  }),

  // 66. Natural Resources - Ozone Reactions (Short Answer 2m)
  q({
    bankKey: 'science-086-nr-ozone-formation-vsa-2',
    chapterSlug: 'our-environment',
    unitId: 'natural-resources',
    topicId: 'ozone-depletion',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How is ozone formed in the upper atmosphere? Write the chemical reactions involved and state one reason why ozone is vital for life on Earth.',
        answerKey: {
          valuePoints: [
            'Formation equations: O₂ -(UV rays)→ O + O; O + O₂ → O₃ (Ozone) [1 mark].',
            'Importance: Ozone layer absorbs harmful ultraviolet (UV) radiation from the Sun, shielding living organisms from skin cancers, cataracts, and crop damage [1 mark].',
          ],
          modelAnswer:
            'Formation of Ozone:\nHigh-energy UV radiation splits molecular oxygen into free oxygen atoms:\nO₂ -(UV)→ O + O\nFree oxygen atom combines with molecular oxygen to form ozone:\nO + O₂ → O₃\n\nVital role: Ozone shields terrestrial life by absorbing mutagenic UV-B rays from the sun.',
        },
      },
    ],
  }),
];

