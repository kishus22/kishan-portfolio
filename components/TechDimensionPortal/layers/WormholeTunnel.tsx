"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WormholeTunnelProps {
  speed: number;
  active: boolean;
}

/**
 * WormholeTunnel — A dense cylindrical wormhole tunnel rendered as two layers:
 * 1. 60 concentric animated torus rings that fly toward the camera (warp tunnel)
 * 2. 1200 lightning-streak particles shooting past in radial lines from center
 *
 * Activated only during warp travel (active=true). Ring opacity and speed scale
 * dynamically with the `speed` prop fed from GSAP tunnelSpeedRef.
 */
export default function WormholeTunnel({ speed, active }: WormholeTunnelProps) {
  const ringGroupRef = useRef<THREE.Group>(null);
  const streakRef = useRef<THREE.Points>(null);

  // Generate 60 tunnel rings with staggered depth
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

  // Generate radial lightning streak particles
  const { streakPositions, streakColors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      [0.0, 0.83, 1.0],  // Cyan
      [0.48, 0.18, 1.0], // Purple
      [0.0, 1.0, 0.53],  // Green
      [1.0, 0.42, 0.21], // Orange
      [1.0, 0.85, 0.0],  // Gold
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
    const dtFactor = delta * 60;
    const warpMultiplier = Math.max(1, speed);

    // Animate rings flying toward camera
    if (ringGroupRef.current) {
      ringGroupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const ring = rings[i];
        if (!mesh || !ring) return;

        // Move ring forward
        mesh.position.z += warpMultiplier * ring.rotSpeed * 60 * dtFactor;

        // Spin rings
        mesh.rotation.z += ring.rotSpeed * dtFactor * warpMultiplier;

        // Reset when it passes camera
        if (mesh.position.z > 8) {
          mesh.position.z = -300 - Math.random() * 100;
        }

        // Update opacity
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          const baseOpacity = ring.opacity * Math.min(1, warpMultiplier / 5);
          mat.opacity = Math.min(0.8, baseOpacity + Math.sin(state.clock.elapsedTime * 3 + i) * 0.05);
        }
      });
    }

    // Animate streak particles flying toward camera
    if (streakRef.current) {
      const geo = streakRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;
      const count = posArr.length / 3;
      const speed2 = warpMultiplier * 2.5 * dtFactor;

      for (let i = 0; i < count; i++) {
        posArr[i * 3 + 2] += speed2;
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
      {/* Tunnel Torus Rings */}
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

      {/* Radial Lightning Streak Particles */}
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
