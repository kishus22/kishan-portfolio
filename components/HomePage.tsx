"use client";

import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AIReactor from "@/components/sections/AIReactor";
import ProjectsCinematic from "@/components/sections/ProjectsCinematic";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Internships from "@/components/Internships";
import Contact from "@/components/Contact";
import LenisProvider from "@/components/providers/LenisProvider";
import ParticlesBackground from "@/components/effects/ParticlesBackground";
import BackgroundEffects from "@/components/effects/BackgroundEffects";
import MouseGlow from "@/components/effects/MouseGlow";
import CustomCursor from "@/components/effects/CustomCursor";
import FloatingHUD from "@/components/effects/FloatingHUD";
import SectionSeparator from "@/components/ui/SectionSeparator";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

function PortfolioContent() {
  useCinematicScroll();

  return (
    <>
      <Loader />
      <CustomCursor />
      <MouseGlow />
      <FloatingHUD />

      <main className="cinematic-scroll relative min-h-screen overflow-x-hidden bg-black text-white">
        <ParticlesBackground />
        <BackgroundEffects />

        <Navbar />
        <Hero />
        <SectionSeparator />
        <AIReactor />
        <SectionSeparator />
        <ProjectsCinematic />
        <SectionSeparator />
        <Skills />
        <SectionSeparator />
        <Education />
        <SectionSeparator />
        <Internships />
        <SectionSeparator />
        <Contact />
      </main>
    </>
  );
}

export default function HomePage() {
  return (
    <LenisProvider>
      <PortfolioContent />
    </LenisProvider>
  );
}
