import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import type { TodayPlan } from '../../lib/dashboard-home';
import styles from './dashboard-calm.module.css';

/**
 * The single most important card on the dashboard: one chapter, three small
 * steps and ONE button. The button always points at the first unfinished step,
 * so the student never has to decide what to click.
 */
export default function TodayPlanCard({ plan }: { plan: TodayPlan }) {
  const doneCount = plan.steps.filter((s) => s.done).length;

  return (
    <section className={styles.planCard} aria-label="Today's plan">
      <p className={styles.planEyebrow}>
        Today&apos;s plan <span aria-hidden="true">·</span> {plan.eyebrow}
      </p>

      <p className={styles.planSubject}>{plan.subjectName}</p>
      <h2 className={styles.planTitle}>{plan.chapterTitle}</h2>
      {plan.note ? <p className={styles.planNote}>{plan.note}</p> : null}

      <ol className={styles.planSteps} aria-label={`${doneCount} of 3 steps done`}>
        {plan.steps.map((step, index) => (
          <li key={step.label} className={step.done ? styles.planStepDone : styles.planStep}>
            <span className={styles.planStepDot} aria-hidden="true">
              {step.done ? <Check size={14} strokeWidth={3} /> : index + 1}
            </span>
            <span>
              {step.label}
              {step.done ? <span className="sr-only"> (done)</span> : null}
            </span>
          </li>
        ))}
      </ol>

      <div className={styles.planActions}>
        <Link className={styles.planCta} href={plan.cta.href}>
          <span>{plan.cta.label}</span>
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
        <Link className={styles.planChange} href={plan.changeHref}>
          Choose another chapter
        </Link>
      </div>
    </section>
  );
}
