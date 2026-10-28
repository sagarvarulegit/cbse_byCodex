'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useTutorPageContext } from '../contexts/TutorPageContext';
import MathText from './MathText';
import TaraFireflyIcon from './TaraFireflyIcon';
import TaraVisualCanvas from './TaraVisualCanvas';
import InteractiveOpticsViewer from './InteractiveOpticsViewer';
import { detectOpticsCanvas } from '../lib/tara-visual-detector';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  contentMarkdown: string;
  citedChunkIds?: string[] | null;
  attachments?: Array<{ id: string; kind: string; fileName: string }>;
};

type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt?: string;
};

const SUGGESTED_QUESTIONS = [
  'What is a displacement reaction?',
  'Explain the quadratic formula.',
  'Why do we balance chemical equations?',
  'What is Ohm\u2019s law?',
];

const CHAPTER_LINKS: Record<string, string> = {
  'chemical-reactions-and-equations': '/chapters/chemical-reactions-and-equations',
  'quadratic-equations': '/chapters/quadratic-equations',
  electricity: '/chapters/electricity',
  'real-numbers': '/chapters/real-numbers',
  'a-letter-to-god': '/chapters/a-letter-to-god',
};

function fireflyAvatar(size: number = 34) {
  return (
    <span
      className="tara-avatar"
      aria-hidden="true"
      style={{ width: size, height: size, flex: `0 0 ${size}px` }}
    >
      <TaraFireflyIcon size={size} glow />
    </span>
  );
}

/** Render inline formatting: math, bold, inline code, italic */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match display math ($$...$$), inline math ($...$), bold (**...**), inline code (`...`), italic (*...*)
  const segments = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);

  segments.forEach((segment, index) => {
    const key = `${keyPrefix}-${index}`;
    if (!segment) return;
    if (segment.startsWith('$$') && segment.endsWith('$$') && segment.length > 4) {
      nodes.push(<MathText key={key} text={segment} />);
    } else if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
      nodes.push(<MathText key={key} text={segment} />);
    } else if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      nodes.push(<strong key={key}>{renderInline(segment.slice(2, -2), `${key}-b`)}</strong>);
    } else if (segment.startsWith('`') && segment.endsWith('`') && segment.length > 2) {
      nodes.push(<code key={key} className="tara-inline-code">{segment.slice(1, -1)}</code>);
    } else if (segment.startsWith('*') && segment.endsWith('*') && segment.length > 2) {
      nodes.push(<em key={key}>{segment.slice(1, -1)}</em>);
    } else {
      nodes.push(<span key={key}>{segment}</span>);
    }
  });

  return nodes;
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableDivider(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes('-')) return false;
  return /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed);
}

/**
 * Rich, safe block-level renderer for Tara's answers:
 * - Markdown tables (| header | -> <table>)
 * - Headings (### -> <h4>, ## -> <h3>)
 * - Lists (- item -> <ul>, 1. item -> <ol>)
 * - Inline math, bold, code, and emphasis
 * - Strips any leaked internal source/chunk citations
 */
function renderTextBlocks(content: string, keyPrefix: string): React.ReactNode[] {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Check if a markdown table starts here
    if (trimmed.includes('|') && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const headerCells = parseTableRow(line);
      i += 2; // skip header and divider row

      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().includes('|') && lines[i].trim().length > 1) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }

      blocks.push(
        <div key={`${keyPrefix}-tbl-${i}`} className="tara-table-wrapper">
          <table className="tara-table">
            <thead>
              <tr>
                {headerCells.map((cell, cIdx) => (
                  <th key={`th-${cIdx}`}>{renderInline(cell, `${keyPrefix}-th-${cIdx}`)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={`tr-${rIdx}`}>
                  {row.map((cell, cIdx) => (
                    <td key={`td-${rIdx}-${cIdx}`}>{renderInline(cell, `${keyPrefix}-td-${rIdx}-${cIdx}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    // 2. Check for sub-headings
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h4 key={`${keyPrefix}-h4-${i}`} className="tara-heading">
          {renderInline(trimmed.slice(4), `${keyPrefix}-h4-in-${i}`)}
        </h4>,
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3 key={`${keyPrefix}-h3-${i}`} className="tara-heading">
          {renderInline(trimmed.slice(3), `${keyPrefix}-h3-in-${i}`)}
        </h3>,
      );
      i++;
      continue;
    }

    // 3. Check for bullet list (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={`${keyPrefix}-ul-${i}`} className="tara-list">
          {listItems.map((item, lIdx) => (
            <li key={`li-${lIdx}`}>{renderInline(item, `${keyPrefix}-li-${lIdx}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // 4. Check for numbered list (1. 2. etc.)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={`${keyPrefix}-ol-${i}`} className="tara-list">
          {listItems.map((item, lIdx) => (
            <li key={`li-${lIdx}`}>{renderInline(item, `${keyPrefix}-oli-${lIdx}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // 5. Check for standalone display math $$ ... $$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      blocks.push(
        <div key={`${keyPrefix}-math-${i}`} className="tara-math-block">
          <MathText text={trimmed} />
        </div>,
      );
      i++;
      continue;
    }

    // 6. Regular paragraph (join wrapped lines within the same paragraph)
    const paraLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().includes('|') &&
      !lines[i].trim().startsWith('###') &&
      !lines[i].trim().startsWith('##') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('$$') && lines[i].trim().endsWith('$$')) &&
      !lines[i].trim().startsWith('```interactive-canvas') &&
      !lines[i].trim().startsWith('```visual-canvas')
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    blocks.push(
      <p key={`${keyPrefix}-p-${i}`} className="tara-para">
        {renderInline(paraLines.join(' '), `${keyPrefix}-p-in-${i}`)}
      </p>,
    );
  }

  return blocks;
}

function OpticsCanvasContainer({
  type,
  initialD,
  rawCode,
}: {
  type: 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';
  initialD: number;
  rawCode: string;
}) {
  const [showRawSandbox, setShowRawSandbox] = useState(false);
  const isPureJson = rawCode.trim().startsWith('{') && rawCode.trim().endsWith('}');

  return (
    <div style={{ margin: '14px 0', width: '100%' }}>
      <InteractiveOpticsViewer initialType={type} initialObjectDistance={initialD} />
      {!isPureJson && (
        <div style={{ marginTop: '8px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => setShowRawSandbox((v) => !v)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#6b7280',
              textDecoration: 'underline',
            }}
          >
            {showRawSandbox ? 'Hide AI Draft Sandbox' : 'View AI Draft Sandbox'}
          </button>
          {showRawSandbox && (
            <div style={{ marginTop: '8px' }}>
              <TaraVisualCanvas code={rawCode} title="AI Draft Canvas" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderTaraContent(content: string, keyPrefix: string): React.ReactNode {
  // Strip any stray internal citation or chunk markers
  const cleaned = content
    .replace(/\[source(?::|\s+id=)[^\]]*\]/gi, '')
    .replace(/\[(?:chunk|source)_[a-zA-Z0-9_\-]+(?:\s*,\s*(?:chunk|source)_[a-zA-Z0-9_\-]+)*\]/gi, '')
    .replace(/[ \t]+$/gm, '');

  // Check if content contains interactive-canvas code blocks
  const canvasRegex = /```(?:interactive-canvas|visual-canvas|canvas)(?::([a-z0-9_-]+))?([\s\S]*?)(?:```|$)/g;
  if (!canvasRegex.test(cleaned)) {
    return renderTextBlocks(cleaned, keyPrefix);
  }

  canvasRegex.lastIndex = 0;
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let segIndex = 0;

  while ((match = canvasRegex.exec(cleaned)) !== null) {
    const textBefore = cleaned.slice(lastIndex, match.index).trim();
    if (textBefore) {
      segments.push(
        <div key={`${keyPrefix}-seg-txt-${segIndex}`}>
          {renderTextBlocks(textBefore, `${keyPrefix}-txt-${segIndex}`)}
        </div>,
      );
      segIndex++;
    }

    const tag = (match[1] || '').trim();
    const rawCode = (match[2] || '').trim();
    const isStillStreaming = !match[0].endsWith('```') && match.index + match[0].length === cleaned.length;

    if (rawCode) {
      const opticsInfo = detectOpticsCanvas(tag, rawCode, cleaned);
      if (opticsInfo.isOptics) {
        segments.push(
          <OpticsCanvasContainer
            key={`${keyPrefix}-optics-${segIndex}`}
            type={opticsInfo.type}
            initialD={opticsInfo.initialD}
            rawCode={rawCode}
          />,
        );
      } else {
        segments.push(
          <TaraVisualCanvas
            key={`${keyPrefix}-canvas-${segIndex}`}
            code={rawCode}
          />,
        );
      }
      segIndex++;
    } else if (isStillStreaming) {
      segments.push(
        <div
          key={`${keyPrefix}-canvas-loading-${segIndex}`}
          style={{
            margin: '12px 0',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '2px dashed #f3883b',
            background: '#fffdf8',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>✨</span>
          Tara is drawing an interactive visual explanation...
        </div>,
      );
      segIndex++;
    }

    lastIndex = match.index + match[0].length;
  }

  const textAfter = cleaned.slice(lastIndex).trim();
  if (textAfter) {
    segments.push(
      <div key={`${keyPrefix}-seg-txt-${segIndex}`}>
        {renderTextBlocks(textAfter, `${keyPrefix}-txt-${segIndex}`)}
      </div>,
    );
  }

  return segments;
}

type GroupedConversations = {
  label: string;
  items: ConversationSummary[];
};

function groupConversationsByDate(conversations: ConversationSummary[]): GroupedConversations[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;
  const startOf7Days = startOfToday - 7 * 86400000;

  const todayList: ConversationSummary[] = [];
  const yesterdayList: ConversationSummary[] = [];
  const last7DaysList: ConversationSummary[] = [];
  const olderList: ConversationSummary[] = [];

  for (const conv of conversations) {
    const timeStr = conv.updatedAt || conv.createdAt;
    const time = timeStr ? new Date(timeStr).getTime() : Date.now();
    if (time >= startOfToday) {
      todayList.push(conv);
    } else if (time >= startOfYesterday) {
      yesterdayList.push(conv);
    } else if (time >= startOf7Days) {
      last7DaysList.push(conv);
    } else {
      olderList.push(conv);
    }
  }

  const groups: GroupedConversations[] = [];
  if (todayList.length > 0) groups.push({ label: 'Today', items: todayList });
  if (yesterdayList.length > 0) groups.push({ label: 'Yesterday', items: yesterdayList });
  if (last7DaysList.length > 0) groups.push({ label: 'Previous 7 Days', items: last7DaysList });
  if (olderList.length > 0) groups.push({ label: 'Older', items: olderList });

  return groups;
}

export default function TaraWidget() {
  const { context, quickPrompts } = useTutorPageContext();
  const [open, setOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Check auth once on mount.
  useEffect(() => {
    fetch('/api/tutor/conversations')
      .then((response) => {
        setAuthed(response.status === 200);
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((data) => {
        if (data?.conversations) {
          setConversations(data.conversations);
        }
      })
      .catch(() => setAuthed(false));
  }, []);

  const openConversation = useCallback(async (id: string) => {
    setActiveId(id);
    setError(null);
    const response = await fetch(`/api/tutor/conversations/${id}`);
    if (response.ok) {
      const data = await response.json();
      setMessages(data.conversation?.messages ?? []);
    }
  }, []);

  const newConversation = useCallback(async (): Promise<ConversationSummary | null> => {
    const defaultTitle = context.chapterTitle
      ? `${context.chapterTitle} doubt`
      : context.pageTitle
        ? `${context.pageTitle} doubt`
        : 'New doubt';
    const response = await fetch('/api/tutor/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: defaultTitle }),
    });
    if (response.ok) {
      const data = await response.json();
      const conv = data.conversation;
      setConversations((current) => [conv, ...current]);
      setActiveId(conv.id);
      setMessages([]);
      setError(null);
      setDrawerOpen(false);
      return conv;
    }
    return null;
  }, [context.chapterTitle, context.pageTitle]);

  // Auto-open a conversation on first render if one exists.
  useEffect(() => {
    if (open && authed && !activeId && conversations.length > 0) {
      void openConversation(conversations[0].id);
    }
  }, [activeId, authed, conversations, open, openConversation]);

  // Keep the thread scrolled to the bottom.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  const startRename = (conv: ConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitleInput(conv.title);
  };

  const saveRename = async (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = editTitleInput.trim();
    if (!trimmed) {
      setEditingId(null);
      return;
    }
    setConversations((current) =>
      current.map((c) => (c.id === id ? { ...c, title: trimmed } : c)),
    );
    setEditingId(null);
    await fetch(`/api/tutor/conversations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed }),
    });
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const deleteConversationById = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((current) => current.filter((c) => c.id !== id));
    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        void openConversation(remaining[0].id);
      } else {
        setActiveId(null);
        setMessages([]);
      }
    }
    await fetch(`/api/tutor/conversations/${id}`, { method: 'DELETE' });
  };

  const sendMessage = useCallback(
    async (text?: string, targetConvId?: string) => {
      const convId = targetConvId ?? activeId;
      const question = (text ?? input).trim();
      if (!question || !convId || streaming) {
        return;
      }
      setInput('');
      setStreaming(true);
      setError(null);
      setStreamText('');

      const optimisticUser: Message = {
        id: `local-${Date.now()}`,
        role: 'user',
        contentMarkdown: question,
        attachments: attachments.map((file) => ({ id: `local-${file.name}`, kind: 'image', fileName: file.name })),
      };
      setMessages((current) => [...current, optimisticUser]);
      setAttachments([]);

      const form = new FormData();
      form.append('question', question);
      form.append('pageContext', JSON.stringify(context));
      for (const file of attachments) {
        form.append('files', file, file.name);
      }

      try {
        const response = await fetch(`/api/tutor/conversations/${convId}/messages`, {
          method: 'POST',
          body: attachments.length > 0 ? form : JSON.stringify({ question, pageContext: context }),
          headers: attachments.length > 0 ? {} : { 'Content-Type': 'application/json' },
        });

        if (!response.ok || !response.body) {
          const data = await response.json().catch(() => null);
          setError(data?.message ?? 'Could not reach Tara. Please try again.');
          setStreaming(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let accumulatedText = '';
        let final: Message | null = null;
        let autoTitle: string | undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          const blocks = buffer.split('\n\n');
          buffer = blocks.pop() ?? '';

          for (const block of blocks) {
            const eventLine = block.split('\n').find((line) => line.startsWith('event: '));
            const dataLine = block.split('\n').find((line) => line.startsWith('data: '));
            if (!eventLine || !dataLine) {
              continue;
            }
            const event = eventLine.slice(7).trim();
            const data = JSON.parse(dataLine.slice(6));

            if (event === 'token') {
              accumulatedText += data.text ?? '';
              setStreamText(accumulatedText);
            } else if (event === 'message') {
              if (data.content) {
                accumulatedText = data.content;
                setStreamText(accumulatedText);
              }
            } else if (event === 'done') {
              if (data.title) {
                autoTitle = data.title;
              }
              final = {
                id: data.messageId ?? `done-${Date.now()}`,
                role: 'assistant',
                contentMarkdown: data.error
                  ? 'Sorry — Tara hit a snag. Try again?'
                  : (accumulatedText || (data.refused ? data.content : '✨')),
                citedChunkIds: data.citedChunkIds ?? [],
              };
            }
          }
        }

        if (autoTitle) {
          setConversations((current) =>
            current.map((c) =>
              c.id === convId ? { ...c, title: autoTitle!, updatedAt: new Date().toISOString() } : c,
            ),
          );
        }

        const finalContent =
          final?.contentMarkdown === 'Sorry — Tara hit a snag. Try again?'
            ? final.contentMarkdown
            : (accumulatedText || final?.contentMarkdown || '✨');

        setMessages((current) => [
          ...current,
          {
            id: final?.id ?? `done-${Date.now()}`,
            role: 'assistant',
            contentMarkdown: finalContent,
            citedChunkIds: final?.citedChunkIds ?? [],
          },
        ]);
        setStreamText('');
        setStreaming(false);
      } catch {
        setError('Could not reach Tara. Please try again.');
        setStreaming(false);
      }
    },
    [activeId, attachments, context, input, streaming],
  );

  // Do NOT hide the widget when signed out; let students discover Tara and prompt sign-in when clicked.

  const activeConv = conversations.find((c) => c.id === activeId);

  return (
    <>
      <button
        className="tara-bubble"
        onClick={() => setOpen((current) => !current)}
        aria-label="Ask Tara-Firefly, your AI tutor"
        aria-expanded={open}
        title="Ask Tara-Firefly (AI Tutor)"
      >
        {open ? (
          <span className="tara-bubble-close">✕</span>
        ) : (
          <span className="tara-bubble-icon">
            <TaraFireflyIcon size={52} glow />
          </span>
        )}
      </button>

      {open && (
        <div className={`tara-window${maximized ? ' tara-window-maximized' : ''}`}>
          <div className="tara-header">
            <div className="tara-header-left">
              <button
                type="button"
                className={`tara-sessions-toggle ${drawerOpen ? 'active' : ''}`}
                onClick={() => setDrawerOpen((prev) => !prev)}
                title="View All Chat Sessions"
                aria-label="View All Chat Sessions"
              >
                <span className="tara-hamburger-icon">☰</span>
                <span className="tara-sessions-badge">{conversations.length}</span>
              </button>
              <div className="tara-header-title">
                {fireflyAvatar(36)}
                <div>
                  <strong>Tara-Firefly</strong>
                  <span className="tara-subtitle">
                    {activeConv?.title ? activeConv.title : 'Your Class 10 AI tutor'}
                  </span>
                </div>
              </div>
            </div>

            <div className="tara-header-actions">
              <button
                type="button"
                className="tara-new-chat-btn"
                onClick={() => void newConversation()}
                title="Start a new doubt session"
              >
                + New
              </button>
              <button
                type="button"
                onClick={() => setMaximized((current) => !current)}
                title={maximized ? 'Minimize chat' : 'Maximize chat'}
                aria-label={maximized ? 'Minimize chat' : 'Maximize chat'}
                aria-pressed={maximized}
              >
                {maximized ? '↙' : '↗'}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="tara-main-layout">
            {/* Collapsible Session Drawer / Sidebar */}
            <aside className={`tara-sessions-drawer ${drawerOpen ? 'open' : ''}`}>
              <div className="tara-drawer-top">
                <span className="tara-drawer-heading">💬 Chat Sessions</span>
                <button
                  type="button"
                  className="tara-drawer-new-btn"
                  onClick={() => void newConversation()}
                >
                  + New Chat
                </button>
              </div>

              <div className="tara-drawer-content">
                {conversations.length === 0 ? (
                  <div className="tara-drawer-empty">
                    <p>No chat sessions yet.</p>
                    <button type="button" onClick={() => void newConversation()}>
                      Start your first doubt
                    </button>
                  </div>
                ) : (
                  groupConversationsByDate(conversations).map((group) => (
                    <div key={group.label} className="tara-date-group">
                      <div className="tara-date-label">{group.label}</div>
                      {group.items.map((conv) => (
                        <div
                          key={conv.id}
                          className={`tara-session-card ${conv.id === activeId ? 'active' : ''}`}
                          onClick={() => {
                            void openConversation(conv.id);
                            if (!maximized) setDrawerOpen(false);
                          }}
                        >
                          {editingId === conv.id ? (
                            <form
                              className="tara-rename-form"
                              onSubmit={(e) => void saveRename(conv.id, e)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                className="tara-rename-input"
                                value={editTitleInput}
                                onChange={(e) => setEditTitleInput(e.target.value)}
                                autoFocus
                              />
                              <button type="submit" className="tara-rename-btn tara-rename-save" title="Save">
                                ✓
                              </button>
                              <button type="button" className="tara-rename-btn tara-rename-cancel" onClick={cancelRename} title="Cancel">
                                ✕
                              </button>
                            </form>
                          ) : (
                            <>
                              <span className="tara-session-title" title={conv.title}>
                                {conv.title}
                              </span>
                              <div className="tara-session-tools">
                                <button
                                  type="button"
                                  onClick={(e) => startRename(conv, e)}
                                  title="Rename session"
                                  aria-label="Rename"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => void deleteConversationById(conv.id, e)}
                                  title="Delete session"
                                  aria-label="Delete"
                                >
                                  🗑
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </aside>

            {/* Main Chat Workspace */}
            <div className="tara-chat-pane">
              <div className="tara-context-bar">
                <span className="tara-context-pill" title={context.pageUrl}>
                  <span className="tara-context-pin">📍</span>
                  <span className="tara-context-text">
                    {context.chapterTitle || context.pageTitle || 'Class 10 Notes'}
                    {context.activeItem?.label ? ` • ${context.activeItem.label}` : ''}
                  </span>
                </span>
                {drawerOpen && (
                  <button
                    type="button"
                    className="tara-close-drawer-pill"
                    onClick={() => setDrawerOpen(false)}
                  >
                    ← Back to chat
                  </button>
                )}
              </div>

              <div className="tara-body">
                {authed === false ? (
                  <div className="tara-auth-gate" style={{ padding: '24px 16px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                      <TaraFireflyIcon size={56} glow />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#171513', margin: '0 0 8px 0' }}>
                      Meet Tara-Firefly ✨
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#5a4a22', lineHeight: 1.55, margin: '0 0 20px 0' }}>
                      Your personal AI study companion for CBSE Class 10. Ask any doubt, get step-by-step NCERT explanations, and explore interactive visual simulations!
                    </p>
                    <a
                      href="/login"
                      style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #ffd66b, #f3883b)',
                        color: '#171513',
                        border: '2px solid #171513',
                        borderRadius: '10px',
                        padding: '10px 22px',
                        fontWeight: 800,
                        fontSize: '14px',
                        textDecoration: 'none',
                        boxShadow: '3px 3px 0 #171513',
                      }}
                    >
                      Sign In to Chat with Tara →
                    </a>
                  </div>
                ) : conversations.length === 0 && messages.length === 0 ? (
                  <div className="tara-empty">
                    <p className="tara-greeting">
                      Hi! I&apos;m Tara-Firefly ✨ — I know you are studying{' '}
                      <strong>{context.chapterTitle || context.pageTitle || 'Class 10 CBSE'}</strong>.
                      Ask me anything or pick a quick doubt:
                    </p>
                    <div className="tara-suggestions">
                      {(quickPrompts.length > 0 ? quickPrompts : SUGGESTED_QUESTIONS).map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={async () => {
                            if (!activeId) {
                              const conv = await newConversation();
                              if (conv?.id) {
                                void sendMessage(question, conv.id);
                              }
                            } else {
                              void sendMessage(question);
                            }
                          }}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="tara-thread">
                    {messages.map((message) => (
                      <div key={message.id} className={`tara-msg tara-msg-${message.role}`}>
                        {message.role === 'assistant' && fireflyAvatar(32)}
                        <div className="tara-bubble-text">
                          <div>{renderTaraContent(message.contentMarkdown, message.id)}</div>
                          {message.attachments && message.attachments.length > 0 && (
                            <span className="tara-attachments">
                              📎 {message.attachments.map((a) => a.fileName).join(', ')}
                            </span>
                          )}
                          {message.role === 'assistant' && message.citedChunkIds && message.citedChunkIds.length > 0 && (
                            <span className="tara-citations">📖 based on your Class 10 notes</span>
                          )}
                        </div>
                      </div>
                    ))}
                    {streaming && (
                      <div className="tara-msg tara-msg-assistant">
                        {fireflyAvatar(32)}
                        <div className="tara-bubble-text tara-streaming">
                          <div>{renderTaraContent(streamText, 'stream')}</div>
                          <span className="tara-typing">…</span>
                        </div>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                )}
                {error && <p className="tara-error">{error}</p>}
              </div>

              {messages.length > 0 && messages.length <= 4 && !streaming && quickPrompts.length > 0 && (
                <div className="tara-quick-chips">
                  {quickPrompts.slice(0, 2).map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="tara-quick-chip"
                      onClick={() => void sendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {authed === false ? (
                <div style={{ padding: '12px 14px', borderTop: '3px solid #171513', background: '#fffdf8', textAlign: 'center', fontSize: '13px', color: '#7a6a4a' }}>
                  Please <a href="/login" style={{ fontWeight: 800, color: '#d97706', textDecoration: 'underline' }}>sign in</a> to chat with Tara and explore simulations.
                </div>
              ) : (
                <div className="tara-input-bar">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    multiple
                    hidden
                    onChange={(event) => setAttachments(Array.from(event.target.files ?? []))}
                  />
                  {attachments.length > 0 && (
                    <span className="tara-file-chip">
                      📎 {attachments.length} file{attachments.length > 1 ? 's' : ''}
                      <button type="button" onClick={() => setAttachments([])} aria-label="Clear files">
                        ✕
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    className="tara-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach files"
                    disabled={streaming}
                  >
                    📎
                  </button>
                  <textarea
                    className="tara-input"
                    rows={1}
                    placeholder="Ask your doubt…"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    disabled={streaming}
                  />
                  <button
                    type="button"
                    className="tara-send"
                    onClick={() => void sendMessage()}
                    disabled={streaming || !input.trim()}
                  >
                    ➤
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tara-bubble {
          position: fixed; bottom: 24px; right: 24px; width: 68px; height: 68px;
          border-radius: 50%; background: linear-gradient(135deg, #f7fee7 0%, #d9f99d 35%, #84cc16 100%);
          color: #171513; border: 3px solid #171513; box-shadow: 4px 4px 0 #171513, 0 4px 24px rgba(163, 230, 53, 0.55);
          cursor: pointer; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          padding: 0;
        }
        .tara-bubble:hover {
          transform: scale(1.12) translateY(-2px);
          box-shadow: 5px 6px 0 #171513, 0 6px 30px rgba(190, 242, 100, 0.85);
        }
        .tara-bubble-icon {
          display: flex; align-items: center; justify-content: center;
          width: 100%; height: 100%;
          animation: fireflyFloat 3.8s ease-in-out infinite;
        }
        @keyframes fireflyFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          30% { transform: translateY(-4px) rotate(2.5deg); }
          60% { transform: translateY(-1px) rotate(-1.5deg); }
        }
        .tara-bubble-close {
          font-size: 26px; font-weight: 900; line-height: 1;
        }
        .tara-window {
          position: fixed; bottom: 104px; right: 24px; width: 380px; max-width: calc(100vw - 48px);
          height: 560px; max-height: calc(100vh - 140px); background: #fff;
          border: 3px solid #171513; border-radius: 16px; box-shadow: 8px 8px 0 rgba(23,21,19,0.15);
          display: flex; flex-direction: column; z-index: 9998; overflow: hidden;
          font-family: 'Noto Sans JP', 'Segoe UI', Arial, sans-serif;
        }
        .tara-window-maximized {
          inset: 0; width: auto; max-width: none; height: auto; max-height: none;
          border-width: 0; border-radius: 0; box-shadow: none;
        }
        .tara-avatar {
          display: inline-flex; align-items: center; justify-content: center;
        }
        .tara-header {
          display: flex; justify-content: space-between; align-items: center; gap: 8px;
          padding: 10px 12px; background: linear-gradient(135deg, #ffd66b, #f3883b);
          border-bottom: 3px solid #171513;
        }
        .tara-header-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .tara-sessions-toggle {
          background: #fff; border: 2px solid #171513; border-radius: 8px; padding: 4px 8px;
          cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 12px;
          font-weight: 700; color: #171513; box-shadow: 1px 1px 0 #171513;
          transition: background 0.1s;
        }
        .tara-sessions-toggle:hover, .tara-sessions-toggle.active { background: #ffe9b8; }
        .tara-hamburger-icon { font-size: 13px; line-height: 1; }
        .tara-sessions-badge {
          background: #171513; color: #ffd66b; border-radius: 10px; padding: 1px 5px;
          font-size: 10px; font-weight: 800;
        }
        .tara-header-title { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .tara-header-title strong { font-family: 'Bangers', cursive; font-size: 20px; letter-spacing: 0.5px; }
        .tara-subtitle {
          display: block; font-size: 11px; color: #5a4a22; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; max-width: 140px;
        }
        .tara-header-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .tara-header-actions button {
          background: #fff; border: 2px solid #171513; border-radius: 8px; padding: 4px 8px;
          cursor: pointer; font-size: 13px; font-weight: 700; color: #171513;
          box-shadow: 1px 1px 0 #171513;
        }
        .tara-new-chat-btn { background: #ffe9b8 !important; }
        .tara-main-layout { flex: 1; display: flex; position: relative; overflow: hidden; }
        .tara-sessions-drawer {
          position: absolute; top: 0; bottom: 0; left: 0; width: 280px; max-width: 85%;
          background: #fffdf8; border-right: 2.5px solid #171513; z-index: 20;
          display: flex; flex-direction: column; transform: translateX(-100%);
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 4px 0 16px rgba(0, 0, 0, 0.15);
        }
        .tara-sessions-drawer.open { transform: translateX(0); }
        .tara-window-maximized .tara-sessions-drawer {
          position: static; transform: none; box-shadow: none; width: 280px; flex-shrink: 0;
        }
        .tara-drawer-top {
          display: flex; justify-content: space-between; align-items: center; padding: 10px 12px;
          border-bottom: 2px solid #171513; background: #fff8e7;
        }
        .tara-drawer-heading { font-size: 13px; font-weight: 800; color: #171513; }
        .tara-drawer-new-btn {
          background: linear-gradient(135deg, #ffd66b, #f3883b); border: 1.5px solid #171513;
          border-radius: 6px; padding: 3px 8px; font-size: 11px; font-weight: 800;
          color: #171513; cursor: pointer; box-shadow: 1px 1px 0 #171513;
        }
        .tara-drawer-content {
          flex: 1; overflow-y: auto; padding: 8px; display: flex; flex-direction: column; gap: 10px;
        }
        .tara-drawer-empty {
          padding: 24px 12px; text-align: center; color: #7a6a4a; font-size: 12px;
        }
        .tara-drawer-empty button {
          margin-top: 8px; background: #ffd66b; border: 1.5px solid #171513;
          border-radius: 6px; padding: 4px 10px; font-size: 11px; font-weight: 700; cursor: pointer;
        }
        .tara-date-group { display: flex; flex-direction: column; gap: 4px; }
        .tara-date-label {
          font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
          color: #8a7a5a; padding: 4px 4px 2px;
        }
        .tara-session-card {
          display: flex; justify-content: space-between; align-items: center; gap: 6px;
          padding: 8px 10px; background: #fff; border: 1.5px solid #dfd4bf; border-radius: 8px;
          cursor: pointer; transition: all 0.12s ease;
        }
        .tara-session-card:hover {
          border-color: #171513; background: #fffbf0; transform: translateY(-1px);
        }
        .tara-session-card.active {
          border: 2px solid #171513; background: #ffe9b8; box-shadow: 1.5px 1.5px 0 #171513;
          font-weight: 700;
        }
        .tara-session-title {
          font-size: 12px; color: #171513; overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap; flex: 1; line-height: 1.3;
        }
        .tara-session-tools { display: flex; gap: 2px; opacity: 0.65; flex-shrink: 0; }
        .tara-session-card:hover .tara-session-tools { opacity: 1; }
        .tara-session-tools button {
          background: none; border: none; cursor: pointer; font-size: 12px; padding: 2px 4px;
          border-radius: 4px;
        }
        .tara-session-tools button:hover { background: rgba(0, 0, 0, 0.08); }
        .tara-rename-form { display: flex; gap: 4px; width: 100%; align-items: center; }
        .tara-rename-input {
          flex: 1; font-size: 11px; padding: 3px 6px; border: 1.5px solid #171513;
          border-radius: 4px; font-family: inherit; outline: none;
        }
        .tara-rename-btn {
          background: #fff; border: 1.5px solid #171513; border-radius: 4px;
          padding: 2px 5px; font-size: 11px; cursor: pointer; font-weight: 700;
        }
        .tara-rename-save { background: #d9f99d; }
        .tara-chat-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100%; }
        .tara-close-drawer-pill {
          background: #fff; border: 1.5px solid #171513; border-radius: 12px; padding: 1px 8px;
          font-size: 10px; font-weight: 700; color: #171513; cursor: pointer;
        }
        .tara-close-drawer-pill:hover { background: #ffe9b8; }
        .tara-context-bar {
          background: #fff8e7; border-bottom: 2px solid #171513; padding: 6px 12px;
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .tara-context-pill {
          display: inline-flex; align-items: center; gap: 6px; font-size: 11px;
          font-weight: 700; color: #5a4a22; background: #fff; border: 1.5px solid #171513;
          border-radius: 20px; padding: 2px 8px; max-width: 100%; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; box-shadow: 1px 1px 0 #171513;
        }
        .tara-context-pin { font-size: 11px; }
        .tara-context-text { overflow: hidden; text-overflow: ellipsis; }
        .tara-body { flex: 1; overflow-y: auto; padding: 14px; background: #fdf9f0; }
        .tara-empty { text-align: left; }
        .tara-greeting { font-size: 14px; line-height: 1.5; margin-bottom: 14px; color: #3a2f1e; }
        .tara-suggestions { display: flex; flex-direction: column; gap: 8px; }
        .tara-suggestions button {
          text-align: left; background: #fff; border: 2px solid #171513; border-radius: 10px;
          padding: 10px 12px; cursor: pointer; font-size: 13px; color: #171513;
          transition: transform 0.1s;
        }
        .tara-suggestions button:hover { transform: translateX(4px); background: #fff7e6; }
        .tara-quick-chips {
          display: flex; gap: 6px; padding: 6px 12px; background: #fdf9f0;
          overflow-x: auto; border-top: 1px dashed #d5cbb8;
        }
        .tara-quick-chip {
          background: #fff; border: 1.5px solid #171513; border-radius: 14px;
          padding: 4px 8px; font-size: 11px; font-weight: 600; color: #171513;
          cursor: pointer; white-space: nowrap; box-shadow: 1px 1px 0 #171513;
          transition: background 0.1s, transform 0.1s;
        }
        .tara-quick-chip:hover { background: #fff7e6; transform: translateY(-1px); }
        .tara-thread { display: flex; flex-direction: column; gap: 10px; }
        .tara-msg { display: flex; gap: 8px; align-items: flex-start; }
        .tara-msg-user { flex-direction: row-reverse; }
        .tara-bubble-text {
          max-width: 82%; background: #fff; border: 2px solid #171513; border-radius: 12px;
          padding: 10px 12px; font-size: 13.5px; line-height: 1.55; word-break: break-word;
        }
        .tara-msg-user .tara-bubble-text { background: #ffe9b8; white-space: pre-wrap; }
        .tara-para { margin: 0 0 8px 0; }
        .tara-para:last-child { margin-bottom: 0; }
        .tara-heading { margin: 10px 0 4px 0; font-size: 14px; font-weight: 800; color: #171513; }
        .tara-list { margin: 4px 0 8px 18px; padding: 0; }
        .tara-list li { margin-bottom: 4px; }
        .tara-list:last-child { margin-bottom: 0; }
        .tara-inline-code {
          background: #f4ecdc; border: 1px solid #d5c8b5; border-radius: 4px;
          padding: 1px 5px; font-family: monospace; font-size: 12px; color: #7a3a10;
        }
        .tara-math-block { margin: 8px 0; overflow-x: auto; text-align: center; }
        .tara-table-wrapper {
          margin: 8px 0; overflow-x: auto; border: 1.5px solid #171513;
          border-radius: 8px; box-shadow: 1.5px 1.5px 0 #171513; background: #fff;
        }
        .tara-table {
          width: 100%; border-collapse: collapse; font-size: 12px; line-height: 1.45; text-align: left;
        }
        .tara-table th {
          background: #ffe9b8; color: #171513; font-weight: 700; padding: 6px 8px;
          border-bottom: 1.5px solid #171513; border-right: 1px solid #e0d0b0;
        }
        .tara-table th:last-child { border-right: none; }
        .tara-table td {
          padding: 6px 8px; border-bottom: 1px solid #e8dec8; border-right: 1px solid #e8dec8; color: #171513;
        }
        .tara-table td:last-child { border-right: none; }
        .tara-table tr:last-child td { border-bottom: none; }
        .tara-table tr:nth-child(even) { background: #fffdf8; }
        .tara-streaming .tara-typing { animation: taraBlink 1s infinite; }
        @keyframes taraBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        .tara-attachments { display: block; font-size: 12px; color: #7a5a10; margin-top: 4px; }
        .tara-citations { display: block; font-size: 11px; color: #8a7a4a; margin-top: 6px; font-style: italic; }
        .tara-error { color: #b3261e; font-size: 13px; margin-top: 8px; }
        .tara-input-bar {
          display: flex; align-items: flex-end; gap: 8px; padding: 10px 12px;
          border-top: 3px solid #171513; background: #fff;
        }
        .tara-file-chip {
          position: absolute; bottom: 64px; right: 24px; background: #ffe9b8; border: 2px solid #171513;
          border-radius: 10px; padding: 4px 8px; font-size: 12px; display: flex; align-items: center; gap: 6px;
        }
        .tara-file-chip button { background: none; border: none; cursor: pointer; font-size: 12px; }
        .tara-attach-btn {
          background: #fff; border: 2px solid #171513; border-radius: 10px; padding: 8px 10px;
          cursor: pointer; font-size: 16px;
        }
        .tara-attach-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .tara-input {
          flex: 1; border: 2px solid #171513; border-radius: 10px; padding: 8px 10px;
          font: inherit; font-size: 14px; resize: none; min-height: 38px;
        }
        .tara-send {
          background: linear-gradient(135deg, #ffd66b, #f3883b); color: #171513;
          border: 2px solid #171513; border-radius: 10px; padding: 8px 12px; cursor: pointer; font-size: 16px;
        }
        .tara-send:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </>
  );
}
