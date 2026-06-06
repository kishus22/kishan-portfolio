"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PortalRingsForeground() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) ring1.current.rotation.z = t * 0.05;
    if (ring2.current) ring2.current.rotation.z = -t * 0.08;
    if (ring3.current) ring3.current.rotation.z = t * 0.03;
  });

  return (
    <group position={[0, 0, -4.5]}>
      {/* Cyan ring - radius 5 */}
      <mesh ref={ring1}>
        <torusGeometry args={[5, 0.02, 8, 80]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.3} />
      </mesh>

      {/* Purple ring - radius 6.5 */}
      <mesh ref={ring2}>
        <torusGeometry args={[6.5, 0.02, 8, 80]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.25} />
      </mesh>

      {/* Green ring - radius 8 */}
      <mesh ref={ring3}>
        <torusGeometry args={[8, 0.02, 8, 80]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
