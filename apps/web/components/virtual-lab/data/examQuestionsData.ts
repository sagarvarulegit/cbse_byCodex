export interface BoardQuestion {
  id: string;
  year: string;
  marks: number;
  type: 'Observation' | 'Reasoning' | 'Equation' | 'Diagram' | 'Case-Based';
  question: string;
  trapAlert?: string;
  markingScheme: {
    step: string;
    marks: number;
  }[];
  modelAnswer: string;
}

export interface QuickRevisionCard {
  title: string;
  chapter: string;
  subject: 'Chemistry' | 'Physics' | 'Biology';
  ncertActivity: string;
  guaranteedMarks: string;
  reactionEquation?: string;
  physicsFormula?: string;
  summaryRows: {
    label: string;
    value: string;
    isHighlight?: boolean;
  }[];
  keyInferences: string[];
  boardPrecautions: string[];
  topExaminerTraps: string[];
}

export const PAST_BOARD_QUESTIONS: Record<'magnesium' | 'prism' | 'heart', BoardQuestion[]> = {
  magnesium: [
    {
      id: 'mg-2024',
      year: 'CBSE 2024 (Competency / Case-Based)',
      marks: 4,
      type: 'Case-Based',
      question:
        'A student ignites a small piece of magnesium ribbon held by tongs using a Bunsen burner tilted at 60°. The white ash formed is collected in a watch glass.\n(i) Why was eye protection recommended during this activity?\n(ii) What happens if the ash is dissolved in hot water and phenolphthalein indicator is added?\n(iii) Name the type of bonding present in the product formed.',
      trapAlert: 'Students often write that Mg burns in air without mentioning oxygen specifically, or miss the UV glare reason for eye protection.',
      markingScheme: [
        { step: '(i) Burning magnesium produces intense ultraviolet (UV) radiation and blinding glare causing photochemical retinal damage.', marks: 1 },
        { step: '(ii) Phenolphthalein turns pink because MgO + H₂O forms alkaline Mg(OH)₂ (pH > 7).', marks: 1.5 },
        { step: '(iii) Ionic / Electrovalent bonding due to transfer of 2 valence electrons from Mg to O (Mg²⁺ and O²⁻).', marks: 1.5 },
      ],
      modelAnswer:
        '(i) Eye protection is required because burning magnesium emits high-intensity UV radiation and a dazzling white flame that can cause temporary blindness or retinal damage.\n(ii) Dissolving MgO in water yields Magnesium Hydroxide: MgO (s) + H₂O (l) → Mg(OH)₂ (aq). Being a basic solution, it turns colorless phenolphthalein indicator deep pink.\n(iii) Ionic (electrovalent) bonding is present in MgO, formed by the transfer of two valence electrons from a magnesium atom (2,8,2) to an oxygen atom (2,6).',
    },
    {
      id: 'mg-2023',
      year: 'CBSE 2023 (Set 31/1/1)',
      marks: 3,
      type: 'Observation',
      question:
        'A student performs NCERT Activity 1.1 in the science laboratory:\n(a) Why should magnesium ribbon be cleaned with sandpaper before burning in air?\n(b) Write the chemical name and chemical formula of the product formed.\n(c) What is the chemical nature of this product? How would you verify it using litmus paper?',
      trapAlert: 'Never write "to remove dust". The exact CBSE keywords are "passivating protective oxide/carbonate coating".',
      markingScheme: [
        { step: '(a) To remove the protective/passivating layer of basic magnesium carbonate / magnesium oxide formed by reaction with moist air.', marks: 1 },
        { step: '(b) Chemical name: Magnesium Oxide; Formula: MgO.', marks: 1 },
        { step: '(c) Basic nature: when dissolved in water, it forms Mg(OH)₂, which turns moist red litmus blue while blue litmus remains unchanged.', marks: 1 },
      ],
      modelAnswer:
        '(a) Magnesium is a reactive metal that slowly forms a protective passivating layer of basic magnesium carbonate / magnesium oxide on its surface upon exposure to moist air. Sandpaper removes this inert layer so that magnesium directly contacts atmospheric oxygen for smooth ignition.\n(b) Chemical Name: Magnesium Oxide; Formula: MgO.\n(c) The product is basic in nature. When the white ash is mixed with water, it forms magnesium hydroxide [Mg(OH)₂]. This basic solution turns moist red litmus paper blue while having no effect on blue litmus paper.',
    },
    {
      id: 'mg-2022',
      year: 'CBSE 2022 Term-1',
      marks: 1,
      type: 'Observation',
      question:
        'When a magnesium ribbon is burnt in air, the correct observation recorded by a student is:\n(A) Brown gas released with pop sound\n(B) Dazzling brilliant white flame and white powder\n(C) Yellow flame and black residue\n(D) Green flame and colourless solution',
      trapAlert: 'Magnesium produces ZERO smoke/ash color other than pure white powder. Any option with black residue or pop sound is incorrect.',
      markingScheme: [
        { step: 'Correct Option (B): Dazzling brilliant white flame and white powder (MgO).', marks: 1 },
      ],
      modelAnswer:
        'Option (B) is correct.\nMagnesium reacts vigorously with atmospheric oxygen in an exothermic combustion reaction:\n2Mg (s) + O₂ (g) → 2MgO (s) + Heat + Light\nIt emits an intense dazzling white flame and leaves behind a white powdery residue of Magnesium Oxide (MgO).',
    },
    {
      id: 'mg-2020',
      year: 'CBSE 2020 (Set 31/2/1)',
      marks: 2,
      type: 'Equation',
      question:
        'Write the balanced chemical equation with state symbols for the burning of magnesium ribbon in air. State the two reaction classifications it falls under with scientific reasons.',
      markingScheme: [
        { step: 'Balanced equation with physical state symbols: 2Mg(s) + O₂(g) → 2MgO(s).', marks: 1 },
        { step: 'Combination Reaction (2 reactants combine into 1 product) + Exothermic Reaction (Heat and light energy released).', marks: 1 },
      ],
      modelAnswer:
        'Balanced Equation:\n2Mg (s) + O₂ (g) → 2MgO (s) + Heat + Light\n\nClassifications:\n1. Combination Reaction: Two distinct elemental reactants (Mg and O₂) combine to form a single chemical product (MgO).\n2. Exothermic Reaction: Significant heat and light energy are evolved during the formation of ionic lattice bonds.',
    },
  ],

  prism: [
    {
      id: 'prism-2023',
      year: 'CBSE 2023 (Set 31/3/2)',
      marks: 3,
      type: 'Diagram',
      question:
        'Draw a neat ray diagram showing the refraction of a ray of light through a triangular glass prism. Mark the following:\n(i) Incident ray and Emergent ray\n(ii) Angle of prism (A) and Angle of deviation (δ)\n(iii) Angle of incidence (i) and Angle of emergence (e)\nState the mathematical relation between A, δ, i, and e.',
      trapAlert: 'Ensure the ray inside the glass prism bends towards the base BC. Do not draw straight lines without normal lines.',
      markingScheme: [
        { step: 'Correct ray diagram with normals at both faces and labeled rays.', marks: 2 },
        { step: 'Mathematical relation: A + δ = i + e.', marks: 1 },
      ],
      modelAnswer:
        'Key Ray Properties:\n1. Incident Ray: Enters face AB from air (rarer) into glass (denser), bending TOWARDS the normal.\n2. Refracted Ray: Travels through prism parallel to base for equilateral configuration.\n3. Emergent Ray: Exits face AC from glass (denser) into air (rarer), bending AWAY from the normal towards base BC.\n\nGoverning Mathematical Relation:\nAngle of Prism (A) + Angle of Deviation (δ) = Angle of Incidence (i) + Angle of Emergence (e)\n[ A + δ = i + e ]',
    },
    {
      id: 'prism-2022',
      year: 'CBSE 2022 Term-1',
      marks: 1,
      type: 'Reasoning',
      question:
        'When white light passes through a triangular glass prism, the component colour that suffers the maximum angle of deviation is:\n(A) Red light\n(B) Green light\n(C) Violet light\n(D) Yellow light\nGive the physical reason for your choice.',
      trapAlert: 'Violet bends most because it travels slowest in glass, NOT because it has the longest wavelength.',
      markingScheme: [
        { step: 'Option (C) Violet. Reason: Violet has shortest wavelength, travels slowest in glass, hence has highest refractive index and deviates most.', marks: 1 },
      ],
      modelAnswer:
        'Option (C) Violet is correct.\nReason: Refractive index of glass varies inversely with wavelength (Cauchy relation: n ∝ 1/λ²). Violet light has the shortest visible wavelength (~400 nm), travels with the minimum speed in glass (v = c/n), and hence experiences the maximum refractive index and maximum deviation (δ_violet > δ_red).',
    },
    {
      id: 'prism-2020',
      year: 'CBSE 2020 (Set 31/1/2)',
      marks: 3,
      type: 'Diagram',
      question:
        'Describe Isaac Newton’s classic two-prism experiment that proved white light is composed of seven distinct colours. Draw a ray diagram showing dispersion and recombination.',
      markingScheme: [
        { step: 'Explanation: First prism disperses white light into spectrum; second identical inverted prism recombines 7 colours into white beam.', marks: 1.5 },
        { step: 'Ray diagram showing first upright prism and second inverted prism with white light emerging.', marks: 1.5 },
      ],
      modelAnswer:
        'Newton placed two identical triangular glass prisms—one upright and the other in an inverted position relative to the first:\n1. The first upright prism dispersed incident white sunlight into its 7 constituent spectrum colours (VIBGYOR).\n2. The second inverted prism received all seven colours and bent them equally in the opposite direction.\n3. A single beam of white light emerged from the second prism on the other side screen.\nConclusion: This definitively proved that the prism does not create colours itself, but merely separates the colours already present in white sunlight.',
    },
  ],

  heart: [
    {
      id: 'heart-2023',
      year: 'CBSE 2023 (Set 31/4/1)',
      marks: 5,
      type: 'Reasoning',
      question:
        '(a) Why is blood circulation in humans described as "Double Circulation"? Name the two circuits.\n(b) Trace the complete pathway of an oxygenated blood cell from the lungs to body tissues and back to lungs.\n(c) What is the function of heart valves during ventricular contraction?',
      trapAlert: 'Never say Pulmonary Artery carries oxygenated blood! Pulmonary Artery is the only artery carrying DEOXYGENATED blood.',
      markingScheme: [
        { step: '(a) Blood passes through the heart twice during each complete cardiac cycle. Pulmonary & Systemic circuits.', marks: 1.5 },
        { step: '(b) Correct step-by-step blood flow pathway through 4 chambers and main vessels.', marks: 2 },
        { step: '(c) Valves (Tricuspid/Bicuspid & Semilunar) prevent the backflow of blood when ventricles contract.', marks: 1.5 },
      ],
      modelAnswer:
        '(a) Double Circulation: Blood flows through the heart twice for every single complete circuit of the body. It consists of:\n1. Pulmonary Circulation (Heart → Lungs → Heart)\n2. Systemic Circulation (Heart → Body Organs → Heart)\n\n(b) Complete Blood Pathway:\nLungs (Oxygenation) → Pulmonary Veins → Left Atrium → (Bicuspid Valve) → Left Ventricle → Aorta → Systemic Body Tissues (O₂ delivery) → Vena Cava → Right Atrium → (Tricuspid Valve) → Right Ventricle → Pulmonary Artery → Lungs.\n\n(c) Role of Valves: When ventricles contract under high systolic pressure (~120 mm Hg), the atrioventricular valves (tricuspid and bicuspid) close firmly to prevent blood from surging backwards into the atria, while semilunar valves open to direct flow into the pulmonary artery and aorta.',
    },
    {
      id: 'heart-2022',
      year: 'CBSE 2022 Term-1',
      marks: 1,
      type: 'Reasoning',
      question:
        'Why do the ventricular walls of the human heart contain considerably thicker cardiac muscle than the atrial walls?',
      markingScheme: [
        { step: 'Ventricles pump blood to distant organs (left ventricle to whole body under high pressure), while atria only receive blood into adjacent ventricles.', marks: 1 },
      ],
      modelAnswer:
        'Ventricles have significantly thicker muscular walls because they must pump blood with high force to distant organs (the left ventricle pumps oxygenated blood throughout the entire systemic body at high systolic pressure ~120 mm Hg), whereas atria only need to pump blood a short distance downward into the ventricles.',
    },
    {
      id: 'heart-2020',
      year: 'CBSE 2020 (Set 31/2/3)',
      marks: 3,
      type: 'Reasoning',
      question:
        'Explain why the complete separation of the right and left sides of the heart by a septum is essential in birds and mammals, but not in amphibians or reptiles.',
      markingScheme: [
        { step: 'Complete separation prevents mixing of oxygenated and deoxygenated blood, ensuring highly efficient oxygen delivery.', marks: 1.5 },
        { step: 'Birds and mammals are warm-blooded (endothermic) and need high energy to maintain constant body temperature.', marks: 1.5 },
      ],
      modelAnswer:
        'Birds and mammals are warm-blooded (endothermic) animals that constantly expend large amounts of cellular energy to maintain a constant internal body temperature regardless of environmental fluctuations.\n\nA complete four-chambered heart with an interventricular septum prevents any mixing of oxygenated and deoxygenated blood. This delivers oxygen with maximum efficiency to body cells for cellular respiration.\n\nAmphibians and reptiles are cold-blooded (ectothermic); their body temperature depends on the ambient environment, so they tolerate moderate mixing of blood in a 3-chambered heart.',
    },
  ],
};

export const ONE_MINUTE_REVISION_CARDS: Record<'magnesium' | 'prism' | 'heart', QuickRevisionCard> = {
  magnesium: {
    title: 'Activity 1.1 — Magnesium Ribbon Combustion',
    chapter: 'Chapter 1: Chemical Reactions & Equations',
    subject: 'Chemistry',
    ncertActivity: 'Activity 1.1 (Page 2)',
    guaranteedMarks: 'Guaranteed 3 to 4 Marks in Practical / Theory',
    reactionEquation: '2Mg (s) + O₂ (g) → 2MgO (s) + Heat + Light',
    summaryRows: [
      { label: 'Reactants Used', value: 'Magnesium Ribbon (Silvery-white solid, Mg) + Atmospheric Oxygen (O₂)' },
      { label: 'Pre-Treatment', value: 'Rubbed with sandpaper to remove passivating basic MgCO₃ / MgO layer', isHighlight: true },
      { label: 'Burner Flame Color', value: 'Luminous Yellow-Orange Bunsen flame (~1000°C)' },
      { label: 'Reaction Flame Observation', value: 'Dazzling brilliant white flame (emits intense UV glare)', isHighlight: true },
      { label: 'Product Formed', value: 'White powder / ash of Magnesium Oxide (MgO)' },
      { label: 'Reaction Classification', value: 'Combination + Exothermic + Redox (Mg oxidized, O₂ reduced)' },
      { label: 'Water Dissolution', value: 'MgO (s) + H₂O (l) → Mg(OH)₂ (aq) [Magnesium Hydroxide]' },
      { label: 'Litmus Test Result', value: 'Turns Red Litmus BLUE; Blue Litmus remains unaffected (Basic Nature)', isHighlight: true },
      { label: 'Phenolphthalein Test', value: 'Turns colorless phenolphthalein deep PINK' },
    ],
    keyInferences: [
      'Magnesium combines with oxygen at high temperature to form an ionic basic metallic oxide.',
      'Metallic oxides (like MgO) are basic in nature because their aqueous solutions produce OH⁻ ions.',
      'Mass increases slightly during complete burning due to addition of oxygen atoms (Conservation of Mass).',
    ],
    boardPrecautions: [
      'Always clean the ribbon with sandpaper before ignition; otherwise, passivating oxide slows ignition.',
      'Hold the ribbon with crucible tongs; never hold it with bare hands due to rapid thermal conduction.',
      'Wear tinted safety eyeglasses / UV filter goggles to prevent retinal photochemical damage.',
      'Collect ash in a watch glass placed directly beneath the tilted flame to avoid hot ash spilling.',
    ],
    topExaminerTraps: [
      'Trap: "What is the brown gas?" → There is NO brown gas. Brown gas (NO₂) belongs to Lead Nitrate heating (Activity 1.5).',
      'Trap: "Does blue litmus turn red?" → NO! Metallic oxides are basic, so RED turns BLUE, blue stays blue.',
      'Trap: "Why clean ribbon?" → Answer ONLY "to remove protective passivating oxide/carbonate layer", NOT "to remove dust".',
    ],
  },

  prism: {
    title: 'Activity 11.2 — Refraction & Dispersion of Light via Glass Prism',
    chapter: 'Chapter 11: The Human Eye and the Colourful World',
    subject: 'Physics',
    ncertActivity: 'Activity 11.2 (Page 191)',
    guaranteedMarks: 'Guaranteed 3 to 5 Marks in Ray Diagrams / MCQs',
    physicsFormula: 'A + δ = i + e   |   v = c / n   |   n ∝ 1/λ²',
    summaryRows: [
      { label: 'Optical Phenomenon', value: 'Dispersion (splitting of white light) + Refraction at two inclined surfaces' },
      { label: 'Spectrum Order (Base to Apex)', value: 'V - I - B - G - Y - O - R (Violet at bottom, Red at top)', isHighlight: true },
      { label: 'Most Deviated Color', value: 'Violet (Shortest λ ≈ 400nm, Slowest speed, Highest refractive index)', isHighlight: true },
      { label: 'Least Deviated Color', value: 'Red (Longest λ ≈ 700nm, Fastest speed, Lowest refractive index)' },
      { label: 'Angle of Prism (A)', value: 'Angle between the two refracting rectangular faces (usually 60°)' },
      { label: 'Angle of Deviation (δ)', value: 'Angle between incident ray extended forward and emergent ray extended backward' },
      { label: 'Newton’s Recombination', value: 'Second inverted prism recombines 7 colours back into white light' },
    ],
    keyInferences: [
      'White light is a polychromatic mixture of 7 spectral wavelengths with different propagation speeds in glass.',
      'Prism does NOT produce colors; it only refracts each wavelength by a different angle based on speed in medium.',
      'Red light deviates least because it travels fastest in glass ($v = c/n$). Violet travels slowest and deviates most.',
    ],
    boardPrecautions: [
      'Ensure the angle of incidence is between 30° and 60° for distinct emergent ray separation.',
      'Place pins at least 5 cm apart along the incident ray for accurate optical alignment.',
      'Draw normals strictly perpendicular (90°) to the refracting surfaces AB and AC.',
    ],
    topExaminerTraps: [
      'Trap: "Which ray is parallel to the base?" → In an equilateral prism at minimum deviation, the refracted ray inside glass is parallel to base BC.',
      'Trap: "Does dispersion happen inside or at the surface?" → Dispersion begins at the first refracting surface (AB) and increases at the second surface (AC).',
      'Trap: "Why is red used for danger signals?" → Longest wavelength, scatters least by smoke/fog ($I \propto 1/\lambda^4$).',
    ],
  },

  heart: {
    title: 'Chapter 5 — Human Heart & Double Circulation',
    chapter: 'Chapter 5: Life Processes (Biology)',
    subject: 'Biology',
    ncertActivity: 'Section 5.4.1 (Page 94)',
    guaranteedMarks: 'Guaranteed 5 Marks in Long Answer / Diagram Section',
    summaryRows: [
      { label: 'Number of Chambers', value: '4 Chambers (Right Atrium, Right Ventricle, Left Atrium, Left Ventricle)' },
      { label: 'Deoxygenated Blood Route', value: 'Vena Cava → Right Atrium → Tricuspid Valve → Right Ventricle → Pulmonary Artery → Lungs', isHighlight: true },
      { label: 'Oxygenated Blood Route', value: 'Lungs → Pulmonary Veins → Left Atrium → Bicuspid Valve → Left Ventricle → Aorta → Body', isHighlight: true },
      { label: 'Vessel Exceptions', value: 'Pulmonary Artery carries Deoxygenated blood; Pulmonary Vein carries Oxygenated blood', isHighlight: true },
      { label: 'Thickest Muscular Wall', value: 'Left Ventricle (pumps blood to systemic extremities at ~120 mm Hg pressure)' },
      { label: 'Heart Valves Role', value: 'Prevent backflow of blood when atria and ventricles contract' },
      { label: 'Blood Pressure Norm', value: '120/80 mm Hg (Systolic: 120, Diastolic: 80 measured by Sphygmomanometer)' },
      { label: 'Septum Function', value: 'Complete separation of oxygenated & deoxygenated blood for high energy maintenance' },
    ],
    keyInferences: [
      'Double circulation ensures that oxygen-rich blood is delivered to metabolic tissues without mixing with deoxygenated blood.',
      'Left ventricle has 3x thicker muscular walls than right ventricle because systemic resistance is higher than pulmonary resistance.',
      'Heart valves are one-way gates powered by pressure gradients between chambers.',
    ],
    boardPrecautions: [
      'In exam diagrams, remember Left chambers are drawn on the RIGHT side of the paper (anatomical mirror view).',
      'Always shade or color-code: Blue for deoxygenated blood (right side) and Red for oxygenated blood (left side).',
      'Never confuse Atria (receiving chambers) with Ventricles (pumping chambers).',
    ],
    topExaminerTraps: [
      'Trap: "Are all arteries carry oxygenated blood?" → NO! Pulmonary Artery is the sole exception carrying deoxygenated blood.',
      'Trap: "Are all veins carry deoxygenated blood?" → NO! Pulmonary Vein is the sole exception carrying oxygenated blood.',
      'Trap: "Which chamber pumps to lungs?" → Right Ventricle (via Pulmonary Artery).',
    ],
  },
};
