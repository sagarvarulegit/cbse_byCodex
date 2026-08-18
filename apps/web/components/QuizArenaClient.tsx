'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import QuizPaywallModal from './QuizPaywallModal';
import { FREE_DAILY_QUIZ_LIMIT } from '../lib/payments';

export type ChapterQuizCardItem = {
  slug: string;
  title: string;
  subjectSlug: string;
  subjectTitle: string;
  subjectCode: string;
  questionCount: number;
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

export default function QuizArenaClient({
  chapters,
  hasUnlimitedQuizzes,
  dailyQuizzesTakenToday,
  token,
  userFullName,
  userEmail,
}: QuizArenaClientProps) {
  const router = useRouter();
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [unlimitedUnlocked, setUnlimitedUnlocked] = useState(hasUnlimitedQuizzes);
  const [quizzesTaken, setQuizzesTaken] = useState(dailyQuizzesTakenToday);

  const remainingFreeQuizzes = Math.max(0, FREE_DAILY_QUIZ_LIMIT - quizzesTaken);
  const isFreeLimitReached = !unlimitedUnlocked && remainingFreeQuizzes <= 0;

  // Filtered chapters list
  const filteredChapters = useMemo(() => {
    return chapters.filter((c) => {
      const matchesSubject = activeSubject === 'all' || c.subjectSlug === activeSubject;
      const matchesQuery =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subjectTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesQuery;
    });
  }, [chapters, activeSubject, searchQuery]);

  // Surprise Me / Random Challenge handler
  function handleSurpriseMe() {
    if (isFreeLimitReached) {
      setIsPaywallOpen(true);
      return;
    }

    setIsRolling(true);
    const eligibleChapters =
      activeSubject === 'all'
        ? chapters
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

  return (
    <div className="quiz-arena-root">
      {/* Hero: Header, Random Roller & Daily Counter */}
      <div className="arena-hero-banner">
        <div className="hero-content">
          <span className="hero-eyebrow">⚡ CBSE Class 10 Knowledge Arena</span>
          <h1>Instant Chapter Quizzes &amp; Surprise Challenges</h1>
          <p className="hero-description">
            Test your understanding across all 48 NCERT chapters with instant scoring, step-by-step explanations, and spaced repetition mistake reinforcement.
          </p>

          <div className="hero-actions-row">
            <button
              type="button"
              className="btn-surprise-me"
              onClick={handleSurpriseMe}
              disabled={isRolling}
            >
              <span className={`dice-icon ${isRolling ? 'rolling' : ''}`}>🎲</span>
              <strong>{isRolling ? 'Picking a Chapter...' : 'Surprise Me: Roll Random Quiz →'}</strong>
            </button>

            {/* Daily Quiz Limit Status Meter */}
            <div className="daily-allowance-box">
              {unlimitedUnlocked ? (
                <div className="allowance-unlocked">
                  <span className="unlocked-icon">🔓</span>
                  <div>
                    <strong>Unlimited Quizzes Active</strong>
                    <span>All 48 chapters unlocked for 2025–26</span>
                  </div>
                </div>
              ) : (
                <div className="allowance-free">
                  <span className="free-counter-badge">{remainingFreeQuizzes} / {FREE_DAILY_QUIZ_LIMIT}</span>
                  <div>
                    <strong>Free Quizzes Left Today</strong>
                    <span>
                      {remainingFreeQuizzes > 0
                        ? `Resets at midnight IST`
                        : `Limit reached · `}
                      {!remainingFreeQuizzes && (
                        <button
                          type="button"
                          className="btn-unlock-inline"
                          onClick={() => setIsPaywallOpen(true)}
                        >
                          Unlock Unlimited (₹199) →
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="arena-filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-field"
            placeholder="Search any chapter (e.g. Chemical Reactions, Light, Quadratic, Heredity)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="subject-filter-pills">
          <button
            type="button"
            className={`filter-pill ${activeSubject === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSubject('all')}
          >
            All Subjects ({chapters.length})
          </button>
          <button
            type="button"
            className={`filter-pill ${activeSubject === 'mathematics-standard' ? 'active' : ''}`}
            onClick={() => setActiveSubject('mathematics-standard')}
          >
            📐 Maths Standard
          </button>
          <button
            type="button"
            className={`filter-pill ${activeSubject === 'science' ? 'active' : ''}`}
            onClick={() => setActiveSubject('science')}
          >
            🔬 Science
          </button>
          <button
            type="button"
            className={`filter-pill ${activeSubject === 'social-science' ? 'active' : ''}`}
            onClick={() => setActiveSubject('social-science')}
          >
            🌍 Social Science
          </button>
          <button
            type="button"
            className={`filter-pill ${activeSubject === 'english-language-and-literature' ? 'active' : ''}`}
            onClick={() => setActiveSubject('english-language-and-literature')}
          >
            📚 English
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="chapters-quiz-grid">
        {filteredChapters.map((chapter) => {
          const hasScore = chapter.bestScorePercent > 0;
          return (
            <div className="quiz-chapter-card" key={chapter.slug}>
              <div className="card-topline">
                <span className="subject-tag">{chapter.subjectTitle}</span>
                {hasScore ? (
                  <span className="score-badge">
                    🏆 {Math.round(chapter.bestScorePercent)}% Best
                  </span>
                ) : (
                  <span className="unattempted-badge">🌱 Not Attempted</span>
                )}
              </div>

              <h3>{chapter.title}</h3>

              <div className="quiz-meta-row">
                <span>📝 {chapter.questionCount || 10} NCERT MCQs</span>
                <span>•</span>
                <span>⏱️ ~10 Mins</span>
              </div>

              <Link
                href={`/chapters/${chapter.slug}/quiz`}
                className="btn-start-quiz"
                onClick={(e) => handleStartQuizClick(e, chapter.slug)}
              >
                ⚡ Start Quiz →
              </Link>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="no-results-box">
          <p>No chapters match your search "<strong>{searchQuery}</strong>".</p>
          <button
            type="button"
            className="btn-reset-filters"
            onClick={() => {
              setSearchQuery('');
              setActiveSubject('all');
            }}
          >
            Reset Filters
          </button>
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

      <style jsx>{`
        .quiz-arena-root {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.5rem 1rem 4rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .arena-hero-banner {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 20px;
          padding: 2rem 2.5rem;
          box-shadow: 6px 6px 0 #171513;
          margin-bottom: 2rem;
        }

        .hero-eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c25e00;
          display: block;
          margin-bottom: 0.35rem;
        }

        h1 {
          font-size: 1.85rem;
          font-weight: 800;
          color: #171513;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .hero-description {
          font-size: 0.9375rem;
          color: #5d5750;
          line-height: 1.5;
          margin: 0 0 1.5rem 0;
          max-width: 780px;
        }

        .hero-actions-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn-surprise-me {
          background: #171513;
          color: #ffffff;
          border: 2px solid #171513;
          border-radius: 12px;
          padding: 0.85rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          box-shadow: 3px 3px 0 #c25e00;
          transition: transform 0.15s ease, background 0.15s ease;
        }

        .btn-surprise-me:hover:not(:disabled) {
          background: #c25e00;
          transform: translateY(-2px);
        }

        .dice-icon {
          font-size: 1.25rem;
          display: inline-block;
        }

        .dice-icon.rolling {
          animation: spinDice 0.6s linear infinite;
        }

        @keyframes spinDice {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        .daily-allowance-box {
          background: #fbf8f3;
          border: 1.5px solid #e7e2d6;
          border-radius: 12px;
          padding: 0.6rem 1rem;
        }

        .allowance-unlocked,
        .allowance-free {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .unlocked-icon {
          font-size: 1.5rem;
        }

        .free-counter-badge {
          background: #171513;
          color: #ffffff;
          font-size: 0.875rem;
          font-weight: 900;
          padding: 0.35rem 0.65rem;
          border-radius: 8px;
        }

        .allowance-unlocked strong,
        .allowance-free strong {
          display: block;
          font-size: 0.875rem;
          color: #171513;
        }

        .allowance-unlocked span,
        .allowance-free span {
          display: block;
          font-size: 0.75rem;
          color: #787168;
        }

        .btn-unlock-inline {
          background: transparent;
          border: none;
          color: #c25e00;
          font-weight: 800;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font-size: 0.75rem;
        }

        /* Filter and Search */
        .arena-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-input-wrap {
          position: relative;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          color: #787168;
        }

        .search-field {
          width: 100%;
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 12px;
          padding: 0.85rem 2.5rem 0.85rem 2.75rem;
          font-size: 0.9375rem;
          box-shadow: 3px 3px 0 #171513;
          box-sizing: border-box;
        }

        .search-field:focus {
          outline: none;
          border-color: #c25e00;
        }

        .btn-clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #787168;
          font-size: 1rem;
          cursor: pointer;
        }

        .subject-filter-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-pill {
          background: #ffffff;
          border: 1.5px solid #d4cebe;
          border-radius: 999px;
          padding: 0.45rem 0.9rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: #5d5750;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .filter-pill:hover {
          border-color: #171513;
          color: #171513;
        }

        .filter-pill.active {
          background: #171513;
          color: #ffffff;
          border-color: #171513;
          box-shadow: 2px 2px 0 rgba(0,0,0,0.15);
        }

        /* Chapters Grid */
        .chapters-quiz-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 1.25rem;
        }

        .quiz-chapter-card {
          background: #ffffff;
          border: 2px solid #171513;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 4px 4px 0 #171513;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.15s ease;
        }

        .quiz-chapter-card:hover {
          transform: translateY(-2px);
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .subject-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #787168;
        }

        .score-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          background: #dcfce7;
          color: #166534;
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          border: 1px solid #bbf7d0;
        }

        .unattempted-badge {
          font-size: 0.6875rem;
          color: #8c827a;
        }

        .quiz-chapter-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.5rem 0;
          line-height: 1.35;
        }

        .quiz-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #787168;
          margin-bottom: 1.25rem;
        }

        .btn-start-quiz {
          display: block;
          text-align: center;
          background: #171513;
          color: #ffffff;
          border-radius: 8px;
          padding: 0.65rem 1rem;
          font-size: 0.8125rem;
          font-weight: 800;
          text-decoration: none;
          transition: background 0.15s ease;
        }

        .btn-start-quiz:hover {
          background: #c25e00;
        }

        .no-results-box {
          text-align: center;
          padding: 3rem 1rem;
          background: #fbf8f3;
          border: 2px dashed #d4cebe;
          border-radius: 16px;
          margin-top: 1rem;
        }

        .btn-reset-filters {
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 700;
          cursor: pointer;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .arena-hero-banner {
            padding: 1.5rem;
          }
          .hero-actions-row {
            flex-direction: column;
            align-items: stretch;
          }
          .chapters-quiz-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
