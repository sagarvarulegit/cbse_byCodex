'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type AcidsBasesActivityId =
  | 'activity-2-1-phenolphthalein-neutralisation'
  | 'activity-2-2-olfactory-indicators'
  | 'activity-2-3-metal-acid-hydrogen-pop'
  | 'activity-2-4-base-metal-heating'
  | 'activity-2-5-carbonate-acid-lime-water'
  | 'activity-2-6-reversible-neutralisation'
  | 'activity-2-7-metallic-oxide-acid'
  | 'activity-2-8-acid-electricity-conduction';

type Activity = {
  id: AcidsBasesActivityId;
  number: string;
  title: string;
  tag: string;
  summary: string;
  equation: string;
  observation: string;
  kind:
    | 'indicator'
    | 'olfactory'
    | 'metal-acid'
    | 'base-metal'
    | 'carbonate'
    | 'neutralisation'
    | 'metallic-oxide'
    | 'conductivity';
};

type DemoControls = {
  reset: () => void;
  start: () => void;
};

const WIDTH = 800;
const HEIGHT = 520;

const ACTIVITIES: Record<AcidsBasesActivityId, Activity> = {
  'activity-2-1-phenolphthalein-neutralisation': {
    id: 'activity-2-1-phenolphthalein-neutralisation',
    number: '2.1',
    title: 'Phenolphthalein in base and acid',
    tag: 'Indicator / neutralisation',
    summary: 'Add phenolphthalein to NaOH, then neutralise it with HCl.',
    equation: 'NaOH(aq) + HCl(aq) -> NaCl(aq) + H2O(l)',
    observation: 'Phenolphthalein turns pink in base and becomes colourless after acid neutralises it.',
    kind: 'indicator',
  },
  'activity-2-2-olfactory-indicators': {
    id: 'activity-2-2-olfactory-indicators',
    number: '2.2',
    title: 'Onion as an olfactory indicator',
    tag: 'Olfactory indicator',
    summary: 'Compare onion smell in dilute HCl and dilute NaOH.',
    equation: 'Onion extract + NaOH -> smell fades',
    observation: 'Onion smell is retained in acid but is destroyed in basic solution.',
    kind: 'olfactory',
  },
  'activity-2-3-metal-acid-hydrogen-pop': {
    id: 'activity-2-3-metal-acid-hydrogen-pop',
    number: '2.3',
    title: 'Metal and acid hydrogen test',
    tag: 'Acid + metal',
    summary: 'Zinc reacts with dilute sulphuric acid and hydrogen gives a pop with flame.',
    equation: 'Zn(s) + H2SO4(aq) -> ZnSO4(aq) + H2(g)',
    observation: 'Hydrogen gas forms bubbles and burns with a pop sound near a flame.',
    kind: 'metal-acid',
  },
  'activity-2-4-base-metal-heating': {
    id: 'activity-2-4-base-metal-heating',
    number: '2.4',
    title: 'Base and metal on heating',
    tag: 'Base + metal',
    summary: 'Heat zinc with sodium hydroxide and observe hydrogen bubbles.',
    equation: 'Zn(s) + 2NaOH(aq) -> Na2ZnO2(aq) + H2(g)',
    observation: 'Heating zinc with NaOH evolves hydrogen and forms sodium zincate.',
    kind: 'base-metal',
  },
  'activity-2-5-carbonate-acid-lime-water': {
    id: 'activity-2-5-carbonate-acid-lime-water',
    number: '2.5',
    title: 'Carbonate and acid lime-water test',
    tag: 'Acid + carbonate',
    summary: 'Carbon dioxide from sodium carbonate and HCl turns lime water milky.',
    equation: 'Na2CO3 + 2HCl -> 2NaCl + H2O + CO2',
    observation: 'Carbon dioxide turns clear lime water milky due to calcium carbonate formation.',
    kind: 'carbonate',
  },
  'activity-2-6-reversible-neutralisation': {
    id: 'activity-2-6-reversible-neutralisation',
    number: '2.6',
    title: 'Neutralisation colour change',
    tag: 'Reversible indicator change',
    summary: 'Switch a phenolphthalein solution between acidic and basic conditions.',
    equation: 'Acid + base -> salt + water',
    observation: 'Pink phenolphthalein becomes colourless with acid and pink again with excess base.',
    kind: 'neutralisation',
  },
  'activity-2-7-metallic-oxide-acid': {
    id: 'activity-2-7-metallic-oxide-acid',
    number: '2.7',
    title: 'Metallic oxide and acid',
    tag: 'Metal oxide + acid',
    summary: 'Copper oxide dissolves in HCl to form blue-green copper chloride.',
    equation: 'CuO(s) + 2HCl(aq) -> CuCl2(aq) + H2O(l)',
    observation: 'Black copper oxide dissolves and the solution turns blue-green.',
    kind: 'metallic-oxide',
  },
  'activity-2-8-acid-electricity-conduction': {
    id: 'activity-2-8-acid-electricity-conduction',
    number: '2.8',
    title: 'Acids conduct electricity',
    tag: 'Ions in aqueous solution',
    summary: 'Close a circuit through dilute HCl and watch the bulb glow.',
    equation: 'HCl(aq) -> H+(aq) + Cl-(aq)',
    observation: 'The bulb glows because ions in acid solution carry electric current.',
    kind: 'conductivity',
  },
};

function mix(progress: number, start: number, end: number) {
  return start + (end - start) * progress;
}

function rgba(progress: number, from: [number, number, number], to: [number, number, number], alpha: number) {
  return `rgba(${Math.round(mix(progress, from[0], to[0]))}, ${Math.round(mix(progress, from[1], to[1]))}, ${Math.round(
    mix(progress, from[2], to[2]),
  )}, ${alpha})`;
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, targetX?: number, targetY?: number) {
  ctx.save();
  ctx.font = '700 13px Arial, Helvetica, sans-serif';
  const width = ctx.measureText(text).width + 18;

  if (targetX !== undefined && targetY !== undefined) {
    ctx.strokeStyle = 'rgba(191, 219, 254, 0.7)';
    ctx.beginPath();
    ctx.moveTo(x, y + 13);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.56)';
  ctx.beginPath();
  ctx.roundRect(x - width / 2, y - 12, width, 26, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
  ctx.restore();
}

function drawBeaker(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, level = 0.6) {
  const top = y - h * level;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x - w / 2 + 10, top, w - 20, y - top - 8);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y - h);
  ctx.lineTo(x - w / 2, y - 12);
  ctx.quadraticCurveTo(x - w / 2, y, x - w / 2 + 12, y);
  ctx.lineTo(x + w / 2 - 12, y);
  ctx.quadraticCurveTo(x + w / 2, y, x + w / 2, y - 12);
  ctx.lineTo(x + w / 2, y - h);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.fillRect(x - w / 2 + 15, y - h + 12, 12, h - 28);
  ctx.restore();
}

function drawTube(ctx: CanvasRenderingContext2D, x: number, y: number, fill: string) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x - 18, y - 70, 36, 90);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 84);
  ctx.lineTo(x - 18, y + 16);
  ctx.quadraticCurveTo(x, y + 32, x + 18, y + 16);
  ctx.lineTo(x + 18, y - 84);
  ctx.stroke();
  ctx.restore();
}

function drawBurner(ctx: CanvasRenderingContext2D, x: number, y: number, heat: number) {
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 13, y, 26, 82);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 48, y + 82, 96, 14);
  if (heat <= 0) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = `rgba(37, 99, 235, ${0.35 + heat * 0.35})`;
  ctx.beginPath();
  ctx.moveTo(x - 13, y);
  ctx.quadraticCurveTo(x - 3, y - 68, x + 13, y);
  ctx.fill();
  ctx.fillStyle = `rgba(252, 211, 77, ${0.25 + heat * 0.35})`;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.quadraticCurveTo(x, y - 36, x + 6, y);
  ctx.fill();
  ctx.restore();
}

function drawBubbles(ctx: CanvasRenderingContext2D, cx: number, cy: number, progress: number, count = 32) {
  ctx.strokeStyle = 'rgba(219, 234, 254, 0.82)';
  for (let i = 0; i < count; i += 1) {
    const x = cx - 45 + ((i * 23) % 90);
    const y = cy - ((i * 31 + progress * 150) % 115);
    ctx.beginPath();
    ctx.arc(x, y, 3 + (i % 4), 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawIndicator(ctx: CanvasRenderingContext2D, progress: number) {
  const basePhase = Math.min(1, progress * 2);
  const acidPhase = Math.max(0, progress * 2 - 1);
  const pink = rgba(basePhase * (1 - acidPhase), [191, 219, 254], [236, 72, 153], 0.58);
  drawBeaker(ctx, 400, 350, 140, 150, pink);
  ctx.fillStyle = acidPhase > 0 ? 'rgba(191, 219, 254, 0.75)' : 'rgba(236, 72, 153, 0.85)';
  ctx.beginPath();
  ctx.arc(400, 135 + progress * 105, 6, 0, Math.PI * 2);
  ctx.fill();
  drawLabel(ctx, 'Dilute NaOH', 250, 285, 342, 300);
  drawLabel(ctx, 'Phenolphthalein', 560, 170, 404, 185);
  drawLabel(ctx, acidPhase > 0.15 ? 'HCl neutralises base' : 'Pink in base', 560, 295, 454, 300);
}

function drawOlfactory(ctx: CanvasRenderingContext2D, progress: number) {
  drawTube(ctx, 320, 340, 'rgba(248, 250, 252, 0.18)');
  drawTube(ctx, 480, 340, 'rgba(248, 250, 252, 0.18)');
  ctx.fillStyle = `rgba(134, 239, 172, ${0.2 + progress * 0.42})`;
  for (let i = 0; i < 13; i += 1) {
    ctx.beginPath();
    ctx.arc(300 + (i % 4) * 14, 255 - progress * (45 + i * 4), 6, 0, Math.PI * 2);
    ctx.fill();
  }
  drawLabel(ctx, 'Dilute HCl', 210, 305, 302, 310);
  drawLabel(ctx, 'Dilute NaOH', 590, 305, 498, 310);
  drawLabel(ctx, 'Smell retained', 260, 210, 318, 240);
  drawLabel(ctx, 'Smell destroyed', 560, 220, 480, 280);
}

function drawMetalAcid(ctx: CanvasRenderingContext2D, progress: number) {
  drawBeaker(ctx, 315, 360, 130, 140, 'rgba(96, 165, 250, 0.28)');
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(300, 324, 34, 11, -0.2, 0, Math.PI * 2);
  ctx.fill();
  drawBubbles(ctx, 315, 325, progress);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(315, 235);
  ctx.lineTo(315, 195);
  ctx.lineTo(520, 195);
  ctx.lineTo(520, 300);
  ctx.stroke();
  drawBeaker(ctx, 520, 360, 115, 100, 'rgba(226, 232, 240, 0.18)', 0.48);
  drawBubbles(ctx, 520, 345, progress, 18);
  if (progress > 0.65) {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(251, 191, 36, ${(progress - 0.65) * 2})`;
    ctx.beginPath();
    ctx.arc(555, 240, 52, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#f8fafc';
    ctx.font = '900 30px Arial';
    ctx.fillText('POP!', 520, 228);
  }
  drawLabel(ctx, 'Zinc + dilute H2SO4', 210, 255, 292, 310);
  drawLabel(ctx, 'Soap bubbles', 635, 318, 535, 320);
  drawLabel(ctx, 'Hydrogen pop test', 620, 230, 555, 240);
}

function drawBaseMetal(ctx: CanvasRenderingContext2D, progress: number) {
  drawBurner(ctx, 400, 360, progress);
  drawTube(ctx, 400, 265, 'rgba(191, 219, 254, 0.24)');
  ctx.fillStyle = '#94a3b8';
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.arc(386 + (i % 5) * 7, 286 + (i % 3) * 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  drawBubbles(ctx, 400, 285, progress, 20);
  drawLabel(ctx, 'NaOH + zinc', 260, 250, 384, 274);
  drawLabel(ctx, 'Hydrogen gas', 540, 220, 414, 230);
  drawLabel(ctx, 'Heating required', 540, 370, 414, 358);
}

function drawCarbonate(ctx: CanvasRenderingContext2D, progress: number) {
  drawBeaker(ctx, 300, 360, 125, 130, 'rgba(226, 232, 240, 0.2)');
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(268, 330, 64, 8);
  drawBubbles(ctx, 300, 320, progress, 18);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 245);
  ctx.lineTo(300, 205);
  ctx.lineTo(505, 205);
  ctx.lineTo(505, 318);
  ctx.stroke();
  drawTube(ctx, 505, 350, `rgba(255, 255, 255, ${0.15 + progress * 0.66})`);
  drawBubbles(ctx, 505, 330, progress, 16);
  drawLabel(ctx, 'Na2CO3 + HCl', 190, 278, 282, 324);
  drawLabel(ctx, 'CO2 gas', 405, 178, 410, 205);
  drawLabel(ctx, 'Lime water turns milky', 620, 285, 520, 315);
}

function drawNeutralisation(ctx: CanvasRenderingContext2D, progress: number) {
  const wave = Math.sin(progress * Math.PI * 2);
  const pinkLevel = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2;
  drawBeaker(ctx, 400, 350, 140, 150, rgba(pinkLevel, [191, 219, 254], [236, 72, 153], 0.58));
  drawLabel(ctx, progress < 0.5 ? 'Add HCl: colourless' : 'Add NaOH: pink again', 560, 270, 454, 300);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(420 + wave * 8, 188);
  ctx.lineTo(386 - wave * 8, 326);
  ctx.stroke();
}

function drawMetallicOxide(ctx: CanvasRenderingContext2D, progress: number) {
  drawBeaker(ctx, 400, 350, 150, 145, rgba(progress, [226, 232, 240], [16, 185, 129], 0.48));
  ctx.fillStyle = `rgba(20, 20, 20, ${1 - progress})`;
  ctx.fillRect(355, 327, 90, 12);
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(440 + Math.sin(progress * 10) * 10, 185);
  ctx.lineTo(400, 328);
  ctx.stroke();
  drawLabel(ctx, 'Black CuO powder', 250, 310, 360, 328);
  drawLabel(ctx, 'Dilute HCl', 560, 225, 430, 270);
  drawLabel(ctx, 'Blue-green CuCl2', 560, 315, 446, 306);
}

function drawConductivity(ctx: CanvasRenderingContext2D, progress: number) {
  drawBeaker(ctx, 400, 360, 180, 145, 'rgba(96, 165, 250, 0.24)', 0.72);
  ctx.fillStyle = '#334155';
  ctx.fillRect(355, 250, 12, 92);
  ctx.fillRect(433, 250, 12, 92);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(361, 250);
  ctx.lineTo(361, 170);
  ctx.lineTo(386, 170);
  ctx.stroke();
  ctx.strokeStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(439, 250);
  ctx.lineTo(439, 170);
  ctx.lineTo(414, 170);
  ctx.stroke();
  ctx.strokeStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(386, 170, 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(390, 170);
  ctx.lineTo(progress > 0.2 ? 414 : 408, progress > 0.2 ? 170 : 150);
  ctx.stroke();
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(400, 126, 24, 0, Math.PI * 2);
  ctx.fill();
  if (progress > 0.2) {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(250, 204, 21, ${0.25 + progress * 0.55})`;
    ctx.beginPath();
    ctx.arc(400, 126, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  drawLabel(ctx, 'Dilute HCl', 560, 305, 454, 306);
  drawLabel(ctx, 'Graphite electrodes', 240, 260, 356, 275);
  drawLabel(ctx, 'Bulb glows', 530, 125, 423, 126);
}

function drawScene(ctx: CanvasRenderingContext2D, activity: Activity, progress: number) {
  const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, '#17243a');
  background.addColorStop(1, '#0f172a');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#203049';
  ctx.fillRect(0, 440, WIDTH, 80);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 440, WIDTH, 4);

  switch (activity.kind) {
    case 'indicator':
      drawIndicator(ctx, progress);
      break;
    case 'olfactory':
      drawOlfactory(ctx, progress);
      break;
    case 'metal-acid':
      drawMetalAcid(ctx, progress);
      break;
    case 'base-metal':
      drawBaseMetal(ctx, progress);
      break;
    case 'carbonate':
      drawCarbonate(ctx, progress);
      break;
    case 'neutralisation':
      drawNeutralisation(ctx, progress);
      break;
    case 'metallic-oxide':
      drawMetallicOxide(ctx, progress);
      break;
    case 'conductivity':
      drawConductivity(ctx, progress);
      break;
  }

  ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
  ctx.font = '16px Consolas, "Courier New", monospace';
  ctx.fillText(progress >= 1 ? 'Observation complete.' : progress > 0 ? 'Experiment in progress...' : 'Ready. Click start.', 20, 30);
}

export function hasAcidsBasesLabDemo(demoId: string): demoId is AcidsBasesActivityId {
  return Object.prototype.hasOwnProperty.call(ACTIVITIES, demoId);
}

export default function AcidsBasesLabDemo({ demoId }: { demoId: AcidsBasesActivityId }) {
  const activity = ACTIVITIES[demoId];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<DemoControls | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) return;

    const ctx = canvasContext;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let frame = 0;
    let lastTimestamp = 0;
    let currentProgress = 0;
    let isRunning = false;
    let mounted = true;

    function syncProgress(value: number) {
      currentProgress = Math.max(0, Math.min(1, value));
      if (mounted) setProgress(currentProgress);
    }

    controlsRef.current = {
      reset: () => {
        isRunning = false;
        if (mounted) setRunning(false);
        syncProgress(0);
        drawScene(ctx, activity, 0);
      },
      start: () => {
        if (currentProgress >= 1) syncProgress(0);
        isRunning = true;
        if (mounted) setRunning(true);
      },
    };

    function loop(timestamp: number) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaSeconds = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      if (isRunning) {
        syncProgress(currentProgress + deltaSeconds * 0.3);
        if (currentProgress >= 1) {
          isRunning = false;
          if (mounted) setRunning(false);
        }
      }

      drawScene(ctx, activity, currentProgress);
      frame = window.requestAnimationFrame(loop);
    }

    drawScene(ctx, activity, 0);
    frame = window.requestAnimationFrame(loop);

    return () => {
      mounted = false;
      controlsRef.current = null;
      window.cancelAnimationFrame(frame);
    };
  }, [activity]);

  const start = useCallback(() => controlsRef.current?.start(), []);
  const reset = useCallback(() => controlsRef.current?.reset(), []);
  const status = useMemo(() => {
    if (progress >= 1) return activity.observation;
    if (running) return 'Watch the colour, gas, conductivity, or precipitate clue and connect it to the equation.';
    return activity.summary;
  }, [activity.observation, activity.summary, progress, running]);

  return (
    <section className="lesson-demo-card chemical-lab-demo">
      <div className="lesson-demo-header">
        <div>
          <p className="eyebrow">Activity {activity.number}</p>
          <h4>{activity.title}</h4>
          <p>{activity.tag}</p>
        </div>
        <div className="lesson-demo-actions">
          <button className="button-link lesson-demo-button" disabled={running} onClick={start} type="button">
            Start experiment
          </button>
          <button className="ghost-link lesson-demo-button" onClick={reset} type="button">
            Reset
          </button>
        </div>
      </div>

      <pre className="formula-block chemical-lab-equation">
        <code>{activity.equation}</code>
      </pre>

      <div className="chemical-lab-canvas-frame" role="img" aria-label={`Animated Activity ${activity.number}: ${activity.title}.`}>
        <canvas ref={canvasRef} />
      </div>

      <p className="lesson-demo-caption">{status}</p>
    </section>
  );
}
