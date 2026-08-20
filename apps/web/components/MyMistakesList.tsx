'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { MistakeReviewItem, MistakesPayload } from '../lib/mistakes';

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

function formatConceptTitle(slug: string): string {
  return slug
    .replace(/^[\d.]+\s*/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getPrompt(item: MistakeReviewItem) {
  const prompt = item.metadata?.prompt ?? item.metadata?.practicePrompt;
  return typeof prompt === 'string' ? prompt : null;
}

type MistakeGroup = {
  key: string;
  chapterSlug: string;
  chapterTitle: string;
  subject: string;
  conceptSlug: string | null;
  conceptTitle: string;
  conceptItem: MistakeReviewItem | null;
  items: MistakeReviewItem[];
  due: boolean;
  resolvedAt: string | null;
  occurrenceCount: number;
  retryAt: string;
};

function groupMistakeItems(items: MistakeReviewItem[]): MistakeGroup[] {
  const groupsMap = new Map<string, MistakeGroup>();

  // 1. First register all weak_concept items as group anchors
  for (const item of items) {
    if (item.kind === 'weak_concept') {
      const key = `${item.chapterSlug}::${item.conceptSlug ?? 'general'}`;
      const title =
        item.title.replace(/^Weak concept:\s*/i, '') ||
        (item.conceptSlug ? formatConceptTitle(item.conceptSlug) : item.chapterTitle);
      groupsMap.set(key, {
        key,
        chapterSlug: item.chapterSlug,
        chapterTitle: item.chapterTitle,
        subject: item.subject,
        conceptSlug: item.conceptSlug,
        conceptTitle: title,
        conceptItem: item,
        items: [],
        due: item.due,
        resolvedAt: item.resolvedAt,
        occurrenceCount: item.occurrenceCount,
        retryAt: item.retryAt,
      });
    }
  }

  // 2. Attach quiz_question, hint_used, written_marking_point to matching concept groups
  for (const item of items) {
    if (item.kind === 'weak_concept') continue;

    const key = item.conceptSlug
      ? `${item.chapterSlug}::${item.conceptSlug}`
      : `${item.chapterSlug}::standalone-${item.id}`;

    let group = groupsMap.get(key);
    if (!group) {
      const title = item.conceptSlug ? formatConceptTitle(item.conceptSlug) : item.title;
      group = {
        key,
        chapterSlug: item.chapterSlug,
        chapterTitle: item.chapterTitle,
        subject: item.subject,
        conceptSlug: item.conceptSlug,
        conceptTitle: title,
        conceptItem: null,
        items: [],
        due: item.due,
        resolvedAt: item.resolvedAt,
        occurrenceCount: item.occurrenceCount,
        retryAt: item.retryAt,
      };
      groupsMap.set(key, group);
    }

    group.items.push(item);
    if (item.due) group.due = true;
    if (item.occurrenceCount > group.occurrenceCount) {
      group.occurrenceCount = item.occurrenceCount;
    }
    if (!item.resolvedAt) {
      group.resolvedAt = null;
    }
  }

  return Array.from(groupsMap.values());
}

function getConceptAnchor(group: MistakeGroup): string {
  if (group.conceptSlug) {
    return group.conceptSlug;
  }
  const firstItem = group.items[0];
  if (firstItem?.conceptSlug) {
    return firstItem.conceptSlug;
  }
  if (group.conceptTitle) {
    return group.conceptTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  return '';
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

  const groups = useMemo(() => groupMistakeItems(items), [items]);
  const dueCount = useMemo(
    () => items.filter((item) => item.due && !item.resolvedAt).length,
    [items],
  );

  async function setResolvedItem(item: MistakeReviewItem, resolved: boolean) {
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
      setMessage(resolved ? 'Marked question solved.' : 'Moved back to active revision.');
    } catch {
      setMessage('Unable to update this item right now.');
    } finally {
      setSavingId(null);
    }
  }

  async function setResolvedGroup(group: MistakeGroup, resolved: boolean) {
    const allGroupItemIds = [
      ...(group.conceptItem ? [group.conceptItem.id] : []),
      ...group.items.map((it) => it.id),
    ];
    if (allGroupItemIds.length === 0) return;
    setSavingId(group.key);
    setMessage(null);
    try {
      await Promise.all(
        allGroupItemIds.map((id) =>
          fetch(`/api/progress/mistakes/${id}`, {
            body: JSON.stringify({ resolved }),
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
          }),
        ),
      );
      const resolvedAt = resolved ? new Date().toISOString() : null;
      if (status === 'all') {
        setItems((current) =>
          current.map((item) =>
            allGroupItemIds.includes(item.id) ? { ...item, resolvedAt } : item,
          ),
        );
      } else {
        setItems((current) => current.filter((item) => !allGroupItemIds.includes(item.id)));
      }
      setMessage(
        resolved
          ? `Marked "${group.conceptTitle}" and its questions revised.`
          : `Moved "${group.conceptTitle}" back to active revision.`,
      );
    } catch {
      setMessage('Unable to update this concept right now.');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="mistakes-list-shell" aria-label="Personal revision list">
      <div className="mistakes-list-summary">
        <div>
          <strong>{groups.length}</strong>
          <span>{status === 'resolved' ? 'revised concept(s)' : 'concept area(s) to revise'}</span>
        </div>
        {status !== 'resolved' ? (
          <div>
            <strong>{dueCount}</strong>
            <span>question(s) ready to retry</span>
          </div>
        ) : null}
      </div>

      {groups.length > 0 ? (
        <div className="mistakes-list">
          {groups.map((group) => {
            const hasQuestions = group.items.length > 0;
            const baseReviewHref =
              group.conceptItem?.reviewHref ?? `/chapters/${group.chapterSlug}/notes`;
            const targetAnchor = getConceptAnchor(group);
            const groupReviewHref = baseReviewHref.includes('#')
              ? baseReviewHref
              : targetAnchor
                ? `${baseReviewHref}#${encodeURIComponent(targetAnchor)}`
                : baseReviewHref;

            return (
              <article
                className={`mistake-concept-card ${group.due ? 'due' : ''} ${group.resolvedAt ? 'resolved' : ''}`}
                key={group.key}
              >
                {/* Header Card */}
                <div className="mistake-concept-header">
                  <div className="mistake-concept-meta">
                    <span className="mistake-kind-badge">
                      {group.conceptItem ? '💡 Weak Concept' : '📝 Practice Review'}
                    </span>
                    <span className="mistake-chapter-tag">
                      {group.subject} · {group.chapterTitle}
                    </span>
                    {group.occurrenceCount > 1 && (
                      <span className="mistake-seen-tag">Seen {group.occurrenceCount} times</span>
                    )}
                  </div>

                  <h2 className="mistake-concept-title">{group.conceptTitle}</h2>

                  <p className="mistake-concept-desc">
                    {hasQuestions
                      ? `You missed ${group.items.length} question${group.items.length > 1 ? 's' : ''} related to this concept in recent quizzes. Revise the chapter notes first, then retry the questions below.`
                      : (group.conceptItem?.detail ??
                        'This concept was identified as an area needing revision.')}
                  </p>

                  <div className="mistake-concept-actions">
                    <Link
                      className="button-link mistake-revise-btn"
                      href={groupReviewHref}
                      prefetch={false}
                    >
                      📖 Revise Chapter Notes
                    </Link>

                    <button
                      className="ghost-button"
                      disabled={savingId === group.key}
                      onClick={() => void setResolvedGroup(group, !group.resolvedAt)}
                      type="button"
                    >
                      {savingId === group.key
                        ? 'Saving…'
                        : group.resolvedAt
                          ? 'Move concept to active'
                          : '✓ Mark concept revised'}
                    </button>

                    <div className="mistake-retry-timestamp">
                      <span>{group.resolvedAt ? 'Revised' : group.due ? 'Retry now' : 'Next retry'}</span>
                      <strong>
                        {group.resolvedAt
                          ? formatDate(group.resolvedAt)
                          : formatDate(group.retryAt)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Nested Questions List */}
                {hasQuestions && (
                  <div className="mistake-nested-questions">
                    <div className="mistake-questions-header">
                      <span>📝 Quiz Questions to Retry ({group.items.length})</span>
                    </div>

                    <div className="mistake-questions-list">
                      {group.items.map((q, idx) => {
                        const prompt = getPrompt(q);
                        const meta = q.metadata as {
                          selectedAnswer?: string;
                          correctAnswer?: string;
                          explanation?: string;
                        } | null;

                        return (
                          <div
                            key={q.id}
                            className={`mistake-sub-item ${q.resolvedAt ? 'resolved' : ''}`}
                          >
                            <div className="mistake-sub-top">
                              <span className="mistake-q-num">Q{idx + 1}.</span>
                              <div className="mistake-q-content">
                                <p className="mistake-sub-prompt">{prompt || q.title}</p>
                                {meta?.selectedAnswer && meta?.correctAnswer && (
                                  <div className="mistake-answers-diff">
                                    <span className="diff-wrong">
                                      ❌ Your answer: <strong>{meta.selectedAnswer}</strong>
                                    </span>
                                    <span className="diff-correct">
                                      ✓ Correct answer: <strong>{meta.correctAnswer}</strong>
                                    </span>
                                  </div>
                                )}
                                {meta?.explanation && (
                                  <p className="mistake-explanation">
                                    💡 <em>{meta.explanation}</em>
                                  </p>
                                )}
                                {!meta?.selectedAnswer && q.detail && (
                                  <p className="mistake-detail">{q.detail}</p>
                                )}
                              </div>
                            </div>

                            <div className="mistake-sub-actions">
                              <Link
                                className="button-link sub-retry-btn"
                                href={q.reviewHref}
                                prefetch={false}
                              >
                                🔁 Retry Question
                              </Link>
                              <button
                                className="ghost-button sub-resolve-btn"
                                disabled={savingId === q.id}
                                onClick={() => void setResolvedItem(q, !q.resolvedAt)}
                                type="button"
                              >
                                {savingId === q.id
                                  ? '…'
                                  : q.resolvedAt
                                    ? 'Reactivate'
                                    : '✓ Solved'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mistakes-empty">
          <strong>
            {status === 'resolved' ? 'No revised concepts yet.' : 'Nothing needs revision here.'}
          </strong>
          <p>
            Quiz errors, hint use, weak concepts, and missed written marking points will appear
            automatically.
          </p>
          <Link className="button-link" href="/subjects">
            Choose a chapter
          </Link>
        </div>
      )}

      {message ? (
        <p className="feedback-status" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}

