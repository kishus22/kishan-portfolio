"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EnergyWaves() {
  const wave1 = useRef<THREE.Mesh>(null);
  const wave2 = useRef<THREE.Mesh>(null);
  const wave3 = useRef<THREE.Mesh>(null);

  const waveRefs = useMemo(() => [wave1, wave2, wave3], [wave1, wave2, wave3]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    waveRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const phase = (t * 0.35 + i * 0.33) % 1.0;

      // Scale from 1.0 to 9.0
      ref.current.scale.setScalar(phase * 8.0 + 1.0);

      // Fade out opacity dynamically
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (1.0 - phase) * 0.12;
      }
    });
  });

  return (
    <group position={[0, 0, -4.8]}>
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} ref={waveRefs[i]}>
          <ringGeometry args={[0.98, 1.0, 64]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
