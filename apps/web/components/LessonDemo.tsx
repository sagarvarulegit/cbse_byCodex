import { hasBalanceWorkbench } from '../lib/chemical-equation-balancing';
import ActivityIllustration, {
  hasActivityIllustration,
} from './ActivityIllustration';
import ChemicalEquationBalancer from './ChemicalEquationBalancer';
import MathFigureDemo, {
  hasMathFigureDemo,
} from './MathFigureDemo';
import StaticFigureDemo, {
  hasStaticFigureDemo,
} from './StaticFigureDemo';
import StepLessonDemo from './StepLessonDemo';

function hasStepLessonDemo(demoId: string) {
  return demoId === 'warmup-17-5' || demoId === 'euclid-hcf-455-42';
}

export default function LessonDemo({ demoId }: { demoId: string }) {
  if (hasActivityIllustration(demoId)) {
    return <ActivityIllustration demoId={demoId} />;
  }

  if (hasBalanceWorkbench(demoId)) {
    return <ChemicalEquationBalancer demoId={demoId} />;
  }

  if (hasMathFigureDemo(demoId)) {
    return <MathFigureDemo demoId={demoId} />;
  }

  if (hasStaticFigureDemo(demoId)) {
    return <StaticFigureDemo demoId={demoId} />;
  }

  if (hasStepLessonDemo(demoId)) {
    return <StepLessonDemo demoId={demoId} />;
  }

  return null;
}
