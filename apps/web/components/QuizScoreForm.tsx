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
  mastery?: {
    masteryScore?: number;
  };
  message?: string;
  revisionMission?: {
    id: string;
  } | null;
};

export default function QuizScoreForm({ chapterSlug, questions, weakTopicOptions }: QuizScoreFormProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      setHasSubmitted(false);
      setResultMessage(null);
    }

    setSelectedAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  async function submitQuizScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
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
      setHasSubmitted(true);
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
          <p className="subtext compact">Your score is calculated from selected answers and saved to chapter mastery.</p>
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

        <button className="button-link" disabled={isSubmitting || !isComplete} type="submit">
          {isSubmitting ? 'Saving...' : isComplete ? 'Submit answers' : 'Answer all questions'}
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
