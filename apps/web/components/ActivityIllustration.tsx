import type { CSSProperties } from 'react';

type IllustrationBase = {
  title: string;
  summary: string;
  observation: string;
  image: string;
  imageHeight?: number;
  imageWidth?: number;
  alt: string;
  columns?: number;
  rows?: number;
  column?: number;
  row?: number;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

type Illustration =
  | (IllustrationBase & {
      figure?: string;
      kind?: 'activity';
      number: string;
    })
  | (IllustrationBase & {
      figure: string;
      kind: 'figure';
    });

type IllustrationHotspot = {
  label: string;
  x: number;
  y: number;
};

const CHAPTER_ONE_IMAGE_DIMENSIONS = {
  imageHeight: 675,
  imageWidth: 1200,
} as const;

const ILLUSTRATIONS: Record<string, Illustration> = {
  'figure-1-1-magnesium-ribbon': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.1',
    figure: '1.1',
    title: 'Burning magnesium ribbon in air',
    summary: 'A cleaned magnesium ribbon is held with tongs in a burner flame, and the white ash is collected in a watch glass.',
    observation: 'Magnesium burns with a dazzling white flame and forms white magnesium oxide.',
    image: '/activity-illustrations/activity-1-1-burning-magnesium.webp',
    alt: 'Magnesium ribbon held with tongs burns with a dazzling white light above a watch glass that collects white magnesium oxide ash.',
  },
  'activity-1-2-lead-nitrate-potassium-iodide': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.2', title: 'Lead nitrate and potassium iodide',
    summary: 'Two colourless solutions are mixed in a test tube.', observation: 'A yellow precipitate of lead iodide forms.',
    image: '/activity-illustrations/activity-1-2-lead-iodide.webp', alt: 'Two clear solutions are mixed in a test tube and form a bright yellow lead iodide precipitate.',
  },
  'activity-1-3-zinc-sulphuric-acid': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.3', figure: '1.2', title: 'Zinc with dilute sulphuric acid',
    summary: 'Zinc granules react with dilute sulphuric acid in a corked conical flask with a short glass outlet tube.', observation: 'Hydrogen bubbles form and the flask becomes warm.',
    image: '/activity-illustrations/activity-1-3-zinc-acid.webp', alt: 'NCERT Figure 1.2 redraw showing zinc granules and dilute sulphuric acid reacting in a corked conical flask while hydrogen leaves through a short glass tube.',
  },
  'activity-1-4-quicklime-water': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.4', figure: '1.3', title: 'Quicklime and water',
    summary: 'Water is added slowly to quicklime in a beaker, whose outside is touched carefully to check the temperature.', observation: 'The beaker becomes hot as slaked lime forms.',
    image: '/activity-illustrations/activity-1-4-quicklime-water.webp', alt: 'NCERT Figure 1.3 redraw showing a hand carefully touching a beaker containing quicklime and water.',
  },
  'activity-1-5-heating-ferrous-sulphate': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.5', figure: '1.4', title: 'Heating ferrous sulphate crystals',
    summary: 'Green ferrous sulphate crystals are heated in a dry boiling tube held with its mouth pointed away.', observation: 'The crystals lose water, turn brown and release gases with the odour of burning sulphur.',
    image: '/activity-illustrations/activity-1-5-ferrous-sulphate.webp', alt: 'NCERT Figure 1.4 redraw showing safe heating of ferrous sulphate in a hand-held boiling tube and gentle wafting of the evolved gas.',
  },
  'activity-1-6-heating-lead-nitrate': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.6', figure: '1.5', title: 'Heating lead nitrate',
    summary: 'Lead nitrate is heated in a boiling tube held safely with tongs.', observation: 'Lead oxide forms and brown nitrogen dioxide fumes are emitted.',
    image: '/activity-illustrations/activity-1-6-lead-nitrate.webp', alt: 'NCERT Figure 1.5 redraw showing a hand using tongs to heat lead nitrate in a boiling tube while brown nitrogen dioxide fumes escape.',
  },
  'activity-1-7-electrolysis-water': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.7', figure: '1.6', title: 'Electrolysis of water', summary: 'A 6 V battery passes current through acidified water using base-mounted graphite electrodes and inverted collection tubes.',
    observation: 'Hydrogen collects in about twice the volume of oxygen.', image: '/activity-illustrations/activity-1-7-electrolysis-water.webp',
    alt: 'NCERT Figure 1.6 redraw showing a plastic mug, base-mounted graphite electrodes, rubber stoppers, inverted test tubes, switch and battery, with twice as much hydrogen as oxygen.',
  },
  'activity-1-8-photochemical-decomposition': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.8', figure: '1.7', title: 'Silver chloride in sunlight', summary: 'White silver chloride in a china dish is exposed to sunlight.', observation: 'It turns grey because silver forms.',
    image: '/activity-illustrations/activity-1-8-silver-chloride.webp', alt: 'NCERT Figure 1.7 redraw showing sunlight falling on silver chloride in a china dish as the sample turns from white to grey.',
  },
  'activity-1-9-iron-copper-sulphate': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.9', figure: '1.8(a)-(b)', title: 'Iron nails in copper sulphate', summary: 'Three nails and test tubes A/B provide a before-and-after comparison.', observation: 'Two immersed nails gain a copper coating and the reaction solution becomes pale green.',
    image: '/activity-illustrations/activity-1-9-iron-copper-sulphate.webp', alt: 'NCERT Figure 1.8 redraw comparing clean iron nails and blue copper sulphate before reaction with copper-coated nails and pale-green iron sulphate after 20 minutes.',
  },
  'activity-1-10-barium-sulphate-precipitate': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.10', figure: '1.9', title: 'Formation of barium sulphate', summary: 'Separate sodium sulphate and barium chloride solutions are mixed.', observation: 'A white insoluble barium sulphate precipitate forms.',
    image: '/activity-illustrations/activity-1-10-barium-sulphate.webp', alt: 'NCERT Figure 1.9 redraw showing two clear salt solutions being mixed in a receiving test tube where a white barium sulphate precipitate forms.',
  },
  'activity-1-11-heating-copper-powder': {
    ...CHAPTER_ONE_IMAGE_DIMENSIONS,
    number: '1.11', figure: '1.10', title: 'Heating copper powder', summary: 'Copper powder is heated in a china dish on wire gauze and a tripod.', observation: 'The reddish-brown copper surface becomes black copper oxide.',
    image: '/activity-illustrations/activity-1-11-heating-copper.webp', alt: 'NCERT Figure 1.10 redraw showing copper powder heated in a china dish on wire gauze and a tripod as a black copper oxide coating forms.',
  },
  'activity-2-1-indicator-tests': {
    imageHeight: 945,
    imageWidth: 1680,
    number: '2.1',
    title: 'Testing acids and bases with indicators',
    summary: 'Litmus, phenolphthalein and methyl orange are used to compare acidic and basic solutions.',
    observation: 'Acid turns blue litmus red, while base turns red litmus blue; phenolphthalein is colourless in acid and pink in base; methyl orange is red in acid and yellow in base.',
    image: '/activity-illustrations/activity-2-1-indicator-tests-v2.png',
    alt: 'Three indicator comparisons show litmus strips, colourless and pink phenolphthalein tests, and red and yellow methyl-orange tests in acidic and basic solutions.',
  },
  'activity-2-2-olfactory-indicators': {
    number: '2.2', title: 'Olfactory indicators', summary: 'Onion, vanilla and clove indicators are compared in acid and base.', observation: 'Their odours behave differently in acidic and basic media.',
    image: '/activity-illustrations/chapter-2-activities-2-1-to-2-4.png', alt: 'Covered sample tubes compare onion, vanilla and clove olfactory indicators in dilute acid and base.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-2-3-metal-acid-hydrogen-pop': {
    number: '2.3', title: 'Metal and acid hydrogen test', summary: 'Zinc reacts with dilute sulphuric acid and the gas is tested safely.', observation: 'Hydrogen bubbles form and burn with a pop.',
    image: '/activity-illustrations/chapter-2-activities-2-1-to-2-4.png', alt: 'Zinc and dilute acid produce hydrogen that travels through a delivery tube to soap bubbles for a pop test.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-2-4-base-metal-heating': {
    number: '2.4', title: 'Base and metal on heating', summary: 'Zinc reacts with sodium hydroxide when heated.', observation: 'Hydrogen gas is released and sodium zincate forms.',
    image: '/activity-illustrations/chapter-2-activities-2-1-to-2-4.png', alt: 'A safely clamped test tube containing zinc and sodium hydroxide is heated and releases hydrogen bubbles.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-2-5-carbonate-acid-lime-water': {
    number: '2.5', title: 'Carbonate, acid and lime water', summary: 'A carbonate reacts with acid and the gas is passed through lime water.', observation: 'Carbon dioxide turns lime water milky.',
    image: '/activity-illustrations/chapter-2-activities-2-5-to-2-8.png', alt: 'Carbon dioxide from a carbonate and acid reaction passes through a delivery tube and turns lime water milky.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-2-6-reversible-neutralisation': {
    number: '2.6', title: 'Reversible colour change', summary: 'Acid and base are added in turn to a phenolphthalein solution.', observation: 'The solution changes from pink to colourless and back to pink.',
    image: '/activity-illustrations/chapter-2-activities-2-5-to-2-8.png', alt: 'Adjacent test tubes show phenolphthalein changing from pink to colourless and back to pink as acid and base are added.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-2-7-metallic-oxide-acid': {
    number: '2.7', title: 'Metallic oxide and acid', summary: 'Dilute hydrochloric acid is added to black copper oxide.', observation: 'The solid dissolves and a blue-green copper chloride solution forms.',
    image: '/activity-illustrations/chapter-2-activities-2-5-to-2-8.png', alt: 'Black copper oxide dissolves as dilute hydrochloric acid is added, leaving a blue-green solution.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-2-8-acid-electricity-conduction': {
    imageHeight: 945,
    imageWidth: 1680,
    number: '2.8',
    title: 'Ions make aqueous solutions conduct',
    summary: 'Two iron nails held in a rubber cork complete a circuit through each test solution.',
    observation: 'The bulb glows in dilute acid because ions carry current, but remains off in glucose or alcohol solution because these do not form ions.',
    image: '/activity-illustrations/activity-2-8-conductivity-comparison-v2.png',
    alt: 'Two matching circuits use iron nails fixed in corks: the bulb glows through a dilute acid solution and remains off through a glucose or alcohol solution.',
  },
  'activity-2-9-dry-wet-hcl-litmus': {
    number: '2.9', figure: '2.4', title: 'Dry and wet litmus with hydrogen chloride gas',
    summary: 'Hydrogen chloride gas is prepared and brought into contact with dry and wet blue litmus paper.',
    observation: 'Dry blue litmus stays blue; wet blue litmus turns red because HCl forms ions only in water.',
    image: '/activity-illustrations/chapter-2-activities-2-9-to-2-12-v2.png',
    alt: 'Hydrogen chloride gas is prepared in a clamped test tube and passed toward dry blue litmus and wet blue litmus, with only the wet strip turning red.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-2-10-dilution-and-ions': {
    number: '2.10', figure: '2.5', title: 'Dilution changes ion concentration',
    summary: 'Water is added slowly to an acid or base while the solution is mixed safely.',
    observation: 'Dilution lowers the concentration of H3O+ or OH- ions per unit volume and releases heat.',
    image: '/activity-illustrations/chapter-2-activities-2-9-to-2-12-v2.png',
    alt: 'Water is added slowly to separate acid and base solutions while coloured particle models show their ions spreading through a larger volume.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-2-11-common-substance-ph': {
    number: '2.11', figure: '2.7', title: 'Testing the pH of common substances',
    summary: 'Small samples are tested one by one with pH paper or universal indicator.',
    observation: 'The indicator colours place each sample on the acidic, neutral or basic side of the pH scale.',
    image: '/activity-illustrations/chapter-2-activities-2-9-to-2-12-v2.png',
    alt: 'Common liquid samples are arranged with pH-paper strips showing red, orange, yellow, green, blue and purple test colours.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-2-12-soil-ph': {
    number: '2.12', title: 'Testing soil pH',
    summary: 'Soil is mixed with water, filtered and the clear filtrate is tested.',
    observation: 'The pH-paper colour indicates whether the soil is suitable for the crop or needs treatment.',
    image: '/activity-illustrations/chapter-2-activities-2-9-to-2-12-v2.png',
    alt: 'A soil-water mixture is filtered and a drop of the clear filtrate is placed on pH paper.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-2-13-family-of-salts': {
    number: '2.13', title: 'Finding families of salts',
    summary: 'Salt samples are grouped by a common positive or negative ion.',
    observation: 'Salts with the same cation or the same anion belong to one family.',
    image: '/activity-illustrations/chapter-2-activities-2-13-to-2-15-and-figure-2-10-v2.png',
    alt: 'Watch glasses of salt crystals are grouped with matching coloured ion-model spheres to compare families of salts.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-2-14-ph-of-salts': {
    number: '2.14', title: 'Testing the pH of salt solutions',
    summary: 'Solutions of several salts are tested with pH paper.',
    observation: 'Different salts can give acidic, neutral or basic solutions depending on their parent acid and base.',
    image: '/activity-illustrations/chapter-2-activities-2-13-to-2-15-and-figure-2-10-v2.png',
    alt: 'Five salt solutions are tested with pH-paper strips showing acidic, neutral and basic colours.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-2-15-water-of-crystallisation': {
    number: '2.15', figure: '2.9', title: 'Water of crystallisation in copper sulphate',
    summary: 'Blue copper sulphate crystals are heated, cooled and then supplied with water again.',
    observation: 'The crystals turn white and release droplets on heating; adding water restores the blue colour.',
    image: '/activity-illustrations/chapter-2-activities-2-13-to-2-15-and-figure-2-10-v2.png',
    alt: 'Blue copper sulphate crystals are heated in a clamped test tube, water droplets collect near the mouth, and water added to the white sample restores blue crystals.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-2-8-chlor-alkali-products': {
    imageHeight: 1024,
    imageWidth: 1536,
    kind: 'figure',
    figure: '2.8',
    title: 'Chlor-alkali cell and its products',
    summary: 'Brine is electrolysed in separated compartments so chlorine, hydrogen and sodium hydroxide can be collected without mixing.',
    observation: 'Chlorine forms at the positive anode, hydrogen forms at the negative cathode, and sodium hydroxide remains in solution near the cathode.',
    image: '/activity-illustrations/figure-2-8-chlor-alkali-products-v2.png',
    alt: 'A membrane chlor-alkali cell shows brine entering, chlorine bubbles at the positive graphite anode, hydrogen bubbles at the negative steel cathode, sodium hydroxide solution leaving, and separate product-use vignettes.',
  },
  'figure-2-10-soda-acid-fire-extinguisher': {
    kind: 'figure', figure: '2.10', title: 'Soda-acid fire extinguisher model',
    summary: 'A small acid bottle hangs inside a larger bottle containing baking-soda solution and connects to a delivery tube.',
    observation: 'Tilting mixes acid and baking soda; carbon dioxide travels through the tube and extinguishes the candle.',
    image: '/activity-illustrations/chapter-2-activities-2-13-to-2-15-and-figure-2-10-v2.png',
    alt: 'An upright and tilted soda-acid fire-extinguisher model show an inner acid bottle, baking-soda solution, a side delivery tube and a candle extinguished by carbon dioxide.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-3-properties-physical-tests': {
    number: '3.1-3.4', title: 'Physical properties of metals', summary: 'Metal samples are cleaned, cut and hammered under controlled conditions.', observation: 'Fresh surfaces are lustrous, hardness varies and some metals flatten into sheets.',
    image: '/activity-illustrations/chapter-3-activities-3-1-to-3-7-v2.png', alt: 'Metal samples are compared before and after surface cleaning, sodium is handled with tongs on a watch glass, and a metal piece is hammered into a sheet.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-3-5-thermal-conductivity': {
    number: '3.5', figure: '3.1', title: 'Heat conduction through a metal wire', summary: 'A wire is clamped, a single pin is fixed with wax at the free end and the wire is heated near the clamp.', observation: 'Heat reaches the wax and the pin falls while the metal wire itself does not melt.',
    image: '/activity-illustrations/chapter-3-activities-3-1-to-3-7-v2.png', alt: 'A horizontal metal wire is clamped at the left, heated near the clamp and holds one pin with wax at the free right end.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-3-6-electrical-conductivity': {
    number: '3.6', figure: '3.2', title: 'Electrical conductivity of a metal', summary: 'A metal sample bridges two terminals in a battery, switch and bulb circuit.', observation: 'The closed circuit makes the bulb glow, showing that the metal conducts electricity.',
    image: '/activity-illustrations/figure-3-2-metal-conductivity-v2.svg', alt: 'One continuous series circuit connects a battery, closed switch, glowing bulb and a metal sample held between two clips.',
  },
  'activity-3-7-nonmetal-properties': {
    number: '3.7', title: 'Physical tests on non-metals', summary: 'Coal or graphite, sulphur and iodine are compared using the earlier physical tests.', observation: 'The samples are brittle and generally do not conduct, while graphite is the conducting exception.',
    image: '/activity-illustrations/chapter-3-activities-3-1-to-3-7-v2.png', alt: 'Coal or graphite, sulphur and iodine samples are cleaned, hammered and placed in conductivity circuits to compare their physical properties.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-3-8-3-9-combustion-oxides': {
    number: '3.8-3.9', title: 'Combustion and the nature of oxides', summary: 'Magnesium and sulphur are burned and their products are tested.', observation: 'Magnesium oxide is basic, while sulphur dioxide forms an acidic solution.',
    image: '/activity-illustrations/chapter-3-activities-3-8-to-3-12-v2.png', alt: 'Side-by-side safe setups show magnesium and sulphur burning, their products collected separately and resulting solutions compared with red and blue litmus.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-3-10-3-12-reactivity-sandbox': {
    number: '3.10-3.12', title: 'Reactivity with water, acids and salt solutions', summary: 'Metal reactions are compared under the same conditions.', observation: 'More reactive metals react faster and displace less reactive metals.',
    image: '/activity-illustrations/chapter-3-activities-3-8-to-3-12-v2.png', alt: 'A four-panel sheet compares metals with water and steam, dilute acid and metal salt solutions.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-3-10-water-and-steam': {
    number: '3.10', figure: '3.3', title: 'Metals with cold water, hot water and steam', summary: 'Samples that do not react with cold or hot water are tested with steam over a heated metal.', observation: 'Reactivity determines whether cold water, hot water, steam or no condition produces hydrogen.',
    image: '/activity-illustrations/chapter-3-activities-3-8-to-3-12-v2.png', alt: 'Cold- and hot-water beakers sit beside a steam apparatus that passes steam over heated metal and collects hydrogen over water.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-3-11-metals-with-acid': {
    number: '3.11', title: 'Metals with dilute hydrochloric acid', summary: 'Clean metal samples are placed in equal dilute acid samples with thermometer bulbs immersed.', observation: 'Bubble rate and temperature rise are greatest for magnesium; copper shows no reaction.',
    image: '/activity-illustrations/chapter-3-activities-3-8-to-3-12-v2.png', alt: 'Four equal acid test tubes with thermometers show different bubble rates for metal samples, from vigorous to no reaction.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-3-12-metal-salt-solutions': {
    number: '3.12', figure: '3.4', title: 'Metals with other metal salt solutions', summary: 'Copper wire in iron sulphate is compared with an iron nail in copper sulphate for twenty minutes.', observation: 'Only iron displaces copper, producing a copper coat and changing the blue solution to pale green.',
    image: '/activity-illustrations/chapter-3-activities-3-8-to-3-12-v2.png', alt: 'Before-and-after test tubes show copper wire unchanged in pale-green iron sulphate and an iron nail gaining a reddish copper coat as blue copper sulphate turns pale green.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-3-13-ionic-properties': {
    number: '3.13', title: 'Properties of ionic compounds', summary: 'Solid sodium chloride and its aqueous solution are tested for conductivity.', observation: 'The solid does not conduct, but the solution conducts because its ions can move.',
    image: '/activity-illustrations/chapter-3-activities-ionic-and-rusting.png', alt: 'Conductivity circuits compare solid sodium chloride with sodium chloride solution; only the solution lights the bulb.', columns: 2, rows: 1, column: 0, row: 0,
  },
  'activity-3-14-rusting-conditions': {
    number: '3.14', title: 'Conditions needed for rusting', summary: 'Iron nails are kept with air and water, without air, and without water.', observation: 'Rust forms only when both air and water are present.',
    image: '/activity-illustrations/chapter-3-activities-ionic-and-rusting.png', alt: 'Three corked test tubes compare iron nails with water and air, boiled water under oil, and dry air over calcium chloride.', columns: 2, rows: 1, column: 1, row: 0,
  },
  'figure-3-5-sodium-chloride-formation': {
    kind: 'figure', figure: '3.5', title: 'Formation of sodium chloride',
    summary: 'One electron moves from a sodium atom to a chlorine atom, producing oppositely charged ions with stable outer shells.',
    observation: 'The resulting sodium cation and chloride anion attract through strong electrostatic force.',
    image: '/activity-illustrations/chapter-3-figures-3-5-to-3-8-v2.png',
    alt: 'Electron-shell diagrams show one highlighted electron transferring from sodium to chlorine, followed by attraction between the positive and negative ions.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-3-6-magnesium-chloride-formation': {
    kind: 'figure', figure: '3.6', title: 'Formation of magnesium chloride',
    summary: 'A magnesium atom transfers one electron to each of two chlorine atoms.',
    observation: 'One magnesium cation and two chloride anions combine in the ratio required for magnesium chloride.',
    image: '/activity-illustrations/chapter-3-figures-3-5-to-3-8-v2.png',
    alt: 'Electron-shell diagrams show two highlighted magnesium electrons transferring separately to two chlorine atoms.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-3-7-heating-salt': {
    kind: 'figure', figure: '3.7', title: 'Heating a salt sample',
    summary: 'A small ionic-compound sample is heated on a metal spatula.',
    observation: 'The sample does not melt easily under ordinary laboratory heating, indicating a high melting point.',
    image: '/activity-illustrations/chapter-3-figures-3-5-to-3-8-v2.png',
    alt: 'A holder supports a metal spatula containing a white salt sample over a laboratory burner.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-3-8-salt-solution-conductivity': {
    kind: 'figure', figure: '3.8', title: 'Testing conductivity of a salt solution',
    summary: 'Two electrodes dip into salt solution and connect to a battery, switch and bulb.',
    observation: 'The bulb glows because dissolved positive and negative ions can move through the solution.',
    image: '/activity-illustrations/chapter-3-figures-3-5-to-3-8-v2.png',
    alt: 'A glowing-bulb circuit has two electrodes in a beaker of salt solution, with positive and negative ions moving toward opposite electrodes.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-3-9-reactivity-and-metallurgy': {
    kind: 'figure', figure: '3.9', title: 'Activity series and related metallurgy',
    summary: 'Three reactivity bands connect high-activity metals to electrolysis, middle metals to chemical reduction and low metals to native occurrence or mild heating.',
    observation: 'The extraction method becomes more energy-intensive as metal reactivity increases.',
    image: '/activity-illustrations/chapter-3-figures-3-9-to-3-12-v2.png',
    alt: 'A three-band metal reactivity ladder points to electrolysis at the top, furnace reduction in the middle and native metal nuggets at the bottom.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-3-10-extraction-flow': {
    kind: 'figure', figure: '3.10', title: 'Steps in extracting metals from ores',
    summary: 'Ore passes through concentration, oxide formation or heating, reduction and final refining.',
    observation: 'Each stage removes impurity or converts the metal compound closer to pure metal.',
    image: '/activity-illustrations/chapter-3-figures-3-9-to-3-12-v2.png',
    alt: 'A pictured process flow moves from mined ore to crushed enriched ore, a furnace, crude metal and a bright refined metal bar.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-3-11-thermit-welding': {
    kind: 'figure', figure: '3.11', title: 'Thermit process for joining railway tracks',
    summary: 'An aluminium-driven displacement reaction produces enough heat to form molten iron.',
    observation: 'Molten iron flows into the gap between railway-track ends and solidifies to join them.',
    image: '/activity-illustrations/chapter-3-figures-3-9-to-3-12-v2.png',
    alt: 'A protected refractory crucible pours a white-hot stream of molten iron into the gap between two railway-track ends.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-3-12-copper-refining': {
    kind: 'figure', figure: '3.12', title: 'Electrolytic refining of copper',
    summary: 'Impure copper is the positive anode, pure copper is the negative cathode and acidified copper sulphate is the electrolyte.',
    observation: 'Copper moves through the electrolyte to the cathode while insoluble impurities settle as anode mud.',
    image: '/activity-illustrations/chapter-3-figures-3-9-to-3-12-v2.png',
    alt: 'A refining tank shows a rough impure-copper anode, smooth pure-copper cathode, blue electrolyte, copper ion movement and dark anode mud.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-1-carbon-around-us': {
    number: '4.1', title: 'Carbon around us', summary: 'Everyday objects are grouped by the materials from which they are made.', observation: 'Many foods, fuels, fibres, plastics and medicines contain carbon compounds.',
    image: '/activity-illustrations/chapter-4-activities-4-1-to-4-5.png', alt: 'Everyday metal, glass, clay, paper, cloth, food, wood, plastic and fuel objects are arranged into visual groups.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-4-2-alcohol-homologous-series': {
    number: '4.2', title: 'Alcohol homologous series', summary: 'Successive alcohol molecules are compared.', observation: 'Each member keeps the hydroxyl group and differs from the next by one carbon and two hydrogen atoms.',
    image: '/activity-illustrations/chapter-4-activities-4-1-to-4-5.png', alt: 'Consistent molecular models show four alcohols growing one carbon unit at a time while keeping the same hydroxyl end group.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-4-3-4-4-combustion': {
    number: '4.3-4.4', title: 'Combustion of carbon compounds', summary: 'Different carbon compounds are burned and their flames are compared.', observation: 'A clean blue flame indicates cleaner combustion, while a yellow flame deposits soot.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png', alt: 'A carbon compound burns below a metal plate that collects soot, beside burner flames produced with closed and open air holes.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-4-5-oxidation-ethanol': {
    number: '4.5', title: 'Oxidation of ethanol', summary: 'Alkaline potassium permanganate is added to warm ethanol.', observation: 'Its purple colour disappears while ethanol is oxidised, then remains when the reagent is in excess.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png', alt: 'A dropper adds purple alkaline potassium permanganate to clamped warm ethanol, with a colourless comparison tube showing decolourisation.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-4-6-ethanol-sodium': {
    number: '4.6', title: 'Ethanol reacts with sodium', summary: 'A small piece of sodium is added carefully to ethanol.', observation: 'Hydrogen gas is released and sodium ethoxide forms.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png', alt: 'A tiny sodium piece is lowered carefully into ethanol in a clamped dry test tube and hydrogen bubbles form.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-4-7-acid-strength': {
    number: '4.7', title: 'Comparing ethanoic acid and hydrochloric acid', summary: 'Equal dilute samples are compared with litmus and universal indicator.', observation: 'Both are acidic, but hydrochloric acid shows much stronger acidity.',
    image: '/activity-illustrations/activity-4-7-acid-strength.png', alt: 'Equal dilute hydrochloric acid and ethanoic acid samples both turn blue litmus red, while universal indicator shows stronger acidity for hydrochloric acid.',
  },
  'activity-4-8-esterification': {
    number: '4.8', title: 'Esterification', summary: 'Ethanol and ethanoic acid are warmed with a few drops of concentrated sulphuric acid in a water bath.', observation: 'A pleasant fruity-smelling ester forms.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png', alt: 'A reaction test tube containing ethanol, ethanoic acid and concentrated sulphuric acid is warmed safely inside a hot-water bath.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-9-ethanoic-acid-carbonate': {
    number: '4.9', title: 'Ethanoic acid with a carbonate', summary: 'Ethanoic acid reacts with a carbonate and the gas is tested with lime water.', observation: 'Carbon dioxide turns the lime water milky.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png', alt: 'Carbon dioxide from ethanoic acid and sodium carbonate passes through a delivery tube into lime water.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-10-emulsion-micelles': {
    number: '4.10', title: 'Oil, water and soap', summary: 'Oil and water are shaken with and without soap.', observation: 'Soap keeps tiny oil droplets suspended as a cloudy emulsion.',
    image: '/activity-illustrations/chapter-4-soaps-and-detergents-v2.png', alt: 'Two shaken tubes compare separated oil and water with a cloudy, soap-stabilised emulsion.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-4-11-soap-hard-water': {
    number: '4.11', title: 'Soap in distilled and hard water', summary: 'Equal amounts of soap are shaken with distilled water and hard water.', observation: 'Distilled water lathers well, while hard water forms scum.',
    image: '/activity-illustrations/chapter-4-soaps-and-detergents-v2.png', alt: 'Hard-water test tubes show soap producing little foam and curdy scum while the comparison gives more foam.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-12-soap-vs-detergent': {
    number: '4.12', title: 'Soap and detergent in hard water', summary: 'Soap and detergent are shaken separately with the same hard water.', observation: 'Soap forms scum, while detergent continues to lather.',
    image: '/activity-illustrations/chapter-4-soaps-and-detergents-v2.png', alt: 'Hard-water tubes show soap producing scum and little foam while detergent produces abundant foam.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-4-1-to-4-5-covalent-bonding': {
    kind: 'figure', figure: '4.1-4.5', title: 'Shared pairs in simple molecules',
    summary: 'Molecular models compare single, double and triple shared-pair bonds and methane.',
    observation: 'Bond order is the number of shared electron pairs.',
    image: '/activity-illustrations/chapter-4-bonding-and-structures-v2.png',
    alt: 'Molecular illustration showing shared electron pairs in hydrogen, oxygen and nitrogen and four single bonds in methane.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-4-allotropes': {
    kind: 'figure', figure: '4.5 / allotropes box', title: 'Diamond, graphite and fullerene',
    summary: 'The same element forms a rigid three-dimensional lattice, sliding layers or a hollow cage.',
    observation: 'Structure explains why diamond is hard, graphite is soft and conducting, and C60 resembles a football.',
    image: '/activity-illustrations/chapter-4-bonding-and-structures-v2.png',
    alt: 'A diamond tetrahedral lattice, three stacked graphite layers and a spherical C60 fullerene cage.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-4-6-to-4-7-hydrocarbons': {
    kind: 'figure', figure: '4.6-4.7', title: 'Saturated and unsaturated hydrocarbons',
    summary: 'Ethane, ethene and ethyne are compared using a single, double and triple carbon-carbon bond.',
    observation: 'A double or triple carbon-carbon bond makes the hydrocarbon unsaturated.',
    image: '/activity-illustrations/chapter-4-bonding-and-structures-v2.png',
    alt: 'Ball-and-stick models compare ethane with one carbon-carbon bond, ethene with two and ethyne with three.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-4-8-to-4-10-carbon-skeletons': {
    kind: 'figure', figure: '4.8-4.10', title: 'Chains, branches and rings',
    summary: 'Carbon skeletons can be straight, branched or cyclic, including cyclohexane and benzene.',
    observation: 'The same atoms can be arranged in different skeletons, producing structural variety and isomers.',
    image: '/activity-illustrations/chapter-4-bonding-and-structures-v2.png',
    alt: 'Models show a straight chain, branched chain, five-membered ring, cyclohexane ring and benzene ring.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-4-11-esterification': {
    kind: 'figure', figure: '4.11', title: 'Formation of an ester',
    summary: 'Ethanol and ethanoic acid are warmed with concentrated sulphuric acid in a water bath.',
    observation: 'The product ethyl ethanoate has a pleasant fruity smell.',
    image: '/activity-illustrations/chapter-4-reactions-and-ethanoic-acid-v2.png',
    alt: 'A reaction test tube is warmed indirectly inside a beaker of hot water above a burner.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-4-12-micelle': {
    kind: 'figure', figure: '4.12', title: 'Formation of a micelle',
    summary: 'Soap tails enter an oil droplet while ionic heads remain in water.',
    observation: 'The grease is trapped at the centre and the hydrophilic heads face outward.',
    image: '/activity-illustrations/chapter-4-soaps-and-detergents-v2.png',
    alt: 'A soap molecule has a charged hydrophilic head and zigzag hydrophobic tail; many surround an oil droplet with tails inward and heads outward.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-4-13-soap-cleansing': {
    kind: 'figure', figure: '4.13', title: 'Effect of soap in cleaning',
    summary: 'Soap enters grease, breaks it into micelles, lifts it from cloth and keeps it suspended in rinse water.',
    observation: 'Agitation helps detach the grease-filled micelles so water can carry them away.',
    image: '/activity-illustrations/chapter-4-soaps-and-detergents-v2.png',
    alt: 'Four stages show grease on cloth, soap tails entering it, a micelle lifting it and rinse water carrying the micelle away.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-5-1-leaf-cross-section': {
    kind: 'figure', figure: '5.1', title: 'Cross-section of a leaf',
    summary: 'Leaf tissues place chloroplast-rich cells near light, air spaces near stomata and vascular tissue through the blade.',
    observation: 'Structure supports photosynthesis, gas exchange and transport.',
    image: '/activity-illustrations/chapter-5-photosynthesis-v2.png',
    alt: 'Leaf cross-section with cuticle, epidermis, palisade cells, spongy air spaces, a vascular bundle and a lower stomatal pore.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-5-1-variegated-leaf': {
    number: '5.1', figure: '5.2', title: 'Chlorophyll is necessary for photosynthesis',
    summary: 'A destarched variegated leaf is exposed to light, decolourised safely and tested with iodine.',
    observation: 'Only areas that were green turn blue-black, showing starch formed only where chlorophyll was present.',
    image: '/activity-illustrations/chapter-5-photosynthesis-v2.png',
    alt: 'A variegated leaf before testing and the same leaf after iodine, with only formerly green regions blue-black.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-5-3-stomata': {
    kind: 'figure', figure: '5.3', title: 'Open and closed stomatal pore',
    summary: 'Two guard cells surround a pore and change shape as their water content changes.',
    observation: 'Swollen guard cells open the pore; shrunken guard cells close it.',
    image: '/activity-illustrations/chapter-5-photosynthesis-v2.png',
    alt: 'Top views compare an open and a closed stomatal pore, each surrounded by two kidney-shaped guard cells containing chloroplasts.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-5-2-carbon-dioxide': {
    number: '5.2', figure: '5.4', title: 'Carbon dioxide is necessary for photosynthesis',
    summary: 'Two destarched plants are kept under sealed bell jars; potassium hydroxide absorbs carbon dioxide in one jar.',
    observation: 'The leaf without available carbon dioxide does not show the normal starch result.',
    image: '/activity-illustrations/chapter-5-photosynthesis-v2.png',
    alt: 'Two identical potted plants under sealed bell jars; one jar contains a small dish of potassium hydroxide and the control does not.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-5-5-amoeba-nutrition': {
    kind: 'figure', figure: '5.5', title: 'Nutrition in Amoeba',
    summary: 'Pseudopodia engulf food, a food vacuole forms, digestion and absorption occur, and residue is expelled.',
    observation: 'Amoeba changes its cell surface temporarily to surround food.',
    image: '/activity-illustrations/chapter-5-nutrition-respiration-v2.png',
    alt: 'Four stages show an Amoeba surrounding a food particle, forming a vacuole, digesting food and expelling residue.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-5-6-alimentary-canal': {
    kind: 'figure', figure: '5.6', title: 'Human alimentary canal',
    summary: 'Food passes through mouth, oesophagus, stomach, small intestine, large intestine, rectum and anus while accessory organs add secretions.',
    observation: 'Different regions specialise in digestion, absorption and egestion.',
    image: '/activity-illustrations/chapter-5-nutrition-respiration-v2.png',
    alt: 'Human digestive system showing mouth, salivary glands, oesophagus, stomach, liver, gall bladder, pancreas, small and large intestine, rectum and anus.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-5-4-5-5-respiration-tests': {
    number: '5.4-5.5', figure: '5.7', title: 'Carbon dioxide in exhaled air and fermentation',
    summary: 'Exhaled air and gas from yeast-sugar fermentation are passed into lime water.',
    observation: 'Lime water turns milky, showing carbon dioxide is produced.',
    image: '/activity-illustrations/chapter-5-nutrition-respiration-v2.png',
    alt: 'One setup shows a learner exhaling through a tube into lime water; another shows yeast and sugar sending gas through a delivery tube into lime water.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-5-8-glucose-breakdown': {
    kind: 'figure', figure: '5.8', title: 'Breakdown of glucose by various pathways',
    summary: 'Glucose becomes pyruvate in the cytoplasm, then follows fermentation, low-oxygen muscle or aerobic mitochondrial pathways.',
    observation: 'Aerobic breakdown releases much more usable energy than anaerobic pathways.',
    image: '/activity-illustrations/figure-5-8-glucose-breakdown-v2.svg',
    alt: 'A glucose node leads to pyruvate and branches to ethanol plus carbon dioxide without oxygen, lactic acid in low-oxygen muscle, or carbon dioxide and water in mitochondria with oxygen.',
  },
  'figure-5-9-respiratory-system': {
    kind: 'figure', figure: '5.9', title: 'Human respiratory system and alveoli',
    summary: 'Air travels through the nasal passage, trachea, bronchi and bronchioles to alveoli beside capillaries.',
    observation: 'Large surface area, thin moist walls and rich blood supply support rapid gas diffusion.',
    image: '/activity-illustrations/chapter-5-nutrition-respiration-v2.png',
    alt: 'Human respiratory system with nasal passage, trachea, lungs, bronchi, bronchioles, diaphragm and enlarged alveolar-capillary surface.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-5-10-heart': {
    kind: 'figure', figure: '5.10', title: 'Sectional view of the human heart',
    summary: 'Four chambers, valves and a septum maintain one-way flow without mixing oxygenated and deoxygenated blood.',
    observation: 'The right side pumps to lungs; the left side pumps to the body.',
    image: '/activity-illustrations/chapter-5-transport-v2.png',
    alt: 'Sectional heart with four chambers, septum, valves, vena cava, pulmonary vessels and aorta, with blue and red directional arrows.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-5-11-double-circulation': {
    kind: 'figure', figure: '5.11', title: 'Double circulation',
    summary: 'Pulmonary circulation links heart and lungs; systemic circulation links heart and body tissues.',
    observation: 'Blood passes through the heart twice in one complete body circuit.',
    image: '/activity-illustrations/chapter-5-transport-v2.png',
    alt: 'Two connected loops show lungs above the heart and body capillaries below, with blue and red flow directions.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-5-blood-vessels': {
    kind: 'figure', figure: '5.10-5.11 support', title: 'Arteries, veins and capillaries',
    summary: 'An artery has a thick elastic wall, a vein has a wider lumen and valves, and capillaries have one-cell-thick walls.',
    observation: 'Each vessel structure matches its pressure and exchange function.',
    image: '/activity-illustrations/chapter-5-transport-v2.png',
    alt: 'Cross-sections compare a thick-walled artery, a valve-bearing vein and a fine capillary network.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-5-8-transpiration': {
    number: '5.8', figure: '5.12', title: 'Transpiration and upward water movement',
    summary: 'Covered equal pots compare a leafy plant with a dry stick while soil evaporation is controlled.',
    observation: 'Moisture collects around the plant, and water moves upward through xylem as leaves lose vapour.',
    image: '/activity-illustrations/chapter-5-transport-v2.png',
    alt: 'Covered pots compare a leafy plant that produces moisture with a dry stick, beside a tree showing water moving upward from roots and vapour leaving leaves.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-5-13-excretory-system': {
    kind: 'figure', figure: '5.13', title: 'Human excretory system',
    summary: 'Kidneys filter blood; ureters carry urine to the bladder; the urethra releases it.',
    observation: 'Renal vessels connect each kidney to the circulation.',
    image: '/activity-illustrations/chapter-5-excretion-v2.png',
    alt: 'Two kidneys with renal blood vessels, two ureters, urinary bladder and urethra.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-5-14-nephron': {
    kind: 'figure', figure: '5.14', title: 'Structure of a nephron',
    summary: 'Blood is filtered at the glomerulus; useful solutes and water are selectively reabsorbed along the tubule.',
    observation: 'Remaining nitrogenous waste and excess water enter the collecting duct as urine.',
    image: '/activity-illustrations/chapter-5-excretion-v2.png',
    alt: 'A nephron shows Bowmans capsule, glomerulus, arterioles, convoluted tubule, surrounding capillaries and collecting duct with flow arrows.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-5-dialysis': {
    kind: 'figure', figure: 'Artificial kidney', title: 'Haemodialysis',
    summary: 'A pump moves blood through semipermeable tubing in dialysis fluid and returns cleaned blood to a vein.',
    observation: 'Nitrogenous wastes and excess salts diffuse into the dialysis fluid while blood cells and proteins remain.',
    image: '/activity-illustrations/chapter-5-excretion-v2.png',
    alt: 'A patient arm connects through a pump to a cylindrical dialyser with separate fresh and used dialysis-fluid lines before blood returns to a vein.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-5-plant-excretion': {
    kind: 'figure', figure: '5.5.2 support', title: 'Excretion in plants',
    summary: 'Plants remove gases and water by diffusion/transpiration, store wastes in leaves and woody tissues, and release some into soil.',
    observation: 'Falling leaves, resins and gums isolate wastes without a specialised excretory system.',
    image: '/activity-illustrations/chapter-5-excretion-v2.png',
    alt: 'A plant collage shows gas and water release from leaves, resin in bark, an old falling leaf and waste release near roots.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-6-1-neuron': {
    kind: 'figure', figure: '6.1(a)', title: 'Structure of a neuron',
    summary: 'Dendrites receive information, the cell body integrates it and the axon carries the electrical impulse to nerve endings.',
    observation: 'The long axon lets nervous information travel rapidly from one region to another.',
    image: '/activity-illustrations/chapter-6-nervous-system-v2.png',
    alt: 'A multipolar neuron has many branching dendrites, a nucleated cell body, a long myelinated axon and branching nerve endings.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-6-1-neuromuscular-junction': {
    kind: 'figure', figure: '6.1(b)', title: 'Neuromuscular junction',
    summary: 'A motor-neuron ending releases chemical messenger molecules across a narrow junction onto a muscle fibre.',
    observation: 'The chemical signal starts an electrical response in muscle, whose proteins rearrange so the fibre shortens.',
    image: '/activity-illustrations/chapter-6-nervous-system-v2.png',
    alt: 'A motor nerve ending releases transmitter dots across a synaptic cleft onto a striated muscle fibre containing mitochondria.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-6-2-reflex-arc': {
    kind: 'figure', figure: '6.2', title: 'Reflex arc',
    summary: 'A heat receptor sends an impulse through a sensory neuron to the spinal cord, where a relay passes it to a motor neuron.',
    observation: 'The arm muscle withdraws the hand quickly while information also continues to the brain.',
    image: '/activity-illustrations/chapter-6-nervous-system-v2.png',
    alt: 'A hand near a hot pan connects through a sensory path to a spinal cord cross-section and back through a motor path to an arm muscle, with another path continuing to the brain.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-6-3-human-brain': {
    kind: 'figure', figure: '6.3', title: 'Human brain',
    summary: 'The sagittal view separates the forebrain, midbrain and hindbrain and shows their continuation into the spinal cord.',
    observation: 'Different regions coordinate thought, voluntary action, involuntary action, precision, posture and balance.',
    image: '/activity-illustrations/chapter-6-nervous-system-v2.png',
    alt: 'A sagittal section of a human head shows the cerebrum, pituitary region, midbrain, pons, medulla, cerebellum and spinal cord inside the skull.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-6-4-sensitive-plant': {
    kind: 'figure', figure: '6.4', title: 'Immediate response of the sensitive plant',
    summary: 'The same Mimosa plant is shown before touch and immediately after its leaflets fold and droop.',
    observation: 'The fast response does not depend on growth; cells change water content and therefore change shape.',
    image: '/activity-illustrations/chapter-6-plant-coordination-v2.png',
    alt: 'A sensitive plant has open leaflets before touch and folded drooping leaflets immediately after a finger touches it.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-6-2-phototropism': {
    number: '6.2', figure: '6.5', title: 'How shoots respond to light',
    summary: 'Bean seedlings grow through wire mesh in a water-filled flask kept inside a box with one open side facing a window.',
    observation: 'Shoots bend toward light, while roots grow away from light and downward; new growth changes direction when the flask is turned.',
    image: '/activity-illustrations/chapter-6-plant-coordination-v2.png',
    alt: 'A cardboard box facing a bright window contains a water-filled flask, wire mesh and germinating bean seedlings whose shoots curve toward light.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-6-6-geotropism': {
    kind: 'figure', figure: '6.6', title: 'Plant showing geotropism',
    summary: 'A potted plant is placed horizontally so the response to gravity can be seen.',
    observation: 'Roots bend downward with gravity, while the shoot bends upward away from gravity.',
    image: '/activity-illustrations/chapter-6-plant-coordination-v2.png',
    alt: 'A flowerpot lies horizontally while roots curve downward with gravity and the green shoot curves upward away from gravity.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-6-tendril-thigmotropism': {
    kind: 'figure', figure: '6.2.2 support', title: 'Tendril response to touch',
    summary: 'A pea tendril coils around a support after contact.',
    observation: 'The touched side grows more slowly than the opposite side, so the tendril bends around the support.',
    image: '/activity-illustrations/chapter-6-plant-coordination-v2.png',
    alt: 'A pea tendril wraps around a wooden support, with a close-up showing unequal growth on its two sides.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-6-7-endocrine-glands': {
    kind: 'figure', figure: '6.7', title: 'Major endocrine glands',
    summary: 'Glands in the head, neck and abdomen secrete chemical messengers directly into blood.',
    observation: 'Hormones can reach distant targets, but only cells with appropriate receptors respond.',
    image: '/activity-illustrations/chapter-6-hormones-v2.png',
    alt: 'Two clothed human figures show highlighted pituitary, thyroid, adrenal glands and pancreas at their anatomical positions.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-6-adrenaline-response': {
    kind: 'figure', figure: '6.3 support', title: 'Adrenaline prepares the body',
    summary: 'Adrenal glands release adrenaline into blood during a frightening or stressful situation.',
    observation: 'Heart and breathing rates increase, more blood reaches skeletal muscles and less reaches skin and the digestive system.',
    image: '/activity-illustrations/chapter-6-hormones-v2.png',
    alt: 'Adrenal glands release a signal into blood, with arrows toward heart, lungs and skeletal muscle and reduced flow toward digestion and skin.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-6-insulin-feedback': {
    kind: 'figure', figure: '6.3 support', title: 'Blood-sugar feedback',
    summary: 'After a meal raises blood glucose, pancreatic cells release more insulin.',
    observation: 'Body cells take up glucose; as blood glucose falls toward normal, insulin secretion is reduced.',
    image: '/activity-illustrations/chapter-6-hormones-v2.png',
    alt: 'A meal raises glucose dots in blood, the pancreas sends a signal, cells take up glucose and the cycle returns blood toward normal.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-6-thyroid-growth': {
    kind: 'figure', figure: '6.3 support', title: 'Thyroxin and controlled growth',
    summary: 'Iodine supports thyroxin synthesis, while pituitary growth hormone coordinates normal growth.',
    observation: 'Thyroxin regulates carbohydrate, protein and fat metabolism; hormone timing and quantity are controlled.',
    image: '/activity-illustrations/chapter-6-hormones-v2.png',
    alt: 'An iodised-salt symbol points to the thyroid and metabolism icons, while a pituitary signal accompanies normal growth through childhood.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-7-1a-amoeba-fission': {
    kind: 'figure', figure: '7.1(a)', title: 'Binary fission in Amoeba',
    summary: 'The nucleus divides first, followed by division of the cytoplasm into two daughter Amoeba.',
    observation: 'Amoeba can divide in any plane because its body has no fixed long axis.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'A sequence shows an Amoeba nucleus elongating and dividing, the cell constricting and two daughter Amoeba separating.',
    columns: 3, rows: 2, column: 0, row: 0,
  },
  'figure-7-1b-leishmania-fission': {
    kind: 'figure', figure: '7.1(b)', title: 'Binary fission in Leishmania',
    summary: 'The elongated flagellated cell divides lengthwise in a definite orientation.',
    observation: 'Its fixed body design and flagellum make the plane of division orderly rather than arbitrary.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'Elongated Leishmania cells divide longitudinally in a sequence aligned with their long flagella.',
    columns: 3, rows: 2, column: 1, row: 0,
  },
  'figure-7-2-plasmodium-fission': {
    kind: 'figure', figure: '7.2', title: 'Multiple fission in Plasmodium',
    summary: 'One parent cell forms many nuclei and releases many daughter cells at the same time.',
    observation: 'Multiple fission produces more than two offspring in one division event.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'A round Plasmodium parent develops many daughter cells inside and then releases them together.',
    columns: 3, rows: 2, column: 2, row: 0,
  },
  'figure-7-3-planaria-regeneration': {
    kind: 'figure', figure: '7.3', title: 'Regeneration in Planaria',
    summary: 'Specialised cells in each cut piece proliferate and develop in an organised sequence.',
    observation: 'Each suitable piece can form a complete Planaria, but regeneration is not the normal reproductive method of most animals.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'A flatworm is divided into three pieces, and each piece develops into a complete flatworm.',
    columns: 3, rows: 2, column: 0, row: 1,
  },
  'figure-7-4-hydra-budding': {
    kind: 'figure', figure: '7.4', title: 'Budding in Hydra',
    summary: 'Repeated cell division at one site forms a bud that grows into a miniature Hydra.',
    observation: 'The mature bud detaches and becomes an independent individual.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'A sequence shows a small side bud growing on Hydra, developing tentacles and detaching.',
    columns: 3, rows: 2, column: 1, row: 1,
  },
  'figure-7-6-rhizopus-spores': {
    kind: 'figure', figure: '7.6', title: 'Spore formation in Rhizopus',
    summary: 'Sporangia on upright hyphae contain many thick-walled spores.',
    observation: 'Mature sporangia release spores, which germinate when they reach another moist surface.',
    image: '/activity-illustrations/chapter-7-asexual-reproduction-v2.png',
    alt: 'Bread-mould hyphae bear round sporangia, one of which opens and releases many spores.',
    columns: 3, rows: 2, column: 2, row: 1,
  },
  'activity-7-5-potato-buds': {
    number: '7.5', title: 'Potato eyes produce new shoots',
    summary: 'Potato pieces with a notch or eye are compared with pieces lacking a bud on moist cotton.',
    observation: 'Only pieces containing a viable bud form fresh shoots and roots.',
    image: '/activity-illustrations/chapter-7-vegetative-propagation-v2.png',
    alt: 'Potato pieces rest on moist cotton; pieces containing eyes sprout shoots and roots while pieces without eyes do not.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-7-5-bryophyllum': {
    kind: 'figure', figure: '7.5', title: 'Leaf buds of Bryophyllum',
    summary: 'Adventitious buds grow in notches along the leaf margin.',
    observation: 'When these buds fall on suitable soil, they root and develop into independent plants.',
    image: '/activity-illustrations/chapter-7-vegetative-propagation-v2.png',
    alt: 'A Bryophyllum leaf carries many small plantlets in its edge notches, with fallen plantlets rooting in soil.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-7-6-money-plant': {
    number: '7.6', title: 'A node is needed in a money-plant cutting',
    summary: 'Cuttings containing a node and leaf are compared with internode-only pieces kept in water.',
    observation: 'New roots and leaves arise from a node; a stem segment without a node does not form the same new growth.',
    image: '/activity-illustrations/chapter-7-vegetative-propagation-v2.png',
    alt: 'A leafy money-plant cutting with a node grows roots in water, while an internode-only stem piece does not.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-7-tissue-culture': {
    kind: 'figure', figure: '7.2.5 support', title: 'Tissue culture',
    summary: 'A small explant forms a callus in sterile medium, then plantlets in hormone-containing medium.',
    observation: 'Many genetically similar, disease-free plants can be raised from one parent and transferred to soil.',
    image: '/activity-illustrations/chapter-7-vegetative-propagation-v2.png',
    alt: 'A plant-tip explant forms a callus, then several plantlets in a flask, which are transferred to soil.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-7-7-flower-section': {
    kind: 'figure', figure: '7.7', title: 'Longitudinal section of a bisexual flower',
    summary: 'Stamens produce pollen; the central pistil contains stigma, style and an ovary with ovules.',
    observation: 'Petals and sepals are accessory parts; anther and ovary contain the reproductive structures.',
    image: '/activity-illustrations/chapter-7-flowering-plants-v2.png',
    alt: 'A cutaway bisexual flower shows petals, sepals, surrounding stamens and a central pistil with ovules in the ovary.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-7-8-pollen-germination': {
    kind: 'figure', figure: '7.8', title: 'Germination of pollen on stigma',
    summary: 'A compatible pollen grain forms a pollen tube that grows through the style to an ovule.',
    observation: 'Male germ cells travel through the pollen tube and one fuses with the egg cell.',
    image: '/activity-illustrations/chapter-7-flowering-plants-v2.png',
    alt: 'A sequence shows pollen landing on the stigma and a pollen tube growing through the style into an ovule.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-7-post-fertilisation': {
    kind: 'figure', figure: '7.3.2 support', title: 'Post-fertilisation changes',
    summary: 'The zygote forms an embryo, each ovule becomes a seed and the ovary ripens into a fruit.',
    observation: 'Petals, sepals, stamens, style and stigma usually shrivel and fall, though some may persist.',
    image: '/activity-illustrations/chapter-7-flowering-plants-v2.png',
    alt: 'A flower fades while its ovary enlarges into a pod-like fruit containing seeds.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-7-9-germination': {
    kind: 'figure', figure: '7.9', title: 'Bengal gram seed and germination',
    summary: 'The cotyledons store food, the plumule forms the shoot and the radicle forms the root.',
    observation: 'With suitable water, air and temperature, the embryo resumes growth to form a seedling.',
    image: '/activity-illustrations/chapter-7-flowering-plants-v2.png',
    alt: 'A split gram seed shows two cotyledons and an embryo, beside stages of radicle and plumule emergence.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-7-10-male-reproductive-system': {
    kind: 'figure', figure: '7.10', title: 'Human male reproductive system',
    summary: 'Testes make sperms; ducts and glands add fluid and deliver the sperm-containing semen through the urethra.',
    observation: 'Testes lie in the scrotum because sperm formation needs a temperature lower than normal body temperature.',
    image: '/activity-illustrations/chapter-7-human-reproduction-v2.png',
    alt: 'A clinical side-view diagram shows testis in scrotum, vas deferens, seminal vesicle, prostate, urethra, penis, bladder and ureter.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-7-11-female-reproductive-system': {
    kind: 'figure', figure: '7.11', title: 'Human female reproductive system',
    summary: 'Ovaries release eggs, oviducts carry them and the uterus supports implantation and development.',
    observation: 'Fertilisation usually occurs in an oviduct; implantation occurs in the uterine lining.',
    image: '/activity-illustrations/chapter-7-human-reproduction-v2.png',
    alt: 'A clinical frontal diagram shows two ovaries, fallopian tubes, uterus with lining, cervix and vagina.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-7-fertilisation-implantation': {
    kind: 'figure', figure: '7.3.3 support', title: 'Fertilisation to implantation',
    summary: 'A sperm fuses with an egg in the oviduct; the zygote divides repeatedly while moving toward the uterus.',
    observation: 'The resulting embryo implants in the thick, blood-rich uterine lining.',
    image: '/activity-illustrations/chapter-7-human-reproduction-v2.png',
    alt: 'A sequence in the oviduct shows fertilisation, zygote divisions and a ball of cells implanting in the uterus.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-7-placenta': {
    kind: 'figure', figure: '7.3.3 support', title: 'Placenta and exchange',
    summary: 'Embryonic villi lie next to maternal blood spaces, providing a large exchange surface.',
    observation: 'Glucose and oxygen pass to the embryo; metabolic wastes pass into the mother’s blood without direct mixing of the two circulations.',
    image: '/activity-illustrations/chapter-7-human-reproduction-v2.png',
    alt: 'A clinical placenta cross-section shows branching embryonic villi beside maternal blood spaces and a developing embryo.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-8-1-variation-generations': {
    kind: 'figure', figure: '8.1', title: 'Accumulation of variation',
    summary: 'Small differences appear in one generation, are inherited, and combine with new differences in later generations.',
    observation: 'Later descendants carry a mixture of inherited and newly created variations.',
    image: '/activity-illustrations/chapter-8-heredity-v2.png',
    alt: 'A branching family of flowering plants shows small colour and pattern variations accumulating from parent to F1 and F2 generations.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-8-1-earlobes': {
    number: '8.1', figure: '8.2', title: 'Free and attached earlobes',
    summary: 'Observe classmates and their parents and classify each visible earlobe as free or attached.',
    observation: 'Family resemblance suggests inheritance, but a small survey alone cannot establish dominance.',
    image: '/activity-illustrations/chapter-8-traits-v2.png',
    alt: 'Side views compare a free earlobe that hangs below its attachment with an attached earlobe that joins directly to the cheek.',
    columns: 2, rows: 1, column: 0, row: 0,
  },
  'figure-8-3-monohybrid-cross': {
    kind: 'figure', figure: '8.3', title: 'Mendel monohybrid cross',
    summary: 'Pure tall TT crossed with pure short tt gives all tall Tt F1; selfing F1 reveals both alleles.',
    observation: 'F2 has genotype ratio 1:2:1 and phenotype ratio 3 tall:1 short.',
    image: '/activity-illustrations/chapter-8-heredity-v2.png',
    alt: 'Tall and short pea plants, an F1 generation of tall heterozygotes, and a 2 by 2 Punnett square show the monohybrid cross.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-8-5-dihybrid-cross': {
    kind: 'figure', figure: '8.4-8.5', title: 'Dihybrid cross',
    summary: 'Round-green RRyy crossed with wrinkled-yellow rrYY gives round-yellow RrYy F1.',
    observation: 'Four F1 gamete types produce the F2 phenotypic ratio 9:3:3:1, including new combinations.',
    image: '/activity-illustrations/chapter-8-heredity-v2.png',
    alt: 'Round green and wrinkled yellow parental seeds lead to round yellow F1 and a sixteen-cell Punnett square with four F2 phenotype groups.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-8-trait-expression': {
    kind: 'figure', figure: '8.2.3 support', title: 'From gene to expressed trait',
    summary: 'A gene supplies information for a protein or enzyme that changes a cell process.',
    observation: 'Different enzyme efficiency can change growth-hormone amount and produce tall or short pea plants.',
    image: '/activity-illustrations/chapter-8-traits-v2.png',
    alt: 'A chromosome and highlighted gene lead to a protein enzyme, growth hormone, and tall or short pea plant outcomes.',
    columns: 2, rows: 1, column: 1, row: 0,
  },
  'figure-8-6-sex-determination': {
    kind: 'figure', figure: '8.6', title: 'Sex determination in humans',
    summary: 'All eggs carry X, while half the sperm carry X and half carry Y.',
    observation: 'Fertilisation gives equally likely XX female and XY male outcomes.',
    image: '/activity-illustrations/chapter-8-heredity-v2.png',
    alt: 'Mother XX forms X eggs and father XY forms X or Y sperm, producing XX female and XY male children with equal probability.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-9-10-glass-slab': {
    kind: 'figure', figure: '9.10', title: 'Refraction through a rectangular glass slab',
    summary: 'An oblique ray bends toward the normal on entering glass and away from the normal on leaving it.',
    observation: 'The equal and opposite bending at parallel faces makes the emergent ray parallel to the incident ray but laterally displaced.',
    image: '/activity-illustrations/chapter-9-optics-atlas-draft.png',
    alt: 'A rectangular glass slab has an incident ray, normals at both parallel faces, a ray bent inside the glass, and a parallel laterally displaced emergent ray.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-9-7-concave-mirror-images': {
    kind: 'figure', figure: '9.7', title: 'Concave-mirror image formation',
    summary: 'Six NCERT-aligned redraws cover every object position from infinity to between F and P.',
    observation: 'The image changes from real/inverted to virtual/erect only when the object enters the P–F region.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw of six concave-mirror image cases: infinity, beyond C, at C, between C and F, at F, and between F and P.',
    columns: 2, rows: 4, column: 0, row: 0,
  },
  'figure-9-8-convex-mirror-images': {
    kind: 'figure', figure: '9.8', title: 'Convex-mirror image formation',
    summary: 'Parallel rays and finite-distance rays form virtual images behind a convex mirror.',
    observation: 'A finite object always gives an erect diminished image between P and F.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw showing a point-sized virtual convex-mirror image at F for infinity and a diminished virtual image between P and F for a finite object.',
    columns: 2, rows: 4, column: 1, row: 0,
  },
  'figure-9-12-lens-types': {
    kind: 'figure', figure: '9.12', title: 'Converging and diverging lenses',
    summary: 'A convex lens converges parallel light; a concave lens makes parallel light diverge as if from a focus.',
    observation: 'The two lens shapes and their focal actions determine the sign of focal length and power.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw comparing a convex lens converging parallel rays and a concave lens diverging parallel rays.',
    columns: 2, rows: 4, column: 0, row: 1,
  },
  'figure-9-13-parallel-lens-rays': {
    kind: 'figure', figure: '9.13', title: 'Parallel rays through lenses',
    summary: 'A convex lens sends a parallel ray through F2; a concave lens makes it appear to diverge from F1.',
    observation: 'The backward extension for the concave lens is dashed because it is virtual.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw comparing a parallel ray through a convex lens and a ray diverging as if from the focus of a concave lens.',
    columns: 2, rows: 4, column: 1, row: 1,
  },
  'figure-9-14-9-15-focal-centre-rays': {
    kind: 'figure', figure: '9.14-9.15', title: 'Focal and optical-centre rays',
    summary: 'Focal rays emerge parallel, while rays through the optical centre pass undeviated.',
    observation: 'Together with Figure 9.13, these are the three standard ray choices.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw of focal and optical-centre rays for convex and concave lenses.',
    columns: 2, rows: 4, column: 0, row: 2,
  },
  'figure-9-16-convex-lens-images-a-d': {
    kind: 'figure', figure: '9.16(a-d)', title: 'Convex-lens real-image cases',
    summary: 'The first four NCERT-aligned redraws cover infinity, beyond 2F1, at 2F1, and between F1 and 2F1.',
    observation: 'These cases form real inverted images on the opposite side of the lens.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw of Figure 9.16 parts a to d showing four convex-lens real-image cases.',
    columns: 2, rows: 4, column: 1, row: 2,
  },
  'figure-9-16-convex-lens-images-e-f': {
    kind: 'figure', figure: '9.16(e-f)', title: 'Convex-lens focal and virtual cases',
    summary: 'The final two NCERT-aligned redraws place the object at F1 and between F1 and O.',
    observation: 'At F1 the image is at infinity; inside F1 it is virtual, erect, and enlarged.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw of Figure 9.16 parts e and f showing focal and virtual convex-lens cases.',
    columns: 2, rows: 4, column: 0, row: 3,
  },
  'figure-9-17-concave-lens-images': {
    kind: 'figure', figure: '9.17', title: 'Concave-lens image formation',
    summary: 'The NCERT-aligned redraws show images for an object at infinity and at a finite distance.',
    observation: 'Both are virtual, erect and diminished on the object side.',
    image: '/activity-illustrations/chapter-9-optics-redraw.svg',
    alt: 'Original platform redraw showing concave-lens images at F1 for infinity and between O and F1 for a finite object.',
    columns: 2, rows: 4, column: 1, row: 3,
  },
  'figure-10-1-human-eye': {
    kind: 'figure', figure: '10.1', title: 'Human eye',
    summary: 'The cornea and lens focus light on the retina; the retina converts light into signals carried by the optic nerve.',
    observation: 'The iris controls pupil size, while ciliary muscles adjust lens curvature for accommodation.',
    image: '/activity-illustrations/chapter-10-eye-colour-v2.png',
    alt: 'A clinical cross-section of the human eye uses nine numbered pins for its transparent front, focusing structures, retina, and optic nerve.',
    crop: { x: 0, y: 0, width: 46.2, height: 51.9 },
  },
  'figure-10-5-10-6-dispersion': {
    kind: 'figure', figure: '10.5-10.6', title: 'Dispersion and recombination',
    summary: 'A prism separates white light into VIBGYOR because different colours refract differently.',
    observation: 'Red deviates least, violet most; an inverted second prism recombines the spectrum into white light.',
    image: '/activity-illustrations/chapter-10-eye-colour-v2.png',
    alt: 'A triangular prism spreads white light into a red-to-violet spectrum and a second inverted prism recombines the colours into white light.',
    crop: { x: 0, y: 51.9, width: 43.4, height: 48.1 },
  },
  'figure-10-9-10-10-atmospheric-refraction': {
    kind: 'figure', figure: '10.9-10.10', title: 'Atmospheric refraction',
    summary: 'Changing air layers bend starlight and sunlight along curved paths.',
    observation: 'A star appears higher and twinkles; the Sun is visible shortly before geometric sunrise and after geometric sunset.',
    image: '/activity-illustrations/chapter-10-eye-colour-v2.png',
    alt: 'Layered air bends light from a star to an apparent higher position and bends sunlight over the horizon before sunrise and after sunset.',
    crop: { x: 43.4, y: 51.9, width: 56.6, height: 48.1 },
  },
  'figure-10-blue-sky-scattering': {
    kind: 'figure', figure: '10.6.2', title: 'Selective scattering in the atmosphere',
    summary: 'Very fine particles scatter short-wavelength blue light more strongly than long-wavelength red light.',
    observation: 'Scattered blue light reaches an observer from many directions, making the clear sky appear blue.',
    image: '/activity-illustrations/chapter-10-eye-colour-v2.png',
    alt: 'Sunlight meets a small atmospheric particle; many blue arrows scatter around it while a red arrow continues more directly toward an observer.',
    crop: { x: 43.4, y: 51.9, width: 56.6, height: 48.1 },
  },
  'figure-10-2-10-3-vision-defects': {
    kind: 'figure', figure: '10.2-10.3', title: 'Myopia and hypermetropia correction',
    summary: 'NCERT-aligned ray redraws compare defective focus positions and corrective lenses.',
    observation: 'Concave correction moves a myopic focus back to retina; convex correction moves a hypermetropic focus forward to retina.',
    image: '/activity-illustrations/chapter-10-optics-redraw.svg',
    alt: 'Original platform redraw showing myopic rays focused before the retina with concave correction and hypermetropic rays focused behind the retina with convex correction.',
    columns: 1, rows: 3, column: 0, row: 0,
  },
  'figure-10-4-prism-refraction': {
    kind: 'figure', figure: '10.4', title: 'Refraction through a triangular prism',
    summary: 'The incident, refracted and emergent rays meet two inclined faces with normals at E and F.',
    observation: 'The emergent direction is deviated from the original incident direction.',
    image: '/activity-illustrations/chapter-10-optics-redraw.svg',
    alt: 'Original platform redraw labelling incident ray PE, refracted ray EF, emergent ray FS, normals, prism angle and deviation angle.',
    columns: 1, rows: 3, column: 0, row: 1,
  },
  'figure-10-7-10-8-rainbow': {
    kind: 'figure', figure: '10.7-10.8', title: 'Rainbow and its formation',
    summary: 'A natural rainbow is accompanied by a droplet ray diagram.',
    observation: 'Sunlight is refracted and dispersed, internally reflected, and refracted again on leaving the droplet.',
    image: '/activity-illustrations/chapter-10-optics-redraw.svg',
    alt: 'Original platform redraw showing a raindrop path involving entry refraction and dispersion, internal reflection, and exit refraction toward an observer.',
    columns: 1, rows: 3, column: 0, row: 2,
  },
  'figure-11-series-parallel': {
    kind: 'figure', figure: '11.6.1-11.6.2', title: 'Series and parallel resistor combinations',
    summary: 'Series resistors share one current path; parallel resistors share the same two endpoints.',
    observation: 'Current is common in series and divides in parallel; voltage divides in series and is common in parallel.',
    image: '/activity-illustrations/chapter-11-electricity-v2.png',
    alt: 'Three labelled resistors are shown end-to-end in series and as three separate branches in parallel, with current and voltage relationships.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-11-heating-power': {
    kind: 'figure', figure: '11.7-11.8', title: 'Heating effect and electric power',
    summary: 'Electrical energy produces heat in an iron, heater, fuse wire, and lamp filament.',
    observation: 'The governing relations are V=IR, H=I²Rt, and P=VI.',
    image: '/activity-illustrations/chapter-11-electricity-v2.png',
    alt: 'An electric iron, glowing heater, melting fuse wire, and lamp filament appear above the Ohm-law, Joule-heating, and power formulae.',
    columns: 2, rows: 2, column: 1, row: 1,
  },
  'figure-11-1-basic-circuit': {
    kind: 'figure', figure: '11.1', title: 'A schematic electric circuit',
    summary: 'The NCERT-aligned redraw contains a cell, bulb, ammeter, key and connecting wires in one closed path.',
    observation: 'The ammeter is in series and current flows only when the key closes the circuit.',
    image: '/activity-illustrations/chapter-11-electricity-redraw.svg',
    alt: 'Original platform redraw of a simple series circuit containing a cell, electric bulb, ammeter and plug key.',
    columns: 2, rows: 3, column: 0, row: 0,
  },
  'figure-11-2-ohms-law-circuit': {
    kind: 'figure', figure: '11.2', title: 'Ohm-law experimental circuit',
    summary: 'A nichrome wire has an ammeter in series and a voltmeter connected across it.',
    observation: 'Changing the number of cells changes V and I while the meter arrangement stays correct.',
    image: '/activity-illustrations/chapter-11-electricity-redraw.svg',
    alt: 'Original platform redraw showing cells, key, rheostat, ammeter, nichrome wire XY and a voltmeter across the wire.',
    columns: 2, rows: 3, column: 1, row: 0,
  },
  'figure-11-3-ohms-law-graph': {
    kind: 'figure', figure: '11.3', title: 'Potential-difference versus current graph',
    summary: 'The NCERT-aligned graph plots V vertically and I horizontally for the nichrome wire.',
    observation: 'A straight line through the origin shows V/I is constant; its slope is resistance.',
    image: '/activity-illustrations/chapter-11-electricity-redraw.svg',
    alt: 'Original platform redraw of a straight potential-difference versus current graph through the origin.',
    columns: 2, rows: 3, column: 0, row: 1,
  },
  'figure-11-6-series-resistors': {
    kind: 'figure', figure: '11.6', title: 'Resistors in series',
    summary: 'Three resistors are connected end-to-end in one current path.',
    observation: 'The ammeter reads the common current and the voltmeter spans the series group.',
    image: '/activity-illustrations/chapter-11-electricity-redraw.svg',
    alt: 'Original platform redraw showing three resistors in series with a cell, key, ammeter and voltmeter.',
    columns: 2, rows: 3, column: 1, row: 1,
  },
  'figure-11-7-parallel-resistors': {
    kind: 'figure', figure: '11.7', title: 'Resistors in parallel',
    summary: 'Three resistors share the same two endpoints X and Y.',
    observation: 'Each branch has the same potential difference and total current divides among them.',
    image: '/activity-illustrations/chapter-11-electricity-redraw.svg',
    alt: 'Original platform redraw showing three resistors in parallel with a cell, key, ammeter and voltmeter.',
    columns: 2, rows: 3, column: 0, row: 2,
  },
  'figure-12-4-bar-magnet-field': {
    kind: 'figure', figure: '12.4', title: 'Magnetic field around a bar magnet',
    summary: 'Field lines form closed curves, going from N to S outside the magnet and S to N inside.',
    observation: 'The lines crowd near the poles and a compass aligns tangent to the local field.',
    image: '/activity-illustrations/chapter-12-magnetism-v2.png',
    alt: 'Closed magnetic field curves surround a north-left south-right bar magnet, with outside arrows from north to south, inside arrows from south to north, and a tangent compass.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-12-6-12-7-straight-wire': {
    kind: 'figure', figure: '12.6-12.7', title: 'Field around a straight current-carrying wire',
    summary: 'A straight wire produces concentric circular magnetic field lines.',
    observation: 'Out-of-page current gives anticlockwise field; into-page current gives clockwise field, as shown by the right-hand thumb rule.',
    image: '/activity-illustrations/chapter-12-magnetism-v2.png',
    alt: 'A vertical wire through cardboard shows anticlockwise circular field for current out of the page and clockwise field for current into the page, beside a right-hand grip.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-12-8-12-11-loop-solenoid': {
    kind: 'figure', figure: '12.8-12.11', title: 'Circular loop, solenoid and electromagnet',
    summary: 'A current loop strengthens the field at its centre; a solenoid produces a bar-magnet-like field.',
    observation: 'The solenoid field is strong and nearly uniform inside; a soft-iron core makes an electromagnet.',
    image: '/activity-illustrations/chapter-12-magnetism-v2.png',
    alt: 'A circular current loop, a long solenoid with parallel interior field lines, and a solenoid wound around a soft-iron core are compared.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-12-12-force-on-conductor': {
    kind: 'figure', figure: '12.12', title: 'Force on a current-carrying rod',
    summary: 'Aluminium rod AB is suspended between horseshoe-magnet poles in a closed circuit.',
    observation: 'The rod moves sideways; reversing current or magnetic field reverses its motion.',
    image: '/activity-illustrations/chapter-12-magnetism-redraw.svg',
    alt: 'Original platform redraw showing aluminium rod AB in a circuit between the poles of a horseshoe magnet, with field, current and force directions.',
    columns: 1, rows: 3, column: 0, row: 0,
  },
  'figure-12-13-flemings-left-hand-rule': {
    kind: 'figure', figure: '12.13', title: 'Fleming’s left-hand rule',
    summary: 'The forefinger, middle finger and thumb represent field, current and force.',
    observation: 'The three directions are mutually perpendicular.',
    image: '/activity-illustrations/chapter-12-magnetism-redraw.svg',
    alt: 'Original platform redraw showing the left thumb for motion, forefinger for magnetic field and middle finger for current.',
    columns: 1, rows: 3, column: 0, row: 1,
  },
  'figure-12-15-domestic-circuit': {
    kind: 'figure', figure: '12.15', title: 'Common domestic electric circuit',
    summary: 'The NCERT-aligned schematic connects incoming earth, live and neutral through meter, fuse, switch and parallel appliance circuits.',
    observation: 'Each appliance receives the same 220 V and has an independent switch; the earth line protects metal bodies.',
    image: '/activity-illustrations/chapter-12-magnetism-redraw.svg',
    alt: 'Original platform redraw showing earth, live and neutral wires, electricity-board fuse, electricity meter, distribution box, main switch and parallel appliances.',
    columns: 1, rows: 3, column: 0, row: 2,
  },
  'figure-13-pond-ecosystem': {
    kind: 'figure', figure: '13.1 support', title: 'Components of a pond ecosystem',
    summary: 'Living producers, consumers and decomposers interact with sunlight, water, soil and minerals.',
    observation: 'Biotic and abiotic components are interdependent; decomposers return nutrients to the environment.',
    image: '/activity-illustrations/chapter-13-environment-v2.png',
    alt: 'A pond ecosystem separates sunlight, water, soil and minerals from aquatic plants, animals, fish, bird, bacteria and fungi.',
    columns: 2, rows: 2, column: 0, row: 0,
  },
  'figure-13-food-chains-web': {
    kind: 'figure', figure: '13.1-13.3', title: 'Food chains and food web',
    summary: 'Arrows run from food to consumer, showing energy movement through linked trophic levels.',
    observation: 'Interconnected chains form a food web with multiple feeding pathways.',
    image: '/activity-illustrations/chapter-13-environment-v2.png',
    alt: 'A grassland chain and aquatic chain use arrows from producers to consumers, and lower diagrams connect them into a branching food web.',
    columns: 2, rows: 2, column: 1, row: 0,
  },
  'figure-13-energy-pyramid': {
    kind: 'figure', figure: '13.2-13.4', title: 'Trophic levels and 10% energy transfer',
    summary: 'Producers form the broad base and only about 10 percent of one level’s energy reaches the next.',
    observation: 'Energy falls from 10,000 J to 1,000 J, 100 J and 10 J; decomposers act on remains from every level.',
    image: '/activity-illustrations/chapter-13-environment-v2.png',
    alt: 'A four-level energy pyramid shows producers at 10000 joules and successive consumer levels at 1000, 100 and 10 joules.',
    columns: 2, rows: 2, column: 0, row: 1,
  },
  'figure-13-biomagnification': {
    kind: 'figure', figure: '13.1.1 support', title: 'Biological magnification',
    summary: 'A persistent pesticide enters water and becomes progressively more concentrated through plankton, fish and bird.',
    observation: 'The top consumer contains the greatest concentration.',
    image: '/activity-illustrations/chapter-13-environment-v2.png',
    alt: 'A vertical aquatic chain shows pesticide concentration increasing from water to plankton to fish to a fish-eating bird.',
    columns: 3, rows: 2, column: 0, row: 1,
  },
  'figure-13-ozone-waste': {
    kind: 'figure', figure: '13.2.1-13.2.2', title: 'Ozone protection and waste management',
    summary: 'Stratospheric ozone blocks harmful UV, while CFCs damage the shield; segregated waste needs different treatment.',
    observation: 'Organic waste can be composted, while persistent material should be reduced, reused and recycled safely.',
    image: '/activity-illustrations/chapter-13-environment-v2.png',
    alt: 'The ozone layer blocks ultraviolet rays beside a CFC-damaged region, while separate bins direct organic waste to compost and dry persistent waste to reduction, reuse and recycling.',
    columns: 3, rows: 2, column: 1, row: 1,
  },
};

const ILLUSTRATION_LABELS: Record<string, string[]> = {
  'figure-1-1-magnesium-ribbon': ['Bunsen burner', 'Magnesium ribbon', 'Tongs', 'Watch glass', 'Magnesium oxide'],
  'activity-1-2-lead-nitrate-potassium-iodide': ['Lead nitrate solution', 'Potassium iodide solution', 'Test tube', 'Lead iodide precipitate'],
  'activity-1-3-zinc-sulphuric-acid': ['Conical flask', 'Cork', 'Glass tube', 'Zinc granules', 'Dilute sulphuric acid', 'Hydrogen gas'],
  'activity-1-4-quicklime-water': ['Beaker', 'Hand checking temperature', 'Quicklime', 'Water', 'Slaked lime mixture'],
  'activity-1-5-heating-ferrous-sulphate': ['Student', 'Boiling tube', 'Ferrous sulphate crystals', 'Test-tube holder', 'Bunsen burner', 'Wafted gases'],
  'activity-1-6-heating-lead-nitrate': ['Hand', 'Tongs', 'Boiling tube', 'Lead nitrate', 'Bunsen burner', 'Nitrogen dioxide fumes'],
  'activity-1-7-electrolysis-water': ['Plastic mug', 'Acidified water', 'Graphite electrodes', 'Rubber stoppers', 'Inverted test tubes', 'Switch', '6 V battery', 'Hydrogen', 'Oxygen'],
  'activity-1-8-photochemical-decomposition': ['China dish', 'Silver chloride', 'Sunlight', 'Silver'],
  'activity-1-9-iron-copper-sulphate': ['Clean comparison nail', 'Blue copper sulphate control', 'Two immersed nails', 'Pale-green iron sulphate', 'Copper-coated nails'],
  'activity-1-10-barium-sulphate-precipitate': ['Sodium sulphate solution', 'Barium chloride solution', 'Receiving test tube', 'Barium sulphate precipitate'],
  'activity-1-11-heating-copper-powder': ['China dish', 'Copper powder', 'Copper oxide', 'Wire gauze', 'Tripod stand', 'Bunsen burner'],
  'activity-2-1-indicator-tests': ['Acid sample', 'Base sample', 'Blue and red litmus', 'Phenolphthalein', 'Methyl orange'],
  'activity-2-2-olfactory-indicators': ['Onion', 'Vanilla essence', 'Clove oil', 'Dilute acid', 'Dilute base'],
  'activity-2-3-metal-acid-hydrogen-pop': ['Test tube', 'Zinc granules', 'Dilute sulphuric acid', 'Delivery tube', 'Soap bubbles', 'Burning splint'],
  'activity-2-4-base-metal-heating': ['Test tube', 'Zinc granules', 'Sodium hydroxide', 'Bunsen burner', 'Hydrogen gas'],
  'activity-2-5-carbonate-acid-lime-water': ['Sodium carbonate', 'Dilute hydrochloric acid', 'Delivery tube', 'Carbon dioxide', 'Lime water'],
  'activity-2-6-reversible-neutralisation': ['Phenolphthalein', 'Acid', 'Base', 'Pink solution', 'Colourless solution'],
  'activity-2-7-metallic-oxide-acid': ['Beaker', 'Copper oxide', 'Dilute hydrochloric acid', 'Copper chloride solution'],
  'activity-2-8-acid-electricity-conduction': ['Dilute acid', 'Glucose or alcohol solution', 'Two iron nails', 'Rubber cork', '6 V battery', 'Switch', 'Glowing bulb', 'Unlit bulb'],
  'activity-2-9-dry-wet-hcl-litmus': ['Dry test tube', 'Sodium chloride', 'Concentrated sulphuric acid', 'Delivery tube', 'Dry blue litmus', 'Wet blue litmus'],
  'activity-2-10-dilution-and-ions': ['Water', 'Acid solution', 'Base solution', 'Dispersed ions'],
  'activity-2-11-common-substance-ph': ['Common liquid samples', 'pH paper', 'Acidic colours', 'Neutral colour', 'Basic colours'],
  'activity-2-12-soil-ph': ['Soil-water mixture', 'Filter funnel', 'Clear filtrate', 'Dropper', 'pH paper'],
  'activity-2-13-family-of-salts': ['Salt samples', 'Common cation group', 'Common anion group'],
  'activity-2-14-ph-of-salts': ['Salt solutions', 'pH paper', 'Acidic salt', 'Neutral salt', 'Basic salt'],
  'activity-2-15-water-of-crystallisation': ['Blue copper sulphate crystals', 'Heat source', 'Water droplets', 'White anhydrous copper sulphate', 'Blue hydrated copper sulphate'],
  'figure-2-8-chlor-alkali-products': ['Brine inlet', 'Positive graphite anode', 'Chlorine gas', 'Porous membrane', 'Negative steel cathode', 'Hydrogen gas', 'Sodium hydroxide outlet', 'Chlorine uses', 'Hydrogen uses', 'Sodium hydroxide uses'],
  'figure-2-10-soda-acid-fire-extinguisher': ['Outer bottle', 'Baking-soda solution', 'Inner acid bottle', 'Thread', 'Cork', 'Delivery tube', 'Candle', 'Carbon dioxide'],
  'activity-3-properties-physical-tests': ['Metal samples', 'Sandpaper', 'Fresh lustrous surfaces', 'Sodium on watch glass', 'Tongs', 'Knife', 'Hammer', 'Flattened sheet'],
  'activity-3-5-thermal-conductivity': ['Clamp stand', 'Metal wire', 'Heat near clamp', 'Wax', 'Single pin at free end'],
  'activity-3-6-electrical-conductivity': ['Battery', 'Closed switch', 'Glowing bulb', 'Terminal A', 'Metal sample', 'Terminal B', 'Continuous wire'],
  'activity-3-7-nonmetal-properties': ['Coal or graphite', 'Sulphur', 'Iodine', 'Sandpaper', 'Hammer test', 'Conductivity circuit'],
  'activity-3-8-3-9-combustion-oxides': ['Magnesium', 'Sulphur', 'Bunsen burner', 'Magnesium oxide', 'Sulphur dioxide', 'Litmus paper'],
  'activity-3-10-3-12-reactivity-sandbox': ['Metal sample', 'Water', 'Dilute acid', 'Copper sulphate solution', 'Iron nail', 'Copper deposit'],
  'activity-3-10-water-and-steam': ['Cold water', 'Hot water', 'Steam generator', 'Heated metal', 'Delivery tube', 'Hydrogen collection'],
  'activity-3-11-metals-with-acid': ['Equal dilute hydrochloric acid', 'Clean metal samples', 'Thermometers', 'Hydrogen bubbles', 'No-reaction copper'],
  'activity-3-12-metal-salt-solutions': ['Copper wire', 'Iron sulphate solution', 'Iron nail', 'Copper sulphate solution', 'Copper coating', 'Pale-green solution'],
  'activity-3-13-ionic-properties': ['Solid sodium chloride', 'Sodium chloride solution', 'Electrodes', 'Battery', 'Bulb'],
  'activity-3-14-rusting-conditions': ['Iron nails', 'Water and air', 'Boiled water', 'Oil layer', 'Anhydrous calcium chloride', 'Rust'],
  'figure-3-5-sodium-chloride-formation': ['Sodium atom', 'Transferred electron', 'Chlorine atom', 'Sodium cation', 'Chloride anion', 'Electrostatic attraction'],
  'figure-3-6-magnesium-chloride-formation': ['Magnesium atom', 'Two transferred electrons', 'Two chlorine atoms', 'Magnesium cation', 'Two chloride anions'],
  'figure-3-7-heating-salt': ['Metal spatula', 'Ionic salt sample', 'Holder', 'Laboratory burner'],
  'figure-3-8-salt-solution-conductivity': ['Battery', 'Switch', 'Glowing bulb', 'Electrodes', 'Salt solution', 'Mobile ions'],
  'figure-3-9-reactivity-and-metallurgy': ['High-reactivity band', 'Electrolysis', 'Middle-reactivity band', 'Furnace reduction', 'Low-reactivity band', 'Native metals'],
  'figure-3-10-extraction-flow': ['Mined ore', 'Enriched ore', 'Heating or reduction', 'Crude metal', 'Refined metal'],
  'figure-3-11-thermit-welding': ['Refractory crucible', 'Molten iron', 'Railway-track ends', 'Joint mould'],
  'figure-3-12-copper-refining': ['Impure copper anode', 'Pure copper cathode', 'Acidified copper sulphate', 'Copper-ion movement', 'Anode mud', 'Power source'],
  'activity-4-1-carbon-around-us': ['Metal objects', 'Glass and clay', 'Food, paper and cloth', 'Wood and fuel', 'Plastic'],
  'activity-4-2-alcohol-homologous-series': ['Methanol', 'Ethanol', 'Propanol', 'Butanol', 'Hydroxyl group'],
  'activity-4-3-4-4-combustion': ['Ethanol', 'Blue flame', 'Yellow sooty flame', 'Porcelain dish', 'Soot'],
  'activity-4-5-oxidation-ethanol': ['Warm ethanol', 'Alkaline potassium permanganate', 'Dropper', 'Test tubes', 'Ethanoic acid'],
  'activity-4-6-ethanol-sodium': ['Sodium', 'Ethanol', 'Dry test tube', 'Hydrogen gas'],
  'activity-4-7-acid-strength': ['Dilute hydrochloric acid', 'Dilute ethanoic acid', 'Blue litmus', 'Universal indicator'],
  'activity-4-8-esterification': ['Ethanol', 'Ethanoic acid', 'Concentrated sulphuric acid', 'Hot-water bath', 'Ester'],
  'activity-4-9-ethanoic-acid-carbonate': ['Ethanoic acid', 'Sodium carbonate', 'Delivery tube', 'Carbon dioxide', 'Lime water'],
  'activity-4-10-emulsion-micelles': ['Oil', 'Water', 'Soap solution', 'Emulsion', 'Test tubes'],
  'activity-4-11-soap-hard-water': ['Distilled water', 'Hard water', 'Soap solution', 'Lather', 'Scum'],
  'activity-4-12-soap-vs-detergent': ['Hard water', 'Soap solution', 'Detergent solution', 'Lather', 'Scum'],
  'figure-4-1-to-4-5-covalent-bonding': ['Hydrogen single bond', 'Oxygen double bond', 'Nitrogen triple bond', 'Methane', 'Shared electron pairs'],
  'figure-4-allotropes': ['Diamond lattice', 'Graphite layers', 'C60 fullerene'],
  'figure-4-6-to-4-7-hydrocarbons': ['Ethane', 'Ethene', 'Ethyne', 'Single bond', 'Double bond', 'Triple bond'],
  'figure-4-8-to-4-10-carbon-skeletons': ['Straight chain', 'Branched chain', 'Carbon ring', 'Cyclohexane', 'Benzene'],
  'figure-4-11-esterification': ['Reaction test tube', 'Ethanol', 'Ethanoic acid', 'Concentrated sulphuric acid', 'Hot-water bath', 'Ester'],
  'figure-4-12-micelle': ['Hydrophilic ionic head', 'Hydrophobic hydrocarbon tail', 'Grease droplet', 'Heads face water', 'Tails enter grease'],
  'figure-4-13-soap-cleansing': ['Grease on cloth', 'Soap enters grease', 'Micelle lifts dirt', 'Rinse water removes micelle'],
  'figure-5-1-leaf-cross-section': ['Waxy cuticle', 'Upper epidermis', 'Palisade cells', 'Chloroplasts', 'Spongy air spaces', 'Vascular bundle', 'Xylem', 'Phloem', 'Lower epidermis', 'Stomatal pore'],
  'activity-5-1-variegated-leaf': ['Destarched variegated leaf', 'Previously green area', 'Previously non-green area', 'Blue-black starch result', 'Pale no-starch result'],
  'figure-5-3-stomata': ['Guard cells', 'Chloroplasts', 'Open pore', 'Closed pore', 'Epidermal cells'],
  'activity-5-2-carbon-dioxide': ['Destarched plants', 'Bell jars', 'Potassium hydroxide', 'Control jar', 'Airtight bases', 'Equal light'],
  'figure-5-5-amoeba-nutrition': ['Food particle', 'Pseudopodia', 'Food vacuole', 'Digestion', 'Expelled residue'],
  'figure-5-6-alimentary-canal': ['Mouth', 'Salivary glands', 'Oesophagus', 'Stomach', 'Liver', 'Gall bladder', 'Pancreas', 'Small intestine', 'Large intestine', 'Rectum', 'Anus'],
  'activity-5-4-5-5-respiration-tests': ['Exhaled air', 'Lime water', 'Yeast', 'Sugar solution', 'Delivery tube', 'Carbon dioxide'],
  'figure-5-8-glucose-breakdown': ['Glucose', 'Pyruvate in cytoplasm', 'Ethanol + carbon dioxide + energy', 'Lactic acid + energy', 'Carbon dioxide + water + much energy', 'Mitochondrion'],
  'figure-5-9-respiratory-system': ['Nasal passage', 'Trachea', 'Cartilage rings', 'Bronchi', 'Bronchioles', 'Lungs', 'Alveoli', 'Capillaries', 'Diaphragm'],
  'figure-5-10-heart': ['Vena cava', 'Right atrium', 'Right ventricle', 'Pulmonary artery', 'Pulmonary veins', 'Left atrium', 'Left ventricle', 'Aorta', 'Valves', 'Septum'],
  'figure-5-11-double-circulation': ['Lung capillaries', 'Pulmonary loop', 'Heart', 'Systemic loop', 'Body capillaries', 'Oxygenated blood', 'Deoxygenated blood'],
  'figure-5-blood-vessels': ['Artery', 'Thick elastic wall', 'Narrow lumen', 'Vein', 'Valve', 'Wide lumen', 'One-cell-thick capillaries'],
  'activity-5-8-transpiration': ['Leafy plant', 'Dry stick control', 'Plastic covers', 'Covered soil', 'Water droplets', 'Roots', 'Xylem', 'Water vapour'],
  'figure-5-13-excretory-system': ['Kidneys', 'Renal arteries', 'Renal veins', 'Aorta', 'Vena cava', 'Ureters', 'Urinary bladder', 'Urethra'],
  'figure-5-14-nephron': ['Bowmans capsule', 'Glomerulus', 'Afferent arteriole', 'Efferent arteriole', 'Tubule', 'Capillary network', 'Collecting duct', 'Filtrate flow'],
  'figure-5-dialysis': ['Artery line', 'Blood pump', 'Semipermeable dialyser', 'Fresh dialysis fluid', 'Used dialysis fluid', 'Vein return'],
  'figure-5-plant-excretion': ['Stomatal gas release', 'Water vapour', 'Resin and gum', 'Old falling leaf', 'Root release into soil'],
  'figure-6-1-neuron': ['Dendrites', 'Cell body', 'Nucleus', 'Axon', 'Myelin sheath', 'Nerve endings', 'Impulse direction'],
  'figure-6-1-neuromuscular-junction': ['Motor-neuron ending', 'Chemical transmitter', 'Synaptic cleft', 'Muscle fibre', 'Mitochondria'],
  'figure-6-2-reflex-arc': ['Heat/pain receptor', 'Sensory neuron', 'Relay neuron', 'Spinal cord', 'Motor neuron', 'Arm-muscle effector', 'Message to brain'],
  'figure-6-3-human-brain': ['Cerebrum/forebrain', 'Hypothalamus', 'Pituitary gland', 'Midbrain', 'Pons', 'Medulla', 'Cerebellum', 'Spinal cord', 'Cranium'],
  'figure-6-4-sensitive-plant': ['Untouched open leaflets', 'Touch stimulus', 'Folded drooping leaflets', 'Water-content change'],
  'activity-6-2-phototropism': ['Cardboard box', 'Window and light', 'Conical flask', 'Water', 'Wire mesh', 'Bean seedlings', 'Shoots', 'Roots'],
  'figure-6-6-geotropism': ['Flowerpot', 'Soil', 'Roots', 'Shoot', 'Direction of gravity'],
  'figure-6-tendril-thigmotropism': ['Pea tendril', 'Support', 'Touched side', 'Opposite side', 'Unequal growth', 'Coiling'],
  'figure-6-7-endocrine-glands': ['Pituitary gland', 'Thyroid gland', 'Adrenal glands', 'Pancreas'],
  'figure-6-adrenaline-response': ['Adrenal glands', 'Bloodstream', 'Heart', 'Lungs', 'Skeletal muscles', 'Digestive system', 'Skin'],
  'figure-6-insulin-feedback': ['Meal', 'Raised blood glucose', 'Pancreas', 'Insulin', 'Body-cell glucose uptake', 'Normal range'],
  'figure-6-thyroid-growth': ['Iodised salt', 'Thyroid gland', 'Thyroxin', 'Metabolism', 'Pituitary gland', 'Growth hormone', 'Normal growth'],
  'figure-7-1a-amoeba-fission': ['Parent Amoeba', 'Nucleus', 'Dividing nucleus', 'Cytoplasmic constriction', 'Daughter Amoeba'],
  'figure-7-1b-leishmania-fission': ['Flagellum', 'Longitudinal axis', 'Dividing nucleus', 'Two daughter cells'],
  'figure-7-2-plasmodium-fission': ['Parent cell', 'Many daughter cells', 'Released cells'],
  'figure-7-3-planaria-regeneration': ['Parent Planaria', 'Cut pieces', 'Specialised cells', 'Complete regenerated individuals'],
  'figure-7-4-hydra-budding': ['Parent Hydra', 'Bud', 'Repeated cell division', 'Tentacles', 'Detached young Hydra'],
  'figure-7-6-rhizopus-spores': ['Hyphae', 'Rhizoids', 'Sporangiophore', 'Sporangium', 'Thick-walled spores'],
  'activity-7-5-potato-buds': ['Potato eye/bud', 'Piece with bud', 'Piece without bud', 'Moist cotton', 'Fresh shoot', 'Roots'],
  'figure-7-5-bryophyllum': ['Leaf margin', 'Notches', 'Adventitious buds', 'Fallen plantlet', 'Roots', 'New plant'],
  'activity-7-6-money-plant': ['Leaf', 'Node', 'Internode', 'Water', 'New roots', 'New leaf', 'No-node control'],
  'figure-7-tissue-culture': ['Explant', 'Sterile nutrient medium', 'Callus', 'Hormone medium', 'Plantlets', 'Transfer to soil'],
  'figure-7-7-flower-section': ['Sepal', 'Petal', 'Anther', 'Filament', 'Stigma', 'Style', 'Ovary', 'Ovule'],
  'figure-7-8-pollen-germination': ['Pollen grain', 'Stigma', 'Pollen tube', 'Style', 'Male germ cells', 'Ovary', 'Ovule', 'Egg cell'],
  'figure-7-post-fertilisation': ['Zygote to embryo', 'Ovule to seed', 'Ovary to fruit', 'Shrivelling floral parts'],
  'figure-7-9-germination': ['Seed coat', 'Cotyledons', 'Plumule', 'Radicle', 'Future shoot', 'Future root'],
  'figure-7-10-male-reproductive-system': ['Testis', 'Scrotum', 'Vas deferens', 'Seminal vesicle', 'Prostate gland', 'Urethra', 'Penis', 'Urinary bladder', 'Ureter'],
  'figure-7-11-female-reproductive-system': ['Ovary', 'Oviduct/Fallopian tube', 'Uterus', 'Uterine lining', 'Cervix', 'Vagina'],
  'figure-7-fertilisation-implantation': ['Sperm', 'Egg', 'Fertilisation in oviduct', 'Zygote', 'Dividing embryo', 'Implantation', 'Uterine lining'],
  'figure-7-placenta': ['Embryo', 'Placenta', 'Villi', 'Maternal blood spaces', 'Oxygen and glucose to embryo', 'Wastes to mother'],
  'figure-8-1-variation-generations': ['Parent generation', 'F1 inherited differences', 'New variations', 'F2 accumulated variations'],
  'activity-8-1-earlobes': ['Free earlobe', 'Attachment point', 'Attached earlobe', 'Class and parent observations'],
  'figure-8-3-monohybrid-cross': ['Pure tall TT', 'Pure short tt', 'All tall Tt F1', 'T and t gametes', 'TT', 'Tt', 'tt', '3:1 phenotype ratio', '1:2:1 genotype ratio'],
  'figure-8-5-dihybrid-cross': ['Round-green RRyy', 'Wrinkled-yellow rrYY', 'Round-yellow RrYy F1', 'RY gamete', 'Ry gamete', 'rY gamete', 'ry gamete', '9:3:3:1 phenotype ratio'],
  'figure-8-trait-expression': ['Chromosome', 'Gene/DNA segment', 'Protein/enzyme', 'Growth hormone', 'Tall plant', 'Short plant'],
  'figure-8-6-sex-determination': ['Mother XX', 'X-bearing eggs', 'Father XY', 'X-bearing sperm', 'Y-bearing sperm', 'XX female child', 'XY male child', '50%:50% probability'],
  'figure-9-10-glass-slab': ['Incident ray', 'Normal at first face', 'Refracted ray', 'Normal at second face', 'Emergent ray', 'Original direction', 'Lateral displacement'],
  'figure-9-7-concave-mirror-images': ['Object at infinity', 'Beyond C', 'At C', 'Between C and F', 'At F', 'Between F and P', 'Real rays', 'Virtual extensions'],
  'figure-9-8-convex-mirror-images': ['Parallel incident rays', 'Virtual focus F', 'Finite object', 'Pole P', 'Virtual erect diminished image'],
  'figure-9-12-lens-types': ['Convex/converging lens', 'Principal focus', 'Concave/diverging lens', 'Virtual focus'],
  'figure-9-13-parallel-lens-rays': ['Parallel ray', 'Convex lens', 'Second focus F2', 'Concave lens', 'First focus F1', 'Virtual backward extension'],
  'figure-9-14-9-15-focal-centre-rays': ['Focal ray', 'Parallel emergent ray', 'Optical-centre ray', 'Undeviated path', 'Convex lens', 'Concave lens'],
  'figure-9-16-convex-lens-images-a-d': ['Infinity', 'Beyond 2F1', 'At 2F1', 'Between F1 and 2F1', 'Real rays', 'Inverted image'],
  'figure-9-16-convex-lens-images-e-f': ['At F1', 'Image at infinity', 'Between O and F1', 'Virtual extensions', 'Erect enlarged image'],
  'figure-9-17-concave-lens-images': ['Object at infinity', 'Image at F1', 'Finite object', 'Image between O and F1'],
  'figure-10-1-human-eye': ['Cornea', 'Aqueous humour', 'Iris', 'Pupil', 'Eye lens', 'Ciliary muscles', 'Vitreous humour', 'Retina', 'Optic nerve'],
  'figure-10-5-10-6-dispersion': ['Incident white light', 'First prism', 'Red least deviated', 'VIBGYOR spectrum', 'Violet most deviated', 'Inverted second prism', 'Recombined white light'],
  'figure-10-9-10-10-atmospheric-refraction': ['Actual star', 'Apparent higher star', 'Changing refractive-index layers', 'Observer', 'Sun below horizon', 'Curved light path', 'Apparent Sun'],
  'figure-10-blue-sky-scattering': ['Sunlight', 'Fine air particle', 'Blue light scattered more', 'Red light scattered less', 'Observer'],
  'figure-10-2-10-3-vision-defects': ['Myopic far point', 'Focus before retina', 'Concave correction', 'Hypermetropic near point', 'Focus behind retina', 'Convex correction'],
  'figure-10-4-prism-refraction': ['Incident ray PE', 'Normal at E', 'Refracted ray EF', 'Normal at F', 'Emergent ray FS', 'Prism angle A', 'Deviation angle D'],
  'figure-10-7-10-8-rainbow': ['Sunlight', 'Refraction and dispersion', 'Internal reflection', 'Exit refraction', 'Rainbow opposite Sun'],
  'figure-11-series-parallel': ['Series path', 'Same current I', 'Voltage drops', 'R1', 'R2', 'R3', 'Parallel branches', 'Same voltage V', 'Branch currents', 'Total current'],
  'figure-11-heating-power': ['Electric iron', 'Heating element', 'Room heater', 'Fuse wire', 'Lamp filament', 'V=IR', 'H=I²Rt', 'P=VI'],
  'figure-11-1-basic-circuit': ['Cell', 'Electric bulb', 'Ammeter in series', 'Plug key', 'Connecting wire'],
  'figure-11-2-ohms-law-circuit': ['Cells', 'Plug key', 'Rheostat', 'Ammeter in series', 'Nichrome wire XY', 'Voltmeter in parallel'],
  'figure-11-3-ohms-law-graph': ['Potential difference V', 'Current I', 'Straight line through origin', 'Slope equals resistance'],
  'figure-11-6-series-resistors': ['R1', 'R2', 'R3', 'Single current path', 'Ammeter', 'Voltmeter across the group'],
  'figure-11-7-parallel-resistors': ['R1 branch', 'R2 branch', 'R3 branch', 'Common endpoints X and Y', 'Total-current ammeter', 'Common voltage'],
  'figure-12-4-bar-magnet-field': ['North pole', 'South pole', 'Outside N to S', 'Inside S to N', 'Closed field line', 'Compass tangent', 'Stronger field near poles'],
  'figure-12-6-12-7-straight-wire': ['Current out of page', 'Anticlockwise field', 'Current into page', 'Clockwise field', 'Right thumb=current', 'Curled fingers=field'],
  'figure-12-8-12-11-loop-solenoid': ['Circular current loop', 'Field strengthened at centre', 'Solenoid turns', 'Uniform parallel field inside', 'North end', 'South end', 'Soft-iron core', 'Electromagnet'],
  'figure-12-12-force-on-conductor': ['Horseshoe magnet', 'North pole', 'South pole', 'Aluminium rod AB', 'Conventional current', 'Magnetic field', 'Force/displacement'],
  'figure-12-13-flemings-left-hand-rule': ['Forefinger = magnetic field', 'Middle finger = conventional current', 'Thumb = force or motion', 'Mutually perpendicular directions'],
  'figure-12-15-domestic-circuit': ['Earth wire', 'Live wire', 'Neutral wire', 'Electricity-board fuse', 'Electricity meter', 'Distribution box', 'Main switch', 'Parallel appliances'],
  'figure-13-pond-ecosystem': ['Sunlight', 'Water', 'Soil and minerals', 'Aquatic plants/algae', 'Small aquatic animals', 'Fish', 'Bird', 'Bacteria/fungi decomposers'],
  'figure-13-food-chains-web': ['Grass producer', 'Grasshopper', 'Frog', 'Snake', 'Hawk', 'Phytoplankton', 'Zooplankton', 'Small fish', 'Large fish', 'Food-to-consumer arrows', 'Interconnected pathways'],
  'figure-13-energy-pyramid': ['Producers 10,000 J', 'Primary consumers 1,000 J', 'Secondary consumers 100 J', 'Tertiary consumers 10 J', '10% transfer', 'Decomposers at every level'],
  'figure-13-biomagnification': ['Water: lowest concentration', 'Plankton', 'Fish', 'Bird: highest concentration', 'Persistent pesticide', 'Increasing concentration'],
  'figure-13-ozone-waste': ['Sun', 'Harmful UV', 'Stratospheric ozone shield', 'CFC damage', 'Biodegradable wet waste', 'Composting', 'Non-biodegradable dry waste', 'Reduce-reuse-recycle'],
};

// Pins are percentages of the complete, uncropped source image. A pin sits on
// the named object itself; the numbered key carries the readable label.
const ILLUSTRATION_HOTSPOTS: Record<string, IllustrationHotspot[]> = {
  'figure-1-1-magnesium-ribbon': [
    { label: 'Bunsen burner', x: 30, y: 61 },
    { label: 'Magnesium ribbon', x: 52, y: 26 },
    { label: 'Tongs', x: 65, y: 10 },
    { label: 'Watch glass', x: 62, y: 82 },
    { label: 'Magnesium oxide', x: 52, y: 85 },
  ],
  'activity-1-3-zinc-sulphuric-acid': [
    { label: 'Conical flask', x: 50, y: 50 },
    { label: 'Cork', x: 50, y: 23 },
    { label: 'Glass tube', x: 50, y: 10 },
    { label: 'Zinc granules', x: 50, y: 82 },
    { label: 'Dilute sulphuric acid', x: 50, y: 68 },
    { label: 'Hydrogen gas', x: 50, y: 61 },
  ],
  'activity-1-4-quicklime-water': [
    { label: 'Beaker', x: 61, y: 43 },
    { label: 'Hand checking temperature', x: 35, y: 50 },
    { label: 'Quicklime', x: 58, y: 77 },
    { label: 'Water', x: 62, y: 55 },
    { label: 'Slaked lime mixture', x: 56, y: 70 },
  ],
  'activity-1-5-heating-ferrous-sulphate': [
    { label: 'Student', x: 20, y: 38 },
    { label: 'Boiling tube', x: 51, y: 43 },
    { label: 'Ferrous sulphate crystals', x: 44, y: 54 },
    { label: 'Test-tube holder', x: 38, y: 56 },
    { label: 'Bunsen burner', x: 43, y: 72 },
    { label: 'Wafted gases', x: 67, y: 36 },
  ],
  'activity-1-6-heating-lead-nitrate': [
    { label: 'Hand', x: 72, y: 42 },
    { label: 'Tongs', x: 55, y: 41 },
    { label: 'Boiling tube', x: 44, y: 35 },
    { label: 'Lead nitrate', x: 48, y: 51 },
    { label: 'Bunsen burner', x: 51, y: 72 },
    { label: 'Nitrogen dioxide fumes', x: 34, y: 18 },
  ],
  'activity-1-7-electrolysis-water': [
    { label: 'Plastic mug', x: 38, y: 44 },
    { label: 'Acidified water', x: 65, y: 48 },
    { label: 'Graphite electrodes', x: 52, y: 49 },
    { label: 'Rubber stoppers', x: 52, y: 61 },
    { label: 'Inverted test tubes', x: 52, y: 30 },
    { label: 'Switch', x: 43, y: 81 },
    { label: '6 V battery', x: 61, y: 81 },
    { label: 'Hydrogen', x: 45, y: 27 },
    { label: 'Oxygen', x: 56, y: 23 },
  ],
  'activity-1-8-photochemical-decomposition': [
    { label: 'China dish', x: 52, y: 70 },
    { label: 'Silver chloride', x: 44, y: 69 },
    { label: 'Sunlight', x: 61, y: 34 },
    { label: 'Silver', x: 59, y: 69 },
  ],
  'activity-1-9-iron-copper-sulphate': [
    { label: 'Clean comparison nail', x: 17, y: 55 },
    { label: 'Blue copper sulphate control', x: 66, y: 55 },
    { label: 'Two immersed nails', x: 36, y: 54 },
    { label: 'Pale-green iron sulphate', x: 79, y: 55 },
    { label: 'Copper-coated nails', x: 91, y: 55 },
  ],
  'activity-1-10-barium-sulphate-precipitate': [
    { label: 'Sodium sulphate solution', x: 31, y: 30 },
    { label: 'Barium chloride solution', x: 69, y: 30 },
    { label: 'Receiving test tube', x: 50, y: 58 },
    { label: 'Barium sulphate precipitate', x: 50, y: 75 },
  ],
  'activity-1-11-heating-copper-powder': [
    { label: 'China dish', x: 50, y: 22 },
    { label: 'Copper powder', x: 47, y: 25 },
    { label: 'Copper oxide', x: 55, y: 25 },
    { label: 'Wire gauze', x: 50, y: 37 },
    { label: 'Tripod stand', x: 50, y: 57 },
    { label: 'Bunsen burner', x: 50, y: 70 },
  ],
};

export function hasActivityIllustration(demoId: string) {
  return demoId in ILLUSTRATIONS;
}

function backgroundPosition(index = 0, count = 1) {
  return count <= 1 ? '50%' : `${(index / (count - 1)) * 100}%`;
}

export default function ActivityIllustration({ demoId }: { demoId: string }) {
  const illustration = ILLUSTRATIONS[demoId];
  const labels = ILLUSTRATION_LABELS[demoId];
  const hotspots = ILLUSTRATION_HOTSPOTS[demoId];

  if (!illustration || !labels) {
    return null;
  }

  const columns = illustration.columns ?? 1;
  const rows = illustration.rows ?? 1;
  const crop = illustration.crop;
  const imageStyle: CSSProperties = {
    backgroundImage: `url(${illustration.image})`,
    backgroundPosition: crop
      ? `${crop.width >= 100 ? 50 : (crop.x / (100 - crop.width)) * 100}% ${crop.height >= 100 ? 50 : (crop.y / (100 - crop.height)) * 100}%`
      : `${backgroundPosition(illustration.column, columns)} ${backgroundPosition(illustration.row, rows)}`,
    backgroundSize: crop
      ? `${(100 / crop.width) * 100}% ${(100 / crop.height) * 100}%`
      : columns === 1 && rows === 1
        ? 'cover'
        : `${columns * 100}% ${rows * 100}%`,
  };
  const renderedImage =
    illustration.imageHeight && illustration.imageWidth ? (
      <img
        alt={illustration.alt}
        className="activity-illustration-image activity-illustration-image-native"
        decoding="async"
        height={illustration.imageHeight}
        loading="lazy"
        src={illustration.image}
        width={illustration.imageWidth}
      />
    ) : (
      <div
        aria-label={illustration.alt}
        className="activity-illustration-image"
        role="img"
        style={imageStyle}
      />
    );

  return (
    <figure className="activity-illustration-card">
      <div className={`activity-illustration-visual${hotspots ? ' activity-illustration-visual--hotspots' : ''}`}>
        {hotspots ? (
          <>
            <div className="activity-illustration-frame">
              {renderedImage}
              <ol aria-hidden="true" className="activity-illustration-hotspots">
                {hotspots.map((hotspot, index) => (
                  <li key={hotspot.label} style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}>{index + 1}</li>
                ))}
              </ol>
            </div>
            <ol aria-label="Illustration labels" className="activity-illustration-hotspot-key">
              {hotspots.map((hotspot, index) => (
                <li key={hotspot.label}><span aria-hidden="true">{index + 1}</span>{hotspot.label}</li>
              ))}
            </ol>
          </>
        ) : (
          <>
            <div className="activity-illustration-media">{renderedImage}</div>
            <div className="activity-illustration-legend">
              <span>Figure legend</span>
              <ul aria-label="Illustration labels">
                {labels.map((label) => <li key={label}>{label}</li>)}
              </ul>
            </div>
          </>
        )}
      </div>
      <figcaption className="activity-illustration-copy">
        <p className="eyebrow">
          {illustration.kind === 'figure'
            ? `Figure ${illustration.figure} · NCERT-aligned redraw`
            : illustration.figure
              ? `NCERT Figure ${illustration.figure} · Activity ${illustration.number}`
              : `NCERT Activity ${illustration.number} illustration`}
        </p>
        <h4>{illustration.title}</h4>
        <p>{illustration.summary}</p>
        <p className="activity-illustration-observation"><strong>What to observe:</strong> {illustration.observation}</p>
      </figcaption>
    </figure>
  );
}
