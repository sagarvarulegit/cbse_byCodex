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

const SUBJECT_SLUG = 'mathematics-standard';
const SUBJECT_TITLE = 'Mathematics Standard (041)';

export default function ExamPaperStudio({ token }: { token: string | null }) {
  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [recent, setRecent] = useState<ExamPaperSummary[]>([]);
  const [seedInput, setSeedInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

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
    const data = await generateExamPaper(token, SUBJECT_SLUG, parsedSeed);
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
          {SUBJECT_TITLE} · 80 marks · 3 hours · 15 minutes reading time. Papers
          are assembled from the verified question bank using the official
          blueprint.
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
          </label>
          <button
            className="card-link"
            type="button"
            onClick={() => void handleGenerate()}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate new paper'}
          </button>
        </div>
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
        .exam-studio-controls { display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-top: 0.75rem; }
        .exam-studio-controls label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--muted, #555); }
        .exam-studio-controls input { padding: 0.5rem 0.6rem; border: 1px solid var(--border, #ddd); border-radius: 8px; }
        .exam-studio-controls .card-link { margin: 0; }
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
