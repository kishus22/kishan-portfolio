"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/constants";

const links = [
  { label: "GitHub", href: SOCIAL_LINKS.github },
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin },
  { label: "Email", href: SOCIAL_LINKS.email },
  { label: "Resume", href: SOCIAL_LINKS.resume },
];

export default function Contact() {
  return (
    <section id="contact" className="scene-snap relative z-10 px-6 py-40">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
          data-cinematic
        >
          <p className="font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.6em] text-cyan-400">
            — Final Act —
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative overflow-hidden rounded-[48px] border border-cyan-400/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-12 md:p-20 shadow-[0_0_100px_rgba(0,255,255,0.12)] backdrop-blur-2xl"
          data-cinematic
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,255,0.12)_0%,transparent_50%)]" />
          <div className="animated-border absolute inset-0 rounded-[48px] opacity-40" />

          <div className="relative z-10 text-center">
            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-[family-name:var(--font-orbitron)] text-4xl font-black tracking-widest md:text-6xl lg:text-7xl"
            >
              <span className="movie-title-gradient">LET&apos;S BUILD</span>
              <br />
              <span className="text-white">THE FUTURE</span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg text-gray-400"
            >
              Initiate contact. Deploy intelligence. Build the next cinematic AI
              universe together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex flex-wrap justify-center gap-4"
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,255,255,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-full border-2 border-cyan-400/50 bg-black/40 px-8 py-4 font-[family-name:var(--font-orbitron)] text-xs uppercase tracking-[0.3em] text-cyan-400 backdrop-blur-md"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
