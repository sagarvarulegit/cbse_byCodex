'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export type ToolCategory = 'all' | 'analytics' | 'revision' | 'visual' | 'games' | 'tests';

export interface StudyToolItem {
  id: string;
  category: 'analytics' | 'revision' | 'visual' | 'games' | 'tests';
  title: string;
  badge: string;
  badgeColor?: string;
  icon: string;
  shortDesc: string;
  highlights: string[];
  ctaLabel: string;
  ctaHref: string;
  isPopular?: boolean;
  isFree?: boolean;
}

export const STUDY_TOOLS: StudyToolItem[] = [
  {
    id: 'tool-pyq-trends',
    category: 'analytics',
    title: 'Board PYQ Trend & Weightage Analyzer',
    badge: '🔥 5-Year Intelligence',
    badgeColor: '#c2410c',
    icon: '📊',
    shortDesc: 'Interactive 5-year historical question frequencies, chapter weightage heatmaps, 5-mark recurring questions, and CBSE step-marking patterns.',
    highlights: [
      'Science, Maths, SST & English 5-year trend data (2022–2026)',
      'Identifies guaranteed 5-mark long answers & case studies',
      'Verified CBSE board set citations and marking criteria',
      '100% Free & instant deterministic analytics',
    ],
    ctaLabel: 'Launch PYQ Analyzer',
    ctaHref: '/pyq-trends',
    isPopular: true,
    isFree: true,
  },
  {
    id: 'tool-formula-cheatsheets',
    category: 'revision',
    title: '27-Chapter Formula & Reaction Cheatsheets',
    badge: '⚡ Ultra-Dense Revision',
    badgeColor: '#0284c7',
    icon: '⚡',
    shortDesc: '1-page high-density printable summary sheets per chapter for Class 10 Maths & Science + 3D active-recall interactive flashcards.',
    highlights: [
      'All 14 Maths chapters: every theorem, formula & relation',
      'All 13 Science chapters: all reactions, valencies & constants',
      'Active-recall 3D digital flip cards with audio cues',
      'Printable pocket battlecards for last-minute exam prep',
    ],
    ctaLabel: 'Open Formula Cheatsheets',
    ctaHref: '/formula-cheatsheets',
    isPopular: true,
  },
  {
    id: 'tool-virtual-labs',
    category: 'visual',
    title: 'NCERT Virtual Labs & Diagram Mastery',
    badge: '🔬 Visual Learning',
    badgeColor: '#0b7a48',
    icon: '🧪',
    shortDesc: 'Explore redrawn NCERT experiments, apparatus setups, observations, and interactive diagram hotspot drills for all 13 Science chapters.',
    highlights: [
      'All 13 Science chapter experimental setups & reactions',
      'Interactive diagram hotspot tests (Ray diagrams, Organs, Circuits)',
      'Tested chemical equations, observations & colour changes',
      'Guaranteed 15-20 marks visual preparation for board exams',
    ],
    ctaLabel: 'Explore Virtual Labs',
    ctaHref: '/activities-and-diagrams',
    isPopular: true,
  },
  {
    id: 'tool-arcade',
    category: 'games',
    title: 'Fun & Games Arcade (Formula Rush)',
    badge: '🎮 Active Recall',
    badgeColor: '#7c3aed',
    icon: '🎮',
    shortDesc: '3-minute gamified active recall power breaks directly aligned with Class 10 NCERT textbooks to beat study fatigue.',
    highlights: [
      'Formula Rush: 60s Blitz with combo streak multipliers',
      '3-Lives Sudden Death survival mode for precision',
      'Web Audio synthesized lag-free sound effects',
      'Comprehensive post-game mistake review and explanations',
    ],
    ctaLabel: 'Play Formula Rush',
    ctaHref: '/games',
    isFree: true,
  },
  {
    id: 'tool-mock-papers',
    category: 'tests',
    title: '80-Mark Board Exam Mock Simulator',
    badge: '📝 Full Board Exams',
    badgeColor: '#ea580c',
    icon: '📄',
    shortDesc: 'Practice authentic 3-hour, 80-mark full-length CBSE board mock papers with official section layouts, timers, and step-marking rubrics.',
    highlights: [
      'All 7 subjects: Maths Standard, Basic, Science, SST, English, Hindi A/B',
      'Paper 1 in every subject series is 100% Free Forever',
      'Exact CBSE step-wise half-mark allocation breakdowns',
      'Online CBT timer mode and printable PDF versions with answer keys',
    ],
    ctaLabel: 'Start Mock Exam',
    ctaHref: '/exam-papers',
    isPopular: true,
  },
  {
    id: 'tool-quizzes',
    category: 'tests',
    title: 'All-Chapter CBSE Diagnostic Quizzes',
    badge: '🎯 Mastery Quizzes',
    badgeColor: '#0f766e',
    icon: '🎯',
    shortDesc: 'Chapter-wise diagnostic quizzes across all 48 Class 10 NCERT chapters with automatic mistake detection and spaced revision ladders.',
    highlights: [
      'Chapter-wise quizzes mapped to numbered textbook sections',
      'Instant question-level explanations with NCERT references',
      'Integrates directly into your personal "My Mistakes" recovery vault',
      'Earn personal badges and track your D0/D3/D7 recall retention',
    ],
    ctaLabel: 'Browse All Quizzes',
    ctaHref: '/quizzes',
    isFree: true,
  },
];

export default function ToolsHubClient() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = useMemo(() => {
    return STUDY_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.highlights.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="tools-hub-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '1rem 0 4rem 0' }}>
      
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
            🛠️ STUDY ACCELERATORS
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>CBSE Class 10 Learning Suite</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.75rem 0', letterSpacing: '-0.02em', color: '#fff' }}>
          Study &amp; Revision Tools Hub
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
          Everything you need to accelerate Class 10 board preparation: 5-year PYQ trend analytics, high-density formula sheets, virtual science lab diagrams, active recall arcade games, and 80-mark CBT simulators.
        </p>

        {/* Quick Search inside Hero */}
        <div style={{ marginTop: '1.5rem', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search study tools, formulas, PYQs, experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1.2rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {[
          { id: 'all', label: '🌟 All Tools' },
          { id: 'analytics', label: '📊 PYQ Trends & Analytics' },
          { id: 'revision', label: '⚡ Formula Cheatsheets' },
          { id: 'visual', label: '🔬 Virtual Labs & Diagrams' },
          { id: 'games', label: '🎮 Arcade & Power Breaks' },
          { id: 'tests', label: '📝 Mock Papers & Quizzes' },
        ].map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ToolCategory)}
              style={{
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                background: isSelected ? '#0f172a' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#fff7ed',
                    border: '1px solid #fed7aa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {tool.icon}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  {tool.isFree && (
                    <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                      100% Free
                    </span>
                  )}
                  <span
                    style={{
                      background: '#f8fafc',
                      color: tool.badgeColor || '#475569',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                    }}
                  >
                    {tool.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.3 }}>
                {tool.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
                {tool.shortDesc}
              </p>

              {/* Highlights Checklist */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                  Key Capabilities:
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                  {tool.highlights.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '0.25rem' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div>
              <Link
                href={tool.ctaHref}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  background: '#f3883b',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(243, 136, 59, 0.25)',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>{tool.ctaLabel}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Store Callout Banner */}
      <div
        style={{
          marginTop: '3.5rem',
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1px solid #fed7aa',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🛍️ CHAPTERREADY STORE
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9a3412', margin: '0.3rem 0 0.4rem 0' }}>
            Looking for Complete Revision Packs &amp; Mock Passes?
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#7c2d12', margin: 0, lineHeight: 1.5 }}>
            Unlock all 20 board mock papers, the full 27-chapter formula pack, and the NCERT science experiment vault. All priced under ₹200 INR.
          </p>
        </div>
        <div>
          <Link
            href="/store"
            style={{
              background: '#ea580c',
              color: '#ffffff',
              padding: '0.85rem 1.6rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)',
            }}
          >
            Visit Store →
          </Link>
        </div>
      </div>
    </div>
  );
}
