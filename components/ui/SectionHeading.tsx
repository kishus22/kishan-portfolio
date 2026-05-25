"use client";

import { motion } from "framer-motion";

type SectionHeadingProps = {
  label: string;
  title: string;
};

export default function SectionHeading({ label, title }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="mb-16 text-center"
    >
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-3 font-[family-name:var(--font-orbitron)] text-xs uppercase text-cyan-400"
      >
        {label}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-[family-name:var(--font-orbitron)] text-4xl font-black tracking-widest md:text-5xl"
      >
        <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent text-glow-cyan">
          {title}
        </span>
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mx-auto mt-6 h-px w-48 origin-center bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_rgba(0,255,255,0.5)]"
      />
    </motion.div>
  );
}
