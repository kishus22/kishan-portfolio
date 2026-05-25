"use client";

import { motion } from "framer-motion";

type ChapterIntroProps = {
  codename: string;
  label?: string;
};

export default function ChapterIntro({
  codename,
  label = "MISSION BRIEFING",
}: ChapterIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-6 flex flex-col gap-2"
    >
      <p className="font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.2em] text-cyan-400">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 32 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="h-px bg-cyan-400"
        />
        <h4 
          className="font-[family-name:var(--font-orbitron)] font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:text-glow-cyan"
          style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
        >
          {codename}
        </h4>
      </div>
    </motion.div>
  );
}
