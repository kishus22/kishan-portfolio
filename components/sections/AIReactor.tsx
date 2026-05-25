"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import CinematicText from "@/components/ui/CinematicText";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(50vh,400px)] items-center justify-center">
      <span className="animate-pulse font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.4em] text-cyan-400">
        Charging reactor...
      </span>
    </div>
  ),
});

export default function AIReactor() {
  return (
    <section
      id="ai-reactor"
      className="scene-snap relative z-10 overflow-hidden px-6 py-32"
      data-parallax
    >
      <div className="absolute inset-0">
        <Image
          src="/ai-core.jpeg"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
            — Quantum Core —
          </p>
          <CinematicText
            className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black md:text-5xl text-white uppercase tracking-widest"
            style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.25)" }}
          >
            AI REACTOR
          </CinematicText>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mx-auto mt-4 max-w-lg text-gray-500"
          >
            Interactive 3D neural core — the engine behind this cinematic universe.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateX: 6 }}
          whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="glass-panel tilt-hover relative overflow-hidden rounded-3xl p-4 md:p-8"
          style={{ transformPerspective: 1200 }}
          data-camera
        >
          <Scene3D />
        </motion.div>
      </div>
    </section>
  );
}
