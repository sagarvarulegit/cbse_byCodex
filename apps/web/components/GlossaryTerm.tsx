import { useId } from 'react';

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
  const popoverId = useId();

  return (
    <span className="glossary-inline">
      <button
        aria-haspopup="dialog"
        className="glossary-trigger"
        popoverTarget={popoverId}
        type="button"
      >
        {label}
      </button>

      <span
        aria-label={`${payload.term} glossary definition`}
        className="glossary-popover"
        id={popoverId}
        popover="auto"
        role="dialog"
      >
        <strong>{payload.term}</strong>
        <span>{payload.shortMeaning}</span>
        {payload.example ? <em>Example: {payload.example}</em> : null}
        <button
          className="glossary-popover-close"
          popoverTarget={popoverId}
          popoverTargetAction="hide"
          type="button"
        >
          Close
        </button>
      </span>
    </span>
  );
}
