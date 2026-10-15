'use client';

import React, { useId, useMemo, useState } from 'react';
import { calculateMirrorOptics, calculateLensOptics, MirrorOpticsResult, LensOpticsResult } from '../lib/optics-engine';

export interface InteractiveOpticsViewerProps {
  initialType?: 'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens';
  initialObjectDistance?: number;
}

export default function InteractiveOpticsViewer({
  initialType = 'concave-mirror',
  initialObjectDistance = 40,
}: InteractiveOpticsViewerProps) {
  const [opticsType, setOpticsType] = useState<'concave-mirror' | 'convex-mirror' | 'convex-lens' | 'concave-lens'>(
    initialType,
  );
  const [dObj, setDObj] = useState<number>(initialObjectDistance);
  const sliderId = useId();

  const isLens = opticsType.includes('lens');
  const isConcave = opticsType.includes('concave');
  const fMag = 70;

  // Compute certified optics
  const mirrorResult: MirrorOpticsResult | null = useMemo(() => {
    if (isLens) return null;
    return calculateMirrorOptics({
      mirrorType: isConcave ? 'concave' : 'convex',
      focalLengthMag: fMag,
      objectDistanceMag: dObj,
      objectHeight: 35,
      poleX: 270,
      axisY: 140,
    });
  }, [isLens, isConcave, fMag, dObj]);

  const lensResult: LensOpticsResult | null = useMemo(() => {
    if (!isLens) return null;
    return calculateLensOptics({
      lensType: isConcave ? 'concave' : 'convex',
      focalLengthMag: fMag,
      objectDistanceMag: dObj,
      objectHeight: 35,
      opticalCenterX: 250,
      axisY: 140,
    });
  }, [isLens, isConcave, fMag, dObj]);

  const activeResult = mirrorResult || lensResult;

  const presets = useMemo(() => {
    if (opticsType === 'concave-mirror') {
      return [
        { label: 'Between F & P', d: 35 },
        { label: 'At F', d: 70 },
        { label: 'Between C & F', d: 105 },
        { label: 'At C', d: 140 },
        { label: 'Beyond C', d: 190 },
      ];
    }
    if (opticsType === 'convex-lens') {
      return [
        { label: 'Between F1 & O', d: 35 },
        { label: 'At F1', d: 70 },
        { label: 'Between 2F1 & F1', d: 105 },
        { label: 'At 2F1', d: 140 },
        { label: 'Beyond 2F1', d: 190 },
      ];
    }
    return [
      { label: 'Close to Mirror', d: 35 },
      { label: 'Far from Mirror', d: 140 },
    ];
  }, [opticsType]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
        background: '#fff',
        border: '2px solid #24211f',
        borderRadius: '12px',
        padding: '14px',
        boxShadow: '4px 4px 0 #24211f',
        textAlign: 'center',
      }}
    >
      {/* Title & Type Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#24211f' }}>
          NCERT Ray Optics Simulation
        </h4>
        <select
          value={opticsType}
          onChange={(e) => {
            const val = e.target.value as any;
            setOpticsType(val);
            if (val === 'concave-mirror' || val === 'convex-lens') setDObj(35);
            else setDObj(80);
          }}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: "'IBM Plex Mono', monospace",
            borderRadius: '6px',
            border: '1.5px solid #24211f',
            background: '#fef3c7',
            cursor: 'pointer',
          }}
        >
          <option value="concave-mirror">Concave Mirror</option>
          <option value="convex-mirror">Convex Mirror</option>
          <option value="convex-lens">Convex Lens</option>
          <option value="concave-lens">Concave Lens</option>
        </select>
      </div>

      {/* Preset Pills */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setDObj(p.d)}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '999px',
              border: '1px solid #24211f',
              background: Math.abs(dObj - p.d) < 3 ? '#24211f' : '#f8fafc',
              color: Math.abs(dObj - p.d) < 3 ? '#fff' : '#24211f',
              cursor: 'pointer',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 500 280"
        style={{
          width: '100%',
          height: 'auto',
          background: '#fffdf8',
          border: '1.5px solid #24211f',
          borderRadius: '10px',
          display: 'block',
        }}
      >
        <defs>
          <marker
            id="rayArrowOrange"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#f3883b" />
          </marker>
          <marker
            id="rayArrowBlue"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Principal Axis */}
        <line x1="15" y1="140" x2="485" y2="140" stroke="#24211f" strokeWidth="1.5" />

        {/* Optical Element Rendering */}
        {!isLens ? (
          // Mirror rendering at x = 270
          <g>
            <path
              d={isConcave ? 'M 255 30 Q 275 140 255 250' : 'M 285 30 Q 265 140 285 250'}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
            />
            {/* Shading on the back */}
            {isConcave && (
              <path d="M 257 32 Q 277 140 257 248" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
            )}
            <text x="275" y="155" fontSize="12" fontWeight="bold" fill="#24211f">
              P
            </text>
            {/* Focus and Center markers */}
            {mirrorResult && (
              <>
                <circle cx={mirrorResult.focus.x} cy="140" r="3.5" fill="#f3883b" />
                <text x={mirrorResult.focus.x - 4} y="156" fontSize="12" fontWeight="bold" fill="#f3883b">
                  F
                </text>
                <circle cx={mirrorResult.centerOfCurvature.x} cy="140" r="3.5" fill="#f3883b" />
                <text x={mirrorResult.centerOfCurvature.x - 4} y="156" fontSize="12" fontWeight="bold" fill="#f3883b">
                  C
                </text>
              </>
            )}
          </g>
        ) : (
          // Lens rendering at x = 250
          <g>
            <ellipse
              cx="250"
              cy="140"
              rx={isConcave ? 5 : 8}
              ry="110"
              fill={isConcave ? 'none' : 'rgba(37, 99, 235, 0.1)'}
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <text x="254" y="155" fontSize="12" fontWeight="bold" fill="#24211f">
              O
            </text>
            {lensResult && (
              <>
                <circle cx={lensResult.focus1.x} cy="140" r="3" fill="#f3883b" />
                <text x={lensResult.focus1.x - 6} y="156" fontSize="11" fontWeight="bold" fill="#f3883b">
                  F₁
                </text>
                <circle cx={lensResult.focus2.x} cy="140" r="3" fill="#f3883b" />
                <text x={lensResult.focus2.x - 6} y="156" fontSize="11" fontWeight="bold" fill="#f3883b">
                  F₂
                </text>
                <circle cx={lensResult.twoFocus1.x} cy="140" r="3" fill="#f3883b" />
                <text x={lensResult.twoFocus1.x - 10} y="156" fontSize="11" fontWeight="bold" fill="#f3883b">
                  2F₁
                </text>
                <circle cx={lensResult.twoFocus2.x} cy="140" r="3" fill="#f3883b" />
                <text x={lensResult.twoFocus2.x - 10} y="156" fontSize="11" fontWeight="bold" fill="#f3883b">
                  2F₂
                </text>
              </>
            )}
          </g>
        )}

        {/* Dynamic Object Arrow */}
        {activeResult && (
          <g>
            <line
              x1={activeResult.objectBase.x}
              y1={activeResult.objectBase.y}
              x2={activeResult.objectTip.x}
              y2={activeResult.objectTip.y}
              stroke="#dc2626"
              strokeWidth="3"
            />
            {/* Arrowhead */}
            <polygon
              points={`${activeResult.objectTip.x - 4},${activeResult.objectTip.y + 7} ${activeResult.objectTip.x + 4},${activeResult.objectTip.y + 7} ${activeResult.objectTip.x},${activeResult.objectTip.y}`}
              fill="#dc2626"
            />
            <text
              x={activeResult.objectTip.x}
              y={activeResult.objectTip.y - 6}
              fontSize="11"
              fontWeight="bold"
              fill="#dc2626"
              textAnchor="middle"
            >
              Object
            </text>
          </g>
        )}

        {/* Dynamic Ray 1: Parallel to Axis */}
        {activeResult && (
          <g>
            <line
              x1={activeResult.ray1Incident.x1}
              y1={activeResult.ray1Incident.y1}
              x2={activeResult.ray1Incident.x2}
              y2={activeResult.ray1Incident.y2}
              stroke="#f3883b"
              strokeWidth="2"
              markerEnd="url(#rayArrowOrange)"
            />
            {/* Reflected / Refracted Ray */}
            <line
              x1={!isLens ? (activeResult as MirrorOpticsResult).ray1Reflected.x1 : (activeResult as LensOpticsResult).ray1Refracted.x1}
              y1={!isLens ? (activeResult as MirrorOpticsResult).ray1Reflected.y1 : (activeResult as LensOpticsResult).ray1Refracted.y1}
              x2={!isLens ? (activeResult as MirrorOpticsResult).ray1Reflected.x2 : (activeResult as LensOpticsResult).ray1Refracted.x2}
              y2={!isLens ? (activeResult as MirrorOpticsResult).ray1Reflected.y2 : (activeResult as LensOpticsResult).ray1Refracted.y2}
              stroke="#f3883b"
              strokeWidth="2"
            />
            {/* Virtual Backward Extension (Dashed) */}
            {activeResult.ray1Virtual && (
              <line
                x1={activeResult.ray1Virtual.x1}
                y1={activeResult.ray1Virtual.y1}
                x2={activeResult.ray1Virtual.x2}
                y2={activeResult.ray1Virtual.y2}
                stroke="#f3883b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}
          </g>
        )}

        {/* Dynamic Ray 2: Incident to Pole or Optical Center */}
        {activeResult && (
          <g>
            <line
              x1={activeResult.ray2Incident.x1}
              y1={activeResult.ray2Incident.y1}
              x2={activeResult.ray2Incident.x2}
              y2={activeResult.ray2Incident.y2}
              stroke="#2563eb"
              strokeWidth="2"
              markerEnd="url(#rayArrowBlue)"
            />
            {/* Reflected / Refracted Ray */}
            <line
              x1={!isLens ? (activeResult as MirrorOpticsResult).ray2Reflected.x1 : (activeResult as LensOpticsResult).ray2Refracted.x1}
              y1={!isLens ? (activeResult as MirrorOpticsResult).ray2Reflected.y1 : (activeResult as LensOpticsResult).ray2Refracted.y1}
              x2={!isLens ? (activeResult as MirrorOpticsResult).ray2Reflected.x2 : (activeResult as LensOpticsResult).ray2Refracted.x2}
              y2={!isLens ? (activeResult as MirrorOpticsResult).ray2Reflected.y2 : (activeResult as LensOpticsResult).ray2Refracted.y2}
              stroke="#2563eb"
              strokeWidth="2"
            />
            {/* Virtual Backward Extension (Dashed) */}
            {activeResult.ray2Virtual && (
              <line
                x1={activeResult.ray2Virtual.x1}
                y1={activeResult.ray2Virtual.y1}
                x2={activeResult.ray2Virtual.x2}
                y2={activeResult.ray2Virtual.y2}
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            )}
          </g>
        )}

        {/* Dynamic Image Arrow */}
        {activeResult && activeResult.imageBase && activeResult.imageTip && (
          <g>
            <line
              x1={activeResult.imageBase.x}
              y1={activeResult.imageBase.y}
              x2={activeResult.imageTip.x}
              y2={activeResult.imageTip.y}
              stroke="#16a34a"
              strokeWidth="3"
              strokeDasharray={activeResult.isVirtual ? '4 4' : undefined}
            />
            {/* Arrowhead (points UP if erect, DOWN if inverted) */}
            {activeResult.isErect ? (
              <polygon
                points={`${activeResult.imageTip.x - 4},${activeResult.imageTip.y + 7} ${activeResult.imageTip.x + 4},${activeResult.imageTip.y + 7} ${activeResult.imageTip.x},${activeResult.imageTip.y}`}
                fill="#16a34a"
              />
            ) : (
              <polygon
                points={`${activeResult.imageTip.x - 4},${activeResult.imageTip.y - 7} ${activeResult.imageTip.x + 4},${activeResult.imageTip.y - 7} ${activeResult.imageTip.x},${activeResult.imageTip.y}`}
                fill="#16a34a"
              />
            )}
            <text
              x={activeResult.imageTip.x}
              y={activeResult.isErect ? activeResult.imageTip.y - 6 : activeResult.imageTip.y + 14}
              fontSize="11"
              fontWeight="bold"
              fill="#16a34a"
              textAnchor="middle"
            >
              Image ({activeResult.isVirtual ? 'Virtual' : 'Real'})
            </text>
          </g>
        )}
      </svg>

      {/* Slider Controls */}
      <div style={{ marginTop: '12px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
          <label htmlFor={sliderId}>Object Distance from Pole (u):</label>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#dc2626' }}>
            -{Math.round(dObj)} cm
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min="15"
          max="200"
          value={dObj}
          onChange={(e) => setDObj(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#f3883b', margin: '6px 0', cursor: 'pointer' }}
        />
      </div>

      {/* Dynamic NCERT Case Badge & Readout */}
      {activeResult && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#fef3c7',
            border: '1.5px solid #24211f',
            borderRadius: '8px',
            fontSize: '11px',
            textAlign: 'left',
          }}
        >
          <div style={{ fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
            {activeResult.ncertTableCase}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#24211f', fontWeight: 600 }}>
            {activeResult.readoutText}
          </div>
        </div>
      )}
    </div>
  );
}
