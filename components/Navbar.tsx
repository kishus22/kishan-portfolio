"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { useLenisScroll } from "@/components/providers/LenisProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useLenisScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.9 }}
        className={`fixed left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 transition-all duration-500 ${
          scrolled ? "top-2" : "top-4"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-6 py-4 transition-all duration-500 ${
            scrolled
              ? "glass-panel shadow-[0_0_50px_rgba(0,255,255,0.12)]"
              : "border border-white/5 bg-black/40 backdrop-blur-xl"
          }`}
        >
          <button
            type="button"
            data-cursor-hover
            onClick={() => handleNav("#home")}
            className="font-[family-name:var(--font-orbitron)] text-lg font-bold tracking-[0.3em] text-cyan-400"
          >
            KISHAN
          </button>

          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                data-cursor-hover
                onClick={() => handleNav(link.href)}
                className="relative text-[11px] uppercase tracking-widest text-[#8BA3B8] transition-colors hover:text-cyan-400 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Menu"
            className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/20 bg-black/40"
            data-cursor-hover
            onClick={() => setOpen(!open)}
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              <span className={`absolute h-0.5 w-6 bg-cyan-400 transition-all duration-300 ${open ? "rotate-45" : "-translate-y-2"}`} />
              <span className={`absolute h-0.5 w-6 bg-cyan-400 transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-0.5 w-6 bg-cyan-400 transition-all duration-300 ${open ? "-rotate-45" : "translate-y-2"}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl md:hidden w-screen h-screen"
          >
            <div className="flex flex-col gap-8 text-center">
              {NAV_LINKS.map((link, idx) => (
                <motion.button
                  key={link.href}
                  type="button"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06, duration: 0.4 }}
                  onClick={() => handleNav(link.href)}
                  className="font-[family-name:var(--font-orbitron)] text-2xl font-black uppercase tracking-widest text-cyan-400 hover:text-white transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
