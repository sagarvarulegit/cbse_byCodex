'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  getAllReadinessSubjects,
  getSubjectBlueprint,
  calculateSubjectReadiness,
  simulateTargetGap,
  formatWhatsAppReport,
  CONFIDENCE_WEIGHTS,
  type ChapterConfidence,
} from '../lib/board-readiness';

export type BoardReadinessPredictorProps = {
  initialSubject?: string;
  isLoggedIn?: boolean;
};

export default function BoardReadinessPredictor({
  initialSubject = 'science',
  isLoggedIn = false,
}: BoardReadinessPredictorProps) {
  const subjectList = useMemo(() => getAllReadinessSubjects(), []);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>(initialSubject);
  const [targetMarks, setTargetMarks] = useState<number>(72);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'auditor' | 'sections' | 'simulator' | 'roadmap'>('auditor');

  // Chapter states map: chapterSlug -> ChapterConfidence
  const [chapterStates, setChapterStates] = useState<Record<string, Record<string, ChapterConfidence>>>({});

  const currentBlueprint = useMemo(() => {
    return getSubjectBlueprint(selectedSubjectSlug);
  }, [selectedSubjectSlug]);

  // Current subject chapter states with sensible default (comfortable / needs_revision mix for initial discovery)
  const currentChapterStates = useMemo(() => {
    const states = chapterStates[selectedSubjectSlug];
    if (states) return states;

    // Default initialization: first 2 chapters comfortable, others needs_revision
    const defaults: Record<string, ChapterConfidence> = {};
    const chapters = currentBlueprint.units.flatMap((u) => u.chapters);
    chapters.forEach((ch, idx) => {
      if (idx === 0) defaults[ch.slug] = 'mastered';
      else if (idx === 1 || idx === 2) defaults[ch.slug] = 'comfortable';
      else if (idx < 6) defaults[ch.slug] = 'needs_revision';
      else defaults[ch.slug] = 'struggling';
    });
    return defaults;
  }, [chapterStates, selectedSubjectSlug, currentBlueprint]);

  // Diagnostic Calculation
  const diagnosticResult = useMemo(() => {
    return calculateSubjectReadiness(selectedSubjectSlug, currentChapterStates);
  }, [selectedSubjectSlug, currentChapterStates]);

  // Target Score Simulation
  const targetSimulation = useMemo(() => {
    return simulateTargetGap(selectedSubjectSlug, currentChapterStates, targetMarks);
  }, [selectedSubjectSlug, currentChapterStates, targetMarks]);

  // Update confidence for a specific chapter
  const handleConfidenceChange = (chapterSlug: string, confidence: ChapterConfidence) => {
    setChapterStates((prev) => ({
      ...prev,
      [selectedSubjectSlug]: {
        ...currentChapterStates,
        [chapterSlug]: confidence,
      },
    }));
  };

  // Batch presets
  const applyPreset = (preset: 'mastered' | 'preboard' | 'halfway' | 'reset') => {
    const chapters = currentBlueprint.units.flatMap((u) => u.chapters);
    const newStates: Record<string, ChapterConfidence> = {};

    chapters.forEach((ch, idx) => {
      if (preset === 'mastered') {
        newStates[ch.slug] = 'mastered';
      } else if (preset === 'preboard') {
        newStates[ch.slug] = idx % 3 === 0 ? 'mastered' : idx % 2 === 0 ? 'comfortable' : 'needs_revision';
      } else if (preset === 'halfway') {
        newStates[ch.slug] = idx < Math.ceil(chapters.length / 2) ? 'comfortable' : 'struggling';
      } else {
        newStates[ch.slug] = 'unstudied';
      }
    });

    setChapterStates((prev) => ({
      ...prev,
      [selectedSubjectSlug]: newStates,
    }));
  };

  // Handle WhatsApp Copy / Share
  const handleShareWhatsApp = () => {
    const reportText = formatWhatsAppReport(diagnosticResult);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopiedWhatsApp(true);
      setTimeout(() => setCopiedWhatsApp(false), 3000);
    }
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (diagnosticResult.readinessScore / 100) * circumference;

  return (
    <div className="readiness-predictor-root" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* ── HERO BANNER ────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ background: '#f97316', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🔥 AI Board Exam Diagnostic
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>CBSE 2026/27 Blueprint Grounded</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em', color: '#ffffff' }}>
              CBSE Board Score Predictor &amp; Readiness Index
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Select your subject, audit your chapter confidence in 60 seconds, and get an instant board mark prediction (out of 80), section vulnerability breakdown, and a personalized 14-day catch-up roadmap.
            </p>

            {/* Subject Selector Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {subjectList.map((s) => {
                const isSelected = s.slug === selectedSubjectSlug;
                return (
                  <button
                    key={s.slug}
                    onClick={() => setSelectedSubjectSlug(s.slug)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #f97316' : '1px solid rgba(255, 255, 255, 0.15)',
                      background: isSelected ? '#f97316' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      transition: 'all 0.15s ease-in-out',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <span>{s.icon}</span>
                    <span>{s.title}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8, background: 'rgba(0,0,0,0.2)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                      {s.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gauge & Predicted Score Widget */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ position: 'relative', width: '130px', height: '130px', marginBottom: '1rem' }}>
              <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke={diagnosticResult.performanceTier.color}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
                  {diagnosticResult.readinessScore}%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginTop: '2px' }}>
                  Readiness
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.2rem' }}>
                Predicted Board Exam Score
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                {diagnosticResult.predictedMarks} <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 600 }}>/ 80 Marks</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                Score Band: {diagnosticResult.predictedMarksMin}–{diagnosticResult.predictedMarksMax} Marks ({diagnosticResult.predictedPercentage}%)
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: diagnosticResult.performanceTier.color,
                color: '#ffffff',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 800,
                marginBottom: '1rem',
              }}
            >
              {diagnosticResult.performanceTier.badge}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
              <button
                onClick={handleShareWhatsApp}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>📲</span>
                <span>{copiedWhatsApp ? 'Copied Link!' : 'Share WhatsApp'}</span>
              </button>

              <button
                onClick={handlePrint}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.3rem',
                }}
              >
                <span>🖨️</span>
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUB-NAVIGATION TABS ────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '2rem',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveTab('auditor')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'auditor' ? '#0f172a' : 'transparent',
            color: activeTab === 'auditor' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>📋</span>
          <span>1-Minute Chapter Auditor</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'sections' ? '#0f172a' : 'transparent',
            color: activeTab === 'sections' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>📊</span>
          <span>Section A–E Projections</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'simulator' ? '#0f172a' : 'transparent',
            color: activeTab === 'simulator' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>🎯</span>
          <span>Target Score Goalpost</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            cursor: 'pointer',
            background: activeTab === 'roadmap' ? '#0f172a' : 'transparent',
            color: activeTab === 'roadmap' ? '#ffffff' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>📅</span>
          <span>14-Day Revision Blueprint</span>
        </button>
      </div>

      {/* ── TAB 1: 1-MINUTE CHAPTER AUDITOR ─────────────────────────────────── */}
      {activeTab === 'auditor' && (
        <div>
          {/* Preset Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#ffffff',
              padding: '1.2rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.5rem',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                Quick Audit Presets
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Quickly populate your preparation level or calibrate chapter by chapter below.
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                onClick={() => applyPreset('mastered')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  cursor: 'pointer',
                }}
              >
                🌟 All Mastered (95%+)
              </button>
              <button
                onClick={() => applyPreset('preboard')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  cursor: 'pointer',
                }}
              >
                📈 Pre-Boards Level (75%)
              </button>
              <button
                onClick={() => applyPreset('halfway')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#fff7ed',
                  color: '#c2410c',
                  border: '1px solid #fed7aa',
                  cursor: 'pointer',
                }}
              >
                ⚡ Half Syllabus (50%)
              </button>
              <button
                onClick={() => applyPreset('reset')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: '#f8fafc',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              >
                🔄 Reset to Zero
              </button>
            </div>
          </div>

          {/* Unit-wise Chapter List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentBlueprint.units.map((unit) => {
              const unitDiagnostic = diagnosticResult.unitBreakdowns.find((u) => u.unitId === unit.id);
              return (
                <div
                  key={unit.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Unit Header */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
                        NCERT UNIT
                      </span>
                      <h3 style={{ margin: '0.1rem 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        {unit.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', background: '#e2e8f0', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                        Official Weightage: {unit.officialMarks} Marks
                      </span>
                      {unitDiagnostic && (
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: unitDiagnostic.readinessPercent >= 80 ? '#16a34a' : unitDiagnostic.readinessPercent >= 60 ? '#f59e0b' : '#dc2626',
                          }}
                        >
                          {unitDiagnostic.readinessPercent}% Ready ({unitDiagnostic.earnedMarks}/{unit.officialMarks}M)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chapters Inside Unit */}
                  <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {unit.chapters.map((chapter) => {
                      const confidence = currentChapterStates[chapter.slug] || 'unstudied';

                      return (
                        <div
                          key={chapter.slug}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: '#fafafa',
                            border: '1px solid #f1f5f9',
                            gap: '1rem',
                          }}
                        >
                          <div style={{ flex: '1 1 300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                                {chapter.title}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '4px',
                                  background: chapter.tier === 'high' ? '#ffedd5' : '#f1f5f9',
                                  color: chapter.tier === 'high' ? '#c2410c' : '#475569',
                                }}
                              >
                                ~{chapter.weightageMarks} Marks
                              </span>
                              {chapter.hasFiveMarker && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#fee2e2', color: '#b91c1c' }}>
                                  5-Marker Anchor
                                </span>
                              )}
                              {chapter.hasCaseStudy && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px', background: '#e0e7ff', color: '#4338ca' }}>
                                  Case Study
                                </span>
                              )}
                            </div>

                            <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                              <span>Key Concepts:</span>
                              {chapter.keyConcepts.map((kc, kidx) => (
                                <span key={kidx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                  {kc}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Confidence Selector Buttons */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                            {(['mastered', 'comfortable', 'needs_revision', 'struggling', 'unstudied'] as ChapterConfidence[]).map((conf) => {
                              const isCurrent = confidence === conf;
                              const confInfo = CONFIDENCE_WEIGHTS[conf];

                              return (
                                <button
                                  key={conf}
                                  onClick={() => handleConfidenceChange(chapter.slug, conf)}
                                  style={{
                                    padding: '0.4rem 0.65rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: isCurrent ? `2px solid ${confInfo.color}` : '1px solid #cbd5e1',
                                    background: isCurrent ? confInfo.color : '#ffffff',
                                    color: isCurrent ? '#ffffff' : '#475569',
                                    transition: 'all 0.12s ease-in-out',
                                  }}
                                >
                                  <span>{confInfo.icon}</span> <span>{confInfo.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: SECTION A–E PROJECTIONS ─────────────────────────────────── */}
      {activeTab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              CBSE Section-Wise Marks Projection &amp; Risk Heatmap
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem 0' }}>
              Shows how your chapter mastery translates into mark capture across each section of the official 80-mark question paper.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {diagnosticResult.sectionProjections.map((sec) => {
                const color = sec.status === 'safe' ? '#16a34a' : sec.status === 'needs_work' ? '#f59e0b' : '#dc2626';

                return (
                  <div
                    key={sec.section}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                          {sec.title}
                        </span>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                          (Max: {sec.maxMarks} Marks)
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                          {sec.predictedMarks} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ {sec.maxMarks}</span>
                        </span>
                        <span
                          style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: sec.status === 'safe' ? '#dcfce7' : sec.status === 'needs_work' ? '#fef3c7' : '#fee2e2',
                            color,
                          }}
                        >
                          {sec.status === 'safe' ? '✅ High Precision' : sec.status === 'needs_work' ? '⚠️ Moderate Risk' : '🚨 High Leakage'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                      <div
                        style={{
                          width: `${sec.percentage}%`,
                          height: '100%',
                          background: color,
                          borderRadius: '999px',
                          transition: 'width 0.4s ease-in-out',
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span>{sec.riskNote}</span>
                      <span style={{ fontWeight: 700 }}>{sec.percentage}% Mark Capture</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: TARGET SCORE GOALPOST SIMULATOR ───────────────────────────── */}
      {activeTab === 'simulator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              Target Marks &amp; Score Gap Simulator
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.75rem 0' }}>
              Drag the slider to your desired board exam score. The AI diagnostic calculates the exact chapters and concepts you must upgrade to hit that score with minimum effort.
            </p>

            {/* Target Slider */}
            <div
              style={{
                background: '#f8fafc',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>
                  Target Board Exam Mark:
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f97316' }}>
                  {targetMarks} / 80 Marks <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>({Math.round((targetMarks / 80) * 100)}%)</span>
                </span>
              </div>

              <input
                type="range"
                min="40"
                max="80"
                step="1"
                value={targetMarks}
                onChange={(e) => setTargetMarks(Number(e.target.value))}
                style={{ width: '100%', height: '8px', accentColor: '#f97316', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                <span>Passing Orbit (40M / 50%)</span>
                <span>First Class (60M / 75%)</span>
                <span>Distinction (70M / 87%)</span>
                <span>Centum Target (80M / 100%)</span>
              </div>
            </div>

            {/* Gap Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Current Prediction</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8' }}>{diagnosticResult.predictedMarks} / 80</div>
              </div>

              <div style={{ background: targetSimulation.marksGap > 0 ? '#fff7ed' : '#f0fdf4', padding: '1rem', borderRadius: '10px', border: targetSimulation.marksGap > 0 ? '1px solid #fed7aa' : '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: targetSimulation.marksGap > 0 ? '#c2410c' : '#16a34a', textTransform: 'uppercase' }}>
                  {targetSimulation.marksGap > 0 ? 'Marks to Gain' : 'Target Achieved!'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: targetSimulation.marksGap > 0 ? '#ea580c' : '#16a34a' }}>
                  {targetSimulation.marksGap > 0 ? `+${targetSimulation.marksGap} Marks` : '🎯 On Track'}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Recommended Study Pacing</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{targetSimulation.requiredDailyStudyHours} hrs / day</div>
              </div>
            </div>

            {/* Recommendations List */}
            {targetSimulation.upgradesNeeded.length > 0 ? (
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
                  Fastest High-ROI Chapter Upgrades to Reach {targetMarks} Marks
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {targetSimulation.upgradesNeeded.map((up, uidx) => (
                    <div
                      key={uidx}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: '#f8fafc',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                          {uidx + 1}. {up.chapterTitle}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {up.actionTip}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                          +{up.marksGain} Marks
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {up.effortLevel} Effort
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
                🎉 Your current preparation already meets or exceeds your {targetMarks}/80 goal! Keep revising to prevent forgetting.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: 14-DAY PERSONALIZED REVISION BLUEPRINT ─────────────────────── */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#0f172a' }}>
                  Personalized 14-Day Board Revision Blueprint
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
                  Algorithmically tailored to eliminate your highest-mark vulnerabilities first, followed by 5-mark long answers, formulas, and full mock simulations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                  Est. Daily Time: 45–60 Mins
                </span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '6px' }}>
                  Total Gain: +12–18 Marks
                </span>
              </div>
            </div>

            {/* Daily Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {diagnosticResult.roadmap14Day.map((task) => {
                const phaseColor =
                  task.phase === 'High-Yield Anchors'
                    ? '#c2410c'
                    : task.phase === 'Section D & Case Studies'
                    ? '#1d4ed8'
                    : task.phase === 'Formula & Weak Spot Polish'
                    ? '#0b7a48'
                    : '#7c3aed';

                return (
                  <div
                    key={task.day}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      alignItems: 'center',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1.2rem',
                      border: '1px solid #e2e8f0',
                      gap: '1rem',
                    }}
                  >
                    {/* Day Pill */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Day</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{task.day}</div>
                    </div>

                    {/* Content */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: phaseColor, background: 'rgba(0,0,0,0.04)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          {task.phase}
                        </span>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                          {task.chapterTitle}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.3rem' }}>
                        {task.focusTopics.map((topic, tidx) => (
                          <span key={tidx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                            • {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Link & Mark Gain */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a' }}>
                        +{task.potentialMarksGain} Marks Potential
                      </div>
                      <Link
                        href={task.actionHref}
                        style={{
                          padding: '0.45rem 0.85rem',
                          background: '#0f172a',
                          color: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span>🚀</span>
                        <span>{task.actionLabel}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HIGH YIELD WEAK SPOTS SUMMARY (ALWAYS VISIBLE) ────────────────────── */}
      <section
        style={{
          marginTop: '2rem',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0' }}>
          ⚡ Top Priority Action Items for {currentBlueprint.title}
        </h3>

        {diagnosticResult.topWeakSpots.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {diagnosticResult.topWeakSpots.slice(0, 3).map((spot, sidx) => (
              <div
                key={sidx}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#991b1b', fontSize: '0.95rem' }}>
                      {spot.chapterTitle}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      -{spot.marksDeficit}M Deficit
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#7f1d1d', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                    {spot.priorityReason}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#450a0a', background: 'rgba(255,255,255,0.6)', padding: '0.4rem 0.6rem', borderRadius: '6px', marginBottom: '1rem' }}>
                    💡 <strong>Quick Fix:</strong> {spot.quickFixTip}
                  </div>
                </div>

                <Link
                  href={spot.toolHref}
                  style={{
                    padding: '0.5rem',
                    background: '#dc2626',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  {spot.toolLabel} →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', color: '#16a34a', fontWeight: 700 }}>
            🌟 Excellent! No severe weak spots detected. Maintain retention with regular quizzes and mock papers.
          </div>
        )}
      </section>

    </div>
  );
}
