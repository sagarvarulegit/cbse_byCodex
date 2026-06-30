import type { BoardQuestionType } from './types';

export type BoardQuestionTypeMetadata = {
  label: string;
  hasStructuredAnswer: boolean;
};

export const BOARD_QUESTION_TYPE_METADATA = {
  mcq: {
    label: 'Multiple choice',
    hasStructuredAnswer: false,
  },
  'assertion-reason': {
    label: 'Assertion and reason',
    hasStructuredAnswer: false,
  },
  'very-short-answer': {
    label: 'Very short answer',
    hasStructuredAnswer: true,
  },
  'short-answer': {
    label: 'Short answer',
    hasStructuredAnswer: true,
  },
  'long-answer': {
    label: 'Long answer',
    hasStructuredAnswer: true,
  },
  'case-study': {
    label: 'Case study',
    hasStructuredAnswer: true,
  },
  'source-based': {
    label: 'Source based',
    hasStructuredAnswer: true,
  },
  'extract-based': {
    label: 'Extract based',
    hasStructuredAnswer: true,
  },
  numerical: {
    label: 'Numerical',
    hasStructuredAnswer: true,
  },
  proof: {
    label: 'Proof',
    hasStructuredAnswer: true,
  },
  construction: {
    label: 'Construction',
    hasStructuredAnswer: true,
  },
  diagram: {
    label: 'Diagram',
    hasStructuredAnswer: true,
  },
  'map-skill': {
    label: 'Map skill',
    hasStructuredAnswer: true,
  },
  'picture-interpretation': {
    label: 'Picture interpretation',
    hasStructuredAnswer: true,
  },
  'data-interpretation': {
    label: 'Data interpretation',
    hasStructuredAnswer: true,
  },
  grammar: {
    label: 'Grammar',
    hasStructuredAnswer: true,
  },
  'creative-writing': {
    label: 'Creative writing',
    hasStructuredAnswer: true,
  },
} as const satisfies Record<BoardQuestionType, BoardQuestionTypeMetadata>;
