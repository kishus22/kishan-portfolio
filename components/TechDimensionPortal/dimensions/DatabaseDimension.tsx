"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface MonolithProps {
  label: string;
  position: [number, number, number];
  height: number;
  yOffset: number;
}

function StorageMonolith({ label, position, height, yOffset }: MonolithProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const vaultRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const floatVal = Math.sin(t * 1.0 + yOffset) * 0.12;

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + floatVal;
      meshRef.current.rotation.y = t * 0.12;
    }

    if (vaultRef.current) {
      vaultRef.current.position.y = position[1] + height / 2 + 0.6 + floatVal;
      vaultRef.current.rotation.y = -t * 0.35;
      vaultRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group>
      {/* Golden Wireframe Monolith Pillar */}
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshStandardMaterial
          color="#FFD700"
          wireframe={true}
          emissive="#FFD700"
          emissiveIntensity={3.0}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Faint solid golden center core */}
      <mesh position={[position[0], position[1], position[2]]} scale={[0.8, 0.95, 0.8]}>
        <boxGeometry args={[0.7, height, 0.7]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.05} />
      </mesh>

      {/* Floating Rotating Golden Crystal Vault (Octahedron) */}
      <mesh ref={vaultRef} position={[position[0], position[1] + height / 2 + 0.6, position[2]]}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color="#FFD700"
          wireframe={true}
          emissive="#FFD700"
          emissiveIntensity={4.5}
        />
      </mesh>

      <pointLight color="#FFD700" intensity={2.5} distance={4.5} position={[position[0], position[1], position[2]]} />

      <Html
        position={[position[0], position[1] + height / 2 + 1.2, position[2]]}
        center
        distanceFactor={8}
        pointerEvents="none"
      >
        <span
          className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none text-[#FFD700]"
          style={{
            textShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
          }}
        >
          {label}
        </span>
      </Html>
    </group>
  );
}

// Waving Golden Ocean of Information
function GoldenInformationOcean() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions } = useMemo(() => {
    const size = 30; // 30x30 particle grid
    const list = [];
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const xp = (x - size / 2) * 0.85;
        const zp = (z - size / 2) * 0.85 - 4; // Centered deeper
        list.push(xp, -4.5, zp);
      }
    }
    return { positions: new Float32Array(list) };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posArr = geo.attributes.position.array as Float32Array;
      const size = 30;
      let idx = 0;
      for (let x = 0; x < size; x++) {
        for (let z = 0; z < size; z++) {
          const xp = posArr[idx * 3];
          const zp = posArr[idx * 3 + 2];
          // Harmonic wave sway math
          posArr[idx * 3 + 1] = -4.2 + Math.sin(xp * 0.22 + t * 1.5) * Math.cos(zp * 0.22 + t * 1.0) * 0.42;
          idx++;
        }
      }
      geo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        color="#FFD700"
        size={0.065}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
}

export default function DatabaseDimension() {
  const centralSunRef = useRef<THREE.Mesh>(null);
  const memoryRingRef = useRef<THREE.Mesh>(null);
  
  // Monolith positions stored dynamically
  const m1Pos = useMemo(() => new THREE.Vector3(-3.2, -1.0, -4), []);
  const m2Pos = useMemo(() => new THREE.Vector3(3.2, -1.0, -4), []);
  const m3Pos = useMemo(() => new THREE.Vector3(0, 1.2, -5.5), []);
  const sunPos = useMemo(() => new THREE.Vector3(0, -0.6, -4), []);

  // Packet Refs
  const packet1 = useRef<THREE.Mesh>(null);
  const packet2 = useRef<THREE.Mesh>(null);
  const packet3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Central Query Engine pulse
    if (centralSunRef.current) {
      const scale = 1.0 + Math.sin(t * 2.0) * 0.05;
      centralSunRef.current.scale.setScalar(scale);
      centralSunRef.current.rotation.y = t * 0.12;
    }

    // Concentric Memory Ring rotation
    if (memoryRingRef.current) {
      memoryRingRef.current.rotation.z = -t * 0.15;
    }

    // Lerp Information packets
    if (packet1.current) {
      const progress = (t * 0.45) % 1.0;
      packet1.current.position.lerpVectors(sunPos, m1Pos, progress);
    }
    if (packet2.current) {
      const progress = (t * 0.5) % 1.0;
      packet2.current.position.lerpVectors(sunPos, m2Pos, progress);
    }
    if (packet3.current) {
      const progress = (t * 0.4) % 1.0;
      packet3.current.position.lerpVectors(sunPos, m3Pos, progress);
    }
  });

  return (
    <group>
      {/* Central Golden Query Engine */}
      <group position={[sunPos.x, sunPos.y, sunPos.z]}>
        <mesh ref={centralSunRef}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color="#FFD700"
            wireframe={true}
            emissive="#FFD700"
            emissiveIntensity={3}
          />
        </mesh>
        
        {/* Core lighting */}
        <pointLight color="#FFD700" intensity={6} distance={12} />
        
        {/* Concentric Memory Rings */}
        <mesh ref={memoryRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.0, 0.015, 6, 64]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
        </mesh>

        <Html
          position={[0, 0.85, 0]}
          center
          distanceFactor={8}
          pointerEvents="none"
        >
          <span
            className="font-[family-name:var(--font-orbitron)] text-[12px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none text-white"
            style={{
              textShadow: "0 0 8px #FFD700",
            }}
          >
            ARCHIVE ENGINE
          </span>
        </Html>
      </group>

      {/* MySQL Storage Monolith */}
      <StorageMonolith
        label="MySQL Monolith"
        position={[-3.2, -1.0, -4]}
        height={3.4}
        yOffset={0.0}
      />

      {/* PostgreSQL Storage Monolith */}
      <StorageMonolith
        label="PostgreSQL Monolith"
        position={[3.2, -1.0, -4]}
        height={3.4}
        yOffset={0.5}
      />

      {/* MongoDB Storage Monolith */}
      <StorageMonolith
        label="MongoDB Monolith"
        position={[0, 1.2, -5.5]}
        height={2.8}
        yOffset={1.0}
      />

      {/* Golden Data Beams connections */}
      {[m1Pos, m2Pos, m3Pos].map((pos, idx) => {
        const points = [sunPos, pos];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={idx} geometry={geom}>
            <lineBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.15}
              depthWrite={false}
            />
          </line>
        );
      })}

      {/* Golden Waving Information Ocean at bottom */}
      <GoldenInformationOcean />

      {/* Golden Query Data Packets racing along paths */}
      <mesh ref={packet1}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      <mesh ref={packet2}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      <mesh ref={packet3}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}
