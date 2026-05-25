"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const BOOT_LINES = [
  "> REACTOR_CHARGE_INIT",
  "> NEURAL_SCAN_ACTIVE",
  "> HOLOGRAPHIC_UI_LOAD",
  "> MISSION_DATABASE_SYNC",
  "> KISHAN AI ONLINE",
];

export default function Loader() {
  const [lineIndex, setLineIndex] = useState(-1);
  const [done, setDone] = useState(false);
  const [charge, setCharge] = useState(0);
  const [verified, setVerified] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dashedRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
      },
    });

    // 0.0s — HUD rings scale-in
    tl.fromTo(
      ringRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 0.4, duration: 0.3, ease: "power2.out" },
      0
    );
    tl.fromTo(
      dashedRingRef.current,
      { scale: 0.3, opacity: 0 },
      { scale: 1, opacity: 0.3, duration: 0.3, ease: "power2.out" },
      0
    );

    // 0.3s — Status lines begin appearing, 0.2s stagger each
    const lineObj = { index: -1 };
    tl.to(
      lineObj,
      {
        index: BOOT_LINES.length - 1,
        duration: 0.8,
        ease: "none",
        onUpdate: () => {
          setLineIndex(Math.round(lineObj.index));
        },
      },
      0.3
    );

    // 1.2s — Percentage counter starts: 0% → 100% over 0.8s with easeOut
    const chargeObj = { value: 0 };
    tl.to(
      chargeObj,
      {
        value: 100,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          setCharge(Math.round(chargeObj.value));
        },
      },
      1.2
    );

    // 2.0s — "IDENTITY VERIFIED" flashes green, holds 0.3s
    tl.call(
      () => {
        setVerified(true);
      },
      [],
      2.0
    );

    // 2.3s — Full screen fade to black (0.2s)
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      2.3
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          ref={containerRef}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,255,0.08)_0%,transparent_55%)]" />

          {/* HUD Rings - scales to 60% on mobile */}
          <div
            ref={ringRef}
            className="absolute h-48 w-48 md:h-80 md:w-80 rounded-full border border-cyan-400/20"
          />
          <div
            ref={dashedRingRef}
            className="absolute h-36 w-36 md:h-64 md:w-64 rounded-full border border-dashed border-purple-500/30 animate-[spin-slow_25s_linear_infinite]"
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
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="url(#reactorGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={276}
                strokeDashoffset={276 - (276 * charge) / 100}
                style={{ transition: "stroke-dashoffset 0.05s ease-out" }}
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
            className={`relative z-10 text-center font-[family-name:var(--font-orbitron)] text-lg font-black tracking-[0.25em] md:text-3xl transition-all duration-300 ${
              verified ? "text-green-400 text-glow-green scale-105" : "text-cyan-400 text-glow-cyan"
            }`}
          >
            {verified ? "IDENTITY VERIFIED" : "INITIALIZING KISHAN AI SYSTEM"}
          </motion.h1>

          {/* Responsive Equalizer wave visual */}
          <div className="relative z-10 mt-8 flex h-16 items-end justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-purple-500"
                animate={{ height: [6, 20 + (i % 4) * 6, 6] }}
                transition={{
                  duration: 0.6 + (i % 3) * 0.1,
                  repeat: Infinity,
                  delay: i * 0.04,
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-8 font-mono text-left text-[11px] text-cyan-400/50">
            {lineIndex >= 0 &&
              BOOT_LINES.slice(0, lineIndex + 1).map((line) => (
                <p key={line} className="opacity-100 transition-opacity duration-300">
                  {line}
                </p>
              ))}
          </div>

          <div className="neural-scan-line absolute left-0 right-0 h-px bg-cyan-400/30 animate-[hologram-scan_4s_ease-in-out_infinite]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
