"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ForegroundParticlesProps {
  speed: number;
}

export default function ForegroundParticles({ speed }: ForegroundParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count; i++) {
      // Position particles close to camera
      pos[i * 3] = (Math.random() - 0.5) * 8; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6; // Y
      pos[i * 3 + 2] = -0.5 - Math.random() * 3.5; // Z: -0.5 to -4

      // Cyan (#00D4FF) and Purple (#7B2FFF) mix
      const isCyan = Math.random() > 0.5;
      col[i * 3] = isCyan ? 0.0 : 0.48; // Red
      col[i * 3 + 1] = isCyan ? 0.83 : 0.18; // Green
      col[i * 3 + 2] = 1.0; // Blue

      speeds.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: 0.004 + Math.random() * 0.006,
      });
    }

    return { pos, col, count, speeds };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(particleData.pos.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(particleData.col, 3));
    return g;
  }, [particleData]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const positions = geo.attributes.position.array as Float32Array;
    const dtFactor = delta * 60; // Normalize at 60fps
    const isWarping = speed > 1.5;
    const speedMultiplier = isWarping ? speed * 3.5 : 1.0;

    for (let i = 0; i < particleData.count; i++) {
      positions[i * 3] += particleData.speeds[i].x * dtFactor;
      positions[i * 3 + 1] += particleData.speeds[i].y * dtFactor;
      positions[i * 3 + 2] += particleData.speeds[i].z * dtFactor * speedMultiplier;

      // If it gets too close to the camera viewport (z > -0.2), reset it to the back
      if (positions[i * 3 + 2] > -0.2) {
        positions[i * 3 + 2] = -4.0;
        positions[i * 3] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
