'use client';

import { useMemo, useState } from 'react';

type WeakTopicOption = {
  label: string;
  slug: string;
};

type QuizScoreFormProps = {
  chapterSlug: string;
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

export default function QuizScoreForm({ chapterSlug, weakTopicOptions }: QuizScoreFormProps) {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [selectedWeakTopicSlugs, setSelectedWeakTopicSlugs] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scorePercent = useMemo(() => {
    if (totalQuestions <= 0) {
      return 0;
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  }, [correctAnswers, totalQuestions]);

  function updateTotalQuestions(value: string) {
    const nextTotal = Math.max(1, Number.parseInt(value, 10) || 1);
    setTotalQuestions(nextTotal);
    setCorrectAnswers((current) => Math.min(current, nextTotal));
  }

  function updateCorrectAnswers(value: string) {
    const nextCorrect = Number.parseInt(value, 10) || 0;
    setCorrectAnswers(Math.min(Math.max(0, nextCorrect), totalQuestions));
  }

  function toggleWeakTopic(slug: string) {
    setSelectedWeakTopicSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  async function submitQuizScore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setResultMessage(null);
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
          weakTopicSlugs: selectedWeakTopicSlugs,
        }),
      });

      const data = (await response.json().catch(() => null)) as QuizProgressResponse | null;

      if (!response.ok) {
        setErrorMessage(data?.message ?? 'Unable to save quiz progress right now.');
        return;
      }

      const masteryScore = data?.mastery?.masteryScore ?? scorePercent;
      const missionText = data?.revisionMission ? 'A revision mission was created.' : 'No revision mission was needed.';
      setResultMessage(`Saved. Mastery score is ${masteryScore}%. ${missionText}`);
    } catch {
      setErrorMessage('Unable to save quiz progress right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="quiz-score-card" onSubmit={submitQuizScore}>
      <div>
        <p className="eyebrow">Save mastery</p>
        <h2>Record your quiz score</h2>
        <p className="subtext compact">This updates your chapter mastery and may create a focused revision mission.</p>
      </div>

      <div className="quiz-score-grid">
        <label>
          Correct answers
          <input
            min="0"
            max={totalQuestions}
            name="correctAnswers"
            onChange={(event) => updateCorrectAnswers(event.target.value)}
            type="number"
            value={correctAnswers}
          />
        </label>
        <label>
          Total questions
          <input
            min="1"
            name="totalQuestions"
            onChange={(event) => updateTotalQuestions(event.target.value)}
            type="number"
            value={totalQuestions}
          />
        </label>
      </div>

      <div className="quiz-score-preview" aria-live="polite">
        <span>Score preview</span>
        <strong>{scorePercent}%</strong>
      </div>

      {weakTopicOptions.length > 0 ? (
        <fieldset className="weak-topic-list">
          <legend>Topics that need revision</legend>
          {weakTopicOptions.map((topic) => (
            <label key={topic.slug}>
              <input
                checked={selectedWeakTopicSlugs.includes(topic.slug)}
                onChange={() => toggleWeakTopic(topic.slug)}
                type="checkbox"
                value={topic.slug}
              />
              <span>{topic.label}</span>
            </label>
          ))}
        </fieldset>
      ) : null}

      <button className="button-link" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : 'Save quiz progress'}
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
    </form>
  );
}
