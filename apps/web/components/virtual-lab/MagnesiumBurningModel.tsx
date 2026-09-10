'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export interface MagnesiumBurningProps {
  burnStage: 'unheated' | 'heating' | 'burning' | 'collected';
  selectedPart: string | null;
  onSelectPart: (partName: string) => void;
}

// ---------------------------------------------------------------------------
// Falling Ash Particles Component (Simulates white MgO powder flakes falling)
// ---------------------------------------------------------------------------
function FallingAshParticles({ active }: { active: boolean }) {
  const count = 42;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize randomized particle trajectories directly over the watch glass
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      // Centered directly over watch glass (x: 0.075, y: -0.040 in Blender setup coordinates)
      baseX: 0.075 + (Math.random() - 0.5) * 0.022,
      baseY: -0.040 + (Math.random() - 0.5) * 0.022,
      z: 0.015 + Math.random() * 0.10, // Height from ribbon down to watch glass
      speed: 0.035 + Math.random() * 0.045,
      wobbleSpeed: 4.0 + Math.random() * 6.0,
      wobbleRadius: 0.003 + Math.random() * 0.004,
      rotSpeed: 2.0 + Math.random() * 5.0,
      scale: 0.0012 + Math.random() * 0.0018,
    }));
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current || !active) return;

    particles.forEach((p, i) => {
      // Drop downward
      p.z -= p.speed * delta;
      // Reset to top of ribbon when hitting watch glass bottom
      if (p.z < 0.010) {
        p.z = 0.115 + Math.random() * 0.015;
        p.baseX = 0.075 + (Math.random() - 0.5) * 0.020;
        p.baseY = -0.040 + (Math.random() - 0.5) * 0.020;
      }

      const time = Date.now() * 0.001;
      const x = p.baseX + Math.sin(time * p.wobbleSpeed + i) * p.wobbleRadius;
      const y = p.baseY + Math.cos(time * p.wobbleSpeed + i) * p.wobbleRadius;

      dummy.position.set(x, y, p.z);
      dummy.rotation.set(time * p.rotSpeed, time * p.rotSpeed * 0.7, 0);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#f8fafc"
        emissive="#ffffff"
        emissiveIntensity={0.6}
        roughness={0.9}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Main Interactive Magnesium Burning Experiment Model
// ---------------------------------------------------------------------------
export function MagnesiumBurningModel({
  burnStage,
  selectedPart,
  onSelectPart,
}: MagnesiumBurningProps) {
  const { scene } = useGLTF('/assets/magnesium-burning-setup.glb');
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Store initial base positions of moveable elements (tongs & ribbon)
  const initialPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const currentOffset = useRef(new THREE.Vector3(0.105, -0.015, 0.025));

  // Determine target spatial offset based on the 4-step reaction timeline:
  // Step 1 ('unheated'): Tongs safely away to the right (+0.105m, -0.015m, +0.025m)
  // Step 2 ('heating'): Tongs remain safely away from burner, only tilted burner turns on (+0.105m, -0.015m, +0.025m)
  // Step 3 ('burning'): Tongs move directly into the 60° tilted flame (+0.055m, -0.029m, -0.026m)
  // Step 4 ('collected'): Tongs hover over watch glass (+0.075m, -0.040m, -0.035m)
  const targetOffset = useMemo(() => {
    switch (burnStage) {
      case 'unheated':
        return new THREE.Vector3(0.105, -0.015, 0.025);
      case 'heating':
        return new THREE.Vector3(0.105, -0.015, 0.025); // Held away from burner
      case 'burning':
        return new THREE.Vector3(0.055, -0.029, -0.026); // Moves directly into 60° tilted flame
      case 'collected':
        return new THREE.Vector3(0.075, -0.040, -0.035); // Moves directly over watch glass
      default:
        return new THREE.Vector3(0.105, -0.015, 0.025);
    }
  }, [burnStage]);

  // 1. Apply 60° tilt to burner chimney and flame towards the watch glass
  // 2. Record initial positions for tongs & ribbon
  useEffect(() => {
    const pivot = new THREE.Vector3(0, 0, 0.022); // Collar base pivot point
    // Direction vector towards watch glass (x: 0.075, y: -0.040)
    const tiltDir = new THREE.Vector3(0.075, -0.040, 0).normalize();
    // Perpendicular rotation axis
    const rotAxis = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 0, 1), tiltDir).normalize();
    const tiltAngle = Math.PI / 6; // 30° from vertical = 60° angle to horizontal tabletop

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const name = child.name.toLowerCase();

        // Tilt the burner stem, flame, and air collar by 60°
        if (name.includes('stem') || name.includes('flame') || name.includes('collar')) {
          if (!child.userData.isTilted) {
            child.userData.isTilted = true;
            child.position.sub(pivot);
            child.position.applyAxisAngle(rotAxis, tiltAngle);
            child.position.add(pivot);

            const q = new THREE.Quaternion().setFromAxisAngle(rotAxis, tiltAngle);
            child.quaternion.premultiply(q);
          }
        }

        // Record tongs and ribbon initial positions for lerping
        if (name.includes('tongs') || name.includes('ribbon')) {
          if (!initialPositions.current.has(child.id.toString())) {
            initialPositions.current.set(child.id.toString(), child.position.clone());
          }
        }
      }
    });
  }, [scene]);

  // Smooth frame interpolation & flame/dazzle animation
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Smoothly glide tongs & ribbon to target offset
    currentOffset.current.lerp(targetOffset, Math.min(1.0, delta * 4.5));

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();

        // Animate moveable parts (tongs and ribbon)
        if (name.includes('tongs') || name.includes('ribbon')) {
          const initPos = initialPositions.current.get(mesh.id.toString());
          if (initPos) {
            mesh.position.set(
              initPos.x + currentOffset.current.x,
              initPos.y + currentOffset.current.y,
              initPos.z + currentOffset.current.z
            );
          }
        }

        // Flame dynamic flicker
        if (name.includes('flame')) {
          const flicker = 1.0 + 0.14 * Math.sin(t * 14.0) + 0.08 * Math.cos(t * 8.5);
          mesh.scale.set(flicker, flicker, flicker * (burnStage === 'burning' ? 1.3 : 1.0));
        }

        // Blinding white combustion dazzle pulse on ribbon
        if (name.includes('ribbon') && burnStage === 'burning') {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat && mat.emissive) {
            const dazzle = 3.5 + 1.5 * Math.sin(t * 24.0) + 0.8 * Math.cos(t * 18.0);
            mat.emissiveIntensity = dazzle;
          }
        }
      }
    });
  });

  // Material and visibility transitions across the 4 reaction stages
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
        mesh.material = mat;

        // 1. Flame visibility & Yellow-Orange Flame Materials
        if (name.includes('flame')) {
          mesh.visible = burnStage !== 'unheated';
          if (name.includes('inner') || name.includes('core')) {
            mat.color = new THREE.Color(0xfde047); // Luminous hot yellow core
            mat.emissive = new THREE.Color(0xf59e0b);
            mat.emissiveIntensity = 4.5;
            mat.transparent = true;
            mat.opacity = 0.95;
          } else {
            // Outer flame mantle
            mat.color = new THREE.Color(0xf97316); // Vibrant warm orange
            mat.emissive = new THREE.Color(0xea580c);
            mat.emissiveIntensity = 3.5;
            mat.transparent = true;
            mat.opacity = 0.85;
          }
        }

        // 2. Ribbon material & color transitions (Stays clean silver in step 1 & 2)
        if (name.includes('ribbon')) {
          if (burnStage === 'unheated' || burnStage === 'heating') {
            mat.color = new THREE.Color(0xd1d5db); // Shiny metallic silver (held away from flame)
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0.0;
          } else if (burnStage === 'burning') {
            mat.color = new THREE.Color(0xffffff); // Dazzling brilliant white
            mat.emissive = new THREE.Color(0xffffff);
            mat.emissiveIntensity = 4.0;
          } else if (burnStage === 'collected') {
            mat.color = new THREE.Color(0xa1a1aa); // Burnt porous grey-white ash
            mat.emissive = new THREE.Color(0x404040);
            mat.emissiveIntensity = 0.2;
          }
        }

        // 3. MgO powder heap in watch glass: Only visible when ash is forming/collected
        if (name.includes('mgo-powder')) {
          mesh.visible = burnStage === 'burning' || burnStage === 'collected';
          if (burnStage === 'collected') {
            mesh.scale.set(1.1, 1.1, 1.2);
          } else {
            mesh.scale.set(0.6, 0.6, 0.6);
          }
        }

        // 4. Highlight selected or hovered part
        const isTargetSelected =
          (selectedPart === 'chem-bunsen-burner' && (name.includes('burner') || name.includes('flame') || name.includes('stem') || name.includes('collar'))) ||
          (selectedPart === 'chem-magnesium-ribbon' && name.includes('ribbon')) ||
          (selectedPart === 'chem-tongs' && name.includes('tongs')) ||
          (selectedPart === 'chem-watch-glass' && (name.includes('watch-glass') || name.includes('mgo-powder'))) ||
          (selectedPart === 'chem-sandpaper' && name.includes('sandpaper'));

        const isTargetHovered = hovered && name.includes(hovered);

        if (isTargetSelected) {
          mat.emissive = new THREE.Color(0xfff388);
          mat.emissiveIntensity = 1.8;
        } else if (isTargetHovered) {
          mat.emissive = new THREE.Color(0x38bdf8);
          mat.emissiveIntensity = 0.8;
        }
      }
    });
  }, [scene, burnStage, selectedPart, hovered]);

  const handleMeshClick = (meshName: string) => {
    const name = meshName.toLowerCase();
    if (name.includes('burner') || name.includes('flame') || name.includes('stem') || name.includes('collar') || name.includes('hose')) {
      onSelectPart('chem-bunsen-burner');
    } else if (name.includes('ribbon')) {
      onSelectPart('chem-magnesium-ribbon');
    } else if (name.includes('tongs')) {
      onSelectPart('chem-tongs');
    } else if (name.includes('watch-glass') || name.includes('mgo-powder')) {
      onSelectPart('chem-watch-glass');
    } else if (name.includes('sandpaper')) {
      onSelectPart('chem-sandpaper');
    } else {
      onSelectPart('chem-bunsen-burner');
    }
  };

  return (
    <group
      ref={groupRef}
      scale={[1.35, 1.35, 1.35]}
      position={[0, 0, 0.002]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      {/* 3D Assembled Laboratory Scene Hierarchy */}
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
          handleMeshClick(e.object.name);
        }}
      />

      {/* Dynamic Burner Flame Light (Warm yellow-orange glow at 60° tilted flame tip) */}
      {burnStage !== 'unheated' && (
        <pointLight
          position={[0.055, -0.029, 0.135]}
          intensity={burnStage === 'heating' ? 3.5 : 2.0}
          color="#f59e0b"
          distance={0.9}
        />
      )}

      {/* Dazzling White Combustion Flash Light (Intense burst at tilted burn point) */}
      {burnStage === 'burning' && (
        <pointLight
          position={[0.055, -0.029, 0.140]}
          intensity={8.5}
          color="#ffffff"
          distance={1.6}
          castShadow
        />
      )}

      {/* Falling White MgO Ash Particles (Stage 4: Flakes falling into watch glass) */}
      <FallingAshParticles active={burnStage === 'collected'} />
    </group>
  );
}

useGLTF.preload('/assets/magnesium-burning-setup.glb');
