'use client';

import { useEffect, useState } from 'react';

interface Feedback {
  id: string;
  category: string;
  subject: string | null;
  chapter: string | null;
  title: string;
  description: string;
  rating: number | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: '#f3883b',
  reviewed: '#3b82f6',
  in_progress: '#f59e0b',
  resolved: '#2f8f68',
};

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feedback')
      .then(r => r.json())
      .then(d => { setFeedback(d.items || d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? feedback : feedback.filter(f => f.status === filter);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/feedback/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  if (loading) return <div style={{ padding: 40, fontSize: 20 }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f7f2e7', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Bangers, sans-serif', fontSize: 48, marginBottom: 8 }}>Student Feedback</h1>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {['new', 'reviewed', 'in_progress', 'resolved'].map(s => (
            <div key={s} style={{ background: '#fff', border: '2px solid #171513', padding: '12px 20px', minWidth: 120, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{feedback.filter(f => f.status === s).length}</div>
              <div style={{ fontSize: 13, textTransform: 'uppercase', color: STATUS_COLORS[s] }}>{s.replace('_', ' ')}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['all', 'new', 'reviewed', 'in_progress', 'resolved'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '8px 16px', border: '2px solid #171513', background: filter === s ? '#171513' : '#fff', color: filter === s ? '#fff' : '#171513', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p style={{ fontSize: 18, color: '#666' }}>No feedback found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(f => (
              <div key={f.id} style={{ background: '#fff', border: '2px solid #171513', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{f.title}</span>
                    <span style={{ marginLeft: 12, fontSize: 13, color: '#666' }}>{f.category}</span>
                    {f.subject && <span style={{ marginLeft: 8, fontSize: 13, color: '#666' }}>· {f.subject}</span>}
                  </div>
                  <span style={{ padding: '4px 12px', background: STATUS_COLORS[f.status] || '#999', color: '#fff', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{f.status}</span>
                </div>
                <p style={{ fontSize: 15, color: '#2A2A2A', margin: '0 0 8px' }}>{f.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#999' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                  <select value={f.status} onChange={e => updateStatus(f.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid #ccc', fontSize: 13 }}>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
