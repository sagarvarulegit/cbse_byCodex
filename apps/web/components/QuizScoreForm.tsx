'use client';

import { useMemo, useState } from 'react';

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
  id: string;
  options: QuizOption[];
  prompt: string;
  title: string;
  topicSlug?: string;
};

type QuizScoreFormProps = {
  chapterSlug: string;
  questions: QuizQuestion[];
  weakTopicOptions: WeakTopicOption[];
};

type QuizProgressResponse = {
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
  } | null;
};

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

export default function QuizScoreForm({ chapterSlug, questions, weakTopicOptions }: QuizScoreFormProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);
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
      const missionText = data?.revisionMission ? 'A revision mission was created.' : 'No revision mission was needed.';
      const awardedBadges = data?.gamification?.awardedBadges ?? [];
      const streak = data?.gamification?.streak?.currentStreakDays
        ? {
            currentStreakDays: data.gamification.streak.currentStreakDays,
            longestStreakDays: data.gamification.streak.longestStreakDays ?? data.gamification.streak.currentStreakDays,
          }
        : null;

      setHasSubmitted(true);
      setGamificationResult({ awardedBadges, streak });
      setResultMessage(`Submitted and saved. Mastery score is ${masteryScore}%. ${missionText}`);
    } catch {
      setErrorMessage('Unable to save quiz progress right now.');
    } finally {
      setIsSubmitting(false);
    }
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

          return (
            <fieldset className="quiz-question-card" key={question.id}>
              <legend>
                <span>Question {questionIndex + 1}</span>
                {hasSubmitted && isAnswered ? (
                  <strong className={isCorrect ? 'correct' : 'incorrect'}>{isCorrect ? 'Correct' : 'Review'}</strong>
                ) : null}
              </legend>
              <h3>{question.title}</h3>
              <p>{question.prompt}</p>
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
                      <strong>{option.label}</strong>
                    </label>
                  );
                })}
              </div>
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
          </div>
        ) : null}

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
                <span>Daily streak</span>
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
              <p className="quiz-celebration-note">Keep improving to unlock the next badge.</p>
            )}
          </section>
        ) : null}

        <button className="button-link" disabled={isSubmitting || !isComplete || hasSubmitted} type="submit">
          {isSubmitting ? 'Saving...' : hasSubmitted ? 'Score saved' : isComplete ? 'Submit answers' : 'Answer all questions'}
        </button>

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
