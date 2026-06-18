"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { projects, Project } from "@/data/projects";

// ─── Command Center Floor Grid ─────────────────────────────────────────────
function CommandFloorGrid() {
  const gridRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const rows = 28;
    const cols = 28;
    const pos: number[] = [];
    const col: number[] = [];

    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        const xp = (x - cols / 2) * 0.9;
        const zp = (z - rows / 2) * 0.9 - 3;
        pos.push(xp, -3.5, zp);

        // Grid color: cyan on edges, dimmer toward center
        const edge = Math.max(Math.abs(x - cols / 2), Math.abs(z - rows / 2)) / (Math.max(cols, rows) / 2);
        col.push(0.0, edge * 0.85, edge * 1.0);
      }
    }

    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (gridRef.current) {
      // Subtle wave ripple across the floor grid
      const posArr = gridRef.current.geometry.attributes.position.array as Float32Array;
      const count = posArr.length / 3;
      for (let i = 0; i < count; i++) {
        const xp = posArr[i * 3];
        const zp = posArr[i * 3 + 2];
        posArr[i * 3 + 1] = -3.5 + Math.sin(xp * 0.4 + t * 1.2) * Math.cos(zp * 0.4 + t * 0.9) * 0.12;
      }
      gridRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={gridRef} geometry={geom}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Central Master Hologram ───────────────────────────────────────────────
function MasterHologram() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.4;
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.scale.setScalar(1.0 + Math.sin(t * 2.5) * 0.06);
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = t * 0.6;
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.5) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.45;
      ring2Ref.current.rotation.z = Math.PI / 3 + Math.cos(t * 0.4) * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.35;
      ring3Ref.current.rotation.z = -t * 0.25;
    }
    if (beamRef.current) {
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.04 + Math.sin(t * 1.8) * 0.02;
    }
  });

  return (
    <group position={[0, 0.4, -5.5]}>
      {/* Central IcoSphere Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.42, 2]} />
        <meshStandardMaterial
          color="#00D4FF"
          wireframe={true}
          emissive="#00D4FF"
          emissiveIntensity={6}
        />
      </mesh>

      {/* Outer solid glow sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.08} />
      </mesh>

      {/* Orbit Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.85, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} />
      </mesh>

      {/* Orbit Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.15, 0.009, 8, 64]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.4} />
      </mesh>

      {/* Orbit Ring 3 */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[1.45, 0.007, 8, 64]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.35} />
      </mesh>

      {/* Holographic Projection Cone (beam going up) */}
      <mesh ref={beamRef} position={[0, 2.2, 0]}>
        <coneGeometry args={[1.8, 4.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#00D4FF" intensity={8} distance={12} />

      <Html position={[0, 1.85, 0]} center distanceFactor={7} pointerEvents="none">
        <div
          className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest text-[#00D4FF] whitespace-nowrap select-none pointer-events-none text-center"
          style={{ textShadow: "0 0 8px rgba(0,212,255,0.7)" }}
        >
          MISSION ARCHIVE
          <br />
          <span className="text-[9px] opacity-70 tracking-[0.2em]">SELECT A MISSION BRIEFING</span>
        </div>
      </Html>
    </group>
  );
}

// ─── Floating Telemetry HUD Ring ───────────────────────────────────────────
function TelemetryHUDRing({ position, color, label, value }: {
  position: [number, number, number];
  color: string;
  label: string;
  value: string;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.35;
      ringRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.35, 0.008, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.004, 6, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <Html center distanceFactor={7} pointerEvents="none">
        <div
          className="font-[family-name:var(--font-orbitron)] text-[8px] uppercase tracking-widest text-center whitespace-nowrap select-none pointer-events-none"
          style={{ color, textShadow: `0 0 6px ${color}80` }}
        >
          <div className="text-[10px] font-bold">{value}</div>
          <div className="opacity-60">{label}</div>
        </div>
      </Html>
    </group>
  );
}

// ─── Mission Capsule ───────────────────────────────────────────────────────
interface MissionCapsuleProps {
  project: Project;
  position: [number, number, number];
  idx: number;
  texture?: THREE.Texture;
  onClick: (p: Project) => void;
}

function MissionCapsule({ project, position, idx, texture, onClick }: MissionCapsuleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const chamberRef = useRef<THREE.Mesh>(null);
  const scanRingRef = useRef<THREE.Mesh>(null);

  const [hovered, setHovered] = useState(false);
  const zOffset = useRef(0);

  const accentColors = ["#00D4FF", "#7B2FFF", "#00FF88", "#FF6B35", "#FFD700", "#00D4FF"];
  const color = accentColors[idx % accentColors.length];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const floatVal = Math.sin(t * 1.2 + idx) * 0.08;

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + floatVal;
      meshRef.current.rotation.y = Math.sin(t * 0.4 + idx) * 0.05;
      meshRef.current.rotation.x = Math.cos(t * 0.2 + idx) * 0.02;
      const targetZ = hovered ? 0.6 : 0.0;
      zOffset.current += (targetZ - zOffset.current) * 0.1;
      meshRef.current.position.z = position[2] + zOffset.current;
    }

    if (chamberRef.current) {
      chamberRef.current.position.y = position[1] + floatVal;
      chamberRef.current.rotation.y = -t * 0.12;
    }

    if (scanRingRef.current) {
      scanRingRef.current.position.y = position[1] + floatVal + Math.sin(t * 2.0 + idx) * 0.68;
    }
  });

  return (
    <group>
      {/* 3D Holographic Containment Chamber */}
      <mesh ref={chamberRef} position={[position[0], position[1], position[2]]}>
        <cylinderGeometry args={[1.25, 1.25, 1.4, 8, 1, true]} />
        <meshBasicMaterial
          color={color}
          wireframe={true}
          transparent
          opacity={hovered ? 0.35 : 0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Laser Scanner Ring */}
      <mesh ref={scanRingRef} position={[position[0], position[1], position[2]]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.012, 4, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.8 : 0.45}
          depthWrite={false}
        />
      </mesh>

      {/* Main Capsule Panel */}
      <group
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick(project);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        {/* Border panel */}
        <mesh>
          <boxGeometry args={[1.84, 1.08, 0.1]} />
          <meshStandardMaterial
            color={color}
            wireframe={true}
            emissive={color}
            emissiveIntensity={hovered ? 6.0 : 2.5}
          />
        </mesh>

        {/* Front face */}
        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[1.8, 1.0]} />
          {texture ? (
            <meshBasicMaterial
              map={texture}
              color={hovered ? "#ffffff" : "#888888"}
              toneMapped={false}
            />
          ) : (
            <meshBasicMaterial color="#080D1A" transparent opacity={0.9} />
          )}
        </mesh>

        {/* Backing aura */}
        <mesh position={[0, 0, -0.05]} scale={[1, 1, 0.5]}>
          <boxGeometry args={[1.8, 1.0, 0.1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.15 : 0.04}
            depthWrite={false}
          />
        </mesh>

        {/* Project Name */}
        <Html position={[0, 0.68, 0.15]} center distanceFactor={6} pointerEvents="none">
          <div
            className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-wider text-center whitespace-nowrap select-none pointer-events-none"
            style={{ color, textShadow: hovered ? `0 0 10px ${color}` : `0 0 5px ${color}80` }}
          >
            {project.name.toUpperCase()}
          </div>
        </Html>

        {/* Project Meta */}
        <Html position={[0, -0.68, 0.15]} center distanceFactor={6} pointerEvents="none">
          <div className="flex flex-col items-center select-none pointer-events-none text-center whitespace-nowrap">
            <span className="font-[family-name:var(--font-orbitron)] text-[9px] text-white tracking-wide">
              {project.year} // {project.techSummary.split("•")[0].trim()}
            </span>
            {hovered && (
              <span className="font-[family-name:var(--font-orbitron)] text-[8px] text-[#00FF88] tracking-widest mt-1 animate-pulse">
                &gt; CLICK TO DECLASSIFY BRIEFING &lt;
              </span>
            )}
          </div>
        </Html>

        <pointLight color={color} intensity={hovered ? 3.0 : 0.8} distance={4} />
      </group>
    </group>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
interface MissionArchiveDimensionProps {
  onProjectClick: (p: Project) => void;
}

export default function MissionArchiveDimension({ onProjectClick }: MissionArchiveDimensionProps) {
  const [textures, setTextures] = useState<Record<number, THREE.Texture>>({});

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    projects.forEach((proj) => {
      loader.load(
        proj.image,
        (tex) => {
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          setTextures((prev) => ({ ...prev, [proj.id]: tex }));
        },
        undefined,
        (err) => {
          console.warn(`Failed to load texture for project: ${proj.name}`, err);
        }
      );
    });
  }, []);

  // Arc capsule positions
  const positions = useMemo<[number, number, number][]>(() => {
    return [
      [-2.6, 1.0, -3.0],
      [0.0, 1.2, -4.0],
      [2.6, 1.0, -3.0],
      [-2.6, -1.0, -3.0],
      [0.0, -1.2, -4.0],
      [2.6, -1.0, -3.0],
    ];
  }, []);

  return (
    <group>
      {/* Command Center Floor Grid */}
      <CommandFloorGrid />

      {/* Central Master Hologram */}
      <MasterHologram />

      {/* Floating Telemetry HUD Rings */}
      <TelemetryHUDRing
        position={[-5.5, 2.2, -4]}
        color="#00D4FF"
        label="MISSIONS"
        value={`${projects.length} OPS`}
      />
      <TelemetryHUDRing
        position={[5.5, 2.2, -4]}
        color="#00FF88"
        label="STATUS"
        value="ACTIVE"
      />
      <TelemetryHUDRing
        position={[-5.5, -1.8, -4]}
        color="#7B2FFF"
        label="CLEARANCE"
        value="LEVEL 5"
      />
      <TelemetryHUDRing
        position={[5.5, -1.8, -4]}
        color="#FFD700"
        label="ARCHIVE"
        value="ONLINE"
      />

      {/* Ambient area lights for the command room */}
      <pointLight color="#00D4FF" intensity={1.2} distance={18} position={[0, 4, -4]} />
      <pointLight color="#7B2FFF" intensity={0.8} distance={14} position={[-6, -2, -3]} />
      <pointLight color="#00FF88" intensity={0.8} distance={14} position={[6, -2, -3]} />

      {/* Mission Capsules */}
      {projects.map((proj, idx) => {
        const pos = positions[idx] || ([0, 0, 0] as [number, number, number]);
        return (
          <MissionCapsule
            key={proj.id}
            project={proj}
            position={pos}
            idx={idx}
            texture={textures[proj.id]}
            onClick={onProjectClick}
          />
        );
      })}
    </group>
  );
}
