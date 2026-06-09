'use client';

import { useEffect, useRef, useState } from 'react';

export type GlossaryPayload = {
  term: string;
  shortMeaning: string;
  example?: string;
};

export default function GlossaryTerm({
  label,
  payload,
}: {
  label: string;
  payload: GlossaryPayload;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <span className="glossary-inline" ref={wrapperRef}>
      <button
        aria-expanded={open}
        className={open ? 'glossary-trigger open' : 'glossary-trigger'}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {label}
      </button>

      {open ? (
        <span className="glossary-popover" role="dialog">
          <strong>{payload.term}</strong>
          <span>{payload.shortMeaning}</span>
          {payload.example ? <em>Example: {payload.example}</em> : null}
        </span>
      ) : null}
    </span>
  );
}
