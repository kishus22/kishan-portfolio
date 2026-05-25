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
    <div className="absolute inset-0 flex items-center justify-center">
      {[300, 340, 380, 420].map((size, i) => (
        <motion.div
          key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full border border-cyan-400/30"
          style={{
            width: size,
            height: size,
            borderStyle: i === 1 ? "dashed" : "solid",
            opacity: 0.15 + i * 0.1,
          }}
        />
      ))}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/15 blur-3xl animate-pulse-glow" />
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

  const roleSequence = HERO_ROLES.flatMap((role) => [role, 2000]);

  const goProjects = () => scrollTo("#projects");

  return (
    <section
      ref={ref}
      id="home"
      className="scene-snap relative z-10 min-h-[100svh]"
    >
      <motion.div
        style={{ scale, opacity, y, rotateX, transformPerspective: 1200 }}
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-28 pb-20"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 4, duration: 1.2 }}
          className="mb-6 font-[family-name:var(--font-orbitron)] text-[10px] uppercase tracking-[0.8em] text-cyan-400/80"
        >
          — Act I — Origin Story
        </motion.div>

        <div className="grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -100, filter: "blur(16px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 4.1, duration: 1.2 }}
            className="order-2 text-center lg:order-1 lg:text-left"
          >
            <p className="mb-4 font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.5em] text-cyan-400">
              AI OPERATING SYSTEM v3.0
            </p>

            <h1 className="font-[family-name:var(--font-orbitron)] text-5xl font-black leading-[0.95] tracking-wider md:text-7xl lg:text-[5.5rem]">
              <span className="block text-white">KISHAN</span>
              <span className="movie-title-gradient">S</span>
            </h1>

            <div className="mt-6 min-h-[2.5rem] text-lg text-cyan-300 md:text-2xl">
              <TypeAnimation
                sequence={roleSequence}
                wrapper="span"
                speed={45}
                repeat={Infinity}
              />
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="group relative overflow-hidden rounded-full border-2 border-cyan-400 px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-shadow hover:shadow-[0_0_60px_rgba(0,255,255,0.5)]"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
                <span className="relative text-cyan-400 transition-colors group-hover:text-black">
                  Enter System
                </span>
              </button>
              <button
                type="button"
                data-cursor-hover
                onClick={goProjects}
                className="rounded-full border border-white/30 px-10 py-4 font-[family-name:var(--font-orbitron)] text-sm uppercase tracking-widest backdrop-blur transition hover:border-purple-400 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
              >
                Explore Projects
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.2, duration: 1.4 }}
            className="relative order-1 mx-auto flex h-[400px] w-[400px] items-center justify-center perspective-1000 lg:order-2"
          >
            <CyberRings />
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="profile-hologram relative z-10 tilt-hover"
              data-cursor-hover
            >
              <div className="relative h-60 w-60 overflow-hidden rounded-full md:h-72 md:w-72">
                <Image
                  src="/profile.png"
                  alt="Kishan S"
                  fill
                  priority
                  sizes="(max-width: 768px) 240px, 288px"
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
