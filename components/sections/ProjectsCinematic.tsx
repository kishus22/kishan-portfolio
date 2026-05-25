"use client";

import { motion } from "framer-motion";
import { PROJECTS } from "@/lib/constants";
import ProjectMission from "@/components/cinematic/ProjectMission";
import CinematicText from "@/components/ui/CinematicText";

export default function ProjectsCinematic() {
  return (
    <div className="relative">
      <div className="scene-snap relative z-20 px-6 pt-12 pb-6 md:pt-20 md:pb-6 text-center">
        <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
          — Act II —
        </p>
        <CinematicText
          className="mt-4 font-[family-name:var(--font-orbitron)] text-4xl font-black tracking-widest md:text-6xl text-white uppercase"
          style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.25)" }}
        >
          MISSION ARCHIVE
        </CinematicText>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-xl text-gray-500"
        >
          Six classified operations. Scroll through cinematic mission chapters.
        </motion.p>
      </div>

      {PROJECTS.map((project, index) => (
        <ProjectMission key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
