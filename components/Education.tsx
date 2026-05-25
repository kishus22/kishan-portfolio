"use client";

import { motion } from "framer-motion";
import HolographicCard from "@/components/ui/HolographicCard";
import { EDUCATION } from "@/lib/constants";

export default function Education() {
  return (
    <section id="education" className="scene-snap relative z-10 px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
          data-cinematic
        >
          <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
            — Act IV —
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black md:text-5xl">
            <span className="movie-title-gradient">EDUCATION</span>
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute left-6 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 md:block"
          />
          <motion.div
            animate={{ boxShadow: ["0 0 20px #00ffff", "0 0 40px #00ffff", "0 0 20px #00ffff"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-4 top-12 hidden h-6 w-6 rounded-full border-2 border-cyan-400 bg-black md:block"
          />

          <HolographicCard glow="cyan" className="md:ml-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-block rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 font-mono text-xs uppercase tracking-widest text-cyan-400"
            >
              {EDUCATION.period}
            </motion.span>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 font-[family-name:var(--font-orbitron)] text-2xl font-bold leading-snug text-white md:text-3xl"
            >
              {EDUCATION.degree}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-xl text-cyan-300"
            >
              {EDUCATION.university}
            </motion.p>

            <ul className="mt-8 space-y-4">
              {EDUCATION.highlights.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex gap-3 text-gray-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]" />
                  {point}
                </motion.li>
              ))}
            </ul>
          </HolographicCard>
        </div>
      </div>
    </section>
  );
}
