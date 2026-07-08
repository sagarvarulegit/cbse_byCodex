'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type CarbonCompoundsActivityId =
  | 'activity-4-1-carbon-around-us'
  | 'activity-4-2-alcohol-homologous-series'
  | 'activity-4-3-4-4-combustion'
  | 'activity-4-5-oxidation-ethanol'
  | 'activity-4-6-ethanol-sodium'
  | 'activity-4-7-acid-strength'
  | 'activity-4-8-esterification'
  | 'activity-4-9-ethanoic-acid-carbonate'
  | 'activity-4-10-emulsion-micelles'
  | 'activity-4-11-soap-hard-water'
  | 'activity-4-12-soap-vs-detergent';

type Activity = {
  id: CarbonCompoundsActivityId;
  number: string;
  title: string;
  tag: string;
  summary: string;
  equation: string;
  observation: string;
  kind:
    | 'carbon-sorting'
    | 'homologous-series'
    | 'combustion'
    | 'oxidation'
    | 'sodium'
    | 'esterification'
    | 'acid-strength'
    | 'carbonate'
    | 'emulsion'
    | 'hard-water'
    | 'detergent';
};

type DemoControls = {
  reset: () => void;
  start: () => void;
};

const WIDTH = 800;
const HEIGHT = 520;

const ACTIVITIES: Record<CarbonCompoundsActivityId, Activity> = {
  'activity-4-1-carbon-around-us': {
    id: 'activity-4-1-carbon-around-us',
    number: '4.1',
    title: 'Carbon around us',
    tag: 'Everyday material sorting',
    summary: 'Sort everyday objects into metal, glass or clay, and carbon-rich things to see how common carbon compounds are.',
    equation: 'Everyday objects -> metal / glass-clay / carbon compounds',
    observation:
      'Food, paper, cloth, plastics, fuels, and many medicines contain carbon compounds, so carbon appears throughout daily life.',
    kind: 'carbon-sorting',
  },
  'activity-4-2-alcohol-homologous-series': {
    id: 'activity-4-2-alcohol-homologous-series',
    number: '4.2',
    title: 'Alcohol homologous series',
    tag: 'Same functional group / CH2 step',
    summary: 'Compare methanol, ethanol, propanol, and butanol to see the CH2 difference and common -OH group.',
    equation: 'CH3OH -> C2H5OH -> C3H7OH -> C4H9OH',
    observation:
      'Each alcohol has the -OH functional group, and each next member differs by CH2. This pattern forms a homologous series.',
    kind: 'homologous-series',
  },
  'activity-4-3-4-4-combustion': {
    id: 'activity-4-3-4-4-combustion',
    number: '4.3-4.4',
    title: 'Combustion of carbon compounds',
    tag: 'Clean flame / sooty flame',
    summary: 'Compare ethanol with an unsaturated carbon compound to see complete and incomplete combustion clues.',
    equation: 'C2H5OH + 3O2 -> 2CO2 + 3H2O + heat | limited O2 -> soot',
    observation:
      'Ethanol burns with a clean blue flame. Unsaturated or oxygen-poor burning gives a yellow smoky flame due to soot.',
    kind: 'combustion',
  },
  'activity-4-5-oxidation-ethanol': {
    id: 'activity-4-5-oxidation-ethanol',
    number: '4.5',
    title: 'Oxidation of ethanol',
    tag: 'Alkaline KMnO4',
    summary: 'Add alkaline potassium permanganate to warm ethanol and watch the oxidising-agent colour clue.',
    equation: 'CH3CH2OH + [O] -> CH3COOH + H2O',
    observation:
      'The purple colour disappears while ethanol is being oxidised. When ethanol is used up, excess KMnO4 stays purple.',
    kind: 'oxidation',
  },
  'activity-4-6-ethanol-sodium': {
    id: 'activity-4-6-ethanol-sodium',
    number: '4.6',
    title: 'Ethanol reacts with sodium',
    tag: 'Hydrogen gas test',
    summary: 'Drop sodium into ethanol and connect the bubbles to hydrogen gas evolution.',
    equation: '2Na + 2CH3CH2OH -> 2CH3CH2ONa + H2',
    observation:
      'Ethanol reacts with sodium to form sodium ethoxide and hydrogen gas. The hydrogen gives the familiar pop test.',
    kind: 'sodium',
  },
  'activity-4-7-acid-strength': {
    id: 'activity-4-7-acid-strength',
    number: '4.7',
    title: 'Acetic acid and hydrochloric acid',
    tag: 'Weak acid / strong acid',
    summary: 'Use litmus and universal indicator to compare dilute acetic acid with dilute HCl.',
    equation: 'HCl ionises fully | CH3COOH ionises partially',
    observation:
      'Both acids turn blue litmus red, but universal indicator shows HCl is much more acidic than acetic acid.',
    kind: 'acid-strength',
  },
  'activity-4-8-esterification': {
    id: 'activity-4-8-esterification',
    number: '4.8',
    title: 'Esterification',
    tag: 'Fruity-smelling ester',
    summary: 'Warm ethanol and ethanoic acid with acid catalyst, then pour into water to notice the ester clue.',
    equation: 'CH3COOH + C2H5OH <-> CH3COOC2H5 + H2O',
    observation:
      'An alcohol and carboxylic acid form an ester. The pleasant fruity smell is the main observation at this level.',
    kind: 'esterification',
  },
  'activity-4-9-ethanoic-acid-carbonate': {
    id: 'activity-4-9-ethanoic-acid-carbonate',
    number: '4.9',
    title: 'Ethanoic acid with carbonate',
    tag: 'CO2 and lime-water test',
    summary: 'React ethanoic acid with sodium carbonate or sodium hydrogencarbonate and pass the gas through lime water.',
    equation: '2CH3COOH + Na2CO3 -> 2CH3COONa + H2O + CO2',
    observation:
      'Both carbonate and hydrogencarbonate give carbon dioxide. Lime water turns milky and confirms the gas.',
    kind: 'carbonate',
  },
  'activity-4-10-emulsion-micelles': {
    id: 'activity-4-10-emulsion-micelles',
    number: '4.10',
    title: 'Emulsion test and micelles',
    tag: 'Oil + water + soap',
    summary: 'Shake oil and water with and without soap to see why micelles keep oil droplets suspended.',
    equation: 'soap head faces water + soap tail enters oil -> micelle',
    observation:
      'Oil and water separate without soap. With soap, micelles hold tiny oil droplets in water and the mixture stays milky.',
    kind: 'emulsion',
  },
  'activity-4-11-soap-hard-water': {
    id: 'activity-4-11-soap-hard-water',
    number: '4.11',
    title: 'Soap in distilled and hard water',
    tag: 'Lather / scum',
    summary: 'Compare soap lathering in distilled water and hard water.',
    equation: 'soap + Ca2+/Mg2+ -> insoluble scum',
    observation:
      'Distilled water gives plenty of lather. Hard water forms curdy scum and reduces the cleaning action of soap.',
    kind: 'hard-water',
  },
  'activity-4-12-soap-vs-detergent': {
    id: 'activity-4-12-soap-vs-detergent',
    number: '4.12',
    title: 'Soap versus detergent in hard water',
    tag: 'Cleaning-agent comparison',
    summary: 'Compare soap and synthetic detergent in the same hard-water condition.',
    equation: 'detergents remain soluble in hard water',
    observation:
      'Soap forms scum in hard water, while detergent keeps lathering because it does not form insoluble scum so easily.',
    kind: 'detergent',
  },
};

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function mix(progress: number, start: number, end: number) {
  return start + (end - start) * progress;
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
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
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

function drawTube(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, fill = 0.58, label?: string) {
  const width = 52;
  const height = 170;
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x - width / 2, y + height - 24);
  ctx.quadraticCurveTo(x, y + height + 16, x + width / 2, y + height - 24);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
  ctx.fillStyle = color;
  const liquidHeight = height * fill;
  ctx.fillRect(x - width / 2 + 4, y + height - liquidHeight, width - 8, liquidHeight - 16);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  drawRoundedRect(ctx, x - width / 2 + 9, y + 14, 7, height - 42, 4);
  ctx.fill();
  if (label) drawLabel(ctx, label, x, y + height + 32);
  ctx.restore();
}

function drawBeaker(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label?: string) {
  ctx.save();
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 64, y);
  ctx.lineTo(x - 54, y + 145);
  ctx.quadraticCurveTo(x, y + 170, x + 54, y + 145);
  ctx.lineTo(x + 64, y);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.fillRect(x - 51, y + 72, 102, 72);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.fillRect(x - 42, y + 16, 8, 118);
  if (label) drawLabel(ctx, label, x, y + 190);
  ctx.restore();
}

function drawBurner(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number, sooty = false) {
  const p = clamp(progress);
  ctx.fillStyle = '#64748b';
  drawRoundedRect(ctx, x - 36, y + 34, 72, 18, 6);
  ctx.fill();
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 12, y + 2, 24, 38);
  ctx.fillStyle = sooty ? `rgba(251, 191, 36, ${0.35 + p * 0.55})` : `rgba(96, 165, 250, ${0.35 + p * 0.55})`;
  ctx.beginPath();
  ctx.ellipse(x, y - 18, 20 + p * 9, 38 + p * 8, 0, 0, Math.PI * 2);
  ctx.fill();
  if (sooty && p > 0.35) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    for (let index = 0; index < 18; index += 1) {
      ctx.beginPath();
      ctx.arc(x + Math.sin(index * 1.7) * 34, y - 90 - index * 5, 5 + (index % 4), 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawCarbonSorting(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  const columns = [
    { x: 155, title: 'metal', color: '#94a3b8', items: ['spoon', 'key', 'pan'] },
    { x: 400, title: 'glass / clay', color: '#38bdf8', items: ['cup', 'bottle', 'plate'] },
    { x: 645, title: 'carbon compounds', color: '#34d399', items: ['food', 'paper', 'cloth', 'fuel'] },
  ];

  columns.forEach((column) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.62)';
    drawRoundedRect(ctx, column.x - 92, 118, 184, 284, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.36)';
    ctx.stroke();
    drawLabel(ctx, column.title, column.x, 92);
  });

  columns.forEach((column, columnIndex) => {
    column.items.forEach((item, itemIndex) => {
      const reveal = clamp(p * 1.45 - (columnIndex * 0.12 + itemIndex * 0.1));
      const startX = 80 + itemIndex * 54;
      const startY = 430 + columnIndex * 18;
      const x = mix(reveal, startX, column.x);
      const y = mix(reveal, startY, 155 + itemIndex * 48);
      ctx.fillStyle = column.color;
      drawRoundedRect(ctx, x - 42, y - 15, 84, 30, 8);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 13px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item, x, y);
    });
  });

  drawLabel(ctx, 'many daily-use things contain carbon', 400, 448, 645, 332);
}

function drawHomologousSeries(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  const alcohols = [
    { name: 'methanol', formula: 'CH3OH' },
    { name: 'ethanol', formula: 'C2H5OH' },
    { name: 'propanol', formula: 'C3H7OH' },
    { name: 'butanol', formula: 'C4H9OH' },
  ];

  alcohols.forEach((alcohol, index) => {
    const reveal = clamp(p * 1.35 - index * 0.14);
    const x = 140 + index * 175;
    const y = 250;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
    drawRoundedRect(ctx, x - 70, y - 82, 140, 164, 12);
    ctx.fill();
    ctx.strokeStyle = reveal > 0.02 ? 'rgba(45, 212, 191, 0.8)' : 'rgba(148, 163, 184, 0.35)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '700 15px Arial, Helvetica, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(alcohol.name, x, y - 45);
    ctx.font = '700 18px Consolas, "Courier New", monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(alcohol.formula, x, y - 5);
    ctx.fillStyle = '#2dd4bf';
    drawRoundedRect(ctx, x - 25, y + 30, 50, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#082f49';
    ctx.font = '700 15px Arial, Helvetica, sans-serif';
    ctx.fillText('-OH', x, y + 49);

    if (index > 0 && reveal > 0.3) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 115, y);
      ctx.lineTo(x - 80, y);
      ctx.stroke();
      drawLabel(ctx, '+ CH2', x - 98, y - 38);
    }
  });

  drawLabel(ctx, 'same functional group', 400, 116, 400, 300);
  drawLabel(ctx, 'successive members differ by CH2', 400, 430, 400, 250);
}

function drawCombustion(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBurner(ctx, 245, 365, p, false);
  drawBurner(ctx, 555, 365, p, true);
  drawTube(ctx, 245, 170, 'rgba(147, 197, 253, 0.32)', 0.35, 'ethanol');
  drawTube(ctx, 555, 170, 'rgba(251, 191, 36, 0.32)', 0.35, 'unsaturated compound');
  drawLabel(ctx, 'clean blue flame', 245, 88, 245, 300);
  drawLabel(ctx, 'yellow smoky flame', 555, 88, 555, 284);
  if (p > 0.55) drawLabel(ctx, 'soot = incomplete combustion', 555, 190, 584, 250);
}

function drawOxidation(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBeaker(ctx, 400, 210, p < 0.5 ? 'rgba(186, 85, 211, 0.55)' : 'rgba(226, 232, 240, 0.2)', 'warm ethanol');
  ctx.fillStyle = '#a855f7';
  for (let index = 0; index < 8; index += 1) {
    const fall = clamp(p * 1.7 - index * 0.08);
    ctx.beginPath();
    ctx.arc(325 + index * 22, mix(fall, 90, 265), 5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (p > 0.62) {
    ctx.fillStyle = `rgba(168, 85, 247, ${p - 0.4})`;
    ctx.beginPath();
    ctx.arc(515, 290, 24, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, 'excess KMnO4 stays purple', 540, 150, 515, 290);
  } else {
    drawLabel(ctx, 'purple colour disappears', 400, 120, 400, 280);
  }
  drawLabel(ctx, 'ethanol oxidises to ethanoic acid', 400, 405, 400, 320);
}

function drawSodium(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBeaker(ctx, 400, 210, 'rgba(125, 211, 252, 0.26)', 'ethanol');
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(400, mix(p, 110, 295), 18, 0, Math.PI * 2);
  ctx.fill();
  if (p > 0.25) {
    ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
    for (let index = 0; index < 24; index += 1) {
      const bubble = (p * 180 + index * 21) % 110;
      ctx.beginPath();
      ctx.arc(350 + (index % 8) * 15, 320 - bubble, 3 + (index % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (p > 0.72) drawLabel(ctx, 'hydrogen gas: pop test', 520, 145, 445, 230);
  drawLabel(ctx, 'sodium ethoxide forms', 310, 405, 395, 312);
}

function drawEsterification(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBeaker(ctx, 280, 228, 'rgba(56, 189, 248, 0.28)', 'water bath');
  drawTube(ctx, 280, 150, 'rgba(251, 191, 36, 0.38)', 0.45, 'ethanol + acid');
  drawBurner(ctx, 280, 390, p, false);
  drawBeaker(ctx, 560, 235, 'rgba(125, 211, 252, 0.25)', 'water');
  if (p > 0.42) {
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(328, 245);
    ctx.quadraticCurveTo(430, 260, 528, 300);
    ctx.stroke();
  }
  if (p > 0.65) {
    ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
    for (let index = 0; index < 10; index += 1) {
      ctx.beginPath();
      ctx.arc(520 + Math.sin(index) * 62, 170 - index * 7, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    drawLabel(ctx, 'pleasant fruity smell', 560, 115, 555, 190);
  }
}

function drawAcidStrength(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawTube(ctx, 260, 168, p > 0.55 ? 'rgba(239, 68, 68, 0.66)' : 'rgba(248, 113, 113, 0.3)', 0.55, 'dilute HCl');
  drawTube(ctx, 540, 168, p > 0.55 ? 'rgba(251, 146, 60, 0.66)' : 'rgba(248, 113, 113, 0.3)', 0.55, 'acetic acid');
  ctx.fillStyle = p > 0.36 ? '#ef4444' : '#2563eb';
  ctx.fillRect(190, 140, 140, 12);
  ctx.fillRect(470, 140, 140, 12);
  drawLabel(ctx, 'blue litmus turns red in both', 400, 95, 400, 145);
  if (p > 0.55) {
    drawLabel(ctx, 'pH about 1', 260, 365, 260, 282);
    drawLabel(ctx, 'pH about 3-4', 540, 365, 540, 282);
  }
}

function drawCarbonate(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawBeaker(ctx, 265, 220, 'rgba(248, 113, 113, 0.26)', 'ethanoic acid + Na2CO3');
  drawBeaker(ctx, 570, 220, p > 0.62 ? 'rgba(226, 232, 240, 0.75)' : 'rgba(125, 211, 252, 0.22)', 'lime water');
  if (p > 0.22) {
    ctx.fillStyle = 'rgba(226, 232, 240, 0.82)';
    for (let index = 0; index < 22; index += 1) {
      const rise = (p * 170 + index * 17) % 100;
      ctx.beginPath();
      ctx.arc(230 + (index % 6) * 13, 324 - rise, 3 + (index % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(315, 260);
    ctx.quadraticCurveTo(420, 145, 520, 260);
    ctx.stroke();
  }
  drawLabel(ctx, 'CO2 gas', 410, 170, 405, 180);
  if (p > 0.62) drawLabel(ctx, 'lime water turns milky', 570, 125, 570, 285);
}

function drawMicelles(ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) {
  const count = 18;
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count;
    const tailX = x + Math.cos(angle) * 38 * progress;
    const tailY = y + Math.sin(angle) * 38 * progress;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * 20, y + Math.sin(angle) * 20);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();
    ctx.fillStyle = '#2dd4bf';
    ctx.beginPath();
    ctx.arc(tailX, tailY, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(245, 158, 11, 0.72)';
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fill();
}

function drawEmulsion(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawTube(ctx, 250, 170, 'rgba(125, 211, 252, 0.28)', 0.65, 'oil + water');
  drawTube(ctx, 550, 170, p > 0.45 ? 'rgba(226, 232, 240, 0.58)' : 'rgba(125, 211, 252, 0.28)', 0.65, 'oil + water + soap');
  ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.fillRect(226, 228, 48, 36);
  if (p > 0.35) drawMicelles(ctx, 550, 268, clamp((p - 0.35) * 1.7));
  drawLabel(ctx, 'separates again', 250, 112, 250, 245);
  drawLabel(ctx, 'micelles stabilise oil droplets', 550, 112, 550, 268);
}

function drawHardWater(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawTube(ctx, 260, 170, p > 0.42 ? 'rgba(226, 232, 240, 0.65)' : 'rgba(125, 211, 252, 0.28)', 0.64, 'distilled water');
  drawTube(ctx, 540, 170, 'rgba(125, 211, 252, 0.28)', 0.64, 'hard water');
  if (p > 0.36) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.86)';
    for (let index = 0; index < 26; index += 1) {
      ctx.beginPath();
      ctx.arc(228 + (index % 7) * 10, 220 - Math.floor(index / 7) * 10, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f8fafc';
    for (let index = 0; index < 12; index += 1) {
      ctx.beginPath();
      ctx.arc(515 + (index % 4) * 15, 310 + Math.floor(index / 4) * 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawLabel(ctx, 'plenty of lather', 260, 112, 260, 215);
  drawLabel(ctx, 'curdy scum', 540, 112, 540, 318);
}

function drawDetergent(ctx: CanvasRenderingContext2D, progress: number) {
  const p = clamp(progress);
  drawTube(ctx, 260, 170, 'rgba(125, 211, 252, 0.28)', 0.64, 'soap + hard water');
  drawTube(ctx, 540, 170, p > 0.4 ? 'rgba(226, 232, 240, 0.62)' : 'rgba(125, 211, 252, 0.28)', 0.64, 'detergent + hard water');
  if (p > 0.36) {
    ctx.fillStyle = '#f8fafc';
    for (let index = 0; index < 12; index += 1) {
      ctx.beginPath();
      ctx.arc(235 + (index % 4) * 15, 310 + Math.floor(index / 4) * 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let index = 0; index < 28; index += 1) {
      ctx.beginPath();
      ctx.arc(505 + (index % 7) * 10, 220 - Math.floor(index / 7) * 9, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawLabel(ctx, 'soap forms scum', 260, 112, 260, 318);
  drawLabel(ctx, 'detergent still lathers', 540, 112, 540, 215);
}

function drawScene(ctx: CanvasRenderingContext2D, activity: Activity, progress: number) {
  const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, '#17243a');
  background.addColorStop(1, '#0f172a');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawBench(ctx);

  switch (activity.kind) {
    case 'carbon-sorting':
      drawCarbonSorting(ctx, progress);
      break;
    case 'homologous-series':
      drawHomologousSeries(ctx, progress);
      break;
    case 'combustion':
      drawCombustion(ctx, progress);
      break;
    case 'oxidation':
      drawOxidation(ctx, progress);
      break;
    case 'sodium':
      drawSodium(ctx, progress);
      break;
    case 'esterification':
      drawEsterification(ctx, progress);
      break;
    case 'acid-strength':
      drawAcidStrength(ctx, progress);
      break;
    case 'carbonate':
      drawCarbonate(ctx, progress);
      break;
    case 'emulsion':
      drawEmulsion(ctx, progress);
      break;
    case 'hard-water':
      drawHardWater(ctx, progress);
      break;
    case 'detergent':
      drawDetergent(ctx, progress);
      break;
  }

  ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
  ctx.font = '16px Consolas, "Courier New", monospace';
  ctx.fillText(progress >= 1 ? 'Observation complete.' : progress > 0 ? 'Experiment in progress...' : 'Ready. Click start.', 20, 30);
}

export function hasCarbonCompoundsLabDemo(demoId: string): demoId is CarbonCompoundsActivityId {
  return Object.prototype.hasOwnProperty.call(ACTIVITIES, demoId);
}

export default function CarbonCompoundsLabDemo({ demoId }: { demoId: CarbonCompoundsActivityId }) {
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
    if (running) return 'Watch the sorting, pattern, flame, colour, gas, smell clue, lather, or scum and connect it to the textbook activity.';
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
