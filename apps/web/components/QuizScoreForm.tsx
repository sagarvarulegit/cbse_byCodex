'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useTutorPageContext } from '../contexts/TutorPageContext';
import type { QuizAttemptHistory, QuizAttemptSummary } from '../lib/quiz-attempts';
import { buildQuizRecoveryMessage, getWeakTopicLabels } from '../lib/quiz-recovery';
import { buildChallengeUrl } from '../lib/whatsapp-share';
import { trackAnalyticsEvent } from '../lib/analytics';
import MathText from './MathText';
import WhatsAppChallengeBar from './WhatsAppChallengeBar';

type WeakTopicOption = {
  label: string;
  slug: string;
};

type QuizOption = {
  label: string;
  value: number;
};

type QuizQuestion = {
  correctOptionIndex: number;
  difficulty?: string;
  explanation?: string;
  id: string;
  options: QuizOption[];
  prompt: string;
  sourceCoverage?: string;
  title: string;
  topicSlug?: string;
  topicTags?: string[];
};

type QuizScoreFormProps = {
  chapterSlug: string;
  chapterTitle?: string;
  initialAttemptHistory: QuizAttemptHistory;
  questions: QuizQuestion[];
  studentFirstName?: string;
  weakTopicOptions: WeakTopicOption[];
};

type QuizProgressResponse = {
  attempt?: QuizAttemptSummary;
  gamification?: {
    awardedBadges?: Array<{
      code: string;
      description: string;
      name: string;
    }>;
    streak?: {
      currentStreakDays?: number;
      longestStreakDays?: number;
    };
  };
  mastery?: {
    masteryScore?: number;
  };
  message?: string;
  revisionMission?:
    | {
        id: string;
        recommendedActions?: Array<{
          href: string;
          label: string;
          step: string;
        }>;
        recommendedSteps?: string[];
        state: 'created' | 'refreshed' | 'completed';
        targetScore?: number;
      }
    | {
        mission: null;
        state: 'not_needed';
      }
    | null;
};

type RecoveryMissionState = NonNullable<QuizProgressResponse['revisionMission']>;

type RecoveryResult = {
  mission: RecoveryMissionState | null;
  weakTopicLabels: string[];
} | null;

type GamificationResult = {
  awardedBadges: Array<{
    code: string;
    description: string;
    name: string;
  }>;
  streak: {
    currentStreakDays: number;
    longestStreakDays: number;
  } | null;
};

const SPRINT_SIZE = 5;

function buildAttemptHistory(
  attempts: QuizAttemptSummary[],
  currentHistory: QuizAttemptHistory,
): QuizAttemptHistory {
  const attemptsByNumber = new Map<number, QuizAttemptSummary>();
  for (const attempt of attempts) {
    const existingAttempt = attemptsByNumber.get(attempt.attemptNumber);
    if (
      !existingAttempt ||
      new Date(attempt.createdAt).getTime() >= new Date(existingAttempt.createdAt).getTime()
    ) {
      attemptsByNumber.set(attempt.attemptNumber, attempt);
    }
  }

  const sortedAttempts = Array.from(attemptsByNumber.values()).sort((left, right) => {
    if (left.attemptNumber !== right.attemptNumber) {
      return right.attemptNumber - left.attemptNumber;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
  const [latestAttempt] = sortedAttempts;
  const [bestAttempt] = [...sortedAttempts].sort((left, right) => {
    if (left.scorePercent !== right.scorePercent) {
      return right.scorePercent - left.scorePercent;
    }

    return right.attemptNumber - left.attemptNumber;
  });

  return {
    ...currentHistory,
    attempts: sortedAttempts,
    stats: {
      attemptCount: sortedAttempts.length,
      bestAttemptNumber: bestAttempt?.attemptNumber ?? null,
      bestScorePercent: bestAttempt?.scorePercent ?? null,
      latestAttemptNumber: latestAttempt?.attemptNumber ?? null,
      latestScorePercent: latestAttempt?.scorePercent ?? null,
    },
  };
}

function formatAttemptDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Saved';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

export default function QuizScoreForm({
  chapterSlug,
  chapterTitle,
  initialAttemptHistory,
  questions,
  studentFirstName,
  weakTopicOptions,
}: QuizScoreFormProps) {
  const [quizMode, setQuizMode] = useState<'sprint' | 'sheet'>('sprint');
  const [sprintBatch, setSprintBatch] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptHistory, setAttemptHistory] = useState(initialAttemptHistory);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [needsGuestSavePrompt, setNeedsGuestSavePrompt] = useState(false);
  const [focusedQuestionIndex, setFocusedQuestionIndex] = useState(0);

  // Incoming WhatsApp challenge query params (?challengeBy=...&beat=...)
  const [challengerName, setChallengerName] = useState<string | null>(null);
  const [challengerScore, setChallengerScore] = useState<number | null>(null);

  const { setPageContext } = useTutorPageContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const by = params.get('challengeBy');
    const beat = params.get('beat');
    if (by && by.trim()) {
      setChallengerName(by.trim().slice(0, 32));
    }
    if (beat) {
      const parsed = parseInt(beat, 10);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        setChallengerScore(parsed);
      }
    }
  }, []);

  const totalBatches = Math.max(1, Math.ceil(questions.length / SPRINT_SIZE));

  // Active question slice depending on mode
  const activeQuestions = useMemo(() => {
    if (quizMode === 'sheet') {
      return questions;
    }
    const start = sprintBatch * SPRINT_SIZE;
    const slice = questions.slice(start, start + SPRINT_SIZE);
    return slice.length > 0 ? slice : questions.slice(0, SPRINT_SIZE);
  }, [questions, quizMode, sprintBatch]);

  const totalQuestions = activeQuestions.length;
  const answeredCount = useMemo(
    () => activeQuestions.filter((q) => selectedAnswers[q.id] !== undefined).length,
    [activeQuestions, selectedAnswers],
  );
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  const currentSprintQuestion = activeQuestions[stepIndex] ?? activeQuestions[0];

  // Sync active quiz question context with Tara AI Tutor
  useEffect(() => {
    const activeQuestion =
      quizMode === 'sprint'
        ? currentSprintQuestion
        : activeQuestions[focusedQuestionIndex] || activeQuestions[0];
    if (!activeQuestion) return;

    const selectedOptionIndex = selectedAnswers[activeQuestion.id];
    const selectedOption =
      selectedOptionIndex !== undefined ? activeQuestion.options[selectedOptionIndex] : undefined;
    const correctOption = activeQuestion.options[activeQuestion.correctOptionIndex];
    const isCorrect =
      selectedOptionIndex !== undefined
        ? selectedOptionIndex === activeQuestion.correctOptionIndex
        : undefined;
    const canShowAnswer = quizMode === 'sprint' ? selectedOptionIndex !== undefined : hasSubmitted;

    setPageContext({
      pageType: 'quiz',
      pageUrl: `/chapters/${chapterSlug}/quiz`,
      chapterSlug,
      activeItem: {
        id: activeQuestion.id,
        label: `Question ${(quizMode === 'sprint' ? stepIndex : focusedQuestionIndex) + 1} of ${activeQuestions.length}`,
        title: activeQuestion.title,
        prompt: activeQuestion.prompt,
        options: activeQuestion.options.map((o) => `${o.value}. ${o.label}`),
        selectedAnswer: selectedOption ? `${selectedOption.value}. ${selectedOption.label}` : undefined,
        correctAnswer: canShowAnswer && correctOption ? `${correctOption.value}. ${correctOption.label}` : undefined,
        isCorrect,
        explanation: canShowAnswer ? activeQuestion.explanation : undefined,
      },
    });
  }, [
    activeQuestions,
    chapterSlug,
    currentSprintQuestion,
    focusedQuestionIndex,
    hasSubmitted,
    quizMode,
    selectedAnswers,
    setPageContext,
    stepIndex,
  ]);

  const correctAnswers = useMemo(
    () =>
      activeQuestions.reduce((total, question) => {
        return selectedAnswers[question.id] === question.correctOptionIndex ? total + 1 : total;
      }, 0),
    [activeQuestions, selectedAnswers],
  );

  const scorePercent = useMemo(() => {
    if (totalQuestions <= 0) {
      return 0;
    }
    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const weakTopicSlugs = useMemo(() => {
    const slugs = activeQuestions
      .filter((question) => selectedAnswers[question.id] !== undefined)
      .filter((question) => selectedAnswers[question.id] !== question.correctOptionIndex)
      .map((question, index) => question.topicSlug ?? weakTopicOptions[index]?.slug)
      .filter((slug): slug is string => Boolean(slug));

    return Array.from(new Set(slugs));
  }, [activeQuestions, selectedAnswers, weakTopicOptions]);

  const weakTopicLabels = useMemo(
    () => getWeakTopicLabels(weakTopicSlugs, weakTopicOptions),
    [weakTopicSlugs, weakTopicOptions],
  );
  const weakTopicLabelBySlug = useMemo(
    () => new Map(weakTopicOptions.map((topic) => [topic.slug, topic.label])),
    [weakTopicOptions],
  );
  const visibleAttempts = attemptHistory.attempts.slice(0, 5);
  const recoveryAction =
    recoveryResult?.mission && 'recommendedActions' in recoveryResult.mission
      ? recoveryResult.mission.recommendedActions?.[0]
      : undefined;

  function selectAnswer(questionId: string, optionIndex: number) {
    if (hasSubmitted) {
      return;
    }
    // In Quick Sprint mode, lock individual question once tapped so instant feedback feels crisp & fair
    if (quizMode === 'sprint' && selectedAnswers[questionId] !== undefined) {
      return;
    }

    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));

    trackAnalyticsEvent('chapter_quiz_answer_tap', {
      chapter_slug: chapterSlug,
      mode: quizMode,
      question_id: questionId,
    });
  }

  async function saveAndFinishQuiz() {
    setErrorMessage(null);
    setGamificationResult(null);
    setRecoveryResult(null);
    setResultMessage(null);
    setNeedsGuestSavePrompt(false);

    if (!isComplete) {
      setErrorMessage(`Answer all ${totalQuestions} questions in this set before finishing.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/progress/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterSlug,
          correctAnswers,
          questionResults: activeQuestions.map((question) => {
            const selectedOptionIndex = selectedAnswers[question.id];
            const topicSlug = question.topicSlug ?? null;
            return {
              correctAnswer: question.options[question.correctOptionIndex]?.label ?? 'Correct option',
              explanation: question.explanation ?? null,
              isCorrect: selectedOptionIndex === question.correctOptionIndex,
              prompt: question.prompt,
              questionId: question.id,
              selectedAnswer: question.options[selectedOptionIndex]?.label ?? 'No answer',
              title: question.title,
              topicLabel: topicSlug ? weakTopicLabelBySlug.get(topicSlug) ?? null : null,
              topicSlug,
            };
          }),
          scorePercent,
          totalQuestions,
          weakTopicSlugs,
        }),
      });

      // Guest flow: celebrate score immediately and offer 15-sec signup to save XP & Mistake Vault!
      if (response.status === 401) {
        setHasSubmitted(true);
        setNeedsGuestSavePrompt(true);
        setResultMessage(
          `You scored ${correctAnswers}/${totalQuestions} (${scorePercent}%)! Create a free account to save your XP streak & Mistake Vault.`,
        );
        return;
      }

      const data = (await response.json().catch(() => null)) as QuizProgressResponse | null;

      if (!response.ok) {
        setHasSubmitted(true);
        setErrorMessage(data?.message ?? 'Score calculated locally (sync unavailable right now).');
        return;
      }

      const masteryScore = data?.mastery?.masteryScore ?? scorePercent;
      const awardedBadges = data?.gamification?.awardedBadges ?? [];
      const streak = data?.gamification?.streak?.currentStreakDays
        ? {
            currentStreakDays: data.gamification.streak.currentStreakDays,
            longestStreakDays:
              data.gamification.streak.longestStreakDays ?? data.gamification.streak.currentStreakDays,
          }
        : null;

      setAttemptHistory((currentHistory) => {
        const savedAttempt = data?.attempt ?? {
          attemptNumber: (currentHistory.stats.latestAttemptNumber ?? 0) + 1,
          correctAnswers,
          createdAt: new Date().toISOString(),
          scorePercent,
          totalQuestions,
          weakTopicSlugs,
        };

        return buildAttemptHistory([savedAttempt, ...currentHistory.attempts], currentHistory);
      });
      setHasSubmitted(true);
      setGamificationResult({ awardedBadges, streak });
      setRecoveryResult({ mission: data?.revisionMission ?? null, weakTopicLabels });
      setResultMessage(
        buildQuizRecoveryMessage({ masteryScore, revisionMission: data?.revisionMission }),
      );
    } catch {
      setHasSubmitted(true);
      setErrorMessage('Score calculated! (Offline — sign in or refresh later to sync).');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitQuizScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveAndFinishQuiz();
  }

  function startNewAttempt(nextBatch?: number) {
    setSelectedAnswers({});
    setErrorMessage(null);
    setGamificationResult(null);
    setRecoveryResult(null);
    setResultMessage(null);
    setHasSubmitted(false);
    setNeedsGuestSavePrompt(false);
    setStepIndex(0);
    if (typeof nextBatch === 'number') {
      setSprintBatch(nextBatch);
    }
  }

  function handleModeSwitch(nextMode: 'sprint' | 'sheet') {
    if (nextMode === quizMode) return;
    setQuizMode(nextMode);
    setStepIndex(0);
    setHasSubmitted(false);
    setErrorMessage(null);
    setResultMessage(null);
  }

  const displayChapterName = chapterTitle || chapterSlug.replace(/-/g, ' ');
  const sharerName = studentFirstName || 'Your classmate';
  const challengeUrl = buildChallengeUrl(`/chapters/${chapterSlug}/quiz`, {
    challengeBy: studentFirstName || undefined,
    beat: scorePercent,
  });
  const challengeShareText = `🔥 ${sharerName} scored ${correctAnswers}/${totalQuestions} (${scorePercent}%) on CBSE Class 10 ${displayChapterName}!\nCan you beat this score in 2 minutes? (Zero login needed):\n${challengeUrl}`;

  return (
    <form className="interactive-quiz-form" onSubmit={submitQuizScore}>
      <div className="quiz-main-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Incoming WhatsApp Challenge Banner */}
        {challengerName && (
          <div className="incoming-challenge-banner" role="status">
            <span className="challenge-fire">🔥 FRIEND CHALLENGE</span>
            <div>
              <strong>
                Can you beat {challengerName}
                {challengerScore !== null ? `’s ${challengerScore}% score` : ''} in {displayChapterName}?
              </strong>
              <span>Finish this 5-question sprint in 2 minutes to see who wins!</span>
            </div>
          </div>
        )}

        {/* Mode Switcher Header */}
        <div className="quiz-intro-card quiz-mode-header">
          <div>
            <p className="eyebrow">
              {quizMode === 'sprint'
                ? `⚡ 2-Minute Quick Sprint · Set ${sprintBatch + 1} of ${totalBatches}`
                : `📋 Full Practice Sheet · ${totalQuestions} Questions`}
            </p>
            <h2>
              {quizMode === 'sprint'
                ? 'Tap an option for instant CBSE check'
                : 'Select your answers'}
            </h2>
          </div>

          <div className="quiz-mode-controls">
            <div className="quiz-mode-toggle" role="tablist" aria-label="Quiz mode">
              <button
                type="button"
                role="tab"
                aria-selected={quizMode === 'sprint'}
                className={`mode-pill ${quizMode === 'sprint' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('sprint')}
              >
                ⚡ 5-Q Sprint (Instant)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={quizMode === 'sheet'}
                className={`mode-pill ${quizMode === 'sheet' ? 'active' : ''}`}
                onClick={() => handleModeSwitch('sheet')}
              >
                📋 All {questions.length} Qs
              </button>
            </div>
            <div className="quiz-progress-chip" aria-live="polite">
              {answeredCount}/{totalQuestions} answered · ✨ {correctAnswers * 10} XP
            </div>
          </div>
        </div>

        {/* =========================================================
            MODE A: DUOLINGO-STYLE 1-AT-A-TIME SPRINT STEPPER
           ========================================================= */}
        {quizMode === 'sprint' && currentSprintQuestion && !hasSubmitted ? (
          <div className="sprint-stepper-shell">
            {/* Visual Step Dots */}
            <div className="sprint-step-dots" role="tablist" aria-label="Sprint questions">
              {activeQuestions.map((q, idx) => {
                const ans = selectedAnswers[q.id];
                const isAnswered = ans !== undefined;
                const isRight = isAnswered && ans === q.correctOptionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setStepIndex(idx)}
                    className={[
                      'sprint-dot',
                      idx === stepIndex ? 'active' : '',
                      isAnswered ? (isRight ? 'right' : 'wrong') : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {(() => {
              const question = currentSprintQuestion;
              const selectedOptionIndex = selectedAnswers[question.id];
              const isAnswered = selectedOptionIndex !== undefined;
              const isCorrect = selectedOptionIndex === question.correctOptionIndex;
              const metadataChips = [
                question.difficulty ? `Difficulty: ${question.difficulty}` : null,
                question.sourceCoverage ? `Source: ${question.sourceCoverage}` : null,
                ...(question.topicTags ?? []).map((topicTag) => `Topic: ${topicTag}`),
              ].filter((chip): chip is string => Boolean(chip));

              return (
                <fieldset
                  className="quiz-question-card sprint-active-card"
                  id={`quiz-question-${question.id}`}
                  key={question.id}
                >
                  <legend>
                    <span>
                      Question {stepIndex + 1} of {totalQuestions}
                    </span>
                    {isAnswered ? (
                      <strong className={isCorrect ? 'correct' : 'incorrect'}>
                        {isCorrect ? '🎉 +10 XP Correct!' : '💡 Board Trap'}
                      </strong>
                    ) : null}
                  </legend>

                  <h3>{question.title}</h3>
                  {metadataChips.length > 0 ? (
                    <div className="quiz-question-meta">
                      {metadataChips.map((chip) => (
                        <span key={chip}>{chip}</span>
                      ))}
                    </div>
                  ) : null}

                  <p className="sprint-prompt-text">
                    <MathText text={question.prompt} />
                  </p>

                  <div className="quiz-option-list">
                    {question.options.map((option, optionIndex) => {
                      const inputId = `sprint-${question.id}-${optionIndex}`;
                      const isSelected = selectedOptionIndex === optionIndex;
                      const shouldRevealCorrect =
                        isAnswered && optionIndex === question.correctOptionIndex;
                      const shouldRevealWrong = isAnswered && isSelected && !shouldRevealCorrect;

                      return (
                        <label
                          className={[
                            'quiz-option',
                            isSelected ? 'selected' : '',
                            shouldRevealCorrect ? 'correct' : '',
                            shouldRevealWrong ? 'incorrect' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          htmlFor={inputId}
                          key={option.value}
                        >
                          <input
                            checked={isSelected}
                            disabled={isAnswered}
                            id={inputId}
                            name={question.id}
                            onChange={() => selectAnswer(question.id, optionIndex)}
                            type="radio"
                            value={option.value}
                          />
                          <span className="quiz-option-badge">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <strong className="quiz-option-text">
                            <MathText text={option.label} />
                          </strong>
                        </label>
                      );
                    })}
                  </div>

                  {/* Instant Micro-Feedback Box */}
                  {isAnswered && (
                    <div className={`sprint-instant-feedback ${isCorrect ? 'good' : 'trap'}`}>
                      <strong>
                        {isCorrect
                          ? '✅ Awesome recall! Locked in +10 XP.'
                          : '💡 Almost! Here is the NCERT concept to remember:'}
                      </strong>
                      {question.explanation ? (
                        <p>
                          <MathText text={question.explanation} />
                        </p>
                      ) : null}

                      <div className="sprint-nav-actions">
                        {stepIndex + 1 < totalQuestions ? (
                          <button
                            type="button"
                            className="sprint-next-btn"
                            onClick={() => setStepIndex((prev) => prev + 1)}
                          >
                            Next Question ({stepIndex + 2}/{totalQuestions}) →
                          </button>
                        ) : isComplete ? (
                          <button
                            type="button"
                            className="sprint-finish-btn"
                            disabled={isSubmitting}
                            onClick={() => void saveAndFinishQuiz()}
                          >
                            {isSubmitting
                              ? 'Calculating Result...'
                              : '🏆 Finish Sprint & Claim XP →'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="sprint-next-btn"
                            onClick={() => {
                              const firstUnanswered = activeQuestions.findIndex(
                                (q) => selectedAnswers[q.id] === undefined,
                              );
                              if (firstUnanswered >= 0) setStepIndex(firstUnanswered);
                            }}
                          >
                            Jump to Unanswered Question →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!isAnswered && (
                    <div className="sprint-skip-row">
                      {stepIndex > 0 && (
                        <button
                          type="button"
                          className="sprint-ghost-nav"
                          onClick={() => setStepIndex((prev) => prev - 1)}
                        >
                          ← Previous
                        </button>
                      )}
                      {stepIndex + 1 < totalQuestions && (
                        <button
                          type="button"
                          className="sprint-ghost-nav"
                          onClick={() => setStepIndex((prev) => prev + 1)}
                        >
                          Skip for now →
                        </button>
                      )}
                    </div>
                  )}
                </fieldset>
              );
            })()}
          </div>
        ) : null}

        {/* =========================================================
            SPRINT CELEBRATION & FRIEND CHALLENGE SCORECARD
           ========================================================= */}
        {quizMode === 'sprint' && hasSubmitted ? (
          <div className="sprint-summary-celebration">
            <div className="sprint-summary-top">
              <span className="sprint-trophy">
                {scorePercent >= 80 ? '🏆' : scorePercent >= 50 ? '⚡' : '💪'}
              </span>
              <div>
                <span className="sprint-complete-pill">SPRINT COMPLETE</span>
                <h2>
                  You scored {correctAnswers}/{totalQuestions} ({scorePercent}%)!
                </h2>
                {challengerName && challengerScore !== null ? (
                  <p className="challenger-verdict">
                    {scorePercent > challengerScore
                      ? `🔥 You BEAT ${challengerName}'s ${challengerScore}% score! Send back a rematch!`
                      : scorePercent === challengerScore
                        ? `🤝 Dead tie with ${challengerName} (${challengerScore}%)! Play Set 2 to break the tie!`
                        : `⚡ Close! ${challengerName} got ${challengerScore}%. Play another sprint to beat them!`}
                  </p>
                ) : (
                  <p className="challenger-verdict">
                    Earned <strong>+{Math.max(10, correctAnswers * 10)} XP</strong> in{' '}
                    {displayChapterName}.
                  </p>
                )}
              </div>
            </div>

            {needsGuestSavePrompt && (
              <div className="guest-save-prompt">
                <div>
                  <strong>💾 Don&apos;t lose your {scorePercent}% score &amp; Mistake Vault!</strong>
                  <p>Create your free Class 10 account in 15 seconds to track board readiness.</p>
                </div>
                <Link
                  href={`/register?next=${encodeURIComponent(`/chapters/${chapterSlug}/quiz`)}`}
                  className="guest-save-btn"
                >
                  Save Score Free →
                </Link>
              </div>
            )}

            <WhatsAppChallengeBar
              headline={`Dare a classmate to beat ${scorePercent}% in ${displayChapterName}!`}
              subtext="Opens directly into a 2-minute 5-question sprint on their phone—zero login wall."
              shareMessage={challengeShareText}
              surface="chapter_quiz_sprint"
              chapterSlug={chapterSlug}
            />

            <div className="sprint-next-batch-row">
              {sprintBatch + 1 < totalBatches && (
                <button
                  type="button"
                  className="sprint-next-set-btn"
                  onClick={() => startNewAttempt(sprintBatch + 1)}
                >
                  🔥 Play Next 5 Questions (Set {sprintBatch + 2}/{totalBatches}) →
                </button>
              )}
              <button
                type="button"
                className="sprint-retry-btn"
                onClick={() => startNewAttempt(sprintBatch)}
              >
                🔄 Retry This Set
              </button>
              <Link href={`/formula-cheatsheets?chapter=${chapterSlug}`} className="sprint-sheet-link">
                ⚡ Open 1-Page Formula Sheet
              </Link>
            </div>
          </div>
        ) : null}

        {/* =========================================================
            MODE B: FULL PRACTICE SHEET (OR REVIEW AFTER SPRINT)
           ========================================================= */}
        {(quizMode === 'sheet' || hasSubmitted) && (
          <div className="quiz-question-list">
            {activeQuestions.map((question, questionIndex) => {
              const selectedOptionIndex = selectedAnswers[question.id];
              const isAnswered = selectedOptionIndex !== undefined;
              const isCorrect = selectedOptionIndex === question.correctOptionIndex;
              const metadataChips = [
                question.difficulty ? `Difficulty: ${question.difficulty}` : null,
                question.sourceCoverage ? `Source: ${question.sourceCoverage}` : null,
                ...(question.topicTags ?? []).map((topicTag) => `Topic: ${topicTag}`),
              ].filter((chip): chip is string => Boolean(chip));

              return (
                <fieldset
                  className="quiz-question-card"
                  id={`quiz-question-${question.id}`}
                  key={question.id}
                  onClick={() => setFocusedQuestionIndex(questionIndex)}
                  onFocus={() => setFocusedQuestionIndex(questionIndex)}
                >
                  <legend>
                    <span>Question {questionIndex + 1}</span>
                    {hasSubmitted && isAnswered ? (
                      <strong className={isCorrect ? 'correct' : 'incorrect'}>
                        {isCorrect ? 'Correct' : 'Review'}
                      </strong>
                    ) : null}
                  </legend>
                  <h3>{question.title}</h3>
                  {metadataChips.length > 0 ? (
                    <div
                      className="quiz-question-meta"
                      aria-label={`Question ${questionIndex + 1} metadata`}
                    >
                      {metadataChips.map((chip) => (
                        <span key={chip}>{chip}</span>
                      ))}
                    </div>
                  ) : null}
                  <p>
                    <MathText text={question.prompt} />
                  </p>
                  <div className="quiz-option-list">
                    {question.options.map((option, optionIndex) => {
                      const inputId = `${question.id}-${optionIndex}`;
                      const isSelected = selectedOptionIndex === optionIndex;
                      const shouldRevealCorrect =
                        hasSubmitted && optionIndex === question.correctOptionIndex;
                      const shouldRevealWrong =
                        hasSubmitted && isSelected && !shouldRevealCorrect;

                      return (
                        <label
                          className={[
                            'quiz-option',
                            isSelected ? 'selected' : '',
                            shouldRevealCorrect ? 'correct' : '',
                            shouldRevealWrong ? 'incorrect' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          htmlFor={inputId}
                          key={option.value}
                        >
                          <input
                            checked={isSelected}
                            disabled={hasSubmitted}
                            id={inputId}
                            name={`sheet-${question.id}`}
                            onChange={() => selectAnswer(question.id, optionIndex)}
                            type="radio"
                            value={option.value}
                          />
                          <span className="quiz-option-badge">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <strong className="quiz-option-text">
                            <MathText text={option.label} />
                          </strong>
                        </label>
                      );
                    })}
                  </div>
                  {hasSubmitted && question.explanation ? (
                    <div className="quiz-review-note">
                      <span>Explanation</span>
                      <p>
                        <MathText text={question.explanation} />
                      </p>
                    </div>
                  ) : null}
                </fieldset>
              );
            })}
          </div>
        )}
      </div>

      <aside className="quiz-score-card">
        <div>
          <p className="eyebrow">Save mastery</p>
          <h2>{quizMode === 'sprint' ? 'Sprint scorecard' : 'Submit quiz'}</h2>
          <p className="subtext compact">
            {quizMode === 'sprint'
              ? 'Instant NCERT feedback per question. Complete 5 questions in 2 mins to lock in XP!'
              : 'Your score is calculated from selected answers and saved for revision.'}
          </p>
        </div>

        <div className="quiz-score-preview" aria-live="polite">
          <span>{hasSubmitted ? 'Final score' : 'Live progress'}</span>
          <strong>
            {hasSubmitted ? `${scorePercent}%` : `${answeredCount}/${totalQuestions}`}
          </strong>
        </div>

        {hasSubmitted ? (
          <div className="quiz-score-detail">
            <strong>
              {correctAnswers} of {totalQuestions} correct
            </strong>
            <span>
              {weakTopicSlugs.length > 0
                ? `${weakTopicSlugs.length} topic(s) marked for revision`
                : 'No weak topics marked'}
            </span>
            {weakTopicLabels.length > 0 ? <small>{weakTopicLabels.join(', ')}</small> : null}
          </div>
        ) : null}

        {hasSubmitted && quizMode === 'sheet' && (
          <WhatsAppChallengeBar
            headline={`Challenge a friend to beat ${scorePercent}%!`}
            shareMessage={challengeShareText}
            surface="chapter_quiz_sheet"
            chapterSlug={chapterSlug}
            compact
          />
        )}

        {hasSubmitted && recoveryResult?.mission && 'state' in recoveryResult.mission ? (
          <section className="quiz-recovery-note" aria-label="Weak-topic recovery">
            <p className="eyebrow">
              {recoveryResult.mission.state === 'completed' ? 'Mission complete' : 'Recovery plan'}
            </p>
            {recoveryResult.weakTopicLabels.length > 0 ? (
              <p>Review focus: {recoveryResult.weakTopicLabels.join(', ')}</p>
            ) : (
              <p>Review focus: chapter practice and common mistakes.</p>
            )}
            {'recommendedSteps' in recoveryResult.mission &&
            recoveryResult.mission.recommendedSteps?.[0] ? (
              <strong>{recoveryResult.mission.recommendedSteps[0]}</strong>
            ) : null}
            {'targetScore' in recoveryResult.mission && recoveryResult.mission.targetScore ? (
              <span>Target score: {recoveryResult.mission.targetScore}%</span>
            ) : null}
            {recoveryAction ? <a href={recoveryAction.href}>{recoveryAction.label}</a> : null}
          </section>
        ) : null}

        <section className="quiz-attempt-history" aria-label="Saved quiz attempts">
          <div className="quiz-history-header">
            <div>
              <p className="eyebrow">Attempt history</p>
              <h3>
                {attemptHistory.stats.attemptCount > 0
                  ? `${attemptHistory.stats.attemptCount} saved`
                  : 'No saved attempts'}
              </h3>
            </div>
          </div>

          {attemptHistory.stats.attemptCount > 0 ? (
            <>
              <div className="quiz-history-summary" aria-label="Quiz attempt summary">
                <div>
                  <span>Best</span>
                  <strong>{attemptHistory.stats.bestScorePercent}%</strong>
                  <small>Attempt {attemptHistory.stats.bestAttemptNumber}</small>
                </div>
                <div>
                  <span>Latest</span>
                  <strong>{attemptHistory.stats.latestScorePercent}%</strong>
                  <small>Attempt {attemptHistory.stats.latestAttemptNumber}</small>
                </div>
              </div>

              <div className="quiz-attempt-list">
                {visibleAttempts.map((attempt) => (
                  <article className="quiz-attempt-row" key={attempt.attemptNumber}>
                    <div>
                      <strong>Attempt {attempt.attemptNumber}</strong>
                      <span>{formatAttemptDate(attempt.createdAt)}</span>
                    </div>
                    <div>
                      <strong>{attempt.scorePercent}%</strong>
                      <span>
                        {attempt.correctAnswers}/{attempt.totalQuestions} correct
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="quiz-history-empty">Your saved attempts will appear here.</p>
          )}
        </section>

        {hasSubmitted && gamificationResult ? (
          <section className="quiz-celebration" aria-live="polite">
            <div className="celebration-burst" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <p className="eyebrow">Saved score</p>
              <h3>Practice counted</h3>
            </div>
            {gamificationResult.streak ? (
              <div className="streak-summary">
                <span>Study streak</span>
                <strong>
                  {gamificationResult.streak.currentStreakDays} day
                  {gamificationResult.streak.currentStreakDays === 1 ? '' : 's'}
                </strong>
                <small>
                  Best: {gamificationResult.streak.longestStreakDays} day
                  {gamificationResult.streak.longestStreakDays === 1 ? '' : 's'}
                </small>
              </div>
            ) : null}
            {gamificationResult.awardedBadges.length > 0 ? (
              <div className="badge-award-list">
                {gamificationResult.awardedBadges.map((badge) => (
                  <article className="badge-award" key={badge.code}>
                    <span aria-hidden="true">+</span>
                    <div>
                      <strong>{badge.name}</strong>
                      <small>{badge.description}</small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="quiz-celebration-note">
                Keep studying to build your personal badge record.
              </p>
            )}
          </section>
        ) : null}

        <div className="quiz-action-stack">
          <button
            className="button-link"
            disabled={isSubmitting || !isComplete || hasSubmitted}
            type="submit"
          >
            {isSubmitting
              ? 'Saving...'
              : hasSubmitted
                ? 'Score completed'
                : isComplete
                  ? 'Submit & see score'
                  : `Answer ${totalQuestions - answeredCount} more`}
          </button>
          {hasSubmitted ? (
            <button
              className="ghost-button"
              onClick={() => startNewAttempt(sprintBatch)}
              type="button"
            >
              Retry quiz
            </button>
          ) : null}
        </div>

        {resultMessage ? (
          <p className="quiz-result-message" role="status">
            {resultMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="quiz-result-message" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </aside>

      <style jsx>{`
        .incoming-challenge-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          background: linear-gradient(135deg, #fff8eb 0%, #ffedd5 100%);
          border: 2px solid #171513;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 4px 4px 0 #171513;
        }

        .challenge-fire {
          background: #c95014;
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 900;
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.05em;
        }

        .incoming-challenge-banner strong {
          display: block;
          font-size: 1rem;
          color: #171513;
        }

        .incoming-challenge-banner span {
          font-size: 0.86rem;
          color: #55514b;
        }

        .quiz-mode-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .quiz-mode-controls {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .quiz-mode-toggle {
          display: inline-flex;
          background: #f1ede4;
          border: 1.5px solid #171513;
          border-radius: 10px;
          padding: 3px;
          gap: 3px;
        }

        .mode-pill {
          border: none;
          background: transparent;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 0.82rem;
          font-weight: 850;
          color: #55514b;
          cursor: pointer;
        }

        .mode-pill.active {
          background: #171513;
          color: #ffffff;
        }

        .sprint-stepper-shell {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sprint-step-dots {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sprint-dot {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 2px solid #171513;
          background: #ffffff;
          color: #171513;
          font-weight: 900;
          font-size: 0.9rem;
          cursor: pointer;
          box-shadow: 2px 2px 0 #171513;
        }

        .sprint-dot.active {
          background: #fff3df;
          border-color: #c95014;
          transform: translateY(-2px);
        }

        .sprint-dot.right {
          background: #ecfdf5;
          border-color: #059669;
          color: #065f46;
        }

        .sprint-dot.wrong {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }

        .sprint-prompt-text {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.55;
        }

        .sprint-instant-feedback {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid #171513;
          box-shadow: 3px 3px 0 #171513;
        }

        .sprint-instant-feedback.good {
          background: #ecfdf5;
        }

        .sprint-instant-feedback.trap {
          background: #fffbeb;
        }

        .sprint-instant-feedback strong {
          display: block;
          font-size: 0.96rem;
          color: #171513;
          margin-bottom: 6px;
        }

        .sprint-instant-feedback p {
          margin: 0 0 12px;
          font-size: 0.9rem;
          color: #3f3f46;
          line-height: 1.5;
        }

        .sprint-nav-actions {
          display: flex;
          gap: 10px;
        }

        .sprint-next-btn,
        .sprint-finish-btn {
          width: 100%;
          padding: 12px 18px;
          border-radius: 11px;
          border: 2px solid #171513;
          font-weight: 900;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 3px 3px 0 #171513;
        }

        .sprint-next-btn {
          background: #171513;
          color: #ffffff;
        }

        .sprint-finish-btn {
          background: #c95014;
          color: #ffffff;
        }

        .sprint-skip-row {
          display: flex;
          justify-content: space-between;
          margin-top: 14px;
          gap: 8px;
        }

        .sprint-ghost-nav {
          background: transparent;
          border: 1.5px solid #d6cbb8;
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.82rem;
          font-weight: 800;
          color: #55514b;
          cursor: pointer;
        }

        .sprint-summary-celebration {
          background: #fffdfa;
          border: 2.5px solid #171513;
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 5px 5px 0 #171513;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sprint-summary-top {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sprint-trophy {
          font-size: 2.5rem;
          line-height: 1;
        }

        .sprint-complete-pill {
          display: inline-block;
          background: #ffedd5;
          color: #a84a08;
          font-size: 0.7rem;
          font-weight: 900;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }

        .sprint-summary-top h2 {
          margin: 0;
          font-size: 1.45rem;
          font-weight: 950;
          color: #171513;
        }

        .challenger-verdict {
          margin: 4px 0 0;
          font-size: 0.92rem;
          color: #44403c;
        }

        .guest-save-prompt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 13px 16px;
          border-radius: 14px;
          background: #eff6ff;
          border: 2px solid #171513;
        }

        .guest-save-prompt strong {
          display: block;
          font-size: 0.95rem;
          color: #171513;
        }

        .guest-save-prompt p {
          margin: 2px 0 0;
          font-size: 0.84rem;
          color: #3f3f46;
        }

        .guest-save-btn {
          background: #2563eb;
          color: #ffffff;
          font-weight: 900;
          font-size: 0.88rem;
          padding: 9px 15px;
          border-radius: 10px;
          border: 2px solid #171513;
          box-shadow: 2px 2px 0 #171513;
          text-decoration: none;
        }

        .sprint-next-batch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
        }

        .sprint-next-set-btn {
          background: #c95014;
          color: #ffffff;
          font-weight: 900;
          font-size: 0.9rem;
          padding: 10px 16px;
          border-radius: 10px;
          border: 2px solid #171513;
          box-shadow: 2px 2px 0 #171513;
          cursor: pointer;
        }

        .sprint-retry-btn,
        .sprint-sheet-link {
          background: #ffffff;
          color: #171513;
          font-weight: 850;
          font-size: 0.86rem;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #171513;
          text-decoration: none;
          cursor: pointer;
        }

        .quiz-option-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 14px;
        }

        .quiz-option {
          position: relative;
          display: flex !important;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 12px 16px;
          border: 2px solid #171513;
          border-radius: 12px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 2px 2px 0 rgba(23, 21, 19, 0.08);
          box-sizing: border-box;
        }

        .quiz-option:hover:not(:has(input:disabled)) {
          border-color: #c25e00;
          background: #fffdfa;
          transform: translateY(-1px);
          box-shadow: 3px 3px 0 #171513;
        }

        .quiz-option input[type='radio'] {
          position: absolute;
          opacity: 0;
          pointer-events: none;
          width: 0;
          height: 0;
          margin: 0;
        }

        .quiz-option-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 8px;
          border: 1.5px solid #171513;
          background: #f1ede4;
          font-weight: 900;
          font-size: 0.95rem;
          color: #171513;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .quiz-option-text {
          flex: 1 1 auto;
          min-width: 0;
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.45;
          color: #171513;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .quiz-option.selected {
          border-color: #171513;
          background: #fff8eb;
          box-shadow: 4px 4px 0 #171513;
        }

        .quiz-option.selected .quiz-option-badge {
          background: #171513;
          color: #ffffff;
          border-color: #171513;
        }

        .quiz-option.correct {
          border-color: #059669 !important;
          background: #ecfdf5 !important;
          box-shadow: 4px 4px 0 #059669 !important;
        }

        .quiz-option.correct .quiz-option-badge {
          background: #059669 !important;
          color: #ffffff !important;
          border-color: #059669 !important;
        }

        .quiz-option.incorrect {
          border-color: #dc2626 !important;
          background: #fef2f2 !important;
          box-shadow: 4px 4px 0 #dc2626 !important;
        }

        .quiz-option.incorrect .quiz-option-badge {
          background: #dc2626 !important;
          color: #ffffff !important;
          border-color: #dc2626 !important;
        }
      `}</style>
    </form>
  );
}
