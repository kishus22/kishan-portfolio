"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SpaceDebris() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate 80 floating wireframe space debris panels
  const debrisData = useMemo(() => {
    return Array.from({ length: 80 }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 35,
        -6 - Math.random() * 24 // Positioned deep in mid-background
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008
      ),
      scale: Math.random() * 0.35 + 0.08,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const dtFactor = delta * 60; // Normalize movement relative to 60fps

    debrisData.forEach((d, i) => {
      d.rotation.x += d.rotSpeed.x * dtFactor;
      d.rotation.y += d.rotSpeed.y * dtFactor;
      d.rotation.z += d.rotSpeed.z * dtFactor;

      dummy.position.copy(d.position);
      dummy.rotation.copy(d.rotation);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, 80]}>
      {/* Box geometries look like mechanical fragments or space station scraps */}
      <boxGeometry args={[1.0, 1.0, 1.0]} />
      <meshStandardMaterial
        color="#050b14"
        wireframe={true}
        emissive="#00D4FF"
        emissiveIntensity={0.18}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}
