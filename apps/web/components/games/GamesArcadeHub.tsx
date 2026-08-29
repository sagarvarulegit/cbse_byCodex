'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface GamesArcadeHubProps {
  userFullName?: string;
}

export default function GamesArcadeHub({ userFullName }: GamesArcadeHubProps) {
  const [frBlitzBest, setFrBlitzBest] = useState<number>(0);
  const [frSurvivalBest, setFrSurvivalBest] = useState<number>(0);
  const [cbBlitzBest, setCbBlitzBest] = useState<number>(0);
  const [cbSurvivalBest, setCbSurvivalBest] = useState<number>(0);
  const [wordleStreak, setWordleStreak] = useState<number>(0);
  const [clientUserName, setClientUserName] = useState<string | undefined>(userFullName);

  useEffect(() => {
    // Formula Rush Highscores
    const savedFrBlitz = localStorage.getItem('cbse_fr_highscore_blitz');
    if (savedFrBlitz) setFrBlitzBest(parseInt(savedFrBlitz, 10));
    const savedFrSurv = localStorage.getItem('cbse_fr_highscore_survival');
    if (savedFrSurv) setFrSurvivalBest(parseInt(savedFrSurv, 10));

    // Chemical Balancer Highscores
    const savedCbBlitz = localStorage.getItem('cbse_balancer_highscore_blitz');
    if (savedCbBlitz) setCbBlitzBest(parseInt(savedCbBlitz, 10));
    const savedCbSurv = localStorage.getItem('cbse_balancer_highscore_survival');
    if (savedCbSurv) setCbSurvivalBest(parseInt(savedCbSurv, 10));

    // Sci-Wordle Stats
    const savedWordle = localStorage.getItem('cbse_sciwordle_stats');
    if (savedWordle) {
      try {
        const parsed = JSON.parse(savedWordle);
        if (parsed && typeof parsed.currentStreak === 'number') {
          setWordleStreak(parsed.currentStreak);
        }
      } catch {
        // ignore
      }
    }

    if (!userFullName) {
      const cookie = document.cookie.split('; ').find(row => row.startsWith('cbse_student_session='));
      if (cookie) {
        try {
          const token = decodeURIComponent(cookie.split('=')[1]);
          const payloadStr = token.split('.')[0];
          if (payloadStr) {
            const base64 = payloadStr.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const payload = JSON.parse(jsonPayload);
            if (payload && payload.fullName) {
              setClientUserName(payload.fullName);
            }
          }
        } catch {
          // ignore parsing errors
        }
      }
    }
  }, [userFullName]);

  const hasAnyHighscore =
    frBlitzBest > 0 || frSurvivalBest > 0 || cbBlitzBest > 0 || cbSurvivalBest > 0 || wordleStreak > 0;

  return (
    <div className="arcade-hub-root">
      {/* Hero Banner */}
      <div className="arcade-hero-banner">
        <div className="arcade-hero-copy">
          <span className="arcade-hero-eyebrow">⚡ CBSE Class 10 Game Arcade</span>
          <h1 className="arcade-hero-title">
            {clientUserName ? `Welcome to the Arcade, ${clientUserName.split(' ')[0]}!` : 'Master Class 10 with 3-Minute Power Games'}
          </h1>
          <p className="arcade-hero-desc">
            Guilt-free study breaks that supercharge active recall. Every question, term, and chemical equation is grounded 100% directly in NCERT textbooks.
          </p>
        </div>

        {/* Quick High Score Bar */}
        {hasAnyHighscore && (
          <div className="arcade-personal-bests">
            <span className="pb-label">🏆 Your Personal Records</span>
            <div className="pb-chips">
              {frBlitzBest > 0 && <span className="pb-chip">⚡ Formula Blitz: <strong>{frBlitzBest} pts</strong></span>}
              {cbBlitzBest > 0 && <span className="pb-chip">🧪 Balancer Blitz: <strong>{cbBlitzBest} pts</strong></span>}
              {wordleStreak > 0 && <span className="pb-chip">🧩 Wordle Streak: <strong>{wordleStreak} 🔥</strong></span>}
            </div>
          </div>
        )}
      </div>

      {/* Flagship Games Grid */}
      <section className="arcade-games-section">
        <div className="section-header-row">
          <h2 className="section-title">🔥 Playable Class 10 Games</h2>
          <span className="section-subtitle">Choose a game below to sharpen your board exam recall:</span>
        </div>

        <div className="featured-games-grid">
          {/* 1. SCI-WORDLE */}
          <div className="game-card featured-card wordle-theme-card">
            <div className="game-card-badge-row">
              <span className="badge-live">⚡ PLAYABLE NOW</span>
              <span className="badge-subject">Science &amp; Maths</span>
            </div>
            <div className="game-card-content">
              <div className="game-icon-large">🧩</div>
              <div className="game-info">
                <h3 className="game-title">Sci-Wordle</h3>
                <p className="game-desc">
                  Daily 5-letter Class 10 NCERT science &amp; maths terms. Guess the secret concept in 6 tries, get live color feedback, and unlock board exam formula flashcards.
                </p>
                <div className="game-tags">
                  <span className="tag">📅 Daily Challenge</span>
                  <span className="tag">♾️ Unlimited Practice</span>
                  <span className="tag">📲 WhatsApp Scorecard</span>
                </div>
              </div>
            </div>
            <div className="game-card-footer">
              <Link className="play-game-cta wordle-cta" href="/games/sci-wordle">
                🧩 Play Sci-Wordle →
              </Link>
            </div>
          </div>

          {/* 2. CHEMICAL BALANCER BLITZ */}
          <div className="game-card featured-card chemistry-theme-card">
            <div className="game-card-badge-row">
              <span className="badge-live">⚡ PLAYABLE NOW</span>
              <span className="badge-subject">Class 10 Chemistry</span>
            </div>
            <div className="game-card-content">
              <div className="game-icon-large">🧪</div>
              <div className="game-info">
                <h3 className="game-title">Chemical Balancer Blitz</h3>
                <p className="game-desc">
                  Interactive stoichiometric coefficient balancer with live atom balance scales (⚖️). Balance 30+ CBSE board reactions across Combination, Redox, Thermite, and Organics.
                </p>
                <div className="game-tags">
                  <span className="tag">⏱️ 60s Speed Blitz</span>
                  <span className="tag">❤️ 3-Lives Survival</span>
                  <span className="tag">🎯 15-Level Campaign</span>
                </div>
              </div>
            </div>
            <div className="game-card-footer">
              <Link className="play-game-cta chem-cta" href="/games/chemical-balancer">
                🧪 Play Chemical Balancer →
              </Link>
            </div>
          </div>

          {/* 3. FORMULA RUSH */}
          <div className="game-card featured-card">
            <div className="game-card-badge-row">
              <span className="badge-live">⚡ PLAYABLE NOW</span>
              <span className="badge-subject">Maths &amp; Physics</span>
            </div>
            <div className="game-card-content">
              <div className="game-icon-large">⚡</div>
              <div className="game-info">
                <h3 className="game-title">Formula Rush</h3>
                <p className="game-desc">
                  Race against time or survive 3 strikes! Rapid-fire True/False and multiple-choice formula drills for Trigonometry, Surface Areas &amp; Volumes, Electricity, and Light.
                </p>
                <div className="game-tags">
                  <span className="tag">⏱️ 60s Blitz</span>
                  <span className="tag">❤️ 3-Lives Survival</span>
                  <span className="tag">💡 Instant NCERT Tips</span>
                </div>
              </div>
            </div>
            <div className="game-card-footer">
              <Link className="play-game-cta" href="/games/formula-rush">
                🎮 Play Formula Rush →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING ARCADE PIPELINE */}
      <section className="arcade-games-section">
        <div className="section-header-row">
          <h2 className="section-title">🚀 Up Next in Arcade (Coming Soon)</h2>
          <span className="section-subtitle">Vote on what we should release next!</span>
        </div>

        <div className="upcoming-games-grid">
          {/* GeoQuest */}
          <div className="upcoming-card">
            <div className="upcoming-badge">🗺️ SST MAP WORK</div>
            <div className="upcoming-icon">📍</div>
            <h3 className="upcoming-title">GeoQuest: Map Hunter</h3>
            <p className="upcoming-desc">
              Pin dams, nuclear power plants, soil belts, and freedom movement hotspots on the India map against the clock.
            </p>
            <div className="upcoming-footer">
              <span className="status-pill">In Development</span>
            </div>
          </div>

          {/* Circuit Overlord */}
          <div className="upcoming-card">
            <div className="upcoming-badge">💡 PHYSICS PUZZLE</div>
            <div className="upcoming-icon">🔌</div>
            <h3 className="upcoming-title">Circuit Overlord</h3>
            <p className="upcoming-desc">
              Connect resistors in Series vs Parallel to hit the exact equivalent resistance (R_eq) and light up the city bulb.
            </p>
            <div className="upcoming-footer">
              <span className="status-pill">In Development</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ARCADE WORKS */}
      <section className="arcade-benefit-strip">
        <div className="benefit-item">
          <span className="benefit-icon">🧠</span>
          <div>
            <strong>Active Recall Practice</strong>
            <p>Testing yourself in game form locks formulas and terminology into memory 3x better than passive re-reading.</p>
          </div>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">📖</span>
          <div>
            <strong>100% NCERT Fidelity</strong>
            <p>Every single term, formula, and explanation strictly adheres to the official Class 10 NCERT textbook.</p>
          </div>
        </div>
        <div className="benefit-item">
          <span className="benefit-icon">🎯</span>
          <div>
            <strong>Instant Mistake Flashcards</strong>
            <p>Every incorrect answer immediately reveals the right formula and textbook tip to prevent exam hall traps.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
