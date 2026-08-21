'use client';

import { useState } from 'react';
import TaraFireflyIcon from './TaraFireflyIcon';

type DemoPrompt = {
  id: string;
  chip: string;
  prompt: string;
  response: string;
  conceptBadge: string;
};

const demoPrompts: DemoPrompt[] = [
  {
    id: 'simple',
    chip: '"Explain like I\'m 12"',
    prompt: 'Can you explain why iron nails turn blue copper sulphate green?',
    conceptBadge: 'Science · Chemical Reactions',
    response:
      'Imagine Iron is a stronger friend than Copper. When Iron enters the copper sulphate playground, it kicks Copper out and takes Sulphate for itself! The new team (Iron + Sulphate) is pale green. That’s called a **Displacement Reaction**! 🧪',
  },
  {
    id: 'hint',
    chip: '"Give me a hint"',
    prompt: 'How do I prove that √5 is irrational?',
    conceptBadge: 'Maths Standard · Real Numbers',
    response:
      '💡 **Hint:** Use proof by contradiction. Assume $\\sqrt{5} = \\frac{a}{b}$ where $a$ and $b$ are co-prime integers. Square both sides: $5b^2 = a^2$. What does this tell you about whether 5 divides $a$?',
  },
  {
    id: 'example',
    chip: '"Real-life example"',
    prompt: 'Where do we see refraction in real life?',
    conceptBadge: 'Science · Light Refraction',
    response:
      '🏊 **Look at a swimming pool:** The bottom always looks shallower than it actually is because light bends as it speeds up from water into air. That’s refraction at work in everyday life!',
  },
  {
    id: 'quiz',
    chip: '"Quiz me"',
    prompt: 'Quiz me on the Fundamental Theorem of Arithmetic.',
    conceptBadge: 'Maths Standard · Quick Quiz',
    response:
      '🎯 **Quick Check:** Every composite number can be expressed as a product of primes in a way that is unique (apart from order). If a number is $2^3 \\times 3^2$, what is it? (Answer: 72!)',
  },
];

export default function AICoachShowcase() {
  const [selectedPrompt, setSelectedPrompt] = useState<DemoPrompt>(demoPrompts[0]);

  const triggerTara = () => {
    // If floating Tara bubble exists on page, simulate click
    const bubble = document.querySelector('.tara-bubble') as HTMLButtonElement | null;
    if (bubble) {
      bubble.click();
    }
  };

  return (
    <div className="ai-coach-card">
      <div className="ai-coach-header">
        <div className="ai-coach-identity">
          <span className="ai-coach-avatar">
            <TaraFireflyIcon size={28} glow />
          </span>
          <div>
            <strong className="ai-coach-name">Tara · AI Learning Companion</strong>
            <span className="ai-coach-tagline">CBSE Class 10 Socratic Tutor</span>
          </div>
        </div>
        <span className="ai-coach-live-pill">● Ready to help</span>
      </div>

      <div className="ai-prompt-chips-bar" role="group" aria-label="Example AI Coach Prompts">
        {demoPrompts.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`prompt-chip-btn ${selectedPrompt.id === item.id ? 'active' : ''}`}
            onClick={() => setSelectedPrompt(item)}
          >
            {item.chip}
          </button>
        ))}
      </div>

      <div className="ai-chat-preview-box">
        <div className="chat-bubble user-bubble">
          <span className="bubble-speaker">Student:</span>
          <p>{selectedPrompt.prompt}</p>
        </div>

        <div className="chat-bubble assistant-bubble">
          <div className="assistant-badge-row">
            <span className="assistant-badge">{selectedPrompt.conceptBadge}</span>
          </div>
          <p>{selectedPrompt.response}</p>
        </div>
      </div>

      <div className="ai-coach-footer">
        <button type="button" className="btn-open-tara" onClick={triggerTara}>
          ✨ Ask Your Own Doubt to AI Coach →
        </button>
      </div>
    </div>
  );
}
