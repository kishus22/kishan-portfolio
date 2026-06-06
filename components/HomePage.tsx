"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
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
import ParticleTunnel3D from "@/components/ParticleTunnel3D";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

const TechDimensionPortal = dynamic(
  () => import("@/components/TechDimensionPortal"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          background: "#020409",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-fira-code), Fira Code, monospace",
          color: "#00D4FF",
          fontSize: "12px",
          letterSpacing: "0.2em",
          zIndex: 999,
        }}
      >
        <span className="animate-pulse">INITIALIZING TECH DIMENSION PORTAL...</span>
      </div>
    ),
  }
);

function PortfolioContent() {
  useCinematicScroll();

  return (
    <>
      <Loader />
      <CustomCursor />
      <MouseGlow />
      <FloatingHUD />

      <main className="cinematic-scroll relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
        <ParticlesBackground />
        <BackgroundEffects />

        <Navbar />
        <Hero />
        <ParticleTunnel3D />
        <SectionSeparator />
        <ProjectsCinematic />
        <SectionSeparator />
        <TechDimensionPortal />
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
