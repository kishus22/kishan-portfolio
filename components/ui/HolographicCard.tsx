"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type HolographicCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  glow?: "cyan" | "purple" | "pink";
};

const glowMap = {
  cyan: "hover:shadow-[0_0_50px_rgba(0,255,255,0.25)] group-hover:border-cyan-400/60",
  purple: "hover:shadow-[0_0_50px_rgba(168,85,247,0.25)] group-hover:border-purple-400/60",
  pink: "hover:shadow-[0_0_50px_rgba(236,72,153,0.25)] group-hover:border-pink-400/60",
};

export default function HolographicCard({
  children,
  className = "",
  delay = 0,
  glow = "cyan",
}: HolographicCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`group holographic-card relative overflow-hidden rounded-3xl ${className}`}
    >
      <div className={`animated-border absolute inset-0 rounded-3xl opacity-60 transition-opacity group-hover:opacity-100`} />
      <div
        className={`glass-panel relative h-full rounded-3xl p-8 transition-all duration-500 ${glowMap[glow]}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="hologram-shine pointer-events-none absolute inset-0" />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}
