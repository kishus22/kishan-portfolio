"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HERO_TAGLINE } from "@/lib/constants";
import { useLenisScroll } from "@/components/providers/LenisProvider";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
const HeroBackground3D = dynamic(() => import("@/components/HeroBackground3D"), {
  ssr: false,
  loading: () => null,
});
const HeroFrameSequence = dynamic(() => import("@/components/HeroFrameSequence"), {
  ssr: false,
  loading: () => null,
});

function CyberRings() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.2)_0%,transparent_70%)] blur-2xl md:h-80 md:w-80" />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute hidden h-[180px] w-[180px] rounded-full border border-cyan-400/30 md:block md:h-[240px] md:w-[240px]"
      />
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useLenisScroll();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const goProjects = () => scrollTo("#projects");

  return (
    <section
      ref={ref}
      id="home"
      className="scene-snap relative flex h-[100vh] min-h-[100vh] flex-col overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Layer 1: Frame Sequence Background */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <Suspense fallback={null}>
          <HeroFrameSequence />
        </Suspense>
      </div>

      {/* Layer 2: Dark Overlay (45%) */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-black/45" />

      {/* Layer 3: Existing Glow / Particles */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <Suspense fallback={null}>
          <HeroBackground3D />
        </Suspense>
        
        {/* Left Side Cyan Light Bloom */}
        <div className="absolute left-0 top-[20%] w-[50%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.18)_0%,transparent_75%)] blur-[100px] -z-10" />

        {/* Bottom Atmospheric Ground Fog */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#020409] via-[#020409]/60 to-transparent z-[4]" />

        <div className="hero-vignette-top absolute inset-0" />
        <div className="hero-vignette-bottom absolute inset-0" />
        <div className="hero-vignette-sides absolute inset-0" />
      </div>

      {/* Layer 4: Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20"
      >
        <div className="flex w-full max-w-6xl flex-col items-center gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 2.4, duration: 0.9, ease: "easeOut" }}
            className="order-2 shrink-0 text-center lg:order-1 lg:text-left relative"
          >
            {/* Massive Volumetric Title Glow and environmental bloom */}
            <div className="absolute -inset-x-36 -inset-y-16 bg-[radial-gradient(circle,rgba(0,212,255,0.28)_0%,transparent_75%)] blur-[80px] pointer-events-none -z-10 animate-breathe-glow" />
            <div className="absolute -inset-x-20 -inset-y-10 bg-[radial-gradient(circle,rgba(168,85,247,0.18)_0%,transparent_75%)] blur-3xl pointer-events-none -z-10" />

            <h1 className="h1-cinematic text-white whitespace-nowrap">KISHAN&nbsp;S</h1>
            <p className="hero-subtitle mx-auto mt-6 max-w-xl text-center lg:mx-0 lg:text-left">
              {HERO_TAGLINE}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 md:mt-10 md:flex-row md:justify-center lg:justify-start">
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="w-full rounded-full border border-cyan-400 px-8 py-3.5 font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-widest text-cyan-400 transition-all duration-200 hover:scale-[1.03] hover:bg-cyan-400/10 hover:shadow-[0_0_28px_rgba(0,212,255,0.55)] md:w-auto md:px-10 md:py-4 md:text-sm"
              >
                Enter System
              </button>
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="w-full rounded-full border border-cyan-400/45 px-8 py-3.5 font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-widest text-cyan-300 transition-all duration-200 hover:scale-[1.03] hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] md:w-auto md:px-10 md:py-4 md:text-sm"
              >
                Explore Projects
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, duration: 1, ease: "easeOut" }}
            className="relative order-1 mx-auto flex h-[210px] w-[210px] shrink-0 items-center justify-center sm:h-[245px] sm:w-[245px] md:h-[280px] md:w-[280px] lg:order-2 lg:mx-0 lg:translate-x-8 xl:translate-x-12"
          >
            {/* Background Breathing Glow & Blending Ring (Cyan Halo & Purple Glow) */}
            <div className="absolute inset-[-40px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.36)_0%,rgba(168,85,247,0.22)_60%,transparent_100%)] blur-3xl animate-breathe-glow -z-10" />
            <div className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.45)_0%,transparent_70%)] blur-xl -z-10" />

            {/* Orbiting particles */}
            <div className="absolute inset-[-14px] pointer-events-none animate-orbit-cw z-20">
              <div className="absolute top-0 left-1/2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00d4ff]" />
            </div>
            <div className="absolute inset-[-24px] pointer-events-none animate-orbit-ccw z-20">
              <div className="absolute bottom-0 right-1/4 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]" />
            </div>

            {/* Rotating holographic rings */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/40 animate-orbit-cw p-2 -m-2 z-10" />
            <div className="absolute inset-0 rounded-full border border-double border-purple-500/35 animate-orbit-ccw p-4 -m-4 z-10" />
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20 animate-orbit-ccw p-6 -m-6 z-10" />

            <CyberRings />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="profile-hologram relative z-10"
              style={{
                boxShadow: "0 0 35px rgba(0, 212, 255, 0.45), 0 0 70px rgba(168, 85, 247, 0.25)"
              }}
            >
              <div className="relative h-[175px] w-[175px] overflow-hidden rounded-full sm:h-[190px] sm:w-[190px] md:h-56 md:w-56">
                <Image
                  src="/profile.png"
                  alt="Kishan S"
                  fill
                  priority
                  sizes="(max-width: 768px) 175px, 224px"
                  className="object-cover object-top"
                />
                <div className="profile-overlay absolute inset-0 rounded-full" />
                <div className="profile-scan absolute inset-0 rounded-full" />
                
                {/* AI vertical scan-line overlay */}
                <div className="absolute inset-0 rounded-full overflow-hidden z-20 pointer-events-none">
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent animate-profile-scanline" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <ScrollIndicator onClick={goProjects} />
      </motion.div>
    </section>
  );
}
