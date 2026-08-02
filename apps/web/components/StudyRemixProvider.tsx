'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { postPilotEngagement } from './PilotEngagementTracker';
import styles from './study-remix.module.css';
import {
  STUDY_REMIX_STORAGE_VERSION,
  type StudyRemixMix,
  type StudyRemixPlayerSession,
} from '../lib/study-remix-types';

const ACTIVE_STUDENT_STORAGE_KEY = 'cbse-study-remix:active-student:v1';
const PLAYER_STORAGE_PREFIX = 'cbse-study-remix:player:v1';

type StudyRemixContextValue = {
  activeSession: StudyRemixPlayerSession | null;
  activeTrackIndex: number;
  endSession: () => void;
  pause: () => void;
  registerStudent: (studentId: string) => void;
  remainingSeconds: number;
  replay: () => void;
  resume: () => void;
  startMix: (studentId: string, mix: StudyRemixMix) => void;
};

const StudyRemixContext = createContext<StudyRemixContextValue | null>(null);

function playerStorageKey(studentId: string) {
  return `${PLAYER_STORAGE_PREFIX}:${studentId}`;
}

function getTotalSeconds(mix: StudyRemixMix) {
  return mix.totalMinutes * 60;
}

function formatTimer(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getTrackIndex(mix: StudyRemixMix, elapsedSeconds: number) {
  let boundary = 0;

  for (let index = 0; index < mix.tracks.length; index += 1) {
    boundary += mix.tracks[index].durationMinutes * 60;
    if (elapsedSeconds < boundary) {
      return index;
    }
  }

  return Math.max(0, mix.tracks.length - 1);
}

function isStoredSession(value: unknown): value is StudyRemixPlayerSession {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<StudyRemixPlayerSession>;
  return (
    candidate.version === STUDY_REMIX_STORAGE_VERSION &&
    typeof candidate.studentId === 'string' &&
    typeof candidate.elapsedSeconds === 'number' &&
    typeof candidate.completionEventSent === 'boolean' &&
    (candidate.status === 'playing' ||
      candidate.status === 'paused' ||
      candidate.status === 'complete') &&
    Boolean(candidate.mix) &&
    typeof candidate.mix?.chapterSlug === 'string' &&
    Array.isArray(candidate.mix?.tracks)
  );
}

function readStoredSession(studentId: string) {
  try {
    const stored = window.sessionStorage.getItem(playerStorageKey(studentId));
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as unknown;
    if (!isStoredSession(parsed)) {
      window.sessionStorage.removeItem(playerStorageKey(studentId));
      return null;
    }

    const totalSeconds = getTotalSeconds(parsed.mix);
    const elapsedSeconds = Math.max(
      0,
      Math.min(totalSeconds, Math.floor(parsed.elapsedSeconds)),
    );

    return {
      ...parsed,
      elapsedSeconds,
      status:
        elapsedSeconds >= totalSeconds
          ? ('complete' as const)
          : ('paused' as const),
    };
  } catch {
    return null;
  }
}

function writeActiveStudent(studentId: string) {
  try {
    window.sessionStorage.setItem(ACTIVE_STUDENT_STORAGE_KEY, studentId);
  } catch {
    // The player remains available in memory when browser storage is unavailable.
  }
}

export default function StudyRemixProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [activeSession, setActiveSession] =
    useState<StudyRemixPlayerSession | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const completionPosts = useRef<Set<string>>(new Set());

  useEffect(() => {
    let storedStudentId: string | null = null;

    try {
      storedStudentId = window.sessionStorage.getItem(
        ACTIVE_STUDENT_STORAGE_KEY,
      );
    } catch {
      storedStudentId = null;
    }

    if (storedStudentId) {
      setActiveStudentId(storedStudentId);
      setActiveSession(readStoredSession(storedStudentId));
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !activeStudentId) {
      return;
    }

    try {
      if (activeSession?.studentId === activeStudentId) {
        window.sessionStorage.setItem(
          playerStorageKey(activeStudentId),
          JSON.stringify(activeSession),
        );
      } else if (!activeSession) {
        window.sessionStorage.removeItem(playerStorageKey(activeStudentId));
      }
    } catch {
      // A blocked storage write must not interrupt the timer.
    }
  }, [activeSession, activeStudentId, hasHydrated]);

  useEffect(() => {
    if (activeSession?.status !== 'playing') {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSession((current) => {
        if (!current || current.status !== 'playing') {
          return current;
        }

        const totalSeconds = getTotalSeconds(current.mix);
        const elapsedSeconds = Math.min(
          totalSeconds,
          current.elapsedSeconds + 1,
        );

        return {
          ...current,
          elapsedSeconds,
          status:
            elapsedSeconds >= totalSeconds
              ? ('complete' as const)
              : current.status,
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeSession?.status]);

  useEffect(() => {
    if (
      !activeSession ||
      activeSession.status !== 'complete' ||
      activeSession.completionEventSent
    ) {
      return;
    }

    const eventKey = `${activeSession.studentId}:${activeSession.mix.chapterSlug}:${activeSession.elapsedSeconds}`;
    if (completionPosts.current.has(eventKey)) {
      return;
    }

    completionPosts.current.add(eventKey);
    setActiveSession((current) =>
      current
        ? {
            ...current,
            completionEventSent: true,
          }
        : current,
    );

    void postPilotEngagement({
      chapterSlug: activeSession.mix.chapterSlug,
      eventType: 'focus_mix_complete',
      surface: 'study_remix',
    }).catch(() => undefined);
  }, [activeSession]);

  const registerStudent = useCallback(
    (studentId: string) => {
      if (!studentId || studentId === activeStudentId) {
        return;
      }

      setActiveStudentId(studentId);
      writeActiveStudent(studentId);
      setActiveSession(readStoredSession(studentId));
    },
    [activeStudentId],
  );

  const startMix = useCallback((studentId: string, mix: StudyRemixMix) => {
    const session: StudyRemixPlayerSession = {
      completionEventSent: false,
      elapsedSeconds: 0,
      mix,
      status: 'playing',
      studentId,
      version: STUDY_REMIX_STORAGE_VERSION,
    };

    setActiveStudentId(studentId);
    writeActiveStudent(studentId);
    setActiveSession(session);

    void postPilotEngagement({
      chapterSlug: mix.chapterSlug,
      eventType: 'focus_mix_start',
      surface: 'study_remix',
    }).catch(() => undefined);
  }, []);

  const pause = useCallback(() => {
    setActiveSession((current) =>
      current?.status === 'playing'
        ? {
            ...current,
            status: 'paused',
          }
        : current,
    );
  }, []);

  const resume = useCallback(() => {
    setActiveSession((current) =>
      current &&
      current.status === 'paused' &&
      current.elapsedSeconds < getTotalSeconds(current.mix)
        ? {
            ...current,
            status: 'playing',
          }
        : current,
    );
  }, []);

  const endSession = useCallback(() => {
    const studentId = activeSession?.studentId ?? activeStudentId;
    if (studentId) {
      try {
        window.sessionStorage.removeItem(playerStorageKey(studentId));
      } catch {
        // The in-memory player can still end normally.
      }
    }

    setActiveSession(null);
  }, [activeSession?.studentId, activeStudentId]);

  const replay = useCallback(() => {
    if (!activeSession) {
      return;
    }

    startMix(activeSession.studentId, activeSession.mix);
  }, [activeSession, startMix]);

  const remainingSeconds = activeSession
    ? Math.max(
        0,
        getTotalSeconds(activeSession.mix) - activeSession.elapsedSeconds,
      )
    : 0;
  const activeTrackIndex = activeSession
    ? getTrackIndex(activeSession.mix, activeSession.elapsedSeconds)
    : 0;

  const contextValue = useMemo<StudyRemixContextValue>(
    () => ({
      activeSession,
      activeTrackIndex,
      endSession,
      pause,
      registerStudent,
      remainingSeconds,
      replay,
      resume,
      startMix,
    }),
    [
      activeSession,
      activeTrackIndex,
      endSession,
      pause,
      registerStudent,
      remainingSeconds,
      replay,
      resume,
      startMix,
    ],
  );

  const currentTrack = activeSession?.mix.tracks[activeTrackIndex];
  const showMiniPlayer =
    hasHydrated &&
    Boolean(activeSession && currentTrack) &&
    pathname !== '/dashboard' &&
    (pathname.startsWith('/chapters') || pathname.startsWith('/subjects'));
  const needsLessonOffset =
    pathname.includes('/lessons/') || pathname.endsWith('/notes');

  return (
    <StudyRemixContext.Provider value={contextValue}>
      {children}
      {showMiniPlayer && activeSession && currentTrack ? (
        <aside
          aria-label="Study Remix focus player"
          className={`${styles.miniPlayer} ${
            needsLessonOffset ? styles.miniPlayerLessonOffset : ''
          }`}
        >
          <span
            aria-hidden="true"
            className={`${styles.miniDisc} ${
              activeSession.status === 'playing' ? styles.miniDiscPlaying : ''
            }`}
          />
          <span className={styles.miniCopy}>
            <small>
              {activeSession.status === 'complete'
                ? 'Mix complete'
                : `${activeSession.mix.subject} · Track ${activeTrackIndex + 1}`}
            </small>
            <strong aria-live="polite">
              {activeSession.status === 'complete'
                ? activeSession.mix.chapterTitle
                : currentTrack.title}
            </strong>
          </span>
          <time
            aria-label={`${formatTimer(remainingSeconds)} remaining`}
            className={styles.miniTimer}
            role="timer"
          >
            {formatTimer(remainingSeconds)}
          </time>
          <span className={styles.miniActions}>
            {activeSession.status === 'complete' ? (
              <button onClick={replay} type="button">
                Replay
              </button>
            ) : (
              <button
                onClick={
                  activeSession.status === 'playing' ? pause : resume
                }
                type="button"
              >
                {activeSession.status === 'playing' ? 'Pause' : 'Resume'}
              </button>
            )}
            <Link href={currentTrack.href} prefetch={false}>
              Open track
            </Link>
            <button onClick={endSession} type="button">
              End
            </button>
          </span>
        </aside>
      ) : null}
    </StudyRemixContext.Provider>
  );
}

export function useStudyRemix() {
  const context = useContext(StudyRemixContext);
  if (!context) {
    throw new Error('useStudyRemix must be used inside StudyRemixProvider.');
  }

  return context;
}
