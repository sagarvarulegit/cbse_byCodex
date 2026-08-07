'use client';

import Link from 'next/link';
import { useState } from 'react';

import type { ExamReadyChecklistState, ExamReadyItemId } from '../lib/exam-readiness';

const studentConfirmedItems = new Set<ExamReadyItemId>([
  'conceptsStudied',
  'ncertQuestionsAttempted',
  'weakAreasRevised',
]);

export default function ExamReadyChecklist({
  chapterSlug,
  initialState,
}: {
  chapterSlug: string;
  initialState: ExamReadyChecklistState | null;
}) {
  const [state, setState] = useState(initialState);
  const [savingId, setSavingId] = useState<ExamReadyItemId | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function updateItem(itemId: ExamReadyItemId, complete: boolean) {
    if (!studentConfirmedItems.has(itemId)) {
      return;
    }
    setSavingId(itemId);
    setMessage(null);
    try {
      const response = await fetch('/api/progress/exam-readiness', {
        body: JSON.stringify({ chapterSlug, complete, itemId }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
      const payload = (await response.json().catch(() => null)) as
        | ExamReadyChecklistState
        | { message?: string }
        | null;
      if (!response.ok || !payload || !('items' in payload)) {
        setMessage(payload && 'message' in payload ? payload.message ?? 'Unable to save.' : 'Unable to save.');
        return;
      }
      setState(payload);
      setMessage('Exam Ready checklist updated.');
    } catch {
      setMessage('Unable to save this checklist item right now.');
    } finally {
      setSavingId(null);
    }
  }

  if (!state) {
    return (
      <section className="section-shell exam-ready-checklist">
        <p className="eyebrow">Exam Ready</p>
        <h2>Checklist unavailable</h2>
        <p>Start the learning API or sign in to load your saved chapter checklist.</p>
      </section>
    );
  }

  return (
    <section className="section-shell exam-ready-checklist" aria-label="Exam Ready checklist">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Exam Ready checklist</p>
          <h2>{state.completedCount} of {state.totalCount} complete</h2>
          <p>Three items come from saved evidence. The others need your honest confirmation.</p>
        </div>
        <span className="section-badge">Quiz target {state.quizTargetPercent}%</span>
      </div>

      <div className="exam-ready-progress" aria-label={`${state.completedCount} of ${state.totalCount} complete`}>
        <span style={{ width: `${(state.completedCount / state.totalCount) * 100}%` }} />
      </div>
      <div className="exam-ready-items">
        {state.items.map((item) => {
          const canConfirm = studentConfirmedItems.has(item.id) && !item.automatic;
          return (
            <label className={item.complete ? 'complete' : ''} key={item.id}>
              <input
                checked={item.complete}
                disabled={!canConfirm || savingId === item.id}
                onChange={(event) => updateItem(item.id, event.target.checked)}
                type="checkbox"
              />
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <em>{item.automatic ? 'Saved evidence' : canConfirm ? 'You confirm' : 'Completed'}</em>
            </label>
          );
        })}
      </div>
      <div className="exam-ready-footer">
        <Link href="/my-mistakes">Open My Mistakes</Link>
        {message ? <span role="status">{message}</span> : null}
      </div>
    </section>
  );
}
