'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import TaraFireflyIcon from '../../components/TaraFireflyIcon';
import type { SeoQuestionItem } from '../../lib/seo-questions';
import './questions.css';

interface Props {
  initialQuestions: SeoQuestionItem[];
}

const ITEMS_PER_PAGE = 24;

export default function QuestionsHubClient({ initialQuestions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedMarks, setSelectedMarks] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return initialQuestions.filter((q) => {
      // Subject filter
      if (selectedSubject !== 'all' && q.subjectSlug !== selectedSubject) {
        return false;
      }

      // Source filter
      if (selectedSource !== 'all' && q.sourceType !== selectedSource) {
        return false;
      }

      // Marks filter
      if (selectedMarks !== 'all' && q.marks.toString() !== selectedMarks) {
        return false;
      }

      // Search query
      if (query) {
        const titleMatch = q.title.toLowerCase().includes(query);
        const promptMatch = q.prompt.toLowerCase().includes(query);
        const chapterMatch = q.chapterTitle.toLowerCase().includes(query);
        const refMatch = q.officialRef.toLowerCase().includes(query);
        if (!titleMatch && !promptMatch && !chapterMatch && !refMatch) {
          return false;
        }
      }

      return true;
    });
  }, [initialQuestions, searchQuery, selectedSubject, selectedSource, selectedMarks]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedQuestions = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredQuestions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredQuestions, safePage]);

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setCurrentPage(1);
  };

  return (
    <div className="qd-root">
      {/* Top Header */}
      <header className="qd-topbar">
        <div className="qd-topbar-inner">
          <nav className="qd-breadcrumb" aria-label="Directory breadcrumbs">
            <Link href="/">Home</Link>
            <span className="qd-breadcrumb-sep">/</span>
            <span className="qd-breadcrumb-current">Questions Directory</span>
          </nav>
          <div className="qd-topbar-actions">
            <Link
              href="/exam-papers"
              className="qd-btn-neutral"
              style={{ background: '#fef08a' }}
            >
              📄 Free 80M Board Papers
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="qd-hub-hero">
        <div className="qd-hub-inner">
          <div className="qd-badge qd-badge-freq" style={{ display: 'inline-flex', marginBottom: '0.75rem' }}>
            <TaraFireflyIcon size={16} glow />
            <span>1,667+ Verified Questions · Official Step-Marking &amp; Socratic Hints</span>
          </div>

          <h1 className="qd-hub-h1">
            CBSE Class 10 Question Bank
          </h1>
          <p style={{ margin: '0 auto', maxWidth: '650px', fontSize: '0.95rem', color: 'var(--qd-text-sub)' }}>
            Browse authentic 2022–2026 Board Exam PYQs and NCERT Exemplar HOTS. Every question includes official CBSE step-marking value points, examiner deduction warnings, and instant Socratic AI hints from Tara.
          </p>

          {/* Search Box */}
          <div className="qd-search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search topics, formulas, or question text (e.g. 'calcium oxide', 'Ohm', 'Lens')..."
              className="qd-search-input"
            />
            <span className="qd-search-icon">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter Controls & Cards */}
      <main className="qd-container">
        <div className="qd-filters-card">
          
          {/* Subject Filter */}
          <div className="qd-filter-group">
            <span className="qd-filter-label">Subject:</span>
            {[
              { label: 'All Subjects', value: 'all' },
              { label: 'Science', value: 'science' },
              { label: 'Mathematics', value: 'mathematics-standard' },
              { label: 'Social Science', value: 'social-science' },
              { label: 'English', value: 'english-language-and-literature' },
            ].map((sub) => (
              <button
                key={sub.value}
                type="button"
                onClick={() => handleFilterChange(setSelectedSubject, sub.value)}
                className={`qd-filter-btn ${selectedSubject === sub.value ? 'active' : ''}`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Source & Marks Filter Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--qd-border)' }}>
            {/* Source */}
            <div className="qd-filter-group" style={{ margin: 0 }}>
              <span className="qd-filter-label">Source:</span>
              {[
                { label: 'All Sources', value: 'all' },
                { label: 'NCERT Exemplar HOTS', value: 'ncert_exemplar' },
                { label: 'CBSE Board PYQs (2022–2026)', value: 'cbse_board_pyq' },
                { label: '🔥 Repeated Concepts', value: 'repeated_board_concept' },
              ].map((src) => (
                <button
                  key={src.value}
                  type="button"
                  onClick={() => handleFilterChange(setSelectedSource, src.value)}
                  className={`qd-filter-btn ${selectedSource === src.value ? 'active' : ''}`}
                >
                  {src.label}
                </button>
              ))}
            </div>

            {/* Marks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="qd-filter-label" style={{ margin: 0 }}>Marks:</span>
              {['all', '1', '2', '3', '4', '5'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleFilterChange(setSelectedMarks, m)}
                  className={`qd-filter-btn ${selectedMarks === m ? 'active' : ''}`}
                  style={{ padding: '0.25rem 0.55rem' }}
                >
                  {m === 'all' ? 'All' : `${m}M`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--qd-text-sub)' }}>
          <div>
            Showing <strong style={{ color: 'var(--qd-text-main)' }}>{filteredQuestions.length}</strong> questions
            {filteredQuestions.length > 0 && ` (Page ${safePage} of ${totalPages})`}
          </div>
          {(selectedSubject !== 'all' || selectedSource !== 'all' || selectedMarks !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('all');
                setSelectedSource('all');
                setSelectedMarks('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={{ background: 'none', border: 'none', color: '#b91c1c', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Questions Grid */}
        <div className="qd-cards-grid">
          {paginatedQuestions.map((q) => (
            <Link
              key={q.slug}
              href={`/questions/${q.slug}`}
              className="qd-hub-card"
            >
              <div>
                {/* Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="qd-badge qd-badge-subject" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                    {q.subjectTitle}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span className="qd-badge qd-badge-marks" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                      {q.marks}M
                    </span>
                    {q.frequencyBadge && (
                      <span className="qd-badge qd-badge-freq" style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem' }}>
                        {q.frequencyBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chapter Title */}
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--qd-orange)', marginBottom: '0.2rem' }}>
                  {q.chapterTitle}
                </div>

                {/* Title */}
                <h2 className="qd-hub-card-title">
                  {q.title}
                </h2>

                {/* Truncated Prompt Preview */}
                <p className="qd-hub-card-prompt">
                  {q.prompt}
                </p>
              </div>

              {/* Bottom Footer Info */}
              <div className="qd-hub-card-footer">
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>
                  {q.officialRef}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: 'var(--qd-lime)', color: 'var(--qd-lime-dark)', padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 800 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }}></span>
                  Socratic Clue
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', border: '2px solid var(--qd-border-dark)', borderRadius: '14px', marginTop: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🔍</span>
            <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.2rem', fontWeight: 900 }}>No questions matched your search</h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.88rem', color: '#64748b' }}>
              Try adjusting your search terms or clearing the subject/source filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubject('all');
                setSelectedSource('all');
                setSelectedMarks('all');
                setSearchQuery('');
              }}
              className="qd-btn-neutral"
              style={{ background: '#fef08a' }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="qd-btn-neutral"
              style={{ opacity: safePage === 1 ? 0.4 : 1, cursor: safePage === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous
            </button>

            <span style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 800 }}>
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="qd-btn-neutral"
              style={{ opacity: safePage === totalPages ? 0.4 : 1, cursor: safePage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next →
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
