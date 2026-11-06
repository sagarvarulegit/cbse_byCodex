'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import MathText from './MathText';

export type HexagonVertexId = 'tan' | 'sin' | 'cos' | 'cot' | 'cosec' | 'sec';

export interface VertexConfig {
  id: HexagonVertexId;
  label: string;
  latex: string;
  name: string;
  x: number;
  y: number;
  isCoRatio: boolean;
  color: string;
  oppositeId: HexagonVertexId;
  clockwiseNext: HexagonVertexId;
  clockwiseAfterNext: HexagonVertexId;
  counterClockwiseNext: HexagonVertexId;
  counterClockwiseAfterNext: HexagonVertexId;
  prevNeighbor: HexagonVertexId;
  nextNeighbor: HexagonVertexId;
}

// Coordinate configuration for pointy-left/right hexagon (center 260, 260; R = 175)
// tan (far-left), sin (top-left), cos (top-right), cot (far-right), cosec (bottom-right), sec (bottom-left)
const CX = 260;
const CY = 250;
const R = 165;
const SQRT3_HALF = 0.8660254; // sin(60)

const VERTICES: Record<HexagonVertexId, VertexConfig> = {
  tan: {
    id: 'tan',
    label: 'tan θ',
    latex: '\\tan\\theta',
    name: 'Tangent',
    x: CX - R, // 95
    y: CY, // 250
    isCoRatio: false,
    color: '#0284c7', // Sky blue
    oppositeId: 'cot',
    clockwiseNext: 'sin',
    clockwiseAfterNext: 'cos',
    counterClockwiseNext: 'sec',
    counterClockwiseAfterNext: 'cosec',
    prevNeighbor: 'sec',
    nextNeighbor: 'sin',
  },
  sin: {
    id: 'sin',
    label: 'sin θ',
    latex: '\\sin\\theta',
    name: 'Sine',
    x: CX - R / 2, // 177.5
    y: CY - R * SQRT3_HALF, // 107
    isCoRatio: false,
    color: '#16a34a', // Emerald green
    oppositeId: 'cosec',
    clockwiseNext: 'cos',
    clockwiseAfterNext: 'cot',
    counterClockwiseNext: 'tan',
    counterClockwiseAfterNext: 'sec',
    prevNeighbor: 'tan',
    nextNeighbor: 'cos',
  },
  cos: {
    id: 'cos',
    label: 'cos θ',
    latex: '\\cos\\theta',
    name: 'Cosine',
    x: CX + R / 2, // 342.5
    y: CY - R * SQRT3_HALF, // 107
    isCoRatio: true,
    color: '#d97706', // Amber
    oppositeId: 'sec',
    clockwiseNext: 'cot',
    clockwiseAfterNext: 'cosec',
    counterClockwiseNext: 'sin',
    counterClockwiseAfterNext: 'tan',
    prevNeighbor: 'sin',
    nextNeighbor: 'cot',
  },
  cot: {
    id: 'cot',
    label: 'cot θ',
    latex: '\\cot\\theta',
    name: 'Cotangent',
    x: CX + R, // 425
    y: CY, // 250
    isCoRatio: true,
    color: '#d26b16', // Terracotta orange
    oppositeId: 'tan',
    clockwiseNext: 'cosec',
    clockwiseAfterNext: 'sec',
    counterClockwiseNext: 'cos',
    counterClockwiseAfterNext: 'sin',
    prevNeighbor: 'cos',
    nextNeighbor: 'cosec',
  },
  cosec: {
    id: 'cosec',
    label: 'cosec θ',
    latex: '\\text{cosec}\\,\\theta',
    name: 'Cosecant',
    x: CX + R / 2, // 342.5
    y: CY + R * SQRT3_HALF, // 393
    isCoRatio: true,
    color: '#e11d48', // Rose / Red
    oppositeId: 'sin',
    clockwiseNext: 'sec',
    clockwiseAfterNext: 'tan',
    counterClockwiseNext: 'cot',
    counterClockwiseAfterNext: 'cos',
    prevNeighbor: 'cot',
    nextNeighbor: 'sec',
  },
  sec: {
    id: 'sec',
    label: 'sec θ',
    latex: '\\sec\\theta',
    name: 'Secant',
    x: CX - R / 2, // 177.5
    y: CY + R * SQRT3_HALF, // 393
    isCoRatio: false,
    color: '#7c3aed', // Purple
    oppositeId: 'cos',
    clockwiseNext: 'tan',
    clockwiseAfterNext: 'sin',
    counterClockwiseNext: 'cosec',
    counterClockwiseAfterNext: 'cot',
    prevNeighbor: 'cosec',
    nextNeighbor: 'tan',
  },
};

const VERTEX_ORDER: HexagonVertexId[] = ['tan', 'sin', 'cos', 'cot', 'cosec', 'sec'];

export type ActiveViewerTab =
  | 'explorer'
  | 'setup'
  | 'reciprocal'
  | 'quotients'
  | 'product'
  | 'pythagorean'
  | 'drill';

export default function TrigMagicHexagonViewer() {
  const [activeTab, setActiveTab] = useState<ActiveViewerTab>('explorer');
  const [selectedVertex, setSelectedVertex] = useState<HexagonVertexId>('tan');
  const [quotientDirection, setQuotientDirection] = useState<'clockwise' | 'counter'>('clockwise');
  const [pythagoreanTriangle, setPythagoreanTriangle] = useState<'top' | 'lower-left' | 'lower-right'>('top');
  const [setupStep, setSetupStep] = useState<number>(1);
  const [drillScore, setDrillScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [drillFeedback, setDrillFeedback] = useState<string | null>(null);
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);

  const currentVertex = VERTICES[selectedVertex];

  // Derived formulas for currentVertex
  const reciprocalPair = useMemo(() => {
    return {
      v1: currentVertex,
      v2: VERTICES[currentVertex.oppositeId],
    };
  }, [currentVertex]);

  // Drill question pool
  const drillQuestions = [
    {
      q: 'Which ratio is directly opposite to sin θ through the center 1?',
      options: ['cosec θ', 'cos θ', 'sec θ', 'tan θ'],
      answer: 'cosec θ',
      explanation: 'sin θ × cosec θ = 1 (Opposite diagonal passing through 1).',
    },
    {
      q: 'Using the clockwise quotient rule starting from tan θ, what does tan θ equal?',
      options: ['sin θ / cos θ', 'cos θ / sin θ', 'sec θ / cosec θ', '1 / cot θ'],
      answer: 'sin θ / cos θ',
      explanation: 'tan θ = (next corner) / (after next) = sin θ / cos θ.',
    },
    {
      q: 'Which Pythagorean identity corresponds to the top downward triangle?',
      options: ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = cosec²θ', 'sec²θ - tan²θ = 1'],
      answer: 'sin²θ + cos²θ = 1',
      explanation: 'Top-left (sin θ)² + Top-right (cos θ)² = Bottom (1)² = 1.',
    },
    {
      q: 'What is the product of the two adjacent neighbors of cos θ (sin θ and cot θ)?',
      options: ['cos θ', 'tan θ', '1', 'sec θ'],
      answer: 'cos θ',
      explanation: 'Neighbor Product Rule: Any corner = product of adjacent neighbors! (sin θ × cot θ = cos θ).',
    },
    {
      q: 'Why are cos θ, cot θ, and cosec θ on the right side of the hexagon?',
      options: [
        'The "CO" Rule: All ratios starting with "Co" go on the right side',
        'Because they are all reciprocal to each other',
        'Because they are always positive in Quadrant 1',
        'Because their values are always greater than 1',
      ],
      answer: 'The "CO" Rule: All ratios starting with "Co" go on the right side',
      explanation: 'The 5-second mnemonic rule: All "CO" ratios (cos, cot, cosec) sit on the right side!',
    },
    {
      q: 'In the lower-left triangle, (tan θ)² + 1² equals which corner?',
      options: ['sec²θ', 'cosec²θ', 'cos²θ', 'sin²θ'],
      answer: 'sec²θ',
      explanation: 'tan²θ + 1 = sec²θ (Top-left corner² + Top-right corner² = Bottom corner²).',
    },
  ];

  const handleDrillOption = (selectedOpt: string) => {
    const q = drillQuestions[activeDrillIndex];
    if (selectedOpt === q.answer) {
      setDrillFeedback('✅ Correct! ' + q.explanation);
      setDrillScore((prev) => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setDrillFeedback(`❌ Incorrect. The right answer is "${q.answer}". ${q.explanation}`);
      setDrillScore((prev) => ({ correct: prev.correct, total: prev.total + 1 }));
    }
  };

  const nextDrillQuestion = () => {
    setDrillFeedback(null);
    setActiveDrillIndex((prev) => (prev + 1) % drillQuestions.length);
  };

  // Helper lines for Hexagon perimeter
  const hexagonPathString = useMemo(() => {
    return VERTEX_ORDER.map((vid, idx) => {
      const v = VERTICES[vid];
      return `${idx === 0 ? 'M' : 'L'} ${v.x} ${v.y}`;
    }).join(' ') + ' Z';
  }, []);

  return (
    <div className="trig-hexagon-container">
      {/* Header section */}
      <div className="hexagon-header">
        <div className="header-badge-row">
          <span className="badge-pill">⚡ Visual Mnemonic Suite</span>
          <span className="badge-class">CBSE Class 10 Maths · Chapter 8</span>
          <span className="badge-time">30-Second Hack</span>
        </div>
        <h1 className="header-title">Trigonometric Magic Hexagon (Super Hexagon)</h1>
        <p className="header-subtitle">
          Derive all <strong>20+ CBSE trigonometry identities</strong> in under 30 seconds without rote memorization.
          Follow the 5-second setup rule and decode reciprocal, quotient, product, and Pythagorean formulas instantly.
        </p>
      </div>

      {/* Tara Socratic Exam Hall Hint Card */}
      <div className="tara-socratic-banner">
        <div className="tara-avatar-col">
          <div className="tara-avatar-circle">👩‍🏫</div>
          <span className="tara-name-tag">Tara AI</span>
        </div>
        <div className="tara-content-col">
          <div className="tara-eyebrow">💡 Tara&apos;s Exam Hall Socratic Rule</div>
          <blockquote className="tara-quote">
            &ldquo;Stuck on an identity question? Sketch the hexagon on your rough sheet in 5 seconds flat!
            All <strong>CO-ratios</strong> on the right, <strong>tan</strong> on the left, and <strong>1</strong> in the center.
            In 3-mark Board proofs, 90% of students lose marks mixing up sec²θ - tan²θ = 1 and 1 + cot²θ = cosec²θ.
            One look at the downward triangles gives you the exact identity in two seconds!&rdquo;
          </blockquote>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="hexagon-tabs-nav">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          🔍 Interactive Explorer
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'setup' ? 'active' : ''}`}
          onClick={() => setActiveTab('setup')}
        >
          ⏱️ 5-Second Setup Rule
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'reciprocal' ? 'active' : ''}`}
          onClick={() => setActiveTab('reciprocal')}
        >
          ↔️ 1. Diagonals (Reciprocals)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'quotients' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotients')}
        >
          🔄 2. Quotients (Clockwise)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'product' ? 'active' : ''}`}
          onClick={() => setActiveTab('product')}
        >
          🤝 3. Neighbor Products
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'pythagorean' ? 'active' : ''}`}
          onClick={() => setActiveTab('pythagorean')}
        >
          🔻 4. Pythagorean Triangles
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'drill' ? 'active' : ''}`}
          onClick={() => setActiveTab('drill')}
        >
          🎯 30s Rapid Drill
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="hexagon-workspace-grid">
        {/* Left Column: Interactive Hexagon Canvas / SVG */}
        <div className="hexagon-canvas-card">
          <div className="canvas-instruction-bar">
            <span>
              {activeTab === 'explorer' && '👉 Click any ratio corner to see its connected identities!'}
              {activeTab === 'setup' && '⏱️ Follow the 4 setup steps below to draw this in 5 seconds.'}
              {activeTab === 'reciprocal' && '↔️ Opposite corners passing through 1 multiply to 1.'}
              {activeTab === 'quotients' && '🔄 Corner = Next Corner ÷ Corner After Next.'}
              {activeTab === 'product' && '🤝 Any corner = Product of its two adjacent neighbors.'}
              {activeTab === 'pythagorean' && '🔻 (Top-Left)² + (Top-Right)² = (Bottom Corner)².'}
              {activeTab === 'drill' && '🎯 Board MCQ Speed Challenge — Test your recall!'}
            </span>
            <span className="active-tag">{VERTICES[selectedVertex].label} Active</span>
          </div>

          <div className="svg-wrapper">
            <svg
              viewBox="0 0 520 500"
              className="hexagon-svg"
              role="img"
              aria-label="Trigonometric Magic Super Hexagon"
            >
              <defs>
                {/* Glow filter */}
                <filter id="hex-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <marker
                  id="arrow-cw"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 8 5 L 0 9 z" fill="#d26b16" />
                </marker>
              </defs>

              {/* Shaded Inverted Triangles (Pythagorean Identities) */}
              {/* 1. Top Triangle: sin (177.5, 107), cos (342.5, 107), center 1 (260, 250) */}
              <polygon
                points={`${VERTICES.sin.x},${VERTICES.sin.y} ${VERTICES.cos.x},${VERTICES.cos.y} ${CX},${CY}`}
                className={`pyth-triangle top-triangle ${
                  activeTab === 'pythagorean' && pythagoreanTriangle === 'top'
                    ? 'active-triangle'
                    : activeTab === 'pythagorean'
                    ? 'inactive-triangle'
                    : 'default-triangle'
                }`}
                onClick={() => {
                  setActiveTab('pythagorean');
                  setPythagoreanTriangle('top');
                }}
              />

              {/* 2. Lower-Left Triangle: tan (95, 250), center 1 (260, 250), sec (177.5, 393) */}
              <polygon
                points={`${VERTICES.tan.x},${VERTICES.tan.y} ${CX},${CY} ${VERTICES.sec.x},${VERTICES.sec.y}`}
                className={`pyth-triangle lower-left-triangle ${
                  activeTab === 'pythagorean' && pythagoreanTriangle === 'lower-left'
                    ? 'active-triangle'
                    : activeTab === 'pythagorean'
                    ? 'inactive-triangle'
                    : 'default-triangle'
                }`}
                onClick={() => {
                  setActiveTab('pythagorean');
                  setPythagoreanTriangle('lower-left');
                }}
              />

              {/* 3. Lower-Right Triangle: center 1 (260, 250), cot (425, 250), cosec (342.5, 393) */}
              <polygon
                points={`${CX},${CY} ${VERTICES.cot.x},${VERTICES.cot.y} ${VERTICES.cosec.x},${VERTICES.cosec.y}`}
                className={`pyth-triangle lower-right-triangle ${
                  activeTab === 'pythagorean' && pythagoreanTriangle === 'lower-right'
                    ? 'active-triangle'
                    : activeTab === 'pythagorean'
                    ? 'inactive-triangle'
                    : 'default-triangle'
                }`}
                onClick={() => {
                  setActiveTab('pythagorean');
                  setPythagoreanTriangle('lower-right');
                }}
              />

              {/* The "CO" Rule Right-Side Guide Bracket */}
              <path
                d={`M ${CX + R + 35} ${CY - R * SQRT3_HALF} Q ${CX + R + 55} ${CY} ${CX + R + 35} ${CY + R * SQRT3_HALF}`}
                fill="none"
                stroke="#d26b16"
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />
              <text
                x={CX + R + 62}
                y={CY - 10}
                fill="#a84a08"
                fontSize="12"
                fontWeight="800"
                fontFamily="'IBM Plex Mono', monospace"
              >
                THE &quot;CO&quot; RULE
              </text>
              <text
                x={CX + R + 62}
                y={CY + 10}
                fill="#78350f"
                fontSize="11"
                fontWeight="600"
              >
                cos, cot, cosec
              </text>

              {/* Hexagon Perimeter Outline */}
              <path
                d={hexagonPathString}
                fill="none"
                stroke="#24211f"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Interior Diagonal Spokes through Center 1 */}
              {/* sin <-> cosec */}
              <line
                x1={VERTICES.sin.x}
                y1={VERTICES.sin.y}
                x2={VERTICES.cosec.x}
                y2={VERTICES.cosec.y}
                stroke={
                  (activeTab === 'reciprocal' && (selectedVertex === 'sin' || selectedVertex === 'cosec')) ||
                  (activeTab === 'explorer' && (selectedVertex === 'sin' || selectedVertex === 'cosec'))
                    ? '#16a34a'
                    : '#94a3b8'
                }
                strokeWidth={
                  (selectedVertex === 'sin' || selectedVertex === 'cosec') &&
                  (activeTab === 'reciprocal' || activeTab === 'explorer')
                    ? '4'
                    : '1.5'
                }
                strokeDasharray={
                  activeTab === 'reciprocal' && (selectedVertex === 'sin' || selectedVertex === 'cosec')
                    ? 'none'
                    : '4 4'
                }
              />

              {/* cos <-> sec */}
              <line
                x1={VERTICES.cos.x}
                y1={VERTICES.cos.y}
                x2={VERTICES.sec.x}
                y2={VERTICES.sec.y}
                stroke={
                  (activeTab === 'reciprocal' && (selectedVertex === 'cos' || selectedVertex === 'sec')) ||
                  (activeTab === 'explorer' && (selectedVertex === 'cos' || selectedVertex === 'sec'))
                    ? '#d97706'
                    : '#94a3b8'
                }
                strokeWidth={
                  (selectedVertex === 'cos' || selectedVertex === 'sec') &&
                  (activeTab === 'reciprocal' || activeTab === 'explorer')
                    ? '4'
                    : '1.5'
                }
                strokeDasharray={
                  activeTab === 'reciprocal' && (selectedVertex === 'cos' || selectedVertex === 'sec')
                    ? 'none'
                    : '4 4'
                }
              />

              {/* tan <-> cot */}
              <line
                x1={VERTICES.tan.x}
                y1={VERTICES.tan.y}
                x2={VERTICES.cot.x}
                y2={VERTICES.cot.y}
                stroke={
                  (activeTab === 'reciprocal' && (selectedVertex === 'tan' || selectedVertex === 'cot')) ||
                  (activeTab === 'explorer' && (selectedVertex === 'tan' || selectedVertex === 'cot'))
                    ? '#0284c7'
                    : '#94a3b8'
                }
                strokeWidth={
                  (selectedVertex === 'tan' || selectedVertex === 'cot') &&
                  (activeTab === 'reciprocal' || activeTab === 'explorer')
                    ? '4'
                    : '1.5'
                }
                strokeDasharray={
                  activeTab === 'reciprocal' && (selectedVertex === 'tan' || selectedVertex === 'cot')
                    ? 'none'
                    : '4 4'
                }
              />

              {/* Quotient Active Directional Arc (when quotients tab active) */}
              {activeTab === 'quotients' && (
                <path
                  d={`M ${CX - 75} ${CY - 50} A 90 90 0 1 1 ${CX + 75} ${CY - 50}`}
                  fill="none"
                  stroke="#d26b16"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  markerEnd="url(#arrow-cw)"
                />
              )}

              {/* Center Node "1" */}
              <g className="center-node" transform={`translate(${CX}, ${CY})`}>
                <circle
                  r="24"
                  fill="#fffdf8"
                  stroke="#24211f"
                  strokeWidth="3"
                  style={{ filter: 'drop-shadow(2px 2px 0px #24211f)' }}
                />
                <circle r="18" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="20"
                  fontWeight="900"
                  fill="#78350f"
                  fontFamily="'IBM Plex Mono', monospace"
                >
                  1
                </text>
              </g>

              {/* 6 Corner Nodes */}
              {VERTEX_ORDER.map((vid) => {
                const v = VERTICES[vid];
                const isSelected = selectedVertex === vid;
                const isOpposite = currentVertex.oppositeId === vid;
                const isNeighbor =
                  currentVertex.prevNeighbor === vid || currentVertex.nextNeighbor === vid;

                let ringStroke = '#24211f';
                let ringFill = '#ffffff';

                if (isSelected) {
                  ringStroke = '#d26b16';
                  ringFill = '#ffedd5';
                } else if (activeTab === 'reciprocal' && isOpposite) {
                  ringStroke = '#16a34a';
                  ringFill = '#dcfce7';
                } else if (activeTab === 'product' && isNeighbor) {
                  ringStroke = '#0284c7';
                  ringFill = '#e0f2fe';
                } else if (v.isCoRatio) {
                  ringFill = '#fffbeb';
                }

                return (
                  <g
                    key={vid}
                    className="vertex-node"
                    transform={`translate(${v.x}, ${v.y})`}
                    onClick={() => setSelectedVertex(vid)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing selection aura */}
                    {isSelected && (
                      <circle
                        r="38"
                        fill="none"
                        stroke="#d26b16"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="pulse-aura"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      r="30"
                      fill={ringFill}
                      stroke={ringStroke}
                      strokeWidth={isSelected ? '3.5' : '2.5'}
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(3px 3px 0px #d26b16)'
                          : 'drop-shadow(2px 2px 0px #24211f)',
                        transition: 'all 0.2s ease',
                      }}
                    />

                    {/* Ratio Label */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fontWeight="800"
                      fill={isSelected ? '#c2410c' : '#24211f'}
                      fontFamily="'IBM Plex Mono', monospace"
                    >
                      {v.label}
                    </text>

                    {/* "CO" Tag for right side */}
                    {v.isCoRatio && (
                      <rect
                        x="-14"
                        y="22"
                        width="28"
                        height="12"
                        rx="3"
                        fill="#fef08a"
                        stroke="#854d0e"
                        strokeWidth="0.8"
                      />
                    )}
                    {v.isCoRatio && (
                      <text
                        x="0"
                        y="29"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="800"
                        fill="#854d0e"
                      >
                        CO
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Corner Switcher Toolbar */}
          <div className="vertex-quick-buttons">
            <span className="quick-label">Select Corner:</span>
            {VERTEX_ORDER.map((vid) => (
              <button
                key={vid}
                type="button"
                className={`btn-corner-pill ${selectedVertex === vid ? 'selected' : ''} ${
                  VERTICES[vid].isCoRatio ? 'co-pill' : ''
                }`}
                onClick={() => setSelectedVertex(vid)}
              >
                {VERTICES[vid].label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Rule Explanation & Dynamic Formula Cards */}
        <div className="hexagon-details-card">
          {/* TAB 1: FREE EXPLORER */}
          {activeTab === 'explorer' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Ratio Focus</span>
                <h2 className="panel-heading">{currentVertex.name} ({currentVertex.label})</h2>
                <p className="panel-desc">
                  Explore all 4 rules automatically derived from this single corner:
                </p>
              </div>

              {/* 1. Reciprocal */}
              <div className="formula-block-group">
                <span className="group-title">↔️ Reciprocal Identity (Through Center 1):</span>
                <div className="formula-display-item">
                  <MathText
                    text={`$$${currentVertex.latex} \\times ${VERTICES[currentVertex.oppositeId].latex} = 1 \\implies ${currentVertex.latex} = \\frac{1}{${VERTICES[currentVertex.oppositeId].latex}}$$`}
                  />
                </div>
              </div>

              {/* 2. Quotients */}
              <div className="formula-block-group">
                <span className="group-title">🔄 Quotient Identities (Clockwise &amp; Counter):</span>
                <div className="quotient-twin-grid">
                  <div className="twin-item">
                    <span className="twin-label">Clockwise (Next ÷ After-Next):</span>
                    <MathText
                      text={`$$${currentVertex.latex} = \\frac{${VERTICES[currentVertex.clockwiseNext].latex}}{${VERTICES[currentVertex.clockwiseAfterNext].latex}}$$`}
                    />
                  </div>
                  <div className="twin-item">
                    <span className="twin-label">Counter-Clockwise:</span>
                    <MathText
                      text={`$$${currentVertex.latex} = \\frac{${VERTICES[currentVertex.counterClockwiseNext].latex}}{${VERTICES[currentVertex.counterClockwiseAfterNext].latex}}$$`}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Product */}
              <div className="formula-block-group">
                <span className="group-title">🤝 Neighbor Product Rule:</span>
                <div className="formula-display-item">
                  <MathText
                    text={`$$${currentVertex.latex} = ${VERTICES[currentVertex.prevNeighbor].latex} \\times ${VERTICES[currentVertex.nextNeighbor].latex}$$`}
                  />
                  <span className="formula-proof-note">
                    Equals product of {VERTICES[currentVertex.prevNeighbor].label} and {VERTICES[currentVertex.nextNeighbor].label}
                  </span>
                </div>
              </div>

              {/* 4. Pythagorean (if part of an inverted triangle) */}
              <div className="formula-block-group">
                <span className="group-title">🔻 Pythagorean Triangle Membership:</span>
                {selectedVertex === 'sin' || selectedVertex === 'cos' ? (
                  <div className="formula-display-item pyth-highlight">
                    <MathText text="Top Triangle: $$\sin^2\theta + \cos^2\theta = 1$$" />
                    <span className="formula-proof-note">
                      Subtractions: $1 - \cos^2\theta = \sin^2\theta$ and $1 - \sin^2\theta = \cos^2\theta$
                    </span>
                  </div>
                ) : selectedVertex === 'tan' || selectedVertex === 'sec' ? (
                  <div className="formula-display-item pyth-highlight">
                    <MathText text="Lower-Left Triangle: $$\tan^2\theta + 1 = \sec^2\theta$$" />
                    <span className="formula-proof-note">
                      Subtractions: $\sec^2\theta - \tan^2\theta = 1$ and $\sec^2\theta - 1 = \tan^2\theta$
                    </span>
                  </div>
                ) : (
                  <div className="formula-display-item pyth-highlight">
                    <MathText text="Lower-Right Triangle: $$1 + \cot^2\theta = \text{cosec}^2\theta$$" />
                    <span className="formula-proof-note">
                      Subtractions: cosec²θ - cot²θ = 1 and cosec²θ - 1 = cot²θ
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: 5-SECOND SETUP */}
          {activeTab === 'setup' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Exam Hall Routine</span>
                <h2 className="panel-heading">The 5-Second Setup Rule</h2>
                <p className="panel-desc">
                  When you open your exam rough sheet, sketch this in 5 seconds using four foolproof steps:
                </p>
              </div>

              <div className="setup-steps-list">
                <div
                  className={`setup-step-box ${setupStep === 1 ? 'active-step' : ''}`}
                  onClick={() => setSetupStep(1)}
                >
                  <div className="step-num-badge">1</div>
                  <div className="step-info">
                    <strong>Draw 6-sided Hexagon &amp; Center 1</strong>
                    <p>Sketch a regular 6-sided polygon and write <strong>1</strong> at the center point.</p>
                  </div>
                </div>

                <div
                  className={`setup-step-box ${setupStep === 2 ? 'active-step' : ''}`}
                  onClick={() => setSetupStep(2)}
                >
                  <div className="step-num-badge">2</div>
                  <div className="step-info">
                    <strong>Apply The &quot;CO&quot; Rule on the Right Side</strong>
                    <p>All ratios starting with &quot;Co&quot; go on the right side: <strong>cos θ</strong>, <strong>cot θ</strong>, <strong>cosec θ</strong>.</p>
                  </div>
                </div>

                <div
                  className={`setup-step-box ${setupStep === 3 ? 'active-step' : ''}`}
                  onClick={() => setSetupStep(3)}
                >
                  <div className="step-num-badge">3</div>
                  <div className="step-info">
                    <strong>Fill the Left Side (tan, sin, sec)</strong>
                    <p>Place remaining three ratios on the left: <strong>tan θ</strong>, <strong>sin θ</strong>, and <strong>sec θ</strong>.</p>
                  </div>
                </div>

                <div
                  className={`setup-step-box ${setupStep === 4 ? 'active-step' : ''}`}
                  onClick={() => setSetupStep(4)}
                >
                  <div className="step-num-badge">4</div>
                  <div className="step-info">
                    <strong>Verify Clockwise Starting from Far-Left tan θ</strong>
                    <p>
                      <MathText text="$\\tan\\theta \\longrightarrow \\sin\\theta \\longrightarrow \\cos\\theta \\longrightarrow \\cot\\theta \\longrightarrow \\text{cosec}\\,\\theta \\longrightarrow \\sec\\theta$" />
                    </p>
                  </div>
                </div>
              </div>

              <div className="setup-callout-box">
                <strong>💡 Pro-Tip for Board Papers:</strong>
                <p>
                  Draw this at the top of your rough sheet during the initial 15-minute question paper reading time.
                  It completely eliminates identity confusion in 3-mark proofs and 1-mark Section A MCQs!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RECIPROCAL IDENTITIES */}
          {activeTab === 'reciprocal' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Rule 1</span>
                <h2 className="panel-heading">The Diagonal Rule (Reciprocal Identities)</h2>
                <p className="panel-desc">
                  Any two opposite corners passing through the center <strong>1</strong> multiply to <strong>1</strong>:
                </p>
              </div>

              <div className="rules-grid-cards">
                <div className="rule-card">
                  <div className="rule-card-header">
                    <span className="rule-corner-tag">sin θ ↔ cosec θ</span>
                    <span className="rule-badge">Pair 1</span>
                  </div>
                  <div className="rule-math-row">
                    <MathText text="$$\\sin\\theta \\times \\text{cosec}\\,\\theta = 1$$" />
                  </div>
                  <div className="rule-consequences">
                    <MathText text="$$\\sin\\theta = \\frac{1}{\\text{cosec}\\,\\theta}, \\quad \\text{cosec}\\,\\theta = \\frac{1}{\\sin\\theta}$$" />
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-card-header">
                    <span className="rule-corner-tag">cos θ ↔ sec θ</span>
                    <span className="rule-badge">Pair 2</span>
                  </div>
                  <div className="rule-math-row">
                    <MathText text="$$\\cos\\theta \\times \\sec\\theta = 1$$" />
                  </div>
                  <div className="rule-consequences">
                    <MathText text="$$\\cos\\theta = \\frac{1}{\\sec\\theta}, \\quad \\sec\\theta = \\frac{1}{\\cos\\theta}$$" />
                  </div>
                </div>

                <div className="rule-card">
                  <div className="rule-card-header">
                    <span className="rule-corner-tag">tan θ ↔ cot θ</span>
                    <span className="rule-badge">Pair 3</span>
                  </div>
                  <div className="rule-math-row">
                    <MathText text="$$\\tan\\theta \\times \\cot\\theta = 1$$" />
                  </div>
                  <div className="rule-consequences">
                    <MathText text="$$\\tan\\theta = \\frac{1}{\\cot\\theta}, \\quad \\cot\\theta = \\frac{1}{\\tan\\theta}$$" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QUOTIENT IDENTITIES */}
          {activeTab === 'quotients' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Rule 2</span>
                <h2 className="panel-heading">Quotient Rule (Clockwise &amp; Counter-Clockwise)</h2>
                <p className="panel-desc">
                  Pick any corner. It equals the <strong>next corner</strong> divided by the <strong>corner after it</strong>!
                </p>
              </div>

              <div className="direction-toggle-row">
                <button
                  type="button"
                  className={`dir-toggle-btn ${quotientDirection === 'clockwise' ? 'active-dir' : ''}`}
                  onClick={() => setQuotientDirection('clockwise')}
                >
                  🔄 Clockwise Flow (↷)
                </button>
                <button
                  type="button"
                  className={`dir-toggle-btn ${quotientDirection === 'counter' ? 'active-dir' : ''}`}
                  onClick={() => setQuotientDirection('counter')}
                >
                  ↩️ Counter-Clockwise Flow (↶)
                </button>
              </div>

              {quotientDirection === 'clockwise' ? (
                <div className="rules-grid-cards">
                  <div className="rule-card">
                    <span className="rule-corner-tag">tan θ</span>
                    <MathText text="$$\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">sin θ</span>
                    <MathText text="$$\\sin\\theta = \\frac{\\cos\\theta}{\\cot\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">cos θ</span>
                    <MathText text="$$\\cos\\theta = \\frac{\\cot\\theta}{\\text{cosec}\\,\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">cot θ</span>
                    <MathText text="$$\\cot\\theta = \\frac{\\text{cosec}\\,\\theta}{\\sec\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">cosec θ</span>
                    <MathText text="$$\\text{cosec}\\,\\theta = \\frac{\\sec\\theta}{\\tan\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">sec θ</span>
                    <MathText text="$$\\sec\\theta = \\frac{\\tan\\theta}{\\sin\\theta}$$" />
                  </div>
                </div>
              ) : (
                <div className="rules-grid-cards">
                  <div className="rule-card">
                    <span className="rule-corner-tag">cot θ</span>
                    <MathText text="$$\\cot\\theta = \\frac{\\cos\\theta}{\\sin\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">cos θ</span>
                    <MathText text="$$\\cos\\theta = \\frac{\\sin\\theta}{\\tan\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">sin θ</span>
                    <MathText text="$$\\sin\\theta = \\frac{\\tan\\theta}{\\sec\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">tan θ</span>
                    <MathText text="$$\\tan\\theta = \\frac{\\sec\\theta}{\\text{cosec}\\,\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">sec θ</span>
                    <MathText text="$$\\sec\\theta = \\frac{\\text{cosec}\\,\\theta}{\\cot\\theta}$$" />
                  </div>
                  <div className="rule-card">
                    <span className="rule-corner-tag">cosec θ</span>
                    <MathText text="$$\\text{cosec}\\,\\theta = \\frac{\\cot\\theta}{\\cos\\theta}$$" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NEIGHBOR PRODUCT RULE */}
          {activeTab === 'product' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Rule 3</span>
                <h2 className="panel-heading">Neighbor Product Rule</h2>
                <p className="panel-desc">
                  Any corner equals the product of its two adjacent immediate neighbors!
                </p>
              </div>

              <div className="rules-grid-cards">
                <div className="rule-card">
                  <span className="rule-corner-tag">sin θ (between tan &amp; cos)</span>
                  <MathText text="$$\\sin\\theta = \\tan\\theta \\times \\cos\\theta$$" />
                  <span className="rule-card-subtext">Since (sin θ / cos θ) × cos θ = sin θ</span>
                </div>
                <div className="rule-card">
                  <span className="rule-corner-tag">cos θ (between sin &amp; cot)</span>
                  <MathText text="$$\\cos\\theta = \\sin\\theta \\times \\cot\\theta$$" />
                  <span className="rule-card-subtext">Since sin θ × (cos θ / sin θ) = cos θ</span>
                </div>
                <div className="rule-card">
                  <span className="rule-corner-tag">tan θ (between sec &amp; sin)</span>
                  <MathText text="$$\\tan\\theta = \\sec\\theta \\times \\sin\\theta$$" />
                  <span className="rule-card-subtext">Since (1 / cos θ) × sin θ = tan θ</span>
                </div>
                <div className="rule-card">
                  <span className="rule-corner-tag">cot θ (between cos &amp; cosec)</span>
                  <MathText text="$$\\cot\\theta = \\cos\\theta \\times \\text{cosec}\\,\\theta$$" />
                  <span className="rule-card-subtext">Since cos θ × (1 / sin θ) = cot θ</span>
                </div>
                <div className="rule-card">
                  <span className="rule-corner-tag">cosec θ (between cot &amp; sec)</span>
                  <MathText text="$$\\text{cosec}\\,\\theta = \\cot\\theta \\times \\sec\\theta$$" />
                  <span className="rule-card-subtext">Since (cos θ / sin θ) × (1 / cos θ) = 1 / sin θ</span>
                </div>
                <div className="rule-card">
                  <span className="rule-corner-tag">sec θ (between cosec &amp; tan)</span>
                  <MathText text="$$\\sec\\theta = \\text{cosec}\\,\\theta \\times \\tan\\theta$$" />
                  <span className="rule-card-subtext">Since (1 / sin θ) × (sin θ / cos θ) = 1 / cos θ</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PYTHAGOREAN IDENTITIES */}
          {activeTab === 'pythagorean' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Rule 4</span>
                <h2 className="panel-heading">The 3 Inverted Triangles (Pythagorean Identities)</h2>
                <p className="panel-desc">
                  Look at the three shaded downward-pointing triangles. Moving clockwise:
                  <br />
                  <strong>(Top-Left Corner)² + (Top-Right Corner)² = (Bottom Corner)²</strong>
                </p>
              </div>

              {/* Triangle selector tabs */}
              <div className="triangle-toggle-row">
                <button
                  type="button"
                  className={`tri-btn ${pythagoreanTriangle === 'top' ? 'active-tri' : ''}`}
                  onClick={() => setPythagoreanTriangle('top')}
                >
                  🔻 Top Triangle (sin - cos - 1)
                </button>
                <button
                  type="button"
                  className={`tri-btn ${pythagoreanTriangle === 'lower-left' ? 'active-tri' : ''}`}
                  onClick={() => setPythagoreanTriangle('lower-left')}
                >
                  🔻 Lower-Left (tan - 1 - sec)
                </button>
                <button
                  type="button"
                  className={`tri-btn ${pythagoreanTriangle === 'lower-right' ? 'active-tri' : ''}`}
                  onClick={() => setPythagoreanTriangle('lower-right')}
                >
                  🔻 Lower-Right (1 - cot - cosec)
                </button>
              </div>

              {pythagoreanTriangle === 'top' && (
                <div className="triangle-detail-card">
                  <div className="tri-header">
                    <h3>1. Top Triangle: sin θ, cos θ, and 1</h3>
                    <span className="tri-badge">Core Identity</span>
                  </div>
                  <div className="tri-main-formula">
                    <MathText text="$$\\sin^2\\theta + \\cos^2\\theta = 1$$" />
                  </div>
                  <div className="tri-reverse-section">
                    <strong>Reverse (Going counter-clockwise gives subtractions):</strong>
                    <div className="subtraction-pills">
                      <div className="sub-pill">
                        <MathText text="$$1 - \\cos^2\\theta = \\sin^2\\theta$$" />
                      </div>
                      <div className="sub-pill">
                        <MathText text="$$1 - \\sin^2\\theta = \\cos^2\\theta$$" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pythagoreanTriangle === 'lower-left' && (
                <div className="triangle-detail-card">
                  <div className="tri-header">
                    <h3>2. Lower-Left Triangle: tan θ, 1, and sec θ</h3>
                    <span className="tri-badge">Identity 2</span>
                  </div>
                  <div className="tri-main-formula">
                    <MathText text="$$\\tan^2\\theta + 1 = \\sec^2\\theta$$" />
                  </div>
                  <div className="tri-reverse-section">
                    <strong>Reverse Subtractions (Board Exam Favorites):</strong>
                    <div className="subtraction-pills">
                      <div className="sub-pill">
                        <MathText text="$$\\sec^2\\theta - \\tan^2\\theta = 1$$" />
                        <span className="sub-note">Used in factoring: $(\sec\theta+\tan\theta)(\sec\theta-\tan\theta)=1$</span>
                      </div>
                      <div className="sub-pill">
                        <MathText text="$$\\sec^2\\theta - 1 = \\tan^2\\theta$$" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pythagoreanTriangle === 'lower-right' && (
                <div className="triangle-detail-card">
                  <div className="tri-header">
                    <h3>3. Lower-Right Triangle: 1, cot θ, and cosec θ</h3>
                    <span className="tri-badge">Identity 3</span>
                  </div>
                  <div className="tri-main-formula">
                    <MathText text="$$1 + \\cot^2\\theta = \\text{cosec}^2\\theta$$" />
                  </div>
                  <div className="tri-reverse-section">
                    <strong>Reverse Subtractions:</strong>
                    <div className="subtraction-pills">
                      <div className="sub-pill">
                        <MathText text="$$\\text{cosec}^2\\theta - \\cot^2\\theta = 1$$" />
                      </div>
                      <div className="sub-pill">
                        <MathText text="$$\\text{cosec}^2\\theta - 1 = \\cot^2\\theta$$" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: 30S RAPID DRILL */}
          {activeTab === 'drill' && (
            <div className="panel-tab-content">
              <div className="panel-title-wrap">
                <span className="panel-kicker">Active Recall</span>
                <h2 className="panel-heading">30-Second Rapid Recall Challenge</h2>
                <p className="panel-desc">
                  Test whether you can derive trigonometric identities instantly using the hexagon mnemonic:
                </p>
              </div>

              <div className="drill-score-strip">
                <span>Score: <strong>{drillScore.correct}</strong> / {drillScore.total}</span>
                <span className="drill-q-num">Question {activeDrillIndex + 1} of {drillQuestions.length}</span>
              </div>

              <div className="drill-card">
                <p className="drill-question-text">{drillQuestions[activeDrillIndex].q}</p>

                <div className="drill-options-grid">
                  {drillQuestions[activeDrillIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      className="btn-drill-opt"
                      onClick={() => handleDrillOption(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {drillFeedback && (
                  <div className={`drill-feedback-banner ${drillFeedback.startsWith('✅') ? 'success' : 'error'}`}>
                    {drillFeedback}
                  </div>
                )}

                <div className="drill-actions">
                  <button
                    type="button"
                    className="btn-next-drill"
                    onClick={nextDrillQuestion}
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cross-Link Footer to Question Bank & Cheatsheets */}
      <div className="hexagon-footer-links">
        <div className="footer-link-card">
          <span className="footer-card-icon">📝</span>
          <div>
            <strong>Practice Class 10 Trigonometry PYQs</strong>
            <p>Solve 2022–2026 board exam questions and exemplar proofs with Tara hints.</p>
          </div>
          <Link href="/questions" className="btn-link-action">
            Browse PYQs →
          </Link>
        </div>

        <div className="footer-link-card">
          <span className="footer-card-icon">⚡</span>
          <div>
            <strong>All 27 Chapter Formula Cheatsheets</strong>
            <p>1-page printable summary sheets covering Maths and Science formulas.</p>
          </div>
          <Link href="/formula-cheatsheets" className="btn-link-action">
            Open Cheatsheets →
          </Link>
        </div>
      </div>

      <style jsx>{`
        .trig-hexagon-container {
          max-width: 1100px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #24211f;
        }

        .hexagon-header {
          margin-bottom: 1.5rem;
        }

        .header-badge-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .badge-pill {
          background: #effaf3;
          color: #0b7a48;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          border: 1px solid #0b7a48;
          text-transform: uppercase;
        }

        .badge-class {
          font-size: 0.8rem;
          color: #787168;
          font-weight: 700;
        }

        .badge-time {
          background: #fef3c7;
          color: #b45309;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          border: 1px solid #f59e0b;
        }

        .header-title {
          font-size: 2.15rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.5rem;
          line-height: 1.2;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 1.05rem;
          color: #55514b;
          line-height: 1.5;
          margin: 0;
        }

        /* Tara Socratic Exam Hall Hint Card */
        .tara-socratic-banner {
          display: flex;
          gap: 1.25rem;
          background: #fffdf8;
          border: 2px solid #24211f;
          border-radius: 12px;
          padding: 1.1rem 1.3rem;
          margin-bottom: 1.75rem;
          box-shadow: 4px 4px 0 #24211f;
        }

        .tara-avatar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
        }

        .tara-avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #d9f99d;
          border: 2px solid #24211f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .tara-name-tag {
          font-size: 0.75rem;
          font-weight: 800;
          background: #24211f;
          color: #ffffff;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }

        .tara-content-col {
          flex: 1;
        }

        .tara-eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          color: #a84a08;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.3rem;
        }

        .tara-quote {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #24211f;
        }

        /* Tabs Nav */
        .hexagon-tabs-nav {
          display: flex;
          gap: 0.45rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .tab-btn {
          background: #ffffff;
          border: 2px solid #24211f;
          border-radius: 8px;
          padding: 0.55rem 0.85rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #24211f;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .tab-btn:hover {
          background: #fdfaf4;
          transform: translateY(-1px);
        }

        .tab-btn.active {
          background: #24211f;
          color: #ffffff;
          box-shadow: 2px 2px 0 #d26b16;
        }

        /* Grid */
        .hexagon-workspace-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          .hexagon-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        .hexagon-canvas-card {
          background: #fffdf8;
          border: 2.5px solid #24211f;
          border-radius: 14px;
          padding: 1.25rem;
          box-shadow: 6px 6px 0 #24211f;
        }

        .canvas-instruction-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          padding: 0.45rem 0.8rem;
          font-size: 0.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .active-tag {
          background: #d26b16;
          color: #ffffff;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
        }

        .svg-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .hexagon-svg {
          width: 100%;
          max-width: 480px;
          height: auto;
          overflow: visible;
        }

        /* Triangles styling */
        .pyth-triangle {
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .default-triangle {
          fill: #fef3c7;
          opacity: 0.5;
        }

        .default-triangle:hover {
          opacity: 0.85;
          fill: #fde68a;
        }

        .active-triangle {
          fill: #fed7aa;
          stroke: #d26b16;
          stroke-width: 2.5;
          opacity: 0.95;
        }

        .inactive-triangle {
          fill: #f3f4f6;
          opacity: 0.25;
        }

        .pulse-aura {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0% {
            r: 34px;
            opacity: 0.8;
          }
          50% {
            r: 40px;
            opacity: 0.3;
          }
          100% {
            r: 34px;
            opacity: 0.8;
          }
        }

        .vertex-quick-buttons {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          padding-top: 0.8rem;
          border-top: 1.5px solid #e5e5e5;
        }

        .quick-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #787168;
          text-transform: uppercase;
        }

        .btn-corner-pill {
          background: #ffffff;
          border: 1.5px solid #24211f;
          border-radius: 6px;
          padding: 0.25rem 0.55rem;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: 'IBM Plex Mono', monospace;
          cursor: pointer;
        }

        .btn-corner-pill.co-pill {
          background: #fffbeb;
          border-color: #d97706;
          color: #b45309;
        }

        .btn-corner-pill.selected {
          background: #d26b16;
          color: #ffffff;
          border-color: #d26b16;
        }

        /* Details Card */
        .hexagon-details-card {
          background: #fffdf8;
          border: 2.5px solid #24211f;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 6px 6px 0 #24211f;
          min-height: 480px;
        }

        .panel-kicker {
          font-size: 0.75rem;
          font-weight: 800;
          color: #d26b16;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .panel-heading {
          font-size: 1.4rem;
          font-weight: 900;
          color: #171513;
          margin: 0.2rem 0 0.4rem;
        }

        .panel-desc {
          font-size: 0.9rem;
          color: #55514b;
          line-height: 1.45;
          margin-bottom: 1.25rem;
        }

        .formula-block-group {
          margin-bottom: 1.1rem;
        }

        .group-title {
          display: block;
          font-size: 0.8rem;
          font-weight: 800;
          color: #24211f;
          margin-bottom: 0.35rem;
        }

        .formula-display-item {
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 1.05rem;
        }

        .formula-proof-note {
          display: block;
          font-size: 0.75rem;
          color: #787168;
          margin-top: 0.35rem;
          font-weight: 600;
        }

        .pyth-highlight {
          background: #fef3c7;
          border-color: #d97706;
        }

        .quotient-twin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
        }

        @media (max-width: 600px) {
          .quotient-twin-grid {
            grid-template-columns: 1fr;
          }
        }

        .twin-item {
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          padding: 0.6rem 0.75rem;
        }

        .twin-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          color: #787168;
          margin-bottom: 0.2rem;
        }

        /* 5-Second Setup Styles */
        .setup-steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1rem;
        }

        .setup-step-box {
          display: flex;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          background: #f7f2e7;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .setup-step-box.active-step {
          background: #fffbeb;
          border-color: #d26b16;
          box-shadow: 2px 2px 0 #d26b16;
        }

        .step-num-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #24211f;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step-info strong {
          display: block;
          font-size: 0.85rem;
          margin-bottom: 0.2rem;
        }

        .step-info p {
          margin: 0;
          font-size: 0.8rem;
          color: #55514b;
          line-height: 1.35;
        }

        .setup-callout-box {
          background: #f0fdf4;
          border: 1.5px solid #16a34a;
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.85rem;
          color: #166534;
        }

        .setup-callout-box strong {
          display: block;
          margin-bottom: 0.25rem;
        }

        .setup-callout-box p {
          margin: 0;
          line-height: 1.4;
        }

        /* Rules Grid Cards */
        .rules-grid-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .rule-card {
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        .rule-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .rule-corner-tag {
          font-size: 0.8rem;
          font-weight: 800;
          font-family: 'IBM Plex Mono', monospace;
          color: #a84a08;
        }

        .rule-badge {
          font-size: 0.7rem;
          font-weight: 800;
          background: #ffffff;
          border: 1px solid #24211f;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .rule-card-subtext {
          display: block;
          font-size: 0.75rem;
          color: #787168;
          margin-top: 0.25rem;
        }

        .direction-toggle-row,
        .triangle-toggle-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .dir-toggle-btn,
        .tri-btn {
          background: #ffffff;
          border: 1.5px solid #24211f;
          border-radius: 6px;
          padding: 0.45rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .dir-toggle-btn.active-dir,
        .tri-btn.active-tri {
          background: #24211f;
          color: #ffffff;
        }

        .triangle-detail-card {
          background: #fffbeb;
          border: 2px solid #d97706;
          border-radius: 10px;
          padding: 1rem 1.25rem;
        }

        .tri-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .tri-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
        }

        .tri-badge {
          background: #d97706;
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .tri-main-formula {
          background: #ffffff;
          border: 1.5px solid #24211f;
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .tri-reverse-section strong {
          display: block;
          font-size: 0.8rem;
          color: #78350f;
          margin-bottom: 0.45rem;
        }

        .subtraction-pills {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .sub-pill {
          background: #ffffff;
          border: 1px solid #d97706;
          border-radius: 6px;
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
        }

        .sub-note {
          display: block;
          font-size: 0.7rem;
          color: #a84a08;
          margin-top: 0.2rem;
          font-weight: 600;
        }

        /* Rapid Recall Drill */
        .drill-score-strip {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 700;
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          margin-bottom: 1rem;
        }

        .drill-card {
          background: #ffffff;
          border: 2px solid #24211f;
          border-radius: 10px;
          padding: 1.25rem;
        }

        .drill-question-text {
          font-size: 1rem;
          font-weight: 800;
          margin: 0 0 1rem;
          line-height: 1.4;
        }

        .drill-options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .btn-drill-opt {
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 6px;
          padding: 0.6rem 0.85rem;
          font-size: 0.9rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-drill-opt:hover {
          background: #fffbeb;
          border-color: #d26b16;
        }

        .drill-feedback-banner {
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border: 1.5px solid;
        }

        .drill-feedback-banner.success {
          background: #f0fdf4;
          border-color: #16a34a;
          color: #166534;
        }

        .drill-feedback-banner.error {
          background: #fef2f2;
          border-color: #dc2626;
          color: #991b1b;
        }

        .drill-actions {
          display: flex;
          justify-content: flex-end;
        }

        .btn-next-drill {
          background: #24211f;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 0.55rem 1rem;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-next-drill:hover {
          background: #d26b16;
        }

        /* Footer Links */
        .hexagon-footer-links {
          margin-top: 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 700px) {
          .hexagon-footer-links {
            grid-template-columns: 1fr;
          }
        }

        .footer-link-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #fffdf8;
          border: 2px solid #24211f;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          box-shadow: 4px 4px 0 #24211f;
        }

        .footer-card-icon {
          font-size: 1.75rem;
        }

        .footer-link-card strong {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }

        .footer-link-card p {
          margin: 0;
          font-size: 0.8rem;
          color: #55514b;
        }

        .btn-link-action {
          margin-left: auto;
          white-space: nowrap;
          background: #f7f2e7;
          border: 1.5px solid #24211f;
          border-radius: 6px;
          padding: 0.4rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 800;
          color: #24211f;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-link-action:hover {
          background: #24211f;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
