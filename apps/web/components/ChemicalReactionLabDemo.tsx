'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type LabActivityId =
  | 'activity-1-2-lead-nitrate-potassium-iodide'
  | 'activity-1-3-zinc-sulphuric-acid'
  | 'activity-1-4-quicklime-water'
  | 'activity-1-5-heating-ferrous-sulphate'
  | 'activity-1-6-heating-lead-nitrate'
  | 'activity-1-7-electrolysis-water'
  | 'activity-1-8-photochemical-decomposition'
  | 'activity-1-9-iron-copper-sulphate'
  | 'activity-1-10-barium-sulphate-precipitate'
  | 'activity-1-11-heating-copper-powder';

type LabActivity = {
  id: LabActivityId;
  number: string;
  title: string;
  tag: string;
  summary: string;
  equation: string;
  observation: string;
  kind:
    | 'yellow-precipitate'
    | 'hydrogen-bubbles'
    | 'quicklime-steam'
    | 'ferrous-sulphate-heat'
    | 'lead-nitrate-heat'
    | 'water-electrolysis'
    | 'silver-chloride-light'
    | 'iron-copper-sulphate'
    | 'white-precipitate'
    | 'copper-oxidation';
};

type DemoControls = {
  reset: () => void;
  start: () => void;
};

const WIDTH = 800;
const HEIGHT = 520;

const LAB_ACTIVITIES: Record<LabActivityId, LabActivity> = {
  'activity-1-2-lead-nitrate-potassium-iodide': {
    id: 'activity-1-2-lead-nitrate-potassium-iodide',
    number: '1.2',
    title: 'Lead nitrate and potassium iodide',
    tag: 'Double displacement / precipitation',
    summary: 'Mix the two solutions and watch lead iodide appear as a yellow precipitate.',
    equation: 'Pb(NO3)2(aq) + 2KI(aq) -> PbI2(s) + 2KNO3(aq)',
    observation: 'A striking yellow precipitate of lead iodide forms instantly.',
    kind: 'yellow-precipitate',
  },
  'activity-1-3-zinc-sulphuric-acid': {
    id: 'activity-1-3-zinc-sulphuric-acid',
    number: '1.3',
    title: 'Zinc with dilute sulphuric acid',
    tag: 'Displacement / exothermic',
    summary: 'Add zinc granules to dilute sulphuric acid and observe hydrogen gas bubbles.',
    equation: 'Zn(s) + H2SO4(aq) -> ZnSO4(aq) + H2(g)',
    observation: 'Hydrogen gas bubbles evolve rapidly and the flask becomes warm.',
    kind: 'hydrogen-bubbles',
  },
  'activity-1-4-quicklime-water': {
    id: 'activity-1-4-quicklime-water',
    number: '1.4',
    title: 'Quicklime and water',
    tag: 'Combination / exothermic',
    summary: 'Add water to quicklime to form slaked lime with a strong heat release.',
    equation: 'CaO(s) + H2O(l) -> Ca(OH)2(aq) + heat',
    observation: 'The beaker becomes hot and steam rises as slaked lime forms.',
    kind: 'quicklime-steam',
  },
  'activity-1-5-heating-ferrous-sulphate': {
    id: 'activity-1-5-heating-ferrous-sulphate',
    number: '1.5',
    title: 'Heating ferrous sulphate',
    tag: 'Thermal decomposition',
    summary: 'Heat green ferrous sulphate crystals and observe the colour change and fumes.',
    equation: '2FeSO4(s) -> Fe2O3(s) + SO2(g) + SO3(g)',
    observation: 'Green crystals turn brown and sulphur-smelling fumes are produced.',
    kind: 'ferrous-sulphate-heat',
  },
  'activity-1-6-heating-lead-nitrate': {
    id: 'activity-1-6-heating-lead-nitrate',
    number: '1.6',
    title: 'Heating lead nitrate',
    tag: 'Thermal decomposition',
    summary: 'Heat lead nitrate and notice yellow lead oxide with brown nitrogen dioxide fumes.',
    equation: '2Pb(NO3)2(s) -> 2PbO(s) + 4NO2(g) + O2(g)',
    observation: 'White powder turns yellow and thick brown NO2 fumes are emitted.',
    kind: 'lead-nitrate-heat',
  },
  'activity-1-7-electrolysis-water': {
    id: 'activity-1-7-electrolysis-water',
    number: '1.7',
    title: 'Electrolysis of water',
    tag: 'Electrolytic decomposition',
    summary: 'Pass current through acidified water and compare gas volumes at the electrodes.',
    equation: '2H2O(l) -> 2H2(g) + O2(g)',
    observation: 'Hydrogen forms at double the volume of oxygen.',
    kind: 'water-electrolysis',
  },
  'activity-1-8-photochemical-decomposition': {
    id: 'activity-1-8-photochemical-decomposition',
    number: '1.8',
    title: 'Photochemical decomposition',
    tag: 'Decomposition / light',
    summary: 'Expose silver chloride to sunlight and watch it darken as silver forms.',
    equation: '2AgCl(s) -> 2Ag(s) + Cl2(g)',
    observation: 'White silver chloride turns grey due to silver metal formation.',
    kind: 'silver-chloride-light',
  },
  'activity-1-9-iron-copper-sulphate': {
    id: 'activity-1-9-iron-copper-sulphate',
    number: '1.9',
    title: 'Iron nail in copper sulphate',
    tag: 'Displacement',
    summary: 'Dip an iron nail in copper sulphate and observe copper deposition.',
    equation: 'Fe(s) + CuSO4(aq) -> FeSO4(aq) + Cu(s)',
    observation: 'Blue solution fades green and a brown copper coating appears on the nail.',
    kind: 'iron-copper-sulphate',
  },
  'activity-1-10-barium-sulphate-precipitate': {
    id: 'activity-1-10-barium-sulphate-precipitate',
    number: '1.10',
    title: 'Sodium sulphate and barium chloride',
    tag: 'Double displacement / precipitation',
    summary: 'Mix the two salt solutions and look for the insoluble barium sulphate solid.',
    equation: 'Na2SO4(aq) + BaCl2(aq) -> BaSO4(s) + 2NaCl(aq)',
    observation: 'A white barium sulphate precipitate forms and makes the mixture cloudy.',
    kind: 'white-precipitate',
  },
  'activity-1-11-heating-copper-powder': {
    id: 'activity-1-11-heating-copper-powder',
    number: '1.11',
    title: 'Heating copper powder',
    tag: 'Oxidation',
    summary: 'Heat copper powder in air and watch black copper oxide form.',
    equation: '2Cu(s) + O2(g) -> 2CuO(s)',
    observation: 'Brown copper powder becomes coated with black copper(II) oxide.',
    kind: 'copper-oxidation',
  },
};

function mix(progress: number, start: number, end: number) {
  return start + (end - start) * progress;
}

function color(progress: number, from: [number, number, number], to: [number, number, number], alpha = 1) {
  const r = Math.round(mix(progress, from[0], to[0]));
  const g = Math.round(mix(progress, from[1], to[1]));
  const b = Math.round(mix(progress, from[2], to[2]));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, targetX?: number, targetY?: number) {
  ctx.save();
  ctx.font = '700 13px Arial, Helvetica, sans-serif';
  const padding = 8;
  const width = ctx.measureText(text).width + padding * 2;

  if (targetX !== undefined && targetY !== undefined) {
    ctx.strokeStyle = 'rgba(191, 219, 254, 0.78)';
    ctx.beginPath();
    ctx.moveTo(x, y + 13);
    ctx.lineTo(targetX, targetY);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
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

function drawBeaker(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, liquid: string, level = 0.58) {
  ctx.save();
  const liquidTop = y - h * level;
  ctx.fillStyle = liquid;
  ctx.beginPath();
  ctx.moveTo(x - w / 2 + 8, y - 8);
  ctx.lineTo(x - w / 2 + 8, liquidTop);
  ctx.quadraticCurveTo(x, liquidTop - 8, x + w / 2 - 8, liquidTop);
  ctx.lineTo(x + w / 2 - 8, y - 8);
  ctx.fill();

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
  ctx.fillRect(x - w / 2 + 12, y - h + 12, w * 0.12, h - 28);
  ctx.restore();
}

function drawBurner(ctx: CanvasRenderingContext2D, x: number, y: number, heatOn: boolean) {
  ctx.fillStyle = '#64748b';
  ctx.fillRect(x - 14, y, 28, 88);
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 48, y + 88, 96, 14);

  if (!heatOn) {
    return;
  }

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
  ctx.beginPath();
  ctx.moveTo(x - 13, y);
  ctx.quadraticCurveTo(x - 4, y - 70, x + 12, y);
  ctx.fill();
  ctx.fillStyle = 'rgba(252, 211, 77, 0.58)';
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.quadraticCurveTo(x, y - 38, x + 6, y);
  ctx.fill();
  ctx.restore();
}

function drawTube(ctx: CanvasRenderingContext2D, x: number, y: number, fill: string) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x - 18, y - 70, 36, 92);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 18, y - 84);
  ctx.lineTo(x - 18, y + 18);
  ctx.quadraticCurveTo(x, y + 34, x + 18, y + 18);
  ctx.lineTo(x + 18, y - 84);
  ctx.stroke();
  ctx.restore();
}

function drawDish(ctx: CanvasRenderingContext2D, x: number, y: number, powder: string) {
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(x, y, 82, 24, 0, 0, Math.PI, false);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = powder;
  ctx.beginPath();
  ctx.ellipse(x, y - 4, 54, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawThermometer(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  const mercuryHeight = 20 + progress * 118;
  const temperature = Math.round(25 + progress * 55);

  ctx.save();
  ctx.fillStyle = 'rgba(248, 250, 252, 0.86)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(x, y - 150, 10, 150, 5);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 5, y, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  for (let i = 0; i <= 5; i += 1) {
    const tickY = y - 132 + i * 22;
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.48)';
    ctx.beginPath();
    ctx.moveTo(x + 10, tickY);
    ctx.lineTo(x + 18, tickY);
    ctx.stroke();
  }

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x + 5, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x + 2, y - mercuryHeight, 6, mercuryHeight);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px Arial, Helvetica, sans-serif';
  ctx.fillText(`${temperature} C`, x + 24, y - mercuryHeight + 4);
  ctx.restore();
}

function drawPouringScene(
  ctx: CanvasRenderingContext2D,
  progress: number,
  precipitate: 'yellow' | 'white',
  title: string,
  sourceLabel: string,
) {
  const bx = WIDTH / 2;
  const by = 350;
  const precipitateColor = precipitate === 'yellow' ? 'rgba(250, 204, 21, 0.9)' : 'rgba(248, 250, 252, 0.88)';
  drawBeaker(ctx, bx, by, 132, 150, 'rgba(226, 232, 240, 0.18)', 0.58);

  const cloud = Math.min(1, progress * 1.2);
  for (let i = 0; i < 46; i += 1) {
    const px = bx - 45 + ((i * 19) % 90);
    const py = by - 82 + ((i * 29) % 92);
    ctx.fillStyle = precipitateColor.replace('0.9', String(0.16 + cloud * 0.7)).replace('0.88', String(0.14 + cloud * 0.62));
    ctx.beginPath();
    ctx.arc(px, py + progress * 30, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.save();
  ctx.translate(bx + 120, 186);
  ctx.rotate(-Math.min(0.95, progress * 1.7));
  drawTube(ctx, 0, 0, 'rgba(226, 232, 240, 0.16)');
  if (progress > 0.16 && progress < 0.88) {
    ctx.fillStyle = 'rgba(226, 232, 240, 0.38)';
    ctx.fillRect(-34, 18, 7, 108);
  }
  ctx.restore();

  drawLabel(ctx, title, bx, 425, bx, by - 28);
  if (progress < 0.92) {
    drawLabel(ctx, sourceLabel, bx + 202, 178, bx + 120, 186);
  }
}

function drawGasScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 350;
  const thermometerX = bx + 88;
  drawBeaker(ctx, bx, by, 150, 150, 'rgba(96, 165, 250, 0.28)', 0.62);
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.ellipse(bx - 10, by - 24, 34, 12, -0.35, 0, Math.PI * 2);
  ctx.fill();

  const bubbles = Math.floor(10 + progress * 35);
  ctx.strokeStyle = 'rgba(219, 234, 254, 0.82)';
  for (let i = 0; i < bubbles; i += 1) {
    const px = bx - 42 + ((i * 23) % 84);
    const py = by - 20 - ((i * 31 + progress * 140) % 104);
    ctx.beginPath();
    ctx.arc(px, py, 4 + (i % 4), 0, Math.PI * 2);
    ctx.stroke();
  }

  if (progress > 0.55) {
    ctx.fillStyle = 'rgba(252, 211, 77, 0.24)';
    ctx.beginPath();
    ctx.arc(bx, by - 48, 102, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'Warm flask', bx + 130, by - 76, bx + 54, by - 56);
  }

  drawThermometer(ctx, thermometerX, by, Math.min(1, progress * 0.36));
  drawLabel(ctx, 'H2 bubbles', bx - 130, by - 110, bx - 34, by - 84);
  drawLabel(ctx, 'Zinc granules', bx + 128, by - 5, bx - 10, by - 24);
  drawLabel(ctx, 'Thermometer', bx + 168, by - 88, thermometerX + 5, by - 90);
}

function drawQuicklimeScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 350;
  const thermometerX = bx + 86;
  const stoneY = Math.min(by - 36, 126 + progress * 184);
  drawBeaker(ctx, bx, by, 150, 150, color(progress, [226, 232, 240], [248, 250, 252], 0.24), 0.58);
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(bx, by - 32, 58, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(bx - 22, stoneY, 18, 14, -0.28, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
  for (let i = 0; i < 12; i += 1) {
    const x = bx - 54 + i * 10;
    const rise = progress * (68 + (i % 4) * 14);
    ctx.beginPath();
    ctx.arc(x, by - 60 - rise, 8 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  if (progress > 0.25) {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
    ctx.beginPath();
    ctx.arc(bx, by - 35, 125 * progress, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'Heat released', bx + 140, by - 112, bx + 66, by - 66);
  }

  drawThermometer(ctx, thermometerX, by, progress);
  drawLabel(ctx, 'Quick lime (CaO)', bx - 152, by - 122, bx - 22, stoneY);
  drawLabel(ctx, 'Slaked lime', bx, by + 76, bx, by - 30);
  drawLabel(ctx, 'Thermometer', bx + 168, by - 86, thermometerX + 5, by - 88);
}

function drawHeatingTubeScene(ctx: CanvasRenderingContext2D, progress: number, mode: 'ferrous' | 'lead') {
  const bx = WIDTH / 2;
  const burnerY = 370;
  drawBurner(ctx, bx, burnerY, progress > 0.02);
  ctx.save();
  ctx.translate(bx, 252);
  ctx.rotate(-0.12);
  const powder = mode === 'ferrous'
    ? color(progress, [34, 197, 94], [127, 29, 29], 0.9)
    : color(progress, [248, 250, 252], [250, 204, 21], 0.9);
  drawTube(ctx, 0, 0, powder);
  ctx.restore();

  const fumes = mode === 'ferrous' ? 'rgba(148, 163, 184, 0.34)' : 'rgba(146, 64, 14, 0.48)';
  ctx.fillStyle = fumes;
  for (let i = 0; i < 14; i += 1) {
    ctx.beginPath();
    ctx.arc(bx + 8 + (i % 5) * 22, 180 - progress * (28 + i * 3), 10 + (i % 3) * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLabel(ctx, mode === 'ferrous' ? 'Green to brown' : 'White to yellow', bx - 135, 226, bx - 20, 244);
  drawLabel(ctx, mode === 'ferrous' ? 'SO2 and SO3 fumes' : 'Brown NO2 fumes', bx + 145, 160, bx + 54, 185);
  drawLabel(ctx, 'Bunsen burner', bx - 132, burnerY + 48, bx - 15, burnerY + 44);
  drawLabel(ctx, 'Boiling tube', bx - 118, 174, bx - 20, 222);
  drawLabel(ctx, mode === 'ferrous' ? 'FeSO4 crystals' : 'Lead nitrate', bx + 126, 282, bx + 24, 252);
}

function drawElectrolysisScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 372;
  drawBeaker(ctx, bx, by, 190, 150, 'rgba(96, 165, 250, 0.32)', 0.72);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(bx - 48, by - 80, 12, 88);
  ctx.fillRect(bx + 36, by - 80, 12, 88);

  ctx.strokeStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(bx - 42, by + 6);
  ctx.lineTo(bx - 88, by + 58);
  ctx.stroke();
  ctx.strokeStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(bx + 42, by + 6);
  ctx.lineTo(bx + 88, by + 58);
  ctx.stroke();

  function invertedTube(x: number, gasLevel: number) {
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 18, by - 186, 36, 132);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 15, by - 183, 30, gasLevel);
  }

  invertedTube(bx - 42, progress * 112);
  invertedTube(bx + 42, progress * 56);

  ctx.strokeStyle = 'rgba(219, 234, 254, 0.86)';
  for (let i = 0; i < 30; i += 1) {
    const side = i % 2 === 0 ? -42 : 42;
    const px = bx + side + ((i * 11) % 18) - 9;
    const py = by - 28 - ((i * 19 + progress * 120) % 130);
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawLabel(ctx, 'Hydrogen: 2 parts', bx - 132, by - 174, bx - 42, by - 176);
  drawLabel(ctx, 'Oxygen: 1 part', bx + 132, by - 134, bx + 42, by - 138);
  drawLabel(ctx, 'Cathode (-)', bx - 138, by + 42, bx - 44, by - 48);
  drawLabel(ctx, 'Anode (+)', bx + 138, by + 42, bx + 42, by - 48);
}

function drawSilverChlorideScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 335;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const beam = ctx.createLinearGradient(bx + 210, 68, bx, by);
  beam.addColorStop(0, `rgba(253, 224, 71, ${0.1 + progress * 0.44})`);
  beam.addColorStop(1, 'rgba(253, 224, 71, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(bx + 230, 70);
  ctx.lineTo(bx + 110, 70);
  ctx.lineTo(bx - 52, by + 12);
  ctx.lineTo(bx + 64, by + 12);
  ctx.fill();
  ctx.restore();

  drawDish(ctx, bx, by, color(progress, [255, 255, 255], [107, 114, 128], 1));
  drawLabel(ctx, 'Sunlight', bx + 160, 92, bx + 86, 162);
  drawLabel(ctx, 'China dish', bx - 126, by + 58, bx - 52, by);
  drawLabel(ctx, 'AgCl powder', bx + 118, by - 18, bx + 22, by - 4);
  drawLabel(ctx, 'AgCl turns grey', bx, by + 70, bx, by - 4);
}

function drawIronCopperScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 360;
  drawBeaker(ctx, bx, by, 154, 152, color(progress, [59, 130, 246], [134, 239, 172], 0.52), 0.68);
  const nailColor = color(progress, [148, 163, 184], [180, 83, 9], 1);
  ctx.fillStyle = nailColor;
  ctx.beginPath();
  ctx.moveTo(bx - 8, 170 + progress * 76);
  ctx.lineTo(bx + 8, 170 + progress * 76);
  ctx.lineTo(bx + 5, 330);
  ctx.lineTo(bx, 350);
  ctx.lineTo(bx - 5, 330);
  ctx.fill();
  ctx.strokeStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(bx, 70);
  ctx.lineTo(bx, 170 + progress * 76);
  ctx.stroke();
  drawLabel(ctx, 'Iron nail', bx - 118, 205, bx, 240);
  drawLabel(ctx, 'Cu deposit', bx + 126, 260, bx + 6, 300);
  drawLabel(ctx, 'Blue fades green', bx, by + 70, bx + 44, by - 34);
}

function drawCopperOxidationScene(ctx: CanvasRenderingContext2D, progress: number) {
  const bx = WIDTH / 2;
  const by = 365;
  drawBurner(ctx, bx, by, progress > 0.02);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx - 68, by - 20);
  ctx.lineTo(bx - 42, by + 100);
  ctx.moveTo(bx + 68, by - 20);
  ctx.lineTo(bx + 42, by + 100);
  ctx.stroke();
  ctx.fillStyle = '#475569';
  ctx.fillRect(bx - 88, by - 28, 176, 8);
  drawDish(ctx, bx, by - 48, color(progress, [184, 115, 51], [18, 18, 18], 1));
  drawLabel(ctx, 'Bunsen burner', bx - 130, by + 44, bx - 15, by + 44);
  drawLabel(ctx, 'Wire mesh and tripod', bx - 150, by - 56, bx - 70, by - 24);
  drawLabel(ctx, 'Copper powder', bx + 138, by - 78, bx + 32, by - 52);
  drawLabel(ctx, 'Black CuO layer', bx - 132, by - 108, bx - 20, by - 54);
}

function drawScene(ctx: CanvasRenderingContext2D, activity: LabActivity, progress: number) {
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
    case 'yellow-precipitate':
      drawPouringScene(ctx, progress, 'yellow', 'PbI2 yellow ppt', 'Potassium iodide');
      break;
    case 'hydrogen-bubbles':
      drawGasScene(ctx, progress);
      break;
    case 'quicklime-steam':
      drawQuicklimeScene(ctx, progress);
      break;
    case 'ferrous-sulphate-heat':
      drawHeatingTubeScene(ctx, progress, 'ferrous');
      break;
    case 'lead-nitrate-heat':
      drawHeatingTubeScene(ctx, progress, 'lead');
      break;
    case 'water-electrolysis':
      drawElectrolysisScene(ctx, progress);
      break;
    case 'silver-chloride-light':
      drawSilverChlorideScene(ctx, progress);
      break;
    case 'iron-copper-sulphate':
      drawIronCopperScene(ctx, progress);
      break;
    case 'white-precipitate':
      drawPouringScene(ctx, progress, 'white', 'BaSO4 white ppt', 'Barium chloride');
      break;
    case 'copper-oxidation':
      drawCopperOxidationScene(ctx, progress);
      break;
  }

  ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
  ctx.font = '16px Consolas, "Courier New", monospace';
  ctx.fillText(progress >= 1 ? 'Observation complete.' : progress > 0 ? 'Reaction in progress...' : 'Ready. Click start.', 20, 30);
}

export function hasChemicalReactionLabDemo(demoId: string): demoId is LabActivityId {
  return Object.prototype.hasOwnProperty.call(LAB_ACTIVITIES, demoId);
}

export default function ChemicalReactionLabDemo({ demoId }: { demoId: LabActivityId }) {
  const activity = LAB_ACTIVITIES[demoId];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<DemoControls | null>(null);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) {
      return;
    }

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

      if (mounted) {
        setProgress(currentProgress);
      }
    }

    controlsRef.current = {
      reset: () => {
        isRunning = false;
        if (mounted) {
          setRunning(false);
        }
        syncProgress(0);
        drawScene(ctx, activity, 0);
      },
      start: () => {
        if (currentProgress >= 1) {
          syncProgress(0);
        }

        isRunning = true;
        if (mounted) {
          setRunning(true);
        }
      },
    };

    function loop(timestamp: number) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      if (isRunning) {
        syncProgress(currentProgress + deltaSeconds * 0.28);

        if (currentProgress >= 1) {
          isRunning = false;
          if (mounted) {
            setRunning(false);
          }
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
    if (progress >= 1) {
      return activity.observation;
    }

    if (running) {
      return 'Watch the apparatus carefully and connect the visible change to the equation.';
    }

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
