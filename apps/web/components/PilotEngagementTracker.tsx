'use client';

import { useEffect, useRef, useState } from 'react';

export type PilotEngagementEventType =
  | 'lesson_start'
  | 'lesson_complete'
  | 'quiz_start'
  | 'dashboard_view'
  | 'chapter_open'
  | 'focus_mix_start'
  | 'focus_mix_complete';
export type PilotEngagementSurface =
  | 'lesson'
  | 'quiz'
  | 'dashboard'
  | 'chapter'
  | 'study_remix';

export type PilotEngagementPayload = {
  chapterSlug?: string;
  eventType: PilotEngagementEventType;
  lessonSlug?: string;
  path?: string;
  surface: PilotEngagementSurface;
};

type PilotEngagementTrackerProps = PilotEngagementPayload & {
  auto?: boolean;
};

type PilotCompletionButtonProps = Omit<PilotEngagementPayload, 'eventType'> & {
  label?: string;
};

export async function postPilotEngagement(payload: PilotEngagementPayload) {
  const path = payload.path ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);

  return fetch('/api/progress/engagement', {
    keepalive: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      path,
    }),
  });
}

export default function PilotEngagementTracker({
  auto = true,
  chapterSlug,
  eventType,
  lessonSlug,
  path,
  surface,
}: PilotEngagementTrackerProps) {
  const hasPosted = useRef(false);

  useEffect(() => {
    if (!auto || hasPosted.current) {
      return;
    }

    const postWhenIdle = () => {
      if (hasPosted.current) {
        return;
      }

      hasPosted.current = true;
      void postPilotEngagement({
        chapterSlug,
        eventType,
        lessonSlug,
        path,
        surface,
      }).catch(() => undefined);
    };

    if ('requestIdleCallback' in window) {
      const idleCallback = window.requestIdleCallback(postWhenIdle, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleCallback);
    }

    const timeout = window.setTimeout(postWhenIdle, 1200);
    return () => window.clearTimeout(timeout);
  }, [auto, chapterSlug, eventType, lessonSlug, path, surface]);

  return null;
}

export function PilotCompletionButton({
  chapterSlug,
  label = 'Mark studied',
  lessonSlug,
  path,
  surface,
}: PilotCompletionButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [resultNote, setResultNote] = useState<string | null>(null);

  async function saveCompletion() {
    setStatus('saving');
    setResultNote(null);

    try {
      const response = await postPilotEngagement({
        chapterSlug,
        eventType: 'lesson_complete',
        lessonSlug,
        path,
        surface,
      });
      const payload = await response.json().catch(() => null);
      const badgeName = payload?.gamification?.awardedBadges?.[0]?.name;
      const currentStreakDays = payload?.gamification?.streak?.currentStreakDays;

      setStatus(response.ok ? 'saved' : 'error');
      if (response.ok && badgeName) {
        setResultNote(`Badge earned: ${badgeName}.`);
      } else if (response.ok && currentStreakDays) {
        setResultNote(`Study streak: ${currentStreakDays} day${currentStreakDays === 1 ? '' : 's'}.`);
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="pilot-completion-row">
      <button className="ghost-button" disabled={status === 'saving' || status === 'saved'} onClick={saveCompletion} type="button">
        {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Studied' : label}
      </button>
      {resultNote ? <span role="status">{resultNote}</span> : null}
      {status === 'error' ? <span role="status">Login needed to save.</span> : null}
    </div>
  );
}
