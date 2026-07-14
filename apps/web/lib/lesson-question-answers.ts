import type { MarkdownBlock } from './course-content';

export type LessonQuestionAnswer = {
  answer: string;
  answerBlocks: MarkdownBlock[];
  hint?: string;
  number: number;
  question: string;
};

const QUESTION_MARKER = /^\*\*❓\s+(?:IN-TEXT\s+)?QUESTIONS\*\*$/i;
const QUESTION_LINE = /^\*\*(\d+)\.\s+(.+)\*\*$/;
const HINT_LINE = /^\*Hint:\*\s*(.*)$/i;
const ANSWER_LINE = /^\*Answer:\*\s*(.*)$/i;

export function parseLessonQuestionAnswers(blocks: MarkdownBlock[]): LessonQuestionAnswer[] {
  const questions: LessonQuestionAnswer[] = [];
  let markerSeen = false;
  let current: LessonQuestionAnswer | null = null;
  let collectingAnswer = false;

  const flushCurrent = () => {
    if (current?.question && (current.answer || current.answerBlocks.length > 0)) {
      questions.push(current);
    }
    current = null;
    collectingAnswer = false;
  };

  for (const block of blocks) {
    if (block.type === 'paragraph' && QUESTION_MARKER.test(block.text.trim())) {
      flushCurrent();
      markerSeen = true;
      continue;
    }

    if (!markerSeen) {
      continue;
    }

    if (block.type === 'paragraph') {
      const questionMatch = block.text.trim().match(QUESTION_LINE);
      if (questionMatch) {
        flushCurrent();
        current = {
          answer: '',
          answerBlocks: [],
          number: Number(questionMatch[1]),
          question: questionMatch[2].trim(),
        };
        continue;
      }

      if (current) {
        const hintMatch = block.text.trim().match(HINT_LINE);
        if (hintMatch) {
          current.hint = hintMatch[1].trim();
          collectingAnswer = false;
          continue;
        }

        const answerMatch = block.text.trim().match(ANSWER_LINE);
        if (answerMatch) {
          current.answer = answerMatch[1].trim();
          collectingAnswer = true;
          continue;
        }
      }
    }

    if (current && collectingAnswer) {
      current.answerBlocks.push(block);
    }
  }

  flushCurrent();
  return questions;
}
