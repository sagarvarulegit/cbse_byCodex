'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import MathText from '../../components/MathText';
import TaraFireflyIcon from '../../components/TaraFireflyIcon';
import type { SeoQuestionItem } from '../../lib/seo-questions';

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
    <div className="min-h-screen bg-[#faf7ee] text-[#1e293b] pb-24">
      {/* Top Header */}
      <header className="border-b-2 border-black bg-white sticky top-0 z-30 shadow-[0_2px_0_0_#000]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-extrabold">Questions Directory</span>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/exam-papers"
              className="text-xs font-black px-3 py-1.5 border-2 border-black bg-amber-200 rounded shadow-[2px_2px_0_0_#000] hover:bg-amber-300 transition"
            >
              📄 Free 80M Board Papers
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b-3 border-black py-10 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-black bg-[#d9f99d] text-xs font-black shadow-[2px_2px_0_0_#000]">
            <TaraFireflyIcon size={18} glow />
            <span>1,669+ Verified Questions with Official Step-Marking & Socratic Hints</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            CBSE Class 10 Question Bank
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-700 font-medium">
            Browse authentic 2022–2026 Board Exam PYQs and NCERT Exemplar HOTS. Every question includes official CBSE step-marking value points, examiner deduction warnings, and instant Socratic AI hints from Tara.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search topics, formulas, or question text (e.g. 'Ohm's law', 'Quadratic', 'Light')..."
                className="w-full px-4 py-3.5 pl-11 rounded-xl border-3 border-black bg-[#faf7ee] text-sm sm:text-base font-semibold focus:outline-none focus:bg-white shadow-[4px_4px_0_0_#000] transition"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-gray-500 hover:text-black bg-gray-200 px-2 py-1 rounded"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Controls */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[3px_3px_0_0_#000] space-y-4">
          
          {/* Subject Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-500 mr-2">Subject:</span>
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
                className={`text-xs font-black px-3 py-1.5 rounded-lg border-2 border-black transition ${
                  selectedSubject === sub.value
                    ? 'bg-black text-white shadow-[2px_2px_0_0_#000]'
                    : 'bg-white text-gray-800 hover:bg-gray-100 shadow-[1px_1px_0_0_#000]'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Source & Marks Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
            {/* Source */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-gray-500 mr-1">Source:</span>
              {[
                { label: 'All Sources', value: 'all' },
                { label: 'NCERT Exemplar HOTS', value: 'ncert_exemplar' },
                { label: 'CBSE Board PYQs (2022–2026)', value: 'cbse_board_pyq' },
                { label: '🔥 Repeated Board Concepts', value: 'repeated_board_concept' },
              ].map((src) => (
                <button
                  key={src.value}
                  type="button"
                  onClick={() => handleFilterChange(setSelectedSource, src.value)}
                  className={`text-xs font-bold px-2.5 py-1 rounded border-2 border-black transition ${
                    selectedSource === src.value
                      ? 'bg-amber-300 text-black font-black'
                      : 'bg-white text-gray-700 hover:bg-slate-50'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>

            {/* Marks */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase text-gray-500 mr-1">Marks:</span>
              {['all', '1', '2', '3', '4', '5'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleFilterChange(setSelectedMarks, m)}
                  className={`text-xs font-black px-2.5 py-1 rounded border border-black transition ${
                    selectedMarks === m
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {m === 'all' ? 'All' : `${m}M`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between mt-4 px-1 text-xs font-bold text-gray-600">
          <div>
            Showing <span className="text-black font-black">{filteredQuestions.length}</span> questions
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
              className="text-xs font-black text-rose-700 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {paginatedQuestions.map((q) => (
            <Link
              key={q.slug}
              href={`/questions/${q.slug}`}
              className="group flex flex-col justify-between border-2 border-black bg-white rounded-xl p-5 shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition active:translate-x-0.5 active:translate-y-0.5"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-slate-100 text-slate-800">
                    {q.subjectTitle}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded border border-black bg-yellow-200 text-yellow-950">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                    {q.frequencyBadge && (
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-400">
                        {q.frequencyBadge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Chapter Title */}
                <div className="text-xs font-extrabold text-orange-700 truncate mb-1">
                  {q.chapterTitle}
                </div>

                {/* Title */}
                <h2 className="text-sm font-black text-gray-900 group-hover:text-blue-900 line-clamp-2 leading-snug mb-2">
                  {q.title}
                </h2>

                {/* Truncated Prompt Preview */}
                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {q.prompt}
                </p>
              </div>

              {/* Bottom Footer Info */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-gray-500">
                <span className="truncate max-w-[170px]">
                  {q.officialRef}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-800 bg-[#d9f99d] px-2 py-0.5 rounded-full border border-emerald-900/40 font-black text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                  Socratic Clue
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16 bg-white border-2 border-black rounded-xl p-8 mt-6">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-black text-gray-900 mt-2">No questions matched your search</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
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
              className="mt-4 px-4 py-2 border-2 border-black bg-amber-300 rounded-lg text-xs font-black shadow-[2px_2px_0_0_#000]"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 border-2 border-black bg-white rounded-lg text-xs font-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 shadow-[2px_2px_0_0_#000]"
            >
              ← Previous
            </button>

            <span className="px-4 py-2 text-xs font-black text-gray-800">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-2 border-2 border-black bg-white rounded-lg text-xs font-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 shadow-[2px_2px_0_0_#000]"
            >
              Next →
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
