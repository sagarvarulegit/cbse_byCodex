import assert from 'node:assert/strict';
import test from 'node:test';

import { getPilotChapterCards, PILOT_CHAPTER_SLUGS } from '../apps/web/lib/pilot.ts';

test('free pilot selects three end-to-end chapters', () => {
  assert.deepEqual(PILOT_CHAPTER_SLUGS, [
    'real-numbers',
    'chemical-reactions-and-equations',
    'two-stories-about-flying',
  ]);

  const cards = getPilotChapterCards();

  assert.equal(cards.length, 3);
  assert.deepEqual(
    cards.map((card) => ({
      chapterHref: card.chapterHref,
      notesHref: card.notesHref,
      quizHref: card.quizHref,
      slug: card.slug,
    })),
    [
      {
        chapterHref: '/chapters/real-numbers',
        notesHref: '/chapters/real-numbers/lessons/euclid-division-lemma',
        quizHref: '/chapters/real-numbers/quiz',
        slug: 'real-numbers',
      },
      {
        chapterHref: '/chapters/chemical-reactions-and-equations',
        notesHref: '/chapters/chemical-reactions-and-equations/notes',
        quizHref: '/chapters/chemical-reactions-and-equations/quiz',
        slug: 'chemical-reactions-and-equations',
      },
      {
        chapterHref: '/chapters/two-stories-about-flying',
        notesHref: '/chapters/two-stories-about-flying/notes',
        quizHref: '/chapters/two-stories-about-flying/quiz',
        slug: 'two-stories-about-flying',
      },
    ],
  );
});

test('pilot path tells students how to move from signup to progress review', () => {
  const [card] = getPilotChapterCards();

  assert.deepEqual(card.pathSteps, [
    { href: '/register', label: 'Register' },
    { href: '/subjects', label: 'Choose chapter' },
    { href: '/chapters/real-numbers/lessons/euclid-division-lemma', label: 'Study notes' },
    { href: '/chapters/real-numbers/quiz', label: 'Take quiz' },
    { href: '/dashboard', label: 'Review progress' },
  ]);
});
