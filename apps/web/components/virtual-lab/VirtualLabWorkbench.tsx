'use client';

import React, { useState, useRef, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  Flame,
  Atom,
  RotateCcw,
  Sparkles,
  Search,
  Box,
  AlertTriangle,
  ShieldCheck,
  Heart,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  Compass,
  CheckCircle2,
  BookOpen,
  Zap,
} from 'lucide-react';

import './virtual-lab.css';
import { ASSET_REGISTRY } from './data/assetRegistry';
import { MagnesiumBurningModel } from './MagnesiumBurningModel';
import { PrismRefractionModel } from './PrismRefractionModel';
import { HeartModel } from './HeartModel';
import { AssetStudioInspector } from './AssetStudioInspector';
import { ScienceLabWorkbenchTable } from './ScienceLabWorkbenchTable';
import { SCIENCE_KNOWLEDGE, OKF_CONCEPTS } from './data/scienceKnowledge';
import { ANATOMY_KNOWLEDGE } from './data/anatomy';
import { CbsePastQuestionsAccordion } from './CbsePastQuestionsAccordion';
import { OneMinuteRevisionCard } from './OneMinuteRevisionCard';

export type VirtualLabWorkbenchProps = {
  mode?: 'full' | 'activity';
  initialExperiment?: 'magnesium' | 'prism' | 'heart';
  activityId?: string;
  onClose?: () => void;
};

export default function VirtualLabWorkbench({
  mode = 'full',
  initialExperiment = 'magnesium',
  activityId,
  onClose,
}: VirtualLabWorkbenchProps) {
  // Main Tab in Full Mode: 'experiments' | 'questions' | 'revision' | 'apparatus' | 'misconceptions'
  const [activeTab, setActiveTab] = useState<'experiments' | 'questions' | 'revision' | 'apparatus' | 'misconceptions'>('experiments');

  // Active Experiment
  const [selectedExperiment, setSelectedExperiment] = useState<'magnesium' | 'prism' | 'heart'>(
    initialExperiment || (activityId === '11.2' || activityId === 'optical-prism' ? 'prism' : 'magnesium')
  );

  // Fullscreen & UI Layout States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<'daylight' | 'darkroom' | 'studio'>('daylight');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);

  // =========================================================================
  // CHEMISTRY: MAGNESIUM EXPERIMENT STATE
  // =========================================================================
  const [burnStage, setBurnStage] = useState<'unheated' | 'heating' | 'burning' | 'collected'>('heating');
  const [showBohrDiagram, setShowBohrDiagram] = useState<boolean>(false);
  const [chemSelectedPart, setChemSelectedPart] = useState<string>('chem-magnesium-ribbon');

  // =========================================================================
  // PHYSICS: PRISM REFRACTION STATE
  // =========================================================================
  const [prismStep, setPrismStep] = useState<1 | 2 | 3 | 4>(4);
  const [prismSelectedPart, setPrismSelectedPart] = useState<string>('prism-glass-body');

  // =========================================================================
  // BIOLOGY: HEART CIRCULATION STATE
  // =========================================================================
  const [heartCircuit, setHeartCircuit] = useState<'all' | 'pulmonary' | 'systemic'>('all');
  const [heartSelectedPart, setHeartSelectedPart] = useState<string>('human-heart-left-ventricle');

  // =========================================================================
  // APPARATUS STUDIO INSPECTOR STATE
  // =========================================================================
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bunsen-burner');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'physics' | 'chemistry' | 'biology' | 'electricity'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showSockets, setShowSockets] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const selectedAsset = ASSET_REGISTRY.find((a) => a.id === selectedAssetId) || ASSET_REGISTRY[0];

  const filteredAssets = useMemo(() => {
    return ASSET_REGISTRY.filter((asset) => {
      const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        asset.name.toLowerCase().includes(q) ||
        asset.id.toLowerCase().includes(q) ||
        asset.tags.some((t) => t.toLowerCase().includes(q)) ||
        asset.semanticDescription.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Default Perspective Camera Angle: Wide 3/4 Isometric Lab Overview (Z-up coordinate system)
  const cameraConfig = useMemo(() => {
    if (selectedExperiment === 'prism') {
      return { position: [0.65, -1.25, 0.70] as [number, number, number], fov: 42 };
    } else if (selectedExperiment === 'heart') {
      return { position: [0.55, -1.05, 0.60] as [number, number, number], fov: 38 };
    } else if (selectedExperiment === 'magnesium') {
      return { position: [0.65, -1.25, 0.70] as [number, number, number], fov: 42 };
    } else {
      return { position: [0.65, -1.25, 0.70] as [number, number, number], fov: 42 };
    }
  }, [selectedExperiment]);

  // Camera Presets (Z-up coordinate system with proper distances)
  const setCameraPreset = (preset: 'isometric' | 'front' | 'top' | 'side' | 'closeup' | 'reset') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (preset === 'reset' || preset === 'isometric') {
      if (selectedExperiment === 'prism') {
        controls.object.position.set(0.65, -1.25, 0.70);
        controls.target.set(0, 0, 0.02);
      } else if (selectedExperiment === 'heart') {
        controls.object.position.set(0.55, -1.05, 0.60);
        controls.target.set(0, 0, 0.04);
      } else if (selectedExperiment === 'magnesium') {
        controls.object.position.set(0.65, -1.25, 0.70);
        controls.target.set(0, 0, 0.02);
      } else {
        controls.object.position.set(0.65, -1.25, 0.70);
        controls.target.set(0, 0, 0.02);
      }
    } else if (preset === 'front') {
      controls.object.position.set(0.0, -1.45, 0.24);
      controls.target.set(0, 0, 0.02);
    } else if (preset === 'top') {
      controls.object.position.set(0.0, -0.01, 1.65);
      controls.target.set(0, 0, 0.0);
    } else if (preset === 'side') {
      controls.object.position.set(1.40, -0.35, 0.60);
      controls.target.set(0, 0, 0.02);
    } else if (preset === 'closeup') {
      controls.object.position.set(0.28, -0.52, 0.26);
      controls.target.set(0, 0, 0.04);
    }
    controls.update();
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;
    const factor = direction === 'in' ? 0.82 : 1.22;
    camera.position.multiplyScalar(factor);
    controls.update();
  };

  // Magnesium Knowledge Lookup
  const chemPartInfo = SCIENCE_KNOWLEDGE[chemSelectedPart] || {
    name: 'Magnesium Ribbon Setup',
    category: 'chemistry',
    subType: 'Activity 1.1 Apparatus',
    description: 'Cleaned ribbon held in lab tongs over Bunsen burner with watch glass collection plate.',
    cbseKeyPoint: 'Must be cleaned with sandpaper prior to burning to remove magnesium oxide coating.',
    formulaOrEquation: '2Mg(s) + O2(g) -> 2MgO(s) + Heat',
  };

  // Prism Knowledge Lookup
  const prismPartInfo = SCIENCE_KNOWLEDGE[prismSelectedPart] || {
    name: 'Glass Prism Refraction',
    category: 'physics',
    subType: 'Optical Refractive Setup',
    description: 'Equilateral glass prism on lab table with monochromatic/white ray beam.',
    cbseKeyPoint: 'Universal Prism Formula: A + delta = i + e (Angle of Prism + Deviation = Incidence + Emergence).',
    formulaOrEquation: 'A + delta = i + e',
  };

  // Heart Knowledge Lookup
  const heartPartInfo = ANATOMY_KNOWLEDGE[heartSelectedPart] || {
    name: 'Human Heart (Double Circulation)',
    circuit: 'all',
    bloodType: 'Oxygenated & Deoxygenated',
    function: 'Pumps blood separately through pulmonary circuit (lungs) and systemic circuit (body).',
    cbseKeyPoint: 'Complete separation of oxygenated and deoxygenated blood allows high efficiency of energy supply in warm-blooded animals.',
  };

  return (
    <div className={`vlab-workbench ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* =================================================================== */}
      {/* 1. TOP HEADER & GLOBAL NAVIGATION BAR                               */}
      {/* =================================================================== */}
      <div className="vlab-header">
        <div className="vlab-brand">
          <div className="vlab-icon-badge">🔬</div>
          <div className="vlab-title-group">
            <div className="vlab-title-row">
              <span className="vlab-title">CBSE 3D Virtual Science Lab</span>
              <span className="vlab-tag">NCERT 3D Studio</span>
            </div>
            <p className="vlab-subtitle">
              Interactive Class 10 Experiments, Real-Time Physics &amp; 36 Apparatus Models
            </p>
          </div>
        </div>

        {/* Global Segmented Tab Switcher */}
        {mode === 'full' && (
          <div className="vlab-tabs-nav">
            <button
              onClick={() => setActiveTab('experiments')}
              className={`vlab-tab-btn ${activeTab === 'experiments' ? 'is-active' : ''}`}
            >
              <Flame size={14} color="#f3883b" />
              <span>3D Lab</span>
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`vlab-tab-btn ${activeTab === 'questions' ? 'is-active' : ''}`}
            >
              <BookOpen size={14} color="#ea580c" />
              <span>5-Yr Board Qs</span>
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`vlab-tab-btn ${activeTab === 'revision' ? 'is-active' : ''}`}
            >
              <Zap size={14} color="#eab308" />
              <span>1-Min Cheat Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab('apparatus')}
              className={`vlab-tab-btn ${activeTab === 'apparatus' ? 'is-active' : ''}`}
            >
              <Box size={14} color="#0284c7" />
              <span>3D Apparatus ({ASSET_REGISTRY.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('misconceptions')}
              className={`vlab-tab-btn ${activeTab === 'misconceptions' ? 'is-active' : ''}`}
            >
              <ShieldCheck size={14} color="#059669" />
              <span>NCERT Traps</span>
            </button>
          </div>
        )}

        {/* Right Header Action Controls */}
        <div className="vlab-header-actions">
          {(activeTab === 'experiments' || activeTab === 'apparatus') && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="vlab-action-btn"
              title={isSidebarCollapsed ? 'Show Controls Panel' : 'Hide Controls for Full 3D View'}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              <span>{isSidebarCollapsed ? 'Show Controls' : 'Full Canvas'}</span>
            </button>
          )}

          <button
            onClick={() => setCameraPreset('reset')}
            className="vlab-action-btn"
            title="Reset to 3D 3/4 Isometric Perspective"
          >
            <RotateCcw size={14} color="#6f665c" />
            <span>Reset 3D</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`vlab-action-btn ${isFullscreen ? 'is-primary' : ''}`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} color="#f3883b" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {onClose && (
            <button onClick={onClose} className="vlab-action-btn is-danger">
              Back to 2D
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. TAB CONTENT 1: INTERACTIVE EXPERIMENTS                           */}
      {/* =================================================================== */}
      {activeTab === 'experiments' && (
        <>
          <div className="vlab-main-body">
          {/* LEFT: EXPERIMENT SELECTOR & CONTROLS (COLLAPSIBLE) */}
          <div className={`vlab-sidebar ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
            {/* Experiment Picker */}
            <div>
              <span className="vlab-section-label">Select NCERT Practical Activity</span>
              <div className="vlab-exp-list">
                <button
                  onClick={() => {
                    setSelectedExperiment('magnesium');
                    setChemSelectedPart('chem-magnesium-ribbon');
                  }}
                  className={`vlab-exp-card ${selectedExperiment === 'magnesium' ? 'is-active' : ''}`}
                >
                  <div className="vlab-exp-icon" style={{ background: '#fff3df' }}>🔥</div>
                  <div className="vlab-exp-info">
                    <div className="vlab-exp-title">
                      <span>Activity 1.1 — Magnesium Ribbon</span>
                      {selectedExperiment === 'magnesium' && <CheckCircle2 size={14} color="#f3883b" />}
                    </div>
                    <div className="vlab-exp-desc">Combustion &amp; MgO powder collection</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedExperiment('prism');
                    setPrismSelectedPart('prism-glass-body');
                  }}
                  className={`vlab-exp-card ${selectedExperiment === 'prism' ? 'is-active' : ''}`}
                >
                  <div className="vlab-exp-icon" style={{ background: '#f0f9ff' }}>🌈</div>
                  <div className="vlab-exp-info">
                    <div className="vlab-exp-title">
                      <span>Activity 11.2 — Glass Prism</span>
                      {selectedExperiment === 'prism' && <CheckCircle2 size={14} color="#0284c7" />}
                    </div>
                    <div className="vlab-exp-desc">Refraction &amp; 7-color VIBGYOR dispersion</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setSelectedExperiment('heart');
                    setHeartSelectedPart('human-heart-left-ventricle');
                  }}
                  className={`vlab-exp-card ${selectedExperiment === 'heart' ? 'is-active' : ''}`}
                >
                  <div className="vlab-exp-icon" style={{ background: '#fff1f2' }}>❤️</div>
                  <div className="vlab-exp-info">
                    <div className="vlab-exp-title">
                      <span>Life Processes — Human Heart</span>
                      {selectedExperiment === 'heart' && <CheckCircle2 size={14} color="#e11d48" />}
                    </div>
                    <div className="vlab-exp-desc">4 Chambers &amp; Double Circulation</div>
                  </div>
                </button>
              </div>
            </div>

            {/* STEP CONTROLS PER EXPERIMENT */}
            {selectedExperiment === 'magnesium' && (
              <div className="vlab-timeline-panel">
                <div className="vlab-timeline-header">
                  <span className="vlab-timeline-title">Reaction Timeline</span>
                  <span className="vlab-timeline-badge">{burnStage}</span>
                </div>

                <div className="vlab-step-grid">
                  <button
                    onClick={() => setBurnStage('unheated')}
                    className={`vlab-step-btn ${burnStage === 'unheated' ? 'is-active stage-1' : ''}`}
                  >
                    1. Setup Cleaned
                  </button>
                  <button
                    onClick={() => setBurnStage('heating')}
                    className={`vlab-step-btn ${burnStage === 'heating' ? 'is-active stage-2' : ''}`}
                  >
                    2. Turn On Burner
                  </button>
                  <button
                    onClick={() => setBurnStage('burning')}
                    className={`vlab-step-btn ${burnStage === 'burning' ? 'is-active stage-3' : ''}`}
                  >
                    3. Dazzling Flame
                  </button>
                  <button
                    onClick={() => setBurnStage('collected')}
                    className={`vlab-step-btn ${burnStage === 'collected' ? 'is-active stage-4' : ''}`}
                  >
                    4. MgO Ash Formed
                  </button>
                </div>

                <button
                  onClick={() => setShowBohrDiagram(!showBohrDiagram)}
                  className={`vlab-bohr-btn ${showBohrDiagram ? 'is-active' : ''}`}
                >
                  <Atom size={14} />
                  <span>{showBohrDiagram ? 'Hide Bohr Valence Diagram' : 'Show 2Mg + O₂ Bohr Transfer'}</span>
                </button>
              </div>
            )}

            {selectedExperiment === 'prism' && (
              <div className="vlab-timeline-panel">
                <div className="vlab-timeline-header">
                  <span className="vlab-timeline-title" style={{ color: '#0369a1' }}>Ray Tracing Stages</span>
                  <span className="vlab-timeline-badge">Step {prismStep}/4</span>
                </div>

                <div className="vlab-step-grid">
                  <button
                    onClick={() => setPrismStep(1)}
                    className={`vlab-step-btn ${prismStep === 1 ? 'is-active' : ''}`}
                    style={prismStep === 1 ? { background: '#0284c7', borderColor: '#0369a1' } : {}}
                  >
                    1. Prism Setup
                  </button>
                  <button
                    onClick={() => setPrismStep(2)}
                    className={`vlab-step-btn ${prismStep === 2 ? 'is-active' : ''}`}
                    style={prismStep === 2 ? { background: '#0284c7', borderColor: '#0369a1' } : {}}
                  >
                    2. White Light Beam
                  </button>
                  <button
                    onClick={() => setPrismStep(3)}
                    className={`vlab-step-btn ${prismStep === 3 ? 'is-active' : ''}`}
                    style={prismStep === 3 ? { background: '#0284c7', borderColor: '#0369a1' } : {}}
                  >
                    3. Snell Refraction
                  </button>
                  <button
                    onClick={() => setPrismStep(4)}
                    className={`vlab-step-btn ${prismStep === 4 ? 'is-active' : ''}`}
                    style={prismStep === 4 ? { background: '#0284c7', borderColor: '#0369a1' } : {}}
                  >
                    4. 7-Color Rainbow
                  </button>
                </div>
              </div>
            )}

            {selectedExperiment === 'heart' && (
              <div className="vlab-timeline-panel">
                <div className="vlab-timeline-header">
                  <span className="vlab-timeline-title" style={{ color: '#be123c' }}>Circulation Circuits</span>
                  <span className="vlab-timeline-badge">{heartCircuit}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    onClick={() => setHeartCircuit('all')}
                    className={`vlab-step-btn ${heartCircuit === 'all' ? 'is-active' : ''}`}
                    style={heartCircuit === 'all' ? { background: '#e11d48', borderColor: '#be123c', textAlign: 'left' } : { textAlign: 'left' }}
                  >
                    ❤️ Complete Double Circulation (4 Chambers)
                  </button>
                  <button
                    onClick={() => setHeartCircuit('pulmonary')}
                    className={`vlab-step-btn ${heartCircuit === 'pulmonary' ? 'is-active' : ''}`}
                    style={heartCircuit === 'pulmonary' ? { background: '#0284c7', borderColor: '#0369a1', textAlign: 'left' } : { textAlign: 'left' }}
                  >
                    🔵 Pulmonary Circuit (Right Side → Lungs)
                  </button>
                  <button
                    onClick={() => setHeartCircuit('systemic')}
                    className={`vlab-step-btn ${heartCircuit === 'systemic' ? 'is-active' : ''}`}
                    style={heartCircuit === 'systemic' ? { background: '#b91c1c', borderColor: '#991b1b', textAlign: 'left' } : { textAlign: 'left' }}
                  >
                    🔴 Systemic Circuit (Left Side → Body via Aorta)
                  </button>
                </div>
              </div>
            )}

            {/* NCERT Board Exam Tip Callout */}
            <div className="vlab-exam-tip">
              <div className="vlab-exam-tip-header">
                <Sparkles size={14} color="#f97316" />
                <span>NCERT Board Exam Tip:</span>
              </div>
              {selectedExperiment === 'magnesium' && (
                <p className="vlab-exam-tip-text">
                  {burnStage === 'unheated' && (
                    <><strong>Step 1 (Setup Cleaned):</strong> Magnesium ribbon is cleaned with sandpaper to remove the inert MgO passivating layer. Tongs hold ribbon at a safe distance away from the burner.</>
                  )}
                  {burnStage === 'heating' && (
                    <><strong>Step 2 (Turn On Burner):</strong> Bunsen burner is ignited with a luminous yellow-orange flame while tongs keep the cleaned magnesium ribbon ready at a safe distance away.</>
                  )}
                  {burnStage === 'burning' && (
                    <><strong>Step 3 (Dazzling Flame):</strong> Magnesium ribbon burns with an intense, dazzling brilliant white flame (2Mg + O₂ → 2MgO + Heat + Light).</>
                  )}
                  {burnStage === 'collected' && (
                    <><strong>Step 4 (MgO Ash Formed):</strong> Tongs hold burning ribbon over watch glass. White Magnesium Oxide (MgO) powdery ash flakes fall and collect in the dish.</>
                  )}
                </p>
              )}
              {selectedExperiment === 'prism' && (
                <p className="vlab-exam-tip-text">
                  <strong>Why red deviates least and violet most?</strong> In glass, red light travels fastest (\(v = c/n\)), so it has the lowest refractive index and deviates the least.
                </p>
              )}
              {selectedExperiment === 'heart' && (
                <p className="vlab-exam-tip-text">
                  <strong>Why thick left ventricle?</strong> The left ventricle must pump oxygenated blood to distant body extremities at high systolic pressure (~120 mm Hg).
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: 3D INTERACTIVE CANVAS & FLOATING CONTROLS */}
          <div className="vlab-canvas-wrap">
            <Canvas
              shadows
              camera={{ position: cameraConfig.position, fov: cameraConfig.fov, up: [0, 0, 1] }}
              className="vlab-canvas-element"
            >
              <color
                attach="background"
                args={[lightingMode === 'darkroom' ? '#030712' : lightingMode === 'studio' ? '#0f172a' : '#0b1120']}
              />

              {/* Studio Key and Ambient Lights */}
              <ambientLight
                intensity={lightingMode === 'darkroom' ? 0.8 : lightingMode === 'studio' ? 1.4 : 1.6}
              />
              <directionalLight
                position={[0.5, -0.8, 1.2]}
                intensity={lightingMode === 'darkroom' ? 2.0 : lightingMode === 'studio' ? 2.8 : 3.2}
                color="#fffdfa"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <directionalLight
                position={[-0.6, 0.6, 0.8]}
                intensity={lightingMode === 'darkroom' ? 0.5 : 1.0}
                color="#38bdf8"
              />
              <pointLight
                position={[0, 0, 0.4]}
                intensity={lightingMode === 'darkroom' ? 1.5 : 1.0}
                color={selectedExperiment === 'magnesium' && burnStage === 'burning' ? '#ffffff' : '#e0f2fe'}
              />

              <Suspense fallback={null}>
                {selectedExperiment === 'magnesium' && (
                  <>
                    <ScienceLabWorkbenchTable lightingMode={lightingMode} />
                    <MagnesiumBurningModel
                      burnStage={burnStage}
                      selectedPart={chemSelectedPart}
                      onSelectPart={(p) => setChemSelectedPart(p)}
                    />
                  </>
                )}
                {selectedExperiment === 'prism' && (
                  <PrismRefractionModel
                    step={prismStep}
                    selectedPart={prismSelectedPart}
                    onSelectPart={(p) => setPrismSelectedPart(p)}
                  />
                )}
                {selectedExperiment === 'heart' && (
                  <>
                    <ScienceLabWorkbenchTable lightingMode={lightingMode} />
                    <HeartModel
                      activeCircuit={heartCircuit}
                      selectedPart={heartSelectedPart}
                      onSelectPart={(p) => setHeartSelectedPart(p)}
                    />
                  </>
                )}
                <ContactShadows position={[0, 0, 0.001]} opacity={0.7} scale={1.2} blur={1.8} far={0.6} />
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                makeDefault
                target={[0, 0, 0.02]}
                enableDamping
                dampingFactor={0.08}
                autoRotate={isAutoRotating}
                autoRotateSpeed={1.8}
                minDistance={0.25}
                maxDistance={4.5}
                maxPolarAngle={Math.PI / 2 - 0.02}
                minPolarAngle={Math.PI * 0.04}
              />
            </Canvas>

            {/* FLOATING TOP-LEFT: STATUS BADGE */}
            <div className="vlab-floating-badge">
              <span className="vlab-pulse-dot" />
              <span>3D Orbit Active · Click part or drag to inspect</span>
            </div>

            {/* FLOATING TOP-RIGHT: INTERACTIVE CAMERA & LIGHTING TOOLBAR */}
            <div className="vlab-floating-toolbar">
              <button onClick={() => handleZoom('in')} className="vlab-tool-btn" title="Zoom In">
                <ZoomIn size={14} />
              </button>
              <button onClick={() => handleZoom('out')} className="vlab-tool-btn" title="Zoom Out">
                <ZoomOut size={14} />
              </button>

              <div className="vlab-tool-divider" />

              <button onClick={() => setCameraPreset('isometric')} className="vlab-tool-btn is-active" title="3/4 Isometric 3D View">
                3D 3/4
              </button>
              <button onClick={() => setCameraPreset('front')} className="vlab-tool-btn" title="Front View">
                Front
              </button>
              <button onClick={() => setCameraPreset('top')} className="vlab-tool-btn" title="Bird's Eye Top View">
                Top
              </button>
              <button onClick={() => setCameraPreset('side')} className="vlab-tool-btn" title="Side Profile">
                Side
              </button>
              <button onClick={() => setCameraPreset('closeup')} className="vlab-tool-btn" title="Close-Up Focus">
                Focus
              </button>

              <div className="vlab-tool-divider" />

              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`vlab-tool-btn ${isAutoRotating ? 'is-active' : ''}`}
                title={isAutoRotating ? 'Stop 360° Auto-Rotate' : 'Start 360° Auto-Rotate'}
              >
                <Compass size={14} />
              </button>

              <button
                onClick={() => {
                  if (lightingMode === 'daylight') setLightingMode('darkroom');
                  else if (lightingMode === 'darkroom') setLightingMode('studio');
                  else setLightingMode('daylight');
                }}
                className="vlab-tool-btn"
                title={`Lighting: ${lightingMode.toUpperCase()} (Click to toggle)`}
              >
                {lightingMode === 'daylight' && <Sun size={14} color="#f59e0b" />}
                {lightingMode === 'darkroom' && <Moon size={14} color="#6366f1" />}
                {lightingMode === 'studio' && <Lightbulb size={14} color="#0284c7" />}
              </button>
            </div>

            {/* BOHR ATOM 2D OVERLAY IN MAGNESIUM */}
            {selectedExperiment === 'magnesium' && showBohrDiagram && (
              <div
                style={{
                  position: 'absolute',
                  left: '1rem',
                  right: '1rem',
                  bottom: '5.5rem',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(12px)',
                  border: '2px solid #c7d2fe',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  zIndex: 25,
                  maxWidth: '700px',
                  margin: '0 auto',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Atom size={16} color="#4f46e5" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#181612' }}>
                      Atomic Mechanism: Valence Electron Transfer (2Mg + O₂ → 2Mg²⁺ + 2O²⁻)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowBohrDiagram(false)}
                    style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', background: '#f1f5f9', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', color: '#b45309', marginBottom: '0.25rem' }}>Magnesium Atom (Mg, Z=12)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#334155' }}>Configuration: 2, 8, 2 (K=2, L=8, M=2)</div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                      Loses 2 valence electrons from M shell to achieve stable octet neon configuration: <strong style={{ color: '#047857' }}>Mg → Mg²⁺ + 2e⁻</strong>.
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 900, fontSize: '0.75rem', color: '#0369a1', marginBottom: '0.25rem' }}>Oxygen Molecule (O₂, Z=8)</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#334155' }}>Configuration: 2, 6 (K=2, L=6)</div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b', margin: '0.35rem 0 0 0', lineHeight: 1.4 }}>
                      Each oxygen atom gains 2 electrons into L shell to form stable oxide anion: <strong style={{ color: '#047857' }}>O + 2e⁻ → O²⁻</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* FLOATING BOTTOM: SELECTED COMPONENT HUD */}
            <div className="vlab-hud-card">
              <div>
                <div className="vlab-hud-title-row">
                  <span className="vlab-hud-name">
                    {selectedExperiment === 'magnesium'
                      ? chemPartInfo.name
                      : selectedExperiment === 'prism'
                      ? prismPartInfo.name
                      : heartPartInfo.name}
                  </span>
                  <span className="vlab-hud-cat">
                    {selectedExperiment === 'magnesium'
                      ? chemPartInfo.category
                      : selectedExperiment === 'prism'
                      ? prismPartInfo.category
                      : 'Circulatory System'}
                  </span>
                </div>
                <p className="vlab-hud-desc">
                  {selectedExperiment === 'magnesium'
                    ? chemPartInfo.cbseKeyPoint
                    : selectedExperiment === 'prism'
                    ? prismPartInfo.cbseKeyPoint
                    : heartPartInfo.cbseKeyPoint}
                </p>
              </div>

              {/* Chemical Equation or Key Formula */}
              <div className="vlab-hud-formula">
                {selectedExperiment === 'magnesium' && '2Mg(s) + O₂(g) → 2MgO(s)'}
                {selectedExperiment === 'prism' && 'A + δ = i + e'}
                {selectedExperiment === 'heart' && '4 Chambers · Double Loop'}
              </div>
            </div>
          </div>
        </div>

        {/* UNDER THE 3D CANVAS: HIGH-YIELD 1-MINUTE CHEAT SHEET & 5-YR PAST QUESTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', background: '#ffffff' }}>
          <OneMinuteRevisionCard experiment={selectedExperiment} />
          <CbsePastQuestionsAccordion experiment={selectedExperiment} />
        </div>
        </>
      )}

      {/* =================================================================== */}
      {/* 2B. TAB CONTENT: CBSE 5-YEAR PAST BOARD QUESTIONS (2020-2024)       */}
      {/* =================================================================== */}
      {activeTab === 'questions' && (
        <div style={{ background: '#fbf8f3', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Experiment Switcher Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1.5px solid #e8decb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6f665c' }}>Select Practical Activity:</span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedExperiment('magnesium')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'magnesium' ? '#f3883b' : '#d9c7b4', background: selectedExperiment === 'magnesium' ? '#fff3df' : '#fbf8f3', color: selectedExperiment === 'magnesium' ? '#bd4f10' : '#6f665c', cursor: 'pointer' }}
                >
                  🔥 Act 1.1 — Magnesium Ribbon
                </button>
                <button
                  onClick={() => setSelectedExperiment('prism')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'prism' ? '#0284c7' : '#d9c7b4', background: selectedExperiment === 'prism' ? '#f0f9ff' : '#fbf8f3', color: selectedExperiment === 'prism' ? '#0369a1' : '#6f665c', cursor: 'pointer' }}
                >
                  🌈 Act 11.2 — Glass Prism
                </button>
                <button
                  onClick={() => setSelectedExperiment('heart')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'heart' ? '#e11d48' : '#d9c7b4', background: selectedExperiment === 'heart' ? '#fff1f2' : '#fbf8f3', color: selectedExperiment === 'heart' ? '#be123c' : '#6f665c', cursor: 'pointer' }}
                >
                  ❤️ Ch 5 — Human Heart
                </button>
              </div>
            </div>
          </div>
          <CbsePastQuestionsAccordion experiment={selectedExperiment} />
        </div>
      )}

      {/* =================================================================== */}
      {/* 2C. TAB CONTENT: 1-MINUTE QUICK REVISION CHEAT SHEET                */}
      {/* =================================================================== */}
      {activeTab === 'revision' && (
        <div style={{ background: '#fbf8f3', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Experiment Switcher Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', background: '#ffffff', padding: '0.85rem 1.25rem', borderRadius: '14px', border: '1.5px solid #e8decb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6f665c' }}>Select Practical Activity:</span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedExperiment('magnesium')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'magnesium' ? '#f3883b' : '#d9c7b4', background: selectedExperiment === 'magnesium' ? '#fff3df' : '#fbf8f3', color: selectedExperiment === 'magnesium' ? '#bd4f10' : '#6f665c', cursor: 'pointer' }}
                >
                  🔥 Act 1.1 — Magnesium Ribbon
                </button>
                <button
                  onClick={() => setSelectedExperiment('prism')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'prism' ? '#0284c7' : '#d9c7b4', background: selectedExperiment === 'prism' ? '#f0f9ff' : '#fbf8f3', color: selectedExperiment === 'prism' ? '#0369a1' : '#6f665c', cursor: 'pointer' }}
                >
                  🌈 Act 11.2 — Glass Prism
                </button>
                <button
                  onClick={() => setSelectedExperiment('heart')}
                  style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.65rem', borderRadius: '999px', border: '1px solid', borderColor: selectedExperiment === 'heart' ? '#e11d48' : '#d9c7b4', background: selectedExperiment === 'heart' ? '#fff1f2' : '#fbf8f3', color: selectedExperiment === 'heart' ? '#be123c' : '#6f665c', cursor: 'pointer' }}
                >
                  ❤️ Ch 5 — Human Heart
                </button>
              </div>
            </div>
          </div>
          <OneMinuteRevisionCard experiment={selectedExperiment} />
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. TAB CONTENT 2: 3D APPARATUS STUDIO (36 GLB CATALOG)              */}
      {/* =================================================================== */}
      {activeTab === 'apparatus' && (
        <div className="vlab-main-body">
          {/* LEFT: APPARATUS SEARCH & CATALOG (COLLAPSIBLE) */}
          <div className={`vlab-sidebar ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 36 3D apparatus..."
                className="vlab-search-input"
              />
            </div>

            {/* Category Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(['all', 'physics', 'chemistry', 'biology', 'electricity'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`vlab-cat-pill ${categoryFilter === cat ? 'is-active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Assets List */}
            <div className="vlab-asset-list">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`vlab-asset-item ${selectedAssetId === asset.id ? 'is-selected' : ''}`}
                >
                  <span className="vlab-asset-emoji">{asset.category === 'chemistry' ? '🧪' : asset.category === 'physics' ? '📐' : asset.category === 'biology' ? '🔬' : '⚡'}</span>
                  <div className="vlab-asset-text">
                    <div className="vlab-asset-name">{asset.name}</div>
                    <div className="vlab-asset-sub">{asset.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: 3D APPARATUS VIEWPORT */}
          <div className="vlab-canvas-wrap">
            <Canvas
              shadows
              camera={{ position: [0.35, -0.65, 0.40], fov: 45, up: [0, 0, 1] }}
              className="vlab-canvas-element"
            >
              <color attach="background" args={['#0f172a']} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[0.5, -0.8, 1.2]} intensity={2.8} castShadow />
              <directionalLight position={[-0.5, 0.5, 0.5]} intensity={1.0} color="#38bdf8" />

              <Suspense fallback={null}>
                <ScienceLabWorkbenchTable lightingMode="studio" />
                <AssetStudioInspector
                  asset={selectedAsset}
                  stateIndex={0}
                  lightingMode={lightingMode}
                  showWireframe={showWireframe}
                  showDimensions={showDimensions}
                  showSockets={showSockets}
                />
                <ContactShadows position={[0, 0, 0.001]} opacity={0.7} scale={0.8} blur={1.5} far={0.5} />
              </Suspense>

              <OrbitControls
                ref={controlsRef}
                makeDefault
                target={[0, 0, (selectedAsset.dimensions.height_mm / 1000) * 0.4]}
                enableDamping
                dampingFactor={0.08}
                autoRotate={isAutoRotating}
                autoRotateSpeed={1.8}
                minDistance={0.25}
                maxDistance={4.5}
                maxPolarAngle={Math.PI / 2 - 0.02}
                minPolarAngle={Math.PI * 0.04}
              />
            </Canvas>

            {/* TOGGLE CONTROLS & CAMERA FLOATING BAR */}
            <div className="vlab-floating-toolbar">
              <button onClick={() => handleZoom('in')} className="vlab-tool-btn" title="Zoom In">
                <ZoomIn size={14} />
              </button>
              <button onClick={() => handleZoom('out')} className="vlab-tool-btn" title="Zoom Out">
                <ZoomOut size={14} />
              </button>

              <div className="vlab-tool-divider" />

              <button onClick={() => setCameraPreset('isometric')} className="vlab-tool-btn is-active" title="3/4 Isometric 3D View">
                3D 3/4
              </button>
              <button onClick={() => setCameraPreset('front')} className="vlab-tool-btn" title="Front View">
                Front
              </button>
              <button onClick={() => setCameraPreset('top')} className="vlab-tool-btn" title="Top View">
                Top
              </button>
              <button onClick={() => setCameraPreset('side')} className="vlab-tool-btn" title="Side Profile">
                Side
              </button>

              <div className="vlab-tool-divider" />

              <button
                onClick={() => setShowWireframe(!showWireframe)}
                className={`vlab-tool-btn ${showWireframe ? 'is-active' : ''}`}
              >
                Wireframe
              </button>
              <button
                onClick={() => setShowDimensions(!showDimensions)}
                className={`vlab-tool-btn ${showDimensions ? 'is-active' : ''}`}
                style={showDimensions ? { background: '#0284c7', color: '#fff' } : {}}
              >
                Dimensions
              </button>
              <button
                onClick={() => setShowSockets(!showSockets)}
                className={`vlab-tool-btn ${showSockets ? 'is-active' : ''}`}
                style={showSockets ? { background: '#059669', color: '#fff' } : {}}
              >
                Sockets
              </button>

              <div className="vlab-tool-divider" />

              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`vlab-tool-btn ${isAutoRotating ? 'is-active' : ''}`}
                title="Toggle 360° Auto-Rotate"
              >
                <Compass size={14} />
              </button>
            </div>

            {/* APPARATUS DETAILS HUD */}
            <div className="vlab-hud-card">
              <div>
                <div className="vlab-hud-title-row">
                  <span className="vlab-hud-name">{selectedAsset.name}</span>
                  <span className="vlab-hud-cat" style={{ background: '#f0f9ff', color: '#0369a1', borderColor: 'rgba(2, 132, 199, 0.3)' }}>
                    {selectedAsset.dimensions.width_mm}mm × {selectedAsset.dimensions.height_mm}mm
                  </span>
                </div>
                <p className="vlab-hud-desc">{selectedAsset.semanticDescription}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                  {selectedAsset.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '0.1rem 0.45rem', borderRadius: '999px', fontFamily: 'monospace', fontWeight: 700 }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. TAB CONTENT 3: NCERT MISCONCEPTIONS & OKF KNOWLEDGE             */}
      {/* =================================================================== */}
      {activeTab === 'misconceptions' && (
        <div className="vlab-misconceptions-wrap">
          <div style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#181612', margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ShieldCheck size={20} color="#059669" />
              Verified NCERT Knowledge &amp; Board Exam Pitfalls (OKF v0.2)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#6f665c', margin: 0, lineHeight: 1.5 }}>
              Every formula, observation, and apparatus in ChapterReady is cross-validated against the official NCERT Class 10 textbook and CBSE board marking schemes.
            </p>
          </div>

          <div className="vlab-misconceptions-grid">
            {Object.values(OKF_CONCEPTS).slice(0, 8).map((concept) => (
              <div key={concept.id} className="vlab-concept-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#181612' }}>{concept.title}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.15rem 0.55rem', borderRadius: '999px', background: '#fff3df', color: '#bd4f10', border: '1px solid rgba(243, 136, 59, 0.3)', textTransform: 'capitalize' }}>
                    {concept.cbse_mapping?.chapter || concept.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>{concept.description}</p>
                {concept.misconceptions && concept.misconceptions.length > 0 && (
                  <div className="vlab-pitfall-box">
                    <div style={{ fontWeight: 900, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                      <AlertTriangle size={13} color="#f97316" />
                      Common Student Exam Trap:
                    </div>
                    <p style={{ margin: 0, color: '#7c2d12', fontStyle: 'italic' }}>"{concept.misconceptions[0].claim}"</p>
                    <p style={{ margin: '0.35rem 0 0 0', fontWeight: 800, color: '#047857' }}>
                      Correct NCERT Truth: {concept.misconceptions[0].correction}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
