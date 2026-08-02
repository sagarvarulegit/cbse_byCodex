'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { useStudyRemix } from './StudyRemixProvider';
import styles from './study-remix.module.css';
import {
  STUDY_REMIX_STORAGE_VERSION,
  type StudyRemixAccent,
  type StudyRemixChapterSlug,
  type StudyRemixDashboardModel,
  type StudyRemixTomorrowCue,
} from '../lib/study-remix-types';

const TOMORROW_CUE_STORAGE_PREFIX = 'cbse-study-remix:tomorrow-cue:v1';
const INDIA_TIME_ZONE = 'Asia/Kolkata';
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

const accentClasses: Record<StudyRemixAccent, string> = {
  english: styles.accentEnglish,
  math: styles.accentMath,
  science: styles.accentScience,
};

const coverClasses: Record<StudyRemixAccent, string> = {
  english: styles.coverEnglish,
  math: styles.coverMath,
  science: styles.coverScience,
};

function formatTimer(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function indiaDateString(daysAhead = 0) {
  const date = new Date(Date.now() + daysAhead * ONE_DAY_IN_MILLISECONDS);
  const parts = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function tomorrowCueStorageKey(studentId: string) {
  return `${TOMORROW_CUE_STORAGE_PREFIX}:${studentId}`;
}

function isTomorrowCue(value: unknown): value is StudyRemixTomorrowCue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<StudyRemixTomorrowCue>;
  return (
    candidate.version === STUDY_REMIX_STORAGE_VERSION &&
    typeof candidate.chapterSlug === 'string' &&
    typeof candidate.chapterTitle === 'string' &&
    typeof candidate.savedForDate === 'string' &&
    typeof candidate.subject === 'string' &&
    Boolean(candidate.cue) &&
    typeof candidate.cue?.href === 'string' &&
    typeof candidate.cue?.title === 'string'
  );
}

type StudyRemixDashboardProps = {
  model: StudyRemixDashboardModel;
};

export default function StudyRemixDashboard({
  model,
}: StudyRemixDashboardProps) {
  const {
    activeSession,
    activeTrackIndex,
    endSession,
    pause,
    registerStudent,
    remainingSeconds,
    replay,
    resume,
    startMix,
  } = useStudyRemix();
  const [selectedChapterSlug, setSelectedChapterSlug] =
    useState<StudyRemixChapterSlug>(model.defaultChapterSlug);
  const [pendingSwitch, setPendingSwitch] = useState(false);
  const [savedCue, setSavedCue] = useState<StudyRemixTomorrowCue | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const mix =
    model.mixes.find((item) => item.chapterSlug === selectedChapterSlug) ??
    model.mixes[0];
  const studentSession =
    activeSession?.studentId === model.student.id ? activeSession : null;
  const activeChapterSlug = studentSession?.mix.chapterSlug;
  const selectedMixIsActive =
    activeChapterSlug === mix?.chapterSlug;
  const selectedTrackIndex = selectedMixIsActive ? activeTrackIndex : 0;
  const displaySeconds = selectedMixIsActive
    ? remainingSeconds
    : (mix?.totalMinutes ?? 45) * 60;
  const today = indiaDateString();
  const cueIsDue = Boolean(savedCue && savedCue.savedForDate <= today);
  const selectedCueIsSaved =
    savedCue?.chapterSlug === mix?.chapterSlug && !cueIsDue;

  useEffect(() => {
    registerStudent(model.student.id);
  }, [model.student.id, registerStudent]);

  useEffect(() => {
    if (
      activeChapterSlug &&
      model.mixes.some((item) => item.chapterSlug === activeChapterSlug)
    ) {
      setSelectedChapterSlug(activeChapterSlug);
    }
  }, [activeChapterSlug, model.mixes]);

  useEffect(() => {
    try {
      const rawCue = window.localStorage.getItem(
        tomorrowCueStorageKey(model.student.id),
      );
      if (!rawCue) {
        return;
      }

      const parsed = JSON.parse(rawCue) as unknown;
      if (isTomorrowCue(parsed)) {
        setSavedCue(parsed);
      } else {
        window.localStorage.removeItem(
          tomorrowCueStorageKey(model.student.id),
        );
      }
    } catch {
      setSavedCue(null);
    }
  }, [model.student.id]);

  const playbackLabel = useMemo(() => {
    if (!mix) {
      return 'Play focus mix';
    }

    if (!studentSession) {
      return 'Play focus mix';
    }

    if (!selectedMixIsActive) {
      return 'Switch to this mix';
    }

    if (studentSession.status === 'playing') {
      return `Pause · ${formatTimer(displaySeconds)}`;
    }

    if (studentSession.status === 'complete') {
      return 'Replay focus mix';
    }

    return `Resume · ${formatTimer(displaySeconds)}`;
  }, [displaySeconds, mix, selectedMixIsActive, studentSession]);

  if (!mix) {
    return (
      <section className={styles.emptyState}>
        <p className={styles.kicker}>Study Remix</p>
        <h1>Your pilot chapters are being prepared.</h1>
        <Link href="/subjects">Browse subjects</Link>
      </section>
    );
  }

  const isPlaying =
    selectedMixIsActive && studentSession?.status === 'playing';
  const showDashboardTimer =
    selectedMixIsActive &&
    Boolean(studentSession) &&
    studentSession?.status !== 'complete';
  const stageStatus =
    selectedMixIsActive && studentSession
      ? studentSession.status === 'complete'
        ? 'Focus mix complete'
        : studentSession.status === 'playing'
          ? 'Focus mix playing'
          : 'Focus mix paused'
      : 'Focus mix ready';

  function chooseMix(chapterSlug: StudyRemixChapterSlug) {
    setSelectedChapterSlug(chapterSlug);
    setPendingSwitch(false);
    setStatusMessage(null);
  }

  function handlePlayback() {
    if (!studentSession) {
      startMix(model.student.id, mix);
      return;
    }

    if (!selectedMixIsActive) {
      setPendingSwitch(true);
      return;
    }

    if (studentSession.status === 'playing') {
      pause();
      return;
    }

    if (studentSession.status === 'complete') {
      replay();
      return;
    }

    resume();
  }

  function confirmSwitch() {
    startMix(model.student.id, mix);
    setPendingSwitch(false);
    setStatusMessage(`${mix.subject} focus mix started.`);
  }

  function queueCueForTomorrow() {
    const nextCue: StudyRemixTomorrowCue = {
      chapterSlug: mix.chapterSlug,
      chapterTitle: mix.chapterTitle,
      cue: mix.cue,
      savedForDate: indiaDateString(1),
      subject: mix.subject,
      version: STUDY_REMIX_STORAGE_VERSION,
    };

    try {
      window.localStorage.setItem(
        tomorrowCueStorageKey(model.student.id),
        JSON.stringify(nextCue),
      );
      setSavedCue(nextCue);
      setStatusMessage(`${mix.cue.title} is queued for tomorrow.`);
    } catch {
      setStatusMessage(
        'This browser blocked local saving. You can still open the cue now.',
      );
    }
  }

  function clearSavedCue() {
    try {
      window.localStorage.removeItem(
        tomorrowCueStorageKey(model.student.id),
      );
    } catch {
      // The in-memory cue can still be cleared.
    }

    setSavedCue(null);
  }

  return (
    <div className={styles.dashboardShell}>
      <section
        aria-label="Interactive Study Remix dashboard"
        className={`${styles.mixStage} ${accentClasses[mix.accent]} ${
          isPlaying ? styles.isPlaying : ''
        }`}
      >
        <div className={styles.stageGlow} aria-hidden="true" />
        <div className={styles.mixTopline}>
          <span className={styles.mixKicker}>
            <span>Now cued</span>
            <strong>Today’s personal focus mix</strong>
          </span>
          <span
            aria-label={stageStatus}
            className={styles.equalizer}
            role="img"
          >
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
        </div>

        <div className={styles.mixLayout}>
          <section
            aria-label={`Current album: ${mix.chapterTitle}`}
            className={styles.turntableZone}
          >
            <div
              aria-hidden="true"
              className={`${styles.albumCover} ${coverClasses[mix.accent]}`}
              key={mix.chapterSlug}
            >
              <span className={styles.coverRule} />
              <div className={styles.coverCopy}>
                <span>{mix.subjectLabel}</span>
                <h1>{mix.coverTitle}</h1>
                <span className={styles.coverCode}>{mix.chapterCode}</span>
              </div>
              <span className={styles.coverMonogram}>
                {mix.chapterCode.slice(0, 3)}
              </span>
            </div>

            <div className={styles.vinylDeck}>
              <div className={styles.vinylScene}>
                <div className={styles.vinyl} aria-hidden="true">
                  <span className={styles.discGrooves} />
                  <span className={styles.recordLabel}>
                    <span>{mix.recordCode}</span>
                    <strong>{mix.masteryScore}%</strong>
                    <span>{mix.masteryLabel}</span>
                  </span>
                  <span className={styles.spindle} />
                </div>
                <span className={styles.tonearm} aria-hidden="true">
                  <span className={styles.tonearmPivot} />
                  <span className={styles.needle} />
                </span>
              </div>

              <span className={styles.recordMeta}>
                <span>{mix.nextBreakLabel}</span>
                <span>
                  {selectedMixIsActive ? 'Place saved' : 'Ready to begin'}
                </span>
              </span>

              <div className={styles.playbackControls}>
                <button
                  className={styles.primaryControl}
                  onClick={handlePlayback}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className={
                      isPlaying ? styles.pauseIcon : styles.playIcon
                    }
                  />
                  {showDashboardTimer && studentSession ? (
                    <>
                      {studentSession.status === 'playing'
                        ? 'Pause'
                        : 'Resume'}{' '}
                      ·{' '}
                      <time
                        aria-label={`${formatTimer(displaySeconds)} remaining`}
                        role="timer"
                      >
                        {formatTimer(displaySeconds)}
                      </time>
                    </>
                  ) : (
                    playbackLabel
                  )}
                </button>
                <Link
                  className={styles.secondaryControl}
                  href={mix.cue.href}
                  prefetch={false}
                >
                  Quick recap
                </Link>
              </div>

              {selectedMixIsActive && studentSession ? (
                <div className={styles.sessionUtility}>
                  <span>{stageStatus}</span>
                  <button onClick={endSession} type="button">
                    End mix
                  </button>
                </div>
              ) : null}
            </div>
          </section>

          <section
            aria-label={`Today’s ${mix.subject} study setlist`}
            className={styles.setlistZone}
          >
            <div className={styles.setlistHeading}>
              <span className={styles.setlistTitle}>
                <span>{mix.subjectLabel}</span>
                <h2>{mix.chapterTitle}</h2>
              </span>
              <span className={styles.mixTotal}>
                <strong>{mix.totalMinutes}</strong>
                <span>minutes</span>
              </span>
            </div>

            <div className={styles.setlist}>
              {mix.tracks.map((track, index) => {
                const isCurrentTrack =
                  selectedMixIsActive &&
                  studentSession?.status !== 'complete' &&
                  index === selectedTrackIndex;

                return (
                  <Link
                    aria-current={isCurrentTrack ? 'step' : undefined}
                    className={`${styles.track} ${
                      isCurrentTrack ? styles.currentTrack : ''
                    }`}
                    href={track.href}
                    key={track.id}
                    prefetch={false}
                  >
                    <span className={styles.trackNumber}>{index + 1}</span>
                    <span className={styles.trackCopy}>
                      <strong>{track.title}</strong>
                      <span>{track.subtitle}</span>
                    </span>
                    <span className={styles.trackTime}>
                      {track.durationMinutes} min
                    </span>
                    <span className={styles.trackOpen}>Open</span>
                  </Link>
                );
              })}
            </div>

            <div className={styles.cueStrip}>
              <span className={styles.cueCopy}>
                <span>
                  {mix.cue.source === 'revision_mission'
                    ? 'Mission signal'
                    : 'Rewind signal'}
                </span>
                <strong>{mix.cue.title}</strong>
                <small>{mix.cue.copy}</small>
              </span>
              <button
                className={styles.cueButton}
                onClick={queueCueForTomorrow}
                type="button"
              >
                {selectedCueIsSaved
                  ? 'Queued for tomorrow ✓'
                  : 'Add to tomorrow'}
              </button>
            </div>

            {pendingSwitch && studentSession ? (
              <div
                aria-live="polite"
                className={styles.switchConfirmation}
                role="status"
              >
                <span>
                  <strong>Switch the record?</strong>
                  <small>
                    This ends the {studentSession.mix.subject} timer and starts
                    {` ${mix.subject}`} at 45:00.
                  </small>
                </span>
                <span>
                  <button onClick={confirmSwitch} type="button">
                    Start {mix.subject}
                  </button>
                  <button
                    onClick={() => setPendingSwitch(false)}
                    type="button"
                  >
                    Keep current mix
                  </button>
                </span>
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <section
        aria-label="Choose a subject album"
        className={styles.recordCrate}
      >
        <div className={styles.crateHeading}>
          <span>
            <span className={styles.kicker}>Your record crate</span>
            <strong>Switch the album. Keep the 45-minute rhythm.</strong>
          </span>
          <span className={styles.crateStats}>
            <span>{model.badgeCount} badges</span>
            <span>{model.activeMissionCount} active missions</span>
          </span>
        </div>

        {cueIsDue && savedCue ? (
          <div className={styles.savedCue}>
            <span className={styles.savedCueDate}>Saved cue · Today</span>
            <span>
              <strong>{savedCue.cue.title}</strong>
              <small>
                {savedCue.subject} · {savedCue.chapterTitle}
              </small>
            </span>
            <Link
              href={savedCue.cue.href}
              onClick={clearSavedCue}
              prefetch={false}
            >
              Open saved cue
            </Link>
            <button onClick={clearSavedCue} type="button">
              Clear
            </button>
          </div>
        ) : null}

        <div className={styles.albumGrid}>
          {model.mixes.map((album) => {
            const isSelected = album.chapterSlug === mix.chapterSlug;
            const isActive =
              studentSession?.mix.chapterSlug === album.chapterSlug;

            return (
              <button
                aria-pressed={isSelected}
                className={`${styles.albumChoice} ${
                  accentClasses[album.accent]
                } ${isSelected ? styles.selectedAlbum : ''}`}
                key={album.chapterSlug}
                onClick={() => chooseMix(album.chapterSlug)}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className={`${styles.miniCover} ${
                    coverClasses[album.accent]
                  }`}
                >
                  <span>{album.chapterCode.slice(0, 3)}</span>
                </span>
                <span className={styles.albumCopy}>
                  <strong>{album.chapterTitle}</strong>
                  <span>
                    {album.subject} · {album.masteryScore}% ·{' '}
                    {album.masteryLabel}
                  </span>
                </span>
                <span className={styles.albumState}>
                  {isActive
                    ? studentSession?.status === 'playing'
                      ? 'Playing'
                      : studentSession?.status === 'complete'
                        ? 'Complete'
                        : 'Paused'
                    : isSelected
                      ? 'Cued'
                      : 'Select'}
                </span>
              </button>
            );
          })}
        </div>

        {statusMessage ? (
          <p aria-live="polite" className={styles.statusMessage}>
            {statusMessage}
          </p>
        ) : null}
      </section>
    </div>
  );
}
