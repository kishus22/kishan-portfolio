"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden px-6 pb-16 pt-8">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="mx-auto mb-12 h-px max-w-3xl origin-center bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(0,255,255,0.5)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.5em] text-gray-600">
          End of Transmission
        </p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mt-4 font-[family-name:var(--font-orbitron)] text-lg tracking-[0.3em] text-cyan-400/80"
        >
          KISHAN S © {new Date().getFullYear()}
        </motion.p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-gray-700">
          Cinematic AI Portfolio · All Systems Nominal
        </p>
      </motion.div>

      <div className="credits-scroll pointer-events-none absolute bottom-0 left-0 right-0 opacity-[0.03]">
        <p className="whitespace-nowrap font-[family-name:var(--font-orbitron)] text-6xl uppercase tracking-widest">
          KISHAN AI UNIVERSE · KISHAN AI UNIVERSE ·
        </p>
      </div>
    </footer>
  );
}
