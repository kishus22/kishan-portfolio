"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import type { Mesh } from "three";
import * as THREE from "three";

function OrbitParticle({
  radius,
  speed,
  phase,
}: {
  radius: number;
  speed: number;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.z = Math.sin(t) * radius;
    ref.current.position.y = Math.sin(t * 2) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.85} />
    </mesh>
  );
}

function WireRing({
  radius,
  speed,
  opacity,
}: {
  radius: number;
  speed: number;
  opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed;
    ref.current.rotation.z += delta * speed * 0.6;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={opacity} />
    </mesh>
  );
}

export default function AISphere() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.18;
      coreRef.current.position.y = Math.sin(t * 0.8) * 0.12;
      const pulse = 1 + Math.sin(t * 2.5) * 0.15;
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + pulse * 0.4;
    }
  });

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        radius: 1.55 + (i % 4) * 0.12,
        speed: 0.25 + (i % 5) * 0.05,
        phase: (i / 12) * Math.PI * 2,
      })),
    [],
  );

  return (
    <group>
      <WireRing radius={1.85} speed={0.12} opacity={0.12} />
      <WireRing radius={1.55} speed={-0.18} opacity={0.2} />
      <mesh ref={outerRingRef}>
        <sphereGeometry args={[1.95, 24, 24]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.15} />
      </mesh>

      <Sphere ref={innerRingRef} args={[1.25, 48, 48]}>
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.35} />
      </Sphere>

      <Sphere ref={coreRef} args={[0.95, 64, 64]}>
        <MeshDistortMaterial
          color="#00d4ff"
          distort={0.45}
          speed={2.5}
          roughness={0.05}
          metalness={1}
          emissive="#00d4ff"
          emissiveIntensity={1}
        />
      </Sphere>

      {particles.map((p, i) => (
        <OrbitParticle key={i} radius={p.radius} speed={p.speed} phase={p.phase} />
      ))}

      <pointLight intensity={2.5} color="#00ffff" distance={10} />
      <pointLight position={[2, -2, 3]} intensity={1.2} color="#7b2fff" />
      <ambientLight intensity={0.2} color="#00ffff" />
    </group>
  );
}
