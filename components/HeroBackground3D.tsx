"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

// Layer 1: Deep Space Particle Field
function DeepSpaceParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * -0.008;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8f4fd" size={0.025} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Active Tracers / Pulses traveling along Bezier curved routes
function RoutePulse({ points, color, delay }: { points: THREE.Vector3[]; color: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + delay;
    const speed = 0.3; // Pace along the curve
    const progress = (t * speed) % 1;
    const index = Math.floor(progress * (points.length - 1));
    const nextIndex = (index + 1) % points.length;
    const alpha = (progress * (points.length - 1)) % 1;

    const currentPoint = points[index];
    const nextPoint = points[nextIndex];

    if (currentPoint && nextPoint) {
      meshRef.current.position.lerpVectors(currentPoint, nextPoint, alpha);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

// Spherical Holographic Ripples (expanding shockwaves)
function HolographicRipples() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    const scale = 1 + (t * 0.45) % 1.5;
    const opacity = 1 - (scale - 1) / 1.5;
    ringRef.current.scale.set(scale, scale, scale);
    if (ringRef.current.material) {
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.28;
    }
  });

  return (
    <mesh ref={ringRef}>
      <sphereGeometry args={[2.02, 24, 24]} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.25} wireframe side={THREE.DoubleSide} />
    </mesh>
  );
}

// Dotted Orbital ring of particles around globe
function ParticleOrbit() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 75;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const orbitRadius = 2.75;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * orbitRadius;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(angle) * orbitRadius;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.45;
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <points ref={pointsRef} rotation={[Math.PI / 5, 0, Math.PI / 10]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.8} />
    </points>
  );
}

// Layer 2 & 3: Holographic Globe & Global Routes with Glow Boost (+200% glow)
function HolographicGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const dotCount = 380;
  const radius = 2.0;

  const [positions, routeCurves] = useMemo(() => {
    const pos = new Float32Array(dotCount * 3);
    // Fibonacci distribution
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;
      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }

    // Bezier Curves representing global routes
    const curves: THREE.Vector3[][] = [];
    const routeCount = 8;
    for (let r = 0; r < routeCount; r++) {
      const idxA = Math.floor(Math.random() * dotCount);
      const idxB = Math.floor(Math.random() * dotCount);

      const pA = new THREE.Vector3(pos[idxA * 3], pos[idxA * 3 + 1], pos[idxA * 3 + 2]);
      const pB = new THREE.Vector3(pos[idxB * 3], pos[idxB * 3 + 1], pos[idxB * 3 + 2]);

      const midPoint = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      midPoint.normalize().multiplyScalar(radius * 1.45); // Curving outwards

      const curve = new THREE.QuadraticBezierCurve3(pA, midPoint, pB);
      curves.push(curve.getPoints(24));
    }

    return [pos, curves];
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // 1. Organic Breathing Scale Pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.025;
      groupRef.current.scale.set(scale, scale, scale);

      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0.4, 0, -1]}>
      {/* Globe points - size and opacity boosted */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00d4ff" size={0.065} transparent opacity={0.85} />
      </points>

      {/* Volumetric Globe glows (Glow boosted by ~30%) */}
      <mesh>
        <sphereGeometry args={[radius * 0.99, 20, 20]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.96, 16, 16]} />
        <meshBasicMaterial color="#7b2fff" transparent opacity={0.14} side={THREE.DoubleSide} />
      </mesh>

      {/* Wireframe skeleton rings */}
      <mesh>
        <sphereGeometry args={[radius * 0.995, 14, 14]} />
        <meshBasicMaterial color="#7b2fff" transparent opacity={0.06} wireframe />
      </mesh>

      {/* Holographic shockwave ripples */}
      <HolographicRipples />

      {/* Dotted AI orbit rings */}
      <ParticleOrbit />

      {/* Trade Routes & Pulse Tracers */}
      {routeCurves.map((pts, idx) => (
        <group key={idx}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z])), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={idx % 2 === 0 ? "#00ffff" : "#7b2fff"}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
            />
          </line>
          <RoutePulse points={pts} color={idx % 2 === 0 ? "#00ffff" : "#a855f7"} delay={idx * 0.8} />
        </group>
      ))}

      {/* Concentric HUD orbits */}
      <group rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <mesh>
          <ringGeometry args={[radius * 1.25, radius * 1.27, 64]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group rotation={[-Math.PI / 5, Math.PI / 3, 0]}>
        <mesh>
          <ringGeometry args={[radius * 1.35, radius * 1.36, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

// Layer 4 & 5: Energy Storm & Time Tunnel
// Moving rings tunnel effect behind globe
function TimeTunnelRings() {
  const groupRef = useRef<THREE.Group>(null);
  const ringCount = 8;
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      z: -14 + (i / ringCount) * 18,
      radius: 1.6 + i * 0.45,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const speed = 0.55;
    groupRef.current.children.forEach((child) => {
      child.position.z += speed * 0.08;
      // Loop rings back
      if (child.position.z > 5) {
        child.position.z = -13;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, idx) => (
        <mesh key={idx} position={[0, 0, ring.z]}>
          <ringGeometry args={[ring.radius, ring.radius + 0.015, 32]} />
          <meshBasicMaterial
            color={idx % 2 === 0 ? "#00d4ff" : "#7b2fff"}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Layer 6: Floating HUD Glass Dashboards
function FloatingHUDPanels() {
  const groupRef = useRef<THREE.Group>(null);
  const panels = useMemo(
    () => [
      // Left high panel
      { pos: [-4.2, 1.8, -3.2] as [number, number, number], rot: [0, 0.45, 0] as [number, number, number], size: [2.1, 1.1] as [number, number] },
      // Right mid panel
      { pos: [4.4, -0.8, -3.0] as [number, number, number], rot: [0, -0.4, 0] as [number, number, number], size: [1.8, 1.3] as [number, number] },
      // Left low panel
      { pos: [-3.2, -1.8, -3.8] as [number, number, number], rot: [0.15, 0.4, 0] as [number, number, number], size: [1.4, 1.6] as [number, number] },
      // Right high panel
      { pos: [3.8, 2.0, -4.0] as [number, number, number], rot: [-0.1, -0.3, 0] as [number, number, number], size: [2.0, 0.9] as [number, number] },
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((panel, i) => {
      panel.position.y += Math.sin(t * 0.7 + i) * 0.0015;
      panel.rotation.y += Math.cos(t * 0.35 + i) * 0.0005;
    });
  });

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <group key={i} position={p.pos} rotation={p.rot}>
          {/* Glass background plate */}
          <mesh>
            <planeGeometry args={p.size} />
            <meshBasicMaterial color="#020409" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
          {/* Outer tech wireframe borders */}
          <mesh>
            <planeGeometry args={p.size} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.25} wireframe side={THREE.DoubleSide} />
          </mesh>
          {/* Inner details */}
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[p.size[0] * 0.94, p.size[1] * 0.92]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#7b2fff" : "#00ffff"}
              transparent
              opacity={0.12}
              wireframe
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Volumetric Spotlight Beams
function VolumetricBeams() {
  return (
    <group>
      <mesh position={[-3.8, 1, -5.5]} rotation={[0.2, 0, 0.15]}>
        <cylinderGeometry args={[0.01, 1.5, 9, 16, 1, true]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[3.8, 1, -5.5]} rotation={[-0.2, 0, -0.15]}>
        <cylinderGeometry args={[0.01, 1.5, 9, 16, 1, true]} />
        <meshBasicMaterial color="#7b2fff" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Dual flowing energy wave currents
function EnergyWaves() {
  const waveRef1 = useRef<THREE.Line>(null);
  const waveRef2 = useRef<THREE.Line>(null);
  const pointCount = 60;
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Wave 1: Cyan scrolling left to right
    if (waveRef1.current) {
      const pos1 = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i++) {
        const x = -10 + (i / (pointCount - 1)) * 20;
        const y = Math.sin(x * 0.7 - t * 3.5) * 0.35 * Math.sin(t * 0.4) - 1.8;
        const z = -5.0 + Math.cos(x * 0.4 + t) * 1.0;
        pos1[i * 3] = x;
        pos1[i * 3 + 1] = y;
        pos1[i * 3 + 2] = z;
      }
      waveRef1.current.geometry.setAttribute("position", new THREE.BufferAttribute(pos1, 3));
    }

    // Wave 2: Purple scrolling right to left (colliding)
    if (waveRef2.current) {
      const pos2 = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i++) {
        const x = -10 + (i / (pointCount - 1)) * 20;
        const y = Math.sin(x * 0.85 + t * 3.0) * 0.28 * Math.cos(t * 0.55) - 1.6;
        const z = -6.0 + Math.sin(x * 0.35 - t * 1.1) * 1.2;
        pos2[i * 3] = x;
        pos2[i * 3 + 1] = y;
        pos2[i * 3 + 2] = z;
      }
      waveRef2.current.geometry.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
    }
  });
  
  return (
    <group>
      <line ref={waveRef1 as any}>
        <bufferGeometry />
        <lineBasicMaterial color="#00ffff" transparent opacity={0.25} />
      </line>
      <line ref={waveRef2 as any}>
        <bufferGeometry />
        <lineBasicMaterial color="#a855f7" transparent opacity={0.2} />
      </line>
    </group>
  );
}

// Reflective Floor Grid
function ReflectiveFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.elapsedTime;
    gridRef.current.position.z = ((t * 0.35) % 2) - 1;
  });

  return (
    <group position={[0, -2.5, -2]} rotation={[0.08, 0, 0]}>
      {/* Moving Floor Grid */}
      <gridHelper ref={gridRef} args={[40, 30, "#00ffff", "#06182c"]} />
      
      {/* Reflective Dark Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color="#010c1f" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Camera control and mouse-coordinates parallax depth
function CameraController() {
  useFrame((state) => {
    const { mouse, camera } = state;
    const t = state.clock.elapsedTime;

    const targetX = mouse.x * 0.85;
    const targetY = mouse.y * 0.45 + 0.15;

    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;

    // Subtle lens Z depth zoom/breath
    camera.position.z = 5.8 + Math.sin(t * 0.18) * 0.22;
    camera.lookAt(0, 0, -1.2);
  });
  return null;
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={["#020409", 6, 20]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[2, 3, -1]} color="#00d4ff" intensity={1.5} />
      <pointLight position={[-3, -2, -2]} color="#7b2fff" intensity={1.2} />

      <DeepSpaceParticles />
      <HolographicGlobe />
      <TimeTunnelRings />
      <FloatingHUDPanels />
      <VolumetricBeams />
      <EnergyWaves />
      <ReflectiveFloor />
      <CameraController />
    </>
  );
}

export default function HeroBackground3D() {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.8, 5.8], fov: 60 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "transparent",
      }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
