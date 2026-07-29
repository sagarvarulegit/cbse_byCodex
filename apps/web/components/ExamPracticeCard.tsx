'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import {
  getExamSkillOptions,
  type ExamPracticeDefinition,
} from '../lib/exam-practice';

type ExamPhase = 'ready' | 'writing' | 'checking' | 'scoring' | 'saved';

type ExamSession = {
  checkingEndsAt: number | null;
  phase: ExamPhase;
  startedAt: number | null;
  writingEndsAt: number | null;
};

type LocalExamAttempt = {
  attemptNumber: number;
  clientAttemptId: string;
  conditionsMet: boolean;
  maxScoreHalfMarks: number;
  retentionEligible: boolean;
  savedAt: string;
  scoreHalfMarks: number;
  weakSkillSlugs: string[];
};

function createClientAttemptId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sessionKey(id: string) {
  return `cbse-exam-session:${id}`;
}

function historyKey(id: string) {
  return `cbse-exam-history:${id}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatClock(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function mergeAttemptHistories(
  localAttempts: LocalExamAttempt[],
  accountAttempts: LocalExamAttempt[],
) {
  const attemptsByClientId = new Map<string, LocalExamAttempt>();
  for (const attempt of [...localAttempts, ...accountAttempts]) {
    attemptsByClientId.set(attempt.clientAttemptId, attempt);
  }
  return Array.from(attemptsByClientId.values())
    .sort((left, right) => left.attemptNumber - right.attemptNumber)
    .slice(-10);
}

const readySession: ExamSession = {
  checkingEndsAt: null,
  phase: 'ready',
  startedAt: null,
  writingEndsAt: null,
};

export default function ExamPracticeCard({
  definition,
}: {
  definition: ExamPracticeDefinition;
}) {
  const [session, setSession] = useState<ExamSession>(readySession);
  const [now, setNow] = useState(0);
  const [scoreHalfMarks, setScoreHalfMarks] = useState(0);
  const [weakSkillSlug, setWeakSkillSlug] = useState('');
  const [conditions, setConditions] = useState<boolean[]>(
    definition.conditionLabels.map(() => false),
  );
  const [attempts, setAttempts] = useState<LocalExamAttempt[]>([]);
  const [message, setMessage] = useState('');
  const [syncState, setSyncState] = useState<'idle' | 'local' | 'saved' | 'saving'>('idle');
  const skillOptions = useMemo(() => getExamSkillOptions(definition), [definition]);
  const maxScoreHalfMarks = definition.maxMarks * 2;
  const attemptNumber =
    Math.max(0, ...attempts.map((attempt) => attempt.attemptNumber)) + 1;
  const allConditionsMet = conditions.every(Boolean);

  useEffect(() => {
    const savedSession = readJson<ExamSession>(sessionKey(definition.id), readySession);
    const savedAttempts = readJson<LocalExamAttempt[]>(historyKey(definition.id), []);
    setSession(savedSession);
    const localAttempts = Array.isArray(savedAttempts) ? savedAttempts.slice(-10) : [];
    setAttempts(localAttempts);
    setNow(Date.now());

    const params = new URLSearchParams({
      chapterSlug: definition.chapterSlug,
      practiceItemId: definition.practiceItemId,
    });
    fetch(`/api/progress/practice?${params.toString()}`)
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!Array.isArray(payload?.attempts)) {
          return;
        }
        const accountAttempts: LocalExamAttempt[] = payload.attempts.map(
          (attempt: {
            attemptNumber: number;
            clientAttemptId: string;
            maxScoreHalfMarks: number;
            retentionEligible?: boolean;
            savedAt: string;
            scoreHalfMarks: number;
            weakSkillSlugs: string[];
          }) => ({
            ...attempt,
            conditionsMet: attempt.retentionEligible !== false,
            retentionEligible: attempt.retentionEligible !== false,
          }),
        );
        const merged = mergeAttemptHistories(localAttempts, accountAttempts);
        window.localStorage.setItem(historyKey(definition.id), JSON.stringify(merged));
        setAttempts(merged);
      })
      .catch(() => undefined);
  }, [definition.chapterSlug, definition.id, definition.practiceItemId]);

  useEffect(() => {
    if (session.phase !== 'writing' && session.phase !== 'checking') {
      return;
    }
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [session.phase]);

  useEffect(() => {
    if (session.phase === 'writing' && session.writingEndsAt && now >= session.writingEndsAt) {
      const checkingEndsAt = session.writingEndsAt + definition.checkingMinutes * 60_000;
      const next: ExamSession =
        now >= checkingEndsAt
          ? { ...session, checkingEndsAt, phase: 'scoring' }
          : { ...session, checkingEndsAt, phase: 'checking' };
      setSession(next);
      window.localStorage.setItem(sessionKey(definition.id), JSON.stringify(next));
      setMessage(
        next.phase === 'checking'
          ? 'Writing time ended. Stop writing and use only the checking phase now.'
          : 'The timed attempt ended. Record the score honestly.',
      );
    }
    if (session.phase === 'checking' && session.checkingEndsAt && now >= session.checkingEndsAt) {
      const next = { ...session, phase: 'scoring' as const };
      setSession(next);
      window.localStorage.setItem(sessionKey(definition.id), JSON.stringify(next));
      setMessage('Checking time ended. Record the score honestly.');
    }
  }, [definition.checkingMinutes, definition.id, now, session]);

  function persistSession(next: ExamSession) {
    setSession(next);
    window.localStorage.setItem(sessionKey(definition.id), JSON.stringify(next));
  }

  function startAttempt() {
    const startedAt = Date.now();
    persistSession({
      checkingEndsAt: null,
      phase: 'writing',
      startedAt,
      writingEndsAt: startedAt + definition.writingMinutes * 60_000,
    });
    setNow(startedAt);
    setMessage('Timer started. Write on paper; keep every answer check closed.');
  }

  function startCheckingEarly() {
    const checkingEndsAt = Date.now() + definition.checkingMinutes * 60_000;
    persistSession({ ...session, checkingEndsAt, phase: 'checking' });
    setNow(Date.now());
    setMessage('Writing is locked for this attempt. Check your work without adding new answers.');
  }

  function finishChecking() {
    persistSession({ ...session, phase: 'scoring' });
    setMessage('Use the answer check below the paper, then record your total and first weak skill.');
  }

  async function saveAttempt() {
    if (scoreHalfMarks < maxScoreHalfMarks && !weakSkillSlug) {
      setMessage('Choose the first weak skill before saving this attempt.');
      return;
    }
    const retentionEligible = allConditionsMet;
    const weakSkillSlugs =
      scoreHalfMarks === maxScoreHalfMarks || !weakSkillSlug ? [] : [weakSkillSlug];
    const savedAttempt: LocalExamAttempt = {
      attemptNumber,
      clientAttemptId: createClientAttemptId(),
      conditionsMet: allConditionsMet,
      maxScoreHalfMarks,
      retentionEligible,
      savedAt: new Date().toISOString(),
      scoreHalfMarks,
      weakSkillSlugs,
    };
    const nextAttempts = [...attempts, savedAttempt].slice(-10);
    window.localStorage.setItem(historyKey(definition.id), JSON.stringify(nextAttempts));
    window.localStorage.removeItem(sessionKey(definition.id));
    setAttempts(nextAttempts);
    setSession({ ...session, phase: 'saved' });
    setSyncState('saving');
    setMessage(
      retentionEligible
        ? `Attempt ${attemptNumber} saved as exam-condition evidence.`
        : `Attempt ${attemptNumber} saved as practice only; it does not count as exam-condition evidence.`,
    );

    try {
      const response = await fetch('/api/progress/practice', {
        body: JSON.stringify({
          answerLength: 0,
          chapterSlug: definition.chapterSlug,
          clientAttemptId: savedAttempt.clientAttemptId,
          earnedRubricPointIds: [],
          lessonSlug: definition.lessonSlug,
          maxScoreHalfMarks,
          practiceItemId: definition.practiceItemId,
          retentionEligible,
          scoreHalfMarks,
          weakSkillSlugs,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.attempt) {
        const syncedAttempt: LocalExamAttempt = {
          ...savedAttempt,
          ...payload.attempt,
          conditionsMet: payload.attempt.retentionEligible !== false,
          savedAt: payload.attempt.createdAt,
        };
        const syncedAttempts = nextAttempts.map((attempt) =>
          attempt.clientAttemptId === savedAttempt.clientAttemptId
            ? syncedAttempt
            : attempt,
        );
        window.localStorage.setItem(
          historyKey(definition.id),
          JSON.stringify(syncedAttempts),
        );
        setAttempts(syncedAttempts);
        setSyncState('saved');
        setMessage(
          syncedAttempt.retentionEligible
            ? `Attempt ${syncedAttempt.attemptNumber} saved as exam-condition evidence.`
            : `Attempt ${syncedAttempt.attemptNumber} saved as practice only; it does not count as exam-condition evidence.`,
        );
      } else {
        setSyncState('local');
      }
    } catch {
      setSyncState('local');
    }
  }

  function retry() {
    persistSession(readySession);
    setScoreHalfMarks(0);
    setWeakSkillSlug('');
    setConditions(definition.conditionLabels.map(() => false));
    setSyncState('idle');
    setMessage('Fresh attempt ready. The timer has not started yet.');
  }

  const remaining =
    session.phase === 'writing' && session.writingEndsAt
      ? session.writingEndsAt - now
      : session.phase === 'checking' && session.checkingEndsAt
        ? session.checkingEndsAt - now
        : 0;
  const displayedRemaining =
    session.phase === 'ready' ? definition.writingMinutes * 60_000 : remaining;
  const timerPhaseLabel =
    session.phase === 'checking'
      ? 'Checking time'
      : session.phase === 'ready' || session.phase === 'writing'
        ? 'Writing time'
        : 'Timed attempt ended';
  const timerDisplay =
    session.phase === 'scoring' || session.phase === 'saved'
      ? 'Done'
      : formatClock(displayedRemaining);
  const selectedSkill = skillOptions.find((option) => option.skillSlug === weakSkillSlug);

  return (
    <section
      aria-labelledby={`${definition.id}-title`}
      className="exam-practice-card"
      id={`exam-practice-${definition.id}`}
    >
      <div className="written-practice-heading">
        <div>
          <p className="eyebrow">Timed paper controller</p>
          <h4 id={`${definition.id}-title`}>{definition.title}</h4>
        </div>
        <span>{definition.maxMarks} marks · Attempt {attemptNumber}</span>
      </div>

      <div
        aria-label={
          session.phase === 'scoring' || session.phase === 'saved'
            ? 'Timed attempt ended'
            : `${timerPhaseLabel} remaining ${timerDisplay}`
        }
        className="exam-practice-timer"
        role="timer"
      >
        <span>{timerPhaseLabel}</span>
        <strong>{timerDisplay}</strong>
        <small>
          {definition.writingMinutes} min writing + {definition.checkingMinutes} min checking
        </small>
      </div>

      {session.phase === 'ready' ? (
        <div className="exam-practice-actions">
          <p>Get blank paper and a pen ready. Starting is permanent for this attempt; refreshing does not reset the clock.</p>
          <button className="button-link" onClick={startAttempt} type="button">
            Start writing timer
          </button>
        </div>
      ) : null}

      {session.phase === 'writing' ? (
        <div className="exam-practice-actions">
          <p>Answer the paper below. Do not open its answer check yet.</p>
          <button className="ghost-link" onClick={startCheckingEarly} type="button">
            Finish writing and start checking
          </button>
        </div>
      ) : null}

      {session.phase === 'checking' ? (
        <div className="exam-practice-actions">
          <p>Writing has ended. Check attempted answers only; do not add answers to blank parts.</p>
          <button className="ghost-link" onClick={finishChecking} type="button">
            Finish checking
          </button>
        </div>
      ) : null}

      {session.phase === 'scoring' ? (
        <div className="exam-practice-scoring">
          <label>
            <span>Your total score</span>
            <select
              onChange={(event) => setScoreHalfMarks(Number(event.target.value))}
              value={scoreHalfMarks}
            >
              {Array.from({ length: maxScoreHalfMarks + 1 }, (_, value) => (
                <option key={value} value={value}>
                  {value / 2}/{definition.maxMarks}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>First weak skill {scoreHalfMarks === maxScoreHalfMarks ? '(optional)' : ''}</span>
            <select
              onChange={(event) => setWeakSkillSlug(event.target.value)}
              value={weakSkillSlug}
            >
              <option value="">Select one</option>
              {skillOptions.map((option) => (
                <option key={option.skillSlug} value={option.skillSlug}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Confirm the attempt conditions</legend>
            {definition.conditionLabels.map((label, index) => (
              <label key={label}>
                <input
                  checked={conditions[index]}
                  onChange={(event) =>
                    setConditions((current) =>
                      current.map((value, itemIndex) =>
                        itemIndex === index ? event.target.checked : value,
                      ),
                    )
                  }
                  type="checkbox"
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

          <p className="exam-practice-integrity">
            Unchecked conditions do not block saving. They correctly label this as practice only.
          </p>
          <button className="button-link" onClick={saveAttempt} type="button">
            Save honest attempt
          </button>
        </div>
      ) : null}

      {session.phase === 'saved' ? (
        <div className="written-practice-result">
          <strong>{scoreHalfMarks / 2}/{definition.maxMarks} marks</strong>
          <span>
            {allConditionsMet ? 'Exam-condition evidence' : 'Practice attempt only'}
            {syncState === 'local' ? ' · saved on this device' : ''}
          </span>
          {selectedSkill ? (
            <div className="written-practice-remediation">
              <p>First repair:</p>
              <Link href={selectedSkill.remediation.href}>
                {selectedSkill.remediation.label}
              </Link>
            </div>
          ) : null}
          <button className="ghost-link" onClick={retry} type="button">
            Start a fresh attempt
          </button>
        </div>
      ) : null}

      <p className="written-practice-status" aria-live="polite">{message}</p>

      {attempts.length ? (
        <details className="written-practice-history">
          <summary>Attempt history ({attempts.length})</summary>
          <ol>
            {attempts.slice().reverse().map((attempt) => (
              <li key={attempt.clientAttemptId}>
                Attempt {attempt.attemptNumber}: {attempt.scoreHalfMarks / 2}/{attempt.maxScoreHalfMarks / 2}
                {' · '}{attempt.retentionEligible ? 'exam conditions met' : 'practice only'}
              </li>
            ))}
          </ol>
        </details>
      ) : null}
    </section>
  );
}
