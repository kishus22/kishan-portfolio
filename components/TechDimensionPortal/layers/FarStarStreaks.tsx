"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FarStarStreaksProps {
  speed: number;
}

export default function FarStarStreaks({ speed }: FarStarStreaksProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count = 800; // Increased count for dense particles

  const streaks = useMemo(() => {
    // Vibrant neon sci-fi palette
    const colors = [
      new THREE.Color("#00D4FF"), // Cyan
      new THREE.Color("#7B2FFF"), // Indigo
      new THREE.Color("#00FF88"), // Mint Green
      new THREE.Color("#FF007F"), // Hot Pink
      new THREE.Color("#FFD700"), // Yellow Gold
      new THREE.Color("#FF5E00"), // Neon Orange
    ];

    return Array.from({ length: count }, (_, i) => {
      // Create a cylindrical distribution for tunnel feel
      const radius = 2 + Math.random() * 25;
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: -100 - Math.random() * 100,
        length: Math.random() * 4 + 2,
        speedScale: Math.random() * 0.8 + 0.5,
        color: colors[i % colors.length],
      };
    });
  }, []);

  // Initialize colors once
  useEffect(() => {
    if (!meshRef.current) return;
    streaks.forEach((s, i) => {
      meshRef.current!.setColorAt(i, s.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [streaks]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Normalize speed around 60fps
    const baseSpeed = speed * (delta * 60);
    const isWarping = speed > 1.5;

    streaks.forEach((s, i) => {
      s.z += baseSpeed * s.speedScale * (isWarping ? 2.5 : 1.0);

      // If it gets too close, reset it to the far depth boundary
      if (s.z > 15) {
        s.z = -150 - Math.random() * 50;
        const radius = 2 + Math.random() * 25;
        const angle = Math.random() * Math.PI * 2;
        s.x = Math.cos(angle) * radius;
        s.y = Math.sin(angle) * radius;
      }

      dummy.position.set(s.x, s.y, s.z);
      // Scale length on Z according to speed for a visual "warp speed" stretch
      // Make it stretch massively during warp
      const stretch = isWarping ? s.length * (1 + speed * 3.5) : s.length;
      dummy.scale.set(0.8, 0.8, stretch);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // Dynamically update material opacity/brightness based on warp state
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    if (mat) {
      // Fades up in opacity during warp speed to look blindingly bright
      const targetOpacity = isWarping ? 0.65 : 0.16;
      mat.opacity += (targetOpacity - mat.opacity) * 0.1;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
      <boxGeometry args={[0.04, 0.04, 1.2]} />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.16}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}
