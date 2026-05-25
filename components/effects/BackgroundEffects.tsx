"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="bg-drift-layer pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-cyber absolute inset-0 opacity-25" />
      <div className="cinematic-fog absolute inset-0" />

      <motion.div
        animate={{ x: [0, 120, -80, 0], y: [0, -80, 100, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="animate-pulse-glow absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -100, 90, 0], y: [0, 90, -60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute right-0 top-1/3 h-[380px] w-[380px] rounded-full bg-purple-600/15 blur-[110px]"
      />
      <motion.div
        animate={{ x: [0, 60, -60, 0], y: [0, -50, 70, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[90px]"
      />

      <div className="light-streak absolute top-1/3 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div
        className="light-streak absolute top-2/3 right-0 h-px w-1/3 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"
        style={{ animationDelay: "3s" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />
      <div className="scanline absolute inset-0" />
    </div>
  );
}
