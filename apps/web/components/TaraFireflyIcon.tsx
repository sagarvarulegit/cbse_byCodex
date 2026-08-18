import React from 'react';

export type TaraFireflyIconProps = {
  size?: number;
  className?: string;
  glow?: boolean;
};

export default function TaraFireflyIcon({
  size = 40,
  className = '',
  glow = true,
}: TaraFireflyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible', display: 'block' }}
      aria-label="Tara Firefly"
    >
      <defs>
        {/* Lantern Radial Glow */}
        <radialGradient id="taraLanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4" stopOpacity="1" />
          <stop offset="35%" stopColor="#ffee58" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>

        {/* Ambient Halo */}
        <radialGradient id="taraAura" cx="50%" cy="65%" r="45%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#eab308" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
        </radialGradient>

        {/* Wing Glass Gradient Left */}
        <linearGradient id="taraWingLeft" x1="20" y1="15" x2="45" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
        </linearGradient>

        {/* Wing Glass Gradient Right */}
        <linearGradient id="taraWingRight" x1="80" y1="15" x2="55" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#e0f2fe" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.4" />
        </linearGradient>

        {/* Body Gradient */}
        <linearGradient id="taraBodyGrad" x1="50" y1="28" x2="50" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#292524" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>

        {/* Head Gradient */}
        <linearGradient id="taraHeadGrad" x1="50" y1="15" x2="50" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#44403c" />
          <stop offset="100%" stopColor="#1c1917" />
        </linearGradient>

        {/* Outer Glow Filter */}
        <filter id="taraFilterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Ambient Glow Aura behind abdomen */}
      {glow && (
        <circle cx="50" cy="68" r="32" fill="url(#taraAura)" />
      )}

      {/* 2. Antennae */}
      {/* Left Antenna */}
      <path
        d="M 43 20 Q 30 6 22 10"
        stroke="#1c1917"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left Antenna Tip Spark */}
      <circle cx="21" cy="10" r="3" fill="#facc15" stroke="#1c1917" strokeWidth="1.5" />

      {/* Right Antenna */}
      <path
        d="M 57 20 Q 70 6 78 10"
        stroke="#1c1917"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right Antenna Tip Spark */}
      <circle cx="79" cy="10" r="3" fill="#facc15" stroke="#1c1917" strokeWidth="1.5" />

      {/* 3. Luminescent Abdomen (The Glowing Firefly Lantern) */}
      <g filter={glow ? 'url(#taraFilterGlow)' : undefined}>
        {/* Glow Core */}
        <ellipse cx="50" cy="68" rx="20" ry="22" fill="url(#taraLanternGlow)" />
        {/* Outer Ring Accent */}
        <ellipse
          cx="50"
          cy="68"
          rx="19"
          ry="21"
          stroke="#eab308"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.8"
        />
        {/* Cute Segment Lines on glowing tail */}
        <path
          d="M 33 63 Q 50 67 67 63"
          stroke="#ca8a04"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 36 72 Q 50 77 64 72"
          stroke="#ca8a04"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center Bright Sparkle */}
        <circle cx="46" cy="64" r="3.5" fill="#ffffff" fillOpacity="0.9" />
      </g>

      {/* 4. Translucent Fairy/Insect Wings */}
      {/* Left Wing */}
      <g>
        <path
          d="M 45 36 C 24 16 8 28 14 46 C 18 58 35 56 46 45 Z"
          fill="url(#taraWingLeft)"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeOpacity="0.6"
        />
        {/* Inner Wing Vein */}
        <path
          d="M 42 38 Q 24 34 20 45"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.5"
        />
      </g>

      {/* Right Wing */}
      <g>
        <path
          d="M 55 36 C 76 16 92 28 86 46 C 82 58 65 56 54 45 Z"
          fill="url(#taraWingRight)"
          stroke="#0284c7"
          strokeWidth="1.8"
          strokeOpacity="0.6"
        />
        {/* Inner Wing Vein */}
        <path
          d="M 58 38 Q 76 34 80 45"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          strokeOpacity="0.5"
        />
      </g>

      {/* 5. Thorax / Upper Body */}
      <ellipse
        cx="50"
        cy="42"
        rx="15"
        ry="12"
        fill="url(#taraBodyGrad)"
        stroke="#1c1917"
        strokeWidth="2"
      />

      {/* 6. Head */}
      <circle
        cx="50"
        cy="24"
        r="13"
        fill="url(#taraHeadGrad)"
        stroke="#1c1917"
        strokeWidth="2"
      />

      {/* 7. Expressive Friendly Eyes */}
      {/* Left Eye */}
      <ellipse cx="45" cy="23" rx="3.5" ry="4.5" fill="#ffffff" />
      <circle cx="45.5" cy="23.5" r="2.2" fill="#0f172a" />
      <circle cx="44.2" cy="21.8" r="1.1" fill="#ffffff" />

      {/* Right Eye */}
      <ellipse cx="55" cy="23" rx="3.5" ry="4.5" fill="#ffffff" />
      <circle cx="54.5" cy="23.5" r="2.2" fill="#0f172a" />
      <circle cx="53.8" cy="21.8" r="1.1" fill="#ffffff" />

      {/* Cute Smile */}
      <path
        d="M 47 29 Q 50 32 53 29"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 8. Little Magic Sparks */}
      <path
        d="M 82 24 L 84 27 L 87 27 L 85 29 L 86 32 L 83 30 L 80 32 L 81 29 L 79 27 L 82 27 Z"
        fill="#fde047"
        opacity="0.85"
      />
      <circle cx="16" cy="62" r="2" fill="#fde047" opacity="0.75" />
    </svg>
  );
}
