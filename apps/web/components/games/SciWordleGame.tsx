'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  getDailyTerm,
  getRandomTerm,
  evaluateGuess,
  VALID_GUESS_WORDS,
  type SciWordleTerm,
  type EvaluatedLetter,
  type LetterState,
} from '../../lib/games/sci-wordle-data';
import { sounds } from '../../lib/games/sound-effects';

export type WordleMode = 'daily' | 'unlimited';

interface WordleStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guesses: { [key: number]: number }; // 1: count, 2: count, etc.
  lastPlayedDate?: string;
}

const DEFAULT_STATS: WordleStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
};

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

export default function SciWordleGame() {
  const [mode, setMode] = useState<WordleMode>('daily');
  const [targetTerm, setTargetTerm] = useState<SciWordleTerm | null>(null);
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'IN_PROGRESS' | 'WON' | 'LOST'>('IN_PROGRESS');
  const [evaluatedGuesses, setEvaluatedGuesses] = useState<EvaluatedLetter[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeRow, setShakeRow] = useState<boolean>(false);
  const [stats, setStats] = useState<WordleStats>(DEFAULT_STATS);
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Load sound preference & stats from localStorage
  useEffect(() => {
    setIsMuted(sounds.getIsMuted());

    const savedStats = localStorage.getItem('cbse_sciwordle_stats');
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch {
        // ignore
      }
    }
  }, []);

  // Initialize or switch puzzle
  const initGame = useCallback((chosenMode: WordleMode) => {
    setMode(chosenMode);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('IN_PROGRESS');
    setEvaluatedGuesses([]);
    setErrorMessage(null);
    setCopiedShare(false);

    if (chosenMode === 'daily') {
      const todayStr = new Date().toISOString().split('T')[0];
      const { term, dayNumber: dNum } = getDailyTerm(todayStr);
      setTargetTerm(term);
      setDayNumber(dNum);

      // Check if already completed today
      const savedDailyState = localStorage.getItem(`cbse_sciwordle_daily_${todayStr}`);
      if (savedDailyState) {
        try {
          const parsed = JSON.parse(savedDailyState);
          setGuesses(parsed.guesses || []);
          setGameStatus(parsed.gameStatus || 'IN_PROGRESS');
          if (parsed.guesses && Array.isArray(parsed.guesses)) {
            const evals = parsed.guesses.map((g: string) => evaluateGuess(g, term.word));
            setEvaluatedGuesses(evals);
          }
        } catch {
          // ignore
        }
      }
    } else {
      const random = getRandomTerm();
      setTargetTerm(random);
    }
  }, []);

  useEffect(() => {
    initGame('daily');
  }, [initGame]);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard letter states map: letter -> 'correct' | 'present' | 'absent'
  const letterStates = useMemo(() => {
    const map: Record<string, LetterState> = {};
    for (const row of evaluatedGuesses) {
      for (const item of row) {
        const current = map[item.letter];
        if (item.state === 'correct') {
          map[item.letter] = 'correct';
        } else if (item.state === 'present' && current !== 'correct') {
          map[item.letter] = 'present';
        } else if (item.state === 'absent' && !current) {
          map[item.letter] = 'absent';
        }
      }
    }
    return map;
  }, [evaluatedGuesses]);

  // Flash error toast with shake
  const showError = (msg: string) => {
    setErrorMessage(msg);
    setShakeRow(true);
    sounds.playWrong();
    setTimeout(() => {
      setShakeRow(false);
    }, 600);
    setTimeout(() => {
      setErrorMessage(null);
    }, 2500);
  };

  // Submit current guess
  const submitGuess = useCallback(() => {
    if (!targetTerm || gameStatus !== 'IN_PROGRESS') return;

    const trimmed = currentGuess.trim().toUpperCase();
    if (trimmed.length < 5) {
      showError('Not enough letters (must be 5)');
      return;
    }

    if (!VALID_GUESS_WORDS.has(trimmed)) {
      showError('Not in Class 10 science/word list');
      return;
    }

    const evaluation = evaluateGuess(trimmed, targetTerm.word);
    const newGuesses = [...guesses, trimmed];
    const newEvaluated = [...evaluatedGuesses, evaluation];

    setGuesses(newGuesses);
    setEvaluatedGuesses(newEvaluated);
    setCurrentGuess('');

    const isWin = trimmed === targetTerm.word;
    const isLoss = !isWin && newGuesses.length >= 6;

    if (isWin) {
      setGameStatus('WON');
      sounds.playFanfare();
      updateStats(true, newGuesses.length);
      saveDailyState(newGuesses, 'WON');
    } else if (isLoss) {
      setGameStatus('LOST');
      sounds.playWrong();
      updateStats(false, 6);
      saveDailyState(newGuesses, 'LOST');
    } else {
      sounds.playCorrect();
      saveDailyState(newGuesses, 'IN_PROGRESS');
    }
  }, [currentGuess, evaluatedGuesses, gameStatus, guesses, targetTerm]);

  const saveDailyState = (savedGuesses: string[], status: 'IN_PROGRESS' | 'WON' | 'LOST') => {
    if (mode !== 'daily') return;
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem(
      `cbse_sciwordle_daily_${todayStr}`,
      JSON.stringify({ guesses: savedGuesses, gameStatus: status })
    );
  };

  const updateStats = (isWin: boolean, numGuesses: number) => {
    setStats((prev) => {
      const todayStr = new Date().toISOString().split('T')[0];
      const newPlayed = prev.played + 1;
      const newWon = prev.won + (isWin ? 1 : 0);
      const newStreak = isWin ? prev.currentStreak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);
      const newGuesses = { ...prev.guesses };
      if (isWin && numGuesses >= 1 && numGuesses <= 6) {
        newGuesses[numGuesses] = (newGuesses[numGuesses] || 0) + 1;
      }
      const updated: WordleStats = {
        played: newPlayed,
        won: newWon,
        currentStreak: newStreak,
        maxStreak: newMaxStreak,
        guesses: newGuesses,
        lastPlayedDate: todayStr,
      };
      localStorage.setItem('cbse_sciwordle_stats', JSON.stringify(updated));
      return updated;
    });
  };

  // Physical keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (gameStatus !== 'IN_PROGRESS') return;

      const key = e.key.toUpperCase();

      if (key === 'ENTER') {
        e.preventDefault();
        submitGuess();
      } else if (key === 'BACKSPACE' || key === 'DELETE') {
        e.preventDefault();
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        e.preventDefault();
        setCurrentGuess((prev) => (prev + key).slice(0, 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, submitGuess]);

  // Virtual key press
  const handleVirtualKey = (key: string) => {
    if (gameStatus !== 'IN_PROGRESS') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prev) => (prev + key).slice(0, 5));
    }
  };

  // Generate shareable WhatsApp emoji grid
  const handleShare = () => {
    if (!targetTerm) return;
    const scoreText = gameStatus === 'WON' ? `${guesses.length}/6` : 'X/6';
    const header = `🧩 Sci-Wordle ${mode === 'daily' ? `Day #${dayNumber}` : 'Practice'} ${scoreText}`;

    const grid = evaluatedGuesses
      .map((row) =>
        row
          .map((item) => {
            if (item.state === 'correct') return '🟩';
            if (item.state === 'present') return '🟨';
            return '⬛';
          })
          .join('')
      )
      .join('\n');

    const shareBody = `${header}\n\n${grid}\n\nPlay CBSE Class 10 Science & Maths Arcade:\nhttps://www.chapterready.in/games/sci-wordle`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareBody).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    }
  };

  const winPercentage = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;

  return (
    <div className="sciwordle-root">
      {/* Top Controls Bar */}
      <div className="sciwordle-header-bar">
        <div className="sciwordle-mode-pills">
          <button
            type="button"
            className={`mode-pill-btn ${mode === 'daily' ? 'active' : ''}`}
            onClick={() => initGame('daily')}
          >
            📅 Daily #{dayNumber}
          </button>
          <button
            type="button"
            className={`mode-pill-btn ${mode === 'unlimited' ? 'active' : ''}`}
            onClick={() => initGame('unlimited')}
          >
            ♾️ Unlimited Practice
          </button>
        </div>

        <div className="sciwordle-action-tools">
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => setShowHelpModal(true)}
            aria-label="How to play"
            title="How to play"
          >
            ❓
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={() => setShowStatsModal(true)}
            aria-label="Statistics"
            title="Statistics"
          >
            📊
          </button>
          <button
            type="button"
            className="tool-icon-btn"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Subtitle / Chapter context */}
      <div className="sciwordle-instructions-banner">
        <span>Guess the 5-letter Class 10 NCERT Science &amp; Maths term in 6 tries!</span>
      </div>

      {/* Error Message Toast */}
      {errorMessage && (
        <div className="sciwordle-toast-msg" role="alert">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Wordle 6x5 Letter Grid */}
      <div className="sciwordle-grid-container" aria-label="Sci-Wordle letter grid">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const isSubmitted = rowIndex < evaluatedGuesses.length;
          const isCurrentRow = rowIndex === guesses.length;
          const rowEvaluations = isSubmitted ? evaluatedGuesses[rowIndex] : null;
          const rowLetters = isSubmitted
            ? guesses[rowIndex].split('')
            : isCurrentRow
            ? currentGuess.padEnd(5, ' ').slice(0, 5).split('')
            : Array(5).fill('');

          return (
            <div
              key={rowIndex}
              className={`sciwordle-row ${isCurrentRow && shakeRow ? 'shake' : ''}`}
            >
              {rowLetters.map((char, colIndex) => {
                const state = rowEvaluations ? rowEvaluations[colIndex].state : 'empty';
                const hasLetter = char.trim().length > 0;

                return (
                  <div
                    key={colIndex}
                    className={`sciwordle-tile ${state} ${hasLetter && !isSubmitted ? 'pop' : ''}`}
                    style={{ animationDelay: isSubmitted ? `${colIndex * 100}ms` : '0ms' }}
                  >
                    {char.trim()}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* On-Screen Virtual Keyboard */}
      <div className="sciwordle-keyboard" aria-label="Virtual keyboard">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="keyboard-row">
            {row.map((key) => {
              const state = letterStates[key] || '';
              const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
              return (
                <button
                  key={key}
                  type="button"
                  className={`key-btn ${state} ${isSpecial ? 'special-key' : ''}`}
                  onClick={() => handleVirtualKey(key)}
                  aria-label={key === 'BACKSPACE' ? 'Delete letter' : key}
                >
                  {key === 'BACKSPACE' ? '⌫' : key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Game Over Educational Card (Win or Loss) */}
      {gameStatus !== 'IN_PROGRESS' && targetTerm && (
        <div className="sciwordle-result-card animate-fade-in">
          <div className="result-badge-row">
            <span className={`result-outcome-badge ${gameStatus === 'WON' ? 'badge-won' : 'badge-lost'}`}>
              {gameStatus === 'WON' ? '🎉 Term Mastered!' : '📚 Keep Learning!'}
            </span>
            <span className="result-subject-tag">{targetTerm.subject}</span>
          </div>

          <div className="target-term-display">
            <span className="target-label">NCERT Concept:</span>
            <h2 className="target-word-title">{targetTerm.word}</h2>
            <span className="target-chapter-ref">📖 {targetTerm.chapter}</span>
          </div>

          <p className="target-definition">{targetTerm.definition}</p>

          {targetTerm.formulaOrFact && (
            <div className="target-fact-box">
              <span className="fact-icon">⚡</span>
              <div className="fact-text">
                <strong>NCERT Formula / Key Fact:</strong>
                <div>{targetTerm.formulaOrFact}</div>
              </div>
            </div>
          )}

          <div className="target-trap-box">
            <span className="trap-icon">💡</span>
            <div className="trap-text">
              <strong>CBSE Board Exam Tip:</strong>
              <div>{targetTerm.boardTip}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="result-actions-row">
            <button
              type="button"
              className="share-score-cta"
              onClick={handleShare}
            >
              {copiedShare ? '✅ Score Copied to Clipboard!' : '📲 Share Score on WhatsApp'}
            </button>

            {mode === 'unlimited' ? (
              <button
                type="button"
                className="next-word-cta"
                onClick={() => initGame('unlimited')}
              >
                🔄 Next Random Word →
              </button>
            ) : (
              <button
                type="button"
                className="next-word-cta"
                onClick={() => initGame('unlimited')}
              >
                ♾️ Play Unlimited Practice →
              </button>
            )}

            <Link
              href={`/chapters/${targetTerm.chapterSlug}/notes`}
              className="view-chapter-cta"
            >
              📖 Revise {targetTerm.chapter.split('/')[0].trim()} Notes →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="arcade-modal-backdrop" onClick={() => setShowStatsModal(false)}>
          <div className="arcade-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 Sci-Wordle Statistics</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowStatsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="stats-summary-grid">
              <div className="stat-box">
                <span className="stat-val">{stats.played}</span>
                <span className="stat-lbl">Played</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{winPercentage}%</span>
                <span className="stat-lbl">Win Rate</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{stats.currentStreak}</span>
                <span className="stat-lbl">Current Streak</span>
              </div>
              <div className="stat-box">
                <span className="stat-val">{stats.maxStreak}</span>
                <span className="stat-lbl">Max Streak</span>
              </div>
            </div>

            <h4 className="dist-title">Guess Distribution</h4>
            <div className="guess-dist-chart">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const count = stats.guesses[num] || 0;
                const maxCount = Math.max(1, ...Object.values(stats.guesses));
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={num} className="dist-row">
                    <span className="dist-num">{num}</span>
                    <div className="dist-bar-track">
                      <div
                        className={`dist-bar-fill ${gameStatus === 'WON' && guesses.length === num ? 'highlight' : ''}`}
                        style={{ width: `${Math.max(8, pct)}%` }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {gameStatus !== 'IN_PROGRESS' && (
              <button
                type="button"
                className="share-score-cta modal-share-btn"
                onClick={handleShare}
              >
                {copiedShare ? '✅ Copied!' : '📲 Share Scorecard'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="arcade-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="arcade-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❓ How to Play Sci-Wordle</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="help-content">
              <p>Guess the 5-letter CBSE Class 10 NCERT Science or Maths term in 6 tries.</p>
              <p>Each guess must be a valid 5-letter scientific or standard English word.</p>

              <h4>Tile Color Meanings</h4>
              <div className="help-example-row">
                <div className="sciwordle-tile correct">A</div>
                <div className="sciwordle-tile absent">N</div>
                <div className="sciwordle-tile absent">O</div>
                <div className="sciwordle-tile absent">D</div>
                <div className="sciwordle-tile absent">E</div>
              </div>
              <p className="help-caption"><strong>A</strong> is in the word and in the correct spot (Green).</p>

              <div className="help-example-row">
                <div className="sciwordle-tile absent">L</div>
                <div className="sciwordle-tile present">I</div>
                <div className="sciwordle-tile absent">G</div>
                <div className="sciwordle-tile absent">H</div>
                <div className="sciwordle-tile absent">T</div>
              </div>
              <p className="help-caption"><strong>I</strong> is in the word but in the wrong spot (Yellow).</p>

              <div className="help-example-row">
                <div className="sciwordle-tile absent">C</div>
                <div className="sciwordle-tile absent">E</div>
                <div className="sciwordle-tile absent">L</div>
                <div className="sciwordle-tile absent">L</div>
                <div className="sciwordle-tile absent">S</div>
              </div>
              <p className="help-caption">None of these letters are in the secret word (Dark Gray).</p>

              <p className="help-note">
                ⚡ <strong>Daily Mode</strong> has a new word every day at midnight. <strong>Unlimited Practice</strong> lets you practice anytime!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
