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

export default function AutomationDimension() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Packets
  const circuitPacketRef = useRef<THREE.Mesh>(null);
  const pipelinePacketRef = useRef<THREE.Mesh>(null);

  // Machinery refs
  const gear1Ref = useRef<THREE.Group>(null);
  const gear2Ref = useRef<THREE.Group>(null);
  const piston1Ref = useRef<THREE.Mesh>(null);
  const piston2Ref = useRef<THREE.Mesh>(null);
  const reactorCoreRef = useRef<THREE.Group>(null);

  // 1. Grid of Testing Nodes on the Circuit Board
  const circuitNodes = useMemo<CircuitNode[]>(() => {
    return [
      { name: "Pytest", pos: [-3, -1, -3] },
      { name: "Postman", pos: [-1, -1, -5] },
      { name: "API Testing", pos: [1, -1, -5] },
      { name: "Unit Testing", pos: [-2, -1, -7] },
      { name: "Regression Testing", pos: [2, -1, -7] },
    ];
  }, []);

  // 2. Vertical CI/CD Pipeline Stages
  const pipelineStages = useMemo<PipelineStage[]>(() => {
    return [
      { name: "Plan", pos: [4, 1.8, -4] },
      { name: "Build", pos: [4, 0.6, -4] },
      { name: "Test", pos: [4, -0.6, -4] },
      { name: "Deploy", pos: [4, -1.8, -4] },
    ];
  }, []);

  // Circuit Connections lines
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
    const cycle = elapsed % 3.0; // 3-second testing loop

    // Spin gears
    if (gear1Ref.current) gear1Ref.current.rotation.y = elapsed * 0.8;
    if (gear2Ref.current) gear2Ref.current.rotation.y = -elapsed * 1.2;

    // Bounce pistons up and down
    if (piston1Ref.current) {
      piston1Ref.current.position.y = -1.0 + Math.abs(Math.sin(elapsed * 2.5)) * 0.5;
    }
    if (piston2Ref.current) {
      piston2Ref.current.position.y = -1.0 + Math.abs(Math.cos(elapsed * 2.0)) * 0.4;
    }

    // Pulse reactor core
    if (reactorCoreRef.current) {
      reactorCoreRef.current.rotation.y = elapsed * 0.4;
      const s = 1.0 + Math.sin(elapsed * 4.0) * 0.08;
      reactorCoreRef.current.scale.setScalar(s);
    }

    // 1. Update circuit packet path
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

    // 2. Update pipeline packet path
    if (pipelinePacketRef.current) {
      if (cycle < 0.6) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(0, 3, -4),
          new THREE.Vector3(4, 1.8, -4),
          cycle / 0.6
        );
      } else if (cycle >= 0.6 && cycle < 1.2) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(4, 1.8, -4),
          new THREE.Vector3(4, 0.6, -4),
          (cycle - 0.6) / 0.6
        );
      } else if (cycle >= 1.2 && cycle < 2.0) {
        pipelinePacketRef.current.visible = false;
      } else if (cycle >= 2.0 && cycle < 2.6) {
        pipelinePacketRef.current.visible = true;
        pipelinePacketRef.current.position.lerpVectors(
          new THREE.Vector3(4, -0.6, -4),
          new THREE.Vector3(4, -1.8, -4),
          (cycle - 2.0) / 0.6
        );
      } else {
        pipelinePacketRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Circuit Grid layout flat lines */}
      <lineSegments geometry={circuitLines}>
        <lineBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.15}
          depthWrite={false}
      />
      </lineSegments>

      {/* Circuit Nodes (Discs) */}
      {circuitNodes.map((node, idx) => {
        return (
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

            <Html
              position={[0, 0.35, 0]}
              center
              distanceFactor={8}
              pointerEvents="none"
            >
              <span
                className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none text-[#00D4FF]"
                style={{
                  textShadow: "0 0 6px rgba(0, 212, 255, 0.6)",
                }}
              >
                {node.name}
              </span>
            </Html>
          </group>
        );
      })}

      {/* Circuit Flow Packet */}
      <mesh ref={circuitPacketRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Workflow Reactor Core (pulsing central container) */}
      <group ref={reactorCoreRef} position={[0, -0.9, -4.5]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.3, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            wireframe={true}
            emissive="#FFD700"
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <pointLight color="#FFD700" intensity={4} distance={5} />
      </group>

      {/* Industrial Gears (Rotating mechanical structures) */}
      {/* Gear 1 */}
      <group ref={gear1Ref} position={[-2.8, -0.98, -5.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 12]} />
          <meshStandardMaterial color="#FFD700" wireframe={true} emissive="#FFD700" emissiveIntensity={0.6} />
        </mesh>
      </group>
      {/* Gear 2 */}
      <group ref={gear2Ref} position={[-1.7, -0.98, -3.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 10]} />
          <meshStandardMaterial color="#00D4FF" wireframe={true} emissive="#00D4FF" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Moving Piston Cylinders */}
      <mesh ref={piston1Ref} position={[-3.6, -1.0, -4.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#FFD700" wireframe={true} emissive="#FFD700" emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={piston2Ref} position={[-0.4, -1.0, -6.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#00D4FF" wireframe={true} emissive="#00D4FF" emissiveIntensity={0.5} />
      </mesh>

      {/* Pipeline Sidebar Divider Line */}
      <mesh position={[3.5, 0, -4]}>
        <planeGeometry args={[0.015, 5]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.2} />
      </mesh>

      {/* CI/CD Pipeline Nodes */}
      {pipelineStages.map((stage, idx) => (
        <PipelineNodeComponent
          key={idx}
          stage={stage}
          idx={idx}
        />
      ))}

      {/* Pipeline Flow Packet */}
      <mesh ref={pipelinePacketRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>

      {/* Pipeline Status Indicator Billboard */}
      <PipelineStatusHUD />
    </group>
  );
}

// Helper component for CI/CD stages
function PipelineNodeComponent({ stage, idx }: { stage: PipelineStage; idx: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const cycle = elapsed % 3.0;
    const mat = meshRef.current?.material as THREE.MeshBasicMaterial;
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
      meshRef.current!.scale.setScalar(1.0 + Math.sin(elapsed * 5) * 0.05);
    } else if (status === "active") {
      mat.color.setHex(0xffd700);
    } else {
      mat.color.setHex(0x3a4b6e);
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

      <Html
        position={[0.8, 0, 0]}
        center={false}
        distanceFactor={8}
        pointerEvents="none"
      >
        <span
          className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none text-[#E8F4FD]"
          style={{
            textShadow: "0 0 6px rgba(232, 244, 253, 0.6)",
          }}
        >
          {stage.name}
        </span>
      </Html>
    </group>
  );
}

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
    <Html
      position={[4, 2.5, -4]}
      center
      distanceFactor={8}
      pointerEvents="none"
    >
      <span
        ref={textRef}
        className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none text-[#FFD700]"
        style={{
          textShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
        }}
      >
        PIPELINE: ACTIVE
      </span>
    </Html>
  );
}
