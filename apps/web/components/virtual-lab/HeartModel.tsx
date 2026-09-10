'use client';

import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF, Center, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const DreiText = Text as any;

export interface HeartProps {
  activeCircuit: 'all' | 'pulmonary' | 'systemic';
  selectedPart: string | null;
  onSelectPart: (partName: string) => void;
}

export function HeartModel({ activeCircuit, selectedPart, onSelectPart }: HeartProps) {
  const { scene } = useGLTF('/assets/human-heart.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Subtle natural cardiac idle pulse animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      // Cardiac cycle beat: quick lub-dub contraction
      const beat = Math.sin(t * 4.5) * Math.pow(Math.sin(t * 2.25), 4) * 0.035;
      groupRef.current.scale.set(1.15 + beat, 1.15 + beat * 1.2, 1.15 + beat);
    }
  });

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mesh.material = mat;

        const isOxy = name.includes('left') || name.includes('aorta') || name.includes('pulmonary-vein');
        const isDeoxy = name.includes('right') || name.includes('cava') || name.includes('pulmonary-artery') || name.includes('pulmonary-trunk');

        // Apply circuit opacity filtering
        if (activeCircuit === 'pulmonary') {
          if (isDeoxy) {
            mat.opacity = 1.0;
            mat.transparent = false;
          } else {
            mat.opacity = 0.15;
            mat.transparent = true;
          }
        } else if (activeCircuit === 'systemic') {
          if (isOxy) {
            mat.opacity = 1.0;
            mat.transparent = false;
          } else {
            mat.opacity = 0.15;
            mat.transparent = true;
          }
        } else {
          mat.opacity = 1.0;
          mat.transparent = false;
        }

        // Selection / Hover Highlight
        const isSelected = selectedPart && name.includes(selectedPart.toLowerCase());
        const isHover = hovered && name.includes(hovered.toLowerCase());

        if (isSelected) {
          mat.emissive = new THREE.Color(0xfff388);
          mat.emissiveIntensity = 1.5;
        } else if (isHover) {
          mat.emissive = new THREE.Color(0x38bdf8);
          mat.emissiveIntensity = 0.8;
        }
      }
    });
  }, [scene, activeCircuit, selectedPart, hovered]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Laboratory Anatomical Demonstration Mount / Stand */}
      <group position={[0, 0, 0]}>
        {/* Heavy Weighted Cast-Iron / Brushed Steel Base Plate */}
        <mesh position={[0, 0, 0.003]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.075, 0.080, 0.006, 32]} />
          <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Chrome Support Stanchion Column */}
        <mesh position={[0, 0, 0.038]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.0035, 0.0035, 0.065, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.95} />
        </mesh>
        {/* Specimen Label Plaque */}
        <mesh position={[0, -0.062, 0.004]} rotation={[-Math.PI / 8, 0, 0]} receiveShadow>
          <boxGeometry args={[0.09, 0.024, 0.004]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <DreiText
          position={[0, -0.062, 0.007]}
          rotation={[-Math.PI / 8, 0, 0]}
          fontSize={0.0055}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
        >
          HUMAN HEART (DOUBLE CIRCULATION)
        </DreiText>
      </group>

      {/* 2. Pulsing Heart Specimen Model mounted atop stand */}
      <group ref={groupRef} position={[0, 0, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
        <Center>
          <primitive
            object={scene}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              setHovered(e.object.name);
            }}
            onPointerOut={(e: any) => {
              e.stopPropagation();
              setHovered(null);
            }}
            onClick={(e: any) => {
              e.stopPropagation();
              onSelectPart(e.object.name);
            }}
          />
        </Center>
      </group>
    </group>
  );
}

useGLTF.preload('/assets/human-heart.glb');
