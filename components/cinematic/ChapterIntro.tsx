"use client";

import { motion } from "framer-motion";

type ChapterIntroProps = {
  chapter: string;
  codename: string;
  label?: string;
};

export default function ChapterIntro({
  chapter,
  codename,
  label = "MISSION BRIEFING",
}: ChapterIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      <p className="font-[family-name:var(--font-orbitron)] text-[10px] uppercase tracking-[0.6em] text-cyan-400/80">
        {label}
      </p>
      <div className="mt-3 flex items-center gap-6">
        <motion.span
          initial={{ width: 0 }}
          whileInView={{ width: 48 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="h-px bg-cyan-400"
        />
        <span className="font-[family-name:var(--font-orbitron)] text-6xl font-black text-white/10 md:text-8xl">
          {chapter}
        </span>
        <span className="font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-[0.4em] text-purple-400">
          {codename}
        </span>
      </div>
    </motion.div>
  );
}
