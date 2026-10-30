'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import InteractiveOpticsViewer from './InteractiveOpticsViewer';

type ViewMode = 'slide' | 'brochure';

interface SlideMeta {
  index: number;
  id: string;
  shortLabel: string;
  kicker: string;
  dark?: boolean;
}

const SLIDE_METAS: SlideMeta[] = [
  { index: 0, id: 'overview', shortLabel: '01 · Overview', kicker: 'ChapterReady.in for Institutions', dark: true },
  { index: 1, id: 'problem', shortLabel: '02 · The Gap', kicker: 'The After-Class Gap' },
  { index: 2, id: 'method', shortLabel: '03 · How It Works', kicker: 'Structured Daily System' },
  { index: 3, id: 'tara-optics', shortLabel: '04 · Live Demo', kicker: 'Interactive Science & Doubt Support' },
  { index: 4, id: 'mocks-rubrics', shortLabel: '05 · Board Practice', kicker: 'CBSE Blueprint & Step-Marking' },
  { index: 5, id: 'audiences', shortLabel: '06 · Who It Fits', kicker: 'For Coaching Classes & Schools' },
  { index: 6, id: 'pricing', shortLabel: '07 · Pricing', kicker: 'Simple Annual Licensing' },
  { index: 7, id: 'pilot', shortLabel: '08 · Free Pilot', kicker: 'Try With 1 Batch First', dark: true },
];

export default function PitchDeckClient() {
  const [mode, setMode] = useState<ViewMode>('slide');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(80);

  const totalSlides = SLIDE_METAS.length;

  const goNext = useCallback(() => {
    setActiveSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setActiveSlide((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'slide') return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, goNext, goPrev]);

  const pricing = useMemo(() => {
    let rate = 499;
    if (studentCount > 250) rate = 249;
    else if (studentCount > 50) rate = 349;

    const total = studentCount * rate;
    const perDay = (rate / 365).toFixed(2);
    return { rate, total, perDay };
  }, [studentCount]);

  const handlePrint = () => {
    const prev = mode;
    setMode('brochure');
    setTimeout(() => {
      window.print();
      setMode(prev);
    }, 150);
  };

  const renderSlide = (index: number) => {
    const meta = SLIDE_METAS[index];
    const numStr = `${String(index + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;

    switch (index) {
      /* 01: OVERVIEW */
      case 0:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card slide-dark">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h1 className="slide-title">
                The Structured <span className="slide-accent">After-Class Revision &amp; Practice</span> Companion for CBSE Class 10.
              </h1>
              <p className="slide-subtitle">
                Your teachers handle classroom instruction. ChapterReady gives your students simplified NCERT notes, interactive science visuals, and official CBSE step-marking practice at home.
              </p>

              <div className="slide-cols-3">
                <div className="clean-card">
                  <div className="card-icon-badge">📘</div>
                  <h3 className="clean-card-title">Simplified NCERT Notes</h3>
                  <p className="clean-card-desc">
                    76+ scannable chapter packs and 27 one-page formula &amp; reaction sheets across Maths, Science, SST, English, and Hindi.
                  </p>
                </div>

                <div className="clean-card">
                  <div className="card-icon-badge">🔬</div>
                  <h3 className="clean-card-title">Interactive Labs &amp; Tara AI</h3>
                  <p className="clean-card-desc">
                    3D virtual experiments, certified Ray Optics simulations, and an NCERT-grounded AI tutor for evening self-study doubts.
                  </p>
                </div>

                <div className="clean-card">
                  <div className="card-icon-badge">🎯</div>
                  <h3 className="clean-card-title">CBT Mocks &amp; Mistake Vault</h3>
                  <p className="clean-card-desc">
                    20+ full 80-mark mock papers, 2022–2026 PYQ drills, and an automatic retry queue for every question a student gets wrong.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>Built for Private Coaching Classes, Tuition Centers &amp; CBSE Schools</span>
              <span>www.chapterready.in</span>
            </div>
          </section>
        );

      /* 02: THE GAP */
      case 1:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                Why Students Lose Marks <span className="slide-accent">Between Classes</span>.
              </h2>
              <p className="slide-subtitle">
                Even with strong classroom teaching, students struggle during self-study at home due to three common gaps:
              </p>

              <div className="slide-cols-3">
                <div className="clean-card">
                  <span className="big-stat-num">50%</span>
                  <h3 className="clean-card-title">Competency Question Shift</h3>
                  <p className="clean-card-desc">
                    Half the CBSE paper now tests Case Studies, Assertion-Reason, and NCERT Activities rather than memorized definitions.
                  </p>
                </div>

                <div className="clean-card">
                  <span className="big-stat-num">½ Mark</span>
                  <h3 className="clean-card-title">Step-Marking Deductions</h3>
                  <p className="clean-card-desc">
                    Students know the concept but lose 8–12 marks per paper by skipping mandatory CBSE formulas, units, or value points.
                  </p>
                </div>

                <div className="clean-card">
                  <span className="big-stat-num">9 PM</span>
                  <h3 className="clean-card-title">Unresolved Home Doubts</h3>
                  <p className="clean-card-desc">
                    When students get stuck at night, they either give up or use generic AI tools that confuse them with out-of-syllabus methods.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>ChapterReady bridges the gap between your classroom and the student&apos;s study table.</span>
              <span>CBSE 2026–27 Pattern</span>
            </div>
          </section>
        );

      /* 03: HOW IT WORKS */
      case 2:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                One Calm, Distraction-Free <span className="slide-accent">4-Step Loop</span>.
              </h2>
              <p className="slide-subtitle">
                After your teacher finishes a topic in class, students log in for 25 minutes of focused daily reinforcement:
              </p>

              <div className="slide-cols-4">
                <div className="clean-card">
                  <span className="slide-kicker">01 · Revise</span>
                  <h3 className="clean-card-title">Visual Notes</h3>
                  <p className="clean-card-desc">
                    Read concise bullet Summaries, redrawn NCERT diagrams, and 1-page formula sheets.
                  </p>
                </div>

                <div className="clean-card">
                  <span className="slide-kicker">02 · Practice</span>
                  <h3 className="clean-card-title">Topic &amp; PYQ Drills</h3>
                  <p className="clean-card-desc">
                    Solve chapter quizzes, NCERT Exemplar HOTS, and 2022–2026 Board PYQs by weightage.
                  </p>
                </div>

                <div className="clean-card">
                  <span className="slide-kicker">03 · Fix</span>
                  <h3 className="clean-card-title">Mistake Vault</h3>
                  <p className="clean-card-desc">
                    Wrong answers automatically reappear after 3 days until the student proves mastery.
                  </p>
                </div>

                <div className="clean-card card-highlight">
                  <span className="slide-kicker">04 · Simulate</span>
                  <h3 className="clean-card-title">3-Hr Board Mocks</h3>
                  <p className="clean-card-desc">
                    Take full 80-mark timed exams and check written steps against official CBSE rubrics.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>Covers Maths (Standard 041 &amp; Basic 241), Science, Social Science, English &amp; Hindi</span>
              <Link href="/subjects" style={{ color: '#c85a14', fontWeight: 700, textDecoration: 'none' }}>
                Browse Live Chapters →
              </Link>
            </div>
          </section>
        );

      /* 04: LIVE OPTICS & TARA DEMO */
      case 3:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <div className="slide-cols-2">
                <div>
                  <h2 className="slide-title" style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
                    NCERT-Grounded AI + <span className="slide-accent">Classroom-Ready Simulations</span>.
                  </h2>
                  <p className="slide-subtitle" style={{ marginBottom: '20px' }}>
                    Teachers can project our interactive labs on a classroom Smartboard, and students can explore them anytime at home.
                  </p>

                  <ul className="clean-list">
                    <li>
                      <span className="list-dot">✓</span>
                      <span>
                        <strong>Certified NCERT Optics Engine:</strong> Mathematically verified against NCERT Table 9.1 &amp; 9.2 (drag the slider on the right to test it live).
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">✓</span>
                      <span>
                        <strong>3D Science Activity Labs:</strong> Interactive models for Electricity, Magnetic Effects, Chemical Reactions, and Life Processes.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">✓</span>
                      <span>
                        <strong>Tara AI Doubt Coach:</strong> Strictly bounded to the Class 10 NCERT textbook so students never get off-syllabus answers.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <InteractiveOpticsViewer initialType="concave-mirror" initialObjectDistance={40} />
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>Try switching Mirror/Lens types or dragging the object slider above during your demo.</span>
              <Link href="/virtual-lab" style={{ color: '#c85a14', fontWeight: 700, textDecoration: 'none' }}>
                Open Full 3D Virtual Lab →
              </Link>
            </div>
          </section>
        );

      /* 05: BOARD MOCKS & STEP MARKING */
      case 4:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                Train Students on How <span className="slide-accent">CBSE Examiners Actually Award Marks</span>.
              </h2>
              <p className="slide-subtitle">
                Instead of just showing final answers, our practice engine breaks every 2, 3, and 5-mark question into official CBSE Marking Scheme value points.
              </p>

              <div className="slide-cols-2">
                <div className="clean-card">
                  <h3 className="clean-card-title">What Students Practice</h3>
                  <ul className="clean-list">
                    <li>
                      <span className="list-dot">01</span>
                      <span>
                        <strong>20+ Full 80-Mark Mock Papers:</strong> Timed 3-hour CBT simulator across Maths Standard, Maths Basic (241), Science, SST, English &amp; Hindi.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">02</span>
                      <span>
                        <strong>Step-by-Step Self &amp; AI Rubric Check:</strong> Students compare their written steps against official 2022–2026 CBSE value points (or snap a practice answer for AI rubric feedback).
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">03</span>
                      <span>
                        <strong>5-Year PYQ Frequency Trends:</strong> Identifies the highest-weightage chapters and most repeated board questions.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="clean-card" style={{ background: '#181614', color: '#faf7f0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: '#ffad66' }}>
                    EXAMPLE · CBSE 3-MARK STEP RUBRIC VIEW
                  </span>
                  <div style={{ fontSize: '14px', lineHeight: 1.6, marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '10px 12px', background: '#24211e', borderRadius: '10px', color: '#86efac' }}>
                      ✓ <strong>+1.0 Mark:</strong> Stating Mirror Formula (1/v + 1/u = 1/f)
                    </div>
                    <div style={{ padding: '10px 12px', background: '#24211e', borderRadius: '10px', color: '#86efac' }}>
                      ✓ <strong>+1.0 Mark:</strong> Correct sign substitution (u = −15 cm, f = −10 cm)
                    </div>
                    <div style={{ padding: '10px 12px', background: '#24211e', borderRadius: '10px', color: '#fda4af' }}>
                      ! <strong>−0.5 Mark Alert:</strong> Always write SI unit (cm) and image nature (&quot;Real &amp; Inverted&quot;) to avoid half-mark loss.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>Grounded in official CBSE Sample Papers &amp; 2022–2026 Marking Schemes</span>
              <Link href="/exam-papers" style={{ color: '#c85a14', fontWeight: 700, textDecoration: 'none' }}>
                View Mock Test Series →
              </Link>
            </div>
          </section>
        );

      /* 06: FOR COACHING CLASSES VS SCHOOLS */
      case 5:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                How Institutions Use <span className="slide-accent">ChapterReady</span>.
              </h2>
              <p className="slide-subtitle">
                Zero IT setup required. Students log in on any phone, tablet, or laptop; teachers use it on classroom screens.
              </p>

              <div className="slide-cols-2">
                <div className="clean-card card-highlight">
                  <span className="slide-kicker">For Coaching Classes &amp; Tuition Centers</span>
                  <h3 className="clean-card-title" style={{ fontSize: '22px' }}>
                    Give Your Batch a Modern Digital Edge
                  </h3>
                  <ul className="clean-list">
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Assign Daily 15-Min Homework:</strong> Tell students <em>&quot;Complete Chapter 4 Quiz &amp; Formula Rush tonight&quot;</em> after your lecture.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Ready-Made 20-Paper Mock Series:</strong> Run structured pre-board practice without typing and formatting question papers from scratch.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Stand Out to Parents:</strong> Offer a full AI-supported learning &amp; test portal as part of your admission package.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="clean-card">
                  <span className="slide-kicker">For CBSE Affiliated Schools</span>
                  <h3 className="clean-card-title" style={{ fontSize: '22px' }}>
                    NEP 2020 Competency &amp; Smartboard Ready
                  </h3>
                  <ul className="clean-list">
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Visual Smartboard Teaching:</strong> Science and Maths teachers use our 3D Virtual Labs and Ray Optics sliders live in class.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Support Every Student Tier:</strong> Includes both <strong>Mathematics Basic (241)</strong> for borderline students and <strong>Exemplar HOTS</strong> for toppers.
                      </span>
                    </li>
                    <li>
                      <span className="list-dot">•</span>
                      <span>
                        <strong>Save Parents ₹1,200+ on Guidebooks:</strong> Replaces multiple separate sample paper and formula books across 5 subjects.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>Works across Web, Android &amp; iOS browsers with instant batch onboarding</span>
              <span>ChapterReady Institutional</span>
            </div>
          </section>
        );

      /* 07: PRICING & CALCULATOR */
      case 6:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                Transparent Annual Pricing—<span className="slide-accent">Under ₹1 / Day</span> Per Student.
              </h2>
              <p className="slide-subtitle">
                Includes full 1-year student access to all 5 subjects, 20+ mock papers, 3D labs, and complimentary teacher access.
              </p>

              <div className="slide-cols-2">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    className={`clean-card ${studentCount <= 50 ? 'card-highlight' : ''}`}
                    style={{ padding: '18px 22px', cursor: 'pointer', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setStudentCount(40)}
                  >
                    <div>
                      <span className="slide-kicker">Starter Coaching Batch</span>
                      <h3 className="clean-card-title" style={{ marginTop: '4px' }}>Up to 50 Students</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="big-stat-num" style={{ fontSize: '28px' }}>₹499</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#7a7267' }}>/ student / yr</span>
                    </div>
                  </div>

                  <div
                    className={`clean-card ${studentCount > 50 && studentCount <= 250 ? 'card-highlight' : ''}`}
                    style={{ padding: '18px 22px', cursor: 'pointer', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setStudentCount(100)}
                  >
                    <div>
                      <span className="slide-kicker">Growth Institute / School Wing</span>
                      <h3 className="clean-card-title" style={{ marginTop: '4px' }}>51 – 250 Students</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="big-stat-num" style={{ fontSize: '28px', color: '#c85a14' }}>₹349</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#7a7267' }}>/ student / yr</span>
                    </div>
                  </div>

                  <div
                    className={`clean-card ${studentCount > 250 ? 'card-highlight' : ''}`}
                    style={{ padding: '18px 22px', cursor: 'pointer', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onClick={() => setStudentCount(300)}
                  >
                    <div>
                      <span className="slide-kicker">Full School Campus</span>
                      <h3 className="clean-card-title" style={{ marginTop: '4px' }}>250+ Students</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="big-stat-num" style={{ fontSize: '28px' }}>₹249</span>
                      <span style={{ display: 'block', fontSize: '12px', color: '#7a7267' }}>/ student / yr</span>
                    </div>
                  </div>
                </div>

                {/* Simple Batch Calculator */}
                <div className="clean-calc-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: ' baseline' }}>
                    <span style={{ fontSize: '14px', color: '#b8b0a4', fontWeight: 600 }}>Batch Size</span>
                    <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffad66' }}>{studentCount} Students</span>
                  </div>

                  <input
                    type="range"
                    min={15}
                    max={500}
                    step={5}
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="calc-slider"
                    aria-label="Number of students"
                  />

                  <div className="calc-metrics-row">
                    <div className="calc-stat-tile">
                      <span className="calc-stat-label">Per Student Rate</span>
                      <span className="calc-stat-val">₹{pricing.rate} / yr</span>
                    </div>
                    <div className="calc-stat-tile">
                      <span className="calc-stat-label">Cost Per Day</span>
                      <span className="calc-stat-val" style={{ color: '#86efac' }}>₹{pricing.perDay} / day</span>
                    </div>
                  </div>

                  <div className="calc-stat-tile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="calc-stat-label" style={{ fontSize: '12px' }}>Total Annual Batch License</span>
                    <span className="calc-stat-val" style={{ margin: 0, color: '#ffad66' }}>
                      ₹{pricing.total.toLocaleString('en-IN')} / year
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>All institutional plans begin with a Free 30-Day Batch Pilot before any payment.</span>
              <span>GST Invoice Available</span>
            </div>
          </section>
        );

      /* 08: FREE 30-DAY PILOT CTA */
      case 7:
      default:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card slide-dark">
            <div>
              <div className="slide-eyebrow-row">
                <span className="slide-kicker">{meta.kicker}</span>
                <span className="slide-num">{numStr}</span>
              </div>

              <h2 className="slide-title">
                Start With a <span className="slide-accent">Free 30-Day Batch Pilot</span>.
              </h2>
              <p className="slide-subtitle">
                No upfront commitment. Let your teachers and one Class 10 batch use ChapterReady for 30 days and evaluate the impact firsthand.
              </p>

              <div className="slide-cols-3" style={{ marginBottom: '32px' }}>
                <div className="clean-card">
                  <span className="slide-kicker">Day 01</span>
                  <h3 className="clean-card-title">15-Min Onboarding</h3>
                  <p className="clean-card-desc">
                    We activate student and teacher access for one batch and walk your faculty through the Smartboard labs.
                  </p>
                </div>

                <div className="clean-card">
                  <span className="slide-kicker">Day 15</span>
                  <h3 className="clean-card-title">Chapter &amp; Mock Run</h3>
                  <p className="clean-card-desc">
                    Students revise 2 chapters using Visual Notes &amp; Mistake Vault and take a full 80-mark practice mock.
                  </p>
                </div>

                <div className="clean-card card-highlight">
                  <span className="slide-kicker">Day 30</span>
                  <h3 className="clean-card-title">Review &amp; Decide</h3>
                  <p className="clean-card-desc">
                    Review student engagement and feedback with your faculty. Upgrade to an annual license only if it adds clear value.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:hello@chapterready.in?subject=${encodeURIComponent(
                    `Free 30-Day Batch Pilot Inquiry (${studentCount} Students)`
                  )}&body=${encodeURIComponent(
                    `Hello ChapterReady Team,\n\nWe would like to try the Free 30-Day Class 10 Batch Pilot.\n\nInstitute / School Name: \nCity: \nApprox. Class 10 Students: ${studentCount}\nContact Number: \n`
                  )}`}
                  className="pitch-btn-pilot-top"
                  style={{ fontSize: '15px', padding: '14px 26px', borderRadius: '10px' }}
                >
                  Request Free 30-Day Batch Pilot →
                </a>

                <Link
                  href="/feedback"
                  className="pitch-btn-print"
                  style={{ textDecoration: 'none', fontSize: '14px', padding: '13px 20px', borderRadius: '10px' }}
                >
                  Submit Inquiry Form
                </Link>

                <Link
                  href="/"
                  className="pitch-btn-print"
                  style={{ textDecoration: 'none', fontSize: '14px', padding: '13px 20px', borderRadius: '10px' }}
                >
                  Explore Live Platform
                </Link>
              </div>
            </div>

            <div className="slide-bottom-bar">
              <span>🌐 www.chapterready.in · ✉️ hello@chapterready.in</span>
              <span>ChapterReady.in — CBSE Class 10 Learning Portal</span>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="pitch-deck-shell">
      <header className="pitch-topbar no-print">
        <div className="pitch-brand-group">
          <Link href="/" className="pitch-brand-link">
            📘 ChapterReady.in
          </Link>
          <span className="pitch-brand-badge">Institutional Deck</span>
        </div>

        <div className="pitch-controls-center">
          <div className="pitch-mode-toggle" role="tablist" aria-label="View Mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'slide'}
              className={`pitch-mode-btn ${mode === 'slide' ? 'active' : ''}`}
              onClick={() => setMode('slide')}
            >
              Slides
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'brochure'}
              className={`pitch-mode-btn ${mode === 'brochure' ? 'active' : ''}`}
              onClick={() => setMode('brochure')}
            >
              All Slides
            </button>
          </div>

          {mode === 'slide' && (
            <div className="pitch-nav-group">
              <button
                type="button"
                className="pitch-nav-btn"
                onClick={goPrev}
                disabled={activeSlide === 0}
              >
                ←
              </button>
              <span className="pitch-slide-counter">
                {activeSlide + 1} / {totalSlides}
              </span>
              <button
                type="button"
                className="pitch-nav-btn"
                onClick={goNext}
                disabled={activeSlide === totalSlides - 1}
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="pitch-actions-right">
          <button type="button" className="pitch-btn-print" onClick={handlePrint}>
            Print / PDF
          </button>
          <button
            type="button"
            className="pitch-btn-pilot-top"
            onClick={() => {
              if (mode === 'slide') setActiveSlide(totalSlides - 1);
              else document.getElementById('slide-pilot')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Free Pilot
          </button>
        </div>
      </header>

      {mode === 'slide' && (
        <div className="pitch-progress-track no-print">
          <div
            className="pitch-progress-fill"
            style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      )}

      <main className={`pitch-deck-main ${mode === 'slide' ? 'mode-slide' : 'mode-brochure'}`}>
        {mode === 'slide' ? (
          <>
            {renderSlide(activeSlide)}
            <nav className="pitch-dots-bar no-print" aria-label="Slide Navigation">
              {SLIDE_METAS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`pitch-dot-btn ${activeSlide === s.index ? 'active' : ''}`}
                  onClick={() => setActiveSlide(s.index)}
                >
                  {s.shortLabel}
                </button>
              ))}
            </nav>
          </>
        ) : (
          SLIDE_METAS.map((s) => renderSlide(s.index))
        )}
      </main>
    </div>
  );
}
