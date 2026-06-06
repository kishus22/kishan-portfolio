"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";

interface ConstellationLabelProps {
  label: string;
  radius: number;
  speed: number;
  initialAngle: number;
  color: string;
}

function ConstellationLabel({ label, radius, speed, initialAngle, color }: ConstellationLabelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      const angle = initialAngle + t * speed;
      groupRef.current.position.x = Math.cos(angle) * radius;
      groupRef.current.position.z = Math.sin(angle) * radius;
      // Slight vertical floating animation
      groupRef.current.position.y = Math.sin(t * 1.5 + initialAngle) * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Billboard>
        <group
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
          {/* Small glowing dot beside the text */}
          <mesh position={[-0.8, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={hovered ? 1.0 : 0.6}
            />
          </mesh>

          <Html
            position={[0.1, 0, 0]}
            center={false}
            distanceFactor={8}
            pointerEvents="none"
          >
            <span
              className="font-[family-name:var(--font-orbitron)] text-[12px] font-semibold uppercase tracking-wider whitespace-nowrap select-none pointer-events-none"
              style={{
                color: color,
                textShadow: hovered ? `0 0 10px ${color}` : "none",
              }}
            >
              {label}
            </span>
          </Html>
        </group>
      </Billboard>
      {/* Local point light to make the constellation label pop */}
      <pointLight color={color} intensity={hovered ? 3.0 : 1.0} distance={3} />
    </group>
  );
}

function ConsciousnessCore() {
  const innerRef = useRef<THREE.Mesh>(null);
  const midRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25;
      innerRef.current.rotation.z = t * 0.15;
      const s = 0.75 + Math.sin(t * 2.2) * 0.05;
      innerRef.current.scale.setScalar(s);
    }
    if (midRef.current) {
      midRef.current.rotation.x = t * 0.18;
      midRef.current.rotation.y = t * 0.3;
      const s = 1.1 + Math.cos(t * 1.7) * 0.08;
      midRef.current.scale.setScalar(s);
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.12;
      outerRef.current.rotation.z = -t * 0.22;
      const s = 1.45 + Math.sin(t * 0.9) * 0.12;
      outerRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[0, 0, -4]}>
      {/* Central glowing white sun */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Mid cyan shell */}
      <mesh ref={midRef}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color="#00D4FF"
          wireframe={true}
          emissive="#00D4FF"
          emissiveIntensity={4}
        />
      </mesh>

      {/* Outer purple shell */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial
          color="#7B2FFF"
          wireframe={true}
          emissive="#7B2FFF"
          emissiveIntensity={3.5}
        />
      </mesh>
      
      <pointLight color="#00D4FF" intensity={7} distance={10} />
    </group>
  );
}

export default function AIMLDimension() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMeshRef = useRef<THREE.InstancedMesh>(null);
  const clusterMeshRef = useRef<THREE.InstancedMesh>(null);
  
  // Data stream particle refs
  const dot1 = useRef<THREE.Mesh>(null);
  const dot2 = useRef<THREE.Mesh>(null);
  const dot3 = useRef<THREE.Mesh>(null);
  const dot4 = useRef<THREE.Mesh>(null);
  const dot5 = useRef<THREE.Mesh>(null);
  const dot6 = useRef<THREE.Mesh>(null);

  // Intelligence Cluster Centers
  const clusters = useMemo(() => {
    return [
      new THREE.Vector3(4, 2, -5),
      new THREE.Vector3(-4, -2, -3),
      new THREE.Vector3(0, 4, -4),
    ];
  }, []);

  // CatmullRom curves for API traffic tubes
  const curves = useMemo(() => {
    const c1 = new THREE.CatmullRomCurve3([clusters[0], new THREE.Vector3(1, 0, -4), clusters[1]]);
    const c2 = new THREE.CatmullRomCurve3([clusters[1], new THREE.Vector3(-2, 1, -3.5), clusters[2]]);
    const c3 = new THREE.CatmullRomCurve3([clusters[2], new THREE.Vector3(2, 3, -4.5), clusters[0]]);
    const c4 = new THREE.CatmullRomCurve3([clusters[1], new THREE.Vector3(1, 0, -4), clusters[0]]);
    const c5 = new THREE.CatmullRomCurve3([clusters[2], new THREE.Vector3(-2, 1, -3.5), clusters[1]]);
    const c6 = new THREE.CatmullRomCurve3([clusters[0], new THREE.Vector3(2, 3, -4.5), clusters[2]]);
    return [c1, c2, c3, c4, c5, c6];
  }, [clusters]);

  // Generate 300 neural node coordinates in a sphere
  const { nodePositions, lineGeometry } = useMemo(() => {
    const count = 300;
    const positions: THREE.Vector3[] = [];
    
    // Generate spherical positions
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.random() * 15;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions.push(new THREE.Vector3(x, y, z));
    }

    // Connect to 3 nearest neighbors
    const linePairs: number[] = [];
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      // Sort other nodes by distance
      const dists = positions
        .map((other, idx) => ({ idx, dist: p.distanceToSquared(other) }))
        .filter((item) => item.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      // Connect to top 3 nearest
      for (let k = 0; k < Math.min(3, dists.length); k++) {
        linePairs.push(p.x, p.y, p.z);
        const nearNode = positions[dists[k].idx];
        linePairs.push(nearNode.x, nearNode.y, nearNode.z);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePairs), 3));
    return { nodePositions: positions, lineGeometry: geom };
  }, []);

  // Generate Cluster Nodes (20 per cluster, total 60 nodes)
  const clusterNodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    clusters.forEach((center) => {
      for (let i = 0; i < 20; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = Math.random() * 1.5;
        const dx = r * Math.sin(phi) * Math.cos(theta);
        const dy = r * Math.sin(phi) * Math.sin(theta);
        const dz = r * Math.cos(phi);
        positions.push(new THREE.Vector3().copy(center).add(new THREE.Vector3(dx, dy, dz)));
      }
    });
    return positions;
  }, [clusters]);

  // Generate a background BrainGalaxy (rotating double lobes representing brain hemispheres)
  const { brainGalaxyGeom } = useMemo(() => {
    const count = 800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const isLeftArm = i % 2 === 0;
      const t = i / count;
      const angle = t * Math.PI * 6.5 + (isLeftArm ? 0 : Math.PI);
      const r = 2.2 + t * 9.0;
      
      // Calculate double spiral arm positions
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Lobes vertical egg/dome curvature
      const y = (Math.random() - 0.5) * 1.6 + Math.sin(t * Math.PI) * (isLeftArm ? 1.4 : -1.4);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z - 6.0; // Pushed deeper in Z

      // Cyan and Indigo gradient color mix
      col[i * 3] = isLeftArm ? 0.0 : 0.48; // Red
      col[i * 3 + 1] = isLeftArm ? 0.83 : 0.18; // Green
      col[i * 3 + 2] = 1.0; // Blue
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));

    return { brainGalaxyGeom: g };
  }, []);

  // Orbit rotation and data packets movement
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate the entire galaxy
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.03;
    }

    // Animate data packet dots along the CatmullRom curves
    const dots = [dot1, dot2, dot3, dot4, dot5, dot6];
    dots.forEach((dot, idx) => {
      if (dot.current) {
        // Stagger the speed of each dot slightly
        const speedFactor = 0.2 + idx * 0.05;
        const progress = (t * speedFactor) % 1.0;
        const pos = curves[idx].getPointAt(progress);
        dot.current.position.copy(pos);
      }
    });

    // Populate instanced nodes
    if (nodeMeshRef.current) {
      const dummy = new THREE.Object3D();
      nodePositions.forEach((pos, i) => {
        // Orbit motion slightly per node
        const localOrbitSpeed = 0.01 + (i % 5) * 0.005;
        const radiusXZ = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        const angle = Math.atan2(pos.z, pos.x) + localOrbitSpeed * 0.02;
        
        pos.x = Math.cos(angle) * radiusXZ;
        pos.z = Math.sin(angle) * radiusXZ;
        
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.08 + Math.sin(t * 3 + i) * 0.02);
        dummy.updateMatrix();
        nodeMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodeMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Populate cluster instanced nodes
    if (clusterMeshRef.current) {
      const dummy = new THREE.Object3D();
      clusterNodePositions.forEach((pos, i) => {
        // Pulse scale
        dummy.position.copy(pos);
        dummy.scale.setScalar(0.05 + Math.sin(t * 5 + i) * 0.015);
        dummy.updateMatrix();
        clusterMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      clusterMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Rotating background brain-like Neural Galaxy */}
      <points geometry={brainGalaxyGeom}>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Central Consciousness thinking core */}
      <ConsciousnessCore />

      {/* 300 Neural Constellation Nodes */}
      <instancedMesh ref={nodeMeshRef} args={[null as any, null as any, 300]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={3}
        />
      </instancedMesh>

      {/* Constellation Connection Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#00D4FF"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>

      {/* 5 Constellation Skill Labels */}
      <ConstellationLabel
        label="TensorFlow"
        radius={5.5}
        speed={0.08}
        initialAngle={0}
        color="#00D4FF"
      />
      <ConstellationLabel
        label="OpenCV"
        radius={7.0}
        speed={0.06}
        initialAngle={Math.PI * 0.4}
        color="#7B2FFF"
      />
      <ConstellationLabel
        label="Scikit-Learn"
        radius={4.8}
        speed={0.1}
        initialAngle={Math.PI * 0.8}
        color="#00FF88"
      />
      <ConstellationLabel
        label="Pandas"
        radius={8.0}
        speed={0.05}
        initialAngle={Math.PI * 1.2}
        color="#FFD700"
      />
      <ConstellationLabel
        label="NumPy"
        radius={6.5}
        speed={0.07}
        initialAngle={Math.PI * 1.6}
        color="#00D4FF"
      />

      {/* 3 Intelligence Clusters (glowing spheres inside dense zones) */}
      <instancedMesh ref={clusterMeshRef} args={[null as any, null as any, 60]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#7B2FFF"
          emissive="#7B2FFF"
          emissiveIntensity={4}
        />
      </instancedMesh>

      {/* Volumetric cluster lights */}
      {clusters.map((center, i) => (
        <pointLight
          key={i}
          position={center}
          color="#7B2FFF"
          intensity={3}
          distance={5}
        />
      ))}

      {/* Data stream cables / tubes */}
      {curves.map((curve, idx) => {
        const geom = new THREE.TubeGeometry(curve, 32, 0.012, 4, false);
        return (
          <mesh key={idx} geometry={geom}>
            <meshBasicMaterial
              color="#00D4FF"
              transparent
              opacity={0.08}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Animated Data Packets (racing dots) */}
      <mesh ref={dot1}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={dot2}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={dot3}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#7B2FFF" />
      </mesh>
      <mesh ref={dot4}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh ref={dot5}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#7B2FFF" />
      </mesh>
      <mesh ref={dot6}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
    </group>
  );
}
