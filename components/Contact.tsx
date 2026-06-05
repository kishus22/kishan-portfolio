"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SOCIAL_LINKS } from "@/lib/constants";

const links = [
  { 
    label: "GitHub", 
    href: SOCIAL_LINKS.github, 
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    )
  },
  { 
    label: "LinkedIn", 
    href: SOCIAL_LINKS.linkedin,
    icon: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  { 
    label: "Email", 
    href: SOCIAL_LINKS.email,
    icon: (
      <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    )
  },
  {
    label: "Resume",
    href: "/Kishan-S-Resume.pdf",
    icon: (
      <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )
  }
];

function ContactParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      alphaSpeed: number;
    }> = [];

    const colors = ["rgba(0, 212, 255, ", "rgba(168, 85, 247, ", "rgba(0, 255, 136, "];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.03 - Math.random() * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.1 + Math.random() * 0.45,
        alphaSpeed: 0.001 + Math.random() * 0.0015,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.vx = -p.vx;
        }

        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.55 || p.alpha < 0.08) {
          p.alphaSpeed = -p.alphaSpeed;
        }

        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-[1] h-full w-full pointer-events-none opacity-[0.35]"
    />
  );
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const chars = containerRef.current?.querySelectorAll(".reveal-char");
    if (!chars || chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0.1, y: 15 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const firstLine = "LET'S BUILD".split("");
  const secondLine = "THE FUTURE".split("");
  const marqueeText = Array(20).fill("KISHAN S AI UNIVERSE · ").join("");

  return (
    <section 
      ref={containerRef}
      id="contact" 
      data-scroll-reveal
      className="scene-snap relative z-10 w-full min-h-[80vh] flex flex-col justify-between items-center overflow-hidden bg-black px-6"
    >
      {/* Drifting background particles */}
      <ContactParticles />

      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 -z-[2] grid-cyber opacity-[0.05] pointer-events-none" />

      {/* Volumetric background light streaks sweep */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 10.0,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[35%] inset-x-0 h-48 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent skew-x-12 pointer-events-none z-0"
      />

      {/* Final Reactor Glow background (multi-layered radial gradient) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-[70vw] h-[50vh] rounded-full blur-3xl pointer-events-none select-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.14) 0%, rgba(168, 85, 247, 0.07) 50%, transparent 100%)",
        }}
      />
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[50vw] h-[40vh] rounded-full blur-3xl pointer-events-none select-none z-0 bg-[radial-gradient(circle,rgba(0,212,255,0.2)_0%,transparent_60%)]"
      />

      {/* Top Label */}
      <div className="relative z-10 pt-16 text-center">
        <p className="font-[family-name:var(--font-fira-code)] text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-400">
          FINAL ACT · CLASSIFIED SIGNAL
        </p>
      </div>

      {/* Middle Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl w-full py-12">
        <h3 className="font-[family-name:var(--font-orbitron)] font-black text-center uppercase tracking-wider leading-none select-none text-[clamp(44px,7vw,110px)]">
          <span className="block text-white mb-2">
            {firstLine.map((char, index) => (
              <span key={index} className="inline-block reveal-char">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
          <span 
            className="block text-cyan-400 mt-4 md:mt-6 py-1 select-none animate-[pulse-glow_4s_ease-in-out_infinite]"
            style={{ 
              textShadow: "0 0 35px rgba(0, 212, 255, 0.85), 0 0 70px rgba(0, 212, 255, 0.4)",
              filter: "drop-shadow(0 0 25px rgba(0, 212, 255, 0.5))"
            }}
          >
            {secondLine.map((char, index) => (
              <span key={index} className="inline-block reveal-char">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </span>
        </h3>

        <p className="font-[family-name:var(--font-inter)] text-center text-sm md:text-base text-[#8BA3B8] max-w-[500px] mt-8 leading-relaxed">
          Initiate contact. Deploy intelligence. Build the next AI universe.
        </p>

        {/* 4 Icon Buttons in a Row */}
        <div className="mt-12 flex justify-center items-center gap-6">
          {links.map((link) => (
            <div key={link.label} className="relative group">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 px-3 py-1.5 bg-black/90 border border-cyan-400/40 text-cyan-300 font-mono text-[9px] uppercase tracking-widest rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(0,212,255,0.4)] z-50">
                {link.label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-cyan-400/40" />
              </div>

              {/* Glowing Circle Button */}
              <motion.a
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-14 w-14 items-center justify-center rounded-full border bg-black/40 text-cyan-400 transition-all duration-300 ${
                  link.label === "Resume"
                    ? "border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.3)] animate-pulse hover:border-[#00FF88] hover:shadow-[0_0_25px_rgba(0,255,136,0.8)] hover:bg-[#00FF88]/10"
                    : "border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] hover:bg-cyan-400/10"
                }`}
              >
                {link.icon}
              </motion.a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Marquee and Footer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Scrolling Marquee with depth mask and consistent glows */}
        <div className="relative w-screen h-10 overflow-hidden bg-black/60 border-t border-b border-cyan-400/15 flex items-center shadow-[inset_0_0_15px_rgba(0,212,255,0.05)]">
          {/* Left/Right Depth fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent z-[2] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/40 to-transparent z-[2] pointer-events-none" />
          
          <div className="absolute whitespace-nowrap flex animate-[credits-drift_30s_linear_infinite] z-[1]">
            <span 
              className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.25em] text-cyan-400/35 pr-4 select-none"
              style={{ textShadow: "0 0 10px rgba(0, 212, 255, 0.15)" }}
            >
              {marqueeText}
            </span>
            <span 
              className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.25em] text-cyan-400/35 pr-4 select-none"
              style={{ textShadow: "0 0 10px rgba(0, 212, 255, 0.15)" }}
            >
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Footer with terminal-style glow */}
        <div className="w-full text-center pb-8 pt-8 z-[2]">
          <p 
            className="font-[family-name:var(--font-fira-code)] text-[10px] sm:text-xs text-cyan-400/50 tracking-widest uppercase select-none transition-all duration-300 hover:text-cyan-300"
            style={{ textShadow: "0 0 8px rgba(0, 212, 255, 0.2)" }}
          >
            &gt; End of Transmission · KISHAN S © 2026 · All Systems Nominal
          </p>
        </div>
      </div>
    </section>
  );
}
