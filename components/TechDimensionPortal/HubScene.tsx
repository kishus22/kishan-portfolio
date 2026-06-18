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

// ─── Node Connection Web (glowing lines between all nodes) ─────────────────
function NodeConnectionWeb() {
  const nodePositions = useMemo(() => DIMENSIONS.map((d) => new THREE.Vector3(...d.pos)), []);
  const colors = useMemo(() => DIMENSIONS.map((d) => d.color), []);

  // Create all node-to-adjacent connections
  const connections = useMemo(() => {
    const pairs: { from: THREE.Vector3; to: THREE.Vector3; colorA: string; colorB: string }[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        // Only connect nearby nodes (within 5 units)
        if (dist < 5.5) {
          pairs.push({
            from: nodePositions[i],
            to: nodePositions[j],
            colorA: colors[i],
            colorB: colors[j],
          });
        }
      }
    }
    return pairs;
  }, [nodePositions, colors]);

  // Build line geometry for each connection
  const lineGeoms = useMemo(() => {
    return connections.map((conn) => {
      const points = [conn.from, conn.to];
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, [connections]);

  const webRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (webRef.current) {
      webRef.current.children.forEach((child, i) => {
        const line = child as THREE.Line;
        const mat = line.material as THREE.LineBasicMaterial;
        if (mat) {
          // Pulsing opacity on each connection, offset by index
          mat.opacity = 0.04 + Math.abs(Math.sin(t * 0.8 + i * 0.5)) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={webRef}>
      {lineGeoms.map((geom, i) => (
        <lineSegments key={i} geometry={geom}>
          <lineBasicMaterial
            color={connections[i].colorA}
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </group>
  );
}

// ─── Live Data Packet flowing between nodes ────────────────────────────────
const PACKET_ROUTES = [
  { from: 0, to: 1 },
  { from: 2, to: 4 },
  { from: 5, to: 3 },
];
const PACKET_COLORS = ["#00D4FF", "#00FF88", "#FFD700"];

function NodeDataPackets() {
  const groupRef = useRef<THREE.Group>(null);
  const nodePositions = useMemo(() => DIMENSIONS.map((d) => new THREE.Vector3(...d.pos)), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      const route = PACKET_ROUTES[idx];
      if (!route) return;
      const progress = (t * 0.35 + idx * 0.33) % 1.0;
      mesh.position.lerpVectors(
        nodePositions[route.from % nodePositions.length],
        nodePositions[route.to % nodePositions.length],
        progress
      );
      const scale = 0.8 + Math.sin(t * 6 + idx) * 0.2;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {PACKET_ROUTES.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial
            color={PACKET_COLORS[i]}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Dimension Node ────────────────────────────────────────────────────────
interface DimensionNodeProps {
  dim: Dimension;
  onEnter: (id: string) => void;
}

function DimensionNode({ dim, onEnter }: DimensionNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const basePos = useMemo(() => new THREE.Vector3(...dim.pos), [dim.pos]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = basePos.y + Math.sin(t * 0.75 + basePos.x) * 0.18;
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.emissiveIntensity = hovered ? 7.0 : 3.5;
      const baseScale = hovered ? 1.25 : 1.0;
      const pulse = hovered ? Math.sin(t * 4.0) * 0.05 : 0;
      meshRef.current.scale.setScalar(baseScale + pulse);
    }
    if (ringRef.current) {
      ringRef.current.position.y = basePos.y + Math.sin(t * 0.75 + basePos.x) * 0.18;
      const spinSpeed = hovered ? 2.5 : 0.4;
      ringRef.current.rotation.y += spinSpeed * 0.01;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    }
    if (innerRingRef.current) {
      innerRingRef.current.position.y = basePos.y + Math.sin(t * 0.75 + basePos.x) * 0.18;
      innerRingRef.current.rotation.y -= (hovered ? 3.0 : 0.5) * 0.012;
      innerRingRef.current.rotation.x = Math.PI / 2.5 + Math.cos(t * 0.6) * 0.1;
      const mat = innerRingRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = hovered ? 0.8 : 0.2;
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

      {/* Outer Halo Ring */}
      <mesh ref={ringRef} position={basePos} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 48]} />
        <meshBasicMaterial
          color={dim.color}
          transparent
          opacity={hovered ? 0.9 : 0.4}
        />
      </mesh>

      {/* Inner counter-rotating ring */}
      <mesh ref={innerRingRef} position={basePos} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.32, 0.006, 6, 32]} />
        <meshBasicMaterial
          color={dim.color}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Billboard Name Label */}
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

      {/* Icon hint when hovered */}
      {hovered && (
        <Html
          position={[basePos.x, basePos.y - 0.55, basePos.z]}
          center
          distanceFactor={6}
          pointerEvents="none"
        >
          <span className="font-[family-name:var(--font-orbitron)] text-[9px] uppercase tracking-widest text-white/60 whitespace-nowrap select-none pointer-events-none animate-pulse">
            [ CLICK TO ENTER ]
          </span>
        </Html>
      )}

      {/* Pointlight */}
      <pointLight
        color={dim.color}
        intensity={hovered ? 6 : 3.5}
        distance={6}
        position={basePos}
      />
    </group>
  );
}

// ─── Hub Scene ─────────────────────────────────────────────────────────────
interface HubSceneProps {
  onEnterDimension: (id: string) => void;
  traveling: boolean;
}

export default function HubScene({ onEnterDimension, traveling }: HubSceneProps) {
  return (
    <group>
      {/* Central Portal Vortex (Layer 5) */}
      <CentralPortal traveling={traveling} />

      {/* Node Connection Web */}
      <NodeConnectionWeb />

      {/* Live Data Packets Streaming Between Nodes */}
      <NodeDataPackets />

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
