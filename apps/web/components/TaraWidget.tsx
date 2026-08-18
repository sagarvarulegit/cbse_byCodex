'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import MathText from './MathText';
import TaraFireflyIcon from './TaraFireflyIcon';

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

/**
 * Minimal, safe inline renderer for Tara's answers: renders **bold** and
 * $...$ / $$...$$ math (via MathText/KaTeX), keeps everything else as plain
 * text with line breaks preserved. No raw HTML — the server already sanitized
 * the markdown, and this renderer never uses dangerouslySetInnerHTML.
 */
function renderTaraContent(content: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  // Split on display math first, then inline math, then bold segments.
  const segments = content.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*)/g);

  segments.forEach((segment, index) => {
    const key = `${keyPrefix}-${index}`;
    if (segment.startsWith('$$') && segment.endsWith('$$') && segment.length > 4) {
      nodes.push(<MathText key={key} text={segment} />);
    } else if (segment.startsWith('$') && segment.endsWith('$') && segment.length > 2) {
      nodes.push(<MathText key={key} text={segment} />);
    } else if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      nodes.push(<strong key={key}>{segment.slice(2, -2)}</strong>);
    } else if (segment) {
      nodes.push(<span key={key}>{segment}</span>);
    }
  });

  return nodes;
}

export default function TaraWidget() {
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
    const response = await fetch('/api/tutor/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New doubt' }),
    });
    if (response.ok) {
      const data = await response.json();
      const conv = data.conversation;
      setConversations((current) => [conv, ...current]);
      setActiveId(conv.id);
      setMessages([]);
      setError(null);
      return conv;
    }
    return null;
  }, []);

  // Auto-open a conversation on first render if one exists.
  useEffect(() => {
    if (open && authed && !activeId && conversations.length > 0) {
      void openConversation(conversations[0].id);
    }
  }, [open, authed, activeId, conversations, openConversation]);

  // Keep the thread scrolled to the bottom.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

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
      for (const file of attachments) {
        form.append('files', file, file.name);
      }

      try {
        const response = await fetch(`/api/tutor/conversations/${convId}/messages`, {
          method: 'POST',
          body: attachments.length > 0 ? form : JSON.stringify({ question }),
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

        // The final message content was streamed via tokens or message event; use accumulatedText.
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
    [activeId, attachments, input, streaming],
  );

  const deleteConversation = useCallback(async () => {
    if (!activeId) {
      return;
    }
    await fetch(`/api/tutor/conversations/${activeId}`, { method: 'DELETE' });
    setConversations((current) => current.filter((c) => c.id !== activeId));
    setActiveId(null);
    setMessages([]);
  }, [activeId]);

  if (authed === false) {
    return null; // signed-out students don't see the bubble
  }

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
            <div className="tara-header-title">
              {fireflyAvatar(40)}
              <div>
                <strong>Tara-Firefly</strong>
                <span className="tara-subtitle">Your Class 10 AI tutor</span>
              </div>
            </div>
            <div className="tara-header-actions">
              <button type="button" onClick={() => void newConversation()} title="New chat">
                +
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
              <button type="button" onClick={() => void deleteConversation()} title="Delete chat" disabled={!activeId}>
                🗑
              </button>
            </div>
          </div>

          <div className="tara-body">
            {conversations.length === 0 && messages.length === 0 ? (
              <div className="tara-empty">
                <p className="tara-greeting">
                  Hi! I&apos;m Tara-Firefly ✨ — ask me any Class 10 doubt and I&apos;ll light the
                  way through your notes.
                </p>
                <div className="tara-suggestions">
                  {SUGGESTED_QUESTIONS.map((question) => (
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
                      <span>{renderTaraContent(message.contentMarkdown, message.id)}</span>
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
                      <span>{renderTaraContent(streamText, 'stream')}</span>
                      <span className="tara-typing">…</span>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
            {error && <p className="tara-error">{error}</p>}
          </div>

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
          padding: 12px 14px; background: linear-gradient(135deg, #ffd66b, #f3883b);
          border-bottom: 3px solid #171513;
        }
        .tara-header-title { display: flex; align-items: center; gap: 10px; }
        .tara-header-title strong { font-family: 'Bangers', cursive; font-size: 22px; letter-spacing: 0.5px; }
        .tara-subtitle { display: block; font-size: 12px; color: #5a4a22; }
        .tara-header-actions button {
          background: #fff; border: 2px solid #171513; border-radius: 8px; padding: 4px 8px;
          cursor: pointer; font-size: 14px; margin-left: 4px;
        }
        .tara-header-actions button:disabled { opacity: 0.4; cursor: not-allowed; }
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
        .tara-thread { display: flex; flex-direction: column; gap: 10px; }
        .tara-msg { display: flex; gap: 8px; align-items: flex-start; }
        .tara-msg-user { flex-direction: row-reverse; }
        .tara-bubble-text {
          max-width: 78%; background: #fff; border: 2px solid #171513; border-radius: 12px;
          padding: 10px 12px; font-size: 14px; line-height: 1.5; white-space: pre-wrap;
        }
        .tara-msg-user .tara-bubble-text { background: #ffe9b8; }
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
