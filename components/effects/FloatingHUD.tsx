"use client";

import { motion } from "framer-motion";

const PANELS = [
  { label: "SYSTEM ACTIVE", position: "top-12 left-6", delay: 0 },
  { label: "SECURE LINK", position: "top-20 right-6", delay: 0.5 },
  { label: "CORE SYNCED", position: "bottom-12 right-6", delay: 1.0 },
] as const;

export default function FloatingHUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
      {PANELS.map((panel) => (
        <motion.div
          key={panel.label}
          initial={{ opacity: 0, x: panel.position.includes("right") ? 20 : -20 }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [0, -6, 0],
            x: 0,
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, delay: panel.delay },
            y: { duration: 6 + panel.delay, repeat: Infinity, ease: "easeInOut" },
            x: { delay: 3 + panel.delay, duration: 0.6 },
          }}
          className={`absolute ${panel.position} rounded border border-cyan-400/20 bg-black/60 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.25em] text-cyan-400/80 backdrop-blur-md`}
        >
          <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00ffff]" />
          {panel.label}
        </motion.div>
      ))}
    </div>
  );
}
