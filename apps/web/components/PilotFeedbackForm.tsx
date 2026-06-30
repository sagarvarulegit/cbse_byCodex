'use client';

import { useState } from 'react';

type PilotFeedbackSurface = 'lesson' | 'quiz' | 'dashboard';
type PilotFeedbackCategory = 'feedback' | 'bug';

type PilotFeedbackFormProps = {
  chapterSlug?: string;
  lessonSlug?: string;
  path?: string;
  surface: PilotFeedbackSurface;
};

const categoryLabels: Record<PilotFeedbackCategory, string> = {
  bug: 'Bug',
  feedback: 'Feedback',
};

export default function PilotFeedbackForm({ chapterSlug, lessonSlug, path, surface }: PilotFeedbackFormProps) {
  const [category, setCategory] = useState<PilotFeedbackCategory>('feedback');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState('4');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('saving');
    setStatusMessage(null);

    try {
      const response = await fetch('/api/progress/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          chapterSlug,
          lessonSlug,
          message,
          path: path ?? window.location.pathname,
          rating: Number(rating),
          surface,
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setStatus('error');
        setStatusMessage(data?.message ?? 'Unable to send feedback right now.');
        return;
      }

      setMessage('');
      setStatus('saved');
      setStatusMessage('Feedback sent.');
    } catch {
      setStatus('error');
      setStatusMessage('Unable to send feedback right now.');
    }
  }

  return (
    <form className="pilot-feedback-form" onSubmit={submitFeedback}>
      <div>
        <p className="eyebrow">Pilot feedback</p>
        <h3>Tell us what to fix next</h3>
      </div>

      <div className="feedback-category-row" role="group" aria-label="Feedback type">
        {(Object.keys(categoryLabels) as PilotFeedbackCategory[]).map((item) => (
          <button
            className={category === item ? 'selected' : ''}
            key={item}
            onClick={() => setCategory(item)}
            type="button"
          >
            {categoryLabels[item]}
          </button>
        ))}
      </div>

      <label className="feedback-field">
        <span>Message</span>
        <textarea
          minLength={8}
          onChange={(event) => {
            setMessage(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
              setStatusMessage(null);
            }
          }}
          placeholder="Share the confusing step, bug, or missing detail."
          required
          rows={4}
          value={message}
        />
      </label>

      <label className="feedback-field compact-field">
        <span>Rating</span>
        <select onChange={(event) => setRating(event.target.value)} value={rating}>
          <option value="5">5 - Great</option>
          <option value="4">4 - Useful</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Confusing</option>
          <option value="1">1 - Blocked</option>
        </select>
      </label>

      <button className="button-link" disabled={status === 'saving'} type="submit">
        {status === 'saving' ? 'Sending...' : 'Send feedback'}
      </button>

      {statusMessage ? (
        <p className="feedback-status" role={status === 'error' ? 'alert' : 'status'}>
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
