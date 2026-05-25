"use client";

import { motion } from "framer-motion";

const PANELS = [
  { label: "AI SYSTEM ACTIVE", position: "top-36 left-8", delay: 0 },
  { label: "CLASSIFIED MISSION", position: "top-44 right-8", delay: 0.4 },
  { label: "TARGET LOCKED", position: "bottom-36 left-10", delay: 0.8 },
  { label: "AI CORE SYNC", position: "bottom-32 right-10", delay: 1.2 },
] as const;

export default function FloatingHUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
      {PANELS.map((panel) => (
        <motion.div
          key={panel.label}
          initial={{ opacity: 0, x: panel.position.includes("right") ? 20 : -20 }}
          animate={{
            opacity: [0.4, 0.85, 0.4],
            y: [0, -8, 0],
            x: 0,
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, delay: panel.delay },
            y: { duration: 5 + panel.delay, repeat: Infinity, ease: "easeInOut" },
            x: { delay: 4 + panel.delay, duration: 0.6 },
          }}
          className={`absolute ${panel.position} rounded border border-cyan-400/25 bg-black/50 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.35em] text-cyan-400/80 backdrop-blur-md`}
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00ffff]" />
          {panel.label}
        </motion.div>
      ))}
    </div>
  );
}
