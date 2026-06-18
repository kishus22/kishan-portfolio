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
    const neonPalette = [
      "#00D4FF", "#7B2FFF", "#00FF88",
      "#FF6B35", "#FFD700", "#FF007F",
    ];
    return Array.from({ length: 38 }, (_, i) => ({
      z: -i * 3.5 - 2,
      radius: 3.5 + i * 0.32,
      opacity: Math.max(0.02, 0.28 - i * 0.007),
      color: neonPalette[i % neonPalette.length],
      rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.002 + i * 0.00008),
      thickness: i % 4 === 0 ? 0.025 : 0.010,
    }));
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    const speedMultiplier = speed * (delta * 60);
    const isWarping = speed > 1.5;

    rings.forEach((ring, i) => {
      const child = groupRef.current?.children[i] as THREE.Mesh;
      if (child) {
        child.rotation.z += ring.rotSpeed * speedMultiplier;

        // During warp, rings also fly forward (toward the camera)
        if (isWarping) {
          child.position.z += speed * 0.055 * delta * 60;
          // Reset ring to back when it passes the camera
          if (child.position.z > 10) {
            child.position.z = -rings[rings.length - 1].z - 30;
          }
        } else {
          // Drift back to original z positions
          child.position.z += (ring.z - child.position.z) * 0.02;
        }

        // Pulse opacity over time
        const mat = child.material as THREE.MeshBasicMaterial;
        if (mat) {
          const warpBoost = isWarping ? Math.min(1, speed / 8) * 0.4 : 0;
          mat.opacity = ring.opacity * (0.75 + Math.sin(t * 1.5 + i) * 0.25) + warpBoost;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, 0, ring.z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.radius, ring.thickness, 8, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
