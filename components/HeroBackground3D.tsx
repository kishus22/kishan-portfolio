"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/useIsMobile";

// Layer 4: Deep Space Particles / Light Fragments
function DeepSpaceParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 350;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Wider distribution for depth parallax
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 2; // closer Z ranges
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * -0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e8f4fd" size={0.035} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Active Tracers / Pulses traveling along Flat Bezier curved routes
function RoutePulse({ points, color, delay }: { points: THREE.Vector3[]; color: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime + delay;
    const speed = 0.28; // Pace along the curve
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
      <meshBasicMaterial color={color} transparent opacity={0.95} />
    </mesh>
  );
}

// Layer 2: Swirling Cinematic Energy Portal
function EnergyPortal() {
  const portalRef = useRef<THREE.Group>(null);
  const ringCount = 10;

  // Swirling rings data
  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      radius: 0.7 + i * 0.24,
      speed: 0.12 + i * 0.04,
      color: i % 2 === 0 ? "#00ffff" : "#7b2fff",
      opacity: 0.32 - i * 0.025,
      rotSpeed: (Math.random() - 0.5) * 0.4,
    }));
  }, []);

  useFrame((state) => {
    if (!portalRef.current) return;
    const t = state.clock.elapsedTime;
    portalRef.current.children.forEach((child, i) => {
      const ring = rings[i];
      if (!ring) return;
      // Swirl rotation
      child.rotation.z = t * ring.rotSpeed;
      // Slow pulsing waves
      const pulse = 1 + Math.sin(t * 1.4 + i) * 0.035;
      child.scale.set(pulse, pulse, pulse);
    });
  });

  return (
    // Positioned behind the title (left-ish coordinates)
    <group ref={portalRef} position={[-1.6, 0.5, -3.8]}>
      {/* Central energy source */}
      <mesh position={[0, 0, -0.05]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
      </mesh>

      {/* Volumetric glow lighting */}
      <pointLight color="#00ffff" intensity={2.8} distance={8} />
      <pointLight color="#7b2fff" intensity={2.0} distance={6} />

      {/* Portal Swirling Waves */}
      {rings.map((ring, idx) => (
        <mesh key={idx}>
          <ringGeometry args={[ring.radius, ring.radius + 0.015, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Layer 3: Flat Dotted World Map & Dynamic Light Routes
function HolographicWorldMap() {
  const mapRef = useRef<THREE.Group>(null);

  // Land verification
  const isLand = (x: number, y: number) => {
    // Map coordinates for simplified continents (range x: -6 to 6, y: -3 to 3)
    const landmasses = [
      // North America
      { cx: -3.0, cy: 0.9, rx: 1.6, ry: 1.0 },
      { cx: -4.1, cy: 1.5, rx: 0.9, ry: 0.6 }, // Alaska
      { cx: -1.6, cy: 1.6, rx: 0.7, ry: 0.7 }, // Greenland
      // South America
      { cx: -2.0, cy: -1.1, rx: 0.8, ry: 1.3 },
      // Eurasia / Europe / Asia
      { cx: 1.7, cy: 1.1, rx: 2.7, ry: 1.1 },
      { cx: 3.6, cy: 0.5, rx: 1.5, ry: 0.9 }, // East Asia
      { cx: 0.0, cy: 1.2, rx: 0.8, ry: 0.8 }, // Middle East
      // Africa
      { cx: 0.6, cy: -0.5, rx: 0.9, ry: 1.2 },
      // Australia
      { cx: 3.8, cy: -1.5, rx: 0.8, ry: 0.6 },
    ];

    return landmasses.some((lm) => {
      const dx = (x - lm.cx) / lm.rx;
      const dy = (y - lm.cy) / lm.ry;
      return dx * dx + dy * dy <= 1;
    });
  };

  const [positions, routeCurves] = useMemo(() => {
    const pts = [];
    const cols = 55;
    const rows = 28;
    const startX = -6.5;
    const endX = 6.5;
    const startY = -2.8;
    const endY = 2.8;

    for (let r = 0; r < rows; r++) {
      const y = startY + (r / (rows - 1)) * (endY - startY);
      for (let c = 0; c < cols; c++) {
        const x = startX + (c / (cols - 1)) * (endX - startX);
        if (isLand(x, y)) {
          // Perturb coordinates for high-tech dot-matrix feel
          const px = x + (Math.random() - 0.5) * 0.03;
          const py = y + (Math.random() - 0.5) * 0.03;
          pts.push(new THREE.Vector3(px, py, -4.2)); // placed flat at Z=-4.2
        }
      }
    }

    // Bezier Curves representing flat routes curving forward
    const curves: THREE.Vector3[][] = [];
    const routeCount = 8;
    for (let r = 0; r < routeCount; r++) {
      const idxA = Math.floor(Math.random() * pts.length);
      const idxB = Math.floor(Math.random() * pts.length);

      const pA = pts[idxA];
      const pB = pts[idxB];

      if (!pA || !pB) continue;

      // Arc mid-point pushed forward in Z (creating 3D curved lines on flat continents)
      const midPoint = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
      midPoint.z += 1.4; // Curve forward towards Z = -2.8

      const curve = new THREE.QuadraticBezierCurve3(pA, midPoint, pB);
      curves.push(curve.getPoints(24));
    }

    const flatFloatArray = new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]));
    return [flatFloatArray, curves];
  }, []);

  useFrame((state) => {
    if (mapRef.current) {
      // Slow breathing continental glow
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.012;
      mapRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group ref={mapRef}>
      {/* 2D Dotted World Map */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#00d4ff" size={0.05} transparent opacity={0.65} />
      </points>

      {/* Trade Routes & Dynamic Light Pulses */}
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
    </group>
  );
}

// Volumetric Spotlight Beams
function VolumetricBeams() {
  return (
    <group>
      <mesh position={[-4.0, 1.2, -5.5]} rotation={[0.2, 0, 0.15]}>
        <cylinderGeometry args={[0.01, 1.6, 9, 16, 1, true]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[4.0, 1.2, -5.5]} rotation={[-0.2, 0, -0.15]}>
        <cylinderGeometry args={[0.01, 1.6, 9, 16, 1, true]} />
        <meshBasicMaterial color="#7b2fff" transparent opacity={0.03} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Colliding energy waves
function EnergyWaves() {
  const waveRef1 = useRef<THREE.Line>(null);
  const waveRef2 = useRef<THREE.Line>(null);
  const pointCount = 60;

  useFrame((state) => {
    const t = state.clock.elapsedTime;

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

// Sliding grid floor
function ReflectiveFloor() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    const t = state.clock.elapsedTime;
    gridRef.current.position.z = (t * 0.35) % 2 - 1;
  });

  return (
    <group position={[0, -2.5, -2]} rotation={[0.08, 0, 0]}>
      <gridHelper ref={gridRef} args={[40, 30, "#00ffff", "#06182c"]} />
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
      <EnergyPortal />
      <HolographicWorldMap />
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
