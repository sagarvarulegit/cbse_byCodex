'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ReadingSection = {
  id: string;
  label: string;
};

type ReadingCompanionProps = {
  chapterSlug: string;
  chapterTitle: string;
  contentRootId: string;
  readingId?: string;
  sections: ReadingSection[];
  studentId: string;
};

type SavedReadingPlace = {
  sectionId: string;
  sectionLabel: string;
  updatedAt: string;
};

const STORAGE_PREFIX = 'cbse-reading-place:v1';

function storageKey(
  studentId: string,
  chapterSlug: string,
  contentRootId: string,
) {
  return `${STORAGE_PREFIX}:${studentId}:${chapterSlug}:${contentRootId}`;
}

function isSavedReadingPlace(value: unknown): value is SavedReadingPlace {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<SavedReadingPlace>;
  return (
    typeof candidate.sectionId === 'string' &&
    typeof candidate.sectionLabel === 'string' &&
    typeof candidate.updatedAt === 'string'
  );
}

export default function ReadingCompanion({
  chapterSlug,
  chapterTitle,
  contentRootId,
  readingId = contentRootId,
  sections,
  studentId,
}: ReadingCompanionProps) {
  const availableSections = useMemo(
    () => sections.filter((section) => section.id && section.label),
    [sections],
  );
  const [activeSectionId, setActiveSectionId] = useState(
    availableSections[0]?.id ?? contentRootId,
  );
  const [focusMode, setFocusMode] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resumePlace, setResumePlace] = useState<SavedReadingPlace | null>(
    null,
  );
  const hasUserScrolled = useRef(false);

  const activeSection =
    availableSections.find((section) => section.id === activeSectionId) ??
    availableSections[0];

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(
        storageKey(studentId, chapterSlug, readingId),
      );
      if (!rawValue) {
        return;
      }

      const parsed = JSON.parse(rawValue) as unknown;
      if (
        isSavedReadingPlace(parsed) &&
        document.getElementById(parsed.sectionId)
      ) {
        setResumePlace(parsed);
      }
    } catch {
      setResumePlace(null);
    }
  }, [chapterSlug, readingId, studentId]);

  useEffect(() => {
    let animationFrame = 0;
    let lastSectionId = '';

    function updateReadingState() {
      const contentRoot = document.getElementById(contentRootId);
      if (!contentRoot) {
        return;
      }

      const rootRect = contentRoot.getBoundingClientRect();
      const rootStart = window.scrollY + rootRect.top;
      const rootEnd = rootStart + contentRoot.offsetHeight - window.innerHeight;
      const progressDistance = Math.max(1, rootEnd - rootStart);
      const nextProgress = Math.min(
        100,
        Math.max(
          0,
          ((window.scrollY - rootStart + window.innerHeight * 0.2) /
            progressDistance) *
            100,
        ),
      );
      setProgress(nextProgress);

      let nextSection = availableSections[0];
      for (const section of availableSections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 190) {
          nextSection = section;
        }
      }

      if (!nextSection || nextSection.id === lastSectionId) {
        return;
      }

      lastSectionId = nextSection.id;
      setActiveSectionId(nextSection.id);

      const nextPlace: SavedReadingPlace = {
        sectionId: nextSection.id,
        sectionLabel: nextSection.label,
        updatedAt: new Date().toISOString(),
      };

      if (hasUserScrolled.current) {
        try {
          window.localStorage.setItem(
            storageKey(studentId, chapterSlug, readingId),
            JSON.stringify(nextPlace),
          );
        } catch {
          // Reading remains fully usable when storage is blocked.
        }
      }
    }

    function scheduleUpdate() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(updateReadingState);
    }

    function handleScroll() {
      hasUserScrolled.current = true;
      scheduleUpdate();
    }

    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    availableSections,
    chapterSlug,
    contentRootId,
    readingId,
    studentId,
  ]);

  useEffect(() => {
    document.body.classList.toggle('reading-focus-active', focusMode);
    return () => {
      document.body.classList.remove('reading-focus-active');
    };
  }, [focusMode]);

  function openSection(section: ReadingSection) {
    setActiveSectionId(section.id);
    setResumePlace(null);
  }

  function resumeReading() {
    if (!resumePlace) {
      return;
    }

    document.getElementById(resumePlace.sectionId)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
    setResumePlace(null);
  }

  return (
    <aside
      aria-label={`${chapterTitle} reading tools`}
      className="reading-companion"
    >
      <span className="reading-companion-now">
        <span>Now reading</span>
        <strong>{activeSection?.label ?? chapterTitle}</strong>
      </span>

      <span
        aria-label={`${Math.round(progress)} percent through the visible notes`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress)}
        className="reading-companion-progress"
        role="progressbar"
      >
        <span style={{ width: `${progress}%` }} />
      </span>

      <span className="reading-companion-percent">
        {Math.round(progress)}%
      </span>

      <div className="reading-companion-actions">
        {resumePlace && resumePlace.sectionId !== activeSectionId ? (
          <button
            className="reading-resume-button"
            onClick={resumeReading}
            type="button"
          >
            Resume: {resumePlace.sectionLabel}
          </button>
        ) : null}

        <details className="reading-contents-menu">
          <summary>Contents</summary>
          <nav aria-label={`${chapterTitle} reading sections`}>
            {availableSections.map((section) => (
              <a
                aria-current={
                  section.id === activeSectionId ? 'location' : undefined
                }
                href={`#${section.id}`}
                key={section.id}
                onClick={() => openSection(section)}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </details>

        <button
          aria-pressed={focusMode}
          className="reading-focus-button"
          onClick={() => setFocusMode((current) => !current)}
          type="button"
        >
          {focusMode ? 'Exit focus' : 'Focus mode'}
        </button>
      </div>
    </aside>
  );
}
