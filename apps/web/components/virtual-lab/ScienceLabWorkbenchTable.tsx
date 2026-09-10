'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const DreiText = Text as any;

export interface ScienceLabWorkbenchTableProps {
  showRoom?: boolean;
  showGrid?: boolean;
  tableWidth?: number;
  tableDepth?: number;
  lightingMode?: 'daylight' | 'studio' | 'darkroom';
}

export function ScienceLabWorkbenchTable({
  showRoom = true,
  showGrid = true,
  tableWidth = 0.88,
  tableDepth = 0.62,
  lightingMode = 'daylight',
}: ScienceLabWorkbenchTableProps) {
  // Coordinate Conventions (Z-Up coordinate system):
  // Tabletop surface is exactly at Z = 0.0
  // Floor is at Z = -0.22
  const tableH = 0.22;
  const floorZ = -0.22;
  const topThickness = 0.022;

  // Lab Floor Dimensions
  const roomW = 2.4;
  const roomD = 1.8;
  const wallH = 0.65;

  // Floor checkerboard tiles
  const floorTiles = useMemo(() => {
    const tiles = [];
    const numX = 12;
    const numY = 9;
    const tileW = roomW / numX;
    const tileD = roomD / numY;
    const startX = -roomW / 2 + tileW / 2;
    const startY = -roomD / 2 + tileD / 2;

    for (let i = 0; i < numX; i++) {
      for (let j = 0; j < numY; j++) {
        const isDark = (i + j) % 2 === 1;
        tiles.push({
          id: `${i}-${j}`,
          x: startX + i * tileW,
          y: startY + j * tileD,
          w: tileW - 0.003,
          d: tileD - 0.003,
          color: isDark ? '#334155' : '#475569',
          roughness: isDark ? 0.45 : 0.35,
        });
      }
    }
    return tiles;
  }, [roomW, roomD]);

  // Metric Tabletop Grid Lines
  const gridLines = useMemo(() => {
    const lines = [];
    const step = 0.05; // 50mm grid
    const halfW = tableWidth / 2 - 0.04;
    const halfD = tableDepth / 2 - 0.04;

    // Longitudinal lines (along X)
    for (let y = -halfD; y <= halfD + 0.001; y += step) {
      lines.push({
        start: new THREE.Vector3(-halfW, y, 0.0005),
        end: new THREE.Vector3(halfW, y, 0.0005),
      });
    }
    // Transverse lines (along Y)
    for (let x = -halfW; x <= halfW + 0.001; x += step) {
      lines.push({
        start: new THREE.Vector3(x, -halfD, 0.0005),
        end: new THREE.Vector3(x, halfD, 0.0005),
      });
    }
    return lines;
  }, [tableWidth, tableDepth]);

  const legPositions = useMemo(() => {
    const xOff = tableWidth / 2 - 0.035;
    const yOff = tableDepth / 2 - 0.035;
    return [
      [-xOff, -yOff],
      [xOff, -yOff],
      [-xOff, yOff],
      [xOff, yOff],
    ] as [number, number][];
  }, [tableWidth, tableDepth]);

  return (
    <group>
      {/* =================================================================== */}
      {/* 1. SCIENCE LAB WORKBENCH TABLE (TOP SURFACE AT Z = 0.0)             */}
      {/* =================================================================== */}
      <group position={[0, 0, 0]}>
        {/* Main Chemical-Resistant Resin Tabletop */}
        <mesh position={[0, 0, -topThickness / 2]} castShadow receiveShadow>
          <boxGeometry args={[tableWidth, tableDepth, topThickness]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.25}
            metalness={0.15}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Polished Solid Wood Beveled Apron Rim */}
        <mesh position={[0, 0, -topThickness - 0.008]} receiveShadow>
          <boxGeometry args={[tableWidth - 0.02, tableDepth - 0.02, 0.016]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>

        {/* Laser-Etched Metric Grid Matrix on Tabletop */}
        {showGrid && (
          <group position={[0, 0, 0.0005]}>
            <gridHelper
              args={[Math.min(tableWidth, tableDepth) * 0.88, 14, 0x38bdf8, 0x0284c7]}
              rotation={[Math.PI / 2, 0, 0]}
            />

            {/* Corner Alignment Markings & Measurement Rules */}
            <mesh position={[-tableWidth / 2 + 0.06, -tableDepth / 2 + 0.03, 0.0006]}>
              <planeGeometry args={[0.08, 0.015]} />
              <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
            </mesh>
            <DreiText
              position={[-tableWidth / 2 + 0.06, -tableDepth / 2 + 0.03, 0.0008]}
              fontSize={0.008}
              color="#38bdf8"
              anchorX="center"
              anchorY="middle"
            >
              NCERT LAB 50mm GRID
            </DreiText>
          </group>
        )}

        {/* 4 Tubular Stainless Steel Legs */}
        {legPositions.map(([lx, ly], idx) => (
          <group key={idx} position={[lx, ly, -tableH / 2]}>
            {/* Tubular Leg */}
            <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.014, 0.014, tableH - topThickness, 16]} />
              <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
            </mesh>
            {/* Rubber Leveling Foot Pad */}
            <mesh position={[0, 0, -tableH / 2 + topThickness / 2 + 0.006]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
              <cylinderGeometry args={[0.020, 0.020, 0.012, 16]} />
              <meshStandardMaterial color="#020617" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Sturdy Lower Cross-Brace Support Frame */}
        <mesh position={[0, 0, -tableH + 0.06]} receiveShadow>
          <boxGeometry args={[tableWidth - 0.07, 0.014, 0.014]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, -tableH + 0.06]} receiveShadow>
          <boxGeometry args={[0.014, tableDepth - 0.07, 0.014]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Table Utility Fixture: Dual Gas Turret Tap at Rear Left Corner */}
        <group position={[-tableWidth / 2 + 0.06, tableDepth / 2 - 0.06, 0.0]}>
          {/* Base Flange */}
          <mesh position={[0, 0, 0.005]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.018, 0.022, 0.010, 16]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Turret Stem */}
          <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.050, 16]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Dual Nozzle Arms */}
          <mesh position={[0.020, 0, 0.052]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <cylinderGeometry args={[0.004, 0.004, 0.032, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.9} />
          </mesh>
          {/* Blue & Amber Control Valves */}
          <mesh position={[0.028, 0, 0.052]} castShadow>
            <sphereGeometry args={[0.006, 12, 12]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* =================================================================== */}
      {/* 2. SCIENCE LAB ROOM BACKGROUND & WALLS                              */}
      {/* =================================================================== */}
      {showRoom && (
        <group>
          {/* Floor Base Slab */}
          <mesh position={[0, 0, floorZ - 0.006]} receiveShadow>
            <boxGeometry args={[roomW + 0.04, roomD + 0.04, 0.01]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>

          {/* Checkerboard Lab Floor Tiles */}
          {floorTiles.map((tile) => (
            <mesh key={tile.id} position={[tile.x, tile.y, floorZ]} receiveShadow>
              <boxGeometry args={[tile.w, tile.d, 0.004]} />
              <meshStandardMaterial
                color={lightingMode === 'darkroom' ? '#0b1329' : tile.color}
                roughness={tile.roughness}
                metalness={0.1}
              />
            </mesh>
          ))}

          {/* Rear Science Lab Wall (Y = +roomD / 2 = +0.90) */}
          <group position={[0, roomD / 2, floorZ + wallH / 2]}>
            {/* Wall Board Base */}
            <mesh receiveShadow>
              <boxGeometry args={[roomW, 0.02, wallH]} />
              <meshStandardMaterial
                color={lightingMode === 'darkroom' ? '#070d19' : '#0f172a'}
                roughness={0.7}
              />
            </mesh>

            {/* Lower Dado Wall Molding */}
            <mesh position={[0, -0.003, -wallH / 2 + 0.08]} receiveShadow>
              <boxGeometry args={[roomW, 0.024, 0.16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.6} />
            </mesh>

            {/* Practical Studio Green Chalkboard */}
            <group position={[0, -0.012, 0.08]}>
              <mesh receiveShadow>
                <boxGeometry args={[1.30, 0.010, 0.36]} />
                <meshStandardMaterial color="#064e3b" roughness={0.55} />
              </mesh>
              {/* Wooden Board Frame */}
              <mesh position={[0, 0.002, 0]}>
                <boxGeometry args={[1.34, 0.008, 0.40]} />
                <meshStandardMaterial color="#78350f" roughness={0.4} />
              </mesh>
              {/* Chalkboard Title Text */}
              <DreiText
                position={[0, -0.008, 0.12]}
                fontSize={0.024}
                color="#fef08a"
                anchorX="center"
                anchorY="middle"
              >
                NCERT CLASS 10 SCIENCE PRACTICAL STUDIO
              </DreiText>
              <DreiText
                position={[0, -0.008, 0.05]}
                fontSize={0.015}
                color="#ecfdf5"
                anchorX="center"
                anchorY="middle"
              >
                Real-Time 3D Physics, Chemistry &amp; Biology Apparatus
              </DreiText>
              <DreiText
                position={[0, -0.008, -0.03]}
                fontSize={0.011}
                color="#a7f3d0"
                anchorX="center"
                anchorY="middle"
              >
                Rotate 360° · Click Components to Inspect Board Exam Key Points
              </DreiText>
            </group>
          </group>

          {/* Left Lab Wall (X = -roomW / 2 = -1.20) with Window Illumination */}
          <group position={[-roomW / 2, 0, floorZ + wallH / 2]}>
            <mesh receiveShadow>
              <boxGeometry args={[0.02, roomD, wallH]} />
              <meshStandardMaterial
                color={lightingMode === 'darkroom' ? '#070d19' : '#0f172a'}
                roughness={0.7}
              />
            </mesh>

            {/* Sunlit Lab Window Frame */}
            <group position={[0.008, 0, 0.06]}>
              <mesh castShadow>
                <boxGeometry args={[0.03, 0.60, 0.38]} />
                <meshStandardMaterial color="#1e293b" roughness={0.4} />
              </mesh>
              <mesh position={[0.004, 0, 0]}>
                <boxGeometry args={[0.005, 0.54, 0.32]} />
                <meshPhysicalMaterial
                  color="#e0f2fe"
                  transmission={0.88}
                  transparent
                  opacity={0.85}
                  roughness={0.08}
                  ior={1.5}
                />
              </mesh>
              {/* Window Cross Mullions */}
              <mesh position={[0.008, 0, 0]}>
                <boxGeometry args={[0.012, 0.54, 0.015]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
              <mesh position={[0.008, 0, 0]}>
                <boxGeometry args={[0.012, 0.015, 0.32]} />
                <meshStandardMaterial color="#334155" roughness={0.4} />
              </mesh>
            </group>
          </group>
        </group>
      )}
    </group>
  );
}
