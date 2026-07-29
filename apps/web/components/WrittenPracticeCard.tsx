'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  getPracticeMaxHalfMarks,
  getPracticeRemediation,
  getPracticeSkillLabel,
  type PracticeSkillSlug,
  type WrittenPracticeDefinition,
} from '../lib/chapter-practice';
import {
  buildPracticeRetention,
  type PracticeRetentionCheckpoint,
  type PracticeRetentionSummary,
} from '../lib/practice-retention';

type SavedPracticeAttempt = {
  answerLength: number;
  attemptNumber: number;
  clientAttemptId: string;
  earnedRubricPointIds: string[];
  maxScoreHalfMarks: number;
  savedAt: string;
  scoreHalfMarks: number;
  synced: boolean;
  weakSkillSlugs: PracticeSkillSlug[];
};

type PracticePhase = 'writing' | 'self-marking' | 'saved';

function formatHalfMarks(halfMarks: number) {
  const marks = halfMarks / 2;
  return Number.isInteger(marks) ? String(marks) : marks.toFixed(1);
}

function localStorageKey(itemId: string) {
  return `cbse-written-practice:${itemId}`;
}

function readLocalAttempts(itemId: string): SavedPracticeAttempt[] {
  try {
    const raw = window.localStorage.getItem(localStorageKey(itemId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(-20) : [];
  } catch {
    return [];
  }
}

function createClientAttemptId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mergeAttemptHistories(
  localAttempts: SavedPracticeAttempt[],
  accountAttempts: SavedPracticeAttempt[],
) {
  const attemptsByClientId = new Map<string, SavedPracticeAttempt>();
  for (const attempt of [...localAttempts, ...accountAttempts]) {
    attemptsByClientId.set(attempt.clientAttemptId, attempt);
  }

  return Array.from(attemptsByClientId.values())
    .sort((left, right) => left.attemptNumber - right.attemptNumber)
    .slice(-20);
}

function formatRetentionCheckpoint(checkpoint: PracticeRetentionCheckpoint) {
  if (checkpoint.status === 'complete') {
    return `Completed by attempt ${checkpoint.completedByAttemptNumber}`;
  }
  if (checkpoint.status === 'locked') {
    return 'Score at least 80% to unlock';
  }
  if (checkpoint.status === 'due') {
    return 'Due now — make a fresh attempt';
  }
  if (!checkpoint.dueAt) {
    return 'Not scheduled';
  }

  return `Due ${new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(checkpoint.dueAt))}`;
}

export default function WrittenPracticeCard({
  definition,
}: {
  definition: WrittenPracticeDefinition;
}) {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState<SavedPracticeAttempt[]>([]);
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<PracticePhase>('writing');
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'saved' | 'local'>(
    'idle',
  );
  const [accountRetention, setAccountRetention] =
    useState<PracticeRetentionSummary | null>(null);
  const [accountHistoryState, setAccountHistoryState] = useState<
    'idle' | 'loaded' | 'loading' | 'unavailable'
  >('idle');
  const maxHalfMarks = getPracticeMaxHalfMarks(definition);
  const attemptNumber =
    Math.max(0, ...attempts.map((attempt) => attempt.attemptNumber)) + 1;

  useEffect(() => {
    const localAttempts = readLocalAttempts(definition.id);
    setAttempts(localAttempts);
    setAccountRetention(null);
    setAccountHistoryState('idle');
  }, [definition.id]);

  async function loadAccountHistory() {
    setAccountHistoryState('loading');
    const params = new URLSearchParams({
      chapterSlug: definition.chapterSlug,
      practiceItemId: definition.id,
    });
    try {
      const response = await fetch(
        `/api/progress/practice?${params.toString()}`,
      );
      const payload = (await response.json().catch(() => null)) as {
        attempts?: SavedPracticeAttempt[];
        retention?: PracticeRetentionSummary;
      } | null;
      if (!response.ok || !Array.isArray(payload?.attempts)) {
        setAccountHistoryState('unavailable');
        return;
      }

      const accountAttempts = payload.attempts.map((attempt) => ({
        ...attempt,
        synced: true,
      }));
      const merged = mergeAttemptHistories(
        readLocalAttempts(definition.id),
        accountAttempts,
      );
      window.localStorage.setItem(
        localStorageKey(definition.id),
        JSON.stringify(merged),
      );
      setAttempts(merged);
      setAccountRetention(payload.retention ?? null);
      setAccountHistoryState('loaded');
    } catch {
      setAccountHistoryState('unavailable');
    }
  }

  const selectedPoints = useMemo(
    () =>
      definition.rubricPoints.filter((point) =>
        selectedPointIds.includes(point.id),
      ),
    [definition.rubricPoints, selectedPointIds],
  );
  const scoreHalfMarks = selectedPoints.reduce(
    (total, point) => total + point.halfMarks,
    0,
  );
  const weakSkillSlugs = useMemo(
    () =>
      Array.from(
        new Set(
          definition.rubricPoints
            .filter((point) => !selectedPointIds.includes(point.id))
            .map((point) => point.skillSlug),
        ),
      ),
    [definition.rubricPoints, selectedPointIds],
  );
  const retention =
    accountRetention ??
    buildPracticeRetention(
      attempts.map((attempt) => ({
        attemptNumber: attempt.attemptNumber,
        maxScoreHalfMarks: attempt.maxScoreHalfMarks,
        savedAt: attempt.savedAt,
        scoreHalfMarks: attempt.scoreHalfMarks,
      })),
    );

  function revealRubric() {
    if (answer.trim().length < definition.minimumCharacters) {
      setMessage(
        `Write at least ${definition.minimumCharacters} characters so this is a genuine attempt.`,
      );
      return;
    }

    setMessage(
      'Now tick only the points that are clearly present in your written answer.',
    );
    setPhase('self-marking');
  }

  function togglePoint(pointId: string) {
    if (phase !== 'self-marking') {
      return;
    }

    setSelectedPointIds((current) =>
      current.includes(pointId)
        ? current.filter((id) => id !== pointId)
        : [...current, pointId],
    );
  }

  async function saveAttempt() {
    if (phase !== 'self-marking') {
      return;
    }

    const answerLength = answer.trim().length;
    const savedAttempt: SavedPracticeAttempt = {
      answerLength,
      attemptNumber,
      clientAttemptId: createClientAttemptId(),
      earnedRubricPointIds: selectedPointIds,
      maxScoreHalfMarks: maxHalfMarks,
      savedAt: new Date().toISOString(),
      scoreHalfMarks,
      synced: false,
      weakSkillSlugs,
    };
    const nextAttempts = [...attempts, savedAttempt].slice(-20);
    window.localStorage.setItem(
      localStorageKey(definition.id),
      JSON.stringify(nextAttempts),
    );
    setAttempts(nextAttempts);
    setAccountRetention(null);
    setPhase('saved');
    setSyncState('saving');
    setMessage(
      `Attempt ${attemptNumber}: ${formatHalfMarks(scoreHalfMarks)}/${formatHalfMarks(maxHalfMarks)} marks.`,
    );

    try {
      const response = await fetch('/api/progress/practice', {
        body: JSON.stringify({
          answerLength,
          chapterSlug: definition.chapterSlug,
          clientAttemptId: savedAttempt.clientAttemptId,
          earnedRubricPointIds: selectedPointIds,
          lessonSlug: definition.lessonSlug,
          maxScoreHalfMarks: maxHalfMarks,
          practiceItemId: definition.id,
          scoreHalfMarks,
          weakSkillSlugs,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.attempt) {
        const syncedAttempt: SavedPracticeAttempt = {
          ...savedAttempt,
          ...payload.attempt,
          savedAt: payload.attempt.createdAt,
          synced: true,
        };
        const syncedAttempts = nextAttempts.map((attempt) =>
          attempt.clientAttemptId === savedAttempt.clientAttemptId
            ? syncedAttempt
            : attempt,
        );
        window.localStorage.setItem(
          localStorageKey(definition.id),
          JSON.stringify(syncedAttempts),
        );
        setAttempts(syncedAttempts);
        setSyncState('saved');
        setAccountRetention(payload.retention ?? null);
        setMessage(
          `Attempt ${syncedAttempt.attemptNumber}: ${formatHalfMarks(scoreHalfMarks)}/${formatHalfMarks(maxHalfMarks)} marks.`,
        );
      } else {
        setSyncState('local');
      }
    } catch {
      setSyncState('local');
    }
  }

  function retry() {
    setAnswer('');
    setMessage('A fresh attempt has started. Write the complete answer again.');
    setPhase('writing');
    setSelectedPointIds([]);
    setSyncState('idle');
  }

  return (
    <section
      aria-labelledby={`${definition.id}-title`}
      className="written-practice-card"
      id={`written-practice-${definition.id}`}
    >
      <div className="written-practice-heading">
        <div>
          <p className="eyebrow">Write before checking</p>
          <h4 id={`${definition.id}-title`}>{definition.title}</h4>
        </div>
        <span>
          {formatHalfMarks(maxHalfMarks)} marks · Attempt {attemptNumber}
        </span>
      </div>

      <label className="written-practice-answer">
        <span>Your answer</span>
        <textarea
          disabled={phase !== 'writing'}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Write the answer exactly as you would in the board examination."
          rows={7}
          value={answer}
        />
        <small>
          Your answer stays on this device and is not sent to the server.
        </small>
      </label>

      {accountHistoryState !== 'loaded' ? (
        <button
          className="written-practice-history-load"
          disabled={accountHistoryState === 'loading'}
          onClick={loadAccountHistory}
          type="button"
        >
          {accountHistoryState === 'loading'
            ? 'Loading account history…'
            : accountHistoryState === 'unavailable'
              ? 'Account history unavailable — retry'
              : 'Load account history'}
        </button>
      ) : null}

      {phase === 'writing' ? (
        <button className="button-link" onClick={revealRubric} type="button">
          I have finished — show marking points
        </button>
      ) : null}

      {phase !== 'writing' ? (
        <fieldset className="written-practice-rubric" disabled={phase === 'saved'}>
          <legend>Tick only what you actually wrote</legend>
          {definition.rubricPoints.map((point) => (
            <label key={point.id}>
              <input
                checked={selectedPointIds.includes(point.id)}
                onChange={() => togglePoint(point.id)}
                type="checkbox"
              />
              <span>{point.label}</span>
              <strong>{formatHalfMarks(point.halfMarks)} mark</strong>
            </label>
          ))}
        </fieldset>
      ) : null}

      {phase === 'self-marking' ? (
        <button className="button-link" onClick={saveAttempt} type="button">
          Save this score
        </button>
      ) : null}

      {phase === 'saved' ? (
        <div className="written-practice-result">
          <strong>
            {formatHalfMarks(scoreHalfMarks)}/{formatHalfMarks(maxHalfMarks)} marks
          </strong>
          <span>
            {syncState === 'saved'
              ? 'Saved to your account.'
              : syncState === 'saving'
                ? 'Saving to your account…'
                : 'Saved on this device. Sign in to sync across devices.'}
          </span>

          {weakSkillSlugs.length > 0 ? (
            <div className="written-practice-remediation">
              <p>Repair these skills before retrying:</p>
              <ul>
                {weakSkillSlugs.map((skillSlug) => {
                  const remediation = getPracticeRemediation(
                    definition.chapterSlug,
                    skillSlug,
                  );
                  return (
                    <li key={skillSlug}>
                      <strong>
                        {getPracticeSkillLabel(definition.chapterSlug, skillSlug)}:
                      </strong>{' '}
                      {remediation ? (
                        <Link href={remediation.href}>{remediation.label}</Link>
                      ) : (
                        'Review the matching lesson section.'
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p>Every marking point is present. Retry later to prove retention.</p>
          )}

          <button className="ghost-link" onClick={retry} type="button">
            Start a fresh attempt
          </button>
        </div>
      ) : null}

      <p aria-live="polite" className="written-practice-status">
        {message}
      </p>

      {attempts.length > 0 ? (
        <details className="written-practice-history">
          <summary>Recent attempts ({Math.min(attempts.length, 5)})</summary>
          <ol>
            {[...attempts].slice(-5).reverse().map((attempt) => (
              <li key={`${attempt.attemptNumber}-${attempt.savedAt}`}>
                Attempt {attempt.attemptNumber}:{' '}
                {formatHalfMarks(attempt.scoreHalfMarks)}/
                {formatHalfMarks(maxHalfMarks)}
              </li>
            ))}
          </ol>
        </details>
      ) : null}

      {attempts.length > 0 ? (
        <section aria-label="Retention checkpoints" className="written-practice-retention">
          <div>
            <strong>Self-marked retention record</strong>
            <span>
              D0, D3 and D7 need separate attempts scoring at least{' '}
              {retention.thresholdPercent}%. This records your honest self-check;
              it is not teacher grading.
            </span>
          </div>
          <ol>
            {retention.checkpoints.map((checkpoint) => (
              <li className={`retention-${checkpoint.status}`} key={checkpoint.checkpoint}>
                <strong>{checkpoint.checkpoint}</strong>
                <span>{formatRetentionCheckpoint(checkpoint)}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </section>
  );
}
