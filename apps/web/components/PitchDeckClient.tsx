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
  { index: 0, id: 'cover', shortLabel: '01 · Vision', kicker: 'ChapterReady.in Institutional Edition', dark: true },
  { index: 1, id: 'problem', shortLabel: '02 · The Problem', kicker: 'The Academic Bottleneck' },
  { index: 2, id: 'solution', shortLabel: '03 · 5-Step System', kicker: 'Your 24/7 Academic Co-Pilot' },
  { index: 3, id: 'evaluator', shortLabel: '04 · Snap & Grade AI', kicker: 'Automated CBSE Step-Marking' },
  { index: 4, id: 'tara-optics', shortLabel: '05 · Tara AI & Live Lab', kicker: '100% NCERT-Grounded Intelligence' },
  { index: 5, id: 'smartboard', shortLabel: '06 · 3D & PYQ Engine', kicker: 'Smartboard & Mistake Vault' },
  { index: 6, id: 'audiences', shortLabel: '07 · Coaching vs Schools', kicker: 'Tailored Institutional Value' },
  { index: 7, id: 'ecosystem', shortLabel: '08 · Live Proof', kicker: 'Production-Ready Ecosystem', dark: true },
  { index: 8, id: 'pricing', shortLabel: '09 · Pricing & ROI', kicker: 'Institutional Licensing & ROI' },
  { index: 9, id: 'pilot-cta', shortLabel: '10 · Free 30-Day Pilot', kicker: 'Zero-Risk Batch Rollout', dark: true },
];

export default function PitchDeckClient() {
  const [mode, setMode] = useState<ViewMode>('slide');
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(120);
  const [instituteType, setInstituteType] = useState<'coaching' | 'school'>('coaching');

  const totalSlides = SLIDE_METAS.length;

  const goNext = useCallback(() => {
    setActiveSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setActiveSlide((prev) => Math.max(0, prev - 1));
  }, []);

  // Keyboard navigation in slide mode
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

  // Pricing & ROI calculation
  const roiStats = useMemo(() => {
    let ratePerStudent = 499;
    let tierName = 'Coaching Batch Starter (Up to 50 Students)';
    if (studentCount > 250) {
      ratePerStudent = 249;
      tierName = 'Full School / Mega Institute Campus License (250+ Students)';
    } else if (studentCount > 50) {
      ratePerStudent = 349;
      tierName = 'Growth Institute / School Wing License (51–250 Students)';
    }

    const annualTotal = studentCount * ratePerStudent;
    const perStudentPerDay = (ratePerStudent / 365).toFixed(2);
    // Assume 2 subjective mock papers per month * 12 mins manual checking per paper = 24 mins/student/month saved
    const teacherHoursSavedPerMonth = Math.round((studentCount * 24) / 60);
    // Equivalent value of physical sample paper books saved per student (~₹1,200 across 4 subjects)
    const parentBookSavings = studentCount * 1200;

    return {
      ratePerStudent,
      tierName,
      annualTotal,
      perStudentPerDay,
      teacherHoursSavedPerMonth,
      parentBookSavings,
    };
  }, [studentCount]);

  const handlePrint = () => {
    // Switch to brochure mode momentarily before print so all slides are mounted in DOM
    const previousMode = mode;
    setMode('brochure');
    setTimeout(() => {
      window.print();
      setMode(previousMode);
    }, 150);
  };

  const renderSlideContent = (index: number) => {
    const meta = SLIDE_METAS[index];

    switch (index) {
      /* ====================================================================
         SLIDE 01: COVER & INSTITUTIONAL VISION
         ==================================================================== */
      case 0:
        return (
          <section
            key={meta.id}
            id={`slide-${meta.id}`}
            className={`pitch-slide-card ${meta.dark ? 'slide-dark' : ''}`}
          >
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">🚀 {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 01 / 10 · B2B PITCH DECK</span>
              </div>

              <h1 className="slide-title" style={{ fontSize: 'clamp(32px, 4.2vw, 54px)', marginTop: '12px' }}>
                Turn Every Class 10 Batch Into a{' '}
                <span className="slide-title-highlight">95%+ CBSE Board Result</span> Powerhouse.
              </h1>

              <p className="slide-subtitle" style={{ fontSize: 'clamp(17px, 1.5vw, 21px)' }}>
                <strong>ChapterReady.in</strong> equips <strong>Private Coaching Classes, Tuition Centers, and CBSE Schools</strong> with an AI-Powered Board Exam Practice, Handwritten Answer Evaluator, and Interactive 3D Lab Infrastructure—built 100% strictly on the official NCERT &amp; CBSE 2026–27 Blueprint.
              </p>

              <div className="slide-grid-3" style={{ marginTop: '24px' }}>
                <div className="pitch-box">
                  <span className="pitch-box-icon">📝</span>
                  <h3 className="pitch-box-title">Snap &amp; Grade AI Evaluator</h3>
                  <p className="pitch-box-desc">
                    Students write subjective answers on paper, snap a photo, and get instant step-by-step CBSE rubric grading—saving teachers 10+ hours a week.
                  </p>
                </div>

                <div className="pitch-box">
                  <span className="pitch-box-icon">🤖</span>
                  <h3 className="pitch-box-title">Tara AI (Zero Hallucinations)</h3>
                  <p className="pitch-box-desc">
                    24/7 NCERT-grounded Socratic tutor with deterministic ray-optics &amp; science simulations so no student stays stuck at 10 PM before a test.
                  </p>
                </div>

                <div className="pitch-box">
                  <span className="pitch-box-icon">📊</span>
                  <h3 className="pitch-box-title">Batch Weak-Topic Intelligence</h3>
                  <p className="pitch-box-desc">
                    Automatic Mistake Vault, 3-Hour CBT Board Mocks, and Exemplar HOTS drills that pinpoint which exact concept each student is losing marks on.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="pitch-stat-row">
                <div className="pitch-stat-card">
                  <span className="pitch-stat-val">100%</span>
                  <span className="pitch-stat-lbl">NCERT &amp; CBSE 2026–27 Aligned</span>
                </div>
                <div className="pitch-stat-card">
                  <span className="pitch-stat-val">5 Subjects</span>
                  <span className="pitch-stat-lbl">Maths · Science · SST · Eng · Hindi</span>
                </div>
                <div className="pitch-stat-card">
                  <span className="pitch-stat-val">&lt; ₹1 / Day</span>
                  <span className="pitch-stat-lbl">Per Student Institutional License</span>
                </div>
                <div className="pitch-stat-card">
                  <span className="pitch-stat-val">30-Day</span>
                  <span className="pitch-stat-lbl">100% Free Batch Pilot Guarantee</span>
                </div>
              </div>

              <div className="slide-footer-strip">
                <span>🌐 Live Platform: www.chapterready.in</span>
                <span>🎯 Designed for Principals, Academic Directors &amp; Coaching Founders</span>
              </div>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 02: THE INSTITUTIONAL PROBLEM
         ==================================================================== */
      case 1:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">⚠️ {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 02 / 10 · PROBLEM STATEMENT</span>
              </div>

              <h2 className="slide-title">
                Great Teachers Teach Well in Class—So Why Do Students Still{' '}
                <span className="slide-title-highlight">Lose 15–20 Marks</span> in Boards?
              </h2>
              <p className="slide-subtitle">
                Coaching institutes and schools invest heavily in classroom lectures, yet four critical operational bottlenecks hold back batch-wide distinction results:
              </p>

              <div className="slide-grid-2">
                <div className="pitch-box box-accent">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">⏳</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '3px 10px', borderRadius: '99px' }}>
                      BOTTLENECK 01
                    </span>
                  </div>
                  <h3 className="pitch-box-title">Crushing Subjective Paper-Checking Workload</h3>
                  <p className="pitch-box-desc">
                    Checking 60+ handwritten 80-mark mock scripts takes a teacher 15+ hours. As a result, institutes run fewer subjective tests, and students lose marks on missing CBSE step-marking keywords, units, and formulas.
                  </p>
                </div>

                <div className="pitch-box box-accent">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">🧩</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '3px 10px', borderRadius: '99px' }}>
                      BOTTLENECK 02
                    </span>
                  </div>
                  <h3 className="pitch-box-title">50% Shift to Competency &amp; Case-Based Questions</h3>
                  <p className="pitch-box-desc">
                    CBSE now mandates 50% Competency-Focused Questions (MCQs, Assertion-Reason, Case Studies, NCERT Exemplar HOTS). Rote memorization of textbook definitions no longer guarantees 80%+ scores.
                  </p>
                </div>

                <div className="pitch-box box-accent">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">🌙</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '3px 10px', borderRadius: '99px' }}>
                      BOTTLENECK 03
                    </span>
                  </div>
                  <h3 className="pitch-box-title">The 8 PM – 11 PM Self-Study Black Hole</h3>
                  <p className="pitch-box-desc">
                    When students study at home and get stuck on a Trigonometry proof or Ray Diagram, their coaching teacher isn&apos;t available. They turn to YouTube distractions or generic AI that hallucinates out-of-syllabus methods.
                  </p>
                </div>

                <div className="pitch-box box-accent">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">📉</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '3px 10px', borderRadius: '99px' }}>
                      BOTTLENECK 04
                    </span>
                  </div>
                  <h3 className="pitch-box-title">Zero Granular Visibility for Parents &amp; Directors</h3>
                  <p className="pitch-box-desc">
                    Parents constantly ask: <em>&quot;Is my child actually ready for Boards?&quot;</em> Without topic-level mastery tracking and mistake-retry loops, institutes only discover weak students after Pre-Board failures.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>💡 Insight: You don&apos;t need more lecture hours—you need automated practice &amp; evaluation infrastructure.</span>
              <span>ChapterReady.in B2B Deck</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 03: THE SOLUTION — 5-STEP CHAPTERREADY METHOD
         ==================================================================== */
      case 2:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">✨ {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 03 / 10 · THE SOLUTION</span>
              </div>

              <h2 className="slide-title">
                We Don&apos;t Replace Your Faculty—We{' '}
                <span className="slide-title-highlight">Multiply Their Impact</span> 24/7.
              </h2>
              <p className="slide-subtitle">
                Your teachers lead the classroom; <strong>ChapterReady.in</strong> automates daily chapter revision, NCERT activity visualization, competency testing, and mistake remediation at home.
              </p>

              <div className="slide-grid-4" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginTop: '18px' }}>
                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#d95d16' }}>STEP 01</span>
                  <span className="pitch-box-icon">📖</span>
                  <h3 className="pitch-box-title" style={{ fontSize: '16px' }}>Learn Visual Notes</h3>
                  <p className="pitch-box-desc" style={{ fontSize: '13px' }}>
                    Scannable NCERT chapter packs with memory hooks, vector diagrams &amp; 27-chapter formula sheets.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#d95d16' }}>STEP 02</span>
                  <span className="pitch-box-icon">🔬</span>
                  <h3 className="pitch-box-title" style={{ fontSize: '16px' }}>Interact in 3D Labs</h3>
                  <p className="pitch-box-desc" style={{ fontSize: '13px' }}>
                    Every NCERT Science experiment &amp; ray diagram brought to life with interactive observation pins.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#d95d16' }}>STEP 03</span>
                  <span className="pitch-box-icon">⚡</span>
                  <h3 className="pitch-box-title" style={{ fontSize: '16px' }}>Practice PYQs &amp; HOTS</h3>
                  <p className="pitch-box-desc" style={{ fontSize: '13px' }}>
                    Topic quizzes, NCERT Exemplar HOTS Arena, and 2022–2026 Board PYQ frequency ladders.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#d95d16' }}>STEP 04</span>
                  <span className="pitch-box-icon">🔁</span>
                  <h3 className="pitch-box-title" style={{ fontSize: '16px' }}>Fix in Mistake Vault</h3>
                  <p className="pitch-box-desc" style={{ fontSize: '13px' }}>
                    Every wrong answer enters an automated 3-day spaced-repetition retry queue until mastered.
                  </p>
                </div>

                <div className="pitch-box box-emerald">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#15803d' }}>STEP 05</span>
                  <span className="pitch-box-icon">🏆</span>
                  <h3 className="pitch-box-title" style={{ fontSize: '16px' }}>80-Mark Board Ready</h3>
                  <p className="pitch-box-desc" style={{ fontSize: '13px' }}>
                    Full 3-Hour CBT Simulator + Handwritten Snap &amp; Grade evaluation with predicted Board Readiness %.
                  </p>
                </div>
              </div>

              <div className="pitch-box" style={{ marginTop: '22px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', background: '#171513', color: '#fffaf1' }}>
                <div>
                  <strong style={{ color: '#ffcf4a', fontSize: '16px', display: 'block' }}>
                    🎯 Complete CBSE Class 10 Multi-Subject Coverage
                  </strong>
                  <span style={{ fontSize: '14px', color: '#d6cfc2' }}>
                    Mathematics (Standard 041 &amp; Basic 241) · Science (086) · Social Science (087) · English (184) · Hindi (Course A &amp; B)
                  </span>
                </div>
                <Link href="/subjects" className="pitch-btn-pilot-top" style={{ textDecoration: 'none' }}>
                  Explore Live Curriculum →
                </Link>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>✅ Works seamlessly on Android, iOS, Tablets, Laptops &amp; Classroom Smartboards</span>
              <span>www.chapterready.in</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 04: PILLAR 1 — SNAP & GRADE AI WRITTEN EVALUATOR & CBT MOCKS
         ==================================================================== */
      case 3:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">✍️ {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 04 / 10 · AI WRITTEN EVALUATOR</span>
              </div>

              <h2 className="slide-title">
                Grade 100 Handwritten Answer Sheets in{' '}
                <span className="slide-title-highlight">Seconds, Not Weekends</span>.
              </h2>
              <p className="slide-subtitle">
                CBSE Board exams are written with pen and paper—MCQ apps aren&apos;t enough. Our <strong>Snap &amp; Grade AI Written Evaluator</strong> grades handwritten subjective answers against official CBSE step-marking rubrics.
              </p>

              <div className="slide-grid-2">
                <div className="pitch-box">
                  <h3 className="pitch-box-title" style={{ fontSize: '20px' }}>
                    📸 How Snap &amp; Grade Works for Your Batch
                  </h3>
                  <ul className="pitch-check-list" style={{ marginTop: '8px' }}>
                    <li>
                      <span>1️⃣</span>
                      <span>
                        <strong>Student Writes on Notebook Paper:</strong> Solves 3-mark or 5-mark derivations, numericals, or long-answer questions just like in the Board hall.
                      </span>
                    </li>
                    <li>
                      <span>2️⃣</span>
                      <span>
                        <strong>Snaps Photo via Phone/Tablet:</strong> Uploads the handwritten answer directly inside the ChapterReady Mock Exam portal.
                      </span>
                    </li>
                    <li>
                      <span>3️⃣</span>
                      <span>
                        <strong>Grounded CBSE Step-Marking Check:</strong> Our engine compares each step against official CBSE Marking Scheme value points (2022–2026 repository).
                      </span>
                    </li>
                    <li>
                      <span>4️⃣</span>
                      <span>
                        <strong>Pinpoints Exact Half-Mark Deductions:</strong> Highlights missing SI units, unstated formulas, incomplete chemical balancing, or missing value keywords.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pitch-box" style={{ background: '#171513', color: '#fffaf1', borderColor: '#171513' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffcf4a', letterSpacing: '0.08em' }}>
                      SAMPLE AI STEP-MARKING RUBRIC BREAKDOWN
                    </span>
                    <span style={{ background: '#15803d', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '3px 10px', borderRadius: '99px' }}>
                      Score: 2.5 / 3.0 Marks
                    </span>
                  </div>

                  <div style={{ background: '#24201d', padding: '14px', borderRadius: '12px', border: '1px solid #3d3630', fontSize: '13.5px', lineHeight: 1.5 }}>
                    <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '6px' }}>
                      ✓ Step 1 (+1.0m): Mirror formula stated correctly (1/v + 1/u = 1/f)
                    </div>
                    <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '6px' }}>
                      ✓ Step 2 (+1.0m): Correct New Cartesian Sign substitution (u = -15 cm, f = -10 cm)
                    </div>
                    <div style={{ color: '#4ade80', fontWeight: 700, marginBottom: '6px' }}>
                      ✓ Step 3 (+0.5m): Calculated v = -30 cm accurately
                    </div>
                    <div style={{ color: '#fb7185', fontWeight: 700 }}>
                      ✗ Deduction (-0.5m): Missing nature of image statement (&quot;Real, inverted and magnified&quot;) required by CBSE 2025 Marking Scheme.
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: '#d6cfc2' }}>
                      Includes <strong>20+ Full 80-Mark Mock Series</strong> across Maths Standard, Maths Basic (241), Science, SST, English &amp; Hindi.
                    </span>
                    <Link href="/exam-papers" className="pitch-btn-pilot-top" style={{ textDecoration: 'none' }}>
                      Try Mock Evaluator →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>⏱️ Saves 12–18 hours of manual teacher checking per batch every single month</span>
              <span>Grounded in Official CBSE Marking Schemes</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 05: PILLAR 2 — TARA AI TUTOR + LIVE INTERACTIVE OPTICS ENGINE
         ==================================================================== */
      case 4:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">🔬 {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 05 / 10 · LIVE INTERACTIVE DEMO</span>
              </div>

              <h2 className="slide-title">
                Meet <strong>Tara AI</strong>: Zero Hallucinations +{' '}
                <span className="slide-title-highlight">Certified Interactive Physics</span>.
              </h2>
              <p className="slide-subtitle">
                Generic AI chatbots confuse Class 10 students with Class 12 calculus or wrong ray diagrams. <strong>Tara AI</strong> is strictly bounded to NCERT Class 10 and dispatches deterministic, pre-verified scientific simulations right inside chat.
              </p>

              <div className="slide-grid-2" style={{ alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="pitch-box">
                    <h3 className="pitch-box-title">🛡️ Why Principals &amp; Teachers Trust Tara AI</h3>
                    <ul className="pitch-check-list" style={{ marginTop: '6px' }}>
                      <li>
                        <span>✅</span>
                        <span>
                          <strong>100% NCERT Syllabus Guardrails:</strong> Never uses out-of-syllabus formulas; cites exact NCERT chapter sections and board tips.
                        </span>
                      </li>
                      <li>
                        <span>✅</span>
                        <span>
                          <strong>Socratic Step-by-Step Coaching:</strong> Guides students to think through hints rather than encouraging lazy copy-pasting.
                        </span>
                      </li>
                      <li>
                        <span>✅</span>
                        <span>
                          <strong>Canonical Tier-A Visual Engine:</strong> Mathematically proven NCERT Table 9.1 &amp; 9.2 Ray Optics engine—zero LLM drawing errors.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pitch-box box-emerald">
                    <strong style={{ fontSize: '15px' }}>
                      👆 Try It Live Right Now on This Slide (Or Smartboard!):
                    </strong>
                    <p className="pitch-box-desc">
                      Switch between <strong>Concave/Convex Mirror &amp; Lens</strong>, click preset pills (<em>&quot;Between F &amp; P&quot;, &quot;At C&quot;</em>), or drag the object distance slider on the right to see real-time New Cartesian Sign Convention readouts!
                    </p>
                  </div>
                </div>

                {/* Live Embedded Interactive Optics Component */}
                <div>
                  <InteractiveOpticsViewer initialType="concave-mirror" initialObjectDistance={40} />
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>✨ Teachers also use this live on classroom Smartboards to teach Light (Ch 9) in 5 minutes!</span>
              <span>100% Verified against NCERT Table 9.1 &amp; 9.2</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 06: PILLAR 3 — 3D SMARTBOARD LABS, PYQ TRENDS & MISTAKE VAULT
         ==================================================================== */
      case 5:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">🧪 {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 06 / 10 · LABS &amp; DIAGNOSTICS</span>
              </div>

              <h2 className="slide-title">
                Turn Any Classroom TV or Projector Into a{' '}
                <span className="slide-title-highlight">3D Science Lab &amp; Exam War-Room</span>.
              </h2>
              <p className="slide-subtitle">
                Every student and teacher account unlocks our specialized high-yield CBSE tools designed to maximize retention and eliminate repeated errors:
              </p>

              <div className="slide-grid-2">
                <div className="pitch-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">🥽</span>
                    <Link href="/virtual-lab" style={{ fontSize: '12px', fontWeight: 800, color: '#d95d16', textDecoration: 'none' }}>
                      Open 3D Lab →
                    </Link>
                  </div>
                  <h3 className="pitch-box-title">3D Virtual Science Labs &amp; Activity Explorer</h3>
                  <p className="pitch-box-desc">
                    CBSE asks direct case-study questions from NCERT Science Activities (e.g., Lead Nitrate heating, Electrolysis of Water, Solenoid magnetic fields). Students &amp; teachers can rotate, inspect, and trigger every experiment virtually.
                  </p>
                </div>

                <div className="pitch-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">📈</span>
                    <Link href="/pyq-trends" style={{ fontSize: '12px', fontWeight: 800, color: '#d95d16', textDecoration: 'none' }}>
                      Open PYQ Trends →
                    </Link>
                  </div>
                  <h3 className="pitch-box-title">2022–2026 Board PYQ Frequency &amp; Weightage Radar</h3>
                  <p className="pitch-box-desc">
                    Shows students and faculty which topics appear every year in CBSE Board papers, complete with exact mark distribution, historical paper codes, and official examiner deduction notes.
                  </p>
                </div>

                <div className="pitch-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">🔐</span>
                    <Link href="/my-mistakes" style={{ fontSize: '12px', fontWeight: 800, color: '#d95d16', textDecoration: 'none' }}>
                      Open Mistake Vault →
                    </Link>
                  </div>
                  <h3 className="pitch-box-title">Automated Spaced-Repetition Mistake Vault</h3>
                  <p className="pitch-box-desc">
                    Students don&apos;t improve by solving what they already know. Every wrong quiz or mock question is automatically captured in their personal Mistake Vault for mandatory 3-day spaced-repetition re-testing.
                  </p>
                </div>

                <div className="pitch-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="pitch-box-icon">⚡</span>
                    <Link href="/formula-cheatsheets" style={{ fontSize: '12px', fontWeight: 800, color: '#d95d16', textDecoration: 'none' }}>
                      Open Cheatsheets →
                    </Link>
                  </div>
                  <h3 className="pitch-box-title">27-Chapter Formula Pack &amp; Formula Rush Arcade</h3>
                  <p className="pitch-box-desc">
                    One-page printable &amp; interactive formula/reaction sheets for all 14 Maths + 13 Science chapters, paired with gamified 60-second active recall drills that build calculation speed.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>🎓 Includes NCERT Exemplar HOTS Arena for students aiming for 95–100 in Maths &amp; Science</span>
              <span>www.chapterready.in</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 07: TAILORED FOR COACHING CLASSES VS CBSE SCHOOLS
         ==================================================================== */
      case 6:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">🏛️ {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 07 / 10 · WHY INSTITUTES BUY</span>
              </div>

              <h2 className="slide-title">
                How ChapterReady Drives Growth for{' '}
                <span className="slide-title-highlight">Coaching Centers &amp; CBSE Schools</span>
              </h2>
              <p className="slide-subtitle">
                Whether you run an ambitious private coaching batch of 40 students or a K–12 CBSE school with 400 Class 10 students, ChapterReady plugs directly into your academic calendar:
              </p>

              <div className="slide-grid-2">
                <div className="pitch-box" style={{ borderColor: '#d95d16', boxShadow: '6px 6px 0 #d95d16' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="pitch-box-icon">🎯</span>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#d95d16', letterSpacing: '0.08em' }}>
                        FOR PRIVATE COACHING &amp; TUITION CENTERS
                      </span>
                      <h3 className="pitch-box-title" style={{ fontSize: '21px' }}>
                        Stand Out from Local Competitors &amp; Boost Admissions
                      </h3>
                    </div>
                  </div>

                  <ul className="pitch-check-list" style={{ marginTop: '8px' }}>
                    <li>
                      <span>🚀</span>
                      <span>
                        <strong>Compete with National EdTech Giants:</strong> Offer your students an AI-powered test portal, 3D labs, and 24/7 AI doubt solver under your coaching umbrella.
                      </span>
                    </li>
                    <li>
                      <span>📝</span>
                      <span>
                        <strong>Run Weekly Sunday CBT + Written Mocks Effortlessly:</strong> Zero paper-printing costs or Sunday night checking marathons for your faculty.
                      </span>
                    </li>
                    <li>
                      <span>👨‍👩‍👧</span>
                      <span>
                        <strong>Concrete Proof for Parents at PTM:</strong> Show parents real-time Board Readiness % and chapter mastery instead of vague feedback.
                      </span>
                    </li>
                    <li>
                      <span>💰</span>
                      <span>
                        <strong>High-Margin Value Add:</strong> Bundle ChapterReady into your annual coaching fee (costs you &lt; ₹35/month/student, perceived value ₹3,000+/yr).
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pitch-box" style={{ borderColor: '#15803d', boxShadow: '6px 6px 0 #15803d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="pitch-box-icon">🏫</span>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: '#15803d', letterSpacing: '0.08em' }}>
                        FOR CBSE AFFILIATED SCHOOLS
                      </span>
                      <h3 className="pitch-box-title" style={{ fontSize: '21px' }}>
                        100% NEP 2020 Competency Alignment &amp; Higher School Average
                      </h3>
                    </div>
                  </div>

                  <ul className="pitch-check-list" style={{ marginTop: '8px' }}>
                    <li>
                      <span>📐</span>
                      <span>
                        <strong>Built for NEP 2020 &amp; CBSE Competency Mandate:</strong> Ready-made Case-Based, Assertion-Reason, and NCERT Exemplar question banks.
                      </span>
                    </li>
                    <li>
                      <span>🖥️</span>
                      <span>
                        <strong>Instant Smartboard Visual Content:</strong> Teachers project interactive ray diagrams, 3D chemical reactions, and biology models in class.
                      </span>
                    </li>
                    <li>
                      <span>🛡️</span>
                      <span>
                        <strong>Lift Weak &amp; Borderline Students (Maths Basic 241):</strong> Dedicated Mathematics Basic (241) and Hindi mock series ensure 100% school pass rate.
                      </span>
                    </li>
                    <li>
                      <span>📊</span>
                      <span>
                        <strong>Principal &amp; HOD Readiness Oversight:</strong> Identify which sections or chapters across Class 10 need remedial periods before Pre-Boards.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>🤝 Zero IT setup required — Cloud-hosted on chapterready.in with instant student onboarding</span>
              <span>ChapterReady Institutional Partnership</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 08: LIVE PRODUCTION ECOSYSTEM & PROOF
         ==================================================================== */
      case 7:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card slide-dark">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">⚡ {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 08 / 10 · PRODUCT DEPTH</span>
              </div>

              <h2 className="slide-title">
                Not a Slideware Concept—A{' '}
                <span className="slide-title-highlight">Live, Battle-Tested CBSE Platform</span>.
              </h2>
              <p className="slide-subtitle">
                Backed by our structured <strong>CBSE Knowledge Base (`cbse_KB`)</strong> pipeline parsing official NCERT Textbooks, NCERT Exemplars, 2022–2026 Board Papers, and official CBSE Marking Schemes.
              </p>

              <div className="slide-grid-3">
                <div className="pitch-box">
                  <span style={{ color: '#ffcf4a', fontWeight: 900, fontSize: '26px' }}>76+ Chapter Packs</span>
                  <h3 className="pitch-box-title">Complete Structured Notes</h3>
                  <p className="pitch-box-desc">
                    Simplified bullet-point lessons, memory boxes, common board mistakes, and comic-style recaps across all core Class 10 subjects.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ color: '#ffcf4a', fontWeight: 900, fontSize: '26px' }}>2022–2026 PYQs</span>
                  <h3 className="pitch-box-title">Step-Marked Board Archive</h3>
                  <p className="pitch-box-desc">
                    Authentic previous-year board questions mapped to chapters with official CBSE value points and examiner deduction guidelines.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ color: '#ffcf4a', fontWeight: 900, fontSize: '26px' }}>Exemplar HOTS</span>
                  <h3 className="pitch-box-title">100% Verified Solutions</h3>
                  <p className="pitch-box-desc">
                    Parsed NCERT Exemplar problems across 13 Maths &amp; Science chapters to train students for the toughest 5-mark board questions.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '26px' }}>27 Formula Sheets</span>
                  <h3 className="pitch-box-title">Maths &amp; Science Cheatsheets</h3>
                  <p className="pitch-box-desc">
                    Every theorem, mensuration formula, chemical equation, and colour change in rapid-revision 1-page interactive cards.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '26px' }}>Maths 041 &amp; 241</span>
                  <h3 className="pitch-box-title">Standard + Basic + Hindi Mocks</h3>
                  <p className="pitch-box-desc">
                    Supports both toppers targeting 100/100 in Maths Standard and students needing confidence in Maths Basic (241) &amp; Hindi.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ color: '#4ade80', fontWeight: 900, fontSize: '26px' }}>Calm 3-Zone UI</span>
                  <h3 className="pitch-box-title">Distraction-Free Student UX</h3>
                  <p className="pitch-box-desc">
                    No social media feeds or ad clutter—just Daily Study Missions, Board Readiness %, Mistake Vault, and focused active recall.
                  </p>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>🔗 Explore Live Modules: /dashboard · /exam-papers · /virtual-lab · /pyq-trends · /formula-cheatsheets</span>
              <span>100% Production Deployed</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 09: INSTITUTIONAL PRICING & INTERACTIVE ROI CALCULATOR
         ==================================================================== */
      case 8:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">💎 {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 09 / 10 · B2B PRICING &amp; ROI</span>
              </div>

              <h2 className="slide-title">
                Simple, Transparent Annual Licensing—{' '}
                <span className="slide-title-highlight">Less Than ₹1 / Day</span> Per Student.
              </h2>
              <p className="slide-subtitle">
                Every student receives full 1-year unlimited access to all 5 subjects, 20+ CBT Mock Papers, Snap &amp; Grade AI Written Evaluator, Tara AI Tutor, and 3D Virtual Labs.
              </p>

              <div className="slide-grid-2" style={{ alignItems: 'stretch' }}>
                {/* Left: 3 Pricing Tiers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div
                    className={`pitch-box ${studentCount <= 50 ? 'box-accent' : ''}`}
                    style={{ padding: '14px 18px', cursor: 'pointer' }}
                    onClick={() => setStudentCount(40)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#9a3412', textTransform: 'uppercase' }}>
                          TIER 1 · COACHING BATCH STARTER
                        </span>
                        <h3 className="pitch-box-title" style={{ fontSize: '17px' }}>Up to 50 Students</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#171513' }}>₹499</span>
                        <span style={{ fontSize: '12px', display: 'block', color: '#6b635b', fontWeight: 700 }}>/ student / year</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pitch-box ${studentCount > 50 && studentCount <= 250 ? 'box-emerald' : ''}`}
                    style={{ padding: '14px 18px', cursor: 'pointer' }}
                    onClick={() => setStudentCount(120)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#15803d', textTransform: 'uppercase' }}>
                          ⭐ MOST POPULAR · GROWTH INSTITUTE / SCHOOL WING
                        </span>
                        <h3 className="pitch-box-title" style={{ fontSize: '17px' }}>51 to 250 Students</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#15803d' }}>₹349</span>
                        <span style={{ fontSize: '12px', display: 'block', color: '#166534', fontWeight: 700 }}>/ student / year</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`pitch-box ${studentCount > 250 ? 'box-emerald' : ''}`}
                    style={{ padding: '14px 18px', cursor: 'pointer' }}
                    onClick={() => setStudentCount(350)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                          TIER 3 · FULL SCHOOL CAMPUS LICENSE
                        </span>
                        <h3 className="pitch-box-title" style={{ fontSize: '17px' }}>250+ Students</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '24px', fontWeight: 900, color: '#171513' }}>₹249</span>
                        <span style={{ fontSize: '12px', display: 'block', color: '#6b635b', fontWeight: 700 }}>/ student / year</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#4b453f', fontWeight: 600, paddingLeft: '4px' }}>
                    💡 <em>Retail B2C price is ₹1,499/year—institutional partners get up to <strong>83% bulk academic discount</strong> + complimentary Teacher/Smartboard accounts.</em>
                  </div>
                </div>

                {/* Right: Interactive Batch ROI Calculator */}
                <div className="roi-calc-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '16px', color: '#ffcf4a' }}>
                      🧮 Interactive Batch Pricing &amp; ROI Calculator
                    </strong>
                    <div style={{ display: 'inline-flex', background: '#2a2623', borderRadius: '99px', padding: '3px' }}>
                      <button
                        type="button"
                        onClick={() => setInstituteType('coaching')}
                        style={{
                          background: instituteType === 'coaching' ? '#f3883b' : 'transparent',
                          color: instituteType === 'coaching' ? '#171513' : '#d6cfc2',
                          border: 'none',
                          borderRadius: '99px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Coaching Class
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstituteType('school')}
                        style={{
                          background: instituteType === 'school' ? '#f3883b' : 'transparent',
                          color: instituteType === 'school' ? '#171513' : '#d6cfc2',
                          border: 'none',
                          borderRadius: '99px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        CBSE School
                      </button>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      <span>Number of Class 10 Students:</span>
                      <span style={{ color: '#ffcf4a', fontSize: '18px', fontWeight: 900 }}>{studentCount} Students</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={600}
                      step={5}
                      value={studentCount}
                      onChange={(e) => setStudentCount(Number(e.target.value))}
                      className="roi-slider-input"
                      aria-label="Number of Class 10 Students"
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a8a096', marginTop: '4px' }}>
                      <span>15 (1 Batch)</span>
                      <span>120 (Coaching Center)</span>
                      <span>350+ (Full School)</span>
                    </div>
                  </div>

                  <div className="roi-output-grid">
                    <div className="roi-metric-box">
                      <span className="roi-metric-label">Applicable Rate</span>
                      <span className="roi-metric-value">₹{roiStats.ratePerStudent} / student / yr</span>
                    </div>
                    <div className="roi-metric-box">
                      <span className="roi-metric-label">Daily Cost Per Student</span>
                      <span className="roi-metric-value" style={{ color: '#4ade80' }}>₹{roiStats.perStudentPerDay} / day</span>
                    </div>
                    <div className="roi-metric-box">
                      <span className="roi-metric-label">Annual Batch Investment</span>
                      <span className="roi-metric-value">₹{roiStats.annualTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="roi-metric-box">
                      <span className="roi-metric-label">Teacher Grading Saved</span>
                      <span className="roi-metric-value" style={{ color: '#4ade80' }}>~{roiStats.teacherHoursSavedPerMonth} hrs / month</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#d6cfc2', background: '#24201d', padding: '10px 12px', borderRadius: '10px' }}>
                    {instituteType === 'coaching' ? (
                      <>
                        💰 <strong>Coaching Fee Tip:</strong> Include this as a <strong>₹1,000 &quot;AI Test Series &amp; Lab Kit&quot;</strong> in your admission package—recover 100% of software cost and generate <strong>₹{(studentCount * (1000 - roiStats.ratePerStudent)).toLocaleString('en-IN')}+ net surplus</strong> for your institute!
                      </>
                    ) : (
                      <>
                        📚 <strong>School Parent Benefit:</strong> Replaces ₹1,200+ of physical sample paper books per student, saving your school&apos;s parents <strong>₹{roiStats.parentBookSavings.toLocaleString('en-IN')}</strong> collectively!
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>🎁 Every Annual License starts with a 100% Free 30-Day Batch Pilot so you see results first</span>
              <span>Flexible GST Invoicing &amp; Semester Billing Available</span>
            </div>
          </section>
        );

      /* ====================================================================
         SLIDE 10: ZERO-RISK CTA — FREE 30-DAY BATCH PILOT
         ==================================================================== */
      case 9:
      default:
        return (
          <section key={meta.id} id={`slide-${meta.id}`} className="pitch-slide-card slide-dark">
            <div>
              <div className="slide-meta-bar">
                <span className="slide-kicker">🤝 {meta.kicker}</span>
                <span className="slide-number-pill">SLIDE 10 / 10 · NEXT STEPS &amp; PILOT</span>
              </div>

              <h2 className="slide-title" style={{ fontSize: 'clamp(30px, 3.8vw, 48px)' }}>
                Don&apos;t Take Our Word for It—Run a{' '}
                <span className="slide-title-highlight">Free 30-Day Pilot</span> With 1 Batch.
              </h2>
              <p className="slide-subtitle">
                Experience how much your students love the visual notes, Tara AI tutor, and CBT mocks—and see how many hours your teachers save on paper evaluation—before paying a single rupee.
              </p>

              <div className="slide-grid-3" style={{ marginTop: '20px' }}>
                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffcf4a' }}>WEEK 1 · 15-MIN ONBOARDING</span>
                  <h3 className="pitch-box-title">1. Activate Your First Batch</h3>
                  <p className="pitch-box-desc">
                    We onboard 1 Class 10 section or coaching batch (30–60 students) + your Maths &amp; Science faculty with instant login access and Smartboard walkthrough.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#ffcf4a' }}>WEEK 2 · AI MOCK &amp; LABS</span>
                  <h3 className="pitch-box-title">2. Conduct 1 AI-Graded Mock Test</h3>
                  <p className="pitch-box-desc">
                    Students revise 2 chapters using Visual Notes &amp; Tara AI, then take a Sunday CBT + Handwritten Snap &amp; Grade test with zero teacher checking load.
                  </p>
                </div>

                <div className="pitch-box">
                  <span style={{ fontSize: '12px', fontWeight: 900, color: '#4ade80' }}>DAY 30 · READINESS REPORT</span>
                  <h3 className="pitch-box-title">3. Review Batch Score Lift</h3>
                  <p className="pitch-box-desc">
                    We present your batch&apos;s Weak-Topic Diagnostic Report and student satisfaction metrics. Upgrade to the Annual License only if you are 100% delighted.
                  </p>
                </div>
              </div>

              {/* Action CTA Banner */}
              <div
                className="pitch-box"
                style={{
                  marginTop: '24px',
                  background: 'linear-gradient(135deg, #24201d 0%, #171513 100%)',
                  borderColor: '#ffcf4a',
                  boxShadow: '6px 6px 0 #f3883b',
                  padding: '24px 28px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      🚀 LIMITED INSTITUTIONAL PARTNER SLOTS FOR 2026–27 BOARD SESSION
                    </span>
                    <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '6px 0 4px', color: '#fffaf1' }}>
                      Ready to Launch Your Free 30-Day Batch Pilot?
                    </h3>
                    <p style={{ margin: 0, fontSize: '14.5px', color: '#d6cfc2' }}>
                      Book a 15-minute live demo for your Principal, Academic Director, or Coaching Faculty today.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href={`mailto:hello@chapterready.in?subject=${encodeURIComponent(
                        `Free 30-Day Institutional Pilot Request (${studentCount} Students)`
                      )}&body=${encodeURIComponent(
                        `Hello ChapterReady Team,\n\nWe would like to request a Free 30-Day Class 10 Batch Pilot for our ${
                          instituteType === 'coaching' ? 'Coaching Institute' : 'CBSE School'
                        }.\n\nApproximate Class 10 Student Strength: ${studentCount}\nInstitute Name: \nCity: \nContact Person & Phone: \n\nPlease schedule a 15-minute live demo.`
                      )}`}
                      className="pitch-btn-pilot-top"
                      style={{ fontSize: '15px', padding: '12px 22px' }}
                    >
                      ✉️ Request Free 30-Day Batch Pilot →
                    </a>

                    <Link
                      href="/feedback"
                      className="pitch-btn-print"
                      style={{ textDecoration: 'none', fontSize: '14px', padding: '12px 18px' }}
                    >
                      📋 Submit Partner Inquiry Form
                    </Link>

                    <Link
                      href="/"
                      className="pitch-btn-print"
                      style={{ textDecoration: 'none', fontSize: '14px', padding: '12px 18px', borderColor: '#a8a096' }}
                    >
                      🌐 Explore Live Platform
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="slide-footer-strip">
              <span>🌐 Web: https://www.chapterready.in · ✉️ Partner Desk: hello@chapterready.in</span>
              <span>ChapterReady.in — Master Class 10, One Chapter at a Time.</span>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="pitch-deck-shell">
      {/* Top Floating Control Bar */}
      <header className="pitch-topbar no-print">
        <div className="pitch-brand-group">
          <Link href="/" className="pitch-brand-link">
            <span>📘 ChapterReady.in</span>
          </Link>
          <span className="pitch-brand-badge">Schools &amp; Coaching B2B Deck</span>
        </div>

        <div className="pitch-controls-center">
          <div className="pitch-mode-toggle" role="tablist" aria-label="Presentation View Mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'slide'}
              className={`pitch-mode-btn ${mode === 'slide' ? 'active' : ''}`}
              onClick={() => setMode('slide')}
            >
              🖥️ Slide Deck (16:9)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'brochure'}
              className={`pitch-mode-btn ${mode === 'brochure' ? 'active' : ''}`}
              onClick={() => setMode('brochure')}
            >
              📄 Full Brochure Scroll
            </button>
          </div>

          {mode === 'slide' && (
            <div className="pitch-nav-group">
              <button
                type="button"
                className="pitch-nav-btn"
                onClick={goPrev}
                disabled={activeSlide === 0}
                title="Previous Slide (Left Arrow)"
              >
                ← Prev
              </button>
              <span className="pitch-slide-counter">
                {String(activeSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="pitch-nav-btn"
                onClick={goNext}
                disabled={activeSlide === totalSlides - 1}
                title="Next Slide (Right Arrow)"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div className="pitch-actions-right">
          <button
            type="button"
            className="pitch-btn-print"
            onClick={handlePrint}
            title="Print or Save as Landscape PDF Brochure"
          >
            🖨️ Save PDF Brochure
          </button>
          <button
            type="button"
            className="pitch-btn-pilot-top"
            onClick={() => {
              if (mode === 'slide') {
                setActiveSlide(9);
              } else {
                document.getElementById('slide-pilot-cta')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            🚀 Start Free 30-Day Pilot
          </button>
        </div>
      </header>

      {/* Progress Track */}
      {mode === 'slide' && (
        <div className="pitch-progress-track no-print">
          <div
            className="pitch-progress-fill"
            style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
      )}

      {/* Main Slide / Brochure Viewport */}
      <main className={`pitch-deck-main ${mode === 'slide' ? 'mode-slide' : 'mode-brochure'}`}>
        {mode === 'slide' ? (
          <>
            {renderSlideContent(activeSlide)}

            {/* Quick Slide Jump Pills */}
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
          SLIDE_METAS.map((s) => renderSlideContent(s.index))
        )}
      </main>
    </div>
  );
}
