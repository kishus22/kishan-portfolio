"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Mesh, Group } from "three";
import * as THREE from "three";

function ReactorScene() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);
  const middleRef = useRef<Mesh>(null);
  const outerRef = useRef<Mesh>(null);
  const particlesRef = useRef<Group>(null);

  const pulseRef = useRef<Mesh>(null);
  const innerWireCoreRef = useRef<Mesh>(null);
  const pulseLightRef = useRef<THREE.PointLight>(null);
  const orbitingRefs = useRef<(Mesh | null)[]>([]);
  const trailRefs1 = useRef<(Mesh | null)[]>([]);
  const trailRefs2 = useRef<(Mesh | null)[]>([]);

  useEffect(() => {
    orbitingRefs.current = [];
    trailRefs1.current = [];
    trailRefs2.current = [];
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { mouse } = state;

    if (groupRef.current) {
      groupRef.current.rotation.y = mouse.x * 0.26;
      groupRef.current.rotation.x = mouse.y * 0.26;
      groupRef.current.position.z = Math.sin(t * 0.5) * 0.1;
    }
    if (coreRef.current) {
      const pulse = Math.sin(t * 2) * 0.05 + 1;
      coreRef.current.scale.setScalar(pulse);
    }
    if (innerRef.current) innerRef.current.rotation.x += 0.01;
    if (middleRef.current) middleRef.current.rotation.y -= 0.007;
    if (outerRef.current) outerRef.current.rotation.z += 0.004;
    if (particlesRef.current) particlesRef.current.rotation.y += 0.002;

    // Energy pulse ring expands from core outward and fades every 2s
    const pulseTime = t % 2.0;
    if (pulseRef.current) {
      if (pulseTime <= 1.5) {
        const progress = pulseTime / 1.5;
        const scale = 0.3 + (2.0 - 0.3) * progress;
        pulseRef.current.scale.setScalar(scale);
        const opacity = 1.0 - progress;
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        pulseRef.current.visible = true;
      } else {
        pulseRef.current.visible = false;
      }
    }

    // Inner wireframe sphere rotates faster than outer rings
    if (innerWireCoreRef.current) {
      innerWireCoreRef.current.rotation.x += 0.02;
      innerWireCoreRef.current.rotation.y += 0.02;
      innerWireCoreRef.current.rotation.z += 0.02;
    }

    // 4 bright particles orbiting the inner ring plane
    const orbitSpeed = 1.5;
    for (let i = 0; i < 4; i++) {
      const angle = t * orbitSpeed + (i * Math.PI) / 2;
      
      const mesh = orbitingRefs.current[i];
      if (mesh) {
        mesh.position.x = Math.cos(angle) * 0.55;
        mesh.position.y = Math.sin(angle) * 0.55;
        mesh.position.z = 0;
      }
      
      const trail1 = trailRefs1.current[i];
      if (trail1) {
        const a1 = (t - 0.08) * orbitSpeed + (i * Math.PI) / 2;
        trail1.position.x = Math.cos(a1) * 0.55;
        trail1.position.y = Math.sin(a1) * 0.55;
        trail1.position.z = 0;
      }

      const trail2 = trailRefs2.current[i];
      if (trail2) {
        const a2 = (t - 0.16) * orbitSpeed + (i * Math.PI) / 2;
        trail2.position.x = Math.cos(a2) * 0.55;
        trail2.position.y = Math.sin(a2) * 0.55;
        trail2.position.z = 0;
      }
    }

    // PointLight at center pulsing (2 to 4 to 2 in 2s loop)
    if (pulseLightRef.current) {
      const pulseIntensity = Math.sin(t * Math.PI) * 1 + 3;
      pulseLightRef.current.intensity = pulseIntensity;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={4} metalness={1} roughness={0.1} />
      </mesh>

      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.85} />
      </mesh>

      {/* Core Wireframe Core inside */}
      <mesh ref={innerWireCoreRef}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#00d4ff" wireframe />
      </mesh>

      {/* Energy Pulse Ring */}
      <mesh ref={pulseRef}>
        <torusGeometry args={[0.5, 0.015, 8, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0} />
      </mesh>

      <mesh ref={middleRef}>
        <torusGeometry args={[0.75, 0.015, 16, 64]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>

      <mesh ref={outerRef}>
        <torusGeometry args={[1, 0.01, 16, 64]} />
        <meshBasicMaterial color="#7b2fff" transparent opacity={0.4} />
      </mesh>

      {/* 4 Orbiting particles with trails */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i}>
          <mesh ref={(el) => { orbitingRefs.current[i] = el; }}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={5} />
          </mesh>
          <mesh ref={(el) => { trailRefs1.current[i] = el; }}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
          </mesh>
          <mesh ref={(el) => { trailRefs2.current[i] = el; }}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.15} />
          </mesh>
        </group>
      ))}

      <group ref={particlesRef}>
        {Array.from({ length: 24 }).map((_, i) => {
          const phi = (i / 24) * Math.PI * 2;
          const theta = ((i % 6) / 6) * Math.PI;
          return (
            <mesh
              key={i}
              position={[
                Math.sin(theta) * Math.cos(phi) * 1.1,
                Math.cos(theta) * 1.1,
                Math.sin(theta) * Math.sin(phi) * 1.1,
              ]}
            >
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
            </mesh>
          );
        })}
      </group>

      <pointLight ref={pulseLightRef} color="#00d4ff" intensity={3} distance={3} decay={2} />
      <pointLight position={[2, -1, 2]} color="#7b2fff" intensity={1} />
      <ambientLight intensity={0.2} />
    </group>
  );
}

export default function ArcReactor3D() {
  const isMobile = useIsMobile();
  if (isMobile) return null;

  return (
    <div className="pointer-events-none absolute -right-4 top-1/2 z-[5] hidden h-[240px] w-[240px] -translate-y-1/2 md:block lg:-right-8">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        style={{ width: 240, height: 240, background: "transparent" }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <ReactorScene />
      </Canvas>
    </div>
  );
}
