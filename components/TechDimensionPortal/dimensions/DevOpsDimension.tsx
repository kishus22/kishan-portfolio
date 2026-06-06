"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface SatelliteData {
  name: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: [number, number, number];
}

function OrbitLine({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    return new THREE.Line(geom, mat);
  }, [points, color]);

  return <primitive object={lineObj} />;
}

// Glowing translucent cloud city clusters surrounding the station
function CloudCityClusters() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const clusters = [
      new THREE.Vector3(-1.8, 0.4, -4),
      new THREE.Vector3(1.8, -0.4, -4),
      new THREE.Vector3(-0.8, -1.2, -4.5),
      new THREE.Vector3(0.8, 1.2, -3.5),
      new THREE.Vector3(0, 0, -5.5),
    ];

    for (let i = 0; i < count; i++) {
      const center = clusters[i % clusters.length];
      // Fluffy gaussian distribution
      const r = Math.random() * 0.95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      pos[i * 3] = center.x + r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = center.z + r * Math.cos(phi);
      
      // Clouds glow soft blue and white
      const isBlue = Math.random() > 0.45;
      col[i * 3] = isBlue ? 0.05 : 0.85; // Red
      col[i * 3 + 1] = isBlue ? 0.75 : 0.92; // Green
      col[i * 3 + 2] = 1.0; // Blue
    }
    return { positions: pos, colors: col };
  }, []);

  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.position.y = Math.sin(t * 0.4) * 0.1;
      pointsRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={0.16} // Fluffy large cloud particles
        vertexColors
        transparent
        opacity={0.24} // Low opacity for cloud-like transparency
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Upgraded Server Satellites containing chassis and blinking LED
function ServerSatellite({ name, color, size, satRef }: { name: string; color: string; size: [number, number, number]; satRef: React.RefObject<THREE.Group | null> }) {
  const ledRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ledRef.current) {
      const mat = ledRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        // Fast blinking indicator LED
        const isBlinking = Math.sin(t * 5.0 + name.charCodeAt(0)) > 0;
        mat.color.setHex(isBlinking ? 0x00ff88 : 0x223322);
      }
    }
  });

  return (
    <group ref={satRef}>
      {/* 3D Server Chassis Chassis (Server Satellite) */}
      <mesh>
        <boxGeometry args={[size[0] * 1.3, size[1] * 1.2, size[2] * 1.4]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          emissive={color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* solid chassis backing */}
      <mesh scale={[0.9, 0.9, 0.9]}>
        <boxGeometry args={[size[0] * 1.3, size[1] * 1.2, size[2] * 1.4]} />
        <meshBasicMaterial color="#050a14" transparent opacity={0.4} />
      </mesh>

      {/* Front server control panel */}
      <mesh position={[0, 0, (size[2] * 1.4) / 2 + 0.005]}>
        <planeGeometry args={[size[0] * 1.1, size[1] * 0.9]} />
        <meshBasicMaterial color="#0b1121" />
      </mesh>

      {/* Blinking green LED */}
      <mesh ref={ledRef} position={[size[0] * 0.35, 0, (size[2] * 1.4) / 2 + 0.015]}>
        <sphereGeometry args={[0.024, 6, 6]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>

      <pointLight color={color} intensity={2} distance={3} />

      <Html
        position={[0, size[1] + 0.35, 0]}
        center
        distanceFactor={8}
        pointerEvents="none"
      >
        <span
          className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none"
          style={{
            color: color,
            textShadow: `0 0 6px ${color}80`,
          }}
        >
          {name}
        </span>
      </Html>
    </group>
  );
}

export default function DevOpsDimension() {
  const stationRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Mesh>(null);

  // Satellite positions stored dynamically
  const satGitPos = useMemo(() => new THREE.Vector3(), []);
  const satDockerPos = useMemo(() => new THREE.Vector3(), []);
  const satGhaPos = useMemo(() => new THREE.Vector3(), []);
  const satCicdPos = useMemo(() => new THREE.Vector3(), []);

  // Satellites Mesh Refs
  const sat1Ref = useRef<THREE.Group>(null);
  const sat2Ref = useRef<THREE.Group>(null);
  const sat3Ref = useRef<THREE.Group>(null);
  const sat4Ref = useRef<THREE.Group>(null);

  // Packet Refs
  const packet1Ref = useRef<THREE.Mesh>(null);
  const packet2Ref = useRef<THREE.Mesh>(null);
  const packet3Ref = useRef<THREE.Mesh>(null);
  const packet4Ref = useRef<THREE.Mesh>(null);

  const satellites = useMemo<SatelliteData[]>(() => {
    return [
      {
        name: "Git",
        color: "#F05032",
        orbitRadius: 2.5,
        orbitSpeed: 0.35,
        size: [0.15, 0.15, 0.15],
      },
      {
        name: "Docker",
        color: "#2496ED",
        orbitRadius: 3.6,
        orbitSpeed: 0.28,
        size: [0.22, 0.15, 0.22],
      },
      {
        name: "GitHub Actions",
        color: "#2088FF",
        orbitRadius: 4.8,
        orbitSpeed: 0.2,
        size: [0.2, 0.2, 0.2],
      },
      {
        name: "CI / CD",
        color: "#00FF88",
        orbitRadius: 6.0,
        orbitSpeed: 0.15,
        size: [0.18, 0.18, 0.18],
      },
    ];
  }, []);

  const centerPos = useMemo(() => new THREE.Vector3(0, 0, -4), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate central station hub
    if (stationRef.current) {
      stationRef.current.rotation.y = t * 0.1;
      stationRef.current.rotation.z = Math.sin(t * 0.5) * 0.05;
    }

    // Spin radar dish
    if (dishRef.current) {
      dishRef.current.rotation.y = t * 0.6;
    }

    // Git Satellite (1)
    if (sat1Ref.current) {
      const p = satellites[0];
      const angle = t * p.orbitSpeed;
      satGitPos.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * 0.2,
        -4 + Math.sin(angle) * p.orbitRadius * 0.3
      );
      sat1Ref.current.position.copy(satGitPos);
      sat1Ref.current.rotation.x = t * 0.4;
      sat1Ref.current.rotation.y = t * 0.2;
    }

    // Docker Satellite (2)
    if (sat2Ref.current) {
      const p = satellites[1];
      const angle = t * p.orbitSpeed + 1.5;
      satDockerPos.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * -0.3,
        -4 + Math.cos(angle) * p.orbitRadius * 0.1
      );
      sat2Ref.current.position.copy(satDockerPos);
      sat2Ref.current.rotation.y = t * 0.3;
    }

    // GitHub Actions Satellite (3)
    if (sat3Ref.current) {
      const p = satellites[2];
      const angle = t * p.orbitSpeed + 3.0;
      satGhaPos.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * 0.4,
        -4 + Math.sin(angle) * p.orbitRadius * 0.2
      );
      sat3Ref.current.position.copy(satGhaPos);
      sat3Ref.current.rotation.z = t * 0.5;
    }

    // CI/CD Satellite (4)
    if (sat4Ref.current) {
      const p = satellites[3];
      const angle = t * p.orbitSpeed + 4.5;
      satCicdPos.set(
        Math.cos(angle) * p.orbitRadius,
        Math.sin(angle) * p.orbitRadius * -0.1,
        -4 + Math.cos(angle) * p.orbitRadius * 0.4
      );
      sat4Ref.current.position.copy(satCicdPos);
    }

    // Animate deploying packets radiating outwards
    if (packet1Ref.current) {
      const progress = (t * 0.6) % 1.0;
      packet1Ref.current.position.lerpVectors(centerPos, satGitPos, progress);
    }
    if (packet2Ref.current) {
      const progress = (t * 0.5) % 1.0;
      packet2Ref.current.position.lerpVectors(centerPos, satDockerPos, progress);
    }
    if (packet3Ref.current) {
      const progress = (t * 0.4) % 1.0;
      packet3Ref.current.position.lerpVectors(centerPos, satGhaPos, progress);
    }
    if (packet4Ref.current) {
      const progress = (t * 0.45) % 1.0;
      packet4Ref.current.position.lerpVectors(centerPos, satCicdPos, progress);
    }
  });

  return (
    <group>
      {/* 1. CLOUD CITY CLUSTERS */}
      <CloudCityClusters />

      {/* 2. CENTRAL ORBITAL INFRASTRUCTURE STATION */}
      <group ref={stationRef} position={[centerPos.x, centerPos.y, centerPos.z]}>
        {/* Central Cylindrical Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.35, 12]} />
          <meshStandardMaterial
            color="#00D4FF"
            wireframe={true}
            emissive="#00D4FF"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Solid glowing core */}
        <mesh scale={[0.8, 0.8, 0.8]}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.15} />
        </mesh>

        {/* Space Station Radar Communication Dish */}
        <mesh ref={dishRef} position={[0, 0.4, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.42, 0.22, 12, 1, true]} />
          <meshStandardMaterial
            color="#00D4FF"
            wireframe={true}
            emissive="#00D4FF"
            emissiveIntensity={2.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        <pointLight color="#00D4FF" intensity={6} distance={10} />

        {/* 4 station structural arms with double solar array matrices */}
        {Array.from({ length: 4 }).map((_, idx) => {
          const angle = (idx * Math.PI) / 2;
          return (
            <group key={idx} rotation={[0, 0, angle]}>
              {/* Double Truss Arms */}
              <mesh position={[0.9, 0.08, 0]}>
                <boxGeometry args={[1.0, 0.03, 0.03]} />
                <meshStandardMaterial color="#00D4FF" wireframe={true} />
              </mesh>
              <mesh position={[0.9, -0.08, 0]}>
                <boxGeometry args={[1.0, 0.03, 0.03]} />
                <meshStandardMaterial color="#00D4FF" wireframe={true} />
              </mesh>
              
              {/* Solar Array Panel 1 */}
              <mesh position={[1.5, 0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
                <planeGeometry args={[0.22, 0.55]} />
                <meshStandardMaterial
                  color="#0055ff"
                  emissive="#0055ff"
                  emissiveIntensity={1.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Solar Array Panel 2 */}
              <mesh position={[1.8, -0.15, 0]} rotation={[0, Math.PI / 4, 0]}>
                <planeGeometry args={[0.22, 0.55]} />
                <meshStandardMaterial
                  color="#0055ff"
                  emissive="#0055ff"
                  emissiveIntensity={1.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

        <Html
          position={[0, 0.85, 0]}
          center
          distanceFactor={8}
          pointerEvents="none"
        >
          <span
            className="font-[family-name:var(--font-orbitron)] text-[12px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none text-[#00D4FF]"
            style={{
              textShadow: "0 0 8px rgba(0, 212, 255, 0.6)",
            }}
          >
            DEVOPS STATION
          </span>
        </Html>
      </group>

      {/* 3. ORBITING SERVER SATELLITES */}
      <ServerSatellite
        name={satellites[0].name}
        color={satellites[0].color}
        size={satellites[0].size}
        satRef={sat1Ref}
      />

      <ServerSatellite
        name={satellites[1].name}
        color={satellites[1].color}
        size={satellites[1].size}
        satRef={sat2Ref}
      />

      <ServerSatellite
        name={satellites[2].name}
        color={satellites[2].color}
        size={satellites[2].size}
        satRef={sat3Ref}
      />

      <ServerSatellite
        name={satellites[3].name}
        color={satellites[3].color}
        size={satellites[3].size}
        satRef={sat4Ref}
      />

      {/* Orbit Pathways rings */}
      {satellites.map((sat, idx) => {
        const points = [];
        const segments = 64;
        const tiltMultiplier = idx === 0 ? 0.2 : idx === 1 ? -0.3 : idx === 2 ? 0.4 : -0.1;
        const zOffset = idx === 0 ? 0.3 : idx === 1 ? 0.1 : idx === 2 ? 0.2 : 0.4;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          points.push(
            new THREE.Vector3(
              Math.cos(theta) * sat.orbitRadius,
              Math.sin(theta) * sat.orbitRadius * tiltMultiplier,
              -4 + (idx === 1 || idx === 3 ? Math.cos(theta) : Math.sin(theta)) * sat.orbitRadius * zOffset
            )
          );
        }

        return <OrbitLine key={idx} points={points} color={sat.color} />;
      })}

      {/* Deployment pipelines (Visual beams) and racing packets */}
      <mesh ref={packet1Ref}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={packet2Ref}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={packet3Ref}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={packet4Ref}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
    </group>
  );
}
