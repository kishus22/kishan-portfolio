"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

interface CentralPortalProps {
  traveling: boolean;
}

export default function CentralPortal({ traveling }: CentralPortalProps) {
  const portalRing1 = useRef<THREE.Mesh>(null);
  const portalRing2 = useRef<THREE.Mesh>(null);
  const portalRing3 = useRef<THREE.Mesh>(null);
  const portalRing4 = useRef<THREE.Mesh>(null);
  const spiralRef = useRef<THREE.Points>(null);
  const raysRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const gantryRef = useRef<THREE.Group>(null);

  // Flare billboard refs
  const flare1 = useRef<THREE.Group>(null);
  const flare2 = useRef<THREE.Group>(null);
  const flare3 = useRef<THREE.Group>(null);
  const flare4 = useRef<THREE.Group>(null);

  // Local spin speed ref that we can accelerate using GSAP
  const spinSpeedRef = useRef({ value: 1.0 });

  // Spiral Particle Setup
  const spiralData = useMemo(() => {
    const count = 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const originalRadii = new Float32Array(count);
    const angles = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 14;
      const r = 2.5 + t * 2.5;
      
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = -5 + t * 0.5;

      originalRadii[i] = r;
      angles[i] = angle;

      const mixRatio = t;
      col[i * 3] = mixRatio * 0.5;
      col[i * 3 + 1] = (1 - mixRatio) * 0.85;
      col[i * 3 + 2] = 1.0;
    }

    return { pos, col, originalRadii, angles, count };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(spiralData.pos.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(spiralData.col, 3));
    return g;
  }, [spiralData]);

  // GSAP Shockwave Energy Pulse during normal loop
  useEffect(() => {
    if (traveling) return; // Yield pulse control to the traveling timeline

    if (!pulseRef.current) return;
    const mesh = pulseRef.current;
    const mat = mesh.material as THREE.MeshBasicMaterial;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(
        mesh.scale,
        { x: 0, y: 0, z: 0 },
        { x: 8, y: 8, z: 8, duration: 2.2, ease: "power1.out" }
      )
      .fromTo(
        mat,
        { opacity: 1 },
        { opacity: 0, duration: 2.2, ease: "power1.out" },
        "<"
      )
      .to({}, { duration: 0.8 });
    });

    return () => ctx.revert();
  }, [traveling]);

  // Travel Core Activation & Energy Pulse local animation
  useEffect(() => {
    if (!traveling) {
      // Restore default emissive glows and spin speeds when not traveling
      if (portalRing1.current) {
        const mat = portalRing1.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.emissiveIntensity = 5;
      }
      if (portalRing2.current) {
        const mat = portalRing2.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.emissiveIntensity = 4.5;
      }
      if (portalRing3.current) {
        const mat = portalRing3.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.emissiveIntensity = 4.0;
      }
      if (portalRing4.current) {
        const mat = portalRing4.current.material as THREE.MeshStandardMaterial;
        if (mat) mat.emissiveIntensity = 3.5;
      }
      if (spinSpeedRef.current) {
        spinSpeedRef.current.value = 1.0;
      }
      if (raysRef.current) {
        raysRef.current.scale.set(1, 1, 1);
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Phase 1: Spin acceleration + Glowing portal core activation
      tl.to(spinSpeedRef.current, { value: 15.0, duration: 0.9, ease: "power2.in" }, 0.0);

      const ringRefs = [portalRing1, portalRing2, portalRing3, portalRing4];
      ringRefs.forEach((ref) => {
        if (ref.current) {
          const mat = ref.current.material as THREE.MeshStandardMaterial;
          if (mat) {
            tl.to(mat, { emissiveIntensity: 25, duration: 0.85, ease: "power2.in" }, 0.0);
          }
        }
      });

      if (raysRef.current) {
        tl.to(raysRef.current.scale, { x: 2.5, y: 2.5, z: 2.5, duration: 0.85, ease: "power2.in" }, 0.0);
      }

      // Phase 2: Emit massive energy pulse shockwave from center
      if (pulseRef.current) {
        const mat = pulseRef.current.material as THREE.MeshBasicMaterial;
        tl.fromTo(
          pulseRef.current.scale,
          { x: 0, y: 0, z: 0 },
          { x: 32, y: 32, z: 32, duration: 1.4, ease: "power2.out" },
          0.3
        );
        tl.fromTo(
          mat,
          { opacity: 1.0 },
          { opacity: 0.0, duration: 1.4, ease: "power2.out" },
          0.3
        );
      }
    });

    return () => ctx.revert();
  }, [traveling]);

  // Frame animations
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const { camera } = state;
    const speed = spinSpeedRef.current.value * (delta * 60);

    // 1. Swirl the energy rings incrementally
    if (portalRing1.current) portalRing1.current.rotation.z += 0.006 * speed;
    if (portalRing2.current) portalRing2.current.rotation.z -= 0.004 * speed;
    if (portalRing3.current) portalRing3.current.rotation.z += 0.003 * speed;
    if (portalRing4.current) portalRing4.current.rotation.z -= 0.002 * speed;

    // 2. Slowly rotate gantry structure
    if (gantryRef.current) {
      gantryRef.current.rotation.z += 0.0003 * speed;
    }

    // 3. Swirl rays
    if (raysRef.current) {
      raysRef.current.rotation.z -= 0.0007 * speed;
    }

    // 4. Animate spiral particles drifting inward
    if (spiralRef.current) {
      const geo = spiralRef.current.geometry;
      const positions = geo.attributes.position.array as Float32Array;
      const inwardDelta = 0.01 * speed;

      for (let i = 0; i < spiralData.count; i++) {
        spiralData.angles[i] += 0.012 * speed;
        spiralData.originalRadii[i] -= inwardDelta;
        if (spiralData.originalRadii[i] < 0.25) {
          spiralData.originalRadii[i] = 2.5 + (i / spiralData.count) * 2.5;
        }

        const angle = spiralData.angles[i];
        const r = spiralData.originalRadii[i];

        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = Math.sin(angle) * r;
      }
      geo.attributes.position.needsUpdate = true;
      spiralRef.current.rotation.z += 0.0005 * speed;
    }

    // 5. Anamorphic Lens Flare positioning based on camera angle
    const camX = camera.position.x;
    const camY = camera.position.y;

    if (flare1.current) flare1.current.position.set(-camX * 0.4, -camY * 0.4, 0.5);
    if (flare2.current) flare2.current.position.set(-camX * 0.8, -camY * 0.8, 0.7);
    if (flare3.current) flare3.current.position.set(-camX * 1.3, -camY * 1.3, 0.9);
    if (flare4.current) flare4.current.position.set(camX * 0.3, camY * 0.3, 0.3);
  });

  return (
    <group position={[0, 0, -5]}>
      {/* Component A: Central Void Opening */}
      <mesh position={[0, 0, -0.05]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>

      {/* Component B: Energy Spiral Torus Rings */}
      <mesh ref={portalRing1}>
        <torusGeometry args={[2.5, 0.04, 8, 100]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={5}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={portalRing2}>
        <torusGeometry args={[3.0, 0.03, 8, 100]} />
        <meshStandardMaterial
          color="#7B2FFF"
          emissive="#7B2FFF"
          emissiveIntensity={4.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <mesh ref={portalRing3}>
        <torusGeometry args={[3.5, 0.035, 8, 100]} />
        <meshStandardMaterial
          color="#00FF88"
          emissive="#00FF88"
          emissiveIntensity={4}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={portalRing4}>
        <torusGeometry args={[4.0, 0.025, 8, 100]} />
        <meshStandardMaterial
          color="#7B2FFF"
          emissive="#7B2FFF"
          emissiveIntensity={3.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* COLOSSAL GATEWAY GANTRY ARCH (Ancient-Futuristic Structure) */}
      <group ref={gantryRef}>
        {/* Massive Outer Cage Ring */}
        <mesh position={[0, 0, -0.2]}>
          <torusGeometry args={[4.35, 0.15, 8, 48]} />
          <meshStandardMaterial
            color="#091428"
            wireframe={true}
            emissive="#00D4FF"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, 0, -0.25]}>
          <torusGeometry args={[4.55, 0.04, 6, 48]} />
          <meshBasicMaterial color="#101F38" transparent opacity={0.6} />
        </mesh>

        {/* 12 Heavy Structural Spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <group key={i} rotation={[0, 0, angle]}>
              {/* Spoke Struts */}
              <mesh position={[3.35, 0, -0.1]}>
                <boxGeometry args={[1.7, 0.08, 0.1]} />
                <meshStandardMaterial
                  color="#091428"
                  wireframe={true}
                  emissive="#00D4FF"
                  emissiveIntensity={0.35}
                />
              </mesh>
              
              {/* Glowing gantry panel power cells */}
              <mesh position={[4.1, 0, -0.05]}>
                <boxGeometry args={[0.2, 0.15, 0.08]} />
                <meshStandardMaterial
                  color="#7B2FFF"
                  emissive="#7B2FFF"
                  emissiveIntensity={4.5}
                />
              </mesh>
            </group>
          );
        })}

        {/* Segmented rotating outer shield panels */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 4.75, Math.sin(angle) * 4.75, -0.15]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[1.2, 0.15, 0.1]} />
              <meshStandardMaterial
                color="#0f172a"
                wireframe={true}
                emissive="#00FF88"
                emissiveIntensity={0.3}
              />
            </mesh>
          );
        })}
      </group>

      {/* Component C: Spiral Particle Stream */}
      <points ref={spiralRef} geometry={geom}>
        <pointsMaterial
          size={0.14}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Component D: Volumetric Light Rays */}
      <group ref={raysRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI) / 6;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, 0.15]}
              rotation={[0, 0, angle + Math.PI / 2]}
            >
              <planeGeometry args={[0.08, 5.0]} />
              <meshBasicMaterial
                color="#00D4FF"
                transparent
                opacity={0.16}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          );
        })}
      </group>

      {/* Component E: Portal Energy Pulse (expanding shockwave) */}
      <mesh ref={pulseRef}>
        <torusGeometry args={[1.0, 0.04, 8, 64]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.0}
          depthWrite={false}
        />
      </mesh>

      {/* CINEMATIC LENS FLARES (Additive Glare meshes aligned to offset vector) */}
      <Billboard ref={flare1}>
        <mesh>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial
            color="#00D4FF"
            transparent
            opacity={0.2}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      <Billboard ref={flare2}>
        <mesh>
          <planeGeometry args={[2.5, 2.5]} />
          <meshBasicMaterial
            color="#7B2FFF"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      <Billboard ref={flare3}>
        <mesh>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial
            color="#FF6B35"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>

      <Billboard ref={flare4}>
        <mesh>
          <planeGeometry args={[0.5, 0.5]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </Billboard>
    </group>
  );
}
