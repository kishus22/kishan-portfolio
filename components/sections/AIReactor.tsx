"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import CinematicText from "@/components/ui/CinematicText";
import ProjectModal from "@/components/projects/ProjectModal";
import type { Project } from "@/data/projects";

const Scene3D = dynamic(() => import("@/components/three/Scene3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] items-center justify-center">
      <span className="font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.2em] text-[#00D4FF]">Initializing Portal...</span>
    </div>
  ),
});

export default function AIReactor() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="ai-reactor" data-scroll-reveal className="scene-snap relative z-10 overflow-hidden bg-transparent px-6 py-[60px] md:py-[120px]">
      <div className="absolute inset-0">
        <Image src="/ai-core.jpeg" alt="" fill className="object-cover opacity-20" sizes="100vw" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="font-[family-name:var(--font-fira-code)] text-[11px] uppercase tracking-[0.2em] text-[#00D4FF]">
            ACT II · TECH DIMENSION PORTAL
          </p>
          <CinematicText className="h2-cinematic mt-4 uppercase">TECH DIMENSION PORTAL</CinematicText>
          <p className="font-[family-name:var(--font-orbitron)] text-[10px] sm:text-xs tracking-[0.25em] text-cyan-400/80 uppercase mt-2">
            AI • Software • Full Stack • Cloud • Automation
          </p>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="body-cinematic mx-auto mt-4 max-w-lg">
            An interactive dimensional portal. Click any category node to travel through the grid tunnel and explore Kishan's skills and projects in real time.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-panel relative overflow-hidden rounded-3xl p-4 md:p-8"
        >
          <div className="hidden md:block">
            <Scene3D onOpenProject={setSelectedProject} />
          </div>
          <div className="md:hidden">
            <div className="relative h-[220px] w-full overflow-hidden rounded-2xl border border-cyan-400/20">
              <Image src="/ai-core.jpeg" alt="AI portal preview" fill loading="lazy" sizes="100vw" className="object-cover" style={{ filter: "brightness(0.55) contrast(1.05)" }} />
            </div>
            <div className="mt-6 text-center text-xs font-mono text-cyan-400/80 animate-pulse">
              [ Dimensional traversal active on desktop screens ]
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unified Project Modal connected directly to the 3D Portal interactive screens */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
