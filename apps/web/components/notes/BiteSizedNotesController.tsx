'use client';

import Link from 'next/link';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { trackAnalyticsEvent } from '../../lib/analytics';
import { buildChallengeUrl, openWhatsAppChallenge } from '../../lib/whatsapp-share';

export type NotesStudyMode = 'textbook' | 'cards';

export type BiteCardMeta = {
  index: number;
  partId: string;
  partNumber: string;
  partTitle: string;
  sectionId: string;
  eyebrow: string;
  title: string;
  optionLabel: string;
  estMinutes: number;
};

type BiteSizedNotesControllerProps = {
  chapterSlug: string;
  chapterTitle: string;
  hasQuiz: boolean;
  children: ReactNode;
};

const MASTERED_STORAGE_PREFIX = 'cbse:bite-cards-mastered:v1';

function getMasteredStorageKey(chapterSlug: string) {
  return `${MASTERED_STORAGE_PREFIX}:${chapterSlug}`;
}

export default function BiteSizedNotesController({
  chapterSlug,
  chapterTitle,
  hasQuiz,
  children,
}: BiteSizedNotesControllerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const sectionElementsRef = useRef<HTMLElement[]>([]);
  const partElementsRef = useRef<HTMLDetailsElement[]>([]);
  const savedOpenPartsRef = useRef<Set<string> | null>(null);
  const wasCardsModeRef = useRef(false);

  const [mode, setMode] = useState<NotesStudyMode>('textbook');
  const [cards, setCards] = useState<BiteCardMeta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIndices, setMasteredIndices] = useState<number[]>([]);

  // Scan rendered NCERT sections inside .complete-chapter-part-body in exact textbook DOM order
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container) return;

    const partEls = Array.from(
      container.querySelectorAll<HTMLDetailsElement>('details.complete-chapter-part'),
    );
    partElementsRef.current = partEls;

    const discoveredSections: HTMLElement[] = [];
    const discoveredMeta: BiteCardMeta[] = [];

    partEls.forEach((partEl, pIdx) => {
      const partId = partEl.id || `part-${pIdx + 1}`;
      const partNumber =
        partEl.querySelector('.complete-chapter-part-header > span')?.textContent?.trim() ||
        String(pIdx + 1).padStart(2, '0');
      const partTitle =
        partEl.querySelector('.complete-chapter-part-header h2')?.textContent?.trim() ||
        chapterTitle;

      const body = partEl.querySelector('.complete-chapter-part-body');
      if (!body) return;

      const directSections = Array.from(body.children).filter(
        (el): el is HTMLElement => el.tagName === 'SECTION',
      );

      directSections.forEach((secEl) => {
        const cardIndex = discoveredSections.length;
        const sectionId = secEl.id || `${partId}-card-${cardIndex + 1}`;

        const eyebrowEl = secEl.querySelector('.concept-eyebrow, .card-eyebrow');
        const headingEl = secEl.querySelector('h3, h2');
        const rawEyebrow = eyebrowEl?.textContent?.replace(/\s+/g, ' ').trim() || '';
        const rawHeading = headingEl?.textContent?.replace(/\s+/g, ' ').trim() || '';

        const eyebrow = rawEyebrow || (cardIndex === 0 ? 'Overview' : `Part ${partNumber}`);
        const title = rawHeading || (rawEyebrow ? partTitle : `${partTitle} · Overview`);

        const secNumMatch = rawEyebrow.match(/^Section\s+([\d.-]+)$/i);
        const optionLabel = secNumMatch
          ? `${secNumMatch[1]} ${title}`
          : rawHeading
            ? `${eyebrow ? `${eyebrow} · ` : ''}${title}`
            : `Part ${partNumber} · Overview`;

        const wordCount = (secEl.textContent || '').trim().split(/\s+/).filter(Boolean).length;
        const estMinutes = Math.max(1, Math.min(5, Math.ceil(wordCount / 165)));

        discoveredSections.push(secEl);
        discoveredMeta.push({
          index: cardIndex,
          partId,
          partNumber,
          partTitle,
          sectionId,
          eyebrow,
          title,
          optionLabel,
          estMinutes,
        });
      });
    });

    sectionElementsRef.current = discoveredSections;
    setCards(discoveredMeta);

    // Load saved card mastery state for this chapter
    try {
      const savedRaw = window.localStorage.getItem(getMasteredStorageKey(chapterSlug));
      if (savedRaw) {
        const parsed = JSON.parse(savedRaw) as unknown;
        if (Array.isArray(parsed)) {
          setMasteredIndices(
            parsed.filter(
              (n): n is number =>
                typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < discoveredMeta.length,
            ),
          );
        }
      }
    } catch {
      // Ignore storage blocks cleanly
    }

    // Activate cards mode automatically ONLY when explicitly requested via ?view=cards
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'cards' && discoveredMeta.length > 0) {
        const requestedCard = Number(params.get('card'));
        const hashId = window.location.hash.replace(/^#/, '');
        let initialIdx = 0;

        if (
          Number.isInteger(requestedCard) &&
          requestedCard >= 0 &&
          requestedCard < discoveredMeta.length
        ) {
          initialIdx = requestedCard;
        } else if (hashId) {
          const matchedBySection = discoveredMeta.findIndex(
            (c) => c.sectionId === hashId || c.partId === hashId,
          );
          if (matchedBySection >= 0) {
            initialIdx = matchedBySection;
          }
        }

        setCurrentIndex(initialIdx);
        setMode('cards');
      }
    } catch {
      // Ignore URL parse issues
    }
  }, [chapterSlug, chapterTitle]);

  // Synchronize DOM visibility attributes when switching modes or stepping cards
  useEffect(() => {
    const container = contentContainerRef.current;
    const partEls = partElementsRef.current;
    const secEls = sectionElementsRef.current;
    if (!container || partEls.length === 0 || secEls.length === 0) return;

    if (mode === 'cards') {
      if (!wasCardsModeRef.current) {
        savedOpenPartsRef.current = new Set(
          partEls.filter((el) => el.open).map((el) => el.id),
        );
        wasCardsModeRef.current = true;
      }

      const safeIndex = Math.min(Math.max(0, currentIndex), secEls.length - 1);
      const activeSectionEl = secEls[safeIndex];
      const activePartEl = activeSectionEl?.closest('details.complete-chapter-part') as
        | HTMLDetailsElement
        | null;

      partEls.forEach((partEl) => {
        if (partEl === activePartEl) {
          partEl.open = true;
          partEl.setAttribute('data-bite-part', 'active');
        } else {
          partEl.setAttribute('data-bite-part', 'hidden');
        }
      });

      secEls.forEach((secEl, idx) => {
        secEl.setAttribute('data-bite-card', idx === safeIndex ? 'active' : 'hidden');
      });
    } else if (wasCardsModeRef.current) {
      wasCardsModeRef.current = false;
      const savedOpen = savedOpenPartsRef.current;

      partEls.forEach((partEl, idx) => {
        partEl.removeAttribute('data-bite-part');
        if (savedOpen) {
          partEl.open = savedOpen.has(partEl.id) || (savedOpen.size === 0 && idx === 0);
        }
      });

      secEls.forEach((secEl) => {
        secEl.removeAttribute('data-bite-card');
      });
    }
  }, [mode, currentIndex, cards.length]);

  const syncUrlParams = useCallback((nextMode: NotesStudyMode, nextCardIdx: number) => {
    try {
      const url = new URL(window.location.href);
      if (nextMode === 'cards') {
        url.searchParams.set('view', 'cards');
        url.searchParams.set('card', String(nextCardIdx));
      } else {
        url.searchParams.delete('view');
        url.searchParams.delete('card');
      }
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore history API restrictions
    }
  }, []);

  const switchMode = useCallback(
    (nextMode: NotesStudyMode) => {
      setMode(nextMode);
      syncUrlParams(nextMode, currentIndex);
      trackAnalyticsEvent('notes_study_mode_change', {
        chapter_slug: chapterSlug,
        mode: nextMode,
        total_cards: cards.length,
      });
    },
    [cards.length, chapterSlug, currentIndex, syncUrlParams],
  );

  const goToCard = useCallback(
    (targetIdx: number, scrollDeckIntoView = true) => {
      if (cards.length === 0) return;
      const bounded = Math.min(Math.max(0, targetIdx), cards.length - 1);
      setCurrentIndex(bounded);
      syncUrlParams('cards', bounded);

      if (scrollDeckIntoView && shellRef.current) {
        const rect = shellRef.current.getBoundingClientRect();
        if (rect.top < 70 || rect.top > window.innerHeight * 0.45) {
          shellRef.current.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
              ? 'auto'
              : 'smooth',
            block: 'start',
          });
        }
      }
    },
    [cards.length, syncUrlParams],
  );

  const markGotItAndAdvance = useCallback(() => {
    setMasteredIndices((prev) => {
      const next = prev.includes(currentIndex) ? prev : [...prev, currentIndex];
      try {
        window.localStorage.setItem(getMasteredStorageKey(chapterSlug), JSON.stringify(next));
      } catch {
        // Ignore storage blocks
      }
      return next;
    });

    trackAnalyticsEvent('notes_bite_card_complete', {
      chapter_slug: chapterSlug,
      card_index: currentIndex + 1,
      total_cards: cards.length,
    });

    if (currentIndex < cards.length - 1) {
      goToCard(currentIndex + 1, true);
    }
  }, [cards.length, chapterSlug, currentIndex, goToCard]);

  // Keyboard ← / → support when in Bite-Sized Cards mode
  useEffect(() => {
    if (mode !== 'cards' || cards.length === 0) return;

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === 'ArrowRight' && currentIndex < cards.length - 1) {
        event.preventDefault();
        goToCard(currentIndex + 1, true);
      } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        goToCard(currentIndex - 1, true);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length, currentIndex, goToCard, mode]);

  // Intercept sidebar contents clicks while in Bite-Sized Cards mode so clicking a section opens its card
  useEffect(() => {
    if (mode !== 'cards' || cards.length === 0) return;

    function handleSidebarClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest(
        '.complete-chapter-sidebar a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute('href')?.replace(/^#/, '') || '';
      if (!hash || hash === 'board-exam-drill' || hash === 'introduction') {
        return;
      }

      const matchedIdx = cards.findIndex(
        (c) => c.sectionId === hash || c.partId === hash,
      );
      if (matchedIdx >= 0) {
        event.preventDefault();
        goToCard(matchedIdx, true);
      }
    }

    document.addEventListener('click', handleSidebarClick);
    return () => document.removeEventListener('click', handleSidebarClick);
  }, [cards, goToCard, mode]);

  const activeCard = cards[currentIndex] ?? null;
  const progressPercent =
    cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0;
  const isLastCard = cards.length > 0 && currentIndex === cards.length - 1;
  const isCurrentMastered = masteredIndices.includes(currentIndex);

  function handleShareCardOnWhatsApp() {
    if (!activeCard) return;
    const cardShareUrl = buildChallengeUrl(`/chapters/${chapterSlug}/notes`, {
      view: 'cards',
      card: currentIndex,
    });
    openWhatsAppChallenge({
      surface: 'chapter_bite_card',
      chapterSlug,
      message: `📚 Quick 90-sec CBSE Class 10 revision card on *${chapterTitle}* (${activeCard.optionLabel})! Read just 1 card & test yourself 👇\n${cardShareUrl}`,
    });
  }

  return (
    <div
      ref={shellRef}
      className="bite-sized-notes-shell"
      data-notes-mode={mode}
    >
      {/* Prominent Study Mode Switcher */}
      <div className="bite-mode-switcher-bar" role="region" aria-label="Notes study mode switcher">
        <div className="bite-mode-switcher-copy">
          <span className="bite-mode-kicker">🧠 CHOOSE HOW YOU READ</span>
          <strong>
            {mode === 'cards'
              ? `⚡ Bite-Sized Concept Cards (${cards.length} Topics)`
              : 'Skip the Long Scroll — Flip 1 Concept Card at a Time'}
          </strong>
          <span>
            {mode === 'cards'
              ? 'Exact NCERT numbering & diagrams preserved — zero wall-of-text fatigue.'
              : `Break this chapter into ${cards.length || 'short'} focused ~2-min NCERT cards with instant progress tracking.`}
          </span>
        </div>

        <div className="bite-mode-toggle-group" role="tablist" aria-label="Chapter reading layout">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'cards'}
            className={`bite-mode-toggle-btn ${mode === 'cards' ? 'is-active' : ''}`}
            disabled={cards.length === 0}
            onClick={() => switchMode('cards')}
          >
            ⚡ Bite-Sized Cards{cards.length > 0 ? ` (${cards.length})` : ''}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'textbook'}
            className={`bite-mode-toggle-btn ${mode === 'textbook' ? 'is-active' : ''}`}
            onClick={() => switchMode('textbook')}
          >
            📖 Full Textbook View
          </button>
        </div>
      </div>

      {/* Active Card Top Deck Bar (Shown in Cards Mode) */}
      {mode === 'cards' && activeCard ? (
        <div className="bite-deck-top-bar">
          <div className="bite-deck-meta-row">
            <div className="bite-deck-badges">
              <span className="bite-card-counter-pill">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="bite-part-pill">
                Part {activeCard.partNumber} · {activeCard.partTitle}
              </span>
              <span className="bite-time-pill">⏱️ ~{activeCard.estMinutes} min read</span>
              {masteredIndices.length > 0 ? (
                <span className="bite-mastered-pill">
                  ✓ {masteredIndices.length}/{cards.length} Got It
                </span>
              ) : null}
            </div>

            <label className="bite-jump-select-wrap">
              <span className="sr-only">Jump to NCERT section</span>
              <select
                aria-label="Jump to NCERT section card"
                className="bite-jump-select"
                value={currentIndex}
                onChange={(e) => goToCard(Number(e.target.value), false)}
              >
                {cards.map((card) => (
                  <option key={card.sectionId} value={card.index}>
                    {masteredIndices.includes(card.index) ? '✓ ' : ''}
                    {card.index + 1}/{cards.length} · {card.optionLabel}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="bite-deck-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label={`Card ${currentIndex + 1} of ${cards.length}`}
          >
            <span style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : null}

      {/* Server-Rendered NCERT Sections Container */}
      <div ref={contentContainerRef} className="bite-notes-sections-host">
        {children}
      </div>

      {/* Active Card Bottom Navigation & Viral Share Footer (Shown in Cards Mode) */}
      {mode === 'cards' && activeCard ? (
        <div className="bite-deck-footer-bar">
          {isLastCard ? (
            <div className="bite-deck-complete-banner">
              <div>
                <strong>🎉 You reached the final card of {chapterTitle}!</strong>
                <span>
                  Lock this chapter into long-term memory with a 2-minute 5-Question Sprint or real 5-year CBSE PYQs below.
                </span>
              </div>
              <div className="bite-deck-complete-actions">
                {hasQuiz ? (
                  <Link href={`/chapters/${chapterSlug}/quiz`} className="bite-sprint-cta-btn">
                    ⚡ Start 5-Q Chapter Sprint &rarr;
                  </Link>
                ) : null}
                <a href="#board-exam-drill" className="bite-pyq-cta-btn">
                  🔥 Solve 5-Year Board PYQs &darr;
                </a>
              </div>
            </div>
          ) : null}

          <div className="bite-deck-nav-row">
            <button
              type="button"
              className="bite-nav-prev-btn"
              disabled={currentIndex === 0}
              onClick={() => goToCard(currentIndex - 1, true)}
            >
              &larr; Previous
            </button>

            <div className="bite-nav-center-actions">
              <button
                type="button"
                className="bite-whatsapp-card-btn"
                onClick={handleShareCardOnWhatsApp}
              >
                📲 Share Card on WhatsApp
              </button>
              <span className="bite-keyboard-hint">Use &larr; / &rarr; keys to flip</span>
            </div>

            <button
              type="button"
              className="bite-nav-next-btn"
              onClick={markGotItAndAdvance}
            >
              {isLastCard
                ? isCurrentMastered
                  ? '✓ All Cards Reviewed!'
                  : '✓ Mark Final Card Got It'
                : '✓ Got It · Next Card →'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
