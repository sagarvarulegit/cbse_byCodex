'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, Sparkles } from 'lucide-react';

interface TaraVisualCanvasProps {
  code: string;
  title?: string;
}

/**
 * Builds the sandboxed iframe HTML document.
 * Injects Google Fonts, clean modern reset, KaTeX for math formulas,
 * and high-contrast styling matching ChapterReady.
 */
function buildSandboxDoc(code: string): string {
  // Extract custom title or metadata if embedded in comments
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #fffdf8;
      color: #24211f;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
    }
    body {
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
    /* ChapterReady Canvas Primitives */
    .cr-card {
      background: #fff;
      border: 2px solid #24211f;
      border-radius: 14px;
      box-shadow: 4px 4px 0 #24211f;
      padding: 14px;
      width: 100%;
      max-width: 540px;
      margin: 0 auto;
    }
    .cr-btn {
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 700;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px solid #24211f;
      background: #f3883b;
      color: #24211f;
      cursor: pointer;
      box-shadow: 2px 2px 0 #24211f;
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .cr-btn:active {
      transform: translate(2px, 2px);
      box-shadow: 0 0 0 #24211f;
    }
    .cr-slider {
      width: 100%;
      accent-color: #f3883b;
      cursor: pointer;
    }
    .cr-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1.5px solid #24211f;
      background: #fef3c7;
      color: #b45309;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
}

export default function TaraVisualCanvas({ code, title }: TaraVisualCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [key, setKey] = useState(0);
  const canvasId = useId();

  // Extract optional title from comment if not provided (e.g. <!-- title: Ray Diagram -->)
  const displayTitle = useMemo(() => {
    if (title) return title;
    const match = code.match(/<!--\s*title:\s*([^\n\r]+?)\s*-->/i);
    return match ? match[1].trim() : 'Interactive Visual Explanation';
  }, [code, title]);

  const srcDoc = useMemo(() => buildSandboxDoc(code), [code]);

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Close fullscreen on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <>
      {/* Inline Canvas Card in Chat */}
      <div
        className="tara-visual-canvas-card"
        style={{
          margin: '16px 0',
          borderRadius: '16px',
          border: '2px solid #24211f',
          background: '#fffdf8',
          boxShadow: '4px 4px 0 #24211f',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {/* Canvas Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 14px',
            background: '#fef3c7',
            borderBottom: '2px solid #24211f',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                background: '#f3883b',
                color: '#fff',
                fontSize: '12px',
              }}
            >
              <Sparkles size={13} />
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                fontWeight: 700,
                color: '#24211f',
                letterSpacing: '0.3px',
              }}
            >
              {displayTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={handleReset}
              title="Reset simulation"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px 8px',
                background: '#fff',
                border: '1.5px solid #24211f',
                borderRadius: '6px',
                color: '#24211f',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
              }}
            >
              <RotateCcw size={12} style={{ marginRight: '4px' }} /> Reset
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Expand visual"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px 8px',
                background: '#24211f',
                border: '1.5px solid #24211f',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '11px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
              }}
            >
              <Maximize2 size={12} style={{ marginRight: '4px' }} /> Expand
            </button>
          </div>
        </div>

        {/* Sandboxed iframe */}
        <div style={{ width: '100%', height: '420px', position: 'relative', background: '#fff' }}>
          <iframe
            key={key}
            ref={iframeRef}
            id={canvasId}
            title={displayTitle}
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
              background: '#fffdf8',
            }}
          />
        </div>
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(23, 21, 19, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              height: '88vh',
              background: '#fffdf8',
              border: '3px solid #24211f',
              borderRadius: '20px',
              boxShadow: '10px 10px 0 #24211f',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'taraPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                background: '#fef3c7',
                borderBottom: '2px solid #24211f',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: '#f3883b',
                    color: '#fff',
                  }}
                >
                  <Sparkles size={16} />
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: '18px',
                      color: '#24211f',
                      margin: 0,
                    }}
                  >
                    {displayTitle}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '12px',
                      color: '#787168',
                    }}
                  >
                    Interactive NCERT Simulation · ChapterReady Tara AI
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 14px',
                    background: '#fff',
                    border: '2px solid #24211f',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  <RotateCcw size={13} /> Reset
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 14px',
                    background: '#24211f',
                    color: '#fff',
                    border: '2px solid #24211f',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  <Minimize2 size={13} /> Close
                </button>
              </div>
            </div>

            {/* Modal Sandboxed iframe */}
            <div style={{ flex: 1, width: '100%', position: 'relative' }}>
              <iframe
                key={`modal-${key}`}
                title={displayTitle}
                srcDoc={srcDoc}
                sandbox="allow-scripts"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                  background: '#fffdf8',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
