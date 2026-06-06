"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { DIMENSIONS, Dimension } from "./data";
import CentralPortal from "./layers/CentralPortal";
import PortalRingsForeground from "./layers/PortalRingsForeground";
import EnergyWaves from "./layers/EnergyWaves";
import HolographicFragments from "./layers/HolographicFragments";

interface DimensionNodeProps {
  dim: Dimension;
  onEnter: (id: string) => void;
}

function DimensionNode({ dim, onEnter }: DimensionNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const basePos = useMemo(() => new THREE.Vector3(...dim.pos), [dim.pos]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      // Gentle floating animation offset by pos X to prevent synchrony
      meshRef.current.position.y = basePos.y + Math.sin(t * 0.75 + basePos.x) * 0.18;

      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = hovered ? 7.0 : 3.5;
      }

      // Responsive hover scale pulse
      const baseScale = hovered ? 1.25 : 1.0;
      const pulse = hovered ? Math.sin(t * 4.0) * 0.05 : 0;
      meshRef.current.scale.setScalar(baseScale + pulse);
    }

    if (ringRef.current) {
      ringRef.current.position.y = basePos.y + Math.sin(t * 0.75 + basePos.x) * 0.18;
      // Spin the outer halo ring faster when hovered
      const spinSpeed = hovered ? 2.5 : 0.4;
      ringRef.current.rotation.y += spinSpeed * 0.01;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Central Node Sphere */}
      <mesh
        ref={meshRef}
        position={basePos}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEnter(dim.id);
        }}
      >
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshStandardMaterial
          color={dim.color}
          emissive={dim.color}
          emissiveIntensity={3.5}
        />
      </mesh>

      {/* Orbiting Outer Halo Ring */}
      <mesh ref={ringRef} position={basePos} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 48]} />
        <meshBasicMaterial
          color={dim.color}
          transparent
          opacity={hovered ? 0.9 : 0.4}
        />
      </mesh>

      {/* Billboard Name Label above node */}
      <Html
        position={[basePos.x, basePos.y + 0.65, basePos.z]}
        center
        distanceFactor={6}
        pointerEvents="none"
      >
        <span
          className="font-[family-name:var(--font-orbitron)] text-[12px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none"
          style={{
            color: dim.color,
            textShadow: `0 0 8px ${dim.color}80`,
          }}
        >
          {dim.label}
        </span>
      </Html>

      {/* Pointlight for local glow casting */}
      <pointLight
        color={dim.color}
        intensity={hovered ? 6 : 3.5}
        distance={6}
        position={basePos}
      />
    </group>
  );
}

interface HubSceneProps {
  onEnterDimension: (id: string) => void;
  traveling: boolean;
}

export default function HubScene({ onEnterDimension, traveling }: HubSceneProps) {
  return (
    <group>
      {/* Central Portal Vortex (Layer 5) */}
      <CentralPortal traveling={traveling} />

      {/* Portal Rings Foreground (Layer 4) */}
      <PortalRingsForeground />

      {/* Energy Waves (Layer 3) */}
      <EnergyWaves />

      {/* Holographic Fragments (Layer 2) */}
      <HolographicFragments />

      {/* 7 Category Nodes (Layer 6) */}
      {DIMENSIONS.map((dim) => (
        <DimensionNode key={dim.id} dim={dim} onEnter={onEnterDimension} />
      ))}
    </group>
  );
}
