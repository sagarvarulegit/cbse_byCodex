'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import ActivityIllustration, { hasActivityIllustration } from './ActivityIllustration';

type DemoComponentProps = { demoId: string };

function DemoLoading() {
  return (
    <section aria-busy="true" aria-label="Loading interactive demo" className="lesson-demo-card lesson-demo-loading">
      <p className="eyebrow">Interactive activity</p>
      <div className="route-loading-bar" />
      <p>Preparing this activity...</p>
    </section>
  );
}

const StaticFigureDemo = dynamic<DemoComponentProps>(() => import('./StaticFigureDemo'), {
  loading: DemoLoading,
  ssr: false,
});

function hasStaticFigureDemo(demoId: string) {
  return /^figure-6-[1-4]-/.test(demoId);
}

type DemoStep = {
  caption: string;
  divisor: string;
  dividend: string;
  quotient?: string;
  subtract?: string;
  remainder?: string;
  revealQuotient?: boolean;
  revealSubtract?: boolean;
  revealRemainder?: boolean;
  equation?: string;
};

type DemoData = {
  title: string;
  subtitle: string;
  steps: DemoStep[];
};

const DEMOS: Record<string, DemoData> = {
  'warmup-17-5': {
    title: 'Long-division warm-up',
    subtitle: 'See the familiar school method first. Then map it to the equation form.',
    steps: [
      {
        caption: 'We are dividing 17 by 5. This is the school-style layout most students already know.',
        divisor: '5',
        dividend: '17',
      },
      {
        caption: '5 goes into 17 three times. So the quotient is 3.',
        divisor: '5',
        dividend: '17',
        quotient: '3',
        revealQuotient: true,
      },
      {
        caption: 'Now multiply 5 × 3 = 15 and subtract it from 17.',
        divisor: '5',
        dividend: '17',
        quotient: '3',
        subtract: '15',
        revealQuotient: true,
        revealSubtract: true,
      },
      {
        caption: 'The remainder is 2. Now the same idea can be written as 17 = 5 × 3 + 2.',
        divisor: '5',
        dividend: '17',
        quotient: '3',
        subtract: '15',
        remainder: '2',
        revealQuotient: true,
        revealSubtract: true,
        revealRemainder: true,
        equation: '17 = 5 × 3 + 2',
      },
    ],
  },
  'euclid-hcf-455-42': {
    title: 'Euclid method animation',
    subtitle: 'Notice how the old divisor and the remainder become the next division.',
    steps: [
      {
        caption: 'Step 1: Divide the bigger number 455 by 42.',
        divisor: '42',
        dividend: '455',
        quotient: '10',
        subtract: '420',
        remainder: '35',
        revealQuotient: true,
        revealSubtract: true,
        revealRemainder: true,
        equation: '455 = 42 × 10 + 35',
      },
      {
        caption: 'Remainder is not 0, so divide again. Use old divisor 42 and old remainder 35.',
        divisor: '35',
        dividend: '42',
        quotient: '1',
        subtract: '35',
        remainder: '7',
        revealQuotient: true,
        revealSubtract: true,
        revealRemainder: true,
        equation: '42 = 35 × 1 + 7',
      },
      {
        caption: 'Again remainder is not 0, so divide once more.',
        divisor: '7',
        dividend: '35',
        quotient: '5',
        subtract: '35',
        remainder: '0',
        revealQuotient: true,
        revealSubtract: true,
        revealRemainder: true,
        equation: '35 = 7 × 5 + 0',
      },
      {
        caption: 'Now remainder is 0. Stop here. The last divisor is 7, so HCF = 7.',
        divisor: '7',
        dividend: '35',
        quotient: '5',
        subtract: '35',
        remainder: '0',
        revealQuotient: true,
        revealSubtract: true,
        revealRemainder: true,
        equation: 'Last divisor = 7, so HCF = 7',
      },
    ],
  },
};

function StepLessonDemo({ demoId }: { demoId: string }) {
  const demo = DEMOS[demoId];
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (stepIndex >= demo.steps.length - 1) {
      setPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((value) => Math.min(value + 1, demo.steps.length - 1));
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [demo.steps.length, playing, stepIndex]);

  const step = useMemo(() => demo.steps[stepIndex], [demo.steps, stepIndex]);

  return (
    <section className="lesson-demo-card">
      <div className="lesson-demo-header">
        <div>
          <p className="eyebrow">Animated walkthrough</p>
          <h4>{demo.title}</h4>
          <p>{demo.subtitle}</p>
        </div>
        <div className="lesson-demo-actions">
          <button
            className="button-link lesson-demo-button"
            onClick={() => {
              setStepIndex(0);
              setPlaying(true);
            }}
            type="button"
          >
            Play demo
          </button>
          <button
            className="ghost-link lesson-demo-button"
            onClick={() => {
              setPlaying(false);
              setStepIndex((value) => Math.min(value + 1, demo.steps.length - 1));
            }}
            type="button"
          >
            Next step
          </button>
        </div>
      </div>

      <div className="lesson-demo-progress" aria-label="Demo progress">
        {demo.steps.map((_, index) => (
          <span className={index <= stepIndex ? 'active' : ''} key={`${demoId}-${index}`} />
        ))}
      </div>

      <div className="division-stage">
        <div className="division-topline">
          <span className="division-label">quotient</span>
          <strong>{step.revealQuotient ? step.quotient : '?'}</strong>
        </div>
        <div className="division-workspace">
          <div className="division-side">
            <span className="division-label">divisor</span>
            <strong>{step.divisor}</strong>
          </div>
          <div className="division-bracket-box">
            <div className="division-bar" />
            <div className="division-payload">
              <span className="division-label">dividend</span>
              <strong>{step.dividend}</strong>
              {step.revealSubtract ? <span className="division-subtract">− {step.subtract}</span> : null}
              {step.revealSubtract ? <span className="division-line" /> : null}
              {step.revealRemainder ? (
                <span className="division-remainder">
                  remainder = <strong>{step.remainder}</strong>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <p className="lesson-demo-caption">{step.caption}</p>
      {step.equation ? <pre className="formula-block demo-formula"><code>{step.equation}</code></pre> : null}
    </section>
  );
}

export default function LessonDemo({ demoId }: { demoId: string }) {
  if (hasActivityIllustration(demoId)) {
    return <ActivityIllustration demoId={demoId} />;
  }

  if (hasStaticFigureDemo(demoId)) {
    return <StaticFigureDemo demoId={demoId} />;
  }

  return <StepLessonDemo demoId={demoId} />;
}
