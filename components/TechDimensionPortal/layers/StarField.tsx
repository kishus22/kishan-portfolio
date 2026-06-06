"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export default function StarField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const positions = useMemo(() => {
    return Array.from({ length: 5000 }, () => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      z: (Math.random() - 0.5) * 400,
      scale: Math.random() * 0.08 + 0.02,
    }));
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    positions.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, 5000]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#C8D8FF" />
    </instancedMesh>
  );
}
