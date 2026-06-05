"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS } from "@/data/projects";

const DIMENSION_DATA = [
  {
    name: "AI / ML",
    color: "#00D4FF",
    skills: ["TensorFlow", "Scikit-learn", "OpenCV", "Computer Vision", "Pandas", "NumPy", "NLP", "Neural Nets"]
  },
  {
    name: "Software Engineering",
    color: "#FF6B35",
    skills: ["Python", "JavaScript", "C++", "SQL", "OOP", "Data Structures", "Algorithms", "Git"]
  },
  {
    name: "Full Stack",
    color: "#00FF88",
    skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Next.js", "Three.js", "WebGL", "Framer Motion"]
  },
  {
    name: "Cloud & APIs",
    color: "#7B2FFF",
    skills: ["Cloud Services", "REST APIs", "FastAPI", "Django", "Flask", "CI/CD", "Docker", "API Gateways"]
  },
  {
    name: "Databases",
    color: "#FFB000",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Database Design", "ORM", "Query Optimization"]
  },
  {
    name: "Automation",
    color: "#FF2E93",
    skills: ["Pytest", "Postman", "API Testing", "Unit Testing", "Automation Scripts", "Regression Testing"]
  },
  {
    name: "Projects",
    color: "#00D4FF",
    skills: [] // Custom Projects Corridor
  }
];

function createGlowTexture() {
  if (typeof window === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

// ----------------------------------------------------
// 3D Procedural Dimension Environments (Layer 7 & 8)
// ----------------------------------------------------

// 1. AI/ML: Neural network universe
function NeuralWebDimension({ color }: { color: string }) {
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < 10; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 0.5 + Math.random() * 0.75;
      list.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.75,
        -8.0 + (Math.random() - 0.5) * 1.2
      ));
    }
    return list;
  }, []);

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 1.1) {
          lines.push(nodes[i], nodes[j]);
        }
      }
    }
    return lines;
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(connections);
  }, [connections]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* @ts-ignore */}
      <lineSegments geometry={lineGeometry}>
        {/* @ts-ignore */}
        <lineBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </lineSegments>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// 2. Software Engineering: Code architecture city
function CodeCityDimension({ color }: { color: string }) {
  const buildings = useMemo(() => {
    const list = [];
    const gridSize = 4;
    const spacing = 0.38;
    for (let x = -gridSize/2; x <= gridSize/2; x++) {
      for (let z = -gridSize/2; z <= gridSize/2; z++) {
        if (x === 0 && z === 0) continue; // Keep center corridor clear
        const height = 0.35 + Math.random() * 0.8;
        list.push({
          pos: [x * spacing, -0.65 + height/2, -8.0 + z * spacing] as [number, number, number],
          height,
          id: `${x}_${z}`
        });
      }
    }
    return list;
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {buildings.map((b) => (
        <group key={b.id} position={b.pos}>
          <mesh>
            <boxGeometry args={[0.12, b.height, 0.12]} />
            <meshBasicMaterial color="#040914" transparent opacity={0.75} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.12, b.height, 0.12)]} />
            <lineBasicMaterial color={color} transparent opacity={0.35} depthWrite={false} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

// 3. Cloud: Floating infrastructure systems
function CloudInfraDimension({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.12;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
  });

  return (
    <group ref={groupRef} position={[0, 0, -8.0]}>
      {/* Infrastructure path orbits */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.57, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI / 6, 0]}>
        <ringGeometry args={[0.85, 0.88, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Node clusters */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const pos: [number, number, number] = [Math.cos(angle) * 0.85, 0, Math.sin(angle) * 0.85];
        return (
          <mesh key={i} position={pos}>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
}

// 4. Databases: Data vault columns
function DataVaultDimension({ color }: { color: string }) {
  const columns = useMemo(() => {
    const list = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = 0.88;
      list.push({
        pos: [Math.cos(angle) * r, -0.4, -8.0 + Math.sin(angle) * r] as [number, number, number],
        id: i
      });
    }
    return list;
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={groupRef}>
      {columns.map((c) => (
        <group key={c.id} position={c.pos}>
          <mesh>
            <cylinderGeometry args={[0.11, 0.11, 0.7, 16]} />
            <meshBasicMaterial color="#040812" transparent opacity={0.8} depthWrite={false} />
          </mesh>
          {Array.from({ length: 4 }).map((_, rIdx) => {
            const ringY = -0.25 + (rIdx / 3) * 0.5;
            return (
              <mesh key={rIdx} position={[0, ringY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.12, 0.138, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// 5. Automation: Workflow reactor
function WorkflowReactorDimension({ color }: { color: string }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.x = t * 0.22;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * -0.16;
      ring2Ref.current.rotation.z = t * 0.08;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.08;
      ring3Ref.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group position={[0, 0, -8.0]}>
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.55, 0.58, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[0.72, 0.75, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  );
}

// 6. Full Stack: Connected ecosystem Grid
function EcosystemGridDimension({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const gridSize = 8;
  const count = gridSize * gridSize;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spacing = 0.25;
    let i = 0;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        pos[i * 3] = (x - (gridSize - 1) / 2) * spacing;
        pos[i * 3 + 1] = -0.5;
        pos[i * 3 + 2] = -8.5 + (z - (gridSize - 1) / 2) * spacing;
        i++;
      }
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const xVal = array[i * 3];
      const zVal = array[i * 3 + 2];
      array[i * 3 + 1] = -0.5 + Math.sin(t * 1.5 + xVal * 2.8 + zVal * 2.2) * 0.1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.045}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ----------------------------------------------------
// Volumetric Lighting & Atmospheric Nebula (Layer 9 & 10)
// ----------------------------------------------------

function VolumetricGodRays({ hoverFactor }: { hoverFactor: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const children = groupRef.current.children;
    
    if (children[0]) {
      const mesh = children[0] as THREE.Mesh;
      mesh.rotation.z = t * 0.04;
      const baseO = 0.05 + Math.sin(t * 1.5) * 0.012;
      (mesh.material as THREE.MeshBasicMaterial).opacity = baseO * (1.0 + hoverFactor * 0.5);
    }
    if (children[1]) {
      const mesh = children[1] as THREE.Mesh;
      mesh.rotation.z = -t * 0.06;
      const baseO = 0.035 + Math.cos(t * 1.0) * 0.008;
      (mesh.material as THREE.MeshBasicMaterial).opacity = baseO * (1.0 + hoverFactor * 0.4);
    }
  });


  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      {/* Cyan Ray */}
      <mesh>
        <cylinderGeometry args={[0.02, 1.9, 8, 32, 1, true]} />
        <meshBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Purple Ray */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 1.4, 8, 24, 1, true]} />
        <meshBasicMaterial
          color="#7B2FFF"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function ReactorFog({ texture }: { texture: THREE.Texture | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 30;
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 2] = -3.0 - Math.random() * 6.5;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00C4EF"
        size={3.2}
        transparent
        opacity={0.038}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={texture || undefined}
      />
    </points>
  );
}

// ----------------------------------------------------
// Floating Objects (Layer 2)
// ----------------------------------------------------

function FloatingHologramObjects({ count = 18, hoverFactor }: { count?: number; hoverFactor: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const items = useMemo(() => {
    const list = [];
    const shapes = ["crystal", "cube", "shard"];
    const colors = ["#00D4FF", "#7B2FFF", "#00FF88", "#FF2E93"];
    for (let i = 0; i < count; i++) {
      const radius = 0.05 + Math.random() * 0.07;
      list.push({
        shape: shapes[i % shapes.length],
        color: colors[i % colors.length],
        pos: [
          (Math.random() - 0.5) * 3.8,
          (Math.random() - 0.5) * 3.8,
          -0.6 - Math.random() * 5.4
        ] as [number, number, number],
        speedRot: [
          (Math.random() - 0.5) * 0.35,
          (Math.random() - 0.5) * 0.35,
          (Math.random() - 0.5) * 0.35
        ] as [number, number, number],
        speedDrift: 0.12 + Math.random() * 0.28,
        id: i
      });
    }
    return list;
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const children = groupRef.current.children;
    const speedScale = 1.0 + hoverFactor * 1.4;

    for (let i = 0; i < items.length; i++) {
      const mesh = children[i] as THREE.Group;
      if (!mesh) continue;
      
      const item = items[i];
      mesh.rotation.x = t * item.speedRot[0];
      mesh.rotation.y = t * item.speedRot[1];
      mesh.rotation.z = t * item.speedRot[2];

      mesh.position.y = item.pos[1] + Math.sin(t * 1.2 + item.id) * 0.05;
      mesh.position.x = item.pos[0] + Math.cos(t * 0.8 + item.id) * 0.035;
      mesh.position.z = item.pos[2] + Math.sin(t * 0.4 * item.speedDrift) * 0.22 * speedScale;
    }
  });

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <group key={item.id} position={item.pos}>
          {item.shape === "crystal" && (
            <mesh>
              <dodecahedronGeometry args={[0.05]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.22} wireframe />
            </mesh>
          )}
          {item.shape === "cube" && (
            <mesh>
              <boxGeometry args={[0.07, 0.07, 0.07]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.18} wireframe />
            </mesh>
          )}
          {item.shape === "shard" && (
            <mesh>
              <octahedronGeometry args={[0.06]} />
              <meshBasicMaterial color={item.color} transparent opacity={0.16} wireframe />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

// ----------------------------------------------------
// Infinite Z-Axis perspective crawl tunnel (Layer 6)
// ----------------------------------------------------

function WormholeTunnel({ active, hoverFactor }: { active: boolean; hoverFactor: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 10;
  const depth = 8.0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    const speed = 0.8 + hoverFactor * 1.6;
    const offset = (t * speed) % (depth / ringCount);

    const children = groupRef.current.children;
    for (let i = 0; i < ringCount; i++) {
      const mesh = children[i] as THREE.Mesh;
      if (!mesh) continue;

      let z = -((i / ringCount) * depth + offset);
      if (z < -depth) z += depth;

      const zStretch = z * (1.0 + hoverFactor * 0.28);
      mesh.position.z = zStretch;

      const scale = Math.max(0.05, 1.0 + z / depth);
      mesh.scale.setScalar(scale);

      const distFromStart = Math.abs(zStretch);
      const distFromEnd = depth - Math.abs(zStretch);
      let opacity = 0.2;
      if (distFromStart < 1.0) opacity *= distFromStart;
      if (distFromEnd < 1.0) opacity *= distFromEnd;

      (mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
    }

    groupRef.current.rotation.z = t * 0.025;

    const targetScale = active ? 0.42 : 1.0;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
    );
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: ringCount }).map((_, i) => (
        <mesh key={i}>
          {/* Octagonal cyber rings */}
          <ringGeometry args={[2.36, 2.4, 8]} />
          <meshBasicMaterial color="#00D4FF" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ----------------------------------------------------
// Foreground particles floating close to camera (Layer 1)
// ----------------------------------------------------

function ForegroundDust({ count = 25, texture }: { count?: number; texture: THREE.Texture | null }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      pos[i * 3 + 2] = 0.5 + Math.random() * 2.0; // Very close to camera
      sp[i] = 0.05 + Math.random() * 0.15;
    }
    return [pos, sp];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const zIdx = i * 3 + 2;
      // Drift slowly back
      array[zIdx] -= speeds[i] * 0.015;
      if (array[zIdx] < 0.2) {
        array[zIdx] = 2.5; // Loop back
      }
      
      const xIdx = i * 3;
      array[xIdx] += Math.sin(t * 0.5 + i) * 0.0006;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.075}
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        map={texture || undefined}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ----------------------------------------------------
// Portal Rings (Layer 4 & 5)
// ----------------------------------------------------

function PortalRings({ hoverFactor }: { hoverFactor: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const speedScale = 1.0 + hoverFactor * 1.5;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.1 * speedScale;
      const scale = 1.0 + Math.sin(t * 4) * 0.025 * hoverFactor;
      ring1Ref.current.scale.setScalar(scale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.07 * speedScale;
      const scale = 0.82 + Math.cos(t * 3.5) * 0.018 * hoverFactor;
      ring2Ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0, -2.2]}>
      {/* Outer entrance ring */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[2.0, 2.05, 48]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Inner ring */}
      <mesh ref={ring2Ref}>
        <ringGeometry args={[1.7, 1.74, 32]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------
// Camera Parallax & Zoom Traversal Controller
// ----------------------------------------------------

function CameraController({ activeDimension }: { activeDimension: number | null }) {
  const { camera, mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    if (activeDimension === null) {
      // Home camera coordinate path (with mouse parallax offset)
      const targetX = mouse.x * 0.6;
      const targetY = mouse.y * 0.4;
      const targetZ = 4.8 + Math.sin(t * 0.15) * 0.15;
      
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
      
      camera.lookAt(0, 0, 0);
    } else {
      // Travel deep into dimension Z = -5.8
      const targetX = 0;
      const targetY = 0;
      const targetZ = -5.8;
      
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.07);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.07);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.07);
      
      camera.lookAt(0, 0, -8.0);
    }
  });

  return null;
}

// ----------------------------------------------------
// Main Portal Component
// ----------------------------------------------------

export default function TechDimensionPortal({ onOpenProject }: { onOpenProject: (project: any) => void }) {
  const [activeDim, setActiveDim] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [portalHovered, setPortalHovered] = useState(false);

  const glowTexture = useMemo(() => createGlowTexture(), []);

  // Multi-layered Parallax Groups
  const foreRef = useRef<THREE.Group>(null);
  const midRef = useRef<THREE.Group>(null);
  const backRef = useRef<THREE.Group>(null);

  const hoverFactorRef = useRef(0.0);

  useFrame((state) => {
    // Smooth lerp of hover factor
    const target = (hoveredNode !== null || portalHovered) ? 1.0 : 0.0;
    hoverFactorRef.current = THREE.MathUtils.lerp(hoverFactorRef.current, target, 0.08);
    const hoverF = hoverFactorRef.current;

    const { mouse } = state;
    
    if (activeDim === null) {
      // Multi-layered parallax coefficients based on depth
      const targetForeX = mouse.x * 0.52;
      const targetForeY = mouse.y * 0.38;
      const targetMidX = mouse.x * 0.16;
      const targetMidY = mouse.y * 0.11;
      const targetBackX = mouse.x * 0.045;
      const targetBackY = mouse.y * 0.032;

      if (foreRef.current) {
        foreRef.current.position.x = THREE.MathUtils.lerp(foreRef.current.position.x, targetForeX, 0.05);
        foreRef.current.position.y = THREE.MathUtils.lerp(foreRef.current.position.y, targetForeY, 0.05);
      }
      if (midRef.current) {
        midRef.current.position.x = THREE.MathUtils.lerp(midRef.current.position.x, targetMidX, 0.05);
        midRef.current.position.y = THREE.MathUtils.lerp(midRef.current.position.y, targetMidY, 0.05);
      }
      if (backRef.current) {
        backRef.current.position.x = THREE.MathUtils.lerp(backRef.current.position.x, targetBackX, 0.05);
        backRef.current.position.y = THREE.MathUtils.lerp(backRef.current.position.y, targetBackY, 0.05);
      }
    } else {
      // Center coordinates during flight traversal
      if (foreRef.current) foreRef.current.position.set(0, 0, 0);
      if (midRef.current) midRef.current.position.set(0, 0, 0);
      if (backRef.current) backRef.current.position.set(0, 0, 0);
    }
  });

  const categoryNodes = useMemo(() => {
    const radius = 1.95;
    return DIMENSION_DATA.map((dim, i) => {
      const angle = (i / DIMENSION_DATA.length) * Math.PI * 2;
      return {
        ...dim,
        pos: new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0),
        angle
      };
    });
  }, []);

  return (
    <group>
      {/* Zoom / Traversal Cam flight handler */}
      <CameraController activeDimension={activeDim} />

      {/* ==================================================== */}
      {/* LAYER 1: FOREGROUND (Very close to camera)           */}
      {/* ==================================================== */}
      <group ref={foreRef}>
        <ForegroundDust texture={glowTexture} count={25} />
      </group>

      {/* ==================================================== */}
      {/* LAYER 2-7: MIDGROUND (Interactive Elements)          */}
      {/* ==================================================== */}
      <group 
        ref={midRef}
        onPointerOver={() => setPortalHovered(true)}
        onPointerOut={() => setPortalHovered(false)}
      >
        {/* Layer 2: Floating holographic objects */}
        <FloatingHologramObjects count={16} hoverFactor={hoverFactorRef.current} />

        {/* Layer 3: Volumetric Additive Light beams */}
        <VolumetricGodRays hoverFactor={hoverFactorRef.current} />

        {/* Layer 4-5: Portal Rings */}
        <PortalRings hoverFactor={hoverFactorRef.current} />

        {/* Layer 6: Wormhole Perspective Tunnel Grid */}
        <WormholeTunnel active={activeDim !== null} hoverFactor={hoverFactorRef.current} />

        {/* Layer 7: Main Category Interactive Nodes */}
        {activeDim === null && categoryNodes.map((node, i) => {
          const isHovered = hoveredNode === i;
          return (
            <group key={node.name}>
              {/* Target lock-on beam */}
              {isHovered && (
                <PulsingLine start={new THREE.Vector3(0, 0, 0)} end={node.pos} color={node.color} hovered={true} dimmed={false} />
              )}

              {/* Node core mesh */}
              <mesh 
                position={node.pos}
                onPointerOver={(e) => { e.stopPropagation(); setHoveredNode(i); }}
                onPointerOut={(e) => { e.stopPropagation(); setHoveredNode(null); }}
                onClick={(e) => { e.stopPropagation(); setActiveDim(i); }}
              >
                <sphereGeometry args={[0.075, 12, 12]} />
                <meshStandardMaterial 
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isHovered ? 4.5 : 1.2}
                />
              </mesh>

              {/* Cyberpunk HUD text label */}
              <Html position={[node.pos.x, node.pos.y + 0.24, node.pos.z]} center distanceFactor={3.2}>
                <button 
                  className="whitespace-nowrap px-3 py-1 text-[9px] uppercase tracking-wider font-mono rounded border select-none transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveDim(i)}
                  style={{
                    background: isHovered ? "rgba(0, 212, 255, 0.15)" : "rgba(2,4,9,0.88)",
                    borderColor: isHovered ? node.color : `${node.color}45`,
                    color: node.color,
                    boxShadow: isHovered 
                      ? `0 0 15px ${node.color}, inset 0 0 5px ${node.color}`
                      : `0 0 8px ${node.color}18`,
                    transform: isHovered ? "scale(1.08) translateY(-4px)" : "scale(1)",
                  }}
                >
                  {node.name}
                </button>
              </Html>
            </group>
          );
        })}

        {/* 3D Dimension space rendering */}
        {activeDim !== null && (
          <group>
            {/* Holographic Dimension Title readout */}
            <Html position={[0, 1.25, -7.2]} center distanceFactor={2.5}>
              <div className="text-center font-mono select-none">
                <span className="text-[7.5px] uppercase tracking-[0.25em] block opacity-60 text-white">ACTIVE DIMENSION</span>
                <h3 
                  className="text-xs font-bold uppercase tracking-widest mt-1"
                  style={{
                    color: DIMENSION_DATA[activeDim].color,
                    textShadow: `0 0 10px ${DIMENSION_DATA[activeDim].color}80`
                  }}
                >
                  {DIMENSION_DATA[activeDim].name}
                </h3>
              </div>
            </Html>

            {/* ESCAPE HUD back button */}
            <Html position={[0, -1.25, -7.2]} center distanceFactor={2.5}>
              <button
                onClick={() => setActiveDim(null)}
                className="px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/20 text-red-400 text-[8.5px] font-mono tracking-widest hover:border-red-400 hover:bg-red-500/20 hover:text-white hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all duration-300 uppercase cursor-pointer"
              >
                [ Escape Dimension ]
              </button>
            </Html>

            {/* Custom procedural dimension graphics (Layer 8) */}
            {activeDim === 0 && <NeuralWebDimension color={DIMENSION_DATA[0].color} />}
            {activeDim === 1 && <CodeCityDimension color={DIMENSION_DATA[1].color} />}
            {activeDim === 2 && <CloudInfraDimension color={DIMENSION_DATA[2].color} />}
            {activeDim === 3 && <DataVaultDimension color={DIMENSION_DATA[3].color} />}
            {activeDim === 4 && <WorkflowReactorDimension color={DIMENSION_DATA[4].color} />}
            {activeDim === 5 && <EcosystemGridDimension color={DIMENSION_DATA[5].color} />}

            {/* Skills Badges floating in space */}
            {activeDim !== 6 && DIMENSION_DATA[activeDim].skills.map((skill, j) => {
              const count = DIMENSION_DATA[activeDim].skills.length;
              const angle = (j / count) * Math.PI * 2;
              const radius = 1.05;
              const skillPos: [number, number, number] = [
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.9,
                -8.0 + Math.sin(j) * 0.15
              ];
              return (
                <SkillHologram 
                  key={skill} 
                  skill={skill} 
                  position={skillPos} 
                  index={j} 
                />
              );
            })}

            {/* 3D Projects semi-circle screen corridor */}
            {activeDim === 6 && PROJECTS.map((proj, j) => {
              const count = PROJECTS.length;
              const angle = ((j - (count - 1)/2) / 3.0) * Math.PI * 0.28;
              const projPos: [number, number, number] = [
                Math.sin(angle) * 2.3,
                (j % 2 === 0 ? 0.32 : -0.32),
                -8.0 - Math.cos(angle) * 1.0
              ];
              return (
                <ProjectScreen
                  key={proj.id}
                  project={proj}
                  position={projPos}
                  onClick={() => onOpenProject(proj)}
                />
              );
            })}
          </group>
        )}
      </group>

      {/* ==================================================== */}
      {/* LAYER 8-10: BACKGROUND (Nebulae, Fog, Lights)        */}
      {/* ==================================================== */}
      <group ref={backRef}>
        {/* Layer 9: Volumetric nebula fog */}
        <ReactorFog texture={glowTexture} />

        {/* Warp space telemetry fragments */}
        <WarpParticles active={activeDim !== null} texture={glowTexture} />

        {/* Layer 10: Far-distance light field sphere */}
        <mesh position={[0, 0, -11.0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.015} />
        </mesh>
      </group>
    </group>
  );
}

// Sub-component for clean pulsing visual line
function PulsingLine({ start, end, color, hovered, dimmed }: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  hovered: boolean;
  dimmed: boolean;
}) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const points = useMemo(() => [start, end], [start, end]);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 5 + start.x * 2) * 0.12 + 0.22;
    materialRef.current.opacity = hovered ? 0.95 : (dimmed ? 0.03 : pulse);
  });

  return (
    /* @ts-ignore */
    <line geometry={geometry}>
      {/* @ts-ignore */}
      <lineBasicMaterial
        ref={materialRef}
        color={hovered ? "#ffffff" : color}
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </line>
  );
}

function SkillHologram({ skill, position, index }: { skill: string; position: [number, number, number]; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 2.0 + index) * 0.04;
    const targetScale = hovered ? 1.15 : 1.0;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.12));
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      <planeGeometry args={[0.85, 0.3]} />
      <meshBasicMaterial transparent opacity={0.0} />
      
      <Html transform distanceFactor={1.2} pointerEvents="none">
        <div 
          className="px-3.5 py-2 rounded border text-center font-mono select-none transition-all duration-300 min-w-[110px]"
          style={{
            background: hovered ? "rgba(0, 212, 255, 0.18)" : "rgba(2,4,9,0.8)",
            borderColor: hovered ? "#00D4FF" : "rgba(0, 212, 255, 0.25)",
            color: hovered ? "#ffffff" : "#00D4FF",
            boxShadow: hovered ? "0 0 15px rgba(0, 212, 255, 0.5), inset 0 0 5px rgba(0, 212, 255, 0.3)" : "none",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          <div className="text-[10px] font-bold tracking-wider">{skill}</div>
        </div>
      </Html>
    </mesh>
  );
}

function ProjectScreen({ project, position, onClick }: { project: any; position: [number, number, number]; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const targetScale = hovered ? 1.08 : 1.0;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    meshRef.current.position.y = position[1] + Math.sin(t * 1.8 + project.id) * 0.045;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <planeGeometry args={[1.1, 0.7]} />
      <meshBasicMaterial 
        color="#080D1A" 
        transparent 
        opacity={0.85}
        side={THREE.DoubleSide}
      />
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 0.7)]} />
        <lineBasicMaterial color={hovered ? "#00D4FF" : "rgba(0, 212, 255, 0.25)"} />
      </lineSegments>

      <Html transform distanceFactor={1.35} pointerEvents="none">
        <div 
          className="w-[185px] p-3 rounded-lg border bg-[#020409]/95 text-white font-mono select-none"
          style={{
            borderColor: hovered ? "#00D4FF" : "rgba(0, 212, 255, 0.22)",
            boxShadow: hovered ? "0 0 15px rgba(0, 212, 255, 0.45)" : "none",
          }}
        >
          <span className="text-[7px] text-cyan-400 block tracking-widest uppercase">CLASSIFIED PROJECT</span>
          <h4 className="text-[10px] font-bold mt-1 tracking-wider text-white uppercase truncate">{project.name}</h4>
          <p className="text-[7.5px] text-[#8BA3B8] mt-1 line-clamp-2 leading-relaxed">"{project.mission}"</p>
          <div className="mt-2 flex items-center justify-between text-[7px]">
            <span className="text-cyan-400/85">{project.techSummary}</span>
            <span className="text-white bg-cyan-950/40 px-1 border border-cyan-800/30 rounded">{project.year}</span>
          </div>
          <div className="mt-2 text-center text-[7px] text-cyan-400 animate-pulse font-bold">
            [ CLICK TO BRIEF ]
          </div>
        </div>
      </Html>
    </mesh>
  );
}

function WarpParticles({ active, texture }: { active: boolean; texture: THREE.Texture | null }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      pos[i * 3 + 2] = -Math.random() * 8.0;
      sp[i] = 1.8 + Math.random() * 3.2;
    }
    return [pos, sp];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speedScale = active ? 4.5 : 1.0;

    for (let i = 0; i < count; i++) {
      const zIdx = i * 3 + 2;
      array[zIdx] += speeds[i] * 0.012 * speedScale;
      
      if (array[zIdx] > 1.2) {
        array[zIdx] = -8.0;
        array[i * 3] = (Math.random() - 0.5) * 4.5;
        array[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#00D4FF"
        size={0.045}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        map={texture || undefined}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}



