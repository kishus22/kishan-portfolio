"use client";

import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "@/lib/skills";
import HolographicCard from "@/components/ui/HolographicCard";

export default function Skills() {
  return (
    <section id="skills" className="scene-snap relative z-10 px-6 py-20">
      <div className="mx-auto max-w-7xl relative">
        {/* One small HUD in skills section */}
        <div className="absolute -top-4 right-6 hidden md:block opacity-60 font-[family-name:var(--font-fira-code)] text-[10px] text-[rgba(0,212,255,0.7)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] border border-[rgba(0,212,255,0.2)] rounded px-[10px] py-[6px] uppercase tracking-widest">
          SECURE_SYNC: OK
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-[0.2em] text-cyan-400">
            — Act III —
          </p>
          <h2 
            className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black md:text-5xl uppercase tracking-wider text-white"
            style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.25)" }}
          >
            SKILLS MATRIX
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-500 font-sans text-sm">
            Futuristic capability nodes organized by core discipline.
          </p>
        </motion.div>

        {/* 3-column layout on desktop, 2-column on mobile, 1-column on small mobile */}
        <div className="grid grid-cols-1 gap-6 min-[540px]:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="h-full"
            >
              <HolographicCard 
                glow={index % 2 === 0 ? "cyan" : "purple"}
                className="h-full"
              >
                <h3 className="font-[family-name:var(--font-orbitron)] text-base font-bold text-white mb-4 border-b border-white/10 pb-2 uppercase tracking-widest">
                  {cat.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="rounded-md border border-cyan-400/20 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-wider text-cyan-300/90 transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-105"
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
