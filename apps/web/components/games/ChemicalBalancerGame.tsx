'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  CHEMICAL_REACTIONS,
  checkIfBalanced,
  isExactSolution,
  type ChemicalReaction,
  type ReactionType,
} from '../../lib/games/chemical-balancer-data';
import { sounds } from '../../lib/games/sound-effects';

export type BalancerMode = 'blitz' | 'survival' | 'campaign';

interface MistakeSummary {
  reaction: ChemicalReaction;
  userCoefficients: number[];
}

export default function ChemicalBalancerGame() {
  // Game Setup & Settings
  const [mode, setMode] = useState<BalancerMode>('blitz');
  const [gameState, setGameState] = useState<'lobby' | 'countdown' | 'playing' | 'gameover'>('lobby');
  const [countdown, setCountdown] = useState<number>(3);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Active Game State
  const [reactionQueue, setReactionQueue] = useState<ChemicalReaction[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [coefficients, setCoefficients] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [lives, setLives] = useState<number>(3);
  const [campaignLevel, setCampaignLevel] = useState<number>(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [mistakes, setMistakes] = useState<MistakeSummary[]>([]);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // High Scores
  const [highScoreBlitz, setHighScoreBlitz] = useState<number>(0);
  const [highScoreSurvival, setHighScoreSurvival] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load high scores and sound preference
  useEffect(() => {
    setIsMuted(sounds.getIsMuted());
    const savedBlitz = localStorage.getItem('cbse_balancer_highscore_blitz');
    if (savedBlitz) setHighScoreBlitz(parseInt(savedBlitz, 10));
    const savedSurv = localStorage.getItem('cbse_balancer_highscore_survival');
    if (savedSurv) setHighScoreSurvival(parseInt(savedSurv, 10));
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Current Active Reaction
  const currentReaction = useMemo(() => {
    return reactionQueue[currentIndex] || CHEMICAL_REACTIONS[0];
  }, [reactionQueue, currentIndex]);

  // Total compound count for current reaction
  const totalCompounds = useMemo(() => {
    if (!currentReaction) return 0;
    return currentReaction.reactants.length + currentReaction.products.length;
  }, [currentReaction]);

  // Reset coefficients when switching to a new reaction
  const resetCoefficientsForReaction = useCallback((rx: ChemicalReaction) => {
    const count = rx.reactants.length + rx.products.length;
    setCoefficients(Array(count).fill(1));
  }, []);

  // Prepare questions for chosen game mode
  const prepareReactionQueue = useCallback((chosenMode: BalancerMode) => {
    let pool: ChemicalReaction[] = [];

    if (chosenMode === 'campaign') {
      // 15 levels sorted by difficulty: easy -> medium -> hard
      const easy = CHEMICAL_REACTIONS.filter((r) => r.difficulty === 'easy');
      const medium = CHEMICAL_REACTIONS.filter((r) => r.difficulty === 'medium');
      const hard = CHEMICAL_REACTIONS.filter((r) => r.difficulty === 'hard');
      pool = [...easy.slice(0, 5), ...medium.slice(0, 5), ...hard.slice(0, 5)];
    } else {
      // Shuffle all reactions
      pool = [...CHEMICAL_REACTIONS];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
    }

    return pool;
  }, []);

  // Start game
  const startGame = (chosenMode: BalancerMode = mode) => {
    setMode(chosenMode);
    const queue = prepareReactionQueue(chosenMode);
    setReactionQueue(queue);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes([]);
    setFeedback(null);
    setCampaignLevel(1);

    resetCoefficientsForReaction(queue[0]);

    if (chosenMode === 'blitz') {
      setTimeLeft(60);
    } else if (chosenMode === 'survival') {
      setLives(3);
    }

    setGameState('countdown');
    setCountdown(3);
  };

  // Countdown effect
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        sounds.playTick();
        setCountdown((prev) => prev - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
    }
  }, [gameState, countdown]);

  // Blitz Mode Timer
  useEffect(() => {
    if (gameState !== 'playing' || mode !== 'blitz') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 5 && prev > 1) {
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

    if (mode === 'blitz') {
      if (score > highScoreBlitz) {
        setHighScoreBlitz(score);
        localStorage.setItem('cbse_balancer_highscore_blitz', score.toString());
      }
    } else if (mode === 'survival') {
      if (score > highScoreSurvival) {
        setHighScoreSurvival(score);
        localStorage.setItem('cbse_balancer_highscore_survival', score.toString());
      }
    }
  }, [mode, score, highScoreBlitz, highScoreSurvival]);

  // Live Atom Balance Check
  const balanceStatus = useMemo(() => {
    if (!currentReaction || coefficients.length !== totalCompounds) {
      return { isBalanced: false, elements: [] };
    }
    return checkIfBalanced(currentReaction, coefficients);
  }, [currentReaction, coefficients, totalCompounds]);

  // Modify coefficient
  const adjustCoefficient = (index: number, delta: number) => {
    setCoefficients((prev) => {
      const next = [...prev];
      const newVal = Math.max(1, Math.min(20, (next[index] || 1) + delta));
      next[index] = newVal;
      return next;
    });
  };

  const setCoefficientDirect = (index: number, valStr: string) => {
    const val = parseInt(valStr, 10);
    setCoefficients((prev) => {
      const next = [...prev];
      if (isNaN(val) || val < 1) {
        next[index] = 1;
      } else {
        next[index] = Math.min(20, val);
      }
      return next;
    });
  };

  // Submit Answer
  const handleSubmit = () => {
    if (gameState !== 'playing' || !currentReaction) return;

    const { isBalanced } = balanceStatus;

    if (isBalanced) {
      // Correct!
      const newStreak = streak + 1;
      const multiplier = newStreak >= 5 ? 3 : newStreak >= 3 ? 2 : 1;
      const points = 100 * multiplier;

      setScore((prev) => prev + points);
      setStreak(newStreak);
      setMaxStreak((prev) => Math.max(prev, newStreak));
      setFeedback('correct');

      if (newStreak % 3 === 0) {
        sounds.playCombo(multiplier);
      } else {
        sounds.playCorrect();
      }

      // Bonus time in Blitz mode
      if (mode === 'blitz') {
        setTimeLeft((prev) => Math.min(90, prev + 5));
      }

      // Advance to next reaction after brief pause
      setTimeout(() => {
        setFeedback(null);
        if (mode === 'campaign') {
          if (campaignLevel >= 15 || currentIndex >= reactionQueue.length - 1) {
            // Completed campaign!
            handleGameOver();
            return;
          }
          setCampaignLevel((prev) => prev + 1);
        }

        const nextIdx = (currentIndex + 1) % reactionQueue.length;
        setCurrentIndex(nextIdx);
        resetCoefficientsForReaction(reactionQueue[nextIdx]);
      }, 700);
    } else {
      // Wrong / Unbalanced
      sounds.playWrong();
      setStreak(0);
      setFeedback('wrong');
      setMistakes((prev) => [
        ...prev,
        { reaction: currentReaction, userCoefficients: [...coefficients] },
      ]);

      if (mode === 'survival') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => {
            handleGameOver();
          }, 600);
          return;
        }
      }

      setTimeout(() => {
        setFeedback(null);
      }, 800);
    }
  };

  // Share score on WhatsApp
  const handleShare = () => {
    const modeName =
      mode === 'blitz'
        ? '⚡ 60s Blitz'
        : mode === 'survival'
        ? '❤️ Survival'
        : `🎯 Campaign Level ${campaignLevel}/15`;

    const shareBody = `🧪 Chemical Balancer Blitz (${modeName})
🏆 Final Score: ${score} pts
🔥 Max Streak: ${maxStreak}x
${mode === 'campaign' ? `🎯 Levels Cleared: ${campaignLevel}/15\n` : ''}
Play CBSE Class 10 Chemistry Arcade on ChapterReady:
https://www.chapterready.in/games/chemical-balancer`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareBody).then(() => {
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      });
    }
  };

  return (
    <div className="balancer-game-root">
      {/* Top Controls & Meta Bar */}
      <div className="balancer-top-bar">
        <div className="balancer-mode-pills">
          <button
            type="button"
            className={`mode-pill-btn ${mode === 'blitz' ? 'active' : ''}`}
            onClick={() => startGame('blitz')}
          >
            ⚡ 60s Blitz
          </button>
          <button
            type="button"
            className={`mode-pill-btn ${mode === 'survival' ? 'active' : ''}`}
            onClick={() => startGame('survival')}
          >
            ❤️ 3-Lives Survival
          </button>
          <button
            type="button"
            className={`mode-pill-btn ${mode === 'campaign' ? 'active' : ''}`}
            onClick={() => startGame('campaign')}
          >
            🎯 15-Level Campaign
          </button>
        </div>

        <div className="balancer-action-tools">
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
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            title={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* LOBBY STATE */}
      {gameState === 'lobby' && (
        <div className="balancer-lobby-card animate-fade-in">
          <div className="lobby-badge">🧪 CBSE CHEMISTRY ARCADE</div>
          <h2 className="lobby-title">Chemical Balancer Blitz</h2>
          <p className="lobby-subtitle">
            Master stoichiometric coefficients for Class 10 board exam reactions. Balance atoms across reactants and products before the time or lives run out!
          </p>

          <div className="mode-selection-grid">
            <div className="mode-card" onClick={() => startGame('blitz')}>
              <div className="mode-icon">⚡</div>
              <div className="mode-meta">
                <h3>60s Blitz Mode</h3>
                <p>Race against the 60s clock. Rapid-fire balances earn multiplier streaks (+5s bonus per balance)!</p>
                {highScoreBlitz > 0 && <span className="pb-tag">🏆 Best: {highScoreBlitz} pts</span>}
              </div>
              <button type="button" className="mode-play-btn">Play Blitz →</button>
            </div>

            <div className="mode-card" onClick={() => startGame('survival')}>
              <div className="mode-icon">❤️</div>
              <div className="mode-meta">
                <h3>3-Lives Survival</h3>
                <p>3 strikes and you are out! Take your time, calculate carefully, and survive increasingly complex reactions.</p>
                {highScoreSurvival > 0 && <span className="pb-tag">🏆 Best: {highScoreSurvival} pts</span>}
              </div>
              <button type="button" className="mode-play-btn">Play Survival →</button>
            </div>

            <div className="mode-card" onClick={() => startGame('campaign')}>
              <div className="mode-icon">🎯</div>
              <div className="mode-meta">
                <h3>15-Level NCERT Campaign</h3>
                <p>Progress step-by-step from simple combinations to thermite, photosynthesis, and organic esterification.</p>
                <span className="pb-tag">📖 15 Official CBSE Reactions</span>
              </div>
              <button type="button" className="mode-play-btn">Play Campaign →</button>
            </div>
          </div>
        </div>
      )}

      {/* COUNTDOWN STATE */}
      {gameState === 'countdown' && (
        <div className="balancer-countdown-overlay">
          <div className="countdown-number animate-pop">
            {countdown > 0 ? countdown : 'BALANCE! ⚖️'}
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING STATE */}
      {gameState === 'playing' && currentReaction && (
        <div className="balancer-play-card animate-fade-in">
          {/* Status HUD Header */}
          <div className="play-hud-header">
            <div className="hud-metric score-metric">
              <span className="hud-label">Score</span>
              <span className="hud-value">{score}</span>
              {streak >= 3 && (
                <span className="hud-streak-badge">
                  🔥 {streak}x ({streak >= 5 ? '3x Pts' : '2x Pts'})
                </span>
              )}
            </div>

            {mode === 'blitz' && (
              <div className={`hud-metric timer-metric ${timeLeft <= 10 ? 'urgent' : ''}`}>
                <span className="hud-label">Time Remaining</span>
                <span className="hud-value">⏱️ {timeLeft}s</span>
              </div>
            )}

            {mode === 'survival' && (
              <div className="hud-metric lives-metric">
                <span className="hud-label">Lives Remaining</span>
                <div className="hud-hearts">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className={`heart ${i < lives ? 'alive' : 'lost'}`}>
                      {i < lives ? '❤️' : '🖤'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mode === 'campaign' && (
              <div className="hud-metric level-metric">
                <span className="hud-label">Level</span>
                <span className="hud-value">🎯 Level {campaignLevel}/15</span>
              </div>
            )}
          </div>

          {/* Reaction Header Info */}
          <div className="reaction-meta-strip">
            <div className="reaction-title-block">
              <span className="rx-name">{currentReaction.name}</span>
              <span className="rx-chapter">📖 {currentReaction.chapter}</span>
            </div>
            <div className="reaction-tags-block">
              <span className={`difficulty-badge ${currentReaction.difficulty}`}>
                {currentReaction.difficulty.toUpperCase()}
              </span>
              <span className="type-badge">🔬 {currentReaction.type}</span>
            </div>
          </div>

          {/* EQUATION BALANCER WORKBENCH */}
          <div className={`equation-workbench-box ${feedback === 'correct' ? 'feedback-correct' : feedback === 'wrong' ? 'feedback-wrong' : ''}`}>
            <div className="equation-row-flex">
              {/* Reactants */}
              <div className="equation-side reactants-side">
                {currentReaction.reactants.map((comp, idx) => (
                  <React.Fragment key={`r-${idx}`}>
                    {idx > 0 && <span className="equation-operator">+</span>}
                    <div className="stepper-compound-unit">
                      <div className="stepper-controls">
                        <button
                          type="button"
                          className="stepper-btn minus-btn"
                          onClick={() => adjustCoefficient(idx, -1)}
                          aria-label={`Decrease ${comp.formula} coefficient`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={coefficients[idx] || 1}
                          onChange={(e) => setCoefficientDirect(idx, e.target.value)}
                          className="stepper-input"
                          aria-label={`${comp.formula} coefficient`}
                        />
                        <button
                          type="button"
                          className="stepper-btn plus-btn"
                          onClick={() => adjustCoefficient(idx, 1)}
                          aria-label={`Increase ${comp.formula} coefficient`}
                        >
                          +
                        </button>
                      </div>
                      <span className="compound-formula">{comp.formula}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Reaction Arrow */}
              <div className="equation-yields-arrow">
                <span className="yield-arrow-symbol">→</span>
              </div>

              {/* Products */}
              <div className="equation-side products-side">
                {currentReaction.products.map((comp, idx) => {
                  const globalIdx = currentReaction.reactants.length + idx;
                  return (
                    <React.Fragment key={`p-${idx}`}>
                      {idx > 0 && <span className="equation-operator">+</span>}
                      <div className="stepper-compound-unit">
                        <div className="stepper-controls">
                          <button
                            type="button"
                            className="stepper-btn minus-btn"
                            onClick={() => adjustCoefficient(globalIdx, -1)}
                            aria-label={`Decrease ${comp.formula} coefficient`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={coefficients[globalIdx] || 1}
                            onChange={(e) => setCoefficientDirect(globalIdx, e.target.value)}
                            className="stepper-input"
                            aria-label={`${comp.formula} coefficient`}
                          />
                          <button
                            type="button"
                            className="stepper-btn plus-btn"
                            onClick={() => adjustCoefficient(globalIdx, 1)}
                            aria-label={`Increase ${comp.formula} coefficient`}
                          >
                            +
                          </button>
                        </div>
                        <span className="compound-formula">{comp.formula}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* REAL-TIME ATOM BALANCE SCALE VISUALIZER */}
          <div className="atom-balance-visualizer">
            <div className="atom-scale-header">
              <span className="scale-title">⚖️ Live Atom Count (Reactants vs Products)</span>
              <span className={`scale-status-pill ${balanceStatus.isBalanced ? 'status-balanced' : 'status-unbalanced'}`}>
                {balanceStatus.isBalanced ? '✅ EQUATION BALANCED' : '⏳ UNBALANCED'}
              </span>
            </div>

            <div className="atom-elements-grid">
              {balanceStatus.elements.map((elem) => (
                <div
                  key={elem.element}
                  className={`element-balance-chip ${elem.balanced ? 'chip-balanced' : 'chip-unbalanced'}`}
                >
                  <span className="element-sym">{elem.element}</span>
                  <div className="element-counts">
                    <span className="count-val r-val">{elem.reactantCount}</span>
                    <span className="count-sep">⚖️</span>
                    <span className="count-val p-val">{elem.productCount}</span>
                  </div>
                  <span className="chip-indicator">
                    {elem.balanced ? '✓' : elem.reactantCount > elem.productCount ? '▶' : '◀'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON & HINT */}
          <div className="balancer-submit-row">
            <button
              type="button"
              className={`balancer-submit-btn ${balanceStatus.isBalanced ? 'ready' : ''}`}
              onClick={handleSubmit}
            >
              {balanceStatus.isBalanced ? '✨ Lock in & Submit Balance! →' : '🔍 Check Equation Balance'}
            </button>
          </div>

          {/* Pedagogical Board Note / Observation */}
          <div className="balancer-board-note">
            <span className="note-icon">💡</span>
            <div className="note-body">
              <strong>Board Exam Key Observation:</strong>
              <p>{currentReaction.boardNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER STATE */}
      {gameState === 'gameover' && (
        <div className="balancer-gameover-card animate-fade-in">
          <div className="gameover-header">
            <span className="gameover-badge">🏁 ROUND COMPLETE</span>
            <h2 className="gameover-title">
              {mode === 'campaign' && campaignLevel >= 15 ? '👑 Chemistry Master! All 15 Levels Cleared!' : 'Great Work on the Reactions!'}
            </h2>
          </div>

          <div className="gameover-score-hero">
            <div className="score-main-pill">
              <span className="hero-score-val">{score}</span>
              <span className="hero-score-lbl">Total Score</span>
            </div>

            <div className="score-stats-grid">
              <div className="stat-card">
                <span className="stat-v">🔥 {maxStreak}x</span>
                <span className="stat-l">Max Streak</span>
              </div>
              {mode === 'campaign' && (
                <div className="stat-card">
                  <span className="stat-v">🎯 {campaignLevel}/15</span>
                  <span className="stat-l">Levels Cleared</span>
                </div>
              )}
              {mode === 'blitz' && (
                <div className="stat-card">
                  <span className="stat-v">🏆 {highScoreBlitz} pts</span>
                  <span className="stat-l">Blitz High Score</span>
                </div>
              )}
              {mode === 'survival' && (
                <div className="stat-card">
                  <span className="stat-v">🏆 {highScoreSurvival} pts</span>
                  <span className="stat-l">Survival High Score</span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="gameover-actions-row">
            <button
              type="button"
              className="share-score-cta"
              onClick={handleShare}
            >
              {copiedShare ? '✅ Score Copied to Clipboard!' : '📲 Share Score on WhatsApp'}
            </button>

            <button
              type="button"
              className="restart-game-cta"
              onClick={() => startGame(mode)}
            >
              🔄 Play {mode.toUpperCase()} Again →
            </button>

            <Link
              href="/chapters/chemical-reactions-and-equations/notes"
              className="view-chapter-cta"
            >
              📖 Revise Chemical Reactions Notes →
            </Link>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="arcade-modal-backdrop" onClick={() => setShowHelpModal(false)}>
          <div className="arcade-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>❓ How to Balance Chemical Reactions</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowHelpModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="help-content">
              <p>According to the <strong>Law of Conservation of Mass</strong>, matter can neither be created nor destroyed in a chemical reaction. Therefore, the number of atoms of each element must be identical on both sides of the equation.</p>

              <h4>Golden Rules for Balancing:</h4>
              <ol className="help-steps-list">
                <li>
                  <strong>Only adjust coefficients</strong> (the numbers in front of formulas). Never change the chemical subscripts (e.g. write 2H₂O, never H₂O₂).
                </li>
                <li>
                  <strong>Watch the Live Atom Scale:</strong> As you adjust numbers using the <code>+</code> and <code>−</code> stepper buttons, the atom visualizer updates in real time.
                </li>
                <li>
                  <strong>All elements must turn Green (✓):</strong> Once Reactant and Product atom counts match for all elements, click <em>Submit Balance</em> to lock in your score!
                </li>
              </ol>

              <h4>Game Modes:</h4>
              <p>
                ⚡ <strong>60s Blitz:</strong> Fast-paced speed challenge with streak multipliers.<br />
                ❤️ <strong>Survival:</strong> 3 lives. Take your time, calculate carefully.<br />
                🎯 <strong>15-Level Campaign:</strong> Step-by-step Class 10 NCERT mastery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
