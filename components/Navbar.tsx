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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4, duration: 0.9 }}
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
              className="relative text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-cyan-400 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-cyan-400 after:transition-all hover:after:w-full"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="md:hidden"
          data-cursor-hover
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-col gap-1.5">
            <span className="h-0.5 w-6 bg-cyan-400" />
            <span className="h-0.5 w-6 bg-cyan-400" />
            <span className="h-0.5 w-4 bg-cyan-400" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel mt-2 overflow-hidden rounded-2xl md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNav(link.href)}
                className="block w-full border-b border-white/5 px-6 py-4 text-left text-sm uppercase tracking-widest text-gray-400 last:border-0 hover:text-cyan-400"
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
