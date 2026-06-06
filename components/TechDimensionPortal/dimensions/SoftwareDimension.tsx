"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface TowerData {
  x: number;
  z: number;
  height: number;
  width: number;
  depth: number;
  color: string;
  skillLabel?: string;
}

export default function SoftwareDimension() {
  const groupRef = useRef<THREE.Group>(null);
  const packetGroupRef = useRef<THREE.Group>(null);

  // Generate 40 Skyscrapers (8 columns x 5 rows grid) for a massive sci-fi megacity scale
  const towers = useMemo<TowerData[]>(() => {
    const list: TowerData[] = [];
    const skills = [
      "Python",
      "Flask",
      "FastAPI",
      "Django",
      "Node.js",
      "REST APIs",
      "C++",
      "Java",
      "TypeScript",
      "Architecture",
      "Design Patterns",
      "Data Structures",
      "Algorithms",
      "Microservices",
    ];

    const cols = 8;
    const rows = 5;
    let skillIdx = 0;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Space them across X (-14 to +14) and Z (-18 to 2)
        const x = (c - (cols - 1) / 2) * 4.2 + (Math.random() - 0.5) * 1.0;
        const z = (r - (rows - 1) / 2) * 4.2 + (Math.random() - 0.5) * 1.0 - 5;
        const height = 3.0 + Math.random() * 8.5; // Taller skyscrapers
        const width = 0.7 + Math.random() * 0.55;
        const depth = 0.7 + Math.random() * 0.55;
        const color = Math.random() > 0.55 ? "#00D4FF" : "#7B2FFF";

        let skillLabel: string | undefined;
        if (Math.random() > 0.5 && skillIdx < skills.length) {
          skillLabel = skills[skillIdx++];
        }

        list.push({ x, z, height, width, depth, color, skillLabel });
      }
    }
    return list;
  }, []);

  // API Highways: Bezier paths between towers
  const pathways = useMemo(() => {
    const paths: THREE.CatmullRomCurve3[] = [];
    // Select pairs of towers
    for (let i = 0; i < towers.length; i += 2) {
      if (i + 1 >= towers.length) break;
      const t1 = towers[i];
      const t2 = towers[i + 1];

      // Draw curved highway between two tower tops
      const start = new THREE.Vector3(t1.x, t1.height / 2, t1.z);
      const end = new THREE.Vector3(t2.x, t2.height / 2, t2.z);
      const mid = new THREE.Vector3(
        (start.x + end.x) / 2,
        Math.max(start.y, end.y) + 2.0,
        (start.z + end.z) / 2
      );

      paths.push(new THREE.CatmullRomCurve3([start, mid, end]));
    }
    return paths;
  }, [towers]);

  // Code fragments data (floating planes representing scanlines of text)
  const codePlanes = useMemo(() => {
    return Array.from({ length: 35 }, () => ({
      pos: [
        (Math.random() - 0.5) * 22,
        2 + Math.random() * 8,
        -12 - Math.random() * 12,
      ] as [number, number, number],
      rot: [
        Math.random() * 0.2,
        Math.random() * Math.PI,
        0,
      ] as [number, number, number],
      size: [0.7 + Math.random() * 0.7, 0.4 + Math.random() * 0.4] as [number, number],
      speed: 0.15 + Math.random() * 0.2,
    }));
  }, []);

  // Floating HTML code structures (brackets, neon terminal log streams)
  const codeHUDs = useMemo(() => {
    const symbols = [
      "{ ... }",
      "[ ... ]",
      "< />",
      "const fn = () => {",
      "import { api }",
      "await database.query()",
      "return resolve();",
      "class Controller {",
      "export default",
      "const [state, setState]"
    ];
    return Array.from({ length: 10 }, (_, i) => {
      const x = (Math.random() - 0.5) * 16;
      const y = -1 + Math.random() * 7;
      const z = -6 - Math.random() * 12;
      return {
        id: i,
        pos: [x, y, z] as [number, number, number],
        text: symbols[i % symbols.length],
        color: i % 2 === 0 ? "#00D4FF" : "#7B2FFF",
      };
    });
  }, []);

  // Frame animation for API traffic (packets) and towers glowing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slowly sway the entire city
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.04) * 0.06;
    }

    // Animate the golden packets flowing along the paths
    if (packetGroupRef.current) {
      packetGroupRef.current.children.forEach((mesh, idx) => {
        const curve = pathways[idx % pathways.length];
        const speed = 0.35 + (idx % 3) * 0.08;
        const progress = (t * speed) % 1.0;
        const pos = curve.getPointAt(progress);
        mesh.position.copy(pos);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* 40 Skyscrapers */}
      {towers.map((tower, idx) => (
        <group key={idx} position={[tower.x, tower.height / 2 - 4.5, tower.z]}>
          {/* Wireframe Tower Structure */}
          <mesh>
            <boxGeometry args={[tower.width, tower.height, tower.depth]} />
            <meshStandardMaterial
              color={tower.color}
              wireframe={true}
              transparent
              opacity={0.38}
            />
          </mesh>

          {/* Solid interior elevator core (faint glow) */}
          <mesh scale={[0.35, 1.0, 0.35]}>
            <boxGeometry args={[tower.width, tower.height, tower.depth]} />
            <meshBasicMaterial
              color={tower.color}
              transparent
              opacity={0.06}
              depthWrite={false}
            />
          </mesh>

          {/* Tower Windows: Emissive points */}
          {Array.from({ length: 8 }).map((_, wIdx) => {
            const hOffset = (wIdx / 7 - 0.5) * (tower.height * 0.85);
            return (
              <mesh key={wIdx} position={[0, hOffset, tower.depth / 2 + 0.015]}>
                <sphereGeometry args={[0.035, 4, 4]} />
                <meshBasicMaterial
                  color="#FFD700"
                  transparent
                  opacity={Math.sin(idx * 3 + wIdx) > 0 ? 0.9 : 0.25}
                />
              </mesh>
            );
          })}

          {/* Vertical Movie-Grade searchlight/neon beacon from top */}
          <mesh position={[0, tower.height / 2 + 4.0, 0]}>
            <cylinderGeometry args={[0.008, 0.03, 8.0, 8]} />
            <meshBasicMaterial
              color={tower.color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Local glow point light for structural pop */}
          <pointLight color={tower.color} intensity={1.5} distance={3.5} position={[0, tower.height / 2, 0]} />

          {/* Skill Signs (Neon Labels) */}
          {tower.skillLabel && (
            <Html
              position={[0, tower.height / 2 + 0.5, 0]}
              center
              distanceFactor={8}
              pointerEvents="none"
            >
              <span
                className="font-[family-name:var(--font-orbitron)] text-[11px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none"
                style={{
                  color: tower.color,
                  textShadow: `0 0 8px ${tower.color}80`,
                }}
              >
                {tower.skillLabel}
              </span>
            </Html>
          )}
        </group>
      ))}

      {/* API Highways (Paths) */}
      {pathways.map((curve, idx) => {
        const geom = new THREE.TubeGeometry(curve, 32, 0.015, 4, false);
        return (
          <mesh key={idx} geometry={geom} position={[0, -4.5, 0]}>
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.07}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Golden API Traffic Packets */}
      <group ref={packetGroupRef} position={[0, -4.5, 0]}>
        {pathways.map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.075, 8, 8]} />
            <meshBasicMaterial color="#FFD700" />
          </mesh>
        ))}
      </group>

      {/* Floating Code Shader Planes (represented as glowing neon cyan lists) */}
      {codePlanes.map((plane, idx) => (
        <group key={idx} position={plane.pos} rotation={plane.rot}>
          <mesh>
            <planeGeometry args={plane.size} />
            <meshBasicMaterial
              color="#00D4FF"
              transparent
              opacity={0.15}
              wireframe={true}
            />
          </mesh>
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[plane.size[0] * 0.8, 0.02]} />
            <meshBasicMaterial color="#00D4FF" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}

      {/* Cascading Terminal Code Overlays */}
      {codeHUDs.map((hud) => (
        <Html
          key={hud.id}
          position={hud.pos}
          center
          distanceFactor={7}
          pointerEvents="none"
        >
          <div
            className="font-[family-name:var(--font-fira-code)] text-[9px] uppercase tracking-widest border border-cyan-500/10 bg-black/60 px-2.5 py-1 rounded select-none pointer-events-none whitespace-nowrap animate-pulse"
            style={{
              color: hud.color,
              borderColor: `${hud.color}20`,
              boxShadow: `0 0 10px ${hud.color}15`,
            }}
          >
            {hud.text}
          </div>
        </Html>
      ))}
    </group>
  );
}
