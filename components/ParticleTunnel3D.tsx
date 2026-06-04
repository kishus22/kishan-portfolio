"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

const COUNT = 300;

function TunnelParticles() {
  const ref = useRef<THREE.Points>(null);
  const speeds = useMemo(() => Float32Array.from({ length: COUNT }, () => 0.8 + Math.random() * 0.6), []);

  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 2;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      posAttr.array[i * 3 + 2] += speeds[i] * delta * 4;
      if (posAttr.array[i * 3 + 2] > 10) posAttr.array[i * 3 + 2] = -10;
    }
    posAttr.needsUpdate = true;
    if (groupRef.current) groupRef.current.rotation.z += 0.002;
  });

  return (
    <group ref={groupRef}>
      <Points ref={ref} positions={positions} frustumCulled={false}>
        <PointMaterial
          color="#00d4ff"
          size={0.03}
          transparent
          opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ParticleTunnel3D() {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <div className="relative z-[5] h-[180px] w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        style={{ width: "100%", height: "100%", background: "transparent" }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.25]}
      >
        <fog attach="fog" args={["#020409", 4, 18]} />
        <TunnelParticles />
      </Canvas>
      <div className="tunnel-fade-top pointer-events-none absolute inset-x-0 top-0 h-16" />
      <div className="tunnel-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-16" />
    </div>
  );
}
