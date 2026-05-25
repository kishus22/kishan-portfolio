"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import AISphere from "./AISphere";

export default function Scene3D() {
  return (
    <div className="relative h-[min(70vh,560px)] w-full">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.15)_0%,transparent_70%)]" />
      <Canvas
        className="rounded-3xl"
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.5} />
        <ambientLight intensity={0.15} />
        <spotLight
          position={[0, 8, 4]}
          angle={0.35}
          penumbra={1}
          intensity={2}
          color="#00ffff"
        />
        <spotLight
          position={[-4, -2, 2]}
          intensity={1.2}
          color="#a855f7"
        />
        <AISphere />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
