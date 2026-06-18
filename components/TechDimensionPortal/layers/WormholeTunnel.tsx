"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WormholeTunnelProps {
  speed: number;
  active: boolean;
  speedRef?: React.MutableRefObject<{ value: number }>;
}

/**
 * WormholeTunnel — Dense cylindrical wormhole rendered during warp travel.
 * - 60 concentric torus rings flying toward camera
 * - 1200 radial lightning-streak particles
 * Reads speed from speedRef.current.value each frame for live GSAP values.
 */
export default function WormholeTunnel({ active, speedRef }: WormholeTunnelProps) {
  const ringGroupRef = useRef<THREE.Group>(null);
  const streakRef = useRef<THREE.Points>(null);

  const rings = useMemo(() => {
    const colors = [
      "#00D4FF", "#7B2FFF", "#00FF88", "#FF6B35", "#FFD700",
    ];
    return Array.from({ length: 60 }, (_, i) => ({
      z: -i * 5 - 2,
      radius: 3.0 + i * 0.35,
      color: colors[i % colors.length],
      rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.003 + i * 0.00012),
      opacity: Math.max(0.01, 0.35 - i * 0.005),
      thickness: 0.008 + (i % 3) * 0.004,
    }));
  }, []);

  const { streakPositions, streakColors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.0, 0.83, 1.0],
      [0.48, 0.18, 1.0],
      [0.0, 1.0, 0.53],
      [1.0, 0.42, 0.21],
      [1.0, 0.85, 0.0],
    ];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const r = 1.5 + Math.random() * 18;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = -Math.random() * 300;
      const c = palette[i % palette.length];
      col[i * 3] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];
    }
    return { streakPositions: pos, streakColors: col };
  }, []);

  const streakGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(streakColors, 3));
    return g;
  }, [streakPositions, streakColors]);

  useFrame((state, delta) => {
    if (!active) return;
    // Read live speed from ref (GSAP mutates this directly, no re-renders needed)
    const liveSpeed = speedRef ? speedRef.current.value : 1;
    const dtFactor = delta * 60;
    const warpMultiplier = Math.max(1, liveSpeed);

    if (ringGroupRef.current) {
      ringGroupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const ring = rings[i];
        if (!mesh || !ring) return;

        mesh.position.z += warpMultiplier * 0.45 * dtFactor;
        mesh.rotation.z += ring.rotSpeed * dtFactor * warpMultiplier;

        if (mesh.position.z > 8) {
          mesh.position.z = -300 - Math.random() * 100;
        }

        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          const baseOpacity = ring.opacity * Math.min(1, warpMultiplier / 5);
          mat.opacity = Math.min(0.8, baseOpacity + Math.sin(state.clock.elapsedTime * 3 + i) * 0.05);
        }
      });
    }

    if (streakRef.current) {
      const geo = streakRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;
      const count = posArr.length / 3;
      const s = warpMultiplier * 2.5 * dtFactor;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 2] += s;
        if (posArr[i * 3 + 2] > 10) {
          const angle = Math.random() * Math.PI * 2;
          const r = 1.5 + Math.random() * 18;
          posArr[i * 3] = Math.cos(angle) * r;
          posArr[i * 3 + 1] = Math.sin(angle) * r;
          posArr[i * 3 + 2] = -300 - Math.random() * 50;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group>
      <group ref={ringGroupRef}>
        {rings.map((ring, i) => (
          <mesh
            key={i}
            position={[0, 0, ring.z]}
            rotation={[Math.PI / 2, 0, 0]}
          >
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

      <points ref={streakRef} geometry={streakGeom}>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
