'use client';

import { useEffect } from 'react';

export default function SectionFocusHandler() {
  useEffect(() => {
    function scrollToTargetSection(): HTMLElement | null {
      const rawHash = window.location.hash ? window.location.hash.slice(1).trim() : '';
      if (!rawHash) {
        return null;
      }

      const decodedHash = decodeURIComponent(rawHash);
      if (
        decodedHash === 'introduction' ||
        decodedHash === 'chapter-notes' ||
        decodedHash === 'top'
      ) {
        return null;
      }

      // 1. Try exact element ID match
      let targetElement = document.getElementById(decodedHash);

      // 2. Try prefix/suffix ID match in content (e.g. id="chapter-pack-4-2-italy-unified" matching "italy" or "4-2-italy")
      if (!targetElement) {
        const normalizedTarget = decodedHash.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const elementsWithId = Array.from(
          document.querySelectorAll<HTMLElement>(
            '.complete-chapter-sections [id], .lesson-prose [id], [id^="chapter-pack-"], [id^="lesson-"]',
          ),
        );

        targetElement =
          elementsWithId.find((el) => {
            const elId = el.id.toLowerCase();
            return (
              elId.includes(normalizedTarget) ||
              normalizedTarget.includes(elId.replace(/^(chapter-pack|lesson)-/, ''))
            );
          }) ?? null;

        // 3. Fallback: Search headings by text content (h1, h2, h3, h4)
        if (!targetElement) {
          const targetWords = decodedHash
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, ' ')
            .split(' ')
            .filter((w) => w.length > 2);

          const headings = Array.from(
            document.querySelectorAll<HTMLElement>(
              '.lesson-prose h2, .lesson-prose h3, .lesson-prose h4, .complete-chapter-part-header h2',
            ),
          );

          let bestHeading: HTMLElement | null = null;
          let bestScore = 0;

          for (const heading of headings) {
            const headingText = heading.textContent ? heading.textContent.toLowerCase() : '';
            let score = 0;
            for (const word of targetWords) {
              if (headingText.includes(word)) {
                score += word.length * 2;
              }
            }
            if (score > bestScore) {
              bestScore = score;
              bestHeading = heading;
            }
          }

          if (bestHeading) {
            targetElement = bestHeading.closest('section') || bestHeading;
          }
        }
      }

      if (targetElement) {
        // Accordion parts render collapsed: reveal the target's part first so
        // sidebar links and deep links land on visible content, then scroll.
        let ancestorNode: HTMLElement | null = targetElement;
        while (ancestorNode) {
          const closedPart = ancestorNode.closest?.(
            'details[data-part]:not([open])',
          ) as HTMLDetailsElement | null;
          if (!closedPart) {
            break;
          }
          closedPart.open = true;
          ancestorNode = closedPart.parentElement;
        }
        // Instant jump: a fresh page landing must not animate across the
        // whole chapter, and smooth scrolling is unreliable mid-stream.
        targetElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        targetElement.classList.remove('section-focus-pulse');
        // Trigger DOM reflow so animation restarts cleanly
        void targetElement.offsetWidth;
        targetElement.classList.add('section-focus-pulse');

        setTimeout(() => {
          if (targetElement) {
            targetElement.classList.remove('section-focus-pulse');
          }
        }, 3800);
      }
      return targetElement;
    }

    // Chapter content streams in late, so watch the DOM until the target is
    // actually on screen. Manual scrolling settles the loop to respect intent.
    // A zero-size rect means "not laid out yet" — never treat it as visible.
    let settled = false;
    let safetyTimer = 0;
    let recheckTimer = 0;
    let pollTimer = 0;
    let observer: MutationObserver | null = null;

    function isInView(target: HTMLElement) {
      const rect = target.getBoundingClientRect();
      return (
        rect.height > 0 &&
        rect.top >= -240 &&
        rect.top <= window.innerHeight * 0.6
      );
    }

    function cleanup() {
      observer?.disconnect();
      observer = null;
      window.clearTimeout(safetyTimer);
      window.clearTimeout(recheckTimer);
      window.clearInterval(pollTimer);
    }

    function attempt() {
      if (settled) {
        return;
      }
      const target = scrollToTargetSection();
      if (target && isInView(target)) {
        settled = true;
        cleanup();
        // Late images and fonts shift layout after the first scroll lands.
        // Correct once more unless the student has taken over scrolling.
        recheckTimer = window.setTimeout(() => {
          const current = document.getElementById(target.id);
          if (current && !isInView(current)) {
            settled = false;
            rearm();
          }
        }, 1500);
      }
    }

    function rearm() {
      cleanup();
      settled = false;
      observer = new MutationObserver(attempt);
      observer.observe(document.body, { childList: true, subtree: true });
      // Layout (images, fonts) can finish without any DOM mutation.
      pollTimer = window.setInterval(attempt, 500);
      safetyTimer = window.setTimeout(() => {
        settled = true;
        cleanup();
      }, 15000);
      attempt();
    }

    function handleUserScroll() {
      settled = true;
      cleanup();
    }

    rearm();
    window.addEventListener('hashchange', rearm);
    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });

    return () => {
      settled = true;
      cleanup();
      window.removeEventListener('hashchange', rearm);
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
    };
  }, []);

  return null;
}
