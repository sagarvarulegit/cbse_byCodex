export type ActivitySubject = 'chemistry' | 'biology' | 'physics';

export interface BoardExamQuestion {
  year: string;
  marks: number;
  question: string;
  answerKey: string;
}

export interface NcertActivity {
  id: string;
  activityNumber: string;
  chapterSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  subject: ActivitySubject;
  title: string;
  aim: string;
  materials: string[];
  procedure: string[];
  observation: string;
  reactionEquation?: string;
  inferenceConclusion: string;
  boardExamQuestions: BoardExamQuestion[];
  illustrationDemoId?: string;
  isFreeSample: boolean;
}

export const NCERT_ACTIVITIES_DATA: NcertActivity[] = [
  // --- CHEMISTRY ---
  // Chapter 1: Chemical Reactions and Equations
  {
    id: 'act-1-1',
    activityNumber: 'Activity 1.1',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subject: 'chemistry',
    title: 'Burning of Magnesium Ribbon in Air',
    aim: 'To observe the chemical reaction when magnesium ribbon is burned in oxygen.',
    materials: ['Magnesium ribbon (3-4 cm)', 'Sandpaper', 'Tongs', 'Spirit lamp/burner', 'Watch glass'],
    procedure: [
      'Clean a piece of magnesium ribbon by rubbing it with sandpaper to remove the basic magnesium oxide layer.',
      'Hold the ribbon with a pair of tongs.',
      'Ignite the other end using a spirit lamp or burner.',
      'Collect the white ash formed in a watch glass while keeping it away from the eyes.',
    ],
    observation: 'Magnesium ribbon burns with a dazzling white flame and changes into a white powder.',
    reactionEquation: '2Mg(s) + O_2(g) \\xrightarrow{\\Delta} 2MgO(s) + \\text{Heat} + \\text{Light}',
    inferenceConclusion: 'Magnesium reacts vigorously with atmospheric oxygen to form Magnesium Oxide (MgO), which is basic in nature. This is a Combination Reaction and an Exothermic reaction.',
    illustrationDemoId: 'figure-1-1-magnesium-burn',
    isFreeSample: true,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2020',
        marks: 2,
        question: 'Why should a magnesium ribbon be cleaned before burning in air? Write the balanced chemical equation with state symbols.',
        answerKey: 'Magnesium is a reactive metal. When exposed to air, it forms a protective layer of basic magnesium carbonate/oxide on its surface. Cleaning with sandpaper removes this layer so that the metal burns smoothly. Equation: 2Mg(s) + O₂(g) → 2MgO(s).',
      },
      {
        year: 'CBSE 2019',
        marks: 3,
        question: 'What is observed when magnesium ribbon burns? Name the type of reaction and test the nature of the product with litmus.',
        answerKey: 'Observation: Burns with a dazzling white flame forming a white powder (MgO). Reaction type: Combination & Exothermic reaction. Nature: When MgO is dissolved in water (MgO + H₂O → Mg(OH)₂), it turns red litmus blue, proving it is basic.',
      },
    ],
  },
  {
    id: 'act-1-2',
    activityNumber: 'Activity 1.2',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subject: 'chemistry',
    title: 'Reaction of Lead Nitrate with Potassium Iodide',
    aim: 'To observe the double displacement and precipitation reaction between lead nitrate and potassium iodide solutions.',
    materials: ['Lead nitrate solution', 'Potassium iodide solution', 'Test tubes'],
    procedure: [
      'Take 2 mL of clear lead nitrate solution in a test tube.',
      'Add 2 mL of colourless potassium iodide solution to it.',
      'Observe the colour change and precipitate formation.',
    ],
    observation: 'A bright yellow precipitate is immediately formed upon mixing the two colourless solutions.',
    reactionEquation: 'Pb(NO_3)_2(aq) + 2KI(aq) \\rightarrow PbI_2(s) \\downarrow (\\text{Yellow ppt}) + 2KNO_3(aq)',
    inferenceConclusion: 'An exchange of ions takes place between Pb²⁺ and I⁻ to form insoluble Lead Iodide (PbI₂). This is a Double Displacement and Precipitation Reaction.',
    illustrationDemoId: 'figure-1-2-lead-nitrate-ki',
    isFreeSample: true,
    boardExamQuestions: [
      {
        year: 'CBSE 2024, 2018',
        marks: 3,
        question: 'Name the compound formed as precipitate when lead nitrate reacts with potassium iodide. Give the balanced equation and mention the colour of the precipitate.',
        answerKey: 'Compound: Lead(II) Iodide (PbI₂). Colour: Yellow precipitate. Balanced equation: Pb(NO₃)₂(aq) + 2KI(aq) → PbI₂(s)↓ + 2KNO₃(aq). Type: Precipitation / Double Displacement reaction.',
      },
    ],
  },
  {
    id: 'act-1-3',
    activityNumber: 'Activity 1.3',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subject: 'chemistry',
    title: 'Reaction of Zinc Granules with Dilute Acid',
    aim: 'To observe the evolution of hydrogen gas and temperature change during single displacement.',
    materials: ['Zinc granules', 'Dilute sulphuric acid / dilute hydrochloric acid', 'Conical flask', 'Single-bore cork with delivery tube', 'Soap solution', 'Burning candle'],
    procedure: [
      'Take a few zinc granules in a conical flask.',
      'Add dilute sulphuric acid or hydrochloric acid slowly.',
      'Observe the surface of zinc granules and touch the flask.',
      'Pass the gas evolved through soap solution and bring a burning candle near the soap bubbles.',
    ],
    observation: 'Bubbles of gas evolve around zinc granules. The flask becomes hot. The gas bubbles burst with a characteristic "POP" sound when tested with a flame.',
    reactionEquation: 'Zn(s) + H_2SO_4(aq) \\rightarrow ZnSO_4(aq) + H_2(g) \\uparrow',
    inferenceConclusion: 'Zinc displaces hydrogen from dilute acid forming zinc sulphate and hydrogen gas. The rise in temperature shows it is an exothermic displacement reaction.',
    illustrationDemoId: 'figure-1-3-zinc-acid-reaction',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2022, 2017',
        marks: 3,
        question: 'How will you test for the presence of hydrogen gas evolved in a metal-acid reaction? Write the chemical equation and state whether heat is released or absorbed.',
        answerKey: 'Test: Bring a burning splinter/candle near the gas bubbles; it burns with a "pop" sound. Equation: Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g). Heat is released (Exothermic reaction).',
      },
    ],
  },
  {
    id: 'act-1-7',
    activityNumber: 'Activity 1.7',
    chapterSlug: 'chemical-reactions-and-equations',
    chapterNumber: 1,
    chapterTitle: 'Chemical Reactions and Equations',
    subject: 'chemistry',
    title: 'Electrolysis of Water (Electrolytic Decomposition)',
    aim: 'To demonstrate the decomposition of water into hydrogen and oxygen gases by electricity.',
    materials: ['Plastic mug with rubber stoppers', 'Carbon electrodes', '6V Battery', 'Dilute sulphuric acid', 'Two graduated test tubes filled with water'],
    procedure: [
      'Fit carbon electrodes into the bottom of a plastic mug and connect them to a 6V battery.',
      'Fill the mug with water and add a few drops of dilute H₂SO₄ to increase electrical conductivity.',
      'Invert two test tubes filled with water over the electrodes.',
      'Switch on the current and leave the setup undisturbed.',
    ],
    observation: 'Bubbles form at both electrodes. The volume of gas collected over the cathode (negative electrode) is twice (2:1) the volume collected over the anode (positive electrode).',
    reactionEquation: '2H_2O(l) \\xrightarrow{\\text{Electric Current}} 2H_2(g) (\\text{Cathode}) + O_2(g) (\\text{Anode})',
    inferenceConclusion: 'Water decomposes into 2 volumes of Hydrogen at cathode and 1 volume of Oxygen at anode because a water molecule contains 2 atoms of hydrogen to 1 atom of oxygen (H₂O).',
    illustrationDemoId: 'figure-1-6-electrolysis-water',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2021, 2016',
        marks: 3,
        question: 'Why is the volume of gas collected over one electrode double that of the other during electrolysis of water? Name the gases at cathode and anode.',
        answerKey: 'Water (H₂O) consists of hydrogen and oxygen in a 2:1 ratio by volume. On decomposition: 2H₂O → 2H₂ + O₂. Cathode gas: Hydrogen (2 volumes). Anode gas: Oxygen (1 volume). Adding dilute H₂SO₄ makes water a good conductor of electricity.',
      },
    ],
  },

  // Chapter 2: Acids, Bases and Salts
  {
    id: 'act-2-1',
    activityNumber: 'Activity 2.1',
    chapterSlug: 'acids-bases-and-salts',
    chapterNumber: 2,
    chapterTitle: 'Acids, Bases and Salts',
    subject: 'chemistry',
    title: 'Testing Acids and Bases with Synthetic & Natural Indicators',
    aim: 'To observe color changes of acids and bases with Litmus, Phenolphthalein, and Methyl Orange.',
    materials: ['Dilute HCl, H₂SO₄, HNO₃, CH₃COOH', 'Dilute NaOH, Ca(OH)₂, KOH, NH₄OH', 'Red & Blue litmus solutions', 'Phenolphthalein indicator', 'Methyl orange indicator', 'Watch glasses'],
    procedure: [
      'Place one drop of each test solution on a watch glass.',
      'Add a drop of red litmus, blue litmus, phenolphthalein, and methyl orange separately to each.',
      'Record the color changes.',
    ],
    observation: 'Acids turn Blue litmus Red, Phenolphthalein Colourless, and Methyl orange Red. Bases turn Red litmus Blue, Phenolphthalein Pink, and Methyl orange Yellow.',
    inferenceConclusion: 'Indicators show distinct color changes depending on the acidic or basic nature of the aqueous medium.',
    illustrationDemoId: 'figure-2-1-indicator-color-changes',
    isFreeSample: true,
    boardExamQuestions: [
      {
        year: 'CBSE 2024, 2019',
        marks: 2,
        question: 'What happens when a drop of phenolphthalein and methyl orange are added separately to a solution of sodium hydroxide?',
        answerKey: 'Phenolphthalein turns deep pink in NaOH (base). Methyl orange turns yellow in NaOH.',
      },
    ],
  },
  {
    id: 'act-2-8',
    activityNumber: 'Activity 2.8',
    chapterSlug: 'acids-bases-and-salts',
    chapterNumber: 2,
    chapterTitle: 'Acids, Bases and Salts',
    subject: 'chemistry',
    title: 'Electrical Conductivity of Acid Solutions vs Glucose/Alcohol',
    aim: 'To verify whether all compounds containing hydrogen conduct electricity and produce H⁺ ions.',
    materials: ['Dilute HCl, H₂SO₄', 'Glucose (C₆H₁₂O₆) and Alcohol (C₂H₅OH) solutions', 'Beaker, rubber cork, two iron nails', '6V Battery, bulb, and switch'],
    procedure: [
      'Fix two nails on a cork and place it in a 100 mL beaker.',
      'Connect nails to terminals of a 6V battery with a bulb and switch in series.',
      'Pour dilute HCl into beaker and switch on the current. Repeat with glucose and alcohol solutions.',
    ],
    observation: 'The bulb glows brightly with dilute HCl and H₂SO₄, but does NOT glow with glucose and alcohol solutions.',
    reactionEquation: 'HCl(aq) \\rightarrow H^+(aq) + Cl^-(aq) \\quad (\\text{Conducts electricity})',
    inferenceConclusion: 'Acids dissociate into ions ($H^+$ and anions) in water which carry electric charge. Glucose and alcohol contain hydrogen but do not dissociate into ions, hence they do not show acidic character.',
    illustrationDemoId: 'figure-2-3-acid-conductivity',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2020',
        marks: 3,
        question: 'Why does an aqueous solution of an acid conduct electricity, while an aqueous solution of glucose or alcohol does not?',
        answerKey: 'An acid dissociates in water into free moving ions (H⁺ and Cl⁻/SO₄²⁻) that conduct electric current. Glucose and alcohol are covalent molecules that do not ionize into free ions in aqueous solution, so the bulb does not glow.',
      },
    ],
  },

  // --- BIOLOGY ---
  // Chapter 5: Life Processes
  {
    id: 'act-5-1',
    activityNumber: 'Activity 5.1',
    chapterSlug: 'life-processes',
    chapterNumber: 5,
    chapterTitle: 'Life Processes',
    subject: 'biology',
    title: 'Chlorophyll is Essential for Photosynthesis (Variegated Leaf)',
    aim: 'To prove that chlorophyll is necessary for the process of photosynthesis using a variegated leaf (Croton or Money plant).',
    materials: ['Potted money plant with variegated leaves', 'Beaker, water bath, alcohol', 'Iodine solution', 'Petri dish', 'Boiling tube'],
    procedure: [
      'Keep potted plant in dark room for 3 days to completely destarch the leaves.',
      'Keep the plant in bright sunlight for 6 hours.',
      'Pluck a leaf and trace green and non-green patches on a sheet of paper.',
      'Boil the leaf in water, then in alcohol over a water bath to decolorize it.',
      'Dip the leaf in dilute iodine solution for 2 minutes and wash off.',
    ],
    observation: 'Only the originally green parts containing chlorophyll turn blue-black with iodine. Non-green (white) parts turn pale brown.',
    inferenceConclusion: 'Starch is synthesized only in regions containing chlorophyll where photosynthesis occurred. Hence, chlorophyll is essential for photosynthesis.',
    illustrationDemoId: 'figure-5-2-variegated-leaf',
    isFreeSample: true,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2019',
        marks: 3,
        question: 'Why is the leaf boiled in alcohol over a water bath during the starch test? What is the role of the water bath?',
        answerKey: 'The leaf is boiled in alcohol to dissolve and remove green chlorophyll pigment so that the blue-black color change with iodine can be clearly seen. Alcohol is highly inflammable, so it is never heated directly; a water bath is used as a safety precaution.',
      },
    ],
  },
  {
    id: 'act-5-2',
    activityNumber: 'Activity 5.2',
    chapterSlug: 'life-processes',
    chapterNumber: 5,
    chapterTitle: 'Life Processes',
    subject: 'biology',
    title: 'Carbon Dioxide ($CO_2$) is Essential for Photosynthesis',
    aim: 'To demonstrate that carbon dioxide is required by green plants to produce starch.',
    materials: ['Two identical destarched potted plants (A and B)', 'Two bell jars', 'Watch glass with Potassium Hydroxide (KOH)', 'Vaseline/grease', 'Glass plates', 'Iodine solution setup'],
    procedure: [
      'Take two destarched plants. Place a watch glass containing KOH beside Plant A under Bell Jar A.',
      'Cover Plant B under Bell Jar B without KOH.',
      'Seal the bottoms of bell jars with vaseline to make them airtight.',
      'Keep both setups in sunlight for 2–3 hours, then test a leaf from each plant for starch.',
    ],
    observation: 'Leaf from Plant A (with KOH) gives negative starch test (remains pale brown). Leaf from Plant B (without KOH) turns blue-black with iodine.',
    inferenceConclusion: 'Potassium hydroxide (KOH) absorbs all $CO_2$ inside Bell Jar A. Without $CO_2$, photosynthesis cannot happen and no starch is formed. Hence $CO_2$ is essential for photosynthesis.',
    illustrationDemoId: 'figure-5-3-bell-jar-koh',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2022, 2018',
        marks: 3,
        question: 'What is the function of potassium hydroxide in the bell jar experiment? What observation confirms the role of CO₂ in photosynthesis?',
        answerKey: 'Function of KOH: It chemically absorbs carbon dioxide (CO₂) from the air in the sealed jar. Observation: The leaf from the plant deprived of CO₂ shows no blue-black color with iodine (no starch formed), proving CO₂ is essential.',
      },
    ],
  },

  // --- PHYSICS ---
  // Chapter 9: Light - Reflection and Refraction
  {
    id: 'act-9-10',
    activityNumber: 'Activity 9.10',
    chapterSlug: 'light-reflection-and-refraction',
    chapterNumber: 9,
    chapterTitle: 'Light - Reflection and Refraction',
    subject: 'physics',
    title: 'Refraction of Light through a Rectangular Glass Slab',
    aim: 'To trace the path of a ray of light through a glass slab and measure the angle of incidence, refraction, and emergence.',
    materials: ['Rectangular glass slab', 'Drawing board, white paper, pins, ruler, protractor'],
    procedure: [
      'Fix white paper on drawing board and draw the outline ABCD of glass slab.',
      'Draw an incident ray $PE$ inclined at angle $i$ to normal $NN\'$ on face AB.',
      'Fix two pins on $PE$ and view their images through opposite face CD. Fix two more pins in line with these images.',
      'Remove slab, join points to trace refracted ray $EF$ and emergent ray $FS$.',
    ],
    observation: 'Light bends towards normal at air-glass boundary and away from normal at glass-air boundary. Angle of incidence equals angle of emergence ($\\angle i = \\angle e$). The emergent ray is parallel to the incident ray but laterally displaced.',
    reactionEquation: 'n = \\frac{\\sin i}{\\sin r} = \\text{Constant (Snell\'s Law)}, \\quad \\angle i = \\angle e',
    inferenceConclusion: 'Refraction occurs due to change in speed of light across different optical media. Lateral displacement occurs because the two refracting surfaces (AB and CD) are parallel.',
    illustrationDemoId: 'figure-9-10-glass-slab',
    isFreeSample: true,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2020',
        marks: 3,
        question: 'State the relation between angle of incidence, angle of refraction and angle of emergence for a rectangular glass slab. Define lateral displacement.',
        answerKey: 'Relation: Angle of incidence (∠i) = Angle of emergence (∠e). Lateral displacement: The perpendicular distance between the original path of the incident light ray and the emergent light ray emerging from a parallel-sided refracting medium.',
      },
    ],
  },
  {
    id: 'act-10-3',
    activityNumber: 'Activity 10.3',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    chapterNumber: 10,
    chapterTitle: 'The Human Eye and the Colourful World',
    subject: 'physics',
    title: 'Dispersion of White Light by a Glass Prism',
    aim: 'To observe the splitting of white light into its component seven colors using a glass prism.',
    materials: ['Glass prism', 'White light source / sunlight through narrow slit', 'White screen'],
    procedure: [
      'Allow a narrow beam of sunlight to fall on one face of a glass prism.',
      'Turn the prism slowly and receive the light emerging from the other face on a white screen.',
    ],
    observation: 'A beautiful band of seven colors (VIBGYOR) appears on the screen. Violet light bends (deviates) the most, while Red light bends the least.',
    reactionEquation: '\\text{Angle of Deviation } (\\delta): \\quad \\delta_{\\text{Violet}} > \\delta_{\\text{Indigo}} > \\dots > \\delta_{\\text{Red}}',
    inferenceConclusion: 'Different colors of white light have different wavelengths and travel with different speeds in glass. Violet bends the most because it has the shortest wavelength and lowest speed in glass; Red bends the least because of its longest wavelength.',
    illustrationDemoId: 'figure-10-5-10-6-dispersion',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2024, 2019',
        marks: 3,
        question: 'Explain why a beam of white light splits into a spectrum when passed through a glass prism. Which color suffers the minimum deviation and why?',
        answerKey: 'Different colors of light have different wavelengths. When light enters glass, each color travels at a different speed and thus bends through a different angle of deviation. Red light has the longest wavelength and largest speed in glass, so it suffers the minimum deviation.',
      },
    ],
  },

  // Chapter 11: Electricity
  {
    id: 'act-11-1',
    activityNumber: 'Activity 11.1',
    chapterSlug: 'electricity',
    chapterNumber: 11,
    chapterTitle: 'Electricity',
    subject: 'physics',
    title: 'Verification of Ohm\'s Law ($V = IR$)',
    aim: 'To study the relationship between the potential difference (V) across a resistor and the current (I) passing through it.',
    materials: ['Nichrome wire (resistor)', 'Voltmeter (0–3V)', 'Ammeter (0–1A)', 'Four 1.5V dry cells', 'Plug key', 'Connecting wires'],
    procedure: [
      'Connect the nichrome wire, ammeter, voltmeter, plug key and 1 cell in series (voltmeter in parallel across wire).',
      'Record ammeter reading (I) and voltmeter reading (V).',
      'Repeat by connecting 2, 3, and 4 cells in series to vary potential difference.',
      'Plot a graph between V (y-axis) and I (x-axis).',
    ],
    observation: 'The ratio $V/I$ remains constant for all cell configurations. The graph of $V$ versus $I$ is a straight line passing through the origin.',
    reactionEquation: 'V \\propto I \\implies V = IR \\quad \\left(R = \\text{Slope of V-I graph} = \\text{Constant}\\right)',
    inferenceConclusion: 'Potential difference across a conductor is directly proportional to current flowing through it at constant temperature. This confirms Ohm\'s Law.',
    illustrationDemoId: 'figure-11-2-ohms-law-circuit',
    isFreeSample: false,
    boardExamQuestions: [
      {
        year: 'CBSE 2023, 2017',
        marks: 3,
        question: 'State Ohm\'s Law. Draw a circuit diagram for verifying it and sketch the nature of the V-I graph for a metallic conductor.',
        answerKey: 'Ohm\'s Law: The electric current flowing through a conductor is directly proportional to the potential difference applied across its ends, provided temperature and other physical conditions remain constant (V = IR). V-I graph is a linear straight line through origin whose slope gives resistance R = V/I.',
      },
    ],
  },
];
