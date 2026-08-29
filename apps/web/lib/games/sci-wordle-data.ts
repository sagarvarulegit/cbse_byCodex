// Sci-Wordle NCERT Target Word Database & Guess Dictionary for CBSE Class 10

export interface SciWordleTerm {
  word: string; // Exactly 5 uppercase letters
  subject:
    | 'Science - Chemistry'
    | 'Science - Physics'
    | 'Science - Biology'
    | 'Science - Biology & Environment'
    | 'Science - Physics & Environment'
    | 'Mathematics';
  chapter: string;
  chapterSlug: string;
  definition: string;
  boardTip: string;
  formulaOrFact?: string;
}

export const SCI_WORDLE_TARGETS: SciWordleTerm[] = [
  // CHEMISTRY
  {
    word: 'ANODE',
    subject: 'Science - Chemistry',
    chapter: 'Chemical Reactions & Equations / Metals',
    chapterSlug: 'chemical-reactions-and-equations',
    definition: 'The positive electrode in an electrolytic cell where oxidation occurs and oxygen gas is liberated in water electrolysis.',
    boardTip: 'Remember: Anode is positive in electrolysis (PA = Positive Anode) and oxidation always happens at the anode.',
    formulaOrFact: '2H₂O(l) → 2H₂(g) [Cathode, 2 vol] + O₂(g) [Anode, 1 vol]',
  },
  {
    word: 'ACIDS',
    subject: 'Science - Chemistry',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    definition: 'Chemical substances that furnish hydrogen ions (H+ or H3O+) in aqueous solution, taste sour, and turn blue litmus red.',
    boardTip: 'Acids do not show acidic behavior in the absence of water because dry HCl cannot dissociate into H+ ions.',
    formulaOrFact: 'Acid + Metal → Salt + Hydrogen gas (Pop sound test)',
  },
  {
    word: 'BASES',
    subject: 'Science - Chemistry',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    definition: 'Substances that furnish hydroxide ions (OH-) in aqueous solution, taste bitter, feel soapy to touch, and turn red litmus blue.',
    boardTip: 'Water-soluble bases are called Alkalis (e.g., NaOH, KOH). All alkalis are bases, but not all bases are alkalis.',
    formulaOrFact: 'Base + Acid → Salt + Water (Neutralization reaction)',
  },
  {
    word: 'SALTS',
    subject: 'Science - Chemistry',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    definition: 'Ionic compounds formed by the neutralization reaction between an acid and a base (e.g. NaCl, Na2SO4, CaSO4).',
    boardTip: 'Check salt pH: Strong Acid + Weak Base = Acidic Salt (pH < 7); Strong Base + Weak Acid = Basic Salt (pH > 7).',
    formulaOrFact: 'NaOH + HCl → NaCl + H₂O (Neutral salt, pH = 7)',
  },
  {
    word: 'OXIDE',
    subject: 'Science - Chemistry',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    definition: 'A binary chemical compound composed of oxygen and another element (e.g. basic metal oxides, acidic non-metal oxides, or amphoteric oxides).',
    boardTip: 'Amphoteric oxides (Al₂O₃ and ZnO) react with BOTH acids and bases to produce salt and water.',
    formulaOrFact: 'Al₂O₃ + 2NaOH → 2NaAlO₂ (Sodium Aluminate) + H₂O',
  },
  {
    word: 'ALLOY',
    subject: 'Science - Chemistry',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    definition: 'A homogeneous mixture of two or more metals, or a metal and a non-metal, designed to enhance strength and resist corrosion.',
    boardTip: 'Brass = Cu + Zn; Bronze = Cu + Sn; Solder = Pb + Sn (low melting point for welding wires); Amalgam = any alloy containing Mercury.',
    formulaOrFact: 'Stainless Steel = Iron + Nickel + Chromium + Carbon',
  },
  {
    word: 'BRINE',
    subject: 'Science - Chemistry',
    chapter: 'Acids, Bases and Salts',
    chapterSlug: 'acids-bases-and-salts',
    definition: 'A concentrated aqueous solution of common salt (NaCl) used as the starting electrolyte in the industrial Chlor-Alkali process.',
    boardTip: 'Products of Chlor-Alkali: Cl₂ gas at anode, H₂ gas at cathode, and NaOH solution formed near the cathode.',
    formulaOrFact: '2NaCl(aq) + 2H₂O(l) → 2NaOH(aq) + Cl₂(g) + H₂(g)',
  },
  {
    word: 'ESTER',
    subject: 'Science - Chemistry',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    definition: 'A sweet-smelling organic compound formed by the condensation reaction between a carboxylic acid and an alcohol in the presence of an acid catalyst.',
    boardTip: 'Esters are used in making perfumes and flavoring agents. Alkaline hydrolysis of esters gives soap (Saponification).',
    formulaOrFact: 'CH₃COOH + C₂H₅OH --(Conc. H₂SO₄)--> CH₃COOC₂H₅ + H₂O',
  },
  {
    word: 'ALKYL',
    subject: 'Science - Chemistry',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    definition: 'A monovalent hydrocarbon radical derived from an alkane by the removal of one hydrogen atom, having general formula CnH(2n+1).',
    boardTip: 'Methyl (-CH₃) and Ethyl (-C₂H₅) are common alkyl groups in IUPAC naming of branched hydrocarbons.',
    formulaOrFact: 'General formula: CₙH₂ₙ₊₁ (e.g. -CH₃, -C₂H₅)',
  },
  {
    word: 'ETHYL',
    subject: 'Science - Chemistry',
    chapter: 'Carbon and its Compounds',
    chapterSlug: 'carbon-and-its-compounds',
    definition: 'The 2-carbon alkyl radical (-C2H5) present in ethanol (ethyl alcohol) and ethyl ethanoate ester.',
    boardTip: 'Ethanol (C₂H₅OH) reacts with sodium metal to evolve hydrogen gas with effervescence.',
    formulaOrFact: '2C₂H₅OH + 2Na → 2C₂H₅ONa (Sodium ethoxide) + H₂↑',
  },
  {
    word: 'METAL',
    subject: 'Science - Chemistry',
    chapter: 'Metals and Non-metals',
    chapterSlug: 'metals-and-non-metals',
    definition: 'Electropositive elements that readily lose valence electrons to form positive cations, possessing metallic lustre, malleability, and ductility.',
    boardTip: 'Exception alert: Mercury is liquid at room temperature; Sodium and Potassium are soft metals cut with a knife; Lead and Mercury are poor conductors of heat.',
    formulaOrFact: 'Reactivity series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au',
  },
  {
    word: 'WATER',
    subject: 'Science - Chemistry',
    chapter: 'Chemical Reactions & Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    definition: 'H2O; universal solvent, product of neutralization and combustion, and essential reactant in photosynthesis.',
    boardTip: 'In electrolysis of water, the volume of hydrogen collected at cathode is twice the volume of oxygen at anode (2:1 molar ratio).',
    formulaOrFact: 'Density = 1 g/cm³, Neutral pH = 7 at 25°C',
  },
  {
    word: 'REDOX',
    subject: 'Science - Chemistry',
    chapter: 'Chemical Reactions & Equations',
    chapterSlug: 'chemical-reactions-and-equations',
    definition: 'Chemical reactions where oxidation (loss of electrons / gain of oxygen) and reduction (gain of electrons / gain of hydrogen) occur simultaneously.',
    boardTip: 'The substance oxidized is the reducing agent; the substance reduced is the oxidizing agent.',
    formulaOrFact: 'CuO + H₂ → Cu + H₂O (CuO reduced to Cu; H₂ oxidized to H₂O)',
  },

  // BIOLOGY
  {
    word: 'HEART',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'A muscular organ with four chambers (two atria, two ventricles) that pumps oxygenated and deoxygenated blood through double circulation.',
    boardTip: 'Ventricles have thicker muscular walls than atria because they have to pump blood into various organs with high pressure.',
    formulaOrFact: 'Normal Blood Pressure = 120/80 mm of Hg (Systolic/Diastolic)',
  },
  {
    word: 'LIVER',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'The largest digestive gland in the human body, secreting alkaline bile juice that emulsifies large fat globules.',
    boardTip: 'Bile contains no digestive enzymes, yet is crucial for digestion because it provides an alkaline medium for pancreatic enzymes.',
    formulaOrFact: 'Bile salts convert large fat globules into small micelles (Emulsification).',
  },
  {
    word: 'NERVE',
    subject: 'Science - Biology',
    chapter: 'Control and Coordination',
    chapterSlug: 'control-and-coordination',
    definition: 'A bundle of nerve fibres (axons) that transmits electrical impulses between the central nervous system and other parts of the body.',
    boardTip: 'Electrical impulse travels: Dendrite → Cell Body (Cyton) → Axon → Axon terminal → Synapse (chemical neurotransmitter).',
    formulaOrFact: 'Neuron is the structural and functional unit of the nervous system.',
  },
  {
    word: 'PLANT',
    subject: 'Science - Biology',
    chapter: 'Life Processes / Control & Coordination',
    chapterSlug: 'life-processes',
    definition: 'Autotrophic photosynthetic organisms exhibiting tropic movements (phototropism, geotropism, hydrotropism) via phytohormones.',
    boardTip: 'Auxin promotes cell elongation towards shaded side, causing bending toward light (positive phototropism).',
    formulaOrFact: '6CO₂ + 12H₂O --(Sunlight & Chlorophyll)--> C₆H₁₂O₆ + 6O₂ + 6H₂O',
  },
  {
    word: 'CELLS',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'The fundamental structural and functional units of living organisms, such as nephrons in kidneys and alveoli in lungs.',
    boardTip: 'Guard cells regulate stomatal pore opening by swelling with water (turgid) and closing when water is lost (flaccid).',
    formulaOrFact: 'Stomatal pore opens when guard cells absorb water and swell.',
  },
  {
    word: 'GENES',
    subject: 'Science - Biology',
    chapter: 'Heredity',
    chapterSlug: 'heredity',
    definition: 'Specific functional segments of DNA located on chromosomes that determine specific hereditary traits and synthesize cellular proteins.',
    boardTip: 'Genes occur in pairs (alleles). A dominant allele expresses itself in both homozygous (TT) and heterozygous (Tt) conditions.',
    formulaOrFact: 'Mendelian Monohybrid phenotypic ratio = 3:1; Genotypic ratio = 1:2:1',
  },
  {
    word: 'TRAIT',
    subject: 'Science - Biology',
    chapter: 'Heredity',
    chapterSlug: 'heredity',
    definition: 'A distinct characteristic or feature of an organism (e.g. tallness, flower color) which can be inherited or acquired.',
    boardTip: 'Acquired traits (e.g. weight loss, scars) involve somatic cells and are NOT passed to progeny; only germ-cell changes are inherited.',
    formulaOrFact: 'Sex determination in humans: XY = Male, XX = Female (Father determines sex).',
  },
  {
    word: 'SPORE',
    subject: 'Science - Biology',
    chapter: 'How do Organisms Reproduce?',
    chapterSlug: 'how-do-organisms-reproduce',
    definition: 'A microscopic reproductive structure with a thick protective wall produced in sporangia (e.g. Rhizopus bread mould) for asexual reproduction.',
    boardTip: 'Spores survive unfavorable conditions due to their thick protective cell wall and germinate when moisture is available.',
    formulaOrFact: 'Rhizopus bread mould reproduces asexually through Spore Formation.',
  },
  {
    word: 'OVARY',
    subject: 'Science - Biology',
    chapter: 'How do Organisms Reproduce?',
    chapterSlug: 'how-do-organisms-reproduce',
    definition: 'Primary female reproductive organ in humans producing ova and estrogen/progesterone, or in flowers developing into fruit post-fertilization.',
    boardTip: 'Post-fertilization in plants: Ovary develops into Fruit, and Ovules develop into Seeds with a tough coat.',
    formulaOrFact: 'In humans, ovulation releases one mature ovum every 28 days.',
  },
  {
    word: 'VEINS',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'Blood vessels that carry deoxygenated blood back toward the heart from bodily tissues, containing internal valves to prevent backflow.',
    boardTip: 'Exception: Pulmonary vein carries OXYGENATED blood from lungs to left atrium.',
    formulaOrFact: 'Veins have thin walls, large lumens, low blood pressure, and non-return valves.',
  },
  {
    word: 'VALVE',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'Flap-like anatomical structures in the heart (tricuspid, bicuspid) and veins that ensure unidirectional blood flow without backflow.',
    boardTip: 'Valves close during ventricular systole to prevent blood from flowing back into the atria.',
    formulaOrFact: 'Bicuspid (Mitral) valve separates Left Atrium and Left Ventricle.',
  },
  {
    word: 'XYLEM',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'Complex vascular conducting tissue in plants responsible for unidirectional transport of water and dissolved minerals from roots to leaves.',
    boardTip: 'Xylem transport relies on Transpiration pull (physical forces, no ATP used), unlike Phloem translocation which consumes ATP.',
    formulaOrFact: 'Xylem vessels and tracheids form a continuous water-conducting channel.',
  },
  {
    word: 'ROOTS',
    subject: 'Science - Biology',
    chapter: 'Life Processes',
    chapterSlug: 'life-processes',
    definition: 'Underground plant organs that absorb water and minerals from soil via root hair osmosis and anchor the plant body.',
    boardTip: 'Root hairs provide huge surface area for rapid absorption of water through endosmosis.',
    formulaOrFact: 'Root pressure helps push water upwards in herbaceous plants at night.',
  },
  {
    word: 'OZONE',
    subject: 'Science - Biology & Environment',
    chapter: 'Our Environment',
    chapterSlug: 'our-environment',
    definition: 'A triatomic molecule of oxygen (O3) forming a protective atmospheric shield in the stratosphere against harmful solar UV radiation.',
    boardTip: 'Ozone at ground level is a deadly poison, but in the stratosphere it protects against skin cancer, cataract, and immune suppression.',
    formulaOrFact: 'O₂ --(UV)--> O + O; then O + O₂ → O₃ (Ozone)',
  },
  {
    word: 'TOXIN',
    subject: 'Science - Biology & Environment',
    chapter: 'Our Environment',
    chapterSlug: 'our-environment',
    definition: 'Harmful non-biodegradable chemicals (like DDT or pesticides) that accumulate in increasing concentrations along successive trophic levels.',
    boardTip: 'Biological Magnification: The maximum concentration of harmful non-biodegradable chemicals accumulates in top carnivores (humans).',
    formulaOrFact: '10% Law of Energy transfer: Only ~10% energy moves to the next trophic level.',
  },
  {
    word: 'WASTE',
    subject: 'Science - Biology & Environment',
    chapter: 'Our Environment',
    chapterSlug: 'our-environment',
    definition: 'Unwanted discarded materials categorized into biodegradable (decomposed by bacteria/fungi) and non-biodegradable (plastics, glass).',
    boardTip: 'Non-biodegradable wastes persist in the environment for long periods, causing soil pollution and biomagnification.',
    formulaOrFact: 'Biodegradable wastes can be safely converted into compost manure.',
  },

  // PHYSICS
  {
    word: 'LIGHT',
    subject: 'Science - Physics',
    chapter: 'Light - Reflection and Refraction',
    chapterSlug: 'light-reflection-and-refraction',
    definition: 'A form of electromagnetic energy that enables vision, traveling at 3 × 10⁸ m/s in vacuum and exhibiting rectilinear propagation.',
    boardTip: 'Light speed in medium = c / n (where n is refractive index). A denser optical medium slows down light velocity.',
    formulaOrFact: 'Speed of light in vacuum c = 3.0 × 10⁸ m/s',
  },
  {
    word: 'FOCAL',
    subject: 'Science - Physics',
    chapter: 'Light - Reflection and Refraction',
    chapterSlug: 'light-reflection-and-refraction',
    definition: 'Pertaining to the focus; the focal length (f) is the distance from the optical centre or pole to the principal focus.',
    boardTip: 'Sign convention: Concave mirror & concave lens have NEGATIVE focal length; Convex mirror & convex lens have POSITIVE focal length.',
    formulaOrFact: 'Radius of curvature R = 2f (Focal length f = R/2)',
  },
  {
    word: 'FOCUS',
    subject: 'Science - Physics',
    chapter: 'Light - Reflection and Refraction',
    chapterSlug: 'light-reflection-and-refraction',
    definition: 'The point on the principal axis where rays parallel to the principal axis converge or appear to diverge from after reflection or refraction.',
    boardTip: 'Object placed at 2F in convex lens yields a real, inverted, same-sized image formed at 2F on the opposite side.',
    formulaOrFact: 'Lens formula: 1/f = 1/v - 1/u; Mirror formula: 1/f = 1/v + 1/u',
  },
  {
    word: 'IMAGE',
    subject: 'Science - Physics',
    chapter: 'Light - Reflection and Refraction',
    chapterSlug: 'light-reflection-and-refraction',
    definition: 'The optical reproduction of an object formed by converging or diverging light rays, categorized as real (inverted) or virtual (erect).',
    boardTip: 'Real images can always be caught on a screen (m is negative); virtual images cannot be projected onto a screen (m is positive).',
    formulaOrFact: 'Magnification m = h\'/h = -v/u (for mirrors) = +v/u (for lenses)',
  },
  {
    word: 'POWER',
    subject: 'Science - Physics',
    chapter: 'Light / Electricity',
    chapterSlug: 'light-reflection-and-refraction',
    definition: 'In optics: reciprocal of focal length in metres (Dioptres). In electricity: rate at which electrical energy is consumed (Watts).',
    boardTip: 'Always convert focal length to METRES before calculating power: P = 1/f(in m). Convex lens = +P, Concave lens = -P.',
    formulaOrFact: 'P = 1/f(m) [Dioptre D]; Electric Power P = VI = I²R = V²/R [Watts]',
  },
  {
    word: 'JOULE',
    subject: 'Science - Physics',
    chapter: 'Electricity',
    chapterSlug: 'electricity',
    definition: 'The SI unit of work and energy, equal to the work done when a force of 1 N moves an object through 1 m, or 1 Watt-second.',
    boardTip: 'Commercial unit of electrical energy is kilowatt-hour (kWh), commonly called 1 unit of electricity: 1 kWh = 3.6 × 10⁶ Joules.',
    formulaOrFact: 'Joule\'s Law of Heating: H = I²Rt (where I = current, R = resistance, t = time)',
  },
  {
    word: 'PUPIL',
    subject: 'Science - Physics',
    chapter: 'The Human Eye and the Colourful World',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    definition: 'The circular aperture in the centre of the eye iris through which light enters the eyeball, contracting in bright light and dilating in dim light.',
    boardTip: 'The iris regulates the amount of light entering the eye by adjusting the size of the pupil.',
    formulaOrFact: 'Least distance of distinct vision (Near point) for normal human eye = 25 cm.',
  },
  {
    word: 'OPTIC',
    subject: 'Science - Physics',
    chapter: 'The Human Eye and the Colourful World',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    definition: 'Relating to vision and the eye; the optic nerve carries electrical nerve signals generated by retina photoreceptors to the brain.',
    boardTip: 'At the junction of the optic nerve and the retina, there are no rod or cone cells; this area is known as the Blind Spot.',
    formulaOrFact: 'Retina contains Rods (sensitive to dim light intensity) and Cones (color vision).',
  },
  {
    word: 'PRISM',
    subject: 'Science - Physics',
    chapter: 'The Human Eye and the Colourful World',
    chapterSlug: 'the-human-eye-and-the-colourful-world',
    definition: 'A transparent optical element with flat polished surfaces that refracts light, causing dispersion of white light into spectrum (VIBGYOR).',
    boardTip: 'Red light deviates the least (longest wavelength λ), while Violet light deviates the most (shortest wavelength λ).',
    formulaOrFact: 'Angle of Deviation δ depends on angle of prism and angle of incidence.',
  },
  {
    word: 'POLES',
    subject: 'Science - Physics',
    chapter: 'Magnetic Effects of Electric Current',
    chapterSlug: 'magnetic-effects-of-electric-current',
    definition: 'The two ends of a magnet (North and South) where the magnetic field lines are concentrated with maximum field strength.',
    boardTip: 'Magnetic field lines emerge from North pole and enter South pole OUTSIDE the magnet; inside they travel from South to North.',
    formulaOrFact: 'Field lines never intersect each other because compass cannot point two directions.',
  },
  {
    word: 'MOTOR',
    subject: 'Science - Physics',
    chapter: 'Magnetic Effects of Electric Current',
    chapterSlug: 'magnetic-effects-of-electric-current',
    definition: 'An electromagnetic device that converts electrical energy into mechanical rotational energy using magnetic force.',
    boardTip: 'Electric motor operates on Fleming\'s Left-Hand Rule (FBI: Force = Thumb, B-field = Forefinger, Current = Middle finger).',
    formulaOrFact: 'Commutator (split ring) reverses the direction of current in loop every half rotation.',
  },
  {
    word: 'FORCE',
    subject: 'Science - Physics',
    chapter: 'Magnetic Effects of Electric Current',
    chapterSlug: 'magnetic-effects-of-electric-current',
    definition: 'The mechanical push or pull experienced by a current-carrying conductor placed inside an external magnetic field (F = BIL sin θ).',
    boardTip: 'The force is MAXIMUM when the conductor is perpendicular (90°) to the magnetic field direction.',
    formulaOrFact: 'Force direction given by Fleming\'s Left Hand Rule.',
  },
  {
    word: 'EARTH',
    subject: 'Science - Physics',
    chapter: 'Magnetic Effects of Electric Current',
    chapterSlug: 'magnetic-effects-of-electric-current',
    definition: 'The safety wire (green/yellow insulation) connected to a metal plate deep in ground, providing a low-resistance path for leakage current.',
    boardTip: 'Earthing prevents severe electric shock by safely discharging leakage current to the ground and blowing the fuse if needed.',
    formulaOrFact: 'Three domestic wires: Live (Red/Brown, 220V), Neutral (Black/Blue, 0V), Earth (Green/Yellow).',
  },
  {
    word: 'SOLAR',
    subject: 'Science - Physics & Environment',
    chapter: 'Our Environment / Energy',
    chapterSlug: 'our-environment',
    definition: 'Relating to energy from the sun, which is the primary ultimate energy source powering all biogeochemical cycles and food chains on Earth.',
    boardTip: 'Green plants capture only about 1% of the solar energy that falls on their leaves and convert it into chemical food energy.',
    formulaOrFact: 'Solar cells use Silicon semiconductors to convert light directly to electricity.',
  },

  // MATHEMATICS
  {
    word: 'CHORD',
    subject: 'Mathematics',
    chapter: 'Circles',
    chapterSlug: 'circles',
    definition: 'A straight line segment whose endpoints both lie on the circular circumference (the diameter is the longest possible chord).',
    boardTip: 'Tangents drawn at the ends of a diameter are parallel; a perpendicular from the center to a chord bisects the chord.',
    formulaOrFact: 'In circle: Tangent is perpendicular to radius at point of contact (OP ⊥ PT).',
  },
  {
    word: 'RADII',
    subject: 'Mathematics',
    chapter: 'Circles / Areas Related to Circles',
    chapterSlug: 'areas-related-to-circles',
    definition: 'The plural form of radius; straight lines extending from the center of a circle or sphere to its boundary circumference.',
    boardTip: 'Two concentric circles have equal centre but different radii (r₁ and r₂). Ring Area = π(R² - r²).',
    formulaOrFact: 'Area of circle = πr²; Circumference = 2πr',
  },
  {
    word: 'ANGLE',
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry',
    chapterSlug: 'introduction-to-trigonometry',
    definition: 'The figure formed by two rays sharing a common vertex, measured in degrees; fundamental for right-triangle trigonometry ratios.',
    boardTip: 'Standard angle values to memorize: sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, tan 45° = 1, tan 30° = 1/√3, tan 60° = √3.',
    formulaOrFact: 'sin²θ + cos²θ = 1; 1 + tan²θ = sec²θ; 1 + cot²θ = cosec²θ',
  },
  {
    word: 'RATIO',
    subject: 'Mathematics',
    chapter: 'Introduction to Trigonometry / Triangles',
    chapterSlug: 'introduction-to-trigonometry',
    definition: 'The quantitative relation between two amounts, such as side lengths in trigonometric ratios (sin, cos, tan) or Thales theorem sections.',
    boardTip: 'Basic Proportionality Theorem (BPT / Thales): If a line is drawn parallel to one side of a triangle, it divides the other two sides in the same ratio.',
    formulaOrFact: 'BPT: In ΔABC, if DE || BC, then AD/DB = AE/EC',
  },
  {
    word: 'SLANT',
    subject: 'Mathematics',
    chapter: 'Surface Areas and Volumes',
    chapterSlug: 'surface-areas-and-volumes',
    definition: 'The slant height (l) of a right circular cone, which represents the hypotenuse distance from the apex to any point on base circle.',
    boardTip: 'Do not confuse height (h) with slant height (l)! CSA of cone uses slant height: CSA = πrl.',
    formulaOrFact: 'Slant height: l = √(r² + h²); Cone CSA = πrl; Cone TSA = πr(l + r)',
  },
  {
    word: 'CONES',
    subject: 'Mathematics',
    chapter: 'Surface Areas and Volumes',
    chapterSlug: 'surface-areas-and-volumes',
    definition: 'Three-dimensional geometric solids with a circular flat base tapering smoothly to a single point called the apex or vertex.',
    boardTip: 'Volume of a cone is exactly 1/3 the volume of a cylinder having identical base radius and vertical height.',
    formulaOrFact: 'Volume of Cone = (1/3)πr²h',
  },
  {
    word: 'SOLID',
    subject: 'Mathematics',
    chapter: 'Surface Areas and Volumes',
    chapterSlug: 'surface-areas-and-volumes',
    definition: 'A three-dimensional object having length, width, and height (e.g. cylinder, sphere, cone, hemisphere, cuboid).',
    boardTip: 'When a solid is recast / melted into another solid shape, its total VOLUME remains unchanged!',
    formulaOrFact: 'Volume of molten metal = Volume of new solid object',
  },
  {
    word: 'MODES',
    subject: 'Mathematics',
    chapter: 'Statistics',
    chapterSlug: 'statistics',
    definition: 'The value that appears most frequently in a dataset; in grouped data, calculated using the modal class with highest frequency.',
    boardTip: 'Empirical Relationship: Mode = 3 Median - 2 Mean (frequent 1-mark board exam question!).',
    formulaOrFact: 'Mode = l + [(f₁ - f₀) / (2f₁ - f₀ - f₂)] × h',
  },
  {
    word: 'CARDS',
    subject: 'Mathematics',
    chapter: 'Probability',
    chapterSlug: 'probability',
    definition: 'Standard 52-card playing deck divided into 4 suits (Spades ♠, Clubs ♣, Hearts ♥, Diamonds ♦) with 12 face cards (King, Queen, Jack).',
    boardTip: '52 cards = 26 Red (Hearts, Diamonds) + 26 Black (Spades, Clubs). Exactly 12 Face Cards (4 Kings, 4 Queens, 4 Jacks). Aces are NOT face cards.',
    formulaOrFact: 'P(Face card) = 12/52 = 3/13; P(Red King) = 2/52 = 1/26',
  },
  {
    word: 'EVENT',
    subject: 'Mathematics',
    chapter: 'Probability',
    chapterSlug: 'probability',
    definition: 'A collection of one or more outcomes of a random experiment; probability is the ratio of favorable outcomes to total possible outcomes.',
    boardTip: 'The sum of probabilities of all elementary events is always 1: P(E) + P(not E) = 1; 0 ≤ P(E) ≤ 1.',
    formulaOrFact: 'Classical Probability P(E) = n(E) / n(S)',
  },
  {
    word: 'COINS',
    subject: 'Mathematics',
    chapter: 'Probability',
    chapterSlug: 'probability',
    definition: 'Fair two-sided objects (Heads and Tails) frequently used in probability problems; tossing n coins yields 2^n total sample space outcomes.',
    boardTip: 'Tossing 2 coins: {HH, HT, TH, TT} = 4 outcomes. Tossing 3 coins: 2³ = 8 outcomes.',
    formulaOrFact: 'P(At least one head in 2 coins) = 3/4; P(Exactly one head) = 2/4 = 1/2',
  },
  {
    word: 'PRIME',
    subject: 'Mathematics',
    chapter: 'Real Numbers',
    chapterSlug: 'real-numbers',
    definition: 'A natural number greater than 1 that has no positive divisors other than 1 and itself (e.g. 2, 3, 5, 7, 11).',
    boardTip: 'Fundamental Theorem of Arithmetic: Every composite number can be expressed uniquely as a product of prime powers, apart from order.',
    formulaOrFact: 'HCF(a, b) × LCM(a, b) = a × b (Valid only for TWO numbers!)',
  },
  {
    word: 'TERMS',
    subject: 'Mathematics',
    chapter: 'Arithmetic Progressions',
    chapterSlug: 'arithmetic-progressions',
    definition: 'The distinct individual members forming an arithmetic sequence where consecutive members differ by a constant common difference (d).',
    boardTip: 'The nth term from the end of an AP is given by: l - (n - 1)d, where l is the last term.',
    formulaOrFact: 'nth term: aₙ = a + (n - 1)d; Sum: Sₙ = n/2 [2a + (n - 1)d]',
  },
  {
    word: 'POINT',
    subject: 'Mathematics',
    chapter: 'Coordinate Geometry',
    chapterSlug: 'coordinate-geometry',
    definition: 'An exact location in a 2D Cartesian plane defined by an ordered pair of coordinates (x, y) (abscissa and ordinate).',
    boardTip: 'Distance from origin (0, 0) to point (x, y) is simply √(x² + y²). Any point on x-axis has coordinates (x, 0).',
    formulaOrFact: 'Distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]',
  },
  {
    word: 'SCALE',
    subject: 'Mathematics',
    chapter: 'Coordinate Geometry / Statistics',
    chapterSlug: 'coordinate-geometry',
    definition: 'The ratio of a distance on a graph, map, or model to the actual distance, used in plotting coordinates and ogive curves.',
    boardTip: 'In coordinate geometry section formula, internal division ratio m₁:m₂ computes partition coordinates.',
    formulaOrFact: 'Section formula: x = (m₁x₂ + m₂x₁)/(m₁ + m₂), y = (m₁y₂ + m₂y₁)/(m₁ + m₂)',
  },
];

// Comprehensive 5-letter valid guess word list so students can enter general valid words
export const VALID_GUESS_WORDS: Set<string> = new Set([
  ...SCI_WORDLE_TARGETS.map(t => t.word),
  // Additional scientific / mathematical 5-letter words
  'ALKYN', 'ALBUM', 'AMINE', 'APEXS', 'ATOMS', 'AXIAL', 'BASIS', 'BOUND', 'BLOOD',
  'BULBS', 'BRAIN', 'CABLE', 'CARBO', 'CHLOR', 'CORAL', 'CRUST', 'CYCLE', 'CYTON',
  'DECAY', 'DELTA', 'DIODE', 'EARTH', 'ELAST', 'ENTER', 'ENZYM', 'EPOXY', 'EQUAL',
  'FATTY', 'FEMUR', 'FIBER', 'FIBRE', 'FIELD', 'FLAME', 'FLUID', 'FOCAL', 'FOCUS',
  'FORCE', 'FOSSA', 'GAMMA', 'GASES', 'GENES', 'GERMS', 'GLAND', 'GLASS', 'GRAPH',
  'HEART', 'HEAVY', 'HELIX', 'HERTZ', 'HORNS', 'HYDRO', 'HYDRA', 'HYPOT', 'IMAGE',
  'IONIC', 'ISOTO', 'JOULE', 'LASER', 'LIGHT', 'LIVER', 'LUMEN', 'LUNGS', 'MAGMA',
  'MASSY', 'MEIOS', 'METAL', 'METER', 'MITOS', 'MODAL', 'MODES', 'MOLAR', 'MOTOR',
  'MUTAT', 'NERVE', 'NODES', 'OPTIC', 'ORBIT', 'ORGAN', 'OVARY', 'OVULE', 'OXIDE',
  'OZONE', 'PHASE', 'PIPET', 'PLANT', 'PLATE', 'POLES', 'POWER', 'PRIME', 'PRISM',
  'PULSE', 'PUPIL', 'RADII', 'RADIO', 'RADON', 'RATIO', 'RAYON', 'REACT', 'REDOX',
  'RESIN', 'ROOTS', 'SALTS', 'SCALE', 'SEEDS', 'SERUM', 'SHOCK', 'SIGHT', 'SINEW',
  'SLANT', 'SLOPE', 'SOLAR', 'SOLID', 'SOLVE', 'SOUND', 'SPACE', 'SPARK', 'SPERM',
  'SPORE', 'STAGE', 'STALK', 'STEAM', 'STEMS', 'TERMS', 'TESTA', 'TITRE', 'TOXIC',
  'TOXIN', 'TRAIT', 'TUBES', 'UMBRA', 'VALVE', 'VAPOR', 'VEINS', 'VIRUS', 'VISCO',
  'VOLTS', 'WASTE', 'WATER', 'WATTS', 'WAVES', 'WHITE', 'WIRES', 'XYLEM', 'YIELD',
  'ZEBRA', 'ZINCS', 'ZYGOT',
  // Common 5-letter English words for good input tolerance
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADAPT', 'ADMIT', 'ADOPT', 'ADULT',
  'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALERT', 'ALIEN', 'ALIGN',
  'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGEL', 'ANGER',
  'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'AREAS', 'ARGUE', 'ARISE', 'ARMED',
  'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWARD', 'AWARE',
  'BADLY', 'BAKER', 'BASES', 'BASIC', 'BASIS', 'BEACH', 'BEGAN', 'BEGIN', 'BEGUN',
  'BEING', 'BELOW', 'BENCH', 'BIRTH', 'BLACK', 'BLAME', 'BLIND', 'BLOCK', 'BOARD',
  'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BREAD', 'BREAK', 'BREED', 'BRIEF',
  'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF',
  'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHART', 'CHASE', 'CHEAP', 'CHECK',
  'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN',
  'CLEAR', 'CLICK', 'CLOCK', 'CLOSE', 'COACH', 'COAST', 'COUNT', 'COURT', 'COVER',
  'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CURVE',
  'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING',
  'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK',
  'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY',
  'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT',
  'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY',
  'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS',
  'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRAUD', 'FRESH', 'FRONT',
  'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE',
  'GRADE', 'GRAND', 'GRANT', 'GRASS', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN',
  'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HENCE',
  'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT',
  'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE',
  'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL',
  'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOGIC', 'LOOSE',
  'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA',
  'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS',
  'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH',
  'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED',
  'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT',
  'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO',
  'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT',
  'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE',
  'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE',
  'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REFER', 'RIGHT', 'RIVAL', 'RIVER',
  'ROBIN', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE',
  'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE',
  'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT',
  'SHOWN', 'SIGHT', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE',
  'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND',
  'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE',
  'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL',
  'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP',
  'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN',
  'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT', 'THEIR',
  'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
  'THREW', 'THROW', 'TIGHT', 'TIMES', 'TIRED', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL',
  'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL',
  'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUST', 'TRUTH', 'TWICE', 'UNDER', 'UNDUE',
  'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID',
  'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOICE', 'WASTE', 'WATCH', 'WATER',
  'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN',
  'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WOUND', 'WRITE', 'WRONG',
  'WROTE', 'YIELD', 'YOUNG', 'YOUTH',
]);

// Deterministic Daily Term Index Selector
export function getDailyTerm(dateString?: string): { term: SciWordleTerm; dayNumber: number } {
  const date = dateString ? new Date(dateString) : new Date();
  // Epoch reference (Jan 1, 2026)
  const epoch = new Date('2026-01-01T00:00:00Z').getTime();
  const utcNow = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = Math.max(1, Math.floor((utcNow - epoch) / (1000 * 60 * 60 * 24)) + 1);

  const index = (dayNumber * 7 + 13) % SCI_WORDLE_TARGETS.length;
  return {
    term: SCI_WORDLE_TARGETS[index],
    dayNumber,
  };
}

export function getRandomTerm(excludeWord?: string): SciWordleTerm {
  const filtered = excludeWord
    ? SCI_WORDLE_TARGETS.filter(t => t.word !== excludeWord)
    : SCI_WORDLE_TARGETS;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index];
}

// Letter state type for Wordle grid
export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface EvaluatedLetter {
  letter: string;
  state: LetterState;
}

export function evaluateGuess(guess: string, target: string): EvaluatedLetter[] {
  const result: EvaluatedLetter[] = Array.from({ length: 5 }, (_, i) => ({
    letter: guess[i],
    state: 'absent' as LetterState,
  }));

  const targetChars = target.split('');
  const guessChars = guess.split('');
  const targetUsed = Array(5).fill(false);
  const guessUsed = Array(5).fill(false);

  // First pass: Find greens (exact position)
  for (let i = 0; i < 5; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i].state = 'correct';
      targetUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Second pass: Find yellows (present in word, wrong position)
  for (let i = 0; i < 5; i++) {
    if (guessUsed[i]) continue;
    for (let j = 0; j < 5; j++) {
      if (!targetUsed[j] && guessChars[i] === targetChars[j]) {
        result[i].state = 'present';
        targetUsed[j] = true;
        break;
      }
    }
  }

  return result;
}
