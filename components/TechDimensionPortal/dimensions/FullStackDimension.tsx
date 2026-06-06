"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface IslandProps {
  label: string;
  color: string;
  position: [number, number, number];
  skills: string[];
  yOffset: number;
}

function ServicePlanet({ label, color, position, skills, yOffset }: IslandProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const subRingRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const floatVal = Math.sin(t * 1.2 + yOffset) * 0.15;
    
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + floatVal;
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = t * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.position.y = position[1] + floatVal;
      ringRef.current.rotation.y = -t * 0.25;
      ringRef.current.rotation.x = Math.PI / 2.5 + Math.sin(t * 0.4) * 0.05;
    }
    if (subRingRef.current) {
      subRingRef.current.position.y = position[1] + floatVal;
      subRingRef.current.rotation.y = t * 0.35;
      subRingRef.current.rotation.x = Math.PI / 2.2 + Math.cos(t * 0.4) * 0.05;
    }
    if (moonRef.current) {
      moonRef.current.position.y = position[1] + floatVal + Math.sin(t * 1.6 + yOffset) * 0.25;
      moonRef.current.position.x = Math.cos(t * 1.6 + yOffset) * 1.95;
      moonRef.current.position.z = Math.sin(t * 1.6 + yOffset) * 1.95;
    }
  });

  return (
    <group position={position}>
      {/* Central Glowing Wireframe Service Planet */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          emissive={color}
          emissiveIntensity={3.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Solid interior core sphere (soft glow) */}
      <mesh scale={[0.85, 0.85, 0.85]} position={[0, 0, 0]}>
        <sphereGeometry args={[1.15, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} />
      </mesh>

      {/* Orbiting Crystal Moon */}
      <mesh ref={moonRef}>
        <octahedronGeometry args={[0.13, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          emissive={color}
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Outer Rotating Planet Ring (Saturn style) */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.8, 0.018, 8, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Inner offset counter-rotating ring */}
      <mesh ref={subRingRef} rotation={[Math.PI / 2.2, 0.1, 0]}>
        <torusGeometry args={[1.65, 0.01, 6, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Volumetric Core Light */}
      <pointLight color={color} intensity={6} distance={8} position={[0, 0, 0]} />

      {/* Primary Planet Name */}
      <Html
        position={[0, 1.4, 0]}
        center
        distanceFactor={8}
        pointerEvents="none"
      >
        <span
          className="font-[family-name:var(--font-orbitron)] text-[13px] font-bold uppercase tracking-widest whitespace-nowrap select-none pointer-events-none"
          style={{
            color: color,
            textShadow: `0 0 10px ${color}80`,
          }}
        >
          {label}
        </span>
      </Html>

      {/* Technology Skill labels orbiting above */}
      {skills.map((skill, idx) => {
        const angle = (idx / skills.length) * Math.PI * 2;
        const radius = 1.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const h = 0.5 + (idx % 2) * 0.18;
        
        return (
          <Html
            key={skill}
            position={[x, h, z]}
            center
            distanceFactor={8}
            pointerEvents="none"
          >
            <span
              className="font-[family-name:var(--font-orbitron)] text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none text-white/90"
              style={{
                textShadow: `0 0 6px ${color}80`,
              }}
            >
              {skill}
            </span>
          </Html>
        );
      })}
    </group>
  );
}

export default function FullStackDimension() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Dynamic packet streams
  const frontToBackGroup = useRef<THREE.Group>(null);
  const backToDbGroup = useRef<THREE.Group>(null);
  const dbToFrontGroup = useRef<THREE.Group>(null);

  const locations = useMemo(() => {
    return {
      frontend: new THREE.Vector3(-4.5, 0.5, -3),
      backend: new THREE.Vector3(4.5, 0.5, -3),
      database: new THREE.Vector3(0, -2.8, -3),
    };
  }, []);

  // Parallel double bridges for dual traffic lines
  const curves = useMemo(() => {
    const c1a = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.frontend).add(new THREE.Vector3(0, 0.1, 0.15)),
      new THREE.Vector3(0, 1.9, -2.85),
      new THREE.Vector3().copy(locations.backend).add(new THREE.Vector3(0, 0.1, 0.15)),
    ]);
    const c1b = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.frontend).add(new THREE.Vector3(0, -0.1, -0.15)),
      new THREE.Vector3(0, 1.7, -3.15),
      new THREE.Vector3().copy(locations.backend).add(new THREE.Vector3(0, -0.1, -0.15)),
    ]);

    const c2a = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.backend).add(new THREE.Vector3(0.1, 0.1, 0.1)),
      new THREE.Vector3(2.6, -1.4, -2.9),
      new THREE.Vector3().copy(locations.database).add(new THREE.Vector3(0.1, 0.1, 0.1)),
    ]);
    const c2b = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.backend).add(new THREE.Vector3(-0.1, -0.1, -0.1)),
      new THREE.Vector3(2.4, -1.6, -3.1),
      new THREE.Vector3().copy(locations.database).add(new THREE.Vector3(-0.1, -0.1, -0.1)),
    ]);

    const c3a = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.database).add(new THREE.Vector3(-0.1, 0.1, 0.1)),
      new THREE.Vector3(-2.4, -1.4, -2.9),
      new THREE.Vector3().copy(locations.frontend).add(new THREE.Vector3(-0.1, 0.1, 0.1)),
    ]);
    const c3b = new THREE.CatmullRomCurve3([
      new THREE.Vector3().copy(locations.database).add(new THREE.Vector3(0.1, -0.1, -0.1)),
      new THREE.Vector3(-2.6, -1.6, -3.1),
      new THREE.Vector3().copy(locations.frontend).add(new THREE.Vector3(0.1, -0.1, -0.1)),
    ]);

    return { c1a, c1b, c2a, c2b, c3a, c3b };
  }, [locations]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Frontend -> Backend
    if (frontToBackGroup.current) {
      frontToBackGroup.current.children.forEach((mesh, idx) => {
        const isLeft = idx % 2 === 0;
        const curve = isLeft ? curves.c1a : curves.c1b;
        const offset = Math.floor(idx / 2) * 0.5;
        const progress = ((t * 0.45) + offset) % 1.0;
        mesh.position.copy(curve.getPointAt(progress));
      });
    }

    // Backend -> Database
    if (backToDbGroup.current) {
      backToDbGroup.current.children.forEach((mesh, idx) => {
        const isLeft = idx % 2 === 0;
        const curve = isLeft ? curves.c2a : curves.c2b;
        const offset = Math.floor(idx / 2) * 0.5;
        const progress = ((t * 0.45) + offset) % 1.0;
        mesh.position.copy(curve.getPointAt(progress));
      });
    }

    // Database -> Frontend
    if (dbToFrontGroup.current) {
      dbToFrontGroup.current.children.forEach((mesh, idx) => {
        const isLeft = idx % 2 === 0;
        const curve = isLeft ? curves.c3a : curves.c3b;
        const offset = Math.floor(idx / 2) * 0.5;
        const progress = ((t * 0.45) + offset) % 1.0;
        mesh.position.copy(curve.getPointAt(progress));
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Front-End Platform (Cyan Planet) */}
      <ServicePlanet
        label="Frontend Planet"
        color="#00D4FF"
        position={[-4.5, 0.5, -3]}
        skills={["React.js", "HTML5", "CSS3", "Tailwind CSS"]}
        yOffset={0.0}
      />

      {/* Back-End Platform (Purple Planet) */}
      <ServicePlanet
        label="Backend Planet"
        color="#7B2FFF"
        position={[4.5, 0.5, -3]}
        skills={["Node.js", "Flask", "APIs"]}
        yOffset={0.5}
      />

      {/* Database Platform (Orange Planet) */}
      <ServicePlanet
        label="Database Planet"
        color="#FF6B35"
        position={[0, -2.8, -3]}
        skills={["MySQL", "MongoDB", "PostgreSQL"]}
        yOffset={1.0}
      />

      {/* Connected API Highways */}
      {[
        { curve: curves.c1a, color: "#00D4FF" },
        { curve: curves.c1b, color: "#00D4FF" },
        { curve: curves.c2a, color: "#7B2FFF" },
        { curve: curves.c2b, color: "#7B2FFF" },
        { curve: curves.c3a, color: "#FF6B35" },
        { curve: curves.c3b, color: "#FF6B35" },
      ].map((bridge, idx) => {
        const geom = new THREE.TubeGeometry(bridge.curve, 32, 0.012, 4, false);
        return (
          <mesh key={idx} geometry={geom}>
            <meshBasicMaterial
              color={bridge.color}
              transparent
              opacity={0.07}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Flow particles: Frontend -> Backend */}
      <group ref={frontToBackGroup}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#00D4FF" />
          </mesh>
        ))}
      </group>

      {/* Flow particles: Backend -> Database */}
      <group ref={backToDbGroup}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#7B2FFF" />
          </mesh>
        ))}
      </group>

      {/* Flow particles: Database -> Frontend */}
      <group ref={dbToFrontGroup}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshBasicMaterial color="#FF6B35" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
