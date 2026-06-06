"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface NebulaCloudsProps {
  speed: number;
}

export default function NebulaClouds({ speed }: NebulaCloudsProps) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Cluster in 5 groups
      const cluster = Math.floor(Math.random() * 5);
      const cx = [-15, 15, 0, -20, 20][cluster];
      const cy = [-8, 8, 15, 0, -5][cluster];
      pos[i * 3] = cx + (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = cy + (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -30 + (Math.random() - 0.5) * 30;

      // Alternate cyan and purple
      const isCyan = i % 2 === 0;
      col[i * 3] = isCyan ? 0.0 : 0.48; // Red
      col[i * 3 + 1] = isCyan ? 0.83 : 0.18; // Green
      col[i * 3 + 2] = isCyan ? 1.0 : 1.0; // Blue
    }

    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      const isWarping = speed > 1.5;
      const rate = delta * 60; // Normalize at 60fps
      ref.current.rotation.y += 0.0003 * (isWarping ? speed * 1.5 : 1.0) * rate;
      ref.current.rotation.z += 0.00015 * (isWarping ? speed * 1.5 : 1.0) * rate;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
