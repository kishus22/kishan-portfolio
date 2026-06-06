"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TunnelRingsProps {
  speed: number;
}

export default function TunnelRings({ speed }: TunnelRingsProps) {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      z: -i * 3 - 2, // Stacked backward along Z axis
      radius: 4 + i * 0.3, // Slightly wider as they go deeper
      opacity: Math.max(0.02, 0.25 - i * 0.008),
      color: i % 3 === 0 ? "#00D4FF" : i % 3 === 1 ? "#7B2FFF" : "#00FF88",
      rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.002 + i * 0.0001),
    }));
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Normalize speed around delta for smooth speed changes
    const speedMultiplier = speed * (delta * 60);

    rings.forEach((ring, i) => {
      const child = groupRef.current?.children[i] as THREE.Mesh;
      if (child) {
        // Spin the rings based on their base rotation speed and the overall speed multiplier
        child.rotation.z += ring.rotSpeed * speedMultiplier;

        // Pulse opacity over time
        const mat = child.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = ring.opacity * (0.8 + Math.sin(t * 1.5 + i) * 0.2);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, 0.012, 8, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
