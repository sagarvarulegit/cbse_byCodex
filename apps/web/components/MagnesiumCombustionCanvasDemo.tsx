'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'idle' | 'approaching' | 'burning' | 'finished';

type DemoControls = {
  reset: () => void;
  start: () => void;
};

const WIDTH = 800;
const HEIGHT = 600;
const CHEMICAL_EQUATION = '2Mg(s) + O2(g) -> 2MgO(s)';

const statusText: Record<Phase, string> = {
  idle: 'System ready. Click start.',
  approaching: 'Moving magnesium ribbon into the flame...',
  burning: 'Combustion: dazzling white flame and MgO ash.',
  finished: 'Reaction complete. White MgO ash collected.',
};

export default function MagnesiumCombustionCanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<DemoControls | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) {
      return;
    }

    const ctx: CanvasRenderingContext2D = canvasContext;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const states = {
      idle: 'idle',
      approaching: 'approaching',
      burning: 'burning',
      finished: 'finished',
    } as const;

    const burnerX = 300;
    const burnerTopY = 400;
    const bowlX = 300;
    const bowlY = 550;
    const ignitionX = burnerX;
    const ignitionY = burnerTopY - 40;
    const ribbonLength = 150;
    const tipWaveOffset = Math.sin(15) * 15;

    let currentPhase: Phase = states.idle;
    let animationFrame = 0;
    let animationTime = 0;
    let lastTimestamp = 0;
    let ribbonX = 600;
    let ribbonY = 200;
    let ribbonBurned = 0;
    let ashMoundSize = 0;
    let sparks: Particle[] = [];
    let ashParticles: Particle[] = [];
    let isMounted = true;

    class Particle {
      active = true;
      life = 1;
      rotation = Math.random() * Math.PI;
      size: number;
      vx: number;
      vy: number;

      constructor(
        public x: number,
        public y: number,
        public kind: 'spark' | 'ash',
      ) {
        if (kind === 'spark') {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 1.5;
          this.vx = Math.cos(angle) * speed;
          this.vy = Math.sin(angle) * speed;
          this.size = Math.random() * 2.4 + 1.4;
        } else {
          this.vx = (Math.random() - 0.5) * 0.75;
          this.vy = Math.random() * 2.1 + 1.2;
          this.size = Math.random() * 3 + 2.2;
        }
      }

      update(delta: number) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;

        if (this.kind === 'spark') {
          this.vx *= 0.96;
          this.vy = this.vy * 0.96 + 0.04 * delta;
          this.life -= 0.018 * delta;
          this.active = this.life > 0;
          return;
        }

        this.vy += 0.08 * delta;
        this.vx *= 0.985;
        this.rotation += 0.05 * delta;

        if (this.y >= bowlY - 16 && this.x > bowlX - 62 && this.x < bowlX + 62) {
          this.active = false;
          ashMoundSize = Math.min(62, ashMoundSize + 0.55);
        } else if (this.y > HEIGHT) {
          this.active = false;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = Math.max(0, this.life);

        if (this.kind === 'spark') {
          context.fillStyle = '#fff7ad';
          context.beginPath();
          context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          context.fill();
        } else {
          context.translate(this.x, this.y);
          context.rotate(this.rotation);
          context.fillStyle = '#f8fafc';
          context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        context.restore();
      }
    }

    function syncPhase(nextPhase: Phase) {
      if (currentPhase === nextPhase) {
        return;
      }

      currentPhase = nextPhase;

      if (isMounted) {
        setPhase(nextPhase);
      }
    }

    function resetExperiment() {
      ribbonX = 600;
      ribbonY = 200;
      ribbonBurned = 0;
      ashMoundSize = 0;
      sparks = [];
      ashParticles = [];
      syncPhase(states.idle);
    }

    function getTipPosition() {
      const currentLength = Math.max(0, ribbonLength - ribbonBurned);

      return {
        x: ribbonX - currentLength,
        y: ribbonY + currentLength * 0.3 + tipWaveOffset,
      };
    }

    function drawBackground() {
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, '#17243a');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = '#203049';
      ctx.fillRect(0, 520, WIDTH, 80);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 520, WIDTH, 4);
    }

    function drawBurner(time: number) {
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(burnerX - 40, HEIGHT);
      ctx.lineTo(burnerX + 40, HEIGHT);
      ctx.lineTo(burnerX + 30, burnerTopY + 120);
      ctx.lineTo(burnerX - 30, burnerTopY + 120);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(burnerX - 12, burnerTopY, 24, 120);

      ctx.fillStyle = '#b45309';
      ctx.fillRect(burnerX - 20, burnerTopY + 100, 40, 10);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const flameFlicker = Math.sin(time * 10) * 5;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.42)';
      ctx.beginPath();
      ctx.moveTo(burnerX - 10, burnerTopY);
      ctx.quadraticCurveTo(burnerX - 15, burnerTopY - 40, burnerX + flameFlicker, burnerTopY - 80);
      ctx.quadraticCurveTo(burnerX + 15, burnerTopY - 40, burnerX + 10, burnerTopY);
      ctx.fill();

      ctx.fillStyle = 'rgba(147, 197, 253, 0.82)';
      ctx.beginPath();
      ctx.moveTo(burnerX - 6, burnerTopY);
      ctx.quadraticCurveTo(burnerX - 8, burnerTopY - 20, burnerX, burnerTopY - 35 + flameFlicker * 0.3);
      ctx.quadraticCurveTo(burnerX + 8, burnerTopY - 20, burnerX + 6, burnerTopY);
      ctx.fill();

      ctx.restore();
    }

    function drawBowl() {
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(bowlX - 64, bowlY - 15);
      ctx.lineTo(bowlX + 64, bowlY - 15);
      ctx.bezierCurveTo(bowlX + 50, bowlY + 42, bowlX - 50, bowlY + 42, bowlX - 64, bowlY - 15);
      ctx.fill();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (ashMoundSize <= 0) {
        return;
      }

      const width = Math.min(104, ashMoundSize * 2.4);
      const height = Math.min(30, ashMoundSize * 0.8);
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(bowlX, bowlY - 15, width / 2, height, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#cbd5e1';
      const speckleCount = Math.min(18, Math.floor(ashMoundSize / 2));

      for (let i = 0; i < speckleCount; i += 1) {
        const x = bowlX - width / 2 + ((i * 23) % Math.max(width, 1));
        const y = bowlY - 16 - height / 2 + ((i * 11) % Math.max(height, 1));
        ctx.fillRect(x, y, 2, 2);
      }
    }

    function drawTongsAndRibbon() {
      const currentLength = Math.max(0, ribbonLength - ribbonBurned);

      ctx.save();
      ctx.translate(ribbonX, ribbonY);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(200, -100);
      ctx.lineTo(0, 0);
      ctx.lineTo(200, -80);
      ctx.stroke();

      if (currentLength > 0) {
        const segments = 10;
        const segLen = currentLength / segments;

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);

        for (let i = 1; i <= segments; i += 1) {
          const wave = Math.sin(i * 1.5) * 15;
          ctx.lineTo(-i * segLen, i * (segLen * 0.3) + wave);
        }

        ctx.stroke();

        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -2);

        for (let i = 1; i <= segments; i += 1) {
          const wave = Math.sin(i * 1.5) * 15;
          ctx.lineTo(-i * segLen, i * (segLen * 0.3) + wave - 2);
        }

        ctx.stroke();
      }

      ctx.restore();
    }

    function drawDazzlingGlow() {
      if (currentPhase !== states.burning && currentPhase !== states.finished) {
        return;
      }

      const tip = getTipPosition();
      const flicker = Math.random() * 0.18 + 0.82;
      const radius = currentPhase === states.finished ? 96 * flicker : 245 * flicker;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const glow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, radius);
      glow.addColorStop(0, 'rgba(255, 255, 255, 1)');
      glow.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
      glow.addColorStop(0.52, 'rgba(253, 224, 71, 0.35)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, radius, 0, Math.PI * 2);
      ctx.fill();

      const uvGlow = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, radius * 1.45);
      uvGlow.addColorStop(0, 'rgba(255, 255, 255, 0)');
      uvGlow.addColorStop(0.32, 'rgba(224, 231, 255, 0.1)');
      uvGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = uvGlow;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, radius * 1.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawLabel(text: string, labelX: number, labelY: number, targetX: number, targetY: number) {
      ctx.save();
      ctx.font = '700 14px Arial, Helvetica, sans-serif';
      const textWidth = ctx.measureText(text).width;
      const paddingX = 9;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 25;

      ctx.strokeStyle = 'rgba(191, 219, 254, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(labelX + boxWidth / 2, labelY + boxHeight);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.68)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(labelX, labelY, boxWidth, boxHeight, 7);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.fillText(text, labelX + paddingX, labelY + 17);
      ctx.restore();
    }

    function drawApparatusLabels() {
      const tip = getTipPosition();
      const currentLength = Math.max(0, ribbonLength - ribbonBurned);

      drawLabel('Burner', 206, 430, burnerX, burnerTopY + 68);
      drawLabel('Flame', 330, 322, burnerX, burnerTopY - 58);
      drawLabel('Tongs', 608, 142, ribbonX + 138, ribbonY - 92);

      if (currentLength > 0) {
        drawLabel('Magnesium ribbon', 468, 256, tip.x + 20, tip.y);
      }

      drawLabel('Watch glass', 392, 536, bowlX + 52, bowlY - 14);

      if (ashMoundSize > 0 || currentPhase === states.burning || currentPhase === states.finished) {
        drawLabel('Magnesium oxide ash', 394, 470, bowlX, bowlY - 28);
      }
    }

    function update(deltaSeconds: number) {
      const delta = Math.min(deltaSeconds * 60, 2.4);
      animationTime += deltaSeconds;

      if (currentPhase === states.approaching) {
        const targetX = ignitionX + ribbonLength;
        const targetY = ignitionY - ribbonLength * 0.3 - tipWaveOffset;
        const dx = targetX - ribbonX;
        const dy = targetY - ribbonY;

        ribbonX += dx * 0.05 * delta;
        ribbonY += dy * 0.05 * delta;

        if (Math.abs(dx) < 2.5 && Math.abs(dy) < 2.5) {
          syncPhase(states.burning);
        }
      } else if (currentPhase === states.burning) {
        ribbonBurned = Math.min(ribbonLength, ribbonBurned + 0.38 * delta);

        const tip = getTipPosition();

        for (let i = 0; i < 3; i += 1) {
          sparks.push(new Particle(tip.x, tip.y, 'spark'));
        }

        if (Math.random() < 0.38) {
          ashParticles.push(new Particle(tip.x, tip.y, 'ash'));
        }

        if (ribbonBurned >= ribbonLength) {
          syncPhase(states.finished);
        }
      }

      sparks.forEach((particle) => particle.update(delta));
      sparks = sparks.filter((particle) => particle.active).slice(-95);

      ashParticles.forEach((particle) => particle.update(delta));
      ashParticles = ashParticles.filter((particle) => particle.active).slice(-80);
    }

    function drawStatus() {
      ctx.fillStyle = 'rgba(248, 250, 252, 0.78)';
      ctx.font = '16px Consolas, "Courier New", monospace';
      ctx.fillText(statusText[currentPhase], 20, 30);
    }

    function draw() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      drawBackground();
      drawBurner(animationTime);
      drawBowl();
      drawTongsAndRibbon();
      drawDazzlingGlow();
      sparks.forEach((particle) => particle.draw(ctx));
      ashParticles.forEach((particle) => particle.draw(ctx));
      drawApparatusLabels();
      drawStatus();
    }

    function gameLoop(timestamp: number) {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      update(deltaSeconds);
      draw();

      animationFrame = window.requestAnimationFrame(gameLoop);
    }

    controlsRef.current = {
      reset: resetExperiment,
      start: () => {
        if (currentPhase === states.idle || currentPhase === states.finished) {
          if (currentPhase === states.finished) {
            resetExperiment();
          }

          syncPhase(states.approaching);
        }
      },
    };

    resetExperiment();
    animationFrame = window.requestAnimationFrame(gameLoop);

    return () => {
      isMounted = false;
      controlsRef.current = null;
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const startExperiment = useCallback(() => {
    controlsRef.current?.start();
  }, []);

  const resetExperiment = useCallback(() => {
    controlsRef.current?.reset();
  }, []);

  const isRunning = phase === 'approaching' || phase === 'burning';

  return (
    <section className="lesson-demo-card magnesium-combustion-demo">
      <div className="lesson-demo-header">
        <div>
          <p className="eyebrow">Activity 1.1</p>
          <h4>Burning magnesium ribbon in air</h4>
          <p>Heat the ribbon, observe the dazzling white flame, and collect white magnesium oxide ash.</p>
        </div>
        <div className="lesson-demo-actions">
          <button className="button-link lesson-demo-button" disabled={isRunning} onClick={startExperiment} type="button">
            Start experiment
          </button>
          <button className="ghost-link lesson-demo-button" onClick={resetExperiment} type="button">
            Reset
          </button>
        </div>
      </div>

      <div className="magnesium-demo-equation" aria-label={CHEMICAL_EQUATION}>
        <strong>2Mg(s)</strong>
        <span>+</span>
        <strong>
          O<sub>2</sub>(g)
        </strong>
        <span>-&gt;</span>
        <strong>2MgO(s)</strong>
      </div>

      <div className="magnesium-canvas-frame" role="img" aria-label="Animated Activity 1.1 showing magnesium ribbon burning in a flame and producing white magnesium oxide ash.">
        <canvas ref={canvasRef} />
      </div>

      <p className="lesson-demo-caption">{statusText[phase]}</p>
    </section>
  );
}
