import React from 'react';

export type TaraFireflyIconProps = {
  size?: number;
  className?: string;
  glow?: boolean;
  animated?: boolean;
};

export default function TaraFireflyIcon({
  size = 40,
  className = '',
  glow = true,
  animated = true,
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
        {/* Authentic Greenish-Yellow (Luciferin) Bioluminescent Radial Glow */}
        <radialGradient id="taraLanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f7fee7" stopOpacity="1" />
          <stop offset="25%" stopColor="#d9f99d" stopOpacity="0.98" />
          <stop offset="60%" stopColor="#a3e635" stopOpacity="0.9" />
          <stop offset="85%" stopColor="#65a30d" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#4d7c0f" stopOpacity="0" />
        </radialGradient>

        {/* Ambient Pulsing Aura */}
        <radialGradient id="taraAura" cx="50%" cy="65%" r="48%">
          <stop offset="0%" stopColor="#d9f99d" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#a3e635" stopOpacity="0.45" />
          <stop offset="80%" stopColor="#65a30d" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3f6212" stopOpacity="0" />
        </radialGradient>

        {/* Wing Glass Gradient Left */}
        <linearGradient id="taraWingLeft" x1="20" y1="15" x2="45" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#ecfccb" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.45" />
        </linearGradient>

        {/* Wing Glass Gradient Right */}
        <linearGradient id="taraWingRight" x1="80" y1="15" x2="55" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#ecfccb" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.45" />
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
        <filter id="taraFilterGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <style>{`
          .tara-lantern-flicker {
            transform-origin: 50px 68px;
            ${animated ? 'animation: fireflyBioluminescence 3.8s ease-in-out infinite;' : ''}
          }
          .tara-aura-flicker {
            transform-origin: 50px 68px;
            ${animated ? 'animation: fireflyAuraFlicker 3.8s ease-in-out infinite;' : ''}
          }
          .tara-antenna-spark {
            transform-origin: center;
            ${animated ? 'animation: antennaSpark 2.4s ease-in-out infinite alternate;' : ''}
          }
          .tara-spark-float {
            ${animated ? 'animation: sparkTwinkle 2.8s ease-in-out infinite alternate;' : ''}
          }

          @keyframes fireflyBioluminescence {
            0%, 100% {
              opacity: 0.72;
              transform: scale(0.96);
            }
            28% {
              opacity: 0.96;
              transform: scale(1.03);
            }
            34% {
              opacity: 0.82;
              transform: scale(0.99);
            }
            58% {
              opacity: 1;
              transform: scale(1.06);
            }
            64% {
              opacity: 0.88;
              transform: scale(1.01);
            }
            82% {
              opacity: 0.76;
              transform: scale(0.97);
            }
          }

          @keyframes fireflyAuraFlicker {
            0%, 100% {
              opacity: 0.45;
              transform: scale(0.92);
            }
            28% {
              opacity: 0.85;
              transform: scale(1.08);
            }
            34% {
              opacity: 0.6;
              transform: scale(0.98);
            }
            58% {
              opacity: 1;
              transform: scale(1.15);
            }
            64% {
              opacity: 0.75;
              transform: scale(1.04);
            }
            82% {
              opacity: 0.52;
              transform: scale(0.95);
            }
          }

          @keyframes antennaSpark {
            0%, 100% {
              opacity: 0.65;
              transform: scale(0.85);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }

          @keyframes sparkTwinkle {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1.15);
            }
          }
        `}</style>
      </defs>

      {/* 1. Ambient Glow Aura behind abdomen (Slow Flickering & Breathing) */}
      {glow && (
        <g className="tara-aura-flicker">
          <circle cx="50" cy="68" r="34" fill="url(#taraAura)" />
        </g>
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
      {/* Left Antenna Tip Glowing Spark */}
      <g className="tara-antenna-spark" style={{ transformOrigin: '21px 10px' }}>
        <circle cx="21" cy="10" r="3.2" fill="#d9f99d" stroke="#1c1917" strokeWidth="1.5" />
      </g>

      {/* Right Antenna */}
      <path
        d="M 57 20 Q 70 6 78 10"
        stroke="#1c1917"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right Antenna Tip Glowing Spark */}
      <g className="tara-antenna-spark" style={{ transformOrigin: '79px 10px' }}>
        <circle cx="79" cy="10" r="3.2" fill="#d9f99d" stroke="#1c1917" strokeWidth="1.5" />
      </g>

      {/* 3. Luminescent Greenish-Yellow Bioluminescent Abdomen (The Firefly Lantern) */}
      <g className="tara-lantern-flicker" filter={glow ? 'url(#taraFilterGlow)' : undefined}>
        {/* Glow Core */}
        <ellipse cx="50" cy="68" rx="20" ry="22" fill="url(#taraLanternGlow)" />
        {/* Outer Ring Accent */}
        <ellipse
          cx="50"
          cy="68"
          rx="19"
          ry="21"
          stroke="#bef264"
          strokeWidth="2"
          fill="none"
          strokeOpacity="0.9"
        />
        {/* Natural Segment Lines on glowing lantern tail */}
        <path
          d="M 33 63 Q 50 67 67 63"
          stroke="#65a30d"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 36 72 Q 50 77 64 72"
          stroke="#65a30d"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center Bright Sparkle */}
        <circle cx="46" cy="64" r="3.5" fill="#ffffff" fillOpacity="0.95" />
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
        stroke="#bef264"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 8. Little Bioluminescent Magic Sparks */}
      <g className="tara-spark-float" style={{ transformOrigin: '83px 28px' }}>
        <path
          d="M 82 24 L 84 27 L 87 27 L 85 29 L 86 32 L 83 30 L 80 32 L 81 29 L 79 27 L 82 27 Z"
          fill="#d9f99d"
          opacity="0.9"
        />
      </g>
      <circle cx="16" cy="62" r="2" fill="#d9f99d" opacity="0.8" />
    </svg>
  );
}
