// Chemical Balancer Blitz - Class 10 NCERT Chemical Reactions Database & Atom Balancing Engine

export interface ChemicalCompound {
  formula: string;
  name: string;
  atoms: Record<string, number>;
}

export type ReactionType =
  | 'Combination'
  | 'Decomposition'
  | 'Displacement'
  | 'Double Displacement'
  | 'Redox'
  | 'Combustion'
  | 'Neutralization'
  | 'Esterification'
  | 'Saponification';

export interface ChemicalReaction {
  id: string;
  name: string;
  chapter: string;
  chapterSlug: string;
  type: ReactionType;
  difficulty: 'easy' | 'medium' | 'hard';
  reactants: ChemicalCompound[];
  products: ChemicalCompound[];
  solution: number[]; // e.g. [2, 1, 2] for 2Mg + 1O2 -> 2MgO
  boardNote: string;
  trapWarning?: string;
}

const c = (formula: string, name: string, atoms: Record<string, number>): ChemicalCompound => ({
  formula,
  name,
  atoms,
});

export const CHEMICAL_REACTIONS: ChemicalReaction[] = [
  // --- EASY (Tiers 1-10: 2 reactants -> 1 product or basic combinations) ---
  {
    id: 'magnesium-oxygen',
    name: 'Burning Magnesium Ribbon in Air',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combination',
    difficulty: 'easy',
    reactants: [c('Mg', 'Magnesium', { Mg: 1 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('MgO', 'Magnesium Oxide', { Mg: 1, O: 1 })],
    solution: [2, 1, 2],
    boardNote: 'Magnesium burns with a dazzling white flame and changes into a white powder of magnesium oxide (Basic oxide).',
    trapWarning: 'Clean magnesium ribbon with sandpaper before burning to remove the protective basic magnesium carbonate layer.',
  },
  {
    id: 'hydrogen-chlorine',
    name: 'Synthesis of Hydrogen Chloride',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combination',
    difficulty: 'easy',
    reactants: [c('H₂', 'Hydrogen', { H: 2 }), c('Cl₂', 'Chlorine', { Cl: 2 })],
    products: [c('HCl', 'Hydrogen Chloride', { H: 1, Cl: 1 })],
    solution: [1, 1, 2],
    boardNote: 'Gaseous combination forming hydrogen chloride fumes. In aqueous medium it forms hydrochloric acid.',
  },
  {
    id: 'calcium-oxide-water',
    name: 'Slaking of Quicklime (Whitewashing)',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combination',
    difficulty: 'easy',
    reactants: [c('CaO', 'Quicklime', { Ca: 1, O: 1 }), c('H₂O', 'Water', { H: 2, O: 1 })],
    products: [c('Ca(OH)₂', 'Slaked Lime', { Ca: 1, O: 2, H: 2 })],
    solution: [1, 1, 1],
    boardNote: 'Vigorously exothermic combination releasing immense heat. Slaked lime solution is applied to walls for whitewashing.',
  },
  {
    id: 'carbon-oxygen',
    name: 'Combustion of Coal / Carbon',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combustion',
    difficulty: 'easy',
    reactants: [c('C', 'Carbon', { C: 1 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 })],
    solution: [1, 1, 1],
    boardNote: 'Complete combustion of carbon fuels produces carbon dioxide and heat energy.',
  },
  {
    id: 'hydrogen-oxygen',
    name: 'Formation of Water',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combination',
    difficulty: 'easy',
    reactants: [c('H₂', 'Hydrogen', { H: 2 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('H₂O', 'Water', { H: 2, O: 1 })],
    solution: [2, 1, 2],
    boardNote: 'Highly exothermic synthesis reaction. In reverse (electrolysis), hydrogen and oxygen evolve in a 2:1 volume ratio.',
  },
  {
    id: 'calcium-carbonate-decomposition',
    name: 'Thermal Decomposition of Limestone',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Decomposition',
    difficulty: 'easy',
    reactants: [c('CaCO₃', 'Limestone', { Ca: 1, C: 1, O: 3 })],
    products: [c('CaO', 'Quicklime', { Ca: 1, O: 1 }), c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 })],
    solution: [1, 1, 1],
    boardNote: 'Important industrial thermal decomposition used in manufacturing cement.',
  },
  {
    id: 'copper-oxidation',
    name: 'Surface Oxidation of Copper',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Redox',
    difficulty: 'easy',
    reactants: [c('Cu', 'Copper', { Cu: 1 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('CuO', 'Copper(II) Oxide', { Cu: 1, O: 1 })],
    solution: [2, 1, 2],
    boardNote: 'Brown copper powder turns black due to the formation of a surface layer of copper(II) oxide.',
  },
  {
    id: 'copper-oxide-hydrogen',
    name: 'Reduction of Black Copper Oxide',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Redox',
    difficulty: 'easy',
    reactants: [c('CuO', 'Copper(II) Oxide', { Cu: 1, O: 1 }), c('H₂', 'Hydrogen', { H: 2 })],
    products: [c('Cu', 'Copper', { Cu: 1 }), c('H₂O', 'Water', { H: 2, O: 1 })],
    solution: [1, 1, 1, 1],
    boardNote: 'Passing hydrogen gas over heated CuO reduces the black coating back into reddish-brown shiny copper metal.',
    trapWarning: 'CuO is reduced to Cu; H₂ is oxidized to H₂O.',
  },
  {
    id: 'zinc-hydrochloric',
    name: 'Zinc Metal with Hydrochloric Acid',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    type: 'Displacement',
    difficulty: 'easy',
    reactants: [c('Zn', 'Zinc', { Zn: 1 }), c('HCl', 'Hydrochloric Acid', { H: 1, Cl: 1 })],
    products: [c('ZnCl₂', 'Zinc Chloride', { Zn: 1, Cl: 2 }), c('H₂', 'Hydrogen', { H: 2 })],
    solution: [1, 2, 1, 1],
    boardNote: 'Brisk effervescence of colorless, odorless hydrogen gas which burns with a characteristic pop sound.',
  },
  {
    id: 'iron-copper-sulphate',
    name: 'Iron Nail in Blue Copper Sulphate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Displacement',
    difficulty: 'easy',
    reactants: [c('Fe', 'Iron', { Fe: 1 }), c('CuSO₄', 'Copper Sulphate', { Cu: 1, S: 1, O: 4 })],
    products: [c('FeSO₄', 'Ferrous Sulphate', { Fe: 1, S: 1, O: 4 }), c('Cu', 'Copper', { Cu: 1 })],
    solution: [1, 1, 1, 1],
    boardNote: 'The blue solution turns pale green (FeSO₄) and a reddish-brown crust of copper deposits on the iron nail.',
  },

  // --- MEDIUM (Tiers 11-20: Double displacements, precipitates, decompositions) ---
  {
    id: 'silver-chloride-photolysis',
    name: 'Photolytic Decomposition of Silver Chloride',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Decomposition',
    difficulty: 'medium',
    reactants: [c('AgCl', 'Silver Chloride', { Ag: 1, Cl: 1 })],
    products: [c('Ag', 'Silver', { Ag: 1 }), c('Cl₂', 'Chlorine', { Cl: 2 })],
    solution: [2, 2, 1],
    boardNote: 'White silver chloride turns grey in sunlight. Used in black-and-white photography.',
  },
  {
    id: 'silver-bromide-photolysis',
    name: 'Photolysis of Silver Bromide',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Decomposition',
    difficulty: 'medium',
    reactants: [c('AgBr', 'Silver Bromide', { Ag: 1, Br: 1 })],
    products: [c('Ag', 'Silver', { Ag: 1 }), c('Br₂', 'Bromine', { Br: 2 })],
    solution: [2, 2, 1],
    boardNote: 'Pale yellow silver bromide decomposes into grey silver metal and reddish-brown bromine gas in sunlight.',
  },
  {
    id: 'sodium-sulphate-barium-chloride',
    name: 'Barium Sulphate White Precipitate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Double Displacement',
    difficulty: 'medium',
    reactants: [
      c('Na₂SO₄', 'Sodium Sulphate', { Na: 2, S: 1, O: 4 }),
      c('BaCl₂', 'Barium Chloride', { Ba: 1, Cl: 2 }),
    ],
    products: [
      c('BaSO₄', 'Barium Sulphate', { Ba: 1, S: 1, O: 4 }),
      c('NaCl', 'Sodium Chloride', { Na: 1, Cl: 1 }),
    ],
    solution: [1, 1, 1, 2],
    boardNote: 'Classic precipitation reaction: an insoluble white precipitate of BaSO₄ forms immediately.',
  },
  {
    id: 'lead-nitrate-potassium-iodide',
    name: 'Lead Iodide Bright Yellow Precipitate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Double Displacement',
    difficulty: 'medium',
    reactants: [
      c('Pb(NO₃)₂', 'Lead Nitrate', { Pb: 1, N: 2, O: 6 }),
      c('KI', 'Potassium Iodide', { K: 1, I: 1 }),
    ],
    products: [
      c('PbI₂', 'Lead Iodide', { Pb: 1, I: 2 }),
      c('KNO₃', 'Potassium Nitrate', { K: 1, N: 1, O: 3 }),
    ],
    solution: [1, 2, 1, 2],
    boardNote: 'Mixing two clear colorless solutions yields a bright canary-yellow precipitate of PbI₂.',
  },
  {
    id: 'sodium-water',
    name: 'Violent Reaction of Sodium with Water',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    type: 'Displacement',
    difficulty: 'medium',
    reactants: [c('Na', 'Sodium', { Na: 1 }), c('H₂O', 'Water', { H: 2, O: 1 })],
    products: [c('NaOH', 'Sodium Hydroxide', { Na: 1, O: 1, H: 1 }), c('H₂', 'Hydrogen', { H: 2 })],
    solution: [2, 2, 2, 1],
    boardNote: 'Highly exothermic: evolved hydrogen catches fire instantly with a golden yellow flame.',
  },
  {
    id: 'zinc-copper-sulphate',
    name: 'Zinc Strip in Copper Sulphate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Displacement',
    difficulty: 'medium',
    reactants: [c('Zn', 'Zinc', { Zn: 1 }), c('CuSO₄', 'Copper Sulphate', { Cu: 1, S: 1, O: 4 })],
    products: [c('ZnSO₄', 'Zinc Sulphate', { Zn: 1, S: 1, O: 4 }), c('Cu', 'Copper', { Cu: 1 })],
    solution: [1, 1, 1, 1],
    boardNote: 'Blue copper sulphate turns colorless because zinc is more reactive than copper.',
  },
  {
    id: 'methane-combustion',
    name: 'Combustion of Natural Gas (Methane)',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Combustion',
    difficulty: 'medium',
    reactants: [c('CH₄', 'Methane', { C: 1, H: 4 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }), c('H₂O', 'Water', { H: 2, O: 1 })],
    solution: [1, 2, 1, 2],
    boardNote: 'Exothermic reaction generating a clean blue flame in CNG and biogas stoves.',
  },
  {
    id: 'limewater-carbon-dioxide',
    name: 'Passing CO₂ Gas through Limewater',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    type: 'Double Displacement',
    difficulty: 'medium',
    reactants: [
      c('Ca(OH)₂', 'Slaked Lime', { Ca: 1, O: 2, H: 2 }),
      c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }),
    ],
    products: [
      c('CaCO₃', 'Calcium Carbonate', { Ca: 1, C: 1, O: 3 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
    ],
    solution: [1, 1, 1, 1],
    boardNote: 'Limewater turns milky due to the formation of insoluble calcium carbonate precipitate.',
  },
  {
    id: 'baking-soda-heating',
    name: 'Thermal Decomposition of Baking Soda',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    type: 'Decomposition',
    difficulty: 'medium',
    reactants: [c('NaHCO₃', 'Sodium Hydrogen Carbonate', { Na: 1, H: 1, C: 1, O: 3 })],
    products: [
      c('Na₂CO₃', 'Sodium Carbonate', { Na: 2, C: 1, O: 3 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
      c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }),
    ],
    solution: [2, 1, 1, 1],
    boardNote: 'Heating baking soda during cooking releases CO₂ gas, which causes cakes and bread to rise and become spongy.',
  },
  {
    id: 'ferrous-sulphate-decomposition',
    name: 'Heating Green Vitriol (Ferrous Sulphate)',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Decomposition',
    difficulty: 'medium',
    reactants: [c('FeSO₄', 'Ferrous Sulphate', { Fe: 1, S: 1, O: 4 })],
    products: [
      c('Fe₂O₃', 'Ferric Oxide', { Fe: 2, O: 3 }),
      c('SO₂', 'Sulphur Dioxide', { S: 1, O: 2 }),
      c('SO₃', 'Sulphur Trioxide', { S: 1, O: 3 }),
    ],
    solution: [2, 1, 1, 1],
    boardNote: 'Green crystals turn reddish-brown Fe₂O₃ with the evolution of pungent choking fumes of SO₂ and SO₃.',
    trapWarning: 'Initial heating first drives off 7 water molecules of crystallization (FeSO₄·7H₂O → FeSO₄).',
  },

  // --- HARD (Tiers 21-30: Complex polyatomic ions, organics, thermite, lead nitrate) ---
  {
    id: 'iron-steam',
    name: 'Red-Hot Iron Reacting with Steam',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Redox',
    difficulty: 'hard',
    reactants: [c('Fe', 'Iron', { Fe: 1 }), c('H₂O', 'Steam', { H: 2, O: 1 })],
    products: [c('Fe₃O₄', 'Magnetic Iron Oxide', { Fe: 3, O: 4 }), c('H₂', 'Hydrogen', { H: 2 })],
    solution: [3, 4, 1, 4],
    boardNote: 'NCERT textbook landmark balancing example: Fe₃O₄ is a mixed oxide (FeO·Fe₂O₃).',
  },
  {
    id: 'lead-nitrate-decomposition',
    name: 'Thermal Decomposition of Lead Nitrate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Decomposition',
    difficulty: 'hard',
    reactants: [c('Pb(NO₃)₂', 'Lead Nitrate', { Pb: 1, N: 2, O: 6 })],
    products: [
      c('PbO', 'Lead Monoxide', { Pb: 1, O: 1 }),
      c('NO₂', 'Nitrogen Dioxide', { N: 1, O: 2 }),
      c('O₂', 'Oxygen', { O: 2 }),
    ],
    solution: [2, 2, 4, 1],
    boardNote: 'Crucial CBSE board question: Brown fumes of NO₂ gas evolve and a yellow solid residue of PbO remains.',
  },
  {
    id: 'thermite-reaction',
    name: 'Thermite Reaction for Railway Welding',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    type: 'Displacement',
    difficulty: 'hard',
    reactants: [c('Al', 'Aluminium', { Al: 1 }), c('Fe₂O₃', 'Iron(III) Oxide', { Fe: 2, O: 3 })],
    products: [c('Al₂O₃', 'Aluminium Oxide', { Al: 2, O: 3 }), c('Fe', 'Molten Iron', { Fe: 1 })],
    solution: [2, 1, 1, 2],
    boardNote: 'So fiercely exothermic that the displaced iron metal is produced in molten liquid form to weld railway tracks.',
  },
  {
    id: 'cellular-respiration',
    name: 'Cellular Respiration (Glucose Breakdown)',
    chapter: 'Life Processes / Chemical Reactions',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Redox',
    difficulty: 'hard',
    reactants: [c('C₆H₁₂O₆', 'Glucose', { C: 6, H: 12, O: 6 }), c('O₂', 'Oxygen', { O: 2 })],
    products: [c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }), c('H₂O', 'Water', { H: 2, O: 1 })],
    solution: [1, 6, 6, 6],
    boardNote: 'Respiration is an exothermic process that produces ATP energy in mitochondria for living cells.',
  },
  {
    id: 'photosynthesis-master',
    name: 'Photosynthesis Master Equation',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    type: 'Redox',
    difficulty: 'hard',
    reactants: [
      c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
    ],
    products: [
      c('C₆H₁₂O₆', 'Glucose', { C: 6, H: 12, O: 6 }),
      c('O₂', 'Oxygen', { O: 2 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
    ],
    solution: [6, 12, 1, 6, 6],
    boardNote: 'Official NCERT Class 10 balanced biochemical equation for photosynthesis involving light absorption and reduction of CO₂.',
  },
  {
    id: 'aluminium-hydrochloric',
    name: 'Aluminium Reacting with Dilute Acid',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    type: 'Displacement',
    difficulty: 'hard',
    reactants: [c('Al', 'Aluminium', { Al: 1 }), c('HCl', 'Hydrochloric Acid', { H: 1, Cl: 1 })],
    products: [c('AlCl₃', 'Aluminium Chloride', { Al: 1, Cl: 3 }), c('H₂', 'Hydrogen', { H: 2 })],
    solution: [2, 6, 2, 3],
    boardNote: 'Aluminium reacts vigorously with dilute HCl after its protective Al₂O₃ oxide layer dissolves.',
  },
  {
    id: 'esterification-reaction',
    name: 'Esterification (Fruity Ester Formation)',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    type: 'Esterification',
    difficulty: 'hard',
    reactants: [
      c('CH₃COOH', 'Ethanoic Acid', { C: 2, H: 4, O: 2 }),
      c('C₂H₅OH', 'Ethanol', { C: 2, H: 6, O: 1 }),
    ],
    products: [
      c('CH₃COOC₂H₅', 'Ethyl Ethanoate', { C: 4, H: 8, O: 2 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
    ],
    solution: [1, 1, 1, 1],
    boardNote: 'Heated in presence of conc. H₂SO₄ catalyst; gives sweet fruity odor characteristic of esters.',
  },
  {
    id: 'saponification-soap',
    name: 'Saponification (Alkaline Soap Hydrolysis)',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    type: 'Saponification',
    difficulty: 'hard',
    reactants: [
      c('CH₃COOC₂H₅', 'Ethyl Ethanoate', { C: 4, H: 8, O: 2 }),
      c('NaOH', 'Sodium Hydroxide', { Na: 1, O: 1, H: 1 }),
    ],
    products: [
      c('CH₃COONa', 'Sodium Ethanoate', { C: 2, H: 3, Na: 1, O: 2 }),
      c('C₂H₅OH', 'Ethanol', { C: 2, H: 6, O: 1 }),
    ],
    solution: [1, 1, 1, 1],
    boardNote: 'Esters react with alkali to regenerate alcohol and sodium salt of carboxylic acid (Soap).',
  },
  {
    id: 'ethanol-combustion',
    name: 'Combustion of Biofuel Ethanol',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    type: 'Combustion',
    difficulty: 'hard',
    reactants: [
      c('C₂H₅OH', 'Ethanol', { C: 2, H: 6, O: 1 }),
      c('O₂', 'Oxygen', { O: 2 }),
    ],
    products: [
      c('CO₂', 'Carbon Dioxide', { C: 1, O: 2 }),
      c('H₂O', 'Water', { H: 2, O: 1 }),
    ],
    solution: [1, 3, 2, 3],
    boardNote: 'Ethanol burns cleanly with a clear blue flame without smoke, making it an excellent additive to petrol.',
  },
  {
    id: 'barium-aluminium-sulphate',
    name: 'Barium Chloride with Aluminium Sulphate',
    chapter: 'Chemical Reactions and Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    type: 'Double Displacement',
    difficulty: 'hard',
    reactants: [
      c('BaCl₂', 'Barium Chloride', { Ba: 1, Cl: 2 }),
      c('Al₂(SO₄)₃', 'Aluminium Sulphate', { Al: 2, S: 3, O: 12 }),
    ],
    products: [
      c('BaSO₄', 'Barium Sulphate', { Ba: 1, S: 1, O: 4 }),
      c('AlCl₃', 'Aluminium Chloride', { Al: 1, Cl: 3 }),
    ],
    solution: [3, 1, 3, 2],
    boardNote: 'NCERT in-text question: Involves balancing polyatomic sulphate (SO₄) and aluminium ions.',
  },
];

// Helper: Count total atoms on a side
export function countTotalAtoms(
  compounds: ChemicalCompound[],
  coefficients: number[]
): Record<string, number> {
  const totals: Record<string, number> = {};
  compounds.forEach((comp, idx) => {
    const coeff = coefficients[idx] || 0;
    for (const [element, count] of Object.entries(comp.atoms)) {
      totals[element] = (totals[element] || 0) + count * coeff;
    }
  });
  return totals;
}

// Helper: Check if reactants and products are balanced for all elements
export function checkIfBalanced(
  reaction: ChemicalReaction,
  coefficients: number[]
): {
  isBalanced: boolean;
  elements: {
    element: string;
    reactantCount: number;
    productCount: number;
    balanced: boolean;
  }[];
} {
  const numReactants = reaction.reactants.length;
  const reactantCoeffs = coefficients.slice(0, numReactants);
  const productCoeffs = coefficients.slice(numReactants);

  const reactantAtoms = countTotalAtoms(reaction.reactants, reactantCoeffs);
  const productAtoms = countTotalAtoms(reaction.products, productCoeffs);

  // Collect all unique elements
  const allElements = Array.from(
    new Set([...Object.keys(reactantAtoms), ...Object.keys(productAtoms)])
  );

  let allMatch = true;
  const elements = allElements.map((element) => {
    const rCount = reactantAtoms[element] || 0;
    const pCount = productAtoms[element] || 0;
    const balanced = rCount > 0 && rCount === pCount;
    if (!balanced) allMatch = false;
    return {
      element,
      reactantCount: rCount,
      productCount: pCount,
      balanced,
    };
  });

  return {
    isBalanced: allMatch && coefficients.every((c) => c > 0),
    elements,
  };
}

// Helper: Check if coefficients match the exact solution (or a multiple)
export function isExactSolution(
  reaction: ChemicalReaction,
  coefficients: number[]
): boolean {
  if (coefficients.length !== reaction.solution.length) return false;
  return reaction.solution.every((val, idx) => val === coefficients[idx]);
}
