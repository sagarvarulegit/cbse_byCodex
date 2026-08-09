'use client';

import { useState } from 'react';

const CATEGORIES = [
  { value: 'suggestion', label: '💡 Suggestion' },
  { value: 'bug', label: '🐛 Bug Report' },
  { value: 'content_error', label: '📝 Content Error' },
  { value: 'general', label: '💬 General Feedback' },
];

const SUBJECTS = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'social_science', label: 'Social Science' },
  { value: 'english', label: 'English' },
  { value: 'general', label: 'General' },
];

export default function FeedbackPage() {
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!category) { setError('Please select a category'); return; }
    if (!title.trim()) { setError('Please enter a title'); return; }
    if (description.trim().length < 20) { setError('Description must be at least 20 characters'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, subject: subject || null, chapter: chapter || null, title: title.trim(), description: description.trim(), rating: rating || null }),
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f2e7', padding: '40px' }}>
        <div style={{ background: '#fff', border: '3px solid #171513', boxShadow: '8px 8px 0 #171513', padding: '60px 50px', textAlign: 'center', maxWidth: 500 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'Bangers, sans-serif', fontSize: 42, marginBottom: 12 }}>Thank You!</h2>
          <p style={{ fontSize: 20, color: '#2A2A2A', marginBottom: 24 }}>Your feedback has been submitted. We read every single one.</p>
          <button onClick={() => { setSubmitted(false); setCategory(''); setSubject(''); setChapter(''); setTitle(''); setDescription(''); setRating(0); }} style={{ background: '#f3883b', color: '#fff', border: '3px solid #171513', padding: '12px 32px', fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f2e7', padding: '40px 20px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bangers, sans-serif', fontSize: 56, marginBottom: 8 }}>Feedback</h1>
        <p style={{ fontSize: 20, color: '#2A2A2A', marginBottom: 32 }}>Help us improve. Your suggestions shape the platform.</p>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: '3px solid #171513', boxShadow: '8px 8px 0 #171513', padding: '36px 32px' }}>
          {/* Category */}
          <label style={{ display: 'block', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Category *</span>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: '12px 16px', border: '2px solid #171513', fontSize: 16, fontFamily: 'inherit', background: '#f7f2e7' }}>
              <option value="">Select category...</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>

          {/* Subject */}
          <label style={{ display: 'block', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Subject (optional)</span>
            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 8, padding: '12px 16px', border: '2px solid #171513', fontSize: 16, fontFamily: 'inherit', background: '#f7f2e7' }}>
              <option value="">Select subject...</option>
              {SUBJECTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>

          {/* Chapter */}
          {subject && (
            <label style={{ display: 'block', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Chapter (optional)</span>
              <input type="text" value={chapter} onChange={e => setChapter(e.target.value)} placeholder="e.g. Quadratic Equations" style={{ display: 'block', width: '100%', marginTop: 8, padding: '12px 16px', border: '2px solid #171513', fontSize: 16, fontFamily: 'inherit', background: '#f7f2e7', boxSizing: 'border-box' }} />
            </label>
          )}

          {/* Title */}
          <label style={{ display: 'block', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Title *</span>
            <input type="text" value={title} onChange={e => setTitle(e.target.value.slice(0, 200))} placeholder="Brief summary of your feedback" maxLength={200} style={{ display: 'block', width: '100%', marginTop: 8, padding: '12px 16px', border: '2px solid #171513', fontSize: 16, fontFamily: 'inherit', background: '#f7f2e7', boxSizing: 'border-box' }} />
            <span style={{ fontSize: 13, color: '#666' }}>{title.length}/200</span>
          </label>

          {/* Description */}
          <label style={{ display: 'block', marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Description *</span>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell us more — at least 20 characters" rows={5} style={{ display: 'block', width: '100%', marginTop: 8, padding: '12px 16px', border: '2px solid #171513', fontSize: 16, fontFamily: 'inherit', background: '#f7f2e7', resize: 'vertical', boxSizing: 'border-box' }} />
            <span style={{ fontSize: 13, color: description.length < 20 ? '#c4473d' : '#666' }}>{description.length} characters (min 20)</span>
          </label>

          {/* Rating */}
          <label style={{ display: 'block', marginBottom: 24 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Rating (optional)</span>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(rating === star ? 0 : star)} style={{ fontSize: 32, background: 'none', border: 'none', cursor: 'pointer', color: star <= rating ? '#f3883b' : '#ccc', padding: '0 4px' }}>
                  ★
                </button>
              ))}
            </div>
          </label>

          {/* Error */}
          {error && <div style={{ background: '#c4473d', color: '#fff', padding: '12px 16px', marginBottom: 20, fontWeight: 700 }}>{error}</div>}

          {/* Submit */}
          <button type="submit" disabled={submitting} style={{ background: submitting ? '#999' : '#f3883b', color: '#fff', border: '3px solid #171513', boxShadow: '4px 4px 0 #171513', padding: '14px 40px', fontSize: 20, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
}
