'use client';

import { useState } from 'react';

type PilotFeedbackSurface = 'lesson' | 'quiz' | 'dashboard';
type PilotFeedbackCategory = 'stuck' | 'feedback' | 'bug';
type PilotStuckReason =
  | 'explanation_unclear'
  | 'question_unclear'
  | 'activity_unusable'
  | 'answer_incorrect'
  | 'need_example';

type PilotFeedbackFormProps = {
  chapterSlug?: string;
  lessonSlug?: string;
  path?: string;
  surface: PilotFeedbackSurface;
};

const categoryLabels: Record<PilotFeedbackCategory, string> = {
  bug: 'Bug',
  feedback: 'Feedback',
  stuck: 'I’m stuck',
};

const stuckReasonLabels: Record<PilotStuckReason, string> = {
  activity_unusable: 'I cannot use this activity',
  answer_incorrect: 'The answer looks incorrect',
  explanation_unclear: 'I don’t understand the explanation',
  need_example: 'I need another example',
  question_unclear: 'I don’t understand the question',
};

export default function PilotFeedbackForm({ chapterSlug, lessonSlug, path, surface }: PilotFeedbackFormProps) {
  const [category, setCategory] = useState<PilotFeedbackCategory>('stuck');
  const [stuckReason, setStuckReason] = useState<PilotStuckReason>('explanation_unclear');
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
          rating: category === 'stuck' ? 1 : Number(rating),
          stuckReason: category === 'stuck' ? stuckReason : null,
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
      setStatusMessage(
        category === 'stuck'
          ? 'We got it. A pilot reviewer can help manually.'
          : 'Feedback sent.',
      );
    } catch {
      setStatus('error');
      setStatusMessage('Unable to send feedback right now.');
    }
  }

  return (
    <form className="pilot-feedback-form" onSubmit={submitFeedback}>
      <div>
        <p className="eyebrow">Learning help</p>
        <h3>I’m stuck</h3>
        <p>Choose the closest problem. During the pilot, a person reviews these messages.</p>
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

      {category === 'stuck' ? (
        <div className="feedback-stuck-grid" role="radiogroup" aria-label="What are you stuck on?">
          {(Object.keys(stuckReasonLabels) as PilotStuckReason[]).map((reason) => (
            <button
              aria-checked={stuckReason === reason}
              className={stuckReason === reason ? 'selected' : ''}
              key={reason}
              onClick={() => setStuckReason(reason)}
              role="radio"
              type="button"
            >
              {stuckReasonLabels[reason]}
            </button>
          ))}
        </div>
      ) : null}

      <label className="feedback-field">
        <span>{category === 'stuck' ? 'Add a short note (optional)' : 'Message'}</span>
        <textarea
          minLength={category === 'stuck' ? undefined : 8}
          onChange={(event) => {
            setMessage(event.target.value);
            if (status !== 'idle') {
              setStatus('idle');
              setStatusMessage(null);
            }
          }}
          placeholder={
            category === 'stuck'
              ? 'Tell us the question number or confusing step.'
              : 'Share the confusing step, bug, or missing detail.'
          }
          required={category !== 'stuck'}
          rows={4}
          value={message}
        />
      </label>

      {category !== 'stuck' ? <label className="feedback-field compact-field">
        <span>Rating</span>
        <select onChange={(event) => setRating(event.target.value)} value={rating}>
          <option value="5">5 - Great</option>
          <option value="4">4 - Useful</option>
          <option value="3">3 - Okay</option>
          <option value="2">2 - Confusing</option>
          <option value="1">1 - Blocked</option>
        </select>
      </label> : null}

      <button className="button-link" disabled={status === 'saving'} type="submit">
        {status === 'saving'
          ? 'Sending...'
          : category === 'stuck'
            ? 'Send help request'
            : 'Send feedback'}
      </button>

      {statusMessage ? (
        <p className="feedback-status" role={status === 'error' ? 'alert' : 'status'}>
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
}
