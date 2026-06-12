'use client';

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

type LessonVideoPlayerProps = {
  durationSeconds: number | null;
  lessonId: string;
  playbackUrl: string;
  posterUrl: string;
  title: string;
  videoId: string;
};

export default function LessonVideoPlayer({
  durationSeconds,
  lessonId,
  playbackUrl,
  posterUrl,
  title,
  videoId,
}: LessonVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastProgressPostRef = useRef(0);
  const [playerError, setPlayerError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playbackUrl;
      return;
    }

    if (!Hls.isSupported()) {
      setPlayerError('This browser cannot play the lesson video stream.');
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
    });

    hls.loadSource(playbackUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        setPlayerError('The lesson video could not be loaded. Please refresh and try again.');
      }
    });

    return () => {
      hls.destroy();
    };
  }, [playbackUrl]);

  async function postProgress(force = false) {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const now = Date.now();
    if (!force && now - lastProgressPostRef.current < 15_000) {
      return;
    }

    lastProgressPostRef.current = now;
    const actualDuration = Number.isFinite(video.duration) ? video.duration : durationSeconds ?? 0;
    const percentComplete = actualDuration > 0 ? Math.min(100, (video.currentTime / actualDuration) * 100) : 0;

    await fetch('/api/progress/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        durationSeconds: Math.round(actualDuration),
        lessonId,
        percentComplete,
        positionSeconds: Math.round(video.currentTime),
        videoId,
      }),
    }).catch(() => {
      // Progress is best-effort; playback should not be interrupted by tracking failures.
    });
  }

  return (
    <section className="section-shell lesson-video-section" aria-label="Lesson video">
      <div className="lesson-video-card">
        <div className="lesson-video-copy">
          <p className="eyebrow">Watch first</p>
          <h2>{title}</h2>
          <p>Use the video for the core concept, then revise with the notes and practice below.</p>
        </div>
        <div className="lesson-video-frame">
          {playerError ? (
            <div className="lesson-video-error">{playerError}</div>
          ) : (
            <video
              aria-label={title}
              controls
              onEnded={() => void postProgress(true)}
              onPause={() => void postProgress(true)}
              onTimeUpdate={() => void postProgress()}
              playsInline
              poster={posterUrl}
              preload="metadata"
              ref={videoRef}
            />
          )}
        </div>
      </div>
    </section>
  );
}
