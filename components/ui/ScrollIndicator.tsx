"use client";

import { motion } from "framer-motion";

type ScrollIndicatorProps = {
  onClick?: () => void;
};

export default function ScrollIndicator({ onClick }: ScrollIndicatorProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      data-cursor-hover
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 4.8 }}
      className="group absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 border-0 bg-transparent"
    >
      <span className="font-[family-name:var(--font-orbitron)] text-[10px] uppercase tracking-[0.5em] text-gray-500 transition-colors group-hover:text-cyan-400">
        Scroll to enter system
      </span>
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex h-10 w-6 items-start justify-center rounded-full border border-cyan-400/40 p-1"
      >
        <motion.div className="h-2 w-1 rounded-full bg-cyan-400" />
      </motion.div>
    </motion.button>
  );
}
