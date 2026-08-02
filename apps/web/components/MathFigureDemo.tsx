type MathFigureVariant =
  | 'prime-factor-tree'
  | 'polynomial-zeroes'
  | 'linear-pairs'
  | 'quadratic-models'
  | 'ap-patterns'
  | 'triangle-similarity'
  | 'coordinate-formulas'
  | 'trigonometric-ratios'
  | 'heights-distances'
  | 'circle-tangents'
  | 'sector-segment'
  | 'combined-solids'
  | 'grouped-statistics'
  | 'probability-space';

type MathFigureDefinition = {
  caption: string;
  labels: string[];
  sourceFigures: string;
  title: string;
  variant: MathFigureVariant;
};

const MATH_FIGURES: Record<string, MathFigureDefinition> = {
  'math-ch1-prime-factor-tree': {
    caption: 'A simplified factor-tree redraw showing how one composite number reaches prime leaves.',
    labels: ['Composite number at the root', 'A valid factor split', 'Further composite branches', 'Prime leaves that form the unique factorisation'],
    sourceFigures: 'Chapter 1 opening factor tree',
    title: 'Prime-factor tree',
    variant: 'prime-factor-tree',
  },
  'math-ch2-polynomial-zeroes': {
    caption: 'Representative line and parabola redraws connect x-axis contacts with the number of real zeroes.',
    labels: ['Coordinate axes', 'One x-axis crossing: one zero', 'Two crossings: two distinct zeroes', 'One touch: two equal zeroes'],
    sourceFigures: 'Figures 2.1-2.10',
    title: 'Reading polynomial zeroes from graphs',
    variant: 'polynomial-zeroes',
  },
  'math-ch3-linear-pairs': {
    caption: 'Three graph panels preserve the intersecting, parallel and coincident cases used throughout the chapter.',
    labels: ['Intersecting lines: one solution', 'Shared intersection point', 'Parallel lines: no solution', 'Coincident lines: infinitely many solutions'],
    sourceFigures: 'Figures 3.1-3.2 and Table 3.1',
    title: 'Three solution cases for a linear pair',
    variant: 'linear-pairs',
  },
  'math-ch4-quadratic-models': {
    caption: 'The rectangular hall and circular-park pole are redrawn as the two geometric models used to form and interpret quadratics.',
    labels: ['Breadth represented by one variable', 'Length represented from the same variable', 'Circular park and its diameter', 'Pole whose position creates the quadratic condition'],
    sourceFigures: 'Figures 4.1-4.2',
    title: 'Quadratic equations from geometry',
    variant: 'quadratic-models',
  },
  'math-ch5-ap-patterns': {
    caption: 'Equal growth in rows and a stacked-log model make the fixed common difference visible.',
    labels: ['First term', 'Equal increase from one stage to the next', 'Top row of the log stack', 'Successive rows change by one log'],
    sourceFigures: 'Figures 5.1-5.6',
    title: 'Arithmetic progression patterns',
    variant: 'ap-patterns',
  },
  'math-ch6-triangle-similarity': {
    caption: 'A BPT configuration and a second scaled triangle preserve parallel-line ratios and vertex correspondence.',
    labels: ['Triangle side cut at the first point', 'Line parallel to the third side', 'Matching cut on the second side', 'Corresponding side in the scaled triangle'],
    sourceFigures: 'Figures 6.9-6.12 and 6.22-6.28',
    title: 'BPT and triangle similarity',
    variant: 'triangle-similarity',
  },
  'math-ch7-coordinate-formulas': {
    caption: 'Coordinate differences form a right triangle, while a marked point divides the same segment internally.',
    labels: ['First endpoint', 'Second endpoint', 'Horizontal and vertical differences', 'Internal division point'],
    sourceFigures: 'Figures 7.1-7.11',
    title: 'Distance and internal division',
    variant: 'coordinate-formulas',
  },
  'math-ch8-trigonometric-ratios': {
    caption: 'A right triangle fixes opposite, adjacent and hypotenuse sides relative to one marked acute angle.',
    labels: ['Reference acute angle', 'Opposite side', 'Adjacent side', 'Hypotenuse'],
    sourceFigures: 'Figures 8.4-8.16 and Table 8.1',
    title: 'Sides used by trigonometric ratios',
    variant: 'trigonometric-ratios',
  },
  'math-ch9-heights-distances': {
    caption: 'The observer, horizontal eye line, tower and line of sight form the standard height-and-distance model.',
    labels: ['Observer eye level', 'Horizontal reference line', 'Line of sight and elevation angle', 'Vertical object whose height is required'],
    sourceFigures: 'Figures 9.1-9.10',
    title: 'Line of sight and angle of elevation',
    variant: 'heights-distances',
  },
  'math-ch10-circle-tangents': {
    caption: 'Two tangents from one external point meet radii at right angles and have equal lengths.',
    labels: ['Circle centre', 'First point of contact', 'External point', 'Second point of contact'],
    sourceFigures: 'Figures 10.5-10.10',
    title: 'Radius-tangent and equal-tangent theorems',
    variant: 'circle-tangents',
  },
  'math-ch11-sector-segment': {
    caption: 'The same central angle creates an arc, a sector and a chord-bounded segment.',
    labels: ['Circle centre', 'Two radii enclosing the sector', 'Included arc', 'Chord separating the segment'],
    sourceFigures: 'Figures 11.1-11.7',
    title: 'Sector, arc and segment',
    variant: 'sector-segment',
  },
  'math-ch12-combined-solids': {
    caption: 'A cone-cylinder combination shows that the joined circular face is hidden while outer curved surfaces remain exposed.',
    labels: ['Cone component', 'Hidden common circular face', 'Cylinder component', 'Exposed outer surface'],
    sourceFigures: 'Figures 12.4-12.14',
    title: 'Exposed surfaces in a combined solid',
    variant: 'combined-solids',
  },
  'math-ch13-grouped-statistics': {
    caption: 'A grouped table feeds three different centres: weighted mean, modal class and median class.',
    labels: ['Class intervals', 'Frequency column', 'Highest-frequency modal class', 'Cumulative-frequency crossing for the median class'],
    sourceFigures: 'Tables 13.1-13.17',
    title: 'Grouped-data working table',
    variant: 'grouped-statistics',
  },
  'math-ch14-probability-space': {
    caption: 'A two-dice grid preserves all 36 ordered outcomes; the highlighted diagonal represents one event.',
    labels: ['First die outcomes', 'Second die outcomes', 'One ordered outcome', 'Highlighted outcomes whose sum is seven'],
    sourceFigures: 'Figure 14.3',
    title: 'Two-dice sample space',
    variant: 'probability-space',
  },
};

export function hasMathFigureDemo(demoId: string) {
  return demoId in MATH_FIGURES;
}

export default function MathFigureDemo({ demoId }: { demoId: string }) {
  const figure = MATH_FIGURES[demoId];

  if (!figure) {
    return null;
  }

  return (
    <figure className="math-figure-card">
      <div className="math-figure-header">
        <div>
          <p className="eyebrow">NCERT-matched schematic</p>
          <h4>{figure.title}</h4>
        </div>
        <span>{figure.sourceFigures}</span>
      </div>
      <div className="math-figure-frame">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 720 320">
          {renderDiagram(figure.variant)}
        </svg>
      </div>
      <figcaption>
        <p>{figure.caption}</p>
        <ol className="math-figure-key" aria-label={`${figure.title} label key`}>
          {figure.labels.map((label, index) => (
            <li key={label}>
              <span>{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}

function Pin({ number, x, y }: { number: number; x: number; y: number }) {
  return (
    <g className="math-figure-pin" transform={`translate(${x} ${y})`}>
      <circle r="15" />
      <text dominantBaseline="central" textAnchor="middle">{number}</text>
    </g>
  );
}

function renderDiagram(variant: MathFigureVariant) {
  switch (variant) {
    case 'prime-factor-tree':
      return (
        <>
          <path className="math-figure-line" d="M360 58 250 128M360 58 470 128M250 128 180 210M250 128 300 210M470 128 420 210M470 128 540 210" />
          {[{x:360,y:48,w:112,h:48},{x:250,y:118,w:88,h:42},{x:470,y:118,w:88,h:42},{x:180,y:202,w:58,h:38},{x:300,y:202,w:58,h:38},{x:420,y:202,w:58,h:38},{x:540,y:202,w:58,h:38}].map((box, index) => <rect className={index > 2 ? 'math-figure-prime' : 'math-figure-shape'} height={box.h} key={index} rx="10" width={box.w} x={box.x-box.w/2} y={box.y-box.h/2} />)}
          <Pin number={1} x={360} y={48} /><Pin number={2} x={250} y={118} /><Pin number={3} x={470} y={118} /><Pin number={4} x={540} y={202} />
        </>
      );
    case 'polynomial-zeroes':
      return (
        <>
          {[120,360,600].map((cx) => <g key={cx}><path className="math-figure-axis" d={`M${cx-92} 176H${cx+92}M${cx} 62V264`} /></g>)}
          <path className="math-figure-curve" d="M34 230 206 86" />
          <path className="math-figure-curve" d="M278 86 Q360 275 442 86" />
          <path className="math-figure-curve" d="M518 88 Q600 176 682 88" />
          <Pin number={1} x={120} y={176} /><Pin number={2} x={145} y={176} /><Pin number={3} x={324} y={176} /><Pin number={4} x={600} y={176} />
        </>
      );
    case 'linear-pairs':
      return (
        <>
          {[120,360,600].map((cx) => <path className="math-figure-axis" d={`M${cx-95} 250H${cx+95}M${cx} 55V270`} key={cx} />)}
          <path className="math-figure-curve" d="M35 235 200 85M40 90 204 232" />
          <path className="math-figure-curve" d="M280 225 430 80M294 250 444 105" />
          <path className="math-figure-curve math-figure-double" d="M520 235 685 85" />
          <Pin number={1} x={72} y={112} /><Pin number={2} x={120} y={160} /><Pin number={3} x={390} y={145} /><Pin number={4} x={610} y={150} />
        </>
      );
    case 'quadratic-models':
      return (
        <>
          <rect className="math-figure-shape" height="150" rx="8" width="260" x="55" y="88" />
          <path className="math-figure-line" d="M55 255H315M38 88V238" />
          <circle className="math-figure-shape" cx="520" cy="164" r="100" />
          <path className="math-figure-line" d="M420 164H620M520 64V264M570 86V242" />
          <Pin number={1} x={38} y={165} /><Pin number={2} x={185} y={255} /><Pin number={3} x={520} y={164} /><Pin number={4} x={570} y={110} />
        </>
      );
    case 'ap-patterns':
      return (
        <>
          {[0,1,2,3].flatMap((stage) => Array.from({ length: stage + 2 }, (_, dot) => <circle className="math-figure-dot" cx={70+stage*95+dot*22} cy={85+stage*48} key={`${stage}-${dot}`} r="8" />))}
          {[0,1,2,3,4].map((row) => Array.from({ length: 7-row }, (_, log) => <rect className="math-figure-log" height="23" key={`${row}-${log}`} rx="10" width="54" x={430+row*27+log*54} y={230-row*34} />))}
          <Pin number={1} x={70} y={85} /><Pin number={2} x={250} y={180} /><Pin number={3} x={565} y={94} /><Pin number={4} x={455} y={230} />
        </>
      );
    case 'triangle-similarity':
      return (
        <>
          <path className="math-figure-shape math-figure-open" d="M55 250 220 48 350 250ZM118 173H286" />
          <path className="math-figure-shape math-figure-open" d="M430 250 520 110 660 250Z" />
          <path className="math-figure-parallel" d="M110 182 290 182M450 242 640 242" />
          <Pin number={1} x={110} y={182} /><Pin number={2} x={200} y={173} /><Pin number={3} x={290} y={182} /><Pin number={4} x={570} y={250} />
        </>
      );
    case 'coordinate-formulas':
      return (
        <>
          <path className="math-figure-axis" d="M70 260H670M100 286V40" />
          <path className="math-figure-guide" d="M190 225H560V85" />
          <path className="math-figure-curve" d="M190 225 560 85" />
          <circle className="math-figure-dot" cx="190" cy="225" r="9" /><circle className="math-figure-dot" cx="560" cy="85" r="9" /><circle className="math-figure-prime" cx="436" cy="132" r="10" />
          <Pin number={1} x={190} y={225} /><Pin number={2} x={560} y={85} /><Pin number={3} x={560} y={225} /><Pin number={4} x={436} y={132} />
        </>
      );
    case 'trigonometric-ratios':
      return (
        <>
          <path className="math-figure-shape math-figure-open" d="M120 250H610L120 60Z" />
          <path className="math-figure-angle" d="M170 250A50 50 0 0 0 155 216" />
          <path className="math-figure-right-angle" d="M120 220H150V250" />
          <Pin number={1} x={170} y={232} /><Pin number={2} x={120} y={135} /><Pin number={3} x={365} y={250} /><Pin number={4} x={380} y={155} />
        </>
      );
    case 'heights-distances':
      return (
        <>
          <path className="math-figure-ground" d="M45 260H680" />
          <path className="math-figure-line" d="M580 260V55M145 205H580M145 205 580 55" />
          <circle className="math-figure-shape" cx="145" cy="178" r="18" /><path className="math-figure-line" d="M145 196V250M145 218 116 238M145 218 174 238" />
          <path className="math-figure-angle" d="M205 205A60 60 0 0 0 198 185" />
          <Pin number={1} x={145} y={178} /><Pin number={2} x={260} y={205} /><Pin number={3} x={330} y={141} /><Pin number={4} x={580} y={95} />
        </>
      );
    case 'circle-tangents':
      return (
        <>
          <circle className="math-figure-shape" cx="310" cy="160" r="112" />
          <path className="math-figure-line" d="M310 160 390 82M310 160 390 238M390 82 620 160 390 238" />
          <path className="math-figure-right-angle" d="M374 97 390 113 405 98M374 223 390 207 405 222" />
          <Pin number={1} x={310} y={160} /><Pin number={2} x={390} y={82} /><Pin number={3} x={620} y={160} /><Pin number={4} x={390} y={238} />
        </>
      );
    case 'sector-segment':
      return (
        <>
          <circle className="math-figure-shape" cx="360" cy="160" r="125" />
          <path className="math-figure-sector" d="M360 160 470 101A125 125 0 0 1 456 240Z" />
          <path className="math-figure-line" d="M360 160 470 101M360 160 456 240M470 101 456 240" />
          <Pin number={1} x={360} y={160} /><Pin number={2} x={425} y={125} /><Pin number={3} x={487} y={170} /><Pin number={4} x={463} y={170} />
        </>
      );
    case 'combined-solids':
      return (
        <>
          <ellipse className="math-figure-shape" cx="360" cy="220" rx="145" ry="45" />
          <path className="math-figure-shape math-figure-open" d="M215 220V118M505 220V118M215 118A145 45 0 0 0 505 118M215 220A145 45 0 0 0 505 220" />
          <path className="math-figure-shape math-figure-open" d="M215 118 360 30 505 118" />
          <ellipse className="math-figure-hidden" cx="360" cy="118" rx="145" ry="45" />
          <Pin number={1} x={360} y={52} /><Pin number={2} x={360} y={118} /><Pin number={3} x={360} y={220} /><Pin number={4} x={500} y={180} />
        </>
      );
    case 'grouped-statistics':
      return (
        <>
          <rect className="math-figure-shape" height="220" rx="8" width="520" x="100" y="50" />
          <path className="math-figure-line" d="M100 100H620M100 150H620M100 200H620M260 50V270M420 50V270" />
          <rect className="math-figure-highlight" height="50" width="160" x="260" y="150" />
          <rect className="math-figure-prime" height="50" width="200" x="420" y="200" />
          <Pin number={1} x={180} y={76} /><Pin number={2} x={340} y={76} /><Pin number={3} x={340} y={176} /><Pin number={4} x={520} y={226} />
        </>
      );
    case 'probability-space':
      return (
        <>
          <rect className="math-figure-shape" height="228" rx="8" width="456" x="150" y="46" />
          {Array.from({ length: 5 }, (_, index) => <path className="math-figure-line" d={`M${226+index*76} 46V274M150 ${84+index*38}H606`} key={`grid-${index}`} />)}
          {Array.from({ length: 6 }, (_, index) => <rect className="math-figure-highlight" height="38" key={`event-${index}`} width="76" x={150+index*76} y={236-index*38} />)}
          <circle className="math-figure-dot" cx="340" cy="179" r="8" />
          <Pin number={1} x={110} y={80} /><Pin number={2} x={188} y={300} /><Pin number={3} x={340} y={179} /><Pin number={4} x={530} y={65} />
        </>
      );
  }
}
