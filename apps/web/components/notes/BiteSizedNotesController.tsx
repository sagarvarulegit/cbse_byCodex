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
  sectionIds: string[];
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

type BiteCardGroup = {
  meta: BiteCardMeta;
  elements: HTMLElement[];
};

const MASTERED_STORAGE_PREFIX = 'cbse:bite-cards-mastered:v2';

function getMasteredStorageKey(chapterSlug: string) {
  return `${MASTERED_STORAGE_PREFIX}:${chapterSlug}`;
}

function isSupportOrPracticeSection(secEl: HTMLElement): boolean {
  return (
    secEl.classList.contains('lesson-support-section') ||
    secEl.classList.contains('lesson-qa-card') ||
    secEl.classList.contains('lesson-practice-answer') ||
    secEl.classList.contains('comic-recap-card')
  );
}

function countWords(el: HTMLElement): number {
  return (el.textContent || '').trim().split(/\s+/).filter(Boolean).length;
}

export default function BiteSizedNotesController({
  chapterSlug,
  chapterTitle,
  hasQuiz,
  children,
}: BiteSizedNotesControllerProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const cardGroupsRef = useRef<BiteCardGroup[]>([]);
  const allSectionElementsRef = useRef<HTMLElement[]>([]);
  const partElementsRef = useRef<HTMLDetailsElement[]>([]);
  const savedOpenPartsRef = useRef<Set<string> | null>(null);
  const wasCardsModeRef = useRef(false);

  const [mode, setMode] = useState<NotesStudyMode>('textbook');
  const [cards, setCards] = useState<BiteCardMeta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredIndices, setMasteredIndices] = useState<number[]>([]);

  // Scan rendered NCERT sections inside .complete-chapter-part-body and group into cohesive Topic Cards
  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container) return;

    const partEls = Array.from(
      container.querySelectorAll<HTMLDetailsElement>('details.complete-chapter-part'),
    );
    partElementsRef.current = partEls;

    const allSecEls: HTMLElement[] = [];
    const groups: BiteCardGroup[] = [];

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
      if (directSections.length === 0) return;

      allSecEls.push(...directSections);

      let activePartGroup: {
        elements: HTMLElement[];
        sectionIds: string[];
        primarySection: HTMLElement;
        isShortIntroPendingMerge: boolean;
      } | null = null;

      const partLocalGroups: Array<{
        elements: HTMLElement[];
        sectionIds: string[];
        primarySection: HTMLElement;
      }> = [];

      directSections.forEach((secEl, secIdx) => {
        const secId = secEl.id || `${partId}-sec-${secIdx + 1}`;
        const isSupport = isSupportOrPracticeSection(secEl);
        const isNumberedConcept = secEl.classList.contains('concept-block--numbered');
        const words = countWords(secEl);

        if (!activePartGroup) {
          activePartGroup = {
            elements: [secEl],
            sectionIds: [secId],
            primarySection: secEl,
            isShortIntroPendingMerge: !isNumberedConcept && !isSupport && words < 65,
          };
          partLocalGroups.push(activePartGroup);
          return;
        }

        // Attach Board Tips, Common Mistakes, In-Text Q&As, Quick Practice, and Comic Recap to their parent Concept Card
        if (isSupport) {
          activePartGroup.elements.push(secEl);
          activePartGroup.sectionIds.push(secId);
          return;
        }

        // Merge tiny introductory lead-in (<65 words) into the immediately following numbered NCERT section
        if (activePartGroup.isShortIntroPendingMerge && isNumberedConcept) {
          activePartGroup.elements.push(secEl);
          activePartGroup.sectionIds.push(secId);
          activePartGroup.primarySection = secEl;
          activePartGroup.isShortIntroPendingMerge = false;
          return;
        }

        // Start a fresh Topic Card for each numbered NCERT section or standalone major concept block
        activePartGroup = {
          elements: [secEl],
          sectionIds: [secId],
          primarySection: secEl,
          isShortIntroPendingMerge: false,
        };
        partLocalGroups.push(activePartGroup);
      });

      partLocalGroups.forEach((grp) => {
        const cardIndex = groups.length;
        const primaryEl = grp.primarySection;
        const sectionId = primaryEl.id || grp.sectionIds[0] || `${partId}-card-${cardIndex + 1}`;

        const eyebrowEl = primaryEl.querySelector('.concept-eyebrow, .card-eyebrow');
        const headingEl = primaryEl.querySelector('h3, h2');
        const rawEyebrow = eyebrowEl?.textContent?.replace(/\s+/g, ' ').trim() || '';
        const rawHeading = headingEl?.textContent?.replace(/\s+/g, ' ').trim() || '';

        const eyebrow = rawEyebrow || `Part ${partNumber}`;
        const title = rawHeading || partTitle;

        const secNumMatch = rawEyebrow.match(/^Section\s+([\d.-]+)$/i);
        const optionLabel = secNumMatch
          ? `${secNumMatch[1]} ${title}`
          : rawHeading
            ? title
            : `Part ${partNumber} · ${partTitle}`;

        const totalWords = grp.elements.reduce((sum, el) => sum + countWords(el), 0);
        const estMinutes = Math.max(1, Math.min(5, Math.ceil(totalWords / 175)));

        const meta: BiteCardMeta = {
          index: cardIndex,
          partId,
          partNumber,
          partTitle,
          sectionId,
          sectionIds: grp.sectionIds,
          eyebrow,
          title,
          optionLabel,
          estMinutes,
        };

        groups.push({
          meta,
          elements: grp.elements,
        });
      });
    });

    allSectionElementsRef.current = allSecEls;
    cardGroupsRef.current = groups;
    const discoveredMeta = groups.map((g) => g.meta);
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
            (c) => c.sectionIds.includes(hashId) || c.partId === hashId,
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
    const allSecEls = allSectionElementsRef.current;
    const groups = cardGroupsRef.current;
    if (!container || partEls.length === 0 || groups.length === 0) return;

    if (mode === 'cards') {
      if (!wasCardsModeRef.current) {
        savedOpenPartsRef.current = new Set(
          partEls.filter((el) => el.open).map((el) => el.id),
        );
        wasCardsModeRef.current = true;
      }

      const safeIndex = Math.min(Math.max(0, currentIndex), groups.length - 1);
      const activeGroup = groups[safeIndex];
      const activeElementSet = new Set(activeGroup?.elements ?? []);
      const activePartEl = activeGroup?.elements[0]?.closest(
        'details.complete-chapter-part',
      ) as HTMLDetailsElement | null;

      partEls.forEach((partEl) => {
        if (partEl === activePartEl) {
          partEl.open = true;
          partEl.setAttribute('data-bite-part', 'active');
        } else {
          partEl.setAttribute('data-bite-part', 'hidden');
        }
      });

      allSecEls.forEach((secEl) => {
        secEl.setAttribute(
          'data-bite-card',
          activeElementSet.has(secEl) ? 'active' : 'hidden',
        );
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

      allSecEls.forEach((secEl) => {
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

  // Intercept sidebar contents clicks while in Bite-Sized Cards mode so clicking any topic opens its card
  useEffect(() => {
    if (mode !== 'cards' || cards.length === 0) return;

    function handleSidebarClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest(
        '.complete-chapter-sidebar a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute('href')?.replace(/^#/, '') || '';
      if (!hash || hash === 'board-exam-drill') {
        return;
      }

      if (hash === 'introduction') {
        event.preventDefault();
        goToCard(0, true);
        return;
      }

      const matchedIdx = cards.findIndex(
        (c) => c.sectionIds.includes(hash) || c.partId === hash,
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
      message: `📚 Quick 2-min CBSE Class 10 topic card on *${chapterTitle}* (${activeCard.optionLabel})! Read 1 card & test yourself 👇\n${cardShareUrl}`,
    });
  }

  return (
    <div
      ref={shellRef}
      className="bite-sized-notes-shell"
      data-notes-mode={mode}
    >
      {/* Prominent Study Mode Switcher — Flush at top of left column */}
      <div className="bite-mode-switcher-bar" role="region" aria-label="Notes study mode switcher">
        <div className="bite-mode-switcher-copy">
          <span className="bite-mode-kicker">🧠 CHOOSE HOW YOU STUDY</span>
          <strong>
            {mode === 'cards'
              ? `⚡ Bite-Sized Topic Cards (${cards.length} NCERT Topics)`
              : 'Skip the Long Scroll — Flip 1 Topic Card at a Time'}
          </strong>
          <span>
            {mode === 'cards'
              ? 'Each card bundles one NCERT section with its diagrams, tips & quick check.'
              : `Study this chapter in ${cards.length || 'focused'} bite-sized ~2-min NCERT topic cards instead of one long scroll.`}
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
                Topic {currentIndex + 1} of {cards.length}
              </span>
              <span className="bite-part-pill">
                Part {activeCard.partNumber}
              </span>
              <span className="bite-time-pill">⏱️ ~{activeCard.estMinutes} min</span>
              {masteredIndices.length > 0 ? (
                <span className="bite-mastered-pill">
                  ✓ {masteredIndices.length}/{cards.length} Mastered
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
                  <option key={`${card.partId}-${card.index}`} value={card.index}>
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
            aria-label={`Topic ${currentIndex + 1} of ${cards.length}`}
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
                <strong>🎉 You completed all {cards.length} Topic Cards in {chapterTitle}!</strong>
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
                📲 Share Topic on WhatsApp
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
                  ? '✓ All Topics Reviewed!'
                  : '✓ Mark Final Topic Got It'
                : '✓ Got It · Next Topic →'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
