"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { HERO_ROLES } from "@/lib/constants";
import { useLenisScroll } from "@/components/providers/LenisProvider";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

function CyberRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Pulse reactor core glow behind profile image */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.25)_0%,transparent_70%)] blur-2xl md:h-80 md:w-80"
      />
      {/* Outer ring - slow rotate */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute h-[260px] w-[260px] md:h-[340px] md:w-[340px] rounded-full border border-cyan-400/20"
        style={{ borderStyle: "dashed" }}
      />
      {/* Inner ring - fast rotate opposite direction */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute h-[210px] w-[210px] md:h-[280px] md:w-[280px] rounded-full border-2 border-cyan-400/40"
      />
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useLenisScroll();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 8]);

  const goProjects = () => scrollTo("#projects");

  return (
    <section
      ref={ref}
      id="home"
      className="scene-snap relative z-10 h-[100vh] min-h-[100vh] w-full overflow-hidden"
    >
      {/* Top-left coordinate display in hero */}
      <div className="absolute top-24 left-8 hidden md:block opacity-60 font-[family-name:var(--font-fira-code)] text-[11px] text-[rgba(0,212,255,0.7)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] border border-[rgba(0,212,255,0.2)] rounded px-[10px] py-[6px] uppercase tracking-widest z-20">
        LAT 14.8° LON 74.9°
      </div>

      {/* One system status panel in hero */}
      <div className="absolute top-24 right-8 hidden md:block opacity-60 font-[family-name:var(--font-fira-code)] text-[11px] text-[rgba(0,212,255,0.7)] bg-[rgba(0,0,0,0.4)] backdrop-blur-[8px] border border-[rgba(0,212,255,0.2)] rounded px-[10px] py-[6px] uppercase tracking-widest z-20">
        AI CORE: ONLINE
      </div>

      <motion.div
        style={{ scale, opacity, y, rotateX, transformPerspective: 1200 }}
        className="relative flex h-full w-full flex-col items-center justify-center px-6"
      >
        <div className="grid w-full max-w-7xl items-center gap-10 md:gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -100, filter: "blur(16px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 2.5, duration: 1.2, ease: "easeOut" }}
            className="order-2 text-center lg:order-1 lg:text-left"
          >
            <h1 
              className="font-[family-name:var(--font-orbitron)] font-black tracking-[0.15em] text-white uppercase text-center lg:text-left leading-[1.05] [font-size:clamp(44px,8vw,68px)] lg:[font-size:clamp(64px,10vw,140px)] py-2"
              style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.25)" }}
            >
              KISHAN S
            </h1>

            <p className="mt-6 font-[family-name:var(--font-inter)] text-[16px] text-[#8BA3B8] tracking-[0.05em]">
              AI Engineer · Computer Vision · ML Developer
            </p>

            <div className="mt-10 flex flex-col md:flex-row justify-center lg:justify-start gap-4 w-full md:w-auto">
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="w-full md:w-auto px-10 py-4 rounded-full border border-cyan-400 bg-transparent font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-widest text-cyan-400 transition-all duration-200 hover:bg-cyan-400/10 hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-105 active:scale-95"
              >
                Enter System
              </button>
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="w-full md:w-auto px-10 py-4 rounded-full border border-cyan-400/40 bg-transparent font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-widest text-cyan-300/80 transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-105 active:scale-95"
              >
                Explore Projects
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.6, duration: 1.4, ease: "easeOut" }}
            className="relative order-1 mx-auto flex h-[280px] w-[280px] md:h-[400px] md:w-[400px] items-center justify-center perspective-1000 lg:order-2"
          >
            <CyberRings />
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="profile-hologram relative z-10 tilt-hover"
              data-cursor-hover
            >
              <div className="relative h-[200px] w-[200px] md:h-72 md:w-72 overflow-hidden rounded-full">
                <Image
                  src="/profile.png"
                  alt="Kishan S"
                  fill
                  priority
                  sizes="(max-width: 768px) 200px, 288px"
                  className="object-cover object-top"
                />
                <div className="profile-overlay absolute inset-0 rounded-full" />
                <div className="profile-scan absolute inset-0 rounded-full" />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/60 bg-black/90 px-5 py-1.5 font-[family-name:var(--font-orbitron)] text-[10px] uppercase tracking-[0.4em] text-cyan-400">
                Identity Verified
              </div>
            </motion.div>
          </motion.div>
        </div>

        <ScrollIndicator onClick={goProjects} />
      </motion.div>
    </section>
  );
}
