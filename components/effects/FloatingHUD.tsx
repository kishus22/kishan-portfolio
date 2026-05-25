"use client";

import { motion } from "framer-motion";

const PANELS = [
  { label: "SYS_ACTIVE", position: "top-12 left-6", delay: 0 },
  { label: "SECURE_LINK", position: "top-20 right-6", delay: 0.5 },
] as const;

export default function FloatingHUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 hidden lg:block">
      {PANELS.map((panel) => (
        <motion.div
          key={panel.label}
          initial={{ opacity: 0, x: panel.position.includes("right") ? 20 : -20 }}
          animate={{
            opacity: 0.6,
            y: [0, -6, 0],
            x: 0,
          }}
          transition={{
            y: { duration: 6 + panel.delay, repeat: Infinity, ease: "easeInOut" },
            x: { delay: 3 + panel.delay, duration: 0.6 },
          }}
          className={`absolute ${panel.position} rounded-[4px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] px-[10px] py-[6px] font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.25em] text-[rgba(0,212,255,0.7)]`}
        >
          <span className="mr-1.5 inline-block h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00ffff]" />
          {panel.label}
        </motion.div>
      ))}
    </div>
  );
}
