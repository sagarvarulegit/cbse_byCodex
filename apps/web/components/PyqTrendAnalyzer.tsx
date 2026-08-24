'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  PYQ_TRENDS_DATA,
  getAllSubjectOptions,
  type ChapterTrendData,
  type RepeatedConcept,
} from '../lib/pyq-trends';

export type PyqTrendAnalyzerProps = {
  initialSubject?: string;
  isLoggedIn?: boolean;
};

type ViewFilter = 'all' | 'repeated' | 'weightage' | '5markers' | 'casestudy';

export default function PyqTrendAnalyzer({
  initialSubject = 'science',
  isLoggedIn = false,
}: PyqTrendAnalyzerProps) {
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>(initialSubject);
  const [activeFilter, setActiveFilter] = useState<ViewFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterForModal, setSelectedChapterForModal] = useState<ChapterTrendData | null>(null);

  const subjectOptions = getAllSubjectOptions();
  const currentSubject = useMemo(() => {
    return PYQ_TRENDS_DATA[selectedSubjectSlug] || PYQ_TRENDS_DATA['science'];
  }, [selectedSubjectSlug]);

  const filteredChapters = useMemo(() => {
    return currentSubject.chapters.filter((ch) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.mostRepeatedTopics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === '5markers') {
        return ch.distribution.la_5m > 0;
      }
      if (activeFilter === 'casestudy') {
        return ch.distribution.case_study_4m > 0;
      }
      return true;
    });
  }, [currentSubject, activeFilter, searchQuery]);

  const filteredRepeatedConcepts = useMemo(() => {
    return currentSubject.repeatedConcepts.filter((rc) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        rc.conceptTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rc.chapterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rc.questionPromptSample.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === '5markers') {
        return rc.questionType.includes('5-Mark') || rc.typicalMarks >= 5;
      }
      if (activeFilter === 'casestudy') {
        return rc.questionType.includes('Case Study') || rc.typicalMarks === 4;
      }
      return true;
    });
  }, [currentSubject, activeFilter, searchQuery]);

  return (
    <div className="pyq-analyzer-root" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ background: '#f3883b', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            5-Year Historical Intelligence (2022–2026)
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>CBSE Class 10 Board Analytics</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em', color: '#fff' }}>
          CBSE Board PYQ Trend &amp; Weightage Analyzer
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
          Discover the exact chapter weightages, recurring 5-mark long answer patterns, and mandatory NCERT concepts extracted directly from 5 years of verified CBSE Board Exam question papers and marking schemes.
        </p>

        {/* Quick Subject Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1.75rem' }}>
          {subjectOptions.map((subj) => {
            const isSelected = subj.slug === selectedSubjectSlug;
            return (
              <button
                key={subj.slug}
                onClick={() => {
                  setSelectedSubjectSlug(subj.slug);
                  setActiveFilter('all');
                }}
                style={{
                  padding: '0.65rem 1.2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #f3883b' : '1px solid rgba(255, 255, 255, 0.2)',
                  background: isSelected ? '#f3883b' : 'rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : '#e2e8f0',
                  transition: 'all 0.15s ease-in-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{subj.title}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, background: 'rgba(0,0,0,0.2)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Code {subj.code}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subject Summary Snapshot Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total Paper Weightage</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{currentSubject.totalMarks} Marks</div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>3 Hours (80 Marks Theory)</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Total NCERT Chapters</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{currentSubject.totalChapters} Chapters</div>
          <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '0.25rem', fontWeight: 600 }}>100% NCERT Reprint 2026 Scope</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>High Yield Benchmark</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c2410c', marginTop: '0.25rem' }}>{currentSubject.highYieldThreshold}</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>Carries 40%+ of paper marks</div>
        </div>
      </div>

      {/* Strategic Trend Insights */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💡</span> Key Board Exam Intelligence for {currentSubject.title}
        </h3>
        <p style={{ fontStyle: 'italic', color: '#78350f', fontSize: '0.95rem', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
          &ldquo;{currentSubject.summaryQuote}&rdquo;
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {currentSubject.trendInsights.map((insight, idx) => (
            <div key={idx} style={{ background: '#ffffff', border: '1px solid #fef3c7', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{insight.title}</strong>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#fef3c7', color: '#b45309', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {insight.tag}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Filter Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveFilter('all')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: activeFilter === 'all' ? '1px solid #0f172a' : '1px solid #cbd5e1',
              background: activeFilter === 'all' ? '#0f172a' : '#fff',
              color: activeFilter === 'all' ? '#fff' : '#334155',
            }}
          >
            📋 All Chapters ({currentSubject.chapters.length})
          </button>
          <button
            onClick={() => setActiveFilter('repeated')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: activeFilter === 'repeated' ? '1px solid #ea580c' : '1px solid #cbd5e1',
              background: activeFilter === 'repeated' ? '#ea580c' : '#fff',
              color: activeFilter === 'repeated' ? '#fff' : '#334155',
            }}
          >
            🔥 Top Repeated Questions ({currentSubject.repeatedConcepts.length})
          </button>
          <button
            onClick={() => setActiveFilter('5markers')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: activeFilter === '5markers' ? '1px solid #7c3aed' : '1px solid #cbd5e1',
              background: activeFilter === '5markers' ? '#7c3aed' : '#fff',
              color: activeFilter === '5markers' ? '#fff' : '#334155',
            }}
          >
            🎯 5-Mark Long Answers Focus
          </button>
          <button
            onClick={() => setActiveFilter('casestudy')}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              border: activeFilter === 'casestudy' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              background: activeFilter === 'casestudy' ? '#0284c7' : '#fff',
              color: activeFilter === 'casestudy' ? '#fff' : '#334155',
            }}
          >
            📖 Section E Case Studies
          </button>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search chapter, topic, or concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 1rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Top Repeated Concepts View */}
      {activeFilter === 'repeated' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          <div style={{ padding: '0.5rem 0', color: '#475569', fontSize: '0.95rem' }}>
            Showing <strong>{filteredRepeatedConcepts.length}</strong> top recurring questions verified across official 2022–2026 CBSE sets:
          </div>
          {filteredRepeatedConcepts.map((concept) => (
            <div
              key={concept.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{concept.chapterTitle}</span>
                  <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {concept.conceptTitle}
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                    {concept.frequencyBadge}
                  </span>
                  <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                    {concept.questionType} ({concept.typicalMarks} Marks)
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', borderLeft: '4px solid #f3883b', padding: '0.9rem 1rem', borderRadius: '4px', fontSize: '0.9rem', color: '#1e293b' }}>
                <strong>Typical Board Prompt:</strong>
                <p style={{ margin: '0.4rem 0 0 0', lineHeight: 1.5, color: '#334155' }}>
                  &ldquo;{concept.questionPromptSample}&rdquo;
                </p>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                <strong style={{ color: '#0f172a' }}>CBSE Step-Marking Expectation: </strong>
                {concept.examinerExpectation}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  <strong>Verified In Sets:</strong> {concept.boardSets.join(', ')} ({concept.frequentYears.join(', ')})
                </div>
                <Link
                  href={`/chapters/${concept.chapterSlug}/notes`}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#c2410c',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>Practice Chapter PYQ Drill</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Chapter-Wise Breakdown Matrix */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          {filteredChapters.map((ch) => {
            const isHighYield = ch.yieldTier === 'high';
            const isMedium = ch.yieldTier === 'medium';
            const badgeBg = isHighYield ? '#fef2f2' : isMedium ? '#fefce8' : '#f0fdf4';
            const badgeColor = isHighYield ? '#dc2626' : isMedium ? '#ca8a04' : '#16a34a';
            const badgeBorder = isHighYield ? '#fecaca' : isMedium ? '#fef08a' : '#bbf7d0';

            return (
              <div
                key={ch.id}
                style={{
                  background: '#ffffff',
                  border: isHighYield ? '1px solid #fed7aa' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: isHighYield ? '0 4px 10px rgba(243, 136, 59, 0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {ch.unitTitle}
                    </span>
                    <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {ch.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {isHighYield ? '🔥 High Yield' : isMedium ? '⚡ Medium Yield' : '🌱 Foundational'}
                    </span>
                    <span
                      style={{
                        background: '#0f172a',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '8px',
                      }}
                    >
                      {ch.officialMarksMin}–{ch.officialMarksMax} Marks (Avg {ch.historicalAvgMarks})
                    </span>
                  </div>
                </div>

                {/* Mark Distribution Breakdown Bar */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Question Format Allocation:</span>
                    <span>5-Year Board Sets Verified</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {ch.distribution.la_5m > 0 && (
                      <span style={{ background: '#ede9fe', color: '#6d28d9', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        🎯 Section D (5-Mark LA): {ch.distribution.la_5m} Qs
                      </span>
                    )}
                    {ch.distribution.case_study_4m > 0 && (
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        📖 Section E (4-Mark Case Study): {ch.distribution.case_study_4m} Qs
                      </span>
                    )}
                    {ch.distribution.sa_3m > 0 && (
                      <span style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        ✍️ Section C (3-Mark SA): {ch.distribution.sa_3m} Qs
                      </span>
                    )}
                    {ch.distribution.vsa_2m > 0 && (
                      <span style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        📝 Section B (2-Mark VSA): {ch.distribution.vsa_2m} Qs
                      </span>
                    )}
                    {ch.distribution.mcq > 0 && (
                      <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        🔘 Section A (1-Mark MCQ): {ch.distribution.mcq} Qs
                      </span>
                    )}
                    {ch.distribution.map_skill_5m && ch.distribution.map_skill_5m > 0 ? (
                      <span style={{ background: '#fdf4ff', color: '#a21caf', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        🗺️ Section F (Map Skill): {ch.distribution.map_skill_5m} Marks
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Most Repeated Topics Bullets */}
                <div style={{ background: '#f8fafc', padding: '0.9rem 1.1rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                    Top Repeated Concepts in Board Exams:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                    {ch.mostRepeatedTopics.map((topic, tidx) => (
                      <li key={tidx}>{topic}</li>
                    ))}
                  </ul>
                </div>

                {/* Board Tip & Quick Action CTA */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '0.85rem', color: '#b45309', maxWidth: '650px', lineHeight: 1.4 }}>
                    <strong>Examiner Tip:</strong> {ch.boardExamFocusTip}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/chapters/${ch.slug}/notes`}
                      style={{
                        background: '#f3883b',
                        color: '#ffffff',
                        padding: '0.45rem 0.9rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Practice PYQ Drill →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Conversion Banner */}
      <div
        style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#9a3412', margin: '0 0 0.5rem 0' }}>
          Test Yourself with Full 80-Mark Official Board Mock Papers
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#7c2d12', maxWidth: '700px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
          Practice under authentic 3-hour exam conditions with instant CBSE Step-Marking Rubrics, partial scoring, and AI written answer evaluation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            href="/exam-papers"
            style={{
              background: '#ea580c',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}
          >
            🚀 Try Paper 1 Free (All 7 Subjects)
          </Link>
          <Link
            href="/formula-cheatsheets"
            style={{
              background: '#ffffff',
              color: '#9a3412',
              border: '1px solid #fdba74',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            ⚡ View 27-Chapter Formula Cheatsheets
          </Link>
        </div>
      </div>
    </div>
  );
}
