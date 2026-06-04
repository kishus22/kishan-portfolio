"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

const NODE_COUNT = 80;
const MAX_LINES = 60;

function ConstellationScene() {
  const groupRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(NODE_COUNT * 3);
    for (let i = 0; i < NODE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const lineGeometry = useMemo(() => {
    const nodes: [number, number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push([
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2],
      ]);
    }
    const verts: number[] = [];
    for (let i = 0; i < nodes.length && verts.length / 6 < MAX_LINES; i++) {
      for (let j = i + 1; j < nodes.length && verts.length / 6 < MAX_LINES; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        const dz = nodes[i][2] - nodes[j][2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 2.5) {
          verts.push(...nodes[i], ...nodes[j]);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [positions]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} frustumCulled={false}>
        <PointMaterial
          color="#00d4ff"
          size={0.05}
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
}

export default function NeuralConstellation3D() {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.25]}
      >
        <ambientLight intensity={0.15} color="#00d4ff" />
        <ConstellationScene />
      </Canvas>
    </div>
  );
}
