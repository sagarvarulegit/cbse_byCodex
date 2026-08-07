'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { MistakeReviewItem, MistakesPayload } from '../lib/mistakes';

const kindLabels: Record<MistakeReviewItem['kind'], string> = {
  hint_used: 'Hint used',
  quiz_question: 'Quiz question',
  weak_concept: 'Weak concept',
  written_marking_point: 'Written answer',
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date)
    : 'Retry date unavailable';
}

function getPrompt(item: MistakeReviewItem) {
  const prompt = item.metadata?.prompt ?? item.metadata?.practicePrompt;
  return typeof prompt === 'string' ? prompt : null;
}

export default function MyMistakesList({
  initialItems,
  status,
}: {
  initialItems: MistakeReviewItem[];
  status: MistakesPayload['status'];
}) {
  const [items, setItems] = useState(initialItems);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const dueCount = useMemo(() => items.filter((item) => item.due && !item.resolvedAt).length, [items]);

  async function setResolved(item: MistakeReviewItem, resolved: boolean) {
    setSavingId(item.id);
    setMessage(null);
    try {
      const response = await fetch(`/api/progress/mistakes/${item.id}`, {
        body: JSON.stringify({ resolved }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      });
      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        resolvedAt?: string | null;
      } | null;
      if (!response.ok) {
        setMessage(payload?.message ?? 'Unable to update this item right now.');
        return;
      }

      if (status === 'all') {
        setItems((current) =>
          current.map((currentItem) =>
            currentItem.id === item.id
              ? { ...currentItem, resolvedAt: payload?.resolvedAt ?? null }
              : currentItem,
          ),
        );
      } else {
        setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      }
      setMessage(resolved ? 'Marked revised.' : 'Moved back to active revision.');
    } catch {
      setMessage('Unable to update this item right now.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="mistakes-list-shell" aria-label="Personal revision list">
      <div className="mistakes-list-summary">
        <div>
          <strong>{items.length}</strong>
          <span>{status === 'resolved' ? 'revised item(s)' : 'item(s) in this list'}</span>
        </div>
        {status !== 'resolved' ? (
          <div>
            <strong>{dueCount}</strong>
            <span>ready to retry now</span>
          </div>
        ) : null}
      </div>

      {items.length > 0 ? (
        <div className="mistakes-list">
          {items.map((item) => {
            const prompt = getPrompt(item);
            return (
              <article className={`mistake-card ${item.due ? 'due' : ''}`} key={item.id}>
                <div className="mistake-card-meta">
                  <span>{kindLabels[item.kind]}</span>
                  <span>{item.subject} · {item.chapterTitle}</span>
                  {item.occurrenceCount > 1 ? <span>Seen {item.occurrenceCount} times</span> : null}
                </div>
                <h2>{item.title}</h2>
                {prompt ? <p className="mistake-prompt">{prompt}</p> : null}
                {item.detail ? <p>{item.detail}</p> : null}
                <div className="mistake-retry-row">
                  <div>
                    <span>{item.resolvedAt ? 'Revised' : item.due ? 'Retry now' : 'Next retry'}</span>
                    <strong>
                      {item.resolvedAt ? formatDate(item.resolvedAt) : formatDate(item.retryAt)}
                    </strong>
                  </div>
                  <div className="hero-actions">
                    <Link className="button-link" href={item.reviewHref} prefetch={false}>
                      Review and retry
                    </Link>
                    <button
                      className="ghost-button"
                      disabled={savingId === item.id}
                      onClick={() => setResolved(item, !item.resolvedAt)}
                      type="button"
                    >
                      {savingId === item.id
                        ? 'Saving…'
                        : item.resolvedAt
                          ? 'Move to active'
                          : 'Mark revised'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mistakes-empty">
          <strong>{status === 'resolved' ? 'No revised items yet.' : 'Nothing needs revision here.'}</strong>
          <p>Quiz errors, hint use, weak concepts, and missed written marking points will appear automatically.</p>
          <Link className="button-link" href="/subjects">Choose a chapter</Link>
        </div>
      )}

      {message ? <p className="feedback-status" role="status">{message}</p> : null}
    </section>
  );
}
