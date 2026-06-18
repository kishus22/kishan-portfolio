"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface CircuitNode {
  name: string;
  pos: [number, number, number];
}

interface PipelineStage {
  name: string;
  pos: [number, number, number];
}

// ─── Advanced Signal Network (particle streams between nodes) ─────────────
function SignalNetwork() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, velocities } = useMemo(() => {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count);

    // Node positions for signal streams
    const nodeList = [
      [-3, -1, -3], [-1, -1, -5], [1, -1, -5],
      [-2, -1, -7], [2, -1, -7], [4, 0, -4],
    ];

    for (let i = 0; i < count; i++) {
      const startNode = nodeList[i % nodeList.length];
      const endNode = nodeList[(i + 1) % nodeList.length];
      const t = (i / count);
      // Lerp along a connection path
      pos[i * 3] = startNode[0] + (endNode[0] - startNode[0]) * t;
      pos[i * 3 + 1] = startNode[1] + (endNode[1] - startNode[1]) * t;
      pos[i * 3 + 2] = startNode[2] + (endNode[2] - startNode[2]) * t;

      // Speed: how far along each particle is in the stream
      vel[i] = Math.random();

      // Colors: gold signals
      col[i * 3] = 1.0;
      col[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      col[i * 3 + 2] = 0.0;
    }

    return { positions: pos, colors: col, velocities: vel };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  const nodeList = useMemo(() => [
    [-3, -1, -3], [-1, -1, -5], [1, -1, -5],
    [-2, -1, -7], [2, -1, -7], [4, 0, -4],
  ], []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;
    const count = pos.length / 3;

    for (let i = 0; i < count; i++) {
      velocities[i] = (velocities[i] + delta * 0.6) % 1.0;
      const t = velocities[i];
      const startNode = nodeList[i % nodeList.length];
      const endNode = nodeList[(i + 1) % nodeList.length];
      pos[i * 3] = startNode[0] + (endNode[0] - startNode[0]) * t;
      pos[i * 3 + 1] = startNode[1] + (endNode[1] - startNode[1]) * t;
      pos[i * 3 + 2] = startNode[2] + (endNode[2] - startNode[2]) * t;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Advanced Gear Component ──────────────────────────────────────────────
function AdvancedGear({
  position,
  radius,
  color,
  rotDir,
  speed,
  teeth,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  rotDir: number;
  speed: number;
  teeth: number;
}) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += rotDir * speed * delta * 60 * 0.006;
    }
  });

  return (
    <group ref={gearRef} position={position}>
      {/* Main gear disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, 0.06, Math.max(teeth, 8)]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Center hub */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.22, radius * 0.22, 0.12, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Gear teeth (boxes around the rim) */}
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i / teeth) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (radius + 0.05), 0, Math.sin(angle) * (radius + 0.05)]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.08, 0.1, 0.12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
            />
          </mesh>
        );
      })}

      <pointLight color={color} intensity={2} distance={3} />
    </group>
  );
}

// ─── Bouncing Piston ─────────────────────────────────────────────────────
function Piston({ position, color, phase }: { position: [number, number, number]; color: string; phase: number }) {
  const pistonRef = useRef<THREE.Mesh>(null);
  const rodRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const travel = Math.abs(Math.sin(t * 2.8 + phase)) * 0.55;
    if (pistonRef.current) pistonRef.current.position.y = position[1] + travel;
    if (rodRef.current) {
      rodRef.current.position.y = position[1] + travel * 0.5;
      // Scale rod to match piston height
      rodRef.current.scale.y = 0.6 + travel * 0.8;
    }
  });

  return (
    <group>
      {/* Piston Head */}
      <mesh ref={pistonRef} position={[position[0], position[1], position[2]]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 8]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          emissive={color}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Piston Rod */}
      <mesh ref={rodRef} position={[position[0], position[1] - 0.3, position[2]]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Cylinder Housing */}
      <mesh position={[position[0], position[1] - 0.7, position[2]]}>
        <cylinderGeometry args={[0.13, 0.13, 0.55, 8, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function AutomationDimension() {
  const groupRef = useRef<THREE.Group>(null);

  const circuitPacketRef = useRef<THREE.Mesh>(null);
  const pipelinePacketRef = useRef<THREE.Mesh>(null);
  const reactorCoreRef = useRef<THREE.Group>(null);

  const circuitNodes = useMemo<CircuitNode[]>(() => [
    { name: "Pytest", pos: [-3, -1, -3] },
    { name: "Postman", pos: [-1, -1, -5] },
    { name: "API Testing", pos: [1, -1, -5] },
    { name: "Unit Testing", pos: [-2, -1, -7] },
    { name: "Regression Testing", pos: [2, -1, -7] },
  ], []);

  const pipelineStages = useMemo<PipelineStage[]>(() => [
    { name: "Plan", pos: [4, 1.8, -4] },
    { name: "Build", pos: [4, 0.6, -4] },
    { name: "Test", pos: [4, -0.6, -4] },
    { name: "Deploy", pos: [4, -1.8, -4] },
  ], []);

  const circuitLines = useMemo(() => {
    const lines = [];
    lines.push(new THREE.Vector3(-3, -1, -3), new THREE.Vector3(-1, -1, -5));
    lines.push(new THREE.Vector3(-1, -1, -5), new THREE.Vector3(1, -1, -5));
    lines.push(new THREE.Vector3(-1, -1, -5), new THREE.Vector3(-2, -1, -7));
    lines.push(new THREE.Vector3(1, -1, -5), new THREE.Vector3(2, -1, -7));
    lines.push(new THREE.Vector3(-2, -1, -7), new THREE.Vector3(2, -1, -7));
    lines.push(new THREE.Vector3(1, -1, -5), new THREE.Vector3(4, -0.6, -4));
    const geom = new THREE.BufferGeometry().setFromPoints(lines);
    return geom;
  }, []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const cycle = elapsed % 3.0;

    if (reactorCoreRef.current) {
      reactorCoreRef.current.rotation.y = elapsed * 0.4;
      const s = 1.0 + Math.sin(elapsed * 4.0) * 0.08;
      reactorCoreRef.current.scale.setScalar(s);
    }

    if (circuitPacketRef.current) {
      if (cycle >= 1.2 && cycle < 2.0) {
        circuitPacketRef.current.visible = true;
        const progress = (cycle - 1.2) / 0.8;
        const start = new THREE.Vector3(-3, -1, -3);
        const mid = new THREE.Vector3(1, -1, -5);
        const end = new THREE.Vector3(4, -0.6, -4);
        if (progress < 0.5) {
          circuitPacketRef.current.position.lerpVectors(start, mid, progress * 2);
        } else {
          circuitPacketRef.current.position.lerpVectors(mid, end, (progress - 0.5) * 2);
        }
      } else {
        circuitPacketRef.current.visible = false;
      }
    }

    if (pipelinePacketRef.current) {
      if (cycle < 0.6) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(0, 3, -4), new THREE.Vector3(4, 1.8, -4), cycle / 0.6
        );
      } else if (cycle >= 0.6 && cycle < 1.2) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(4, 1.8, -4), new THREE.Vector3(4, 0.6, -4), (cycle - 0.6) / 0.6
        );
      } else if (cycle >= 1.2 && cycle < 2.0) {
        pipelinePacketRef.current.visible = false;
      } else if (cycle >= 2.0 && cycle < 2.6) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(4, -0.6, -4), new THREE.Vector3(4, -1.8, -4), (cycle - 2.0) / 0.6
        );
      } else {
        pipelinePacketRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Circuit Grid Layout Lines */}
      <lineSegments geometry={circuitLines}>
        <lineBasicMaterial color="#00D4FF" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>

      {/* Advanced Signal Network Particles */}
      <SignalNetwork />

      {/* Circuit Nodes */}
      {circuitNodes.map((node, idx) => (
        <group key={idx} position={node.pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
            <meshStandardMaterial
              color="#00D4FF"
              wireframe={true}
              emissive="#00D4FF"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight color="#00D4FF" intensity={1} distance={2.5} />
          <Html position={[0, 0.35, 0]} center distanceFactor={8} pointerEvents="none">
            <span
              className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none text-[#00D4FF]"
              style={{ textShadow: "0 0 6px rgba(0, 212, 255, 0.6)" }}
            >
              {node.name}
            </span>
          </Html>
        </group>
      ))}

      {/* Circuit Flow Packet */}
      <mesh ref={circuitPacketRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Workflow Reactor Core */}
      <group ref={reactorCoreRef} position={[0, -0.9, -4.5]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 8]} />
          <meshStandardMaterial color="#FFD700" wireframe={true} emissive="#FFD700" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <pointLight color="#FFD700" intensity={4} distance={5} />
      </group>

      {/* ─── GEAR FACTORY (6 interlocking gears) ─── */}
      <AdvancedGear
        position={[-2.8, -0.98, -5.2]}
        radius={0.55}
        color="#FFD700"
        rotDir={1}
        speed={1.0}
        teeth={12}
      />
      <AdvancedGear
        position={[-1.65, -0.98, -5.2]}
        radius={0.4}
        color="#00D4FF"
        rotDir={-1}
        speed={1.4}
        teeth={9}
      />
      <AdvancedGear
        position={[-0.7, -0.98, -5.0]}
        radius={0.3}
        color="#00FF88"
        rotDir={1}
        speed={1.85}
        teeth={7}
      />
      <AdvancedGear
        position={[-3.8, -0.98, -3.8]}
        radius={0.38}
        color="#7B2FFF"
        rotDir={-1}
        speed={1.2}
        teeth={9}
      />
      <AdvancedGear
        position={[-2.9, -0.98, -3.0]}
        radius={0.25}
        color="#FF6B35"
        rotDir={1}
        speed={2.0}
        teeth={6}
      />
      <AdvancedGear
        position={[-0.4, -0.98, -6.2]}
        radius={0.32}
        color="#00D4FF"
        rotDir={-1}
        speed={1.6}
        teeth={8}
      />

      {/* ─── PISTON ARRAY ─── */}
      <Piston position={[-3.6, -1.0, -4.2]} color="#FFD700" phase={0.0} />
      <Piston position={[-4.2, -1.0, -5.0]} color="#00D4FF" phase={1.2} />
      <Piston position={[-0.4, -1.0, -6.2]} color="#00FF88" phase={2.4} />
      <Piston position={[-1.2, -1.0, -3.2]} color="#FF6B35" phase={0.8} />

      {/* Pipeline Sidebar Divider */}
      <mesh position={[3.5, 0, -4]}>
        <planeGeometry args={[0.015, 5]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.2} />
      </mesh>

      {/* CI/CD Pipeline Nodes */}
      {pipelineStages.map((stage, idx) => (
        <PipelineNodeComponent key={idx} stage={stage} idx={idx} />
      ))}

      {/* Pipeline Flow Packet */}
      <mesh ref={pipelinePacketRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Pipeline Status HUD */}
      <PipelineStatusHUD />
    </group>
  );
}

// ─── Pipeline Node Component ──────────────────────────────────────────────
function PipelineNodeComponent({ stage, idx }: { stage: PipelineStage; idx: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const cycle = elapsed % 3.0;
    const mat = meshRef.current?.material as THREE.MeshStandardMaterial;
    if (!mat) return;

    let status: "pending" | "active" | "passed" = "pending";
    if (cycle < 0.6) {
      status = idx === 0 ? "active" : "pending";
    } else if (cycle < 1.2) {
      if (idx === 0) status = "passed";
      else if (idx === 1) status = "active";
      else status = "pending";
    } else if (cycle < 2.0) {
      if (idx < 2) status = "passed";
      else if (idx === 2) status = "active";
      else status = "pending";
    } else if (cycle < 2.6) {
      if (idx < 3) status = "passed";
      else if (idx === 3) status = "active";
    } else {
      status = "passed";
    }

    if (status === "passed") {
      mat.color.setHex(0x00ff88);
      mat.emissive.setHex(0x00ff88);
      meshRef.current!.scale.setScalar(1.0 + Math.sin(elapsed * 5) * 0.05);
    } else if (status === "active") {
      mat.color.setHex(0xffd700);
      mat.emissive.setHex(0xffd700);
    } else {
      mat.color.setHex(0x3a4b6e);
      mat.emissive.setHex(0x3a4b6e);
      meshRef.current!.scale.setScalar(1.0);
    }
  });

  return (
    <group position={stage.pos}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, 0.3, 0.3]} />
        <meshStandardMaterial wireframe={true} emissiveIntensity={2.0} />
      </mesh>
      <pointLight color="#00FF88" intensity={1} distance={2} />
      <Html position={[0.8, 0, 0]} center={false} distanceFactor={8} pointerEvents="none">
        <span
          className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none text-[#E8F4FD]"
          style={{ textShadow: "0 0 6px rgba(232, 244, 253, 0.6)" }}
        >
          {stage.name}
        </span>
      </Html>
    </group>
  );
}

// ─── Pipeline Status HUD ──────────────────────────────────────────────────
function PipelineStatusHUD() {
  const textRef = useRef<HTMLSpanElement>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const cycle = elapsed % 3.0;
    const el = textRef.current;
    if (el) {
      if (cycle >= 2.6) {
        el.style.color = "#00FF88";
        el.style.textShadow = "0 0 8px #00FF88";
        el.innerText = "PIPELINE: PASSED";
      } else if (cycle >= 2.0) {
        el.style.color = "#FFD700";
        el.style.textShadow = "0 0 8px #FFD700";
        el.innerText = "STAGE: DEPLOYING";
      } else if (cycle >= 1.2) {
        el.style.color = "#FFD700";
        el.style.textShadow = "0 0 8px #FFD700";
        el.innerText = "STAGE: TESTING";
      } else if (cycle >= 0.6) {
        el.style.color = "#FFD700";
        el.style.textShadow = "0 0 8px #FFD700";
        el.innerText = "STAGE: BUILDING";
      } else {
        el.style.color = "#FFD700";
        el.style.textShadow = "0 0 8px #FFD700";
        el.innerText = "STAGE: PLANNING";
      }
    }
  });

  return (
    <Html position={[4, 2.5, -4]} center distanceFactor={8} pointerEvents="none">
      <span
        ref={textRef}
        className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none text-[#FFD700]"
        style={{ textShadow: "0 0 8px rgba(255, 215, 0, 0.6)" }}
      >
        PIPELINE: ACTIVE
      </span>
    </Html>
  );
}
