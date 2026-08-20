'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface GamesArcadeHubProps {
  userFullName?: string;
}

export default function GamesArcadeHub({ userFullName }: GamesArcadeHubProps) {
  const [blitzBest, setBlitzBest] = useState<number>(0);
  const [survivalBest, setSurvivalBest] = useState<number>(0);

  useEffect(() => {
    const savedBlitz = localStorage.getItem('cbse_fr_highscore_blitz');
    if (savedBlitz) setBlitzBest(parseInt(savedBlitz, 10));
    const savedSurv = localStorage.getItem('cbse_fr_highscore_survival');
    if (savedSurv) setSurvivalBest(parseInt(savedSurv, 10));
  }, []);

  return (
    <div className="arcade-hub-root">
      {/* Hero Banner */}
      <div className="arcade-hero-banner">
        <div className="arcade-hero-copy">
          <span className="arcade-hero-eyebrow">⚡ CBSE Class 10 Game Arcade</span>
          <h1 className="arcade-hero-title">
            {userFullName ? `Welcome to the Arcade, ${userFullName.split(' ')[0]}!` : 'Master Class 10 with 3-Minute Power Games'}
          </h1>
          <p className="arcade-hero-desc">
            Guilt-free study breaks that supercharge active recall. Every question is derived 100% directly from NCERT textbooks.
          </p>
        </div>

        {/* Quick High Score Bar */}
        {(blitzBest > 0 || survivalBest > 0) && (
          <div className="arcade-personal-bests">
            <span className="pb-label">🏆 Your Personal Bests</span>
            <div className="pb-chips">
              {blitzBest > 0 && <span className="pb-chip">⚡ Blitz: <strong>{blitzBest} pts</strong></span>}
              {survivalBest > 0 && <span className="pb-chip">❤️ Survival: <strong>{survivalBest} pts</strong></span>}
            </div>
          </div>
        )}
      </div>

      {/* Flagship Games Grid */}
      <section className="arcade-games-section">
        <h2 className="section-title">🔥 Featured Game (Play Now)</h2>
        <div className="featured-games-grid">
          {/* FORMULA RUSH */}
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
          {/* Sci-Wordle */}
          <div className="upcoming-card">
            <div className="upcoming-badge">🧩 DAILY PUZZLE</div>
            <div className="upcoming-icon">🔠</div>
            <h3 className="upcoming-title">Sci-Wordle</h3>
            <p className="upcoming-desc">
              Daily 5-letter NCERT science &amp; maths terms. Guess the secret word in 6 tries and share with your classmates!
            </p>
            <div className="upcoming-footer">
              <span className="status-pill">In Development</span>
            </div>
          </div>

          {/* Chemical Balancer Blitz */}
          <div className="upcoming-card">
            <div className="upcoming-badge">🧪 CHEMISTRY LAB</div>
            <div className="upcoming-icon">⚖️</div>
            <h3 className="upcoming-title">Chemical Balancer Blitz</h3>
            <p className="upcoming-desc">
              Slide stoichiometric coefficients to balance redox, decomposition, and displacement reactions before the beaker boils over.
            </p>
            <div className="upcoming-footer">
              <span className="status-pill">In Development</span>
            </div>
          </div>

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
              Connect resistors in Series vs Parallel to hit the exact equivalent resistance ($R_&#123;eq&#125;$) and light up the city bulb.
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
            <p>Testing yourself in game form locks formulas into memory 3x better than passive re-reading.</p>
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
