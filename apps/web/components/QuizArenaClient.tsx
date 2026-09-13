'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const QuizPaywallModal = dynamic(() => import('./QuizPaywallModal'));
import { FREE_DAILY_QUIZ_LIMIT } from '../lib/payments';

export type ChapterQuizCardItem = {
  slug: string;
  title: string;
  subjectSlug: string;
  subjectTitle: string;
  subjectCode: string;
  unitId?: string;
  unitTitle?: string;
  unitMarks?: number;
  questionCount: number;
  exemplarQuestionCount?: number;
  bestScorePercent: number;
  masteryScore: number;
};

export type QuizArenaClientProps = {
  chapters: ChapterQuizCardItem[];
  hasUnlimitedQuizzes: boolean;
  dailyQuizzesTakenToday: number;
  token?: string | null;
  userFullName?: string;
  userEmail?: string;
};

type SubjectHubMeta = {
  slug: string;
  title: string;
  icon: string;
  code: string;
  subtitle: string;
  examMarks: string;
};

const SUBJECT_METAS: SubjectHubMeta[] = [
  {
    slug: 'science',
    title: 'Science',
    icon: '🔬',
    code: '086',
    subtitle: 'Physics, Chemistry & Biology',
    examMarks: '80 Marks Theory',
  },
  {
    slug: 'mathematics',
    title: 'Mathematics',
    icon: '📐',
    code: '041 / 241',
    subtitle: 'CBSE Standard & Basic',
    examMarks: '80 Marks Theory',
  },
  {
    slug: 'social-science',
    title: 'Social Science',
    icon: '🌍',
    code: '087',
    subtitle: 'History, Geo, Civics & Eco',
    examMarks: '80 Marks Theory',
  },
  {
    slug: 'english-language-and-literature',
    title: 'English',
    icon: '📚',
    code: '184',
    subtitle: 'First Flight, Footprints & Grammar',
    examMarks: '80 Marks Theory',
  },
];

export default function QuizArenaClient({
  chapters,
  hasUnlimitedQuizzes,
  dailyQuizzesTakenToday,
  token,
  userFullName,
  userEmail,
}: QuizArenaClientProps) {
  const router = useRouter();
  // Default to single active subject: Science
  const [activeSubject, setActiveSubject] = useState<string>('science');
  const [activeMode, setActiveMode] = useState<'all' | 'standard' | 'exemplar'>('all');
  const [viewMode, setViewMode] = useState<'units' | 'grid'>('units');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [unlimitedUnlocked, setUnlimitedUnlocked] = useState(hasUnlimitedQuizzes);
  const [quizzesTaken, setQuizzesTaken] = useState(dailyQuizzesTakenToday);

  // Read ?subject=... from URL on initial client load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const subParam = params.get('subject');
      if (subParam && SUBJECT_METAS.some((m) => m.slug === subParam)) {
        setActiveSubject(subParam);
      }
    }
  }, []);

  function handleSelectSubject(slug: string) {
    setActiveSubject(slug);
    setSearchQuery('');
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      url.searchParams.set('subject', slug);
      window.history.replaceState({}, '', url.toString());
    }
  }

  function toggleUnitCollapse(unitKey: string) {
    setCollapsedUnits((prev) => ({
      ...prev,
      [unitKey]: !prev[unitKey],
    }));
  }

  const remainingFreeQuizzes = Math.max(0, FREE_DAILY_QUIZ_LIMIT - quizzesTaken);
  const isFreeLimitReached = !unlimitedUnlocked && remainingFreeQuizzes <= 0;
  const isSearching = searchQuery.trim().length > 0;

  // Compute subject overview stats
  const subjectStats = useMemo(() => {
    return SUBJECT_METAS.map((meta) => {
      const subjectChapters = chapters.filter((c) => c.subjectSlug === meta.slug);
      const totalChapters = subjectChapters.length;
      const totalStandardQuestions = subjectChapters.reduce((acc, c) => acc + (c.questionCount || 10), 0);
      const totalExemplarQuestions = subjectChapters.reduce(
        (acc, c) => acc + (c.exemplarQuestionCount || 0),
        0,
      );
      const attemptedCount = subjectChapters.filter((c) => c.bestScorePercent > 0).length;
      const percentComplete = totalChapters > 0 ? Math.round((attemptedCount / totalChapters) * 100) : 0;

      return {
        ...meta,
        totalChapters,
        totalStandardQuestions,
        totalExemplarQuestions,
        attemptedCount,
        percentComplete,
      };
    });
  }, [chapters]);

  // Filtered chapters list: if searching, search across all subjects; otherwise, active subject only
  const filteredChapters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return chapters.filter((c) => {
      const matchesSubject = isSearching ? true : c.subjectSlug === activeSubject;
      const matchesMode =
        activeMode === 'all' ||
        (activeMode === 'standard' && true) ||
        (activeMode === 'exemplar' && (c.exemplarQuestionCount ?? 0) > 0);
      const matchesQuery =
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.subjectTitle.toLowerCase().includes(query) ||
        (c.unitTitle && c.unitTitle.toLowerCase().includes(query));
      return matchesSubject && matchesMode && matchesQuery;
    });
  }, [chapters, activeSubject, activeMode, searchQuery, isSearching]);

  // Group chapters by syllabus unit or subject
  const groupedSections = useMemo(() => {
    if (isSearching) {
      // Searching: group results by subject first, then by unit
      const subjectGroups: Array<{
        subjectKey: string;
        subjectTitle: string;
        subjectIcon: string;
        units: Array<{
          unitKey: string;
          unitTitle: string;
          unitMarks?: number;
          chapters: ChapterQuizCardItem[];
        }>;
      }> = [];

      for (const meta of SUBJECT_METAS) {
        const subChapters = filteredChapters.filter((c) => c.subjectSlug === meta.slug);
        if (subChapters.length === 0) continue;

        const unitMap = new Map<string, { unitTitle: string; unitMarks?: number; chapters: ChapterQuizCardItem[] }>();
        for (const chap of subChapters) {
          const uKey = chap.unitTitle || 'General Units';
          if (!unitMap.has(uKey)) {
            unitMap.set(uKey, {
              unitTitle: uKey,
              unitMarks: chap.unitMarks,
              chapters: [],
            });
          }
          unitMap.get(uKey)!.chapters.push(chap);
        }

        subjectGroups.push({
          subjectKey: meta.slug,
          subjectTitle: meta.title,
          subjectIcon: meta.icon,
          units: Array.from(unitMap.values()).map((u) => ({
            unitKey: u.unitTitle,
            unitTitle: u.unitTitle,
            unitMarks: u.unitMarks,
            chapters: u.chapters,
          })),
        });
      }

      return subjectGroups;
    } else {
      // Single subject active: group directly by its units
      const unitMap = new Map<string, { unitTitle: string; unitMarks?: number; chapters: ChapterQuizCardItem[] }>();
      for (const chap of filteredChapters) {
        const uKey = chap.unitTitle || 'General Units';
        if (!unitMap.has(uKey)) {
          unitMap.set(uKey, {
            unitTitle: uKey,
            unitMarks: chap.unitMarks,
            chapters: [],
          });
        }
        unitMap.get(uKey)!.chapters.push(chap);
      }

      const activeMeta = SUBJECT_METAS.find((m) => m.slug === activeSubject);

      return [
        {
          subjectKey: activeSubject,
          subjectTitle: activeMeta?.title || 'Subject',
          subjectIcon: activeMeta?.icon || '📖',
          units: Array.from(unitMap.values()).map((u) => ({
            unitKey: u.unitTitle,
            unitTitle: u.unitTitle,
            unitMarks: u.unitMarks,
            chapters: u.chapters,
          })),
        },
      ];
    }
  }, [filteredChapters, activeSubject, isSearching]);

  // Surprise Me / Random Challenge handler
  function handleSurpriseMe() {
    if (isFreeLimitReached) {
      setIsPaywallOpen(true);
      return;
    }

    setIsRolling(true);
    const eligibleChapters =
      isSearching
        ? filteredChapters
        : chapters.filter((c) => c.subjectSlug === activeSubject);

    const pool = eligibleChapters.length > 0 ? eligibleChapters : chapters;
    const randomChapter = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      setIsRolling(false);
      if (randomChapter) {
        router.push(`/chapters/${randomChapter.slug}/quiz`);
      }
    }, 600);
  }

  function handleStartQuizClick(e: React.MouseEvent, chapterSlug: string) {
    if (isFreeLimitReached) {
      e.preventDefault();
      setIsPaywallOpen(true);
    }
  }

  const activeSubjectMeta = SUBJECT_METAS.find((m) => m.slug === activeSubject);

  return (
    <div className="quiz-arena-root">
      {/* Hero: Header, Random Roller & Daily Counter */}
      <div className="arena-hero-banner">
        <div className="hero-content">
          <span className="hero-eyebrow">⚡ CBSE Class 10 Knowledge Arena</span>
          <h1>Instant Chapter Quizzes &amp; Board Challenges</h1>
          <p className="hero-description">
            Test your understanding across all 4 core CBSE Class 10 subjects with instant scoring, step-by-step
            explanations, and challenging HOTS Exemplar practice problems.
          </p>

          <div className="hero-actions-row">
            <button
              type="button"
              className="btn-surprise-me"
              onClick={handleSurpriseMe}
              disabled={isRolling}
            >
              <span className={`dice-icon ${isRolling ? 'rolling' : ''}`}>🎲</span>
              <strong>
                {isRolling
                  ? 'Picking a Chapter...'
                  : `Surprise Me: Roll Random ${activeSubjectMeta?.title ?? ''} Quiz →`}
              </strong>
            </button>

            {/* Daily Quiz Limit Status Meter */}
            <div className="daily-allowance-box">
              {unlimitedUnlocked ? (
                <div className="allowance-unlocked">
                  <span className="unlocked-icon">🔓</span>
                  <div className="allowance-copy">
                    <strong>Unlimited Quizzes Active</strong>
                    <span>All NCERT chapters &amp; HOTS unlocked</span>
                  </div>
                </div>
              ) : (
                <div className="allowance-free">
                  <span className="free-counter-badge">
                    {remainingFreeQuizzes} / {FREE_DAILY_QUIZ_LIMIT}
                  </span>
                  <div className="allowance-copy">
                    <strong>Free Quizzes Left Today</strong>
                    <span>
                      {remainingFreeQuizzes > 0 ? (
                        `Resets at midnight IST`
                      ) : (
                        <>
                          Limit reached ·{' '}
                          <button
                            type="button"
                            className="btn-unlock-inline"
                            onClick={() => setIsPaywallOpen(true)}
                          >
                            Unlock Unlimited (₹199) →
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Hub Deck: 4 Interactive Textbook Tabs */}
      <section className="subject-hub-deck" aria-label="Subject Quick Selection">
        {subjectStats.map((stat) => {
          const isSelected = activeSubject === stat.slug && !isSearching;
          return (
            <div
              key={stat.slug}
              role="button"
              tabIndex={0}
              className={`subject-hub-card ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectSubject(stat.slug)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectSubject(stat.slug);
                }
              }}
            >
              <div className="subject-hub-top">
                <span className="subject-hub-icon">{stat.icon}</span>
                {isSelected ? (
                  <span className="subject-active-tag">✓ Active Subject</span>
                ) : (
                  <span className="subject-hub-code">Code {stat.code}</span>
                )}
              </div>
              <h3>{stat.title}</h3>
              <p className="subject-hub-sub">{stat.subtitle}</p>

              <div className="subject-hub-stats">
                <span className="subject-hub-stat-pill">📖 {stat.totalChapters} Ch</span>
                <span className="subject-hub-stat-pill">🎯 {stat.totalStandardQuestions} Qs</span>
                {stat.totalExemplarQuestions > 0 && (
                  <span className="subject-hub-stat-pill hots-pill">🔥 {stat.totalExemplarQuestions} HOTS</span>
                )}
              </div>

              <div className="subject-hub-progress-track">
                <div
                  className="subject-hub-progress-fill"
                  style={{ width: `${Math.min(100, stat.percentComplete)}%` }}
                />
              </div>
              <div className="subject-hub-progress-text">
                <span>{stat.attemptedCount} of {stat.totalChapters} Tested</span>
                <span>{stat.percentComplete}% Done</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Filter and Search Bar */}
      <div className="arena-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-field"
            placeholder="Search any chapter or unit across all subjects (e.g. Chemical Reactions, Light, Quadratic, Heredity, Nationalism)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search status notice when searching */}
        {isSearching && (
          <div className="search-status-bar">
            <span>
              🔍 Found <strong>{filteredChapters.length}</strong> chapter{filteredChapters.length !== 1 ? 's' : ''} matching &ldquo;{searchQuery}&rdquo; across all subjects
            </span>
            <button
              type="button"
              className="btn-clear-search-link"
              onClick={() => setSearchQuery('')}
            >
              ✕ Clear Search (Back to {activeSubjectMeta?.title})
            </button>
          </div>
        )}

        {/* Filter Controls Row */}
        <div className="filter-controls-row">
          {/* Subject Filter Pills */}
          <div className="subject-filter-pills">
            <button
              type="button"
              className={`filter-pill ${activeSubject === 'science' && !isSearching ? 'active' : ''}`}
              onClick={() => handleSelectSubject('science')}
            >
              🔬 Science ({subjectStats.find((s) => s.slug === 'science')?.totalChapters ?? 13})
            </button>
            <button
              type="button"
              className={`filter-pill ${activeSubject === 'mathematics' && !isSearching ? 'active' : ''}`}
              onClick={() => handleSelectSubject('mathematics')}
            >
              📐 Mathematics ({subjectStats.find((s) => s.slug === 'mathematics')?.totalChapters ?? 14})
            </button>
            <button
              type="button"
              className={`filter-pill ${activeSubject === 'social-science' && !isSearching ? 'active' : ''}`}
              onClick={() => handleSelectSubject('social-science')}
            >
              🌍 Social Science ({subjectStats.find((s) => s.slug === 'social-science')?.totalChapters ?? 22})
            </button>
            <button
              type="button"
              className={`filter-pill ${activeSubject === 'english-language-and-literature' && !isSearching ? 'active' : ''}`}
              onClick={() => handleSelectSubject('english-language-and-literature')}
            >
              📚 English ({subjectStats.find((s) => s.slug === 'english-language-and-literature')?.totalChapters ?? 40})
            </button>
          </div>

          {/* Mode Selector & View Mode Switcher */}
          <div className="secondary-filters-row">
            <div className="mode-filter-pills">
              <button
                type="button"
                className={`filter-pill mode-pill ${activeMode === 'all' ? 'active' : ''}`}
                onClick={() => setActiveMode('all')}
              >
                All Modes
              </button>
              <button
                type="button"
                className={`filter-pill mode-pill ${activeMode === 'standard' ? 'active' : ''}`}
                onClick={() => setActiveMode('standard')}
              >
                🎯 Standard
              </button>
              <button
                type="button"
                className={`filter-pill mode-pill hots-toggle ${activeMode === 'exemplar' ? 'active' : ''}`}
                onClick={() => setActiveMode('exemplar')}
              >
                🔥 Exemplar HOTS
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="view-toggle-wrap">
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'units' ? 'active' : ''}`}
                onClick={() => setViewMode('units')}
                title="Group chapters by official CBSE syllabus units"
              >
                📑 By Units
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="View all chapters in a flat grid"
              >
                ▦ Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Content Display */}
      {filteredChapters.length === 0 ? (
        <div className="no-results-box">
          <p>
            No chapters match your search &ldquo;<strong>{searchQuery}</strong>&rdquo;.
          </p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSearchQuery('');
              setActiveMode('all');
            }}
          >
            Reset Search
          </button>
        </div>
      ) : viewMode === 'units' ? (
        /* Unit-Grouped View */
        <div className="units-grouped-container">
          {groupedSections.map((sec) => (
            <div key={sec.subjectKey} className="subject-section-block">
              {isSearching && (
                <div className="subject-section-banner">
                  <div className="subject-banner-left">
                    <span className="subject-banner-icon">{sec.subjectIcon}</span>
                    <h2>{sec.subjectTitle}</h2>
                  </div>
                  <span className="subject-banner-badge">
                    {sec.units.reduce((acc, u) => acc + u.chapters.length, 0)} Matches
                  </span>
                </div>
              )}

              {sec.units.map((unit) => {
                const isCollapsed = Boolean(collapsedUnits[unit.unitKey]);
                return (
                  <div key={unit.unitKey} className="unit-group-section">
                    <div
                      className="unit-group-header"
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleUnitCollapse(unit.unitKey)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleUnitCollapse(unit.unitKey);
                        }
                      }}
                      title="Click to collapse or expand this unit"
                    >
                      <div className="unit-title-row">
                        <span className={`unit-toggle-chevron ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
                        <span className="unit-mark-icon">🔖</span>
                        <h3>{unit.unitTitle}</h3>
                        {unit.unitMarks ? (
                          <span className="unit-marks-badge">{unit.unitMarks} Marks CBSE</span>
                        ) : null}
                      </div>
                      <span className="unit-chapters-count">
                        {unit.chapters.length} Chapter{unit.chapters.length > 1 ? 's' : ''}
                        <span className="unit-collapse-hint">
                          {isCollapsed ? ' · Expand' : ' · Collapse'}
                        </span>
                      </span>
                    </div>

                    {!isCollapsed && (
                      <div className="chapters-quiz-grid">
                        {unit.chapters.map((chapter) => (
                          <QuizCard
                            key={`${chapter.subjectSlug}-${chapter.slug}`}
                            chapter={chapter}
                            onStartQuizClick={handleStartQuizClick}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        /* Compact Grid View */
        <div className="chapters-quiz-grid">
          {filteredChapters.map((chapter) => (
            <QuizCard
              key={`${chapter.subjectSlug}-${chapter.slug}`}
              chapter={chapter}
              onStartQuizClick={handleStartQuizClick}
            />
          ))}
        </div>
      )}

      {/* Paywall Modal */}
      <QuizPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onSuccess={() => {
          setUnlimitedUnlocked(true);
        }}
        token={token}
        userFullName={userFullName}
        userEmail={userEmail}
      />
    </div>
  );
}

function QuizCard({
  chapter,
  onStartQuizClick,
}: {
  chapter: ChapterQuizCardItem;
  onStartQuizClick: (e: React.MouseEvent, slug: string) => void;
}) {
  const hasScore = chapter.bestScorePercent > 0;
  const hasExemplar = (chapter.exemplarQuestionCount ?? 0) > 0;

  return (
    <div className="quiz-chapter-card">
      <div className="card-topline">
        <span className="subject-tag">{chapter.subjectTitle}</span>
        {hasScore ? (
          <span className="score-badge">
            🏆 {Math.round(chapter.bestScorePercent)}% Best
          </span>
        ) : (
          <span className="unattempted-badge">🌱 Ready to Practice</span>
        )}
      </div>

      <h3>{chapter.title}</h3>

      <div className="quiz-meta-row">
        <span>📝 {chapter.questionCount || 10} Standard Qs</span>
        {hasExemplar && (
          <>
            <span>•</span>
            <span className="exemplar-hots-tag">
              🔥 {chapter.exemplarQuestionCount} HOTS Exemplar
            </span>
          </>
        )}
      </div>

      <div className="card-actions-col">
        <Link
          href={`/chapters/${chapter.slug}/quiz`}
          className="btn-start-quiz"
          onClick={(e) => onStartQuizClick(e, chapter.slug)}
        >
          ⚡ Start Standard Quiz →
        </Link>
        {hasExemplar && (
          <Link
            href={`/chapters/${chapter.slug}/quiz?mode=exemplar`}
            className="btn-exemplar-quiz"
            onClick={(e) => onStartQuizClick(e, chapter.slug)}
          >
            🔥 Exemplar HOTS Quiz ({chapter.exemplarQuestionCount} Qs) →
          </Link>
        )}
      </div>
    </div>
  );
}
