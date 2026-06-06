"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EnergyRivers() {
  const pointsRef = useRef<THREE.Points>(null);

  // Rivers configuration
  // 3 rivers, each with 200 particles flowing in spirals
  const riverData = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    // Store progress, speed, and river-branch index per particle
    const progressList = new Float32Array(count);
    const speeds = new Float32Array(count);
    const branches = new Uint8Array(count);

    for (let i = 0; i < count; i++) {
      const p = Math.random(); // Progress: 0 (near portal) to 1 (infinite deep space)
      progressList[i] = p;
      speeds[i] = 0.0015 + Math.random() * 0.0015;
      
      const branch = i % 3;
      branches[i] = branch;

      // Color mapping: Cyan for branch 0, Purple for branch 1, Green for branch 2
      if (branch === 0) {
        col[i * 3] = 0.0;     // R
        col[i * 3 + 1] = 0.83; // G
        col[i * 3 + 2] = 1.0;  // B
      } else if (branch === 1) {
        col[i * 3] = 0.48;
        col[i * 3 + 1] = 0.18;
        col[i * 3 + 2] = 1.0;
      } else {
        col[i * 3] = 0.0;
        col[i * 3 + 1] = 1.0;
        col[i * 3 + 2] = 0.53;
      }
    }

    return { pos, col, count, progressList, speeds, branches };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(riverData.pos.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(riverData.col, 3));
    return g;
  }, [riverData]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const positions = geo.attributes.position.array as Float32Array;
    const dtFactor = delta * 60; // Normalize at 60fps

    for (let i = 0; i < riverData.count; i++) {
      // Flow particles inward (progress decreases toward 0)
      riverData.progressList[i] -= riverData.speeds[i] * dtFactor;

      // Wrap back to deep space edge (1.0) when it reaches portal opening (0.0)
      if (riverData.progressList[i] < 0.0) {
        riverData.progressList[i] = 1.0;
      }

      const p = riverData.progressList[i];
      const branchOffset = (riverData.branches[i] * Math.PI * 2) / 3;
      
      // Spiral math: radius expands in deep space, tightens near portal core
      const radius = p * 16.0 + 0.8;
      const angle = p * Math.PI * 7.5 + branchOffset + (state.clock.getElapsedTime() * 0.1);
      
      // Calculate 3D coordinates winding from Z: -75 to Z: -5
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = -75.0 + (1.0 - p) * 70.0;
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
