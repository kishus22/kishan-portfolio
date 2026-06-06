"use client";

import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FragmentProps {
  position: [number, number, number];
  geomIndex: number;
}

function FragmentMesh({ position, geomIndex }: FragmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Random rotation speed vector
  const rotSpeed = useMemo(() => {
    return {
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015,
      z: (Math.random() - 0.5) * 0.015,
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotSpeed.x;
      meshRef.current.rotation.y += rotSpeed.y;
      meshRef.current.rotation.z += rotSpeed.z;
    }
  });

  // Switch geometries: 0: Box, 1: Tetrahedron, 2: Plane
  const geom = useMemo(() => {
    if (geomIndex === 0) return new THREE.BoxGeometry(0.2, 0.2, 0.2);
    if (geomIndex === 1) return new THREE.TetrahedronGeometry(0.18);
    return new THREE.PlaneGeometry(0.25, 0.15);
  }, [geomIndex]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={geom}
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
      <meshBasicMaterial
        color="#00D4FF"
        wireframe={true}
        transparent
        opacity={hovered ? 0.5 : 0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function HolographicFragments() {
  const fragments = useMemo(() => {
    return Array.from({ length: 40 }, () => ({
      pos: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        -3 - Math.random() * 12,
      ] as [number, number, number],
      geomIndex: Math.floor(Math.random() * 3),
    }));
  }, []);

  return (
    <group>
      {fragments.map((f, i) => (
        <FragmentMesh key={i} position={f.pos} geomIndex={f.geomIndex} />
      ))}
    </group>
  );
}
