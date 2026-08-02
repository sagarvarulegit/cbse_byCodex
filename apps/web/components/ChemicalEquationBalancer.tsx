'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  countAtoms,
  getBalanceWorkbench,
  isBalanced,
  isSmallestWholeNumberRatio,
  type BalanceCompound,
} from '../lib/chemical-equation-balancing';
import {
  buildPracticeRetention,
  type PracticeRetentionSummary,
} from '../lib/practice-retention';
import { getPracticeRemediation } from '../lib/chapter-practice';

type CompletedEquation = {
  id: string;
  independent: boolean;
};

type LocalWorkbenchAttempt = {
  attemptNumber: number;
  clientAttemptId: string;
  maxScoreHalfMarks: number;
  retentionEligible?: boolean;
  savedAt: string;
  scoreHalfMarks: number;
};

function createClientAttemptId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localStorageKey(practiceItemId: string) {
  return `cbse-equation-workbench:${practiceItemId}`;
}

function readLocalAttempts(practiceItemId: string): LocalWorkbenchAttempt[] {
  try {
    const value = window.localStorage.getItem(localStorageKey(practiceItemId));
    const attempts = value ? JSON.parse(value) : [];
    return Array.isArray(attempts)
      ? attempts
          .filter(
            (attempt) =>
              attempt &&
              Number.isInteger(attempt.attemptNumber) &&
              typeof attempt.savedAt === 'string',
          )
          .map((attempt) => ({
            ...attempt,
            clientAttemptId:
              typeof attempt.clientAttemptId === 'string'
                ? attempt.clientAttemptId
                : `legacy-${attempt.attemptNumber}-${Date.parse(attempt.savedAt) || 0}`,
          }))
          .slice(-20)
      : [];
  } catch {
    return [];
  }
}

function mergeAttemptHistories(
  localAttempts: LocalWorkbenchAttempt[],
  accountAttempts: LocalWorkbenchAttempt[],
) {
  const attemptsByClientId = new Map<string, LocalWorkbenchAttempt>();
  for (const attempt of [...localAttempts, ...accountAttempts]) {
    attemptsByClientId.set(attempt.clientAttemptId, attempt);
  }
  return Array.from(attemptsByClientId.values())
    .sort((left, right) => left.attemptNumber - right.attemptNumber)
    .slice(-20);
}

function emptyCoefficients(compoundCount: number) {
  return Array.from({ length: compoundCount }, () => '1');
}

function numericCoefficients(values: string[]) {
  return values.map((value) => {
    const coefficient = Number(value);
    return Number.isInteger(coefficient) && coefficient > 0 ? coefficient : 0;
  });
}

function retentionText(retention: PracticeRetentionSummary) {
  const nextCheckpoint = retention.checkpoints.find(
    (checkpoint) => checkpoint.status !== 'complete',
  );
  if (!nextCheckpoint) {
    return 'D0, D3 and D7 are complete with separate mastery attempts.';
  }
  if (nextCheckpoint.status === 'locked') {
    return 'Complete all four equations without hints to start D0 retention.';
  }
  if (nextCheckpoint.status === 'due') {
    return `${nextCheckpoint.checkpoint} is due now. Start a fresh attempt.`;
  }

  return `${nextCheckpoint.checkpoint} is scheduled. A fresh attempt will count only on or after its due date.`;
}

function CompoundInput({
  coefficient,
  compound,
  disabled,
  onChange,
  side,
}: {
  coefficient: string;
  compound: BalanceCompound;
  disabled: boolean;
  onChange: (value: string) => void;
  side: 'product' | 'reactant';
}) {
  return (
    <label className="balancer-compound">
      <span className="sr-only">
        Coefficient for {side} {compound.name}
      </span>
      <input
        aria-label={`Coefficient for ${side} ${compound.name}`}
        disabled={disabled}
        inputMode="numeric"
        max={20}
        min={1}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 2))}
        pattern="[0-9]*"
        type="text"
        value={coefficient}
      />
      <code>{compound.formula}</code>
    </label>
  );
}

export default function ChemicalEquationBalancer({
  demoId,
}: {
  demoId: string;
}) {
  const workbench = getBalanceWorkbench(demoId);
  const [equationIndex, setEquationIndex] = useState(0);
  const [coefficients, setCoefficients] = useState<string[]>([]);
  const [completedEquations, setCompletedEquations] = useState<CompletedEquation[]>([]);
  const [currentPassed, setCurrentPassed] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintedEquationIds, setHintedEquationIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [localAttempts, setLocalAttempts] = useState<LocalWorkbenchAttempt[]>([]);
  const [accountRetention, setAccountRetention] =
    useState<PracticeRetentionSummary | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'local'>(
    'idle',
  );

  const equation = workbench?.equations[equationIndex] ?? null;
  const totalCompoundCount = equation
    ? equation.reactants.length + equation.products.length
    : 0;

  useEffect(() => {
    if (!workbench) {
      return;
    }
    setCoefficients(emptyCoefficients(workbench.equations[0].reactants.length + workbench.equations[0].products.length));
    const savedAttempts = readLocalAttempts(workbench.practiceItemId);
    setLocalAttempts(savedAttempts);

    const params = new URLSearchParams({
      chapterSlug: workbench.chapterSlug,
      practiceItemId: workbench.practiceItemId,
    });
    fetch(`/api/progress/practice?${params.toString()}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (Array.isArray(payload?.attempts)) {
          const accountAttempts: LocalWorkbenchAttempt[] = payload.attempts.map(
            (attempt: LocalWorkbenchAttempt) => ({
              ...attempt,
              retentionEligible: attempt.retentionEligible !== false,
            }),
          );
          const merged = mergeAttemptHistories(savedAttempts, accountAttempts);
          window.localStorage.setItem(
            localStorageKey(workbench.practiceItemId),
            JSON.stringify(merged),
          );
          setLocalAttempts(merged);
        }
        if (payload?.retention) {
          setAccountRetention(payload.retention);
        }
      })
      .catch(() => undefined);
  }, [workbench]);

  const values = useMemo(
    () => numericCoefficients(coefficients),
    [coefficients],
  );
  const reactantValues = equation
    ? values.slice(0, equation.reactants.length)
    : [];
  const productValues = equation
    ? values.slice(equation.reactants.length)
    : [];
  const reactantCounts = equation
    ? countAtoms(equation.reactants, reactantValues)
    : {};
  const productCounts = equation
    ? countAtoms(equation.products, productValues)
    : {};
  const localRetention = buildPracticeRetention(localAttempts);
  const retention = accountRetention ?? localRetention;

  if (!workbench || !equation) {
    return null;
  }

  function updateCoefficient(index: number, value: string) {
    setCoefficients((current) =>
      current.map((coefficient, coefficientIndex) =>
        coefficientIndex === index ? value : coefficient,
      ),
    );
    setMessage('');
  }

  function checkEquation() {
    if (values.some((value) => value <= 0)) {
      setMessage('Every coefficient must be a positive whole number.');
      return;
    }
    if (!isBalanced(equation, values)) {
      const mismatched = equation.elementOrder.filter(
        (element) => reactantCounts[element] !== productCounts[element],
      );
      setMessage(`Not balanced yet. Recheck ${mismatched.join(', ')}.`);
      return;
    }
    if (!isSmallestWholeNumberRatio(values)) {
      setMessage('Atom counts match, but reduce the coefficients to the smallest whole-number ratio.');
      return;
    }

    const independent =
      hintLevel === 0 && !hintedEquationIds.includes(equation.id);
    setCurrentPassed(true);
    setCompletedEquations((current) => [
      ...current.filter((completed) => completed.id !== equation.id),
      { id: equation.id, independent },
    ]);
    setMessage(
      independent
        ? 'Balanced independently in the smallest whole-number ratio.'
        : 'Balanced with help. Finish the set, then retry without hints for mastery.',
    );
  }

  function resetEquation() {
    setCoefficients(emptyCoefficients(totalCompoundCount));
    setCurrentPassed(false);
    setMessage(
      hintLevel > 0
        ? 'Coefficients reset. This equation remains a guided attempt because a hint was already opened.'
        : 'Equation reset. Only the coefficients changed.',
    );
  }

  function moveToNextEquation() {
    const nextIndex = equationIndex + 1;
    setEquationIndex(nextIndex);
    const nextEquation = workbench.equations[nextIndex];
    setCoefficients(
      emptyCoefficients(nextEquation.reactants.length + nextEquation.products.length),
    );
    setCurrentPassed(false);
    setHintLevel(0);
    setMessage('');
  }

  async function saveCompletedWorkbench() {
    const independentIds = completedEquations
      .filter((completed) => completed.independent)
      .map((completed) => completed.id);
    const maxScoreHalfMarks = workbench.equations.length * 2;
    const scoreHalfMarks = independentIds.length * 2;
    const clientAttemptId = createClientAttemptId();
    const localAttempt: LocalWorkbenchAttempt = {
      attemptNumber:
        Math.max(0, ...localAttempts.map((attempt) => attempt.attemptNumber)) + 1,
      clientAttemptId,
      maxScoreHalfMarks,
      retentionEligible: true,
      savedAt: new Date().toISOString(),
      scoreHalfMarks,
    };
    const nextLocalAttempts = [...localAttempts, localAttempt].slice(-20);
    window.localStorage.setItem(
      localStorageKey(workbench.practiceItemId),
      JSON.stringify(nextLocalAttempts),
    );
    setLocalAttempts(nextLocalAttempts);
    setAccountRetention(null);
    setSaveState('saving');

    try {
      const response = await fetch('/api/progress/practice', {
        body: JSON.stringify({
          answerLength: 0,
          chapterSlug: workbench.chapterSlug,
          clientAttemptId,
          earnedRubricPointIds: independentIds,
          lessonSlug: workbench.lessonSlug,
          maxScoreHalfMarks,
          practiceKind: 'workbench',
          practiceItemId: workbench.practiceItemId,
          scoreHalfMarks,
          weakSkillSlugs:
            scoreHalfMarks === maxScoreHalfMarks ? [] : ['balancing'],
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.attempt) {
        const syncedAttempt: LocalWorkbenchAttempt = {
          ...localAttempt,
          ...payload.attempt,
          savedAt: payload.attempt.createdAt,
        };
        const syncedAttempts = nextLocalAttempts.map((attempt) =>
          attempt.clientAttemptId === clientAttemptId
            ? syncedAttempt
            : attempt,
        );
        window.localStorage.setItem(
          localStorageKey(workbench.practiceItemId),
          JSON.stringify(syncedAttempts),
        );
        setLocalAttempts(syncedAttempts);
        setSaveState('saved');
      } else {
        setSaveState('local');
      }
      if (payload?.retention) {
        setAccountRetention(payload.retention);
      }
    } catch {
      setSaveState('local');
    }
  }

  function startFreshAttempt() {
    setEquationIndex(0);
    setCoefficients(
      emptyCoefficients(
        workbench.equations[0].reactants.length +
          workbench.equations[0].products.length,
      ),
    );
    setCompletedEquations([]);
    setCurrentPassed(false);
    setHintLevel(0);
    setHintedEquationIds([]);
    setMessage('');
    setSaveState('idle');
  }

  const workbenchFinished =
    equationIndex === workbench.equations.length - 1 && currentPassed;
  const masteryCount = completedEquations.filter(
    (completed) => completed.independent,
  ).length;
  const balancingRemediation = getPracticeRemediation(
    workbench.chapterSlug,
    'balancing',
  );

  return (
    <section aria-labelledby={`${demoId}-title`} className="balancer-workbench">
      <header className="balancer-header">
        <div>
          <p className="eyebrow">Interactive practice</p>
          <h4 id={`${demoId}-title`}>{workbench.title}</h4>
          <p>{workbench.subtitle}</p>
        </div>
        <strong>
          Equation {equationIndex + 1}/{workbench.equations.length}
        </strong>
      </header>

      <div className="balancer-source">{equation.sourceAnchor}</div>

      <div aria-label="Equation coefficients" className="balancer-equation">
        <div className="balancer-side">
          {equation.reactants.map((currentCompound, index) => (
            <div className="balancer-term" key={currentCompound.formula}>
              {index > 0 ? <span aria-hidden="true">+</span> : null}
              <CompoundInput
                coefficient={coefficients[index] ?? ''}
                compound={currentCompound}
                disabled={currentPassed}
                onChange={(value) => updateCoefficient(index, value)}
                side="reactant"
              />
            </div>
          ))}
        </div>
        <span aria-label="yields" className="balancer-arrow" role="img">
          →
        </span>
        <div className="balancer-side">
          {equation.products.map((currentCompound, index) => {
            const coefficientIndex = equation.reactants.length + index;
            return (
              <div className="balancer-term" key={currentCompound.formula}>
                {index > 0 ? <span aria-hidden="true">+</span> : null}
                <CompoundInput
                  coefficient={coefficients[coefficientIndex] ?? ''}
                  compound={currentCompound}
                  disabled={currentPassed}
                  onChange={(value) => updateCoefficient(coefficientIndex, value)}
                  side="product"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="balancer-count-table">
        <table>
          <caption>Live atom count</caption>
          <thead>
            <tr>
              <th scope="col">Element</th>
              <th scope="col">Reactants</th>
              <th scope="col">Products</th>
              <th scope="col">Check</th>
            </tr>
          </thead>
          <tbody>
            {equation.elementOrder.map((element) => {
              const matches = reactantCounts[element] === productCounts[element];
              return (
                <tr key={element}>
                  <th scope="row">{element}</th>
                  <td>{reactantCounts[element] ?? 0}</td>
                  <td>{productCounts[element] ?? 0}</td>
                  <td>{matches ? 'Matches' : 'Recheck'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="balancer-actions">
        <button className="button-link" disabled={currentPassed} onClick={checkEquation} type="button">
          Check equation
        </button>
        <button
          className="ghost-link"
          disabled={currentPassed || hintLevel >= equation.hints.length}
          onClick={() => {
            setHintLevel((current) =>
              Math.min(current + 1, equation.hints.length),
            );
            setHintedEquationIds((current) =>
              current.includes(equation.id)
                ? current
                : [...current, equation.id],
            );
          }}
          type="button"
        >
          {hintLevel === 0 ? 'Show hint 1' : `Show hint ${Math.min(hintLevel + 1, 3)}`}
        </button>
        <button className="ghost-link" onClick={resetEquation} type="button">
          Reset
        </button>
      </div>

      {hintLevel > 0 ? (
        <ol className="balancer-hints">
          {equation.hints.slice(0, hintLevel).map((hint, index) => (
            <li key={hint}>
              <strong>Hint {index + 1}:</strong> {hint}
            </li>
          ))}
        </ol>
      ) : null}

      <p aria-live="polite" className="balancer-status">
        {message}
      </p>

      {currentPassed && !workbenchFinished ? (
        <button className="button-link" onClick={moveToNextEquation} type="button">
          Next equation
        </button>
      ) : null}

      {workbenchFinished && saveState === 'idle' ? (
        <div className="balancer-completion">
          <strong>
            Independent mastery: {masteryCount}/{workbench.equations.length}
          </strong>
          <p>
            D0 starts only when all four are completed without hints. Guided
            completion is still useful practice, but it is not labelled mastery.
          </p>
          <button className="button-link" onClick={saveCompletedWorkbench} type="button">
            Save this workbench attempt
          </button>
        </div>
      ) : null}

      {saveState !== 'idle' ? (
        <div className="balancer-completion">
          <strong>{retentionText(retention)}</strong>
          <span>
            {saveState === 'saving'
              ? 'Saving structured results…'
              : saveState === 'saved'
                ? 'Saved to your account.'
                : 'Saved on this device. Sign in to sync across devices.'}
          </span>
          {masteryCount < workbench.equations.length && balancingRemediation ? (
            <p>
              First repair:{' '}
              <Link href={balancingRemediation.href}>
                {balancingRemediation.label}
              </Link>
            </p>
          ) : null}
          <button className="ghost-link" onClick={startFreshAttempt} type="button">
            Start a fresh workbench attempt
          </button>
        </div>
      ) : null}
    </section>
  );
}
