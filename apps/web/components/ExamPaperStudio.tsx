'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import {
  generateExamPaper,
  listExamPapers,
  type ExamPaper,
  type ExamPaperSummary,
} from '../lib/exam-papers';
import ExamPaperViewer from './ExamPaperViewer';

export type SubjectOption = {
  slug: string;
  code: string;
  title: string;
  badge: string;
  questionCount: number;
  totalMarks: number;
  durationMinutes: number;
  readingMinutes: number;
  description: string;
};

const AVAILABLE_SUBJECTS: SubjectOption[] = [
  {
    slug: 'mathematics-standard',
    code: '041',
    title: 'Mathematics Standard',
    badge: 'Maths 041',
    questionCount: 38,
    totalMarks: 80,
    durationMinutes: 180,
    readingMinutes: 15,
    description: '38 questions · 80 marks · 3 hours · Sections A–E (20 MCQs, 5 VSA, 6 SA, 4 LA, 3 Case Studies)',
  },
  {
    slug: 'science',
    code: '086',
    title: 'Science',
    badge: 'Science 086',
    questionCount: 39,
    totalMarks: 80,
    durationMinutes: 180,
    readingMinutes: 15,
    description: '39 questions · 80 marks · 3 hours · Sections A–E (20 MCQs, 6 VSA, 7 SA, 3 LA, 3 Case Studies)',
  },
  {
    slug: 'social-science',
    code: '087',
    title: 'Social Science',
    badge: 'Social Science 087',
    questionCount: 37,
    totalMarks: 80,
    durationMinutes: 180,
    readingMinutes: 15,
    description: '37 questions · 80 marks · 3 hours · Sections A–F (20 MCQs, 4 VSA, 5 SA, 4 LA, 3 Case Studies, 1 Map Skill)',
  },
  {
    slug: 'english-language-and-literature',
    code: '184',
    title: 'English Language & Literature',
    badge: 'English 184',
    questionCount: 34,
    totalMarks: 80,
    durationMinutes: 180,
    readingMinutes: 15,
    description: '34 questions · 80 marks · 3 hours · Sections A–E (Reading, Writing, Grammar, Literature)',
  },
];

export default function ExamPaperStudio({
  token,
  initialSubject = 'mathematics-standard',
}: {
  token: string | null;
  initialSubject?: string;
}) {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [recent, setRecent] = useState<ExamPaperSummary[]>([]);
  const [seedInput, setSeedInput] = useState('');
  const [verifyPaper, setVerifyPaper] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const activeSubject =
    AVAILABLE_SUBJECTS.find((s) => s.slug === selectedSubject) ?? AVAILABLE_SUBJECTS[0];

  const refreshRecent = useCallback(async () => {
    const data = await listExamPapers(token);
    if (data) {
      setRecent(data.papers.slice(0, 10));
    }
  }, [token]);

  useEffect(() => {
    void refreshRecent();
  }, [refreshRecent]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setNote(null);
    const parsedSeed = seedInput.trim() ? Number(seedInput.trim()) : undefined;
    if (seedInput.trim() && (!Number.isInteger(parsedSeed) || Number(parsedSeed) <= 0)) {
      setError('Seed must be a positive whole number.');
      setGenerating(false);
      return;
    }
    const data = await generateExamPaper(token, selectedSubject, parsedSeed, verifyPaper);
    if (!data?.paper) {
      setError(
        'Unable to generate a paper. Make sure the question bank is seeded and the API is running.',
      );
      setGenerating(false);
      return;
    }
    setPaper(data.paper);
    setNote(data.verificationNote ?? null);
    setGenerating(false);
    await refreshRecent();
  };

  return (
    <div>
      <div className="exam-paper-studio">
        <h2>Generate a CBSE-format sample test paper</h2>
        <p className="subtext compact">
          Papers are assembled deterministically from the verified question bank following
          official CBSE syllabus weightage and question-paper layout.
        </p>

        {/* Subject Selector Tabs */}
        <div className="exam-subject-tabs" role="tablist" aria-label="Select Subject">
          {AVAILABLE_SUBJECTS.map((subject) => {
            const isSelected = subject.slug === selectedSubject;
            return (
              <button
                key={subject.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`exam-subject-tab ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSubject(subject.slug);
                  setError(null);
                  setNote(null);
                }}
              >
                <span className="exam-subject-badge">{subject.badge}</span>
                <span className="exam-subject-name">{subject.title}</span>
              </button>
            );
          })}
        </div>

        <p className="exam-subject-info">
          <strong>{activeSubject.title} ({activeSubject.code}):</strong> {activeSubject.description}
        </p>

        <div className="exam-studio-controls">
          <label>
            Seed (optional — same seed = same paper)
            <input
              type="text"
              inputMode="numeric"
              value={seedInput}
              onChange={(event) => setSeedInput(event.target.value)}
              placeholder="e.g. 12345"
            />
            <span className="exam-studio-help">Leave empty for a new random paper. 002 and 2 produce the same paper.</span>
          </label>
          <label className="exam-verify-control">
            <span>Paper-level Gemini verification</span>
            <span className="exam-verify-option">
              <input
                type="checkbox"
                checked={verifyPaper}
                onChange={(event) => setVerifyPaper(event.target.checked)}
                disabled={generating}
              />
              Verify this paper before saving (slower)
            </span>
          </label>
          <button
            className="card-link"
            type="button"
            onClick={() => void handleGenerate()}
            disabled={generating}
          >
            {generating ? <><span className="exam-studio-spinner" aria-hidden="true" />Generating…</> : `Generate ${activeSubject.title} Paper`}
          </button>
        </div>
        {generating && (
          <p className="exam-studio-loading" role="status" aria-live="polite">
            <span className="exam-studio-spinner" aria-hidden="true" />
            {verifyPaper ? 'Building and verifying your paper. This can take up to a minute.' : 'Building your paper from the verified question bank. This should only take a few seconds.'}
          </p>
        )}
        {error && <p className="exam-studio-error">{error}</p>}
        {note && <p className="exam-studio-note">{note}</p>}
      </div>

      {paper && (
        <div className="exam-generated">
          <p className="subtext compact">
            Your paper is saved —{' '}
            <Link href={`/exam-papers/${paper.id}`} prefetch={false}>
              open the printable version
            </Link>
            .
          </p>
          <ExamPaperViewer paper={paper} compact />
        </div>
      )}

      {recent.length > 0 && (
        <div className="exam-recent">
          <h2>Your recent papers</h2>
          <ul>
            {recent.map((summary) => (
              <li key={summary.id}>
                <Link href={`/exam-papers/${summary.id}`} prefetch={false}>
                  {summary.title} — seed {summary.seed} ({summary.verificationStatus})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .exam-paper-studio { margin: 1.5rem 0; padding: 1.25rem; background: #faf6f0; border-radius: 12px; }
        .exam-subject-tabs { display: flex; gap: 0.75rem; margin: 1rem 0 0.75rem; flex-wrap: wrap; }
        .exam-subject-tab { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border-radius: 10px; border: 1.5px solid var(--border, #ddd); background: #fff; cursor: pointer; transition: all 0.15s ease; font-size: 0.9rem; font-weight: 500; color: inherit; }
        .exam-subject-tab:hover { border-color: #c98a2c; background: #fffdfa; }
        .exam-subject-tab.active { border-color: #8a5314; background: #faede0; font-weight: 700; color: #5a3205; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .exam-subject-badge { font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 6px; background: #f0e6d6; color: #5a3205; }
        .exam-subject-tab.active .exam-subject-badge { background: #dfc2a2; }
        .exam-subject-info { font-size: 0.85rem; color: var(--muted, #555); margin: 0.25rem 0 1rem; }
        .exam-studio-controls { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-top: 0.75rem; }
        .exam-studio-controls label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--muted, #555); }
        .exam-studio-help { font-size: 0.75rem; color: var(--muted, #666); max-width: 18rem; }
        .exam-verify-control { min-width: 15rem; }
        .exam-verify-option { display: flex; align-items: center; gap: 0.4rem; }
        .exam-verify-option input { width: auto; }
        .exam-studio-controls input { padding: 0.5rem 0.6rem; border: 1px solid var(--border, #ddd); border-radius: 8px; }
        .exam-studio-controls .card-link { margin: 0; }
        .exam-studio-loading { display: flex; align-items: center; gap: 0.5rem; color: var(--muted, #555); font-size: 0.9rem; margin-top: 0.75rem; }
        .exam-studio-spinner { display: inline-block; width: 1rem; height: 1rem; flex: 0 0 1rem; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: examStudioSpin 0.75s linear infinite; }
        @keyframes examStudioSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .exam-studio-spinner { animation-duration: 1.5s; } }
        .exam-studio-error { color: #b3261e; font-size: 0.9rem; margin-top: 0.75rem; }
        .exam-studio-note { color: var(--muted, #666); font-size: 0.85rem; margin-top: 0.5rem; }
        .exam-generated { margin-top: 2rem; }
        .exam-recent { margin-top: 2.5rem; }
        .exam-recent ul { list-style: none; padding: 0; }
        .exam-recent li { padding: 0.5rem 0; border-top: 1px solid var(--border, #eee); }
      `}</style>
    </div>
  );
}

