"use client";

import { motion } from "framer-motion";
import HolographicCard from "@/components/ui/HolographicCard";
import { INTERNSHIPS } from "@/lib/constants";

export default function Internships() {
  return (
    <section id="internships" className="scene-snap relative z-10 px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
          data-cinematic
        >
          <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
            — Act V —
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black md:text-5xl">
            <span className="movie-title-gradient">INTERNSHIPS</span>
          </h2>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {INTERNSHIPS.map((intern, index) => (
            <motion.div
              key={intern.company}
              animate={{ y: index % 2 === 0 ? [0, -12, 0] : [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <HolographicCard
                glow={intern.accent as "cyan" | "purple"}
                delay={index * 0.15}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-cyan-400/80">
                  {intern.period}
                </p>
                <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-bold text-white">
                  {intern.company}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-[0.25em] text-purple-300">
                  {intern.role}
                </p>
                <p className="mt-4 leading-relaxed text-gray-400">
                  {intern.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {intern.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wider text-gray-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </HolographicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
