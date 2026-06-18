"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * AmbientPulseRings — Cinematic sonar-style expanding rings from portal center.
 * 5 rings staggered in time, very subtle opacity (0.08–0.15).
 * Acts like a heartbeat — radiating outward to give the portal a living feel.
 */
export default function AmbientPulseRings() {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return [
      { color: "#00D4FF", delay: 0.0, baseRadius: 0.5 },
      { color: "#7B2FFF", delay: 0.8, baseRadius: 0.5 },
      { color: "#00FF88", delay: 1.6, baseRadius: 0.5 },
      { color: "#FF6B35", delay: 2.4, baseRadius: 0.5 },
      { color: "#FFD700", delay: 3.2, baseRadius: 0.5 },
    ];
  }, []);

  const CYCLE = 4.0; // Full pulse cycle duration in seconds

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const ring = rings[i];
      const mesh = child as THREE.Mesh;
      if (!mesh) return;

      // Each ring has a phase offset; progress goes 0→1 within cycle
      const progress = ((t + ring.delay) % CYCLE) / CYCLE;

      // Expand from 0.5 to 9.0 radius over the cycle
      const radius = ring.baseRadius + progress * 8.5;

      // Opacity: fades in quickly, then fades out
      const opacity = progress < 0.15
        ? (progress / 0.15) * 0.12
        : (1 - (progress - 0.15) / 0.85) * 0.12;

      mesh.scale.setScalar(radius / ring.baseRadius);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, opacity);
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.baseRadius, 0.018, 8, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
