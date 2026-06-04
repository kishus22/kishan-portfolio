"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const NODES = [
  { name: "Software Eng", color: "#FF6B35" },
  { name: "AI / ML", color: "#00D4FF" },
  { name: "Full Stack", color: "#00FF88" },
  { name: "Backend Systems", color: "#7B2FFF" },
  { name: "Databases", color: "#FFB000" },
  { name: "Automation", color: "#FF2E93" },
  { name: "Cloud & APIs", color: "#00D4FF" },
];

function PulseWave({ delay = 0, speed = 1.0 }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * speed + delay) % 2;
    ref.current.scale.setScalar(t * 1.5);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - t / 2) * 0.25;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.05, 0.65, 32]} />
      <meshBasicMaterial color="#00D4FF" transparent side={THREE.DoubleSide} />
    </mesh>
  );
}

function OrbitingParticles({ count = 75 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 1.2 + Math.random() * 2.3;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.6;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      sp[i] = 0.08 + Math.random() * 0.25;
    }
    return [pos, sp];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const speed = speeds[i];
      const xIdx = i * 3;
      const zIdx = i * 3 + 2;
      const x = array[xIdx];
      const z = array[zIdx];
      const angle = speed * 0.008;
      array[xIdx] = x * Math.cos(angle) - z * Math.sin(angle);
      array[zIdx] = x * Math.sin(angle) + z * Math.cos(angle);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
}

function DataPacketStream({ start, end, offset, color }: { start: THREE.Vector3; end: THREE.Vector3; offset: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const progress = (t * 0.45 + offset) % 1.0;
    ref.current.position.lerpVectors(start, end, progress);

    const scale = progress < 0.15 ? progress * 6.6 : progress > 0.85 ? (1.0 - progress) * 6.6 : 1.0;
    ref.current.scale.setScalar(scale * 0.04);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = progress > 0.85 ? (1.0 - progress) / 0.15 : 0.8;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

function EcosystemNode({
  node,
  index,
  total,
  onHover,
}: {
  node: typeof NODES[number];
  index: number;
  total: number;
  onHover: (hovered: boolean) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const angle = (index / total) * Math.PI * 2;
  const radius = 2.0;
  const pos = useMemo(() => {
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(index * 1.5) * 0.35,
      Math.sin(angle) * radius
    );
  }, [angle, index]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = pos.y + Math.sin(t * 1.8 + index) * 0.06;
    const targetScale = hovered ? 1.6 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    onHover(true);
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    onHover(false);
  };

  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), pos], [pos]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <group>
      {/* Radial Connection Line */}
      {/* @ts-ignore */}
      <line geometry={lineGeometry}>
        {/* @ts-ignore */}
        <lineBasicMaterial color={node.color} transparent opacity={hovered ? 0.75 : 0.18} />
      </line>

      {/* Connection Activation Glow Effect */}
      {hovered && (
        /* @ts-ignore */
        <line geometry={lineGeometry}>
          {/* @ts-ignore */}
          <lineBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </line>
      )}

      {/* Animated Data Packets */}
      <DataPacketStream start={new THREE.Vector3(0, 0, 0)} end={pos} offset={0.0} color={node.color} />
      <DataPacketStream start={new THREE.Vector3(0, 0, 0)} end={pos} offset={0.5} color={node.color} />

      {/* Energy Transmission returning from node to core on hover */}
      {hovered && (
        <DataPacketStream start={pos} end={new THREE.Vector3(0, 0, 0)} offset={0.25} color="#ffffff" />
      )}

      {/* Interactable Node Mesh */}
      <mesh
        ref={meshRef}
        position={[pos.x, pos.y, pos.z]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Dynamic HUD Tag */}
      <Html
        position={[pos.x, pos.y + 0.22, pos.z]}
        center
        distanceFactor={3.5}
      >
        <div 
          className="whitespace-nowrap px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono rounded border select-none transition-all duration-300 pointer-events-none"
          style={{
            background: hovered ? "rgba(0, 212, 255, 0.15)" : "rgba(2,4,9,0.85)",
            borderColor: hovered ? node.color : `${node.color}40`,
            color: node.color,
            boxShadow: hovered 
              ? `0 0 15px ${node.color}, inset 0 0 5px ${node.color}`
              : `0 0 10px ${node.color}20`,
            transform: hovered ? "scale(1.1) translateY(-4px)" : "scale(1)",
          }}
        >
          {node.name}
        </div>
      </Html>
    </group>
  );
}

export default function TechEcosystem() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerWireCoreRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const [anyHovered, setAnyHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { mouse, camera } = state;

    // 3D Depth camera movements
    camera.position.z = 4.8 + Math.sin(t * 0.2) * 0.35;
    camera.position.x = Math.sin(t * 0.1) * 0.25;
    camera.position.y = Math.cos(t * 0.12) * 0.15;
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04 + mouse.x * 0.22;
      groupRef.current.rotation.x = mouse.y * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.05;
    }

    const pulseSpeed = anyHovered ? 4.5 : 2.0;
    const pulseAmt = anyHovered ? 0.12 : 0.06;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * pulseSpeed) * pulseAmt;
      coreRef.current.scale.setScalar(pulse);
      (coreRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 
        (anyHovered ? 3.5 : 1.8) + Math.sin(t * pulseSpeed) * 0.4;
    }

    if (innerWireCoreRef.current) {
      innerWireCoreRef.current.rotation.x += 0.008;
      innerWireCoreRef.current.rotation.y += 0.012;
    }

    if (shellRef.current) {
      shellRef.current.rotation.y -= 0.003;
      shellRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Expanding Pulse Waves */}
      <PulseWave delay={0.0} speed={anyHovered ? 1.8 : 1.0} />
      <PulseWave delay={0.65} speed={anyHovered ? 1.8 : 1.0} />
      <PulseWave delay={1.3} speed={anyHovered ? 1.8 : 1.0} />

      {/* Glowing Central Intelligence Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Inner Wire Core */}
      <mesh ref={innerWireCoreRef}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial color="#00FF88" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Holographic energy field sphere shell */}
      <mesh ref={shellRef}>
        <sphereGeometry args={[2.4, 18, 18]} />
        <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.035} />
      </mesh>

      {/* Orbiting particles */}
      <OrbitingParticles count={80} />

      {/* 3D Core Nodes */}
      {NODES.map((node, i) => (
        <EcosystemNode
          key={node.name}
          node={node}
          index={i}
          total={NODES.length}
          onHover={setAnyHovered}
        />
      ))}

      {/* Environment Lighting */}
      <pointLight color="#00D4FF" intensity={2.5} distance={7} />
      <pointLight position={[2, -3, 2]} color="#7B2FFF" intensity={1.5} distance={8} />
      <ambientLight intensity={0.12} />
    </group>
  );
}
