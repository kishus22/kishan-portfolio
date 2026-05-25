"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SKILLS } from "@/lib/skills";

export default function Skills() {
  return (
    <section id="skills" className="scene-snap relative z-10 px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
          data-cinematic
        >
          <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
            — Act III —
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black md:text-5xl">
            <span className="movie-title-gradient">SKILLS MATRIX</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500">
            Holographic capability nodes with live tech stack visuals.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              whileHover={{
                scale: 1.06,
                boxShadow: "0 0 40px rgba(0,255,255,0.25)",
              }}
              className="skill-node tilt-hover group relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-white/5 p-6 text-center backdrop-blur-md"
            >
              <div className="skill-node-glow absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-400/30 bg-black/50 p-2 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={40}
                    height={40}
                    className="h-8 w-8 object-contain"
                    unoptimized
                  />
                </div>

                <h3 className="font-[family-name:var(--font-orbitron)] text-sm font-semibold uppercase tracking-wider text-white group-hover:text-cyan-400">
                  {skill.name}
                </h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-purple-400">
                  ONLINE
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
