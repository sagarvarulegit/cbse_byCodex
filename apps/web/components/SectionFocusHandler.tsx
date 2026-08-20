'use client';

import { useEffect } from 'react';

export default function SectionFocusHandler() {
  useEffect(() => {
    function scrollToTargetSection() {
      const rawHash = window.location.hash ? window.location.hash.slice(1).trim() : '';
      if (!rawHash) {
        return;
      }

      const decodedHash = decodeURIComponent(rawHash);
      if (
        decodedHash === 'introduction' ||
        decodedHash === 'chapter-notes' ||
        decodedHash === 'top'
      ) {
        return;
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
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
    }

    // Run slightly after mount to account for Next.js layout rendering
    const timer = setTimeout(scrollToTargetSection, 300);
    window.addEventListener('hashchange', scrollToTargetSection);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('hashchange', scrollToTargetSection);
    };
  }, []);

  return null;
}
