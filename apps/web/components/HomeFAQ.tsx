'use client';

import { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'Is ChapterReady 100% aligned with the latest CBSE 2026-27 syllabus?',
    answer:
      'Yes, absolutely. ChapterReady is built strictly on the latest NCERT textbooks and CBSE sample paper blueprints. Every topic number, heading, experiment, figure, and formula matches what you study in school.',
  },
  {
    question: 'Are the chapter notes and diagrams completely free to read?',
    answer:
      'Yes! All simplified chapter notes, redrawn activity diagrams, formula cheatsheets, and arcade games are completely free to access. You can start reading any subject immediately without even entering a credit card.',
  },
  {
    question: 'How is ChapterReady different from just reading the NCERT book directly?',
    answer:
      'NCERT textbooks are thorough but can be dense and intimidating. ChapterReady takes the exact same NCERT syllabus and breaks it down into bite-sized visual bullet points, highlighted key terms, memory hooks, redrawn high-res diagrams, and step-wise exam marking schemes so you understand concepts in minutes instead of hours.',
  },
  {
    question: 'How does the 3-Hour CBT Board Mock Exam Simulator work?',
    answer:
      'The CBT simulator replicates the exact board exam conditions: an 80-mark question paper, a live 180-minute timer with a 15-minute official reading clock, section navigation, and instant step-wise CBSE marking schemes with model answers. Sample Paper 1 is 100% free for all students.',
  },
  {
    question: 'What is the Mistake Vault and Spaced Repetition?',
    answer:
      'Whenever you make a mistake in any quiz or practice paper, ChapterReady automatically saves that concept into your Mistake Vault. It then schedules a quick retry 3 days later, ensuring weak areas turn into confident marks before your final board exams.',
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="home-faq-accordion">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="faq-question-btn"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="faq-answer-pane">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
