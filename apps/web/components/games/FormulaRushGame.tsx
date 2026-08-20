'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import MathText from '../MathText';
import {
  FORMULA_QUESTIONS,
  FORMULA_CATEGORIES,
  type FormulaQuestion,
  type FormulaCategory,
} from '../../lib/games/formula-rush-data';
import { sounds } from '../../lib/games/sound-effects';

export type GameMode = 'blitz' | 'survival' | 'practice';

interface MistakeRecord {
  question: FormulaQuestion;
  selectedAnswer: string;
}

export default function FormulaRushGame() {
  // Game Setup State
  const [selectedCategory, setSelectedCategory] = useState<FormulaCategory | 'all'>('all');
  const [mode, setMode] = useState<GameMode>('blitz');
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'playing' | 'gameover'>('lobby');
  const [countdown, setCountdown] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active Gameplay State
  const [questionPool, setQuestionPool] = useState<FormulaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [lives, setLives] = useState<number>(3);
  const [feedbackState, setFeedbackState] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  // High Scores (persisted in localStorage)
  const [highScoreBlitz, setHighScoreBlitz] = useState<number>(0);
  const [highScoreSurvival, setHighScoreSurvival] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load high scores & sound preference
  useEffect(() => {
    setIsMuted(sounds.getIsMuted());
    const savedBlitz = localStorage.getItem('cbse_fr_highscore_blitz');
    if (savedBlitz) setHighScoreBlitz(parseInt(savedBlitz, 10));
    const savedSurv = localStorage.getItem('cbse_fr_highscore_survival');
    if (savedSurv) setHighScoreSurvival(parseInt(savedSurv, 10));
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Prepare filtered and shuffled question pool
  const prepareQuestions = useCallback(() => {
    let pool = [...FORMULA_QUESTIONS];
    if (selectedCategory !== 'all') {
      pool = pool.filter((q) => q.category === selectedCategory);
    }
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }, [selectedCategory]);

  // Start game flow
  const startGame = (chosenMode: GameMode = mode) => {
    setMode(chosenMode);
    const pool = prepareQuestions();
    setQuestionPool(pool);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes([]);
    setFeedbackState(null);
    setSelectedOptionIndex(null);

    if (chosenMode === 'blitz') {
      setTimeLeft(60);
    } else if (chosenMode === 'survival') {
      setLives(3);
    }

    setGameState('countdown');
    setCountdown(3);
  };

  // Countdown timer (3, 2, 1, GO!)
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const cdTimer = setTimeout(() => {
        sounds.playTick();
        setCountdown((prev) => prev - 1);
      }, 800);
      return () => clearTimeout(cdTimer);
    } else {
      setGameState('playing');
    }
  }, [gameState, countdown]);

  // Blitz Timer Effect
  useEffect(() => {
    if (gameState !== 'playing' || mode !== 'blitz') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 6 && prev > 1) {
          sounds.playTick();
        }
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, mode]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setGameState('gameover');
    sounds.playFanfare();

    // Check & Save High Scores
    if (mode === 'blitz') {
      if (score > highScoreBlitz) {
        setHighScoreBlitz(score);
        localStorage.setItem('cbse_fr_highscore_blitz', score.toString());
      }
    } else if (mode === 'survival') {
      if (score > highScoreSurvival) {
        setHighScoreSurvival(score);
        localStorage.setItem('cbse_fr_highscore_survival', score.toString());
      }
    }
  }, [mode, score, highScoreBlitz, highScoreSurvival]);

  const currentQuestion = questionPool[currentIndex];

  // Handle Answer Selection
  const handleAnswer = (selectedAns: string, optionIndex: number) => {
    if (!currentQuestion || feedbackState !== null) return;

    setSelectedOptionIndex(optionIndex);
    const isCorrect = selectedAns === currentQuestion.correctAnswer;

    if (isCorrect) {
      const currentMultiplier = Math.min(4, 1 + Math.floor((streak + 1) / 3));
      const pointsEarned = 100 * currentMultiplier;

      setScore((prev) => prev + pointsEarned);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      if (newStreak % 3 === 0) {
        sounds.playCombo(currentMultiplier);
      } else {
        sounds.playCorrect();
      }

      setFeedbackState('correct');
    } else {
      sounds.playWrong();
      setStreak(0);
      setFeedbackState('wrong');
      setMistakes((prev) => [
        ...prev,
        { question: currentQuestion, selectedAnswer: selectedAns },
      ]);

      if (mode === 'survival') {
        const remainingLives = lives - 1;
        setLives(remainingLives);
        if (remainingLives <= 0) {
          feedbackTimeoutRef.current = setTimeout(() => {
            handleGameOver();
          }, 800);
          return;
        }
      }
    }

    // Advance to next question after brief feedback pause
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackState(null);
      setSelectedOptionIndex(null);

      if (currentIndex + 1 < questionPool.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Recycle and reshuffle question pool if student reaches the end
        const reshuffled = prepareQuestions();
        setQuestionPool(reshuffled);
        setCurrentIndex(0);
      }
    }, 550);
  };

  // Keyboard navigation shortcuts: 1-4 for options or Arrow keys for True/False
  useEffect(() => {
    if (gameState !== 'playing' || !currentQuestion || feedbackState !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentQuestion.type === 'true-false') {
        if (e.key === 'ArrowLeft' || e.key === 't' || e.key === 'T' || e.key === '1') {
          handleAnswer(currentQuestion.options[0], 0);
        } else if (e.key === 'ArrowRight' || e.key === 'f' || e.key === 'F' || e.key === '2') {
          handleAnswer(currentQuestion.options[1], 1);
        }
      } else {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= currentQuestion.options.length) {
          handleAnswer(currentQuestion.options[num - 1], num - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuestion, feedbackState, handleAnswer]);

  // Compute Rank Title
  const getRankInfo = (finalScore: number) => {
    if (finalScore >= 2500) return { title: '👑 Board Exam Legend', color: '#ffb703', desc: 'Flawless formula mastery! You are 100% board ready.' };
    if (finalScore >= 1600) return { title: '⚡ Formula Grandmaster', color: '#00f5d4', desc: 'Incredible speed and sharp NCERT accuracy!' };
    if (finalScore >= 900) return { title: '🔥 Sharp Solver', color: '#70e000', desc: 'Solid grasp of formulas. Keep polishing tricky exceptions!' };
    if (finalScore >= 400) return { title: '🌱 Rising Topper', color: '#38b000', desc: 'Good start! Revisit the formula mistake cards to level up.' };
    return { title: '🎯 NCERT Apprentice', color: '#9d4edd', desc: 'Practice makes perfect. Review the tips and try again!' };
  };

  return (
    <div className="formula-rush-root">
      {/* Sound & Controls Header */}
      <div className="game-top-bar">
        <Link className="back-arcade-link" href="/games">
          ← Arcade Hub
        </Link>
        <div className="game-status-cluster">
          <button
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
            className="sound-toggle-btn"
            onClick={toggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: LOBBY & MODE SELECTION
         ========================================================================= */}
      {gameState === 'lobby' && (
        <div className="rush-lobby">
          <div className="rush-hero-badge">⚡ CBSE CLASS 10 SPEED ARENA</div>
          <h1 className="rush-title">Formula Rush</h1>
          <p className="rush-subtitle">
            Master high-yield NCERT Maths and Physics formulas with rapid-fire recall drills.
          </p>

          {/* Mode Selector Cards */}
          <div className="mode-selection-grid">
            <button
              className={`mode-card ${mode === 'blitz' ? 'mode-active' : ''}`}
              onClick={() => setMode('blitz')}
            >
              <div className="mode-icon">⚡</div>
              <div className="mode-details">
                <span className="mode-name">60s Time Attack Blitz</span>
                <span className="mode-desc">Score maximum points in 60 seconds with combo streaks!</span>
                {highScoreBlitz > 0 && (
                  <span className="mode-best">🏆 Best: {highScoreBlitz} pts</span>
                )}
              </div>
            </button>

            <button
              className={`mode-card ${mode === 'survival' ? 'mode-active' : ''}`}
              onClick={() => setMode('survival')}
            >
              <div className="mode-icon">❤️</div>
              <div className="mode-details">
                <span className="mode-name">3-Lives Survival</span>
                <span className="mode-desc">Sudden death! 3 mistakes and game over. Precision is king.</span>
                {highScoreSurvival > 0 && (
                  <span className="mode-best">🏆 Best: {highScoreSurvival} pts</span>
                )}
              </div>
            </button>

            <button
              className={`mode-card ${mode === 'practice' ? 'mode-active' : ''}`}
              onClick={() => setMode('practice')}
            >
              <div className="mode-icon">🎯</div>
              <div className="mode-details">
                <span className="mode-name">Chill Practice</span>
                <span className="mode-desc">No clock, no pressure. Step-by-step NCERT formula drill.</span>
              </div>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="category-select-section">
            <span className="category-select-label">Choose Topic Focus:</span>
            <div className="category-pills">
              <button
                className={`category-pill ${selectedCategory === 'all' ? 'pill-active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                🌟 All Topics (Mixed)
              </button>
              {FORMULA_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-pill ${selectedCategory === cat.id ? 'pill-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Start CTA */}
          <div className="lobby-actions">
            <button className="start-rush-btn" onClick={() => startGame(mode)}>
              🚀 START FORMULA RUSH
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: 3-2-1 COUNTDOWN
         ========================================================================= */}
      {gameState === 'countdown' && (
        <div className="rush-countdown-screen">
          <div className="countdown-number">{countdown > 0 ? countdown : 'GO!'}</div>
          <span className="countdown-hint">Get Ready! Answer as fast as you can.</span>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ACTIVE PLAYING
         ========================================================================= */}
      {gameState === 'playing' && currentQuestion && (
        <div className="rush-playfield">
          {/* Game HUD Bar */}
          <div className="rush-hud">
            {mode === 'blitz' && (
              <div className={`hud-timer ${timeLeft <= 10 ? 'timer-danger' : ''}`}>
                ⏱️ <strong>{timeLeft}s</strong>
              </div>
            )}

            {mode === 'survival' && (
              <div className="hud-lives">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`heart ${i < lives ? 'heart-full' : 'heart-lost'}`}>
                    ❤️
                  </span>
                ))}
              </div>
            )}

            {mode === 'practice' && (
              <div className="hud-practice-count">
                Question <strong>{currentIndex + 1}</strong>
              </div>
            )}

            <div className="hud-score">
              Score: <strong>{score}</strong>
            </div>

            {streak >= 2 && (
              <div className="hud-streak-badge">
                🔥 {streak} Streak ({Math.min(4, 1 + Math.floor(streak / 3))}x)
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="rush-card-container">
            <div className="rush-card-header">
              <span className="rush-card-badge">{currentQuestion.categoryTitle}</span>
              <span className="rush-card-chapter">{currentQuestion.chapterNumber}</span>
            </div>

            <h2 className="rush-prompt">
              <MathText text={currentQuestion.prompt} />
            </h2>

            {/* Displayed Formula Box (for True/False or Missing-term questions) */}
            {currentQuestion.displayedFormula && (
              <div className="rush-formula-display">
                <MathText text={currentQuestion.displayedFormula} />
              </div>
            )}

            {/* Options Interactive Grid */}
            <div
              className={`rush-options-grid ${
                currentQuestion.type === 'true-false' ? 'grid-true-false' : 'grid-multi'
              }`}
            >
              {currentQuestion.options.map((opt, idx) => {
                let btnClass = 'rush-option-btn';
                if (feedbackState !== null) {
                  if (opt === currentQuestion.correctAnswer) {
                    btnClass += ' option-correct';
                  } else if (idx === selectedOptionIndex && feedbackState === 'wrong') {
                    btnClass += ' option-wrong';
                  }
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    disabled={feedbackState !== null}
                    onClick={() => handleAnswer(opt, idx)}
                  >
                    <span className="option-hotkey">
                      {currentQuestion.type === 'true-false'
                        ? idx === 0
                          ? '1 / ←'
                          : '2 / →'
                        : `${idx + 1}`}
                    </span>
                    <span className="option-text">
                      <MathText text={opt} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* In-play Instant Mistake Guidance */}
            {feedbackState === 'wrong' && (
              <div className="inplay-feedback wrong-banner">
                <span>💡 {currentQuestion.explanation}</span>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          {mode === 'practice' && (
            <div className="practice-nav-bar">
              <button className="quit-btn" onClick={() => setGameState('lobby')}>
                Finish Practice
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 4: GAME OVER & DETAILED MISTAKE REVIEW
         ========================================================================= */}
      {gameState === 'gameover' && (
        <div className="rush-gameover-screen">
          <div className="results-badge">🏁 GAME OVER</div>
          <h1 className="final-score-title">Final Score: {score}</h1>

          {/* Rank Badge */}
          {(() => {
            const rank = getRankInfo(score);
            return (
              <div className="rank-badge-card" style={{ borderColor: rank.color }}>
                <span className="rank-title" style={{ color: rank.color }}>
                  {rank.title}
                </span>
                <p className="rank-desc">{rank.desc}</p>
              </div>
            );
          })()}

          {/* Stats Bar */}
          <div className="game-stats-row">
            <div className="stat-box">
              <span className="stat-num">{score}</span>
              <span className="stat-label">Total Points</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{maxStreak}🔥</span>
              <span className="stat-label">Max Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{mistakes.length}</span>
              <span className="stat-label">Formulas to Polish</span>
            </div>
          </div>

          {/* Mistake Review / Flashcard Section */}
          {mistakes.length > 0 && (
            <div className="rush-mistakes-section">
              <h3 className="rush-mistakes-title">🔍 Quick Mistake Review (NCERT High-Yield)</h3>
              <p className="rush-mistakes-subtitle">
                Revise these formulas now to lock them into your long-term memory!
              </p>
              <div className="rush-mistakes-list">
                {mistakes.map((m, idx) => (
                  <div key={idx} className="rush-mistake-card">
                    <div className="rush-mistake-header">
                      <span className="rush-mistake-cat">{m.question.categoryTitle}</span>
                      <span className="rush-mistake-ref">{m.question.ncertReference}</span>
                    </div>
                    <div className="rush-mistake-prompt">
                      <MathText text={m.question.prompt} />
                    </div>
                    {m.question.displayedFormula && (
                      <div className="rush-mistake-formula-box">
                        <MathText text={m.question.displayedFormula} />
                      </div>
                    )}
                    <div className="rush-mistake-comparison">
                      <div className="rush-ans-box rush-ans-wrong">
                        <span className="rush-ans-label">Your Answer:</span>
                        <MathText text={m.selectedAnswer} />
                      </div>
                      <div className="rush-ans-box rush-ans-correct">
                        <span className="rush-ans-label">Correct Formula:</span>
                        <MathText text={m.question.correctAnswer} />
                      </div>
                    </div>
                    <p className="rush-mistake-tip">
                      <strong>💡 NCERT Tip:</strong> <MathText text={m.question.explanation} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="gameover-actions">
            <button className="play-again-btn" onClick={() => startGame(mode)}>
              🔄 Play Again
            </button>
            <button className="lobby-btn" onClick={() => setGameState('lobby')}>
              🏠 Change Mode / Topic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
