import Image from 'next/image';

type BrandLockupProps = {
  compact?: boolean;
  showDescriptor?: boolean;
};

export default function BrandLockup({
  compact = false,
  showDescriptor = true,
}: BrandLockupProps) {
  return (
    <span className={`brand-lockup${compact ? ' brand-lockup-compact' : ''}`}>
      <Image
        alt=""
        aria-hidden="true"
        className="brand-lockup-mark"
        height={48}
        src="/brand/chapterready-mark.svg"
        width={48}
      />
      <span className="brand-lockup-copy">
        <strong className="brand-lockup-name">
          Chapter<span>Ready</span>
        </strong>
        {showDescriptor ? (
          <span className="brand-lockup-descriptor">For CBSE Class 10</span>
        ) : null}
      </span>
    </span>
  );
}
