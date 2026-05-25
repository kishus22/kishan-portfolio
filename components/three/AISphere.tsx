"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";

export default function AISphere() {
  const coreRef = useRef<Mesh>(null);
  const wireRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.12;
      coreRef.current.rotation.y = t * 0.22;
      coreRef.current.position.y = Math.sin(t * 0.7) * 0.2;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.08;
      wireRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group>
      <Sphere ref={wireRef} args={[1.65, 32, 32]}>
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.25}
        />
      </Sphere>

      <Sphere ref={coreRef} args={[1.15, 128, 128]}>
        <MeshDistortMaterial
          color="#00ffff"
          attach="material"
          distort={0.55}
          speed={3}
          roughness={0.05}
          metalness={1}
          emissive="#004444"
          emissiveIntensity={1.2}
        />
      </Sphere>

      <pointLight intensity={2} color="#00ffff" distance={8} />
      <pointLight position={[2, -2, 2]} intensity={1} color="#a855f7" />
    </group>
  );
}
