'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type MetalsNonMetalsActivityId =
  | 'activity-3-properties-physical-tests'
  | 'activity-3-5-thermal-conductivity'
  | 'activity-3-8-3-9-combustion-oxides'
  | 'activity-3-10-3-12-reactivity-sandbox'
  | 'activity-3-13-ionic-properties'
  | 'activity-3-14-rusting-conditions';

type Activity = {
  id: MetalsNonMetalsActivityId;
  number: string;
  title: string;
  tag: string;
  summary: string;
  equation: string;
  observation: string;
  kind: 'properties' | 'thermal' | 'oxide' | 'reactivity' | 'ionic' | 'rusting';
};

type DemoControls = {
  reset: () => void;
  start: () => void;
};

const WIDTH = 800;
const HEIGHT = 520;

const ACTIVITIES: Record<MetalsNonMetalsActivityId, Activity> = {
  'activity-3-properties-physical-tests': {
    id: 'activity-3-properties-physical-tests',
    number: '3.1-3.4, 3.6',
    title: 'Physical properties of metals and non-metals',
    tag: 'Hardness / malleability / conductivity',
    summary: 'Compare metal samples with coal using cutting, hammering, and circuit clues.',
    equation: 'Metal sample + physical test -> property evidence',
    observation:
      'Metals are usually hard, malleable, lustrous, and good conductors. Coal is brittle and does not complete the circuit.',
    kind: 'properties',
  },
  'activity-3-5-thermal-conductivity': {
    id: 'activity-3-5-thermal-conductivity',
    number: '3.5',
    title: 'Thermal conductivity through a metal rod',
    tag: 'Heat transfer',
    summary: 'Heat one end of a metal rod and watch wax pins fall as heat travels along it.',
    equation: 'Heat travels faster through good thermal conductors like copper.',
    observation:
      'Wax pins near the flame fall first. This shows metals conduct heat from the hot end to the cooler end.',
    kind: 'thermal',
  },
  'activity-3-8-3-9-combustion-oxides': {
    id: 'activity-3-8-3-9-combustion-oxides',
    number: '3.8-3.9',
    title: 'Combustion and nature of oxides',
    tag: 'Metal oxides / non-metal oxides',
    summary: 'Burn magnesium and sulphur, dissolve the products, and test them with litmus.',
    equation: '2Mg + O2 -> 2MgO | S + O2 -> SO2',
    observation:
      'Magnesium oxide is basic and turns red litmus blue. Sulphur dioxide forms an acidic solution and turns blue litmus red.',
    kind: 'oxide',
  },
  'activity-3-10-3-12-reactivity-sandbox': {
    id: 'activity-3-10-3-12-reactivity-sandbox',
    number: '3.10-3.12',
    title: 'Reactivity with water, acid, and salt solution',
    tag: 'Reactivity series',
    summary: 'Compare sodium, magnesium, iron, and copper with water, dilute acid, and copper sulphate.',
    equation: 'Fe + CuSO4 -> FeSO4 + Cu',
    observation:
      'More reactive metals react faster and can displace less reactive metals from salt solutions. Copper does not displace iron.',
    kind: 'reactivity',
  },
  'activity-3-13-ionic-properties': {
    id: 'activity-3-13-ionic-properties',
    number: '3.13',
    title: 'Properties of ionic compounds',
    tag: 'Melting point / conductivity',
    summary: 'Compare solid and aqueous sodium chloride to see when ions can carry current.',
    equation: 'NaCl(aq) -> Na+(aq) + Cl-(aq)',
    observation:
      'Solid NaCl does not conduct because ions are fixed. NaCl(aq) conducts because mobile ions carry charge.',
    kind: 'ionic',
  },
  'activity-3-14-rusting-conditions': {
    id: 'activity-3-14-rusting-conditions',
    number: '3.14',
    title: 'Conditions needed for rusting',
    tag: 'Corrosion investigation',
    summary: 'Compare three test tubes to isolate the need for both air and moisture.',
    equation: 'Fe + H2O + O2 -> hydrated iron(III) oxide (rust)',
    observation:
      'Iron rusts only when both oxygen and water are present. Removing either air or moisture prevents rusting.',
    kind: 'rusting',
  },
};

function mix(progress: number, start: number, end: number) {
  return start + (end - start) * progress;
}

function clamp(progress: number) {
  return Math.max(0, Math.min(1, progress));
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, targetX?: number, targetY?: number) {
  ctx.save();
  ctx.font = '700 13px Arial, Helvetica, sans-serif';
  const width = ctx.measureText(text).width + 18;
  if (targetX !== undefined && targetY !== undefined) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
  }
  drawRoundedRect(ctx, x - width / 2, y - 14, width, 26, 7);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.45)';
  ctx.stroke();
  ctx.fillStyle = '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawBench(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#203049';
  ctx.fillRect(0, 432, WIDTH, 88);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 432, WIDTH, 4);
}

function drawBurner(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  ctx.fillStyle = '#64748b';
  drawRoundedRect(ctx, x - 36, y + 34, 72, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 12, y + 2, 24, 38);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(x - 18, y - 2, 36, 8);
  const flame = clamp(progress);
  ctx.fillStyle = `rgba(249, 115, 22, ${0.35 + flame * 0.55})`;
  ctx.beginPath();
  ctx.ellipse(x, y - 14, 20 + flame * 8, 38 + flame * 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(253, 224, 71, ${0.4 + flame * 0.5})`;
  ctx.beginPath();
  ctx.ellipse(x, y - 10, 10 + flame * 5, 24 + flame * 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBulb(ctx: CanvasRenderingContext2D, x: number, y: number, lit: boolean) {
  ctx.save();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = lit ? 'rgba(253, 224, 71, 0.9)' : 'rgba(51, 65, 85, 0.8)';
  ctx.fill();
  if (lit) {
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 22;
    ctx.fill();
  }
  ctx.restore();
}

function drawProperties(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  ctx.fillStyle = '#94a3b8';
  drawRoundedRect(ctx, 95, 135, 92, 58, 10);
  ctx.fill();
  ctx.fillStyle = '#475569';
  drawRoundedRect(ctx, 115, 250, 120 + p * 60, 28 - p * 10, 10);
  ctx.fill();
  ctx.fillStyle = '#111827';
  drawRoundedRect(ctx, 95, 342, 88, 52, 10);
  ctx.fill();
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(360, 374);
  ctx.lineTo(450, 374);
  ctx.stroke();
  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(236, 374);
  ctx.lineTo(310, 374);
  ctx.moveTo(502, 374);
  ctx.lineTo(575, 374);
  ctx.stroke();
  drawBulb(ctx, 628, 374, p > 0.55);
  ctx.fillStyle = '#cbd5e1';
  drawRoundedRect(ctx, 310, 356, 50, 34, 8);
  ctx.fill();
  drawRoundedRect(ctx, 450, 356, 52, 34, 8);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 20px Arial, Helvetica, sans-serif';
  ctx.fillText('Cu', 323, 379);
  ctx.fillText('Fe', 463, 379);
  ctx.save();
  ctx.translate(164, 117 + Math.sin(p * Math.PI) * 30);
  ctx.rotate(-0.7);
  ctx.fillStyle = '#e2e8f0';
  drawRoundedRect(ctx, -8, -72, 16, 88, 4);
  ctx.fill();
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-5, -12, 10, 48);
  ctx.restore();
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(112, 232 + p * 13, 132, 18);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 16px Arial, Helvetica, sans-serif';
  ctx.fillText('Hard metal sample resists cutting', 220, 150);
  ctx.fillText('Hammer spreads metal into a sheet', 280, 270);
  drawLabel(ctx, 'Electrical conductivity', 475, 330, 410, 362);
  drawLabel(ctx, 'Coal stays brittle', 150, 420, 135, 370);
}

function drawThermal(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBurner(ctx, 212, 360, p);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.moveTo(190, 282);
  ctx.lineTo(650, 282);
  ctx.stroke();
  const gradient = ctx.createLinearGradient(190, 282, 650, 282);
  gradient.addColorStop(0, '#f97316');
  gradient.addColorStop(clamp(p * 1.2), '#facc15');
  gradient.addColorStop(1, '#94a3b8');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.moveTo(190, 282);
  ctx.lineTo(650, 282);
  ctx.stroke();
  [330, 455, 580].forEach((x, index) => {
    const fall = p > 0.25 + index * 0.2 ? (p - (0.25 + index * 0.2)) * 180 : 0;
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(x, 262 + fall, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 3, 274 + fall, 6, 24);
  });
  drawLabel(ctx, 'Thermal conductivity', 422, 222, 405, 280);
  drawLabel(ctx, 'Wax pins fall in order', 530, 350, 455, 284);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 16px Arial, Helvetica, sans-serif';
  ctx.fillText('Heat moves from the flame end to the cooler end.', 210, 110);
}

function drawOxide(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBurner(ctx, 230, 366, p);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(120, 236);
  ctx.lineTo(332, 318);
  ctx.stroke();
  ctx.fillStyle = p > 0.45 ? '#f8fafc' : '#cbd5e1';
  ctx.beginPath();
  ctx.arc(338, 320, 17 + p * 10, 0, Math.PI * 2);
  ctx.fill();
  if (p > 0.35) {
    ctx.fillStyle = `rgba(248, 250, 252, ${p})`;
    ctx.beginPath();
    ctx.arc(340, 316, 40 * p, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(470, 235, 90, 14);
  ctx.fillStyle = p > 0.75 ? '#2563eb' : '#dc2626';
  ctx.fillRect(560, 235, 80, 14);
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(470, 278, 90, 14);
  ctx.fillStyle = p > 0.75 ? '#dc2626' : '#2563eb';
  ctx.fillRect(560, 278, 80, 14);
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(503, 355, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f97316';
  ctx.fillText('SO2', 485, 406);
  drawLabel(ctx, 'MgO turns red litmus blue', 590, 200, 602, 240);
  drawLabel(ctx, 'SO2 solution turns blue litmus red', 568, 326, 602, 286);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 16px Arial, Helvetica, sans-serif';
  ctx.fillText('Metal oxides are generally basic; non-metal oxides are often acidic.', 118, 112);
}

function drawReactivity(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.strokeRect(118, 170, 150, 210);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.fillRect(119, 265, 148, 114);
  ctx.strokeRect(328, 170, 150, 210);
  ctx.fillStyle = 'rgba(226, 232, 240, 0.25)';
  ctx.fillRect(329, 265, 148, 114);
  ctx.strokeRect(538, 170, 150, 210);
  ctx.fillStyle = p > 0.55 ? 'rgba(34, 197, 94, 0.45)' : 'rgba(14, 116, 144, 0.55)';
  ctx.fillRect(539, 265, 148, 114);
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(190 + Math.sin(p * Math.PI * 8) * 14, 285, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(382, 286, 40, 16);
  ctx.fillStyle = '#64748b';
  ctx.fillRect(586, 286, 46, 18);
  if (p > 0.25) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let index = 0; index < 18; index += 1) {
      const x = 174 + ((index * 13) % 44);
      const y = 265 - ((p * 130 + index * 17) % 120);
      ctx.beginPath();
      ctx.arc(x, y, 2 + (index % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (p > 0.55) {
    ctx.fillStyle = '#b45309';
    for (let index = 0; index < 12; index += 1) {
      ctx.beginPath();
      ctx.arc(575 + index * 7, 318 + Math.sin(index) * 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawLabel(ctx, 'Cold water: Na reacts vigorously', 205, 135, 190, 285);
  drawLabel(ctx, 'Dilute HCl releases H2', 402, 135, 404, 295);
  drawLabel(ctx, 'CuSO4 displacement', 612, 135, 610, 300);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 16px Arial, Helvetica, sans-serif';
  ctx.fillText('A more reactive metal displaces a less reactive metal from salt solution.', 116, 420);
}

function drawIonic(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBurner(ctx, 180, 360, p);
  ctx.fillStyle = '#f8fafc';
  drawRoundedRect(ctx, 112, 250, 110, 36, 8);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 17px Arial, Helvetica, sans-serif';
  ctx.fillText('NaCl(s)', 132, 274);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(405, 326);
  ctx.lineTo(482, 326);
  ctx.moveTo(552, 326);
  ctx.lineTo(635, 326);
  ctx.stroke();
  drawBulb(ctx, 518, 326, p > 0.55);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.strokeRect(405, 210, 230, 116);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.fillRect(406, 252, 228, 73);
  ctx.fillStyle = '#f8fafc';
  for (let index = 0; index < 18; index += 1) {
    const x = 422 + ((index * 29 + p * 40) % 190);
    const y = 265 + ((index * 19 + p * 24) % 46);
    ctx.fillText(index % 2 === 0 ? '+' : '-', x, y);
  }
  drawLabel(ctx, 'High melting point', 190, 205, 166, 252);
  drawLabel(ctx, 'Solid: ions fixed', 372, 365, 430, 282);
  drawLabel(ctx, 'NaCl(aq): mobile ions', 590, 185, 535, 282);
  drawLabel(ctx, 'Bulb glows', 622, 368, 520, 326);
}

function drawRusting(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  [175, 400, 625].forEach((x, index) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 42, 145);
    ctx.lineTo(x - 30, 382);
    ctx.quadraticCurveTo(x, 420, x + 30, 382);
    ctx.lineTo(x + 42, 145);
    ctx.stroke();
    if (index === 0 || index === 1) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.fillRect(x - 29, 265, 58, 108);
    }
    if (index === 1) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.fillRect(x - 29, 252, 58, 13);
    }
    if (index === 2) {
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('CaCl2', x - 24, 326);
    }
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x - 12, 205);
    ctx.lineTo(x + 18, 335);
    ctx.stroke();
    if (index === 0 && p > 0.45) {
      ctx.fillStyle = `rgba(180, 83, 9, ${p})`;
      for (let spot = 0; spot < 16; spot += 1) {
        ctx.beginPath();
        ctx.arc(x - 5 + Math.sin(spot) * 20, 240 + spot * 7, 3 + (spot % 3), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  drawLabel(ctx, 'Tube A: air + water', 175, 112, 175, 270);
  drawLabel(ctx, 'Tube B: boiled water + oil', 400, 112, 400, 260);
  drawLabel(ctx, 'Tube C: dry air only', 625, 112, 625, 310);
  drawLabel(ctx, 'Rusting needs oxygen and moisture', 400, 446, 180, 292);
}

function drawScene(ctx: CanvasRenderingContext2D, activity: Activity, progress: number) {
  const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, '#17243a');
  background.addColorStop(1, '#0f172a');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawBench(ctx);

  switch (activity.kind) {
    case 'properties':
      drawProperties(ctx, progress);
      break;
    case 'thermal':
      drawThermal(ctx, progress);
      break;
    case 'oxide':
      drawOxide(ctx, progress);
      break;
    case 'reactivity':
      drawReactivity(ctx, progress);
      break;
    case 'ionic':
      drawIonic(ctx, progress);
      break;
    case 'rusting':
      drawRusting(ctx, progress);
      break;
  }

  ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
  ctx.font = '16px Consolas, "Courier New", monospace';
  ctx.fillText(progress >= 1 ? 'Observation complete.' : progress > 0 ? 'Experiment in progress...' : 'Ready. Click start.', 20, 30);
}

export function hasMetalsNonMetalsLabDemo(demoId: string): demoId is MetalsNonMetalsActivityId {
  return Object.prototype.hasOwnProperty.call(ACTIVITIES, demoId);
}

export default function MetalsNonMetalsLabDemo({ demoId }: { demoId: MetalsNonMetalsActivityId }) {
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
      currentProgress = clamp(value);
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
        syncProgress(currentProgress + deltaSeconds * 0.28);
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
    if (running) return 'Watch the visible evidence and connect it to the property, reactivity, ions, or corrosion rule.';
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

      <div
        className="chemical-lab-canvas-frame"
        role="img"
        aria-label={`Animated Activity ${activity.number}: ${activity.title}.`}
      >
        <canvas ref={canvasRef} />
      </div>

      <p className="lesson-demo-caption">{status}</p>
    </section>
  );
}
