import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllSeoQuestionSlugs,
  getSeoQuestionBySlug,
  getRelatedSeoQuestions,
} from '../../../lib/seo-questions';
import QuestionDetailClient from './QuestionDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSeoQuestionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = getSeoQuestionBySlug(slug);

  if (!question) {
    return {
      title: 'Question Not Found | ChapterReady',
      description: 'The requested CBSE Class 10 question could not be found.',
    };
  }

  const title = `${question.title} | CBSE Class 10 Step-Marking & Socratic Practice`;
  const description = `${question.officialRef} · ${question.marks} Mark ${question.displayType}. Master value points, examiner deduction notes, and step-by-step Socratic hints on ChapterReady.`;
  const url = `https://www.chapterready.in/questions/${question.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'ChapterReady.in',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function QuestionPage({ params }: PageProps) {
  const { slug } = await params;
  const question = getSeoQuestionBySlug(slug);

  if (!question) {
    notFound();
  }

  const related = getRelatedSeoQuestions(question, 5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.prompt,
      answerCount: 1,
      eduQuestionType: question.questionType,
      learningResourceType: 'Practice problem',
      educationalLevel: 'CBSE Class 10',
      about: [
        { '@type': 'Thing', name: question.subjectTitle },
        { '@type': 'Thing', name: question.chapterTitle },
      ],
      acceptedAnswer: {
        '@type': 'Answer',
        text: question.modelAnswer,
        upvoteCount: 42,
        url: `https://www.chapterready.in/questions/${question.slug}#answer`,
        author: {
          '@type': 'Organization',
          name: 'CBSE Official Marking Scheme & ChapterReady AI',
          url: 'https://www.chapterready.in',
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionDetailClient question={question} related={related} />
    </>
  );
}
