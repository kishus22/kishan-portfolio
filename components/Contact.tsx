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
    href: SOCIAL_LINKS.resume,
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
      className="scene-snap relative z-10 w-full min-h-[100vh] flex flex-col justify-between items-center overflow-hidden bg-black px-6"
    >
      {/* Reactor glow background */}
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.85)_0%,transparent_60%)] pointer-events-none select-none z-0"
      />

      {/* Top Label */}
      <div className="relative z-10 pt-16 text-center">
        <p className="font-[family-name:var(--font-fira-code)] text-xs font-medium uppercase tracking-[0.2em] text-cyan-400">
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
            className="block text-cyan-400 mt-4 md:mt-6 py-1"
            style={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.25)" }}
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
                className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-black/40 text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,212,255,0.6)] hover:bg-cyan-400/10"
              >
                {link.icon}
              </motion.a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Marquee and Footer */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Scrolling Marquee */}
        <div className="relative w-screen h-10 overflow-hidden bg-black/40 border-t border-b border-cyan-400/10 flex items-center">
          <div className="absolute whitespace-nowrap flex animate-[credits-drift_30s_linear_infinite]">
            <span className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.25em] text-cyan-400/20 pr-4">
              {marqueeText}
            </span>
            <span className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.25em] text-cyan-400/20 pr-4">
              {marqueeText}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full text-center pb-8 pt-8">
          <p className="font-[family-name:var(--font-fira-code)] text-xs text-white/40 tracking-wider">
            End of Transmission · KISHAN S © 2026 · All Systems Nominal
          </p>
        </div>
      </div>
    </section>
  );
}
