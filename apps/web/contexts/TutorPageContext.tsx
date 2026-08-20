'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

export type TutorActiveItem = {
  id?: string;
  label?: string; // e.g. "Question 3" or "Section 2.2"
  title?: string; // e.g. "Quadratic Sum"
  prompt?: string; // Question text or problem prompt
  options?: string[];
  selectedAnswer?: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  explanation?: string;
  sectionExcerpt?: string;
};

export type TutorPageContextData = {
  pageType: 'quiz' | 'lesson_notes' | 'written_practice' | 'mistakes' | 'exam_paper' | 'dashboard' | 'general';
  pageUrl: string;
  pageTitle?: string;
  subject?: string;
  chapterSlug?: string;
  chapterTitle?: string;
  lessonSlug?: string;
  lessonTitle?: string;
  activeItem?: TutorActiveItem;
};

type TutorPageContextType = {
  context: TutorPageContextData;
  setPageContext: (updater: Partial<TutorPageContextData> | ((prev: TutorPageContextData) => TutorPageContextData)) => void;
  updateActiveItem: (item: TutorActiveItem | undefined) => void;
  quickPrompts: string[];
};

const defaultContext: TutorPageContextData = {
  pageType: 'general',
  pageUrl: '/',
  pageTitle: 'ChapterReady',
};

const TutorPageContext = createContext<TutorPageContextType>({
  context: defaultContext,
  setPageContext: () => {},
  updateActiveItem: () => {},
  quickPrompts: [],
});

function deriveFallbackContextFromPath(pathname: string): TutorPageContextData {
  const parts = pathname.split('/').filter(Boolean);
  
  if (parts[0] === 'chapters' && parts[1]) {
    const chapterSlug = parts[1];
    const formattedChapterTitle = chapterSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    if (parts[2] === 'quiz') {
      return {
        pageType: 'quiz',
        pageUrl: pathname,
        chapterSlug,
        chapterTitle: formattedChapterTitle,
        pageTitle: `${formattedChapterTitle} Quiz`,
      };
    }

    if (parts[2] === 'practice') {
      return {
        pageType: 'written_practice',
        pageUrl: pathname,
        chapterSlug,
        chapterTitle: formattedChapterTitle,
        pageTitle: `${formattedChapterTitle} Written Practice`,
      };
    }

    if (parts[2] === 'revision') {
      return {
        pageType: 'lesson_notes',
        pageUrl: pathname,
        chapterSlug,
        chapterTitle: formattedChapterTitle,
        pageTitle: `${formattedChapterTitle} Fast Revision`,
      };
    }

    if (parts[2]) {
      const lessonSlug = parts[2];
      const formattedLessonTitle = lessonSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return {
        pageType: 'lesson_notes',
        pageUrl: pathname,
        chapterSlug,
        chapterTitle: formattedChapterTitle,
        lessonSlug,
        lessonTitle: formattedLessonTitle,
        pageTitle: `${formattedChapterTitle} - ${formattedLessonTitle}`,
      };
    }

    return {
      pageType: 'lesson_notes',
      pageUrl: pathname,
      chapterSlug,
      chapterTitle: formattedChapterTitle,
      pageTitle: formattedChapterTitle,
    };
  }

  if (parts[0] === 'my-mistakes') {
    return {
      pageType: 'mistakes',
      pageUrl: pathname,
      pageTitle: 'My Mistakes Review',
    };
  }

  if (parts[0] === 'dashboard') {
    return {
      pageType: 'dashboard',
      pageUrl: pathname,
      pageTitle: 'Student Dashboard',
    };
  }

  if (parts[0] === 'exam-papers') {
    return {
      pageType: 'exam_paper',
      pageUrl: pathname,
      pageTitle: 'Board Exam Papers',
    };
  }

  return {
    pageType: 'general',
    pageUrl: pathname,
    pageTitle: typeof document !== 'undefined' ? document.title || 'ChapterReady' : 'ChapterReady',
  };
}

function deriveQuickPrompts(ctx: TutorPageContextData): string[] {
  if (ctx.pageType === 'quiz') {
    if (ctx.activeItem?.prompt) {
      if (ctx.activeItem.selectedAnswer && ctx.activeItem.isCorrect === false) {
        return [
          '🔍 Why is my selected answer incorrect?',
          '💡 Give me a step-by-step explanation for this question',
          '📖 What formula or concept applies here?',
        ];
      }
      return [
        '💡 Explain this question step-by-step',
        '🧠 Give me a hint to solve this',
        '📖 What NCERT concept is tested here?',
      ];
    }
    return [
      `💡 Help me revise ${ctx.chapterTitle ?? 'this chapter'} for the quiz`,
      '⚡ What are the key formulas to remember?',
      '🎯 What are high-yield questions for this chapter?',
    ];
  }

  if (ctx.pageType === 'lesson_notes') {
    if (ctx.activeItem?.title) {
      return [
        `✨ Explain "${ctx.activeItem.title}" simply with an example`,
        '🧠 How should I write this in CBSE board exams?',
        '❓ Test me on this concept with a quick question',
      ];
    }
    return [
      `✨ Summarize ${ctx.lessonTitle ?? ctx.chapterTitle ?? 'this lesson'} in 3 key points`,
      '💡 Give me a simple memory trick for this topic',
      '❓ Ask me a question to test my understanding',
    ];
  }

  if (ctx.pageType === 'written_practice') {
    return [
      '✍️ How should I structure my answer for full CBSE marks?',
      '💡 Give me a hint for this practice problem',
      '🔍 What are common mistakes students make here?',
    ];
  }

  if (ctx.pageType === 'mistakes') {
    return [
      '🎯 Help me fix my most frequent mistake',
      '💡 Give me a quick practice problem to test this rule',
      '📖 Summarize the concept I got wrong',
    ];
  }

  return [
    '✨ How can I plan my Class 10 revision today?',
    '🎯 What should I focus on for Mathematics and Science?',
    '💡 Ask me any doubt from your NCERT chapters',
  ];
}

export function TutorPageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [context, setContext] = useState<TutorPageContextData>(() =>
    deriveFallbackContextFromPath(pathname || '/'),
  );

  // Automatically update fallback when route changes
  useEffect(() => {
    setContext((prev) => {
      // If the URL changed, derive new base fallback context
      if (prev.pageUrl !== pathname) {
        return deriveFallbackContextFromPath(pathname || '/');
      }
      return prev;
    });
  }, [pathname]);

  const setPageContext = useCallback(
    (updater: Partial<TutorPageContextData> | ((prev: TutorPageContextData) => TutorPageContextData)) => {
      setContext((prev) => {
        if (typeof updater === 'function') {
          return updater(prev);
        }
        return {
          ...prev,
          ...updater,
        };
      });
    },
    [],
  );

  const updateActiveItem = useCallback((activeItem: TutorActiveItem | undefined) => {
    setContext((prev) => ({
      ...prev,
      activeItem,
    }));
  }, []);

  const quickPrompts = useMemo(() => deriveQuickPrompts(context), [context]);

  const value = useMemo(
    () => ({
      context,
      setPageContext,
      updateActiveItem,
      quickPrompts,
    }),
    [context, setPageContext, updateActiveItem, quickPrompts],
  );

  return <TutorPageContext.Provider value={value}>{children}</TutorPageContext.Provider>;
}

export function useTutorPageContext() {
  return useContext(TutorPageContext);
}
