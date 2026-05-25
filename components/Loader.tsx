"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "> REACTOR_CHARGE_INIT",
  "> NEURAL_SCAN_ACTIVE",
  "> HOLOGRAPHIC_UI_LOAD",
  "> MISSION_DATABASE_SYNC",
  "> KISHAN AI ONLINE",
];

export default function Loader() {
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((i) => (i >= BOOT_LINES.length - 1 ? i : i + 1));
    }, 350);

    const chargeInterval = setInterval(() => {
      setCharge((c) => (c >= 100 ? 100 : c + 2));
    }, 60);

    const timeout = setTimeout(() => setDone(true), 4000);

    return () => {
      clearInterval(interval);
      clearInterval(chargeInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.1)_0%,transparent_55%)]" />

          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute h-80 w-80 rounded-full border border-cyan-400/20"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute h-64 w-64 rounded-full border border-dashed border-purple-500/30"
          />

          <div className="relative z-10 mb-10 flex h-28 w-28 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#reactorGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={276}
                animate={{ strokeDashoffset: 276 - (276 * charge) / 100 }}
                transition={{ duration: 0.1 }}
              />
              <defs>
                <linearGradient id="reactorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ffff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-mono text-xs text-cyan-400">{charge}%</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            className="relative z-10 text-center font-[family-name:var(--font-orbitron)] text-xl font-black tracking-[0.25em] text-cyan-400 text-glow-cyan md:text-3xl"
          >
            INITIALIZING KISHAN AI SYSTEM
          </motion.h1>

          <div className="relative z-10 mt-8 flex h-16 items-end justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
                animate={{ height: [6, 20 + (i % 4) * 6, 6] }}
                transition={{
                  duration: 0.5 + (i % 3) * 0.1,
                  repeat: Infinity,
                  delay: i * 0.04,
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-8 font-mono text-left text-[11px] text-cyan-400/50">
            {BOOT_LINES.slice(0, lineIndex + 1).map((line) => (
              <motion.p key={line} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="neural-scan-line absolute left-0 right-0 h-px bg-cyan-400/40"
            animate={{ top: ["20%", "80%", "20%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
