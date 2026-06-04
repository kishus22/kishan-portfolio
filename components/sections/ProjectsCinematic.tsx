"use client";

import { useState } from "react";
import CinematicText from "@/components/ui/CinematicText";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/data/projects";

export default function ProjectsCinematic() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" data-scroll-reveal className="scene-snap relative z-10 bg-transparent px-6 py-[60px] md:py-[100px]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-12">
          <p className="label-cinematic">Selected Work</p>
          <CinematicText className="h2-cinematic mt-3 uppercase">Projects</CinematicText>
          <p className="body-cinematic mx-auto mt-4 max-w-xl">
            AI, computer vision, and full-stack systems ? click a project for the full briefing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={setSelected}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
