'use client';

import { useMemo, useState } from 'react';

import type { QuizAttemptHistory, QuizAttemptSummary } from '../lib/quiz-attempts';
import { buildQuizRecoveryMessage, getWeakTopicLabels } from '../lib/quiz-recovery';
import MathText from './MathText';

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
  initialAttemptHistory: QuizAttemptHistory;
  questions: QuizQuestion[];
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
  revisionMission?: {
    id: string;
    recommendedActions?: Array<{
      href: string;
      label: string;
      step: string;
    }>;
    recommendedSteps?: string[];
    state: 'created' | 'refreshed' | 'completed';
    targetScore?: number;
  } | {
    mission: null;
    state: 'not_needed';
  } | null;
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

function buildAttemptHistory(attempts: QuizAttemptSummary[], currentHistory: QuizAttemptHistory): QuizAttemptHistory {
  const attemptsByNumber = new Map<number, QuizAttemptSummary>();
  for (const attempt of attempts) {
    const existingAttempt = attemptsByNumber.get(attempt.attemptNumber);
    if (!existingAttempt || new Date(attempt.createdAt).getTime() >= new Date(existingAttempt.createdAt).getTime()) {
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
  initialAttemptHistory,
  questions,
  weakTopicOptions,
}: QuizScoreFormProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptHistory, setAttemptHistory] = useState(initialAttemptHistory);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);
  const [recoveryResult, setRecoveryResult] = useState<RecoveryResult>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === totalQuestions;

  const correctAnswers = useMemo(
    () =>
      questions.reduce((total, question) => {
        return selectedAnswers[question.id] === question.correctOptionIndex ? total + 1 : total;
      }, 0),
    [questions, selectedAnswers],
  );

  const scorePercent = useMemo(() => {
    if (totalQuestions <= 0) {
      return 0;
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  const weakTopicSlugs = useMemo(() => {
    const slugs = questions
      .filter((question) => selectedAnswers[question.id] !== undefined)
      .filter((question) => selectedAnswers[question.id] !== question.correctOptionIndex)
      .map((question, index) => question.topicSlug ?? weakTopicOptions[index]?.slug)
      .filter((slug): slug is string => Boolean(slug));

    return Array.from(new Set(slugs));
  }, [questions, selectedAnswers, weakTopicOptions]);
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

    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  async function submitQuizScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setGamificationResult(null);
    setRecoveryResult(null);
    setResultMessage(null);

    if (!isComplete) {
      setErrorMessage(`Answer all ${totalQuestions} questions before submitting.`);
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
          questionResults: questions.map((question) => {
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

      const data = (await response.json().catch(() => null)) as QuizProgressResponse | null;

      if (!response.ok) {
        setErrorMessage(data?.message ?? 'Unable to save quiz progress right now.');
        return;
      }

      const masteryScore = data?.mastery?.masteryScore ?? scorePercent;
      const awardedBadges = data?.gamification?.awardedBadges ?? [];
      const streak = data?.gamification?.streak?.currentStreakDays
        ? {
            currentStreakDays: data.gamification.streak.currentStreakDays,
            longestStreakDays: data.gamification.streak.longestStreakDays ?? data.gamification.streak.currentStreakDays,
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
      setResultMessage(buildQuizRecoveryMessage({ masteryScore, revisionMission: data?.revisionMission }));
    } catch {
      setErrorMessage('Unable to save quiz progress right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function startNewAttempt() {
    setSelectedAnswers({});
    setErrorMessage(null);
    setGamificationResult(null);
    setRecoveryResult(null);
    setResultMessage(null);
    setHasSubmitted(false);
  }

  return (
    <form className="interactive-quiz-form" onSubmit={submitQuizScore}>
      <div className="quiz-intro-card">
        <div>
          <p className="eyebrow">Chapter check</p>
          <h2>Select your answers</h2>
        </div>
        <div className="quiz-progress-chip" aria-live="polite">
          {answeredCount}/{totalQuestions} answered
        </div>
      </div>

      <div className="quiz-question-list">
        {questions.map((question, questionIndex) => {
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
            >
              <legend>
                <span>Question {questionIndex + 1}</span>
                {hasSubmitted && isAnswered ? (
                  <strong className={isCorrect ? 'correct' : 'incorrect'}>{isCorrect ? 'Correct' : 'Review'}</strong>
                ) : null}
              </legend>
              <h3>{question.title}</h3>
              {metadataChips.length > 0 ? (
                <div className="quiz-question-meta" aria-label={`Question ${questionIndex + 1} metadata`}>
                  {metadataChips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              ) : null}
              <p><MathText text={question.prompt} /></p>
              <div className="quiz-option-list">
                {question.options.map((option, optionIndex) => {
                  const inputId = `${question.id}-${optionIndex}`;
                  const isSelected = selectedOptionIndex === optionIndex;
                  const shouldRevealCorrect = hasSubmitted && optionIndex === question.correctOptionIndex;
                  const shouldRevealWrong = hasSubmitted && isSelected && !shouldRevealCorrect;

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
                        name={question.id}
                        onChange={() => selectAnswer(question.id, optionIndex)}
                        type="radio"
                        value={option.value}
                      />
                      <span>{option.value}</span>
                      <strong><MathText text={option.label} /></strong>
                    </label>
                  );
                })}
              </div>
              {hasSubmitted && question.explanation ? (
                <div className="quiz-review-note">
                  <span>Explanation</span>
                  <p><MathText text={question.explanation} /></p>
                </div>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      <aside className="quiz-score-card">
        <div>
          <p className="eyebrow">Save mastery</p>
          <h2>Submit quiz</h2>
          <p className="subtext compact">Your score is calculated from selected answers and this saved attempt is locked for review.</p>
        </div>

        <div className="quiz-score-preview" aria-live="polite">
          <span>{hasSubmitted ? 'Final score' : 'Live progress'}</span>
          <strong>{hasSubmitted ? `${scorePercent}%` : `${answeredCount}/${totalQuestions}`}</strong>
        </div>

        {hasSubmitted ? (
          <div className="quiz-score-detail">
            <strong>
              {correctAnswers} of {totalQuestions} correct
            </strong>
            <span>{weakTopicSlugs.length > 0 ? `${weakTopicSlugs.length} topic(s) marked for revision` : 'No weak topics marked'}</span>
            {weakTopicLabels.length > 0 ? <small>{weakTopicLabels.join(', ')}</small> : null}
          </div>
        ) : null}

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
            {'recommendedSteps' in recoveryResult.mission && recoveryResult.mission.recommendedSteps?.[0] ? (
              <strong>{recoveryResult.mission.recommendedSteps[0]}</strong>
            ) : null}
            {'targetScore' in recoveryResult.mission && recoveryResult.mission.targetScore ? (
              <span>Target score: {recoveryResult.mission.targetScore}%</span>
            ) : null}
            {recoveryAction ? (
              <a href={recoveryAction.href}>{recoveryAction.label}</a>
            ) : null}
          </section>
        ) : null}

        <section className="quiz-attempt-history" aria-label="Saved quiz attempts">
          <div className="quiz-history-header">
            <div>
              <p className="eyebrow">Attempt history</p>
              <h3>{attemptHistory.stats.attemptCount > 0 ? `${attemptHistory.stats.attemptCount} saved` : 'No saved attempts'}</h3>
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
                <strong>{gamificationResult.streak.currentStreakDays} day{gamificationResult.streak.currentStreakDays === 1 ? '' : 's'}</strong>
                <small>Best: {gamificationResult.streak.longestStreakDays} day{gamificationResult.streak.longestStreakDays === 1 ? '' : 's'}</small>
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
              <p className="quiz-celebration-note">Keep studying to build your personal badge record.</p>
            )}
          </section>
        ) : null}

        <div className="quiz-action-stack">
          <button className="button-link" disabled={isSubmitting || !isComplete || hasSubmitted} type="submit">
            {isSubmitting ? 'Saving...' : hasSubmitted ? 'Score saved' : isComplete ? 'Submit answers' : 'Answer all questions'}
          </button>
          {hasSubmitted ? (
            <button className="ghost-button" onClick={startNewAttempt} type="button">
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
    </form>
  );
}
