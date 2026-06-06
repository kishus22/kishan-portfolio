"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { projects, Project } from "@/data/projects";

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

  // Dynamic colors based on index
  const accentColors = ["#00D4FF", "#7B2FFF", "#00FF88", "#FF6B35", "#FFD700", "#00D4FF"];
  const color = accentColors[idx % accentColors.length];

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const floatVal = Math.sin(t * 1.2 + idx) * 0.08;

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + floatVal;
      meshRef.current.rotation.y = Math.sin(t * 0.4 + idx) * 0.05;
      meshRef.current.rotation.x = Math.cos(t * 0.2 + idx) * 0.02;

      // Glide Z offset smoothly on hover (z + 0.6)
      const targetZ = hovered ? 0.6 : 0.0;
      zOffset.current += (targetZ - zOffset.current) * 0.1;
      meshRef.current.position.z = position[2] + zOffset.current;
    }

    // Spin containment chamber wireframe
    if (chamberRef.current) {
      chamberRef.current.position.y = position[1] + floatVal;
      chamberRef.current.rotation.y = -t * 0.12;
    }

    // Slide scanning ring up and down
    if (scanRingRef.current) {
      scanRingRef.current.position.y = position[1] + floatVal + Math.sin(t * 2.0 + idx) * 0.68;
    }
  });

  return (
    <group>
      {/* 3D Holographic Containment Chamber (Cylinder forcefield) */}
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

      {/* Laser Scanner Ring that sweeps vertically */}
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
        {/* Border panel (emissive wireframe box) */}
        <mesh>
          <boxGeometry args={[1.84, 1.08, 0.1]} />
          <meshStandardMaterial
            color={color}
            wireframe={true}
            emissive={color}
            emissiveIntensity={hovered ? 6.0 : 2.5}
          />
        </mesh>

        {/* Capsule Front Face poster texture */}
        <mesh position={[0, 0, 0.041]}>
          <planeGeometry args={[1.8, 1.0]} />
          {texture ? (
            <meshBasicMaterial
              map={texture}
              color={hovered ? "#ffffff" : "#888888"}
              toneMapped={false}
            />
          ) : (
            <meshBasicMaterial
              color="#080D1A"
              transparent
              opacity={0.9}
            />
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

        {/* Text Labels */}
        <Html
          position={[0, 0.68, 0.15]}
          center
          distanceFactor={6}
          pointerEvents="none"
        >
          <div
            className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-wider text-center whitespace-nowrap select-none pointer-events-none"
            style={{
              color: color,
              textShadow: hovered ? `0 0 10px ${color}` : `0 0 5px ${color}80`,
            }}
          >
            {project.name.toUpperCase()}
          </div>
        </Html>

        <Html
          position={[0, -0.68, 0.15]}
          center
          distanceFactor={6}
          pointerEvents="none"
        >
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
          console.warn(`Failed to load texture for project: ${proj.name}, using fallback.`, err);
        }
      );
    });
  }, []);

  // Arc capsule positions (3 top, 3 bottom, staggered Z depth)
  const positions = useMemo<[number, number, number][]>(() => {
    return [
      [-2.6, 1.0, -3.0],  // Top Left
      [0.0, 1.2, -4.0],   // Top Center
      [2.6, 1.0, -3.0],   // Top Right
      [-2.6, -1.0, -3.0], // Bottom Left
      [0.0, -1.2, -4.0],  // Bottom Center
      [2.6, -1.0, -3.0],  // Bottom Right
    ];
  }, []);

  return (
    <group>
      {projects.map((proj, idx) => {
        const pos = positions[idx] || [0, 0, 0];
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
