'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type PlantGrowthActivityId = 'activity-6-2-phototropism';
type StageId = 'setup' | 'first-growth' | 'turned' | 'new-growth' | 'conclusion';

type DemoControls = {
  nextStage: () => void;
  reset: () => void;
  start: () => void;
};

const STAGES: Array<{ id: StageId; title: string; caption: string }> = [
  {
    id: 'setup',
    title: 'Set up the experiment',
    caption: 'Fill a conical flask with water, cover its neck with wire mesh, and place two or three freshly germinated bean seeds on the mesh. Keep it inside a cardboard box whose open side faces light from a window.',
  },
  {
    id: 'first-growth',
    title: 'Wait for two or three days',
    caption: 'The shoots bend towards light, while the roots grow away from light.',
  },
  {
    id: 'turned',
    title: 'Turn the flask',
    caption: 'Turn the flask so the old shoots point away from light and the old roots point towards light.',
  },
  {
    id: 'new-growth',
    title: 'Watch the new tips',
    caption: 'The old grown portions retain their direction. Only the new shoot and root growth changes direction in response to light.',
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    caption: 'Shoots show positive phototropism and roots show negative phototropism. The change in direction appears in newly growing regions, not in old grown parts.',
  },
];

const WIDTH = 800;
const HEIGHT = 520;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  targetX: number,
  targetY: number,
) {
  ctx.save();
  ctx.font = '700 12px Arial, Helvetica, sans-serif';
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.78)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + 5);
  ctx.lineTo(targetX, targetY);
  ctx.stroke();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  const width = ctx.measureText(text).width + 14;
  ctx.fillRect(x - width / 2, y - 10, width, 22);
  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y + 1);
  ctx.restore();
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const background = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  background.addColorStop(0, '#17243a');
  background.addColorStop(1, '#0f172a');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#26364d';
  ctx.fillRect(0, 462, WIDTH, 58);
}

function drawCardboardBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const depth = 52;
  ctx.save();
  ctx.fillStyle = '#7c4a2d';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#9a6742';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y + depth);
  ctx.lineTo(x + depth, y + height - depth);
  ctx.lineTo(x, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b07a50';
  ctx.beginPath();
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + depth, y + height - depth);
  ctx.lineTo(x + width - depth, y + height - depth);
  ctx.lineTo(x + width, y + height);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#17243a';
  ctx.fillRect(x + depth, y + depth, width - depth, height - depth * 2);
  ctx.strokeStyle = '#d5a06b';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);
  ctx.strokeStyle = '#fbbf24';
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(x + width, y + 8);
  ctx.lineTo(x + width, y + height - 8);
  ctx.stroke();
  ctx.restore();
}

function drawWindowAndLight(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  ctx.save();
  const beam = ctx.createLinearGradient(x, y + height / 2, x - 360, y + height / 2);
  beam.addColorStop(0, 'rgba(253, 224, 71, 0.42)');
  beam.addColorStop(1, 'rgba(253, 224, 71, 0.02)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(x, y + 16);
  ctx.lineTo(x, y + height - 16);
  ctx.lineTo(x - 370, y + height + 80);
  ctx.lineTo(x - 370, y - 64);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#dbeafe';
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 6;
  ctx.strokeRect(x, y, width, height);
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y);
  ctx.lineTo(x + width / 2, y + height);
  ctx.moveTo(x, y + height / 2);
  ctx.lineTo(x + width, y + height / 2);
  ctx.stroke();

  const arrowY = y + height + 34;
  ctx.strokeStyle = '#fde047';
  ctx.fillStyle = '#fde047';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, arrowY);
  ctx.lineTo(x - 94, arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 94, arrowY);
  ctx.lineTo(x - 78, arrowY - 10);
  ctx.lineTo(x - 78, arrowY + 10);
  ctx.closePath();
  ctx.fill();
  ctx.font = '700 13px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('light', x + 12, arrowY - 10);
  ctx.restore();
}

function drawFlask(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rotation: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.beginPath();
  ctx.moveTo(-72, 96);
  ctx.quadraticCurveTo(0, 118, 72, 96);
  ctx.lineTo(48, 30);
  ctx.lineTo(-48, 30);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(226, 232, 240, 0.88)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-30, -58);
  ctx.lineTo(-30, -5);
  ctx.lineTo(-82, 92);
  ctx.quadraticCurveTo(-90, 112, -62, 118);
  ctx.quadraticCurveTo(0, 132, 62, 118);
  ctx.quadraticCurveTo(90, 112, 82, 92);
  ctx.lineTo(30, -5);
  ctx.lineTo(30, -58);
  ctx.stroke();

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2;
  for (let offset = -27; offset <= 27; offset += 9) {
    ctx.beginPath();
    ctx.moveTo(offset, -48);
    ctx.lineTo(offset, -20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-30, -34 + offset / 5);
    ctx.lineTo(30, -34 + offset / 5);
    ctx.stroke();
  }

  for (const seedX of [-18, 0, 18]) {
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(seedX, -59, 8, 5, -0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlantCurve(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  startX: number,
  startY: number,
  controlX: number,
  controlY: number,
  endX: number,
  endY: number,
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(controlX, controlY, endX, endY);
  ctx.stroke();
}

function drawSeedsAndGrowth(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
  stageProgress: number,
) {
  if (stageIndex === 0) {
    return;
  }

  const growth = stageIndex === 1 ? stageProgress : 1;
  const turned = stageIndex >= 2;
  const seedX = 315;
  const seedY = turned ? 364 : 246;
  const shootEndX = turned ? 240 : 390;
  const shootEndY = turned ? 440 : 170;
  const rootEndX = turned ? 355 : 275;
  const rootEndY = turned ? 260 : 350;

  ctx.save();
  drawPlantCurve(
    ctx,
    '#166534',
    7,
    seedX,
    seedY,
    seedX + (turned ? -18 : 22) * growth,
    seedY + (turned ? 48 : -42) * growth,
    seedX + (shootEndX - seedX) * growth,
    seedY + (shootEndY - seedY) * growth,
  );
  drawPlantCurve(
    ctx,
    '#7c2d12',
    6,
    seedX,
    seedY,
    seedX + (turned ? 8 : -8) * growth,
    seedY + (turned ? -56 : 58) * growth,
    seedX + (rootEndX - seedX) * growth,
    seedY + (rootEndY - seedY) * growth,
  );

  if (stageIndex >= 3) {
    const tipGrowth = stageIndex === 3 ? stageProgress : 1;

    if (tipGrowth > 0) {
      drawPlantCurve(ctx, '#4ade80', 6, shootEndX, shootEndY, shootEndX + 34 * tipGrowth, shootEndY - 6 * tipGrowth, shootEndX + 82 * tipGrowth, shootEndY - 38 * tipGrowth);
      drawPlantCurve(ctx, '#c76a3a', 5, rootEndX, rootEndY, rootEndX - 26 * tipGrowth, rootEndY + 2 * tipGrowth, rootEndX - 72 * tipGrowth, rootEndY + 34 * tipGrowth);
    }

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(shootEndX, shootEndY, 13, 0, Math.PI * 2);
    ctx.arc(rootEndX, rootEndY, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.restore();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  label: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  ctx.save();
  ctx.strokeStyle = '#f8fafc';
  ctx.fillStyle = '#f8fafc';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  const angle = Math.atan2(endY - startY, endX - startX);
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX - 10 * Math.cos(angle - Math.PI / 6), endY - 10 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(endX - 10 * Math.cos(angle + Math.PI / 6), endY - 10 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.font = '700 12px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, (startX + endX) / 2, (startY + endY) / 2 - 9);
  ctx.restore();
}

function drawDirectionArrows(ctx: CanvasRenderingContext2D, stageIndex: number) {
  if (stageIndex < 1) {
    return;
  }

  if (stageIndex < 2) {
    drawArrow(ctx, 'towards light', 395, 158, 530, 158);
    drawArrow(ctx, 'away from light', 290, 365, 205, 365);
    return;
  }

  drawArrow(ctx, 'towards light', 240, 420, 355, 420);
  drawArrow(ctx, 'away from light', 350, 280, 255, 280);
}

function drawApparatusLabels(ctx: CanvasRenderingContext2D, stageIndex: number) {
  drawLabel(ctx, 'cardboard box', 125, 50, 72, 106);
  drawLabel(ctx, 'window', 717, 66, 705, 104);
  drawLabel(ctx, 'conical flask', 190, 430, 250, 395);
  drawLabel(ctx, 'water', 420, 424, 350, stageIndex >= 2 ? 220 : 398);
  drawLabel(ctx, 'wire mesh', 207, 238, 285, stageIndex >= 2 ? 340 : 272);
  drawLabel(ctx, 'germinated bean seeds', 405, 222, 315, stageIndex >= 2 ? 364 : 246);
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
  stageProgress: number,
) {
  drawBackground(ctx);
  drawCardboardBox(ctx, 55, 70, 610, 390);
  drawWindowAndLight(ctx, 630, 95, 150, 185);
  drawFlask(ctx, 315, 305, stageIndex >= 2 ? Math.PI : 0);
  drawSeedsAndGrowth(ctx, stageIndex, clamp(stageProgress));
  drawDirectionArrows(ctx, stageIndex);
  drawApparatusLabels(ctx, stageIndex);
}

export function hasPlantGrowthActivityDemo(
  demoId: string,
): demoId is PlantGrowthActivityId {
  return demoId === 'activity-6-2-phototropism';
}

export default function PlantGrowthActivityDemo({ demoId }: { demoId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<DemoControls | null>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [canvasAvailable, setCanvasAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !hasPlantGrowthActivityDemo(demoId)) {
      setCanvasAvailable(false);
      return;
    }

    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) {
      setCanvasAvailable(false);
      return;
    }

    const ctx: CanvasRenderingContext2D = canvasContext;
    setCanvasAvailable(true);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let frame: number | null = null;
    let currentStageIndex = 0;
    let currentProgress = 0;
    let isPlaying = false;
    let lastTimestamp = 0;
    let mounted = true;

    function syncStage(index: number, progress: number) {
      currentStageIndex = index;
      currentProgress = clamp(progress);

      if (mounted) {
        setStageIndex(currentStageIndex);
      }
    }

    function syncPlaying(nextPlaying: boolean) {
      isPlaying = nextPlaying;

      if (mounted) {
        setPlaying(nextPlaying);
      }
    }

    function cancelScheduledFrame() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }

    function drawCurrentScene() {
      drawScene(ctx, currentStageIndex, currentProgress);
    }

    function scheduleFrame() {
      if (isPlaying && frame === null) {
        frame = window.requestAnimationFrame(loop);
      }
    }

    controlsRef.current = {
      start: () => {
        if (currentStageIndex === STAGES.length - 1 && currentProgress >= 1) {
          return;
        }

        syncPlaying(true);
        lastTimestamp = 0;
        scheduleFrame();
      },
      nextStage: () => {
        cancelScheduledFrame();
        syncPlaying(false);
        lastTimestamp = 0;

        if (currentStageIndex < STAGES.length - 1) {
          syncStage(currentStageIndex + 1, 0);
        }

        drawCurrentScene();
      },
      reset: () => {
        cancelScheduledFrame();
        syncPlaying(false);
        lastTimestamp = 0;
        syncStage(0, 0);
        drawCurrentScene();
      },
    };

    function loop(timestamp: number) {
      frame = null;

      if (!isPlaying) {
        return;
      }

      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      const nextProgress = currentProgress + deltaSeconds * 0.32;

      if (nextProgress >= 1) {
        if (currentStageIndex < STAGES.length - 1) {
          syncStage(currentStageIndex + 1, 0);
        } else {
          syncStage(currentStageIndex, 1);
          syncPlaying(false);
        }
      } else {
        syncStage(currentStageIndex, nextProgress);
      }

      drawCurrentScene();
      scheduleFrame();
    }

    drawCurrentScene();

    return () => {
      mounted = false;
      controlsRef.current = null;
      cancelScheduledFrame();
    };
  }, [demoId]);

  const start = useCallback(() => controlsRef.current?.start(), []);
  const nextStage = useCallback(() => controlsRef.current?.nextStage(), []);
  const reset = useCallback(() => controlsRef.current?.reset(), []);
  const stage = STAGES[stageIndex];

  return (
    <section className="lesson-demo-card chemical-lab-demo">
      <div className="lesson-demo-header">
        <div>
          <p className="eyebrow">Activity 6.2</p>
          <h4>How light changes the direction of plant growth</h4>
          <p>Figure 6.5 experiment: response of the plant to the direction of light</p>
        </div>
        <div className="lesson-demo-actions">
          <button className="button-link lesson-demo-button" disabled={playing || canvasAvailable !== true} onClick={start} type="button">Start activity</button>
          <button className="ghost-link lesson-demo-button" disabled={canvasAvailable !== true} onClick={nextStage} type="button">Next stage</button>
          <button className="ghost-link lesson-demo-button" disabled={canvasAvailable !== true} onClick={reset} type="button">Reset</button>
        </div>
      </div>
      <div className="lesson-demo-progress" aria-label="Activity progress">
        {STAGES.map((item, index) => <span className={index <= stageIndex ? 'active' : ''} key={item.id} />)}
      </div>
      <div className="chemical-lab-canvas-frame" role="img" aria-label={`Activity 6.2, ${stage.title}. ${stage.caption}`}>
        <canvas ref={canvasRef} />
      </div>
      {canvasAvailable === false ? (
        <div className="lesson-demo-caption" role="status">
          <p><strong>Interactive canvas unavailable.</strong> The Activity 6.2 learning sequence remains available below.</p>
          <ol>
            {STAGES.map((item) => <li key={item.id}><strong>{item.title}:</strong> {item.caption}</li>)}
          </ol>
        </div>
      ) : null}
      <p className="lesson-demo-caption"><strong>{stage.title}:</strong> {stage.caption}</p>
    </section>
  );
}
