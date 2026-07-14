import type { CSSProperties } from 'react';

type Illustration = {
  number: string;
  title: string;
  summary: string;
  observation: string;
  image: string;
  alt: string;
  columns?: number;
  rows?: number;
  column?: number;
  row?: number;
};

const ILLUSTRATIONS: Record<string, Illustration> = {
  'figure-1-1-magnesium-ribbon': {
    number: '1.1',
    title: 'Burning magnesium ribbon in air',
    summary: 'A cleaned magnesium ribbon is held with tongs in a burner flame, and the white ash is collected in a watch glass.',
    observation: 'Magnesium burns with a dazzling white flame and forms white magnesium oxide.',
    image: '/activity-illustrations/activity-1-1-burning-magnesium.png',
    alt: 'Magnesium ribbon held with tongs burns with a dazzling white light above a watch glass that collects white magnesium oxide ash.',
  },
  'activity-1-2-lead-nitrate-potassium-iodide': {
    number: '1.2', title: 'Lead nitrate and potassium iodide',
    summary: 'Two colourless solutions are mixed in a test tube.', observation: 'A yellow precipitate of lead iodide forms.',
    image: '/activity-illustrations/activity-1-2-lead-iodide.png', alt: 'Two clear solutions are mixed in a test tube and form a bright yellow lead iodide precipitate.',
  },
  'activity-1-3-zinc-sulphuric-acid': {
    number: '1.3', title: 'Zinc with dilute sulphuric acid',
    summary: 'Zinc granules react with dilute sulphuric acid in a flask.', observation: 'Hydrogen bubbles form and the flask becomes warm.',
    image: '/activity-illustrations/activity-1-3-zinc-acid.png', alt: 'Zinc granules react with dilute sulphuric acid in a flask, producing bubbles while a thermometer shows warming.',
  },
  'activity-1-4-quicklime-water': {
    number: '1.4', title: 'Quicklime and water',
    summary: 'Water is added carefully to quicklime in a beaker.', observation: 'The beaker becomes hot as slaked lime forms.',
    image: '/activity-illustrations/activity-1-4-quicklime-water.png', alt: 'Water is added to quicklime in a beaker, producing heat and gentle steam as slaked lime forms.',
  },
  'activity-1-5-heating-ferrous-sulphate': {
    number: '1.5', title: 'Heating ferrous sulphate crystals',
    summary: 'Green ferrous sulphate crystals are heated in a dry boiling tube.', observation: 'The crystals turn brown and gases are released.',
    image: '/activity-illustrations/activity-1-5-ferrous-sulphate.png', alt: 'A clamped boiling tube containing green ferrous sulphate crystals is heated, showing a brown product and escaping gases.',
  },
  'activity-1-6-heating-lead-nitrate': {
    number: '1.6', title: 'Heating lead nitrate',
    summary: 'Lead nitrate is heated in a clamped boiling tube.', observation: 'Yellow lead oxide and brown nitrogen dioxide fumes form.',
    image: '/activity-illustrations/activity-1-6-lead-nitrate.png', alt: 'A clamped boiling tube of lead nitrate is heated, producing yellow lead oxide and brown nitrogen dioxide fumes.',
  },
  'activity-1-7-electrolysis-water': {
    number: '1.7', title: 'Electrolysis of water', summary: 'Electric current is passed through acidified water and the gases are collected.',
    observation: 'Hydrogen collects in about twice the volume of oxygen.', image: '/activity-illustrations/chapter-1-activities-1-7-to-1-10.png',
    alt: 'Electrolysis apparatus with two electrodes and inverted test tubes collecting twice as much hydrogen as oxygen.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-1-8-photochemical-decomposition': {
    number: '1.8', title: 'Silver chloride in sunlight', summary: 'White silver chloride is kept in sunlight.', observation: 'It turns grey because silver forms.',
    image: '/activity-illustrations/chapter-1-activities-1-7-to-1-10.png', alt: 'White silver chloride in a china dish turns grey on exposure to sunlight.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-1-9-iron-copper-sulphate': {
    number: '1.9', title: 'Iron nail in copper sulphate', summary: 'An iron nail is dipped in blue copper sulphate solution.', observation: 'Copper coats the nail and the solution becomes pale green.',
    image: '/activity-illustrations/chapter-1-activities-1-7-to-1-10.png', alt: 'An iron nail in copper sulphate solution gains a reddish-brown copper coating while the solution becomes pale green.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-1-10-barium-sulphate-precipitate': {
    number: '1.10', title: 'Formation of barium sulphate', summary: 'Sodium sulphate and barium chloride solutions are mixed.', observation: 'A white insoluble precipitate forms.',
    image: '/activity-illustrations/chapter-1-activities-1-7-to-1-10.png', alt: 'Two colourless salt solutions form a dense white precipitate when mixed in a test tube.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-1-11-heating-copper-powder': {
    number: '1.11', title: 'Heating copper powder', summary: 'Copper powder is heated in air.', observation: 'The reddish-brown copper surface becomes black copper oxide.',
    image: '/activity-illustrations/activity-1-11-heating-copper.png', alt: 'Copper powder heated in a china dish changes from reddish brown to a black copper oxide coating.',
  },
  'activity-2-1-phenolphthalein-neutralisation': {
    number: '2.1', title: 'Phenolphthalein with a base and an acid', summary: 'Phenolphthalein is added to sodium hydroxide, followed by dilute hydrochloric acid.', observation: 'The base turns pink, then becomes colourless on neutralisation.',
    image: '/activity-illustrations/chapter-2-activities-2-1-to-2-4.png', alt: 'Before-and-after test tubes show phenolphthalein turning sodium hydroxide pink and then colourless when acid is added.', columns: 2, rows: 2, column: 0, row: 0,
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
    number: '2.8', title: 'Acid solution conducts electricity', summary: 'Electrodes complete a circuit through dilute hydrochloric acid.', observation: 'The bulb glows because ions carry current through the solution.',
    image: '/activity-illustrations/chapter-2-activities-2-5-to-2-8.png', alt: 'Two electrodes dip into dilute hydrochloric acid and connect to a battery, switch and glowing bulb.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-3-properties-physical-tests': {
    number: '3.1-3.4 and 3.6', title: 'Physical properties of metals and non-metals', summary: 'Samples are compared for hardness, malleability, lustre and conductivity.', observation: 'Most metals show characteristic physical properties, while coal is brittle and does not conduct.',
    image: '/activity-illustrations/chapter-3-activities-physical-to-reactivity.png', alt: 'Metal and coal samples are compared using scratching, hammering and a simple bulb circuit.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-3-5-thermal-conductivity': {
    number: '3.5', title: 'Heat conduction through a metal rod', summary: 'Wax-fixed pins are placed along a metal rod and one end is heated.', observation: 'Pins nearest the flame fall first as heat travels along the rod.',
    image: '/activity-illustrations/chapter-3-activities-physical-to-reactivity.png', alt: 'A metal rod with wax-fixed pins is heated at one end, causing the nearest pins to fall first.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-3-8-3-9-combustion-oxides': {
    number: '3.8-3.9', title: 'Combustion and the nature of oxides', summary: 'Magnesium and sulphur are burned and their products are tested.', observation: 'Magnesium oxide is basic, while sulphur dioxide forms an acidic solution.',
    image: '/activity-illustrations/chapter-3-activities-physical-to-reactivity.png', alt: 'Side-by-side setups show magnesium and sulphur burning, with their products prepared for litmus testing.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-3-10-3-12-reactivity-sandbox': {
    number: '3.10-3.12', title: 'Reactivity with water, acids and salt solutions', summary: 'Metal reactions are compared under the same conditions.', observation: 'More reactive metals react faster and displace less reactive metals.',
    image: '/activity-illustrations/chapter-3-activities-physical-to-reactivity.png', alt: 'Three test tubes compare a metal reacting with water, dilute acid and copper sulphate solution.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-3-13-ionic-properties': {
    number: '3.13', title: 'Properties of ionic compounds', summary: 'Solid sodium chloride and its aqueous solution are tested for conductivity.', observation: 'The solid does not conduct, but the solution conducts because its ions can move.',
    image: '/activity-illustrations/chapter-3-activities-ionic-and-rusting.png', alt: 'Conductivity circuits compare solid sodium chloride with sodium chloride solution; only the solution lights the bulb.', columns: 2, rows: 1, column: 0, row: 0,
  },
  'activity-3-14-rusting-conditions': {
    number: '3.14', title: 'Conditions needed for rusting', summary: 'Iron nails are kept with air and water, without air, and without water.', observation: 'Rust forms only when both air and water are present.',
    image: '/activity-illustrations/chapter-3-activities-ionic-and-rusting.png', alt: 'Three corked test tubes compare iron nails with water and air, boiled water under oil, and dry air over calcium chloride.', columns: 2, rows: 1, column: 1, row: 0,
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
    image: '/activity-illustrations/chapter-4-activities-4-1-to-4-5.png', alt: 'Side-by-side flames show clean blue combustion and a yellow sooty flame that blackens a porcelain dish.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-4-5-oxidation-ethanol': {
    number: '4.5', title: 'Oxidation of ethanol', summary: 'Alkaline potassium permanganate is added to warm ethanol.', observation: 'Its purple colour disappears while ethanol is oxidised, then remains when the reagent is in excess.',
    image: '/activity-illustrations/chapter-4-activities-4-1-to-4-5.png', alt: 'Before-and-after test tubes show purple alkaline potassium permanganate losing colour as warm ethanol is oxidised.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-6-ethanol-sodium': {
    number: '4.6', title: 'Ethanol reacts with sodium', summary: 'A small piece of sodium is added carefully to ethanol.', observation: 'Hydrogen gas is released and sodium ethoxide forms.',
    image: '/activity-illustrations/chapter-4-activities-4-6-to-4-9.png', alt: 'A small piece of sodium reacts in a dry test tube of ethanol and releases hydrogen bubbles.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-4-7-acid-strength': {
    number: '4.7', title: 'Comparing ethanoic acid and hydrochloric acid', summary: 'Equal dilute samples are compared with litmus and universal indicator.', observation: 'Both are acidic, but hydrochloric acid shows much stronger acidity.',
    image: '/activity-illustrations/activity-4-7-acid-strength.png', alt: 'Equal dilute hydrochloric acid and ethanoic acid samples both turn blue litmus red, while universal indicator shows stronger acidity for hydrochloric acid.',
  },
  'activity-4-8-esterification': {
    number: '4.8', title: 'Esterification', summary: 'Ethanol and ethanoic acid are warmed with a few drops of concentrated sulphuric acid in a water bath.', observation: 'A pleasant fruity-smelling ester forms.',
    image: '/activity-illustrations/chapter-4-activities-4-6-to-4-9.png', alt: 'A reaction test tube containing ethanol and ethanoic acid is warmed safely inside a hot-water bath.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-4-9-ethanoic-acid-carbonate': {
    number: '4.9', title: 'Ethanoic acid with a carbonate', summary: 'Ethanoic acid reacts with a carbonate and the gas is tested with lime water.', observation: 'Carbon dioxide turns the lime water milky.',
    image: '/activity-illustrations/chapter-4-activities-4-6-to-4-9.png', alt: 'Carbon dioxide from ethanoic acid and sodium carbonate passes through a delivery tube and turns lime water milky.', columns: 2, rows: 2, column: 1, row: 1,
  },
  'activity-4-10-emulsion-micelles': {
    number: '4.10', title: 'Oil, water and soap', summary: 'Oil and water are shaken with and without soap.', observation: 'Soap keeps tiny oil droplets suspended as a cloudy emulsion.',
    image: '/activity-illustrations/chapter-4-activities-4-10-to-4-12.png', alt: 'Two shaken tubes compare separated oil and water with a cloudy, soap-stabilised emulsion.', columns: 2, rows: 2, column: 0, row: 0,
  },
  'activity-4-11-soap-hard-water': {
    number: '4.11', title: 'Soap in distilled and hard water', summary: 'Equal amounts of soap are shaken with distilled water and hard water.', observation: 'Distilled water lathers well, while hard water forms scum.',
    image: '/activity-illustrations/chapter-4-activities-4-10-to-4-12.png', alt: 'Two tubes compare abundant soap lather in distilled water with little lather and curdy scum in hard water.', columns: 2, rows: 2, column: 1, row: 0,
  },
  'activity-4-12-soap-vs-detergent': {
    number: '4.12', title: 'Soap and detergent in hard water', summary: 'Soap and detergent are shaken separately with the same hard water.', observation: 'Soap forms scum, while detergent continues to lather.',
    image: '/activity-illustrations/chapter-4-activities-4-10-to-4-12.png', alt: 'Hard-water tubes show soap producing scum and little foam while detergent produces abundant foam.', columns: 2, rows: 2, column: 0, row: 1,
  },
  'activity-6-2-phototropism': {
    number: '6.2 / Figure 6.5', title: 'How shoots respond to light', summary: 'Bean seedlings grow through wire mesh in a water-filled flask kept inside a box with a side window.', observation: 'Shoots bend toward light, while roots grow away from light and downward.',
    image: '/activity-illustrations/activity-6-2-phototropism-and-geotropism.png', alt: 'A box with a side window contains a water-filled flask, wire mesh and bean seedlings whose shoots bend toward light while roots grow downward.', columns: 2, rows: 1, column: 0, row: 0,
  },
  'figure-6-6-geotropism': {
    number: 'Figure 6.6', title: 'Plant showing geotropism', summary: 'A potted plant is placed horizontally so the response to gravity can be seen.', observation: 'Roots bend downward with gravity, while the shoot bends upward away from gravity.',
    image: '/activity-illustrations/figure-6-6-plant-geotropism.png', alt: 'A flowerpot lies horizontally while roots curve downward with gravity and the green shoot curves upward away from gravity.',
  },
};

const ILLUSTRATION_LABELS: Record<string, string[]> = {
  'figure-1-1-magnesium-ribbon': ['Bunsen burner', 'Magnesium ribbon', 'Tongs', 'Watch glass', 'Magnesium oxide'],
  'activity-1-2-lead-nitrate-potassium-iodide': ['Lead nitrate solution', 'Potassium iodide solution', 'Test tube', 'Lead iodide precipitate'],
  'activity-1-3-zinc-sulphuric-acid': ['Conical flask', 'Zinc granules', 'Dilute sulphuric acid', 'Thermometer', 'Hydrogen gas'],
  'activity-1-4-quicklime-water': ['Beaker', 'Quicklime', 'Water', 'Thermometer', 'Slaked lime'],
  'activity-1-5-heating-ferrous-sulphate': ['Boiling tube', 'Ferrous sulphate crystals', 'Clamp stand', 'Bunsen burner', 'Iron oxide'],
  'activity-1-6-heating-lead-nitrate': ['Boiling tube', 'Lead nitrate', 'Clamp stand', 'Bunsen burner', 'Lead oxide', 'Nitrogen dioxide'],
  'activity-1-7-electrolysis-water': ['Acidified water', 'Graphite electrodes', 'Inverted test tubes', '6 V battery', 'Hydrogen', 'Oxygen'],
  'activity-1-8-photochemical-decomposition': ['China dish', 'Silver chloride', 'Sunlight', 'Silver'],
  'activity-1-9-iron-copper-sulphate': ['Iron nail', 'Copper sulphate solution', 'Copper coating', 'Iron sulphate solution'],
  'activity-1-10-barium-sulphate-precipitate': ['Sodium sulphate solution', 'Barium chloride solution', 'Test tube', 'Barium sulphate precipitate'],
  'activity-1-11-heating-copper-powder': ['China dish', 'Copper powder', 'Bunsen burner', 'Copper oxide'],
  'activity-2-1-phenolphthalein-neutralisation': ['Test tube', 'Sodium hydroxide', 'Phenolphthalein', 'Dilute hydrochloric acid'],
  'activity-2-2-olfactory-indicators': ['Onion', 'Vanilla essence', 'Clove oil', 'Dilute acid', 'Dilute base'],
  'activity-2-3-metal-acid-hydrogen-pop': ['Test tube', 'Zinc granules', 'Dilute sulphuric acid', 'Delivery tube', 'Soap bubbles', 'Burning splint'],
  'activity-2-4-base-metal-heating': ['Test tube', 'Zinc granules', 'Sodium hydroxide', 'Bunsen burner', 'Hydrogen gas'],
  'activity-2-5-carbonate-acid-lime-water': ['Sodium carbonate', 'Dilute hydrochloric acid', 'Delivery tube', 'Carbon dioxide', 'Lime water'],
  'activity-2-6-reversible-neutralisation': ['Phenolphthalein', 'Acid', 'Base', 'Pink solution', 'Colourless solution'],
  'activity-2-7-metallic-oxide-acid': ['Beaker', 'Copper oxide', 'Dilute hydrochloric acid', 'Copper chloride solution'],
  'activity-2-8-acid-electricity-conduction': ['Dilute hydrochloric acid', 'Graphite electrodes', 'Battery', 'Switch', 'Glowing bulb'],
  'activity-3-properties-physical-tests': ['Iron', 'Copper', 'Aluminium', 'Magnesium', 'Coal', 'Hammer', 'Electric circuit'],
  'activity-3-5-thermal-conductivity': ['Metal rod', 'Drawing pins', 'Wax', 'Clamp stand', 'Bunsen burner'],
  'activity-3-8-3-9-combustion-oxides': ['Magnesium', 'Sulphur', 'Bunsen burner', 'Magnesium oxide', 'Sulphur dioxide', 'Litmus paper'],
  'activity-3-10-3-12-reactivity-sandbox': ['Metal sample', 'Water', 'Dilute acid', 'Copper sulphate solution', 'Iron nail', 'Copper deposit'],
  'activity-3-13-ionic-properties': ['Solid sodium chloride', 'Sodium chloride solution', 'Electrodes', 'Battery', 'Bulb'],
  'activity-3-14-rusting-conditions': ['Iron nails', 'Water and air', 'Boiled water', 'Oil layer', 'Anhydrous calcium chloride', 'Rust'],
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
  'activity-6-2-phototropism': ['Cardboard box', 'Window and light', 'Conical flask', 'Water', 'Wire mesh', 'Bean seedlings', 'Shoots', 'Roots'],
  'figure-6-6-geotropism': ['Flowerpot', 'Soil', 'Roots', 'Shoot', 'Direction of gravity'],
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

  if (!illustration || !labels) {
    return null;
  }

  const columns = illustration.columns ?? 1;
  const rows = illustration.rows ?? 1;
  const imageStyle: CSSProperties = {
    backgroundImage: `url(${illustration.image})`,
    backgroundPosition: `${backgroundPosition(illustration.column, columns)} ${backgroundPosition(illustration.row, rows)}`,
    backgroundSize: columns === 1 && rows === 1 ? 'cover' : `${columns * 100}% ${rows * 100}%`,
  };

  return (
    <figure className="activity-illustration-card">
      <div className="activity-illustration-visual">
        <div aria-label={illustration.alt} className="activity-illustration-image" role="img" style={imageStyle} />
        <ul aria-label="Illustration labels" className="activity-illustration-labels">
          {labels.map((label) => (
            <li key={label}>
              <span>{label}</span>
              <span aria-hidden="true" className="activity-illustration-label-arrow" />
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="activity-illustration-copy">
        <p className="eyebrow">NCERT Activity {illustration.number} illustration</p>
        <h4>{illustration.title}</h4>
        <p>{illustration.summary}</p>
        <p className="activity-illustration-observation"><strong>What to observe:</strong> {illustration.observation}</p>
      </figcaption>
    </figure>
  );
}
